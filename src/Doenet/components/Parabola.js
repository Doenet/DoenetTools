import Curve from './Curve';
import me from 'math-expressions';

export default class Parabola extends Curve {
  static componentType = "parabola";
  static rendererType = "functioncurve";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    let atMostOneThrough = childLogic.newLeaf({
      name: "atMostOneThrough",
      componentType: 'through',
      comparison: "atMost",
      number: 1,
    });

    let atMostOneVariables = childLogic.newLeaf({
      name: "atMostOneVariables",
      componentType: 'variables',
      comparison: 'atMost',
      number: 1
    });

    childLogic.newOperator({
      name: "parabolaLogic",
      operator: 'and',
      propositions: [atMostOneThrough, atMostOneVariables],
      setAsBase: true,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nVariables = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { nVariables: 2 } })
    }


    // variable to store essential value of a
    // that we can then use its values to calculate b and c
    stateVariableDefinitions.aShadow = {
      defaultValue: 1,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          aShadow: { variablesToCheck: ["aShadow", "a"] }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        // console.log('inverse definition of aShadow')
        // console.log(desiredStateVariableValues)
        return {
          success: true,
          instructions: [{
            setStateVariable: "aShadow",
            value: desiredStateVariableValues.aShadow
          }]
        }
      }
    }

    stateVariableDefinitions.nThroughPoints = {
      returnDependencies: () => ({
        throughChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneThrough",
          variableNames: ["nPoints"]
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.throughChild.length === 0) {
          return {
            newValues: { nThroughPoints: 0 }
          }
        } else {
          return {
            newValues: {
              nThroughPoints: dependencyValues.throughChild[0].stateValues.nPoints
            }
          }
        }
      }
    }


    stateVariableDefinitions.throughPoints = {
      public: true,
      componentType: "point",
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["throughPointX", "throughPoint"],
      returnWrappingComponents(prefix) {
        if (prefix === "throughPointX") {
          return [];
        } else {
          // through point or entire array
          // wrap inner dimension by both <point> and <xs>
          // don't wrap outer dimension (for entire array)
          return [["point", "xs"]];
        }
      },
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "throughPointX") {
          // throughPointX1_2 is the 2nd component of the first through point
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
          // throughPoint3 is all components of the third throughPoint
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
      returnArraySizeDependencies: () => ({
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nThroughPoints, 2];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = (Number(pointInd) + 1) + "_" + (Number(dim) + 1)

          dependenciesByKey[arrayKey] = {
            throughChild: {
              dependencyType: "childStateVariables",
              childLogicName: "atMostOneThrough",
              variableNames: ["pointX" + varEnding]
            }
          }
        }

        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        // console.log(`array definition of throughPoints`)
        // console.log(dependencyValuesByKey)
        // console.log(arrayKeys)


        let throughPoints = {};

        for (let arrayKey of arrayKeys) {

          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = (Number(pointInd) + 1) + "_" + (Number(dim) + 1)

          let throughChild = dependencyValuesByKey[arrayKey].throughChild;
          if (throughChild.length === 1
            && throughChild[0].stateValues["pointX" + varEnding]
          ) {
            let numericalVal = throughChild[0].stateValues["pointX" + varEnding].evaluate_to_constant();
            if (Number.isFinite(numericalVal)) {
              throughPoints[arrayKey] = me.fromAst(numericalVal);
            } else {
              throughPoints[arrayKey] = me.fromAst('\uff3f');
            }
          } else {
            throughPoints[arrayKey] = me.fromAst('\uff3f');
          }
        }

        return { newValues: { throughPoints } }

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyValuesByKey, dependencyNamesByKey,
        initialChange, stateValues,
      }) {

        // console.log('inverse definition of throughPoints')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValuesByKey)

        // if not draggable, then disallow initial change 
        if (initialChange && !stateValues.draggable) {
          return { success: false };
        }

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.throughPoints) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = (Number(pointInd) + 1) + "_" + (Number(dim) + 1)

          if (dependencyValuesByKey[arrayKey].throughChild.length === 1
            && dependencyValuesByKey[arrayKey].throughChild[0].stateValues["pointX" + varEnding]
          ) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].throughChild,
              desiredValue: desiredStateVariableValues.throughPoints[arrayKey],
              childIndex: 0,
              variableIndex: 0,
            })

          } else {
            return { success: false };
          }

        }

        return {
          success: true,
          instructions
        }

      }
    }




    stateVariableDefinitions.numericalThroughPoints = {
      isArray: true,
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nThroughPoints];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            throughPoint: {
              dependencyType: "stateVariable",
              variableName: "throughPoint" + (Number(arrayKey) + 1)
            }
          }
        }

        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        let numericalThroughPoints = {};

        for (let arrayKey of arrayKeys) {
          let point = dependencyValuesByKey[arrayKey].throughPoint.map(x => x.tree)
          if (!point.every(x => Number.isFinite(x))) {
            point = Array(point.length).fill(NaN)
          }
          numericalThroughPoints[arrayKey] = point;
        }

        return { newValues: { numericalThroughPoints } }
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyValuesByKey, dependencyNamesByKey
      }) {
        // console.log('inverse definition of numericalThroughPoints')
        // console.log(desiredStateVariableValues)

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.numericalThroughPoints) {
          if (dependencyValuesByKey[arrayKey].throughPoint) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].throughPoint,
              desiredValue: desiredStateVariableValues.numericalThroughPoints[arrayKey].map(x => me.fromAst(x)),
            })
          } else {
            return { success: false }
          }
        }

        return {
          success: true,
          instructions
        }
      }
    }

    stateVariableDefinitions.pointAreNumerical = {
      returnDependencies: () => ({
        numericalThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numericalThroughPoints"
        },
      }),
      definition: ({ dependencyValues }) => ({
        // need to check just the first entry of numericalThroughPoints
        newValues: {
          pointAreNumerical: dependencyValues.numericalThroughPoints
            .every(x => Number.isFinite(x[0]))
        },
        checkForActualChange: { pointAreNumerical: true }
      })
    }

    stateVariableDefinitions.a = {
      public: true,
      componentType: "number",
      additionalStateVariablesDefined: [
        {
          variableName: "b",
          public: true,
          componentType: "number"
        }, {
          variableName: "c",
          public: true,
          componentType: "number"
        },
        "realValued"],
      returnDependencies: () => ({
        numericalThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numericalThroughPoints"
        },
        pointAreNumerical: {
          dependencyType: "stateVariable",
          variableName: "pointAreNumerical"
        },
        aShadow: {
          dependencyType: "stateVariable",
          variableName: "aShadow",
        }
      }),
      definition: function ({ dependencyValues }) {
        // console.log('definition of a, b, c, realValued of parabola')
        // console.log(dependencyValues)

        if (!dependencyValues.pointAreNumerical) {
          return {
            newValues: {
              a: NaN,
              b: NaN,
              c: NaN,
              realValued: false
            }
          }
        }

        let a, b, c;
        let realValued = true;

        if (dependencyValues.numericalThroughPoints.length === 0) {
          // nothing specified.  Create parabola y=a*x^2, by default
          return {
            useEssentialOrDefaultValue: {
              b: {
                variablesToCheck: ["b"],
                defaultValue: 0,
              },
              c: {
                variablesToCheck: ["c"],
                defaultValue: 0,
              }
            },
            newValues: {
              a: dependencyValues.aShadow,
              realValued: true,
            }
          }

        } else if (dependencyValues.numericalThroughPoints.length === 1) {
          // one point
          // create parabola with point as vertex

          let p1 = dependencyValues.numericalThroughPoints[0];
          let x1 = p1[0];
          let y1 = p1[1];

          a = dependencyValues.aShadow;
          b = -2 * a * x1;
          c = a * x1 * x1 + y1;

          return {
            newValues: {
              a, b, c,
              realValued: true
            }
          }

        } else if (dependencyValues.numericalThroughPoints.length === 2) {
          // two points
          // create parabola through those points with given value of a

          a = dependencyValues.aShadow;

          let p1 = dependencyValues.numericalThroughPoints[0];
          let x1 = p1[0];
          let y1 = p1[1];
          let x12 = x1 * x1;

          let p2 = dependencyValues.numericalThroughPoints[1];
          let x2 = p2[0];
          let y2 = p2[1];
          let x22 = x2 * x2;

          if (x1 === x2) {
            if (y1 == y2) {
              b = -2 * a * x1;
              c = a * x12 + y1;
            } else {
              realValued = false;
              a = NaN;
              b = NaN;
              c = NaN;
            }
          } else {
            b = (y1 - y2 - a * (x12 - x22)) / (x1 - x2);
            c = y1 - a * x12 - b * x1;
          }

          return { newValues: { a, b, c, realValued } }

        } else if (dependencyValues.numericalThroughPoints.length === 3) {
          // three points

          let p1 = dependencyValues.numericalThroughPoints[0];
          let x1 = p1[0];
          let y1 = p1[1];
          let x12 = x1 * x1;

          let p2 = dependencyValues.numericalThroughPoints[1];
          let x2 = p2[0];
          let y2 = p2[1];
          let x22 = x2 * x2;

          let p3 = dependencyValues.numericalThroughPoints[2];
          let x3 = p3[0];
          let y3 = p3[1];
          let x32 = x3 * x3;

          let u1 = x12 - x32;
          let u2 = x22 - x32;

          let v1 = x1 - x3;
          let v2 = x2 - x3;

          let z1 = y1 - y3;
          let z2 = y2 - y3;

          let det = u1 * v2 - u2 * v1;

          if (det === 0) {
            let foundInconsistentPoints = false;
            let nUniquePoints;
            let ux2, uy2;
            if (x1 === x2) {
              if (y1 === y2) {
                if (x1 === x3) {
                  if (y1 == y3) {
                    nUniquePoints = 1;
                  } else {
                    foundInconsistentPoints = true;
                  }
                } else {
                  nUniquePoints = 2;
                  ux2 = x3;
                  uy2 = y3;
                }

              } else {
                foundInconsistentPoints = true;
              }
            } else if (x1 === x3) {
              if (y1 === y3) {
                nUniquePoints = 2;
                ux2 = x2;
                uy2 = y2;
              } else {
                foundInconsistentPoints = true;
              }
            } else if (x2 === x3) {
              if (y2 === y3) {
                nUniquePoints = 2;
                ux2 = x2;
                uy2 = y2;
              } else {
                foundInconsistentPoints = true;
              }
            } else {
              // can't have all unique points if det = 0
              // so shouldn't reach here
              foundInconsistentPoints = true;
            }

            if (foundInconsistentPoints) {
              realValued = false;
              a = NaN;
              b = NaN;
              c = NaN;
            } else if (nUniquePoints === 1) {
              a = dependencyValues.aShadow;
              b = -2 * a * x1;
              c = a * x1 * x1 + y1;
            } else {
              a = dependencyValues.aShadow;
              b = (y1 - uy2 - a * (x12 - ux2 * ux2)) / (x1 - ux2);
              c = y1 - a * x12 - b * x1;
            }
          } else {
            a = (z1 * v2 - z2 * v1) / det;
            b = (z2 * u1 - z1 * u2) / det;
            c = y1 - b * x1 - a * x12;
          }

          return { newValues: { a, b, c, realValued } }

        } else {
          console.warn("Haven't implemented parabola through more than 3 points");
          return {
            newValues: {
              a: NaN,
              b: NaN,
              c: NaN,
              realValued: false
            }
          }

        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues, stateValues, workspace }) {
        // console.log('inverse definition of a, b, c, realValued of parabola')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues);
        // console.log(workspace);

        if (!dependencyValues.pointAreNumerical) {
          return { success: false }
        }

        if (
          (desiredStateVariableValues.a !== undefined && !Number.isFinite(desiredStateVariableValues.a))
          || (desiredStateVariableValues.b !== undefined && !Number.isFinite(desiredStateVariableValues.b))
          || (desiredStateVariableValues.c !== undefined && !Number.isFinite(desiredStateVariableValues.c))
        ) {
          return { success: false }
        }

        Object.assign(workspace, desiredStateVariableValues);

        let getWorkingParameterValue = function (parName) {
          if (workspace[parName] !== undefined) {
            return workspace[parName]
          } else {
            return stateValues[parName];
          }
        }

        if (dependencyValues.numericalThroughPoints.length === 0) {
          let instructions = [];

          if (desiredStateVariableValues.a !== undefined) {
            instructions.push({
              setDependency: "aShadow",
              desiredValue: desiredStateVariableValues.a
            })
          }
          if (desiredStateVariableValues.b !== undefined) {
            instructions.push({
              setStateVariable: "b",
              value: desiredStateVariableValues.b
            })
          }
          if (desiredStateVariableValues.c !== undefined) {
            instructions.push({
              setStateVariable: "c",
              value: desiredStateVariableValues.c
            })
          }
          return {
            success: true,
            instructions
          }
        } else if (dependencyValues.numericalThroughPoints.length === 1) {
          // one point
          // move point to be at vertex
          // modify a if changed

          let a = getWorkingParameterValue("a")
          let b = getWorkingParameterValue("b")
          let c = getWorkingParameterValue("c")

          let x1 = -b / (2 * a);
          let y1 = c - b * b / (4 * a);

          let instructions = [{
            setDependency: "numericalThroughPoints",
            desiredValue: [[x1, y1]],
          }];

          if (desiredStateVariableValues.a !== undefined) {
            instructions.push({
              setDependency: "aShadow",
              desiredValue: desiredStateVariableValues.a
            })
          }

          return {
            success: true,
            instructions
          }

        } else if (dependencyValues.numericalThroughPoints.length === 2) {
          // two points
          // move points vertically to be on parabola
          // modify a if changed
          // Exception, if points are identical, make them be at vertex

          let a = getWorkingParameterValue("a")
          let b = getWorkingParameterValue("b")
          let c = getWorkingParameterValue("c")

          let p1 = dependencyValues.numericalThroughPoints[0];
          let x1 = p1[0];

          let p2 = dependencyValues.numericalThroughPoints[1];
          let x2 = p2[0];

          if (x1 === x2) {
            x1 = -b / (2 * a);
            let y1 = c - b * b / (4 * a);

            let instructions = [{
              setDependency: "numericalThroughPoints",
              desiredValue: [[x1, y1], [x1, y1]],
            }];

            if (desiredStateVariableValues.a !== undefined) {
              instructions.push({
                setDependency: "aShadow",
                desiredValue: desiredStateVariableValues.a
              })
            }

            return {
              success: true,
              instructions
            }


          } else {
            let y1 = a * x1 * x1 + b * x1 + c;
            let y2 = a * x2 * x2 + b * x2 + c;

            let instructions = [{
              setDependency: "numericalThroughPoints",
              desiredValue: [[x1, y1], [x2, y2]],
            }];

            if (desiredStateVariableValues.a !== undefined) {
              instructions.push({
                setDependency: "aShadow",
                desiredValue: desiredStateVariableValues.a
              })
            }

            return {
              success: true,
              instructions
            }

          }


        } else if (dependencyValues.numericalThroughPoints.length === 3) {

          // three points
          // move points vertically to be on parabola
          // Exceptions if some points are identical


          let a = getWorkingParameterValue("a")
          let b = getWorkingParameterValue("b");
          let c = getWorkingParameterValue("c");

          let p1 = dependencyValues.numericalThroughPoints[0];
          let x1 = p1[0];

          let p2 = dependencyValues.numericalThroughPoints[1];
          let x2 = p2[0];

          let p3 = dependencyValues.numericalThroughPoints[2];
          let x3 = p3[0];

          let nUniquePoints = 3;
          let nonIdenticalPointInd;  // (for case with two unique points)
          if (x1 === x2) {
            if (x1 === x3) {
              nUniquePoints = 1;
            } else {
              nUniquePoints = 2;
              nonIdenticalPointInd = 3;
            }
          } else if (x1 === x3) {
            nUniquePoints = 2;
            nonIdenticalPointInd = 2;
          } else if (x2 === x3) {
            nUniquePoints = 2;
            nonIdenticalPointInd = 1;
          }

          if (nUniquePoints === 3) {
            let y1 = a * x1 * x1 + b * x1 + c;
            let y2 = a * x2 * x2 + b * x2 + c;
            let y3 = a * x3 * x3 + b * x3 + c;

            let instructions = [{
              setDependency: "numericalThroughPoints",
              desiredValue: [[x1, y1], [x2, y2], [x3, y3]],
            }];

            // even though don't use a in computation of parabola
            // when have three unique points
            // still set aShadow in case two points become identical
            if (desiredStateVariableValues.a !== undefined) {
              instructions.push({
                setDependency: "aShadow",
                desiredValue: desiredStateVariableValues.a
              })
            }
            return {
              success: true,
              instructions
            }

          } else if (nUniquePoints === 2) {
            if (nonIdenticalPointInd === 1) {
              let ux1 = x1, ux2 = x2;
              let uy1 = a * ux1 * ux1 + b * ux1 + c;
              let uy2 = a * ux2 * ux2 + b * ux2 + c;

              let instructions = [{
                setDependency: "numericalThroughPoints",
                desiredValue: [[ux1, uy1], [ux2, uy2], [ux2, uy2]],
              }];

              if (desiredStateVariableValues.a !== undefined) {
                instructions.push({
                  setDependency: "aShadow",
                  desiredValue: desiredStateVariableValues.a
                })
              }
              return {
                success: true,
                instructions
              }

            } else if (nonIdenticalPointInd === 2) {
              let ux1 = x1, ux2 = x2;
              let uy1 = a * ux1 * ux1 + b * ux1 + c;
              let uy2 = a * ux2 * ux2 + b * ux2 + c;

              let instructions = [{
                setDependency: "numericalThroughPoints",
                desiredValue: [[ux1, uy1], [ux2, uy2], [ux1, uy1]],
              }];

              if (desiredStateVariableValues.a !== undefined) {
                instructions.push({
                  setDependency: "aShadow",
                  desiredValue: desiredStateVariableValues.a
                })
              }
              return {
                success: true,
                instructions
              }
            } else {
              // nonIdenticalPointInd === 3
              let ux1 = x1, ux2 = x3;
              let uy1 = a * ux1 * ux1 + b * ux1 + c;
              let uy2 = a * ux2 * ux2 + b * ux2 + c;

              let instructions = [{
                setDependency: "numericalThroughPoints",
                desiredValue: [[ux1, uy1], [ux1, uy1], [ux2, uy2]],
              }];

              if (desiredStateVariableValues.a !== undefined) {
                instructions.push({
                  setDependency: "aShadow",
                  desiredValue: desiredStateVariableValues.a
                })
              }
              return {
                success: true,
                instructions
              }

            }
          } else {
            // one unique point: make point be at vertex
            x1 = -b / (2 * a);
            let y1 = c - b * b / (4 * a);

            let instructions = [{
              setDependency: "numericalThroughPoints",
              desiredValue: [[x1, y1], [x1, y1], [x1, y1]],
            }];

            if (desiredStateVariableValues.a !== undefined) {
              instructions.push({
                setDependency: "aShadow",
                desiredValue: desiredStateVariableValues.a
              })
            }

            return {
              success: true,
              instructions
            }
          }

        } else {
          return { success: false };
        }


      }

    }

    stateVariableDefinitions.vertex = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["vertexX"],
      returnWrappingComponents(prefix) {
        if (prefix === "vertexX") {
          return [];
        } else {
          // entire array
          // wrap by both <point> and <xs>
          return [["point", "xs"]];
        }
      },
      returnArraySizeDependencies: () => ({}),
      returnArraySize() {
        return [2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          a: {
            dependencyType: "stateVariable",
            variableName: "a"
          },
          b: {
            dependencyType: "stateVariable",
            variableName: "b"
          },
          c: {
            dependencyType: "stateVariable",
            variableName: "c"
          },
          realValued: {
            dependencyType: "stateVariable",
            variableName: "realValued"
          }
        }
        return { globalDependencies }
      },
      arrayDefinitionByKey: function ({ globalDependencyValues }) {

        let vertex = {};

        if (globalDependencyValues.realValued && globalDependencyValues.a !== 0) {
          vertex[0] = me.fromAst(-globalDependencyValues.b / (2 * globalDependencyValues.a));
          vertex[1] = me.fromAst(globalDependencyValues.c - globalDependencyValues.b ** 2 / (4 * globalDependencyValues.a));
        } else {
          vertex[0] = me.fromAst("\uff3f");
          vertex[1] = me.fromAst("\uff3f");
        }
        return { newValues: { vertex } }
      },
      inverseArrayDefinitionByKey: function ({ desiredStateVariableValues, globalDependencyValues,
        workspace, stateValues
      }) {
        // console.log(`inverse definition of parabola vertex`)
        // console.log(desiredStateVariableValues)
        // console.log(globalDependencyValues)

        // change b and c to match vertex

        let x;
        if ("0" in desiredStateVariableValues.vertex) {
          x = desiredStateVariableValues.vertex[0].evaluate_to_constant();
        } else if (workspace.x !== undefined) {
          x = workspace.x
        } else {
          x = stateValues.vertex[0].tree
        }
        if (Number.isFinite(x)) {
          workspace.x = x;
        } else {
          return { success: false }
        }

        let y;
        if ("1" in desiredStateVariableValues.vertex) {
          y = desiredStateVariableValues.vertex[1].evaluate_to_constant();
        } else if (workspace.y !== undefined) {
          y = workspace.y
        } else {
          y = stateValues.vertex[1].tree
        }
        if (Number.isFinite(y)) {
          workspace.y = y;
        } else {
          return { success: false }
        }

        let a = globalDependencyValues.a;
        let b = -2 * a * x;
        let c = y + a * x * x;

        return {
          success: true,
          instructions: [{
            setDependency: "b",
            desiredValue: b,
            additionalDependencyValues: { c: c }
          }]
        }

      }
    }

    stateVariableDefinitions.equation = {
      public: true,
      componentType: "equation",
      // TODO: implement additional properties
      additionalProperties: { simplify: "numberspreserveorder", displaysmallaszero: true },

      returnDependencies: () => ({
        a: {
          dependencyType: "stateVariable",
          variableName: "a"
        },
        b: {
          dependencyType: "stateVariable",
          variableName: "b"
        },
        c: {
          dependencyType: "stateVariable",
          variableName: "c"
        },
      }),
      definition: function ({ dependencyValues }) {

        let ast = [
          '=',
          'y',
          ['+',
            ['*', dependencyValues.a, ['^', 'x', 2]],
            ['*', dependencyValues.b, 'x'],
            dependencyValues.c
          ]
        ]

        let equation = me.fromAst(ast).evaluate_numbers({ skip_ordering: true });

        return { newValues: { equation } }
      }
    }

    stateVariableDefinitions.f = {
      forRenderer: true,
      returnDependencies: () => ({
        a: {
          dependencyType: "stateVariable",
          variableName: "a"
        },
        b: {
          dependencyType: "stateVariable",
          variableName: "b"
        },
        c: {
          dependencyType: "stateVariable",
          variableName: "c"
        },
      }),
      definition: function ({ dependencyValues }) {
        let f = function (x) {
          return dependencyValues.a * x * x + dependencyValues.b * x + dependencyValues.c
        }

        return { newValues: { f } }

      }
    }

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        f: {
          dependencyType: "stateVariable",
          variableName: "f"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          nearestPoint: function (variables) {

            let x1 = variables.x1.evaluate_to_constant();
            let x2 = dependencyValues.f(x1);

            let result = {
              x1, x2
            }
            if (variables.x3 !== undefined) {
              result.x3 = 0;
            }

            return result;

          }
        }
      })
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        throughChild: {
          dependencyType: "childIdentity",
          childLogicName: "atMostOneThrough"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          childrenToRender: dependencyValues.throughChild.map(x => x.componentName)
        }
      })
    }

    return stateVariableDefinitions;
  }


  // parameterizationMin = 0;
  // parameterizationMax = 1;
  // parameterizationPeriodic = true;

}


function getNumericalCoords(coords) {
  if (!coords || coords.tree.length !== 3) {
    return {
      numericEntries: false,
      coordsNumeric: me.fromAst(["vector", NaN, NaN])
    }
  }

  let coordsNumeric = ["vector"];
  let numericEntries = true;
  for (let j = 0; j < 2; j++) {
    let comp = coords.get_component(j).evaluate_to_constant();
    if (Number.isFinite(comp)) {
      coordsNumeric.push(comp);
    } else {
      coordsNumeric.push(NaN);
      numericEntries = false;
    }
  }

  coordsNumeric = me.fromAst(coordsNumeric);

  return {
    numericEntries,
    coordsNumeric,
  }

}
