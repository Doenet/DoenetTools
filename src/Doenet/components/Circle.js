import Curve from './Curve';
import me from 'math-expressions';

export default class Circle extends Curve {
  static componentType = "circle";
  static rendererType = "circle";

  actions = {
    moveCircle: this.moveCircle.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
  };

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() {
    return [
      "throughPoints", "nThroughPoints",
      "prescribedCenter", "prescribedRadius",
      "havePrescribedCenter", "havePrescribedRadius"
    ]
  };

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    let addCenter = function ({ activeChildrenMatched }) {
      // add <center> around point
      return {
        success: true,
        newChildren: [{
          componentType: "center",
          children: [{
            createdComponent: true,
            componentName: activeChildrenMatched[0].componentName
          }],
        }],
      }
    }

    let exactlyOnePoint = childLogic.newLeaf({
      name: "exactlyOnePoint",
      componentType: 'point',
      number: 1,
      isSugar: true,
      replacementFunction: addCenter,
    });

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1,
      isSugar: true,
      replacementFunction: addCenter,
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

    let exactlyOneCenter = childLogic.newLeaf({
      name: "exactlyOneCenter",
      componentType: 'center',
      number: 1
    });

    let exactlyOneRadius = childLogic.newLeaf({
      name: "exactlyOneRadius",
      componentType: 'radius',
      number: 1,
    });

    let centerXorSugar = childLogic.newOperator({
      name: "centerXorSugar",
      operator: 'xor',
      propositions: [exactlyOneCenter, exactlyOnePoint, exactlyOneString, noPoints],
    });

    childLogic.newOperator({
      name: "radiusCenterOrThrough",
      operator: 'or',
      propositions: [exactlyOneRadius, exactlyOneThrough, centerXorSugar],
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

    delete stateVariableDefinitions.nearestPoint;

    stateVariableDefinitions.throughPoints = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["throughPoint"],
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

        let freshByKey = freshnessInfo.throughPoints.freshByKey;

        // console.log('markStale for circle throughPoints')
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(JSON.parse(JSON.stringify(changes)))
        // console.log(arrayKeys);

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (changes.throughChild) {

          if (changes.throughChild.componentIdentitiesChanged) {

            // if throughChild changed
            // then the entire points array of line is also changed
            for (let key in freshByKey) {
              delete freshByKey[key];
            }
          } else {

            let valuesChanged = changes.throughChild.valuesChanged[0];

            if (arrayKey === undefined) {

              if (valuesChanged.points) {
                // if have the same points from throughChild
                // then just check if any of those points values
                // are no longer fresh
                let newFreshByKey = valuesChanged.points.freshnessInfo.freshByKey;
                for (let key in freshByKey) {
                  if (!newFreshByKey[key]) {
                    delete freshByKey[key];
                  }
                }
              }
            } else {
              if (valuesChanged["point" + (arrayKey + 1)]) {
                delete freshByKey[arrayKey];
              }
            }

          }

        }

        if (arrayKey === undefined) {
          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: { throughPoints: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { throughPoints: true } }
          }
        } else {
          // asked for just one component
          return { fresh: { throughPoints: freshByKey[arrayKey] === true } }
        }

      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {
        let freshByKey = freshnessInfo.throughPoints.freshByKey;

        // console.log('definition of circle throughPoints');
        // console.log(dependencyValues)
        // console.log(arrayKeys);
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(changes)

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (dependencyValues.throughChild.length === 1) {

          if (arrayKey === undefined) {
            let throughPoints = dependencyValues.throughChild[0].stateValues.points;

            if (changes.throughChild && (
              changes.throughChild.componentIdentitiesChanged ||
              changes.throughChild.valuesChanged[0].points.changed.changedEntireArray
            )) {
              // send array to indicate that should overwrite entire array
              for (let key in throughPoints) {
                freshByKey[key] = true;
              }

              return {
                newValues: { throughPoints }
              }
            }

            let newPointValues = {};
            for (let key in throughPoints) {
              if (!freshByKey[key]) {
                freshByKey[key] = true;
                newPointValues[key] = throughPoints[key]
              }
            }
            return { newValues: { throughPoints: newPointValues } };

          } else {
            // have an arrayKey defined

            if (!freshByKey[arrayKey]) {
              freshByKey[arrayKey] = true;
              let coords = dependencyValues.throughChild[0].stateValues["point" + (arrayKey + 1)];

              return {
                newValues: {
                  throughPoints: {
                    [arrayKey]: coords
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
          return { newValues: { throughPoints: [] } }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues,
        stateValues, initialChange, arrayKeys
      }) {

        // console.log(`inverseDefinition of throughPoints of circle`);
        // console.log(desiredStateVariableValues)
        // console.log(JSON.parse(JSON.stringify(stateValues)))
        // console.log(arrayKeys);
        // console.log(dependencyValues);


        // if not draggable, then disallow initial change 
        if (initialChange && !stateValues.draggable) {
          return { success: false };
        }


        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (dependencyValues.throughChild.length !== 1) {
          return { success: false }
        }


        if (arrayKey === undefined) {
          // working with entire array

          let instructions = [{
            setDependency: "throughChild",
            desiredValue: desiredStateVariableValues.throughPoints,
            childIndex: 0,
            variableIndex: 0
          }]

          return {
            success: true,
            instructions
          }
        } else {

          // just have one arrayKey
          // so child variable of throughChild is an array entry (rather than array)


          if (dependencyValues.throughChild[0].stateValues["point" + (arrayKey + 1)] === undefined) {
            return { success: false }
          } else {
            let instructions = [{
              setDependency: "throughChild",
              desiredValue: desiredStateVariableValues.throughPoints[arrayKey],
              childIndex: 0,
              variableIndex: 0,
            }]
            return {
              success: true,
              instructions
            }
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
        if (dependencyValues.throughChild.length === 1) {
          return {
            newValues: {
              nThroughPoints: dependencyValues.throughChild[0].stateValues.nPoints
            }
          }
        } else {
          return { newValues: { nThroughPoints: 0 } }
        }
      }
    }


    // radiusShadow will be null unless circle was created
    // from serialized state with radius value
    stateVariableDefinitions.radiusShadow = {
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          radiusShadow: { variablesToCheck: ["radius", "radiusShadow"] }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "radiusShadow",
            value: desiredStateVariableValues.radiusShadow
          }]
        };
      }
    }

    // centerShadow will be null unless circle was created
    // from serialized state with center value
    stateVariableDefinitions.centerShadow = {
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          centerShadow: { variablesToCheck: ["center", "centerShadow"] }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "centerShadow",
            value: desiredStateVariableValues.centerShadow
          }]
        };
      }
    }

    stateVariableDefinitions.prescribedCenter = {
      defaultValue: null,
      returnDependencies: () => ({
        centerChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneCenter",
          variableNames: ["coords"],
        },
        centerShadow: {
          dependencyType: "stateVariable",
          variableName: "centerShadow"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.centerChild.length === 1) {
          return {
            newValues: {
              prescribedCenter: dependencyValues.centerChild[0].stateValues.coords
            }
          }
        } else {
          return {
            newValues: {
              prescribedCenter: dependencyValues.centerShadow
            }
          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {
        // console.log(`inverse definition of prescribed center of circle`)
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)

        if (dependencyValues.centerChild.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "centerChild",
              desiredValue: desiredStateVariableValues.prescribedCenter,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setDependency: "centerShadow",
              desiredValue: desiredStateVariableValues.prescribedCenter,
            }]
          }
        }
      }
    }

    stateVariableDefinitions.prescribedRadius = {
      defaultValue: null,
      returnDependencies: () => ({
        radiusChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneRadius",
          variableNames: ["value"],
        },
        radiusShadow: {
          dependencyType: "stateVariable",
          variableName: "radiusShadow"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.radiusChild.length === 1) {
          return {
            newValues: {
              prescribedRadius: dependencyValues.radiusChild[0].stateValues.value
            }
          }
        } else {
          return {
            newValues: {
              prescribedRadius: dependencyValues.radiusShadow
            }
          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.radiusChild.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "radiusChild",
              desiredValue: desiredStateVariableValues.prescribedRadius,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setDependency: "radiusShadow",
              desiredValue: desiredStateVariableValues.prescribedRadius,
            }]
          }
        }
      }
    }

    stateVariableDefinitions.havePrescribedCenter = {
      returnDependencies: () => ({
        centerChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneCenter"
        },
        centerShadow: {
          dependencyType: "stateVariable",
          variableName: "centerShadow"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          havePrescribedCenter: dependencyValues.centerChild.length === 1
            || dependencyValues.centerShadow !== null
        },
        checkForActualChange: { havePrescribedCenter: true }
      })
    }

    stateVariableDefinitions.havePrescribedRadius = {
      returnDependencies: () => ({
        radiusChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneRadius"
        },
        radiusShadow: {
          dependencyType: "stateVariable",
          variableName: "radiusShadow"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          havePrescribedRadius: dependencyValues.radiusChild.length === 1
            || dependencyValues.radiusShadow !== null
        },
        checkForActualChange: { havePrescribedRadius: true }
      })
    }

    stateVariableDefinitions.numericalPrescribedRadius = {
      returnDependencies: () => ({
        prescribedRadius: {
          dependencyType: "stateVariable",
          variableName: "prescribedRadius"
        },
      }),
      additionalStateVariablesDefined: ["haveNonNumericalPrescribedRadius"],
      definition: function ({ dependencyValues }) {
        let haveNonNumericalPrescribedRadius = false;
        let numericalPrescribedRadius;

        if (dependencyValues.prescribedRadius === null) {
          numericalPrescribedRadius = null;
        } else {
          numericalPrescribedRadius = dependencyValues.prescribedRadius.evaluate_to_constant();
          if (!Number.isFinite(numericalPrescribedRadius)) {
            numericalPrescribedRadius = NaN;
            haveNonNumericalPrescribedRadius = true;
          }
        }

        return {
          newValues: {
            haveNonNumericalPrescribedRadius,
            numericalPrescribedRadius,
          },
          checkForActualChange: { haveNonNumericalEntriesNumericalRadius: true }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues, stateValues }) {

        // console.log('inverse definition of numerical prescribed radius of circle')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)


        if (stateValues.haveNonNumericalPrescribedRadius) {
          return { success: false }
        }

        if (desiredStateVariableValues.numericalPrescribedRadius !== undefined) {
          if (dependencyValues.prescribedRadius === null) {
            return { success: false };
          }

          return {
            success: true,
            instructions: [{
              setDependency: "prescribedRadius",
              desiredValue: me.fromAst(desiredStateVariableValues.numericalPrescribedRadius)
            }]
          }
        }

        return { success: false }
      }

    }


    stateVariableDefinitions.numericalPrescribedCenter = {
      returnDependencies: () => ({
        prescribedCenter: {
          dependencyType: "stateVariable",
          variableName: "prescribedCenter"
        },
      }),
      additionalStateVariablesDefined: ["haveNonNumericalPrescribedCenter"],
      definition: function ({ dependencyValues }) {
        let haveNonNumericalPrescribedCenter = false;
        let numericalPrescribedCenter;

        if (dependencyValues.prescribedCenter === null) {
          numericalPrescribedCenter = null;
        } else {
          numericalPrescribedCenter = [];
          for (let dim = 0; dim < 2; dim++) {
            let numericalValue;
            try {
              numericalValue = dependencyValues.prescribedCenter.get_component(dim).evaluate_to_constant();
            } catch (e) {
              console.warn('invalid center for circle');
              haveNonNumericalPrescribedCenter = true;
              numericalPrescribedCenter = [NaN, NaN];
              break;
            }
            if (Number.isFinite(numericalValue)) {
              numericalPrescribedCenter.push(numericalValue);
            } else {
              haveNonNumericalPrescribedCenter = true;
              numericalPrescribedCenter = [NaN, NaN];
              break;
            }
          }
        }

        return {
          newValues: {
            haveNonNumericalPrescribedCenter,
            numericalPrescribedCenter,
          },
          checkForActualChange: { haveNonNumericalPrescribedCenter: true }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues, stateValues }) {

        // console.log('inverse definition of numerical prescribed center of circle')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)

        if (stateValues.haveNonNumericalPrescribedCenter) {
          return { success: false }
        }

        if (desiredStateVariableValues.numericalPrescribedCenter !== undefined) {
          if (dependencyValues.prescribedCenter === null) {
            return { success: false };
          }

          return {
            success: true,
            instructions: [{
              setDependency: "prescribedCenter",
              desiredValue: me.fromAst(["vector", ...desiredStateVariableValues.numericalPrescribedCenter])
            }]
          }
        }

        return { success: false }
      }

    }


    stateVariableDefinitions.numericalThroughPoints = {
      returnDependencies: () => ({
        throughPoints: {
          dependencyType: "stateVariable",
          variableName: "throughPoints"
        },
      }),
      additionalStateVariablesDefined: ["haveNonNumericalThroughPoints"],
      definition: function ({ dependencyValues }) {
        let haveNonNumericalThroughPoints = false;
        let numericalThroughPoints = [];

        for (let point of dependencyValues.throughPoints) {
          let numericalPoint = [];
          for (let dim = 0; dim < 2; dim++) {
            let numericalValue;
            try {
              numericalValue = point.get_component(dim).evaluate_to_constant();
            } catch (e) {
              console.warn('Invalid point of circle');
              haveNonNumericalThroughPoints = true;
              numericalPoint = [];
              break;
            }
            if (Number.isFinite(numericalValue)) {
              numericalPoint.push(numericalValue);
            } else {
              haveNonNumericalThroughPoints = true;
              numericalPoint = [];
              break;
            }
          }
          if (numericalPoint.length > 0) {
            numericalThroughPoints.push(numericalPoint);
          } else {
            numericalThroughPoints = [];
            break;
          }
        }

        return {
          newValues: {
            haveNonNumericalThroughPoints,
            numericalThroughPoints
          },
          checkForActualChange: { haveNonNumericalThroughPoints: true }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues, stateValues }) {

        // console.log('inverse definition of numerical throughpoints of circle')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)

        if (stateValues.haveNonNumericalThroughPoints) {
          return { success: false }
        }

        if (desiredStateVariableValues.numericalThroughPoints !== undefined) {
          return {
            success: true,
            instructions: [{
              setDependency: "throughPoints",
              desiredValue: desiredStateVariableValues.numericalThroughPoints
                .map(x => me.fromAst(["vector", ...x])),
            }]
          }
        }

        return { success: false }
      }

    }

    stateVariableDefinitions.haveNumericalEntries = {
      returnDependencies: () => ({
        haveNonNumericalPrescribedCenter: {
          dependencyType: "stateVariable",
          variableName: "haveNonNumericalPrescribedCenter"
        },
        haveNonNumericalPrescribedRadius: {
          dependencyType: "stateVariable",
          variableName: "haveNonNumericalPrescribedRadius"
        },
        haveNonNumericalThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "haveNonNumericalThroughPoints"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          haveNumericalEntries: !(dependencyValues.haveNonNumericalPrescribedCenter
            || dependencyValues.haveNonNumericalPrescribedRadius
            || dependencyValues.haveNonNumericalThroughPoints
          )
        }
      })
    }


    // When circle is based on two or three points
    // radius and center are more efficently calculated simultaneously.
    // This state variable doesn't check that radius and center
    // are not prescribed, but it is used in just those cases
    stateVariableDefinitions.numericalRadiusCalculatedWithCenter = {
      additionalStateVariablesDefined: ["numericalCenterCalculatedWithRadius"],
      returnDependencies: () => ({
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints"
        },
        numericalThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numericalThroughPoints"
        },
        haveNumericalEntries: {
          dependencyType: "stateVariable",
          variableName: "haveNonNumericalThroughPoints"
        }
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.haveNonNumericalThroughPoints) {
          let message = "Haven't implemented circle through " + dependencyValues.nThroughPoints + " points";
          message += " in case where don't have numerical values."
          console.warn(message);
          return {
            newValues: {
              numericalRadiusCalculatedWithCenter: null,
              numericalCenterCalculatedWithRadius: null
            }
          }
        }


        if (dependencyValues.nThroughPoints === 2) {

          let { numericalCenter, numericalRadius } = circleFromTwoNumericalPoints({
            point1: dependencyValues.numericalThroughPoints[0],
            point2: dependencyValues.numericalThroughPoints[1]
          });

          return {
            newValues: {
              numericalCenterCalculatedWithRadius: numericalCenter,
              numericalRadiusCalculatedWithCenter: numericalRadius
            }
          }

        } else if (dependencyValues.nThroughPoints === 3) {


          let x1 = dependencyValues.numericalThroughPoints[0][0];
          let x2 = dependencyValues.numericalThroughPoints[1][0];
          let x3 = dependencyValues.numericalThroughPoints[2][0];
          let y1 = dependencyValues.numericalThroughPoints[0][1];
          let y2 = dependencyValues.numericalThroughPoints[1][1];
          let y3 = dependencyValues.numericalThroughPoints[2][1];

          let numericalCenter, numericalRadius;

          if (x1 === x2 && y1 === y2) {
            if (x1 === x3 && y1 === y3) {
              // if all points are identical, it's a circle with radius zero
              numericalCenter = [x1, y1];
              numericalRadius = 0;
            } else {
              // if point 1 and 2 are identical, treat it as circle through two points
              let result = circleFromTwoNumericalPoints({
                point1: [x1, y1],
                point2: [x3, y3]
              });
              numericalCenter = result.numericalCenter;
              numericalRadius = result.numericalRadius;
            }
          } else if ((x1 === x3 && y1 === y3) || (x2 === x3 && y2 === y3)) {
            // if point 1 and 3 are identical, 
            // or if point 2 and 3 are identical,
            // treat it as circle through two points
            let result = circleFromTwoNumericalPoints({
              point1: [x1, y1],
              point2: [x2, y2]
            });
            numericalCenter = result.numericalCenter;
            numericalRadius = result.numericalRadius;

          } else {
            // all distinct points

            let mag1 = x1 * x1 + y1 * y1;
            let mag2 = x2 * x2 + y2 * y2;
            let mag3 = x3 * x3 + y3 * y3;

            let A = x1 * (y2 - y3) - y1 * (x2 - x3) + x2 * y3 - x3 * y2;
            let B = mag1 * (y3 - y2) + mag2 * (y1 - y3) + mag3 * (y2 - y1);
            let C = mag1 * (x2 - x3) + mag2 * (x3 - x1) + mag3 * (x1 - x2);
            let D = mag1 * (x3 * y2 - x2 * y3) + mag2 * (x1 * y3 - x3 * y1) + mag3 * (x2 * y1 - x1 * y2);

            if (A !== 0) {
              numericalCenter = [-B / (2 * A), -C / (2 * A)];
              numericalRadius = Math.sqrt((B * B + C * C - 4 * A * D) / (4 * A * A));
            } else {

              // collinear non-identical points, can't make a circle
              numericalCenter = [NaN, NaN];
              numericalRadius = NaN;
            }
          }

          return {
            newValues: {
              numericalCenterCalculatedWithRadius: numericalCenter,
              numericalRadiusCalculatedWithCenter: numericalRadius
            }
          }

        } else if (dependencyValues.nThroughPoints > 3) {
          console.warn("Can't calculate circle through more than 3 points")
          return {
            newValues: {
              numericalRadiusCalculatedWithCenter: null,
              numericalCenterCalculatedWithRadius: null
            }
          }
        } else {
          // these variables aren't used with fewer than 2 points
          return {
            newValues: {
              numericalRadiusCalculatedWithCenter: null,
              numericalCenterCalculatedWithRadius: null
            }
          }
        }

      }

    }

    stateVariableDefinitions.numericalRadius = {
      forRenderer: true,
      stateVariablesDeterminingDependencies: [
        "nThroughPoints", "havePrescribedCenter", "havePrescribedRadius"],
      defaultValue: 1,
      returnDependencies: function ({ stateValues }) {
        let dependencies = {
          haveNonNumericalPrescribedRadius: {
            dependencyType: "stateVariable",
            variableName: "haveNonNumericalPrescribedRadius"
          },
          nThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "nThroughPoints"
          }
        }

        if (stateValues.havePrescribedRadius) {
          dependencies.numericalPrescribedRadius = {
            dependencyType: "stateVariable",
            variableName: "numericalPrescribedRadius"
          }
          if (stateValues.havePrescribedCenter && stateValues.nThroughPoints > 0) {
            dependencies.haveCenterRadiusPoints = {
              dependencyType: "value",
              value: true,
            }
          }
        } else {

          if (stateValues.havePrescribedCenter) {
            if (stateValues.nThroughPoints === 1) {
              dependencies.haveNonNumericalPrescribedCenter = {
                dependencyType: "stateVariable",
                variableName: "haveNonNumericalPrescribedCenter"
              };
              dependencies.numericalPrescribedCenter = {
                dependencyType: "stateVariable",
                variableName: "numericalPrescribedCenter"
              };
              dependencies.haveNonNumericalThroughPoints = {
                dependencyType: "stateVariable",
                variableName: "haveNonNumericalThroughPoints"
              };
              dependencies.numericalThroughPoints = {
                dependencyType: "stateVariable",
                variableName: "numericalThroughPoints"
              };
            }

          } else if (stateValues.nThroughPoints > 1) {
            dependencies.numericalRadiusCalculatedWithCenter = {
              dependencyType: "stateVariable",
              variableName: "numericalRadiusCalculatedWithCenter"
            };
            // need numericalThroughPoints for inverse definition
            // as skip numericalRadiusCalculatedWithCenter
            dependencies.numericalThroughPoints = {
              dependencyType: "stateVariable",
              variableName: "numericalThroughPoints"
            };
          }
        }

        return dependencies;
      },
      definition: function ({ dependencyValues }) {
        // console.log(`definition of numericalRadius of circle`);
        // console.log(dependencyValues);

        if (dependencyValues.haveNonNumericalPrescribedRadius
          || dependencyValues.haveNonNumericalPrescribedCenter
          || dependencyValues.haveNonNumericalThroughPoints
        ) {
          return {
            newValues: {
              numericalRadius: NaN
            }
          }
        }

        if (dependencyValues.numericalPrescribedRadius !== undefined) {
          if (dependencyValues.haveCenterRadiusPoints) {
            console.warn("Can't calculate circle with specified radius and center and through points")
            return { newValues: { numericalRadius: NaN } }
          }

          return {
            newValues: {
              numericalRadius: Math.max(0, dependencyValues.numericalPrescribedRadius)
            }
          }
        }

        if (dependencyValues.numericalPrescribedCenter !== undefined) {
          if (dependencyValues.nThroughPoints === 0) {
            return {
              useEssentialOrDefaultValue: {
                numericalRadius: {
                  variablesToCheck: "numericalRadius"
                }
              }
            }
          } else if (dependencyValues.nThroughPoints === 1) {
            // center and one point specified.
            // Radius is distance from center to point.
            let pt = dependencyValues.numericalThroughPoints[0];
            let numericalRadius = Math.sqrt(
              Math.pow(pt[0] - dependencyValues.numericalPrescribedCenter[0], 2)
              + Math.pow(pt[1] - dependencyValues.numericalPrescribedCenter[1], 2)
            );
            return { newValues: { numericalRadius } }
          } else {
            console.warn("Can't calculate circle with specified center through more than 1 point")
            return { newValues: { numericalRadius: NaN } }
          }

        }

        // don't have prescribed center
        if (dependencyValues.nThroughPoints < 2) {
          return {
            useEssentialOrDefaultValue: {
              numericalRadius: {
                variablesToCheck: "numericalRadius"
              }
            }
          }
        } else {
          // having two or three through points
          // with no prescribed radius or center
          // is case where calculated radius and center together.
          return {
            newValues: {
              numericalRadius: dependencyValues.numericalRadiusCalculatedWithCenter
            }
          }
        }


      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues, stateValues }) {

        // console.log('inverse definition of numericalRadius of circle')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)

        if (dependencyValues.numericalPrescribedRadius !== undefined) {
          return {
            success: true,
            instructions: [{
              setDependency: "numericalPrescribedRadius",
              desiredValue: Math.max(0, desiredStateVariableValues.numericalRadius),
            }]
          }
        }

        if (dependencyValues.numericalPrescribedCenter !== undefined) {
          if (dependencyValues.nThroughPoints === 0) {
            return {
              success: true,
              instructions: [{
                setStateVariable: "numericalRadius",
                value: Math.max(0, desiredStateVariableValues.numericalRadius)
              }]
            }
          } else if (dependencyValues.nThroughPoints === 1) {

            let numericalRadius = Math.max(0, desiredStateVariableValues.numericalRadius);

            let theta = stateValues.throughAngles[0];
            if (!Number.isFinite(theta)) {
              return { success: false }
            }
            let pt = [
              stateValues.numericalCenter[0] + numericalRadius * Math.cos(theta),
              stateValues.numericalCenter[1] + numericalRadius * Math.sin(theta)
            ]

            return {
              success: true,
              instructions: [{
                setDependency: "numericalThroughPoints",
                desiredValue: [pt],
              }]
            }
          } else {
            return { success: false }
          }

        }

        // don't have prescribed center
        if (dependencyValues.nThroughPoints < 2) {
          return {
            success: true,
            instructions: [{
              setStateVariable: "numericalRadius",
              value: Math.max(0, desiredStateVariableValues.numericalRadius)
            }]
          }
        } else {

          let newThroughPoints = [];

          let numericalRadius = Math.max(0, desiredStateVariableValues.numericalRadius);

          for (let i = 0; i < dependencyValues.nThroughPoints; i++) {
            let theta = stateValues.throughAngles[i];
            if (!Number.isFinite(theta)) {
              return { success: false }
            }
            let pt = [
              stateValues.numericalCenter[0] + numericalRadius * Math.cos(theta),
              stateValues.numericalCenter[1] + numericalRadius * Math.sin(theta)
            ]

            newThroughPoints.push(pt);
          }

          return {
            success: true,
            instructions: [{
              setDependency: "numericalThroughPoints",
              desiredValue: newThroughPoints,
            }]
          }
        }

      }
    }

    stateVariableDefinitions.numericalCenter = {
      forRenderer: true,
      stateVariablesDeterminingDependencies: [
        "nThroughPoints", "havePrescribedCenter", "havePrescribedRadius",
      ],
      defaultValue: [0, 0],
      returnDependencies: function ({ stateValues }) {
        let dependencies = {
          haveNonNumericalPrescribedCenter: {
            dependencyType: "stateVariable",
            variableName: "haveNonNumericalPrescribedCenter"
          },
        }
        if (stateValues.havePrescribedCenter) {
          dependencies.numericalPrescribedCenter = {
            dependencyType: "stateVariable",
            variableName: "numericalPrescribedCenter"
          }
          if (stateValues.havePrescribedRadius && stateValues.nThroughPoints > 0) {
            dependencies.haveCenterRadiusPoints = {
              dependencyType: "value",
              value: true,
            }
          }
        } else {
          dependencies.nThroughPoints = {
            dependencyType: "stateVariable",
            variableName: "nThroughPoints"
          };
          dependencies.numericalThroughPoints = {
            dependencyType: "stateVariable",
            variableName: "numericalThroughPoints"
          };
          dependencies.haveNonNumericalThroughPoints = {
            dependencyType: "stateVariable",
            variableName: "haveNonNumericalThroughPoints"
          };

          if (stateValues.havePrescribedRadius) {
            // still used numericalRadius, rather than numericalPrescribedRadius
            // as numericalRadius becomes zero if have negative numericalPrescribedRadius
            dependencies.numericalRadius = {
              dependencyType: "stateVariable",
              variableName: "numericalRadius"
            };
          } else if (stateValues.nThroughPoints == 1) {
            // if didn't have prescribed radius but just one point
            // we treat the radius calculated above as prescribed
            dependencies.numericalRadius = {
              dependencyType: "stateVariable",
              variableName: "numericalRadius"
            };

          } else if (stateValues.nThroughPoints > 1) {
            dependencies.numericalCenterCalculatedWithRadius = {
              dependencyType: "stateVariable",
              variableName: "numericalCenterCalculatedWithRadius"
            };
          }
        }

        return dependencies;
      },
      definition: function ({ dependencyValues }) {
        // console.log(`definition of numericalCenter of circle`);
        // console.log(dependencyValues);

        if (dependencyValues.haveNonNumericalPrescribedRadius
          || dependencyValues.haveNonNumericalPrescribedCenter
          || dependencyValues.haveNonNumericalThroughPoints
        ) {
          return {
            newValues: {
              numericalCenter: [NaN, NaN]
            }
          }
        }

        if (dependencyValues.numericalPrescribedCenter !== undefined) {
          if (dependencyValues.haveCenterRadiusPoints) {
            console.warn("Can't calculate circle with specified radius and center and through points")
            return { newValues: { numericalCenter: [NaN, NaN] } }
          }
          return {
            newValues: {
              numericalCenter: dependencyValues.numericalPrescribedCenter
            }
          }
        }

        if (dependencyValues.numericalRadius !== undefined) {
          // have a radius defined and no center
          if (dependencyValues.nThroughPoints === 0) {
            // only radius specified.  Create centered at origin as a default.
            return {
              useEssentialOrDefaultValue: {
                numericalCenter: {
                  variablesToCheck: "numericalCenter"
                }
              }
            }
          } else if (dependencyValues.nThroughPoints === 1) {
            // radius and one through point
            // create a circle with top being the point

            let numericalCenter = [
              dependencyValues.numericalThroughPoints[0][0],
              dependencyValues.numericalThroughPoints[0][1] - dependencyValues.numericalRadius
            ];

            return { newValues: { numericalCenter } }

          } else if (dependencyValues.nThroughPoints === 2) {

            // find circle through two points with given radius
            let r = dependencyValues.numericalRadius;

            let x1 = dependencyValues.numericalThroughPoints[0][0];
            let x2 = dependencyValues.numericalThroughPoints[1][0];
            let y1 = dependencyValues.numericalThroughPoints[0][1];
            let y2 = dependencyValues.numericalThroughPoints[1][1];

            let dist2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
            let r2 = r * r;

            if (r < 0 || 4 * r2 < dist2) {
              console.warn("Can't find circle through given radius and two points");
              return { newValues: { numericalCenter: [NaN, NaN] } }
            }

            if (dist2 === 0) {
              // points are equal to each other, treat as through single point
              return { newValues: { numericalCenter: [x1, y1 - r] } }
            }


            let centerx = 0.5 * (dist2 * (x1 + x2) + (y2 - y1) * Math.sqrt((4 * r2 - dist2) * dist2))
              / dist2

            let centery = 0.5 * (dist2 * (y1 + y2) + (x1 - x2) * Math.sqrt((4 * r2 - dist2) * dist2))
              / dist2;

            return { newValues: { numericalCenter: [centerx, centery] } }

          } else {

            console.warn("Can't create circle through more than two points with given radius");
            return { newValues: { numericalCenter: [NaN, NaN] } }

          }
        }


        // don't have prescribed radius
        if (dependencyValues.nThroughPoints === 0) {
          return {
            useEssentialOrDefaultValue: {
              numericalCenter: {
                variablesToCheck: "numericalCenter"
              }
            }
          }
        } else {

          // Must have at least two points, as case with one through point
          // used calculated radius

          // having two or three through points
          // with no prescribed radius or center
          // is case where calculated radius and center together.

          if (dependencyValues.numericalCenterCalculatedWithRadius === undefined) {
            // if nThroughPoints changed, but dependencies haven't been recalculated yet
            // could get to here where don't have numericalCenterCalculatedWithRadius
            return {
              newValues: {
                numericalCenter: [NaN, NaN]
              }
            }

          } else {

            return {
              newValues: {
                numericalCenter: dependencyValues.numericalCenterCalculatedWithRadius
              }
            }
          }
        }



      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues, stateValues }) {

        // console.log('inverse definition of numericalCenter of circle')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)

        if (dependencyValues.numericalPrescribedCenter !== undefined) {

          return {
            success: true,
            instructions: [{
              setDependency: "numericalPrescribedCenter",
              desiredValue: desiredStateVariableValues.numericalCenter,
            }]
          }
        }


        if (dependencyValues.nThroughPoints === 0) {
          // just change essential value of numericalCenter
          return {
            success: true,
            instructions: [{
              setStateVariable: "numericalCenter",
              value: desiredStateVariableValues.numericalCenter
            }]
          }
        } else {
          let newThroughPoints = [];

          for (let i = 0; i < dependencyValues.nThroughPoints; i++) {
            let theta = stateValues.throughAngles[i];
            if (!Number.isFinite(theta)) {
              return { success: false }
            }
            let pt = [
              desiredStateVariableValues.numericalCenter[0] + stateValues.numericalRadius * Math.cos(theta),
              desiredStateVariableValues.numericalCenter[1] + stateValues.numericalRadius * Math.sin(theta)
            ]

            newThroughPoints.push(pt);
          }

          return {
            success: true,
            instructions: [{
              setDependency: "numericalThroughPoints",
              desiredValue: newThroughPoints,
            }]
          }

        }

      }
    }

    stateVariableDefinitions.throughAngles = {
      defaultValue: [],
      returnDependencies: () => ({
        haveNumericalEntries: {
          dependencyType: "stateVariable",
          variableName: "haveNumericalEntries"
        },
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
        numericalThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numericalThroughPoints",
        },
        numericalRadius: {
          dependencyType: "stateVariable",
          variableName: "numericalRadius",
        },
        numericalCenter: {
          dependencyType: "stateVariable",
          variableName: "numericalCenter",
        }
      }),
      definition: function ({ dependencyValues }) {

        if (!(dependencyValues.haveNumericalEntries && dependencyValues.nThroughPoints > 0
          && dependencyValues.numericalRadius > 0
          && dependencyValues.numericalCenter.every(x => Number.isFinite(x)))
        ) {
          return {
            useEssentialOrDefaultValue: {
              throughAngles: {
                variablesToCheck: ["throughAngles"]
              }
            }
          }
        }

        // if have through points, numeric entries and positive radius
        // calculate angles
        let throughAngles = [];
        for (let pt of dependencyValues.numericalThroughPoints) {
          throughAngles.push(
            Math.atan2(pt[1] - dependencyValues.numericalCenter[1], pt[0] - dependencyValues.numericalCenter[0])
          );
        }

        // make throughAngles essential so that can save their values
        // even if values become invalid (such as radius becoming zero)
        return {
          newValues: { throughAngles },
          makeEssential: ["throughAngles"]
        };
      }
    }


    stateVariableDefinitions.radius = {
      public: true,
      componentType: "math",
      stateVariablesDeterminingDependencies: [
        "nThroughPoints", "havePrescribedCenter", "havePrescribedRadius",
      ],
      defaultValue: me.fromAst(1),
      returnDependencies: function ({ stateValues }) {
        let dependencies = {
          numericalRadius: {
            dependencyType: "stateVariable",
            variableName: "numericalRadius"
          },
          nThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "nThroughPoints"
          }
        }

        if (stateValues.havePrescribedRadius) {
          dependencies.prescribedRadius = {
            dependencyType: "stateVariable",
            variableName: "prescribedRadius"
          }
          if (stateValues.havePrescribedCenter && stateValues.nThroughPoints > 0) {
            dependencies.haveCenterRadiusPoints = {
              dependencyType: "value",
              value: true,
            }
          }
        } else {

          if (stateValues.havePrescribedCenter && stateValues.nThroughPoints === 1) {
            dependencies.prescribedCenter = {
              dependencyType: "stateVariable",
              variableName: "prescribedCenter"
            };
            dependencies.throughPoints = {
              dependencyType: "stateVariable",
              variableName: "throughPoints"
            };
          }
        }
        return dependencies;
      },
      definition: function ({ dependencyValues }) {
        // console.log(`definition of radius of circle`);
        // console.log(dependencyValues);

        if (Number.isFinite(dependencyValues.numericalRadius)) {
          return {
            newValues: {
              radius: me.fromAst(dependencyValues.numericalRadius)
            },
            // make radius essential in case radius becomes non-numeric
            // and we have to set the radius state variable in the inverse definition
            makeEssential: ["radius"]
          }
        }

        if (dependencyValues.prescribedRadius !== undefined) {
          if (dependencyValues.haveCenterRadiusPoints) {
            console.warn("Can't calculate circle with specified radius and center and through points")
            return { newValues: { radius: me.fromAst('\uff3f') } }
          }
          return {
            newValues: {
              radius: dependencyValues.prescribedRadius
            }
          }
        }

        if (dependencyValues.prescribedCenter !== undefined) {
          if (dependencyValues.nThroughPoints === 0) {
            return {
              useEssentialOrDefaultValue: {
                radius: {
                  variablesToCheck: "radius"
                }
              }
            }
          } else if (dependencyValues.nThroughPoints === 1) {
            // center and one point specified.
            // Radius is distance from center to point.

            try {
              let pt = dependencyValues.throughPoints[0];
              let ptx = pt.get_component(0);
              let pty = pt.get_component(1);
              let ctx = dependencyValues.prescribedCenter.get_component(0);
              let cty = dependencyValues.prescribedCenter.get_component(1);

              let radius = ptx.subtract(ctx).pow(2)
                .add(pty.subtract(cty).pow(2))
                .pow(0.5).simplify();

              return { newValues: { radius } }
            } catch (e) {
              console.warn("Invalid center or through points of circle")
              return { newValues: { radius: me.fromAst('\uff3f') } }
            }
          } else {
            console.warn("Can't calculate circle with specified center through more than 1 point")
            return { newValues: { radius: me.fromAst('\uff3f') } }
          }

        }

        // don't have prescribed center
        if (dependencyValues.nThroughPoints < 2) {
          return {
            useEssentialOrDefaultValue: {
              radius: {
                variablesToCheck: "radius"
              }
            }
          }
        } else {
          // having two or three through points
          // with no prescribed radius or center

          console.warn(`Have not implemented circle through ${dependencyValues.nThroughPoints} points when non-numerical values`)
          return { newValues: { radius: me.fromAst('\uff3f') } }
        }

      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues, stateValues }) {

        // console.log('inverse definition of radius of circle')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)

        let numericalRadius = desiredStateVariableValues.radius.evaluate_to_constant();

        if (Number.isFinite(numericalRadius) && Number.isFinite(dependencyValues.numericalRadius)) {
          return {
            success: true,
            instructions: [{
              setDependency: "numericalRadius",
              desiredValue: numericalRadius,
            }]
          }
        }

        if (dependencyValues.prescribedRadius !== undefined) {

          return {
            success: true,
            instructions: [{
              setDependency: "prescribedRadius",
              desiredValue: desiredStateVariableValues.radius,
            }]
          }

        }

        if (dependencyValues.nThroughPoints === 0) {
          // just change essential value of radius
          // (and numericalRadius if we have a numerical radius)
          let instructions = [{
            setStateVariable: "radius",
            value: desiredStateVariableValues.radius
          }];

          if (Number.isFinite(numericalRadius)) {
            instructions.push({
              setDependency: "numericalRadius",
              desiredValue: numericalRadius,
            })
          }
          return {
            success: true,
            instructions
          }
        } else {

          console.warn("Can't change radius of circle with non-numerical values through points");
          return { success: false }

        }

      }
    }


    stateVariableDefinitions.center = {
      forRenderer: true,
      public: true,
      componentType: "point",
      stateVariablesDeterminingDependencies: [
        "nThroughPoints", "havePrescribedCenter", "havePrescribedRadius"
      ],
      defaultValue: me.fromAst(["vector", 0, 0]),
      returnDependencies: function ({ stateValues }) {
        let dependencies = {
          numericalCenter: {
            dependencyType: "stateVariable",
            variableName: "numericalCenter"
          },
        }

        if (stateValues.havePrescribedCenter) {
          dependencies.prescribedCenter = {
            dependencyType: "stateVariable",
            variableName: "prescribedCenter"
          }
          if (stateValues.havePrescribedRadius && stateValues.nThroughPoints > 0) {
            dependencies.haveCenterRadiusPoints = {
              dependencyType: "value",
              value: true,
            }
          }
        } else {
          dependencies.nThroughPoints = {
            dependencyType: "stateVariable",
            variableName: "nThroughPoints"
          };
          dependencies.throughPoints = {
            dependencyType: "stateVariable",
            variableName: "throughPoints"
          };

          if (stateValues.havePrescribedRadius) {
            // we call prescribedRadius as radius
            // as we will treat the same as calculated radius
            // for case with one through point
            dependencies.radius = {
              dependencyType: "stateVariable",
              variableName: "prescribedRadius"
            };
          } else if (stateValues.nThroughPoints == 1) {
            // if didn't have prescribed radius but just one point
            // we treat the radius calculated above as prescribed
            dependencies.radius = {
              dependencyType: "stateVariable",
              variableName: "radius"
            };

          }
        }

        return dependencies;
      },
      definition: function ({ dependencyValues }) {
        // console.log(`definition of center of circle`);
        // console.log(dependencyValues);

        if (dependencyValues.numericalCenter.every(x => Number.isFinite(x))) {
          return {
            newValues: {
              center: me.fromAst(["vector", ...dependencyValues.numericalCenter])
            },
            // make center essential in case center becomes non-numeric
            // and we have to set the center state variable in the inverse definition
            makeEssential: ["center"]
          }
        }

        if (dependencyValues.prescribedCenter !== undefined) {
          if (dependencyValues.haveCenterRadiusPoints) {
            console.warn("Can't calculate circle with specified radius and center and through points")
            return {
              newValues: {
                center: me.fromAst(["vector", '\uff3f', '\uff3f'])
              }
            }
          }
          return {
            newValues: {
              center: dependencyValues.prescribedCenter
            }
          }
        }

        if (dependencyValues.radius !== undefined) {

          // have a radius defined and no center
          if (dependencyValues.nThroughPoints === 0) {
            // only radius specified.  Create centered at origin as a default.
            return {
              useEssentialOrDefaultValue: {
                center: {
                  variablesToCheck: "center"
                }
              }
            }
          } else if (dependencyValues.nThroughPoints === 1) {
            // radius and one through point
            // create a circle with top being the point

            let temp = dependencyValues.throughPoints[0];
            let center = temp.substitute_component(1,
              temp.get_component(1).subtract(dependencyValues.radius)
            ).simplify();


            return { newValues: { center } }

          } else {

            console.warn("Can't create circle through more than one point with given radius when don't have numerical values");
            return {
              newValues: {
                center: me.fromAst(["vector", '\uff3f', '\uff3f'])
              }
            }
          }
        }


        // don't have prescribed radius
        if (dependencyValues.nThroughPoints === 0) {
          return {
            useEssentialOrDefaultValue: {
              center: {
                variablesToCheck: "center"
              }
            }
          }
        } else {

          // Must have at least two points, as case with one through point
          // used calculated radius

          console.warn("Can't create circle through more than one point when don't have numerical values");
          return {
            newValues: {
              center: me.fromAst(["vector", '\uff3f', '\uff3f'])
            }
          }
        }


      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues, stateValues, workspace }) {

        // console.log('inverse definition of center of circle')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)

        if (!["tuple", "vector"].includes(desiredStateVariableValues.center.tree[0])) {
          return { success: false };
        }

        // if have any empty values in desired value,
        // merge with current values, or value from workspace
        let centerAst;
        if (workspace.desiredCenterAst) {
          // if have desired expresson from workspace, use that instead of currentValue
          centerAst = workspace.desiredCenterAst.slice(0);
        } else {
          centerAst = stateValues.center.tree.slice(0);
        }

        for (let [ind, value] of desiredStateVariableValues.center.tree.entries()) {
          if (value !== undefined) {
            centerAst[ind] = value;
          }
        }

        let desiredCenter = me.fromAst(centerAst);
        workspace.desiredCenterAst = centerAst;

        let numericalCenter = [];
        let desiredCenterIsNumeric = true;

        for (let i = 0; i < 2; i++) {
          let component = desiredCenter.get_component(i).evaluate_to_constant();
          if (!Number.isFinite(component)) {
            desiredCenterIsNumeric = false;
            break;
          }
          numericalCenter.push(component);
        }

        if (desiredCenterIsNumeric && dependencyValues.numericalCenter.every(x => Number.isFinite(x))) {
          return {
            success: true,
            instructions: [{
              setDependency: "numericalCenter",
              desiredValue: numericalCenter,
            }]
          }
        }

        if (dependencyValues.prescribedCenter !== undefined) {

          return {
            success: true,
            instructions: [{
              setDependency: "prescribedCenter",
              desiredValue: desiredCenter,
            }]
          }
        }


        if (dependencyValues.nThroughPoints === 0) {
          // just change essential value of center
          // (and numericalCenter if we have a numerical center)

          let instructions = [{
            setStateVariable: "center",
            value: desiredCenter
          }];

          if (desiredCenterIsNumeric) {
            instructions.push({
              setDependency: "numericalCenter",
              desiredValue: numericalCenter,
            })
          }

          return {
            success: true,
            instructions
          }
        } else {

          console.warn("Haven't implemented changing center of circle through points with non numerical values");
          return { success: false };

        }

      }
    }



    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        throughChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneThrough"
        },
        centerChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneCenter"

        }
      }),
      definition: function ({ dependencyValues }) {
        let childrenToRender = []
        if (dependencyValues.throughChild.length === 1) {
          childrenToRender.push(dependencyValues.throughChild[0].componentName);
        }
        if (dependencyValues.centerChild.length === 1) {
          childrenToRender.push(dependencyValues.centerChild[0].componentName);
        }
        return { newValues: { childrenToRender } };
      }
    }

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        numericalCenter: {
          dependencyType: "stateVariable",
          variableName: "numericalCenter"
        },
        numericalRadius: {
          dependencyType: "stateVariable",
          variableName: "numericalRadius"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          nearestPoint: function (variables) {

            let x1 = variables.x1.evaluate_to_constant();
            let x2 = variables.x2.evaluate_to_constant();

            if (!(Number.isFinite(x1) && Number.isFinite(x2))) {
              return {};
            }


            if (!(Number.isFinite(dependencyValues.numericalCenter[0]) &&
              Number.isFinite(dependencyValues.numericalCenter[1]) &&
              Number.isFinite(dependencyValues.numericalRadius))) {
              return {};
            }

            let theta = Math.atan2(x2 - dependencyValues.numericalCenter[1], x1 - dependencyValues.numericalCenter[0])

            let result = {
              x1: dependencyValues.numericalCenter[0] + dependencyValues.numericalRadius * Math.cos(theta),
              x2: dependencyValues.numericalCenter[1] + dependencyValues.numericalRadius * Math.sin(theta),
            }

            if (variables.x3 !== undefined) {
              result.x3 = 0;
            }

            return result;

          }
        }
      })
    }



    return stateVariableDefinitions;

  }


  moveCircle({ center }) {

    let instructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "numericalCenter",
      value: center
    }]


    if (this.stateValues.nThroughPoints === 1
      && this.stateValues.numericalPrescribedCenter !== null
      && this.stateValues.numericalPrescribedRadius === null
    ) {

      // Case of a circle prescribed by center and one point.
      // Need to move the point to preserve the radius

      let theta = this.stateValues.throughAngles[0]
      let pt = [
        center[0] + this.stateValues.numericalRadius * Math.cos(theta),
        center[1] + this.stateValues.numericalRadius * Math.sin(theta)
      ]

      instructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "numericalThroughPoints",
        value: [pt]
      })

    }

    this.requestUpdate({
      updateInstructions: instructions
    });

  }

}

function circleFromTwoNumericalPoints({ point1, point2 }) {
  let xcenter = (point1[0] + point2[0]) / 2;
  let ycenter = (point1[1] + point2[1]) / 2;
  let numericalCenter = [xcenter, ycenter];
  let numericalRadius = Math.sqrt(Math.pow(xcenter - point1[0], 2)
    + Math.pow(ycenter - point1[1], 2));
  return { numericalCenter, numericalRadius };
}
