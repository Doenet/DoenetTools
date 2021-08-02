import InlineComponent from './abstract/InlineComponent';

export default class Text extends InlineComponent {
  static componentType = "text";

  static includeBlankStringChildren = true;

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["value"] };

  static returnChildGroups() {

    return [{
      group: "stringsAndTexts",
      componentTypes: ["string", "text"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      public: true,
      componentType: this.componentType,
      // deferCalculation: false,
      returnDependencies: () => ({
        stringTextChildren: {
          dependencyType: "child",
          childGroups: ["stringsAndTexts"],
          variableNames: ["value"],
        },
      }),
      defaultValue: "",
      set: x => x === null ? "" : String(x),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.stringTextChildren.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              value: { variablesToCheck: "value" }
            }
          }
        }
        let value = "";
        for (let comp of dependencyValues.stringTextChildren) {
          value += comp.stateValues.value;
        }
        return { newValues: { value } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {
        let numChildren = dependencyValues.stringTextChildren.length;
        if (numChildren > 1) {
          return { success: false };
        }
        if (numChildren === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "stringTextChildren",
              desiredValue: desiredStateVariableValues.value,
              childIndex: 0,
              variableIndex: 0,
            }]
          };
        }
        // no children, so value is essential and give it the desired value
        return {
          success: true,
          instructions: [{
            setStateVariable: "value",
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
        newValues: { text: dependencyValues.value }
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