import CompositeComponent from './abstract/CompositeComponent';
import Ref from './Ref';

export default class Subsindex extends CompositeComponent {
  static componentType = "subsindex";

  static createPropertiesObject({ standardComponentTypes }) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.fromMapAncestor = { default: 0 };
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

    stateVariableDefinitions.index = {
      stateVariablesDeterminingDependencies: ["fromMapAncestor", "substitutionsNumber"],
      returnDependencies: function ({ stateValues, sharedParameters }) {
        let substitutionsChildIndices = sharedParameters.substitutionsChildIndices;

        if (substitutionsChildIndices === undefined) {
          throw Error(`subsindex can only be inside a map template.`);
        }

        let level = substitutionsChildIndices.length - 1 - stateValues.fromMapAncestor;
        let childIndices = substitutionsChildIndices[level];
        if (childIndices === undefined) {
          throw Error(`Invalid value of subsindex fromMapAncestor: ${stateValues.fromMapAncestor}`);
        }
        let childIndex = childIndices[stateValues.substitutionsNumber - 1];
        if (childIndex === undefined) {
          throw Error(`Invalid substitutionsNumber of subsindex: ${stateValues.substitutionsNumber}`);
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

    stateVariableDefinitions.replacementClasses = {
      additionalStateVariablesDefined: ["nonCompositeReplacementClasses"],
      returnDependencies: () => ({
      }),
      definition: function ({ componentInfoObjects }) {
        let replacementClasses = [componentInfoObjects.allComponentClasses.number];
        return {
          newValues: {
            replacementClasses,
            nonCompositeReplacementClasses: replacementClasses,
          }
        };
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

  static createSerializedReplacements({ component }) {
    return {
      replacements: [{
        componentType: "number",
        state: { value: component.stateValues.index, fixed: true }
      }]
    }
  }

  static calculateReplacementChanges() {
    return [];
  }

}
