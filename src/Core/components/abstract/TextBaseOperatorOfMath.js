import TextComponent from '../Text';

export default class TextBaseOperatorOfMath extends TextComponent {
  static componentType = "_textOperatorOfMath";
  static rendererType = "text";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);
    
    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: "atLeastZeroMaths",
      componentType: 'math',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let constructor = this;

    stateVariableDefinitions.value = {
      public: true,
      componentType: "text",
      forRenderer: true,
      returnDependencies: () => ({
        mathChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroMaths",
          variableNames: ["value"]
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            value: constructor.applyTextOperator(
              dependencyValues.mathChildren
                .map(x => x.stateValues.value)
            )
          }
        }
      }
    }

    return stateVariableDefinitions;

  }


}
