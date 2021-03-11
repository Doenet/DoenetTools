import Option from './Option';

export default class Group extends Option {
  static componentType = "group";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.rendered.default = true;
    return properties;
  }

}
