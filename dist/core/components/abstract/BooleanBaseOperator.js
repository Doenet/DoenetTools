import BooleanComponent from '../Boolean.js';

export default class BooleanOperator extends BooleanComponent {
  static componentType = "_booleanOperator";
  static rendererType = "boolean";

  static descendantCompositesMustHaveAReplacement = false;

  static returnChildGroups() {

    return [{
      group: "booleans",
      componentTypes: ["boolean"]
    }]

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
          childGroups: ["booleans"],
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
