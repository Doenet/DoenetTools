import Input from './abstract/Input.js';

export default class BooleanInput extends Input {
  constructor(args) {
    super(args);

    this.actions = {
      updateBoolean: this.updateBoolean.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      )
    };

    this.externalActions = {};

    //Complex because the stateValues isn't defined until later
    Object.defineProperty(this.externalActions, 'submitAnswer', {
      enumerable: true,
      get: function () {
        if (this.stateValues.answerAncestor !== null) {
          return {
            componentName: this.stateValues.answerAncestor.componentName,
            actionName: "submitAnswer"
          }
        } else {
          return;
        }
      }.bind(this)
    });

  }
  static componentType = "booleanInput";

  static variableForPlainMacro = "value";

  static get stateVariablesShadowedForReference() {
    return ["value"]
  };

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.prefill = {
      createComponentOfType: "boolean",
      createStateVariable: "prefill",
      defaultValue: false,
      public: true,
    };
    attributes.label = {
      createComponentOfType: "text",
      createStateVariable: "label",
      defaultValue: "",
      forRenderer: true,
      public: true,
    };
    attributes.bindValueTo = {
      createComponentOfType: "boolean"
    };
    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      public: true,
      componentType: "boolean",
      forRenderer: true,
      returnDependencies: () => ({
        bindValueTo: {
          dependencyType: "attributeComponent",
          attributeName: "bindValueTo",
          variableNames: ["value"],
        },
        prefill: {
          dependencyType: "stateVariable",
          variableName: "prefill"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.bindValueTo) {
          return {
            useEssentialOrDefaultValue: {
              value: {
                variablesToCheck: "value",
                defaultValue: dependencyValues.prefill
              }
            }
          }
        }
        return { newValues: { value: dependencyValues.bindValueTo.stateValues.value } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        if (dependencyValues.bindValueTo) {
          return {
            success: true,
            instructions: [{
              setDependency: "bindValueTo",
              desiredValue: desiredStateVariableValues.value,
              variableIndex: 0,
            }]
          };
        }
        // no children, so value is essential and give it the desired value
        return {
          success: true,
          instructions: [{
            setStateVariable: "value",
            value: desiredStateVariableValues.value
          }]
        };
      }
    }

    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { text: dependencyValues.value ? "true" : "false" } }
      }
    }

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { componentType: "boolean" } })
    }


    return stateVariableDefinitions;

  }

  updateBoolean({ boolean }) {
    if (!this.stateValues.disabled) {
      let updateInstructions = [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "value",
        value: boolean,
      }];

      let event = {
        verb: "selected",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: boolean,
          responseText: boolean.toString(),
        }
      }

      if (this.stateValues.answerAncestor) {
        event.context = {
          answerAncestor: this.stateValues.answerAncestor.componentName
        }
      }


      return this.coreFunctions.performUpdate({
        updateInstructions,
        event,
      }).then(() => this.coreFunctions.triggerChainedActions({
        componentName: this.componentName,
      }));


    }
  }

}
