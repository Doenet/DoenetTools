import BlockComponent from "./abstract/BlockComponent";

export class Paginator extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      setPage: this.setPage.bind(this),
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "paginator";
  static rendererType = "containerBlock";
  static renderChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.initialPage = {
      createComponentOfType: "integer",
      createStateVariable: "initialPage",
      defaultValue: 1,
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

    stateVariableDefinitions.numPages = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        children: {
          dependencyType: "child",
          childGroups: ["anything"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { numPages: dependencyValues.children.length },
        };
      },
    };

    stateVariableDefinitions.currentPage = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      hasEssential: true,
      returnDependencies: () => ({
        initialPage: {
          dependencyType: "stateVariable",
          variableName: "initialPage",
        },
        numPages: {
          dependencyType: "stateVariable",
          variableName: "numPages",
        },
      }),
      definition({ dependencyValues }) {
        return {
          useEssentialOrDefaultValue: {
            currentPage: {
              get defaultValue() {
                let initialPageNumber = dependencyValues.initialPage;
                if (!Number.isInteger(initialPageNumber)) {
                  return 1;
                } else {
                  return Math.max(
                    1,
                    Math.min(dependencyValues.numPages, initialPageNumber),
                  );
                }
              },
            },
          },
        };
      },
      async inverseDefinition({
        desiredStateVariableValues,
        stateValues,
        sourceDetails = {},
      }) {
        // allow change only from setPage action
        if (!sourceDetails.fromSetPage) {
          return { success: false };
        }

        let desiredPageNumber = Number(desiredStateVariableValues.currentPage);
        if (!Number.isInteger(desiredPageNumber)) {
          return { success: false };
        }

        desiredPageNumber = Math.max(
          1,
          Math.min(await stateValues.numPages, desiredPageNumber),
        );

        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "currentPage",
              value: desiredPageNumber,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.childIndicesToRender = {
      returnDependencies: () => ({
        currentPage: {
          dependencyType: "stateVariable",
          variableName: "currentPage",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            childIndicesToRender: [dependencyValues.currentPage - 1],
          },
        };
      },
      markStale: () => ({ updateRenderedChildren: true }),
    };

    return stateVariableDefinitions;
  }

  async setPage({
    number,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!Number.isInteger(number)) {
      this.coreFunctions.resolveAction({ actionId });
      return;
    }

    let pageNumber = Math.max(
      1,
      Math.min(await this.stateValues.numPages, number),
    );

    let updateInstructions = [
      {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "currentPage",
        value: pageNumber,
        sourceDetails: { fromSetPage: true },
      },
    ];

    await this.coreFunctions.performUpdate({
      updateInstructions,
      actionId,
      sourceInformation,
      skipRendererUpdate,
      event: {
        verb: "selected",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: pageNumber,
          responseText: pageNumber.toString(),
        },
      },
    });
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

export class PaginatorControls extends BlockComponent {
  constructor(args) {
    super(args);

    this.externalActions = {};

    //Complex because the stateValues isn't defined until later
    Object.defineProperty(this.externalActions, "setPage", {
      enumerable: true,
      get: async function () {
        let paginatorComponentName = await this.stateValues
          .paginatorComponentName;
        if (paginatorComponentName) {
          return {
            componentName: paginatorComponentName,
            actionName: "setPage",
          };
        } else {
          return;
        }
      }.bind(this),
    });
  }
  static componentType = "paginatorControls";
  static renderChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.previousLabel = {
      createComponentOfType: "text",
      createStateVariable: "previousLabel",
      defaultValue: "Previous",
      forRenderer: true,
      public: true,
    };
    attributes.nextLabel = {
      createComponentOfType: "text",
      createStateVariable: "nextLabel",
      defaultValue: "Next",
      forRenderer: true,
      public: true,
    };
    attributes.pageLabel = {
      createComponentOfType: "text",
      createStateVariable: "pageLabel",
      defaultValue: "Page",
      forRenderer: true,
      public: true,
    };
    attributes.paginator = {
      createTargetComponentNames: true,
    };

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.paginatorComponentName = {
      returnDependencies: () => ({
        paginator: {
          dependencyType: "attributeTargetComponentNames",
          attributeName: "paginator",
        },
      }),
      definition({ dependencyValues }) {
        let paginatorComponentName;

        if (dependencyValues.paginator?.length === 1) {
          paginatorComponentName = dependencyValues.paginator[0].absoluteName;
        } else {
          paginatorComponentName = null;
        }

        return { setValue: { paginatorComponentName } };
      },
    };

    stateVariableDefinitions.currentPage = {
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["paginatorComponentName"],
      returnDependencies({ stateValues }) {
        if (!stateValues.paginatorComponentName) {
          return {};
        } else {
          return {
            paginatorPage: {
              dependencyType: "stateVariable",
              componentName: stateValues.paginatorComponentName,
              variableName: "currentPage",
            },
          };
        }
      },
      definition({ dependencyValues }) {
        if ("paginatorPage" in dependencyValues) {
          return {
            setValue: { currentPage: dependencyValues.paginatorPage },
          };
        } else {
          return { setValue: { currentPage: 1 } };
        }
      },
    };

    stateVariableDefinitions.numPages = {
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["paginatorComponentName"],
      returnDependencies({ stateValues }) {
        if (!stateValues.paginatorComponentName) {
          return {};
        } else {
          return {
            paginatorNPages: {
              dependencyType: "stateVariable",
              componentName: stateValues.paginatorComponentName,
              variableName: "numPages",
            },
          };
        }
      },
      definition({ dependencyValues }) {
        if ("paginatorNPages" in dependencyValues) {
          return {
            setValue: { numPages: dependencyValues.paginatorNPages },
          };
        } else {
          return { setValue: { numPages: 1 } };
        }
      },
    };

    return stateVariableDefinitions;
  }
}
