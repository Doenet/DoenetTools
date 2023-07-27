import MathList from "../MathList";
import me from "math-expressions";
import { isValidVariable } from "../../utils/math";

export default class VariableNameList extends MathList {
  static componentType = "_variableNameList";

  // when another component has a attribute that is a _variableNameList,
  // use the variables state variable to populate that attribute
  static stateVariableToBeShadowed = "variables";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.variables = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "_variableName",
      },
      isArray: true,
      entryPrefixes: ["var"],
      additionalStateVariablesDefined: ["validVariables"],
      returnArraySizeDependencies: () => ({
        numComponents: {
          dependencyType: "stateVariable",
          variableName: "numComponents",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numComponents];
      },

      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            math: {
              dependencyType: "stateVariable",
              variableName: "math" + (Number(arrayKey) + 1),
            },
          };
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let variables = {};
        let validVariables = {};
        let warnings = [];
        for (let arrayKey of arrayKeys) {
          let variable = dependencyValuesByKey[arrayKey].math;
          let validVariable = isValidVariable(variable);
          if (!validVariable) {
            warnings.push({
              message: "Invalid value of a variable: " + variable.toString(),
              level: 1,
            });
            validVariable = false;
          }
          variables[arrayKey] = variable;
          validVariables[arrayKey] = validVariable;
        }
        return {
          setValue: { variables, validVariables },
          sendWarnings: warnings,
        };
      },
    };

    return stateVariableDefinitions;
  }
}
