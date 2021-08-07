import FunctionBaseOperator from './abstract/FunctionBaseOperator';
import me from 'math-expressions';
import { returnNVariables } from '../utils/math';

export class ClampFunction extends FunctionBaseOperator {
  static componentType = "clampFunction";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

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

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    stateVariableDefinitions.numericalFunctionOperator = {
      returnDependencies: () => ({
        lowerValue: {
          dependencyType: "stateVariable",
          variableName: "lowerValue"
        },
        upperValue: {
          dependencyType: "stateVariable",
          variableName: "upperValue"
        }
      }),
      definition: function ({ dependencyValues }) {

        return {
          newValues: {
            numericalFunctionOperator: function (x) {
              // if don't have a number, return NaN
              if (!Number.isFinite(x)) {
                return NaN;
              }
              return Math.max(dependencyValues.lowerValue,
                Math.min(dependencyValues.upperValue, x)
              );
            }
          }
        }

      }
    }

    stateVariableDefinitions.symbolicFunctionOperator = {
      returnDependencies: () => ({
        numericalFunctionOperator: {
          dependencyType: "stateVariable",
          variableName: "numericalFunctionOperator"
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            symbolicFunctionOperator:
              x => me.fromAst(dependencyValues.numericalFunctionOperator(x.evaluate_to_constant()))
          }
        }
      }
    }

    return stateVariableDefinitions;
  }


}

export class WrapFunctionPeriodic extends FunctionBaseOperator {
  static componentType = "wrapFunctionPeriodic";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
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

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    stateVariableDefinitions.numericalFunctionOperator = {
      returnDependencies: () => ({
        lowerValue: {
          dependencyType: "stateVariable",
          variableName: "lowerValue"
        },
        upperValue: {
          dependencyType: "stateVariable",
          variableName: "upperValue"
        }
      }),
      definition: function ({ dependencyValues }) {

        return {
          newValues: {
            numericalFunctionOperator: function (x) {
              // if don't have a number, return NaN
              if (!Number.isFinite(x)) {
                return NaN;
              }

              let lower = dependencyValues.lowerValue
              let upper = dependencyValues.upperValue;

              // if bounds are the same, clamp to that value
              if (lower === upper) {
                return lower;
              }

              // just in case lower is larger than upper, swap values
              if (lower > upper) {
                [upper, lower] = [lower, upper];
              }

              return (lower + me.math.mod(
                x - lower,
                upper - lower
              )
              )

            }
          }
        }

      }
    }

    stateVariableDefinitions.symbolicFunctionOperator = {
      returnDependencies: () => ({
        numericalFunctionOperator: {
          dependencyType: "stateVariable",
          variableName: "numericalFunctionOperator"
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            symbolicFunctionOperator:
              x => me.fromAst(dependencyValues.numericalFunctionOperator(x.evaluate_to_constant()))
          }
        }
      }
    }

    return stateVariableDefinitions;
  }

}


export class Derivative extends FunctionBaseOperator {
  static componentType = "derivative";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.derivVariables = {
      createComponentOfType: "variables"
    }

    return attributes;
  }

  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    stateVariableDefinitions.operatorBasedOnFormulaIfAvailable = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { operatorBasedOnFormulaIfAvailable: true } })
    }

    stateVariableDefinitions.operatorComposesWithOriginal = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { operatorComposesWithOriginal: false } })
    }

    stateVariableDefinitions.haveFunctionChild = {
      returnDependencies: () => ({
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"]
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            haveFunctionChild: dependencyValues.functionChild.length > 0
          }
        }
      }
    }

    // modify nInputs to use derivVariablesAttr instead of variablesAttr
    // if don't have a function child and variablesAttr isn't specified

    stateVariableDefinitions.nInputs = {
      defaultValue: 1,
      public: true,
      componentType: "integer",
      stateVariablesDeterminingDependencies: ["haveFunctionChild"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          nInputsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "nInputs",
            variableNames: ["value"]
          },
          functionChild: {
            dependencyType: "child",
            childGroups: ["functions"],
            variableNames: ["nInputs"]
          },
          variablesAttr: {
            dependencyType: "attributeComponent",
            attributeName: "variables",
            variableNames: ["nComponents"],
          },
        }


        if (!stateValues.haveFunctionChild) {
          dependencies.derivVariablesAttr = {
            dependencyType: "attributeComponent",
            attributeName: "derivVariables",
            variableNames: ["variables"],
          }
        }

        return dependencies;
      },
      definition({ dependencyValues }) {
        if (dependencyValues.functionChild.length > 0) {
          return {
            newValues: {
              nInputs: dependencyValues.functionChild[0].stateValues.nInputs
            }
          }
        } else if (dependencyValues.nInputsAttr !== null) {
          let nInputs = dependencyValues.nInputsAttr.stateValues.value;
          if (!(nInputs >= 0)) {
            nInputs = 1;
          }
          return { newValues: { nInputs } };
        } else if (dependencyValues.variablesAttr !== null) {
          return { newValues: { nInputs: dependencyValues.variablesAttr.stateValues.nComponents } }
        } else if (!dependencyValues.haveFunctionChild && dependencyValues.derivVariablesAttr !== null) {

          let nUniqueDerivVariables = [
            ... new Set(
              dependencyValues.derivVariablesAttr.stateValues.variables.map(
                x => x.subscripts_to_strings().tree
              )
            )
          ].length;

          return { newValues: { nInputs: nUniqueDerivVariables } }
        } else {
          return { useEssentialOrDefaultValue: { nInputs: { variablesToCheck: ["nInputs"] } } }
        }
      }
    }

    stateVariableDefinitions.variables = {
      isArray: true,
      public: true,
      componentType: "variable",
      entryPrefixes: ["variable"],
      returnArraySizeDependencies: () => ({
        nInputs: {
          dependencyType: "stateVariable",
          variableName: "nInputs",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nInputs];
      },
      stateVariablesDeterminingDependencies: ["haveFunctionChild"],
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let globalDependencies = {
          variablesAttr: {
            dependencyType: "attributeComponent",
            attributeName: "variables",
            variableNames: ["variables"],
          },
          parentVariableForChild: {
            dependencyType: "parentStateVariable",
            variableName: "variableForChild"
          },
          isInterpolatedFunction: {
            dependencyType: "stateVariable",
            variableName: "isInterpolatedFunction"
          },
          haveFunctionChild: {
            dependencyType: "stateVariable",
            variableName: "haveFunctionChild",
          }
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
            }
          }
        } else {

          globalDependencies.derivVariablesAttr = {
            dependencyType: "attributeComponent",
            attributeName: "derivVariables",
            variableNames: ["variables"],
          }
        }


        return { globalDependencies, dependenciesByKey }
      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arraySize, arrayKeys, usedDefault }) {
        if (globalDependencyValues.haveFunctionChild) {
          if (globalDependencyValues.variablesAttr !== null) {
            console.warn("Variable for function is ignored when it has a function child")
          }
          let variables = {};
          for (let arrayKey of arrayKeys) {
            variables[arrayKey] = dependencyValuesByKey[arrayKey].functionChild[0]
              .stateValues["variable" + (Number(arrayKey) + 1)];
          }
          return { newValues: { variables } }
        } else if (globalDependencyValues.variablesAttr !== null) {
          let variablesSpecified = globalDependencyValues.variablesAttr.stateValues.variables;
          return {
            newValues: {
              variables: returnNVariables(arraySize[0], variablesSpecified)
            }
          }
        } else if (globalDependencyValues.derivVariablesAttr !== null) {

          let variablesSpecified = [];
          let variablesSpecifiedTrans = [];

          for (let variable of globalDependencyValues.derivVariablesAttr.stateValues.variables) {
            let variableTrans = variable.subscripts_to_strings().tree;

            if (!variablesSpecifiedTrans.includes(variableTrans)) {
              variablesSpecified.push(variable);
              variablesSpecifiedTrans.push(variableTrans)
            }

          }

          return {
            newValues: {
              variables: returnNVariables(arraySize[0], variablesSpecified)
            }
          }
        } else if (globalDependencyValues.parentVariableForChild && !usedDefault.parentVariableForChild) {
          return { newValues: { variables: Array(arraySize[0]).fill(globalDependencyValues.parentVariableForChild) } }
        } else {
          return {
            newValues: {
              variables: returnNVariables(arraySize[0], [])
            }
          }
        }
      }
    }

    stateVariableDefinitions.nDerivatives = {
      public: true,
      componentType: "integer",
      returnDependencies() {
        let dependencies = {
          derivVariablesAttr: {
            dependencyType: "attributeComponent",
            attributeName: "derivVariables",
            variableNames: ["nComponents"],
          },
        }

        return dependencies;
      },
      definition({ dependencyValues }) {
        if (dependencyValues.derivVariablesAttr !== null) {
          return { newValues: { nDerivatives: dependencyValues.derivVariablesAttr.stateValues.nComponents } }
        } else {
          return { newValues: { nDerivatives: 1 } }
        }
      }
    }


    stateVariableDefinitions.derivVariables = {
      isArray: true,
      public: true,
      componentType: "variable",
      entryPrefixes: ["derivVariable"],
      returnArraySizeDependencies: () => ({
        nDerivatives: {
          dependencyType: "stateVariable",
          variableName: "nDerivatives",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nDerivatives];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          derivVariablesAttr: {
            dependencyType: "attributeComponent",
            attributeName: "derivVariables",
            variableNames: ["variables"],
          },
          variable1: {
            dependencyType: "stateVariable",
            variableName: "variable1"
          }
        };

        return { globalDependencies }
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        if (globalDependencyValues.derivVariablesAttr !== null) {
          return {
            newValues: {
              derivVariables: globalDependencyValues.derivVariablesAttr.stateValues.variables
            }
          }
        } else {
          return {
            newValues: {
              derivVariables: { 0: globalDependencyValues.variable1 }
            }
          }
        }
      }
    }


    stateVariableDefinitions.formulaOperator = {
      returnDependencies: () => ({
        derivVariables: {
          dependencyType: "stateVariable",
          variableName: "derivVariables",
        },
        variables: {
          dependencyType: "stateVariable",
          variableName: "variables",
        }
      }),
      definition({ dependencyValues }) {
        let variableList = dependencyValues.variables.map(x => x.subscripts_to_strings().tree)
        return {
          newValues: {
            formulaOperator: function (formula) {
              let value = formula.subscripts_to_strings();
              for (let variable of dependencyValues.derivVariables) {
                let varTrans = variable.subscripts_to_strings().tree;
                if (!variableList.includes(varTrans)) {
                  return me.fromAst(0);
                }
                value = value.derivative(varTrans)
              }
              return value.strings_to_subscripts();
            }
          }
        }
      }
    }

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
          variableName: "derivVariables"
        }
      }),
      additionalStateVariablesDefined: ["returnNumericalDerivatives"],
      definition: function ({ dependencyValues }) {

        if (dependencyValues.functionChild.length === 0
          || !dependencyValues.functionChild[0].stateValues.returnNumericalDerivatives
        ) {
          return {
            newValues: {
              numericalFunctionOperator: x => NaN,
              returnNumericalDerivatives: null,
            }
          }
        }


        let derivativeNumericalFunctionOperator = dependencyValues.functionChild[0].stateValues
          .returnNumericalDerivatives(dependencyValues.derivVariables);

        let augmentedReturnNumericalDerivatives = function (derivVariables) {
          let allDerivVariables = [
            ...dependencyValues.derivVariables, ...derivVariables
          ]
          return dependencyValues.functionChild[0].stateValues
            .returnNumericalDerivatives(allDerivVariables)
        }

        return {
          newValues: {
            numericalFunctionOperator: derivativeNumericalFunctionOperator,
            returnNumericalDerivatives: augmentedReturnNumericalDerivatives,
          }
        }
      }
    }

    stateVariableDefinitions.symbolicFunctionOperator = {
      returnDependencies: () => ({
        numericalFunctionOperator: {
          dependencyType: "stateVariable",
          variableName: "numericalFunctionOperator"
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            symbolicFunctionOperator:
              x => me.fromAst(dependencyValues.numericalFunctionOperator(x.evaluate_to_constant()))
          }
        }
      }
    }

    return stateVariableDefinitions;
  }


}

