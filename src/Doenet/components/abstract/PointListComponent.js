import BaseComponent from './BaseComponent';
import { breakStringsAndOthersIntoComponentsByStringCommas } from '../commonsugar/breakstrings';

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

    let breakIntoPointsByCommas = breakStringsAndOthersIntoComponentsByStringCommas(x => ({
      componentType: "point", children: [{
        componentType: "coords", children: x
      }]
    }));

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
      additionalStateVariablesDefined: ["nPoints"],
      returnDependencies: () => ({
        pointChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroPoints",
          variableNames: ["xs", "coords", "nDimensions"]
        }
      }),
      definition: function ({ dependencyValues, changes }) {
        return {
          newValues: {
            points: dependencyValues.pointChildren,
            nPoints: dependencyValues.pointChildren.length
          }
        }
      }
    }

    stateVariableDefinitions.childrenWhoRender = {
      returnDependencies: () => ({
        points: {
          dependencyType: "stateVariable",
          variableName: "points"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          childrenWhoRender: dependencyValues.points.map(x => x.componentName)
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
