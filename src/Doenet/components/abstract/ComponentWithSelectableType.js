import BaseComponent from './BaseComponent';

export default class ComponentWithSelectableType extends BaseComponent {
  static componentType = "_componentwithselectabletype";

  static previewSerializedComponent({serializedComponent, sharedParameters, components}) {
    if(serializedComponent.children === undefined) {
      return;
    }
    
    // so restore behavior of number operators acting as operators
    sharedParameters.defaultToPrescribedParameters = false;

    let typeInd;
    for(let [ind,child] of serializedComponent.children.entries()) {
      if(child.componentType === "type" || (
        child.createdComponent && components[child.componentName].componentType === "type"
      )) {
        typeInd = ind;
        break;
      }
    }

    let creationInstructions = [];

    if(typeInd !== undefined) {
      creationInstructions.push({createChildren: [typeInd]});
    }

    creationInstructions.push({callMethod: "setUpType"})

    return creationInstructions;

  }

  static setUpType({sharedParameters, definingChildrenSoFar, serializedComponent}) {
    let typeChild;
    for(let child of definingChildrenSoFar) {
      if(child !== undefined && child.componentType === "type") {
        typeChild = child;
        break;
      }
    }

    if(typeChild !== undefined) {
      // have a type child, so will get type from that child
      // once it is resolved
      sharedParameters.typeChild = typeChild;
    }else if(serializedComponent.state !== undefined && "type" in serializedComponent.state) {
      // type was specified directly via essential state variable
      sharedParameters.typeForSelectableType = serializedComponent.state.type;
    }

  }

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.type = {};
    return properties;
  }

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components,
      sharedParameters}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    function addType({activeChildrenMatched}) {

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
    let exactlyOneSelectedType = childLogic.newLeaf({
      name: 'exactlyOneSelectedType',
      getComponentType: getComponentType,
      comparison: 'exactly',
      number: 1,
    });

    childLogic.newOperator({
      name: "sugarXorSelectedType",
      operator: "xor",
      propositions: [anythingAsSugar, exactlyOneSelectedType],
      setAsBase: true,
    })

    return childLogic;
  }

  updateState(args={}) {
    if(args.init === true) {
      this.makePublicStateVariable({
        variableName: "value",
        componentType: "number", // placeholder until know type, below
      });
    }
    super.updateState(args);

    if(!this.childLogicSatisfied || this.unresolvedState.type) {
      this.unresolvedState.value = true;
      return;
    }

    delete this.unresolvedState.value;

    if(this.state.type === undefined) {
      this.state.type = this.sharedParameters.typeForSelectableType;
    }

    if(args.isAList) {
      // for componentList, rest is overwritten
      return;
    }

    this._state.value.componentType = this.state.type;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      let exactlyOneSelectedType = this.childLogic.returnMatches("exactlyOneSelectedType");
      this.state.valueChild = this.activeChildren[exactlyOneSelectedType];
      this.state.stateVariableForPropertyValue = this.state.valueChild.constructor.stateVariableForPropertyValue;
      if(this.state.stateVariableForPropertyValue === undefined) {
        this.state.stateVariableForPropertyValue = "value";
      }
    }

    if(childrenChanged || trackChanges.getVariableChanges({
        component: this.state.valueChild, variable: this.state.stateVariableForPropertyValue
    })) {
      this.state.value = this.state.valueChild.state[this.state.stateVariableForPropertyValue];
    }

  }
}
