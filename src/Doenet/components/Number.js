import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export default class NumberComponent extends InlineComponent {
  static componentType = "number";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.displayDigits = { default: 10 };
    properties.displaySmallAsZero = { default: false };
    properties.renderMode = { default: "text" };
    return properties;
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneString = childLogic.newLeaf({
      name: "atMostOneString",
      componentType: 'string',
      comparison: 'atMost',
      number: 1,
    });
    let exactlyOneNumber = childLogic.newLeaf({
      name: "exactlyOneNumber",
      componentType: 'number',
      number: 1,
    });
    childLogic.newOperator({
      name: "stringXorNumber",
      operator: 'xor',
      propositions: [atMostOneString, exactlyOneNumber],
      setAsBase: true,
    });
    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.value = {
      public: true,
      componentType: this.componentType,
      returnDependencies: () => ({
        numberChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneNumber",
          variableNames: ["value", "canBeModified"],
        },
        stringChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneString",
          variableNames: ["value"],
        },
      }),
      defaultValue: NaN,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.numberChild.length === 0) {
          if (dependencyValues.stringChild.length === 0) {
            return { useEssentialOrDefaultValue: { value: { variablesToCheck: ["value"] } } }
          }
          let number = Number(dependencyValues.stringChild[0].stateValues.value);
          if (Number.isNaN(number)) {
            try {
              number = me.fromText(dependencyValues.stringChild[0].stateValues.value).evaluate_to_constant();
              if (number === null) {
                number = NaN;
              }
            } catch (e) {
              number = NaN;
            }
          }
          return { newValues: { value: number } };
        } else {
          return { newValues: { value: dependencyValues.numberChild[0].stateValues.value } }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues, stateValues, overrideFixed }) {

        if (!stateValues.canBeModified && !overrideFixed) {
          return { success: false };
        }

        let desiredValue = desiredStateVariableValues.value;
        if (desiredValue instanceof me.class) {
          desiredValue = desiredValue.evaluate_to_constant();
        } else {
          desiredValue = Number(desiredValue);
        }

        let instructions;

        if (dependencyValues.numberChild.length === 0) {
          if (dependencyValues.stringChild.length === 0) {
            instructions = [{
              setStateVariable: "value",
              value: desiredValue,
            }];
          } else {
            // TODO: would it be more efficient to defer setting value of string?
            instructions = [{
              setDependency: "stringChild",
              desiredValue: desiredValue.toString(),
              childIndex: 0,
              variableIndex: 0,
            }];
          }
        } else {
          instructions = [{
            setDependency: "numberChild",
            desiredValue: desiredValue,
            childIndex: 0,
            variableIndex: 0,
          }];
        }

        return {
          success: true,
          instructions,
        }
      },
    }

    stateVariableDefinitions.valueForDisplay = {
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits"
        },
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero"
        },
      }),
      definition: function ({ dependencyValues }) {//value, displayDigits, displaySmallAsZero, simplify, expand }) {
        // for display via latex and text, round any decimal numbers to the significant digits
        // determined by displaydigits
        let rounded = me.round_numbers_to_precision(dependencyValues.value, dependencyValues.displayDigits).tree;
        if (dependencyValues.displaySmallAsZero) {
          if (Math.abs(rounded) < 1E-14) {
            rounded = 0;
          }
        }
        return {
          newValues: {
            valueForDisplay: rounded
          }
        }
      }
    }

    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        valueForDisplay: {
          dependencyType: "stateVariable",
          variableName: "valueForDisplay"
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { text: dependencyValues.valueForDisplay.toString() } };
      }
    }

    stateVariableDefinitions.math = {
      public: true,
      componentType: "math",
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { math: me.fromAst(dependencyValues.value) } };
      },
      inverseDefinition: function ({ desiredStateVariableValues }) {

        let desiredNumber = desiredStateVariableValues.math.evaluate_to_constant();
        if (desiredNumber === null) {
          desiredNumber = NaN;
        }
        return {
          success: true,
          instructions: [{
            setDependency: "value",
            desiredValue: desiredNumber,
          }],
        }

      },
    }

    // Note: don't need canBeModified for number logic, as core will already
    // be able to determine from modifyIndirectly and fixed that it cannot be modified
    // However, include this state variable for case when number is included in math
    stateVariableDefinitions.canBeModified = {
      returnDependencies: () => ({
        numberChildModifiable: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneNumber",
          variableNames: ["canBeModified"]
        },
        modifyIndirectly: {
          dependencyType: "stateVariable",
          variableName: "modifyIndirectly",
        },
        fixed: {
          dependencyType: "stateVariable",
          variableName: "fixed",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.modifyIndirectly || dependencyValues.fixed) {
          return { newValues: { canBeModified: false } };
        }

        if (dependencyValues.numberChildModifiable.length === 1 &&
          !dependencyValues.numberChildModifiable[0].stateValues.canBeModified) {
          return { newValues: { canBeModified: false } };
        }

        return { newValues: { canBeModified: true } };

      },
    }

    return stateVariableDefinitions;

  }


  useChildrenForReference = false;

  get stateVariablesForReference() {
    return ["value"];
  }

  returnSerializeInstructions() {
    let skipChildren = this.childLogic.returnMatches("atMostOneString").length === 1;
    if (skipChildren) {
      let stateVariables = ["value"];
      return { skipChildren, stateVariables };
    }
    return {};
  }


  adapters = ["math", "text"];

  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    if (this.stateValues.renderMode === "text") {
      this.renderer = new this.availableRenderers.text({
        key: this.componentName,
        text: this.stateValues.text,
      });
    } else {
      this.renderer = new this.availableRenderers.math({
        key: this.componentName,
        mathLatex: this.stateValues.text,
        renderMode: this.stateValues.renderMode,
      });
    }
  }

  updateRenderer() {
    if (this.stateValues.renderMode === "text") {
      if (!(this.renderer instanceof this.availableRenderers.text)) {
        delete this.renderer;
        this.initializeRenderer();
      } else {
        this.renderer.updateText(this.stateValues.text);
      }
    } else if (!(this.renderer instanceof this.availableRenderers.math)) {
      delete this.renderer;
      this.initializeRenderer();
    } else {
      this.renderer.updateMathLatex(this.stateValues.text);
    }
  }

}
