import BaseComponent from './BaseComponent';
import { returnBreakStringsSugarFunction } from '../commonsugar/breakstrings';

export default class PointListComponent extends BaseComponent {
  static componentType = "_pointlistcomponent";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.hide = { default: true };
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

    let childrenToComponentFunction = x => ({
      componentType: "point", children: [{
        componentType: "coords", children: x
      }]
    })
    let breakIntoPointsByCommas = returnBreakStringsSugarFunction({
      childrenToComponentFunction,
      dependencyNameWithChildren: "stringsAndMaths"
    });

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
      sugarDependencies: {
        stringsAndMaths: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsAndMaths",
          variableNames: ["value"]
        }
      },
      affectedBySugar: ["atLeastZeroPoints"],
      replacementFunction: breakIntoPointsByCommas,
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

    stateVariableDefinitions.points = {
      isArray: true,
      entryPrefixes: ["point"],
      returnDependencies: () => ({
        pointChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroPoints",
          variableNames: ["coords"]
        }
      }),
      markStale: function ({ freshnessInfo, changes, arrayKeys }) {
        let freshByKey = freshnessInfo.freshByKey;

        if (changes.pointChildren) {
          if (changes.pointChildren.componentIdentitiesChanged) {
            for (let key in freshByKey) {
              delete freshByKey[key];
            }
          } else {
            for (let key in changes.pointChildren.valuesChanged) {
              delete freshByKey[key];
            }
          }
        }


        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: false }
          } else {
            // asked for entire array, but it has some fresh elements
            // (we don't know here how many elements points has, 
            // so can't determine if completely fresh)
            return { partiallyFresh: true }
          }
        } else {

          // have arrayKey
          // so asked for just one component

          return { fresh: freshByKey[arrayKey] === true };
        }


      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKey = freshnessInfo.freshByKey;

        if (changes.pointChildren && changes.pointChildren.componentIdentitiesChanged) {
          // send array so that now should overwrite entire array
          for (let key in dependencyValues.pointChildren) {
            freshByKey[key] = true;
          }

          return {
            newValues: {
              points: dependencyValues.pointChildren.map(x => x.stateValues.coords),
            }
          }
        }

        let arrayKey;
        if (arrayKeys) {
          arrayKey = arrayKeys[0];
        }
        if (arrayKey === undefined) {
          let newPointValues = {};
          for (let arrayKey in dependencyValues.pointChildren) {
            if (!freshByKey[arrayKey]) {
              freshByKey[arrayKey] = true;
              newPointValues[arrayKey] = dependencyValues.pointChildren[arrayKey].stateValues.coords
            }
          }
          return { newValues: { points: newPointValues } }
        } else {
          if (!freshByKey[arrayKey]) {
            freshByKey[arrayKey] = true;
            return {
              newValues: {
                points: {
                  [arrayKey]: dependencyValues.pointChildren[arrayKey].stateValues.coords
                }
              }
            }
          } else {
            // arrayKey asked for didn't change
            // don't need to report noChanges for array state variable
            return {};
          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues,
        stateValues, arrayKeys
      }) {

        // console.log('inverse definition of points of pointlist')
        // console.log(desiredStateVariableValues)
        // console.log(arrayKeys);

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
          // working with entire array

          let instructions = [];
          for(let key in desiredStateVariableValues.points) {
            instructions.push({
              setDependency: "pointChildren",
              desiredValue: desiredStateVariableValues.points[key],
              childIndex: key,
              variableIndex: 0
            })
          }

          return {
            success: true,
            instructions
          }
        } else {

          // just have one arrayKey
          return {
            success: true,
            instructions: [{
              setDependency: "pointChildren",
              desiredValue: desiredStateVariableValues.points[arrayKey],
              childIndex: arrayKey,
              variableIndex: 0
            }]
          }

        }

      }
    }

    stateVariableDefinitions.nPoints = {
      returnDependencies: () => ({
        pointChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroPoints",
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { nPoints: dependencyValues.pointChildren.length },
        checkForActualChange: ["nPoints"]
      })
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

  initializeRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new this.availableRenderers.container({ key: this.componentName });
    }
  }


}
