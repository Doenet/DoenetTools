import BaseComponent from './abstract/BaseComponent';

export default class VariantNames extends BaseComponent {
  static componentType = "variantNames";
  static rendererType = undefined;

  static stateVariableForAttributeValue = "variantNames";


  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakStringsIntoVariantsBySpaces = function ({ matchedChildren }) {

      // break any string by white space and wrap pieces with variantName

      let newChildren = matchedChildren.reduce(function (a, c) {
        if (c.componentType === "string") {
          return [
            ...a,
            ...c.state.value.split(/\s+/)
              .filter(s => s)
              .map(s => ({
                componentType: "variantName",
                state: { value: s }
              }))
          ]
        } else {
          return [...a, c]
        }
      }, []);

      return {
        success: true,
        newChildren: newChildren,
      }
    }

    sugarInstructions.push({
      replacementFunction: breakStringsIntoVariantsBySpaces
    });

    return sugarInstructions;

  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atLeastZeroVariantNames",
      componentType: 'variantName',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nVariants = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        variantNameChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroVariantNames",
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { nVariants: dependencyValues.variantNameChildren.length } }
      }
    }

    stateVariableDefinitions.variantNames = {
      public: true,
      componentType: "variantName",
      isArray: true,
      entryPrefixes: ["variantName"],
      returnArraySizeDependencies: () => ({
        nVariants: {
          dependencyType: "stateVariable",
          variableName: "nVariants",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nVariants];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            variantNameChild: {
              dependencyType: "child",
              childLogicName: "atLeastZeroVariantNames",
              variableNames: ["value"],
              childIndices: [arrayKey]
            }
          }
        }
        return { dependenciesByKey }
      },
      arrayDefinitionByKey: function ({ dependencyValuesByKey, arrayKeys }) {
        let variantNames = {};
        for (let arrayKey of arrayKeys) {
          if (dependencyValuesByKey[arrayKey].variantNameChild.length === 1) {
            variantNames[arrayKey] = dependencyValuesByKey[arrayKey].variantNameChild[0]
              .stateValues.value.toLowerCase().substring(0, 1000);
          }
        }
        return { newValues: { variantNames } }
      }
    }

    return stateVariableDefinitions;
  }

}