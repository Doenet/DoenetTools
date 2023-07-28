import Template from "./Template";

export default class Group extends Template {
  static componentType = "group";

  static inSchemaOnlyInheritAs = undefined;
  static allowInSchemaAsComponent = ["_inline", "_block"];

  static renderedDefault = true;
}
