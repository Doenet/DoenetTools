import InlineComponent from './abstract/InlineComponent';

export default class StringComponent extends InlineComponent {
  static componentType = "string";

  static createPropertiesObject() {
    return {};
  }


  allowDownstreamUpdates() {
    return true;
  }

  get variablesUpdatableDownstream() {
    return ["value"];
  }


  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate, dryRun}) {

    let newStateVariables = {value: stateVariablesToUpdate.value};

    let shadowedResult = this.updateShadowSources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
      dryRun: dryRun
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // if didn't update a downstream referenceShadow
    // then this we're at the bottom
    if(dryRun !== true && !shadowedStateVariables.has("value") && !isReplacement) {
      stateVariableChangesToSave.value = stateVariablesToUpdate.value;
    }

    return true;

  }

  initializeRenderer({}){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    
    this.renderer = new this.availableRenderers.text({
      key: this.componentName,
      text: this.state.value,
      suppressKeyRender: true,
    });
  }

  updateRenderer() {
    this.renderer.updateText(this.state.value);
  }

}
