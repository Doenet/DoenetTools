import { roundForDisplay } from '../utils/math';
import BaseComponent from './abstract/BaseComponent';


export default class DiscreteSimulationResultList extends BaseComponent {
  static componentType = "DiscreteSimulationResultList";
  static rendererType = "spreadsheet";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["cells", "height"] };

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.width = {
      createComponentOfType: "_componentSize",
      createStateVariable: "width",
      defaultValue: { size: 100, isAbsolute: false },
      public: true,
      forRenderer: true,
    };
    attributes.minNumRows = {
      createComponentOfType: "number",
      createStateVariable: "minNumRows",
      defaultValue: 1,
      public: true,
      forRenderer: true,
    };
    attributes.minNumColumns = {
      createComponentOfType: "number",
      createStateVariable: "minNumColumns",
      defaultValue: 1,
      public: true,
      forRenderer: true,
    };
    attributes.height = {
      createComponentOfType: "_componentSize",
    }

    attributes.columnHeaders = {
      createComponentOfType: "boolean",
      createStateVariable: "columnHeaders",
      defaultValue: true,
      public: true,
      forRenderer: true
    }
    attributes.rowHeaders = {
      createComponentOfType: "boolean",
      createStateVariable: "rowHeaders",
      defaultValue: true,
      public: true,
      forRenderer: true
    }
    attributes.fixedRowsTop = {
      createComponentOfType: "integer",
      createStateVariable: "fixedRowsTop",
      defaultValue: 0,
      clamp: [0, Infinity],
      public: true,
      forRenderer: true,
    };
    attributes.fixedColumnsLeft = {
      createComponentOfType: "integer",
      createStateVariable: "fixedColumnsLeft",
      defaultValue: 0,
      clamp: [0, Infinity],
      public: true,
      forRenderer: true,
    };
    attributes.allIterates = {
      createComponentOfType: "mathList",
      createStateVariable: "allIterates",
      defaultValue: [],
    }
    attributes.headerRow = {
      createComponentOfType: "textList",
      createStateVariable: "headerRow",
      defaultValue: null,
    }


    attributes.displayDigits = {
      createComponentOfType: "integer",
      createStateVariable: "displayDigits",
      defaultValue: 10,
      public: true,
    };
    attributes.displayDecimals = {
      createComponentOfType: "integer",
      createStateVariable: "displayDecimals",
      defaultValue: null,
      public: true,
    };
    attributes.displaySmallAsZero = {
      createComponentOfType: "number",
      createStateVariable: "displaySmallAsZero",
      valueForTrue: 1E-14,
      valueForFalse: 0,
      defaultValue: 0,
      public: true,
    };
    
    return attributes;
  }



  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.cells = {
      forRenderer: true,
      returnDependencies: () => ({
        allIterates: {
          dependencyType: "stateVariable",
          variableName: "allIterates"
        },
        headerRow: {
          dependencyType: "stateVariable",
          variableName: "headerRow"
        },
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
        }
      }),
      definition({ dependencyValues, usedDefault }) {
        let cells = [];

        let nComponents = 0;

        if (dependencyValues.allIterates.length > 0 &&
          Array.isArray(dependencyValues.allIterates[0].tree) &&
          ["vector", "tuple"].includes(dependencyValues.allIterates[0].tree[0])
        ) {
          nComponents = dependencyValues.allIterates[0].tree.length - 1;
        }

        if(dependencyValues.headerRow) {
          let headerRow = [];
          let headerLen = Math.min(dependencyValues.headerRow.length, nComponents+1);
          for(let comp =0; comp < headerLen; comp++) {
            headerRow.push(dependencyValues.headerRow[comp]);
          }
          cells.push(headerRow)
        }


        for (let [ind, iter] of dependencyValues.allIterates.entries()) {
          let cell = [ind.toString()];
          for(let comp =0; comp < nComponents; comp++) {
            let rounded = roundForDisplay({
              value: iter.get_component(comp),
              dependencyValues, usedDefault
            });
            cell.push(rounded.toString());
          }
          cells.push(cell)
        }

        return {newValues: {cells}};
      }
    }



    stateVariableDefinitions.numRows = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        minNumRows: {
          dependencyType: "stateVariable",
          variableName: "minNumRows"
        },
        cells: {
          dependencyType: "stateVariable",
          variableName: "cells"
        }
      }),
      definition({ dependencyValues }) {
        let numRows = dependencyValues.minNumRows;
        if (!Number.isFinite(numRows)) {
          numRows = 4;
        }
        numRows = Math.max(numRows, dependencyValues.cells.length);
        return { newValues: { numRows } }
      }
    }

    stateVariableDefinitions.numColumns = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        minNumColumns: {
          dependencyType: "stateVariable",
          variableName: "minNumColumns"
        },
        cells: {
          dependencyType: "stateVariable",
          variableName: "cells"
        }
      }),
      definition({ dependencyValues }) {
        let numColumns = dependencyValues.minNumColumns;
        if (!Number.isFinite(numColumns)) {
          numColumns = 4;
        }
        for (let row of dependencyValues.cells) {
          if (row) {
            numColumns = Math.max(numColumns, row.length);
          }
        }
        return { newValues: { numColumns } }
      }
    }


    stateVariableDefinitions.height = {
      public: true,
      componentType: "_componentSize",
      forRenderer: true,
      returnDependencies: () => ({
        heightAttr: {
          dependencyType: "attributeComponent",
          attributeName: "height",
          variableNames: ["componentSize"]
        },
        numRows: {
          dependencyType: "stateVariable",
          variableName: "numRows"
        }
      }),
      definition({ dependencyValues }) {

        if (dependencyValues.heightAttr === null) {
          // TODO: is this what we want for default height?
          // Do we want to cap default at a maximum?
          let height;
          if (Number.isFinite(dependencyValues.numRows) && dependencyValues.numRows >= 0) {
            height = 50 + dependencyValues.numRows * 20;
          } else {
            height = 130;  // value if numRows = 4
          }
          return { newValues: { height: { size: height, isAbsolute: true } } }
        }

        return { newValues: { height: dependencyValues.heightAttr.stateValues.componentSize } }

      }
    }


    return stateVariableDefinitions;

  }


  onChange(changes, source) {

    if (source !== "loadData") {
      let cellChanges = {};
      for (let change of changes) {
        let [row, col, prev, value] = change;
        cellChanges[[row, col]] = value === null ? "" : value;
      }

      this.coreFunctions.requestUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "cells",
          value: cellChanges,
        }],
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: cellChanges
        }
      })
    }


  }

  actions = {
    onChange: this.onChange.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
    // finalizePointPosition: this.finalizePointPosition.bind(
    //   new Proxy(this, this.readOnlyProxyHandler)
    // )
  };



}

