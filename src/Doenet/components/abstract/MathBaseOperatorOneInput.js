import MathComponent from '../Math';
import { renameStateVariable } from '../../utils/stateVariables';

export default class MathOperatorOneInput extends MathComponent {
  static componentType = "_mathoperatoroneinput";
  static rendererType = "math";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneFunction = childLogic.newLeaf({
      name: "exactlyOneFunction",
      componentType: 'function',
      number: 1,
    });

    childLogic.newOperator({
      name: "mathXorFunction",
      operator: "xor",
      propositions: [childLogic.baseLogic, exactlyOneFunction],
      setAsBase: true,
    })

    return childLogic;

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let constructor = this;

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
        functionChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneFunction",
          variableNames: ["formula", "variable"]
        },
        variable: {
          dependencyType: "stateVariable",
          variableName: "variable",
          variableOptional: true,
        }
      }),
      definition: function ({ dependencyValues }) {

        // overwrite value and variable if have a function
        if (dependencyValues.functionChild.length === 1) {
          dependencyValues.value = dependencyValues.functionChild[0].stateValues.formula;
          dependencyValues.variable = dependencyValues.functionChild[0].stateValues.variable;
        }
        return {
          newValues: {
            unnormalizedValue: constructor.applyMathOperator(dependencyValues)
          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {
        if (constructor.reverseMathOperator && dependencyValues.functionChild.length === 0) {
          let newValue = constructor.reverseMathOperator({
            desiredValue: desiredStateVariableValues.unnormalizedValue,
            dependencyValues
          })
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
        }
      }),
      definition: function ({ dependencyValues }) {
        let canBeModified = dependencyValues.canBeModifiedPreOperator;

        if (!constructor.reverseMathOperator) {
          canBeModified = false;
        }

        return { newValues: { canBeModified } }
      }
    }

    return stateVariableDefinitions;
  }


}
