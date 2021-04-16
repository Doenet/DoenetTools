import VectorListComponent from './abstract/VectorListComponent';

export default class ControlVectors extends VectorListComponent {
  static componentType = "controlvectors";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.direction = {
      default: "symmetric",
      toLowerCase: true,
      validValues: ["symmetric", "previous", "next", "both", "none"]
    };
    properties.pointNumber = { default: null }
    return properties;
  }


}
