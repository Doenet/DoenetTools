import Group from './Group';

export default class Option extends Group {
  static componentType = "option";

  static renderedDefault = false;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.selectForVariantNames = {
      createComponentOfType: "variantNames",
      createStateVariable: "selectForVariantNames",
      defaultValue: [],
      public: true,
    }
    attributes.selectWeight = {
      createComponentOfType: "number",
      createStateVariable: "selectWeight",
      defaultValue: 1,
      public: true,
    }
    return attributes;
  }

}
