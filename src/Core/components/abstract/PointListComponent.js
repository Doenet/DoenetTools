import BaseComponent from './BaseComponent';
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from '../commonsugar/lists';

export default class PointListComponent extends BaseComponent {
  static componentType = "_pointListComponent";
  static rendererType = "containerInline";
  static renderChildren = true;

  static includeBlankStringChildren = true;
  static removeBlankStringChildrenPostSugar = true;

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();


    let groupIntoPointsSeparatedBySpacesOutsideParens = returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
      componentType: "point"
    });

    sugarInstructions.push({
      replacementFunction: function ({ matchedChildren }) {
        return groupIntoPointsSeparatedBySpacesOutsideParens({ matchedChildren });
      }
    });

    return sugarInstructions;

  }

  static returnChildGroups() {

    return [{
      group: "points",
      componentTypes: ["point"]
    }]

  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nPoints = {
      returnDependencies: () => ({
        pointChildren: {
          dependencyType: "child",
          childGroups: ["points"],
          skipComponentNames: true,
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: { nPoints: dependencyValues.pointChildren.length },
          checkForActualChange: { nPoints: true }
        }
      }
    }


    stateVariableDefinitions.nDimensions = {
      returnDependencies: () => ({
        pointChildren: {
          dependencyType: "child",
          childGroups: ["points"],
          variableNames: ["nDimensions"],
          skipPlaceholders: true,
        }
      }),
      definition: function ({ dependencyValues }) {

        let nDimensions;

        if (dependencyValues.pointChildren.length === 0) {
          nDimensions = 2;
        } else {
          nDimensions = 1;
          for (let point of dependencyValues.pointChildren) {
            if (Number.isFinite(point.stateValues.nDimensions)) {
              nDimensions = Math.max(nDimensions, point.stateValues.nDimensions)
            }
          }
        }
        return {
          setValue: { nDimensions },
          checkForActualChange: { nDimensions: true }
        }
      }
    }

    stateVariableDefinitions.points = {
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["pointX", "point"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "pointX") {
          // pointX1_2 is the 2nd component of the first point
          let indices = varEnding.split('_').map(x => Number(x) - 1)
          if (indices.length === 2 && indices.every(
            (x, i) => Number.isInteger(x) && x >= 0
          )) {
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
          // point3 is all components of the third point

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
            return Array.from(Array(arraySize[1]), (_, i) => pointInd + "," + i)
          } else {
            return [];
          }
        }

      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "points") {
          if (propIndex.length === 1) {
            return "point" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `pointX${propIndex[0]}_${propIndex[1]}`
          }
        }
        if (varName.slice(0, 5) === "point") {
          // could be point or pointX
          let pointNum = Number(varName.slice(5));
          if (Number.isInteger(pointNum) && pointNum > 0) {
            // if propIndex has additional entries, ignore them
            return `pointX${pointNum}_${propIndex[0]}`
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        nPoints: {
          dependencyType: "stateVariable",
          variableName: "nPoints",
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nPoints, dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let [pointInd, dim] = arrayKey.split(',');
          dependenciesByKey[arrayKey] = {
            pointChild: {
              dependencyType: "child",
              childGroups: ["points"],
              variableNames: ["x" + (Number(dim) + 1)],
              childIndices: [pointInd],
            }
          }
        }

        return { dependenciesByKey };

      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        // console.log('array definition of points for pointlist')
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
        // console.log(arrayKeys);

        let points = {};

        for (let arrayKey of arrayKeys) {
          let dim = arrayKey.split(',')[1];

          let pointChild = dependencyValuesByKey[arrayKey].pointChild[0];
          if (pointChild) {
            points[arrayKey] = pointChild.stateValues["x" + (Number(dim) + 1)];
          }
        }

        // console.log("result")
        // console.log(JSON.parse(JSON.stringify(points)));

        return { setValue: { points } }

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyNamesByKey
      }) {

        // console.log('array inverse definition of points of pointlist')
        // console.log(desiredStateVariableValues)
        // console.log(arrayKeys);

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.points) {

          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey].pointChild,
            desiredValue: desiredStateVariableValues.points[arrayKey],
            childIndex: 0,
            variableIndex: 0
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

}
