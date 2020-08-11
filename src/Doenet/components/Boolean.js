import InlineComponent from './abstract/InlineComponent';

export default class BooleanComponent extends InlineComponent {
  static componentType = "boolean";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["value"] };

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroStrings = childLogic.newLeaf({
      name: "atLeastZeroStrings",
      componentType: 'string',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroTexts = childLogic.newLeaf({
      name: "atLeastZeroTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 0,
    });

    let stringsAndTexts = childLogic.newOperator({
      name: "stringsAndTexts",
      operator: 'and',
      propositions: [atLeastZeroStrings, atLeastZeroTexts],
      requireConsecutive: true,
    });

    let exactlyOneBoolean = childLogic.newLeaf({
      name: "exactlyOneBoolean",
      componentType: 'boolean',
      number: 1,
    });

    let exactlyOneWhen = childLogic.newLeaf({
      name: "exactlyOneWhen",
      componentType: 'when',
      number: 1,
    });

    childLogic.newOperator({
      name: "TextXorBooleanXorWhen",
      operator: "xor",
      propositions: [stringsAndTexts, exactlyOneBoolean, exactlyOneWhen],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      public: true,
      componentType: this.componentType,
      forRenderer: true,
      returnDependencies: () => ({
        stringTextChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsAndTexts",
          variableNames: ["value"],
          requireChildLogicInitiallySatisfied: true,
        },
        booleanChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneBoolean",
          variableNames: ["value"],
          requireChildLogicInitiallySatisfied: true,
        },
        whenChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneWhen",
          variableNames: ["conditionSatisfied"],
          requireChildLogicInitiallySatisfied: true,
        },
      }),
      defaultValue: false,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.stringTextChildren.length === 0) {
          if (dependencyValues.booleanChild.length === 0) {
            if (dependencyValues.whenChild.length === 0) {
              return {
                useEssentialOrDefaultValue: {
                  value: { variablesToCheck: ["value", "implicitValue"] }
                }
              }
            } else {
              return { newValues: { value: dependencyValues.whenChild[0].stateValues.conditionSatisfied } }
            }
          } else {
            return { newValues: { value: dependencyValues.booleanChild[0].stateValues.value } }
          }
        } else {
          let text = "";
          for (let comp of dependencyValues.stringTextChildren) {
            text += comp.stateValues.value;
          }
          let value = ["true", "t"].includes(text.trim().toLowerCase());

          return { newValues: { value } };
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.stringTextChildren.length === 0) {
          if (dependencyValues.booleanChild.length === 0) {
            if (dependencyValues.whenChild.length === 0) {
              // no children, so value is essential and give it the desired value
              return {
                success: true,
                instructions: [{
                  setStateVariable: "value",
                  value: desiredStateVariableValues.value
                }]
              };
            } else {
              // can't invert if have when child
              return { success: false }
            }
          } else {
            return {
              success: true,
              instructions: [{
                setDependency: "booleanChild",
                desiredValue: desiredStateVariableValues.value,
                childIndex: 0,
                variableIndex: 0,
              }]
            };
          }
        } else {

          let numChildren = dependencyValues.stringTextChildren.length;
          if (numChildren > 1) {
            return { success: false };
          }
          if (numChildren === 1) {
            return {
              success: true,
              instructions: [{
                setDependency: "stringTextChildren",
                desiredValue: desiredStateVariableValues.value.toString(),
                childIndex: 0,
                variableIndex: 0,
              }]
            };
          }
        }
      }
    }


    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { text: dependencyValues.value ? "true" : "false" } }
      }
    }

    return stateVariableDefinitions;

  }


  returnSerializeInstructions() {
    let skipChildren = this.childLogic.returnMatches("atLeastZeroStrings").length === 1 &&
      this.childLogic.returnMatches("atLeastZeroTexts").length === 0;
    if (skipChildren) {
      let stateVariables = ["value"];
      return { skipChildren, stateVariables };
    }
    return {};
  }


}