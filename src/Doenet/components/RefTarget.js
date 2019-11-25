import BaseComponent from './abstract/BaseComponent';

export default class RefTarget extends BaseComponent {
  static componentType = "reftarget";

  static createPropertiesObject() {
    return {};
  } 

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.newLeaf({
      name: 'atMostOneString',
      comparison: 'atMost',
      componentType: 'string',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args = {}) {
    super.updateState(args);

    // since we don't allow child to change
    // if child logic isn't satisfied right away, it never will be
    if(!this.childLogicSatisfied) {
      throw Error("Cannot create a refTarget. Can only have one string child.")
    }

    if(args.init) {
      if(this._state.refTargetName === undefined) {
        this._state.refTargetName = {};
      }
      
      this._state.refTarget = {trackChanges: true};
  
      // get ref target name
      let stringMatch = this.childLogic.returnMatches("atMostOneString")
      if(stringMatch.length === 1) {
        this.state.refTargetName = this.activeChildren[stringMatch[0]].state.value;
      }else {
        if(this._state.refTargetName.essential !== true) {
          throw Error("refTarget must be defined by either value or children");
        }
      }
    }

    let success = this.resolveReference();

    if(success) {
      // successfully resolved target
      // so indicate there is nothing unresolved in state
      delete this.unresolvedState.refTarget;
      delete this.unresolvedDependencies;
    }else {
      this.unresolvedState.refTarget = true;
      this.unresolvedDependencies = {[this.state.refTargetName]: true};
    }

  }

  resolveReference() {

    this.state.refTarget = this.components[this.state.refTargetName];
    if(this.state.refTarget === undefined) {
      return false;
    }

    if(this.state.refTarget.isShadow === "true") {
      throw Error("Invalid reference.  Cannot reference shadow child " + this.state.refTarget.componentName);
    }

    return true;

  }


}