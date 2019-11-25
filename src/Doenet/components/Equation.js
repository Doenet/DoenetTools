import MathComponent from './Math';

export default class Equation extends MathComponent {
  static componentType = "equation";

  updateState(args={}) {
    super.updateState(args);

    if(!this.childLogicSatisfied || this.unresolvedState.value) {
      return;
    }

    let tree = this.state.value.tree;
    if(!Array.isArray(tree) || tree[0] !== "=" || tree.length !== 3) {
      throw Error("Invalid format for equation");
    }

  }

}