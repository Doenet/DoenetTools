import { cesc } from "../../_utils/url";
import Template from "./Template";
import BlockComponent from "./abstract/BlockComponent";

export class ContentBrowser extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
      setSelectedItemInd: this.setSelectedItemInd.bind(this),
    });
  }

  static componentType = "contentBrowser";

  static excludeFromSchema = true;

  static renderChildren = true;

  static returnChildGroups() {
    return [
      {
        group: "contentBrowserItems",
        componentTypes: ["contentBrowserItem"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.itemsByInitial = {
      additionalStateVariablesDefined: [
        { variableName: "allInitials", forRenderer: true },
        { variableName: "firstComponentNameByInitial", forRenderer: true },
        { variableName: "labelByInd" },
        { variableName: "indByEscapedComponentName", forRenderer: true },
      ],
      returnDependencies: () => ({
        contentBrowserItems: {
          dependencyType: "child",
          childGroups: ["contentBrowserItems"],
          variableNames: ["label"],
        },
      }),
      definition({ dependencyValues }) {
        let items = [];
        let labelByInd = {};
        let indByEscapedComponentName = {};

        for (let [
          ind,
          item,
        ] of dependencyValues.contentBrowserItems.entries()) {
          items.push({
            ind,
            componentName: item.componentName,
            label: item.stateValues.label,
          });
          labelByInd[ind] = item.stateValues.label;
          indByEscapedComponentName[cesc(item.componentName)] = ind;
        }

        items.sort((a, b) =>
          a.label.toLowerCase().localeCompare(b.label.toLowerCase()),
        );

        let itemsByInitial = {};
        let allInitials = [];
        let firstComponentNameByInitial = {};
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
            firstComponentNameByInitial[initial] = item.componentName;
          }
        }
        if (initial) {
          itemsByInitial[initial] = initialList;
          allInitials.push(initial);
        }

        return {
          setValue: {
            itemsByInitial,
            allInitials,
            firstComponentNameByInitial,
            labelByInd,
            indByEscapedComponentName,
          },
        };
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
                  componentName: x.componentName,
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
      returnDependencies: () => ({
        selectedItemInd: {
          dependencyType: "stateVariable",
          variableName: "selectedItemInd",
        },
        labelByInd: {
          dependencyType: "stateVariable",
          variableName: "labelByInd",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            selectedItemLabel:
              dependencyValues.labelByInd[dependencyValues.selectedItemInd] ||
              "",
          },
        };
      },
    };

    stateVariableDefinitions.selectedItemComponentName = {
      stateVariablesDeterminingDependencies: ["selectedItemInd"],
      returnDependencies: ({ stateValues }) => ({
        contentBrowserItems: {
          dependencyType: "child",
          childGroups: ["contentBrowserItems"],
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
              dependencyValues.contentBrowserItems[0]?.componentName || "",
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
        let childIndicesToRender = [];
        if (dependencyValues.selectedItemInd >= 0) {
          childIndicesToRender.push(dependencyValues.selectedItemInd);
        }
        return { setValue: { childIndicesToRender } };
      },
      markStale: () => ({ updateRenderedChildren: true }),
    };

    return stateVariableDefinitions;
  }

  async setSelectedItemInd({
    ind,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.disabled)) {
      let newLabel = (await this.stateValues.labelByInd)[ind];
      let newInitial = newLabel?.[0]?.toUpperCase() || "";

      let updateInstructions = [
        {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "initial",
          value: newInitial,
        },
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
    }
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

export class ContentBrowserItem extends BlockComponent {
  static componentType = "contentBrowserItem";
  static rendererType = "containerBlock";

  static excludeFromSchema = true;

  static renderChildren = true;
  static includeBlankStringChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.label = {
      createComponentOfType: "text",
      createStateVariable: "label",
      defaultValue: "Unlabeled",
      public: true,
      forRenderer: true,
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let addContentBrowserContent = function ({ matchedChildren }) {
      // wrap all children in a contentBrowserContent
      let newChildren = [
        {
          componentType: "contentBrowserContent",
          children: matchedChildren,
        },
      ];

      return {
        success: true,
        newChildren,
      };
    };
    sugarInstructions.push({
      replacementFunction: addContentBrowserContent,
    });
    return sugarInstructions;
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

export class ContentBrowserContent extends Template {
  static componentType = "contentBrowserContent";

  static excludeFromSchema = true;

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
