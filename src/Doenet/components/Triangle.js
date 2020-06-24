import Polygon from './Polygon';
import me from 'math-expressions';

export default class Triangle extends Polygon {
  static componentType = "triangle";
  static rendererType = "polygon";


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.vertices.definition = function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {
      let freshByKey = freshnessInfo.vertices.freshByKey;

      // console.log('definition of triangle vertices');
      // console.log(dependencyValues)
      // console.log(arrayKeys);
      // console.log(JSON.parse(JSON.stringify(freshByKey)));
      // console.log(changes)

      let arrayKey;
      if (arrayKeys) {
        arrayKey = Number(arrayKeys[0]);
      }


      if (arrayKey === undefined) {
        let vertexPoints;
        if (dependencyValues.verticesChild.length === 1) {
          vertexPoints = dependencyValues.verticesChild[0].stateValues.points;
        } else {
          vertexPoints = [];
        }

        if (vertexPoints.length > 3) {
          console.warn('Extra vertices for triangle ignored');
          vertexPoints = vertexPoints.slice(0, 3);
        }

        let newVertexValues = {};
        for (let key in vertexPoints) {
          if (!freshByKey[key]) {
            freshByKey[key] = true;
            newVertexValues[key] = vertexPoints[key]
          }
        }

        if (vertexPoints.length === 3) {
          return {
            newValues: { vertices: newVertexValues }
          }
        }

        let useEssential = {};

        if (!freshByKey[2]) {
          freshByKey[2] = true;
          useEssential[2] = {
            variablesToCheck: ["vertex3"],
            defaultValue: me.fromAst(["vector", 0, 0])
          }
        }

        if (vertexPoints.length < 2) {

          if (!freshByKey[1]) {
            freshByKey[1] = true;
            useEssential[1] = {
              variablesToCheck: ["vertex2"],
              defaultValue: me.fromAst(["vector", 1, 0])
            }
          }

          if (vertexPoints.length === 0) {

            if (!freshByKey[0]) {
              freshByKey[0] = true;
              useEssential[0] = {
                variablesToCheck: ["vertex1"],
                defaultValue: me.fromAst(["vector", 0, 1])
              }
            }
          }
        }

        return {
          newValues: { vertices: newVertexValues },
          useEssentialOrDefaultValue: { vertices: useEssential }
        };

      } else {
        // have an arrayKey defined

        if (arrayKey > 2) {
          return {
            newValues: {
              vertices: {
                [arrayKey]: undefined
              }
            }
          }
        }

        if (!freshByKey[arrayKey]) {
          freshByKey[arrayKey] = true;
          let coords;
          if (dependencyValues.verticesChild.length === 1) {
            coords = dependencyValues.verticesChild[0].stateValues["point" + (arrayKey + 1)];
          }

          if (coords === undefined) {
            let defaultValue;
            if (arrayKey === 0) {
              defaultValue = me.fromAst(["vector", 0, 1]);
            } else if (arrayKey === 1) {
              defaultValue = me.fromAst(["vector", 1, 0]);
            } else {
              defaultValue = me.fromAst(["vector", 0, 0]);
            }
            return {
              useEssentialOrDefaultValue: {
                vertices: {
                  [arrayKey]: {
                    variablesToCheck: ["vertices" + (arrayKey + 1)],
                    defaultValue
                  }
                }
              }
            }
          } else {
            return {
              newValues: {
                vertices: {
                  [arrayKey]: coords
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

    }

    stateVariableDefinitions.vertices.inverseDefinition = function ({ desiredStateVariableValues, dependencyValues,
      stateValues, initialChange, arrayKeys, workspace,
    }) {

      // console.log(`inverseDefinition of vertices of triangle`);
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

      if (!workspace.desiredVertices) {
        workspace.desiredVertices = {};
      }

      if (arrayKey === undefined) {
        // working with entire array

        let instructions = [];

        let nVerticesSpecified = 0;
        if (dependencyValues.verticesChild.length === 1) {
          nVerticesSpecified = Math.min(3, dependencyValues.verticesChild[0].stateValues.nPoints);

          let verticesForVerticesChild;
          if (Array.isArray(desiredStateVariableValues)) {
            verticesForVerticesChild = desiredStateVariableValues.vertices.slice(0, nVerticesSpecified)
          } else {
            verticesForVerticesChild = {};
            for (let key in desiredStateVariableValues.vertices) {
              if (Number(key) < nVerticesSpecified) {
                verticesForVerticesChild[key] = desiredStateVariableValues.vertices[key]
              }
            }
            if (Object.keys(verticesForVerticesChild).length === 0) {
              verticesForVerticesChild = undefined;
            }
          }

          if (verticesForVerticesChild) {
            instructions.push({
              setDependency: "verticesChild",
              desiredValue: verticesForVerticesChild,
              childIndex: 0,
              variableIndex: 0
            })
          }
        }

        for (let ind = nVerticesSpecified; ind < 3; ind++) {
          if (desiredStateVariableValues.vertices[ind] !== undefined) {

            // Since we don't have a vertex child that will do the merge,
            // we must manually merge here.
            let desiredVertex = mergeVertex({
              workspaceVertices: workspace.desiredVertices[ind],
              currentVertexValue: stateValues.vertices[ind],
              desiredVertex: desiredStateVariableValues.vertices[ind],
            });

            workspace.desiredVertices[ind] = desiredVertex.tree;

            instructions.push({
              setStateVariable: "vertices",
              value: desiredVertex.simplify(),
              arrayKey: ind
            })
          }
        }

        return {
          success: true,
          instructions
        }
      } else {

        // just have one arrayKey
        if (arrayKey > 2) {
          return { success: false }
        }

        if (dependencyValues.verticesChild.length === 1) {
          // so child variable of verticesChild is an array entry (rather than array)
          let nVerticesSpecified = Math.min(3, dependencyValues.verticesChild[0].stateValues.nPoints);
          if (arrayKey < nVerticesSpecified) {
            return {
              success: true,
              instructions: [{
                setDependency: "verticesChild",
                desiredValue: desiredStateVariableValues.vertices[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              }]
            }

          }
        }


        // Since we don't have a vertex child that will do the merge,
        // we must manually merge here.
        let desiredVertex = mergeVertex({
          workspaceVertices: workspace.desiredVertices[arrayKey],
          currentVertexValue: stateValues.vertices[arrayKey],
          desiredVertex: desiredStateVariableValues.vertices[arrayKey],
        });

        workspace.desiredVertices[arrayKey] = desiredVertex.tree;

        return {
          success: true,
          instructions: [{
            setStateVariable: "vertices",
            value: desiredVertex.simplify(),
            arrayKey
          }]
        }

      }

    }


    stateVariableDefinitions.nVertices = {
      public: true,
      componentType: "number",
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { nVertices: 3 } })
    }


    return stateVariableDefinitions;
  }

}

function mergeVertex({
  workspaceVertices,
  currentVertexValue,
  desiredVertex,
}) {

  // If have any empty values in desired value,
  // merge with current values, or value from workspace

  let vertexAst;
  if (workspaceVertices) {
    // if have desired expresson from workspace, use that instead of currentValue
    vertexAst = workspaceVertices.slice(0);
  }
  else {
    vertexAst = currentVertexValue.tree.slice(0);
  }
  for (let [ind, value] of desiredVertex.tree.entries()) {
    if (value !== undefined) {
      vertexAst[ind] = value;
    }
  }

  return me.fromAst(vertexAst);
}
