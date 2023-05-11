import InlineComponent from "./abstract/InlineComponent";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "./commonsugar/lists";

export default class BooleanList extends InlineComponent {
  static componentType = "booleanList";
  static rendererType = "asList";
  static renderChildren = true;

  static includeBlankStringChildren = true;
  static removeBlankStringChildrenPostSugar = true;

  // when another component has a attribute that is a booleanList,
  // use the booleans state variable to populate that attribute
  static stateVariableForAttributeValue = "booleans";

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
    let groupIntoBooleansSeparatedBySpaces =
      returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
        componentType: "boolean",
      });

    sugarInstructions.push({
      replacementFunction: function ({ matchedChildren }) {
        return groupIntoBooleansSeparatedBySpaces({ matchedChildren });
      },
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "booleans",
        componentTypes: ["boolean"],
      },
      {
        group: "booleanLists",
        componentTypes: ["booleanList"],
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
          booleanListChildren: {
            dependencyType: "child",
            childGroups: ["booleanLists"],
            variableNames: ["numComponents"],
          },
          booleanAndBooleanListChildren: {
            dependencyType: "child",
            childGroups: ["booleans", "booleanLists"],
            skipComponentNames: true,
          },
        };
      },
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let numComponents = 0;
        let childIndexByArrayKey = [];

        let nBooleanLists = 0;
        for (let [
          childInd,
          child,
        ] of dependencyValues.booleanAndBooleanListChildren.entries()) {
          if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "booleanList",
            })
          ) {
            let booleanListChild =
              dependencyValues.booleanListChildren[nBooleanLists];
            nBooleanLists++;
            for (
              let i = 0;
              i < booleanListChild.stateValues.numComponents;
              i++
            ) {
              childIndexByArrayKey[numComponents + i] = [childInd, i];
            }
            numComponents += booleanListChild.stateValues.numComponents;
          } else {
            childIndexByArrayKey[numComponents] = [childInd, 0];
            numComponents += 1;
          }
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

    stateVariableDefinitions.booleans = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      isArray: true,
      entryPrefixes: ["boolean"],
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
        };

        for (let arrayKey of arrayKeys) {
          let childIndices = [];
          let booleanIndex = "1";
          if (stateValues.childIndexByArrayKey[arrayKey]) {
            childIndices = [stateValues.childIndexByArrayKey[arrayKey][0]];
            booleanIndex = stateValues.childIndexByArrayKey[arrayKey][1] + 1;
          }
          dependenciesByKey[arrayKey] = {
            booleanAndBooleanListChildren: {
              dependencyType: "child",
              childGroups: ["booleans", "booleanLists"],
              variableNames: ["value", "boolean" + booleanIndex],
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
        let booleans = {};

        for (let arrayKey of arrayKeys) {
          let child =
            dependencyValuesByKey[arrayKey].booleanAndBooleanListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              booleans[arrayKey] = child.stateValues.value;
            } else {
              let booleanIndex =
                globalDependencyValues.childIndexByArrayKey[arrayKey][1] + 1;
              booleans[arrayKey] = child.stateValues["boolean" + booleanIndex];
            }
          }
        }

        return { setValue: { booleans } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        arraySize,
      }) {
        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.booleans) {
          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }

          let child =
            dependencyValuesByKey[arrayKey].booleanAndBooleanListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              instructions.push({
                setDependency:
                  dependencyNamesByKey[arrayKey].booleanAndBooleanListChildren,
                desiredValue: desiredStateVariableValues.booleans[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });
            } else {
              instructions.push({
                setDependency:
                  dependencyNamesByKey[arrayKey].booleanAndBooleanListChildren,
                desiredValue: desiredStateVariableValues.booleans[arrayKey],
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
      targetVariableName: "booleans",
    };

    stateVariableDefinitions.componentNamesInList = {
      returnDependencies: () => ({
        booleanAndBooleanListChildren: {
          dependencyType: "child",
          childGroups: ["booleans", "booleanLists"],
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

        for (let child of dependencyValues.booleanAndBooleanListChildren) {
          if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "booleanList",
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
        booleanListChildren: {
          dependencyType: "child",
          childGroups: ["booleanLists"],
          variableNames: ["numComponents"],
        },
        booleanAndBooleanListChildren: {
          dependencyType: "child",
          childGroups: ["booleans", "booleanLists"],
          skipComponentNames: true,
        },
        parentNComponentsToDisplayByChild: {
          dependencyType: "parentStateVariable",
          parentComponentType: "booleanList",
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
          // have a parent booleanList, which could have limited
          // boolean of components to display
          numComponentsToDisplay =
            dependencyValues.parentNComponentsToDisplayByChild[componentName];
        }

        let numComponentsToDisplayByChild = {};

        let numComponentsSoFar = 0;
        let numChildrenToRender = 0;

        let nBooleanLists = 0;
        for (let child of dependencyValues.booleanAndBooleanListChildren) {
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
              baseComponentType: "booleanList",
            })
          ) {
            let booleanListChild =
              dependencyValues.booleanListChildren[nBooleanLists];
            nBooleanLists++;

            let numComponentsForBooleanListChild = Math.min(
              numComponentsLeft,
              booleanListChild.stateValues.numComponents,
            );

            numComponentsToDisplayByChild[booleanListChild.componentName] =
              numComponentsForBooleanListChild;
            numComponentsSoFar += numComponentsForBooleanListChild;
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
}
