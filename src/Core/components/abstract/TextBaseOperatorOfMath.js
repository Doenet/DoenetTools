import TextComponent from '../Text';

export default class TextBaseOperatorOfMath extends TextComponent {
  static componentType = "_textOperatorOfMath";
  static rendererType = "text";

  static returnChildGroups() {

    return [{
      group: "maths",
      componentTypes: ["math"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let constructor = this;

    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      returnDependencies: () => ({
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value"]
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            value: constructor.applyTextOperator(
              dependencyValues.mathChildren
                .map(x => x.stateValues.value)
            )
          }
        }
      }
    }

    return stateVariableDefinitions;

  }


}
