import {
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
import MathComponent from "./Math";
import me from "math-expressions";

export default class Matrix extends MathComponent {
  static componentType = "matrix";
  static rendererType = "math";

  static returnChildGroups() {
    return [
      {
        group: "rows",
        componentTypes: ["matrixRow"],
      },
      {
        group: "columns",
        componentTypes: ["matrixColumn"],
      },
      {
        group: "maths",
        componentTypes: ["math"],
      },
    ];
  }

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    Object.assign(attributes, returnRoundingAttributes());

    attributes.defaultEntry = {
      createComponentOfType: "math",
      createStateVariable: "defaultEntry",
      defaultValue: me.fromAst(0),
    };
    attributes.numRows = {
      createComponentOfType: "integer",
    };
    attributes.numColumns = {
      createComponentOfType: "integer",
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let replaceRowAndColumnChildren = function ({
      matchedChildren,
      componentInfoObjects,
    }) {
      if (matchedChildren.length === 0) {
        return { success: false };
      }

      let newChildren = [];

      let foundRowsOrColumns = false;

      for (let child of matchedChildren) {
        if (typeof child === "string") {
          continue;
        }
        if (!child.doenetAttributes) {
          child.doenetAttributes = {};
        }
        if (child.componentType === "column") {
          child.doenetAttributes.createNameFromComponentType = "column";
          child.componentType = "matrixColumn";
          foundRowsOrColumns = true;
        } else if (child.componentType === "row") {
          child.doenetAttributes.createNameFromComponentType = "row";
          child.componentType = "matrixRow";
          foundRowsOrColumns = true;
        } else if (
          child.attributes?.createComponentOfType?.primitive === "column"
        ) {
          child.doenetAttributes.createNameFromComponentType = "column";
          child.attributes.createComponentOfType.primitive = "matrixColumn";
          foundRowsOrColumns = true;
        } else if (
          child.attributes?.createComponentOfType?.primitive === "row"
        ) {
          child.doenetAttributes.createNameFromComponentType = "row";
          child.attributes.createComponentOfType.primitive = "matrixRow";
          foundRowsOrColumns = true;
        }

        newChildren.push(child);
      }

      if (!foundRowsOrColumns) {
        if (
          matchedChildren.length > 1 ||
          !componentInfoObjects.componentIsSpecifiedType(
            matchedChildren[0],
            "math",
          )
        ) {
          newChildren = [
            {
              componentType: "math",
              children: matchedChildren,
            },
          ];
        }
      }

      return {
        success: true,
        newChildren,
      };
    };

    sugarInstructions.push({
      replacementFunction: replaceRowAndColumnChildren,
    });

    return sugarInstructions;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.codePre;
    delete stateVariableDefinitions.mathChildrenFunctionSymbols;
    delete stateVariableDefinitions.expressionWithCodes;
    delete stateVariableDefinitions.mathChildrenWithCanBeModified;
    delete stateVariableDefinitions.codesAdjacentToStrings;
    delete stateVariableDefinitions.canBeModified;
    delete stateVariableDefinitions.mathChildrenByVectorComponent;

    Object.assign(
      stateVariableDefinitions,
      returnRoundingStateVariableDefinitions(),
    );

    stateVariableDefinitions.unordered = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({}),
      definition() {
        return {
          setValue: { unordered: false },
        };
      },
    };

    stateVariableDefinitions.matrixSizePre = {
      returnDependencies: () => ({
        rowChildren: {
          dependencyType: "child",
          childGroups: ["rows"],
          variableNames: ["numComponents"],
        },
        colChildren: {
          dependencyType: "child",
          childGroups: ["columns"],
          variableNames: ["numComponents"],
        },
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["matrixSize"],
        },
        numRowsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "numRows",
          variableNames: ["value"],
        },
        numColumnsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "numColumns",
          variableNames: ["value"],
        },
      }),
      definition({ dependencyValues }) {
        let numRows = null,
          numColumns = null;

        if (dependencyValues.numRowsAttr) {
          numRows = dependencyValues.numRowsAttr.stateValues.value;
          if (!(Number.isFinite(numRows) && numRows > 0)) {
            numRows = null;
          }
        }
        if (dependencyValues.numColumnsAttr) {
          numColumns = dependencyValues.numColumnsAttr.stateValues.value;
          if (!(Number.isFinite(numColumns) && numColumns > 0)) {
            numColumns = null;
          }
        }

        if (dependencyValues.rowChildren.length > 0) {
          if (numRows === null) {
            numRows = dependencyValues.rowChildren.length;
          }
          if (numColumns === null) {
            numColumns = Math.max(
              1,
              ...dependencyValues.rowChildren.map(
                (x) => x.stateValues.numComponents,
              ),
            );
          }
        } else if (dependencyValues.colChildren.length > 0) {
          if (numColumns === null) {
            numColumns = dependencyValues.colChildren.length;
          }
          if (numRows === null) {
            numRows = Math.max(
              1,
              ...dependencyValues.colChildren.map(
                (x) => x.stateValues.numComponents,
              ),
            );
          }
        } else if (dependencyValues.mathChildren.length === 1) {
          if (numRows === null) {
            numRows =
              dependencyValues.mathChildren[0].stateValues.matrixSize[0];
          }
          if (numColumns === null) {
            numColumns =
              dependencyValues.mathChildren[0].stateValues.matrixSize[1];
          }
        } else {
          // if numRows or numColumns is not specified, set to 1,
          // except if both are not specified, set both to 0
          if (numRows === null) {
            if (numColumns === null) {
              numRows = 0;
              numColumns = 0;
            } else {
              numRows = 1;
            }
          } else if (numColumns === null) {
            numColumns = 1;
          }
        }

        return { setValue: { matrixSizePre: [numRows, numColumns] } };
      },
    };

    stateVariableDefinitions.matrixPre = {
      isArray: true,
      numDimensions: 2,
      hasEssential: true,
      returnArraySizeDependencies: () => ({
        matrixSizePre: {
          dependencyType: "stateVariable",
          variableName: "matrixSizePre",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return dependencyValues.matrixSizePre;
      },
      returnArrayDependenciesByKey: ({ arrayKeys }) => {
        let globalDependencies = {
          defaultEntry: {
            dependencyType: "stateVariable",
            variableName: "defaultEntry",
          },
          rowChildIdentities: {
            dependencyType: "child",
            childGroups: ["rows"],
          },
          colChildIdentities: {
            dependencyType: "child",
            childGroups: ["columns"],
          },
        };
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let [rowInd, colInd] = arrayKey.split(",");
          dependenciesByKey[arrayKey] = {
            rowChild: {
              dependencyType: "child",
              childGroups: ["rows"],
              childIndices: [rowInd],
              variableNames: ["math" + (Number(colInd) + 1)],
            },
            colChild: {
              dependencyType: "child",
              childGroups: ["columns"],
              childIndices: [colInd],
              variableNames: ["math" + (Number(rowInd) + 1)],
            },
            mathChild: {
              dependencyType: "child",
              childGroups: ["maths"],
              childIndices: [0],
              variableNames: [
                "matrixEntry" +
                  (Number(rowInd) + 1) +
                  "_" +
                  (Number(colInd) + 1),
              ],
            },
          };
        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
        arraySize,
      }) {
        let matrix = {};
        let essentialMatrix = {};
        let useRows = globalDependencyValues.rowChildIdentities.length > 0;
        let useColumns = globalDependencyValues.colChildIdentities.length > 0;

        for (let arrayKey of arrayKeys) {
          let [rowInd, colInd] = arrayKey.split(",");

          let entry;
          if (useRows) {
            entry =
              dependencyValuesByKey[arrayKey].rowChild[0]?.stateValues[
                "math" + (Number(colInd) + 1)
              ];
          } else if (useColumns) {
            entry =
              dependencyValuesByKey[arrayKey].colChild[0]?.stateValues[
                "math" + (Number(rowInd) + 1)
              ];
          } else {
            entry =
              dependencyValuesByKey[arrayKey].mathChild[0]?.stateValues[
                "matrixEntry" +
                  (Number(rowInd) + 1) +
                  "_" +
                  (Number(colInd) + 1)
              ];
          }

          if (entry === undefined) {
            essentialMatrix[arrayKey] = {
              defaultValue: globalDependencyValues.defaultEntry,
            };
          } else {
            matrix[arrayKey] = entry;
          }
        }

        return {
          setValue: { matrixPre: matrix },
          useEssentialOrDefaultValue: { matrixPre: essentialMatrix },
        };
      },
      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
      }) {
        let instructions = [];
        let newMatrixValues = {};
        let useRows = globalDependencyValues.rowChildIdentities.length > 0;
        let useColumns = globalDependencyValues.colChildIdentities.length > 0;

        for (let arrayKey in desiredStateVariableValues.matrixPre) {
          let [rowInd, colInd] = arrayKey.split(",");

          if (useRows) {
            let entry =
              dependencyValuesByKey[arrayKey].rowChild[0]?.stateValues[
                "math" + (Number(colInd) + 1)
              ];
            if (entry === undefined) {
              newMatrixValues[arrayKey] =
                desiredStateVariableValues.matrixPre[arrayKey];
            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].rowChild,
                desiredValue: desiredStateVariableValues.matrixPre[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });
            }
          } else if (useColumns) {
            let entry =
              dependencyValuesByKey[arrayKey].colChild[0]?.stateValues[
                "math" + (Number(rowInd) + 1)
              ];
            if (entry === undefined) {
              newMatrixValues[arrayKey] =
                desiredStateVariableValues.matrixPre[arrayKey];
            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].colChild,
                desiredValue: desiredStateVariableValues.matrixPre[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });
            }
          } else {
            let entry =
              dependencyValuesByKey[arrayKey].mathChild[0]?.stateValues[
                "matrixEntry" +
                  (Number(rowInd) + 1) +
                  "_" +
                  (Number(colInd) + 1)
              ];
            if (entry === undefined) {
              newMatrixValues[arrayKey] =
                desiredStateVariableValues.matrixPre[arrayKey];
            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].mathChild,
                desiredValue: desiredStateVariableValues.matrixPre[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });
            }
          }
        }

        if (Object.keys(newMatrixValues).length > 0) {
          instructions.push({
            setEssentialValue: "matrixPre",
            value: newMatrixValues,
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.unnormalizedValue = {
      returnDependencies: () => ({
        matrixPre: {
          dependencyType: "stateVariable",
          variableName: "matrixPre",
        },
        matrixSizePre: {
          dependencyType: "stateVariable",
          variableName: "matrixSizePre",
        },
      }),
      definition({ dependencyValues }) {
        let matrixValues = ["tuple"];
        for (let i = 0; i < dependencyValues.matrixSizePre[0]; i++) {
          matrixValues.push([
            "tuple",
            ...dependencyValues.matrixPre[i].map((x) => x.tree),
          ]);
        }

        let unnormalizedValue = me.fromAst([
          "matrix",
          ["tuple", ...dependencyValues.matrixSizePre],
          matrixValues,
        ]);

        return { setValue: { unnormalizedValue } };
      },
      inverseDefinition({ dependencyValues, desiredStateVariableValues }) {
        let desiredTree = desiredStateVariableValues.unnormalizedValue.tree;

        if (
          !(
            Array.isArray(desiredTree) &&
            desiredTree[0] === "matrix" &&
            desiredTree[1]?.[1] === dependencyValues.matrixSizePre[0] &&
            desiredTree[1]?.[2] === dependencyValues.matrixSizePre[1]
          )
        ) {
          return { success: false };
        }

        let desiredMatrix = {};

        for (let i = 0; i < dependencyValues.matrixSizePre[0]; i++) {
          for (let j = 0; j < dependencyValues.matrixSizePre[1]; j++) {
            desiredMatrix[`${i},${j}`] = me.fromAst(
              desiredTree[2][i + 1][j + 1],
            );
          }
        }

        return {
          success: true,
          instructions: [
            {
              setDependency: "matrixPre",
              desiredValue: desiredMatrix,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.canBeModified = {
      returnDependencies: () => ({
        modifyIndirectly: {
          dependencyType: "stateVariable",
          variableName: "modifyIndirectly",
        },
        fixed: {
          dependencyType: "stateVariable",
          variableName: "fixed",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            canBeModified:
              dependencyValues.modifyIndirectly && !dependencyValues.fixed,
          },
        };
      },
    };

    return stateVariableDefinitions;
  }
}
