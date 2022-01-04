import GraphicalComponent from './abstract/GraphicalComponent';

export default class RegionBetweenCurveXAxis extends GraphicalComponent {
  static componentType = "regionBetweenCurveXAxis";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.boundaryValues = {
      createComponentOfType: "numberList",
      createStateVariable: "boundaryValues",
      defaultValue: [0, 1],
      forRenderer: true,
      public: true,
    }

    attributes.function = {
      createComponentOfType: "function"
    }



    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.styleDescription = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
      }),
      definition: function ({ dependencyValues }) {

        let lineDescription = "";
        if (dependencyValues.selectedStyle.lineWidth >= 4) {
          lineDescription += "thick ";
        } else if (dependencyValues.selectedStyle.lineWidth <= 1) {
          lineDescription += "thin ";
        }
        if (dependencyValues.selectedStyle.lineStyle === "dashed") {
          lineDescription += "dashed ";
        } else if (dependencyValues.selectedStyle.lineStyle === "dotted") {
          lineDescription += "dotted ";
        }

        lineDescription += dependencyValues.selectedStyle.lineColor;

        return { newValues: { styleDescription: lineDescription } };
      }
    }

    stateVariableDefinitions.function = {
      additionalStateVariablesDefined: [{
        variableName: "haveFunction", forRenderer: true,
      }],
      forRenderer: true,
      returnDependencies: () => ({
        functionAttr: {
          dependencyType: "attributeComponent",
          attributeName: "function",
          variableNames: ["numericalfs", "nInputs", "nOutputs"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.functionAttr === null
          || dependencyValues.functionAttr.stateValues.nInputs !== 1
          || dependencyValues.functionAttr.stateValues.nOutputs !== 1
        ) {
          return { newValues: { function: () => NaN, haveFunction: false } }
        }

        return {
          newValues: {
            function: dependencyValues.functionAttr.stateValues.numericalfs[0],
            haveFunction: true
          }
        }
      }
    }

    return stateVariableDefinitions;
  }



}