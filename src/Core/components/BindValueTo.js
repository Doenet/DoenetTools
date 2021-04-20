import BaseComponent from './abstract/BaseComponent';

export default class BindValueTo extends BaseComponent {
  static componentType = "bindValueTo";
  static rendererType = undefined;

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atMostOneChild",
      componentType: '_base',
      comparison: 'atMost',
      number: 1,
      setAsBase: true
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      returnDependencies: () => ({
        child: {
          dependencyType: "child",
          childLogicName: "atMostOneChild",
          variableNames: ["value"],
          variablesOptional: true,
          requireChildLogicInitiallySatisfied: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.child.length === 1) {
          let child = dependencyValues.child[0];
          if (child.stateValues.value !== undefined) {
            return { newValues: { value: child.stateValues.value } };
          }
        }
        return { newValues: { value: null } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {
        let haveBoundValue = false;
        if (dependencyValues.child.length === 1) {
          let child = dependencyValues.child[0];
          if (child.stateValues.value !== undefined) {
            haveBoundValue = true;
          }
        }

        if (haveBoundValue) {
          return {
            success: true,
            instructions: [{
              setDependency: "child",
              desiredValue: desiredStateVariableValues.value,
              childIndex: 0,
              variableIndex: 0,
            }]
          };
        } else {
          return { success: false };
        }
      }
    }


    stateVariableDefinitions.valueForDisplay = {
      returnDependencies: () => ({
        child: {
          dependencyType: "child",
          childLogicName: "atMostOneChild",
          variableNames: ["valueForDisplay"],
          variablesOptional: true,
          requireChildLogicInitiallySatisfied: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.child.length === 1) {
          let child = dependencyValues.child[0];
          if (child.stateValues.valueForDisplay !== undefined) {
            return { newValues: { valueForDisplay: child.stateValues.valueForDisplay } };
          }
        }
        return { newValues: { valueForDisplay: null } };
      }
    }



    stateVariableDefinitions.text = {
      returnDependencies: () => ({
        child: {
          dependencyType: "child",
          childLogicName: "atMostOneChild",
          variableNames: ["text"],
          variablesOptional: true,
          requireChildLogicInitiallySatisfied: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.child.length === 1) {
          let child = dependencyValues.child[0];
          if (typeof child.stateValues.text === "string") {
            return { newValues: { text: child.stateValues.text } };
          }
        }
        return { newValues: { text: "" } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {
        let haveBoundValue = false;
        if (dependencyValues.child.length === 1) {
          let child = dependencyValues.child[0];
          if (typeof child.stateValues.text === "string") {
            haveBoundValue = true;
          }
        }

        if (haveBoundValue) {
          return {
            success: true,
            instructions: [{
              setDependency: "child",
              desiredValue: desiredStateVariableValues.text,
              childIndex: 0,
              variableIndex: 0,
            }]
          };
        } else {
          return { success: false };
        }
      }
    }


    return stateVariableDefinitions;

  }

}