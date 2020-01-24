import SectioningComponent from './abstract/SectioningComponent';

export default class Problem extends SectioningComponent {
  static componentType = "problem";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.aggregatescores = {default: true};

    return properties;
  }

  updateState(args={}) {
    super.updateState(args);

    this.state.level = 3;
  }
}