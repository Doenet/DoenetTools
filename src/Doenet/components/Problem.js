import SectioningComponent from './abstract/SectioningComponent';

export default class Problem extends SectioningComponent {
  static componentType = "problem";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.aggregatescores = {default: true};

    return properties;
  }

  updateState(args={}) {
    super.updateState(args);

    this.state.level = 3;
  }
}