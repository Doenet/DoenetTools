import MathComponent from '../Math';

export default class MathOperator extends MathComponent {
  static componentType = "_mathoperator";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);
  
    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: "atLeastZeroMaths",
      componentType: 'math',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;

  }


  updateState(args) {

    super.updateState(args);
    
    if(!this.childLogicSatisfied) {
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      let mathInds = this.childLogic.returnMatches("atLeastZeroMaths");
      this.state.mathChildren = mathInds.map(x=>this.activeChildren[x]);
      this.state.nMaths = mathInds.length;
    }

    if(this.state.nMaths > 0) {
      if(this.state.mathChildren.some(x => x.unresolvedState.value)) {
        this.unresolvedState.value = true;
        this.unresolvedState.latex = true;
        return;
      } else if(childrenChanged || this.state.mathChildren.some(x =>
        trackChanges.getVariableChanges({
          component: x, variable: "value"})
      )) {
        // recalculate value
        this.state.value = this.applyMathOperator();
        delete this.unresolvedState.value;
      }
    }else {
      delete this.unresolvedState.value;
      if(!this._state.value.essential) {
        this.state.value = me.fromAst('\uFF3F'); // long underscore
      }
    }

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
      delete this.unresolvedState.latex;
      delete this.unresolvedState.text;
    }

  }

}
