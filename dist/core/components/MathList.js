import InlineComponent from './abstract/InlineComponent.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { returnBreakStringsIntoComponentTypeBySpaces, returnGroupIntoComponentTypeSeparatedBySpaces } from './commonsugar/lists.js';
import { convertValueToMathExpression, roundForDisplay } from '../utils/math.js';

export default class MathList extends InlineComponent {
  static componentType = "mathList";
  static renderChildren = true;

  static includeBlankStringChildren = true;
  static removeBlankStringChildrenPostSugar = true;

  // when another component has an attribute that is a mathList,
  // use the maths state variable to populate that attribute
  static stateVariableForAttributeValue = "maths";
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
    attributes.maximumNumber = {
      createComponentOfType: "number",
      createStateVariable: "maximumNumber",
      defaultValue: null,
      public: true,
    };
    attributes.mergeMathLists = {
      createComponentOfType: "boolean",
    };
    attributes.displayDigits = {
      createComponentOfType: "integer",
    };
    attributes.displayDecimals = {
      createComponentOfType: "integer",
      createStateVariable: "displayDecimals",
      defaultValue: null,
      public: true,
    };
    attributes.displaySmallAsZero = {
      createComponentOfType: "number",
      createStateVariable: "displaySmallAsZero",
      valueForTrue: 1E-14,
      valueForFalse: 0,
      defaultValue: 0,
      public: true,
    };
    attributes.padZeros = {
      createComponentOfType: "boolean",
      createStateVariable: "padZeros",
      defaultValue: false,
      public: true,
    };

    return attributes;
  }


  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let groupIntoMathsSeparatedBySpaces = returnGroupIntoComponentTypeSeparatedBySpaces({
      componentType: "math"
    });
    let breakStringsIntoMathsBySpaces = returnBreakStringsIntoComponentTypeBySpaces({
      componentType: "math"
    });

    sugarInstructions.push({
      replacementFunction: function ({
        matchedChildren, isAttributeComponent = false, createdFromMacro = false,
      }) {
        if (isAttributeComponent && !createdFromMacro) {
          // if in attribute not created by a macros,
          // then group expressions like 3$x+3 into a single match by wrapping with a math
          return groupIntoMathsSeparatedBySpaces({ matchedChildren });
        } else {
          // otherwise, just break strings into pieces and wrap each piece with a math,
          // leaving all othe components alone
          return breakStringsIntoMathsBySpaces({ matchedChildren })
        }
      }
    });

    return sugarInstructions;

  }


  static returnChildGroups() {

    return [{
      group: "maths",
      componentTypes: ["math"]
    }, {
      group: "mathLists",
      componentTypes: ["mathList"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // set overrideChildHide so that children are hidden
    // only based on whether or not the list is hidden
    // so that can't have a list with partially hidden components
    stateVariableDefinitions.overrideChildHide = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { overrideChildHide: true } })
    }

    stateVariableDefinitions.displayDigits = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      hasEssential: true,
      defaultValue: 10,
      returnDependencies: () => ({
        displayDigitsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDigits",
          variableNames: ["value"]
        },
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        },
      }),
      definition({ dependencyValues, usedDefault }) {

        if (dependencyValues.displayDigitsAttr !== null) {

          let displayDigitsAttrUsedDefault = usedDefault.displayDigitsAttr;
          let displayDecimalsAttrUsedDefault = dependencyValues.displayDecimalsAttr === null || usedDefault.displayDecimalsAttr;

          if (!(displayDigitsAttrUsedDefault || displayDecimalsAttrUsedDefault)) {
            // if both display digits and display decimals did not use default
            // we'll regard display digits as using default if it comes from a deeper shadow
            let shadowDepthDisplayDigits = dependencyValues.displayDigitsAttr.shadowDepth;
            let shadowDepthDisplayDecimals = dependencyValues.displayDecimalsAttr.shadowDepth;

            if (shadowDepthDisplayDecimals < shadowDepthDisplayDigits) {
              displayDigitsAttrUsedDefault = true;
            }
          }

          if (displayDigitsAttrUsedDefault) {
            return {
              useEssentialOrDefaultValue: {
                displayDigits: {
                  defaultValue: dependencyValues.displayDigitsAttr.stateValues.value
                }
              }
            }
          } else {
            return {
              setValue: {
                displayDigits: dependencyValues.displayDigitsAttr.stateValues.value
              }
            }
          }
        }

        return { useEssentialOrDefaultValue: { displayDigits: true } }

      }
    }

    stateVariableDefinitions.mathsShadow = {
      defaultValue: null,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          mathsShadow: true
        }
      }),
    }

    stateVariableDefinitions.mergeMathLists = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({
        mergeMathListsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "mergeMathLists",
          variableNames: ["value"]
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
        }
      }),
      definition({ dependencyValues }) {
        let mergeMathLists =
          dependencyValues.mergeMathListsAttr?.stateValues.value
          || (
            dependencyValues.mathListChildren.length === 0
            && dependencyValues.mathChildren.length === 1
          );
        return { setValue: { mergeMathLists } }
      }

    }


    stateVariableDefinitions.nComponents = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      stateVariablesDeterminingDependencies: ["mergeMathLists"],
      additionalStateVariablesDefined: ["childIndexByArrayKey"],
      returnDependencies({ stateValues }) {

        let dependencies = {
          maximumNumber: {
            dependencyType: "stateVariable",
            variableName: "maximumNumber",
          },
          mergeMathLists: {
            dependencyType: "stateVariable",
            variableName: "mergeMathLists",
          },
          mathsShadow: {
            dependencyType: "stateVariable",
            variableName: "mathsShadow",
          }
        }

        if (stateValues.mergeMathLists) {
          dependencies.mathAndMathListChildren = {
            dependencyType: "child",
            childGroups: ["maths", "mathLists"],
            variableNames: ["value", "nComponents"],
            variablesOptional: true,
          };
        } else {
          dependencies.mathListChildren = {
            dependencyType: "child",
            childGroups: ["mathLists"],
            variableNames: ["nComponents"],
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

        let nComponents = 0;
        let childIndexByArrayKey = [];

        if (dependencyValues.mathAndMathListChildren.length > 0) {
          if (dependencyValues.mergeMathLists) {
            for (let [childInd, child] of dependencyValues.mathAndMathListChildren.entries()) {
              if (componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "mathList"
              })) {
                for (let i = 0; i < child.stateValues.nComponents; i++) {
                  childIndexByArrayKey[nComponents + i] = [childInd, i];
                }
                nComponents += child.stateValues.nComponents;

              } else {

                let childValue = child.stateValues.value;

                if (childValue && Array.isArray(childValue.tree) && childValue.tree[0] === "list") {
                  let nPieces = childValue.tree.length - 1
                  for (let i = 0; i < nPieces; i++) {
                    childIndexByArrayKey[i + nComponents] = [childInd, i, nPieces];
                  }
                  nComponents += nPieces;
                } else {
                  childIndexByArrayKey[nComponents] = [childInd, 0];
                  nComponents += 1;
                }

              }
            }
          } else {
            let nMathLists = 0;
            for (let [childInd, child] of dependencyValues.mathAndMathListChildren.entries()) {
              if (componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "mathList"
              })) {
                let mathListChild = dependencyValues.mathListChildren[nMathLists];
                nMathLists++;
                for (let i = 0; i < mathListChild.stateValues.nComponents; i++) {
                  childIndexByArrayKey[nComponents + i] = [childInd, i];
                }
                nComponents += mathListChild.stateValues.nComponents;

              } else {

                childIndexByArrayKey[nComponents] = [childInd, 0];
                nComponents += 1;
              }
            }
          }
        } else if (dependencyValues.mathsShadow !== null) {
          nComponents = dependencyValues.mathsShadow.length;
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && nComponents > maxNum) {
          nComponents = maxNum;
          childIndexByArrayKey = childIndexByArrayKey.slice(0, maxNum);
        }

        return {
          setValue: { nComponents, childIndexByArrayKey },
          checkForActualChange: { nComponents: true }
        }
      }
    }


    stateVariableDefinitions.maths = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
      },
      isArray: true,
      entryPrefixes: ["math"],
      stateVariablesDeterminingDependencies: ["mergeMathLists", "childIndexByArrayKey"],
      returnArraySizeDependencies: () => ({
        nComponents: {
          dependencyType: "stateVariable",
          variableName: "nComponents",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nComponents];
      },

      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let dependenciesByKey = {}
        let globalDependencies = {
          mergeMathLists: {
            dependencyType: "stateVariable",
            variableName: "mergeMathLists",
          },
          childIndexByArrayKey: {
            dependencyType: "stateVariable",
            variableName: "childIndexByArrayKey"
          },
          mathsShadow: {
            dependencyType: "stateVariable",
            variableName: "mathsShadow",
          }
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
          }
        }
        return { globalDependencies, dependenciesByKey }

      },
      arrayDefinitionByKey({
        globalDependencyValues, dependencyValuesByKey, arrayKeys,
      }) {

        let maths = {};

        for (let arrayKey of arrayKeys) {
          let child = dependencyValuesByKey[arrayKey].mathAndMathListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              let childValue = child.stateValues.value;
              if (globalDependencyValues.mergeMathLists && Array.isArray(childValue.tree) && childValue.tree[0] === "list") {
                let ind2 = globalDependencyValues.childIndexByArrayKey[arrayKey][1];
                maths[arrayKey] = childValue.get_component(ind2);

              } else {
                maths[arrayKey] = childValue;
              }

            } else {

              let mathIndex = globalDependencyValues.childIndexByArrayKey[arrayKey][1] + 1;
              maths[arrayKey] = child.stateValues["math" + mathIndex];

            }

          } else if (globalDependencyValues.mathsShadow !== null) {
            maths[arrayKey] = globalDependencyValues.mathsShadow[arrayKey];
          }

        }

        return { setValue: { maths } }

      },
      async inverseArrayDefinitionByKey({ desiredStateVariableValues, globalDependencyValues,
        dependencyValuesByKey, dependencyNamesByKey, stateValues, workspace
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
              let firstInd = Number(arrayKey) - childIndexByArrayKey[arrayKey][1];
              let lastInd = firstInd + childIndexByArrayKey[arrayKey][2] - 1;

              // in case just one ind specified, merge with previous values
              if (!workspace.desiredMaths) {
                workspace.desiredMaths = [];
              }

              let desiredTree = ["list"];

              for (let i = firstInd; i <= lastInd; i++) {
                if (desiredStateVariableValues.maths[i] !== undefined) {
                  workspace.desiredMaths[i] = convertValueToMathExpression(desiredStateVariableValues.maths[i]);
                } else if (workspace.desiredMaths[i] === undefined) {
                  workspace.desiredMaths[i] = (await stateValues.maths)[i];
                }

                desiredTree.push(workspace.desiredMaths[i].tree)
                arrayKeysAddressed.push(i.toString());
              }

              desiredValue = me.fromAst(desiredTree);

            } else {
              desiredValue = desiredStateVariableValues.maths[arrayKey]
            }

            let child = dependencyValuesByKey[arrayKey].mathAndMathListChildren[0];

            if (child) {
              if (child.stateValues.value !== undefined) {
                instructions.push({
                  setDependency: dependencyNamesByKey[arrayKey].mathAndMathListChildren,
                  desiredValue,
                  childIndex: 0,
                  variableIndex: 0,
                });

              } else {
                instructions.push({
                  setDependency: dependencyNamesByKey[arrayKey].mathAndMathListChildren,
                  desiredValue,
                  childIndex: 0,
                  variableIndex: 1,
                });

              }
            }

          }

          return {
            success: true,
            instructions
          }
        }

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.maths) {

          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }

          let child = dependencyValuesByKey[arrayKey].mathAndMathListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].mathAndMathListChildren,
                desiredValue: desiredStateVariableValues.maths[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });

            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].mathAndMathListChildren,
                desiredValue: desiredStateVariableValues.maths[arrayKey],
                childIndex: 0,
                variableIndex: 1,
              });

            }
          }
        }

        return {
          success: true,
          instructions
        }


      }
    }

    stateVariableDefinitions.math = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
      },
      returnDependencies: () => ({
        maths: {
          dependencyType: "stateVariable",
          variableName: "maths"
        }
      }),
      definition({ dependencyValues }) {
        let math;
        if (dependencyValues.maths.length === 0) {
          math = me.fromAst("\uff3f");
        } else if (dependencyValues.maths.length === 1) {
          math = dependencyValues.maths[0]
        } else {
          math = me.fromAst(["list", ...dependencyValues.maths.map(x => x.tree)]);
        }

        return { setValue: { math } }

      }
    }

    stateVariableDefinitions.nValues = {
      isAlias: true,
      targetVariableName: "nComponents"
    };

    stateVariableDefinitions.values = {
      isAlias: true,
      targetVariableName: "maths"
    };

    stateVariableDefinitions.latex = {
      additionalStateVariablesDefined: ["latexs"],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      returnDependencies: () => ({
        mathAndMathListChildren: {
          dependencyType: "child",
          childGroups: ["maths", "mathLists"],
          variableNames: ["valueForDisplay", "latex", "latexs"],
          variablesOptional: true,
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
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
          variableName: "displayDigits"
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals"
        },
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero"
        },
        padZeros: {
          dependencyType: "stateVariable",
          variableName: "padZeros"
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {
        let latexs = [];
        let params = {};
        if (dependencyValues.padZeros) {
          if (usedDefault.displayDigits && !usedDefault.displayDecimals) {
            if (Number.isFinite(dependencyValues.displayDecimals)) {
              params.padToDecimals = dependencyValues.displayDecimals;
            }
          } else if (dependencyValues.displayDigits >= 1) {
            params.padToDigits = dependencyValues.displayDigits;
          }
        }
        if (dependencyValues.mathAndMathListChildren.length > 0) {
          for (let child of dependencyValues.mathAndMathListChildren) {

            if (child.stateValues.valueForDisplay) {

              let childValue = child.stateValues.valueForDisplay;

              if (dependencyValues.mergeMathLists && Array.isArray(childValue.tree) && childValue.tree[0] === "list") {
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
          latexs = dependencyValues.mathsShadow.map(x =>
            roundForDisplay({
              value: x,
              dependencyValues, usedDefault
            }).toLatex(params))

        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && latexs.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          latexs = latexs.slice(0, maxNum)
        }

        let latex = latexs.join(', ');

        return { setValue: { latex, latexs } }

      }
    }


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
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
        mergeMathLists: {
          dependencyType: "stateVariable",
          variableName: "mergeMathLists",
        },
        mathsShadow: {
          dependencyType: "stateVariable",
          variableName: "mathsShadow",
        }
      }),
      definition: function ({ dependencyValues }) {
        let texts = [];

        if (dependencyValues.mathAndMathListChildren.length > 0) {
          for (let child of dependencyValues.mathAndMathListChildren) {

            if (child.stateValues.valueForDisplay) {

              let childValue = child.stateValues.valueForDisplay;

              if (dependencyValues.mergeMathLists && Array.isArray(childValue.tree) && childValue.tree[0] === "list") {
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
          texts = dependencyValues.mathsShadow.map(x => x.toString())
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && texts.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          texts = texts.slice(0, maxNum)
        }

        let text = texts.join(', ');

        return { setValue: { text, texts } }

      }
    }


    stateVariableDefinitions.componentNamesInList = {
      returnDependencies: () => ({
        mathAndMathListChildren: {
          dependencyType: "child",
          childGroups: ["maths", "mathLists"],
          variableNames: ["componentNamesInList"],
          variablesOptional: true,
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let componentNamesInList = [];

        for (let child of dependencyValues.mathAndMathListChildren) {
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "mathList"
          })) {
            componentNamesInList.push(...child.stateValues.componentNamesInList);
          } else {
            componentNamesInList.push(child.componentName);
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && componentNamesInList.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          componentNamesInList = componentNamesInList.slice(0, maxNum)
        }

        return { setValue: { componentNamesInList } }

      }
    }

    stateVariableDefinitions.nComponentsToDisplayByChild = {
      additionalStateVariablesDefined: ["nChildrenToRender"],
      returnDependencies: () => ({
        nComponents: {
          dependencyType: "stateVariable",
          variableName: "nComponents",
        },
        mathListChildren: {
          dependencyType: "child",
          childGroups: ["mathLists"],
          variableNames: ["nComponents"],
        },
        mathAndMathListChildren: {
          dependencyType: "child",
          childGroups: ["maths", "mathLists"],
          skipComponentNames: true,
        },
        parentNComponentsToDisplayByChild: {
          dependencyType: "parentStateVariable",
          parentComponentType: "mathList",
          variableName: "nComponentsToDisplayByChild"
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects, componentName }) {

        let nComponentsToDisplay = dependencyValues.nComponents;

        if (dependencyValues.parentNComponentsToDisplayByChild !== null) {
          // have a parent mathList, which could have limited
          // math of components to display
          nComponentsToDisplay = dependencyValues.parentNComponentsToDisplayByChild[componentName]
        }

        let nComponentsToDisplayByChild = {};

        let nComponentsSoFar = 0;
        let nChildrenToRender = 0;

        let nMathLists = 0;
        for (let child of dependencyValues.mathAndMathListChildren) {
          let nComponentsLeft = Math.max(0, nComponentsToDisplay - nComponentsSoFar);
          if (nComponentsLeft > 0) {
            nChildrenToRender++;
          }
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "mathList"
          })) {
            let mathListChild = dependencyValues.mathListChildren[nMathLists];
            nMathLists++;

            let nComponentsForMathListChild = Math.min(
              nComponentsLeft,
              mathListChild.stateValues.nComponents
            )

            nComponentsToDisplayByChild[mathListChild.componentName] = nComponentsForMathListChild;
            nComponentsSoFar += nComponentsForMathListChild;

          } else {
            nComponentsSoFar += 1;
          }
        }

        return {
          setValue: { nComponentsToDisplayByChild, nChildrenToRender },
        }
      },
      markStale: () => ({ updateRenderedChildren: true }),
    }

    return stateVariableDefinitions;
  }

  static adapters = [
    {
      stateVariable: "math",
      stateVariablesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"]
    },
    "text"
  ];

}