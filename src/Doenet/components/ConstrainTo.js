import ConstraintComponent from './abstract/ConstraintComponent';

export default class ConstrainTo extends ConstraintComponent {
  static componentType = "constrainto";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atLeastOneGraphical",
      componentType: '_graphical',
      comparison: 'atLeast',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.independentComponentConstraints = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { independentComponentConstraints: false } })
    }


    return stateVariableDefinitions;

  }


  updateState(args = {}) {
    super.updateState(args);



    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      let childIndices = this.childLogic.returnMatches("atLeastOneGraphical");
      this.state.childComponents = childIndices.map(x=>this.activeChildren[x]);
    }

 
    // if identity of children changed or a state variable in a child changed
    // mark the fact that there was a change in the constraint
    // by indicating a change in the state variable childComponents
    // so that the constraint will be reapplied
    if(childrenChanged || this.state.childComponents.some(x => trackChanges.checkIfVariableChanged(x))) {
      trackChanges.addChange({
        component: this,
        variable: "childComponents",
        newChanges: {changes: this.state.childComponents},
        mergeChangesIntoCurrent: false
      })
    }

  }

  applyTheConstraint({ x1, x2, x3 }) {
    // use the convention of x1, x2, and x3 for variable names
    // so that components can call constraints generically for n-dimensions
    // use x,y,z for properties so that authors can use the more familar tag names

    // only works for numerical x1, x2, and x3
    x1 = this.findFiniteNumericalValue(x1);
    x2 = this.findFiniteNumericalValue(x2);
    x3 = this.findFiniteNumericalValue(x3);

    // if found any non-numerical value, return no constraint
    // (It's OK if some were undefined, so don't check for undefined)
    if (x1 === null || x2 === null || x3 === null) {
      return {};
    }


    let closestDistance2 = Infinity;
    let closestResult = {}

    for (let [ind, objectConstrainedTo] of this.state.childComponents.entries()) {

      if (objectConstrainedTo.nearestPoint === undefined) {
        continue;
      }

      // expect nearest point to return numerical values
      let nearestPoint = objectConstrainedTo.nearestPoint({ x1: x1, x2: x2, x3: x3 });

      if (nearestPoint === undefined) {
        continue;
      }

      let result = { constraintIndices: [ind+1], variables: {} };
      let rvars = result.variables;
      let distance2 = 0;

      if (x1 !== undefined) {
        if (nearestPoint.x1 === undefined) {
          continue;
        }
        rvars.x1 = nearestPoint.x1;
        distance2 += Math.pow(x1 - rvars.x1, 2);
      }
      if (x2 !== undefined) {
        if (nearestPoint.x2 === undefined) {
          continue;
        }
        rvars.x2 = nearestPoint.x2;
        distance2 += Math.pow(x2 - rvars.x2, 2);
      }
      if (x3 !== undefined) {
        if (nearestPoint.x3 === undefined) {
          continue;
        }
        rvars.x3 = nearestPoint.x3;
        distance2 += Math.pow(x3 - rvars.x3, 2);
      }

      if (distance2 < closestDistance2) {
        closestResult = result;
        closestDistance2 = distance2;
      }

    }
    
    closestResult.constrained = true;

    return closestResult;
  }

}
