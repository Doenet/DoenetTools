import Text from './Text';

export default class ConditionalText extends Text {
  static componentType = "conditionaltext";

  static includeBlankStringChildren = false;

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneIf = childLogic.newLeaf({
      name: "exactlyOneIf",
      componentType: 'if',
      number: 1,
    });

    childLogic.newOperator({
      name: "IfAndText",
      operator: "and",
      propositions: [exactlyOneIf, childLogic.baseLogic],
      setAsBase: true,
    })
    
    return childLogic;
  }

  updateState(args={}) {
    super.updateState(args);

    if(!this.childLogicSatisfied) {
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {

      let ifInd = this.childLogic.returnMatches("exactlyOneIf")
      this.state.ifChild = this.activeChildren[ifInd[0]];
    }

    // if if not satisified, erase value
    if(this.state.ifChild.evaluateLogic() === 0) {
      this.state.value = "";
    }

  }
}
