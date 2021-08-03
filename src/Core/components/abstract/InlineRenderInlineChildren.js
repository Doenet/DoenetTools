import InlineComponent from './InlineComponent';

export default class InlineRenderInlineChildren extends InlineComponent {
  static componentType = "_inlineRenderInlineChildren";
  static renderChildren = true;
  static includeBlankStringChildren = true;

  static returnChildGroups() {

    return [{
      group: "inlines",
      componentTypes: ["_inline"]
    }]

  }

}