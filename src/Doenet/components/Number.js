import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export default class NumberComponent extends InlineComponent {
  static componentType = "number";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["value"] };

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.displayDigits = { default: 10 };
    properties.displaySmallAsZero = { default: false };
    properties.renderAsMath = { default: false, forRenderer: true };
    return properties;
  }

  static returnChildLogic(args) {
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

    ;

    let addMath = function ({ activeChildrenMatched }) {
      // Note: math will get adapted into a number
      let mathChildren = [];
      for (let child of activeChildrenMatched) {
        mathChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "math", children: mathChildren }],
      }
    }


    let atLeastZeroStrings = childLogic.newLeaf({
      name: "atLeastZeroStrings",
      componentType: 'string',
      comparison: 'atLeast',
      number: 0,
    });
    let atLeastOneMath = childLogic.newLeaf({
      name: "atLeastOneMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 1,
    });
    let stringsAndMaths = childLogic.newOperator({
      name: "stringsAndMaths",
      operator: 'and',
      propositions: [atLeastZeroStrings, atLeastOneMath],
      requireConsecutive: true,
      isSugar: true,
      replacementFunction: addMath
    });

    childLogic.newOperator({
      name: "stringXorNumberXorSugar",
      operator: 'xor',
      propositions: [exactlyOneNumber, stringsAndMaths, atMostOneString],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      public: true,
      componentType: this.componentType,
      returnDependencies: () => ({
        numberChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneNumber",
          variableNames: ["value", "canBeModified"],
          requireChildLogicInitiallySatisfied: true,
        },
        stringChild: {
          dependencyType: "child",
          childLogicName: "atMostOneString",
          variableNames: ["value"],
          requireChildLogicInitiallySatisfied: true,
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
      set: function (value) {
        // this function is called when
        // - definition is overridden by a ref prop
        // - when processing new state variable values
        //   (which could be from outside sources)
        let number = Number(value);
        if (Number.isNaN(number)) {
          try {
            number = me.fromText(value).evaluate_to_constant();
            if (number === null) {
              number = NaN;
            }
          } catch (e) {
            number = NaN;
          }
        }
        return number;
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
      forRenderer: true,
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
        if (Number.isNaN(dependencyValues.value)) {
          return { newValues: { math: me.fromAst('\uff3f') } };
        } else {
          return { newValues: { math: me.fromAst(dependencyValues.value) } };
        }
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
          dependencyType: "child",
          childLogicName: "exactlyOneNumber",
          variableNames: ["canBeModified"],
          requireChildLogicInitiallySatisfied: true,
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



  returnSerializeInstructions() {
    let stringMatches = this.childLogic.returnMatches("atMostOneString");
    let skipChildren = stringMatches && stringMatches.length === 1;
    if (skipChildren) {
      let stateVariables = ["value"];
      return { skipChildren, stateVariables };
    }
    return {};
  }


  adapters = ["math", "text"];

}
