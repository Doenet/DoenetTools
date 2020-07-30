import BaseComponent from './BaseComponent';
import { breakEmbeddedStringByCommas, breakIntoVectorComponents } from '../commonsugar/breakstrings';

export default class PointListComponent extends BaseComponent {
  static componentType = "_pointlistcomponent";
  static rendererType = "container";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.hide = { default: true, forRenderer: true };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroPoints = childLogic.newLeaf({
      name: "atLeastZeroPoints",
      componentType: 'point',
      comparison: 'atLeast',
      number: 0
    });


    let createPointList = function ({ dependencyValues }) {

      let results = breakEmbeddedStringByCommas({
        childrenList: dependencyValues.stringsAndMaths,
      });

      if (results.success !== true) {
        return { success: false }
      }

      let pieces = results.pieces;
      let toDelete = results.toDelete;

      let newChildren = [];

      for (let ind = 0; ind < pieces.length; ind++) {
        let piece = pieces[ind];

        // each piece must be a vector (if not, we won't sugar)
        // the next step is to find the vector components
        // so that we can see if the components themselves are vectors

        let result = breakIntoVectorComponents(piece);
        if (result.foundVector !== true) {
          return { success: false };
        }

        let vectorComponents = result.vectorComponents;


        // since we're actually breaking it up,
        // add any more strings to delete
        // that we encountered in the initial breaking into components
        toDelete = [...toDelete, ...result.toDelete];

        let children = vectorComponents.map(x => ({
          componentType: "x",
          children: x
        }));



        newChildren.push({
          componentType: "point",
          children: [{
            componentType: "xs",
            children
          }]
        })

      }

      return {
        success: true,
        newChildren: newChildren,
        toDelete: toDelete,
      }

    }



    let atLeastOneString = childLogic.newLeaf({
      name: "atLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
    });

    let atLeastOneMath = childLogic.newLeaf({
      name: "atLeastOneMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 1,
    });

    let stringsAndMaths = childLogic.newOperator({
      name: "stringsAndMaths",
      operator: 'or',
      propositions: [atLeastOneString, atLeastOneMath],
      requireConsecutive: true,
      isSugar: true,
      returnSugarDependencies: () => ({
        stringsAndMaths: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsAndMaths",
          variableNames: ["value"]
        }
      }),
      logicToWaitOnSugar: ["atLeastZeroPoints"],
      replacementFunction: createPointList,
    });

    childLogic.newOperator({
      name: "pointsXorSugar",
      operator: 'xor',
      propositions: [stringsAndMaths, atLeastZeroPoints],
      setAsBase: true,
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nPoints = {
      returnDependencies: () => ({
        pointChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroPoints",
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: { nPoints: dependencyValues.pointChildren.length },
          checkForActualChange: { nPoints: true }
        }
      }
    }


    stateVariableDefinitions.nDimensions = {
      returnDependencies: () => ({
        pointChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroPoints",
          variableNames: ["nDimensions"]
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
          newValues: { nDimensions },
          checkForActualChange: { nDimensions: true }
        }
      }
    }

    stateVariableDefinitions.points = {
      isArray: true,
      entryPrefixes: ["pointX"],
      nDimensions: 2,
      entryPrefixes: ["pointX", "point"],
      returnWrappingComponents(prefix) {
        if (prefix === "pointX") {
          return [];
        } else {
          // point or entire array
          // wrap inner dimension by both <point> and <xs>
          // don't wrap outer dimension (for entire array)
          return [["point", "xs"]];
        }
      },
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
              // if don't know array size, just guess that the entry is OK
              // It will get corrected once array size is known.
              // TODO: better to return empty array?
              return [String(indices)];
            }
          } else {
            return [];
          }
        } else {
          // point3 is all components of the third point
          if (!arraySize) {
            return [];
          }
          let pointInd = Number(varEnding) - 1;
          if (Number.isInteger(pointInd) && pointInd >= 0 && pointInd < arraySize[0]) {
            // array of "pointInd,i", where i=0, ..., arraySize[1]-1
            return Array.from(Array(arraySize[1]), (_, i) => pointInd + "," + i)
          } else {
            return [];
          }
        }

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
          let [pointInd, dimInd] = arrayKey.split(',');
          dependenciesByKey[arrayKey] = {
            pointChild: {
              dependencyType: "childStateVariables",
              childLogicName: "atLeastZeroPoints",
              variableNames: ["x" + (Number(dimInd) + 1)],
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
          let dimInd = arrayKey.split(',')[1];

          let pointChild = dependencyValuesByKey[arrayKey].pointChild[0];
          if (pointChild) {
            points[arrayKey] = pointChild.stateValues["x" + (Number(dimInd) + 1)];
          }
        }

        return { newValues: { points } }

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


    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        pointChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroPoints",
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          childrenToRender: dependencyValues.pointChildren.map(x => x.componentName)
        }
      })
    }

    return stateVariableDefinitions;

  }

}
