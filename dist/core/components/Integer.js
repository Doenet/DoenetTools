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
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        valuePreRound: {
          dependencyType: "stateVariable",
          variableName: "valuePreRound"
        }
      }),
      set: function (value) {
        // this function is called when
        // - definition is overridden by a copy prop
        // - when processing new state variable values
        //   (which could be from outside sources)
        if (value === null) {
          return NaN;
        }
        let number = Number(value);
        if (Number.isNaN(number)) {
          try {
            number = me.fromAst(textToAst.convert(value)).evaluate_to_constant();
            if (number === null) {
              number = NaN;
            }
          } catch (e) {
            number = NaN;
          }
        }
        return Math.round(number);
      },
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