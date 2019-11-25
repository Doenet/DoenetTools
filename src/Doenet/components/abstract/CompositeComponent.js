import BaseComponent from './BaseComponent';

export default class CompositeComponent extends BaseComponent {
  static componentType = "_composite";

  updateState(args={}) {

    super.updateState(args);

    if(args.init) {
      if(this.allowSugarInSerializedReplacements === undefined) {
        this.allowSugarInSerializedReplacements = false;
      }
    }
  }

  calculateReplacementChanges(componentChanges) {
    return [];
  }

  // postprocessReplacements() {
  // }

  serialize(parameters = {}) {
    if(parameters.forReference !== true) {
      return super.serialize(parameters);
    }

    // when serializing for a reference, serialize non-withheld replacements
    // rather than component itself
    let serializedState = [];
    let nReplacementsToSerialize = this.replacements.length;
    if(this.replacementsToWithhold !== undefined) {
      nReplacementsToSerialize -= this.replacementsToWithhold;
    }
    for(let ind = 0; ind < nReplacementsToSerialize; ind++) {
      let serializedComponent = this.replacements[ind].serialize(parameters);
      if(Array.isArray(serializedComponent)) {
        serializedState.push(...serializedComponent);
      }else {
        serializedState.push(serializedComponent);
      }

    }
    
    // TODO: determine if this check is necessary
    if(serializedState.length === 1) {
      return serializedState[0]
    } else {
      return serializedState;
    }

  }

}
