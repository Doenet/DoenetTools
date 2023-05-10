import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../../utils/rounding";
import BaseComponent from "../abstract/BaseComponent";
import me from "math-expressions";

export default class EigenDecomposition extends BaseComponent {
  static componentType = "eigenDecomposition";
  static rendererType = undefined;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    Object.assign(attributes, returnRoundingAttributes());

    return attributes;
  }

  static returnChildGroups() {
    return [
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
      returnRoundingStateVariableDefinitions(),
    );

    stateVariableDefinitions.decomposition = {
      returnDependencies: () => ({
        mathChild: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.mathChild.length === 0) {
          return { setValue: { decomposition: null } };
        }

        let mathTree = dependencyValues.mathChild[0].stateValues.value.tree;

        if (!Array.isArray(mathTree) || mathTree[0] !== "matrix") {
          return { setValue: { decomposition: null } };
        }

        let nRows = mathTree[1][1];
        let nCols = mathTree[1][2];
        if (!(Number.isInteger(nRows) && nCols === nRows)) {
          return { setValue: { decomposition: null } };
        }

        let matrixArray = [];

        for (let rowInd = 0; rowInd < nRows; rowInd++) {
          let row = [];
          let rowOperands = mathTree[2][rowInd + 1] || [];

          for (let colInd = 0; colInd < nCols; colInd++) {
            let val = rowOperands[colInd + 1];
            if (val === undefined || val === null) {
              return { setValue: { decomposition: null } };
            }
            if (
              typeof val === "number" ||
              (typeof val?.re === "number" && typeof val?.im === "number")
            ) {
              row.push(val);
            } else {
              try {
                val = me.fromAst(val).evaluate_to_constant();
                if (
                  typeof val === "number" ||
                  (typeof val?.re === "number" && typeof val?.im === "number")
                ) {
                  row.push(val);
                } else {
                  row.push(NaN);
                }
              } catch (e) {
                row.push(NaN);
              }
            }
          }

          matrixArray.push(row);
        }

        let result;
        try {
          result = me.math.eigs(matrixArray);
        } catch (e) {
          console.warn("Could not calculate eigenvalues of matrix");
          return { setValue: { decomposition: null } };
        }

        return { setValue: { decomposition: result } };
      },
    };

    stateVariableDefinitions.eigenvalues = {
      isArray: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      entryPrefixes: ["eigenvalue"],
      returnArraySizeDependencies: () => ({
        decomposition: {
          dependencyType: "stateVariable",
          variableName: "decomposition",
        },
      }),
      returnArraySize({ dependencyValues }) {
        let n;
        if (dependencyValues.decomposition) {
          n = dependencyValues.decomposition.values.length;
        } else {
          n = 0;
        }
        return [n];
      },
      returnArrayDependenciesByKey() {
        return {
          globalDependencies: {
            decomposition: {
              dependencyType: "stateVariable",
              variableName: "decomposition",
            },
          },
        };
      },
      arrayDefinitionByKey({ globalDependencyValues, arraySize }) {
        let eigenvalues = [];

        for (let i = 0; i < arraySize[0]; i++) {
          eigenvalues.push(globalDependencyValues.decomposition.values[i]);
        }

        return { setValue: { eigenvalues } };
      },
    };

    stateVariableDefinitions.eigenvectors = {
      isArray: true,
      public: true,
      nDimensions: 2,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "eigenvectorX") {
            return [];
          } else {
            // eigenvector or entire array
            // wrap inner dimension by both <vector> and <xs>
            // don't wrap outer dimension (for entire array)
            return [
              ["vector", { componentType: "mathList", isAttribute: "xs" }],
            ];
          }
        },
      },
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "eigenvectorX") {
          // eigenvectorX1_2 is the 2nd component of the first eigenvector
          let indices = varEnding.split("_").map((x) => Number(x) - 1);
          if (
            indices.length === 2 &&
            indices.every((x, i) => Number.isInteger(x) && x >= 0)
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
        } else {
          // eigenvector3 is all components of the third eigenvector

          let eigenvectorInd = Number(varEnding) - 1;
          if (!(Number.isInteger(eigenvectorInd) && eigenvectorInd >= 0)) {
            return [];
          }

          if (!arraySize) {
            // If don't have array size, we just need to determine if it is a potential entry.
            // Return the first entry assuming array is large enough
            return [eigenvectorInd + ",0"];
          }
          if (eigenvectorInd < arraySize[0]) {
            // array of "eigenvectorInd,i", where i=0, ..., arraySize[1]-1
            return Array.from(
              Array(arraySize[1]),
              (_, i) => eigenvectorInd + "," + i,
            );
          } else {
            return [];
          }
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "eigenvectors") {
          if (propIndex.length === 1) {
            return "eigenvector" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `eigenvectorX${propIndex[0]}_${propIndex[1]}`;
          }
        }
        if (varName.slice(0, 11) === "eigenvector") {
          // could be eigenvector or eigenvectorX
          let eigenvectorNum = Number(varName.slice(11));
          if (Number.isInteger(eigenvectorNum) && eigenvectorNum > 0) {
            // if propIndex has additional entries, ignore them
            return `eigenvectorX${eigenvectorNum}_${propIndex[0]}`;
          }
        }
        return null;
      },
      entryPrefixes: ["eigenvectorX", "eigenvector"],
      returnArraySizeDependencies: () => ({
        decomposition: {
          dependencyType: "stateVariable",
          variableName: "decomposition",
        },
      }),
      returnArraySize({ dependencyValues }) {
        let n;
        if (dependencyValues.decomposition) {
          n = dependencyValues.decomposition.values.length;
        } else {
          n = 0;
        }
        return [n, n];
      },
      returnArrayDependenciesByKey() {
        return {
          globalDependencies: {
            decomposition: {
              dependencyType: "stateVariable",
              variableName: "decomposition",
            },
          },
        };
      },
      arrayDefinitionByKey({ globalDependencyValues, arraySize }) {
        let eigenvectors = {};

        for (let i = 0; i < arraySize[0]; i++) {
          let vector = [];
          let vectorMag = 0;
          for (let j = 0; j < arraySize[0]; j++) {
            let val = globalDependencyValues.decomposition.vectors[j][i];
            vector.push(val);
            vectorMag += me.math.square(me.math.abs(val));
          }
          vectorMag = Math.sqrt(vectorMag);
          vector = vector.map((x) => me.math.divide(x, vectorMag));

          for (let j = 0; j < arraySize[0]; j++) {
            eigenvectors[`${i},${j}`] = vector[j];
          }
        }

        return { setValue: { eigenvectors } };
      },
    };

    return stateVariableDefinitions;
  }
}
