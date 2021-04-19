import MathComponent from './Math';
import me from 'math-expressions';
import { func } from 'prop-types';

export default class Evaluate extends MathComponent {
  static componentType = "evaluate";
  static rendererType = "math";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.forceSymbolic = { default: false };
    properties.forceNumeric = { default: false };
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
    let atMostOneInput = childLogic.newLeaf({
      name: "atMostOneInput",
      componentType: 'input',
      comparison: 'atMost',
      number: 1,
    });
    childLogic.newOperator({
      name: "FunctionsAndMaths",
      operator: 'or',
      propositions: [atLeastZeroFunctions, atMostOneInput],
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
          dependencyType: "child",
          childLogicName: "atLeastZeroFunctions",
        },
        inputChild: {
          dependencyType: "child",
          childLogicName: "atMostOneInput",
          variableNames: ["nComponents"]
        }
      }),
      definition: function ({ dependencyValues }) {

        let nResults;

        if (dependencyValues.functionChildren.length > 0
          && dependencyValues.inputChild.length === 1
          && dependencyValues.inputChild[0].stateValues.nComponents > 0
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
          inputChild: {
            dependencyType: "child",
            childLogicName: "atMostOneInput",
            variableNames: ["nComponents", "maths"]
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

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            functionChild: {
              dependencyType: "child",
              childLogicName: "atLeastZeroFunctions",
              variableNames: ["symbolicf", "numericalf", "symbolic"],
              childIndices: [arrayKey]
            },
          }
        }

        return { globalDependencies, dependenciesByKey }
      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {

        // console.log(globalDependencyValues, dependencyValuesByKey)

        let evaluatedResults = {};

        if (globalDependencyValues.inputChild.length === 1
          && globalDependencyValues.inputChild[0].stateValues.nComponents > 0
        ) {

          // TODO: for now just take the first input
          // generalize to functions of multiple variables

          let input = globalDependencyValues.inputChild[0].stateValues.maths[0];

          let calculatedNumericInput = false;
          let numericInput;

          for (let arrayKey of arrayKeys) {
            let functionChild = dependencyValuesByKey[arrayKey].functionChild[0];
            if (functionChild) {
              if (!globalDependencyValues.forceNumeric &&
                (functionChild.stateValues.symbolic || globalDependencyValues.forceSymbolic)
              ) {
                evaluatedResults[arrayKey] = functionChild.stateValues.symbolicf(input);
              } else {
                if (!calculatedNumericInput) {
                  calculatedNumericInput = true;
                  numericInput = input.evaluate_to_constant();
                  if (numericInput === null) {
                    numericInput = NaN;
                  }
                }

                evaluatedResults[arrayKey] = me.fromAst(functionChild.stateValues.numericalf(numericInput))
              }
            }
          }


        }

        // console.log("evaluatedResults")
        // console.log(evaluatedResults)

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