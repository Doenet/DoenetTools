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

export class ContentBrowserItem extends BlockComponent {
  static componentType = "contentBrowserItem";

  static renderChildren = true;
  static includeBlankStringChildren = true;

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let addContentBrowserContent = function ({ matchedChildren }) {
      let newChildren = [];

      let numAddressedChildren = 0;
      // keep any beginning setup, title children
      // and remove any blank string children
      for (let child of matchedChildren) {
        if (
          child.componentType === "setup" ||
          child.componentType === "title"
        ) {
          newChildren.push(child);
          numAddressedChildren++;
        } else if (typeof child === "string" && child.trim() === "") {
          numAddressedChildren++;
        } else {
          break;
        }
      }

      let remainingChildren = matchedChildren.slice(numAddressedChildren);

      if (remainingChildren.length > 0) {
        // wrap next child in is own contentBrowserContent
        newChildren.push({
          componentType: "contentBrowserContent",
          children: [remainingChildren[0]],
        });
      }
      if (remainingChildren.length > 1) {
        // wrap all remaining children in another contentBrowserContent
        newChildren.push({
          componentType: "contentBrowserContent",
          children: remainingChildren.slice(1),
        });
      }

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
        group: "setups",
        componentTypes: ["setup"],
      },
      {
        group: "titles",
        componentTypes: ["title"],
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

    stateVariableDefinitions.itemInfoForInitial = {
      forRenderer: true,
      returnDependencies: () => ({
        parentItemInfoForInitial: {
          dependencyType: "parentStateVariable",
          variableName: "itemInfoForInitial",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            itemInfoForInitial: dependencyValues.parentItemInfoForInitial || [],
          },
        };
      },
    };

    stateVariableDefinitions.titleChildName = {
      forRenderer: true,
      returnDependencies: () => ({
        titleChild: {
          dependencyType: "child",
          childGroups: ["titles"],
        },
      }),
      definition({ dependencyValues }) {
        let titleChildName = null;
        if (dependencyValues.titleChild.length > 0) {
          titleChildName =
            dependencyValues.titleChild[dependencyValues.titleChild.length - 1]
              .componentName;
        }
        return {
          setValue: { titleChildName },
        };
      },
    };

    stateVariableDefinitions.childIndicesToRender = {
      additionalStateVariablesDefined: [
        {
          variableName: "titleChildIndex",
          forRenderer: true,
        },
      ],
      returnDependencies: () => ({
        titleSetupChildren: {
          dependencyType: "child",
          childGroups: ["titles", "setups"],
        },
        allChildren: {
          dependencyType: "child",
          childGroups: ["anything", "titles", "setups"],
        },
        titleChildName: {
          dependencyType: "stateVariable",
          variableName: "titleChildName",
        },
      }),
      definition({ dependencyValues }) {
        let childIndicesToRender = [];
        let titleChildIndex = null;

        let allTitleSetupChildNames = dependencyValues.titleSetupChildren.map(
          (x) => x.componentName,
        );

        for (let [ind, child] of dependencyValues.allChildren.entries()) {
          if (child.componentName === dependencyValues.titleChildName) {
            titleChildIndex = childIndicesToRender.length;
            childIndicesToRender.push(ind);
          } else if (
            typeof child !== "object" ||
            !allTitleSetupChildNames.includes(child.componentName)
          ) {
            childIndicesToRender.push(ind);
          }
        }

        console.log({ titleChildIndex });

        return { setValue: { childIndicesToRender, titleChildIndex } };
      },
    };

    // stateVariableDefinitions.numTopChildren = {
    //   forRenderer: true,
    //   returnDependencies: () => ({}),
    // };

    return stateVariableDefinitions;
  }
}

export class ContentBrowserContent extends Template {
  static componentType = "contentBrowserContent";

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
