import BaseComponent from './abstract/BaseComponent';
import { returnSequenceValues, returnStandardSequenceAttributes, returnStandardSequenceStateVariableDefinitions } from '../utils/sequence';
import me from 'math-expressions';
import { nanoid } from 'nanoid';

export default class AnimateFromSequence extends BaseComponent {
  constructor(args) {
    super(args);
    this.advanceAnimation = this.advanceAnimation.bind(this);
  }
  static componentType = "animateFromSequence";
  static rendererType = undefined;

  static acceptTarget = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    let sequenceAttributes = returnStandardSequenceAttributes();
    Object.assign(attributes, sequenceAttributes);

    attributes.prop = {
      createPrimitiveOfType: "string",
    };

    attributes.componentIndex = {
      createComponentOfType: "number",
      createStateVariable: "componentIndex",
      defaultValue: null,
      public: true,
    };

    attributes.animationOn = {
      createComponentOfType: "boolean",
      createStateVariable: "animationOn",
      defaultValue: false,
      public: true,
      triggerActionOnChange: "changedAnimationOn"
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

    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let sequenceDefs = returnStandardSequenceStateVariableDefinitions();
    Object.assign(stateVariableDefinitions, sequenceDefs);

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
        lowercase: {
          dependencyType: "stateVariable",
          variableName: "lowercase"
        },

      }),
      definition({ dependencyValues }) {

        let possibleValues = returnSequenceValues(dependencyValues);

        return {
          setValue: {
            possibleValues,
            numberValues: possibleValues.length
          }
        }

      }
    }

    stateVariableDefinitions.selectedIndex = {
      public: true,
      componentType: "number",
      defaultValue: 1,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition() {
        return {
          useEssentialOrDefaultValue: {
            selectedIndex: true
          }
        }
      },
      async inverseDefinition({ desiredStateVariableValues, stateValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "selectedIndex",
            value: me.math.mod(desiredStateVariableValues.selectedIndex - 1, await stateValues.numberValues) + 1
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
          setValue: { value: dependencyValues.possibleValues[dependencyValues.selectedIndex - 1] },
          setComponentType: { value: dependencyValues.type },
        }
      },
      async inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues }) {
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
            if (await stateValues.step * (dependencyValues.possibleValues[mid] - desiredValue) > 0) {
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
      hasEssential: true,
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
            setEssentialValue: "currentAnimationDirection",
            value: newDirection
          }]
        }
      }
    }


    stateVariableDefinitions.target = {
      returnDependencies: () => ({
        target: {
          dependencyType: "doenetAttribute",
          attributeName: "target"
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { target: dependencyValues.target }
      })
    }

    stateVariableDefinitions.targetComponent = {
      returnDependencies() {
        return {
          targetComponent: {
            dependencyType: "targetComponent",
          }
        }
      },
      definition: function ({ dependencyValues }) {

        let targetComponent = null;
        if (dependencyValues.targetComponent) {
          targetComponent = dependencyValues.targetComponent
        }

        return {
          setValue: { targetComponent }
        }
      },
    };

    stateVariableDefinitions.propName = {
      returnDependencies: () => ({
        propName: {
          dependencyType: "attributePrimitive",
          attributeName: "prop"
        },
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { propName: dependencyValues.propName } }
      }
    }


    stateVariableDefinitions.targetIdentities = {
      stateVariablesDeterminingDependencies: [
        "targetComponent", "componentIndex",
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        let dependencies = {};

        if (stateValues.targetComponent !== null) {

          if (componentInfoObjects.isCompositeComponent({
            componentType: stateValues.targetComponent.componentType,
            includeNonStandard: false
          })) {
            dependencies.targets = {
              dependencyType: "replacement",
              compositeName: stateValues.targetComponent.componentName,
              recursive: true,
              componentIndex: stateValues.componentIndex,
            }
          } else if (stateValues.componentIndex === null || stateValues.componentIndex === 1) {
            // if we don't have a composite, componentIndex can only match if it is 1
            dependencies.targets = {
              dependencyType: "stateVariable",
              variableName: "targetComponent"
            }
          }


        }
        return dependencies;
      },
      definition({ dependencyValues }) {

        let targetIdentities = null;
        if (dependencyValues.targets) {
          targetIdentities = dependencyValues.targets;
          if (!Array.isArray(targetIdentities)) {
            targetIdentities = [targetIdentities];
          }
        }
        return { setValue: { targetIdentities } };
      },
    }

    stateVariableDefinitions.targets = {
      stateVariablesDeterminingDependencies: [
        "targetIdentities", "propName"
      ],
      returnDependencies: function ({ stateValues }) {

        let dependencies = {
          targetIdentities: {
            dependencyType: "stateVariable",
            variableName: "targetIdentities"
          },
        }

        if (stateValues.targetIdentities !== null) {

          for (let [ind, source] of stateValues.targetIdentities.entries()) {

            let thisTarget;

            if (stateValues.propName) {
              thisTarget = {
                dependencyType: "stateVariable",
                componentName: source.componentName,
                variableName: stateValues.propName,
                returnAsComponentObject: true,
                variablesOptional: true,
                propIndex: stateValues.propIndex,
                caseInsensitiveVariableMatch: true,
                publicStateVariablesOnly: true,
                useMappedVariableNames: true,
              }

            } else {
              thisTarget = {
                dependencyType: "stateVariable",
                componentName: source.componentName,
                variableName: "value",
                returnAsComponentObject: true,
                variablesOptional: true,
              }
            }

            dependencies["target" + ind] = thisTarget;
          }

        }

        return dependencies;
      },
      definition({ dependencyValues }) {
        let targets = null;

        if (dependencyValues.targetIdentities !== null) {
          targets = [];

          for (let ind in dependencyValues.targetIdentities) {
            if (dependencyValues["target" + ind]) {
              targets.push(dependencyValues["target" + ind]);
            }
          }
        }

        return { setValue: { targets } };
      },
    }

    stateVariableDefinitions.valueToIndex = {
      returnDependencies: () => ({
        possibleValues: {
          dependencyType: "stateVariable",
          variableName: "possibleValues"
        }
      }),
      definition: function ({ dependencyValues }) {
        let valueToIndex = {};
        for (let [ind, item] of dependencyValues.possibleValues.entries()) {
          valueToIndex[item] = ind;
        }
        return { setValue: { valueToIndex } }
      }
    }


    return stateVariableDefinitions;
  }

  async changedAnimationOn({ stateValues, previousValues }) {

    let updateInstructions = [];

    if (stateValues.animationOn) {
      if (!previousValues.animationOn) {
        let newDirection = await this.stateValues.currentAnimationDirection;
        let animationMode = await this.stateValues.animationMode;
        let numberValues = await this.stateValues.numberValues;
        let selectedIndex = await this.stateValues.selectedIndex;

        let startIndex = await this.findIndexFromTarget();

        if (newDirection === "increase") {
          if (startIndex === numberValues) {
            // started animation in increasing direction
            // but are at largest value
            if (animationMode === "increase once") {
              // if won't reset automatically,
              // manually reset to beginning before starting
              startIndex = 1;
            } else if (animationMode === "oscillate") {
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
        } else if (newDirection === "decrease") {
          if (startIndex === 1) {
            // started animation in decreasing direction
            // but are at smallest value
            if (animationMode === "decrease once") {
              // if won't reset automatically,
              // manually reset to end before starting
              startIndex = numberValues;
            } else if (animationMode === "oscillate") {
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


        if (startIndex !== selectedIndex) {
          updateInstructions.push({
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "selectedIndex",
            value: startIndex,
          })
        }

        let additionalInstructions = await this.getUpdateInstructionsToSetTargetsToValue(
          (await this.stateValues.possibleValues)[me.math.mod(startIndex - 1, numberValues)]
        )
        updateInstructions.push(...additionalInstructions);

        await this.coreFunctions.performUpdate({
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
              animationMode
            }
          }
        })

        await this.coreFunctions.triggerChainedActions({
          componentName: this.componentName,
        });

        this.animationId = nanoid();
        await this.coreFunctions.requestAnimationFrame({
          action: {
            actionName: "advanceAnimation",
            componentName: this.componentName,
          },
          delay: await this.stateValues.animationInterval,
          animationId: this.animationId,
          actionArgs: { previousAnimationId: this.animationId }
        })

      }
    } else {
      if (previousValues.animationOn) {
        // cancel any animation in progress
        await this.coreFunctions.cancelAnimationFrame(this.animationId);
        this.canceledAnimationId = this.animationId;
        await this.coreFunctions.triggerChainedActions({
          componentName: this.componentName,
        })

        this.coreFunctions.requestRecordEvent({
          verb: "paused",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          context: {
            endIndex: await this.stateValues.selectedIndex,
          }
        })
      }
    }

  }

  async findIndexFromTarget() {

    let targets = await this.stateValues.targets;
    let selectedIndex = await this.stateValues.selectedIndex;
    if (targets === null) {
      return selectedIndex;
    }

    let target = targets[0];

    let stateVariable = Object.keys(target.stateValues)[0];

    if (!stateVariable) {
      return selectedIndex;
    }

    let value = target.stateValues[stateVariable];

    let type = await this.stateValues.type;

    if (type === "number" && value instanceof me.class) {
      value = value.evaluate_to_constant();

      if (!Number.isFinite(value)) {
        return selectedIndex
      }

    }

    // first check if value is actually a known value
    let matchedIndex = (await this.stateValues.valueToIndex)[value];

    if (matchedIndex !== undefined) {
      return matchedIndex + 1;
    }

    // we find the closest value only for numbers
    if (type !== "number") {
      return selectedIndex
    }

    let items = await this.stateValues.possibleValues;

    let findNextLargerIndex = function (minIndex = 0, maxIndex = items.length - 1) {
      if (maxIndex <= minIndex + 1) {
        if (value > items[minIndex]) {
          return maxIndex;
        }
        else {
          return minIndex;
        }
      }
      let midIndex = Math.round((maxIndex + minIndex) / 2);
      if (value > items[midIndex]) {
        return findNextLargerIndex(midIndex, maxIndex);
      }
      else {
        return findNextLargerIndex(minIndex, midIndex);
      }
    };

    let closeIndex = findNextLargerIndex();
    if (closeIndex !== 0) {
      let leftValue = items[closeIndex - 1];
      let rightValue = items[closeIndex];
      let leftDist = Math.abs(value - leftValue);
      let rightDist = Math.abs(value - rightValue);
      if (leftDist < rightDist) {
        closeIndex--;
      }
    }
    return closeIndex + 1;

  }

  async advanceAnimation({ previousAnimationId }) {

    // especially given delays in posting messages,
    // it's possible that advanceAnimation is called from
    // a animationId that was supposed to have been canceled
    if (previousAnimationId === this.canceledAnimationId) {
      return;
    }

    let newSelectedIndex;
    let continueAnimation = true;
    let newDirection;
    let animationMode = await this.stateValues.animationMode;

    // Look up index from target at every frame
    // in case the target value was changed in the middle of the animation
    // (e.g., by user interaction)
    let previousIndex = await this.findIndexFromTarget();

    if (await this.stateValues.currentAnimationDirection === "decrease") {
      newSelectedIndex = previousIndex - 1;
      if (newSelectedIndex <= 1) {
        if (animationMode === "decrease once") {
          continueAnimation = false;
        } else if (animationMode === "oscillate") {
          newDirection = "increase";
        }
      }
    } else {
      newSelectedIndex = previousIndex + 1;
      if (newSelectedIndex >= await this.stateValues.numberValues) {
        if (animationMode === "increase once") {
          continueAnimation = false;
        } else if (animationMode === "oscillate") {
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

    let additionalInstructions = await this.getUpdateInstructionsToSetTargetsToValue(
      (await this.stateValues.possibleValues)[me.math.mod(newSelectedIndex - 1, await this.stateValues.numberValues)]
    )
    updateInstructions.push(...additionalInstructions);

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

    await this.coreFunctions.performUpdate({
      updateInstructions,
    });

    if (continueAnimation) {
      this.animationId = nanoid();
      await this.coreFunctions.requestAnimationFrame({
        action: {
          actionName: "advanceAnimation",
          componentName: this.componentName,
        },
        delay: await this.stateValues.animationInterval,
        animationId: this.animationId,
        actionArgs: { previousAnimationId: this.animationId }
      })
    }
  }

  startAnimation() {
    this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "animationOn",
        value: true,
      }]
    })
  }

  stopAnimation() {
    this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "animationOn",
        value: false,
      }]
    })
  }

  async toggleAnimation() {
    this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "animationOn",
        value: !(await this.stateValues.animationOn),
      }]
    })
  }

  actions = {
    changedAnimationOn: this.changedAnimationOn.bind(this),
    advanceAnimation: this.advanceAnimation.bind(this),
    startAnimation: this.startAnimation.bind(this),
    stopAnimation: this.stopAnimation.bind(this),
    toggleAnimation: this.toggleAnimation.bind(this),
  };


  async getUpdateInstructionsToSetTargetsToValue(value) {

    let targets = await this.stateValues.targets;
    if (targets == null) {
      return [];
    }

    let updateInstructions = [];

    for (let target of targets) {
      let stateVariable = Object.keys(target.stateValues)[0];
      if (stateVariable === undefined) {
        if (await this.stateValues.propName) {
          console.warn(`Cannot animate prop="${await this.stateValues.propName}" of ${await this.stateValues.target} as could not find prop ${await this.stateValues.propName} on a component of type ${target.componentType}`)
        } else {
          console.warn(`Cannot animate ${await this.stateValues.target} as could not find a value state variable on a component of type ${target.componentType}`)
        }
        continue;
      }

      updateInstructions.push({
        updateType: "updateValue",
        componentName: target.componentName,
        stateVariable,
        value,
      })

    }

    return updateInstructions;

  }

}
