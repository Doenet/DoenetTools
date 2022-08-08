import BlockComponent from './abstract/BlockComponent.js';
import InlineComponent from './abstract/InlineComponent.js';

export class Div extends BlockComponent {
  static componentType = "div";
  static rendererType = "containerBlock";
  static renderChildren = true;

  static returnChildGroups() {

    return [{
      group: "anything",
      componentTypes: ["_base"]
    }]

  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible }
    })
    this.coreFunctions.resolveAction({ actionId });
  }

  actions = {
    recordVisibilityChange: this.recordVisibilityChange.bind(this),
  }

}


export class Span extends InlineComponent {
  static componentType = "span";
  static rendererType = "containerInline";
  static renderChildren = true;

  static returnChildGroups() {

    return [{
      group: "anything",
      componentTypes: ["_base"]
    }]

  }


}

