import BlockComponent from "./abstract/BlockComponent";
import InlineComponent from "./abstract/InlineComponent";

export class Div extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "div";
  static rendererType = "containerBlock";
  static renderChildren = true;

  static canDisplayChildErrors = true;

  static includeBlankStringChildren = true;

  static returnChildGroups() {
    return [
      {
        group: "anything",
        componentTypes: ["_base"],
      },
    ];
  }

  recordVisibilityChange({ isVisible }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible },
    });
  }
}

export class Span extends InlineComponent {
  static componentType = "span";
  static rendererType = "containerInline";
  static renderChildren = true;

  static canDisplayChildErrors = true;

  static includeBlankStringChildren = true;

  static returnChildGroups() {
    return [
      {
        group: "anything",
        componentTypes: ["_base"],
      },
    ];
  }
}
