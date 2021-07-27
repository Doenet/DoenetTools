import BooleanComponent from '../Boolean';

export default class BooleanOperator extends BooleanComponent {
  static componentType = "_booleanOperator";
  static rendererType = "boolean";

  static descendantCompositesMustHaveAReplacement = false;

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: "atLeastZeroBooleans",
      componentType: 'boolean',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.parsedExpression;
    delete stateVariableDefinitions.mathChildrenByCode;

    let constructor = this;

    stateVariableDefinitions.value = {
      public: true,
      componentType: "boolean",
      forRenderer: true,
      returnDependencies: () => ({
        booleanChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroBooleans",
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
