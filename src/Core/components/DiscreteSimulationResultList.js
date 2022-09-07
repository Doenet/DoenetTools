import { roundForDisplay } from '../utils/math';
import BlockComponent from './abstract/BlockComponent';


export default class DiscreteSimulationResultList extends BlockComponent {
  static componentType = "DiscreteSimulationResultList";
  static rendererType = "spreadsheet";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
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
    attributes.hiddenColumns = {
      createComponentOfType: "numberList",
      createStateVariable: "hiddenColumns",
      defaultValue: [],
      public: true,
      forRenderer: true,
    };
    attributes.hiddenRows = {
      createComponentOfType: "numberList",
      createStateVariable: "hiddenRows",
      defaultValue: [],
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

    stateVariableDefinitions.displayDigits = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      hasEssential: true,
      defaultValue: 10,
      returnDependencies: () => ({
        displayDigitsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDigits",
          variableNames: ["value"]
        },
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        },
      }),
      definition({ dependencyValues, usedDefault }) {

        if (dependencyValues.displayDigitsAttr !== null) {

          let displayDigitsAttrUsedDefault = dependencyValues.displayDigitsAttr === null || usedDefault.displayDigitsAttr;
          let displayDecimalsAttrUsedDefault = dependencyValues.displayDecimalsAttr === null || usedDefault.displayDecimalsAttr;

          if (!(displayDigitsAttrUsedDefault || displayDecimalsAttrUsedDefault)) {
            // if both display digits and display decimals did not used default
            // we'll regard display digits as using default if it comes from a deeper shadow
            let shadowDepthDisplayDigits = dependencyValues.displayDigitsAttr.shadowDepth;
            let shadowDepthDisplayDecimals = dependencyValues.displayDecimalsAttr.shadowDepth;

            if (shadowDepthDisplayDecimals < shadowDepthDisplayDigits) {
              displayDigitsAttrUsedDefault = true;
            }
          }

          if (displayDigitsAttrUsedDefault) {
            return { useEssentialOrDefaultValue: { displayDigits: { defaultValue: dependencyValues.displayDigitsAttr.stateValues.value } } }
          } else {
            return {
              setValue: {
                displayDigits: dependencyValues.displayDigitsAttr.stateValues.value
              }
            }
          }
        }

        return { useEssentialOrDefaultValue: { displayDigits: true } }

      }
    }

    stateVariableDefinitions.cells = {
      forRenderer: true,
      shadowVariable: true,
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

        let nComponents = 1;
        let haveVector = false;

        if (dependencyValues.allIterates.length > 0 &&
          Array.isArray(dependencyValues.allIterates[0].tree) &&
          ["vector", "tuple"].includes(dependencyValues.allIterates[0].tree[0])
        ) {
          nComponents = dependencyValues.allIterates[0].tree.length - 1;
          haveVector = true;
        }

        if (dependencyValues.headerRow) {
          let headerRow = [];
          let headerLen = Math.min(dependencyValues.headerRow.length, nComponents + 1);
          for (let comp = 0; comp < headerLen; comp++) {
            headerRow.push(dependencyValues.headerRow[comp]);
          }
          cells.push(headerRow)
        }


        for (let [ind, iter] of dependencyValues.allIterates.entries()) {
          let cell = [ind.toString()];
          for (let comp = 0; comp < nComponents; comp++) {
            let val = iter;
            if (haveVector) {
              val = val.get_component(comp);
            }
            let rounded = roundForDisplay({
              value: val,
              dependencyValues, usedDefault
            });
            // catch exceptions until math-expressions can handle
            // complex numbers
            try {
              cell.push(rounded.toString());
            } catch (e) {
              cell.push("");
            }
          }
          cells.push(cell)
        }

        return { setValue: { cells } };
      }
    }



    stateVariableDefinitions.numRows = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
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
        return { setValue: { numRows } }
      }
    }

    stateVariableDefinitions.numColumns = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
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
        return { setValue: { numColumns } }
      }
    }


    stateVariableDefinitions.height = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "_componentSize",
      },
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
          return { setValue: { height: { size: height, isAbsolute: true } } }
        }

        return { setValue: { height: dependencyValues.heightAttr.stateValues.componentSize } }

      }
    }


    return stateVariableDefinitions;

  }


  async onChange({ changes, source, actionId, }) {

    if (source === "edit") {
      let cellChanges = {};
      for (let change of changes) {
        let [row, col, prev, value] = change;
        cellChanges[[row, col]] = value === null ? "" : value;
      }

      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "cells",
          value: cellChanges,
        }],
        actionId,
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: cellChanges
        }
      })
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }


  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible }
    })
    this.coreFunctions.resolveAction({ actionId });
  }

  actions = {
    onChange: this.onChange.bind(this),
    recordVisibilityChange: this.recordVisibilityChange.bind(this),
  };


}

