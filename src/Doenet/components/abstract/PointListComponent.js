import BaseComponent from './BaseComponent';
import { breakStringsAndOthersIntoComponentsByStringCommas } from '../commonsugar/breakstrings';

export default class PointListComponent extends BaseComponent {
  static componentType = "_pointlistcomponent";

  static alwaysContinueUpstreamUpdates = true;

  static createPropertiesObject({ standardComponentTypes }) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.hide = { default: true };
    return properties;
  }

  static returnChildLogic({ standardComponentTypes, allComponentClasses, components }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let atLeastZeroPoints = childLogic.newLeaf({
      name: "atLeastZeroPoints",
      componentType: 'point',
      comparison: 'atLeast',
      number: 0
    });

    let breakIntoPointsByCommas = breakStringsAndOthersIntoComponentsByStringCommas(x => ({
      componentType: "point", children: [{
        componentType: "coords", children: x
      }]
    }));

    let atLeastOneString = childLogic.newLeaf({
      name: "atLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
    });

    let atLeastOneMath = childLogic.newLeaf({
      name: "atLeastOneMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 1,
    });

    let stringsAndMaths = childLogic.newOperator({
      name: "stringsAndMaths",
      operator: 'or',
      propositions: [atLeastOneString, atLeastOneMath],
      requireConsecutive: true,
      isSugar: true,
      replacementFunction: breakIntoPointsByCommas,
    });

    childLogic.newOperator({
      name: "pointsXorSugar",
      operator: 'xor',
      propositions: [stringsAndMaths, atLeastZeroPoints],
      setAsBase: true,
    });

    return childLogic;
  }


  updateState(args = {}) {
    if(args.init) {
      this._state.points = {trackChanges: true};
    }

    super.updateState(args);

    if (!this.childLogicSatisfied) {
      this.unresolvedState.points = true;
      this.unresolvedState.nPoints = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {
      delete this.unresolvedState.points;
      delete this.unresolvedState.nPoints;

      let atLeastZeroPoints = this.childLogic.returnMatches("atLeastZeroPoints");
      this.state.nPoints = atLeastZeroPoints.length;
      this.state.points = atLeastZeroPoints.map(i => this.activeChildren[i]);
    }

  }

  initializeRenderer() {
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.container({ key: this.componentName });
    }
  }

  updateChildrenWhoRender() {
    if(this.state.points === undefined) {
      this.childrenWhoRender = [];
    } else {
      this.childrenWhoRender = this.state.points.map(x => x.componentName);
    }
  }

}
