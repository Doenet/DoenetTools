import BooleanBaseOperatorOfMath from './abstract/BooleanBaseOperatorOfMath';

export class IsInteger extends BooleanBaseOperatorOfMath {
  static componentType = "isinteger";

  applyBooleanOperator() {
    if(this.state.nMaths !== 1) {
      throw Error("IsInteger requires exactly one math child");
    }
    let numericValue = this.state.mathChildren[0].state.value.evaluate_to_constant();

    if(!Number.isFinite(numericValue)) {
      return false;
    }
    
    // to account for round off error, round to nearest integer
    // and check if close to that integer
    let rounded = Math.round(numericValue);
    if(Math.abs(rounded-numericValue) <= 1E-15*Math.abs(numericValue)) {
      return true;
    } else{
      return false;
    }

  }
}
