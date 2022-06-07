import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';
import { getFromText, getFromLatex, convertValueToMathExpression, normalizeMathExpression, roundForDisplay, mergeListsWithOtherContainers, preprocessMathInverseDefinition } from '../utils/math';
import { flattenDeep } from '../utils/array';


export default class MathComponent extends InlineComponent {
  static componentType = "math";

  // used when creating new component via adapter or copy prop
  static primaryStateVariableForDefinition = "value";

  static variableForPlainMacro = "value";

  static descendantCompositesMustHaveAReplacement = true;
  static descendantCompositesDefaultReplacementType = "math";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.format = {
      createComponentOfType: "text",
      createStateVariable: "format",
      defaultValue: "text",
      public: true,
      toLowerCase: true,
      validValues: ["text", "latex"]
    };
    // let simplify="" or simplify="true" be full simplify
    attributes.simplify = {
      createComponentOfType: "text",
      createStateVariable: "simplify",
      defaultValue: "none",
      public: true,
      toLowerCase: true,
      valueTransformations: { "true": "full" },
      validValues: ["none", "full", "numbers", "numberspreserveorder"]
    };
    attributes.expand = {
      createComponentOfType: "boolean",
      createStateVariable: "expand",
      defaultValue: false,
      public: true,
    };

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
    attributes.renderMode = {
      createComponentOfType: "text",
      createStateVariable: "renderMode",
      defaultValue: "inline",
      public: true,
      forRenderer: true,
    };
    attributes.unordered = {
      createComponentOfType: "boolean",
    };
    attributes.createVectors = {
      createComponentOfType: "boolean",
      createStateVariable: "createVectors",
      defaultValue: false,
      public: true,
    };
    attributes.createIntervals = {
      createComponentOfType: "boolean",
      createStateVariable: "createIntervals",
      defaultValue: false,
      public: true,
    };

    attributes.functionSymbols = {
      createComponentOfType: "textList",
      createStateVariable: "functionSymbols",
      defaultValue: ["f", "g"],
      public: true,
    }

    attributes.targetsAreFunctionSymbols = {
      createComponentOfType: "textList",
      createStateVariable: "targetsAreFunctionSymbols",
      defaultValue: [],
    }

    attributes.splitSymbols = {
      createComponentOfType: "boolean",
      createStateVariable: "splitSymbols",
      defaultValue: true,
      public: true,
    }

    attributes.groupCompositeReplacements = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "groupCompositeReplacements",
      defaultValue: true,
    }

    return attributes;
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

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.displayDigits = {
      public: true,
      componentType: "integer",
      hasEssential: true,
      defaultValue: 10,
      returnDependencies: () => ({
        mathListParentDisplayDigits: {
          dependencyType: "parentStateVariable",
          parentComponentType: "mathList",
          variableName: "displayDigits"
        },
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
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["displayDigits"]
        }
      }),
      definition({ dependencyValues, usedDefault }) {
        if(dependencyValues.mathListParentDisplayDigits !== null && !usedDefault.mathListParentDisplayDigits) {
          // having a mathlist parent that prescribed displayDigits.
          // this overrides everything else
          return {
            setValue: {
              displayDigits: dependencyValues.mathListParentDisplayDigits
            }
          }
        } else if (dependencyValues.displayDigitsAttr !== null) {
          return {
            setValue: {
              displayDigits: dependencyValues.displayDigitsAttr.stateValues.value
            }
          }
        } else if (dependencyValues.displayDecimalsAttr === null
          && dependencyValues.mathChildren.length === 1
          && !(usedDefault.mathChildren[0] && usedDefault.mathChildren[0].displayDigits)
        ) {
          // have to check to exclude case where have displayDecimals attribute
          // because otherwise a non-default displayDigits will win over displayDecimals
          return {
            setValue: {
              displayDigits: dependencyValues.mathChildren[0].stateValues.displayDigits
            }
          };
        } else {
          return { useEssentialOrDefaultValue: { displayDigits: true } }
        }

      }
    }

    stateVariableDefinitions.displayDecimals = {
      public: true,
      componentType: "integer",
      hasEssential: true,
      defaultValue: null,
      returnDependencies: () => ({
        mathListParentDisplayDecimals: {
          dependencyType: "parentStateVariable",
          parentComponentType: "mathList",
          variableName: "displayDecimals"
        },
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        },
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["displayDecimals"]
        }
      }),
      definition({ dependencyValues, usedDefault }) {
        if(dependencyValues.mathListParentDisplayDecimals !== null && !usedDefault.mathListParentDisplayDecimals) {
          // having a mathlist parent that prescribed displayDecimals.
          // this overrides everything else
          return {
            setValue: {
              displayDecimals: dependencyValues.mathListParentDisplayDecimals
            }
          }
        } else if (dependencyValues.displayDecimalsAttr !== null) {
          return {
            setValue: {
              displayDecimals: dependencyValues.displayDecimalsAttr.stateValues.value
            }
          }
        } else if (dependencyValues.mathChildren.length === 1
          && !(usedDefault.mathChildren[0] && usedDefault.mathChildren[0].displayDecimals)
        ) {
          return {
            setValue: {
              displayDecimals: dependencyValues.mathChildren[0].stateValues.displayDecimals
            }
          };
        } else {
          return { useEssentialOrDefaultValue: { displayDecimals: true } }
        }

      }
    }

    stateVariableDefinitions.displaySmallAsZero = {
      public: true,
      componentType: "number",
      hasEssential: true,
      defaultValue: 0,
      returnDependencies: () => ({
        mathListParentDisplaySmallAsZero: {
          dependencyType: "parentStateVariable",
          parentComponentType: "mathList",
          variableName: "displaySmallAsZero"
        },
        displaySmallAsZeroAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displaySmallAsZero",
          variableNames: ["value"]
        },
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["displaySmallAsZero"]
        }
      }),
      definition({ dependencyValues, usedDefault }) {
        if(dependencyValues.mathListParentDisplaySmallAsZero !== null && !usedDefault.mathListParentDisplaySmallAsZero) {
          // having a mathlist parent that prescribed displaySmallAsZero.
          // this overrides everything else
          return {
            setValue: {
              displaySmallAsZero: dependencyValues.mathListParentDisplaySmallAsZero
            }
          }
        } else if (dependencyValues.displaySmallAsZeroAttr !== null) {
          return {
            setValue: {
              displaySmallAsZero: dependencyValues.displaySmallAsZeroAttr.stateValues.value
            }
          }
        } else if (dependencyValues.mathChildren.length === 1
          && !(usedDefault.mathChildren[0] && usedDefault.mathChildren[0].displaySmallAsZero)
        ) {
          return {
            setValue: {
              displaySmallAsZero: dependencyValues.mathChildren[0].stateValues.displaySmallAsZero
            }
          };
        } else {
          return { useEssentialOrDefaultValue: { displaySmallAsZero: true } }
        }

      }
    }

    stateVariableDefinitions.padZeros = {
      public: true,
      componentType: "boolean",
      hasEssential: true,
      defaultValue: false,
      returnDependencies: () => ({
        mathListParentPadZeros: {
          dependencyType: "parentStateVariable",
          parentComponentType: "mathList",
          variableName: "padZeros"
        },
        padZerosAttr: {
          dependencyType: "attributeComponent",
          attributeName: "padZeros",
          variableNames: ["value"]
        },
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        },
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["padZeros"]
        }
      }),
      definition({ dependencyValues, usedDefault }) {
        if(dependencyValues.mathListParentPadZeros !== null && !usedDefault.mathListParentPadZeros) {
          // having a mathlist parent that prescribed padZeros.
          // this overrides everything else
          return {
            setValue: {
              padZeros: dependencyValues.mathListParentPadZeros
            }
          }
        } else if (dependencyValues.padZerosAttr !== null) {
          return {
            setValue: {
              padZeros: dependencyValues.padZerosAttr.stateValues.value
            }
          }
        } else if (dependencyValues.mathChildren.length === 1
          && !(usedDefault.mathChildren[0] && usedDefault.mathChildren[0].padZeros)
        ) {
          return {
            setValue: {
              padZeros: dependencyValues.mathChildren[0].stateValues.padZeros
            }
          };
        } else {
          return { useEssentialOrDefaultValue: { padZeros: true } }
        }

      }
    }

    // valueShadow will be long underscore unless math was created
    // from serialized state with value
    stateVariableDefinitions.valueShadow = {
      defaultValue: me.fromAst('\uff3f'),  // long underscore
      hasEssential: true,
      essentialVarName: "value",
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          valueShadow: true
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "valueShadow",
            value: desiredStateVariableValues.valueShadow
          }]
        };
      }
    }

    stateVariableDefinitions.unordered = {
      defaultValue: false,
      public: true,
      componentType: "boolean",
      hasEssential: true,
      returnDependencies: () => ({
        unorderedAttr: {
          dependencyType: "attributeComponent",
          attributeName: "unordered",
          variableNames: ["value"]
        },
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["unordered"]
        }
      }),
      definition({ dependencyValues }) {

        if (dependencyValues.unorderedAttr === null) {
          if (dependencyValues.mathChildren.length > 0) {
            let unordered = dependencyValues.mathChildren.every(x => x.stateValues.unordered);
            return { setValue: { unordered } }
          } else {
            return {
              useEssentialOrDefaultValue: {
                unordered: true
              }
            }
          }
        } else {
          return {
            setValue: { unordered: dependencyValues.unorderedAttr.stateValues.value }
          }
        }
      }
    }

    stateVariableDefinitions.codePre = {
      // deferCalculation: false,
      returnDependencies: () => ({
        stringChildren: {
          dependencyType: "child",
          childGroups: ["strings"],
        },
      }),
      definition({ dependencyValues }) {

        let codePre = "math";

        // make sure that codePre is not in any string piece
        let foundInString = false;
        do {
          foundInString = false;

          for (let child of dependencyValues.stringChildren) {
            if (child.includes(codePre) === true) {
              // found codePre in a string, so extend codePre and try again
              foundInString = true;
              codePre += "m";
              break;
            }
          }
        } while (foundInString);

        return { setValue: { codePre } };
      }

    }

    stateVariableDefinitions.mathChildrenFunctionSymbols = {
      returnDependencies: () => ({
        targetsAreFunctionSymbols: {
          dependencyType: "stateVariable",
          variableName: "targetsAreFunctionSymbols"
        },
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
        }
      }),
      definition({ dependencyValues }) {
        let mathChildrenFunctionSymbols = [];
        if (dependencyValues.mathChildren.compositeReplacementRange) {
          for (let compositeInfo of dependencyValues.mathChildren.compositeReplacementRange) {
            if (dependencyValues.targetsAreFunctionSymbols.includes(compositeInfo.target)) {
              for (let ind = compositeInfo.firstInd; ind <= compositeInfo.lastInd; ind++) {
                mathChildrenFunctionSymbols.push(ind)
              }
            }
          }
        }

        return { setValue: { mathChildrenFunctionSymbols } }
      }
    }

    stateVariableDefinitions.expressionWithCodes = {
      hasEssential: true,
      doNotShadowEssential: true,
      returnDependencies: () => ({
        stringMathChildren: {
          dependencyType: "child",
          childGroups: ["strings", "maths"],
        },
        // have stringChildren and mathChildren just for inverse definition
        stringChildren: {
          dependencyType: "child",
          childGroups: ["strings"],
        },
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
        },
        format: {
          dependencyType: "stateVariable",
          variableName: "format",
        },
        codePre: {
          dependencyType: "stateVariable",
          variableName: "codePre"
        },
        functionSymbols: {
          dependencyType: "stateVariable",
          variableName: "functionSymbols"
        },
        mathChildrenFunctionSymbols: {
          dependencyType: "stateVariable",
          variableName: "mathChildrenFunctionSymbols"
        },
        splitSymbols: {
          dependencyType: "stateVariable",
          variableName: "splitSymbols"
        },
        groupCompositeReplacements: {
          dependencyType: "stateVariable",
          variableName: "groupCompositeReplacements"
        },
      }),
      set: x => x === null ? null : convertValueToMathExpression(x),
      definition: calculateExpressionWithCodes,
      async inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues, componentName }) {

        let newExpressionWithCodes = desiredStateVariableValues.expressionWithCodes;

        let instructions = [{
          setEssentialValue: "expressionWithCodes",
          value: newExpressionWithCodes
        }];


        let nStringChildren = dependencyValues.stringChildren.length;

        if (nStringChildren === 0) {
          // don't use expressionWithCodes if no children
          // and expressionWithCodes will not change if no string children
          return { success: false };
        }


        if (dependencyValues.mathChildren.length === 0) {

          // just string children.  Set first to value, the rest to empty strings
          let stringValue;
          if (await stateValues.format === "latex") {
            stringValue = newExpressionWithCodes.toLatex()
          } else {
            stringValue = newExpressionWithCodes.toString()
          }

          instructions.push({
            setDependency: "stringChildren",
            desiredValue: stringValue,
            childIndex: 0,
            variableIndex: 0,
            ignoreChildChangeForComponent: true,
          });

          for (let ind = 1; ind < nStringChildren; ind++) {
            instructions.push({
              setDependency: "stringChildren",
              desiredValue: "",
              childIndex: ind,
              variableIndex: 0,
              ignoreChildChangeForComponent: true,
            })
          }


        } else {

          // have math children

          let stringExpr;
          if (await stateValues.format === "latex") {
            stringExpr = newExpressionWithCodes.toLatex();
          } else {
            stringExpr = newExpressionWithCodes.toString();
          }

          for (let [ind, stringCodes] of (await stateValues.codesAdjacentToStrings).entries()) {
            let thisString = stringExpr;
            if (Object.keys(stringCodes).length === 0) {
              // string was skipped, so set it to an empty string
              instructions.push({
                setDependency: "stringChildren",
                desiredValue: "",
                childIndex: ind,
                variableIndex: 0,
                ignoreChildChangeForComponent: true,
              });

            } else {
              if (stringCodes.prevCode) {
                thisString = thisString.split(stringCodes.prevCode)[1];
              }
              if (stringCodes.nextCode) {
                thisString = thisString.split(stringCodes.nextCode)[0];
              }
              instructions.push({
                setDependency: "stringChildren",
                desiredValue: thisString,
                childIndex: ind,
                variableIndex: 0,
                ignoreChildChangeForComponent: true,
              });
            }
          }

        }

        return {
          success: true,
          instructions
        }

      }

    }

    stateVariableDefinitions.mathChildrenWithCanBeModified = {
      returnDependencies: () => ({
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value", "canBeModified"],
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { mathChildrenWithCanBeModified: dependencyValues.mathChildren }
      })
    }

    stateVariableDefinitions.unnormalizedValue = {
      returnDependencies: () => ({
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value"],
        },
        stringChildren: {
          dependencyType: "child",
          childGroups: ["strings"],
          variableNames: ["value"],
        },
        expressionWithCodes: {
          dependencyType: "stateVariable",
          variableName: "expressionWithCodes",
        },
        codePre: {
          dependencyType: "stateVariable",
          variableName: "codePre"
        },
        valueShadow: {
          dependencyType: "stateVariable",
          variableName: "valueShadow"
        },
      }),
      set: convertValueToMathExpression,
      defaultValue: me.fromAst('\uff3f'),  // long underscore
      definition: calculateMathValue,
      inverseDefinition: invertMath,
    }

    stateVariableDefinitions.value = {
      public: true,
      componentType: this.componentType,
      additionalAttributeComponentsToShadow: ["unordered", "displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
      stateVariablesPrescribingAdditionalAttributes: {
        fixed: "fixed",
        simplify: "simplify",
        expand: "expand",
      },
      returnDependencies: () => ({
        unnormalizedValue: {
          dependencyType: "stateVariable",
          variableName: "unnormalizedValue",
        },
        simplify: {
          dependencyType: "stateVariable",
          variableName: "simplify"
        },
        expand: {
          dependencyType: "stateVariable",
          variableName: "expand"
        },
        createVectors: {
          dependencyType: "stateVariable",
          variableName: "createVectors"
        },
        createIntervals: {
          dependencyType: "stateVariable",
          variableName: "createIntervals"
        },
      }),
      definition: function ({ dependencyValues }) {

        let value = dependencyValues.unnormalizedValue;

        let { simplify, expand, createVectors, createIntervals } = dependencyValues;

        value = normalizeMathExpression({
          value, simplify, expand, createVectors, createIntervals
        });

        return { setValue: { value } }

      },
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setDependency: "unnormalizedValue",
            desiredValue: desiredStateVariableValues.value,
          }]
        }

      }
    }


    stateVariableDefinitions.number = {
      public: true,
      componentType: "number",
      additionalAttributeComponentsToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        },
      }),
      definition: function ({ dependencyValues }) {
        let number = dependencyValues.value.evaluate_to_constant();
        if (number === null) {
          number = NaN;
        }
        return { setValue: { number } };
      },
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setDependency: "value",
            desiredValue: me.fromAst(desiredStateVariableValues.number),
          }]
        }
      }
    }

    // isNumber is true if the value of the math is an actual number
    stateVariableDefinitions.isNumber = {
      public: true,
      componentType: "boolean",
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            isNumber: Number.isFinite(dependencyValues.value.tree)
          }
        }
      },
    }

    // isNumeric is weaker than isNumber
    // isNumeric is true if the value can be evaluated as a number,
    // i.e., if the number state variable is a number
    stateVariableDefinitions.isNumeric = {
      public: true,
      componentType: "boolean",
      returnDependencies: () => ({
        number: {
          dependencyType: "stateVariable",
          variableName: "number"
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            isNumeric: Number.isFinite(dependencyValues.number)
          }
        }
      },
    }

    stateVariableDefinitions.valueForDisplay = {
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
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
        simplify: {
          dependencyType: "stateVariable",
          variableName: "simplify"
        },
        expand: {
          dependencyType: "stateVariable",
          variableName: "expand"
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {
        // for display via latex and text, round any decimal numbers to the significant digits
        // determined by displaydigits, displaydecimals, and/or displaySmallAsZero
        let rounded = roundForDisplay({
          value: dependencyValues.value,
          dependencyValues, usedDefault
        });

        return {
          setValue: {
            valueForDisplay: normalizeMathExpression({
              value: rounded, simplify: dependencyValues.simplify, expand: dependencyValues.expand
            })
          }
        }
      }
    }


    stateVariableDefinitions.latex = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        valueForDisplay: {
          dependencyType: "stateVariable",
          variableName: "valueForDisplay"
        },
        padZeros: {
          dependencyType: "stateVariable",
          variableName: "padZeros"
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits"
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals"
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {
        let latex;
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
        try {
          latex = dependencyValues.valueForDisplay.toLatex(params);
        } catch (e) {
          latex = '\uff3f';
        }
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


    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        valueForDisplay: {
          dependencyType: "stateVariable",
          variableName: "valueForDisplay"
        },
        padZeros: {
          dependencyType: "stateVariable",
          variableName: "padZeros"
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits"
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals"
        },
        // value is just for inverse definition
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {
        let text;
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
        try {
          text = dependencyValues.valueForDisplay.toString(params);
        } catch (e) {
          text = '\uff3f';
        }
        return { setValue: { text } };
      },
      async inverseDefinition({ desiredStateVariableValues, stateValues }) {
        let fromText = getFromText({
          functionSymbols: await stateValues.functionSymbols,
          splitSymbols: await stateValues.splitSymbols
        });

        let expr;
        try {
          expr = fromText(desiredStateVariableValues.text);
        } catch (e) {
          return { success: false }
        }

        return {
          success: true,
          instructions: [{
            setDependency: "value",
            desiredValue: expr
          }]
        }
      }
    }


    stateVariableDefinitions.codesAdjacentToStrings = {
      returnDependencies: () => ({
        stringMathChildren: {
          dependencyType: "child",
          childGroups: ["strings", "maths"],
        },
        codePre: {
          dependencyType: "stateVariable",
          variableName: "codePre",
        },
        format: {
          dependencyType: "stateVariable",
          variableName: "format",
        },
      }),
      definition: calculateCodesAdjacentToStrings,
    }

    stateVariableDefinitions.canBeModified = {
      additionalStateVariablesDefined: [
        "constantChildIndices", "codeForExpression", "inverseMaps",
        "template", "mathChildrenMapped"
      ],
      returnDependencies: () => ({
        mathChildrenModifiable: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["canBeModified"],
        },
        expressionWithCodes: {
          dependencyType: "stateVariable",
          variableName: "expressionWithCodes",
        },
        modifyIndirectly: {
          dependencyType: "stateVariable",
          variableName: "modifyIndirectly",
        },
        fixed: {
          dependencyType: "stateVariable",
          variableName: "fixed",
        },
        codePre: {
          dependencyType: "stateVariable",
          variableName: "codePre",
        },
      }),
      definition: determineCanBeModified,
    }

    stateVariableDefinitions.mathChildrenByVectorComponent = {
      returnDependencies: () => ({
        codePre: {
          dependencyType: "stateVariable",
          variableName: "codePre",
        },
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
        },
        expressionWithCodes: {
          dependencyType: "stateVariable",
          variableName: "expressionWithCodes",
        },
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.expressionWithCodes === null) {
          return { setValue: { mathChildrenByVectorComponent: null } };
        }
        let expressionWithCodesTree = dependencyValues.expressionWithCodes.tree;
        let nMathChildren = dependencyValues.mathChildren.length;

        if (nMathChildren === 0 ||
          !Array.isArray(expressionWithCodesTree) ||
          !["tuple", "vector"].includes(expressionWithCodesTree[0])
        ) {
          return { setValue: { mathChildrenByVectorComponent: null } };
        }

        let mathChildrenByVectorComponent = {};

        let childInd = 0;
        let childCode = dependencyValues.codePre + childInd;

        for (let ind = 1; ind < expressionWithCodesTree.length; ind++) {
          let exprComp = expressionWithCodesTree[ind];
          let mc = mathChildrenByVectorComponent[ind] = [];

          if (Array.isArray(exprComp)) {
            let flattenedComp = flattenDeep(exprComp);
            while (flattenedComp.includes(childCode)) {
              mc.push(childInd);
              childInd++;
              childCode = dependencyValues.codePre + childInd;
            }
          } else {
            if (exprComp === childCode) {
              mc.push(childInd);
              childInd++;
              childCode = dependencyValues.codePre + childInd;
            }
          }

          if (childInd >= nMathChildren) {
            break;
          }
        }

        return { setValue: { mathChildrenByVectorComponent } };

      }
    }

    stateVariableDefinitions.nDimensions = {
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        }
      }),
      definition({ dependencyValues }) {
        let nDimensions = 1;

        let tree = dependencyValues.value.tree;

        if (Array.isArray(tree) && ["vector", "tuple", "list"].includes(tree[0])) {
          nDimensions = tree.length - 1;
        }

        return { setValue: { nDimensions } }

      }
    }


    stateVariableDefinitions.xs = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["x"],
      additionalAttributeComponentsToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
      returnArraySizeDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          value: {
            dependencyType: "stateVariable",
            variableName: "value"
          }
        };
        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues, arrayKeys, arraySize }) {


        let tree = globalDependencyValues.value.tree;

        let haveVector = Array.isArray(tree) && ["vector", "tuple", "list"].includes(tree[0])

        let xs = {};
        if (haveVector) {
          for (let ind = 0; ind < arraySize[0]; ind++) {
            xs[ind] = me.fromAst(tree[ind + 1]);
          }
        } else {
          xs[0] = globalDependencyValues.value;
        }

        return { setValue: { xs } }
      },
      async inverseArrayDefinitionByKey({ desiredStateVariableValues,
        stateValues, workspace, arraySize
      }) {


        // in case just one ind specified, merge with previous values
        if (!workspace.desiredXs) {
          workspace.desiredXs = [];
        }
        for (let ind = 0; ind < arraySize[0]; ind++) {
          if (desiredStateVariableValues.xs[ind] !== undefined) {
            workspace.desiredXs[ind] = convertValueToMathExpression(desiredStateVariableValues.xs[ind]);
          } else if (workspace.desiredXs[ind] === undefined) {
            workspace.desiredXs[ind] = (await stateValues.xs)[ind];
          }
        }


        let desiredValue;
        if (arraySize[0] > 1) {
          let operator = (await stateValues.value).tree[0]
          desiredValue = me.fromAst([operator, ...workspace.desiredXs.map(x => x.tree)])
        } else {
          desiredValue = workspace.desiredXs[0];
        }

        let instructions = [{
          setDependency: "value",
          desiredValue
        }];

        return {
          success: true,
          instructions
        }

      },
    }

    stateVariableDefinitions.x = {
      isAlias: true,
      targetVariableName: "x1"
    };

    stateVariableDefinitions.y = {
      isAlias: true,
      targetVariableName: "x2"
    };

    stateVariableDefinitions.z = {
      isAlias: true,
      targetVariableName: "x3"
    };


    return stateVariableDefinitions;

  }


  static adapters = [
    {
      stateVariable: "number",
      stateVariablesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"]
    },
    "text",
    { componentType: "subsetOfReals", stateVariable: "value", substituteForPrimaryStateVariable: "subsetValue" }
  ];

}


function calculateExpressionWithCodes({ dependencyValues, changes }) {

  if (!(("stringMathChildren" in changes && changes.stringMathChildren.componentIdentitiesChanged)
    || "format" in changes || "splitSymbols" in changes
    || "functionSymbols" in changes || "mathChildrenFunctionSymbols" in changes
  )) {
    // if component identities of stringMathChildren didn't change
    // and format didn't change
    // then expressionWithCodes remains unchanged.
    // (We assume that the value of string children cannot change on their own.)
    return { useEssentialOrDefaultValue: { expressionWithCodes: true } }
    // return { noChanges: ["expressionWithCodes"] };
  }

  // if don't have any string or math children,
  // set expressionWithCodes to be null,
  // which will indicate that value should use valueShadow
  if (dependencyValues.stringMathChildren.length === 0) {
    return { setValue: { expressionWithCodes: null } }
  }

  let inputString = "";
  let mathInd = 0;
  let compositeGroupString = "";

  let compositeReplacementRange = dependencyValues.stringMathChildren.compositeReplacementRange;
  let currentCompositeInd = undefined;
  let currentCompositeLastChildInd = undefined;
  let nextCompositeInd = undefined;
  let nextCompositeChildInd = undefined;
  if (dependencyValues.groupCompositeReplacements && compositeReplacementRange.length > 0) {
    nextCompositeInd = 0;
    nextCompositeChildInd = compositeReplacementRange[nextCompositeInd].firstInd;
  }


  for (let [childInd, child] of dependencyValues.stringMathChildren.entries()) {


    if (currentCompositeInd === undefined && childInd === nextCompositeChildInd) {
      // we are grouping composite replacements
      // and we found the beginning of children that are composite replacements

      currentCompositeInd = nextCompositeInd;
      currentCompositeLastChildInd = compositeReplacementRange[nextCompositeInd].lastInd;
      compositeGroupString = "";

      // if composite has only one replacement or has a string replacement,
      // then we don't group

      let dontGroup = currentCompositeLastChildInd === childInd;
      if (!dontGroup) {
        for (let ind = childInd; ind <= currentCompositeLastChildInd; ind++) {
          if (typeof dependencyValues.stringMathChildren[ind] === "string") {
            dontGroup = true;
            break;
          }
        }
      }

      if (dontGroup) {
        if (compositeReplacementRange.length > currentCompositeInd + 1) {
          nextCompositeInd = currentCompositeInd + 1;
          nextCompositeChildInd = compositeReplacementRange[nextCompositeInd].firstInd;
        } else {
          nextCompositeInd = undefined;
          nextCompositeChildInd = undefined;
        }
        currentCompositeInd = undefined;
        currentCompositeLastChildInd = undefined;
      }

    }

    if (typeof child === "string") {
      inputString += " " + child + " ";
    } else { // a math
      let code = dependencyValues.codePre + mathInd;
      mathInd++;

      let nextString;
      if (dependencyValues.format === 'latex') {
        // for latex, must explicitly denote that code
        // is a multicharacter variable
        nextString = '\\var{' + code + '}';
      }
      else {
        // for text, just make sure code is surrounded by spaces
        // (the presence of numbers inside code will ensure that
        // it is parsed as a multicharcter variable)
        nextString = " " + code + " ";
      }

      if (currentCompositeInd !== undefined) {
        if (compositeGroupString) {
          // continuing a composite group
          compositeGroupString += ",";
        }
        compositeGroupString += nextString;
      } else {
        inputString += nextString;
      }


    }

    if (childInd === currentCompositeLastChildInd) {
      // compositeGroupString contains components separated by commas
      // will wrap in parenthesis unless already contains
      // delimeters before and after
      // TODO: \rangle and \langle?
      let iString = inputString.trimEnd();
      let wrap = false;
      if (iString.length === 0) {
        wrap = true;
      } else {
        let lastChar = iString[iString.length - 1];
        if (!["{", "[", "(", "|", ","].includes(lastChar)) {
          wrap = true;
        } else {
          let nextChild = dependencyValues.stringMathChildren[childInd + 1]
          if (typeof nextChild !== "string") {
            wrap = true;
          } else {
            let nextString = nextChild.trimStart();
            if (nextString.length === 0) {
              wrap = true;
            } else {
              let nextChar = nextString[0];
              if (dependencyValues.format === 'latex' && nextChar === "\\"
                && nextString.length > 1
              ) {
                nextChar = nextString[1];
              }
              if (!["}", "]", ")", "|", ","].includes(nextChar)) {
                wrap = true;
              }
            }
          }
        }
      }

      if (wrap) {
        compositeGroupString = "(" + compositeGroupString + ")";
      }

      inputString += compositeGroupString;
      compositeGroupString = "";

      if (compositeReplacementRange.length > currentCompositeInd + 1) {
        nextCompositeInd = currentCompositeInd + 1;
        nextCompositeChildInd = compositeReplacementRange[nextCompositeInd].firstInd;
      } else {
        nextCompositeInd = undefined;
        nextCompositeChildInd = undefined;
      }
      currentCompositeInd = undefined;
      currentCompositeLastChildInd = undefined;


    }

  }


  let expressionWithCodes = null;

  let functionSymbols = [...dependencyValues.functionSymbols];
  functionSymbols.push(...dependencyValues.mathChildrenFunctionSymbols.map(x => dependencyValues.codePre + x))

  if (inputString === "") {
    expressionWithCodes = me.fromAst('\uFF3F'); // long underscore
  } else {
    if (dependencyValues.format === "text") {
      let fromText = getFromText({
        functionSymbols,
        splitSymbols: dependencyValues.splitSymbols
      });
      try {
        expressionWithCodes = fromText(inputString);
      } catch (e) {
        expressionWithCodes = me.fromAst('\uFF3F');  // long underscore
        console.log("Invalid value for a math of text format: " + inputString);
      }
    }
    else if (dependencyValues.format === "latex") {
      let fromLatex = getFromLatex({
        functionSymbols,
        splitSymbols: dependencyValues.splitSymbols
      });
      try {
        expressionWithCodes = fromLatex(inputString);
      } catch (e) {
        expressionWithCodes = me.fromAst('\uFF3F');  // long underscore
        console.log("Invalid value for a math of latex format: " + inputString);
      }
    }
  }

  return {
    setValue: { expressionWithCodes },
    setEssentialValue: { expressionWithCodes }
  };

}

function calculateMathValue({ dependencyValues } = {}) {

  // if expressionWithCodes is null, there were no string or math children
  if (dependencyValues.expressionWithCodes === null) {
    return {
      setValue: { unnormalizedValue: dependencyValues.valueShadow },
    }
  }

  let subsMapping = {};
  for (let [ind, child] of dependencyValues.mathChildren.entries()) {
    subsMapping[dependencyValues.codePre + ind] = child.stateValues.value;
  }

  let value = dependencyValues.expressionWithCodes;
  if (dependencyValues.mathChildren.length > 0) {
    value = value.substitute(subsMapping);
  }

  value = me.fromAst(mergeListsWithOtherContainers(value.tree))


  return {
    setValue: { unnormalizedValue: value },
  };
}

function calculateCodesAdjacentToStrings({ dependencyValues }) {

  // create codesAdjacentToStrings object that gives substitution codes
  // that are just before and after each string child
  let codesAdjacentToStrings = [];
  let mathInd;
  for (let [ind, child] of dependencyValues.stringMathChildren.entries()) {
    if (typeof child === "string") {
      let nextChild = dependencyValues.stringMathChildren[ind + 1];
      if (nextChild !== undefined && typeof nextChild === "string") {
        // if following child is also a string, we'll skip the first string
        // which means, when inverting, the first string will just be set to blank
        continue;
      }

      let subCodes = {};
      if (mathInd !== undefined) {
        if (dependencyValues.format === "latex") {
          subCodes.prevCode = '\\var{' + dependencyValues.codePre + mathInd + '}';
        } else {
          subCodes.prevCode = dependencyValues.codePre + mathInd;
        }
      }

      if (nextChild !== undefined) {
        // next child is a math
        let nextInd = 0;
        if (mathInd !== undefined) {
          nextInd = mathInd + 1;
        }

        if (dependencyValues.format === "latex") {
          subCodes.nextCode = '\\var{' + dependencyValues.codePre + nextInd + '}';
        } else {
          subCodes.nextCode = dependencyValues.codePre + nextInd;
        }
      }

      codesAdjacentToStrings.push(subCodes);

    } else {
      // have a mathChild, so increment mathInd
      if (mathInd === undefined) {
        mathInd = 0;
      } else {
        mathInd++;
      }
    }
  }

  return { setValue: { codesAdjacentToStrings } };
}

function determineCanBeModified({ dependencyValues }) {

  if (!dependencyValues.modifyIndirectly || dependencyValues.fixed) {
    return {
      setValue: {
        canBeModified: false,
        constantChildIndices: null,
        codeForExpression: null,
        inverseMaps: null,
        template: null,
        mathChildrenMapped: null,
      }
    };
  }

  // if have no math children, then can directly set value
  // to any specified expression
  if (dependencyValues.mathChildrenModifiable.length === 0) {
    return {
      setValue: {
        canBeModified: true,
        constantChildIndices: null,
        codeForExpression: null,
        inverseMaps: null,
        template: null,
        mathChildrenMapped: null,
      }
    };
  }

  // determine if can calculate value of activeChildren from
  // any specified value of expression

  // categorize all math activeChildren as variables or constants
  let variableInds = [];
  let variables = [];
  // let constantInds = [];
  let constants = [];

  let constantChildIndices = {};

  for (let [ind, childModifiable] of dependencyValues.mathChildrenModifiable.entries()) {

    let substitutionCode = dependencyValues.codePre + ind;

    if (childModifiable.stateValues.canBeModified === true) {
      variableInds.push(ind);
      variables.push(substitutionCode);
    }
    else {
      // constantInds.push(ind);
      constants.push(substitutionCode);
      constantChildIndices[substitutionCode] = ind;
    }
  }

  // include codePre in code for whole expression, as we know codePre is not in math expression
  let codeForExpression = dependencyValues.codePre + "expr";
  let tree = me.utils.unflattenLeft(dependencyValues.expressionWithCodes.tree);

  let result = checkForLinearExpression(tree, variables, codeForExpression, constants);

  if (result.foundLinear) {

    let inverseMaps = {};
    let template = result.template;
    let mathChildrenMapped = new Set();

    for (let key in result.mappings) {

      inverseMaps[key] = result.mappings[key];

      // if component was due to a math child, add Ind of the math child
      let mathChildSub = inverseMaps[key].mathChildSub;
      if (mathChildSub) {
        let mathChildInd = variableInds[variables.indexOf(mathChildSub)]
        inverseMaps[key].mathChildInd = mathChildInd;
        mathChildrenMapped.add(Number(mathChildInd));
      }
    }

    mathChildrenMapped.has = mathChildrenMapped.has.bind(mathChildrenMapped);

    // found an inverse
    return {
      setValue: {
        canBeModified: true,
        constantChildIndices,
        codeForExpression,
        inverseMaps, template,
        mathChildrenMapped,
      }
    };
  }

  // if not linear, can't find an inverse
  return {
    setValue: {
      canBeModified: false,
      constantChildIndices: null,
      codeForExpression: null,
      inverseMaps: null,
      template: null,
      mathChildrenMapped: null,
    }
  }
}

function checkForLinearExpression(tree, variables, inverseTree, constants = [], components = []) {
  // Check if tree is a linear expression in variables.
  // Each component of container must be a linear expression in just one variable.
  // Haven't implemented inversion of a multivariable linear map

  let tree_variables = me.variables(tree);
  if (tree_variables.every(v => !(variables.includes(v)))) {
    if (tree_variables.every(v => !(constants.includes(v)))) {
      // if there are no variable or constant math activeChildren, then consider it linear
      let mappings = {};
      let key = "x" + components.join('_');
      mappings[key] = { result: me.fromAst(inverseTree).simplify(), components: components };
      //let modifiableStrings = {[key]: components};
      return { foundLinear: true, mappings: mappings, template: key };
      //modifiableStrings: modifiableStrings };
    }
  }

  // if not an array, check if is a variable
  if (!Array.isArray(tree)) {
    return checkForScalarLinearExpression(tree, variables, inverseTree, components);
  }

  let operator = tree[0];
  let operands = tree.slice(1);

  // for container, check if at least one component is a linear expression
  if (operator === "tuple" || operator === "vector" || operator === "list") {

    let result = { mappings: {}, template: [operator] };//, modifiableStrings: {}};
    let numLinear = 0;
    for (let ind = 0; ind < operands.length; ind++) {
      let new_components = [...components, ind];
      let res = checkForLinearExpression(operands[ind], variables, inverseTree, constants, new_components);
      if (res.foundLinear) {
        numLinear++;

        // append mappings found for the component
        result.mappings = Object.assign(result.mappings, res.mappings);

        // // append modifiableStrings found for the component
        // result.modifiableStrings = Object.assign(result.modifiableStrings, res.modifiableStrings);

        // append template
        result.template.push(res.template);
      } else {
        result.template.push("x" + new_components.join('_'));
      }
    }

    // if no components are linear, view whole container as nonlinear
    if (numLinear === 0) {
      return { foundLinear: false };
    }

    // if at least one componen is a linear functions, view as linear
    result.foundLinear = true;
    return result;
  }
  else {
    // if not a container, check if is a scalar linear function
    return checkForScalarLinearExpression(tree, variables, inverseTree, components);
  }

}

// check if tree is a scalar linear function in one of the variables
function checkForScalarLinearExpression(tree, variables, inverseTree, components = []) {
  if ((typeof tree === "string") && variables.includes(tree)) {
    let mappings = {};
    let template = "x" + components.join('_');
    mappings[template] = { result: me.fromAst(inverseTree).simplify(), components: components, mathChildSub: tree };
    return { foundLinear: true, mappings: mappings, template: template };
  }

  if (!Array.isArray(tree)) {
    return { foundLinear: false };
  }

  let operator = tree[0];
  let operands = tree.slice(1);

  if (operator === '-') {
    inverseTree = ['-', inverseTree];
    return checkForScalarLinearExpression(operands[0], variables, inverseTree, components);
  }
  if (operator === '+') {
    if (me.variables(operands[0]).every(v => !variables.includes(v))) {
      // if none of the variables appear in the first operand, subtract off operand from inverseTree
      inverseTree = ['+', inverseTree, ['-', operands[0]]];
      return checkForScalarLinearExpression(operands[1], variables, inverseTree, components);
    }
    else if (me.variables(operands[1]).every(v => !variables.includes(v))) {
      // if none of the variables appear in the second operand, subtract off operand from inverseTree
      inverseTree = ['+', inverseTree, ['-', operands[1]]];
      return checkForScalarLinearExpression(operands[0], variables, inverseTree, components);
    }
    else {
      // neither operand was a constant
      return { foundLinear: false };
    }
  }
  if (operator === '*') {
    if (me.variables(operands[0]).every(v => !variables.includes(v))) {
      // if none of the variables appear in the first operand, divide inverseTree by operand
      inverseTree = ['/', inverseTree, operands[0]];
      return checkForScalarLinearExpression(operands[1], variables, inverseTree, components);
    }
    else if (me.variables(operands[1]).every(v => !variables.includes(v))) {
      // if none of the variables appear in the second operand, divide inverseTree by operand
      inverseTree = ['/', inverseTree, operands[1]];
      return checkForScalarLinearExpression(operands[0], variables, inverseTree, components);
    }
    else {
      // neither operand was a constant
      return { foundLinear: false };
    }
  }
  if (operator === '/') {
    if (me.variables(operands[1]).every(v => !variables.includes(v))) {
      // if none of the variables appear in the second operand, multiply inverseTree by operand
      inverseTree = ['*', inverseTree, operands[1]];
      return checkForScalarLinearExpression(operands[0], variables, inverseTree, components);
    }
    else {
      // second operand was not a constant
      return { foundLinear: false };
    }
  }

  // any other operator means not linear
  return { foundLinear: false };

}

async function invertMath({ desiredStateVariableValues, dependencyValues,
  stateValues, workspace, overrideFixed, componentName
}) {

  if (!await stateValues.canBeModified && !overrideFixed) {
    return { success: false };
  }

  let mathChildren = dependencyValues.mathChildren;
  let nStringChildren = dependencyValues.stringChildren.length;



  if (mathChildren.length === 1 && nStringChildren === 0) {
    // if only child is a math, just send instructions to change it to desired value
    return {
      success: true,
      instructions: [{
        setDependency: "mathChildren",
        desiredValue: desiredStateVariableValues.unnormalizedValue,
        childIndex: 0,
        variableIndex: 0,
      }]
    }
  }


  let desiredExpression = convertValueToMathExpression(desiredStateVariableValues.unnormalizedValue);

  let result = await preprocessMathInverseDefinition({
    desiredValue: desiredExpression,
    stateValues,
    variableName: "value",
    workspace,
  })


  let vectorComponentsNotAffected = result.vectorComponentsNotAffected;
  desiredExpression = result.desiredValue;

  if (mathChildren.length === 0) {

    let instructions = [];

    if (nStringChildren > 0) {

      instructions.push({
        setDependency: "expressionWithCodes",
        desiredValue: desiredExpression,
      });

    } else {
      instructions.push({
        setDependency: "valueShadow",
        desiredValue: desiredExpression,
      });
    }

    return {
      success: true,
      instructions
    }

  }


  // first calculate expression pieces to make sure really can update
  let expressionPieces = await getExpressionPieces({ expression: desiredExpression, stateValues });
  if (!expressionPieces) {
    return { success: false };
  }

  let instructions = [];

  let childrenToSkip = [];
  if (vectorComponentsNotAffected && await stateValues.mathChildrenByVectorComponent) {
    let mathChildrenByVectorComponent = await stateValues.mathChildrenByVectorComponent;
    for (let ind of vectorComponentsNotAffected) {
      if (mathChildrenByVectorComponent[ind]) {
        childrenToSkip.push(...mathChildrenByVectorComponent[ind])
      }
    }
  }

  // update math children where have inversemap and canBeModified is true
  let mathChildrenWithCanBeModified = await stateValues.mathChildrenWithCanBeModified;
  for (let [childInd, mathChild] of mathChildren.entries()) {
    if (stateValues.mathChildrenMapped.has(childInd) &&
      mathChildrenWithCanBeModified[childInd].stateValues.canBeModified
    ) {

      if (!childrenToSkip.includes(childInd)) {
        let childValue = expressionPieces[childInd];
        let subsMap = {};
        let foundConst = false;
        let constantChildIndices = await stateValues.constantChildIndices;
        for (let code in constantChildIndices) {
          let constInd = constantChildIndices[code]
          subsMap[code] = mathChildren[constInd].stateValues.value;
          foundConst = true;
        }
        if (foundConst) {
          // substitute values of any math children that are constant
          // (i.e., that are marked as not modifiable from above)
          childValue = childValue.substitute(subsMap);
        }
        childValue = childValue.simplify();
        instructions.push({
          setDependency: "mathChildren",
          desiredValue: childValue,
          childIndex: childInd,
          variableIndex: 0,
        });
      }

      delete expressionPieces[childInd];
    }
  }


  // if there are any string children,
  // need to update expressionWithCodes with new values


  if (nStringChildren > 0) {
    let newExpressionWithCodes = dependencyValues.expressionWithCodes;
    let codePre = dependencyValues.codePre;
    let nCP = codePre.length;

    // Given that we have both string and math children,
    // the only way that expressionWithCodes could change
    // is if expression is a vector 
    // and there is a vector component that came entirely from a string child,
    // i.e., that that vector component in expressionWithCodes
    // does not have any Codes in it.

    function mathComponentIsCode(tree) {
      return typeof tree === "string" && tree.substring(0, nCP) === codePre
    }

    function mathComponentContainsCode(tree) {
      if (Array.isArray(tree)) {
        return flattenDeep(tree.slice(1)).some(mathComponentIsCode)
      } else {
        return mathComponentIsCode(tree)
      }
    }

    if (["vector", "tuple", "list"].includes(newExpressionWithCodes.tree[0]) &&
      !newExpressionWithCodes.tree.slice(1).every(mathComponentContainsCode)
    ) {

      let inverseMaps = await stateValues.inverseMaps;
      for (let piece in expressionPieces) {
        let inverseMap = inverseMaps[piece];
        // skip math children
        if (inverseMap.mathChildInd !== undefined) {
          continue;
        }
        let components = inverseMap.components;
        newExpressionWithCodes =
          newExpressionWithCodes.substitute_component(
            components, expressionPieces[piece]);
      }

      instructions.push({
        setDependency: "expressionWithCodes",
        desiredValue: newExpressionWithCodes,
      });
    }

  }

  return {
    success: true,
    instructions,
  };

}


async function getExpressionPieces({ expression, stateValues }) {

  let template = await stateValues.template;

  let matching = me.utils.match(expression.tree, template);

  // if doesn't match, trying matching, by converting vectors, intervals, or both
  if (!matching) {
    matching = me.utils.match(expression.tuples_to_vectors().tree, me.fromAst(template).tuples_to_vectors().tree);
    if (!matching) {
      matching = me.utils.match(expression.to_intervals().tree, me.fromAst(template).to_intervals().tree);
      if (!matching) {
        matching = me.utils.match(expression.tuples_to_vectors().to_intervals().tree, me.fromAst(template).tuples_to_vectors().to_intervals().tree);
        if (!matching) {
          return false;
        }
      }
    }
  }

  let pieces = {};
  for (let x in matching) {
    let subMap = {};
    subMap[await stateValues.codeForExpression] = matching[x];
    let inverseMap = (await stateValues.inverseMaps)[x];
    if (inverseMap !== undefined) {
      let id = x;
      if (inverseMap.mathChildInd !== undefined) {
        id = inverseMap.mathChildInd;
      }
      pieces[id] = inverseMap.result.substitute(subMap);

      pieces[id] = normalizeMathExpression({
        value: pieces[id],
        simplify: await stateValues.simplify,
        expand: await stateValues.expand,
        createVectors: await stateValues.createVectors,
        createIntervals: await stateValues.createIntervals,
      })
    }
  }
  return pieces;

}
