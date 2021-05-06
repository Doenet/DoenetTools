import MathComponent from '../Math.js';

export default class MathWithVariable extends MathComponent {
  static componentType = "_mathWithVariable";
  static rendererType = "math";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.variable = {
      createComponentOfType: "variable",
      createStateVariable: "variable",
      defaultValue: undefined,
      public: true,
    };
    return attributes;
  }

}