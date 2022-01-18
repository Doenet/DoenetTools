import NumberComponent from './Number.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { renameStateVariable } from '../utils/stateVariables.js';

export default class Integer extends NumberComponent {
  static componentType = "integer";
  static rendererType = "number";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    renameStateVariable({
      stateVariableDefinitions,
      oldName: "value",
      newName: "valuePreRound"
    });

    stateVariableDefinitions.value = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        valuePreRound: {
          dependencyType: "stateVariable",
          variableName: "valuePreRound"
        }
      }),
      definition({ dependencyValues }) {
        return { setValue: { value: Math.round(dependencyValues.valuePreRound) } }
      },
      inverseDefinition({desiredStateVariableValues}) {
        let desiredValue = desiredStateVariableValues.value;
        if (desiredValue instanceof me.class) {
          desiredValue = desiredValue.evaluate_to_constant();
          if (!Number.isFinite(desiredValue)) {
            desiredValue = NaN;
          }
        } else {
          desiredValue = Number(desiredValue);
        }
        desiredValue = Math.round(desiredValue);

        return {
          success: true,
          instructions: [{
            setDependency: "valuePreRound",
            desiredValue
          }]
        }

      }
    }

    return stateVariableDefinitions;

  }
}