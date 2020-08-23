import Polyline from '../Polyline';
import me from 'math-expressions';

export default class CobwebPolyline extends Polyline {
  static componentType = "cobwebpolyline";
  static rendererType = "cobwebpolyline";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.attractThreshold = { default: 0.5 };
    properties.nPoints = { default: 1, clamp: [0, Infinity], forRenderer: true };
    properties.variable = { default: me.fromAst('x'), forRenderer: true }
    return properties;
  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    let exactlyOneInitialPoint = childLogic.newLeaf({
      name: 'exactlyOneInitialPoint',
      componentType: "initialpoint",
      number: 1,
    });

    let exactlyOneFunction = childLogic.newLeaf({
      name: "exactlyOneFunction",
      componentType: "function",
      number: 1,
    });

    childLogic.newOperator({
      name: "initialPointAndFunction",
      operator: "and",
      propositions: [exactlyOneInitialPoint, exactlyOneFunction],
      setAsBase: true,
    })

    return childLogic;

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nDimensions.returnDependencies = () => ({});
    stateVariableDefinitions.nDimensions.definition = () => ({
      newValues: { nDimensions: 2 }
    })

    stateVariableDefinitions.initialPoint = {
      isArray: true,
      entryPrefixes: ["initialPointX"],
      returnWrappingComponents(prefix) {
        if (prefix === "initialPointX") {
          return [];
        } else {
          // entire array
          // wrap by both <point> and <xs>
          return [["point", "xs"]];
        }
      },
      returnArraySizeDependencies: () => ({}),
      returnArraySize: () => [2],
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            initialPointChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneInitialPoint",
              variableNames: ["x" + varEnding]
            }
          }
        }
        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let initialPoint = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          if (dependencyValuesByKey[arrayKey].initialPointChild.length === 1) {
            initialPoint[arrayKey] = dependencyValuesByKey[arrayKey].initialPointChild[0].stateValues["x" + varEnding];
          } else {
            // if child logic isn't satisfied, could be missing initial point child
            initialPoint[arrayKey] = 0;
          }
        }
        return { newValues: { initialPoint } }
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyValuesByKey, dependencyNamesByKey,
      }) {

        // console.log(`inverseArrayDefinition of initialPoint of polyline`);
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValuesByKey);

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.initialPoint) {

          if (dependencyValuesByKey[arrayKey].initialPointChild.length === 1
            && dependencyValuesByKey[arrayKey].initialPointChild[0].stateValues["x" + (Number(arrayKey) + 1)]
          ) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].initialPointChild,
              desiredValue: desiredStateVariableValues.initialPoint[arrayKey],
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

    stateVariableDefinitions.f = {
      forRenderer: true,
      returnDependencies: () => ({
        functionChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneFunction",
          variableNames: ["numericalf"]
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.functionChild.length === 1) {
          return { newValues: { f: dependencyValues.functionChild[0].stateValues.numericalf } }
        } else {
          return { newValues: { f: null } }
        }
      }
    }


    // since inherit from polyline, should have nVertices be number of vertices
    stateVariableDefinitions.nVertices = {
      isAlias: true,
      targetVariableName: "nPoints"
    };

    stateVariableDefinitions.nOriginalVertices = {
      providePreviousValuesInDefinition: true,
      returnDependencies: () => ({
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices"
        }
      }),
      definition({ dependencyValues, previousValues }) {
        let nOriginalVertices = dependencyValues.nVertices;

        if (previousValues.nOriginalVertices > nOriginalVertices) {
          nOriginalVertices = previousValues.nOriginalVertices
        }

        return { newValues: { nOriginalVertices } }
      }
    }

    stateVariableDefinitions.originalVertices = {
      essential: true,
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["originalVertexX", "originalVertex"],
      defaultEntryValue: me.fromAst(0),
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "originalVertexX") {
          // voriginalVertexX1_2 is the 2nd component of the first originalVertex
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
          // originalVertex3 is all components of the third riginalVertex
          if (!arraySize) {
            return [];
          }
          let vertexInd = Number(varEnding) - 1;
          if (Number.isInteger(vertexInd) && vertexInd >= 0 && vertexInd < arraySize[0]) {
            // array of "vertexInd,i", where i=0, ..., arraySize[1]-1
            return Array.from(Array(arraySize[1]), (_, i) => vertexInd + "," + i)
          } else {
            return [];
          }
        }

      },
      returnArraySizeDependencies: () => ({
        nOriginalVertices: {
          dependencyType: "stateVariable",
          variableName: "nOriginalVertices",
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nOriginalVertices - 1, dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey: () => ({}),
      arrayDefinitionByKey({ arrayKeys }) {
        let originalVertices = {};

        for (let arrayKey of arrayKeys) {
          let jointVarEnding = arrayKey.split(",").map(x => Number(x) + 1).join('_');

          originalVertices[arrayKey] = {
            variablesToCheck: ["originalVertex" + jointVarEnding]
          }
        }

        return {
          useEssentialOrDefaultValue: { originalVertices }
        }
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues }) {

        // console.log(`inverse definition of original vertices`)
        // console.log(desiredStateVariableValues)

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.originalVertices) {
          instructions.push({
            setStateVariable: "originalVertices",
            value: { [arrayKey]: desiredStateVariableValues.originalVertices[arrayKey] }
          })
        }

        return {
          success: true,
          instructions
        }

      }
    }

    stateVariableDefinitions.vertices.additionalStateVariablesDefined = [{
      variableName: "prelimCorrectVertices",
      entryPrefixes: ["prelimCorrectVertexX", "prelimCorrectVertex"],
      getArrayKeysFromVarName: function ({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "prelimCorrectVertexX") {
          // prelimCorrectVertexX1_2 is the 2nd component of the first prelimCorrectVertex
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
          // prelimCorrectVertex3 is all components of the third prelimCorrectVertex
          if (!arraySize) {
            return [];
          }
          let vertexInd = Number(varEnding) - 1;
          if (Number.isInteger(vertexInd) && vertexInd >= 0 && vertexInd < arraySize[0]) {
            // array of "vertexInd,i", where i=0, ..., arraySize[1]-1
            return Array.from(Array(arraySize[1]), (_, i) => vertexInd + "," + i)
          } else {
            return [];
          }
        }

      },
    }]

    stateVariableDefinitions.vertices.basedOnArrayKeyStateVariables = true;

    stateVariableDefinitions.vertices.returnArrayDependenciesByKey = function ({ arrayKeys }) {

      let globalDependencies = {
        f: {
          dependencyType: "stateVariable",
          variableName: "f"
        },
        attractThreshold: {
          dependencyType: "stateVariable",
          variableName: "attractThreshold"
        }
      }

      let dependenciesByKey = {};
      for (let arrayKey of arrayKeys) {
        let [pointInd, dim] = arrayKey.split(",");

        if (pointInd === "0") {
          dependenciesByKey[arrayKey] = {
            initialPoint: {
              dependencyType: "stateVariable",
              variableName: "initialPointX" + (Number(dim) + 1)
            },

          }
        } else {

          // use pointInd (rather than pointInd+1)
          // for both originalVertex (as it is missing first vertex)
          // and previousVertex
          dependenciesByKey[arrayKey] = {
            originalVertexX1: {
              dependencyType: "stateVariable",
              variableName: "originalVertexX" + pointInd + "_1"
            },
            originalVertexX2: {
              dependencyType: "stateVariable",
              variableName: "originalVertexX" + pointInd + "_2"
            },
            previousVertexX1: {
              dependencyType: "stateVariable",
              variableName: "vertexX" + pointInd + "_1"
            },
            previousVertexX2: {
              dependencyType: "stateVariable",
              variableName: "vertexX" + pointInd + "_2"
            }
          }
        }
      }
      return { globalDependencies, dependenciesByKey }
    }

    stateVariableDefinitions.vertices.arrayDefinitionByKey = function ({
      globalDependencyValues, dependencyValuesByKey, arrayKeys
    }) {

      // console.log(`array definition of vertices`);
      // console.log(JSON.parse(JSON.stringify(arrayKeys)))
      // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));
      // console.log(JSON.parse(JSON.stringify(globalDependencyValues)));

      let vertices = {};
      let prelimCorrectVertices = {};

      for (let arrayKey of arrayKeys) {
        let [pointInd, dim] = arrayKey.split(",");

        if (pointInd === "0") {
          vertices[arrayKey] = dependencyValuesByKey[arrayKey].initialPoint;
          prelimCorrectVertices[arrayKey] = null; // don't check if first vertex is correct
        } else {

          let originalVertex, previousVertex;

          try {
            originalVertex = [
              dependencyValuesByKey[arrayKey].originalVertexX1.evaluate_to_constant(),
              dependencyValuesByKey[arrayKey].originalVertexX2.evaluate_to_constant(),
            ];
            previousVertex = [
              dependencyValuesByKey[arrayKey].previousVertexX1.evaluate_to_constant(),
              dependencyValuesByKey[arrayKey].previousVertexX2.evaluate_to_constant()
            ];
          } catch (e) {
            vertices[pointInd + ",0"] = me.fromAst(0);
            vertices[pointInd + ",1"] = me.fromAst(0)
            prelimCorrectVertices[pointInd + ",0"] = false;
            continue;
          }

          let attractPoint;

          if (Number(pointInd) % 2 === 1) {
            // odd point number, so attract to function

            let newY = globalDependencyValues.f(previousVertex[0]);
            attractPoint = [previousVertex[0], newY];

          } else {
            // even point number, so attract to diagonal
            attractPoint = [previousVertex[1], previousVertex[1]]
          }

          let distance2FromAttractor = Math.pow(originalVertex[0] - attractPoint[0], 2)
            + Math.pow(originalVertex[1] - attractPoint[1], 2);

          if (distance2FromAttractor < globalDependencyValues.attractThreshold * globalDependencyValues.attractThreshold) {
            vertices[pointInd + ",0"] = me.fromAst(attractPoint[0]);
            vertices[pointInd + ",1"] = me.fromAst(attractPoint[1]);
            prelimCorrectVertices[pointInd + ",0"] = true;
          } else {
            vertices[pointInd + ",0"] = dependencyValuesByKey[arrayKey].originalVertexX1;
            vertices[pointInd + ",1"] = dependencyValuesByKey[arrayKey].originalVertexX2;
            prelimCorrectVertices[pointInd + ",0"] = false;
          }

          // don't use second coordinate of corrrectVertices,
          // as correctness is by vertex, not vertex coordinate
          // prelimCorrectVertices is 2D only so that can calculate it simulataneously
          // with vertices
          prelimCorrectVertices[pointInd + ",1"] = null;

        }
      }

      return { newValues: { vertices, prelimCorrectVertices } }
    }
    stateVariableDefinitions.vertices.inverseArrayDefinitionByKey = function ({
      desiredStateVariableValues,
      dependencyNamesByKey,
      initialChange, stateValues,
    }) {

      // console.log(`inverseArrayDefinition of vertices of polyline`);
      // console.log(desiredStateVariableValues)
      // console.log(JSON.parse(JSON.stringify(stateValues)))
      // console.log(dependencyValuesByKey);


      // if not draggable, then disallow initial change 
      if (initialChange && !stateValues.draggable) {
        return { success: false };
      }

      let instructions = [];
      for (let arrayKey in desiredStateVariableValues.vertices) {
        let [pointInd, dim] = arrayKey.split(",");

        if (pointInd === "0") {
          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey].initialPoint,
            desiredValue: desiredStateVariableValues.vertices[arrayKey],
          })
        } else {
          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey]["originalVertexX" + (Number(dim) + 1)],
            desiredValue: desiredStateVariableValues.vertices[arrayKey],
          })
        }

      }

      return {
        success: true,
        instructions
      }

    }

    stateVariableDefinitions.correctVertices = {
      isArray: true,
      public: true,
      componentType: "boolean",
      entryPrefixes: ["correctVertex"],
      returnArraySizeDependencies: () => ({
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nVertices - 1];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            prelimCorrectVertex: {
              dependencyType: "stateVariable",
              variableName: "prelimCorrectVertexX" + (Number(arrayKey) + 2) + "_1"
            }
          }
        }
        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let correctVertices = {};
        for (let arrayKey of arrayKeys) {
          correctVertices[arrayKey] = dependencyValuesByKey[arrayKey].prelimCorrectVertex;
        }
        return { newValues: { correctVertices } };
      }
    }


    stateVariableDefinitions.fractionCorrectVertices = {
      public: true,
      componentType: "number",
      additionalStateVariablesDefined: [{
        variableName: "nGradedVertices",
        public: true,
        componentType: "number"
      },
      {
        variableName: "nCorrectVertices",
        public: true,
        componentType: "number"
      }
      ],
      returnDependencies: () => ({
        correctVertices: {
          dependencyType: "stateVariable",
          variableName: "correctVertices"
        }
      }),
      definition({ dependencyValues }) {
        let nGradedVertices = dependencyValues.correctVertices.length
        let fractionCorrectVertices;
        let nCorrectVertices;

        if (nGradedVertices === 0) {
          fractionCorrectVertices = 0;
          nCorrectVertices = 0;
        } else {
          nCorrectVertices = dependencyValues.correctVertices
            .reduce((a, c) => a + c, 0);
          fractionCorrectVertices = nCorrectVertices / nGradedVertices;
        }

        return {
          newValues: {
            fractionCorrectVertices, nGradedVertices, nCorrectVertices
          }
        }
      }
    }

    stateVariableDefinitions.nIterateValues = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { nIterateValues: Math.ceil((dependencyValues.nVertices + 1) / 2) }
      })
    }

    stateVariableDefinitions.iterateValues = {
      isArray: true,
      public: true,
      componentType: "number",
      entryPrefixes: ["iterateValue"],
      returnArraySizeDependencies: () => ({
        nIterateValues: {
          dependencyType: "stateVariable",
          variableName: "nIterateValues"
        }
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nIterateValues];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          if (arrayKey === "0") {
            dependenciesByKey[arrayKey] = {
              iterateValue: {
                dependencyType: "stateVariable",
                variableName: "vertexX1_1"
              }
            }
          } else {
            dependenciesByKey[arrayKey] = {
              iterateValue: {
                dependencyType: "stateVariable",
                variableName: "vertexX" + (2 * Number(arrayKey)) + "_2"
              }
            }
          }
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let iterateValues = {};
        for (let arrayKey of arrayKeys) {
          iterateValues[arrayKey] = dependencyValuesByKey[arrayKey].iterateValue;
        }
        return { newValues: { iterateValues } };
      }
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { childrenToRender: [] } })
    }

    return stateVariableDefinitions;
  }


  updateState(args = {}) {

    super.updateState(args);

    if (args.init) {


      this.makePublicStateVariableArray({
        variableName: "iteratevalues",
        componentType: "number",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "iteratevalue",
        arrayVariableName: "iteratevalues",
      });
      this.makePublicStateVariableAlias({
        variableName: "lastvertex",
        targetName: "vertex",
        arrayIndex: '-1',
      })


      this.state.draggablePoints = [];
    }


    let initialPointChanged = false;

    if (childrenChanged || trackChanges.getVariableChanges({ component: this.state.initialPointChild, variable: "coords" })
      || trackChanges.getVariableChanges({ component: this, variable: "vertices", index: 0 })
    ) {
      this.state.initialPoint = this.state.initialPointChild.state.coords.copy();
      this.state.vertices[0] = this.state.initialPoint;
      initialPointChanged = true;
    }


    let nCurrentVertices = this.state.vertices.length;
    if (this.state.nPoints > nCurrentVertices) {
      let topAvailable = Math.min(this.state.nPoints, nCurrentVertices + this.state.removedVertices.length);
      if (topAvailable > nCurrentVertices) {
        this.state.vertices.push(...this.state.removedVertices.slice(0, topAvailable - nCurrentVertices));
        this.state.removedVertices = this.state.removedVertices.slice(topAvailable - nCurrentVertices);
        nCurrentVertices = topAvailable;
      }
      for (let ind = nCurrentVertices; ind < this.state.nPoints; ind++) {
        let newCoords = me.fromAst(["tuple", 0, 0]);
        this.state.vertices.push(newCoords);
      }
    } else if (this.state.nPoints < nCurrentVertices) {
      this.state.removedVertices = [...this.state.vertices.slice(this.state.nPoints), ...this.state.removedVertices];
      this.state.vertices.length = this.state.nPoints;
      this.state.correctvertices.length = this.state.nPoints - 1;
    }

    if (this.state.draggablePoints.length !== this.state.nPoints) {
      this.state.draggablePoints = new Array(this.state.nPoints).fill(false);
      if (this.state.nPoints > 1) {
        this.state.draggablePoints[this.state.nPoints - 1] = true;
      }
    }

    let pointsToAttract = [];

    if (initialPointChanged) {
      // if initial point changed, attract all points except first
      pointsToAttract = [...Array(this.state.nPoints).keys()].slice(1);
      this.state.correctvertices = [];
    } else if (this.state.nPoints > 1) {
      // attract just last point
      pointsToAttract = [this.state.nPoints - 1];
    }

    for (let pointInd of pointsToAttract) {

      let attractPoint;
      if (pointInd % 2 === 1) {
        // odd point number, so attract to function

        let prevVertex = this.state.vertices[pointInd - 1];
        let prevValue = this.findFiniteNumericalValue(prevVertex.get_component(0));
        let newValue = this.state.f(prevValue);
        attractPoint = [prevValue, newValue];

      } else {
        // even point number, so attract to diagonal
        let prevVertex = this.state.vertices[pointInd - 1];
        let prevValue = this.findFiniteNumericalValue(prevVertex.get_component(1));
        attractPoint = [prevValue, prevValue]
      }

      if (attractPoint !== undefined) {
        let thisVertex = this.state.vertices[pointInd];
        let x1 = this.findFiniteNumericalValue(thisVertex.get_component(0));
        let x2 = this.findFiniteNumericalValue(thisVertex.get_component(1));

        let distance2FromAttractor = Math.pow(x1 - attractPoint[0], 2) + Math.pow(x2 - attractPoint[1], 2);

        if (distance2FromAttractor < this.state.attractThreshold * this.state.attractThreshold) {
          this.state.vertices[pointInd] = me.fromAst(["tuple", ...attractPoint]);
          this.state.correctvertices[pointInd - 1] = true;
        } else {
          this.state.correctvertices[pointInd - 1] = false;
        }
      }
    }

    // get the y-values of the odd vertices
    this.state.iteratevalues = this.state.vertices
      .filter((v, i) => i % 2 === 1)
      .map(v => v.get_component(1).evaluate_to_constant())


  }


  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    if (this.unresolvedState.vertices === undefined) {
      const actions = {
        movePolyline: this.movePolyline,
      }
      this.renderer = new this.availableRenderers.polyline2d({
        key: this.componentName,
        actions: actions,
        label: this.state.label,
        draggable: false,
        layer: this.state.layer,
        visible: !this.state.hide,
        pointcoords: this.state.vertices.map(x =>
          [x.get_component(0).evaluate_to_constant(),
          x.get_component(1).evaluate_to_constant()]),
        color: this.state.selectedStyle.lineColor,
        width: this.state.selectedStyle.lineWidth,
        style: this.state.selectedStyle.lineStyle,
        pointColor: this.state.selectedStyle.markerColor,
        pointSize: this.state.selectedStyle.markerSize,
        pointStyle: this.state.selectedStyle.markerStyle,
      });
    }
  }

  updateRenderer() {
    this.renderer.updatePolyline({
      visible: !this.state.hide,
      pointcoords: this.state.vertices.map(x =>
        [x.get_component(0).evaluate_to_constant(),
        x.get_component(1).evaluate_to_constant()]),
    });
  }


  calculateDownstreamChanges({
    stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate
  }) {

    let newStateVariables = {};
    let verticesChanged = new Set([]);

    let newVertices = Array(this.state.nPoints);

    for (let varName in stateVariablesToUpdate) {
      if (varName === "vertices") {
        if (newStateVariables[varName] === undefined) {
          newStateVariables[varName] = {
            isArray: true,
            changes: { arrayComponents: {} }
          }
        }
        for (let ind in stateVariablesToUpdate[varName].changes.arrayComponents) {
          verticesChanged.add(Number(ind));
          newVertices[ind] = newStateVariables[varName].changes.arrayComponents[ind] =
            stateVariablesToUpdate[varName].changes.arrayComponents[ind];
        }
      }
    }

    // if changed vertex 0, change initial condition point
    if (verticesChanged.has(0)) {
      dependenciesToUpdate[this.state.initialPointChild.componentName] = {
        coords: { changes: newVertices[0] }
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
        !shadowedStateVariables.has(varname) && !isReplacement) {
        stateVariableChangesToSave[varname] = newStateVariables[varname];
      }
    }

    return true;

  }

}