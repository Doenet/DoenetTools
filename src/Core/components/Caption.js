import BlockComponent from './abstract/BlockComponent';

export default class Caption extends BlockComponent {
  static componentType = "caption";
  static rendererType = "container";

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
      componentType: "text",
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

        return { newValues: { text } };
      }
    }

    return stateVariableDefinitions;

  }

}
