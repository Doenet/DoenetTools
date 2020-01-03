import Input from './abstract/Input';

export default class Textinput extends Input {
  constructor(args) {
    super(args);
    this.updateText = this.updateText.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
  }
  static componentType = "textinput";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.prefill = { default: "" };
    properties.size = { default: 10 };
    return properties;
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atMostOneText",
      componentType: "text",
      comparison: "atMost",
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.value = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        textChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneText",
          variableNames: ["value"],
        },
        prefill: {
          dependencyType: "stateVariable",
          variableName: "prefill"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.textChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              value: { variablesToCheck: "value", defaultValue: dependencyValues.prefill }
            }
          }
        }
        return { newValues: { value: dependencyValues.textChild[0].stateValues.value } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        if (dependencyValues.textChild.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "textChild",
              desiredValue: desiredStateVariableValues.value,
              childIndex: 0,
              variableIndex: 0,
            }]
          };
        }
        // no children, so value is essential and give it the desired value
        return {
          success: true,
          instructions: [{
            setStateVariable: "value",
            value: desiredStateVariableValues.value
          }]
        };
      }
    }

    stateVariableDefinitions.componentTypes = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { componentTypes: ["text"] } })
    }




    stateVariableDefinitions.numberTimesSubmitted = {
      public: true,
      componentType: "number",
      defaultValue: 0,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          numberTimesSubmitted: {
            variablesToCheck: ["numberTimesSubmitted"]
          }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "numberTimesSubmitted",
            value: desiredStateVariableValues.numberTimesSubmitted
          }]
        };
      }
    }


    stateVariableDefinitions.creditAchieved = {
      defaultValue: 0,
      public: true,
      componentType: "number",
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          creditAchieved: {
            variablesToCheck: ["creditAchieved"]
          }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "creditAchieved",
            value: desiredStateVariableValues.creditAchieved
          }]
        };
      }
    }


    stateVariableDefinitions.submittedValue = {
      defaultValue: "",
      public: true,
      componentType: "text",
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          submittedValue: {
            variablesToCheck: ["submittedValue"]
          }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "submittedValue",
            value: desiredStateVariableValues.submittedValue
          }]
        };
      }
    }

    stateVariableDefinitions.rendererValueAsSubmitted = {
      returnDependencies: () => ({

      }),
      definition: function ({ dependencyValues }) {
        console.warn('todo')
        return {
          newValues: {
            rendererValueAsSubmitted: true
          }
        }
      }
    }

    return stateVariableDefinitions;

  }

  updateState(args = {}) {
    super.updateState(args);

    if (args.init) {

      this.makePublicStateVariable({
        variableName: "value",
        componentType: "text",
      });
      this.makePublicStateVariable({
        variableName: "submittedvalue",
        componentType: "text",
      });
      this.makePublicStateVariable({
        variableName: "creditAchieved",
        componentType: "number"
      });
      this.makePublicStateVariable({
        variableName: "numberTimesSubmitted",
        componentType: "number"
      });

      // if not essential, initialize submittedvalue to empty string
      if (this._state.submittedvalue.essential !== true) {
        this.state.submittedvalue = ""
      }
      if (this._state.numberTimesSubmitted.essential !== true) {
        this.state.numberTimesSubmitted = 0
      }
      if (this._state.creditAchieved.essential !== true) {
        this.state.creditAchieved = 0;
      }
      // make value, submittedvalue, creditAchieved, numberTimesSubmitted essential
      // as they are used to store changed quantities
      this._state.value.essential = true;
      this._state.submittedvalue.essential = true;
      this._state.creditAchieved.essential = true;
      this._state.numberTimesSubmitted.essential = true;


      this.setRendererValueAsSubmitted = this.setRendererValueAsSubmitted.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      );

      if (this._state.rendererValueAsSubmitted === undefined) {
        this._state.rendererValueAsSubmitted = { essential: true };
      }
    }

    if (!this.childLogicSatisfied) {
      this.unresolvedState.value = true;
      this.unresolvedState.submittedvalue = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {
      let atMostOneText = this.childLogic.returnMatches("atMostOneText");
      if (atMostOneText.length === 1) {
        this.state.textChild = this.activeChildren[atMostOneText[0]];
      } else {
        delete this.state.textChild;
      }
    }

    delete this.unresolvedState.value;
    delete this.unresolvedState.submittedvalue;

    if (this.state.textChild !== undefined) {
      if (this.state.textChild.unresolvedState.value) {
        this.unresolvedState.value = true;
        this.unresolvedState.submittedvalue = true;
      } else {
        // we could update this only if children changed or value of textchild changed
        // but this step is quick
        this.state.value = this.state.textChild.state.value;
      }
    } else {
      if (this.state.value === undefined) {
        if (this.unresolvedState.prefill) {
          this.unresolvedState.value = true;
          this.unresolvedState.submittedvalue = true;
        } else {
          this.state.value = this.state.prefill;
        }
      }
    }

    if (this.ancestors === undefined) {
      this.unresolvedState.includeCheckWork = true;
      this.unresolvedDependencies = { [this.state.includeCheckWork]: true };
    } else {
      delete this.unresolvedState.includeCheckWork;
      delete this.unresolvedDependencies;

      // if (this.ancestorsWhoGathered === undefined){
      //textinput not inside an answer component
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
      //     //textinput not inside an answer component
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

    if (this.state.rendererValueAsSubmitted === undefined) {
      // first time through, use valueHasBeenValidated
      this.state.rendererValueAsSubmitted = this.state.valueHasBeenValidated;
    }

  }


  updateText({ text }) {
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        stateVariable: "value",
        value: text,
      }]
    })
  }

  setRendererValueAsSubmitted(val) {
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: {
          rendererValueAsSubmitted: { changes: val },
        }
      }]
    })
  }

  allowDownstreamUpdates(status) {
    // since can't change via parents, 
    // only non-initial change can be due to reference
    return (status.initialChange === true || this.state.modifyIndirectly === true);
  }

  get variablesUpdatableDownstream() {
    // only allowed to change these state variables
    return [
      "value", "submittedvalue", "creditAchieved", "numberTimesSubmitted",
      "rendererValueAsSubmitted"
    ];
  }

  calculateDownstreamChanges({ stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate }) {

    if ("value" in stateVariablesToUpdate && this.state.textChild) {
      let textName = this.state.textChild.componentName;
      dependenciesToUpdate[textName] = { value: { changes: stateVariablesToUpdate.value.changes } };
    }

    let shadowedResult = this.updateShadowSources({
      newStateVariables: stateVariablesToUpdate,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;


    // if didn't update a downstream referenceShadow and didn't have textChild
    // then this textinput is at the bottom
    // and we need to give core instructions to update its state variables explicitly
    // if the the update is successful
    if (Object.keys(shadowedStateVariables).length === 0 &&
      // !isReplacement && 
      !this.state.textChild) {
      Object.assign(stateVariableChangesToSave, stateVariablesToUpdate);
    }

    return true;

  }

  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    const actions = {
      updateText: this.updateText,
      setRendererValueAsSubmitted: this.setRendererValueAsSubmitted,
    }
    if (this.stateValues.answerAncestor !== undefined) {
      actions.submitAnswer = this.stateValues.answerAncestor.submitAnswer;
    }

    this.renderer = new this.availableRenderers.textinput({
      actions: actions,
      text: this.stateValues.value,
      key: this.componentName,
      includeCheckWork: this.stateValues.includeCheckWork,
      creditAchieved: this.stateValues.creditAchieved,
      valueHasBeenValidated: this.stateValues.valueHasBeenValidated,
      numberTimesSubmitted: this.stateValues.numberTimesSubmitted,
      size: this.stateValues.size,
      showCorrectness: this.flags.showCorrectness,
    });
  }

  updateRenderer() {
    this.renderer.updateTextinputRenderer({
      text: this.stateValues.value,
      creditAchieved: this.stateValues.creditAchieved,
      valueHasBeenValidated: this.stateValues.valueHasBeenValidated,
      numberTimesSubmitted: this.stateValues.numberTimesSubmitted,
    });

  }

}
