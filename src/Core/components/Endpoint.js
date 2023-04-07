import Point from './Point';

export default class Endpoint extends Point {
  static componentType = "endpoint";
  static rendererType = "point";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.open = {
      createComponentOfType: "boolean",
      createStateVariable: "open",
      defaultValue: false,
      public: true,
      forRenderer: true,
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


  async switchPoint({ actionId, sourceInformation = {}, skipRendererUpdate = false }) {
    if (await this.stateValues.switchable) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "open",
          value: !await this.stateValues.open,
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
            open: !await this.stateValues.open
          }
        }
      });
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }

  }

}