import Polygon from './Polygon';
import me, { object } from "math-expressions";

export default class Rectangle extends Polygon {
  static componentType = "rectangle";
  static rendererType = "polygon";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneCenter = childLogic.newLeaf({
      name: "atMostOneCenter",
      componentType: 'center',
      comparison: 'atMost',
      number: 1,
    });

    let atMostOneWidth = childLogic.newLeaf({
      name: "atMostOneWidth",
      componentType: 'width',
      comparison: 'atMost',
      number: 1,
    });

    let atMostOneHeight = childLogic.newLeaf({
      name: "atMostOneHeight",
      componentType: 'height',
      comparison: 'atMost',
      number: 1,
    });

    childLogic.newOperator({
      name: "rectangleLogic",
      operator: "and",
      propositions: [atMostOneCenter, atMostOneWidth, atMostOneHeight, childLogic.baseLogic],
      setAsBase: true,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nVerticesSpecified = {

      returnDependencies: () => ({
        verticesChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneVertices",
          variableNames: ["nPoints"]
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.verticesChild.length === 1) {
          return { newValues: { nVerticesSpecified: dependencyValues.verticesChild[0].stateValues.nPoints } }
        } else {
          return { newValues: { nVerticesSpecified: 0 } }
        }

      }
    }

    stateVariableDefinitions.essentialVertex = {
      defaultValue: me.fromAst(["vector", 0, 0]),

      returnDependencies() {
        return {
          nVerticesSpecified: {
            dependencyType: "stateVariable",
            variableName: "nVerticesSpecified",
          }
        }
      },

      definition({ dependencyValues }) {
        if (dependencyValues.nVerticesSpecified === 0) {
          return { useEssentialOrDefaultValue: { essentialVertex: { variablesToCheck: ["essentialVertex"] } } };
        }
        return { newValues: { essentialVertex: null } }
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "essentialVertex",
            value: desiredStateVariableValues.essentialVertex
          }]
        }
      }
    }

    stateVariableDefinitions.specifiedCenter = {
      defaultValue: null,

      returnDependencies() {
        return {
          specifiedCenterChild: {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneCenter",
            variableNames: ["coords"],
          },
          nVerticesSpecified: {
            dependencyType: "stateVariable",
            variableName: "nVerticesSpecified",
          }
        }
      },

      definition({ dependencyValues }) {
        if (dependencyValues.specifiedCenterChild.length === 1) {
          return { newValues: { specifiedCenter: dependencyValues.specifiedCenterChild[0].stateValues.coords } };
        } else {
          return { useEssentialOrDefaultValue: { specifiedCenter: { variablesToCheck: ["center"] } } };
        }
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.specifiedCenterChild.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "specifiedCenterChild",
              desiredValue: desiredStateVariableValues.specifiedCenter,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setStateVariable: "specifiedCenter",
              value: desiredStateVariableValues.specifiedCenter
            }]
          }
        }
      }
    }

    stateVariableDefinitions.specifiedWidth = {
      defaultValue: 1,

      returnDependencies() {
        return {
          specifiedWidthChild: {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneWidth",
            variableNames: ["value"]
          },
          nVerticesSpecified: {
            dependencyType: "stateVariable",
            variableName: "nVerticesSpecified"
          },
          centerChild: {
            dependencyType: "childIdentity",
            childLogicName: "atMostOneCenter"
          }
        }
      },

      definition({ dependencyValues }) {
        if (dependencyValues.specifiedWidthChild.length === 1) {
          return { newValues: { specifiedWidth: dependencyValues.specifiedWidthChild[0].stateValues.value } };

        } else if (dependencyValues.centerChild.length + dependencyValues.nVerticesSpecified <= 1) {
          return { useEssentialOrDefaultValue: { specifiedWidth: { variablesToCheck: ["specifiedWidth"] } } };
        }
        return { newValues: { specifiedWidth: null } }
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.specifiedWidthChild.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "specifiedWidthChild",
              desiredValue: desiredStateVariableValues.specifiedWidth,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setStateVariable: "specifiedWidth",
              value: desiredStateVariableValues.specifiedWidth
            }]
          }
        }
      }
    }

    stateVariableDefinitions.specifiedHeight = {
      defaultValue: 1,

      returnDependencies() {
        return {
          specifiedHeightChild: {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneHeight",
            variableNames: ["value"],
          },
          nVerticesSpecified: {
            dependencyType: "stateVariable",
            variableName: "nVerticesSpecified"
          },
          centerChild: {
            dependencyType: "childIdentity",
            childLogicName: "atMostOneCenter"
          }
        }
      },

      definition({ dependencyValues }) {
        if (dependencyValues.specifiedHeightChild.length === 1) {
          return { newValues: { specifiedHeight: dependencyValues.specifiedHeightChild[0].stateValues.value } };

        } else if (dependencyValues.centerChild.length + dependencyValues.nVerticesSpecified <= 1) {
          return { useEssentialOrDefaultValue: { specifiedHeight: { variablesToCheck: ["specifiedHeight"] } } };
        }
        return { newValues: { specifiedHeight: null } }
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.specifiedHeightChild.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "specifiedHeightChild",
              desiredValue: desiredStateVariableValues.specifiedHeight,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setStateVariable: "specifiedHeight",
              value: desiredStateVariableValues.specifiedHeight
            }]
          }
        }
      }
    }

    stateVariableDefinitions.center = {
      public: true,
      componentType: "point",
      defaultValue: null,

      returnDependencies({ }) {
        return {
          vertices: {
            dependencyType: "stateVariable",
            variableName: "vertices",
          }
        }
      },

      definition({ dependencyValues }) {
        let v1x, v1y, v2x, v2y;

        v1x = getNumericalComponent(dependencyValues.vertices[0], 0);
        v1y = getNumericalComponent(dependencyValues.vertices[0], 1);
        v2x = getNumericalComponent(dependencyValues.vertices[2], 0);
        v2y = getNumericalComponent(dependencyValues.vertices[2], 1);

        let centerx = (v1x + v2x) / 2;
        let centery = (v1y + v2y) / 2;
        let center = me.fromAst(["vector", centerx, centery]);

        return { newValues: { center } };
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues }) {
        console.log("center inverse", desiredStateVariableValues, dependencyValues, stateValues);

        let v1x, v1y, v2x, v2y;

        v1x = getNumericalComponent(dependencyValues.vertices[0], 0);
        v1y = getNumericalComponent(dependencyValues.vertices[0], 1);
        v2x = getNumericalComponent(dependencyValues.vertices[2], 0);
        v2y = getNumericalComponent(dependencyValues.vertices[2], 1);

        let newCenterX = getNumericalComponent(desiredStateVariableValues.center, 0);
        let newCenterY = getNumericalComponent(desiredStateVariableValues.center, 1);

        let centerChangeX = newCenterX - getNumericalComponent(stateValues.center, 0);
        let centerChangeY = newCenterY - getNumericalComponent(stateValues.center, 1);

        let vertices = {
          0: me.fromAst(["vector", v1x + centerChangeX, v1y + centerChangeY]),
          2: me.fromAst(["vector", v2x + centerChangeX, v2y + centerChangeY])
        };

        console.log("new verts", vertices);

        return {
          success: true,
          instructions: [{
            setDependency: "vertices",
            desiredValue: vertices
          }]
        }
      }
    }

    stateVariableDefinitions.width = {
      public: true,
      componentType: "number",
      defaultValue: null,

      returnDependencies({ }) {
        return {
          vertices: {
            dependencyType: "stateVariable",
            variableName: "vertices",
          }
        }
      },

      definition({ dependencyValues }) {
        let v0x, v2x;

        v0x = getNumericalComponent(dependencyValues.vertices[0], 0);
        v2x = getNumericalComponent(dependencyValues.vertices[2], 0);

        let width = Math.abs(v0x - v2x);

        return { newValues: { width } };
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues }) {
        let v0x, v2x;

        v0x = getNumericalComponent(dependencyValues.vertices[0], 0);
        v2x = getNumericalComponent(dependencyValues.vertices[2], 0);

        let widthSign = Math.sign(v2x - v0x);

        let desiredV2x = v0x + widthSign * desiredStateVariableValues.width;
        let desiredV2 = me.fromAst(["vector", desiredV2x, undefined]);

        return {
          success: true,
          instructions: [{
            setDependency: "vertices",
            desiredValue: { 2: desiredV2 }
          }]
        }

        // if (stateValues.nVertices === 0 && stateValues.specifiedCenter !== null) {

        // } else {

        // }
      }
    }

    stateVariableDefinitions.height = {
      public: true,
      componentType: "number",
      defaultValue: null,

      returnDependencies({ }) {
        return {
          vertices: {
            dependencyType: "stateVariable",
            variableName: "vertices",
          }
        }
      },

      definition({ dependencyValues }) {
        let v0y, v2y;

        v0y = getNumericalComponent(dependencyValues.vertices[0], 1);
        v2y = getNumericalComponent(dependencyValues.vertices[2], 1);

        let height = Math.abs(v0y - v2y);

        return { newValues: { height } };
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        return { success: false };
      }
    }

    stateVariableDefinitions.vertices = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["vertex"],
      stateVariablesDeterminingDependencies: [
        "nVerticesSpecified",
        "specifiedCenter",
        "specifiedWidth",
        "specifiedHeight"
      ],

      returnDependencies: function ({ arrayKeys, stateValues }) {
        if (stateValues.nVerticesSpecified === 0) {
          // center, width and height
          return {
            nVerticesSpecified: {
              dependencyType: "stateVariable",
              variableName: "nVerticesSpecified",
            },
            specifiedCenter: {
              dependencyType: "stateVariable",
              variableName: "specifiedCenter",
            },
            specifiedWidth: {
              dependencyType: "stateVariable",
              variableName: "specifiedWidth",
            },
            specifiedHeight: {
              dependencyType: "stateVariable",
              variableName: "specifiedHeight",
            },
            essentialVertex: {
              dependencyType: "stateVariable",
              variableName: "essentialVertex",
            }
          };
        } else if (stateValues.nVerticesSpecified === 1) {
          if (stateValues.specifiedWidth != null && stateValues.specifiedHeight != null) {
            // 1 point, width and height
            return {
              nVerticesSpecified: {
                dependencyType: "stateVariable",
                variableName: "nVerticesSpecified",
              },
              verticesChild: {
                dependencyType: "childStateVariables",
                childLogicName: "exactlyOneVertices",
                variableNames: ["points", "nPoints"],
              },
              specifiedWidth: {
                dependencyType: "stateVariable",
                variableName: "specifiedWidth",
              },
              specifiedHeight: {
                dependencyType: "stateVariable",
                variableName: "specifiedHeight",
              }
            };
          } else {
            // 1 point, center
            return {
              nVerticesSpecified: {
                dependencyType: "stateVariable",
                variableName: "nVerticesSpecified",
              },
              verticesChild: {
                dependencyType: "childStateVariables",
                childLogicName: "exactlyOneVertices",
                variableNames: ["points", "nPoints"],
              },
              specifiedCenter: {
                dependencyType: "stateVariable",
                variableName: "specifiedCenter",
              },
              specifiedWidth: {
                dependencyType: "stateVariable",
                variableName: "specifiedWidth",
              },
              specifiedHeight: {
                dependencyType: "stateVariable",
                variableName: "specifiedHeight",
              }
            };
          }
        } else {
          // 2 points
          return {
            nVerticesSpecified: {
              dependencyType: "stateVariable",
              variableName: "nVerticesSpecified",
            },
            verticesChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneVertices",
              variableNames: ["points", "nPoints"],
            }
          }
        }
      },
      definition: function ({ dependencyValues, arrayKeys }) {
        let centerSpecified = (dependencyValues.specifiedCenter != null);
        let widthSpecified = (dependencyValues.specifiedWidth != null);
        let heightSpecified = (dependencyValues.specifiedHeight != null);

        console.log("definition of vertices", dependencyValues);
        let v0x, v0y, v2x, v2y;

        if (dependencyValues.nVerticesSpecified === 0) {
          // maybe center, width and height

          let width = dependencyValues.specifiedWidth;

          let height = dependencyValues.specifiedHeight;

          if (centerSpecified) {
            let center = dependencyValues.specifiedCenter;
            let centerx = getNumericalComponent(center, 0);
            let centery = getNumericalComponent(center, 1);

            v0x = centerx - width / 2;
            v0y = centery - height / 2;
            v2x = centerx + width / 2;
            v2y = centery + height / 2;

          }
          else {
            // no center

            v0x = getNumericalComponent(dependencyValues.essentialVertex, 0);
            v0y = getNumericalComponent(dependencyValues.essentialVertex, 1);
            v2x = v0x + width;
            v2y = v0y + height;
          }
        } else if (dependencyValues.nVerticesSpecified === 1) {
          if (widthSpecified || heightSpecified) {
            // 1 point, width and height

            let point = dependencyValues.verticesChild[0].stateValues.points[0];
            let pointx = getNumericalComponent(point, 0);
            let pointy = getNumericalComponent(point, 1);

            let width = dependencyValues.specifiedWidth;
            let height = dependencyValues.specifiedHeight;

            v0x = pointx;
            v0y = pointy;
            v2x = pointx + width;
            v2y = pointy + height;

          } else {
            // 1 point, center

            let point = dependencyValues.verticesChild[0].stateValues.points[0];
            let pointx = getNumericalComponent(point, 0);
            let pointy = getNumericalComponent(point, 1);

            let center = dependencyValues.specifiedCenter;
            let centerx = getNumericalComponent(center, 0);
            let centery = getNumericalComponent(center, 1);

            v0x = pointx;
            v0y = pointy;
            v2x = pointx + 2 * (centerx - pointx);
            v2y = pointy + 2 * (centery - pointy);

          }
        } else {
          // 2 points

          let point0 = dependencyValues.verticesChild[0].stateValues.points[0];
          let point1 = dependencyValues.verticesChild[0].stateValues.points[1];

          console.log("2 points", point0, point0);

          v0x = getNumericalComponent(point0, 0);
          v0y = getNumericalComponent(point0, 1);
          v2x = getNumericalComponent(point1, 0);
          v2y = getNumericalComponent(point1, 1);
        }

        console.log("v1", v2x, v2y, "v2", v0x, v0y);

        let vertices = [
          me.fromAst(["vector", v0x, v0y]),
          me.fromAst(["vector", v2x, v0y]),
          me.fromAst(["vector", v2x, v2y]),
          me.fromAst(["vector", v0x, v2y])
        ];

        return { newValues: { vertices } };
      },

      inverseDefinition: function ({
        desiredStateVariableValues, dependencyValues, stateValues, workspace
      }) {
        console.log("inverse definition of vertices of rectangle");
        console.log(desiredStateVariableValues, dependencyValues, stateValues);

        if (!workspace.desiredVertices) {
          workspace.desiredVertices = {};
        }

        Object.assign(workspace.desiredVertices, desiredStateVariableValues.vertices);
        for (let i in workspace.desiredVertices) {
          if (!["0", "1", "2", "3"].includes(i)) {
            delete workspace.desiredVertices[i];
          }
        }

        let vertexInd, oppositeInd;
        let v0x, v0y, v2x, v2y;

        if (Object.keys(workspace.desiredVertices).length === 1) {

          vertexInd = Number(Object.keys(workspace.desiredVertices)[0]);
          oppositeInd = (vertexInd + 2) % 4;

          v0x = workspace.desiredVertices[vertexInd].get_component(0);
          v0y = workspace.desiredVertices[vertexInd].get_component(1);

          v2x = stateValues.vertices[oppositeInd].get_component(0);
          v2y = stateValues.vertices[oppositeInd].get_component(1);

        } else if (Object.keys(workspace.desiredVertices).length === 4) {
          //if 4 points are given, use 2 to make the rectangle
          vertexInd = 0;
          oppositeInd = 2;

          v0x = workspace.desiredVertices[vertexInd].get_component(0);
          v0y = workspace.desiredVertices[vertexInd].get_component(1);

          v2x = workspace.desiredVertices[oppositeInd].get_component(0);
          v2y = workspace.desiredVertices[oppositeInd].get_component(1);

        } else if (Object.keys(workspace.desiredVertices).length === 3) {

          if ("0" in workspace.desiredVertices && "2" in workspace.desiredVertices) {
            vertexInd = 0;
            oppositeInd = 2;
          } else {
            vertexInd = 1;
            oppositeInd = 3;
          }

          v0x = workspace.desiredVertices[vertexInd].get_component(0);
          v0y = workspace.desiredVertices[vertexInd].get_component(1);

          v2x = workspace.desiredVertices[oppositeInd].get_component(0);
          v2y = workspace.desiredVertices[oppositeInd].get_component(1);
        } else {
          // 2 points
          let changedVerts = Object.keys(workspace.desiredVertices).map(x => Number(x)).sort();

          vertexInd = changedVerts[0];
          oppositeInd = (vertexInd + 2) % 4;

          console.log("inds: ", vertexInd, oppositeInd);

          if (oppositeInd === changedVerts[1]) {
            // opposite vertices
            v0x = workspace.desiredVertices[vertexInd].get_component(0);
            v0y = workspace.desiredVertices[vertexInd].get_component(1);

            v2x = workspace.desiredVertices[oppositeInd].get_component(0);
            v2y = workspace.desiredVertices[oppositeInd].get_component(1);
          } else {
            // adjacent vertices - one side

            if (changedVerts[0] === 1) {
              // 1, 2 - right
              v2x = stateValues.vertices[oppositeInd].get_component(0);
              v2y = workspace.desiredVertices[changedVerts[1]].get_component(1);

            } else if (changedVerts[0] === 2) {
              // 2, 3 - top
              v2x = workspace.desiredVertices[changedVerts[1]].get_component(0);
              v2y = stateValues.vertices[oppositeInd].get_component(1);

            } else if (changedVerts[1] === 1) {
              console.log("i hope this code is running");
              // 0, 1 - bottom
              v2x = workspace.desiredVertices[changedVerts[1]].get_component(0);
              v2y = stateValues.vertices[oppositeInd].get_component(1);

            } else {
              // 0, 3 - left
              vertexInd = 3;
              oppositeInd = 1;

              v2x = stateValues.vertices[oppositeInd].get_component(0);
              v2y = workspace.desiredVertices[0].get_component(1);
            }

            v0x = workspace.desiredVertices[vertexInd].get_component(0);
            v0y = workspace.desiredVertices[vertexInd].get_component(1);
          }
        }

        if (vertexInd === 2 || vertexInd === 3) {
          let tmpy = v0y;
          v0y = v2y;
          v2y = tmpy;
        }
        if (vertexInd === 1 || vertexInd === 2) {
          let tmpx = v0x;
          v0x = v2x;
          v2x = tmpx;
        }

        if (stateValues.nVerticesSpecified === 0) {
          let width = v2x.subtract(v0x).evaluate_to_constant();
          let height = v2y.subtract(v0y).evaluate_to_constant();

          if (stateValues.specifiedCenter != null) {
            // center, width and height

            let centerx = v0x.add(v2x).divide(2);
            let centery = v0y.add(v2y).divide(2);
            let center = me.fromAst(["vector", centerx.tree, centery.tree]).simplify();

            return {
              success: true,
              instructions: [{
                setDependency: "specifiedCenter",
                desiredValue: center,
              }, {
                setDependency: "specifiedWidth",
                desiredValue: width,
              }, {
                setDependency: "specifiedHeight",
                desiredValue: height
              }]
            };
          } else {
            // no center

            let v0coords = me.fromAst(["vector", v0x, v0y]);

            console.log("no center", v0coords, width, height);

            return {
              success: true,
              instructions: [{
                setDependency: "essentialVertex",
                desiredValue: v0coords,
              }, {
                setDependency: "specifiedWidth",
                desiredValue: width,
              }, {
                setDependency: "specifiedHeight",
                desiredValue: height
              }]
            };
          }
        } else if (stateValues.nVerticesSpecified === 1) {
          if (stateValues.specifiedWidth != null && stateValues.specifiedHeight != null) {
            // 1 point, width and height

            let points = [me.fromAst(["vector", v0x, v0y])];

            let width = v2x.subtract(v0x).evaluate_to_constant();
            let height = v2y.subtract(v0y).evaluate_to_constant();

            return {
              success: true,
              instructions: [{
                setDependency: "verticesChild",
                variableIndex: 0,
                childIndex: 0,
                desiredValue: points,
              }, {
                setDependency: "specifiedWidth",
                desiredValue: width,
              }, {
                setDependency: "specifiedHeight",
                desiredValue: height
              }]
            };
          } else {
            if (dependencyValues.specifiedCenter != null) {
              // 1 point, center

              let points = [me.fromAst(["vector", v0x, v0y])];

              let centerx = v0x.add(v2x).divide(2);
              let centery = v0y.add(v2y).divide(2);
              let center = me.fromAst(["vector", centerx.tree, centery.tree]).simplify();

              return {
                success: true,
                instructions: [{
                  setDependency: "verticesChild",
                  variableIndex: 0,
                  childIndex: 0,
                  desiredValue: points,
                }, {
                  setDependency: "specifiedCenter",
                  desiredValue: center,
                }]
              };
            }
          }
        } else {
          // 2 points

          let points = [
            me.fromAst(["vector", v0x, v0y]),
            me.fromAst(["vector", v2x, v2y])
          ];

          return {
            success: true,
            instructions: [{
              setDependency: "verticesChild",
              variableIndex: 0,
              childIndex: 0,
              desiredValue: points,
            }]
          };
        }
        return { success: false };
      }
    }

    stateVariableDefinitions.nVertices = {
      public: true,
      componentType: "number",
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { nVertices: 4 } })
    }

    return stateVariableDefinitions;
  }

}

function getNumericalComponent(expression, ind) {
  try {
    return expression.get_component(ind).evaluate_to_constant();
  } catch (e) {
    return "\uff3f";
  }
}