import MathComponent from "./Math";
import me from "math-expressions";
import {
  returnNumericFunctionForEvaluate,
  returnSymbolicFunctionForEvaluate,
} from "../utils/function";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";

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
      createComponentOfType: "function",
    };

    attributes.input = {
      createComponentOfType: "mathList",
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
    return [];
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
      definition: () => ({ setValue: { canBeModified: false } }),
    };

    let roundingDefinitions = returnRoundingStateVariableDefinitions({
      additionalAttributeComponent: "function",
    });
    Object.assign(stateVariableDefinitions, roundingDefinitions);

    stateVariableDefinitions.inputMaths = {
      returnDependencies: () => ({
        inputAttr: {
          dependencyType: "attributeComponent",
          attributeName: "input",
          variableNames: ["maths"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.inputAttr) {
          return {
            setValue: {
              inputMaths: dependencyValues.inputAttr.stateValues.maths,
            },
          };
        } else {
          return { setValue: { inputMaths: [] } };
        }
      },
    };

    stateVariableDefinitions.unnormalizedValue = {
      returnDependencies() {
        return {
          inputMaths: {
            dependencyType: "stateVariable",
            variableName: "inputMaths",
          },
          functionAttr: {
            dependencyType: "attributeComponent",
            attributeName: "function",
            variableNames: ["symbolicfs", "numericalfs", "symbolic", "nInputs"],
          },
          forceSymbolic: {
            dependencyType: "stateVariable",
            variableName: "forceSymbolic",
          },
          forceNumeric: {
            dependencyType: "stateVariable",
            variableName: "forceNumeric",
          },
        };
      },
      definition({ dependencyValues }) {
        let functionComp = dependencyValues.functionAttr;

        if (!functionComp) {
          return {
            setValue: {
              unnormalizedValue: me.fromAst("\uFF3F"),
            },
          };
        }

        let f;
        if (
          !dependencyValues.forceNumeric &&
          (functionComp.stateValues.symbolic || dependencyValues.forceSymbolic)
        ) {
          f = returnSymbolicFunctionForEvaluate({
            nInputs: functionComp.stateValues.nInputs,
            symbolicfs: functionComp.stateValues.symbolicfs,
          });
        } else {
          f = returnNumericFunctionForEvaluate({
            nInputs: functionComp.stateValues.nInputs,
            numericalfs: functionComp.stateValues.numericalfs,
          });
        }

        let unnormalizedValue = f(dependencyValues.inputMaths);

        // console.log("unnormalizedValue")
        // console.log(unnormalizedValue)

        return {
          setValue: { unnormalizedValue },
        };
      },
    };

    stateVariableDefinitions.formula = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies() {
        return {
          inputMaths: {
            dependencyType: "stateVariable",
            variableName: "inputMaths",
          },
          functionAttr: {
            dependencyType: "attributeComponent",
            attributeName: "function",
            variableNames: ["symbolicfs", "nInputs"],
          },
        };
      },
      definition({ dependencyValues }) {
        let functionComp = dependencyValues.functionAttr;

        if (!functionComp) {
          return {
            setValue: {
              formula: me.fromAst("\uFF3F"),
            },
          };
        }

        let f = returnSymbolicFunctionForEvaluate({
          nInputs: functionComp.stateValues.nInputs,
          symbolicfs: functionComp.stateValues.symbolicfs,
        });

        let formula = f(dependencyValues.inputMaths);

        return {
          setValue: { formula },
        };
      },
    };

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
            variableName: "forceSymbolic",
          },
          forceNumeric: {
            dependencyType: "stateVariable",
            variableName: "forceNumeric",
          },
        };
      },
      definition({ dependencyValues }) {
        let functionComp = dependencyValues.functionAttr;

        if (!functionComp) {
          return {
            setValue: {
              fReevaluate: (_) => me.fromAst("\uFF3F"),
            },
          };
        }

        let fReevaluate;

        if (
          !dependencyValues.forceNumeric &&
          (functionComp.stateValues.symbolic || dependencyValues.forceSymbolic)
        ) {
          fReevaluate = returnSymbolicFunctionForEvaluate({
            nInputs: functionComp.stateValues.nInputs,
            symbolicfs: functionComp.stateValues.symbolicfs,
          });
        } else {
          fReevaluate = returnNumericFunctionForEvaluate({
            nInputs: functionComp.stateValues.nInputs,
            numericalfs: functionComp.stateValues.numericalfs,
          });
        }

        return { setValue: { fReevaluate } };
      },
    };

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
            variableName: "forceSymbolic",
          },
          forceNumeric: {
            dependencyType: "stateVariable",
            variableName: "forceNumeric",
          },
        };
      },
      definition({ dependencyValues }) {
        let functionComp = dependencyValues.functionAttr;

        if (!functionComp) {
          return {
            setValue: {
              fReevaluateDefinition: {},
            },
          };
        }

        let fReevaluateDefinition;

        if (
          !dependencyValues.forceNumeric &&
          (functionComp.stateValues.symbolic || dependencyValues.forceSymbolic)
        ) {
          // TODO: fDefinitions only used for moving a function across the webworker barrier,
          // i.e., to move it to a renderer.
          // Currently, the only renderer using functions is graph, which just does numerical functions.
          // Is there a reason to implement a "symbolicForEvaluate" functionType definition?
          fReevaluateDefinition = {
            functionType: "numericForEvaluate",
            nInputs: functionComp.stateValues.nInputs,
            fDefinitions: functionComp.stateValues.fDefinitions,
          };
        } else {
          fReevaluateDefinition = {
            functionType: "numericForEvaluate",
            nInputs: functionComp.stateValues.nInputs,
            fDefinitions: functionComp.stateValues.fDefinitions,
          };
        }

        return { setValue: { fReevaluateDefinition } };
      },
    };

    return stateVariableDefinitions;
  }
}
