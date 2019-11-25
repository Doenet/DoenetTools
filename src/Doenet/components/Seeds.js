import InlineComponent from './abstract/InlineComponent';

export default class Seeds extends InlineComponent {
  static componentType = "seeds";

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let atLeastZeroSeeds = childLogic.newLeaf({
      name: "atLeastZeroSeeds",
      componentType: 'seed',
      comparison: 'atLeast',
      number: 0
    });

    let breakStringIntoSeedsByCommas = function({activeChildrenMatched}) {
      let stringChild = activeChildrenMatched[0];
      let newChildren = stringChild.state.value.split(",").map(x=> ({
        componentType: "seed",
        state: {value: x.trim()}
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
      replacementFunction: breakStringIntoSeedsByCommas,
    });
    
    childLogic.newOperator({
      name: "SeedsXorSugar",
      operator: 'xor',
      propositions: [exactlyOneString,atLeastZeroSeeds],
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args={}) {
    if(args.init === true) {
      this.makePublicStateVariableArray({
        variableName: "seeds",
        componentType: "seed",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "seed",
        arrayVariableName: "seeds",
      });
      this.makePublicStateVariable({
        variableName: "nseeds",
        componentType: "number",
      })
    }

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.seeds = true;
      this.unresolvedState.nseeds = true;
      return;
    }

    delete this.unresolvedState.seeds;
    delete this.unresolvedState.nseeds;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      let seedChildrenInds = this.childLogic.returnMatches("atLeastZeroSeeds");
      if(seedChildrenInds.length > 0) {
        this.state.seedChildren = seedChildrenInds.map(x => this.activeChildren[x]);
        this.state.nseeds = this.state.seedChildren.length;
      }else {
        delete this.state.seedChildren;
        this.state.nseeds = 0;
      }
    }

    if(this.state.seedChildren) {
      if(childrenChanged || this.state.seedChildren.some(x=>trackChanges.getVariableChanges({
          component: x, variable: "value"}))) {
        this.state.seeds = this.state.seedChildren.map(x => x.state.value);
      }
    }else {
      this.state.seeds = [];
    }

  }
}