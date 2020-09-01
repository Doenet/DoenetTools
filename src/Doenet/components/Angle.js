import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';

export default class Angle extends GraphicalComponent {
  static componentType = "angle";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.draggable = { default: true, forRenderer: true };
    properties.radius = { default: me.fromAst(1) };
    properties.renderAsAcuteAngle = { default: false, forRenderer: true, };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let addThrough = function ({ activeChildrenMatched }) {
      // add <through> around points
      let throughChildren = [];
      for (let child of activeChildrenMatched) {
        throughChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "through", children: throughChildren }],
      }
    }

    let atLeastOnePoint = childLogic.newLeaf({
      name: "atLeastOnePoint",
      componentType: 'point',
      comparison: 'atLeast',
      number: 1,
      isSugar: true,
      replacementFunction: addThrough,
    });

    let addMath = function ({ activeChildrenMatched }) {
      // add <math> around math/strings
      let mathChildren = [];
      for (let child of activeChildrenMatched) {
        mathChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "math", children: mathChildren }],
      }
    }

    let atLeastOneString = childLogic.newLeaf({
      name: "atLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
    });

    let atLeastZeroMath = childLogic.newLeaf({
      name: "atLeastZeroMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 0,
    });

    let stringsAndMaths = childLogic.newOperator({
      name: "stringsAndMaths",
      operator: 'and',
      propositions: [atLeastOneString, atLeastZeroMath],
      requireConsecutive: true,
      isSugar: true,
      replacementFunction: addMath,
    });

    let atLeastTwoMath = childLogic.newLeaf({
      name: "atLeastTwoMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 2,
      isSugar: true,
      replacementFunction: addMath,
    });

    let exactlyOneMath = childLogic.newLeaf({
      name: "exactlyOneMath",
      componentType: 'math',
      number: 1,
    });

    let noPoints = childLogic.newLeaf({
      name: "noPoints",
      componentType: 'point',
      number: 0
    });

    let exactlyOneThrough = childLogic.newLeaf({
      name: "exactlyOneThrough",
      componentType: 'through',
      number: 1
    });

    let exactlyTwoLines = childLogic.newLeaf({
      name: "exactlyTwoLines",
      componentType: 'line',
      number: 2,
    });

    childLogic.newOperator({
      name: "throughXorSugar",
      operator: 'xor',
      propositions: [exactlyOneThrough, atLeastOnePoint, exactlyTwoLines,
        stringsAndMaths, atLeastTwoMath, exactlyOneMath, noPoints],
      setAsBase: true
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nPointsSpecified = {
      returnDependencies: () => ({
        throughChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneThrough",
          variableNames: ["nPoints"]
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.throughChild.length === 1) {
          return {
            newValues: {
              nPointsSpecified: dependencyValues.throughChild[0].stateValues.nPoints
            }
          }

        } else {
          return { newValues: { nPointsSpecified: 0 } }
        }

      }
    }

    stateVariableDefinitions.points = {
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["pointX", "point"],
      stateVariablesDeterminingDependencies: ["nPointsSpecified"],
      returnArraySizeDependencies: () => ({
        mathChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneMath"
        },
      }),
      returnArraySize({ dependencyValues }) {
        if (dependencyValues.mathChild.length === 1) {
          return [0, 0]
        } else {
          return [3, 2];
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
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let globalDependencies = {
          lineChildren: {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyTwoLines",
            variableNames: ["points", "nDimensions", "coeff0", "coeffvar1", "coeffvar2"]
          },
          // use value of state variable determining dependency
          // (rather than reference to state variable value)
          // so that this dependency corresponds to the value used to set up dependencies, below
          nPointsSpecified: {
            dependencyType: "value",
            value: stateValues.nPointsSpecified
          }
        }

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {

          let [pointInd, dim] = arrayKey.split(",");

          if (pointInd === "0" || stateValues.nPointsSpecified > 2) {

            let varEnding = (Number(pointInd) + 1) + "_" + (Number(dim) + 1)

            dependenciesByKey[arrayKey] = {
              throughChild: {
                dependencyType: "childStateVariables",
                childLogicName: "exactlyOneThrough",
                variableNames: ["pointX" + varEnding]
              },
            }
          } else if (pointInd === "2" && stateValues.nPointsSpecified === 2) {

            // if have 2 points specified, third point is second specified point

            let varEnding = "2_" + (Number(dim) + 1)

            dependenciesByKey[arrayKey] = {
              throughChild: {
                dependencyType: "childStateVariables",
                childLogicName: "exactlyOneThrough",
                variableNames: ["pointX" + varEnding]
              },
            }

          }
        }

        return { globalDependencies, dependenciesByKey };

      },
      arrayDefinitionByKey({ dependencyValuesByKey, globalDependencyValues, arrayKeys }) {

        if (globalDependencyValues.lineChildren.length === 2) {

          let line1 = globalDependencyValues.lineChildren[0];
          let line2 = globalDependencyValues.lineChildren[1];


          let lineIntersection = calculateLineIntersection(line1, line2);

          if (lineIntersection === undefined) {
            let points = {};
            for (let i = 0; i < 3; i++) {
              for (let j = 0; j < 2; j++) {
                points[i + "," + j] = me.fromAst("\uff3f")
              }
            }
            return { newValues: { points } }
          }

          let point2 = lineIntersection;

          let a1 = line1.stateValues.points[0][0].evaluate_to_constant();
          let a2 = line1.stateValues.points[0][1].evaluate_to_constant();
          let b1 = line1.stateValues.points[1][0].evaluate_to_constant();
          let b2 = line1.stateValues.points[1][1].evaluate_to_constant();
          let point1 = [
            me.fromAst(point2[0].tree + b1 - a1),
            me.fromAst(point2[1].tree + b2 - a2)
          ]

          a1 = line2.stateValues.points[0][0].evaluate_to_constant();
          a2 = line2.stateValues.points[0][1].evaluate_to_constant();
          b1 = line2.stateValues.points[1][0].evaluate_to_constant();
          b2 = line2.stateValues.points[1][1].evaluate_to_constant();
          let point3 = [
            me.fromAst(point2[0].tree + b1 - a1),
            me.fromAst(point2[1].tree + b2 - a2),
          ];

          return {
            newValues: {
              points: {
                "0,0": point1[0],
                "0,1": point1[1],
                "1,0": point2[0],
                "1,1": point2[1],
                "2,0": point3[0],
                "2,1": point3[1],
              }
            }
          }
        }

        let nPointsSpecified = globalDependencyValues.nPointsSpecified;
        let points = {};
        let essentialPoints = {};

        for (let arrayKey of arrayKeys) {
          let [pointInd, dim] = arrayKey.split(",");

          if (pointInd === "0" || nPointsSpecified > 2) {

            let varEnding = (Number(pointInd) + 1) + "_" + (Number(dim) + 1)
            let specifiedPointComponent;
            if (dependencyValuesByKey[arrayKey].throughChild.length === 1) {
              specifiedPointComponent = dependencyValuesByKey[arrayKey].throughChild[0].stateValues["pointX" + varEnding];
            }
            if (specifiedPointComponent === undefined) {
              if ((pointInd === "0" && dim === "1") || (pointInd === "2" && dim === "0")) {
                essentialPoints[arrayKey] = { defaultValue: me.fromAst(1) }
              } else {
                essentialPoints[arrayKey] = { defaultValue: me.fromAst(0) }
              }
            } else {
              points[arrayKey] = specifiedPointComponent;
            }

          } else if (pointInd === "2" && nPointsSpecified === 2) {

            // if have 2 points specified, third point is second specified point

            let varEnding = "2_" + (Number(dim) + 1)
            let specifiedPointComponent;
            if (dependencyValuesByKey[arrayKey].throughChild.length === 1) {
              specifiedPointComponent = dependencyValuesByKey[arrayKey].throughChild[0].stateValues["pointX" + varEnding];
            }
            if (specifiedPointComponent === undefined) {
              if (dim === "0") {
                essentialPoints[arrayKey] = { defaultValue: me.fromAst(1) }
              } else {
                essentialPoints[arrayKey] = { defaultValue: me.fromAst(0) }
              }
            } else {
              points[arrayKey] = specifiedPointComponent;
            }
          } else {
            if (pointInd === "2" && dim === "0") {
              essentialPoints[arrayKey] = { defaultValue: me.fromAst(1) }
            } else {
              essentialPoints[arrayKey] = { defaultValue: me.fromAst(0) }
            }
          }
        }


        let result = {};

        if (Object.keys(points).length > 0) {
          result.newValues = { points }
        }
        if (Object.keys(essentialPoints).length > 0) {
          result.useEssentialOrDefaultValue = { points: essentialPoints }
        }
        return result;

      }

    }

    stateVariableDefinitions.angle = {
      public: true,
      componentType: "math",
      forRenderer: true,
      returnDependencies: () => ({
        mathChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneMath",
          variableNames: ["value"]
        },
        points: {
          dependencyType: "stateVariable",
          variableName: "points"
        },

      }),
      definition({ dependencyValues }) {

        if (dependencyValues.mathChild.length === 1) {
          return {
            newValues: {
              angle: dependencyValues.mathChild[0].stateValues.value.simplify()
            }
          }
        }

        let ps = [];
        let foundNull = false;
        for (let i = 0; i < 3; i++) {
          ps.push([
            dependencyValues.points[i][0].evaluate_to_constant(),
            dependencyValues.points[i][1].evaluate_to_constant(),
          ]);
          if (ps[i][0] === null || ps[i][1] === null) {
            foundNull = true;
          }
        }

        let angle;

        if (foundNull) {
          return { newValues: { angle: me.fromAst('\uff3f') } }
        } else {
          angle = Math.atan2(ps[2][1] - ps[1][1], ps[2][0] - ps[1][0]) -
            Math.atan2(ps[0][1] - ps[1][1], ps[0][0] - ps[1][0])
        }

        // make angle be between 0 and 2pi
        if (angle < 0) {
          angle += 2 * Math.PI;
        }

        return { newValues: { angle: me.fromAst(angle) } }
      }
    }

    stateVariableDefinitions.degrees = {
      public: true,
      componentType: "number",
      forRenderer: true,
      returnDependencies: () => ({
        angle: {
          dependencyType: "stateVariable",
          variableName: "angle",
        }
      }),
      definition({ dependencyValues }) {
        let numericalAngle = dependencyValues.angle.evaluate_to_constant();

        let degrees;
        if (Number.isFinite(numericalAngle)) {
          degrees = numericalAngle / Math.PI * 180;
        } else {
          degrees = NaN;
        }
        return { newValues: { degrees } }
      }
    }

    stateVariableDefinitions.numericalPoints = {
      isArray: true,
      entryPrefixes: ["numericalPoint"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        mathChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneMath"
        },
      }),
      returnArraySize({ dependencyValues }) {
        if (dependencyValues.mathChild.length === 1) {
          return [0, 0]
        } else {
          return [3];
        }
      },
      returnArrayDependenciesByKey({ arrayKeys }) {

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            point: {
              dependencyType: "stateVariable",
              variableName: "point" + (Number(arrayKey) + 1)
            },
          }
        }

        return { dependenciesByKey }
      },

      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        let numericalPoints = {};
        for (let arrayKey of arrayKeys) {
          let point = dependencyValuesByKey[arrayKey].point;
          let numericalP = [];
          for (let ind = 0; ind < 2; ind++) {
            let val = point[ind].evaluate_to_constant();
            if (!Number.isFinite(val)) {
              val = NaN;
            }
            numericalP.push(val);
          }
          numericalPoints[arrayKey] = numericalP;
        }

        return { newValues: { numericalPoints } }
      }
    }

    stateVariableDefinitions.numericalRadius = {
      forRenderer: true,
      returnDependencies: () => ({
        radius: {
          dependencyType: "stateVariable",
          variableName: "radius"
        }
      }),
      definition({ dependencyValues }) {
        let numericalRadius = dependencyValues.radius.evaluate_to_constant();
        if (!Number.isFinite(numericalRadius)) {
          numericalRadius = NaN;
        }
        return { newValues: { numericalRadius } }
      }
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        throughChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneThrough"
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.throughChild.length === 1) {
          return {
            newValues: {
              childrenToRender: [dependencyValues.throughChild[0].componentName]
            }
          }
        } else {
          return { newValues: { childrenToRender: [] } }
        }
      }
    }

    return stateVariableDefinitions;

  }


  adapters = ["angle"];

}

function calculateLineIntersection(line1, line2) {

  if (line1.stateValues.nDimensions !== 2 || line2.stateValues.nDimensions !== 2) {
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

  if (!(Number.isFinite(a1) && Number.isFinite(b1) && Number.isFinite(c1) &&
    Number.isFinite(a2) && Number.isFinite(b2) && Number.isFinite(c2))) {
    console.log("Calculating angle between two lines implemented only for constant coefficients");
    return;
  }

  let d = a1 * b2 - a2 * b1;

  if (Math.abs(d) < 1E-14) {
    if (Math.abs(c2 * a1 - c1 * a2) > 1E-14) {
      console.log("Cannot calculate angle between two parallel lines")
      return;
    } else if ((a1 === 0 && b1 === 0 && c1 === 0) || (a2 === 0 && b2 === 0 && c2 === 0)) {
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
