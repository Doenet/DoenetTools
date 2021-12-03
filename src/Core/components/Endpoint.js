import Point from './Point';

export default class Endpoint extends Point {
  static componentType = "endpoint";
  static rendererType = "point";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

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


  switchPoint() {
    if (this.stateValues.switchable) {
      return this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "open",
          value: !this.stateValues.open,
        }],
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            open: !this.stateValues.open
          }
        }
      });
    }

  }

}