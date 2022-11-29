import TextComponent from './Text';

export default class Latex extends TextComponent {
  static componentType = "latex";
  static rendererType = "text";

  static returnChildGroups() {

    return [{
      group: "mathTextLike",
      componentTypes: ["math", "m", "md", "latex", "string", "text", "_singleCharacterInline", "_inlineRenderInlineChildren"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.value.returnDependencies = () => ({
      mathTextLikeChildren: {
        dependencyType: "child",
        childGroups: ["mathTextLike"],
        variableNames: ["text", "latex"],
      },
    })

    stateVariableDefinitions.value.definition = function ({ dependencyValues }) {
      if (dependencyValues.mathTextLikeChildren.length === 0) {
        return {
          useEssentialOrDefaultValue: {
            value: true
          }
        }
      }
      let value = "";
      for (let comp of dependencyValues.mathTextLikeChildren) {
        if (typeof comp === "string") {
          value += comp;
        } else if (comp.stateValues.latex !== undefined) {
          value += comp.stateValues.latex;
        } else {
          value += comp.stateValues.text;
        }
      }
      return { setValue: { value } };
    };

    stateVariableDefinitions.value.inverseDefinition = function ({ desiredStateVariableValues, dependencyValues }) {
      let numChildren = dependencyValues.mathTextLikeChildren.length;
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
            variableIndex: dependencyValues.textLikeChildren[0].stateValues?.latex === undefined ? 0 : 1,
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

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
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

    stateVariableDefinitions.latex = {
      isAlias: true,
      targetVariableName: "value"
    };

    return stateVariableDefinitions;

  }


}