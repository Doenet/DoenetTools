import Function from '../Function';

export default class FunctionOperator extends Function {
  static componentType = "_functionoperator";
  
  static numericOnly = true;

  static alwaysContinueUpstreamUpdates = true;

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);
    
    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: "exactlyOneFunction",
      componentType: 'function',
      number: 1,
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
      let functionInds = this.childLogic.returnMatches("exactlyOneFunction");
      this.state.functionChild = this.activeChildren[functionInds[0]];
    }

    if(Object.keys(this.state.functionChild.unresolvedState).length > 0) {
      this.markAllUnresolved();
      return;
    }

    if(childrenChanged || trackChanges.checkIfVariableChanged(this.state.functionChild)) {
      let originalNumericF = this.state.functionChild.returnNumericF();

      this.state.numericF = x => this.applyNumericFunctionOperator(originalNumericF(x));

      let originalF = this.state.functionChild.returnF();

      if(this.constructor.numericOnly) {
        this.state.F = originalF;
      }else {
        this.state.F = x => this.applyFunctionOperator(originalF(x));
      }
    }
  }

  returnNumericF() {
    return this.state.numericF;
  }

  returnF() {
    return this.state.F;
  }

}
