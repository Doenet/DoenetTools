import Input from './abstract/Input';

export default class Textinput extends Input {
  constructor(args) {
    super(args);
    this.updateText = this.updateText.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
  }
  static componentType = "textinput";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.prefill = { default: "" };
    properties.size = { default: 10 };
    properties.collaborateGroups = { default: undefined };
    return properties;
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atMostOneText",
      componentType: "text",
      comparison: "atMost",
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.value = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        textChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneText",
          variableNames: ["value"],
        },
        prefill: {
          dependencyType: "stateVariable",
          variableName: "prefill"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.textChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              value: { variablesToCheck: "value", defaultValue: dependencyValues.prefill }
            }
          }
        }
        return { newValues: { value: dependencyValues.textChild[0].stateValues.value } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        if (dependencyValues.textChild.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "textChild",
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

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { componentType: "text" } })
    }


    stateVariableDefinitions.numberTimesSubmitted = {
      public: true,
      componentType: "number",
      defaultValue: 0,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          numberTimesSubmitted: {
            variablesToCheck: ["numberTimesSubmitted"]
          }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "numberTimesSubmitted",
            value: desiredStateVariableValues.numberTimesSubmitted
          }]
        };
      }
    }


    stateVariableDefinitions.creditAchieved = {
      defaultValue: 0,
      public: true,
      componentType: "number",
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          creditAchieved: {
            variablesToCheck: ["creditAchieved"]
          }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "creditAchieved",
            value: desiredStateVariableValues.creditAchieved
          }]
        };
      }
    }


    stateVariableDefinitions.submittedValue = {
      defaultValue: '\uFF3F',
      public: true,
      componentType: "text",
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


    stateVariableDefinitions.answerAncestor = {
      returnDependencies: () => ({
        answerAncestor: {
          dependencyType: "ancestorStateVariables",
          componentType: "answer",
          variableNames: ["delegateCheckWork", "justSubmitted"]
        }
      }),
      definition: function ({ dependencyValues }) {
        let answerAncestor = null;

        if (dependencyValues.answerAncestor.length === 1) {
          answerAncestor = dependencyValues.answerAncestor[0];
        }
        return {
          newValues: { answerAncestor }
        }
      }
    }


    stateVariableDefinitions.includeCheckWork = {
      returnDependencies: () => ({
        answerAncestor: {
          dependencyType: "stateVariable",
          variableName: "answerAncestor"
        },
      }),
      definition: function ({ dependencyValues }) {
        let includeCheckWork = false;
        if (dependencyValues.answerAncestor) {
          includeCheckWork = dependencyValues.answerAncestor.stateValues.delegateCheckWork;
        }
        return {
          newValues: { includeCheckWork }
        }
      }

    }


    stateVariableDefinitions.valueHasBeenValidated = {
      returnDependencies: () => ({
        answerAncestor: {
          dependencyType: "stateVariable",
          variableName: "answerAncestor"
        },
        numberTimesSubmitted: {
          dependencyType: "stateVariable",
          variableName: "numberTimesSubmitted"
        },
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        },
        submittedValue: {
          dependencyType: "stateVariable",
          variableName: "submittedValue"
        },

      }),
      definition: function ({ dependencyValues }) {

        let valueHasBeenValidated = false;

        if (dependencyValues.answerAncestor &&
          dependencyValues.answerAncestor.stateValues.justSubmitted) {
          valueHasBeenValidated = true;
        }
        return {
          newValues: { valueHasBeenValidated }
        }
      }
    }


    stateVariableDefinitions.disabled = {
      returnDependencies: () => ({
        collaborateGroups: {
          dependencyType: "stateVariable",
          variableName: "collaborateGroups"
        },
        collaboration: {
          dependencyType: "flag",
          flagName: "collaboration"
        }
      }),
      definition: function ({ dependencyValues }) {
        let disabled = false;
        if (dependencyValues.collaborateGroups) {
          disabled = !dependencyValues.collaborateGroups.matchGroup(dependencyValues.collaboration)
        }
        return { newValues: { disabled } }
      }
    }


    return stateVariableDefinitions;

  }


  updateText({ text }) {
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        stateVariable: "value",
        value: text,
      }]
    })
  }

  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    this.actions = {
      updateText: this.updateText,
    }
    if (this.stateValues.answerAncestor !== undefined) {
      this.actions.submitAnswer = () => this.requestAction({
        componentName: this.stateValues.answerAncestor.componentName,
        actionName: "submitAnswer"
      })
    }

    this.renderer = new this.availableRenderers.textinput({
      actions: this.actions,
      text: this.stateValues.value,
      key: this.componentName,
      includeCheckWork: this.stateValues.includeCheckWork,
      creditAchieved: this.stateValues.creditAchieved,
      valueHasBeenValidated: this.stateValues.valueHasBeenValidated,
      size: this.stateValues.size,
      showCorrectness: this.flags.showCorrectness,
    });
  }

  updateRenderer() {
    this.renderer.updateTextinputRenderer({
      text: this.stateValues.value,
      creditAchieved: this.stateValues.creditAchieved,
      valueHasBeenValidated: this.stateValues.valueHasBeenValidated,
    });

  }

}
