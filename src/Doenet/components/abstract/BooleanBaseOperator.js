import BooleanComponent from '../Boolean';

export default class BooleanOperator extends BooleanComponent {
  static componentType = "_booleanoperator";
  static rendererType = "boolean";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: "atLeastOneBoolean",
      componentType: 'boolean',
      comparison: 'atLeast',
      number: 1,
      setAsBase: true,
    });

    return childLogic;

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let constructor = this;

    stateVariableDefinitions.value = {
      public: true,
      componentType: this.componentType,
      forRenderer: true,
      returnDependencies: () => ({
        booleanChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastOneBoolean",
          variableNames: ["value"]
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            value: constructor.applyBooleanOperator(
              dependencyValues.booleanChildren
                .map(x => x.stateValues.value)
            )
          }
        }
      }
    }

    return stateVariableDefinitions;

  }

}
