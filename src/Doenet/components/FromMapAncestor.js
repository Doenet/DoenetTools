import BaseComponent from './abstract/BaseComponent';

export default class FromMapAncestor extends BaseComponent {
  static componentType = "fromMapAncestor";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

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

    stateVariableDefinitions.implicitValue = {
      returnDependencies: () => ({
      }),
      defaultValue: false,
      definition: function () {
        return { useEssentialOrDefaultValue: { implicitValue: { variablesToCheck: ["implicitValue"] } } }
      }
    };

    stateVariableDefinitions.value = {
      returnDependencies: () => ({
        stringChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneString",
          variableNames: ["value"],
        },
        implicitValue: {
          dependencyType: "stateVariable",
          variableName: "implicitValue"
        }
      }),
      defaultValue: 1,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.stringChild.length === 0) {
          if (dependencyValues.implicitValue) {
            return { newValues: { value: 1 } };
          } else {
            return { useEssentialOrDefaultValue: { value: { variablesToCheck: ["value"] } } }
          }
        }
        let number = Number(dependencyValues.stringChild[0].stateValues.value);
        if (Number.isNaN(number)) {
          number = 1;
        }
        return { newValues: { value: number } };
      }
    }

    return stateVariableDefinitions;
  }

}
