import BaseComponent from './BaseComponent';

export default class ComponentWithSerializedChildren extends BaseComponent {
  static componentType = "_componentwithserializedchildren";

  static createPropertiesObject() {
    return {};
  }

  static previewSerializedComponent({serializedComponent}) {
    if(serializedComponent.children === undefined) {
      return;
    }

    let creationInstructions = [];
    creationInstructions.push({keepChildrenSerialized: Object.keys(serializedComponent.children)});

    return creationInstructions;

  }

  updateState(args = {}) {

    super.updateState(args);

    // create a tracked state variable of serialized children
    // so that changes to serialized children will always count as a change
    this.state.lastSerializedChildren = this.serializedChildren;
    this._state.lastSerializedChildren.trackChanges = true;
    this._state.lastSerializedChildren.trackAsObject = true;

  }
}
