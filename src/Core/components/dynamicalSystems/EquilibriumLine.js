import Line from '../Line';

export default class EquilibriumLine extends Line {
  static componentType = "equilibriumLine";
  static rendererType = "line";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

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


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


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
          setValue: { dashed: !dependencyValues.stable }
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

  async switchLine({ actionId, sourceInformation = {}, skipRendererUpdate = false, }) {
    if (await this.stateValues.switchable) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "stable",
          value: !this.stateValues.stable,
        }],
        actionId,
        sourceInformation,
        skipRendererUpdate,
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
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }

  }




}