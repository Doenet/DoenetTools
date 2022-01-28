import MathComponent from './Math';
import me from 'math-expressions';

export default class Evaluate extends MathComponent {
  static componentType = "evaluate";
  static rendererType = "math";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
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

    attributes.displayDigits = {
      createComponentOfType: "integer",
    };
    attributes.displayDecimals = {
      createComponentOfType: "integer",
    };
    attributes.displaySmallAsZero = {
      createComponentOfType: "number",
      valueForTrue: 1E-14,
      valueForFalse: 0,
    };

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
      componentType: "integer",
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
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.displayDigitsAttr !== null) {
          return {
            setValue: {
              displayDigits: dependencyValues.displayDigitsAttr.stateValues.value
            }
          }
        } else if (dependencyValues.functionAttr && !usedDefault.functionAttr) {
          return {
            setValue: {
              displayDigits: dependencyValues.functionAttr.stateValues.displayDigits
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
      componentType: "integer",
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
        } else if (dependencyValues.functionAttr && !usedDefault.functionAttr) {
          return {
            setValue: {
              displayDecimals: dependencyValues.functionAttr.stateValues.displayDecimals
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
      componentType: "number",
      defaultValue: 0,
      hasEssential: true,
      returnDependencies: () => ({
        displayDecimalsAttr: {
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
        if (dependencyValues.displayDecimalsAttr !== null) {
          return {
            setValue: {
              displaySmallAsZero: dependencyValues.displayDecimalsAttr.stateValues.value
            }
          }
        } else if (dependencyValues.functionAttr && !usedDefault.functionAttr) {
          return {
            setValue: {
              displaySmallAsZero: dependencyValues.functionAttr.stateValues.displaySmallAsZero
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { displaySmallAsZero: true }
          }
        }
      }
    }

    stateVariableDefinitions.unnormalizedValue = {
      public: true,
      componentType: "math",
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
          if (Array.isArray(inputTree) && ["vector", "tuple"].includes(inputTree[0])) {
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