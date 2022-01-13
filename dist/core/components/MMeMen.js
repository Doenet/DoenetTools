import InlineComponent from './abstract/InlineComponent.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { latexToAst } from '../utils/math.js';

export class M extends InlineComponent {
  static componentType = "m";
  static rendererType = "math";

  static includeBlankStringChildren = true;

  // used when creating new component via adapter or copy prop
  static primaryStateVariableForDefinition = "latex";

  static returnChildGroups() {

    return [{
      group: "stringsTextsAndMaths",
      componentTypes: ["string", "text", "math", "mathList", "m", "mathInput"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.latex = {
      public: true,
      componentType: "text",
      defaultValue: "",
      hasEssential: true,
      returnDependencies: () => ({
        stringTextMathChildren: {
          dependencyType: "child",
          childGroups: ["stringsTextsAndMaths"],
          variableNames: ["latex", "text"],
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.stringTextMathChildren.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              latex: true
            }
          }
        }

        let latex = "";

        for (let child of dependencyValues.stringTextMathChildren) {
          if (typeof child === "string") {
            latex += child;
          } else if (child.stateValues.latex) {
            latex += child.stateValues.latex
          } else if (child.stateValues.text) {
            latex += child.stateValues.text
          }
        }

        return { setValue: { latex } }

      }

    }

    stateVariableDefinitions.latexWithInputChildren = {
      forRenderer: true,
      returnDependencies: () => ({
        stringTextMathChildren: {
          dependencyType: "child",
          childGroups: ["stringsTextsAndMaths"],
          variableNames: ["latex", "text"],
          variablesOptional: true,
        },
        latex: {
          dependencyType: "stateVariable",
          variableName: "latex"
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {

        if (dependencyValues.stringTextMathChildren.length === 0) {
          return {
            setValue: {
              latexWithInputChildren: [dependencyValues.latex]
            }
          }
        }

        let latexWithInputChildren = [];
        let lastLatex = "";
        let inputInd = 0;
        for (let child of dependencyValues.stringTextMathChildren) {
          if (typeof child === "string") {
            lastLatex += child;
          } else if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "mathInput"
          })) {
            if (lastLatex.length > 0) {
              latexWithInputChildren.push(lastLatex);
              lastLatex = "";
            }
            latexWithInputChildren.push(inputInd);
            inputInd++;
          } else {
            if (child.stateValues.latex) {
              lastLatex += child.stateValues.latex
            } else if (child.stateValues.text) {
              lastLatex += child.stateValues.text
            }
          }
        }
        if (lastLatex.length > 0) {
          latexWithInputChildren.push(lastLatex);
        }

        return { setValue: { latexWithInputChildren } }

      }

    }


    stateVariableDefinitions.renderMode = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { renderMode: "inline" } })
    }


    stateVariableDefinitions.text = {
      returnDependencies: () => ({
        latex: {
          dependencyType: "stateVariable",
          variableName: "latex"
        }
      }),
      definition: function ({ dependencyValues }) {
        let expression;
        try {
          expression = me.fromAst(latexToAst.convert(dependencyValues.latex));
        } catch (e) {
          // just return latex if can't parse with math-expressions
          return { setValue: { text: dependencyValues.latex } };
        }
        return { setValue: { text: expression.toString() } };
      }
    }




    return stateVariableDefinitions;
  }

}

export class Me extends M {
  static componentType = "me";


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.renderMode.definition = () => ({
      setValue: { renderMode: "display" }
    });
    return stateVariableDefinitions;
  }
}

export class Men extends M {
  static componentType = "men";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.renderMode.definition = () => ({
      setValue: { renderMode: "numbered" }
    });

    stateVariableDefinitions.equationTag = {
      public: true,
      componentType: "text",
      forRenderer: true,
      returnDependencies: () => ({
        equationCounter: {
          dependencyType: "counter",
          counterName: "equation"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { equationTag: String(dependencyValues.equationCounter) }
        }
      }
    }

    return stateVariableDefinitions;
  }
}


