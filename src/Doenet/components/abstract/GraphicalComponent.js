import BaseComponent from './BaseComponent';

export default class GraphicalComponent extends BaseComponent {
  static componentType = "_graphical";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.label = {default: ""};
    properties.showlabel = {default: true};
    properties.layer = {default: 0};
    return properties;

  }

}
