import Input from './abstract/Input';

export default class Textinput extends Input {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      updateImmediateValue: this.updateImmediateValue.bind(this),
      updateValue: this.updateValue.bind(this)
    });


    this.externalActions = {};

    //Complex because the stateValues isn't defined until later
    Object.defineProperty(this.externalActions, 'submitAnswer', {
      enumerable: true,
      get: async function () {
        let answerAncestor = await this.stateValues.answerAncestor;
        if (answerAncestor !== null) {
          return {
            componentName: answerAncestor.componentName,
            actionName: "submitAnswer"
          }
        } else {
          return;
        }
      }.bind(this)
    });

  }
  static componentType = "textInput";

  static variableForPlainMacro = "value";
  static variableForPlainCopy = "value";

  static processWhenJustUpdatedForNewComponent = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.prefill = {
      createComponentOfType: "text",
      createStateVariable: "prefill",
      defaultValue: "",
      public: true,
    };
    attributes.size = {
      createComponentOfType: "number",
      createStateVariable: "size",
      defaultValue: 10,
      forRenderer: true,
      public: true,
    };
    attributes.bindValueTo = {
      createComponentOfType: "text"
    };
    attributes.expanded = {
      createComponentOfType: "boolean",
      createStateVariable: "expanded",
      defaultValue: false,
      forRenderer: true,
      public: true,
      fallBackToParentStateVariable: "expanded",
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
      defaultValue: { size: 120, isAbsolute: true },
      forRenderer: true,
      public: true,
    };
    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      hasEssential: true,
      shadowVariable: true,
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
      forRenderer: true,
      hasEssential: true,
      shadowVariable: true,
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
            setEssentialValue: { immediateValue: dependencyValues.value }
          };


        } else {
          return {
            useEssentialOrDefaultValue: {
              immediateValue: {
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


  async updateImmediateValue({ text, actionId, sourceInformation = {}, skipRendererUpdate = false, }) {
    if (!await this.stateValues.disabled) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "immediateValue",
          value: text,
        }, {
          updateType: "setComponentNeedingUpdateValue",
          componentName: this.componentName,
        }],
        transient: true,
        actionId,
        sourceInformation,
        skipRendererUpdate,
      })
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  async updateValue({ actionId, sourceInformation = {}, skipRendererUpdate = false, }) {
    if (!await this.stateValues.disabled) {
      let immediateValue = await this.stateValues.immediateValue;

      if (await this.stateValues.value !== immediateValue) {

        let updateInstructions = [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "value",
          value: immediateValue,
        },
        // in case value ended up being a different value than requested
        // we set immediate value to whatever was the result
        // (hence the need to execute update first)
        // Also, this makes sure immediateValue is saved to the database,
        // since in updateImmediateValue, immediateValue is not saved to database
        {
          updateType: "executeUpdate"
        },
        {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "immediateValue",
          valueOfStateVariable: "value",
        }, {
          updateType: "unsetComponentNeedingUpdateValue",
        }];

        let event = {
          verb: "answered",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            response: immediateValue,
            responseText: immediateValue,
          }
        }

        let answerAncestor = await this.stateValues.answerAncestor;
        if (answerAncestor) {
          event.context = {
            answerAncestor: answerAncestor.componentName
          }
        }

        await this.coreFunctions.performUpdate({
          updateInstructions,
          actionId,
          sourceInformation,
          skipRendererUpdate: true,
          event
        });

        return await this.coreFunctions.triggerChainedActions({
          componentName: this.componentName,
          actionId,
          sourceInformation,
          skipRendererUpdate,
        });

      }

    }

    this.coreFunctions.resolveAction({ actionId });

  }

}
