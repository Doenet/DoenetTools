import { returnRoundingAttributeComponentShadowing } from "../utils/rounding";
import Line from "./Line";
import me from "math-expressions";

export default class BestFitLine extends Line {
  static componentType = "bestFitLine";
  static rendererType = "line";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    delete attributes.draggable;
    delete attributes.equation;
    delete attributes.through;
    delete attributes.slope;

    attributes.data = {
      createComponentOfType: "_pointListComponent",
    };

    return attributes;
  }

  static returnSugarInstructions() {
    return [];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.draggable = {
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      public: true,
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { draggable: false } }),
    };

    stateVariableDefinitions.numDimensions = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { numDimensions: 2 } }),
    };

    delete stateVariableDefinitions.numPointsPrescribed;
    delete stateVariableDefinitions.basedOnSlope;
    delete stateVariableDefinitions.basedOnParallel;
    delete stateVariableDefinitions.basedOnPerpendicular;
    delete stateVariableDefinitions.distForSecondPt;
    delete stateVariableDefinitions.essentialPoint1x;
    delete stateVariableDefinitions.essentialPoint1y;
    delete stateVariableDefinitions.equationIdentity;

    delete stateVariableDefinitions.equation
      .stateVariablesDeterminingDependencies;

    stateVariableDefinitions.equation.returnDependencies = () => ({
      data: {
        dependencyType: "attributeComponent",
        attributeName: "data",
        variableNames: ["points", "numDimensions"],
      },
      variables: {
        dependencyType: "stateVariable",
        variableName: "variables",
      },
    });

    stateVariableDefinitions.equation.definition = function ({
      dependencyValues,
    }) {
      if (
        !dependencyValues.data ||
        dependencyValues.data.stateValues.numDimensions < 2 ||
        dependencyValues.data.stateValues.points.length < 1
      ) {
        let blankMath = me.fromAst("\uff3f");
        return {
          setValue: {
            equation: blankMath,
            coeff0: blankMath,
            coeffvar1: blankMath,
            coeffvar2: blankMath,
          },
        };
      }

      let X = [];
      let Y = [];

      for (let pt of dependencyValues.data.stateValues.points) {
        let numericalX = pt
          .slice(0, 2)
          .map((x) => x && x.evaluate_to_constant());
        if (numericalX.every(Number.isFinite)) {
          X.push([1, numericalX[0]]);
          Y.push([numericalX[1]]);
        }
      }

      if (X.length === 0) {
        let blankMath = me.fromAst("\uff3f");
        return {
          setValue: {
            equation: blankMath,
            coeff0: blankMath,
            coeffvar1: blankMath,
            coeffvar2: blankMath,
          },
        };
      }

      X = me.math.matrix(X);
      Y = me.math.matrix(Y);
      let Xt = me.math.transpose(X);

      let b = me.math.multiply(Xt, Y);

      let A = me.math.multiply(Xt, X);

      let s = me.math.lusolve(A, b);

      let coeff0 = me.fromAst(me.math.subset(s, me.math.index(0, 0)));
      let coeffvar1 = me.fromAst(me.math.subset(s, me.math.index(1, 0)));
      let coeffvar2 = me.fromAst(-1);

      let variables = dependencyValues.variables;

      let rhs = me
        .fromAst(["+", ["*", "a", "x"], "c"])
        .substitute({
          a: coeffvar1,
          c: coeff0,
          x: variables[0],
        })
        .simplify();

      let equation = me.fromAst(["=", variables[1].tree, "r"]).substitute({
        r: rhs,
      });

      return {
        setValue: {
          equation,
          coeff0,
          coeffvar1,
          coeffvar2,
        },
      };
    };

    delete stateVariableDefinitions.equation.inverseDefinition;

    delete stateVariableDefinitions.points
      .stateVariablesDeterminingDependencies;

    stateVariableDefinitions.points.returnArrayDependenciesByKey = function () {
      let globalDependencies = {
        coeff0: {
          dependencyType: "stateVariable",
          variableName: "coeff0",
        },
        coeffvar1: {
          dependencyType: "stateVariable",
          variableName: "coeffvar1",
        },
        coeffvar2: {
          dependencyType: "stateVariable",
          variableName: "coeffvar2",
        },
        variables: {
          dependencyType: "stateVariable",
          variableName: "variables",
        },
        lastPointsFromInverting: {
          dependencyType: "stateVariable",
          variableName: "lastPointsFromInverting",
        },
      };
      return { globalDependencies };
    };

    stateVariableDefinitions.data = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "datumX") {
            return [];
          } else {
            // datum or entire array
            // wrap inner dimension by both <point> and <xs>
            // don't wrap outer dimension (for entire array)
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          }
        },
      },
      isArray: true,
      numDimensions: 2,
      entryPrefixes: ["datumX", "datum"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "datumX") {
          // datumX1_2 is the 2nd component of the first datum
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
          // datum3 is all components of the third datum

          let datumInd = Number(varEnding) - 1;
          if (!(Number.isInteger(datumInd) && datumInd >= 0)) {
            return [];
          }

          if (!arraySize) {
            // If don't have array size, we just need to determine if it is a potential entry.
            // Return the first entry assuming array is large enough
            return [datumInd + ",0"];
          }
          if (datumInd < arraySize[0]) {
            // array of "datumInd,i", where i=0, ..., arraySize[1]-1
            return Array.from(
              Array(arraySize[1]),
              (_, i) => datumInd + "," + i,
            );
          } else {
            return [];
          }
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "data") {
          if (propIndex.length === 1) {
            return "datum" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `datumX${propIndex[0]}_${propIndex[1]}`;
          }
        }
        if (varName.slice(0, 5) === "datum") {
          // could be datum or datumX
          let datumNum = Number(varName.slice(5));
          if (Number.isInteger(datumNum) && datumNum > 0) {
            // if propIndex has additional entries, ignore them
            return `datumX${datumNum}_${propIndex[0]}`;
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        data: {
          dependencyType: "attributeComponent",
          attributeName: "data",
          variableNames: ["numPoints", "numDimensions"],
        },
      }),
      returnArraySize({ dependencyValues }) {
        let data = dependencyValues.data;
        if (!data) {
          return [0, 0];
        }
        return [data.stateValues.numPoints, data.stateValues.numDimensions];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          data: {
            dependencyType: "attributeComponent",
            attributeName: "data",
            variableNames: ["points"],
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        let points = globalDependencyValues.data.stateValues.points;

        let data = {};
        for (let pointInd in points) {
          let point = points[pointInd];
          for (let dim in points) {
            data[`${pointInd},${dim}`] = point[dim];
          }
        }
        return {
          setValue: { data },
        };
      },
    };

    return stateVariableDefinitions;
  }
}
