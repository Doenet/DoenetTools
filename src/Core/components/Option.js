import Group from "./Group";

export default class Option extends Group {
  static componentType = "option";

  static inSchemaOnlyInheritAs = [];
  static allowInSchemaAsComponent = undefined;

  static renderedDefault = false;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.selectForVariants = {
      createComponentOfType: "textListFromString",
      createStateVariable: "selectForVariants",
      defaultValue: [],
      public: true,
    };
    attributes.selectWeight = {
      createComponentOfType: "number",
      createStateVariable: "selectWeight",
      defaultValue: 1,
      public: true,
    };
    return attributes;
  }
}
