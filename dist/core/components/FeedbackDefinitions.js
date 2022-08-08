import BaseComponent from './abstract/BaseComponent.js';

export class FeedbackDefinition extends BaseComponent {
  static componentType = "feedbackDefinition";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.code = {
      createComponentOfType: "text",
    };
    attributes.text = {
      createComponentOfType: "text",
    };
    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.feedbackDefinition = {
      returnDependencies: () => ({
        codeAttr: {
          dependencyType: "attributeComponent",
          attributeName: "code",
          variableNames: ["value"]
        },
        textAttr: {
          dependencyType: "attributeComponent",
          attributeName: "text",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.codeAttr !== null && dependencyValues.textAttr !== null) {
          let code = dependencyValues.codeAttr.stateValues.value.toLowerCase();
          return {
            setValue: {
              feedbackDefinition: { [code]: dependencyValues.textAttr.stateValues.value }
            }
          }
        } else {
          return {
            setValue: { feedbackDefinition: null }
          }
        }
      }
    }


    return stateVariableDefinitions;

  }

}


export class FeedbackDefinitions extends BaseComponent {
  static componentType = "feedbackDefinitions";
  static rendererType = undefined;

  static returnChildGroups() {

    return [{
      group: "feedbackDefinition",
      componentTypes: ["feedbackDefinition"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      returnDependencies: () => ({
        feedbackDefinitionChildren: {
          dependencyType: "child",
          childGroups: ["feedbackDefinition"],
          variableNames: ["feedbackDefinition"],
        },
      }),
      definition({ dependencyValues }) {

        let value = {};

        for (let child of dependencyValues.feedbackDefinitionChildren) {
          if(child.stateValues.feedbackDefinition) {
            Object.assign(value, child.stateValues.feedbackDefinition)
          }
        }

        return { setValue: { value } }
      }
    }

    return stateVariableDefinitions;

  }

}
