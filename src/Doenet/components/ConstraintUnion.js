import ConstraintComponent from './abstract/ConstraintComponent';

export default class ConstraintUnion extends ConstraintComponent {
  static componentType = "constraintunion";


  applyTheConstraint(variables) {

    let childIndices = this.childLogic.returnMatches("AtLeastOneConstraint");

    // if only one constraint, just pass on the results
    if(childIndices.length === 1) {
      return this.activeChildren[childIndices[0]].applyTheConstraint(variables);
    }
    
    let constraintChildren = childIndices.map(x => this.activeChildren[x]);

    let closestDistance2 = Infinity;
    let closestResult = {}

    let closestInd;


    for(let [ind, constraint] of constraintChildren.entries()) {

      let constraintResult = constraint.applyTheConstraint(variables);

      if(!constraintResult.constrained) {
        continue;
      }

      let distance2 = 0;

      for(let varname in constraintResult.variables) {
        // since, for now, have a distance function only for numerical values,
        // skip any constraints where don't have numerical values
        let originalVar = this.findFiniteNumericalValue(variables[varname]);
        let constrainedVar = this.findFiniteNumericalValue(constraintResult.variables[varname]);

        // shouldn't get undefined, but test for it anyway
        if(originalVar === null || originalVar === undefined ||
          constrainedVar === null || constrainedVar === undefined) {
          distance2 = Infinity;
          break;
        }

        distance2 += Math.pow(originalVar - constrainedVar, 2);
      }

      if(distance2 < closestDistance2) {
        closestResult = constraintResult;
        closestInd = ind+1;
        closestDistance2 = distance2;
      }

    }

    if(closestInd === undefined) {
      return {};
    }

    // prepend closestInd to constraintIndices;
    if(closestResult.constraintIndices === undefined) {
      closestResult.constraintIndices = [ closestInd ];
    } else {
      closestResult.constraintIndices = [ closestInd, ...closestResult.constraintIndices];
    }
    return closestResult;
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "AtLeastOneConstraint",
      componentType: '_constraint',
      comparison: 'atLeast',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }
}
