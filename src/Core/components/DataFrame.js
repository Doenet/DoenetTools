import BaseComponent from "./abstract/BaseComponent";

export default class DataFrame extends BaseComponent {
  static componentType = "dataFrame";
  static rendererType = undefined;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.source = {
      createComponentOfType: "text",
      createStateVariable: "source",
      required: true, // not implemented yet
      public: true,
      forRenderer: true,
    };

    attributes.hasHeader = {
      createComponentOfType: "boolean",
      createStateVariable: "hasHeader",
      defaultValue: true,
      public: true,
    };

    attributes.columnTypes = {
      createComponentOfType: "textList",
      createStateVariable: "columnTypesPrelim",
      defaultValue: [],
    };

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.cid = {
      forRenderer: true,

      returnDependencies: () => ({
        source: {
          dependencyType: "stateVariable",
          variableName: "source",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (
          !dependencyValues.source ||
          dependencyValues.source.substring(0, 7).toLowerCase() !== "doenet:"
        ) {
          return {
            setValue: { cid: null },
          };
        }

        let cid = null;

        let result = dependencyValues.source.match(/[:&]cid=([^&]+)/i);
        if (result) {
          cid = result[1];
        }

        return { setValue: { cid } };
      },
    };

    stateVariableDefinitions.dataFrame = {
      stateVariablesDeterminingDependencies: ["cid", "source"],
      additionalStateVariablesDefined: [
        {
          variableName: "numRows",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "integer",
          },
        },
        {
          variableName: "numColumns",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "integer",
          },
        },
        {
          variableName: "columnTypes",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "textList",
          },
        },
        {
          variableName: "columnNames",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "textList",
          },
        },
      ],
      returnDependencies: ({ stateValues }) => ({
        fileContents: {
          dependencyType: "file",
          cid: stateValues.cid,
          uri: stateValues.source,
          fileType: "csv",
        },
        hasHeader: {
          dependencyType: "stateVariable",
          variableName: "hasHeader",
        },
        columnTypesPrelim: {
          dependencyType: "stateVariable",
          variableName: "columnTypesPrelim",
        },
      }),
      definition: function ({ dependencyValues, componentName }) {
        let columnTypes = [],
          columnNames = [];

        let originalData = dependencyValues.fileContents
          .trim()
          .split("\n")
          .map((x) =>
            x
              .trim()
              .split(",")
              .map((y) => y.trim()),
          );

        let numColumns = originalData[0]?.length;

        let foundInconsistentRow = false;
        for (let row of originalData.slice(1)) {
          if (row.length !== numColumns) {
            foundInconsistentRow = true;
            break;
          }
        }

        if (foundInconsistentRow) {
          let warning = {
            message: `Data has invalid shape.  Rows has inconsistent lengths. Found in componentName :${componentName}`,
            level: 1,
          };
          return {
            setValue: {
              dataFrame: null,
              numRows,
              numColumns,
              columnTypes,
              columnNames,
            },
            sendWarnings: [warning],
          };
        }

        // know that all rows have length numColumns
        let dataFrame = {};

        let data = [];

        if (dependencyValues.hasHeader) {
          dataFrame.columnNames = originalData[0].map((value) => {
            if (
              [`"`, `'`].includes(value[0]) &&
              value[value.length - 1] === value[0]
            ) {
              value = value.substring(1, value.length - 1);
            }
            return value;
          });
          data = originalData.slice(1);
        } else {
          dataFrame.columnNames = [...Array(numColumns).keys()].map(
            (x) => `col${x + 1}`,
          );
          data = originalData;
        }

        if (
          [...new Set(dataFrame.columnNames)].length < dataFrame.columnNames
        ) {
          let warning = {
            message: `Data has duplicate column names.  Found in componentName :${componentName}`,
            level: 1,
          };
          return {
            setValue: {
              dataFrame: null,
              numRows,
              numColumns,
              columnTypes,
              columnNames,
            },
            sendWarnings: [warning],
          };
        }

        if (dataFrame.columnNames.includes("")) {
          let warning = {
            message: `Data is missing a column name.  Found in componentName :${componentName}`,
            level: 1,
          };
          return {
            setValue: {
              dataFrame: null,
              numRows,
              numColumns,
              columnTypes,
              columnNames,
            },
            sendWarnings: [warning],
          };
        }

        let numRows = data.length;
        dataFrame.shape = [numRows, numColumns];

        // data is an array of array of strings
        // uses columnType to convert to acceptable format
        // Default columnType is auto

        for (let colInd = 0; colInd < numColumns; colInd++) {
          let prescribedType =
            dependencyValues.columnTypesPrelim[colInd]?.toLowerCase();
          if (!["number", "string"].includes(prescribedType)) {
            prescribedType = "auto";
          }

          if (prescribedType === "auto") {
            // if all values in the column are strings that are numbers,
            // then the column type becomes number
            // otherwise the column type becomes string

            let foundNonNumericValue = false;
            for (let rowInd = 0; rowInd < numRows; rowInd++) {
              let value = data[rowInd][colInd];
              if (value !== "") {
                let numVal = Number(value);
                if (!Number.isFinite(numVal)) {
                  foundNonNumericValue = true;
                  break;
                }
              }
            }
            if (foundNonNumericValue) {
              prescribedType = "string";
            } else {
              prescribedType = "number";
            }
          }

          if (prescribedType === "number") {
            for (let rowInd = 0; rowInd < numRows; rowInd++) {
              let value = data[rowInd][colInd];
              if (value === "") {
                data[rowInd][colInd] = null;
              } else {
                data[rowInd][colInd] = Number(data[rowInd][colInd]);
              }
            }
          } else {
            for (let rowInd = 0; rowInd < numRows; rowInd++) {
              let value = data[rowInd][colInd];
              if (
                [`"`, `'`].includes(value[0]) &&
                value[value.length - 1] === value[0]
              ) {
                value = value.substring(1, value.length - 1);
              }
              data[rowInd][colInd] = value;
            }
          }

          columnTypes.push(prescribedType);
        }

        dataFrame.data = data;
        dataFrame.columnTypes = columnTypes;

        return {
          setValue: {
            dataFrame,
            numRows,
            numColumns,
            columnTypes,
            columnNames: dataFrame.columnNames,
          },
        };
      },
    };

    stateVariableDefinitions.means = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      isArray: true,
      entryPrefixes: ["mean"],
      returnArraySizeDependencies: () => ({
        numColumns: {
          dependencyType: "stateVariable",
          variableName: "numColumns",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numColumns];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          dataFrame: {
            dependencyType: "stateVariable",
            variableName: "dataFrame",
          },
          numColumns: {
            dependencyType: "stateVariable",
            variableName: "numColumns",
          },
          numRows: {
            dependencyType: "stateVariable",
            variableName: "numRows",
          },
          columnTypes: {
            dependencyType: "stateVariable",
            variableName: "columnTypes",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
        let means = {};

        for (let arrayKey of arrayKeys) {
          let theMean = 0;
          let numValues = 0;
          if (globalDependencyValues.columnTypes[arrayKey] === "number") {
            for (
              let rowInd = 0;
              rowInd < globalDependencyValues.numRows;
              rowInd++
            ) {
              let theValue =
                globalDependencyValues.dataFrame.data[rowInd][arrayKey];
              if (theValue !== null) {
                theMean += theValue;
                numValues++;
              }
            }
            theMean /= numValues;
          } else {
            theMean = NaN;
          }

          means[arrayKey] = theMean;
        }

        return { setValue: { means } };
      },
    };

    return stateVariableDefinitions;
  }
}
