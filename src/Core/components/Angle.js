import GraphicalComponent from "./abstract/GraphicalComponent";
import me from "math-expressions";
import { roundForDisplay } from "../utils/math";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
import { returnWrapNonLabelsSugarFunction } from "../utils/label";

export default class Angle extends GraphicalComponent {
  static componentType = "angle";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.radius = {
      createComponentOfType: "math",
      createStateVariable: "radius",
      defaultValue: me.fromAst(1),
      public: true,
    };
    attributes.chooseReflexAngle = {
      createComponentOfType: "text",
      createStateVariable: "chooseReflexAngle",
      defaultValue: "never",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["never", "allowed", "always"],
    };
    attributes.inDegrees = {
      createComponentOfType: "boolean",
      createStateVariable: "inDegrees",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };

    attributes.radians = {
      createComponentOfType: "math",
    };
    attributes.degrees = {
      createComponentOfType: "math",
    };
    attributes.through = {
      createComponentOfType: "_pointListComponent",
    };
    attributes.betweenLines = {
      createComponentOfType: "_lineListComponent",
    };

    Object.assign(attributes, returnRoundingAttributes());

    attributes.emphasizeRightAngle = {
      createComponentOfType: "boolean",
      createStateVariable: "emphasizeRightAngle",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    sugarInstructions.push({
      replacementFunction: returnWrapNonLabelsSugarFunction({
        wrappingComponentType: "math",
        createAttributeOfType: "radians",
      }),
    });

    return sugarInstructions;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    Object.assign(
      stateVariableDefinitions,
      returnRoundingStateVariableDefinitions(),
    );

    stateVariableDefinitions.betweenLinesName = {
      returnDependencies: () => ({
        betweenLines: {
          dependencyType: "attributeComponent",
          attributeName: "betweenLines",
        },
      }),
      definition({ dependencyValues }) {
        let betweenLinesName = null;

        if (dependencyValues.betweenLines !== null) {
          betweenLinesName = dependencyValues.betweenLines.componentName;
        }
        return { setValue: { betweenLinesName } };
      },
    };

    stateVariableDefinitions.numPointsSpecified = {
      returnDependencies: () => ({
        through: {
          dependencyType: "attributeComponent",
          attributeName: "through",
          variableNames: ["numPoints"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.through !== null) {
          return {
            setValue: {
              numPointsSpecified:
                dependencyValues.through.stateValues.numPoints,
            },
          };
        } else {
          return { setValue: { numPointsSpecified: 0 } };
        }
      },
    };

    stateVariableDefinitions.points = {
      isArray: true,
      numDimensions: 2,
      entryPrefixes: ["pointX", "point"],
      stateVariablesDeterminingDependencies: ["betweenLinesName"],
      returnArraySizeDependencies: () => ({}),
      returnArraySize() {
        return [3, 2];
      },
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "pointX") {
          // pointX1_2 is the 2nd component of the first point
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
            return Array.from(
              Array(arraySize[1]),
              (_, i) => pointInd + "," + i,
            );
          } else {
            return [];
          }
        }
      },
      returnArrayDependenciesByKey({ stateValues }) {
        let globalDependencies = {
          numPointsSpecified: {
            dependencyType: "stateVariable",
            variableName: "numPointsSpecified",
          },
          throughAttr: {
            dependencyType: "attributeComponent",
            attributeName: "through",
            variableNames: ["points"],
          },
          radiansAttr: {
            dependencyType: "attributeComponent",
            attributeName: "radians",
            variableNames: ["value"],
          },
          degreesAttr: {
            dependencyType: "attributeComponent",
            attributeName: "degrees",
            variableNames: ["value"],
          },
        };

        if (stateValues.betweenLinesName !== null) {
          globalDependencies.lineChildren = {
            dependencyType: "child",
            parentName: stateValues.betweenLinesName,
            childGroups: ["lines"],
            variableNames: [
              "points",
              "numDimensions",
              "coeff0",
              "coeffvar1",
              "coeffvar2",
              "nearestPoint",
            ],
          };
        }

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        if (globalDependencyValues.lineChildren) {
          if (globalDependencyValues.lineChildren.length > 2) {
            let warning = {
              message: `Cannot define an angle between ${globalDependencyValues.lineChildren.length} lines`,
              level: 2,
            };

            let points = {};
            for (let i = 0; i < 3; i++) {
              for (let j = 0; j < 2; j++) {
                points[i + "," + j] = me.fromAst("\uff3f");
              }
            }
            return { setValue: { points }, sendWarnings: [warning] };
          } else if (globalDependencyValues.lineChildren.length === 1) {
            let line1 = globalDependencyValues.lineChildren[0];
            if (line1.stateValues.numDimensions !== 2) {
              let points = {};
              for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 2; j++) {
                  points[i + "," + j] = me.fromAst("\uff3f");
                }
              }
              return { setValue: { points } };
            }

            // find closest point to origin
            let pointNearOrigin = line1.stateValues.nearestPoint({
              variables: {
                x1: me.fromAst(0),
                x2: me.fromAst(0),
              },
            });

            let a1 = line1.stateValues.points[0][0].evaluate_to_constant();
            let a2 = line1.stateValues.points[0][1].evaluate_to_constant();
            let b1 = line1.stateValues.points[1][0].evaluate_to_constant();
            let b2 = line1.stateValues.points[1][1].evaluate_to_constant();

            let angleOfLine = Math.atan2(b2 - a2, b1 - a1);

            let points = {
              "0,0": me.fromAst(pointNearOrigin.x1 + Math.cos(angleOfLine)),
              "0,1": me.fromAst(pointNearOrigin.x2 + Math.sin(angleOfLine)),
              "1,0": me.fromAst(pointNearOrigin.x1),
              "1,1": me.fromAst(pointNearOrigin.x2),
            };

            let radians = null;
            if (globalDependencyValues.radiansAttr) {
              radians =
                globalDependencyValues.radiansAttr.stateValues.value.evaluate_to_constant();
              if (!Number.isFinite(radians)) {
                let points = {};
                points["2,0"] = me.fromAst("\uff3f");
                points["2,1"] = me.fromAst("\uff3f");
                return { setValue: { points } };
              }
            } else if (globalDependencyValues.degreesAttr) {
              let degrees =
                globalDependencyValues.degreesAttr.stateValues.value.evaluate_to_constant();
              if (Number.isFinite(degrees)) {
                radians = (degrees / 180) * Math.PI;
              } else {
                points["2,0"] = me.fromAst("\uff3f");
                points["2,1"] = me.fromAst("\uff3f");
                return { setValue: { points } };
              }
            } else {
              radians = Math.PI / 2;
            }

            let desiredAngle = angleOfLine + radians;

            points["2,0"] = me.fromAst(
              pointNearOrigin.x1 + Math.cos(desiredAngle),
            );
            points["2,1"] = me.fromAst(
              pointNearOrigin.x2 + Math.sin(desiredAngle),
            );
            return { setValue: { points } };
          } else {
            // exactly two line children

            let line1 = globalDependencyValues.lineChildren[0];
            let line2 = globalDependencyValues.lineChildren[1];

            let lineIntersection = calculateLineIntersection(line1, line2);

            if (lineIntersection === undefined) {
              let points = {};
              for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 2; j++) {
                  points[i + "," + j] = me.fromAst("\uff3f");
                }
              }
              return { setValue: { points } };
            }

            let point2 = lineIntersection;

            let a1 = line1.stateValues.points[0][0].evaluate_to_constant();
            let a2 = line1.stateValues.points[0][1].evaluate_to_constant();
            let b1 = line1.stateValues.points[1][0].evaluate_to_constant();
            let b2 = line1.stateValues.points[1][1].evaluate_to_constant();
            let point1 = [
              me.fromAst(point2[0].tree + b1 - a1),
              me.fromAst(point2[1].tree + b2 - a2),
            ];

            a1 = line2.stateValues.points[0][0].evaluate_to_constant();
            a2 = line2.stateValues.points[0][1].evaluate_to_constant();
            b1 = line2.stateValues.points[1][0].evaluate_to_constant();
            b2 = line2.stateValues.points[1][1].evaluate_to_constant();
            let point3 = [
              me.fromAst(point2[0].tree + b1 - a1),
              me.fromAst(point2[1].tree + b2 - a2),
            ];

            return {
              setValue: {
                points: {
                  "0,0": point1[0],
                  "0,1": point1[1],
                  "1,0": point2[0],
                  "1,1": point2[1],
                  "2,0": point3[0],
                  "2,1": point3[1],
                },
              },
            };
          }
        }

        let numPointsSpecified = globalDependencyValues.numPointsSpecified;
        let prescribedPoints;
        if (globalDependencyValues.throughAttr) {
          prescribedPoints =
            globalDependencyValues.throughAttr.stateValues.points;
        } else {
          prescribedPoints = [];
        }

        let points = {};

        for (let [ind, prescribedPoint] of prescribedPoints.entries()) {
          points[ind + ",0"] = prescribedPoint[0];
          points[ind + ",1"] = prescribedPoint[1];
        }

        if (numPointsSpecified === 0) {
          points["0,0"] = me.fromAst(1);
          points["0,1"] = me.fromAst(0);
        }

        if (numPointsSpecified < 2) {
          points["1,0"] = me.fromAst(0);
          points["1,1"] = me.fromAst(0);
        }

        if (numPointsSpecified < 3) {
          let radians = null;
          if (globalDependencyValues.radiansAttr) {
            radians =
              globalDependencyValues.radiansAttr.stateValues.value.evaluate_to_constant();
            if (!Number.isFinite(radians)) {
              points["2,0"] = me.fromAst("\uff3f");
              points["2,1"] = me.fromAst("\uff3f");
              return { setValue: { points } };
            }
          } else if (globalDependencyValues.degreesAttr) {
            let degrees =
              globalDependencyValues.degreesAttr.stateValues.value.evaluate_to_constant();
            if (Number.isFinite(degrees)) {
              radians = (degrees / 180) * Math.PI;
            } else {
              points["2,0"] = me.fromAst("\uff3f");
              points["2,1"] = me.fromAst("\uff3f");
              return { setValue: { points } };
            }
          } else {
            radians = Math.PI / 2;
          }

          let a1 = points["0,0"].evaluate_to_constant();
          let a2 = points["0,1"].evaluate_to_constant();
          let b1 = points["1,0"].evaluate_to_constant();
          let b2 = points["1,1"].evaluate_to_constant();

          let angleFromTwoPoints = Math.atan2(a2 - b2, a1 - b1);
          let desiredAngle = angleFromTwoPoints + radians;

          points["2,0"] = me.fromAst(b1 + Math.cos(desiredAngle));
          points["2,1"] = me.fromAst(b2 + Math.sin(desiredAngle));
        }

        return { setValue: { points } };
      },
    };

    stateVariableDefinitions.radians = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      additionalStateVariablesDefined: [
        {
          variableName: "swapPointOrder",
          forRenderer: true,
        },
      ],
      returnDependencies: () => ({
        radians: {
          dependencyType: "attributeComponent",
          attributeName: "radians",
          variableNames: ["value"],
        },
        degrees: {
          dependencyType: "attributeComponent",
          attributeName: "degrees",
          variableNames: ["value"],
        },
        points: {
          dependencyType: "stateVariable",
          variableName: "points",
        },
        chooseReflexAngle: {
          dependencyType: "stateVariable",
          variableName: "chooseReflexAngle",
        },
      }),
      definition({ dependencyValues }) {
        let swapPointOrder = false;

        if (dependencyValues.radians !== null) {
          return {
            setValue: {
              radians: dependencyValues.radians.stateValues.value.simplify(),
              swapPointOrder,
            },
          };
        } else if (dependencyValues.degrees !== null) {
          return {
            setValue: {
              radians: dependencyValues.degrees.stateValues.value
                .divide(me.fromAst(180))
                .simplify()
                .multiply(me.fromAst("pi"))
                .simplify(),
              swapPointOrder,
            },
          };
        }

        let ps = [];
        let foundNaN = false;
        for (let i = 0; i < 3; i++) {
          ps.push([
            dependencyValues.points[i][0].evaluate_to_constant(),
            dependencyValues.points[i][1].evaluate_to_constant(),
          ]);
          if (Number.isNaN(ps[i][0]) || Number.isNaN(ps[i][1])) {
            foundNaN = true;
          }
        }

        let radians;

        if (foundNaN) {
          return {
            setValue: { radians: me.fromAst("\uff3f"), swapPointOrder },
          };
        } else {
          radians =
            Math.atan2(ps[2][1] - ps[1][1], ps[2][0] - ps[1][0]) -
            Math.atan2(ps[0][1] - ps[1][1], ps[0][0] - ps[1][0]);
        }

        // make radians be between 0 and 2pi
        if (radians < 0) {
          radians += 2 * Math.PI;
        }

        if (radians > Math.PI) {
          if (dependencyValues.chooseReflexAngle === "never") {
            radians = 2 * Math.PI - radians;
            swapPointOrder = true;
          }
        } else if (dependencyValues.chooseReflexAngle === "always") {
          radians = 2 * Math.PI - radians;
          swapPointOrder = true;
        }

        return {
          setValue: { radians: me.fromAst(radians), swapPointOrder },
        };
      },
    };

    stateVariableDefinitions.value = {
      isAlias: true,
      targetVariableName: "radians",
    };

    stateVariableDefinitions.angle = {
      isAlias: true,
      targetVariableName: "radians",
    };

    stateVariableDefinitions.degrees = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        radians: {
          dependencyType: "stateVariable",
          variableName: "radians",
        },
      }),
      definition({ dependencyValues }) {
        let degrees;

        if (
          dependencyValues.radians.tree === "\uff3f" ||
          Number.isNaN(dependencyValues.radians.tree)
        ) {
          degrees = dependencyValues.radians;
        } else {
          let radNum = dependencyValues.radians.evaluate_to_constant();
          if (Number.isFinite(radNum)) {
            degrees = me.fromAst((radNum * 180) / Math.PI);
          } else {
            degrees = dependencyValues.radians
              .multiply(me.fromAst(["/", 180, "pi"]))
              .simplify();
          }
        }
        return { setValue: { degrees } };
      },
    };

    stateVariableDefinitions.latexForRenderer = {
      forRenderer: true,
      returnDependencies: () => ({
        inDegrees: {
          dependencyType: "stateVariable",
          variableName: "inDegrees",
        },
        radians: {
          dependencyType: "stateVariable",
          variableName: "radians",
        },
        degrees: {
          dependencyType: "stateVariable",
          variableName: "degrees",
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits",
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals",
        },
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero",
        },
        padZeros: {
          dependencyType: "stateVariable",
          variableName: "padZeros",
        },
      }),
      definition: function ({ dependencyValues }) {
        let params = {};
        if (dependencyValues.padZeros) {
          if (Number.isFinite(dependencyValues.displayDecimals)) {
            params.padToDecimals = dependencyValues.displayDecimals;
          }
          if (dependencyValues.displayDigits >= 1) {
            params.padToDigits = dependencyValues.displayDigits;
          }
        }

        let value = dependencyValues.inDegrees
          ? dependencyValues.degrees
          : dependencyValues.radians;
        let latexForRenderer = roundForDisplay({
          value,
          dependencyValues,
        }).toLatex(params);
        if (dependencyValues.inDegrees) {
          latexForRenderer += "^\\circ";
        }

        return { setValue: { latexForRenderer } };
      },
    };

    stateVariableDefinitions.numericalPoints = {
      isArray: true,
      entryPrefixes: ["numericalPoint"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({}),
      returnArraySize() {
        return [3];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            point: {
              dependencyType: "stateVariable",
              variableName: "point" + (Number(arrayKey) + 1),
            },
          };
        }

        return { dependenciesByKey };
      },

      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let numericalPoints = {};
        for (let arrayKey of arrayKeys) {
          let point = dependencyValuesByKey[arrayKey].point;
          let numericalP = [];
          for (let ind = 0; ind < 2; ind++) {
            let val = point[ind].evaluate_to_constant();
            numericalP.push(val);
          }
          numericalPoints[arrayKey] = numericalP;
        }

        return { setValue: { numericalPoints } };
      },
    };

    stateVariableDefinitions.numericalRadius = {
      forRenderer: true,
      returnDependencies: () => ({
        radius: {
          dependencyType: "stateVariable",
          variableName: "radius",
        },
      }),
      definition({ dependencyValues }) {
        let numericalRadius = dependencyValues.radius.evaluate_to_constant();
        return { setValue: { numericalRadius } };
      },
    };

    return stateVariableDefinitions;
  }

  static adapters = [
    {
      stateVariable: "radians",
      stateVariablesToShadow: Object.keys(
        returnRoundingStateVariableDefinitions(),
      ),
    },
  ];
}

function calculateLineIntersection(line1, line2) {
  if (
    line1.stateValues.numDimensions !== 2 ||
    line2.stateValues.numDimensions !== 2
  ) {
    console.log("Calculating angle between two lines implemented only in 2D");
    return;
  }

  // only implement for constant coefficients
  let a1 = line1.stateValues.coeffvar1.evaluate_to_constant();
  let b1 = line1.stateValues.coeffvar2.evaluate_to_constant();
  let c1 = line1.stateValues.coeff0.evaluate_to_constant();
  let a2 = line2.stateValues.coeffvar1.evaluate_to_constant();
  let b2 = line2.stateValues.coeffvar2.evaluate_to_constant();
  let c2 = line2.stateValues.coeff0.evaluate_to_constant();

  if (
    !(
      Number.isFinite(a1) &&
      Number.isFinite(b1) &&
      Number.isFinite(c1) &&
      Number.isFinite(a2) &&
      Number.isFinite(b2) &&
      Number.isFinite(c2)
    )
  ) {
    console.log(
      "Calculating angle between two lines implemented only for constant coefficients",
    );
    return;
  }

  let d = a1 * b2 - a2 * b1;

  if (Math.abs(d) < 1e-14) {
    if (Math.abs(c2 * a1 - c1 * a2) > 1e-14) {
      console.log("Cannot calculate angle between two parallel lines");
      return;
    } else if (
      (a1 === 0 && b1 === 0 && c1 === 0) ||
      (a2 === 0 && b2 === 0 && c2 === 0)
    ) {
      // at least one line not defined
      return;
    } else {
      // identical lines, return any point on the line
      if (b1 !== 0) {
        return [me.fromAst(0), me.fromAst(-c1 / b1)];
      } else {
        return [me.fromAst(-c1 / a1), me.fromAst(0)];
      }
    }
  }

  // two intersecting lines, return point
  let x = (c2 * b1 - c1 * b2) / d;
  let y = (c1 * a2 - c2 * a1) / d;
  return [me.fromAst(x), me.fromAst(y)];
}
