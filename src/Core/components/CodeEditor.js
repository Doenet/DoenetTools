import BlockComponent from "./abstract/BlockComponent";

export default class CodeEditor extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      updateImmediateValue: this.updateImmediateValue.bind(this),
      updateValue: this.updateValue.bind(this),
      updateComponents: this.updateComponents.bind(this),
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "codeEditor";

  static variableForPlainMacro = "value";
  static variableForPlainCopy = "value";

  static renderChildren = true;

  static processWhenJustUpdatedForNewComponent = true;

  static get stateVariablesShadowedForReference() {
    return ["value"];
  }

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.prefill = {
      createComponentOfType: "text",
      createStateVariable: "prefill",
      defaultValue: "",
      public: true,
    };
    attributes.bindValueTo = {
      createComponentOfType: "text",
    };

    attributes.width = {
      createComponentOfType: "_componentSize",
      createStateVariable: "width",
      defaultValue: { size: 600, isAbsolute: true },
      forRenderer: true,
      public: true,
    };
    attributes.height = {
      createComponentOfType: "_componentSize",
      createStateVariable: "height",
      defaultValue: { size: 400, isAbsolute: true },
      forRenderer: true,
      public: true,
    };
    attributes.viewerRatio = {
      createComponentOfType: "number",
      createStateVariable: "viewerRatio",
      defaultValue: 0.5,
      forRenderer: true,
      public: true,
    };

    attributes.showResults = {
      createComponentOfType: "boolean",
      createStateVariable: "showResults",
      defaultValue: false,
      forRenderer: true,
      public: true,
    };

    attributes.resultsLocation = {
      createComponentOfType: "text",
      createStateVariable: "resultsLocation",
      defaultValue: "bottom",
      forRenderer: true,
      public: true,
      toLowerCase: true,
      validValues: ["bottom", "left", "right"],
    };

    // Note: these attributes don't accomplish anything
    // until we can find a way to communicate with the
    // rendered DoenetML again
    attributes.renderedName = {
      createPrimitiveOfType: "string",
    };

    attributes.staticName = {
      createPrimitiveOfType: "string",
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let addCodeViewer = function ({ matchedChildren, componentAttributes }) {
      let codeViewer = {
        componentType: "codeViewer",
        children: [{ componentType: "renderDoenetML" }],
      };

      //Update depends on this being the 1st index position
      let newChildren = [codeViewer];

      if (componentAttributes.renderedName) {
        codeViewer.attributes = {
          renderedName: { primitive: componentAttributes.renderedName },
        };
        codeViewer.children[0].props = {
          name: componentAttributes.renderedName,
        };
      }

      // TODO: if we can come up with a way to communicate to the rendered doenetML
      // we can revive the static version
      // if (componentAttributes.staticName) {
      //   let hiddenRenderDoenetML = {
      //     componentType: "codeViewer",
      //     attributes: {
      //       hide: {
      //         component: { componentType: "boolean", state: { value: true } },
      //       },
      //     },
      //     children: [
      //       {
      //         componentType: "renderDoenetML",
      //         props: { name: componentAttributes.staticName },
      //       },
      //     ],
      //   };
      //   //Update code depends on this being the 2nd index position
      //   newChildren.push(hiddenRenderDoenetML);
      // }

      newChildren.push(...matchedChildren);

      return {
        success: true,
        newChildren,
      };
    };
    sugarInstructions.push({
      replacementFunction: addCodeViewer,
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

    stateVariableDefinitions.viewerHeight = {
      returnDependencies: () => ({
        height: {
          dependencyType: "stateVariable",
          variableName: "height",
        },
        viewerRatio: {
          dependencyType: "stateVariable",
          variableName: "viewerRatio",
        },
        resultsLocation: {
          dependencyType: "stateVariable",
          variableName: "resultsLocation",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.height.isAbsolute) {
          throw Error("Codeeditor relative height not implemented");
        }
        let size = dependencyValues.height.size;
        if (dependencyValues.resultsLocation === "bottom") {
          size *= dependencyValues.viewerRatio;
        }
        let viewerHeight = { size, isAbsolute: true };
        return { setValue: { viewerHeight } };
      },
    };

    stateVariableDefinitions.prefillFromChildren = {
      returnDependencies: () => ({
        childrenDoenetML: {
          dependencyType: "doenetML",
          displayOnlyChildren: true,
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { prefillFromChildren: dependencyValues.childrenDoenetML },
        };
      },
    };

    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      hasEssential: true,
      forRenderer: true,
      returnDependencies: () => ({
        bindValueTo: {
          dependencyType: "attributeComponent",
          attributeName: "bindValueTo",
          variableNames: ["value"],
        },
        prefill: {
          dependencyType: "stateVariable",
          variableName: "prefill",
        },
        prefillFromChildren: {
          dependencyType: "stateVariable",
          variableName: "prefillFromChildren",
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {
        if (!dependencyValues.bindValueTo) {
          return {
            useEssentialOrDefaultValue: {
              value: {
                variablesToCheck: "value",
                get defaultValue() {
                  if (usedDefault.prefill) {
                    return dependencyValues.prefillFromChildren;
                  } else {
                    return dependencyValues.prefill;
                  }
                },
              },
            },
          };
        }
        return {
          setValue: { value: dependencyValues.bindValueTo.stateValues.value },
        };
      },
      inverseDefinition: function ({
        desiredStateVariableValues,
        dependencyValues,
      }) {
        if (dependencyValues.bindValueTo) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "bindValueTo",
                desiredValue: desiredStateVariableValues.value,
                variableIndex: 0,
              },
            ],
          };
        }

        // subsetValue is essential; give it the desired value
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "value",
              value: desiredStateVariableValues.value,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.immediateValue = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      hasEssential: true,
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
        },
      }),
      definition: function ({
        dependencyValues,
        changes,
        justUpdatedForNewComponent,
      }) {
        // console.log(`definition of immediateValue`)
        // console.log(dependencyValues)
        // console.log(changes);

        if (changes.value && !justUpdatedForNewComponent) {
          // only update to value when it changes
          // (otherwise, let its essential value change)
          return {
            setValue: { immediateValue: dependencyValues.value },
            makeEssential: { immediateValue: true },
          };
        } else {
          return {
            useEssentialOrDefaultValue: {
              immediateValue: {
                variablesToCheck: "immediateValue",
                defaultValue: dependencyValues.value,
              },
            },
          };
        }
      },
      inverseDefinition: function ({
        desiredStateVariableValues,
        initialChange,
        shadowedVariable,
      }) {
        // value is essential; give it the desired value
        let instructions = [
          {
            setEssentialValue: "immediateValue",
            value: desiredStateVariableValues.immediateValue,
          },
        ];

        // if from outside sources, also set value
        if (!(initialChange || shadowedVariable)) {
          instructions.push({
            setDependency: "value",
            desiredValue: desiredStateVariableValues.immediateValue,
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { text: dependencyValues.value } };
      },
    };

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { componentType: "text" } }),
    };

    stateVariableDefinitions.allChildren = {
      returnDependencies: () => ({
        allChildren: {
          dependencyType: "child",
          childGroups: ["anything"],
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { allChildren: dependencyValues.allChildren } };
      },
    };

    stateVariableDefinitions.childIndicesToRender = {
      stateVariablesDeterminingDependencies: ["allChildren"],
      returnDependencies({ stateValues }) {
        let dependencies = {};
        if (stateValues.allChildren[0]?.componentType === "codeViewer") {
          dependencies.firstCodeViewerFromSugar = {
            dependencyType: "doenetAttribute",
            componentName: stateValues.allChildren[0].componentName,
            attributeName: "createdFromSugar",
          };
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        let childIndicesToRender = [];

        if (dependencyValues.firstCodeViewerFromSugar) {
          childIndicesToRender.push(0);
        }

        return { setValue: { childIndicesToRender } };
      },
    };

    return stateVariableDefinitions;
  }

  async updateImmediateValue({
    text,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.disabled)) {
      return this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "immediateValue",
            value: text,
          },
          {
            updateType: "setComponentNeedingUpdateValue",
            componentName: this.componentName,
          },
        ],
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  async updateValue({
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    //Only update when value is out of date
    if (!(await this.stateValues.disabled)) {
      let immediateValue = await this.stateValues.immediateValue;

      if ((await this.stateValues.value) !== immediateValue) {
        let updateInstructions = [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "value",
            value: immediateValue,
          },
          // in case value ended up being a different value than requested
          // we set immediate value to whatever was the result
          // (hence the need to execute update first)
          // Also, this makes sure immediateValue is saved to the database,
          // since in updateImmediateValue, immediateValue is note saved to database
          {
            updateType: "executeUpdate",
          },
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "immediateValue",
            valueOfStateVariable: "value",
          },
          {
            updateType: "unsetComponentNeedingUpdateValue",
          },
        ];

        let event = {
          verb: "answered",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            response: immediateValue,
            responseText: immediateValue,
          },
        };

        let answerAncestor = await this.stateValues.answerAncestor;
        if (answerAncestor) {
          event.context = {
            answerAncestor: answerAncestor.componentName,
          };
        }

        return this.coreFunctions
          .performUpdate({
            updateInstructions,
            actionId,
            sourceInformation,
            skipRendererUpdate: true,
            event,
          })
          .then(() => {
            this.coreFunctions.triggerChainedActions({
              componentName: this.componentName,
              actionId,
              sourceInformation,
              skipRendererUpdate,
            });
            if (
              this.attributes.staticName &&
              this.definingChildren[1]?.componentType === "codeViewer" &&
              this.definingChildren[1].doenetAttributes.createdFromSugar
            ) {
              this.coreFunctions.performAction({
                componentName: this.definingChildren[1].componentName,
                actionName: "updateComponents",
                args: { sourceInformation, skipRendererUpdate },
              });
            }
          });
      }
    }

    this.coreFunctions.resolveAction({ actionId });
  }

  async updateComponents() {
    if (
      this.definingChildren[0]?.componentType === "codeViewer" &&
      this.definingChildren[0].doenetAttributes?.createdFromSugar
    ) {
      await this.coreFunctions.performAction({
        componentName: this.definingChildren[0].componentName,
        actionName: "updateComponents",
        // event: {
        //   verb: "selected",
        //   object: {
        //     componentName: this.componentName,
        //     componentType: this.componentType,
        //   },
        // },
      });
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
