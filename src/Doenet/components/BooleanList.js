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
      logicToWaitOnSugar: ["atLeastZeroBooleans"],
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


    stateVariableDefinitions.nComponents = {
      public: true,
      componentType: "number",
      additionalStateVariablesDefined: ["childIndexByArrayKey"],
      returnDependencies() {
        return {
          maximumNumber: {
            dependencyType: "stateVariable",
            variableName: "maximumNumber",
          },
          booleanAndBooleanlistChildren: {
            dependencyType: "childStateVariables",
            childLogicName: "booleanAndBooleanLists",
            variableNames: ["nComponents"],
            variablesOptional: true,
          }
        }
      },
      definition: function ({ dependencyValues }) {

        let nComponents = 0;
        let childIndexByArrayKey = [];

        for (let [childInd, child] of dependencyValues.booleanAndBooleanlistChildren.entries()) {
          if (child.stateValues.nComponents !== undefined) {
            for (let i = 0; i < child.stateValues.nComponents; i++) {
              childIndexByArrayKey[nComponents + i] = [childInd, i];
            }
            nComponents += child.stateValues.nComponents;
          } else {
            childIndexByArrayKey[nComponents] = [childInd, 0];
            nComponents += 1;
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && nComponents > maxNum) {
          nComponents = maxNum;
          childIndexByArrayKey = childIndexByArrayKey.slice(0, maxNum);
        }

        return {
          newValues: { nComponents, childIndexByArrayKey },
          checkForActualChange: { nComponents: true }
        }
      }
    }

    stateVariableDefinitions.booleans = {
      public: true,
      componentType: "boolean",
      isArray: true,
      entryPrefixes: ["boolean"],
      stateVariablesDeterminingDependencies: ["childIndexByArrayKey"],
      returnArraySizeDependencies: () => ({
        nComponents: {
          dependencyType: "stateVariable",
          variableName: "nComponents",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nComponents];
      },

      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let dependenciesByKey = {}
        let globalDependencies = {
          childIndexByArrayKey: {
            dependencyType: "stateVariable",
            variableName: "childIndexByArrayKey"
          }
        };

        for (let arrayKey of arrayKeys) {
          let childIndices = [];
          if (stateValues.childIndexByArrayKey[arrayKey]) {
            childIndices = [stateValues.childIndexByArrayKey[arrayKey][0]];
          }
          dependenciesByKey[arrayKey] = {
            booleanAndBooleanlistChildren: {
              dependencyType: "childStateVariables",
              childLogicName: "booleanAndBooleanLists",
              variableNames: ["value", "booleans"],
              variablesOptional: true,
              childIndices,
            },
          }
        }

        return { globalDependencies, dependenciesByKey }

      },
      arrayDefinitionByKey({
        globalDependencyValues, dependencyValuesByKey, arrayKeys,
      }) {

        let booleans = {};

        for (let arrayKey of arrayKeys) {
          let child = dependencyValuesByKey[arrayKey].booleanAndBooleanlistChildren[0];

          if (child) {
            if (child.stateValues.booleans) {
              let ind2 = globalDependencyValues.childIndexByArrayKey[arrayKey][1];
              booleans[arrayKey] = child.stateValues.booleans[ind2];

            } else {
              booleans[arrayKey] = child.stateValues.value;
            }

          }

        }

        return { newValues: { booleans } }

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