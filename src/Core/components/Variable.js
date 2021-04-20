import MathComponent from './Math';

export default class Variable extends MathComponent {
  static componentType = "variable";
  static rendererType = "math";

  // TODO: how to add this feature?
  static additionalStateVariablesForProperties = ["validVariable"];


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.validVariable = {
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        }
      }),
      definition: function ({ dependencyValues }) {

        // to be a valid variable, tree must be either
        // - a string other than long underscore, or
        // - a string with a subscript that is a string or a number
        let tree = dependencyValues.value.tree;
        let validVariable = true;
        if (typeof tree === "string") {
          if (tree === '\uFF3F') {  // long underscore
            validVariable = false;
          }
        } else if (!Array.isArray(tree) ||
          tree[0] !== '_' ||
          (typeof tree[1] !== "string") ||
          ((typeof tree[2] !== "string" && typeof tree[2] !== "number"))
        ) {
          validVariable = false;
        }
        if (!validVariable) {
          console.warn("Invalid value of a " + this.componentType);
        }

        return { newValues: { validVariable } }
      }
    }

    return stateVariableDefinitions;
  }

}