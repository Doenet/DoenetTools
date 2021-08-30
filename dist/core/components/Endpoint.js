import Point from './Point.js';

export default class Endpoint extends Point {
  static componentType = "endpoint";
  static rendererType = "point";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.open = {
      createComponentOfType: "boolean",
      createStateVariable: "open",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };

    return attributes;
  }


}