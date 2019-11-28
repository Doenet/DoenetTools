import CompositeComponent from './abstract/CompositeComponent';
import {postProcessRef, processChangesForReplacements} from './Ref';

export default class Group extends CompositeComponent {
  static componentType = "group";

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.newLeaf({
      name: 'anything',
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({}),
      definition: function () {
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static createSerializedReplacements({component}) {

    let serializedChildrenCopy = component.activeChildren.map(
      x => x.serialize({forReference: true})
    );

    if(component.stateValues.hide) {
      for(let child of serializedChildrenCopy) {
        if(child.state === undefined) {
          child.state = {};
        }
        child.state.hide = true;
      }
    }

    return {replacements: postProcessRef({serializedComponents: serializedChildrenCopy, componentName: component.componentName}) };

  }

  static calculateReplacementChanges({component, componentChanges, components}) {

    return [];

    let replacementChanges = processChangesForReplacements({
      componentChanges: componentChanges,
      componentName: component.componentName,
      downstreamDependencies: component.downstreamDependencies,
      components
    })
    // console.log(`replacementChanges for group ${component.componentName}`);
    // console.log(replacementChanges);
    return replacementChanges;
  }

  static includeBlankStringChildren = true;

}
