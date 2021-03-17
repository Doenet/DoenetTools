import CompositeComponent from './abstract/CompositeComponent';
import { postProcessCopy } from '../utils/copy';
import { processAssignNames } from '../utils/serializedStateProcessing';
import { replacementFromProp } from './Copy';
import { deepClone } from '../utils/deepFunctions';


export default class Collect extends CompositeComponent {
  static componentType = "collect";

  static assignNamesToReplacements = true;

  static acceptTname = true;
  static acceptProp = true;

  static get stateVariablesShadowedForReference() { return ["targetComponent", "propName", "componentTypesToCollect"] };

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.maximumNumber = { default: null };
    properties.componentIndex = { default: null };
    properties.propIndex = { default: null };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atMostOneComponentTypes",
      componentType: "componentTypes",
      comparison: "atMost",
      number: 1,
      takePropertyChildren: true,
      setAsBase: true
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.targetComponent = {
      returnDependencies: () => ({
        targetComponent: {
          dependencyType: "targetComponent",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            targetComponent: dependencyValues.targetComponent
          }
        }
      },
    };

    stateVariableDefinitions.targetInactive = {
      stateVariablesDeterminingDependencies: ["targetComponent"],
      returnDependencies({ stateValues }) {
        if (stateValues.targetComponent) {
          return {
            targetIsInactiveCompositeReplacement: {
              dependencyType: "stateVariable",
              componentName: stateValues.targetComponent.componentName,
              variableName: "isInactiveCompositeReplacement"
            }
          }
        } else {
          return {}
        }
      },
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            targetInactive: Boolean(dependencyValues.targetIsInactiveCompositeReplacement)
          }
        }
      },
    };


    stateVariableDefinitions.targetName = {
      returnDependencies: () => ({
        targetComponent: {
          dependencyType: "stateVariable",
          variableName: "targetComponent",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.targetComponent === null) {
          console.warn(`No copy target`);
          return { newValues: { targetName: "" } }
        }
        return { newValues: { targetName: dependencyValues.targetComponent.componentName } }
      },
    };

    stateVariableDefinitions.propName = {
      returnDependencies: () => ({
        propName: {
          dependencyType: "doenetAttribute",
          attributeName: "propName"
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { propName: dependencyValues.propName } }
      }
    }


    stateVariableDefinitions.componentTypesToCollect = {
      returnDependencies: () => ({
        componentTypesChild: {
          dependencyType: "child",
          childLogicName: "atMostOneComponentTypes",
          variableNames: ["texts"],
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.componentTypesChild.length === 1) {
          return {
            newValues: {
              componentTypesToCollect: dependencyValues.componentTypesChild[0].stateValues.texts
            }
          }
        } else {
          return {
            newValues: {
              componentTypesToCollect: []
            }
          }
        }
      }
    }

    stateVariableDefinitions.componentClassesToCollect = {
      returnDependencies: () => ({
        componentTypesToCollect: {
          dependencyType: "stateVariable",
          variableName: "componentTypesToCollect",
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {

        let componentClassesToCollect = [];
        for (let ct of dependencyValues.componentTypesToCollect) {
          let cClass = componentInfoObjects.allComponentClasses[ct];
          if (cClass === undefined) {
            let message = "Cannot collect component type " + ct + ". Component type not found.";
            console.warn(message);
          } else {
            componentClassesToCollect.push(cClass);
          }
        }

        return { newValues: { componentClassesToCollect } }

      }
    }

    stateVariableDefinitions.collectedComponents = {
      stateVariablesDeterminingDependencies: [
        "componentTypesToCollect", "targetName", "propName", "componentIndex", "propIndex"
      ],
      returnDependencies: function ({ stateValues }) {
        if (!stateValues.targetName) {
          return {};
        }

        let descendants = {
          dependencyType: "descendant",
          ancestorName: stateValues.targetName,
          componentTypes: stateValues.componentTypesToCollect,
          useReplacementsForComposites: true,
          includeNonActiveChildren: true,
          recurseToMatchedChildren: false,
          componentIndex: stateValues.componentIndex,
        }

        if (stateValues.propName) {
          descendants.variableNames = [stateValues.propName];
          descendants.variablesOptional = true;
          descendants.componentIndex = stateValues.componentIndex;
          descendants.propIndex = stateValues.propIndex;
          descendants.publicCaseInsensitiveVariableMatch = true;
          descendants.useMappedVariableNames = true;
        }

        return {
          descendants,
          maximumNumber: {
            dependencyType: "stateVariable",
            variableName: "maximumNumber"
          }
        }
      },
      definition: function ({ dependencyValues }) {

        // console.log(`definition of collectedComponents for ${componentName}`)
        // console.log(dependencyValues)

        let collectedComponents = dependencyValues.descendants;
        if (!collectedComponents) {
          collectedComponents = [];
        }

        if (dependencyValues.maximumNumber !== null && collectedComponents.length > dependencyValues.maximumNumber) {
          let maxnum = Math.max(0, Math.floor(dependencyValues.maximumNumber));
          collectedComponents = collectedComponents.slice(0, maxnum)
        }

        return {
          newValues: { collectedComponents }
        }

      }
    }


    stateVariableDefinitions.readyToExpand = {
      returnDependencies: () => ({
        collectedComponents: {
          dependencyType: "stateVariable",
          variableName: "collectedComponents"
        },
        needsReplacementsUpdatedWhenStale: {
          dependencyType: "stateVariable",
          variableName: "needsReplacementsUpdatedWhenStale"
        },
      }),
      definition: () => ({
        newValues: { readyToExpand: true }
      })
    }


    stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
      returnDependencies() {
        return {
          collectedComponents: {
            dependencyType: "stateVariable",
            variableName: "collectedComponents"
          }
        }
      },
      // the whole point of this state variable is to return updateReplacements
      // on mark stale
      markStale() {
        return { updateReplacements: true }
      },
      definition() {
        return { newValues: { needsReplacementsUpdatedWhenStale: true } }
      }
    }

    return stateVariableDefinitions;

  }



  static createSerializedReplacements({ component, components, workspace, componentInfoObjects }) {

    console.log(`create serialized replacements for ${component.componentName}`)
    console.log(component.stateValues.collectedComponents)

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    if (!component.stateValues.targetComponent) {
      return { replacements: [] };
    }

    let replacements = [];

    let numReplacementsByCollected = [];
    let numReplacementsSoFar = 0;

    workspace.propVariablesCopiedByCollected = [];

    workspace.uniqueIdentifiersUsedByCollected = {};

    for (let collectedNum = 0; collectedNum < component.stateValues.collectedComponents.length; collectedNum++) {
      if (component.stateValues.collectedComponents[collectedNum]) {
        let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedByCollected[collectedNum] = [];
        let results = this.createReplacementForCollected({
          component,
          collectedNum,
          components,
          numReplacementsSoFar,
          uniqueIdentifiersUsed,
          componentInfoObjects
        });

        workspace.propVariablesCopiedByCollected[collectedNum] = results.propVariablesCopiedByReplacement;

        let collectedReplacements = results.serializedReplacements;
        numReplacementsByCollected[collectedNum] = collectedReplacements.length;
        numReplacementsSoFar += collectedReplacements.length;
        replacements.push(...collectedReplacements);
      } else {
        numReplacementsByCollected[collectedNum] = 0;
      }
    }

    workspace.numReplacementsByCollected = numReplacementsByCollected;
    workspace.collectedNames = component.stateValues.collectedComponents.map(x => x.componentName)

    return { replacements };

  }



  static createReplacementForCollected({ component, components, collectedNum,
    numReplacementsSoFar, uniqueIdentifiersUsed, componentInfoObjects }) {

    // console.log(`create replacement for collected ${collectedNum}, ${numReplacementsSoFar}`)


    let collectedObj = component.stateValues.collectedComponents[collectedNum];
    let collectedName = collectedObj.componentName;
    let collectedComponent = components[collectedName];

    let serializedReplacements = [];
    let propVariablesCopiedByReplacement = [];

    // since we delayed recalculating descendants,
    // it's possible that a collectedComponent no longer exists
    // but hasn't been removed from the state variable
    // In this case, skip
    if (!collectedComponent) {
      return { serializedReplacements, propVariablesCopiedByReplacement };
    }

    if (component.stateValues.propName) {

      let results = replacementFromProp({
        component, components,
        replacementSource: collectedObj,
        propName: component.stateValues.propName,
        // numReplacementsSoFar,
        uniqueIdentifiersUsed,
      })

      serializedReplacements = results.serializedReplacements;
      propVariablesCopiedByReplacement = results.propVariablesCopiedByReplacement;

    } else {

      let serializedCopy = [collectedComponent.serialize({ forCopy: true })];

      serializedReplacements = postProcessCopy({
        serializedComponents: serializedCopy,
        componentName: component.componentName,
        uniqueIdentifiersUsed, identifierPrefix: collectedNum + "|"
      });

    }

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: serializedReplacements,
      parentName: component.componentName,
      indOffset: numReplacementsSoFar,
      parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
      componentInfoObjects,
    });

    serializedReplacements = processResult.serializedComponents;

    return { serializedReplacements, propVariablesCopiedByReplacement };

  }


  static calculateReplacementChanges({ component, componentChanges, components, workspace,
    componentInfoObjects }) {

    // console.log("Calculating replacement changes for " + component.componentName);
    // console.log(component.stateValues.collectedComponents.map(x => x.componentName))
    // console.log(deepClone(workspace));

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    let replacementChanges = [];

    let numReplacementsSoFar = 0;

    let numReplacementsByCollected = [];
    let propVariablesCopiedByCollected = [];

    let maxCollectedLength = Math.max(component.stateValues.collectedComponents.length, workspace.numReplacementsByCollected.length);

    let recreateRemaining = false;

    for (let collectedNum = 0; collectedNum < maxCollectedLength; collectedNum++) {
      let collected = component.stateValues.collectedComponents[collectedNum];
      if (collected === undefined) {
        if (workspace.numReplacementsByCollected[collectedNum] > 0) {

          if (!recreateRemaining) {
            // since deleting replacement will shift the remaining replacements
            // and change resulting names,
            // delete all remaining and mark to be recreated

            let numberReplacementsLeft = workspace.numReplacementsByCollected.slice(collectedNum)
              .reduce((a, c) => a + c, 0);

            if (numberReplacementsLeft > 0) {
              let replacementInstruction = {
                changeType: "delete",
                changeTopLevelReplacements: true,
                firstReplacementInd: numReplacementsSoFar,
                numberReplacementsToDelete: numberReplacementsLeft,
              }
              replacementChanges.push(replacementInstruction);
            }

            recreateRemaining = true;

            // since deleted remaining, change in workspace
            // so that don't attempt to delete again
            workspace.numReplacementsByCollected.slice(collectedNum)
              .forEach((v, i) => workspace.numReplacementsByCollected[i] = 0)

          }

          workspace.uniqueIdentifiersUsedByCollected[collectedNum] = [];

        }

        numReplacementsByCollected[collectedNum] = 0;
        propVariablesCopiedByCollected.push([]);

        continue;
      }

      let prevCollectedName = workspace.collectedNames[collectedNum];

      // check if collected has changed
      if (prevCollectedName === undefined || collected.componentName !== prevCollectedName
        || recreateRemaining
      ) {

        let prevNumReplacements = 0;
        if (prevCollectedName !== undefined) {
          prevNumReplacements = workspace.numReplacementsByCollected[collectedNum];
        }

        let numReplacementsToDelete = prevNumReplacements;
        if (recreateRemaining) {
          // already deleted old replacements
          numReplacementsToDelete = 0;
        }

        let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedByCollected[collectedNum] = [];
        let results = this.recreateReplacements({
          component,
          collectedNum,
          numReplacementsSoFar,
          numReplacementsToDelete,
          components,
          uniqueIdentifiersUsed,
          componentInfoObjects
        });

        numReplacementsSoFar += results.numReplacements;

        numReplacementsByCollected[collectedNum] = results.numReplacements;

        propVariablesCopiedByCollected[collectedNum] = results.propVariablesCopiedByReplacement;

        let replacementInstruction = results.replacementInstruction;

        if (!recreateRemaining) {
          if (results.numReplacements !== prevNumReplacements) {
            // we changed the number of replacements which shifts remaining ones
            // since names won't match, we need to delete 
            // all the remaining replacements and recreate them

            let numberReplacementsLeft = workspace.numReplacementsByCollected.slice(collectedNum)
              .reduce((a, c) => a + c, 0);

            replacementInstruction.numberReplacementsToReplace = numberReplacementsLeft;

            recreateRemaining = true;

            // since deleted remaining, change in workspace
            // so that don't attempt to delete again
            workspace.numReplacementsByCollected.slice(collectedNum)
              .forEach((v, i) => workspace.numReplacementsByCollected[i] = 0)

          }
        }

        replacementChanges.push(replacementInstruction);

        continue;
      }

      if (!component.stateValues.propName) {
        numReplacementsSoFar += workspace.numReplacementsByCollected[collectedNum];
        numReplacementsByCollected[collectedNum] = workspace.numReplacementsByCollected[collectedNum];
        continue;

      }


      // use new uniqueIdentifiersUsed
      // so will get the same names for pieces that match
      let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedByCollected[collectedNum] = [];
      let results = this.createReplacementForCollected({
        component,
        collectedNum,
        components,
        numReplacementsSoFar,
        uniqueIdentifiersUsed,
        componentInfoObjects
      });

      let propVariablesCopiedByReplacement = results.propVariablesCopiedByReplacement;

      let newSerializedReplacements = results.serializedReplacements;

      let nNewReplacements = newSerializedReplacements.length;
      let nOldReplacements = workspace.numReplacementsByCollected[collectedNum];

      if (nNewReplacements !== nOldReplacements) {
        // changing the number of replacements will shift the remaining replacements
        // and change resulting names,
        // delete all remaining and mark to be recreated

        let numberReplacementsLeft = workspace.numReplacementsByCollected.slice(collectedNum)
          .reduce((a, c) => a + c, 0);

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: numReplacementsSoFar,
          numberReplacementsToReplace: numberReplacementsLeft,
          serializedReplacements: newSerializedReplacements,
          assignNamesOffset: numReplacementsSoFar,
        };

        replacementChanges.push(replacementInstruction);

        recreateRemaining = true;

        // since deleted remaining, change in workspace
        // so that don't attempt to delete again
        workspace.numReplacementsByCollected.slice(collectedNum)
          .forEach((v, i) => workspace.numReplacementsByCollected[i] = 0)


      } else {

        for (let ind = 0; ind < nNewReplacements; ind++) {
          if (propVariablesCopiedByReplacement[ind].length !== workspace.propVariablesCopiedByCollected[collectedNum][ind].length ||
            workspace.propVariablesCopiedByCollected[collectedNum][ind].some((v, i) => v !== propVariablesCopiedByReplacement[ind][i])
          ) {

            let replacementInstruction = {
              changeType: "add",
              changeTopLevelReplacements: true,
              firstReplacementInd: numReplacementsSoFar + ind,
              numberReplacementsToReplace: 1,
              serializedReplacements: [newSerializedReplacements[ind]],
              assignNamesOffset: numReplacementsSoFar + ind,
            };
            replacementChanges.push(replacementInstruction);
          }
        }
      }


      numReplacementsSoFar += nNewReplacements;

      numReplacementsByCollected[collectedNum] = nNewReplacements;

      propVariablesCopiedByCollected[collectedNum] = propVariablesCopiedByReplacement;

    }


    workspace.numReplacementsByCollected = numReplacementsByCollected;
    workspace.collectedNames = component.stateValues.collectedComponents.map(x => x.componentName)
    workspace.propVariablesCopiedByCollected = propVariablesCopiedByCollected;

    return replacementChanges;

  }

  static recreateReplacements({ component, collectedNum, numReplacementsSoFar,
    numReplacementsToDelete,
    uniqueIdentifiersUsed, components, componentInfoObjects
  }) {

    let results = this.createReplacementForCollected({
      component, collectedNum, components, numReplacementsSoFar, uniqueIdentifiersUsed,
      componentInfoObjects
    });

    let propVariablesCopiedByReplacement = results.propVariablesCopiedByReplacement;

    let newSerializedChildren = results.serializedReplacements;

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: numReplacementsSoFar,
      numberReplacementsToReplace: numReplacementsToDelete,
      serializedReplacements: newSerializedChildren,
      assignNamesOffset: numReplacementsSoFar,
    };

    return {
      numReplacements: newSerializedChildren.length,
      propVariablesCopiedByReplacement,
      replacementInstruction
    }
  }

}
