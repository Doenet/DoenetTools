import ComponentWithSelectableType from './ComponentWithSelectableType';

export default class ComponentListWithSelectableType extends ComponentWithSelectableType {
  static componentType = "_componentlistwithselectabletype";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);
    let standardComponentClasses = args.standardComponentClasses;

    childLogic.deleteAllLogic();

    function breakIntoTypesByCommas({ activeChildrenMatched, dependencyValues }) {
      let stringChild = dependencyValues.stringChild[0];
      let stringPieces = stringChild.stateValues.value.split(",").map(s => s.trim());

      let selectedType = dependencyValues.type;
      if (selectedType === null) {
        if (stringPieces.every(s => /^[a-zA-Z]+$/.test(s))) {
          selectedType = "letters";
        } else if (stringPieces.every(s => Number.isFinite(Number(s)))) {
          selectedType = "number";
        } else {
          selectedType = "text";
        }
      }

      let newChildren = stringPieces.map(x => ({
        componentType: selectedType,
        children: [{
          componentType: "string",
          state: { value: x.trim() }
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
      sugarDependencies: {
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        stringChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneString",
          variableNames: ["value"],
        }
      },
      affectedBySugar: ["anythingForSelectedType"],
      replacementFunction: breakIntoTypesByCommas,
    });

    function addType({ activeChildrenMatched, dependencyValues }) {

      let selectedType = dependencyValues.type;
      if (selectedType === null) {
        if (activeChildrenMatched.length === 1) {
          let child = activeChildrenMatched[0];
          if (child.componentType === "string") {
            let s = child.stateValues.value.trim();
            if (/^[a-zA-Z]+$/.test(s)) {
              selectedType = "letters";
            } else if (Number.isFinite(Number(s))) {
              selectedType = "number";
            } else {
              selectedType = "text";
            }
          } else {
            // have a single non-string child.
            // Don't match sugar: child will be matched by anythingForSelectedType.
            return { success: false };
          }
        } else {
          // have more than one child, but don't know what type to create
          return { success: false }
        }
      }

      // if already have a single child of the correct type, don't match sugar
      // the one child will be matched by anythingForSelectedType
      if (activeChildrenMatched.length === 1 && activeChildrenMatched[0].componentType === selectedType) {
        return { success: false }
      }

      if (!(selectedType in standardComponentClasses)) {
        // if didn't get a valid type and component is string
        // set to selected type to text
        if (activeChildrenMatched.length === 1 && activeChildrenMatched[0].componentType === "string") {
          selectedType = 'text';
        } else {
          // else don't match sugar
          // which means
          // - if there is only one component, that will become the type
          // - if there are more than one component, child logic will fail
          return { success: false }
        }
      }

      let typeChildren = [];
      for (let child of activeChildrenMatched) {
        typeChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }

      return {
        success: true,
        newChildren: [{ componentType: selectedType, children: typeChildren }],
      }
    }

    let anythingAsSugar = childLogic.newLeaf({
      name: 'anythingAsSugar',
      componentType: '_base',
      excludeComponentTypes: ["_composite"],
      comparison: 'atLeast',
      number: 1,
      isSugar: true,
      sugarDependencies: {
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        }
      },
      affectedBySugar: ["anythingForSelectedType"],
      replacementFunction: addType,
    });

    let anythingForSelectedType = childLogic.newLeaf({
      name: 'anythingForSelectedType',
      componentType: "_base",
      excludeComponentTypes: ["_composite"],
      comparison: 'atLeast',
      number: 1,
    });

    childLogic.newOperator({
      name: "sugarXorNot",
      operator: "xor",
      propositions: [exactlyOneString, anythingAsSugar, anythingForSelectedType],
      setAsBase: true,
    })

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.values = {
      public: true,
      isArray: true,
      entryPrefixes: ["value"],
      returnDependencies: () => ({
        anythingForSelectedType: {
          dependencyType: "childStateVariables",
          childLogicName: "anythingForSelectedType",
          variableNames: ["value"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          newValues: { values: dependencyValues.anythingForSelectedType.map(x => x.stateValues.value) },
          setComponentType: dependencyValues.anythingForSelectedType[0].componentType,
        };
      }
    }

    stateVariableDefinitions.selectedType = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        anythingForSelectedType: {
          dependencyType: "childStateVariables",
          childLogicName: "anythingForSelectedType",
          variableNames: ["value"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          newValues: { selectedType: dependencyValues.anythingForSelectedType[0].componentType }
        };
      }
    }

    return stateVariableDefinitions;
  }


  updateState(args = {}) {
    if (args.init === true) {
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

    if (!this.childLogicSatisfied || this.unresolvedState.type) {
      this.unresolvedState.values = true;
      delete this.unresolvedState.value; // from ComponentWithSelectableType
      return;
    }

    delete this.unresolvedState.values;

    this._state.values.componentType = this.state.type;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {
      let anythingForSelectedType = this.childLogic.returnMatches("anythingForSelectedType");
      this.state.valueChildren = anythingForSelectedType.map(x => this.activeChildren[x]);
      if (this.state.valueChildren.length > 0) {
        this.state.stateVariableForPropertyValue = this.state.valueChildren[0].constructor.stateVariableForPropertyValue;
        if (this.state.stateVariableForPropertyValue === null) {
          this.state.stateVariableForPropertyValue = "value";
        }
      }
    }

    if (childrenChanged || this.state.valueChildren.some(
      x => trackChanges.getVariableChanges({
        component: x, variable: this.state.stateVariableForPropertyValue
      }))) {
      this.state.values = this.state.valueChildren.map(x => x.state[this.state.stateVariableForPropertyValue]);
    }

  }
}
