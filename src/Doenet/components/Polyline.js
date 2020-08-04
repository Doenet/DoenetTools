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

    stateVariableDefinitions.nDimensions = {
      public: true,
      componentType: "number",
      returnDependencies() {
        return {
          verticesChild: {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneVertices",
            variableNames: ["nDimensions"],
          }
        }
      },
      definition: function ({ dependencyValues }) {

        if (dependencyValues.verticesChild.length === 1) {
          let nDimensions = dependencyValues.verticesChild[0].stateValues.nDimensions;
          return {
            newValues: { nDimensions },
            checkForActualChange: { nDimensions: true }
          }
        } else {
          // polyline through zero vertices
          return { newValues: { nDimensions: 2 } }
        }

      }
    }

    stateVariableDefinitions.vertices = {
      public: true,
      componentType: "math",
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["vertexX", "vertex"],
      returnWrappingComponents(prefix) {
        if (prefix === "vertexX") {
          return [];
        } else {
          // vertex or entire array
          // wrap inner dimension by both <point> and <xs>
          // don't wrap outer dimension (for entire array)
          return [["point", "xs"]];
        }
      },
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "vertexX") {
          // vertexX1_2 is the 2nd component of the first vertex
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
          // vertex3 is all components of the third vertex
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
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices",
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nVertices, dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = (Number(pointInd) + 1) + "_" + (Number(dim) + 1)

          dependenciesByKey[arrayKey] = {
            verticesChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneVertices",
              variableNames: ["pointX" + varEnding]
            }
          }
        }
        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        // console.log('array definition of polyline vertices');
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
        // console.log(arrayKeys);

        let vertices = {};

        for (let arrayKey of arrayKeys) {

          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = (Number(pointInd) + 1) + "_" + (Number(dim) + 1)

          let verticesChild = dependencyValuesByKey[arrayKey].verticesChild;
          if (verticesChild.length === 1
            && verticesChild[0].stateValues["pointX" + varEnding]
          ) {
            vertices[arrayKey] = verticesChild[0].stateValues["pointX" + varEnding];
          } else {
            vertices[arrayKey] = me.fromAst('\uff3f');
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
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = (Number(pointInd) + 1) + "_" + (Number(dim) + 1)

          if (dependencyValuesByKey[arrayKey].verticesChild.length === 1
            && dependencyValuesByKey[arrayKey].verticesChild[0].stateValues["pointX" + varEnding]
          ) {
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


    stateVariableDefinitions.numericalVertices = {
      isArray: true,
      entryPrefixes: ["numericalVertex"],
      forRenderer: true,
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
            vertex: {
              dependencyType: "stateVariable",
              variableName: "vertex" + (Number(arrayKey) + 1)
            }
          }
        }

        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        let numericalVertices = {};

        for (let arrayKey of arrayKeys) {
          let vert = dependencyValuesByKey[arrayKey].vertex.map(x => x.evaluate_to_constant())
          if(!vert.every(x => Number.isFinite(x))) {
            vert = Array(vert.length).fill(NaN)
          }
          numericalVertices[arrayKey] = vert;
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
            let nextPtx = dependencyValues.vertices[0][0].evaluate_to_constant();
            let nextPty = dependencyValues.vertices[0][1].evaluate_to_constant();

            for (let i = 1; i < dependencyValues.nVertices; i++) {
              prevPtx = nextPtx;
              prevPty = nextPty;

              nextPtx = dependencyValues.vertices[i][0].evaluate_to_constant();
              nextPty = dependencyValues.vertices[i][1].evaluate_to_constant();

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
      vertexComponents[ind + ",0"] = me.fromAst(pointcoordsObject[ind][0]);
      vertexComponents[ind + ",1"] = me.fromAst(pointcoordsObject[ind][1]);
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