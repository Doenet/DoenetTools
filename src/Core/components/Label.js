import InlineComponent from './abstract/InlineComponent';

export default class Label extends InlineComponent {
  static componentType = "label";
  static renderChildren = true;
  static rendererType = "container";

  static includeBlankStringChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.forTarget = {
      createPrimitiveOfType: "string",
      createStateVariable: "forTarget",
      defaultValue: null,
      public: true,
    }

    return attributes;
  }

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
        variableName: "hasLatex",
        public: true,
        shadowingInstructions: {
          createComponentOfType: "boolean"
        },
      }, {
        variableName: "value",
        public: true,
        forRenderer: true,
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
        let value = "";
        let hasLatex = false;
        for (let comp of dependencyValues.inlineChildren) {
          if (typeof comp !== "object") {
            let s = comp.toString()
            text += s;
            latex += s;
            value += s;
          } else if (typeof comp.stateValues.latex === "string") {
            text += comp.stateValues.latex;
            latex += comp.stateValues.latex;
            value += "\\(" + comp.stateValues.latex + "\\)";
            hasLatex = true;
          } else if (typeof comp.stateValues.text === "string") {
            text += comp.stateValues.text;
            latex += comp.stateValues.text;
            value += comp.stateValues.text;
          }
        }

        return { setValue: { text, latex, hasLatex, value } };
      }
    }

    stateVariableDefinitions.forTargetComponentName = {
      stateVariablesDeterminingDependencies: ["forTarget"],
      returnDependencies: ({ stateValues }) => ({
        forTargetComponentName: {
          dependencyType: "expandTargetName",
          target: stateValues.forTarget
        }
      }),
      definition({ dependencyValues }) {
        return { setValue: { forTargetComponentName: dependencyValues.forTargetComponentName } }
      }

    }

    return stateVariableDefinitions;

  }



}