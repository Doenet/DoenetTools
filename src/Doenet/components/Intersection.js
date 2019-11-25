import CompositeComponent from './abstract/CompositeComponent';
import me from 'math-expressions';

export default class Intersection extends CompositeComponent {
  static componentType = "intersection";

  static returnChildLogic({ standardComponentTypes, allComponentClasses, components }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.newLeaf({
      name: "atLeastZeroGraphical",
      componentType: '_graphical',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args = {}) {
    super.updateState(args);

    if (args.init) {
      this.state.nIntersections = 0;
      this.state.intersectionClasses = [];
    }

    if (!this.childLogicSatisfied) {
      this.unresolvedState.graphicalChildren = true;
      return;
    }

    delete this.unresolvedState.graphicalChildren;

    if (Object.keys(this.unresolvedState).length > 0) {
      // if have some properties that aren't resolved
      // we can't determine constraint
      this.unresolvedState.graphicalChildren = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {
      let childIndices = this.childLogic.returnMatches("atLeastZeroGraphical");
      this.state.graphicalChildren = childIndices.map(x => this.activeChildren[x]);
      this.state.numberGraphicalChildren = childIndices.length;
    }

    // if a child has unresolved state, then the constraint should be unresolved
    if (this.state.graphicalChildren.some(x => Object.keys(x.unresolvedState).length > 0)) {
      this.unresolvedState.graphicalChildren = true;
      return;
    }

    if (args.init) {
      this.serializedReplacements = this.createSerializedReplacements();
    }

  }

  createSerializedReplacements() {

    if (this.state.numberGraphicalChildren === 0) {
      return [];
    }

    // intersection of one object is the object itself
    if (this.state.numberGraphicalChildren === 1) {
      return [this.state.graphicalChildren[0].serialize()];
    }

    if (this.state.numberGraphicalChildren > 2) {
      console.warn("Haven't implemented intersection for more than two objects");
      return [];
    }

    // for now, have only implemented for two lines
    // in 2D with constant coefficients
    let object1 = this.state.graphicalChildren[0];
    let object2 = this.state.graphicalChildren[1];

    let lineClass = this.allComponentClasses["line"];
    if ((object1 instanceof lineClass) && (object2 instanceof lineClass)) {

      if (object1.state.ndimensions !== 2 || object2.state.ndimensions !== 2) {
        console.log("Intersection of lines implemented only in 2D");
        return [];
      }

      // only implement for constant coefficients
      let a1 = object1.state.coeffvar1.evaluate_to_constant();
      let b1 = object1.state.coeffvar2.evaluate_to_constant();
      let c1 = object1.state.coeff0.evaluate_to_constant();
      let a2 = object2.state.coeffvar1.evaluate_to_constant();
      let b2 = object2.state.coeffvar2.evaluate_to_constant();
      let c2 = object2.state.coeff0.evaluate_to_constant();

      if (!(Number.isFinite(a1) && Number.isFinite(b1) && Number.isFinite(c1) &&
        Number.isFinite(a2) && Number.isFinite(b2) && Number.isFinite(c2))) {
        console.log("Intersection of lines implemented only for constant coefficients");
        return [];
      }

      let d = a1 * b2 - a2 * b1;

      if (Math.abs(d) < 1E-14) {
        if (Math.abs(c2 * a1 - c1 * a2) > 1E-14) {
          // parallel lines
          return [];
        } else if ((a1 === 0 && b1 === 0 && c1 === 0) || (a2 === 0 && b2 === 0 && c2 === 0)) {
          // at least one line not defined
          return [];
        } else {
          // identical lines, return first line
          return [object1.serialize()];
        }
      }

      // two intersecting lines, return point
      let x = (c2 * b1 - c1 * b2) / d;
      let y = (c1 * a2 - c2 * a1) / d;
      let coords = me.fromAst(["tuple", x, y]);

      return [{ componentType: "point", state: { coords: coords, draggable: false } }]
    }

    console.log("Intersection implemented only for two lines");
    return [];
  }

  calculateReplacementChanges(componentChanges) {
    let replacementChanges = [];

    if (Object.keys(this.unresolvedState).length > 0) {
      return replacementChanges;
    }

    let serializedIntersections = this.createSerializedReplacements();

    let nNewIntersections = serializedIntersections.length;

    let recreateReplacements = true;

    if (nNewIntersections === this.replacements.length) {
      recreateReplacements = false;

      for (let ind = 0; ind < nNewIntersections; ind++) {

        if (serializedIntersections[ind].componentType !== this.replacements[ind].componentType) {

          // found a different type of replacement, so recreate from scratch
          recreateReplacements = true;
          break;
        }
        // only need to change state variables

        if (serializedIntersections[ind].state === undefined) {
          console.warn("No state by which to update intersection component, so recreating");
          recreateReplacements = true;
          break;
        }

        let replacementInstruction = {
          changeType: "updateStateVariables",
          component: this.replacements[ind],
          stateChanges: serializedIntersections[ind].state,
        }
        replacementChanges.push(replacementInstruction);
      }

    }

    if (recreateReplacements === false) {
      return replacementChanges
    }


    // replace with new intersection
    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: this.replacements.length,
      serializedReplacements: serializedIntersections,
    }

    return [replacementInstruction];

  }

}