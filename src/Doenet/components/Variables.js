import MathList from './MathList';

export default class Variables extends MathList {
  static componentType = "variables";

  updateState(args={}) {

    if(args.init === true) {
      this.makePublicStateVariableArray({
        variableName: "variables",
        componentType: "variable",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "var",
        arrayVariableName: "variables",
      });
      
    }

    super.updateState(args);

    if(!this.childLogicSatisfied || this.unresolvedState.maths) {
      this.unresolvedState.variables = true;
      this.unresolvedState.validVariables = true;
      return;
    }

    if(this.currentTracker.trackChanges.getVariableChanges({
      component: this, variable: "maths"
    })) {
      delete this.unresolvedState.variables;
      delete this.unresolvedState.validVariables;

      this.state.variables=[];
      this.state.validVariables = [];

      for(let i=1; i<= this.state.ncomponents; i++) {
        let variable = this.state.maths[i-1]

        // to be a valid variable, tree must be either
        // - a string, or
        // - a string with a subscript that is a string or a number
        let tree = variable.tree;
        let validVariable = true;
        if(typeof tree === "string") {
          if(tree === '\uFF3F') {  // long underscore
            validVariable = false;
          }
        }else if(!Array.isArray(tree) ||
          tree[0] !== '_' ||
          (typeof tree[1] !== "string") ||
          ((typeof tree[2] !== "string" && typeof tree[2] !== "number"))
        ) {
          validVariable = false;
        }
        if(!validVariable) {
          console.warn("Invalid value for " + this.componentType);
          validVariable = false;
        }
        this.state.variables.push(variable);
        this.state.validVariables.push(validVariable);

      }
    }
  }
}