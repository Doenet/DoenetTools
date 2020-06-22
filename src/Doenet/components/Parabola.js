import Curve from './Curve';
import me from 'math-expressions';

export default class Parabola extends Curve {
  static componentType = "parabola";
  static rendererType = "functioncurve";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: "atMostOneThrough",
      componentType: 'through',
      comparison: "atMost",
      number: 1,
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
      entryPrefixes: ["throughPoint"],
      additionalStateVariablesDefined: [{
        variableName: "throughPointsAreNumeric",
        entryPrefixes: ["throughPointIsNumeric"]
      }],
      returnDependencies: function ({ arrayKeys }) {
        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let dependencies = {
          aShadow: {
            dependencyType: "stateVariable",
            variableName: "aShadow"
          },
          nThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "nThroughPoints"
          }
        }
        if (arrayKey === undefined) {
          dependencies.throughChild = {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneThrough",
            variableNames: ["points"]
          };

        } else {
          dependencies.throughChild = {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneThrough",
            variableNames: ["point" + (arrayKey + 1)]
          };
        }
        return dependencies;

      },
      markStale: function ({ freshnessInfo, changes, arrayKeys }) {

        let freshByKeyPoints = freshnessInfo.throughPoints.freshByKey;
        let freshByKeyNumeric = freshnessInfo.throughPointsAreNumeric.freshByKey;

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (changes.throughChild) {

          if (changes.throughChild.componentIdentitiesChanged) {

            // if throughChild changed
            // then the entire points array is also changed
            for (let key in freshByKeyPoints) {
              delete freshByKeyPoints[key];
            }
            for (let key in freshByKeyNumeric) {
              delete freshByKeyNumeric[key];
            }
          } else {

            let valuesChanged = changes.throughChild.valuesChanged[0];

            if (arrayKey === undefined) {

              if (valuesChanged.points) {
                // if have the same points from throughChild
                // then just check if any of those points values
                // are no longer fresh
                let newFreshByKey = valuesChanged.points.freshnessInfo.freshByKey;
                for (let key in freshByKeyPoints) {
                  if (!newFreshByKey[key]) {
                    delete freshByKeyPoints[key];
                  }
                }
                for (let key in freshByKeyNumeric) {
                  if (!newFreshByKey[key]) {
                    delete freshByKeyNumeric[key];
                  }
                }
              }
            } else {
              if (valuesChanged["point" + (arrayKey + 1)]) {
                delete freshByKeyPoints[arrayKey];
                delete freshByKeyNumeric[arrayKey];
              }
            }

          }
        }

        if (arrayKey === undefined) {
          let fresh = {};
          let partiallyFresh = {}
          if (Object.keys(freshByKeyPoints).length === 0) {
            // asked for entire array and it is all stale
            fresh.throughPoints = false;
          } else {
            // asked for entire array, but it has some fresh elements
            partiallyFresh.throughPoints = true;
          }
          if (Object.keys(freshByKeyNumeric).length === 0) {
            // asked for entire array and it is all stale
            fresh.throughPointsAreNumeric = false;
          } else {
            // asked for entire array, but it has some fresh elements
            partiallyFresh.throughPointsAreNumeric = true;
          }

          return { fresh, partiallyFresh }
        } else {
          // asked for just one component
          return {
            fresh: {
              throughPoints: freshByKeyPoints[arrayKey] === true,
              throughPointsAreNumeric: freshByKeyNumeric[arrayKey] === true
            }
          }
        }

      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKeyPoints = freshnessInfo.throughPoints.freshByKey;
        let freshByKeyNumeric = freshnessInfo.throughPointsAreNumeric.freshByKey;

        // console.log(`definition of throughPoints`)
        // console.log(changes);
        // console.log(dependencyValues)
        // console.log(arrayKeys)

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (dependencyValues.throughChild.length === 1) {

          if (arrayKey === undefined) {
            let throughPoints = dependencyValues.throughChild[0].stateValues.points;

            if (changes.throughChild) {
              let overwriteArray = changes.throughChild.componentIdentitiesChanged;

              if (changes.throughChild.valuesChanged[0].points.changed.changedEntireArray) {
                overwriteArray = true;
              }

              if (overwriteArray) {
                // send array to indicate that should overwrite entire array
                for (let key in throughPoints) {
                  freshByKeyPoints[key] = true;
                  freshByKeyNumeric[key] = true;
                }

                let newPointValues = [];
                let newPointsAreNumeric = [];

                for (let coords of throughPoints) {
                  let { coordsNumeric, numericEntries } = getNumericalCoords(coords)
                  newPointValues.push(coordsNumeric);
                  newPointsAreNumeric.push(numericEntries);
                }

                return {
                  newValues: {
                    throughPoints: newPointValues,
                    throughPointsAreNumeric: newPointsAreNumeric
                  }
                }
              }
            }

            let newPointValues = {};
            let newPointsAreNumeric = {}
            for (let key in throughPoints) {
              if (!freshByKeyPoints[key]) {
                freshByKeyPoints[key] = true;
                freshByKeyNumeric[key] = true;
                let { coordsNumeric, numericEntries } = getNumericalCoords(throughPoints[key])
                newPointValues[key] = coordsNumeric;
                newPointsAreNumeric[key] = numericEntries;

              }
            }
            return {
              newValues: {
                throughPoints: newPointValues,
                throughPointsAreNumeric: newPointsAreNumeric
              }
            }

          } else {
            // have an arrayKey defined

            if (!freshByKeyPoints[arrayKey]) {
              freshByKeyPoints[arrayKey] = true;
              freshByKeyNumeric[arrayKey] = true;
              let coords = dependencyValues.throughChild[0].stateValues["point" + (arrayKey + 1)];
              let coordsNumeric, numericEntries;
              if (coords) {
                let result = getNumericalCoords(coords);
                coordsNumeric = result.coordsNumeric;
                numericEntries = result.numericEntries;
              }
              return {
                newValues: {
                  throughPoints: {
                    [arrayKey]: coordsNumeric
                  },
                  throughPointsAreNumeric: {
                    [arrayKey]: numericEntries
                  }
                }
              }
            } else {
              // arrayKey asked for didn't change
              // don't need to report noChanges for array state variable
              return {};
            }
          }

        } else {
          return {
            newValues: { throughPoints: [], throughPointsAreNumeric: [] }
          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues,
        stateValues, initialChange, arrayKeys, workspace,
      }) {

        // console.log('inverse definition of throughPoints')
        // console.log(desiredStateVariableValues)

        // if not draggable, then disallow initial change 
        if (initialChange && !stateValues.draggable) {
          return { success: false };
        }

        if ("throughPointsAreNumeric" in desiredStateVariableValues) {
          return { success: false }
        }

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
          // working with entire array

          return {
            success: true,
            instructions: [{
              setDependency: "throughChild",
              desiredValue: desiredStateVariableValues.throughPoints,
              childIndex: 0,
              variableIndex: 0
            }]
          }

        } else {

          // just have one arrayKey
          // so child variable of throughChild is an array entry (rather than array)
          return {
            success: true,
            instructions: [{
              setDependency: "throughChild",
              desiredValue: desiredStateVariableValues.throughPoints[arrayKey],
              childIndex: 0,
              variableIndex: 0,
            }]
          }

        }

      }
    }


    stateVariableDefinitions.numericalEntries = {
      returnDependencies: () => ({
        throughPointsAreNumeric: {
          dependencyType: "stateVariable",
          variableName: "throughPointsAreNumeric"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          numericalEntries: dependencyValues.throughPointsAreNumeric.every(x => x)
        },
        checkForActualChange: { numericalEntries: true }
      })
    }

    stateVariableDefinitions.throughPointsNumeric = {
      isArray: true,
      forRenderer: true,
      returnDependencies: () => ({
        throughPoints: {
          dependencyType: "stateVariable",
          variableName: "throughPoints"
        },
        numericalEntries: {
          dependencyType: "stateVariable",
          variableName: "numericalEntries"
        },
      }),
      definition: function ({ dependencyValues }) {

        if (!dependencyValues.numericalEntries) {
          return { newValues: { throughPointsNumeric: [] } }
        } else {
          return {
            newValues: {
              throughPointsNumeric: dependencyValues.throughPoints.map(x => x.tree.slice(1))
            }
          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setDependency: "throughPoints",
            desiredValue: desiredStateVariableValues.throughPointsNumeric
              .map(x => me.fromAst(["vector", ...x]))
          }]
        }
      }
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
        throughPointsNumeric: {
          dependencyType: "stateVariable",
          variableName: "throughPointsNumeric"
        },
        numericalEntries: {
          dependencyType: "stateVariable",
          variableName: "numericalEntries"
        },
        aShadow: {
          dependencyType: "stateVariable",
          variableName: "aShadow",
        }
      }),
      definition: function ({ dependencyValues }) {
        // console.log('definition of a, b, c, realValued of parabola')
        // console.log(dependencyValues)

        if (!dependencyValues.numericalEntries) {
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

        if (dependencyValues.throughPointsNumeric.length === 0) {
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

        } else if (dependencyValues.throughPointsNumeric.length === 1) {
          // one point
          // create parabola with point as vertex

          let p1 = dependencyValues.throughPointsNumeric[0];
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

        } else if (dependencyValues.throughPointsNumeric.length === 2) {
          // two points
          // create parabola through those points with given value of a

          a = dependencyValues.aShadow;

          let p1 = dependencyValues.throughPointsNumeric[0];
          let x1 = p1[0];
          let y1 = p1[1];
          let x12 = x1 * x1;

          let p2 = dependencyValues.throughPointsNumeric[1];
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

        } else if (dependencyValues.throughPointsNumeric.length === 3) {
          // three points

          let p1 = dependencyValues.throughPointsNumeric[0];
          let x1 = p1[0];
          let y1 = p1[1];
          let x12 = x1 * x1;

          let p2 = dependencyValues.throughPointsNumeric[1];
          let x2 = p2[0];
          let y2 = p2[1];
          let x22 = x2 * x2;

          let p3 = dependencyValues.throughPointsNumeric[2];
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

        if (!dependencyValues.numericalEntries) {
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

        if (dependencyValues.throughPointsNumeric.length === 0) {
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
        } else if (dependencyValues.throughPointsNumeric.length === 1) {
          // one point
          // move point to be at vertex
          // modify a if changed

          let a = getWorkingParameterValue("a")
          let b = getWorkingParameterValue("b")
          let c = getWorkingParameterValue("c")

          let x1 = -b / (2 * a);
          let y1 = c - b * b / (4 * a);

          let instructions = [{
            setDependency: "throughPointsNumeric",
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

        } else if (dependencyValues.throughPointsNumeric.length === 2) {
          // two points
          // move points vertically to be on parabola
          // modify a if changed
          // Exception, if points are identical, make them be at vertex

          let a = getWorkingParameterValue("a")
          let b = getWorkingParameterValue("b")
          let c = getWorkingParameterValue("c")

          let p1 = dependencyValues.throughPointsNumeric[0];
          let x1 = p1[0];

          let p2 = dependencyValues.throughPointsNumeric[1];
          let x2 = p2[0];

          if (x1 === x2) {
            x1 = -b / (2 * a);
            let y1 = c - b * b / (4 * a);

            let instructions = [{
              setDependency: "throughPointsNumeric",
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
              setDependency: "throughPointsNumeric",
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


        } else if (dependencyValues.throughPointsNumeric.length === 3) {

          // three points
          // move points vertically to be on parabola
          // Exceptions if some points are identical


          let a = getWorkingParameterValue("a")
          let b = getWorkingParameterValue("b");
          let c = getWorkingParameterValue("c");

          let p1 = dependencyValues.throughPointsNumeric[0];
          let x1 = p1[0];

          let p2 = dependencyValues.throughPointsNumeric[1];
          let x2 = p2[0];

          let p3 = dependencyValues.throughPointsNumeric[2];
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
              setDependency: "throughPointsNumeric",
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
                setDependency: "throughPointsNumeric",
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
                setDependency: "throughPointsNumeric",
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
                setDependency: "throughPointsNumeric",
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
              setDependency: "throughPointsNumeric",
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
      componentType: "point",
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
        realValued: {
          dependencyType: "stateVariable",
          variableName: "realValued"
        }
      }),
      definition: function ({ dependencyValues }) {

        let vertex;

        if (dependencyValues.realValued && dependencyValues.a !== 0) {
          let vertex_x = -dependencyValues.b / (2 * dependencyValues.a);
          let vertex_y = dependencyValues.c - dependencyValues.b ** 2 / (4 * dependencyValues.a)
          vertex = me.fromAst(["vector", vertex_x, vertex_y])
        } else {
          vertex = me.fromAst(["vector", "\uff3f", "\uff3f"])
        }

        return { newValues: { vertex } }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {
        // change b and c to match vertex

        let x, y;

        try {
          x = desiredStateVariableValues.vertex.get_component(0).evaluate_to_constant();
          y = desiredStateVariableValues.vertex.get_component(1).evaluate_to_constant();
        } catch (e) {
          console.warn('Invalid format for vertex')
          return { success: false }
        }

        if (!(Number.isFinite(x) && Number.isFinite(y))) {
          return { success: false }
        }

        let a = dependencyValues.a;
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
