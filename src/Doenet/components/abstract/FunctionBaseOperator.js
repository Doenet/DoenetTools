import Function from '../Function';
import me from 'math-expressions';

export default class FunctionOperator extends Function {
  static componentType = "_functionoperator";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    // let addFunction = function ({ activeChildrenMatched }) {
    //   // add <function> around variable and math
    //   let functionChildren = [];
    //   for (let child of activeChildrenMatched) {
    //     functionChildren.push({
    //       createdComponent: true,
    //       componentName: child.componentName
    //     });
    //   }
    //   return {
    //     success: true,
    //     newChildren: [{ componentType: "function", children: functionChildren }],
    //   }
    // }

    // let atMostOneVariableForSugar = childLogic.newLeaf({
    //   name: "atMostOneVariableForSugar",
    //   componentType: 'variable',
    //   comparison: "atMost",
    //   number: 1,
    // });

    // let atLeastOneString = childLogic.newLeaf({
    //   name: "atLeastOneString",
    //   componentType: 'string',
    //   comparison: 'atLeast',
    //   number: 1,
    // });
    // let atLeastOneMath = childLogic.newLeaf({
    //   name: "atLeastOneMath",
    //   componentType: 'math',
    //   comparison: 'atLeast',
    //   number: 1,
    // });

    // let stringsAndMaths = childLogic.newOperator({
    //   name: "stringsAndMaths",
    //   operator: 'or',
    //   propositions: [atLeastOneString, atLeastOneMath],
    //   requireConsecutive: true,
    // });

    // let variableStringsAndMaths = childLogic.newOperator({
    //   name: "variableStringsAndMaths",
    //   operator: 'and',
    //   propositions: [atMostOneVariableForSugar, stringsAndMaths],
    //   requireConsecutive: true,
    //   isSugar: true,
    //   logicToWaitOnSugar: ["atMostOneFunction"],
    //   replacementFunction: addFunction,
    // });

    let exactlyOneFormula = childLogic.newLeaf({
      name: "exactlyOneFormula",
      componentType: 'formula',
      number: 1,
    });

    let atMostOneFunction = childLogic.newLeaf({
      name: "atMostOneFunction",
      componentType: 'function',
      comparison: "atMost",
      number: 1,
    });

    let functionXorFormula = childLogic.newOperator({
      name: "functionXorFormula",
      operator: "xor",
      propositions: [exactlyOneFormula, atMostOneFunction]
    })

    let atMostOneVariable = childLogic.newLeaf({
      name: "atMostOneVariable",
      componentType: 'variable',
      comparison: "atMost",
      number: 1,
      takePropertyChildren: true,
    });

    childLogic.newOperator({
      name: "functionAndVariable",
      operator: "and",
      propositions: [functionXorFormula, atMostOneVariable],
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
          dependencyType: "child",
          childLogicName: "atMostOneFunction",
          variableNames: ["formula"],
        },
        formulaChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneFormula",
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
            && (dependencyValues.formulaChild.length === 0
              || dependencyValues.formulaChild[0].stateValues.value.tree === "\uff3f")
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
          formulaPreOperator = dependencyValues.formulaChild[0].stateValues.value;
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
          dependencyType: "child",
          childLogicName: "atMostOneFunction",
          variableNames: ["f", "symbolic"]
        },
        formulaChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneFormula",
          variableNames: ["value"],
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

        if (dependencyValues.operatorBasedOnFormula) {

          let symbolic = false;

          if (dependencyValues.functionChild.length === 0) {
            symbolc = dependencyValues.functionChild[0].stateValues.symbolic;
          }

          if (symbolic) {
            let formula = dependencyValues.formula;
            let varString = dependencyValues.variable.tree;
            return {
              newValues: {
                f: (x) => formula.substitute({ [varString]: x })
              }
            }
          } else {

            let formula_f = dependencyValues.formula.f();
            let varString = dependencyValues.variable.tree;
            return {
              newValues: {
                f: function (x) {
                  try {
                    return formula_f({ [varString]: x });
                  } catch (e) {
                    return NaN;
                  }
                }
              }
            }
          }
        } else if (dependencyValues.operatorComposesWithOriginal) {

          if (dependencyValues.functionChild.length === 0) {
            if (dependencyValues.formulaChild.length === 0) {
              return {
                newValues: { f: x => me.fromAst('\uff3f') }
              }
            } else {

              let formula_f;
              try {
                formula_f = dependencyValues.formulaChild[0].stateValues.value.f();
              } catch (e) {
                formula_f = () => NaN;
              }
              let varString = dependencyValues.variable.tree;
              return {
                newValues: {
                  f: function (x) {
                    try {
                      return dependencyValues.functionOperator(formula_f({ [varString]: x }));
                    } catch (e) {
                      return NaN;
                    }
                  }
                }
              }
            }
          } else {

            let functionChild = dependencyValues.functionChild[0];

            return {
              newValues: {
                f: function (x) {
                  return dependencyValues.functionOperator(
                    functionChild.stateValues.f(x)
                  )
                }
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


    // make functionChild null
    // as base Function component uses it to determine if extrema
    // should depend on a function child
    stateVariableDefinitions.functionChild = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { functionChild: null } })
    }

    // remove function child dependency from minima
    stateVariableDefinitions.minima.returnDependencies = () => ({
      f: {
        dependencyType: "stateVariable",
        variableName: "f",
      },
      xscale: {
        dependencyType: "stateVariable",
        variableName: "xscale"
      },
    })


    // remove function child dependency from maxima
    stateVariableDefinitions.maxima.returnDependencies = () => ({
      f: {
        dependencyType: "stateVariable",
        variableName: "f",
      },
      xscale: {
        dependencyType: "stateVariable",
        variableName: "xscale"
      },
    })

    return stateVariableDefinitions;

  }


}
