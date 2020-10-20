import Curve from './Curve';
import me from 'math-expressions';

export default class BezierCurve extends Curve {
  constructor(args) {
    super(args);

    this.moveControlVector = this.moveControlVector.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
    this.moveThroughPoint = this.moveThroughPoint.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
    this.changeVectorControlDirection = this.changeVectorControlDirection.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );

    this.actions = {
      moveControlVector: this.moveControlVector,
      moveThroughPoint: this.moveThroughPoint,
      changeVectorControlDirection: this.changeVectorControlDirection,
    };

  }
  static componentType = "beziercurve";
  static rendererType = "beziercurve";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.draggable = { default: true, forRenderer: true };

    properties.splineTension = {
      default: 0.8,
      clamp: [0, 1]
    };
    properties.extrapolateBackward = { default: false };
    properties.extrapolateForward = { default: false };
    properties.splineForm = {
      default: "centripetal",
      toLowerCase: true,
      validValues: ["centripetal", "uniform"]
    };

    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

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
      logicToWaitOnSugar: ["exactlyOneThrough"],
      replacementFunction: addThrough,
    });

    let exactlyOneThrough = childLogic.newLeaf({
      name: "exactlyOneThrough",
      componentType: 'through',
      number: 1
    });

    let throughXorSugar = childLogic.newOperator({
      name: "curveXorSugar",
      operator: 'xor',
      propositions: [exactlyOneThrough, atLeastOnePoint],
    });

    let atMostOneBezierControls = childLogic.newLeaf({
      name: "atMostOneBezierControls",
      componentType: 'beziercontrols',
      comparison: 'atMost',
      number: 1
    });

    // let atMostOneConstrainToAngles = childLogic.newLeaf({
    //   name: "atMostOneConstrainToAngles",
    //   componentType: 'constraintoangles',
    //   comparison: 'atMost',
    //   number: 1
    // });

    // let atMostOneAttractToAngles = childLogic.newLeaf({
    //   name: "atMostOneAttractToAngles",
    //   componentType: 'attracttoangles',
    //   comparison: 'atMost',
    //   number: 1
    // });

    childLogic.newOperator({
      name: "curveAndControls",
      operator: 'and',
      propositions: [throughXorSugar, atMostOneBezierControls,
        // atMostOneConstrainToAngles, atMostOneAttractToAngles
      ],
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nVariables = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { nVariables: 2 } })
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
        if (arrayKey === undefined) {
          return ({
            throughChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneThrough",
              variableNames: ["points"]
            }
          })
        } else {
          return ({
            throughChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneThrough",
              variableNames: ["point" + (arrayKey + 1)]
            }
          })
        }
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
        stateValues, initialChange, arrayKeys
      }) {

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

    stateVariableDefinitions.nThroughPoints = {
      returnDependencies: () => ({
        throughChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneThrough",
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

    stateVariableDefinitions.vectorControlDirections = {
      isArray: true,
      entryPrefixes: ["vectorControlDirection"],
      defaultEntryValue: "none",
      forRenderer: true,
      returnDependencies: function ({ arrayKeys }) {
        if (arrayKeys === undefined) {
          return {
            controlChild: {
              dependencyType: "childStateVariables",
              childLogicName: "atMostOneBezierControls",
              variableNames: ["directions"],
            },
            nThroughPoints: {
              dependencyType: "stateVariable",
              variableName: "nThroughPoints"
            }
          }
        } else {
          return {
            controlChild: {
              dependencyType: "childStateVariables",
              childLogicName: "atMostOneBezierControls",
              variableNames: ["direction" + (Number(arrayKeys[0]) + 1)],
            },
            nThroughPoints: {
              dependencyType: "stateVariable",
              variableName: "nThroughPoints"
            }
          }
        }

      },
      markStale: function ({ freshnessInfo, changes, arrayKeys }) {

        let freshByKey = freshnessInfo.vectorControlDirections.freshByKey;

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0])
        }

        if (changes.nThroughPoints) {
          // if number of through points changed, mark all as stale
          for (let key in freshByKey) {
            delete freshByKey[key];
          }
        } else if (changes.controlChild) {

          if (changes.controlChild.componentIdentitiesChanged) {

            // if controlChild changed
            // then the entire points array is also changed
            for (let key in freshByKey) {
              delete freshByKey[key];
            }
          } else {

            let valuesChanged = changes.controlChild.valuesChanged[0];

            if (arrayKey === undefined) {
              if (valuesChanged.directions) {
                // if have the same controls from controlChild
                // then just check if any of those direction values
                // are no longer fresh
                let newFreshByKey = valuesChanged.directions.freshnessInfo.freshByKey;
                for (let key in freshByKey) {
                  if (!newFreshByKey[key]) {
                    delete freshByKey[key];
                  }
                }
              }
            } else {
              if (valuesChanged["direction" + (arrayKey + 1)]) {
                delete freshByKey[arrayKey];
              }
            }

          }
        }


        if (arrayKey === undefined) {
          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: { vectorControlDirections: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { vectorControlDirections: true } }
          }
        } else {
          // asked for just one component
          return {
            fresh: {
              vectorControlDirections: freshByKey[arrayKey] === true,
            }
          }
        }

      },
      freshenOnNoChanges: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {
        let freshByKey = freshnessInfo.vectorControlDirections.freshByKey;

        if (arrayKeys === undefined) {

          for (let ind = 0; ind < dependencyValues.nThroughPoints; ind++) {
            freshByKey[ind] = true;
          }
        } else {
          freshByKey[arrayKeys[0]] = true;
        }

      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKey = freshnessInfo.vectorControlDirections.freshByKey;

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (dependencyValues.controlChild.length !== 1) {

          // TODO: test that if a controlChild is deleted, then we do get the change
          // that the componentIdentitiesChanged

          let overwriteArray = changes.controlChild.componentIdentitiesChanged;

          if (changes.nThroughPoints) {
            overwriteArray = true;
          }

          let result = {}
          if (overwriteArray) {
            // if overwrite array, return array of undefineds
            // in order to change size
            let vectorControlDirections = Array(dependencyValues.nThroughPoints).fill(undefined);
            result.newValues = { vectorControlDirections };
          }

          let essentialDirections = {};

          for (let ind = 0; ind < dependencyValues.nThroughPoints; ind++) {

            if (!freshByKey[ind]) {

              freshByKey[ind] = true;

              essentialDirections[ind] = {
                variablesToCheck: ["vectorControlDirections" + (ind + 1)]
              }
            }

          }
          result.useEssentialOrDefaultValue = {
            vectorControlDirections: essentialDirections,
          }

          return result;

        }

        if (arrayKey === undefined) {
          let directions = dependencyValues.controlChild[0].stateValues.directions;

          let overwriteArray = changes.controlChild.componentIdentitiesChanged;

          if (changes.controlChild.valuesChanged[0].directions.changed.changedEntireArray) {
            overwriteArray = true;
          }

          if (changes.nThroughPoints) {
            overwriteArray = true;
          }

          if (overwriteArray) {

            let vectorControlDirections = [];
            let essentialDirections = {};

            for (let ind = 0; ind < dependencyValues.nThroughPoints; ind++) {
              freshByKey[ind] = true;

              let direction = directions[ind];

              if (direction) {
                vectorControlDirections.push(direction);
              } else {
                vectorControlDirections.push(undefined);
                essentialDirections[ind] = {
                  variablesToCheck: ["vectorControlDirections" + (ind + 1)]
                }
              }
            }

            return {
              newValues: {
                vectorControlDirections
              },
              useEssentialOrDefaultValue: {
                vectorControlDirections: essentialDirections,
              }
            }

          }

          let newDirections = {};
          let essentialDirections = {};


          for (let ind = 0; ind < dependencyValues.nThroughPoints; ind++) {

            if (!freshByKey[ind]) {

              freshByKey[ind] = true;

              let direction = directions[ind];

              if (direction) {
                newDirections[ind] = direction;
              } else {
                essentialDirections[ind] = {
                  variablesToCheck: ["vectorControlDirections" + (ind + 1)]
                }
              }
            }

          }
          return {
            newValues: {
              vectorControlDirections: newDirections,
            },
            useEssentialOrDefaultValue: {
              vectorControlDirections: essentialDirections,
            }
          }

        } else {
          // have arrayKey

          if (!freshByKey[arrayKey]) {
            freshByKey[arrayKey] = true;

            if (arrayKey < dependencyValues.nThroughPoints) {
              return {
                newValues: {
                  vectorControlDirections: {
                    [arrayKey]: dependencyValues.controlChild[0].stateValues["direction" + (arrayKey + 1)]
                  }
                }
              }
            } else {

              return {
                newValues: {
                  vectorControlDirections: {
                    [arrayKey]: undefined
                  }
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
      inverseDefinition: function ({ desiredStateVariableValues, arrayKeys, dependencyValues }) {
        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        // haven't implemented setting entire array at once
        if (arrayKey === undefined) {
          return { success: false }
        }

        if (arrayKey < dependencyValues.nThroughPoints) {

          if (dependencyValues.controlChild.length === 1) {
            return {
              success: true,
              instructions: [{
                setDependency: "controlChild",
                desiredValue: desiredStateVariableValues.vectorControlDirections[arrayKey],
                childIndex: 0,
                variableIndex: 0
              }]
            }
          } else {

            return {
              success: true,
              instructions: [{
                setStateVariable: "vectorControlDirections",
                value: { [arrayKey]: desiredStateVariableValues.vectorControlDirections[arrayKey] },
              }]
            };
          }
        } else {
          // won't set vector control direction beyond through points
          return { success: false }
        }
      }
    }

    stateVariableDefinitions.controlVectors = {
      isArray: true,
      nDimensions: 2,
      public: true,
      componentType: "vector",
      entryPrefixes: ["controlVector"],
      defaultEntryValue: me.fromAst(["vector", 0, 0]),
      additionalStateVariablesDefined: [{
        variableName: "controlVectorsAreNumeric",
        entryPrefixes: ["controlVectorIsNumeric"],
        nDimensions: 2,
        defaultEntryValue: true,
      }],
      stateVariablesDeterminingDependencies: ["vectorControlDirections", "nThroughPoints"],
      returnDependencies: function ({ arrayKeys, stateValues }) {

        let dependencies = {
          nThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "nThroughPoints"
          }
        }
        if (arrayKeys === undefined) {
          dependencies.controlChild = {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneBezierControls",
            variableNames: ["controls"],
          };
          dependencies.vectorControlDirections = {
            dependencyType: "stateVariable",
            variableName: "vectorControlDirections"
          };

          let pointsNeeded = [];
          for (let pointInd = 0; pointInd < stateValues.nThroughPoints; pointInd++) {
            let direction = stateValues.vectorControlDirections[pointInd];
            let indsToCheck = []
            if (direction === "none") {
              indsToCheck.push(...[pointInd - 1, pointInd, pointInd + 1])
            } else if (direction === "previous") {
              indsToCheck.push(...[pointInd, pointInd + 1])
            } else if (direction === "next") {
              indsToCheck.push(...[pointInd - 1, pointInd])
            }
            for (let ind of indsToCheck) {
              if (ind >= 0 && ind < stateValues.nThroughPoints && !pointsNeeded.includes(ind)) {
                pointsNeeded.push(ind);
              }
            }
          }

          for (let pointInd of pointsNeeded) {
            dependencies["throughPoint" + (pointInd + 1)] = {
              dependencyType: "stateVariable",
              variableName: "throughPoint" + (pointInd + 1)
            }
          }

          if (pointsNeeded.length > 0) {
            dependencies.splineTension = {
              dependencyType: "stateVariable",
              variableName: "splineTension"
            };
            dependencies.splineForm = {
              dependencyType: "stateVariable",
              variableName: "splineForm"
            };
          }

        } else {

          let controlVariables = []

          for (let arrayKey of arrayKeys) {
            let varEndings = arrayKey.split(',').map(x => Number(x) + 1);
            let jointVarEnding = varEndings.join('_');

            controlVariables.push("control" + jointVarEnding)

            dependencies["vectorControlDirection" + varEndings[0]] = {
              dependencyType: "stateVariable",
              variableName: "vectorControlDirection" + varEndings[0]
            }

            let pointInd = varEndings[0] - 1;
            let direction = stateValues.vectorControlDirections[pointInd];
            let indsToCheck = []
            if (direction === "none") {
              indsToCheck.push(...[pointInd - 1, pointInd, pointInd + 1])
            } else if (direction === "previous") {
              indsToCheck.push(...[pointInd, pointInd + 1])
            } else if (direction === "next") {
              indsToCheck.push(...[pointInd - 1, pointInd])
            }

            let haveUncontrolledVector = false;
            for (let ind of indsToCheck) {
              if (ind >= 0 && ind < stateValues.nThroughPoints) {
                haveUncontrolledVector = true;
                dependencies["throughPoint" + (ind + 1)] = {
                  dependencyType: "stateVariable",
                  variableName: "throughPoint" + (ind + 1)
                }
              }
            }

            if (haveUncontrolledVector) {
              dependencies.splineTension = {
                dependencyType: "stateVariable",
                variableName: "splineTension"
              };
              dependencies.splineForm = {
                dependencyType: "stateVariable",
                variableName: "splineForm"
              };
            }
          }

          dependencies['controlChild'] = {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneBezierControls",
            variableNames: controlVariables,
          }
        }
        return dependencies;

      },
      markStale: function ({ freshnessInfo, changes, arrayKeys }) {
        // console.log('mark stale for bezier curve controlVectors')
        // console.log(JSON.parse(JSON.stringify(changes)));
        // console.log(arrayKeys);

        let freshByKeyVectors = freshnessInfo.controlVectors.freshByKey;
        let freshByKeyNumeric = freshnessInfo.controlVectorsAreNumeric.freshByKey;

        if (arrayKeys === undefined) {

          let allStale = false;

          if (changes.nThroughPoints || changes.splineForm || changes.splineTension) {
            // if number of through points changed, mark everything as stale
            // also, since can't tell here which are determined by spline
            // mark all stale if spline parameters change

            allStale = true;
          } else {


            let changesUnaddressed = Object.assign({}, changes);
            if (changes.controlChild) {
              if (changes.controlChild.componentIdentitiesChanged) {
                allStale = true;
              } else {
                let valuesChanged = changes.controlChild.valuesChanged[0];
                if (valuesChanged.controls) {
                  // if have the same controls from controlChild
                  // then just check if any of those controls
                  // are no longer fresh

                  let newFreshByKey = valuesChanged.controls.freshnessInfo.freshByKey;

                  for (let key in freshByKeyVectors) {
                    if (!newFreshByKey[key]) {
                      delete freshByKeyVectors[key];
                      delete freshByKeyNumeric[key];
                    }
                  }

                  delete changesUnaddressed.controlChild;
                }
              }
            }

            if (!allStale) {

              if (changes.vectorControlDirections) {
                let valuesChanged = changes.vectorControlDirections.valuesChanged;
                if (valuesChanged.vectorControlDirections) {
                  let newFreshByPointKey = valuesChanged.vectorControlDirections.freshnessInfo.freshByKey;
                  for (let key in freshByKeyVectors) {
                    let key0 = key.split(',')[0]
                    if (!newFreshByPointKey[key0]) {
                      delete freshByKeyVectors[key];
                      delete freshByKeyNumeric[key];
                    }
                  }
                }
                delete changesUnaddressed.vectorControlDirections;
              }

              // since haven't requested previous values of dependencyValues
              // (maybe more efficient if we did)
              // we mark stale any vector that could depend on a changed
              // through point if it were interpolated using a spline
              for (let varName in changesUnaddressed) {
                if (varName.slice(0, 12) === "throughPoint") {
                  let pointInd = Number(varName.slice(12)) - 1;
                  let keysToMarkStale = [
                    (pointInd - 1) + ",0",
                    (pointInd - 1) + ",1",
                    pointInd + ",0",
                    pointInd + ",1",
                    (pointInd + 1) + ",0",
                    (pointInd + 1) + ",1"
                  ]
                  for (let key in freshByKeyVectors) {
                    if (keysToMarkStale.includes(key)) {
                      delete freshByKeyVectors[key];
                      delete freshByKeyNumeric[key];
                    }
                  }

                }
              }

            }
          }

          if (allStale) {
            for (let key in freshByKeyVectors) {
              delete freshByKeyVectors[key];
            }
            for (let key in freshByKeyNumeric) {
              delete freshByKeyNumeric[key];
            }
          }


          let fresh = {};
          let partiallyFresh = {}
          if (Object.keys(freshByKeyVectors).length === 0) {
            // asked for entire array and it is all stale
            fresh.controlVectors = false;
          } else {
            // asked for entire array, but it has some fresh elements
            partiallyFresh.controlVectors = true;
          }
          if (Object.keys(freshByKeyNumeric).length === 0) {
            // asked for entire array and it is all stale
            fresh.controlVectorsAreNumeric = false;
          } else {
            // asked for entire array, but it has some fresh elements
            partiallyFresh.controlVectorsAreNumeric = true;
          }

          return { fresh, partiallyFresh }

        } else {

          // have arrayKeys

          let allFresh = true;
          let allStale = true;

          if (changes.nThroughPoints || changes.splineForm || changes.splineTension) {
            allFresh = false;
            for (let arrayKey of arrayKeys) {
              delete freshByKeyVectors[arrayKey];
              delete freshByKeyNumeric[arrayKey];
            }
          } else {

            let controlChildChanges = {}
            if (changes.controlChild) {
              if (changes.controlChild.componentIdentitiesChanged) {
                allFresh = false;
                for (let arrayKey of arrayKeys) {
                  delete freshByKeyVectors[arrayKey];
                  delete freshByKeyNumeric[arrayKey];
                }
              } else {
                controlChildChanges = changes.controlChild.valuesChanged[0];
              }
            }

            for (let arrayKey of arrayKeys) {
              let varEndings = arrayKey.split(',').map(x => Number(x) + 1);
              let jointVarEnding = varEndings.join('_')
              // mark stale if
              //  - vector's specified direction from control child changed,
              //  - vector's control direction changed, or 
              //  - vector is specified by spline interpolation
              //    through a point and that point changed

              if (controlChildChanges['control' + jointVarEnding]
                || changes["vectorControlDirections" + varEndings[0]]
                || changes["throughPoint" + (varEndings[0] - 1)]
                || changes["throughPoint" + varEndings[0]]
                || changes["throughPoint" + (varEndings[0] + 1)]
              ) {
                delete freshByKeyVectors[arrayKey]
                delete freshByKeyNumeric[arrayKey]
                allFresh = false;
              } else if (freshByKeyVectors[arrayKey]) {
                allStale = false;
              }
            }
          }
          if (allStale) {
            return {
              fresh: {
                controlVectors: false,
                controlVectorsAreNumeric: false
              }
            }
          }
          if (allFresh) {
            return {
              fresh: {
                controlVectors: true,
                controlVectorsAreNumeric: true
              }
            }
          }
          return {
            partiallyFresh: {
              controlVectors: true,
              controlVectorsAreNumeric: true
            }
          }

        }
      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKeyVectors = freshnessInfo.controlVectors.freshByKey;
        let freshByKeyNumeric = freshnessInfo.controlVectorsAreNumeric.freshByKey;

        // console.log(`definition of controlVectors`)
        // console.log(dependencyValues);
        // console.log(changes);
        // console.log(JSON.parse(JSON.stringify(freshByKeyVectors)));
        // console.log(arrayKeys)

        if (arrayKeys === undefined) {

          let overwriteArray = false;
          if (changes.nThroughPoints) {
            overwriteArray = true;
          } else if (changes.controlChild) {
            if (changes.controlChild.componentIdentitiesChanged) {
              overwriteArray = true;
            } else if (changes.controlChild.valuesChanged[0] &&
              changes.controlChild.valuesChanged[0].controls.changed.changedEntireArray
            ) {
              overwriteArray = true;
            }
          }

          let newControlVectors = {};
          let newControlsAreNumeric = {};
          let essentialControlVectors = {};
          let essentialControlsAreNumeric = {};

          if (overwriteArray) {
            newControlVectors = [];
            newControlsAreNumeric = [];
            // mark everyone as stale so that everything is recalculated
            for (let key in freshByKeyVectors) {
              delete freshByKeyVectors[key];
            }
            for (let key in freshByKeyNumeric) {
              delete freshByKeyNumeric[key];
            }
          }

          let specifiedControlVectors = [];
          if (dependencyValues.controlChild.length === 1) {
            specifiedControlVectors = dependencyValues.controlChild[0].stateValues.controls;
          }


          for (let pointInd = 0; pointInd < dependencyValues.nThroughPoints; pointInd++) {

            let key1 = pointInd + ",0";
            let key2 = pointInd + ",1";

            let direction = dependencyValues.vectorControlDirections[pointInd];
            if (!direction) {
              direction = "none";
            }

            if (direction === "none") {

              // if direction is none, then determine both first and second control vector
              // via spline

              if (!freshByKeyVectors[key1] || freshByKeyVectors[key2]) {
                // since calculate both vectors together as symmetric
                // do calculation if either is stale
                freshByKeyVectors[key1] = true;
                freshByKeyNumeric[key1] = true;
                freshByKeyVectors[key2] = true;
                freshByKeyNumeric[key2] = true;

                let point2 = dependencyValues["throughPoint" + (pointInd + 1)]

                let point1, point3;
                if (pointInd > 0) {
                  point1 = dependencyValues["throughPoint" + pointInd]
                }
                if (pointInd < dependencyValues.nThroughPoints) {
                  point3 = dependencyValues["throughPoint" + (pointInd + 2)]
                }

                let { coordsNumeric, numericEntries } = calculateControlVectorFromSpline({
                  tau: dependencyValues.splineTension,
                  eps: numerics.eps,
                  splineForm: dependencyValues.splineForm,
                  point1,
                  point2,
                  point3,
                });
                let coordsNumericFlip = flipVector(coordsNumeric);

                if (overwriteArray) {
                  newControlVectors.push([coordsNumeric, coordsNumericFlip])
                  newControlsAreNumeric.push([numericEntries, numericEntries])
                } else {
                  newControlVectors[key1] = coordsNumeric;
                  newControlsAreNumeric[key1] = numericEntries;
                  newControlVectors[key2] = coordsNumericFlip;
                  newControlsAreNumeric[key2] = numericEntries;
                }

              }

              continue;

            }

            let specifiedForPoint = specifiedControlVectors[pointInd];
            if (!specifiedForPoint) {
              specifiedForPoint = [];
            }

            // used for case when overwriting array;
            let controlVectorPair = [];
            let controlsAreNumericPair = []

            if (!freshByKeyVectors[key1]) {
              freshByKeyVectors[key1] = true;
              freshByKeyNumeric[key1] = true;

              if (direction !== "next") {

                if (specifiedForPoint[0]) {
                  let { coordsNumeric, numericEntries } = getNumericalCoords(specifiedForPoint[0]);
                  if (overwriteArray) {
                    controlVectorPair.push(coordsNumeric)
                    controlsAreNumericPair.push(numericEntries)
                  } else {
                    newControlVectors[key1] = coordsNumeric;
                    newControlsAreNumeric[key1] = numericEntries;
                  }

                } else {
                  if (overwriteArray) {
                    controlVectorPair.push(undefined);
                  }
                  let variableEnding1 = (pointInd + 1) + '_1';
                  essentialControlVectors[key1] = {
                    // TODO: need a way to get value from array itself
                    variablesToCheck: ["controlVector" + variableEnding1]
                  }
                  essentialControlsAreNumeric[key1] = {
                    variablesToCheck: ["controlVectorIsNumeric" + variableEnding1]
                  }
                }

              } else {

                // if direction is next, determine first control vector via spline
                // based on previous two points

                if (pointInd === 0) {
                  // exception: if have first point, don't have previous through point,
                  // so don't create control vector

                  if (overwriteArray) {
                    controlVectorPair.push(null)
                    controlsAreNumericPair.push(true)
                  } else {
                    newControlVectors[key1] = null;
                    newControlsAreNumeric[key1] = true;
                  }

                } else {

                  let point1 = dependencyValues["throughPoint" + pointInd]
                  let point2 = dependencyValues["throughPoint" + (pointInd + 1)]

                  let { coordsNumeric, numericEntries } = calculateControlVectorFromSpline({
                    tau: dependencyValues.splineTension,
                    eps: numerics.eps,
                    splineForm: dependencyValues.splineForm,
                    point1,
                    point2,
                    point3: undefined,
                  });

                  if (overwriteArray) {
                    controlVectorPair.push(coordsNumeric)
                    controlsAreNumericPair.push(numericEntries)
                  } else {
                    newControlVectors[key1] = coordsNumeric;
                    newControlsAreNumeric[key1] = numericEntries;
                  }

                }
              }

            }

            if (!freshByKeyVectors[key2]) {
              freshByKeyVectors[key2] = true;
              freshByKeyNumeric[key2] = true;

              if (direction !== "previous") {

                if (specifiedForPoint[1]) {
                  let { coordsNumeric, numericEntries } = getNumericalCoords(specifiedForPoint[1]);
                  if (overwriteArray) {
                    controlVectorPair.push(coordsNumeric)
                    controlsAreNumericPair.push(numericEntries)
                  } else {
                    newControlVectors[key2] = coordsNumeric;
                    newControlsAreNumeric[key2] = numericEntries;
                  }

                } else {
                  if (overwriteArray) {
                    controlVectorPair.push(undefined);
                  }
                  let variableEnding2 = (pointInd + 1) + '_2';
                  essentialControlVectors[key2] = {
                    // TODO: need a way to get value from array itself
                    variablesToCheck: ["controlVector" + variableEnding2]
                  }
                  essentialControlsAreNumeric[key2] = {
                    variablesToCheck: ["controlVectorIsNumeric" + variableEnding2]
                  }
                }

              } else {

                // if direction is previous, determine second control vector via spline
                // based on next two points

                if (pointInd === dependencyValues.nThroughPoints - 1) {
                  // exception: if have last point, don't have next through point,
                  // so don't create control vector

                  if (overwriteArray) {
                    controlVectorPair.push(null)
                    controlsAreNumericPair.push(true)
                  } else {
                    newControlVectors[key2] = null;
                    newControlsAreNumeric[key2] = true;
                  }

                } else {


                  let point2 = dependencyValues["throughPoint" + (pointInd + 1)]
                  let point3 = dependencyValues["throughPoint" + (pointInd + 2)]

                  let { coordsNumeric, numericEntries } = calculateControlVectorFromSpline({
                    tau: dependencyValues.splineTension,
                    eps: numerics.eps,
                    splineForm: dependencyValues.splineForm,
                    point1: point3,  // switch point1 and point3 to flip vector
                    point2,
                    point3: undefined,
                  });

                  if (overwriteArray) {
                    controlVectorPair.push(coordsNumeric)
                    controlsAreNumericPair.push(numericEntries)
                  } else {
                    newControlVectors[key2] = coordsNumeric;
                    newControlsAreNumeric[key2] = numericEntries;
                  }

                }
              }

            }

            if (overwriteArray) {
              newControlVectors.push(controlVectorPair);
              newControlsAreNumeric.push(controlsAreNumericPair);
            }
          }

          return {
            newValues: {
              controlVectors: newControlVectors,
              controlVectorsAreNumeric: newControlsAreNumeric
            },
            useEssentialOrDefaultValue: {
              controlVectors: essentialControlVectors,
              controlVectorsAreNumeric: essentialControlsAreNumeric
            }
          }


        } else {
          // arrayKeys defined

          let newControlVectors = {};
          let newControlsAreNumeric = {};
          let essentialControlVectors = {};
          let essentialControlsAreNumeric = {};

          let controlChildStateValues = {};
          if (dependencyValues.controlChild.length === 1) {
            controlChildStateValues = dependencyValues.controlChild[0].stateValues;
          }


          for (let arrayKey of arrayKeys) {

            if (!freshByKeyVectors[arrayKey]) {
              freshByKeyVectors[arrayKey] = true;
              freshByKeyNumeric[arrayKey] = true;

              let keyPieces = arrayKey.split(',').map(x => Number(x));
              let varEndings = keyPieces.map(x => x + 1);
              let jointVarEnding = varEndings.join('_');

              let pointInd = keyPieces[0];

              let direction = dependencyValues["vectorControlDirection" + varEndings[0]];

              if (!direction) {
                direction = "none";
              }

              if (direction === "none") {
                // if direction is none, then determine both first and second control vector
                // via spline

                let flippedArrayKey = keyPieces[0] + "," + (1 - keyPieces[1]);

                // mark flipped arrayKey as fresh, as calculate pair of control vectors together
                freshByKeyVectors[flippedArrayKey] = true;
                freshByKeyNumeric[flippedArrayKey] = true;

                let point2 = dependencyValues["throughPoint" + (pointInd + 1)]

                let point1, point3;
                if (pointInd > 0) {
                  point1 = dependencyValues["throughPoint" + pointInd]
                }
                if (pointInd < dependencyValues.nThroughPoints) {
                  point3 = dependencyValues["throughPoint" + (pointInd + 2)]
                }

                let { coordsNumeric, numericEntries } = calculateControlVectorFromSpline({
                  tau: dependencyValues.splineTension,
                  eps: numerics.eps,
                  splineForm: dependencyValues.splineForm,
                  point1,
                  point2,
                  point3,
                });

                let coordsNumericFlip = flipVector(coordsNumeric);

                if (keyPieces[1] === 0) {
                  // arrayKey corresponds to first vector
                  newControlVectors[arrayKey] = coordsNumeric;
                  newControlVectors[flippedArrayKey] = coordsNumericFlip;
                } else {
                  // arrayKey corresponds to second vector
                  newControlVectors[arrayKey] = coordsNumericFlip;
                  newControlVectors[flippedArrayKey] = coordsNumeric;

                }

                newControlsAreNumeric[arrayKey] = numericEntries;
                newControlsAreNumeric[flippedArrayKey] = numericEntries;

                continue;

              }

              if (keyPieces[1] === 0) {

                if (direction !== "next") {

                  let specifiedControl = controlChildStateValues["control" + jointVarEnding];

                  if (specifiedControl) {
                    let { coordsNumeric, numericEntries } = getNumericalCoords(specifiedControl);
                    newControlVectors[arrayKey] = coordsNumeric;
                    newControlsAreNumeric[arrayKey] = numericEntries;
                  } else {

                    let variableEnding1 = (pointInd + 1) + '_1';
                    essentialControlVectors[arrayKey] = {
                      // TODO: need a way to get value from array itself
                      variablesToCheck: ["controlVector" + variableEnding1]
                    }
                    essentialControlsAreNumeric[arrayKey] = {
                      variablesToCheck: ["controlVectorIsNumeric" + variableEnding1]
                    }
                  }

                } else {

                  // if direction is next, determine first control vector via spline
                  // based on previous two points

                  if (pointInd === 0) {
                    // exception: if have first point, don't have previous through point,
                    // so don't create control vector
                    newControlVectors[arrayKey] = null;
                    newControlsAreNumeric[arrayKey] = true;

                  } else {

                    let point1 = dependencyValues["throughPoint" + pointInd]
                    let point2 = dependencyValues["throughPoint" + (pointInd + 1)]

                    let { coordsNumeric, numericEntries } = calculateControlVectorFromSpline({
                      tau: dependencyValues.splineTension,
                      eps: numerics.eps,
                      splineForm: dependencyValues.splineForm,
                      point1,
                      point2,
                      point3: undefined,
                    });

                    newControlVectors[arrayKey] = coordsNumeric;
                    newControlsAreNumeric[arrayKey] = numericEntries;

                  }
                }
              } else {

                if (direction !== "previous") {

                  let specifiedControl = controlChildStateValues["control" + jointVarEnding];

                  if (specifiedControl) {
                    let { coordsNumeric, numericEntries } = getNumericalCoords(specifiedControl);
                    newControlVectors[arrayKey] = coordsNumeric;
                    newControlsAreNumeric[arrayKey] = numericEntries;
                  } else {
                    let variableEnding2 = (pointInd + 1) + '_2';
                    essentialControlVectors[arrayKey] = {
                      // TODO: need a way to get value from array itself
                      variablesToCheck: ["controlVector" + variableEnding2]
                    };
                    essentialControlsAreNumeric[arrayKey] = {
                      variablesToCheck: ["controlVectorIsNumeric" + variableEnding2]
                    };
                  }

                } else {

                  // if direction is previous, determine second control vector via spline
                  // based on next two points

                  if (pointInd === dependencyValues.nThroughPoints - 1) {
                    // exception: if have last point, don't have next through point,
                    // so don't create control vector
                    newControlVectors[arrayKey] = null;
                    newControlsAreNumeric[arrayKey] = true;

                  } else {

                    let point2 = dependencyValues["throughPoint" + (pointInd + 1)]
                    let point3 = dependencyValues["throughPoint" + (pointInd + 2)]

                    let { coordsNumeric, numericEntries } = calculateControlVectorFromSpline({
                      tau: dependencyValues.splineTension,
                      eps: numerics.eps,
                      splineForm: dependencyValues.splineForm,
                      point1: point3,  // switch point1 and point3 to flip vector
                      point2,
                      point3: undefined,
                    });

                    newControlVectors[arrayKey] = coordsNumeric;
                    newControlsAreNumeric[arrayKey] = numericEntries;

                  }
                }

              }

            }
          }

          return {
            newValues: {
              controlVectors: newControlVectors,
              controlVectorsAreNumeric: newControlsAreNumeric
            },
            useEssentialOrDefaultValue: {
              controlVectors: essentialControlVectors,
              controlVectorsAreNumeric: essentialControlsAreNumeric
            }
          }
        }

      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues,
        stateValues, initialChange, arrayKeys
      }) {

        // console.log(`inverse definition of controlVectors`);
        // console.log(desiredStateVariableValues)
        // console.log(arrayKeys)

        // if not draggable, then disallow initial change 
        if (initialChange && !stateValues.draggable) {
          return { success: false };
        }

        if ("controlVectorsAreNumeric" in desiredStateVariableValues) {
          return { success: false }
        }

        if (arrayKeys === undefined) {
          // working with entire array

          return {
            success: true,
            instructions: [{
              setDependency: "controlChild",
              desiredValue: desiredStateVariableValues.controlVectors,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {

          // have arrayKeys

          let instructions = [];

          for (let [ind, arrayKey] of arrayKeys.entries()) {
            instructions.push({
              setDependency: "controlChild",
              desiredValue: desiredStateVariableValues.controlVectors[arrayKey],
              childIndex: 0,
              variableIndex: ind
            })

          }

          return {
            success: true,
            instructions
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
        controlVectorsAreNumeric: {
          dependencyType: "stateVariable",
          variableName: "controlVectorsAreNumeric"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          numericalEntries: dependencyValues.throughPointsAreNumeric.every(x => x)
            && [].concat(...dependencyValues.controlVectorsAreNumeric).every(x => x)  // flatten
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
    }

    stateVariableDefinitions.controlVectorsNumeric = {
      isArray: true,
      forRenderer: true,
      nDimensions: 2,
      returnDependencies: () => ({
        controlVectors: {
          dependencyType: "stateVariable",
          variableName: "controlVectors"
        },
        numericalEntries: {
          dependencyType: "stateVariable",
          variableName: "numericalEntries"
        },
      }),
      definition: function ({ dependencyValues }) {

        if (!dependencyValues.numericalEntries) {
          return { newValues: { controlVectorsNumeric: [] } }
        } else {
          return {
            newValues: {
              controlVectorsNumeric: dependencyValues.controlVectors.map(x => x.map(y => y ? y.tree.slice(1) : [NaN, NaN]))
            }
          }
        }
      },
    }

    stateVariableDefinitions.splineCoeffs = {
      isArray: true,
      returnDependencies: () => ({
        throughPoints: {
          dependencyType: "stateVariable",
          variableName: "throughPoints"
        },
        throughPointsNumeric: {
          dependencyType: "stateVariable",
          variableName: "throughPointsNumeric"
        },
        controlVectors: {
          dependencyType: "stateVariable",
          variableName: "controlVectors"
        },
        controlVectorsNumeric: {
          dependencyType: "stateVariable",
          variableName: "controlVectorsNumeric"
        },
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints"
        },
      }),
      markStale: function ({ freshnessInfo, changes, arrayKeys }) {

        let freshByKey = freshnessInfo.splineCoeffs.freshByKey;

        // console.log(`markStale for splineCoeffs of bezier curve`)
        // console.log(changes);
        // console.log(arrayKeys);
        // console.log(JSON.parse(JSON.stringify(freshByKey)))

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        // if ((changes.throughPoints && changes.throughPoints.valuesChanged.throughPoints.changed.changedEntireArray)
        //   || (changes.controlVectors && changes.controlVectors.valuesChanged.controlVectors.changed.changedEntireArray)
        // ) {
        //   for (let key in freshByKey) {
        //     delete freshByKey[key];
        //   }
        // } else {

        if (changes.throughPoints) {
          let newFreshByPointKey = changes.throughPoints.valuesChanged.throughPoints.freshnessInfo.freshByKey;

          for (let key in freshByKey) {
            // each spline coeff depends on corresponding point and the next point
            let key2 = Number(key) + 1;
            if (!(newFreshByPointKey[key] && newFreshByPointKey[key2])) {
              delete freshByKey[key];
            }
          }
        }

        if (changes.controlVectors) {
          let newFreshByVectorKey = changes.controlVectors.valuesChanged.controlVectors.freshnessInfo.freshByKey;

          for (let key in freshByKey) {
            // each spline coeff depends on corresponding pair of vectors and the next pair of vectors
            let vkey11 = key + ",0", vkey12 = key + ",1";
            let key2 = Number(key) + 1;
            let vkey21 = key2 + ",0", vkey22 = key2 + ",1";

            if (!(newFreshByVectorKey[vkey11] && newFreshByVectorKey[vkey12]
              && newFreshByVectorKey[vkey21] && newFreshByVectorKey[vkey22]
            )) {
              delete freshByKey[key];
            }
          }
          // }

        }

        if (arrayKey === undefined) {
          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: { splineCoeffs: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { splineCoeffs: true } }
          }
        } else {
          // asked for just one component
          return {
            fresh: {
              splineCoeffs: freshByKey[arrayKey] === true,
            }
          }
        }

      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKey = freshnessInfo.splineCoeffs.freshByKey;

        // console.log(`definition of splineCoeffs`)
        // console.log(changes);
        // console.log(dependencyValues)
        // console.log(arrayKeys)

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let tpNumeric = dependencyValues.throughPointsNumeric;
        let cvNumeric = dependencyValues.controlVectorsNumeric;

        // Note we used throughPoints and controlVectors (as well as numerical versions)
        // as dependencies, as these state variables track changes at array level

        if ((changes.throughPoints && changes.throughPoints.valuesChanged.throughPoints.changed.changedEntireArray)
          || (changes.controlVectors && changes.controlVectors.valuesChanged.controlVectors.changed.changedEntireArray)
        ) {

          // send array to indicate that should overwrite entire array
          let splineCoeffs = [];

          for (let i = 0; i < tpNumeric.length - 1; i++) {
            freshByKey[i] = true;

            let p1 = tpNumeric[i];
            let p2 = tpNumeric[i + 1];
            let cv1 = cvNumeric[i][1];
            let cv2 = cvNumeric[i + 1][0];

            let c = [];
            for (let dim = 0; dim < 2; dim++) {
              c.push(initCubicPoly(
                p1[dim],
                p2[dim],
                3 * cv1[dim],
                -3 * cv2[dim]
              ));
            }
            splineCoeffs.push(c);
          }

          return {
            newValues: { splineCoeffs }
          }
        }

        let newSpineCoeffs = {};


        for (let i = 0; i < tpNumeric.length - 1; i++) {

          if (!freshByKey[i]) {
            freshByKey[i] = true;

            let p1 = tpNumeric[i];
            let p2 = tpNumeric[i + 1];
            let cv1 = cvNumeric[i][1];
            let cv2 = cvNumeric[i + 1][0];
            let c = [];

            for (let dim = 0; dim < 2; dim++) {
              c.push(initCubicPoly(
                p1[dim],
                p2[dim],
                3 * cv1[dim],
                -3 * cv2[dim]
              ));
            }

            newSpineCoeffs[i] = c;
          }
        }
        return {
          newValues: {
            splineCoeffs: newSpineCoeffs,
          }
        }

      },
    }

    stateVariableDefinitions.f = {
      forRenderer: true,
      returnDependencies: () => ({
        throughPoints: {
          dependencyType: "stateVariable",
          variableName: "throughPoints"
        },
        splineCoeffs: {
          dependencyType: "stateVariable",
          variableName: "splineCoeffs"
        },
        numericalEntries: {
          dependencyType: "stateVariable",
          variableName: "numericalEntries"
        },
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints"
        },
        extrapolateBackward: {
          dependencyType: "stateVariable",
          variableName: "extrapolateBackward"
        },
        extrapolateForward: {
          dependencyType: "stateVariable",
          variableName: "extrapolateForward"
        }
      }),
      defaultValue: () => 0,
      definition: ({ dependencyValues }) => ({
        newValues: {
          f: function (t, dim) {

            if (isNaN(t)) {
              return NaN;
            }

            if (!dependencyValues.numericalEntries) {
              return NaN;
            }

            let len = dependencyValues.nThroughPoints - 1;

            if (len < 0) {
              return NaN;
            }

            let z = Math.floor(t);

            let extrapolate = false;
            if (t < 0) {
              if (dependencyValues.extrapolateBackward) {
                z = 0;
                extrapolate = true;
              } else {
                if (dim !== undefined) {
                  return dependencyValues.throughPoints[0].tree[dim + 1];
                } else {
                  return dependencyValues.throughPoints[0].tree.slice(1);
                }
              }
            }

            if (t >= len) {
              if (dependencyValues.extrapolateForward) {
                z = len - 1;
                extrapolate = true;
              } else {
                if (dim !== undefined) {
                  return dependencyValues.throughPoints[len].tree[dim + 1];
                } else {
                  return dependencyValues.throughPoints[len].tree.slice(1);
                }
              }
            }

            t -= z;

            if (extrapolate) {
              if (z > 0) {
                z = 1;
                t -= 1;
              }
              let c = this.state.extracoeffs[z];
              if (c === undefined) {
                return NaN;
              }

              if (dim !== undefined) {
                let cd = c[dim]
                return (cd[2] * t + cd[1]) * t + cd[0];
              } else {
                let r = [];
                for (let dim = 0; dim < 2; dim++) {
                  let cd = c[dim]
                  r.push((cd[2] * t + cd[1]) * t + cd[0]);
                }
                return r;
              }
            }

            let c = dependencyValues.splineCoeffs[z];
            if (c === undefined) {
              return NaN;
            }

            if (dim !== undefined) {
              let cd = c[dim]
              return (((cd[3] * t + cd[2]) * t + cd[1]) * t + cd[0]);
            } else {
              let r = [];
              for (let dim = 0; dim < 2; dim++) {
                let cd = c[dim]
                r.push((((cd[3] * t + cd[2]) * t + cd[1]) * t + cd[0]));
              }
              return r;
            }
          }

        }
      })

    }

    stateVariableDefinitions.parameterizationMin = {
      forRenderer: true,
      additionalStateVariablesDefined: [{
        variableName: "parameterizationMax",
        forRenderer: true
      }],
      returnDependencies: () => ({
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
        extrapolateBackward: {
          dependencyType: "stateVariable",
          variableName: "extrapolateBackward"
        },
        extrapolateForward: {
          dependencyType: "stateVariable",
          variableName: "extrapolateForward"
        }
      }),
      definition: function ({ dependencyValues }) {

        let parameterizationMin = 0;
        let parameterizationMax = dependencyValues.nThroughPoints - 1;

        if (dependencyValues.extrapolateBackward) {
          parameterizationMin = -parameterizationMax;
        }
        if (dependencyValues.extrapolateForward) {
          parameterizationMax *= 2;
        }

        return {
          newValues: {
            parameterizationMin, parameterizationMax
          }
        }

      }
    }

    stateVariableDefinitions.controlPoints = {
      isArray: true,
      public: true,
      componentType: "point",
      entryPrefixes: "controlPoint",
      nDimensions: 2,
      returnDependencies: function ({ arrayKeys }) {

        if (arrayKeys === undefined) {
          return {
            throughPoints: {
              dependencyType: "stateVariable",
              variableName: "throughPoints",
            },
            controlVectors: {
              dependencyType: "stateVariable",
              variableName: "controlVectors"
            }
          }
        } else {
          let dependencies = {};

          for (let arrayKey of arrayKeys) {
            let varEndings = arrayKey.split(',').map(x => Number(x) + 1);
            let jointVarEnding = varEndings.join('_');

            dependencies["throughPoint" + varEndings[0]] = {
              dependencyType: "stateVariable",
              variableName: "throughPoint" + varEndings[0],
            }

            dependencies["controlVector" + jointVarEnding] = {
              dependencyType: "stateVariable",
              variableName: "controlVector" + jointVarEnding,
            }
          }

          return dependencies;
        }
      },
      markStale: function ({ freshnessInfo, changes, arrayKeys }) {
        let freshByKey = freshnessInfo.controlPoints.freshByKey;

        // console.log('mark stale for bezier curve controlPoints')
        // console.log(JSON.parse(JSON.stringify(changes)));
        // console.log(arrayKeys);
        // console.log(JSON.parse(JSON.stringify(freshByKey)));


        // if ((changes.throughPoints && changes.throughPoints.valuesChanged.throughPoints.changed.changedEntireArray)
        //   || (changes.controlVectors && changes.controlVectors.valuesChanged.controlVectors.changed.changedEntireArray)
        // ) {
        //   for (let key in freshByKey) {
        //     delete freshByKey[key];
        //   }
        // } else {

        if (changes.throughPoints) {
          let newFreshByPointKey = changes.throughPoints.valuesChanged.throughPoints.freshnessInfo.freshByKey;

          for (let key in freshByKey) {
            let key0 = key.split(',')[0]
            if (!newFreshByPointKey[key0]) {
              delete freshByKey[key];
            }
          }
        }

        if (changes.controlVectors) {
          let newFreshByVectorKey = changes.controlVectors.valuesChanged.controlVectors.freshnessInfo.freshByKey;

          for (let key in freshByKey) {
            if (!newFreshByVectorKey[key]) {
              delete freshByKey[key];
            }
          }
        }

        // }

        if (arrayKeys === undefined) {
          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: { controlPoints: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { controlPoints: true } }
          }
        } else {
          // asked for just one component
          return {
            fresh: {
              controlPoints: freshByKey[arrayKeys[0]] === true,
            }
          }
        }
      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKey = freshnessInfo.controlPoints.freshByKey;

        // console.log(`definition of controlPoints`)
        // console.log(dependencyValues);
        // console.log(changes);
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(arrayKeys)

        if (arrayKeys === undefined) {

          if ((changes.throughPoints && changes.throughPoints.valuesChanged.throughPoints.changed.changedEntireArray)
            || (changes.controlVectors && changes.controlVectors.valuesChanged.controlVectors.changed.changedEntireArray)
          ) {

            let controlPoints = [];

            for (let [pointInd, throughPoint] of dependencyValues.throughPoints.entries()) {

              freshByKey[pointInd + ",0"] = true;
              freshByKey[pointInd + ",1"] = true;

              let csForPoint = [];

              let cv1 = dependencyValues.controlVectors[pointInd][0];
              if (cv1) {
                // we're assuming points and vectors have numerical entries
                let cp = me.fromAst(["tuple",
                  throughPoint.tree[1] + cv1.tree[1],
                  throughPoint.tree[2] + cv1.tree[2],
                ])
                csForPoint.push(cp);
              } else {
                csForPoint.push(null);
              }

              let cv2 = dependencyValues.controlVectors[pointInd][1];
              if (cv2) {
                // we're assuming points and vectors have numerical entries
                let cp = me.fromAst(["tuple",
                  throughPoint.tree[1] + cv2.tree[1],
                  throughPoint.tree[2] + cv2.tree[2],
                ])
                csForPoint.push(cp);
              } else {
                csForPoint.push(null);
              }

              controlPoints.push(csForPoint);

            }

            return { newValues: { controlPoints } }

          }

          let newControlPoints = {};

          for (let [pointInd, throughPoint] of dependencyValues.throughPoints.entries()) {

            let key1 = pointInd + ",0";

            if (!freshByKey[key1]) {
              freshByKey[key1] = true

              let cv1 = dependencyValues.controlVectors[pointInd][0];
              if (cv1) {
                // we're assuming points and vectors have numerical entries
                let cp = me.fromAst(["tuple",
                  throughPoint.tree[1] + cv1.tree[1],
                  throughPoint.tree[2] + cv1.tree[2],
                ])
                newControlPoints[key1] = cp;
              } else {
                newControlPoints[key1] = null;
              }
            }


            let key2 = pointInd + ",1";

            if (!freshByKey[key2]) {
              freshByKey[key2] = true

              let cv2 = dependencyValues.controlVectors[pointInd][1];
              if (cv2) {
                // we're assuming points and vectors have numerical entries
                let cp = me.fromAst(["tuple",
                  throughPoint.tree[1] + cv2.tree[1],
                  throughPoint.tree[2] + cv2.tree[2],
                ])
                newControlPoints[key2] = cp;
              } else {
                newControlPoints[key2] = null;
              }
            }

          }

          return { newValues: { controlPoints: newControlPoints } }

        } else {
          // arrayKeys defined

          let newControlPoints = {};


          for (let arrayKey of arrayKeys) {

            if (!freshByKey[arrayKey]) {
              freshByKey[arrayKey] = true;

              let varEndings = arrayKey.split(',').map(x => Number(x) + 1);
              let jointVarEnding = varEndings.join('_');

              let throughPoint = dependencyValues["throughPoint" + varEndings[0]];
              let controlVector = dependencyValues["controlVector" + jointVarEnding];

              if (controlVector) {
                // we're assuming points and vectors have numerical entries
                let cp = me.fromAst(["tuple",
                  throughPoint.tree[1] + controlVector.tree[1],
                  throughPoint.tree[2] + controlVector.tree[2],
                ])
                newControlPoints[arrayKey] = cp;
              } else {
                newControlPoints[arrayKey] = null;
              }

            }

          }

          return { newValues: { newControlPoints } }
        }

      },
    }


    stateVariableDefinitions.controlPointsNumeric = {
      isArray: true,
      forRenderer: true,
      nDimensions: 2,
      returnDependencies: () => ({
        controlPoints: {
          dependencyType: "stateVariable",
          variableName: "controlPoints"
        },
        numericalEntries: {
          dependencyType: "stateVariable",
          variableName: "numericalEntries"
        },
      }),
      definition: function ({ dependencyValues }) {

        if (!dependencyValues.numericalEntries) {
          return { newValues: { controlPointsNumeric: [] } }
        } else {
          return {
            newValues: {
              controlPointsNumeric: dependencyValues.controlPoints.map(x => x.map(y => y ? y.tree.slice(1) : [NaN, NaN]))
            }
          }
        }
      },
    }

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({}),
      definition: ({ dependencyValues }) => ({
        newValues: { nearestPoint: me.fromText("(1,2)") }
      })
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        throughChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneThrough"
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

  updateState(args = {}) {
    if (args.init === true) {
      this.state.parameterizationMin = 0;
      this.state.parameterizationMax = 1;
      this.state.parameterizationExclude = [];
      this.state.parameterizationKeyPoints = [];
      this.state.parameterizationPeriodic = false;
      this.state.parameterizationNsteps = 500;


      // skip setting up variables if child logic overwritten
      if (!this.curveChildLogicOverwritten) {

        // if not already defined, set up essential state variables
        // for bezier controls
        if (this.state.throughForControlChild === undefined) {
          this.state.throughForControlChild = [];
          this._state.throughForControlChild.essential = true;
        }
        if (this.state.lastControlChildValue === undefined) {
          this.state.lastControlChildValue = [];
          this._state.lastControlChildValue.essential = true;
        }
        this._state.pointCurrentlyControlled.essential = true;

      }
    }



    this.calculateBezierParameters();



  }

  calculateBezierParameters() {

    if (this._state.throughPoints === undefined ||
      this._state.throughPoints.essential !== true) {
      this.state.throughPoints = [];
    }
    if (this._state.controlVectors === undefined ||
      this._state.controlVectors.essential !== true) {
      this.state.controlVectors = [];
    }
    if (this._state.symmetriccontrols === undefined ||
      this._state.symmetriccontrols.essential !== true) {
      this.state.symmetriccontrols = [];
    }

    // if controlVectors is a readyonly proxy
    // (which can happen with a ref)
    // make shallow copy
    if (this.state.controlVectors.__isReadOnlyProxy) {
      this.state.controlVectors = [...this.state.controlVectors];
    }

    this.state.numericEntries = true;

    // Step 1: create the through points from the points
    // explicitly specified in the through child

    let points = this.state.throughChild.state.points;
    let nPoints = this.state.throughChild.state.nPoints;

    this.state.nPoints = this.state.throughPoints.length;

    // Step 2: if controls were explicitly specified via children
    // set the controlVectors as prescribed
    // and mark the corresponding points as being currently controlled
    if (this.state.controlsChild) {

      let controls = this.state.controlsChild.state.controls;
      let nControls = Math.min(controls.length, this.state.nPoints);

      // Note: don't reset controlVectors to zero length even with control children
      // as control children could be combined with essential controls
      // if additional controls beyond prescribed were created

      for (let i = 0; i < nControls; i++) {

        // points with explicitly set controls are always marked as being controlled
        this.state.pointCurrentlyControlled[i] = true;

        let ct = controls[i];
        let controlInd = 2 * i - 1;
        if (i === 0) {
          controlInd = 0;
        }

        // simplest case is when controls were specified as vectors
        // set controlVector component directly from child
        // create a symmetric control vector if only on vector
        // specified for an interior point
        if (ct.controlType === "vector") {
          let symmetric = ct.vectors.length === 1;
          this.state.symmetriccontrols[i] = symmetric;

          let cvector = ["tuple"];
          let vectorValues = [];
          if (ct.vectors[0].tree[0] !== "tuple" || ct.vectors[0].tree.length !== 3) {
            cvector = ["tuple", NaN, NaN]
            vectorValues = [NaN, NaN]
            this.numericEntries = false;
          } else {
            for (let j = 0; j < 2; j++) {
              let val = ct.vectors[0].get_component(j).evaluate_to_constant();
              if (Number.isFinite(val)) {
                cvector.push(val);
                vectorValues.push(val);
              } else {
                cvector.push(NaN);
                vectorValues.push(NaN);
                this.state.numericEntries = false;
              }
            }
          }
          this.state.controlVectors[controlInd] = me.fromAst(cvector);

          // check for second vector everywhere except first through point
          if (i > 0) {
            cvector = ["tuple"];
            if (symmetric) {
              for (let j = 0; j < 2; j++) {
                cvector.push(-vectorValues[j]);
              }
            } else {
              if (ct.vectors[1].tree[0] !== "tuple" || ct.vectors[1].tree.length !== 3) {
                cvector = ["tuple", NaN, NaN]
                this.numericEntries = false;
              } else {
                for (let j = 0; j < 2; j++) {
                  let val = ct.vectors[1].get_component(j).evaluate_to_constant();
                  if (Number.isFinite(val)) {
                    cvector.push(val);
                  } else {
                    cvector.push(NaN);
                    this.numericEntries = false;
                  }
                }
              }
            }
            this.state.controlVectors[controlInd + 1] = me.fromAst(cvector);
          }

        } else {
          // control type is point

          // need more complicated logic for the case when controls
          // are specified via a point since we really care about the vector
          // Logic is needed to get reasonable behavior for the different
          // ways that the through points and the controls points
          // can be changed
          // (such as top-down changes initiated from renderer points
          // or bottom-up changes initiated from reference source points
          // or top-down followed by bottom-up in cases where changes are
          // initiated from render points but then altered by constraints)

          // When a through point is moved but a control point is not touched,
          // we want the control vector (the difference) to be preserved,
          // which means the control point may not match the value
          // passed in from the control point child.
          // To accomplish this, 
          // A. we don't update the throughForControlChild
          // unless the control point location is explicitly changed.
          // In this way, bottom-up changes from through points
          // (which won't alter sources of control points) maintain the vectors
          // B. when through points are explicitly changed top-down
          // the corresponding controlVector values are preserved

          let symmetric = ct.points.length === 1;
          this.state.symmetriccontrols[i] = symmetric;

          let pointValues = [];
          if (ct.points[0].tree[0] !== "tuple" || ct.points[0].tree.length !== 3) {
            pointValues = [NaN, NaN]
            this.numericEntries = false;
          } else {
            for (let j = 0; j < 2; j++) {
              let val = ct.points[0].get_component(j).evaluate_to_constant();
              if (Number.isFinite(val)) {
                pointValues.push(val);
              } else {
                pointValues.push(NaN);
                this.numericEntries = false;
              }
            }
          }

          let pointChanged = false;
          if (this.state.lastControlChildValue[controlInd] === undefined) {
            pointChanged = true;
          } else {
            for (let j = 0; j < 2; j++) {
              if (pointValues[j] !== this.state.lastControlChildValue[controlInd].tree[j + 1]) {
                pointChanged = true;
                break;
              }
            }
          }

          if (pointChanged) {
            // the control point was explicitly changed
            // reset all variables related to preserving the control vector
            this.state.lastControlChildValue[controlInd] = me.fromAst(["tuple", ...pointValues])
            this.state.throughForControlChild[controlInd] = this.state.throughPoints[i].copy();
          }

          // calculate control vector as difference between value of control point
          // and the value of the through point, except that we substitute
          // a value for the through point that will lead to the control vector
          // being maintained as long as the point wasn't changed
          let cvector = ["tuple"];
          for (let j = 0; j < 2; j++) {
            let val = pointValues[j];
            if (Number.isFinite(val)) {
              cvector.push(val - this.state.throughForControlChild[controlInd].tree[j + 1]);
            } else {
              cvector.push(NaN);
              this.numericEntries = false;
            }
          }
          this.state.controlVectors[controlInd] = me.fromAst(cvector);

          // check for second control point everywhere except first through point
          if (i > 0) {
            if (symmetric) {
              // if control vector is symmetric, just make the second vector
              // be a reflection of the first
              let cvector = ["tuple"];
              for (let j = 0; j < 2; j++) {
                cvector.push(-this.state.controlVectors[controlInd].tree[j + 1]);
              }
              this.state.controlVectors[controlInd + 1] = me.fromAst(cvector);
            } else {

              // for non-symmetric case, redo above calculation for the second point
              let pointValues = [];
              if (ct.points[1].tree[0] !== "tuple" || ct.points[1].tree.length !== 3) {
                pointValues = [NaN, NaN]
                this.numericEntries = false;
              } else {
                for (let j = 0; j < 2; j++) {
                  let val = ct.points[1].get_component(j).evaluate_to_constant();
                  if (Number.isFinite(val)) {
                    pointValues.push(val);
                  } else {
                    pointValues.push(NaN);
                    this.numericEntries = false;
                  }
                }
              }

              let pointChanged = false;
              if (this.state.lastControlChildValue[controlInd + 1] === undefined) {
                pointChanged = true;
              } else {
                for (let j = 0; j < 2; j++) {
                  if (pointValues[j] !== this.state.lastControlChildValue[controlInd + 1].tree[j + 1]) {
                    pointChanged = true;
                    break;
                  }
                }
              }
              if (pointChanged) {
                this.state.lastControlChildValue[controlInd + 1] = me.fromAst(["tuple", ...pointValues])
                this.state.throughForControlChild[controlInd + 1] = this.state.throughPoints[i].copy();
              }

              let cvector = ["tuple"];
              for (let j = 0; j < 2; j++) {
                let val = pointValues[j];
                if (Number.isFinite(val)) {
                  cvector.push(val - this.state.throughForControlChild[controlInd + 1].tree[j + 1]);
                } else {
                  cvector.push(NaN);
                  this.numericEntries = false;
                }
              }
              this.state.controlVectors[controlInd + 1] = me.fromAst(cvector);
            }
          }
        }
      }
    }

    // Step 3: Look for any control vectors that aren't being explicitly
    // controlled.  Set those control vectors to be whatever they would
    // be if we had a spline with parameters given by state variables
    // splineForm and splineTension

    // Algorithm based on jsxgraph
    // The implementation (especially the centripetal parametrization) is from
    // http://stackoverflow.com/questions/9489736/catmull-rom-curve-with-no-cusps-and-no-self-intersections .
    // However, made one small change to make the control vectors symmetric
    // 


    let tau = this.state.splineTension;
    if (!(tau >= 0 && tau <= 1)) {
      tau = 0.8;
    }
    let eps = this.numerics.eps;

    let dist = function (p1, p2) {
      let dx = p1[0] - p2[0];
      let dy = p1[1] - p2[1];
      return Math.sqrt(dx * dx + dy * dy);
    }

    for (let i = 0; i < this.state.nPoints; i++) {
      if (this.state.pointCurrentlyControlled[i] === true) {
        continue;
      }

      this._state.controlVectors.essential = true;

      if (this.state.numericEntries !== true) {
        this.state.controlVectors[2 * i] = me.fromAst(["tuple", NaN, NaN]);
        if (i > 0) {
          this.state.controlVectors[2 * i - 1] = me.fromAst(["tuple", NaN, NaN]);
        }
        continue;
      }

      let p1, p2, p3;

      p2 = this.state.throughPoints[i].tree.slice(1);

      if (i === 0) {
        if (this.state.nPoints === 1) {
          this.state.controlVectors[0] = me.fromAst(["tuple", NaN, NaN]);
          continue;
        }
        p3 = this.state.throughPoints[i + 1].tree.slice(1);
        p1 = [
          2 * p2[0] - p3[0],
          2 * p2[1] - p3[1]
        ]
      } else {
        p1 = this.state.throughPoints[i - 1].tree.slice(1);
        if (i < this.state.nPoints - 1) {
          p3 = this.state.throughPoints[i + 1].tree.slice(1);
        } else {
          p3 = [
            2 * p2[0] - p1[0],
            2 * p2[1] - p1[1]
          ]
        }
      }

      let cv = [];

      if (this.state.splineForm === 'centripetal') {
        let dt0 = dist(p1, p2);
        let dt1 = dist(p2, p3);

        dt0 = Math.sqrt(dt0);
        dt1 = Math.sqrt(dt1);

        if (dt1 < eps) { dt1 = 1.0; }
        if (dt0 < eps) { dt0 = dt1; }

        for (let dim = 0; dim < 2; dim++) {

          let t1 = (p2[dim] - p1[dim]) / dt0 -
            (p3[dim] - p1[dim]) / (dt1 + dt0) +
            (p3[dim] - p2[dim]) / dt1;

          // original algorithm would multiply by different dt's on each side
          // of the point
          // Took geometric mean so that control vectors are symmetric
          t1 *= tau * Math.sqrt(dt0 * dt1);

          // Bezier control vector component lengths
          // are one third the respective derivative of the cubic
          if (i === 0) {
            cv.push(t1 / 3);
          } else {
            cv.push(-t1 / 3);
          }
        }
      } else {
        // uniform spline case
        for (let dim = 0; dim < 2; dim++) {
          // Bezier control vector component lengths
          // are one third the respective derivative of the cubic
          if (i === 0) {
            cv.push(tau * (p3[dim] - p1[dim]) / 3);
          } else {
            cv.push(-tau * (p3[dim] - p1[dim]) / 3);
          }
        }
      }

      this.state.symmetriccontrols[i] = true;

      if (i === 0) {
        this.state.controlVectors[0] = me.fromAst(["tuple", ...cv]);
      } else {
        this.state.controlVectors[2 * i - 1] = me.fromAst(["tuple", ...cv]);
        this.state.controlVectors[2 * i] = me.fromAst(["tuple", -cv[0], -cv[1]]);
      }

    }

    // if have extra control vectors (which would happen if just deleted some points)
    // then remove the extras
    if (this.state.controlVectors.length > 2 * this.state.throughPoints.length - 1) {
      this.state.controlVectors = this.state.controlVectors.slice(0, 2 * this.state.throughPoints.length - 1);
    }

    // constrain/attract controlVectors to angles, if have such a child
    let constrainInds = this.childLogic.returnMatches("atMostOneConstrainToAngles");
    let constraintChild;
    if (constrainInds.length === 1) {
      constraintChild = this.activeChildren[constrainInds[0]];
    }
    else {
      let attractInds = this.childLogic.returnMatches("atMostOneAttractToAngles");
      if (attractInds.length === 1) {
        constraintChild = this.activeChildren[attractInds[0]];
      }
    }

    if (constraintChild !== undefined) {
      for (let ind = 0; ind < this.state.throughPoints.length; ind++) {
        if (ind == 0) {
          this.applyAngleConstraint(0, constraintChild)
        } else {

          this.applyAngleConstraint(2 * ind - 1, constraintChild)

          if (ind < this.state.throughPoints.length - 1) {
            if (this.state.symmetriccontrols[ind] === false) {
              this.applyAngleConstraint(2 * ind, constraintChild)
            } else {
              // make symmetric reflection
              let cvec = ["tuple"];
              for (let j = 0; j < 2; j++) {
                cvec.push(-this.state.controlVectors[2 * ind - 1].tree[j + 1]);
              }
              this.state.controlVectors[2 * ind] = me.fromAst(cvec);
            }
          }
        }
      }
    }

    // create controlPoints as controlVectors + corresponding throughPoints
    this.state.controlPoints = [];
    for (let i = 1; i < this.state.throughPoints.length; i++) {
      let cp1 = ["tuple"];
      let cp2 = ["tuple"];
      for (let j = 1; j < 3; j++) {
        cp1.push(this.state.throughPoints[i - 1].tree[j] + this.state.controlVectors[2 * i - 2].tree[j]);
        cp2.push(this.state.throughPoints[i].tree[j] + this.state.controlVectors[2 * i - 1].tree[j]);
      }
      this.state.controlPoints.push(me.fromAst(cp1));
      this.state.controlPoints.push(me.fromAst(cp2));
    }

    let tpNumeric = this.state.throughPoints.map(x => x.tree.slice(1));
    let cvNumeric = this.state.controlVectors.map(x => x.tree.slice(1));


    // Compute coefficients for a cubic polynomial
    //   p(s) = c0 + c1*s + c2*s^2 + c3*s^3
    // such that
    //   p(0) = x1, p(1) = x2
    // and
    //   p'(0) = t1, p'(1) = t2
    let initCubicPoly = function (x1, x2, t1, t2) {
      return [
        x1,
        t1,
        -3 * x1 + 3 * x2 - 2 * t1 - t2,
        2 * x1 - 2 * x2 + t1 + t2
      ];
    }

    this.state.splinecoeffs = [];

    for (let i = 1; i < tpNumeric.length; i++) {

      let p1 = tpNumeric[i - 1];
      let p2 = tpNumeric[i];
      let cv1 = cvNumeric[2 * i - 2];
      let cv2 = cvNumeric[2 * i - 1];

      let c = [];
      for (let dim = 0; dim < 2; dim++) {
        c.push(initCubicPoly(
          p1[dim],
          p2[dim],
          3 * cv1[dim],
          -3 * cv2[dim]
        ));
      }
      this.state.splinecoeffs.push(c);
    }


    // extrapolate beyond the first or last point
    // if extrapolateBackward or extrapolateForward are true
    // For each curve component, we extrapolate with either
    // - a linear function that matches the value and derivative
    //   of the outer point, or
    // - a quadratic function that, in addition, matches the value
    //   of the previous point.
    // We choose the quadratic only if its critical point
    // is not located in the portion we extrapolate, i.e.,
    // we don't want the extrapolated curve to turn around in either x or y direction

    this.state.extracoeffs = [];

    if (this.state.extrapolateBackward) {
      let p1 = tpNumeric[0];
      let p2 = tpNumeric[1];
      let cv1 = cvNumeric[0];
      let c = [];
      c[0] = [
        p1[0],
        3 * cv1[0] * 4,
        0
      ];

      let c2 = (p2[0] - p1[0] - 3 * cv1[0]) * 16;
      if (c2 !== 0) {
        if (cv1[0] / c2 < 0) {
          c[0][2] = c2;
        }
      }

      c[1] = [
        p1[1],
        3 * cv1[1] * 4,
        0
      ];

      c2 = (p2[1] - p1[1] - 3 * cv1[1]) * 16;
      if (c2 !== 0) {
        if (cv1[1] / c2 < 0) {
          c[1][2] = c2;
        }
      }

      this.state.extracoeffs[0] = c;

    }

    if (this.state.extrapolateForward) {
      let n = tpNumeric.length - 1;
      let p1 = tpNumeric[n - 1];
      let p2 = tpNumeric[n];
      let cv2 = cvNumeric[2 * n - 1];

      let c = [];
      c[0] = [
        p2[0],
        -3 * cv2[0] * 4,
        0
      ];

      let c2 = (p1[0] - p2[0] - 3 * cv2[0]) * 16
      if (c2 !== 0) {
        if (cv2[0] / c2 < 0) {
          c[0][2] = c2;
        }
      }

      c[1] = [
        p2[1],
        -3 * cv2[1] * 4,
        0
      ];

      c2 = (p1[1] - p2[1] - 3 * cv2[1]) * 16;
      if (c2 !== 0) {
        if (cv2[1] / c2 < 0) {
          c[1][2] = c2;
        }
      }

      this.state.extracoeffs[1] = c;
    }
  }

  applyAngleConstraint(ind, constraintChild) {
    let vec = this.state.controlVectors[ind].tree.slice(1);
    let result = constraintChild.applyTheConstraint({
      x1: vec[0],
      x2: vec[1],
    })
    if (result.constrained) {
      this.state.controlVectors[ind] =
        me.fromAst(["tuple", result.variables.x1, result.variables.x2]);
    }
  }


  nearestPoint({ x1, x2, x3 }) {

    if (x1 === undefined || x2 === undefined) {
      return {};
    }

    let minfunc = function (t) {
      let result = this.parameterization(t);
      if (!Array.isArray(result)) {
        return NaN;
      }
      let dx1 = x1 - result[0];
      let dx2 = x2 - result[1];
      return dx1 * dx1 + dx2 * dx2;
    }.bind(this);

    let eps = this.numerics.eps;

    let minT = this.state.parameterizationMin;
    let maxT = this.state.parameterizationMax;
    if (this.state.parameterizationExclude.includes(minT)) {
      minT += eps;
    }
    if (this.state.parameterizationExclude.includes(maxT)) {
      maxT -= eps;
    }

    let intervals = [[minT, maxT]];

    let intInd = 0;
    let intMin = intervals[intInd][0];
    let intMax = intervals[intInd][1];
    for (let t of this.state.parameterizationExclude) {
      if (t <= intMin) {
        continue;
      }
      while (t > intMax) {
        if (intMax >= maxT) {
          break;
        } else {
          intInd++;
          intMin = intervals[intInd][0]
          intMax = intervals[intInd][1];
        }
      }
      if (t >= maxT) {
        break;
      }
      intervals.splice(intInd, 1, [intMin, t - eps], [t + eps, intMax]);
      intInd++;
      intMin = intervals[intInd][0]
      intMax = intervals[intInd][1];

    }

    intInd = 0;
    intMin = intervals[intInd][0];
    intMax = intervals[intInd][1];
    for (let t of this.state.parameterizationKeyPoints) {
      if (t <= intMin) {
        continue;
      }
      while (t > intMax) {
        if (intMax >= maxT) {
          break;
        } else {
          intInd++;
          intMin = intervals[intInd][0]
          intMax = intervals[intInd][1];
        }
      }
      if (t >= maxT) {
        break;
      }
      intervals.splice(intInd, 1, [intMin, t], [t, intMax]);
      intInd++;
      intMin = intervals[intInd][0]
      intMax = intervals[intInd][1];
    }

    let Nsteps = this.state.parameterizationNsteps;

    let maxDelta = (maxT - minT) / (Nsteps);

    let fAtMin = NaN;
    let tAtMin = NaN;
    let tIntervalMin = NaN;
    let tIntervalMax = NaN;

    intMax = undefined;
    for (let intInd = 0; intInd < intervals.length; intInd++) {
      intMin = intervals[intInd][0];
      let consecutiveIntervals = false;
      if (intMin === intMax) {
        consecutiveIntervals = true;
      }
      intMax = intervals[intInd][1];

      let intSteps = Math.ceil((intMax - intMin) / maxDelta);
      let intDelta = (intMax - intMin) / intSteps;

      // if not consecutive intervals, evaluate at intMin
      if (!consecutiveIntervals) {
        let fnew = minfunc(intMin);
        if (fnew < fAtMin || Number.isNaN(fAtMin)) {
          tAtMin = intMin;
          fAtMin = fnew;
          tIntervalMin = intMin;
          tIntervalMax = intMin + intDelta;
        }
      }


      for (let step = 1; step <= intSteps; step++) {
        let tnew = intMin + step * intDelta;
        let fnew = minfunc(tnew);
        if (fnew < fAtMin || Number.isNaN(fAtMin)) {
          tAtMin = tnew;
          fAtMin = fnew;
          tIntervalMin = tnew - intDelta;
          if ((step === intSteps) &&
            (intInd === intervals.length - 1 || intervals[intInd + 1][0] !== intMax)) {
            tIntervalMax = tnew;
          } else {
            tIntervalMax = tnew + intDelta;
          }
        }

      }

    }

    if (this.state.parameterizationPeriodic && minT === this.state.parameterizationMin &&
      maxT == this.state.parameterizationMax) {
      // if have periodic where endpoints haven't been excluded
      // and tAtMin is at endpoint, make interval span past endpoint
      if (Math.abs(tAtMin - minT) < eps) {
        // append interval for delta for last interval before minT
        let intInd = intervals.length - 1;
        let intSteps = Math.ceil((intervals[intInd][1] - intervals[intInd][0]) / maxDelta);
        let intDelta = (intMax - intMin) / intSteps;
        tIntervalMin = minT - intDelta;
      } else if (Math.abs(tAtMin - maxT) < eps) {
        // append interval for delta for first interval after minT
        let intSteps = Math.ceil((intervals[0][1] - intervals[0][0]) / maxDelta);
        let intDelta = (intMax - intMin) / intSteps;
        tIntervalMax = maxT + intDelta;

      }
    }

    let result = this.numerics.fminbr(minfunc, [tIntervalMin, tIntervalMax]);
    tAtMin = result.x;

    let [x1AtMin, x2AtMin] = this.parameterization(tAtMin);
    result = {
      x1: x1AtMin,
      x2: x2AtMin
    }

    if (x3 !== undefined) {
      result.x3 = 0;
    }

    return result;

  }

  calculateCurveRenderParams() {

    let params = {
      parmin: this.stateValues.parameterizationMin,
      parmax: this.stateValues.parameterizationMax,
      curveType: this.stateValues.curveType,
      flipFunction: this.stateValues.flipFunction,
      visible: !this.stateValues.hidden,

    };
    if (this.stateValues.curveType === "function") {
      if (this.stateValues.flipFunction === true) {
        params.fx = this.stateValues.f;
      } else {
        params.fy = this.stateValues.f;
      }
    } else if (this.stateValues.curveType === "parameterization") {
      params.fx = this.stateValues.fs[0];
      params.fy = this.stateValues.fs[1];
    } else if (this.stateValues.curveType === "spline") {
      params.fx = t => this.parameterization(t, 0);
      params.fy = t => this.parameterization(t, 1);
      params.throughPoints = this.stateValues.throughPoints.map(x => x.tree.slice(1));
      params.controlPoints = this.stateValues.controlPoints.map(x => x.tree.slice(1));
      params.pointCurrentlyControlled = [...this.stateValues.pointCurrentlyControlled];
    }
    return params;
  }

  moveControlVector({ controlVector, controlVectorInds }) {
    this.coreFunctions.requestUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "controlVectors",
        value: { [controlVectorInds]: me.fromAst(["vector", ...controlVector]) },
        sourceInformation: { controlVectorMoved: controlVectorInds }
      }]
    })
  }

  moveThroughPoint({ throughPoint, throughPointInd }) {
    this.coreFunctions.requestUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "throughPoints",
        value: { [throughPointInd]: me.fromAst(["tuple", ...throughPoint]) },
        sourceInformation: { throughPointMoved: throughPointInd }
      }]
    });
  }

  changeVectorControlDirection({ direction, throughPointInd }) {
    this.coreFunctions.requestUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "vectorControlDirection",
        value: { [throughPointInd]: direction },
      }]
    });
  }

  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    const actions = {
      moveControlVector: this.moveControlVector,
      moveThroughPoint: this.moveThroughPoint,
      changeVectorControlDirection: this.changeVectorControlDirection,
    }

    let params = this.calculateCurveRenderParams();
    params.key = this.componentName;
    params.label = this.stateValues.label;
    params.draggable = this.stateValues.draggable;
    params.layer = this.stateValues.layer;
    params.actions = actions;
    params.color = this.stateValues.selectedStyle.lineColor;
    params.width = this.stateValues.selectedStyle.lineWidth;
    params.style = this.stateValues.selectedStyle.lineStyle;

    this.renderer = new this.availableRenderers.curve2d(params);
  }

  updateRenderer({ sourceOfUpdate } = {}) {
    let params = this.calculateCurveRenderParams();
    params.changeInitiatedWith = {};

    if (sourceOfUpdate && sourceOfUpdate.instructionsByComponent) {
      let instructions = sourceOfUpdate.instructionsByComponent[this.componentName];
      if (instructions !== undefined) {
        params.changeInitiatedWith.throughPointInd = instructions.throughPointMoved;
        params.changeInitiatedWith.controlVectorInd = instructions.controlVectorMoved;
      }
    }
    this.renderer.updateCurve(params);
  }

  allowDownstreamUpdates(status) {
    if (!((status.initialChange === true && this.state.draggable === true) ||
      (status.initialChange !== true && this.state.modifyIndirectly === true))) {
      return false;
    }

    // don't update if don't currently have numeric entries
    if (!this.state.numericEntries) {
      return false;
    }

    return true;

  }

  get variablesUpdatableDownstream() {
    return ["throughPoints", "controlVectors", "controlPoints", "pointCurrentlyControlled"];
  }

  calculateDownstreamChanges({ stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate }) {

    let newStateVariables = {};

    // console.log(`begin downstream updates for ${this.componentName}`);
    // console.log(stateVariablesToUpdate);

    // these will be overwritten if find values from stateVariableToUpdate
    let newThroughPoints = [...this.state.throughPoints];
    let newControlVectors = [...this.state.controlVectors];
    let newpointCurrentlyControlled = [...this.state.pointCurrentlyControlled];

    let controlsChanged = new Set([]);
    let controlsChangedViaThrough = new Set([]);

    for (let varName in stateVariablesToUpdate) {
      if (varName === "throughPoints") {
        if (newStateVariables[varName] === undefined) {
          newStateVariables[varName] = {
            isArray: true,
            changes: { arrayComponents: {} }
          }
        }
        for (let ind in stateVariablesToUpdate[varName].changes.arrayComponents) {
          let indNum = Number(ind)
          if (indNum > 0) {
            controlsChangedViaThrough.add(2 * indNum - 1);
          }
          if (indNum < newThroughPoints.length - 1) {
            controlsChangedViaThrough.add(2 * indNum);
          }
          newThroughPoints[ind] = newStateVariables[varName].changes.arrayComponents[ind] =
            stateVariablesToUpdate[varName].changes.arrayComponents[ind];
        }
      } else if (varName === "controlVectors") {
        if (newStateVariables[varName] === undefined) {
          newStateVariables[varName] = {
            isArray: true,
            changes: { arrayComponents: {} }
          }
        }
        for (let ind in stateVariablesToUpdate[varName].changes.arrayComponents) {
          let indNum = Number(ind)
          controlsChanged.add(indNum);

          newControlVectors[ind] = newStateVariables[varName].changes.arrayComponents[ind] =
            stateVariablesToUpdate[varName].changes.arrayComponents[ind];
        }
      } else if (varName === "pointCurrentlyControlled") {
        if (newStateVariables[varName] === undefined) {
          newStateVariables[varName] = {
            isArray: true,
            changes: { arrayComponents: {} }
          }
        }
        for (let ind in stateVariablesToUpdate[varName].changes.arrayComponents) {
          newpointCurrentlyControlled[ind] = newStateVariables[varName].changes.arrayComponents[ind] =
            stateVariablesToUpdate[varName].changes.arrayComponents[ind];
        }
      }
    }

    // check if controlPoints (rather than controlVectors) were changed
    // and fill in any unused control vector slots
    if (stateVariablesToUpdate.controlPoints !== undefined) {
      if (newStateVariables.controlVectors === undefined) {
        newStateVariables.controlVectors = {
          isArray: true,
          changes: { arrayComponents: {} }
        }
      }
      for (let ind in stateVariablesToUpdate.controlPoints.changes.arrayComponents) {
        let indNum = Number(ind)
        if (!controlsChanged.has(indNum)) {
          controlsChanged.add(indNum);

          // check if through point changed
          let tp;
          if (controlsChangedViaThrough.has(indNum)) {
            tp = newThroughPoints[Math.ceil(ind / 2)].tree;
          } else {
            tp = this.state.throughPoints[Math.ceil(ind / 2)].tree;
          }

          let cp = stateVariablesToUpdate.controlPoints.changes.arrayComponents[ind].tree;

          let newCVast = ["tuple"];
          for (let j = 0; j < 2; j++) {
            newCVast.push(cp[j + 1] - tp[j + 1]);
          }

          newControlVectors[ind] = newStateVariables.controlVectors.changes.arrayComponents[ind] =
            me.fromAst(newCVast);
        }
      }
    }

    // after have determined all new values for throughPoints
    // check if have to specify the symmetric control point
    for (let i = 1; i < newThroughPoints.length - 1; i++) {
      if (this.state.symmetriccontrols[i] !== false) {
        if (controlsChanged.has(2 * i - 1)) {
          controlsChanged.add(2 * i);
          // make control vector 2*i be symmetric reflection of 2*i-1
          let c = ["tuple"];
          for (let j = 0; j < 2; j++) {
            c.push(-newControlVectors[2 * i - 1].tree[j + 1]);
          }
          newStateVariables.controlVectors.changes.arrayComponents[2 * i] = newControlVectors[2 * i] = me.fromAst(c);
        } else if (controlsChanged.has(2 * i)) {
          controlsChanged.add(2 * i - 1);
          // make control point 2*i-1 be symmetric reflection of 2*i
          let c = ["tuple"];
          for (let j = 0; j < 2; j++) {
            c.push(-newControlVectors[2 * i].tree[j + 1]);
          }
          newStateVariables.controlVectors.changes.arrayComponents[2 * i - 1] = newControlVectors[2 * i - 1] = me.fromAst(c);
        }
      }
    }

    // delete any control changed directly from controlsChangedViaThrough
    for (let ind of controlsChanged) {
      controlsChangedViaThrough.delete(ind);
    }
    // add any controlsChangedViaThrough to controlsChanged
    for (let ind of controlsChangedViaThrough) {
      controlsChanged.add(ind);
    }

    // check if based on through child
    if (this.state.throughChild !== undefined && "throughPoints" in newStateVariables) {

      let throughPoints = this.state.throughChild.state.points;

      for (let ind in newStateVariables.throughPoints.changes.arrayComponents) {
        let pointName = throughPoints[ind].componentName;
        dependenciesToUpdate[pointName] = { coords: { changes: newThroughPoints[ind] } };
      }
    }

    if (this.state.controlsChild !== undefined && controlsChanged.size > 0) {
      let controlsName = this.state.controlsChild.componentName;

      let controlsInChild = this.state.controlsChild.state.controls;
      let nControlsInChild = controlsInChild.length;

      let controlInstructions = {}
      for (let ind of controlsChanged) {
        let controlNumber = Math.ceil(ind / 2);
        if (controlNumber >= nControlsInChild) {
          continue;
        }
        // skip if already added this controlNumber
        // (so don't repeat work when both inds of a controlNumber have changed)
        if (controlNumber in controlInstructions) {
          continue;
        }

        let controlInds = [];
        if (controlNumber === 0) {
          controlInds.push(0);
        } else if (controlNumber === nControlsInChild - 1) {
          controlInds.push(2 * nControlsInChild - 3);
        } else {
          controlInds.push(2 * controlNumber - 1)
          if (this.state.symmetriccontrols[controlNumber] === false) {
            controlInds.push(2 * controlNumber)
          }
        }

        if (controlsInChild[controlNumber].controlType === "point") {
          controlInstructions[controlNumber] =
            controlInds.map(function (ind) {
              if (controlsChangedViaThrough.has(ind) ||
                ind in newStateVariables.controlVectors.changes.arrayComponents) {
                // if controls changed via through then change all control inds
                // else only change those that directly
                let newPoint = ["tuple"];
                for (let j = 0; j < 2; j++) {
                  newPoint.push(newControlVectors[ind].tree[j + 1]
                    + newThroughPoints[controlNumber].tree[j + 1]);
                }
                return me.fromAst(newPoint);
              }
            });

        } else {
          controlInstructions[controlNumber] =
            controlInds.map(function (ind) {
              if (controlsChangedViaThrough.has(ind) ||
                ind in newStateVariables.controlVectors.changes.arrayComponents) {
                // if controls changed via through then change all control inds
                // else only change those that directly
                return newControlVectors[ind];
              }
            })
        }
      }
      dependenciesToUpdate[controlsName] = {
        controls: {
          isArray: true,
          changes: { arrayComponents: controlInstructions }
        }
      }
    }

    let shadowedResult = this.updateShadowSources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // add stateVariable to stateVariableChangesToSave if is essential
    // and no shadow sources were updated
    for (let varname in newStateVariables) {
      if (this._state[varname].essential === true &&
        !shadowedStateVariables.has(varname)
        // && !isReplacement
      ) {
        stateVariableChangesToSave[varname] = newStateVariables[varname];
      }
    }

    // console.log("stateVariableChangesToSave")
    // console.log(stateVariableChangesToSave)

    // console.log("dependenciesToUpdate");
    // console.log(dependenciesToUpdate);

    return true;

  }

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


function calculateControlVectorFromSpline({ tau, eps, point1, point2, point3, splineForm }) {

  let dist = function (p1, p2) {
    let dx = p1[0] - p2[0];
    let dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  let p1, p2, p3;

  if (point2) {
    p2 = point2.tree.slice(1);
  } else {
    return {
      coordsNumeric: me.fromAst(["vector", NaN, NaN]),
      numericEntries: false
    }
  }

  if (point3) {
    p3 = point3.tree.slice(1);

    if (point1) {
      p1 = point1.tree.slice(1);
    } else {
      p1 = [
        2 * p2[0] - p3[0],
        2 * p2[1] - p3[1]
      ];
    }
  } else {
    if (point1) {
      p1 = point1.tree.slice(1);
      p3 = [
        2 * p2[0] - p1[0],
        2 * p2[1] - p1[1]
      ];
    } else {
      return {
        coordsNumeric: me.fromAst(["vector", NaN, NaN]),
        numericEntries: false
      }
    }
  }

  let cv = [];

  if (splineForm === 'centripetal') {
    let dt0 = dist(p1, p2);
    let dt1 = dist(p2, p3);

    dt0 = Math.sqrt(dt0);
    dt1 = Math.sqrt(dt1);

    if (dt1 < eps) { dt1 = 1.0; }
    if (dt0 < eps) { dt0 = dt1; }

    for (let dim = 0; dim < 2; dim++) {

      let t1 = (p2[dim] - p1[dim]) / dt0 -
        (p3[dim] - p1[dim]) / (dt1 + dt0) +
        (p3[dim] - p2[dim]) / dt1;

      // original algorithm would multiply by different dt's on each side
      // of the point
      // Took geometric mean so that control vectors are symmetric
      t1 *= tau * Math.sqrt(dt0 * dt1);

      // Bezier control vector component lengths
      // are one third the respective derivative of the cubic
      // if (i === 0) {
      //   cv.push(t1 / 3);
      // } else {
      cv.push(-t1 / 3);
      // }
    }
  } else {
    // uniform spline case
    for (let dim = 0; dim < 2; dim++) {
      // Bezier control vector component lengths
      // are one third the respective derivative of the cubic
      // if (i === 0) {
      //   cv.push(tau * (p3[dim] - p1[dim]) / 3);
      // } else {
      cv.push(-tau * (p3[dim] - p1[dim]) / 3);
      // }
    }
  }
  let coordsNumeric = me.fromAst(["vector", ...cv]);
  let numericEntries = Number.isFinite(cv[0]) && Number.isFinite(cv[1])

  return { coordsNumeric, numericEntries };

}

function flipVector(vector) {
  if (!vector) {
    return
  }

  // note: assumes that components of vector are numeric
  let vectorTree = vector.tree;
  if (Array.isArray(vectorTree)) {
    return me.fromAst([vectorTree[0], ...vectorTree.slice(1).map(x => -x)])
  } else {
    return me.fromAst(-vectorTree)
  }
}

// Compute coefficients for a cubic polynomial
//   p(s) = c0 + c1*s + c2*s^2 + c3*s^3
// such that
//   p(0) = x1, p(1) = x2
// and
//   p'(0) = t1, p'(1) = t2
function initCubicPoly(x1, x2, t1, t2) {
  return [
    x1,
    t1,
    -3 * x1 + 3 * x2 - 2 * t1 - t2,
    2 * x1 - 2 * x2 + t1 + t2
  ];
}