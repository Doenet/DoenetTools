import InlineComponent from './InlineComponent';

export default class InlineRenderInlineChildren extends InlineComponent {
  static componentType = "_inlineRenderInlineChildren";
  static renderChildren = true;
  static includeBlankStringChildren = true;

  static beginTextDelimiter = "";
  static endTextDelimiter = "";

  static returnChildGroups() {

    return [{
      group: "inlines",
      componentTypes: ["_inline"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let componentClass = this;

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "child",
          childGroups: ["inlines"],
          variableNames: ["text"],
          variablesOptional: true,
        }
      }),
      definition: function ({ dependencyValues }) {

        let text = ""
        for (let child of dependencyValues.inlineChildren) {
          if (typeof child !== "object") {
            text += child.toString();
          } else if (typeof child.stateValues.text === "string") {
            text += child.stateValues.text;
          } else {
            text += " ";
          }
        }

        text = componentClass.beginTextDelimiter + text + componentClass.endTextDelimiter;

        return { setValue: { text } };
      }
    }

    return stateVariableDefinitions;

  }

}