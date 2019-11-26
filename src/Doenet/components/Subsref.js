import CompositeComponent from './abstract/CompositeComponent';
import { postProcessRef } from './Ref';

export default class Subsref extends CompositeComponent {
  static componentType = "subsref";

  static createPropertiesObject({ standardComponentTypes }) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.fromMapAncestor = { default: 0 };

    // fixed will always be true, so delete as property and set as regular state variable
    delete properties.fixed;

    return properties;
  }

  static returnChildLogic({ standardComponentTypes, allComponentClasses, components }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.newLeaf({
      name: "atMostOneString",
      componentType: 'string',
      comparison: 'atMost',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.fixed = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { fixed: true } })
    }

    stateVariableDefinitions.substitutionsNumber = {
      returnDependencies: () => ({
        stringChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneString",
          variableNames: ["value"],
        },
      }),
      defaultValue: 1,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.stringChild.length === 0) {
          return { useEssentialOrDefaultValue: { substitutionsNumber: { variablesToCheck: ["substitutionsNumber"] } } }
        }
        let number = Number(dependencyValues.stringChild[0].stateValues.value);
        if (Number.isNaN(number)) {
          number = 1;
        }
        return { newValues: { substitutionsNumber: number } };
      }
    }

    stateVariableDefinitions.targetSubsName = {
      additionalStateVariablesDefined: ["childNumber"],
      stateVariablesDeterminingDependencies: ["fromMapAncestor", "substitutionsNumber"],
      returnDependencies: function ({ stateValues, sharedParameters }) {
        let substitutionsInfo = sharedParameters.substitutionsInfo;

        if (substitutionsInfo === undefined) {
          throw Error(`subsref can only be inside a map template.`);
        }

        let level = substitutionsInfo.length - 1 - stateValues.fromMapAncestor;
        let infoForLevel = substitutionsInfo[level];
        if (infoForLevel === undefined) {
          throw Error(`Invalid value of subsref fromMapAncestor: ${stateValues.fromMapAncestor}`);
        }
        let infoForSubs = infoForLevel[stateValues.substitutionsNumber - 1];
        if (infoForSubs === undefined) {
          throw Error(`Invalid substitutionsNumber of subsref: ${stateValues.substitutionsNumber}`);
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


    stateVariableDefinitions.replacementClasses = {
      additionalStateVariablesDefined: ["nonCompositeReplacementClasses"],
      returnDependencies: () => ({
        targetSubs: {
          dependencyType: "stateVariable",
          variableName: "targetSubs"
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let replacementClasses = [componentInfoObjects.allComponentClasses[dependencyValues.targetSubs.componentType]];
        return {
          newValues: {
            replacementClasses,
            nonCompositeReplacementClasses: replacementClasses,
          }
        };
      },
    };


    stateVariableDefinitions.readyToExpandWhenResolved = {
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
            componentName: stateValues.targetSubs.componentName,
            variableName: "readyToExpandWhenResolved"
          }
        }

        return dependencies;

      },
      definition: function () {
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    };



    return stateVariableDefinitions;
  }



  static createSerializedReplacements({ component, components, workspace }) {

    let serializedCopy;

    let targetSubsComponent = components[component.stateValues.targetSubs.componentName];
    let targetChild = targetSubsComponent.activeChildren[component.stateValues.childNumber];
    if (targetChild === undefined) {
      workspace.targetChildName = undefined;
      return [];
    }
    workspace.targetChildName = targetChild.componentName;
    serializedCopy = targetChild.serialize({ forReference: true });
    serializedCopy = [serializedCopy];

    return { replacements: postProcessRef({ serializedComponents: serializedCopy, componentName: component.componentName }) };

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
      serializedCopy = targetChild.serialize({ forReference: true });
      serializedCopy = [serializedCopy];

      let newSerializedReplacements = postProcessRef({ serializedComponents: serializedCopy, componentName: component.componentName });

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
