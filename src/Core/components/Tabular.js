import BlockComponent from './abstract/BlockComponent';

export default class Tabular extends BlockComponent {
  static componentType = "tabular";
  static rendererType = "tabular";
  static renderChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.width = {
      createComponentOfType: "_componentSize",
      createStateVariable: "width",
      defaultValue: { size: 100, isAbsolute: false },
      public: true,
      forRenderer: true,
    };
    attributes.height = {
      createComponentOfType: "_componentSize",
      createStateVariable: "height",
      defaultValue: null,
      public: true,
      forRenderer: true,
    };
    // attributes.minNumRows = {
    //   createComponentOfType: "number",
    //   createStateVariable: "minNumRows",
    //   defaultValue: 1,
    //   public: true,
    //   forRenderer: true,
    // };
    // attributes.minNumColumns = {
    //   createComponentOfType: "number",
    //   createStateVariable: "minNumColumns",
    //   defaultValue: 1,
    //   public: true,
    //   forRenderer: true,
    // };
    attributes.halign = {
      createComponentOfType: "text",
      createStateVariable: "halign",
      defaultValue: "left",
      public: true,
      validValues: ["left", "center", "right", "justify"],
    }
    attributes.valign = {
      createComponentOfType: "text",
      createStateVariable: "valign",
      defaultValue: "middle",
      public: true,
      validValues: ["top", "middle", "bottom"],
    }
    attributes.top = {
      createComponentOfType: "text",
      createStateVariable: "top",
      defaultValue: "none",
      public: true,
      validValues: ["none", "minor", "medium", "major"],
      forRenderer: true,
    }
    attributes.left = {
      createComponentOfType: "text",
      createStateVariable: "left",
      defaultValue: "none",
      public: true,
      validValues: ["none", "minor", "medium", "major"],
    }
    attributes.bottom = {
      createComponentOfType: "text",
      createStateVariable: "bottom",
      defaultValue: "none",
      public: true,
      validValues: ["none", "minor", "medium", "major"],
    }
    attributes.right = {
      createComponentOfType: "text",
      createStateVariable: "right",
      defaultValue: "none",
      public: true,
      validValues: ["none", "minor", "medium", "major"],
    }
    return attributes;
  }


  static returnChildGroups() {

    return [{
      group: "rows",
      componentTypes: ["row"]
    }]

  }


  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // stateVariableDefinitions.numRows = {
    //   public: true,
    //   componentType: "number",
    //   returnDependencies: () => ({
    //     minNumRows: {
    //       dependencyType: "stateVariable",
    //       variableName: "minNumRows"
    //     },
    //     rowChildren: {
    //       dependencyType: "child",
    //       childLogicName: "zeroOrMoreRows"
    //     }
    //   }),
    //   definition({ dependencyValues }) {
    //     let numRows = dependencyValues.minNumRows;
    //     if (!Number.isFinite(numRows)) {
    //       numRows = 4;
    //     }
    //     numRows = Math.max(numRows, dependencyValues.rowChildren.length)
    //     return { setValue: { numRows } }
    //   }
    // }

    // stateVariableDefinitions.numColumns = {
    //   public: true,
    //   componentType: "number",
    //   returnDependencies: () => ({
    //     minNumColumns: {
    //       dependencyType: "stateVariable",
    //       variableName: "minNumColumns"
    //     },
    //     rowChildren: {
    //       dependencyType: "child",
    //       childLogicName: "zeroOrMoreRows"
    //     }
    //   }),
    //   definition({ dependencyValues }) {
    //     let numColumns = dependencyValues.minNumColumns;
    //     if (!Number.isFinite(numColumns)) {
    //       numColumns = 4;
    //     }
    //     for (let row of dependencyValues.cellNamesByRowCol) {
    //       if (row) {
    //         numColumns = Math.max(numColumns, row.length);
    //       }
    //     }
    //     return { setValue: { numColumns } }
    //   }
    // }


    // stateVariableDefinitions.height = {
    //   public: true,
    //   componentType: "_componentSize",
    //   forRenderer: true,
    //   returnDependencies: () => ({
    //     heightAttr: {
    //       dependencyType: "attributeComponent",
    //       attributeName: "height",
    //       variableName: "componentSize"
    //     },
    //     numRows: {
    //       dependencyType: "stateVariable",
    //       variableName: "numRows"
    //     }
    //   }),
    //   definition({ dependencyValues }) {

    //     if (dependencyValues.heightAttr === null) {
    //       // TODO: is this what we want for default height?
    //       // Do we want to cap default at a maximum?
    //       let height;
    //       if (Number.isFinite(dependencyValues.numRows) && dependencyValues.numRows >= 0) {
    //         height = 50 + dependencyValues.numRows * 20;
    //       } else {
    //         height = 130;  // value if numRows = 4
    //       }
    //       return { setValue: { height: { size: height, isAbsolute: true } } }
    //     }

    //     return { setValue: { height: dependencyValues.heightAttr.stateValues.componentSize } }

    //   }
    // }

    // stateVariableDefinitions.cells = {
    //   public: true,
    //   componentType: "cell",
    //   isArray: true,
    //   entryPrefixes: ["cell", "row", "column", "range"],
    //   nDimensions: 2,
    //   // stateVariablesDeterminingDependencies: ["numRows", "numColumns"],
    //   returnArraySizeDependencies: () => ({
    //     numRows: {
    //       dependencyType: "stateVariable",
    //       variableName: "numRows",
    //     },
    //     numColumns: {
    //       dependencyType: "stateVariable",
    //       variableName: "numColumns",
    //     },
    //   }),
    //   returnArraySize({ dependencyValues }) {
    //     return [dependencyValues.numRows, dependencyValues.numColumns];
    //   },
    //   returnEntryDimensions: prefix => prefix === "range" ? 2 : 1,
    //   containsComponentNamesToCopy: true,
    //   targetAttributesToIgnoreOnCopy: ["rowNum", "colNum"],
    //   returnWrappingComponents(prefix) {
    //     if (prefix === "cell") {
    //       return [];
    //     } else if (prefix === "row") {
    //       return [["row"]];
    //     } else if (prefix === " col") {
    //       return [["column"]];
    //     } else {
    //       // range or entire array
    //       return [["row"], ["cellBlock"]]
    //     }
    //   },
    //   getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
    //     if (arrayEntryPrefix === "cell") {
    //       // accept two formats: cellB1 or cell(1,2)
    //       // (accept letters in second format: (A, 2), (1, B), or (A,B))

    //       let rowNum, colNum;

    //       let letterNumStyle = /^([a-zA-Z]+)([1-9]\d*)$/;
    //       let result = varEnding.match(letterNumStyle);
    //       if (result) {
    //         colNum = result[1];
    //         rowNum = result[2]
    //       } else {
    //         let tupleStyle = /^\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\)$/;
    //         result = varEnding.match(tupleStyle);
    //         if (result) {
    //           rowNum = result[1];
    //           colNum = result[2];
    //         } else {
    //           return []; // invalid
    //         }
    //       }

    //       let rowIndex = normalizeIndex(rowNum);
    //       let colIndex = normalizeIndex(colNum);

    //       if (!(rowIndex >= 0 && rowIndex < arraySize[0] && colIndex >= 0 && colIndex < arraySize[1])) {
    //         // invalid index or index of out range
    //         return [];
    //       }

    //       return [String(rowIndex) + "," + String(colIndex)]

    //     } else if (arrayEntryPrefix === "row") {
    //       // row2 or rowB

    //       let rowIndex = normalizeIndex(varEnding);
    //       if (!(rowIndex >= 0 && rowIndex < arraySize[0])) {
    //         // invalid index or index of out range
    //         return [];
    //       }

    //       let arrayKeys = [];
    //       let arrayKeyBegin = String(rowIndex) + ",";
    //       for (let i = 0; i < arraySize[1]; i++) {
    //         arrayKeys.push(arrayKeyBegin + i);
    //       }

    //       return arrayKeys;

    //     } else if (arrayEntryPrefix === "column") {
    //       // column2 or columnB

    //       let colIndex = normalizeIndex(varEnding);
    //       if (!(colIndex >= 0 && colIndex < arraySize[1])) {
    //         // invalid index or index of out range
    //         return [];
    //       }

    //       let arrayKeys = [];
    //       let arrayKeyEnd = "," + String(colIndex);
    //       for (let i = 0; i < arraySize[1]; i++) {
    //         arrayKeys.push(i + arrayKeyEnd);
    //       }

    //       return arrayKeys;

    //     } else {
    //       // range
    //       // accept two formats: rangeB1D5 or range((1,2),(5,4))

    //       let fromRow, fromCol, toRow, toCol;

    //       let letterNumStyle = /^([a-zA-Z]+)([1-9]\d*)([a-zA-Z]+)([1-9]\d*)$/;
    //       let result = varEnding.match(letterNumStyle);
    //       if (result) {
    //         fromCol = normalizeIndex(result[1]);
    //         fromRow = normalizeIndex(result[2]);
    //         toCol = normalizeIndex(result[3]);
    //         toRow = normalizeIndex(result[4]);
    //       } else {
    //         let tupleStyle = /^\(\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\),\(([a-zA-Z]+|\d+),([a-zA-Z]+|\d+)\)\)$/;
    //         result = varEnding.match(tupleStyle);
    //         if (result) {
    //           fromRow = normalizeIndex(result[1]);
    //           fromCol = normalizeIndex(result[2]);
    //           toRow = normalizeIndex(result[3]);
    //           toCol = normalizeIndex(result[4]);
    //         } else {
    //           return [];  //invalid
    //         }
    //       }


    //       if (!(fromRow >= 0 && toRow >= 0 && fromCol >= 0 && toCol >= 0)) {
    //         // invalid range
    //         return [];
    //       }

    //       let row1 = Math.min(Math.min(fromRow, toRow), arraySize[0] - 1);
    //       let row2 = Math.min(Math.max(fromRow, toRow), arraySize[0] - 1);
    //       let col1 = Math.min(Math.min(fromCol, toCol), arraySize[1] - 1);
    //       let col2 = Math.min(Math.max(fromCol, toCol), arraySize[1] - 1);

    //       let arrayKeys = [];

    //       for (let rowIndex = row1; rowIndex <= row2; rowIndex++) {
    //         let rowKeys = [];
    //         let arrayKeyBegin = String(rowIndex) + ",";
    //         for (let colIndex = col1; colIndex <= col2; colIndex++) {
    //           rowKeys.push(arrayKeyBegin + colIndex);
    //         }
    //         arrayKeys.push(rowKeys);
    //       }

    //       return arrayKeys;

    //     }

    //   },
    //   arrayVarNameFromArrayKey(arrayKey) {
    //     return "cell(" + arrayKey.split(',').map(x => Number(x) + 1).join(',') + ")"
    //   },
    //   returnArrayDependenciesByKey() {
    //     let globalDependencies = {
    //       cellNamesByRowCol: {
    //         dependencyType: "stateVariable",
    //         variableName: "cellNamesByRowCol",
    //       }
    //     }
    //     return { globalDependencies }
    //   },
    //   arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {

    //     let cells = {};
    //     let cnbrc = globalDependencyValues.cellNamesByRowCol;

    //     for (let arrayKey of arrayKeys) {
    //       let [rowInd, colInd] = arrayKey.split(',');
    //       if (cnbrc[rowInd] && cnbrc[rowInd][colInd]) {
    //         cells[arrayKey] = cnbrc[rowInd][colInd];
    //       } else {
    //         cells[arrayKey] = null;
    //       }
    //     }
    //     return { setValue: { cells } }
    //   }
    // }


    return stateVariableDefinitions;

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
    recordVisibilityChange: this.recordVisibilityChange.bind(this),
  }


}


