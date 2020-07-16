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


    stateVariableDefinitions.vertices = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["vertex"],
      returnArraySizeDependencies: () => ({
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nVertices];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            verticesChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneVertices",
              variableNames: ["point" + (Number(arrayKey) + 1)]
            }
          }
        }
        return { dependenciesByKey };

      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        // console.log('array definition of polyline vertices');
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
        // console.log(arrayKeys);

        let vertices = {};

        for (let arrayKey of arrayKeys) {
          if (dependencyValuesByKey[arrayKey].verticesChild &&
            dependencyValuesByKey[arrayKey].verticesChild.length === 1
          ) {
            vertices[arrayKey] = dependencyValuesByKey[arrayKey].verticesChild[0].stateValues["point" + (Number(arrayKey) + 1)];
          } else {
            vertices[arrayKey] = me.fromAst('\uff3f')
          }
        }
        return { newValues: { vertices } }
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyValuesByKey, dependencyNamesByKey,
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
          if (dependencyValuesByKey[arrayKey].verticesChild.length === 1) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].verticesChild,
              desiredValue: desiredStateVariableValues.vertices[arrayKey],
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
      returnArraySizeDependencies: () => ({
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices",
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        }
      }),
      returnArraySize({ dependencyValues }) {
        if (Number.isNaN(dependencyValues.nDimensions)) {
          return [0];
        } else {
          return [dependencyValues.nVertices];
        }
      },
      returnArrayDependenciesByKey({ arrayKeys }) {

        let globalDependencies = {
          nDimensions: {
            dependencyType: "stateVariable",
            variableName: "nDimensions",
          }
        }

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            vertex: {
              dependencyType: "stateVariable",
              variableName: "vertex" + (Number(arrayKey) + 1)
            }
          }
        }

        return { globalDependencies, dependenciesByKey }
      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {
        if (Number.isNaN(globalDependencyValues.nDimensions)) {
          return { newValues: { numericalVertices: [] } }
        }

        let numericalVertices = {};

        for (let arrayKey of arrayKeys) {
          let vertex = dependencyValuesByKey[arrayKey].vertex;
          let numericalP = [];
          for (let ind = 0; ind < globalDependencyValues.nDimensions; ind++) {
            let val = vertex.get_component(ind).evaluate_to_constant();
            if (!Number.isFinite(val)) {
              val = NaN;
            }
            numericalP.push(val);
          }
          numericalVertices[arrayKey] = numericalP;
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