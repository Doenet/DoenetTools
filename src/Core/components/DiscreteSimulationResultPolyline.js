import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';

export default class DiscreteSimulationResultPolyline extends GraphicalComponent {
  static componentType = "discreteSimulationResultPolyline";
  static rendererType = "polyline";

  actions = {
    movePolyline: this.movePolyline.bind(this),
    finalizePolylinePosition: this.finalizePolylinePosition.bind(this)
  };

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    attributes.allIterates = {
      createComponentOfType: "mathList",
      createStateVariable: "allIteratesSub",
      defaultValue: [],
    }

    attributes.seriesNumber = {
      createComponentOfType: "number",
      createStateVariable: "seriesNumber",
      defaultValue: null,
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

        let curveDescription = dependencyValues.selectedStyle.lineWidthWord;
        if (dependencyValues.selectedStyle.lineStyleWord) {
          if (curveDescription) {
            curveDescription += " ";
          }
          curveDescription += dependencyValues.selectedStyle.lineStyleWord;
        }

        if (curveDescription) {
          curveDescription += " ";
        }

        curveDescription += dependencyValues.selectedStyle.lineColorWord

        return { setValue: { styleDescription: curveDescription } };
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

    stateVariableDefinitions.allIterates = {
      returnDependencies: () => ({
        allIteratesSub: {
          dependencyType: "stateVariable",
          variableName: "allIteratesSub",
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            allIterates: dependencyValues.allIteratesSub.filter(x =>
              Number.isFinite(x.tree) ||
              (Array.isArray(x.tree) && ["tuple", "vector"].includes(x.tree[0]) && x.tree.slice(1).every(Number.isFinite))
            )
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
        allIterates: {
          dependencyType: "stateVariable",
          variableName: "allIterates",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { nVertices: dependencyValues.allIterates.length } }

      }
    }

    stateVariableDefinitions.nDimensions = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: function ({ dependencyValues }) {
        return { setValue: { nDimensions: 2 } }

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
          let val = globalDependencyValues.allIterates[ind];
          if (globalDependencyValues.seriesNumber !== null) {
            val = val.get_component(globalDependencyValues.seriesNumber - 1);
          }
          vertices[`${ind},1`] = val;
        }

        return { setValue: { vertices } }
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


  async movePolyline({ pointCoords, transient, sourceInformation, actionId, }) {

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
          sourceInformation
        }],
        transient: true,
        actionId,
      });
    } else {

      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "vertices",
          value: vertexComponents,
          sourceInformation
        }],
        actionId,
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

  async finalizePolylinePosition() {
    // trigger a movePolyline 
    // to send the final values with transient=false
    // so that the final position will be recorded

    return await this.actions.movePolyline({
      pointCoords: await this.stateValues.numericalVertices,
      transient: false
    });
  }


}