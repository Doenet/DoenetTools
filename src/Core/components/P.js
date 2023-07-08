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
        let text = "";
        for (let child of dependencyValues.inlineChildren) {
          if (typeof child !== "object") {
            text += child.toString();
          } else if (typeof child.stateValues.text === "string") {
            text += child.stateValues.text;
          } else {
            text += " ";
          }
        }

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
