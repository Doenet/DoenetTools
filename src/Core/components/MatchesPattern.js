import BooleanComponent from './Boolean';
import { numberToLetters } from '../utils/sequence';
import me from 'math-expressions';

export default class MatchesPattern extends BooleanComponent {
  static componentType = "matchesPattern";
  static rendererType = "boolean";


  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.pattern = {
      createComponentOfType: "math",
    };
    attributes.allowImplicitIdentities = {
      createComponentOfType: "boolean",
      createStateVariable: "allowImplicitIdentities",
      defaultValue: false,
      public: true,
    }
    attributes.allowPermutations = {
      createComponentOfType: "boolean",
      createStateVariable: "allowPermutations",
      defaultValue: true,
      public: true,
    }
    attributes.requireNumericMatches = {
      createComponentOfType: "boolean",
      createStateVariable: "requireNumericMatches",
      defaultValue: false,
      public: true,
    }
    attributes.requireVariableMatches = {
      createComponentOfType: "boolean",
      createStateVariable: "requireVariableMatches",
      defaultValue: false,
      public: true,
    }
    attributes.excludeMatches = {
      createComponentOfType: "mathList",
      createStateVariable: "excludeMatches",
      defaultValue: [],
      public: true,
    }
    attributes.matchExpressionWithBlanks = {
      createComponentOfType: "boolean",
      createStateVariable: "matchExpressionWithBlanks",
      defaultValue: false,
      public: true,
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = [];

    let wrapNonMathWithMath = function ({ matchedChildren, componentInfoObjects }) {

      // if have no children or a single math, don't do anything
      if (matchedChildren.length === 0 ||
        matchedChildren.length === 1 && componentInfoObjects.componentIsSpecifiedType(matchedChildren[0], "math")
      ) {
        return { success: false }
      }


      return {
        success: true,
        newChildren: [
          {
            componentType: "math",
            children: matchedChildren
          },
        ],
      }

    }

    sugarInstructions.push({
      replacementFunction: wrapNonMathWithMath
    });

    return sugarInstructions;
  }




  static returnChildGroups() {

    return [{
      group: "maths",
      componentTypes: ["math"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.parsedExpression;
    delete stateVariableDefinitions.mathChildrenByCode;

    stateVariableDefinitions.pattern = {
      additionalStateVariablesDefined: ["patternVariables"],
      returnDependencies: () => ({
        patternAttr: {
          dependencyType: "attributeComponent",
          attributeName: "pattern",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues }) {
        let patternVariables = [];
        if (!dependencyValues.patternAttr) {
          return {
            setValue: { pattern: '\uff3f', patternVariables }
          }
        }

        let originalVariablesInPattern = dependencyValues.patternAttr.stateValues.value.variables();

        let ind = 26 * 27 + 1; // starts with variable AAA

        function replacePatternVariables(tree) {
          if (tree === "\uff3f") {
            let newVar = numberToLetters(ind);
            ind++;
            while (originalVariablesInPattern.includes(newVar)) {
              newVar = numberToLetters(ind);
              ind++
            }

            patternVariables.push(newVar);
            return newVar;
          } else if (Array.isArray(tree)) {
            return [tree[0], ...tree.slice(1).map(replacePatternVariables)]
          } else {
            return tree;
          }

        }

        let pattern = replacePatternVariables(dependencyValues.patternAttr.stateValues.value.tree);


        return {
          setValue: { pattern, patternVariables }
        }


      }
    }


    stateVariableDefinitions.value = {
      additionalStateVariablesDefined: [{
        variableName: "allPatternMatches",
      }],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      forRenderer: true,
      returnDependencies: () => ({
        pattern: {
          dependencyType: "stateVariable",
          variableName: "pattern"
        },
        patternVariables: {
          dependencyType: "stateVariable",
          variableName: "patternVariables"
        },
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value"]
        },
        allowImplicitIdentities: {
          dependencyType: "stateVariable",
          variableName: "allowImplicitIdentities"
        },
        allowPermutations: {
          dependencyType: "stateVariable",
          variableName: "allowPermutations"
        },
        requireNumericMatches: {
          dependencyType: "stateVariable",
          variableName: "requireNumericMatches"
        },
        requireVariableMatches: {
          dependencyType: "stateVariable",
          variableName: "requireVariableMatches"
        },
        excludeMatches: {
          dependencyType: "stateVariable",
          variableName: "excludeMatches"
        },
        matchExpressionWithBlanks: {
          dependencyType: "stateVariable",
          variableName: "matchExpressionWithBlanks"
        },
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.mathChildren.length === 0) {
          return { setValue: { value: false, allPatternMatches: [] } }
        }

        let mathValue = dependencyValues.mathChildren[0].stateValues.value;

        if (mathValue.variables().includes("\uff3f") && !dependencyValues.matchExpressionWithBlanks) {
          // don't match a math value with a blank
          return { setValue: { value: false, allPatternMatches: [] } }
        }

        let variables = {};
        if (dependencyValues.requireNumericMatches) {
          let isNumeric = m => !Number.isNaN(me.fromAst(m).evaluate_to_constant())
          dependencyValues.patternVariables.forEach(v => variables[v] = isNumeric)
        } else if (dependencyValues.requireVariableMatches) {
          let isString = m => typeof m === "string";
          dependencyValues.patternVariables.forEach(v => variables[v] = isString)
        } else {
          dependencyValues.patternVariables.forEach(v => variables[v] = true)
        }

        let params = {
          variables,
          allow_permutations: dependencyValues.allowPermutations,
        }

        if (dependencyValues.allowImplicitIdentities) {
          params.allow_implicit_identities = dependencyValues.patternVariables
        }


        let matchResult = mathValue.match(dependencyValues.pattern, params)

        let value = false, allPatternMatches = [];
        if (matchResult) {
          // check to make sure no matched values contain a variable that matches a value from excludeMatches
          if (!Object.values(matchResult).map(x => me.fromAst(x))
            .some(m => dependencyValues.excludeMatches
              .some(em => m.variables().some(v => em.equalsViaSyntax(me.fromAst(v))))
            )
          ) {
            value = true;
            allPatternMatches = dependencyValues.patternVariables.map(v => me.fromAst(matchResult[v]))
          }
        }

        return {
          setValue: {
            value, allPatternMatches
          }
        }
      }
    }


    stateVariableDefinitions.nMatches = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        allPatternMatches: {
          dependencyType: "stateVariable",
          variableName: "allPatternMatches"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { nMatches: dependencyValues.allPatternMatches.length },
          checkForActualChange: { nMatches: true }
        }
      }
    }

    stateVariableDefinitions.patternMatches = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
      },
      isArray: true,
      nDimensions: 1,
      entryPrefixes: ["patternMatch"],
      returnArraySizeDependencies: () => ({
        nMatches: {
          dependencyType: "stateVariable",
          variableName: "nMatches",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nMatches];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allPatternMatches: {
            dependencyType: "stateVariable",
            variableName: "allPatternMatches"
          }
        }

        return { globalDependencies }

      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        let patternMatches = {};

        for (let ind = 0; ind < globalDependencyValues.__array_size[0]; ind++) {
          patternMatches[ind] = globalDependencyValues.allPatternMatches[ind];
        }

        return { setValue: { patternMatches } }
      }
    }


    return stateVariableDefinitions;

  }

}
