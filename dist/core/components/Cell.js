import BaseComponent from './abstract/BaseComponent.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { preprocessMathInverseDefinition, textToAst } from '../utils/math.js';

export default class Cell extends BaseComponent {
  static componentType = "cell";
  static rendererType = "cell";
  static renderChildren = true;

  static includeBlankStringChildren = true;

  static primaryStateVariableForDefinition = "text";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.rowNum = {
      createComponentOfType: "text",
      createStateVariable: "rowNum",
      defaultValue: null,
      public: true,
    };
    attributes.colNum = {
      createComponentOfType: "text",
      createStateVariable: "colNum",
      defaultValue: null,
      public: true,
    };
    attributes.colSpan = {
      createComponentOfType: "integer",
      createStateVariable: "colSpan",
      defaultValue: 1,
      public: true,
      forRenderer: true,
    }
    attributes.halign = {
      createComponentOfType: "text",
    }
    attributes.bottom = {
      createComponentOfType: "text",
    }
    attributes.right = {
      createComponentOfType: "text",
    }
    attributes.prefill = {
      createComponentOfType: "text",
      createStateVariable: "prefill",
      defaultValue: "",
      public: true,
    };

    return attributes;
  }


  static returnChildGroups() {

    return [{
      group: "maths",
      componentTypes: ["math"]
    }, {
      group: "anything",
      componentTypes: ["_base"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.halign = {
      public: true,
      componentType: "text",
      forRenderer: true,
      hasEssential: true,
      defaultValue: "left",
      returnDependencies: () => ({
        halignAttr: {
          dependencyType: "attributeComponent",
          attributeName: "halign",
          variableNames: ["value"]
        },
        parentHalign: {
          dependencyType: "parentStateVariable",
          variableName: "halign"
        },
        // TODO: get halign for corresponding col
        tabularHalign: {
          dependencyType: "ancestor",
          componentType: "tabular",
          variableNames: ["halign"],
        }
      }),
      definition({ dependencyValues, usedDefault }) {

        if (dependencyValues.halignAttr !== null) {
          let halign = dependencyValues.halignAttr.stateValues.value;
          if (!["left", "center", "right", "justify"].includes(halign)) {
            halign = "left";
          }
          return { setValue: { halign } }
        } else if (!usedDefault.parentHalign && dependencyValues.parentHalign) {
          return { setValue: { halign: dependencyValues.parentHalign } }
        } else if (!usedDefault.tabularHalign && dependencyValues.tabularHalign) {
          return { setValue: { halign: dependencyValues.tabularHalign.stateValues.halign } }
        } else {
          return { useEssentialOrDefaultValue: { halign: true } }
        }
      }
    }

    stateVariableDefinitions.bottom = {
      public: true,
      componentType: "text",
      forRenderer: true,
      hasEssential: true,
      defaultValue: "none",
      returnDependencies: () => ({
        bottomAttr: {
          dependencyType: "attributeComponent",
          attributeName: "bottom",
          variableNames: ["value"]
        },
        parentBottom: {
          dependencyType: "parentStateVariable",
          variableName: "bottom"
        },
        tabularBottom: {
          dependencyType: "ancestor",
          componentType: "tabular",
          variableNames: ["bottom"],
        }
      }),
      definition({ dependencyValues, usedDefault }) {

        if (dependencyValues.bottomAttr !== null) {
          let bottom = dependencyValues.bottomAttr.stateValues.value;
          if (!["none", "minor", "medium", "major"].includes(bottom)) {
            bottom = "none";
          }
          return { setValue: { bottom } }
        } else if (!usedDefault.parentBottom && dependencyValues.parentBottom) {
          return { setValue: { bottom: dependencyValues.parentBottom } }
        } else if (!usedDefault.tabularBottom && dependencyValues.tabularBottom) {
          return { setValue: { bottom: dependencyValues.tabularBottom.stateValues.bottom } }
        } else {
          return { useEssentialOrDefaultValue: { bottom: true } }
        }
      }
    }

    stateVariableDefinitions.right = {
      public: true,
      componentType: "text",
      forRenderer: true,
      hasEssential: true,
      defaultValue: "none",
      returnDependencies: () => ({
        rightAttr: {
          dependencyType: "attributeComponent",
          attributeName: "right",
          variableNames: ["value"]
        },
        // TODO: get right for corresponding col
        tabularRight: {
          dependencyType: "ancestor",
          componentType: "tabular",
          variableNames: ["right"],
        }
      }),
      definition({ dependencyValues, usedDefault }) {

        if (dependencyValues.rightAttr !== null) {
          let right = dependencyValues.rightAttr.stateValues.value;
          if (!["none", "minor", "medium", "major"].includes(right)) {
            right = "none";
          }
          return { setValue: { right } }
        } else if (!usedDefault.tabularRight && dependencyValues.tabularRight) {
          return { setValue: { right: dependencyValues.tabularRight.stateValues.right } }
        } else {
          return { useEssentialOrDefaultValue: { right: true } }
        }
      }
    }

    stateVariableDefinitions.inHeader = {
      public: true,
      componentType: "booloean",
      forRenderer: true,
      defaultValue: false,
      returnDependencies: () => ({
        parentHeader: {
          dependencyType: "parentStateVariable",
          variableName: "header"
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { inHeader: dependencyValues.parentHeader === true } }
      }
    }

    stateVariableDefinitions.onlyMathChild = {
      returnDependencies: () => ({
        mathChild: {
          dependencyType: "child",
          childGroups: ["maths"],
        },
        otherChildren: {
          dependencyType: "child",
          childGroups: ["anything"],
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          onlyMathChild: dependencyValues.mathChild.length === 1 &&
            dependencyValues.otherChildren.length === 0
        }
      })
    }

    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      hasEssential: true,
      forRenderer: true,
      returnDependencies: () => ({
        children: {
          dependencyType: "child",
          childGroups: ["maths", "anything"],
          variableNames: ["text"],
          variablesOptional: true,
        },
        prefill: {
          dependencyType: "stateVariable",
          variableName: "prefill"
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.children.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              text: {
                defaultValue: dependencyValues.prefill
              }
            }
          }
        }
        let text = "";
        for (let child of dependencyValues.children) {
          if (typeof child === "object") {
            if (child.stateValues.text) {
              text += child.stateValues.text;
            }
          } else {
            text += child.toString();
          }
        }

        return { setValue: { text } }

      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.children.length === 0) {
          return {
            success: true,
            instructions: [{
              setEssentialValue: "text",
              value: desiredStateVariableValues.text === null ? "" : String(desiredStateVariableValues.text)
            }]
          }
        } else if (dependencyValues.children.length === 1) {
          if (typeof dependencyValues.children[0] === "object" &&
            dependencyValues.children[0].stateValues.text === undefined
          ) {
            return { success: false }
          } else {
            return {
              success: true,
              instructions: [{
                setDependency: "children",
                desiredValue: desiredStateVariableValues.text,
                childIndex: 0,
                variableIndex: 0
              }]
            }
          }
        } else {
          return { success: false }
        }

      }
    }

    stateVariableDefinitions.math = {
      public: true,
      componentType: "math",
      stateVariablesDeterminingDependencies: ["onlyMathChild"],
      returnDependencies({ stateValues }) {
        if (stateValues.onlyMathChild) {
          return {
            mathChild: {
              dependencyType: "child",
              childGroups: ["maths"],
              variableNames: ["value"],
            },
          }
        } else {
          return {
            text: {
              dependencyType: "stateVariable",
              variableName: "text"
            }
          }
        }
      },
      definition({ dependencyValues }) {
        if (dependencyValues.mathChild) {
          return { setValue: { math: dependencyValues.mathChild[0].stateValues.value } }
        } else {
          let math;
          try {
            math = me.fromAst(textToAst.convert(dependencyValues.text));
          } catch (e) {
            math = me.fromAst('\uff3f')
          }

          return { setValue: { math } }
        }
      },
      async inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues, workspace }) {
        if (dependencyValues.mathChild) {
          return {
            success: true,
            instructions: [{
              setDependency: "mathChild",
              desiredValue: desiredStateVariableValues.math,
              childIndex: 0,
              variableIndex: 0,
            }]
          }
        } else {

          let result = await preprocessMathInverseDefinition({
            desiredValue: desiredStateVariableValues.math,
            stateValues,
            variableName: "math",
            workspace,
          })

          return {
            success: true,
            instructions: [{
              setDependency: "text",
              desiredValue: result.desiredValue.toString(),
            }]
          }
        }
      }
    }

    stateVariableDefinitions.number = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        math: {
          dependencyType: "stateVariable",
          variableName: "math"
        }
      }),
      definition({ dependencyValues }) {
        let number = dependencyValues.math.evaluate_to_constant();
        if (!Number.isFinite(number)) {
          number = NaN;
        }
        return { setValue: { number } }
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setDependency: "math",
            desiredValue: me.fromAst(desiredStateVariableValues.number)
          }]
        }
      }
    }


    return stateVariableDefinitions;
  }

  static adapters = ["text", "math", "number"];

}