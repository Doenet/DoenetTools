import BlockComponent from "./abstract/BlockComponent";

export default class BlockQuote extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "blockQuote";
  static rendererType = "blockQuote";
  static renderChildren = true;

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
