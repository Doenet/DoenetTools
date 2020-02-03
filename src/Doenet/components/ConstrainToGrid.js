import ConstraintComponent from './abstract/ConstraintComponent';

export default class ConstrainToGrid extends ConstraintComponent {
  static componentType = "constraintogrid";

  static createPropertiesObject() {
    return {
      dx: { default: 1 },
      dy: { default: 1 },
      dz: { default: 1 },
      xoffset: { default: 0 },
      yoffset: { default: 0 },
      zoffset: { default: 0 },
    };
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atMostOneString",
      componentType: 'string',
      comparison: 'atMost',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args = {}) {
    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.constraintInactive = true;
      return;
    }

    delete this.unresolvedState.constraintInactive;

    if(Object.keys(this.unresolvedState).length > 0) {
      // if have some properties that aren't resolved
      // we can't determine constraint
      this.unresolvedState.constraintInactive = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      this.state.constraintInactive = false;
      let stringChildInds = this.childLogic.returnMatches("atMostOneString");
      if (stringChildInds.length === 1) {
        let stringValue = this.activeChildren[stringChildInds[0]].state.value;
        if (stringValue === false ||
          (typeof stringValue === "string" && ["false", "f"].includes(stringValue.trim().toLowerCase()))) {
          this.state.constraintInactive = true;
        }
      }
    }
  }


  applyTheConstraint({ x1, x2, x3 }) {
    // use the convention of x1, x2, and x3 for variable names
    // so that components can call constraints generically for n-dimensions
    // use x,y,z for properties so that authors can use the more familar tag names

    if (this.state.constraintInactive) {
      return {};
    }

    // only works for numerical x1, x2, and x3
    x1 = this.findFiniteNumericalValue(x1);
    x2 = this.findFiniteNumericalValue(x2);
    x3 = this.findFiniteNumericalValue(x3);

    // if found any non-numerical value, return no constraint
    // (It's OK if some were undefined, so don't check for undefined)
    if (x1 === null || x2 === null || x3 === null) {
      return {};
    }

    let result = { variables: {}};
    let rvars = result.variables;
    if (x1 !== undefined) {
      let dx = this.state.dx;
      let xoffset = this.state.xoffset;
      x1 = Math.round((x1 - xoffset) / dx) * dx + xoffset;
      if (Number.isFinite(x1)) {
        rvars.x1 = x1;
      }
    }
    if (x2 !== undefined) {
      let dy = this.state.dy;
      let yoffset = this.state.yoffset;
      x2 = Math.round((x2 - yoffset) / dy) * dy + yoffset;
      if (Number.isFinite(x2)) {
        rvars.x2 = x2;
      }
    }
    if (x3 !== undefined) {
      let dz = this.state.dz;
      let zoffset = this.state.zoffset;
      x3 = Math.round((x3 - zoffset) / dz) * dz + zoffset;
      if (Number.isFinite(x3)) {
        rvars.x3 = x3;
      }
    }

    result.constrained = true;
    
    return result;
  }
}
