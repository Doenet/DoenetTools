import Template from "./Template";
import Video from "./Video";
import BlockComponent from "./abstract/BlockComponent";

export class ExampleBrowser extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
      setInitial: this.setInitial.bind(this),
      setSelectedItemInd: this.setSelectedItemInd.bind(this),
    });
  }

  static componentType = "exampleBrowser";

  static renderChildren = true;

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let addExampleBrowserVideo = function ({ matchedChildren }) {
      // add exampleBrowserVideo at the beginning

      let exampleBrowserVideo = {
        componentType: "exampleBrowserVideo",
      };

      let newChildren = [exampleBrowserVideo, ...matchedChildren];

      return {
        success: true,
        newChildren,
      };
    };
    sugarInstructions.push({
      replacementFunction: addExampleBrowserVideo,
    });
    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "exampleBrowserVideos",
        componentTypes: ["exampleBrowserVideo"],
      },
      {
        group: "exampleBrowserItems",
        componentTypes: ["exampleBrowserItem"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.itemsByInitial = {
      additionalStateVariablesDefined: [
        { variableName: "allInitials", forRenderer: true },
      ],
      returnDependencies: () => ({
        exampleBrowserItems: {
          dependencyType: "child",
          childGroups: ["exampleBrowserItems"],
          variableNames: ["label"],
        },
      }),
      definition({ dependencyValues }) {
        let items = [];

        for (let [
          ind,
          item,
        ] of dependencyValues.exampleBrowserItems.entries()) {
          items.push({
            ind,
            componentName: item.componentName,
            label: item.stateValues.label,
          });
        }

        items.sort((a, b) =>
          a.label.toLowerCase().localeCompare(b.label.toLowerCase()),
        );

        let itemsByInitial = {};
        let allInitials = [];
        let initial,
          initialList = [];
        for (let item of items) {
          let newInitial = Array.from(item.label)[0]?.toUpperCase() || "";

          if (newInitial === initial) {
            initialList.push(item);
          } else {
            if (initial) {
              itemsByInitial[initial] = initialList;
              allInitials.push(initial);
            }
            initial = newInitial;
            initialList = [item];
          }
        }
        if (initial) {
          itemsByInitial[initial] = initialList;
          allInitials.push(initial);
        }

        return { setValue: { itemsByInitial, allInitials } };
      },
    };

    stateVariableDefinitions.initial = {
      forRenderer: true,
      hasEssential: true,
      returnDependencies: () => ({
        allInitials: {
          dependencyType: "stateVariable",
          variableName: "allInitials",
        },
      }),
      definition({ dependencyValues }) {
        return {
          useEssentialOrDefaultValue: {
            initial: { defaultValue: dependencyValues.allInitials[0] || null },
          },
        };
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "initial",
              value: desiredStateVariableValues.initial,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.itemInfoForInitial = {
      forRenderer: true,
      returnDependencies: () => ({
        initial: {
          dependencyType: "stateVariable",
          variableName: "initial",
        },
        itemsByInitial: {
          dependencyType: "stateVariable",
          variableName: "itemsByInitial",
        },
        selectedItemInd: {
          dependencyType: "stateVariable",
          variableName: "selectedItemInd",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            itemInfoForInitial:
              dependencyValues.itemsByInitial[dependencyValues.initial]?.map(
                (x) => ({
                  label: x.label,
                  ind: x.ind,
                  selected: x.ind === dependencyValues.selectedItemInd,
                }),
              ) || [],
          },
        };
      },
    };

    stateVariableDefinitions.selectedItemInd = {
      forRenderer: true,
      hasEssential: true,
      returnDependencies: () => ({
        allInitials: {
          dependencyType: "stateVariable",
          variableName: "allInitials",
        },
        itemsByInitial: {
          dependencyType: "stateVariable",
          variableName: "itemsByInitial",
        },
      }),
      definition: ({ dependencyValues }) => ({
        useEssentialOrDefaultValue: {
          selectedItemInd: {
            defaultValue:
              dependencyValues.itemsByInitial[
                dependencyValues.allInitials[0]
              ]?.[0]?.ind || 0,
          },
        },
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "selectedItemInd",
              value: desiredStateVariableValues.selectedItemInd,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.selectedItemLabel = {
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["selectedItemInd"],
      returnDependencies: ({ stateValues }) => ({
        exampleBrowserItems: {
          dependencyType: "child",
          childGroups: ["exampleBrowserItems"],
          variableNames: ["label"],
          childIndices:
            stateValues.selectedItemInd === null
              ? []
              : [stateValues.selectedItemInd],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            selectedItemLabel:
              dependencyValues.exampleBrowserItems[0]?.stateValues.label || "",
          },
        };
      },
    };

    stateVariableDefinitions.selectedItemDescription = {
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["selectedItemInd"],
      returnDependencies: ({ stateValues }) => ({
        exampleBrowserItems: {
          dependencyType: "child",
          childGroups: ["exampleBrowserItems"],
          variableNames: ["description"],
          childIndices:
            stateValues.selectedItemInd === null
              ? []
              : [stateValues.selectedItemInd],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            selectedItemDescription:
              dependencyValues.exampleBrowserItems[0]?.stateValues
                .description || "",
          },
        };
      },
    };

    stateVariableDefinitions.selectedItemYoutubeCode = {
      stateVariablesDeterminingDependencies: ["selectedItemInd"],
      returnDependencies: ({ stateValues }) => ({
        exampleBrowserItems: {
          dependencyType: "child",
          childGroups: ["exampleBrowserItems"],
          variableNames: ["youtubeCode"],
          childIndices:
            stateValues.selectedItemInd === null
              ? []
              : [stateValues.selectedItemInd],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            selectedItemYoutubeCode:
              dependencyValues.exampleBrowserItems[0]?.stateValues
                .youtubeCode || "",
          },
        };
      },
    };

    stateVariableDefinitions.selectedItemComponentName = {
      stateVariablesDeterminingDependencies: ["selectedItemInd"],
      returnDependencies: ({ stateValues }) => ({
        exampleBrowserItems: {
          dependencyType: "child",
          childGroups: ["exampleBrowserItems"],
          childIndices:
            stateValues.selectedItemInd === null
              ? []
              : [stateValues.selectedItemInd],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            selectedItemComponentName:
              dependencyValues.exampleBrowserItems[0]?.componentName || "",
          },
        };
      },
    };

    stateVariableDefinitions.childIndicesToRender = {
      returnDependencies: () => ({
        selectedItemInd: {
          dependencyType: "stateVariable",
          variableName: "selectedItemInd",
        },
      }),
      definition({ dependencyValues }) {
        let childIndicesToRender = [0];
        if (dependencyValues.selectedItemInd >= 0) {
          childIndicesToRender.push(dependencyValues.selectedItemInd + 1);
        }
        return { setValue: { childIndicesToRender } };
      },
      markStale: () => ({ updateRenderedChildren: true }),
    };

    return stateVariableDefinitions;
  }

  async setInitial({
    initial,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.disabled)) {
      let updateInstructions = [
        {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "initial",
          value: initial,
        },
      ];

      let event = {
        verb: "selected",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: initial,
          responseText: initial,
        },
      };

      return await this.coreFunctions.performUpdate({
        updateInstructions,
        actionId,
        sourceInformation,
        skipRendererUpdate,
        event,
      });
    } else {
      return this.coreFunctions.resolveAction({ actionId });
    }
  }

  async setSelectedItemInd({
    ind,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.disabled)) {
      let updateInstructions = [
        {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "selectedItemInd",
          value: ind,
        },
      ];

      let event = {
        verb: "selected",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: ind,
          responseText: ind.toString(),
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

export class ExampleBrowserItem extends BlockComponent {
  static componentType = "exampleBrowserItem";
  static rendererType = "containerBlock";

  static renderChildren = true;
  static includeBlankStringChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.youtubeCode = {
      createComponentOfType: "text",
      createStateVariable: "youtubeCode",
      defaultValue: "",
    };
    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let addExampleBrowserContent = function ({ matchedChildren }) {
      let newChildren = [];

      // remove first child if it is a blank string
      // so that doesn't prevent next setup from being first
      if (
        typeof matchedChildren[0] === "string" &&
        matchedChildren[0].trim() === ""
      ) {
        matchedChildren = matchedChildren.slice(1);
      }

      // if first child is a setup, leave it unaltered
      if (matchedChildren[0].componentType === "setup") {
        newChildren.push(matchedChildren[0]);
        matchedChildren = matchedChildren.slice(1);
      }

      // wrap all remaining children except in exampleBrowserContent
      let exampleBrowserContent = {
        componentType: "exampleBrowserContent",
        children: matchedChildren,
      };
      newChildren.push(exampleBrowserContent);

      return {
        success: true,
        newChildren,
      };
    };
    sugarInstructions.push({
      replacementFunction: addExampleBrowserContent,
    });
    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "setups",
        componentTypes: ["setup"],
      },
      {
        group: "anything",
        componentTypes: ["_base"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.setupChildren = {
      returnDependencies: () => ({
        setupChildren: {
          dependencyType: "child",
          childGroups: ["setups"],
          proceedIfAllChildrenNotMatched: true,
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { setupChildren: dependencyValues.setupChildren } };
      },
    };

    stateVariableDefinitions.description = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      stateVariablesDeterminingDependencies: ["setupChildren"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          setupChildren: {
            dependencyType: "child",
            childGroups: ["setups"],
            proceedIfAllChildrenNotMatched: true,
          },
        };

        let firstSetupChild = stateValues.setupChildren[0];

        if (firstSetupChild) {
          dependencies[`descriptions`] = {
            dependencyType: "descendant",
            ancestorName: firstSetupChild.componentName,
            componentTypes: ["description"],
            variableNames: ["value"],
          };
        }

        return dependencies;
      },
      definition({ dependencyValues }) {
        let description =
          dependencyValues.descriptions?.[0]?.stateValues.value || "";
        return { setValue: { description } };
      },
    };

    stateVariableDefinitions.label = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "label",
      },
      stateVariablesDeterminingDependencies: ["setupChildren"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          setupChildren: {
            dependencyType: "child",
            childGroups: ["setups"],
            proceedIfAllChildrenNotMatched: true,
          },
        };

        let firstSetupChild = stateValues.setupChildren[0];

        if (firstSetupChild) {
          dependencies[`labels`] = {
            dependencyType: "descendant",
            ancestorName: firstSetupChild.componentName,
            componentTypes: ["label"],
            variableNames: ["value"],
          };
        }

        return dependencies;
      },
      definition({ dependencyValues }) {
        let label = dependencyValues.labels?.[0]?.stateValues.value || "";
        return { setValue: { label } };
      },
    };

    stateVariableDefinitions.isSelected = {
      returnDependencies: () => ({
        selectedComponentName: {
          dependencyType: "parentStateVariable",
          variableName: "selectedItemComponentName",
        },
      }),
      definition({ dependencyValues, componentName }) {
        return {
          setValue: {
            isSelected:
              dependencyValues.selectedComponentName === componentName,
          },
        };
      },
    };

    return stateVariableDefinitions;
  }
}

export class ExampleBrowserVideo extends Video {
  static componentType = "exampleBrowserVideo";
  static rendererType = "video";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    delete attributes.youtube;

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.youtube = {
      forRenderer: true,
      returnDependencies: () => ({
        youtubeCode: {
          dependencyType: "parentStateVariable",
          parentComponentType: "exampleBrowser",
          variableName: "selectedItemYoutubeCode",
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { youtube: dependencyValues.youtubeCode || "" } };
      },
    };

    return stateVariableDefinitions;
  }
}

export class ExampleBrowserContent extends Template {
  static componentType = "exampleBrowserContent";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    delete attributes.rendered;

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.rendered = {
      returnDependencies: () => ({
        parentSelected: {
          dependencyType: "parentStateVariable",
          variableName: "isSelected",
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { rendered: dependencyValues.parentSelected } };
      },
    };

    return stateVariableDefinitions;
  }
}
