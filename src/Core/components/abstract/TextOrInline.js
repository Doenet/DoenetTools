import { textFromChildren } from "../../utils/text";
import InlineComponent from "./InlineComponent";

export default class TextOrInline extends InlineComponent {
  static componentType = "_textOrInline";
  static renderChildren = true;
  static rendererType = "containerInline";

  static includeBlankStringChildren = true;

  static returnChildGroups() {
    return [
      {
        group: "inlines",
        componentTypes: ["_inline"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: this.componentType,
      },
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "child",
          childGroups: ["inlines"],
          variableNames: ["text"],
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        let value = textFromChildren(dependencyValues.inlineChildren);

        return { setValue: { value } };
      },
    };

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { text: dependencyValues.value },
      }),
    };

    return stateVariableDefinitions;
  }
}
