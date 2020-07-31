import InlineComponent from './abstract/InlineComponent';

export default class Seeds extends InlineComponent {
  static componentType = "seeds";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroSeeds = childLogic.newLeaf({
      name: "atLeastZeroSeeds",
      componentType: 'seed',
      comparison: 'atLeast',
      number: 0
    });

    let breakStringIntoSeedsByCommas = function ({ activeChildrenMatched }) {
      let stringChild = activeChildrenMatched[0];
      let newChildren = stringChild.stateValues.value.split(",").map(x => ({
        componentType: "seed",
        state: { value: x.trim() }
      }));
      return {
        success: true,
        newChildren: newChildren,
        toDelete: [stringChild.componentName],
      }
    }

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1,
      isSugar: true,
      logicToWaitOnSugar: ["atLeastZeroSeeds"],
      replacementFunction: breakStringIntoSeedsByCommas,
    });

    childLogic.newOperator({
      name: "SeedsXorSugar",
      operator: 'xor',
      propositions: [exactlyOneString, atLeastZeroSeeds],
      setAsBase: true,
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nSeeds = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        seedChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroSeeds",
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { nSeeds: dependencyValues.seedChildren.length } }
      }
    }

    stateVariableDefinitions.seeds = {
      public: true,
      componentType: "seed",
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
            seedChild: {
              dependencyType: "childStateVariables",
              childLogicName: "atLeastZeroSeeds",
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
          if (dependencyValuesByKey[arrayKey].seedChild.length === 1) {
            seeds[arrayKey] = dependencyValuesByKey[arrayKey].seedChild[0]
              .stateValues.value
          }
        }
        return { newValues: { seeds } }
      }
    }

    return stateVariableDefinitions;
  }

}