import FunctionBaseOperator from './abstract/FunctionBaseOperator';
import me from 'math-expressions';

export class ClampFunction extends FunctionBaseOperator {
  static componentType = "clampfunction";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.lowervalue = {default: 0};
    properties.uppervalue = {default: 1};
    return properties;
  }


  applyNumericFunctionOperator(value) {
    let numericValue = value;
    if(numericValue.tree) {
      numericValue = numericValue.evaluate_to_constant();
    }

    // if don't have a number, return NaN
    if(!Number.isFinite(numericValue)) {
      return NaN;
    }
    return Math.max(this.state.lowervalue, Math.min(this.state.uppervalue, numericValue));
  }

}

export class WrapFunctionPeriodic extends FunctionBaseOperator {
  static componentType = "wrapfunctionperiodic";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.lowervalue = {default: 0};
    properties.uppervalue = {default: 1};
    return properties;
  }
  
  applyNumericFunctionOperator(value) {
    let numericValue = value;
    if(numericValue.tree) {
      numericValue = numericValue.evaluate_to_constant();
    }
    // if don't have a number, return NaN
    if(!Number.isFinite(numericValue)) {
      return NaN;
    }

    let lower = this.state.lowervalue
    let upper = this.state.uppervalue;

    // if bounds are the same, clamp to that value
    if(lower === upper) {
      return lower;
    }

    // just in case lower is larger than upper, swap values
    if(lower > upper) {
      [upper, lower] = [lower, upper];
    }

    return (lower + me.math.mod(
        numericValue-lower,
        upper - lower
      )
    )

  }

}

