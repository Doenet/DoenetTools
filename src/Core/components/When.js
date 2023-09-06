import BooleanComponent from "./Boolean";

import { evaluateLogic } from "../utils/booleanLogic";

export default class When extends BooleanComponent {
  static componentType = "when";
  static rendererType = undefined;

  static inSchemaOnlyInheritAs = [];

  static stateVariableToBeShadowed = "conditionSatisfied";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.matchPartial = {
      createComponentOfType: "boolean",
      createStateVariable: "matchPartial",
      defaultValue: false,
      public: true,
      fallBackToParentStateVariable: "matchPartial",
    };

    for (let attrName of [
      "symbolicEquality",
      "expandOnCompare",
      "simplifyOnCompare",
      "unorderedCompare",
      "matchByExactPositions",
      "allowedErrorInNumbers",
      "includeErrorInNumberExponents",
      "allowedErrorIsAbsolute",
      "numSignErrorsMatched",
      "numPeriodicSetMatchesRequired",
      "caseInsensitiveMatch",
      "matchBlanks",
    ]) {
      attributes[attrName].fallBackToParentStateVariable = attrName;
    }

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // condition satisfied is just an alias to value
    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      additionalStateVariablesDefined: [
        {
          variableName: "fractionSatisfied",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "number",
          },
        },
        {
          variableName: "conditionSatisfied",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "boolean",
          },
        },
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
        matchByExactPositions: {
          dependencyType: "stateVariable",
          variableName: "matchByExactPositions",
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
        numSignErrorsMatched: {
          dependencyType: "stateVariable",
          variableName: "numSignErrorsMatched",
        },
        numPeriodicSetMatchesRequired: {
          dependencyType: "stateVariable",
          variableName: "numPeriodicSetMatchesRequired",
        },
        caseInsensitiveMatch: {
          dependencyType: "stateVariable",
          variableName: "caseInsensitiveMatch",
        },
        matchBlanks: {
          dependencyType: "stateVariable",
          variableName: "matchBlanks",
        },
        parsedExpression: {
          dependencyType: "stateVariable",
          variableName: "parsedExpression",
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
        numberChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "numberChildrenByCode",
        },
        numberListChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "numberListChildrenByCode",
        },
        otherChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "otherChildrenByCode",
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        // evaluate logic in parsedExpression and return fraction correct

        if (dependencyValues.parsedExpression === null) {
          // if don't have parsed expression
          // (which could occur if have no children or if have invalid form)
          // return false
          return {
            setValue: {
              conditionSatisfied: false,
              value: false,
              fractionSatisfied: 0,
            },
          };
        }

        let canOverrideUnorderedCompare = usedDefault.unorderedCompare;

        let fractionSatisfied = evaluateLogic({
          logicTree: dependencyValues.parsedExpression.tree,
          canOverrideUnorderedCompare,
          dependencyValues,
        });

        let conditionSatisfied = fractionSatisfied === 1;

        return {
          setValue: {
            fractionSatisfied,
            conditionSatisfied,
            value: conditionSatisfied,
          },
        };
      },
    };

    return stateVariableDefinitions;
  }
}
