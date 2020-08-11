import InlineComponent from './abstract/InlineComponent';

export default class Variants extends InlineComponent {
  static componentType = "variants";
  static rendererType = undefined;

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroVariants = childLogic.newLeaf({
      name: "atLeastZeroVariants",
      componentType: 'variant',
      comparison: 'atLeast',
      number: 0
    });

    let breakStringIntoVariantsByCommas = function ({ dependencyValues }) {

      let stringChild = dependencyValues.stringChild[0];
      let newChildren = stringChild.stateValues.value.split(",").map(x => ({
        componentType: "variant",
        state: { value: x.trim() }
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
        stringChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneString",
          variableNames: ["value"]
        }
      }),
      logicToWaitOnSugar: ["atLeastZeroVariants"],
      replacementFunction: breakStringIntoVariantsByCommas,
    });

    childLogic.newOperator({
      name: "VariantsXorSugar",
      operator: 'xor',
      propositions: [exactlyOneString, atLeastZeroVariants],
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
        variantChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroVariants",
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { nVariants: dependencyValues.variantChildren.length } }
      }
    }

    stateVariableDefinitions.variants = {
      public: true,
      componentType: "variant",
      isArray: true,
      entryPrefixes: ["variant"],
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
            variantChild: {
              dependencyType: "childStateVariables",
              childLogicName: "atLeastZeroVariants",
              variableNames: ["value"],
              childIndices: [arrayKey]
            }
          }
        }
        return { dependenciesByKey }
      },
      arrayDefinitionByKey: function ({ dependencyValuesByKey, arrayKeys }) {
        let variants = {};
        for (let arrayKey of arrayKeys) {
          if (dependencyValuesByKey[arrayKey].variantChild.length === 1) {
            variants[arrayKey] = dependencyValuesByKey[arrayKey].variantChild[0]
              .stateValues.value.toLowerCase()
          }
        }
        return { newValues: { variants } }
      }
    }

    return stateVariableDefinitions;
  }

}