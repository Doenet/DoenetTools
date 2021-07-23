import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';

export default class Polyline extends GraphicalComponent {
  static componentType = "polyline";

  actions = {
    movePolyline: this.movePolyline.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
    finalizePolylinePosition: this.finalizePolylinePosition.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
  };

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["vertices", "nVertices"] };

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    attributes.vertices = {
      createComponentOfType: "_pointListComponent",
    }

    return attributes;
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

        styleDescription += dependencyValues.selectedStyle.lineColor;

        return { newValues: { styleDescription } };
      }
    }

    stateVariableDefinitions.nVertices = {
      public: true,
      componentType: "number",
      forRenderer: true,
      returnDependencies: () => ({
        vertices: {
          dependencyType: "attributeComponent",
          attributeName: "vertices",
          variableNames: ["nPoints"]
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.vertices !== null) {
          return { newValues: { nVertices: dependencyValues.vertices.stateValues.nPoints } }
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
          vertices: {
            dependencyType: "attributeComponent",
            attributeName: "vertices",
            variableNames: ["nDimensions"],
          }
        }
      },
      definition: function ({ dependencyValues }) {

        if (dependencyValues.vertices !== null) {
          let nDimensions = dependencyValues.vertices.stateValues.nDimensions;
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
          return [["point", { componentType: "mathList", isAttribute: "xs" }]];
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
      getAllArrayKeys(arraySize, flatten = true, desiredSize) {
        function getAllArrayKeysSub(subArraySize) {
          if (subArraySize.length === 1) {
            // array of numbers from 0 to subArraySize[0], cast to strings
            return Array.from(Array(subArraySize[0]), (_, i) => String(i));
          } else {
            let currentSize = subArraySize[0];
            let subSubKeys = getAllArrayKeysSub(subArraySize.slice(1));
            let subKeys = [];
            for (let ind = 0; ind < currentSize; ind++) {
              if (flatten) {
                subKeys.push(...subSubKeys.map(x => ind + "," + x))
              } else {
                subKeys.push(subSubKeys.map(x => ind + "," + x))
              }
            }
            return subKeys;
          }
        }

        if (desiredSize) {
          // if have desired size, then assume specify size after wrapping components
          // I.e., use actual array size, with first component
          // replaced with desired size
          if (desiredSize.length === 0 || !arraySize) {
            return [];
          } else {
            let desiredSizeOfWholeArray = [...arraySize];
            desiredSizeOfWholeArray[0] = desiredSize[0];
            return getAllArrayKeysSub(desiredSizeOfWholeArray);
          }
        } else if (!arraySize || arraySize.length === 0) {
          return [];
        } else {
          return getAllArrayKeysSub(arraySize);
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
            vertices: {
              dependencyType: "attributeComponent",
              attributeName: "vertices",
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

          let verticesAttr = dependencyValuesByKey[arrayKey].vertices;
          if (verticesAttr !== null
            && verticesAttr.stateValues["pointX" + varEnding]
          ) {
            vertices[arrayKey] = verticesAttr.stateValues["pointX" + varEnding];
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

          if (dependencyValuesByKey[arrayKey].vertices !== null
            && dependencyValuesByKey[arrayKey].vertices.stateValues["pointX" + varEnding]
          ) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].vertices,
              desiredValue: desiredStateVariableValues.vertices[arrayKey],
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
          if (!vert.every(x => Number.isFinite(x))) {
            vert = Array(vert.length).fill(NaN)
          }
          numericalVertices[arrayKey] = vert;
        }

        return { newValues: { numericalVertices } }
      }
    }

    stateVariableDefinitions.graphXmin = {
      forRenderer: true,
      additionalStateVariablesDefined: [{
        variableName: "graphXmax",
        forRenderer: true,
      }, {
        variableName: "graphYmin",
        forRenderer: true,
      }, {
        variableName: "graphYmax",
        forRenderer: true,
      }],
      returnDependencies: () => ({
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["xmin", "xmax", "ymin", "ymax"]
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.graphAncestor) {
          return {
            newValues: {
              graphXmin: dependencyValues.graphAncestor.stateValues.xmin,
              graphXmax: dependencyValues.graphAncestor.stateValues.xmax,
              graphYmin: dependencyValues.graphAncestor.stateValues.ymin,
              graphYmax: dependencyValues.graphAncestor.stateValues.ymax,
            }
          }
        } else {
          return {
            newValues: {
              graphXmin: null, graphXmax: null,
              graphYmin: null, graphYmax: null
            }
          }
        }
      }
    }

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions"
        },
        numericalVertices: {
          dependencyType: "stateVariable",
          variableName: "numericalVertices"
        },
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices"
        },
        graphXmin: {
          dependencyType: "stateVariable",
          variableName: "graphXmin"
        },
        graphXmax: {
          dependencyType: "stateVariable",
          variableName: "graphXmax"
        },
        graphYmin: {
          dependencyType: "stateVariable",
          variableName: "graphYmin"
        },
        graphYmax: {
          dependencyType: "stateVariable",
          variableName: "graphYmax"
        },
      }),
      definition({ dependencyValues }) {
        let nDimensions = dependencyValues.nDimensions;
        let nVertices = dependencyValues.nVertices;
        let numericalVertices = dependencyValues.numericalVertices;

        let xscale = 1, yscale = 1;
        if (dependencyValues.graphXmin !== null &&
          dependencyValues.graphXmax !== null &&
          dependencyValues.graphYmin !== null &&
          dependencyValues.graphYmax !== null
        ) {
          xscale = dependencyValues.graphXmax - dependencyValues.graphXmin;
          yscale = dependencyValues.graphYmax - dependencyValues.graphYmin;
        }


        let vals = [];
        let prPtx, prPty;
        let nxPtx = numericalVertices[0][0];
        let nxPty = numericalVertices[0][1];

        for (let i = 1; i < nVertices; i++) {
          prPtx = nxPtx;
          prPty = nxPty;

          nxPtx = numericalVertices[i][0];
          nxPty = numericalVertices[i][1];

          // only implement for constants
          if (!(Number.isFinite(prPtx) && Number.isFinite(prPty) &&
            Number.isFinite(nxPtx) && Number.isFinite(nxPty))) {
            vals.push(null);
          } else {

            let BA1 = (nxPtx - prPtx) / xscale;
            let BA2 = (nxPty - prPty) / yscale;
            let denom = (BA1 * BA1 + BA2 * BA2);

            if (denom === 0) {
              vals.push(null);
            } else {
              vals.push([BA1, BA2, denom]);
            }
          }
        }


        return {
          newValues: {
            nearestPoint: function (variables) {

              // only implemented in 2D for now
              if (nDimensions !== 2 || nVertices === 0) {
                return {};
              }

              let closestDistance2 = Infinity;
              let closestResult = {};

              let x1 = variables.x1.evaluate_to_constant();
              let x2 = variables.x2.evaluate_to_constant();

              let prevPtx, prevPty;
              let nextPtx = numericalVertices[0][0];
              let nextPty = numericalVertices[0][1];

              for (let i = 1; i < nVertices; i++) {
                prevPtx = nextPtx;
                prevPty = nextPty;

                nextPtx = numericalVertices[i][0];
                nextPty = numericalVertices[i][1];

                let val = vals[i - 1];
                if (val === null) {
                  continue;
                }

                let [BA1, BA2, denom] = val;


                let t = ((x1 - prevPtx) / xscale * BA1 + (x2 - prevPty) / yscale * BA2) / denom;

                let result;

                if (t <= 0) {
                  result = { x1: prevPtx, x2: prevPty };
                } else if (t >= 1) {
                  result = { x1: nextPtx, x2: nextPty };
                } else {
                  result = {
                    x1: prevPtx + t * BA1 * xscale,
                    x2: prevPty + t * BA2 * yscale,
                  };
                }

                let distance2 = Math.pow((x1 - result.x1) / xscale, 2)
                  + Math.pow((x2 - result.x2) / yscale, 2);

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
        }
      }
    }

    return stateVariableDefinitions;

  }


  movePolyline(pointcoordsObject, transient, sourceInformation) {

    let vertexComponents = {};
    for (let ind in pointcoordsObject) {
      vertexComponents[ind + ",0"] = me.fromAst(pointcoordsObject[ind][0]);
      vertexComponents[ind + ",1"] = me.fromAst(pointcoordsObject[ind][1]);
    }

    if (transient) {
      this.coreFunctions.requestUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "vertices",
          value: vertexComponents,
          sourceInformation
        }],
        transient,
      });
    } else {

      this.coreFunctions.requestUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "vertices",
          value: vertexComponents,
          sourceInformation
        }],
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            pointCoordinates: pointcoordsObject
          }
        },
      });
    }

  }

  finalizePolylinePosition() {
    // trigger a movePolyline 
    // to send the final values with transient=false
    // so that the final position will be recorded

    this.actions.movePolyline(
      this.stateValues.numericalVertices,
      false
    );
  }


}