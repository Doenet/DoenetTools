import CompositeComponent from './abstract/CompositeComponent';
import { processAssignNames } from '../utils/serializedStateProcessing';

export default class SourceIndex extends CompositeComponent {
  static componentType = "sourceIndex";

  static assignNamesToReplacements = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.fromSources = { default: 1 };
    properties.fromMapAncestor = { default: 1 };
    return properties;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.index = {
      stateVariablesDeterminingDependencies: ["fromMapAncestor", "fromSources"],
      returnDependencies: function ({ stateValues, sharedParameters }) {
        let sourcesChildIndices = sharedParameters.sourcesChildIndices;

        if (sourcesChildIndices === undefined) {
          throw Error(`sourceIndex can only be inside a map template.`);
        }

        let level = sourcesChildIndices.length - stateValues.fromMapAncestor;
        let childIndices = sourcesChildIndices[level];
        if (childIndices === undefined) {
          throw Error(`Invalid value of sourceIndex fromMapAncestor: ${stateValues.fromMapAncestor}`);
        }
        let childIndex = childIndices[stateValues.fromSources - 1];
        if (childIndex === undefined) {
          throw Error(`Invalid fromSources of sourceIndex: ${stateValues.fromSources}`);
        };

        return {
          index: {
            dependencyType: "value",
            value: childIndex,
          }
        }

      },
      definition: function ({ dependencyValues }) {
        return {
          newValues: { index: dependencyValues.index },
          makeEssential: ["index"]
        }
      },
    };


    stateVariableDefinitions.readyToExpand = {
      returnDependencies: () => ({
        index: {
          dependencyType: "stateVariable",
          variableName: "index"
        }
      }),
      definition: function () {
        return { newValues: { readyToExpand: true } };
      },
    };



    return stateVariableDefinitions;
  }

  static createSerializedReplacements({ component, componentInfoObjects }) {

    let replacements = [{
      componentType: "number",
      state: { value: component.stateValues.index, fixed: true },
    }];

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
      componentInfoObjects,
    });

    return { replacements: processResult.serializedComponents };

  }

  static calculateReplacementChanges() {
    return [];
  }

}
