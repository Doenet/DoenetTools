import Input from './abstract/Input';
import me from 'math-expressions';
import { getFromText, getFromLatex, roundForDisplay, stripLatex, normalizeLatexString, convertValueToMathExpression, } from '../utils/math';
import { deepCompare } from '../utils/deepFunctions';

export default class MathInput extends Input {
  constructor(args) {
    super(args);

    this.actions = {
      updateRawValue: this.updateRawValue.bind(this),
      updateValue: this.updateValue.bind(this)
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
    };
    attributes.format = {
      createComponentOfType: "text",
      createStateVariable: "format",
      defaultValue: "text",
      public: true,
    };
    attributes.functionSymbols = {
      createComponentOfType: "textList",
      createStateVariable: "functionSymbols",
      defaultValue: ["f", "g"],
      public: true,
    };
    attributes.splitSymbols = {
      createComponentOfType: "boolean",
      createStateVariable: "splitSymbols",
      defaultValue: true,
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
    }

    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      public: true,
      componentType: "math",
      hasEssential: true,
      shadowVariable: true,
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
      set: convertValueToMathExpression,
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
            setEssentialValue: "value",
            value: desiredStateVariableValues.value
          }]
        };
      }
    }

    stateVariableDefinitions.immediateValue = {
      public: true,
      componentType: "math",
      hasEssential: true,
      shadowVariable: true,
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
      set: convertValueToMathExpression,
      definition: function ({ dependencyValues, changes, justUpdatedForNewComponent }) {
        // console.log(`definition of immediateValue`)
        // console.log(dependencyValues)
        // console.log(changes);
        // console.log(`justUpdatedForNewComponent: ${justUpdatedForNewComponent}`)

        if (changes.value && !justUpdatedForNewComponent) {
          // only update to value when it changes
          // (otherwise, let its essential value change)
          return {
            setValue: { immediateValue: dependencyValues.value },
            setEssentialValue: { immediateValue: dependencyValues.value },
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
      set: convertValueToMathExpression,
      definition: function ({ dependencyValues, usedDefault }) {
        // round any decimal numbers to the significant digits
        // determined by displaydigits or displaydecimals
        let rounded = roundForDisplay({
          value: dependencyValues.value,
          dependencyValues, usedDefault
        });

        return {
          setValue: { valueForDisplay: rounded }
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
        return { setValue: { text: dependencyValues.valueForDisplay.toString() } }
      }
    }


    // raw value from renderer
    stateVariableDefinitions.rawRendererValue = {
      forRenderer: true,
      hasEssential: true,
      shadowVariable: true,
      defaultValue: "",
      provideEssentialValuesInDefinition: true,
      public: true,
      componentType: "text",
      additionalStateVariablesDefined: [{
        variableName: "lastValueForDisplay",
        hasEssential: true,
        shadowVariable: true,
        defaultValue: null,
        set: convertValueToMathExpression,
      }],
      returnDependencies: () => ({
        // include immediateValue for inverse definition
        immediateValue: {
          dependencyType: "stateVariable",
          variableName: "immediateValue"
        },
        valueForDisplay: {
          dependencyType: "stateVariable",
          variableName: "valueForDisplay"
        },

      }),
      definition({ dependencyValues, essentialValues, justUpdatedForNewComponent }) {

        // console.log(`definition of raw value`)
        // console.log(deepClone(dependencyValues), deepClone(essentialValues))

        // use deepCompare of trees rather than equalsViaSyntax
        // so even tiny numerical differences that within double precision are detected
        if (essentialValues.rawRendererValue === undefined
          || !(justUpdatedForNewComponent || deepCompare(essentialValues.lastValueForDisplay.tree, dependencyValues.valueForDisplay.tree))
        ) {
          let rawRendererValue = stripLatex(dependencyValues.valueForDisplay.toLatex());
          if (rawRendererValue === "\uff3f") {
            rawRendererValue = '';
          }
          return {
            setValue: {
              rawRendererValue,
              lastValueForDisplay: dependencyValues.valueForDisplay,
            },
            setEssentialValue: {
              rawRendererValue,
              lastValueForDisplay: dependencyValues.valueForDisplay,
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: {
              rawRendererValue: true,
              lastValueForDisplay: true
            }
          }
        }

      },
      async inverseDefinition({ desiredStateVariableValues, stateValues, essentialValues }) {

        // console.log(`inverse definition of rawRenderer value for ${componentName}`, desiredStateVariableValues, essentialValues)

        const calculateMathExpressionFromLatex = async (text) => {

          let expression;

          text = normalizeLatexString(text, {
            unionFromU: await stateValues.unionFromU,
          });

          // replace ^25 with ^{2}5, since mathQuill uses standard latex conventions
          // unlike math-expression's latex parser
          text = text.replace(/\^(\w)/g, '^{$1}');

          let fromLatex = getFromLatex({
            functionSymbols: await stateValues.functionSymbols,
            splitSymbols: await stateValues.splitSymbols,
          });

          try {
            expression = fromLatex(text);
          } catch (e) {
            // TODO: error on bad text
            expression = me.fromAst('\uFF3F');
          }
          return expression;
        };


        let instructions = [];

        if (typeof desiredStateVariableValues.rawRendererValue === "string") {

          let currentValue = essentialValues.rawRendererValue;
          let desiredValue = desiredStateVariableValues.rawRendererValue;

          if (currentValue !== desiredValue) {
            instructions.push({
              setEssentialValue: "rawRendererValue",
              value: desiredValue
            })
          }

          let currentMath = await calculateMathExpressionFromLatex(currentValue);
          let desiredMath = await calculateMathExpressionFromLatex(desiredValue);

          // use deepCompare of trees rather than equalsViaSyntax
          // so even tiny numerical differences that within double precision are detected
          if (!deepCompare(desiredMath.tree, currentMath.tree)) {

            instructions.push({
              setDependency: "immediateValue",
              desiredValue: desiredMath,
              treatAsInitialChange: true, // so does not change value
            })
          }
        } else {
          // since desired value was not a string, it must be a math-expression
          // always update lastValueForDisplay
          // update rawRendererValue 
          // if desired expression is different from math-expression obtained from current raw value
          // do not update immediate value

          instructions.push({
            setEssentialValue: "lastValueForDisplay",
            value: desiredStateVariableValues.rawRendererValue
          })


          let currentMath = await calculateMathExpressionFromLatex(essentialValues.rawRendererValue);

          // use deepCompare of trees rather than equalsViaSyntax
          // so even tiny numerical differences that within double precision are detected
          if (!deepCompare(desiredStateVariableValues.rawRendererValue.tree, currentMath.tree)) {

            let desiredValue = stripLatex(desiredStateVariableValues.rawRendererValue.toLatex());
            if (desiredValue === "\uff3f") {
              desiredValue = '';
            }
            instructions.push({
              setEssentialValue: "rawRendererValue",
              value: desiredValue
            })

          }


        }

        return {
          success: true,
          instructions
        }
      }
    }

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { componentType: "math" } })
    }


    return stateVariableDefinitions;

  }


  async updateRawValue({ rawRendererValue, actionId }) {
    if (!await this.stateValues.disabled) {
      // we set transient to true so that each keystroke does not
      // add a row to the database

      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "rawRendererValue",
          value: rawRendererValue,
          sourceInformation: { actionId }
        }],
        transient: true,
      });
    }
  }

  async updateValue({ actionId }) {

    if (!await this.stateValues.disabled) {
      let immediateValue = await this.stateValues.immediateValue;

      if (!deepCompare((await this.stateValues.value).tree, immediateValue.tree)) {

        let updateInstructions = [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "value",
          value: immediateValue,
          sourceInformation: { actionId }
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

        if (immediateValue.tree !== '\uff3f') {
          updateInstructions.push({
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "rawRendererValue",
            valueOfStateVariable: "valueForDisplay",
          })
        } else {
          // set raw renderer value to save it to the database,
          // as it might not have been saved
          // given that updateRawValue is transient
          updateInstructions.push({
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "rawRendererValue",
            valueOfStateVariable: "rawRendererValue",
          })
        }

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

      } else {
        // set raw renderer value to save it to the database,
        // as it might not have been saved
        // given that updateRawValue is transient
        await this.coreFunctions.performUpdate({
          updateInstructions: [{
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "rawRendererValue",
            valueOfStateVariable: "rawRendererValue",
          }]
        })
      }

    }
  }

}
