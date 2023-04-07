import GraphicalComponent from './abstract/GraphicalComponent';

export default class Pegboard extends GraphicalComponent {
  static componentType = "pegboard";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.dx = {
      createComponentOfType: "number",
      createStateVariable: "dx",
      defaultValue: 1,
      public: true,
      forRenderer: true
    };

    attributes.dy = {
      createComponentOfType: "number",
      createStateVariable: "dy",
      defaultValue: 1,
      public: true,
      forRenderer: true
    };

    attributes.xoffset = {
      createComponentOfType: "number",
      createStateVariable: "xoffset",
      defaultValue: 0,
      public: true,
      forRenderer: true
    };

    attributes.yoffset = {
      createComponentOfType: "number",
      createStateVariable: "yoffset",
      defaultValue: 0,
      public: true,
      forRenderer: true
    };

    return attributes;

  }

}