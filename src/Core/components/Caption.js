import BlockComponent from './abstract/BlockComponent';

export default class Caption extends BlockComponent {
  static componentType = "caption";
  static rendererType = "container";
  
  static renderChildren = true;

  static includeBlankStringChildren = true;

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroInline = childLogic.newLeaf({
      name: "atLeastZeroInline",
      componentType: '_inline',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroBlock = childLogic.newLeaf({
      name: "atLeastZeroBlock",
      componentType: '_block',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "inlineOrBlock",
      operator: "or",
      propositions: [atLeastZeroInline, atLeastZeroBlock],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "child",
          childLogicName: "inlineOrBlock",
          variableNames: ["text"],
          variablesOptional: true,
        }
      }),
      definition: function ({ dependencyValues }) {

        let text = ""
        for (let child of dependencyValues.inlineChildren) {
          if (typeof child.stateValues.text === "string") {
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
