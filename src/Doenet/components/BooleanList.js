import InlineComponent from './abstract/InlineComponent';

export default class BooleanList extends InlineComponent {
  static componentType = "booleanlist";
  static rendererType = "aslist";

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

    let breakStringIntoBooleansByCommas = function ({ dependencyValues }) {
      let stringChild = dependencyValues.stringChildren[0];
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
      returnSugarDependencies: () => ({
        stringChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneString",
          variableNames: ["value"]
        }
      }),
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

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.booleans = {
      public: true,
      componentType: "boolean",
      isArray: true,
      entryPrefixes: ["boolean"],
      returnDependencies: () => ({
        booleanAndBooleanlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "booleanAndBooleanLists",
          variableNames: ["value", "booleans"],
          variablesOptional: true,
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        }
      }),
      definition: function ({ dependencyValues }) {

        let booleans = [];

        for (let child of dependencyValues.booleanAndBooleanlistChildren) {
          if (child.stateValues.booleans) {
            booleans.push(...child.stateValues.booleans);
          } else {
            booleans.push(child.stateValues.value);
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && booleans.length > maxNum) {
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


    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        booleanAndBooleanlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "booleanAndBooleanLists",
          variableNames: ["childrenToRender"],
          variablesOptional: true,
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {

        let childrenToRender = [];

        for (let child of dependencyValues.booleanAndBooleanlistChildren) {
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "booleanlist"
          })) {
            childrenToRender.push(...child.stateValues.childrenToRender);
          } else {
            childrenToRender.push(child.componentName);
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && childrenToRender.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          childrenToRender = childrenToRender.slice(0, maxNum)
        }

        return { newValues: { childrenToRender } }

      }
    }

    return stateVariableDefinitions;
  }

}