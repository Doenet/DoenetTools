import MathComponent from './Math';
import me from 'math-expressions';
import { returnNumericFunctionForEvaluate, returnSymbolicFunctionForEvaluate } from '../utils/function';

export default class Evaluate extends MathComponent {
  static componentType = "evaluate";
  static rendererType = "math";

  // remove variableForPlainMacro so that an evaluate copied into a function via a macro
  // behaves like an evaluate (not just the value property) and can be reevaluated
  static variableForPlainMacro = undefined;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.forceSymbolic = {
      createComponentOfType: "boolean",
      createStateVariable: "forceSymbolic",
      defaultValue: false,
      public: true,
    };
    attributes.forceNumeric = {
      createComponentOfType: "boolean",
      createStateVariable: "forceNumeric",
      defaultValue: false,
      public: true,
    };

    attributes.function = {
      createComponentOfType: "function"
    }

    attributes.input = {
      createComponentOfType: "mathList",
    }

    attributes.unordered = {
      createComponentOfType: "boolean",
      createStateVariable: "unordered",
      defaultValue: false,
      public: true,
    };

    return attributes;
  }


  static returnChildGroups() {

    return []

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.codePre;
    delete stateVariableDefinitions.expressionWithCodes;
    delete stateVariableDefinitions.mathChildrenFunctionSymbols;
    delete stateVariableDefinitions.codesAdjacentToStrings;
    delete stateVariableDefinitions.mathChildrenByVectorComponent;
    delete stateVariableDefinitions.mathChildrenWithCanBeModified;
    delete stateVariableDefinitions.unordered;

    stateVariableDefinitions.canBeModified = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { canBeModified: false } })
    }

    stateVariableDefinitions.displayDigits = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      defaultValue: 10,
      hasEssential: true,
      returnDependencies: () => ({
        displayDigitsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDigits",
          variableNames: ["value"]
        },
        functionAttr: {
          dependencyType: "attributeComponent",
          attributeName: "function",
          variableNames: ["displayDigits"],
        },
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.displayDigitsAttr !== null) {

          let displayDigitsAttrUsedDefault = usedDefault.displayDigitsAttr;
          let displayDecimalsAttrUsedDefault = dependencyValues.displayDecimalsAttr === null || usedDefault.displayDecimalsAttr;

          if (!(displayDigitsAttrUsedDefault || displayDecimalsAttrUsedDefault)) {
            // if both display digits and display decimals did not use default
            // we'll regard display digits as using default if it comes from a deeper shadow
            let shadowDepthDisplayDigits = dependencyValues.displayDigitsAttr.shadowDepth;
            let shadowDepthDisplayDecimals = dependencyValues.displayDecimalsAttr.shadowDepth;

            if (shadowDepthDisplayDecimals < shadowDepthDisplayDigits) {
              displayDigitsAttrUsedDefault = true;
            }
          }

          if (displayDigitsAttrUsedDefault) {
            return {
              useEssentialOrDefaultValue: {
                displayDigits: {
                  defaultValue: dependencyValues.displayDigitsAttr.stateValues.value
                }
              }
            }
          } else {
            return {
              setValue: {
                displayDigits: dependencyValues.displayDigitsAttr.stateValues.value
              }
            }
          }
        } else if (dependencyValues.functionAttr) {

          let displayDigitsFunctionAttrUsedDefault = usedDefault.functionAttr;
          let displayDecimalsAttrUsedDefault = dependencyValues.displayDecimalsAttr === null || usedDefault.displayDecimalsAttr;

          if (!(displayDigitsFunctionAttrUsedDefault || displayDecimalsAttrUsedDefault)) {
            // if both display digits (from function) and display decimals did not use default
            // we'll regard display digits as using default if it comes 
            // from the same or deeper shadow
            let shadowDepthDisplayDigitsFunction = dependencyValues.functionAttr.shadowDepth;
            let shadowDepthDisplayDecimals = dependencyValues.displayDecimalsAttr.shadowDepth;

            if (shadowDepthDisplayDecimals <= shadowDepthDisplayDigitsFunction) {
              displayDigitsFunctionAttrUsedDefault = true;
            }
          }

          if (displayDigitsFunctionAttrUsedDefault) {
            return {
              useEssentialOrDefaultValue: {
                displayDigits: {
                  defaultValue: dependencyValues.functionAttr.stateValues.displayDigits
                }
              }
            }
          } else {
            return {
              setValue: {
                displayDigits: dependencyValues.functionAttr.stateValues.displayDigits
              }
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { displayDigits: true }
          }
        }
      }
    }

    stateVariableDefinitions.displayDecimals = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      defaultValue: 10,
      hasEssential: true,
      returnDependencies: () => ({
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        },
        functionAttr: {
          dependencyType: "attributeComponent",
          attributeName: "function",
          variableNames: ["displayDecimals"],
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.displayDecimalsAttr !== null) {
          return {
            setValue: {
              displayDecimals: dependencyValues.displayDecimalsAttr.stateValues.value
            }
          }
        } else if (dependencyValues.functionAttr) {
          if (usedDefault.functionAttr) {
            return {
              useEssentialOrDefaultValue: {
                displayDecimals: {
                  defaultValue: dependencyValues.functionAttr.stateValues.displayDecimals
                }
              }
            }
          } else {
            return {
              setValue: {
                displayDecimals: dependencyValues.functionAttr.stateValues.displayDecimals
              }
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { displayDecimals: true }
          }
        }
      }
    }

    stateVariableDefinitions.displaySmallAsZero = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      defaultValue: 0,
      hasEssential: true,
      returnDependencies: () => ({
        displaySmallAsZeroAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displaySmallAsZero",
          variableNames: ["value"]
        },
        functionAttr: {
          dependencyType: "attributeComponent",
          attributeName: "function",
          variableNames: ["displaySmallAsZero"],
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.displaySmallAsZeroAttr !== null) {
          return {
            setValue: {
              displaySmallAsZero: dependencyValues.displaySmallAsZeroAttr.stateValues.value
            }
          }
        } else if (dependencyValues.functionAttr) {
          if (usedDefault.functionAttr) {
            return {
              useEssentialOrDefaultValue: {
                displaySmallAsZero: {
                  defaultValue: dependencyValues.functionAttr.stateValues.displaySmallAsZero
                }
              }
            }
          } else {
            return {
              setValue: {
                displaySmallAsZero: dependencyValues.functionAttr.stateValues.displaySmallAsZero
              }
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { displaySmallAsZero: true }
          }
        }
      }
    }

    stateVariableDefinitions.padZeros = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      defaultValue: false,
      hasEssential: true,
      returnDependencies: () => ({
        padZerosAttr: {
          dependencyType: "attributeComponent",
          attributeName: "padZeros",
          variableNames: ["value"]
        },
        functionAttr: {
          dependencyType: "attributeComponent",
          attributeName: "function",
          variableNames: ["padZeros"],
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.padZerosAttr !== null) {
          return {
            setValue: {
              padZeros: dependencyValues.padZerosAttr.stateValues.value
            }
          }
        } else if (dependencyValues.functionAttr) {
          if (usedDefault.functionAttr) {
            return {
              useEssentialOrDefaultValue: {
                padZeros: {
                  defaultValue: dependencyValues.functionAttr.stateValues.padZeros
                }
              }
            }
          } else {
            return {
              setValue: {
                padZeros: dependencyValues.functionAttr.stateValues.padZeros
              }
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { padZeros: true }
          }
        }
      }
    }

    stateVariableDefinitions.inputMaths = {
      returnDependencies: () => ({
        inputAttr: {
          dependencyType: "attributeComponent",
          attributeName: "input",
          variableNames: ["maths"]
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.inputAttr) {
          return { setValue: { inputMaths: dependencyValues.inputAttr.stateValues.maths } }
        } else {
          return { setValue: { inputMaths: [] } }
        }
      }
    }

    stateVariableDefinitions.unnormalizedValue = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
      },
      returnDependencies() {
        return {
          inputMaths: {
            dependencyType: "stateVariable",
            variableName: "inputMaths"
          },
          functionAttr: {
            dependencyType: "attributeComponent",
            attributeName: "function",
            variableNames: ["symbolicfs", "numericalfs", "symbolic", "nInputs"],
          },
          forceSymbolic: {
            dependencyType: "stateVariable",
            variableName: "forceSymbolic"
          },
          forceNumeric: {
            dependencyType: "stateVariable",
            variableName: "forceNumeric"
          }
        }

      },
      definition({ dependencyValues }) {

        let functionComp = dependencyValues.functionAttr;

        if (!functionComp) {
          return {
            setValue: {
              unnormalizedValue: me.fromAst('\uFF3F')
            }
          }
        }

        let f;
        if (!dependencyValues.forceNumeric &&
          (functionComp.stateValues.symbolic || dependencyValues.forceSymbolic)
        ) {
          f = returnSymbolicFunctionForEvaluate({
            nInputs: functionComp.stateValues.nInputs,
            symbolicfs: functionComp.stateValues.symbolicfs,
          })
        } else {
          f = returnNumericFunctionForEvaluate({
            nInputs: functionComp.stateValues.nInputs,
            numericalfs: functionComp.stateValues.numericalfs
          })
        }

        let unnormalizedValue = f(dependencyValues.inputMaths);

        // console.log("unnormalizedValue")
        // console.log(unnormalizedValue)

        return {
          setValue: { unnormalizedValue }
        }

      }
    }

    stateVariableDefinitions.formula = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
      },
      returnDependencies() {
        return {
          inputMaths: {
            dependencyType: "stateVariable",
            variableName: "inputMaths"
          },
          functionAttr: {
            dependencyType: "attributeComponent",
            attributeName: "function",
            variableNames: ["symbolicfs", "nInputs"],
          },
        }

      },
      definition({ dependencyValues }) {

        let functionComp = dependencyValues.functionAttr;

        if (!functionComp) {
          return {
            setValue: {
              formula: me.fromAst('\uFF3F')
            }
          }
        }

        let f = returnSymbolicFunctionForEvaluate({
          nInputs: functionComp.stateValues.nInputs,
          symbolicfs: functionComp.stateValues.symbolicfs,
        })

        let formula = f(dependencyValues.inputMaths);

        return {
          setValue: { formula }
        }

      }
    }



    stateVariableDefinitions.fReevaluate = {
      returnDependencies() {
        return {
          functionAttr: {
            dependencyType: "attributeComponent",
            attributeName: "function",
            variableNames: ["symbolicfs", "numericalfs", "symbolic", "nInputs"],
          },
          forceSymbolic: {
            dependencyType: "stateVariable",
            variableName: "forceSymbolic"
          },
          forceNumeric: {
            dependencyType: "stateVariable",
            variableName: "forceNumeric"
          }
        }

      },
      definition({ dependencyValues }) {

        let functionComp = dependencyValues.functionAttr;

        if (!functionComp) {
          return {
            setValue: {
              fReevaluate: _ => me.fromAst('\uFF3F')
            }
          }
        }

        let fReevaluate;

        if (!dependencyValues.forceNumeric &&
          (functionComp.stateValues.symbolic || dependencyValues.forceSymbolic)
        ) {
          fReevaluate = returnSymbolicFunctionForEvaluate({
            nInputs: functionComp.stateValues.nInputs,
            symbolicfs: functionComp.stateValues.symbolicfs,
          })
        } else {
          fReevaluate = returnNumericFunctionForEvaluate({
            nInputs: functionComp.stateValues.nInputs,
            numericalfs: functionComp.stateValues.numericalfs
          })
        }

        return { setValue: { fReevaluate } }
      }
    }

    stateVariableDefinitions.fReevaluateDefinition = {
      returnDependencies() {
        return {
          functionAttr: {
            dependencyType: "attributeComponent",
            attributeName: "function",
            variableNames: ["fDefinitions", "symbolic", "nInputs"],
          },
          forceSymbolic: {
            dependencyType: "stateVariable",
            variableName: "forceSymbolic"
          },
          forceNumeric: {
            dependencyType: "stateVariable",
            variableName: "forceNumeric"
          }
        }

      },
      definition({ dependencyValues }) {

        let functionComp = dependencyValues.functionAttr;

        if (!functionComp) {
          return {
            setValue: {
              fReevaluateDefinition: {}
            }
          }
        }

        let fReevaluateDefinition;

        if (!dependencyValues.forceNumeric &&
          (functionComp.stateValues.symbolic || dependencyValues.forceSymbolic)
        ) {
          // TODO: fDefinitions only used for moving a function across the webworker barrier,
          // i.e., to move it to a renderer.
          // Currently, the only renderer using functions is graph, which just does numerical functions.
          // Is there a reason to implement a "symbolicForEvaluate" functionType definition?
          fReevaluateDefinition = {
            functionType: "numericForEvaluate",
            nInputs: functionComp.stateValues.nInputs,
            fDefinitions: functionComp.stateValues.fDefinitions
          }
        } else {
          fReevaluateDefinition = {
            functionType: "numericForEvaluate",
            nInputs: functionComp.stateValues.nInputs,
            fDefinitions: functionComp.stateValues.fDefinitions
          }
        }

        return { setValue: { fReevaluateDefinition } }
      }
    }

    return stateVariableDefinitions;

  }

}