import InlineComponent from "./abstract/InlineComponent";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "./commonsugar/lists";

export default class TextList extends InlineComponent {
  static componentType = "textList";
  static renderChildren = true;

  static includeBlankStringChildren = true;
  static removeBlankStringChildrenPostSugar = true;

  // when another component has a attribute that is a textList,
  // use the texts state variable to populate that attribute
  static stateVariableForAttributeValue = "texts";
  static primaryStateVariableForDefinition = "textsShadow";

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

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let groupIntoTextsSeparatedBySpaces =
      returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
        componentType: "text",
      });

    sugarInstructions.push({
      replacementFunction: function ({ matchedChildren }) {
        return groupIntoTextsSeparatedBySpaces({ matchedChildren });
      },
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "texts",
        componentTypes: ["text"],
      },
      {
        group: "textLists",
        componentTypes: ["textList"],
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

    stateVariableDefinitions.textsShadow = {
      defaultValue: null,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          textsShadow: true,
        },
      }),
    };

    stateVariableDefinitions.numComponents = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      additionalStateVariablesDefined: ["childIndexByArrayKey"],
      returnDependencies() {
        return {
          maxNumber: {
            dependencyType: "stateVariable",
            variableName: "maxNumber",
          },
          textListChildren: {
            dependencyType: "child",
            childGroups: ["textLists"],
            variableNames: ["numComponents"],
          },
          textAndTextListChildren: {
            dependencyType: "child",
            childGroups: ["texts", "textLists"],
            skipComponentNames: true,
          },
          textsShadow: {
            dependencyType: "stateVariable",
            variableName: "textsShadow",
          },
        };
      },
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let numComponents = 0;
        let childIndexByArrayKey = [];

        if (dependencyValues.textAndTextListChildren.length > 0) {
          let nTextLists = 0;
          for (let [
            childInd,
            child,
          ] of dependencyValues.textAndTextListChildren.entries()) {
            if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "textList",
              })
            ) {
              let textListChild = dependencyValues.textListChildren[nTextLists];
              nTextLists++;
              for (
                let i = 0;
                i < textListChild.stateValues.numComponents;
                i++
              ) {
                childIndexByArrayKey[numComponents + i] = [childInd, i];
              }
              numComponents += textListChild.stateValues.numComponents;
            } else {
              childIndexByArrayKey[numComponents] = [childInd, 0];
              numComponents += 1;
            }
          }
        } else if (dependencyValues.textsShadow !== null) {
          numComponents = dependencyValues.textsShadow.length;
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

    stateVariableDefinitions.texts = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      isArray: true,
      entryPrefixes: ["text"],
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
          textsShadow: {
            dependencyType: "stateVariable",
            variableName: "textsShadow",
          },
        };

        for (let arrayKey of arrayKeys) {
          let childIndices = [];
          let textIndex = "1";
          if (stateValues.childIndexByArrayKey[arrayKey]) {
            childIndices = [stateValues.childIndexByArrayKey[arrayKey][0]];
            textIndex = stateValues.childIndexByArrayKey[arrayKey][1] + 1;
          }
          dependenciesByKey[arrayKey] = {
            textAndTextListChildren: {
              dependencyType: "child",
              childGroups: ["texts", "textLists"],
              variableNames: ["value", "text" + textIndex],
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
        let texts = {};

        for (let arrayKey of arrayKeys) {
          let child =
            dependencyValuesByKey[arrayKey].textAndTextListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              texts[arrayKey] = child.stateValues.value;
            } else {
              let textIndex =
                globalDependencyValues.childIndexByArrayKey[arrayKey][1] + 1;
              texts[arrayKey] = child.stateValues["text" + textIndex];
            }
          } else if (globalDependencyValues.textsShadow !== null) {
            texts[arrayKey] = globalDependencyValues.textsShadow[arrayKey];
          }
        }

        return { setValue: { texts } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        arraySize,
      }) {
        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.texts) {
          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }

          let child =
            dependencyValuesByKey[arrayKey].textAndTextListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              instructions.push({
                setDependency:
                  dependencyNamesByKey[arrayKey].textAndTextListChildren,
                desiredValue: desiredStateVariableValues.texts[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });
            } else {
              instructions.push({
                setDependency:
                  dependencyNamesByKey[arrayKey].textAndTextListChildren,
                desiredValue: desiredStateVariableValues.texts[arrayKey],
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

    stateVariableDefinitions.numValues = {
      isAlias: true,
      targetVariableName: "numComponents",
    };

    stateVariableDefinitions.values = {
      isAlias: true,
      targetVariableName: "texts",
    };

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      returnDependencies: () => ({
        texts: {
          dependencyType: "stateVariable",
          variableName: "texts",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { text: dependencyValues.texts.join(", ") },
      }),
    };

    stateVariableDefinitions.componentNamesInList = {
      returnDependencies: () => ({
        textAndTextListChildren: {
          dependencyType: "child",
          childGroups: ["texts", "textLists"],
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

        for (let child of dependencyValues.textAndTextListChildren) {
          if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "textList",
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
        textListChildren: {
          dependencyType: "child",
          childGroups: ["textLists"],
          variableNames: ["numComponents"],
        },
        textAndTextListChildren: {
          dependencyType: "child",
          childGroups: ["texts", "textLists"],
          skipComponentNames: true,
        },
        parentNComponentsToDisplayByChild: {
          dependencyType: "parentStateVariable",
          parentComponentType: "textList",
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
          // have a parent textList, which could have limited
          // text of components to display
          numComponentsToDisplay =
            dependencyValues.parentNComponentsToDisplayByChild[componentName];
        }

        let numComponentsToDisplayByChild = {};

        let numComponentsSoFar = 0;
        let numChildrenToRender = 0;

        let nTextLists = 0;
        for (let child of dependencyValues.textAndTextListChildren) {
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
              baseComponentType: "textList",
            })
          ) {
            let textListChild = dependencyValues.textListChildren[nTextLists];
            nTextLists++;

            let numComponentsForTextListChild = Math.min(
              numComponentsLeft,
              textListChild.stateValues.numComponents,
            );

            numComponentsToDisplayByChild[textListChild.componentName] =
              numComponentsForTextListChild;
            numComponentsSoFar += numComponentsForTextListChild;
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

  static adapters = ["text"];
}
