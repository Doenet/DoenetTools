import BooleanComponent from '../Boolean';

export default class BooleanBaseOperatorOfMath extends BooleanComponent {
  static componentType = "_booleanOperatorOfMath";
  static rendererType = "boolean";


  static returnSugarInstructions() {
    let sugarInstructions = [];

    let wrapStringsAndMacros = function ({ matchedChildren }) {

      // only apply if all children are strings or macros
      if (!matchedChildren.every(child =>
        typeof child === "string" ||
        child.doenetAttributes && child.doenetAttributes.createdFromMacro
      )) {
        return { success: false }
      }

      // don't apply to a single macro
      if (matchedChildren.length === 1 &&
        typeof matchedChildren[0] !== "string"
      ) {
        return { success: false }
      }

      return {
        success: true,
        newChildren: [{
          componentType: "math",
          children: matchedChildren
        }],
      }

    }

    sugarInstructions.push({
      replacementFunction: wrapStringsAndMacros
    });

    return sugarInstructions;
  }

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
