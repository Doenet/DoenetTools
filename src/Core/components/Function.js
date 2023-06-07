import InlineComponent from "./abstract/InlineComponent";
import GraphicalComponent from "./abstract/GraphicalComponent";
import me from "math-expressions";
import {
  mergeListsWithOtherContainers,
  normalizeMathExpression,
  returnNVariables,
  roundForDisplay,
  vectorOperators,
} from "../utils/math";
import {
  returnInterpolatedFunction,
  returnNumericalFunctionFromFormula,
  returnNumericalFunctionFromReevaluatedFormula,
  returnReturnDerivativesOfInterpolatedFunction,
  returnSymbolicFunctionFromFormula,
  returnSymbolicFunctionFromReevaluatedFormula,
} from "../utils/function";
import { returnTextStyleDescriptionDefinitions } from "../utils/style";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
import { returnWrapNonLabelsSugarFunction } from "../utils/label";
import {
  find_local_global_maxima,
  find_local_global_minima,
} from "../utils/extrema";

export default class Function extends InlineComponent {
  static componentType = "function";
  static rendererType = "math";

  static primaryStateVariableForDefinition = "numericalfShadow";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.simplify = {
      createComponentOfType: "text",
      createStateVariable: "simplifySpecified",
      defaultValue: "full",
      toLowerCase: true,
      valueTransformations: { "": "full", true: "full", false: "none" },
      validValues: ["none", "full", "numbers", "numberspreserveorder"],
    };
    attributes.expand = {
      createComponentOfType: "boolean",
      createStateVariable: "expandSpecified",
      defaultValue: false,
      public: true,
    };
    attributes.xscale = {
      createComponentOfType: "number",
      createStateVariable: "xscale",
      defaultValue: 1,
      public: true,
    };
    attributes.yscale = {
      createComponentOfType: "number",
      createStateVariable: "yscale",
      defaultValue: 1,
      public: true,
    };
    attributes.numInputs = {
      createComponentOfType: "integer",
    };
    attributes.numOutputs = {
      createComponentOfType: "integer",
    };
    attributes.domain = {
      createComponentOfType: "_intervalListComponent",
    };

    // include attributes of graphical components
    // for case when function is adapted into a curve

    attributes.labelIsName = {
      createComponentOfType: "boolean",
      createStateVariable: "labelIsName",
      defaultValue: false,
      public: true,
    };
    attributes.applyStyleToLabel = {
      createComponentOfType: "boolean",
      createStateVariable: "applyStyleToLabel",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };

    attributes.labelPosition = {
      createComponentOfType: "text",
      createStateVariable: "labelPosition",
      defaultValue: "upperright",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: [
        "upperright",
        "upperleft",
        "lowerright",
        "lowerleft",
        "top",
        "bottom",
        "left",
        "right",
      ],
    };

    attributes.layer = {
      createComponentOfType: "number",
      createStateVariable: "layer",
      defaultValue: 0,
      public: true,
      forRenderer: true,
    };

    attributes.minima = {
      createComponentOfType: "extrema",
    };
    attributes.maxima = {
      createComponentOfType: "extrema",
    };
    attributes.extrema = {
      createComponentOfType: "extrema",
    };
    attributes.through = {
      createComponentOfType: "_pointListComponent",
    };
    attributes.throughSlopes = {
      createComponentOfType: "mathList",
    };
    attributes.variables = {
      createComponentOfType: "_variableNameList",
    };
    attributes.variable = {
      createComponentOfType: "_variableName",
    };
    attributes.symbolic = {
      createComponentOfType: "boolean",
    };

    Object.assign(attributes, returnRoundingAttributes());

    attributes.nearestPointAsCurve = {
      createComponentOfType: "boolean",
      createStateVariable: "nearestPointAsCurve",
      defaultValue: false,
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    sugarInstructions.push({
      replacementFunction: returnWrapNonLabelsSugarFunction({
        wrappingComponentType: "math",
      }),
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "maths",
        componentTypes: ["math"],
      },
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
    let stateVariableDefinitions =
      GraphicalComponent.returnStateVariableDefinitions();

    let styleDescriptionDefinitions = returnTextStyleDescriptionDefinitions();
    Object.assign(stateVariableDefinitions, styleDescriptionDefinitions);

    stateVariableDefinitions.styleDescription = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
        document: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: ["theme"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let lineColorWord;
        if (dependencyValues.document?.stateValues.theme === "dark") {
          lineColorWord = dependencyValues.selectedStyle.lineColorWordDarkMode;
        } else {
          lineColorWord = dependencyValues.selectedStyle.lineColorWord;
        }

        let styleDescription = dependencyValues.selectedStyle.lineWidthWord;
        if (dependencyValues.selectedStyle.lineStyleWord) {
          if (styleDescription) {
            styleDescription += " ";
          }
          styleDescription += dependencyValues.selectedStyle.lineStyleWord;
        }

        if (styleDescription) {
          styleDescription += " ";
        }

        styleDescription += lineColorWord;

        return { setValue: { styleDescription } };
      },
    };

    stateVariableDefinitions.styleDescriptionWithNoun = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        styleDescription: {
          dependencyType: "stateVariable",
          variableName: "styleDescription",
        },
      }),
      definition: function ({ dependencyValues }) {
        let styleDescriptionWithNoun =
          dependencyValues.styleDescription + " function";

        return { setValue: { styleDescriptionWithNoun } };
      },
    };

    let roundingDefinitions = returnRoundingStateVariableDefinitions({
      childsGroupIfSingleMatch: ["functions"],
    });
    Object.assign(stateVariableDefinitions, roundingDefinitions);

    stateVariableDefinitions.isInterpolatedFunction = {
      returnDependencies: () => ({
        through: {
          dependencyType: "attributeComponent",
          attributeName: "through",
        },
        minima: {
          dependencyType: "attributeComponent",
          attributeName: "minima",
        },
        maxima: {
          dependencyType: "attributeComponent",
          attributeName: "maxima",
        },
        extrema: {
          dependencyType: "attributeComponent",
          attributeName: "extrema",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            isInterpolatedFunction:
              dependencyValues.through ||
              dependencyValues.minima ||
              dependencyValues.maxima ||
              dependencyValues.extrema,
          },
        };
      },
    };

    stateVariableDefinitions.numInputs = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        numInputsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "numInputs",
          variableNames: ["value"],
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["numInputs"],
        },
        variablesAttr: {
          dependencyType: "attributeComponent",
          attributeName: "variables",
          variableNames: ["numComponents"],
          dontRecurseToShadowsIfHaveAttribute: "variable",
        },
        isInterpolatedFunction: {
          dependencyType: "stateVariable",
          variableName: "isInterpolatedFunction",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.isInterpolatedFunction) {
          return { setValue: { numInputs: 1 } };
        } else if (dependencyValues.numInputsAttr !== null) {
          let numInputs = dependencyValues.numInputsAttr.stateValues.value;
          if (!(numInputs >= 0)) {
            numInputs = 1;
          }
          return { setValue: { numInputs } };
        } else if (dependencyValues.variablesAttr !== null) {
          return {
            setValue: {
              numInputs: Math.max(
                1,
                dependencyValues.variablesAttr.stateValues.numComponents,
              ),
            },
          };
        } else if (dependencyValues.functionChild.length > 0) {
          return {
            setValue: {
              numInputs:
                dependencyValues.functionChild[0].stateValues.numInputs,
            },
          };
        } else {
          return { setValue: { numInputs: 1 } };
        }
      },
    };

    stateVariableDefinitions.numOutputs = {
      defaultValue: 1,
      hasEssential: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        numOutputsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "numOutputs",
          variableNames: ["value"],
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["numOutputs"],
        },
        mathChild: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.functionChild.length > 0) {
          return {
            setValue: {
              numOutputs:
                dependencyValues.functionChild[0].stateValues.numOutputs,
            },
          };
        } else if (dependencyValues.numOutputsAttr !== null) {
          let numOutputs = dependencyValues.numOutputsAttr.stateValues.value;
          if (!(numOutputs >= 0)) {
            numOutputs = 1;
          }
          return { setValue: { numOutputs } };
        } else if (dependencyValues.mathChild.length > 0) {
          let formula = dependencyValues.mathChild[0].stateValues.value;
          let formulaIsVectorValued =
            Array.isArray(formula.tree) &&
            vectorOperators.includes(formula.tree[0]);

          let numOutputs = 1;
          if (formulaIsVectorValued) {
            numOutputs = formula.tree.length - 1;
          }
          return { setValue: { numOutputs } };
        } else {
          return { useEssentialOrDefaultValue: { numOutputs: true } };
        }
      },
    };

    stateVariableDefinitions.domain = {
      returnDependencies: () => ({
        domainAttr: {
          dependencyType: "attributeComponent",
          attributeName: "domain",
          variableNames: ["intervals"],
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["domain"],
        },
        numInputs: {
          dependencyType: "stateVariable",
          variableName: "numInputs",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.domainAttr !== null) {
          let numInputs = dependencyValues.numInputs;
          let domain = dependencyValues.domainAttr.stateValues.intervals.slice(
            0,
            numInputs,
          );
          if (domain.length !== numInputs) {
            return { setValue: { domain: null } };
          }

          if (
            !domain.every(
              (interval) =>
                Array.isArray(interval.tree) && interval.tree[0] === "interval",
            )
          ) {
            return { setValue: { domain: null } };
          }

          return { setValue: { domain } };
        } else if (dependencyValues.functionChild.length > 0) {
          return {
            setValue: {
              domain: dependencyValues.functionChild[0].stateValues.domain,
            },
          };
        } else {
          return { setValue: { domain: null } };
        }
      },
    };

    stateVariableDefinitions.simplify = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        simplifySpecified: {
          dependencyType: "stateVariable",
          variableName: "simplifySpecified",
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["simplify"],
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        if (
          usedDefault.simplifySpecified &&
          dependencyValues.functionChild.length > 0
        ) {
          return {
            setValue: {
              simplify: dependencyValues.functionChild[0].stateValues.simplify,
            },
          };
        } else {
          return { setValue: { simplify: dependencyValues.simplifySpecified } };
        }
      },
      inverseDefinition({
        desiredStateVariableValues,
        dependencyValues,
        usedDefault,
      }) {
        if (
          usedDefault.simplifySpecified &&
          dependencyValues.functionChild.length > 0
        ) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "functionChild",
                desiredValue: desiredStateVariableValues.simplify,
                childIndex: 0,
                variableIndex: 0,
              },
            ],
          };
        } else {
          return {
            success: true,
            instructions: [
              {
                setDependency: "simplifySpecified",
                desiredValue: desiredStateVariableValues.simplify,
              },
            ],
          };
        }
      },
    };

    stateVariableDefinitions.expand = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        expandSpecified: {
          dependencyType: "stateVariable",
          variableName: "expandSpecified",
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["expand"],
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        if (
          usedDefault.expandSpecified &&
          dependencyValues.functionChild.length > 0
        ) {
          return {
            setValue: {
              expand: dependencyValues.functionChild[0].stateValues.expand,
            },
          };
        } else {
          return { setValue: { expand: dependencyValues.expandSpecified } };
        }
      },
      inverseDefinition({
        desiredStateVariableValues,
        dependencyValues,
        usedDefault,
      }) {
        if (
          usedDefault.expandSpecified &&
          dependencyValues.functionChild.length > 0
        ) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "functionChild",
                desiredValue: desiredStateVariableValues.expand,
                childIndex: 0,
                variableIndex: 0,
              },
            ],
          };
        } else {
          return {
            success: true,
            instructions: [
              {
                setDependency: "expandSpecified",
                desiredValue: desiredStateVariableValues.expand,
              },
            ],
          };
        }
      },
    };

    stateVariableDefinitions.numericalfShadow = {
      defaultValue: null,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          numericalfShadow: true,
        },
      }),
    };

    stateVariableDefinitions.symbolicfShadow = {
      defaultValue: null,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          symbolicfShadow: true,
        },
      }),
    };

    stateVariableDefinitions.symbolic = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      defaultValue: true,
      hasEssential: true,
      returnDependencies: () => ({
        symbolicAttr: {
          dependencyType: "attributeComponent",
          attributeName: "symbolic",
          variableNames: ["value"],
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["symbolic"],
        },
        numericalfShadow: {
          dependencyType: "stateVariable",
          variableName: "numericalfShadow",
        },
        symbolicfShadow: {
          dependencyType: "stateVariable",
          variableName: "symbolicfShadow",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.symbolicAttr !== null) {
          return {
            setValue: {
              symbolic: dependencyValues.symbolicAttr.stateValues.value,
            },
          };
        } else if (dependencyValues.functionChild.length > 0) {
          return {
            setValue: {
              symbolic: dependencyValues.functionChild[0].stateValues.symbolic,
            },
          };
        } else if (dependencyValues.numericalfShadow) {
          return { setValue: { symbolic: false } };
        } else if (dependencyValues.symbolicfShadow) {
          return { setValue: { symbolic: true } };
        } else {
          return { useEssentialOrDefaultValue: { symbolic: true } };
        }
      },
    };

    stateVariableDefinitions.variables = {
      isArray: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "_variableName",
      },
      entryPrefixes: ["variable"],
      returnArraySizeDependencies: () => ({
        numInputs: {
          dependencyType: "stateVariable",
          variableName: "numInputs",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numInputs];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          variablesAttr: {
            dependencyType: "attributeComponent",
            attributeName: "variables",
            variableNames: ["variables"],
            dontRecurseToShadowsIfHaveAttribute: "variable",
          },
          variableAttr: {
            dependencyType: "attributeComponent",
            attributeName: "variable",
            variableNames: ["value"],
            dontRecurseToShadowsIfHaveAttribute: "variables",
          },
          parentVariableForChild: {
            dependencyType: "parentStateVariable",
            variableName: "variableForChild",
          },
          functionChild: {
            dependencyType: "child",
            childGroups: ["functions"],
          },
        };

        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            functionChild: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["variable" + (Number(arrayKey) + 1)],
            },
          };
        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arraySize,
        arrayKeys,
        usedDefault,
      }) {
        if (
          globalDependencyValues.variablesAttr !== null ||
          globalDependencyValues.variableAttr !== null
        ) {
          let variablesSpecified =
            globalDependencyValues.variablesAttr?.stateValues.variables;
          if (!variablesSpecified) {
            variablesSpecified = [
              globalDependencyValues.variableAttr.stateValues.value,
            ];
          }
          return {
            setValue: {
              variables: returnNVariables(arraySize[0], variablesSpecified),
            },
          };
        } else if (globalDependencyValues.functionChild.length > 0) {
          let variables = {};
          for (let arrayKey of arrayKeys) {
            variables[arrayKey] =
              dependencyValuesByKey[arrayKey].functionChild[0].stateValues[
                "variable" + (Number(arrayKey) + 1)
              ];
          }
          return { setValue: { variables } };
        } else if (
          globalDependencyValues.parentVariableForChild &&
          !usedDefault.parentVariableForChild
        ) {
          return {
            setValue: {
              variables: Array(arraySize[0]).fill(
                globalDependencyValues.parentVariableForChild,
              ),
            },
          };
        } else {
          return {
            setValue: {
              variables: returnNVariables(arraySize[0], []),
            },
          };
        }
      },
    };

    stateVariableDefinitions.variable = {
      isAlias: true,
      targetVariableName: "variable1",
    };

    stateVariableDefinitions.mathChildName = {
      returnDependencies() {
        return {
          mathChild: {
            dependencyType: "child",
            childGroups: ["maths"],
          },
        };
      },
      definition({ dependencyValues }) {
        if (dependencyValues.mathChild.length > 0) {
          return {
            setValue: {
              mathChildName: dependencyValues.mathChild[0].componentName,
            },
          };
        } else {
          return { setValue: { mathChildName: null } };
        }
      },
    };

    stateVariableDefinitions.mathChildCreatedBySugar = {
      stateVariablesDeterminingDependencies: ["mathChildName"],
      returnDependencies({ stateValues }) {
        if (stateValues.mathChildName) {
          return {
            mathChildCreatedBySugar: {
              dependencyType: "doenetAttribute",
              componentName: stateValues.mathChildName,
              attributeName: "createdFromSugar",
            },
          };
        } else {
          return {};
        }
      },
      definition({ dependencyValues }) {
        return {
          setValue: {
            mathChildCreatedBySugar: Boolean(
              dependencyValues.mathChildCreatedBySugar,
            ),
          },
        };
      },
    };

    stateVariableDefinitions.haveNaNChildToReevaluate = {
      stateVariablesDeterminingDependencies: [
        "mathChildName",
        "mathChildCreatedBySugar",
      ],
      returnDependencies({ stateValues }) {
        let dependencies = {};
        if (!stateValues.isInterpolatedFunction) {
          dependencies.variables = {
            dependencyType: "stateVariable",
            variableName: "variables",
          };
          if (stateValues.mathChildName) {
            if (stateValues.mathChildCreatedBySugar) {
              dependencies.mathChildExpressionWithCodes = {
                dependencyType: "stateVariable",
                componentName: stateValues.mathChildName,
                variableName: "expressionWithCodes",
              };
              dependencies.mathChildMathChildren = {
                dependencyType: "child",
                parentName: stateValues.mathChildName,
                childGroups: ["maths"],
                variableNames: ["value", "fReevaluate", "inputMaths"],
                variablesOptional: true,
              };
              dependencies.mathChildCodePre = {
                dependencyType: "stateVariable",
                componentName: stateValues.mathChildName,
                variableName: "codePre",
              };
            } else {
              dependencies.mathChild = {
                dependencyType: "child",
                childGroups: ["maths"],
                variableNames: ["value", "fReevaluate", "inputMaths"],
                variablesOptional: true,
              };
            }
          }
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        let containsNaN = (ast) => {
          if (typeof ast === "number") {
            return Number.isNaN(ast);
          }
          if (!Array.isArray(ast)) {
            return false;
          }
          return ast.slice(1).some((v) => containsNaN(v));
        };

        // Have mathChildMathChildren only if the math child was created by sugar.
        // In this case, the children of the math child were specified as direct
        // children of the function.
        // If any of those children is an <evaluate> (i.e., have fReevaluate state variable)
        // and has a variable in its input that is a function variable,
        // then when evaluating the function, we would reevaluate the <evaluate>
        // using the values of the variables passed to the function
        // In this case, if the value is NaN, set haveNaNChildToReevaluate = true.
        if (dependencyValues.mathChildMathChildren?.length > 0) {
          let variables = dependencyValues.variables.map(
            (x) => x.subscripts_to_strings().tree,
          );

          // Formula is based on a math child that has math children.
          // Check to see if any of those children are evaluates whose inputs contain a variable
          for (let mathGrandChild of dependencyValues.mathChildMathChildren) {
            if (mathGrandChild.stateValues.fReevaluate) {
              let inputVariables = mathGrandChild.stateValues.inputMaths.reduce(
                (a, c) => [...a, ...c.subscripts_to_strings().variables()],
                [],
              );

              if (inputVariables.some((invar) => variables.includes(invar))) {
                // The inputMaths to the <evaluate> contain a function variable.
                // In this case, we would need to reevaluate this math.
                // Check to see if its value has a NaN.

                if (containsNaN(mathGrandChild.stateValues.value.tree)) {
                  return { setValue: { haveNaNChildToReevaluate: true } };
                }
              }
            }
          }
        } else if (dependencyValues.mathChild?.[0].stateValues.fReevaluate) {
          // We have a single mathChild that is an <evaluate>
          // that was not added via sugar,
          // i.e., it was a direct child of the <function>.

          let variables = dependencyValues.variables.map(
            (x) => x.subscripts_to_strings().tree,
          );

          let mathChild = dependencyValues.mathChild[0];
          let inputVariables = mathChild.stateValues.inputMaths.reduce(
            (a, c) => [...a, ...c.subscripts_to_strings().variables()],
            [],
          );

          if (inputVariables.some((invar) => variables.includes(invar))) {
            // The inputMaths to the <evaluate> contain a function variable.
            // This sole <evaluate> is the only component to the function's formula,
            // so we need to reevaluate the <evaluate> based on the inputs of the function

            if (containsNaN(mathChild.stateValues.value.tree)) {
              return { setValue: { haveNaNChildToReevaluate: true } };
            }
          }
        }
        return { setValue: { haveNaNChildToReevaluate: false } };
      },
    };

    stateVariableDefinitions.formula = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      defaultValue: me.fromAst(0),
      hasEssential: true,
      returnDependencies: () => ({
        mathChild: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value", "formula"],
          variablesOptional: true,
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["formula"],
        },
        isInterpolatedFunction: {
          dependencyType: "stateVariable",
          variableName: "isInterpolatedFunction",
        },
        haveNaNChildToReevaluate: {
          dependencyType: "stateVariable",
          variableName: "haveNaNChildToReevaluate",
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {
        if (dependencyValues.isInterpolatedFunction) {
          return { setValue: { formula: me.fromAst("\uff3f") } };
        } else if (dependencyValues.mathChild.length > 0) {
          if (dependencyValues.haveNaNChildToReevaluate) {
            return { setValue: { formula: me.fromAst("\uff3f") } };
          } else {
            return {
              setValue: {
                formula: dependencyValues.mathChild[0].stateValues.value,
              },
            };
          }
        } else if (
          dependencyValues.functionChild.length > 0 &&
          !usedDefault.functionChild[0].formula
        ) {
          return {
            setValue: {
              formula: dependencyValues.functionChild[0].stateValues.formula,
            },
          };
        } else {
          return {
            useEssentialOrDefaultValue: { formula: true },
          };
        }
      },
    };

    // variables for interpolated function

    stateVariableDefinitions.numPrescribedPoints = {
      returnDependencies: () => ({
        through: {
          dependencyType: "attributeComponent",
          attributeName: "through",
          variableNames: ["numPoints"],
        },
      }),
      definition({ dependencyValues }) {
        let numPrescribedPoints = 0;
        if (dependencyValues.through !== null) {
          numPrescribedPoints = dependencyValues.through.stateValues.numPoints;
        }
        return {
          setValue: { numPrescribedPoints },
        };
      },
    };

    stateVariableDefinitions.prescribedPoints = {
      isArray: true,
      entryPrefixes: ["prescribedPoint"],
      returnArraySizeDependencies: () => ({
        numPrescribedPoints: {
          dependencyType: "stateVariable",
          variableName: "numPrescribedPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numPrescribedPoints];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let pointNum = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            through: {
              dependencyType: "attributeComponent",
              attributeName: "through",
              variableNames: ["point" + pointNum],
            },
            throughSlopes: {
              dependencyType: "attributeComponent",
              attributeName: "throughSlopes",
              variableNames: ["math" + pointNum],
            },
          };
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        // console.log('array definition of prescribed points')
        // console.log(dependencyValuesByKey);
        // console.log(arrayKeys)

        let prescribedPoints = {};

        for (let arrayKey of arrayKeys) {
          let through = dependencyValuesByKey[arrayKey].through;
          if (through !== null) {
            let pointNum = Number(arrayKey) + 1;
            let point = through.stateValues["point" + pointNum];
            let slope = null;

            let throughSlopes = dependencyValuesByKey[arrayKey].throughSlopes;
            if (throughSlopes !== null) {
              slope = throughSlopes.stateValues["math" + pointNum];
              if (slope === undefined) {
                slope = null;
              }
            }

            prescribedPoints[arrayKey] = {
              x: point[0],
              y: point[1],
              slope,
            };
          }
        }
        return { setValue: { prescribedPoints } };
      },
    };

    stateVariableDefinitions.prescribedMinima = {
      returnDependencies: () => ({
        minima: {
          dependencyType: "attributeComponent",
          attributeName: "minima",
          variableNames: ["extrema"],
        },
      }),
      definition({ dependencyValues }) {
        let prescribedMinima = [];
        if (dependencyValues.minima !== null) {
          prescribedMinima = dependencyValues.minima.stateValues.extrema.map(
            (v) => ({
              x: v[0],
              y: v[1],
            }),
          );
        }
        return {
          setValue: { prescribedMinima },
        };
      },
    };

    stateVariableDefinitions.prescribedMaxima = {
      returnDependencies: () => ({
        maxima: {
          dependencyType: "attributeComponent",
          attributeName: "maxima",
          variableNames: ["extrema"],
        },
      }),
      definition({ dependencyValues }) {
        let prescribedMaxima = [];
        if (dependencyValues.maxima !== null) {
          prescribedMaxima = dependencyValues.maxima.stateValues.extrema.map(
            (v) => ({
              x: v[0],
              y: v[1],
            }),
          );
        }
        return {
          setValue: { prescribedMaxima },
        };
      },
    };

    stateVariableDefinitions.prescribedExtrema = {
      returnDependencies: () => ({
        extrema: {
          dependencyType: "attributeComponent",
          attributeName: "extrema",
          variableNames: ["extrema"],
        },
      }),
      definition({ dependencyValues }) {
        let prescribedExtrema = [];
        if (dependencyValues.extrema !== null) {
          prescribedExtrema = dependencyValues.extrema.stateValues.extrema.map(
            (v) => ({
              x: v[0],
              y: v[1],
            }),
          );
        }
        return {
          setValue: { prescribedExtrema },
        };
      },
    };

    stateVariableDefinitions.interpolationPoints = {
      returnDependencies: () => ({
        xscale: {
          dependencyType: "stateVariable",
          variableName: "xscale",
        },
        yscale: {
          dependencyType: "stateVariable",
          variableName: "yscale",
        },
        prescribedPoints: {
          dependencyType: "stateVariable",
          variableName: "prescribedPoints",
        },
        prescribedMinima: {
          dependencyType: "stateVariable",
          variableName: "prescribedMinima",
        },
        prescribedMaxima: {
          dependencyType: "stateVariable",
          variableName: "prescribedMaxima",
        },
        prescribedExtrema: {
          dependencyType: "stateVariable",
          variableName: "prescribedExtrema",
        },
      }),
      definition: ({ dependencyValues }) =>
        calculateInterpolationPoints({ dependencyValues, numerics }),
    };

    stateVariableDefinitions.xs = {
      additionalStateVariablesDefined: ["coeffs"],
      returnDependencies: () => ({
        interpolationPoints: {
          dependencyType: "stateVariable",
          variableName: "interpolationPoints",
        },
      }),
      definition: computeSplineParamCoeffs,
    };

    stateVariableDefinitions.symbolicfs = {
      isArray: true,
      entryPrefixes: ["symbolicf"],
      stateVariablesDeterminingDependencies: [
        "isInterpolatedFunction",
        "mathChildName",
        "mathChildCreatedBySugar",
      ],
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
        if (stateValues.isInterpolatedFunction) {
          return {
            globalDependencies: {
              xs: {
                dependencyType: "stateVariable",
                variableName: "xs",
              },
              coeffs: {
                dependencyType: "stateVariable",
                variableName: "coeffs",
              },
              interpolationPoints: {
                dependencyType: "stateVariable",
                variableName: "interpolationPoints",
              },
              isInterpolatedFunction: {
                dependencyType: "stateVariable",
                variableName: "isInterpolatedFunction",
              },
              domain: {
                dependencyType: "stateVariable",
                variableName: "domain",
              },
            },
          };
        } else {
          let globalDependencies = {
            formula: {
              dependencyType: "stateVariable",
              variableName: "formula",
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables",
            },
            numInputs: {
              dependencyType: "stateVariable",
              variableName: "numInputs",
            },
            functionChild: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["symbolicfs"],
            },
            simplify: {
              dependencyType: "stateVariable",
              variableName: "simplify",
            },
            expand: {
              dependencyType: "stateVariable",
              variableName: "expand",
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction",
            },
            symbolicfShadow: {
              dependencyType: "stateVariable",
              variableName: "symbolicfShadow",
            },
            numericalfShadow: {
              dependencyType: "stateVariable",
              variableName: "numericalfShadow",
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain",
            },
          };

          if (stateValues.mathChildName) {
            if (stateValues.mathChildCreatedBySugar) {
              globalDependencies.mathChildExpressionWithCodes = {
                dependencyType: "stateVariable",
                componentName: stateValues.mathChildName,
                variableName: "expressionWithCodes",
              };
              globalDependencies.mathChildMathChildren = {
                dependencyType: "child",
                parentName: stateValues.mathChildName,
                childGroups: ["maths"],
                variableNames: ["value", "fReevaluate", "inputMaths"],
                variablesOptional: true,
              };
              globalDependencies.mathChildCodePre = {
                dependencyType: "stateVariable",
                componentName: stateValues.mathChildName,
                variableName: "codePre",
              };
            } else {
              globalDependencies.mathChild = {
                dependencyType: "child",
                childGroups: ["maths"],
                variableNames: ["value", "fReevaluate", "inputMaths"],
                variablesOptional: true,
              };
            }
          }

          return { globalDependencies };
        }
      },
      arrayDefinitionByKey: function ({
        globalDependencyValues,
        usedDefault,
        arrayKeys,
      }) {
        if (globalDependencyValues.isInterpolatedFunction) {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            if (arrayKey === "0") {
              let numericalf = returnInterpolatedFunction({
                xs: globalDependencyValues.xs,
                coeffs: globalDependencyValues.coeffs,
                interpolationPoints: globalDependencyValues.interpolationPoints,
                domain: globalDependencyValues.domain,
              });
              symbolicfs[arrayKey] = function (x) {
                let val = x.evaluate_to_constant();
                return me.fromAst(numericalf(val));
              };
            } else {
              symbolicfs[arrayKey] = (x) => me.fromAst("\uff3f");
            }
          }
          return {
            setValue: { symbolicfs },
          };
        } else if (globalDependencyValues.functionChild.length > 0) {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            symbolicfs[arrayKey] =
              globalDependencyValues.functionChild[0].stateValues.symbolicfs[
                arrayKey
              ];
          }
          return {
            setValue: { symbolicfs },
          };
        } else if (!usedDefault.formula) {
          // Have mathChildMathChildren only if the math child was created by sugar.
          // In this case, the children of the math child were specified as direct
          // children of the function.
          // If any of those children is an <evaluate> (i.e., have fReevaluate state variable)
          // and has a variable in its input that is a function variable,
          // then when evaluating the function, we will reevaluate the <evaluate>
          // using the values of the variables passed to the function
          if (globalDependencyValues.mathChildMathChildren?.length > 0) {
            let variables = globalDependencyValues.variables.map(
              (x) => x.subscripts_to_strings().tree,
            );

            let evaluateChildrenToReevaluate = {};
            let needToReevaluate = false;

            let codePre = globalDependencyValues.mathChildCodePre;
            let subsMapping = {};

            // Formula is based on a math child that has math children.
            // Check to see if any of those children are evaluates whose inputs contain a variable
            for (let [
              ind,
              mathGrandChild,
            ] of globalDependencyValues.mathChildMathChildren.entries()) {
              if (mathGrandChild.stateValues.fReevaluate) {
                let inputVariables =
                  mathGrandChild.stateValues.inputMaths.reduce(
                    (a, c) => [...a, ...c.subscripts_to_strings().variables()],
                    [],
                  );

                if (inputVariables.some((invar) => variables.includes(invar))) {
                  // The inputMaths to the <evaluate> contain a function variable.
                  // In this case, we won't use the value state variable
                  // but instead will reevaluate.
                  // Create a data structure with the info we'll need to reevaluate on function evaluation
                  evaluateChildrenToReevaluate[codePre + ind] = {
                    fReevaluate: mathGrandChild.stateValues.fReevaluate,
                    inputMathFs: mathGrandChild.stateValues.inputMaths.map(
                      (x) => x.subscripts_to_strings().f(),
                    ),
                  };
                  needToReevaluate = true;
                } else {
                  // Just use the precomputed value of the <evaluate>
                  // Add that value to the subsMapping in case we are recreating the formula
                  // due to a reevaluation for another <evaluate>
                  subsMapping[codePre + ind] = mathGrandChild.stateValues.value;
                }
              } else {
                // We have a <math> that isn't an <evaluate>.
                // Add its value to subsMapping in case we are recreating the fomrulat
                // due to a reevaluation for an <evaluate>
                subsMapping[codePre + ind] = mathGrandChild.stateValues.value;
              }
            }

            if (needToReevaluate) {
              // We found one <evaluate> that needs to be reevaluated

              // For all values that don't need to be reevaluated,
              // substitute them directly into the expressionWithCodes for the formula.

              let formulaExpressionWithCodes =
                globalDependencyValues.mathChildExpressionWithCodes;
              if (Object.keys(subsMapping).length > 0) {
                formulaExpressionWithCodes =
                  formulaExpressionWithCodes.substitute(subsMapping);
              }

              formulaExpressionWithCodes = me.fromAst(
                mergeListsWithOtherContainers(formulaExpressionWithCodes.tree),
              );

              // At this point, formulaExpressionWithCodes contains only those codes from
              // <evaluate>s that need to be reevaluated.
              // evaluateChildrenToReevaluate contains information for reevaluating those <evaluates>
              // based on the inputs passed to the function
              let symbolicfs = {};
              for (let arrayKey of arrayKeys) {
                symbolicfs[arrayKey] =
                  returnSymbolicFunctionFromReevaluatedFormula({
                    formulaExpressionWithCodes,
                    evaluateChildrenToReevaluate,
                    simplify: globalDependencyValues.simplify,
                    expand: globalDependencyValues.expand,
                    numInputs: globalDependencyValues.numInputs,
                    variables: globalDependencyValues.variables,
                    domain: globalDependencyValues.domain,
                    component: arrayKey,
                  });
              }
              return {
                setValue: { symbolicfs },
              };
            }
          } else if (
            globalDependencyValues.mathChild?.[0].stateValues.fReevaluate
          ) {
            // We have a single mathChild that is an <evaluate>
            // that was not added via sugar,
            // i.e., it was a direct child of the <function>.

            let variables = globalDependencyValues.variables.map(
              (x) => x.subscripts_to_strings().tree,
            );

            let mathChild = globalDependencyValues.mathChild[0];
            let inputVariables = mathChild.stateValues.inputMaths.reduce(
              (a, c) => [...a, ...c.subscripts_to_strings().variables()],
              [],
            );

            if (inputVariables.some((invar) => variables.includes(invar))) {
              // The inputMaths to the <evaluate> contain a function variable.
              // This sole <evaluate> is the only component to the function's formula,
              // so we need to reevaluate the <evaluate> based on the inputs of the function

              // So that we can reuse returnNumericalFunctionFromReevaluatedFormula,
              // we create a fake formulaExpressionWithCodes just containing a code for the evaluate
              let formulaExpressionWithCodes = me.fromAst("code");

              // We create the same data structure for the reevaluation, as above

              let evaluateChildrenToReevaluate = {
                code: {
                  fReevaluate: mathChild.stateValues.fReevaluate,
                  inputMathFs: mathChild.stateValues.inputMaths.map((x) =>
                    x.subscripts_to_strings().f(),
                  ),
                },
              };

              let symbolicfs = {};
              for (let arrayKey of arrayKeys) {
                symbolicfs[arrayKey] =
                  returnSymbolicFunctionFromReevaluatedFormula({
                    formulaExpressionWithCodes,
                    evaluateChildrenToReevaluate,
                    simplify: globalDependencyValues.simplify,
                    expand: globalDependencyValues.expand,
                    numInputs: globalDependencyValues.numInputs,
                    variables: globalDependencyValues.variables,
                    domain: globalDependencyValues.domain,
                    component: arrayKey,
                  });
              }
              return {
                setValue: { symbolicfs },
              };
            }
          }

          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            symbolicfs[arrayKey] = returnSymbolicFunctionFromFormula({
              formula: globalDependencyValues.formula,
              simplify: globalDependencyValues.simplify,
              expand: globalDependencyValues.expand,
              numInputs: globalDependencyValues.numInputs,
              variables: globalDependencyValues.variables,
              domain: globalDependencyValues.domain,
              component: arrayKey,
            });
          }
          return {
            setValue: { symbolicfs },
          };
        } else if (globalDependencyValues.symbolicfShadow) {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            if (arrayKey === "0") {
              symbolicfs[arrayKey] = globalDependencyValues.symbolicfShadow;
            } else {
              symbolicfs[arrayKey] = (x) => me.fromAst("\uff3f");
            }
          }
          return {
            setValue: { symbolicfs },
          };
        } else if (globalDependencyValues.numericalfShadow) {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            if (arrayKey === "0") {
              symbolicfs[arrayKey] = function (x) {
                let input = x.evaluate_to_constant();
                return me.fromAst(
                  globalDependencyValues.numericalfShadow(input),
                );
              };
            } else {
              symbolicfs[arrayKey] = (x) => me.fromAst("\uff3f");
            }
          }
          return {
            setValue: { symbolicfs },
          };
        } else {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            symbolicfs[arrayKey] = returnSymbolicFunctionFromFormula({
              formula: globalDependencyValues.formula,
              simplify: globalDependencyValues.simplify,
              expand: globalDependencyValues.expand,
              numInputs: globalDependencyValues.numInputs,
              variables: globalDependencyValues.variables,
              domain: globalDependencyValues.domain,
              component: arrayKey,
            });
          }
          return {
            setValue: { symbolicfs },
          };
        }
      },
    };

    stateVariableDefinitions.symbolicf = {
      isAlias: true,
      targetVariableName: "symbolicf1",
    };

    stateVariableDefinitions.numericalfs = {
      isArray: true,
      entryPrefixes: ["numericalf"],
      stateVariablesDeterminingDependencies: [
        "isInterpolatedFunction",
        "mathChildName",
        "mathChildCreatedBySugar",
      ],
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
        if (stateValues.isInterpolatedFunction) {
          return {
            globalDependencies: {
              xs: {
                dependencyType: "stateVariable",
                variableName: "xs",
              },
              coeffs: {
                dependencyType: "stateVariable",
                variableName: "coeffs",
              },
              interpolationPoints: {
                dependencyType: "stateVariable",
                variableName: "interpolationPoints",
              },
              isInterpolatedFunction: {
                dependencyType: "stateVariable",
                variableName: "isInterpolatedFunction",
              },
              domain: {
                dependencyType: "stateVariable",
                variableName: "domain",
              },
            },
          };
        } else {
          let globalDependencies = {
            formula: {
              dependencyType: "stateVariable",
              variableName: "formula",
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables",
            },
            numInputs: {
              dependencyType: "stateVariable",
              variableName: "numInputs",
            },
            functionChild: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["numericalfs"],
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction",
            },
            symbolicfShadow: {
              dependencyType: "stateVariable",
              variableName: "symbolicfShadow",
            },
            numericalfShadow: {
              dependencyType: "stateVariable",
              variableName: "numericalfShadow",
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain",
            },
          };

          if (stateValues.mathChildName) {
            if (stateValues.mathChildCreatedBySugar) {
              globalDependencies.mathChildExpressionWithCodes = {
                dependencyType: "stateVariable",
                componentName: stateValues.mathChildName,
                variableName: "expressionWithCodes",
              };
              globalDependencies.mathChildMathChildren = {
                dependencyType: "child",
                parentName: stateValues.mathChildName,
                childGroups: ["maths"],
                variableNames: ["value", "fReevaluate", "inputMaths"],
                variablesOptional: true,
              };
              globalDependencies.mathChildCodePre = {
                dependencyType: "stateVariable",
                componentName: stateValues.mathChildName,
                variableName: "codePre",
              };
            } else {
              globalDependencies.mathChild = {
                dependencyType: "child",
                childGroups: ["maths"],
                variableNames: ["value", "fReevaluate", "inputMaths"],
                variablesOptional: true,
              };
            }
          }

          return { globalDependencies };
        }
      },
      arrayDefinitionByKey: function ({
        globalDependencyValues,
        usedDefault,
        arrayKeys,
      }) {
        if (globalDependencyValues.isInterpolatedFunction) {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            if (arrayKey === "0") {
              numericalfs[arrayKey] = returnInterpolatedFunction({
                xs: globalDependencyValues.xs,
                coeffs: globalDependencyValues.coeffs,
                interpolationPoints: globalDependencyValues.interpolationPoints,
                domain: globalDependencyValues.domain,
              });
            } else {
              numericalfs[arrayKey] = (x) => me.fromAst("\uff3f");
            }
          }
          return {
            setValue: { numericalfs },
          };
        } else if (globalDependencyValues.functionChild.length > 0) {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            numericalfs[arrayKey] =
              globalDependencyValues.functionChild[0].stateValues.numericalfs[
                arrayKey
              ];
          }
          return {
            setValue: { numericalfs },
          };
        } else if (!usedDefault.formula) {
          // Have mathChildMathChildren only if the math child was created by sugar.
          // In this case, the children of the math child were specified as direct
          // children of the function.
          // If any of those children is an <evaluate> (i.e., have fReevaluate state variable)
          // and has a variable in its input that is a function variable,
          // then when evaluating the function, we will reevaluate the <evaluate>
          // using the values of the variables passed to the function
          if (globalDependencyValues.mathChildMathChildren?.length > 0) {
            let variables = globalDependencyValues.variables.map(
              (x) => x.subscripts_to_strings().tree,
            );

            let evaluateChildrenToReevaluate = {};
            let needToReevaluate = false;

            let codePre = globalDependencyValues.mathChildCodePre;
            let subsMapping = {};

            // Formula is based on a math child that has math children.
            // Check to see if any of those children are evaluates whose inputs contain a variable
            for (let [
              ind,
              mathGrandChild,
            ] of globalDependencyValues.mathChildMathChildren.entries()) {
              if (mathGrandChild.stateValues.fReevaluate) {
                let inputVariables =
                  mathGrandChild.stateValues.inputMaths.reduce(
                    (a, c) => [...a, ...c.subscripts_to_strings().variables()],
                    [],
                  );

                if (inputVariables.some((invar) => variables.includes(invar))) {
                  // The inputMaths to the <evaluate> contain a function variable.
                  // In this case, we won't use the value state variable
                  // but instead will reevaluate.
                  // Create a data structure with the info we'll need to reevaluate on function evaluation
                  evaluateChildrenToReevaluate[codePre + ind] = {
                    fReevaluate: mathGrandChild.stateValues.fReevaluate,
                    inputMathFs: mathGrandChild.stateValues.inputMaths.map(
                      (x) => x.subscripts_to_strings().f(),
                    ),
                  };
                  needToReevaluate = true;
                } else {
                  // Just use the precomputed value of the <evaluate>
                  // Add that value to the subsMapping in case we are recreating the formula
                  // due to a reevaluation for another <evaluate>
                  subsMapping[codePre + ind] = mathGrandChild.stateValues.value;
                }
              } else {
                // We have a <math> that isn't an <evaluate>.
                // Add its value to subsMapping in case we are recreating the fomrulat
                // due to a reevaluation for an <evaluate>
                subsMapping[codePre + ind] = mathGrandChild.stateValues.value;
              }
            }

            if (needToReevaluate) {
              // We found one <evaluate> that needs to be reevaluated

              // For all values that don't need to be reevaluated,
              // substitute them directly into the expressionWithCodes for the formula.

              let formulaExpressionWithCodes =
                globalDependencyValues.mathChildExpressionWithCodes;
              if (Object.keys(subsMapping).length > 0) {
                formulaExpressionWithCodes =
                  formulaExpressionWithCodes.substitute(subsMapping);
              }

              formulaExpressionWithCodes = me.fromAst(
                mergeListsWithOtherContainers(formulaExpressionWithCodes.tree),
              );

              // At this point, formulaExpressionWithCodes contains only those codes from
              // <evaluate>s that need to be reevaluated.
              // evaluateChildrenToReevaluate contains information for reevaluating those <evaluates>
              // based on the inputs passed to the function
              let numericalfs = {};
              for (let arrayKey of arrayKeys) {
                numericalfs[arrayKey] =
                  returnNumericalFunctionFromReevaluatedFormula({
                    formulaExpressionWithCodes,
                    evaluateChildrenToReevaluate,
                    numInputs: globalDependencyValues.numInputs,
                    variables: globalDependencyValues.variables,
                    domain: globalDependencyValues.domain,
                    component: arrayKey,
                  });
              }
              return {
                setValue: { numericalfs },
              };
            }
          } else if (
            globalDependencyValues.mathChild?.[0].stateValues.fReevaluate
          ) {
            // We have a single mathChild that is an <evaluate>
            // that was not added via sugar,
            // i.e., it was a direct child of the <function>.

            let variables = globalDependencyValues.variables.map(
              (x) => x.subscripts_to_strings().tree,
            );

            let mathChild = globalDependencyValues.mathChild[0];
            let inputVariables = mathChild.stateValues.inputMaths.reduce(
              (a, c) => [...a, ...c.subscripts_to_strings().variables()],
              [],
            );

            if (inputVariables.some((invar) => variables.includes(invar))) {
              // The inputMaths to the <evaluate> contain a function variable.
              // This sole <evaluate> is the only component to the function's formula,
              // so we need to reevaluate the <evaluate> based on the inputs of the function

              // So that we can reuse returnNumericalFunctionFromReevaluatedFormula,
              // we create a fake formulaExpressionWithCodes just containing a code for the evaluate
              let formulaExpressionWithCodes = me.fromAst("code");

              // We create the same data structure for the reevaluation, as above

              let evaluateChildrenToReevaluate = {
                code: {
                  fReevaluate: mathChild.stateValues.fReevaluate,
                  inputMathFs: mathChild.stateValues.inputMaths.map((x) =>
                    x.subscripts_to_strings().f(),
                  ),
                },
              };

              let numericalfs = {};
              for (let arrayKey of arrayKeys) {
                numericalfs[arrayKey] =
                  returnNumericalFunctionFromReevaluatedFormula({
                    formulaExpressionWithCodes,
                    evaluateChildrenToReevaluate,
                    numInputs: globalDependencyValues.numInputs,
                    variables: globalDependencyValues.variables,
                    domain: globalDependencyValues.domain,
                    component: arrayKey,
                  });
              }
              return {
                setValue: { numericalfs },
              };
            }
          }

          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            numericalfs[arrayKey] = returnNumericalFunctionFromFormula({
              formula: globalDependencyValues.formula,
              numInputs: globalDependencyValues.numInputs,
              variables: globalDependencyValues.variables,
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
            numericalfs[arrayKey] = returnNumericalFunctionFromFormula({
              formula: globalDependencyValues.formula,
              numInputs: globalDependencyValues.numInputs,
              variables: globalDependencyValues.variables,
              domain: globalDependencyValues.domain,
              component: arrayKey,
            });
          }
          return {
            setValue: { numericalfs },
          };
        }
      },
    };

    // rather than use alias, create actual numericalf
    // state variable as we use it for an adapter
    stateVariableDefinitions.numericalf = {
      returnDependencies: () => ({
        numericalf1: {
          dependencyType: "stateVariable",
          variableName: "numericalf1",
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { numericalf: dependencyValues.numericalf1 } };
      },
    };

    stateVariableDefinitions.fDefinitions = {
      isArray: true,
      entryPrefixes: ["fDefinition"],
      stateVariablesDeterminingDependencies: [
        "isInterpolatedFunction",
        "mathChildName",
        "mathChildCreatedBySugar",
      ],
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
        if (stateValues.isInterpolatedFunction) {
          return {
            globalDependencies: {
              xs: {
                dependencyType: "stateVariable",
                variableName: "xs",
              },
              coeffs: {
                dependencyType: "stateVariable",
                variableName: "coeffs",
              },
              interpolationPoints: {
                dependencyType: "stateVariable",
                variableName: "interpolationPoints",
              },
              isInterpolatedFunction: {
                dependencyType: "stateVariable",
                variableName: "isInterpolatedFunction",
              },
              domain: {
                dependencyType: "stateVariable",
                variableName: "domain",
              },
            },
          };
        } else {
          let globalDependencies = {
            formula: {
              dependencyType: "stateVariable",
              variableName: "formula",
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables",
            },
            numInputs: {
              dependencyType: "stateVariable",
              variableName: "numInputs",
            },
            functionChild: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["fDefinitions"],
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction",
            },
            symbolicfShadow: {
              dependencyType: "stateVariable",
              variableName: "symbolicfShadow",
            },
            numericalfShadow: {
              dependencyType: "stateVariable",
              variableName: "numericalfShadow",
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain",
            },
          };

          if (stateValues.mathChildName) {
            if (stateValues.mathChildCreatedBySugar) {
              globalDependencies.mathChildExpressionWithCodes = {
                dependencyType: "stateVariable",
                componentName: stateValues.mathChildName,
                variableName: "expressionWithCodes",
              };
              globalDependencies.mathChildMathChildren = {
                dependencyType: "child",
                parentName: stateValues.mathChildName,
                childGroups: ["maths"],
                variableNames: ["value", "fReevaluateDefinition", "inputMaths"],
                variablesOptional: true,
              };
              globalDependencies.mathChildCodePre = {
                dependencyType: "stateVariable",
                componentName: stateValues.mathChildName,
                variableName: "codePre",
              };
            } else {
              globalDependencies.mathChild = {
                dependencyType: "child",
                childGroups: ["maths"],
                variableNames: ["value", "fReevaluateDefinition", "inputMaths"],
                variablesOptional: true,
              };
            }
          }

          return { globalDependencies };
        }
      },
      arrayDefinitionByKey: function ({
        globalDependencyValues,
        usedDefault,
        arrayKeys,
      }) {
        if (globalDependencyValues.isInterpolatedFunction) {
          let fDefinitions = {};
          for (let arrayKey of arrayKeys) {
            if (arrayKey === "0") {
              fDefinitions[arrayKey] = {
                functionType: "interpolated",
                xs: globalDependencyValues.xs,
                coeffs: globalDependencyValues.coeffs,
                interpolationPoints: globalDependencyValues.interpolationPoints,
                domain: globalDependencyValues.domain
                  ? globalDependencyValues.domain.map((x) => x.tree)
                  : null,
              };
            } else {
              fDefinitions[arrayKey] = {};
            }
          }
          return {
            setValue: { fDefinitions },
          };
        } else if (globalDependencyValues.functionChild.length > 0) {
          let fDefinitions = {};
          for (let arrayKey of arrayKeys) {
            fDefinitions[arrayKey] =
              globalDependencyValues.functionChild[0].stateValues.fDefinitions[
                arrayKey
              ];
          }
          return {
            setValue: { fDefinitions },
          };
        } else if (!usedDefault.formula) {
          // Have mathChildMathChildren only if the math child was created by sugar.
          // In this case, the children of the math child were specified as direct
          // children of the function.
          // If any of those children is an <evaluate> (i.e., have fReevaluate state variable)
          // and has a variable in its input that is a function variable,
          // then when evaluating the function, we will reevaluate the <evaluate>
          // using the values of the variables passed to the function
          if (globalDependencyValues.mathChildMathChildren?.length > 0) {
            let variables = globalDependencyValues.variables.map(
              (x) => x.subscripts_to_strings().tree,
            );

            let evaluateChildrenToReevaluate = {};
            let needToReevaluate = false;

            let codePre = globalDependencyValues.mathChildCodePre;
            let subsMapping = {};

            // Formula is based on a math child that has math children.
            // Check to see if any of those children are evaluates whose inputs are a variable
            for (let [
              ind,
              mathGrandChild,
            ] of globalDependencyValues.mathChildMathChildren.entries()) {
              if (mathGrandChild.stateValues.fReevaluateDefinition) {
                let inputVariables =
                  mathGrandChild.stateValues.inputMaths.reduce(
                    (a, c) => [...a, ...c.subscripts_to_strings().variables()],
                    [],
                  );

                if (inputVariables.some((invar) => variables.includes(invar))) {
                  // The inputMaths to the <evaluate> contain a function variable.
                  // In this case, we won't use the value state variable
                  // but instead will reevaluate.
                  // Create a data structure with the info we'll need to reevaluate on function evaluation
                  evaluateChildrenToReevaluate[codePre + ind] = {
                    fReevaluateDefinition:
                      mathGrandChild.stateValues.fReevaluateDefinition,
                    inputMaths: mathGrandChild.stateValues.inputMaths,
                  };
                  needToReevaluate = true;
                } else {
                  // Just use the precomputed value of the <evaluate>
                  // Add that value to the subsMapping in case we are recreating the formula
                  // due to a reevaluation for another <evaluate>
                  subsMapping[codePre + ind] = mathGrandChild.stateValues.value;
                }
              } else {
                // We have a <math> that isn't an <evaluate>.
                // Add its value to subsMapping in case we are recreating the fomrulat
                // due to a reevaluation for an <evaluate>
                subsMapping[codePre + ind] = mathGrandChild.stateValues.value;
              }
            }

            if (needToReevaluate) {
              // We found one <evaluate> that needs to be reevaluated

              // For all values that don't need to be reevaluated,
              // substitute them directly into the expressionWithCodes for the formula.

              let formulaExpressionWithCodes =
                globalDependencyValues.mathChildExpressionWithCodes;
              if (Object.keys(subsMapping).length > 0) {
                formulaExpressionWithCodes =
                  formulaExpressionWithCodes.substitute(subsMapping);
              }

              formulaExpressionWithCodes = me.fromAst(
                mergeListsWithOtherContainers(formulaExpressionWithCodes.tree),
              );

              // At this point, formulaExpressionWithCodes contains only those codes from
              // <evaluate>s that need to be reevaluated.
              // evaluateChildrenToReevaluate contains information for reevaluating those <evaluates>
              // based on the inputs passed to the function

              let fDefinitions = {};

              for (let arrayKey of arrayKeys) {
                fDefinitions[arrayKey] = {
                  functionType: "reevaluatedFormula",
                  formulaExpressionWithCodes,
                  evaluateChildrenToReevaluate,
                  numInputs: globalDependencyValues.numInputs,
                  variables: globalDependencyValues.variables.map(
                    (x) => x.tree,
                  ),
                  domain: globalDependencyValues.domain
                    ? globalDependencyValues.domain.map((x) => x.tree)
                    : null,
                  component: arrayKey,
                };
              }
              return {
                setValue: { fDefinitions },
              };
            }
          } else if (
            globalDependencyValues.mathChild?.[0].stateValues
              .fReevaluateDefinition
          ) {
            // We have a single mathChild that is an <evaluate>
            // that was not added via sugar,
            // i.e., it was a direct child of the <function>.

            let variables = globalDependencyValues.variables.map(
              (x) => x.subscripts_to_strings().tree,
            );

            let mathChild = globalDependencyValues.mathChild[0];
            let inputVariables = mathChild.stateValues.inputMaths.reduce(
              (a, c) => [...a, ...c.subscripts_to_strings().variables()],
              [],
            );

            if (inputVariables.some((invar) => variables.includes(invar))) {
              // The inputMaths to the <evaluate> contain a function variable.
              // This sole <evaluate> is the only component to the function's formula,
              // so we need to reevaluate the <evaluate> based on the inputs of the function

              // So that we can reuse returnNumericalFunctionFromReevaluatedFormula,
              // we create a fake formulaExpressionWithCodes just containing a code for the evaluate
              let formulaExpressionWithCodes = me.fromAst("code");

              // We create the same data structure for the reevaluation, as above

              let evaluateChildrenToReevaluate = {
                code: {
                  fReevaluateDefinition:
                    mathChild.stateValues.fReevaluateDefinition,
                  inputMaths: mathChild.stateValues.inputMaths,
                },
              };

              let fDefinitions = {};

              for (let arrayKey of arrayKeys) {
                fDefinitions[arrayKey] = {
                  functionType: "reevaluatedFormula",
                  formulaExpressionWithCodes,
                  evaluateChildrenToReevaluate,
                  numInputs: globalDependencyValues.numInputs,
                  variables: globalDependencyValues.variables.map(
                    (x) => x.tree,
                  ),
                  domain: globalDependencyValues.domain
                    ? globalDependencyValues.domain.map((x) => x.tree)
                    : null,
                  component: arrayKey,
                };
              }
              return {
                setValue: { fDefinitions },
              };
            }
          }

          let fDefinitions = {};
          for (let arrayKey of arrayKeys) {
            fDefinitions[arrayKey] = {
              functionType: "formula",
              formula: globalDependencyValues.formula.tree,
              variables: globalDependencyValues.variables.map((x) => x.tree),
              numInputs: globalDependencyValues.numInputs,
              numOutputs: globalDependencyValues.numOutputs,
              domain: globalDependencyValues.domain
                ? globalDependencyValues.domain.map((x) => x.tree)
                : null,
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
        } else if (globalDependencyValues.symbolicfShadow) {
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
            fDefinitions[arrayKey] = {
              functionType: "formula",
              formula: globalDependencyValues.formula.tree,
              variables: globalDependencyValues.variables.map((x) => x.tree),
              numInputs: globalDependencyValues.numInputs,
              numOutputs: globalDependencyValues.numOutputs,
              domain: globalDependencyValues.domain
                ? globalDependencyValues.domain.map((x) => x.tree)
                : null,
              component: arrayKey,
            };
          }
          return {
            setValue: { fDefinitions },
          };
        }
      },
    };

    stateVariableDefinitions.fDefinition = {
      isAlias: true,
      targetVariableName: "fDefinition1",
    };

    stateVariableDefinitions.fs = {
      isArray: true,
      entryPrefixes: ["f"],
      returnArraySizeDependencies: () => ({
        numOutputs: {
          dependencyType: "stateVariable",
          variableName: "numOutputs",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numOutputs];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          symbolic: {
            dependencyType: "stateVariable",
            variableName: "symbolic",
          },
        };

        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            symbolicf: {
              dependencyType: "stateVariable",
              variableName: "symbolicf" + varEnding,
            },
            numericalf: {
              dependencyType: "stateVariable",
              variableName: "numericalf" + varEnding,
            },
          };
        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        let fs = {};
        if (globalDependencyValues.symbolic) {
          for (let arrayKey of arrayKeys) {
            fs[arrayKey] = dependencyValuesByKey[arrayKey].symbolicf;
          }
        } else {
          for (let arrayKey of arrayKeys) {
            fs[arrayKey] = dependencyValuesByKey[arrayKey].numericalf;
          }
        }
        return { setValue: { fs } };
      },
    };

    stateVariableDefinitions.f = {
      isAlias: true,
      targetVariableName: "f1",
    };

    stateVariableDefinitions.latex = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "latex",
      },
      returnDependencies: () => ({
        formula: {
          dependencyType: "stateVariable",
          variableName: "formula",
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
        let params = {};
        if (dependencyValues.padZeros) {
          if (Number.isFinite(dependencyValues.displayDecimals)) {
            params.padToDecimals = dependencyValues.displayDecimals;
          }
          if (dependencyValues.displayDigits >= 1) {
            params.padToDigits = dependencyValues.displayDigits;
          }
        }
        let latex = roundForDisplay({
          value: dependencyValues.formula,
          dependencyValues,
        }).toLatex(params);
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

    stateVariableDefinitions.allMinima = {
      stateVariablesDeterminingDependencies: ["isInterpolatedFunction"],
      additionalStateVariablesDefined: [
        "globalMinimumOption",
        "globalMinimumCompactifyDomainOption",
      ],
      returnDependencies({ stateValues }) {
        if (stateValues.isInterpolatedFunction) {
          return {
            xs: {
              dependencyType: "stateVariable",
              variableName: "xs",
            },
            coeffs: {
              dependencyType: "stateVariable",
              variableName: "coeffs",
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction",
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain",
            },
            numericalf: {
              dependencyType: "stateVariable",
              variableName: "numericalf",
            },
          };
        } else {
          return {
            numericalf: {
              dependencyType: "stateVariable",
              variableName: "numericalf",
            },
            formula: {
              dependencyType: "stateVariable",
              variableName: "formula",
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables",
            },
            xscale: {
              dependencyType: "stateVariable",
              variableName: "xscale",
            },
            functionChild: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: [
                "allMinima",
                "globalMinimumOption",
                "globalMinimumCompactifyDomainOption",
              ],
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction",
            },
            numInputs: {
              dependencyType: "stateVariable",
              variableName: "numInputs",
            },
            numOutputs: {
              dependencyType: "stateVariable",
              variableName: "numOutputs",
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain",
            },
          };
        }
      },
      definition: function ({ dependencyValues }) {
        let { localMinima, globalMinimum, globalMinimumCompactifyDomain } =
          find_local_global_minima({
            domain: dependencyValues.domain,
            xscale: dependencyValues.xscale,
            isInterpolatedFunction: dependencyValues.isInterpolatedFunction,
            xs: dependencyValues.xs,
            coeffs: dependencyValues.coeffs,
            numericalf: dependencyValues.numericalf,
            formula: dependencyValues.formula,
            variables: dependencyValues.variables,
            functionChild: dependencyValues.functionChild,
            numInputs: dependencyValues.numInputs,
            numOutputs: dependencyValues.numOutputs,
            numerics,
          });

        return {
          setValue: {
            allMinima: localMinima,
            globalMinimumOption: globalMinimum,
            globalMinimumCompactifyDomainOption: globalMinimumCompactifyDomain,
          },
        };
      },
    };

    stateVariableDefinitions.numMinima = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        allMinima: {
          dependencyType: "stateVariable",
          variableName: "allMinima",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { numMinima: dependencyValues.allMinima.length },
          checkForActualChange: { numMinima: true },
        };
      },
    };

    stateVariableDefinitions.minima = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: ["styleNumber"],
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "minimum" || prefix === undefined) {
            // minimum or entire array
            // These are points,
            // wrap inner dimension by both <point> and <xs>
            // don't wrap outer dimension (for entire array)
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          } else {
            // don't wrap minimumLocation(s) or minimumValues(s)
            return [];
          }
        },
      },
      isArray: true,
      numDimensions: 2,
      entryPrefixes: [
        "minimum",
        "minimumLocations",
        "minimumLocation",
        "minimumValues",
        "minimumValue",
      ],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (
          ["minimum", "minimumLocation", "minimumValue"].includes(
            arrayEntryPrefix,
          )
        ) {
          let pointInd = Number(varEnding) - 1;
          if (Number.isInteger(pointInd) && pointInd >= 0) {
            // If not given the array size,
            // then return the array keys assuming the array is large enough.
            // Must do this as it is used to determine potential array entries.
            if (!arraySize || pointInd < arraySize[0]) {
              if (arrayEntryPrefix === "minimum") {
                return [pointInd + ",0", pointInd + ",1"];
              } else if (arrayEntryPrefix === "minimumLocation") {
                return [pointInd + ",0"];
              } else {
                return [pointInd + ",1"];
              }
            } else {
              return [];
            }
          } else {
            return [];
          }
        } else if (arrayEntryPrefix === "minimumLocations") {
          if (varEnding !== "") {
            return [];
          }

          if (!arraySize) {
            // if don't have arraySize, just use first point assuming array size is large enough
            return ["0,0"];
          }

          // array of "i,0"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",0");
        } else if (arrayEntryPrefix === "minimumValues") {
          if (varEnding !== "") {
            return [];
          }

          if (!arraySize) {
            // if don't have arraySize, just use first point assuming array size is large enough
            return ["0,1"];
          }

          // array of "i,1"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",1");
        } else {
          return [];
        }
      },
      arrayVarNameFromArrayKey(arrayKey) {
        let [ind1, ind2] = arrayKey.split(",");

        if (ind2 === "0") {
          return "minimumLocation" + (Number(ind1) + 1);
        } else {
          return "minimumValue" + (Number(ind1) + 1);
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "minima") {
          if (propIndex.length === 1) {
            return "minimum" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            let componentNum = Number(propIndex[0]);
            if (Number.isInteger(componentNum) && componentNum > 0) {
              if (propIndex[1] === 1) {
                return "minimumLocation" + componentNum;
              } else if (propIndex[1] === 2) {
                return "minimumValue" + componentNum;
              }
            }
            return null;
          }
        }
        if (varName === "minimumLocations") {
          // if propIndex has additional entries, ignore them
          return "minimumLocation" + propIndex[0];
        }
        if (varName === "minimumValues") {
          // if propIndex has additional entries, ignore them
          return "minimumValue" + propIndex[0];
        }
        if (varName.slice(0, 7) === "minimum") {
          // could be minimum, minimumLocation, or minimumValue
          let componentNum = Number(varName.slice(7));
          if (Number.isInteger(componentNum) && componentNum > 0) {
            // if propIndex has additional entries, ignore them
            if (propIndex[0] === 1) {
              return "minimumLocation" + componentNum;
            } else if (propIndex[0] === 2) {
              return "minimumValue" + componentNum;
            }
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        numMinima: {
          dependencyType: "stateVariable",
          variableName: "numMinima",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numMinima, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allMinima: {
            dependencyType: "stateVariable",
            variableName: "allMinima",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function minima`)
        // console.log(globalDependencyValues)

        let minima = {};

        for (
          let ptInd = 0;
          ptInd < globalDependencyValues.__array_size[0];
          ptInd++
        ) {
          for (let i = 0; i < 2; i++) {
            let arrayKey = `${ptInd},${i}`;

            minima[arrayKey] = globalDependencyValues.allMinima[ptInd][i];
          }
        }

        return { setValue: { minima } };
      },
    };

    stateVariableDefinitions.globalMinimum = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: ["styleNumber"],
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === undefined) {
            // Whole array is point,
            // wrap by both <point> and <xs>
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          } else {
            // don't wrap minimumLocation(s) or minimumValues(s)
            return [];
          }
        },
      },
      isArray: true,
      entryPrefixes: ["globalMinimumLocation", "globalMinimumValue"],
      getArrayKeysFromVarName({ arrayEntryPrefix }) {
        if (arrayEntryPrefix === "globalMinimumLocation") {
          return ["0"];
        } else if (arrayEntryPrefix === "globalMinimumValue") {
          return ["1"];
        } else {
          return [];
        }
      },
      arrayVarNameFromArrayKey(arrayKey) {
        if (arrayKey === "0") {
          return "globalMinimumLocation";
        } else if (arrayKey === "1") {
          return "globalMinimumValue";
        } else {
          return "invalid";
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "globalMinimum") {
          if (propIndex.length === 1) {
            if (propIndex[0] === 1) {
              return "globalMinimumLocation";
            } else if (propIndex[0] === 2) {
              return "globalMinimumValue";
            }
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        globalMinimumOption: {
          dependencyType: "stateVariable",
          variableName: "globalMinimumOption",
        },
      }),
      returnArraySize({ dependencyValues }) {
        if (dependencyValues.globalMinimumOption) {
          return [2];
        } else {
          return [0];
        }
      },
      returnArrayDependenciesByKey() {
        return {
          globalDependencies: {
            globalMinimumOption: {
              dependencyType: "stateVariable",
              variableName: "globalMinimumOption",
            },
          },
        };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        return {
          setValue: {
            globalMinimum: globalDependencyValues.globalMinimumOption,
          },
        };
      },
    };

    stateVariableDefinitions.globalMinimumCompactifyDomain = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: ["styleNumber"],
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === undefined) {
            // Whole array is point,
            // wrap by both <point> and <xs>
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          } else {
            // don't wrap minimumLocation(s) or minimumValues(s)
            return [];
          }
        },
      },
      isArray: true,
      entryPrefixes: [
        "globalMinimumCompactifyDomainLocation",
        "globalMinimumCompactifyDomainValue",
      ],
      getArrayKeysFromVarName({ arrayEntryPrefix }) {
        if (arrayEntryPrefix === "globalMinimumCompactifyDomainLocation") {
          return ["0"];
        } else if (arrayEntryPrefix === "globalMinimumCompactifyDomainValue") {
          return ["1"];
        } else {
          return [];
        }
      },
      arrayVarNameFromArrayKey(arrayKey) {
        if (arrayKey === "0") {
          return "globalMinimumCompactifyDomainLocation";
        } else if (arrayKey === "1") {
          return "globalMinimumCompactifyDomainValue";
        } else {
          return "invalid";
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "globalMinimumCompactifyDomain") {
          if (propIndex.length === 1) {
            if (propIndex[0] === 1) {
              return "globalMinimumCompactifyDomainLocation";
            } else if (propIndex[0] === 2) {
              return "globalMinimumCompactifyDomainValue";
            }
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        globalMinimumCompactifyDomainOption: {
          dependencyType: "stateVariable",
          variableName: "globalMinimumCompactifyDomainOption",
        },
      }),
      returnArraySize({ dependencyValues }) {
        if (dependencyValues.globalMinimumCompactifyDomainOption) {
          return [2];
        } else {
          return [0];
        }
      },
      returnArrayDependenciesByKey() {
        return {
          globalDependencies: {
            globalMinimumCompactifyDomainOption: {
              dependencyType: "stateVariable",
              variableName: "globalMinimumCompactifyDomainOption",
            },
          },
        };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        return {
          setValue: {
            globalMinimumCompactifyDomain:
              globalDependencyValues.globalMinimumCompactifyDomainOption,
          },
        };
      },
    };

    stateVariableDefinitions.allMaxima = {
      stateVariablesDeterminingDependencies: ["isInterpolatedFunction"],
      additionalStateVariablesDefined: [
        "globalMaximumOption",
        "globalMaximumCompactifyDomainOption",
      ],
      returnDependencies({ stateValues }) {
        if (stateValues.isInterpolatedFunction) {
          return {
            xs: {
              dependencyType: "stateVariable",
              variableName: "xs",
            },
            coeffs: {
              dependencyType: "stateVariable",
              variableName: "coeffs",
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction",
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain",
            },
            numericalf: {
              dependencyType: "stateVariable",
              variableName: "numericalf",
            },
          };
        } else {
          return {
            numericalf: {
              dependencyType: "stateVariable",
              variableName: "numericalf",
            },
            formula: {
              dependencyType: "stateVariable",
              variableName: "formula",
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables",
            },
            xscale: {
              dependencyType: "stateVariable",
              variableName: "xscale",
            },
            functionChild: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: [
                "allMaxima",
                "globalMaximumOption",
                "globalMaximumCompactifyDomainOption",
              ],
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction",
            },
            numInputs: {
              dependencyType: "stateVariable",
              variableName: "numInputs",
            },
            numOutputs: {
              dependencyType: "stateVariable",
              variableName: "numOutputs",
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain",
            },
          };
        }
      },
      definition: function ({ dependencyValues }) {
        let { localMaxima, globalMaximum, globalMaximumCompactifyDomain } =
          find_local_global_maxima({
            domain: dependencyValues.domain,
            xscale: dependencyValues.xscale,
            isInterpolatedFunction: dependencyValues.isInterpolatedFunction,
            xs: dependencyValues.xs,
            coeffs: dependencyValues.coeffs,
            numericalf: dependencyValues.numericalf,
            formula: dependencyValues.formula,
            variables: dependencyValues.variables,
            functionChild: dependencyValues.functionChild,
            numInputs: dependencyValues.numInputs,
            numOutputs: dependencyValues.numOutputs,
            numerics,
          });

        return {
          setValue: {
            allMaxima: localMaxima,
            globalMaximumOption: globalMaximum,
            globalMaximumCompactifyDomainOption: globalMaximumCompactifyDomain,
          },
        };
      },
    };

    stateVariableDefinitions.numMaxima = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        allMaxima: {
          dependencyType: "stateVariable",
          variableName: "allMaxima",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { numMaxima: dependencyValues.allMaxima.length },
          checkForActualChange: { numMaxima: true },
        };
      },
    };

    stateVariableDefinitions.maxima = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: ["styleNumber"],
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "maximum" || prefix === undefined) {
            // maximum or entire array
            // These are points,
            // wrap inner dimension by both <point> and <xs>
            // don't wrap outer dimension (for entire array)
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          } else {
            // don't wrap maximumLocation(s) or maximumValues(s)
            return [];
          }
        },
      },
      isArray: true,
      numDimensions: 2,
      entryPrefixes: [
        "maximum",
        "maximumLocations",
        "maximumLocation",
        "maximumValues",
        "maximumValue",
      ],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (
          ["maximum", "maximumLocation", "maximumValue"].includes(
            arrayEntryPrefix,
          )
        ) {
          let pointInd = Number(varEnding) - 1;
          if (Number.isInteger(pointInd) && pointInd >= 0) {
            // If not given the array size,
            // then return the array keys assuming the array is large enough.
            // Must do this as it is used to determine potential array entries.
            if (!arraySize || pointInd < arraySize[0]) {
              if (arrayEntryPrefix === "maximum") {
                return [pointInd + ",0", pointInd + ",1"];
              } else if (arrayEntryPrefix === "maximumLocation") {
                return [pointInd + ",0"];
              } else {
                return [pointInd + ",1"];
              }
            } else {
              return [];
            }
          } else {
            return [];
          }
        } else if (arrayEntryPrefix === "maximumLocations") {
          if (varEnding !== "") {
            return [];
          }

          if (!arraySize) {
            // if don't have arraySize, just use first point assuming array size is large enough
            return ["0,0"];
          }

          // array of "i,0"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",0");
        } else if (arrayEntryPrefix === "maximumValues") {
          if (varEnding !== "") {
            return [];
          }

          if (!arraySize) {
            // if don't have arraySize, just use first point assuming array size is large enough
            return ["0,1"];
          }

          // array of "i,1"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",1");
        } else {
          return [];
        }
      },
      arrayVarNameFromArrayKey(arrayKey) {
        let [ind1, ind2] = arrayKey.split(",");

        if (ind2 === "0") {
          return "maximumLocation" + (Number(ind1) + 1);
        } else {
          return "maximumValue" + (Number(ind1) + 1);
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "maxima") {
          if (propIndex.length === 1) {
            return "maximum" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            let componentNum = Number(propIndex[0]);
            if (Number.isInteger(componentNum) && componentNum > 0) {
              if (propIndex[1] === 1) {
                return "maximumLocation" + componentNum;
              } else if (propIndex[1] === 2) {
                return "maximumValue" + componentNum;
              }
            }
            return null;
          }
        }
        if (varName === "maximumLocations") {
          // if propIndex has additional entries, ignore them
          return "maximumLocation" + propIndex[0];
        }
        if (varName === "maximumValues") {
          // if propIndex has additional entries, ignore them
          return "maximumValue" + propIndex[0];
        }
        if (varName.slice(0, 7) === "maximum") {
          // could be maximum, maximumLocation, or maximumValue
          let componentNum = Number(varName.slice(7));
          if (Number.isInteger(componentNum) && componentNum > 0) {
            // if propIndex has additional entries, ignore them
            if (propIndex[0] === 1) {
              return "maximumLocation" + componentNum;
            } else if (propIndex[0] === 2) {
              return "maximumValue" + componentNum;
            }
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        numMaxima: {
          dependencyType: "stateVariable",
          variableName: "numMaxima",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numMaxima, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allMaxima: {
            dependencyType: "stateVariable",
            variableName: "allMaxima",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function maxima`)
        // console.log(globalDependencyValues)

        let maxima = {};

        for (
          let ptInd = 0;
          ptInd < globalDependencyValues.__array_size[0];
          ptInd++
        ) {
          for (let i = 0; i < 2; i++) {
            let arrayKey = `${ptInd},${i}`;

            maxima[arrayKey] = globalDependencyValues.allMaxima[ptInd][i];
          }
        }

        return { setValue: { maxima } };
      },
    };

    stateVariableDefinitions.globalMaximum = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: ["styleNumber"],
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === undefined) {
            // Whole array is point,
            // wrap by both <point> and <xs>
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          } else {
            // don't wrap maximumLocation(s) or maximumValues(s)
            return [];
          }
        },
      },
      isArray: true,
      entryPrefixes: ["globalMaximumLocation", "globalMaximumValue"],
      getArrayKeysFromVarName({ arrayEntryPrefix }) {
        if (arrayEntryPrefix === "globalMaximumLocation") {
          return ["0"];
        } else if (arrayEntryPrefix === "globalMaximumValue") {
          return ["1"];
        } else {
          return [];
        }
      },
      arrayVarNameFromArrayKey(arrayKey) {
        if (arrayKey === "0") {
          return "globalMaximumLocation";
        } else if (arrayKey === "1") {
          return "globalMaximumValue";
        } else {
          return "invalid";
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "globalMaximum") {
          if (propIndex.length === 1) {
            if (propIndex[0] === 1) {
              return "globalMaximumLocation";
            } else if (propIndex[0] === 2) {
              return "globalMaximumValue";
            }
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        globalMaximumOption: {
          dependencyType: "stateVariable",
          variableName: "globalMaximumOption",
        },
      }),
      returnArraySize({ dependencyValues }) {
        if (dependencyValues.globalMaximumOption) {
          return [2];
        } else {
          return [0];
        }
      },
      returnArrayDependenciesByKey() {
        return {
          globalDependencies: {
            globalMaximumOption: {
              dependencyType: "stateVariable",
              variableName: "globalMaximumOption",
            },
          },
        };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        return {
          setValue: {
            globalMaximum: globalDependencyValues.globalMaximumOption,
          },
        };
      },
    };

    stateVariableDefinitions.globalMaximumCompactifyDomain = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: ["styleNumber"],
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === undefined) {
            // Whole array is point,
            // wrap by both <point> and <xs>
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          } else {
            // don't wrap maximumLocation(s) or maximumValues(s)
            return [];
          }
        },
      },
      isArray: true,
      entryPrefixes: [
        "globalMaximumCompactifyDomainLocation",
        "globalMaximumCompactifyDomainValue",
      ],
      getArrayKeysFromVarName({ arrayEntryPrefix }) {
        if (arrayEntryPrefix === "globalMaximumCompactifyDomainLocation") {
          return ["0"];
        } else if (arrayEntryPrefix === "globalMaximumCompactifyDomainValue") {
          return ["1"];
        } else {
          return [];
        }
      },
      arrayVarNameFromArrayKey(arrayKey) {
        if (arrayKey === "0") {
          return "globalMaximumCompactifyDomainLocation";
        } else if (arrayKey === "1") {
          return "globalMaximumCompactifyDomainValue";
        } else {
          return "invalid";
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "globalMaximumCompactifyDomain") {
          if (propIndex.length === 1) {
            if (propIndex[0] === 1) {
              return "globalMaximumCompactifyDomainLocation";
            } else if (propIndex[0] === 2) {
              return "globalMaximumCompactifyDomainValue";
            }
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        globalMaximumCompactifyDomainOption: {
          dependencyType: "stateVariable",
          variableName: "globalMaximumCompactifyDomainOption",
        },
      }),
      returnArraySize({ dependencyValues }) {
        if (dependencyValues.globalMaximumCompactifyDomainOption) {
          return [2];
        } else {
          return [0];
        }
      },
      returnArrayDependenciesByKey() {
        return {
          globalDependencies: {
            globalMaximumCompactifyDomainOption: {
              dependencyType: "stateVariable",
              variableName: "globalMaximumCompactifyDomainOption",
            },
          },
        };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        return {
          setValue: {
            globalMaximumCompactifyDomain:
              globalDependencyValues.globalMaximumCompactifyDomainOption,
          },
        };
      },
    };

    stateVariableDefinitions.numExtrema = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        numMinima: {
          dependencyType: "stateVariable",
          variableName: "numMinima",
        },
        numMaxima: {
          dependencyType: "stateVariable",
          variableName: "numMaxima",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            numExtrema: dependencyValues.numMinima + dependencyValues.numMaxima,
          },
          checkForActualChange: { numExtrema: true },
        };
      },
    };

    stateVariableDefinitions.allExtrema = {
      returnDependencies: () => ({
        allMinima: {
          dependencyType: "stateVariable",
          variableName: "allMinima",
        },
        allMaxima: {
          dependencyType: "stateVariable",
          variableName: "allMaxima",
        },
      }),
      definition({ dependencyValues }) {
        // console.log(`definition of allExtrema of function`)
        // console.log(dependencyValues)
        let allExtrema = [
          ...dependencyValues.allMinima,
          ...dependencyValues.allMaxima,
        ].sort((a, b) => a[0] - b[0]);

        return { setValue: { allExtrema } };
      },
    };

    stateVariableDefinitions.extrema = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: ["styleNumber"],
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "extremum" || prefix === undefined) {
            // extremum or entire array
            // These are points,
            // wrap inner dimension by both <point> and <xs>
            // don't wrap outer dimension (for entire array)
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          } else {
            // don't wrap extremumLocation(s) or extremumValues(s)
            return [];
          }
        },
      },
      isArray: true,
      numDimensions: 2,
      entryPrefixes: [
        "extremum",
        "extremumLocations",
        "extremumLocation",
        "extremumValues",
        "extremumValue",
      ],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (
          ["extremum", "extremumLocation", "extremumValue"].includes(
            arrayEntryPrefix,
          )
        ) {
          let pointInd = Number(varEnding) - 1;
          if (Number.isInteger(pointInd) && pointInd >= 0) {
            // If not given the array size,
            // then return the array keys assuming the array is large enough.
            // Must do this as it is used to determine potential array entries.
            if (!arraySize || pointInd < arraySize[0]) {
              if (arrayEntryPrefix === "extremum") {
                return [pointInd + ",0", pointInd + ",1"];
              } else if (arrayEntryPrefix === "extremumLocation") {
                return [pointInd + ",0"];
              } else {
                return [pointInd + ",1"];
              }
            } else {
              return [];
            }
          } else {
            return [];
          }
        } else if (arrayEntryPrefix === "extremumLocations") {
          if (varEnding !== "") {
            return [];
          }

          if (!arraySize) {
            // if don't have arraySize, just use first point assuming array size is large enough
            return ["0,0"];
          }

          // array of "i,0"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",0");
        } else if (arrayEntryPrefix === "extremumValues") {
          if (varEnding !== "") {
            return [];
          }

          if (!arraySize) {
            // if don't have arraySize, just use first point assuming array size is large enough
            return ["0,1"];
          }

          // array of "i,1"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",1");
        } else {
          return [];
        }
      },
      arrayVarNameFromArrayKey(arrayKey) {
        let [ind1, ind2] = arrayKey.split(",");

        if (ind2 === "0") {
          return "extremumLocation" + (Number(ind1) + 1);
        } else {
          return "extremumValue" + (Number(ind1) + 1);
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "extrema") {
          if (propIndex.length === 1) {
            return "extremum" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            let componentNum = Number(propIndex[0]);
            if (Number.isInteger(componentNum) && componentNum > 0) {
              if (propIndex[1] === 1) {
                return "extremumLocation" + componentNum;
              } else if (propIndex[1] === 2) {
                return "extremumValue" + componentNum;
              }
            }
            return null;
          }
        }
        if (varName === "extremumLocations") {
          // if propIndex has additional entries, ignore them
          return "extremumLocation" + propIndex[0];
        }
        if (varName === "extremumValues") {
          // if propIndex has additional entries, ignore them
          return "extremumValue" + propIndex[0];
        }
        if (varName.slice(0, 8) === "extremum") {
          // could be extremum, extremumLocation, or extremumValue
          let componentNum = Number(varName.slice(8));
          if (Number.isInteger(componentNum) && componentNum > 0) {
            // if propIndex has additional entries, ignore them
            if (propIndex[0] === 1) {
              return "extremumLocation" + componentNum;
            } else if (propIndex[0] === 2) {
              return "extremumValue" + componentNum;
            }
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        numExtrema: {
          dependencyType: "stateVariable",
          variableName: "numExtrema",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numExtrema, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allExtrema: {
            dependencyType: "stateVariable",
            variableName: "allExtrema",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function extrema`)
        // console.log(globalDependencyValues)

        let extrema = {};

        for (
          let ptInd = 0;
          ptInd < globalDependencyValues.__array_size[0];
          ptInd++
        ) {
          for (let i = 0; i < 2; i++) {
            let arrayKey = `${ptInd},${i}`;

            extrema[arrayKey] = globalDependencyValues.allExtrema[ptInd][i];
          }
        }

        return { setValue: { extrema } };
      },
    };

    stateVariableDefinitions.returnNumericalDerivatives = {
      stateVariablesDeterminingDependencies: ["isInterpolatedFunction"],
      returnDependencies({ stateValues }) {
        if (stateValues.isInterpolatedFunction) {
          return {
            xs: {
              dependencyType: "stateVariable",
              variableName: "xs",
            },
            coeffs: {
              dependencyType: "stateVariable",
              variableName: "coeffs",
            },
            // interpolationPoints: {
            //   dependencyType: "stateVariable",
            //   variableName: "interpolationPoints"
            // },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction",
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables",
            },
          };
        } else {
          return {
            functionChild: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["returnNumericalDerivatives", "variables"],
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction",
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables",
            },
          };
        }
      },
      definition: function ({ dependencyValues }) {
        if (dependencyValues.isInterpolatedFunction) {
          return {
            setValue: {
              returnNumericalDerivatives:
                returnReturnDerivativesOfInterpolatedFunction(dependencyValues),
            },
          };
        } else {
          if (
            dependencyValues.functionChild.length > 0 &&
            dependencyValues.functionChild[0].stateValues
              .returnNumericalDerivatives
          ) {
            // check if variables are the same
            let functionVariables = dependencyValues.variables.map(
              (x) => x.subscripts_to_strings().tree,
            );
            let childVariables =
              dependencyValues.functionChild[0].stateValues.variables;
            let childVariablesTrans = childVariables.map(
              (x) => x.subscripts_to_strings().tree,
            );

            let variableMapping = {};

            for (let [ind, variable] of functionVariables.entries()) {
              if (
                childVariablesTrans[ind] &&
                childVariablesTrans[ind] !== variable
              ) {
                variableMapping[variable] = childVariables[ind];
              }
            }

            if (Object.keys(variableMapping).length === 0) {
              return {
                setValue: {
                  returnNumericalDerivatives:
                    dependencyValues.functionChild[0].stateValues
                      .returnNumericalDerivatives,
                },
              };
            } else {
              let returnNumericalDerivatives = function (derivVariables) {
                let mappedDerivVariables = [];

                for (let dVar of derivVariables) {
                  let mapped =
                    variableMapping[dVar.subscripts_to_strings().tree];
                  if (mapped) {
                    mappedDerivVariables.push(mapped);
                  } else {
                    // have a mapping, but
                    mappedDerivVariables.push(me.fromAst("\uff3f"));
                  }
                }

                return dependencyValues.functionChild[0].stateValues.returnNumericalDerivatives(
                  mappedDerivVariables,
                );
              };

              return {
                setValue: { returnNumericalDerivatives },
              };
            }
          } else {
            return { setValue: { returnNumericalDerivatives: null } };
          }
        }
      },
    };

    stateVariableDefinitions.numericalDerivativesDefinition = {
      stateVariablesDeterminingDependencies: ["isInterpolatedFunction"],
      returnDependencies({ stateValues }) {
        if (stateValues.isInterpolatedFunction) {
          return {
            xs: {
              dependencyType: "stateVariable",
              variableName: "xs",
            },
            coeffs: {
              dependencyType: "stateVariable",
              variableName: "coeffs",
            },
            // interpolationPoints: {
            //   dependencyType: "stateVariable",
            //   variableName: "interpolationPoints"
            // },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction",
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables",
            },
          };
        } else {
          return {
            functionChild: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["numericalDerivativesDefinition", "variables"],
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction",
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables",
            },
          };
        }
      },
      definition: function ({ dependencyValues }) {
        if (dependencyValues.isInterpolatedFunction) {
          return {
            setValue: {
              numericalDerivativesDefinition: {
                derivativeType: "interpolatedFunction",
                xs: dependencyValues.xs,
                coeffs: dependencyValues.coeffs,
                variables: dependencyValues.variables,
              },
            },
          };
        } else {
          if (
            dependencyValues.functionChild.length > 0 &&
            dependencyValues.functionChild[0].stateValues
              .numericalDerivativesDefinition
          ) {
            // check if variables are the same
            let functionVariables = dependencyValues.variables.map(
              (x) => x.subscripts_to_strings().tree,
            );
            let childVariables =
              dependencyValues.functionChild[0].stateValues.variables;
            let childVariablesTrans = childVariables.map(
              (x) => x.subscripts_to_strings().tree,
            );

            let variableMapping = {};

            for (let [ind, variable] of functionVariables.entries()) {
              if (
                childVariablesTrans[ind] &&
                childVariablesTrans[ind] !== variable
              ) {
                variableMapping[variable] = childVariables[ind];
              }
            }

            if (Object.keys(variableMapping).length === 0) {
              return {
                setValue: {
                  numericalDerivativesDefinition:
                    dependencyValues.functionChild[0].stateValues
                      .numericalDerivativesDefinition,
                },
              };
            } else {
              let derivDef = {
                ...dependencyValues.functionChild[0].stateValues
                  .numericalDerivativesDefinition,
              };
              if (derivDef.variableMappings) {
                derivDef.variableMappings = [
                  variableMapping,
                  ...derivDef.variableMappings,
                ];
              } else {
                derivDef.variableMappings = [variableMapping];
              }

              return {
                setValue: { numericalDerivativesDefinition: derivDef },
              };
            }
          } else {
            return { setValue: { numericalDerivativesDefinition: {} } };
          }
        }
      },
    };

    return stateVariableDefinitions;
  }

  static adapters = [
    {
      stateVariable: "numericalf",
      componentType: "curve",
      stateVariablesToShadow: ["label", "labelHasLatex"],
    },
    {
      stateVariable: "formula",
      componentType: "math",
      stateVariablesToShadow: Object.keys(
        returnRoundingStateVariableDefinitions(),
      ),
    },
  ];
}

function calculateInterpolationPoints({ dependencyValues, numerics }) {
  let pointsWithX = [];
  let pointsWithoutX = [];

  let allPoints = {
    maximum: dependencyValues.prescribedMaxima,
    minimum: dependencyValues.prescribedMinima,
    extremum: dependencyValues.prescribedExtrema,
    point: dependencyValues.prescribedPoints,
  };

  for (let type in allPoints) {
    for (let point of allPoints[type]) {
      let x = null,
        y = null,
        slope = null;
      if (point.x !== null) {
        x = point.x.evaluate_to_constant();
        if (!Number.isFinite(x)) {
          console.warn(`Ignoring non-numerical ${type}`);
          continue;
        }
      }
      if (point.y !== null) {
        y = point.y.evaluate_to_constant();
        if (!Number.isFinite(y)) {
          console.warn(`Ignoring non-numerical ${type}`);
          continue;
        }
      }
      if (point.slope !== null && point.slope !== undefined) {
        slope = point.slope.evaluate_to_constant();
        if (!Number.isFinite(slope)) {
          console.warn(`Ignoring non-numerical slope`);
          slope = null;
        }
      }
      if (x === null) {
        if (y === null) {
          console.warn(`Ignoring empty ${type}`);
          continue;
        }
        pointsWithoutX.push({
          type: type,
          y: y,
          slope: slope,
        });
      } else {
        pointsWithX.push({
          type: type,
          x: x,
          y: y,
          slope: slope,
        });
      }
    }
  }

  pointsWithX.sort((a, b) => a.x - b.x);
  pointsWithoutX.sort((a, b) => a.y - b.y);

  // don't allow multiple points with same x or very close x
  let xPrev = -Infinity;
  let eps = numerics.eps;
  for (let ind = 0; ind < pointsWithX.length; ind++) {
    let p = pointsWithX[ind];
    if (p.x <= xPrev + eps) {
      console.warn(
        `Two points with locations too close together.  Can't define function`,
      );
      return { setValue: { interpolationPoints: null } };
    }
    xPrev = p.x;
  }

  let xscale = dependencyValues.xscale;
  let yscale = dependencyValues.yscale;

  xPrev = undefined;
  let yPrev, typePrev;
  let interpolationPoints = [];

  let pNext = pointsWithX[0];
  for (let ind = 0; ind < pointsWithX.length; ind++) {
    let p = pNext;
    pNext = pointsWithX[ind + 1];
    let newPoint = addPointWithX({
      p,
      pNext,
      typePrev,
      xPrev,
      yPrev,
    });

    typePrev = newPoint.type;
    xPrev = newPoint.x;
    yPrev = newPoint.y;
  }

  // flag if next point will be first point added
  let firstPoint = false;
  if (pointsWithX.length === 0) {
    firstPoint = true;
  }

  // if points without X remain, keep adding with spacing of 2*xscale
  while (pointsWithoutX.length > 0) {
    // see if can find a point that can be added without any intermediates
    let findMatch;
    if (typePrev === undefined) {
      findMatch = getPointWithoutX({
        allowedTypes: ["maximum", "minimum", "extremum"],
        comparison: "atLeast",
        value: -Infinity,
      });
    } else if (typePrev === "maximum") {
      findMatch = getPointWithoutX({
        allowedTypes: ["minimum", "extremum"],
        comparison: "atMost",
        value: yPrev - yscale,
      });
    } else if (typePrev === "minimum") {
      findMatch = getPointWithoutX({
        allowedTypes: ["maximum", "extremum"],
        comparison: "atLeast",
        value: yPrev + yscale,
      });
    } else if (typePrev === "point") {
      findMatch = getPointWithoutX({
        allowedTypes: ["maximum", "extremum"],
        comparison: "atLeast",
        value: yPrev + yscale,
      });
      if (findMatch.success !== true) {
        findMatch = getPointWithoutX({
          allowedTypes: ["minimum", "extremum"],
          comparison: "atMost",
          value: yPrev - yscale,
        });
      }
    }

    let p;
    if (findMatch.success === true) {
      p = findMatch.point;
      pointsWithoutX.splice(findMatch.ind, 1);
      if (firstPoint) {
        p.x = 0;
        firstPoint = false;
      } else {
        p.x = xPrev + xscale;
      }
    } else {
      p = pointsWithoutX.pop();
      if (firstPoint) {
        p.x = 0;
        firstPoint = false;
      } else {
        // make scale larger, as know will need to add extra point
        p.x = xPrev + 2 * xscale;
      }
    }

    let newPoint = addPointWithX({
      p,
      typePrev,
      xPrev,
      yPrev,
    });

    typePrev = newPoint.type;
    xPrev = newPoint.x;
    yPrev = newPoint.y;
  }

  // used all prescribed point
  // now, add points at beginning and end to extrapolate

  // if not points prescribed, create a point through origin
  // which will make f be the constant function 0
  if (interpolationPoints.length === 0) {
    interpolationPoints.push({
      type: "point",
      x: 0,
      y: 0,
      slope: 0,
    });
  }

  firstPoint = interpolationPoints[0];
  if (firstPoint.type === "maximum") {
    // add point before maximum, xscale to left and yscale below
    // and set slope so ends with parabola
    let newPoint = {
      type: "point",
      x: firstPoint.x - xscale,
      y: firstPoint.y - yscale,
      slope: (2 * yscale) / xscale,
    };
    interpolationPoints.splice(0, 0, newPoint);
  } else if (firstPoint.type === "minimum") {
    // add point before minimum, xscale to left and yscale above
    // and set slope so ends with parabola
    let newPoint = {
      type: "point",
      x: firstPoint.x - xscale,
      y: firstPoint.y + yscale,
      slope: (-2 * yscale) / xscale,
    };
    interpolationPoints.splice(0, 0, newPoint);
  } else if (firstPoint.type === "point") {
    if (interpolationPoints.length === 1) {
      // if point is only point and slope isn't defined, set slope to zero
      if (firstPoint.slope === null) {
        firstPoint.slope = 0;
      }
    } else {
      let nextPoint = interpolationPoints[1];
      let secantslope =
        (nextPoint.y - firstPoint.y) / (nextPoint.x - firstPoint.x);
      if (nextPoint.type === "maximum" || nextPoint.type === "minimum") {
        if (firstPoint.slope === null) {
          // set slope so ends with parabola
          firstPoint.slope = 2 * secantslope;
        }
      } else {
        // two points in a row
        if (interpolationPoints.length === 2) {
          // only two points, make slope for a line if slope isn't determined
          if (firstPoint.slope === null) {
            firstPoint.slope = secantslope;
          }
        } else {
          // if slope of next point isn't defined
          // set next point slope according to monotonic formula
          if (nextPoint.slope === null) {
            nextPoint.slope = monotonicSlope({
              point: nextPoint,
              prevPoint: firstPoint,
              nextPoint: interpolationPoints[2],
            });
          }

          // if firstPoint slope is null
          // fit a quadratic from firstPoint to nextPoint
          // with slope matching that of nextPoint
          // Calculate resulting slope at firstPoint
          if (firstPoint.slope === null) {
            firstPoint.slope =
              (2 * (firstPoint.y - nextPoint.y)) /
                (firstPoint.x - nextPoint.x) -
              nextPoint.slope;
          }
        }

        // add another point in line with slope that extrapolates as a line
        let newPoint = {
          x: firstPoint.x - xscale,
          y: firstPoint.y - xscale * firstPoint.slope,
          slope: firstPoint.slope,
        };
        interpolationPoints.splice(0, 0, newPoint);
        // extapolateLinearBeginning = true;
      }
    }
  }

  let lastPoint = interpolationPoints[interpolationPoints.length - 1];
  if (lastPoint.type === "maximum") {
    // add point after maximum, xscale to right and yscale below
    // and set slope so ends with parabola
    let newPoint = {
      type: "point",
      x: lastPoint.x + xscale,
      y: lastPoint.y - yscale,
      slope: (-2 * yscale) / xscale,
    };
    interpolationPoints.push(newPoint);
  } else if (lastPoint.type === "minimum") {
    // add point after minimum, xscale to right and yscale above
    // and set slope so ends with parabola
    let newPoint = {
      type: "point",
      x: lastPoint.x + xscale,
      y: lastPoint.y + yscale,
      slope: (2 * yscale) / xscale,
    };
    interpolationPoints.push(newPoint);
  } else if (lastPoint.type === "point") {
    if (interpolationPoints.length === 1) {
      // if point is only point
      // add a second point so that get a line
      let newPoint = {
        type: "point",
        x: lastPoint.x + xscale,
        y: lastPoint.y + firstPoint.slope * xscale,
        slope: firstPoint.slope,
      };
      interpolationPoints.push(newPoint);
    } else {
      let prevPoint = interpolationPoints[interpolationPoints.length - 2];
      let secantslope =
        (prevPoint.y - lastPoint.y) / (prevPoint.x - lastPoint.x);
      if (prevPoint.type === "maximum" || prevPoint.type === "minimum") {
        // if slope not defined
        // set slope so ends with parabola
        if (lastPoint.slope === null) {
          lastPoint.slope = 2 * secantslope;
        }
      } else {
        // two points in a row
        if (interpolationPoints.length === 2) {
          // only two points, make a line if slope not defined
          if (lastPoint.slope === null) {
            lastPoint.slope = secantslope;
          }
        } else {
          // if previous point slope is null
          // set previous point slope according to monotonic formula
          if (prevPoint.slope === null) {
            prevPoint.slope = monotonicSlope({
              point: prevPoint,
              prevPoint: interpolationPoints[interpolationPoints.length - 3],
              nextPoint: lastPoint,
            });
          }
          // if lastPoint slope is null
          // fit a quadratic from prevPoint to lastPoint
          // with slope matching that of prevPoint
          // Calculate resulting slope at lastPoint
          if (lastPoint.slope === null) {
            lastPoint.slope =
              (2 * (prevPoint.y - lastPoint.y)) / (prevPoint.x - lastPoint.x) -
              prevPoint.slope;
          }
        }

        // add another point in line with slope that extrapolates as a line
        let newPoint = {
          x: lastPoint.x + xscale,
          y: lastPoint.y + xscale * lastPoint.slope,
          slope: lastPoint.slope,
        };
        interpolationPoints.push(newPoint);
      }
    }
  }

  // for any interpolation points whose slope are not given
  // use slope from monotonic cubic interpolation
  for (let ind = 1; ind < interpolationPoints.length - 1; ind++) {
    let point = interpolationPoints[ind];
    if (point.slope === null) {
      point.slope = monotonicSlope({
        point: point,
        prevPoint: interpolationPoints[ind - 1],
        nextPoint: interpolationPoints[ind + 1],
      });
    }
  }

  return { setValue: { interpolationPoints } };

  function monotonicSlope({ point, prevPoint, nextPoint }) {
    // monotonic cubic interpolation formula from
    // Steffens, Astron. Astrophys. 239:443 (1990)

    let dx1 = point.x - prevPoint.x;
    let dx2 = nextPoint.x - point.x;
    let dy1 = point.y - prevPoint.y;
    let dy2 = nextPoint.y - point.y;
    let s1 = dy1 / dx1;
    let s2 = dy2 / dx2;
    let p1 = (s1 * dx2 + s2 * dx1) / (dx1 + dx2);

    let slope =
      (Math.sign(s1) + Math.sign(s2)) *
      Math.min(Math.abs(s1), Math.abs(s2), 0.5 * Math.abs(p1));

    return slope;
  }

  function addPointWithX({ p, pNext, typePrev, xPrev, yPrev }) {
    let yNext;
    if (pNext !== undefined) {
      yNext = pNext.y;
    }
    if (p.type === "maximum") {
      return addMaximum({
        x: p.x,
        y: p.y,
        typePrev,
        xPrev,
        yPrev,
        yNext,
        pNext,
      });
    } else if (p.type === "minimum") {
      return addMinimum({
        x: p.x,
        y: p.y,
        typePrev,
        xPrev,
        yPrev,
        yNext,
        pNext,
      });
    } else if (p.type === "extremum") {
      let typeNext; // used only if there isn't a point before

      if (typePrev === undefined) {
        // nothing followed by extremum
        if (pNext === undefined) {
          // if nothing on either side, treat as a maximum
          return addMaximum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        }
        // set typeNext so following logic can test if this is the first point
        typeNext = pNext.type;
      }

      if (typePrev === "maximum" || typeNext === "maximum") {
        // maximum followed by extremum (or preceeded by in case this is first point)
        if (p.y !== null && p.y > yPrev - yscale) {
          // treat extremum as maximum,
          // as would need two extra points if it were a minimum
          return addMaximum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        } else if (
          typeNext !== undefined &&
          p.y !== null &&
          p.y > pNext.y - yscale
        ) {
          // case where this is first point
          // treat extremum as maximum,
          // as would need two extra points if it were a minimum
          return addMaximum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        } else {
          // treat extremum as a minimum
          return addMinimum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        }
      } else if (typePrev === "minimum" || typeNext === "minimum") {
        // minimum followed by extremum (or preceeded by in case this is first point)
        if (p.y !== null && p.y < yPrev + yscale) {
          // treat extremum as minimum,
          // as would need two extra points if it were a maximum
          return addMinimum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        } else if (
          typeNext !== undefined &&
          p.y !== null &&
          p.y > pNext.y + yscale
        ) {
          // case where this is first point
          // treat extremum as minimum,
          // as would need two extra points if it were a maximum
          return addMinimum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        } else {
          return addMaximum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        }
      } else if (typePrev === "point" || typeNext === "point") {
        // point followed by extremum (or preceeded by in case this is first point)
        let treatAs = "maximum";
        if (p.y === null && pNext !== undefined && pNext.type === maximum) {
          treatAs = "minimum";
        } else if (p.y !== null && p.y <= yPrev - yscale) {
          treatAs = "minimum";
        } else if (
          typeNext !== undefined &&
          p.y !== null &&
          p.y >= pNext.y - yscale
        ) {
          treatAs = "minimum";
        }
        if (treatAs === "minimum") {
          return addMinimum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        } else {
          return addMaximum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        }
      } else {
        // must be first point that is followed by an extremum
        if (p.y !== null && p.y < pNext.y - yscale) {
          return addMinimum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        } else {
          return addMaximum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        }
      }
    } else if (p.type === "point") {
      return addPoint({
        x: p.x,
        y: p.y,
        slope: p.slope,
        typePrev,
        xPrev,
        yPrev,
        yNext,
        pNext,
      });
    }
  }

  function addMaximum({ x, y, typePrev, xPrev, yPrev, yNext, pNext }) {
    if (typePrev === undefined) {
      // nothing followed by maximum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = 0;
        } else if (pNext.type === "maximum") {
          y = yNext;
        } else {
          y = yNext + yscale;
        }
      }
    } else if (typePrev === "maximum") {
      // maximum followed by maximum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = yPrev;
        } else if (pNext.type === "maximum") {
          y = Math.max(yPrev, yNext);
        } else {
          y = Math.max(yPrev, yNext + yscale);
        }
      }
      // need to put a minimum betwee'n the two max's
      // with y at least yscale below both
      let yMin = Math.min(yPrev, y) - yscale;
      let xNew = (x + xPrev) / 2;
      let yNew,
        typeNew,
        slopeNew = null;
      // see if can find a min or extremum that didn't have x specified
      let results = getPointWithoutX({
        allowedTypes: ["minimum", "extremum"],
        comparison: "atMost",
        value: yMin,
      });
      if (results.success === true) {
        typeNew = "minimum"; // treat as minimum even if was extremum
        yNew = results.point.y;
        pointsWithoutX.splice(results.ind, 1);
        slopeNew = 0;
      } else {
        typeNew = "point";
        yNew = yMin;
      }
      interpolationPoints.push({
        type: typeNew,
        x: xNew,
        y: yNew,
        slope: slopeNew,
      });
    } else if (typePrev === "minimum") {
      // minimum followed by maximum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = yPrev + yscale;
        } else if (pNext.type === "maximum") {
          y = Math.max(yPrev + yscale, yNext);
        } else {
          y = Math.max(yPrev, yNext) + yscale;
        }
      } else {
        // have maximum with y defined
        if (y < yPrev + yscale) {
          // minimum followed by a maximum that is lower
          // (or at least not much higher) than the minimum
          // to make both points have neighbors that are sufficiently different
          // add two points between them
          // - the first with height >= yPrev + yscale (to make the minimum obvious)
          // - the second with height <= y - yscale (to make the maximum obvious)
          let xs = [(2 * xPrev + x) / 3, (xPrev + 2 * x) / 3];
          let findValues = [yPrev + yscale, y - yscale];
          let findComparisons = ["atLeast", "atMost"];
          let findTypes = [
            ["maximum", "extremum"],
            ["minimum", "extremum"],
          ];
          for (let newPointNum = 0; newPointNum < 2; newPointNum++) {
            let xNew = xs[newPointNum];
            let yNew,
              typeNew,
              slopeNew = null;
            // attempt to find an unused point that meets criteria
            let results = getPointWithoutX({
              allowedTypes: findTypes[newPointNum],
              comparison: findComparisons[newPointNum],
              value: findValues[newPointNum],
            });
            if (results.success === true) {
              typeNew = findTypes[newPointNum][0]; // treat as min/max even if was extremum
              yNew = results.point.y;
              pointsWithoutX.splice(results.ind, 1);
              slopeNew = 0;
            } else {
              typeNew = "point";
              yNew = findValues[newPointNum];
              slopeNew = null;
            }
            interpolationPoints.push({
              type: typeNew,
              x: xNew,
              y: yNew,
              slope: slopeNew,
            });
          }
        }
      }
    } else if (typePrev === "point") {
      // point followed by maximum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = yPrev + yscale;
        } else if (pNext.type === "maximum") {
          y = Math.max(yPrev + yscale, yNext);
        } else {
          y = Math.max(yPrev, yNext) + yscale;
        }
      } else {
        // have maximum with y defined
        if (y < yPrev + yscale) {
          // need to add a point to the left at least as low as y-yscale
          let xNew = (x + xPrev) / 2;
          let yNew,
            typeNew,
            slopeNew = null;
          // see if can find a min or extremum that didn't have x specified
          let results = getPointWithoutX({
            allowedTypes: ["minimum", "extremum"],
            comparison: "atMost",
            value: y - yscale,
          });
          if (results.success === true) {
            typeNew = "minimum"; // treat as minimum even if was extremum
            yNew = results.point.y;
            pointsWithoutX.splice(results.ind, 1);
            slopeNew = 0;
          } else {
            typeNew = "point";
            yNew = y - yscale;
          }
          interpolationPoints.push({
            type: typeNew,
            x: xNew,
            y: yNew,
            slope: slopeNew,
          });
        }
      }
    }

    let newMaximum = {
      type: "maximum",
      x: x,
      y: y,
      slope: 0,
    };
    interpolationPoints.push(newMaximum);
    return newMaximum;
  }

  function addMinimum({ x, y, typePrev, xPrev, yPrev, yNext, pNext }) {
    if (typePrev === undefined) {
      // nothing followed by minimum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = 0;
        } else if (pNext.type === "minimum") {
          y = yNext;
        } else {
          y = yNext - yscale;
        }
      }
    } else if (typePrev === "maximum") {
      // maximum followed by minimum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = yPrev - yscale;
        } else if (pNext.type === "minimum") {
          y = Math.min(yPrev - yscale, yNext);
        } else {
          y = Math.min(yPrev, yNext) - yscale;
        }
      } else {
        // have minimum with y defined
        if (y > yPrev - yscale) {
          // maximum followed by a minimum that is higher
          // (or at least not much lower) than the maximum
          // to make both points have neighbors that are sufficiently different
          // add two points between them
          // - the first with height <= yPrev - yscale (to make the maximum obvious)
          // - the second with height >= y + yscale (to make the minimum obvious)
          let xs = [(2 * xPrev + x) / 3, (xPrev + 2 * x) / 3];
          let findValues = [yPrev - yscale, y + yscale];
          let findComparisons = ["atMost", "atLeast"];
          let findTypes = [
            ["minimum", "extremum"],
            ["maximum", "extremum"],
          ];
          for (let newPointNum = 0; newPointNum < 2; newPointNum++) {
            let xNew = xs[newPointNum];
            let yNew,
              typeNew,
              slopeNew = null;
            // attempt to find an unused point that meets criteria
            let results = getPointWithoutX({
              allowedTypes: findTypes[newPointNum],
              comparison: findComparisons[newPointNum],
              value: findValues[newPointNum],
            });
            if (results.success === true) {
              typeNew = findTypes[newPointNum][0]; // treat as min/max even if was extremum
              yNew = results.point.y;
              pointsWithoutX.splice(results.ind, 1);
              slopeNew = 0;
            } else {
              typeNew = "point";
              yNew = findValues[newPointNum];
              slopeNew = null;
            }
            interpolationPoints.push({
              type: typeNew,
              x: xNew,
              y: yNew,
              slope: slopeNew,
            });
          }
        }
      }
    } else if (typePrev === "minimum") {
      // minimum followed by minimum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = yPrev;
        } else if (pNext.type === "minimum") {
          y = Math.min(yPrev, yNext);
        } else {
          y = Math.min(yPrev, yNext - yscale);
        }
      }
      // need to put a maximum between the two min's
      // with y at least yscale above both
      let yMax = Math.max(yPrev, y) + yscale;
      let xNew = (x + xPrev) / 2;
      let yNew,
        typeNew,
        slopeNew = null;
      // see if can find a min or extremum that didn't have x specified
      let results = getPointWithoutX({
        allowedTypes: ["maximum", "extremum"],
        comparison: "atLeast",
        value: yMax,
      });
      if (results.success === true) {
        typeNew = "maximum"; // treat as maximum even if was extremum
        yNew = results.point.y;
        pointsWithoutX.splice(results.ind, 1);
        slopeNew = 0;
      } else {
        typeNew = "point";
        yNew = yMax;
      }
      interpolationPoints.push({
        type: typeNew,
        x: xNew,
        y: yNew,
        slope: slopeNew,
      });
    } else if (typePrev === "point") {
      // point followed by minimum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = yPrev - yscale;
        } else if (pNext.type === "minimum") {
          y = Math.min(yPrev - yscale, yNext);
        } else {
          y = Math.min(yPrev, yNext) - yscale;
        }
      } else {
        // have minimum with y defined
        if (y > yPrev - yscale) {
          // need to add a point to the left at least as high as y+yscale
          let xNew = (x + xPrev) / 2;
          let yNew,
            typeNew,
            slopeNew = null;
          // see if can find a max or extremum that didn't have x specified
          let results = getPointWithoutX({
            allowedTypes: ["maximum", "extremum"],
            comparison: "atLeast",
            value: y + yscale,
          });
          if (results.success === true) {
            typeNew = "maximum"; // treat as maximum even if was extremum
            yNew = results.point.y;
            pointsWithoutX.splice(results.ind, 1);
            slopeNew = 0;
          } else {
            typeNew = "point";
            yNew = y + yscale;
          }
          interpolationPoints.push({
            type: typeNew,
            x: xNew,
            y: yNew,
            slope: slopeNew,
          });
        }
      }
    }

    let newMinimum = {
      type: "minimum",
      x: x,
      y: y,
      slope: 0,
    };
    interpolationPoints.push(newMinimum);
    return newMinimum;
  }

  function addPoint({ x, y, slope, typePrev, xPrev, yPrev, yNext, pNext }) {
    if (typePrev === "maximum") {
      // maximum followed by point

      if (y > yPrev - yscale) {
        // point is too high to make previous maximum sufficiently different
        // Either
        // - find a minimum or extremum with height below min(y,yPrev)-yscale, or
        // - add a point with height yPrev-yscale

        let yMin = Math.min(yPrev, y) - yscale;
        let xNew = (x + xPrev) / 2;
        let yNew,
          typeNew,
          slopeNew = null;
        // see if can find a min or extremum that didn't have x specified
        let results = getPointWithoutX({
          allowedTypes: ["minimum", "extremum"],
          comparison: "atMost",
          value: yMin,
        });
        if (results.success === true) {
          typeNew = "minimum"; // treat as minimum even if was extremum
          yNew = results.point.y;
          pointsWithoutX.splice(results.ind, 1);
          slopeNew = 0;
        } else {
          typeNew = "point";
          yNew = yPrev - yscale;
        }
        interpolationPoints.push({
          type: typeNew,
          x: xNew,
          y: yNew,
          slope: slopeNew,
        });
      }
    } else if (typePrev === "minimum") {
      // minimum followed by point
      if (y < yPrev + yscale) {
        // point is too low to make previous minimum sufficiently different
        // Either
        // - find a maximum or extremum with height above min(y,yPrev)+yscale, or
        // - add a point with height yPrev+yscale

        let yMax = Math.max(yPrev, y) + yscale;
        let xNew = (x + xPrev) / 2;
        let yNew,
          typeNew,
          slopeNew = null;
        // see if can find a max or extremum that didn't have x specified
        let results = getPointWithoutX({
          allowedTypes: ["maximum", "extremum"],
          comparison: "atLeast",
          value: yMax,
        });
        if (results.success === true) {
          typeNew = "maximum"; // treat as maximum even if was extremum
          yNew = results.point.y;
          pointsWithoutX.splice(results.ind, 1);
          slopeNew = 0;
        } else {
          typeNew = "point";
          yNew = yPrev + yscale;
        }
        interpolationPoints.push({
          type: typeNew,
          x: xNew,
          y: yNew,
          slope: slopeNew,
        });
      }
    }

    let newPoint = {
      type: "point",
      x: x,
      y: y,
      slope: slope,
    };
    interpolationPoints.push(newPoint);
    return newPoint;
  }

  function getPointWithoutX({ allowedTypes, comparison, value }) {
    // try to find a function in pointsWithoutX of allowed type
    // whose y value fits the criterion specified by comparison and value
    // comparison must be either "atMost" or "atLeast"

    // since pointsWithoutMax are sort in increasing y value
    // search in reverse order if comparison is atMost
    // that way, find the point that is closest to the criterion
    let inds = [];
    if (comparison === "atMost") {
      inds = Object.keys(pointsWithoutX).reverse();
    } else if (comparison === "atLeast") {
      inds = Object.keys(pointsWithoutX);
    } else {
      return { success: false };
    }

    // prefer first allowed types, so search them in order
    for (let type of allowedTypes) {
      for (let ind of inds) {
        let p = pointsWithoutX[ind];

        if (p.type !== type) {
          continue;
        }

        if (comparison === "atMost") {
          if (p.y <= value) {
            return {
              success: true,
              ind: ind,
              point: p,
            };
          }
        } else {
          if (p.y >= value) {
            return {
              success: true,
              ind: ind,
              point: p,
            };
          }
        }
      }
    }
    return { success: false };
  }
}

function computeSplineParamCoeffs({ dependencyValues }) {
  // Compute coefficients for a cubic polynomial
  //   p(s) = c0 + c1*s + c2*s^2 + c3*s^3
  // such that
  //   p(0) = x1, p(s2) = x2
  // and
  //   p'(0) = t1, p'(s2) = t2
  let initCubicPoly = function (x1, x2, t1, t2, s2) {
    return [
      x1,
      t1,
      ((-3 * x1) / s2 + (3 * x2) / s2 - 2 * t1 - t2) / s2,
      ((2 * x1) / s2 - (2 * x2) / s2 + t1 + t2) / (s2 * s2),
    ];
  };

  let interpolationPoints = dependencyValues.interpolationPoints;

  if (interpolationPoints === null) {
    return {
      setValue: {
        xs: null,
        coeffs: null,
      },
    };
  }

  let coeffs = [];
  let xs = [];

  let p0;
  let p1 = interpolationPoints[0];
  xs.push(p1.x);
  for (let ind = 1; ind < interpolationPoints.length; ind++) {
    p0 = p1;
    p1 = interpolationPoints[ind];
    let c = initCubicPoly(p0.y, p1.y, p0.slope, p1.slope, p1.x - p0.x);

    // if nearly have quadratic or linear, except for roundoff error,
    // make exactly quadratic or linear
    if (
      Math.abs(c[3]) <
      1e-14 * Math.max(Math.abs(c[0]), Math.abs(c[1]), Math.abs(c[2]))
    ) {
      c[3] = 0;
      if (Math.abs(c[2]) < 1e-14 * Math.max(Math.abs(c[0]), Math.abs(c[1]))) {
        c[2] = 0;
      }
    }
    coeffs.push(c);

    xs.push(p1.x);
  }

  return {
    setValue: {
      xs,
      coeffs,
    },
  };
}
