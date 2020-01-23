import ConstraintComponent from './abstract/ConstraintComponent';

export default class AttractToGrid extends ConstraintComponent {
  static componentType = "attracttogrid";

  static createPropertiesObject() {
    return {
      dx: { default: 1 },
      dy: { default: 1 },
      dz: { default: 1 },
      xoffset: { default: 0 },
      yoffset: { default: 0 },
      zoffset: { default: 0 },
      xthreshold: { default: 0.2 },
      ythreshold: { default: 0.2 },
      zthreshold: { default: 0.2 },
      includegridlines: { default: false },
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
      this.unresolvedState.constraintActive = true;
      return;
    }

    delete this.unresolvedState.constraintActive;

    if(Object.keys(this.unresolvedState).length > 0) {
      // if have some properties that aren't resolved
      // we can't determine constraint
      this.unresolvedState.constraintActive = true;
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
      let x1grid = Math.round((x1 - xoffset) / dx) * dx + xoffset;
      if (Number.isFinite(x1grid) &&
        Math.abs(x1 - x1grid) < this.state.xthreshold) {
        rvars.x1 = x1grid;
        result.constrained = true;
      }
    }
    if (x2 !== undefined) {
      let dy = this.state.dy;
      let yoffset = this.state.yoffset;
      let x2grid = Math.round((x2 - yoffset) / dy) * dy + yoffset;
      if (Number.isFinite(x2grid) &&
        Math.abs(x2 - x2grid) < this.state.ythreshold) {
        rvars.x2 = x2grid;
        result.constrained = true;
      }
    }
    if (x3 !== undefined) {
      let dz = this.state.dz;
      let zoffset = this.state.zoffset;
      let x3grid = Math.round((x3 - zoffset) / dz) * dz + zoffset;
      if (Number.isFinite(x3grid) &&
        Math.abs(x3 - x3grid) < this.state.zthreshold) {
        rvars.x3 = x3grid;
        result.constrained = true;
      }
    }

    if (!this.state.includegridlines) {
      // if didn't specify to include gridlines
      // then don't constrain unless all variables were constrained
      if (x1 !== undefined && rvars.x1 === undefined) {
        return {};
      }
      if (x2 !== undefined && rvars.x2 === undefined) {
        return {};
      }
      if (x3 !== undefined && rvars.x3 === undefined) {
        return {};
      }
    }
    return result;
  }
}
