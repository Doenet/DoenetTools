import NumberBaseOperatorOrNumber from './abstract/NumberBaseOperatorOrNumber';
import me from 'math-expressions';

export class Mean extends NumberBaseOperatorOrNumber {
  static componentType = "mean";

  static applyNumberOperator(numbers) {
    let mean = numbers.reduce((a, c) => a + c);
    mean /= numbers.length;
    return mean;
  }
}


export class Variance extends NumberBaseOperatorOrNumber {
  static componentType = "variance";

  static createPropertiesObject({ standardComponentTypes }) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.unbiased = { default: false };
    return properties;
  }

  static returnStateVariableDefinitions({ sharedParameters }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ sharedParameters });

    if (sharedParameters.defaultToPrescribedParameters) {
      // if prescribed parameter, behaves just as a number component
      return stateVariableDefinitions;
    }

    stateVariableDefinitions.value.returnDependencies = () => ({
      atLeastZeroNumbers: {
        dependencyType: "childStateVariables",
        childLogicName: "atLeastZeroNumbers",
        variableNames: ["value"],
      },
      unbiased: {
        dependencyType: "stateVariable",
        variableName: "unbiased",
      }
    });

    return stateVariableDefinitions;

  }

  static applyNumberOperator(numbers, dependencyValues) {

    let mean = 0, variance = 0;
    for (let num of numbers) {
      mean += num;
      variance += num * num;
    }

    let n = numbers.length;
    mean /= n;
    variance /= n;

    variance -= mean ** 2;

    if (dependencyValues.unbiased) {
      variance *= n / (n - 1);
    }
    return variance;
  }
}


export class StandardDeviation extends Variance {
  static componentType = "standarddeviation"

  static applyNumberOperator(numbers, dependencyValues) {
    return Math.sqrt(super.applyNumberOperator(numbers, dependencyValues));
  }
}


export class Count extends NumberBaseOperatorOrNumber {
  static componentType = "count";

  static applyNumberOperator(numbers) {
    return numbers.length;
  }
}

export class Min extends NumberBaseOperatorOrNumber {
  static componentType = "min";

  static applyNumberOperator(numbers) {
    return numbers.reduce((a, c) => Math.min(a, c), Infinity)
  }
}


export class Max extends NumberBaseOperatorOrNumber {
  static componentType = "max";

  static applyNumberOperator(numbers) {
    return numbers.reduce((a, c) => Math.max(a, c), -Infinity)
  }
}


export class Mod extends NumberBaseOperatorOrNumber {
  static componentType = "mod";

  static applyNumberOperator(numbers) {
    if(numbers.length !== 2) {
      return NaN;
    }
    return me.math.mod(numbers[0],numbers[1]);
  }
}