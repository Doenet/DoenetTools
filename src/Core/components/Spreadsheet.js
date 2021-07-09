import { normalizeIndex } from '../utils/table';
import BaseComponent from './abstract/BaseComponent';
import { textToAst } from '../utils/math';
import me from 'math-expressions';
import { HyperFormula } from 'hyperformula';


export default class Spreadsheet extends BaseComponent {
  static componentType = "spreadsheet";

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
    return attributes;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let zeroOrMoreCells = childLogic.newLeaf({
      name: "zeroOrMoreCells",
      componentType: 'cell',
      comparison: 'atLeast',
      number: 0,
    });

    let zeroOrMoreRows = childLogic.newLeaf({
      name: "zeroOrMoreRows",
      componentType: 'row',
      comparison: 'atLeast',
      number: 0,
    });

    let zeroOrMoreColumns = childLogic.newLeaf({
      name: "zeroOrMoreColumns",
      componentType: 'column',
      comparison: 'atLeast',
      number: 0,
    });

    let zeroOrMoreCellblocks = childLogic.newLeaf({
      name: "zeroOrMoreCellblocks",
      componentType: 'cellBlock',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "cellsRowsColumnsBlocks",
      operator: 'and',
      propositions: [zeroOrMoreCells, zeroOrMoreRows, zeroOrMoreColumns, zeroOrMoreCellblocks],
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.cellNameToRowCol = {
      additionalStateVariablesDefined: ["cellNamesByRowCol"],
      returnDependencies: () => ({
        cellRelatedChildren: {
          dependencyType: "child",
          childLogicName: "cellsRowsColumnsBlocks",
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
          newValues: {
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


    stateVariableDefinitions.cells = {
      public: true,
      componentType: "cell",
      forRenderer: true,
      isArray: true,
      entryPrefixes: ["cell", "row", "column", "range"],
      nDimensions: 2,
      defaultEntryValue: "",
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

          if (!(rowIndex >= 0 && rowIndex < arraySize[0] && colIndex >= 0 && colIndex < arraySize[1])) {
            // invalid index or index of out range
            return [];
          }

          return [String(rowIndex) + "," + String(colIndex)]

        } else if (arrayEntryPrefix === "row") {
          // row2 or rowB

          let rowIndex = normalizeIndex(varEnding);
          if (!(rowIndex >= 0 && rowIndex < arraySize[0])) {
            // invalid index or index of out range
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
          if (!(colIndex >= 0 && colIndex < arraySize[1])) {
            // invalid index or index of out range
            return [];
          }

          let arrayKeys = [];
          let arrayKeyEnd = "," + String(colIndex);
          for (let i = 0; i < arraySize[1]; i++) {
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
            essentialCells[arrayKey] = {};
          }
        }

        let result = {};

        if (Object.keys(cells).length > 0) {
          result.newValues = { cells }
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
            instructions.push({
              setStateVariable: "cells",
              value: { [arrayKey]: desiredStateVariableValues.cells[arrayKey] }
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
      // entryPrefixes: ["cell", "row", "column", "range"],
      entryPrefixes: ["evaluatedCell"],
      nDimensions: 2,
      defaultEntryValue: null,
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
      arrayDefinitionByKey({ globalDependencyValues }) {

        // console.log(`array definition of evaluatedCells`)
        // console.log(globalDependencyValues)

        let hf = HyperFormula.buildFromArray(globalDependencyValues.cells, { licenseKey: "agpl-v3" });

        let allEvaluated = hf.getSheetValues(0);

        let evaluatedCells = {};

        for (let ind1 in allEvaluated) {
          let row = allEvaluated[ind1];
          for (let ind2 in row) {
            evaluatedCells[[ind1, ind2]] = row[ind2];
          }
        }

        return { newValues: { evaluatedCells } };

      },
      // inverseArrayDefinitionByKey({ desiredStateVariableValues }) {
      //   // console.log(`inverse definition by key of evaluatedCells`)
      //   // console.log(desiredStateVariableValues);

      //   let instructions = [];

      //   for (let arrayKey in desiredStateVariableValues.evaluatedCells) {
      //     instructions.push({
      //       setStateVariable: "evaluatedCells",
      //       value: { [arrayKey]: desiredStateVariableValues.evaluatedCells[arrayKey] }
      //     })

      //   }

      //   return {
      //     success: true,
      //     instructions
      //   }

      // }
    }

    stateVariableDefinitions.pointsByCell = {
      isArray: true,
      nDimensions: 2,
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

      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = arrayKey.split(',').map(x => Number(x) + 1).join('_');
          dependenciesByKey[arrayKey] = {
            cellText: {
              dependencyType: "stateVariable",
              variableName: `evaluatedCell${varEnding}`,
              variablesOptional: true,
            }
          }
        }
        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        let pointsByCell = {};

        for (let arrayKey of arrayKeys) {
          let cellText = dependencyValuesByKey[arrayKey].cellText;
          if (!cellText) {
            pointsByCell[arrayKey] = null;
            continue;
          }
          let cellME;
          try {
            cellME = me.fromAst(textToAst.convert(cellText));
          } catch (e) {
            pointsByCell[arrayKey] = null;
            continue;
          }

          if (Array.isArray(cellME.tree) && (
            cellME.tree[0] === "tuple" || cellME.tree[0] === "vector"
          )) {
            pointsByCell[arrayKey] = cellME;
          } else {
            pointsByCell[arrayKey] = null;
          }
        }

        return { newValues: { pointsByCell } }

      },
      // inverseArrayDefinitionByKey({ desiredStateVariableValues, dependencyNamesByKey }) {
      //   // console.log(`inverse definition by key of pointsByCell`)
      //   // console.log(desiredStateVariableValues);

      //   let instructions = [];

      //   for (let arrayKey in desiredStateVariableValues.pointsByCell) {
      //     instructions.push({
      //       setDependency: dependencyNamesByKey[arrayKey].cellText,
      //       desiredValue: desiredStateVariableValues.pointsByCell[arrayKey].toString()
      //     })
      //   }

      //   return {
      //     success: true,
      //     instructions
      //   }

      // }

    }

    stateVariableDefinitions.cellIndicesOfPoints = {
      additionalStateVariablesDefined: [{
        variableName: "nPointsExtracted",
        componentType: "integer"
      }],
      stateVariablesDeterminingDependencies: ["numRows", "numColumns"],
      returnDependencies({ stateValues }) {

        let dependencies = {
          numRows: {
            dependencyType: "stateVariable",
            variableName: "numRows",
          },
          numColumns: {
            dependencyType: "stateVariable",
            variableName: "numColumns",
          },
        };
        for (let ind1 = 0; ind1 < stateValues.numRows; ind1++) {
          for (let ind2 = 0; ind2 < stateValues.numColumns; ind2++) {
            dependencies[`pointsByCell${ind1}_${ind2}`] = {
              dependencyType: "stateVariable",
              variableName: `pointsByCell${ind1 + 1}_${ind2 + 1}`
            }

          }
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        let cellIndicesOfPoints = [];
        let nPointsExtracted = 0;
        for (let ind1 = 0; ind1 < dependencyValues.numRows; ind1++) {
          for (let ind2 = 0; ind2 < dependencyValues.numColumns; ind2++) {
            if (dependencyValues[`pointsByCell${ind1}_${ind2}`]) {
              cellIndicesOfPoints.push([ind1, ind2]);
              nPointsExtracted++;
            }
          }
        }

        return { newValues: { cellIndicesOfPoints, nPointsExtracted } }
      },
      // inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
      //   console.log(desiredStateVariableValues)
      //   let n = 0;
      //   let instructions = [];
      //   for (let ind1 = 0; ind1 < dependencyValues.numRows; ind1++) {
      //     for (let ind2 = 0; ind2 < dependencyValues.numColumns; ind2++) {
      //       let p = dependencyValues[`pointsByCell${ind1}_${ind2}`];
      //       if (p) {
      //         instructions.push({
      //           setDependency: `pointsByCell${ind1}_${ind2}`,
      //           desiredValue: desiredStateVariableValues.allPoints[n]
      //         })
      //         n++;
      //       }
      //     }
      //   }
      //   return {
      //     success: true,
      //     instructions
      //   }
      // }
    }


    stateVariableDefinitions.extractedPoints = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["extractedPoint"],
      stateVariablesDeterminingDependencies: ["cellIndicesOfPoints"],
      returnArraySizeDependencies: () => ({
        nPointsExtracted: {
          dependencyType: "stateVariable",
          variableName: "nPointsExtracted",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nPointsExtracted];
      },
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let [ind1, ind2] = stateValues.cellIndicesOfPoints[arrayKey]
          dependenciesByKey[arrayKey] = {
            cellPoint: {
              dependencyType: "stateVariable",
              variableName: `pointsByCell${ind1 + 1}_${ind2 + 1}`
            }
          }
        }


        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        let extractedPoints = {};

        for (let arrayKey of arrayKeys) {
          extractedPoints[arrayKey] = dependencyValuesByKey[arrayKey].cellPoint;
        }

        return { newValues: { extractedPoints } }

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues, dependencyNamesByKey }) {
        // console.log(`inverse definition by key of extractedPoints`)
        // console.log(desiredStateVariableValues);

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.extractedPoints) {
          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey].cellPoint,
            desiredValue: desiredStateVariableValues.extractedPoints[arrayKey]
          })
        }

        return {
          success: true,
          instructions
        }

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
