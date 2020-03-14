import InlineComponent from './InlineComponent';

export default class Input extends InlineComponent {
  static componentType = "_input";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.collaborateGroups = { default: undefined };
    return properties;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.creditAchieved = {
      defaultValue: 0,
      public: true,
      componentType: "number",
      forRenderer: true,
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

    stateVariableDefinitions.answerAncestor = {
      returnDependencies: () => ({
        answerAncestor: {
          dependencyType: "ancestorStateVariables",
          componentType: "answer",
          variableNames: ["delegateCheckWork", "justSubmitted"]
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: { answerAncestor: dependencyValues.answerAncestor }
        }
      }
    }


    stateVariableDefinitions.includeCheckWork = {
      forRenderer: true,
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


    stateVariableDefinitions.disabled = {
      forRenderer: true,
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
      definition: function ({ dependencyValues }) {
        let disabled = false;
        if (dependencyValues.collaborateGroups) {
          disabled = !dependencyValues.collaborateGroups.matchGroup(dependencyValues.collaboration)
        }
        return { newValues: { disabled } }
      }
    }


    stateVariableDefinitions.valueHasBeenValidated = {
      forRenderer: true,
      returnDependencies: () => ({
        answerAncestor: {
          dependencyType: "stateVariable",
          variableName: "answerAncestor"
        },
      }),
      definition: function ({ dependencyValues }) {

        let valueHasBeenValidated = false;

        if (dependencyValues.answerAncestor &&
          dependencyValues.answerAncestor.stateValues.justSubmitted) {
          valueHasBeenValidated = true;
        }
        return {
          newValues: { valueHasBeenValidated }
        }
      }
    }

    return stateVariableDefinitions;
  }
}
