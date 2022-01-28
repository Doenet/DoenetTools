import MathList from './MathList.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { isValidVariable } from '../utils/math.js';

export default class Variables extends MathList {
  static componentType = "variables";

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
          setValue: { variables }
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

          let validVariable = isValidVariable(variable);
          if (!validVariable) {
            console.warn("Invalid value for " + thisComponentType);
            validVariable = false;
          }
          validVariables.push(validVariable);

        }

        return { setValue: { validVariables } }
      }

    }

    return stateVariableDefinitions;
  }

}