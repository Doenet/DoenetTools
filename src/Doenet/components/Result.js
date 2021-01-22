import Group from './Group';

export default class Result extends Group {
  static componentType = "result";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.rendered.default = false;
    return properties;
  }

}
