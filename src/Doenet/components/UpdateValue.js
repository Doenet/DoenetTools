import BlockComponent from './abstract/BlockComponent';

export default class UpdateValue extends BlockComponent {
  constructor(args) {
    super(args);
    this.updateValue = this.updateValue.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );

    this.actions = {
      updateValue: this.updateValue
    };

  }
  static componentType = "updatevalue";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    // properties.width = {default: 300};
    // properties.height = {default: 50};
    properties.label = { default: "update value", forRenderer: true };

    return properties;
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneMathTarget = childLogic.newLeaf({
      name: "exactlyOneMathTarget",
      componentType: 'mathtarget',
      number: 1,
    });

    let exactlyOneNewMathValue = childLogic.newLeaf({
      name: "exactlyOneNewMathValue",
      componentType: 'newmathvalue',
      number: 1,
    });

    childLogic.newOperator({
      name: "updateValueLogic",
      operator: 'and',
      propositions: [exactlyOneMathTarget, exactlyOneNewMathValue],
      setAsBase: true,
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.targetedMathName = {
      returnDependencies: () => ({
        mathTarget: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneMathTarget",
          variableNames: ["mathChildName"]
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            targetedMathName: dependencyValues.mathTarget[0].stateValues.mathChildName
          }
        };
      },
    }

    stateVariableDefinitions.newMathValue = {
      returnDependencies: () => ({
        newMathValueChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneNewMathValue",
          variableNames: ["value"]
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            newMathValue: dependencyValues.newMathValueChild[0].stateValues.value
          }
        };
      },
    }

    return stateVariableDefinitions;

  }


  updateValue({ }) {
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.stateValues.targetedMathName,
        stateVariable: "value",
        value: this.stateValues.newMathValue,
      }]
    });

  }

}