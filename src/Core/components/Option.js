import Group from './Group';

export default class Option extends Group {
  static componentType = "option";

  static renderedDefault = false;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.selectForVariants = {
      createComponentOfType: "variants",
      createStateVariable: "selectForVariants",
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
