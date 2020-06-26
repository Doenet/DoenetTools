import CompositeComponent from './abstract/CompositeComponent';

export default class IndexFromSubs extends CompositeComponent {
  static componentType = "indexfromsubs";

  static useReplacementsWhenCopyProp = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.fromSubstitutions = { default: 1 };
    properties.fromMapAncestor = { default: 1 };
    return properties;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.index = {
      stateVariablesDeterminingDependencies: ["fromMapAncestor", "fromSubstitutions"],
      returnDependencies: function ({ stateValues, sharedParameters }) {
        let substitutionsChildIndices = sharedParameters.substitutionsChildIndices;

        if (substitutionsChildIndices === undefined) {
          throw Error(`indexfromsubs can only be inside a map template.`);
        }

        let level = substitutionsChildIndices.length - stateValues.fromMapAncestor;
        let childIndices = substitutionsChildIndices[level];
        if (childIndices === undefined) {
          throw Error(`Invalid value of indexfromsubs fromMapAncestor: ${stateValues.fromMapAncestor}`);
        }
        let childIndex = childIndices[stateValues.fromSubstitutions - 1];
        if (childIndex === undefined) {
          throw Error(`Invalid fromSubstitutions of indexfromsubs: ${stateValues.fromSubstitutions}`);
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

    stateVariableDefinitions.replacementClassesForProp = {
      returnDependencies: () => ({
      }),
      definition: function ({ componentInfoObjects }) {
        return {
          newValues: {
            replacementClassesForProp: [componentInfoObjects.allComponentClasses.number],
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
