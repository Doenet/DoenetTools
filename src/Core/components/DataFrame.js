import BaseComponent from './abstract/BaseComponent';

export default class DataFrame extends BaseComponent {
  static componentType = "dataFrame";
  static rendererType = undefined;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.cid = {
      createComponentOfType: "text",
      createStateVariable: "cid",
      defaultValue: null,
      public: true,
    };

    attributes.hasHeader = {
      createComponentOfType: "boolean",
      createStateVariable: "hasHeader",
      defaultValue: true,
      public: true
    }


    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.dataFrame = {
      stateVariablesDeterminingDependencies: ["cid"],
      returnDependencies: ({ stateValues }) => ({
        fileContents: {
          dependencyType: "file",
          cid: stateValues.cid,
          fileType: "csv"
        },
        hasHeader: {
          dependencyType: "stateVariable",
          variableName: "hasHeader"
        }
      }),
      definition: function ({ dependencyValues, componentName }) {

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
          return { setValue: { dataFrame: null } }
        }

        // know that all rows have length numCols
        let dataFrame = {};

        if(dependencyValues.hasHeader) {
          dataFrame.columns = originalData[0];
          dataFrame.data = originalData.slice(1);
        } else {
          dataFrame.columns = [...Array(numCols).keys()].map(x => `col${x+1}`);
          dataFrame.data = originalData;
        }

        if([...new Set(dataFrame.columns)].length < dataFrame.columns) {
          console.warn(`Data has duplicate column names.  Found in componentName :${componentName}`);
          return { setValue: { dataFrame: null } }
        }

        if(dataFrame.columns.includes("")) {
          console.warn(`Data is missing a column name.  Found in componentName :${componentName}`);
          return { setValue: { dataFrame: null } }
        }

        dataFrame.shape = [dataFrame.data.length, numCols];


        return { setValue: { dataFrame } };
      },

    }



    return stateVariableDefinitions;

  }


}