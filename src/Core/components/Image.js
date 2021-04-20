import BlockComponent from './abstract/BlockComponent';

export default class Image extends BlockComponent {
  static componentType = "image";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.width = { default: null, forRenderer: true };
    properties.height = { default: null, forRenderer: true };
    properties.description = { default: null, forRenderer: true };
    properties.source = { required: true, forRenderer: true };
    return properties;
  }

}
