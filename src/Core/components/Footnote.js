import InlineComponent from './abstract/InlineComponent';

export default class Footnote extends InlineComponent {
  static componentType = "footnote";
  static renderChildren = true;

  static includeBlankStringChildren = true;


  static returnChildGroups() {

    return [{
      group: "inlines",
      componentTypes: ["_inline"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
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

        return { setValue: { text } };
      }
    }

    stateVariableDefinitions.footnoteTag = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      returnDependencies: () => ({
        footnoteCounter: {
          dependencyType: "counter",
          counterName: "footnote"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { footnoteTag: String(dependencyValues.footnoteCounter) }
        }
      }
    }

    return stateVariableDefinitions;

  }

}
