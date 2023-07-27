import { isValidVariable } from "../../utils/math";
import { renameStateVariable } from "../../utils/stateVariables";
import MathComponent from "../Math";

export default class Variable extends MathComponent {
  static componentType = "_variableName";
  static rendererType = "math";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // we need to add validVariable as an additional state variable of value
    // so that we get the warning any time the value is calculate

    renameStateVariable({
      stateVariableDefinitions,
      oldName: "value",
      newName: "valuePreValidate",
    });

    // Still specify the value of an _variableName with the essential variable value
    // Needed so that can creating an integer component from serialized state as:
    // {componentType: "_variableName", state: {value: me.fromAst("x")}}
    stateVariableDefinitions.valuePreValidate.essentialVarName = "value";

    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "_variableName",
      },
      additionalStateVariablesDefined: ["validVariable"],
      returnDependencies: () => ({
        valuePreValidate: {
          dependencyType: "stateVariable",
          variableName: "valuePreValidate",
        },
      }),
      definition({ dependencyValues }) {
        let warnings = [];
        let validVariable = isValidVariable(dependencyValues.valuePreValidate);

        if (!validVariable) {
          warnings.push({
            message:
              "Invalid value of a variable: " +
              dependencyValues.valuePreValidate.toString(),
            level: 1,
          });
        }

        return {
          setValue: { value: dependencyValues.valuePreValidate, validVariable },
          sendWarnings: warnings,
        };
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setDependency: "valuePreValidate",
              desiredValue: desiredStateVariableValues.value,
            },
          ],
        };
      },
    };

    return stateVariableDefinitions;
  }
}
