import Input from './abstract/Input';

export default class Textinput extends Input {
  constructor(args) {
    super(args);
    this.updateText = this.updateText.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );

    this.actions = {
      updateText: this.updateText
    };

    //Complex because the stateValues isn't defined until later
    Object.defineProperty(this.actions, 'submitAnswer', {
      get: function () {
        if (this.stateValues.answerAncestor !== null) {
          return () => this.requestAction({
            componentName: this.stateValues.answerAncestor.componentName,
            actionName: "submitAnswer"
          })
        } else {
          return () => null
        }
      }.bind(this)
    });


  }
  static componentType = "textinput";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.prefill = { default: "" };
    properties.size = { default: 10, forRenderer: true };
    return properties;
  }

  static returnChildLogic(args) {
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

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      public: true,
      componentType: "text",
      forRenderer: true,
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
        return { newValues: { text: dependencyValues.value } }
      }
    }

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { componentType: "text" } })
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
  updateRenderer({ sourceOfUpdate }) {

    let changeInitiatedWithThisComponent = sourceOfUpdate.local &&
      sourceOfUpdate.originalComponents.includes(this.componentName);

    this.renderer.updateTextinputRenderer({
      text: this.stateValues.value,
      creditAchieved: this.stateValues.creditAchieved,
      valueHasBeenValidated: this.stateValues.valueHasBeenValidated,
      changeInitiatedWithThisComponent
    });

  }

}
