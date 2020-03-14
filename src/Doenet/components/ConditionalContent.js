import BlockComponent from './abstract/BlockComponent';

export default class ConditionalContent extends BlockComponent {
  static componentType = "conditionalcontent";

  static createPropertiesObject() {
    let properties = super.createPropertiesObject();
    delete properties.hide;
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneIf = childLogic.newLeaf({
      name: "atMostOneIf",
      componentType: 'if',
      comparison: 'atMost',
      number: 1,
      allowSpillover: false,
    });

    let atLeastZeroInline = childLogic.newLeaf({
      name: "atLeastZeroInline",
      componentType: '_inline',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroBlock = childLogic.newLeaf({
      name: "atLeastZeroBlock",
      componentType: '_block',
      comparison: 'atLeast',
      number: 0,
    });

    let inlineAndBlock = childLogic.newOperator({
      name: "inlineAndBlock",
      operator: "and",
      propositions: [atLeastZeroInline, atLeastZeroBlock],
    })

    childLogic.newOperator({
      name: "ifAndRest",
      operator: "and",
      propositions: [atMostOneIf, inlineAndBlock],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.hide = {
      returnDependencies: () => ({
        ifChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneIf",
          variableNames: ["conditionSatisfied"],
        },
      }),
      definition: function ({ dependencyValues }) {

        let hide;
        if (dependencyValues.ifChild.length === 0) {
          hide = true;
        } else {
          hide = !dependencyValues.ifChild[0].stateValues.conditionSatisfied;
        }

        return { newValues: { hide } }
      }
    };

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        inlineBlockChildren: {
          dependencyType: "childIdentity",
          childLogicName: "inlineAndBlock",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            childrenToRender: dependencyValues.inlineBlockChildren.map(x => x.componentName)
          }
        }
      }
    }

    return stateVariableDefinitions;
  }


  initializeRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new this.availableRenderers.container({ key: this.componentName });
    }
  }

}
