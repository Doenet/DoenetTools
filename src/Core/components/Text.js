import { returnSelectedStyleStateVariableDefinition } from '../utils/style';
import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export default class Text extends InlineComponent {
  static componentType = "text";

  static includeBlankStringChildren = true;

  static variableForPlainMacro = "value";

  // even if inside a component that turned on descendantCompositesMustHaveAReplacement
  // don't required composite replacements
  static descendantCompositesMustHaveAReplacement = false;


  static createAttributesObject() {
    let attributes = super.createAttributesObject();

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

    attributes.anchorPosition = {
      createComponentOfType: "text",
      createStateVariable: "anchorPosition",
      defaultValue: "upperleft",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["upperright", "upperleft", "lowerright", "lowerleft", "top", "bottom", "left", "right", "center"]
    }

    attributes.styleNumber.defaultValue = 0;

    return attributes;

  };


  static returnChildGroups() {

    return [{
      group: "textLike",
      componentTypes: ["string", "text", "_singleCharacterInline", "_inlineRenderInlineChildren"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let selectedStyleDefinition = returnSelectedStyleStateVariableDefinition();

    Object.assign(stateVariableDefinitions, selectedStyleDefinition);

    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: this.componentType,
        // the reason we create a attribute component from the state variable,
        // rather than just shadowing the attribute,
        // is that a sequence creates a text where it sets fixed directly in the state
        // TODO: how to deal with this in general?  Should we disallow that way to set state?
        // Or should we always shadow attributes this way?
        addAttributeComponentsShadowingStateVariables: {
          fixed: {
            stateVariableToShadow: "fixed",
          }
        },
      },
      hasEssential: true,
      returnDependencies: () => ({
        textLikeChildren: {
          dependencyType: "child",
          childGroups: ["textLike"],
          variableNames: ["text"],
        },
      }),
      defaultValue: "",
      set: x => x === null ? "" : String(x),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.textLikeChildren.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              value: true
            }
          }
        }
        let value = "";
        for (let comp of dependencyValues.textLikeChildren) {
          if (typeof comp === "string") {
            value += comp;
          } else {
            value += comp.stateValues.text;
          }
        }
        return { setValue: { value } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {
        let numChildren = dependencyValues.textLikeChildren.length;
        if (numChildren > 1) {
          return { success: false };
        }
        if (numChildren === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "textLikeChildren",
              desiredValue: desiredStateVariableValues.value,
              childIndex: 0,
              variableIndex: 0,
            }]
          };
        }
        // no children, so set essential value to the desired value
        return {
          success: true,
          instructions: [{
            setEssentialValue: "value",
            value: desiredStateVariableValues.value === null ? "" : String(desiredStateVariableValues.value)
          }]
        };
      }
    }

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { text: dependencyValues.value }
      }),
      inverseDefinition: ({ desiredStateVariableValues }) => ({
        success: true,
        instructions: [{
          setDependency: "value",
          desiredValue: desiredStateVariableValues.text,
        }]
      })

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


  async moveText({ x, y, z, transient, actionId }) {
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
    moveText: this.moveText.bind(this),
  };


}