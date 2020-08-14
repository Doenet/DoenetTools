import CompositeComponent from './abstract/CompositeComponent';
import { postProcessCopy } from '../utils/copy';

export default class CopyFromSubs extends CompositeComponent {
  static componentType = "copyfromsubs";

  static useReplacementsWhenCopyProp = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.fromSubstitutions = { default: 1 };
    properties.fromMapAncestor = { default: 1 };
    properties.fixed = { default: true, useDefaultForShadows: true }
    return properties;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.targetSubsName = {
      additionalStateVariablesDefined: ["childNumber"],
      stateVariablesDeterminingDependencies: ["fromMapAncestor", "fromSubstitutions"],
      returnDependencies: function ({ stateValues, sharedParameters }) {
        let substitutionsInfo = sharedParameters.substitutionsInfo;

        if (substitutionsInfo === undefined) {
          throw Error(`copyfromsubs can only be inside a map template.`);
        }

        let level = substitutionsInfo.length - stateValues.fromMapAncestor;
        let infoForLevel = substitutionsInfo[level];
        if (infoForLevel === undefined) {
          throw Error(`Invalid value of copyfromsubs fromMapAncestor: ${stateValues.fromMapAncestor}`);
        }
        let infoForSubs = infoForLevel[stateValues.fromSubstitutions - 1];
        if (infoForSubs === undefined) {
          throw Error(`Invalid fromSubstitutions of copyfromsubs: ${stateValues.fromSubstitutions}`);
        };

        return {
          targetSubsName: {
            dependencyType: "value",
            value: infoForSubs.name,
          },
          childNumber: {
            dependencyType: "value",
            value: infoForSubs.childNumber
          }
        }

      },
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            targetSubsName: dependencyValues.targetSubsName,
            childNumber: dependencyValues.childNumber
          },
          makeEssential: ["targetSubsName", "childNumber"],
        }
      },
    };

    stateVariableDefinitions.targetSubs = {
      stateVariablesDeterminingDependencies: ["targetSubsName"],
      returnDependencies: ({ stateValues }) => ({
        targetSubsComponent: {
          dependencyType: "componentIdentity",
          componentName: stateValues.targetSubsName,
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { targetSubs: dependencyValues.targetSubsComponent } }
      },
    };


    stateVariableDefinitions.replacementClassesForProp = {
      returnDependencies: () => ({
        targetSubs: {
          dependencyType: "stateVariable",
          variableName: "targetSubs"
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        return {
          newValues: {
            replacementClassesForProp: [componentInfoObjects.allComponentClasses[dependencyValues.targetSubs.componentType]],
          }
        };
      },
    };


    stateVariableDefinitions.readyToExpand = {
      stateVariablesDeterminingDependencies: [
        "targetSubs"
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        let dependencies = {}

        let compositeClass = componentInfoObjects.allComponentClasses._composite;
        let targetSubsClass = componentInfoObjects.allComponentClasses[stateValues.targetSubs.componentType];

        if (compositeClass.isPrototypeOf(targetSubsClass)) {
          dependencies.targetSubsReady = {
            dependencyType: "componentStateVariable",
            componentIdentity: stateValues.targetSubs,
            variableName: "readyToExpand"
          }
        }

        return dependencies;

      },
      definition: function () {
        return { newValues: { readyToExpand: true } };
      },
    };



    return stateVariableDefinitions;
  }



  static createSerializedReplacements({ component, components, workspace }) {

    // console.log(`createSerializedReplacements for ${component.componentName}`);

    let serializedCopy;

    let targetSubsComponent = components[component.stateValues.targetSubs.componentName];
    let targetChild = targetSubsComponent.activeChildren[component.stateValues.childNumber];
    if (targetChild === undefined) {
      workspace.targetChildName = undefined;
      return [];
    }
    workspace.targetChildName = targetChild.componentName;
    serializedCopy = targetChild.serialize({ forCopy: true });
    serializedCopy = [serializedCopy];

    if (!workspace.uniqueIdentifiersUsed) {
      workspace.uniqueIdentifiersUsed = []
    }

    return {
      replacements: postProcessCopy({
        serializedComponents: serializedCopy,
        componentName: component.componentName,
        uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed
      })
    };

  }

  static calculateReplacementChanges({ component, components, workspace }) {
    let targetSubsComponent = components[component.stateValues.targetSubs.componentName];
    let targetChild = targetSubsComponent.activeChildren[component.stateValues.childNumber];
    if (targetChild === undefined) {
      workspace.targetChildName = undefined;
      if (component.replacements.length > 0) {
        let replacementInstruction = {
          changeType: "delete",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          numberReplacementsToDelete: component.replacements.length,
        }

        replacementChanges.push(replacementInstruction);
      }
      return replacementChanges;
    }

    if (targetChild.componentName !== workspace.targetChildName) {
      // have different child than last time
      // create new replacements and delete old ones
      workspace.targetChildName = targetChild.componentName;
      serializedCopy = targetChild.serialize({ forCopy: true });
      serializedCopy = [serializedCopy];

      if (!workspace.uniqueIdentifiersUsed) {
        workspace.uniqueIdentifiersUsed = []
      }

      let newSerializedReplacements = postProcessCopy({
        serializedComponents: serializedCopy,
        componentName: component.componentName,
        uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed
      });

      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToReplace: component.replacements.length,
        serializedReplacements: newSerializedReplacements,
        replacementsToWithhold: 0,
      };

      replacementChanges.push(replacementInstruction);

    }

    return replacementChanges;


  }


}
