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

    let stateVariableDefinitions = {};


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
      definition: function ({ dependencyValues, arrayKeys, freshByKey, partialArrayChange }) {

        if (!partialArrayChange) {
          // send array so that now should overwrite entire array
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
              newPointValues[arrayKey] = dependencyValues.pointChildren[arrayKey].stateValues.coords
            }
          }
          return { newValues: { points: newPointValues } }
        } else {
          if (!freshByKey[arrayKey]) {
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
      markStale: function ({ freshByKey, changes }) {
        if (changes.pointChildren) {
          if (changes.pointChildren.componentIdentitiesChanged) {
            for (let key in freshByKey) {
              delete freshByKey[key];
            }
            return { partialArrayChange: false }
          } else {
            for (let key in changes.pointChildren.valuesChanged) {
              delete freshByKey[key];
            }
            return { partialArrayChange: true }

          }
        }

        return { partialArrayChange: true }

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
        newValues: { nPoints: dependencyValues.pointChildren.length }
      })
    }


    stateVariableDefinitions.childrenWhoRender = {
      returnDependencies: () => ({
        pointChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroPoints",
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          childrenWhoRender: dependencyValues.pointChildren.map(x => x.componentName)
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
