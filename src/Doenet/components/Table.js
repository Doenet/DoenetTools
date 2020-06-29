import BaseComponent from './abstract/BaseComponent';
import me from 'math-expressions';
import { normalizeIndex } from "../utils/table";

export default class Table extends BaseComponent {
  static componentType = "table";
  static rendererType = "table";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.width = { default: '400px' };
    properties.minNumRows = { default: 4 };
    properties.minNumColumns = { default: 4 };

    properties.height = {
      forRenderer: true,
      dependentStateVariables: [{
        dependencyName: "numRows",
        variableName: "numRows"
      }],
      definitionForPropertyValue({ dependencyValues, propertyChild }) {

        if (propertyChild.length === 0) {
          // TODO: is this what we want for default height?
          // Do we want to cap default at a maximum?
          let height;
          if (Number.isFinite(dependencyValues.numRows) && dependencyValues.numRows >= 0) {
            height = 50 + dependencyValues.numRows * 20;
          } else {
            height = 130;  // value if numRows = 4
          }
          return { newValues: { height } }
        }

        return { newValues: { height: propertyChild[0].stateValues.value } }

      }
    }

    return properties;
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
      componentType: 'cellblock',
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
          dependencyType: "childStateVariables",
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
        let result = determingCellMapping({
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
      }),
      definition({ dependencyValues }) {
        let numRows = dependencyValues.minNumRows;
        if (!Number.isFinite(numRows)) {
          numRows = 4;
        }
        numRows = Math.max(numRows, dependencyValues.cellNamesByRowCol.length);
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

    stateVariableDefinitions.cells = {
      public: true,
      componentType: "cell",
      isArray: true,
      entryPrefixes: ["cell"],
      nDimensions: 2,
      containsComponentNamesToCopy: true,
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding }) {
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
            }
          }

          if (!result) {
            return // invalid
          }

          return [String(normalizeIndex(rowNum)) + "," + String(normalizeIndex(colNum))]

        }

      },
      arrayVarNameFromArrayKey(arrayKey) {
        return "cell(" + arrayKey.split(',').map(x => Number(x) + 1).join(',') + ")"
      },
      allVarNamesThatIncludeArrayKey(arrayKey) {
        return ["cell(" + arrayKey.split(',').map(x => Number(x) + 1).join(',') + ")"]
      },
      returnDependencies: () => ({
        cellNamesByRowCol: {
          dependencyType: "stateVariable",
          variableName: "cellNamesByRowCol",
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            cells: dependencyValues.cellNamesByRowCol
          }
        }
      }
    }

    stateVariableDefinitions.childrenToRender = {
      additionalStateVariablesDefined: [{
        variableName: "renderedChildNumberByRowCol",
        forRenderer: true
      }],
      returnDependencies: () => ({
        cellNamesByRowCol: {
          dependencyType: "stateVariable",
          variableName: "cellNamesByRowCol"
        },
        numRows: {
          dependencyType: "stateVariable",
          variableName: "numRows"
        },
        numColumns: {
          dependencyType: "stateVariable",
          variableName: "numColumns"
        },

      }),
      definition: function ({ dependencyValues }) {
        let childrenToRender = [];
        let renderedChildNumberByRowCol = [];
        let numChildrenFound = 0;
        for (let rowInd = 0; rowInd < dependencyValues.numRows; rowInd++) {

          let cellRow = dependencyValues.cellNamesByRowCol[rowInd];
          let childNumberRow = [];
          if (cellRow) {
            for (let cellName of cellRow) {
              if (cellName) {
                childrenToRender.push(cellName);
                childNumberRow.push(numChildrenFound);
                numChildrenFound += 1;
              } else {
                childNumberRow.push(null);
              }
            }
            childNumberRow.push(...Array(dependencyValues.numColumns - cellRow.length).fill(null));
          } else {
            childNumberRow = Array(dependencyValues.numColumns).fill(null);
          }
          renderedChildNumberByRowCol.push(childNumberRow)

        }
        return { newValues: { childrenToRender, renderedChildNumberByRowCol } };
      }
    }

    return stateVariableDefinitions;

  }

  updateState(args = {}) {
    if (args.init === true) {

      // Note: in cell state variable we store only a text representation of cell
      // more complex representations (such as with refs) requires cell children

      this.makePublicStateVariableArray({
        variableName: "cells",
        componentType: "cell",
        stateVariableForRef: "text",
        validateParameters: validateTableParameters,
        returnSerializedComponents: returnTableSerializedComponents,
        nDimensions: 2,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "cell",
        arrayVariableName: "cells",
        getSugarReplacement: getCellSugarReplacement,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "row",
        arrayVariableName: "cells",
        getSugarReplacement: getRowSugarReplacement,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "column",
        arrayVariableName: "cells",
        getSugarReplacement: getColumnSugarReplacement,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "range",
        arrayVariableName: "cells",
        getSugarReplacement: getRangeSugarReplacement,
      });
      this._state.pointsFoundInCells = {}
      this._state.pointsFoundInCells.trackChanges = true;
      this.getCellPoints = this.getCellPoints.bind(this);
      this._state.points = {};

      // using proxy rather than defineProperty
      // as this is used as a target of another proxy (for arrayComponents)
      // and defineProperty as a proxy target doesn't seem to update
      // TODO: is this the right way to accomplish this?
      this._state.points.value = new Proxy({},
        { get: this.getCellPoints, set: _ => false });

      // Object.defineProperty(this._state.points, 'value', { get: this.getCellPoints });

      this.makePublicStateVariableArray({
        variableName: "points",
        componentType: "point",
        stateVariableForRef: "coords",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "point",
        arrayVariableName: "points",
      });


      // make cells essential even if didn't start out that way
      // because users changes (such as in a table)
      // will be made directly to the cells state variable
      this._state.cells.essential = true;

      // TODO: if don't have cells as state variable for reference
      // do we have to worry about this read only proxy
      // Also, why don't we have cells as state variable for reference?
      if (this.state.cells.__isReadOnlyProxy || (this.state.cells[0] && this.state.cells[0].__isReadOnlyProxy)) {
        this.state.cells = this.state.cells.map(x => [...x]);
      }



    }

    super.updateState(args);

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {
      let cellsRowsColumnsBlocks = this.childLogic.returnMatches("cellsRowsColumnsBlocks");
      this.state.cellRelatedChildren = cellsRowsColumnsBlocks.map(x => this.activeChildren[x]);
    }

    // check if any cell children may have moved or if some are unresolved
    let changeUnresolveResult = this.checkForChangesOrUnresolved()

    if (changeUnresolveResult.unresolvedLocation) {
      // can't determine location of at least one cell
      // so can't be sure of the contents of any particular location
      // mark entire cells as being unresolved
      this.unresolvedState.cells = true;
      this.unresolvedState.points = true;
      return;
    }

    if (childrenChanged || changeUnresolveResult.possibleCellIdentityChange) {
      // if identities of any cell descendant may have changed,
      // then rebuild cell structures from children

      // array of cell components (children) by row and column
      this.state.cellComponents = [];

      // object that gives row and column based on component name of cell children
      let oldCellNameToRowCol = this.state.cellNameToRowCol;
      this.state.cellNameToRowCol = {};

      // add link to cellComponents so that have access when processing array
      this._state.cells.cellComponents = this.state.cellComponents;


      this.processCellRelated({
        cellRelatedChildren: this.state.cellRelatedChildren
      });

      if (oldCellNameToRowCol !== undefined) {
        // look for any cells that used to be based off cell children
        // if no longer based on cell child, then blank out cell
        for (let cellName in oldCellNameToRowCol) {
          let rowcol = oldCellNameToRowCol[cellName];
          if (this.state.cellComponents[rowcol.row] === undefined || this.state.cellComponents[rowcol.row][rowcol.col] === undefined) {
            this.state.cells[rowcol.row][rowcol.col] = "";
          }
        }
      }

      // still need to check if have any references that might make table larger
      // and make sure we have a rectangle of cells that match dimensions
      this.adjustTableSize();

      this.currentTracker.trackChanges.logPotentialChange({
        component: this,
        variable: "points",
        oldValue: this.state.pointsFoundInCells,
      });
      this.state.pointsFoundInCells = undefined;

    } else {
      // identity of children didn't change

      // still need to check if have any references that might make table larger
      // and make sure we have a rectangle of cells that match dimensions
      this.adjustTableSize();


      // check for any unresolved cell children
      // and mark the corresponding entry of cells state variable as unresolved
      for (let cellName of changeUnresolveResult.unresolvedCells) {
        let rowcol = this.state.cellNameToRowCol[cellName];
        let arrayIndex = [rowcol.row, rowcol.col]
        if (this.unresolvedState.cells === undefined) {
          this.unresolvedState.cells = { isArray: true, arrayComponents: { [arrayIndex]: true } };
        } else {
          this.unresolvedState.cells.arrayComponents[arrayIndex] = true;
        }
      }

      // check if text of any cell children has changed
      // or have a tentative change in a cell
      // and update cell state variable to match
      // (don't check if unresolved, since care most about efficiency for
      // case where there are no unresolved cells)
      for (let cellName in this.state.cellNameToRowCol) {
        let rowcol = this.state.cellNameToRowCol[cellName];
        let child = this.state.cellComponents[rowcol.row][rowcol.col];

        if (trackChanges.getVariableChanges({
          component: child, variable: "text"
        })) {

          this.state.cells[rowcol.row][rowcol.col] = child.state.text;

          // for now, just recreate all points found in cells
          // if a cell changed its text
          this.currentTracker.trackChanges.logPotentialChange({
            component: this,
            variable: "points",
            oldValue: this.state.pointsFoundInCells,
          })
          this.state.pointsFoundInCells = undefined;

        } else if (this.changesInitiatedFromDownstream !== undefined && "cells" in this.changesInitiatedFromDownstream) {
          // Had a tentative change from downstream updates.
          // Since we made cells essential even if there are cell children
          // need to check if there is a cell child and update (overwrite)
          // from cell child.
          for (let index in this.changesInitiatedFromDownstream.cells.changes.arrayComponents) {
            let [rownum, colnum] = index.split(',');
            let row = this.state.cellComponents[rownum];
            if (row) {
              let child = row[colnum];
              if (child) {
                this.state.cells[rownum][colnum] = child.state.text;
              }
            }
          }
          delete this.changesInitiatedFromDownstream.cells;
        }
      }

      if (trackChanges.getVariableChanges({
        component: this, variable: "cells"
      })) {

        // for now, just recreate all points found in cells
        // if a cell state variable changed
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "points",
          oldValue: this.state.pointsFoundInCells,
        })
        this.state.pointsFoundInCells = undefined;

      }

    }

    if (changeUnresolveResult.unresolvedCells.length > 0) {
      this.unresolvedState.points = true;
    }

  }


  adjustTableSize() {

    // if bad numbers were entered, just make the size the default 4
    if (!Number.isFinite(this.state.numRows)) {
      this.state.numRows = 4;
    }
    if (!Number.isFinite(this.state.numColumns)) {
      this.state.numColumns = 4;
    }

    // extend numRows if there are more rows of cells
    let numRows = Math.max(this.state.cells.length, this.state.numRows);

    //Finds the length of longest row (or numColumns if larger)
    //(this skips undefined rows of cells)
    let numColumns = this.state.cells.reduce((a, c) => Math.max(a, c.length), this.state.numColumns);

    // check to see if there are any references to cells outside range
    // if so, extend numRows or numColumns
    for (let name in this.upstreamDependencies) {
      let upDep = this.upstreamDependencies[name];
      if (upDep.dependencyType !== "referenceShadow") {
        continue;
      }

      for (let downVar of upDep.downstreamStateVariables) {
        if (downVar.arrayName === "cells") {
          let index = downVar.index;
          if (index !== undefined) {
            if (index[0] >= numRows) {
              numRows = index[0] + 1;
            }
            if (index[1] >= numColumns) {
              numColumns = index[1] + 1;
            }
          }
        }
      }
    }

    // set state variables to new size
    this.state.numRows = numRows;
    this.state.numColumns = numColumns;

    // extend cells state variable, if needed
    this.state.cells.length = numRows;

    //Make the cells a rectangle
    //and make each row of cellComponents at least be an array
    for (let rowInd = 0; rowInd < numRows; rowInd++) {
      if (this.state.cells[rowInd] === undefined) {
        this.state.cells[rowInd] = [];
      }
      this.state.cells[rowInd].length = numColumns;
      if (this.state.cellComponents[rowInd] === undefined) {
        this.state.cellComponents[rowInd] = [];
      }
    }
  }


  checkForChangesOrUnresolved() {
    // return
    // - unresolvedLocation=true: if location of any cell is not determined
    //     so that it could end up being anywhere
    //  TODO: deal with cases where only one of rownum and colnum is unresolved
    //     either from cell itself or from rows, columns, and other cellblocks
    // else return
    // - possibleCellIdentityChange: if a cell may have changed location
    // - unresolvedCells: array of cell component names whose content is not resolved

    let possibleCellIdentityChange = false;
    let unresolvedCells = [];

    // if identity of child or location of cellblock is unresolved
    // we report that we can't determine where cells may be
    // TODO: exploit cases where know one of rownum and colnum?
    if (this.unresolvedState.cellRelatedChildren || this.unresolvedState.rownum ||
      this.unresolvedState.colnum) {
      return { unresolvedLocation: true };
    }

    let trackChanges = this.currentTracker.trackChanges;

    // if children or location has changed
    // cells may have moved around
    if (trackChanges.childrenChanged(this.componentName) ||
      trackChanges.getVariableChanges({
        component: this, variable: "rownum"
      }) ||
      trackChanges.getVariableChanges({
        component: this, variable: "colnum"
      })) {
      possibleCellIdentityChange = true;
    }

    for (let child of this.state.cellRelatedChildren) {

      if (child instanceof this.allComponentClasses.cell) {
        if (child.unresolvedState.rownum || child.unresolvedState.colnum) {
          // a particular cell has unresolved row or column
          // mark as completely unresolved location
          // TODO: keep track of cases where only one of rownum/colnum is unresolved
          return { unresolvedLocation: true };
        } else if (child.unresolvedState.text) {
          // a particular cell has unresolved contents
          unresolvedCells.push(child.componentName);
        } else if (trackChanges.getVariableChanges({
          component: child, variable: "rownum"
        }) ||
          trackChanges.getVariableChanges({
            component: child, variable: "colnum"
          })) {
          // cell could have changed columns
          possibleCellIdentityChange = true;
        }
      } else {

        let result = child.checkForChangesOrUnresolved();

        if (result.unresolvedLocation) {
          return { unresolvedLocation: true };
        }
        if (result.possibleCellIdentityChange) {
          possibleCellIdentityChange = true;
        }

        unresolvedCells.push(...result.unresolvedCells);

      }

    }

    return {
      possibleCellIdentityChange: possibleCellIdentityChange,
      unresolvedCells: unresolvedCells,
    };

  }


  processCellRelated({ cellRelatedChildren, rowOffset = 0, colOffset = 0 }) {
    var nextCellRowNum = rowOffset; //CellBlock and Cells
    var nextCellColNum = colOffset; //CellBlock and Cells
    var nextCellColNumIfBothUndefined = colOffset; //CellBlock and Cells
    var nextRowComponentRowNum = rowOffset;
    var nextColComponentColNum = colOffset;
    var maxRowNum = rowOffset;
    var maxColNum = colOffset;
    for (let child of cellRelatedChildren) {
      if (child.componentType === 'cell') {
        let cell = child;
        let rowNum = normalizeIndex(cell.state.rownum);
        let colNum = normalizeIndex(cell.state.colnum);

        if (rowNum === undefined) {
          rowNum = nextCellRowNum;
          if (colNum === undefined) {
            colNum = nextCellColNumIfBothUndefined;
          } else {
            colNum = colNum + colOffset;
          }
        } else {
          rowNum = rowNum + rowOffset;
          if (colNum === undefined) {
            colNum = nextCellColNum;
          } else {
            colNum = colNum + colOffset;
          }
        }
        this.addCell({
          cell: cell,
          rowNum: rowNum,
          colNum: colNum,
        });
        maxRowNum = Math.max(rowNum, maxRowNum);
        maxColNum = Math.max(colNum, maxColNum);
        nextCellRowNum = rowNum;
        nextCellColNum = colNum;
        nextCellColNumIfBothUndefined = colNum + 1;
      }
      else if (child.componentType == 'row') {
        let row = child;
        let rowNum = normalizeIndex(row.state.rownum);
        if (rowNum === undefined) {
          rowNum = nextRowComponentRowNum;
        } else {
          rowNum = rowNum + rowOffset;
        }
        let cellChildren = row.state.cellChildren;
        let nextColNum = colOffset;
        for (let cell of cellChildren) {
          let colNum = normalizeIndex(cell.state.colnum);
          if (colNum === undefined) {
            colNum = nextColNum;
          } else {
            colNum = colNum + colOffset;
          }
          this.addCell({
            cell: cell,
            rowNum: rowNum,
            colNum: colNum,
          });
          nextColNum = colNum + 1;
          maxRowNum = Math.max(rowNum, maxRowNum);
          maxColNum = Math.max(colNum, maxColNum);
        }
        nextRowComponentRowNum = rowNum + 1;
        nextCellRowNum = rowNum + 1;
        nextCellColNum = colOffset;
        nextCellColNumIfBothUndefined = nextCellColNum;
      }
      else if (child.componentType == 'column') {
        let col = child;
        let colNum = normalizeIndex(col.state.colnum);
        if (colNum === undefined) {
          colNum = nextColComponentColNum;
        } else {
          colNum = colNum + colOffset;
        }
        let cellChildren = col.state.cellChildren;
        let nextRowNum = rowOffset;
        for (let cell of cellChildren) {
          let rowNum = normalizeIndex(cell.state.rownum);
          if (rowNum === undefined) {
            rowNum = nextRowNum;
          } else {
            rowNum = rowNum + rowOffset;
          }
          this.addCell({
            cell: cell,
            rowNum: rowNum,
            colNum: colNum,
          });
          nextRowNum = rowNum + 1;
          maxRowNum = Math.max(rowNum, maxRowNum);
          maxColNum = Math.max(colNum, maxColNum);
        }
        nextColComponentColNum = colNum + 1;
        nextCellRowNum = rowOffset;
        nextCellColNum = colNum + 1;
        nextCellColNumIfBothUndefined = nextCellColNum;
      } else if (child.componentType == 'cellblock') {
        let cellblock = child;
        let rowNum = normalizeIndex(cellblock.state.rownum);
        let colNum = normalizeIndex(cellblock.state.colnum);

        if (rowNum === undefined) {
          rowNum = nextCellRowNum;
          if (colNum === undefined) {
            colNum = nextCellColNumIfBothUndefined;
          } else {
            colNum = colNum + colOffset;
          }
        } else {
          rowNum = rowNum + rowOffset;
          if (colNum === undefined) {
            colNum = nextCellColNum;
          } else {
            colNum = colNum + colOffset;
          }
        }
        let results = this.processCellRelated({
          cellRelatedChildren: cellblock.state.cellRelatedChildren,
          rowOffset: rowNum,
          colOffset: colNum,
        });
        maxRowNum = Math.max(results.maxRowNum, maxRowNum);
        maxColNum = Math.max(results.maxColNum, maxColNum);
        nextCellRowNum = rowNum;
        nextCellColNum = colNum;
        nextCellColNumIfBothUndefined = results.maxColNum + 1;
      }
    }
    return { maxRowNum: maxRowNum, maxColNum: maxColNum };
  }

  addCell({ cell, rowNum, colNum }) {

    //Add the rows we need
    if (!Array.isArray(this.state.cells[rowNum])) {
      this.state.cells[rowNum] = [];
    }
    if (!Array.isArray(this.state.cellComponents[rowNum])) {
      this.state.cellComponents[rowNum] = [];
    }


    if (rowNum < 0) {
      throw Error("RowNum position has to be 1 or greater");
    }
    if (colNum < 0) {
      throw Error("ColNum position has to be 1 or greater");
    }
    // if (rowNum > Number(this.state.numRows)){
    //   throw Error(`RowNum position of ${cell.componentName} is ${rowNum} which is larger than the number of rows ${this.state.numRows}`);
    // }
    // if (colNum > Number(this.state.numColumns)){
    //   throw Error(`ColNum position of ${cell.componentName} is ${colNum} which is larger than the number of columns ${this.state.numColumns}`);
    // }


    if (cell.unresolvedState.text) {
      if (this.unresolvedState.cells == undefined) {
        this.unresolvedState.cells = { isArray: true, arrayComponents: { [[rowNum, colNum]]: true } };
      } else {
        this.unresolvedState.cells.arrayComponents[[rowNum, colNum]] = true;
      }
    } else {
      this.state.cells[rowNum][colNum] = cell.state.text;
    }

    if (this.state.cellComponents[rowNum][colNum] === undefined) {
      this.state.cellComponents[rowNum][colNum] = cell;
    }
    else {
      throw Error(`Cell row ${rowNum + 1} column ${colNum + 1} is already defined above.`);
    }
    this.state.cellNameToRowCol[cell.componentName] = { row: rowNum, col: colNum };
    return { rowNum, colNum };
  }

  getCellPoints(obj, index) {

    if (this.unresolvedState.points) {
      return;
    }

    if (this.state.pointsFoundInCells !== undefined) {
      return this.state.pointsFoundInCells[index];
    }

    this.currentTracker.trackChanges.logPotentialChange({
      component: this,
      variable: "points",
      oldValue: this.state.pointsFoundInCells,
    })

    this.state.pointsFoundInCells = [];
    this._state.pointsFoundInCells.indices = [];

    let nRows = this.state.numRows;
    let nCols = this.state.numColumns;

    for (let colInd = 0; colInd < nCols; colInd++) {
      for (let rowInd = 0; rowInd < nRows; rowInd++) {
        let cellText = this.state.cells[rowInd][colInd];
        if (!cellText) {
          continue;
        }
        let cellME;
        try {
          cellME = me.fromText(cellText);
        } catch (e) {
          continue;
        }

        if (Array.isArray(cellME.tree) && cellME.tree[0] === "tuple") {
          this.state.pointsFoundInCells.push(cellME);
          this._state.pointsFoundInCells.indices.push([rowInd, colInd]);
        }
      }
    }


    console.log("logging points change");

    return this.state.pointsFoundInCells[index];

  }

  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    // const actions = {
    //   onChange: this.onChange,
    // }

    this.renderer = new this.availableRenderers.table({
      key: this.componentName,
      cells: this.state.cells,
      width: this.state.width,
      height: this.state.height,
    });
  }

  updateRenderer() {

    this.renderer.updateTable({
      cells: this.state.cells,
      width: this.state.width,
      height: this.state.height,
    })

  }

  allowDownstreamUpdates(status) {
    // since can't change via parents, 
    // only non-initial change can be due to reference
    return (status.initialChange === true || this.state.modifyIndirectly === true);
  }

  get variablesUpdatableDownstream() {
    return ["cells", "points", "numRows", "numColumns"];
  }

  calculateDownstreamChanges({ stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate }) {

    let newStateVariables = {};

    for (let varName in stateVariablesToUpdate) {
      if (varName === "cells") {
        if (newStateVariables[varName] === undefined) {
          newStateVariables[varName] = {
            isArray: true,
            changes: { arrayComponents: {} }
          }
        }
        for (let ind in stateVariablesToUpdate[varName].changes.arrayComponents) {
          newStateVariables[varName].changes.arrayComponents[ind] =
            stateVariablesToUpdate[varName].changes.arrayComponents[ind];
        }
      } else if (varName === "points") {

        // change is really to cells
        if (newStateVariables.cells === undefined) {
          newStateVariables.cells = {
            isArray: true,
            changes: { arrayComponents: {} }
          }
        }
        for (let ind in stateVariablesToUpdate[varName].changes.arrayComponents) {
          // look up index in cells
          if (this.state.pointsFoundInCells === undefined) {
            return false;
          }
          let cellInd = this._state.pointsFoundInCells.indices[ind];

          newStateVariables.cells.changes.arrayComponents[cellInd] =
            stateVariablesToUpdate[varName].changes.arrayComponents[ind].toString();
        }
      } else if (varName === "numRows" || varName === "numColumns") {
        let newValue = stateVariablesToUpdate[varName].changes;
        if (newValue.evaluate_to_constant !== undefined) {
          newValue = newValue.evaluate_to_constant();
          if (Number.isFinite(newValue) && newValue >= 0) {
            newStateVariables[varName] = { changes: Math.round(newValue) };
          }
        }
      }

    }

    //Update all changed cell children
    if ("cells" in newStateVariables) {
      for (let index in newStateVariables.cells.changes.arrayComponents) {
        let [rowNum, colNum] = index.split(',');

        let row = this.state.cellComponents[rowNum];
        if (row !== undefined) {
          let child = row[colNum];

          if (child !== undefined) {
            dependenciesToUpdate[child.componentName] = { text: { changes: newStateVariables.cells.changes.arrayComponents[index] } };
          }
        }

      }
    }

    let shadowedResult = this.updateShadowSources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // add stateVariable to stateVariableChangesToSave if is essential
    // and no shadow sources were updated
    for (let varname in newStateVariables) {
      if (this._state[varname].essential === true &&
        !shadowedStateVariables.has(varname) && !isReplacement) {
        stateVariableChangesToSave[varname] = newStateVariables[varname];
      }
    }

    // console.log({
    //   componentName: this.componentName,
    //   dependenciesToUpdate: dependenciesToUpdate,
    //   stateVariableChangesToSave: stateVariableChangesToSave,
    // })

    return true;
  }

}




function determingCellMapping({ cellRelatedChildren, rowOffset = 0, colOffset = 0,
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
      baseComponentType: "cellblock"
    })) {
      let cellblock = child;
      let rowIndex = normalizeIndex(cellblock.stateValues.rowNum);
      let colIndex = normalizeIndex(cellblock.stateValues.colNum);

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

      let results = determingCellMapping({
        cellRelatedChildren: cellblock.stateValues.prescribedCellsRowsColumnsBlocks,
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

function setTableComponent(proxiedStateVariable, index, value) {
  if (typeof index === "string") {
    index = index.split(',');
  }
  let row = index[0];
  let col = index[1];

  proxiedStateVariable[row][col] = value;

}

function validateTableParameters(stateVariable, propChildren) {

  // if have no props, then will return all cells
  // as cellblock
  if (propChildren === undefined || propChildren.length === 0) {
    return { success: true, numReplacements: 1, componentType: "cellblock" };

  } else if (propChildren.length === 1) {
    // if have one prop child, could either be a rownum or a colnum
    if (propChildren[0].componentType === 'rownum') {
      let rowNum = normalizeIndex(propChildren[0].state.value);
      if (Number.isInteger(rowNum) && rowNum >= 0) {
        return { success: true, numReplacements: 1, componentType: "row" };
      } else {
        return { success: false };
      }
    } else if (propChildren[0].componentType === 'colnum') {
      let colNum = normalizeIndex(propChildren[0].state.value);
      if (Number.isInteger(colNum) && colNum >= 0) {
        return { success: true, numReplacements: 1, componentType: "column" };
      } else {
        return { success: false };
      }
    } else {
      // no other valid single prop child
      return { success: false };
    }
  } else if (propChildren.length === 2) {

    // if have two prop children, order doesn't matter
    // valid combinations are
    // - rownum and colnum

    let childTypes = {
      [propChildren[0].componentType]: 0,
      [propChildren[1].componentType]: 1
    };

    // single cell if have both row and column
    if ("rownum" in childTypes && "colnum" in childTypes) {
      let rowNum = normalizeIndex(propChildren[childTypes.rownum].state.value);
      let colNum = normalizeIndex(propChildren[childTypes.colnum].state.value);
      if (Number.isInteger(rowNum) && rowNum >= 0 && Number.isInteger(colNum) && colNum >= 0) {
        return { success: true, numReplacements: 1, componentType: "cell" };
      } else {
        return { success: false };
      }

    } else {
      // no other valid two prop child
      return { success: false };
    }
  } else if (propChildren.length === 4) {

    // if have two prop children, order doesn't matter
    // valid combinations are
    // - from rownum, from colnum, to rownum, and to colnum

    let fromRowChild, fromColChild, toRowChild, toColChild;
    for (let child of propChildren) {
      if (child.componentType === "from") {
        let grandChild = child.activeChildren[0];
        if (grandChild.componentType === "rownum") {
          fromRowChild = grandChild
        } else if (grandChild.componentType === "colnum") {
          fromColChild = grandChild
        }
      } else if (child.componentType === "to") {
        let grandChild = child.activeChildren[0];
        if (grandChild.componentType === "rownum") {
          toRowChild = grandChild
        } else if (grandChild.componentType === "colnum") {
          toColChild = grandChild
        }
      }
    }

    // check if have valid combination of children
    if (!fromRowChild || !fromColChild || !toRowChild || !toColChild) {
      return { success: false }
    }

    let fromRow = normalizeIndex(fromRowChild.state.value);
    let fromCol = normalizeIndex(fromColChild.state.value);
    let toRow = normalizeIndex(toRowChild.state.value);
    let toCol = normalizeIndex(toColChild.state.value);

    if (Number.isInteger(fromRow) && fromRow >= 0 &&
      Number.isInteger(fromCol) && fromCol >= 0 &&
      Number.isInteger(toRow) && toRow >= 0 &&
      Number.isInteger(toCol) && toCol >= 0
    ) {
      // single cellblock
      return { success: true, numReplacements: 1, componentType: "cellblock" };
    } else {
      // invalid from/to row or col
      return { success: false };
    }

  } else {
    // bad number of prop children
    return { success: false };
  }

}

// return the JSON representing the portion of array determined by the given propChildren
function returnTableSerializedComponents({
  stateVariable, variableName,
  propChildren, propName,
  componentName, additionalDepProperties
}) {

  let stateVariableForRef = "value";
  if (stateVariable.stateVariableForRef !== undefined) {
    stateVariableForRef = stateVariable.stateVariableForRef;
  }

  let downstreamStateVariable = {
    arrayName: variableName,
  }
  let downDep = {
    dependencyType: "referenceShadow",
    prop: propName,
    downstreamStateVariables: [downstreamStateVariable],
    upstreamStateVariables: [stateVariableForRef],
  }

  if (additionalDepProperties !== undefined) {
    Object.assign(downDep, additionalDepProperties);
  }

  // utility function used to add each cell
  // define it here so can use above variables
  let returnSerializedCell = function ({ cellText, rowNum, colNum }) {
    downstreamStateVariable.index = [rowNum, colNum];
    // so that index is remains different for different components
    // need a deep copy of downDep.downstreamVariables
    // accomplish via two shallow copies, first one here
    downDep.downstreamStateVariables = [Object.assign({}, downstreamStateVariable)];

    if (cellText === undefined) {
      cellText = "";
    }

    let serializedComponent = {
      componentType: "cell",
      state: {
        [stateVariableForRef]: cellText,
      }
    }


    // TODO: can we link to more than just the text of the cell?
    // The below approach for referencing actual cell components
    // broke when have many references within a table
    // as the actual cell children were getting deleted and replaced
    // destroying the links between cells (having reftargets to deleted cells)

    // // if actually have a cell component for the cell,
    // // then create a reference to that cell
    // // otherwise create cell from state variable
    // let cellComponent = stateVariable.cellComponents[rowNum][colNum];

    // let serializedComponent;
    // if(cellComponent === undefined) {
    //   serializedComponent = {
    //     componentType: "cell",
    //     state: {
    //       [stateVariableForRef]: cell,
    //     }
    //   }
    // }else {
    //   serializedComponent = {
    //     componentType: "ref",
    //     children: [{
    //       componentType: "reftarget",
    //       state: {targetName: cellComponent.componentName}
    //     }],
    //     state: {rownum: "", colnum:""},
    //   }
    // }

    // second shallow copy for downDep.downstreamVariables deep copy
    serializedComponent.downstreamDependencies = {
      [componentName]: [Object.assign({}, downDep)],
    }
    return serializedComponent;
  }

  let cells = stateVariable.value;

  if (propChildren === undefined || propChildren.length === 0) {
    // return all cells as a cellblock
    let cellblockChildren = [];
    for (let rowNum = 0; rowNum < cells.length; rowNum++) {
      let row = cells[rowNum];
      let rowChildren = [];

      for (let colNum = 0; colNum < row.length; colNum++) {
        rowChildren.push(returnSerializedCell({
          cellText: row[colNum],
          rowNum: rowNum,
          colNum: colNum
        }));
      }

      // rows don't shadow another component
      cellblockChildren.push({
        componentType: "row",
        children: rowChildren
      });

    }
    // return cellblock corresponding to all cells
    return [{
      componentType: "cellblock",
      children: cellblockChildren
    }];

  } else if (propChildren.length === 1) {
    // if have one prop child, could either be a rownum or a colnum
    if (propChildren[0].componentType === 'rownum') {
      let rowNum = normalizeIndex(propChildren[0].state.value);

      let rowChildren = [];

      for (let colNum = 0; colNum < cells[0].length; colNum++) {
        let cellText = "";
        if (rowNum < cells.length) {
          cellText = cells[rowNum][colNum];
        }
        rowChildren.push(returnSerializedCell({
          cellText: cellText,
          rowNum: rowNum,
          colNum: colNum
        }));
      }

      // return row corresponding to all cells from row
      return [{
        componentType: "row",
        children: rowChildren
      }];

    } else if (propChildren[0].componentType === 'colnum') {
      let colNum = normalizeIndex(propChildren[0].state.value);

      let columnChildren = [];

      for (let rowNum = 0; rowNum < cells.length; rowNum++) {
        let cellText = "";
        if (rowNum < cells.length && colNum < cells[rowNum].length) {
          cellText = cells[rowNum][colNum];
        }
        columnChildren.push(returnSerializedCell({
          cellText: cellText,
          rowNum: rowNum,
          colNum: colNum
        }));
      }

      // return row corresponding to all cells from row
      return [{
        componentType: "column",
        children: columnChildren
      }];

    }

    // don't to check other cases with one propChild
    // as wouldn't pass validateParameters

    // check for two propChildren next
  } else if (propChildren.length === 2) {

    // if have two prop children, order doesn't matter
    // valid combinations are
    // - rownum and colnum

    let childTypes = {
      [propChildren[0].componentType]: 0,
      [propChildren[1].componentType]: 1
    };

    // if passed validateParameters, must have both row and column
    let rowNum = normalizeIndex(propChildren[childTypes.rownum].state.value);
    let colNum = normalizeIndex(propChildren[childTypes.colnum].state.value);

    let cellText = "";
    if (rowNum < cells.length && colNum < cells[rowNum].length) {
      cellText = cells[rowNum][colNum];
    }
    return [returnSerializedCell({
      cellText: cellText,
      rowNum: rowNum,
      colNum: colNum
    })];
  } else if (propChildren.length === 4) {

    let fromRowChild, fromColChild, toRowChild, toColChild;
    for (let child of propChildren) {
      if (child.componentType === "from") {
        let grandChild = child.activeChildren[0];
        if (grandChild.componentType === "rownum") {
          fromRowChild = grandChild
        } else if (grandChild.componentType === "colnum") {
          fromColChild = grandChild
        }
      } else if (child.componentType === "to") {
        let grandChild = child.activeChildren[0];
        if (grandChild.componentType === "rownum") {
          toRowChild = grandChild
        } else if (grandChild.componentType === "colnum") {
          toColChild = grandChild
        }
      }
    }

    let fromRow = normalizeIndex(fromRowChild.state.value);
    let fromCol = normalizeIndex(fromColChild.state.value);
    let toRow = normalizeIndex(toRowChild.state.value);
    let toCol = normalizeIndex(toColChild.state.value);

    let firstRow = Math.min(fromRow, toRow);
    let lastRow = Math.max(fromRow, toRow);
    let firstCol = Math.min(fromCol, toCol);
    let lastCol = Math.max(fromCol, toCol);

    let cellblockChildren = [];
    for (let rowNum = firstRow; rowNum <= lastRow; rowNum++) {
      let rowChildren = [];

      for (let colNum = firstCol; colNum <= lastCol; colNum++) {
        let cellText = "";
        if (rowNum < cells.length && colNum < cells[rowNum].length) {
          cellText = cells[rowNum][colNum];
        }
        rowChildren.push(returnSerializedCell({
          cellText: cellText,
          rowNum: rowNum,
          colNum: colNum
        }));
      }

      // rows don't shadow another component
      cellblockChildren.push({
        componentType: "row",
        children: rowChildren
      });

    }
    // return cellblock corresponding to all cells
    return [{
      componentType: "cellblock",
      children: cellblockChildren
    }];

  }
  // don't need to check other cases, as wouldn't pass validateParameters
}


function getCellSugarReplacement({ indexString }) {

  // sugar for accessing an individual cell
  // accept two formats: B1 or (1,2)

  let rowNum, colNum;

  let letterNumStyle = /^([a-zA-Z]+)([1-9]\d*)$/;
  let result = indexString.match(letterNumStyle);
  if (result) {
    colNum = result[1];
    rowNum = result[2]
  } else {
    let tupleStyle = /^\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\)$/;
    result = indexString.match(tupleStyle);
    if (result) {
      rowNum = result[1];
      colNum = result[2];
    }
  }

  if (!result) {
    return // mark invalid
  }

  return [{
    componentType: "rownum", state: { value: rowNum }
  }, {
    componentType: "colnum", state: { value: colNum }
  }];

}

function getRowSugarReplacement({ indexString }) {
  let validIndex = /^([a-zA-Z]+)|([1-9]\d*)$/.test(indexString);
  if (validIndex) {
    return [{ componentType: "rownum", state: { value: indexString } }];
  } else {
    return; // mark as invalid
  }
}

function getColumnSugarReplacement({ indexString }) {
  let validIndex = /^([a-zA-Z]+)|([1-9]\d*)$/.test(indexString);
  if (validIndex) {
    return [{ componentType: "colnum", state: { value: indexString } }];
  } else {
    return; // mark as invalid
  }
}

function getRangeSugarReplacement({ indexString }) {

  // sugar for accessing a range of cell
  // accept two formats: B1D5 or ((1,2),(5,4))

  let fromRow, fromCol, toRow, toCol;

  let letterNumStyle = /^([a-zA-Z]+)([1-9]\d*)([a-zA-Z]+)([1-9]\d*)$/;
  let result = indexString.match(letterNumStyle);
  if (result) {
    fromCol = result[1];
    fromRow = result[2]
    toCol = result[3];
    toRow = result[4]
  } else {
    let tupleStyle = /^\(\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\),\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\)\)$/;
    result = indexString.match(tupleStyle);
    if (result) {
      fromRow = result[1];
      fromCol = result[2]
      toRow = result[3];
      toCol = result[4]
    }
  }

  if (!result) {
    return // mark invalid
  }

  return [{
    componentType: "from", children: [{
      componentType: "rownum", state: { value: fromRow }
    }]
  }, {
    componentType: "from", children: [{
      componentType: "colnum", state: { value: fromCol }
    }]
  }, {
    componentType: "to", children: [{
      componentType: "rownum", state: { value: toRow }
    }]
  }, {
    componentType: "to", children: [{
      componentType: "colnum", state: { value: toCol }
    }]
  }]

}