import BlockComponent from './abstract/BlockComponent.js';

export default class P extends BlockComponent {
  static componentType = "p";
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
      componentType: "text",
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
          if (typeof child.stateValues.text === "string") {
            text += child.stateValues.text;
          } else {
            text += " ";
          }
        }

        return { newValues: { text } };
      }
    }

    return stateVariableDefinitions;

  }

}
