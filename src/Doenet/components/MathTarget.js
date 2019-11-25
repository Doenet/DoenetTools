import BaseComponent from './abstract/BaseComponent';

export default class MathTarget extends BaseComponent {
  static componentType = "mathtarget";

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.newLeaf({
      name: "ExactlyOneMath",
      componentType: 'math',
      number: 1,
      setAsBase: true
    });

    return childLogic;
  }

  updateState(args={}) {
    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.mathChild = true;
      return;
    }

    delete this.unresolvedState.mathChild;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      let mathInd = this.childLogic.returnMatches("ExactlyOneMath")[0];
      this.state.mathChild = this.activeChildren[mathInd];
    }
  }

}