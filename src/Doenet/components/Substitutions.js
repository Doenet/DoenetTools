import BaseComponent from './abstract/BaseComponent';

export default class Substitutions extends BaseComponent {
  static componentType = "substitutions";

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.newLeaf({
      name: 'AtLeastZeroChildren',
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args={}) {
    if(args.init) {
      this._state.nIterates = {trackChanges: true}
    }
    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.nIterates = true;
    }
 
    this.state.nIterates = this.activeChildren.length;

  }

  initializeRenderer(){
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.container({ key: this.componentName });
    }
  }

  updateChildrenWhoRender(){
    this.childrenWhoRender = this.childLogic.returnMatches("AtLeastZeroChildren")
      .map(i => this.activeChildren[i].componentName);
  }


}
