import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';

export default class Polyline extends GraphicalComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      movePolyline: this.movePolyline.bind(this),
      finalizePolylinePosition: this.finalizePolylinePosition.bind(this),
      polylineClicked: this.polylineClicked.bind(this),
      mouseDownOnPolyline: this.mouseDownOnPolyline.bind(this),
    });

  }
  static componentType = "polyline";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    attributes.verticesDraggable = {
      createComponentOfType: "boolean",
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
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
      }),
      definition: function ({ dependencyValues }) {

        let styleDescription = dependencyValues.selectedStyle.lineWidthWord;
        if (dependencyValues.selectedStyle.lineStyleWord) {
          if (styleDescription) {
            styleDescription += " ";
          }
          styleDescription += dependencyValues.selectedStyle.lineStyleWord;
        }

        if (styleDescription) {
          styleDescription += " ";
        }

        styleDescription += dependencyValues.selectedStyle.lineColorWord

        return { setValue: { styleDescription } };
      }
    }

    stateVariableDefinitions.styleDescriptionWithNoun = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        styleDescription: {
          dependencyType: "stateVariable",
          variableName: "styleDescription",
        },
      }),
      definition: function ({ dependencyValues }) {

        let styleDescriptionWithNoun = dependencyValues.styleDescription + " polyline";

        return { setValue: { styleDescriptionWithNoun } };
      }
    }

    stateVariableDefinitions.verticesDraggable = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean"
      },
      hasEssential: true,
      forRenderer: true,
      returnDependencies: () => ({
        verticesDraggableAttr: {
          dependencyType: "attributeComponent",
          attributeName: "verticesDraggable",
          variableNames: ["value"]
        },
        draggable: {
          dependencyType: "stateVariable",
          variableName: "draggable"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.verticesDraggableAttr) {
          return {
            setValue: { verticesDraggable: dependencyValues.verticesDraggableAttr.stateValues.value }
          }
        } else {
          return {
            useEssentialOrDefaultValue: {
              verticesDraggable: { defaultValue: dependencyValues.draggable }
            }
          }
        }
      }
    }


    stateVariableDefinitions.nVertices = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
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
          return { setValue: { nVertices: dependencyValues.vertices.stateValues.nPoints } }
        } else {
          return { setValue: { nVertices: 0 } }
        }

      }
    }

    stateVariableDefinitions.nDimensions = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
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
            setValue: { nDimensions },
            checkForActualChange: { nDimensions: true }
          }
        } else {
          // polyline through zero vertices
          return { setValue: { nDimensions: 2 } }
        }

      }
    }

    stateVariableDefinitions.vertices = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
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
      },
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["vertexX", "vertex"],
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
              // If not given the array size,
              // then return the array keys assuming the array is large enough.
              // Must do this as it is used to determine potential array entries.
              return [String(indices)];
            }
          } else {
            return [];
          }
        } else {
          // vertex3 is all components of the third vertex

          let pointInd = Number(varEnding) - 1;
          if (!(Number.isInteger(pointInd) && pointInd >= 0)) {
            return [];
          }

          if (!arraySize) {
            // If don't have array size, we just need to determine if it is a potential entry.
            // Return the first entry assuming array is large enough
            return [pointInd + ",0"];
          }
          if (pointInd < arraySize[0]) {
            // array of "pointInd,i", where i=0, ..., arraySize[1]-1
            return Array.from(Array(arraySize[1]), (_, i) => pointInd + "," + i)
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
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "vertices") {
          if (propIndex.length === 1) {
            return "vertex" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `vertexX${propIndex[0]}_${propIndex[1]}`
          }
        }
        if (varName.slice(0, 6) === "vertex") {
          // could be vertex or vertexX
          let vertexNum = Number(varName.slice(6));
          if (Number.isInteger(vertexNum) && vertexNum > 0) {
            // if propIndex has additional entries, ignore them
            return `vertexX${vertexNum}_${propIndex[0]}`
          }
        }
        return null;
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

        return { setValue: { vertices } }
      },
      async inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyValuesByKey, dependencyNamesByKey,
        initialChange, stateValues,
      }) {

        // console.log(`inverseArrayDefinition of vertices of polyline`);
        // console.log(desiredStateVariableValues)
        // console.log(JSON.parse(JSON.stringify(stateValues)))
        // console.log(dependencyValuesByKey);


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

        return { setValue: { numericalVertices } }
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
      }),
      definition({ dependencyValues }) {
        let nDimensions = dependencyValues.nDimensions;
        let nVertices = dependencyValues.nVertices;
        let numericalVertices = dependencyValues.numericalVertices;

        let vals = [];
        let prPtx, prPty;
        let nxPtx = numericalVertices[0]?.[0];
        let nxPty = numericalVertices[0]?.[1];

        for (let i = 1; i < nVertices; i++) {
          prPtx = nxPtx;
          prPty = nxPty;

          nxPtx = numericalVertices[i]?.[0];
          nxPty = numericalVertices[i]?.[1];

          // only implement for constants
          if (!(Number.isFinite(prPtx) && Number.isFinite(prPty) &&
            Number.isFinite(nxPtx) && Number.isFinite(nxPty))) {
            vals.push(null);
          } else {

            let BA1sub = (nxPtx - prPtx);
            let BA2sub = (nxPty - prPty);

            if (BA1sub === 0 && BA2sub === 0) {
              vals.push(null);
            } else {
              vals.push([BA1sub, BA2sub]);
            }
          }
        }


        return {
          setValue: {
            nearestPoint: function ({ variables, scales }) {

              let xscale = scales[0];
              let yscale = scales[1];

              // only implemented in 2D for now
              if (nDimensions !== 2 || nVertices === 0) {
                return {};
              }

              let closestDistance2 = Infinity;
              let closestResult = {};

              let x1 = variables.x1?.evaluate_to_constant();
              let x2 = variables.x2?.evaluate_to_constant();

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

                let BA1 = val[0] / xscale;
                let BA2 = val[1] / yscale;
                let denom = (BA1 * BA1 + BA2 * BA2);


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


  async movePolyline({ pointCoords, transient, sourceDetails, actionId,
    sourceInformation = {}, skipRendererUpdate = false,
  }) {

    let nVerticesMoved = Object.keys(pointCoords).length;

    if (nVerticesMoved === 1) {
      // single vertex dragged
      if (!await this.stateValues.verticesDraggable) {
        return await this.coreFunctions.resolveAction({ actionId });
      }
    } else {
      // whole polyline dragged
      if (!await this.stateValues.draggable) {
        return await this.coreFunctions.resolveAction({ actionId });
      }
    }

    let vertexComponents = {};
    for (let ind in pointCoords) {
      vertexComponents[ind + ",0"] = me.fromAst(pointCoords[ind][0]);
      vertexComponents[ind + ",1"] = me.fromAst(pointCoords[ind][1]);
    }

    if (transient) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "vertices",
          value: vertexComponents,
          sourceDetails
        }],
        transient,
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    } else {

      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "vertices",
          value: vertexComponents,
          sourceDetails
        }],
        actionId,
        sourceInformation,
        skipRendererUpdate,
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            pointCoordinates: pointCoords
          }
        },
      });
    }

  }

  async finalizePolylinePosition({ actionId, sourceInformation = {}, skipRendererUpdate = false }) {
    // trigger a movePolyline 
    // to send the final values with transient=false
    // so that the final position will be recorded

    return await this.actions.movePolyline({
      pointCoords: await this.stateValues.numericalVertices,
      transient: false,
      actionId, sourceInformation, skipRendererUpdate
    });
  }


  async polylineClicked({ actionId, sourceInformation = {}, skipRendererUpdate = false }) {

    await this.coreFunctions.triggerChainedActions({
      triggeringAction: "click",
      componentName: this.componentName,
      actionId,
      sourceInformation,
      skipRendererUpdate,
    })

    this.coreFunctions.resolveAction({ actionId });

  }

  async mouseDownOnPolyline({ actionId, sourceInformation = {}, skipRendererUpdate = false }) {

    await this.coreFunctions.triggerChainedActions({
      triggeringAction: "down",
      componentName: this.componentName,
      actionId,
      sourceInformation,
      skipRendererUpdate,
    })

    this.coreFunctions.resolveAction({ actionId });

  }

}