import InlineComponent from './abstract/InlineComponent.js';

export default class AsList extends InlineComponent {
  static componentType = "asList";
  static renderChildren = true;

  static returnChildGroups() {

    return [{
      group: "inline",
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
          childGroups: ["inline"],
          variableNames: ["text"],
          variablesOptional: true,
        }
      }),
      definition: function ({ dependencyValues }) {

        let textpieces = [];
        for (let child of dependencyValues.inlineChildren) {
          if (typeof child !== "object") {
            textpieces.push(child.toString());
          } else if (typeof child.stateValues.text === "string") {
            textpieces.push(child.stateValues.text);
          } else {
            textpieces.push('');
          }
        }
        let text = textpieces.join(', ');

        return { setValue: { text } };
      }
    }

    return stateVariableDefinitions;
  }

}
