import MathComponent from './Math';
import me from 'math-expressions';

export default class NumberComponent extends MathComponent {
  static componentType = "number";

  static stateVariableForPropertyValue = "number";

  updateState(args={}) {
    if(args.init) {
      this.makePublicStateVariable({
        variableName: "number",
        componentType: "number",
      })
    }
    super.updateState(args);

    if(!this.childLogicSatisfied || this.unresolvedState.value) {
      this.unresolvedState.number = true;
      return;
    }



    delete this.unresolvedState.number;

    // calculate number from value
    let constantValue = null;
   
    if(this.state.value !== undefined) {
      // evaluate_to_constant returns null if value doesn't represent a number
      constantValue = this.state.value.evaluate_to_constant();
    }

    if(constantValue === null) {
      this.state.value = me.fromAst('\uFF3F');  // long underscore
      this.state.number = NaN;
      this.state.latex = '\uFF3F';
      this.state.text = '\uFF3F';
    } else {
      this.state.number = constantValue;
      this.state.value = me.fromAst(constantValue);

      let rounded = this.state.value
        .round_numbers_to_precision(this.state.displaydigits);
      this.state.latex = rounded.toLatex();
      this.state.text = rounded.toString();
    }

  }

  updateStateVariable({variable, value}) {
    let varObj = this._state[variable];
    if(varObj === undefined) {
      console.log("Variable " + variable + " not a variable for " + this.componentName);
      return {success: false};
    }
    if(varObj.essential !== true) {
      console.log("Disallowing direct change to variable " + variable + " of " + this.componentName);
      return {success: false};
    }

    if(variable === "value") {
      if(Number.isFinite(value)) {

        // was passed in value as a number
        // make that the number attribute
        this.state.number = value;

        // make value be a math expression with that number
        this.state.value = me.fromAst(this.state.number);
      }else {
        console.log("Number refusing to change to non-finite value");
      }
    }else {
      // use proxy so changes will be tracked
      this.state[variable] = value;
    }

    return {success: true};
  }

}
