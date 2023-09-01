import Template from './Template.js';

export default class Module extends Template {
  static componentType = "module";

  static renderedDefault = true;

  static acceptAnyAttribute = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    delete attributes.styleNumber;

    return attributes;
  }


}
