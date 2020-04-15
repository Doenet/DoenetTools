import BaseComponent from './BaseComponent';

export default class CompositeComponent extends BaseComponent {
  constructor(args) {
    super(args);

    this.replacementsWorkspace = {};
  }
  static componentType = "_composite";

  static rendererType = undefined;

  static createSerializedReplacements() {
    return { replacements: [] }
  }

  static calculateReplacementChanges() {
    return [];
  }

  serialize(parameters = {}) {

    let serializedState = super.serialize(parameters);

    if (this.replacements === undefined) {
      return serializedState;
    }

    // also serialize replacements
    let serializedReplacements = [];
    for (let ind = 0; ind < this.replacements.length; ind++) {
      serializedReplacements.push(this.replacements[ind].serialize(parameters));
    }
    serializedState.replacements = serializedReplacements;

    if (this.replacementsToWithhold !== undefined) {
      serializedState.replacementsToWithhold = this.replacementsToWithhold;
    }

    return serializedState;

  }

  get allPotentialRendererTypes() {

    let allPotentialRendererTypes = [];

    if(this.replacements) {
      for(let replacement of this.replacements) {
        for(let rendererType of replacement.allPotentialRendererTypes) {
          if(!allPotentialRendererTypes.includes(rendererType)) {
            allPotentialRendererTypes.push(rendererType);
          }
        }

      }
    }

    return allPotentialRendererTypes;

  }


}
