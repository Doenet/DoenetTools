import { moveGraphicalObjectWithAnchorAction, returnAnchorAttributes, returnAnchorStateVariableDefinition } from '../utils/graphical';
import { returnSelectedStyleStateVariableDefinition, returnTextStyleDescriptionDefinitions } from '../utils/style';
import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export default class Text extends InlineComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      moveText: this.moveText.bind(this),
      textClicked: this.textClicked.bind(this),
      textFocused: this.textFocused.bind(this),
    });

  }
  static componentType = "text";

  static includeBlankStringChildren = true;

  static variableForPlainMacro = "value";
  static plainMacroReturnsSameType = true;

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

    Object.assign(attributes, returnAnchorAttributes())

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

    let styleDescriptionDefinitions = returnTextStyleDescriptionDefinitions();
    Object.assign(stateVariableDefinitions, styleDescriptionDefinitions);

    let anchorDefinition = returnAnchorStateVariableDefinition();
    Object.assign(stateVariableDefinitions, anchorDefinition);


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

    return stateVariableDefinitions;

  }


  async moveText({ x, y, z, transient, actionId,
    sourceInformation = {}, skipRendererUpdate = false,
  }) {

    return await moveGraphicalObjectWithAnchorAction({
      x, y, z, transient, actionId,
      sourceInformation, skipRendererUpdate,
      componentName: this.componentName,
      componentType: this.componentType,
      coreFunctions: this.coreFunctions
    })

  }

  async textClicked({ actionId, name, sourceInformation = {}, skipRendererUpdate = false }) {

    await this.coreFunctions.triggerChainedActions({
      triggeringAction: "click",
      componentName: name,  // use name rather than this.componentName to get original name if adapted
      actionId,
      sourceInformation,
      skipRendererUpdate,
    })

    this.coreFunctions.resolveAction({ actionId });

  }

  async textFocused({ actionId, name, sourceInformation = {}, skipRendererUpdate = false }) {

    await this.coreFunctions.triggerChainedActions({
      triggeringAction: "focus",
      componentName: name,  // use name rather than this.componentName to get original name if adapted
      actionId,
      sourceInformation,
      skipRendererUpdate,
    })

    this.coreFunctions.resolveAction({ actionId });

  }


}