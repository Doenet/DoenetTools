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
      affectedBySugar: ["atLeastZeroVariants"],
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

    stateVariableDefinitions.variants = {
      public: true,
      componentType: "variant",
      isArray: true,
      entryPrefixes: ["variant"],
      returnDependencies: () => ({
        variantChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroVariants",
          variableNames: ["value"],
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { variants: dependencyValues.variantChildren.map(x => x.stateValues.value.toLowerCase()) } }
      }
    }

    stateVariableDefinitions.nVariants = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        variants: {
          dependencyType: "stateVariable",
          variableName: "variants"
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { nVariants: dependencyValues.variants.length } }
      }
    }

    return stateVariableDefinitions;
  }

}