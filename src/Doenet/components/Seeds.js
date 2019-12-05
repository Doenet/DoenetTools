import InlineComponent from './abstract/InlineComponent';

export default class Seeds extends InlineComponent {
  static componentType = "seeds";

  static returnChildLogic (args) {
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
      affectedBySugar: ["atLeastZeroSeeds"],
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

    let stateVariableDefinitions = {};

    stateVariableDefinitions.seeds = {
      public: true,
      componentType: "seed",
      isArray: true,
      entryPrefixes: ["seed"],
      returnDependencies: () => ({
        seedChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroSeeds",
          variableNames: ["value"],
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { seeds: dependencyValues.seedChildren.map(x => x.stateValues.value) } }
      }
    }

    stateVariableDefinitions.nSeeds = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        seeds: {
          dependencyType: "stateVariable",
          variableName: "seeds"
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { nSeeds: dependencyValues.seeds.length } }
      }
    }

    return stateVariableDefinitions;
  }

}