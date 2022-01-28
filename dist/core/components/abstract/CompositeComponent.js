import BaseComponent from './BaseComponent.js';

export default class CompositeComponent extends BaseComponent {
  constructor(args) {
    super(args);

    this.replacementsWorkspace = {};
  }
  static componentType = "_composite";

  static rendererType = undefined;

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.replacements = {
      returnDependencies: () => ({
        replacements: {
          dependencyType: "replacement",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { replacements: dependencyValues.replacements }
      })
    }


    stateVariableDefinitions.recursiveReplacements = {
      returnDependencies: () => ({
        recursiveReplacements: {
          dependencyType: "replacement",
          recursive: true,
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { recursiveReplacements: dependencyValues.recursiveReplacements }
      })
    }

    stateVariableDefinitions.fullRecursiveReplacements = {
      returnDependencies: () => ({
        recursiveReplacements: {
          dependencyType: "replacement",
          recursive: true,
          recurseNonStandardComposites: true,
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { fullRecursiveReplacements: dependencyValues.recursiveReplacements }
      })
    }

    return stateVariableDefinitions;
  }

  static createSerializedReplacements() {
    return { replacements: [] }
  }

  static calculateReplacementChanges() {
    return [];
  }

  // serialize(parameters = {}) {

  //   let serializedState = super.serialize(parameters);

  //   if (this.replacements === undefined) {
  //     return serializedState;
  //   }

  //   // also serialize replacements
  //   let serializedReplacements = [];
  //   for (let ind = 0; ind < this.replacements.length; ind++) {
  //     serializedReplacements.push(this.replacements[ind].serialize(parameters));
  //   }
  //   serializedState.replacements = serializedReplacements;

  //   if (this.replacementsToWithhold !== undefined) {
  //     serializedState.replacementsToWithhold = this.replacementsToWithhold;
  //   }

  //   return serializedState;

  // }

  get allPotentialRendererTypes() {

    let allPotentialRendererTypes = super.allPotentialRendererTypes;

    // we still recurse to all children, even though was skipped at base component
    // due to not having a rendererType
    for (let childName in this.allChildren) {
      let child = this.allChildren[childName].component;
      for (let rendererType of child.allPotentialRendererTypes) {
        if (!allPotentialRendererTypes.includes(rendererType)) {
          allPotentialRendererTypes.push(rendererType);
        }
      }
    }

    if (this.replacements) {
      for (let replacement of this.replacements) {
        if (typeof replacement === "object") {
          for (let rendererType of replacement.allPotentialRendererTypes) {
            if (!allPotentialRendererTypes.includes(rendererType)) {
              allPotentialRendererTypes.push(rendererType);
            }
          }
        }
      }
    }

    return allPotentialRendererTypes;

  }


}
