import BaseComponent from './abstract/BaseComponent';

export default class Markers extends BaseComponent {
  static componentType = "markers";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastOneNumbers = childLogic.newLeaf({
      name: "atLeastOneNumbers",
      componentType: 'number',
      comparison: 'atLeast',
      number: 1,
    });
    let atLeastOneTexts = childLogic.newLeaf({
      name: "atLeastOneTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 1,
    });

    let noTexts = childLogic.newLeaf({
      name: "noTexts",
      componentType: 'text',
      comparison: 'exactly',
      number: 0,
      allowSpillover: false,
    });

    let noNumbers = childLogic.newLeaf({
      name: "noNumbers",
      componentType: 'number',
      comparison: 'exactly',
      number: 0,
      allowSpillover: false,
    });

    let noTextAndNoNumbers = childLogic.newOperator({
      name: "noTextAndNoNumbers",
      operator: 'and',
      propositions: [noNumbers, noTexts],
    });

    childLogic.newOperator({
      name: "MarkerLogic",
      operator: 'xor',
      propositions: [atLeastOneNumbers, atLeastOneTexts, noTextAndNoNumbers],
      setAsBase: true,
    });


    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.markerType = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        textChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastOneTexts",
        },
        numberChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastOneNumbers",
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
        return { newValues: { markerType } }
      }
    }

    stateVariableDefinitions.markers = {
      public: true,
      isArray: true,
      entryPrefixes: ["item"],
      returnDependencies: () => ({
        markerType: {
          dependencyType: "stateVariable",
          variableName: "markerType"
        },
        textChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastOneTexts",
          variableNames: ["value"]
        },
        numberChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastOneNumbers",
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
          newValues: {markers},
          setComponentType: componentType,
        }
      }
    }

    return stateVariableDefinitions;
  }

}