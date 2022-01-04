import Input from './abstract/Input';
import me from 'math-expressions';
import { getFromText, getFromLatex, roundForDisplay, } from '../utils/math';

export default class MathInput extends Input {
  constructor(args) {
    super(args);

    this.actions = {
      updateImmediateValue: this.updateImmediateValue.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      ),
      updateRawValue: this.updateRawValue.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      ),
      updateValue: this.updateValue.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      )
    };

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
  static componentType = "mathInput";

  static variableForPlainMacro = "value";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.prefill = {
      createComponentOfType: "math",
      createStateVariable: "prefill",
      defaultValue: me.fromAst("\uff3f"),
      public: true,
      copyComponentAttributesForCreatedComponent: ["format", "functionSymbols", "splitSymbols"],
      noInverse: true,
    };
    attributes.format = {
      createComponentOfType: "text",
      createStateVariable: "format",
      defaultValue: "text",
      public: true,
    };
    attributes.size = {
      createComponentOfType: "number",
      createStateVariable: "size",
      defaultValue: 10,
      forRenderer: true,
      public: true,
    };
    attributes.functionSymbols = {
      createComponentOfType: "textList",
      createStateVariable: "functionSymbols",
      defaultValue: ["f", "g"],
      forRenderer: true,
      public: true,
    };
    attributes.splitSymbols = {
      createComponentOfType: "boolean",
      createStateVariable: "splitSymbols",
      defaultValue: true,
      forRenderer: true,
      public: true,
    };
    attributes.displayDigits = {
      createComponentOfType: "integer",
      createStateVariable: "displayDigits",
      defaultValue: 10,
      public: true,
    };
    attributes.displayDecimals = {
      createComponentOfType: "integer",
      createStateVariable: "displayDecimals",
      defaultValue: null,
      public: true,
    };
    attributes.displaySmallAsZero = {
      createComponentOfType: "number",
      createStateVariable: "displaySmallAsZero",
      valueForTrue: 1E-14,
      valueForFalse: 0,
      defaultValue: 0,
      public: true,
    };
    attributes.bindValueTo = {
      createComponentOfType: "math"
    };
    attributes.unionFromU = {
      createComponentOfType: "boolean",
      createStateVariable: "unionFromU",
      defaultValue: false,
      public: true,
      forRenderer: true,
    }

    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      public: true,
      componentType: "math",
      forRenderer: true,
      alwaysShadow: true,
      stateVariablesPrescribingAdditionalAttributes: {
        displayDigits: "displayDigits",
        displayDecimals: "displayDecimals",
        displaySmallAsZero: "displaySmallAsZero",
      },
      returnDependencies: () => ({
        bindValueTo: {
          dependencyType: "attributeComponent",
          attributeName: "bindValueTo",
          variableNames: ["value"],
        },
        prefill: {
          dependencyType: "stateVariable",
          variableName: "prefill"
        }
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

        return { newValues: { value: dependencyValues.bindValueTo.stateValues.value } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        // console.log(`inverse definition of value for mathInput`)
        // console.log(desiredStateVariableValues)

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
        // no children, so value is essential and give it the desired value
        return {
          success: true,
          instructions: [{
            setStateVariable: "value",
            value: desiredStateVariableValues.value
          }]
        };
      }
    }

    stateVariableDefinitions.immediateValue = {
      public: true,
      componentType: "math",
      forRenderer: true,
      stateVariablesPrescribingAdditionalAttributes: {
        displayDigits: "displayDigits",
        displayDecimals: "displayDecimals",
        displaySmallAsZero: "displaySmallAsZero",
      },
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        }
      }),
      definition: function ({ dependencyValues, changes }) {
        // console.log(`definition of immediateValue`)
        // console.log(dependencyValues)
        // console.log(changes);
        // console.log(dependencyValues.value.toString())

        if (changes.value) {
          // only update to value when it changes
          // (otherwise, let its essential value change)
          return {
            newValues: { immediateValue: dependencyValues.value },
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
          setStateVariable: "immediateValue",
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

    stateVariableDefinitions.valueForDisplay = {
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits"
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals"
        },
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero"
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {
        // round any decimal numbers to the significant digits
        // determined by displaydigits or displaydecimals
        let rounded = roundForDisplay({
          value: dependencyValues.value,
          dependencyValues, usedDefault
        });

        return {
          newValues: { valueForDisplay: rounded }
        }
      }
    }


    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        valueForDisplay: {
          dependencyType: "stateVariable",
          variableName: "valueForDisplay"
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { text: dependencyValues.valueForDisplay.toString() } }
      }
    }


    // raw value from renderer
    stateVariableDefinitions.rawRendererValue = {
      defaultValue: null,
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          rawRendererValue: { variablesToCheck: ["rawRendererValue"] }
        }
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "rawRendererValue",
            value: desiredStateVariableValues.rawRendererValue
          }]
        }
      }
    }

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { componentType: "math" } })
    }


    return stateVariableDefinitions;

  }


  async updateImmediateValue({ mathExpression, rawRendererValue }) {
    if (!await this.stateValues.disabled) {
      // we set transient to true so that each keystroke does not
      // add a row to the database
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "immediateValue",
          value: mathExpression,
        }, {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "rawRendererValue",
          value: rawRendererValue,
        }],
        transient: true
      });
    }
  }

  async updateRawValue({ rawRendererValue, transient = false }) {
    if (!await this.stateValues.disabled) {
      // we set transient to true so that each keystroke does not
      // add a row to the database

      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "rawRendererValue",
          value: rawRendererValue,
        }],
        transient
      });
    }
  }

  async updateValue() {
    if (!await this.stateValues.disabled) {
      let immediateValue = await this.stateValues.immediateValue;
      let updateInstructions = [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "value",
        value: immediateValue,
      }, {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "rawRendererValue",
        value: await this.stateValues.rawRendererValue,  // so gets saved to database
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
      }];

      let event = {
        verb: "answered",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: immediateValue,
          responseText: immediateValue.toString(),
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
        event,
      });

      return await this.coreFunctions.triggerChainedActions({
        componentName: this.componentName,
      });


    }
  }

}
