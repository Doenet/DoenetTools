import BaseComponent from './abstract/BaseComponent';
import {
  breakEmbeddedStringByCommas, breakIntoVectorComponents,
  breakPiecesByEquals
} from './commonsugar/breakstrings';

export class Extremum extends BaseComponent {
  static componentType = "extremum";
  static rendererType = undefined;

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let getVarName = function (piece) {
      if (piece.length > 1) {
        return;
      }
      let varName = piece[0]._string;
      if (varName !== undefined) {
        return varName.trim();
      }
    }

    let createLocationValueFromSugar = function ({ dependencyValues }) {

      let results = breakEmbeddedStringByCommas({
        childrenList: dependencyValues.stringsAndMaths,
      });

      if (results.success !== true) {
        return { success: false }
      }

      let pieces = results.pieces;
      let toDelete = results.toDelete;

      let variablesChild = dependencyValues.variables[0];

      results = breakPiecesByEquals(pieces, true);

      if (results.success !== true) {
        return { success: false }
      }

      toDelete = [...toDelete, ...results.toDelete];

      let lhsByPiece = results.lhsByPiece;
      let rhsByPiece = results.rhsByPiece;


      let initialDefaultVars = ["x", "y", "z"];
      let variableNames = [];
      let newChildren = [];

      let nVariablesInChild = 0;
      let nVariablesNeeded = Math.max(lhsByPiece.length, 2);
      if (variablesChild !== undefined) {
        nVariablesInChild = variablesChild.stateValues.nComponents;
        newChildren.push({
          createdComponent: true,
          componentName: variablesChild.componentName
        });
      }
      for (let i = 0; i < Math.min(nVariablesInChild, nVariablesNeeded); i++) {
        variableNames.push(variablesChild.stateValues.maths[i].tree);
      }
      for (let i = nVariablesInChild; i < nVariablesNeeded; i++) {
        // if have more pieces that variables
        // make the variable be x, y, z, x4, x5, x6...
        if (i < 3) {
          variableNames.push(initialDefaultVars[i]);
        } else {
          variableNames.push("x" + (i + 1));
        }
      }

      // we accept the following cases:
      // - a single equation (e.g., x=1), i.e., a single lhs and a single rhs
      //   one must match either variable 1 (in which case it is a location)
      //   or match variable 2 (in which case it is a value)
      // - two equations (e.g., x=1, y=3), i.e., two lhs and two rhs
      //   one equation must variable 1 and the other variable 2
      //   giving both a location and a value
      // - a single component with that is a 2D vector (e.g., (1,3))
      //   first vector component is a location, the second a value
      // - a single component with no equation (e.g., 3)
      //   the component is a value
      // - two components with no equation (e.g., 1, 3)
      //   the first is a location, the second is a value

      let locationChildren = [];
      let valueChildren = [];

      if (lhsByPiece.length === 1) {
        if (rhsByPiece.length === 0) {
          let vectorResult = breakIntoVectorComponents(lhsByPiece[0]);
          if (vectorResult.foundVector === true && vectorResult.vectorComponents.length === 2) {
            locationChildren = vectorResult.vectorComponents[0];
            valueChildren = vectorResult.vectorComponents[1];
            toDelete = [...toDelete, ...vectorResult.toDelete];
          } else {
            valueChildren = lhsByPiece[0];
          }
        } else if (rhsByPiece.length !== 1) {
          return { success: false }
        } else {
          if (getVarName(lhsByPiece[0]) === variableNames[1]) {
            valueChildren = rhsByPiece[0];
          } else if (getVarName(rhsByPiece[0]) === variableNames[1]) {
            valueChildren = lhsByPiece[0];
          } else if (getVarName(lhsByPiece[0]) === variableNames[0]) {
            locationChildren = rhsByPiece[0];
          } else if (getVarName(rhsByPiece[0]) === variableNames[0]) {
            locationChildren = lhsByPiece[0];
          } else {
            return { success: false };
          }
        }
      } else if (lhsByPiece.length !== 2) {
        return { success: false };
      } else {

        if (rhsByPiece.length === 0) {
          locationChildren = lhsByPiece[0];
          valueChildren = lhsByPiece[1];
        } else if (rhsByPiece.length !== 2) {
          return { success: false };
        } else {

          let side;
          if (getVarName(lhsByPiece[0]) === variableNames[1]) {
            side = "l";
          } else if (getVarName(rhsByPiece[0]) === variableNames[1]) {
            side = "r";
          }
          if (side !== undefined) {
            if (side === "l") {
              valueChildren = rhsByPiece[0];
            } else {
              valueChildren = lhsByPiece[0];
            }
            if (getVarName(lhsByPiece[1]) === variableNames[0]) {
              locationChildren = rhsByPiece[1];
            } else if (getVarName(rhsByPiece[1]) === variableNames[0]) {
              locationChildren = lhsByPiece[1];
            } else {
              return { success: false }
            }
          } else {
            if (getVarName(lhsByPiece[1]) === variableNames[1]) {
              side = "l";
            } else if (getVarName(rhsByPiece[1]) === variableNames[1]) {
              side = "r";
            }
            if (side === undefined) {
              return { success: false };
            }
            if (side === "l") {
              valueChildren = rhsByPiece[1];
            } else {
              valueChildren = lhsByPiece[1];
            }
            if (getVarName(lhsByPiece[0]) === variableNames[0]) {
              locationChildren = rhsByPiece[0];
            } else if (getVarName(rhsByPiece[0]) === variableNames[0]) {
              locationChildren = lhsByPiece[0];
            } else {
              return { success: false };
            }
          }
        }
      }

      if (locationChildren.length > 0) {
        newChildren.push({
          componentType: "location",
          children: locationChildren,
        })
      }
      if (valueChildren.length > 0) {
        newChildren.push({
          componentType: "value",
          children: valueChildren,
        })
      }

      return {
        success: true,
        newChildren: newChildren,
        toDelete: toDelete,
      }

    }

    let variablesForSugar = childLogic.newLeaf({
      name: "variablesForSugar",
      componentType: 'variables',
      comparison: 'atMost',
      number: 1,
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
    });

    let stringsAndMathsSugar = childLogic.newOperator({
      name: "stringsAndMathsSugar",
      operator: 'and',
      propositions: [variablesForSugar, stringsAndMaths],
      isSugar: true,
      returnSugarDependencies: () => ({
        stringsAndMaths: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsAndMaths",
          variableNames: ["value"]
        },
        variables: {
          dependencyType: "childStateVariables",
          childLogicName: "variablesForSugar",
          variableNames: ["nComponents", "maths"]
        }
      }),
      logicToWaitOnSugar: ["exactlyOneLocation", "exactlyOneValue"],
      replacementFunction: createLocationValueFromSugar,
    });

    let exactlyOneLocation = childLogic.newLeaf({
      name: "exactlyOneLocation",
      componentType: 'location',
      number: 1,
    });

    let exactlyOneValue = childLogic.newLeaf({
      name: "exactlyOneValue",
      componentType: 'value',
      number: 1,
    });

    let locationOrValue = childLogic.newOperator({
      name: "locationOrValue",
      operator: 'or',
      propositions: [exactlyOneLocation, exactlyOneValue],
    });

    let variables = childLogic.newLeaf({
      name: "variables",
      componentType: 'variables',
      comparison: 'atMost',
      number: 1,
    });

    let locationValueVariables = childLogic.newOperator({
      name: "locationValueVariables",
      operator: 'and',
      propositions: [locationOrValue, variables],
    });

    let exactlyOnePoint = childLogic.newLeaf({
      name: "exactlyOnePoint",
      componentType: "point",
      number: 1,
    });

    childLogic.newOperator({
      name: "SugarXorLocationValue",
      operator: 'xor',
      propositions: [locationValueVariables, exactlyOnePoint, stringsAndMathsSugar],
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    let componentClass = this;

    stateVariableDefinitions.value = {
      public: true,
      componentType: "math",
      defaultValue: null,
      additionalStateVariablesDefined: [{
        variableName: "location",
        public: true,
        componentType: "math",
        defaultValue: null,
      }],
      returnDependencies: () => ({
        pointChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOnePoint",
          variableNames: ["nDimensions", "xs"]
        },
        locationChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneLocation",
          variableNames: ["value"]
        },
        valueChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneValue",
          variableNames: ["value"]
        },
      }),
      definition: function ({ dependencyValues }) {
        let location, value;

        if (dependencyValues.pointChild.length === 1) {
          let pointChild = dependencyValues.pointChild[0];
          if (pointChild.stateValues.nDimensions !== 2) {
            console.log("Cannot determine " + componentClass.componentType + " from a point that isn't 2D");
            location = null;
            value = null;
          } else {
            location = pointChild.stateValues.xs[0];
            value = pointChild.stateValues.xs[1];
          }
        } else {
          if (dependencyValues.locationChild.length === 1) {
            location = dependencyValues.locationChild[0].stateValues.value;
          }
          if (dependencyValues.valueChild.length === 1) {
            value = dependencyValues.valueChild[0].stateValues.value;
          }
        }

        let newValues = {};
        let useEssentialOrDefaultValue = {};
        let haveNewValues = false;
        let haveEssential = false;
        if (location === undefined) {
          useEssentialOrDefaultValue.location = { variablesToCheck: ["location"] }
          haveEssential = true;
        } else {
          newValues.location = location;
          haveNewValues = true;
        }

        if (value === undefined) {
          useEssentialOrDefaultValue.value = { variablesToCheck: ["value"] }
          haveEssential = true;
        } else {
          newValues.value = value;
          haveNewValues = true;
        }

        let result = {};
        if (haveNewValues) {
          result.newValues = newValues;
        }
        if (haveEssential) {
          result.useEssentialOrDefaultValue = useEssentialOrDefaultValue;
        }

        return result;
      }
    }

    return stateVariableDefinitions;

  }

}

export class Maximum extends Extremum {
  static componentType = "maximum";
}

export class Minimum extends Extremum {
  static componentType = "minimum";
}

