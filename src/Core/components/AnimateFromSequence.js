import Sequence from './Sequence';
import me from 'math-expressions';

export default class AnimateFromSequence extends Sequence {
  static componentType = "animateFromSequence";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.animationOn = {default: false};
    attributes.animationMode = {default: "increase"};
    attributes.animationInterval = {default: 1000};
    attributes.initialSelectedIndex = {default: 0};
    return attributes;
  }

  updateState(args={}) {
    super.updateState(args);

    if(args.init) {
      this.makePublicStateVariable({
        variableName: "selectedIndex",
        componentType: "number",
      });
      this.makePublicStateVariable({
        variableName: "value", 
        componentType: this.state.type,
      });
      this.makePublicStateVariable({
        variableName: "currentAnimationDirection",
        componentType: "text",
      });

      this.advanceAnimation = this.advanceAnimation.bind(this);
    }

    if(!this.childLogicSatisfied || Object.keys(this.unresolvedState).length > 0) {
      return;
    }

    // if a variable changed, recreate possible values
    if(this.currentTracker.trackChanges.checkIfVariableChanged(this)) {

      this.state.possibleValues = [];

      for(let ind=0; ind < this.state.count; ind++) {
        let componentValue = this.state.from;
        if(ind > 0) {
          if(this.state.type === "math") {
            componentValue = componentValue.add(this.state.step.multiply(me.fromAst(ind))).expand().simplify();
          } else {
            componentValue += this.state.step*ind;
          }
        }

        if(this.state.type === "math") {
          if(this.state.exclude.some(x => x.equals(componentValue))) {
            continue;
          }
        }else {
          if(this.state.exclude.includes(componentValue)) {
            continue;
          }
        }

        if(this.state.type === "letters") {
          componentValue = this.constructor.numberToLetters(componentValue, this.state.lowercase);
        }

        this.state.possibleValues.push(componentValue);

      }

      this.state.numberValues = this.state.possibleValues.length;
    }

    if(this.state.selectedIndex === undefined) {
      this.state.selectedIndex = Math.min(
        this.state.numberValues-1,
        Math.max(0, this.state.initialselectedindex)
      );
      this._state.selectedIndex.essential = true;
    }else {
      this.state.selectedIndex = me.math.mod(this.state.selectedIndex, this.state.numberValues);
    }

    this.state.value = this.state.possibleValues[this.state.selectedIndex];

    this.state.animationMode = this.state.animationMode.toLowerCase();

    if(this.state.animationMode === "oscillate")  {
      if(this.state.currentAnimationDirection === undefined) {
        this.state.currentAnimationDirection = "increase"
      }
    }else if(this.state.animationMode.substring(0,8) == "decrease") {
      this.state.currentAnimationDirection = "decrease";
      if(this.state.animationMode !== "decrease once") {
        this.state.animationMode = "decrease";
      }
    }else {
      this.state.currentAnimationDirection = "increase";
      if(this.state.animationMode !== "increase once") {
        this.state.animationMode = "increase";
      }
    }
    this._state.currentAnimationDirection.essential = true;
    
    if(this.state.animationOn) {
      if(!this.state.animationPreviouslyOn) {
        if(this.state.currentAnimationDirection === "increase") {
          if(this.state.selectedIndex === this.state.numberValues-1) {
            // started animation in increasing direction
            // but are at largest value
            if(this.state.animationMode === "increase once") {
              // if won't reset automatically,
              // manually reset to beginning before starting
              this.state.selectedIndex = 0;
              this.state.value = this.state.possibleValues[this.state.selectedIndex];
            } else if(this.state.animationMode === "oscillate") {
              // change direction if oscillating
              this.state.currentAnimationDirection = "decrease"
            }
          }
        }else if(this.state.currentAnimationDirection === "decrease") {
          if(this.state.selectedIndex === 0) {
            // started animation in decreasing direction
            // but are at smallest value
            if(this.state.animationMode === "decrease once") {
              // if won't reset automatically,
              // manually reset to end before starting
              this.state.selectedIndex = this.state.numberValues-1;
              this.state.value = this.state.possibleValues[this.state.selectedIndex];
            } else if(this.state.animationMode === "oscillate") {
              // change direction if oscillating
              this.state.currentAnimationDirection = "inccrease"
            }
          }
        }

        this.state.animationID = this.coreFunctions.requestAnimationFrame(
          this.advanceAnimation, this.state.animationInterval
        )
        this.state.animationPreviouslyOn = true;
      }
    }else {
      if(this.state.animationPreviouslyOn) {
        // cancel any animation in progress
        this.coreFunctions.cancelAnimationFrame(this.state.animationID);
      }
      this.state.animationPreviouslyOn = false;
    }

  }

  advanceAnimation() {

    let newSelectedIndex;
    let continueAnimation = true;
    let newDirection;
    if(this.state.currentAnimationDirection === "decrease") {
      newSelectedIndex = this.state.selectedIndex - 1;
      if(newSelectedIndex <= 0) {
        if(this.state.animationMode === "decrease once") {
          continueAnimation = false;
        }else if(this.state.animationMode === "oscillate") {
          newDirection = "increase";
        }
      }
    }else {
      newSelectedIndex = this.state.selectedIndex + 1;
      if(newSelectedIndex >= this.state.numberValues -1) {
        if(this.state.animationMode === "increase once") {
          continueAnimation = false;
        }else if(this.state.animationMode === "oscillate") {
          newDirection = "decrease";
        }
      }
    }
    let variableUpdates = {
      selectedIndex: {changes: newSelectedIndex},
    }
    if(!continueAnimation) {
      variableUpdates.animationOn = {changes: false};
    }
    if(newDirection !== undefined) {
      variableUpdates.currentAnimationDirection = {changes: newDirection};
    }

    this.coreFunctions.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: variableUpdates
      }]
    });

    if(continueAnimation) {
      this.state.animationID = this.coreFunctions.requestAnimationFrame(
        this.advanceAnimation, this.state.animationInterval
      )
    }
  }

  static createSerializedReplacements(component) {

    let replacements = [];

    if(component.state.value !== undefined) {
      replacements.push({
        componentType: component.state.type,
        state: {value: component.state.value, hide: component.state.hide}
      });
    }

    return replacements;
  }

  static calculateReplacementChanges({component}) {

    let replacementChanges = [];

    if(component.state.value === undefined) {
      if(component.replacements[0] !== undefined){
        // delete all replacements
        let replacementInstruction = {
          changeType: "delete",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          numberReplacementsToDelete: component.replacements.length,
        }

        replacementChanges.push(replacementInstruction);
      }
      return replacementChanges;
    }

    if(component.replacements[0] === undefined ||
      component.state.type !== component.replacements[0].componentType) {
      // recreate replacements
      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToReplace: component.replacements.length,
        serializedReplacements: component.constructor.createSerializedReplacements(component),
      };
      replacementChanges.push(replacementInstruction);
      return replacementChanges;
    }

    let replacementInstruction = {
      changeType: "updateStateVariables",
      component: component.replacements[0],
      stateChanges: {value: component.state.value}
    }
    replacementChanges.push(replacementInstruction);

    return replacementChanges;

  }


  allowDownstreamUpdates(status) {
    return status.initialChange || this.state.modifyIndirectly;
  }

  get variablesUpdatableDownstream() {
    return ["value", "selectedIndex", "animationOn", "currentAnimationDirection"];
  }


  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {

    let newStateVariables = {};

    if("selectedIndex" in stateVariablesToUpdate) {
      newStateVariables.selectedIndex = stateVariablesToUpdate.selectedIndex;
    }
    if("animationOn" in stateVariablesToUpdate) {
      newStateVariables.animationOn = stateVariablesToUpdate.animationOn;
    }
    if("currentAnimationDirection" in stateVariablesToUpdate) {
      newStateVariables.currentAnimationDirection = stateVariablesToUpdate.currentAnimationDirection;
    }
    if("value" in stateVariablesToUpdate) {
      // if number, can find closest value
      if(this.state.type === "number") {
        let desiredValue = stateVariablesToUpdate.value.changes;
        if(!(typeof desiredValue === "number")) {
          desiredValue = desiredValue.evaluate_to_constant();
        }
        if(!(typeof desiredValue === "number")) {
          return false;
        }

        // use binary search
        // find largest index where possibleValue is 
        // larger (or smaller if step is negative) than desiredValue
        let step = this.state.step
        let start=-1, end = this.state.possibleValues.length-1;
        while(start < end-1) {
          let mid = Math.floor((start+end)/2); // mid point
          if(step*(this.state.possibleValues[mid] - desiredValue) > 0) {
            end=mid;
          }else {
            start=mid;
          }
        }
        let closestInd = end;
        if(start !== -1) {
          if(Math.abs(desiredValue - this.state.possibleValues[start])
            < Math.abs(desiredValue - this.state.possibleValues[end])) {
            closestInd = start;
          }
        }
        newStateVariables.selectedIndex = {changes: closestInd};
      }else  {
        // if not number, just try to find in sequence
        let desiredValue = stateVariablesToUpdate.value;
        let index = this.state.possibleValues.indexOf(desiredValue);
        if(index === -1) {
          return false;
        }
        newStateVariables.selectedIndex = {changes: index};
      }
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
