import CompositeComponent from "./abstract/CompositeComponent";

export default class Setup extends CompositeComponent {
  static componentType = "setup";

  static returnChildGroups() {
    return [
      {
        group: "styleDefinitions",
        componentTypes: ["styleDefinitions"],
      },
      {
        group: "feedbackDefinitions",
        componentTypes: ["feedbackDefinitions"],
      },
      {
        group: "anything",
        componentTypes: ["_base"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.componentNameForAttributes = {
      returnDependencies: () => ({
        sourceCompositeIdentity: {
          dependencyType: "sourceCompositeIdentity",
        },
      }),
      definition({ dependencyValues }) {
        let componentNameForAttributes = null;
        if (dependencyValues.sourceCompositeIdentity) {
          componentNameForAttributes =
            dependencyValues.sourceCompositeIdentity.componentName;
        }
        return { setValue: { componentNameForAttributes } };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({}),
      definition() {
        return {
          setValue: { readyToExpandWhenResolved: true },
        };
      },
    };

    return stateVariableDefinitions;
  }
}
