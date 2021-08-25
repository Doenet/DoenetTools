import BlockComponent from './abstract/BlockComponent.js';
import InlineComponent from './abstract/InlineComponent.js';

export class Div extends BlockComponent {
  static componentType = "div";
  static rendererType = "container";
  static renderChildren = true;

  static returnChildGroups() {

    return [{
      group: "anything",
      componentTypes: ["_base"]
    }]

  }

}


export class Span extends InlineComponent {
  static componentType = "span";
  static rendererType = "container";
  static renderChildren = true;

  static returnChildGroups() {

    return [{
      group: "anything",
      componentTypes: ["_base"]
    }]

  }


}

