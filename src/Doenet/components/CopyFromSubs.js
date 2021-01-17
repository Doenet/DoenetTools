import Copy from './Copy';

export default class CopyFromSubs extends Copy {
  static componentType = "copyfromsubs";

  static useReplacementsWhenCopyProp = true;

  static assignNamesToReplacements = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.fromSubstitutions = { default: 1 };
    properties.fromMapAncestor = { default: 1 };
    properties.fixed = { default: true, useDefaultForShadows: true }
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic()

    childLogic.newLeaf({
      name: "atMostOneProp",
      componentType: 'prop',
      comparison: 'atMost',
      number: 1,
      setAsBase: true
    });

    return childLogic;
  }


  static returnStateVariableDefinitions(args) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions(args);

    stateVariableDefinitions.targetInactive = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { targetInactive: false } })
    }

    delete stateVariableDefinitions.contentId;
    delete stateVariableDefinitions.serializedStateForContentId;


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

    stateVariableDefinitions.targetComponent = {
      stateVariablesDeterminingDependencies: ["targetSubs"],
      returnDependencies: ({ stateValues }) => ({
        targetSubsChildren: {
          dependencyType: "componentStateVariable",
          componentIdentity: stateValues.targetSubs,
          variableName: "childIdentities"
        },
        childNumber: {
          dependencyType: "stateVariable",
          variableName: "childNumber"
        }
      }),
      definition({ dependencyValues }) {

        let targetComponent = null;
        if (dependencyValues.targetSubsChildren) {
          targetComponent = dependencyValues.targetSubsChildren[dependencyValues.childNumber]
          if (!targetComponent) {
            targetComponent = null;
          }
        }
        return { newValues: { targetComponent } }
      }
    }

    stateVariableDefinitions.readyToExpand.definition = function ({ dependencyValues }) {
      if (dependencyValues.targetComponent && !dependencyValues.propDependenciesSetUp) {
        return { newValues: { readyToExpand: false } }
      }
      return { newValues: { readyToExpand: true } };
    };

    return stateVariableDefinitions;
  }

}
