import InlineComponent from './abstract/InlineComponent';

export default class Text extends InlineComponent {
  static componentType = "text";

  static includeBlankStringChildren = true;

  static variableForPlainMacro = "value";


  static returnChildGroups() {

    return [{
      group: "textLike",
      componentTypes: ["string", "text", "_singleCharacterInline", "_inlineRenderInlineChildren"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      public: true,
      componentType: this.componentType,
      hasEssential: true,
      stateVariablesPrescribingAdditionalAttributes: {
        fixed: "fixed",
      },
      returnDependencies: () => ({
        textLikeChildren: {
          dependencyType: "child",
          childGroups: ["textLike"],
          variableNames: ["text"],
        },
      }),
      defaultValue: "",
      set: x => x === null ? "" : String(x),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.textLikeChildren.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              value: true
            }
          }
        }
        let value = "";
        for (let comp of dependencyValues.textLikeChildren) {
          if (typeof comp === "string") {
            value += comp;
          } else {
            value += comp.stateValues.text;
          }
        }
        return { setValue: { value } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {
        let numChildren = dependencyValues.textLikeChildren.length;
        if (numChildren > 1) {
          return { success: false };
        }
        if (numChildren === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "textLikeChildren",
              desiredValue: desiredStateVariableValues.value,
              childIndex: 0,
              variableIndex: 0,
            }]
          };
        }
        // no children, so set essential value to the desired value
        return {
          success: true,
          instructions: [{
            setEssentialValue: "value",
            value: desiredStateVariableValues.value === null ? "" : String(desiredStateVariableValues.value)
          }]
        };
      }
    }

    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { text: dependencyValues.value }
      }),
      inverseDefinition: ({ desiredStateVariableValues }) => ({
        success: true,
        instructions: [{
          setDependency: "value",
          desiredValue: desiredStateVariableValues.text,
        }]
      })

    }

    return stateVariableDefinitions;

  }


  // returnSerializeInstructions() {
  //   let skipChildren = this.childLogic.returnMatches("atLeastZeroStrings").length === 1 &&
  //     this.childLogic.returnMatches("atLeastZeroTexts").length === 0;
  //   if (skipChildren) {
  //     let stateVariables = ["value"];
  //     return { skipChildren, stateVariables };
  //   }
  //   return {};
  // }

}