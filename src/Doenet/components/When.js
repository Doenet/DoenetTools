import BooleanComponent from './Boolean';

import me from 'math-expressions';
import { evaluateLogic } from '../utils/booleanLogic';


export default class When extends BooleanComponent {
  static componentType = "when";
  static rendererType = undefined;

  static stateVariableForPropertyValue = "conditionSatisfied";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    // properties.defaultType = { default: "math" };
    properties.matchPartial = { default: false };
    properties.symbolicEquality = { default: false };
    properties.expandOnCompare = { default: false, propagateToDescendants: true };
    properties.simplifyOnCompare = {
      default: "none",
      toLowerCase: true,
      valueTransformations: { "": "full", "true": "full" },
      validValues: ["none", "full", "numbers", "numbersepreserveorder"],
      propagateToDescendants: true,
    };
    properties.unorderedCompare = { default: false, propagateToDescendants: true };
    properties.allowedErrorInNumbers = { default: 0 };
    properties.includeErrorInNumberExponents = { default: false };
    properties.allowedErrorIsAbsolute = { default: false };
    properties.nSignErrorsMatched = { default: 0 };
    return properties;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // conditional satisfied is just an alias to value
    stateVariableDefinitions.value = {
      additionalStateVariablesDefined: [
        "fractionSatisfied", "conditionSatisfied"
      ],
      returnDependencies: () => ({
        matchPartial: {
          dependencyType: "stateVariable",
          variableName: "matchPartial",
        },
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
      definition({ dependencyValues, usedDefault }) {

        // evaluate logic in parsedExpression and return fraction correct

        if (dependencyValues.parsedExpression === null) {
          // if don't have parsed expression
          // (which could occur if have no children or if have invalid form)
          // return false
          return {
            newValues: {
              conditionSatisfied: false,
              value: false,
              fractionSatisfied: 0,
            }
          }
        }


        let unorderedCompare = dependencyValues.unorderedCompare;
        let simplifyOnCompare = dependencyValues.simplifyOnCompare;
        let expandOnCompare = dependencyValues.expandOnCompare;

        let canOverrideUnorderedCompare = usedDefault.unorderedCompare;
        let canOverrideSimplifyOnCompare = usedDefault.simplifyOnCompare;
        let canOverrideExpandOnCompare = usedDefault.expandOnCompare;

        // if compare attributes haven't been explicitly prescribed by <when>
        // or one of its ancestors
        // then any of the attributes can be turned on if there is a
        // child with the comparable property

        // check all children for an unordered property
        for (let child of dependencyValues.stringMathTextBooleanChildren) {
          if (canOverrideUnorderedCompare && child.stateValues.unordered) {
            unorderedCompare = true;
          }
        }

        // check math children for additional properties
        for (let child of dependencyValues.mathChildren) {

          if (canOverrideExpandOnCompare && child.stateValues.expand) {
            expandOnCompare = true;
          }

          if (canOverrideSimplifyOnCompare) {
            if (child.stateValues.simplify === "full") {
              simplifyOnCompare = "full";
            } else if (child.stateValues.simplify === "numbers") {
              if (simplifyOnCompare !== "full") {
                simplifyOnCompare = "numbers";
              }
            } else if (child.stateValues.simplify === "numberspreserveorder") {
              if (simplifyOnCompare !== "full" && simplifyOnCompare !== "numbers") {
                simplifyOnCompare = "numberspreserveorder";
              }
            }
          }

        }

        let fractionSatisfied = evaluateLogic({
          logicTree: dependencyValues.parsedExpression.tree,
          unorderedCompare: unorderedCompare,
          simplifyOnCompare: simplifyOnCompare,
          expandOnCompare: expandOnCompare,
          dependencyValues,
        });

        let conditionSatisfied = fractionSatisfied === 1;

        return {
          newValues: { fractionSatisfied, conditionSatisfied, value: conditionSatisfied }
        }

      }
    };

    return stateVariableDefinitions;
  }

}

