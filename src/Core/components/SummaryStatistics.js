import BlockComponent from './abstract/BlockComponent';
import me from 'math-expressions';
import { roundForDisplay } from '../utils/math';

export default class SummaryStatistics extends BlockComponent {
  static componentType = "summaryStatistics";

  static acceptTarget = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.column = {
      createComponentOfType: "text",
      createStateVariable: "desiredColumn",
      defaultValue: null,
      public: true,
    }

    attributes.statisticsToDisplay = {
      createComponentOfType: "textList",
      createStateVariable: "statisticsToDisplayPrelim",
      defaultValue: ["all"],
    }

    attributes.byCategoryColumn = {
      createComponentOfType: "text",
      createStateVariable: "byCategoryColumn",
      defaultValue: null,
      public: true
    }

    attributes.displayDigits = {
      createComponentOfType: "integer",
      createStateVariable: "displayDigits",
      defaultValue: 10,
      public: true,
    }
    attributes.displaySmallAsZero = {
      createComponentOfType: "number",
      createStateVariable: "displaySmallAsZero",
      valueForTrue: 1E-14,
      valueForFalse: 0,
      defaultValue: 0,
      public: true,
    }
    attributes.displayDecimals = {
      createComponentOfType: "integer",
      createStateVariable: "displayDecimals",
      defaultValue: null,
      public: true,
    };

    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.statisticsToDisplay = {
      public: true,
      componentType: "textList",
      returnDependencies: () => ({
        statisticsToDisplayPrelim: {
          dependencyType: "stateVariable",
          variableName: "statisticsToDisplayPrelim",
        },
      }),
      definition: function ({ dependencyValues }) {

        let options = ["mean", "stdev", "n", "minimum", "quartile1", "median", "quartile3", "maximum", "sum"];

        let statisticsToDisplay = [];

        let desiredStats = dependencyValues.statisticsToDisplayPrelim.map(x => x.toLowerCase());

        if (desiredStats.includes("all")) {
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

    stateVariableDefinitions.dataColumn = {
      additionalStateVariablesDefined: [{
        variableName: "columnName",
        public: true,
        componentType: "text",
         forRenderer: true, 
      }],
      returnDependencies() {
        return {
          targetComponent: {
            dependencyType: "targetComponent",
            variableNames: ["dataFrame"],
            variablesOptional: true
          },
          desiredColumn: {
            dependencyType: "stateVariable",
            variableName: "desiredColumn"
          }

        }
      },
      definition: function ({ dependencyValues }) {

        console.log('definition of dataColumn', dependencyValues)

        let dataColumn = null, columnName=null;
        if (dependencyValues.targetComponent?.stateValues.dataFrame) {
          let dataFrame = dependencyValues.targetComponent.stateValues.dataFrame;
          let colInd = dataFrame.columns.indexOf(dependencyValues.desiredColumn);
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
          setValue: { dataColumn, columnName }
        }
      },
    };

    stateVariableDefinitions.n = {
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn"
        }
      }),
      definition({ dependencyValues }) {

        let n = null;
        if (dependencyValues.dataColumn) {
          n = dependencyValues.dataColumn.length;
        }

        return { setValue: { n } }

      }
    }

    stateVariableDefinitions.sum = {
      public: true,
      componentType: "number",
      stateVariablesPrescribingAdditionalAttributes: {
        displayDigits: "displayDigits",
        displayDecimals: "displayDecimals",
        displaySmallAsZero: "displaySmallAsZero",
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn"
        }
      }),
      definition({ dependencyValues }) {
        let sum = null;
        if (dependencyValues.dataColumn) {
          sum = dependencyValues.dataColumn.reduce((a, c) => a + c);
        }

        return { setValue: { sum } }
      }
    }

    stateVariableDefinitions.mean = {
      public: true,
      componentType: "number",
      stateVariablesPrescribingAdditionalAttributes: {
        displayDigits: "displayDigits",
        displayDecimals: "displayDecimals",
        displaySmallAsZero: "displaySmallAsZero",
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn"
        }
      }),
      definition({ dependencyValues }) {
        let mean = null;
        if (dependencyValues.dataColumn !== null) {
          mean = me.math.mean(dependencyValues.dataColumn)
        }
        return { setValue: { mean } }
      }
    }


    stateVariableDefinitions.stdev = {
      public: true,
      componentType: "number",
      stateVariablesPrescribingAdditionalAttributes: {
        displayDigits: "displayDigits",
        displayDecimals: "displayDecimals",
        displaySmallAsZero: "displaySmallAsZero",
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn"
        },
      }),
      definition({ dependencyValues }) {
        let stdev = null;
        if (dependencyValues.dataColumn) {
          stdev = me.math.std(dependencyValues.dataColumn)
        }

        return { setValue: { stdev } };
      }
    }


    stateVariableDefinitions.minimum = {
      public: true,
      componentType: "number",
      stateVariablesPrescribingAdditionalAttributes: {
        displayDigits: "displayDigits",
        displayDecimals: "displayDecimals",
        displaySmallAsZero: "displaySmallAsZero",
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn"
        },
      }),
      definition({ dependencyValues }) {
        let minimum = null;
        if (dependencyValues.dataColumn) {
          minimum = Math.min(...dependencyValues.dataColumn);
        }
        return { setValue: { minimum } };
      }
    }


    stateVariableDefinitions.maximum = {
      public: true,
      componentType: "number",
      stateVariablesPrescribingAdditionalAttributes: {
        displayDigits: "displayDigits",
        displayDecimals: "displayDecimals",
        displaySmallAsZero: "displaySmallAsZero",
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn"
        },
      }),
      definition({ dependencyValues }) {
        let maximum = null;
        if (dependencyValues.dataColumn) {
          maximum = Math.max(...dependencyValues.dataColumn);
        }
        return { setValue: { maximum } };
      }
    }

    stateVariableDefinitions.median = {
      public: true,
      componentType: "number",
      stateVariablesPrescribingAdditionalAttributes: {
        displayDigits: "displayDigits",
        displayDecimals: "displayDecimals",
        displaySmallAsZero: "displaySmallAsZero",
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn"
        },
      }),
      definition({ dependencyValues }) {
        let median = null;
        if (dependencyValues.dataColumn) {
          median = me.math.median(dependencyValues.dataColumn);
        }
        return { setValue: { median } };
      }
    }

    stateVariableDefinitions.quartile1 = {
      public: true,
      componentType: "number",
      stateVariablesPrescribingAdditionalAttributes: {
        displayDigits: "displayDigits",
        displayDecimals: "displayDecimals",
        displaySmallAsZero: "displaySmallAsZero",
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn"
        },
      }),
      definition({ dependencyValues }) {
        let quartile1 = null;
        if (dependencyValues.dataColumn) {
          quartile1 = me.math.quantileSeq(dependencyValues.dataColumn, 0.25);
        }
        return { setValue: { quartile1 } };
      }
    }

    stateVariableDefinitions.quartile3 = {
      public: true,
      componentType: "number",
      stateVariablesPrescribingAdditionalAttributes: {
        displayDigits: "displayDigits",
        displayDecimals: "displayDecimals",
        displaySmallAsZero: "displaySmallAsZero",
      },
      returnDependencies: () => ({
        dataColumn: {
          dependencyType: "stateVariable",
          variableName: "dataColumn"
        },
      }),
      definition({ dependencyValues }) {
        let quartile3 = null;
        if (dependencyValues.dataColumn) {
          quartile3 = me.math.quantileSeq(dependencyValues.dataColumn, 0.75);
        }
        return { setValue: { quartile3 } };
      }
    }

    stateVariableDefinitions.summaryStatistics = {
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["statisticsToDisplay"],
      returnDependencies({ stateValues }) {

        let dependencies = {
          displayDigits: {
            dependencyType: "stateVariable",
            variableName: "displayDigits"
          },
          displayDecimals: {
            dependencyType: "stateVariable",
            variableName: "displayDecimals"
          },
          displaySmallAsZero: {
            dependencyType: "stateVariable",
            variableName: "displaySmallAsZero"
          },
        };

        if (stateValues.statisticsToDisplay.includes("mean")) {
          dependencies.mean = {
            dependencyType: "stateVariable",
            variableName: "mean"
          }
        }
        if (stateValues.statisticsToDisplay.includes("stdev")) {
          dependencies.stdev = {
            dependencyType: "stateVariable",
            variableName: "stdev"
          }
        }
        if (stateValues.statisticsToDisplay.includes("n")) {
          dependencies.n = {
            dependencyType: "stateVariable",
            variableName: "n"
          }
        }
        if (stateValues.statisticsToDisplay.includes("minimum")) {
          dependencies.minimum = {
            dependencyType: "stateVariable",
            variableName: "minimum"
          }
        }
        if (stateValues.statisticsToDisplay.includes("quartile1")) {
          dependencies.quartile1 = {
            dependencyType: "stateVariable",
            variableName: "quartile1"
          }
        }
        if (stateValues.statisticsToDisplay.includes("median")) {
          dependencies.median = {
            dependencyType: "stateVariable",
            variableName: "median"
          }
        }
        if (stateValues.statisticsToDisplay.includes("quartile3")) {
          dependencies.quartile3 = {
            dependencyType: "stateVariable",
            variableName: "quartile3"
          }
        }
        if (stateValues.statisticsToDisplay.includes("maximum")) {
          dependencies.maximum = {
            dependencyType: "stateVariable",
            variableName: "maximum"
          }
        }

        return dependencies;

      },
      definition({ dependencyValues, usedDefault }) {
        let summaryStatistics = {};

        if (dependencyValues.mean !== undefined) {
          summaryStatistics.mean = roundForDisplay({
            value: dependencyValues.mean,
            dependencyValues, usedDefault
          });
        }
        if (dependencyValues.stdev !== undefined) {
          summaryStatistics.stdev = roundForDisplay({
            value: dependencyValues.stdev,
            dependencyValues, usedDefault
          });
        }
        if (dependencyValues.n !== undefined) {
          summaryStatistics.n = roundForDisplay({
            value: dependencyValues.n,
            dependencyValues, usedDefault
          });
        }
        if (dependencyValues.minimum !== undefined) {
          summaryStatistics.minimum = roundForDisplay({
            value: dependencyValues.minimum,
            dependencyValues, usedDefault
          });
        }
        if (dependencyValues.quartile1 !== undefined) {
          summaryStatistics.quartile1 = roundForDisplay({
            value: dependencyValues.quartile1,
            dependencyValues, usedDefault
          });
        }
        if (dependencyValues.median !== undefined) {
          summaryStatistics.median = roundForDisplay({
            value: dependencyValues.median,
            dependencyValues, usedDefault
          });
        }
        if (dependencyValues.quartile3 !== undefined) {
          summaryStatistics.quartile3 = roundForDisplay({
            value: dependencyValues.quartile3,
            dependencyValues, usedDefault
          });
        }
        if (dependencyValues.maximum !== undefined) {
          summaryStatistics.maximum = roundForDisplay({
            value: dependencyValues.maximum,
            dependencyValues, usedDefault
          });
        }

        return { setValue: { summaryStatistics } };

      }

    }


    return stateVariableDefinitions;

  }


}