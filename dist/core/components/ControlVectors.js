import VectorListComponent from './abstract/VectorListComponent.js';

export default class ControlVectors extends VectorListComponent {
  static componentType = "controlVectors";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.direction = {
      createComponentOfType: "text",
      createStateVariable: "direction",
      defaultValue: "symmetric",
      public: true,
      toLowerCase: true,
      validValues: ["symmetric", "previous", "next", "both", "none"]
    };
    attributes.pointNumber = {
      createComponentOfType: "number",
      createStateVariable: "pointNumber",
      defaultValue: null,
      public: true,
    };
    return attributes;
  }


}
