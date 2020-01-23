import BaseComponent from './BaseComponent';

export default class GraphicalComponent extends BaseComponent {
  static componentType = "_graphical";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.label = {default: ""};
    properties.showlabel = {default: true};
    properties.layer = {default: 0};
    return properties;

  }

}
