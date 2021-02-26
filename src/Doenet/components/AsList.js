import InlineComponent from './abstract/InlineComponent';

export default class AsList extends InlineComponent {
  static componentType = "aslist";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atLeastZeroInline",
      componentType: '_inline',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        activeChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroInline"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues:
            { childrenToRender: dependencyValues.activeChildren.map(x => x.componentName) }
        };
      }
    }

    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroInline",
          variableNames: ["text"],
          variablesOptional: true,
        }
      }),
      definition: function ({ dependencyValues }) {

        let textpieces = [];
        for (let child of dependencyValues.inlineChildren) {
          if (typeof child.stateValues.text === "string") {
            textpieces.push(child.stateValues.text);
          } else {
            textpieces.push('');
          }
        }
        let text = textpieces.join(', ');

        return { newValues: { text } };
      }
    }

    return stateVariableDefinitions;
  }

}
