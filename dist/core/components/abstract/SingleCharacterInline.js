import InlineComponent from './InlineComponent.js';

export default class SingleCharacter extends InlineComponent {
  static componentType = "_singleCharacterInline";

  static unicodeCharacter = "";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();
    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { text: this.unicodeCharacter } })
    }

    return stateVariableDefinitions;
  }
}