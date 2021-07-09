import Function, { returnSymbolicFunctionFromFormula, returnNumericalFunctionFromFormula } from '../Function';
import me from 'math-expressions';

export default class FunctionOperator extends Function {
  static componentType = "_functionOperator";


  static returnSugarInstructions() {
    let sugarInstructions = [];

    sugarInstructions.push({
      childrenRegex: /s/,
      replacementFunction: ({ matchedChildren }) => ({
        success: true,
        newChildren: [{
          componentType: "math",
          children: matchedChildren
        }],
      })
    });

    return sugarInstructions;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    let exactlyOneMath = childLogic.newLeaf({
      name: "exactlyOneMath",
      componentType: 'math',
      number: 1,
    });

    let atMostOneFunctionForOperator = childLogic.newLeaf({
      name: "atMostOneFunctionForOperator",
      componentType: 'function',
      comparison: "atMost",
      number: 1,
    });

    childLogic.newOperator({
      name: "functionXorMath",
      operator: "xor",
      propositions: [exactlyOneMath, atMostOneFunctionForOperator],
      setAsBase: true
    })

    return childLogic;

  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    stateVariableDefinitions.isInterpolatedFunction = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { isInterpolatedFunction: false } })
    }

    delete stateVariableDefinitions.nPrescribedPoints;
    delete stateVariableDefinitions.prescribedPoints;
    delete stateVariableDefinitions.prescribedMinima;
    delete stateVariableDefinitions.prescribedMaxima;
    delete stateVariableDefinitions.prescribedExtrema;
    delete stateVariableDefinitions.interpolationPoints;
    delete stateVariableDefinitions.xs;


    let variablesToChangeFunctionChildLogicName = [
      "displayDigits", "displayDecimals", "displaySmallAsZero",
      "nInputs", "nOutputs",
      "symbolic", "domain",
    ];

    for (let vName of variablesToChangeFunctionChildLogicName) {
      let originalReturnDependences = stateVariableDefinitions[vName].returnDependencies;
      stateVariableDefinitions[vName].returnDependencies = function () {
        let dependencies = originalReturnDependences();
        dependencies.functionChild.childLogicName = "atMostOneFunctionForOperator";
        return dependencies;
      }
    }


    let originalVariablesReturnDependences = stateVariableDefinitions.variables.returnArrayDependenciesByKey;
    stateVariableDefinitions.variables.returnArrayDependenciesByKey = function ({ arrayKeys }) {
      let dependencies = originalVariablesReturnDependences({ arrayKeys });
      dependencies.globalDependencies.functionChild.childLogicName = "atMostOneFunctionForOperator";
      for (let arrayKey of arrayKeys) {
        dependencies.dependenciesByKey[arrayKey].functionChild.childLogicName = "atMostOneFunctionForOperator";
      }
      return dependencies;
    }

    stateVariableDefinitions.operatorBasedOnFormulaIfAvailable = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { operatorBasedOnFormulaIfAvailable: false } })
    }

    stateVariableDefinitions.formula.returnDependencies = () => ({})
    stateVariableDefinitions.formula.definition = () => ({
      newValues: { formula: me.fromAst('\uff3f') }
    })

    stateVariableDefinitions.operatorComposesWithOriginal = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { operatorComposesWithOriginal: true } })
    }

    // TODO: extend symbolicFunctionOperator and numericalFunctionOperator
    // to be multi-dimensional
    // For now, the same function is used for each component
    // if the function is to be vector-valued
    stateVariableDefinitions.symbolicFunctionOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { symbolicFunctionOperator: x => me.fromAst('\uff3f') } })
    }

    stateVariableDefinitions.numericalFunctionOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { numericalFunctionOperator: x => NaN } })
    }

    stateVariableDefinitions.formulaOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { formulaOperator: x => me.fromAst('\uff3f') } })
    }

    stateVariableDefinitions.returnNumericalDerivatives = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { returnNumericalDerivatives: null } })
    }

    stateVariableDefinitions.formula = {
      public: true,
      componentType: "formula",
      additionalStateVariablesDefined: ["operatorBasedOnFormula"],
      // stateVariablesDeterminingDependencies: ["operatorBasedOnFormulaIfAvailable"],
      returnDependencies: () => ({
        operatorBasedOnFormulaIfAvailable: {
          dependencyType: "stateVariable",
          variableName: "operatorBasedOnFormulaIfAvailable"
        },
        functionChild: {
          dependencyType: "child",
          childLogicName: "atMostOneFunctionForOperator",
          variableNames: ["formula"],
        },
        mathChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneMath",
          variableNames: ["value"],
        },
        formulaOperator: {
          dependencyType: "stateVariable",
          variableName: "formulaOperator"
        }
      }),
      definition: function ({ dependencyValues }) {

        if (!dependencyValues.operatorBasedOnFormulaIfAvailable
          || (
            (dependencyValues.functionChild.length === 0
              || dependencyValues.functionChild[0].stateValues.formula.tree === "\uff3f")
            && (dependencyValues.mathChild.length === 0
              || dependencyValues.mathChild[0].stateValues.value.tree === "\uff3f")
          )
        ) {
          return {
            newValues: {
              formula: me.fromAst("\uff3f"),
              operatorBasedOnFormula: false
            }
          }
        }

        let formulaPreOperator;

        if (dependencyValues.functionChild.length === 0) {
          formulaPreOperator = dependencyValues.mathChild[0].stateValues.value;
        } else {
          formulaPreOperator = dependencyValues.functionChild[0].stateValues.formula;
        }
        return {
          newValues: {
            formula: dependencyValues.formulaOperator(formulaPreOperator),
            operatorBasedOnFormula: true,
          }
        }
      }

    }

    stateVariableDefinitions.symbolicfs = {
      isArray: true,
      entryPrefixes: ["symbolicf"],
      returnArraySizeDependencies: () => ({
        nOutputs: {
          dependencyType: "stateVariable",
          variableName: "nOutputs"
        }
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nOutputs];
      },
      returnArrayDependenciesByKey: () => ({
        globalDependencies: {
          operatorBasedOnFormula: {
            dependencyType: "stateVariable",
            variableName: "operatorBasedOnFormula"
          },
          formula: {
            dependencyType: "stateVariable",
            variableName: "formula"
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
            childLogicName: "atMostOneFunctionForOperator",
            variableNames: ["symbolicfs"]
          },
          mathChild: {
            dependencyType: "child",
            childLogicName: "exactlyOneMath",
            variableNames: ["value"],
          },
          symbolicFunctionOperator: {
            dependencyType: "stateVariable",
            variableName: "symbolicFunctionOperator"
          },
          operatorComposesWithOriginal: {
            dependencyType: "stateVariable",
            variableName: "operatorComposesWithOriginal"
          },
          domain: {
            dependencyType: "stateVariable",
            variableName: "domain"
          }
        }
      }),
      arrayDefinitionByKey: function ({ globalDependencyValues, usedDefault, arrayKeys, arraySize }) {

        if (globalDependencyValues.operatorBasedOnFormula) {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            symbolicfs[arrayKey] = returnSymbolicFunctionFromFormula(globalDependencyValues, arrayKey)
            return {
              newValues: { symbolicfs }
            }
          }
        } else if (globalDependencyValues.operatorComposesWithOriginal) {

          if (globalDependencyValues.functionChild.length === 0) {
            if (globalDependencyValues.mathChild.length === 0) {
              let symbolicfs = {};
              for (let arrayKey of arrayKeys) {
                symbolicfs[arrayKey] = x => me.fromAst('\uff3f')
              }
              return {
                newValues: { symbolicfs }
              }
            } else {

              // TODO: is this case with a math child used anywhere?
              let dependencyValuesWithChildFormula = Object.assign({}, globalDependencyValues);
              dependencyValuesWithChildFormula.formula = globalDependencyValues.mathChild[0].stateValues.value;

              let childFs = [];

              for (let ind = 0; ind < arraySize[0]; ind++) {
                childFs.push(returnSymbolicFunctionFromFormula(dependencyValuesWithChildFormula, ind))
              }
              let symbolicfs = {};
              for (let arrayKey of arrayKeys) {
                symbolicfs[arrayKey] = (...xs) => globalDependencyValues.symbolicFunctionOperator(
                  ...childFs.map(cf => cf(...xs))
                )
              }

              return {
                newValues: { symbolicfs }
              }

            }
          } else {
            let childFs = [];
            for (let ind = 0; ind < arraySize[0]; ind++) {
              childFs.push(globalDependencyValues.functionChild[0].stateValues.symbolicfs[ind]);
            }
            let symbolicfs = {};
            for (let arrayKey of arrayKeys) {
              symbolicfs[arrayKey] = (...xs) => globalDependencyValues.symbolicFunctionOperator(
                ...childFs.map(cf => cf(...xs))
              )
            }

            return {
              newValues: { symbolicfs }
            }

          }
        } else {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            symbolicfs[arrayKey] = (...xs) => globalDependencyValues.symbolicFunctionOperator(...xs)
          }

          return {
            newValues: { symbolicfs }
          }

        }
      }
    }

    stateVariableDefinitions.numericalfs = {
      isArray: true,
      entryPrefixes: ["numericalf"],
      returnArraySizeDependencies: () => ({
        nOutputs: {
          dependencyType: "stateVariable",
          variableName: "nOutputs"
        }
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nOutputs];
      },
      returnArrayDependenciesByKey: () => ({
        globalDependencies: {
          operatorBasedOnFormula: {
            dependencyType: "stateVariable",
            variableName: "operatorBasedOnFormula"
          },
          formula: {
            dependencyType: "stateVariable",
            variableName: "formula"
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
            childLogicName: "atMostOneFunctionForOperator",
            variableNames: ["numericalfs"]
          },
          mathChild: {
            dependencyType: "child",
            childLogicName: "exactlyOneMath",
            variableNames: ["value"],
          },
          numericalFunctionOperator: {
            dependencyType: "stateVariable",
            variableName: "numericalFunctionOperator"
          },
          operatorComposesWithOriginal: {
            dependencyType: "stateVariable",
            variableName: "operatorComposesWithOriginal"
          },
          domain: {
            dependencyType: "stateVariable",
            variableName: "domain"
          }
        }
      }),
      arrayDefinitionByKey: function ({ globalDependencyValues, usedDefault, arrayKeys, arraySize }) {

        if (globalDependencyValues.operatorBasedOnFormula) {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            numericalfs[arrayKey] = returnNumericalFunctionFromFormula(globalDependencyValues, arrayKey)
            return {
              newValues: { numericalfs }
            }
          }
        } else if (globalDependencyValues.operatorComposesWithOriginal) {

          if (globalDependencyValues.functionChild.length === 0) {
            if (globalDependencyValues.mathChild.length === 0) {
              let numericalfs = {};
              for (let arrayKey of arrayKeys) {
                numericalfs[arrayKey] = x => NaN
              }
              return {
                newValues: { numericalfs }
              }
            } else {

              // TODO: is this case with a math child used anywhere?
              let dependencyValuesWithChildFormula = Object.assign({}, globalDependencyValues);
              dependencyValuesWithChildFormula.formula = globalDependencyValues.mathChild[0].stateValues.value;

              let childFs = [];

              for (let ind = 0; ind < arraySize[0]; ind++) {
                childFs.push(returnNumericalFunctionFromFormula(dependencyValuesWithChildFormula, ind))
              }
              let numericalfs = {};
              for (let arrayKey of arrayKeys) {
                numericalfs[arrayKey] = (...xs) => globalDependencyValues.numericalFunctionOperator(
                  ...childFs.map(cf => cf(...xs))
                )
              }

              return {
                newValues: { numericalfs }
              }

            }
          } else {

            let childFs = [];
            for (let ind = 0; ind < arraySize[0]; ind++) {
              childFs.push(globalDependencyValues.functionChild[0].stateValues.numericalfs[ind]);
            }
            let numericalfs = {};
            for (let arrayKey of arrayKeys) {
              numericalfs[arrayKey] = (...xs) => globalDependencyValues.numericalFunctionOperator(
                ...childFs.map(cf => cf(...xs))
              )
            }

            return {
              newValues: { numericalfs }
            }

          }

        } else {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            numericalfs[arrayKey] = (...xs) => globalDependencyValues.numericalFunctionOperator(...xs)
          }

          return {
            newValues: { numericalfs }
          }

        }

      }
    }


    // remove function child dependency from minima
    stateVariableDefinitions.allMinima.returnDependencies = () => ({
      numericalf: {
        dependencyType: "stateVariable",
        variableName: "numericalf",
      },
      xscale: {
        dependencyType: "stateVariable",
        variableName: "xscale"
      },
      nInputs: {
        dependencyType: "stateVariable",
        variableName: "nInputs"
      },
      nOutputs: {
        dependencyType: "stateVariable",
        variableName: "nOutputs"
      },
      domain: {
        dependencyType: "stateVariable",
        variableName: "domain"
      },
    })


    // remove function child dependency from maxima
    stateVariableDefinitions.allMaxima.returnDependencies = () => ({
      numericalf: {
        dependencyType: "stateVariable",
        variableName: "numericalf",
      },
      xscale: {
        dependencyType: "stateVariable",
        variableName: "xscale"
      },
      nInputs: {
        dependencyType: "stateVariable",
        variableName: "nInputs"
      },
      nOutputs: {
        dependencyType: "stateVariable",
        variableName: "nOutputs"
      },
      domain: {
        dependencyType: "stateVariable",
        variableName: "domain"
      },
    })

    return stateVariableDefinitions;

  }


}
