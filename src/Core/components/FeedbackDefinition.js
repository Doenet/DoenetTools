import BaseComponent from './abstract/BaseComponent';

export class FeedbackDefinition extends BaseComponent {
  static componentType = "feedbackdefinition";

  static createPropertiesObject() {
    return {};
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneFeedbackCode = childLogic.newLeaf({
      name: "exactlyOneFeedbackCode",
      componentType: 'feedbackcode',
      number: 1
    });

    let exactlyOneFeedbackText = childLogic.newLeaf({
      name: "exactlyOneFeedbackText",
      componentType: 'feedbacktext',
      number: 1
    });

    childLogic.newOperator({
      name: "feedbackMapping",
      operator: "and",
      propositions: [exactlyOneFeedbackCode, exactlyOneFeedbackText],
      setAsBase: true
    })

    return childLogic

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      returnDependencies: () => ({
        feedbackCodeChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneFeedbackCode",
          variableNames: ["value"]
        },
        feedbackTextChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneFeedbackText",
          variableNames: ["value"]
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          value: {
            feedbackCode: dependencyValues.feedbackCodeChild[0].stateValues.value.toLowerCase(),
            feedbackText: dependencyValues.feedbackTextChild[0].stateValues.value
          }
        }
      })
    }


    return stateVariableDefinitions;

  }

}


export class FeedbackDefinitions extends BaseComponent {
  static componentType = "feedbackdefinitions";

  static createPropertiesObject() {
    return {};
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atLeastZeroFeedbackDefinitions",
      componentType: 'feedbackDefinition',
      comparison: "atLeast",
      number: 0,
      setAsBase: true
    });

    return childLogic

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nDefinitions = {
      returnDependencies: () => ({
        feedbackDefinitionChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroFeedbackDefinitions",
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          nDefinitions: dependencyValues.feedbackDefinitionChildren.length
        }
      })
    }

    stateVariableDefinitions.value = {
      isArray: true,
      entryPrefixes: ["feedbackDefinition"],
      returnArraySizeDependencies: () => ({
        nDefinitions: {
          dependencyType: "stateVariable",
          variableName: "nDefinitions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nDefinitions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey.feedbackDefinitionChild = {
            dependencyType: "child",
            childLogicName: "atLeastZeroFeedbackDefinitions",
            variableNames: ["value"],
            childIndices: [arrayKey]
          };
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let value = {};

        for (let arrayKey of arrayKeys) {
          let feedbackDefinitionChild = dependencyValuesByKey[arrayKey].feedbackDefinitionChild;
          if (feedbackDefinitionChild.length === 1) {
            value[arrayKey] = feedbackDefinitionChild[0].stateValues.value;
          }
        }

        return { newValues: { value } }
      }
    }

    return stateVariableDefinitions;

  }

}
