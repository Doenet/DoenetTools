import BlockComponent from './abstract/BlockComponent.js';

export default class CodeEditor extends BlockComponent {
  static componentType = "codeEditor";

  static variableForPlainMacro = "value";

  static renderChildren = true;

  static get stateVariablesShadowedForReference() {
    return ["value"]
  };

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.prefill = {
      createComponentOfType: "text",
      createStateVariable: "prefill",
      defaultValue: "",
      public: true,
    };
    attributes.bindValueTo = {
      createComponentOfType: "text"
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

    attributes.renderedName = {
      createPrimitiveOfType: "string",
    }

    attributes.staticName = {
      createPrimitiveOfType: "string",
    }

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let addCodeViewer = function ({ matchedChildren, componentAttributes }) {

      if (matchedChildren.length > 0) {
        return { success: false }
      }

      let codeViewer = {
        componentType: "codeViewer",
        children: [{ componentType: "renderDoenetML" }]
      };

      //Update depends on this being the 1st index position
      let newChildren = [codeViewer];

      if (componentAttributes.renderedName) {
        codeViewer.attributes = {
          renderedName: { primitive: componentAttributes.renderedName }
        }
        codeViewer.children[0].props = { name: componentAttributes.renderedName }
      }

      if (componentAttributes.staticName) {
        let hiddenRenderDoenetML = {
          componentType: "codeViewer",
          attributes: { hide: { component: { componentType: "boolean", state: { value: true } } } },
          children: [{
            componentType: "renderDoenetML",
            props: { name: componentAttributes.staticName },
          }]
        };
        //Update code depends on this being the 2nd index position
        newChildren.push(hiddenRenderDoenetML)
      }



      return {
        success: true,
        newChildren,
      }

    }
    sugarInstructions.push({
      replacementFunction: addCodeViewer
    })
    return sugarInstructions;
  }

  static returnChildGroups() {

    return [{
      group: "codeViewers",
      componentTypes: ["codeViewer"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.viewerHeight = {
      returnDependencies: () => ({
        height: {
          dependencyType: "stateVariable",
          variableName: "height"
        },
        viewerRatio: {
          dependencyType: "stateVariable",
          variableName: "viewerRatio"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.height.isAbsolute) {
          throw Error("Codeeditor relative height not implemented")
        }
        let size = dependencyValues.height.size * dependencyValues.viewerRatio;
        let viewerHeight = { size, isAbsolute: true }
        return { setValue: { viewerHeight } };
      },
    }

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
          variableName: "prefill"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.bindValueTo) {
          return {
            useEssentialOrDefaultValue: {
              value: {
                variablesToCheck: "value",
                defaultValue: dependencyValues.prefill
              }
            }
          }
        }
        return { setValue: { value: dependencyValues.bindValueTo.stateValues.value } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        if (dependencyValues.bindValueTo) {
          return {
            success: true,
            instructions: [{
              setDependency: "bindValueTo",
              desiredValue: desiredStateVariableValues.value,
              variableIndex: 0,
            }]
          };
        }

        // subsetValue is essential; give it the desired value
        return {
          success: true,
          instructions: [{
            setEssentialValue: "value",
            value: desiredStateVariableValues.value
          }]
        };
      }
    }

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
          variableName: "value"
        }
      }),
      definition: function ({ dependencyValues, changes, justUpdatedForNewComponent }) {
        // console.log(`definition of immediateValue`)
        // console.log(dependencyValues)
        // console.log(changes);

        if (changes.value && !justUpdatedForNewComponent) {
          // only update to value when it changes
          // (otherwise, let its essential value change)
          return {
            setValue: { immediateValue: dependencyValues.value },
            makeEssential: { immediateValue: true }
          };


        } else {
          return {
            useEssentialOrDefaultValue: {
              immediateValue: {
                variablesToCheck: "immediateValue",
                defaultValue: dependencyValues.value
              }
            }
          }
        }

      },
      inverseDefinition: function ({ desiredStateVariableValues, initialChange, shadowedVariable }) {

        // value is essential; give it the desired value
        let instructions = [{
          setEssentialValue: "immediateValue",
          value: desiredStateVariableValues.immediateValue
        }]


        // if from outside sources, also set value
        if (!(initialChange || shadowedVariable)) {
          instructions.push({
            setDependency: "value",
            desiredValue: desiredStateVariableValues.immediateValue
          })
        }

        return {
          success: true,
          instructions
        };
      }
    }

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        }
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { text: dependencyValues.value } }
      }
    }

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { componentType: "text" } })
    }


    return stateVariableDefinitions;

  }


  updateImmediateValue({ text, actionId }) {
    if (!this.stateValues.disabled) {
      return this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "immediateValue",
          value: text,
        }],
        actionId
      })
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  updateValue({ actionId }) {
    //Only update when value is out of date
    if (!this.stateValues.disabled &&
      this.stateValues.immediateValue !== this.stateValues.value
    ) {
      let updateInstructions = [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "value",
        value: this.stateValues.immediateValue,
      },
      // in case value ended up being a different value than requested
      // we set immediate value to whatever was the result
      // (hence the need to execute update first)
      // Also, this makes sure immediateValue is saved to the database,
      // since in updateImmediateValue, immediateValue is note saved to database
      {
        updateType: "executeUpdate"
      },
      {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "immediateValue",
        valueOfStateVariable: "value",
      }];

      let event = {
        verb: "answered",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: this.stateValues.immediateValue,
          responseText: this.stateValues.immediateValue,
        }
      }

      if (this.stateValues.answerAncestor) {
        event.context = {
          answerAncestor: this.stateValues.answerAncestor.componentName
        }
      }

      return this.coreFunctions.performUpdate({
        updateInstructions,
        actionId,
        event
      }).then(() => {
        this.coreFunctions.triggerChainedActions({
          componentName: this.componentName,
        })
        if (this.attributes.staticName &&
          this.definingChildren.length === 2 &&
          this.definingChildren[1].componentType === 'codeViewer') {
          this.coreFunctions.performAction({
            componentName: this.definingChildren[1].componentName,
            actionName: "updateComponents",
          });
        }
      });

    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  async updateComponents() {

    if (this.definingChildren.length === 1 &&
      this.definingChildren[0].componentType === 'codeViewer') {
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

  actions = {
    updateImmediateValue: this.updateImmediateValue.bind(this),
    updateValue: this.updateValue.bind(this),
    updateComponents: this.updateComponents.bind(this),
  };

}
