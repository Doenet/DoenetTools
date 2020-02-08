import Input from './abstract/Input';
import me from 'math-expressions';

export default class Mathinput extends Input {
  constructor(args) {
    super(args);
    this.updateMathExpression = this.updateMathExpression.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
  }
  static componentType = "mathinput";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.prefill = { default: "" };
    properties.format = { default: "text" };
    properties.size = { default: 10 };
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

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

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
        return { newValues: { text: dependencyValues.value.toString() } }
      }
    }

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { componentType: "math" } })
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

  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    this.actions = {
      updateMathExpression: this.updateMathExpression,
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
      size: this.stateValues.size,
      showCorrectness: this.flags.showCorrectness,
      disabled: this.stateValues.disabled,
    });
  }


  updateRenderer({ sourceOfUpdate }) {

    let changeInitiatedWithThisComponent = sourceOfUpdate.local &&
      sourceOfUpdate.originalComponents.includes(this.componentName);

    this.renderer.updateMathinputRenderer({
      mathExpression: new Proxy(this.stateValues.value, this.readOnlyProxyHandler),
      creditAchieved: this.stateValues.creditAchieved,
      valueHasBeenValidated: this.stateValues.valueHasBeenValidated,
      disabled: this.stateValues.disabled,
      changeInitiatedWithThisComponent,
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
