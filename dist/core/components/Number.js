import InlineComponent from './abstract/InlineComponent.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { getFromText, mathStateVariableFromNumberStateVariable, numberToMathExpression, roundForDisplay, textToAst } from '../utils/math.js';
import { buildParsedExpression, evaluateLogic } from '../utils/booleanLogic.js';

export default class NumberComponent extends InlineComponent {
  static componentType = "number";

  static variableForPlainMacro = "value";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
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
    attributes.renderAsMath = {
      createComponentOfType: "boolean",
      createStateVariable: "renderAsMath",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };
    attributes.convertBoolean = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "convertBoolean",
      defaultValue: false,
    };
    attributes.valueOnNaN = {
      createPrimitiveOfType: "number",
      createStateVariable: "valueOnNaN",
      defaultValue: NaN,
    };
    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    // if not convertBoolean, then
    // add math around multiple children
    // so that can invert value
    sugarInstructions.push({
      childrenRegex: /..+/,
      replacementFunction: ({ matchedChildren, componentAttributes }) => ({
        success: !componentAttributes.convertBoolean,
        newChildren: [{ componentType: "math", children: matchedChildren }],
      })
    });

    return sugarInstructions;

  }

  static returnChildGroups() {

    return [{
      group: "strings",
      componentTypes: ["string"]
    }, {
      group: "numbers",
      componentTypes: ["number"]
    }, {
      group: "maths",
      componentTypes: ["math"]
    }, {
      group: "texts",
      componentTypes: ["text"]
    }, {
      group: "booleans",
      componentTypes: ["boolean"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.displayDigits = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      hasEssential: true,
      defaultValue: 10,
      returnDependencies: () => ({
        numberListParentDisplayDigits: {
          dependencyType: "parentStateVariable",
          parentComponentType: "numberList",
          variableName: "displayDigits"
        },
        mathListParentDisplayDigits: {
          dependencyType: "parentStateVariable",
          parentComponentType: "mathList",
          variableName: "displayDigits"
        },
        numberListParentDisplayDecimals: {
          dependencyType: "parentStateVariable",
          parentComponentType: "numberList",
          variableName: "displayDecimals"
        },
        mathListParentDisplayDecimals: {
          dependencyType: "parentStateVariable",
          parentComponentType: "mathList",
          variableName: "displayDecimals"
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
        numberMathChildren: {
          dependencyType: "child",
          childGroups: ["numbers", "maths"],
          variableNames: ["displayDigits"]
        },
        otherChildren: {
          dependencyType: "child",
          childGroups: ["strings", "texts", "booleans"],
        }
      }),
      definition({ dependencyValues, usedDefault }) {

        let foundDefaultValue = false;
        let theDefaultValueFound;


        if (dependencyValues.numberListParentDisplayDigits !== null) {
          if (usedDefault.numberListParentDisplayDigits) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.numberListParentDisplayDigits;
          } else {
            // having a numberlist parent that prescribed displayDigits.
            // this overrides everything else
            return {
              setValue: {
                displayDigits: dependencyValues.numberListParentDisplayDigits
              }
            }
          }
        }

        if (dependencyValues.mathListParentDisplayDigits !== null) {
          if (usedDefault.mathListParentDisplayDigits) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.mathListParentDisplayDigits;
          } else {
            // having a mathlist parent that prescribed displayDigits.
            // this overrides everything else
            return {
              setValue: {
                displayDigits: dependencyValues.mathListParentDisplayDigits
              }
            }
          }
        }


        let haveListParentWithDisplayDecimals =
          dependencyValues.numberListParentDisplayDecimals !== null && !usedDefault.numberListParentDisplayDecimals
          ||
          dependencyValues.mathListParentDisplayDecimals !== null && !usedDefault.mathListParentDisplayDecimals;


        let displayDigitsAttrUsedDefault = dependencyValues.displayDigitsAttr === null || usedDefault.displayDigitsAttr;
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

        if (!haveListParentWithDisplayDecimals && dependencyValues.displayDigitsAttr !== null) {
          // have to check to exclude case where have displayDecimals from mathList parent
          // because otherwise a non-default displayDigits will win over displayDecimals

          if (displayDigitsAttrUsedDefault) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.displayDigitsAttr.stateValues.value;
          } else {
            return {
              setValue: {
                displayDigits: dependencyValues.displayDigitsAttr.stateValues.value
              }
            }
          }
        }


        if (
          !haveListParentWithDisplayDecimals
          && displayDecimalsAttrUsedDefault
          && dependencyValues.numberMathChildren.length === 1
          && dependencyValues.otherChildren.length === 0
        ) {
          // have to check to exclude case where have displayDecimals attribute or from mathList parent
          // because otherwise a non-default displayDigits will win over displayDecimals

          if (usedDefault.numberMathChildren[0] && usedDefault.numberMathChildren[0].displayDigits) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.numberMathChildren[0].stateValues.displayDigits;
          } else {
            return {
              setValue: {
                displayDigits: dependencyValues.numberMathChildren[0].stateValues.displayDigits
              }
            };
          }
        }

        if (foundDefaultValue) {
          return { useEssentialOrDefaultValue: { displayDigits: { defaultValue: theDefaultValueFound } } }
        } else {
          return { useEssentialOrDefaultValue: { displayDigits: true } }
        }

      }
    }

    stateVariableDefinitions.displayDecimals = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      hasEssential: true,
      defaultValue: null,
      returnDependencies: () => ({
        numberListParentDisplayDecimals: {
          dependencyType: "parentStateVariable",
          parentComponentType: "numberList",
          variableName: "displayDecimals"
        },
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
        numberMathChildren: {
          dependencyType: "child",
          childGroups: ["numbers", "maths"],
          variableNames: ["displayDecimals"]
        },
        otherChildren: {
          dependencyType: "child",
          childGroups: ["strings", "texts", "booleans"],
        }
      }),
      definition({ dependencyValues, usedDefault }) {

        let foundDefaultValue = false;
        let theDefaultValueFound;

        if (dependencyValues.numberListParentDisplayDecimals !== null) {
          if (usedDefault.numberListParentDisplayDecimals) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.numberListParentDisplayDecimals;
          } else {
            // having a numberlist parent that prescribed displayDecimals.
            // this overrides everything else
            return {
              setValue: {
                displayDecimals: dependencyValues.numberListParentDisplayDecimals
              }
            }
          }
        }

        if (dependencyValues.mathListParentDisplayDecimals !== null) {
          if (usedDefault.mathListParentDisplayDecimals) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.mathListParentDisplayDecimals;

          } else {
            // having a mathlist parent that prescribed displayDecimals.
            // this overrides everything else
            return {
              setValue: {
                displayDecimals: dependencyValues.mathListParentDisplayDecimals
              }
            }
          }
        }


        if (dependencyValues.displayDecimalsAttr !== null) {
          if (usedDefault.displayDecimalsAttr) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.displayDecimalsAttr.stateValues.value;
          } else {
            return {
              setValue: {
                displayDecimals: dependencyValues.displayDecimalsAttr.stateValues.value
              }
            }
          }
        }

        if (dependencyValues.numberMathChildren.length === 1
          && dependencyValues.otherChildren.length === 0
        ) {
          if (usedDefault.numberMathChildren[0] && usedDefault.numberMathChildren[0].displayDecimals) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.numberMathChildren[0].stateValues.displayDecimals;
          } else {
            return {
              setValue: {
                displayDecimals: dependencyValues.numberMathChildren[0].stateValues.displayDecimals
              }
            };
          }
        }


        if (foundDefaultValue) {
          return { useEssentialOrDefaultValue: { displayDecimals: { defaultValue: theDefaultValueFound } } }
        } else {
          return { useEssentialOrDefaultValue: { displayDecimals: true } }
        }
      }
    }

    stateVariableDefinitions.displaySmallAsZero = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      hasEssential: true,
      defaultValue: 0,
      returnDependencies: () => ({
        numberListParentDisplaySmallAsZero: {
          dependencyType: "parentStateVariable",
          parentComponentType: "numberList",
          variableName: "displaySmallAsZero"
        },
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
        numberMathChildren: {
          dependencyType: "child",
          childGroups: ["numbers", "maths"],
          variableNames: ["displaySmallAsZero"]
        },
        otherChildren: {
          dependencyType: "child",
          childGroups: ["strings", "texts", "booleans"],
        }
      }),
      definition({ dependencyValues, usedDefault }) {

        let foundDefaultValue = false;
        let theDefaultValueFound;

        if (dependencyValues.numberListParentDisplaySmallAsZero !== null) {
          if (usedDefault.numberListParentDisplaySmallAsZero) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.numberListParentDisplaySmallAsZero;
          } else {
            // having a numberlist parent that prescribed displaySmallAsZero.
            // this overrides everything else
            return {
              setValue: {
                displaySmallAsZero: dependencyValues.numberListParentDisplaySmallAsZero
              }
            }
          }
        }

        if (dependencyValues.mathListParentDisplaySmallAsZero !== null) {
          if (usedDefault.mathListParentDisplaySmallAsZero) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.mathListParentDisplaySmallAsZero;
          } else {
            // having a mathlist parent that prescribed displaySmallAsZero.
            // this overrides everything else
            return {
              setValue: {
                displaySmallAsZero: dependencyValues.mathListParentDisplaySmallAsZero
              }
            }
          }
        }

        if (dependencyValues.displaySmallAsZeroAttr !== null) {
          if (usedDefault.displaySmallAsZeroAttr) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.displaySmallAsZeroAttr.stateValues.value;
          } else {
            return {
              setValue: {
                displaySmallAsZero: dependencyValues.displaySmallAsZeroAttr.stateValues.value
              }
            }
          }
        }

        if (dependencyValues.numberMathChildren.length === 1
          && dependencyValues.otherChildren.length === 0
        ) {
          if (usedDefault.numberMathChildren[0] && usedDefault.numberMathChildren[0].displaySmallAsZero) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.numberMathChildren[0].stateValues.displaySmallAsZero;
          } else {
            return {
              setValue: {
                displaySmallAsZero: dependencyValues.numberMathChildren[0].stateValues.displaySmallAsZero
              }
            };
          }
        }

        if (foundDefaultValue) {
          return { useEssentialOrDefaultValue: { displaySmallAsZero: { defaultValue: theDefaultValueFound } } }
        } else {
          return { useEssentialOrDefaultValue: { displaySmallAsZero: true } }
        }
      }
    }

    stateVariableDefinitions.padZeros = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      hasEssential: true,
      defaultValue: false,
      returnDependencies: () => ({
        numberListParentPadZeros: {
          dependencyType: "parentStateVariable",
          parentComponentType: "numberList",
          variableName: "padZeros"
        },
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
        numberMathChildren: {
          dependencyType: "child",
          childGroups: ["numbers", "maths"],
          variableNames: ["padZeros"]
        },
        otherChildren: {
          dependencyType: "child",
          childGroups: ["strings", "texts", "booleans"],
        }
      }),
      definition({ dependencyValues, usedDefault }) {

        let foundDefaultValue = false;
        let theDefaultValueFound;

        if (dependencyValues.numberListParentPadZeros !== null) {
          if (usedDefault.numberListParentPadZeros) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.numberListParentPadZeros;
          } else {
            // having a numberlist parent that prescribed padZeros.
            // this overrides everything else
            return {
              setValue: {
                padZeros: dependencyValues.numberListParentPadZeros
              }
            }
          }
        }

        if (dependencyValues.mathListParentPadZeros !== null) {
          if (usedDefault.mathListParentPadZeros) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.mathListParentPadZeros;
          } else {
            // having a mathlist parent that prescribed padZeros.
            // this overrides everything else
            return {
              setValue: {
                padZeros: dependencyValues.mathListParentPadZeros
              }
            }
          }
        }

        if (dependencyValues.padZerosAttr !== null) {
          if (usedDefault.padZerosAttr) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.padZerosAttr.stateValues.value;
          } else {
            return {
              setValue: {
                padZeros: dependencyValues.padZerosAttr.stateValues.value
              }
            }
          }
        }

        if (dependencyValues.numberMathChildren.length === 1
          && dependencyValues.otherChildren.length == 0
        ) {
          if (usedDefault.numberMathChildren[0] && usedDefault.numberMathChildren[0].padZeros) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.numberMathChildren[0].stateValues.padZeros;
          } else {
            return {
              setValue: {
                padZeros: dependencyValues.numberMathChildren[0].stateValues.padZeros
              }
            };
          }
        }


        if (foundDefaultValue) {
          return { useEssentialOrDefaultValue: { padZeros: { defaultValue: theDefaultValueFound } } }
        } else {
          return { useEssentialOrDefaultValue: { padZeros: true } }
        }


      }
    }

    stateVariableDefinitions.singleNumberOrStringChild = {
      additionalStateVariablesDefined: ["singleMathChild"],
      returnDependencies: () => ({
        numberChildren: {
          dependencyType: "child",
          childGroups: ["numbers"],
        },
        stringChildren: {
          dependencyType: "child",
          childGroups: ["strings"],
        },
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
        },
        booleanChildren: {
          dependencyType: "child",
          childGroups: ["booleans"],
        },
        textChildren: {
          dependencyType: "child",
          childGroups: ["texts"],
        },
      }),
      definition({ dependencyValues }) {

        let nNumberStrings = dependencyValues.numberChildren.length +
          dependencyValues.stringChildren.length;
        let nMaths = dependencyValues.mathChildren.length;
        let nOthers = dependencyValues.booleanChildren.length +
          dependencyValues.textChildren.length;

        let singleNumberOrStringChild = nNumberStrings <= 1 && nMaths + nOthers === 0;
        let singleMathChild = nMaths === 1 && nNumberStrings + nOthers === 0;

        return { setValue: { singleNumberOrStringChild, singleMathChild } };
      }
    }


    stateVariableDefinitions.parsedExpression = {
      additionalStateVariablesDefined: [
        "codePre"
      ],
      returnDependencies: () => ({
        allChildren: {
          dependencyType: "child",
          childGroups: ["strings", "numbers", "maths", "texts", "booleans"],
        },
        stringChildren: {
          dependencyType: "child",
          childGroups: ["strings"],
          variableNames: ["value"]
        }
      }),
      definition: buildParsedExpression
    };


    stateVariableDefinitions.mathChildrenByCode = {
      additionalStateVariablesDefined: [
        "textChildrenByCode", "numberChildrenByCode",
        "booleanChildrenByCode",
      ],
      returnDependencies: () => ({
        allChildren: {
          dependencyType: "child",
          childGroups: ["strings", "numbers", "maths", "texts", "booleans"],
          variableNames: ["value", "texts", "maths", "booleans"],
          variablesOptional: true,
        },
        codePre: {
          dependencyType: "stateVariable",
          variableName: "codePre"
        }
      }),
      definition({ dependencyValues, componentInfoObjects }) {

        let mathChildrenByCode = {};
        let numberChildrenByCode = {};
        let textChildrenByCode = {};
        let booleanChildrenByCode = {};
        let subnum = 0;

        let codePre = dependencyValues.codePre;

        for (let child of dependencyValues.allChildren) {
          if (typeof child !== "string") {
            // a math, mathList, text, textList, boolean, or booleanList
            let code = codePre + subnum;

            if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "math"
            })) {
              mathChildrenByCode[code] = child;
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "number"
            })) {
              numberChildrenByCode[code] = child;
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "text"
            })) {
              textChildrenByCode[code] = child;
            } else {
              booleanChildrenByCode[code] = child;
            }
            subnum += 1;

          }
        }

        return {
          setValue: {
            mathChildrenByCode,
            numberChildrenByCode,
            textChildrenByCode,
            booleanChildrenByCode,
          }
        }
      }

    }


    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: [
          "displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros",
        ],
        // the reason we create a attribute component from the state variable,
        // rather than just shadowing the attribute,
        // is that a sequence creates a number where it sets fixed directly in the state
        // TODO: how to deal with this in general?  Should we disallow that way to set state?
        // Or should we always shadow attributes this way?
        addAttributeComponentsShadowingStateVariables: {
          fixed: {
            stateVariableToShadow: "fixed",
          }
        },
      },
      hasEssential: true,
      stateVariablesDeterminingDependencies: ["singleNumberOrStringChild"],
      returnDependencies({ stateValues }) {
        if (stateValues.singleNumberOrStringChild) {
          return {
            singleNumberOrStringChild: {
              dependencyType: "stateVariable",
              variableName: "singleNumberOrStringChild"
            },
            convertBoolean: {
              dependencyType: "stateVariable",
              variableName: "convertBoolean"
            },
            numberChild: {
              dependencyType: "child",
              childGroups: ["numbers"],
              variableNames: ["value"],
            },
            stringChild: {
              dependencyType: "child",
              childGroups: ["strings"],
              variableNames: ["value"],
            },
            valueOnNaN: {
              dependencyType: "stateVariable",
              variableName: "valueOnNaN"
            },
          }
        } else {

          return {
            singleNumberOrStringChild: {
              dependencyType: "stateVariable",
              variableName: "singleNumberOrStringChild"
            },
            singleMathChild: {
              dependencyType: "stateVariable",
              variableName: "singleMathChild"
            },
            convertBoolean: {
              dependencyType: "stateVariable",
              variableName: "convertBoolean"
            },
            parsedExpression: {
              dependencyType: "stateVariable",
              variableName: "parsedExpression",
            },
            allChildren: {
              dependencyType: "child",
              childGroups: ["strings", "numbers", "maths", "texts", "booleans"],
              variableNames: ["value", "texts", "maths", "unordered"],
              variablesOptional: true,
            },
            booleanChildrenByCode: {
              dependencyType: "stateVariable",
              variableName: "booleanChildrenByCode",
            },
            textChildrenByCode: {
              dependencyType: "stateVariable",
              variableName: "textChildrenByCode",
            },
            mathChildrenByCode: {
              dependencyType: "stateVariable",
              variableName: "mathChildrenByCode",
            },
            numberChildrenByCode: {
              dependencyType: "stateVariable",
              variableName: "numberChildrenByCode",
            },
            valueOnNaN: {
              dependencyType: "stateVariable",
              variableName: "valueOnNaN"
            },
          }
        }
      },
      definition({ dependencyValues, componentInfoObjects }) {

        if (dependencyValues.singleNumberOrStringChild) {
          if (dependencyValues.numberChild.length === 0) {
            if (dependencyValues.stringChild.length === 0) {
              return { useEssentialOrDefaultValue: { value: { defaultValue: dependencyValues.valueOnNaN } } }
            }
            let number = Number(dependencyValues.stringChild[0]);
            if (Number.isNaN(number)) {
              try {
                number = me.fromAst(textToAst.convert(dependencyValues.stringChild[0])).evaluate_to_constant();

                if (typeof number === "boolean") {
                  if (dependencyValues.convertBoolean) {
                    number = number ? 1 : 0;
                  } else {
                    number = dependencyValues.valueOnNaN;
                  }
                } else if (number === null || Number.isNaN(number)) {

                  if (dependencyValues.convertBoolean) {
                    let parsedExpression = buildParsedExpression({
                      dependencyValues: {
                        stringChildren: dependencyValues.stringChild,
                        allChildren: dependencyValues.stringChild
                      },
                      componentInfoObjects
                    }).setValue.parsedExpression;

                    number = evaluateLogic({
                      logicTree: parsedExpression.tree,
                      dependencyValues: {
                        booleanChildrenByCode: {},
                        booleanListChildrenByCode: {},
                        textChildrenByCode: {},
                        textListChildrenByCode: {},
                        mathChildrenByCode: {},
                        mathListChildrenByCode: {},
                        numberChildrenByCode: {},
                        numberListChildrenByCode: {},
                        otherChildrenByCode: {},
                      },
                      valueOnInvalid: dependencyValues.valueOnNaN
                    })
                  } else {
                    number = dependencyValues.valueOnNaN;
                  }

                } else if (number?.re === Infinity || number?.re === -Infinity || number?.im === Infinity || number?.im === -Infinity) {
                  // if start with Infinity*i, evaluate_to_constant makes it Infinity+Infinity*i,
                  // but if start with Infinity+Infinity*i, evaluate_to_constant makes is NaN+NaN*i
                  // To make sure displayed value (which has one more pass through evaluate_to_constant)
                  // and value match, pass through evaluate_to_constant a second time in this case
                  number = numberToMathExpression(number).evaluate_to_constant();
                } else if (number?.im === 0) {
                  number = number.re;
                }
              } catch (e) {
                number = dependencyValues.valueOnNaN;
              }
            }
            return { setValue: { value: number } };
          } else {
            let number = dependencyValues.numberChild[0].stateValues.value;
            if (Number.isNaN(number)) {
              number = dependencyValues.valueOnNaN;
            }
            return { setValue: { value: number } }
          }
        } else {

          if (dependencyValues.parsedExpression === null) {
            // if don't have parsed expression
            // (which could occur if have invalid form)
            // return dependencyValues.valueOnNaN
            return {
              setValue: { value: dependencyValues.valueOnNaN }
            }
          }

          if (Object.keys(dependencyValues.textChildrenByCode).length === 0
            && Object.keys(dependencyValues.booleanChildrenByCode).length === 0
          ) {
            // just have strings, numbers, and math, evaluate expression


            let replaceMath = function (tree) {
              if (typeof tree === "string") {
                let child = dependencyValues.mathChildrenByCode[tree];
                if (child !== undefined) {
                  return child.stateValues.value.tree;
                }
                child = dependencyValues.numberChildrenByCode[tree];
                if (child !== undefined) {
                  return numberToMathExpression(child.stateValues.value).tree;
                }
                return tree;
              }
              if (!Array.isArray(tree)) {
                return tree;
              }
              return [tree[0], ...tree.slice(1).map(replaceMath)]
            }

            let number;

            try {
              number = me.fromAst(replaceMath(dependencyValues.parsedExpression.tree)).evaluate_to_constant();
            } catch (e) {
              number = dependencyValues.valueOnNaN;
            }

            if (!Number.isNaN(number) &&
              (typeof number === "number" || (typeof number?.re === "number" && typeof number?.im === "number"))
            ) {

              if (number.re === Infinity || number.re === -Infinity || number.im === Infinity || number.im === -Infinity) {
                // if start with Infinity*i, evaluate_to_constant makes it Infinity+Infinity*i,
                // but if start with Infinity+Infinity*i, evaluate_to_constant makes is NaN+NaN*i
                // To make sure displayed value (which has one more pass through evaluate_to_constant)
                // and value match, pass through evaluate_to_constant a second time in this case
                number = numberToMathExpression(number).evaluate_to_constant();
              } else if (number.im === 0) {
                number = number.re;
              }
              return { setValue: { value: number } };

            }


          }

          if (!dependencyValues.convertBoolean) {
            return { setValue: { value: dependencyValues.valueOnNaN } }
          }


          dependencyValues = Object.assign({}, dependencyValues);
          dependencyValues.mathListChildrenByCode = {};
          dependencyValues.numberListChildrenByCode = {};
          dependencyValues.textListChildrenByCode = {};
          dependencyValues.booleanListChildrenByCode = {};
          dependencyValues.otherChildrenByCode = {};

          let fractionSatisfied = evaluateLogic({
            logicTree: dependencyValues.parsedExpression.tree,
            dependencyValues,
            valueOnInvalid: dependencyValues.valueOnNaN,
          });

          // fractionSatisfied will be either 0 or 1 (or valueOnNaN)
          // as have not specified matchPartial

          return { setValue: { value: fractionSatisfied } }

        }
      },
      set: function (value) {
        // this function is called when
        // - definition is overridden by a copy prop
        // - when processing new state variable values
        //   (which could be from outside sources)

        // TODO: we can't access the state variable valueOnNaN here
        // so we can set value to NaN
        // Is there a way to use valueOnNaN?  Is there a case where we'd need to?
        if (value === null) {
          return NaN;
        }
        if (typeof value === "number" || (typeof value?.re === "number" && typeof value?.im === "number")) {
          return value;
        }

        let number = Number(value);
        if (Number.isNaN(number)) {
          try {
            number = me.fromAst(textToAst.convert(value)).evaluate_to_constant();
            if (number === null) {
              number = NaN;
            }
          } catch (e) {
            number = NaN;
          }
        }
        return number;
      },
      inverseDefinition: async function ({ desiredStateVariableValues,
        dependencyValues, stateValues, overrideFixed,
      }) {


        if (!await stateValues.canBeModified && !overrideFixed) {
          return { success: false };
        }

        let desiredValue = desiredStateVariableValues.value;
        if (desiredValue instanceof me.class) {
          desiredValue = desiredValue.evaluate_to_constant();
          if (Number.isNaN(desiredValue) || !(
            typeof desiredValue === "number" || (typeof desiredValue?.re === "number" && typeof desiredValue?.im === "number")
          )) {
            desiredValue = dependencyValues.valueOnNaN;
          }
        } else {
          if (Number.isNaN(desiredValue) || !(
            typeof desiredValue === "number" || (typeof desiredValue?.re === "number" && typeof desiredValue?.im === "number")
          )) {
            desiredValue = Number(desiredValue);
            if (Number.isNaN(desiredValue)) {
              desiredValue = dependencyValues.valueOnNaN;
            }
          }
        }

        if (!dependencyValues.singleNumberOrStringChild) {
          // invert only if have just a single math child
          if (dependencyValues.singleMathChild) {
            return {
              success: true,
              instructions: [{
                setDependency: "allChildren",
                desiredValue: numberToMathExpression(desiredValue),
                childIndex: 0,
                variableIndex: 0,
              }]
            }
          } else {
            // for any other combination that isn't single number or string,
            // we can't invert
            return { success: false };
          }
        }


        let instructions;

        if (dependencyValues.numberChild.length === 0) {
          if (dependencyValues.stringChild.length === 0) {
            instructions = [{
              setEssentialValue: "value",
              value: numberToMathExpression(desiredValue).evaluate_to_constant(), // to normalize form
            }];
          } else {
            // TODO: would it be more efficient to defer setting value of string?
            instructions = [{
              setDependency: "stringChild",
              desiredValue: numberToMathExpression(desiredValue).toString(),
              childIndex: 0,
              variableIndex: 0,
            }];
          }
        } else {
          instructions = [{
            setDependency: "numberChild",
            desiredValue: desiredValue,
            childIndex: 0,
            variableIndex: 0,
          }];
        }

        return {
          success: true,
          instructions,
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
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero"
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals"
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {
        // for display via latex and text, round any decimal numbers to the significant digits
        // determined by displaydigits
        let rounded = roundForDisplay({
          value: numberToMathExpression(dependencyValues.value),
          dependencyValues, usedDefault
        }).evaluate_to_constant();

        return {
          setValue: {
            valueForDisplay: rounded
          }
        }
      }
    }

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
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
        return { setValue: { text: numberToMathExpression(dependencyValues.valueForDisplay).toString(params) } };
      },
      async inverseDefinition({ desiredStateVariableValues, stateValues }) {
        let desiredNumber = Number(desiredStateVariableValues.text);
        if (Number.isFinite(desiredNumber)) {
          return {
            success: true,
            instructions: [{
              setDependency: "value",
              desiredValue: desiredNumber
            }]
          }
        } else {
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

          desiredNumber = expr.evaluate_to_constant();

          if (Number.isFinite(desiredNumber)) {
            return {
              success: true,
              instructions: [{
                setDependency: "value",
                desiredValue: desiredNumber
              }]
            }
          } else {
            return { success: false };
          }

        }
      }
    }

    stateVariableDefinitions.math = mathStateVariableFromNumberStateVariable({
      numberVariableName: "value",
      mathVariableName: "math",
      isPublic: true
    });

    stateVariableDefinitions.math.shadowingInstructions.attributesToShadow
      = ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"];

    stateVariableDefinitions.latex = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
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
        }
      }),
      definition({ dependencyValues, usedDefault }) {
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
        return { setValue: { latex: numberToMathExpression(dependencyValues.valueForDisplay).toLatex(params) } };
      }
    }

    stateVariableDefinitions.canBeModified = {
      returnDependencies: () => ({
        numberChildModifiable: {
          dependencyType: "child",
          childGroups: ["numbers"],
          variableNames: ["canBeModified"],
        },
        modifyIndirectly: {
          dependencyType: "stateVariable",
          variableName: "modifyIndirectly",
        },
        fixed: {
          dependencyType: "stateVariable",
          variableName: "fixed",
        },
        singleNumberOrStringChild: {
          dependencyType: "stateVariable",
          variableName: "singleNumberOrStringChild",
        },
        singleMathChild: {
          dependencyType: "stateVariable",
          variableName: "singleMathChild",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.modifyIndirectly || dependencyValues.fixed
          || !(dependencyValues.singleNumberOrStringChild || dependencyValues.singleMathChild)) {
          return { setValue: { canBeModified: false } };
        }

        if (dependencyValues.numberChildModifiable.length === 1 &&
          !dependencyValues.numberChildModifiable[0].stateValues.canBeModified) {
          return { setValue: { canBeModified: false } };
        }

        return { setValue: { canBeModified: true } };

      },
    }

    return stateVariableDefinitions;

  }



  // returnSerializeInstructions() {
  //   let stringMatches = this.childLogic.returnMatches("atMostOneString");
  //   let skipChildren = stringMatches && stringMatches.length === 1;
  //   if (skipChildren) {
  //     let stateVariables = ["value"];
  //     return { skipChildren, stateVariables };
  //   }
  //   return {};
  // }


  static adapters = [
    {
      stateVariable: "math",
      stateVariablesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"]
    },
    "text"
  ];

}
