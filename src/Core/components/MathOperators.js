import { returnRoundingStateVariableDefinitions } from "../utils/rounding";
import MathBaseOperator from "./abstract/MathBaseOperator";
import MathBaseOperatorOneInput from "./abstract/MathBaseOperatorOneInput";
import me from "math-expressions";

export class Sum extends MathBaseOperator {
  static componentType = "sum";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          numericOperator: function (inputs) {
            return inputs.reduce((a, c) => a + c);
          },
        },
      }),
    };

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          mathOperator: function (inputs) {
            return inputs.reduce((a, c) => a.add(c));
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

export class Product extends MathBaseOperator {
  static componentType = "product";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          numericOperator: function (inputs) {
            return inputs.reduce((a, c) => a * c);
          },
        },
      }),
    };

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          mathOperator: function (values) {
            return values.reduce((a, c) => a.multiply(c));
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

export class ClampNumber extends MathBaseOperatorOneInput {
  static componentType = "clampNumber";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.lowerValue = {
      createComponentOfType: "number",
      createStateVariable: "lowerValue",
      defaultValue: 0,
      public: true,
    };
    attributes.upperValue = {
      createComponentOfType: "number",
      createStateVariable: "upperValue",
      defaultValue: 1,
      public: true,
    };
    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.isNumericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { isNumericOperator: true } }),
    };

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({
        lowerValue: {
          dependencyType: "stateVariable",
          variableName: "lowerValue",
        },
        upperValue: {
          dependencyType: "stateVariable",
          variableName: "upperValue",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          mathOperator: function (value) {
            return clamp({
              value,
              lowerValue: dependencyValues.lowerValue,
              upperValue: dependencyValues.upperValue,
            });
          },
        },
      }),
    };

    stateVariableDefinitions.inverseMathOperator = {
      returnDependencies: () => ({
        lowerValue: {
          dependencyType: "stateVariable",
          variableName: "lowerValue",
        },
        upperValue: {
          dependencyType: "stateVariable",
          variableName: "upperValue",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          inverseMathOperator: function (value) {
            return clamp({
              value,
              lowerValue: dependencyValues.lowerValue,
              upperValue: dependencyValues.upperValue,
            });
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

function clamp({ value, lowerValue, upperValue }) {
  let numericValue = value;
  if (numericValue instanceof me.class) {
    numericValue = numericValue.evaluate_to_constant();
  }
  return me.fromAst(Math.max(lowerValue, Math.min(upperValue, numericValue)));
}

export class WrapNumberPeriodic extends MathBaseOperatorOneInput {
  static componentType = "wrapNumberPeriodic";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.lowerValue = {
      createComponentOfType: "number",
      createStateVariable: "lowerValue",
      defaultValue: 0,
      public: true,
    };
    attributes.upperValue = {
      createComponentOfType: "number",
      createStateVariable: "upperValue",
      defaultValue: 1,
      public: true,
    };
    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.isNumericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { isNumericOperator: true } }),
    };

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({
        lowerValue: {
          dependencyType: "stateVariable",
          variableName: "lowerValue",
        },
        upperValue: {
          dependencyType: "stateVariable",
          variableName: "upperValue",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          mathOperator: function (value) {
            return makePeriodic({
              value,
              lowerValue: dependencyValues.lowerValue,
              upperValue: dependencyValues.upperValue,
            });
          },
        },
      }),
    };

    stateVariableDefinitions.inverseMathOperator = {
      returnDependencies: () => ({
        lowerValue: {
          dependencyType: "stateVariable",
          variableName: "lowerValue",
        },
        upperValue: {
          dependencyType: "stateVariable",
          variableName: "upperValue",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          inverseMathOperator: function (value) {
            return makePeriodic({
              value,
              lowerValue: dependencyValues.lowerValue,
              upperValue: dependencyValues.upperValue,
            });
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

function makePeriodic({ value, lowerValue, upperValue }) {
  let numericValue = value;
  if (numericValue instanceof me.class) {
    numericValue = numericValue.evaluate_to_constant();
  }

  if (!Number.isFinite(numericValue)) {
    return me.fromAst(NaN);
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
    lowerValue +
      me.math.mod(numericValue - lowerValue, upperValue - lowerValue),
  );
}

export class Round extends MathBaseOperatorOneInput {
  static componentType = "round";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.numDecimals = {
      createComponentOfType: "number",
      createStateVariable: "numDecimals",
      defaultValue: 0,
      public: true,
    };
    attributes.numDigits = {
      createComponentOfType: "number",
      createStateVariable: "numDigits",
      defaultValue: null,
      public: true,
    };
    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // change default rounding to 14
    // so that actual rounding result can be seen.
    // Don't include maths for childsGroupIfSingleMatch
    // so that this overrides display rounding from children
    let roundingDefinitions = returnRoundingStateVariableDefinitions({
      includeListParents: true,
      displayDigitsDefault: 14,
    });
    Object.assign(stateVariableDefinitions, roundingDefinitions);

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({
        numDecimals: {
          dependencyType: "stateVariable",
          variableName: "numDecimals",
        },
        numDigits: {
          dependencyType: "stateVariable",
          variableName: "numDigits",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          mathOperator: function (value) {
            // first convert all numbers and constants (such as pi) to floating point numbers
            let valueWithNumbers = value.evaluate_numbers({
              max_digits: Infinity,
              evaluate_functions: true,
            });

            if (dependencyValues.numDigits !== null) {
              return valueWithNumbers.round_numbers_to_precision(
                dependencyValues.numDigits,
              );
            } else {
              return valueWithNumbers.round_numbers_to_decimals(
                dependencyValues.numDecimals,
              );
            }
          },
        },
      }),
    };

    stateVariableDefinitions.inverseMathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          inverseMathOperator: (value) => value,
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

export class setSmallToZero extends MathBaseOperatorOneInput {
  static componentType = "setSmallToZero";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.threshold = {
      createComponentOfType: "number",
      createStateVariable: "threshold",
      defaultValue: 1e-14,
      public: true,
    };
    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({
        threshold: {
          dependencyType: "stateVariable",
          variableName: "threshold",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          mathOperator: function (value) {
            return value.evaluate_numbers({
              skip_ordering: true,
              set_small_zero: dependencyValues.threshold,
            });
          },
        },
      }),
    };

    stateVariableDefinitions.inverseMathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          inverseMathOperator: (value) => value,
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

export class ConvertSetToList extends MathBaseOperatorOneInput {
  static componentType = "convertSetToList";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    delete attributes.unordered;
    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.unordered = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: { unordered: true },
      }),
    };

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          mathOperator: function (value) {
            if (
              value !== undefined &&
              Array.isArray(value.tree) &&
              value.tree[0] === "set"
            ) {
              let distinctElements = [];
              for (let v of value.tree.slice(1)) {
                // if v doesn't match any previous elements, add to array
                if (
                  !distinctElements.some((x) =>
                    value.context.equalsViaSyntax(
                      value.context.fromAst(x),
                      value.context.fromAst(v),
                    ),
                  )
                ) {
                  distinctElements.push(v);
                }
              }
              return value.context.fromAst(["list", ...distinctElements]);
            }

            return value;
          },
        },
      }),
    };

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
        setValue: {
          mathOperator: function (value) {
            let numericValue = value.evaluate_to_constant();

            // if don't have a number, just return symbolic ceil
            if (!Number.isFinite(numericValue)) {
              return me.fromAst(["apply", "ceil", value.tree]);
            }

            // to account for roundoff error, if within rounding error of integer, use that
            let rounded = Math.round(numericValue);
            if (Math.abs((rounded - numericValue) / numericValue) < 1e-15) {
              return me.fromAst(rounded);
            }

            return me.fromAst(Math.ceil(numericValue));
          },
        },
      }),
    };

    stateVariableDefinitions.inverseMathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          inverseMathOperator: (value) => value,
        },
      }),
    };

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
        setValue: {
          mathOperator: function (value) {
            let numericValue = value.evaluate_to_constant();

            // if don't have a number, just return symbolic floor
            if (!Number.isFinite(numericValue)) {
              return me.fromAst(["apply", "floor", value.tree]);
            }

            // to account for roundoff error, if within rounding error of integer, use that
            let rounded = Math.round(numericValue);
            if (Math.abs((rounded - numericValue) / numericValue) < 1e-15) {
              return me.fromAst(rounded);
            }

            return me.fromAst(Math.floor(numericValue));
          },
        },
      }),
    };

    stateVariableDefinitions.inverseMathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          inverseMathOperator: (value) => value,
        },
      }),
    };

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
        setValue: {
          mathOperator: function (value) {
            // TODO: is this the right behavior?
            // or should <abs>log(5)</abs> yield |log(5)|?
            let numericValue = value.evaluate_to_constant();

            // if don't have a number, just return symbolic absolute value
            if (!Number.isFinite(numericValue)) {
              return me.fromAst(["apply", "abs", value.tree]);
            }

            return me.fromAst(Math.abs(numericValue));
          },
        },
      }),
    };

    stateVariableDefinitions.inverseMathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          inverseMathOperator: function (value) {
            let desiredValue = value;
            let valueNumeric = value.evaluate_to_constant();
            if (Number.isFinite(valueNumeric)) {
              if (valueNumeric < 0) {
                desiredValue = me.fromAst(0);
              }
            } else if (
              Array.isArray(value.tree) &&
              value.tree[0] === "apply" &&
              value.tree[1] === "abs"
            ) {
              desiredValue = me.fromAst(value.tree[2]);
            }
            return desiredValue;
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

export class Sign extends MathBaseOperatorOneInput {
  static componentType = "sign";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          mathOperator: function (value) {
            let numericValue = value.evaluate_to_constant();

            // if don't have a number, just return symbolic sign
            if (!Number.isFinite(numericValue)) {
              return me.fromAst(["apply", "sign", value.tree]);
            }

            return me.fromAst(Math.sign(numericValue));
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

export class Mean extends MathBaseOperator {
  static componentType = "mean";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          numericOperator: function (inputs) {
            let mean = inputs.reduce((a, c) => a + c);
            mean /= inputs.length;
            return mean;
          },
        },
      }),
    };

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          mathOperator: function (inputs) {
            return inputs.reduce((a, c) => a.add(c)).divide(inputs.length);
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

export class Median extends MathBaseOperator {
  static componentType = "median";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.isNumericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { isNumericOperator: true } }),
    };

    stateVariableDefinitions.numericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          numericOperator: function (inputs) {
            return me.math.median(inputs);
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

export class Variance extends MathBaseOperator {
  static componentType = "variance";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.population = {
      createComponentOfType: "boolean",
      createStateVariable: "population",
      defaultValue: false,
      public: true,
    };
    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numericOperator = {
      returnDependencies: () => ({
        population: {
          dependencyType: "stateVariable",
          variableName: "population",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          numericOperator: function (inputs) {
            return calculateNumericVariance(
              inputs,
              dependencyValues.population,
            );
          },
        },
      }),
    };

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({
        population: {
          dependencyType: "stateVariable",
          variableName: "population",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          mathOperator: function (inputs) {
            return calculateSymbolicVariance(
              inputs,
              dependencyValues.population,
            );
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

function calculateNumericVariance(inputs, population) {
  let sum = 0,
    variance = 0;
  for (let num of inputs) {
    sum += num;
    variance += num * num;
  }

  let n = inputs.length;
  // variance /= n;

  variance -= sum ** 2 / n;

  if (population) {
    variance /= n;
  } else {
    variance /= n - 1;
  }
  return variance;
}

function calculateSymbolicVariance(inputs, population) {
  let n = inputs.length;

  let sum = inputs.reduce((a, c) => a.add(c));

  let variance = inputs
    .slice(1)
    .reduce((a, c) => a.add(c.pow(2)), inputs[0].pow(2))
    .subtract(sum.pow(2).divide(n));

  if (population) {
    variance = variance.divide(n);
  } else {
    variance = variance.divide(n - 1);
  }

  return variance;
}

export class StandardDeviation extends Variance {
  static componentType = "standardDeviation";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numericOperator.definition = ({
      dependencyValues,
    }) => ({
      setValue: {
        numericOperator: function (inputs) {
          return Math.sqrt(
            calculateNumericVariance(inputs, dependencyValues.population),
          );
        },
      },
    });

    stateVariableDefinitions.mathOperator.definition = ({
      dependencyValues,
    }) => ({
      setValue: {
        mathOperator: function (inputs) {
          return me.fromAst([
            "apply",
            "sqrt",
            calculateSymbolicVariance(inputs, dependencyValues.population).tree,
          ]);
        },
      },
    });

    return stateVariableDefinitions;
  }
}

export class Count extends MathBaseOperator {
  static componentType = "count";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.isNumericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { isNumericOperator: true } }),
    };

    stateVariableDefinitions.numericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          numericOperator: function (inputs) {
            return inputs.length;
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

export class Min extends MathBaseOperator {
  static componentType = "min";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          numericOperator: function (inputs) {
            return inputs.reduce((a, c) => Math.min(a, c), Infinity);
          },
        },
      }),
    };

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          mathOperator: function (inputs) {
            return me.fromAst([
              "apply",
              "min",
              ["tuple", ...inputs.map((x) => x.tree)],
            ]);
          },
        },
      }),
    };

    stateVariableDefinitions.inverseMathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          inverseMathOperator: function ({ desiredValue, canBeModified }) {
            // if have just one input that can be modified, set that one to desired value
            if (canBeModified.filter((x) => x).length === 1) {
              let inputNumber = canBeModified.indexOf(true);
              if (inputNumber >= 0) {
                return {
                  success: true,
                  inputValue: desiredValue,
                  inputNumber,
                };
              }
            }
            return { success: false };
          },
        },
      }),
    };

    stateVariableDefinitions.inverseNumericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          inverseNumericOperator: function ({
            desiredValue,
            canBeModified,
            desiredMathValue,
          }) {
            // if have just one input that can be modified, set that one to desired value
            if (canBeModified.filter((x) => x).length === 1) {
              let inputNumber = canBeModified.indexOf(true);
              if (inputNumber >= 0) {
                if (!Number.isFinite(desiredValue)) {
                  desiredValue = desiredMathValue;
                }
                return {
                  success: true,
                  inputValue: desiredValue,
                  inputNumber,
                };
              }
            }
            return { success: false };
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

export class Max extends MathBaseOperator {
  static componentType = "max";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          numericOperator: function (inputs) {
            return inputs.reduce((a, c) => Math.max(a, c), -Infinity);
          },
        },
      }),
    };

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          mathOperator: function (inputs) {
            return me.fromAst([
              "apply",
              "max",
              ["tuple", ...inputs.map((x) => x.tree)],
            ]);
          },
        },
      }),
    };

    stateVariableDefinitions.inverseMathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          inverseMathOperator: function ({ desiredValue, canBeModified }) {
            // if have just one input that can be modified, set that one to desired value
            if (canBeModified.filter((x) => x).length === 1) {
              let inputNumber = canBeModified.indexOf(true);
              if (inputNumber >= 0) {
                return {
                  success: true,
                  inputValue: desiredValue,
                  inputNumber,
                };
              }
            }
            return { success: false };
          },
        },
      }),
    };

    stateVariableDefinitions.inverseNumericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          inverseNumericOperator: function ({
            desiredValue,
            canBeModified,
            desiredMathValue,
          }) {
            // if have just one input that can be modified, set that one to desired value
            if (canBeModified.filter((x) => x).length === 1) {
              let inputNumber = canBeModified.indexOf(true);
              if (inputNumber >= 0) {
                if (!Number.isFinite(desiredValue)) {
                  desiredValue = desiredMathValue;
                }
                return {
                  success: true,
                  inputValue: desiredValue,
                  inputNumber,
                };
              }
            }
            return { success: false };
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

export class Mod extends MathBaseOperator {
  static componentType = "mod";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          numericOperator: function (inputs) {
            if (inputs.length !== 2) {
              return NaN;
            }
            return me.math.mod(inputs[0], inputs[1]);
          },
        },
      }),
    };

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          mathOperator: function (inputs) {
            if (inputs.length !== 2) {
              return me.fromAst("\uff3f");
            }
            return me.fromAst([
              "apply",
              "mod",
              ["tuple", ...inputs.map((x) => x.tree)],
            ]);
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

export class Gcd extends MathBaseOperator {
  static componentType = "gcd";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          numericOperator: function (inputs) {
            if (inputs.every(Number.isInteger)) {
              return gcd(...inputs);
            }
            return NaN;
          },
        },
      }),
    };

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          mathOperator: function (inputs) {
            return me.fromAst([
              "apply",
              "gcd",
              ["tuple", ...inputs.map((x) => x.tree)],
            ]);
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}

export class ExtractMath extends MathBaseOperatorOneInput {
  static componentType = "extractMath";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.type = {
      createComponentOfType: "text",
      createStateVariable: "type",
      defaultValue: null,
      toLowerCase: true,
      validValues: ["operand", "function", "functionargument", "numoperands"],
    };
    attributes.operandNumber = {
      createComponentOfType: "number",
      createStateVariable: "operandNumber",
      defaultValue: null,
      public: true,
    };
    attributes.argumentNumber = {
      createComponentOfType: "number",
      createStateVariable: "argumentNumber",
      defaultValue: null,
      public: true,
    };
    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        operandNumber: {
          dependencyType: "stateVariable",
          variableName: "operandNumber",
        },
        argumentNumber: {
          dependencyType: "stateVariable",
          variableName: "argumentNumber",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.type === "operand") {
          if (dependencyValues.operandNumber === null) {
            let warning = {
              message: `Must specify a operandNumber when extracting a math operand.`,
              level: 1,
            };
            return {
              setValue: {
                mathOperator: () => me.fromAst("\uff3f"),
              },
              sendWarnings: [warning],
            };
          }
          return {
            setValue: {
              mathOperator: function (value) {
                let tree = value.tree;

                if (!Array.isArray(tree)) {
                  if (dependencyValues.operandNumber === 1) {
                    return value;
                  } else {
                    return me.fromAst("\uff3f");
                  }
                }

                let operator = tree[0];

                if (operator === "apply") {
                  if (dependencyValues.operandNumber === 1) {
                    return value;
                  } else {
                    return me.fromAst("\uff3f");
                  }
                }

                let operand = tree[dependencyValues.operandNumber];

                if (operand === undefined) {
                  return me.fromAst("\uff3f");
                } else {
                  return me.fromAst(operand);
                }
              },
            },
          };
        } else if (dependencyValues.type === "function") {
          return {
            setValue: {
              mathOperator: function (value) {
                let tree = value.tree;

                if (!Array.isArray(tree)) {
                  return me.fromAst("\uff3f");
                }

                let operator = tree[0];

                if (operator !== "apply") {
                  return me.fromAst("\uff3f");
                }

                return me.fromAst(tree[1]);
              },
            },
          };
        } else if (dependencyValues.type === "functionargument") {
          return {
            setValue: {
              mathOperator: function (value) {
                let tree = value.tree;

                if (!Array.isArray(tree)) {
                  return me.fromAst("\uff3f");
                }

                let operator = tree[0];

                if (operator !== "apply") {
                  return me.fromAst("\uff3f");
                }

                let allArgs = tree[2];

                if (dependencyValues.argumentNumber === null) {
                  return me.fromAst(allArgs);
                } else if (dependencyValues.argumentNumber === 1) {
                  if (!(Array.isArray(allArgs) && allArgs[0] === "tuple")) {
                    return me.fromAst(allArgs);
                  } else {
                    return me.fromAst(allArgs[1]);
                  }
                } else {
                  if (!(Array.isArray(allArgs) && allArgs[0] === "tuple")) {
                    return me.fromAst("\uff3f");
                  } else {
                    let theArg = allArgs[dependencyValues.argumentNumber];
                    if (theArg === undefined) {
                      return me.fromAst("\uff3f");
                    } else {
                      return me.fromAst(theArg);
                    }
                  }
                }
              },
            },
          };
        } else if (dependencyValues.type === "numoperands") {
          return {
            setValue: {
              mathOperator: function (value) {
                let tree = value.tree;

                if (!Array.isArray(tree)) {
                  return me.fromAst(1);
                }

                let operator = tree[0];

                if (operator === "apply") {
                  return me.fromAst(1);
                }

                return me.fromAst(tree.length - 1);
              },
            },
          };
        } else {
          return {
            setValue: {
              mathOperator: (_) => me.fromAst("_"),
            },
          };
        }
      },
    };

    return stateVariableDefinitions;
  }
}

function gcd(x, y, ...z) {
  if (!y && z.length > 0) {
    return gcd(x, ...z);
  }
  if (!y) {
    return x;
  }
  return gcd(y, x % y, ...z);
}
