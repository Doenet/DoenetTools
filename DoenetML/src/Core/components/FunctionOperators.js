import FunctionBaseOperator from "./abstract/FunctionBaseOperator";
import me from "math-expressions";
import { returnNVariables } from "../utils/math";
import { functionOperatorDefinitions } from "../utils/function";

export class ClampFunction extends FunctionBaseOperator {
  static componentType = "clampFunction";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.lowerValue = {
      createComponentOfType: "number",
      createStateVariable: "lowerValue",
      defaultValue: 0,
      public: true,
    };
    attributes.upperValue = {
      createComponentOfType: "number",
      createStateVariable: "upperValue",
      defaultValue: 1,
      public: true,
    };

    return attributes;
  }

  static returnStateVariableDefinitions({ numerics }) {
    let stateVariableDefinitions = super.returnStateVariableDefinitions({
      numerics,
    });

    stateVariableDefinitions.numericalFunctionOperator = {
      additionalStateVariablesDefined: ["numericalFunctionOperatorArguments"],
      returnDependencies: () => ({
        lowerValue: {
          dependencyType: "stateVariable",
          variableName: "lowerValue",
        },
        upperValue: {
          dependencyType: "stateVariable",
          variableName: "upperValue",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            numericalFunctionOperator:
              functionOperatorDefinitions.clampFunction(
                dependencyValues.lowerValue,
                dependencyValues.upperValue,
              ),
            numericalFunctionOperatorArguments: [
              dependencyValues.lowerValue,
              dependencyValues.upperValue,
            ],
          },
        };
      },
    };

    stateVariableDefinitions.symbolicFunctionOperator = {
      returnDependencies: () => ({
        numericalFunctionOperator: {
          dependencyType: "stateVariable",
          variableName: "numericalFunctionOperator",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            symbolicFunctionOperator: (x) =>
              me.fromAst(
                dependencyValues.numericalFunctionOperator(
                  x.evaluate_to_constant(),
                ),
              ),
          },
        };
      },
    };

    return stateVariableDefinitions;
  }
}

export class WrapFunctionPeriodic extends FunctionBaseOperator {
  static componentType = "wrapFunctionPeriodic";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.lowerValue = {
      createComponentOfType: "number",
      createStateVariable: "lowerValue",
      defaultValue: 0,
      public: true,
    };
    attributes.upperValue = {
      createComponentOfType: "number",
      createStateVariable: "upperValue",
      defaultValue: 1,
      public: true,
    };
    return attributes;
  }

  static returnStateVariableDefinitions({ numerics }) {
    let stateVariableDefinitions = super.returnStateVariableDefinitions({
      numerics,
    });

    stateVariableDefinitions.numericalFunctionOperator = {
      additionalStateVariablesDefined: ["numericalFunctionOperatorArguments"],
      returnDependencies: () => ({
        lowerValue: {
          dependencyType: "stateVariable",
          variableName: "lowerValue",
        },
        upperValue: {
          dependencyType: "stateVariable",
          variableName: "upperValue",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            numericalFunctionOperator:
              functionOperatorDefinitions.wrapFunctionPeriodic(
                dependencyValues.lowerValue,
                dependencyValues.upperValue,
              ),
            numericalFunctionOperatorArguments: [
              dependencyValues.lowerValue,
              dependencyValues.upperValue,
            ],
          },
        };
      },
    };

    stateVariableDefinitions.symbolicFunctionOperator = {
      returnDependencies: () => ({
        numericalFunctionOperator: {
          dependencyType: "stateVariable",
          variableName: "numericalFunctionOperator",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            symbolicFunctionOperator: (x) =>
              me.fromAst(
                dependencyValues.numericalFunctionOperator(
                  x.evaluate_to_constant(),
                ),
              ),
          },
        };
      },
    };

    return stateVariableDefinitions;
  }
}

export class Derivative extends FunctionBaseOperator {
  static componentType = "derivative";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.derivVariables = {
      createComponentOfType: "_variableNameList",
    };
    attributes.derivVariable = {
      createComponentOfType: "_variableName",
    };

    return attributes;
  }

  static returnStateVariableDefinitions({ numerics }) {
    let stateVariableDefinitions = super.returnStateVariableDefinitions({
      numerics,
    });

    stateVariableDefinitions.operatorBasedOnFormulaIfAvailable = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: { operatorBasedOnFormulaIfAvailable: true },
      }),
    };

    stateVariableDefinitions.operatorComposesWithOriginal = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { operatorComposesWithOriginal: false } }),
    };

    stateVariableDefinitions.haveFunctionChild = {
      returnDependencies: () => ({
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            haveFunctionChild: dependencyValues.functionChild.length > 0,
          },
        };
      },
    };

    stateVariableDefinitions.numInputs = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      stateVariablesDeterminingDependencies: ["haveFunctionChild"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          numInputsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "numInputs",
            variableNames: ["value"],
          },
          functionChild: {
            dependencyType: "child",
            childGroups: ["functions"],
            variableNames: ["numInputs"],
          },
          variablesAttr: {
            dependencyType: "attributeComponent",
            attributeName: "variables",
            variableNames: ["numComponents"],
            dontRecurseToShadowsIfHaveAttribute: "variable",
          },
          variableAttr: {
            dependencyType: "attributeComponent",
            attributeName: "variable",
            dontRecurseToShadowsIfHaveAttribute: "variables",
          },
        };

        if (!stateValues.haveFunctionChild) {
          dependencies.derivVariablesAttr = {
            dependencyType: "attributeComponent",
            attributeName: "derivVariables",
            variableNames: ["variables"],
            dontRecurseToShadowsIfHaveAttribute: "derivVariable",
          };
        }

        return dependencies;
      },
      definition({ dependencyValues }) {
        if (dependencyValues.numInputsAttr !== null) {
          let numInputs = dependencyValues.numInputsAttr.stateValues.value;
          if (!(numInputs >= 0)) {
            numInputs = 1;
          }
          return { setValue: { numInputs } };
        } else if (
          dependencyValues.variablesAttr !== null ||
          dependencyValues.variableAttr !== null
        ) {
          return {
            setValue: {
              numInputs: Math.max(
                1,
                dependencyValues.variablesAttr?.stateValues.numComponents || 0,
              ),
            },
          };
        } else if (dependencyValues.functionChild.length > 0) {
          return {
            setValue: {
              numInputs:
                dependencyValues.functionChild[0].stateValues.numInputs,
            },
          };
        } else if (dependencyValues.derivVariablesAttr !== null) {
          let nUniqueDerivVariables = [
            ...new Set(
              dependencyValues.derivVariablesAttr.stateValues.variables.map(
                (x) => x.subscripts_to_strings().tree,
              ),
            ),
          ].length;

          return { setValue: { numInputs: nUniqueDerivVariables } };
        } else {
          return { setValue: { numInputs: 1 } };
        }
      },
    };

    stateVariableDefinitions.variables = {
      isArray: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "_variableName",
      },
      entryPrefixes: ["variable"],
      returnArraySizeDependencies: () => ({
        numInputs: {
          dependencyType: "stateVariable",
          variableName: "numInputs",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numInputs];
      },
      stateVariablesDeterminingDependencies: ["haveFunctionChild"],
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let globalDependencies = {
          variablesAttr: {
            dependencyType: "attributeComponent",
            attributeName: "variables",
            variableNames: ["variables"],
            dontRecurseToShadowsIfHaveAttribute: "variable",
          },
          variableAttr: {
            dependencyType: "attributeComponent",
            attributeName: "variable",
            variableNames: ["value"],
            dontRecurseToShadowsIfHaveAttribute: "variables",
          },
          parentVariableForChild: {
            dependencyType: "parentStateVariable",
            variableName: "variableForChild",
          },
          isInterpolatedFunction: {
            dependencyType: "stateVariable",
            variableName: "isInterpolatedFunction",
          },
          haveFunctionChild: {
            dependencyType: "stateVariable",
            variableName: "haveFunctionChild",
          },
        };

        let dependenciesByKey = {};

        if (stateValues.haveFunctionChild) {
          for (let arrayKey of arrayKeys) {
            dependenciesByKey[arrayKey] = {
              functionChild: {
                dependencyType: "child",
                childGroups: ["functions"],
                variableNames: ["variable" + (Number(arrayKey) + 1)],
              },
            };
          }
        } else {
          globalDependencies.derivVariablesAttr = {
            dependencyType: "attributeComponent",
            attributeName: "derivVariables",
            variableNames: ["variables"],
            dontRecurseToShadowsIfHaveAttribute: "derivVariable",
          };
          globalDependencies.derivVariableAttr = {
            dependencyType: "attributeComponent",
            attributeName: "derivVariable",
            variableNames: ["value"],
            dontRecurseToShadowsIfHaveAttribute: "derivVariables",
          };
        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arraySize,
        arrayKeys,
        usedDefault,
      }) {
        if (
          globalDependencyValues.variablesAttr !== null ||
          globalDependencyValues.variableAttr !== null
        ) {
          let variablesSpecified =
            globalDependencyValues.variablesAttr?.stateValues.variables;
          if (!variablesSpecified) {
            variablesSpecified = [
              globalDependencyValues.variableAttr.stateValues.value,
            ];
          }
          return {
            setValue: {
              variables: returnNVariables(arraySize[0], variablesSpecified),
            },
          };
        } else if (globalDependencyValues.haveFunctionChild) {
          let variables = {};
          for (let arrayKey of arrayKeys) {
            variables[arrayKey] =
              dependencyValuesByKey[arrayKey].functionChild[0].stateValues[
                "variable" + (Number(arrayKey) + 1)
              ];
          }
          return { setValue: { variables } };
        } else if (
          globalDependencyValues.derivVariablesAttr !== null ||
          globalDependencyValues.derivVariableAttr !== null
        ) {
          let variablesSpecified = [];
          let variablesSpecifiedTrans = [];

          let variablesFromAttribute =
            globalDependencyValues.derivVariablesAttr?.stateValues.variables;
          if (!variablesFromAttribute) {
            variablesFromAttribute = [
              globalDependencyValues.derivVariableAttr.stateValues.value,
            ];
          }

          for (let variable of variablesFromAttribute) {
            let variableTrans = variable.subscripts_to_strings().tree;

            if (!variablesSpecifiedTrans.includes(variableTrans)) {
              variablesSpecified.push(variable);
              variablesSpecifiedTrans.push(variableTrans);
            }
          }

          return {
            setValue: {
              variables: returnNVariables(arraySize[0], variablesSpecified),
            },
          };
        } else if (
          globalDependencyValues.parentVariableForChild &&
          !usedDefault.parentVariableForChild
        ) {
          return {
            setValue: {
              variables: Array(arraySize[0]).fill(
                globalDependencyValues.parentVariableForChild,
              ),
            },
          };
        } else {
          return {
            setValue: {
              variables: returnNVariables(arraySize[0], []),
            },
          };
        }
      },
    };

    stateVariableDefinitions.numDerivatives = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies() {
        let dependencies = {
          derivVariablesAttr: {
            dependencyType: "attributeComponent",
            attributeName: "derivVariables",
            variableNames: ["numComponents"],
            dontRecurseToShadowsIfHaveAttribute: "derivVariable",
          },
        };

        return dependencies;
      },
      definition({ dependencyValues }) {
        if (dependencyValues.derivVariablesAttr !== null) {
          return {
            setValue: {
              numDerivatives:
                dependencyValues.derivVariablesAttr.stateValues.numComponents,
            },
          };
        } else {
          return { setValue: { numDerivatives: 1 } };
        }
      },
    };

    stateVariableDefinitions.derivVariables = {
      isArray: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "_variableName",
      },
      entryPrefixes: ["derivVariable"],
      returnArraySizeDependencies: () => ({
        numDerivatives: {
          dependencyType: "stateVariable",
          variableName: "numDerivatives",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numDerivatives];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          derivVariablesAttr: {
            dependencyType: "attributeComponent",
            attributeName: "derivVariables",
            variableNames: ["variables"],
            dontRecurseToShadowsIfHaveAttribute: "derivVariable",
          },
          derivVariableAttr: {
            dependencyType: "attributeComponent",
            attributeName: "derivVariable",
            variableNames: ["value"],
            dontRecurseToShadowsIfHaveAttribute: "derivVariables",
          },
          variable1: {
            dependencyType: "stateVariable",
            variableName: "variable1",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        if (globalDependencyValues.derivVariablesAttr !== null) {
          return {
            setValue: {
              derivVariables:
                globalDependencyValues.derivVariablesAttr.stateValues.variables,
            },
          };
        } else if (globalDependencyValues.derivVariableAttr !== null) {
          return {
            setValue: {
              derivVariables: [
                globalDependencyValues.derivVariableAttr.stateValues.value,
              ],
            },
          };
        } else {
          return {
            setValue: {
              derivVariables: { 0: globalDependencyValues.variable1 },
            },
          };
        }
      },
    };

    stateVariableDefinitions.formulaOperator = {
      returnDependencies: () => ({
        derivVariables: {
          dependencyType: "stateVariable",
          variableName: "derivVariables",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            formulaOperator: function (formula) {
              let value = formula.subscripts_to_strings();
              for (let variable of dependencyValues.derivVariables) {
                value = value.derivative(variable.subscripts_to_strings().tree);
              }
              return value.strings_to_subscripts();
            },
          },
        };
      },
    };

    stateVariableDefinitions.numericalFunctionOperator = {
      returnDependencies: () => ({
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["returnNumericalDerivatives"],
          variablesOptional: true,
        },
        derivVariables: {
          dependencyType: "stateVariable",
          variableName: "derivVariables",
        },
      }),
      additionalStateVariablesDefined: ["returnNumericalDerivatives"],
      definition: function ({ dependencyValues }) {
        if (
          dependencyValues.functionChild.length === 0 ||
          !dependencyValues.functionChild[0].stateValues
            .returnNumericalDerivatives
        ) {
          return {
            setValue: {
              numericalFunctionOperator: (x) => NaN,
              returnNumericalDerivatives: null,
            },
          };
        }

        let derivativeNumericalFunctionOperator =
          dependencyValues.functionChild[0].stateValues.returnNumericalDerivatives(
            dependencyValues.derivVariables,
          );

        let augmentedReturnNumericalDerivatives = function (derivVariables) {
          let allDerivVariables = [
            ...dependencyValues.derivVariables,
            ...derivVariables,
          ];
          return dependencyValues.functionChild[0].stateValues.returnNumericalDerivatives(
            allDerivVariables,
          );
        };

        return {
          setValue: {
            numericalFunctionOperator: derivativeNumericalFunctionOperator,
            returnNumericalDerivatives: augmentedReturnNumericalDerivatives,
          },
        };
      },
    };

    stateVariableDefinitions.numericalFunctionOperatorArguments = {
      returnDependencies: () => ({
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["numericalDerivativesDefinition"],
          variablesOptional: true,
        },
        derivVariables: {
          dependencyType: "stateVariable",
          variableName: "derivVariables",
        },
      }),
      additionalStateVariablesDefined: ["numericalDerivativesDefinition"],
      definition: function ({ dependencyValues }) {
        if (
          dependencyValues.functionChild.length === 0 ||
          !dependencyValues.functionChild[0].stateValues
            .numericalDerivativesDefinition
        ) {
          return {
            setValue: {
              numericalFunctionOperatorArguments: [],
              numericalDerivativesDefinition: {},
            },
          };
        }

        let derivDefinition =
          dependencyValues.functionChild[0].stateValues
            .numericalDerivativesDefinition;
        let augmentedDerivDefinition = { ...derivDefinition };
        if (augmentedDerivDefinition.additionalDerivVariables) {
          augmentedDerivDefinition.additionalDerivVariables = [
            ...dependencyValues.derivVariables,
            ...augmentedDerivDefinition.additionalDerivVariables,
          ];
        } else {
          augmentedDerivDefinition.additionalDerivVariables = [
            ...dependencyValues.derivVariables,
          ];
        }

        return {
          setValue: {
            numericalFunctionOperatorArguments: [
              derivDefinition,
              dependencyValues.derivVariables,
            ],
            numericalDerivativesDefinition: augmentedDerivDefinition,
          },
        };
      },
    };

    stateVariableDefinitions.symbolicFunctionOperator = {
      returnDependencies: () => ({
        numericalFunctionOperator: {
          dependencyType: "stateVariable",
          variableName: "numericalFunctionOperator",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            symbolicFunctionOperator: (x) =>
              me.fromAst(
                dependencyValues.numericalFunctionOperator(
                  x.evaluate_to_constant(),
                ),
              ),
          },
        };
      },
    };

    return stateVariableDefinitions;
  }
}
