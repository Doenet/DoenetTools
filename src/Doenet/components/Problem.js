import SectioningComponent from './abstract/SectioningComponent';

export default class Problem extends SectioningComponent {
  static componentType = "problem";
  static rendererType = "section";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.aggregateScores = { default: true };

    return properties;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.level = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { level: 3 } })
    }

    return stateVariableDefinitions
  }

}