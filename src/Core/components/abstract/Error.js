import BlockComponent from "./BlockComponent";

export default class Error extends BlockComponent {
  static componentType = "_error";
  static renderChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.message = {
      createComponentOfType: "text",
      createStateVariable: "message",
      defaultValue: "",
      public: true,
      forRenderer: true,
    };

    return attributes;
  }

  static returnChildGroups() {
    let childGroups = [
      {
        group: "any",
        componentTypes: ["_base"],
      },
    ];

    return childGroups;
  }
}
