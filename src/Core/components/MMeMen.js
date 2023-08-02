import InlineComponent from "./abstract/InlineComponent";
import me from "math-expressions";
import { latexToAst, superSubscriptsToUnicode } from "../utils/math";
import {
  returnSelectedStyleStateVariableDefinition,
  returnTextStyleDescriptionDefinitions,
} from "../utils/style";
import {
  moveGraphicalObjectWithAnchorAction,
  returnAnchorAttributes,
  returnAnchorStateVariableDefinition,
} from "../utils/graphical";

export class M extends InlineComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      moveMath: this.moveMath.bind(this),
      mathClicked: this.mathClicked.bind(this),
      mathFocused: this.mathFocused.bind(this),
    });
  }
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
      forRenderer: true,
    };

    attributes.layer = {
      createComponentOfType: "number",
      createStateVariable: "layer",
      defaultValue: 0,
      public: true,
      forRenderer: true,
    };

    Object.assign(attributes, returnAnchorAttributes());

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "inline",
        componentTypes: ["_inline"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let selectedStyleDefinition = returnSelectedStyleStateVariableDefinition();
    Object.assign(stateVariableDefinitions, selectedStyleDefinition);

    let styleDescriptionDefinitions = returnTextStyleDescriptionDefinitions();
    Object.assign(stateVariableDefinitions, styleDescriptionDefinitions);

    let anchorDefinition = returnAnchorStateVariableDefinition();
    Object.assign(stateVariableDefinitions, anchorDefinition);

    let componentClass = this;

    stateVariableDefinitions.latex = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "latex",
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
        let warnings = [];
        if (dependencyValues.inlineChildren.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              latex: true,
            },
          };
        }

        let latex = "";

        for (let child of dependencyValues.inlineChildren) {
          if (typeof child !== "object") {
            latex += child;
          } else if (typeof child.stateValues.latex === "string") {
            latex += child.stateValues.latex;
          } else if (typeof child.stateValues.text === "string") {
            latex += child.stateValues.text;
          } else {
            warnings.push({
              message: `Child <${child.componentType}> of <${componentClass.componentType}> ignored as it does not have a string "text" or "latex" state variable.`,
              level: 1,
            });
          }
        }

        return { setValue: { latex }, sendWarnings: warnings };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (typeof desiredStateVariableValues.latex !== "string") {
          return { success: false };
        }

        if (dependencyValues.inlineChildren.length === 0) {
          return {
            success: true,
            instructions: [
              {
                setEssentialValue: "latex",
                value: desiredStateVariableValues.latex,
              },
            ],
          };
        } else if (dependencyValues.inlineChildren.length === 1) {
          let child = dependencyValues.inlineChildren[0];
          if (typeof child !== "object") {
            return {
              success: true,
              instructions: [
                {
                  setDependency: "inlineChildren",
                  desiredValue: desiredStateVariableValues.latex,
                  childIndex: 0,
                },
              ],
            };
          } else if (typeof child.stateValues.latex === "string") {
            return {
              success: true,
              instructions: [
                {
                  setDependency: "inlineChildren",
                  desiredValue: desiredStateVariableValues.latex,
                  childIndex: 0,
                  variableIndex: 0, // "latex" state variable
                },
              ],
            };
          } else if (typeof child.stateValues.text === "string") {
            return {
              success: true,
              instructions: [
                {
                  setDependency: "inlineChildren",
                  desiredValue: desiredStateVariableValues.latex,
                  childIndex: 0,
                  variableIndex: 1, // "text" state variable
                },
              ],
            };
          } else {
            return { success: false };
          }
        } else {
          // more than one inline child
          return { success: false };
        }
      },
    };

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
          variableName: "latex",
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        if (dependencyValues.inlineChildren.length === 0) {
          return {
            setValue: {
              latexWithInputChildren: [dependencyValues.latex],
            },
          };
        }

        let latexWithInputChildren = [];
        let lastLatex = "";
        let inputInd = 0;
        for (let child of dependencyValues.inlineChildren) {
          if (typeof child !== "object") {
            lastLatex += child;
          } else if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "input",
            })
          ) {
            if (lastLatex.length > 0) {
              latexWithInputChildren.push(lastLatex);
              lastLatex = "";
            }
            latexWithInputChildren.push(inputInd);
            inputInd++;
          } else {
            if (typeof child.stateValues.latex === "string") {
              lastLatex += child.stateValues.latex;
            } else if (typeof child.stateValues.text === "string") {
              lastLatex += child.stateValues.text;
            }
          }
        }
        if (lastLatex.length > 0) {
          latexWithInputChildren.push(lastLatex);
        }

        return { setValue: { latexWithInputChildren } };
      },
    };

    stateVariableDefinitions.renderMode = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { renderMode: "inline" } }),
    };

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        latex: {
          dependencyType: "stateVariable",
          variableName: "latex",
        },
      }),
      definition: function ({ dependencyValues }) {
        let expression;
        try {
          expression = me.fromAst(latexToAst.convert(dependencyValues.latex));
        } catch (e) {
          // just return latex if can't parse with math-expressions
          return { setValue: { text: dependencyValues.latex } };
        }

        return {
          setValue: { text: superSubscriptsToUnicode(expression.toString()) },
        };
      },
    };

    return stateVariableDefinitions;
  }

  async moveMath({
    x,
    y,
    z,
    transient,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    return await moveGraphicalObjectWithAnchorAction({
      x,
      y,
      z,
      transient,
      actionId,
      sourceInformation,
      skipRendererUpdate,
      componentName: this.componentName,
      componentType: this.componentType,
      coreFunctions: this.coreFunctions,
    });
  }

  async mathClicked({
    actionId,
    name,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.fixed)) {
      await this.coreFunctions.triggerChainedActions({
        triggeringAction: "click",
        componentName: name, // use name rather than this.componentName to get original name if adapted
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    }
  }

  async mathFocused({
    actionId,
    name,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.fixed)) {
      await this.coreFunctions.triggerChainedActions({
        triggeringAction: "focus",
        componentName: name, // use name rather than this.componentName to get original name if adapted
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    }
  }
}

export class Me extends M {
  static componentType = "me";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.renderMode.definition = () => ({
      setValue: { renderMode: "display" },
    });
    return stateVariableDefinitions;
  }
}

export class Men extends M {
  static componentType = "men";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.renderMode.definition = () => ({
      setValue: { renderMode: "numbered" },
    });

    stateVariableDefinitions.equationTag = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      mustEvaluate: true, // must evaluate to make sure all counters are accounted for
      returnDependencies: () => ({
        equationCounter: {
          dependencyType: "counter",
          counterName: "equation",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { equationTag: String(dependencyValues.equationCounter) },
        };
      },
    };

    return stateVariableDefinitions;
  }
}
