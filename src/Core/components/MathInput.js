import Input from './abstract/Input';
import me from 'math-expressions';
import { getFromText, getFromLatex, roundForDisplay, stripLatex, normalizeLatexString, convertValueToMathExpression, } from '../utils/math';
import { deepCompare } from '../utils/deepFunctions';

export default class MathInput extends Input {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      updateRawValue: this.updateRawValue.bind(this),
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
  static componentType = "mathInput";

  static variableForPlainMacro = "value";
  static variableForPlainCopy = "value";

  static processWhenJustUpdatedForNewComponent = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.prefill = {
      createComponentOfType: "math",
      createStateVariable: "prefill",
      defaultValue: me.fromAst("\uff3f"),
      public: true,
      copyComponentAttributesForCreatedComponent: ["format", "functionSymbols", "splitSymbols", "parseScientificNotation"],
    };
    attributes.prefillLatex = {
      createComponentOfType: "latex",
      createStateVariable: "prefillLatex",
      defaultValue: "",
      public: true,
    }
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
    attributes.parseScientificNotation = {
      createComponentOfType: "boolean",
      createStateVariable: "parseScientificNotation",
      defaultValue: false,
      public: true,
      fallBackToParentStateVariable: "parseScientificNotation",
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
    attributes.removeStrings = {
      createComponentOfType: "textList",
      createStateVariable: "removeStrings",
      defaultValue: null,
    }
    attributes.minWidth = {
      createComponentOfType: "integer",
      createStateVariable: "minWidth",
      defaultValue: 50,
      public: true,
      forRenderer: true,
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
        },
        prefillLatex: {
          dependencyType: "stateVariable",
          variableName: "prefillLatex"
        },
        unionFromU: {
          dependencyType: "stateVariable",
          variableName: "unionFromU"
        },
        functionSymbols: {
          dependencyType: "stateVariable",
          variableName: "functionSymbols"
        },
        splitSymbols: {
          dependencyType: "stateVariable",
          variableName: "splitSymbols"
        },
        parseScientificNotation: {
          dependencyType: "stateVariable",
          variableName: "parseScientificNotation"
        },
      }),
      set: convertValueToMathExpression,
      definition: function ({ dependencyValues, usedDefault }) {
        if (dependencyValues.mathChild.length > 0) {
          return { setValue: { value: dependencyValues.mathChild[0].stateValues.value } };
        } else if (dependencyValues.bindValueTo) {
          return { setValue: { value: dependencyValues.bindValueTo.stateValues.value } };
        } else {
          return {
            useEssentialOrDefaultValue: {
              value: {
                get defaultValue() {
                  if (!usedDefault.prefill || usedDefault.prefillLatex) {
                    return dependencyValues.prefill
                  } else {
                    return calculateMathExpressionFromLatex({
                      latex: dependencyValues.prefillLatex,
                      unionFromU: dependencyValues.unionFromU,
                      functionSymbols: dependencyValues.functionSymbols,
                      splitSymbols: dependencyValues.splitSymbols,
                      parseScientificNotation: dependencyValues.parseScientificNotation
                    });
                  }

                }
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
      definition: function ({ dependencyValues, changes, justUpdatedForNewComponent, usedDefault }) {
        // console.log(`definition of immediateValue`)
        // console.log(dependencyValues)
        // console.log(changes, usedDefault);
        // console.log(`justUpdatedForNewComponent: ${justUpdatedForNewComponent}`)

        if (changes.value && !justUpdatedForNewComponent && !usedDefault.value) {
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
        prefill: {
          dependencyType: "stateVariable",
          variableName: "prefill"
        },
        prefillLatex: {
          dependencyType: "stateVariable",
          variableName: "prefillLatex"
        },
      }),
      definition({ dependencyValues, essentialValues, justUpdatedForNewComponent, usedDefault }) {

        // console.log(`definition of raw value for ${componentName}`)
        // console.log(JSON.parse(JSON.stringify(dependencyValues)), JSON.parse(JSON.stringify(essentialValues)), JSON.parse(JSON.stringify(usedDefault)))

        // use deepCompare of trees rather than equalsViaSyntax
        // so even tiny numerical differences that are within double precision are detected
        if (essentialValues.rawRendererValue === undefined
          || !(
            justUpdatedForNewComponent
            || deepCompare(essentialValues.lastValueForDisplay.tree, dependencyValues.valueForDisplay.tree)
            || dependencyValues.dontUpdateRawValueInDefinition
          )
        ) {

          let rawRendererValue
          if (usedDefault.immediateValue && usedDefault.prefill && !usedDefault.prefillLatex) {
            rawRendererValue = stripLatex(dependencyValues.prefillLatex);
          } else {
            rawRendererValue = stripLatex(dependencyValues.valueForDisplay.toLatex({ showBlanks: false }));
          }

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

          let unionFromU = await stateValues.unionFromU;
          let functionSymbols = await stateValues.functionSymbols;
          let splitSymbols = await stateValues.splitSymbols;
          let parseScientificNotation = await stateValues.parseScientificNotation;
          let removeStrings = await stateValues.removeStrings;

          let currentMath = calculateMathExpressionFromLatex({
            latex: currentValue, unionFromU, functionSymbols, splitSymbols, parseScientificNotation, removeStrings
          });
          let desiredMath = calculateMathExpressionFromLatex({
            latex: desiredValue, unionFromU, functionSymbols, splitSymbols, parseScientificNotation, removeStrings
          });

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

          let unionFromU = await stateValues.unionFromU;
          let functionSymbols = await stateValues.functionSymbols;
          let splitSymbols = await stateValues.splitSymbols;
          let parseScientificNotation = await stateValues.parseScientificNotation;
          let removeStrings = await stateValues.removeStrings;

          let currentMath = calculateMathExpressionFromLatex({
            latex: essentialValues.rawRendererValue,
            unionFromU, functionSymbols, splitSymbols, parseScientificNotation, removeStrings
          });

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


  async updateRawValue({ rawRendererValue, actionId, sourceInformation = {}, skipRendererUpdate = false }) {
    if (!await this.stateValues.disabled) {
      // we set transient to true so that each keystroke does not
      // add a row to the database

      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "rawRendererValue",
          value: rawRendererValue,
        }, {
          updateType: "setComponentNeedingUpdateValue",
          componentName: this.componentName,
        }],
        transient: true,
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  async updateValue({ actionId, sourceInformation = {}, skipRendererUpdate = false }) {

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
        }, {
          updateType: "unsetComponentNeedingUpdateValue",
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

        // TODO: we should should skip renderer updates here,
        // but doing so triggers a bug in the resolveItem logic
        // in an esoteric complicated case (factoringOldAlgorithm.cy.js, factor x^2-1).
        // We could chase down this bug, but a better long term
        // solution is to completely remove resolve blockers.
        await this.coreFunctions.performUpdate({
          updateInstructions,
          actionId,
          sourceInformation,
          skipRendererUpdate: false,
          event,
        });

        return await this.coreFunctions.triggerChainedActions({
          componentName: this.componentName,
          actionId,
          sourceInformation,
          skipRendererUpdate,
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


function calculateMathExpressionFromLatex({ latex, unionFromU, functionSymbols, splitSymbols, parseScientificNotation, removeStrings }) {

  let expression;

  if (removeStrings) {
    for (let s of removeStrings) {
      if (["$", "%"].includes(s)) {
        s = "\\" + s;
      }
      latex = latex.replaceAll(s, '');
    }
  }

  latex = normalizeLatexString(latex, {
    unionFromU,
  });

  let fromLatex = getFromLatex({
    functionSymbols,
    splitSymbols,
    parseScientificNotation,
  });

  try {
    expression = fromLatex(latex);
  } catch (e) {
    // TODO: error on bad latex
    expression = me.fromAst('\uFF3F');
  }
  return expression;
};