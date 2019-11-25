import BaseComponent from './abstract/BaseComponent';

export default class Prop extends BaseComponent {
  static componentType = "prop";

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1,
    });

    let atMostOneVariableName = childLogic.newLeaf({
      name: "atMostOneVariableName",
      componentType: 'variablename',
      comparison: "atMost",
      number: 1,
    });

    let atMostOneAuthorProp = childLogic.newLeaf({
      name: "atMostOneAuthorProp",
      componentType: 'authorprop',
      comparison: 'atMost',
      number: 1,
    });

    let atLeastZeroOther = childLogic.newLeaf({
      name: "atLeastZeroOther",
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
    });

    let variableNamePlus = childLogic.newOperator({
      name: "variableNamePlus",
      operator: 'and',
      propositions: [atMostOneVariableName, atMostOneAuthorProp, atLeastZeroOther],
    });

    childLogic.newOperator({
      name: "textXorVariable",
      operator: 'xor',
      propositions: [exactlyOneString, variableNamePlus],
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args={}) {
    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.authorProp = true;
      this.unresolvedState.variableName = true;
      this.unresolvedState.incomplete = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {

      // flag it incomplete if there is exactlyOneString instead of variableName
      let exactlyOneString = this.childLogic.returnMatches("exactlyOneString");
      if(exactlyOneString.length === 1) {
        this.state.stringChild = this.activeChildren[exactlyOneString[0]];
        this.state.authorProp = this.state.stringChild.state.value;
        this.state.incomplete = true;
        return;
      }

      this.state.incomplete = false;

      let atMostOneVariableName = this.childLogic.returnMatches("atMostOneVariableName");
      if(atMostOneVariableName.length === 1) {
        this.state.variableNameChild = this.activeChildren[atMostOneVariableName[0]];
      }else {
        if(this._state.variableName === undefined || this._state.variableName.essential !== true) {
          throw Error("Must specify variable name of prop via string, child, or value");
        }
        delete this.state.variableNameChild;
      }

      let atMostOneAuthorProp = this.childLogic.returnMatches("atMostOneAuthorProp");
      if(atMostOneAuthorProp.length === 1) {
        this.state.authorPropChild = this.activeChildren[atMostOneAuthorProp[0]];
      }else {
        delete this.state.authorPropChild;
      }

      let atLeastZeroOther = this.childLogic.returnMatches("atLeastZeroOther");
      if(atLeastZeroOther.length > 0) {
        this.state.otherChildren = atLeastZeroOther.map(x => this.activeChildren[x]);
      }else {
        delete this.state.otherChildren;
      }
    }

    if(this.state.variableNameChild) {
      if(this.state.variableNameChild.unresolvedState.value) {
        this.unresolvedState.variableName = true;
      }else if(childrenChanged || trackChanges.getVariableChanges({
          component: this.state.variableNameChild, variable: "value"})) {
        this.state.variableName = this.state.variableNameChild.state.value.toLowerCase();
        delete this.unresolvedState.variableName;
      }
    }

    if(this.state.authorPropChild) {
      if(this.state.authorPropChild.unresolvedState.value) {
        this.unresolvedState.authorProp = true;
      }else if(childrenChanged || trackChanges.getVariableChanges({
          component: this.state.authorPropChild, variable: "value"})) {
        this.state.authorProp = this.state.authorPropChild.state.value;
        delete this.unresolvedState.authorProp;
      }
    }

  }


  validateProp({component, standardComponentTypes}) {

    // replace refs and extacts with replacement, if have only one replacement
    while((component.componentType === "ref" || component.componentType === "extract") && 
        component.replacements.length === 1) {
      component = component.replacements[0];
    }

    // special case for childnumber, as it isn't a state variable
    if(this.state.variableName === "childnumber") {
      if(component.ancestors === undefined || component.ancestors.length === 0) {
        return {success: false, unresolved: true};
      }
      let propData = {
        componentType: "number",
        componentName: component.componentName,
      }
    
      let availableClassProperties = this.allComponentClasses.number.createPropertiesObject({
        standardComponentTypes: standardComponentTypes
      });

      return {
        success: true,
        propData: propData,
        availableClassProperties: availableClassProperties,
      }
    }

    if(component.unresolvedState[this.state.variableName] === true) {
      return {success: false, unresolved: true}
    }

    let propStateVariable = component._state[this.state.variableName];
    
    let availableClassProperties = {};
  
    let numReplacements = 1;

    let componentType;
  
    // check if there is a valid target state variable
    if(propStateVariable === undefined ||
      propStateVariable.public !== true
    ) {
      return {success: false, error: true};
    }

    if(propStateVariable.isArray !== true) {
      componentType = propStateVariable.componentType;


    } else {
      
      let results = propStateVariable.validateParameters(this.state.otherChildren);

      if(results.success !== true) {
        return {success: false, error: true};
      }

      numReplacements = results.numReplacements;

      if(numReplacements === 0) {
        return {success: false};
      }

      if(numReplacements === 1) {
        componentType = results.componentType;
      }

    }

    // verify componentType only in case that have one replacement component
    if(numReplacements === 1) {
      // see if can set replacement component type to match
      let replacementClass = standardComponentTypes[componentType];
      if(replacementClass === undefined) {
        return {success: false, error: true};
      }
      // available properties are those from replacement componentType
      availableClassProperties = replacementClass.class.createPropertiesObject({
        standardComponentTypes: standardComponentTypes
      });
    }
  
    let propData = {
      stateVariable: propStateVariable,
      componentType: componentType,
      componentName: component.componentName,
    }
  
    return {
      success: true,
      propData: propData,
      availableClassProperties: availableClassProperties,
    }
  
  }

  createSerializedReplacements({propData, additionalProperties, additionalDepProperties}) {


    // special case for childnumber, as it isn't a state variable
    if(this.state.variableName === "childnumber") {
      // find child number from parent
      let component = this.components[propData.componentName];
      let parent = component.ancestors[0];

      let activeIndex = parent.allChildren[propData.componentName].activeChildrenIndex;

      if(activeIndex === undefined) {
        return [];
      }

      let downDep =  {
        dependencyType: "referenceShadow",
        prop: this.componentName,
        downstreamStateVariables: [{childnumberOf: propData.componentName}],
        upstreamStateVariables: ["value"],
      }
    
      if(additionalDepProperties !== undefined) {
        Object.assign(downDep, additionalDepProperties);
      }
  
      return [{
        componentType: propData.componentType,
        state: {
          ["value"]: activeIndex + 1,
        },
        downstreamDependencies: {
          [parent.componentName]: downDep,
        },
      }];
    }

    
    let propStateVariable = propData.stateVariable;

    let stateVariableForRef = "value";
    if(propStateVariable.stateVariableForRef !== undefined) {
      stateVariableForRef = propStateVariable.stateVariableForRef;
    }

    let newComponents;

    if(propStateVariable.isArray !== true) {
      let downDep =  {
        dependencyType: "referenceShadow",
        prop: this.componentName,
        downstreamStateVariables: [this.state.variableName],
        upstreamStateVariables: [stateVariableForRef],
      }
    
      if(additionalDepProperties !== undefined) {
        Object.assign(downDep, additionalDepProperties);
      }
  
      if(propStateVariable.value === undefined) {
        newComponents = [];
      } else {
        newComponents = [{
          componentType: propData.componentType,
          state: {
            [stateVariableForRef]: propStateVariable.value
          },
          downstreamDependencies: {
            [propData.componentName]: downDep,
          },
        }]
      }
    } else {
      // state variable is an array

      newComponents = propStateVariable.returnSerializedComponents({
        propChildren: this.state.otherChildren,
        additionalDepProperties: additionalDepProperties,
        propName: this.componentName,
      });
    }

    if(newComponents.length === 1) {
      if(newComponents[0].state === undefined) {
        newComponents[0].state = {};
      }
    
      // add any additional properties, as long as aren't already in newComponents[0].state
      for(let item in additionalProperties) {
        if(!(item in newComponents[0].state)) {
          newComponents[0].state[item] = additionalProperties[item];
        }
      }
    
      // add any additional properties from propStateVariable
      if(propStateVariable.additionalProperties !== undefined && !Array.isArray(propStateVariable.additionalProperties)) {
        Object.assign(newComponents[0].state, propStateVariable.additionalProperties)
      }
    }

    if(propStateVariable.version !== undefined) {
      // since prop state variable includes a version
      // add a _version state variable to the first component
      if(newComponents.length >= 1) {
        if(newComponents[0].state === undefined) {
          newComponents[0].state = {};
        }
        newComponents[0].state._version = propStateVariable.version;
      }
    }
  
    return newComponents;
    
  }


}