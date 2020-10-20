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

    stateVariableDefinitions.latex = {
      public: true,
      componentType: this.componentType,
      defaultValue: "",
      forRenderer: true,
      returnDependencies: () => ({
        mrowChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroMrows",
          variableNames: ["latex", "hide"],
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.mrowChildren.length > 0) {
          let latex = dependencyValues.mrowChildren
            .filter(x => !x.stateValues.hide)
            .map(x => x.stateValues.latex)
            .join('\\\\');
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

    return stateVariableDefinitions;
  }

}

export class Mdn extends Md {
  static componentType = "mdn";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.renderMode.definition = () => ({
      newValues: { renderMode: "alignnumbered" }
    });
    return stateVariableDefinitions;
  }
}


export class Mrow extends M {
  static componentType = "mrow";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.renderMode.definition = () => ({
      newValues: { renderMode: "display" }
    });
    return stateVariableDefinitions;
  }
} 
