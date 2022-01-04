import InlineComponent from './abstract/InlineComponent';
import { returnBreakStringsIntoComponentTypeBySpaces, returnGroupIntoComponentTypeSeparatedBySpaces } from './commonsugar/lists';

export default class NumberList extends InlineComponent {
  static componentType = "numberList";
  static rendererType = "asList";
  static renderChildren = true;

  static includeBlankStringChildren = true;
  static removeBlankStringChildrenPostSugar = true;

  static stateVariableForAttributeValue = "numbers";

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
      defaultValue: null,
      public: true,
    };

    return attributes;
  }


  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let groupIntoNumbersSeparatedBySpaces = returnGroupIntoComponentTypeSeparatedBySpaces({
      componentType: "number"
    });
    let breakStringsIntoNumbersBySpaces = returnBreakStringsIntoComponentTypeBySpaces({
      componentType: "number"
    });

    sugarInstructions.push({
      replacementFunction: function ({
        matchedChildren, isAttributeComponent = false, createdFromMacro = false,
      }) {
        if (isAttributeComponent && !createdFromMacro) {
          return groupIntoNumbersSeparatedBySpaces({ matchedChildren });
        } else {
          return breakStringsIntoNumbersBySpaces({ matchedChildren })
        }
      }
    });

    return sugarInstructions;

  }

  static returnChildGroups() {

    return [{
      group: "numbers",
      componentTypes: ["number"]
    }, {
      group: "numberLists",
      componentTypes: ["numberList"]
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
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {

        let nComponents = 0;
        let childIndexByArrayKey = [];

        let nNumberLists = 0;
        for (let [childInd, child] of dependencyValues.numberAndNumberListChildren.entries()) {
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "numberList"
          })) {
            let numberListChild = dependencyValues.numberListChildren[nNumberLists];
            nNumberLists++;
            for (let i = 0; i < numberListChild.stateValues.nComponents; i++) {
              childIndexByArrayKey[nComponents + i] = [childInd, i];
            }
            nComponents += numberListChild.stateValues.nComponents;

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


    stateVariableDefinitions.numbers = {
      public: true,
      componentType: "number",
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
        let dependenciesByKey = {}
        let globalDependencies = {
          childIndexByArrayKey: {
            dependencyType: "stateVariable",
            variableName: "childIndexByArrayKey"
          }
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
          }
        }
        return { globalDependencies, dependenciesByKey }

      },
      arrayDefinitionByKey({
        globalDependencyValues, dependencyValuesByKey, arrayKeys,
      }) {

        let numbers = {};

        for (let arrayKey of arrayKeys) {
          let child = dependencyValuesByKey[arrayKey].numberAndNumberListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              numbers[arrayKey] = child.stateValues.value;
            } else {
              let numberIndex = globalDependencyValues.childIndexByArrayKey[arrayKey][1] + 1;
              numbers[arrayKey] = child.stateValues["number" + numberIndex];

            }

          }

        }

        return { newValues: { numbers } }

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues, globalDependencyValues,
        dependencyValuesByKey, dependencyNamesByKey, arraySize
      }) {

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.numbers) {

          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }

          let child = dependencyValuesByKey[arrayKey].numberAndNumberListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].numberAndNumberListChildren,
                desiredValue: desiredStateVariableValues.numbers[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });

            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].numberAndNumberListChildren,
                desiredValue: desiredStateVariableValues.numbers[arrayKey],
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
      targetVariableName: "numbers"
    };

    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
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
      }),
      definition: function ({ dependencyValues }) {

        let texts = [];

        for (let child of dependencyValues.numberAndNumberListChildren) {

          if (child.stateValues.valueForDisplay !== undefined) {
            texts.push(child.stateValues.text);
          } else {
            texts.push(...child.stateValues.texts);
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && texts.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          texts = texts.slice(0, maxNum)
        }

        let text = texts.join(', ');

        return { newValues: { text, texts } }

      }
    }


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
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "numberList"
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
          variableName: "nComponentsToDisplayByChild"
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects, componentName }) {

        let nComponentsToDisplay = dependencyValues.nComponents;

        if(dependencyValues.parentNComponentsToDisplayByChild !== null) {
          // have a parent numberList, which could have limited
          // number of components to display
          nComponentsToDisplay = dependencyValues.parentNComponentsToDisplayByChild[componentName]
        }

        let nComponentsToDisplayByChild = {};

        let nComponentsSoFar = 0;
        let nChildrenToRender = 0;

        let nNumberLists = 0;
        for (let child of dependencyValues.numberAndNumberListChildren) {
          let nComponentsLeft = Math.max(0, nComponentsToDisplay - nComponentsSoFar);
          if(nComponentsLeft > 0) {
            nChildrenToRender++;
          }
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "numberList"
          })) {
            let numberListChild = dependencyValues.numberListChildren[nNumberLists];
            nNumberLists++;

            let nComponentsForNumberListChild = Math.min(
              nComponentsLeft,
              numberListChild.stateValues.nComponents
            )

            nComponentsToDisplayByChild[numberListChild.componentName] = nComponentsForNumberListChild;
            nComponentsSoFar += nComponentsForNumberListChild;

          } else {
            nComponentsSoFar += 1;
          }
        }

        return {
          newValues: { nComponentsToDisplayByChild, nChildrenToRender },
        }
      }
    }

    return stateVariableDefinitions;
  }

}