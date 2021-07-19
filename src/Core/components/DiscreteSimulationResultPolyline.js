import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';

export default class DiscreteSimulationResultPolyline extends GraphicalComponent {
  static componentType = "discreteSimulationResultPolyline";
  static rendererType = "polyline";

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

    attributes.allIterates = {
      createComponentOfType: "mathList",
      createStateVariable: "allIterates",
      defaultValue: [],
    }

    attributes.seriesNumber = {
      createComponentOfType: "number",
      createStateVariable: "seriesNumber",
      defaultValue: 1,
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
        allIterates: {
          dependencyType: "stateVariable",
          variableName: "allIterates",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { nVertices: dependencyValues.allIterates.length } }

      }
    }

    stateVariableDefinitions.nDimensions = {
      public: true,
      componentType: "number",
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: function ({ dependencyValues }) {
        return { newValues: { nDimensions: 2 } }

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
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nVertices, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          seriesNumber: {
            dependencyType: "stateVariable",
            variableName: "seriesNumber",
          },
          allIterates: {
            dependencyType: "stateVariable",
            variableName: "allIterates",
          },
        }
        return { globalDependencies }
      },
      arrayDefinitionByKey({ globalDependencyValues, arraySize }) {

        // console.log('array definition of polyline vertices');
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
        // console.log(arrayKeys);

        let vertices = {};

        for (let ind = 0; ind < arraySize[0]; ind++) {
          vertices[`${ind},0`] = me.fromAst(ind);
          vertices[`${ind},1`] = globalDependencyValues.allIterates[ind].get_component(globalDependencyValues.seriesNumber - 1)
        }

        return { newValues: { vertices } }
      },

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