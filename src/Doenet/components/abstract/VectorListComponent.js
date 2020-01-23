import BaseComponent from './BaseComponent';
import { breakStringsAndOthersIntoComponentsByStringCommas } from '../commonsugar/breakstrings';

export default class VectorListComponent extends BaseComponent {
  static componentType = "_vectorlistcomponent";

  static alwaysContinueUpstreamUpdates = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.hide = { default: true };
    return properties;
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    let AtLeastZeroVectors = childLogic.newLeaf({
      name: "AtLeastZeroVectors",
      componentType: 'vector',
      comparison: 'atLeast',
      number: 0
    });

    let breakIntoVectorsByCommas = breakStringsAndOthersIntoComponentsByStringCommas(x => ({
      componentType: "vector", children: [{
        componentType: "head", children: [{
          componentType: "coords", children: x
        }]
      }]
    }));

    let AtLeastOneString = childLogic.newLeaf({
      name: "AtLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
    });

    let AtLeastOneMath = childLogic.newLeaf({
      name: "AtLeastOneMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 1,
    });

    let StringsAndMaths = childLogic.newOperator({
      name: "StringsAndMaths",
      operator: 'or',
      propositions: [AtLeastOneString, AtLeastOneMath],
      requireConsecutive: true,
      isSugar: true,
      replacementFunction: breakIntoVectorsByCommas,
    });

    childLogic.newOperator({
      name: "VectorsXorSugar",
      operator: 'xor',
      propositions: [StringsAndMaths, AtLeastZeroVectors],
      setAsBase: true,
    });

    return childLogic;
  }


  updateState(args = {}) {
    if(args.init) {
      this._state.vectors = {trackChanges: true};
    }

    super.updateState(args);

    if (!this.childLogicSatisfied) {
      this.unresolvedState.vectors = true;
      this.unresolvedState.nVectors = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {
      delete this.unresolvedState.vectors;
      delete this.unresolvedState.nVectors;

      let AtLeastZeroVectors = this.childLogic.returnMatches("AtLeastZeroVectors");
      this.state.nVectors = AtLeastZeroVectors.length;
      this.state.vectors = AtLeastZeroVectors.map(i => this.activeChildren[i]);
    }
  }


  initializeRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new this.availableRenderers.container({ key: this.componentName });
    }
  }

  updateChildrenWhoRender() {
    this.childrenWhoRender = this.state.vectors.map(x => x.componentName);
  }

}
