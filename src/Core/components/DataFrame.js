import BaseComponent from './abstract/BaseComponent';

export default class DataFrame extends BaseComponent {
  static componentType = "dataFrame";
  static rendererType = undefined;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.source = {
      createComponentOfType: "text",
      createStateVariable: "source",
      required: true,  // not implemented yet
      public: true,
      forRenderer: true,
    };

    attributes.hasHeader = {
      createComponentOfType: "boolean",
      createStateVariable: "hasHeader",
      defaultValue: true,
      public: true
    }


    attributes.colTypes = {
      createComponentOfType: "textList",
      createStateVariable: "colTypesPrelim",
      defaultValue: [],
    }

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
        if (!dependencyValues.source ||
          dependencyValues.source.substring(0, 7).toLowerCase() !== "doenet:"
        ) {
          return {
            setValue: { cid: null }
          }
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
      stateVariablesDeterminingDependencies: ["cid"],
      additionalStateVariablesDefined: [
        {
          variableName: "numRows",
          public: true,
          componentType: "integer"
        }, {
          variableName: "numCols",
          public: true,
          componentType: "integer"
        }, {
          variableName: "colTypes",
          public: true,
          componentType: "textList"
        }],
      returnDependencies: ({ stateValues }) => ({
        fileContents: {
          dependencyType: "file",
          cid: stateValues.cid,
          fileType: "csv"
        },
        hasHeader: {
          dependencyType: "stateVariable",
          variableName: "hasHeader"
        },
        colTypesPrelim: {
          dependencyType: "stateVariable",
          variableName: "colTypesPrelim"
        },

      }),
      definition: function ({ dependencyValues, componentName }) {

        let colTypes = [];

        let originalData = dependencyValues.fileContents.trim().split("\n")
          .map(x => x.split(","))

        let numCols = originalData[0]?.length;

        let foundInconsistentRow = false;
        for (let row of originalData.slice(1)) {
          if (row.length !== numCols) {
            foundInconsistentRow = true;
            break;
          }
        }

        if (foundInconsistentRow) {
          console.warn(`Data has invalid shape.  Rows has inconsistent lengths. Found in componentName :${componentName}`);
          return { setValue: { dataFrame: null, numRows, numCols, colTypes } }
        }

        // know that all rows have length numCols
        let dataFrame = {};

        let data = [];

        if (dependencyValues.hasHeader) {
          dataFrame.columns = originalData[0];
          data = originalData.slice(1);
        } else {
          dataFrame.columns = [...Array(numCols).keys()].map(x => `col${x + 1}`);
          data = originalData;
        }

        if ([...new Set(dataFrame.columns)].length < dataFrame.columns) {
          console.warn(`Data has duplicate column names.  Found in componentName :${componentName}`);
          return { setValue: { dataFrame: null, numRows, numCols, colTypes } }
        }

        if (dataFrame.columns.includes("")) {
          console.warn(`Data is missing a column name.  Found in componentName :${componentName}`);
          return { setValue: { dataFrame: null, numRows, numCols, colTypes } }
        }

        let numRows = data.length;
        dataFrame.shape = [numRows, numCols];



        // data is an array of array of strings
        // uses colType to convert to acceptable format
        // Default colType is auto


        for (let colInd = 0; colInd < numCols; colInd++) {
          let prescribedType = dependencyValues.colTypesPrelim[colInd].toLowerCase();
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
              prescribedType = "string"
            } else {
              prescribedType = "number"
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
              if([`"`,`'`].includes(value[0]) && value[value.length-1]===value[0]) {
                value = value.substring(1,value.length-1);
                data[rowInd][colInd] = value;
              }
              
            }
          }

          colTypes.push(prescribedType);

        }


        dataFrame.data = data;

        return { setValue: { dataFrame, numRows, numCols, colTypes } };
      },

    }

    stateVariableDefinitions.means = {
      public: true,
      componentType: "number",
      isArray: true,
      entryPrefixes: ["mean"],
      returnArraySizeDependencies: () => ({
        numCols: {
          dependencyType: "stateVariable",
          variableName: "numCols",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numCols];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          dataFrame: {
            dependencyType: "stateVariable",
            variableName: "dataFrame",
          },
          numCols: {
            dependencyType: "stateVariable",
            variableName: "numCols"
          },
          numRows: {
            dependencyType: "stateVariable",
            variableName: "numRows",
          },
          colTypes: {
            dependencyType: "stateVariable",
            variableName: "colTypes",
          }
        };

        return { globalDependencies }

      },
      arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {

        let means = {};

        for (let arrayKey of arrayKeys) {
          let theMean = 0;
          let numValues = 0;
          if (globalDependencyValues.colTypes[arrayKey] === "number") {
            for (let rowInd = 0; rowInd < globalDependencyValues.numRows; rowInd++) {
              let theValue = globalDependencyValues.dataFrame.data[rowInd][arrayKey];
              if (theValue !== null) {
                theMean += theValue;
                numValues++;
              }
            }
            theMean /= numValues
          } else {
            theMean = NaN;
          }

          means[arrayKey] = theMean;
        }


        return { setValue: { means } }


      }
    }


    return stateVariableDefinitions;

  }


}