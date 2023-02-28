import InlineComponent from './abstract/InlineComponent';
import { M } from './MMeMen';
import me from 'math-expressions';
import { latexToAst, superSubscriptsToUnicode } from '../utils/math';
import { returnSelectedStyleStateVariableDefinition } from '../utils/style';

export class Md extends InlineComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      moveMath: this.moveMath.bind(this),
    });

  }
  static componentType = "md";
  static rendererType = "math";

  // used when creating new component via adapter or copy prop
  static primaryStateVariableForDefinition = "latex";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true
    };

    attributes.layer = {
      createComponentOfType: "number",
      createStateVariable: "layer",
      defaultValue: 0,
      public: true,
      forRenderer: true
    };

    attributes.anchor = {
      createComponentOfType: "point",
    }

    attributes.positionFromAnchor = {
      createComponentOfType: "text",
      createStateVariable: "positionFromAnchor",
      defaultValue: "center",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["upperright", "upperleft", "lowerright", "lowerleft", "top", "bottom", "left", "right", "center"]
    }

    attributes.styleNumber.defaultValue = 0;

    return attributes;

  };

  static returnChildGroups() {

    return [{
      group: "mrows",
      componentTypes: ["mrow"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let selectedStyleDefinition = returnSelectedStyleStateVariableDefinition();

    Object.assign(stateVariableDefinitions, selectedStyleDefinition);

    stateVariableDefinitions.mrowChildNames = {
      forRenderer: true,
      returnDependencies: () => ({
        mrowChildren: {
          dependencyType: "child",
          childGroups: ["mrows"],
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { mrowChildNames: dependencyValues.mrowChildren.map(x => x.componentName) }
      })
    }

    stateVariableDefinitions.latex = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      defaultValue: "",
      hasEssential: true,
      shadowVariable: true,
      forRenderer: true,
      returnDependencies: () => ({
        mrowChildren: {
          dependencyType: "child",
          childGroups: ["mrows"],
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
          return { setValue: { latex } }

        } else {
          return {
            useEssentialOrDefaultValue: {
              latex: true
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
          childGroups: ["mrows"],
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
            } else {
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
          return { setValue: { latexWithInputChildren } }

        } else {
          return {
            setValue: {
              latexWithInputChildren: [dependencyValues.latex]
            }
          }
        }
      }

    }


    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        latex: {
          dependencyType: "stateVariable",
          variableName: "latex"
        }
      }),
      definition: function ({ dependencyValues }) {
        let expressionText;
        try {
          expressionText = dependencyValues.latex
            .replaceAll('\\notag', '')
            .replaceAll('\\amp', '')
            .split('\\\\')
            .map(x => me.fromAst(latexToAst.convert(x)).toString())
            .join('\\\\\n');
        } catch (e) {
          // just return latex if can't parse with math-expressions
          return { setValue: { text: dependencyValues.latex } };
        }
        return { setValue: { text: superSubscriptsToUnicode(expressionText.toString()) } };
      }
    }

    stateVariableDefinitions.renderMode = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { renderMode: "align" } })
    }


    stateVariableDefinitions.numbered = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { numbered: false } })
    }

    stateVariableDefinitions.anchor = {
      defaultValue: me.fromText("(0,0)"),
      public: true,
      forRenderer: true,
      hasEssential: true,
      shadowingInstructions: {
        createComponentOfType: "point"
      },
      returnDependencies: () => ({
        anchorAttr: {
          dependencyType: "attributeComponent",
          attributeName: "anchor",
          variableNames: ["coords"],
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.anchorAttr) {
          return { setValue: { anchor: dependencyValues.anchorAttr.stateValues.coords } }
        } else {
          return { useEssentialOrDefaultValue: { anchor: true } }
        }
      },
      async inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues, initialChange }) {

        // if not draggable, then disallow initial change 
        if (initialChange && !await stateValues.draggable) {
          return { success: false };
        }

        if (dependencyValues.anchorAttr) {
          return {
            success: true,
            instructions: [{
              setDependency: "anchorAttr",
              desiredValue: desiredStateVariableValues.anchor,
              variableIndex: 0,
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setEssentialValue: "anchor",
              value: desiredStateVariableValues.anchor
            }]
          }
        }

      }
    }

    return stateVariableDefinitions;
  }


  async moveMath({ x, y, z, transient, actionId }) {
    let components = ["vector"];
    if (x !== undefined) {
      components[1] = x;
    }
    if (y !== undefined) {
      components[2] = y;
    }
    if (z !== undefined) {
      components[3] = z;
    }
    if (transient) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "anchor",
          value: me.fromAst(components),
        }],
        transient,
        actionId,
      });
    } else {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "anchor",
          value: me.fromAst(components),
        }],
        actionId,
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            x, y, z
          }
        }
      });
    }

  }

}

export class Mdn extends Md {
  static componentType = "mdn";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numbered = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { numbered: true } })
    }

    return stateVariableDefinitions;
  }
}


export class Mrow extends M {
  static componentType = "mrow";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.number = {
      createComponentOfType: "boolean",
    };
    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.renderMode.definition = () => ({
      setValue: { renderMode: "display" }
    });

    stateVariableDefinitions.numbered = {
      forRenderer: true,
      returnDependencies: () => ({
        parentNumbered: {
          dependencyType: "parentStateVariable",
          variableName: "numbered"
        },
        numberAttr: {
          dependencyType: "attributeComponent",
          attributeName: "number",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues }) {
        let numbered;
        if (dependencyValues.numberAttr !== null) {
          numbered = dependencyValues.numberAttr.stateValues.value;
        } else {
          numbered = dependencyValues.parentNumbered;
        }

        return {
          setValue: { numbered }
        }
      }
    }

    stateVariableDefinitions.equationTag = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
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
            setValue: { equationTag: String(dependencyValues.equationCounter) }
          }
        } else {
          return { setValue: { equationTag: null } }
        }
      }
    }


    return stateVariableDefinitions;
  }
}
