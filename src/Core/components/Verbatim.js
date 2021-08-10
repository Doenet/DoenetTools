import BlockComponent from './abstract/BlockComponent';

export class Pre extends BlockComponent {
  static componentType = "pre";
  static renderChildren = true;

  static includeBlankStringChildren = true;

  static returnChildGroups() {

    return [{
      group: "inlines",
      componentTypes: ["_inline"]
    }]

  }

}
