import BlockComponent from './abstract/BlockComponent';

export default class Feedback extends BlockComponent {
  static componentType = "feedback";
  static renderChildren = true;

  static primaryStateVariableForDefinition = "feedbackText";

  static get stateVariablesShadowedForReference() {
    return ["hide"]
  }

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    delete attributes.hide;
    attributes.condition = {
      createComponentOfType: "boolean"
    }
    attributes.updateWithTname = {
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

    stateVariableDefinitions.updateWithTname = {
      returnDependencies: () => ({
        updateWithTnameAttr: {
          dependencyType: "attributePrimitive",
          attributeName: "updateWithTname"
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: { updateWithTname: dependencyValues.updateWithTnameAttr }
        }
      }
    }

    stateVariableDefinitions.updateWithFullTnames = {
      chainActionOnActionOfStateVariableTargets: {
        triggeredAction: "updateHide"
      },
      stateVariablesDeterminingDependencies: ["updateWithTname"],
      returnDependencies({ stateValues }) {
        if (stateValues.updateWithTname) {
          return {
            updateWithFullTname: {
              dependencyType: "expandTargetName",
              tName: stateValues.updateWithTname
            }
          }
        } else {
          return {}
        }
      },
      definition({ dependencyValues }) {
        if (dependencyValues.updateWithFullTname) {
          return { newValues: { updateWithFullTnames: [dependencyValues.updateWithFullTname] } }
        } else {
          return { newValues: { updateWithFullTnames: [] } }
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

        return { newValues: { hideWhenUpdated } }
      }
    };

    stateVariableDefinitions.hide = {
      forRenderer: true,
      defaultValue: true,
      stateVariablesDeterminingDependencies: ["updateWithTname"],
      returnDependencies({ stateValues }) {
        if (stateValues.updateWithTname) {
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
            useEssentialOrDefaultValue: { hide: { variablesToCheck: ["hide"] } }
          }
        }

        let hide;
        if (dependencyValues.condition === null) {
          hide = false;
        } else {
          hide = !(dependencyValues.showFeedback && dependencyValues.condition.stateValues.value);
        }

        return { newValues: { hide } }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if ("condition" in dependencyValues) {
          return { success: false }
        } else {
          return {
            success: true,
            instructions: [{
              setStateVariable: "hide",
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
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          feedbackText: { variablesToCheck: ["feedbackText"] }
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
