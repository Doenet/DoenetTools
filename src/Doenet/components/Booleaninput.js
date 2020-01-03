import Input from './abstract/Input';

export default class Booleaninput extends Input {
  static componentType = "booleaninput";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.prefill = {default: ""};
    properties.label = {default: ""};
    return properties;
  }


  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atMostOneBoolean",
      componentType: "boolean",
      comparison: "atMost",
      number: 1,
      setAsBase: true,
    })

    return childLogic;
  }


  updateState(args = {}) {
    super.updateState(args);

    if(args.init) {

      this.makePublicStateVariable({
        variableName: "value",
        componentType: "boolean"
      });
      this.makePublicStateVariable({
        variableName: "submittedvalue",
        componentType: "boolean"
      });
      this.makePublicStateVariable({
        variableName: "creditAchieved",
        componentType: "number"
      });
      this.makePublicStateVariable({
        variableName: "numberTimesSubmitted",
        componentType: "number"
      });
  
      // if not essential, initialize submittedvalue to false
      if(this._state.submittedvalue.essential !== true) {
        this.state.submittedvalue = false;
      }
      if(this._state.numberTimesSubmitted.essential !== true) {
        this.state.numberTimesSubmitted = 0
      }
      if(this._state.creditAchieved.essential !== true) {
        this.state.creditAchieved = 0;
      }
      // make value, submittedvalue, creditAchieved, numberTimesSubmitted essential
      // as they are used to store changed quantities
      this._state.value.essential = true;
      this._state.submittedvalue.essential = true;
      this._state.creditAchieved.essential = true;
      this._state.numberTimesSubmitted.essential = true;

      this.updateBoolean = this.updateBoolean.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      );
      this.setRendererValueAsSubmitted = this.setRendererValueAsSubmitted.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      );

      if(this._state.rendererValueAsSubmitted === undefined) {
        this._state.rendererValueAsSubmitted = {essential: true};
      }
    }

    if(!this.childLogicSatisfied) {
      this.unresolvedState.value = true;
      this.unresolvedState.submittedvalue = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      let atMostOneBoolean = this.childLogic.returnMatches("atMostOneBoolean");
      if(atMostOneBoolean.length === 1) {
        this.state.booleanChild = this.activeChildren[atMostOneBoolean[0]];
      }else {
        delete this.state.booleanChild;
      }
    }

    delete this.unresolvedState.value;
    delete this.unresolvedState.submittedvalue;

    if(this.state.booleanChild !== undefined) {
      if(this.state.booleanChild.unresolvedState.value) {
        this.unresolvedState.value = true;
        this.unresolvedState.submittedvalue = true;
      }else {
        // we could update this only if children changed or value of booleanchild changed
        // but this step is quick
        this.state.value = this.state.booleanChild.state.value;
      }
    }else {
      if(this.state.value === undefined) {
        if(this.unresolvedState.prefill) {
          this.unresolvedState.value = true;
          this.unresolvedState.submittedvalue = true;
        }else {
          if(["true","t"].includes(this.state.prefill.trim().toLowerCase())) {
            this.state.value = true;
          }else {
            this.state.value = false;
          }
        }
      }
    }


    if (this.ancestors === undefined){
      this.unresolvedState.includeCheckWork = true;
      this.unresolvedDependencies = {[this.state.includeCheckWork]: true};
    }else{
      delete this.unresolvedState.includeCheckWork;
      delete this.unresolvedDependencies;

      // if (this.ancestorsWhoGathered === undefined){
        //booleaninput not inside an answer component
        this.state.includeCheckWork = false;
      // }else{
      //   this.state.answerAncestor = undefined;
      //   for (let componentName of this.ancestorsWhoGathered){
      //     if (this.components[componentName].componentType === "answer"){
      //       this.state.answerAncestor = this.components[componentName];
      //       break;
      //     }
      //   }
      //   if (this.state.answerAncestor === undefined){
      //     //booleaninput not inside an answer component
      //     this.state.includeCheckWork = false;
      //   }else{
      //     this.state.allAwardsJustSubmitted = this.state.answerAncestor.state.allAwardsJustSubmitted;
      //     if (this.state.answerAncestor.state.delegateCheckWork){
      //       this.state.includeCheckWork = true;
      //     }else{
      //       this.state.includeCheckWork = false;
      //     }
      //   }
      // }
    }
    this.state.valueHasBeenValidated = false;

    if (this.state.allAwardsJustSubmitted && this.state.numberTimesSubmitted > 0 && this.state.value === this.state.submittedvalue) {
      this.state.valueHasBeenValidated = true;
    }

    if(this.state.rendererValueAsSubmitted === undefined) {
      // first time through, use valueHasBeenValidated
      this.state.rendererValueAsSubmitted = this.state.valueHasBeenValidated;
    }

  }

  updateBoolean({boolean}){
    console.log('updateBoolean')
    console.log(boolean)
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: {
          value: {changes: boolean},
        }
      }]
    })
  }

  setRendererValueAsSubmitted(val) {
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: {
          rendererValueAsSubmitted: {changes: val},
        }
      }]
    })
  }

  allowDownstreamUpdates(status) {
    // since can't change via parents, 
    // only non-initial change can be due to reference
    return(status.initialChange === true || this.state.modifyIndirectly === true);
  }

  get variablesUpdatableDownstream() {
    // for now, only know how to change value and submittedvalue
    return ["value", "submittedvalue", "creditAchieved", "numberTimesSubmitted",
      "rendererValueAsSubmitted"
    ];
  }

  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {

    if("value" in stateVariablesToUpdate && this.state.booleanChild) {
      let booleanName = this.state.booleanChild.componentName;
      dependenciesToUpdate[booleanName] = {value: stateVariablesToUpdate.value};
    }
  
    let shadowedResult = this.updateShadowSources({
      newStateVariables: stateVariablesToUpdate,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // if didn't update a downstream referenceShadow and didn't have booleanChild
    // then this booleaninput is at the bottom
    // and we need to give core instructions to update its state variables explicitly
    // if the the update is successful
    if(Object.keys(shadowedStateVariables).length === 0 &&
        // !isReplacement && 
        !this.state.booleanChild) {
      Object.assign(stateVariableChangesToSave, stateVariablesToUpdate);
    }

    return true;
    
  }

  initializeRenderer({}){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    
    const actions = {
      updateBoolean: this.updateBoolean,
      setRendererValueAsSubmitted: this.setRendererValueAsSubmitted,
    }
    if (this.state.answerAncestor !== undefined){
      actions.submitAnswer = this.state.answerAncestor.submitAnswer;
    }

    this.renderer = new this.availableRenderers.booleaninput({
      actions: actions,
      boolean: this.state.value,
      key: this.componentName,
      label: this.state.label,
      includeCheckWork: this.state.includeCheckWork,
      creditAchieved: this.state.creditAchieved,
      valueHasBeenValidated: this.state.valueHasBeenValidated,
      numberTimesSubmitted: this.state.numberTimesSubmitted,
      showCorrectness: this.flags.showCorrectness,
    });
  }

  updateRenderer(){
    this.renderer.updateBoolean({
      boolean: this.state.value,
      label: this.state.label,
      creditAchieved: this.state.creditAchieved,
      valueHasBeenValidated: this.state.valueHasBeenValidated,
      numberTimesSubmitted: this.state.numberTimesSubmitted,
    });
    
  }
 
}
