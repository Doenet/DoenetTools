import MathComponent from './Math';

export default class Equation extends MathComponent {
  static componentType = "equation";
  static rendererType = "math";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let originalValueDef = stateVariableDefinitions.value.definition;

    stateVariableDefinitions.value.definition = function ({ dependencyValues }) {
      let value = originalValueDef({ dependencyValues }).newValues.value;

      let tree = value.tree;
      if (!Array.isArray(tree) || tree[0] !== "=" || tree.length !== 3) {
        console.warn("Invalid format for equation");
      }

      return { newValues: { value } }

    }

    return stateVariableDefinitions;

  }

}