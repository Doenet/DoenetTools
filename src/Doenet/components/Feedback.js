import BlockComponent from './abstract/BlockComponent';
import ConditionalContent from './ConditionalContent';

export default class Feedback extends BlockComponent {
  static componentType = "feedback";

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
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneCondition",
          variableNames: ["conditionSatisfied"],
        },
      }),
      definition: function ({ dependencyValues }) {

        let hide;
        if (dependencyValues.conditionChild.length === 0) {
          hide = true;
        } else {
          hide = !dependencyValues.conditionChild[0].stateValues.conditionSatisfied;
        }

        return { newValues: { hide } }
      }
    };


    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        children: {
          dependencyType: "childIdentity",
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
