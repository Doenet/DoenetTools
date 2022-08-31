import BlockComponent from './abstract/BlockComponent';

export default class Feedback extends BlockComponent {
  static componentType = "feedback";
  static renderChildren = true;

  static primaryStateVariableForDefinition = "feedbackText";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    delete attributes.hide;
    attributes.condition = {
      createComponentOfType: "boolean"
    }
    attributes.updateWith = {
      createPrimitiveOfType: "string"
    }

    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "anything",
      componentTypes: ["_base"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.updateWith = {
      returnDependencies: () => ({
        updateWithAttr: {
          dependencyType: "attributePrimitive",
          attributeName: "updateWith"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { updateWith: dependencyValues.updateWithAttr }
        }
      }
    }

    stateVariableDefinitions.updateWithComponentNames = {
      chainActionOnActionOfStateVariableTargets: {
        triggeredAction: "updateHide"
      },
      stateVariablesDeterminingDependencies: ["updateWith"],
      returnDependencies({ stateValues }) {
        if (stateValues.updateWith) {
          return {
            updateWithComponentName: {
              dependencyType: "expandTargetName",
              target: stateValues.updateWith
            }
          }
        } else {
          return {}
        }
      },
      definition({ dependencyValues }) {
        if (dependencyValues.updateWithComponentName) {
          return { setValue: { updateWithComponentNames: [dependencyValues.updateWithComponentName] } }
        } else {
          return { setValue: { updateWithComponentNames: [] } }
        }
      }
    }

    stateVariableDefinitions.hideWhenUpdated = {
      returnDependencies: () => ({
        condition: {
          dependencyType: "attributeComponent",
          attributeName: "condition",
          variableNames: ["value"],
        },
        showFeedback: {
          dependencyType: "flag",
          flagName: "showFeedback",
        }
      }),
      definition: function ({ dependencyValues }) {

        let hideWhenUpdated;
        if (dependencyValues.condition === null) {
          hideWhenUpdated = false;
        } else {
          hideWhenUpdated = !(dependencyValues.showFeedback && dependencyValues.condition.stateValues.value);
        }

        return { setValue: { hideWhenUpdated } }
      }
    };

    stateVariableDefinitions.hide = {
      forRenderer: true,
      defaultValue: true,
      hasEssential: true,
      stateVariablesDeterminingDependencies: ["updateWith"],
      returnDependencies({ stateValues }) {
        if (stateValues.updateWith) {
          return {};
        } else {
          return {
            condition: {
              dependencyType: "attributeComponent",
              attributeName: "condition",
              variableNames: ["value"],
            },
            showFeedback: {
              dependencyType: "flag",
              flagName: "showFeedback",
            }
          }
        }
      },
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.showFeedback) {
          return { setValue: { hide: true } }
        }

        if (!("condition" in dependencyValues)) {
          return {
            useEssentialOrDefaultValue: { hide: true }
          }
        }

        let hide;
        if (dependencyValues.condition === null) {
          hide = false;
        } else {
          hide = !dependencyValues.condition.stateValues.value;
        }

        return { setValue: { hide } }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if ("condition" in dependencyValues) {
          return { success: false }
        } else {
          return {
            success: true,
            instructions: [{
              setEssentialValue: "hide",
              value: desiredStateVariableValues.hide
            }]
          }
        }
      }
    };

    // for case when created from a copy prop
    stateVariableDefinitions.feedbackText = {
      forRenderer: true,
      defaultValue: null,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          feedbackText: true
        }
      })
    }


    return stateVariableDefinitions;
  }

  async updateHide({ actionId }) {
    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "hide",
      value: await this.stateValues.hideWhenUpdated,
    }]

    return await this.coreFunctions.performUpdate({ updateInstructions, actionId });
  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible }
    })
    this.coreFunctions.resolveAction({ actionId });
  }

  actions = {
    updateHide: this.updateHide.bind(this),
    recordVisibilityChange: this.recordVisibilityChange.bind(this),
  };

}
