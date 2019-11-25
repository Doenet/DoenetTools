import CompositeComponent from './abstract/CompositeComponent';
import {replaceIncompleteProp} from './commonsugar/createprop';
import {postProcessRef, processChangesForReplacements} from './Ref';


export default class Collect extends CompositeComponent {
  static componentType = "collect";

  static alwaysContinueUpstreamUpdates = true;

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.maximumnumber = {default: undefined};
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

    let exactlyOneComponentsForString = childLogic.newLeaf({
      name: "exactlyOneComponentsForString",
      componentType: "components",
      number: 1,
    })

    let stringWithOptionalProp = childLogic.newOperator({
      name: "stringWithOptionalProp",
      propositions: [
        exactlyOneString,
        atMostOnePropForString,
        atMostOneChildnumberForString,
        exactlyOneComponentsForString,
      ],
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

    let exactlyOneComponentsForSugar = childLogic.newLeaf({
      name: "exactlyOneComponentsForSugar",
      componentType: "components",
      number: 1,
    })

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
      propositions: [
        exactlyOneIncompleteProp,
        atMostOneChildnumberForSugar,
        exactlyOneRefTargetForSugar,
        exactlyOneComponentsForSugar
      ],
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

    let exactlyOneComponents = childLogic.newLeaf({
      name: "exactlyOneComponents",
      componentType: "components",
      number: 1,
    })

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
      propositions: [
        exactlyOneRefTarget,
        atMostOneCompleteProp,
        atMostOneChildnumber,
        exactlyOneComponents,
      ]
    });

    childLogic.newOperator({
      name: "refTargetPropXorSugar",
      operator: "xor",
      propositions: [refTargetAndIncompleteProp, refTargetWithOptionalProp, stringWithOptionalProp],
      setAsBase: true,
    })

    return childLogic;
  }

  updateState(args={}) {
    if(args.init) {
      this._state.refTarget = {trackChanges: true};
      if(this._state.childnumber === undefined) {
        this._state.childnumber = {};
      }
      this._state.childnumber.trackChanges = true;

      this.state.componentClassesToCollect = [];
      this.state.collectedComponents = [];

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
      let exactlyOneRefTarget = this.childLogic.returnMatches("exactlyOneRefTarget");
      this.state.refTargetChild = this.activeChildren[exactlyOneRefTarget[0]];

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

      let exactlyOneComponents = this.childLogic.returnMatches("exactlyOneComponents");
      this.state.componentsChild = this.activeChildren[exactlyOneComponents[0]];
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
    this.state.previousCollectedComponents = [...this.state.collectedComponents];

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

    if(childrenChanged || this.state.componentTypesToCollect === undefined ||
      trackChanges.getVariableChanges({
      component: this.state.componentsChild, variable: "texts"
    })) {

      this.state.componentTypesToCollect = this.state.componentsChild.state.texts;

      this.state.componentClassesToCollect = [];
      for(let ct of this.state.componentTypesToCollect) {
        let cClass = this.allComponentClasses[ct];
        if(cClass === undefined) {
          let message = "Cannot collect component type " + ct + ". Class not found.";
          console.warn(message);
        }else {
          this.state.componentClassesToCollect.push(cClass);
        }
      }
    }

    if(this.state.componentClassesToCollect.length === 0) {
      this.serializedReplacements = [];
      return;
    }

    this.state.collectedComponents = this.collectComponentDescendants(this.state.refTarget);

    if(this.state.maximumnumber !== undefined && this.state.collectedComponents.length > this.state.maximumnumber) {
      let maxnum = Math.max(0,Math.floor(this.state.maximumnumber));
      this.state.collectedComponents = this.state.collectedComponents.slice(0,maxnum)
    }
    
    this.state.stateForCollected = [];

    // check if find target state variable from prop
    if(this.state.propChild) {

      this.state.originalCollectedComponents = [...this.state.collectedComponents];
      this.state.collectedComponents =[];
      
      delete this.unresolvedState.collectedComponents;
      delete this.unresolvedDependencies;

      for(let [index,component] of this.state.originalCollectedComponents.entries()) {

        let stateForCollected = this.state.stateForCollected[index] = {};

        let result = this.state.propChild.validateProp({
          component: component,
          standardComponentTypes: this.standardComponentTypes,
        })

        if(result.success !== true) {
          if(result.error === true) {
            let propChildState = this.state.propChild.state;
            let message = "Cannot collect prop " + propChildState.variableName;
            if(propChildState.authorProp !== undefined) {
              message += " (" + propChildState.authorProp + ")"
            }
            message += " from " + component.componentType;
            if(component.doenetAttributes.componentAlias !== undefined) {
              message += " (" + component.doenetAttributes.componentAlias + ")";
            }
            console.warn(message);
          }

          if(result.unresolved) {
            this.unresolvedState.collectedComponents = true;
            this.unresolvedDependencies = {[this.state.refTargetChild.componentName]: {props: [this.state.propChild]}};
          }
          continue;
        }

        this.state.collectedComponents.push(component);

        stateForCollected.propData = result.propData;
        stateForCollected.availableClassProperties = result.availableClassProperties;
      }
    }else {
      // no prop
      // available properties are those from replacement componentType
      // except that, if it is a composite with at least one replacement
      // we get properties from the class of the first replacement
      for(let [index,component] of this.state.collectedComponents.entries()) {

        let stateForCollected = this.state.stateForCollected[index] = {};

        let rtForProperties = component;
        while(rtForProperties instanceof this.allComponentClasses._composite) {
          if(rtForProperties.replacements.length === 0) {
            break;
          }
          rtForProperties = rtForProperties.replacements[0];
        }
        let replacementClassForProperties = this.standardComponentTypes[rtForProperties.componentType];

        stateForCollected.availableClassProperties = replacementClassForProperties.class.createPropertiesObject({
          standardComponentTypes: this.standardComponentTypes
        });
      }
    }

    for(let componentNumber in this.state.collectedComponents) {
      // add state of component for any state values that
      // correspond to properties
      this.copyPropertiesFromComponent(componentNumber);

    }

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

      this.state.downstreamDependenciesByCollected = {};

      if(this.state.refTarget !== undefined) {
        if(this.state.propChild === undefined) {
          // if didn't use a prop, then add downstream dependencies
          // to all active descendants (since recursive==true) of the collected components
          // and indicate they will be shadowed.
          // (won't recurse when descendants not shadowed because use state variables for references)
          for(let component of this.state.collectedComponents) {
            this.addReferenceDependencies({
              target: component,
              recursive: true,
              shadowed: true,
            });
          }
        }else {
          // if used prop, add downstream dependencies to ref target
          // and all collected components
          // and show that used a prop
          this.downstreamDependencies[this.state.originalRefTarget.componentName].prop = this.state.propChild.componentName;
          if(this.state.refTarget !== this.state.originalRefTarget) {
            this.addReferenceDependencies({target: this.state.refTarget});
            this.downstreamDependencies[this.state.refTarget.componentName].prop = this.state.propChild.componentName;
          }
          for(let component of this.state.collectedComponents) {
            this.addReferenceDependencies({target: component});
            this.downstreamDependencies[component.componentName].prop = this.state.propChild.componentName;
            delete this.downstreamDependencies[component.componentName].baseReference;
          }
        }
      }

    }

    if(args.init) {
      this.serializedReplacements = this.createSerializedReplacements();
    }

  }


  collectComponentDescendants(component, init=true) {

    if(component.inactive) {
      return [];
    }

    if(!init && this.state.componentClassesToCollect.some(x => component instanceof x)) {
      return [component];
    }

    let componentList = [];
    let childrenAddressed = new Set();

    if(component instanceof this.allComponentClasses['_composite']) {

      // no need to check replacements unless it is initial component,
      // as replacements will be children of parent
      if(init) {
        for(let replacement of component.replacements) {
          // don't need to check if replacement is withheld, as it will be inactive
          componentList.push(...this.collectComponentDescendants(replacement,false));
        }
      }
    }else {

      // collect children only if not a composite

      // to match order, first add activeChildren in order
      for(let child of component.activeChildren) {
        componentList.push(...this.collectComponentDescendants(child, false));
        childrenAddressed.add(child.componentName);
      }

      // next add any defining children not added, in order
      for(let child of component.definingChildren) {
        if(!childrenAddressed.has(child.componentName)) {
          componentList.push(...this.collectComponentDescendants(child, false));
          childrenAddressed.add(child.componentName);
        }
      }

      // add any children that aren't active or definining
      for(let childName in component.allChildren) {
        if(!childrenAddressed.has(childName)) {
          let child = component.allChildren[childName].component;
          componentList.push(...this.collectComponentDescendants(child, false));
        }
      }
    }

    return componentList;

  }


  // Look in collected component for property state variables.
  // If those properties haven't expectly been specified 
  // as an attribute of the <collect> tag,
  // then add those properties to the state for this source
  // Rationale: When creating the serialized replacement for the component
  // we will add these properties to the seralized replacement
  copyPropertiesFromComponent(componentNumber) {
    let stateForCollected = this.state.stateForCollected[componentNumber]
    stateForCollected.properties = {};

    for(let item in stateForCollected.availableClassProperties) {

      // don't copy prop
      if(item === "prop") {
        continue;
      }

      let propertyInCollected = this.state.collectedComponents[componentNumber]._state[item];

      // don't copy a state variable from target than isn't a property
      if(propertyInCollected !== undefined && propertyInCollected.isProperty !== true) {
        continue;
      }

      // if a property is specified by own children or via essential state variable
      // then it shouldn't be overwritten from collected component
      let propertyInCollect = this._state[item];
      if(propertyInCollect !== undefined) {
        if(propertyInCollect.essential && !propertyInCollect.usedDefault) {
          stateForCollected.properties[item] = this.state[item];
          continue;
        }
        let childLogicResult = this.childLogic.returnMatches('_property_' + item);
        if(childLogicResult !== undefined && childLogicResult.length === 1) {
          stateForCollected.properties[item] = this.state[item];
          continue;
        }
      }

      if(propertyInCollected !== undefined) {
        stateForCollected.properties[item] = propertyInCollected.value;
        // TODO: what if item is unresolved in collected component?
        // Is there a way to mark it unresolved or will that be taken care
        // of in component creation?
      }else {
        if(stateForCollected.availableClassProperties[item].default !== undefined) {
          // assign default value if available and not defined elsewhere
          stateForCollected.properties[item] = stateForCollected.availableClassProperties[item].default;
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

    let replacements = [];

    this.state.numReplacementsByCollected = [];

    for(let collectedNum=0; collectedNum < this.state.collectedComponents.length; collectedNum++) {
      if(this.state.collectedComponents[collectedNum] !== undefined) {
        let collectedReplacements = this.createReplacementForCollected(collectedNum);
        this.state.numReplacementsByCollected[collectedNum] = collectedReplacements.length;
        replacements.push(...collectedReplacements);
      }else {
        this.state.numReplacementsByCollected[collectedNum] = 0;
      }
    }

    return replacements;

  }


  createReplacementForCollected(collectedNum) {
    let stateForCollected = this.state.stateForCollected[collectedNum];
    
    let additionalDepProperties = {
      collectComponentName: this.componentName,
    }


    if(this.state.propChild !== undefined) {

      return this.state.propChild.createSerializedReplacements({
        propData: stateForCollected.propData, 
        additionalProperties: stateForCollected.properties,
        additionalDepProperties: additionalDepProperties,
      });
    }

    // if creating reference directly from the target component,
    // create a serialized copy of the entire component
    let collectedComponent = this.state.collectedComponents[collectedNum];
    let serializedCopy = collectedComponent.serialize({forReference: true});

    if(!Array.isArray(serializedCopy)) {
      serializedCopy = [serializedCopy];
    }
    
    if(serializedCopy.length === 1) {
      Object.assign(serializedCopy[0].state, stateForCollected.properties);
    }

    return postProcessRef({serializedComponents: serializedCopy, componentName: this.componentName});

  }

  calculateReplacementChanges(componentChanges) {

    // console.log("Calculating replacement changes for " + this.componentName);
    let replacementChanges = [];

    // if there are no children in location of childnumber
    // or prop doesn't currently refer to a target
    // or didn't collect any components
    // delete the replacements (if they currently exist)
    if(this.state.refTarget === undefined || this.state.collectedComponents.length===0) {
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

    // check if refTarget has changed or previously had no collected components
    if(this.state.previousRefTarget === undefined ||
      this.state.refTarget.componentName !== this.state.previousRefTarget.componentName ||
      this.state.previousCollectedComponents.length===0) {

      this.recreateAllReplacements(replacementChanges);

      return replacementChanges;
    }

    // have same ref target and there are previous and current collected components
    // attempt to match the collected components

    // initialize as having all previous components deleted and current components created
    let originOfCurrent = this.state.collectedComponents.map(_x=>({create: true}));
    let destinationOfPrevious = this.state.previousCollectedComponents.map(_x=>({delete: true}));

    let lastPrevInd = -1;
    for(let indCur = 0; indCur < this.state.collectedComponents.length; indCur++) {
      let componentName = this.state.collectedComponents[indCur].componentName;
      for(let indPrev = lastPrevInd+1; indPrev < this.state.previousCollectedComponents.length; indPrev++) {
        if(this.state.previousCollectedComponents[indPrev].componentName === componentName) {
          originOfCurrent[indCur] = {create: false, fromPrevious: indPrev};
          destinationOfPrevious[indPrev] = {delete: false, toCurrent: indCur};
          lastPrevInd = indPrev;
          break;
        }
      }
    }

    // cumulative sum: https://stackoverflow.com/a/44081700
    // include extra index so keep track of replacements in last index
    let replacementIndexByCollected = [0, ...this.state.numReplacementsByCollected];
    replacementIndexByCollected = replacementIndexByCollected.reduce(
      (a, x, i) => [...a, x + (a[i-1] || 0)], []); 

    let numDeletedSoFar = 0;
    let numIndicesDeleted = 0;
    // specify delete instructions
    for(let ind=0; ind < destinationOfPrevious.length; ind++) {
      if(destinationOfPrevious[ind].delete) {
        let numToDelete = this.state.numReplacementsByCollected[ind];
        if(numToDelete > 0) {
          let replacementInstruction = {
            changeType: "delete",
            changeTopLevelReplacements: true,
            firstReplacementInd: replacementIndexByCollected[ind-numIndicesDeleted]-numDeletedSoFar,
            numberReplacementsToDelete: numToDelete,
          }
          numDeletedSoFar += numToDelete;
          replacementChanges.push(replacementInstruction);
        }
        replacementIndexByCollected.splice(ind-numIndicesDeleted,1);
        numIndicesDeleted++;

      }
    }


    let newNumReplacementsByCollected = [];

    let numReplacementsSoFar = 0;
    
    // specify add or instructions
    // let lastReplacementInd = this.replacements.length;
    for(let collectedNum=0; collectedNum < originOfCurrent.length; collectedNum++) {
      if(originOfCurrent[collectedNum].create) {

        // create new 
        let newSerializedReplacements = this.createReplacementForCollected(collectedNum);
        let numToAdd = newSerializedReplacements.length;
        newNumReplacementsByCollected[collectedNum] = numToAdd;

        if(numToAdd > 0) {
          let replacementInstruction = {
            changeType: "add",
            changeTopLevelReplacements: true,
            firstReplacementInd: numReplacementsSoFar,
            numberReplacementsToReplace: 0,
            serializedReplacements: newSerializedReplacements,
          };


          // changesByInd[numReplacementsSoFar].push(replacementInstruction);
          replacementChanges.push(replacementInstruction);


          replacementInstruction = {
            changeType: "addDependency",
            dependencyDirection: "downstream",
            newComponentName: this.state.collectedComponents[collectedNum].componentName,
            dependencyType: "reference",
            otherAttributes: { shadowed: true }
          };
          if (this.state.propChild === undefined) {
            replacementInstruction.recurseToChildren = true;
          }
          // changesByInd[numReplacementsSoFar].push(replacementInstruction);
          replacementChanges.push(replacementInstruction);

          numReplacementsSoFar += newSerializedReplacements.length;

          replacementIndexByCollected.splice(collectedNum, 0, 0);

        }
      }else {
        // will create any earlier current at index of this replacement index
        let prevCollectedNum = originOfCurrent[collectedNum].fromPrevious;
        // lastReplacementInd = replacementIndexByCollected[prevCollectedNum];

        let prevNumReplacements = this.state.numReplacementsByCollected[prevCollectedNum];

        // if ref determined by prop
        if(this.state.propChild !== undefined) {
          let redoReplacements = false;
          let testReplacementChanges = [];
          let results;

          // don't change replacements unless
          // the number of components or their component types changed
          results = this.recreateReplacements({
            collectedNum: collectedNum,
            numReplacementsSoFar: numReplacementsSoFar,
            prevNumReplacements: prevNumReplacements,
            replacementChanges: testReplacementChanges
          });


          let changeInstruction = testReplacementChanges[testReplacementChanges.length-1];
          let newSerializedReplacements = changeInstruction.serializedReplacements;

          if(newSerializedReplacements.length !== prevNumReplacements) {
            redoReplacements = true;
          }else {
            for(let ind=0; ind < newSerializedReplacements.length; ind++) {
              if(newSerializedReplacements[ind].componentType !== 
                this.replacements[replacementIndexByCollected[collectedNum]+ind].componentType) {
                redoReplacements=true;
                break;
              }
            }
          }

          if(redoReplacements) {
            // changesByInd[numReplacementsSoFar].push(...testReplacementChanges);
            replacementChanges.push(...testReplacementChanges);

            newNumReplacementsByCollected[collectedNum] = results.numReplacements;
            numReplacementsSoFar += results.numReplacements;
          }else {
            newNumReplacementsByCollected[collectedNum] = prevNumReplacements;
            numReplacementsSoFar += prevNumReplacements;

          }

        } else {

          // ref not determined by a prop

          // filter out downstream dependencies just for this collected component
          let collecteDownstream = this.getReferenceFromCollected(
            this.state.collectedComponents[collectedNum]
          );

          // look for changes that are in downstream dependencies
          let additionalReplacementChanges = processChangesForReplacements({
            componentChanges: componentChanges,
            componentName: this.componentName,
            downstreamDependencies: collecteDownstream,
            components: this.components
          })

          // changesByInd[numReplacementsSoFar].push(...additionalReplacementChanges);
          replacementChanges.push(...additionalReplacementChanges);

          newNumReplacementsByCollected[collectedNum] = prevNumReplacements;
          numReplacementsSoFar += prevNumReplacements;

          for(let change of additionalReplacementChanges) {
            if(change.changeTopLevelReplacements) {
              if(change.changeType === "add") {
                let numReplacementsAdded = change.serializedReplacements.length - change.numberReplacementsToReplace;
                newNumReplacementsByCollected[collectedNum] += numReplacementsAdded;
                numReplacementsSoFar += numReplacementsAdded;
              }else if(change.changeType === "delete") {
                newNumReplacementsByCollected[collectedNum] -= change.numberReplacementsToDelete;
                numReplacementsSoFar -= change.numberReplacementsToDelete;
              }
            }
          }
        }
      }
    }

    // TODO: shouldn't change state variable here?
    this.state.numReplacementsByCollected = newNumReplacementsByCollected;


    return replacementChanges;

  }

  getReferenceFromCollected(component) {
    let collectedDeps = {};

    let thisDep = this.downstreamDependencies[component.componentName];
    if(thisDep === undefined) {
      return {};
    }

    collectedDeps[component.componentName] = thisDep;

    if(!(component instanceof this.allComponentClasses['_composite'])) {
      for(let child of component.definingChildren) {
        Object.assign(collectedDeps, this.getReferenceFromCollected(child));
      }
    }

    return collectedDeps;
  }

  recreateAllReplacements(replacementChanges) {
    if (this.state.previousRefTarget !== undefined) {
      if(this.state.previousRefTarget.componentName !== this.state.refTarget.componentName) {
        let replacementInstruction = {
          changeType: "moveDependency",
          dependencyDirection: "downstream",
          oldComponentName: this.state.previousRefTarget.componentName,
          newComponentName: this.state.refTarget.componentName,
          dependencyType: "reference",
          otherAttributes: { shadowed: true }
        };
        if (this.state.propChild !== undefined) {
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
      if (this.state.propChild !== undefined) {
        replacementInstruction.otherAttributes.prop = this.state.propChild.componentName;
      }
      replacementChanges.push(replacementInstruction);
    }

    let newSerializedChildren = this.createSerializedReplacements();

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: this.replacements.length,
      serializedReplacements: newSerializedChildren,
    };
    replacementChanges.push(replacementInstruction);

    for(let collectedNum=0; collectedNum < this.state.collectedComponents.length; collectedNum++) {
      replacementInstruction = {
        changeType: "addDependency",
        dependencyDirection: "downstream",
        newComponentName: this.state.collectedComponents[collectedNum].componentName,
        dependencyType: "reference",
        otherAttributes: { shadowed: true }
      };
      if(this.state.propChild === undefined) {
        replacementInstruction.recurseToChildren = true;
      } else {
        replacementInstruction.otherAttributes.prop = this.state.propChild.componentName;
      }
      replacementChanges.push(replacementInstruction);
    }

  }


  recreateReplacements({collectedNum, numReplacementsSoFar, prevNumReplacements, replacementChanges}) {
 
    let newSerializedChildren = this.createReplacementForCollected(collectedNum);

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: numReplacementsSoFar,
      numberReplacementsToReplace: prevNumReplacements,
      serializedReplacements: newSerializedChildren,
    };
    replacementChanges.push(replacementInstruction);

    return {numReplacements: newSerializedChildren.length}
  }

}
