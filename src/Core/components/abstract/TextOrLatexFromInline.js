import InlineComponent from './InlineComponent';

export default class TextOrLatexFromInline extends InlineComponent {
  static componentType = "_textOrLatexFromInline";
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
        createComponentOfType: "text"
      },
      additionalStateVariablesDefined: [{
        variableName: "latex",
        public: true,
        shadowingInstructions: {
          createComponentOfType: "text"
        },
      }, {
        variableName: "isLatex",
        public: true,
        shadowingInstructions: {
          createComponentOfType: "boolean"
        },
      }, {
        variableName: "value",
        public: true,
        shadowingInstructions: {
          createComponentOfType: "text"
        },
      }],
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "child",
          childGroups: ["inlines"],
          variableNames: ["text", "latex"],
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        let text = "";
        let latex = "";
        let nLatex = 0;
        let nNonLatex = 0;
        for (let comp of dependencyValues.inlineChildren) {
          if (typeof comp !== "object") {
            let s = comp.toString()
            text += s;
            latex += s;
            nNonLatex++;
          } else if (typeof comp.stateValues.latex === "string") {
            text += comp.stateValues.latex;
            latex += comp.stateValues.latex;
            nLatex++;
          } else if (typeof comp.stateValues.text === "string") {
            text += comp.stateValues.text;
            latex += comp.stateValues.text;
            nNonLatex++;
          }
        }

        let isLatex = nLatex > 0 && nNonLatex === 0;

        let value = isLatex ? latex : text;

        return { setValue: { text, latex, isLatex, value } };
      }
    }

    return stateVariableDefinitions;

  }



}