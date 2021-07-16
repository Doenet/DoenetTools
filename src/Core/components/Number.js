import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';
import { mathStateVariableFromNumberStateVariable, roundForDisplay, textToAst } from '../utils/math';
import { buildParsedExpression, evaluateLogic } from '../utils/booleanLogic';

export default class NumberComponent extends InlineComponent {
  static componentType = "number";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["value", "convertBoolean"] };

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.displayDigits = {
      createComponentOfType: "integer",
      createStateVariable: "displayDigits",
      defaultValue: 10,
      public: true,
    }
    attributes.displaySmallAsZero = {
      createComponentOfType: "number",
      createStateVariable: "displaySmallAsZero",
      valueForTrue: 1E-14,
      valueForFalse: 0,
      defaultValue: 0,
      public: true,
    }
    attributes.displayDecimals = {
      createComponentOfType: "integer",
      createStateVariable: "displayDecimals",
      defaultValue: null,
      public: true,
    };
    attributes.renderAsMath = {
      createComponentOfType: "boolean",
      createStateVariable: "renderAsMath",
      defaultValue: false,
      public: true,
      forRenderer: true,
    }
    attributes.convertBoolean = {
      createPrimitiveOfType: "boolean",
      defaultValue: false,
    }
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

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroStrings = childLogic.newLeaf({
      name: "atLeastZeroStrings",
      componentType: 'string',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroNumbers = childLogic.newLeaf({
      name: "atLeastZeroNumbers",
      componentType: 'number',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroMaths = childLogic.newLeaf({
      name: "atLeastZeroMaths",
      componentType: 'math',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroTexts = childLogic.newLeaf({
      name: "atLeastZeroTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroBooleans = childLogic.newLeaf({
      name: "atLeastZeroBooleans",
      componentType: "boolean",
      comparison: "atLeast",
      number: 0,
    });


    childLogic.newOperator({
      name: "stringsNumbersMathsTextsAndBooleans",
      operator: "and",
      propositions: [
        atLeastZeroStrings,
        atLeastZeroNumbers,
        atLeastZeroMaths,
        atLeastZeroTexts,
        atLeastZeroBooleans,
      ],
      setAsBase: true
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.convertBoolean = {
      returnDependencies: () => ({
        convertBooleanAttr: {
          dependencyType: "attribute",
          attributeName: "convertBoolean"
        }
      }),
      definition({ dependencyValues }) {
        return { newValues: { convertBoolean: dependencyValues.convertBooleanAttr } }
      }
    }

    stateVariableDefinitions.singleNumberOrStringChild = {
      additionalStateVariablesDefined: ["singleMathChild"],
      returnDependencies: () => ({
        numberChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroNumbers",
        },
        stringChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroStrings",
        },
        mathChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroMaths",
        },
        booleanChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroBooleans",
        },
        textChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroTexts",
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

        return { newValues: { singleNumberOrStringChild, singleMathChild } };
      }
    }


    stateVariableDefinitions.parsedExpression = {
      additionalStateVariablesDefined: [
        "codePre"
      ],
      returnDependencies: () => ({
        stringMathTextBooleanChildren: {
          dependencyType: "child",
          childLogicName: "stringsNumbersMathsTextsAndBooleans",
        },
        stringChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroStrings",
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
        stringMathTextBooleanChildren: {
          dependencyType: "child",
          childLogicName: "stringsNumbersMathsTextsAndBooleans",
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

        for (let child of dependencyValues.stringMathTextBooleanChildren) {
          if (child.componentType !== "string") {
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
          newValues: {
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
      componentType: "number",
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
              childLogicName: "atLeastZeroNumbers",
              variableNames: ["value", "canBeModified"],
            },
            stringChild: {
              dependencyType: "child",
              childLogicName: "atLeastZeroStrings",
              variableNames: ["value"],
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
            stringMathTextBooleanChildren: {
              dependencyType: "child",
              childLogicName: "stringsNumbersMathsTextsAndBooleans",
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
          }
        }
      },
      defaultValue: NaN,
      definition({ dependencyValues, componentInfoObjects }) {

        if (dependencyValues.singleNumberOrStringChild) {
          if (dependencyValues.numberChild.length === 0) {
            if (dependencyValues.stringChild.length === 0) {
              return { useEssentialOrDefaultValue: { value: { variablesToCheck: ["value"] } } }
            }
            let number = Number(dependencyValues.stringChild[0].stateValues.value);
            if (Number.isNaN(number)) {
              try {
                number = me.fromAst(textToAst.convert(dependencyValues.stringChild[0].stateValues.value)).evaluate_to_constant();

                if (typeof number === "boolean") {
                  if (dependencyValues.convertBoolean) {
                    number = number ? 1 : 0;
                  } else {
                    number = NaN;
                  }
                } else if (number === null || Number.isNaN(number)) {

                  if (dependencyValues.convertBoolean) {
                    let parsedExpression = buildParsedExpression({
                      dependencyValues: {
                        stringChildren: dependencyValues.stringChild,
                        stringMathTextBooleanChildren: dependencyValues.stringChild
                      },
                      componentInfoObjects
                    }).newValues.parsedExpression;

                    number = evaluateLogic({
                      logicTree: parsedExpression.tree,
                      dependencyValues: {
                        booleanChildrenByCode: {},
                        booleanListChildrenByCode: {},
                        textChildrenByCode: {},
                        textListChildrenByCode: {},
                        mathChildrenByCode: {},
                        mathListChildrenByCode: {},
                        numberChildrenByCode: {}
                      },
                      valueOnInvalid: NaN
                    })
                  } else {
                    number = NaN;
                  }

                }
              } catch (e) {
                number = NaN;
              }
            }
            return { newValues: { value: number } };
          } else {
            return { newValues: { value: dependencyValues.numberChild[0].stateValues.value } }
          }
        } else {

          if (dependencyValues.parsedExpression === null) {
            // if don't have parsed expression
            // (which could occur if have invalid form)
            // return NaN
            return {
              newValues: { value: NaN }
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
                  return child.stateValues.value;
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
              number = NaN;
            }

            if (Number.isFinite(number) || number === Infinity || number === -Infinity) {
              return { newValues: { value: number } };

            }


          }

          if (!dependencyValues.convertBoolean) {
            return { newValues: { value: NaN } }
          }

          let unorderedCompare = false;

          // if compare attributes haven't been explicitly prescribed by <if>
          // or one of its ancestors
          // then any of the attributes can be turned on if there is a
          // child with the comparable property

          // check all children for an unordered property
          for (let child of dependencyValues.stringMathTextBooleanChildren) {
            if (child.stateValues.unordered) {
              unorderedCompare = true;
            }
          }

          dependencyValues = Object.assign({}, dependencyValues);
          dependencyValues.mathListChildrenByCode = {};
          dependencyValues.textListChildrenByCode = {};
          dependencyValues.booleanListChildrenByCode = {};

          let fractionSatisfied = evaluateLogic({
            logicTree: dependencyValues.parsedExpression.tree,
            unorderedCompare: unorderedCompare,
            dependencyValues,
            valueOnInvalid: NaN,
          });

          // fractionSatisfied will be either 0 or 1 as have not
          // specified matchPartial

          return { newValues: { value: fractionSatisfied } }

        }
      },
      set: function (value) {
        // this function is called when
        // - definition is overridden by a ref prop
        // - when processing new state variable values
        //   (which could be from outside sources)
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
      inverseDefinition: function ({ desiredStateVariableValues,
        dependencyValues, stateValues, overrideFixed,
      }) {


        if (!stateValues.canBeModified && !overrideFixed) {
          return { success: false };
        }

        let desiredValue = desiredStateVariableValues.value;
        if (desiredValue instanceof me.class) {
          desiredValue = desiredValue.evaluate_to_constant();
          if (!Number.isFinite(desiredValue)) {
            desiredValue = NaN;
          }
        } else {
          desiredValue = Number(desiredValue);
        }

        if (!dependencyValues.singleNumberOrStringChild) {
          // invert only if have just a single math child
          if (dependencyValues.singleMathChild) {
            return {
              success: true,
              instructions: [{
                setDependency: "stringMathTextBooleanChildren",
                desiredValue: me.fromAst(desiredValue),
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
              setStateVariable: "value",
              value: desiredValue,
            }];
          } else {
            // TODO: would it be more efficient to defer setting value of string?
            instructions = [{
              setDependency: "stringChild",
              desiredValue: desiredValue.toString(),
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
      forRenderer: true,
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
          value: dependencyValues.value,
          dependencyValues, usedDefault
        });

        if (rounded instanceof me.class) {
          rounded = rounded.tree;
        }

        return {
          newValues: {
            valueForDisplay: rounded
          }
        }
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
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { text: dependencyValues.valueForDisplay.toString() } };
      }
    }

    stateVariableDefinitions.math = mathStateVariableFromNumberStateVariable({
      numberVariableName: "value",
      mathVariableName: "math",
      isPublic: true
    });


    stateVariableDefinitions.canBeModified = {
      returnDependencies: () => ({
        numberChildModifiable: {
          dependencyType: "child",
          childLogicName: "atLeastZeroNumbers",
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
          return { newValues: { canBeModified: false } };
        }

        if (dependencyValues.numberChildModifiable.length === 1 &&
          !dependencyValues.numberChildModifiable[0].stateValues.canBeModified) {
          return { newValues: { canBeModified: false } };
        }

        return { newValues: { canBeModified: true } };

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


  static adapters = ["math", "text"];

}
