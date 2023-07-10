import { textFromChildren } from "../utils/text";
import BlockComponent from "./abstract/BlockComponent";

export default class P extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "p";
  static renderChildren = true;

  static includeBlankStringChildren = true;

  static returnChildGroups() {
    return [
      {
        group: "inlinesAndLists",
        componentTypes: ["_inline", "ol", "ul"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "child",
          childGroups: ["inlinesAndLists"],
          variableNames: ["text"],
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        let text = textFromChildren(dependencyValues.inlineChildren);

        return { setValue: { text } };
      },
    };

    return stateVariableDefinitions;
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
