import ConstraintComponent from './abstract/ConstraintComponent';

export default class ConstraintToAttractor extends ConstraintComponent {
  static componentType = "constrainttoattractor";


  applyTheConstraint(variables) {

    let childIndex = this.childLogic.returnMatches("ExactlyOneConstraint")[0];

    let constraintResult =  this.activeChildren[childIndex]
        .applyTheConstraint(variables);
    
    let distance2 = 0;

    for(let varname in constraintResult.variables) {
      // since, for now, have a distance function only for numerical values,
      // skip if don't have numerical values
      let originalVar = this.findFiniteNumericalValue(variables[varname]);
      let constrainedVar = this.findFiniteNumericalValue(constraintResult.variables[varname]);

      // shouldn't get undefined, but test for it anyway
      if(originalVar === null || originalVar === undefined ||
        constrainedVar === null || constrainedVar === undefined) {
        return {};
      }

      distance2 += Math.pow(originalVar - constrainedVar, 2);
    }

    if(distance2 > this.state.threshold*this.state.threshold) {
      return {};
    }
    
    return constraintResult;
  }

  static createPropertiesObject() {
    return {
      threshold: {default: 0.5},
    };
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "ExactlyOneConstraint",
      componentType: '_constraint',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }
}
