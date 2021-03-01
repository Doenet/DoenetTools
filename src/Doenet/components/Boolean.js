import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';
import { evaluateLogic, splitSymbolsIfMath } from '../utils/booleanLogic';

var textToAstUnsplit = new me.converters.textToAstObj({ splitSymbols: false });

export default class BooleanComponent extends InlineComponent {
  static componentType = "boolean";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["value"] };

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroStrings = childLogic.newLeaf({
      name: "atLeastZeroStrings",
      componentType: 'string',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroMaths = childLogic.newLeaf({
      name: "atLeastZeroMaths",
      componentType: 'math',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroMathLists = childLogic.newLeaf({
      name: "atLeastZeroMathLists",
      componentType: 'mathlist',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroTexts = childLogic.newLeaf({
      name: "atLeastZeroTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroTextlists = childLogic.newLeaf({
      name: "atLeastZeroTextlists",
      componentType: 'textlist',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroBooleans = childLogic.newLeaf({
      name: "atLeastZeroBooleans",
      componentType: "boolean",
      comparison: "atLeast",
      number: 0,
    });

    let atLeastZeroBooleanlists = childLogic.newLeaf({
      name: "atLeastZeroBooleanlists",
      componentType: 'booleanlist',
      comparison: 'atLeast',
      number: 0
    });

    childLogic.newOperator({
      name: "stringsMathsTextsAndBooleans",
      operator: "and",
      propositions: [
        atLeastZeroStrings,
        atLeastZeroMaths,
        atLeastZeroMathLists,
        atLeastZeroTexts,
        atLeastZeroTextlists,
        atLeastZeroBooleans,
        atLeastZeroBooleanlists,
      ],
      setAsBase: true
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.parsedExpression = {
      additionalStateVariablesDefined: [
        "codePre"
      ],
      returnDependencies: () => ({
        stringMathTextBooleanChildren: {
          dependencyType: "child",
          childLogicName: "stringsMathsTextsAndBooleans",
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
        "mathlistChildrenByCode",
        "textChildrenByCode", "textlistChildrenByCode",
        "booleanChildrenByCode", "booleanlistChildrenByCode",
      ],
      returnDependencies: () => ({
        stringMathTextBooleanChildren: {
          dependencyType: "child",
          childLogicName: "stringsMathsTextsAndBooleans",
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
        let mathlistChildrenByCode = {};
        let textChildrenByCode = {};
        let textlistChildrenByCode = {};
        let booleanChildrenByCode = {};
        let booleanlistChildrenByCode = {};
        let subnum = 0;

        let codePre = dependencyValues.codePre;

        for (let child of dependencyValues.stringMathTextBooleanChildren) {
          if (child.componentType !== "string") {
            // a math, mathlist, text, textlist, boolean, or booleanlist
            let code = codePre + subnum;

            if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "math"
            })) {
              mathChildrenByCode[code] = child;
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "mathlist"
            })) {
              mathlistChildrenByCode[code] = child;
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "text"
            })) {
              textChildrenByCode[code] = child;
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "textlist"
            })) {
              textlistChildrenByCode[code] = child;
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "boolean"
            })) {
              booleanChildrenByCode[code] = child;
            } else {
              booleanlistChildrenByCode[code] = child;
            }
            subnum += 1;

          }
        }

        return {
          newValues: {
            mathChildrenByCode, mathlistChildrenByCode,
            textChildrenByCode, textlistChildrenByCode,
            booleanChildrenByCode, booleanlistChildrenByCode,
          }
        }
      }

    }


    stateVariableDefinitions.value = {
      public: true,
      componentType: this.componentType,
      forRenderer: true,
      defaultValue: false,
      returnDependencies: () => ({
        parsedExpression: {
          dependencyType: "stateVariable",
          variableName: "parsedExpression",
        },
        stringMathTextBooleanChildren: {
          dependencyType: "child",
          childLogicName: "stringsMathsTextsAndBooleans",
          variableNames: ["value", "texts", "maths", "unordered"],
          variablesOptional: true,
        },
        mathChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroMaths",
          variableNames: ["value", "expand", "simplify"]
        },
        booleanChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "booleanChildrenByCode",
        },
        booleanlistChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "booleanlistChildrenByCode",
        },
        textChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "textChildrenByCode",
        },
        textlistChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "textlistChildrenByCode",
        },
        mathChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "mathChildrenByCode",
        },
        mathlistChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "mathlistChildrenByCode",
        },
      }),
      definition({ dependencyValues }) {

        if (dependencyValues.stringMathTextBooleanChildren.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              value: { variablesToCheck: ["value", "implicitValue"] }
            }
          }
        } else if (dependencyValues.parsedExpression === null) {
          // if don't have parsed expression
          // (which could occur if have invalid form)
          // return false
          return {
            newValues: { value: false }
          }
        }

        // evaluate logic in parsedExpression

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


        let fractionSatisfied = evaluateLogic({
          logicTree: dependencyValues.parsedExpression.tree,
          unorderedCompare: unorderedCompare,
          dependencyValues,
        });


        return {
          newValues: { value: fractionSatisfied === 1 }
        }

      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues, componentInfoObjects }) {
        if (dependencyValues.stringMathTextBooleanChildren.length === 0) {
          // no children, so value is essential and give it the desired value
          return {
            success: true,
            instructions: [{
              setStateVariable: "value",
              value: desiredStateVariableValues.value
            }]
          };
        } else if (dependencyValues.stringMathTextBooleanChildren.length === 1) {

          let child = dependencyValues.stringMathTextBooleanChildren[0];
          if (child.componentType === "string") {
            return {
              success: true,
              instructions: [{
                setDependency: "stringMathTextBooleanChildren",
                desiredValue: desiredStateVariableValues.value.toString(),
                childIndex: 0,
                variableIndex: 0,
              }]
            };

          } else if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "boolean"
          })) {

            return {
              success: true,
              instructions: [{
                setDependency: "stringMathTextBooleanChildren",
                desiredValue: desiredStateVariableValues.value,
                childIndex: 0,
                variableIndex: 0,
              }]
            };
          }
        }

        return { success: false };

      }
    };

    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { text: dependencyValues.value ? "true" : "false" } }
      }
    }

    return stateVariableDefinitions;

  }

}


function buildParsedExpression({ dependencyValues, componentInfoObjects }) {

  let codePre = "comp";

  // make sure that codePre is not in any string piece
  let foundInString = true;
  while (foundInString) {
    foundInString = false;

    for (let child of dependencyValues.stringChildren) {
      if (child.stateValues.value.includes(codePre)) {
        // found codePre in a string, so extend codePre and try again
        foundInString = true;
        codePre += "p";
        break;
      }
    }
  };

  let inputString = "";
  let subnum = 0;
  let nonMathCodes = [];
  let stringChildInd = 0;

  for (let child of dependencyValues.stringMathTextBooleanChildren) {
    if (child.componentType === "string") {
      // need to use stringChildren
      // as child variable doesn't have stateVariables
      inputString += " " + dependencyValues.stringChildren[stringChildInd].stateValues.value + " ";
      stringChildInd++;
    }
    else { // a math, mathlist, text, textlist, boolean, or booleanlist
      let code = codePre + subnum;

      // make sure code is surrounded by spaces
      // (the presence of numbers inside code will ensure that 
      // it is parsed as a multicharcter variable)
      inputString += " " + code + " ";

      if (!(
        componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: child.componentType,
          baseComponentType: "math"
        }) ||
        componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: child.componentType,
          baseComponentType: "mathlist"
        })
      )) {
        nonMathCodes.push(code);
      }

      subnum += 1;

    }
  }

  let parsedExpression = null;

  try {
    parsedExpression = me.fromAst(textToAstUnsplit.convert(inputString));
  } catch (e) {
  }

  if (parsedExpression) {
    parsedExpression = me.fromAst(splitSymbolsIfMath({
      logicTree: parsedExpression.tree,
      nonMathCodes,
    }));
  }


  return {
    newValues: {
      codePre, parsedExpression
    }
  }

}