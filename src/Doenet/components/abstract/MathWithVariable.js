import MathComponent from '../Math.js';

export default class MathWithVariable extends MathComponent {
  static componentType = "_mathwithvariable";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.variable = {default: undefined};
    return properties;
  }

}