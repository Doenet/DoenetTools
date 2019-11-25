import MathComponent from '../Math';

export default class MathOperatorOneInput extends MathComponent {
  static componentType = "_mathoperatoroneinput";

  updateState(args) {

    super.updateState(args);
    
    if(!this.childLogicSatisfied || Object.keys(this.unresolvedState).length > 0) {
      return;
    }

    if(this.state.stringMathChildren !== undefined) {
      this.state.value = this.applyMathOperator();
    }

    let trackChanges = this.currentTracker.trackChanges;

    if(trackChanges.getVariableChanges({
      component: this, variable: "value"
    }) ||
    trackChanges.getVariableChanges({
      component: this, variable: "displaydigits"
    })) {
      this.normalizeValue();
      let rounded = this.normalizeValue(this.state.value
        .round_numbers_to_precision(this.state.displaydigits));
      this.state.latex = rounded.toLatex();
      this.state.text = rounded.toString();
    }
  }



  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {


    if("value" in stateVariablesToUpdate) {
      stateVariablesToUpdate.value = {
        changes: this.reverseMathOperatorForDownstream(
          stateVariablesToUpdate.value.changes)
      }
    }

    return super.calculateDownstreamChanges({
      stateVariablesToUpdate: stateVariablesToUpdate,
      stateVariableChangesToSave: stateVariableChangesToSave,
      dependenciesToUpdate: dependenciesToUpdate
    });

  }

}
