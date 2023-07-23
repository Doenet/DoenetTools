import { isValidVariable } from "../../utils/math";
import MathComponent from "../Math";

export default class Variable extends MathComponent {
  static componentType = "_variableName";
  static rendererType = "math";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.validVariable = {
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
        },
      }),
      definition: function ({ dependencyValues }) {
        let warnings = [];
        let validVariable = isValidVariable(dependencyValues.value);

        if (!validVariable) {
          warnings.push({
            message:
              "Invalid value of a variable: " +
              dependencyValues.value.toString(),
            level: 2,
          });
        }

        return { setValue: { validVariable }, sendWarnings: warnings };
      },
    };

    return stateVariableDefinitions;
  }
}
