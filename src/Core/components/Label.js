import InlineComponent from './abstract/InlineComponent';
import { returnSelectedStyleStateVariableDefinition } from '../utils/style';
import me from 'math-expressions';

export default class Label extends InlineComponent {
  static componentType = "label";
  static renderChildren = true;
  static rendererType = "label";

  static includeBlankStringChildren = true;

  // used when creating new component via adapter or copy prop
  static primaryStateVariableForDefinition = "valueShadow";


  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.forObject = {
      createPrimitiveOfType: "string",
      createStateVariable: "forObject",
      defaultValue: null,
      public: true,
    }

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true
    };

    attributes.layer = {
      createComponentOfType: "number",
      createStateVariable: "layer",
      defaultValue: 0,
      public: true,
      forRenderer: true
    };

    attributes.anchor = {
      createComponentOfType: "point",
    }

    attributes.positionFromAnchor = {
      createComponentOfType: "text",
      createStateVariable: "positionFromAnchor",
      defaultValue: "center",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["upperright", "upperleft", "lowerright", "lowerleft", "top", "bottom", "left", "right", "center"]
    }

    attributes.styleNumber.defaultValue = 0;

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

    let selectedStyleDefinition = returnSelectedStyleStateVariableDefinition();

    Object.assign(stateVariableDefinitions, selectedStyleDefinition);

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

    stateVariableDefinitions.hasLatex = {
      public: true,
      forRenderer: true,
      shadowingInstructions: {
        createComponentOfType: "boolean"
      },
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

        if (dependencyValues.inlineChildren.length === 0 && dependencyValues.valueShadow !== null) {
          let value = dependencyValues.valueShadow;
          let hasLatex = Boolean(/\\\(.*\\\)/.exec(value))
          return { setValue: { hasLatex } };
        }

        let hasLatex = false;
        for (let comp of dependencyValues.inlineChildren) {
          if (typeof comp !== "object") {
          } else if (typeof comp.stateValues.hasLatex === "boolean"
            && typeof comp.stateValues.value === "string"
            && typeof comp.stateValues.text === "string"
          ) {
            // if component has a boolean hasLatex state variable
            // and value and text are strings
            // then use  hasLatex directly
            if (comp.stateValues.hasLatex) {
              return { setValue: { hasLatex: true } }
            }
          } else if (typeof comp.stateValues.renderAsMath === "boolean"
            && typeof comp.stateValues.latex === "string"
            && typeof comp.stateValues.text === "string"
          ) {
            // if have both latex and string,
            // use render as math, if exists, to decide which to use
            if (comp.stateValues.renderAsMath) {
              return { setValue: { hasLatex: true } }
            }
          } else if (typeof comp.stateValues.latex === "string") {
            return { setValue: { hasLatex: true } }
          }
        }

        return { setValue: { hasLatex } };
      },
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
        variableName: "value",
        public: true,
        forRenderer: true,
        shadowingInstructions: {
          createComponentOfType: "label",
          addStateVariablesShadowingStateVariables: {
            hasLatex: {
              stateVariableToShadow: "hasLatex",
            }
          },
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
        },
        hasLatex: {
          dependencyType: "stateVariable",
          variableName: "hasLatex"
        }
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.inlineChildren.length === 0 && dependencyValues.valueShadow !== null) {
          let value = dependencyValues.valueShadow;
          let text = value;
          if (dependencyValues.hasLatex) {
            text = text.replace(/\\\(/g, '')
            text = text.replace(/\\\)/g, '')
          }
          return { setValue: { text, latex: text, value } };
        }

        let text = "";
        let value = "";
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
          } else if (typeof comp.stateValues.renderAsMath === "boolean"
            && typeof comp.stateValues.latex === "string"
            && typeof comp.stateValues.text === "string"
          ) {
            // if have both latex and string,
            // use render as math, if exists, to decide which to use
            if (comp.stateValues.renderAsMath) {
              text += comp.stateValues.latex;
              value += "\\(" + comp.stateValues.latex + "\\)";
            } else {
              text += comp.stateValues.text;
              value += comp.stateValues.text;
            }
          } else if (typeof comp.stateValues.latex === "string") {
            text += comp.stateValues.latex;
            value += "\\(" + comp.stateValues.latex + "\\)";
          } else if (typeof comp.stateValues.text === "string") {
            text += comp.stateValues.text;
            value += comp.stateValues.text;
          }
        }

        return { setValue: { text, latex: text, value } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        // if specify desired value, text, or latex, use that to set value
        let desiredValue
        if (typeof desiredStateVariableValues.value === "string") {
          desiredValue = desiredStateVariableValues.value;
        } else if (typeof desiredStateVariableValues.text === "string") {
          desiredValue = desiredStateVariableValues.text;
        } else if (typeof desiredStateVariableValues.latex === "string") {
          desiredValue = desiredStateVariableValues.latex;
        } else {
          return { success: false }
        }

        if (dependencyValues.inlineChildren.length === 0 && dependencyValues.valueShadow !== null) {
          return {
            success: true,
            instructions: [{
              setDependency: "valueShadow",
              desiredValue
            }]
          }
        } else if (dependencyValues.inlineChildren.length === 1) {
          let comp = dependencyValues.inlineChildren[0];
          let desiredValue = desiredStateVariableValues.value;

          if (typeof comp !== "object") {
            return {
              success: true,
              instructions: [{
                setDependency: "inlineChildren",
                desiredValue,
                childIndex: 0
              }]
            }
          } else if (typeof comp.stateValues.hasLatex === "boolean"
            && typeof comp.stateValues.value === "string"
            && typeof comp.stateValues.text === "string"
          ) {
            // if child has a boolean hasLatex state variable
            // and value and text are strings
            // then set value directly

            return {
              success: true,
              instructions: [{
                setDependency: "inlineChildren",
                desiredValue,
                childIndex: 0,
                variableIndex: 2 // the variable "value"
              }]
            }

          } else if (typeof comp.stateValues.renderAsMath === "boolean"
            && typeof comp.stateValues.latex === "string"
            && typeof comp.stateValues.text === "string"
          ) {
            // if have both latex and string,
            // use render as math, if exists, to decide which to use
            if (comp.stateValues.renderAsMath) {
              // set the latex variable to the value, after remove the latex delimiters
              let match = desiredValue.match(/^\\\((.*)\\\)/)
              if (match) {
                desiredValue = match[1];
              }
              return {
                success: true,
                instructions: [{
                  setDependency: "inlineChildren",
                  desiredValue,
                  childIndex: 0,
                  variableIndex: 1  // the "latex" variable
                }]
              }
            } else {
              // set the text variable to the value
              return {
                success: true,
                instructions: [{
                  setDependency: "inlineChildren",
                  desiredValue,
                  childIndex: 0,
                  variableIndex: 0  // the "text" variable
                }]
              }
            }
          } else if (typeof comp.stateValues.latex === "string") {
            // set the latex variable to the value, after remove the latex delimiters
            let match = desiredValue.match(/^\\\((.*)\\\)/)
            if (match) {
              desiredValue = match[1];
            }
            return {
              success: true,
              instructions: [{
                setDependency: "inlineChildren",
                desiredValue,
                childIndex: 0,
                variableIndex: 1  // the "latex" variable
              }]
            }
          } else if (typeof comp.stateValues.text === "string") {
            // set the text variable to the value
            return {
              success: true,
              instructions: [{
                setDependency: "inlineChildren",
                desiredValue,
                childIndex: 0,
                variableIndex: 0  // the "text" variable
              }]
            }
          } else {
            return { success: false }
          }
        } else {
          // more than 1 inline child
          return { success: false }
        }
      }
    }

    stateVariableDefinitions.forObjectComponentName = {
      stateVariablesDeterminingDependencies: ["forObject"],
      returnDependencies: ({ stateValues }) => ({
        forObjectComponentName: {
          dependencyType: "expandTargetName",
          target: stateValues.forObject
        }
      }),
      definition({ dependencyValues }) {
        return { setValue: { forObjectComponentName: dependencyValues.forObjectComponentName } }
      }

    }

    stateVariableDefinitions.anchor = {
      defaultValue: me.fromText("(0,0)"),
      public: true,
      forRenderer: true,
      hasEssential: true,
      shadowingInstructions: {
        createComponentOfType: "point"
      },
      returnDependencies: () => ({
        anchorAttr: {
          dependencyType: "attributeComponent",
          attributeName: "anchor",
          variableNames: ["coords"],
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.anchorAttr) {
          return { setValue: { anchor: dependencyValues.anchorAttr.stateValues.coords } }
        } else {
          return { useEssentialOrDefaultValue: { anchor: true } }
        }
      },
      async inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues, initialChange }) {

        // if not draggable, then disallow initial change 
        if (initialChange && !await stateValues.draggable) {
          return { success: false };
        }

        if (dependencyValues.anchorAttr) {
          return {
            success: true,
            instructions: [{
              setDependency: "anchorAttr",
              desiredValue: desiredStateVariableValues.anchor,
              variableIndex: 0,
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setEssentialValue: "anchor",
              value: desiredStateVariableValues.anchor
            }]
          }
        }

      }
    }

    return stateVariableDefinitions;

  }

  static adapters = ["text"];


  async moveLabel({ x, y, z, transient, actionId }) {
    let components = ["vector"];
    if (x !== undefined) {
      components[1] = x;
    }
    if (y !== undefined) {
      components[2] = y;
    }
    if (z !== undefined) {
      components[3] = z;
    }
    if (transient) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "anchor",
          value: me.fromAst(components),
        }],
        transient,
        actionId,
      });
    } else {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "anchor",
          value: me.fromAst(components),
        }],
        actionId,
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            x, y, z
          }
        }
      });
    }

  }


  actions = {
    moveLabel: this.moveLabel.bind(this),
  };

}