import BlockComponent from './abstract/BlockComponent';

export default class Feedback extends BlockComponent {
  static componentType = "feedback";

  static primaryStateVariableForDefinition = "feedbackText";

  static createPropertiesObject() {
    let properties = super.createPropertiesObject();
    delete properties.hide;
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneCondition = childLogic.newLeaf({
      name: "atMostOneCondition",
      componentType: 'condition',
      comparison: 'atMost',
      number: 1,
      allowSpillover: false,
    });

    let atLeastZeroAnything = childLogic.newLeaf({
      name: "atLeastZeroAnything",
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "ifAndRest",
      operator: "and",
      propositions: [atMostOneCondition, atLeastZeroAnything],
      setAsBase: true,
    })

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.hide = {
      forRenderer: true,
      returnDependencies: () => ({
        conditionChild: {
          dependencyType: "child",
          childLogicName: "atMostOneCondition",
          variableNames: ["value"],
        },
      }),
      definition: function ({ dependencyValues }) {

        let hide;
        if (dependencyValues.conditionChild.length === 0) {
          hide = false;
        } else {
          hide = !dependencyValues.conditionChild[0].stateValues.value;
        }

        return { newValues: { hide } }
      }
    };

    // for case when created from a copy prop
    stateVariableDefinitions.feedbackText = {
      forRenderer: true,
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          feedbackText: { variablesToCheck: ["feedbackText"] }
        }
      })
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        children: {
          dependencyType: "child",
          childLogicName: "atLeastZeroAnything"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            childrenToRender: dependencyValues.children.map(x => x.componentName)
          }
        }
      }
    }


    return stateVariableDefinitions;
  }

}
