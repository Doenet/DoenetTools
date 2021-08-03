import InlineComponent from './abstract/InlineComponent';
import { evaluateLogic, buildParsedExpression } from '../utils/booleanLogic';


export default class BooleanComponent extends InlineComponent {
  static componentType = "boolean";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["value"] };

  static descendantCompositesMustHaveAReplacement = true;
  static descendantCompositesDefaultReplacementType = "math";


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.symbolicEquality = {
      createComponentOfType: "boolean",
      createStateVariable: "symbolicEquality",
      defaultValue: false,
      public: true,
      ignorePropagationFromAncestors: true,
    };
    attributes.expandOnCompare = {
      createComponentOfType: "boolean",
      createStateVariable: "expandOnCompare",
      defaultValue: false,
      public: true,
      ignorePropagationFromAncestors: true,
    };
    attributes.simplifyOnCompare = {
      createComponentOfType: "text",
      createStateVariable: "simplifyOnCompare",
      defaultValue: "none",
      toLowerCase: true,
      valueTransformations: { "": "full", "true": "full" },
      validValues: ["none", "full", "numbers", "numbersepreserveorder"],
      public: true,
      ignorePropagationFromAncestors: true,
    };
    attributes.unorderedCompare = {
      createComponentOfType: "boolean",
      createStateVariable: "unorderedCompare",
      defaultValue: false,
      public: true,
      ignorePropagationFromAncestors: true,
    };
    attributes.allowedErrorInNumbers = {
      createComponentOfType: "number",
      createStateVariable: "allowedErrorInNumbers",
      defaultValue: 0,
      public: true,
      ignorePropagationFromAncestors: true,
    };
    attributes.includeErrorInNumberExponents = {
      createComponentOfType: "boolean",
      createStateVariable: "includeErrorInNumberExponents",
      defaultValue: false,
      public: true,
      ignorePropagationFromAncestors: true,
    };
    attributes.allowedErrorIsAbsolute = {
      createComponentOfType: "boolean",
      createStateVariable: "allowedErrorIsAbsolute",
      defaultValue: false,
      public: true,
      ignorePropagationFromAncestors: true,
    };
    attributes.nSignErrorsMatched = {
      createComponentOfType: "number",
      createStateVariable: "nSignErrorsMatched",
      defaultValue: 0,
      public: true,
      ignorePropagationFromAncestors: true,
    };
    return attributes;
  }


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
      componentType: 'mathList',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroTexts = childLogic.newLeaf({
      name: "atLeastZeroTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroTextLists = childLogic.newLeaf({
      name: "atLeastZeroTextLists",
      componentType: 'textList',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroBooleans = childLogic.newLeaf({
      name: "atLeastZeroBooleans",
      componentType: "boolean",
      comparison: "atLeast",
      number: 0,
    });

    let atLeastZeroBooleanLists = childLogic.newLeaf({
      name: "atLeastZeroBooleanLists",
      componentType: 'booleanList',
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
        atLeastZeroTextLists,
        atLeastZeroBooleans,
        atLeastZeroBooleanLists,
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
        "mathListChildrenByCode",
        "textChildrenByCode", "textListChildrenByCode",
        "booleanChildrenByCode", "booleanListChildrenByCode",
      ],
      returnDependencies: () => ({
        stringMathTextBooleanChildren: {
          dependencyType: "child",
          childLogicName: "stringsMathsTextsAndBooleans",
          variableNames: ["value", "texts", "maths", "booleans", "fractionSatisfied", "unordered"],
          variablesOptional: true,
        },
        codePre: {
          dependencyType: "stateVariable",
          variableName: "codePre"
        }
      }),
      definition({ dependencyValues, componentInfoObjects }) {

        let mathChildrenByCode = {};
        let mathListChildrenByCode = {};
        let textChildrenByCode = {};
        let textListChildrenByCode = {};
        let booleanChildrenByCode = {};
        let booleanListChildrenByCode = {};
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
              baseComponentType: "mathList"
            })) {
              mathListChildrenByCode[code] = child;
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "text"
            })) {
              textChildrenByCode[code] = child;
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "textList"
            })) {
              textListChildrenByCode[code] = child;
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "boolean"
            })) {
              booleanChildrenByCode[code] = child;
            } else {
              booleanListChildrenByCode[code] = child;
            }
            subnum += 1;

          }
        }

        return {
          newValues: {
            mathChildrenByCode, mathListChildrenByCode,
            textChildrenByCode, textListChildrenByCode,
            booleanChildrenByCode, booleanListChildrenByCode,
          }
        }
      }

    }


    stateVariableDefinitions.value = {
      public: true,
      componentType: "boolean",
      forRenderer: true,
      defaultValue: false,
      set: Boolean,
      returnDependencies: () => ({
        symbolicEquality: {
          dependencyType: "stateVariable",
          variableName: "symbolicEquality",
        },
        expandOnCompare: {
          dependencyType: "stateVariable",
          variableName: "expandOnCompare",
        },
        simplifyOnCompare: {
          dependencyType: "stateVariable",
          variableName: "simplifyOnCompare",
        },
        unorderedCompare: {
          dependencyType: "stateVariable",
          variableName: "unorderedCompare",
        },
        allowedErrorInNumbers: {
          dependencyType: "stateVariable",
          variableName: "allowedErrorInNumbers",
        },
        includeErrorInNumberExponents: {
          dependencyType: "stateVariable",
          variableName: "includeErrorInNumberExponents",
        },
        allowedErrorIsAbsolute: {
          dependencyType: "stateVariable",
          variableName: "allowedErrorIsAbsolute",
        },
        nSignErrorsMatched: {
          dependencyType: "stateVariable",
          variableName: "nSignErrorsMatched",
        },
        parsedExpression: {
          dependencyType: "stateVariable",
          variableName: "parsedExpression",
        },
        stringMathTextBooleanChildren: {
          dependencyType: "child",
          childLogicName: "stringsMathsTextsAndBooleans",
          variableNames: ["value"],
          variablesOptional: true,
        },
        booleanChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "booleanChildrenByCode",
        },
        booleanListChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "booleanListChildrenByCode",
        },
        textChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "textChildrenByCode",
        },
        textListChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "textListChildrenByCode",
        },
        mathChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "mathChildrenByCode",
        },
        mathListChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "mathListChildrenByCode",
        },
      }),
      definition({ dependencyValues, usedDefault }) {

        if (dependencyValues.stringMathTextBooleanChildren.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              value: { variablesToCheck: ["value"] }
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

        let canOverrideUnorderedCompare = usedDefault.unorderedCompare;

        let fractionSatisfied = evaluateLogic({
          logicTree: dependencyValues.parsedExpression.tree,
          canOverrideUnorderedCompare,
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
              value: Boolean(desiredStateVariableValues.value)
            }]
          };
        } else if (dependencyValues.stringMathTextBooleanChildren.length === 1) {

          let child = dependencyValues.stringMathTextBooleanChildren[0];
          if (child.componentType === "string") {
            return {
              success: true,
              instructions: [{
                setDependency: "stringMathTextBooleanChildren",
                desiredValue: desiredStateVariableValues.value,
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

  static adapters = ["text"];


}

