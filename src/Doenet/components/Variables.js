import MathList from './MathList';

export default class Variables extends MathList {
  static componentType = "variables";



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.variables = {
      public: true,
      componentType: "variable",
      isArray: true,
      entryPrefixes: ["var"],
      returnDependencies: () => ({
        maths: {
          dependencyType: "stateVariable",
          variableName: "maths"
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            variables: dependencyValues.maths
          }
        }
      }
    }

    let thisComponentType = this.componentType;

    stateVariableDefinitions.validVariables = {
      returnDependencies: () => ({
        variables: {
          dependencyType: "stateVariable",
          variableName: "variables"
        },
      }),
      definition: function ({ dependencyValues }) {
        let validVariables = [];

        for (let variable of dependencyValues.variables) {

          // to be a valid variable, tree must be either
          // - a string, or
          // - a string with a subscript that is a string or a number
          let tree = variable.tree;
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
            console.warn("Invalid value for " + thisComponentType);
            validVariable = false;
          }
          validVariables.push(validVariable);

        }

        return { newValues: { validVariables } }
      }

    }
    return stateVariableDefinitions;
  }

}