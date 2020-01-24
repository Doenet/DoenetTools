import BlockComponent from './abstract/BlockComponent';

export default class UpdateValue extends BlockComponent {
  constructor(args) {
    super(args);
    this.updateValue = this.updateValue.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
  }
  static componentType = "updatevalue";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    // properties.width = {default: 300};
    // properties.height = {default: 50};
    properties.label = { default: "update value" };

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

    let stateVariableDefinitions = {};

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

  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      return;
    }

    const actions = {
      updateValue: this.updateValue,
    }

    this.renderer = new this.availableRenderers.updatevalue({
      actions: actions,
      key: this.componentName,
      // width: this.state.width,
      // height: this.state.height,
      label: this.stateValues.label,
    });
  }

}