import Function from "../Function";
import me from "math-expressions";
import {
  returnNumericalFunctionFromFormula,
  returnSymbolicFunctionFromFormula,
} from "../../utils/function";

export default class FunctionOperator extends Function {
  static componentType = "_functionOperator";

  static returnSugarInstructions() {
    let sugarInstructions = [];

    let wrapStringsAndMacros = function ({
      matchedChildren,
      componentInfoObjects,
    }) {
      let componentIsLabel = (x) =>
        componentInfoObjects.componentIsSpecifiedType(x, "label");

      // only apply if all children are strings, macros, or labels
      if (
        matchedChildren.length === 0 ||
        !matchedChildren.every(
          (child) =>
            typeof child === "string" ||
            child.doenetAttributes?.createdFromMacro ||
            componentIsLabel(child),
        )
      ) {
        return { success: false };
      }

      // wrap first group of non-label children in <math>

      let childIsLabel = matchedChildren.map(componentIsLabel);

      let childrenToWrap = [],
        childrenToNotWrapBegin = [],
        childrenToNotWrapEnd = [];

      if (childIsLabel.filter((x) => x).length === 0) {
        childrenToWrap = matchedChildren;
      } else {
        if (childIsLabel[0]) {
          // started with label, find first non-label child
          let firstNonLabelInd = childIsLabel.indexOf(false);
          if (firstNonLabelInd !== -1) {
            childrenToNotWrapBegin = matchedChildren.slice(0, firstNonLabelInd);
            matchedChildren = matchedChildren.slice(firstNonLabelInd);
            childIsLabel = childIsLabel.slice(firstNonLabelInd);
          }
        }

        // now we don't have label at the beginning
        // find first label ind
        let firstLabelInd = childIsLabel.indexOf(true);
        if (firstLabelInd === -1) {
          childrenToWrap = matchedChildren;
        } else {
          childrenToWrap = matchedChildren.slice(0, firstLabelInd);
          childrenToNotWrapEnd = matchedChildren.slice(firstLabelInd);
        }
      }

      if (childrenToWrap.length === 0) {
        return { success: false };
      }

      // don't apply to a single macro
      if (
        childrenToWrap.length === 1 &&
        typeof childrenToWrap[0] !== "string"
      ) {
        return { success: false };
      }

      return {
        success: true,
        newChildren: [
          ...childrenToNotWrapBegin,
          {
            componentType: "math",
            children: childrenToWrap,
          },
          ...childrenToNotWrapEnd,
        ],
      };
    };

    sugarInstructions.push({
      replacementFunction: wrapStringsAndMacros,
    });

    return sugarInstructions;
  }

  static returnStateVariableDefinitions({ numerics }) {
    let stateVariableDefinitions = super.returnStateVariableDefinitions({
      numerics,
    });

    let componentType = this.componentType;

    stateVariableDefinitions.isInterpolatedFunction = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { isInterpolatedFunction: false } }),
    };

    delete stateVariableDefinitions.nPrescribedPoints;
    delete stateVariableDefinitions.prescribedPoints;
    delete stateVariableDefinitions.prescribedMinima;
    delete stateVariableDefinitions.prescribedMaxima;
    delete stateVariableDefinitions.prescribedExtrema;
    delete stateVariableDefinitions.interpolationPoints;
    delete stateVariableDefinitions.xs;

    stateVariableDefinitions.operatorBasedOnFormulaIfAvailable = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: { operatorBasedOnFormulaIfAvailable: false },
      }),
    };

    stateVariableDefinitions.formula.returnDependencies = () => ({});
    stateVariableDefinitions.formula.definition = () => ({
      setValue: { formula: me.fromAst("\uff3f") },
    });

    stateVariableDefinitions.operatorComposesWithOriginal = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { operatorComposesWithOriginal: true } }),
    };

    // TODO: extend symbolicFunctionOperator and numericalFunctionOperator
    // to be multi-dimensional
    // For now, the same function is used for each component
    // if the function is to be vector-valued
    stateVariableDefinitions.symbolicFunctionOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: { symbolicFunctionOperator: (x) => me.fromAst("\uff3f") },
      }),
    };

    stateVariableDefinitions.numericalFunctionOperator = {
      additionalStateVariablesDefined: ["numericalFunctionOperatorArguments"],
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: {
          numericalFunctionOperator: (x) => NaN,
          numericalFunctionOperatorArguments: [],
        },
      }),
    };

    stateVariableDefinitions.formulaOperator = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: { formulaOperator: (x) => me.fromAst("\uff3f") },
      }),
    };

    stateVariableDefinitions.returnNumericalDerivatives = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { returnNumericalDerivatives: null } }),
    };

    stateVariableDefinitions.formula = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
      },
      additionalStateVariablesDefined: ["operatorBasedOnFormula"],
      // stateVariablesDeterminingDependencies: ["operatorBasedOnFormulaIfAvailable"],
      returnDependencies: () => ({
        operatorBasedOnFormulaIfAvailable: {
          dependencyType: "stateVariable",
          variableName: "operatorBasedOnFormulaIfAvailable",
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["formula"],
        },
        mathChild: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value"],
        },
        formulaOperator: {
          dependencyType: "stateVariable",
          variableName: "formulaOperator",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (
          !dependencyValues.operatorBasedOnFormulaIfAvailable ||
          ((dependencyValues.functionChild.length === 0 ||
            dependencyValues.functionChild[0].stateValues.formula.tree ===
              "\uff3f") &&
            (dependencyValues.mathChild.length === 0 ||
              dependencyValues.mathChild[0].stateValues.value.tree ===
                "\uff3f"))
        ) {
          return {
            setValue: {
              formula: me.fromAst("\uff3f"),
              operatorBasedOnFormula: false,
            },
          };
        }

        let formulaPreOperator;

        if (dependencyValues.functionChild.length === 0) {
          formulaPreOperator = dependencyValues.mathChild[0].stateValues.value;
        } else {
          formulaPreOperator =
            dependencyValues.functionChild[0].stateValues.formula;
        }
        return {
          setValue: {
            formula: dependencyValues.formulaOperator(formulaPreOperator),
            operatorBasedOnFormula: true,
          },
        };
      },
    };

    stateVariableDefinitions.symbolicfs = {
      isArray: true,
      entryPrefixes: ["symbolicf"],
      returnArraySizeDependencies: () => ({
        nOutputs: {
          dependencyType: "stateVariable",
          variableName: "nOutputs",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nOutputs];
      },
      returnArrayDependenciesByKey: () => ({
        globalDependencies: {
          operatorBasedOnFormula: {
            dependencyType: "stateVariable",
            variableName: "operatorBasedOnFormula",
          },
          formula: {
            dependencyType: "stateVariable",
            variableName: "formula",
          },
          variables: {
            dependencyType: "stateVariable",
            variableName: "variables",
          },
          nInputs: {
            dependencyType: "stateVariable",
            variableName: "nInputs",
          },
          simplify: {
            dependencyType: "stateVariable",
            variableName: "simplify",
          },
          expand: {
            dependencyType: "stateVariable",
            variableName: "expand",
          },
          functionChild: {
            dependencyType: "child",
            childGroups: ["functions"],
            variableNames: ["symbolicfs"],
          },
          mathChild: {
            dependencyType: "child",
            childGroups: ["maths"],
            variableNames: ["value"],
          },
          symbolicFunctionOperator: {
            dependencyType: "stateVariable",
            variableName: "symbolicFunctionOperator",
          },
          operatorComposesWithOriginal: {
            dependencyType: "stateVariable",
            variableName: "operatorComposesWithOriginal",
          },
          domain: {
            dependencyType: "stateVariable",
            variableName: "domain",
          },
        },
      }),
      arrayDefinitionByKey: function ({
        globalDependencyValues,
        usedDefault,
        arrayKeys,
        arraySize,
      }) {
        if (globalDependencyValues.operatorBasedOnFormula) {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            symbolicfs[arrayKey] = returnSymbolicFunctionFromFormula({
              formula: globalDependencyValues.formula,
              simplify: globalDependencyValues.simplify,
              expand: globalDependencyValues.expand,
              nInputs: globalDependencyValues.nInputs,
              variables: globalDependencyValues.variables,
              domain: globalDependencyValues.domain,
              component: arrayKey,
            });
            return {
              setValue: { symbolicfs },
            };
          }
        } else if (globalDependencyValues.operatorComposesWithOriginal) {
          if (globalDependencyValues.functionChild.length === 0) {
            if (globalDependencyValues.mathChild.length === 0) {
              let symbolicfs = {};
              for (let arrayKey of arrayKeys) {
                symbolicfs[arrayKey] = (x) => me.fromAst("\uff3f");
              }
              return {
                setValue: { symbolicfs },
              };
            } else {
              // TODO: is this case with a math child used anywhere?
              let dependencyValuesWithChildFormula = Object.assign(
                {},
                globalDependencyValues,
              );
              dependencyValuesWithChildFormula.formula =
                globalDependencyValues.mathChild[0].stateValues.value;

              let childFs = [];

              for (let ind = 0; ind < arraySize[0]; ind++) {
                childFs.push(
                  returnSymbolicFunctionFromFormula({
                    formula: dependencyValuesWithChildFormula.formula,
                    simplify: dependencyValuesWithChildFormula.simplify,
                    expand: dependencyValuesWithChildFormula.expand,
                    nInputs: dependencyValuesWithChildFormula.nInputs,
                    variables: dependencyValuesWithChildFormula.variables,
                    domain: globalDependencyValues.domain,
                    component: ind,
                  }),
                );
              }
              let symbolicfs = {};
              for (let arrayKey of arrayKeys) {
                symbolicfs[arrayKey] = (...xs) =>
                  globalDependencyValues.symbolicFunctionOperator(
                    ...childFs.map((cf) => cf(...xs)),
                  );
              }

              return {
                setValue: { symbolicfs },
              };
            }
          } else {
            let childFs = [];
            for (let ind = 0; ind < arraySize[0]; ind++) {
              childFs.push(
                globalDependencyValues.functionChild[0].stateValues.symbolicfs[
                  ind
                ],
              );
            }
            let symbolicfs = {};
            for (let arrayKey of arrayKeys) {
              symbolicfs[arrayKey] = (...xs) =>
                globalDependencyValues.symbolicFunctionOperator(
                  ...childFs.map((cf) => cf(...xs)),
                );
            }

            return {
              setValue: { symbolicfs },
            };
          }
        } else {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            symbolicfs[arrayKey] = (...xs) =>
              globalDependencyValues.symbolicFunctionOperator(...xs);
          }

          return {
            setValue: { symbolicfs },
          };
        }
      },
    };

    stateVariableDefinitions.numericalfs = {
      isArray: true,
      entryPrefixes: ["numericalf"],
      returnArraySizeDependencies: () => ({
        nOutputs: {
          dependencyType: "stateVariable",
          variableName: "nOutputs",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nOutputs];
      },
      returnArrayDependenciesByKey: () => ({
        globalDependencies: {
          operatorBasedOnFormula: {
            dependencyType: "stateVariable",
            variableName: "operatorBasedOnFormula",
          },
          formula: {
            dependencyType: "stateVariable",
            variableName: "formula",
          },
          variables: {
            dependencyType: "stateVariable",
            variableName: "variables",
          },
          nInputs: {
            dependencyType: "stateVariable",
            variableName: "nInputs",
          },
          functionChild: {
            dependencyType: "child",
            childGroups: ["functions"],
            variableNames: ["numericalfs"],
          },
          mathChild: {
            dependencyType: "child",
            childGroups: ["maths"],
            variableNames: ["value"],
          },
          numericalFunctionOperator: {
            dependencyType: "stateVariable",
            variableName: "numericalFunctionOperator",
          },
          operatorComposesWithOriginal: {
            dependencyType: "stateVariable",
            variableName: "operatorComposesWithOriginal",
          },
          domain: {
            dependencyType: "stateVariable",
            variableName: "domain",
          },
        },
      }),
      arrayDefinitionByKey: function ({
        globalDependencyValues,
        usedDefault,
        arrayKeys,
        arraySize,
      }) {
        // TODO: correctly handle nOutputs > 1

        if (globalDependencyValues.operatorBasedOnFormula) {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            numericalfs[arrayKey] = returnNumericalFunctionFromFormula({
              formula: globalDependencyValues.formula,
              nInputs: globalDependencyValues.nInputs,
              variables: globalDependencyValues.variables,
              domain: globalDependencyValues.domain,
              component: arrayKey,
            });
            return {
              setValue: { numericalfs },
            };
          }
        } else if (globalDependencyValues.operatorComposesWithOriginal) {
          if (globalDependencyValues.functionChild.length === 0) {
            if (globalDependencyValues.mathChild.length === 0) {
              let numericalfs = {};
              for (let arrayKey of arrayKeys) {
                numericalfs[arrayKey] = (x) => NaN;
              }
              return {
                setValue: { numericalfs },
              };
            } else {
              // TODO: is this case with a math child used anywhere?
              let dependencyValuesWithChildFormula = Object.assign(
                {},
                globalDependencyValues,
              );
              dependencyValuesWithChildFormula.formula =
                globalDependencyValues.mathChild[0].stateValues.value;

              let childFs = [];

              for (let ind = 0; ind < arraySize[0]; ind++) {
                childFs.push(
                  returnNumericalFunctionFromFormula({
                    formula: globalDependencyValues.formula,
                    nInputs: globalDependencyValues.nInputs,
                    variables: globalDependencyValues.variables,
                    domain: globalDependencyValues.domain,
                    component: ind,
                  }),
                );
              }
              let numericalfs = {};
              for (let arrayKey of arrayKeys) {
                numericalfs[arrayKey] = (...xs) =>
                  globalDependencyValues.numericalFunctionOperator(
                    ...childFs.map((cf) => cf(...xs)),
                  );
              }

              return {
                setValue: { numericalfs },
              };
            }
          } else {
            let childFs = [];
            for (let ind = 0; ind < arraySize[0]; ind++) {
              childFs.push(
                globalDependencyValues.functionChild[0].stateValues.numericalfs[
                  ind
                ],
              );
            }
            let numericalfs = {};
            for (let arrayKey of arrayKeys) {
              numericalfs[arrayKey] = (...xs) =>
                globalDependencyValues.numericalFunctionOperator(
                  ...childFs.map((cf) => cf(...xs)),
                );
            }

            return {
              setValue: { numericalfs },
            };
          }
        } else {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            numericalfs[arrayKey] = (...xs) =>
              globalDependencyValues.numericalFunctionOperator(...xs);
          }

          return {
            setValue: { numericalfs },
          };
        }
      },
    };

    stateVariableDefinitions.fDefinitions = {
      isArray: true,
      entryPrefixes: ["fDefinition"],
      returnArraySizeDependencies: () => ({
        nOutputs: {
          dependencyType: "stateVariable",
          variableName: "nOutputs",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nOutputs];
      },
      returnArrayDependenciesByKey: () => ({
        globalDependencies: {
          operatorBasedOnFormula: {
            dependencyType: "stateVariable",
            variableName: "operatorBasedOnFormula",
          },
          formula: {
            dependencyType: "stateVariable",
            variableName: "formula",
          },
          variables: {
            dependencyType: "stateVariable",
            variableName: "variables",
          },
          nInputs: {
            dependencyType: "stateVariable",
            variableName: "nInputs",
          },
          nOutputs: {
            dependencyType: "stateVariable",
            variableName: "nOutputs",
          },
          functionChild: {
            dependencyType: "child",
            childGroups: ["functions"],
            variableNames: ["fDefinitions"],
          },
          mathChild: {
            dependencyType: "child",
            childGroups: ["maths"],
            variableNames: ["value"],
          },
          numericalFunctionOperator: {
            dependencyType: "stateVariable",
            variableName: "numericalFunctionOperator",
          },
          numericalFunctionOperatorArguments: {
            dependencyType: "stateVariable",
            variableName: "numericalFunctionOperatorArguments",
          },
          operatorComposesWithOriginal: {
            dependencyType: "stateVariable",
            variableName: "operatorComposesWithOriginal",
          },
          domain: {
            dependencyType: "stateVariable",
            variableName: "domain",
          },
        },
      }),

      arrayDefinitionByKey: function ({
        globalDependencyValues,
        usedDefault,
        arrayKeys,
        arraySize,
      }) {
        // TODO: correctly handle nOutputs > 1

        if (globalDependencyValues.operatorBasedOnFormula) {
          let fDefinitions = {};
          for (let arrayKey of arrayKeys) {
            fDefinitions[arrayKey] = {
              functionType: "formula",
              formula: globalDependencyValues.formula.tree,
              variables: globalDependencyValues.variables.map((x) => x.tree),
              nInputs: globalDependencyValues.nInputs,
              nOutputs: globalDependencyValues.nOutputs,
              domain: globalDependencyValues.domain,
              component: arrayKey,
            };
          }
          return {
            setValue: { fDefinitions },
          };
        } else if (globalDependencyValues.operatorComposesWithOriginal) {
          if (globalDependencyValues.functionChild.length === 0) {
            if (globalDependencyValues.mathChild.length === 0) {
              let fDefinitions = {};
              for (let arrayKey of arrayKeys) {
                fDefinitions[arrayKey] = {
                  functionType: "formula",
                  formula: "\uff3f",
                  variables: globalDependencyValues.variables.map(
                    (x) => x.tree,
                  ),
                  nInputs: globalDependencyValues.nInputs,
                  nOutputs: globalDependencyValues.nOutputs,
                  domain: globalDependencyValues.domain,
                };
              }
              return {
                setValue: { fDefinitions },
              };
            } else {
              // TODO: is this case with a math child used anywhere?
              throw Error(
                "function operator with math child not implemented yet",
              );
            }
          } else {
            let fDefinitions = {};
            for (let arrayKey of arrayKeys) {
              fDefinitions[arrayKey] = {
                functionType: "functionOperator",
                componentType,
                nOutputs: globalDependencyValues.nOutputs,
                functionOperatorArguments:
                  globalDependencyValues.numericalFunctionOperatorArguments,
                operatorComposesWithOriginal: true,
                originalFDefinition:
                  globalDependencyValues.functionChild[0].stateValues
                    .fDefinitions[arrayKey],
              };
            }
            return {
              setValue: { fDefinitions },
            };
          }
        } else {
          if (globalDependencyValues.functionChild.length === 0) {
            if (globalDependencyValues.mathChild.length === 0) {
              let fDefinitions = {};
              for (let arrayKey of arrayKeys) {
                fDefinitions[arrayKey] = {
                  functionType: "formula",
                  formula: "\uff3f",
                  variables: globalDependencyValues.variables.map(
                    (x) => x.tree,
                  ),
                  nInputs: globalDependencyValues.nInputs,
                  nOutputs: globalDependencyValues.nOutputs,
                  domain: globalDependencyValues.domain,
                };
              }
              return {
                setValue: { fDefinitions },
              };
            } else {
              // TODO: is this case with a math child used anywhere?
              throw Error(
                "function operator with math child not implemented yet",
              );
            }
          } else {
            let fDefinitions = {};
            for (let arrayKey of arrayKeys) {
              fDefinitions[arrayKey] = {
                functionType: "functionOperator",
                componentType,
                nOutputs: globalDependencyValues.nOutputs,
                functionOperatorArguments:
                  globalDependencyValues.numericalFunctionOperatorArguments,
                operatorComposesWithOriginal: false,
                originalFDefinition:
                  globalDependencyValues.functionChild[0].stateValues
                    .fDefinitions[arrayKey],
              };
            }
            return {
              setValue: { fDefinitions },
            };
          }
        }
      },
    };

    // remove function child dependency from minima
    let originalAllMinimaReturnDeps =
      stateVariableDefinitions.allMinima.returnDependencies;
    stateVariableDefinitions.allMinima.returnDependencies = function (args) {
      let dependencies = originalAllMinimaReturnDeps(args);
      delete dependencies.functionChild;
      return dependencies;
    };

    // remove function child dependency from maxima
    let originalAllMaximaReturnDeps =
      stateVariableDefinitions.allMaxima.returnDependencies;
    stateVariableDefinitions.allMaxima.returnDependencies = function (args) {
      let dependencies = originalAllMaximaReturnDeps(args);
      delete dependencies.functionChild;
      return dependencies;
    };

    return stateVariableDefinitions;
  }
}
