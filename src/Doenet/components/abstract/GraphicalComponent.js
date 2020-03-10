import BaseComponent from './BaseComponent';

export default class GraphicalComponent extends BaseComponent {
  static componentType = "_graphical";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.label = { default: "", forRenderer: true };
    properties.showLabel = { default: true, forRenderer: true };
    properties.layer = { default: 0, forRenderer: true };
    return properties;

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.selectedStyle = {
      forRenderer: true,
      returnDependencies: () => ({
        styleNumber: {
          dependencyType: "stateVariable",
          variableName: "styleNumber",
        },
        ancestorWithStyle: {
          dependencyType: "ancestorStateVariables",
          variableNames: ["styleDefinitions"]
        }
      }),
      definition: function ({ dependencyValues }) {

        let selectedStyle;

        for (let styleDefinition of dependencyValues.ancestorWithStyle.stateValues.styleDefinitions) {
          if (dependencyValues.styleNumber === styleDefinition.styleNumber) {
            if (selectedStyle === undefined) {
              selectedStyle = styleDefinition;
            } else {
              // attributes from earlier matches take precedence
              selectedStyle = Object.assign(Object.assign({}, styleDefinition), selectedStyle)
            }
          }
        }

        if (selectedStyle === undefined) {
          selectedStyle = dependencyValues.ancestorWithStyle.stateValues.styleDefinitions[0];
        }
        return { newValues: { selectedStyle } };
      }
    }

    return stateVariableDefinitions;
  }


}
