import Function from "./Function";
import subsets, {
  buildSubsetFromMathExpression,
  mathExpressionFromSubsetValue,
} from "../utils/subset-of-reals";
import me from "math-expressions";
import { returnPiecewiseNumericalFunctionFromChildren } from "../utils/function";
import { roundForDisplay } from "../utils/math";
import { returnRoundingAttributeComponentShadowing } from "../utils/rounding";
import {
  finalizeGlobalMinimum,
  find_local_global_minima,
} from "../utils/extrema";

export default class PiecewiseFunction extends Function {
  static componentType = "piecewiseFunction";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    delete attributes.numInputs;
    delete attributes.numOutputs;
    delete attributes.minima;
    delete attributes.maxima;
    delete attributes.extrema;
    delete attributes.through;
    delete attributes.throughSlope;

    return attributes;
  }

  static returnSugarInstructions() {
    return [];
  }

  static returnChildGroups() {
    return [
      {
        group: "functions",
        componentTypes: ["function"],
      },
      {
        group: "labels",
        componentTypes: ["label"],
      },
    ];
  }

  static returnStateVariableDefinitions({ numerics }) {
    let stateVariableDefinitions = super.returnStateVariableDefinitions({
      numerics,
    });

    delete stateVariableDefinitions.isInterpolatedFunction;

    stateVariableDefinitions.numInputs = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({}),
      definition() {
        return { setValue: { numInputs: 1 } };
      },
    };

    stateVariableDefinitions.numOutputs = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        functionChildren: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["numOutputs"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.functionChildren.length > 0) {
          return {
            setValue: {
              numOutputs:
                dependencyValues.functionChildren[0].stateValues.numOutputs,
            },
          };
        } else {
          return { setValue: { numOutputs: 1 } };
        }
      },
    };

    stateVariableDefinitions.numericalDomainsOfChildren = {
      returnDependencies: () => ({
        functionChildren: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["domain"],
        },
      }),
      definition({ dependencyValues }) {
        let numericalDomainsOfChildren = [];

        // We can compute the domain of a function child only if it is real-valued.
        // Otherwise, we assume the domain is all real numbers
        for (let [
          ind,
          functionChild,
        ] of dependencyValues.functionChildren.entries()) {
          let fDomain = functionChild.stateValues.domain?.[0];
          if (fDomain) {
            // if fDomain exists, then it must be an interval, i.e., its tree must be of the form
            // ["interval", ["tuple", 1,2], ["tuple", true, false]]
            // where the above represents the interval [1,2)

            let intervalMin = me
              .fromAst(fDomain.tree[1][1])
              .evaluate_to_constant();
            let intervalMax = me
              .fromAst(fDomain.tree[1][2])
              .evaluate_to_constant();
            let intervalMinIsClosed = fDomain.tree[2][1];
            let intervalMaxIsClosed = fDomain.tree[2][2];

            if (!Number.isFinite(intervalMin) && intervalMin !== -Infinity) {
              numericalDomainsOfChildren.push(null);
            } else if (
              !Number.isFinite(intervalMax) &&
              intervalMax !== Infinity
            ) {
              numericalDomainsOfChildren.push(null);
            } else if (intervalMax < intervalMin) {
              numericalDomainsOfChildren.push(null);
            } else if (
              intervalMax === intervalMin &&
              !(intervalMinIsClosed && intervalMaxIsClosed)
            ) {
              numericalDomainsOfChildren.push(null);
            } else {
              numericalDomainsOfChildren.push([
                [intervalMin, intervalMax],
                [intervalMinIsClosed, intervalMaxIsClosed],
              ]);
            }
          } else {
            numericalDomainsOfChildren.push([
              [-Infinity, Infinity],
              [false, false],
            ]);
          }
        }
        return { setValue: { numericalDomainsOfChildren } };
      },
    };

    stateVariableDefinitions.domain = {
      returnDependencies: () => ({
        domainAttr: {
          dependencyType: "attributeComponent",
          attributeName: "domain",
          variableNames: ["intervals"],
        },
        numericalDomainsOfChildren: {
          dependencyType: "stateVariable",
          variableName: "numericalDomainsOfChildren",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.domainAttr !== null) {
          let domain = dependencyValues.domainAttr.stateValues.intervals[0];

          if (
            domain &&
            Array.isArray(domain.tree) &&
            domain.tree[0] === "interval"
          ) {
            return { setValue: { domain: [domain] } };
          } else {
            return { setValue: { domain: null } };
          }
        }

        let foundChildDomain = false;
        let minD = Infinity;
        let maxD = -Infinity;
        let minDIsClosed = false;
        let maxDIsClosed = false;

        if (dependencyValues.numericalDomainsOfChildren.length > 0) {
          // Since a domain currently has to be an interval, any missing intervals are filled in
          for (let childDomain of dependencyValues.numericalDomainsOfChildren) {
            if (childDomain) {
              foundChildDomain = true;

              let intervalMin = childDomain[0][0];
              let intervalMax = childDomain[0][1];

              let intervalMinIsClosed = childDomain[1][0];
              let intervalMaxIsClosed = childDomain[1][1];

              if (intervalMin < minD) {
                minD = intervalMin;
                minDIsClosed = intervalMinIsClosed;
              } else if (intervalMin === minD && intervalMinIsClosed) {
                minDIsClosed = true;
              }

              if (intervalMax > maxD) {
                maxD = intervalMax;
                maxDIsClosed = intervalMaxIsClosed;
              } else if (intervalMax === maxD && intervalMaxIsClosed) {
                maxDIsClosed = true;
              }
            }
          }
        }

        if (foundChildDomain) {
          let domain = [
            me.fromAst([
              "interval",
              ["tuple", minD, maxD],
              ["tuple", minDIsClosed, maxDIsClosed],
            ]),
          ];
          return { setValue: { domain } };
        } else {
          return { setValue: { domain: null } };
        }
      },
    };

    delete stateVariableDefinitions.unnormalizedFormula;

    // until we build in support for piecewise functions into math-expressions,
    // we cannot represent the formula in a math component
    stateVariableDefinitions.formula = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { formula: me.fromAst("\uff3f") } }),
    };

    delete stateVariableDefinitions.numPrescribedPoints;
    delete stateVariableDefinitions.prescribedPoints;
    delete stateVariableDefinitions.prescribedMinima;
    delete stateVariableDefinitions.prescribedMaxima;
    delete stateVariableDefinitions.prescribedExtrema;
    delete stateVariableDefinitions.interpolationPoints;
    delete stateVariableDefinitions.xs;
    delete stateVariableDefinitions.mathChildName;
    delete stateVariableDefinitions.mathChildCreatedBySugar;
    delete stateVariableDefinitions.haveNaNChildToReevaluate;

    // until we build in support for piecewise functions into math-expressions,
    // we cannot represent the symbolicfs
    stateVariableDefinitions.symbolicfs = {
      isArray: true,
      entryPrefixes: ["symbolicf"],
      returnArraySizeDependencies: () => ({
        numOutputs: {
          dependencyType: "stateVariable",
          variableName: "numOutputs",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numOutputs];
      },
      returnArrayDependenciesByKey() {
        return {};
      },
      arrayDefinitionByKey: function ({ arrayKeys }) {
        let symbolicfs = {};
        for (let arrayKey of arrayKeys) {
          symbolicfs[arrayKey] = (x) => me.fromAst("\uff3f");
        }
        return {
          setValue: { symbolicfs },
        };
      },
    };

    stateVariableDefinitions.numericalfs = {
      isArray: true,
      entryPrefixes: ["numericalf"],
      returnArraySizeDependencies: () => ({
        numOutputs: {
          dependencyType: "stateVariable",
          variableName: "numOutputs",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numOutputs];
      },
      returnArrayDependenciesByKey() {
        return {
          globalDependencies: {
            functionChildren: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["numericalfs"],
            },
            numericalDomainsOfChildren: {
              dependencyType: "stateVariable",
              variableName: "numericalDomainsOfChildren",
            },
            numericalfShadow: {
              dependencyType: "stateVariable",
              variableName: "numericalfShadow",
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain",
            },
          },
        };
      },
      arrayDefinitionByKey: function ({ globalDependencyValues, arrayKeys }) {
        if (globalDependencyValues.functionChildren.length > 0) {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            let numericalFsOfChildren = globalDependencyValues.functionChildren
              .filter(
                (_, i) => globalDependencyValues.numericalDomainsOfChildren[i],
              )
              .map(
                (functionChild) =>
                  functionChild.stateValues.numericalfs[arrayKey],
              );

            let numericalDomainsOfChildren =
              globalDependencyValues.numericalDomainsOfChildren.filter(
                (x) => x,
              );
            numericalfs[arrayKey] =
              returnPiecewiseNumericalFunctionFromChildren({
                numericalFsOfChildren,
                numericalDomainsOfChildren,
                domain: globalDependencyValues.domain,
                component: arrayKey,
              });
          }
          return {
            setValue: { numericalfs },
          };
        } else if (globalDependencyValues.numericalfShadow) {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            if (arrayKey === "0") {
              numericalfs[arrayKey] = globalDependencyValues.numericalfShadow;
            } else {
              numericalfs[arrayKey] = () => NaN;
            }
          }
          return {
            setValue: { numericalfs },
          };
        } else if (globalDependencyValues.symbolicfShadow) {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            if (arrayKey === "0") {
              numericalfs[arrayKey] = function (x) {
                let val = globalDependencyValues
                  .symbolicfShadow(me.fromAst(x))
                  .evaluate_to_constant();
                return val;
              };
            } else {
              numericalfs[arrayKey] = () => NaN;
            }
          }
          return {
            setValue: { numericalfs },
          };
        } else {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            numericalfs[arrayKey] = () => NaN;
          }
          return {
            setValue: { numericalfs },
          };
        }
      },
    };

    stateVariableDefinitions.fDefinitions = {
      isArray: true,
      entryPrefixes: ["fDefinition"],
      returnArraySizeDependencies: () => ({
        numOutputs: {
          dependencyType: "stateVariable",
          variableName: "numOutputs",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numOutputs];
      },
      returnArrayDependenciesByKey({ stateValues }) {
        return {
          globalDependencies: {
            functionChildren: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["fDefinitions"],
            },
            numericalDomainsOfChildren: {
              dependencyType: "stateVariable",
              variableName: "numericalDomainsOfChildren",
            },
            numericalfShadow: {
              dependencyType: "stateVariable",
              variableName: "numericalfShadow",
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain",
            },
          },
        };
      },
      arrayDefinitionByKey: function ({
        globalDependencyValues,
        usedDefault,
        arrayKeys,
      }) {
        if (globalDependencyValues.functionChildren.length > 0) {
          let fDefinitions = {};
          for (let arrayKey of arrayKeys) {
            let fDefinitionsOfChildren = globalDependencyValues.functionChildren
              .filter(
                (_, i) => globalDependencyValues.numericalDomainsOfChildren[i],
              )
              .map(
                (functionChild) =>
                  functionChild.stateValues.fDefinitions[arrayKey],
              );

            let numericalDomainsOfChildren =
              globalDependencyValues.numericalDomainsOfChildren.filter(
                (x) => x,
              );

            fDefinitions[arrayKey] = {
              functionType: "piecewise",
              fDefinitionsOfChildren,
              numericalDomainsOfChildren,
              domain: globalDependencyValues.domain,
              component: arrayKey,
            };
          }
          return {
            setValue: { fDefinitions },
          };
        } else if (globalDependencyValues.numericalfShadow) {
          // TODO: ??
          let fDefinitions = {};
          for (let arrayKey of arrayKeys) {
            fDefinitions[arrayKey] = {};
          }
          return {
            setValue: { fDefinitions },
          };
        } else {
          let fDefinitions = {};
          for (let arrayKey of arrayKeys) {
            fDefinitions[arrayKey] = {};
          }
          return {
            setValue: { fDefinitions },
          };
        }
      },
    };

    stateVariableDefinitions.latex = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "latex",
      },
      returnDependencies: () => ({
        variable: {
          dependencyType: "stateVariable",
          variableName: "variable",
        },
        functionChildren: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["formula", "variable", "domain"],
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits",
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals",
        },
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero",
        },
        padZeros: {
          dependencyType: "stateVariable",
          variableName: "padZeros",
        },
      }),
      definition: function ({ dependencyValues }) {
        let functionVariable = dependencyValues.variable;

        let toLatexParams = {};
        if (dependencyValues.padZeros) {
          if (Number.isFinite(dependencyValues.displayDecimals)) {
            toLatexParams.padToDecimals = dependencyValues.displayDecimals;
          }
          if (dependencyValues.displayDigits >= 1) {
            toLatexParams.padToDigits = dependencyValues.displayDigits;
          }
        }

        let me_infinity = me.fromAst(Infinity);
        let me_minus_infinity = me.fromAst(-Infinity);

        let childrenLatex = [];

        for (let [
          ind,
          functionChild,
        ] of dependencyValues.functionChildren.entries()) {
          let formula =
            functionChild.stateValues.formula.subscripts_to_strings();
          let variable =
            functionChild.stateValues.variable.subscripts_to_strings();

          formula = formula
            .substitute({ [variable]: functionVariable })
            .strings_to_subscripts();

          let formulaLatex = roundForDisplay({
            value: formula,
            dependencyValues,
          }).toLatex(toLatexParams);

          let fDomain = functionChild.stateValues.domain?.[0];
          let intervalMin, intervalMax;
          let intervalMinIsClosed, intervalMaxIsClosed;

          if (fDomain) {
            // if fDomain exists, then it must be an interval, i.e., its tree must be of the form
            // ["interval", ["tuple", 1,2], ["tuple", true, false]]
            // where the above represents the interval [1,2)

            intervalMin = me.fromAst(fDomain.tree[1][1]).simplify();
            intervalMax = me.fromAst(fDomain.tree[1][2]).simplify();
            intervalMinIsClosed = fDomain.tree[2][1];
            intervalMaxIsClosed = fDomain.tree[2][2];
          } else {
            intervalMin = me_minus_infinity;
            intervalMax = me_infinity;
          }

          if (intervalMin.equals(me_minus_infinity)) {
            if (intervalMax.equals(me_infinity)) {
              if (ind === 0) {
                // first child has no conditions, so just return latex for first child
                return { setValue: { latex: formulaLatex } };
              }

              childrenLatex.push(`${formulaLatex} & \\text{otherwise}`);
              break;
            } else {
              // only maxx
              let operator = intervalMaxIsClosed ? "\\le" : "<";
              let maxxLatex = roundForDisplay({
                value: intervalMax,
                dependencyValues,
              }).toLatex(toLatexParams);
              childrenLatex.push(
                `${formulaLatex} & \\text{if } ${functionVariable} ${operator} ${maxxLatex}`,
              );
            }
          } else if (intervalMax.equals(me_infinity)) {
            // only minx
            let operator = intervalMinIsClosed ? "\\ge" : ">";

            let minxLatex = roundForDisplay({
              value: intervalMin,
              dependencyValues,
            }).toLatex(toLatexParams);
            childrenLatex.push(
              `${formulaLatex} & \\text{if } ${functionVariable} ${operator} ${minxLatex}`,
            );
          } else if (
            intervalMax.equals(intervalMin) &&
            intervalMinIsClosed &&
            intervalMaxIsClosed
          ) {
            // single point
            let maxxLatex = roundForDisplay({
              value: intervalMax,
              dependencyValues,
            }).toLatex(toLatexParams);
            childrenLatex.push(
              `${formulaLatex} & \\text{if } ${functionVariable} = ${maxxLatex}`,
            );
          } else {
            // unequal minx and maxx
            let domainString =
              "{" +
              roundForDisplay({
                value: intervalMin,
                dependencyValues,
              }).toLatex(toLatexParams) +
              "}";
            if (intervalMinIsClosed) {
              domainString += " \\le ";
            } else {
              domainString += " < ";
            }
            domainString += functionVariable;
            if (intervalMaxIsClosed) {
              domainString += " \\le ";
            } else {
              domainString += " < ";
            }
            domainString += roundForDisplay({
              value: intervalMax,
              dependencyValues,
            }).toLatex(toLatexParams);

            childrenLatex.push(`${formulaLatex} & \\text{if } ${domainString}`);
          }
        }

        let latex = childrenLatex.join("\\\\\n    ");

        latex = `\\begin{cases}\n    ${latex}\n\\end{cases}`;

        return { setValue: { latex } };
      },
    };

    stateVariableDefinitions.allMinima = {
      additionalStateVariablesDefined: [
        "globalMinimumOption",
        "globalInfimumOption",
      ],
      returnDependencies() {
        return {
          functionChildren: {
            dependencyType: "child",
            childGroups: ["functions"],
            variableNames: [
              "domain",
              "xscale",
              "isInterpolatedFunction",
              "xs",
              "coeffs",
              "numericalf",
              "formula",
              "variables",
              "functionChildInfoToRecalculateExtrema",
              "numInputs",
              "numOutputs",
            ],
          },
          domain: {
            dependencyType: "stateVariable",
            variableName: "domain",
          },
          numericalDomainsOfChildren: {
            dependencyType: "stateVariable",
            variableName: "numericalDomainsOfChildren",
          },
          numericalf: {
            dependencyType: "stateVariable",
            variableName: "numericalf",
          },
        };
      },
      definition: function ({ dependencyValues }) {
        let { minimaList, globalMinimum, globalInfimum } =
          find_minima_of_piecewise({
            functionChildren: dependencyValues.functionChildren,
            domain: dependencyValues.domain,
            numericalDomainsOfChildren:
              dependencyValues.numericalDomainsOfChildren,
            numericalf: dependencyValues.numericalf,
            numerics,
          });

        return {
          setValue: {
            allMinima: minimaList,
            globalMinimumOption: globalMinimum,
            globalInfimumOption: globalInfimum,
          },
        };
      },
    };

    stateVariableDefinitions.allMaxima = {
      additionalStateVariablesDefined: [
        "globalMaximumOption",
        "globalSupremumOption",
      ],
      returnDependencies() {
        return {
          functionChildren: {
            dependencyType: "child",
            childGroups: ["functions"],
            variableNames: [
              "domain",
              "xscale",
              "isInterpolatedFunction",
              "xs",
              "coeffs",
              "numericalf",
              "formula",
              "variables",
              "functionChildInfoToRecalculateExtrema",
              "numInputs",
              "numOutputs",
            ],
          },
          domain: {
            dependencyType: "stateVariable",
            variableName: "domain",
          },
          numericalDomainsOfChildren: {
            dependencyType: "stateVariable",
            variableName: "numericalDomainsOfChildren",
          },
          numericalf: {
            dependencyType: "stateVariable",
            variableName: "numericalf",
          },
        };
      },
      definition: function ({ dependencyValues }) {
        let flippedFunctionChildren = dependencyValues.functionChildren.map(
          (child) => {
            let flippedChildStateValues = flip_function_children_stateValues(
              child.stateValues,
            );
            return { stateValues: flippedChildStateValues };
          },
        );

        let numericalfFlip = (...args) =>
          -1 * dependencyValues.numericalf(...args);

        let { minimaList, globalMinimum, globalInfimum } =
          find_minima_of_piecewise({
            functionChildren: flippedFunctionChildren,
            domain: dependencyValues.domain,
            numericalDomainsOfChildren:
              dependencyValues.numericalDomainsOfChildren,
            numericalf: numericalfFlip,
            numerics,
          });

        let maximaList = minimaList.map((pt) => [pt[0], -pt[1]]);

        let globalMaximum = null,
          globalSupremum = null;

        if (globalMinimum) {
          globalMaximum = [globalMinimum[0], -1 * globalMinimum[1]];
        }
        if (globalInfimum) {
          globalSupremum = [globalInfimum[0], -1 * globalInfimum[1]];
        }

        return {
          setValue: {
            allMaxima: maximaList,
            globalMaximumOption: globalMaximum,
            globalSupremumOption: globalSupremum,
          },
        };
      },
    };

    stateVariableDefinitions.returnNumericalDerivatives = {
      returnDependencies: () => ({}),
      definition: function () {
        return { setValue: { returnNumericalDerivatives: null } };
      },
    };

    stateVariableDefinitions.numericalDerivativesDefinition = {
      returnDependencies: () => ({}),
      definition: function () {
        return { setValue: { numericalDerivativesDefinition: {} } };
      },
    };

    return stateVariableDefinitions;
  }
}
function find_minima_of_piecewise({
  functionChildren,
  domain,
  numericalDomainsOfChildren,
  numericalf,
  numerics,
}) {
  let domainUnused;

  if (domain) {
    domainUnused = buildSubsetFromMathExpression(domain[0]);
  } else {
    domainUnused = new subsets.RealLine();
  }

  let globalMinimum = [-Infinity, Infinity];
  let globalInfimum = [-Infinity, Infinity];

  let eps = numerics.eps;

  let minimaList = [];

  let f = numericalf;

  let endpointsToManuallyCheck = [];

  for (let [ind, childDomain] of numericalDomainsOfChildren.entries()) {
    if (!childDomain) {
      continue;
    }

    let childDomainMathExpr = me.fromAst([
      "interval",
      ["tuple", ...childDomain[0]],
      ["tuple", ...childDomain[1]],
    ]);

    let childDomainSubset = buildSubsetFromMathExpression(childDomainMathExpr);

    let childDomainToConsider = mathExpressionFromSubsetValue({
      subsetValue: childDomainSubset.intersect(domainUnused),
    });
    domainUnused = domainUnused.setMinus(childDomainSubset);

    // childDomainToConsider could be an empty set, real line, singleton set, interval,
    // or union of singleton sets and intervals
    let childDomainPieces = [];
    if (childDomainToConsider.tree[0] === "union") {
      childDomainPieces = childDomainToConsider.tree.slice(1);
    } else {
      childDomainPieces = [childDomainToConsider.tree];
    }

    for (let domainPiece of childDomainPieces) {
      let thisDomain;
      if (domainPiece === "∅") {
        continue;
      } else if (domainPiece === "R") {
        thisDomain = null;
      } else if (domainPiece[0] === "set") {
        // have a singleton piece
        endpointsToManuallyCheck.push(domainPiece[1]);
        continue;
      } else {
        // have interval
        thisDomain = domainPiece;
      }

      let args = {
        ...functionChildren[ind].stateValues,
      };
      args.domain = [me.fromAst(thisDomain)];
      args.numerics = numerics;

      let subResults = find_local_global_minima(args);

      let childMinima = subResults.localMinima;

      if (thisDomain) {
        // thisDomain is an interval
        // We will check endpoints of local minima manually
        // (as their nature depends on more than one piece).
        // Remove them from list of local minima and add to list to check
        let minx = me.fromAst(thisDomain[1][1]).evaluate_to_constant();
        if (Number.isFinite(minx)) {
          endpointsToManuallyCheck.push(minx);
          childMinima = childMinima.filter(
            (minpair) => minpair[0] > minx + eps,
          );
        }

        let maxx = me.fromAst(thisDomain[1][2]).evaluate_to_constant();
        if (Number.isFinite(maxx)) {
          endpointsToManuallyCheck.push(maxx);
          childMinima = childMinima.filter(
            (minpair) => minpair[0] < maxx - eps,
          );
        }
      }

      minimaList.push(...childMinima);

      if (subResults.globalMinimum?.[1] < globalMinimum[1]) {
        globalMinimum = subResults.globalMinimum;
      }

      if (subResults.globalInfimum?.[1] < globalInfimum[1]) {
        globalInfimum = subResults.globalInfimum;
      }
    }
  }

  // check endpoints
  for (let ept of endpointsToManuallyCheck) {
    let x = me.fromAst(ept).evaluate_to_constant();

    if (Number.isFinite(x)) {
      let fx = f(x);
      if (fx < f(x - eps) && fx < f(x + eps)) {
        if (
          minimaList.every(
            (minpair) => minpair[0] < x - eps || minpair[0] > x + eps,
          )
        ) {
          minimaList.push([x, fx]);
        }
      }

      if (fx < globalMinimum[1]) {
        globalMinimum = [x, fx];
      }
      if (fx < globalInfimum[1]) {
        globalInfimum = [x, fx];
      }
    }
  }

  minimaList = minimaList.sort((a, b) => a[0] - b[0]);

  ({ globalMinimum, globalInfimum } = finalizeGlobalMinimum({
    globalMinimum,
    globalInfimum,
  }));
  return { minimaList, globalMinimum, globalInfimum };
}

function flip_function_children_stateValues(stateValues) {
  let flippedStateValues = { ...stateValues };

  flippedStateValues.numericalf = (...args) =>
    -1 * stateValues.numericalf(...args);

  if (stateValues.isInterpolatedFunction) {
    flippedStateValues.coeffsFlip = stateValues.coeffs.map((cs) =>
      cs.map((v) => -v),
    );
  } else if (stateValues.functionChildInfoToRecalculateExtrema) {
    flippedStateValues.functionChildInfoToRecalculateExtrema =
      flip_function_children_stateValues(
        stateValues.functionChildInfoToRecalculateExtrema,
      );
  } else {
    flippedStateValues.formula = stateValues.formula.context.fromAst([
      "-",
      stateValues.formula.tree,
    ]);
  }

  return flippedStateValues;
}
