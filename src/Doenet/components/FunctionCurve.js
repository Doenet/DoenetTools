import Curve from './Curve';
import { returnNVariables } from '../utils/math';

export default class FunctionCurve extends Curve {
  static componentType = "functioncurve";
  static rendererType = "functioncurve";

  static primaryStateVariableForDefinition = "f";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.flipFunction = { default: false, forRenderer: true };
    properties.nDiscretizationPoints = { default: 500 };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    let atMostOneFunction = childLogic.newLeaf({
      name: "atMostOneFunction",
      componentType: 'function',
      comparison: "atMost",
      number: 1,
    });

    let atMostOneVariables = childLogic.newLeaf({
      name: "atMostOneVariables",
      componentType: 'variables',
      comparison: 'atMost',
      number: 1
    });

    childLogic.newOperator({
      name: "functionCurveLogic",
      operator: 'and',
      propositions: [atMostOneFunction, atMostOneVariables],
      setAsBase: true,
    });


    return childLogic;
  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { childrenToRender: [] } })
    }

    stateVariableDefinitions.nVariables = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { nVariables: 2 } })
    }

    stateVariableDefinitions.variables = {
      isArray: true,
      public: true,
      componentType: "variable",
      entryPrefixes: ["var"],
      returnArraySizeDependencies: () => ({
        nVariables: {
          dependencyType: "stateVariable",
          variableName: "nVariables",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nVariables];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          variablesChild: {
            dependencyType: "child",
            childLogicName: "atMostOneVariables",
            variableNames: ["variables"],
          },
          parentVariables: {
            dependencyType: "parentStateVariable",
            variableName: "variables"
          }
        };

        return { globalDependencies }
      },
      arrayDefinitionByKey({ globalDependencyValues, arraySize }) {

        let variablesSpecified = [];
        if (globalDependencyValues.variablesChild.length === 1) {
          variablesSpecified = globalDependencyValues.variablesChild[0].stateValues.variables;
        } else if(globalDependencyValues.parentVariables !== null) {
          variablesSpecified = globalDependencyValues.parentVariables
        }

        return {
          newValues: {
            variables: returnNVariables(arraySize[0], variablesSpecified)
          }
        }

      }
    }



    stateVariableDefinitions.f = {
      forRenderer: true,
      returnDependencies: () => ({
        functionChild: {
          dependencyType: "child",
          childLogicName: "atMostOneFunction",
          variableNames: ["numericalf"]
        },
      }),
      defaultValue: () => 0,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.functionChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              numericalf: { variablesToCheck: ["numericalf"] }
            }
          }
        } else {
          return {
            newValues: {
              f: dependencyValues.functionChild[0].stateValues.numericalf
            }
          }
        }
      }
    }

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        f: {
          dependencyType: "stateVariable",
          variableName: "f"
        },
        flipFunction: {
          dependencyType: "stateVariable",
          variableName: "flipFunction"
        },
        nDiscretizationPoints: {
          dependencyType: "stateVariable",
          variableName: "nDiscretizationPoints"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          nearestPoint: function (variables) {

            // first find nearest point when treating a function
            // (or an inverse function)
            // which finds a the nearest point vertically
            // (or horizontally)
            // assuming the function is defined at that point
            
            let x1AsFunction, x2AsFunction;
            if (dependencyValues.flipFunction) {
              x2AsFunction = variables.x2.evaluate_to_constant();
              x1AsFunction = dependencyValues.f(x2AsFunction);
            } else {
              x1AsFunction = variables.x1.evaluate_to_constant();
              x2AsFunction = dependencyValues.f(x1AsFunction);
            }

            
            // next, find the nearest point over all

            let x1 = variables.x1.evaluate_to_constant();
            let x2 = variables.x2.evaluate_to_constant();

            if (!(Number.isFinite(x1) && Number.isFinite(x2))) {
              if (Number.isFinite(x1AsFunction) && Number.isFinite(x2AsFunction)) {
                result = {
                  x1: x1AsFunction,
                  x2: x2Asx1AsFunction
                }
                if (variables.x3 !== undefined) {
                  result.x3 = 0;
                }
                return result;
              } else {
                return {};
              }

            }

            let minfunc = function (t) {
              let x = -10 * Math.log(1 / t - 1);

              let dx1 = x1;
              let dx2 = x2;

              if (dependencyValues.flipFunction) {
                dx1 -= dependencyValues.f(x);
                dx2 -= x;
              } else {
                dx1 -= x;
                dx2 -= dependencyValues.f(x);
              }

              return dx1 * dx1 + dx2 * dx2;
            }

            let minT = 0;
            let maxT = 1;

            let Nsteps = dependencyValues.nDiscretizationPoints;
            let delta = (maxT - minT) / Nsteps;

            // sample Nsteps values of x between  [minT, maxT] 
            // and find one where the value of minfunc is smallest
            // Will create an interval [tIntervalMin, tIntervalMax]
            // around that point (unless that point is minT or maxT)
            // to run numerical minimizer over that interval

            let tAtMin = minT;
            let fAtMin = minfunc(minT);
            let tIntervalMin = minT;
            let tIntervalMax = minT + delta;

            for (let step = 1; step <= Nsteps; step++) {
              let tnew = minT + step * delta;
              let fnew = minfunc(tnew);
              if (fnew < fAtMin || Number.isNaN(fAtMin)) {
                tAtMin = tnew;
                fAtMin = fnew;
                tIntervalMin = tnew - delta;
                if (step === Nsteps) {
                  tIntervalMax = tnew;
                } else {
                  tIntervalMax = tnew + delta;
                }
              }

            }


            let result = numerics.fminbr(minfunc, [tIntervalMin, tIntervalMax]);
            tAtMin = result.x;

            let x1AtMin = -10 * Math.log(1 / tAtMin - 1);
            let x2AtMin = dependencyValues.f(x1AtMin)
            if (dependencyValues.flipFunction) {
              [x1AtMin, x2AtMin] = [x2AtMin, x1AtMin]
            }


            // choose the nearest point treating as a function
            // if that point exists and isn't 10 times further
            // that the actual nearest point
            if (Number.isFinite(x1AsFunction) && Number.isFinite(x2AsFunction)) {
              let funD2 = Math.pow(x1AsFunction-x1,2) + Math.pow(x2AsFunction-x2,2);
              let d2 = Math.pow(x1AtMin - x1, 2) + Math.pow(x2AtMin-x2, 2);

              // 100 is 10 times distance, as working with squared distance
              if(funD2 < 100*d2) {
                result = {
                  x1: x1AsFunction,
                  x2: x2AsFunction
                }
                if (variables.x3 !== undefined) {
                  result.x3 = 0;
                }
                return result;
              }

            }

            result = {
              x1: x1AtMin,
              x2: x2AtMin
            }

            if (variables.x3 !== undefined) {
              result.x3 = 0;
            }

            return result;

          }
        }
      })
    }


    return stateVariableDefinitions;
  }

}