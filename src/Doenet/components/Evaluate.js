import MathComponent from './Math';
import me from 'math-expressions';

export default class Evaluate extends MathComponent {
  static componentType = "evaluate";
  static rendererType = "math";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.symbolic = { default: false };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    let atLeastZeroFunctions = childLogic.newLeaf({
      name: "atLeastZeroFunctions",
      componentType: 'function',
      comparison: 'atLeast',
      number: 0,
      requireConsecutive: true,
    });
    let atMostOneMath = childLogic.newLeaf({
      name: "atMostOneMath",
      componentType: 'math',
      comparison: 'atMost',
      number: 1,
    });
    childLogic.newOperator({
      name: "FunctionsAndMaths",
      operator: 'or',
      propositions: [atLeastZeroFunctions, atMostOneMath],
      setAsBase: true,
    });

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

    stateVariableDefinitions.evaluatedResults = {
      isArray: true,
      entryPrefixes: ["evaluatedResult"],
      public: true,
      componentType: "math",
      returnDependencies: () => ({
        symbolic: {
          dependencyType: "stateVariable",
          variableName: "symbolic",
        },
        functionChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroFunctions",
          variableNames: ["f", "numericalf"]
        },
        mathChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneMath",
          variableNames: ["value"]
        }
      }),
      definition: function ({ dependencyValues, changes }) {

        if (dependencyValues.functionChildren.length == 0
          || dependencyValues.mathChild.length == 0
        ) {
          return {
            useEssentialOrDefaultValue: {
              evaluatedResults: { variablesToCheck: ["evaluatedResults"] }
            }
          }
        }

        let evaluatedResults = [];

        if (dependencyValues.symbolic) {
          let input = dependencyValues.mathChild[0].stateValues.value;
          for (let fChild of dependencyValues.functionChildren) {
            evaluatedResults.push(fChild.stateValues.f(input));
          }
        } else {
          let numericInput = dependencyValues.mathChild[0].stateValues.value.evaluate_to_constant();
          for (let fChild of dependencyValues.functionChildren) {
            evaluatedResults.push(
              me.fromAst(fChild.stateValues.numericalf(numericInput)))
          }
        }

        return {
          newValues: { evaluatedResults }
        }

      }
    }

    stateVariableDefinitions.evaluatedResult = {
      isAlias: true,
      targetVariableName: "evaluatedResult1"
    };

    stateVariableDefinitions.unnormalizedValue = {
      public: true,
      componentType: this.componentType,
      returnDependencies: () => ({
        evaluatedResults: {
          dependencyType: "stateVariable",
          variableName: "evaluatedResults"
        }
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.evaluatedResults.length === 1) {
          return { newValues: { unnormalizedValue: dependencyValues.evaluatedResults[0] } }
        } else if (dependencyValues.evaluatedResults.length > 1) {
          return { newValues: { unnormalizedValue: me.fromAst(["tuple", ...dependencyValues.evaluatedResults.map(x => x.tree)]) } }
        } else {
          return { newValues: { unnormalizedValue: me.fromAst('\uFF3F') } }
        }

      }
    }

    return stateVariableDefinitions;

  }

}