import BaseComponent from './abstract/BaseComponent';

export class FeedbackDefinition extends BaseComponent {
  static componentType = "feedbackdefinition";


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

    let stateVariableDefinitions = {};

    stateVariableDefinitions.value = {
      returnDependencies: () => ({
        feedbackCodeChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneFeedbackCode",
          variableNames: ["value"]
        },
        feedbackTextChild: {
          dependencyType: "childStateVariables",
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

    let stateVariableDefinitions = {};

    stateVariableDefinitions.value = {
      isArray: true,
      entryPrefixes: ["feedbackDefinition"],
      returnDependencies: () => ({
        feedbackDefinitionChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroFeedbackDefinitions",
          variableNames: ["value"]
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          value: dependencyValues.feedbackDefinitionChildren
            .map(x => x.stateValues.value)
        }
      })
    }

    return stateVariableDefinitions;

  }

}
