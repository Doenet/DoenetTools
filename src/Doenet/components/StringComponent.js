import InlineComponent from './abstract/InlineComponent';

export default class StringComponent extends InlineComponent {
  static componentType = "string";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesForReference() { return ["value"] };

  static createPropertiesObject() {
    return {};
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.value = {
      additionalStateVariablesDefined: [{
        variableName: "text",
        public: true,
        componentType: "text"
      }],
      returnDependencies: () => ({}),
      defaultValue: "",
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


  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    this.renderer = new this.availableRenderers.text({
      key: this.componentName,
      text: this.stateValues.value,
      suppressKeyRender: true,
    });
  }

  updateRenderer() {
    this.renderer.updateText(this.stateValues.value);
  }

}
