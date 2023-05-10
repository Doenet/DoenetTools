import { roundForDisplay } from "../utils/math";
import InlineComponent from "./abstract/InlineComponent";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "./commonsugar/lists";
import me from "math-expressions";

export default class NumberList extends InlineComponent {
  static componentType = "numberList";
  static renderChildren = true;

  static includeBlankStringChildren = true;
  static removeBlankStringChildrenPostSugar = true;

  // when another component has an attribute that is a numberList,
  // use the numbers state variable to populate that attribute
  static stateVariableForAttributeValue = "numbers";
  static primaryStateVariableForDefinition = "numbersShadow";

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
      valueForTrue: 1e-14,
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

    let groupIntoNumbersSeparatedBySpaces =
      returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
        componentType: "number",
      });

    sugarInstructions.push({
      replacementFunction: function ({ matchedChildren }) {
        return groupIntoNumbersSeparatedBySpaces({ matchedChildren });
      },
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "numbers",
        componentTypes: ["number"],
      },
      {
        group: "numberLists",
        componentTypes: ["numberList"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // set overrideChildHide so that children are hidden
    // only based on whether or not the list is hidden
    // so that can't have a list with partially hidden components
    stateVariableDefinitions.overrideChildHide = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { overrideChildHide: true } }),
    };

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
          variableNames: ["value"],
        },
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"],
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.displayDigitsAttr !== null) {
          let displayDigitsAttrUsedDefault = usedDefault.displayDigitsAttr;
          let displayDecimalsAttrUsedDefault =
            dependencyValues.displayDecimalsAttr === null ||
            usedDefault.displayDecimalsAttr;

          if (
            !(displayDigitsAttrUsedDefault || displayDecimalsAttrUsedDefault)
          ) {
            // if both display digits and display decimals did not use default
            // we'll regard display digits as using default if it comes from a deeper shadow
            let shadowDepthDisplayDigits =
              dependencyValues.displayDigitsAttr.shadowDepth;
            let shadowDepthDisplayDecimals =
              dependencyValues.displayDecimalsAttr.shadowDepth;

            if (shadowDepthDisplayDecimals < shadowDepthDisplayDigits) {
              displayDigitsAttrUsedDefault = true;
            }
          }

          if (displayDigitsAttrUsedDefault) {
            return {
              useEssentialOrDefaultValue: {
                displayDigits: {
                  defaultValue:
                    dependencyValues.displayDigitsAttr.stateValues.value,
                },
              },
            };
          } else {
            return {
              setValue: {
                displayDigits:
                  dependencyValues.displayDigitsAttr.stateValues.value,
              },
            };
          }
        }

        return { useEssentialOrDefaultValue: { displayDigits: true } };
      },
    };

    stateVariableDefinitions.numbersShadow = {
      defaultValue: null,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          numbersShadow: true,
        },
      }),
    };

    stateVariableDefinitions.nComponents = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      additionalStateVariablesDefined: ["childIndexByArrayKey"],
      returnDependencies: () => ({
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
        numberListChildren: {
          dependencyType: "child",
          childGroups: ["numberLists"],
          variableNames: ["nComponents"],
        },
        numberAndNumberListChildren: {
          dependencyType: "child",
          childGroups: ["numbers", "numberLists"],
          skipComponentNames: true,
        },
        numbersShadow: {
          dependencyType: "stateVariable",
          variableName: "numbersShadow",
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let nComponents = 0;
        let childIndexByArrayKey = [];

        let nNumberLists = 0;
        if (dependencyValues.numberAndNumberListChildren.length > 0) {
          for (let [
            childInd,
            child,
          ] of dependencyValues.numberAndNumberListChildren.entries()) {
            if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "numberList",
              })
            ) {
              let numberListChild =
                dependencyValues.numberListChildren[nNumberLists];
              nNumberLists++;
              for (
                let i = 0;
                i < numberListChild.stateValues.nComponents;
                i++
              ) {
                childIndexByArrayKey[nComponents + i] = [childInd, i];
              }
              nComponents += numberListChild.stateValues.nComponents;
            } else {
              childIndexByArrayKey[nComponents] = [childInd, 0];
              nComponents += 1;
            }
          }
        } else if (dependencyValues.numbersShadow !== null) {
          nComponents = dependencyValues.numbersShadow.length;
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && nComponents > maxNum) {
          nComponents = maxNum;
          childIndexByArrayKey = childIndexByArrayKey.slice(0, maxNum);
        }

        return {
          setValue: { nComponents, childIndexByArrayKey },
          checkForActualChange: { nComponents: true },
        };
      },
    };

    stateVariableDefinitions.numbers = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: [
          "displayDigits",
          "displayDecimals",
          "displaySmallAsZero",
          "padZeros",
        ],
      },
      isArray: true,
      entryPrefixes: ["number"],
      stateVariablesDeterminingDependencies: ["childIndexByArrayKey"],
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
        let dependenciesByKey = {};
        let globalDependencies = {
          childIndexByArrayKey: {
            dependencyType: "stateVariable",
            variableName: "childIndexByArrayKey",
          },
          numbersShadow: {
            dependencyType: "stateVariable",
            variableName: "numbersShadow",
          },
        };

        for (let arrayKey of arrayKeys) {
          let childIndices = [];
          let numberIndex = "1";
          if (stateValues.childIndexByArrayKey[arrayKey]) {
            childIndices = [stateValues.childIndexByArrayKey[arrayKey][0]];
            numberIndex = stateValues.childIndexByArrayKey[arrayKey][1] + 1;
          }
          dependenciesByKey[arrayKey] = {
            numberAndNumberListChildren: {
              dependencyType: "child",
              childGroups: ["numbers", "numberLists"],
              variableNames: ["value", "number" + numberIndex],
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
        let numbers = {};

        for (let arrayKey of arrayKeys) {
          let child =
            dependencyValuesByKey[arrayKey].numberAndNumberListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              numbers[arrayKey] = child.stateValues.value;
            } else {
              let numberIndex =
                globalDependencyValues.childIndexByArrayKey[arrayKey][1] + 1;
              numbers[arrayKey] = child.stateValues["number" + numberIndex];
            }
          } else if (globalDependencyValues.numbersShadow !== null) {
            numbers[arrayKey] = globalDependencyValues.numbersShadow[arrayKey];
          }
        }

        return { setValue: { numbers } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        arraySize,
      }) {
        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.numbers) {
          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }

          let child =
            dependencyValuesByKey[arrayKey].numberAndNumberListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              instructions.push({
                setDependency:
                  dependencyNamesByKey[arrayKey].numberAndNumberListChildren,
                desiredValue: desiredStateVariableValues.numbers[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });
            } else {
              instructions.push({
                setDependency:
                  dependencyNamesByKey[arrayKey].numberAndNumberListChildren,
                desiredValue: desiredStateVariableValues.numbers[arrayKey],
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
      },
    };

    stateVariableDefinitions.nValues = {
      isAlias: true,
      targetVariableName: "nComponents",
    };

    stateVariableDefinitions.values = {
      isAlias: true,
      targetVariableName: "numbers",
    };

    stateVariableDefinitions.math = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        attributesToShadow: [
          "displayDigits",
          "displayDecimals",
          "displaySmallAsZero",
          "padZeros",
        ],
      },
      returnDependencies: () => ({
        numbers: {
          dependencyType: "stateVariable",
          variableName: "numbers",
        },
      }),
      definition({ dependencyValues }) {
        let math;
        if (dependencyValues.numbers.length === 0) {
          math = me.fromAst("\uff3f");
        } else if (dependencyValues.numbers.length === 1) {
          math = me.fromAst(dependencyValues.numbers[0]);
        } else {
          math = me.fromAst(["list", ...dependencyValues.numbers]);
        }

        return { setValue: { math } };
      },
    };

    stateVariableDefinitions.text = {
      public: true,
      forRenderer: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      additionalStateVariablesDefined: ["texts"],
      returnDependencies: () => ({
        numberAndNumberListChildren: {
          dependencyType: "child",
          childGroups: ["numbers", "numberLists"],
          variableNames: ["valueForDisplay", "text", "texts"],
          variablesOptional: true,
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
        numbersShadow: {
          dependencyType: "stateVariable",
          variableName: "numbersShadow",
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
      definition: function ({ dependencyValues, usedDefault }) {
        let texts = [];
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
        if (dependencyValues.numberAndNumberListChildren.length > 0) {
          for (let child of dependencyValues.numberAndNumberListChildren) {
            if (child.stateValues.valueForDisplay !== undefined) {
              texts.push(child.stateValues.text);
            } else {
              texts.push(...child.stateValues.texts);
            }
          }
        } else if (dependencyValues.numbersShadow !== null) {
          texts = dependencyValues.numbersShadow.map((x) =>
            roundForDisplay({
              value: me.fromAst(x),
              dependencyValues,
              usedDefault,
            }).toString(params),
          );
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && texts.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          texts = texts.slice(0, maxNum);
        }

        let text = texts.join(", ");

        return { setValue: { text, texts } };
      },
    };

    stateVariableDefinitions.componentNamesInList = {
      returnDependencies: () => ({
        numberAndNumberListChildren: {
          dependencyType: "child",
          childGroups: ["numbers", "numberLists"],
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

        for (let child of dependencyValues.numberAndNumberListChildren) {
          if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "numberList",
            })
          ) {
            componentNamesInList.push(
              ...child.stateValues.componentNamesInList,
            );
          } else {
            componentNamesInList.push(child.componentName);
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && componentNamesInList.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          componentNamesInList = componentNamesInList.slice(0, maxNum);
        }

        return { setValue: { componentNamesInList } };
      },
    };

    stateVariableDefinitions.nComponentsToDisplayByChild = {
      additionalStateVariablesDefined: ["nChildrenToRender"],
      returnDependencies: () => ({
        nComponents: {
          dependencyType: "stateVariable",
          variableName: "nComponents",
        },
        numberListChildren: {
          dependencyType: "child",
          childGroups: ["numberLists"],
          variableNames: ["nComponents"],
        },
        numberAndNumberListChildren: {
          dependencyType: "child",
          childGroups: ["numbers", "numberLists"],
          skipComponentNames: true,
        },
        parentNComponentsToDisplayByChild: {
          dependencyType: "parentStateVariable",
          parentComponentType: "numberList",
          variableName: "nComponentsToDisplayByChild",
        },
      }),
      definition: function ({
        dependencyValues,
        componentInfoObjects,
        componentName,
      }) {
        let nComponentsToDisplay = dependencyValues.nComponents;

        if (dependencyValues.parentNComponentsToDisplayByChild !== null) {
          // have a parent numberList, which could have limited
          // number of components to display
          nComponentsToDisplay =
            dependencyValues.parentNComponentsToDisplayByChild[componentName];
        }

        let nComponentsToDisplayByChild = {};

        let nComponentsSoFar = 0;
        let nChildrenToRender = 0;

        let nNumberLists = 0;
        for (let child of dependencyValues.numberAndNumberListChildren) {
          let nComponentsLeft = Math.max(
            0,
            nComponentsToDisplay - nComponentsSoFar,
          );
          if (nComponentsLeft > 0) {
            nChildrenToRender++;
          }
          if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "numberList",
            })
          ) {
            let numberListChild =
              dependencyValues.numberListChildren[nNumberLists];
            nNumberLists++;

            let nComponentsForNumberListChild = Math.min(
              nComponentsLeft,
              numberListChild.stateValues.nComponents,
            );

            nComponentsToDisplayByChild[numberListChild.componentName] =
              nComponentsForNumberListChild;
            nComponentsSoFar += nComponentsForNumberListChild;
          } else {
            nComponentsSoFar += 1;
          }
        }

        return {
          setValue: { nComponentsToDisplayByChild, nChildrenToRender },
        };
      },
      markStale: () => ({ updateRenderedChildren: true }),
    };

    return stateVariableDefinitions;
  }

  static adapters = [
    {
      stateVariable: "math",
      stateVariablesToShadow: [
        "displayDigits",
        "displayDecimals",
        "displaySmallAsZero",
        "padZeros",
      ],
    },
    "text",
  ];
}
