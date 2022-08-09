import InlineComponent from './abstract/InlineComponent';
import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';
import { normalizeMathExpression, returnNVariables, roundForDisplay } from '../utils/math';
import { returnInterpolatedFunction, returnNumericalFunctionFromFormula, returnReturnDerivativesOfInterpolatedFunction, returnSymbolicFunctionFromFormula } from '../utils/function';

export default class Function extends InlineComponent {
  static componentType = "function";
  static rendererType = "math";


  static primaryStateVariableForDefinition = "numericalfShadow";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.simplify = {
      createComponentOfType: "text",
      createStateVariable: "simplifySpecified",
      defaultValue: "none",
      toLowerCase: true,
      valueTransformations: { "true": "full" },
      validValues: ["none", "full", "numbers", "numberspreserveorder"]
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
    attributes.nInputs = {
      createComponentOfType: "integer",
    };
    attributes.nOutputs = {
      createComponentOfType: "integer",
    };
    attributes.domain = {
      createComponentOfType: "_intervalListComponent",
    }

    // include attributes of graphical components
    // for case when function is adapted into a curve

    attributes.label = {
      createComponentOfType: "label",
    };
    attributes.labelIsName = {
      createComponentOfType: "boolean",
      createStateVariable: "labelIsName",
      defaultValue: false,
      public: true,
    };
    attributes.showLabel = {
      createComponentOfType: "boolean",
      createStateVariable: "showLabel",
      defaultValue: true,
      public: true,
      forRenderer: true
    };
    attributes.applyStyleToLabel = {
      createComponentOfType: "boolean",
      createStateVariable: "applyStyleToLabel",
      defaultValue: false,
      public: true,
      forRenderer: true
    };

    attributes.labelPosition = {
      createComponentOfType: "text",
      createStateVariable: "labelPosition",
      defaultValue: "upperright",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["upperright", "upperleft", "lowerright", "lowerleft", "top", "bottom", "left", "right"]
    }

    attributes.layer = {
      createComponentOfType: "number",
      createStateVariable: "layer",
      defaultValue: 0,
      public: true,
      forRenderer: true
    };

    attributes.minima = {
      createComponentOfType: "extrema"
    }
    attributes.maxima = {
      createComponentOfType: "extrema"
    }
    attributes.extrema = {
      createComponentOfType: "extrema"
    }
    attributes.through = {
      createComponentOfType: "_pointListComponent"
    }
    attributes.throughSlopes = {
      createComponentOfType: "mathList"
    }
    attributes.variables = {
      createComponentOfType: "variables"
    }
    attributes.symbolic = {
      createComponentOfType: "boolean"
    }

    attributes.displayDigits = {
      createComponentOfType: "integer",
    };
    attributes.displayDecimals = {
      createComponentOfType: "integer",
    };
    attributes.displaySmallAsZero = {
      createComponentOfType: "number",
      valueForTrue: 1E-14,
      valueForFalse: 0,
    };
    attributes.padZeros = {
      createComponentOfType: "boolean",
    }

    attributes.nearestPointAsCurve = {
      createComponentOfType: "boolean",
      createStateVariable: "nearestPointAsCurve",
      defaultValue: false,
    }

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let wrapStringOrMultipleNonLabelChildrenWithMath = function ({ matchedChildren, componentInfoObjects }) {

      // wrap first group of non-label children in <math>

      let componentIsLabel = x => componentInfoObjects.componentIsSpecifiedType(x, "label");
      let childIsLabel = matchedChildren.map(componentIsLabel);

      let childrenToWrap = [], childrenToNotWrapBegin = [], childrenToNotWrapEnd = [];

      if (childIsLabel.filter(x => x).length === 0) {
        childrenToWrap = matchedChildren
      } else {
        if (childIsLabel[0]) {
          // started with label, find first non-label child
          let firstNonLabelInd = childIsLabel.indexOf(false);
          if (firstNonLabelInd !== -1) {
            childrenToNotWrapBegin = matchedChildren.slice(0, firstNonLabelInd);
            matchedChildren = matchedChildren.slice(firstNonLabelInd);
            childIsLabel = childIsLabel.slice(firstNonLabelInd)
          }
        }

        // now we don't have label at the beginning
        // find first label ind
        let firstLabelInd = childIsLabel.indexOf(true);
        if (firstLabelInd === -1) {
          childrenToWrap = matchedChildren;
        } else {
          childrenToWrap = matchedChildren.slice(0, firstLabelInd);
          childrenToNotWrapEnd = matchedChildren.slice(firstLabelInd);
        }

      }

      // apply if have a single string or multiple children to wrap
      if (childrenToWrap.length === 1 && typeof childrenToWrap[0] !== "string"
        || childrenToWrap.length === 0
      ) {
        return { success: false }
      }

      return {
        success: true,
        newChildren: [
          ...childrenToNotWrapBegin,
          {
            componentType: "math",
            children: childrenToWrap
          },
          ...childrenToNotWrapEnd
        ],
      }

    }

    sugarInstructions.push({
      replacementFunction: wrapStringOrMultipleNonLabelChildrenWithMath
    });

    return sugarInstructions;

  }


  static returnChildGroups() {

    return [{
      group: "maths",
      componentTypes: ["math"]
    }, {
      group: "functions",
      componentTypes: ["function"]
    }, {
      group: "labels",
      componentTypes: ["label"]
    }]

  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = GraphicalComponent.returnStateVariableDefinitions();

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
      }),
      definition: function ({ dependencyValues }) {

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

        styleDescription += dependencyValues.selectedStyle.lineColorWord

        return { setValue: { styleDescription } };
      }
    }

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

        let styleDescriptionWithNoun = dependencyValues.styleDescription + " function";

        return { setValue: { styleDescriptionWithNoun } };
      }
    }

    stateVariableDefinitions.displayDigits = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      defaultValue: 10,
      hasEssential: true,
      returnDependencies: () => ({
        displayDigitsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDigits",
          variableNames: ["value"]
        },
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["displayDigits"],
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.displayDigitsAttr !== null) {

          let displayDigitsAttrUsedDefault = usedDefault.displayDigitsAttr;
          let displayDecimalsAttrUsedDefault = dependencyValues.displayDecimalsAttr === null || usedDefault.displayDecimalsAttr;

          if (!(displayDigitsAttrUsedDefault || displayDecimalsAttrUsedDefault)) {
            // if both display digits and display decimals did not use default
            // we'll regard display digits as using default if it comes from a deeper shadow
            let shadowDepthDisplayDigits = dependencyValues.displayDigitsAttr.shadowDepth;
            let shadowDepthDisplayDecimals = dependencyValues.displayDecimalsAttr.shadowDepth;

            if (shadowDepthDisplayDecimals < shadowDepthDisplayDigits) {
              displayDigitsAttrUsedDefault = true;
            }
          }

          if (displayDigitsAttrUsedDefault) {
            return {
              useEssentialOrDefaultValue: {
                displayDigits: {
                  defaultValue: dependencyValues.displayDigitsAttr.stateValues.value
                }
              }
            }
          } else {
            return {
              setValue: {
                displayDigits: dependencyValues.displayDigitsAttr.stateValues.value
              }
            }
          }

        } else if (dependencyValues.functionChild.length > 0) {

          let displayDigitsFunctionChildUsedDefault = usedDefault.functionChild[0];
          let displayDecimalsAttrUsedDefault = dependencyValues.displayDecimalsAttr === null || usedDefault.displayDecimalsAttr;

          if (!(displayDigitsFunctionChildUsedDefault || displayDecimalsAttrUsedDefault)) {
            // if both display digits (from function) and display decimals did not use default
            // we'll regard display digits as using default 
            displayDigitsFunctionChildUsedDefault = true;
          }

          if (displayDigitsFunctionChildUsedDefault) {
            return {
              useEssentialOrDefaultValue: {
                displayDigits: {
                  defaultValue: dependencyValues.functionChild[0].stateValues.displayDigits
                }
              }
            }
          } else {
            return {
              setValue: {
                displayDigits: dependencyValues.functionChild[0].stateValues.displayDigits
              }
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { displayDigits: true }
          }
        }
      }
    }

    stateVariableDefinitions.displayDecimals = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      defaultValue: null,
      hasEssential: true,
      returnDependencies: () => ({
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["displayDecimals"],
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.displayDecimalsAttr !== null) {
          return {
            setValue: {
              displayDecimals: dependencyValues.displayDecimalsAttr.stateValues.value
            }
          }
        } else if (dependencyValues.functionChild.length > 0 && !usedDefault.functionChild[0]) {
          return {
            setValue: {
              displayDecimals: dependencyValues.functionChild[0].stateValues.displayDecimals
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { displayDecimals: true }
          }
        }
      }
    }

    stateVariableDefinitions.displaySmallAsZero = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      defaultValue: 0,
      hasEssential: true,
      returnDependencies: () => ({
        displaySmallAsZeroAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displaySmallAsZero",
          variableNames: ["value"]
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["displaySmallAsZero"],
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.displaySmallAsZeroAttr !== null) {
          return {
            setValue: {
              displaySmallAsZero: dependencyValues.displaySmallAsZeroAttr.stateValues.value
            }
          }
        } else if (dependencyValues.functionChild.length > 0 && !usedDefault.functionChild[0]) {
          return {
            setValue: {
              displaySmallAsZero: dependencyValues.functionChild[0].stateValues.displaySmallAsZero
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { displaySmallAsZero: true }
          }
        }
      }
    }

    stateVariableDefinitions.padZeros = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      defaultValue: false,
      hasEssential: true,
      returnDependencies: () => ({
        padZerosAttr: {
          dependencyType: "attributeComponent",
          attributeName: "padZeros",
          variableNames: ["value"]
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["padZeros"],
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.padZerosAttr !== null) {
          return {
            setValue: {
              padZeros: dependencyValues.padZerosAttr.stateValues.value
            }
          }
        } else if (dependencyValues.functionChild.length > 0 && !usedDefault.functionChild[0]) {
          return {
            setValue: {
              padZeros: dependencyValues.functionChild[0].stateValues.padZeros
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { padZeros: true }
          }
        }
      }
    }

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
              dependencyValues.through || dependencyValues.minima ||
              dependencyValues.maxima || dependencyValues.extrema
          }
        }
      }
    }

    stateVariableDefinitions.nInputs = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        nInputsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "nInputs",
          variableNames: ["value"]
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["nInputs"]
        },
        variablesAttr: {
          dependencyType: "attributeComponent",
          attributeName: "variables",
          variableNames: ["nComponents"],
        },
        isInterpolatedFunction: {
          dependencyType: "stateVariable",
          variableName: "isInterpolatedFunction"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.isInterpolatedFunction) {
          return { setValue: { nInputs: 1 } }
        } else if (dependencyValues.nInputsAttr !== null) {
          let nInputs = dependencyValues.nInputsAttr.stateValues.value;
          if (!(nInputs >= 0)) {
            nInputs = 1;
          }
          return { setValue: { nInputs } };
        } else if (dependencyValues.variablesAttr !== null) {
          return { setValue: { nInputs: Math.max(1, dependencyValues.variablesAttr.stateValues.nComponents) } }
        } else if (dependencyValues.functionChild.length > 0) {
          return {
            setValue: {
              nInputs: dependencyValues.functionChild[0].stateValues.nInputs
            }
          }
        } else {
          return { setValue: { nInputs: 1 } }
        }
      }
    }

    stateVariableDefinitions.nOutputs = {
      defaultValue: 1,
      hasEssential: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        nOutputsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "nOutputs",
          variableNames: ["value"]
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["nOutputs"]
        },
        mathChild: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value"]
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.functionChild.length > 0) {
          return {
            setValue: {
              nOutputs: dependencyValues.functionChild[0].stateValues.nOutputs
            }
          }
        } else if (dependencyValues.nOutputsAttr !== null) {
          let nOutputs = dependencyValues.nOutputsAttr.stateValues.value;
          if (!(nOutputs >= 0)) {
            nOutputs = 1;
          }
          return { setValue: { nOutputs } };
        } else if (dependencyValues.mathChild.length > 0) {
          let formula = dependencyValues.mathChild[0].stateValues.value;
          let formulaIsVectorValued = Array.isArray(formula.tree) &&
            ["tuple", "vector"].includes(formula.tree[0]);

          let nOutputs = 1;
          if (formulaIsVectorValued) {
            nOutputs = formula.tree.length - 1;
          }
          return { setValue: { nOutputs } }
        } else {
          return { useEssentialOrDefaultValue: { nOutputs: true } }
        }
      }
    }

    stateVariableDefinitions.domain = {
      returnDependencies: () => ({
        domainAttr: {
          dependencyType: "attributeComponent",
          attributeName: "domain",
          variableNames: ["intervals"]
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["domain"]
        },
        nInputs: {
          dependencyType: "stateVariable",
          variableName: "nInputs"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.domainAttr !== null) {
          let nInputs = dependencyValues.nInputs;
          let domain = dependencyValues.domainAttr.stateValues.intervals.slice(0, nInputs);
          if (domain.length !== nInputs) {
            return { setValue: { domain: null } }
          }

          if (!domain.every(interval =>
            Array.isArray(interval.tree)
            && interval.tree[0] === "interval"
          )) {
            return { setValue: { domain: null } }
          }

          return { setValue: { domain } };
        } else if (dependencyValues.functionChild.length > 0) {
          return {
            setValue: {
              domain: dependencyValues.functionChild[0].stateValues.domain
            }
          }
        } else {
          return { setValue: { domain: null } }
        }
      }
    }

    stateVariableDefinitions.simplify = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        simplifySpecified: {
          dependencyType: "stateVariable",
          variableName: "simplifySpecified"
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["simplify"]
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        if (usedDefault.simplifySpecified && dependencyValues.functionChild.length > 0) {
          return {
            setValue: {
              simplify: dependencyValues.functionChild[0].stateValues.simplify
            }
          }
        } else {
          return { setValue: { simplify: dependencyValues.simplifySpecified } }
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues, usedDefault }) {
        if (usedDefault.simplifySpecified && dependencyValues.functionChild.length > 0) {
          return {
            success: true,
            instructions: [{
              setDependency: "functionChild",
              desiredValue: desiredStateVariableValues.simplify,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setDependency: "simplifySpecified",
              desiredValue: desiredStateVariableValues.simplify,
            }]
          }
        }
      }
    }

    stateVariableDefinitions.expand = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        expandSpecified: {
          dependencyType: "stateVariable",
          variableName: "expandSpecified"
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["expand"]
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        if (usedDefault.expandSpecified && dependencyValues.functionChild.length > 0) {
          return {
            setValue: {
              expand: dependencyValues.functionChild[0].stateValues.expand
            }
          }
        } else {
          return { setValue: { expand: dependencyValues.expandSpecified } }
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues, usedDefault }) {
        if (usedDefault.expandSpecified && dependencyValues.functionChild.length > 0) {
          return {
            success: true,
            instructions: [{
              setDependency: "functionChild",
              desiredValue: desiredStateVariableValues.expand,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setDependency: "expandSpecified",
              desiredValue: desiredStateVariableValues.expand,
            }]
          }
        }
      }
    }

    stateVariableDefinitions.numericalfShadow = {
      defaultValue: null,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          numericalfShadow: true
        }
      }),
    }

    stateVariableDefinitions.symbolicfShadow = {
      defaultValue: null,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          symbolicfShadow: true
        }
      }),
    }


    stateVariableDefinitions.symbolic = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      defaultValue: false,
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
          variableNames: ["symbolic"]
        },
        numericalfShadow: {
          dependencyType: "stateVariable",
          variableName: "numericalfShadow"
        },
        symbolicfShadow: {
          dependencyType: "stateVariable",
          variableName: "symbolicfShadow"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.symbolicAttr !== null) {
          return { setValue: { symbolic: dependencyValues.symbolicAttr.stateValues.value } }
        } else if (dependencyValues.functionChild.length > 0) {
          return { setValue: { symbolic: dependencyValues.functionChild[0].stateValues.symbolic } }
        } else if (dependencyValues.numericalfShadow) {
          return { setValue: { symbolic: false } }
        } else if (dependencyValues.symbolicfShadow) {
          return { setValue: { symbolic: true } }
        } else {
          return { useEssentialOrDefaultValue: { symbolic: true } }
        }
      }
    }

    stateVariableDefinitions.variables = {
      isArray: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "variable",
      },
      entryPrefixes: ["variable"],
      returnArraySizeDependencies: () => ({
        nInputs: {
          dependencyType: "stateVariable",
          variableName: "nInputs",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nInputs];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          variablesAttr: {
            dependencyType: "attributeComponent",
            attributeName: "variables",
            variableNames: ["variables"],
          },
          parentVariableForChild: {
            dependencyType: "parentStateVariable",
            variableName: "variableForChild"
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
          }
        }

        return { globalDependencies, dependenciesByKey }
      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arraySize, arrayKeys, usedDefault }) {
        if (globalDependencyValues.variablesAttr !== null) {
          let variablesSpecified = globalDependencyValues.variablesAttr.stateValues.variables;
          return {
            setValue: {
              variables: returnNVariables(arraySize[0], variablesSpecified)
            }
          }
        } else if (globalDependencyValues.functionChild.length > 0) {
          let variables = {};
          for (let arrayKey of arrayKeys) {
            variables[arrayKey] = dependencyValuesByKey[arrayKey].functionChild[0]
              .stateValues["variable" + (Number(arrayKey) + 1)];
          }
          return { setValue: { variables } }
        } else if (globalDependencyValues.parentVariableForChild && !usedDefault.parentVariableForChild) {
          return { setValue: { variables: Array(arraySize[0]).fill(globalDependencyValues.parentVariableForChild) } }
        } else {
          return {
            setValue: {
              variables: returnNVariables(arraySize[0], [])
            }
          }
        }
      }
    }

    stateVariableDefinitions.variable = {
      isAlias: true,
      targetVariableName: "variable1"
    };

    stateVariableDefinitions.unnormalizedFormula = {
      defaultValue: me.fromAst(0),
      hasEssential: true,
      returnDependencies: () => ({
        mathChild: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value"]
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["formula"],
        },
        isInterpolatedFunction: {
          dependencyType: "stateVariable",
          variableName: "isInterpolatedFunction"
        }
      }),
      definition: function ({ dependencyValues, usedDefault }) {

        if (dependencyValues.isInterpolatedFunction) {
          return { setValue: { unnormalizedFormula: me.fromAst('\uff3f') } };
        } else if (dependencyValues.mathChild.length > 0) {
          return {
            setValue: {
              unnormalizedFormula: dependencyValues.mathChild[0].stateValues.value
            }
          }
        } else if (dependencyValues.functionChild.length > 0 &&
          !usedDefault.functionChild[0].formula
        ) {
          return {
            setValue: {
              unnormalizedFormula: dependencyValues.functionChild[0].stateValues.formula
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { unnormalizedFormula: true }
          }
        }
      }

    }

    stateVariableDefinitions.formula = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
      },
      defaultValue: me.fromAst(0),
      hasEssential: true,
      returnDependencies: () => ({
        unnormalizedFormula: {
          dependencyType: "stateVariable",
          variableName: "unnormalizedFormula"
        },
        simplify: {
          dependencyType: "stateVariable",
          variableName: "simplify"
        },
        expand: {
          dependencyType: "stateVariable",
          variableName: "expand"
        }
      }),
      definition: function ({ dependencyValues, usedDefault }) {
        // need to communicate the case when
        // the default value of 0 was used
        if (usedDefault.unnormalizedFormula) {
          return {
            useEssentialOrDefaultValue: { formula: true }
          }
        }

        let formula = normalizeMathExpression({
          value: dependencyValues.unnormalizedFormula,
          simplify: dependencyValues.simplify,
          expand: dependencyValues.expand,
        });

        return {
          setValue: { formula }
        }
      }

    }


    // variables for interpolated function

    stateVariableDefinitions.nPrescribedPoints = {
      returnDependencies: () => ({
        through: {
          dependencyType: "attributeComponent",
          attributeName: "through",
          variableNames: ["nPoints"]
        }
      }),
      definition({ dependencyValues }) {

        let nPrescribedPoints = 0;
        if (dependencyValues.through !== null) {
          nPrescribedPoints = dependencyValues.through.stateValues.nPoints;
        }
        return {
          setValue: { nPrescribedPoints }
        }
      }
    }

    stateVariableDefinitions.prescribedPoints = {
      isArray: true,
      entryPrefixes: ["prescribedPoint"],
      returnArraySizeDependencies: () => ({
        nPrescribedPoints: {
          dependencyType: "stateVariable",
          variableName: "nPrescribedPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nPrescribedPoints];
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
          }

        }

        return { dependenciesByKey }
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
              slope = throughSlopes.stateValues["math" + pointNum]
              if (slope === undefined) {
                slope = null;
              }
            }

            prescribedPoints[arrayKey] = {
              x: point[0],
              y: point[1],
              slope
            }
          }
        }
        return { setValue: { prescribedPoints } }
      }
    }

    stateVariableDefinitions.prescribedMinima = {
      returnDependencies: () => ({
        minima: {
          dependencyType: "attributeComponent",
          attributeName: "minima",
          variableNames: ["extrema"]
        }
      }),
      definition({ dependencyValues }) {
        let prescribedMinima = [];
        if (dependencyValues.minima !== null) {
          prescribedMinima = dependencyValues.minima.stateValues.extrema.map(v => ({
            x: v[0],
            y: v[1]
          }))
        }
        return {
          setValue: { prescribedMinima }
        }
      }
    }


    stateVariableDefinitions.prescribedMaxima = {
      returnDependencies: () => ({
        maxima: {
          dependencyType: "attributeComponent",
          attributeName: "maxima",
          variableNames: ["extrema"]
        }
      }),
      definition({ dependencyValues }) {
        let prescribedMaxima = [];
        if (dependencyValues.maxima !== null) {
          prescribedMaxima = dependencyValues.maxima.stateValues.extrema.map(v => ({
            x: v[0],
            y: v[1]
          }))
        }
        return {
          setValue: { prescribedMaxima }
        }
      }
    }


    stateVariableDefinitions.prescribedExtrema = {
      returnDependencies: () => ({
        extrema: {
          dependencyType: "attributeComponent",
          attributeName: "extrema",
          variableNames: ["extrema"]
        }
      }),
      definition({ dependencyValues }) {
        let prescribedExtrema = [];
        if (dependencyValues.extrema !== null) {
          prescribedExtrema = dependencyValues.extrema.stateValues.extrema.map(v => ({
            x: v[0],
            y: v[1]
          }))
        }
        return {
          setValue: { prescribedExtrema }
        }
      }
    }


    stateVariableDefinitions.interpolationPoints = {
      returnDependencies: () => ({
        xscale: {
          dependencyType: "stateVariable",
          variableName: "xscale"
        },
        yscale: {
          dependencyType: "stateVariable",
          variableName: "yscale"
        },
        prescribedPoints: {
          dependencyType: "stateVariable",
          variableName: "prescribedPoints"
        },
        prescribedMinima: {
          dependencyType: "stateVariable",
          variableName: "prescribedMinima"
        },
        prescribedMaxima: {
          dependencyType: "stateVariable",
          variableName: "prescribedMaxima"
        },
        prescribedExtrema: {
          dependencyType: "stateVariable",
          variableName: "prescribedExtrema"
        },
      }),
      definition: ({ dependencyValues }) =>
        calculateInterpolationPoints({ dependencyValues, numerics })
    }

    stateVariableDefinitions.xs = {
      additionalStateVariablesDefined: ["coeffs"],
      returnDependencies: () => ({
        interpolationPoints: {
          dependencyType: "stateVariable",
          variableName: "interpolationPoints"
        }
      }),
      definition: computeSplineParamCoeffs
    }


    stateVariableDefinitions.symbolicfs = {
      isArray: true,
      entryPrefixes: ["symbolicf"],
      stateVariablesDeterminingDependencies: ["isInterpolatedFunction"],
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
        if (stateValues.isInterpolatedFunction) {
          return {
            globalDependencies: {
              xs: {
                dependencyType: "stateVariable",
                variableName: "xs"
              },
              coeffs: {
                dependencyType: "stateVariable",
                variableName: "coeffs"
              },
              interpolationPoints: {
                dependencyType: "stateVariable",
                variableName: "interpolationPoints"
              },
              isInterpolatedFunction: {
                dependencyType: "stateVariable",
                variableName: "isInterpolatedFunction"
              },
              domain: {
                dependencyType: "stateVariable",
                variableName: "domain"
              }
            }
          }
        } else {
          return {
            globalDependencies: {
              formula: {
                dependencyType: "stateVariable",
                variableName: "formula",
              },
              variables: {
                dependencyType: "stateVariable",
                variableName: "variables",
              },
              nInputs: {
                dependencyType: "stateVariable",
                variableName: "nInputs",
              },
              functionChild: {
                dependencyType: "child",
                childGroups: ["functions"],
                variableNames: ["symbolicfs"],
              },
              simplify: {
                dependencyType: "stateVariable",
                variableName: "simplify"
              },
              expand: {
                dependencyType: "stateVariable",
                variableName: "expand"
              },
              isInterpolatedFunction: {
                dependencyType: "stateVariable",
                variableName: "isInterpolatedFunction"
              },
              symbolicfShadow: {
                dependencyType: "stateVariable",
                variableName: "symbolicfShadow"
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
        }
      },
      arrayDefinitionByKey: function ({ globalDependencyValues, usedDefault, arrayKeys }) {

        if (globalDependencyValues.isInterpolatedFunction) {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            if (arrayKey === "0") {
              let numericalf = returnInterpolatedFunction({
                xs: globalDependencyValues.xs,
                coeffs: globalDependencyValues.coeffs,
                interpolationPoints: globalDependencyValues.interpolationPoints,
                domain: globalDependencyValues.domain
              });
              symbolicfs[arrayKey] = function (x) {
                me.fromAst(numericalf(x.evaluate_to_constant()))
              }
            } else {
              symbolicfs[arrayKey] = x => me.fromAst('\uff3f');
            }
          }
          return {
            setValue: { symbolicfs }
          }
        } else if (!usedDefault.formula && (
          globalDependencyValues.formula.tree !== '\uff3f'
          || globalDependencyValues.functionChild.length === 0
        )) {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            symbolicfs[arrayKey] = returnSymbolicFunctionFromFormula(globalDependencyValues, arrayKey);
          }
          return {
            setValue: { symbolicfs }
          }
        } else if (globalDependencyValues.functionChild.length > 0) {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            symbolicfs[arrayKey] = globalDependencyValues.functionChild[0].stateValues
              .symbolicfs[arrayKey];
          }
          return {
            setValue: { symbolicfs }
          }
        } else if (globalDependencyValues.symbolicfShadow) {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            if (arrayKey === "0") {
              symbolicfs[arrayKey] = globalDependencyValues.symbolicfShadow;
            } else {
              symbolicfs[arrayKey] = x => me.fromAst('\uff3f');
            }
          }
          return {
            setValue: { symbolicfs }
          }

        } else if (globalDependencyValues.numericalfShadow) {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            if (arrayKey === "0") {
              symbolicfs[arrayKey] = function (x) {
                let input = x.evaluate_to_constant();
                if (input === null) {
                  return NaN;
                }
                return me.fromAst(globalDependencyValues.numericalfShadow(input))
              }
            } else {
              symbolicfs[arrayKey] = x => me.fromAst('\uff3f');
            }
          }
          return {
            setValue: { symbolicfs }
          }
        } else {
          let symbolicfs = {};
          for (let arrayKey of arrayKeys) {
            symbolicfs[arrayKey] = returnSymbolicFunctionFromFormula(globalDependencyValues, arrayKey);
          }
          return {
            setValue: { symbolicfs }
          }
        }
      }
    }

    stateVariableDefinitions.symbolicf = {
      isAlias: true,
      targetVariableName: "symbolicf1"
    };


    stateVariableDefinitions.numericalfs = {
      isArray: true,
      entryPrefixes: ["numericalf"],
      stateVariablesDeterminingDependencies: ["isInterpolatedFunction"],
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
        if (stateValues.isInterpolatedFunction) {
          return {
            globalDependencies: {
              xs: {
                dependencyType: "stateVariable",
                variableName: "xs"
              },
              coeffs: {
                dependencyType: "stateVariable",
                variableName: "coeffs"
              },
              interpolationPoints: {
                dependencyType: "stateVariable",
                variableName: "interpolationPoints"
              },
              isInterpolatedFunction: {
                dependencyType: "stateVariable",
                variableName: "isInterpolatedFunction"
              },
              domain: {
                dependencyType: "stateVariable",
                variableName: "domain"
              }
            }
          }
        } else {
          return {
            globalDependencies: {
              formula: {
                dependencyType: "stateVariable",
                variableName: "formula",
              },
              variables: {
                dependencyType: "stateVariable",
                variableName: "variables",
              },
              nInputs: {
                dependencyType: "stateVariable",
                variableName: "nInputs",
              },
              functionChild: {
                dependencyType: "child",
                childGroups: ["functions"],
                variableNames: ["numericalfs"],
              },
              isInterpolatedFunction: {
                dependencyType: "stateVariable",
                variableName: "isInterpolatedFunction"
              },
              symbolicfShadow: {
                dependencyType: "stateVariable",
                variableName: "symbolicfShadow"
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
        }
      },
      arrayDefinitionByKey: function ({ globalDependencyValues, usedDefault, arrayKeys }) {
        if (globalDependencyValues.isInterpolatedFunction) {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            if (arrayKey === "0") {
              numericalfs[arrayKey] = returnInterpolatedFunction({
                xs: globalDependencyValues.xs,
                coeffs: globalDependencyValues.coeffs,
                interpolationPoints: globalDependencyValues.interpolationPoints,
                domain: globalDependencyValues.domain
              });
            } else {
              numericalfs[arrayKey] = x => me.fromAst('\uff3f');
            }
          }
          return {
            setValue: { numericalfs }
          }
        } else if (!usedDefault.formula && (
          globalDependencyValues.formula.tree !== '\uff3f'
          || globalDependencyValues.functionChild.length === 0
        )) {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            numericalfs[arrayKey] = returnNumericalFunctionFromFormula({
              formula: globalDependencyValues.formula,
              nInputs: globalDependencyValues.nInputs,
              variables: globalDependencyValues.variables,
              domain: globalDependencyValues.domain,
              component: arrayKey
            })
          }
          return {
            setValue: { numericalfs }
          }
        } else if (globalDependencyValues.functionChild.length > 0) {
          let numericalfs = {};
          for (let arrayKey of arrayKeys) {
            numericalfs[arrayKey] = globalDependencyValues.functionChild[0].stateValues
              .numericalfs[arrayKey];
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
            numericalfs[arrayKey] = returnNumericalFunctionFromFormula({
              formula: globalDependencyValues.formula,
              nInputs: globalDependencyValues.nInputs,
              variables: globalDependencyValues.variables,
              domain: globalDependencyValues.domain,
              component: arrayKey
            })
          }
          return {
            setValue: { numericalfs }
          }
        }
      }
    }

    // rather than use alias, create actual numericalf
    // state variable as we use it for an adapter
    stateVariableDefinitions.numericalf = {
      returnDependencies: () => ({
        numericalf1: {
          dependencyType: "stateVariable",
          variableName: "numericalf1"
        }
      }),
      definition({ dependencyValues }) {
        return { setValue: { numericalf: dependencyValues.numericalf1 } };
      }
    };

    stateVariableDefinitions.fDefinition = {
      stateVariablesDeterminingDependencies: ["isInterpolatedFunction"],
      returnDependencies({ stateValues }) {
        if (stateValues.isInterpolatedFunction) {
          return {
            xs: {
              dependencyType: "stateVariable",
              variableName: "xs"
            },
            coeffs: {
              dependencyType: "stateVariable",
              variableName: "coeffs"
            },
            interpolationPoints: {
              dependencyType: "stateVariable",
              variableName: "interpolationPoints"
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction"
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain"
            }
          }
        } else {
          return {
            formula: {
              dependencyType: "stateVariable",
              variableName: "formula",
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables",
            },
            nInputs: {
              dependencyType: "stateVariable",
              variableName: "nInputs",
            },
            nOutputs: {
              dependencyType: "stateVariable",
              variableName: "nOutputs",
            },
            functionChild: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["fDefinition"],
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction"
            },
            symbolicfShadow: {
              dependencyType: "stateVariable",
              variableName: "symbolicfShadow"
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
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.isInterpolatedFunction) {
          return {
            setValue: {
              fDefinition: {
                functionType: "interpolated",
                xs: dependencyValues.xs,
                coeffs: dependencyValues.coeffs,
                interpolationPoints: dependencyValues.interpolationPoints,
                domain: dependencyValues.domain,
              }
            }
          }

        } else if (!usedDefault.formula && (
          dependencyValues.formula.tree !== '\uff3f'
          || dependencyValues.functionChild.length === 0
        )) {
          return {
            setValue: {
              fDefinition: {
                functionType: "formula",
                formula: dependencyValues.formula.tree,
                variables: dependencyValues.variables.map(x => x.tree),
                nInputs: dependencyValues.nInputs,
                nOutputs: dependencyValues.nOutputs,
                domain: dependencyValues.domain,
              }
            }
          }
        } else if (dependencyValues.functionChild.length > 0) {
          return {
            setValue: {
              fDefinition: dependencyValues.functionChild[0].stateValues.fDefinition
            }
          }
        } else if (dependencyValues.numericalfShadow) {
          // TODO: ??
          return {
            setValue: { fDefinition: {} }
          }

        } else if (dependencyValues.symbolicfShadow) {
          // TODO: ??
          return {
            setValue: { fDefinition: {} }
          }
        } else {
          return {
            setValue: {
              fDefinition: {
                functionType: "formula",
                formula: dependencyValues.formula.tree,
                variables: dependencyValues.variables.map(x => x.tree),
                nInputs: dependencyValues.nInputs,
                nOutputs: dependencyValues.nOutputs,
                domain: dependencyValues.domain,
              }
            }
          }
        }
      }
    }


    stateVariableDefinitions.fs = {
      isArray: true,
      entryPrefixes: ["f"],
      returnArraySizeDependencies: () => ({
        nOutputs: {
          dependencyType: "stateVariable",
          variableName: "nOutputs"
        }
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nOutputs];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          symbolic: {
            dependencyType: "stateVariable",
            variableName: "symbolic",
          }
        }

        let dependenciesByKey = {}
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
          }
        }

        return { globalDependencies, dependenciesByKey };

      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {
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
        return { setValue: { fs } }
      }
    }

    stateVariableDefinitions.f = {
      isAlias: true,
      targetVariableName: "f1"
    };

    stateVariableDefinitions.latex = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        formula: {
          dependencyType: "stateVariable",
          variableName: "formula"
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
        let latex = roundForDisplay({
          value: dependencyValues.formula,
          dependencyValues, usedDefault
        }).toLatex(params);
        return { setValue: { latex } };
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
        return { setValue: { latexWithInputChildren: [dependencyValues.latex] } };
      }
    }


    stateVariableDefinitions.allMinima = {
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
              variableName: "coeffs"
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction"
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain"
            },
          }
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
              variableName: "xscale"
            },
            functionChild: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["allMinima"],
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction"
            },
            nInputs: {
              dependencyType: "stateVariable",
              variableName: "nInputs"
            },
            nOutputs: {
              dependencyType: "stateVariable",
              variableName: "nOutputs"
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain"
            },

          }
        }
      },
      definition: function ({ dependencyValues }) {

        if (dependencyValues.isInterpolatedFunction) {

          let xs = dependencyValues.xs;
          let coeffs = dependencyValues.coeffs;
          let eps = numerics.eps;

          let minimaList = [];

          if (xs === null) {
            return { setValue: { allMinima: minimaList } }
          }

          let minimumAtPreviousRight = false;

          let minx = -Infinity, maxx = Infinity;
          let openMin = false, openMax = false;
          if (dependencyValues.domain !== null) {
            let domain = dependencyValues.domain[0];
            if (domain !== undefined) {
              try {
                minx = me.fromAst(domain.tree[1][1]).evaluate_to_constant();
                if (!Number.isFinite(minx)) {
                  minx = -Infinity;
                } else {
                  openMin = !domain.tree[2][1];
                }
                maxx = me.fromAst(domain.tree[1][2]).evaluate_to_constant();
                if (!Number.isFinite(maxx)) {
                  maxx = Infinity;
                } else {
                  openMax = !domain.tree[2][2];
                }
              } catch (e) { }
            }
          }

          let buffer = 1E-14 * Math.max(Math.abs(minx), Math.abs(maxx));

          // since extrapolate for x < xs[0], formula based on coeffs[0]
          // is valid for x < xs[1]
          let c = coeffs[0];
          let dx = xs[1] - xs[0];

          if (c[3] === 0) {
            // have quadratic.  Minimum only if c[2] > 0
            if (c[2] > 0) {
              let x = -c[1] / (2 * c[2]);
              if (x + xs[0] >= minx - buffer && x + xs[0] <= maxx + buffer) {
                if (x <= dx - eps) {
                  if (!((openMin && Math.abs(x + xs[0] - minx) < buffer) || (openMax && Math.abs(x + xs[0] - maxx) < buffer))) {
                    minimaList.push([x + xs[0], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                  }
                } else if (Math.abs(x - dx) < eps) {
                  minimumAtPreviousRight = true;
                }
              }
            }
          } else {
            // since c[3] != 0, have cubic

            let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
            if (discrim > 0) {
              let sqrtdiscrim = Math.sqrt(discrim);

              // critical point where choose +sqrtdiscrim is minimum
              let x = (-2 * c[2] + sqrtdiscrim) / (6 * c[3]);
              if (x + xs[0] >= minx - buffer && x + xs[0] <= maxx + buffer) {
                if (x <= dx - eps) {
                  if (!((openMin && Math.abs(x + xs[0] - minx) < buffer) || (openMax && Math.abs(x + xs[0] - maxx) < buffer))) {
                    minimaList.push([x + xs[0], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                  }
                } else if (Math.abs(x - dx) < eps) {
                  minimumAtPreviousRight = true;
                }
              }
            }
          }

          for (let i = 1; i < xs.length - 2; i++) {
            c = coeffs[i];
            dx = xs[i + 1] - xs[i];

            if (c[3] === 0) {
              // have quadratic.  Minimum only if c[2] > 0
              if (c[2] > 0) {
                let x = -c[1] / (2 * c[2]);
                if (x + xs[i] >= minx - buffer) {
                  if (x + xs[i] <= maxx + buffer) {
                    if (Math.abs(x) < eps) {
                      if (minimumAtPreviousRight) {
                        if (!((openMin && Math.abs(x + xs[i] - minx) < buffer) || (openMax && Math.abs(x + xs[i] - maxx) < buffer))) {
                          minimaList.push([x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                        }
                      }
                    } else if (x >= eps && x <= dx - eps) {
                      if (!((openMin && Math.abs(x + xs[i] - minx) < buffer) || (openMax && Math.abs(x + xs[i] - maxx) < buffer))) {
                        minimaList.push([x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                      }
                    }
                    minimumAtPreviousRight = (Math.abs(x - dx) < eps);
                  } else {
                    minimumAtPreviousRight = false;
                    continue;
                  }
                }
              } else {
                minimumAtPreviousRight = false;
              }
            } else {
              // since c[3] != 0, have cubic

              let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
              if (discrim > 0) {
                let sqrtdiscrim = Math.sqrt(discrim);

                // critical point where choose +sqrtdiscrim is minimum
                let x = (-2 * c[2] + sqrtdiscrim) / (6 * c[3]);
                if (x + xs[i] >= minx - buffer) {
                  if (x + xs[i] <= maxx + buffer) {
                    if (Math.abs(x) < eps) {
                      if (minimumAtPreviousRight) {
                        if (!((openMin && Math.abs(x + xs[i] - minx) < buffer) || (openMax && Math.abs(x + xs[i] - maxx) < buffer))) {
                          minimaList.push([x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                        }
                      }
                    } else if (x >= eps && x <= dx - eps) {
                      if (!((openMin && Math.abs(x + xs[i] - minx) < buffer) || (openMax && Math.abs(x + xs[i] - maxx) < buffer))) {
                        minimaList.push([x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                      }
                    }
                    minimumAtPreviousRight = (Math.abs(x - dx) < eps);
                  } else {
                    minimumAtPreviousRight = false;
                    continue;
                  }
                }

              } else {
                minimumAtPreviousRight = false;
              }
            }
          }

          // since extrapolate for x > xs[n-1], formula based on coeffs[n-2]
          // is valid for x > xs[n-2]
          c = coeffs[xs.length - 2]
          if (c[3] === 0) {
            // have quadratic.  Minimum only if c[2] > 0
            if (c[2] > 0) {
              let x = -c[1] / (2 * c[2]);
              if (x + xs[xs.length - 2] >= minx - buffer && x + xs[xs.length - 2] <= maxx + buffer) {
                if (Math.abs(x) < eps) {
                  if (minimumAtPreviousRight) {
                    if (!((openMin && Math.abs(x + xs[xs.length - 2] - minx) < buffer) || (openMax && Math.abs(x + xs[xs.length - 2] - maxx) < buffer))) {
                      minimaList.push([x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                    }
                  }
                } else if (x >= eps) {
                  if (!((openMin && Math.abs(x + xs[xs.length - 2] - minx) < buffer) || (openMax && Math.abs(x + xs[xs.length - 2] - maxx) < buffer))) {
                    minimaList.push([x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                  }
                }
              }
            }
          } else {
            // since c[3] != 0, have cubic

            let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
            if (discrim > 0) {
              let sqrtdiscrim = Math.sqrt(discrim);

              // critical point where choose +sqrtdiscrim is minimum
              let x = (-2 * c[2] + sqrtdiscrim) / (6 * c[3]);
              if (x + xs[xs.length - 2] >= minx - buffer && x + xs[xs.length - 2] <= maxx + buffer) {
                if (x >= eps) {
                  if (!((openMin && Math.abs(x + xs[xs.length - 2] - minx) < buffer) || (openMax && Math.abs(x + xs[xs.length - 2] - maxx) < buffer))) {
                    minimaList.push([x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                  }
                } else if (Math.abs(x) < eps) {
                  if (minimumAtPreviousRight) {
                    if (!((openMin && Math.abs(x + xs[xs.length - 2] - minx) < buffer) || (openMax && Math.abs(x + xs[xs.length - 2] - maxx) < buffer))) {
                      minimaList.push([x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                    }
                  }
                }
              }
            }
          }

          return { setValue: { allMinima: minimaList } }

        } else {

          // check for presence of functionChild
          // as derived classes may have changed the dependencies
          // to eliminate functionChildDependency
          if (dependencyValues.functionChild && dependencyValues.functionChild.length > 0) {

            return {
              setValue: {
                allMinima: dependencyValues.functionChild[0].stateValues.allMinima
              }
            }
          }

          // no function child

          // calculate only for functions from R -> R
          if (!(dependencyValues.nInputs === 1 && dependencyValues.nOutputs === 1)) {
            return {
              setValue: {
                allMinima: []
              }
            }
          }

          let varString = dependencyValues.variables[0].subscripts_to_strings().tree;

          let derivative_formula = dependencyValues.formula.subscripts_to_strings().derivative(varString)

          let derivative_f;
          let haveDerivative = true;
          let derivative;

          try {
            derivative_f = derivative_formula.subscripts_to_strings().f();
          } catch (e) {
            haveDerivative = false;
            derivative = () => NaN;
          }

          if (haveDerivative) {
            derivative = function (x) {
              try {
                return derivative_f({ [varString]: x });
              } catch (e) {
                return NaN;
              }
            }
          }

          // second argument is true to ignore domain
          let f = x => dependencyValues.numericalf(x, true);

          // for now, look for minima in interval -100*xscale to 100*xscale,
          // or domain if specified,
          // dividing interval into 1000 subintervals
          let minx = -100 * dependencyValues.xscale;
          let maxx = 100 * dependencyValues.xscale;
          let openMin = false, openMax = false;

          if (dependencyValues.domain !== null) {
            let domain = dependencyValues.domain[0];
            if (domain !== undefined) {
              try {
                minx = me.fromAst(domain.tree[1][1]).evaluate_to_constant();
                if (!Number.isFinite(minx)) {
                  minx = -100 * dependencyValues.xscale;
                } else {
                  openMin = !domain.tree[2][1];
                }
                maxx = me.fromAst(domain.tree[1][2]).evaluate_to_constant();
                if (!Number.isFinite(maxx)) {
                  maxx = 100 * dependencyValues.xscale;
                } else {
                  openMax = !domain.tree[2][2];
                }
              } catch (e) { }
            }
          }

          let nIntervals = 1000;
          let dx = (maxx - minx) / nIntervals;

          let buffer = 1E-10 * Math.max(Math.abs(minx), Math.abs(maxx));

          let minimaList = [];
          let minimumAtPreviousRight = false;
          let addedAtPreviousRightViaDeriv = false;
          let fright = f(minx - dx);
          let dright = derivative(minx - dx);
          for (let i = -1; i < nIntervals + 1; i++) {
            let xleft = minx + i * dx;
            let xright = minx + (i + 1) * dx;
            let fleft = fright;
            fright = f(xright);
            let dleft = dright;
            dright = derivative(xright);

            if (Number.isNaN(fleft) || Number.isNaN(fright)) {
              continue;
            }

            let foundFromDeriv = false;

            if (haveDerivative && dleft * dright <= 0) {
              let x;

              if (dleft === 0) {
                x = xleft;
              } else if (dright === 0) {
                x = xright;
              } else {
                x = numerics.fzero(derivative, [xleft, xright]);
              }

              // calculate tolerance used in fzero:
              let eps = 1E-6;
              let tol_act = 0.5 * eps * (Math.abs(x) + 1);

              if (derivative(x - tol_act) < 0 && derivative(x + tol_act) > 0) {
                foundFromDeriv = true;
                minimumAtPreviousRight = false;
                if (x >= minx - buffer && x <= maxx + buffer
                  && !((openMin && Math.abs(x - minx) < buffer) || (openMax && Math.abs(x - maxx) < buffer))
                  && !(addedAtPreviousRightViaDeriv && Math.abs(x - xleft) < buffer)
                ) {
                  minimaList.push([x, f(x)]);
                  addedAtPreviousRightViaDeriv = Math.abs(x - xright) < buffer;
                } else {
                  addedAtPreviousRightViaDeriv = false;
                }

              }
            }

            if (!foundFromDeriv) {

              addedAtPreviousRightViaDeriv = false;

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
          }

          return { setValue: { allMinima: minimaList } }

        }
      }
    }

    stateVariableDefinitions.numberMinima = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        allMinima: {
          dependencyType: "stateVariable",
          variableName: "allMinima"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { numberMinima: dependencyValues.allMinima.length },
          checkForActualChange: { numberMinima: true }
        }
      }
    }

    stateVariableDefinitions.minima = {
      stateVariablesDeterminingDependencies: ["isInterpolatedFunction"],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
        returnWrappingComponents(prefix) {
          if (prefix === "minimum" || prefix === undefined) {
            // minimum or entire array
            // These are points,
            // wrap inner dimension by both <point> and <xs>
            // don't wrap outer dimension (for entire array)
            return [["point", { componentType: "mathList", isAttribute: "xs" }]];
          } else {
            // don't wrap minimumLocation(s) or minimumValues(s)
            return [];
          }
        },
      },
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["minimum", "minimumLocations", "minimumLocation", "minimumValues", "minimumValue"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (["minimum", "minimumLocation", "minimumValue"].includes(arrayEntryPrefix)) {
          let pointInd = Number(varEnding) - 1;
          if (Number.isInteger(pointInd) && pointInd >= 0) {
            // If not given the array size,
            // then return the array keys assuming the array is large enough.
            // Must do this as it is used to determine potential array entries.
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
          if (varEnding !== "") {
            return [];
          }

          if (!arraySize) {
            // if don't have arraySize, just use first point assuming array size is large enough
            return ["0,0"]
          }

          // array of "i,0"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",0")
        } else if (arrayEntryPrefix === "minimumValues") {
          if (varEnding !== "") {
            return [];
          }

          if (!arraySize) {
            // if don't have arraySize, just use first point assuming array size is large enough
            return ["0,1"]
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
        numberMinima: {
          dependencyType: "stateVariable",
          variableName: "numberMinima",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numberMinima, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allMinima: {
            dependencyType: "stateVariable",
            variableName: "allMinima"
          }
        }

        return { globalDependencies }

      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function minima`)
        // console.log(globalDependencyValues)

        let minima = {};

        for (let ptInd = 0; ptInd < globalDependencyValues.__array_size[0]; ptInd++) {
          for (let i = 0; i < 2; i++) {
            let arrayKey = `${ptInd},${i}`;

            minima[arrayKey] = globalDependencyValues.allMinima[ptInd][i];
          }
        }

        return { setValue: { minima } }
      }
    }

    stateVariableDefinitions.allMaxima = {
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
              variableName: "coeffs"
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction"
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain"
            },
          }

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
              variableName: "xscale"
            },
            functionChild: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["allMaxima"],
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction"
            },
            nInputs: {
              dependencyType: "stateVariable",
              variableName: "nInputs"
            },
            nOutputs: {
              dependencyType: "stateVariable",
              variableName: "nOutputs"
            },
            domain: {
              dependencyType: "stateVariable",
              variableName: "domain"
            },
          }
        }
      },
      definition: function ({ dependencyValues }) {

        if (dependencyValues.isInterpolatedFunction) {

          let xs = dependencyValues.xs;
          let coeffs = dependencyValues.coeffs;
          let eps = numerics.eps;

          let maximaList = [];

          if (xs === null) {
            return { setValue: { allMaxima: maximaList } }
          }

          let maximumAtPreviousRight = false;

          let minx = -Infinity, maxx = Infinity;
          let openMin = false, openMax = false;
          if (dependencyValues.domain !== null) {
            let domain = dependencyValues.domain[0];
            if (domain !== undefined) {
              try {
                minx = me.fromAst(domain.tree[1][1]).evaluate_to_constant();
                if (!Number.isFinite(minx)) {
                  minx = -Infinity;
                } else {
                  openMin = !domain.tree[2][1];
                }
                maxx = me.fromAst(domain.tree[1][2]).evaluate_to_constant();
                if (!Number.isFinite(maxx)) {
                  maxx = Infinity;
                } else {
                  openMax = !domain.tree[2][2];
                }
              } catch (e) { }
            }
          }

          let buffer = 1E-14 * Math.max(Math.abs(minx), Math.abs(maxx));

          // since extrapolate for x < xs[0], formula based on coeffs[0]
          // is valid for x < xs[1]
          let c = coeffs[0];
          let dx = xs[1] - xs[0];

          if (c[3] === 0) {
            // have quadratic.  Maximum only if c[2] < 0
            if (c[2] < 0) {
              let x = -c[1] / (2 * c[2]);
              if (x + xs[0] >= minx - buffer && x + xs[0] <= maxx + buffer) {
                if (x <= dx - eps) {
                  if (!((openMin && Math.abs(x + xs[0] - minx) < buffer) || (openMax && Math.abs(x + xs[0] - maxx) < buffer))) {
                    maximaList.push([x + xs[0], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                  }
                } else if (Math.abs(x - dx) < eps) {
                  maximumAtPreviousRight = true;
                }
              }
            }
          } else {
            // since c[3] != 0, have cubic

            let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
            if (discrim > 0) {
              let sqrtdiscrim = Math.sqrt(discrim);

              // critical point where choose -sqrtdiscrim is maximum
              let x = (-2 * c[2] - sqrtdiscrim) / (6 * c[3]);
              if (x + xs[0] >= minx - buffer && x + xs[0] <= maxx + buffer) {
                if (x <= dx - eps) {
                  if (!((openMin && Math.abs(x + xs[0] - minx) < buffer) || (openMax && Math.abs(x + xs[0] - maxx) < buffer))) {
                    maximaList.push([x + xs[0], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                  }
                } else if (Math.abs(x - dx) < eps) {
                  maximumAtPreviousRight = true;
                }
              }
            }
          }

          for (let i = 1; i < xs.length - 2; i++) {
            c = coeffs[i];
            dx = xs[i + 1] - xs[i];

            if (c[3] === 0) {
              // have quadratic.  Maximum only if c[2] < 0
              if (c[2] < 0) {
                let x = -c[1] / (2 * c[2]);
                if (x + xs[i] >= minx - buffer) {
                  if (x + xs[i] <= maxx + buffer) {
                    if (Math.abs(x) < eps) {
                      if (maximumAtPreviousRight) {
                        if (!((openMin && Math.abs(x + xs[i] - minx) < buffer) || (openMax && Math.abs(x + xs[i] - maxx) < buffer))) {
                          maximaList.push([x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                        }
                      }
                    } else if (x >= eps && x <= dx - eps) {
                      if (!((openMin && Math.abs(x + xs[i] - minx) < buffer) || (openMax && Math.abs(x + xs[i] - maxx) < buffer))) {
                        maximaList.push([x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                      }
                    }
                    maximumAtPreviousRight = (Math.abs(x - dx) < eps);
                  } else {
                    maximumAtPreviousRight = false;
                    continue;
                  }
                }
              } else {
                maximumAtPreviousRight = false;
              }
            } else {
              // since c[3] != 0, have cubic

              let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
              if (discrim > 0) {
                let sqrtdiscrim = Math.sqrt(discrim);

                // critical point where choose -sqrtdiscrim is maximum
                let x = (-2 * c[2] - sqrtdiscrim) / (6 * c[3]);
                if (x + xs[i] >= minx - buffer) {
                  if (x + xs[i] <= maxx + buffer) {
                    if (Math.abs(x) < eps) {
                      if (maximumAtPreviousRight) {
                        if (!((openMin && Math.abs(x + xs[i] - minx) < buffer) || (openMax && Math.abs(x + xs[i] - maxx) < buffer))) {
                          maximaList.push([x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                        }
                      }
                    } else if (x >= eps && x <= dx - eps) {
                      if (!((openMin && Math.abs(x + xs[i] - minx) < buffer) || (openMax && Math.abs(x + xs[i] - maxx) < buffer))) {
                        maximaList.push([x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                      }
                    }
                    maximumAtPreviousRight = (Math.abs(x - dx) < eps);
                  } else {
                    maximumAtPreviousRight = false;
                    continue;
                  }
                }
              } else {
                maximumAtPreviousRight = false;
              }
            }
          }

          // since extrapolate for x > xs[n-1], formula based on coeffs[n-2]
          // is valid for x > xs[n-2]
          c = coeffs[xs.length - 2]
          if (c[3] === 0) {
            // have quadratic.  Maximum only if c[2] < 0
            if (c[2] < 0) {
              let x = -c[1] / (2 * c[2]);
              if (x + xs[xs.length - 2] >= minx - buffer && x + xs[xs.length - 2] <= maxx + buffer) {
                if (Math.abs(x) < eps) {
                  if (maximumAtPreviousRight) {
                    if (!((openMin && Math.abs(x + xs[xs.length - 2] - minx) < buffer) || (openMax && Math.abs(x + xs[xs.length - 2] - maxx) < buffer))) {
                      maximaList.push([x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                    }
                  }
                } else if (x >= eps) {
                  if (!((openMin && Math.abs(x + xs[xs.length - 2] - minx) < buffer) || (openMax && Math.abs(x + xs[xs.length - 2] - maxx) < buffer))) {
                    maximaList.push([x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                  }
                }
              }
            }
          } else {
            // since c[3] != 0, have cubic

            let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
            if (discrim > 0) {
              let sqrtdiscrim = Math.sqrt(discrim);

              // critical point where choose -sqrtdiscrim is maximum
              let x = (-2 * c[2] - sqrtdiscrim) / (6 * c[3]);
              if (x + xs[xs.length - 2] >= minx - buffer && x + xs[xs.length - 2] <= maxx + buffer) {
                if (x >= eps) {
                  if (!((openMin && Math.abs(x + xs[xs.length - 2] - minx) < buffer) || (openMax && Math.abs(x + xs[xs.length - 2] - maxx) < buffer))) {
                    maximaList.push([x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                  }
                } else if (Math.abs(x) < eps) {
                  if (maximumAtPreviousRight) {
                    if (!((openMin && Math.abs(x + xs[xs.length - 2] - minx) < buffer) || (openMax && Math.abs(x + xs[xs.length - 2] - maxx) < buffer))) {
                      maximaList.push([x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]);
                    }
                  }
                }
              }
            }
          }

          return { setValue: { allMaxima: maximaList } }


        } else {

          // check for presence of functionChild
          // as derived classes may have changed the dependencies
          // to eliminate functionChildDependency
          if (dependencyValues.functionChild && dependencyValues.functionChild.length > 0) {
            return {
              setValue: {
                allMaxima: dependencyValues.functionChild[0].stateValues.allMaxima
              }
            }
          }

          // no function child

          // calculate only for functions from R -> R
          if (!(dependencyValues.nInputs === 1 && dependencyValues.nOutputs === 1)) {
            return {
              setValue: {
                allMaxima: []
              }
            }
          }


          let varString = dependencyValues.variables[0].subscripts_to_strings().tree;

          let derivative_formula = dependencyValues.formula.subscripts_to_strings().derivative(varString)

          let derivative_f;
          let haveDerivative = true;
          let derivative;

          try {
            derivative_f = derivative_formula.subscripts_to_strings().f();
          } catch (e) {
            haveDerivative = false;
            derivative = () => NaN;
          }

          if (haveDerivative) {
            derivative = function (x) {
              try {
                return derivative_f({ [varString]: x });
              } catch (e) {
                return NaN;
              }
            }
          }


          // second argument is true to ignore domain
          let f = (x) => -dependencyValues.numericalf(x, true);

          // for now, look for maxima in interval -100*xscale to 100*xscale,
          // or domain if specified,
          // dividing interval into 1000 subintervals
          let minx = -100 * dependencyValues.xscale;
          let maxx = 100 * dependencyValues.xscale;
          let openMin = false, openMax = false;

          if (dependencyValues.domain !== null) {
            let domain = dependencyValues.domain[0];
            if (domain !== undefined) {
              try {
                minx = me.fromAst(domain.tree[1][1]).evaluate_to_constant();
                if (!Number.isFinite(minx)) {
                  minx = -100 * dependencyValues.xscale;
                } else {
                  openMin = !domain.tree[2][1];
                }
                maxx = me.fromAst(domain.tree[1][2]).evaluate_to_constant();
                if (!Number.isFinite(maxx)) {
                  maxx = 100 * dependencyValues.xscale;
                } else {
                  openMax = !domain.tree[2][2];
                }
              } catch (e) { }
            }
          }

          let nIntervals = 1000;
          let dx = (maxx - minx) / nIntervals;

          let buffer = 1E-10 * Math.max(Math.abs(minx), Math.abs(maxx));

          let maximaList = [];
          let maximumAtPreviousRight = false;
          let addedAtPreviousRightViaDeriv = false;
          let fright = f(minx - dx);
          let dright = derivative(minx - dx);

          for (let i = -1; i < nIntervals + 1; i++) {
            let xleft = minx + i * dx;
            let xright = minx + (i + 1) * dx;
            let fleft = fright;
            fright = f(xright);
            let dleft = dright;
            dright = derivative(xright);

            if (Number.isNaN(fleft) || Number.isNaN(fright)) {
              continue;
            }

            let foundFromDeriv = false;

            if (haveDerivative && dleft * dright <= 0) {

              let x;

              if (dleft === 0) {
                x = xleft;
              } else if (dright === 0) {
                x = xright;
              } else {
                x = numerics.fzero(derivative, [xleft, xright]);
              }

              // calculate tolerance used in fzero:
              let eps = 1E-6;
              let tol_act = 0.5 * eps * (Math.abs(x) + 1);

              if (derivative(x - tol_act) > 0 && derivative(x + tol_act) < 0) {
                foundFromDeriv = true;
                maximumAtPreviousRight = false;
                if (x >= minx - buffer && x <= maxx + buffer
                  && !((openMin && Math.abs(x - minx) < buffer) || (openMax && Math.abs(x - maxx) < buffer))
                  && !(addedAtPreviousRightViaDeriv && Math.abs(x - xleft) < buffer)
                ) {
                  maximaList.push([x, -f(x)]);
                  addedAtPreviousRightViaDeriv = Math.abs(x - xright) < buffer;
                } else {
                  addedAtPreviousRightViaDeriv = false;
                }
              }
            }

            if (!foundFromDeriv) {

              addedAtPreviousRightViaDeriv = false;

              let result = numerics.fminbr(f, [xleft, xright], undefined, 0.000001);
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
                  Number.isFinite(fx)
                ) {
                  maximaList.push([x, -fx]);
                }

              }
            }
          }

          return { setValue: { allMaxima: maximaList } }

        }
      }
    }

    stateVariableDefinitions.numberMaxima = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        allMaxima: {
          dependencyType: "stateVariable",
          variableName: "allMaxima"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { numberMaxima: dependencyValues.allMaxima.length },
          checkForActualChange: { numberMaxima: true }
        }
      }
    }

    stateVariableDefinitions.maxima = {
      stateVariablesDeterminingDependencies: ["isInterpolatedFunction"],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
        returnWrappingComponents(prefix) {
          if (prefix === "maximum" || prefix === undefined) {
            // maximum or entire array
            // These are points,
            // wrap inner dimension by both <point> and <xs>
            // don't wrap outer dimension (for entire array)
            return [["point", { componentType: "mathList", isAttribute: "xs" }]];
          } else {
            // don't wrap maximumLocation(s) or maximumValues(s)
            return [];
          }
        },
      },
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["maximum", "maximumLocations", "maximumLocation", "maximumValues", "maximumValue"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (["maximum", "maximumLocation", "maximumValue"].includes(arrayEntryPrefix)) {
          let pointInd = Number(varEnding) - 1;
          if (Number.isInteger(pointInd) && pointInd >= 0) {
            // If not given the array size,
            // then return the array keys assuming the array is large enough.
            // Must do this as it is used to determine potential array entries.
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
          if (varEnding !== "") {
            return [];
          }

          if (!arraySize) {
            // if don't have arraySize, just use first point assuming array size is large enough
            return ["0,0"]
          }

          // array of "i,0"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",0")
        } else if (arrayEntryPrefix === "maximumValues") {
          if (varEnding !== "") {
            return [];
          }

          if (!arraySize) {
            // if don't have arraySize, just use first point assuming array size is large enough
            return ["0,1"]
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
        numberMaxima: {
          dependencyType: "stateVariable",
          variableName: "numberMaxima",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numberMaxima, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allMaxima: {
            dependencyType: "stateVariable",
            variableName: "allMaxima"
          }
        }

        return { globalDependencies }

      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function maxima`)
        // console.log(globalDependencyValues)

        let maxima = {};

        for (let ptInd = 0; ptInd < globalDependencyValues.__array_size[0]; ptInd++) {
          for (let i = 0; i < 2; i++) {
            let arrayKey = `${ptInd},${i}`;

            maxima[arrayKey] = globalDependencyValues.allMaxima[ptInd][i];
          }
        }

        return { setValue: { maxima } }
      }
    }

    stateVariableDefinitions.numberExtrema = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        numberMinima: {
          dependencyType: "stateVariable",
          variableName: "numberMinima"
        },
        numberMaxima: {
          dependencyType: "stateVariable",
          variableName: "numberMaxima"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            numberExtrema: dependencyValues.numberMinima + dependencyValues.numberMaxima
          },
          checkForActualChange: { numberExtrema: true }
        }
      }
    }

    stateVariableDefinitions.allExtrema = {
      returnDependencies: () => ({
        allMinima: {
          dependencyType: "stateVariable",
          variableName: "allMinima"
        },
        allMaxima: {
          dependencyType: "stateVariable",
          variableName: "allMaxima"
        }
      }),
      definition({ dependencyValues }) {
        // console.log(`definition of allExtrema of function`)
        // console.log(dependencyValues)
        let allExtrema = [...dependencyValues.allMinima, ...dependencyValues.allMaxima]
          .sort((a, b) => a[0] - b[0]);

        return { setValue: { allExtrema } }

      }
    }

    stateVariableDefinitions.extrema = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
        returnWrappingComponents(prefix) {
          if (prefix === "extremum" || prefix === undefined) {
            // extremum or entire array
            // These are points,
            // wrap inner dimension by both <point> and <xs>
            // don't wrap outer dimension (for entire array)
            return [["point", { componentType: "mathList", isAttribute: "xs" }]];
          } else {
            // don't wrap extremumLocation(s) or extremumValues(s)
            return [];
          }
        },
      },
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["extremum", "extremumLocations", "extremumLocation", "extremumValues", "extremumValue"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (["extremum", "extremumLocation", "extremumValue"].includes(arrayEntryPrefix)) {
          let pointInd = Number(varEnding) - 1;
          if (Number.isInteger(pointInd) && pointInd >= 0) {
            // If not given the array size,
            // then return the array keys assuming the array is large enough.
            // Must do this as it is used to determine potential array entries.
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
          if (varEnding !== "") {
            return [];
          }

          if (!arraySize) {
            // if don't have arraySize, just use first point assuming array size is large enough
            return ["0,0"]
          }

          // array of "i,0"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",0")
        } else if (arrayEntryPrefix === "extremumValues") {
          if (varEnding !== "") {
            return [];
          }

          if (!arraySize) {
            // if don't have arraySize, just use first point assuming array size is large enough
            return ["0,1"]
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
        numberExtrema: {
          dependencyType: "stateVariable",
          variableName: "numberExtrema",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numberExtrema, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allExtrema: {
            dependencyType: "stateVariable",
            variableName: "allExtrema"
          }
        }

        return { globalDependencies }

      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function extrema`)
        // console.log(globalDependencyValues)

        let extrema = {};

        for (let ptInd = 0; ptInd < globalDependencyValues.__array_size[0]; ptInd++) {
          for (let i = 0; i < 2; i++) {
            let arrayKey = `${ptInd},${i}`;

            extrema[arrayKey] = globalDependencyValues.allExtrema[ptInd][i];
          }
        }

        return { setValue: { extrema } }

      }
    }


    stateVariableDefinitions.returnNumericalDerivatives = {
      stateVariablesDeterminingDependencies: ["isInterpolatedFunction"],
      returnDependencies({ stateValues }) {
        if (stateValues.isInterpolatedFunction) {
          return {
            xs: {
              dependencyType: "stateVariable",
              variableName: "xs"
            },
            coeffs: {
              dependencyType: "stateVariable",
              variableName: "coeffs"
            },
            // interpolationPoints: {
            //   dependencyType: "stateVariable",
            //   variableName: "interpolationPoints"
            // },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction"
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables"
            }
          }
        } else {
          return {
            functionChild: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["returnNumericalDerivatives", "variables"],
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction"
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables"
            }
          }
        }
      },
      definition: function ({ dependencyValues }) {

        if (dependencyValues.isInterpolatedFunction) {
          return {
            setValue: {
              returnNumericalDerivatives: returnReturnDerivativesOfInterpolatedFunction(dependencyValues)
            }
          }

        } else {

          if (dependencyValues.functionChild.length > 0 &&
            dependencyValues.functionChild[0].stateValues.returnNumericalDerivatives
          ) {

            // check if variables are the same
            let functionVariables = dependencyValues.variables.map(x => x.subscripts_to_strings().tree);
            let childVariables = dependencyValues.functionChild[0].stateValues.variables;
            let childVariablesTrans = childVariables.map(x => x.subscripts_to_strings().tree);

            let variableMapping = {};

            for (let [ind, variable] of functionVariables.entries()) {
              if (childVariablesTrans[ind] && childVariablesTrans[ind] !== variable) {
                variableMapping[variable] = childVariables[ind];
              }
            }


            if (Object.keys(variableMapping).length === 0) {
              return {
                setValue: { returnNumericalDerivatives: dependencyValues.functionChild[0].stateValues.returnNumericalDerivatives }
              }
            } else {
              let returnNumericalDerivatives = function (derivVariables) {
                let mappedDerivVariables = [];

                for (let dVar of derivVariables) {
                  let mapped = variableMapping[dVar.subscripts_to_strings().tree];
                  if (mapped) {
                    mappedDerivVariables.push(mapped)
                  } else {
                    // have a mapping, but 
                    mappedDerivVariables.push(me.fromAst('\uff3f'))
                  }
                }

                return dependencyValues.functionChild[0].stateValues.returnNumericalDerivatives(mappedDerivVariables)

              }


              return {
                setValue: { returnNumericalDerivatives }
              }
            }

          } else {
            return { setValue: { returnNumericalDerivatives: null } }
          }
        }
      }

    }

    stateVariableDefinitions.numericalDerivativesDefinition = {
      stateVariablesDeterminingDependencies: ["isInterpolatedFunction"],
      returnDependencies({ stateValues }) {
        if (stateValues.isInterpolatedFunction) {
          return {
            xs: {
              dependencyType: "stateVariable",
              variableName: "xs"
            },
            coeffs: {
              dependencyType: "stateVariable",
              variableName: "coeffs"
            },
            // interpolationPoints: {
            //   dependencyType: "stateVariable",
            //   variableName: "interpolationPoints"
            // },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction"
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables"
            }
          }
        } else {
          return {
            functionChild: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["numericalDerivativesDefinition", "variables"],
            },
            isInterpolatedFunction: {
              dependencyType: "stateVariable",
              variableName: "isInterpolatedFunction"
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables"
            }
          }
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
            }
          }

        } else {

          if (dependencyValues.functionChild.length > 0 &&
            dependencyValues.functionChild[0].stateValues.numericalDerivativesDefinition
          ) {

            // check if variables are the same
            let functionVariables = dependencyValues.variables.map(x => x.subscripts_to_strings().tree);
            let childVariables = dependencyValues.functionChild[0].stateValues.variables;
            let childVariablesTrans = childVariables.map(x => x.subscripts_to_strings().tree);

            let variableMapping = {};

            for (let [ind, variable] of functionVariables.entries()) {
              if (childVariablesTrans[ind] && childVariablesTrans[ind] !== variable) {
                variableMapping[variable] = childVariables[ind];
              }
            }


            if (Object.keys(variableMapping).length === 0) {
              return {
                setValue: { numericalDerivativesDefinition: dependencyValues.functionChild[0].stateValues.numericalDerivativesDefinition }
              }
            } else {

              let derivDef = { ...dependencyValues.functionChild[0].stateValues.numericalDerivativesDefinition };
              if (derivDef.variableMappings) {
                derivDef.variableMappings = [variableMapping, ...derivDef.variableMappings]
              } else {
                derivDef.variableMappings = [variableMapping];
              }

              return {
                setValue: { numericalDerivativesDefinition: derivDef }
              }

            }

          } else {
            return { setValue: { numericalDerivativesDefinition: {} } }
          }
        }
      }

    }

    return stateVariableDefinitions;

  }

  static adapters = [{
    stateVariable: "numericalf",
    componentType: "curve",
    stateVariablesToShadow: ["label", "labelHasLatex"]
  },
  {
    stateVariable: "formula",
    componentType: "math",
    stateVariablesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"]
  }];

}



function calculateInterpolationPoints({ dependencyValues, numerics }) {

  let pointsWithX = [];
  let pointsWithoutX = [];

  let allPoints = {
    maximum: dependencyValues.prescribedMaxima,
    minimum: dependencyValues.prescribedMinima,
    extremum: dependencyValues.prescribedExtrema,
    point: dependencyValues.prescribedPoints,
  }

  for (let type in allPoints) {
    for (let point of allPoints[type]) {
      let x = null, y = null, slope = null;
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
        })
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
      console.warn(`Two points with locations too close together.  Can't define function`);
      return { setValue: { interpolationPoints: null } }
    }
    xPrev = p.x;
  }

  let xscale = dependencyValues.xscale;
  let yscale = dependencyValues.yscale;

  xPrev = undefined;
  let yPrev, typePrev;
  let interpolationPoints = [];

  let pNext = pointsWithX[0]
  for (let ind = 0; ind < pointsWithX.length; ind++) {
    let p = pNext;
    pNext = pointsWithX[ind + 1];
    let newPoint = addPointWithX({
      p,
      pNext,
      typePrev,
      xPrev,
      yPrev
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
        comparison: 'atLeast',
        value: -Infinity
      })
    } else if (typePrev === "maximum") {
      findMatch = getPointWithoutX({
        allowedTypes: ["minimum", "extremum"],
        comparison: 'atMost',
        value: yPrev - yscale
      })
    } else if (typePrev === "minimum") {
      findMatch = getPointWithoutX({
        allowedTypes: ["maximum", "extremum"],
        comparison: 'atLeast',
        value: yPrev + yscale
      })
    } else if (typePrev === "point") {
      findMatch = getPointWithoutX({
        allowedTypes: ["maximum", "extremum"],
        comparison: 'atLeast',
        value: yPrev + yscale
      });
      if (findMatch.success !== true) {
        findMatch = getPointWithoutX({
          allowedTypes: ["minimum", "extremum"],
          comparison: 'atMost',
          value: yPrev - yscale
        })
      }
    }

    let p;
    if (findMatch.success === true) {
      p = findMatch.point;
      pointsWithoutX.splice(findMatch.ind, 1)
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
      yPrev
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
    })
  }

  firstPoint = interpolationPoints[0];
  if (firstPoint.type === "maximum") {
    // add point before maximum, xscale to left and yscale below
    // and set slope so ends with parabola
    let newPoint = {
      type: "point",
      x: firstPoint.x - xscale,
      y: firstPoint.y - yscale,
      slope: 2 * yscale / xscale,
    };
    interpolationPoints.splice(0, 0, newPoint);

  } else if (firstPoint.type === "minimum") {
    // add point before minimum, xscale to left and yscale above
    // and set slope so ends with parabola
    let newPoint = {
      type: "point",
      x: firstPoint.x - xscale,
      y: firstPoint.y + yscale,
      slope: -2 * yscale / xscale,
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
      let secantslope = (nextPoint.y - firstPoint.y) / (nextPoint.x - firstPoint.x);
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
              nextPoint: interpolationPoints[2]
            })
          }

          // if firstPoint slope is null
          // fit a quadratic from firstPoint to nextPoint
          // with slope matching that of nextPoint
          // Calculate resulting slope at firstPoint
          if (firstPoint.slope === null) {
            firstPoint.slope = 2 * (firstPoint.y - nextPoint.y) / (firstPoint.x - nextPoint.x)
              - nextPoint.slope
          }
        }

        // add another point in line with slope that extrapolates as a line
        let newPoint = {
          x: firstPoint.x - xscale,
          y: firstPoint.y - xscale * firstPoint.slope,
          slope: firstPoint.slope,
        }
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
      slope: -2 * yscale / xscale,
    };
    interpolationPoints.push(newPoint);

  } else if (lastPoint.type === "minimum") {
    // add point after minimum, xscale to right and yscale above
    // and set slope so ends with parabola
    let newPoint = {
      type: "point",
      x: lastPoint.x + xscale,
      y: lastPoint.y + yscale,
      slope: 2 * yscale / xscale,
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
      }
      interpolationPoints.push(newPoint);
    } else {
      let prevPoint = interpolationPoints[interpolationPoints.length - 2];
      let secantslope = (prevPoint.y - lastPoint.y) / (prevPoint.x - lastPoint.x);
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
              nextPoint: lastPoint
            })
          }
          // if lastPoint slope is null
          // fit a quadratic from prevPoint to lastPoint
          // with slope matching that of prevPoint
          // Calculate resulting slope at lastPoint
          if (lastPoint.slope === null) {
            lastPoint.slope = 2 * (prevPoint.y - lastPoint.y) / (prevPoint.x - lastPoint.x)
              - prevPoint.slope;
          }
        }

        // add another point in line with slope that extrapolates as a line
        let newPoint = {
          x: lastPoint.x + xscale,
          y: lastPoint.y + xscale * lastPoint.slope,
          slope: lastPoint.slope,
        }
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
        nextPoint: interpolationPoints[ind + 1]
      })
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

    let slope = (Math.sign(s1) + Math.sign(s2)) * Math.min(
      Math.abs(s1), Math.abs(s2), 0.5 * Math.abs(p1)
    );

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
    }
    else if (p.type === "minimum") {
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
    else if (p.type === "extremum") {
      let typeNext;  // used only if there isn't a point before

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
        } else if (typeNext !== undefined && p.y !== null && p.y > pNext.y - yscale) {
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
        } else if (typeNext !== undefined && p.y !== null && p.y > pNext.y + yscale) {
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
        }
        else if (p.y !== null && p.y <= yPrev - yscale) {
          treatAs = "minimum";
        } else if (typeNext !== undefined && p.y !== null && p.y >= pNext.y - yscale) {
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
        }
        else {
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
    }
    else if (p.type === "point") {
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
        }
        else if (pNext.type === "maximum") {
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
      let yNew, typeNew, slopeNew = null;
      // see if can find a min or extremum that didn't have x specified
      let results = getPointWithoutX({
        allowedTypes: ["minimum", "extremum"],
        comparison: 'atMost',
        value: yMin
      });
      if (results.success === true) {
        typeNew = "minimum"; // treat as minimum even if was extremum
        yNew = results.point.y;
        pointsWithoutX.splice(results.ind, 1);
        slopeNew = 0;
      }
      else {
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
      }
      else {
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
          let findTypes = [["maximum", "extremum"], ["minimum", "extremum"]];
          for (let newPointNum = 0; newPointNum < 2; newPointNum++) {
            let xNew = xs[newPointNum];
            let yNew, typeNew, slopeNew = null;
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
            }
            else {
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
      }
      else {
        // have maximum with y defined
        if (y < yPrev + yscale) {
          // need to add a point to the left at least as low as y-yscale
          let xNew = (x + xPrev) / 2;
          let yNew, typeNew, slopeNew = null;
          // see if can find a min or extremum that didn't have x specified
          let results = getPointWithoutX({
            allowedTypes: ["minimum", "extremum"],
            comparison: 'atMost',
            value: y - yscale
          });
          if (results.success === true) {
            typeNew = "minimum"; // treat as minimum even if was extremum
            yNew = results.point.y;
            pointsWithoutX.splice(results.ind, 1);
            slopeNew = 0;
          }
          else {
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
      }
      else {
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
          let findTypes = [["minimum", "extremum"], ["maximum", "extremum"]];
          for (let newPointNum = 0; newPointNum < 2; newPointNum++) {
            let xNew = xs[newPointNum];
            let yNew, typeNew, slopeNew = null;
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
            }
            else {
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
      let yNew, typeNew, slopeNew = null;
      // see if can find a min or extremum that didn't have x specified
      let results = getPointWithoutX({
        allowedTypes: ["maximum", "extremum"],
        comparison: 'atLeast',
        value: yMax
      });
      if (results.success === true) {
        typeNew = "maximum"; // treat as maximum even if was extremum
        yNew = results.point.y;
        pointsWithoutX.splice(results.ind, 1);
        slopeNew = 0;
      }
      else {
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
      }
      else {
        // have minimum with y defined
        if (y > yPrev - yscale) {
          // need to add a point to the left at least as high as y+yscale
          let xNew = (x + xPrev) / 2;
          let yNew, typeNew, slopeNew = null;
          // see if can find a max or extremum that didn't have x specified
          let results = getPointWithoutX({
            allowedTypes: ["maximum", "extremum"],
            comparison: 'atLeast',
            value: y + yscale
          });
          if (results.success === true) {
            typeNew = "maximum"; // treat as maximum even if was extremum
            yNew = results.point.y;
            pointsWithoutX.splice(results.ind, 1);
            slopeNew = 0;
          }
          else {
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
        let yNew, typeNew, slopeNew = null;
        // see if can find a min or extremum that didn't have x specified
        let results = getPointWithoutX({
          allowedTypes: ["minimum", "extremum"],
          comparison: 'atMost',
          value: yMin
        });
        if (results.success === true) {
          typeNew = "minimum"; // treat as minimum even if was extremum
          yNew = results.point.y;
          pointsWithoutX.splice(results.ind, 1);
          slopeNew = 0;
        }
        else {
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
        let yNew, typeNew, slopeNew = null;
        // see if can find a max or extremum that didn't have x specified
        let results = getPointWithoutX({
          allowedTypes: ["maximum", "extremum"],
          comparison: 'atLeast',
          value: yMax
        });
        if (results.success === true) {
          typeNew = "maximum"; // treat as maximum even if was extremum
          yNew = results.point.y;
          pointsWithoutX.splice(results.ind, 1);
          slopeNew = 0;
        }
        else {
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
      return { success: false }
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
              point: p
            }
          }
        } else {
          if (p.y >= value) {
            return {
              success: true,
              ind: ind,
              point: p
            }
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
      (-3 * x1 / s2 + 3 * x2 / s2 - 2 * t1 - t2) / s2,
      (2 * x1 / s2 - 2 * x2 / s2 + t1 + t2) / (s2 * s2)
    ];
  }

  let interpolationPoints = dependencyValues.interpolationPoints;


  if (interpolationPoints === null) {
    return {
      setValue: {
        xs: null, coeffs: null
      }
    }
  }

  let coeffs = [];
  let xs = [];

  let p0;
  let p1 = interpolationPoints[0];
  xs.push(p1.x);
  for (let ind = 1; ind < interpolationPoints.length; ind++) {
    p0 = p1;
    p1 = interpolationPoints[ind];
    let c = initCubicPoly(
      p0.y,
      p1.y,
      p0.slope,
      p1.slope,
      p1.x - p0.x
    );

    // if nearly have quadratic or linear, except for roundoff error,
    // make exactly quadratic or linear
    if (Math.abs(c[3]) < 1E-14 * Math.max(Math.abs(c[0]), Math.abs(c[1]), Math.abs(c[2]))) {
      c[3] = 0;
      if (Math.abs(c[2]) < 1E-14 * Math.max(Math.abs(c[0]), Math.abs(c[1]))) {
        c[2] = 0;
      }
    }
    coeffs.push(c);

    xs.push(p1.x);


  }

  return {
    setValue: {
      xs, coeffs
    }
  }

}
