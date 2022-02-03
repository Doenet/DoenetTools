import InlineComponent from './InlineComponent';

export default class TextOrInline extends InlineComponent {
  static componentType = "_textOrInline";
  static renderChildren = true;

  static includeBlankStringChildren = true;

  static returnChildGroups() {

    return [{
      group: "inlines",
      componentTypes: ["_inline"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      public: true,
      componentType: this.componentType,
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "child",
          childGroups: ["inlines"],
          variableNames: ["text"],
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        let value = "";
        for (let comp of dependencyValues.inlineChildren) {
          if(typeof comp !== "object") {
            value += comp.toString();
          } else if (typeof comp.stateValues.text === "string") {
            value += comp.stateValues.text;
          }
        }
        return { setValue: { value } };
      }
    }

    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { text: dependencyValues.value }
      })
    }


    return stateVariableDefinitions;

  }



}