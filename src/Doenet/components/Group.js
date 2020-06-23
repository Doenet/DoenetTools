import CompositeComponent from './abstract/CompositeComponent';
// import {postProcessCopy, processChangesForReplacements} from './Ref';
import { postProcessCopy} from '../utils/copy';

export default class Group extends CompositeComponent {
  static componentType = "group";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

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

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.readyToExpand = {
      returnDependencies: () => ({}),
      definition: function () {
        return { newValues: { readyToExpand: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static createSerializedReplacements({component}) {

    let serializedChildrenCopy = component.activeChildren.map(
      x => x.serialize({forCopy: true})
    );

    if(component.stateValues.hide) {
      for(let child of serializedChildrenCopy) {
        if(child.state === undefined) {
          child.state = {};
        }
        child.state.hide = true;
      }
    }

    return {replacements: postProcessCopy({serializedComponents: serializedChildrenCopy, componentName: component.componentName}) };

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
