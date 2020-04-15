import MathComponent from './Math';

export default class Interval extends MathComponent {

  static componentType = "interval";
  static rendererType = "math";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);

    properties.createIntervals = { default: true };

    return properties;
  }

  // static returnStateVariableDefinitions() {

  //   let stateVariableDefinitions = super.returnStateVariableDefinitions();

  //   return stateVariableDefinitions;
  // }
  
}