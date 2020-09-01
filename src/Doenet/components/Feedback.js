import ConditionalContent from './ConditionalContent';

export default class Feedback extends ConditionalContent {
  static componentType = "feedback";


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.hide = {
      returnDependencies: () => ({
        conditionChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneCondition",
          variableNames: ["conditionSatisfied"],
        },
        showFeedback: {
          dependencyType: "flag",
          flagName: "showFeedback"
        }
      }),
      definition: function ({ dependencyValues }) {

        let hide;
        if (!dependencyValues.showFeedback || dependencyValues.conditionChild.length === 0) {
          hide = true;
        } else {
          hide = !dependencyValues.conditionChild[0].stateValues.conditionSatisfied;
        }

        return { newValues: { hide } }
      }
    };
    return stateVariableDefinitions;
  }

}
