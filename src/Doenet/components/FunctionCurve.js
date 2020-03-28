import Curve from './Curve';

export default class FunctionCurve extends Curve {
  static componentType = "functioncurve";
  static rendererType = "functioncurve";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.flipFunction = { default: false, forRenderer: true };
    properties.nDiscretizationPoints = { default: 500 };
    properties.variables = {
      componentType: "math",
      entryPrefixes: ["var"],
      dependentStateVariables: [{
        dependencyName: "nVariables",
        variableName: "nVariables"
      }],
      propagateToDescendants: true,
    }
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: "exactlyOneFunction",
      componentType: 'function',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    delete stateVariableDefinitions.childrenToRender;

    stateVariableDefinitions.nVariables = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { nVariables: 2 } })
    }

    stateVariableDefinitions.f = {
      forRenderer: true,
      returnDependencies: () => ({
        functionChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneFunction",
          variableNames: ["numericalf"]
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          f: dependencyValues.functionChild[0].stateValues.numericalf
        }
      })
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

            let x1 = variables.x1.evaluate_to_constant();
            let x2 = variables.x2.evaluate_to_constant();

            if (!(Number.isFinite(x1) && Number.isFinite(x2))) {
              return {};
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