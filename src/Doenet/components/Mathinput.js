import Input from './abstract/Input';
import me from 'math-expressions';

export default class Mathinput extends Input {
  constructor(args) {
    super(args);
    this.updateMathExpression = this.updateMathExpression.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
    this.setRendererValueAsSubmitted = this.setRendererValueAsSubmitted.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
  }
  static componentType = "mathinput";

  static createPropertiesObject({ standardComponentTypes }) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.prefill = { default: "" };
    properties.format = { default: "text" };
    properties.size = { default: 10 };
    return properties;
  }

  static returnChildLogic({ standardComponentTypes, allComponentClasses, components }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.newLeaf({
      name: "atMostOneMath",
      componentType: "math",
      comparison: "atMost",
      number: 1,
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.value = {
      public: true,
      componentType: "math",
      returnDependencies: () => ({
        mathChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneMath",
          variableNames: ["value", "valueForDisplay"],
        },
        prefill: {
          dependencyType: "stateVariable",
          variableName: "prefill"
        },
        format: {
          dependencyType: "stateVariable",
          variableName: "format"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.mathChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              value: {
                variablesToCheck: "value",
                get defaultValue() {
                  return parseValueIntoMath({
                    inputString: dependencyValues.prefill,
                    format: dependencyValues.format
                  })
                }
              }
            }
          }
        }

        // since value will be displayed, round to displaydigits
        return { newValues: { value: dependencyValues.mathChild[0].stateValues.valueForDisplay } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        if (dependencyValues.mathChild.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "mathChild",
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

    return stateVariableDefinitions;

  }


  updateState(args = {}) {
    super.updateState(args);

    if (args.init) {

      this.makePublicStateVariable({
        variableName: "value",
        componentType: "math",
      });
      this.makePublicStateVariable({
        variableName: "submittedvalue",
        componentType: "math",
      });
      this.makePublicStateVariable({
        variableName: "creditachieved",
        componentType: "number"
      });
      this.makePublicStateVariable({
        variableName: "numbertimessubmitted",
        componentType: "number"
      });

      // if not essential, initialize submittedvalue to empty math
      if (this._state.submittedvalue.essential !== true) {
        this.state.submittedvalue = me.fromAst('\uFF3F');  // initialize to empty math
      }
      if (this._state.numbertimessubmitted.essential !== true) {
        this.state.numbertimessubmitted = 0
      }
      if (this._state.creditachieved.essential !== true) {
        this.state.creditachieved = 0;
      }

      // make value, submittedvalue, creditachieved, numbertimessubmitted essential
      // as they are used to store changed quantities
      this._state.value.essential = true;
      this._state.submittedvalue.essential = true;
      this._state.creditachieved.essential = true;
      this._state.numbertimessubmitted.essential = true;

      this.updateMathExpression = this.updateMathExpression.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      );
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
      let atMostOneMath = this.childLogic.returnMatches("atMostOneMath");
      if (atMostOneMath.length === 1) {
        this.state.mathChild = this.activeChildren[atMostOneMath[0]];
      } else {
        delete this.state.mathChild;
      }
    }

    delete this.unresolvedState.value;
    delete this.unresolvedState.submittedvalue;

    if (this.state.mathChild !== undefined) {
      if (this.state.mathChild.unresolvedState.value) {
        this.unresolvedState.value = true;
        this.unresolvedState.submittedvalue = true;
      } else if (childrenChanged ||
        trackChanges.getVariableChanges({
          component: this.state.mathChild, variable: "value"
        }) ||
        trackChanges.getVariableChanges({
          component: this.state.mathChild, variable: "displaydigits"
        })
      ) {
        // since value will be displayed, round to displaydigits
        this.state.value = this.state.mathChild.state.value
          .round_numbers_to_precision(this.state.mathChild.state.displaydigits);
      }
    } else {
      if (this.state.value === undefined) {
        if (this.unresolvedState.prefill) {
          this.unresolvedState.value = true;
          this.unresolvedState.submittedvalue = true;
        } else {
          this.calculateValueFromPrefill();
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
      //mathinput not inside an answer component
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
      //     //mathinput not inside an answer component
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

    if (this.state.allAwardsJustSubmitted && this.state.numbertimessubmitted > 0 && this.state.value.equalsViaSyntax(this.state.submittedvalue)) {
      this.state.valueHasBeenValidated = true;
    }

    if (this.state.rendererValueAsSubmitted === undefined) {
      // first time through, use valueHasBeenValidated
      this.state.rendererValueAsSubmitted = this.state.valueHasBeenValidated;
    }
  }


  updateMathExpression({ mathExpression }) {
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        stateVariable: "value",
        value: mathExpression,
      }]
    })
  }

  setRendererValueAsSubmitted(val) {
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        stateVariable: "rendererValueAsSubmitted",
        value: val,
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
      "value", "submittedvalue", "creditachieved", "numbertimessubmitted",
      "rendererValueAsSubmitted"
    ];
  }

  calculateDownstreamChanges({ stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate }) {

    if ("value" in stateVariablesToUpdate && this.state.mathChild) {
      let mathName = this.state.mathChild.componentName;
      dependenciesToUpdate[mathName] = { value: stateVariablesToUpdate.value };
    }

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
    if (shadowedStateVariables.size === 0 &&
      //!isReplacement && 
      !this.state.mathChild) {
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
      updateMathExpression: this.updateMathExpression,
      setRendererValueAsSubmitted: this.setRendererValueAsSubmitted,
    }
    if (this.stateValues.answerAncestor !== undefined) {
      actions.submitAnswer = this.stateValues.answerAncestor.submitAnswer;
    }

    this.renderer = new this.availableRenderers.mathinput({
      actions: actions,
      mathExpression: new Proxy(this.stateValues.value, this.readOnlyProxyHandler),
      key: this.componentName,
      includeCheckWork: this.stateValues.includeCheckWork,
      creditachieved: this.stateValues.creditachieved,
      valueHasBeenValidated: this.stateValues.valueHasBeenValidated,
      numbertimessubmitted: this.stateValues.numbertimessubmitted,
      size: this.stateValues.size,
      showCorrectness: this.flags.showCorrectness,
    });
  }

  updateRenderer() {
    this.renderer.updateMathinputRenderer({
      mathExpression: new Proxy(this.stateValues.value, this.readOnlyProxyHandler),
      creditachieved: this.stateValues.creditachieved,
      valueHasBeenValidated: this.stateValues.valueHasBeenValidated,
      numbertimessubmitted: this.stateValues.numbertimessubmitted,
    });

  }

}


function parseValueIntoMath({ inputString, format }) {

  if (!inputString) {
    return me.fromAst('\uFF3F');
  }

  let expression;
  if (format === "latex") {
    try {
      expression = me.fromLatex(inputString);
    } catch (e) {
      console.warn(`Invalid latex for mathinput: ${inputString}`)
      expression = me.fromAst('\uFF3F');
    }
  } else if (format === "text") {
    try {
      expression = me.fromText(inputString);
    } catch (e) {
      console.warn(`Invalid text for mathinput: ${inputString}`)
      expression = me.fromAst('\uFF3F');
    }
  }
  return expression;
}
