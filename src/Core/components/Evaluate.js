import MathComponent from './Math';
import me from 'math-expressions';

export default class Evaluate extends MathComponent {
  static componentType = "evaluate";
  static rendererType = "math";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.forceSymbolic = {
      createComponentOfType: "boolean",
      createStateVariable: "forceSymbolic",
      defaultValue: false,
      public: true,
    };
    attributes.forceNumeric = {
      createComponentOfType: "boolean",
      createStateVariable: "forceNumeric",
      defaultValue: false,
      public: true,
    };

    attributes.function = {
      createComponentOfType: "function"
    }

    attributes.input = {
      createComponentOfType: "mathList",
    }


    return attributes;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.codePre;
    delete stateVariableDefinitions.expressionWithCodes;
    delete stateVariableDefinitions.codesAdjacentToStrings;
    delete stateVariableDefinitions.mathChildrenByArrayComponent;

    stateVariableDefinitions.canBeModified = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { canBeModified: false } })
    }

    stateVariableDefinitions.unnormalizedValue = {
      public: true,
      componentType: "math",
      returnDependencies() {
        return {
          inputAttr: {
            dependencyType: "attributeComponent",
            attributeName: "input",
            variableNames: ["nComponents", "maths"]
          },
          functionAttr: {
            dependencyType: "attributeComponent",
            attributeName: "function",
            variableNames: ["symbolicf", "numericalf", "symbolic", "nInputs"],
          },
          forceSymbolic: {
            dependencyType: "stateVariable",
            variableName: "forceSymbolic"
          },
          forceNumeric: {
            dependencyType: "stateVariable",
            variableName: "forceNumeric"
          }
        }

      },
      definition({ dependencyValues }) {

        if (!(dependencyValues.functionAttr
          && dependencyValues.inputAttr
          && dependencyValues.inputAttr.stateValues.nComponents
          === dependencyValues.functionAttr.stateValues.nInputs
        )) {

          return {
            newValues: {
              unnormalizedValue: me.fromAst('\uFF3F')
            }
          }

        }



        let input = dependencyValues.inputAttr.stateValues.maths;

        let unnormalizedValue;

        let functionComp = dependencyValues.functionAttr;
        if (!dependencyValues.forceNumeric &&
          (functionComp.stateValues.symbolic || dependencyValues.forceSymbolic)
        ) {
          unnormalizedValue = functionComp.stateValues.symbolicf(...input);
        } else {
          let numericInput = input.map(x => x.evaluate_to_constant())
            .map(x => x === null ? NaN : x);

          unnormalizedValue = me.fromAst(functionComp.stateValues.numericalf(...numericInput))

        }

        // console.log("unnormalizedValue")
        // console.log(unnormalizedValue)

        return {
          newValues: { unnormalizedValue }
        }

      }
    }

    return stateVariableDefinitions;

  }

}