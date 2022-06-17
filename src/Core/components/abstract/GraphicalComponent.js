import BaseComponent from './BaseComponent';
import { returnSelectedStyleStateVariableDefinition } from '../../utils/style';

export default class GraphicalComponent extends BaseComponent {
  static componentType = "_graphical";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.label = {
      createComponentOfType: "_textOrLatexFromInline",
      createStateVariable: "label",
      defaultValue: "",
      public: true,
      forRenderer: true
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


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let selectedStyleDefinition = returnSelectedStyleStateVariableDefinition();

    Object.assign(stateVariableDefinitions, selectedStyleDefinition);

    stateVariableDefinitions.labelIsLatex = {
      forRenderer: true,
      returnDependencies: () => ({
        labelAttr: {
          dependencyType: "attributeComponent",
          attributeName: "label",
          variableNames: ["isLatex"]
        }
      }),
      definition({ dependencyValues }) {
        return { setValue: { labelIsLatex: dependencyValues.labelAttr?.stateValues.isLatex === true } }
      }
    }

    return stateVariableDefinitions;
  }


}
