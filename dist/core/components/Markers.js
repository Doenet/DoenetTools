import BaseComponent from './abstract/BaseComponent.js';

export default class Markers extends BaseComponent {
  static componentType = "markers";

  static returnChildGroups() {

    return [{
      group: "texts",
      componentTypes: ["text"]
    }, {
      group: "numbers",
      componentTypes: ["number"]
    }]

  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.markerType = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        textChildren: {
          dependencyType: "child",
          childGroups: ["texts"],
        },
        numberChildren: {
          dependencyType: "child",
          childGroups: ["numbers"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let markerType;
        if (dependencyValues.textChildren.length > 0) {
          markerType = "text";
        } else if (dependencyValues.numberChildren.length > 0) {
          markerType = "number";
        } else {
          markerType = "empty";
        }
        return { setValue: { markerType } }
      }
    }

    stateVariableDefinitions.markers = {
      public: true,
      isArray: true,
      shadowingInstructions: {
        hasVariableComponentType: true,
      },
      entryPrefixes: ["item"],
      returnDependencies: () => ({
        markerType: {
          dependencyType: "stateVariable",
          variableName: "markerType"
        },
        textChildren: {
          dependencyType: "child",
          childGroups: ["texts"],
          variableNames: ["value"]
        },
        numberChildren: {
          dependencyType: "child",
          childGroups: ["numbers"],
          variableNames: ["value"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let markers = [];
        let componentType = dependencyValues.markerType;

        if (dependencyValues.markerType === "text") {
          markers = dependencyValues.textChildren.map(x => x.stateValues.value);
        } else if (dependencyValues.markerType === "number") {
          markers = dependencyValues.numberChildren.map(x => x.stateValues.value);
          markers.sort((a, b) => { return a - b; })  //sort in number order
        } else {
          componentType = "text"; // use "text" for case when "empty"
        }

        return {
          setValue: { markers },
          setCreateComponentOfType: { markers: componentType },
        }
      }
    }

    return stateVariableDefinitions;
  }

}