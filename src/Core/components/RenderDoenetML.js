import BlockComponent from "./abstract/BlockComponent";

export default class RenderDoenetML extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      updateComponents: this.updateComponents.bind(this),
    });
  }
  static componentType = "renderDoenetML";

  static excludeFromSchema = true;

  static assignNamesToReplacements = true;

  static createsVariants = true;

  static stateVariableToEvaluateAfterReplacements = "triggerUpdates";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number",
    };

    attributes.codeSource = {
      createTargetComponentNames: true,
    };

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

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
        parentCodeSource: {
          dependencyType: "parentStateVariable",
          parentComponentType: "codeViewer",
          variableName: "codeSource",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.codeSourceComponentName) {
          return {
            setValue: { codeSource: dependencyValues.codeSourceComponentName },
          };
        } else if (dependencyValues.parentCodeSource) {
          return {
            setValue: { codeSource: dependencyValues.parentCodeSource },
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
      // event: {
      //   verb: "selected",
      //   object: {
      //     componentName: this.componentName,
      //     componentType: this.componentType,
      //   },
      //   result: {
      //     response: newValue,
      //     responseText: newValue.toString(),
      //   }
      // },
    });
  }
}
