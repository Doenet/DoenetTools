import MathComponent from '../Math.js';

export default class MathWithVariable extends MathComponent {
  static componentType = "_mathwithvariable";
  static rendererType = "math";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.variable = { default: undefined };
    return properties;
  }

}