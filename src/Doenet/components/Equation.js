import MathComponent from './Math';

export default class Equation extends MathComponent {
  static componentType = "equation";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let originalValueDef = stateVariableDefinitions.value.definition;

    stateVariableDefinitions.value.definition = function ({ dependencyValues }) {
      let value = originalValueDef({ dependencyValues }).newValues.value;

      let tree = value.tree;
      if (!Array.isArray(tree) || tree[0] !== "=" || tree.length !== 3) {
        throw Error("Invalid format for equation");
      }

      return { newValues: { value } }

    }

  }

}