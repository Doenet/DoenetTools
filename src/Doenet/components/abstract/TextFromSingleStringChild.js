import Text from '../Text';

export default class TextFromSingleStringChild extends Text {
  static componentType = "_textfromsinglestringchild";

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: "atMostOneString",
      componentType: 'string',
      comparison: 'atMost',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args={}) {

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.value = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      delete this.unresolvedState.value;

      let atMostOneString = this.childLogic.returnMatches("atMostOneString");
      if(atMostOneString.length === 1) {
        this.state.value = this.activeChildren[atMostOneString[0]].state.value;
      }else {
        if(this._state.value.essential !== true) {
          // if no string/text activeChildren and value wasn't set from state directly,
          // make value be blank and set it to be essential so any changes will be saved
          this.state.value = "";
          this._state.value = essential;
        }
      }
    }
  }
}