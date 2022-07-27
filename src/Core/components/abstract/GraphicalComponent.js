import BaseComponent from './BaseComponent';
import { returnSelectedStyleStateVariableDefinition } from '../../utils/style';

export default class GraphicalComponent extends BaseComponent {
  static componentType = "_graphical";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.label = {
      createComponentOfType: "label",
    };
    attributes.labelIsName = {
      createComponentOfType: "boolean",
      createStateVariable: "labelIsName",
      defaultValue: false,
      public: true,
    };
    attributes.showLabel = {
      createComponentOfType: "boolean",
      createStateVariable: "showLabel",
      defaultValue: true,
      public: true,
      forRenderer: true
    };
    attributes.applyStyleToLabel = {
      createComponentOfType: "boolean",
      createStateVariable: "applyStyleToLabel",
      defaultValue: false,
      public: true,
      forRenderer: true
    };
    attributes.layer = {
      createComponentOfType: "integer",
      createStateVariable: "layer",
      defaultValue: 0,
      public: true,
      forRenderer: true
    };
    return attributes;

  }


  static returnChildGroups() {

    return [{
      group: "labels",
      componentTypes: ["label"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let selectedStyleDefinition = returnSelectedStyleStateVariableDefinition();

    Object.assign(stateVariableDefinitions, selectedStyleDefinition);

    stateVariableDefinitions.originalComponentName = {
      shadowVariable: true,
      returnDependencies: () => ({}),
      definition({ componentName }) {
        return { setValue: { originalComponentName: componentName } }
      }
    }

    stateVariableDefinitions.label = {
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "label",
      },
      hasEssential: true,
      defaultValue: "",
      additionalStateVariablesDefined: [{
        variableName: "labelHasLatex",
        forRenderer: true,
      }],
      returnDependencies: () => ({
        labelAttr: {
          dependencyType: "attributeComponent",
          attributeName: "label",
          variableNames: ["value", "hasLatex"]
        },
        labelChild: {
          dependencyType: "child",
          childGroups: ["labels"],
          variableNames: ["value", "hasLatex"]
        },
        labelIsName: {
          dependencyType: "stateVariable",
          variableName: "labelIsName"
        },
        originalComponentName: {
          dependencyType: "stateVariable",
          variableName: "originalComponentName"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.labelChild.length > 0) {
          let labelChild = dependencyValues.labelChild[dependencyValues.labelChild.length-1]
          return {
            setValue: {
              label: labelChild.stateValues.value,
              labelHasLatex: labelChild.stateValues.hasLatex
            }
          }
        } else if (dependencyValues.labelAttr) {
          return {
            setValue: {
              label: dependencyValues.labelAttr.stateValues.value,
              labelHasLatex: dependencyValues.labelAttr.stateValues.hasLatex
            }
          }
        } else if (dependencyValues.labelIsName) {
          let lastSlash = dependencyValues.originalComponentName.lastIndexOf('/');
          let label = dependencyValues.originalComponentName.substring(lastSlash + 1);
          if (label.slice(0, 2) === "__") {
            // if label from componentName starts with two underscores,
            // it is an automatically generated component name that has random characters in it
            // Don't display name, as they are for internal use only (and the user cannot refer to them)
            return {
              useEssentialOrDefaultValue: { label: true },
              setValue: { labelHasLatex: false }
            }
          }

          // &#95; is HTML entity for underscore, so JSXgraph won't replace it with subscript
          label = label.replaceAll("_", "&#95;");
          return {
            setValue: {
              label,
              labelHasLatex: false
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { label: true },
            setValue: { labelHasLatex: false }
          }
        }
      }
    }

    return stateVariableDefinitions;
  }


}
