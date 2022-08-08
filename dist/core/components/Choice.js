import InlineComponent from './abstract/InlineComponent.js';

export default class Choice extends InlineComponent {
  static componentType = "choice";
  static rendererType = "containerInline";
  static renderChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.credit = {
      createComponentOfType: "number",
      createStateVariable: "credit",
      defaultValue: 0,
      public: true,
      attributesForCreatedComponent: { convertBoolean: true }
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

    return [{
      group: "children",
      componentTypes: ["_base"]
    }]

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
          variablesOptional: true
        }
      }),
      definition: function ({ dependencyValues }) {
        let text = "";
        for (let child of dependencyValues.inlineChildren) {
          if (typeof child !== "object") {
            text += child.toString();
          } else if (typeof child.stateValues.text === "string") {
            text += child.stateValues.text;
          }
        }
        return { setValue: { text } }
      }
    }


    stateVariableDefinitions.selected = {
      defaultValue: false,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({
        countAmongSiblings: {
          dependencyType: "countAmongSiblingsOfSameType"
        },
        childIndicesSelected: {
          dependencyType: "parentStateVariable",
          variableName: "childIndicesSelected"
        }
      }),
      definition({ dependencyValues }) {

        let selected
        if (dependencyValues.childIndicesSelected) {
          selected = dependencyValues.childIndicesSelected.includes(
            dependencyValues.countAmongSiblings
          );
        } else {
          selected = false;
        }

        return { setValue: { selected } }

      },
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "selected",
            value: desiredStateVariableValues.selected
          }]
        };
      }
    }


    stateVariableDefinitions.submitted = {
      defaultValue: false,
      hasEssential: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          submitted: true
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "submitted",
            value: desiredStateVariableValues.submitted
          }]
        };
      }
    }


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
          variableNames: ["feedbackDefinitions"]
        },
        submitted: {
          dependencyType: "stateVariable",
          variableName: "submitted"
        }
      }),
      definition({ dependencyValues }) {

        if (!dependencyValues.submitted) {
          return { setValue: { feedbacks: [] } }
        }

        let feedbacks = [];

        let feedbackDefinitions = dependencyValues.feedbackDefinitionAncestor.stateValues.feedbackDefinitions;

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

        return { setValue: { feedbacks } }

      }
    };

    return stateVariableDefinitions;
  }


  static includeBlankStringChildren = true;

  static adapters = ["submitted"];

}