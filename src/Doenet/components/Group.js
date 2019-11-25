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

  updateState(args={}) {
    let trackChanges = this.currentTracker.trackChanges;

    super.updateState(args);

    // child logic always satisfied

    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    
    if(childrenChanged) {
      for(let childName in this.allChildren) {
        let child = this.allChildren[childName].component;
        if(!child.componentIsAProperty) {
          // add dependencies once without recursive to set as base reference
          this.addReferenceDependencies({
            target: child,
            shadowed: true
          });
          // run second time recursive to get descendants
          this.addReferenceDependencies({
            target: child,
            recursive: true,
            shadowed: true
          });
        }
      }
    }

    if(args.init) {
      this.serializedReplacements = this.createSerializedReplacements();
    }
  }

  createSerializedReplacements() {

    let serializedChildrenCopy = this.activeChildren.map(
      x => x.serialize({forReference: true})
    );

    if(this.state.hide) {
      for(let child of serializedChildrenCopy) {
        if(child.state === undefined) {
          child.state = {};
        }
        child.state.hide = true;
      }
    }

    return postProcessRef({serializedComponents: serializedChildrenCopy, componentName: this.componentName});

  }

  calculateReplacementChanges(componentChanges) {
    let replacementChanges = processChangesForReplacements({
      componentChanges: componentChanges,
      componentName: this.componentName,
      downstreamDependencies: this.downstreamDependencies,
      components: this.components
    })
    // console.log(`replacementChanges for group ${this.componentName}`);
    // console.log(replacementChanges);
    return replacementChanges;
  }

  static includeBlankStringChildren = true;

}
