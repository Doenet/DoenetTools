import BaseComponent from "./abstract/BaseComponent";

export default class VariantControl extends BaseComponent {
  static componentType = "variantControl";
  static rendererType = undefined;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.nVariants = {
      createPrimitiveOfType: "integer",
    };

    attributes.uniqueVariants = {
      createPrimitiveOfType: "boolean",
    };

    attributes.variantsToInclude = {
      createComponentOfType: "textListFromString",
    };

    attributes.variantsToExclude = {
      createComponentOfType: "textListFromString",
    };

    attributes.variantNames = {
      createComponentOfType: "textListFromString",
    };

    attributes.seeds = {
      createComponentOfType: "textListFromString",
    };

    return attributes;
  }
}
