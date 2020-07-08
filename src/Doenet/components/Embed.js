import BlockComponent from './abstract/BlockComponent';

export default class Embed extends BlockComponent {
  static componentType = "embed";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.width = { default: 500, forRenderer: true };
    properties.height = { default: 500, forRenderer: true };
    properties.geogebra = { default: null, forRenderer: true };

    return properties;
  }


}