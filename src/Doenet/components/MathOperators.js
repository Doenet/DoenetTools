import MathBaseOperator from './abstract/MathBaseOperator';
import MathBaseOperatorOneInput from './abstract/MathBaseOperatorOneInput';
import me from 'math-expressions';

export class Sum extends MathBaseOperator {
  static componentType = "sum";

  static applyMathOperator(dependencyValues) {
    return dependencyValues.mathChildren.map(x => x.stateValues.value)
      .reduce((a, c) => a.add(c)).simplify();
  }
}

export class Product extends MathBaseOperator {
  static componentType = "product";

  static applyMathOperator(dependencyValues) {
    return dependencyValues.mathChildren.map(x => x.stateValues.value)
      .reduce((a, c) => a.multiply(c)).simplify();
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

    stateVariableDefinitions.unnormalizedValue.returnDependencies = () => ({
      value: {
        dependencyType: "stateVariable",
        variableName: "unnormalizedValuePreOperator"
      },
      functionChild: {
        dependencyType: "childStateVariables",
        childLogicName: "exactlyOneFunction",
        variableNames: ["formula", "variable"]
      },
      lowerValue: {
        dependencyType: "stateVariable",
        variableName: "lowerValue"
      },
      upperValue: {
        dependencyType: "stateVariable",
        variableName: "upperValue"
      }
    })

    return stateVariableDefinitions;
  }

  static applyMathOperator(dependencyValues) {
    return this.clamp(dependencyValues);
  }

  static clamp({ value, lowerValue, upperValue }) {
    let numericValue = value.evaluate_to_constant();

    // if don't have a number, just return value unchanged
    if (!Number.isFinite(numericValue)) {
      return value;
    }
    return me.fromAst(Math.max(lowerValue, Math.min(upperValue, numericValue)));
  }

  static reverseMathOperator({ desiredValue, dependencyValues }) {
    return this.clamp({
      value: desiredValue,
      lowerValue: dependencyValues.lowerValue,
      upperValue: dependencyValues.upperValue
    });
  }

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

    stateVariableDefinitions.unnormalizedValue.returnDependencies = () => ({
      value: {
        dependencyType: "stateVariable",
        variableName: "unnormalizedValuePreOperator"
      },
      functionChild: {
        dependencyType: "childStateVariables",
        childLogicName: "exactlyOneFunction",
        variableNames: ["formula", "variable"]
      },
      lowerValue: {
        dependencyType: "stateVariable",
        variableName: "lowerValue"
      },
      upperValue: {
        dependencyType: "stateVariable",
        variableName: "upperValue"
      }
    })

    return stateVariableDefinitions;
  }


  static applyMathOperator(dependencyValues) {
    return this.makePeriodic(dependencyValues);
  }

  static makePeriodic({ value, lowerValue, upperValue }) {
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

  static reverseMathOperator({ desiredValue, dependencyValues }) {
    return this.makePeriodic({
      value: desiredValue,
      lowerValue: dependencyValues.lowerValue,
      upperValue: dependencyValues.upperValue
    });
  }

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

    stateVariableDefinitions.unnormalizedValue.returnDependencies = () => ({
      value: {
        dependencyType: "stateVariable",
        variableName: "unnormalizedValuePreOperator"
      },
      functionChild: {
        dependencyType: "childStateVariables",
        childLogicName: "exactlyOneFunction",
        variableNames: ["formula", "variable"]
      },
      numberDecimals: {
        dependencyType: "stateVariable",
        variableName: "numberDecimals"
      },
      numberDigits: {
        dependencyType: "stateVariable",
        variableName: "numberDigits"
      }
    })

    return stateVariableDefinitions;
  }


  static applyMathOperator(dependencyValues) {

    // first convert all numbers and constants (such as pi) to floating point numbers
    let valueWithNumbers = dependencyValues.value.evaluate_numbers({ max_digits: Infinity, evaluate_functions: true });

    // // ignore non-numerical values
    // if(!Number.isFinite(numericValue)) {
    //   return dependencyValues.value;
    // }

    if (dependencyValues.numberDigits !== null) {

      return valueWithNumbers.round_numbers_to_precision(dependencyValues.numberDigits);

    } else {

      return valueWithNumbers.round_numbers_to_decimals(dependencyValues.numberDecimals);

    }
  }

  static reverseMathOperator({ desiredValue }) {
    return desiredValue
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
        newValues: {unordered: true},
        makeEssential: ["unordered"]
      })
    }

    return stateVariableDefinitions;
  }


  static applyMathOperator(dependencyValues) {

    let value = dependencyValues.value;

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


export class Ceil extends MathBaseOperatorOneInput {
  static componentType = "ceil";

  static applyMathOperator(dependencyValues) {
    let numericValue = dependencyValues.value.evaluate_to_constant();

    // if don't have a number, just return value unchanged
    // TODO: is this the right behavior?
    if (!Number.isFinite(numericValue)) {
      return dependencyValues.value;
    }

    // to account for roundoff error, if within rounding error of integer, use that
    let rounded = Math.round(numericValue);
    if (Math.abs((rounded - numericValue) / numericValue) < 1E-15) {
      return me.fromAst(rounded);
    }

    return me.fromAst(Math.ceil(numericValue));

  }

  static reverseMathOperator({ desiredValue }) {
    return desiredValue
  }

}


export class Floor extends MathBaseOperatorOneInput {
  static componentType = "floor";

  static applyMathOperator(dependencyValues) {
    let numericValue = dependencyValues.value.evaluate_to_constant();

    // if don't have a number, just return value unchanged
    // TODO: is this the right behavior?
    if (!Number.isFinite(numericValue)) {
      return dependencyValues.value;
    }

    // to account for roundoff error, if within rounding error of integer, use that
    let rounded = Math.round(numericValue);
    if (Math.abs((rounded - numericValue) / numericValue) < 1E-15) {
      return me.fromAst(rounded);
    }

    return me.fromAst(Math.floor(numericValue));

  }

  static reverseMathOperator({ desiredValue }) {
    return desiredValue
  }
}


export class Abs extends MathBaseOperatorOneInput {
  static componentType = "abs";

  static applyMathOperator(dependencyValues) {
    // TODO: is this the right behavior?
    // or should <abs>log(5)</abs> yield |log(5)|?
    let numericValue = dependencyValues.value.evaluate_to_constant();

    // if don't have a number, just return symbolic absolute value
    if (!Number.isFinite(numericValue)) {
      return me.fromAst(['apply', 'abs', dependencyValues.value.tree])
    }

    return me.fromAst(Math.abs(numericValue));
  }

  static reverseMathOperator({ desiredValue }) {
    return desiredValue
  }

}


export class Derivative extends MathBaseOperatorOneInput {
  static componentType = "derivative";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.variable = { default: me.fromAst('x') };
    return properties;
  }


  static applyMathOperator(dependencyValues) {

    return dependencyValues.value.derivative(dependencyValues.variable.tree);

  }


}
