import Curve from './Curve';
import me from 'math-expressions';
import { returnNVariables } from '../utils/math';

export default class ParametrizedCurve extends Curve {
  static componentType = "parametrizedcurve";
  static rendererType = "parametrizedcurve";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.nDiscretizationPoints = { default: 500 };
    properties.periodic = { default: false };
    return properties;
  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    let atLeastOneFunction = childLogic.newLeaf({
      name: "atLeastOneFunction",
      componentType: 'function',
      comparison: "atLeast",
      number: 1,
    });

    let atMostOneVariables = childLogic.newLeaf({
      name: "atMostOneVariables",
      componentType: 'variables',
      comparison: 'atMost',
      number: 1
    });

    childLogic.newOperator({
      name: "parametrizedCurveLogic",
      operator: 'and',
      propositions: [atLeastOneFunction, atMostOneVariables],
      setAsBase: true,
    });


    return childLogic;
  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { childrenToRender: [] } })
    }

    stateVariableDefinitions.nVariables = {
      returnDependencies: () => ({
        functionChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastOneFunction"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          nVariables: dependencyValues.functionChildren.length
        }
      })
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
            dependencyType: "childStateVariables",
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
        } else if (globalDependencyValues.parentVariables !== null) {
          variablesSpecified = globalDependencyValues.parentVariables
        }

        return {
          newValues: {
            variables: returnNVariables(arraySize[0], variablesSpecified)
          }
        }

      }
    }


    stateVariableDefinitions.fs = {
      forRenderer: true,
      isArray: true,
      entryPrefixes: ["f"],
      returnArraySizeDependencies: () => ({
        nVariables: {
          dependencyType: "stateVariable",
          variableName: "nVariables",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nVariables];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            functionChild: {
              dependencyType: "childStateVariables",
              childLogicName: "atLeastOneFunction",
              variableNames: ["numericalf"],
              childIndices: [arrayKey]
            }
          };
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let fs = {};
        for (let arrayKey of arrayKeys) {
          let functionChild = dependencyValuesByKey[arrayKey].functionChild;
          if (functionChild.length === 1) {
            fs[arrayKey] = functionChild[0].stateValues.numericalf;
          }
        }
        return { newValues: { fs } }

      }
    }

    stateVariableDefinitions.parmaxNumeric = {
      forRenderer: true,
      returnDependencies: () => ({
        parmax: {
          dependencyType: "stateVariable",
          variableName: "parmax"
        },
      }),
      definition: function ({ dependencyValues }) {
        let parmaxNumeric = dependencyValues.parmax.evaluate_to_constant();
        if (!Number.isFinite(parmaxNumeric)) {
          parmaxNumeric = NaN;
        }
        return { newValues: { parmaxNumeric } }
      }
    }

    stateVariableDefinitions.parminNumeric = {
      forRenderer: true,
      returnDependencies: () => ({
        parmin: {
          dependencyType: "stateVariable",
          variableName: "parmin"
        },
      }),
      definition: function ({ dependencyValues }) {
        let parminNumeric = dependencyValues.parmin.evaluate_to_constant();
        if (!Number.isFinite(parminNumeric)) {
          parminNumeric = NaN;
        }
        return { newValues: { parminNumeric } }
      }
    }

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        fs: {
          dependencyType: "stateVariable",
          variableName: "fs"
        },
        parminNumeric: {
          dependencyType: "stateVariable",
          variableName: "parminNumeric"
        },
        parmaxNumeric: {
          dependencyType: "stateVariable",
          variableName: "parmaxNumeric"
        },
        nDiscretizationPoints: {
          dependencyType: "stateVariable",
          variableName: "nDiscretizationPoints"
        },
        periodic: {
          dependencyType: "stateVariable",
          variableName: "periodic"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          nearestPoint: function (variables) {

            // TODO: extend to dimensions other than N=2

            if (dependencyValues.fs.length !== 2) {
              return {};
            }

            let x1 = variables.x1.evaluate_to_constant();
            let x2 = variables.x2.evaluate_to_constant();

            if (!(Number.isFinite(x1) && Number.isFinite(x2))) {
              return {};
            }

            let minfunc = function (t) {

              let dx1 = x1 - dependencyValues.fs[0](t);
              let dx2 = x2 - dependencyValues.fs[1](t);

              return dx1 * dx1 + dx2 * dx2;
            }

            let minT = dependencyValues.parminNumeric;
            let maxT = dependencyValues.parmaxNumeric;

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


            if (dependencyValues.periodic) {
              // if have periodic
              // and tAtMin is at endpoint, make interval span past endpoint
              if (Math.abs(tAtMin - minT) < numerics.eps) {
                // append interval for delta for last interval before minT
                tIntervalMin = minT - delta;
              } else if (Math.abs(tAtMin - maxT) < numerics.eps) {
                // append interval for delta for first interval after minT
                tIntervalMax = maxT + delta;
              }
            }

            let result = numerics.fminbr(minfunc, [tIntervalMin, tIntervalMax]);
            tAtMin = result.x;

            let x1AtMin = dependencyValues.fs[0](tAtMin);
            let x2AtMin = dependencyValues.fs[1](tAtMin);

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