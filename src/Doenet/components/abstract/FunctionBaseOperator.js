import Function from '../Function';
import me from 'math-expressions';

export default class FunctionOperator extends Function {
  static componentType = "_functionoperator";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    let addFunction = function ({ activeChildrenMatched }) {
      // add <function> around variable and math
      let functionChildren = [];
      for (let child of activeChildrenMatched) {
        functionChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "function", children: functionChildren }],
      }
    }

    let atMostOneVariableForSugar = childLogic.newLeaf({
      name: "atMostOneVariableForSugar",
      componentType: 'variable',
      comparison: "atMost",
      number: 1,
    });

    let atLeastOneString = childLogic.newLeaf({
      name: "atLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
    });
    let atLeastOneMath = childLogic.newLeaf({
      name: "atLeastOneMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 1,
    });

    let stringsAndMaths = childLogic.newOperator({
      name: "stringsAndMaths",
      operator: 'or',
      propositions: [atLeastOneString, atLeastOneMath],
      requireConsecutive: true,
    });

    let variableStringsAndMaths = childLogic.newOperator({
      name: "variableStringsAndMaths",
      operator: 'and',
      propositions: [atMostOneVariableForSugar, stringsAndMaths],
      requireConsecutive: true,
      isSugar: true,
      logicToWaitOnSugar: ["exactlyOneFunction"],
      replacementFunction: addFunction,
    });

    let exactlyOneFunction = childLogic.newLeaf({
      name: "exactlyOneFunction",
      componentType: 'function',
      comparison: "exactly",
      number: 1,
    });

    let atMostOneVariable = childLogic.newLeaf({
      name: "atMostOneVariable",
      componentType: 'variable',
      comparison: "atMost",
      number: 1,
    });

    let functionAndVariable = childLogic.newOperator({
      name: "functionXorMath",
      operator: "and",
      propositions: [exactlyOneFunction, atMostOneVariable],
    })

    childLogic.newOperator({
      name: "functionXorSugar",
      operator: "xor",
      propositions: [functionAndVariable, variableStringsAndMaths],
      setAsBase: true
    })

    return childLogic;

  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

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

    stateVariableDefinitions.numericFunctionOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { numericFunctionOperator: x => NaN } })
    }

    stateVariableDefinitions.functionOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { functionOperator: x => me.fromAst('\uff3f') } })
    }

    stateVariableDefinitions.formulaOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { formulaOperator: x => me.fromAst('\uff3f') } })
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
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneFunction",
          variableNames: ["formula"],
        },
        formulaOperator: {
          dependencyType: "stateVariable",
          variableName: "formulaOperator"
        }
      }),
      definition: function ({ dependencyValues }) {

        console.log(dependencyValues)

        if (!dependencyValues.operatorBasedOnFormulaIfAvailable
          || dependencyValues.functionChild.length === 0
          || dependencyValues.functionChild[0].stateValues.formula.tree === "\uff3f"
        ) {
          return {
            newValues: {
              formula: me.fromAst("\uff3f"),
              operatorBasedOnFormula: false
            }
          }
        }

        return {
          newValues: {
            formula: dependencyValues.formulaOperator(
              dependencyValues.functionChild[0].stateValues.formula
            ),
            operatorBasedOnFormula: true,
          }
        }
      }

    }

    stateVariableDefinitions.numericalf = {
      returnDependencies: () => ({
        operatorBasedOnFormula: {
          dependencyType: "stateVariable",
          variableName: "operatorBasedOnFormula"
        },
        formula: {
          dependencyType: "stateVariable",
          variableName: "formula"
        },
        variable: {
          dependencyType: "stateVariable",
          variableName: "variable",
        },
        functionChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneFunction",
          variableNames: ["numericalf",]
        },
        numericFunctionOperator: {
          dependencyType: "stateVariable",
          variableName: "numericFunctionOperator"
        },
        operatorComposesWithOriginal: {
          dependencyType: "stateVariable",
          variableName: "operatorComposesWithOriginal"
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.functionChild.length === 0) {
          return {
            newValues: { numericalf: x => NaN }
          }
        } else if (dependencyValues.operatorBasedOnFormula) {
          let formula_f = dependencyValues.formula.f();
          let varString = dependencyValues.variable.tree;
          return {
            newValues: {
              numericalf: function (x) {
                try {
                  return formula_f({ [varString]: x });
                } catch (e) {
                  return NaN;
                }
              }
            }
          }
        } else {
          if (dependencyValues.operatorComposesWithOriginal) {
            return {
              newValues: {
                numericalf: function (x) {
                  return dependencyValues.numericFunctionOperator(
                    dependencyValues.functionChild[0].stateValues.numericalf(x)
                  )
                }
              }
            }
          } else {
            return {
              newValues: {
                numericalf: function (x) {
                  return dependencyValues.numericFunctionOperator(x)
                }
              }
            }
          }
        }

      }
    }

    stateVariableDefinitions.f = {
      returnDependencies: () => ({
        operatorBasedOnFormula: {
          dependencyType: "stateVariable",
          variableName: "operatorBasedOnFormula"
        },
        formula: {
          dependencyType: "stateVariable",
          variableName: "formula"
        },
        variable: {
          dependencyType: "stateVariable",
          variableName: "variable",
        },
        functionChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneFunction",
          variableNames: ["f",]
        },
        functionOperator: {
          dependencyType: "stateVariable",
          variableName: "functionOperator"
        },
        operatorComposesWithOriginal: {
          dependencyType: "stateVariable",
          variableName: "operatorComposesWithOriginal"
        }
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.functionChild.length === 0) {
          return {
            newValues: { f: x => me.fromAst('\uff3f') }
          }
        } else if (dependencyValues.operatorBasedOnFormula) {

          let formula = dependencyValues.formula;
          let varString = dependencyValues.variable.tree;
          return {
            newValues: {
              f: (x) => formula.substitute({ [varString]: x })
            }
          }
        } else {
          if (dependencyValues.operatorComposesWithOriginal) {
            return {
              newValues: {
                f: function (x) {
                  return dependencyValues.functionOperator(
                    dependencyValues.functionChild[0].stateValues.f(x)
                  )
                }
              }
            }
          } else {
            return {
              newValues: {
                f: function (x) {
                  return dependencyValues.functionOperator(x)
                }
              }
            }
          }
        }
      }
    }


    // make functionChild null
    // as base Function component uses it to determine if extrema
    // should depend on a function child
    stateVariableDefinitions.functionChild = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { functionChild: null } })
    }

    // remove function child dependency from minima
    stateVariableDefinitions.minima.returnDependencies = () => ({
      numericalf: {
        dependencyType: "stateVariable",
        variableName: "numericalf",
      },
      xscale: {
        dependencyType: "stateVariable",
        variableName: "xscale"
      },
    })


    // remove function child dependency from maxima
    stateVariableDefinitions.maxima.returnDependencies = () => ({
      numericalf: {
        dependencyType: "stateVariable",
        variableName: "numericalf",
      },
      xscale: {
        dependencyType: "stateVariable",
        variableName: "xscale"
      },
    })

    return stateVariableDefinitions;

  }


}
