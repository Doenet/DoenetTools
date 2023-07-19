import InlineComponent from "./abstract/InlineComponent";
import me from "math-expressions";
import {
  getFromText,
  mathStateVariableFromNumberStateVariable,
  numberToMathExpression,
  roundForDisplay,
  textToAst,
} from "../utils/math";
import { buildParsedExpression, evaluateLogic } from "../utils/booleanLogic";
import {
  returnSelectedStyleStateVariableDefinition,
  returnTextStyleDescriptionDefinitions,
} from "../utils/style";
import {
  moveGraphicalObjectWithAnchorAction,
  returnAnchorAttributes,
  returnAnchorStateVariableDefinition,
} from "../utils/graphical";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";

export default class NumberComponent extends InlineComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      moveNumber: this.moveNumber.bind(this),
      numberClicked: this.numberClicked.bind(this),
      numberFocused: this.numberFocused.bind(this),
    });
  }
  static componentType = "number";

  static variableForPlainMacro = "value";
  static plainMacroReturnsSameType = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    Object.assign(attributes, returnRoundingAttributes());

    attributes.renderAsMath = {
      createComponentOfType: "boolean",
      createStateVariable: "renderAsMath",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };
    attributes.convertBoolean = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "convertBoolean",
      defaultValue: false,
    };
    attributes.valueOnNaN = {
      createPrimitiveOfType: "number",
      createStateVariable: "valueOnNaN",
      defaultValue: NaN,
    };

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

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    // if not convertBoolean, then
    // add math around multiple children
    // so that can invert value
    sugarInstructions.push({
      childrenRegex: /..+/,
      replacementFunction: ({ matchedChildren, componentAttributes }) => ({
        success: !componentAttributes.convertBoolean,
        newChildren: [{ componentType: "math", children: matchedChildren }],
      }),
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "strings",
        componentTypes: ["string"],
      },
      {
        group: "numbers",
        componentTypes: ["number"],
      },
      {
        group: "maths",
        componentTypes: ["math"],
      },
      {
        group: "texts",
        componentTypes: ["text"],
      },
      {
        group: "booleans",
        componentTypes: ["boolean"],
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

    let roundingDefinitions = returnRoundingStateVariableDefinitions({
      childsGroupIfSingleMatch: ["maths", "numbers"],
      childGroupsToStopSingleMatch: ["strings", "texts", "booleans"],
      includeListParents: true,
    });
    Object.assign(stateVariableDefinitions, roundingDefinitions);

    stateVariableDefinitions.singleNumberOrStringChild = {
      additionalStateVariablesDefined: ["singleMathChild"],
      returnDependencies: () => ({
        numberChildren: {
          dependencyType: "child",
          childGroups: ["numbers"],
        },
        stringChildren: {
          dependencyType: "child",
          childGroups: ["strings"],
        },
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
        },
        booleanChildren: {
          dependencyType: "child",
          childGroups: ["booleans"],
        },
        textChildren: {
          dependencyType: "child",
          childGroups: ["texts"],
        },
        convertBoolean: {
          dependencyType: "stateVariable",
          variableName: "convertBoolean",
        },
      }),
      definition({ dependencyValues }) {
        let nNumberStrings =
          dependencyValues.numberChildren.length +
          dependencyValues.stringChildren.length;
        let nMaths = dependencyValues.mathChildren.length;
        let nOthers = dependencyValues.booleanChildren.length;

        if (dependencyValues.convertBoolean) {
          nOthers += dependencyValues.textChildren.length;
        } else {
          // if don't convert boolean, then we'll convert text children to numbers
          nNumberStrings += dependencyValues.textChildren.length;
        }

        let singleNumberOrStringChild =
          nNumberStrings <= 1 && nMaths + nOthers === 0;
        let singleMathChild = nMaths === 1 && nNumberStrings + nOthers === 0;

        return { setValue: { singleNumberOrStringChild, singleMathChild } };
      },
    };

    stateVariableDefinitions.parsedExpression = {
      additionalStateVariablesDefined: ["codePre"],
      returnDependencies: () => ({
        allChildren: {
          dependencyType: "child",
          childGroups: ["strings", "numbers", "maths", "texts", "booleans"],
        },
        stringChildren: {
          dependencyType: "child",
          childGroups: ["strings"],
          variableNames: ["value"],
        },
        convertBoolean: {
          dependencyType: "stateVariable",
          variableName: "convertBoolean",
        },
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        if (!dependencyValues.convertBoolean) {
          // if don't convert boolean, then we'll treat texts as numbers
          dependencyValues = { ...dependencyValues };
          dependencyValues.allChildren = dependencyValues.allChildren.map(
            (child) => {
              if (
                componentInfoObjects.isInheritedComponentType({
                  inheritedComponentType: child.componentType,
                  baseComponentType: "text",
                })
              ) {
                child = { componentType: "number" };
              }
              return child;
            },
          );
        }

        return buildParsedExpression({
          dependencyValues,
          componentInfoObjects,
        });
      },
    };

    stateVariableDefinitions.mathChildrenByCode = {
      additionalStateVariablesDefined: [
        "textChildrenByCode",
        "numberChildrenByCode",
        "booleanChildrenByCode",
      ],
      returnDependencies: () => ({
        allChildren: {
          dependencyType: "child",
          childGroups: ["strings", "numbers", "maths", "texts", "booleans"],
          variableNames: ["value", "texts", "maths", "booleans", "number"],
          variablesOptional: true,
        },
        codePre: {
          dependencyType: "stateVariable",
          variableName: "codePre",
        },
        convertBoolean: {
          dependencyType: "stateVariable",
          variableName: "convertBoolean",
        },
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        let mathChildrenByCode = {};
        let numberChildrenByCode = {};
        let textChildrenByCode = {};
        let booleanChildrenByCode = {};
        let subnum = 0;

        let codePre = dependencyValues.codePre;

        for (let child of dependencyValues.allChildren) {
          if (typeof child !== "string") {
            // a math, mathList, text, textList, boolean, or booleanList
            let code = codePre + subnum;

            if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "math",
              })
            ) {
              mathChildrenByCode[code] = child;
            } else if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "number",
              })
            ) {
              numberChildrenByCode[code] = child;
            } else if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "text",
              })
            ) {
              if (dependencyValues.convertBoolean) {
                textChildrenByCode[code] = child;
              } else {
                // treat child like a number
                child = {
                  componentType: "number",
                  stateValues: { value: child.stateValues.number },
                };
                numberChildrenByCode[code] = child;
              }
            } else {
              booleanChildrenByCode[code] = child;
            }
            subnum += 1;
          }
        }

        return {
          setValue: {
            mathChildrenByCode,
            numberChildrenByCode,
            textChildrenByCode,
            booleanChildrenByCode,
          },
        };
      },
    };

    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: this.componentType,
        // the reason we create a attribute component from the state variable,
        // rather than just shadowing the attribute,
        // is that a sequence creates a number where it sets fixed directly in the state
        addAttributeComponentsShadowingStateVariables: {
          fixed: {
            stateVariableToShadow: "fixed",
          },
          ...returnRoundingAttributeComponentShadowing(),
        },
      },
      hasEssential: true,
      defaultValue: NaN,
      stateVariablesDeterminingDependencies: ["singleNumberOrStringChild"],
      returnDependencies({ stateValues }) {
        if (stateValues.singleNumberOrStringChild) {
          return {
            singleNumberOrStringChild: {
              dependencyType: "stateVariable",
              variableName: "singleNumberOrStringChild",
            },
            convertBoolean: {
              dependencyType: "stateVariable",
              variableName: "convertBoolean",
            },
            numberChild: {
              dependencyType: "child",
              childGroups: ["numbers"],
              variableNames: ["value"],
            },
            textChild: {
              dependencyType: "child",
              childGroups: ["texts"],
              variableNames: ["number"],
            },
            stringChild: {
              dependencyType: "child",
              childGroups: ["strings"],
              variableNames: ["value"],
            },
            valueOnNaN: {
              dependencyType: "stateVariable",
              variableName: "valueOnNaN",
            },
          };
        } else {
          return {
            singleNumberOrStringChild: {
              dependencyType: "stateVariable",
              variableName: "singleNumberOrStringChild",
            },
            singleMathChild: {
              dependencyType: "stateVariable",
              variableName: "singleMathChild",
            },
            convertBoolean: {
              dependencyType: "stateVariable",
              variableName: "convertBoolean",
            },
            parsedExpression: {
              dependencyType: "stateVariable",
              variableName: "parsedExpression",
            },
            allChildren: {
              dependencyType: "child",
              childGroups: ["strings", "numbers", "maths", "texts", "booleans"],
              variableNames: ["value", "texts", "maths", "unordered"],
              variablesOptional: true,
            },
            booleanChildrenByCode: {
              dependencyType: "stateVariable",
              variableName: "booleanChildrenByCode",
            },
            textChildrenByCode: {
              dependencyType: "stateVariable",
              variableName: "textChildrenByCode",
            },
            mathChildrenByCode: {
              dependencyType: "stateVariable",
              variableName: "mathChildrenByCode",
            },
            numberChildrenByCode: {
              dependencyType: "stateVariable",
              variableName: "numberChildrenByCode",
            },
            valueOnNaN: {
              dependencyType: "stateVariable",
              variableName: "valueOnNaN",
            },
          };
        }
      },
      definition({ dependencyValues, componentInfoObjects }) {
        if (dependencyValues.singleNumberOrStringChild) {
          if (
            dependencyValues.numberChild.length +
              dependencyValues.textChild.length ===
            0
          ) {
            if (dependencyValues.stringChild.length === 0) {
              return {
                useEssentialOrDefaultValue: {
                  value: { defaultValue: dependencyValues.valueOnNaN },
                },
              };
            }
            let number = Number(dependencyValues.stringChild[0]);
            if (Number.isNaN(number)) {
              try {
                number = me
                  .fromAst(textToAst.convert(dependencyValues.stringChild[0]))
                  .evaluate_to_constant();

                if (typeof number === "boolean") {
                  if (dependencyValues.convertBoolean) {
                    number = number ? 1 : 0;
                  } else {
                    number = dependencyValues.valueOnNaN;
                  }
                } else if (Number.isNaN(number)) {
                  if (dependencyValues.convertBoolean) {
                    let parsedExpression = buildParsedExpression({
                      dependencyValues: {
                        stringChildren: dependencyValues.stringChild,
                        allChildren: dependencyValues.stringChild,
                      },
                      componentInfoObjects,
                    }).setValue.parsedExpression;

                    number = evaluateLogic({
                      logicTree: parsedExpression.tree,
                      dependencyValues: {
                        booleanChildrenByCode: {},
                        booleanListChildrenByCode: {},
                        textChildrenByCode: {},
                        textListChildrenByCode: {},
                        mathChildrenByCode: {},
                        mathListChildrenByCode: {},
                        numberChildrenByCode: {},
                        numberListChildrenByCode: {},
                        otherChildrenByCode: {},
                      },
                      valueOnInvalid: dependencyValues.valueOnNaN,
                    });
                  } else {
                    number = dependencyValues.valueOnNaN;
                  }
                } else if (
                  number?.re === Infinity ||
                  number?.re === -Infinity ||
                  number?.im === Infinity ||
                  number?.im === -Infinity
                ) {
                  // if start with Infinity*i, evaluate_to_constant makes it Infinity+Infinity*i,
                  // but if start with Infinity+Infinity*i, evaluate_to_constant makes is NaN+NaN*i
                  // To make sure displayed value (which has one more pass through evaluate_to_constant)
                  // and value match, pass through evaluate_to_constant a second time in this case
                  number =
                    numberToMathExpression(number).evaluate_to_constant();
                } else if (number?.im === 0) {
                  number = number.re;
                }
              } catch (e) {
                number = dependencyValues.valueOnNaN;
              }
            }
            return { setValue: { value: number } };
          } else {
            let number =
              dependencyValues.numberChild.length === 1
                ? dependencyValues.numberChild[0].stateValues.value
                : dependencyValues.textChild[0].stateValues.number;
            if (Number.isNaN(number)) {
              number = dependencyValues.valueOnNaN;
            }
            return { setValue: { value: number } };
          }
        } else {
          if (dependencyValues.parsedExpression === null) {
            // if don't have parsed expression
            // (which could occur if have invalid form)
            // return dependencyValues.valueOnNaN
            return {
              setValue: { value: dependencyValues.valueOnNaN },
            };
          }

          if (
            Object.keys(dependencyValues.textChildrenByCode).length === 0 &&
            Object.keys(dependencyValues.booleanChildrenByCode).length === 0
          ) {
            // just have strings, numbers, and math, evaluate expression

            let replaceMath = function (tree) {
              if (typeof tree === "string") {
                let child = dependencyValues.mathChildrenByCode[tree];
                if (child !== undefined) {
                  return child.stateValues.value.tree;
                }
                child = dependencyValues.numberChildrenByCode[tree];
                if (child !== undefined) {
                  return numberToMathExpression(child.stateValues.value).tree;
                }
                return tree;
              }
              if (!Array.isArray(tree)) {
                return tree;
              }
              return [tree[0], ...tree.slice(1).map(replaceMath)];
            };

            let number;

            try {
              number = me
                .fromAst(replaceMath(dependencyValues.parsedExpression.tree))
                .evaluate_to_constant();
            } catch (e) {
              number = dependencyValues.valueOnNaN;
            }

            if (
              !Number.isNaN(number) &&
              (typeof number === "number" ||
                (typeof number?.re === "number" &&
                  typeof number?.im === "number"))
            ) {
              return { setValue: { value: number } };
            }
          }

          if (!dependencyValues.convertBoolean) {
            return { setValue: { value: dependencyValues.valueOnNaN } };
          }

          dependencyValues = Object.assign({}, dependencyValues);
          dependencyValues.mathListChildrenByCode = {};
          dependencyValues.numberListChildrenByCode = {};
          dependencyValues.textListChildrenByCode = {};
          dependencyValues.booleanListChildrenByCode = {};
          dependencyValues.otherChildrenByCode = {};

          let fractionSatisfied = evaluateLogic({
            logicTree: dependencyValues.parsedExpression.tree,
            dependencyValues,
            valueOnInvalid: dependencyValues.valueOnNaN,
          });

          // fractionSatisfied will be either 0 or 1 (or valueOnNaN)
          // as have not specified matchPartial

          return { setValue: { value: fractionSatisfied } };
        }
      },
      set: function (value) {
        // this function is called when
        // - definition is overridden by a copy prop
        // - when processing new state variable values
        //   (which could be from outside sources)

        // TODO: we can't access the state variable valueOnNaN here
        // so we can set value to NaN
        // Is there a way to use valueOnNaN?  Is there a case where we'd need to?
        if (value === null) {
          return NaN;
        }
        if (
          typeof value === "number" ||
          (typeof value?.re === "number" && typeof value?.im === "number")
        ) {
          return value;
        }

        let number = Number(value);
        if (Number.isNaN(number)) {
          try {
            number = me
              .fromAst(textToAst.convert(value))
              .evaluate_to_constant();
          } catch (e) {
            number = NaN;
          }
        }
        return number;
      },
      inverseDefinition: async function ({
        desiredStateVariableValues,
        dependencyValues,
        stateValues,
        overrideFixed,
      }) {
        if (!(await stateValues.canBeModified) && !overrideFixed) {
          return { success: false };
        }

        let desiredValue = desiredStateVariableValues.value;
        if (desiredValue instanceof me.class) {
          desiredValue = desiredValue.evaluate_to_constant();
          if (
            Number.isNaN(desiredValue) ||
            !(
              typeof desiredValue === "number" ||
              (typeof desiredValue?.re === "number" &&
                typeof desiredValue?.im === "number")
            )
          ) {
            desiredValue = dependencyValues.valueOnNaN;
          }
        } else {
          if (
            Number.isNaN(desiredValue) ||
            !(
              typeof desiredValue === "number" ||
              (typeof desiredValue?.re === "number" &&
                typeof desiredValue?.im === "number")
            )
          ) {
            desiredValue = Number(desiredValue);
            if (Number.isNaN(desiredValue)) {
              desiredValue = dependencyValues.valueOnNaN;
            }
          }
        }

        if (!dependencyValues.singleNumberOrStringChild) {
          // invert only if have just a single math child
          if (dependencyValues.singleMathChild) {
            return {
              success: true,
              instructions: [
                {
                  setDependency: "allChildren",
                  desiredValue: numberToMathExpression(desiredValue),
                  childIndex: 0,
                  variableIndex: 0,
                },
              ],
            };
          } else {
            // for any other combination that isn't single number or string,
            // we can't invert
            return { success: false };
          }
        }

        let instructions;

        if (dependencyValues.numberChild.length === 0) {
          if (dependencyValues.stringChild.length === 0) {
            instructions = [
              {
                setEssentialValue: "value",
                value:
                  numberToMathExpression(desiredValue).evaluate_to_constant(), // to normalize form
              },
            ];
          } else {
            // TODO: would it be more efficient to defer setting value of string?
            instructions = [
              {
                setDependency: "stringChild",
                desiredValue: numberToMathExpression(desiredValue).toString(),
                childIndex: 0,
                variableIndex: 0,
              },
            ];
          }
        } else {
          instructions = [
            {
              setDependency: "numberChild",
              desiredValue: desiredValue,
              childIndex: 0,
              variableIndex: 0,
            },
          ];
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.valueForDisplay = {
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits",
        },
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero",
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals",
        },
      }),
      definition: function ({ dependencyValues }) {
        // for display via latex and text, round any decimal numbers to the significant digits
        // determined by displaydigits
        let rounded = roundForDisplay({
          value: numberToMathExpression(dependencyValues.value),
          dependencyValues,
        }).evaluate_to_constant();

        return {
          setValue: {
            valueForDisplay: rounded,
          },
        };
      },
    };

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      returnDependencies: () => ({
        valueForDisplay: {
          dependencyType: "stateVariable",
          variableName: "valueForDisplay",
        },
        padZeros: {
          dependencyType: "stateVariable",
          variableName: "padZeros",
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits",
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals",
        },
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
          onlyToSetInInverseDefinition: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        let params = {};
        if (dependencyValues.padZeros) {
          if (Number.isFinite(dependencyValues.displayDecimals)) {
            params.padToDecimals = dependencyValues.displayDecimals;
          }
          if (dependencyValues.displayDigits >= 1) {
            params.padToDigits = dependencyValues.displayDigits;
          }
        }
        return {
          setValue: {
            text: numberToMathExpression(
              dependencyValues.valueForDisplay,
            ).toString(params),
          },
        };
      },
      async inverseDefinition({ desiredStateVariableValues, stateValues }) {
        let desiredNumber = Number(desiredStateVariableValues.text);
        if (Number.isFinite(desiredNumber)) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "value",
                desiredValue: desiredNumber,
              },
            ],
          };
        } else {
          let fromText = getFromText({
            parseScientificNotation: false,
          });

          let expr;
          try {
            expr = fromText(desiredStateVariableValues.text);
          } catch (e) {
            return { success: false };
          }

          desiredNumber = expr.evaluate_to_constant();

          if (Number.isFinite(desiredNumber)) {
            return {
              success: true,
              instructions: [
                {
                  setDependency: "value",
                  desiredValue: desiredNumber,
                },
              ],
            };
          } else {
            return { success: false };
          }
        }
      },
    };

    stateVariableDefinitions.math = mathStateVariableFromNumberStateVariable({
      numberVariableName: "value",
      mathVariableName: "math",
      isPublic: true,
    });

    stateVariableDefinitions.math.shadowingInstructions.addAttributeComponentsShadowingStateVariables =
      returnRoundingAttributeComponentShadowing();

    stateVariableDefinitions.latex = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "latex",
      },
      returnDependencies: () => ({
        valueForDisplay: {
          dependencyType: "stateVariable",
          variableName: "valueForDisplay",
        },
        padZeros: {
          dependencyType: "stateVariable",
          variableName: "padZeros",
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits",
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals",
        },
      }),
      definition({ dependencyValues }) {
        let params = {};
        if (dependencyValues.padZeros) {
          if (Number.isFinite(dependencyValues.displayDecimals)) {
            params.padToDecimals = dependencyValues.displayDecimals;
          }
          if (dependencyValues.displayDigits >= 1) {
            params.padToDigits = dependencyValues.displayDigits;
          }
        }
        return {
          setValue: {
            latex: numberToMathExpression(
              dependencyValues.valueForDisplay,
            ).toLatex(params),
          },
        };
      },
    };

    stateVariableDefinitions.canBeModified = {
      returnDependencies: () => ({
        numberChildModifiable: {
          dependencyType: "child",
          childGroups: ["numbers"],
          variableNames: ["canBeModified"],
        },
        modifyIndirectly: {
          dependencyType: "stateVariable",
          variableName: "modifyIndirectly",
        },
        fixed: {
          dependencyType: "stateVariable",
          variableName: "fixed",
        },
        singleNumberOrStringChild: {
          dependencyType: "stateVariable",
          variableName: "singleNumberOrStringChild",
        },
        singleMathChild: {
          dependencyType: "stateVariable",
          variableName: "singleMathChild",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (
          !dependencyValues.modifyIndirectly ||
          dependencyValues.fixed ||
          !(
            dependencyValues.singleNumberOrStringChild ||
            dependencyValues.singleMathChild
          )
        ) {
          return { setValue: { canBeModified: false } };
        }

        if (
          dependencyValues.numberChildModifiable.length === 1 &&
          !dependencyValues.numberChildModifiable[0].stateValues.canBeModified
        ) {
          return { setValue: { canBeModified: false } };
        }

        return { setValue: { canBeModified: true } };
      },
    };

    return stateVariableDefinitions;
  }

  // returnSerializeInstructions() {
  //   let stringMatches = this.childLogic.returnMatches("atMostOneString");
  //   let skipChildren = stringMatches && stringMatches.length === 1;
  //   if (skipChildren) {
  //     let stateVariables = ["value"];
  //     return { skipChildren, stateVariables };
  //   }
  //   return {};
  // }

  static adapters = [
    {
      stateVariable: "math",
      stateVariablesToShadow: Object.keys(
        returnRoundingStateVariableDefinitions(),
      ),
    },
    "text",
  ];

  async moveNumber({
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

  async numberClicked({
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

  async numberFocused({
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
