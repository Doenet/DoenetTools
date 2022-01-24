import BaseComponent from './abstract/BaseComponent.js';

export default class VariantNames extends BaseComponent {
  static componentType = "variantNames";
  static rendererType = undefined;

  static stateVariableForAttributeValue = "variantNames";


  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakStringsBySpaces = function ({ matchedChildren }) {

      // break any string by white space

      let newChildren = matchedChildren.reduce(function (a, c) {
        if (typeof c === "string") {
          return [
            ...a,
            ...c.split(/\s+/)
              .filter(s => s)
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
      replacementFunction: breakStringsBySpaces
    });

    return sugarInstructions;

  }


  static returnChildGroups() {

    return [{
      group: "strings",
      componentTypes: ["string"]
    }]
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nVariants = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        stringChildren: {
          dependencyType: "child",
          childGroups: ["strings"],
        }
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { nVariants: dependencyValues.stringChildren.length } }
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
            stringChild: {
              dependencyType: "child",
              childGroups: ["strings"],
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
          if (dependencyValuesByKey[arrayKey].stringChild.length === 1) {
            variantNames[arrayKey] = dependencyValuesByKey[arrayKey].stringChild[0]
              .toLowerCase().substring(0, 1000);
          }
        }
        return { setValue: { variantNames } }
      }
    }

    return stateVariableDefinitions;
  }

}