import GraphicalComponent from "./abstract/GraphicalComponent";

export default class RegionBetweenCurveXAxis extends GraphicalComponent {
  static componentType = "regionBetweenCurveXAxis";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.boundaryValues = {
      createComponentOfType: "numberList",
      createStateVariable: "boundaryValues",
      defaultValue: [0, 1],
      forRenderer: true,
      public: true,
    };

    attributes.function = {
      createComponentOfType: "function",
    };

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.styleDescription = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
        document: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: ["theme"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let fillColorWord;
        if (dependencyValues.document?.stateValues.theme === "dark") {
          fillColorWord = dependencyValues.selectedStyle.fillColorWordDarkMode;
        } else {
          fillColorWord = dependencyValues.selectedStyle.fillColorWord;
        }

        return { setValue: { styleDescription: fillColorWord } };
      },
    };

    stateVariableDefinitions.styleDescriptionWithNoun = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        styleDescription: {
          dependencyType: "stateVariable",
          variableName: "styleDescription",
        },
      }),
      definition: function ({ dependencyValues }) {
        let styleDescriptionWithNoun =
          dependencyValues.styleDescription + " region";

        return { setValue: { styleDescriptionWithNoun } };
      },
    };

    stateVariableDefinitions.function = {
      additionalStateVariablesDefined: [
        {
          variableName: "haveFunction",
          forRenderer: true,
        },
        {
          variableName: "fDefinition",
          forRenderer: true,
        },
      ],
      returnDependencies: () => ({
        functionAttr: {
          dependencyType: "attributeComponent",
          attributeName: "function",
          variableNames: ["numericalfs", "nInputs", "nOutputs", "fDefinition"],
        },
      }),
      definition({ dependencyValues }) {
        if (
          dependencyValues.functionAttr === null ||
          dependencyValues.functionAttr.stateValues.nInputs !== 1 ||
          dependencyValues.functionAttr.stateValues.nOutputs !== 1
        ) {
          return {
            setValue: {
              function: () => NaN,
              haveFunction: false,
              fDefinition: {},
            },
          };
        }

        return {
          setValue: {
            function: dependencyValues.functionAttr.stateValues.numericalfs[0],
            haveFunction: true,
            fDefinition: dependencyValues.functionAttr.stateValues.fDefinition,
          },
        };
      },
    };

    return stateVariableDefinitions;
  }
}
