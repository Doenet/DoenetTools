import InlineComponent from './InlineComponent';

export default class SingleCharacter extends InlineComponent {
  static componentType = "_singleCharacterInline";

  // Note: this attribute is just for the text state variable, below.
  // It is ignored in the renderers themselves.
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