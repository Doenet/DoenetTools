import InlineComponent from './abstract/InlineComponent';

export default class Seeds extends InlineComponent {
  static componentType = "seeds";
  static rendererType = undefined;

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakStringsBySpaces = function ({ matchedChildren }) {

      // break any string by white space

      let newChildren = matchedChildren.reduce(function (a, c) {
        if (typeof c === "string") {
          return [
            ...a,
            ...c.split(/\s+/)
              .filter(s => s)
          ]
        } else {
          return [...a, c]
        }
      }, []);

      return {
        success: true,
        newChildren: newChildren,
      }
    }

    sugarInstructions.push({
      replacementFunction: breakStringsBySpaces
    });

    return sugarInstructions;

  }


  static returnChildGroups() {

    return [{
      group: "strings",
      componentTypes: ["string"]
    }]
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nSeeds = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        stringChildren: {
          dependencyType: "child",
          childGroups: ["strings"],
        }
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { nSeeds: dependencyValues.stringChildren.length } }
      }
    }

    stateVariableDefinitions.seeds = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "seed",
      },
      isArray: true,
      entryPrefixes: ["seed"],
      returnArraySizeDependencies: () => ({
        nSeeds: {
          dependencyType: "stateVariable",
          variableName: "nSeeds",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nSeeds];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            stringChild: {
              dependencyType: "child",
              childGroups: ["strings"],
              variableNames: ["value"],
              childIndices: [arrayKey]
            }
          }
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey: function ({ dependencyValuesByKey, arrayKeys }) {
        let seeds = {};
        for (let arrayKey of arrayKeys) {
          if (dependencyValuesByKey[arrayKey].stringChild.length === 1) {
            seeds[arrayKey] = dependencyValuesByKey[arrayKey].stringChild[0]
          }
        }
        return { setValue: { seeds } }
      }
    }

    return stateVariableDefinitions;
  }

}