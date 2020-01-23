import InlineComponent from './abstract/InlineComponent';
import { textFromComponent } from '../utils/text';

export default class Choice extends InlineComponent {
  static componentType = "choice";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.credit = {default: 0};
    properties.feedbackcode = { default: undefined };
    properties.feedbacktext = { default: undefined };
    return properties;
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atLeastZeroInline",
      componentType: '_inline',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });
    
    return childLogic;
  }


  updateState(args={}) {
    if(args.init === true) {

      this.makePublicStateVariable({
        variableName: "textvalue",
        componentType: this.componentType
      });

      this.makePublicStateVariable({
        variableName: "submittedchoice",
        componentType: "boolean"
      });

      if(!this._state.submittedchoice.essential) {
        this.state.submittedchoice = false;
        this._state.submittedchoice.essential = true;
      }

    }

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.textvalue = true;
      return;
    }

    delete this.unresolvedState.textvalue;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      delete this.unresolvedState.textvalue;

      let atLeastZeroInline = this.childLogic.returnMatches("atLeastZeroInline");

      this.state.inlineChildren = atLeastZeroInline.map(x => this.activeChildren[x]);
    }

    this.state.textvalue = "";

    for(let child of this.state.inlineChildren) {
      let result = textFromComponent({component: child, textClass: this.allComponentClasses.text});
      if(result.unresolved) {
        return
      }
      this.state.textvalue += result.textValue;
    }
  }

  initializeRenderer(){
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.choice({
        key: this.componentName,
      });
    }
  }

  updateChildrenWhoRender(){
    this.childrenWhoRender = this.activeChildren.map(x => x.componentName);
  }
  
  static includeBlankStringChildren = true;

  adapters = ["submittedchoice"];


  allowDownstreamUpdates(status) {
    return true;
  }

  get variablesUpdatableDownstream() {
    // only allowed to change these state variables
    return ["submittedchoice"];
  }

  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {

    let shadowedResult = this.updateShadowSources({
      newStateVariables: stateVariablesToUpdate,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // if didn't update a downstream referenceShadow and didn't have mathChild
    // then this mathinput is at the bottom
    // and we need to give core instructions to update its state variables explicitly
    // if the the update is successful
    if(shadowedStateVariables.size === 0) {
      Object.assign(stateVariableChangesToSave, stateVariablesToUpdate);
    }

    return true;
    
  }


}