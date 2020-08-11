import MathComponent from '../Math';
import { renameStateVariable } from '../../utils/stateVariables';

export default class MathOperatorOneInput extends MathComponent {
  static componentType = "_mathoperatoroneinput";
  static rendererType = "math";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { mathOperator: x => me.fromAst('\uff3f') } })
    }

    stateVariableDefinitions.reverseMathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { reverseMathOperator: null } })
    }

    // rename unnormalizedValue to unnormalizedValuePreOperator
    renameStateVariable({
      stateVariableDefinitions,
      oldName: "unnormalizedValue",
      newName: "unnormalizedValuePreOperator"
    });

    // create new version of unnormalizedValue that applies operator
    stateVariableDefinitions.unnormalizedValue = {
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "unnormalizedValuePreOperator"
        },
        mathOperator: {
          dependencyType: "stateVariable",
          variableName: "mathOperator"
        },
        reverseMathOperator: {
          dependencyType: "stateVariable",
          variableName: "mathOperator"
        }
      }),
      definition: function ({ dependencyValues }) {

        return {
          newValues: {
            unnormalizedValue: dependencyValues.mathOperator(
              dependencyValues.value
            )
          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.reverseMathOperator) {
          let newValue = dependencyValues.reverseMathOperator(
            desiredStateVariableValues.unnormalizedValue
          )
          return {
            success: true,
            instructions: [{
              setDependency: "value",
              desiredValue: newValue,
            }]
          }
        } else {
          return { success: false }
        }
      }
    }

    // rename canBeModified to canBeModifiedPreOperator
    renameStateVariable({
      stateVariableDefinitions,
      oldName: "canBeModified",
      newName: "canBeModifiedPreOperator"
    });

    // create new version on canBeModified that is false 
    // if don't have reverseMathOperator
    stateVariableDefinitions.canBeModified = {
      returnDependencies: () => ({
        canBeModifiedPreOperator: {
          dependencyType: "stateVariable",
          variableName: "canBeModifiedPreOperator"
        },
        reverseMathOperator: {
          dependencyType: "stateVariable",
          variableName: "mathOperator"
        }
      }),
      definition: function ({ dependencyValues }) {
        let canBeModified = dependencyValues.canBeModifiedPreOperator;

        if (!dependencyValues.reverseMathOperator) {
          canBeModified = false;
        }

        return { newValues: { canBeModified } }
      }
    }

    return stateVariableDefinitions;
  }


}
