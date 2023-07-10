import { textFromChildren } from "../utils/text";
import InlineComponent from "./abstract/InlineComponent";
import me from "math-expressions";

export default class Choice extends InlineComponent {
  static componentType = "choice";
  static rendererType = "containerInline";
  static renderChildren = true;

  static variableForPlainMacro = "submitted";
  static variableForPlainCopy = "submitted";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.credit = {
      createComponentOfType: "number",
      createStateVariable: "credit",
      defaultValue: 0,
      public: true,
      attributesForCreatedComponent: { convertBoolean: true },
    };
    attributes.feedbackCodes = {
      createComponentOfType: "textList",
      createStateVariable: "feedbackCodes",
      defaultValue: [],
      public: true,
    };
    attributes.feedbackText = {
      createComponentOfType: "text",
      createStateVariable: "feedbackText",
      defaultValue: null,
      public: true,
    };
    attributes.preSelect = {
      createComponentOfType: "boolean",
      createStateVariable: "preSelect",
      defaultValue: false,
    };

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "children",
        componentTypes: ["_base"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "child",
          childGroups: ["children"],
          variableNames: ["text"],
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        let text = textFromChildren(dependencyValues.inlineChildren);

        return { setValue: { text } };
      },
    };

    stateVariableDefinitions.math = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
      },
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "child",
          childGroups: ["children"],
          variableNames: ["value", "latex"],
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        let math = null;

        if (dependencyValues.inlineChildren.length === 1) {
          let child = dependencyValues.inlineChildren[0];
          if (typeof child === "object") {
            let value = child.stateValues.value;
            if (value instanceof me.class) {
              math = value;
            } else if (typeof value === "number") {
              math = me.fromAst(value);
            } else if (typeof child.stateValues.latex === "string") {
              try {
                math = me.fromLatex(child.stateValues.latex);
              } catch (e) {}
            }
          }
        }

        return { setValue: { math } };
      },
    };

    stateVariableDefinitions.selected = {
      defaultValue: false,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({
        countAmongSiblings: {
          dependencyType: "countAmongSiblings",
          sameType: true,
        },
        childIndicesSelected: {
          dependencyType: "parentStateVariable",
          parentComponentType: "choiceInput",
          variableName: "childIndicesSelected",
        },
        // Note: existence of primary shadow means that the choice is inside a shuffle or sort
        // and the replacement from the shuffle/sort is the primary shadow (and the only one visible to parent)
        primaryShadow: {
          dependencyType: "primaryShadow",
          variableNames: ["selected"],
        },
      }),
      definition({ dependencyValues, componentName }) {
        let selected;
        if (dependencyValues.childIndicesSelected) {
          selected = dependencyValues.childIndicesSelected.includes(
            dependencyValues.countAmongSiblings,
          );
        } else if (dependencyValues.primaryShadow) {
          selected = dependencyValues.primaryShadow.stateValues.selected;
        } else {
          selected = false;
        }

        return { setValue: { selected } };
      },
    };

    stateVariableDefinitions.submitted = {
      defaultValue: false,
      hasEssential: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      doNotShadowEssential: true,
      returnDependencies: () => ({
        // Note: existence of primary shadow means that the choice is inside a shuffle or sort
        // and the replacement from the shuffle/sort is the primary shadow (and the only one visible to parent)
        primaryShadow: {
          dependencyType: "primaryShadow",
          variableNames: ["submitted"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.primaryShadow) {
          return {
            setValue: {
              submitted: dependencyValues.primaryShadow.stateValues.submitted,
            },
          };
        } else
          return {
            useEssentialOrDefaultValue: {
              submitted: true,
            },
          };
      },
      inverseDefinition: function ({
        desiredStateVariableValues,
        dependencyValues,
      }) {
        if (dependencyValues.primaryShadow) {
          // if have a primary shadow, then inversee definition should never be called
          // as it will be called only on the shadow
          return { success: false };
        } else {
          return {
            success: true,
            instructions: [
              {
                setEssentialValue: "submitted",
                value: desiredStateVariableValues.submitted,
              },
            ],
          };
        }
      },
    };

    stateVariableDefinitions.feedbacks = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "feedbacktext",
      },
      // isArray: true,
      // entireArrayAtOnce: true,
      // entryPrefixes: ['feedback'],
      returnDependencies: () => ({
        feedbackText: {
          dependencyType: "stateVariable",
          variableName: "feedbackText",
        },
        feedbackCodes: {
          dependencyType: "stateVariable",
          variableName: "feedbackCodes",
        },
        feedbackDefinitionAncestor: {
          dependencyType: "ancestor",
          variableNames: ["feedbackDefinitions"],
        },
        submitted: {
          dependencyType: "stateVariable",
          variableName: "submitted",
        },
      }),
      definition({ dependencyValues }) {
        if (!dependencyValues.submitted) {
          return { setValue: { feedbacks: [] } };
        }

        let feedbacks = [];

        let feedbackDefinitions =
          dependencyValues.feedbackDefinitionAncestor.stateValues
            .feedbackDefinitions;

        for (let feedbackCode of dependencyValues.feedbackCodes) {
          let code = feedbackCode.toLowerCase();
          let feedbackText = feedbackDefinitions[code];
          if (feedbackText) {
            feedbacks.push(feedbackText);
          }
        }

        if (dependencyValues.feedbackText !== null) {
          feedbacks.push(dependencyValues.feedbackText);
        }

        return { setValue: { feedbacks } };
      },
    };

    return stateVariableDefinitions;
  }

  static includeBlankStringChildren = true;

  static adapters = ["text", "math"];
}
