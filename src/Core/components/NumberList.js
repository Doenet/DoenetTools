import { roundForDisplay } from "../utils/math";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
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
  static stateVariableToBeShadowed = "numbers";
  static primaryStateVariableForDefinition = "numbersShadow";

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

    Object.assign(attributes, returnRoundingAttributes());

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

    stateVariableDefinitions.numComponents = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      additionalStateVariablesDefined: ["childIndexByArrayKey"],
      returnDependencies: () => ({
        maxNumber: {
          dependencyType: "stateVariable",
          variableName: "maxNumber",
        },
        numberListChildren: {
          dependencyType: "child",
          childGroups: ["numberLists"],
          variableNames: ["numComponents"],
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
        let numComponents = 0;
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
                i < numberListChild.stateValues.numComponents;
                i++
              ) {
                childIndexByArrayKey[numComponents + i] = [childInd, i];
              }
              numComponents += numberListChild.stateValues.numComponents;
            } else {
              childIndexByArrayKey[numComponents] = [childInd, 0];
              numComponents += 1;
            }
          }
        } else if (dependencyValues.numbersShadow !== null) {
          numComponents = dependencyValues.numbersShadow.length;
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

    stateVariableDefinitions.numbers = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      isArray: true,
      entryPrefixes: ["number"],
      stateVariablesDeterminingDependencies: ["childIndexByArrayKey"],
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
        dependencyValuesByKey,
        globalDependencyValues,
        dependencyNamesByKey,
        workspace,
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
          } else if (globalDependencyValues.numbersShadow !== null) {
            if (!workspace.desiredNumberShadow) {
              workspace.desiredNumberShadow = [
                ...globalDependencyValues.numbersShadow,
              ];
            }
            workspace.desiredNumberShadow[arrayKey] =
              desiredStateVariableValues.numbers[arrayKey];
            instructions.push({
              setDependency: "numbersShadow",
              desiredValue: workspace.desiredNumberShadow,
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.numValues = {
      isAlias: true,
      targetVariableName: "numComponents",
    };

    stateVariableDefinitions.values = {
      isAlias: true,
      targetVariableName: "numbers",
    };

    stateVariableDefinitions.math = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
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

    stateVariableDefinitions.maths = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      isArray: true,
      entryPrefixes: ["math"],
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
            number: {
              dependencyType: "stateVariable",
              variableName: `number${Number(arrayKey) + 1}`,
            },
          };
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let maths = {};

        for (let arrayKey of arrayKeys) {
          maths[arrayKey] = me.fromAst(dependencyValuesByKey[arrayKey].number);
        }

        return { setValue: { maths } };
      },
      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
      }) {
        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.maths) {
          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey].number,
            desiredValue:
              desiredStateVariableValues.maths[arrayKey].evaluate_to_constant(),
          });
        }

        return {
          success: true,
          instructions,
        };
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
        maxNumber: {
          dependencyType: "stateVariable",
          variableName: "maxNumber",
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
      definition: function ({ dependencyValues }) {
        let texts = [];
        let params = {};
        if (dependencyValues.padZeros) {
          if (Number.isFinite(dependencyValues.displayDecimals)) {
            params.padToDecimals = dependencyValues.displayDecimals;
          }
          if (dependencyValues.displayDigits >= 1) {
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
            }).toString(params),
          );
        }

        let maxNum = dependencyValues.maxNumber;
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
        maxNumber: {
          dependencyType: "stateVariable",
          variableName: "maxNumber",
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

        let maxNum = dependencyValues.maxNumber;
        if (maxNum !== null && componentNamesInList.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          componentNamesInList = componentNamesInList.slice(0, maxNum);
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
        numberListChildren: {
          dependencyType: "child",
          childGroups: ["numberLists"],
          variableNames: ["numComponents"],
        },
        numberAndNumberListChildren: {
          dependencyType: "child",
          childGroups: ["numbers", "numberLists"],
          skipComponentNames: true,
        },
        parentNComponentsToDisplayByChild: {
          dependencyType: "parentStateVariable",
          parentComponentType: "numberList",
          variableName: "numComponentsToDisplayByChild",
        },
      }),
      definition: function ({
        dependencyValues,
        componentInfoObjects,
        componentName,
      }) {
        let numComponentsToDisplay = dependencyValues.numComponents;

        if (dependencyValues.parentNComponentsToDisplayByChild !== null) {
          // have a parent numberList, which could have limited
          // number of components to display
          numComponentsToDisplay =
            dependencyValues.parentNComponentsToDisplayByChild[componentName];
        }

        let numComponentsToDisplayByChild = {};

        let numComponentsSoFar = 0;
        let numChildrenToRender = 0;

        let nNumberLists = 0;
        for (let child of dependencyValues.numberAndNumberListChildren) {
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
              baseComponentType: "numberList",
            })
          ) {
            let numberListChild =
              dependencyValues.numberListChildren[nNumberLists];
            nNumberLists++;

            let numComponentsForNumberListChild = Math.min(
              numComponentsLeft,
              numberListChild.stateValues.numComponents,
            );

            numComponentsToDisplayByChild[numberListChild.componentName] =
              numComponentsForNumberListChild;
            numComponentsSoFar += numComponentsForNumberListChild;
          } else {
            numComponentsSoFar += 1;
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
      stateVariable: "maths",
      componentType: "mathList",
      stateVariablesToShadow: Object.keys(
        returnRoundingStateVariableDefinitions(),
      ),
    },
    {
      stateVariable: "math",
      stateVariablesToShadow: Object.keys(
        returnRoundingStateVariableDefinitions(),
      ),
    },
    "text",
  ];
}
