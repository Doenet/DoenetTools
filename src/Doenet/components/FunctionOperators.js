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

    stateVariableDefinitions.numericFunctionOperator = {
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
            numericFunctionOperator: function (x) {
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

    stateVariableDefinitions.numericFunctionOperator = {
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
            numericFunctionOperator: function (x) {
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

    stateVariableDefinitions.operatorBasedOnFormula = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { operatorBasedOnFormula: true } })
    }

    stateVariableDefinitions.formulaOperator = {
      returnDependencies: () => ({
        variable: {
          dependencyType: "stateVariable",
          variableName: "variable",
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          formulaOperator: function (formula) {
            return formula.derivative(dependencyValues.variable.tree)
          }
        }
      })
    }

    return stateVariableDefinitions;
  }


}

