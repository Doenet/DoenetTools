import InlineComponent from './abstract/InlineComponent.js';

export default class Label extends InlineComponent {
  static componentType = "label";
  static renderChildren = true;
  static rendererType = "label";

  static includeBlankStringChildren = true;

  // used when creating new component via adapter or copy prop
  static primaryStateVariableForDefinition = "valueShadow";


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

    stateVariableDefinitions.valueShadow = {
      hasEssential: true,
      defaultValue: null,
      returnDependencies: () => ({}),
      definition() {
        return {
          useEssentialOrDefaultValue: { valueShadow: true }
        }
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "valueShadow",
            value: desiredStateVariableValues.valueShadow
          }]
        };
      }
    }

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
        forRenderer: true,
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
          variableNames: ["text", "latex", "value", "hasLatex", "renderAsMath"],
          variablesOptional: true,
        },
        valueShadow: {
          dependencyType: "stateVariable",
          variableName: "valueShadow"
        }
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.inlineChildren.length === 0 && dependencyValues.valueShadow) {
          let value = dependencyValues.valueShadow;
          let hasLatex = Boolean(/\\\(.*\\\)/.exec(value))
          let text = value;
          if (hasLatex) {
            text = text.replace(/\\\(/g, '')
            text = text.replace(/\\\)/g, '')
          }
          return { setValue: { text, latex: text, hasLatex, value } };
        }

        let text = "";
        let value = "";
        let hasLatex = false;
        for (let comp of dependencyValues.inlineChildren) {
          if (typeof comp !== "object") {
            let s = comp.toString()
            text += s;
            value += s;
          } else if (typeof comp.stateValues.hasLatex === "boolean"
            && typeof comp.stateValues.value === "string"
            && typeof comp.stateValues.text === "string"
          ) {
            // if component has a boolean hasLatex state variable
            // and value and text are strings
            // then use value, text, and hasLatex directly
            text += comp.stateValues.text;
            value += comp.stateValues.value;
            if (comp.stateValues.hasLatex) {
              hasLatex = true;
            }
          } else if (typeof comp.stateValues.renderAsMath === "boolean"
            && typeof comp.stateValues.latex === "string"
            && typeof comp.stateValues.text === "string"
          ) {
            // if have both latex and string,
            // use render as math, if exists, to decide which to use
            if (comp.stateValues.renderAsMath) {
              text += comp.stateValues.latex;
              value += "\\(" + comp.stateValues.latex + "\\)";
              hasLatex = true;
            } else {
              text += comp.stateValues.text;
              value += comp.stateValues.text;
            }
          } else if (typeof comp.stateValues.latex === "string") {
            text += comp.stateValues.latex;
            value += "\\(" + comp.stateValues.latex + "\\)";
            hasLatex = true;
          } else if (typeof comp.stateValues.text === "string") {
            text += comp.stateValues.text;
            value += comp.stateValues.text;
          }
        }

        return { setValue: { text, latex: text, hasLatex, value } };
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