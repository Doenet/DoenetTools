import BlockComponent from './abstract/BlockComponent.js';

export default class Caption extends BlockComponent {
  static componentType = "caption";
  static rendererType = "containerBlock";

  static renderChildren = true;

  static includeBlankStringChildren = true;


  static returnChildGroups() {

    return [{
      group: "inlinesBlocks",
      componentTypes: ["_inline", "_block"]
    }]

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
          childGroups: ["inlinesBlocks"],
          variableNames: ["text"],
          variablesOptional: true,
        }
      }),
      definition: function ({ dependencyValues }) {

        let text = ""
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
      }
    }

    return stateVariableDefinitions;

  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible }
    })
    this.coreFunctions.resolveAction({ actionId });
  }

  actions = {
    recordVisibilityChange: this.recordVisibilityChange.bind(this),
  }

}
