import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';
import { convertValueToMathExpression } from '../utils/math';

export default class LineSegment extends GraphicalComponent {
  static componentType = "lineSegment";

  actions = {
    moveLineSegment: this.moveLineSegment.bind(this),
  };

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true
    };

    attributes.endpoints = {
      createComponentOfType: "_pointListComponent"
    }

    attributes.showCoordsWhenDragging = {
      createComponentOfType: "boolean",
      createStateVariable: "showCoordsWhenDragging",
      defaultValue: true,
      public: true,
      forRenderer: true
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

        let lineDescription = "";
        if (dependencyValues.selectedStyle.lineWidth >= 4) {
          lineDescription += "thick ";
        } else if (dependencyValues.selectedStyle.lineWidth <= 1) {
          lineDescription += "thin ";
        }
        if (dependencyValues.selectedStyle.lineStyle === "dashed") {
          lineDescription += "dashed ";
        } else if (dependencyValues.selectedStyle.lineStyle === "dotted") {
          lineDescription += "dotted ";
        }

        lineDescription += dependencyValues.selectedStyle.lineColorWord;

        return { setValue: { styleDescription: lineDescription } };
      }
    }


    stateVariableDefinitions.nDimensions = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        endpointsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "endpoints",
          variableNames: ["nDimensions"],
        }
      }),
      definition: function ({ dependencyValues }) {

        // console.log('definition of nDimensions')
        // console.log(dependencyValues)

        if (dependencyValues.endpointsAttr !== null) {
          let nDimensions = dependencyValues.endpointsAttr.stateValues.nDimensions;
          return {
            setValue: { nDimensions },
            checkForActualChange: { nDimensions: true }
          }
        } else {
          // line segment through zero points
          return { setValue: { nDimensions: 2 } }
        }

      }
    }


    stateVariableDefinitions.endpoints = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        returnWrappingComponents(prefix) {
          if (prefix === "endpointX") {
            return [];
          } else {
            // endpoint or entire array
            // wrap inner dimension by both <point> and <xs>
            // don't wrap outer dimension (for entire array)
            return [["point", { componentType: "mathList", isAttribute: "xs" }]];
          }
        },
      },
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["endpointX", "endpoint"],
      hasEssential: true,
      set: convertValueToMathExpression,
      defaultValueByArrayKey: (arrayKey) => me.fromAst(arrayKey === "0,0" ? 1 : 0),
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "endpointX") {
          // pointX1_2 is the 2nd component of the first point
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
          // endpoint3 is all components of the third point

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
        if (varName === "endpoints") {
          return "endpoint" + propIndex;
        }
        if (varName.slice(0, 8) === "endpoint") {
          // could be endpoint or endpointX
          let endpointNum = Number(varName.slice(8));
          if (Number.isInteger(endpointNum) && endpointNum > 0) {
            return `endpointX${endpointNum}_${propIndex}`
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions"
        }
      }),
      returnArraySize({ dependencyValues }) {
        return [2, dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = (Number(pointInd) + 1) + "_" + (Number(dim) + 1)

          dependenciesByKey[arrayKey] = {
            endpointsAttr: {
              dependencyType: "attributeComponent",
              attributeName: "endpoints",
              variableNames: ["pointX" + varEnding]
            }
          }
        }
        return { dependenciesByKey }

      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys, arraySize }) {

        // console.log('array definition of linesegment endpoints');
        // console.log(dependencyValuesByKey)
        // console.log(arrayKeys);

        let endpoints = {};
        let essentialEndpoints = {};

        for (let arrayKey of arrayKeys) {

          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = (Number(pointInd) + 1) + "_" + (Number(dim) + 1)

          if (dependencyValuesByKey[arrayKey].endpointsAttr !== null
            && dependencyValuesByKey[arrayKey].endpointsAttr.stateValues["pointX" + varEnding]
          ) {
            endpoints[arrayKey] = dependencyValuesByKey[arrayKey].endpointsAttr.stateValues["pointX" + varEnding];
          } else {
            essentialEndpoints[arrayKey] = true;
          }
        }

        let result = {};

        if (Object.keys(endpoints).length > 0) {
          result.setValue = { endpoints }
        }
        if (Object.keys(essentialEndpoints).length > 0) {
          result.useEssentialOrDefaultValue = { endpoints: essentialEndpoints }
        }

        return result;


      },
      async inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyValuesByKey, dependencyNamesByKey, initialChange, stateValues,
      }) {

        // console.log(`inverse array definition of endpoints of linesegment`);
        // console.log(desiredStateVariableValues)
        // console.log(JSON.parse(JSON.stringify(stateValues)))
        // console.log(dependencyValuesByKey);


        // if not draggable, then disallow initial change 
        if (initialChange && !await stateValues.draggable) {
          return { success: false };
        }


        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.endpoints) {

          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = (Number(pointInd) + 1) + "_" + (Number(dim) + 1)

          if (dependencyValuesByKey[arrayKey].endpointsAttr !== null
            && dependencyValuesByKey[arrayKey].endpointsAttr.stateValues["pointX" + varEnding]
          ) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].endpointsAttr,
              desiredValue: desiredStateVariableValues.endpoints[arrayKey],
              childIndex: 0,
              variableIndex: 0,
            })

          } else {
            instructions.push({
              setEssentialValue: "endpoints",
              value: { [arrayKey]: desiredStateVariableValues.endpoints[arrayKey] }
            })

          }
        }

        return {
          success: true,
          instructions
        }

      }
    }


    stateVariableDefinitions.numericalEndpoints = {
      isArray: true,
      entryPrefixes: ["numericalEndpoint"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        }
      }),
      returnArraySize({ dependencyValues }) {
        if (Number.isNaN(dependencyValues.nDimensions)) {
          return [0]
        }
        return [2];
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
            endpoint: {
              dependencyType: "stateVariable",
              variableName: "endpoint" + (Number(arrayKey) + 1)
            },
          }
        }

        return { globalDependencies, dependenciesByKey }
      },

      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {
        if (Number.isNaN(globalDependencyValues.nDimensions)) {
          return {}
        }

        let numericalEndpoints = {};
        for (let arrayKey of arrayKeys) {
          let endpoint = dependencyValuesByKey[arrayKey].endpoint;
          let numericalP = [];
          for (let ind = 0; ind < globalDependencyValues.nDimensions; ind++) {
            let val = endpoint[ind].evaluate_to_constant();
            if (!Number.isFinite(val)) {
              val = NaN;
            }
            numericalP.push(val);
          }
          numericalEndpoints[arrayKey] = numericalP;
        }

        return { setValue: { numericalEndpoints } }
      }
    }

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions"
        },
        numericalEndpoints: {
          dependencyType: "stateVariable",
          variableName: "numericalEndpoints"
        },
      }),
      definition({ dependencyValues }) {

        let A1 = dependencyValues.numericalEndpoints[0][0];
        let A2 = dependencyValues.numericalEndpoints[0][1];
        let B1 = dependencyValues.numericalEndpoints[1][0];
        let B2 = dependencyValues.numericalEndpoints[1][1];

        let haveConstants = Number.isFinite(A1) && Number.isFinite(A2) &&
          Number.isFinite(B1) && Number.isFinite(B2);


        // only implement for 
        // - 2D
        // - constant endpoints and 
        // - non-degenerate parameters
        let skip = dependencyValues.nDimensions !== 2
          || !haveConstants
          || (B1 === A1 && B2 === A2);


        return {
          setValue: {
            nearestPoint: function ({ variables, scales }) {

              if (skip) {
                return {};
              }

              let xscale = scales[0];
              let yscale = scales[1];

              let BA1 = (B1 - A1) / xscale;
              let BA2 = (B2 - A2) / yscale;
              let denom = (BA1 * BA1 + BA2 * BA2);

              let t = ((variables.x1 - A1) / xscale * BA1 + (variables.x2 - A2) / yscale * BA2) / denom;

              let result = {};

              if (t <= 0) {
                result = { x1: A1, x2: A2 };
              } else if (t >= 1) {
                result = { x1: B1, x2: B2 };
              } else {
                result = {
                  x1: A1 + t * BA1 * xscale,
                  x2: A2 + t * BA2 * yscale,
                };
              }

              if (variables.x3 !== undefined) {
                result.x3 = 0;
              }

              return result;

            }
          }
        }
      }
    }

    stateVariableDefinitions.slope = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        numericalEndpoints: {
          dependencyType: "stateVariable",
          variableName: "numericalEndpoints"
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.nDimensions !== 2) {
          return { setValue: { slope: NaN } }
        }

        let ps = dependencyValues.numericalEndpoints;
        let slope = (ps[1][1] - ps[0][1]) / (ps[1][0] - ps[0][0]);

        return { setValue: { slope } }
      }
    }

    return stateVariableDefinitions;
  }


  async moveLineSegment({ point1coords, point2coords, transient, actionId }) {

    let newComponents = {};

    if (point1coords !== undefined) {
      newComponents["0,0"] = me.fromAst(point1coords[0]);
      newComponents["0,1"] = me.fromAst(point1coords[1]);
    }
    if (point2coords !== undefined) {
      newComponents["1,0"] = me.fromAst(point2coords[0]);
      newComponents["1,1"] = me.fromAst(point2coords[1]);
    }

    if (transient) {

      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          componentName: this.componentName,
          updateType: "updateValue",
          stateVariable: "endpoints",
          value: newComponents
        }],
        transient: true,
        actionId,
      });
    } else {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          componentName: this.componentName,
          updateType: "updateValue",
          stateVariable: "endpoints",
          value: newComponents
        }],
        actionId,
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            point1: point1coords,
            point2: point2coords,
          }
        }
      });
    }

  }

}