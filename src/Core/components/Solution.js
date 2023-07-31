import BlockComponent from "./abstract/BlockComponent";

export class Solution extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      revealSolution: this.revealSolution.bind(this),
      closeSolution: this.closeSolution.bind(this),
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "solution";
  static rendererType = "solution";
  static renderChildren = true;

  static sendToRendererEvenIfHidden = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.hide = {
      createComponentOfType: "boolean",
    };
    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let wrapWithContainer = function ({ matchedChildren }) {
      return {
        success: true,
        newChildren: [
          {
            componentType: "_solutionContainer",
            children: matchedChildren,
          },
        ],
      };
    };

    sugarInstructions.push({
      replacementFunction: wrapWithContainer,
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "inlinesBlocks",
        componentTypes: ["_inline", "_block"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.hide = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      forRenderer: true,
      defaultValue: false,
      hasEssential: true,
      returnDependencies: () => ({
        hideAttr: {
          dependencyType: "attributeComponent",
          attributeName: "hide",
          variableNames: ["value"],
        },
        displayMode: {
          dependencyType: "flag",
          flagName: "solutionDisplayMode",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.displayMode === "none") {
          return { setValue: { hide: true } };
        } else if (dependencyValues.hideAttr !== null) {
          return {
            setValue: {
              hide: dependencyValues.hideAttr.stateValues.value,
            },
          };
        } else {
          return {
            useEssentialOrDefaultValue: {
              hide: true,
            },
          };
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.displayMode === "none") {
          return { success: false };
        } else if (dependencyValues.hideAttr !== null) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "hideAttr",
                desiredValue: desiredStateVariableValues.hide,
                variableIndex: 0,
              },
            ],
          };
        } else {
          return {
            success: true,
            instructions: [
              {
                setSetVariable: "hide",
                value: desiredStateVariableValues.hide,
              },
            ],
          };
        }
      },
    };

    stateVariableDefinitions.open = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      forRenderer: true,
      defaultValue: false,
      hasEssential: true,
      returnDependencies: () => ({
        displayMode: {
          dependencyType: "flag",
          flagName: "solutionDisplayMode",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.displayMode === "displayed") {
          return { setValue: { open: true } };
        } else if (dependencyValues.displayMode === "none") {
          return { setValue: { open: false } };
        } else {
          return {
            useEssentialOrDefaultValue: {
              open: true,
            },
          };
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (
          dependencyValues.displayMode === "displayed" ||
          dependencyValues.displayMode === "none"
        ) {
          // will always be open if displaymode is displayed
          // or always closed if displaymode is none
          return { success: false };
        }

        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "open",
              value: desiredStateVariableValues.open,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.canBeClosed = {
      forRenderer: true,
      returnDependencies: () => ({
        displayMode: {
          dependencyType: "flag",
          flagName: "solutionDisplayMode",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.displayMode === "button") {
          return { setValue: { canBeClosed: true } };
        } else {
          return { setValue: { canBeClosed: false } };
        }
      },
    };

    stateVariableDefinitions.message = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      defaultValue: "",
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          message: true,
        },
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "message",
              value: desiredStateVariableValues.message,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.sectionName = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { sectionName: "Solution" } }),
    };

    return stateVariableDefinitions;
  }

  async revealSolution({
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let { allowView, message, scoredComponent } =
      await this.coreFunctions.recordSolutionView();

    let updateInstructions = [
      {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "open",
        value: allowView,
      },
      {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "message",
        value: message,
      },
    ];

    let event;

    if (allowView) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: scoredComponent,
        stateVariable: "viewedSolution",
        value: true,
      });

      event = {
        verb: "viewed",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
      };
    }

    return await this.coreFunctions.performUpdate({
      updateInstructions,
      actionId,
      sourceInformation,
      skipRendererUpdate,
      event,
      overrideReadOnly: true,
    });
  }

  async closeSolution({
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    return await this.coreFunctions.performUpdate({
      updateInstructions: [
        {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "open",
          value: false,
        },
      ],
      overrideReadOnly: true,
      actionId,
      sourceInformation,
      skipRendererUpdate,
      event: {
        verb: "closed",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
      },
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

  static includeBlankStringChildren = true;
}

export class GivenAnswer extends Solution {
  static componentType = "givenAnswer";

  static excludeFromSchema = true;

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.sectionName.definition = () => ({
      setValue: { sectionName: "Answer" },
    });

    return stateVariableDefinitions;
  }
}
