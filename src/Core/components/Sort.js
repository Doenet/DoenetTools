import CompositeComponent from './abstract/CompositeComponent';
import { postProcessCopy } from '../utils/copy';
import me from 'math-expressions';
import { processAssignNames } from '../utils/serializedStateProcessing';

export default class Sort extends CompositeComponent {
  static componentType = "sort";

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";
  static assignNamesToReplacements = true;

  static returnChildGroups() {

    return [{
      group: "mathNumbers",
      componentTypes: ["number", "math", "numberList", "mathList", "point"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.componentNamesForValues = {
      returnDependencies: () => ({
        children: {
          dependencyType: "child",
          childGroups: ["mathNumbers"],
          variableNames: ["componentNamesInList"],
          variablesOptional: true
        }
      }),
      definition({ dependencyValues }) {
        let componentNamesForValues = [];
        for (let child of dependencyValues.children) {
          if (child.stateValues.componentNamesInList) {
            componentNamesForValues.push(...child.stateValues.componentNamesInList)
          } else {
            componentNamesForValues.push(child.componentName);
          }
        }

        return { newValues: { componentNamesForValues } }
      }
    }


    stateVariableDefinitions.sortedValues = {
      stateVariablesDeterminingDependencies: ["componentNamesForValues"],
      returnDependencies({ stateValues }) {
        let dependencies = {};
        for (let [ind, cName] of stateValues.componentNamesForValues.entries()) {
          dependencies[`component${ind}`] = {
            dependencyType: "multipleStateVariables",
            componentName: cName,
            variableNames: ["value", "xs"],
            variablesOptional: true,
          }
        }
        return dependencies;
      },
      definition({ dependencyValues, componentInfoObjects }) {
        let allValues = [];
        for (let depName in dependencyValues) {
          if (depName.substring(0, 9) !== "component") {
            continue;
          }
          let component = dependencyValues[depName];
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: component.componentType,
            baseComponentType: "number"
          })) {
            allValues.push({
              componentName: component.componentName,
              numericalValue: component.stateValues.value,
            })
          } else if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: component.componentType,
            baseComponentType: "math"
          })) {
            let numericalValue = component.stateValues.value.evaluate_to_constant();
            if (numericalValue === null) {
              numericalValue = NaN;
            }
            allValues.push({
              componentName: component.componentName,
              numericalValue,
            })
          } else if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: component.componentType,
            baseComponentType: "point"
          })) {
            let numericalValue;
            if (component.stateValues.xs.length > 0) {
              numericalValue = component.stateValues.xs[0].evaluate_to_constant();
              if (numericalValue === null) {
                numericalValue = NaN;
              }
            } else {
              numericalValue = NaN;
            }
            allValues.push({
              componentName: component.componentName,
              numericalValue,
            })
          }
        }

        allValues.sort((a, b) => a.numericalValue - b.numericalValue)

        return {
          newValues: {
            sortedValues: allValues
          }
        }
      }
    }

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        sortedValues: {
          dependencyType: "stateVariable",
          variableName: "sortedValues"
        }
      }),
      markStale: () => ({ updateReplacements: true }),
      definition: function () {
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    }

    return stateVariableDefinitions;
  }


  static createSerializedReplacements({ component, components,
    componentInfoObjects, workspace
  }) {

    let replacements = [];

    let componentsCopied = [];

    for (let valueObj of component.stateValues.sortedValues) {
      let replacementSource;

      if (valueObj.listInd === undefined) {
        replacementSource = components[valueObj.componentName];
      } else {
        let listComponent = components[valueObj.componentName];
        replacementSource = listComponent.activeChildren[valueObj.listInd]
      }

      if (replacementSource) {

        componentsCopied.push(replacementSource.componentName);

        replacements.push(replacementSource.serialize({ forLink: true }))
      }
    }

    workspace.uniqueIdentifiersUsed = [];
    replacements = postProcessCopy({
      serializedComponents: replacements,
      componentName: component.componentName,
      uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed,
    })

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: component.stateValues.newNamespace,
      componentInfoObjects,
    });

    workspace.componentsCopied = componentsCopied;

    return { replacements: processResult.serializedComponents };


  }

  static calculateReplacementChanges({ component, components,
    componentInfoObjects, workspace
  }) {

    let componentsToCopy = [];

    for (let valueObj of component.stateValues.sortedValues) {
      let replacementSource;

      if (valueObj.listInd === undefined) {
        replacementSource = components[valueObj.componentName];
      } else {
        let listComponent = components[valueObj.componentName];
        replacementSource = listComponent.activeChildren[valueObj.listInd]
      }

      if (replacementSource) {
        componentsToCopy.push(replacementSource.componentName);
      }
    }

    if (componentsToCopy.length == workspace.componentsCopied.length &&
      workspace.componentsCopied.every((x, i) => x === componentsToCopy[i])
    ) {
      return [];
    }

    // for now, just recreated
    let replacements = this.createSerializedReplacements({
      component, components,
      componentInfoObjects, workspace
    }).replacements;

    let replacementChanges = [{
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: component.replacements.length,
      serializedReplacements: replacements,
    }];

    return replacementChanges;

  }

}