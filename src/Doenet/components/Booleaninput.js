import Input from './abstract/Input';

export default class Booleaninput extends Input {
  constructor(args) {
    super(args);
    this.updateBoolean = this.updateBoolean.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
  }
  static componentType = "booleaninput";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.prefill = { default: "false" };
    properties.label = { default: "" };
    return properties;
  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atMostOneBoolean",
      componentType: "boolean",
      comparison: "atMost",
      number: 1,
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      public: true,
      componentType: "boolean",
      returnDependencies: () => ({
        booleanChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneBoolean",
          variableNames: ["value"],
        },
        prefill: {
          dependencyType: "stateVariable",
          variableName: "prefill"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.booleanChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              value: { 
                variablesToCheck: "value", 
                get defaultValue() {
                  return ["true", "t"].includes(dependencyValues.prefill.trim().toLowerCase());
                }
              }
            }
          }
        }
        return { newValues: { value: dependencyValues.booleanChild[0].stateValues.value } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        if (dependencyValues.booleanChild.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "booleanChild",
              desiredValue: desiredStateVariableValues.value,
              childIndex: 0,
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


    stateVariableDefinitions.submittedValue = {
      defaultValue: null,
      public: true,
      componentType: "boolean",
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          submittedValue: {
            variablesToCheck: ["submittedValue"]
          }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "submittedValue",
            value: desiredStateVariableValues.submittedValue
          }]
        };
      }
    }


    return stateVariableDefinitions;

  }

  updateBoolean({ boolean }) {
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        stateVariable: "value",
        value: boolean,
      }]
    })
  }


  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    this.actions = {
      updateBoolean: this.updateBoolean,
    }
    if (this.stateValues.answerAncestor !== undefined) {
      this.actions.submitAnswer = () => this.requestAction({
        componentName: this.stateValues.answerAncestor.componentName,
        actionName: "submitAnswer"
      })
    }

    this.renderer = new this.availableRenderers.booleaninput({
      actions: this.actions,
      boolean: this.stateValues.value,
      key: this.componentName,
      label: this.stateValues.label,
      includeCheckWork: this.stateValues.includeCheckWork,
      creditAchieved: this.stateValues.creditAchieved,
      valueHasBeenValidated: this.stateValues.valueHasBeenValidated,
      showCorrectness: this.flags.showCorrectness,
    });
  }

  updateRenderer() {
    this.renderer.updateBoolean({
      boolean: this.stateValues.value,
      label: this.stateValues.label,
      creditAchieved: this.stateValues.creditAchieved,
      valueHasBeenValidated: this.stateValues.valueHasBeenValidated,
    });

  }

}
