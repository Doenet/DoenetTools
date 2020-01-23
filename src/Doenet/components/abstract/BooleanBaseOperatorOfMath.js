import BooleanComponent from '../Boolean';

export default class BooleanBaseOperatorOfMath extends BooleanComponent {
  static componentType = "_booleanoperatorofmath";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);
    
    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: "atLeastOneMath",
      componentType: 'math',
      comparison: 'atLeast',
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

      let mathInds = this.childLogic.returnMatches("atLeastOneMath");
      this.state.nMaths = mathInds.length;
      this.state.mathChildren = mathInds.map(x=>this.activeChildren[x]);
    }

    if(this.state.mathChildren.some(x => x.unresolvedState.value)) {
      this.unresolvedState.value = true;
    }else if(childrenChanged || this.state.mathChildren.some(x => trackChanges.getVariableChanges({
      component: x, variable: "value"
    }))) {

      delete this.unresolvedState.value;
      
      this.state.value = this.applyBooleanOperator();
      
      // text version of value
      this.state.textvalue = this.state.value.toString();
    }

  }


}
