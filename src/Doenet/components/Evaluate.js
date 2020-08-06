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

    stateVariableDefinitions.nResults = {
      returnDependencies: () => ({
        functionChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroFunctions",
        },
        mathChild: {
          dependencyType: "childIdentity",
          childLogicName: "atMostOneMath",
        }
      }),
      definition: function ({ dependencyValues }) {

        let nResults;

        if (dependencyValues.functionChildren.length > 0
          && dependencyValues.mathChild.length > 0
        ) {
          nResults = dependencyValues.functionChildren.length;
        } else {
          nResults = 0;
        }

        return { newValues: { nResults } }

      }
    }

    stateVariableDefinitions.evaluatedResults = {
      isArray: true,
      entryPrefixes: ["evaluatedResult"],
      public: true,
      componentType: "math",
      returnArraySizeDependencies: () => ({
        nResults: {
          dependencyType: "stateVariable",
          variableName: "nResults",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nResults];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          symbolic: {
            dependencyType: "stateVariable",
            variableName: "symbolic",
          },
          mathChild: {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneMath",
            variableNames: ["value"]
          }
        }

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            functionChild: {
              dependencyType: "childStateVariables",
              childLogicName: "atLeastZeroFunctions",
              variableNames: ["f", "numericalf"],
              childIndices: [arrayKey]
            },
          }
        }

        return { globalDependencies, dependenciesByKey }
      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {

        let evaluatedResults = {};

        if (globalDependencyValues.mathChild.length > 0) {

          if (globalDependencyValues.symbolic) {
            let input = globalDependencyValues.mathChild[0].stateValues.value;
            for(let arrayKey of arrayKeys) {
              let functionChild = dependencyValuesByKey[arrayKey].functionChild[0];
              if(functionChild) {
                evaluatedResults[arrayKey] = functionChild.stateValues.f(input)
              }
            }
          } else {
            let numericInput = globalDependencyValues.mathChild[0].stateValues.value.evaluate_to_constant();
            for(let arrayKey of arrayKeys) {
              let functionChild = dependencyValuesByKey[arrayKey].functionChild[0];
              if(functionChild) {
                evaluatedResults[arrayKey] = me.fromAst(functionChild.stateValues.numericalf(numericInput))
              }
            }
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