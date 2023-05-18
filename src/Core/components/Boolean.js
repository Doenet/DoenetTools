import InlineComponent from "./abstract/InlineComponent";
import { evaluateLogic, buildParsedExpression } from "../utils/booleanLogic";

export default class BooleanComponent extends InlineComponent {
  static componentType = "boolean";

  static variableForPlainMacro = "value";
  static plainMacroReturnsSameType = true;

  static descendantCompositesMustHaveAReplacement = true;
  static descendantCompositesDefaultReplacementType = "math";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.symbolicEquality = {
      createComponentOfType: "boolean",
      createStateVariable: "symbolicEquality",
      defaultValue: false,
      public: true,
    };
    attributes.expandOnCompare = {
      createComponentOfType: "boolean",
      createStateVariable: "expandOnCompare",
      defaultValue: false,
      public: true,
    };
    attributes.simplifyOnCompare = {
      createComponentOfType: "text",
      createStateVariable: "simplifyOnCompare",
      defaultValue: "none",
      toLowerCase: true,
      valueTransformations: { "": "full", true: "full", false: "none" },
      validValues: ["none", "full", "numbers", "numberspreserveorder"],
      public: true,
    };
    attributes.unorderedCompare = {
      createComponentOfType: "boolean",
      createStateVariable: "unorderedCompare",
      defaultValue: false,
      public: true,
    };
    attributes.matchByExactPositions = {
      createComponentOfType: "boolean",
      createStateVariable: "matchByExactPositions",
      defaultValue: false,
      public: true,
    };
    attributes.allowedErrorInNumbers = {
      createComponentOfType: "number",
      createStateVariable: "allowedErrorInNumbers",
      defaultValue: 0,
      public: true,
    };
    attributes.includeErrorInNumberExponents = {
      createComponentOfType: "boolean",
      createStateVariable: "includeErrorInNumberExponents",
      defaultValue: false,
      public: true,
    };
    attributes.allowedErrorIsAbsolute = {
      createComponentOfType: "boolean",
      createStateVariable: "allowedErrorIsAbsolute",
      defaultValue: false,
      public: true,
    };
    attributes.numSignErrorsMatched = {
      createComponentOfType: "number",
      createStateVariable: "numSignErrorsMatched",
      defaultValue: 0,
      public: true,
    };
    attributes.numPeriodicSetMatchesRequired = {
      createComponentOfType: "integer",
      createStateVariable: "numPeriodicSetMatchesRequired",
      defaultValue: 3,
      public: true,
    };
    attributes.caseInsensitiveMatch = {
      createComponentOfType: "boolean",
      createStateVariable: "caseInsensitiveMatch",
      defaultValue: false,
      public: true,
    };
    attributes.matchBlanks = {
      createComponentOfType: "boolean",
      createStateVariable: "matchBlanks",
      defaultValue: false,
      public: true,
    };
    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "strings",
        componentTypes: ["string"],
      },
      {
        group: "comparableTypes",
        componentTypes: [
          "math",
          "mathList",
          "number",
          "numberList",
          "text",
          "textList",
          "boolean",
          "booleanList",
          "orbitalDiagram",
        ],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.parsedExpression = {
      additionalStateVariablesDefined: ["codePre"],
      returnDependencies: () => ({
        allChildren: {
          dependencyType: "child",
          childGroups: ["strings", "comparableTypes"],
        },
        stringChildren: {
          dependencyType: "child",
          childGroups: ["strings"],
          variableNames: ["value"],
        },
      }),
      definition: buildParsedExpression,
    };

    stateVariableDefinitions.mathChildrenByCode = {
      additionalStateVariablesDefined: [
        "mathListChildrenByCode",
        "numberChildrenByCode",
        "numberListChildrenByCode",
        "textChildrenByCode",
        "textListChildrenByCode",
        "booleanChildrenByCode",
        "booleanListChildrenByCode",
        "otherChildrenByCode",
      ],
      returnDependencies: () => ({
        allChildren: {
          dependencyType: "child",
          childGroups: ["strings", "comparableTypes"],
          variableNames: [
            "value",
            "texts",
            "maths",
            "numbers",
            "booleans",
            "fractionSatisfied",
            "unordered",
          ],
          variablesOptional: true,
        },
        codePre: {
          dependencyType: "stateVariable",
          variableName: "codePre",
        },
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        let mathChildrenByCode = {};
        let mathListChildrenByCode = {};
        let numberChildrenByCode = {};
        let numberListChildrenByCode = {};
        let textChildrenByCode = {};
        let textListChildrenByCode = {};
        let booleanChildrenByCode = {};
        let booleanListChildrenByCode = {};
        let otherChildrenByCode = {};
        let subnum = 0;

        let codePre = dependencyValues.codePre;

        for (let child of dependencyValues.allChildren) {
          if (typeof child !== "string") {
            // a math, mathList, text, textList, boolean, or booleanList
            let code = codePre + subnum;

            if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "math",
              })
            ) {
              mathChildrenByCode[code] = child;
            } else if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "mathList",
              })
            ) {
              mathListChildrenByCode[code] = child;
            } else if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "number",
              })
            ) {
              numberChildrenByCode[code] = child;
            } else if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "numberList",
              })
            ) {
              numberListChildrenByCode[code] = child;
            } else if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "text",
              })
            ) {
              textChildrenByCode[code] = child;
            } else if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "textList",
              })
            ) {
              textListChildrenByCode[code] = child;
            } else if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "boolean",
              })
            ) {
              booleanChildrenByCode[code] = child;
            } else if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "booleanList",
              })
            ) {
              booleanListChildrenByCode[code] = child;
            } else {
              otherChildrenByCode[code] = child;
            }
            subnum += 1;
          }
        }

        return {
          setValue: {
            mathChildrenByCode,
            mathListChildrenByCode,
            numberChildrenByCode,
            numberListChildrenByCode,
            textChildrenByCode,
            textListChildrenByCode,
            booleanChildrenByCode,
            booleanListChildrenByCode,
            otherChildrenByCode,
          },
        };
      },
    };

    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: this.componentType,
        attributesToShadow: ["fixed"],
      },
      forRenderer: true,
      hasEssential: true,
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
        allChildren: {
          dependencyType: "child",
          childGroups: ["strings", "comparableTypes"],
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
        if (dependencyValues.allChildren.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              value: true,
            },
          };
        } else if (dependencyValues.parsedExpression === null) {
          // if don't have parsed expression
          // (which could occur if have invalid form)
          // return false
          return {
            setValue: { value: false },
          };
        }

        // evaluate logic in parsedExpression

        let canOverrideUnorderedCompare = usedDefault.unorderedCompare;

        let fractionSatisfied = evaluateLogic({
          logicTree: dependencyValues.parsedExpression.tree,
          canOverrideUnorderedCompare,
          dependencyValues,
        });

        return {
          setValue: { value: fractionSatisfied === 1 },
        };
      },
      inverseDefinition: function ({
        desiredStateVariableValues,
        dependencyValues,
        componentInfoObjects,
      }) {
        if (dependencyValues.allChildren.length === 0) {
          return {
            success: true,
            instructions: [
              {
                setEssentialValue: "value",
                value: Boolean(desiredStateVariableValues.value),
              },
            ],
          };
        } else if (dependencyValues.allChildren.length === 1) {
          let child = dependencyValues.allChildren[0];
          if (typeof child === "string") {
            return {
              success: true,
              instructions: [
                {
                  setDependency: "allChildren",
                  desiredValue: desiredStateVariableValues.value.toString(),
                  childIndex: 0,
                  variableIndex: 0,
                },
              ],
            };
          } else if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "boolean",
            })
          ) {
            return {
              success: true,
              instructions: [
                {
                  setDependency: "allChildren",
                  desiredValue: desiredStateVariableValues.value,
                  childIndex: 0,
                  variableIndex: 0,
                },
              ],
            };
          }
        }

        return { success: false };
      },
    };

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: { text: dependencyValues.value ? "true" : "false" },
        };
      },
      inverseDefinition({ desiredStateVariableValues }) {
        let desiredText = String(desiredStateVariableValues.text).toLowerCase();

        let desiredBoolean;
        if (desiredText === "true") {
          desiredBoolean = true;
        } else if (desiredText === "false") {
          desiredBoolean = false;
        }

        if (desiredBoolean !== undefined) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "value",
                desiredValue: desiredBoolean,
              },
            ],
          };
        } else {
          return { success: false };
        }
      },
    };

    return stateVariableDefinitions;
  }

  static adapters = ["text"];
}
