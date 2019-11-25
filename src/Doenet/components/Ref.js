import CompositeComponent from './abstract/CompositeComponent';
import {replaceIncompleteProp} from './commonsugar/createprop';
import * as serializeFunctions from '../utils/serializedStateProcessing';
import { deepClone } from '../utils/deepFunctions';



export default class Ref extends CompositeComponent {
  static componentType = "ref";

  static alwaysContinueUpstreamUpdates = true;

  static createPropertiesObject({standardComponentTypes}) {
    // Allow all standard component types to be entered as a property
    // at this stage with no defaults.
    // Will check validity depending on ref target
    let properties = {};
    for(let componentType in standardComponentTypes) {
      properties[componentType] = { deleteIfUndefined: true };
    }
    // delete string and prop
    delete properties.string;
    delete properties.prop;
    delete properties.reftarget;
    delete properties.childnumber;
    delete properties.contentid;

    // delete math and number so childnumber won't get matched
    delete properties.math;
    delete properties.number;

    // delete text so contentId won't get matched
    delete properties.text;


    return properties;

  }

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let addRefTarget = function({activeChildrenMatched}) {
      // add <reftarget> around string
      return {
        success: true,
        newChildren: [{ componentType: "reftarget", children: [{
          createdComponent: true,
          componentName: activeChildrenMatched[0].componentName
        }]}],
      }
    }

    let exactlyOneString = childLogic.newLeaf({
      name: 'exactlyOneString',
      componentType: 'string',
      number: 1,
      isSugar: true,
      replacementFunction: addRefTarget,
      repeatSugar: true,
    });

    let atMostOnePropForString = childLogic.newLeaf({
      name: "atMostOnePropForString",
      componentType: 'prop',
      comparison: 'atMost',
      number: 1,
    });

    let atMostOneChildnumberForString = childLogic.newLeaf({
      name: 'atMostOneChildnumberForString',
      componentType: 'childnumber',
      comparison: 'atMost',
      number: 1,
    });

    let stringWithOptionalProp = childLogic.newOperator({
      name: "stringWithOptionalProp",
      propositions: [exactlyOneString, atMostOnePropForString,atMostOneChildnumberForString],
      operator: 'and',
    })

    let exactlyOneRefTargetForSugar = childLogic.newLeaf({
      name: 'exactlyOneRefTargetForSugar',
      componentType: 'reftarget',
      number: 1,
    });

    let atMostOneChildnumberForSugar = childLogic.newLeaf({
      name: 'atMostOneChildnumberForSugar',
      componentType: 'childnumber',
      comparison: 'atMost',
      number: 1,
    });

    let propIsIncomplete = function(child) {
      return (child.state.incomplete === true);
    }

    let exactlyOneIncompleteProp = childLogic.newLeaf({
      name: "exactlyOneIncompleteProp",
      componentType: 'prop',
      number: 1,
      condition: propIsIncomplete,
    });

    let refTargetAndIncompleteProp = childLogic.newOperator({
      name: "refTargetAndIncompleteProp",
      operator: "and",
      propositions: [exactlyOneIncompleteProp, atMostOneChildnumberForSugar, exactlyOneRefTargetForSugar],
      isSugar: true,
      replacementFunction: replaceIncompleteProp,
      separateSugarInputs: true,
    })

    let exactlyOneRefTarget = childLogic.newLeaf({
      name: 'exactlyOneRefTarget',
      componentType: 'reftarget',
      number: 1,
    });

    let atMostOneChildnumber = childLogic.newLeaf({
      name: 'atMostOneChildnumber',
      componentType: 'childnumber',
      comparison: 'atMost',
      number: 1,
    });

    let propIsComplete = function(child) {
      return (child.state.incomplete !== true);
    }

    let atMostOneCompleteProp = childLogic.newLeaf({
      name: "atMostOneCompleteProp",
      componentType: 'prop',
      comparison: 'atMost',
      number: 1,
      condition: propIsComplete,
    });

    let refTargetWithOptionalProp = childLogic.newOperator({
      name: "refTargetWithOptionalProp",
      operator: "and",
      propositions: [exactlyOneRefTarget, atMostOneCompleteProp, atMostOneChildnumber]
    });

    let refTargetPropXorSugar = childLogic.newOperator({
      name: "refTargetPropXorSugar",
      operator: "xor",
      propositions: [refTargetAndIncompleteProp, refTargetWithOptionalProp, stringWithOptionalProp],
    });

    let exactlyOneContentId = childLogic.newLeaf({
      name: "exactlyOneContentId",
      componentType: 'contentid',
      number: 1,
    });

    let atMostOneAdditionalContent = childLogic.newLeaf({
      name: "atMostOneAdditionalContent",
      componentType: 'additionalcontent',
      comparison: 'atMost',
      number: 1,
    });

    let contentIdAndAdditionalContent = childLogic.newOperator({
      name: 'contentIdAndAdditionalContent',
      operator: 'and',
      propositions: [exactlyOneContentId, atMostOneAdditionalContent]
    })

    childLogic.newOperator({
      name: "contentIdXorRefTargetProp",
      operator: "xor",
      propositions: [contentIdAndAdditionalContent, refTargetPropXorSugar],
      setAsBase: true,
    });


    return childLogic;
  }

 updateState(args={}) {

    if(args.init) { 
      this._state.refTarget = {trackChanges: true};
      if(this._state.childnumber === undefined) {
        this._state.childnumber = {};
      }
      this._state.childnumber.trackChanges = true;
      this.processNewDoenetML = this.processNewDoenetML.bind(this);
    }

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.originalRefTarget = true;
      this.unresolvedState.refTarget = true;
      this.unresolvedDependencies = true;
      this.serializedReplacements = [];
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {

      let exactlyOneContentId = this.childLogic.returnMatches("exactlyOneContentId");
      if(exactlyOneContentId.length === 1) {
        this.state.contentIdChild = this.activeChildren[exactlyOneContentId[0]];
      }else{
        delete this.state.contentIdChild;
        delete this.state.serializedContent;

        let exactlyOneRefTarget = this.childLogic.returnMatches("exactlyOneRefTarget");
        if(exactlyOneRefTarget.length === 1) {
          this.state.refTargetChild = this.activeChildren[exactlyOneRefTarget[0]];
        }else{
          delete this.state.refTargetChild;
        }
  
  
        let atMostOneChildnumber = this.childLogic.returnMatches("atMostOneChildnumber");
        if(atMostOneChildnumber.length === 1) {
          this.state.childnumberChild = this.activeChildren[atMostOneChildnumber[0]];
        }else {
          delete this.state.childnumberChild;
        }
        
        let atMostOneCompleteProp = this.childLogic.returnMatches("atMostOneCompleteProp");
        if(atMostOneCompleteProp.length === 1) {
          this.state.propChild = this.activeChildren[atMostOneCompleteProp[0]];
        }else {
          delete this.state.propChild;
        }

      }

    }

    if (this.state.contentIdChild !== undefined){
      if(this.doenetAttributes.newNamespace === undefined) {
        throw Error("Cannot ref contentId without specifying a new namespace")
      }
      if(this.state.contentIdChild.unresolvedState.value) {
        this.unresolvedState.contentId = true;
        this.serializedReplacements = [];
        this.state.serializedContent = [];
        return;
      }
      if(childrenChanged || trackChanges.getVariableChanges({
        component: this.state.contentIdChild, variable: "value"})) {
        delete this.unresolvedState.contentId;
        this.state.contentId = this.state.contentIdChild.state.value;

        // mark all propertes as being from ref itself
        for(let item in this._state) {
          let property = this._state[item];
          if(property.isProperty) {
            property.fromRefItself = true;
          }
        }

        this.allowSugarInSerializedReplacements = true;

        if(this.state.serializedStateForContentId) {
          let serializedState = JSON.parse(JSON.stringify(this.state.serializedStateForContentId));
          serializedState = serializeFunctions.scrapeOffAllDoumentRelated(serializedState);

          serializeFunctions.createComponentsFromProps(serializedState,this.standardComponentTypes);
      
          serializeFunctions.createAuthorNames({serializedState,componentTypesTakingAliases:this.componentTypesTakingAliases,allComponentClasses:this.allComponentClasses});
          
          this.componentAliasToPreserializedName(serializedState,this.componentTypesTakingAliases);
          
          serializeFunctions.gatherVariantComponents({
            serializedState,
            componentTypesCreatingVariants: this.componentTypesCreatingVariants,
            allComponentClasses: this.allComponentClasses,
          });

          this.state.serializedContent = serializedState;
          if(args.init) {
            this.serializedReplacements = this.createSerializedReplacements();
            this.state.serializedContentChanged = false;
          } else {
            this.state.serializedContentChanged = true;
          }

        } else {
          this.externalFunctions.contentIdsToDoenetMLs({contentIds:[this.state.contentId],callBack:this.processNewDoenetML})
          this.serializedReplacements = [];
          this.state.serializedContent = [];
          this.state.serializedContentChanged = false;
        }

        return;
      }

      return;
    }

    if(this.state.refTargetChild.unresolvedState.refTarget) {
      this.unresolvedState.originalRefTarget = true;
      this.unresolvedState.refTarget = true;
      this.unresolvedDependencies = {[this.state.refTargetChild.componentName]: true};
      this.state.originalRefTargetName = this.state.refTargetChild.state.refTargetName;
      this.serializedReplacements = [];
      return;
    }

    if(childrenChanged || trackChanges.getVariableChanges({
        component: this.state.refTargetChild, variable: "refTarget"})) {
      this.state.originalRefTarget = this.state.refTargetChild.state.refTarget;
      this.state.originalRefTargetName = this.state.refTargetChild.state.refTargetName;
      delete this.unresolvedState.originalRefTarget;
      delete this.unresolvedState.refTarget;
      delete this.unresolvedDependencies;


      // add original reference dependencies
      this.addReferenceDependencies({target: this.state.originalRefTarget});

    }

    this.state.previousRefTarget = this.state.refTarget;

    if(this.state.previousRefTarget !== undefined && this.state.targetInactive) {
      this.state.targetPrevInactive = true;
    }else {
      this.state.targetPrevInactive = false;
    }

    // if childnumber is specified, determine new refTarget
    // it might be undefined if childnumber is not a valid value
    if(this.state.childnumberChild) {
      if(this.state.childnumberChild.unresolvedState.number) {
        this.unresolvedState.refTarget = true;
        this.state.refTarget = undefined;
        this.serializedReplacements = [];
        return;
      }
      // don't bother checking for changes in childnumber, just set it
      this.state.childnumber = this.state.childnumberChild.state.number;
    }else if(this.state.childnumber !== undefined && !this._state.childnumber.essential) {
      delete this.state.childnumber;
    }
    
    let childnumber = this.state.childnumber;

    if(childnumber !== undefined) {
      this.state.refTarget = undefined;

      // replace refTarget with child if childnumber set
      let childIndex = childnumber-1;
      if(!Number.isInteger(childIndex) || childIndex < 0) {
        console.log("Invalid child number");
      } else if(childIndex < this.state.originalRefTarget.activeChildren.length) {
        this.state.refTarget = this.state.originalRefTarget.activeChildren[childIndex];
      }
    }else {
      this.state.refTarget = this.state.originalRefTarget;
    }

    if(this.state.refTarget === undefined) {
      this.serializedReplacements = [];
      return;
    }

    let refTarget = this.state.refTarget;

    if(refTarget.componentName === this.componentName) {
      let message = "Circular reference from " + this.componentName
      // if(this.doenetAttributes.componentAlias) {
      //   message += " (" + this.doenetAttributes.componentAlias + ")";
      // }
      message += " to itself."
      throw Error(message);
    }

    // check if find target state variable from prop
    if(this.state.propChild !== undefined) {

      // TODO: can avoid this if prop didn't change

      let result = this.state.propChild.validateProp({
        component: refTarget,
        standardComponentTypes: this.standardComponentTypes,
      })

      if(result.success !== true) {
        if(result.error === true) {
          let propChildState = this.state.propChild.state;
          let message = "Cannot reference prop " + propChildState.variableName;
          if(propChildState.authorProp !== undefined) {
            message += " (" + propChildState.authorProp + ")"
          }
          message += " from " + refTarget.componentName;
          // if(refTarget.doenetAttributes.componentAlias !== undefined) {
          //   message += " (" + refTarget.doenetAttributes.componentAlias + ")";
          // }
          this.unresolvedState.propData = true;
          this.unresolvedMessage = message;
          this.unresolvedDependencies = {[this.state.refTargetChild.componentName]: {props: [this.state.propChild]}};
        }else if(result.unresolved === true) {
          this.unresolvedState.propData = true;
          this.unresolvedDependencies = {[this.state.refTargetChild.componentName]: {props: [this.state.propChild]}};

        }

        this.state.refTarget = undefined;
        this.serializedReplacements = [];
        return;
      }

      this.state.propData = result.propData;
      delete this.unresolvedState.propData;
      delete this.unresolvedDependencies;
      this.state.availableClassProperties = result.availableClassProperties;
    }else {
      // no prop

      // if refTarget is has any unresolved state, then this ref is still unresolved
      // if(Object.keys(this.state.refTarget.unresolvedState).length > 0) {


      if(this.state.refTarget.state.unresolvedDependenceChain) {
        if(this.componentName in this.state.refTarget.state.unresolvedDependenceChain) {
          throw Error("Circular dependence involving " + this.componentName + " and " + this.state.refTarget.componentName);
        }
        if(this.state.unresolvedDependenceChain === undefined) {
          this.state.unresolvedDependenceChain = {};
        }
        this.mergeUnresolved(this.state.refTarget);

      }
      
      if(this.state.refTarget.unresolvedDependencies) {
        this.unresolvedDependencies = {[this.state.refTargetChild.componentName]: true};
        this.unresolvedState.availableClassProperties = true;
        this.state.refTarget = undefined; // so no replacements in recreateReplacements
        this.serializedReplacements = [];
        return;
      }
      
      delete this.unresolvedState.availableClassProperties;
      delete this.unresolvedDependencies;

      // available properties are those from replacement componentType
      // except that, if it is a composite with at least one replacement
      // we get properties from the class of the first replacement
      let rtForProperties = refTarget;
      while(rtForProperties instanceof this.allComponentClasses._composite) {
        if(rtForProperties.replacements.length === 0) {
          break;
        }
        // TODO: not sure if just taking the first component is the correct idea
        // because we now apply properties to all the replacements
        // Maybe have the availableClassProperties be the union of the properties
        // of all the replacement classes?
        rtForProperties = rtForProperties.replacements[0];
      }
      
      if(rtForProperties instanceof this.allComponentClasses.string) {
        // if string (which doesn't have properties), use base component
        this.state.availableClassProperties = this.allComponentClasses._base.createPropertiesObject({
          standardComponentTypes: this.standardComponentTypes
        });
      } else {
        let replacementClassForProperties = this.standardComponentTypes[rtForProperties.componentType];

        this.state.availableClassProperties = replacementClassForProperties.class.createPropertiesObject({
          standardComponentTypes: this.standardComponentTypes
        });
      }
    }

    // add state of reference target for any state values that
    // correspond to properties
    // and haven't been specified as properties on ref
    this.copyPropertiesFromRefTarget();

    this.verifyValidProperties();

    this.state.targetInactive = this.state.refTarget.inactive;

    // console.log("Resolved ref");
    // console.log(this.refTarget);

    if(trackChanges.getVariableChanges({component: this, variable: "childnumber"})) {

      // if used a childnumber, change dependency of originalRefTarget to denote childnumber
      // and add a dependency to the new refTarget
      if(this.state.childnumber !== undefined) {
        this.downstreamDependencies[this.state.originalRefTarget.componentName].childnumber = this.state.childnumber;
        if(this.state.refTarget !== undefined) {
          this.downstreamDependencies[this.state.refTarget.componentName] = {
            dependencyType: "reference",
            component: this.state.refTarget,
          }
        }
      }
    }

    if(trackChanges.getVariableChanges({component: this, variable: "refTarget"})) {

      if(this.state.refTarget !== undefined) {
        if(this.state.propChild === undefined) {
          // if didn't use a prop, then add downstream dependencies
          // to all active descendants of the refTarget
          // (unless descendants not shadowed because use state variables for references)
          // and indicate they will be shadowed.
          // This overwrites the original dependency of the refTarget itself
          this.addReferenceDependencies({
            target: this.state.refTarget,
            recursive: true,
            shadowed: true
          });
        }else {
          // change downstream dependency to show that used a prop
          this.downstreamDependencies[this.state.originalRefTarget.componentName].prop = this.state.propChild.componentName;
          if(this.state.refTarget !== this.state.originalRefTarget) {
            this.addReferenceDependencies({target: this.state.refTarget});
            this.downstreamDependencies[this.state.refTarget.componentName].prop = this.state.propChild.componentName;
          }
        }
      }

    }

    if(args.init) {
      this.serializedReplacements = this.createSerializedReplacements();
    }

  }

  processNewDoenetML({newDoenetMLs, message, success}){
    
    if (!success){
      console.warn(message);
      this.serializedReplacements = [];
      //TODO: handle failure
      return;
    }
    
    let serializedState =  serializeFunctions.doenetMLToSerializedState({doenetML: newDoenetMLs[0], standardComponentTypes:this.standardComponentTypes, allComponentClasses:this.allComponentClasses});

    serializedState = serializeFunctions.scrapeOffAllDoumentRelated(serializedState);

    serializeFunctions.createComponentsFromProps(serializedState,this.standardComponentTypes);

    serializeFunctions.createAuthorNames({serializedState,componentTypesTakingAliases:this.componentTypesTakingAliases,allComponentClasses:this.allComponentClasses});
    
    this.componentAliasToPreserializedName(serializedState,this.componentTypesTakingAliases);
    
    serializeFunctions.gatherVariantComponents({
      serializedState,
      componentTypesCreatingVariants: this.componentTypesCreatingVariants,
      allComponentClasses: this.allComponentClasses,
    });

    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: {
          serializedContent: {changes: serializedState},
          serializedContentChanged: {changes: true},
        }
      }],
      saveSerializedState: false,
    });
    
  }

  componentAliasToPreserializedName(serializedState,componentTypesTakingAliases) {
    
    for(let serializedComponent of serializedState) {
      if(serializedComponent.doenetAttributes) {
        let componentAlias = serializedComponent.doenetAttributes.componentAlias;
        if(componentAlias !== undefined) {
          serializedComponent.doenetAttributes.componentAlias = this.componentName + componentAlias;
        }
      }

      if(serializedComponent.componentType in componentTypesTakingAliases) {
        let refTargetName;
        for(let child of serializedComponent.children) {
          if(child.componentType === "string") {
            child.state.value = this.componentName + child.state.value;
            break;
          } 
        }
        serializedComponent.refTargetComponentName = refTargetName;
      }
      // recurse to children
      if(serializedComponent.children !== undefined) {
        this.componentAliasToPreserializedName(serializedComponent.children,componentTypesTakingAliases);
      }
    }
  }

  // Look in reference target for property state variables.
  // If those properties haven't expectly been specified 
  // as an attribute of the <ref> tag,
  // then add those properties to the ref's state.
  // Rationale: When creating the serialized replacement for the ref
  // we will addPropertiesFromRef, which adds these properties
  // to the seralized replacement
  copyPropertiesFromRefTarget() {
    for(let item in this.state.availableClassProperties) {

      // don't copy prop or childnumber
      if(item === "prop" || item ==="childnumber") {
        continue;
      }

      let propertyInTarget = this.state.refTarget._state[item];

      // don't copy a state variable from target than isn't a property
      if(propertyInTarget !== undefined && propertyInTarget.isProperty !== true) {
        continue;
      }

      // if a property is specified by own children or via essential state variable
      // then it shouldn't be overwritten from reference target
      let propertyInRef = this._state[item];
      if(propertyInRef !== undefined) {
        if(propertyInRef.essential) {
          propertyInRef.fromRefItself = true;
          continue;
        }
        let childLogicResult = this.childLogic.returnMatches('_property_' + item);
        if(childLogicResult !== undefined && childLogicResult.length === 1) {
          propertyInRef.fromRefItself = true;
          continue;
        }
      }

      if(propertyInTarget !== undefined) {
        if(propertyInRef === undefined) {
          propertyInRef = this._state[item] = {};
        }

        let propObj = Object.assign({}, propertyInTarget); // shallow copy
        delete propObj.essential;  // so that won't think it is a propertyInRef, above
        Object.assign(propertyInRef, propObj); // shallow copy
        
        // copy unresolved status from target
        if(this.state.refTarget.unresolvedState[item]) {
          this.unresolvedState[item] = true;
        }else {
          delete this.unresolvedState[item];
        }
      }else {
        if(this.state.availableClassProperties[item].default !== undefined) {
          // assign default value if available and not defined elsewhere
          if(propertyInRef === undefined) {
            propertyInRef = this._state[item] = {};
          }
          propertyInRef.value = this.state.availableClassProperties[item].default;
        }else {
          // if not defined as essential state or from children or no default
          // then delete the state variable
          delete this._state[item];
        }
      }
    }
  }

  // We want the <ref> tag to take on any properties of the ref target
  // so that properties of the ref target can be overwritten in the ref.
  // To allow this, the properties object created by createPropertiesObject
  // includes every component type as a possible property.
  // Now that we know what our ref target it, we will verify that any
  // properties that were specfied as attributes of the ref tag
  // are actually valid properties for that component type
  verifyValidProperties() {

    for(let item in this._state) {
      let statevar = this._state[item];

      // prop and childnumber always OK
      if(item === "prop" || item ==="childnumber") {
        continue;
      }

      if(statevar.isProperty !== true) {
        continue;
      }

      if(!(item in this.state.availableClassProperties)) {
        let message = "";
        let refTargetComponentType = this.state.refTarget.componentType;
        if(refTargetComponentType === "ref" ){
          let refTarget = this.state.refTarget
          while(refTarget.componentType === "ref") {
            if(refTarget.state.propChild !== undefined) {
              refTargetComponentType += " (via prop " + refTarget.state.propChild.state.variableName + ") ";
            }
            refTarget = refTarget.state.refTarget;
            refTargetComponentType += " of a " + refTarget.componentType;
          }
        }
        if(this.state.propChild === undefined) {
          message = "Invalid attribute " + item + " when referencing a " +  refTargetComponentType;
        }else {
          message = "Invalid attribute " + item + " when referencing prop " + this.state.propChild.state.variableName + " from a " + refTargetComponentType;
        }
        if(statevar.propertyFromRef) {
          console.warn(message);
          this.state.refTarget = undefined;
          return;
        } else {
          delete this._state[item];
        }
      }

    }

  }


  serialize(parameters = {}) {

    let useReplacements = this.state.contentIdChild || this.state.useReplacementsWhenSerialize;

    if(parameters.forReference !== true && parameters.savingJustOneComponent) {
      let oneComponentBeingSaved = parameters.savingJustOneComponent;

      if(oneComponentBeingSaved !== undefined) {
        // We're saving a single component (and its descendants).
        // If we have a ref to a component that isn't a descendant
        // of the one component, we need to serialize its replacements
        // (as a group) instead of serializing the ref to the outside component

        let originalRefTargetAncestornames = this.state.originalRefTarget.ancestors.map(x=>x.componentName);

        if(!originalRefTargetAncestornames.includes(oneComponentBeingSaved)) {
          useReplacements = true;
        }
       }
    }

    if(useReplacements) {

      // TODO: make useful comment here

      // when serializing a reference to contentId
      // serialize non-withheld replacements
      // rather than component itself
      let serializedState = [];
      let nReplacementsToSerialize = this.replacements.length;
      if(this.replacementsToWithhold !== undefined) {
        nReplacementsToSerialize -= this.replacementsToWithhold;
      }
      for(let ind = 0; ind < nReplacementsToSerialize; ind++) {
        let serializedComponent = this.replacements[ind].serialize(parameters);
        if(Array.isArray(serializedComponent)) {
          serializedState.push(...serializedComponent);
        }else {
          serializedState.push(serializedComponent);
        }
  
      }
      
      if(parameters.forReference !== true) {
        serializedState = [{
          componentType: 'group',
          children: serializedState,
          doenetAttributes: Object.assign({}, this.doenetAttributes),
        }]
      }else {
        // TODO: determine if this check is necessary
        if(serializedState.length === 1) {
          return serializedState[0]
        } else {
          return serializedState;
        }
      }

      return serializedState;


    } else {

      let serializedState = super.serialize(parameters);

      // record component name of refTarget
      serializedState.refTargetComponentName = this.state.originalRefTargetName;

      return serializedState;
    }
  }

  createSerializedReplacements() {

    let serializedCopy;

    if(this.state.serializedContent !== undefined) {
      if(this.state.serializedContent.length === 0) {
        serializedCopy = [];
      } else {
        serializedCopy = deepClone(this.state.serializedContent);

        // top level replacements need state so that can
        // add any properties specified by ref
        for(let comp of serializedCopy) {
          if(comp.state === undefined) {
            comp.state = {};
          }
        }
      }
    } else {

      if(this.state.refTarget === undefined || this.state.targetInactive) {
        return [];
      }

      // if creating reference from a prop
      // manually create the serialized state
      if(this.state.propChild !== undefined) {
        return this.refReplacementFromProp();
      }

      // if creating reference directly from the target component,
      // create a serialized copy of the entire component
      serializedCopy = this.state.refTarget.serialize({forReference: true});
    }

    if(!Array.isArray(serializedCopy)) {
      serializedCopy = [serializedCopy];
    }
    
    // console.log("refTarget");
    // console.log(this.state.refTarget);
    // console.log("serializedCopy");
    // console.log(serializedCopy);

    if(serializedCopy.length > 0) {
      for(let comp of serializedCopy) {
        this.addPropertiesFromRef({serializedCopy: comp });
      }
    }

    return postProcessRef({serializedComponents: serializedCopy, componentName: this.componentName});

  }

  refReplacementFromProp() {
    
    let additionalDepProperties = {
      refComponentName: this.componentName,
    }
    if(this.state.childnumber !== undefined) {
      additionalDepProperties.childnumber = this.state.childnumber;
    }

    // add properties that ref copied from reftarget
    let additionalProperties = {};
    for(let item in this._state) {
      if(item !== "prop" && item !== "childnumber") {
        if(this._state[item].isProperty === true) {
          additionalProperties[item] = this.state[item];
        }
      }
    }

    return this.state.propChild.createSerializedReplacements({
      propData: this.state.propData, 
      additionalProperties: additionalProperties,
      additionalDepProperties: additionalDepProperties,
    });

  }

  addPropertiesFromRef({serializedCopy, includeAllProperties=false}) {

    // overwrite properties in state from ref
    for(let item in this._state) {
      if(item !== "prop" && item !== "childnumber") {
        if(this._state[item].isProperty &&
           (this._state[item].fromRefItself || includeAllProperties)) {
          serializedCopy.state[item] = this.state[item];
          // remove a child corresponding to item, if it exists
          if(serializedCopy.children !== undefined) {
            for(let [ind, child] of serializedCopy.children.entries()) {
              if(child.componentType === item) {
                serializedCopy.children.splice(ind, 1);
              }
            }
          }
        }
      }
    }
  }


  calculateReplacementChanges(componentChanges) {

    // console.log("Calculating replacement changes for " + this.componentName);
    let replacementChanges = [];

    if(this.state.contentIdChild) {
      if(this.state.serializedContentChanged) {
        if(this.state.serializedContent.length === 0) {
          if(this.replacements.length > 0) {
            let replacementInstruction = {
              changeType: "delete",
              changeTopLevelReplacements: true,
              firstReplacementInd: 0,
              numberReplacementsToDelete: this.replacements.length,
            }
    
            replacementChanges.push(replacementInstruction);
          }
        } else {
          let serializedCopy = deepClone(this.state.serializedContent);

          // top level replacement needs any properties specified by ref
          if(serializedCopy[0].state === undefined) {
            serializedCopy[0].state = {};
          }
          this.addPropertiesFromRef({serializedCopy: serializedCopy[0], includeAllProperties: true});
          serializedCopy = postProcessRef({serializedComponents: serializedCopy, componentName: this.componentName, addShadowDependencies: false});
          let replacementInstruction = {
            changeType: "add",
            changeTopLevelReplacements: true,
            firstReplacementInd: 0,
            numberReplacementsToReplace: this.replacements.length,
            serializedReplacements: serializedCopy,
            applySugar: true,
          };
          replacementChanges.push(replacementInstruction);
        }
      }
      return replacementChanges;
    }

    // if there are no children in location of childnumber
    // or prop doesn't currently refer to a target
    // or target is inactive
    // delete the replacements (if they currently exist)
    if(this.state.refTarget === undefined || this.state.targetInactive) {
      if(this.replacements.length > 0) {
        let replacementInstruction = {
          changeType: "delete",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          numberReplacementsToDelete: this.replacements.length,
        }

        replacementChanges.push(replacementInstruction);
      }

      return replacementChanges;

    }

    // check if refTarget has changed or new active
    if(this.state.previousRefTarget === undefined ||
      this.state.refTarget.componentName !== this.state.previousRefTarget.componentName ||
      this.state.targetPrevInactive) {

      this.recreateReplacements(replacementChanges);

      return replacementChanges;
    }

    // for all references determined from ref itself
    // check if they differ from refTarget
    // If so, send instructions to change them
    // TODO: figure out what this is doing, make sure it is necessary
    // and add test to check that it works correctly
    // May need to add to collect if it is necessary
    // for(let property in this._state) {
    //   if(property === "prop" || property === "childnumber") {
    //     continue;
    //   }
    //   let propertyObj = this._state[property];
    //   for(let replacement of this.replacements) {
    //     if(propertyObj.isProperty === true &&
    //       propertyObj.value !== replacement.state[property]) {
    //       let replacementInstruction = {
    //         changeType: "updateStateVariables",
    //         component: replacement,
    //         stateChanges: {[property]: propertyObj.value}
    //       }
    //       replacementChanges.push(replacementInstruction);
    //     }
    //   }
    // }

    // if ref determined by prop
    // don't change replacements
    // unless have an array
    if(this.state.propChild !== undefined) {

      // don't change replacements unless
      // the number of components or their component types changed
      let testReplacementChanges = [];
      this.recreateReplacements(testReplacementChanges);

      let newSerializedReplacements = [];
      let redoReplacements = false;

      if(testReplacementChanges.length > 0) {
        let changeInstruction = testReplacementChanges[0];
        newSerializedReplacements = changeInstruction.serializedReplacements;
        if(newSerializedReplacements === undefined) {
          // first instruction isn't an add
          // (but a moveDependency, addDependency, or delete)
          redoReplacements = true;
        }else {

          if(newSerializedReplacements.length !== this.replacements.length) {
            redoReplacements = true;
          }else {
            for(let ind=0; ind < newSerializedReplacements.length; ind++) {
              if(newSerializedReplacements[ind].componentType !== 
                this.replacements[ind].componentType) {
                redoReplacements=true;
                break;
              }
            }
          }
        }
      }

      // check if have a version that changed
      if(!redoReplacements) {
        if(newSerializedReplacements.length > 0) {
          let firstNew = newSerializedReplacements[0];
          let firstOld = this.replacements[0];
          let newVersion;
          if(firstNew.state) {
            newVersion = firstNew.state._version;
          }
          let oldVersion = firstOld.state._version;
          if(newVersion !== oldVersion) {
            redoReplacements = true;
          }
        }
      }
      // check next level, i.e., children of replacements
      // TODO: how many levels should we check?
      // should that be a parameter of the replacement?
      // TODO: should check component type of children?
      if(!redoReplacements) {
        for(let ind=0; ind < newSerializedReplacements.length; ind++) {
          if(newSerializedReplacements[ind].children === undefined ||
              newSerializedReplacements[ind].children.length === 0) {
            if(this.replacements[ind].definingChildren !== undefined && 
                this.replacements[ind].definingChildren.length !== 0) {
              redoReplacements = true;
              break;
            }
          }else if(this.replacements[ind].definingChildren === undefined ||
              this.replacements[ind].definingChildren.length === 0) {
            redoReplacements = true;
            break;
          }else {
            if(newSerializedReplacements[ind].children.length !==
              this.replacements[ind].definingChildren.length) {
              redoReplacements = true;
              break;
            }
          }
        }
      }

      if(redoReplacements) {
        replacementChanges.push(...testReplacementChanges);
      }

      // console.log(replacementChanges);
      return replacementChanges;
    }

    // ref not determined by a prop

    // if(componentChanges.length > 1) {
    //   console.log("****** if had multiple adds or deletes, might not be putting children in right place. ******");
    // }

    // look for changes that are in downstream dependencies
    let additionalReplacementChanges = processChangesForReplacements({
      componentChanges: componentChanges,
      componentName: this.componentName,
      downstreamDependencies: this.downstreamDependencies,
      components: this.components
    })
    replacementChanges.push(...additionalReplacementChanges);

    // console.log(replacementChanges);

    return replacementChanges;
  }

  recreateReplacements(replacementChanges) {
    // give instructions to move dependency to this.state.refTarget
    if (this.state.previousRefTarget !== undefined &&
        this.state.previousRefTarget.componentName in this.downstreamDependencies) {
      if(this.state.previousRefTarget.componentName !== this.state.refTarget.componentName) {
        let replacementInstruction = {
          changeType: "moveDependency",
          dependencyDirection: "downstream",
          oldComponentName: this.state.previousRefTarget.componentName,
          newComponentName: this.state.refTarget.componentName,
          dependencyType: "reference",
          otherAttributes: { shadowed: true }
        };
        if (this.state.propChild === undefined) {
          replacementInstruction.recurseToChildren = true;
        } else {
          replacementInstruction.otherAttributes.prop = this.state.propChild.componentName;
        }
        replacementChanges.push(replacementInstruction);
      }
    }
    else {
      // since no previous refTarget, need to create new dependencies
      let replacementInstruction = {
        changeType: "addDependency",
        dependencyDirection: "downstream",
        newComponentName: this.state.refTarget.componentName,
        dependencyType: "reference",
        otherAttributes: { shadowed: true }
      };
      if (this.state.propChild === undefined) {
        replacementInstruction.recurseToChildren = true;
      } else {
        replacementInstruction.otherAttributes.prop = this.state.propChild.componentName;
      }
      replacementChanges.push(replacementInstruction);
    }

    let newSerializedChildren;
    if (this.state.propChild !== undefined) {
      newSerializedChildren = this.refReplacementFromProp();
    } else {
      newSerializedChildren = this.state.refTarget.serialize({ forReference: true });
      if(!Array.isArray(newSerializedChildren)) {
        newSerializedChildren = [newSerializedChildren];
      }

      if(newSerializedChildren.length > 0) {
        // top level replacement needs any properties specified by ref
        this.addPropertiesFromRef({serializedCopy: newSerializedChildren[0]});
        newSerializedChildren = postProcessRef({serializedComponents: newSerializedChildren, componentName: this.componentName});
      }
    }

    if(newSerializedChildren.length > 0) {
      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToReplace: this.replacements.length,
        serializedReplacements: newSerializedChildren,
      };
      replacementChanges.push(replacementInstruction);
    }else if(this.replacements.length > 0) {
      // delete all replacements, if they exist
      let replacementInstruction = {
        changeType: "delete",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToDelete: this.replacements.length,
      }

      replacementChanges.push(replacementInstruction);
    }
  }


  allowDownstreamUpdates(status) {
    // allow only inital change, which occurs in callBack from getting serialized content
    return(status.initialChange === true);
  }

  get variablesUpdatableDownstream() {
    return [
      "serializedContent", "serializedContentChanged"
    ];
  }

  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {

    stateVariableChangesToSave.serializedContent = stateVariablesToUpdate.serializedContent;
    stateVariableChangesToSave.serializedContentChanged = stateVariablesToUpdate.serializedContentChanged;

    return true;
    
  }
}


export function postProcessRef({serializedComponents, componentName, addShadowDependencies = true}) {
  // add downstream dependencies to original component
  // put internal and external references in right form

  let preserializedNamesFound = {};
  let refTargetNamesFound = {};

  postProcessRefSub({
    serializedComponents,
    preserializedNamesFound, refTargetNamesFound,
    componentName, addShadowDependencies,
  });

  for(let refTargetName in refTargetNamesFound) {

    for(let refComponent of refTargetNamesFound[refTargetName]) {
      // change state variable refTargetName to the componentName
      // in case below doesn't work (i.e., have more than 1 replacement)
      for(let child of refComponent.children) {
        if(child.componentType === "reftarget") {
          child.state.refTargetName = refTargetName;
          break;
        }
      }

    }

  }

  return serializedComponents;

}


function postProcessRefSub({serializedComponents, preserializedNamesFound,
  refTargetNamesFound, componentName, addShadowDependencies = true}) {
  // recurse through serializedComponents
  //   - to add downstream dependencies to original component
  //   - collect names and reference targets

  for(let ind in serializedComponents) {
    let component = serializedComponents[ind];

    if(component.preserializedName !== undefined) {

      preserializedNamesFound[component.preserializedName] = component;

      if(addShadowDependencies) {
        let downDep =  {
          [component.preserializedName]: {
            dependencyType: "referenceShadow",
            refComponentName: componentName,
          }
        };
        if(component.state !== undefined) {
          let stateVariables = Object.keys(component.state);
          downDep[component.preserializedName].downstreamStateVariables = stateVariables;
          downDep[component.preserializedName].upstreamStateVariables = stateVariables;
        }
        if(component.includeAnyDefiningChildren !== undefined) {
          downDep[component.preserializedName].includeAnyDefiningChildren =
            component.includeAnyDefiningChildren;
        }
        if(component.includePropertyChildren !== undefined) {
          downDep[component.preserializedName].includePropertyChildren =
            component.includePropertyChildren;
        }

        // create downstream dependency
        component.downstreamDependencies = downDep;
      }

    }

    if(component.componentType === "ref") {
      let refTargetName = component.refTargetComponentName;
      if(refTargetName === undefined) {
        // if refTargetComponentName is undefined,
        // then the ref wasn't serialized via ref's serialize function
        // e.g., directly have a serialized ref from a select
        // in this case, just find ref target by looking at component
        // (and normalizing the form to have a reftarget child at same time)
        refTargetName = normalizeSerializedRef(component);

      }
      if(refTargetNamesFound[refTargetName] === undefined) {
        refTargetNamesFound[refTargetName] = [];
      }
      refTargetNamesFound[refTargetName].push(component);
    }

    // recursion
    postProcessRefSub({
      serializedComponents: component.children,
      preserializedNamesFound,
      refTargetNamesFound,
      componentName,
      addShadowDependencies,
    });
  
  }
}


export function normalizeSerializedRef(serializedRef) {
  let refTargetName;

  // find the refTarget child
  let refTargetChild;
  for(let child of serializedRef.children) {
    if(child.componentType === "reftarget") {
      refTargetChild = child;
      break;
    }
  }
  // if no refTargetChild, then check for string child
  // which we have to do since sugar may not have been applied
  if(refTargetChild === undefined) {
    for(let childInd=0; childInd< serializedRef.children.length; childInd++) {
      let child = serializedRef.children[childInd];
      if(child.componentType==="string") {
        refTargetName = child.state.value;

        // delete the string child and create a refTarget child
        serializedRef.children[childInd] = {
          componentType: "reftarget",
          state: {refTargetName: refTargetName}
        }
      }
    }
  } else {
    // found a refTargetChild
    
    // first look to see if refTargetName is defined in state
    if(refTargetChild.state !== undefined) {
      refTargetName = refTargetChild.state.refTargetName;
    }

    // if not, look for first string child
    if(refTargetName === undefined) {
      for(let childInd=0; childInd< refTargetChild.children.length; childInd++) {
        let child = refTargetChild.children[childInd];
        if(child.componentType==="string") {
          refTargetName = child.state.value;

          // for consistency, we'll change the form of the reftarget
          // so that the refTargetName is stored in state
          // rather than child.
          // That way, we don't have to deal with cases
          // when processing the refs
          refTargetChild.children.splice(childInd,1); // delete child
          childInd--;
          if(refTargetChild.state === undefined) {
            refTargetChild.state = {};
          }
          refTargetChild.state.refTargetName = refTargetName; // store in state
        }
      }
    }
  }

  return refTargetName;
}


export function processChangesForReplacements({componentChanges, componentName,
  downstreamDependencies, components}) {
  let replacementChanges = [];

  for (let change of componentChanges) {
    let childrenToShadow = [];
    let childrenToDeleteShadows = [];
    let replacementsToShadow = [];
    let deleteShadowsofCompositeReplacements;
    let parentShadow;
    let propertyChildrenShadowed;
    let replacementIndex = 0;

    if (change.changeType === "added") {
      let parent = change.parent;
      let dep = downstreamDependencies[parent.componentName];
      if (dep === undefined) {
        continue;
      }
      if (dep.dependencyType !== "reference") {
        console.log("Found downstream dependency of " + componentName
          + " that wasn't a reference.  Ignoring.");
        continue;
      }

      // Found a reference that had children added to it.
      // Need to create new shadow of that
      // as long as isn't a child that a dependency doesn't include
      if (dep.shadowed === true) {

        // find shadow of parent
        let parentShadowDep;
        for (let dep of Object.values(parent.upstreamDependencies)) {
          if (dep.dependencyType === "referenceShadow" &&
            dep.refComponentName === componentName) {
            parentShadow = dep.component;
            parentShadowDep = dep;
            break;
          }
        }

        if(!parentShadow){
          throw Error("Something is wrong.  Couldn't find shadow of parent referenced");
        }

        // if aren't shadowing any defining children of parent
        // skip adding shadows
        if(!parentShadowDep.includeAnyDefiningChildren) {
          continue;
        }

        propertyChildrenShadowed = parentShadowDep.includePropertyChildren;
        for (let newChild of change.newChildren) {
          if (!newChild.componentIsAProperty || propertyChildrenShadowed) {
            childrenToShadow.push(newChild);
          }
        }
      }
      else {
        // if dependency isn't shadowed
        // it's an error since we've already addressed the case
        // of a childnumber being referenced
        throw Error("Something is wrong.  Dep isn't shadowed but no childnumber");
      }
    }
    else if (change.changeType === "deleted") {
      for (let parentName in change.parentsOfDeleted) {
        let dep = downstreamDependencies[parentName];
        if (dep === undefined) {
          continue;
        }
        if (dep.dependencyType !== "reference") {
          console.log("Found downstream dependency of " + componentName
            + " that wasn't a reference.  Ignoring.");
          continue;
        }

        let parentObj = change.parentsOfDeleted[parentName];
        if (dep.shadowed === true) {
          for (var name of parentObj.definingChildrenNames) {
            childrenToDeleteShadows.push(components[name]);
          }
        }
        else {
          // if dependency isn't shadowed
          // it's an error since we've already addressed the case
          // of a childnumber being referenced
          throw Error("Something is wrong.  Dep isn't shadowed but no childnumber");
        }
      }
    }
    else if (change.changeType === "addedReplacements") {
      let composite = change.composite;
      let dep = downstreamDependencies[composite.componentName];
      if (dep === undefined || dep.dependencyType !== "reference") {
        continue;
      }

      // Found a reference that had replacements changed
      // Need to create new shadow of that
      if (dep.shadowed === true) {
        // attempt to find shadow of parent

        let result = findParentShadowOrBaseTarget({
          thisComponentName: componentName,
          component: change.newReplacements[0],
          thisDownstreamDependencies:downstreamDependencies,
          topLevel: change.topLevel
        });

        parentShadow = result.parentShadow;
        replacementIndex = result.replacementIndex;

        if(parentShadow) {

          // if don't aren't shadowing any defining children of parent
          // skip adding shadows
          if(!result.parentShadowDep.includeAnyDefiningChildren) {
            continue;
          }

          propertyChildrenShadowed = result.parentShadowDep.includePropertyChildren;

          // Found a reference that had children added to it.
          // Need to create new shadow of that
          // as long as isn't a child that a dependency doesn't include
          for (let newReplacement of change.newReplacements) {
            if (!newReplacement.componentIsAProperty || propertyChildrenShadowed) {
              replacementsToShadow.push(newReplacement);
            }
          }
        }else if(result.foundBaseTarget){
          for (let newReplacement of change.newReplacements) {
            replacementsToShadow.push(newReplacement);
          }
        }
      }else {
        // if dependency isn't shadowed
        // it's an error since we've already addressed the case
        // of a childnumber being referenced
        throw Error("Something is wrong.  Dep isn't shadowed but no childnumber");
      }
    }
    else if (change.changeType === "deletedReplacements") {
      let composite = change.composite;
      let dep = downstreamDependencies[composite.componentName];
      if (dep === undefined || dep.dependencyType !== "reference") {
        continue;
      }
      // Found a reference that had replacements changed
      // Need to create new shadow of that
      if (dep.shadowed === true) {
        if (change.topLevel === true) {
          let deletedComponents = [];
          for (let compName in change.deletedComponents) {
            deletedComponents.push(change.deletedComponents[compName]);
          }

          deleteShadowsofCompositeReplacements = {
            composite: composite,
            deletedComponents: deletedComponents,
          }
        }
        else {
          for (let compName in change.deletedComponents) {
            childrenToDeleteShadows.push(change.deletedComponents[compName]);
          }
        }
      }
      else {
        // if dependency isn't shadowed
        // it's an error since we've already addressed the case
        // of a childnumber being referenced
        throw Error("Something is wrong.  Dep isn't shadowed but no childnumber");
      }
    }

    if (childrenToShadow.length > 0) {

      // add reference dependency for each child
      for(let comp of childrenToShadow) {

        let replacementInstruction = {
          changeType: "addDependency",
          dependencyDirection: "downstream",
          newComponentName: comp.componentName,
          dependencyType: "reference",
          otherAttributes: { shadowed: true },
          recurseToChildren: true,
        };
        
        replacementChanges.push(replacementInstruction);

      }
      
      let newSerializedChildren = childrenToShadow.map(x => x.serialize({ forReference: true }));
      // flatten array
      newSerializedChildren = newSerializedChildren.reduce((a,c) => Array.isArray(c) ? [...a, ...c] : [...a,c], [])

      if(newSerializedChildren.length === 0) {
        continue;
      }

      newSerializedChildren = postProcessRef({serializedComponents: newSerializedChildren, componentName});
      let replacementInstruction = {
        changeType: "add",
        parent: parentShadow,
        indexOfDefiningChildren: change.indexOfDefiningChildren,
        serializedReplacements: newSerializedChildren,
      };
      replacementChanges.push(replacementInstruction);
    }

    if (childrenToDeleteShadows.length > 0) {
      let componentsToDelete = [];
      // find shadows of each child
      for (let child of childrenToDeleteShadows) {
        for (let dep of Object.values(child.upstreamDependencies)) {
          if (dep.dependencyType === "referenceShadow" &&
            dep.refComponentName === componentName) {
            componentsToDelete.push(dep.component);
            break;
          }
        }
      }
      if(componentsToDelete.length > 0) {
        let replacementInstruction = {
          changeType: "delete",
          components: componentsToDelete,
        };
        replacementChanges.push(replacementInstruction);
      }
    }

    if (replacementsToShadow.length > 0) {

      // add reference dependency for each replacement
      for(let comp of replacementsToShadow) {

        let replacementInstruction = {
          changeType: "addDependency",
          dependencyDirection: "downstream",
          newComponentName: comp.componentName,
          dependencyType: "reference",
          otherAttributes: { shadowed: true },
          recurseToChildren: true,
        };
        
        replacementChanges.push(replacementInstruction);

      }

      let newSerializedChildren = replacementsToShadow.map(x => x.serialize({ forReference: true }));
      // flatten array
      newSerializedChildren = newSerializedChildren.reduce((a,c) => Array.isArray(c) ? [...a, ...c] : [...a,c], [])

      if(newSerializedChildren.length === 0) {
        continue;
      }

      newSerializedChildren = postProcessRef({serializedComponents: newSerializedChildren, componentName});

      // check if parent of replacements is being shadowed

      if (parentShadow === undefined) {

        // if parent isn't being shadowed, we must have a top level replacement
        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: replacementIndex + change.firstIndex,
          numberReplacementsToReplace: change.numberDeleted,
          serializedReplacements: newSerializedChildren,
        };
        replacementChanges.push(replacementInstruction);
      }
      else {
        // if parent is being shadowed, then add to shadowed parent
        // check if replacemenreplacementParent.allChildren[originalComposite.componentName].definingChildrenIndextsToShadow is a defining child of parent
        let replacementParent = replacementsToShadow[0].parent;

        let definingIndex = replacementParent.allChildren[replacementsToShadow[0].componentName].definingChildrenIndex;
        // if defining index is undefined,
        // then check if replacementsToShadow is a replacement of a composite
        // that is a defining child of parent
        if (definingIndex !== undefined) {
          // TODO: Need to adjust definingIndex with determineEffectiveSize(definingChild)
          // (as is done below in case when foundNewComposite)
          // since some of the previous defining children might be composites that are expanded.
          // Should find doenetML that triggers this case first, so can create a test.

          // If propertyChildrenShadowed is false, shadow may have fewer children than original.
          // definingIndex for shadow must be reduced if any of the previous children
          // were propertyChildren
          if(propertyChildrenShadowed) {
            let numPreviousPropertyChildren = 0;
            for(let ind = 0; ind < definingIndex; ind++) {
              if(replacementParent.definingChildren[ind].componentIsAProperty) {
                numPreviousPropertyChildren++;
              }
            }
            definingIndex -= numPreviousPropertyChildren;
          }

        } else {
          // find composite for which replacementsToShadow is replacement
          let comp = replacementsToShadow[0];
          let foundNewComposite = true;
          while(foundNewComposite && definingIndex === undefined) {
            foundNewComposite = false;
            for (let dep of Object.values(comp.downstreamDependencies)) {
              if (dep.dependencyType === "replacement" && dep.topLevel) {
                // find which effective replacement we are
                let numReplacementsSoFar = 0;
                for(let rep of dep.component.replacements) {
                  if(comp.componentName === rep.componentName) {
                    replacementIndex += numReplacementsSoFar;
                    break;
                  }else {
                    numReplacementsSoFar += determineEffectiveSize(rep);
                  }
                }
                foundNewComposite = true;
                comp = dep.component;
                definingIndex = replacementParent.allChildren[comp.componentName].definingChildrenIndex;
                if(definingIndex !== undefined) {
                  // for each of the defining children before this
                  // count replacements
                  let effectiveDefiningIndex = 0;
                  for(let ind =0; ind < definingIndex; ind++) {
                    let definingChild = replacementParent.definingChildren[ind];
                    if(propertyChildrenShadowed || !definingChild.componentIsAProperty) {
                      effectiveDefiningIndex += determineEffectiveSize(definingChild);
                    }
                  }

                  definingIndex = effectiveDefiningIndex + replacementIndex;
                }
                break;
              }
            }
          }
          // console.log(originalComposite.componentName);
          // console.log(replacementParent.componentName);
          // if (originalComposite !== undefined) {
          //   console.log(replacementParent.allChildren[originalComposite.componentName].definingChildrenIndex)
          //   definingIndex = replacementParent.allChildren[originalComposite.componentName].definingChildrenIndex + change.firstIndex;
          // }
        }
        if (definingIndex === undefined) {
          // TODO: check out more cases
          // TODO: adapters?
          throw Error("Still need to work on determining replacement changes")
        }
        let replacementInstruction = {
          changeType: "add",
          parent: parentShadow,
          indexOfDefiningChildren: definingIndex,
          serializedReplacements: newSerializedChildren,
        };
        replacementChanges.push(replacementInstruction);
      }
    }

    if (deleteShadowsofCompositeReplacements !== undefined) {
      // attempt to find shadow of composite's parent
      // check if parent of replacements is being shadowed

      let result = findParentShadowOrBaseTarget({
        thisComponentName: componentName,
        component: deleteShadowsofCompositeReplacements.composite,
        thisDownstreamDependencies:downstreamDependencies,
        topLevel: true,
      });

      parentShadow = result.parentShadow;

      if (result.foundBaseTarget) {

        // we have a top level replacement
        let replacementInstruction = {
          changeType: "delete",
          changeTopLevelReplacements: true,
          firstReplacementInd: change.firstIndex,
          numberReplacementsToDelete: change.numberDeleted,
        };
        replacementChanges.push(replacementInstruction);

      } else if(parentShadow) {

        let componentsToDelete = [];

        let findShadowToDelete = function(child, deleteList) {
          let foundShadow = false;
          for (let dep of Object.values(child.upstreamDependencies)) {
            if (dep.dependencyType === "referenceShadow" &&
              dep.refComponentName === componentName) {
                deleteList.push(dep.component);
              break;
            }
          }
          if(!foundShadow && child.replacements !== undefined) {
            for(let repl of child.replacements) {
              findShadowToDelete(repl, deleteList);
            }
          }
        }

        // find shadows of each deleted component
        for (let child of deleteShadowsofCompositeReplacements.deletedComponents) {
          findShadowToDelete(child, componentsToDelete);
        }

        let replacementInstruction = {
          changeType: "delete",
          components: componentsToDelete,
        };
        replacementChanges.push(replacementInstruction);
        
      }
    }
  }

  // console.log(replacementChanges)
  return replacementChanges;
}


function findParentShadowOrBaseTarget({thisComponentName, component,
    thisDownstreamDependencies, topLevel }) {
  let componentParent = component.parent;
  let parentShadowDep, parentShadow;
  let replacementIndex = 0;
  for (let dep of Object.values(componentParent.upstreamDependencies)) {
    if (dep.dependencyType === "referenceShadow" &&
      dep.refComponentName === thisComponentName) {
      parentShadow = dep.component;
      parentShadowDep = dep;
      break;
    }
  }

  if(parentShadow) {
    return {
      parentShadow: parentShadow,
      parentShadowDep: parentShadowDep,
      replacementIndex: replacementIndex,
    }
  }

  if(!topLevel) {
    return {}
  }

  // if don't have parentShadow but it is a topLevel replacement
  // check if is top level replacement of baseTarget
  // or can get to baseTarget by just going through topLevel replacements
  // as in this case, it wouldn't have a shadowed parent
  // but would become of a topLevel replacement of this ref

  let stillTopLevel = true;
  let foundBaseTarget = false;
  let comp = component;
  while(stillTopLevel && !foundBaseTarget) {
    let thisDep = thisDownstreamDependencies[comp.componentName];
    if(thisDep && thisDep.dependencyType === "reference" && thisDep.baseReference) {
      foundBaseTarget = true;
      break;
    }

    stillTopLevel = false;
    for (let dep of Object.values(comp.downstreamDependencies)) {
      if (dep.dependencyType === "replacement" && dep.topLevel) {
        stillTopLevel = true;
        // find which effective replacement we are
        let numReplacementsSoFar = 0;
        for(let rep of dep.component.replacements) {
          if(comp.componentName === rep.componentName) {
            replacementIndex += numReplacementsSoFar;
            break;
          }else {
            numReplacementsSoFar += determineEffectiveSize(rep);
          }
        }
        comp = dep.component;
      }
    }
  }
  if(foundBaseTarget) {
    return {
      foundBaseTarget: true,
      replacementIndex: replacementIndex,
    }
  }


  // check again for shadow of parent, but this time using
  // parent of the last composite found
  componentParent =comp.parent;

  for (let dep of Object.values(componentParent.upstreamDependencies)) {
    if (dep.dependencyType === "referenceShadow" &&
      dep.refComponentName === thisComponentName) {
      parentShadow = dep.component;
      parentShadowDep = dep;
      break;
    }
  }

  if(parentShadow) {
    return {
      parentShadow: parentShadow,
      parentShadowDep: parentShadowDep,
      replacementIndex: replacementIndex,
    }
  }

  return {};

}

function determineEffectiveSize(component) {
  if(!component.replacements) {
    return 1;
  }
  let replacementsSoFar = 0;
  for(let rep of component.replacements) {
    replacementsSoFar += determineEffectiveSize(rep);
  }
  return replacementsSoFar;

}