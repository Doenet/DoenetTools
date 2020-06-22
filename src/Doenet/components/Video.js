import BlockComponent from './abstract/BlockComponent';

export default class Video extends BlockComponent {
  static componentType = "video";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.width = { default: 500, forRenderer: true };
    properties.height = { default: 500, forRenderer: true };
    properties.youtube = { default: null, forRenderer: true };

    properties.source = { default: null, forRenderer: true };

    return properties;
  }


}