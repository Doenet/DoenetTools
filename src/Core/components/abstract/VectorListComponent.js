import BaseComponent from "./BaseComponent";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "../commonsugar/lists";

export default class VectorListComponent extends BaseComponent {
  static componentType = "_vectorListComponent";
  static rendererType = "containerInline";
  static renderChildren = true;

  static includeBlankStringChildren = true;
  static removeBlankStringChildrenPostSugar = true;

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let groupIntoVectorsSeparatedBySpacesOutsideParens =
      returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
        componentType: "vector",
      });

    sugarInstructions.push({
      replacementFunction: function ({ matchedChildren }) {
        return groupIntoVectorsSeparatedBySpacesOutsideParens({
          matchedChildren,
        });
      },
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "vectors",
        componentTypes: ["vector"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numVectors = {
      returnDependencies: () => ({
        vectorChildren: {
          dependencyType: "child",
          childGroups: ["vectors"],
          skipComponentNames: true,
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { numVectors: dependencyValues.vectorChildren.length },
        checkForActualChange: { numVectors: true },
      }),
    };

    stateVariableDefinitions.numDimensions = {
      returnDependencies: () => ({
        vectorChildren: {
          dependencyType: "child",
          childGroups: ["vectors"],
          variableNames: ["numDimensions"],
          skipPlaceholders: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        let numDimensions;

        if (dependencyValues.vectorChildren.length === 0) {
          numDimensions = 2;
        } else {
          numDimensions = 1;
          for (let vector of dependencyValues.vectorChildren) {
            if (Number.isFinite(vector.stateValues.numDimensions)) {
              numDimensions = Math.max(
                numDimensions,
                vector.stateValues.numDimensions,
              );
            }
          }
        }
        return {
          setValue: { numDimensions },
          checkForActualChange: { numDimensions: true },
        };
      },
    };

    stateVariableDefinitions.vectors = {
      isArray: true,
      numDimensions: 2,
      entryPrefixes: ["vectorX", "vector"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "vectorX") {
          // vectorX1_2 is the 2nd component of the first vector
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
          // vector3 is all components of the third vector

          let pointInd = Number(varEnding) - 1;
          if (!(Number.isInteger(pointInd) && pointInd >= 0)) {
            return [];
          }

          if (!arraySize) {
            // If don't have array size, we just need to determine if it is a potential entry.
            // Return the first entry assuming array is large enough
            return [pointInd + ",0"];
          }
          if (pointInd < arraySize[0]) {
            // array of "pointInd,i", where i=0, ..., arraySize[1]-1
            return Array.from(
              Array(arraySize[1]),
              (_, i) => pointInd + "," + i,
            );
          } else {
            return [];
          }
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "vectors") {
          if (propIndex.length === 1) {
            return "vector" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `vectorX${propIndex[0]}_${propIndex[1]}`;
          }
        }
        if (varName.slice(0, 6) === "vector") {
          // could be vector or vectorX
          let vectorNum = Number(varName.slice(6));
          if (Number.isInteger(vectorNum) && vectorNum > 0) {
            // if propIndex has additional entries, ignore them
            return `vectorX${vectorNum}_${propIndex[0]}`;
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        numVectors: {
          dependencyType: "stateVariable",
          variableName: "numVectors",
        },
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numVectors, dependencyValues.numDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let [vectorInd, dim] = arrayKey.split(",");
          dependenciesByKey[arrayKey] = {
            vectorChild: {
              dependencyType: "child",
              childGroups: ["vectors"],
              variableNames: ["x" + (Number(dim) + 1)],
              childIndices: [vectorInd],
            },
          };
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        // console.log('array definition of vectors for vectorlist')
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
        // console.log(arrayKeys);

        let vectors = {};

        for (let arrayKey of arrayKeys) {
          let dim = arrayKey.split(",")[1];

          let vectorChild = dependencyValuesByKey[arrayKey].vectorChild[0];
          if (vectorChild) {
            vectors[arrayKey] =
              vectorChild.stateValues["x" + (Number(dim) + 1)];
          }
        }

        return { setValue: { vectors } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
        // componentName
      }) {
        // console.log(`array inverse definition of vectors of vectorlist of ${componentName}`)
        // console.log(desiredStateVariableValues)
        // console.log(arrayKeys);

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.vectors) {
          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey].vectorChild,
            desiredValue: desiredStateVariableValues.vectors[arrayKey],
            childIndex: 0,
            variableIndex: 0,
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    return stateVariableDefinitions;
  }
}
