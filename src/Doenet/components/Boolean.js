import InlineComponent from './abstract/InlineComponent';

export default class BooleanComponent extends InlineComponent {
  static componentType = "boolean";


  static returnChildLogic({ standardComponentTypes, allComponentClasses, components }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

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

    let exactlyOneIf = childLogic.newLeaf({
      name: "exactlyOneIf",
      componentType: 'if',
      number: 1,
    });

    childLogic.newOperator({
      name: "TextXorBooleanXorIf",
      operator: "xor",
      propositions: [stringsAndTexts, exactlyOneBoolean, exactlyOneIf],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.value = {
      public: true,
      componentType: this.componentType,
      // deferCalculation: false,
      returnDependencies: () => ({
        stringTextChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsAndTexts",
          variableNames: ["value"],
        },
        booleanChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneBoolean",
          variableNames: ["value"],
        },
        ifChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneIf",
          variableNames: ["value"],
        },
      }),
      defaultValue: false,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.stringTextChildren.length === 0) {
          if (dependencyValues.booleanChild.length === 0) {
            if (dependencyValues.ifChild.length === 0) {
              return {
                useEssentialOrDefaultValue: {
                  value: { variablesToCheck: ["value", "implicitValue"] }
                }
              }
            } else {
              throw Error("Haven't implemented <if> yet for boolean")
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
        throw Error("Need to implement inverse definition for boolean")
      }
    }


    stateVariableDefinitions.textValue = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { textValue: dependencyValues.value ? "true" : "false" } }
      }
    }

    return stateVariableDefinitions;

  }

  useChildrenForReference = false;

  get stateVariablesForReference() {
    return ["value"];
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


  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    this.renderer = new this.availableRenderers.text({
      key: this.componentName,
      text: this.stateValues.textValue
    });
  }

  updateRenderer() {
    this.renderer.updateText(this.stateValues.textValue);
  }

}