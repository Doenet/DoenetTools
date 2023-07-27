import Input from "./abstract/Input";
import me from "math-expressions";
import { deepClone, deepCompare } from "../utils/deepFunctions";
import {
  convertValueToMathExpression,
  getFromLatex,
  normalizeLatexString,
  roundForDisplay,
  stripLatex,
  vectorOperators,
} from "../utils/math";
import CompositeComponent from "./abstract/CompositeComponent";
import BaseComponent from "./abstract/BaseComponent";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";

const vectorAndListOperators = ["list", ...vectorOperators];

export class MatrixInput extends Input {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      updateNumRows: this.updateNumRows.bind(this),
      updateNumColumns: this.updateNumColumns.bind(this),
    });

    this.externalActions = {};

    //Complex because the stateValues isn't defined until later
    Object.defineProperty(this.externalActions, "submitAnswer", {
      enumerable: true,
      get: async function () {
        let answerAncestor = await this.stateValues.answerAncestor;
        if (answerAncestor !== null) {
          return {
            componentName: answerAncestor.componentName,
            actionName: "submitAnswer",
          };
        } else {
          return;
        }
      }.bind(this),
    });
  }

  static componentType = "matrixInput";

  static variableForPlainMacro = "value";
  static variableForPlainCopy = "value";

  static processWhenJustUpdatedForNewComponent = true;

  static renderChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.numRows = {
      createComponentOfType: "integer",
      createStateVariable: "numRowsPreliminary",
      defaultValue: 1,
      transformNonFiniteTo: 0,
    };
    attributes.numColumns = {
      createComponentOfType: "integer",
      createStateVariable: "numColumnsPreliminary",
      defaultValue: 1,
      transformNonFiniteTo: 0,
    };

    attributes.showSizeControls = {
      createComponentOfType: "boolean",
      createStateVariable: "showSizeControls",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    attributes.defaultEntry = {
      createComponentOfType: "math",
      createStateVariable: "defaultEntry",
      defaultValue: me.fromAst("\uff3f"),
    };

    attributes.prefill = {
      createComponentOfType: "math",
      createStateVariable: "prefill",
      defaultValue: me.fromAst("\uff3f"),
      public: true,
      copyComponentAttributesForCreatedComponent: [
        "format",
        "functionSymbols",
        "splitSymbols",
        "parseScientificNotation",
      ],
    };
    attributes.format = {
      createComponentOfType: "text",
      createStateVariable: "format",
      defaultValue: "text",
      public: true,
    };
    attributes.functionSymbols = {
      createComponentOfType: "textList",
      createStateVariable: "functionSymbols",
      defaultValue: ["f", "g"],
      public: true,
    };
    attributes.splitSymbols = {
      createComponentOfType: "boolean",
      createStateVariable: "splitSymbols",
      defaultValue: true,
      public: true,
    };
    attributes.parseScientificNotation = {
      createComponentOfType: "boolean",
      createStateVariable: "parseScientificNotation",
      defaultValue: false,
      public: true,
    };

    Object.assign(attributes, returnRoundingAttributes());

    attributes.bindValueTo = {
      createComponentOfType: "math",
    };
    attributes.unionFromU = {
      createComponentOfType: "boolean",
      createStateVariable: "unionFromU",
      defaultValue: false,
      public: true,
    };
    attributes.minComponentWidth = {
      createComponentOfType: "integer",
      createStateVariable: "minComponentWidth",
      defaultValue: 0,
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let addMatrixInputGrid = function ({ matchedChildren }) {
      let matrixInputGrid = {
        componentType: "_matrixInputGrid",
      };

      return {
        success: true,
        newChildren: [matrixInputGrid, ...matchedChildren],
      };
    };
    sugarInstructions.push({
      replacementFunction: addMatrixInputGrid,
    });
    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "matrixComponentInputs",
        componentTypes: ["_matrixComponentInput"],
      },
      {
        group: "maths",
        componentTypes: ["math"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    Object.assign(
      stateVariableDefinitions,
      returnRoundingStateVariableDefinitions({
        displayDigitsDefault: 10,
        displaySmallAsZeroDefault: 0,
      }),
    );

    stateVariableDefinitions.valueChanged = {
      public: true,
      hasEssential: true,
      defaultValue: false,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({}),
      definition() {
        return { useEssentialOrDefaultValue: { valueChanged: true } };
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "valueChanged",
              value: Boolean(desiredStateVariableValues.valueChanged),
            },
          ],
        };
      },
    };

    stateVariableDefinitions.valueOriginal = {
      hasEssential: true,
      shadowVariable: true,
      returnDependencies: () => ({
        mathChild: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value"],
          proceedIfAllChildrenNotMatched: true, // to avoid circular dependency with readyToExpandWhenResolved of matrixInputGrid child
        },
        bindValueTo: {
          dependencyType: "attributeComponent",
          attributeName: "bindValueTo",
          variableNames: ["value"],
        },
        prefill: {
          dependencyType: "stateVariable",
          variableName: "prefill",
        },
        defaultEntry: {
          dependencyType: "stateVariable",
          variableName: "defaultEntry",
        },
        valueChanged: {
          dependencyType: "stateVariable",
          variableName: "valueChanged",
          onlyToSetInInverseDefinition: true,
        },
        immediateValueChanged: {
          dependencyType: "stateVariable",
          variableName: "immediateValueChanged",
          onlyToSetInInverseDefinition: true,
        },
      }),
      set: convertValueToMathExpression,
      definition: function ({ dependencyValues, usedDefault }) {
        if (dependencyValues.mathChild.length > 0) {
          return {
            setValue: {
              valueOriginal: dependencyValues.mathChild[0].stateValues.value,
            },
          };
        } else if (dependencyValues.bindValueTo) {
          return {
            setValue: {
              valueOriginal: dependencyValues.bindValueTo.stateValues.value,
            },
          };
        } else {
          let defaultValue = usedDefault.prefill
            ? dependencyValues.defaultEntry
            : dependencyValues.prefill;
          return {
            useEssentialOrDefaultValue: {
              valueOriginal: {
                defaultValue,
              },
            },
          };
        }
      },
      inverseDefinition: function ({
        desiredStateVariableValues,
        dependencyValues,
      }) {
        // console.log(`inverse definition of valueOriginal for matrixInput`);
        // console.log(desiredStateVariableValues);

        let instructions = [
          {
            setDependency: "valueChanged",
            desiredValue: true,
          },
          {
            setDependency: "immediateValueChanged",
            desiredValue: true,
          },
        ];

        if (dependencyValues.mathChild.length > 0) {
          instructions.push({
            setDependency: "mathChild",
            desiredValue: desiredStateVariableValues.valueOriginal,
            variableIndex: 0,
            childIndex: 0,
          });
        } else if (dependencyValues.bindValueTo) {
          instructions.push({
            setDependency: "bindValueTo",
            desiredValue: desiredStateVariableValues.valueOriginal,
            variableIndex: 0,
          });
        } else {
          // no math child or bindValueTo, so valueOriginal is essential and give it the desired value
          instructions.push({
            setEssentialValue: "valueOriginal",
            value: desiredStateVariableValues.valueOriginal,
          });
        }
        return { success: true, instructions };
      },
    };

    stateVariableDefinitions.immediateValueChanged = {
      public: true,
      hasEssential: true,
      defaultValue: false,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({}),
      definition() {
        return { useEssentialOrDefaultValue: { immediateValueChanged: true } };
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "immediateValueChanged",
              value: Boolean(desiredStateVariableValues.immediateValueChanged),
            },
          ],
        };
      },
    };

    stateVariableDefinitions.immediateValueOriginal = {
      hasEssential: true,
      shadowVariable: true,
      returnDependencies: () => ({
        valueOriginal: {
          dependencyType: "stateVariable",
          variableName: "valueOriginal",
        },
        immediateValueChanged: {
          dependencyType: "stateVariable",
          variableName: "immediateValueChanged",
          onlyToSetInInverseDefinition: true,
        },
      }),
      set: convertValueToMathExpression,
      definition: function ({
        dependencyValues,
        changes,
        justUpdatedForNewComponent,
        usedDefault,
      }) {
        // console.log(`definition of immediateValueOriginal`)
        // console.log(dependencyValues)
        // console.log(changes);
        // console.log(dependencyValues.valueOriginal.toString())

        if (
          changes.valueOriginal &&
          !justUpdatedForNewComponent &&
          !usedDefault.valueOriginal
        ) {
          // only update to valueOriginal when it changes
          // (otherwise, let its essential value change)
          return {
            setValue: {
              immediateValueOriginal: dependencyValues.valueOriginal,
            },
            setEssentialValue: {
              immediateValueOriginal: dependencyValues.valueOriginal,
            },
          };
        } else {
          return {
            useEssentialOrDefaultValue: {
              immediateValueOriginal: {
                defaultValue: dependencyValues.valueOriginal,
              },
            },
          };
        }
      },
      inverseDefinition: function ({
        desiredStateVariableValues,
        initialChange,
        shadowedVariable,
      }) {
        // value is essential; give it the desired value
        let instructions = [
          {
            setEssentialValue: "immediateValueOriginal",
            value: desiredStateVariableValues.immediateValueOriginal,
          },
          {
            setDependency: "immediateValueChanged",
            desiredValue: true,
          },
        ];

        // if from outside sources, also set value
        if (!(initialChange || shadowedVariable)) {
          instructions.push({
            setDependency: "valueOriginal",
            desiredValue: desiredStateVariableValues.immediateValueOriginal,
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.haveBoundValue = {
      returnDependencies: () => ({
        mathChild: {
          dependencyType: "child",
          childGroups: ["maths"],
          proceedIfAllChildrenNotMatched: true, // to avoid circular dependency with readyToExpandWhenResolved of matrixInputGrid child
        },
        bindValueTo: {
          dependencyType: "attributeComponent",
          attributeName: "bindValueTo",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            haveBoundValue:
              dependencyValues.mathChild.length > 0 ||
              dependencyValues.bindValueTo !== null,
          },
        };
      },
    };

    stateVariableDefinitions.numRows = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      forRenderer: true,
      returnDependencies: () => ({
        numRowsPreliminary: {
          dependencyType: "stateVariable",
          variableName: "numRowsPreliminary",
        },
        valueOriginal: {
          dependencyType: "stateVariable",
          variableName: "valueOriginal",
        },
        haveBoundValue: {
          dependencyType: "stateVariable",
          variableName: "haveBoundValue",
        },
        valueChanged: {
          dependencyType: "stateVariable",
          variableName: "valueChanged",
          onlyToSetInInverseDefinition: true,
        },
        immediateValueChanged: {
          dependencyType: "stateVariable",
          variableName: "immediateValueChanged",
          onlyToSetInInverseDefinition: true,
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
            } else if (vectorOperators.includes(operator)) {
              numRows = originalTree.length - 1;
            }
          }
        }

        return { setValue: { numRows } };
      },
      async inverseDefinition({
        desiredStateVariableValues,
        dependencyValues,
        stateValues,
      }) {
        let desiredNumRows = desiredStateVariableValues.numRows;
        if (!Number.isInteger(desiredNumRows)) {
          return { success: false };
        }
        desiredNumRows = Math.max(0, desiredNumRows);

        let instructions = [
          {
            setDependency: "numRowsPreliminary",
            desiredValue: desiredNumRows,
          },
          { setDependency: "valueChanged", desiredValue: true },
          { setDependency: "immediateValueChanged", desiredValue: true },
        ];

        if (dependencyValues.haveBoundValue) {
          let originalTree = dependencyValues.valueOriginal.tree;
          let defaultEntryTree = (await stateValues.defaultEntry).tree;
          if (
            (await stateValues.numColumns) === 1 &&
            Array.isArray(originalTree) &&
            vectorOperators.includes(originalTree[0])
          ) {
            // original value was a vector
            // so we keep it a vector

            let currentNumRows = originalTree.length - 1;

            if (desiredNumRows < currentNumRows) {
              let newTree = deepClone(originalTree).slice(
                0,
                desiredNumRows + 1,
              );
              instructions.push({
                setDependency: "valueOriginal",
                desiredValue: me.fromAst(newTree),
              });
            } else if (desiredNumRows > currentNumRows) {
              let newTree = deepClone(originalTree);
              let accumulatedComponents =
                await stateValues.accumulatedComponents;
              for (
                let rowInd = currentNumRows;
                rowInd < desiredNumRows;
                rowInd++
              ) {
                let accumRow = accumulatedComponents[rowInd];
                let accumVal;
                if (accumRow) {
                  accumVal = accumRow[0];
                }
                newTree[rowInd + 1] =
                  accumVal === undefined ? defaultEntryTree : accumVal;
              }
              instructions.push({
                setDependency: "valueOriginal",
                desiredValue: me.fromAst(newTree),
              });
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
                let accumulatedComponents =
                  await stateValues.accumulatedComponents;

                for (
                  let rowInd = previousNumRows;
                  rowInd < desiredNumRows;
                  rowInd++
                ) {
                  if (!data[rowInd + 1]) {
                    data[rowInd + 1] = ["tuple"];
                  }

                  let accumRow = accumulatedComponents[rowInd];
                  if (!accumRow) {
                    accumRow = [];
                  }

                  for (let colInd = 0; colInd < numColumns; colInd++) {
                    let accumVal = accumRow[colInd];
                    data[rowInd + 1][colInd + 1] =
                      accumVal === undefined ? defaultEntryTree : accumVal;
                  }
                }
              }

              instructions.push({
                setDependency: "valueOriginal",
                desiredValue: me.fromAst(valueTree),
              });
            }
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.numColumns = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      forRenderer: true,
      returnDependencies: () => ({
        numColumnsPreliminary: {
          dependencyType: "stateVariable",
          variableName: "numColumnsPreliminary",
        },
        valueOriginal: {
          dependencyType: "stateVariable",
          variableName: "valueOriginal",
        },
        haveBoundValue: {
          dependencyType: "stateVariable",
          variableName: "haveBoundValue",
        },
        valueChanged: {
          dependencyType: "stateVariable",
          variableName: "valueChanged",
          onlyToSetInInverseDefinition: true,
        },
        immediateValueChanged: {
          dependencyType: "stateVariable",
          variableName: "immediateValueChanged",
          onlyToSetInInverseDefinition: true,
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        let numColumns = dependencyValues.numColumnsPreliminary;

        if (
          usedDefault.numColumnsPreliminary ||
          dependencyValues.haveBoundValue
        ) {
          let originalTree = dependencyValues.valueOriginal.tree;

          numColumns = 1;

          if (Array.isArray(originalTree)) {
            let operator = originalTree[0];
            if (operator === "matrix") {
              numColumns = originalTree[1][2];
            } else if (
              Array.isArray(originalTree[1]) &&
              vectorOperators.includes(originalTree[1][0]) &&
              ((operator === "^" && originalTree[2] === "T") ||
                operator === "prime")
            ) {
              numColumns = originalTree[1].length - 1;
            }
          }
        }

        return { setValue: { numColumns } };
      },
      async inverseDefinition({
        desiredStateVariableValues,
        dependencyValues,
        stateValues,
      }) {
        let desiredNumColumns = desiredStateVariableValues.numColumns;
        if (!Number.isInteger(desiredNumColumns)) {
          return { success: false };
        }
        desiredNumColumns = Math.max(0, desiredNumColumns);

        let instructions = [
          {
            setDependency: "numColumnsPreliminary",
            desiredValue: desiredNumColumns,
          },
          { setDependency: "valueChanged", desiredValue: true },
          { setDependency: "immediateValueChanged", desiredValue: true },
        ];

        if (dependencyValues.haveBoundValue) {
          let defaultEntryTree = (await stateValues.defaultEntry).tree;
          let originalTree = dependencyValues.valueOriginal.tree;
          let operator = originalTree[0];

          if (
            Array.isArray(originalTree[1]) &&
            vectorOperators.includes(originalTree[1][0]) &&
            ((operator === "^" && originalTree[2] === "T") ||
              operator === "prime")
          ) {
            // original value was a transpose of a vector
            // so we keep it a transpose of a vector

            let currentNumColumns = originalTree[1].length - 1;

            if (desiredNumColumns < currentNumColumns) {
              let newTree = deepClone(originalTree);
              newTree[1] = newTree[1].slice(0, desiredNumColumns + 1);
              instructions.push({
                setDependency: "valueOriginal",
                desiredValue: me.fromAst(newTree),
              });
            } else if (desiredNumColumns > currentNumColumns) {
              let newTree = deepClone(originalTree);
              let accumRow = (await stateValues.accumulatedComponents)[0];
              if (!accumRow) {
                accumRow = [];
              }

              for (
                let colInd = currentNumColumns;
                colInd < desiredNumColumns;
                colInd++
              ) {
                let accumVal = accumRow[colInd];
                newTree[1][colInd + 1] =
                  accumVal === undefined ? defaultEntryTree : accumVal;
              }
              instructions.push({
                setDependency: "valueOriginal",
                desiredValue: me.fromAst(newTree),
              });
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
                let accumulatedComponents =
                  await stateValues.accumulatedComponents;
                for (let rowInd = 0; rowInd < numRows; rowInd++) {
                  let accumRow = accumulatedComponents[rowInd];
                  if (!accumRow) {
                    accumRow = [];
                  }

                  for (
                    let colInd = previousNumColumns;
                    colInd < desiredNumColumns;
                    colInd++
                  ) {
                    let accumVal = accumRow[colInd];
                    data[rowInd + 1][colInd + 1] =
                      accumVal === undefined ? defaultEntryTree : accumVal;
                  }
                }
              }

              instructions.push({
                setDependency: "valueOriginal",
                desiredValue: me.fromAst(valueTree),
              });
            }
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.accumulatedComponents = {
      providePreviousValuesInDefinition: true,
      returnDependencies: () => ({
        valueOriginal: {
          dependencyType: "stateVariable",
          variableName: "valueOriginal",
        },
      }),
      definition({ dependencyValues, previousValues }) {
        let accumulatedComponents = [];
        if (previousValues.accumulatedComponents) {
          accumulatedComponents = deepClone(
            previousValues.accumulatedComponents,
          );
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

            return { setValue: { accumulatedComponents } };
          } else if (vectorOperators.includes(operator)) {
            // treat vector/tuple as first column in matrix

            for (let [rowInd, comp] of originalTree.slice(1).entries()) {
              let accumRow = accumulatedComponents[rowInd];
              if (!accumRow) {
                accumRow = accumulatedComponents[rowInd] = [];
              }
              accumRow[0] = comp;
            }

            return { setValue: { accumulatedComponents } };
          } else if (
            Array.isArray(originalTree[1]) &&
            vectorOperators.includes(originalTree[1][0]) &&
            ((operator === "^" && originalTree[2] === "T") ||
              operator === "prime")
          ) {
            // treat transpose of vector/tuple as first row in matrix

            let accumRow = accumulatedComponents[0];
            if (!accumRow) {
              accumRow = accumulatedComponents[0] = [];
            }
            for (let [colInd, comp] of originalTree[1].slice(1).entries()) {
              accumRow[colInd] = comp;
            }

            return { setValue: { accumulatedComponents } };
          }
        }

        let accumRow = accumulatedComponents[0];
        if (!accumRow) {
          accumRow = accumulatedComponents[0] = [];
        }
        accumRow[0] = originalTree;

        return { setValue: { accumulatedComponents } };
      },
    };

    stateVariableDefinitions.componentValues = {
      isArray: true,
      entryPrefixes: ["componentValue"],
      numDimensions: 2,
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
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          valueOriginal: {
            dependencyType: "stateVariable",
            variableName: "valueOriginal",
          },
          numRows: {
            dependencyType: "stateVariable",
            variableName: "numRows",
          },
          numColumns: {
            dependencyType: "stateVariable",
            variableName: "numColumns",
          },
          accumulatedComponents: {
            dependencyType: "stateVariable",
            variableName: "accumulatedComponents",
          },
          defaultEntry: {
            dependencyType: "stateVariable",
            variableName: "defaultEntry",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
        let originalTree = globalDependencyValues.valueOriginal.tree;
        let accumulatedComponents =
          globalDependencyValues.accumulatedComponents;

        let numRows = globalDependencyValues.numRows;
        let numColumns = globalDependencyValues.numColumns;

        if (Array.isArray(originalTree)) {
          let operator = originalTree[0];
          if (operator === "matrix") {
            if (
              originalTree[1][1] === numRows &&
              originalTree[1][2] === numColumns
            ) {
              let componentValues = {};
              let originalData = originalTree[2];

              for (let rowInd = 0; rowInd < numRows; rowInd++) {
                for (let colInd = 0; colInd < numColumns; colInd++) {
                  let arrayKey = `${rowInd},${colInd}`;
                  componentValues[arrayKey] = me.fromAst(
                    originalData[rowInd + 1][colInd + 1],
                  );
                }
              }

              return { setValue: { componentValues } };
            }

            let originalNumRows = originalTree[1][1];
            let originalNumColumns = originalTree[1][2];

            let componentValues = {};
            let originalData = originalTree[2];

            let numOverlapRows = Math.min(numRows, originalNumRows);
            let numOverlapColumns = Math.min(numColumns, originalNumColumns);

            // copy original values from overlap between original size and current size
            for (let rowInd = 0; rowInd < numOverlapRows; rowInd++) {
              for (let colInd = 0; colInd < numOverlapColumns; colInd++) {
                let arrayKey = `${rowInd},${colInd}`;
                componentValues[arrayKey] = me.fromAst(
                  originalData[rowInd + 1][colInd + 1],
                );
              }
            }

            if (numColumns > originalNumColumns) {
              // add any extra columns to existing rows
              for (let rowInd = 0; rowInd < numOverlapRows; rowInd++) {
                let accumRow = accumulatedComponents[rowInd];
                for (
                  let colInd = originalNumColumns;
                  colInd < numColumns;
                  colInd++
                ) {
                  let accumVal = accumRow[colInd];
                  let arrayKey = `${rowInd},${colInd}`;
                  componentValues[arrayKey] = me.fromAst(
                    accumVal === undefined
                      ? globalDependencyValues.defaultEntry.tree
                      : accumVal,
                  );
                }
              }
            }

            if (numRows > originalNumRows) {
              // add any extra rows
              for (let rowInd = originalNumRows; rowInd < numRows; rowInd++) {
                let accumRow = accumulatedComponents[rowInd];
                if (!accumRow) {
                  accumRow = [];
                }
                for (let colInd = 0; colInd < numColumns; colInd++) {
                  let accumVal = accumRow[colInd];
                  let arrayKey = `${rowInd},${colInd}`;
                  componentValues[arrayKey] = me.fromAst(
                    accumVal === undefined
                      ? globalDependencyValues.defaultEntry.tree
                      : accumVal,
                  );
                }
              }
            }

            return { setValue: { componentValues } };
          } else if (vectorOperators.includes(operator)) {
            // treat vector/tuple as first column in matrix

            let operands = originalTree.slice(1);

            let numRowsFound = operands.length;

            let componentValues = {};

            for (let rowInd = 0; rowInd < numRows; rowInd++) {
              let minCol = 0;
              if (rowInd < numRowsFound) {
                let arrayKey = `${rowInd},${0}`;
                componentValues[arrayKey] = me.fromAst(operands[rowInd]);
                minCol = 1;
              }

              let accumRow = accumulatedComponents[rowInd];
              if (!accumRow) {
                accumRow = [];
              }

              for (let colInd = minCol; colInd < numColumns; colInd++) {
                let accumVal = accumRow[colInd];
                let arrayKey = `${rowInd},${colInd}`;
                componentValues[arrayKey] = me.fromAst(
                  accumVal === undefined
                    ? globalDependencyValues.defaultEntry.tree
                    : accumVal,
                );
              }
            }

            return { setValue: { componentValues } };
          } else if (
            Array.isArray(originalTree[1]) &&
            vectorOperators.includes(originalTree[1][0]) &&
            ((operator === "^" && originalTree[2] === "T") ||
              operator === "prime")
          ) {
            // treat transpose of vector/tuple as first row in matrix

            let operands = originalTree[1].slice(1, numColumns + 1);

            let accumRow = accumulatedComponents[0];
            if (!accumRow) {
              accumRow = [];
            }

            let componentValues = {};

            for (let rowInd = 0; rowInd < numRows; rowInd++) {
              let accumRow = accumulatedComponents[rowInd];
              if (!accumRow) {
                accumRow = [];
              }

              let minCol = 0;
              if (rowInd === 0) {
                for (let colInd = 0; colInd < operands.length; colInd++) {
                  let arrayKey = `${0},${colInd}`;
                  componentValues[arrayKey] = me.fromAst(operands[colInd]);
                }
                minCol = operands.length;
              }

              for (let colInd = minCol; colInd < numColumns; colInd++) {
                let accumVal = accumRow[colInd];
                let arrayKey = `${rowInd},${colInd}`;
                componentValues[arrayKey] = me.fromAst(
                  accumVal === undefined
                    ? globalDependencyValues.defaultEntry.tree
                    : accumVal,
                );
              }
            }

            return { setValue: { componentValues } };
          }
        }

        // original value is not a matrix or a vector/tuple
        // use original value for the upper left matrix entry

        let componentValues = {};

        for (let rowInd = 0; rowInd < numRows; rowInd++) {
          let minCol = 0;
          if (rowInd === 0) {
            let arrayKey = `${0},${0}`;
            componentValues[arrayKey] = me.fromAst(originalTree);
            minCol = 1;
          }

          let accumRow = accumulatedComponents[rowInd];
          if (!accumRow) {
            accumRow = [];
          }

          for (let colInd = minCol; colInd < numColumns; colInd++) {
            let accumVal = accumRow[colInd];
            let arrayKey = `${rowInd},${colInd}`;
            componentValues[arrayKey] = me.fromAst(
              accumVal === undefined
                ? globalDependencyValues.defaultEntry.tree
                : accumVal,
            );
          }
        }

        return { setValue: { componentValues } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        initialChange,
        workspace,
      }) {
        // merge components from desiredStateVariableValues.componentValues
        // workspace.valueData,
        // creating it from valueOriginal if not defined yet

        let numRows = globalDependencyValues.numRows;
        let numColumns = globalDependencyValues.numColumns;

        let originalIsColumnVector = false;
        let originalIsRowVector = false;
        let originalIsMatrix = false;

        let originalTree = globalDependencyValues.valueOriginal.tree;
        if (Array.isArray(originalTree)) {
          let operator = originalTree[0];
          if (vectorOperators.includes(operator)) {
            originalIsColumnVector = true;
          } else if (operator === "matrix") {
            originalIsMatrix = true;
          } else if (
            Array.isArray(originalTree[1]) &&
            vectorOperators.includes(originalTree[1][0]) &&
            ((operator === "^" && originalTree[2] === "T") ||
              operator === "prime")
          ) {
            originalIsRowVector = true;
          }
        }

        let valueData;

        if (workspace.valueData) {
          valueData = workspace.valueData.map((x) => [...x]);
        } else {
          let originalTree = globalDependencyValues.valueOriginal.tree;

          if (originalIsColumnVector) {
            // valueOriginal is a column vector, which we cut down to size
            // and/or pad with blanks

            valueData = originalTree.slice(1, 1 + numRows).map((x) => [x]);
            if (valueData.length < numRows) {
              // pad first column with blanks
              for (let rowInd = valueData.length; rowInd < numRows; rowInd++) {
                valueData.push([globalDependencyValues.defaultEntry.tree]);
              }
            }
            if (numColumns > 1) {
              // add additional blank columns
              for (let rowInd = 0; rowInd < numRows; rowInd++) {
                valueData[rowInd].push(
                  ...Array(numColumns - 1).fill(
                    globalDependencyValues.defaultEntry.tree,
                  ),
                );
              }
            }
          } else if (originalIsRowVector) {
            // valueOriginal is a row vector, which we cut down to size
            // and/or pad with blanks

            valueData = [originalTree[1].slice(1, 1 + numColumns)];

            if (valueData[0].length < numColumns) {
              // pad first row with blanks
              valueData[0].push(
                ...Array(numColumns - valueData[0].length).fill(
                  globalDependencyValues.defaultEntry.tree,
                ),
              );
            }

            if (numRows > 1) {
              for (let rowInd = 1; rowInd < numRows; rowInd++) {
                valueData.push(
                  Array(numColumns).fill(
                    globalDependencyValues.defaultEntry.tree,
                  ),
                );
              }
            }
          } else if (originalIsMatrix) {
            // valueOriginal is a matrix, which we cut down to size
            // and/or pad with blanks
            valueData = originalTree[2]
              .slice(1, numRows + 1)
              .map((x) => x.slice(1, numColumns + 1));

            if (valueData[0].length < numColumns) {
              // pad existing rows with blanks
              for (let rowInd = 0; rowInd < valueData.length; rowInd++) {
                valueData[rowInd].push(
                  ...Array(numColumns - valueData[rowInd].length).fill(
                    globalDependencyValues.defaultEntry.tree,
                  ),
                );
              }
            }

            if (valueData.length < numRows) {
              for (let rowInd = valueData.length; rowInd < numRows; rowInd++) {
                valueData.push(
                  Array(numColumns).fill(
                    globalDependencyValues.defaultEntry.tree,
                  ),
                );
              }
            }
          } else {
            // valueOriginal isn't a vector or matrix, so use as upper left entry
            valueData = [[originalTree]];
            if (numColumns > 1) {
              // pad first row with blanks
              valueData[0].push(
                ...Array(numColumns - 1).fill(
                  globalDependencyValues.defaultEntry.tree,
                ),
              );
            }

            if (numRows > 1) {
              for (let rowInd = 1; rowInd < numRows; rowInd++) {
                valueData.push(
                  Array(numColumns).fill(
                    globalDependencyValues.defaultEntry.tree,
                  ),
                );
              }
            }
          }
        }

        for (let arrayKey in desiredStateVariableValues.componentValues) {
          let [rowInd, colInd] = arrayKey.split(",");
          valueData[rowInd][colInd] = convertValueToMathExpression(
            desiredStateVariableValues.componentValues[arrayKey],
          ).tree;
        }

        workspace.valueData = valueData;

        if (numColumns === 1 && originalIsColumnVector) {
          let operator = globalDependencyValues.valueOriginal.tree[0];
          let desiredValue = me.fromAst([
            operator,
            ...valueData.map((x) => x[0]),
          ]);
          return {
            success: true,
            instructions: [
              {
                setDependency: "valueOriginal",
                desiredValue,
                treatAsInitialChange: initialChange,
              },
            ],
          };
        } else if (numRows === 1 && originalIsRowVector) {
          let originalTree = globalDependencyValues.valueOriginal.tree;
          let operator = originalTree[0];

          let desiredValue = [originalTree[1][0], ...valueData[0]];
          if (operator === "^") {
            desiredValue = me.fromAst(["^", desiredValue, "T"]);
          } else {
            desiredValue = me.fromAst(["prime", desiredValue]);
          }

          return {
            success: true,
            instructions: [
              {
                setDependency: "valueOriginal",
                desiredValue,
                treatAsInitialChange: initialChange,
              },
            ],
          };
        } else {
          let desiredValueTree = [
            "matrix",
            [
              "tuple",
              globalDependencyValues.numRows,
              globalDependencyValues.numColumns,
            ],
            ["tuple", ...valueData.map((x) => ["tuple", ...x])],
          ];

          return {
            success: true,
            instructions: [
              {
                setDependency: "valueOriginal",
                desiredValue: me.fromAst(desiredValueTree),
                treatAsInitialChange: initialChange,
              },
            ],
          };
        }
      },
    };

    stateVariableDefinitions.componentImmediateValues = {
      isArray: true,
      entryPrefixes: ["componentImmediateValue"],
      numDimensions: 2,
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
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          immediateValueOriginal: {
            dependencyType: "stateVariable",
            variableName: "immediateValueOriginal",
          },
          numRows: {
            dependencyType: "stateVariable",
            variableName: "numRows",
          },
          numColumns: {
            dependencyType: "stateVariable",
            variableName: "numColumns",
          },
          accumulatedComponents: {
            dependencyType: "stateVariable",
            variableName: "accumulatedComponents",
          },
          defaultEntry: {
            dependencyType: "stateVariable",
            variableName: "defaultEntry",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
        let originalTree = globalDependencyValues.immediateValueOriginal.tree;
        let accumulatedComponents =
          globalDependencyValues.accumulatedComponents;

        let numRows = globalDependencyValues.numRows;
        let numColumns = globalDependencyValues.numColumns;

        if (Array.isArray(originalTree)) {
          let operator = originalTree[0];
          if (operator === "matrix") {
            if (
              originalTree[1][1] === numRows &&
              originalTree[1][2] === numColumns
            ) {
              let componentImmediateValues = {};
              let originalData = originalTree[2];

              for (let rowInd = 0; rowInd < numRows; rowInd++) {
                for (let colInd = 0; colInd < numColumns; colInd++) {
                  let arrayKey = `${rowInd},${colInd}`;
                  componentImmediateValues[arrayKey] = me.fromAst(
                    originalData[rowInd + 1][colInd + 1],
                  );
                }
              }

              return { setValue: { componentImmediateValues } };
            }

            let originalNumRows = originalTree[1][1];
            let originalNumColumns = originalTree[1][2];

            let componentImmediateValues = {};
            let originalData = originalTree[2];

            let numOverlapRows = Math.min(numRows, originalNumRows);
            let numOverlapColumns = Math.min(numColumns, originalNumColumns);

            // copy original values from overlap between original size and current size
            for (let rowInd = 0; rowInd < numOverlapRows; rowInd++) {
              for (let colInd = 0; colInd < numOverlapColumns; colInd++) {
                let arrayKey = `${rowInd},${colInd}`;
                componentImmediateValues[arrayKey] = me.fromAst(
                  originalData[rowInd + 1][colInd + 1],
                );
              }
            }

            if (numColumns > originalNumColumns) {
              // add any extra columns to existing rows
              for (let rowInd = 0; rowInd < numOverlapRows; rowInd++) {
                let accumRow = accumulatedComponents[rowInd];
                for (
                  let colInd = originalNumColumns;
                  colInd < numColumns;
                  colInd++
                ) {
                  let accumVal = accumRow[colInd];
                  let arrayKey = `${rowInd},${colInd}`;
                  componentImmediateValues[arrayKey] = me.fromAst(
                    accumVal === undefined
                      ? globalDependencyValues.defaultEntry.tree
                      : accumVal,
                  );
                }
              }
            }

            if (numRows > originalNumRows) {
              // add any extra rows
              for (let rowInd = originalNumRows; rowInd < numRows; rowInd++) {
                let accumRow = accumulatedComponents[rowInd];
                if (!accumRow) {
                  accumRow = [];
                }
                for (let colInd = 0; colInd < numColumns; colInd++) {
                  let accumVal = accumRow[colInd];
                  let arrayKey = `${rowInd},${colInd}`;
                  componentImmediateValues[arrayKey] = me.fromAst(
                    accumVal === undefined
                      ? globalDependencyValues.defaultEntry.tree
                      : accumVal,
                  );
                }
              }
            }

            return { setValue: { componentImmediateValues } };
          } else if (vectorOperators.includes(operator)) {
            // treat vector/tuple as first column in matrix

            let operands = originalTree.slice(1);

            let numRowsFound = operands.length;

            let componentImmediateValues = {};

            for (let rowInd = 0; rowInd < numRows; rowInd++) {
              let minCol = 0;
              if (rowInd < numRowsFound) {
                let arrayKey = `${rowInd},${0}`;
                componentImmediateValues[arrayKey] = me.fromAst(
                  operands[rowInd],
                );
                minCol = 1;
              }

              let accumRow = accumulatedComponents[rowInd];
              if (!accumRow) {
                accumRow = [];
              }

              for (let colInd = minCol; colInd < numColumns; colInd++) {
                let accumVal = accumRow[colInd];
                let arrayKey = `${rowInd},${colInd}`;
                componentImmediateValues[arrayKey] = me.fromAst(
                  accumVal === undefined
                    ? globalDependencyValues.defaultEntry.tree
                    : accumVal,
                );
              }
            }

            return { setValue: { componentImmediateValues } };
          } else if (
            Array.isArray(originalTree[1]) &&
            vectorOperators.includes(originalTree[1][0]) &&
            ((operator === "^" && originalTree[2] === "T") ||
              operator === "prime")
          ) {
            // treat transpose of vector/tuple as first row in matrix

            let operands = originalTree[1].slice(1, numColumns + 1);

            let accumRow = accumulatedComponents[0];
            if (!accumRow) {
              accumRow = [];
            }

            let componentImmediateValues = {};

            for (let rowInd = 0; rowInd < numRows; rowInd++) {
              let accumRow = accumulatedComponents[rowInd];
              if (!accumRow) {
                accumRow = [];
              }

              let minCol = 0;
              if (rowInd === 0) {
                for (let colInd = 0; colInd < operands.length; colInd++) {
                  let arrayKey = `${0},${colInd}`;
                  componentImmediateValues[arrayKey] = me.fromAst(
                    operands[colInd],
                  );
                }
                minCol = operands.length;
              }

              for (let colInd = minCol; colInd < numColumns; colInd++) {
                let accumVal = accumRow[colInd];
                let arrayKey = `${rowInd},${colInd}`;
                componentImmediateValues[arrayKey] = me.fromAst(
                  accumVal === undefined
                    ? globalDependencyValues.defaultEntry.tree
                    : accumVal,
                );
              }
            }

            return { setValue: { componentImmediateValues } };
          }
        }

        // original value is not a matrix or a vector/tuple
        // use original value for the upper left matrix entry

        let componentImmediateValues = {};

        for (let rowInd = 0; rowInd < numRows; rowInd++) {
          let minCol = 0;
          if (rowInd === 0) {
            let arrayKey = `${0},${0}`;
            componentImmediateValues[arrayKey] = me.fromAst(originalTree);
            minCol = 1;
          }

          let accumRow = accumulatedComponents[rowInd];
          if (!accumRow) {
            accumRow = [];
          }

          for (let colInd = minCol; colInd < numColumns; colInd++) {
            let accumVal = accumRow[colInd];
            let arrayKey = `${rowInd},${colInd}`;
            componentImmediateValues[arrayKey] = me.fromAst(
              accumVal === undefined
                ? globalDependencyValues.defaultEntry.tree
                : accumVal,
            );
          }
        }

        return { setValue: { componentImmediateValues } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        initialChange,
        workspace,
      }) {
        // merge components from desiredStateVariableValues.componentImmediateValues
        // workspace.immediateValueData,
        // creating it from immediateValueOriginal if not defined yet

        let numRows = globalDependencyValues.numRows;
        let numColumns = globalDependencyValues.numColumns;

        let originalIsColumnVector = false;
        let originalIsRowVector = false;
        let originalIsMatrix = false;

        let originalTree = globalDependencyValues.immediateValueOriginal.tree;
        if (Array.isArray(originalTree)) {
          let operator = originalTree[0];
          if (vectorOperators.includes(operator)) {
            originalIsColumnVector = true;
          } else if (operator === "matrix") {
            originalIsMatrix = true;
          } else if (
            Array.isArray(originalTree[1]) &&
            vectorOperators.includes(originalTree[1][0]) &&
            ((operator === "^" && originalTree[2] === "T") ||
              operator === "prime")
          ) {
            originalIsRowVector = true;
          }
        }

        let immediateValueData;

        if (workspace.immediateValueData) {
          immediateValueData = workspace.immediateValueData.map((x) => [...x]);
        } else {
          let originalTree = globalDependencyValues.immediateValueOriginal.tree;

          if (originalIsColumnVector) {
            // immediateValueOriginal is a column vector, which we cut down to size
            // and/or pad with blanks

            immediateValueData = originalTree
              .slice(1, 1 + numRows)
              .map((x) => [x]);
            if (immediateValueData.length < numRows) {
              // pad first column with blanks
              for (
                let rowInd = immediateValueData.length;
                rowInd < numRows;
                rowInd++
              ) {
                immediateValueData.push([
                  globalDependencyValues.defaultEntry.tree,
                ]);
              }
            }
            if (numColumns > 1) {
              // add additional blank columns
              for (let rowInd = 0; rowInd < numRows; rowInd++) {
                immediateValueData[rowInd].push(
                  ...Array(numColumns - 1).fill(
                    globalDependencyValues.defaultEntry.tree,
                  ),
                );
              }
            }
          } else if (originalIsRowVector) {
            // immediateValueOriginal is a row vector, which we cut down to size
            // and/or pad with blanks

            immediateValueData = [originalTree[1].slice(1, 1 + numColumns)];

            if (immediateValueData[0].length < numColumns) {
              // pad first row with blanks
              immediateValueData[0].push(
                ...Array(numColumns - immediateValueData[0].length).fill(
                  globalDependencyValues.defaultEntry.tree,
                ),
              );
            }

            if (numRows > 1) {
              for (let rowInd = 1; rowInd < numRows; rowInd++) {
                immediateValueData.push(
                  Array(numColumns).fill(
                    globalDependencyValues.defaultEntry.tree,
                  ),
                );
              }
            }
          } else if (originalIsMatrix) {
            // immediateValueOriginal is a matrix, which we cut down to size
            // and/or pad with blanks
            immediateValueData = originalTree[2]
              .slice(1, numRows + 1)
              .map((x) => x.slice(1, numColumns + 1));

            if (immediateValueData[0].length < numColumns) {
              // pad existing rows with blanks
              for (
                let rowInd = 0;
                rowInd < immediateValueData.length;
                rowInd++
              ) {
                immediateValueData[rowInd].push(
                  ...Array(numColumns - immediateValueData[rowInd].length).fill(
                    globalDependencyValues.defaultEntry.tree,
                  ),
                );
              }
            }

            if (immediateValueData.length < numRows) {
              for (
                let rowInd = immediateValueData.length;
                rowInd < numRows;
                rowInd++
              ) {
                immediateValueData.push(
                  Array(numColumns).fill(
                    globalDependencyValues.defaultEntry.tree,
                  ),
                );
              }
            }
          } else {
            // immediateValueOriginal isn't a vector or matrix, so use as upper left entry
            immediateValueData = [[originalTree]];
            if (numColumns > 1) {
              // pad first row with blanks
              immediateValueData[0].push(
                ...Array(numColumns - 1).fill(
                  globalDependencyValues.defaultEntry.tree,
                ),
              );
            }

            if (numRows > 1) {
              for (let rowInd = 1; rowInd < numRows; rowInd++) {
                immediateValueData.push(
                  Array(numColumns).fill(
                    globalDependencyValues.defaultEntry.tree,
                  ),
                );
              }
            }
          }
        }

        for (let arrayKey in desiredStateVariableValues.componentImmediateValues) {
          let [rowInd, colInd] = arrayKey.split(",");
          immediateValueData[rowInd][colInd] = convertValueToMathExpression(
            desiredStateVariableValues.componentImmediateValues[arrayKey],
          ).tree;
        }

        workspace.immediateValueData = immediateValueData;

        if (numColumns === 1 && originalIsColumnVector) {
          let operator = globalDependencyValues.immediateValueOriginal.tree[0];
          let desiredValue = me.fromAst([
            operator,
            ...immediateValueData.map((x) => x[0]),
          ]);
          return {
            success: true,
            instructions: [
              {
                setDependency: "immediateValueOriginal",
                desiredValue,
                treatAsInitialChange: initialChange,
              },
            ],
          };
        } else if (numRows === 1 && originalIsRowVector) {
          let originalTree = globalDependencyValues.immediateValueOriginal.tree;
          let operator = originalTree[0];

          let desiredValue = [originalTree[1][0], ...immediateValueData[0]];
          if (operator === "^") {
            desiredValue = me.fromAst(["^", desiredValue, "T"]);
          } else {
            desiredValue = me.fromAst(["prime", desiredValue]);
          }

          return {
            success: true,
            instructions: [
              {
                setDependency: "immediateValueOriginal",
                desiredValue,
                treatAsInitialChange: initialChange,
              },
            ],
          };
        } else {
          let desiredValueTree = [
            "matrix",
            [
              "tuple",
              globalDependencyValues.numRows,
              globalDependencyValues.numColumns,
            ],
            ["tuple", ...immediateValueData.map((x) => ["tuple", ...x])],
          ];

          return {
            success: true,
            instructions: [
              {
                setDependency: "immediateValueOriginal",
                desiredValue: me.fromAst(desiredValueTree),
                treatAsInitialChange: initialChange,
              },
            ],
          };
        }
      },
    };

    stateVariableDefinitions.componentValuesForDisplay = {
      isArray: true,
      entryPrefixes: ["componentValueForDisplay"],
      numDimensions: 2,
      forRenderer: true,
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
        let globalDependencies = {
          displayDigits: {
            dependencyType: "stateVariable",
            variableName: "displayDigits",
          },
          displayDecimals: {
            dependencyType: "stateVariable",
            variableName: "displayDecimals",
          },
          displaySmallAsZero: {
            dependencyType: "stateVariable",
            variableName: "displaySmallAsZero",
          },
        };

        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let [rowInd, colInd] = arrayKey.split(",");
          let varEnding = Number(rowInd) + 1 + "_" + (Number(colInd) + 1);

          dependenciesByKey[arrayKey] = {
            componentValue: {
              dependencyType: "stateVariable",
              variableName: `componentValue${varEnding}`,
            },
          };
        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        let componentValuesForDisplay = {};

        for (let arrayKey of arrayKeys) {
          // round any decimal numbers to the significant digits
          // determined by displaydigits or displaydecimals
          let rounded = roundForDisplay({
            value: dependencyValuesByKey[arrayKey].componentValue,
            dependencyValues: globalDependencyValues,
          });

          componentValuesForDisplay[arrayKey] = rounded;
        }

        return { setValue: { componentValuesForDisplay } };
      },
    };

    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        componentValues: {
          dependencyType: "stateVariable",
          variableName: "componentValues",
        },
        numRows: {
          dependencyType: "stateVariable",
          variableName: "numRows",
        },
        numColumns: {
          dependencyType: "stateVariable",
          variableName: "numColumns",
        },
        // value original is just for inverse definition
        valueOriginal: {
          dependencyType: "stateVariable",
          variableName: "valueOriginal",
        },
      }),
      definition({ dependencyValues }) {
        let numRows = dependencyValues.numRows;
        let numColumns = dependencyValues.numColumns;

        let newTree = ["matrix", ["tuple", numRows, numColumns]];

        let data = (newTree[2] = ["tuple"]);

        for (let rowInd = 0; rowInd < numRows; rowInd++) {
          data[rowInd + 1] = ["tuple"];

          for (let colInd = 0; colInd < numColumns; colInd++) {
            data[rowInd + 1][colInd + 1] =
              dependencyValues.componentValues[rowInd][colInd].tree;
          }
        }

        return { setValue: { value: me.fromAst(newTree) } };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let desiredTree = desiredStateVariableValues.value.tree;
        if (Array.isArray(desiredTree) && desiredTree[0] === "matrix") {
          if (
            desiredTree[1][1] === dependencyValues.numRows &&
            desiredTree[1][2] === dependencyValues.numColumns
          ) {
            if (dependencyValues.numColumns === 1) {
              let originalTree = dependencyValues.valueOriginal.tree;
              if (Array.isArray(originalTree)) {
                let operator = originalTree[0];
                if (vectorOperators.includes(operator)) {
                  // if original value was a vector, then keep it as a vector
                  let desiredValue = me.fromAst([
                    operator,
                    ...desiredTree[2].slice(1).map((x) => x[1]),
                  ]);
                  return {
                    success: true,
                    instructions: [
                      {
                        setDependency: "valueOriginal",
                        desiredValue,
                      },
                    ],
                  };
                }
              }
            } else if (dependencyValues.numRows === 1) {
              let originalTree = dependencyValues.valueOriginal.tree;
              if (Array.isArray(originalTree)) {
                let operator = originalTree[0];

                if (
                  Array.isArray(originalTree[1]) &&
                  vectorOperators.includes(originalTree[1][0]) &&
                  ((operator === "^" && originalTree[2] === "T") ||
                    operator === "prime")
                ) {
                  // if original value was the transpose of a vector,
                  // then keep it as the transpose of a vector
                  let desiredValue = [
                    originalTree[1][0],
                    ...desiredTree[2][1].slice(1),
                  ];
                  if (operator === "^") {
                    desiredValue = me.fromAst(["^", desiredValue, "T"]);
                  } else {
                    desiredValue = me.fromAst(["prime", desiredValue]);
                  }
                  return {
                    success: true,
                    instructions: [
                      {
                        setDependency: "valueOriginal",
                        desiredValue,
                      },
                    ],
                  };
                }
              }
            }
          }

          return {
            success: true,
            instructions: [
              {
                setDependency: "valueOriginal",
                desiredValue: desiredStateVariableValues.value,
              },
            ],
          };
        } else {
          return { success: false };
        }
      },
    };

    stateVariableDefinitions.immediateValue = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        componentImmediateValues: {
          dependencyType: "stateVariable",
          variableName: "componentImmediateValues",
        },
        numRows: {
          dependencyType: "stateVariable",
          variableName: "numRows",
        },
        numColumns: {
          dependencyType: "stateVariable",
          variableName: "numColumns",
        },
        // immediateValue original is just for inverse definition
        immediateValueOriginal: {
          dependencyType: "stateVariable",
          variableName: "immediateValueOriginal",
        },
      }),
      definition({ dependencyValues }) {
        let numRows = dependencyValues.numRows;
        let numColumns = dependencyValues.numColumns;

        let newTree = ["matrix", ["tuple", numRows, numColumns]];

        let data = (newTree[2] = ["tuple"]);

        for (let rowInd = 0; rowInd < numRows; rowInd++) {
          data[rowInd + 1] = ["tuple"];

          for (let colInd = 0; colInd < numColumns; colInd++) {
            data[rowInd + 1][colInd + 1] =
              dependencyValues.componentImmediateValues[rowInd][colInd].tree;
          }
        }

        return { setValue: { immediateValue: me.fromAst(newTree) } };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let desiredTree = desiredStateVariableValues.immediateValue.tree;
        if (Array.isArray(desiredTree) && desiredTree[0] === "matrix") {
          if (
            desiredTree[1][1] === dependencyValues.numRows &&
            desiredTree[1][2] === dependencyValues.numColumns
          ) {
            if (dependencyValues.numColumns === 1) {
              let originalTree = dependencyValues.immediateValueOriginal.tree;
              if (Array.isArray(originalTree)) {
                let operator = originalTree[0];
                if (vectorOperators.includes(operator)) {
                  // if original immediateValue was a vector, then keep it as a vector
                  let desiredValue = me.fromAst([
                    operator,
                    ...desiredTree[2].slice(1).map((x) => x[1]),
                  ]);
                  return {
                    success: true,
                    instructions: [
                      {
                        setDependency: "immediateValueOriginal",
                        desiredValue,
                      },
                    ],
                  };
                }
              }
            } else if (dependencyValues.numRows === 1) {
              let originalTree = dependencyValues.immediateValueOriginal.tree;
              if (Array.isArray(originalTree)) {
                let operator = originalTree[0];

                if (
                  Array.isArray(originalTree[1]) &&
                  vectorOperators.includes(originalTree[1][0]) &&
                  ((operator === "^" && originalTree[2] === "T") ||
                    operator === "prime")
                ) {
                  // if original immediateValue was the transpose of a vector,
                  // then keep it as the transpose of a vector
                  let desiredValue = [
                    originalTree[1][0],
                    ...desiredTree[2][1].slice(1),
                  ];
                  if (operator === "^") {
                    desiredValue = me.fromAst(["^", desiredValue, "T"]);
                  } else {
                    desiredValue = me.fromAst(["prime", desiredValue]);
                  }
                  return {
                    success: true,
                    instructions: [
                      {
                        setDependency: "immediateValueOriginal",
                        desiredValue,
                      },
                    ],
                  };
                }
              }
            }
          }

          return {
            success: true,
            instructions: [
              {
                setDependency: "immediateValueOriginal",
                desiredValue: desiredStateVariableValues.immediateValue,
              },
            ],
          };
        } else {
          return { success: false };
        }
      },
    };

    stateVariableDefinitions.valueForDisplay = {
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits",
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals",
        },
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero",
        },
      }),
      definition: function ({ dependencyValues }) {
        // round any decimal numbers to the significant digits
        // determined by displaydigits or displaydecimals
        let rounded = roundForDisplay({
          value: dependencyValues.value,
          dependencyValues,
        });

        return {
          setValue: { valueForDisplay: rounded },
        };
      },
    };

    stateVariableDefinitions.matrix = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "matrixEntry") {
            return [];
          } else if (prefix === "row") {
            return [["matrix", "matrixRow"]];
          } else if (prefix === "column") {
            return [["matrix", "matrixColumn"]];
          } else {
            // entire matrix
            // wrap inner dimension by matrixRow and outer dimension by matrix
            // don't wrap outer dimension (for entire array)
            return [["matrixRow"], ["matrix"]];
          }
        },
      },
      isArray: true,
      numDimensions: 2,
      entryPrefixes: ["matrixEntry", "row", "column", "rows", "columns"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "matrixEntry") {
          // matrixEntry1_2 is the 2nd entry from the first row
          let indices = varEnding.split("_").map((x) => Number(x) - 1);
          if (
            indices.length === 2 &&
            indices.every((x) => Number.isInteger(x) && x >= 0)
          ) {
            if (arraySize) {
              if (indices.every((x, i) => x < arraySize[i])) {
                return [String(indices)];
              } else {
                return [];
              }
            } else {
              // If not given the array size,
              // then return the array keys assuming the array is large enough.
              // Must do this as it is used to determine potential array entries.
              return [String(indices)];
            }
          } else {
            return [];
          }
        } else if (arrayEntryPrefix === "row") {
          // row3 is all components of the third row

          let rowInd = Number(varEnding) - 1;
          if (!(Number.isInteger(rowInd) && rowInd >= 0)) {
            return [];
          }

          if (!arraySize) {
            // If don't have array size, we just need to determine if it is a potential entry.
            // Return the first entry assuming array is large enough
            return [rowInd + ",0"];
          }
          if (rowInd < arraySize[0]) {
            // array of "rowInd,i", where i=0, ..., arraySize[1]-1
            return Array.from(Array(arraySize[1]), (_, i) => rowInd + "," + i);
          } else {
            return [];
          }
        } else if (arrayEntryPrefix === "column") {
          // column3 is all components of the third column

          let colInd = Number(varEnding) - 1;
          if (!(Number.isInteger(colInd) && colInd >= 0)) {
            return [];
          }

          if (!arraySize) {
            // If don't have array size, we just need to determine if it is a potential entry.
            // Return the first entry assuming array is large enough
            return ["0," + colInd];
          }
          if (colInd < arraySize[1]) {
            // array of "i,colInd", where i=0, ..., arraySize[1]-1
            return Array.from(Array(arraySize[0]), (_, i) => i + "," + colInd);
          } else {
            return [];
          }
        } else if (
          arrayEntryPrefix === "rows" ||
          arrayEntryPrefix === "columns"
        ) {
          // rows or columns is the whole matrix
          // (this are designed for getting rows and columns using propIndex)
          // (rows and matrix are the same, but rows is added to be parallel to columns)

          if (!arraySize) {
            // If don't have array size, we justr eturn the first entry
            return ["0,0"];
          }
          let keys = [];
          for (let rowInd = 0; rowInd < arraySize[0]; rowInd++) {
            keys.push(
              ...Array.from(Array(arraySize[1]), (_, i) => rowInd + "," + i),
            );
          }
          return keys;
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "matrix" || varName === "rows") {
          if (propIndex.length === 1) {
            return "row" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `matrixEntry${propIndex[0]}_${propIndex[1]}`;
          }
        }
        if (varName === "columns") {
          if (propIndex.length === 1) {
            return "column" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `matrixEntry${propIndex[1]}_${propIndex[0]}`;
          }
        }
        if (varName.slice(0, 3) === "row") {
          let rowNum = Number(varName.slice(3));
          if (Number.isInteger(rowNum) && rowNum > 0) {
            // if propIndex has additional entries, ignore them
            return `matrixEntry${rowNum}_${propIndex[0]}`;
          }
        }
        if (varName.slice(0, 6) === "column") {
          let colNum = Number(varName.slice(6));
          if (Number.isInteger(colNum) && colNum > 0) {
            // if propIndex has additional entries, ignore them
            return `matrixEntry${propIndex[0]}_${colNum}`;
          }
        }
        return null;
      },
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
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          value: {
            dependencyType: "stateVariable",
            variableName: "value",
          },
        };
        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues, arraySize }) {
        let tree = globalDependencyValues.value.tree;

        let createdMatrix = false;

        let matrix = {};
        if (Array.isArray(tree)) {
          if (vectorAndListOperators.includes(tree[0])) {
            for (let ind = 0; ind < arraySize[0]; ind++) {
              matrix[ind + ",0"] = me.fromAst(tree[ind + 1]);
            }
            createdMatrix = true;
          } else if (tree[0] === "matrix") {
            let matVals = tree[2];
            for (let i = 0; i < arraySize[0]; i++) {
              for (let j = 0; j < arraySize[1]; j++) {
                matrix[`${i},${j}`] = me.fromAst(matVals[i + 1][j + 1]);
              }
            }
            createdMatrix = true;
          } else if (
            vectorOperators.includes(tree[1][0]) &&
            ((tree[0] === "^" && tree[2] === "T") || tree[0] === "prime")
          ) {
            for (let ind = 0; ind < arraySize[1]; ind++) {
              matrix["0," + ind] = me.fromAst(tree[1][ind + 1]);
            }
            createdMatrix = true;
          }
        }
        if (!createdMatrix) {
          matrix["0,0"] = globalDependencyValues.value;
        }

        return { setValue: { matrix } };
      },
      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        stateValues,
        workspace,
        arraySize,
      }) {
        // in case just one ind specified, merge with previous values
        if (!workspace.desiredMatrix) {
          workspace.desiredMatrix = [];
        }
        for (let i = 0; i < arraySize[0]; i++) {
          for (let j = 0; j < arraySize[1]; j++) {
            let arrayKey = i + "," + j;
            if (desiredStateVariableValues.matrix[arrayKey] !== undefined) {
              workspace.desiredMatrix[arrayKey] = convertValueToMathExpression(
                desiredStateVariableValues.matrix[arrayKey],
              );
            } else if (workspace.desiredMatrix[arrayKey] === undefined) {
              workspace.desiredMatrix[arrayKey] = (await stateValues.matrix)[i][
                j
              ];
            }
          }
        }

        let desiredValue;
        let tree = globalDependencyValues.value.tree;
        if (Array.isArray(tree)) {
          if (vectorAndListOperators.includes(tree[0])) {
            desiredValue = [tree[0]];
            for (let ind = 0; ind < arraySize[0]; ind++) {
              desiredValue.push(workspace.desiredMatrix[ind + ",0"].tree);
            }
          } else if (tree[0] === "matrix") {
            let desiredMatrixVals = ["tuple"];

            for (let i = 0; i < arraySize[0]; i++) {
              let row = ["tuple"];
              for (let j = 0; j < arraySize[1]; j++) {
                row.push(workspace.desiredMatrix[`${i},${j}`].tree);
              }
              desiredMatrixVals.push(row);
            }
            desiredValue = me.fromAst(["matrix", tree[1], desiredMatrixVals]);
          } else if (
            vectorOperators.includes(tree[1][0]) &&
            ((tree[0] === "^" && tree[2] === "T") || tree[0] === "prime")
          ) {
            desiredValue = [tree[0]];
            let desiredVector = [tree[1][0]];
            for (let ind = 0; ind < arraySize[1]; ind++) {
              desiredVector.push(workspace.desiredMatrix["0," + ind].tree);
            }
            desiredValue = [tree[0], desiredVector];
            if (tree[2]) {
              desiredValue.push(tree[2]);
            }
            desiredValue = me.fromAst(desiredValue);
          }
        }

        if (!desiredValue) {
          desiredValue = workspace.desiredMatrix["0,0"];
        }

        let instructions = [
          {
            setDependency: "value",
            desiredValue,
          },
        ];

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { componentType: "matrix" } }),
    };

    stateVariableDefinitions.childIndicesToRender = {
      returnDependencies: () => ({
        numRows: {
          dependencyType: "stateVariable",
          variableName: "numRows",
        },
        numColumns: {
          dependencyType: "stateVariable",
          variableName: "numColumns",
        },
      }),
      definition({ dependencyValues }) {
        let nChildrenToRender =
          dependencyValues.numRows * dependencyValues.numColumns;

        return {
          setValue: {
            childIndicesToRender: [...Array(nChildrenToRender).keys()],
          },
        };
      },
    };

    return stateVariableDefinitions;
  }

  async updateNumRows({
    numRows,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.disabled)) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "numRows",
            value: numRows,
          },
        ],
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    }
  }

  async updateNumColumns({
    numColumns,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.disabled)) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "numColumns",
            value: numColumns,
          },
        ],
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    }
  }

  static adapters = [
    {
      stateVariable: "value",
      stateVariablesToShadow: Object.keys(
        returnRoundingStateVariableDefinitions(),
      ),
    },
  ];
}

export class MatrixInputGrid extends CompositeComponent {
  static componentType = "_matrixInputGrid";

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numRows = {
      returnDependencies: () => ({
        parentNumRows: {
          dependencyType: "parentStateVariable",
          parentComponentType: "matrixInput",
          variableName: "numRows",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { numRows: dependencyValues.parentNumRows },
        };
      },
    };

    stateVariableDefinitions.numColumns = {
      returnDependencies: () => ({
        parentNumColumns: {
          dependencyType: "parentStateVariable",
          parentComponentType: "matrixInput",
          variableName: "numColumns",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { numColumns: dependencyValues.parentNumColumns },
        };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        numRows: {
          dependencyType: "stateVariable",
          variableName: "numRows",
        },
        numColumns: {
          dependencyType: "stateVariable",
          variableName: "numColumns",
        },
      }),
      markStale() {
        return { updateReplacements: true };
      },
      definition() {
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    componentInfoObjects,
    flags,
    workspace,
  }) {
    let serializedComponents = [];

    let numRows = await component.stateValues.numRows;

    workspace.previousNumRows = numRows;

    for (let rowInd = 0; rowInd < numRows; rowInd++) {
      serializedComponents.push({
        componentType: "_matrixInputRow",
        state: { rowInd },
        uniqueIdentifier: rowInd,
      });
    }

    return { replacements: serializedComponents, errors: [], warnings: [] };
  }

  static async calculateReplacementChanges({
    component,
    componentChanges,
    componentInfoObjects,
    flags,
    workspace,
  }) {
    let replacementChanges = [];

    let previousNumRows = workspace.previousNumRows;
    let numRows = await component.stateValues.numRows;

    let newReplacementsToWithhold;

    let numReplacementsToAdd = 0;

    // if have fewer replacements than before
    // mark old replacements as hidden
    if (numRows < previousNumRows) {
      newReplacementsToWithhold = component.replacements.length - numRows;

      let replacementInstruction = {
        changeType: "changeReplacementsToWithhold",
        replacementsToWithhold: newReplacementsToWithhold,
      };
      replacementChanges.push(replacementInstruction);
    } else if (numRows > previousNumRows) {
      numReplacementsToAdd = numRows - previousNumRows;

      if (component.replacementsToWithhold > 0) {
        if (component.replacementsToWithhold >= numReplacementsToAdd) {
          newReplacementsToWithhold =
            component.replacementsToWithhold - numReplacementsToAdd;
          previousNumRows += numReplacementsToAdd;
          numReplacementsToAdd = 0;

          let replacementInstruction = {
            changeType: "changeReplacementsToWithhold",
            replacementsToWithhold: newReplacementsToWithhold,
          };
          replacementChanges.push(replacementInstruction);
        } else {
          numReplacementsToAdd -= component.replacementsToWithhold;
          previousNumRows += component.replacementsToWithhold;
          newReplacementsToWithhold = 0;
          // don't need to send changedReplacementsToWithold instructions
          // since will send add instructions,
          // which will also recalculate replacements in parent
        }
      }
    }

    if (numReplacementsToAdd > 0) {
      // Need to add more replacement components

      let newSerializedReplacements = [];

      for (let rowInd = previousNumRows; rowInd < numRows; rowInd++) {
        newSerializedReplacements.push({
          componentType: "_matrixInputRow",
          state: { rowInd },
          uniqueIdentifier: rowInd,
        });
      }

      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: previousNumRows,
        serializedReplacements: newSerializedReplacements,
        replacementsToWithhold: 0,
        assignNamesOffset: previousNumRows,
      };
      replacementChanges.push(replacementInstruction);
    }

    workspace.previousNumRows = numRows;

    return replacementChanges;
  }
}

export class MatrixInputRow extends CompositeComponent {
  static componentType = "_matrixInputRow";

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // matrixInputRow should be created as a replacement from matrixInputGrid
    // and given rowInd in the essential state
    stateVariableDefinitions.rowInd = {
      hasEssential: true,
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: { rowInd: true },
      }),
    };

    stateVariableDefinitions.numColumns = {
      returnDependencies: () => ({
        parentNumColumns: {
          dependencyType: "parentStateVariable",
          parentComponentType: "matrixInput",
          variableName: "numColumns",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { numColumns: dependencyValues.parentNumColumns },
        };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        numColumns: {
          dependencyType: "stateVariable",
          variableName: "numColumns",
        },
      }),
      markStale() {
        return { updateReplacements: true };
      },
      definition() {
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    componentInfoObjects,
    flags,
    workspace,
  }) {
    let serializedComponents = [];

    let numColumns = await component.stateValues.numColumns;
    let rowInd = await component.stateValues.rowInd;

    workspace.previousNumColumns = numColumns;

    for (let colInd = 0; colInd < numColumns; colInd++) {
      serializedComponents.push({
        componentType: "_matrixComponentInput",
        state: {
          rowInd,
          colInd,
        },
        uniqueIdentifier: colInd,
      });
    }

    return { replacements: serializedComponents, errors: [], warnings: [] };
  }

  static async calculateReplacementChanges({
    component,
    componentChanges,
    componentInfoObjects,
    flags,
    workspace,
  }) {
    let replacementChanges = [];

    let previousNumColumns = workspace.previousNumColumns;
    let numColumns = await component.stateValues.numColumns;
    let rowInd = await component.stateValues.rowInd;

    let newReplacementsToWithhold;

    let numReplacementsToAdd = 0;

    // if have fewer replacements than before
    // mark old replacements as hidden
    if (numColumns < previousNumColumns) {
      newReplacementsToWithhold = component.replacements.length - numColumns;

      let replacementInstruction = {
        changeType: "changeReplacementsToWithhold",
        replacementsToWithhold: newReplacementsToWithhold,
      };
      replacementChanges.push(replacementInstruction);
    } else if (numColumns > previousNumColumns) {
      numReplacementsToAdd = numColumns - previousNumColumns;

      if (component.replacementsToWithhold > 0) {
        if (component.replacementsToWithhold >= numReplacementsToAdd) {
          newReplacementsToWithhold =
            component.replacementsToWithhold - numReplacementsToAdd;
          previousNumColumns += numReplacementsToAdd;
          numReplacementsToAdd = 0;

          let replacementInstruction = {
            changeType: "changeReplacementsToWithhold",
            replacementsToWithhold: newReplacementsToWithhold,
          };
          replacementChanges.push(replacementInstruction);
        } else {
          numReplacementsToAdd -= component.replacementsToWithhold;
          previousNumColumns += component.replacementsToWithhold;
          newReplacementsToWithhold = 0;
          // don't need to send changedReplacementsToWithold instructions
          // since will send add instructions,
          // which will also recalculate replacements in parent
        }
      }
    }

    if (numReplacementsToAdd > 0) {
      // Need to add more replacement components

      let newSerializedReplacements = [];

      for (let colInd = previousNumColumns; colInd < numColumns; colInd++) {
        newSerializedReplacements.push({
          componentType: "_matrixComponentInput",
          state: {
            rowInd,
            colInd,
          },
          uniqueIdentifier: colInd,
        });
      }

      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: previousNumColumns,
        serializedReplacements: newSerializedReplacements,
        replacementsToWithhold: 0,
        assignNamesOffset: previousNumColumns,
      };
      replacementChanges.push(replacementInstruction);
    }

    workspace.previousNumColumns = numColumns;

    return replacementChanges;
  }
}

export default class MatrixComponentInput extends BaseComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      updateRawValue: this.updateRawValue.bind(this),
      updateValue: this.updateValue.bind(this),
    });
  }
  static componentType = "_matrixComponentInput";
  static rendererType = "mathInput";

  static variableForPlainMacro = "value";
  static variableForPlainCopy = "value";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.minWidth = {
      forRenderer: true,
      returnDependencies: () => ({
        matrixInputAncestor: {
          dependencyType: "ancestor",
          componentType: "matrixInput",
          variableNames: ["minComponentWidth"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.matrixInputAncestor) {
          return {
            setValue: {
              minWidth:
                dependencyValues.matrixInputAncestor.stateValues
                  .minComponentWidth,
            },
          };
        } else {
          return { setValue: { minWidth: 0 } };
        }
      },
    };

    // matrixComponentInput should be created as a replacement from matrixInputRow
    // and given rowInd and colInd in the essential state
    stateVariableDefinitions.rowInd = {
      hasEssential: true,
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: { rowInd: true },
      }),
    };

    stateVariableDefinitions.colInd = {
      hasEssential: true,
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: { colInd: true },
      }),
    };

    // don't specify attributes on matrixComponentInput
    // instead gets these state variables from the parent matrixInput:
    // format, functionSymbols, splitSymbols, parseScientificNotation
    // displayDigits, displayDecimals, displaySmallAsZero, unionFromU
    stateVariableDefinitions.format = {
      returnDependencies: () => ({
        parentFormat: {
          dependencyType: "parentStateVariable",
          parentComponentType: "matrixInput",
          variableName: "format",
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { format: dependencyValues.parentFormat } };
      },
    };

    stateVariableDefinitions.functionSymbols = {
      returnDependencies: () => ({
        parentFunctionSymbols: {
          dependencyType: "parentStateVariable",
          parentComponentType: "matrixInput",
          variableName: "functionSymbols",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { functionSymbols: dependencyValues.parentFunctionSymbols },
        };
      },
    };

    stateVariableDefinitions.splitSymbols = {
      returnDependencies: () => ({
        parentSplitSymbols: {
          dependencyType: "parentStateVariable",
          parentComponentType: "matrixInput",
          variableName: "splitSymbols",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { splitSymbols: dependencyValues.parentSplitSymbols },
        };
      },
    };

    stateVariableDefinitions.parseScientificNotation = {
      returnDependencies: () => ({
        parentParseScientificNotation: {
          dependencyType: "parentStateVariable",
          parentComponentType: "matrixInput",
          variableName: "parseScientificNotation",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            parseScientificNotation:
              dependencyValues.parentParseScientificNotation,
          },
        };
      },
    };

    stateVariableDefinitions.displayDigits = {
      returnDependencies: () => ({
        parentDisplayDigits: {
          dependencyType: "parentStateVariable",
          parentComponentType: "matrixInput",
          variableName: "displayDigits",
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        let result = {
          setValue: { displayDigits: dependencyValues.parentDisplayDigits },
        };

        if (usedDefault.parentDisplayDigits) {
          result.markAsUsedDefault = { displayDigits: true };
        }

        return result;
      },
    };

    stateVariableDefinitions.displayDecimals = {
      returnDependencies: () => ({
        parentDisplayDecimals: {
          dependencyType: "parentStateVariable",
          parentComponentType: "matrixInput",
          variableName: "displayDecimals",
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        let result = {
          setValue: { displayDecimals: dependencyValues.parentDisplayDecimals },
        };

        if (usedDefault.parentDisplayDecimals) {
          result.markAsUsedDefault = { displayDecimals: true };
        }

        return result;
      },
    };

    stateVariableDefinitions.displaySmallAsZero = {
      returnDependencies: () => ({
        parentDisplaySmallAsZero: {
          dependencyType: "parentStateVariable",
          parentComponentType: "matrixInput",
          variableName: "displaySmallAsZero",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            displaySmallAsZero: dependencyValues.parentDisplaySmallAsZero,
          },
        };
      },
    };

    stateVariableDefinitions.unionFromU = {
      returnDependencies: () => ({
        parentUnionFromU: {
          dependencyType: "parentStateVariable",
          parentComponentType: "matrixInput",
          variableName: "unionFromU",
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { unionFromU: dependencyValues.parentUnionFromU } };
      },
    };

    // get value from parent matrixInput
    // using specified rowInd and colInd
    stateVariableDefinitions.value = {
      stateVariablesDeterminingDependencies: ["rowInd", "colInd"],
      returnDependencies: ({ stateValues }) => {
        let varEnding = "";
        if (stateValues.rowInd !== null && stateValues.colInd !== null) {
          varEnding = `${stateValues.rowInd + 1}_${stateValues.colInd + 1}`;
        }
        return {
          parentComponentValue: {
            dependencyType: "parentStateVariable",
            parentComponentType: "matrixInput",
            variableName: `componentValue${varEnding}`,
          },
        };
      },
      definition: function ({ dependencyValues }) {
        // in case size of matrix has shrunk so this component is withheld,
        // check to make sure we are getting a value

        if (dependencyValues.parentComponentValue) {
          return { setValue: { value: dependencyValues.parentComponentValue } };
        } else {
          return { setValue: { value: me.fromAst("\uff3f") } };
        }
      },
      inverseDefinition: function ({
        desiredStateVariableValues,
        dependencyValues,
      }) {
        let instructions = [
          {
            setDependency: "parentComponentValue",
            desiredValue: desiredStateVariableValues.value,
          },
        ];

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.immediateValue = {
      stateVariablesDeterminingDependencies: ["rowInd", "colInd"],
      returnDependencies: ({ stateValues }) => {
        let varEnding = "";
        if (stateValues.rowInd !== null && stateValues.colInd !== null) {
          varEnding = `${stateValues.rowInd + 1}_${stateValues.colInd + 1}`;
        }
        return {
          parentComponentImmediateValue: {
            dependencyType: "parentStateVariable",
            parentComponentType: "matrixInput",
            variableName: `componentImmediateValue${varEnding}`,
          },
        };
      },
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            immediateValue: dependencyValues.parentComponentImmediateValue,
          },
        };
      },
      inverseDefinition: function ({
        desiredStateVariableValues,
        initialChange,
      }) {
        let instructions = [
          {
            setDependency: "parentComponentImmediateValue",
            desiredValue: desiredStateVariableValues.immediateValue,
            treatAsInitialChange: initialChange,
          },
        ];

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.valueForDisplay = {
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits",
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals",
        },
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero",
        },
      }),
      definition: function ({ dependencyValues }) {
        // round any decimal numbers to the significant digits
        // determined by displaydigits or displaydecimals
        let rounded = roundForDisplay({
          value: dependencyValues.value,
          dependencyValues,
        });

        return {
          setValue: { valueForDisplay: rounded },
        };
      },
    };

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        valueForDisplay: {
          dependencyType: "stateVariable",
          variableName: "valueForDisplay",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: { text: dependencyValues.valueForDisplay.toString() },
        };
      },
    };

    // raw value from renderer
    stateVariableDefinitions.rawRendererValue = {
      forRenderer: true,
      hasEssential: true,
      shadowVariable: true,
      defaultValue: "",
      provideEssentialValuesInDefinition: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      additionalStateVariablesDefined: [
        {
          variableName: "lastValueForDisplay",
          hasEssential: true,
          shadowVariable: true,
          defaultValue: null,
          set: convertValueToMathExpression,
        },
      ],
      returnDependencies: () => ({
        // include immediateValue for inverse definition
        immediateValue: {
          dependencyType: "stateVariable",
          variableName: "immediateValue",
        },
        valueForDisplay: {
          dependencyType: "stateVariable",
          variableName: "valueForDisplay",
        },
      }),
      definition({ dependencyValues, essentialValues }) {
        // console.log(`definition of raw value for ${componentName}`)
        // console.log(dependencyValues, essentialValues)

        // use deepCompare of trees rather than equalsViaSyntax
        // so even tiny numerical differences that within double precision are detected
        if (
          essentialValues.rawRendererValue === undefined ||
          !deepCompare(
            essentialValues.lastValueForDisplay.tree,
            dependencyValues.valueForDisplay.tree,
          )
        ) {
          let rawRendererValue = stripLatex(
            dependencyValues.valueForDisplay.toLatex(),
          );
          if (rawRendererValue === "\uff3f") {
            rawRendererValue = "";
          }
          return {
            setValue: {
              rawRendererValue,
              lastValueForDisplay: dependencyValues.valueForDisplay,
            },
            setEssentialValue: {
              rawRendererValue,
              lastValueForDisplay: dependencyValues.valueForDisplay,
            },
          };
        } else {
          return {
            useEssentialOrDefaultValue: {
              rawRendererValue: true,
              lastValueForDisplay: true,
            },
          };
        }
      },
      async inverseDefinition({
        desiredStateVariableValues,
        stateValues,
        essentialValues,
      }) {
        // console.log(`inverse definition of rawRenderer value for ${componentName}`, desiredStateVariableValues, essentialValues)

        const calculateMathExpressionFromLatex = async (text) => {
          let expression;

          text = normalizeLatexString(text, {
            unionFromU: await stateValues.unionFromU,
          });

          // replace ^25 with ^{2}5, since mathQuill uses standard latex conventions
          // unlike math-expression's latex parser
          text = text.replace(/\^(\w)/g, "^{$1}");

          let fromLatex = getFromLatex({
            functionSymbols: await stateValues.functionSymbols,
            splitSymbols: await stateValues.splitSymbols,
            parseScientificNotation: await stateValues.parseScientificNotation,
          });

          try {
            expression = fromLatex(text);
          } catch (e) {
            // TODO: error on bad text
            expression = me.fromAst("\uFF3F");
          }
          return expression;
        };

        let instructions = [];

        if (typeof desiredStateVariableValues.rawRendererValue === "string") {
          let currentValue = essentialValues.rawRendererValue;
          let desiredValue = desiredStateVariableValues.rawRendererValue;

          if (currentValue !== desiredValue) {
            instructions.push({
              setEssentialValue: "rawRendererValue",
              value: desiredValue,
            });
          }

          let currentMath = await calculateMathExpressionFromLatex(
            currentValue,
          );
          let desiredMath = await calculateMathExpressionFromLatex(
            desiredValue,
          );

          // use deepCompare of trees rather than equalsViaSyntax
          // so even tiny numerical differences that within double precision are detected
          if (!deepCompare(desiredMath.tree, currentMath.tree)) {
            instructions.push({
              setDependency: "immediateValue",
              desiredValue: desiredMath,
              treatAsInitialChange: true, // so does not change value
            });
          }
        } else {
          // since desired value was not a string, it must be a math-expression
          // always update lastValueForDisplay
          // update rawRendererValue
          // if desired expression is different from math-expression obtained from current raw value
          // do not update immediate value

          instructions.push({
            setEssentialValue: "lastValueForDisplay",
            value: desiredStateVariableValues.rawRendererValue,
          });

          let currentMath = await calculateMathExpressionFromLatex(
            essentialValues.rawRendererValue,
          );

          // use deepCompare of trees rather than equalsViaSyntax
          // so even tiny numerical differences that within double precision are detected
          if (
            !deepCompare(
              desiredStateVariableValues.rawRendererValue.tree,
              currentMath.tree,
            )
          ) {
            let desiredValue = stripLatex(
              desiredStateVariableValues.rawRendererValue.toLatex(),
            );
            if (desiredValue === "\uff3f") {
              desiredValue = "";
            }
            instructions.push({
              setEssentialValue: "rawRendererValue",
              value: desiredValue,
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { componentType: "math" } }),
    };

    return stateVariableDefinitions;
  }

  async updateRawValue({
    rawRendererValue,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.disabled)) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "rawRendererValue",
            value: rawRendererValue,
          },
          {
            updateType: "setComponentNeedingUpdateValue",
            componentName: this.componentName,
          },
        ],
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    }
  }

  async updateValue({
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.disabled)) {
      let immediateValue = await this.stateValues.immediateValue;

      if (
        !deepCompare((await this.stateValues.value).tree, immediateValue.tree)
      ) {
        let updateInstructions = [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "value",
            value: immediateValue,
          },
          // in case value ended up being a different value than requested
          // we set immediate value to whatever was the result
          // (hence the need to execute update first)
          {
            updateType: "executeUpdate",
          },
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "immediateValue",
            valueOfStateVariable: "value",
          },
          {
            updateType: "unsetComponentNeedingUpdateValue",
          },
        ];

        if (immediateValue.tree !== "\uff3f") {
          updateInstructions.push({
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "rawRendererValue",
            valueOfStateVariable: "valueForDisplay",
          });
        }

        let event = {
          verb: "answered",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            response: immediateValue,
            responseText: immediateValue.toString(),
          },
        };

        let answerAncestor = await this.stateValues.answerAncestor;
        if (answerAncestor) {
          event.context = {
            answerAncestor: answerAncestor.componentName,
          };
        }

        await this.coreFunctions.performUpdate({
          updateInstructions,
          actionId,
          sourceInformation,
          skipRendererUpdate: true,
          event,
        });

        return await this.coreFunctions.triggerChainedActions({
          componentName: this.componentName,
          actionId,
          sourceInformation,
          skipRendererUpdate,
        });
      } else {
        // set raw renderer value to save it to the database,
        // as it might not have been saved
        // given that updateRawValue is transient
        await this.coreFunctions.performUpdate({
          updateInstructions: [
            {
              updateType: "updateValue",
              componentName: this.componentName,
              stateVariable: "rawRendererValue",
              valueOfStateVariable: "rawRendererValue",
            },
          ],
          actionId,
          sourceInformation,
          skipRendererUpdate,
        });
      }
    }
  }
}
