import MathList from './MathList';
import me from 'math-expressions';

export default class Variables extends MathList {
  static componentType = "variables";

  // TODO: how to add this feature?
  static additionalStateVariablesForProperties = ["validVariables"];

  // when another component has a attribute that is a mathList,
  // use the maths state variable to populate that attribute
  static stateVariableForAttributeValue = "variables";


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.variables = {
      public: true,
      componentType: "variable",
      isArray: true,
      entryPrefixes: ["var"],
      returnArraySizeDependencies: () => ({
        nComponents: {
          dependencyType: "stateVariable",
          variableName: "nComponents",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nComponents];
      },

      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {}

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            math: {
              dependencyType: "stateVariable",
              variableName: "math" + (Number(arrayKey) + 1),
            },
          }
        }
        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let variables = {};
        for (let arrayKey of arrayKeys) {
          variables[arrayKey] = dependencyValuesByKey[arrayKey].math;
        }
        return {
          newValues: { variables }
        }
      }
    }

    let thisComponentType = this.componentType;

    stateVariableDefinitions.validVariables = {
      returnDependencies: () => ({
        variables: {
          dependencyType: "stateVariable",
          variableName: "variables"
        },
      }),
      definition: function ({ dependencyValues }) {
        let validVariables = [];

        for (let variable of dependencyValues.variables) {

          // to be a valid variable, tree must be either
          // - a string, or
          // - a string with a subscript that is a string or a number
          let tree = variable.tree;
          let validVariable = true;
          if (typeof tree === "string") {
            if (tree === '\uFF3F') {  // long underscore
              validVariable = false;
            }
          } else if (!Array.isArray(tree) ||
            tree[0] !== '_' ||
            (typeof tree[1] !== "string") ||
            ((typeof tree[2] !== "string" && typeof tree[2] !== "number"))
          ) {
            validVariable = false;
          }
          if (!validVariable) {
            console.warn("Invalid value for " + thisComponentType);
            validVariable = false;
          }
          validVariables.push(validVariable);

        }

        return { newValues: { validVariables } }
      }

    }

    return stateVariableDefinitions;
  }

}