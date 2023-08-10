import BlockComponent from "./abstract/BlockComponent";

export default class CodeViewer extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      updateComponents: this.updateComponents.bind(this),
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "codeViewer";
  static renderChildren = true;

  static includeBlankStringChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.codeSource = {
      createTargetComponentNames: true,
    };

    attributes.width = {
      createComponentOfType: "_componentSize",
    };

    attributes.height = {
      createComponentOfType: "_componentSize",
    };

    attributes.hasCodeEditorParent = {
      createComponentOfType: "boolean",
    };

    attributes.renderedName = {
      createPrimitiveOfType: "string",
    };

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.hasCodeEditorParent = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      forRenderer: true,
      returnDependencies: () => ({
        codeEditorParent: {
          dependencyType: "parentIdentity",
          parentComponentType: "codeEditor",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.codeEditorParent) {
          return { setValue: { hasCodeEditorParent: true } };
        } else {
          //Default
          return { setValue: { hasCodeEditorParent: false } };
        }
      },
    };

    stateVariableDefinitions.locationFromParent = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      returnDependencies: () => ({
        locationFromParent: {
          dependencyType: "parentStateVariable",
          parentComponentType: "codeEditor",
          variableName: "resultsLocation",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            locationFromParent: dependencyValues.locationFromParent || null,
          },
        };
      },
    };

    stateVariableDefinitions.width = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "_componentSize",
      },
      hasEssential: true,
      forRenderer: true,
      defaultValue: { size: 100, isAbsolute: false },
      returnDependencies: () => ({
        widthAttr: {
          dependencyType: "attributeComponent",
          attributeName: "width",
          variableNames: ["componentSize"],
        },
        parentWidth: {
          dependencyType: "parentStateVariable",
          variableName: "viewerWidth",
          parentComponentType: "codeEditor",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.widthAttr) {
          //Author specified width
          return {
            setValue: {
              width: dependencyValues.widthAttr.stateValues.componentSize,
            },
          };
        } else if (dependencyValues.parentWidth) {
          //Parent component specified viewerWidth
          return { setValue: { width: dependencyValues.parentWidth } };
        } else {
          //Default
          return { useEssentialOrDefaultValue: { width: true } };
        }
      },
    };

    stateVariableDefinitions.height = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "_componentSize",
      },
      hasEssential: true,
      forRenderer: true,
      defaultValue: { size: 400, isAbsolute: true },
      returnDependencies: () => ({
        heightAttr: {
          dependencyType: "attributeComponent",
          attributeName: "height",
          variableNames: ["componentSize"],
        },
        parentViewerHeight: {
          dependencyType: "parentStateVariable",
          variableName: "viewerHeight",
          parentComponentType: "codeEditor",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.heightAttr) {
          //Author specified height
          return {
            setValue: {
              height: dependencyValues.heightAttr.stateValues.componentSize,
            },
          };
        } else if (dependencyValues.parentViewerHeight) {
          //Parent component specified viewerheight
          return { setValue: { height: dependencyValues.parentViewerHeight } };
        } else {
          //Default
          return { useEssentialOrDefaultValue: { height: true } };
        }
      },
    };

    stateVariableDefinitions.codeSourceComponentName = {
      returnDependencies: () => ({
        codeSource: {
          dependencyType: "attributeTargetComponentNames",
          attributeName: "codeSource",
        },
      }),
      definition({ dependencyValues }) {
        let codeSourceComponentName;

        if (dependencyValues.codeSource?.length === 1) {
          codeSourceComponentName = dependencyValues.codeSource[0].absoluteName;
        } else {
          codeSourceComponentName = null;
        }

        return { setValue: { codeSourceComponentName } };
      },
    };

    stateVariableDefinitions.codeSource = {
      returnDependencies: () => ({
        codeSourceComponentName: {
          dependencyType: "stateVariable",
          variableName: "codeSourceComponentName",
        },
        codeEditorParent: {
          dependencyType: "parentIdentity",
          parentComponentType: "codeEditor",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.codeSourceComponentName) {
          return {
            setValue: { codeSource: dependencyValues.codeSourceComponentName },
          };
        } else if (dependencyValues.codeEditorParent) {
          return {
            setValue: {
              codeSource: dependencyValues.codeEditorParent.componentName,
            },
          };
        } else {
          return { setValue: { codeSource: null } };
        }
      },
    };

    stateVariableDefinitions.doenetMLFromSource = {
      stateVariablesDeterminingDependencies: ["codeSource"],
      returnDependencies: ({ stateValues }) => ({
        doenetML: {
          dependencyType: "stateVariable",
          componentName: stateValues.codeSource,
          variableName: "text",
          variablesOptional: true,
        },
      }),
      definition({ dependencyValues }) {
        let doenetML = "";

        if (dependencyValues.doenetML) {
          doenetML = dependencyValues.doenetML;
          if (typeof doenetML !== "string") {
            doenetML = "";
          }
        }

        return { setValue: { doenetMLFromSource: doenetML } };
      },
    };

    stateVariableDefinitions.doenetML = {
      forRenderer: true,
      hasEssential: true,
      doNotShadowEssential: true,
      provideEssentialValuesInDefinition: true,
      returnDependencies: () => ({
        doenetMLFromSource: {
          dependencyType: "stateVariable",
          variableName: "doenetMLFromSource",
        },
      }),
      definition({ dependencyValues, essentialValues }) {
        let result = {
          useEssentialOrDefaultValue: {
            doenetML: {
              defaultValue: dependencyValues.doenetMLFromSource,
            },
          },
        };
        if (essentialValues.doenetML === undefined) {
          result.setEssentialValue = {
            doenetML: dependencyValues.doenetMLFromSource,
          };
        }
        return result;
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "doenetML",
              value: desiredStateVariableValues.doenetML,
            },
          ],
        };
      },
    };

    return stateVariableDefinitions;
  }

  async updateComponents({
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let updateInstructions = [
      {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "doenetML",
        value: await this.stateValues.doenetMLFromSource,
      },
    ];

    await this.coreFunctions.performUpdate({
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
