import MathComponent from './Math.js';
import me from '../../_snowpack/pkg/math-expressions.js';

export default class Evaluate extends MathComponent {
  static componentType = "evaluate";
  static rendererType = "math";

  static get stateVariablesShadowedForReference() {
    return [
      ...super.stateVariablesShadowedForReference,
      "displayDigits", "displayDecimals", "displaySmallAsZero"
    ]
  };


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
    delete stateVariableDefinitions.mathChildrenByArrayComponent;
    delete stateVariableDefinitions.mathChildrenWithCanBeModified;
    delete stateVariableDefinitions.unordered;

    stateVariableDefinitions.canBeModified = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { canBeModified: false } })
    }

    stateVariableDefinitions.displayDigits = {
      public: true,
      componentType: "integer",
      defaultValue: 10,
      returnDependencies: () => ({
        displayDecimalsAttr: {
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
        if (dependencyValues.displayDecimalsAttr !== null) {
          return {
            newValues: {
              displayDigits: dependencyValues.displayDecimalsAttr.stateValues.value
            }
          }
        } else if (dependencyValues.functionAttr && !usedDefault.functionAttr) {
          return {
            newValues: {
              displayDigits: dependencyValues.functionAttr.stateValues.displayDigits
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { displayDigits: { variablesToCheck: ["displayDigits"] } }
          }
        }
      }
    }

    stateVariableDefinitions.displayDecimals = {
      public: true,
      componentType: "integer",
      defaultValue: 10,
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
            newValues: {
              displayDecimals: dependencyValues.displayDecimalsAttr.stateValues.value
            }
          }
        } else if (dependencyValues.functionAttr && !usedDefault.functionAttr) {
          return {
            newValues: {
              displayDecimals: dependencyValues.functionAttr.stateValues.displayDecimals
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { displayDecimals: { variablesToCheck: ["displayDecimals"] } }
          }
        }
      }
    }

    stateVariableDefinitions.displaySmallAsZero = {
      public: true,
      componentType: "number",
      defaultValue: 0,
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
            newValues: {
              displaySmallAsZero: dependencyValues.displayDecimalsAttr.stateValues.value
            }
          }
        } else if (dependencyValues.functionAttr && !usedDefault.functionAttr) {
          return {
            newValues: {
              displaySmallAsZero: dependencyValues.functionAttr.stateValues.displaySmallAsZero
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { displaySmallAsZero: { variablesToCheck: ["displaySmallAsZero"] } }
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
            newValues: {
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
            newValues: {
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
          newValues: { unnormalizedValue }
        }

      }
    }

    return stateVariableDefinitions;

  }

}