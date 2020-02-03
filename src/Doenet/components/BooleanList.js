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
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let booleanNumber = 0;
        let booleanlistNumber = 0;
        let booleans = [];

        for (let child of dependencyValues.booleanAndBooleanlistChildren) {
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "boolean"
          })) {
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

    stateVariableDefinitions.nComponents = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        booleans: {
          dependencyType: "stateVariable",
          variableName: "booleans"
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { nComponents: dependencyValues.booleans.length } }
      }
    }


    stateVariableDefinitions.childrenWhoRender = {
      returnDependencies: () => ({
        booleanAndBooleanlistChildren: {
          dependencyType: "stateVariable",
          variableName: "booleanAndBooleanlistChildren",
        },
        booleanChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroBooleans",
        },
        booleanlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroBooleanlists",
          variableNames: ["childrenWhoRender"],
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let booleanNumber = 0;
        let booleanlistNumber = 0;
        let childrenWhoRender = [];

        for (let child of dependencyValues.booleanAndBooleanlistChildren) {

          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "boolean"
          })) {
            childrenWhoRender.push(dependencyValues.booleanChildren[booleanNumber].componentName);
            booleanNumber++;
          } else {
            childrenWhoRender.push(...dependencyValues.booleanlistChildren[booleanlistNumber].stateValues.childrenWhoRender);
            booleanlistNumber++;
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== undefined && booleans.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          childrenWhoRender = childrenWhoRender.slice(0, maxNum)
        }

        return { newValues: { childrenWhoRender } }

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

}