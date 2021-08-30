import InlineComponent from './abstract/InlineComponent.js';

export default class Choice extends InlineComponent {
  static componentType = "choice";
  static rendererType = "container";
  static renderChildren = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
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
      componentType: "text",
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
          if (typeof child.stateValues.text === "string") {
            text += child.stateValues.text;
          }
        }
        return { newValues: { text } }
      }
    }


    stateVariableDefinitions.selected = {
      defaultValue: false,
      public: true,
      componentType: "boolean",
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

        let selected = dependencyValues.childIndicesSelected.includes(
          dependencyValues.countAmongSiblings
        );

        return { newValues: { selected } }

      },
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "selected",
            value: desiredStateVariableValues.selected
          }]
        };
      }
    }


    stateVariableDefinitions.submitted = {
      defaultValue: false,
      public: true,
      componentType: "boolean",
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          submitted: {
            variablesToCheck: ["submitted"]
          }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "submitted",
            value: desiredStateVariableValues.submitted
          }]
        };
      }
    }


    stateVariableDefinitions.feedbacks = {
      public: true,
      componentType: "feedbacktext",
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
        feedbackDefinitions: {
          dependencyType: "parentStateVariable",
          variableName: "feedbackDefinitions"
        },
        submitted: {
          dependencyType: "stateVariable",
          variableName: "submitted"
        }
      }),
      definition({ dependencyValues }) {

        if (!dependencyValues.submitted) {
          return { newValues: { feedbacks: [] } }
        }

        let feedbacks = [];

        for (let feedbackCode of dependencyValues.feedbackCodes) {
          let code = feedbackCode.toLowerCase();
          for (let feedbackDefinition of dependencyValues.feedbackDefinitions) {
            if (code === feedbackDefinition.feedbackCode) {
              feedbacks.push(feedbackDefinition.feedbackText);
              break;  // just take first match
            }
          }
        }

        if (dependencyValues.feedbackText !== null) {
          feedbacks.push(dependencyValues.feedbackText);
        }

        return { newValues: { feedbacks } }

      }
    };

    return stateVariableDefinitions;
  }


  static includeBlankStringChildren = true;

  static adapters = ["submitted"];

}