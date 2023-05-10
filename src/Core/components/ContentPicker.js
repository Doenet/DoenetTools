import BlockComponent from "./abstract/BlockComponent";

export default class ContentPicker extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
      updateSelectedIndices: this.updateSelectedIndices.bind(this),
    });
  }

  static componentType = "contentPicker";

  static renderChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.separateByTopic = {
      createComponentOfType: "boolean",
      createStateVariable: "separateByTopic",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };
    attributes.label = {
      createComponentOfType: "text",
      createStateVariable: "label",
      defaultValue: "Select",
      forRenderer: true,
    };
    attributes.defaultTopicLabel = {
      createComponentOfType: "text",
      createStateVariable: "defaultTopicLabel",
      defaultValue: "Other",
    };

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "allChildren",
        componentTypes: ["_base"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.childrenWithTitle = {
      returnDependencies: () => ({
        children: {
          dependencyType: "child",
          childGroups: ["allChildren"],
          variableNames: ["title"],
          variablesOptional: true,
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            childrenWithTitle: dependencyValues.children,
          },
        };
      },
    };

    stateVariableDefinitions.childInfo = {
      stateVariablesDeterminingDependencies: [
        "childrenWithTitle",
        "separateByTopic",
      ],
      additionalStateVariablesDefined: [
        { variableName: "childrenByTopic", forRenderer: true },
      ],
      forRenderer: true,
      returnDependencies({ stateValues }) {
        let dependencies = {
          childrenWithTitle: {
            dependencyType: "stateVariable",
            variableName: "childrenWithTitle",
          },
          separateByTopic: {
            dependencyType: "stateVariable",
            variableName: "separateByTopic",
          },
        };

        if (stateValues.separateByTopic) {
          dependencies.defaultTopicLabel = {
            dependencyType: "stateVariable",
            variableName: "defaultTopicLabel",
          };
          for (let [ind, child] of stateValues.childrenWithTitle.entries()) {
            dependencies[`childTopics${ind}`] = {
              dependencyType: "descendant",
              ancestorName: child.componentName,
              componentTypes: ["topic"],
              variableNames: ["value"],
              includeNonActiveChildren: true,
            };
          }
        }

        return dependencies;
      },
      definition: function ({ dependencyValues }) {
        let childInfo = [];
        let childrenByTopic = {};
        let allLowercaseTopics = {};
        for (let [ind, child] of dependencyValues.childrenWithTitle.entries()) {
          let childObject = {
            componentName: child.componentName,
            title: child.stateValues.title || "Untitled",
          };
          childInfo.push(childObject);

          if (dependencyValues.separateByTopic) {
            let topicsForChild = dependencyValues[`childTopics${ind}`].map(
              (x) => x.stateValues.value,
            );
            if (topicsForChild.length > 0) {
              for (let topic of topicsForChild) {
                let topicLower = topic.toLowerCase();
                let topicWithCase = allLowercaseTopics[topicLower];
                if (!topicWithCase) {
                  topicWithCase = allLowercaseTopics[topicLower] = topic;
                }

                let childrenWithTopic = childrenByTopic[topicWithCase];
                if (!childrenWithTopic) {
                  childrenWithTopic = childrenByTopic[topicWithCase] = [];
                }
                childrenWithTopic.push(ind);
              }
            } else {
              let defaultTopic = dependencyValues.defaultTopicLabel;
              let childrenWithoutTopic = childrenByTopic[defaultTopic];
              if (!childrenWithoutTopic) {
                childrenWithoutTopic = childrenByTopic[defaultTopic] = [];
              }
              childrenWithoutTopic.push(ind);
            }
          }
        }

        return { setValue: { childInfo, childrenByTopic } };
      },
    };

    stateVariableDefinitions.selectedIndices = {
      hasEssential: true,
      defaultValue: [],
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: { selectedIndices: true },
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        let desiredIndices = desiredStateVariableValues.selectedIndices;
        if (
          !Array.isArray(desiredIndices) ||
          !desiredIndices.every((x) => x >= 0)
        ) {
          return { success: false };
        }

        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "selectedIndices",
              value: desiredIndices,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.childIndicesToRender = {
      returnDependencies: () => ({
        selectedIndices: {
          dependencyType: "stateVariable",
          variableName: "selectedIndices",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            childIndicesToRender: dependencyValues.selectedIndices.map(
              (x) => x - 1,
            ),
          },
        };
      },
      markStale: () => ({ updateRenderedChildren: true }),
    };

    return stateVariableDefinitions;
  }

  async updateSelectedIndices({
    selectedIndices,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.disabled)) {
      let updateInstructions = [
        {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "selectedIndices",
          value: selectedIndices,
        },
      ];

      let event = {
        verb: "selected",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: selectedIndices,
          responseText: selectedIndices.map((i) => String(i)),
        },
      };

      await this.coreFunctions.performUpdate({
        updateInstructions,
        actionId,
        sourceInformation,
        skipRendererUpdate: true,
        event,
      });

      return await this.coreFunctions.triggerChainedActions({
        componentName: this.componentName,
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    } else {
      return this.coreFunctions.resolveAction({ actionId });
    }
  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible },
    });
    this.coreFunctions.resolveAction({ actionId });
  }
}
