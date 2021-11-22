import Curve from '../Curve.js';

export default class EquilibriumCurve extends Curve {
  static componentType = "equilibriumCurve";
  static rendererType = "curve";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.stable = {
      createComponentOfType: "boolean",
      createStateVariable: "stable",
      defaultValue: true,
      public: true,
    };

    attributes.switchable = {
      createComponentOfType: "boolean",
      createStateVariable: "switchable",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };

    return attributes;
  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });


    stateVariableDefinitions.dashed = {
      forRenderer: true,
      returnDependencies: () => ({
        stable: {
          dependencyType: "stateVariable",
          variableName: "stable"
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: { dashed: !dependencyValues.stable }
        }
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setDependency: "stable",
            desiredValue: !desiredStateVariableValues.dashed
          }]
        }
      }

    }

    return stateVariableDefinitions;

  };

  switchCurve() {
    if (this.stateValues.switchable) {
      return this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "stable",
          value: !this.stateValues.stable,
        }],
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            stable: !this.stateValues.stable
          }
        }
      });
    }

  }




}