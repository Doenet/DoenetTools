import InlineComponent from './abstract/InlineComponent';

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
      shadowingInstructions: {
        createComponentOfType: "text",
      },
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

    stateVariableDefinitions.latex = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "child",
          childGroups: ["inline"],
          variableNames: ["text", "latex"],
          variablesOptional: true,
        }
      }),
      definition: function ({ dependencyValues }) {

        let latexpieces = [];
        for (let child of dependencyValues.inlineChildren) {
          if (typeof child !== "object") {
            latexpieces.push(child.toString());
          } else if (typeof child.stateValues.latex === "string") {
            latexpieces.push(child.stateValues.latex);
          } else if (typeof child.stateValues.text === "string") {
            latexpieces.push(child.stateValues.text);
          } else {
            latexpieces.push('');
          }
        }
        let latex = latexpieces.join(', ');

        return { setValue: { latex } };
      }
    }

    return stateVariableDefinitions;
  }

}
