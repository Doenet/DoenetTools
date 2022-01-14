import BlockComponent from './abstract/BlockComponent';

export default class Feedback extends BlockComponent {
  static componentType = "feedback";
  static renderChildren = true;

  static primaryStateVariableForDefinition = "feedbackText";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    delete attributes.hide;
    attributes.condition = {
      createComponentOfType: "boolean"
    }
    attributes.updateWithTarget = {
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

    stateVariableDefinitions.updateWithTarget = {
      returnDependencies: () => ({
        updateWithTargetAttr: {
          dependencyType: "attributePrimitive",
          attributeName: "updateWithTarget"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { updateWithTarget: dependencyValues.updateWithTargetAttr }
        }
      }
    }

    stateVariableDefinitions.updateWithTargetComponentNames = {
      chainActionOnActionOfStateVariableTargets: {
        triggeredAction: "updateHide"
      },
      stateVariablesDeterminingDependencies: ["updateWithTarget"],
      returnDependencies({ stateValues }) {
        if (stateValues.updateWithTarget) {
          return {
            updateWithTargetComponentName: {
              dependencyType: "expandTargetName",
              target: stateValues.updateWithTarget
            }
          }
        } else {
          return {}
        }
      },
      definition({ dependencyValues }) {
        if (dependencyValues.updateWithTargetComponentName) {
          return { setValue: { updateWithTargetComponentNames: [dependencyValues.updateWithTargetComponentName] } }
        } else {
          return { setValue: { updateWithTargetComponentNames: [] } }
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
      stateVariablesDeterminingDependencies: ["updateWithTarget"],
      returnDependencies({ stateValues }) {
        if (stateValues.updateWithTarget) {
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

        if (!("condition" in dependencyValues)) {
          return {
            useEssentialOrDefaultValue: { hide: true }
          }
        }

        let hide;
        if (dependencyValues.condition === null) {
          hide = false;
        } else {
          hide = !(dependencyValues.showFeedback && dependencyValues.condition.stateValues.value);
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

  async updateHide() {
    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "hide",
      value: await this.stateValues.hideWhenUpdated,
    }]

    return await this.coreFunctions.performUpdate({ updateInstructions });
  }

  actions = {
    updateHide: this.updateHide.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
  };

}
