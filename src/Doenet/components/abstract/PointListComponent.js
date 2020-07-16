import BaseComponent from './BaseComponent';
import { returnBreakStringsSugarFunction } from '../commonsugar/breakstrings';

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
      logicToWaitOnSugar: ["atLeastZeroPoints"],
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

    stateVariableDefinitions.points = {
      isArray: true,
      entryPrefixes: ["point"],
      returnArraySizeDependencies: () => ({
        nPoints: {
          dependencyType: "stateVariable",
          variableName: "nPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nPoints];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            pointChild: {
              dependencyType: "childStateVariables",
              childLogicName: "atLeastZeroPoints",
              variableNames: ["coords"],
              childIndices: [arrayKey],
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
          let pointChild = dependencyValuesByKey[arrayKey].pointChild[0];
          if (pointChild) {
            points[arrayKey] = pointChild.stateValues.coords;
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
