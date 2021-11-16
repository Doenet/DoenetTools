import InlineComponent from './abstract/InlineComponent';
import { returnBreakStringsIntoComponentTypeBySpaces, returnGroupIntoComponentTypeSeparatedBySpaces } from './commonsugar/lists';

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

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.unordered = {
      createComponentOfType: "boolean",
      createStateVariable: "unordered",
      defaultValue: false,
      public: true,
    };
    attributes.maximumNumber = {
      createComponentOfType: "number",
      createStateVariable: "maximumNumber",
      defaultValue: undefined,
      public: true,
    };
    return attributes;
  }


  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();
    let groupIntoBooleansSeparatedBySpaces = returnGroupIntoComponentTypeSeparatedBySpaces({
      componentType: "boolean"
    });
    let breakStringsIntoBooleansBySpaces = returnBreakStringsIntoComponentTypeBySpaces({
      componentType: "boolean"
    });

    sugarInstructions.push({
      replacementFunction: function ({
        matchedChildren, isAttributeComponent = false, createdFromMacro = false,
      }) {
        if (isAttributeComponent && !createdFromMacro) {
          return groupIntoBooleansSeparatedBySpaces({ matchedChildren });
        } else {
          return breakStringsIntoBooleansBySpaces({ matchedChildren })
        }
      }
    });

    return sugarInstructions;

  }


  static returnChildGroups() {

    return [{
      group: "booleans",
      componentTypes: ["boolean"]
    }, {
      group: "booleanLists",
      componentTypes: ["booleanList"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // set overrideChildHide so that children are hidden
    // only based on whether or not the list is hidden
    // so that can't have a list with partially hidden components
    stateVariableDefinitions.overrideChildHide = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { overrideChildHide: true } })
    }


    stateVariableDefinitions.nComponents = {
      public: true,
      componentType: "number",
      additionalStateVariablesDefined: ["childIndexByArrayKey"],
      returnDependencies() {
        return {
          maximumNumber: {
            dependencyType: "stateVariable",
            variableName: "maximumNumber",
          },
          booleanListChildren: {
            dependencyType: "child",
            childGroups: ["booleanLists"],
            variableNames: ["nComponents"],
          },
          booleanAndBooleanListChildren: {
            dependencyType: "child",
            childGroups: ["booleans", "booleanLists"],
            skipComponentNames: true,
          },
        }
      },
      definition: function ({ dependencyValues, componentInfoObjects }) {

        let nComponents = 0;
        let childIndexByArrayKey = [];

        let nBooleanLists = 0;
        for (let [childInd, child] of dependencyValues.booleanAndBooleanListChildren.entries()) {
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "booleanList"
          })) {
            let booleanListChild = dependencyValues.booleanListChildren[nBooleanLists];
            nBooleanLists++;
            for (let i = 0; i < booleanListChild.stateValues.nComponents; i++) {
              childIndexByArrayKey[nComponents + i] = [childInd, i];
            }
            nComponents += booleanListChild.stateValues.nComponents;

          } else {
            childIndexByArrayKey[nComponents] = [childInd, 0];
            nComponents += 1;
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && nComponents > maxNum) {
          nComponents = maxNum;
          childIndexByArrayKey = childIndexByArrayKey.slice(0, maxNum);
        }

        return {
          newValues: { nComponents, childIndexByArrayKey },
          checkForActualChange: { nComponents: true }
        }
      }
    }

    stateVariableDefinitions.booleans = {
      public: true,
      componentType: "boolean",
      isArray: true,
      entryPrefixes: ["boolean"],
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
        let dependenciesByKey = {}
        let globalDependencies = {
          childIndexByArrayKey: {
            dependencyType: "stateVariable",
            variableName: "childIndexByArrayKey"
          }
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
          }
        }

        return { globalDependencies, dependenciesByKey }

      },
      arrayDefinitionByKey({
        globalDependencyValues, dependencyValuesByKey, arrayKeys,
      }) {

        let booleans = {};

        for (let arrayKey of arrayKeys) {
          let child = dependencyValuesByKey[arrayKey].booleanAndBooleanListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              booleans[arrayKey] = child.stateValues.value;
            } else {
              let booleanIndex = globalDependencyValues.childIndexByArrayKey[arrayKey][1] + 1;
              booleans[arrayKey] = child.stateValues["boolean" + booleanIndex];
            }

          }

        }

        return { newValues: { booleans } }

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues, globalDependencyValues,
        dependencyValuesByKey, dependencyNamesByKey, arraySize
      }) {

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.booleans) {

          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }

          let child = dependencyValuesByKey[arrayKey].booleanAndBooleanListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].booleanAndBooleanListChildren,
                desiredValue: desiredStateVariableValues.booleans[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });

            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].booleanAndBooleanListChildren,
                desiredValue: desiredStateVariableValues.booleans[arrayKey],
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

    stateVariableDefinitions.nValues = {
      isAlias: true,
      targetVariableName: "nComponents"
    };

    stateVariableDefinitions.values = {
      isAlias: true,
      targetVariableName: "booleans"
    };

    stateVariableDefinitions.componentNamesInList = {
      returnDependencies: () => ({
        booleanAndBooleanListChildren: {
          dependencyType: "child",
          childGroups: ["booleans", "booleanLists"],
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

        for (let child of dependencyValues.booleanAndBooleanListChildren) {
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "booleanList"
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

        return { newValues: { componentNamesInList } }

      }
    }


    stateVariableDefinitions.nComponentsToDisplayByChild = {
      additionalStateVariablesDefined: [{
        variableName: "nChildrenToDisplay",
        forRenderer: true,
      }],
      returnDependencies: () => ({
        nComponents: {
          dependencyType: "stateVariable",
          variableName: "nComponents",
        },
        booleanListChildren: {
          dependencyType: "child",
          childGroups: ["booleanLists"],
          variableNames: ["nComponents"],
        },
        booleanAndBooleanListChildren: {
          dependencyType: "child",
          childGroups: ["booleans", "booleanLists"],
          skipComponentNames: true,
        },
        parentNComponentsToDisplayByChild: {
          dependencyType: "parentStateVariable",
          parentComponentType: "booleanList",
          variableName: "nComponentsToDisplayByChild"
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects, componentName }) {

        let nComponentsToDisplay = dependencyValues.nComponents;

        if (dependencyValues.parentNComponentsToDisplayByChild !== null) {
          // have a parent booleanList, which could have limited
          // boolean of components to display
          nComponentsToDisplay = dependencyValues.parentNComponentsToDisplayByChild[componentName]
        }

        let nComponentsToDisplayByChild = {};

        let nComponentsSoFar = 0;
        let nChildrenToDisplay = 0;

        let nBooleanLists = 0;
        for (let child of dependencyValues.booleanAndBooleanListChildren) {
          let nComponentsLeft = Math.max(0, nComponentsToDisplay - nComponentsSoFar);
          if (nComponentsLeft > 0) {
            nChildrenToDisplay++;
          }
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "booleanList"
          })) {
            let booleanListChild = dependencyValues.booleanListChildren[nBooleanLists];
            nBooleanLists++;

            let nComponentsForBooleanListChild = Math.min(
              nComponentsLeft,
              booleanListChild.stateValues.nComponents
            )

            nComponentsToDisplayByChild[booleanListChild.componentName] = nComponentsForBooleanListChild;
            nComponentsSoFar += nComponentsForBooleanListChild;

          } else {
            nComponentsSoFar += 1;
          }
        }

        return {
          newValues: { nComponentsToDisplayByChild, nChildrenToDisplay },
        }
      }
    }

    return stateVariableDefinitions;
  }

}