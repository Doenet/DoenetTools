import NumberComponent from "./Number";
import me from "math-expressions";
import { renameStateVariable } from "../utils/stateVariables";
import { textToAst } from "../utils/math";

export default class Integer extends NumberComponent {
  static componentType = "integer";
  static rendererType = "number";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    renameStateVariable({
      stateVariableDefinitions,
      oldName: "value",
      newName: "valuePreRound",
    });

    // Still specify the value of an integer with the essential variable value
    // Needed so that can creating an integer component from serialized state as:
    // {componentType: "integer", state: {value: 3}}
    stateVariableDefinitions.valuePreRound.essentialVarName = "value";

    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        valuePreRound: {
          dependencyType: "stateVariable",
          variableName: "valuePreRound",
        },
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
            number = me
              .fromAst(textToAst.convert(value))
              .evaluate_to_constant();
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
        return {
          setValue: { value: Math.round(dependencyValues.valuePreRound) },
        };
      },
      inverseDefinition({ desiredStateVariableValues }) {
        let desiredValue = desiredStateVariableValues.value;
        if (desiredValue instanceof me.class) {
          desiredValue = desiredValue.evaluate_to_constant();
        } else {
          desiredValue = Number(desiredValue);
        }
        desiredValue = Math.round(desiredValue);

        return {
          success: true,
          instructions: [
            {
              setDependency: "valuePreRound",
              desiredValue,
            },
          ],
        };
      },
    };

    return stateVariableDefinitions;
  }
}
