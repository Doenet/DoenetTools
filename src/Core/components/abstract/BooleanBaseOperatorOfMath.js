import BooleanComponent from '../Boolean';

export default class BooleanBaseOperatorOfMath extends BooleanComponent {
  static componentType = "_booleanOperatorOfMath";
  static rendererType = "boolean";


  static returnChildGroups() {

    return [{
      group: "maths",
      componentTypes: ["math"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.parsedExpression;
    delete stateVariableDefinitions.mathChildrenByCode;

    stateVariableDefinitions.booleanOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { booleanOperator: x => false } })
    }


    let constructor = this;

    stateVariableDefinitions.value = {
      public: true,
      componentType: "boolean",
      forRenderer: true,
      returnDependencies: () => ({
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value"]
        },
        booleanOperator: {
          dependencyType: "stateVariable",
          variableName: "booleanOperator"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            value: dependencyValues.booleanOperator(
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
