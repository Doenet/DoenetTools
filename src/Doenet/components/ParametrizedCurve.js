import Curve from './Curve';
import me from 'math-expressions';

export default class ParametrizedCurve extends Curve {
  static componentType = "parametrizedcurve";
  static rendererType = "parametrizedcurve";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.parameter = { default: me.fromAst('t'), propagateToDescendants: true };
    properties.parmin = { default: me.fromAst(-10), propagateToDescendants: true };
    properties.parmax = { default: me.fromAst(10), propagateToDescendants: TextTrackCue };
    properties.nDiscretizationPoints = { default: 500 };
    properties.periodic = { default: false };
    return properties;
  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: "atLeastOneFunction",
      componentType: 'function',
      comparison: "atLeast",
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.childrenToRender;

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


    stateVariableDefinitions.fs = {
      forRenderer: true,
      isArray: true,
      entryPrefixes: ["f"],
      returnDependencies: () => ({
        functionChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastOneFunction",
          variableNames: ["numericalf"]
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          fs: dependencyValues.functionChildren.map(x => x.stateValues.numericalf)
        }
      })
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

            let x1AtMin = -10 * Math.log(1 / tAtMin - 1);
            let x2AtMin = dependencyValues.f(x1AtMin)
            if (dependencyValues.flipFunction) {
              [x1AtMin, x2AtMin] = [x2AtMin, x1AtMin]
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