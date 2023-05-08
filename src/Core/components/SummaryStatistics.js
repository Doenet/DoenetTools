import BlockComponent from "./abstract/BlockComponent";
import me from "math-expressions";
import { roundForDisplay } from "../utils/math";
import {
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";

export default class SummaryStatistics extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "summaryStatistics";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.source = {
      createTargetComponentNames: true,
    };

    attributes.column = {
      createComponentOfType: "text",
      createStateVariable: "desiredColumn",
      defaultValue: null,
    };

    attributes.statisticsToDisplay = {
      createComponentOfType: "textList",
      createStateVariable: "statisticsToDisplayPrelim",
      defaultValue: ["default"],
    };

    // TODO: enable feature where compute summary statistics for each value of a column
    attributes.byCategoryColumn = {
      createComponentOfType: "text",
      createStateVariable: "byCategoryColumn",
      defaultValue: null,
      public: true,
    };

    Object.assign(attributes, returnRoundingAttributes());

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    Object.assign(
      stateVariableDefinitions,
      returnRoundingStateVariableDefinitions(),
    );

    stateVariableDefinitions.statisticsToDisplay = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "textList",
      },
      returnDependencies: () => ({
        statisticsToDisplayPrelim: {
          dependencyType: "stateVariable",
          variableName: "statisticsToDisplayPrelim",
        },
      }),
      definition: function ({ dependencyValues }) {
        let options = [
          "mean",
          "stdev",
          "variance",
          "stderr",
          "count",
          "minimum",
          "quartile1",
          "median",
          "quartile3",
          "maximum",
          "range",
          "sum",
        ];

        let statisticsToDisplay = [];

        let desiredStats = dependencyValues.statisticsToDisplayPrelim.map((x) =>
          x.toLowerCase(),
        );

        if (desiredStats.includes("default")) {
          statisticsToDisplay = [
            "mean",
            "stdev",
            "count",
            "minimum",
            "quartile1",
            "median",
            "quartile3",
            "maximum",
          ];
        } else if (desiredStats.includes("all")) {
          statisticsToDisplay = [...options];
        } else {
          for (let stat of options) {
            if (desiredStats.includes(stat)) {
              statisticsToDisplay.push(stat);
            }
          }
        }

        return { setValue: { statisticsToDisplay } };
      },
    };

    stateVariableDefinitions.sourceName = {
      returnDependencies: () => ({
        source: {
          dependencyType: "attributeTargetComponentNames",
          attributeName: "source",
        },
      }),
      definition({ dependencyValues }) {
        let sourceName;

        if (dependencyValues.source?.length === 1) {
          sourceName = dependencyValues.source[0].absoluteName;
        } else {
          sourceName = null;
        }
        return { setValue: { sourceName } };
      },
    };

    stateVariableDefinitions.dataColumn = {
      stateVariablesDeterminingDependencies: ["sourceName"],
      additionalStateVariablesDefined: [
        {
          variableName: "columnName",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "text",
          },
          forRenderer: true,
        },
      ],
      returnDependencies({ stateValues }) {
        return {
          dataFrame: {
            dependencyType: "stateVariable",
            componentName: stateValues.sourceName,
            variableName: "dataFrame",
            variableOptional: true,
          },
          desiredColumn: {
            dependencyType: "stateVariable",
            variableName: "desiredColumn",
          },
        };
      },
      definition({ dependencyValues }) {
        let dataColumn = null,
          columnName = null;
        if (dependencyValues.dataFrame) {
          let dataFrame = dependencyValues.dataFrame;
          let colInd = dataFrame.columnNames.indexOf(
            dependencyValues.desiredColumn,
          );
          if (colInd !== -1) {
            columnName = dependencyValues.desiredColumn;
            dataColumn = [];
            for (let row of dataFrame.data) {
              if (row[colInd] !== null) {
                dataColumn.push(row[colInd]);
              }
            }
          }
        }

        return {
          setValue: { dataColumn, columnName },
        };
      },
    };

    stateVariableDefinitions.count = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn",
        },
      }),
      definition({ dependencyValues }) {
        let count = null;
        if (dependencyValues.dataColumn) {
          count = dependencyValues.dataColumn.length;
        }

        return { setValue: { count } };
      },
    };

    stateVariableDefinitions.sum = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: Object.keys(returnRoundingAttributes()),
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn",
        },
      }),
      definition({ dependencyValues }) {
        let sum = null;
        if (dependencyValues.dataColumn) {
          sum = dependencyValues.dataColumn.reduce((a, c) => a + c);
        }

        return { setValue: { sum } };
      },
    };

    stateVariableDefinitions.mean = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: Object.keys(returnRoundingAttributes()),
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn",
        },
      }),
      definition({ dependencyValues }) {
        let mean = null;
        if (dependencyValues.dataColumn !== null) {
          mean = me.math.mean(dependencyValues.dataColumn);
        }
        return { setValue: { mean } };
      },
    };

    stateVariableDefinitions.stdev = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: Object.keys(returnRoundingAttributes()),
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn",
        },
      }),
      definition({ dependencyValues }) {
        let stdev = null;
        if (dependencyValues.dataColumn) {
          stdev = me.math.std(dependencyValues.dataColumn);
        }

        return { setValue: { stdev } };
      },
    };

    stateVariableDefinitions.variance = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: Object.keys(returnRoundingAttributes()),
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn",
        },
      }),
      definition({ dependencyValues }) {
        let variance = null;
        if (dependencyValues.dataColumn) {
          variance = me.math.variance(dependencyValues.dataColumn);
        }

        return { setValue: { variance } };
      },
    };

    stateVariableDefinitions.stderr = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: Object.keys(returnRoundingAttributes()),
      },
      returnDependencies: () => ({
        stdev: {
          dependencyType: "stateVariable",
          variableName: "stdev",
        },
        count: {
          dependencyType: "stateVariable",
          variableName: "count",
        },
      }),
      definition({ dependencyValues }) {
        let stderr = null;
        if (dependencyValues.stdev !== null) {
          stderr = dependencyValues.stdev / Math.sqrt(dependencyValues.count);
        }

        return { setValue: { stderr } };
      },
    };

    stateVariableDefinitions.minimum = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: Object.keys(returnRoundingAttributes()),
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn",
        },
      }),
      definition({ dependencyValues }) {
        let minimum = null;
        if (dependencyValues.dataColumn) {
          minimum = Math.min(...dependencyValues.dataColumn);
        }
        return { setValue: { minimum } };
      },
    };

    stateVariableDefinitions.maximum = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: Object.keys(returnRoundingAttributes()),
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn",
        },
      }),
      definition({ dependencyValues }) {
        let maximum = null;
        if (dependencyValues.dataColumn) {
          maximum = Math.max(...dependencyValues.dataColumn);
        }
        return { setValue: { maximum } };
      },
    };

    stateVariableDefinitions.median = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: Object.keys(returnRoundingAttributes()),
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn",
        },
      }),
      definition({ dependencyValues }) {
        let median = null;
        if (dependencyValues.dataColumn) {
          median = me.math.median(dependencyValues.dataColumn);
        }
        return { setValue: { median } };
      },
    };

    stateVariableDefinitions.quartile1 = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: Object.keys(returnRoundingAttributes()),
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn",
        },
      }),
      definition({ dependencyValues }) {
        let quartile1 = null;
        if (dependencyValues.dataColumn) {
          quartile1 = me.math.quantileSeq(dependencyValues.dataColumn, 0.25);
        }
        return { setValue: { quartile1 } };
      },
    };

    stateVariableDefinitions.quartile3 = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: Object.keys(returnRoundingAttributes()),
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn",
        },
      }),
      definition({ dependencyValues }) {
        let quartile3 = null;
        if (dependencyValues.dataColumn) {
          quartile3 = me.math.quantileSeq(dependencyValues.dataColumn, 0.75);
        }
        return { setValue: { quartile3 } };
      },
    };

    stateVariableDefinitions.range = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: Object.keys(returnRoundingAttributes()),
      },
      returnDependencies: () => ({
        minimum: {
          dependencyType: "stateVariable",
          variableName: "minimum",
        },
        maximum: {
          dependencyType: "stateVariable",
          variableName: "maximum",
        },
      }),
      definition({ dependencyValues }) {
        let range = null;
        if (dependencyValues.minimum !== null) {
          range = dependencyValues.maximum - dependencyValues.minimum;
        }

        return { setValue: { range } };
      },
    };

    stateVariableDefinitions.summaryStatistics = {
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["statisticsToDisplay"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          displayDigits: {
            dependencyType: "stateVariable",
            variableName: "displayDigits",
          },
          displayDecimals: {
            dependencyType: "stateVariable",
            variableName: "displayDecimals",
          },
          displaySmallAsZero: {
            dependencyType: "stateVariable",
            variableName: "displaySmallAsZero",
          },
        };

        if (stateValues.statisticsToDisplay.includes("mean")) {
          dependencies.mean = {
            dependencyType: "stateVariable",
            variableName: "mean",
          };
        }
        if (stateValues.statisticsToDisplay.includes("stdev")) {
          dependencies.stdev = {
            dependencyType: "stateVariable",
            variableName: "stdev",
          };
        }
        if (stateValues.statisticsToDisplay.includes("variance")) {
          dependencies.variance = {
            dependencyType: "stateVariable",
            variableName: "variance",
          };
        }
        if (stateValues.statisticsToDisplay.includes("stderr")) {
          dependencies.stderr = {
            dependencyType: "stateVariable",
            variableName: "stderr",
          };
        }
        if (stateValues.statisticsToDisplay.includes("count")) {
          dependencies.count = {
            dependencyType: "stateVariable",
            variableName: "count",
          };
        }
        if (stateValues.statisticsToDisplay.includes("minimum")) {
          dependencies.minimum = {
            dependencyType: "stateVariable",
            variableName: "minimum",
          };
        }
        if (stateValues.statisticsToDisplay.includes("quartile1")) {
          dependencies.quartile1 = {
            dependencyType: "stateVariable",
            variableName: "quartile1",
          };
        }
        if (stateValues.statisticsToDisplay.includes("median")) {
          dependencies.median = {
            dependencyType: "stateVariable",
            variableName: "median",
          };
        }
        if (stateValues.statisticsToDisplay.includes("quartile3")) {
          dependencies.quartile3 = {
            dependencyType: "stateVariable",
            variableName: "quartile3",
          };
        }
        if (stateValues.statisticsToDisplay.includes("maximum")) {
          dependencies.maximum = {
            dependencyType: "stateVariable",
            variableName: "maximum",
          };
        }
        if (stateValues.statisticsToDisplay.includes("range")) {
          dependencies.range = {
            dependencyType: "stateVariable",
            variableName: "range",
          };
        }
        if (stateValues.statisticsToDisplay.includes("sum")) {
          dependencies.sum = {
            dependencyType: "stateVariable",
            variableName: "sum",
          };
        }

        return dependencies;
      },
      definition({ dependencyValues }) {
        let summaryStatistics = {};

        if (dependencyValues.mean !== undefined) {
          summaryStatistics.mean = roundForDisplay({
            value: dependencyValues.mean,
            dependencyValues,
          });
        }
        if (dependencyValues.stdev !== undefined) {
          summaryStatistics.stdev = roundForDisplay({
            value: dependencyValues.stdev,
            dependencyValues,
          });
        }
        if (dependencyValues.variance !== undefined) {
          summaryStatistics.variance = roundForDisplay({
            value: dependencyValues.variance,
            dependencyValues,
          });
        }
        if (dependencyValues.stderr !== undefined) {
          summaryStatistics.stderr = roundForDisplay({
            value: dependencyValues.stderr,
            dependencyValues,
          });
        }
        if (dependencyValues.count !== undefined) {
          summaryStatistics.count = roundForDisplay({
            value: dependencyValues.count,
            dependencyValues,
          });
        }
        if (dependencyValues.minimum !== undefined) {
          summaryStatistics.minimum = roundForDisplay({
            value: dependencyValues.minimum,
            dependencyValues,
          });
        }
        if (dependencyValues.quartile1 !== undefined) {
          summaryStatistics.quartile1 = roundForDisplay({
            value: dependencyValues.quartile1,
            dependencyValues,
          });
        }
        if (dependencyValues.median !== undefined) {
          summaryStatistics.median = roundForDisplay({
            value: dependencyValues.median,
            dependencyValues,
          });
        }
        if (dependencyValues.quartile3 !== undefined) {
          summaryStatistics.quartile3 = roundForDisplay({
            value: dependencyValues.quartile3,
            dependencyValues,
          });
        }
        if (dependencyValues.maximum !== undefined) {
          summaryStatistics.maximum = roundForDisplay({
            value: dependencyValues.maximum,
            dependencyValues,
          });
        }
        if (dependencyValues.range !== undefined) {
          summaryStatistics.range = roundForDisplay({
            value: dependencyValues.range,
            dependencyValues,
          });
        }
        if (dependencyValues.sum !== undefined) {
          summaryStatistics.sum = roundForDisplay({
            value: dependencyValues.sum,
            dependencyValues,
          });
        }

        return { setValue: { summaryStatistics } };
      },
    };

    return stateVariableDefinitions;
  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible },
    });
    this.coreFunctions.resolveAction({ actionId });
  }
}
