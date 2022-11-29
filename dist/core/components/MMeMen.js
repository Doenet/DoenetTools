import InlineComponent from './abstract/InlineComponent.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { latexToAst, superSubscriptsToUnicode } from '../utils/math.js';
import { returnSelectedStyleStateVariableDefinition } from '../utils/style.js';

export class M extends InlineComponent {
  static componentType = "m";
  static rendererType = "math";

  static includeBlankStringChildren = true;

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
      group: "inline",
      componentTypes: ["_inline"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let selectedStyleDefinition = returnSelectedStyleStateVariableDefinition();

    Object.assign(stateVariableDefinitions, selectedStyleDefinition);

    stateVariableDefinitions.latex = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      defaultValue: "",
      hasEssential: true,
      forRenderer: true,
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
        let expression;
        try {
          expression = me.fromAst(latexToAst.convert(dependencyValues.latex));
        } catch (e) {
          // just return latex if can't parse with math-expressions
          return { setValue: { text: dependencyValues.latex } };
        }

        return { setValue: { text: superSubscriptsToUnicode(expression.toString()) } };
      }
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


  actions = {
    moveMath: this.moveMath.bind(this),
  };

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


