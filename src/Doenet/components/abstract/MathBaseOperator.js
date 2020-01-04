import MathComponent from '../Math';
import me from 'math-expressions';

export default class MathOperator extends MathComponent {
  static componentType = "_mathoperator";

  static returnChildLogic(args) {
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

    delete stateVariableDefinitions.codePre;
    delete stateVariableDefinitions.expressionWithCodes;
    delete stateVariableDefinitions.codesAdjacentToStrings;
    delete stateVariableDefinitions.mathChildrenByArrayComponent;

    let constructor = this;

    stateVariableDefinitions.canBeModified = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { canBeModified: false } })
    }

    stateVariableDefinitions.unnormalizedValue = {
      returnDependencies: () => ({
        mathChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroMaths",
          variableNames: ["value", "canBeModified"],
        },
      }),
      defaultValue: me.fromAst('\uff3f'),  // long underscore
      definition: function ({ dependencyValues }) {
        if (dependencyValues.mathChildren.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              unnormalizedValue: { variablesToCheck: ["value", "unnormalizedValue"] }
            }
          }
        } else {
          return {
            newValues: {
              unnormalizedValue: constructor.applyMathOperator(dependencyValues)
            }
          }
        }


      }
    }


    return stateVariableDefinitions;
  }

}
