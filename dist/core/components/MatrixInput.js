import MathInput from './MathInput.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { renameStateVariable } from '../utils/stateVariables.js';
import { deepClone } from '../utils/deepFunctions.js';

export default class MatrixInput extends MathInput {
  constructor(args) {
    super(args);

    delete this.actions.updateRawValue;

    this.actions.updateRawValues = this.updateRawValues.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
    this.actions.updateNumRows = this.updateNumRows.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
    this.actions.updateNumColumns = this.updateNumColumns.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )

  }

  static componentType = "matrixInput";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.numRows = {
      createComponentOfType: "integer",
      createStateVariable: "numRowsPreliminary",
      defaultValue: 1,
      transformNonFiniteTo: 0
    }
    attributes.numColumns = {
      createComponentOfType: "integer",
      createStateVariable: "numColumnsPreliminary",
      defaultValue: 1,
      transformNonFiniteTo: 0
    }

    attributes.showSizeControls = {
      createComponentOfType: "boolean",
      createStateVariable: "showSizeControls",
      defaultValue: true,
      public: true,
      forRenderer: true,
    }

    attributes.defaultEntry = {
      createComponentOfType: "math",
      createStateVariable: "defaultEntry",
      defaultValue: me.fromAst('\uff3f')
    }
    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // rename value to valueOriginal
    renameStateVariable({
      stateVariableDefinitions,
      oldName: "value",
      newName: "valueOriginal"
    });

    stateVariableDefinitions.haveBoundValue = {
      returnDependencies: () => ({
        bindValueTo: {
          dependencyType: "attributeComponent",
          attributeName: "bindValueTo",
        }
      }),
      definition({ dependencyValues }) {
        return { setValue: { haveBoundValue: dependencyValues.bindValueTo !== null } }
      }
    }

    stateVariableDefinitions.numRows = {
      public: true,
      componentType: "integer",
      forRenderer: true,
      returnDependencies: () => ({
        numRowsPreliminary: {
          dependencyType: "stateVariable",
          variableName: "numRowsPreliminary"
        },
        valueOriginal: {
          dependencyType: "stateVariable",
          variableName: "valueOriginal"
        },
        haveBoundValue: {
          dependencyType: "stateVariable",
          variableName: "haveBoundValue"
        },
      }),
      definition({ dependencyValues, usedDefault }) {

        let numRows = dependencyValues.numRowsPreliminary;

        if (usedDefault.numRowsPreliminary || dependencyValues.haveBoundValue) {
          let originalTree = dependencyValues.valueOriginal.tree;

          numRows = 1;

          if (Array.isArray(originalTree)) {
            let operator = originalTree[0];
            if (operator === "matrix") {
              numRows = originalTree[1][1];
            } else if (operator === "vector" || operator == "tuple") {
              numRows = originalTree.length - 1;
            }

          }

        }

        return { setValue: { numRows } }

      },
      async inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues }) {
        console.log(desiredStateVariableValues, dependencyValues)

        let desiredNumRows = desiredStateVariableValues.numRows;
        if (!Number.isInteger(desiredNumRows)) {
          return { success: false };
        }
        desiredNumRows = Math.max(0, desiredNumRows);

        let instructions = [{
          setDependency: "numRowsPreliminary",
          desiredValue: desiredNumRows
        }]

        if (dependencyValues.haveBoundValue) {
          let originalTree = dependencyValues.valueOriginal.tree;
          let defaultEntryTree = (await stateValues.defaultEntry).tree;
          if (await stateValues.numColumns === 1 && Array.isArray(originalTree)
            && (originalTree[0] === "vector" || originalTree[0] === "tuple")
          ) {
            // original value was a vector
            // so we keep it a vector

            let currentNumRows = originalTree.length - 1;

            if (desiredNumRows < currentNumRows) {
              let newTree = deepClone(originalTree).slice(0, desiredNumRows + 1);
              instructions.push({
                setDependency: "valueOriginal",
                desiredValue: me.fromAst(newTree)
              })
            } else if (desiredNumRows > currentNumRows) {

              let newTree = deepClone(originalTree);
              let accumulatedComponents = await stateValues.accumulatedComponents;
              for (let rowInd = currentNumRows; rowInd < desiredNumRows; rowInd++) {
                let accumRow = accumulatedComponents[rowInd];
                let accumVal;
                if (accumRow) {
                  accumVal = accumRow[0];
                }
                newTree[rowInd + 1] = accumVal === undefined ? defaultEntryTree : accumVal;
              }
              instructions.push({
                setDependency: "valueOriginal",
                desiredValue: me.fromAst(newTree)
              })

            }

          } else {

            let valueTree = deepClone((await stateValues.value).tree);
            let previousNumRows = valueTree[1][1];
            valueTree[1][1] = desiredNumRows;

            if (desiredNumRows !== previousNumRows) {

              if (desiredNumRows < previousNumRows) {
                valueTree[2].length = desiredNumRows + 1;
              } else {
                // add any extra rows
                let numColumns = await stateValues.numColumns;
                let data = valueTree[2];
                let accumulatedComponents = await stateValues.accumulatedComponents;

                for (let rowInd = previousNumRows; rowInd < desiredNumRows; rowInd++) {
                  if (!data[rowInd + 1]) {
                    data[rowInd + 1] = ["tuple"]
                  }

                  let accumRow = accumulatedComponents[rowInd];
                  if (!accumRow) {
                    accumRow = [];
                  }

                  for (let colInd = 0; colInd < numColumns; colInd++) {
                    let accumVal = accumRow[colInd];
                    data[rowInd + 1][colInd + 1] = accumVal === undefined ? defaultEntryTree : accumVal;
                  }

                }

              }

              instructions.push({
                setDependency: "valueOriginal",
                desiredValue: me.fromAst(valueTree)
              })
            }
          }

        }

        console.log(instructions)

        return {
          success: true,
          instructions
        }
      }
    }

    stateVariableDefinitions.numColumns = {
      public: true,
      componentType: "integer",
      forRenderer: true,
      returnDependencies: () => ({
        numColumnsPreliminary: {
          dependencyType: "stateVariable",
          variableName: "numColumnsPreliminary"
        },
        valueOriginal: {
          dependencyType: "stateVariable",
          variableName: "valueOriginal"
        },
        haveBoundValue: {
          dependencyType: "stateVariable",
          variableName: "haveBoundValue"
        },
      }),
      definition({ dependencyValues, usedDefault }) {

        let numColumns = dependencyValues.numColumnsPreliminary;

        if (usedDefault.numColumnsPreliminary || dependencyValues.haveBoundValue) {
          let originalTree = dependencyValues.valueOriginal.tree;

          numColumns = 1;

          if (Array.isArray(originalTree)) {
            let operator = originalTree[0];
            if (operator === "matrix") {
              numColumns = originalTree[1][2];
            } else if (Array.isArray(originalTree[1])
              && (originalTree[1][0] === "vector" || originalTree[1][0] === "tuple")
              && ((operator === "^" && originalTree[2] === "T") || operator === "prime")
            ) {
              numColumns = originalTree[1].length - 1;
            }

          }

        }

        return { setValue: { numColumns } }

      },
      async inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues }) {
        let desiredNumColumns = desiredStateVariableValues.numColumns;
        if (!Number.isInteger(desiredNumColumns)) {
          return { success: false };
        }
        desiredNumColumns = Math.max(0, desiredNumColumns);

        let instructions = [{
          setDependency: "numColumnsPreliminary",
          desiredValue: desiredNumColumns
        }]

        if (dependencyValues.haveBoundValue) {
          let defaultEntryTree = (await stateValues.defaultEntry).tree;
          let originalTree = dependencyValues.valueOriginal.tree;
          let operator = originalTree[0];

          if (Array.isArray(originalTree[1])
            && (originalTree[1][0] === "vector" || originalTree[1][0] === "tuple")
            && ((operator === "^" && originalTree[2] === "T") || operator === "prime")
          ) {

            // original value was a transpose of a vector
            // so we keep it a transpose of a vector

            let currentNumColumns = originalTree[1].length - 1;

            if (desiredNumColumns < currentNumColumns) {
              let newTree = deepClone(originalTree);
              newTree[1] = newTree[1].slice(0, desiredNumColumns + 1);
              instructions.push({
                setDependency: "valueOriginal",
                desiredValue: me.fromAst(newTree)
              })
            } else if (desiredNumColumns > currentNumColumns) {

              let newTree = deepClone(originalTree);
              let accumRow = (await stateValues.accumulatedComponents)[0];
              if (!accumRow) {
                accumRow = [];
              }

              for (let colInd = currentNumColumns; colInd < desiredNumColumns; colInd++) {
                let accumVal = accumRow[colInd];
                newTree[1][colInd + 1] = accumVal === undefined ? defaultEntryTree : accumVal;
              }
              instructions.push({
                setDependency: "valueOriginal",
                desiredValue: me.fromAst(newTree)
              })

            }

          } else {

            let valueTree = deepClone((await stateValues.value).tree);
            let previousNumColumns = valueTree[1][2];
            valueTree[1][2] = desiredNumColumns;

            if (desiredNumColumns !== previousNumColumns) {
              let numRows = await stateValues.numRows;
              let data = valueTree[2];

              if (desiredNumColumns < previousNumColumns) {
                for (let rowInd = 0; rowInd < numRows; rowInd++) {
                  data[rowInd + 1].length = desiredNumColumns + 1;
                }
              } else {
                // add any extra columns
                let accumulatedComponents = await stateValues.accumulatedComponents;
                for (let rowInd = 0; rowInd < numRows; rowInd++) {
                  let accumRow = accumulatedComponents[rowInd];
                  if (!accumRow) {
                    accumRow = [];
                  }

                  for (let colInd = previousNumColumns; colInd < desiredNumColumns; colInd++) {
                    let accumVal = accumRow[colInd];
                    data[rowInd + 1][colInd + 1] = accumVal === undefined ? defaultEntryTree : accumVal;
                  }
                }

              }

              instructions.push({
                setDependency: "valueOriginal",
                desiredValue: me.fromAst(valueTree)
              })
            }
          }

        }

        return {
          success: true,
          instructions
        }
      }
    }

    stateVariableDefinitions.accumulatedComponents = {
      providePreviousValuesInDefinition: true,
      returnDependencies: () => ({
        valueOriginal: {
          dependencyType: "stateVariable",
          variableName: "valueOriginal"
        },
      }),
      definition({ dependencyValues, previousValues }) {
        let accumulatedComponents = [];
        if (previousValues.accumulatedComponents) {
          accumulatedComponents = deepClone(previousValues.accumulatedComponents);
        }
        let originalTree = dependencyValues.valueOriginal.tree;
        if (Array.isArray(originalTree)) {
          let operator = originalTree[0];
          if (operator === "matrix") {
            let data = originalTree[2];

            for (let [rowInd, row] of data.slice(1).entries()) {
              let accumRow = accumulatedComponents[rowInd];
              if (!accumRow) {
                accumRow = accumulatedComponents[rowInd] = [];
              }
              for (let [colInd, comp] of row.slice(1).entries()) {
                accumRow[colInd] = comp;
              }
            }

            return { setValue: { accumulatedComponents } }

          } else if (operator === "vector" || operator === "tuple") {
            // treat vector/tuple as first column in matrix

            for (let [rowInd, comp] of originalTree.slice(1).entries()) {
              let accumRow = accumulatedComponents[rowInd];
              if (!accumRow) {
                accumRow = accumulatedComponents[rowInd] = [];
              }
              accumRow[0] = comp;
            }

            return { setValue: { accumulatedComponents } }

          } else if (Array.isArray(originalTree[1])
            && (originalTree[1][0] === "vector" || originalTree[1][0] === "tuple")
            && ((operator === "^" && originalTree[2] === "T") || operator === "prime")
          ) {
            // treat transpose of vector/tuple as first row in matrix

            let accumRow = accumulatedComponents[0];
            if (!accumRow) {
              accumRow = accumulatedComponents[0] = [];
            }
            for (let [colInd, comp] of originalTree[1].slice(1).entries()) {
              accumRow[colInd] = comp;
            }

            return { setValue: { accumulatedComponents } }

          }
        }

        let accumRow = accumulatedComponents[0];
        if (!accumRow) {
          accumRow = accumulatedComponents[0] = [];
        }
        accumRow[0] = originalTree;

        return { setValue: { accumulatedComponents } }

      }
    }

    stateVariableDefinitions.value = {
      public: true,
      componentType: "math",
      forRenderer: true,
      returnDependencies: () => ({
        valueOriginal: {
          dependencyType: "stateVariable",
          variableName: "valueOriginal"
        },
        numRows: {
          dependencyType: "stateVariable",
          variableName: "numRows"
        },
        numColumns: {
          dependencyType: "stateVariable",
          variableName: "numColumns"
        },
        accumulatedComponents: {
          dependencyType: "stateVariable",
          variableName: "accumulatedComponents"
        },
        defaultEntry: {
          dependencyType: "stateVariable",
          variableName: "defaultEntry"
        }
      }),
      definition({ dependencyValues }) {
        let originalTree = dependencyValues.valueOriginal.tree;
        let accumulatedComponents = dependencyValues.accumulatedComponents;

        let numRows = dependencyValues.numRows;
        let numColumns = dependencyValues.numColumns;

        if (Array.isArray(originalTree)) {
          let operator = originalTree[0];
          if (operator === "matrix") {
            if (originalTree[1][1] === numRows
              && originalTree[1][2] === numColumns
            ) {
              return { setValue: { value: dependencyValues.valueOriginal } }
            }

            // have matrix, just wrong size
            let newTree = deepClone(originalTree);

            let originalNumRows = originalTree[1][1];
            let originalNumColumns = originalTree[1][2];

            newTree[1][1] = numRows;
            newTree[1][2] = numColumns;

            let data = newTree[2];

            if (numColumns < originalNumColumns) {
              // trim off any extra columns
              for (let rowInd = 0; rowInd < originalNumRows; rowInd++) {
                data[rowInd + 1].length = numColumns + 1;
              }
            } else {
              // add any extra columns to existing rows
              for (let rowInd = 0; rowInd < originalNumRows; rowInd++) {
                let accumRow = accumulatedComponents[rowInd];
                for (let colInd = originalNumColumns; colInd < numColumns; colInd++) {
                  let accumVal = accumRow[colInd];
                  data[rowInd + 1][colInd + 1] = accumVal === undefined ? dependencyValues.defaultEntry.tree : accumVal;
                }
              }
            }

            if (numRows < originalNumRows) {
              // trim off extra rows
              data.length = numRows + 1;
            } else {
              // add any extra rows
              for (let rowInd = originalNumRows; rowInd < numRows; rowInd++) {
                data[rowInd + 1] = ["tuple"];

                let accumRow = accumulatedComponents[rowInd];
                if (!accumRow) {
                  accumRow = [];
                }
                for (let colInd = 0; colInd < numColumns; colInd++) {
                  let accumVal = accumRow[colInd];
                  data[rowInd + 1][colInd + 1] = accumVal === undefined ? dependencyValues.defaultEntry.tree : accumVal;
                }
              }
            }


            return { setValue: { value: me.fromAst(newTree) } }


          } else if (operator === "vector" || operator === "tuple") {

            // treat vector/tuple as first column in matrix

            let operands = originalTree.slice(1);

            let newTree = ["matrix",
              ["tuple", numRows, numColumns]
            ];

            let nRowsFound = operands.length;

            let data = newTree[2] = ["tuple"];

            for (let rowInd = 0; rowInd < numRows; rowInd++) {
              data[rowInd + 1] = ["tuple"];

              let minCol = 0;
              if (rowInd < nRowsFound) {
                data[rowInd + 1][1] = operands[rowInd];
                minCol = 1;
              }

              let accumRow = accumulatedComponents[rowInd];
              if (!accumRow) {
                accumRow = [];
              }

              for (let colInd = minCol; colInd < numColumns; colInd++) {
                let accumVal = accumRow[colInd];
                data[rowInd + 1][colInd + 1] = accumVal === undefined ? dependencyValues.defaultEntry.tree : accumVal;
              }
            }

            return { setValue: { value: me.fromAst(newTree) } }

          } else if (Array.isArray(originalTree[1])
            && (originalTree[1][0] === "vector" || originalTree[1][0] === "tuple")
            && ((operator === "^" && originalTree[2] === "T") || operator === "prime")
          ) {

            // treat transpose of vector/tuple as first row in matrix

            let operands = originalTree[1].slice(1, numColumns + 1);

            let newTree = ["matrix",
              ["tuple", numRows, numColumns]
            ];

            let data = newTree[2] = ["tuple"];


            let accumRow = accumulatedComponents[0];
            if (!accumRow) {
              accumRow = [];
            }

            for (let rowInd = 0; rowInd < numRows; rowInd++) {
              data[rowInd + 1] = ["tuple"];

              let accumRow = accumulatedComponents[rowInd];
              if (!accumRow) {
                accumRow = [];
              }

              let minCol = 0;
              if (rowInd === 0) {
                data[rowInd + 1].push(...operands)
                minCol = operands.length;
              }

              for (let colInd = minCol; colInd < numColumns; colInd++) {
                let accumVal = accumRow[colInd];
                data[rowInd + 1][colInd + 1] = accumVal === undefined ? dependencyValues.defaultEntry.tree : accumVal;
              }
            }

            return { setValue: { value: me.fromAst(newTree) } }


          }
        }


        // original value is not a matrix or a vector/tuple
        // use original value for the upper left matrix entry

        let newTree = ["matrix",
          ["tuple", numRows, numColumns]
        ];

        let data = newTree[2] = ["tuple"];

        for (let rowInd = 0; rowInd < numRows; rowInd++) {

          data[rowInd + 1] = ["tuple"];

          let minCol = 0;
          if (rowInd === 0) {
            data[rowInd + 1][1] = originalTree;
            minCol = 1;
          }

          let accumRow = accumulatedComponents[rowInd];
          if (!accumRow) {
            accumRow = [];
          }

          for (let colInd = minCol; colInd < numColumns; colInd++) {
            let accumVal = accumRow[colInd];
            data[rowInd + 1][colInd + 1] = accumVal === undefined ? dependencyValues.defaultEntry.tree : accumVal;
          }
        }

        return { setValue: { value: me.fromAst(newTree) } }


      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let desiredTree = desiredStateVariableValues.value.tree;
        if (Array.isArray(desiredTree)
          && desiredTree[0] === "matrix"
          && desiredTree[1][1] === dependencyValues.numRows
          && desiredTree[1][2] === dependencyValues.numColumns
        ) {

          if (dependencyValues.numColumns === 1) {
            let originalTree = dependencyValues.valueOriginal.tree;
            if (Array.isArray(originalTree)) {

              let operator = originalTree[0];
              if (operator === "vector" || operator === "tuple") {
                // if original value was a vector, then keep it as a vector
                let desiredValue = me.fromAst([operator, ...desiredTree[2].slice(1).map(x => x[1])])
                return {
                  success: true,
                  instructions: [{
                    setDependency: "valueOriginal",
                    desiredValue
                  }]
                }
              }
            }
          } else if (dependencyValues.numRows === 1) {
            let originalTree = dependencyValues.valueOriginal.tree;
            if (Array.isArray(originalTree)) {
              let operator = originalTree[0];

              if (Array.isArray(originalTree[1])
                && (originalTree[1][0] === "vector" || originalTree[1][0] === "tuple")
                && ((operator === "^" && originalTree[2] === "T") || operator === "prime")
              ) {
                // if original value was the transpose of a vector, 
                // then keep it as the transpose of a vector
                let desiredValue = [originalTree[1][0], ...desiredTree[2][1].slice(1)]
                if (operator === "^") {
                  desiredValue = me.fromAst(["^", desiredValue, "T"])
                } else {
                  desiredValue = me.fromAst(["prime", desiredValue])
                }
                return {
                  success: true,
                  instructions: [{
                    setDependency: "valueOriginal",
                    desiredValue
                  }]
                }
              }
            }
          }

          return {
            success: true,
            instructions: [{
              setDependency: "valueOriginal",
              desiredValue: desiredStateVariableValues.value
            }]
          }
        } else {
          return { success: false }
        }
      }
    }

    stateVariableDefinitions.componentDisplayValues = {
      forRenderer: true,
      returnDependencies: () => ({
        valueForDisplay: {
          dependencyType: "stateVariable",
          variableName: "valueForDisplay"
        },
      }),
      definition({ dependencyValues }) {

        let componentDisplayValues = dependencyValues.valueForDisplay.tree[2]
          .slice(1).map(x => x.slice(1).map(y => me.fromAst(y)));

        return { setValue: { componentDisplayValues } };

      }
    }


    // raw value from renderer
    stateVariableDefinitions.rawRendererValues = {
      defaultValue: [],
      forRenderer: true,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          rawRendererValues: true
        }
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "rawRendererValues",
            value: desiredStateVariableValues.rawRendererValues
          }]
        }
      }
    }


    return stateVariableDefinitions;
  }

  async updateRawValues({ rawRendererValues, transient = false }) {
    if (!await this.stateValues.disabled) {
      // we set transient to true so that each keystroke does not
      // add a row to the database

      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "rawRendererValues",
          value: rawRendererValues,
        }],
        transient
      });
    }
  }

  async updateNumRows({ numRows }) {
    console.log(`update num rows to ${numRows}`)
    if (!await this.stateValues.disabled) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "numRows",
          value: numRows,
        }],
      });
    }
  }


  async updateNumColumns({ numColumns }) {
    if (!await this.stateValues.disabled) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "numColumns",
          value: numColumns,
        }],
      });
    }
  }

}