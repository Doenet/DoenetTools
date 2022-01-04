import InlineComponent from './abstract/InlineComponent';
import { returnBreakStringsIntoComponentTypeBySpaces, returnGroupIntoComponentTypeSeparatedBySpaces } from './commonsugar/lists';

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

    let groupIntoTextsSeparatedBySpaces = returnGroupIntoComponentTypeSeparatedBySpaces({
      componentType: "text"
    });
    let breakStringsIntoTextsBySpaces = returnBreakStringsIntoComponentTypeBySpaces({
      componentType: "text"
    });

    sugarInstructions.push({
      replacementFunction: function ({
        matchedChildren, isAttributeComponent = false, createdFromMacro = false,
      }) {
        if (isAttributeComponent && !createdFromMacro) {
          return groupIntoTextsSeparatedBySpaces({ matchedChildren });
        } else {
          return breakStringsIntoTextsBySpaces({ matchedChildren })
        }
      }
    });

    return sugarInstructions;

  }


  static returnChildGroups() {

    return [{
      group: "texts",
      componentTypes: ["text"]
    }, {
      group: "textLists",
      componentTypes: ["textList"]
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

    stateVariableDefinitions.textsShadow = {
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          textsShadow: { variablesToCheck: ["textsShadow"] }
        }
      }),
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
          textListChildren: {
            dependencyType: "child",
            childGroups: ["textLists"],
            variableNames: ["nComponents"],
          },
          textAndTextListChildren: {
            dependencyType: "child",
            childGroups: ["texts", "textLists"],
            skipComponentNames: true,
          },
          textsShadow: {
            dependencyType: "stateVariable",
            variableName: "textsShadow",
          }
        }
      },
      definition: function ({ dependencyValues, componentInfoObjects }) {

        let nComponents = 0;
        let childIndexByArrayKey = [];

        if (dependencyValues.textAndTextListChildren.length > 0) {
          let nTextLists = 0;
          for (let [childInd, child] of dependencyValues.textAndTextListChildren.entries()) {
            if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "textList"
            })) {
              let textListChild = dependencyValues.textListChildren[nTextLists];
              nTextLists++;
              for (let i = 0; i < textListChild.stateValues.nComponents; i++) {
                childIndexByArrayKey[nComponents + i] = [childInd, i];
              }
              nComponents += textListChild.stateValues.nComponents;

            } else {
              childIndexByArrayKey[nComponents] = [childInd, 0];
              nComponents += 1;
            }
          }
        } else if (dependencyValues.textsShadow !== null) {
          nComponents = dependencyValues.textsShadow.length;
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

    stateVariableDefinitions.texts = {
      public: true,
      componentType: "text",
      isArray: true,
      entryPrefixes: ["text"],
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
          },
          textsShadow: {
            dependencyType: "stateVariable",
            variableName: "textsShadow",
          }
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
          }
        }

        return { globalDependencies, dependenciesByKey }

      },
      arrayDefinitionByKey({
        globalDependencyValues, dependencyValuesByKey, arrayKeys,
      }) {

        let texts = {};

        for (let arrayKey of arrayKeys) {
          let child = dependencyValuesByKey[arrayKey].textAndTextListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              texts[arrayKey] = child.stateValues.value;
            } else {
              let textIndex = globalDependencyValues.childIndexByArrayKey[arrayKey][1] + 1;
              texts[arrayKey] = child.stateValues["text" + textIndex];
            }

          } else if (globalDependencyValues.textsShadow !== null) {
            texts[arrayKey] = globalDependencyValues.textsShadow[arrayKey];
          }

        }

        return { newValues: { texts } }

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues, globalDependencyValues,
        dependencyValuesByKey, dependencyNamesByKey, arraySize
      }) {

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.texts) {

          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }

          let child = dependencyValuesByKey[arrayKey].textAndTextListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].textAndTextListChildren,
                desiredValue: desiredStateVariableValues.texts[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });

            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].textAndTextListChildren,
                desiredValue: desiredStateVariableValues.texts[arrayKey],
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
      targetVariableName: "texts"
    };

    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      forRenderer: true,
      returnDependencies: () => ({
        texts: {
          dependencyType: "stateVariable",
          variableName: "texts"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { text: dependencyValues.texts.join(", ") }
      })
    }


    stateVariableDefinitions.componentNamesInList = {
      returnDependencies: () => ({
        textAndTextListChildren: {
          dependencyType: "child",
          childGroups: ["texts", "textLists"],
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

        for (let child of dependencyValues.textAndTextListChildren) {
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "textList"
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
        textListChildren: {
          dependencyType: "child",
          childGroups: ["textLists"],
          variableNames: ["nComponents"],
        },
        textAndTextListChildren: {
          dependencyType: "child",
          childGroups: ["texts", "textLists"],
          skipComponentNames: true,
        },
        parentNComponentsToDisplayByChild: {
          dependencyType: "parentStateVariable",
          parentComponentType: "textList",
          variableName: "nComponentsToDisplayByChild"
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects, componentName }) {

        let nComponentsToDisplay = dependencyValues.nComponents;

        if (dependencyValues.parentNComponentsToDisplayByChild !== null) {
          // have a parent textList, which could have limited
          // text of components to display
          nComponentsToDisplay = dependencyValues.parentNComponentsToDisplayByChild[componentName]
        }

        let nComponentsToDisplayByChild = {};

        let nComponentsSoFar = 0;
        let nChildrenToRender = 0;

        let nTextLists = 0;
        for (let child of dependencyValues.textAndTextListChildren) {
          let nComponentsLeft = Math.max(0, nComponentsToDisplay - nComponentsSoFar);
          if (nComponentsLeft > 0) {
            nChildrenToRender++;
          }
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "textList"
          })) {
            let textListChild = dependencyValues.textListChildren[nTextLists];
            nTextLists++;

            let nComponentsForTextListChild = Math.min(
              nComponentsLeft,
              textListChild.stateValues.nComponents
            )

            nComponentsToDisplayByChild[textListChild.componentName] = nComponentsForTextListChild;
            nComponentsSoFar += nComponentsForTextListChild;

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