import BaseComponent from './BaseComponent';
import { returnBreakStringsSugarFunction } from '../commonsugar/breakstrings';
import me from 'math-expressions';

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
      returnSugarDependencies: () => ({
        stringsAndMaths: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsAndMaths",
          variableNames: ["value"]
        }
      }),
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
      returnDependencies: function ({ arrayKeys }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }
        if (arrayKey === undefined) {
          return {
            pointChildren: {
              dependencyType: "childStateVariables",
              childLogicName: "atLeastZeroPoints",
              variableNames: ["coords"]
            }
          }
        } else {
          return {
            pointChild: {
              dependencyType: "childStateVariables",
              childLogicName: "atLeastZeroPoints",
              variableNames: ["coords"],
              childIndices: [arrayKey],
            }
          }
        }
      },
      markStale: function ({ freshnessInfo, changes, arrayKeys, previousValues }) {
        // console.log('mark stale for pointlist points')
        // console.log(changes);
        // console.log(arrayKeys);
        // console.log(previousValues);

        let freshByKey = freshnessInfo.freshByKey;

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {

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

          if (changes.pointChild) {
            if (changes.pointChild.componentIdentitiesChanged) {
              delete freshByKey[arrayKey];
            } else {
              if (changes.pointChild.valuesChanged[0]) {
                delete freshByKey[arrayKey];
              }
            }
          }

          return { fresh: freshByKey[arrayKey] === true };
        }

      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKey = freshnessInfo.freshByKey;

        // console.log('definition of points for pointlist')
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(JSON.parse(JSON.stringify(dependencyValues)))
        // console.log(JSON.parse(JSON.stringify(changes)))
        // console.log(arrayKeys);

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
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

          let newPointValues = {};
          for (let arrayKey in dependencyValues.pointChildren) {
            if (!freshByKey[arrayKey]) {
              freshByKey[arrayKey] = true;
              newPointValues[arrayKey] = dependencyValues.pointChildren[arrayKey].stateValues.coords
            }
          }
          return { newValues: { points: newPointValues } }
        } else {

          // have arrayKey

          if (!freshByKey[arrayKey]) {
            freshByKey[arrayKey] = true;
            let coords;
            if(dependencyValues.pointChild.length === 1) {
              coords = dependencyValues.pointChild[0].stateValues.coords
            } else {
              coords = me.fromAst('\uff3f')
            }
            return {
              newValues: {
                points: {
                  [arrayKey]: coords
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
          for (let key in desiredStateVariableValues.points) {
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
              setDependency: "pointChild",
              desiredValue: desiredStateVariableValues.points[arrayKey],
              childIndex: 0,
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

}
