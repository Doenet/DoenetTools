import BaseComponent from './BaseComponent';
import { returnDefaultStyleDefinitions } from '../../utils/style';

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

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.selectedStyle = {
      forRenderer: true,
      willNeverBeEssential: true,
      returnDependencies: () => ({
        styleNumber: {
          dependencyType: "stateVariable",
          variableName: "styleNumber",
        },
        ancestorWithStyle: {
          dependencyType: "ancestor",
          variableNames: ["styleDefinitions"]
        }
      }),
      definition: function ({ dependencyValues }) {

        let styleDefinitions = dependencyValues.ancestorWithStyle.stateValues.styleDefinitions;
        if (!styleDefinitions) {
          styleDefinitions = returnDefaultStyleDefinitions();
        }

        let selectedStyle;

        for (let styleDefinition of styleDefinitions) {
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
          selectedStyle = styleDefinitions[0];
        }
        return { newValues: { selectedStyle } };
      }
    }

    return stateVariableDefinitions;
  }


}
