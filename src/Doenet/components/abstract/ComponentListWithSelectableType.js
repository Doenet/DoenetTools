import ComponentWithSelectableType from './ComponentWithSelectableType';

export default class ComponentListWithSelectableType extends ComponentWithSelectableType {
  static componentType = "_componentlistwithselectabletype";

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components,
      sharedParameters}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.deleteAllLogic();

    function breakIntoTypesByCommas({activeChildrenMatched}) {
      let stringChild = activeChildrenMatched[0];
      let stringPieces = stringChild.state.value.split(",").map(s =>s.trim());
     
      let typeChild = sharedParameters.typeChild;
      if(typeChild !== undefined) {
        if(typeChild.unresolvedState.value) {
          // make type "" so exactlyOneSelectedType child logic leaf will fail
          sharedParameters.typeForSelectableType = undefined;
          return {success: false}
        }else {
          sharedParameters.typeForSelectableType = typeChild.state.value;
        }
      }else if(!sharedParameters.typeForSelectableType) {
        if(stringPieces.every(s =>/^[a-zA-Z]+$/.test(s))) {
          sharedParameters.typeForSelectableType = "letters";
        }else if(stringPieces.every(s =>Number.isFinite(Number(s)))) {
          sharedParameters.typeForSelectableType = "number";
        }else {
          sharedParameters.typeForSelectableType = "text";
        }
      }

      let newType = sharedParameters.typeForSelectableType;

      if(!(newType in standardComponentTypes)) {
        // if didn't get a valid type, sugar fails
        return {success: false}
      }
 
      let newChildren = stringPieces.map(x=> ({
        componentType: newType,
        children: [{
          componentType: "string",
          state: {value: x.trim()}
        }]
      }));

      return {
        success: true,
        newChildren: newChildren,
        toDelete: [stringChild.componentName],
      }
    }

    let exactlyOneString = childLogic.newLeaf({
      name: 'exactlyOneString',
      componentType: 'string',
      number: 1,
      isSugar: true,
      replacementFunction: breakIntoTypesByCommas,
    });

    function addType({activeChildrenMatched, sharedParameters}) {

      let typeChild = sharedParameters.typeChild;
      if(typeChild !== undefined) {
        if(typeChild.unresolvedState.value) {
          // make type "" so exactlyOneSelectedType child logic leaf will fail
          sharedParameters.typeForSelectableType = undefined;
          return {success: false}
        }else {
          sharedParameters.typeForSelectableType = typeChild.state.value;
        }
      }else if(!sharedParameters.typeForSelectableType) {
        if(activeChildrenMatched.length === 1) {
          let child = activeChildrenMatched[0];
          if(child.componentType === "string") {
            let s = child.state.value.trim();
            if(/^[a-zA-Z]+$/.test(s)) {
              sharedParameters.typeForSelectableType = "letters";
            }else if(Number.isFinite(Number(s))) {
              sharedParameters.typeForSelectableType = "number";
            }else {
              sharedParameters.typeForSelectableType = "text";
            }
          }else {
            // set typeForSelectableType so exactlyOneSelectedType child logic leaf
            // will be matched by exactlyOneSelectedType
            sharedParameters.typeForSelectableType = child.componentType;
          }
        }else {
          // have more than one child, but don't know what type to create
          return {success: false}
        }
      }

      let newType = sharedParameters.typeForSelectableType;

      // if already have a single child of the correct type, don't match sugar
      // the one child will be matched by 
      if(activeChildrenMatched.length === 1 && activeChildrenMatched[0].componentType === newType) {
        return {success: false}
      }

      if(!(newType in standardComponentTypes)) {
        // if didn't get a valid type, sugar fails
        return {success: false}
      }

      let typeChildren = [];
      for(let child of activeChildrenMatched) {
        typeChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }

      return {
        success: true,
        newChildren: [{ componentType: newType, children: typeChildren }],
      }
    }

    let anythingAsSugar = childLogic.newLeaf({
      name: 'anythingAsSugar',
      componentType: '_base',
      comparison: 'atLeast',
      number: 1,
      isSugar: true,
      replacementFunction: addType,
    });

    let getComponentType = function () {
      let selectedType;
      if(sharedParameters !== undefined) {
        selectedType = sharedParameters.typeForSelectableType;
      }
      if(selectedType === undefined) {
        selectedType = "";
      }
      return selectedType;
    }
    let anyOfSelectedType = childLogic.newLeaf({
      name: 'anyOfSelectedType',
      getComponentType: getComponentType,
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "sugarXorNot",
      operator: "xor",
      propositions: [exactlyOneString, anythingAsSugar, anyOfSelectedType],
      setAsBase: true,
    })

    return childLogic;
  }

  updateState(args={}) {
    if(args.init === true) {
      this.makePublicStateVariableArray({
        variableName: "values",
        componentType: "number", // placeholder until know type, below
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "value",
        arrayVariableName: "values",
      });
    }

    args.isAList = true;
    super.updateState(args);

    if(!this.childLogicSatisfied || this.unresolvedState.type) {
      this.unresolvedState.values = true;
      delete this.unresolvedState.value; // from ComponentWithSelectableType
      return;
    }

    delete this.unresolvedState.values;

    this._state.values.componentType = this.state.type;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      let anyOfSelectedType = this.childLogic.returnMatches("anyOfSelectedType");
      this.state.valueChildren = anyOfSelectedType.map(x=>this.activeChildren[x]);
      if(this.state.valueChildren.length > 0) {
        this.state.stateVariableForPropertyValue = this.state.valueChildren[0].constructor.stateVariableForPropertyValue;
        if(this.state.stateVariableForPropertyValue === undefined) {
          this.state.stateVariableForPropertyValue = "value";
        }
      }
    }

    if(childrenChanged || this.state.valueChildren.some(
      x=> trackChanges.getVariableChanges({
        component: x, variable: this.state.stateVariableForPropertyValue
    }))) {
      this.state.values = this.state.valueChildren.map(x=> x.state[this.state.stateVariableForPropertyValue]);
    }

  }
}
