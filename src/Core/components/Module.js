import Group from "./Group";

export default class Module extends Group {
  static componentType = "module";

  static acceptAnyAttribute = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    delete attributes.styleNumber;

    return attributes;
  }
}
