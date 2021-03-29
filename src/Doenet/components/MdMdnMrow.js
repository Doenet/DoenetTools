import InlineComponent from './abstract/InlineComponent';
import { M } from './MMeMen';
import me from 'math-expressions';

export class Md extends InlineComponent {
  static componentType = "md";
  static rendererType = "math";

  // used when creating new component via adapter or copy prop
  static primaryStateVariableForDefinition = "latex";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["latex"] };

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atLeastZeroMrows",
      componentType: 'mrow',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.mrowChildNames = {
      forRenderer: true,
      returnDependencies: () => ({
        mrowChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroMrows",
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { mrowChildNames: dependencyValues.mrowChildren.map(x => x.componentName) }
      })
    }

    stateVariableDefinitions.latex = {
      public: true,
      componentType: "text",
      defaultValue: "",
      returnDependencies: () => ({
        mrowChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroMrows",
          variableNames: ["latex", "hide", "equationTag", "numbered"],
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.mrowChildren.length > 0) {
          let latex = "";
          for (let child of dependencyValues.mrowChildren) {
            if (child.stateValues.hide) {
              continue;
            }
            if (latex.length > 0) {
              latex += '\\\\'
            }
            if (child.stateValues.numbered) {
              latex += `\\tag{${child.stateValues.equationTag}}`
            } else {
              latex += `\\notag `
            }
            latex += child.stateValues.latex;

          }
          return { newValues: { latex } }

        } else {
          return {
            useEssentialOrDefaultValue: {
              latex: { variablesToCheck: "latex" }
            }
          }
        }
      }

    }

    stateVariableDefinitions.latexWithInputChildren = {
      forRenderer: true,
      returnDependencies: () => ({
        mrowChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroMrows",
          variableNames: ["latexWithInputChildren", "hide", "equationTag", "numbered"],
        },
        latex: {
          dependencyType: "stateVariable",
          variableName: "latex"
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.mrowChildren.length > 0) {
          let latexWithInputChildren = [];
          let inputInd = 0;
          let lastLatex = "";

          for (let mrow of dependencyValues.mrowChildren) {
            if (mrow.stateValues.hide) {
              continue;
            }
            if (lastLatex.length > 0) {
              lastLatex += '\\\\'
            }
            if (mrow.stateValues.numbered) {
              lastLatex += `\\tag{${mrow.stateValues.equationTag}}`
            } else{
              lastLatex += '\\notag '
            }
            for (let latexOrChildInd of mrow.stateValues.latexWithInputChildren) {
              if (typeof latexOrChildInd === "number") {
                if (lastLatex.length > 0) {
                  latexWithInputChildren.push(lastLatex);
                  lastLatex = "";
                }
                latexWithInputChildren.push(inputInd);
                inputInd++;
              } else {
                lastLatex += latexOrChildInd
              }
            }

          }
          if (lastLatex.length > 0) {
            latexWithInputChildren.push(lastLatex);
          }
          return { newValues: { latexWithInputChildren } }

        } else {
          return {
            newValues: {
              latexWithInputChildren: [dependencyValues.latex]
            }
          }
        }
      }

    }


    stateVariableDefinitions.text = {
      returnDependencies: () => ({
        latex: {
          dependencyType: "stateVariable",
          variableName: "latex"
        }
      }),
      definition: function ({ dependencyValues }) {
        let expressionText;
        try {
          expressionText = dependencyValues.stateValues.latex
            .split('\\\\')
            .map(x => me.fromLatex(x).toString())
            .join('\\\\');
        } catch (e) {
          // just return latex if can't parse with math-expressions
          return { newValues: { text: dependencyValues.stateValues.latex } };
        }
        return { newValues: { text: expressionText } };
      }
    }

    stateVariableDefinitions.renderMode = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { renderMode: "align" } })
    }


    stateVariableDefinitions.numbered = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { numbered: false } })
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        mrowChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroMrows",
          variableNames: ["childrenToRender"],
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            childrenToRender: dependencyValues.mrowChildren.reduce(
              (a, c) => [...a, ...c.stateValues.childrenToRender], [])
          }
        };
      }
    }

    return stateVariableDefinitions;
  }

}

export class Mdn extends Md {
  static componentType = "mdn";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numbered = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { numbered: true } })
    }

    return stateVariableDefinitions;
  }
}


export class Mrow extends M {
  static componentType = "mrow";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneNumbered = childLogic.newLeaf({
      name: "atMostOneNumbered",
      componentType: 'numbered',
      comparison: 'atMost',
      number: 1,
      takePropertyChildren: true,
    });

    childLogic.newOperator({
      name: "numberedAndRest",
      operator: "and",
      propositions: [childLogic.baseLogic, atMostOneNumbered],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.renderMode.definition = () => ({
      newValues: { renderMode: "display" }
    });

    stateVariableDefinitions.numbered = {
      forRenderer: true,
      returnDependencies: () => ({
        parentNumbered: {
          dependencyType: "parentStateVariable",
          variableName: "numbered"
        },
        numberedChild: {
          dependencyType: "child",
          childLogicName: "atMostOneNumbered",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues }) {
        let numbered;
        if (dependencyValues.numberedChild.length === 1) {
          numbered = dependencyValues.numberedChild[0].stateValues.value;
        } else {
          numbered = dependencyValues.parentNumbered;
        }

        return {
          newValues: { numbered }
        }
      }
    }

    stateVariableDefinitions.equationTag = {
      public: true,
      componentType: "text",
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["numbered"],
      returnDependencies({ stateValues }) {
        if (stateValues.numbered) {
          return {
            equationCounter: {
              dependencyType: "counter",
              counterName: "equation"
            }
          }
        } else {
          return {}
        }
      },
      definition({ dependencyValues }) {
        if (dependencyValues.equationCounter !== undefined) {
          return {
            newValues: { equationTag: String(dependencyValues.equationCounter) }
          }
        } else {
          return { newValues: { equationTag: null } }
        }
      }
    }


    return stateVariableDefinitions;
  }
}
