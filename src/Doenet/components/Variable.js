import MathComponent from './Math';

export default class Variable extends MathComponent {
  static componentType = "variable";

  static additionalStateVariablesForProperties = ["validVariable"];

  updateState(args={}) {
    if(args.init) {
      if(this._state.validVariable === undefined) {
        this._state.validVariable = {};
      }
      this._state.validVariable.trackChanges = true;
    }
    super.updateState(args);

    if(!this.childLogicSatisfied || this.unresolvedState.value) {
      this.unresolvedState.validVariable = true;
      return;
    }

    if(this.currentTracker.trackChanges.getVariableChanges({
      component: this, variable: "value"
    })) {

      delete this.unresolvedState.validVariable;

      // to be a valid variable, tree must be either
      // - a string other than long underscore, or
      // - a string with a subscript that is a string or a number
      let tree = this.state.value.tree;
      this.state.validVariable = true;
      if(typeof tree === "string") {
        if(tree === '\uFF3F') {  // long underscore
          this.state.validVariable = false;
        }
      }else if(!Array.isArray(tree) ||
        tree[0] !== '_' ||
        (typeof tree[1] !== "string") ||
        ((typeof tree[2] !== "string" && typeof tree[2] !== "number"))
      ) {
        this.state.validVariable = false;
      }
      if(!this.state.validVariable) {
        console.warn("Invalid value of a " + this.componentType);
      }
    }
  }
}