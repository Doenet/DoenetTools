import BaseComponent from './BaseComponent';
import { returnSelectedStyleStateVariableDefinition } from '../../utils/style';

export default class GraphicalComponent extends BaseComponent {
  static componentType = "_graphical";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.label = {
      createComponentOfType: "label",
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

    stateVariableDefinitions.label = {
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
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
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.labelChild.length > 0) {
          return {
            setValue: {
              label: dependencyValues.labelChild[0].stateValues.value,
              labelHasLatex: dependencyValues.labelChild[0].stateValues.hasLatex
            }
          }
        } else if (dependencyValues.labelAttr) {
          return {
            setValue: {
              label: dependencyValues.labelAttr.stateValues.value,
              labelHasLatex: dependencyValues.labelAttr.stateValues.hasLatex
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
