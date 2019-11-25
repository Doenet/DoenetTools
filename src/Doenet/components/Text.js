import InlineComponent from './abstract/InlineComponent';

export default class Text extends InlineComponent {
  static componentType = "text";

  static includeBlankStringChildren = true;

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let atLeastZeroStrings = childLogic.newLeaf({
      name: "atLeastZeroStrings",
      componentType: 'string',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroTexts = childLogic.newLeaf({
      name: "atLeastZeroTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "stringsAndTexts",
      operator: 'and',
      propositions: [atLeastZeroStrings, atLeastZeroTexts],
      requireConsecutive: true,
      setAsBase: true
    });
    
    return childLogic;
  }


  updateState(args={}) {
    if(args.init === true) {

      // make default reference (with no prop) be value
      this.stateVariablesForReference = ["value"];

      this.makePublicStateVariable({
        variableName: "value",
        componentType: this.componentType
      });
    }

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.value = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      delete this.unresolvedState.value;

      let stringsAndTexts = this.childLogic.returnMatches("stringsAndTexts");

      // if stringsAndTexts is undefined, then a superclass
      // must have overwritten childLogic, so skip this processing
      if(stringsAndTexts === undefined) {
        this.state.textChildLogicOverwritten = true;
        return;
      }

      if(stringsAndTexts.length > 0) {
        this.state.stringTextChildren = stringsAndTexts.map(x => this.activeChildren[x]);
      }else {
        delete this.state.stringTextChildren;
      }
    }

    if(this.state.textChildLogicOverwritten) {
      return;
    }

    if(this.state.stringTextChildren !== undefined) {
      this.state.value = "";
      delete this.unresolvedState.value;
      for(let child of this.state.stringTextChildren) {
        if(child.unresolvedState.value) {
          this.unresolvedState.value = true;
          break;
        }
        this.state.value += child.state.value;
      }
    }else {

      if(this._state.value.essential !== true) {
        // if no string/text activeChildren and value wasn't set from state directly,
        // make value be blank and set it to be essential so any changes will be saved
        this.state.value = "";
        this._state.value.essential = true;
      }

    }

    if(childrenChanged) {
      this.state.modifiablefromabove = this.determineModifiableFromAbove();
    }

  }

  determineModifiableFromAbove() {

    if(this.state.modifybyreference !== true) {
      return false;
    }

    // if have 1 or fewer string or text child,
    // then can potentially set that child (or essential state variable)
    // to any specified string
    if(!this.state.stringTextChildren || this.state.stringTextChildren.length === 1) {
      return true;
    }else {
      return false;
    }
  }

  initializeRenderer({}){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    
    this.renderer = new this.availableRenderers.text({
      key: this.componentName,
      text: this.state.value,
    });
  }

  updateRenderer() {
    this.renderer.updateText(this.state.value);
  }

  allowDownstreamUpdates() {
    return this.state.modifiablefromabove;
  }

  get variablesUpdatableDownstream() {
    return ["value"];
  }

  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {

    let newStateVariables = {};

    if("value" in stateVariablesToUpdate) {
      newStateVariables.value = {changes: stateVariablesToUpdate.value.changes};
    }

    if(this.state.stringTextChildren && this.state.stringTextChildren.length === 1) {
      let childName = this.state.stringTextChildren[0].componentName;
      dependenciesToUpdate[childName] = {value: newStateVariables.value};
    }

    let shadowedResult = this.updateShadowSources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // add value to stateVariableChangesToSave if value is essential
    // and no shadow sources were updated with value
    if(this._state.value.essential === true &&
        !shadowedStateVariables.has("value") && !isReplacement) {
      stateVariableChangesToSave.value = newStateVariables.value;
    }

    return true;

  }

}