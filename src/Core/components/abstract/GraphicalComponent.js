import BaseComponent from "./BaseComponent";
import { returnSelectedStyleStateVariableDefinition } from "../../utils/style";
import { returnLabelStateVariableDefinitions } from "../../utils/label";

export default class GraphicalComponent extends BaseComponent {
  static componentType = "_graphical";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.labelIsName = {
      createComponentOfType: "boolean",
      createStateVariable: "labelIsName",
      defaultValue: false,
      public: true,
    };
    attributes.applyStyleToLabel = {
      createComponentOfType: "boolean",
      createStateVariable: "applyStyleToLabel",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };
    attributes.layer = {
      createComponentOfType: "integer",
      createStateVariable: "layer",
      defaultValue: 0,
      public: true,
      forRenderer: true,
      attributesForCreatedComponent: { valueOnNaN: 0 },
    };
    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "labels",
        componentTypes: ["label"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let selectedStyleDefinition = returnSelectedStyleStateVariableDefinition();

    Object.assign(stateVariableDefinitions, selectedStyleDefinition);

    let labelDefinitions = returnLabelStateVariableDefinitions();

    Object.assign(stateVariableDefinitions, labelDefinitions);

    stateVariableDefinitions.inGraph3d = {
      forRenderer: true,
      returnDependencies: () => ({
        graph3dAncestor: {
          dependencyType: "ancestor",
          componentType: "graph3d",
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { inGraph3d: dependencyValues.graph3dAncestor } };
      },
    };

    return stateVariableDefinitions;
  }
}
