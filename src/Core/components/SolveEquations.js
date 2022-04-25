import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';
import { normalizeMathExpression, returnNVariables } from '../utils/math';
// import nerdamer from 'nerdamer'
// import 'nerdamer/Algebra.js'
// import 'nerdamer/Calculus.js'
// import 'nerdamer/Solve.js'

export default class SolveEquations extends InlineComponent {
  static componentType = "solveEquations";
  static rendererType = undefined;


  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.variables = {
      createComponentOfType: "variables"
    }

    attributes.nDiscretizationPoints = {
      createComponentOfType: "number",
      createStateVariable: "nDiscretizationPoints",
      defaultValue: 100,
      public: true,
    };

    attributes.minVar = {
      createComponentOfType: "number",
      createStateVariable: "minVar",
      defaultValue: null,
    }

    attributes.maxVar = {
      createComponentOfType: "number",
      createStateVariable: "maxVar",
      defaultValue: null,
    }

    return attributes;
  }


  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let wrapStringsAndMacros = function ({ matchedChildren }) {

      // only apply if all children are strings or macros
      if (!matchedChildren.every(child =>
        typeof child === "string" ||
        child.doenetAttributes && child.doenetAttributes.createdFromMacro
      )) {
        return { success: false }
      }

      // don't apply to a single macro
      if (matchedChildren.length === 1 &&
        typeof matchedChildren[0] !== "string"
      ) {
        return { success: false }
      }

      return {
        success: true,
        newChildren: [{
          componentType: "math",
          children: matchedChildren
        }],
      }

    }

    sugarInstructions.push({
      replacementFunction: wrapStringsAndMacros
    });

    return sugarInstructions;

  }


  static returnChildGroups() {

    return [{
      group: "maths",
      componentTypes: ["math"]
    }, {
      group: "strings",
      componentTypes: ["string"]
    }]

  }

  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    stateVariableDefinitions.variables = {
      isArray: true,
      public: true,
      componentType: "variable",
      entryPrefixes: ["variable"],
      returnArraySizeDependencies: () => ({
        // nInputs: {
        //   dependencyType: "stateVariable",
        //   variableName: "nInputs",
        // },
      }),
      returnArraySize({ dependencyValues }) {
        return [1];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          variablesAttr: {
            dependencyType: "attributeComponent",
            attributeName: "variables",
            variableNames: ["variables"],
          },
        };

        return { globalDependencies }
      },
      arrayDefinitionByKey({ globalDependencyValues, arraySize, arrayKeys, usedDefault }) {
        let variablesSpecified = [];
        if (globalDependencyValues.variablesAttr !== null) {
          variablesSpecified = globalDependencyValues.variablesAttr.stateValues.variables;
        }
        return {
          setValue: {
            variables: returnNVariables(arraySize[0], variablesSpecified)
          }
        }
      }
    }

    stateVariableDefinitions.variable = {
      isAlias: true,
      targetVariableName: "variable1"
    };


    stateVariableDefinitions.allSolutions = {
      returnDependencies: () => ({
        mathChild: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value"]
        },
        variables: {
          dependencyType: "stateVariable",
          variableName: "variables"
        },
        minVar: {
          dependencyType: "stateVariable",
          variableName: "minVar"
        },
        maxVar: {
          dependencyType: "stateVariable",
          variableName: "maxVar"
        },
        nDiscretizationPoints: {
          dependencyType: "stateVariable",
          variableName: "nDiscretizationPoints"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.mathChild.length === 0) {
          return { setValue: { allSolutions: [] } }
        }

        let expression = dependencyValues.mathChild[0].stateValues.value;


        if (!(Array.isArray(expression.tree) && expression.tree.length === 3 && expression.tree[0] === "=")) {
          return { setValue: { allSolutions: [] } }
        }

        let minVar = dependencyValues.minVar;
        let maxVar = dependencyValues.maxVar;

        // let numericalSolutions = [];
        // let nonNumericalSolutions = [];

        // let result;
        // try {
        //   result = nerdamer.solveEquations(expression.toString(), dependencyValues.variables[0].toString())
        // } catch (e) {
        //   result = [];
        // }

        // if (result.length > 0) {

        //   let originalSolutions = [];

        //   for (let res of result) {
        //     let sol;
        //     try {
        //       sol = me.fromText(res.text())
        //     } catch (e) {
        //       sol = me.fromAst('\uff3f')
        //     }
        //     originalSolutions.push(sol)
        //   }


        //   for (let sol of originalSolutions) {
        //     let numericalVal = sol.evaluate_to_constant();

        //     if (Number.isFinite(minVar) && Number.isFinite(maxVar)) {
        //       if (!(Number.isFinite(numericalVal)
        //         && numericalVal >= minVar
        //         && numericalVal <= maxVar)) {
        //         continue;
        //       }
        //     }

        //     if (Number.isFinite(numericalVal)) {
        //       // skip repeated values
        //       // if (numericalSolutions.some(x => Math.abs((x - numericalVal) / x) < 1E-10)) {
        //       //   continue;
        //       // }
        //       numericalSolutions.push(numericalVal);
        //     } else {
        //       nonNumericalSolutions.push(sol);
        //     }

        //   }

        //   numericalSolutions.sort((a, b) => a - b);

        // }


        // if (numericalSolutions.length > 0 || nonNumericalSolutions.length === 0) {
        //   // verify numerical solutions
        //   // try finding additional numerical solutions

        let numericalSolutions = [];


        let varName = dependencyValues.variables[0].subscripts_to_strings().tree;
        let formula = me.fromAst(['+', expression.tree[1], ["-", expression.tree[2]]])
          .subscripts_to_strings();
        let f_base = formula.f();
        let f = x => f_base({ [varName]: x });

        let f_symbolic = (x) => normalizeMathExpression({
          value: formula.substitute({ [varName]: x }).strings_to_subscripts(),
          simplify: true,
          expand: true
        }).evaluate_to_constant();

        let f_or_nan = function (x) {
          try {
            return f(x);
          } catch (e) {
            return NaN;
          }
        }

        let f_or_symbolic = function (x) {
          try {
            return f(x);
          } catch (e) {
            let res = f_symbolic(x);
            if (res !== null) {
              return res;
            } else {
              return NaN;
            }
          }
        }

        if (!Number.isFinite(minVar)) {
          // if (originalNumerical.length > 0) {
          //   minVar = Math.min(-10, originalNumerical[0] - 1)
          // } else {
          minVar = -10;
          // }
        }
        if (!Number.isFinite(maxVar)) {
          // if (originalNumerical.length > 0) {
          //   maxVar = Math.max(10, originalNumerical[originalNumerical.length - 1] + 1)
          // } else {
          maxVar = 10;
          // }
        }

        if (minVar > maxVar) {
          return { setValue: { allSolutions: [] } }
        }

        // let boundaryPoints = [minVar, ...originalNumerical, maxVar];
        let boundaryPoints = [minVar, maxVar];

        let testPoints = [minVar];


        for (let ind = 0; ind < boundaryPoints.length - 1; ind++) {

          let bot = boundaryPoints[ind];
          let top = boundaryPoints[ind + 1];

          let Nsteps = dependencyValues.nDiscretizationPoints;
          let delta = (top - bot) / Nsteps;

          for (let step = 1; step < Nsteps; step++) {
            testPoints.push(bot + step * delta);
          }
          testPoints.push(top);

        }

        // add extra point to beginning and end
        // to better estimate behavior at boundary
        let newFirst = 2 * testPoints[0] - testPoints[1];
        let newLast = 2 * testPoints[testPoints.length - 1] - testPoints[testPoints.length - 2];
        testPoints = [newFirst, ...testPoints, newLast];


        let f_points = testPoints.map(f_or_symbolic);

        // look for points where switches between finite and non-finite
        // and find location of switch more precisely to add a point there
        let lastX = testPoints[0];
        let lastF = f_points[0];

        for (let ind = 0; ind < testPoints.length; ind++) {
          let thisX = testPoints[ind];
          let thisF = f_points[ind];

          if (!Number.isFinite(thisF) || !Number.isFinite(lastF)) {
            let finiteX, nonFiniteX;
            if (Number.isFinite(thisF)) {
              finiteX = thisX;
              nonFiniteX = lastX;
            } else if (Number.isFinite(lastF)) {
              finiteX = lastX;
              nonFiniteX = thisX;
            }

            if (finiteX !== undefined) {
              // use bisection algorithm to find point where switches
              // continue bisection method until we've exhausted machine precision
              // to increase the likelihood we'll find a zero

              while (true) {
                let midX = (finiteX + nonFiniteX) / 2;
                if (midX === finiteX || midX === nonFiniteX) {
                  break;
                }
                if (Number.isFinite(f_or_nan(midX))) {
                  finiteX = midX;
                } else {
                  nonFiniteX = midX;
                }
              }

              if (![thisX, lastX].includes(finiteX)) {
                testPoints.splice(ind, 0, finiteX);
                f_points.splice(ind, 0, f_or_nan(finiteX))
              }

            }

          }

          lastX = thisX;
          lastF = thisF;
        }


        numericalSolutions = [];

        lastX = testPoints[0];
        lastF = f_points[0];

        if (lastF === 0) {
          numericalSolutions.push(lastX);
        }


        for (let ind = 1; ind < testPoints.length; ind++) {
          let thisX = testPoints[ind];
          let thisF = f_points[ind];

          if (thisF === 0) {
            let addedExactZero = false;

            // check if switch signs
            if (ind < testPoints.length - 1) {
              let nextX = testPoints[ind + 1];
              let nextF = f_points[ind + 1];

              let originalLastX = lastX;
              let originalLastF = lastF;


              if (lastF * nextF > 0) {
                // didn't switch signs, look for smaller interval where switched signs
                for (let j = 0; j < 10; j++) {
                  lastX = (0.1 * lastX + 0.9 * thisX);
                  nextX = (0.1 * nextX + 0.9 * thisX);

                  lastF = f_or_nan(lastX)
                  nextF = f_or_nan(nextX)

                  if (lastF * nextF < 0) {
                    // now switches signs,
                    // which means it switches signs again when get to original interval
                    if (lastF * originalLastF < 0) {
                      numericalSolutions.push(numerics.fzero(f_or_nan, [originalLastX, lastX]));
                      numericalSolutions.push(thisX);
                    } else {
                      if (!numericalSolutions.includes(thisX)) {
                        numericalSolutions.push(thisX)
                      }
                      // use the slightly larger values of x
                      // for the current x so that will find zero on next loop
                      thisX = nextX;
                      thisF = nextF;
                    }
                    addedExactZero = true;
                    break;

                  }

                }
              }
            }

            if (!addedExactZero && !numericalSolutions.includes(thisX)) {
              numericalSolutions.push(thisX);
            }

          } else if (thisF * lastF < 0) {
            numericalSolutions.push(numerics.fzero(f_or_nan, [lastX, thisX]));
          } else if (lastF !== 0) {

            // if not last point, check if is a local min or max
            // that could cross zero if large enough
            if (ind < testPoints.length - 1) {
              let nextX = testPoints[ind + 1];
              let nextF = f_points[ind + 1];

              if ((lastF - thisF) * (nextF - thisF) > 0 && (
                (thisF > 0 && lastF > thisF) || (thisF < 0 && lastF < thisF)
              )) {

                // get better estimate of local extremum
                let fFlip;
                if (lastF > thisF) {
                  fFlip = f_or_nan;
                } else {
                  fFlip = x => -f_or_nan(x);
                }

                // use high precision to find minimum
                // to increase likelihood we'll hit zero
                let res = numerics.fminbr(fFlip, [lastX, nextX], undefined, 1E-10);

                if (res.success) {

                  let extremumX = res.x;
                  let extremumF = f_or_nan(extremumX);


                  if (extremumF * lastF < 0) {
                    // we now flipped signs
                    numericalSolutions.push(numerics.fzero(f_or_nan, [lastX, extremumX]));

                    // use the extremum values of x
                    // for the current x so that will find zero on next loop
                    thisX = extremumX;
                    thisF = extremumF;

                  } else if (extremumF === 0) {
                    numericalSolutions.push(extremumX);
                  }
                }

              }

            }

          }

          lastX = thisX;
          lastF = thisF;


        }


        // since added extra points outside range, filter out any extra solutions
        numericalSolutions = numericalSolutions.filter(x => x >= minVar && x <= maxVar);

        let allSolutions = numericalSolutions.map(x => me.fromAst(x))
        // allSolutions.push(...nonNumericalSolutions)


        return { setValue: { allSolutions } }

      }
    }

    stateVariableDefinitions.numberSolutions = {
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        allSolutions: {
          dependencyType: "stateVariable",
          variableName: "allSolutions"
        }
      }),
      definition({ dependencyValues }) {
        return { setValue: { numberSolutions: dependencyValues.allSolutions.length } };
      }
    }


    stateVariableDefinitions.solutions = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["solution"],
      returnArraySizeDependencies: () => ({
        numberSolutions: {
          dependencyType: "stateVariable",
          variableName: "numberSolutions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numberSolutions];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allSolutions: {
            dependencyType: "stateVariable",
            variableName: "allSolutions"
          }
        }

        return { globalDependencies }

      },
      arrayDefinitionByKey({ globalDependencyValues }) {

        let solutions = {};

        for (let key = 0; key < globalDependencyValues.__array_size[0]; key++) {
          solutions[key] = globalDependencyValues.allSolutions[key];
        }

        return { setValue: { solutions } }
      }
    }



    return stateVariableDefinitions;

  }



}
