import GraphicalComponent from "./abstract/GraphicalComponent";
import me from "math-expressions";
import { convertValueToMathExpression } from "../utils/math";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";

export default class LineSegment extends GraphicalComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      moveLineSegment: this.moveLineSegment.bind(this),
      lineSegmentClicked: this.lineSegmentClicked.bind(this),
      lineSegmentFocused: this.lineSegmentFocused.bind(this),
    });
  }
  static componentType = "lineSegment";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    attributes.endpointsDraggable = {
      createComponentOfType: "boolean",
    };

    attributes.endpoints = {
      createComponentOfType: "_pointListComponent",
    };

    attributes.showCoordsWhenDragging = {
      createComponentOfType: "boolean",
      createStateVariable: "showCoordsWhenDragging",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    attributes.labelPosition = {
      createComponentOfType: "text",
      createStateVariable: "labelPosition",
      defaultValue: "upperright",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["upperright", "upperleft", "lowerright", "lowerleft"],
    };

    Object.assign(attributes, returnRoundingAttributes());

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    Object.assign(
      stateVariableDefinitions,
      returnRoundingStateVariableDefinitions(),
    );

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
        document: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: ["theme"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let lineColorWord;
        if (dependencyValues.document?.stateValues.theme === "dark") {
          lineColorWord = dependencyValues.selectedStyle.lineColorWordDarkMode;
        } else {
          lineColorWord = dependencyValues.selectedStyle.lineColorWord;
        }

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

        styleDescription += lineColorWord;

        return { setValue: { styleDescription } };
      },
    };

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
        let styleDescriptionWithNoun =
          dependencyValues.styleDescription + " line segment";

        return { setValue: { styleDescriptionWithNoun } };
      },
    };

    stateVariableDefinitions.endpointsDraggable = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      hasEssential: true,
      forRenderer: true,
      returnDependencies: () => ({
        endpointsDraggableAttr: {
          dependencyType: "attributeComponent",
          attributeName: "endpointsDraggable",
          variableNames: ["value"],
        },
        draggable: {
          dependencyType: "stateVariable",
          variableName: "draggable",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.endpointsDraggableAttr) {
          return {
            setValue: {
              endpointsDraggable:
                dependencyValues.endpointsDraggableAttr.stateValues.value,
            },
          };
        } else {
          return {
            useEssentialOrDefaultValue: {
              endpointsDraggable: { defaultValue: dependencyValues.draggable },
            },
          };
        }
      },
    };

    stateVariableDefinitions.numDimensions = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        endpointsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "endpoints",
          variableNames: ["numDimensions"],
        },
      }),
      definition: function ({ dependencyValues }) {
        // console.log('definition of numDimensions')
        // console.log(dependencyValues)

        if (dependencyValues.endpointsAttr !== null) {
          let numDimensions =
            dependencyValues.endpointsAttr.stateValues.numDimensions;
          return {
            setValue: { numDimensions: Math.max(numDimensions, 2) },
            checkForActualChange: { numDimensions: true },
          };
        } else {
          // line segment through zero points
          return { setValue: { numDimensions: 2 } };
        }
      },
    };

    stateVariableDefinitions.endpoints = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "endpointX") {
            return [];
          } else {
            // endpoint or entire array
            // wrap inner dimension by both <point> and <xs>
            // don't wrap outer dimension (for entire array)
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          }
        },
      },
      isArray: true,
      numDimensions: 2,
      entryPrefixes: ["endpointX", "endpoint"],
      hasEssential: true,
      set: convertValueToMathExpression,
      defaultValueByArrayKey: (arrayKey) =>
        me.fromAst(arrayKey === "0,0" ? 1 : 0),
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "endpointX") {
          // pointX1_2 is the 2nd component of the first point
          let indices = varEnding.split("_").map((x) => Number(x) - 1);
          if (
            indices.length === 2 &&
            indices.every((x, i) => Number.isInteger(x) && x >= 0)
          ) {
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
            return Array.from(
              Array(arraySize[1]),
              (_, i) => pointInd + "," + i,
            );
          } else {
            return [];
          }
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "endpoints") {
          if (propIndex.length === 1) {
            return "endpoint" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `endpointX${propIndex[0]}_${propIndex[1]}`;
          }
        }
        if (varName.slice(0, 8) === "endpoint") {
          // could be endpoint or endpointX
          let endpointNum = Number(varName.slice(8));
          if (Number.isInteger(endpointNum) && endpointNum > 0) {
            // if propIndex has additional entries, ignore them
            return `endpointX${endpointNum}_${propIndex[0]}`;
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [2, dependencyValues.numDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

          dependenciesByKey[arrayKey] = {
            endpointsAttr: {
              dependencyType: "attributeComponent",
              attributeName: "endpoints",
              variableNames: ["pointX" + varEnding],
            },
          };
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys, arraySize }) {
        // console.log('array definition of linesegment endpoints');
        // console.log(dependencyValuesByKey)
        // console.log(arrayKeys);

        let endpoints = {};
        let essentialEndpoints = {};

        for (let arrayKey of arrayKeys) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

          if (
            dependencyValuesByKey[arrayKey].endpointsAttr !== null &&
            dependencyValuesByKey[arrayKey].endpointsAttr.stateValues[
              "pointX" + varEnding
            ]
          ) {
            endpoints[arrayKey] =
              dependencyValuesByKey[arrayKey].endpointsAttr.stateValues[
                "pointX" + varEnding
              ];
          } else {
            essentialEndpoints[arrayKey] = true;
          }
        }

        let result = {};

        if (Object.keys(endpoints).length > 0) {
          result.setValue = { endpoints };
        }
        if (Object.keys(essentialEndpoints).length > 0) {
          result.useEssentialOrDefaultValue = { endpoints: essentialEndpoints };
        }

        return result;
      },
      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        initialChange,
        stateValues,
      }) {
        // console.log(`inverse array definition of endpoints of linesegment`);
        // console.log(desiredStateVariableValues)
        // console.log(JSON.parse(JSON.stringify(stateValues)))
        // console.log(dependencyValuesByKey);

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.endpoints) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

          if (
            dependencyValuesByKey[arrayKey].endpointsAttr !== null &&
            dependencyValuesByKey[arrayKey].endpointsAttr.stateValues[
              "pointX" + varEnding
            ]
          ) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].endpointsAttr,
              desiredValue: desiredStateVariableValues.endpoints[arrayKey],
              childIndex: 0,
              variableIndex: 0,
            });
          } else {
            instructions.push({
              setEssentialValue: "endpoints",
              value: {
                [arrayKey]: desiredStateVariableValues.endpoints[arrayKey],
              },
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.parallelCoords = {
      returnDependencies: () => ({
        endpoints: {
          dependencyType: "stateVariable",
          variableName: "endpoints",
        },
      }),
      definition({ dependencyValues }) {
        let dxTree = [
          "+",
          dependencyValues.endpoints[1][0].tree,
          ["-", dependencyValues.endpoints[0][0].tree],
        ];

        let dyTree = [
          "+",
          dependencyValues.endpoints[1][1].tree,
          ["-", dependencyValues.endpoints[0][1].tree],
        ];

        let parallelCoords = me.fromAst(["vector", dxTree, dyTree]);

        return { setValue: { parallelCoords } };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let x = me.fromAst([
          "+",
          desiredStateVariableValues.parallelCoords.get_component(0).tree,
          dependencyValues.endpoints[0][0].tree,
        ]);

        let y = me.fromAst([
          "+",
          desiredStateVariableValues.parallelCoords.get_component(1).tree,
          dependencyValues.endpoints[0][1].tree,
        ]);

        return {
          success: true,
          instructions: [
            {
              setDependency: "endpoints",
              desiredValue: { "1,0": x, "1,1": y },
            },
          ],
        };
      },
    };

    stateVariableDefinitions.length = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
        endpoints: {
          dependencyType: "stateVariable",
          variableName: "endpoints",
        },
      }),
      definition({ dependencyValues }) {
        let length2 = 0;
        let epoint1 = dependencyValues.endpoints[0];
        let epoint2 = dependencyValues.endpoints[1];
        let all_numeric = true;
        for (let dim = 0; dim < dependencyValues.numDimensions; dim++) {
          let v1 = epoint1[dim].evaluate_to_constant();
          if (!Number.isFinite(v1)) {
            all_numeric = false;
            break;
          }
          let v2 = epoint2[dim].evaluate_to_constant();
          if (!Number.isFinite(v2)) {
            all_numeric = false;
            break;
          }
          let d = v1 - v2;
          length2 += d * d;
        }

        if (all_numeric) {
          return { setValue: { length: me.fromAst(Math.sqrt(length2)) } };
        }

        length2 = ["+"];
        for (let dim = 0; dim < dependencyValues.numDimensions; dim++) {
          length2.push(["^", ["+", epoint1[dim], ["-", epoint2[dim]]], 2]);
        }

        return {
          setValue: {
            length: me.fromAst(["apply", "sqrt", length2]),
          },
        };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let midpoint = [];
        let dir = [];
        let epoint1 = dependencyValues.endpoints[0];
        let epoint2 = dependencyValues.endpoints[1];
        let all_numeric = true;
        for (let dim = 0; dim < dependencyValues.numDimensions; dim++) {
          let v1 = epoint1[dim].evaluate_to_constant();
          if (!Number.isFinite(v1)) {
            all_numeric = false;
            break;
          }
          let v2 = epoint2[dim].evaluate_to_constant();
          if (!Number.isFinite(v2)) {
            all_numeric = false;
            break;
          }
          midpoint.push((v1 + v2) / 2);
          dir.push(v1 - v2);
        }

        if (!all_numeric) {
          return { success: false };
        }

        // make dir be unit length
        let dir_length = Math.sqrt(dir.reduce((a, c) => a + c * c, 0));
        dir = dir.map((x) => x / dir_length);

        let desiredLength =
          desiredStateVariableValues.length.evaluate_to_constant();

        if (!Number.isFinite(desiredLength) || desiredLength < 0) {
          return { success: false };
        }

        let desiredEndpoint1 = [],
          desiredEndpoint2 = [];
        let halfDesiredlength = desiredLength / 2;

        for (let dim = 0; dim < dependencyValues.numDimensions; dim++) {
          desiredEndpoint1.push(
            me.fromAst(midpoint[dim] + dir[dim] * halfDesiredlength),
          );
          desiredEndpoint2.push(
            me.fromAst(midpoint[dim] - dir[dim] * halfDesiredlength),
          );
        }

        return {
          success: true,
          instructions: [
            {
              setDependency: "endpoints",
              desiredValue: [desiredEndpoint1, desiredEndpoint2],
            },
          ],
        };
      },
    };

    stateVariableDefinitions.numericalEndpoints = {
      isArray: true,
      entryPrefixes: ["numericalEndpoint"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        if (Number.isNaN(dependencyValues.numDimensions)) {
          return [0];
        }
        return [2];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          numDimensions: {
            dependencyType: "stateVariable",
            variableName: "numDimensions",
          },
        };
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            endpoint: {
              dependencyType: "stateVariable",
              variableName: "endpoint" + (Number(arrayKey) + 1),
            },
          };
        }

        return { globalDependencies, dependenciesByKey };
      },

      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        if (Number.isNaN(globalDependencyValues.numDimensions)) {
          return {};
        }

        let numericalEndpoints = {};
        for (let arrayKey of arrayKeys) {
          let endpoint = dependencyValuesByKey[arrayKey].endpoint;
          let numericalP = [];
          for (let ind = 0; ind < globalDependencyValues.numDimensions; ind++) {
            let val = endpoint[ind].evaluate_to_constant();
            numericalP.push(val);
          }
          numericalEndpoints[arrayKey] = numericalP;
        }

        return { setValue: { numericalEndpoints } };
      },
    };

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
        numericalEndpoints: {
          dependencyType: "stateVariable",
          variableName: "numericalEndpoints",
        },
      }),
      definition({ dependencyValues }) {
        let A1 = dependencyValues.numericalEndpoints[0][0];
        let A2 = dependencyValues.numericalEndpoints[0][1];
        let B1 = dependencyValues.numericalEndpoints[1][0];
        let B2 = dependencyValues.numericalEndpoints[1][1];

        let haveConstants =
          Number.isFinite(A1) &&
          Number.isFinite(A2) &&
          Number.isFinite(B1) &&
          Number.isFinite(B2);

        // only implement for
        // - 2D
        // - constant endpoints and
        // - non-degenerate parameters
        let skip =
          dependencyValues.numDimensions !== 2 ||
          !haveConstants ||
          (B1 === A1 && B2 === A2);

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
              let denom = BA1 * BA1 + BA2 * BA2;

              let t =
                (((variables.x1 - A1) / xscale) * BA1 +
                  ((variables.x2 - A2) / yscale) * BA2) /
                denom;

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
            },
          },
        };
      },
    };

    stateVariableDefinitions.slope = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        numericalEndpoints: {
          dependencyType: "stateVariable",
          variableName: "numericalEndpoints",
        },
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.numDimensions !== 2) {
          return { setValue: { slope: NaN } };
        }

        let ps = dependencyValues.numericalEndpoints;
        let slope = (ps[1][1] - ps[0][1]) / (ps[1][0] - ps[0][0]);

        return { setValue: { slope } };
      },
    };

    return stateVariableDefinitions;
  }

  static adapters = [
    {
      stateVariable: "parallelCoords",
      componentType: "_directionComponent",
      stateVariablesToShadow: Object.keys(
        returnRoundingStateVariableDefinitions(),
      ),
    },
  ];

  async moveLineSegment({
    point1coords,
    point2coords,
    transient,
    actionId,
    sourceDetails,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (point1coords === undefined || point2coords === undefined) {
      // single point dragged
      if (!(await this.stateValues.endpointsDraggable)) {
        return;
      }
    } else {
      // whole line segment dragged
      if (!(await this.stateValues.draggable)) {
        return;
      }
    }

    let newComponents = {};

    if (point1coords !== undefined) {
      newComponents["0,0"] = me.fromAst(point1coords[0]);
      newComponents["0,1"] = me.fromAst(point1coords[1]);
    }
    if (point2coords !== undefined) {
      newComponents["1,0"] = me.fromAst(point2coords[0]);
      newComponents["1,1"] = me.fromAst(point2coords[1]);
    }

    // Note: we set skipRendererUpdate to true
    // so that we can make further adjustments before the renderers are updated
    if (transient) {
      await this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            componentName: this.componentName,
            updateType: "updateValue",
            stateVariable: "endpoints",
            value: newComponents,
            sourceDetails,
          },
        ],
        transient: true,
        actionId,
        sourceInformation,
        skipRendererUpdate: true,
      });
    } else {
      await this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            componentName: this.componentName,
            updateType: "updateValue",
            stateVariable: "endpoints",
            value: newComponents,
            sourceDetails,
          },
        ],
        actionId,
        sourceInformation,
        skipRendererUpdate: true,
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            point1: point1coords,
            point2: point2coords,
          },
        },
      });
    }

    // we will attempt to keep the relationship between the two endpoints fixed
    // when the whole line segment is moved,
    // even if one of the endpoints is constrained.

    // if dragged the whole line segment,
    // address case where only one endpoint is constrained
    // to make line segment just translate in this case
    if (point1coords !== undefined && point2coords !== undefined) {
      let numericalPoints = [point1coords, point2coords];
      let resultingNumericalPoints = await this.stateValues.numericalEndpoints;

      let pointsChanged = [];
      let numPointsChanged = 0;

      for (let [ind, pt] of numericalPoints.entries()) {
        if (!pt.every((v, i) => v === resultingNumericalPoints[ind][i])) {
          pointsChanged.push(ind);
          numPointsChanged++;
        }
      }

      if (numPointsChanged === 1) {
        // One endpoint was altered from the requested location
        // while the other endpoint stayed at the requested location.
        // We interpret this as one endpoint being constrained and the second one being free
        // and we move the second endpoint to keep their relative position fixed.

        let changedInd = pointsChanged[0];

        let orig1 = numericalPoints[changedInd];
        let changed1 = resultingNumericalPoints[changedInd];
        let changevec1 = orig1.map((v, i) => v - changed1[i]);

        let newNumericalPoints = [];

        for (let i = 0; i < 2; i++) {
          if (i === changedInd) {
            newNumericalPoints.push(resultingNumericalPoints[i]);
          } else {
            newNumericalPoints.push(
              numericalPoints[i].map((v, j) => v - changevec1[j]),
            );
          }
        }

        let newPointComponents = {};
        for (let ind in newNumericalPoints) {
          newPointComponents[ind + ",0"] = me.fromAst(
            newNumericalPoints[ind][0],
          );
          newPointComponents[ind + ",1"] = me.fromAst(
            newNumericalPoints[ind][1],
          );
        }

        let newInstructions = [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "endpoints",
            value: newPointComponents,
          },
        ];
        return await this.coreFunctions.performUpdate({
          updateInstructions: newInstructions,
          transient,
          actionId,
          sourceInformation,
          skipRendererUpdate,
        });
      }
    }

    // if no modifications were made, still need to update renderers
    // as original update was performed with skipping renderer update
    return await this.coreFunctions.updateRenderers({
      actionId,
      sourceInformation,
      skipRendererUpdate,
    });
  }

  async lineSegmentClicked({
    actionId,
    name,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.fixed)) {
      await this.coreFunctions.triggerChainedActions({
        triggeringAction: "click",
        componentName: name, // use name rather than this.componentName to get original name if adapted
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    }
  }

  async lineSegmentFocused({
    actionId,
    name,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.fixed)) {
      await this.coreFunctions.triggerChainedActions({
        triggeringAction: "focus",
        componentName: name, // use name rather than this.componentName to get original name if adapted
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    }
  }
}
