import BlockComponent from './abstract/BlockComponent';

export default class Solution extends BlockComponent {
  static componentType = "solution";

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let atLeastZeroInline = childLogic.newLeaf({
      name: "atLeastZeroInline",
      componentType: '_inline',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroBlock = childLogic.newLeaf({
      name: "atLeastZeroBlock",
      componentType: '_block',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: 'inlineOrBlock',
      operator: "or",
      propositions: [atLeastZeroInline, atLeastZeroBlock],
      setAsBase: true,
    })
    
    return childLogic;
  }

  updateState(args = {}) {
    super.updateState(args);


    if(args.init) {

      this.makePublicStateVariable({
        variableName: "open",
        componentType: "boolean"
      });

      this.makePublicStateVariable({
        variableName: "message",
        componentType: "text"
      });
      
      if(!this._state.open.essential) {
        this.state.open = false;
        this._state.open.essential = true;
      }
      if(!this._state.message.essential) {
        this.state.message = "";
        this._state.message.essential = true;
      }
      this.revealSolution = this.revealSolution.bind(this);
      this.revealSolutionCallBack = this.revealSolutionCallBack.bind(this);

    }
  }


  revealSolutionCallBack({allowView,message,scoredComponent}){
    
    let updateInstructions = [{
      componentName: this.componentName,
      variableUpdates: {
        open: {changes: allowView},
        message: {changes: message},
      }
    }];

    if(allowView) {
      updateInstructions.push({
        componentName: scoredComponent.componentName,
        variableUpdates: {
          viewedSolution: {changes: true},
        }
      })
    }

    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: updateInstructions
    })
    
  }



  revealSolution(){
    let document = this.ancestors[this.ancestors.length - 1];
    let { scoredItemNumber, scoredComponent } = document.calculateScoredItemNumberOfContainer(this);
    
    this.externalFunctions.recordSolutionView({
      itemNumber:scoredItemNumber,
      scoredComponent: scoredComponent,
      callBack:this.revealSolutionCallBack
    });
    
  }

  initializeRenderer(){
       
    const actions = {
      revealSolution:this.revealSolution,
    }

    if(this.renderer === undefined) {      
      this.renderer = new this.availableRenderers.solution({
        key: this.componentName,
        message: this.state.message,
        actions: actions,
        displayMode: this.flags.solutionType,
        open:this.state.open,
      });
    }
  }

  updateRenderer(){
    this.renderer.updateRenderer({open:this.state.open,message:this.state.message});
  }

  updateChildrenWhoRender(){
    this.childrenWhoRender = this.activeChildren.map(x => x.componentName);
  }

  allowDownstreamUpdates(status) {
    return true;
  }

  get variablesUpdatableDownstream() {
    return ["open","message"];
  }

  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {
  
    let shadowedResult = this.updateShadowSources({
      newStateVariables: stateVariablesToUpdate,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    if(Object.keys(shadowedStateVariables).length === 0
        // !isReplacement && 
        ) {
      Object.assign(stateVariableChangesToSave, stateVariablesToUpdate);
    }

    return true;
    
  }
  
  static includeBlankStringChildren = true;

}
