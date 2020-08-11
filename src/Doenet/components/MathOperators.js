import MathBaseOperator from './abstract/MathBaseOperator';
import MathBaseOperatorOneInput from './abstract/MathBaseOperatorOneInput';
import me from 'math-expressions';

export class Sum extends MathBaseOperator {
  static componentType = "sum";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        newValues: {
          mathOperator: function (values) {
            return values.reduce((a, c) => a.add(c)).simplify();
          }
        }
      })
    }


    return stateVariableDefinitions;

  }
}

export class Product extends MathBaseOperator {
  static componentType = "product";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        newValues: {
          mathOperator: function (values) {
            return values.reduce((a, c) => a.multiply(c)).simplify();
          }
        }
      })
    }


    return stateVariableDefinitions;
  }
}

export class ClampNumber extends MathBaseOperatorOneInput {
  static componentType = "clampnumber";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.lowerValue = { default: 0 };
    properties.upperValue = { default: 1 };
    return properties;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.mathOperator = {
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
      definition: ({ dependencyValues }) => ({
        newValues: {
          mathOperator: function (value) {
            return clamp({
              value,
              lowerValue: dependencyValues.lowerValue,
              upperValue: dependencyValues.upperValue
            })
          }
        }
      })
    }


    stateVariableDefinitions.reverseMathOperator = {
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
      definition: ({ dependencyValues }) => ({
        newValues: {
          reverseMathOperator: function (value) {
            return clamp({
              value,
              lowerValue: dependencyValues.lowerValue,
              upperValue: dependencyValues.upperValue
            })
          }
        }
      })
    }

    return stateVariableDefinitions;
  }


}


function clamp({ value, lowerValue, upperValue }) {
  let numericValue = value.evaluate_to_constant();

  // if don't have a number, just return value unchanged
  if (!Number.isFinite(numericValue)) {
    return value;
  }
  return me.fromAst(Math.max(lowerValue, Math.min(upperValue, numericValue)));
}


export class WrapNumberPeriodic extends MathBaseOperatorOneInput {
  static componentType = "wrapnumberperiodic";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.lowerValue = { default: 0 };
    properties.upperValue = { default: 1 };
    return properties;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.mathOperator = {
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
      definition: ({ dependencyValues }) => ({
        newValues: {
          mathOperator: function (value) {
            return makePeriodic({
              value,
              lowerValue: dependencyValues.lowerValue,
              upperValue: dependencyValues.upperValue
            })
          }
        }
      })
    }


    stateVariableDefinitions.reverseMathOperator = {
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
      definition: ({ dependencyValues }) => ({
        newValues: {
          reverseMathOperator: function (value) {
            return makePeriodic({
              value,
              lowerValue: dependencyValues.lowerValue,
              upperValue: dependencyValues.upperValue
            })
          }
        }
      })
    }

    return stateVariableDefinitions;

  }

}


function makePeriodic({ value, lowerValue, upperValue }) {
  let numericValue = value.evaluate_to_constant();

  // if don't have a number, just return value unchanged
  if (!Number.isFinite(numericValue)) {
    return value;
  }

  // if bounds are the same, clamp to that value
  if (lowerValue === upperValue) {
    return me.fromAst(lowerValue);
  }

  // just in case lowerValue is larger than upperValue, swap values
  if (lowerValue > upperValue) {
    [upperValue, lowerValue] = [lowerValue, upperValue];
  }

  return me.fromAst(
    lowerValue + me.math.mod(
      numericValue - lowerValue,
      upperValue - lowerValue
    )
  )
}

export class Round extends MathBaseOperatorOneInput {
  static componentType = "round";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.numberDecimals = { default: 0 };
    properties.numberDigits = { default: null };
    return properties;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({
        numberDecimals: {
          dependencyType: "stateVariable",
          variableName: "numberDecimals"
        },
        numberDigits: {
          dependencyType: "stateVariable",
          variableName: "numberDigits"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          mathOperator: function (value) {
            // first convert all numbers and constants (such as pi) to floating point numbers
            let valueWithNumbers = value.evaluate_numbers({ max_digits: Infinity, evaluate_functions: true });

            if (dependencyValues.numberDigits !== null) {

              return valueWithNumbers.round_numbers_to_precision(dependencyValues.numberDigits);

            } else {

              return valueWithNumbers.round_numbers_to_decimals(dependencyValues.numberDecimals);

            }
          }
        }
      })
    }


    stateVariableDefinitions.reverseMathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        newValues: {
          reverseMathOperator: value => value
        }
      })
    }

    return stateVariableDefinitions;

  }
}


export class ConvertSetToList extends MathBaseOperatorOneInput {
  static componentType = "convertsettolist";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    delete properties.unordered;
    return properties;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.unordered = {
      returnDependencies: () => ({}),
      definition: () => ({
        newValues: { unordered: true },
        makeEssential: ["unordered"]
      })
    }

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        newValues: {
          mathOperator: function (value) {

            if (value !== undefined && Array.isArray(value.tree) && value.tree[0] === "set") {
              let distinctElements = [];
              for (let v of value.tree.slice(1)) {
                // if v doesn't match any previous elements, add to array
                if (!distinctElements.some(x => value.context.equalsViaSyntax(
                  value.context.fromAst(x),
                  value.context.fromAst(v)
                ))) {
                  distinctElements.push(v);
                }
              }
              return value.context.fromAst(["list", ...distinctElements]);
            }

            return value;
          }
        }
      })
    }

    return stateVariableDefinitions;
  }

}


export class Ceil extends MathBaseOperatorOneInput {
  static componentType = "ceil";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        newValues: {
          mathOperator: function (value) {

            let numericValue = value.evaluate_to_constant();

            // if don't have a number, just return value unchanged
            // TODO: is this the right behavior?
            if (!Number.isFinite(numericValue)) {
              return value;
            }

            // to account for roundoff error, if within rounding error of integer, use that
            let rounded = Math.round(numericValue);
            if (Math.abs((rounded - numericValue) / numericValue) < 1E-15) {
              return me.fromAst(rounded);
            }

            return me.fromAst(Math.ceil(numericValue));
          }
        }
      })
    }


    stateVariableDefinitions.reverseMathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        newValues: {
          reverseMathOperator: value => value
        }
      })
    }

    return stateVariableDefinitions;

  }

}


export class Floor extends MathBaseOperatorOneInput {
  static componentType = "floor";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        newValues: {
          mathOperator: function (value) {

            let numericValue = value.evaluate_to_constant();

            // if don't have a number, just return value unchanged
            // TODO: is this the right behavior?
            if (!Number.isFinite(numericValue)) {
              return value;
            }

            // to account for roundoff error, if within rounding error of integer, use that
            let rounded = Math.round(numericValue);
            if (Math.abs((rounded - numericValue) / numericValue) < 1E-15) {
              return me.fromAst(rounded);
            }

            return me.fromAst(Math.floor(numericValue));

          }
        }
      })
    }


    stateVariableDefinitions.reverseMathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        newValues: {
          reverseMathOperator: value => value
        }
      })
    }

    return stateVariableDefinitions;

  }
}


export class Abs extends MathBaseOperatorOneInput {
  static componentType = "abs";


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        newValues: {
          mathOperator: function (value) {
            // TODO: is this the right behavior?
            // or should <abs>log(5)</abs> yield |log(5)|?
            let numericValue = value.evaluate_to_constant();

            // if don't have a number, just return symbolic absolute value
            if (!Number.isFinite(numericValue)) {
              return me.fromAst(['apply', 'abs', value.tree])
            }

            return me.fromAst(Math.abs(numericValue));
          }
        }
      })
    }

    stateVariableDefinitions.reverseMathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        newValues: {
          reverseMathOperator: value => value
        }
      })
    }

    return stateVariableDefinitions;

  }

}
