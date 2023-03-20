import Function from './Function';
import InlineComponent from './abstract/InlineComponent';
import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';
import { returnPiecewiseNumericalFunctionFromChildren } from '../utils/function';
import { roundForDisplay } from '../utils/math';

export default class PiecewiseFunction extends Function {
  static componentType = "piecewiseFunction";


  static createAttributesObject() {
    let attributes = super.createAttributesObject();


    delete attributes.nInputs;
    delete attributes.nOutputs;
    delete attributes.minima;
    delete attributes.maxima;
    delete attributes.extrema;
    delete attributes.through;
    delete attributes.throughSlope;



    return attributes;
  }

  static returnSugarInstructions() {
    return [];
  };

  static returnChildGroups() {

    return [{
      group: "functions",
      componentTypes: ["function"]
    }, {
      group: "labels",
      componentTypes: ["label"]
    }]

  }

  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    delete stateVariableDefinitions.isInterpolatedFunction;

    stateVariableDefinitions.nInputs = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({}),
      definition() {
        return { setValue: { nInputs: 1 } }
      }
    }

    stateVariableDefinitions.nOutputs = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        functionChildren: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["nOutputs"]
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.functionChildren.length > 0) {
          return {
            setValue: {
              nOutputs: dependencyValues.functionChildren[0].stateValues.nOutputs
            }
          }
        } else {
          return { setValue: { nOutputs: 1 } }
        }
      }
    }

    stateVariableDefinitions.domainsOfChildren = {
      returnDependencies: () => ({
        functionChildren: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["domain"]
        },
      }),
      definition({ dependencyValues }) {
        let domainsOfChildren = []

        // We can compute the domain of a function child only if it is real-valued.
        // Otherwise, we assume the domain is all real numbers
        for (let functionChild of dependencyValues.functionChildren) {
          let fDomain = functionChild.stateValues.domain?.[0];
          if (fDomain) {
            // if fDomain exists, then it must be an interval, i.e., its tree must be of the form
            // ["interval", ["tuple", 1,2], ["tuple", true, false]]
            // where the above represents the interval [1,2)

            let intervalMin = me.fromAst(fDomain.tree[1][1]).evaluate_to_constant();
            let intervalMax = me.fromAst(fDomain.tree[1][2]).evaluate_to_constant();
            let intervalMinIsClosed = fDomain.tree[2][1];
            let intervalMaxIsClosed = fDomain.tree[2][2];

            if (!Number.isFinite(intervalMin)) {
              intervalMin = -Infinity;
              intervalMinIsClosed = false;
            }

            if (!Number.isFinite(intervalMax)) {
              intervalMax = Infinity;
              intervalMaxIsClosed = false;
            }

            domainsOfChildren.push([[intervalMin, intervalMax], [intervalMinIsClosed, intervalMaxIsClosed]])


          } else {
            domainsOfChildren.push([[-Infinity, Infinity], [false, false]])
          }

        }
        return { setValue: { domainsOfChildren } }
      }
    }

    stateVariableDefinitions.domain = {
      returnDependencies: () => ({
        domainAttr: {
          dependencyType: "attributeComponent",
          attributeName: "domain",
          variableNames: ["intervals"]
        },
        domainsOfChildren: {
          dependencyType: "stateVariable",
          variableName: "domainsOfChildren"
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.domainAttr !== null) {
          let domain = dependencyValues.domainAttr.stateValues.intervals[0];

          if (domain && Array.isArray(domain.tree)
            && domain.tree[0] === "interval") {
            return { setValue: { domain: [domain] } }
          } else {
            return { setValue: { domain: null } }
          }

        } else if (dependencyValues.domainsOfChildren.length > 0) {

          let minD = Infinity;
          let maxD = -Infinity;
          let minDIsClosed = false;
          let maxDIsClosed = false;

          // Since a domain currently has to be an interval, any missing intervals are filled in
          for (let childDomain of dependencyValues.domainsOfChildren) {

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


          let domain = [me.fromAst(["interval",
            ["tuple", minD, maxD],
            ["tuple", minDIsClosed, maxDIsClosed]
          ])];
          return { setValue: { domain } }

        } else {
          return { setValue: { domain: null } }
        }
      }
    }


    delete stateVariableDefinitions.unnormalizedFormula;

    // until we build in support for piecewise functions into math-expressions,
    // we cannot represent the formula in a math component
    stateVariableDefinitions.formula = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
      },
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { formula: me.fromAst("\uff3f") } })
    }

    delete stateVariableDefinitions.nPrescribedPoints;
    delete stateVariableDefinitions.prescribedPoints;
    delete stateVariableDefinitions.prescribedMinima;
    delete stateVariableDefinitions.prescribedMaxima;
    delete stateVariableDefinitions.prescribedExtrema;
    delete stateVariableDefinitions.interpolationPoints;
    delete stateVariableDefinitions.xs;




    // until we build in support for piecewise functions into math-expressions,
    // we cannot represent the symbolicfs
    stateVariableDefinitions.symbolicfs = {
      isArray: true,
      entryPrefixes: ["symbolicf"],
      returnArraySizeDependencies: () => ({
        nOutputs: {
          dependencyType: "stateVariable",
          variableName: "nOutputs"
        }
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nOutputs];
      },
      returnArrayDependenciesByKey() {
        return {};
      },
      arrayDefinitionByKey: function ({ arrayKeys }) {
        let symbolicfs = {};
        for (let arrayKey of arrayKeys) {
          symbolicfs[arrayKey] = x => me.fromAst('\uff3f');
        }
        return {
          setValue: { symbolicfs }
        }

      }
    }


    stateVariableDefinitions.numericalfs = {
      isArray: true,
      entryPrefixes: ["numericalf"],
      returnArraySizeDependencies: () => ({
        nOutputs: {
          dependencyType: "stateVariable",
          variableName: "nOutputs"
        }
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nOutputs];
      },
      returnArrayDependenciesByKey() {
        return {
          globalDependencies: {
            functionChildren: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["numericalfs"],
            },
            domainsOfChildren: {
              dependencyType: "stateVariable",
              variableName: "domainsOfChildren"
            },
            numericalfShadow: {
              dependencyType: "stateVariable",
              variableName: "numericalfShadow"
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain"
            }
          }
        }
      },
      arrayDefinitionByKey: function ({ globalDependencyValues, arrayKeys }) {
        if (globalDependencyValues.functionChildren.length > 0) {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {

            let numericalFsOfChildren = globalDependencyValues.functionChildren.map(
              functionChild => functionChild.stateValues.numericalfs[arrayKey]
            );
            numericalfs[arrayKey] = returnPiecewiseNumericalFunctionFromChildren({
              numericalFsOfChildren,
              domainsOfChildren: globalDependencyValues.domainsOfChildren,
              domain: globalDependencyValues.domain,
              component: arrayKey
            })

          }
          return {
            setValue: { numericalfs }
          }
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
            setValue: { numericalfs }
          }

        } else if (globalDependencyValues.symbolicfShadow) {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            if (arrayKey === "0") {
              numericalfs[arrayKey] = function (x) {
                let val = dependencyValues.symbolicfShadow(me.fromAst(x)).evaluate_to_constant();
                if (val === null) {
                  val = NaN
                }
                return val;
              }
            } else {
              numericalfs[arrayKey] = () => NaN;
            }
          }
          return {
            setValue: { numericalfs }
          }
        } else {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            numericalfs[arrayKey] = () => NaN;
          }
          return {
            setValue: { numericalfs }
          }
        }
      }
    }

    stateVariableDefinitions.fDefinitions = {
      isArray: true,
      entryPrefixes: ["fDefinition"],
      returnArraySizeDependencies: () => ({
        nOutputs: {
          dependencyType: "stateVariable",
          variableName: "nOutputs"
        }
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nOutputs];
      },
      returnArrayDependenciesByKey({ stateValues }) {

        return {
          globalDependencies: {
            functionChildren: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["fDefinitions"],
            },
            domainsOfChildren: {
              dependencyType: "stateVariable",
              variableName: "domainsOfChildren"
            },
            numericalfShadow: {
              dependencyType: "stateVariable",
              variableName: "numericalfShadow"
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain"
            }
          }
        }
      },
      arrayDefinitionByKey: function ({ globalDependencyValues, usedDefault, arrayKeys }) {
        if (globalDependencyValues.functionChildren.length > 0) {

          let fDefinitions = {};
          for (let arrayKey of arrayKeys) {

            let fDefinitionsOfChildren = globalDependencyValues.functionChildren.map(
              functionChild => functionChild.stateValues.fDefinitions[arrayKey]
            );
            fDefinitions[arrayKey] = {
              functionType: "piecewise",
              fDefinitionsOfChildren,
              domainsOfChildren: globalDependencyValues.domainsOfChildren,
              domain: globalDependencyValues.domain,
              component: arrayKey
            }
          }
          return {
            setValue: { fDefinitions }
          }
        } else if (globalDependencyValues.numericalfShadow) {
          // TODO: ??
          let fDefinitions = {};
          for (let arrayKey of arrayKeys) {
            fDefinitions[arrayKey] = {}
          }
          return {
            setValue: { fDefinitions }
          }
        } else {
          let fDefinitions = {};
          for (let arrayKey of arrayKeys) {
            fDefinitions[arrayKey] = {}
          }
          return {
            setValue: { fDefinitions }
          }
        }
      }
    }

    stateVariableDefinitions.latex = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        variable: {
          dependencyType: "stateVariable",
          variableName: "variable",
        },
        functionChildren: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["formula", "variable"],
        },
        domainsOfChildren: {
          dependencyType: "stateVariable",
          variableName: "domainsOfChildren"
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits"
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals"
        },
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero"
        },
        padZeros: {
          dependencyType: "stateVariable",
          variableName: "padZeros"
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {

        let functionVariable = dependencyValues.variable;

        let params = {};
        if (dependencyValues.padZeros) {
          if (usedDefault.displayDigits && !usedDefault.displayDecimals) {
            if (Number.isFinite(dependencyValues.displayDecimals)) {
              params.padToDecimals = dependencyValues.displayDecimals;
            }
          } else if (dependencyValues.displayDigits >= 1) {
            params.padToDigits = dependencyValues.displayDigits;
          }
        }
        let childrenLatex = dependencyValues.functionChildren.map(functionChild => {

          let formula = functionChild.stateValues.formula.subscripts_to_strings();
          let variable = functionChild.stateValues.variable.subscripts_to_strings();

          formula = formula.substitute({ [variable]: functionVariable }).strings_to_subscripts();

          return roundForDisplay({
            value: formula,
            dependencyValues, usedDefault
          }).toLatex(params)
        });

        let childConditions = [];

        for (let [ind, childDomain] of dependencyValues.domainsOfChildren.entries()) {
          let minx = childDomain[0][0];
          let maxx = childDomain[0][1];

          if (Number.isFinite(minx)) {
            if (Number.isFinite(maxx)) {
              let intervalString = "";
              if (childDomain[1][0]) {
                intervalString += "[";
              } else {
                intervalString += "("
              };
              intervalString += `${minx}, ${maxx}`;
              if (childDomain[1][1]) {
                intervalString += "]";
              } else {
                intervalString += ")"
              };

              childConditions.push(`\\text{if } ${functionVariable} \\in ${intervalString}`);
            } else {
              // only minx
              let operator = childDomain[1][0] ? "\\ge" : ">";

              childConditions.push(`\\text{if } ${functionVariable} ${operator} ${minx}`);

            }
          } else if (Number.isFinite(maxx)) {
            // only maxx
            let operator = childDomain[1][1] ? "\\le" : "<";

            childConditions.push(`\\text{if } ${functionVariable} ${operator} ${maxx}`);
          } else {

            if (ind === 0) {
              // first child has no conditions, so just return latex for first child
              return { setValue: { latex: childrenLatex[0] } }
            }

            childConditions.push(`\\text{otherwise}`);
            break;
          }

        }

        let latex = childConditions.map((cond, i) => `${childrenLatex[i]} & ${cond}`).join("\\\\\n    ")

        latex = `\\begin{cases}\n    ${latex}\n\\end{cases}`;

        return { setValue: { latex } };
      }
    }



    stateVariableDefinitions.allMinima = {
      returnDependencies() {
        return {
          functionChildren: {
            dependencyType: "child",
            childGroups: ["functions"],
            variableNames: ["allMinima"]
          },
          domainsOfChildren: {
            dependencyType: "stateVariable",
            variableName: "domainsOfChildren"
          },
          numericalf: {
            dependencyType: "stateVariable",
            variableName: "numericalf"
          }
        }

      },
      definition: function ({ dependencyValues }) {

        let eps = numerics.eps;

        let minimaList = [];

        let minimaByChild = dependencyValues.functionChildren.map(functionChild => functionChild.stateValues.allMinima)

        let f = dependencyValues.numericalf;

        for (let [ind, childDomain] of dependencyValues.domainsOfChildren.entries()) {

          let minx = childDomain[0][0];
          let maxx = childDomain[0][1];


          let childMinima = minimaByChild[ind];

          // will check the endpoints manually, so remove any minima near the endpoints
          childMinima = childMinima.filter(minpair => minpair[0] > minx + eps && minpair[0] < maxx - eps)
          minimaList.push(...childMinima);

          // check endpoints 
          let fminx = f(minx);
          if (fminx < f(minx - eps) && fminx < f(minx + eps)) {
            if (minimaList.every(minpair => minpair[0] < minx - eps || minpair[0] > minx + eps)) {
              minimaList.push([minx, fminx])
            }
          }

          let fmaxx = f(maxx);
          if (fmaxx < f(maxx - eps) && fmaxx < f(maxx + eps)) {
            if (minimaList.every(minpair => minpair[0] < maxx - eps || minpair[0] > maxx + eps)) {
              minimaList.push([maxx, fmaxx])
            }
          }

          // remove any minima from later function children in the domain (or near the endpoints)
          for (let [otherInd, otherMinima] of [...minimaByChild.entries()].slice(ind + 1)) {
            let revisedMinima = otherMinima.filter(minpair =>
              minpair[0] < minx - eps || minpair[0] > maxx + eps
            );
            minimaByChild[otherInd] = revisedMinima;
          }

        }

        minimaList = minimaList.sort((a, b) => a[0] - b[0]);


        return { setValue: { allMinima: minimaList } }

      }
    }


    stateVariableDefinitions.allMaxima = {
      returnDependencies() {
        return {
          functionChildren: {
            dependencyType: "child",
            childGroups: ["functions"],
            variableNames: ["allMaxima"]
          },
          domainsOfChildren: {
            dependencyType: "stateVariable",
            variableName: "domainsOfChildren"
          },
          numericalf: {
            dependencyType: "stateVariable",
            variableName: "numericalf"
          }
        }

      },
      definition: function ({ dependencyValues }) {

        let eps = numerics.eps;

        let maximaList = [];

        let maximaByChild = dependencyValues.functionChildren.map(functionChild => functionChild.stateValues.allMaxima)

        let f = dependencyValues.numericalf;

        for (let [ind, childDomain] of dependencyValues.domainsOfChildren.entries()) {

          let minx = childDomain[0][0];
          let maxx = childDomain[0][1];


          let childMaxima = maximaByChild[ind];

          // will check the endpoints manually, so remove any maxima near the endpoints
          childMaxima = childMaxima.filter(maxpair => maxpair[0] > minx + eps && maxpair[0] < maxx - eps)
          maximaList.push(...childMaxima);

          // check endpoints 
          let fminx = f(minx);
          if (fminx > f(minx - eps) && fminx > f(minx + eps)) {
            if (maximaList.every(maxpair => maxpair[0] < minx - eps || maxpair[0] > minx + eps)) {
              maximaList.push([minx, fminx])
            }
          }

          let fmaxx = f(maxx);
          if (fmaxx > f(maxx - eps) && fmaxx > f(maxx + eps)) {
            if (maximaList.every(maxpair => maxpair[0] < maxx - eps || maxpair[0] > maxx + eps)) {
              maximaList.push([maxx, fmaxx])
            }
          }

          // remove any maxima from later function children in the domain (or near the endpoints)
          for (let [otherInd, otherMaxima] of [...maximaByChild.entries()].slice(ind + 1)) {
            let revisedMaxima = otherMaxima.filter(maxpair =>
              maxpair[0] < minx - eps || maxpair[0] > maxx + eps
            );
            maximaByChild[otherInd] = revisedMaxima;
          }

        }

        maximaList = maximaList.sort((a, b) => a[0] - b[0]);


        return { setValue: { allMaxima: maximaList } }

      }
    }



    stateVariableDefinitions.returnNumericalDerivatives = {
      returnDependencies: () => ({}),
      definition: function () {

        return { setValue: { returnNumericalDerivatives: null } }
      }

    }


    stateVariableDefinitions.numericalDerivativesDefinition = {
      returnDependencies: () => ({}),
      definition: function () {

        return { setValue: { numericalDerivativesDefinition: {} } }
      }

    }


    return stateVariableDefinitions;

  }

}
