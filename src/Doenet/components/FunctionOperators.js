import FunctionBaseOperator from './abstract/FunctionBaseOperator';
import me from 'math-expressions';

export class ClampFunction extends FunctionBaseOperator {
  static componentType = "clampfunction";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.lowerValue = { default: 0 };
    properties.upperValue = { default: 1 };
    return properties;
  }

  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    stateVariableDefinitions.functionOperator = {
      returnDependencies: () => ({
        lowerValue: {
          dependencyType: "stateVariable",
          variableName: "lowerValue"
        },
        upperValue: {
          dependencyType: "stateVariable",
          variableName: "upperValue"
        }
      }),
      definition: function ({ dependencyValues }) {

        return {
          newValues: {
            functionOperator: function (x) {
              let numericValue = x;
              if (numericValue.tree) {
                numericValue = numericValue.evaluate_to_constant();
              }

              // if don't have a number, return NaN
              if (!Number.isFinite(numericValue)) {
                return NaN;
              }
              return Math.max(dependencyValues.lowerValue,
                Math.min(dependencyValues.upperValue, numericValue)
              );

            }
          }
        }

      }
    }

    return stateVariableDefinitions;
  }


}

export class WrapFunctionPeriodic extends FunctionBaseOperator {
  static componentType = "wrapfunctionperiodic";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.lowerValue = { default: 0 };
    properties.upperValue = { default: 1 };
    return properties;
  }

  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    stateVariableDefinitions.functionOperator = {
      returnDependencies: () => ({
        lowerValue: {
          dependencyType: "stateVariable",
          variableName: "lowerValue"
        },
        upperValue: {
          dependencyType: "stateVariable",
          variableName: "upperValue"
        }
      }),
      definition: function ({ dependencyValues }) {

        return {
          newValues: {
            functionOperator: function (x) {
              let numericValue = x;
              if (numericValue.tree) {
                numericValue = numericValue.evaluate_to_constant();
              }
              // if don't have a number, return NaN
              if (!Number.isFinite(numericValue)) {
                return NaN;
              }

              let lower = dependencyValues.lowerValue
              let upper = dependencyValues.upperValue;

              // if bounds are the same, clamp to that value
              if (lower === upper) {
                return lower;
              }

              // just in case lower is larger than upper, swap values
              if (lower > upper) {
                [upper, lower] = [lower, upper];
              }

              return (lower + me.math.mod(
                numericValue - lower,
                upper - lower
              )
              )

            }
          }
        }

      }
    }

    return stateVariableDefinitions;
  }

}


export class Derivative extends FunctionBaseOperator {
  static componentType = "derivative";

  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    stateVariableDefinitions.operatorBasedOnFormulaIfAvailable = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { operatorBasedOnFormulaIfAvailable: true } })
    }

    stateVariableDefinitions.operatorComposesWithOriginal = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { operatorComposesWithOriginal: false } })
    }

    stateVariableDefinitions.formulaOperator = {
      returnDependencies: () => ({
        variable: {
          dependencyType: "stateVariable",
          variableName: "variable",
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            formulaOperator: function (formula) {
              return formula.derivative(dependencyValues.variable.tree)
            }
          }
        }
      }
    }

    stateVariableDefinitions.functionOperator = {
      returnDependencies: () => ({

        functionChild: {
          dependencyType: "child",
          childLogicName: "atMostOneFunction",
          variableNames: ["returnDerivativesOfF"],
          variablesOptional: true,
        },
      }),
      additionalStateVariablesDefined: ["returnDerivativesOfF"],
      definition: function ({ dependencyValues }) {

        if (dependencyValues.functionChild.length === 0
          || !dependencyValues.functionChild[0].stateValues.returnDerivativesOfF
        ) {
          return {
            newValues: {
              functionOperator: x => NaN,
              returnDerivativesOfF: null,
            }
          }
        }

        return {
          newValues: {
            functionOperator: dependencyValues.functionChild[0].stateValues.returnDerivativesOfF(1),
            returnDerivativesOfF: (i = 1) => dependencyValues.functionChild[0].stateValues.returnDerivativesOfF(i + 1)
          }
        }
      }
    }

    return stateVariableDefinitions;
  }


}

