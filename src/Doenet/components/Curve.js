import GraphicalComponent from './abstract/GraphicalComponent';
import { createUniqueName } from '../utils/naming';
import {
  breakEmbeddedStringByCommas, breakIntoVectorComponents,
  breakPiecesByEquals,
  returnBreakStringsSugarFunction
} from './commonsugar/breakstrings';
import { returnNVariables } from '../utils/math';

import me from 'math-expressions';

export default class Curve extends GraphicalComponent {
  static componentType = "curve";
  static rendererType = "curve";

  static primaryStateVariableForDefinition = "fShadow";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);

    properties.draggable = { default: true, forRenderer: true };
    properties.label.propagateToDescendants = true;
    properties.showLabel.propagateToDescendants = true;
    properties.layer.propagateToDescendants = true;
    properties.flipFunction = { default: false, forRenderer: true };
    properties.nDiscretizationPoints = { default: 500 };
    properties.periodic = { default: false };
    properties.parmin = { default: me.fromAst(-10) };
    properties.parmax = { default: me.fromAst(10) };

    // properties.variables = {
    //   componentType: "math",
    //   entryPrefixes: ["var"],
    //   dependentStateVariables: [{
    //     dependencyName: "nVariables",
    //     variableName: "nVariables"
    //   }],
    //   propagateToDescendants: true,
    // }

    return properties;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakIntoFunctionsByCommas = function ({ matchedChildren }) {
      let childrenToComponentFunction = x => ({
        componentType: "function", children: x
      });

      let breakFunction = returnBreakStringsSugarFunction({
        childrenToComponentFunction,
        mustStripOffOuterParentheses: true
      })

      let result = breakFunction({ matchedChildren });

      if (!result.success) {
        // if didn't succeed,
        // then just wrap string with a function
        return {
          success: true,
          newChildren: [{
            componentType: "function",
            children: matchedChildren
          }]
        }

      }

      return result;

    };

    sugarInstructions.push({
      childrenRegex: /s/,
      replacementFunction: breakIntoFunctionsByCommas
    })

    return sugarInstructions;

  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroFunctions = childLogic.newLeaf({
      name: "atLeastZeroFunctions",
      componentType: "function",
      comparison: "atLeast",
      number: 0
    })

    let exactlyOneThrough = childLogic.newLeaf({
      name: "exactlyOneThrough",
      componentType: 'through',
      number: 1
    });

    let atMostOneBezierControls = childLogic.newLeaf({
      name: "atMostOneBezierControls",
      componentType: 'beziercontrols',
      comparison: 'atMost',
      number: 1
    });

    let throughAndControls = childLogic.newOperator({
      name: "throughAndControls",
      operator: 'and',
      propositions: [exactlyOneThrough, atMostOneBezierControls],
    });

    let functionsXorThrough = childLogic.newOperator({
      name: "functionsXorThrough",
      operator: 'xor',
      propositions: [atLeastZeroFunctions, throughAndControls],
    });

    let atMostOneVariable = childLogic.newLeaf({
      name: "atMostOneVariable",
      componentType: "variable",
      comparison: "atMost",
      number: 1,
      takePropertyChildren: true,
    })

    childLogic.newOperator({
      name: "curveLogic",
      operator: 'and',
      propositions: [functionsXorThrough, atMostOneVariable],
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    stateVariableDefinitions.styleDescription = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
      }),
      definition: function ({ dependencyValues }) {


        let curveDescription = "";
        if (dependencyValues.selectedStyle.lineWidth >= 4) {
          curveDescription += "thick ";
        } else if (dependencyValues.selectedStyle.lineWidth <= 1) {
          curveDescription += "thin ";
        }
        if (dependencyValues.selectedStyle.lineStyle === "dashed") {
          curveDescription += "dashed ";
        } else if (dependencyValues.selectedStyle.lineStyle === "dotted") {
          curveDescription += "dotted ";
        }

        curveDescription += dependencyValues.selectedStyle.lineColor;

        return { newValues: { styleDescription: curveDescription } };
      }
    }

    stateVariableDefinitions.variableForChild = {
      defaultValue: me.fromAst("x"),
      returnDependencies: () => ({
        variableChild: {
          dependencyType: "child",
          childLogicName: "atMostOneVariable",
          variableNames: ["value"],
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.variableChild.length === 1) {
          return {
            newValues: {
              variableForChild: dependencyValues.variableChild[0].stateValues.value
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: {
              variableForChild: {
                variablesToCheck: ["variable", "variableForChild"]
              }
            }
          }
        }
      }
    }

    stateVariableDefinitions.curveType = {
      forRenderer: true,
      returnDependencies: () => ({
        functionChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroFunctions"
        },
        throughChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneThrough"
        }
      }),
      definition({ dependencyValues }) {
        let curveType = "function"
        if (dependencyValues.throughChild.length === 1) {
          curveType = "bezier"
        } else if (dependencyValues.functionChildren.length > 1) {
          curveType = "parameterization"
        }

        return { newValues: { curveType } }
      }
    }

    // fShadow will be null unless curve was created via an adapter
    // In case of adapter,,
    // given the primaryStateVariableForDefinition static variable,
    // the definition of fShadow will be changed to be the value
    // that shadows the component adapted
    stateVariableDefinitions.fShadow = {
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          fShadow: { variablesToCheck: ["fShadow"] }
        }
      }),
    }


    stateVariableDefinitions.fs = {
      forRenderer: true,
      isArray: true,
      entryPrefixes: ["f"],
      defaultEntryValue: () => 0,
      returnArraySizeDependencies: () => ({
        functionChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroFunctions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [Math.max(1, dependencyValues.functionChildren.length)];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            functionChild: {
              dependencyType: "child",
              childLogicName: "atLeastZeroFunctions",
              variableNames: ["f"],
              childIndices: [arrayKey]
            }
          };
          if (Number(arrayKey) === 0) {
            dependenciesByKey[arrayKey].fShadow = {
              dependencyType: "stateVariable",
              variableName: "fShadow"
            }
          }
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let fs = {};
        let essentialFs = {};
        for (let arrayKey of arrayKeys) {
          let functionChild = dependencyValuesByKey[arrayKey].functionChild;
          if (functionChild.length === 1) {
            fs[arrayKey] = functionChild[0].stateValues.f;
          } else {
            if (Number(arrayKey) === 0 && dependencyValuesByKey[arrayKey].fShadow) {
              fs[arrayKey] = dependencyValuesByKey[arrayKey].fShadow;
            } else {
              essentialFs[arrayKey] = {
                variablesToCheck: [
                  { variableName: "fs", arrayIndex: arrayKey }
                ],
              }
            }
          }
        }
        return {
          newValues: { fs },
          useEssentialOrDefaultValue: {
            fs: essentialFs,
          },
        }

      }
    }

    stateVariableDefinitions.f = {
      isAlias: true,
      targetVariableName: "f1"
    };


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
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType"
        },
        fs: {
          dependencyType: "stateVariable",
          variableName: "fs"
        },
        flipFunction: {
          dependencyType: "stateVariable",
          variableName: "flipFunction"
        },
        nDiscretizationPoints: {
          dependencyType: "stateVariable",
          variableName: "nDiscretizationPoints"
        },
        parminNumeric: {
          dependencyType: "stateVariable",
          variableName: "parminNumeric"
        },
        parmaxNumeric: {
          dependencyType: "stateVariable",
          variableName: "parmaxNumeric"
        },
        periodic: {
          dependencyType: "stateVariable",
          variableName: "periodic"
        }
      }),
      definition({ dependencyValues }) {
        let nearestPointFunction = null;

        if (dependencyValues.curveType === "function") {
          nearestPointFunction = getNearestPointFunctionCurve({ dependencyValues, numerics });
        } else if (dependencyValues.curveType === "parameterization") {
          nearestPointFunction = getNearestPointParametrizedCurve({ dependencyValues, numerics });
        }

        return {
          newValues: { nearestPoint: nearestPointFunction }
        }

      }
    }


    return stateVariableDefinitions;
  }


}

function getNearestPointFunctionCurve({ dependencyValues, numerics }) {
  let flipFunction = dependencyValues.flipFunction;
  let f = dependencyValues.fs[0];
  let nDiscretizationPoints = dependencyValues.nDiscretizationPoints;

  return function (variables) {

    // first find nearest point when treating a function
    // (or an inverse function)
    // which finds a the nearest point vertically
    // (or horizontally)
    // assuming the function is defined at that point

    let x1AsFunction, x2AsFunction;
    if (flipFunction) {
      x2AsFunction = variables.x2.evaluate_to_constant();
      x1AsFunction = f(x2AsFunction);
    } else {
      x1AsFunction = variables.x1.evaluate_to_constant();
      x2AsFunction = f(x1AsFunction);
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

      if (flipFunction) {
        dx1 -= f(x);
        dx2 -= x;
      } else {
        dx1 -= x;
        dx2 -= f(x);
      }

      return dx1 * dx1 + dx2 * dx2;
    }

    let minT = 0;
    let maxT = 1;

    let Nsteps = nDiscretizationPoints;
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
    let x2AtMin = f(x1AtMin)
    if (flipFunction) {
      [x1AtMin, x2AtMin] = [x2AtMin, x1AtMin]
    }


    // choose the nearest point treating as a function
    // if that point exists and isn't 10 times further
    // that the actual nearest point
    if (Number.isFinite(x1AsFunction) && Number.isFinite(x2AsFunction)) {
      let funD2 = Math.pow(x1AsFunction - x1, 2) + Math.pow(x2AsFunction - x2, 2);
      let d2 = Math.pow(x1AtMin - x1, 2) + Math.pow(x2AtMin - x2, 2);

      // 100 is 10 times distance, as working with squared distance
      if (funD2 < 100 * d2) {
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

function getNearestPointParametrizedCurve({ dependencyValues, numerics }) {
  let fs = dependencyValues.fs;
  let parminNumeric = dependencyValues.parminNumeric;
  let parmaxNumeric = dependencyValues.parmaxNumeric;
  let nDiscretizationPoints = dependencyValues.nDiscretizationPoints;
  let periodic = dependencyValues.periodic;

  return function (variables) {

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

      let dx1 = x1 - fs[0](t);
      let dx2 = x2 - fs[1](t);

      return dx1 * dx1 + dx2 * dx2;
    }

    let minT = parminNumeric;
    let maxT = parmaxNumeric;

    let Nsteps = nDiscretizationPoints;
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


    if (periodic) {
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

    let x1AtMin = fs[0](tAtMin);
    let x2AtMin = fs[1](tAtMin);

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