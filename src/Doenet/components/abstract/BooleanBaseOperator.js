import BooleanComponent from '../Boolean';

export default class BooleanOperator extends BooleanComponent {
  static componentType = "_booleanoperator";

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });
    
    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: "atLeastOneBoolean",
      componentType: 'boolean',
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

      let booleanInds = this.childLogic.returnMatches("atLeastOneBoolean");
      this.state.nBooleans = booleanInds.length;
      this.state.booleanChildren = booleanInds.map(x=>this.activeChildren[x]);
    }

    if(this.state.booleanChildren.some(x => x.unresolvedState.value)) {
      this.unresolvedState.value = true;
    }else if(childrenChanged || this.state.booleanChildren.some(x => trackChanges.getVariableChanges({
      component: x, variable: "value"
    }))) {

      delete this.unresolvedState.value;
      
      this.state.value = this.applyBooleanOperator();
      
      // text version of value
      this.state.textvalue = this.state.value.toString();
    }

  }


}
