import MathComponent from './Math';
import me from 'math-expressions';

export default class Evaluate extends MathComponent {
  static componentType = "evaluate";
  static rendererType = "math";

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

    stateVariableDefinitions.unnormalizedValue = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
      },
      returnDependencies() {
        return {
          inputAttr: {
            dependencyType: "attributeComponent",
            attributeName: "input",
            variableNames: ["nComponents", "maths"]
          },
          functionAttr: {
            dependencyType: "attributeComponent",
            attributeName: "function",
            variableNames: ["symbolicfs", "numericalfs", "symbolic", "nInputs", "nOutputs"],
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

        if (!(dependencyValues.functionAttr && dependencyValues.inputAttr)) {
          return {
            setValue: {
              unnormalizedValue: me.fromAst('\uFF3F')
            }
          }
        }

        let input = dependencyValues.inputAttr.stateValues.maths;

        // if have a single input, check if it is a vector
        if (input.length === 1) {
          let inputTree = input[0].tree;
          if (Array.isArray(inputTree) && ["vector", "altvector", "tuple"].includes(inputTree[0])) {
            input = inputTree.slice(1).map(x => me.fromAst(x));
          }
        }


        if (input.length !== dependencyValues.functionAttr.stateValues.nInputs) {
          return {
            setValue: {
              unnormalizedValue: me.fromAst('\uFF3F')
            }
          }
        }

        let components = [];

        let functionComp = dependencyValues.functionAttr;
        let nOutputs = functionComp.stateValues.nOutputs;

        if (!dependencyValues.forceNumeric &&
          (functionComp.stateValues.symbolic || dependencyValues.forceSymbolic)
        ) {
          for (let ind = 0; ind < nOutputs; ind++) {
            components.push(functionComp.stateValues.symbolicfs[ind](...input).tree)
          }
        } else {
          let numericInput = input.map(x => x.evaluate_to_constant())
            .map(x => x === null ? NaN : x);

          for (let ind = 0; ind < nOutputs; ind++) {
            components.push(functionComp.stateValues.numericalfs[ind](...numericInput))
          }
        }

        let unnormalizedValue;

        if (nOutputs === 1) {
          unnormalizedValue = me.fromAst(components[0])
        } else {
          unnormalizedValue = me.fromAst(["vector", ...components])
        }

        // console.log("unnormalizedValue")
        // console.log(unnormalizedValue)

        return {
          setValue: { unnormalizedValue }
        }

      }
    }

    return stateVariableDefinitions;

  }

}