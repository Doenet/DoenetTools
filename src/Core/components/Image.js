import BlockComponent from './abstract/BlockComponent';

export default class Image extends BlockComponent {
  static componentType = "image";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.width = {
      createComponentOfType: "_componentSize",
      createStateVariable: "width",
      // stateVariableComponentType: "text",
      // componentStateVariableForAttributeValue: "text",
      defaultValue: null,
      public: true,
      forRenderer: true
    };
    attributes.height = {
      createComponentOfType: "_componentSize",
      createStateVariable: "height",
      // stateVariableComponentType: "text",
      // componentStateVariableForAttributeValue: "text",
      defaultValue: null,
      public: true,
      forRenderer: true
    };
    attributes.description = {
      createComponentOfType: "text",
      createStateVariable: "description",
      defaultValue: null,
      public: true,
      forRenderer: true
    };
    attributes.source = {
      createComponentOfType: "text",
      createStateVariable: "source",
      required: true,  // not implemented yet
      public: true,
      forRenderer: true,
    };

    return attributes;
  }

}
