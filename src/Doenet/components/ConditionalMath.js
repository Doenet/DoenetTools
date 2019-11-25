import MathComponent from './Math';
import me from 'math-expressions';

export default class ConditionalMath extends MathComponent {
  static componentType = "conditionalmath";

  static includeBlankStringChildren = false;

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

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
      this.state.value = me.fromAst(0);
      this.state.latex = '0';
      this.state.text = '0';
  
    }

  }
}
