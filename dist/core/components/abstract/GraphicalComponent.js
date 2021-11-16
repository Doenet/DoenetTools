import BaseComponent from './BaseComponent.js';
import { returnSelectedStyleStateVariableDefinition } from '../../utils/style.js';

export default class GraphicalComponent extends BaseComponent {
  static componentType = "_graphical";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.label = {
      createComponentOfType: "text",
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
    attributes.layer = {
      createComponentOfType: "number",
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

    return stateVariableDefinitions;
  }


}
