import Function from "./Function";
import subsets, {
  mathExpressionFromSubsetValue,
} from "../utils/subset-of-reals";
import me from "math-expressions";
import { returnPiecewiseNumericalFunctionFromChildren } from "../utils/function";
import { roundForDisplay } from "../utils/math";
import { returnRoundingAttributeComponentShadowing } from "../utils/rounding";
import {
  find_maxima_of_piecewise,
  find_minima_of_piecewise,
} from "../utils/extrema";
import { find_effective_domains_piecewise_children } from "../utils/domain";

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

    stateVariableDefinitions.isPiecewiseFunction = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { isPiecewiseFunction: true } }),
    };

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
      additionalStateVariablesDefined: ["childrenWithNonNumericDomains"],
      returnDependencies: () => ({
        functionChildren: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["domain"],
        },
      }),
      definition({ dependencyValues }) {
        let numericalDomainsOfChildren = [];
        let childrenWithNonNumericDomains = [];

        // We can compute the domain of a function child only if it is real-valued.
        // Otherwise, we assume the domain is all real numbers
        for (let functionChild of dependencyValues.functionChildren) {
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

            childrenWithNonNumericDomains.push(
              Number.isNaN(intervalMin) || Number.isNaN(intervalMax),
            );

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
        return {
          setValue: {
            numericalDomainsOfChildren,
            childrenWithNonNumericDomains,
          },
        };
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
      returnArrayDependenciesByKey() {
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
        numericalDomainsOfChildren: {
          dependencyType: "stateVariable",
          variableName: "numericalDomainsOfChildren",
        },
        childrenWithNonNumericDomains: {
          dependencyType: "stateVariable",
          variableName: "childrenWithNonNumericDomains",
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

        // Latex display ignores domain of the function itself
        // (to be consistent with other cases of displaying latex of a function)
        let effectiveDomainsOfChildrenIgnoringDomain =
          find_effective_domains_piecewise_children({
            numericalDomainsOfChildren:
              dependencyValues.numericalDomainsOfChildren,
          });

        let me_infinity = me.fromAst(Infinity);
        let me_minus_infinity = me.fromAst(-Infinity);

        let formulaLatexByLine = [];
        let subsetDomainsByLine = [];
        let nonNumericConditionsByLine = [];
        let lineContainsNonNumeric = [];
        let lastNonNumeric = -1;

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

          let conditionLatex;

          let fDomain = functionChild.stateValues.domain?.[0];

          let haveNonNumeric = false;

          if (dependencyValues.childrenWithNonNumericDomains[ind]) {
            haveNonNumeric = true;

            // if fDomain exists, then it must be an interval, i.e., its tree must be of the form
            // ["interval", ["tuple", 1,2], ["tuple", true, false]]
            // where the above represents the interval [1,2)

            let intervalMin = me.fromAst(fDomain.tree[1][1]).simplify();
            let intervalMax = me.fromAst(fDomain.tree[1][2]).simplify();
            let intervalMinIsClosed = fDomain.tree[2][1];
            let intervalMaxIsClosed = fDomain.tree[2][2];

            if (intervalMin.equals(me_minus_infinity)) {
              // only maxx
              let operator = intervalMaxIsClosed ? "\\le" : "<";
              let maxxLatex = roundForDisplay({
                value: intervalMax,
                dependencyValues,
              }).toLatex(toLatexParams);
              conditionLatex = `${functionVariable} ${operator} ${maxxLatex}`;
            } else if (intervalMax.equals(me_infinity)) {
              // only minx
              let operator = intervalMinIsClosed ? "\\ge" : ">";

              let minxLatex = roundForDisplay({
                value: intervalMin,
                dependencyValues,
              }).toLatex(toLatexParams);
              conditionLatex = `${functionVariable} ${operator} ${minxLatex}`;
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
              conditionLatex = `${functionVariable} = ${maxxLatex}`;
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

              conditionLatex = domainString;
            }
          } else {
            // child started with a numerical domain

            if (effectiveDomainsOfChildrenIgnoringDomain[ind].isEmpty()) {
              continue;
            }

            if (
              !fDomain ||
              (fDomain.tree[1][1] === -Infinity &&
                fDomain.tree[1][2] === Infinity)
            ) {
              if (formulaLatexByLine.length === 0) {
                // first line has no conditions, so just return latex for first line
                return { setValue: { latex: formulaLatex } };
              }

              let indexOfFormula = formulaLatexByLine.lastIndexOf(formulaLatex);

              if (
                indexOfFormula > lastNonNumeric ||
                indexOfFormula === formulaLatexByLine.length - 1
              ) {
                formulaLatexByLine.splice(indexOfFormula, 1);
                nonNumericConditionsByLine.splice(indexOfFormula, 1);
                subsetDomainsByLine.splice(indexOfFormula, 1);
                lineContainsNonNumeric.splice(indexOfFormula, 1);
              }

              formulaLatexByLine.push(formulaLatex);
              subsetDomainsByLine.push([]);
              nonNumericConditionsByLine.push(["\\text{otherwise}"]);

              break;
            }

            conditionLatex = latexFromSubsetDomain({
              subsetDomain: effectiveDomainsOfChildrenIgnoringDomain[ind],
              dependencyValues,
              functionVariable,
              toLatexParams,
            });
          }

          let indexOfFormula = formulaLatexByLine.lastIndexOf(formulaLatex);
          let canCombine = false;

          if (indexOfFormula !== -1 && indexOfFormula >= lastNonNumeric) {
            canCombine = true;
            if (
              haveNonNumeric &&
              indexOfFormula !== formulaLatexByLine.length - 1
            ) {
              // non numeric can only combine with previous
              canCombine = false;
            }
          }

          let indexUsed;
          if (canCombine) {
            indexUsed = indexOfFormula;
          } else {
            formulaLatexByLine.push(formulaLatex);
            subsetDomainsByLine.push([]);
            nonNumericConditionsByLine.push([]);
            indexUsed = formulaLatexByLine.length - 1;
          }

          if (haveNonNumeric) {
            lastNonNumeric = formulaLatexByLine.length - 1;
            lineContainsNonNumeric[indexUsed] = true;
            nonNumericConditionsByLine[indexUsed].push(conditionLatex);
          } else {
            subsetDomainsByLine[indexUsed].push(
              effectiveDomainsOfChildrenIgnoringDomain[ind],
            );
          }
        }

        let conditionLatexByLine = subsetDomainsByLine.map(
          (subsetDomains, i) => {
            if (
              nonNumericConditionsByLine[i].length === 1 &&
              nonNumericConditionsByLine[i][0] === "\\text{otherwise}"
            ) {
              return "\\text{otherwise}";
            } else {
              let conditionLatex = "\\text{if }";
              if (nonNumericConditionsByLine[i].length > 0) {
                conditionLatex +=
                  " " + nonNumericConditionsByLine[i].join(" \\text{ or } ");
              }

              if (subsetDomains.length > 0) {
                if (nonNumericConditionsByLine[i].length > 0) {
                  conditionLatex += " \\text{ or } ";
                } else {
                  conditionLatex += " ";
                }
                // Simplify the expression for the numerical domain by calculating the combined subset
                // and reconverting to latex
                let overallDomain = new subsets.Union(subsetDomains);
                conditionLatex += latexFromSubsetDomain({
                  subsetDomain: overallDomain,
                  dependencyValues,
                  functionVariable,
                  toLatexParams,
                });
              }

              return conditionLatex;
            }
          },
        );

        let latex = formulaLatexByLine
          .map((v, i) => `${v} & ${conditionLatexByLine[i]}`)
          .join("\\\\\n    ");

        latex = `\\begin{cases}\n    ${latex}\n\\end{cases}`;

        return { setValue: { latex } };
      },
    };

    stateVariableDefinitions.functionChildrenInfoToCalculateExtrema = {
      returnDependencies: () => ({
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
            "functionChildrenInfoToCalculateExtrema",
            "numInputs",
            "numOutputs",
            "numericalDomainsOfChildren",
          ],
          variablesOptional: true,
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            functionChildrenInfoToCalculateExtrema:
              dependencyValues.functionChildren,
          },
        };
      },
    };

    stateVariableDefinitions.allMinima = {
      additionalStateVariablesDefined: [
        "globalMinimumOption",
        "globalInfimumOption",
      ],
      returnDependencies() {
        return {
          functionChildrenInfoToCalculateExtrema: {
            dependencyType: "stateVariable",
            variableName: "functionChildrenInfoToCalculateExtrema",
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
        let { localMinima, globalMinimum, globalInfimum } =
          find_minima_of_piecewise({
            functionChildrenInfoToCalculateExtrema:
              dependencyValues.functionChildrenInfoToCalculateExtrema,
            domain: dependencyValues.domain,
            numericalDomainsOfChildren:
              dependencyValues.numericalDomainsOfChildren,
            numericalf: dependencyValues.numericalf,
            numerics,
          });

        return {
          setValue: {
            allMinima: localMinima,
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
          functionChildrenInfoToCalculateExtrema: {
            dependencyType: "stateVariable",
            variableName: "functionChildrenInfoToCalculateExtrema",
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
        let { localMaxima, globalMaximum, globalSupremum } =
          find_maxima_of_piecewise({
            functionChildrenInfoToCalculateExtrema:
              dependencyValues.functionChildrenInfoToCalculateExtrema,
            domain: dependencyValues.domain,
            numericalDomainsOfChildren:
              dependencyValues.numericalDomainsOfChildren,
            numericalf: dependencyValues.numericalf,
            numerics,
          });

        return {
          setValue: {
            allMaxima: localMaxima,
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

function latexFromSubsetDomain({
  subsetDomain,
  dependencyValues,
  functionVariable,
  toLatexParams,
}) {
  let childDomainMath = mathExpressionFromSubsetValue({
    subsetValue: subsetDomain,
    variable: functionVariable,
    displayMode: "inequalities",
  });

  let childDomainLatex;

  if (childDomainMath.tree[0] === "or") {
    childDomainLatex = childDomainMath.tree
      .slice(1)
      .map((subint) =>
        roundForDisplay({
          value: me.fromAst(subint),
          dependencyValues,
        }).toLatex(toLatexParams),
      )
      .join(" \\text{ or }");
  } else {
    childDomainLatex = roundForDisplay({
      value: childDomainMath,
      dependencyValues,
    }).toLatex(toLatexParams);
  }
  return childDomainLatex;
}
