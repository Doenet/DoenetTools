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

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
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
      fallBackToParentStateVariable: "splitSymbols",
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
    attributes.hideNaN = {
      createComponentOfType: "boolean",
      createStateVariable: "hideNaN",
      defaultValue: true,
      public: true,
    }

    return attributes;
  }


  static returnSugarInstructions() {
    let sugarInstructions = [];

    function addMath({ matchedChildren }) {

      if (matchedChildren.length === 0) {
        return { success: false }
      } else {
        return {
          success: true,
          newChildren: [{
            componentType: "math",
            children: matchedChildren
          }]
        }
      }
    }

    sugarInstructions.push({
      replacementFunction: addMath
    });

    return sugarInstructions;

  }

  static returnChildGroups() {

    return [{
      group: "maths",
      componentTypes: ["math"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero"],
      },
      hasEssential: true,
      shadowVariable: true,
      returnDependencies: () => ({
        mathChild: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value"]
        },
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
        if (dependencyValues.mathChild.length > 0) {
          return { setValue: { value: dependencyValues.mathChild[0].stateValues.value } };
        } else if (dependencyValues.bindValueTo) {
          return { setValue: { value: dependencyValues.bindValueTo.stateValues.value } };
        } else {
          return {
            useEssentialOrDefaultValue: {
              value: {
                defaultValue: dependencyValues.prefill
              }
            }
          }
        }

      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        // console.log(`inverse definition of value for mathInput`)
        // console.log(desiredStateVariableValues)


        if (dependencyValues.mathChild.length > 0) {
          return {
            success: true,
            instructions: [{
              setDependency: "mathChild",
              desiredValue: desiredStateVariableValues.value,
              variableIndex: 0,
              childIndex: 0,
            }]
          };
        } else if (dependencyValues.bindValueTo) {
          return {
            success: true,
            instructions: [{
              setDependency: "bindValueTo",
              desiredValue: desiredStateVariableValues.value,
              variableIndex: 0,
            }]
          };
        } else {
          // no child or bindValueTo, so value is essential and give it the desired value
          return {
            success: true,
            instructions: [{
              setEssentialValue: "value",
              value: desiredStateVariableValues.value
            }]
          };
        }
      }
    }

    stateVariableDefinitions.immediateValue = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero"]
      },
      hasEssential: true,
      shadowVariable: true,
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
      shadowingInstructions: {
        createComponentOfType: "text",
      },
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

    stateVariableDefinitions.dontUpdateRawValueInDefinition = {
      defaultValue: false,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({ useEssentialOrDefaultValue: { dontUpdateRawValueInDefinition: true } }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "dontUpdateRawValueInDefinition",
            value: desiredStateVariableValues.dontUpdateRawValueInDefinition
          }]
        }
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
      shadowingInstructions: {
        createComponentOfType: "text",
      },
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
        hideNaN: {
          dependencyType: "stateVariable",
          variableName: "hideNaN"
        },
        dontUpdateRawValueInDefinition: {
          dependencyType: "stateVariable",
          variableName: "dontUpdateRawValueInDefinition"
        },

      }),
      definition({ dependencyValues, essentialValues, justUpdatedForNewComponent, componentName }) {

        // console.log(`definition of raw value for ${componentName}`)
        // console.log(JSON.parse(JSON.stringify(dependencyValues)), JSON.parse(JSON.stringify(essentialValues)))

        // use deepCompare of trees rather than equalsViaSyntax
        // so even tiny numerical differences that are within double precision are detected
        if (essentialValues.rawRendererValue === undefined
          || !(
            justUpdatedForNewComponent
            || deepCompare(essentialValues.lastValueForDisplay.tree, dependencyValues.valueForDisplay.tree)
            || dependencyValues.dontUpdateRawValueInDefinition
          )
        ) {
          let rawRendererValue = stripLatex(dependencyValues.valueForDisplay.toLatex({ showBlanks: false }));
          if (dependencyValues.hideNaN && rawRendererValue === "NaN") {
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
      async inverseDefinition({ desiredStateVariableValues, stateValues, essentialValues, dependencyValues, componentName }) {

        // console.log(`inverse definition of rawRenderer value for ${componentName}`, desiredStateVariableValues, JSON.parse(JSON.stringify(essentialValues)))

        const calculateMathExpressionFromLatex = async (text) => {

          let expression;

          text = normalizeLatexString(text, {
            unionFromU: await stateValues.unionFromU,
          });

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
        } else if (desiredStateVariableValues.rawRendererValue instanceof me.class) {
          // When desired rawRendererValue is a math-expression
          // always update lastValueForDisplay
          // Update rawRendererValue if desired expression is different 
          // from math-expression obtained from current raw value
          // Do not update immediate value

          instructions.push({
            setEssentialValue: "lastValueForDisplay",
            value: desiredStateVariableValues.rawRendererValue
          })


          let currentMath = await calculateMathExpressionFromLatex(essentialValues.rawRendererValue);

          // use deepCompare of trees rather than equalsViaSyntax
          // so even tiny numerical differences that are within double precision are detected
          if (!deepCompare(desiredStateVariableValues.rawRendererValue.tree, currentMath.tree)) {

            let desiredValue = stripLatex(desiredStateVariableValues.rawRendererValue.toLatex({ showBlanks: false }));
            if (dependencyValues.hideNaN && desiredValue === "NaN") {
              desiredValue = '';
            }
            instructions.push({
              setEssentialValue: "rawRendererValue",
              value: desiredValue
            })

          }


        } else if (desiredStateVariableValues.lastValueForDisplay instanceof me.class) {
          // if desired value for lastValueForDisplay is a math,
          // then only update lastValueForDisplay and not rawRendererValue

          instructions.push({
            setEssentialValue: "lastValueForDisplay",
            value: desiredStateVariableValues.lastValueForDisplay
          })
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
        }],
        transient: true,
        actionId,
      });
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  async updateValue({ actionId }) {
    if (!await this.stateValues.disabled) {
      let immediateValue = await this.stateValues.immediateValue;

      if (!deepCompare((await this.stateValues.value).tree, immediateValue.tree)) {

        let updateInstructions = [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "dontUpdateRawValueInDefinition",
          value: true,
        },
        {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "value",
          value: immediateValue,
        },
        // in case value ended up being a different value than requested
        // we set immediate value to whatever was the result
        // (hence the need to execute update first)
        {
          updateType: "executeUpdate"
        },
        {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "dontUpdateRawValueInDefinition",
          value: false,
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
          // since have invalid math,
          // don't update rawRendererValue,
          // but only update lastValueForDisplay to keep it in sync
          // (lastValueForDisplay is also update if set rawRendererValue to math
          // as above)
          updateInstructions.push({
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "lastValueForDisplay",
            valueOfStateVariable: "valueForDisplay",
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
          actionId,
          event,
        });

        return await this.coreFunctions.triggerChainedActions({
          componentName: this.componentName,
        });

      } else {
        this.coreFunctions.resolveAction({ actionId });
      }

    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  static adapters = [
    {
      stateVariable: "value",
      stateVariablesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero"]
    }
  ];

}
