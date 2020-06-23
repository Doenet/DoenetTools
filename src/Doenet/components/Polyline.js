import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';

export default class Polyline extends GraphicalComponent {
  static componentType = "polyline";

  actions = {
    movePolyline: this.movePolyline.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
  };

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["vertices", "nVertices"] };

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.draggable = { default: true, forRenderer: true };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let addVertices = function ({ activeChildrenMatched }) {
      // add <vertices> around points
      let verticesChildren = [];
      for (let child of activeChildrenMatched) {
        verticesChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "vertices", children: verticesChildren }],
      }
    }


    let atLeastOnePoint = childLogic.newLeaf({
      name: "atLeastOnePoint",
      componentType: 'point',
      comparison: 'atLeast',
      number: 1,
      isSugar: true,
      replacementFunction: addVertices,
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
      replacementFunction: addVertices,
    });

    let noPoints = childLogic.newLeaf({
      name: "noPoints",
      componentType: 'point',
      number: 0
    });

    let exactlyOneVertices = childLogic.newLeaf({
      name: "exactlyOneVertices",
      componentType: 'vertices',
      number: 1
    });

    childLogic.newOperator({
      name: "verticesXorSugar",
      operator: 'xor',
      propositions: [exactlyOneVertices, atLeastOnePoint, stringsAndMaths, noPoints],
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


        let styleDescription = "";
        if (dependencyValues.selectedStyle.lineWidth >= 4) {
          styleDescription += "thick ";
        } else if (dependencyValues.selectedStyle.lineWidth <= 1) {
          styleDescription += "thin ";
        }
        if (dependencyValues.selectedStyle.lineStyle === "dashed") {
          styleDescription += "dashed ";
        } else if (dependencyValues.selectedStyle.lineStyle === "dotted") {
          styleDescription += "dotted ";
        }

        styleDescription += `${dependencyValues.selectedStyle.lineColor} `;

        return { newValues: { styleDescription } };
      }
    }

    stateVariableDefinitions.vertices = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["vertex"],
      returnDependencies: function ({ arrayKeys }) {
        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }
        if (arrayKey === undefined) {
          return ({
            verticesChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneVertices",
              variableNames: ["points", "nPoints"]
            }
          })
        } else {
          return ({
            verticesChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneVertices",
              variableNames: ["point" + (arrayKey + 1), "nPoints"]
            }
          })
        }

      },
      markStale: function ({ freshnessInfo, changes, arrayKeys }) {

        let freshByKey = freshnessInfo.vertices.freshByKey;

        // console.log('markStale for polygon vertices')
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(JSON.parse(JSON.stringify(changes)))
        // console.log(arrayKeys);

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (changes.verticesChild) {


          if (changes.verticesChild.componentIdentitiesChanged) {

            // if verticesChild changed
            // then the entire vertices array of polyline is also changed
            for (let key in freshByKey) {
              delete freshByKey[key];
            }
          } else {

            let valuesChanged = changes.verticesChild.valuesChanged[0];

            if (arrayKey === undefined) {

              if (valuesChanged.points) {
                // if have the same points from verticesChild
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
            return { fresh: { vertices: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { vertices: true } }
          }
        } else {
          // asked for just one component
          return { fresh: { vertices: freshByKey[arrayKey] === true } }
        }

      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {
        let freshByKey = freshnessInfo.vertices.freshByKey;

        // console.log('definition of polyline vertices');
        // console.log(dependencyValues)
        // console.log(arrayKeys);
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(changes)

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (dependencyValues.verticesChild.length === 1) {

          if (arrayKey === undefined) {
            let vertexPoints = dependencyValues.verticesChild[0].stateValues.points;


            if (changes.verticesChild.componentIdentitiesChanged ||
              changes.verticesChild.valuesChanged[0].points.changed.changedEntireArray
            ) {
              // send array to indicate that should overwrite entire array
              for (let key in vertexPoints) {
                freshByKey[key] = true;
              }
              let result = {
                newValues: {
                  vertices: vertexPoints
                }
              }
              return result
            }

            let newVertexValues = {};
            for (let key in vertexPoints) {
              if (!freshByKey[key]) {
                freshByKey[key] = true;
                newVertexValues[key] = vertexPoints[key]
              }
            }
            let result = { newValues: { vertices: newVertexValues } };

            return result

          } else {
            // have an arrayKey defined

            if (!freshByKey[arrayKey]) {
              freshByKey[arrayKey] = true;
              let coords = dependencyValues.verticesChild[0].stateValues["point" + (arrayKey + 1)];

              return {
                newValues: {
                  vertices: {
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
          return { newValues: { vertices: [] } }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues,
        stateValues, initialChange, arrayKeys
      }) {

        // console.log(`inverseDefinition of vertices of polyline`);
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

        if (dependencyValues.verticesChild.length !== 1) {
          return { success: false }
        }


        if (arrayKey === undefined) {
          // working with entire array
          let nVertices = dependencyValues.verticesChild[0].stateValues.points.length;

          // let pointForVertexChild = desiredStateVariableValues.vertices.slice(0, nVertices);

          let instructions = [{
            setDependency: "verticesChild",
            desiredValue: desiredStateVariableValues.vertices,
            childIndex: 0,
            variableIndex: 0
          }]

          return {
            success: true,
            instructions
          }
        } else {

          // just have one arrayKey
          // so child variable of verticesChild is an array entry (rather than array)

          let instructions = [{
            setDependency: "verticesChild",
            desiredValue: desiredStateVariableValues.vertices[arrayKey],
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

    stateVariableDefinitions.nVertices = {
      public: true,
      componentType: "number",
      forRenderer: true,
      returnDependencies: () => ({
        verticesChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneVertices",
          variableNames: ["nPoints"]
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.verticesChild.length === 1) {
          return { newValues: { nVertices: dependencyValues.verticesChild[0].stateValues.nPoints } }
        } else {
          return { newValues: { nVertices: 0 } }
        }

      }
    }

    stateVariableDefinitions.nDimensions = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        vertices: {
          dependencyType: "stateVariable",
          variableName: "vertices"
        }
      }),
      definition: function ({ dependencyValues }) {

        // console.log('definition of nDimensions')
        // console.log(dependencyValues)

        if (dependencyValues.vertices.length > 0) {
          let nDimensions;
          if (dependencyValues.vertices[0].tree === undefined) {
            console.warn("Can't have polyline through undefined vertex");
            nDimensions = NaN;
          } else {
            nDimensions = dependencyValues.vertices[0].tree.length - 1;
            for (let i = 1; i < dependencyValues.vertices.length; i++) {
              if (dependencyValues.vertices[i].tree === undefined) {
                console.warn("Can't have polyline through undefined vertex");
                nDimensions = NaN;
                break;
              }
              if (dependencyValues.vertices[i].tree.length - 1 !== nDimensions) {
                console.warn("Can't have polyline through vertices of differing dimensions");
                nDimensions = NaN;
                break;
              }
            }
          }
          return {
            newValues: { nDimensions },
            checkForActualChange: { nDimensions: true }
          }
        } else {
          // polyline through zero vertices
          return { newValues: { nDimensions: NaN } }
        }

      }
    }


    stateVariableDefinitions.numericalVertices = {
      isArray: true,
      entryPrefixes: ["numericalVertex"],
      forRenderer: true,
      returnDependencies: () => ({
        vertices: {
          dependencyType: "stateVariable",
          variableName: "vertices"
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        }
      }),
      definition: function ({ dependencyValues }) {
        if (Number.isNaN(dependencyValues.nDimensions)) {
          return { newValues: { numericalVertices: [] } }
        }

        let numericalVertices = [];
        for (let vertex of dependencyValues.vertices) {
          let numericalP = [];
          for (let ind = 0; ind < dependencyValues.nDimensions; ind++) {
            let val = vertex.get_component(ind).evaluate_to_constant();
            if (!Number.isFinite(val)) {
              val = NaN;
            }
            numericalP.push(val);
          }
          numericalVertices.push(numericalP);
        }

        return { newValues: { numericalVertices } }
      }
    }


    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        verticesChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneVertices"
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.verticesChild.length === 1) {
          return {
            newValues: {
              childrenToRender: [dependencyValues.verticesChild[0].componentName]
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
        vertices: {
          dependencyType: "stateVariable",
          variableName: "vertices"
        },
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          nearestPoint: function (variables) {

            // only implemented in 2D for now
            if (dependencyValues.nDimensions !== 2 || dependencyValues.nVertices === 0) {
              return {};
            }

            let closestDistance2 = Infinity;
            let closestResult = {};

            let x1 = variables.x1.evaluate_to_constant();
            let x2 = variables.x2.evaluate_to_constant();

            let prevPtx, prevPty;
            let nextPtx = dependencyValues.vertices[0].get_component(0).evaluate_to_constant();
            let nextPty = dependencyValues.vertices[0].get_component(1).evaluate_to_constant();

            for (let i = 1; i < dependencyValues.nVertices; i++) {
              prevPtx = nextPtx;
              prevPty = nextPty;

              nextPtx = dependencyValues.vertices[i].get_component(0).evaluate_to_constant();
              nextPty = dependencyValues.vertices[i].get_component(1).evaluate_to_constant();

              // only implement for constants
              if (!(Number.isFinite(prevPtx) && Number.isFinite(prevPty) &&
                Number.isFinite(nextPtx) && Number.isFinite(nextPty))) {
                continue;
              }

              let BA1 = nextPtx - prevPtx;
              let BA2 = nextPty - prevPty;
              let denom = (BA1 * BA1 + BA2 * BA2);

              if (denom === 0) {
                continue;
              }

              let t = ((x1 - prevPtx) * BA1 + (x2 - prevPty) * BA2) / denom;

              let result;

              if (t <= 0) {
                result = { x1: prevPtx, x2: prevPty };
              } else if (t >= 1) {
                result = { x1: nextPtx, x2: nextPty };
              } else {
                result = {
                  x1: prevPtx + t * BA1,
                  x2: prevPty + t * BA2,
                };
              }

              let distance2 = Math.pow(x1 - result.x1, 2) + Math.pow(x2 - result.x2, 2);

              if (distance2 < closestDistance2) {
                closestDistance2 = distance2;
                closestResult = result;
              }

            }

            if (variables.x3 !== undefined && Object.keys(closestResult).length > 0) {
              closestResult.x3 = 0;
            }

            return closestResult;

          }
        }
      })
    }

    return stateVariableDefinitions;

  }


  movePolyline(pointcoordsObject) {
    let vertexComponents = {};
    for (let ind in pointcoordsObject) {
      vertexComponents[ind] = me.fromAst(["vector", ...pointcoordsObject[ind]])
    }

    this.requestUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "vertices",
        value: vertexComponents
      }]
    });

  }


}