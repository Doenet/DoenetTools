import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export default class Function extends InlineComponent {
  static componentType = "function";
  static rendererType = "math";

  static get stateVariablesShadowedForReference() { return ["variable"] };

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.symbolic = { default: false };
    properties.xscale = { default: 1, propagateToDescendants: true };
    properties.yscale = { default: 1, propagateToDescendants: true };
    // include properties of graphical components
    // for case when function is adapted into functionCurve
    properties.label = { default: "", forRenderer: true };
    properties.showLabel = { default: true, forRenderer: true };
    properties.layer = { default: 0, forRenderer: true };
    return properties;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    sugarInstructions.push({
      childrenRegex: /s/,
      replacementFunction: ({ matchedChildren }) => ({
        success: true,
        newChildren: [{ componentType: "formula", children: matchedChildren }],
      })
    });

    return sugarInstructions;

  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneFormula = childLogic.newLeaf({
      name: "exactlyOneFormula",
      componentType: "formula",
      number: 1,
    })

    let atLeastOneMaximum = childLogic.newLeaf({
      name: "atLeastOneMaximum",
      componentType: "maximum",
      comparison: 'atLeast',
      number: 1,
    })

    let atLeastOneMinimum = childLogic.newLeaf({
      name: "atLeastOneMinimum",
      componentType: "minimum",
      comparison: 'atLeast',
      number: 1,
    })

    let atLeastOneExtremum = childLogic.newLeaf({
      name: "atLeastOneExtremum",
      componentType: "extremum",
      comparison: 'atLeast',
      number: 1,
    })

    let atLeastOneThrough = childLogic.newLeaf({
      name: "atLeastOneThrough",
      componentType: "through",
      comparison: 'atLeast',
      number: 1,
    })

    let throughCriteria = childLogic.newOperator({
      name: "throughCriteria",
      operator: "or",
      propositions: [atLeastOneMaximum, atLeastOneMinimum, atLeastOneExtremum, atLeastOneThrough],
    })

    let atMostOneFunction = childLogic.newLeaf({
      name: "atMostOneFunction",
      componentType: "function",
      comparison: 'atMost',
      number: 1,
    })


    let functionFormulaXorSugar = childLogic.newOperator({
      name: "functionFormulaXorSugar",
      operator: 'xor',
      propositions: [atMostOneFunction, exactlyOneFormula, throughCriteria],
    })


    let atMostOneVariable = childLogic.newLeaf({
      name: "atMostOneVariable",
      componentType: "variable",
      comparison: "atMost",
      number: 1,
      takePropertyChildren: true,
    })

    childLogic.newOperator({
      name: "formulaWithVariable",
      operator: "and",
      propositions: [atMostOneVariable, functionFormulaXorSugar],
      setAsBase: true,
    })


    return childLogic;
  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.selectedStyle = {
      forRenderer: true,
      returnDependencies: () => ({
        styleNumber: {
          dependencyType: "stateVariable",
          variableName: "styleNumber",
        },
        ancestorWithStyle: {
          dependencyType: "ancestor",
          variableNames: ["styleDefinitions"]
        }
      }),
      definition: function ({ dependencyValues }) {

        let selectedStyle;

        for (let styleDefinition of dependencyValues.ancestorWithStyle.stateValues.styleDefinitions) {
          if (dependencyValues.styleNumber === styleDefinition.styleNumber) {
            if (selectedStyle === undefined) {
              selectedStyle = styleDefinition;
            } else {
              // attributes from earlier matches take precedence
              selectedStyle = Object.assign(Object.assign({}, styleDefinition), selectedStyle)
            }
          }
        }

        if (selectedStyle === undefined) {
          selectedStyle = dependencyValues.ancestorWithStyle.stateValues.styleDefinitions[0];
        }
        return { newValues: { selectedStyle } };
      }
    }

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

    stateVariableDefinitions.variable = {
      public: true,
      componentType: "variable",
      defaultValue: me.fromAst("x"),
      returnDependencies: () => ({
        variableChild: {
          dependencyType: "child",
          childLogicName: "atMostOneVariable",
          variableNames: ["value"],
        },
        functionChild: {
          dependencyType: "child",
          childLogicName: "atMostOneFunction",
          variableNames: ["variable"],
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.functionChild.length === 1) {
          if (dependencyValues.variableChild.length === 1) {
            console.warn("Variable for function is ignored when it has a function child")
          }
          return { newValues: { variable: dependencyValues.functionChild[0].stateValues.variable } }
        } else if (dependencyValues.variableChild.length === 1) {
          return { newValues: { variable: dependencyValues.variableChild[0].stateValues.value } }
        } else {
          return {
            useEssentialOrDefaultValue: {
              variable: { variablesToCheck: ["variable"] }
            }
          }
        }
      }
    }

    stateVariableDefinitions.formula = {
      public: true,
      componentType: "formula",
      defaultValue: me.fromAst(0),
      returnDependencies: () => ({
        formulaChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneFormula",
          variableNames: ["value"]
        },
        functionChild: {
          dependencyType: "child",
          childLogicName: "atMostOneFunction",
          variableNames: ["formula"],
        }
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.formulaChild.length === 1) {

          return {
            newValues: {
              formula: dependencyValues.formulaChild[0].stateValues.value
            }
          }
        } else if (dependencyValues.functionChild.length === 1) {

          return {
            newValues: {
              formula: dependencyValues.functionChild[0].stateValues.formula
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: {
              formula: { variablesToCheck: ["formula"] }
            }
          }
        }
      }

    }

    stateVariableDefinitions.f = {
      returnDependencies: () => ({
        symbolic: {
          dependencyType: "stateVariable",
          variableName: "symbolic",
        },
        formula: {
          dependencyType: "stateVariable",
          variableName: "formula",
        },
        variable: {
          dependencyType: "stateVariable",
          variableName: "variable"
        },
        functionChild: {
          dependencyType: "child",
          childLogicName: "atMostOneFunction",
          variableNames: ["f"],
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.functionChild.length === 1) {
          return {
            newValues: {
              f: dependencyValues.functionChild[0].stateValues.f
            }
          }
        } else {

          if (dependencyValues.symbolic) {
            let formula = dependencyValues.formula;
            let varString = dependencyValues.variable.tree;
            return {
              newValues: {
                f: (x) => formula.substitute({ [varString]: x })
              }
            }
          } else {

            let formula_f;
            try {
              formula_f = dependencyValues.formula.f();
            } catch (e) {
              formula_f = () => NaN;
            }
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

        }
      }
    }

    stateVariableDefinitions.latex = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        formula: {
          dependencyType: "stateVariable",
          variableName: "formula"
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { latex: dependencyValues.formula.toLatex() } };
      }
    }

    stateVariableDefinitions.latexWithInputChildren = {
      forRenderer: true,
      returnDependencies: () => ({
        latex: {
          dependencyType: "stateVariable",
          variableName: "latex"
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { latexWithInputChildren: [dependencyValues.latex] } };
      }
    }


    stateVariableDefinitions.minima = {
      public: true,
      componentType: "number",
      isArray: true,
      entireArrayAtOnce: true,
      nDimensions: 2,
      entryPrefixes: ["minimum", "minimumLocations", "minimumLocation", "minimumValues", "minimumValue"],
      returnWrappingComponents(prefix) {
        if (prefix === "minimum" || prefix === undefined) {
          // minimum or entire array
          // These are points,
          // wrap inner dimension by both <point> and <xs>
          // don't wrap outer dimension (for entire array)
          return [["point", "xs"]];
        } else {
          // don't wrap minimumLocation(s) or minimumValues(s)
          return [];
        }
      },
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (["minimum", "minimumLocation", "minimumValue"].includes(arrayEntryPrefix)) {
          let pointInd = Number(varEnding) - 1;
          if (Number.isInteger(pointInd) && pointInd >= 0) {
            // if don't know array size, just guess that the entry is OK
            // It will get corrected once array size is known.
            // TODO: better to return empty array?
            if (!arraySize || pointInd < arraySize[0]) {
              if (arrayEntryPrefix === "minimum") {
                return [pointInd + ",0", pointInd + ",1"];
              } else if (arrayEntryPrefix === "minimumLocation") {
                return [pointInd + ",0"]
              } else {
                return [pointInd + ",1"]
              }
            } else {
              return []
            }
          } else {
            return [];
          }
        } else if (arrayEntryPrefix === "minimumLocations") {
          // can't guess at arrayKeys if don't have arraySize
          if (!arraySize || varEnding !== "") {
            return [];
          }
          // array of "i,0"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",0")
        } else if (arrayEntryPrefix === "minimumValues") {

          // can't guess at arrayKeys if don't have arraySize
          if (!arraySize || varEnding !== "") {
            return [];
          }
          // array of "i,1"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",1")
        } else {
          return [];
        }

      },
      arrayVarNameFromArrayKey(arrayKey) {
        let [ind1, ind2] = arrayKey.split(',');

        if (ind2 === "0") {
          return "minimumLocation" + (Number(ind1) + 1)
        } else {
          return "minimumValue" + (Number(ind1) + 1)
        }
      },
      returnDependencies: function () {
        return {
          symbolic: {
            dependencyType: "stateVariable",
            variableName: "symbolic",
          },
          f: {
            dependencyType: "stateVariable",
            variableName: "f",
          },
          xscale: {
            dependencyType: "stateVariable",
            variableName: "xscale"
          },
          functionChild: {
            dependencyType: "child",
            childLogicName: "atMostOneFunction",
            variableNames: ["minima"],
          }
        }
      },
      entireArrayDefinition: function ({ dependencyValues }) {

        // console.log(`entire array definition of minima`)
        // console.log(dependencyValues);

        // check for presence of functionChild
        // as derived classes may have changed the dependencies
        // to eliminate functionChildDependency
        if (dependencyValues.functionChild && dependencyValues.functionChild.length === 1) {

          return {
            newValues: {
              minima: dependencyValues.functionChild[0].stateValues.minima
            }
          }
        }

        // no function child

        if (dependencyValues.symbolic) {
          // haven't implemented minima for symbolic functions
          return {
            newValues: { minima: [] }
          }
        }

        let f = dependencyValues.f;

        // for now, look for minima in interval -100*xscale to 100*xscale
        // dividing interval into 1000 subintervals
        let minx = -100 * dependencyValues.xscale;
        let maxx = 100 * dependencyValues.xscale;
        let nIntervals = 1000;
        let dx = (maxx - minx) / nIntervals;

        let minimaList = [];
        let minimumAtPreviousRight = false;
        let fright = f(minx);
        for (let i = 0; i < nIntervals; i++) {
          let xleft = minx + i * dx;
          let xright = minx + (i + 1) * dx;
          let fleft = fright;
          fright = f(xright);

          if (Number.isNaN(fleft) || Number.isNaN(fright)) {
            continue;
          }

          let result = numerics.fminbr(f, [xleft, xright]);
          if (result.success !== true) {
            continue;
          }
          let x = result.x;
          let fx = result.fx;

          if (fleft < fx) {
            if (minimumAtPreviousRight) {
              if (Number.isFinite(fleft)) {
                minimaList.push([xleft, fleft]);
              }
            }
            minimumAtPreviousRight = false;
          } else if (fright < fx) {
            minimumAtPreviousRight = true;
          } else {
            minimumAtPreviousRight = false;

            // make sure it actually looks like a strict minimum of f(x)
            if (fx < fright && fx < fleft &&
              fx < f(x + result.tol) && fx < f(x - result.tol) &&
              Number.isFinite(fx)) {
              minimaList.push([x, fx]);
            }
          }
        }

        return { newValues: { minima: minimaList } }

      }
    }

    stateVariableDefinitions.maxima = {
      public: true,
      componentType: "number",
      isArray: true,
      entireArrayAtOnce: true,
      nDimensions: 2,
      entryPrefixes: ["maximum", "maximumLocations", "maximumLocation", "maximumValues", "maximumValue"],
      returnWrappingComponents(prefix) {
        if (prefix === "maximum" || prefix === undefined) {
          // maximum or entire array
          // These are points,
          // wrap inner dimension by both <point> and <xs>
          // don't wrap outer dimension (for entire array)
          return [["point", "xs"]];
        } else {
          // don't wrap maximumLocation(s) or maximumValues(s)
          return [];
        }
      },
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (["maximum", "maximumLocation", "maximumValue"].includes(arrayEntryPrefix)) {
          let pointInd = Number(varEnding) - 1;
          if (Number.isInteger(pointInd) && pointInd >= 0) {
            // if don't know array size, just guess that the entry is OK
            // It will get corrected once array size is known.
            // TODO: better to return empty array?
            if (!arraySize || pointInd < arraySize[0]) {
              if (arrayEntryPrefix === "maximum") {
                return [pointInd + ",0", pointInd + ",1"];
              } else if (arrayEntryPrefix === "maximumLocation") {
                return [pointInd + ",0"]
              } else {
                return [pointInd + ",1"]
              }
            } else {
              return []
            }
          } else {
            return [];
          }
        } else if (arrayEntryPrefix === "maximumLocations") {
          // can't guess at arrayKeys if don't have arraySize
          if (!arraySize || varEnding !== "") {
            return [];
          }
          // array of "i,0"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",0")
        } else if (arrayEntryPrefix === "maximumValues") {

          // can't guess at arrayKeys if don't have arraySize
          if (!arraySize || varEnding !== "") {
            return [];
          }
          // array of "i,1"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",1")
        } else {
          return [];
        }

      },
      arrayVarNameFromArrayKey(arrayKey) {
        let [ind1, ind2] = arrayKey.split(',');

        if (ind2 === "0") {
          return "maximumLocation" + (Number(ind1) + 1)
        } else {
          return "maximumValue" + (Number(ind1) + 1)
        }
      },
      returnDependencies: function () {
        return {
          symbolic: {
            dependencyType: "stateVariable",
            variableName: "symbolic",
          },
          f: {
            dependencyType: "stateVariable",
            variableName: "f",
          },
          xscale: {
            dependencyType: "stateVariable",
            variableName: "xscale"
          },
          functionChild: {
            dependencyType: "child",
            childLogicName: "atMostOneFunction",
            variableNames: ["maxima"],
          }
        }
      },
      entireArrayDefinition: function ({ dependencyValues }) {

        // check for presence of functionChild
        // as derived classes may have changed the dependencies
        // to eliminate functionChildDependency
        if (dependencyValues.functionChild && dependencyValues.functionChild.length === 1) {
          return {
            newValues: {
              maxima: dependencyValues.functionChild[0].stateValues.maxima
            }
          }
        }

        // no function child

        if (dependencyValues.symbolic) {
          // haven't implemented maxima for symbolic functions
          return {
            newValues: { maxima: [] }
          }
        }

        let f = (x) => -dependencyValues.f(x);

        // for now, look for maxima in interval -100*xscale to 100*xscale
        // dividing interval into 1000 subintervals
        let minx = -100 * dependencyValues.xscale;
        let maxx = 100 * dependencyValues.xscale;
        let nIntervals = 1000;
        let dx = (maxx - minx) / nIntervals;

        let maximaList = [];
        let maximumAtPreviousRight = false;
        let fright = f(minx);
        for (let i = 0; i < nIntervals; i++) {
          let xleft = minx + i * dx;
          let xright = minx + (i + 1) * dx;
          let fleft = fright;
          fright = f(xright);

          if (Number.isNaN(fleft) || Number.isNaN(fright)) {
            continue;
          }

          let result = numerics.fminbr(f, [xleft, xright]);
          if (result.success !== true) {
            continue;
          }
          let x = result.x;
          let fx = result.fx;

          if (fleft < fx) {
            if (maximumAtPreviousRight) {
              if (Number.isFinite(fleft)) {
                maximaList.push([xleft, -fleft]);
              }
            }
            maximumAtPreviousRight = false;
          } else if (fright < fx) {
            maximumAtPreviousRight = true;
          } else {
            maximumAtPreviousRight = false;

            // make sure it actually looks like a strict maximum of f(x)
            if (fx < fright && fx < fleft &&
              fx < f(x + result.tol) && fx < f(x - result.tol) &&
              Number.isFinite(fx)) {
              maximaList.push([x, -fx]);
            }
          }
        }

        return { newValues: { maxima: maximaList } }

      }
    }


    // we make function child be a state variable
    // as we need a state variable to determine other dependencies
    // using stateVariablesDeterminingDependencies
    stateVariableDefinitions.functionChild = {
      returnDependencies: () => ({
        functionChild: {
          dependencyType: "child",
          childLogicName: "atMostOneFunction"
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.functionChild.length === 1) {
          return { newValues: { functionChild: dependencyValues.functionChild[0] } }
        } else {
          return { newValues: { functionChild: null } }
        }
      }
    }


    stateVariableDefinitions.extrema = {
      public: true,
      componentType: "number",
      isArray: true,
      entireArrayAtOnce: true,
      nDimensions: 2,
      entryPrefixes: ["extremum", "extremumLocations", "extremumLocation", "extremumValues", "extremumValue"],
      returnWrappingComponents(prefix) {
        if (prefix === "extremum" || prefix === undefined) {
          // extremum or entire array
          // These are points,
          // wrap inner dimension by both <point> and <xs>
          // don't wrap outer dimension (for entire array)
          return [["point", "xs"]];
        } else {
          // don't wrap extremumLocation(s) or extremumValues(s)
          return [];
        }
      },
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (["extremum", "extremumLocation", "extremumValue"].includes(arrayEntryPrefix)) {
          let pointInd = Number(varEnding) - 1;
          if (Number.isInteger(pointInd) && pointInd >= 0) {
            // if don't know array size, just guess that the entry is OK
            // It will get corrected once array size is known.
            // TODO: better to return empty array?
            if (!arraySize || pointInd < arraySize[0]) {
              if (arrayEntryPrefix === "extremum") {
                return [pointInd + ",0", pointInd + ",1"];
              } else if (arrayEntryPrefix === "extremumLocation") {
                return [pointInd + ",0"]
              } else {
                return [pointInd + ",1"]
              }
            } else {
              return []
            }
          } else {
            return [];
          }
        } else if (arrayEntryPrefix === "extremumLocations") {
          // can't guess at arrayKeys if don't have arraySize
          if (!arraySize || varEnding !== "") {
            return [];
          }
          // array of "i,0"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",0")
        } else if (arrayEntryPrefix === "extremumValues") {

          // can't guess at arrayKeys if don't have arraySize
          if (!arraySize || varEnding !== "") {
            return [];
          }
          // array of "i,1"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",1")
        } else {
          return [];
        }

      },
      arrayVarNameFromArrayKey(arrayKey) {
        let [ind1, ind2] = arrayKey.split(',');

        if (ind2 === "0") {
          return "extremumLocation" + (Number(ind1) + 1)
        } else {
          return "extremumValue" + (Number(ind1) + 1)
        }
      },
      returnDependencies: function () {
        return {
          minima: {
            dependencyType: "stateVariable",
            variableName: "minima"
          },
          maxima: {
            dependencyType: "stateVariable",
            variableName: "maxima"
          }
        }
      },
      entireArrayDefinition: function ({ dependencyValues }) {
        // console.log(`entire array definition of extrema of function`)
        // console.log(dependencyValues)
        let extrema = [...dependencyValues.minima, ...dependencyValues.maxima]
          .sort((a, b) => a[0] - b[0]);

        return { newValues: { extrema } }

      }
    }


    stateVariableDefinitions.numberMinima = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        minima: {
          dependencyType: "stateVariable",
          variableName: "minima"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            numberMinima: dependencyValues.minima.length,
          },
          checkForActualChange: { numberMinima: true }
        }
      }
    }


    stateVariableDefinitions.numberMaxima = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        maxima: {
          dependencyType: "stateVariable",
          variableName: "maxima"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            numberMaxima: dependencyValues.maxima.length,
          },
          checkForActualChange: { numberMaxima: true }
        }
      }
    }


    stateVariableDefinitions.numberExtrema = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        extrema: {
          dependencyType: "stateVariable",
          variableName: "extrema"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            numberExtrema: dependencyValues.extrema.length,
          },
          checkForActualChange: { numberExtrema: true }
        }
      }
    }

    stateVariableDefinitions.returnDerivativesOfF = {
      returnDependencies: () => ({
        functionChild: {
          dependencyType: "child",
          childLogicName: "atMostOneFunction",
          variableNames: ["returnDerivativesOfF"],
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.functionChild.length === 1 &&
          dependencyValues.functionChild[0].stateValues.returnDerivativesOfF
        ) {
          return {
            newValues: { returnDerivativesOfF: dependencyValues.functionChild[0].stateValues.returnDerivativesOfF }
          }
        } else {
          return { newValues: { returnDerivativesOfF: null } }
        }
      }

    }

    return stateVariableDefinitions;

  }

  adapters = [{
    stateVariable: "f",
    componentType: "functioncurve"
  },
  {
    stateVariable: "formula",
    componentType: "math"
  }];

}