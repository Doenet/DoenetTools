import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';

export default class LineSegment extends GraphicalComponent {
  static componentType = "linesegment";

  actions = {
    moveLineSegment: this.moveLineSegment.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
  };

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["endpoints"] };

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.draggable = { default: true, forRenderer: true };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let addEndpoints = function ({ activeChildrenMatched }) {
      // add <endpoints> around points
      let endpointChildren = [];
      for (let child of activeChildrenMatched) {
        endpointChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "endpoints", children: endpointChildren }],
      }
    }

    let exactlyTwoPoints = childLogic.newLeaf({
      name: "exactlyTwoPoints",
      componentType: 'point',
      number: 2,
      isSugar: true,
      replacementFunction: addEndpoints,
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
      isSugar: true,
      replacementFunction: addEndpoints,
    });

    let noPoints = childLogic.newLeaf({
      name: "noPoints",
      componentType: 'point',
      number: 0
    });

    let exactlyOneEndpoints = childLogic.newLeaf({
      name: "exactlyOneEndpoints",
      componentType: 'endpoints',
      number: 1
    });

    childLogic.newOperator({
      name: "endpointsXorSugar",
      operator: 'xor',
      propositions: [exactlyOneEndpoints, exactlyTwoPoints, stringsAndMaths, noPoints],
      setAsBase: true
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.styleDescription = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
      }),
      definition: function ({ dependencyValues }) {

        let lineDescription = "";
        if (dependencyValues.selectedStyle.lineWidth >= 4) {
          lineDescription += "thick ";
        } else if (dependencyValues.selectedStyle.lineWidth <= 1) {
          lineDescription += "thin ";
        }
        if (dependencyValues.selectedStyle.lineStyle === "dashed") {
          lineDescription += "dashed ";
        } else if (dependencyValues.selectedStyle.lineStyle === "dotted") {
          lineDescription += "dotted ";
        }

        lineDescription += `${dependencyValues.selectedStyle.lineColor} `;

        return { newValues: { styleDescription: lineDescription } };
      }
    }

    stateVariableDefinitions.endpoints = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["endpoint"],
      returnDependencies: function ({ arrayKeys }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }
        if (arrayKey === undefined) {
          return ({
            endpointsChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneEndpoints",
              variableNames: ["points"]
            }
          })
        } else {
          return ({
            endpointsChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneEndpoints",
              variableNames: ["point" + (arrayKey + 1)]
            }
          })
        }
      },
      markStale: function ({ freshnessInfo, changes, arrayKeys }) {

        let freshByKey = freshnessInfo.endpoints.freshByKey;

        // console.log('markStale for linesegment endpoints')
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(JSON.parse(JSON.stringify(changes)))
        // console.log(arrayKeys);

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (changes.endpointsChild) {

          if (changes.endpointsChild.componentIdentitiesChanged) {

            // if endpointsChild changed
            // then the entire points array of line is also changed
            for (let key in freshByKey) {
              delete freshByKey[key];
            }
          } else {

            let valuesChanged = changes.endpointsChild.valuesChanged[0];

            if (arrayKey === undefined) {

              if (valuesChanged.points) {
                // if have the same points from endpointsChild
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
            return { fresh: { endpoints: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { endpoints: true } }
          }
        } else {
          // asked for just one component
          return { fresh: { endpoints: freshByKey[arrayKey] === true } }
        }

      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {
        let freshByKey = freshnessInfo.endpoints.freshByKey;

        // console.log('definition of linesegment endpoints');
        // console.log(dependencyValues)
        // console.log(arrayKeys);
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(changes)

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (dependencyValues.endpointsChild.length === 1) {

          if (arrayKey === undefined) {
            let endpoints = dependencyValues.endpointsChild[0].stateValues.points;

            let useEssentialOrDefaultValue;
            if (endpoints.length < 2) {
              freshByKey[1] = true;
              useEssentialOrDefaultValue = {
                endpoints: {
                  1: { defaultValue: me.fromAst(["vector", 0, 0]) }
                }
              }
              if (endpoints.length < 1) {
                freshByKey[0] = true;
                useEssentialOrDefaultValue.endpoints[0] = { defaultValue: me.fromAst(["vector", 1, 0]) }
              }
            }

            if (changes.endpointsChild.componentIdentitiesChanged ||
              changes.endpointsChild.valuesChanged[0].points.changed.changedEntireArray
            ) {
              // send array to indicate that should overwrite entire array
              for (let key in endpoints) {
                freshByKey[key] = true;
              }
              let result = {
                newValues: { endpoints }
              }
              if (useEssentialOrDefaultValue) {
                result.useEssentialOrDefaultValue = useEssentialOrDefaultValue;
              }
              return result
            }

            let newPointValues = {};
            for (let key in endpoints) {
              if (!freshByKey[key]) {
                freshByKey[key] = true;
                newPointValues[key] = endpoints[key]
              }
            }
            let result = { newValues: { endpoints: newPointValues } };
            if (useEssentialOrDefaultValue) {
              result.useEssentialOrDefaultValue = useEssentialOrDefaultValue;
            }

            return result

          } else {
            // have an arrayKey defined

            if (!freshByKey[arrayKey]) {
              freshByKey[arrayKey] = true;
              let coords = dependencyValues.endpointsChild[0].stateValues["point" + (arrayKey + 1)];
              if (coords === undefined) {
                if (arrayKey === 1) {
                  return {
                    useEssentialOrDefaultValue: {
                      endpoints: {
                        1: { defaultValue: me.fromAst(["vector", 0, 0]) }
                      }
                    }
                  }
                } else if (arrayKey === 0) {
                  return {
                    useEssentialOrDefaultValue: {
                      endpoints: {
                        0: { defaultValue: me.fromAst(["vector", 1, 0]) }
                      }
                    }
                  }
                }
              }
              return {
                newValues: {
                  endpoints: {
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
          return {
            useEssentialOrDefaultValue: {
              endpoints: {
                0: { defaultValue: me.fromAst(["vector", 1, 0]) },
                1: { defaultValue: me.fromAst(["vector", 0, 0]) }
              }
            },
            makeEssential: ["endpoints"]
          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues,
        stateValues, initialChange, arrayKeys
      }) {

        // console.log(`inverseDefinition of endpoints of linesegment`);
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

        if (dependencyValues.endpointsChild.length !== 1) {
          // no endpoints child, so have essential endpoints

          if (arrayKey === undefined) {
            // working with entire array
            return {
              success: true,
              instructions: [{
                setStateVariable: "endpoints",
                value: desiredStateVariableValues.endpoints
              }]
            }
          } else {
            // have just an arrayKey
            return {
              success: true,
              instructions: [{
                setStateVariable: "endpoints",
                value: desiredStateVariableValues.endpoints[arrayKey],
                arrayKey
              }]
            }
          }
        }


        if (arrayKey === undefined) {
          // working with entire array
          let nEndpoints = dependencyValues.endpointsChild[0].stateValues.points.length;

          let instructions;

          if (Array.isArray(desiredStateVariableValues.endpoints)) {
            let pointsForEndpointsChild = desiredStateVariableValues.endpoints.slice(0, nEndpoints);

            instructions = [{
              setDependency: "endpointsChild",
              desiredValue: pointsForEndpointsChild,
              childIndex: 0,
              variableIndex: 0
            }]

          } else {
            let pointsForEndpointsChild = {}
            for (let i = 0; i < nEndpoints; i++) {
              if (i in desiredStateVariableValues.endpoints) {
                pointsForEndpointsChild[i] = desiredStateVariableValues.endpoints[i]
              }
            }

            instructions = [{
              setDependency: "endpointsChild",
              desiredValue: pointsForEndpointsChild,
              childIndex: 0,
              variableIndex: 0
            }]
          }

          if (nEndpoints < 2) {
            if ('1' in desiredStateVariableValues.endpoints) {
              instructions.push({
                setStateVariable: "endpoints",
                value: desiredStateVariableValues.endpoints[1],
                arrayKey: 1,
              });
            }
            if (nEndpoints < 1 && '0' in desiredStateVariableValues.endpoints) {
              instructions.push({
                setStateVariable: "endpoints",
                value: desiredStateVariableValues.endpoints[0],
                arrayKey: 0,
              });
            }
          }

          return {
            success: true,
            instructions
          }
        } else {

          // just have one arrayKey
          // so child variable of endpointsChild is an array entry (rather than array)

          let instructions;

          let coords = dependencyValues.endpointsChild[0].stateValues["point" + (arrayKey + 1)];

          if (coords === undefined) {
            instructions = [{
              setStateVariable: "endpoints",
              value: desiredStateVariableValues.endpoints[arrayKey],
              arrayKey
            }]
          } else {
            instructions = [{
              setDependency: "endpointsChild",
              desiredValue: desiredStateVariableValues.endpoints[arrayKey],
              childIndex: 0,
              variableIndex: 0,
            }]
          }

          return {
            success: true,
            instructions
          }

        }

      }
    }

    stateVariableDefinitions.nDimensions = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        endpoints: {
          dependencyType: "stateVariable",
          variableName: "endpoints"
        }
      }),
      definition: function ({ dependencyValues }) {

        // console.log('definition of nDimensions')
        // console.log(dependencyValues)


        if (dependencyValues.endpoints.length > 0) {
          let nDimensions = dependencyValues.endpoints[0].tree.length - 1;
          for (let i = 1; i < dependencyValues.endpoints.length; i++) {
            if (dependencyValues.endpoints[i].tree.length - 1 !== nDimensions) {
              console.warn("Can't have line segment through endpoints of differing dimensions");
              nDimensions = NaN;
            }
          }
          return {
            newValues: { nDimensions },
            checkForActualChange: { nDimensions: true }
          }
        } else {
          // line segment through zero endpoints
          return { newValues: { nDimensions: NaN } }
        }

      }
    }

    stateVariableDefinitions.numericalEndpoints = {
      isArray: true,
      entryPrefixes: ["numericalEndpoint"],
      forRenderer: true,
      returnDependencies: () => ({
        endpoints: {
          dependencyType: "stateVariable",
          variableName: "endpoints"
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        }
      }),
      definition: function ({ dependencyValues }) {
        if (Number.isNaN(dependencyValues.nDimensions)) {
          return { newValues: { numericalEndpoints: [] } }
        }

        let numericalEndpoints = [];
        for (let endpoint of dependencyValues.endpoints) {
          let numericalP = [];
          for (let ind = 0; ind < dependencyValues.nDimensions; ind++) {
            let val = endpoint.get_component(ind).evaluate_to_constant();
            if (!Number.isFinite(val)) {
              val = NaN;
            }
            numericalP.push(val);
          }
          numericalEndpoints.push(numericalP);
        }

        return { newValues: { numericalEndpoints } }
      }
    }



    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        endpointsChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneEndpoints"
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.endpointsChild.length === 1) {
          return {
            newValues: {
              childrenToRender: [dependencyValues.endpointsChild[0].componentName]
            }
          }
        } else {
          return { newValues: { childrenToRender: [] } }
        }
      }
    }


    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions"
        },
        endpoints: {
          dependencyType: "stateVariable",
          variableName: "endpoints"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          nearestPoint: function (variables) {

            // only implemented in 2D for now
            if (dependencyValues.nDimensions !== 2) {
              return {};
            }

            let A1 = dependencyValues.endpoints[0].get_component(0).evaluate_to_constant();
            let A2 = dependencyValues.endpoints[0].get_component(1).evaluate_to_constant();
            let B1 = dependencyValues.endpoints[1].get_component(0).evaluate_to_constant();
            let B2 = dependencyValues.endpoints[1].get_component(1).evaluate_to_constant();

            // only implement for constants
            if (!(Number.isFinite(A1) && Number.isFinite(A2) &&
              Number.isFinite(B1) && Number.isFinite(B2))) {
              return {};
            }

            let BA1 = B1 - A1;
            let BA2 = B2 - A2;
            let denom = (BA1 * BA1 + BA2 * BA2);

            if (denom === 0) {
              return {};
            }

            let t = ((variables.x1 - A1) * BA1 + (variables.x2 - A2) * BA2) / denom;

            let result = {};

            if (t <= 0) {
              result = { x1: A1, x2: A2 };
            } else if (t >= 1) {
              result = { x1: B1, x2: B2 };
            } else {
              result = {
                x1: A1 + t * BA1,
                x2: A2 + t * BA2,
              };
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


  moveLineSegment({ point1coords, point2coords }) {

    let newComponents = {};

    if (point1coords !== undefined) {
      newComponents[0] = me.fromAst(["vector", ...point1coords]);
    }
    if (point2coords !== undefined) {
      newComponents[1] = me.fromAst(["vector", ...point2coords]);
    }

    this.requestUpdate({
      updateInstructions: [{
        componentName: this.componentName,
        updateType: "updateValue",
        stateVariable: "endpoints",
        value: newComponents
      }]
    });

  }




  nearestPoint({ x1, x2, x3 }) {

    // only implemented in 2D for now
    if (this.state.ndimensions !== 2) {
      return;
    }

  }

}