import VectorListComponent from './abstract/VectorListComponent';

export default class ControlVectors extends VectorListComponent {
  static componentType = "controlVectors";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

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
