import InlineComponent from './abstract/InlineComponent';

export default class UpdateValue extends InlineComponent {
  constructor(args) {
    super(args);
    this.updateValue = this.updateValue.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );

    this.actions = {
      updateValue: this.updateValue
    };

  }
  static componentType = "updateValue";

  static get stateVariablesShadowedForReference() {
    return ["targetedMathName", "newMathValue"]
  }

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    // attributes.width = {default: 300};
    // attributes.height = {default: 50};
    attributes.label = {
      createComponentOfType: "text",
      createStateVariable: "label",
      defaultValue: "update value",
      public: true,
      forRenderer: true,
    };
    attributes.mathTarget = {
      createComponentOfType: "math"
    };
    attributes.newMathValue = {
      createComponentOfType: "math"
    }

    return attributes;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.targetedMathName = {
      returnDependencies: () => ({
        mathTarget: {
          dependencyType: "attributeComponent",
          attributeName: "mathTarget",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.mathTarget) {
          return {
            newValues: {
              targetedMathName: dependencyValues.mathTarget.componentName
            }
          };
        } else {
          return { newValues: { targetedMathName: null } }
        }

      },
    }

    stateVariableDefinitions.newMathValue = {
      returnDependencies: () => ({
        newMathValue: {
          dependencyType: "attributeComponent",
          attributeName: "newMathValue",
          variableNames: ["value"]
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.newMathValue) {
          return {
            newValues: {
              newMathValue: dependencyValues.newMathValue.stateValues.value
            }
          };
        } else {
          return { newValues: { newMathValue: null } }
        }
      },
    }

    return stateVariableDefinitions;

  }


  updateValue() {
    if (this.stateValues.targetedMathName && this.stateValues.newMathValue) {
      this.coreFunctions.requestUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.stateValues.targetedMathName,
          stateVariable: "value",
          value: this.stateValues.newMathValue,
        }],
        event: {
          verb: "selected",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            response: this.stateValues.newMathValue,
            responseText: this.stateValues.newMathValue.toString(),
          }
        }
      });
    }

  }

}