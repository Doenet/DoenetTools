import BaseComponent from './abstract/BaseComponent.js';

export default class ConsiderAsResponses extends BaseComponent {
  static componentType = "considerAsResponses";
  static rendererType = undefined;

  static returnChildGroups() {

    return [{
      group: "anything",
      componentTypes: ["_base"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.childrenWithNValues = {
      returnDependencies: () => ({
        children: {
          dependencyType: "child",
          childGroups: ["anything"],
          variableNames: ["nValues"],
          variablesOptional: true,
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { childrenWithNValues: dependencyValues.children }
      })
    }

    stateVariableDefinitions.childrenAsResponses = {
      returnDependencies: () => ({
        children: {
          dependencyType: "child",
          childGroups: ["anything"],
          variableNames: ["value", "values", "componentType"],
          variablesOptional: true,
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { childrenAsResponses: dependencyValues.children }
      })
    }

    return stateVariableDefinitions;

  }
}
