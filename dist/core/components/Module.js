import Template from './Template.js';

export default class Module extends Template {
  static componentType = "module";

  static renderedDefault = true;

  static acceptAnyAttribute = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    delete attributes.styleNumber;

    return attributes;
  }


}
