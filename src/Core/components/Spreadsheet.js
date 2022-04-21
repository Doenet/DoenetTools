import { normalizeIndex } from '../utils/table';
import BlockComponent from './abstract/BlockComponent';
import { textToAst } from '../utils/math';
import me from 'math-expressions';
import { HyperFormula } from 'hyperformula';


export default class Spreadsheet extends BlockComponent {
  static componentType = "spreadsheet";

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
      // defaultValue: 1,
      defaultValue: 4,
      public: true,
      forRenderer: true,
    };
    attributes.minNumColumns = {
      createComponentOfType: "number",
      createStateVariable: "minNumColumns",
      // defaultValue: 1,
      defaultValue: 4,
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
    return attributes;
  }


  static returnChildGroups() {

    return [{
      group: "cells",
      componentTypes: ["cell"]
    }, {
      group: "rows",
      componentTypes: ["row"]
    }, {
      group: "columns",
      componentTypes: ["column"]
    }, {
      group: "cellBlocks",
      componentTypes: ["cellBlock"]
    }]

  }


  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.cellNameToRowCol = {
      additionalStateVariablesDefined: ["cellNamesByRowCol"],
      returnDependencies: () => ({
        cellRelatedChildren: {
          dependencyType: "child",
          childGroups: ["cells", "rows", "columns", "cellBlocks"],
          variableNames: [
            "rowNum",
            "colNum",
            "prescribedCellsWithColNum",
            "prescribedCellsWithRowNum",
            "prescribedCellsRowsColumnsBlocks"
          ],
          variablesOptional: true,
        }
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        let result = determineCellMapping({
          cellRelatedChildren: dependencyValues.cellRelatedChildren,
          componentInfoObjects
        })

        return {
          setValue: {
            cellNameToRowCol: result.cellNameToRowCol,
            cellNamesByRowCol: result.cellNamesByRowCol,
          }
        }
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
        cellNamesByRowCol: {
          dependencyType: "stateVariable",
          variableName: "cellNamesByRowCol"
        }
        // rowChildren: {
        //   dependencyType: "child",
        //   childLogicName: "zeroOrMoreRows"
        // }
      }),
      definition({ dependencyValues }) {
        let numRows = dependencyValues.minNumRows;
        if (!Number.isFinite(numRows)) {
          numRows = 4;
        }
        numRows = Math.max(numRows, dependencyValues.cellNamesByRowCol.length);
        // numRows = Math.max(numRows, dependencyValues.rowChildren.length)
        return { setValue: { numRows } }
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
        cellNamesByRowCol: {
          dependencyType: "stateVariable",
          variableName: "cellNamesByRowCol"
        }
        // rowChildren: {
        //   dependencyType: "child",
        //   childLogicName: "zeroOrMoreRows"
        // }
      }),
      definition({ dependencyValues }) {
        let numColumns = dependencyValues.minNumColumns;
        if (!Number.isFinite(numColumns)) {
          numColumns = 4;
        }
        for (let row of dependencyValues.cellNamesByRowCol) {
          if (row) {
            numColumns = Math.max(numColumns, row.length);
          }
        }
        return { setValue: { numColumns } }
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
            height = 40 + dependencyValues.numRows * 23;
          } else {
            height = 132;  // value if numRows = 4
          }
          return { setValue: { height: { size: height, isAbsolute: true } } }
        }

        return { setValue: { height: dependencyValues.heightAttr.stateValues.componentSize } }

      }
    }


    stateVariableDefinitions.cells = {
      public: true,
      componentType: "cell",
      forRenderer: true,
      isArray: true,
      entryPrefixes: ["cell", "row", "column", "range"],
      nDimensions: 2,
      defaultValueByArrayKey: () => "",
      hasEssential: true,
      shadowVariable: true,
      stateVariablesDeterminingDependencies: ["cellNamesByRowCol"],
      // stateVariablesDeterminingDependencies: ["numRows", "numColumns"],
      returnArraySizeDependencies: () => ({
        numRows: {
          dependencyType: "stateVariable",
          variableName: "numRows",
        },
        numColumns: {
          dependencyType: "stateVariable",
          variableName: "numColumns",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numRows, dependencyValues.numColumns];
      },
      returnEntryDimensions: prefix => prefix === "range" ? 2 : 1,
      returnWrappingComponents(prefix) {
        if (prefix === "cell") {
          return [];
        } else if (prefix === "row") {
          return [["row"]];
        } else if (prefix === "column") {
          return [["column"]];
        } else {
          // range or entire array
          return [["row"], ["cellBlock"]]
        }
      },
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "cell") {
          // accept two formats: cellB1 or cell(1,2)
          // (accept letters in second format: (A, 2), (1, B), or (A,B))

          let rowNum, colNum;

          let letterNumStyle = /^([a-zA-Z]+)([1-9]\d*)$/;
          let result = varEnding.match(letterNumStyle);
          if (result) {
            colNum = result[1];
            rowNum = result[2]
          } else {
            let tupleStyle = /^\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\)$/;
            result = varEnding.match(tupleStyle);
            if (result) {
              rowNum = result[1];
              colNum = result[2];
            } else {
              return []; // invalid
            }
          }

          let rowIndex = normalizeIndex(rowNum);
          let colIndex = normalizeIndex(colNum);

          if (!(rowIndex >= 0 && colIndex >= 0)) {
            // invalid index or index out of range
            return [];
          }

          if (arraySize && !(rowIndex < arraySize[0] && colIndex < arraySize[1])) {
            // invalid index or index out of range
            // Note: if don't have array size, assume it is OK,
            // as it corresponds to checking if it is a potential array entry
            return [];
          }

          return [String(rowIndex) + "," + String(colIndex)]

        } else if (arrayEntryPrefix === "row") {
          // row2 or rowB

          let rowIndex = normalizeIndex(varEnding);
          if (!(rowIndex >= 0)) {
            // invalid index
            return [];
          }

          if (!arraySize) {
            // if don't have array size, just return first entry,
            // assuming array size is large enough
            return [String(rowIndex) + ",0"]
          }

          if (!(rowIndex < arraySize[0])) {
            // index out of range
            return [];
          }

          let arrayKeys = [];
          let arrayKeyBegin = String(rowIndex) + ",";
          for (let i = 0; i < arraySize[1]; i++) {
            arrayKeys.push(arrayKeyBegin + i);
          }

          return arrayKeys;

        } else if (arrayEntryPrefix === "column") {
          // column2 or columnB

          let colIndex = normalizeIndex(varEnding);
          if (!(colIndex >= 0)) {
            // invalid index
            return [];
          }

          if (!arraySize) {
            // if don't have array size, just return first entry,
            // assuming array size is large enough
            return ["0," + String(colIndex)];
          }

          if (!(colIndex < arraySize[1])) {
            // index out of range
            return [];
          }

          let arrayKeys = [];
          let arrayKeyEnd = "," + String(colIndex);
          for (let i = 0; i < arraySize[0]; i++) {
            arrayKeys.push(i + arrayKeyEnd);
          }

          return arrayKeys;

        } else {
          // range
          // accept two formats: rangeB1D5 or range((1,2),(5,4))

          let fromRow, fromCol, toRow, toCol;

          let letterNumStyle = /^([a-zA-Z]+)([1-9]\d*)([a-zA-Z]+)([1-9]\d*)$/;
          let result = varEnding.match(letterNumStyle);
          if (result) {
            fromCol = normalizeIndex(result[1]);
            fromRow = normalizeIndex(result[2]);
            toCol = normalizeIndex(result[3]);
            toRow = normalizeIndex(result[4]);
          } else {
            let tupleStyle = /^\(\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\),\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\)\)$/;
            result = varEnding.match(tupleStyle);
            if (result) {
              fromRow = normalizeIndex(result[1]);
              fromCol = normalizeIndex(result[2]);
              toRow = normalizeIndex(result[3]);
              toCol = normalizeIndex(result[4]);
            } else {
              return [];  //invalid
            }
          }


          if (!(fromRow >= 0 && toRow >= 0 && fromCol >= 0 && toCol >= 0)) {
            // invalid range
            return [];
          }

          if (!arraySize) {
            // if don't have array size, just return an entry
            // assuming array size is large enough
            return [String(fromRow) + "," + String(fromCol)]
          }

          let row1 = Math.min(Math.min(fromRow, toRow), arraySize[0] - 1);
          let row2 = Math.min(Math.max(fromRow, toRow), arraySize[0] - 1);
          let col1 = Math.min(Math.min(fromCol, toCol), arraySize[1] - 1);
          let col2 = Math.min(Math.max(fromCol, toCol), arraySize[1] - 1);

          let arrayKeys = [];

          for (let rowIndex = row1; rowIndex <= row2; rowIndex++) {
            let rowKeys = [];
            let arrayKeyBegin = String(rowIndex) + ",";
            for (let colIndex = col1; colIndex <= col2; colIndex++) {
              rowKeys.push(arrayKeyBegin + colIndex);
            }
            arrayKeys.push(rowKeys);
          }

          return arrayKeys;

        }

      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName.slice(0, 3) === "row") {
          let rowNum = varName.slice(3);
          return `cell(${rowNum},${propIndex})`
        }
        if (varName.slice(0, 6) === "column") {
          let columnNum = varName.slice(6);
          return `cell(${propIndex},${columnNum})`
        }
        return null;
      },
      arrayVarNameFromArrayKey(arrayKey) {
        return "cell(" + arrayKey.split(',').map(x => Number(x) + 1).join(',') + ")"
      },
      returnArrayDependenciesByKey({ stateValues, arrayKeys }) {
        let dependenciesByKey = {};
        let cnbrc = stateValues.cellNamesByRowCol;

        for (let arrayKey of arrayKeys) {
          let [rowInd, colInd] = arrayKey.split(',');
          if (cnbrc[rowInd] && cnbrc[rowInd][colInd]) {
            dependenciesByKey[arrayKey] = {
              cellText: {
                dependencyType: "stateVariable",
                componentName: cnbrc[rowInd][colInd],
                variableName: "text",
                variablesOptional: true,
              }
            }
          }
        }
        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        let cells = {};
        let essentialCells = {};

        for (let arrayKey of arrayKeys) {

          if (dependencyValuesByKey[arrayKey].cellText !== undefined) {
            cells[arrayKey] = dependencyValuesByKey[arrayKey].cellText
          } else {
            essentialCells[arrayKey] = true;
          }
        }

        let result = {};

        if (Object.keys(cells).length > 0) {
          result.setValue = { cells }
        }
        if (Object.keys(essentialCells).length > 0) {
          result.useEssentialOrDefaultValue = { cells: essentialCells }
        }

        return result;

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues, dependencyNamesByKey }) {
        // console.log(`inverse definition by key of cells`)
        // console.log(desiredStateVariableValues);

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.cells) {
          if (dependencyNamesByKey[arrayKey].cellText !== undefined) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].cellText,
              desiredValue: desiredStateVariableValues.cells[arrayKey]
            })
          } else {
            let cellText = desiredStateVariableValues.cells[arrayKey];
            instructions.push({
              setEssentialValue: "cells",
              value: { [arrayKey]: cellText === null ? "" : String(cellText) }
            })
          }

        }

        return {
          success: true,
          instructions
        }

      }
    }


    stateVariableDefinitions.evaluatedCells = {
      isArray: true,
      public: true,
      componentType: "cell",
      entryPrefixes: ["evaluatedCell", "evaluatedRow", "evaluatedColumn", "evaluatedRange"],
      nDimensions: 2,
      stateVariablesDeterminingDependencies: ["cellNamesByRowCol"],
      returnArraySizeDependencies: () => ({
        numRows: {
          dependencyType: "stateVariable",
          variableName: "numRows",
        },
        numColumns: {
          dependencyType: "stateVariable",
          variableName: "numColumns",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numRows, dependencyValues.numColumns];
      },
      returnArrayDependenciesByKey: () => ({
        globalDependencies: {
          cells: {
            dependencyType: "stateVariable",
            variableName: "cells"
          }
        }
      }),
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "evaluatedCell") {
          // accept two formats: evaluatedCellB1 or evaluatedCell(1,2)
          // (accept letters in second format: (A, 2), (1, B), or (A,B))

          let rowNum, colNum;

          let letterNumStyle = /^([a-zA-Z]+)([1-9]\d*)$/;
          let result = varEnding.match(letterNumStyle);
          if (result) {
            colNum = result[1];
            rowNum = result[2]
          } else {
            let tupleStyle = /^\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\)$/;
            result = varEnding.match(tupleStyle);
            if (result) {
              rowNum = result[1];
              colNum = result[2];
            } else {
              return []; // invalid
            }
          }

          let rowIndex = normalizeIndex(rowNum);
          let colIndex = normalizeIndex(colNum);

          if (!(rowIndex >= 0 && colIndex >= 0)) {
            // invalid index
            return [];
          }

          if (arraySize && !(rowIndex < arraySize[0] && colIndex < arraySize[1])) {
            // index out of range
            return [];
          }

          return [String(rowIndex) + "," + String(colIndex)]

        } else if (arrayEntryPrefix === "evaluatedRow") {
          // evaluatedRow2 or evaluatedRowB

          let rowIndex = normalizeIndex(varEnding);
          if (!(rowIndex >= 0)) {
            // invalid index
            return [];
          }

          if (!arraySize) {
            // just give the first cell from the row
            return [String(rowIndex) + ",0"]
          }

          if (!(rowIndex < arraySize[0])) {
            // index out of range
            return [];
          }

          let arrayKeys = [];
          let arrayKeyBegin = String(rowIndex) + ",";
          for (let i = 0; i < arraySize[1]; i++) {
            arrayKeys.push(arrayKeyBegin + i);
          }

          return arrayKeys;

        } else if (arrayEntryPrefix === "evaluatedColumn") {
          // evaluatedColumn2 or evaluatedColumnB

          let colIndex = normalizeIndex(varEnding);
          if (!(colIndex >= 0)) {
            // invalid index
            return [];
          }

          if (!arraySize) {
            // just give the first cell of the column
            return ["0," + String(colIndex)]
          }

          if (!(colIndex < arraySize[1])) {
            // index out of range
            return [];
          }

          let arrayKeys = [];
          let arrayKeyEnd = "," + String(colIndex);
          for (let i = 0; i < arraySize[0]; i++) {
            arrayKeys.push(i + arrayKeyEnd);
          }

          return arrayKeys;

        } else {
          // range
          // accept two formats: evaluatedRangeB1D5 or evaluatedRange((1,2),(5,4))

          let fromRow, fromCol, toRow, toCol;

          let letterNumStyle = /^([a-zA-Z]+)([1-9]\d*)([a-zA-Z]+)([1-9]\d*)$/;
          let result = varEnding.match(letterNumStyle);
          if (result) {
            fromCol = normalizeIndex(result[1]);
            fromRow = normalizeIndex(result[2]);
            toCol = normalizeIndex(result[3]);
            toRow = normalizeIndex(result[4]);
          } else {
            let tupleStyle = /^\(\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\),\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\)\)$/;
            result = varEnding.match(tupleStyle);
            if (result) {
              fromRow = normalizeIndex(result[1]);
              fromCol = normalizeIndex(result[2]);
              toRow = normalizeIndex(result[3]);
              toCol = normalizeIndex(result[4]);
            } else {
              return [];  //invalid
            }
          }


          if (!(fromRow >= 0 && toRow >= 0 && fromCol >= 0 && toCol >= 0)) {
            // invalid range
            return [];
          }

          if (!arraySize) {
            // just pick one of the cells
            return [String(fromRow) + "," + String(fromCol)];
          }

          let row1 = Math.min(Math.min(fromRow, toRow), arraySize[0] - 1);
          let row2 = Math.min(Math.max(fromRow, toRow), arraySize[0] - 1);
          let col1 = Math.min(Math.min(fromCol, toCol), arraySize[1] - 1);
          let col2 = Math.min(Math.max(fromCol, toCol), arraySize[1] - 1);

          let arrayKeys = [];

          for (let rowIndex = row1; rowIndex <= row2; rowIndex++) {
            let rowKeys = [];
            let arrayKeyBegin = String(rowIndex) + ",";
            for (let colIndex = col1; colIndex <= col2; colIndex++) {
              rowKeys.push(arrayKeyBegin + colIndex);
            }
            arrayKeys.push(rowKeys);
          }

          return arrayKeys;

        }

      },
      arrayVarNameFromArrayKey(arrayKey) {
        return "evaluatedCell(" + arrayKey.split(',').map(x => Number(x) + 1).join(',') + ")"
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName.slice(0, 12) === "evaluatedRow") {
          let rowNum = varName.slice(12);
          return `evaluatedCell(${rowNum},${propIndex})`
        }
        if (varName.slice(0, 15) === "evaluatedColumn") {
          let columnNum = varName.slice(15);
          return `evaluatedCell(${propIndex},${columnNum})`
        }
        return null;
      },
      arrayDefinitionByKey({ globalDependencyValues }) {

        // console.log(`array definition of evaluatedCells`)
        // console.log(globalDependencyValues)

        let hf = HyperFormula.buildFromArray(globalDependencyValues.cells, { licenseKey: "gpl-v3" });

        let allEvaluated = hf.getSheetValues(0);

        let evaluatedCells = {};

        for (let ind1 in allEvaluated) {
          let row = allEvaluated[ind1];
          for (let ind2 in row) {
            evaluatedCells[[ind1, ind2]] = row[ind2];
          }
        }

        return { setValue: { evaluatedCells } };

      },
      // inverseArrayDefinitionByKey({ desiredStateVariableValues }) {
      //   // console.log(`inverse definition by key of evaluatedCells`)
      //   // console.log(desiredStateVariableValues);

      //   let instructions = [];

      //   for (let arrayKey in desiredStateVariableValues.evaluatedCells) {
      //     instructions.push({
      //       setEssentialValue: "evaluatedCells",
      //       value: { [arrayKey]: desiredStateVariableValues.evaluatedCells[arrayKey] }
      //     })

      //   }

      //   return {
      //     success: true,
      //     instructions
      //   }

      // }
    }

    stateVariableDefinitions.pointsInCells = {
      isArray: true,
      nDimensions: 2,
      public: true,
      componentType: "point",
      entryPrefixes: ["pointsInCell", "pointsInRow", "pointsInColumn", "pointsInRange"],
      returnArraySizeDependencies: () => ({
        numRows: {
          dependencyType: "stateVariable",
          variableName: "numRows",
        },
        numColumns: {
          dependencyType: "stateVariable",
          variableName: "numColumns",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numRows, dependencyValues.numColumns];
      },
      returnEntryDimensions: prefix => prefix === "pointsInRange" ? 2 : 1,
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "pointsInCell") {
          // accept two formats: pointsInCellB1 or pointsInCell(1,2)
          // (accept letters in second format: (A, 2), (1, B), or (A,B))

          let rowNum, colNum;

          let letterNumStyle = /^([a-zA-Z]+)([1-9]\d*)$/;
          let result = varEnding.match(letterNumStyle);
          if (result) {
            colNum = result[1];
            rowNum = result[2]
          } else {
            let tupleStyle = /^\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\)$/;
            result = varEnding.match(tupleStyle);
            if (result) {
              rowNum = result[1];
              colNum = result[2];
            } else {
              return []; // invalid
            }
          }

          let rowIndex = normalizeIndex(rowNum);
          let colIndex = normalizeIndex(colNum);

          if (!(rowIndex >= 0 && colIndex >= 0)) {
            // invalid index
            return [];
          }


          if (arraySize && !(rowIndex < arraySize[0] && colIndex < arraySize[1])) {
            // index out of range
            return [];
          }

          return [String(rowIndex) + "," + String(colIndex)]

        } else if (arrayEntryPrefix === "pointsInRow") {
          // pointsInRow2 or pointsInRowB

          let rowIndex = normalizeIndex(varEnding);
          if (!(rowIndex >= 0)) {
            // invalid index 
            return [];
          }

          if (!arraySize) {
            return [String(rowIndex), ",0"];
          }

          if (!(rowIndex >= 0 && rowIndex < arraySize[0])) {
            // index out of range
            return [];
          }

          let arrayKeys = [];
          let arrayKeyBegin = String(rowIndex) + ",";
          for (let i = 0; i < arraySize[1]; i++) {
            arrayKeys.push(arrayKeyBegin + i);
          }

          return arrayKeys;

        } else if (arrayEntryPrefix === "pointsInColumn") {
          // pointsInColumn2 or pointsInColumnB

          let colIndex = normalizeIndex(varEnding);
          if (!(colIndex >= 0)) {
            // invalid index
            return [];
          }

          if (!arraySize) {
            return ["0," + String(colIndex)];
          }

          if (!(colIndex < arraySize[1])) {
            // index out of range
            return [];
          }

          let arrayKeys = [];
          let arrayKeyEnd = "," + String(colIndex);
          for (let i = 0; i < arraySize[0]; i++) {
            arrayKeys.push(i + arrayKeyEnd);
          }

          return arrayKeys;

        } else {
          // pointsInRange
          // accept two formats: pointsInRangeB1D5 or pointsInRange((1,2),(5,4))

          let fromRow, fromCol, toRow, toCol;

          let letterNumStyle = /^([a-zA-Z]+)([1-9]\d*)([a-zA-Z]+)([1-9]\d*)$/;
          let result = varEnding.match(letterNumStyle);
          if (result) {
            fromCol = normalizeIndex(result[1]);
            fromRow = normalizeIndex(result[2]);
            toCol = normalizeIndex(result[3]);
            toRow = normalizeIndex(result[4]);
          } else {
            let tupleStyle = /^\(\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\),\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\)\)$/;
            result = varEnding.match(tupleStyle);
            if (result) {
              fromRow = normalizeIndex(result[1]);
              fromCol = normalizeIndex(result[2]);
              toRow = normalizeIndex(result[3]);
              toCol = normalizeIndex(result[4]);
            } else {
              return [];  //invalid
            }
          }


          if (!(fromRow >= 0 && toRow >= 0 && fromCol >= 0 && toCol >= 0)) {
            // invalid range
            return [];
          }

          if (!arraySize) {
            // just return on value
            return [String(fromRow) + "," + String(fromCol)]
          }

          let row1 = Math.min(Math.min(fromRow, toRow), arraySize[0] - 1);
          let row2 = Math.min(Math.max(fromRow, toRow), arraySize[0] - 1);
          let col1 = Math.min(Math.min(fromCol, toCol), arraySize[1] - 1);
          let col2 = Math.min(Math.max(fromCol, toCol), arraySize[1] - 1);

          let arrayKeys = [];

          for (let rowIndex = row1; rowIndex <= row2; rowIndex++) {
            let rowKeys = [];
            let arrayKeyBegin = String(rowIndex) + ",";
            for (let colIndex = col1; colIndex <= col2; colIndex++) {
              rowKeys.push(arrayKeyBegin + colIndex);
            }
            arrayKeys.push(rowKeys);
          }

          return arrayKeys;

        }

      },
      arrayVarNameFromArrayKey(arrayKey) {
        return "pointsInCell(" + arrayKey.split(',').map(x => Number(x) + 1).join(',') + ")"
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName.slice(0, 11) === "pointsInRow") {
          let rowNum = varName.slice(11);
          return `pointsInCell(${rowNum},${propIndex})`
        }
        if (varName.slice(0, 14) === "pointsInColumn") {
          let columnNum = varName.slice(14);
          return `pointsInCell(${propIndex},${columnNum})`
        }
        return null;
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = arrayKey.split(',').map(x => Number(x) + 1).join(',');
          dependenciesByKey[arrayKey] = {
            cellText: {
              dependencyType: "stateVariable",
              variableName: `evaluatedCell(${varEnding})`,
              variablesOptional: true,
            }
          }
        }
        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        let pointsInCells = {};

        for (let arrayKey of arrayKeys) {
          let cellText = dependencyValuesByKey[arrayKey].cellText;
          if (!cellText) {
            pointsInCells[arrayKey] = me.fromAst("\uff3f");
            continue;
          }
          let cellME;
          try {
            cellME = me.fromAst(textToAst.convert(cellText));
          } catch (e) {
            pointsInCells[arrayKey] = me.fromAst("\uff3f");
            continue;
          }

          if (Array.isArray(cellME.tree) && (
            cellME.tree[0] === "tuple" || cellME.tree[0] === "vector"
          )) {
            pointsInCells[arrayKey] = cellME;
          } else {
            pointsInCells[arrayKey] = me.fromAst("\uff3f");
          }
        }

        return { setValue: { pointsInCells } }

      },
      // inverseArrayDefinitionByKey({ desiredStateVariableValues, dependencyNamesByKey }) {
      //   // console.log(`inverse definition by key of pointsInCells`)
      //   // console.log(desiredStateVariableValues);

      //   let instructions = [];

      //   for (let arrayKey in desiredStateVariableValues.pointsInCells) {
      //     instructions.push({
      //       setDependency: dependencyNamesByKey[arrayKey].cellText,
      //       desiredValue: desiredStateVariableValues.pointsInCells[arrayKey].toString()
      //     })
      //   }

      //   return {
      //     success: true,
      //     instructions
      //   }

      // }

    }

    return stateVariableDefinitions;

  }


  async onChange({ changes, source, actionId }) {

    if (source !== "loadData") {
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

  actions = {
    onChange: this.onChange.bind(this),
  };



}



function determineCellMapping({ cellRelatedChildren, rowOffset = 0, colOffset = 0,
  cellNameToRowCol = {}, cellNamesByRowCol = [],
  componentInfoObjects
}) {

  var nextCellRowIndex = rowOffset; //CellBlock and Cells
  var nextCellColIndex = colOffset; //CellBlock and Cells
  var nextCellColIndexIfBothUndefined = colOffset; //CellBlock and Cells
  var nextRowComponentRowIndex = rowOffset;
  var nextColComponentColIndex = colOffset;
  var maxRowIndex = rowOffset;
  var maxColIndex = colOffset;
  for (let child of cellRelatedChildren) {
    if (componentInfoObjects.isInheritedComponentType({
      inheritedComponentType: child.componentType,
      baseComponentType: "cell"
    })) {
      let cell = child;
      let rowIndex = normalizeIndex(cell.stateValues.rowNum);
      let colIndex = normalizeIndex(cell.stateValues.colNum);

      if (rowIndex === undefined) {
        rowIndex = nextCellRowIndex;
        if (colIndex === undefined) {
          colIndex = nextCellColIndexIfBothUndefined;
        } else {
          colIndex = colIndex + colOffset;
        }
      } else {
        rowIndex = rowIndex + rowOffset;
        if (colIndex === undefined) {
          colIndex = nextCellColIndex;
        } else {
          colIndex = colIndex + colOffset;
        }
      }

      addCellToMapping({
        cell, rowIndex, colIndex,
        cellNameToRowCol, cellNamesByRowCol
      });

      maxRowIndex = Math.max(rowIndex, maxRowIndex);
      maxColIndex = Math.max(colIndex, maxColIndex);
      nextCellRowIndex = rowIndex;
      nextCellColIndex = colIndex;
      nextCellColIndexIfBothUndefined = colIndex + 1;
    }
    else if (componentInfoObjects.isInheritedComponentType({
      inheritedComponentType: child.componentType,
      baseComponentType: "row"
    })) {
      let row = child;
      let rowIndex = normalizeIndex(row.stateValues.rowNum);
      if (rowIndex === undefined) {
        rowIndex = nextRowComponentRowIndex;
      } else {
        rowIndex = rowIndex + rowOffset;
      }
      let cellChildren = row.stateValues.prescribedCellsWithColNum;
      let nextColIndex = colOffset;
      for (let cell of cellChildren) {
        let colIndex = normalizeIndex(cell.stateValues.colNum);
        if (colIndex === undefined) {
          colIndex = nextColIndex;
        } else {
          colIndex = colIndex + colOffset;
        }
        addCellToMapping({
          cell, rowIndex, colIndex,
          cellNameToRowCol, cellNamesByRowCol
        });
        nextColIndex = colIndex + 1;
        maxRowIndex = Math.max(rowIndex, maxRowIndex);
        maxColIndex = Math.max(colIndex, maxColIndex);
      }
      nextRowComponentRowIndex = rowIndex + 1;
      nextCellRowIndex = rowIndex + 1;
      nextCellColIndex = colOffset;
      nextCellColIndexIfBothUndefined = nextCellColIndex;
    }
    else if (componentInfoObjects.isInheritedComponentType({
      inheritedComponentType: child.componentType,
      baseComponentType: "column"
    })) {
      let col = child;
      let colIndex = normalizeIndex(col.stateValues.colNum);
      if (colIndex === undefined) {
        colIndex = nextColComponentColIndex;
      } else {
        colIndex = colIndex + colOffset;
      }
      let cellChildren = col.stateValues.prescribedCellsWithRowNum;
      let nextRowIndex = rowOffset;
      for (let cell of cellChildren) {
        let rowIndex = normalizeIndex(cell.stateValues.rowNum);
        if (rowIndex === undefined) {
          rowIndex = nextRowIndex;
        } else {
          rowIndex = rowIndex + rowOffset;
        }
        addCellToMapping({
          cell, rowIndex, colIndex,
          cellNameToRowCol, cellNamesByRowCol
        });
        nextRowIndex = rowIndex + 1;
        maxRowIndex = Math.max(rowIndex, maxRowIndex);
        maxColIndex = Math.max(colIndex, maxColIndex);
      }
      nextColComponentColIndex = colIndex + 1;
      nextCellRowIndex = rowOffset;
      nextCellColIndex = colIndex + 1;
      nextCellColIndexIfBothUndefined = nextCellColIndex;
    } else if (componentInfoObjects.isInheritedComponentType({
      inheritedComponentType: child.componentType,
      baseComponentType: "cellBlock"
    })) {
      let cellBlock = child;
      let rowIndex = normalizeIndex(cellBlock.stateValues.rowNum);
      let colIndex = normalizeIndex(cellBlock.stateValues.colNum);

      if (rowIndex === undefined) {
        rowIndex = nextCellRowIndex;
        if (colIndex === undefined) {
          colIndex = nextCellColIndexIfBothUndefined;
        } else {
          colIndex = colIndex + colOffset;
        }
      } else {
        rowIndex = rowIndex + rowOffset;
        if (colIndex === undefined) {
          colIndex = nextCellColIndex;
        } else {
          colIndex = colIndex + colOffset;
        }
      }

      let results = determineCellMapping({
        cellRelatedChildren: cellBlock.stateValues.prescribedCellsRowsColumnsBlocks,
        rowOffset: rowIndex,
        colOffset: colIndex,
        cellNameToRowCol, cellNamesByRowCol, componentInfoObjects
      });
      maxRowIndex = Math.max(results.maxRowIndex, maxRowIndex);
      maxColIndex = Math.max(results.maxColIndex, maxColIndex);
      nextCellRowIndex = rowIndex;
      nextCellColIndex = colIndex;
      nextCellColIndexIfBothUndefined = results.maxColIndex + 1;
    }
  }
  return { maxRowIndex, maxColIndex, cellNameToRowCol, cellNamesByRowCol };
}

function addCellToMapping({ cell, rowIndex, colIndex,
  cellNameToRowCol, cellNamesByRowCol
}) {

  cellNameToRowCol[cell.componentName] = [rowIndex, colIndex];
  if (cellNamesByRowCol[rowIndex] === undefined) {
    cellNamesByRowCol[rowIndex] = [];
  }
  if (cellNamesByRowCol[rowIndex][colIndex] !== undefined) {
    console.warn(`Cell is overwriting previous cell at rowNum=${rowIndex + 1}, colNum=${colIndex + 1}`);
    let previousComponentName = cellNamesByRowCol[rowIndex][colIndex];
    cellNameToRowCol[previousComponentName] = null;
  }
  cellNamesByRowCol[rowIndex][colIndex] = cell.componentName;
}
