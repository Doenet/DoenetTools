import InlineComponent from "./abstract/InlineComponent";
import me from "math-expressions";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "./commonsugar/lists";
import { convertValueToMathExpression, roundForDisplay } from "../utils/math";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";

export default class MathList extends InlineComponent {
  static componentType = "mathList";
  static renderChildren = true;

  static includeBlankStringChildren = true;
  static removeBlankStringChildrenPostSugar = true;

  // when another component has an attribute that is a mathList,
  // use the maths state variable to populate that attribute
  static stateVariableToBeShadowed = "maths";
  static primaryStateVariableForDefinition = "mathsShadow";

  // even if inside a component that turned on descendantCompositesMustHaveAReplacement
  // don't required composite replacements
  static descendantCompositesMustHaveAReplacement = false;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.unordered = {
      createComponentOfType: "boolean",
      createStateVariable: "unordered",
      defaultValue: false,
      public: true,
    };
    attributes.maxNumber = {
      createComponentOfType: "number",
      createStateVariable: "maxNumber",
      defaultValue: null,
      public: true,
    };
    attributes.mergeMathLists = {
      createComponentOfType: "boolean",
    };

    Object.assign(attributes, returnRoundingAttributes());

    attributes.functionSymbols = {
      createComponentOfType: "textList",
      createStateVariable: "functionSymbols",
      defaultValue: ["f", "g"],
      public: true,
      fallBackToParentStateVariable: "functionSymbols",
    };

    attributes.sourcesAreFunctionSymbols = {
      createComponentOfType: "textList",
      createStateVariable: "sourcesAreFunctionSymbols",
      defaultValue: [],
      fallBackToParentStateVariable: "sourcesAreFunctionSymbols",
    };

    attributes.splitSymbols = {
      createComponentOfType: "boolean",
      createStateVariable: "splitSymbols",
      defaultValue: true,
      public: true,
      fallBackToParentStateVariable: "splitSymbols",
    };

    attributes.parseScientificNotation = {
      createComponentOfType: "boolean",
      createStateVariable: "parseScientificNotation",
      defaultValue: false,
      public: true,
      fallBackToParentStateVariable: "parseScientificNotation",
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let groupIntoMathsSeparatedBySpaces =
      returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
        componentType: "math",
      });

    sugarInstructions.push({
      replacementFunction: function ({ matchedChildren }) {
        return groupIntoMathsSeparatedBySpaces({ matchedChildren });
      },
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "maths",
        componentTypes: ["math"],
      },
      {
        group: "mathLists",
        componentTypes: ["mathList"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    Object.assign(
      stateVariableDefinitions,
      returnRoundingStateVariableDefinitions(),
    );

    // set overrideChildHide so that children are hidden
    // only based on whether or not the list is hidden
    // so that can't have a list with partially hidden components
    stateVariableDefinitions.overrideChildHide = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { overrideChildHide: true } }),
    };

    stateVariableDefinitions.mathsShadow = {
      defaultValue: null,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          mathsShadow: true,
        },
      }),
    };

    stateVariableDefinitions.mergeMathLists = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({
        mergeMathListsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "mergeMathLists",
          variableNames: ["value"],
        },
        mathListChildren: {
          dependencyType: "child",
          childGroups: ["mathLists"],
          skipComponentNames: true,
        },
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          skipComponentNames: true,
        },
      }),
      definition({ dependencyValues }) {
        let mergeMathLists =
          dependencyValues.mergeMathListsAttr?.stateValues.value ||
          (dependencyValues.mathListChildren.length === 0 &&
            dependencyValues.mathChildren.length === 1);
        return { setValue: { mergeMathLists } };
      },
    };

    stateVariableDefinitions.numComponents = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      stateVariablesDeterminingDependencies: ["mergeMathLists"],
      additionalStateVariablesDefined: ["childIndexByArrayKey"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          maxNumber: {
            dependencyType: "stateVariable",
            variableName: "maxNumber",
          },
          mergeMathLists: {
            dependencyType: "stateVariable",
            variableName: "mergeMathLists",
          },
          mathsShadow: {
            dependencyType: "stateVariable",
            variableName: "mathsShadow",
          },
        };

        if (stateValues.mergeMathLists) {
          dependencies.mathAndMathListChildren = {
            dependencyType: "child",
            childGroups: ["maths", "mathLists"],
            variableNames: ["value", "numComponents"],
            variablesOptional: true,
          };
        } else {
          dependencies.mathListChildren = {
            dependencyType: "child",
            childGroups: ["mathLists"],
            variableNames: ["numComponents"],
          };
          dependencies.mathAndMathListChildren = {
            dependencyType: "child",
            childGroups: ["maths", "mathLists"],
            skipComponentNames: true,
          };
        }

        return dependencies;
      },
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let numComponents = 0;
        let childIndexByArrayKey = [];

        if (dependencyValues.mathAndMathListChildren.length > 0) {
          if (dependencyValues.mergeMathLists) {
            for (let [
              childInd,
              child,
            ] of dependencyValues.mathAndMathListChildren.entries()) {
              if (
                componentInfoObjects.isInheritedComponentType({
                  inheritedComponentType: child.componentType,
                  baseComponentType: "mathList",
                })
              ) {
                for (let i = 0; i < child.stateValues.numComponents; i++) {
                  childIndexByArrayKey[numComponents + i] = [childInd, i];
                }
                numComponents += child.stateValues.numComponents;
              } else {
                let childValue = child.stateValues.value;

                if (
                  childValue &&
                  Array.isArray(childValue.tree) &&
                  childValue.tree[0] === "list"
                ) {
                  let nPieces = childValue.tree.length - 1;
                  for (let i = 0; i < nPieces; i++) {
                    childIndexByArrayKey[i + numComponents] = [
                      childInd,
                      i,
                      nPieces,
                    ];
                  }
                  numComponents += nPieces;
                } else {
                  childIndexByArrayKey[numComponents] = [childInd, 0];
                  numComponents += 1;
                }
              }
            }
          } else {
            let nMathLists = 0;
            for (let [
              childInd,
              child,
            ] of dependencyValues.mathAndMathListChildren.entries()) {
              if (
                componentInfoObjects.isInheritedComponentType({
                  inheritedComponentType: child.componentType,
                  baseComponentType: "mathList",
                })
              ) {
                let mathListChild =
                  dependencyValues.mathListChildren[nMathLists];
                nMathLists++;
                for (
                  let i = 0;
                  i < mathListChild.stateValues.numComponents;
                  i++
                ) {
                  childIndexByArrayKey[numComponents + i] = [childInd, i];
                }
                numComponents += mathListChild.stateValues.numComponents;
              } else {
                childIndexByArrayKey[numComponents] = [childInd, 0];
                numComponents += 1;
              }
            }
          }
        } else if (dependencyValues.mathsShadow !== null) {
          numComponents = dependencyValues.mathsShadow.length;
        }

        let maxNum = dependencyValues.maxNumber;
        if (maxNum !== null && numComponents > maxNum) {
          numComponents = maxNum;
          childIndexByArrayKey = childIndexByArrayKey.slice(0, maxNum);
        }

        return {
          setValue: { numComponents, childIndexByArrayKey },
          checkForActualChange: { numComponents: true },
        };
      },
    };

    stateVariableDefinitions.maths = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      isArray: true,
      entryPrefixes: ["math"],
      stateVariablesDeterminingDependencies: [
        "mergeMathLists",
        "childIndexByArrayKey",
      ],
      returnArraySizeDependencies: () => ({
        numComponents: {
          dependencyType: "stateVariable",
          variableName: "numComponents",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numComponents];
      },

      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let dependenciesByKey = {};
        let globalDependencies = {
          mergeMathLists: {
            dependencyType: "stateVariable",
            variableName: "mergeMathLists",
          },
          childIndexByArrayKey: {
            dependencyType: "stateVariable",
            variableName: "childIndexByArrayKey",
          },
          mathsShadow: {
            dependencyType: "stateVariable",
            variableName: "mathsShadow",
          },
        };

        for (let arrayKey of arrayKeys) {
          let childIndices = [];
          let mathIndex = "1";
          if (stateValues.childIndexByArrayKey[arrayKey]) {
            childIndices = [stateValues.childIndexByArrayKey[arrayKey][0]];
            mathIndex = stateValues.childIndexByArrayKey[arrayKey][1] + 1;
          }
          dependenciesByKey[arrayKey] = {
            mathAndMathListChildren: {
              dependencyType: "child",
              childGroups: ["maths", "mathLists"],
              variableNames: ["value", "math" + mathIndex],
              variablesOptional: true,
              childIndices,
            },
          };
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        let maths = {};

        for (let arrayKey of arrayKeys) {
          let child =
            dependencyValuesByKey[arrayKey].mathAndMathListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              let childValue = child.stateValues.value;
              if (
                globalDependencyValues.mergeMathLists &&
                Array.isArray(childValue.tree) &&
                childValue.tree[0] === "list"
              ) {
                let ind2 =
                  globalDependencyValues.childIndexByArrayKey[arrayKey][1];
                maths[arrayKey] = childValue.get_component(ind2);
              } else {
                maths[arrayKey] = childValue;
              }
            } else {
              let mathIndex =
                globalDependencyValues.childIndexByArrayKey[arrayKey][1] + 1;
              maths[arrayKey] = child.stateValues["math" + mathIndex];
            }
          } else if (globalDependencyValues.mathsShadow !== null) {
            maths[arrayKey] = globalDependencyValues.mathsShadow[arrayKey];
          }
        }

        return { setValue: { maths } };
      },
      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        stateValues,
        workspace,
      }) {
        if (globalDependencyValues.mergeMathLists) {
          let instructions = [];

          let childIndexByArrayKey = await stateValues.childIndexByArrayKey;

          let arrayKeysAddressed = [];

          for (let arrayKey in desiredStateVariableValues.maths) {
            if (!dependencyValuesByKey[arrayKey]) {
              continue;
            }

            if (arrayKeysAddressed.includes(arrayKey)) {
              continue;
            }

            let desiredValue;
            if (childIndexByArrayKey[arrayKey][2] !== undefined) {
              // found a math that has been split due to merging

              // array keys that are associated with this math child
              let firstInd =
                Number(arrayKey) - childIndexByArrayKey[arrayKey][1];
              let lastInd = firstInd + childIndexByArrayKey[arrayKey][2] - 1;

              // in case just one ind specified, merge with previous values
              if (!workspace.desiredMaths) {
                workspace.desiredMaths = [];
              }

              let desiredTree = ["list"];

              for (let i = firstInd; i <= lastInd; i++) {
                if (desiredStateVariableValues.maths[i] !== undefined) {
                  workspace.desiredMaths[i] = convertValueToMathExpression(
                    desiredStateVariableValues.maths[i],
                  );
                } else if (workspace.desiredMaths[i] === undefined) {
                  workspace.desiredMaths[i] = (await stateValues.maths)[i];
                }

                desiredTree.push(workspace.desiredMaths[i].tree);
                arrayKeysAddressed.push(i.toString());
              }

              desiredValue = me.fromAst(desiredTree);
            } else {
              desiredValue = desiredStateVariableValues.maths[arrayKey];
            }

            let child =
              dependencyValuesByKey[arrayKey].mathAndMathListChildren[0];

            if (child) {
              if (child.stateValues.value !== undefined) {
                instructions.push({
                  setDependency:
                    dependencyNamesByKey[arrayKey].mathAndMathListChildren,
                  desiredValue,
                  childIndex: 0,
                  variableIndex: 0,
                });
              } else {
                instructions.push({
                  setDependency:
                    dependencyNamesByKey[arrayKey].mathAndMathListChildren,
                  desiredValue,
                  childIndex: 0,
                  variableIndex: 1,
                });
              }
            }
          }

          return {
            success: true,
            instructions,
          };
        }

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.maths) {
          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }

          let child =
            dependencyValuesByKey[arrayKey].mathAndMathListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              instructions.push({
                setDependency:
                  dependencyNamesByKey[arrayKey].mathAndMathListChildren,
                desiredValue: desiredStateVariableValues.maths[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });
            } else {
              instructions.push({
                setDependency:
                  dependencyNamesByKey[arrayKey].mathAndMathListChildren,
                desiredValue: desiredStateVariableValues.maths[arrayKey],
                childIndex: 0,
                variableIndex: 1,
              });
            }
          } else if (globalDependencyValues.mathsShadow !== null) {
            if (!workspace.desiredMathShadow) {
              workspace.desiredMathShadow = [
                ...globalDependencyValues.mathsShadow,
              ];
            }
            workspace.desiredMathShadow[arrayKey] =
              desiredStateVariableValues.maths[arrayKey];
            instructions.push({
              setDependency: "mathsShadow",
              desiredValue: workspace.desiredMathShadow,
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.math = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        maths: {
          dependencyType: "stateVariable",
          variableName: "maths",
        },
      }),
      definition({ dependencyValues }) {
        let math;
        if (dependencyValues.maths.length === 0) {
          math = me.fromAst("\uff3f");
        } else if (dependencyValues.maths.length === 1) {
          math = dependencyValues.maths[0];
        } else {
          math = me.fromAst([
            "list",
            ...dependencyValues.maths.map((x) => x.tree),
          ]);
        }

        return { setValue: { math } };
      },
    };

    stateVariableDefinitions.numValues = {
      isAlias: true,
      targetVariableName: "numComponents",
    };

    stateVariableDefinitions.values = {
      isAlias: true,
      targetVariableName: "maths",
    };

    stateVariableDefinitions.numbers = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      isArray: true,
      entryPrefixes: ["number"],
      returnArraySizeDependencies: () => ({
        numComponents: {
          dependencyType: "stateVariable",
          variableName: "numComponents",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numComponents];
      },

      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            math: {
              dependencyType: "stateVariable",
              variableName: `math${Number(arrayKey) + 1}`,
            },
          };
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let numbers = {};

        for (let arrayKey of arrayKeys) {
          numbers[arrayKey] =
            dependencyValuesByKey[arrayKey].math.evaluate_to_constant();
        }

        return { setValue: { numbers } };
      },
      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
      }) {
        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.numbers) {
          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey].math,
            desiredValue: me.fromAst(
              desiredStateVariableValues.numbers[arrayKey],
            ),
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.latex = {
      additionalStateVariablesDefined: ["latexs"],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "latex",
      },
      forRenderer: true,
      returnDependencies: () => ({
        mathAndMathListChildren: {
          dependencyType: "child",
          childGroups: ["maths", "mathLists"],
          variableNames: ["valueForDisplay", "latex", "latexs"],
          variablesOptional: true,
        },
        numComponents: {
          dependencyType: "stateVariable",
          variableName: "numComponents",
        },
        mergeMathLists: {
          dependencyType: "stateVariable",
          variableName: "mergeMathLists",
        },
        mathsShadow: {
          dependencyType: "stateVariable",
          variableName: "mathsShadow",
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits",
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals",
        },
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero",
        },
        padZeros: {
          dependencyType: "stateVariable",
          variableName: "padZeros",
        },
      }),
      definition: function ({ dependencyValues }) {
        let latexs = [];
        let params = {};
        if (dependencyValues.padZeros) {
          if (Number.isFinite(dependencyValues.displayDecimals)) {
            params.padToDecimals = dependencyValues.displayDecimals;
          }
          if (dependencyValues.displayDigits >= 1) {
            params.padToDigits = dependencyValues.displayDigits;
          }
        }
        if (dependencyValues.mathAndMathListChildren.length > 0) {
          for (let child of dependencyValues.mathAndMathListChildren) {
            if (child.stateValues.valueForDisplay) {
              let childValue = child.stateValues.valueForDisplay;

              if (
                dependencyValues.mergeMathLists &&
                Array.isArray(childValue.tree) &&
                childValue.tree[0] === "list"
              ) {
                for (let i = 0; i < childValue.tree.length - 1; i++) {
                  latexs.push(childValue.get_component(i).toLatex(params));
                }
              } else {
                latexs.push(child.stateValues.latex);
              }
            } else {
              latexs.push(...child.stateValues.latexs);
            }
          }
        } else if (dependencyValues.mathsShadow !== null) {
          latexs = dependencyValues.mathsShadow.map((x) =>
            roundForDisplay({
              value: x,
              dependencyValues,
            }).toLatex(params),
          );
        }

        latexs = latexs.slice(0, dependencyValues.numComponents);

        let latex = latexs.join(", ");

        return { setValue: { latex, latexs } };
      },
    };

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      additionalStateVariablesDefined: ["texts"],
      returnDependencies: () => ({
        mathAndMathListChildren: {
          dependencyType: "child",
          childGroups: ["maths", "mathLists"],
          variableNames: ["valueForDisplay", "text", "texts"],
          variablesOptional: true,
        },
        numComponents: {
          dependencyType: "stateVariable",
          variableName: "numComponents",
        },
        mergeMathLists: {
          dependencyType: "stateVariable",
          variableName: "mergeMathLists",
        },
        mathsShadow: {
          dependencyType: "stateVariable",
          variableName: "mathsShadow",
        },
      }),
      definition: function ({ dependencyValues }) {
        let texts = [];

        if (dependencyValues.mathAndMathListChildren.length > 0) {
          for (let child of dependencyValues.mathAndMathListChildren) {
            if (child.stateValues.valueForDisplay) {
              let childValue = child.stateValues.valueForDisplay;

              if (
                dependencyValues.mergeMathLists &&
                Array.isArray(childValue.tree) &&
                childValue.tree[0] === "list"
              ) {
                for (let i = 0; i < childValue.tree.length - 1; i++) {
                  texts.push(childValue.get_component(i).toString());
                }
              } else {
                texts.push(child.stateValues.text);
              }
            } else {
              texts.push(...child.stateValues.texts);
            }
          }
        } else if (dependencyValues.mathsShadow !== null) {
          texts = dependencyValues.mathsShadow.map((x) => x.toString());
        }

        texts = texts.slice(0, dependencyValues.numComponents);

        let text = texts.join(", ");

        return { setValue: { text, texts } };
      },
    };

    stateVariableDefinitions.componentNamesInList = {
      returnDependencies: () => ({
        mathAndMathListChildren: {
          dependencyType: "child",
          childGroups: ["maths", "mathLists"],
          variableNames: ["componentNamesInList", "value"],
          variablesOptional: true,
        },
        numComponents: {
          dependencyType: "stateVariable",
          variableName: "numComponents",
        },
        mergeMathLists: {
          dependencyType: "stateVariable",
          variableName: "mergeMathLists",
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let componentNamesInList = [];
        let numComponentsLeft = dependencyValues.numComponents;

        for (let child of dependencyValues.mathAndMathListChildren) {
          if (numComponentsLeft === 0) {
            break;
          } else if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "mathList",
            })
          ) {
            let componentNamesToAdd =
              child.stateValues.componentNamesInList.slice(
                0,
                numComponentsLeft,
              );

            componentNamesInList.push(...componentNamesToAdd);
            numComponentsLeft -= componentNamesToAdd.length;
          } else {
            componentNamesInList.push(child.componentName);

            if (
              dependencyValues.mergeMathLists &&
              Array.isArray(child.stateValues.value.tree) &&
              child.stateValues.value.tree[0] === "list"
            ) {
              numComponentsLeft -= child.stateValues.value.tree.length - 1;
            } else {
              numComponentsLeft--;
            }
          }
        }

        return { setValue: { componentNamesInList } };
      },
    };

    stateVariableDefinitions.numComponentsToDisplayByChild = {
      additionalStateVariablesDefined: ["numChildrenToRender"],
      returnDependencies: () => ({
        numComponents: {
          dependencyType: "stateVariable",
          variableName: "numComponents",
        },
        mathListChildren: {
          dependencyType: "child",
          childGroups: ["mathLists"],
          variableNames: ["numComponents"],
        },
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value"],
        },
        mathAndMathListChildren: {
          dependencyType: "child",
          childGroups: ["maths", "mathLists"],
          skipComponentNames: true,
        },
        parentNComponentsToDisplayByChild: {
          dependencyType: "parentStateVariable",
          parentComponentType: "mathList",
          variableName: "numComponentsToDisplayByChild",
        },
        mergeMathLists: {
          dependencyType: "stateVariable",
          variableName: "mergeMathLists",
        },
      }),
      definition: function ({
        dependencyValues,
        componentInfoObjects,
        componentName,
      }) {
        let numComponentsToDisplay = dependencyValues.numComponents;

        if (dependencyValues.parentNComponentsToDisplayByChild !== null) {
          // have a parent mathList, which could have limited
          // math of components to display
          numComponentsToDisplay =
            dependencyValues.parentNComponentsToDisplayByChild[componentName];
        }

        let numComponentsToDisplayByChild = {};

        let numComponentsSoFar = 0;
        let numChildrenToRender = 0;

        let nMathLists = 0;
        let nMaths = 0;
        for (let child of dependencyValues.mathAndMathListChildren) {
          let numComponentsLeft = Math.max(
            0,
            numComponentsToDisplay - numComponentsSoFar,
          );
          if (numComponentsLeft > 0) {
            numChildrenToRender++;
          }
          if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "mathList",
            })
          ) {
            let mathListChild = dependencyValues.mathListChildren[nMathLists];
            nMathLists++;

            let numComponentsForMathListChild = Math.min(
              numComponentsLeft,
              mathListChild.stateValues.numComponents,
            );

            numComponentsToDisplayByChild[mathListChild.componentName] =
              numComponentsForMathListChild;
            numComponentsSoFar += numComponentsForMathListChild;
          } else {
            let mathChild = dependencyValues.mathChildren[nMaths];
            nMaths++;

            if (
              dependencyValues.mergeMathLists &&
              Array.isArray(mathChild.stateValues.value.tree) &&
              mathChild.stateValues.value.tree[0] === "list"
            ) {
              let numComponentsInMath =
                mathChild.stateValues.value.tree.length - 1;

              if (numComponentsLeft < numComponentsInMath) {
                numComponentsToDisplayByChild[mathChild.componentName] =
                  numComponentsLeft;
                numComponentsSoFar += numComponentsLeft;
              } else {
                // if we will display the whole math list,
                // don't set numComponentsToDisplayByChild for the math child
                numComponentsSoFar += numComponentsInMath;
              }
            } else {
              numComponentsSoFar += 1;
            }
          }
        }

        return {
          setValue: { numComponentsToDisplayByChild, numChildrenToRender },
        };
      },
      markStale: () => ({ updateRenderedChildren: true }),
    };

    return stateVariableDefinitions;
  }

  static adapters = [
    {
      stateVariable: "math",
      stateVariablesToShadow: Object.keys(
        returnRoundingStateVariableDefinitions(),
      ),
    },
    {
      stateVariable: "numbers",
      componentType: "numberList",
      stateVariablesToShadow: Object.keys(
        returnRoundingStateVariableDefinitions(),
      ),
    },
    "text",
  ];
}
