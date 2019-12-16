import InlineComponent from './abstract/InlineComponent';

export default class BooleanList extends InlineComponent {
  static componentType = "booleanlist";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.unordered = { default: false };
    properties.maximumNumber = { default: undefined };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroBooleans = childLogic.newLeaf({
      name: "atLeastZeroBooleans",
      componentType: 'boolean',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroBooleanlists = childLogic.newLeaf({
      name: "atLeastZeroBooleanlists",
      componentType: 'booleanlist',
      comparison: 'atLeast',
      number: 0
    });

    let breakStringIntoBooleansByCommas = function ({ activeChildrenMatched }) {
      let stringChild = activeChildrenMatched[0];
      let newChildren = stringChild.stateValues.value.split(",").map(x => ({
        componentType: "boolean",
        state: { value: ["true", "t"].includes(x.trim().toLowerCase()) }
      }));
      return {
        success: true,
        newChildren: newChildren,
        toDelete: [stringChild.componentName],
      }
    }

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1,
      isSugar: true,
      affectedBySugar: ["atLeastZeroBooleans"],
      replacementFunction: breakStringIntoBooleansByCommas,
    });

    let booleanAndBooleanLists = childLogic.newOperator({
      name: "booleanAndBooleanLists",
      operator: "and",
      propositions: [atLeastZeroBooleans, atLeastZeroBooleanlists]
    })

    childLogic.newOperator({
      name: "BooleansXorSugar",
      operator: 'xor',
      propositions: [exactlyOneString, booleanAndBooleanLists],
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.booleanAndBooleanlistChildren = {
      returnDependencies: () => ({
        booleanAndBooleanlistChildren: {
          dependencyType: "childIdentity",
          childLogicName: "booleanAndBooleanLists",
          variableNames: ["value"],
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            booleanAndBooleanlistChildren: dependencyValues.booleanAndBooleanlistChildren
          }
        }
      }
    }

    stateVariableDefinitions.booleans = {
      public: true,
      componentType: "boolean",
      isArray: true,
      entryPrefixes: ["boolean"],
      returnDependencies: () => ({
        booleanAndBooleanlistChildren: {
          dependencyType: "stateVariable",
          variableName: "booleanAndBooleanlistChildren",
        },
        booleanChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroBooleans",
          variableNames: ["value"],
        },
        booleanlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroBooleanlists",
          variableNames: ["booleans"],
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        }
      }),
      definition: function ({ dependencyValues }) {
        let booleanNumber = 0;
        let booleanlistNumber = 0;
        let booleans = [];

        for (let child of dependencyValues.booleanAndBooleanlistChildren) {
          if (child.componentType === "boolean") {
            booleans.push(dependencyValues.booleanChildren[booleanNumber].stateValues.value);
            booleanNumber++;
          } else {
            booleans.push(...dependencyValues.booleanlistChildren[booleanlistNumber].stateValues.booleans);
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== undefined && booleans.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          booleans = booleans.slice(0, maxNum)
        }

        return { newValues: { booleans } }

      }
    }

    stateVariableDefinitions.ncomponents = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        booleans: {
          dependencyType: "stateVariable",
          variableName: "booleans"
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { ncomponents: dependencyValues.booleans.length } }
      }
    }

    return stateVariableDefinitions;
  }



  initializeRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new this.availableRenderers.aslist({
        key: this.componentName,
      });
    }
  }

  updateChildrenWhoRender() {

    this.childrenWhoRender = [];
    for (let child of this.stateValues.booleanAndBooleanlistChildren) {
      if (child.componentType === "boolean") {
        this.childrenWhoRender.push(child.componentName);
      } else {
        // state variable doesn't contain entire component,
        // just componentType and componentName
        // Look up actual component from allChildren
        let childComponent = this.allChildren[child.componentName].component
        this.childrenWhoRender.push(...childComponent.childrenWhoRender);
      }
    }
    if (this.childrenWhoRender.length > this.stateValues.ncomponents) {
      this.childrenWhoRender.length = this.stateValues.ncomponents;
    }

  }


}