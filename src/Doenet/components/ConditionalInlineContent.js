import InlineComponent from './abstract/InlineComponent';

export default class ConditionalInlineContent extends InlineComponent {
  static componentType = "conditionalinlinecontent";

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let AtMostOneIf = childLogic.newLeaf({
      name: "AtMostOneIf",
      componentType: 'if',
      comparison: 'atMost',
      number: 1,
      allowSpillover: false,
    });

    let AtLeastZeroInline = childLogic.newLeaf({
      name: "AtLeastZeroInline",
      componentType: '_inline',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "IfAndRest",
      operator: "and",
      propositions: [AtMostOneIf, AtLeastZeroInline],
      setAsBase: true,
    })
    
    return childLogic;
  }

  updateState(args={}) {
    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.hide = true;
      return;
    }
    delete this.unresolvedState.hide;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {

      let ifInd = this.childLogic.returnMatches("AtMostOneIf")
      if(ifInd.length === 1) {
        this.state.ifChild = this.activeChildren[ifInd[0]];
      }else {
        delete this.state.ifChild;
      }
    }

    if(this.state.ifChild) {
      this.state.hide = this.state.ifChild.evaluateLogic() === 0;
    }

  }
  
  initializeRenderer(){
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.container({ key: this.componentName });
    }
  }

  updateChildrenWhoRender(){

    this.childrenWhoRender = this.activeChildren.map(x => x.componentName);

    if(this.state.ifChild !== undefined) {
      this.childrenWhoRender = this.childrenWhoRender.filter(x => x !== this.state.ifChild.componentName);
    }
  }


}
