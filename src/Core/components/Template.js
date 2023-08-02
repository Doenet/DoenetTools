import Group from "./Group";

export default class Template extends Group {
  static componentType = "template";

  static inSchemaOnlyInheritAs = [];
  static allowInSchemaAsComponent = undefined;

  static renderedDefault = false;
}
