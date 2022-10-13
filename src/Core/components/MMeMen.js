import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';
import { latexToAst } from '../utils/math';

export class M extends InlineComponent {
  static componentType = "m";
  static rendererType = "math";

  static includeBlankStringChildren = true;

  // used when creating new component via adapter or copy prop
  static primaryStateVariableForDefinition = "latex";

  static returnChildGroups() {

    return [{
      group: "inline",
      componentTypes: ["_inline"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.latex = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      defaultValue: "",
      hasEssential: true,
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "child",
          childGroups: ["inline"],
          variableNames: ["latex", "text"],
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.inlineChildren.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              latex: true
            }
          }
        }

        let latex = "";

        for (let child of dependencyValues.inlineChildren) {
          if (typeof child !== "object") {
            latex += child;
          } else if (typeof child.stateValues.latex === "string") {
            latex += child.stateValues.latex
          } else if (typeof child.stateValues.text === "string") {
            latex += child.stateValues.text
          }
        }

        return { setValue: { latex } }

      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (typeof desiredStateVariableValues.latex !== "string") {
          return { success: false }
        }

        if (dependencyValues.inlineChildren.length === 0) {
          return {
            success: true,
            instructions: [{
              setEssentialValue: "latex",
              value: desiredStateVariableValues.latex
            }]
          }
        } else if (dependencyValues.inlineChildren.length === 1) {
          let child = dependencyValues.inlineChildren[0];
          if (typeof child !== "object") {
            return {
              success: true,
              instructions: [{
                setDependency: "inlineChildren",
                desiredValue: desiredStateVariableValues.latex,
                childIndex: 0,
              }]
            }
          } else if (typeof child.stateValues.latex === "string") {
            return {
              success: true,
              instructions: [{
                setDependency: "inlineChildren",
                desiredValue: desiredStateVariableValues.latex,
                childIndex: 0,
                variableIndex: 0  // "latex" state variable
              }]
            }

          } else if (typeof child.stateValues.text === "string") {
            return {
              success: true,
              instructions: [{
                setDependency: "inlineChildren",
                desiredValue: desiredStateVariableValues.latex,
                childIndex: 0,
                variableIndex: 1  // "text" state variable
              }]
            }
          } else {
            return { success: false }
          }
        } else {
          // more than one inline child
          return { success: false }
        }
      }

    }

    stateVariableDefinitions.latexWithInputChildren = {
      forRenderer: true,
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "child",
          childGroups: ["inline"],
          variableNames: ["latex", "text"],
          variablesOptional: true,
        },
        latex: {
          dependencyType: "stateVariable",
          variableName: "latex"
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {

        if (dependencyValues.inlineChildren.length === 0) {
          return {
            setValue: {
              latexWithInputChildren: [dependencyValues.latex]
            }
          }
        }

        let latexWithInputChildren = [];
        let lastLatex = "";
        let inputInd = 0;
        for (let child of dependencyValues.inlineChildren) {
          if (typeof child !== "object") {
            lastLatex += child;
          } else if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "input"
          })) {
            if (lastLatex.length > 0) {
              latexWithInputChildren.push(lastLatex);
              lastLatex = "";
            }
            latexWithInputChildren.push(inputInd);
            inputInd++;
          } else {
            if (typeof child.stateValues.latex === "string") {
              lastLatex += child.stateValues.latex
            } else if (typeof child.stateValues.text === "string") {
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
      shadowingInstructions: {
        createComponentOfType: "text",
      },
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


