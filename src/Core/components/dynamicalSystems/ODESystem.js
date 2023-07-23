import InlineComponent from "../abstract/InlineComponent";
import me from "math-expressions";
import { returnNVariables, roundForDisplay } from "../../utils/math";
import {
  returnSelectedStyleStateVariableDefinition,
  returnTextStyleDescriptionDefinitions,
} from "../../utils/style";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../../utils/rounding";

export default class ODESystem extends InlineComponent {
  static componentType = "odesystem";
  static rendererType = "math";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.independentVariable = {
      createComponentOfType: "_variableName",
      createStateVariable: "independentVariable",
      defaultValue: me.fromAst("t"),
      public: true,
    };

    attributes.initialIndependentVariableValue = {
      createComponentOfType: "math",
      createStateVariable: "initialIndependentVariableValue",
      defaultValue: me.fromAst(0),
      public: true,
    };

    Object.assign(attributes, returnRoundingAttributes());

    attributes.renderMode = {
      createComponentOfType: "text",
      createStateVariable: "renderMode",
      defaultValue: "align",
      public: true,
      forRenderer: true,
    };

    attributes.chunkSize = {
      createComponentOfType: "number",
      createStateVariable: "chunkSize",
      defaultValue: 10,
      public: true,
    };

    attributes.tolerance = {
      createComponentOfType: "number",
      createStateVariable: "tolerance",
      defaultValue: 1e-6,
      public: true,
    };

    attributes.maxIterations = {
      createComponentOfType: "number",
      createStateVariable: "maxIterations",
      defaultValue: 1000,
      public: true,
    };

    attributes.hideInitialCondition = {
      createComponentOfType: "boolean",
      createStateVariable: "hideInitialCondition",
      defaultValue: false,
      public: true,
    };

    attributes.initialConditions = {
      createComponentOfType: "mathList",
    };

    attributes.variables = {
      createComponentOfType: "_variableNameList",
    };

    attributes.number = {
      createComponentOfType: "boolean",
      createStateVariable: "number",
      defaultValue: false,
      public: true,
    };

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "rightHandSides",
        componentTypes: ["rightHandSide"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    Object.assign(
      stateVariableDefinitions,
      returnRoundingStateVariableDefinitions(),
    );

    let selectedStyleDefinition = returnSelectedStyleStateVariableDefinition();
    Object.assign(stateVariableDefinitions, selectedStyleDefinition);

    let styleDescriptionDefinitions = returnTextStyleDescriptionDefinitions();
    Object.assign(stateVariableDefinitions, styleDescriptionDefinitions);

    stateVariableDefinitions.validIndependentVariable = {
      returnDependencies: () => ({
        independentVarAttr: {
          dependencyType: "attributeComponent",
          attributeName: "independentVariable",
          variableNames: ["validVariable"],
        },
      }),
      definition({ dependencyValues }) {
        let validVariable = true;
        if (dependencyValues.independentVarAttr) {
          validVariable =
            dependencyValues.independentVarAttr.stateValues.validVariable;
        }
        return { setValue: { validIndependentVariable: validVariable } };
      },
    };

    stateVariableDefinitions.numDimensions = {
      returnDependencies: () => ({
        rhsChildren: {
          dependencyType: "child",
          childGroups: ["rightHandSides"],
          skipComponentNames: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: { numDimensions: dependencyValues.rhsChildren.length },
          checkForActualChange: { numDimensions: true },
        };
      },
    };

    stateVariableDefinitions.variables = {
      additionalStateVariablesDefined: [
        {
          variableName: "validVariables",
          isArray: true,
          entryPrefixes: ["validVar"],
        },
      ],
      isArray: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "_variableName",
      },
      entryPrefixes: ["var"],
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numDimensions];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          numDimensions: {
            dependencyType: "stateVariable",
            variableName: "numDimensions",
          },
          variables: {
            dependencyType: "attributeComponent",
            attributeName: "variables",
            variableNames: ["variables", "validVariables"],
          },
          independentVariable: {
            dependencyType: "stateVariable",
            variableName: "independentVariable",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        let warnings = [];

        let variablesSpecified = [];
        let validVariables = [];
        let numDims = globalDependencyValues.numDimensions;
        if (globalDependencyValues.variables !== null) {
          variablesSpecified =
            globalDependencyValues.variables.stateValues.variables;
          validVariables = [
            ...globalDependencyValues.variables.stateValues.validVariables,
          ].slice(0, numDims);
        }

        let variables = returnNVariables(numDims, variablesSpecified);

        if (
          variables.some((x) =>
            x.equals(globalDependencyValues.independentVariable),
          )
        ) {
          warnings.push({
            message:
              "Variables of odesystem must be different than independent variable.",
            level: 1,
          });
        }

        if (validVariables.length < numDims) {
          validVariables.push(
            ...Array(numDims - validVariables.length).fill(true),
          );
        }

        return {
          setValue: { variables, validVariables },
          sendWarnings: warnings,
        };
      },
    };

    stateVariableDefinitions.rhss = {
      isArray: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      entryPrefixes: ["rhs", "righthandside"],
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            rhsChild: {
              dependencyType: "child",
              childGroups: ["rightHandSides"],
              variableNames: ["value"],
              childIndices: [arrayKey],
            },
          };
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let rhss = {};

        for (let arrayKey of arrayKeys) {
          rhss[arrayKey] =
            dependencyValuesByKey[arrayKey].rhsChild[0].stateValues.value;
        }

        return {
          setValue: { rhss },
        };
      },
    };

    stateVariableDefinitions.rhs = {
      isAlias: true,
      targetVariableName: "rhs1",
    };
    stateVariableDefinitions.righthandside = {
      isAlias: true,
      targetVariableName: "rhs1",
    };
    stateVariableDefinitions.righthandsides = {
      isAlias: true,
      targetVariableName: "rhss",
    };

    stateVariableDefinitions.initialConditions = {
      isArray: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      entryPrefixes: ["initialCondition"],
      defaultValueByArrayKey: () => me.fromAst(0),
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            initialConditionAttr: {
              dependencyType: "attributeComponent",
              attributeName: "initialConditions",
              variableNames: [`math${Number(arrayKey) + 1}`],
            },
          };
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let initialConditions = {};
        let defaultInitialConditions = {};

        for (let arrayKey of arrayKeys) {
          let foundValue = false;
          if (dependencyValuesByKey[arrayKey].initialConditionAttr) {
            let ic =
              dependencyValuesByKey[arrayKey].initialConditionAttr.stateValues[
                `math${Number(arrayKey) + 1}`
              ];
            if (ic !== undefined) {
              foundValue = true;
              initialConditions[arrayKey] = ic;
            }
          }
          if (!foundValue) {
            defaultInitialConditions[arrayKey] = true;
          }
        }

        let result = {};

        if (Object.keys(initialConditions).length > 0) {
          result.setValue = { initialConditions };
        }
        if (Object.keys(defaultInitialConditions).length > 0) {
          result.useEssentialOrDefaultValue = {
            initialConditions: defaultInitialConditions,
          };
        }

        return result;
      },
    };

    stateVariableDefinitions.initialCondition = {
      isAlias: true,
      targetVariableName: "initialCondition1",
    };

    stateVariableDefinitions.equationTag = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["number"],
      mustEvaluate: true, // must evaluate to make sure all counters are accounted for
      returnDependencies({ stateValues }) {
        if (stateValues.number) {
          return {
            equationCounter: {
              dependencyType: "counter",
              counterName: "equation",
            },
          };
        } else {
          return {};
        }
      },
      definition({ dependencyValues }) {
        if (dependencyValues.equationCounter !== undefined) {
          return {
            setValue: { equationTag: String(dependencyValues.equationCounter) },
          };
        } else {
          return { setValue: { equationTag: null } };
        }
      },
    };

    stateVariableDefinitions.latex = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "latex",
      },
      forRenderer: true,
      returnDependencies() {
        return {
          numDimensions: {
            dependencyType: "stateVariable",
            variableName: "numDimensions",
          },
          variables: {
            dependencyType: "stateVariable",
            variableName: "variables",
          },
          initialConditions: {
            dependencyType: "stateVariable",
            variableName: "initialConditions",
          },
          hideInitialCondition: {
            dependencyType: "stateVariable",
            variableName: "hideInitialCondition",
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
          independentVariable: {
            dependencyType: "stateVariable",
            variableName: "independentVariable",
          },
          initialIndependentVariableValue: {
            dependencyType: "stateVariable",
            variableName: "initialIndependentVariableValue",
          },
          rhss: {
            dependencyType: "stateVariable",
            variableName: "rhss",
          },
          number: {
            dependencyType: "stateVariable",
            variableName: "number",
          },
          equationTag: {
            dependencyType: "stateVariable",
            variableName: "equationTag",
          },
        };
      },
      definition({ dependencyValues }) {
        let params = {};
        if (dependencyValues.padZeros) {
          if (Number.isFinite(dependencyValues.displayDecimals)) {
            params.padToDecimals = dependencyValues.displayDecimals;
          }
          if (dependencyValues.displayDigits >= 1) {
            params.padToDigits = dependencyValues.displayDigits;
          }
        }

        let systemDisplay = [];
        let indVar = dependencyValues.independentVariable.toLatex();
        for (let dim = 0; dim < dependencyValues.numDimensions; dim++) {
          let variable = dependencyValues.variables[dim].toLatex();

          let rhs = roundForDisplay({
            value: dependencyValues.rhss[dim],
            dependencyValues,
          });

          let thisLatex = `\\frac{d${variable}}{d${indVar}} &=  ${rhs.toLatex(
            params,
          )}`;
          if (dependencyValues.number && dim === 0) {
            thisLatex += `\\tag{${dependencyValues.equationTag}}`;
          } else {
            thisLatex += "\\notag";
          }
          systemDisplay.push(thisLatex);
        }

        if (!dependencyValues.hideInitialCondition) {
          let indVarVal0 = dependencyValues.initialIndependentVariableValue;

          for (let dim = 0; dim < dependencyValues.numDimensions; dim++) {
            let variable = dependencyValues.variables[dim].toLatex();
            let ic = roundForDisplay({
              value: dependencyValues.initialConditions[dim],
              dependencyValues,
            });

            systemDisplay.push(
              `${variable}(${indVarVal0}) &= ${ic.toLatex(params)}\\notag`,
            );
          }
        }
        let latex = systemDisplay.join("\\\\");

        return { setValue: { latex } };
      },
    };

    stateVariableDefinitions.latexWithInputChildren = {
      forRenderer: true,
      returnDependencies: () => ({
        latex: {
          dependencyType: "stateVariable",
          variableName: "latex",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: { latexWithInputChildren: [dependencyValues.latex] },
        };
      },
    };

    stateVariableDefinitions.numericalRHSf = {
      additionalStateVariablesDefined: ["numericalRHSfDefinitions"],
      returnDependencies: () => ({
        validIndependentVariable: {
          dependencyType: "stateVariable",
          variableName: "validIndependentVariable",
        },
        independentVariable: {
          dependencyType: "stateVariable",
          variableName: "independentVariable",
        },
        validVariables: {
          dependencyType: "stateVariable",
          variableName: `validVariables`,
        },
        variables: {
          dependencyType: "stateVariable",
          variableName: `variables`,
        },
        rhss: {
          dependencyType: "stateVariable",
          variableName: `rhss`,
        },
      }),
      definition({ dependencyValues }) {
        let warnings = [];

        let valid = true;
        if (!dependencyValues.validIndependentVariable) {
          warnings.push({
            message:
              "Can't define ODE RHS functions with invalid independent variable.",
            level: 1,
          });
          valid = false;
        }
        if (!dependencyValues.validVariables.every((x) => x)) {
          warnings.push({
            message: "Can't define ODE RHS functions with an invalid variable.",
            level: 1,
          });
          valid = false;
        }

        let indVarName =
          dependencyValues.independentVariable.subscripts_to_strings().tree;
        let varNames = dependencyValues.variables.map(
          (x) => x.subscripts_to_strings().tree,
        );

        if (varNames.includes(indVarName)) {
          warnings.push({
            message:
              "Can't define ODE RHS functions when independent variable is a dependent variable",
            level: 1,
          });
          valid = false;
        }

        if ([...new Set(varNames)].length !== varNames.length) {
          warnings.push({
            message:
              "Can't define ODE RHS functions with duplicate dependent variable names",
            level: 1,
          });
          valid = false;
        }

        let fs;
        try {
          fs = dependencyValues.rhss.map((x) => x.subscripts_to_strings().f());
        } catch (e) {
          warnings.push({
            message:
              "Cannot define ODE RHS function.  Error creating mathjs function",
            level: 1,
          });
          valid = false;
        }

        if (!valid) {
          let n = dependencyValues.rhss.length;
          return {
            setValue: {
              numericalRHSf: () => NaN,
              numericalRHSfDefinitions: Array(n).fill({}),
            },
            sendWarnings: warnings,
          };
        }

        return {
          setValue: {
            numericalRHSf: function (t, x) {
              let fargs = { [indVarName]: t };
              if (Array.isArray(x)) {
                x.forEach((v, i) => (fargs[varNames[i]] = v));
              } else {
                fargs[varNames[0]] = x;
              }
              try {
                return fs.map((f) => f(fargs));
              } catch (e) {
                return NaN;
              }
            },
            numericalRHSfDefinitions: dependencyValues.rhss.map((x) => ({
              functionType: "formula",
              formula: x,
              numInputs: varNames.length + 1,
              variables: [indVarName, ...varNames],
            })),
          },
        };
      },
    };

    stateVariableDefinitions.haveNumericalInitialConditions = {
      additionalStateVariablesDefined: ["t0", "x0s"],
      returnDependencies: () => ({
        initialIndependentVariableValue: {
          dependencyType: "stateVariable",
          variableName: "initialIndependentVariableValue",
        },
        initialConditions: {
          dependencyType: "stateVariable",
          variableName: "initialConditions",
        },
      }),
      definition({ dependencyValues }) {
        let t0 =
          dependencyValues.initialIndependentVariableValue.evaluate_to_constant();
        let x0s = dependencyValues.initialConditions.map((x) =>
          x.evaluate_to_constant(),
        );

        let haveNumericalInitialConditions =
          Number.isFinite(t0) && x0s.every((x) => Number.isFinite(x));

        return {
          setValue: { t0, x0s, haveNumericalInitialConditions },
        };
      },
    };

    stateVariableDefinitions.numericalSolutions = {
      isArray: true,
      entryPrefixes: ["numericalSolution"],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "function",
        addStateVariablesShadowingStateVariables: {
          fDefinitions: {
            stateVariableToShadow: "numericalSolutionFDefinitions",
          },
        },
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      createWorkspace: true,
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numDimensions];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          numDimensions: {
            dependencyType: "stateVariable",
            variableName: "numDimensions",
          },
          validIndependentVariable: {
            dependencyType: "stateVariable",
            variableName: "validIndependentVariable",
          },
          independentVariable: {
            dependencyType: "stateVariable",
            variableName: "independentVariable",
          },
          validVariables: {
            dependencyType: "stateVariable",
            variableName: `validVariables`,
          },
          variables: {
            dependencyType: "stateVariable",
            variableName: `variables`,
          },
          chunkSize: {
            dependencyType: "stateVariable",
            variableName: `chunkSize`,
          },
          tolerance: {
            dependencyType: "stateVariable",
            variableName: `tolerance`,
          },
          maxIterations: {
            dependencyType: "stateVariable",
            variableName: `maxIterations`,
          },
          haveNumericalInitialConditions: {
            dependencyType: "stateVariable",
            variableName: `haveNumericalInitialConditions`,
          },
          t0: {
            dependencyType: "stateVariable",
            variableName: `t0`,
          },
          x0s: {
            dependencyType: "stateVariable",
            variableName: `x0s`,
          },
          numericalRHSf: {
            dependencyType: "stateVariable",
            variableName: `numericalRHSf`,
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        workspace,
        componentName,
      }) {
        let numericalSolutions = {};

        workspace.calculatedNumericSolutions = [];
        workspace.endingNumericalValues = [];
        workspace.maxPossibleTime = undefined;

        if (!globalDependencyValues.haveNumericalInitialConditions) {
          for (let ind = 0; ind < globalDependencyValues.numDimensions; ind++) {
            numericalSolutions[ind] = (_) => NaN;
          }
          return { setValue: { numericalSolutions } };
        }

        let t0 = globalDependencyValues.t0;
        let x0s = globalDependencyValues.x0s;
        let chunkSize = globalDependencyValues.chunkSize;
        let tolerance = globalDependencyValues.tolerance;
        let numericalRHSf = globalDependencyValues.numericalRHSf;
        let maxIterations = globalDependencyValues.maxIterations;

        for (let ind = 0; ind < globalDependencyValues.numDimensions; ind++) {
          numericalSolutions[ind] = function f(t) {
            if (!Number.isFinite(t)) {
              return NaN;
            }
            if (t === t0) {
              return x0s[ind];
            }

            let nChunksCalculated = workspace.calculatedNumericSolutions.length;
            let chunk = Math.ceil((t - t0) / chunkSize) - 1;
            if (chunk < 0) {
              // console.log("Haven't yet implemented integrating ODE backward")
              return NaN;
            }
            if (
              workspace.maxPossibleTime === undefined &&
              chunk >= nChunksCalculated
            ) {
              for (let tind = nChunksCalculated; tind <= chunk; tind++) {
                let x0 = workspace.endingNumericalValues[tind - 1];
                if (x0 === undefined) {
                  x0 = x0s;
                }
                let t0shifted = t0 + tind * chunkSize;
                let result = me.math.dopri(
                  t0shifted,
                  t0shifted + chunkSize,
                  x0,
                  numericalRHSf,
                  tolerance,
                  maxIterations,
                );
                workspace.endingNumericalValues.push(
                  result.y[result.y.length - 1],
                );
                workspace.calculatedNumericSolutions.push(
                  result.at.bind(result),
                );

                let endingTime = result.x[result.x.length - 1];
                if (endingTime < (t0shifted + chunkSize) * (1 - 1e-6)) {
                  workspace.maxPossibleTime = endingTime;
                  let message =
                    "For chunksize " +
                    chunkSize +
                    " and tolerance " +
                    tolerance +
                    ", odesystem";
                  if (componentName !== undefined) {
                    message += " (" + componentName + ")";
                  }
                  message +=
                    " hit maxiterations (" +
                    maxIterations +
                    ") at t = " +
                    workspace.maxPossibleTime +
                    ". Will not calculate solution beyond that time." +
                    " Decrease chunksize, increase maxiterations, or increase tolerance to calculate further.";
                  // console.warn(message);
                  break;
                }
              }
            }

            if (t > workspace.maxPossibleTime) {
              return NaN;
            }

            let value = workspace.calculatedNumericSolutions[chunk](t)[ind];

            return value;
          };
        }

        return { setValue: { numericalSolutions } };
      },
    };

    stateVariableDefinitions.numericalSolution = {
      isAlias: true,
      targetVariableName: "numericalSolution1",
    };

    stateVariableDefinitions.numericalSolutionFDefinitions = {
      forRenderer: true,
      isArray: true,
      entryPrefixes: ["numericalSolutionFDefinition"],
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numDimensions];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          numDimensions: {
            dependencyType: "stateVariable",
            variableName: "numDimensions",
          },
          validIndependentVariable: {
            dependencyType: "stateVariable",
            variableName: "validIndependentVariable",
          },
          independentVariable: {
            dependencyType: "stateVariable",
            variableName: "independentVariable",
          },
          validVariables: {
            dependencyType: "stateVariable",
            variableName: `validVariables`,
          },
          variables: {
            dependencyType: "stateVariable",
            variableName: `variables`,
          },
          chunkSize: {
            dependencyType: "stateVariable",
            variableName: `chunkSize`,
          },
          tolerance: {
            dependencyType: "stateVariable",
            variableName: `tolerance`,
          },
          maxIterations: {
            dependencyType: "stateVariable",
            variableName: `maxIterations`,
          },
          haveNumericalInitialConditions: {
            dependencyType: "stateVariable",
            variableName: `haveNumericalInitialConditions`,
          },
          t0: {
            dependencyType: "stateVariable",
            variableName: `t0`,
          },
          x0s: {
            dependencyType: "stateVariable",
            variableName: `x0s`,
          },
          numericalRHSfDefinitions: {
            dependencyType: "stateVariable",
            variableName: `numericalRHSfDefinitions`,
          },
        };
        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        if (!globalDependencyValues.haveNumericalInitialConditions) {
          return {
            setValue: {
              numericalSolutionFDefinitions: Array(
                globalDependencyValues.numDimensions,
              ).fill({}),
            },
          };
        }

        return {
          setValue: {
            numericalSolutionFDefinitions: [
              ...Array(globalDependencyValues.numDimensions).keys(),
            ].map((ind) => ({
              functionType: "ODESolution",
              numDimensions: globalDependencyValues.numDimensions,
              t0: globalDependencyValues.t0,
              x0s: globalDependencyValues.x0s,
              chunkSize: globalDependencyValues.chunkSize,
              tolerance: globalDependencyValues.tolerance,
              numericalRHSfDefinitions:
                globalDependencyValues.numericalRHSfDefinitions,
              maxIterations: globalDependencyValues.maxIterations,
              component: ind,
            })),
          },
        };
      },
    };

    return stateVariableDefinitions;
  }
}
