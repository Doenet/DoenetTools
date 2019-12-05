import BaseComponent from './abstract/BaseComponent';

export default class MathTarget extends BaseComponent {
  static componentType = "mathtarget";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "exactlyOneMath",
      componentType: 'math',
      number: 1,
      setAsBase: true
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.mathChildName = {
      returnDependencies: () => ({
        mathChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneMath",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            mathChildName: dependencyValues.mathChild[0].componentName
          }
        };
      },
    }

    return stateVariableDefinitions;

  }


  updateState(args={}) {
    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.mathChild = true;
      return;
    }

    delete this.unresolvedState.mathChild;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      let mathInd = this.childLogic.returnMatches("ExactlyOneMath")[0];
      this.state.mathChild = this.activeChildren[mathInd];
    }
  }

}