import InlineComponent from './abstract/InlineComponent';

export default class BooleanComponent extends InlineComponent {
  static componentType = "boolean";


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

    let stringsAndTexts = childLogic.newOperator({
      name: "stringsAndTexts",
      operator: 'and',
      propositions: [atLeastZeroStrings, atLeastZeroTexts],
      requireConsecutive: true,
    });
    
    let exactlyOneBoolean = childLogic.newLeaf({
      name: "exactlyOneBoolean",
      componentType: 'boolean',
      number: 1,
    });
    
    let exactlyOneIf = childLogic.newLeaf({
      name: "exactlyOneIf",
      componentType: 'if',
      number: 1,
    });

    childLogic.newOperator({
      name: "TextXorBooleanXorIf",
      operator: "xor",
      propositions: [stringsAndTexts, exactlyOneBoolean, exactlyOneIf],
      setAsBase: true,
    })

    return childLogic;
  }


  updateState(args={}) {
    if(args.init === true) {

      // make default reference (with no prop) be value
      this.stateVariablesForReference = ["value"];

      this.makePublicStateVariable({
        variableName: "textvalue",
        componentType: "text"
      });
  
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

      let exactlyOneBoolean = this.childLogic.returnMatches("exactlyOneBoolean");

      // if exactlyOneBoolean is undefined, then a superclass
      // must have overwritten childLogic, so skip this processing
      if(exactlyOneBoolean === undefined) {
        this.state.booleanChildlogicOverwritten = true;
        return;
      }

      if(exactlyOneBoolean.length === 1) {
        this.state.booleanChild = this.activeChildren[exactlyOneBoolean[0]];
  
      } else {
        delete this.state.booleanChild;

        let exactlyOneIf = this.childLogic.returnMatches("exactlyOneIf");

        if(exactlyOneIf.length === 1) {
          this.state.ifChild = this.activeChildren[exactlyOneIf[0]];
        } else {
          delete this.state.ifChild;

          let stringsAndTexts = this.childLogic.returnMatches("stringsAndTexts");
    
          if(stringsAndTexts.length > 0) {
            this.state.stringAndTextChildren = stringsAndTexts.map(x => this.activeChildren[x]);
          }else {
            delete this.state.stringAndTextChildren;
          }
        }
      }
    }

    if(this.state.booleanChildlogicOverwritten) {
      return;
    }

    if(this.state.booleanChild !== undefined) {
      if(this.state.booleanChild.unresolvedState.value) {
        this.unresolvedState.value = true;
      }else if(childrenChanged || trackChanges.getVariableChanges({
          component: this.state.booleanChild, variable: "value"})) {
        this.state.value = this.state.booleanChild.state.value;
        delete this.unresolvedState.value;
      }

    } else if(this.state.ifChild) {
      this.state.value = this.state.ifChild.evaluateLogic() !== 0;
    } else {

      if(this.state.stringAndTextChildren !== undefined) {
        this.state.value = "";
        delete this.unresolvedState.value;
        for(let child of this.state.stringAndTextChildren) {
          if(child.unresolvedState.value) {
            this.unresolvedState.value = true;
            break;
          }
          this.state.value += child.state.value;
        }

        // convert string to boolean
        if(["true","t"].includes(this.state.value.trim().toLowerCase())) {
          this.state.value = true;
        }else {
          this.state.value = false;
        }

      }else {
        // no boolean, string or text children
  
        if(this._state.value.essential !== true) {
          if(this._state.implicitValue !== undefined && 
             this._state.implicitValue.essential === true) {

            // have an essential implicitValue state variable
            // but no essential value state variable
            // use value from implicitValue
            this.state.value = this.state.implicitValue;

          } else {
            // no information about value, set to be false
            this.state.value = false;
          }
          
          // set value to be essential so changes will be saved to value
          // and above default logic (implicitValue or false) will be skipped
          this._state.value.essential = true;
        }
      }
    }

    // text version of value
    this.state.textvalue = this.state.value ? "true" : "false";

    if(childrenChanged) {
      this.state.modifiablefromabove = this.determineModifiableFromAbove();
    }

  }


  initializeRenderer({}){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    
    this.renderer = new this.availableRenderers.text({
      key: this.componentName,
      text: this.state.textvalue
    });
  }

  updateRenderer() {
    this.renderer.updateText(this.state.textvalue);
  }

  determineModifiableFromAbove() {

    if(this.state.modifybyreference !== true) {
      return false;
    }

    if(this.state.booleanChildlogicOverwritten) {
      return false;
    }

    // if based on another boolean child
    // then can potentiall set that child to value
    if(this.state.booleanChild) {
      return true;
    }

    // if have at most 1 string or text child,
    // then can potentially set that child (or the essential state variable)
    // to string or boolean
    if(!this.state.stringAndTextChildren || this.state.stringAndTextChildren.length === 1) {
      return true;
    }else {
      return false;
    }
  }


  allowDownstreamUpdates(status) {
    return this.state.modifiablefromabove;
  }


  get variablesUpdatableDownstream() {
    return ["value"];
  }


  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {

    let newStateVariables = {};

    // TODO: need if statement here if have other updateable state variables
    newStateVariables.value = {changes: stateVariablesToUpdate.value.changes};

    if(this.state.booleanChild !== undefined) {
      let booleanName = this.state.booleanChild.componentName;

      dependenciesToUpdate[booleanName] = {value: newStateVariables.value};
    }else if(this.state.stringAndTextChildren !== undefined) {
      let stringAndTextName = this.state.stringAndTextChildren[0].componentName;

      dependenciesToUpdate[stringAndTextName] = {value: {changes: newStateVariables.value.changes.toString()}};
    }

    this.updatePropertySources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
    })

    let shadowedResult = this.updateShadowSources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // add stateVariable to stateVariableChangesToSave if is essential
    // and no shadow sources were updated
    for(let varname in newStateVariables) {
      if(this._state[varname].essential === true &&
          !shadowedStateVariables.has(varname) && !isReplacement) {
        stateVariableChangesToSave[varname] = newStateVariables[varname];
      }
    }

    return true;

  }


}