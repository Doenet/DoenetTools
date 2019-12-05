import InlineComponent from './abstract/InlineComponent';

export default class Text extends InlineComponent {
  static componentType = "text";

  static includeBlankStringChildren = true;

  static returnChildLogic (args) {
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

    childLogic.newOperator({
      name: "stringsAndTexts",
      operator: 'and',
      propositions: [atLeastZeroStrings, atLeastZeroTexts],
      requireConsecutive: true,
      setAsBase: true
    });

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
      }),
      defaultValue: "",
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
            value: desiredStateVariableValues.value
          }]
        };
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
      text: this.stateValues.value,
    });
  }

  updateRenderer() {
    this.renderer.updateText(this.stateValues.value);
  }


}