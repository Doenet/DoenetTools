import InlineComponent from './abstract/InlineComponent';

export default class StringComponent extends InlineComponent {
  static componentType = "string";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["value"] };

  static createPropertiesObject() {
    return {};
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      additionalStateVariablesDefined: [{
        variableName: "text",
        public: true,
        componentType: "text"
      }],
      returnDependencies: () => ({}),
      defaultValue: "",
      forRenderer: true,
      definition: function () {
        return {
          useEssentialOrDefaultValue: {
            value: { variablesToCheck: "value" },
            text: { variablesToCheck: "value" }
          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "value",
            value: desiredStateVariableValues.value
          }]
        };
      }
    }

    return stateVariableDefinitions;

  }

}
