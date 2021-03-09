import BaseComponent from './abstract/BaseComponent';
import {
  breakEmbeddedStringByCommas, breakIntoVectorComponents,
  breakPiecesByEquals,
  returnBreakStringsSugarFunction
} from './commonsugar/breakstrings';

export class Extremum extends BaseComponent {
  static componentType = "extremum";
  static rendererType = undefined;



  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakIntoLocationValueByCommas = function ({ matchedChildren }) {
      let childrenToComponentFunction = x => ({
        componentType: "x", children: x
      });

      let mustStripOffOuterParentheses = true;
      if (matchedChildren.length === 1 && !matchedChildren[0].state.value.includes(",")) {
        // if have just one string and that string doesn't have a comma,
        // then don't strip off outer parentheses
        mustStripOffOuterParentheses = false;
      }

      let breakFunction = returnBreakStringsSugarFunction({
        childrenToComponentFunction,
        mustStripOffOuterParentheses
      })

      let result = breakFunction({ matchedChildren });

      if (result.success) {
        if (result.newChildren.length === 1) {
          // one component is a value
          result.newChildren[0].componentType = "value";
        } else if (result.newChildren.length === 2) {
          // two components is a location and value
          result.newChildren[0].componentType = "location";
          result.newChildren[1].componentType = "value";

          // remove components that are empty
          if (result.newChildren[1].children.length === 0 ||
            (
              result.newChildren[1].children.length === 1 &&
              result.newChildren[1].children[0].componentType === "string" &&
              result.newChildren[1].children[0].state.value.trim() === ""
            )
          ) {
            result.newChildren.splice(1, 1)
          }
          if (result.newChildren[0].children.length === 0 ||
            (
              result.newChildren[0].children.length === 1 &&
              result.newChildren[0].children[0].componentType === "string" &&
              result.newChildren[0].children[0].state.value.trim() === ""
            )
          ) {
            result.newChildren.splice(0, 1)
          }
        } else {
          return { success: false }
        }
      }

      return result;

    };

    sugarInstructions.push({
      childrenRegex: /s+(.*s)?/,
      replacementFunction: breakIntoLocationValueByCommas
    })

    return sugarInstructions;

  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

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

    let atMostOnePoint = childLogic.newLeaf({
      name: "atMostOnePoint",
      componentType: "point",
      comparison: "atMost",
      number: 1,
    });

    childLogic.newOperator({
      name: "locationValueXorPoint",
      operator: 'xor',
      propositions: [locationOrValue, atMostOnePoint],
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
          dependencyType: "child",
          childLogicName: "atMostOnePoint",
          variableNames: ["nDimensions", "xs"]
        },
        locationChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneLocation",
          variableNames: ["value"]
        },
        valueChild: {
          dependencyType: "child",
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

