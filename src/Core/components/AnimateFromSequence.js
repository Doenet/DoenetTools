import Sequence, { numberToLetters } from './Sequence';
import me from 'math-expressions';
import { processAssignNames } from '../utils/serializedStateProcessing';

export default class AnimateFromSequence extends Sequence {
  constructor(args) {
    super(args);
    this.advanceAnimation = this.advanceAnimation.bind(this);
  }
  static componentType = "animateFromSequence";
  static rendererType = undefined;


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.animationOn = {
      createComponentOfType: "boolean",
      createStateVariable: "animationOn",
      defaultValue: false,
      public: true,
      triggerActionOnChange: "startStopAnimation"
    };

    attributes.animationMode = {
      createComponentOfType: "text",
      createStateVariable: "animationMode",
      defaultValue: "increase",
      validValues: ["increase", "decrease", "increase once", "decrease once", "oscillate"],
      toLowerCase: true,
      public: true,
    };

    attributes.animationInterval = {
      createComponentOfType: "number",
      createStateVariable: "animationInterval",
      defaultValue: 1000,
      public: true,
    };

    attributes.initialSelectedIndex = {
      createComponentOfType: "number",
      createStateVariable: "initialSelectedIndex",
      defaultValue: 1,
      public: true,
    };

    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.possibleValues = {
      additionalStateVariablesDefined: ["numberValues"],
      returnDependencies: () => ({
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        },
        length: {
          dependencyType: "stateVariable",
          variableName: "length"
        },
        from: {
          dependencyType: "stateVariable",
          variableName: "from"
        },
        step: {
          dependencyType: "stateVariable",
          variableName: "step"
        },
        exclude: {
          dependencyType: "stateVariable",
          variableName: "exclude"
        },
        length: {
          dependencyType: "stateVariable",
          variableName: "length"
        },
        lowercase: {
          dependencyType: "stateVariable",
          variableName: "lowercase"
        },

      }),
      definition({ dependencyValues }) {
        let possibleValues = [];

        for (let ind = 0; ind < dependencyValues.length; ind++) {
          let value = dependencyValues.from;
          if (ind > 0) {
            if (dependencyValues.type === "math") {
              value = value.add(dependencyValues.step.multiply(me.fromAst(ind))).expand().simplify();
            } else {
              value += dependencyValues.step * ind;
            }
          }

          if (dependencyValues.type === "math") {
            if (dependencyValues.exclude.some(x => x && x.equals(value))) {
              continue;
            }
          } else {
            if (dependencyValues.exclude.includes(value)) {
              continue;
            }
          }

          if (dependencyValues.type === "letters") {
            value = numberToLetters(value, dependencyValues.lowercase);
          }

          possibleValues.push(value);

        }

        return {
          newValues: {
            possibleValues,
            numberValues: possibleValues.length
          }
        }

      }
    }

    stateVariableDefinitions.selectedIndex = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        numberValues: {
          dependencyType: "stateVariable",
          variableName: "numberValues"
        },
        initialSelectedIndex: {
          dependencyType: "stateVariable",
          variableName: "initialSelectedIndex"
        },
      }),
      definition({ dependencyValues }) {
        return {
          useEssentialOrDefaultValue: {
            selectedIndex: {
              variablesToCheck: ["selectedIndex"],
              get defaultValue() {
                return Math.min(
                  dependencyValues.numberValues,
                  Math.max(1, dependencyValues.initialSelectedIndex)
                );
              }
            }
          }
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "selectedIndex",
            value: me.math.mod(desiredStateVariableValues.selectedIndex - 1, dependencyValues.numberValues) + 1
          }]
        }
      }
    }

    stateVariableDefinitions.value = {
      public: true,
      hasVariableComponentType: true,
      returnDependencies: () => ({
        possibleValues: {
          dependencyType: "stateVariable",
          variableName: "possibleValues"
        },
        selectedIndex: {
          dependencyType: "stateVariable",
          variableName: "selectedIndex"
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
      }),
      definition({ dependencyValues }) {
        return {
          newValues: { value: dependencyValues.possibleValues[dependencyValues.selectedIndex - 1] },
          setComponentType: { value: dependencyValues.type },
        }
      },
      markStale: () => ({ updateReplacements: true }),
      inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues }) {
        // if number, can find closest value
        if (dependencyValues.type === "number") {
          let desiredValue = desiredStateVariableValues.value;
          if (desiredValue instanceof me.class) {
            desiredValue = desiredValue.evaluate_to_constant();
          }
          if (!Number.isFinite(desiredValue)) {
            return { success: false }
          }

          // use binary search
          // find largest index where possibleValue is 
          // larger (or smaller if step is negative) than desiredValue
          let start = -1, end = dependencyValues.possibleValues.length - 1;
          while (start < end - 1) {
            let mid = Math.floor((start + end) / 2); // mid point
            if (stateValues.step * (dependencyValues.possibleValues[mid] - desiredValue) > 0) {
              end = mid;
            } else {
              start = mid;
            }
          }
          let closestInd = end;
          if (start !== -1) {
            if (Math.abs(desiredValue - dependencyValues.possibleValues[start])
              < Math.abs(desiredValue - dependencyValues.possibleValues[end])) {
              closestInd = start;
            }
          }
          return {
            success: true,
            instructions: [{
              setDependency: "selectedIndex",
              desiredValue: closestInd + 1,
            }]
          }
        } else {
          // if not number, just try to find in sequence
          let desiredValue = stateVariablesToUpdate.value;
          let index = dependencyValues.possibleValues.indexOf(desiredValue);
          if (index === -1) {
            return { success: false };
          } else {
            return {
              success: true,
              instructions: [{
                setDependency: "selectedIndex",
                desiredValue: index + 1,
              }]
            }
          }
        }
      }
    }

    stateVariableDefinitions.currentAnimationDirection = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        animationMode: {
          dependencyType: "stateVariable",
          variableName: "animationMode"
        }
      }),
      definition({ dependencyValues }) {
        return {
          useEssentialOrDefaultValue: {
            currentAnimationDirection: {
              variablesToCheck: ["currentAnimationDirection"],
              get defaultValue() {
                if (dependencyValues.animationMode.substring(0, 8) === "decrease") {
                  return "decrease"
                } else {
                  return "increase"
                }
              }
            }
          }
        }
      },
      inverseDefinition({ desiredStateVariableValues }) {
        let newDirection = desiredStateVariableValues.currentAnimationDirection.toLowerCase();
        if (!["increase", "decrease"].includes(newDirection)) {
          newDirection = "increase"
        }
        return {
          success: true,
          instructions: [{
            setStateVariable: "currentAnimationDirection",
            value: newDirection
          }]
        }
      }
    }


    return stateVariableDefinitions;
  }

  startStopAnimation({ stateValues, previousValues }) {

    let updateInstructions = [];

    if (stateValues.animationOn) {
      if (!previousValues.animationOn) {
        let newDirection = this.stateValues.currentAnimationDirection;
        let startIndex = this.stateValues.selectedIndex;
        if (this.stateValues.currentAnimationDirection === "increase") {
          if (this.stateValues.selectedIndex === this.stateValues.numberValues) {
            // started animation in increasing direction
            // but are at largest value
            if (this.stateValues.animationMode === "increase once") {
              // if won't reset automatically,
              // manually reset to beginning before starting
              startIndex = 1;
              updateInstructions.push({
                updateType: "updateValue",
                componentName: this.componentName,
                stateVariable: "selectedIndex",
                value: startIndex,
              })
            } else if (this.stateValues.animationMode === "oscillate") {
              // change direction if oscillating
              newDirection = "decrease";
              updateInstructions.push({
                updateType: "updateValue",
                componentName: this.componentName,
                stateVariable: "currentAnimationDirection",
                value: newDirection,
              })
            }
          }
        } else if (this.stateValues.currentAnimationDirection === "decrease") {
          if (this.stateValues.selectedIndex === 1) {
            // started animation in decreasing direction
            // but are at smallest value
            if (this.stateValues.animationMode === "decrease once") {
              // if won't reset automatically,
              // manually reset to end before starting
              startIndex = this.stateValues.numberValues;
              updateInstructions.push({
                updateType: "updateValue",
                componentName: this.componentName,
                stateVariable: "selectedIndex",
                value: startIndex,
              })
            } else if (this.stateValues.animationMode === "oscillate") {
              // change direction if oscillating
              newDirection = "increase";
              updateInstructions.push({
                updateType: "updateValue",
                componentName: this.componentName,
                stateVariable: "currentAnimationDirection",
                value: newDirection,
              })
            }
          }
        }

        this.coreFunctions.requestUpdate({
          updateInstructions,
          event: {
            verb: "played",
            object: {
              componentName: this.componentName,
              componentType: this.componentType,
            },
            context: {
              startIndex,
              animationDirection: newDirection,
              animationMode: this.stateValues.animationMode
            }
          }
        })

        this.animationID = this.coreFunctions.requestAnimationFrame(
          this.advanceAnimation, this.stateValues.animationInterval
        )
      }
    } else {
      if (previousValues.animationOn) {
        // cancel any animation in progress
        this.coreFunctions.cancelAnimationFrame(this.animationID);
        this.coreFunctions.requestRecordEvent({
          verb: "paused",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          context: {
            endIndex: this.stateValues.selectedIndex,
          }
        })
      }
    }

  }


  actions = {
    startStopAnimation: this.startStopAnimation.bind(this)
  };


  advanceAnimation() {

    let newSelectedIndex;
    let continueAnimation = true;
    let newDirection;
    if (this.stateValues.currentAnimationDirection === "decrease") {
      newSelectedIndex = this.stateValues.selectedIndex - 1;
      if (newSelectedIndex <= 1) {
        if (this.stateValues.animationMode === "decrease once") {
          continueAnimation = false;
        } else if (this.stateValues.animationMode === "oscillate") {
          newDirection = "increase";
        }
      }
    } else {
      newSelectedIndex = this.stateValues.selectedIndex + 1;
      if (newSelectedIndex >= this.stateValues.numberValues) {
        if (this.stateValues.animationMode === "increase once") {
          continueAnimation = false;
        } else if (this.stateValues.animationMode === "oscillate") {
          newDirection = "decrease";
        }
      }
    }

    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "selectedIndex",
      value: newSelectedIndex,
    }]

    if (!continueAnimation) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "animationOn",
        value: false,
      })
    }
    if (newDirection) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "currentAnimationDirection",
        value: newDirection,
      })
    }

    this.coreFunctions.requestUpdate({
      updateInstructions,
    });

    if (continueAnimation) {
      this.animationID = this.coreFunctions.requestAnimationFrame(
        this.advanceAnimation, this.stateValues.animationInterval
      )
    }
  }

  static createSerializedReplacements({ component, componentInfoObjects }) {

    let componentType = component.stateValues.type;
    if (componentType === "letters") {
      componentType = "text";
    }

    let replacements = [{
      componentType,
      state: { value: component.stateValues.value, }
    }];

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: component.attributes.newNamespace,
      componentInfoObjects,
    });

    return { replacements: processResult.serializedComponents };
  }

  static calculateReplacementChanges({ component, componentInfoObjects }) {

    let replacementChanges = [];

    let replacementInstruction = {
      changeType: "updateStateVariables",
      component: component.replacements[0],
      stateChanges: { value: component.stateValues.value }
    }
    replacementChanges.push(replacementInstruction);

    return replacementChanges;

  }

}
