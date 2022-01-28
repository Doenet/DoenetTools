import { isValidVariable } from '../utils/math.js';
import MathComponent from './Math.js';

export default class Variable extends MathComponent {
  static componentType = "variable";
  static rendererType = "math";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.validVariable = {
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        }
      }),
      definition: function ({ dependencyValues }) {

        let validVariable = isValidVariable(dependencyValues.value);

        if (!validVariable) {
          console.warn("Invalid value of a " + this.componentType);
        }

        return { setValue: { validVariable } }
      }
    }

    return stateVariableDefinitions;
  }

}