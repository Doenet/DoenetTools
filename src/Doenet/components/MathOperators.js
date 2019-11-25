import MathBaseOperator from './abstract/MathBaseOperator';
import MathBaseOperatorOneInput from './abstract/MathBaseOperatorOneInput';
import me from 'math-expressions';

export class Sum extends MathBaseOperator {
  static componentType = "sum";

  applyMathOperator() {
    if(this.state.nMaths === 0) {
      return me.fromAst(0);
    }
    if(this.state.nMaths === 1) {
      return this.state.mathChildren[0].state.value;
    }
    return this.state.mathChildren.map(x=>x.state.value).reduce((a,c) => a.add(c)).simplify();
  }
}

export class Product extends MathBaseOperator {
  static componentType = "product";

  applyMathOperator() {
    if(this.state.nMaths === 0) {
      return me.fromAst(1);
    }
    if(this.state.nMaths === 1) {
      return this.state.mathChildren[0].state.value;
    }
    return this.state.mathChildren.map(x=>x.state.value).reduce((a,c) => a.multiply(c)).simplify();
  }
}

export class ClampNumber extends MathBaseOperatorOneInput {
  static componentType = "clampnumber";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.lowervalue = {default: 0};
    properties.uppervalue = {default: 1};
    return properties;
  }

  applyMathOperator() {

    return this.clamp(this.state.value);

  }

  clamp(value) {
    let numericValue = value.evaluate_to_constant();

    // if don't have a number, just return value unchanged
    if(!Number.isFinite(numericValue)) {
      return value;
    }
    return me.fromAst(Math.max(this.state.lowervalue, Math.min(this.state.uppervalue, numericValue)));
  }

  reverseMathOperatorForDownstream(x) {
    return this.clamp(x);
  }

}

export class WrapNumberPeriodic extends MathBaseOperatorOneInput {
  static componentType = "wrapnumberperiodic";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.lowervalue = {default: 0};
    properties.uppervalue = {default: 1};
    return properties;
  }

  applyMathOperator() {

    return this.makePeriodic(this.state.value);

  }

  makePeriodic(value) {
    let numericValue = value.evaluate_to_constant();

    // if don't have a number, just return value unchanged
    if(!Number.isFinite(numericValue)) {
      return value;
    }

    let lower = this.state.lowervalue
    let upper = this.state.uppervalue;

    // if bounds are the same, clamp to that value
    if(lower === upper) {
      return me.fromAst(lower);
    }

    // just in case lower is larger than upper, swap values
    if(lower > upper) {
      [upper, lower] = [lower, upper];
    }

    return me.fromAst(
      lower + me.math.mod(
        numericValue-lower,
        upper - lower
      )
    )
  }

  reverseMathOperatorForDownstream(x) {
    return this.makePeriodic(x);
  }

}


export class Round extends MathBaseOperatorOneInput {
  static componentType = "round";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.numberdecimals = {default: 0};
    properties.numberdigits = {default: undefined};
    return properties;
  }

  applyMathOperator() {

    // first convert all numbers and constants (such as pi) to floating point numbers
    let valueWithNumbers = this.state.value.evaluate_numbers({max_digits: Infinity, evaluate_functions: true});

    // // ignore non-numerical values
    // if(!Number.isFinite(numericValue)) {
    //   return this.state.mathChild.state.value;
    // }

    if(this.state.numberdigits !== undefined) {

      return valueWithNumbers.round_numbers_to_precision(this.state.numberdigits);

    } else {

      return valueWithNumbers.round_numbers_to_decimals(this.state.numberdecimals);

    }
  }

  reverseMathOperatorForDownstream(x) {
    return x;
  }

}


export class ConvertSetToList extends MathBaseOperatorOneInput {
  static componentType = "convertsettolist";

  updateState(args={}) {
    if(args.init) {
      this.state.unordered = true;
      this._state.unordered.usedDefault = false;
      this._state.unordered.essential = true;
    }
    super.updateState(args);

  }
  

  applyMathOperator() {

    let value = this.state.value;

    if(value !== undefined && Array.isArray(value.tree) && value.tree[0] === "set") {
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

  applyMathOperator() {
    let numericValue = this.state.value.evaluate_to_constant();

    // if don't have a number, just return value unchanged
    // TODO: is this the right behavior?
    if(!Number.isFinite(numericValue)) {
      return this.state.value;
    }

    // to account for roundoff error, if within rounding error of integer, use that
    let rounded = Math.round(numericValue);
    if(Math.abs((rounded-numericValue)/numericValue) < 1E-15) {
      return rounded;
    }

    return Math.ceil(numericValue);

  }

  reverseMathOperatorForDownstream(x) {
    return x;
  }

}


export class Floor extends MathBaseOperatorOneInput {
  static componentType = "floor";

  applyMathOperator() {
    let numericValue = this.state.value.evaluate_to_constant();

    // if don't have a number, just return value unchanged
    // TODO: is this the right behavior?
    if(!Number.isFinite(numericValue)) {
      return this.state.value;
    }

    // to account for roundoff error, if within rounding error of integer, use that
    let rounded = Math.round(numericValue);
    if(Math.abs((rounded-numericValue)/numericValue) < 1E-15) {
      return rounded;
    }

    return Math.floor(numericValue);

  }

  reverseMathOperatorForDownstream(x) {
    return x;
  }

}


export class Abs extends MathBaseOperatorOneInput {
  static componentType = "abs";

  applyMathOperator() {
    // TODO: is this the right behavior?
    // or should <abs>log(5)</abs> yield |log(5)|?
    let numericValue = this.state.value.evaluate_to_constant();

    // if don't have a number, just return symbolic absolute value
    if(!Number.isFinite(numericValue)) {
      return me.fromAst(['apply', 'abs', this.state.value.tree])
    }

    return Math.abs(numericValue);
  }

  reverseMathOperatorForDownstream(x) {
    return x;
  }

}




export class Derivative extends MathBaseOperatorOneInput {
  static componentType = "derivative";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.variable = {default: me.fromAst('x')};
    return properties;
  }

  applyMathOperator() {

    return this.state.value.derivative(this.state.variable.tree);

  }


}
