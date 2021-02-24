import Copy from './Copy';

export default class CopySource extends Copy {
  static componentType = "copySource";

  static assignNamesToReplacements = true;

  static acceptProp = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.fromSources = { default: 1 };
    properties.fromMapAncestor = { default: 1 };
    properties.fixed = { default: true, useDefaultForShadows: true }
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic()

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


    stateVariableDefinitions.targetSourcesName = {
      additionalStateVariablesDefined: ["childNumber"],
      stateVariablesDeterminingDependencies: ["fromMapAncestor", "fromSources"],
      returnDependencies: function ({ stateValues, sharedParameters }) {
        let sourcesInfo = sharedParameters.sourcesInfo;

        if (sourcesInfo === undefined) {
          throw Error(`copySource can only be inside a map template.`);
        }

        let level = sourcesInfo.length - stateValues.fromMapAncestor;
        let infoForLevel = sourcesInfo[level];
        if (infoForLevel === undefined) {
          throw Error(`Invalid value of copySource fromMapAncestor: ${stateValues.fromMapAncestor}`);
        }
        let infoForSources = infoForLevel[stateValues.fromSources - 1];
        if (infoForSources === undefined) {
          throw Error(`Invalid fromSources of copySource: ${stateValues.fromSources}`);
        };

        return {
          targetSourcesName: {
            dependencyType: "value",
            value: infoForSources.name,
          },
          childNumber: {
            dependencyType: "value",
            value: infoForSources.childNumber
          }
        }

      },
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            targetSourcesName: dependencyValues.targetSourcesName,
            childNumber: dependencyValues.childNumber
          },
          makeEssential: ["targetSourcesName", "childNumber"],
        }
      },
    };

    stateVariableDefinitions.targetSources = {
      stateVariablesDeterminingDependencies: ["targetSourcesName"],
      returnDependencies: ({ stateValues }) => ({
        targetSourcesComponent: {
          dependencyType: "componentIdentity",
          componentName: stateValues.targetSourcesName,
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { targetSources: dependencyValues.targetSourcesComponent } }
      },
    };

    stateVariableDefinitions.targetComponent = {
      stateVariablesDeterminingDependencies: ["targetSources"],
      returnDependencies: ({ stateValues }) => ({
        targetSourcesChildren: {
          dependencyType: "stateVariable",
          componentName: stateValues.targetSources.componentName,
          variableName: "childIdentities"
        },
        childNumber: {
          dependencyType: "stateVariable",
          variableName: "childNumber"
        }
      }),
      definition({ dependencyValues }) {

        let targetComponent = null;
        if (dependencyValues.targetSourcesChildren) {
          targetComponent = dependencyValues.targetSourcesChildren[dependencyValues.childNumber]
          if (!targetComponent) {
            targetComponent = null;
          }
        }
        return { newValues: { targetComponent } }
      }
    }

    // stateVariableDefinitions.readyToExpand.definition = function ({ dependencyValues }) {
    //   if (dependencyValues.targetComponent && !dependencyValues.propDependenciesSetUp) {
    //     return { newValues: { readyToExpand: false } }
    //   }
    //   return { newValues: { readyToExpand: true } };
    // };

    return stateVariableDefinitions;
  }

}
