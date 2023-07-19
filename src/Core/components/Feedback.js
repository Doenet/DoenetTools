import BlockComponent from "./abstract/BlockComponent";

export default class Feedback extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      updateHide: this.updateHide.bind(this),
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "feedback";
  static renderChildren = true;

  static primaryStateVariableForDefinition = "feedbackText";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    delete attributes.hide;
    attributes.condition = {
      createComponentOfType: "boolean",
    };
    attributes.updateWith = {
      createTargetComponentNames: true,
    };

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "anything",
        componentTypes: ["_base"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.updateWithComponentNames = {
      chainActionOnActionOfStateVariableTargets: {
        triggeredAction: "updateHide",
      },
      returnDependencies: () => ({
        updateWith: {
          dependencyType: "attributeTargetComponentNames",
          attributeName: "updateWith",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.updateWith) {
          return {
            setValue: {
              updateWithComponentNames: dependencyValues.updateWith.map(
                (x) => x.absoluteName,
              ),
            },
          };
        } else {
          return { setValue: { updateWithComponentNames: [] } };
        }
      },
    };

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
        },
      }),
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.showFeedback) {
          return { setValue: { hideWhenUpdated: true } };
        }

        let hideWhenUpdated;
        if (dependencyValues.condition === null) {
          hideWhenUpdated = false;
        } else {
          hideWhenUpdated = !dependencyValues.condition.stateValues.value;
        }

        return { setValue: { hideWhenUpdated } };
      },
    };

    stateVariableDefinitions.hide = {
      forRenderer: true,
      defaultValue: true,
      hasEssential: true,
      returnDependencies: () => ({
        updateWith: {
          dependencyType: "attributeTargetComponentNames",
          attributeName: "updateWith",
        },
        condition: {
          dependencyType: "attributeComponent",
          attributeName: "condition",
          variableNames: ["value"],
        },
        showFeedback: {
          dependencyType: "flag",
          flagName: "showFeedback",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.updateWith) {
          return {
            useEssentialOrDefaultValue: { hide: true },
          };
        }

        if (!dependencyValues.showFeedback) {
          return { setValue: { hide: true } };
        }

        let hide;
        if (dependencyValues.condition === null) {
          hide = false;
        } else {
          hide = !dependencyValues.condition.stateValues.value;
        }

        return { setValue: { hide } };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (!dependencyValues.updateWith) {
          return { success: false };
        } else {
          return {
            success: true,
            instructions: [
              {
                setEssentialValue: "hide",
                value: desiredStateVariableValues.hide,
              },
            ],
          };
        }
      },
    };

    // for case when created from a copy prop
    stateVariableDefinitions.feedbackText = {
      forRenderer: true,
      defaultValue: null,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          feedbackText: true,
        },
      }),
    };

    return stateVariableDefinitions;
  }

  async updateHide({
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let updateInstructions = [
      {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "hide",
        value: await this.stateValues.hideWhenUpdated,
      },
    ];

    return await this.coreFunctions.performUpdate({
      updateInstructions,
      actionId,
      sourceInformation,
      skipRendererUpdate,
    });
  }

  recordVisibilityChange({ isVisible }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible },
    });
  }
}
