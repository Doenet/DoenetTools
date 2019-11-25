import BlockComponent from './abstract/BlockComponent';

export default class UpdateValue extends BlockComponent {
  static componentType = "updatevalue";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    // properties.width = {default: 300};
    // properties.height = {default: 50};
    properties.label = {default: "update value"};
    
    return properties;
  }

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let ExactlyOneMathTarget = childLogic.newLeaf({
      name: "ExactlyOneMathTarget",
      componentType: 'mathtarget',
      number: 1,
    });

    let ExactlyOneNewMathValue = childLogic.newLeaf({
      name: "ExactlyOneNewMathValue",
      componentType: 'newmathvalue',
      number: 1,
    });

    childLogic.newOperator({
      name: "UpdateValueLogic",
      operator: 'and',
      propositions: [ExactlyOneMathTarget, ExactlyOneNewMathValue],
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args={}) {
    if(args.init) {
      this.updateValue = this.updateValue.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      );
    }

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.mathTargetChild = true;
      return;
    }

    delete this.unresolvedState.mathTargetChild;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {

      const mathTargetInd = this.childLogic.returnMatches('ExactlyOneMathTarget')[0];
      const newMathInd = this.childLogic.returnMatches('ExactlyOneNewMathValue')[0];
      
      this.state.mathTargetChild = this.activeChildren[mathTargetInd];
      this.state.newMathInd = this.activeChildren[newMathInd];
    }
  }

  updateValue({}) {
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.state.mathTargetChild.state.mathChild.componentName,
        variableUpdates: {
          value: {changes: this.state.newMathInd.state.value},
        }
      }]
    });
    
  }

  initializeRenderer({}){
    if(this.renderer !== undefined) {
      return;
    }
    
    const actions = {
      updateValue: this.updateValue,
    }
    
    this.renderer = new this.availableRenderers.updatevalue({
      actions: actions,
      key: this.componentName,
      // width: this.state.width,
      // height: this.state.height,
      label: this.state.label,
    });
  }

}