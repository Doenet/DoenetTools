import Input from './abstract/Input';

export default class Choiceinput extends Input {
  static componentType = "choiceinput";

  static createPropertiesObject({ standardComponentTypes }) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.selectmultiple = { default: false };
    properties.assignpartialcredit = { default: false };
    properties.inline = { default: false };
    properties.fixedorder = { default: false };
    return properties;
  }

  static returnChildLogic({ standardComponentTypes, allComponentClasses, components }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.newLeaf({
      name: "atLeastZeroChoices",
      componentType: "choice",
      comparison: "atLeast",
      number: 0,
      setAsBase: true,
    })

    return childLogic;
  }


  updateState(args = {}) {
    super.updateState(args);

    if (args.init) {

      this.state.rng = new this.sharedParameters.rngClass();

      this.additionalStateVariablesForReference = ["choiceOrder"];

      this.makePublicStateVariableArray({
        variableName: "selectedindices",
        componentType: "number",
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "selectedindex",
        arrayVariableName: "selectedindices",
      })
      this.makePublicStateVariableAlias({
        variableName: "selectedindex",
        targetName: "selectedindex",
        arrayIndex: '1',
      });

      this.makePublicStateVariableArray({
        variableName: "selectedoriginalindices",
        componentType: "number",
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "selectedoriginalindex",
        arrayVariableName: "selectedoriginalindices",
      })
      this.makePublicStateVariableAlias({
        variableName: "selectedoriginalindex",
        targetName: "selectedoriginalindex",
        arrayIndex: '1',
      });

      this.makePublicStateVariableArray({
        variableName: "selectedvalues",
        componentType: "text",
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "selectedvalue",
        arrayVariableName: "selectedvalues",
      })
      this.makePublicStateVariableAlias({
        variableName: "selectedvalue",
        targetName: "selectedvalue",
        arrayIndex: '1',
      });

      this.makePublicStateVariableArray({
        variableName: "submittedindices",
        componentType: "number",
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "submittedindex",
        arrayVariableName: "submittedindices",
      })
      this.makePublicStateVariableAlias({
        variableName: "submittedindex",
        targetName: "submittedindex",
        arrayIndex: '1',
      });

      this.makePublicStateVariableArray({
        variableName: "submittedoriginalindices",
        componentType: "number",
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "submittedoriginalindex",
        arrayVariableName: "submittedoriginalindices",
      })
      this.makePublicStateVariableAlias({
        variableName: "submittedoriginalindex",
        targetName: "submittedoriginalindex",
        arrayIndex: '1',
      });

      this.makePublicStateVariableArray({
        variableName: "submittedvalues",
        componentType: "text",
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "submittedvalue",
        arrayVariableName: "submittedvalues",
      })
      this.makePublicStateVariableAlias({
        variableName: "submittedvalue",
        targetName: "submittedvalue",
        arrayIndex: '1',
      });

      this.makePublicStateVariable({
        variableName: "creditachieved",
        componentType: "number"
      });
      this.makePublicStateVariable({
        variableName: "numbertimessubmitted",
        componentType: "number"
      });
      this.makePublicStateVariable({
        variableName: "numberchoices",
        componentType: "number"
      });
      this.makePublicStateVariableArray({
        variableName: "choicetexts",
        componentType: "text",
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "choicetext",
        arrayVariableName: "choicetexts",
      });

      this.makePublicStateVariableArray({
        variableName: "awards",
        componentType: "award",
        returnSerializedComponents: returnSerializedComponentsAward,
        emptyForOutOfBounds: true,
      });

      this._state.awards.version = 0;

      // if not essential, initialize submittedindices, submitedvalues to empty array
      if (this._state.submittedindices.essential !== true) {
        this.state.submittedindices = []
      }
      if (this._state.submittedvalues.essential !== true) {
        this.state.submittedindices = []
      }
      if (this._state.numbertimessubmitted.essential !== true) {
        this.state.numbertimessubmitted = 0
      }
      if (this._state.creditachieved.essential !== true) {
        this.state.creditachieved = 0;
      }

      // make selectedindices, submittedindices, creditachieved, numbertimessubmitted essential
      // as they are used to store changed quantities
      this._state.selectedindices.essential = true;
      this._state.selectedvalues.essential = true;
      this._state.submittedindices.essential = true;
      this._state.submittedvalues.essential = true;
      this._state.creditachieved.essential = true;
      this._state.numbertimessubmitted.essential = true;
      this._state.numberchoices.essential = true;

      this.updateSelectedIndices = this.updateSelectedIndices.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      );
      this.setRendererValueAsSubmitted = this.setRendererValueAsSubmitted.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      );

      this.returnChoiceRenderers = this.returnChoiceRenderers.bind(this);

      if(this._state.rendererValueAsSubmitted === undefined) {
        this._state.rendererValueAsSubmitted = {essential: true};
      }

      if(this._state.choiceChildrenComponentNames === undefined) {
        this._state.choiceChildrenComponentNames = {essential: true};
      }

      if (this.state.choiceOrder === undefined) {
        this.state.choiceOrder = [];
      }
      this._state.choiceOrder.essential = true;

    }

    if (!this.childLogicSatisfied) {
      this.unresolvedState.selectedindices = true;
      this.unresolvedState.selectedoriginalindices = true;
      this.unresolvedState.selectedvalues = true;
      return;
    }

    delete this.unresolvedState.selectedindices;
    delete this.unresolvedState.selectedoriginalindices;
    delete this.unresolvedState.selectedvalues;

    // override default fixedorder from shared parameters
    if (this._state.fixedorder.usedDefault) {
      let fixedorderChild = this.sharedParameters.fixedorderChild;
      if (fixedorderChild) {
        if (fixedorderChild.unresolvedState.value) {
          this.unresolvedState.fixedorder = true;
          return;
        }
        this.state.fixedorder = fixedorderChild.state.value;
      } else if (this.sharedParameters.fixedorder) {
        this.state.fixedorder = this.sharedParameters.fixedorder;
      }
      delete this.unresolvedState.fixedorder;
      // delete usedDefault so logic isn't repeated
      delete this._state.fixedorder.usedDefault;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {
      let atLeastZeroChoices = this.childLogic.returnMatches("atLeastZeroChoices");
      let newChoiceChildren = atLeastZeroChoices.map(x => this.activeChildren[x]);

      let actuallyHaveNewChoices = false;
      // check if actually have new choice children

      if (this.state.choiceChildrenComponentNames === undefined ||
        newChoiceChildren.length !== this.state.choiceChildrenComponentNames.length ||
        this.state.choiceChildrenComponentNames.some((v, i) => v !== newChoiceChildren[i].componentName)
      ) {
        actuallyHaveNewChoices = true;
        this.state.choiceChildren = newChoiceChildren;
        this.state.choiceChildrenComponentNames = this.state.choiceChildren.map(v => v.componentName);
      } else if(this.state.choiceChildren === undefined){
        // in case started with choiceChildrenComponentNames in essential state
        this.state.choiceChildren = this.state.choiceChildrenComponentNames.map(x => this.allChildren[x].component);
      }

      if (actuallyHaveNewChoices) {
        this.state.numberchoices = this.state.choiceChildren.length;

        if (this.state.fixedorder) {
          this.state.choiceChildrenOrdered = this.state.choiceChildren;
          this.state.choiceOrder = [...Array(this.state.numberchoices).keys()]
        } else {
          if (this.state.choiceOrder.length !== this.state.numberchoices) {
            // shuffle order every time get new children
            // https://stackoverflow.com/a/12646864
            this.state.choiceOrder = [...Array(this.state.numberchoices).keys()]
            for (let i = this.state.numberchoices - 1; i > 0; i--) {
              const rand = this.state.rng.random();
              const j = Math.floor(rand * (i + 1));
              [this.state.choiceOrder[i], this.state.choiceOrder[j]] = [this.state.choiceOrder[j], this.state.choiceOrder[i]];
            }


          }
          this.state.choiceChildrenOrdered = this.state.choiceOrder.map(i => this.state.choiceChildren[i]);
        }

        this.state.selectedindices = [];
        this.state.selectedoriginalindices = [];
        this.state.selectedvalues = [];

        this.state.awards = this.state.choiceChildrenOrdered;

        // include a version in awards
        // so that ref can know when it should recreate all components
        // (ref typically just looks at componentType, so can't detect order change)
        if (!this.state.fixedorder) {
          this._state.awards.version++;
        }
      } else {
        // don't have new choices, but may need to populate this.state.choiceChildrenOrdered
        // in case starting off with choices from essential state
        if(this.state.choiceChildrenOrdered === undefined) {
          this.state.choiceChildrenOrdered = this.state.choiceOrder.map(i => this.state.choiceChildren[i]);
          this.state.awards = this.state.choiceChildrenOrdered;
        }
      }
    }


    if (this.state.choiceChildrenOrdered.some(x => x.unresolvedState.value)) {
      this.unresolvedState.selectedindices = true;
      this.unresolvedState.selectedoriginalindices = true;
      this.unresolvedState.selectedvalues = true;
      return;
    }

    if (childrenChanged || this.state.choiceChildrenOrdered.some(x => {
      trackChanges.getVariableChanges({ component: x, variable: "textvalue" })
    })) {
      this.state.choicetexts = this.state.choiceChildrenOrdered.map(x => x.state.textvalue);
    }

    this.state.selectedoriginalindices = this.state.selectedindices.map(x => this.state.choiceOrder[x - 1] + 1);
    this.state.selectedvalues = this.state.selectedindices.map(x => this.state.choicetexts[x - 1]);

    if (this.ancestors === undefined) {
      this.unresolvedState.includeCheckWork = true;
      this.unresolvedDependencies = { [this.state.includeCheckWork]: true };
    } else {
      delete this.unresolvedState.includeCheckWork;
      delete this.unresolvedDependencies;

      // if (this.ancestorsWhoGathered === undefined) {
        //mathinput not inside an answer component
        this.state.includeCheckWork = false;
      // } else {
      //   this.state.answerAncestor = undefined;
      //   for (let componentName of this.ancestorsWhoGathered) {
      //     if (this.components[componentName].componentType === "answer") {
      //       this.state.answerAncestor = this.components[componentName];
      //       break;
      //     }
      //   }
      //   if (this.state.answerAncestor === undefined) {
      //     //mathinput not inside an answer component
      //     this.state.includeCheckWork = false;
      //   } else {
      //     this.state.allAwardsJustSubmitted = this.state.answerAncestor.state.allAwardsJustSubmitted;
      //     if (this.state.answerAncestor.state.delegateCheckWork) {
      //       this.state.includeCheckWork = true;
      //     } else {
      //       this.state.includeCheckWork = false;
      //     }
      //   }
      // }
    }
    this.state.valueHasBeenValidated = false;

    if (this.state.allAwardsJustSubmitted && this.state.numbertimessubmitted > 0 &&
      this.state.selectedindices.length === this.state.submittedindices.length &&
      this.state.selectedindices.every((v, i) => v === this.state.submittedindices[i])
    ) {
      this.state.valueHasBeenValidated = true;
    }

    if (this.state.rendererValueAsSubmitted === undefined) {
      // first time through, use valueHasBeenValidated
      this.state.rendererValueAsSubmitted = this.state.valueHasBeenValidated;
    }
  }

  updateSelectedIndices({ selectedindices }) {
    let arrayComponents = {};
    for (let i in selectedindices) {
      arrayComponents[i] = selectedindices[i];
    }
    arrayComponents.length = selectedindices.length;
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: {
          selectedindices: {
            isArray: true,
            changes: { arrayComponents: arrayComponents }
          }
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
      "selectedindices", "selectedvalues",
      "submittedindices", "submittedoriginalindices", "submittedvalues",
      "creditachieved", "numbertimessubmitted",
      "rendererValueAsSubmitted"
    ];
  }

  calculateDownstreamChanges({ stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate }) {

    if ("submittedindices" in stateVariablesToUpdate) {
      let arrayComponents = stateVariablesToUpdate.submittedindices.changes.arrayComponents;
      let theIndices = [];
      for (let ind in arrayComponents) {
        if (ind !== "length") {
          theIndices.push(arrayComponents[ind]);
        }
      }
      for (let [index, child] of this.state.choiceChildrenOrdered.entries()) {
        if (theIndices.includes(index + 1)) {
          dependenciesToUpdate[child.componentName] = { submittedchoice: { changes: true } };
        } else {
          dependenciesToUpdate[child.componentName] = { submittedchoice: { changes: false } };
        }
      }
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
    if (shadowedStateVariables.size === 0) {
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
      updateSelectedIndices: this.updateSelectedIndices,
      setRendererValueAsSubmitted: this.setRendererValueAsSubmitted,
    }
    if (this.state.answerAncestor !== undefined) {
      actions.submitAnswer = this.state.answerAncestor.submitAnswer;
    }

    this.renderer = new this.availableRenderers.choiceinput({
      actions: actions,
      choiceChildren: this.state.choiceChildrenOrdered,
      choicetexts: this.state.choicetexts,
      selectedindices: this.state.selectedindices,
      selectmultiple: this.state.selectmultiple,
      inline: this.state.inline,
      key: this.componentName,
      includeCheckWork: this.state.includeCheckWork,
      creditachieved: this.state.creditachieved,
      valueHasBeenValidated: this.state.valueHasBeenValidated,
      numbertimessubmitted: this.state.numbertimessubmitted,
      returnChoiceRenderers: this.returnChoiceRenderers,
      showCorrectness: this.flags.showCorrectness,
    });
  }

  updateRenderer() {
    this.renderer.updateChoiceinputRenderer({
      choiceChildren: this.state.choiceChildrenOrdered,
      choicetexts: this.state.choicetexts,
      selectedindices: this.state.selectedindices,
      creditachieved: this.state.creditachieved,
      valueHasBeenValidated: this.state.valueHasBeenValidated,
      numbertimessubmitted: this.state.numbertimessubmitted,
      inline: this.state.inline,
    });

  }

  updateChildrenWhoRender() {
    if(this.state.choiceChildrenOrdered === undefined) {
      this.childrenWhoRender = [];
    } else {
      this.childrenWhoRender = this.state.choiceChildrenOrdered.map(x => x.componentName);
    }
  }

  returnChoiceRenderers() {
    let choiceRenderers = [];
    for (let [index, child] of this.state.choiceChildrenOrdered.entries()) {
      let componentRenderer = this.allRenderComponents[child.componentName];
      if (componentRenderer !== undefined) {
        componentRenderer.keyFromInput = this.componentName + "_choice" + index
        choiceRenderers.push(componentRenderer);
      }
    }
    return choiceRenderers;
  }
}


// return the JSON representing the portion of array determined by the given propChildren
function returnSerializedComponentsAward({
  stateVariable, variableName,
  propChildren, propName,
  componentName,
}) {

  let propertiesOfChoiceToRefIntoAward = ["credit", "feedbacktext", "feedbackcode"];

  function returnSerializedAward(index) {

    let reffedProperties = [];
    let choiceComponentName = stateVariable.value[index].componentName;
    for (let prop of propertiesOfChoiceToRefIntoAward) {
      reffedProperties.push(
        {
          componentType: "ref",
          children: [
            {
              componentType: "prop",
              state: { variableName: prop }
            },
            {
              componentType: "reftarget",
              state: { refTargetName: choiceComponentName }
            }
          ]
        }
      )
    }

    return {
      componentType: "award",
      children: [
        ...reffedProperties,
        {
          componentType: "if",
          children: [
            {
              componentType: "ref",
              children: [
                {
                  componentType: "prop",
                  state: { variableName: "selectedindices" },
                  children: [
                    {
                      componentType: "index",
                      state: { value: 0 }
                    }
                  ]
                },
                {
                  componentType: "reftarget",
                  state: { refTargetName: componentName }
                }
              ]
            },
            {
              componentType: "string",
              state: { value: "=" }
            },
            {
              componentType: "number",
              state: { value: index + 1 }
            }
          ]
        }
      ],
      downstreamDependencies: {
        [componentName]: {
          dependencyType: "referenceShadow",
          prop: propName,
        }
      },
    }
  }

  if (propChildren === undefined || propChildren.length === 0) {
    let numComponents = stateVariable.value.length;
    let newComponents = [];
    for (let index = 0; index < numComponents; index++) {
      newComponents.push(returnSerializedAward(index));
    }
    return newComponents;
  } else {
    let numComponents = stateVariable.value.length;
    let index = propChildren[0].state.number;

    // already know index is a non-negative integer
    // else would have failed validateParameters

    let outOfBounds = index >= numComponents;
    if (outOfBounds) {
      return [];
    }
    let newComponents = [returnSerializedAward(index)];

    return newComponents;

  }
}
