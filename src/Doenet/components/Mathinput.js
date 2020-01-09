import Input from './abstract/Input';
import me from 'math-expressions';

export default class Mathinput extends Input {
  constructor(args) {
    super(args);
    this.updateMathExpression = this.updateMathExpression.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
    this.setRendererValueAsSubmitted = this.setRendererValueAsSubmitted.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
  }
  static componentType = "mathinput";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.prefill = { default: "" };
    properties.format = { default: "text" };
    properties.size = { default: 10 };
    properties.collaborateGroups = { default: undefined };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atMostOneMath",
      componentType: "math",
      comparison: "atMost",
      number: 1,
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.value = {
      public: true,
      componentType: "math",
      returnDependencies: () => ({
        mathChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneMath",
          variableNames: ["value", "valueForDisplay"],
        },
        prefill: {
          dependencyType: "stateVariable",
          variableName: "prefill"
        },
        format: {
          dependencyType: "stateVariable",
          variableName: "format"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.mathChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              value: {
                variablesToCheck: "value",
                get defaultValue() {
                  return parseValueIntoMath({
                    inputString: dependencyValues.prefill,
                    format: dependencyValues.format
                  })
                }
              }
            }
          }
        }

        // since value will be displayed, round to displaydigits
        return { newValues: { value: dependencyValues.mathChild[0].stateValues.valueForDisplay } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        if (dependencyValues.mathChild.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "mathChild",
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

    stateVariableDefinitions.componentTypes = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { componentTypes: ["math"] } })
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
      defaultValue: me.fromAst('\uFF3F'),
      public: true,
      componentType: "math",
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
          dependencyValues.answerAncestor.stateValues.justSubmitted //&&
          // dependencyValues.numberTimesSubmitted > 0 &&
          // dependencyValues.value.equalsViaSyntax(dependencyValues.submittedValue)
        ) {
          valueHasBeenValidated = true;
        }
        return {
          newValues: { valueHasBeenValidated }
        }
      }
    }


    stateVariableDefinitions.rendererValueAsSubmitted = {
      returnDependencies: () => ({
        valueHasBeenValidated: {
          dependencyType: "stateVariable",
          variableName: "valueHasBeenValidated"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          useEssentialOrDefaultValue: {
            rendererValueAsSubmitted: {
              variablesToCheck: "rendererValueAsSubmitted",
              defaultValue: dependencyValues.valueHasBeenValidated
            }
          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "rendererValueAsSubmitted",
            value: desiredStateVariableValues.rendererValueAsSubmitted
          }]
        };
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
      definition: ({ dependencyValues }) => ({
        newValues: {
          disabled: !dependencyValues.collaborateGroups.matchGroup(dependencyValues.collaboration)
        }
      })
    }

    return stateVariableDefinitions;

  }


  updateMathExpression({ mathExpression }) {
    if (!this.stateValues.disabled) {
      this.requestUpdate({
        updateType: "updateValue",
        updateInstructions: [{
          componentName: this.componentName,
          stateVariable: "value",
          value: mathExpression,
        }]
      })
    }
  }

  setRendererValueAsSubmitted(val) {
    console.log('set renderer value as submitted')
    console.log(val)
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        stateVariable: "rendererValueAsSubmitted",
        value: val,
      }]
    })
  }



  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    this.actions = {
      updateMathExpression: this.updateMathExpression,
      setRendererValueAsSubmitted: this.setRendererValueAsSubmitted,
    }
    if (this.stateValues.answerAncestor !== undefined) {
      this.actions.submitAnswer = () => this.requestAction({
        componentName: this.stateValues.answerAncestor.componentName,
        actionName: "submitAnswer"
      })
    }

    this.renderer = new this.availableRenderers.mathinput({
      actions: this.actions,
      mathExpression: new Proxy(this.stateValues.value, this.readOnlyProxyHandler),
      key: this.componentName,
      includeCheckWork: this.stateValues.includeCheckWork,
      creditAchieved: this.stateValues.creditAchieved,
      valueHasBeenValidated: this.stateValues.valueHasBeenValidated,
      numberTimesSubmitted: this.stateValues.numberTimesSubmitted,
      size: this.stateValues.size,
      showCorrectness: this.flags.showCorrectness,
      disabled: this.stateValues.disabled,
    });
  }


  updateRenderer() {


    this.renderer.updateMathinputRenderer({
      mathExpression: new Proxy(this.stateValues.value, this.readOnlyProxyHandler),
      creditAchieved: this.stateValues.creditAchieved,
      valueHasBeenValidated: this.stateValues.valueHasBeenValidated,
      numberTimesSubmitted: this.stateValues.numberTimesSubmitted,
      disabled: this.stateValues.disabled,
    });

  }

}


function parseValueIntoMath({ inputString, format }) {

  if (!inputString) {
    return me.fromAst('\uFF3F');
  }

  let expression;
  if (format === "latex") {
    try {
      expression = me.fromLatex(inputString);
    } catch (e) {
      console.warn(`Invalid latex for mathinput: ${inputString}`)
      expression = me.fromAst('\uFF3F');
    }
  } else if (format === "text") {
    try {
      expression = me.fromText(inputString);
    } catch (e) {
      console.warn(`Invalid text for mathinput: ${inputString}`)
      expression = me.fromAst('\uFF3F');
    }
  }
  return expression;
}
