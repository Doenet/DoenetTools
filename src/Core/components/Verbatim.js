import BlockComponent from './abstract/BlockComponent';

export class Pre extends BlockComponent {
  static componentType = "pre";
  static renderChildren = true;

  static includeBlankStringChildren = true;

}
