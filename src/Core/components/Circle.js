import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
import Curve from "./Curve";
import GraphicalComponent from "./abstract/GraphicalComponent";

import me from "math-expressions";

export default class Circle extends Curve {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      moveCircle: this.moveCircle.bind(this),
      circleClicked: this.circleClicked.bind(this),
      circleFocused: this.circleFocused.bind(this),
    });
  }
  static componentType = "circle";
  static rendererType = "circle";
  static representsClosedPath = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.through = {
      createComponentOfType: "_pointListComponent",
    };
    attributes.center = {
      createComponentOfType: "point",
    };
    attributes.radius = {
      createComponentOfType: "math",
    };

    attributes.filled = {
      createComponentOfType: "boolean",
      createStateVariable: "filled",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };

    attributes.hideOffGraphIndicator = {
      createComponentOfType: "boolean",
    };

    delete attributes.parMin;
    delete attributes.parMax;
    delete attributes.variable;

    return attributes;
  }

  static returnChildGroups() {
    return GraphicalComponent.returnChildGroups();
  }

  static returnStateVariableDefinitions(args) {
    let stateVariableDefinitions =
      GraphicalComponent.returnStateVariableDefinitions(args);

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
        filled: {
          dependencyType: "stateVariable",
          variableName: "filled",
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

        let borderDescription = dependencyValues.selectedStyle.lineWidthWord;
        if (dependencyValues.selectedStyle.lineStyleWord) {
          if (borderDescription) {
            borderDescription += " ";
          }
          borderDescription += dependencyValues.selectedStyle.lineStyleWord;
        }
        if (borderDescription) {
          borderDescription += " ";
        }

        let styleDescription;
        if (!dependencyValues.filled) {
          styleDescription = borderDescription + lineColorWord;
        } else {
          let fillColorWord;
          if (dependencyValues.document?.stateValues.theme === "dark") {
            fillColorWord =
              dependencyValues.selectedStyle.fillColorWordDarkMode;
          } else {
            fillColorWord = dependencyValues.selectedStyle.fillColorWord;
          }

          if (fillColorWord === lineColorWord) {
            styleDescription = "filled " + fillColorWord;
            if (borderDescription) {
              styleDescription += " with " + borderDescription + "border";
            }
          } else {
            styleDescription =
              "filled " +
              fillColorWord +
              " with " +
              borderDescription +
              lineColorWord +
              " border";
          }
        }

        return { setValue: { styleDescription } };
      },
    };

    stateVariableDefinitions.styleDescriptionWithNoun = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
        filled: {
          dependencyType: "stateVariable",
          variableName: "filled",
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

        let borderDescription = dependencyValues.selectedStyle.lineWidthWord;
        if (dependencyValues.selectedStyle.lineStyleWord) {
          if (borderDescription) {
            borderDescription += " ";
          }
          borderDescription += dependencyValues.selectedStyle.lineStyleWord;
        }
        if (borderDescription) {
          borderDescription += " ";
        }

        let styleDescriptionWithNoun;
        if (!dependencyValues.filled) {
          styleDescriptionWithNoun =
            borderDescription + lineColorWord + " circle";
        } else {
          let fillColorWord;
          if (dependencyValues.document?.stateValues.theme === "dark") {
            fillColorWord =
              dependencyValues.selectedStyle.fillColorWordDarkMode;
          } else {
            fillColorWord = dependencyValues.selectedStyle.fillColorWord;
          }

          if (fillColorWord === lineColorWord) {
            styleDescriptionWithNoun = "filled " + fillColorWord + " circle";
            if (borderDescription) {
              styleDescriptionWithNoun +=
                " with a " + borderDescription + "border";
            }
          } else {
            styleDescriptionWithNoun =
              "filled " +
              fillColorWord +
              " circle with a " +
              borderDescription +
              lineColorWord +
              " border";
          }
        }

        return { setValue: { styleDescriptionWithNoun } };
      },
    };

    stateVariableDefinitions.borderStyleDescription = {
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

        let borderStyleDescription =
          dependencyValues.selectedStyle.lineWidthWord;
        if (dependencyValues.selectedStyle.lineStyleWord) {
          if (borderStyleDescription) {
            borderStyleDescription += " ";
          }
          borderStyleDescription +=
            dependencyValues.selectedStyle.lineStyleWord;
        }

        if (borderStyleDescription) {
          borderStyleDescription += " ";
        }

        borderStyleDescription += lineColorWord;

        return { setValue: { borderStyleDescription } };
      },
    };

    stateVariableDefinitions.fillStyleDescription = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
        filled: {
          dependencyType: "stateVariable",
          variableName: "filled",
        },
        document: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: ["theme"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let fillColorWord;
        if (dependencyValues.document?.stateValues.theme === "dark") {
          fillColorWord = dependencyValues.selectedStyle.fillColorWordDarkMode;
        } else {
          fillColorWord = dependencyValues.selectedStyle.fillColorWord;
        }

        let fillStyleDescription;
        if (!dependencyValues.filled) {
          fillStyleDescription = "unfilled";
        } else {
          fillStyleDescription = fillColorWord;
        }

        return { setValue: { fillStyleDescription } };
      },
    };

    stateVariableDefinitions.hideOffGraphIndicator = {
      public: true,
      forRenderer: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({
        hideOffGraphIndicatorAttr: {
          dependencyType: "attributeComponent",
          attributeName: "hideOffGraphIndicator",
          variableNames: ["value"],
        },
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["hideOffGraphIndicators"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.hideOffGraphIndicatorAttr) {
          return {
            setValue: {
              hideOffGraphIndicator:
                dependencyValues.hideOffGraphIndicatorAttr.stateValues.value,
            },
          };
        } else if (dependencyValues.graphAncestor) {
          return {
            setValue: {
              hideOffGraphIndicator:
                dependencyValues.graphAncestor.stateValues
                  .hideOffGraphIndicators,
            },
          };
        } else {
          return {
            setValue: { hideOffGraphIndicator: false },
          };
        }
      },
    };

    stateVariableDefinitions.curveType = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { curveType: "circle" } }),
    };

    stateVariableDefinitions.parMax = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { parMax: NaN } }),
    };

    stateVariableDefinitions.parMin = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { parMin: NaN } }),
    };

    stateVariableDefinitions.fs = {
      forRenderer: true,
      isArray: true,
      entryPrefixes: ["f"],
      returnArraySizeDependencies: () => ({}),
      returnArraySize: () => [0],
      returnArrayDependenciesByKey: () => ({}),
      arrayDefinitionByKey: () => ({ setValue: { fs: {} } }),
    };

    stateVariableDefinitions.numThroughPoints = {
      returnDependencies: () => ({
        throughAttr: {
          dependencyType: "attributeComponent",
          attributeName: "through",
          variableNames: ["numPoints"],
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.throughAttr !== null) {
          return {
            setValue: {
              numThroughPoints:
                dependencyValues.throughAttr.stateValues.numPoints,
            },
          };
        } else {
          return { setValue: { numThroughPoints: 0 } };
        }
      },
    };

    stateVariableDefinitions.throughPoints = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "throughPointX") {
            return [];
          } else {
            // point or entire array
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
      entryPrefixes: ["throughPointX", "throughPoint"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "throughPointX") {
          // throughPointX1_2 is the 2nd component of the first point
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
          // throughPoint3 is all components of the third vertex

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
        if (varName === "throughPoints") {
          if (propIndex.length === 1) {
            return "throughPoint" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `throughPointX${propIndex[0]}_${propIndex[1]}`;
          }
        }
        if (varName.slice(0, 12) === "throughPoint") {
          // could be throughPoint or throughPointX
          let throughPointNum = Number(varName.slice(12));
          if (Number.isInteger(throughPointNum) && throughPointNum > 0) {
            // if propIndex has additional entries, ignore them
            return `throughPointX${throughPointNum}_${propIndex[0]}`;
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        numThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numThroughPoints, 2];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

          dependenciesByKey[arrayKey] = {
            throughAttr: {
              dependencyType: "attributeComponent",
              attributeName: "through",
              variableNames: ["pointX" + varEnding],
            },
          };
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        // console.log('definition of circle throughPoints');
        // console.log(dependencyValuesByKey)
        // console.log(arrayKeys);

        let throughPoints = {};

        for (let arrayKey of arrayKeys) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

          let throughAttr = dependencyValuesByKey[arrayKey].throughAttr;
          if (
            throughAttr !== null &&
            throughAttr.stateValues["pointX" + varEnding]
          ) {
            throughPoints[arrayKey] =
              throughAttr.stateValues["pointX" + varEnding];
          } else {
            throughPoints[arrayKey] = me.fromAst("\uff3f");
          }
        }

        return { setValue: { throughPoints } };
      },

      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        initialChange,
        stateValues,
      }) {
        // console.log(`inverseDefinition of throughPoints of circle`);
        // console.log(desiredStateVariableValues)
        // console.log(JSON.parse(JSON.stringify(stateValues)))
        // console.log(dependencyValuesByKey);

        // if not draggable, then disallow initial change
        if (initialChange && !(await stateValues.draggable)) {
          return { success: false };
        }

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.throughPoints) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

          if (
            dependencyValuesByKey[arrayKey].throughAttr !== null &&
            dependencyValuesByKey[arrayKey].throughAttr.stateValues[
              "pointX" + varEnding
            ]
          ) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].throughAttr,
              desiredValue: desiredStateVariableValues.throughPoints[arrayKey],
              variableIndex: 0,
            });
          } else {
            return { success: false };
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.havePrescribedCenter = {
      returnDependencies: () => ({
        centerAttr: {
          dependencyType: "attributeComponent",
          attributeName: "center",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          havePrescribedCenter: dependencyValues.centerAttr !== null,
        },
        checkForActualChange: { havePrescribedCenter: true },
      }),
    };

    stateVariableDefinitions.prescribedCenter = {
      isArray: true,
      isLocation: true,
      entryPrefixes: ["prescribedCenterX"],
      returnArraySizeDependencies: () => ({
        havePrescribedCenter: {
          dependencyType: "stateVariable",
          variableName: "havePrescribedCenter",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.havePrescribedCenter ? 2 : 0];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            centerAttr: {
              dependencyType: "attributeComponent",
              attributeName: "center",
              variableNames: ["x" + varEnding],
            },
          };
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey: function ({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        let prescribedCenter = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;

          if (dependencyValuesByKey[arrayKey].centerAttr !== null) {
            prescribedCenter[arrayKey] =
              dependencyValuesByKey[arrayKey].centerAttr.stateValues[
                "x" + varEnding
              ];
            if (!prescribedCenter[arrayKey]) {
              prescribedCenter[arrayKey] = me.fromAst("\uff3f");
            }
          }
        }

        return { setValue: { prescribedCenter } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        arraySize,
      }) {
        // console.log(`inverse definition of prescribed center of circle`)
        // console.log(desiredStateVariableValues)
        // console.log(globalDependencyValues)
        // console.log(dependencyValuesByKey)

        let instructions = [];

        // process instructions in reverse order
        // so that the x-coordinates is processed last and takes precedence
        for (let arrayKey of Object.keys(
          desiredStateVariableValues.prescribedCenter,
        ).reverse()) {
          if (dependencyValuesByKey[arrayKey].centerAttr !== null) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].centerAttr,
              desiredValue:
                desiredStateVariableValues.prescribedCenter[arrayKey],
              variableIndex: 0,
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.prescribedRadius = {
      defaultValue: null,
      isLocation: true,
      returnDependencies: () => ({
        radiusAttr: {
          dependencyType: "attributeComponent",
          attributeName: "radius",
          variableNames: ["value"],
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.radiusAttr !== null) {
          return {
            setValue: {
              prescribedRadius: dependencyValues.radiusAttr.stateValues.value,
            },
          };
        } else {
          return {
            setValue: {
              prescribedRadius: null,
            },
          };
        }
      },
      inverseDefinition: function ({
        desiredStateVariableValues,
        dependencyValues,
      }) {
        if (dependencyValues.radiusAttr !== null) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "radiusAttr",
                desiredValue: desiredStateVariableValues.prescribedRadius,
                childIndex: 0,
                variableIndex: 0,
              },
            ],
          };
        } else {
          return { success: false };
        }
      },
    };

    stateVariableDefinitions.havePrescribedRadius = {
      returnDependencies: () => ({
        radiusAttr: {
          dependencyType: "attributeComponent",
          attributeName: "radius",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          havePrescribedRadius: dependencyValues.radiusAttr !== null,
        },
        checkForActualChange: { havePrescribedRadius: true },
      }),
    };

    stateVariableDefinitions.numericalPrescribedRadius = {
      returnDependencies: () => ({
        prescribedRadius: {
          dependencyType: "stateVariable",
          variableName: "prescribedRadius",
        },
      }),
      additionalStateVariablesDefined: ["haveNonNumericalPrescribedRadius"],
      definition: function ({ dependencyValues }) {
        let haveNonNumericalPrescribedRadius = false;
        let numericalPrescribedRadius;

        if (dependencyValues.prescribedRadius === null) {
          numericalPrescribedRadius = null;
        } else {
          numericalPrescribedRadius =
            dependencyValues.prescribedRadius.evaluate_to_constant();
          if (!Number.isFinite(numericalPrescribedRadius)) {
            numericalPrescribedRadius = NaN;
            haveNonNumericalPrescribedRadius = true;
          }
        }

        return {
          setValue: {
            haveNonNumericalPrescribedRadius,
            numericalPrescribedRadius,
          },
          checkForActualChange: {
            haveNonNumericalEntriesNumericalRadius: true,
          },
        };
      },
      inverseDefinition: async function ({
        desiredStateVariableValues,
        dependencyValues,
        stateValues,
      }) {
        // console.log('inverse definition of numerical prescribed radius of circle')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)

        if (await stateValues.haveNonNumericalPrescribedRadius) {
          return { success: false };
        }

        if (
          desiredStateVariableValues.numericalPrescribedRadius !== undefined
        ) {
          if (dependencyValues.prescribedRadius === null) {
            return { success: false };
          }

          return {
            success: true,
            instructions: [
              {
                setDependency: "prescribedRadius",
                desiredValue: me.fromAst(
                  desiredStateVariableValues.numericalPrescribedRadius,
                ),
              },
            ],
          };
        }

        return { success: false };
      },
    };

    stateVariableDefinitions.numericalPrescribedCenter = {
      isArray: true,
      entryPrefixes: ["numericalPrescribedCenterX"],
      returnArraySizeDependencies: () => ({
        havePrescribedCenter: {
          dependencyType: "stateVariable",
          variableName: "havePrescribedCenter",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.havePrescribedCenter ? 2 : 0];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            prescribedCenterX: {
              dependencyType: "stateVariable",
              variableName: "prescribedCenterX" + varEnding,
            },
          };
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey: function ({ dependencyValuesByKey, arrayKeys }) {
        let numericalPrescribedCenter = {};
        for (let arrayKey of arrayKeys) {
          let prescribedX = dependencyValuesByKey[arrayKey].prescribedCenterX;
          if (prescribedX) {
            numericalPrescribedCenter[arrayKey] =
              prescribedX.evaluate_to_constant();
          } else {
            numericalPrescribedCenter[arrayKey] = NaN;
          }
        }

        return { setValue: { numericalPrescribedCenter } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
      }) {
        // console.log('inverse definition of numerical prescribed center of circle')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValuesByKey)

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.numericalPrescribedCenter) {
          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey].prescribedCenterX,
            desiredValue: me.fromAst(
              desiredStateVariableValues.numericalPrescribedCenter[arrayKey],
            ),
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.haveNonNumericalPrescribedCenter = {
      returnDependencies: () => ({
        numericalPrescribedCenter: {
          dependencyType: "stateVariable",
          variableName: "numericalPrescribedCenter",
        },
      }),
      definition({ dependencyValues }) {
        let haveNonNumericalPrescribedCenter =
          dependencyValues.numericalPrescribedCenter.some(
            (x) => !Number.isFinite(x),
          );

        return {
          setValue: {
            haveNonNumericalPrescribedCenter,
          },
          checkForActualChange: { haveNonNumericalPrescribedCenter: true },
        };
      },
    };

    stateVariableDefinitions.numericalThroughPoints = {
      returnDependencies: () => ({
        throughPoints: {
          dependencyType: "stateVariable",
          variableName: "throughPoints",
        },
      }),
      additionalStateVariablesDefined: ["haveNonNumericalThroughPoints"],
      definition: function ({ dependencyValues }) {
        let haveNonNumericalThroughPoints = false;
        let numericalThroughPoints = [];

        for (let point of dependencyValues.throughPoints) {
          let numericalPoint = [];
          for (let dim = 0; dim < 2; dim++) {
            let numericalValue = point[dim].evaluate_to_constant();
            if (Number.isFinite(numericalValue)) {
              numericalPoint.push(numericalValue);
            } else {
              haveNonNumericalThroughPoints = true;
              numericalPoint = [];
              break;
            }
          }
          if (numericalPoint.length > 0) {
            numericalThroughPoints.push(numericalPoint);
          } else {
            numericalThroughPoints = [];
            break;
          }
        }

        return {
          setValue: {
            haveNonNumericalThroughPoints,
            numericalThroughPoints,
          },
          checkForActualChange: { haveNonNumericalThroughPoints: true },
        };
      },
      inverseDefinition: async function ({
        desiredStateVariableValues,
        dependencyValues,
        stateValues,
      }) {
        // console.log('inverse definition of numerical throughpoints of circle')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)

        if (await stateValues.haveNonNumericalThroughPoints) {
          return { success: false };
        }

        if (desiredStateVariableValues.numericalThroughPoints !== undefined) {
          let desiredThroughPoints = {};
          for (let [
            ind,
            pt,
          ] of desiredStateVariableValues.numericalThroughPoints.entries()) {
            desiredThroughPoints[ind + ",0"] = me.fromAst(pt[0]);
            desiredThroughPoints[ind + ",1"] = me.fromAst(pt[1]);
          }
          return {
            success: true,
            instructions: [
              {
                setDependency: "throughPoints",
                desiredValue: desiredThroughPoints,
              },
            ],
          };
        }

        return { success: false };
      },
    };

    stateVariableDefinitions.haveNumericalEntries = {
      returnDependencies: () => ({
        haveNonNumericalPrescribedCenter: {
          dependencyType: "stateVariable",
          variableName: "haveNonNumericalPrescribedCenter",
        },
        haveNonNumericalPrescribedRadius: {
          dependencyType: "stateVariable",
          variableName: "haveNonNumericalPrescribedRadius",
        },
        haveNonNumericalThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "haveNonNumericalThroughPoints",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          haveNumericalEntries: !(
            dependencyValues.haveNonNumericalPrescribedCenter ||
            dependencyValues.haveNonNumericalPrescribedRadius ||
            dependencyValues.haveNonNumericalThroughPoints
          ),
        },
      }),
    };

    // When circle is based on two or three points
    // radius and center are more efficently calculated simultaneously.
    // This state variable doesn't check that radius and center
    // are not prescribed, but it is used in just those cases
    stateVariableDefinitions.numericalRadiusCalculatedWithCenter = {
      additionalStateVariablesDefined: ["numericalCenterCalculatedWithRadius"],
      returnDependencies: () => ({
        numThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numThroughPoints",
        },
        numericalThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numericalThroughPoints",
        },
        haveNonNumericalThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "haveNonNumericalThroughPoints",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.haveNonNumericalThroughPoints) {
          let message =
            "Haven't implemented <circle> through " +
            dependencyValues.numThroughPoints +
            " points";
          message += " in case where the points don't have numerical values.";
          let warning = { message, level: 1 };
          return {
            setValue: {
              numericalRadiusCalculatedWithCenter: null,
              numericalCenterCalculatedWithRadius: null,
            },
            sendWarnings: [warning],
          };
        }

        if (dependencyValues.numThroughPoints === 2) {
          let { numericalCenter, numericalRadius } =
            circleFromTwoNumericalPoints({
              point1: dependencyValues.numericalThroughPoints[0],
              point2: dependencyValues.numericalThroughPoints[1],
            });

          return {
            setValue: {
              numericalCenterCalculatedWithRadius: numericalCenter,
              numericalRadiusCalculatedWithCenter: numericalRadius,
            },
          };
        } else if (dependencyValues.numThroughPoints === 3) {
          let x1 = dependencyValues.numericalThroughPoints[0][0];
          let x2 = dependencyValues.numericalThroughPoints[1][0];
          let x3 = dependencyValues.numericalThroughPoints[2][0];
          let y1 = dependencyValues.numericalThroughPoints[0][1];
          let y2 = dependencyValues.numericalThroughPoints[1][1];
          let y3 = dependencyValues.numericalThroughPoints[2][1];

          let numericalCenter, numericalRadius;

          if (x1 === x2 && y1 === y2) {
            if (x1 === x3 && y1 === y3) {
              // if all points are identical, it's a circle with radius zero
              numericalCenter = [x1, y1];
              numericalRadius = 0;
            } else {
              // if point 1 and 2 are identical, treat it as circle through two points
              let result = circleFromTwoNumericalPoints({
                point1: [x1, y1],
                point2: [x3, y3],
              });
              numericalCenter = result.numericalCenter;
              numericalRadius = result.numericalRadius;
            }
          } else if ((x1 === x3 && y1 === y3) || (x2 === x3 && y2 === y3)) {
            // if point 1 and 3 are identical,
            // or if point 2 and 3 are identical,
            // treat it as circle through two points
            let result = circleFromTwoNumericalPoints({
              point1: [x1, y1],
              point2: [x2, y2],
            });
            numericalCenter = result.numericalCenter;
            numericalRadius = result.numericalRadius;
          } else {
            // all distinct points

            let mag1 = x1 * x1 + y1 * y1;
            let mag2 = x2 * x2 + y2 * y2;
            let mag3 = x3 * x3 + y3 * y3;

            let A = x1 * (y2 - y3) - y1 * (x2 - x3) + x2 * y3 - x3 * y2;
            let B = mag1 * (y3 - y2) + mag2 * (y1 - y3) + mag3 * (y2 - y1);
            let C = mag1 * (x2 - x3) + mag2 * (x3 - x1) + mag3 * (x1 - x2);
            let D =
              mag1 * (x3 * y2 - x2 * y3) +
              mag2 * (x1 * y3 - x3 * y1) +
              mag3 * (x2 * y1 - x1 * y2);

            if (A !== 0) {
              numericalCenter = [-B / (2 * A), -C / (2 * A)];
              numericalRadius = Math.sqrt(
                (B * B + C * C - 4 * A * D) / (4 * A * A),
              );
            } else {
              // collinear non-identical points, can't make a circle
              numericalCenter = [NaN, NaN];
              numericalRadius = NaN;
            }
          }

          return {
            setValue: {
              numericalCenterCalculatedWithRadius: numericalCenter,
              numericalRadiusCalculatedWithCenter: numericalRadius,
            },
          };
        } else if (dependencyValues.numThroughPoints > 3) {
          let warning = {
            message: "Cannot calculate circle through more than 3 points.",
            level: 1,
          };
          return {
            setValue: {
              numericalRadiusCalculatedWithCenter: null,
              numericalCenterCalculatedWithRadius: null,
            },
            sendWarnings: [warning],
          };
        } else {
          // these variables aren't used with fewer than 2 points
          return {
            setValue: {
              numericalRadiusCalculatedWithCenter: null,
              numericalCenterCalculatedWithRadius: null,
            },
          };
        }
      },
    };

    stateVariableDefinitions.haveCenterRadiusPoints = {
      returnDependencies: () => ({
        havePrescribedCenter: {
          dependencyType: "stateVariable",
          variableName: "havePrescribedCenter",
        },
        havePrescribedRadius: {
          dependencyType: "stateVariable",
          variableName: "havePrescribedRadius",
        },
        numThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numThroughPoints",
        },
      }),
      definition({ dependencyValues }) {
        if (
          dependencyValues.havePrescribedCenter &&
          dependencyValues.havePrescribedRadius &&
          dependencyValues.numThroughPoints > 0
        ) {
          let warning = {
            message:
              "Cannot calculate circle with specified radius, center and through points.",
            level: 1,
          };
          return {
            setValue: { haveCenterRadiusPoints: true },
            sendWarnings: [warning],
          };
        } else {
          return { setValue: { haveCenterRadiusPoints: false } };
        }
      },
    };

    stateVariableDefinitions.essentialRadius = {
      defaultValue: 1,
      hasEssential: true,
      isLocation: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          essentialRadius: true,
        },
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "essentialRadius",
              value: desiredStateVariableValues.essentialRadius,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.numericalRadius = {
      forRenderer: true,
      stateVariablesDeterminingDependencies: [
        "numThroughPoints",
        "havePrescribedCenter",
        "havePrescribedRadius",
      ],
      returnDependencies: function ({ stateValues }) {
        let dependencies = {
          haveNonNumericalPrescribedRadius: {
            dependencyType: "stateVariable",
            variableName: "haveNonNumericalPrescribedRadius",
          },
          numThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "numThroughPoints",
          },
          essentialRadius: {
            dependencyType: "stateVariable",
            variableName: "essentialRadius",
          },
          haveCenterRadiusPoints: {
            dependencyType: "stateVariable",
            variableName: "haveCenterRadiusPoints",
          },
        };

        if (stateValues.havePrescribedRadius) {
          dependencies.numericalPrescribedRadius = {
            dependencyType: "stateVariable",
            variableName: "numericalPrescribedRadius",
          };
        } else {
          if (stateValues.havePrescribedCenter) {
            if (stateValues.numThroughPoints >= 1) {
              dependencies.haveNonNumericalPrescribedCenter = {
                dependencyType: "stateVariable",
                variableName: "haveNonNumericalPrescribedCenter",
              };
              dependencies.numericalPrescribedCenter = {
                dependencyType: "stateVariable",
                variableName: "numericalPrescribedCenter",
              };
              dependencies.haveNonNumericalThroughPoints = {
                dependencyType: "stateVariable",
                variableName: "haveNonNumericalThroughPoints",
              };
              dependencies.numericalThroughPoints = {
                dependencyType: "stateVariable",
                variableName: "numericalThroughPoints",
              };
            }
          } else if (stateValues.numThroughPoints > 1) {
            dependencies.numericalRadiusCalculatedWithCenter = {
              dependencyType: "stateVariable",
              variableName: "numericalRadiusCalculatedWithCenter",
            };
            // need numericalThroughPoints for inverse definition
            // as skip numericalRadiusCalculatedWithCenter
            dependencies.numericalThroughPoints = {
              dependencyType: "stateVariable",
              variableName: "numericalThroughPoints",
            };
          }
        }

        return dependencies;
      },
      definition: function ({ dependencyValues }) {
        // console.log(`definition of numericalRadius of circle`);
        // console.log(dependencyValues);

        if (
          dependencyValues.haveNonNumericalPrescribedRadius ||
          dependencyValues.haveNonNumericalPrescribedCenter ||
          dependencyValues.haveNonNumericalThroughPoints
        ) {
          return {
            setValue: {
              numericalRadius: NaN,
            },
          };
        }

        if (dependencyValues.numericalPrescribedRadius !== undefined) {
          if (dependencyValues.haveCenterRadiusPoints) {
            // Don't need warning here, as have warning in haveCenterRadiusPoints
            return {
              setValue: { numericalRadius: NaN },
            };
          }

          return {
            setValue: {
              numericalRadius: Math.max(
                0,
                dependencyValues.numericalPrescribedRadius,
              ),
            },
          };
        }

        if (dependencyValues.numericalPrescribedCenter !== undefined) {
          if (dependencyValues.numThroughPoints === 0) {
            let r = dependencyValues.essentialRadius;
            if (r instanceof me.class) {
              r = r.evaluate_to_constant();
            }
            return {
              setValue: { numericalRadius: r },
            };
          } else if (dependencyValues.numThroughPoints === 1) {
            // center and one point specified.
            // Radius is distance from center to point.
            let pt = dependencyValues.numericalThroughPoints[0];
            if (pt === undefined) {
              // if dependencies haven't been updated,
              // it is possible to temporarility have fewer numericalThroughPoints
              // than numThroughPoints
              return { setValue: { numericalRadius: NaN } };
            }
            let numericalRadius = Math.sqrt(
              Math.pow(
                pt[0] - dependencyValues.numericalPrescribedCenter[0],
                2,
              ) +
                Math.pow(
                  pt[1] - dependencyValues.numericalPrescribedCenter[1],
                  2,
                ),
            );
            return { setValue: { numericalRadius } };
          } else {
            let warning = {
              message:
                "Cannot calculate circle with specified center through more than 1 point.",
              level: 1,
            };

            return {
              setValue: { numericalRadius: NaN },
              sendWarnings: [warning],
            };
          }
        }

        // don't have prescribed center
        if (dependencyValues.numThroughPoints < 2) {
          let r = dependencyValues.essentialRadius;
          if (r instanceof me.class) {
            r = r.evaluate_to_constant();
          }
          return {
            setValue: { numericalRadius: r },
          };
        } else {
          // having two or three through points
          // with no prescribed radius or center
          // is case where calculated radius and center together.
          return {
            setValue: {
              numericalRadius:
                dependencyValues.numericalRadiusCalculatedWithCenter,
            },
          };
        }
      },
      inverseDefinition: async function ({
        desiredStateVariableValues,
        dependencyValues,
        stateValues,
      }) {
        // console.log('inverse definition of numericalRadius of circle')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)

        if (dependencyValues.numericalPrescribedRadius !== undefined) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "numericalPrescribedRadius",
                desiredValue: Math.max(
                  0,
                  desiredStateVariableValues.numericalRadius,
                ),
              },
            ],
          };
        }

        if (dependencyValues.numericalPrescribedCenter !== undefined) {
          if (dependencyValues.numThroughPoints === 0) {
            return {
              success: true,
              instructions: [
                {
                  setDependency: "essentialRadius",
                  desiredValue: Math.max(
                    0,
                    desiredStateVariableValues.numericalRadius,
                  ),
                },
              ],
            };
          } else if (dependencyValues.numThroughPoints === 1) {
            let numericalRadius = Math.max(
              0,
              desiredStateVariableValues.numericalRadius,
            );

            let theta = (await stateValues.throughAngles)[0];
            if (!Number.isFinite(theta)) {
              return { success: false };
            }
            let numericalCenter = await stateValues.numericalCenter;
            let pt = [
              numericalCenter[0] + numericalRadius * Math.cos(theta),
              numericalCenter[1] + numericalRadius * Math.sin(theta),
            ];

            return {
              success: true,
              instructions: [
                {
                  setDependency: "numericalThroughPoints",
                  desiredValue: [pt],
                },
              ],
            };
          } else {
            return { success: false };
          }
        }

        // don't have prescribed center
        if (dependencyValues.numThroughPoints < 2) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "essentialRadius",
                desiredValue: Math.max(
                  0,
                  desiredStateVariableValues.numericalRadius,
                ),
              },
            ],
          };
        } else {
          let newThroughPoints = [];

          let numericalRadius = Math.max(
            0,
            desiredStateVariableValues.numericalRadius,
          );

          for (let i = 0; i < dependencyValues.numThroughPoints; i++) {
            let theta = (await stateValues.throughAngles)[i];
            if (!Number.isFinite(theta)) {
              return { success: false };
            }
            let numericalCenter = await stateValues.numericalCenter;
            let pt = [
              numericalCenter[0] + numericalRadius * Math.cos(theta),
              numericalCenter[1] + numericalRadius * Math.sin(theta),
            ];

            newThroughPoints.push(pt);
          }

          return {
            success: true,
            instructions: [
              {
                setDependency: "numericalThroughPoints",
                desiredValue: newThroughPoints,
              },
            ],
          };
        }
      },
    };

    stateVariableDefinitions.essentialCenter = {
      isLocation: true,
      isArray: true,
      entryPrefixes: ["essentialCenterX"],
      hasEssential: true,
      defaultValueByArrayKey: () => 0,
      returnArraySizeDependencies: () => ({}),
      returnArraySize() {
        return [2];
      },
      returnArrayDependenciesByKey: () => ({}),
      arrayDefinitionByKey: function ({ arrayKeys }) {
        let essentialCenter = {};
        for (let arrayKey of arrayKeys) {
          essentialCenter[arrayKey] = true;
        }
        return {
          useEssentialOrDefaultValue: { essentialCenter },
        };
      },
      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        stateValues,
        workspace,
      }) {
        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.essentialCenter) {
          instructions.push({
            setEssentialValue: "essentialCenter",
            value: {
              [arrayKey]: desiredStateVariableValues.essentialCenter[arrayKey],
            },
          });
        }
        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.numericalCenter = {
      forRenderer: true,
      isArray: true,
      entryPrefixes: ["numericalCenterX"],
      stateVariablesDeterminingDependencies: [
        "numThroughPoints",
        "havePrescribedCenter",
        "havePrescribedRadius",
      ],
      returnArraySizeDependencies: () => ({}),
      returnArraySize() {
        return [2];
      },
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let globalDependencies = {
          haveCenterRadiusPoints: {
            dependencyType: "stateVariable",
            variableName: "haveCenterRadiusPoints",
          },
        };

        let dependenciesByKey = {};

        if (stateValues.havePrescribedCenter) {
          for (let arrayKey of arrayKeys) {
            let varEnding = Number(arrayKey) + 1;
            dependenciesByKey[arrayKey] = {
              numericalPrescribedCenterX: {
                dependencyType: "stateVariable",
                variableName: "numericalPrescribedCenterX" + varEnding,
              },
            };
          }
        } else {
          for (let arrayKey of arrayKeys) {
            let varEnding = Number(arrayKey) + 1;
            dependenciesByKey[arrayKey] = {
              essentialCenterX: {
                dependencyType: "stateVariable",
                variableName: "essentialCenterX" + varEnding,
              },
            };
          }
          globalDependencies.numThroughPoints = {
            dependencyType: "stateVariable",
            variableName: "numThroughPoints",
          };
          globalDependencies.numericalThroughPoints = {
            dependencyType: "stateVariable",
            variableName: "numericalThroughPoints",
          };
          globalDependencies.haveNonNumericalThroughPoints = {
            dependencyType: "stateVariable",
            variableName: "haveNonNumericalThroughPoints",
          };

          if (stateValues.havePrescribedRadius) {
            // still used numericalRadius, rather than numericalPrescribedRadius
            // as numericalRadius becomes zero if have negative numericalPrescribedRadius
            globalDependencies.numericalRadius = {
              dependencyType: "stateVariable",
              variableName: "numericalRadius",
            };
          } else if (stateValues.numThroughPoints == 1) {
            // if didn't have prescribed radius but just one point
            // we treat the radius calculated above as prescribed
            globalDependencies.numericalRadius = {
              dependencyType: "stateVariable",
              variableName: "numericalRadius",
            };
          } else if (stateValues.numThroughPoints > 1) {
            globalDependencies.numericalCenterCalculatedWithRadius = {
              dependencyType: "stateVariable",
              variableName: "numericalCenterCalculatedWithRadius",
            };
          }
        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey: function ({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        // console.log(`definition of numericalCenter of circle`);
        // console.log(globalDependencyValues);
        // console.log(dependencyValuesByKey);
        // console.log(arrayKeys)

        let numericalCenter = {};

        for (let arrayKey of arrayKeys) {
          if (
            dependencyValuesByKey[arrayKey].numericalPrescribedCenterX !==
            undefined
          ) {
            if (globalDependencyValues.haveCenterRadiusPoints) {
              // Don't need warning here, as have warning in haveCenterRadiusPoints
              return {
                setValue: { numericalCenter: [NaN, NaN] },
              };
            }
            numericalCenter[arrayKey] =
              dependencyValuesByKey[arrayKey].numericalPrescribedCenterX;
          }
        }
        if (Object.keys(numericalCenter).length > 0) {
          return { setValue: { numericalCenter } };
        }

        if (
          globalDependencyValues.haveNonNumericalPrescribedRadius ||
          globalDependencyValues.haveNonNumericalThroughPoints
        ) {
          return {
            setValue: {
              numericalCenter: [NaN, NaN],
            },
          };
        }

        if (globalDependencyValues.numericalRadius !== undefined) {
          // have a radius defined and no center
          if (globalDependencyValues.numThroughPoints === 0) {
            // only radius specified.  use essential center

            for (let arrayKey of arrayKeys) {
              let value = dependencyValuesByKey[arrayKey].essentialCenterX;

              if (value instanceof me.class) {
                value = value.evaluate_to_constant();
              }
              numericalCenter[arrayKey] = value;
            }

            return { setValue: { numericalCenter } };
          } else if (globalDependencyValues.numThroughPoints === 1) {
            // radius and one through point
            // create a circle with top being the point

            if (globalDependencyValues.numericalThroughPoints.length < 1) {
              // if dependencies haven't been updated,
              // it is possible to temporarility have fewer numericalThroughPoints
              // than numThroughPoints
              return { setValue: { numericalCenter: [NaN, NaN] } };
            }

            let numericalCenter = [
              globalDependencyValues.numericalThroughPoints[0][0],
              globalDependencyValues.numericalThroughPoints[0][1] -
                globalDependencyValues.numericalRadius,
            ];

            return { setValue: { numericalCenter } };
          } else if (globalDependencyValues.numThroughPoints === 2) {
            if (globalDependencyValues.numericalThroughPoints.length < 2) {
              // if dependencies haven't been updated,
              // it is possible to temporarility have fewer numericalThroughPoints
              // than numThroughPoints
              return { setValue: { numericalCenter: [NaN, NaN] } };
            }

            // find circle through two points with given radius
            let r = globalDependencyValues.numericalRadius;

            let x1 = globalDependencyValues.numericalThroughPoints[0][0];
            let x2 = globalDependencyValues.numericalThroughPoints[1][0];
            let y1 = globalDependencyValues.numericalThroughPoints[0][1];
            let y2 = globalDependencyValues.numericalThroughPoints[1][1];

            let dist2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
            let r2 = r * r;

            if (r < 0 || 4 * r2 < dist2) {
              let dist = Math.round(Math.sqrt(dist2) * 100) / 100;
              let warning = {
                message: `Cannot calculate circle: given that the distance between the two points is ${dist}, the specified radius ${r} is too small.`,
                level: 1,
              };
              return {
                setValue: { numericalCenter: [NaN, NaN] },
                sendWarnings: [warning],
              };
            }

            if (dist2 === 0) {
              // points are equal to each other, treat as through single point
              return { setValue: { numericalCenter: [x1, y1 - r] } };
            }

            let centerx =
              (0.5 *
                (dist2 * (x1 + x2) +
                  (y1 - y2) * Math.sqrt((4 * r2 - dist2) * dist2))) /
              dist2;

            let centery =
              (0.5 *
                (dist2 * (y1 + y2) +
                  (x2 - x1) * Math.sqrt((4 * r2 - dist2) * dist2))) /
              dist2;

            return { setValue: { numericalCenter: [centerx, centery] } };
          } else {
            let warning = {
              message:
                "Cannot create circle through more than two points with a specified radius.",
              level: 1,
            };
            return {
              setValue: { numericalCenter: [NaN, NaN] },
              sendWarnings: [warning],
            };
          }
        }

        // don't have prescribed radius
        if (globalDependencyValues.numThroughPoints === 0) {
          for (let arrayKey of arrayKeys) {
            let value = dependencyValuesByKey[arrayKey].essentialCenterX;

            if (value instanceof me.class) {
              value = value.evaluate_to_constant();
            }
            numericalCenter[arrayKey] = value;
          }

          return { setValue: { numericalCenter } };
        } else {
          // Must have at least two points, as case with one through point
          // used calculated radius

          // having two or three through points
          // with no prescribed radius or center
          // is case where calculated radius and center together.

          if (
            globalDependencyValues.numericalCenterCalculatedWithRadius ===
            undefined
          ) {
            // if numThroughPoints changed, but dependencies haven't been recalculated yet
            // could get to here where don't have numericalCenterCalculatedWithRadius
            return {
              setValue: {
                numericalCenter: [NaN, NaN],
              },
            };
          } else {
            return {
              setValue: {
                numericalCenter:
                  globalDependencyValues.numericalCenterCalculatedWithRadius,
              },
            };
          }
        }
      },
      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        stateValues,
        workspace,
      }) {
        // console.log('inverse definition of numericalCenter of circle')
        // console.log(desiredStateVariableValues)
        // console.log(globalDependencyValues)
        // console.log(dependencyValuesByKey)

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.numericalCenter) {
          if (
            dependencyValuesByKey[arrayKey].numericalPrescribedCenterX !==
            undefined
          ) {
            instructions.push({
              setDependency:
                dependencyNamesByKey[arrayKey].numericalPrescribedCenterX,
              desiredValue:
                desiredStateVariableValues.numericalCenter[arrayKey],
            });
          }
        }

        if (instructions.length > 0) {
          return {
            success: true,
            instructions,
          };
        }

        if (globalDependencyValues.numThroughPoints === 0) {
          // just change value of essentialCenter
          for (let arrayKey in desiredStateVariableValues.numericalCenter) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].essentialCenterX,
              desiredValue:
                desiredStateVariableValues.numericalCenter[arrayKey],
            });
          }
          return {
            success: true,
            instructions,
          };
        } else {
          // in case just one key specified, merge with previous values
          if (!workspace.desiredCenter) {
            workspace.desiredCenter = {};
          }
          for (let key = 0; key < 2; key++) {
            if (desiredStateVariableValues.numericalCenter[key] !== undefined) {
              workspace.desiredCenter[key] =
                desiredStateVariableValues.numericalCenter[key];
            } else if (workspace.desiredCenter[key] === undefined) {
              workspace.desiredCenter[key] = stateValues.numericalCenter[key];
            }
          }

          let newThroughPoints = [];

          let throughAngles = await stateValues.throughAngles;
          let numericalRadius = await stateValues.numericalRadius;

          for (let i = 0; i < globalDependencyValues.numThroughPoints; i++) {
            let theta = throughAngles[i];
            if (!Number.isFinite(theta)) {
              return { success: false };
            }
            let pt = [
              workspace.desiredCenter[0] + numericalRadius * Math.cos(theta),
              workspace.desiredCenter[1] + numericalRadius * Math.sin(theta),
            ];

            newThroughPoints.push(pt);
          }

          return {
            success: true,
            instructions: [
              {
                setDependency: "numericalThroughPoints",
                desiredValue: newThroughPoints,
              },
            ],
          };
        }
      },
    };

    stateVariableDefinitions.throughAngles = {
      // send to renderer just so it can try to preserve original angles
      // when dragging circle based on points with constraints
      forRenderer: true,
      isLocation: true,
      defaultValue: [],
      hasEssential: true,
      doNotShadowEssential: true,
      returnDependencies: () => ({
        haveNumericalEntries: {
          dependencyType: "stateVariable",
          variableName: "haveNumericalEntries",
        },
        numThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numThroughPoints",
        },
        numericalThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numericalThroughPoints",
        },
        numericalRadius: {
          dependencyType: "stateVariable",
          variableName: "numericalRadius",
        },
        numericalCenter: {
          dependencyType: "stateVariable",
          variableName: "numericalCenter",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (
          !(
            dependencyValues.haveNumericalEntries &&
            dependencyValues.numThroughPoints > 0 &&
            dependencyValues.numericalRadius > 0 &&
            dependencyValues.numericalCenter.every((x) => Number.isFinite(x))
          )
        ) {
          return {
            useEssentialOrDefaultValue: {
              throughAngles: true,
            },
          };
        }

        // if have through points, numeric entries and positive radius
        // calculate angles
        let throughAngles = [];
        for (let pt of dependencyValues.numericalThroughPoints) {
          throughAngles.push(
            Math.atan2(
              pt[1] - dependencyValues.numericalCenter[1],
              pt[0] - dependencyValues.numericalCenter[0],
            ),
          );
        }

        // make throughAngles essential so that can save their values
        // even if values become invalid (such as radius becoming zero)
        return {
          setValue: { throughAngles },
          setEssentialValue: { throughAngles },
        };
      },
    };

    stateVariableDefinitions.radius = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      stateVariablesDeterminingDependencies: [
        "numThroughPoints",
        "havePrescribedCenter",
        "havePrescribedRadius",
      ],
      returnDependencies: function ({ stateValues }) {
        let dependencies = {
          numericalRadius: {
            dependencyType: "stateVariable",
            variableName: "numericalRadius",
          },
          numThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "numThroughPoints",
          },
          essentialRadius: {
            dependencyType: "stateVariable",
            variableName: "essentialRadius",
          },
          haveCenterRadiusPoints: {
            dependencyType: "stateVariable",
            variableName: "haveCenterRadiusPoints",
          },
        };

        if (stateValues.havePrescribedRadius) {
          dependencies.prescribedRadius = {
            dependencyType: "stateVariable",
            variableName: "prescribedRadius",
          };
        } else {
          if (
            stateValues.havePrescribedCenter &&
            stateValues.numThroughPoints >= 1
          ) {
            dependencies.prescribedCenter = {
              dependencyType: "stateVariable",
              variableName: "prescribedCenter",
            };
            dependencies.throughPoints = {
              dependencyType: "stateVariable",
              variableName: "throughPoints",
            };
          }
        }
        return dependencies;
      },
      definition: function ({ dependencyValues }) {
        // console.log(`definition of radius of circle`);
        // console.log(dependencyValues);

        if (Number.isFinite(dependencyValues.numericalRadius)) {
          return {
            setValue: {
              radius: me.fromAst(dependencyValues.numericalRadius),
            },
          };
        }

        if (dependencyValues.prescribedRadius !== undefined) {
          if (dependencyValues.haveCenterRadiusPoints) {
            // Don't need warning here, as have warning in haveCenterRadiusPoints
            return {
              setValue: { radius: me.fromAst("\uff3f") },
            };
          }
          return {
            setValue: {
              radius: dependencyValues.prescribedRadius,
            },
          };
        }

        if (dependencyValues.prescribedCenter !== undefined) {
          if (dependencyValues.numThroughPoints === 0) {
            let r = dependencyValues.essentialRadius;
            if (!(r instanceof me.class)) {
              if (Number.isFinite(r)) {
                r = me.fromAst(r);
              } else {
                r = me.fromAst("\uff3f");
              }
            }
            return {
              setValue: { radius: r },
            };
          } else if (dependencyValues.numThroughPoints === 1) {
            // center and one point specified.
            // Radius is distance from center to point.

            try {
              let pt = dependencyValues.throughPoints[0];
              let ptx = pt[0];
              let pty = pt[1];
              let ctx = dependencyValues.prescribedCenter[0];
              let cty = dependencyValues.prescribedCenter[1];

              let radius = ptx
                .subtract(ctx)
                .pow(2)
                .add(pty.subtract(cty).pow(2))
                .pow(0.5)
                .simplify();

              return { setValue: { radius } };
            } catch (e) {
              let warning = {
                message: "Invalid center or through points of circle.",
                level: 1,
              };
              return {
                setValue: { radius: me.fromAst("\uff3f") },
                sendWarnings: [warning],
              };
            }
          } else {
            let warning = {
              message:
                "Cannot calculate radius of circle with specified center through more than 1 point.",
              level: 1,
            };
            return {
              setValue: { radius: me.fromAst("\uff3f") },
              sendWarnings: [warning],
            };
          }
        }

        // don't have prescribed center
        if (dependencyValues.numThroughPoints < 2) {
          let r = dependencyValues.essentialRadius;
          if (!(r instanceof me.class)) {
            if (Number.isFinite(r)) {
              r = me.fromAst(r);
            } else {
              r = me.fromAst("\uff3f");
            }
          }
          return {
            setValue: { radius: r },
          };
        } else {
          // having two or three through points
          // with no prescribed radius or center

          // Note: no need to send warning here as already did
          // in definition of numericalRadiusCalculatedWithCenter

          return {
            setValue: { radius: me.fromAst("\uff3f") },
          };
        }
      },
      inverseDefinition: function ({
        desiredStateVariableValues,
        dependencyValues,
      }) {
        // console.log("inverse definition of radius of circle");
        // console.log(desiredStateVariableValues);
        // console.log(dependencyValues);

        let numericalRadius =
          desiredStateVariableValues.radius.evaluate_to_constant();

        if (
          Number.isFinite(numericalRadius) &&
          Number.isFinite(dependencyValues.numericalRadius)
        ) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "numericalRadius",
                desiredValue: numericalRadius,
              },
            ],
          };
        }

        if (dependencyValues.prescribedRadius !== undefined) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "prescribedRadius",
                desiredValue: desiredStateVariableValues.radius,
              },
            ],
          };
        }

        if (dependencyValues.numThroughPoints === 0) {
          // just change essential value of radius
          // (and numericalRadius if we have a numerical radius)
          let instructions = [
            {
              setDependency: "essentialRadius",
              desiredValue: desiredStateVariableValues.radius,
            },
          ];

          return {
            success: true,
            instructions,
          };
        } else {
          let warning = {
            message:
              "Cannot change radius of circle with non-numerical through points",
            level: 1,
          };
          return { success: false, sendWarnings: [warning] };
        }
      },
    };

    stateVariableDefinitions.diameter = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        radius: {
          dependencyType: "stateVariable",
          variableName: "radius",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            diameter: dependencyValues.radius.multiply(2).simplify(),
          },
        };
      },
      inverseDefinition: function ({
        desiredStateVariableValues,
        dependencyValues,
      }) {
        return {
          success: true,
          instructions: [
            {
              setDependency: "radius",
              desiredValue: desiredStateVariableValues.diameter
                .divide(2)
                .simplify(),
            },
          ],
        };
      },
    };

    stateVariableDefinitions.circumference = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        radius: {
          dependencyType: "stateVariable",
          variableName: "radius",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            circumference: dependencyValues.radius
              .multiply(me.fromAst(["*", 2, "pi"]))
              .simplify(),
          },
        };
      },
    };

    stateVariableDefinitions.area = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        radius: {
          dependencyType: "stateVariable",
          variableName: "radius",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            area: dependencyValues.radius
              .multiply(dependencyValues.radius)
              .multiply(me.fromAst("pi"))
              .simplify(),
          },
        };
      },
    };

    stateVariableDefinitions.center = {
      forRenderer: true,
      isLocation: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "centerX") {
            return [];
          } else {
            // entire array
            // wrap by both <point> and <xs>
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          }
        },
      },
      isArray: true,
      entryPrefixes: ["centerX"],
      stateVariablesDeterminingDependencies: [
        "numThroughPoints",
        "havePrescribedCenter",
        "havePrescribedRadius",
      ],
      returnArraySizeDependencies: () => ({}),
      returnArraySize() {
        return [2];
      },
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        // console.log(`array dependencies by key for circle center`)
        // console.log(arrayKeys)
        // console.log(stateValues);

        let globalDependencies = {
          haveCenterRadiusPoints: {
            dependencyType: "stateVariable",
            variableName: "haveCenterRadiusPoints",
          },
        };
        let dependenciesByKey = {};

        if (stateValues.havePrescribedCenter) {
          // if have prescribed center, we separate dependencies by key

          // add havePrescribedCenter as a value
          // so that it changes only when dependencies are recalculated
          globalDependencies.havePrescribedCenter = {
            dependencyType: "value",
            value: true,
          };

          for (let arrayKey of arrayKeys) {
            let varEnding = Number(arrayKey) + 1;
            dependenciesByKey[arrayKey] = {
              numericalCenterX: {
                dependencyType: "stateVariable",
                variableName: "numericalCenterX" + varEnding,
              },
              prescribedCenterX: {
                dependencyType: "stateVariable",
                variableName: "prescribedCenterX" + varEnding,
              },
            };
          }
        } else {
          for (let arrayKey of arrayKeys) {
            let varEnding = Number(arrayKey) + 1;
            dependenciesByKey[arrayKey] = {
              essentialCenterX: {
                dependencyType: "stateVariable",
                variableName: "essentialCenterX" + varEnding,
              },
            };
          }

          // if don't have a prescribed center, we used global dependencies
          // (other than essential center)
          globalDependencies.numericalCenter = {
            dependencyType: "stateVariable",
            variableName: "numericalCenter",
          };

          globalDependencies.numThroughPoints = {
            dependencyType: "stateVariable",
            variableName: "numThroughPoints",
          };
          globalDependencies.throughPoints = {
            dependencyType: "stateVariable",
            variableName: "throughPoints",
          };

          if (stateValues.havePrescribedRadius) {
            // we call prescribedRadius as radius
            // as we will treat the same as calculated radius
            // for case with one through point
            globalDependencies.radius = {
              dependencyType: "stateVariable",
              variableName: "prescribedRadius",
            };
            globalDependencies.haveNonNumericalPrescribedRadius = {
              dependencyType: "stateVariable",
              variableName: "haveNonNumericalPrescribedRadius",
            };
            if (stateValues.numThroughPoints > 1) {
              globalDependencies.haveNonNumericalThroughPoints = {
                dependencyType: "stateVariable",
                variableName: "haveNonNumericalThroughPoints",
              };
            }
          } else if (stateValues.numThroughPoints == 1) {
            // if didn't have prescribed radius but just one point
            // we treat the radius calculated above as prescribed
            globalDependencies.radius = {
              dependencyType: "stateVariable",
              variableName: "radius",
            };
          } else if (stateValues.numThroughPoints > 1) {
            globalDependencies.haveNonNumericalThroughPoints = {
              dependencyType: "stateVariable",
              variableName: "haveNonNumericalThroughPoints",
            };
          }
        }

        return { dependenciesByKey, globalDependencies };
      },
      arrayDefinitionByKey: function ({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        // console.log(`definition of center of circle`);
        // console.log(globalDependencyValues);
        // console.log(dependencyValuesByKey);

        if (globalDependencyValues.havePrescribedCenter) {
          if (globalDependencyValues.haveCenterRadiusPoints) {
            // Don't need warning here, as have warning in haveCenterRadiusPoints
            return {
              setValue: {
                center: [me.fromAst("\uff3f"), me.fromAst("\uff3f")],
              },
            };
          }

          let center = {};
          for (let arrayKey of arrayKeys) {
            if (
              Number.isFinite(dependencyValuesByKey[arrayKey].numericalCenterX)
            ) {
              center[arrayKey] = me.fromAst(
                dependencyValuesByKey[arrayKey].numericalCenterX,
              );
            } else {
              center[arrayKey] =
                dependencyValuesByKey[arrayKey].prescribedCenterX;
            }
          }
          return { setValue: { center } };
        }

        if (
          globalDependencyValues.numericalCenter.every((x) =>
            Number.isFinite(x),
          )
        ) {
          return {
            setValue: {
              center: globalDependencyValues.numericalCenter.map((x) =>
                me.fromAst(x),
              ),
            },
          };
        }

        if (globalDependencyValues.radius !== undefined) {
          // have a radius defined and no center
          if (globalDependencyValues.numThroughPoints === 0) {
            // only radius specified.  Create centered at origin as a default.

            let center = {};

            for (let arrayKey of arrayKeys) {
              let value = dependencyValuesByKey[arrayKey].essentialCenterX;
              if (!(value instanceof me.class)) {
                if (Number.isFinite(value)) {
                  value = me.fromAst(value);
                } else {
                  value = me.fromAst("\uff3f");
                }
              }

              center[arrayKey] = value;
            }

            return { setValue: { center } };
          } else if (globalDependencyValues.numThroughPoints === 1) {
            // radius and one through point
            // create a circle with top being the point

            let center;

            // it is possible, as dependency are being worked out
            // that throughPoints[0][1], so catch the resulting error
            try {
              center = [
                globalDependencyValues.throughPoints[0][0],
                globalDependencyValues.throughPoints[0][1]
                  .subtract(globalDependencyValues.radius)
                  .simplify(),
              ];
            } catch (e) {
              center = [me.fromAst("\uff3f"), me.fromAst("\uff3f")];
            }

            return { setValue: { center } };
          } else {
            let warnings = [];

            if (
              globalDependencyValues.haveNonNumericalPrescribedRadius ||
              globalDependencyValues.haveNonNumericalThroughPoints
            ) {
              warnings.push({
                message:
                  "Cannot create circle through more than one point with specified radius when don't have numerical values.",
                level: 1,
              });
            }
            return {
              setValue: {
                center: [me.fromAst("\uff3f"), me.fromAst("\uff3f")],
              },
              sendWarnings: warnings,
            };
          }
        }

        // don't have prescribed radius
        if (globalDependencyValues.numThroughPoints === 0) {
          let center = {};

          for (let arrayKey of arrayKeys) {
            let value = dependencyValuesByKey[arrayKey].essentialCenterX;
            if (!(value instanceof me.class)) {
              if (Number.isFinite(value)) {
                value = me.fromAst(value);
              } else {
                value = me.fromAst("\uff3f");
              }
            }

            center[arrayKey] = value;
          }

          return { setValue: { center } };
        } else {
          // Must have at least two points, as case with one through point
          // used calculated radius

          // Note: no need to send warning here as already did
          // in definition of numericalRadiusCalculatedWithCenter

          return {
            setValue: {
              center: [me.fromAst("\uff3f"), me.fromAst("\uff3f")],
            },
          };
        }
      },

      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        stateValues,
        dependencyNamesByKey,
        workspace,
      }) {
        // console.log('inverse definition of center of circle')
        // console.log(desiredStateVariableValues)
        // console.log(globalDependencyValues)

        if (globalDependencyValues.havePrescribedCenter) {
          let instructions = [];

          for (let arrayKey in desiredStateVariableValues.center) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].prescribedCenterX,
              desiredValue: desiredStateVariableValues.center[arrayKey],
              arrayKey,
            });
          }

          return {
            success: true,
            instructions,
          };
        }

        // since don't have prescribed center
        // we work with global dependency values

        // if have any empty values in desired value,
        // merge with current values, or value from workspace

        if (!workspace.desiredCenter) {
          workspace.desiredCenter = {};
        }

        for (let key = 0; key < 2; key++) {
          if (desiredStateVariableValues.center[key] !== undefined) {
            workspace.desiredCenter[key] =
              desiredStateVariableValues.center[key];
          } else if (workspace.desiredCenter[key] === undefined) {
            workspace.desiredCenter[key] = (await stateValues.center)[key];
          }
        }

        let numericalCenter = [];
        let desiredCenterIsNumeric = true;

        for (let i = 0; i < 2; i++) {
          let component = workspace.desiredCenter[i].evaluate_to_constant();
          if (!Number.isFinite(component)) {
            desiredCenterIsNumeric = false;
            break;
          }
          numericalCenter.push(component);
        }

        if (
          desiredCenterIsNumeric &&
          globalDependencyValues.numericalCenter.every((x) =>
            Number.isFinite(x),
          )
        ) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "numericalCenter",
                desiredValue: numericalCenter,
              },
            ],
          };
        }

        if (globalDependencyValues.numThroughPoints === 0) {
          // just change essential value of center
          // (and numericalCenter if we have a numerical center)

          let instructions = [];

          for (let arrayKey in desiredStateVariableValues.center) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].essentialCenterX,
              desiredValue: desiredStateVariableValues.center[arrayKey],
              arrayKey,
            });
          }

          return {
            success: true,
            instructions,
          };
        } else {
          let warning = {
            message:
              "Haven't implemented changing center of circle through points with non numerical values.",
            level: 1,
          };
          return { success: false, sendWarnings: [warning] };
        }
      },
    };

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        numericalCenter: {
          dependencyType: "stateVariable",
          variableName: "numericalCenter",
        },
        numericalRadius: {
          dependencyType: "stateVariable",
          variableName: "numericalRadius",
        },
      }),
      definition({ dependencyValues }) {
        let radius = dependencyValues.numericalRadius;
        let centerX = dependencyValues.numericalCenter[0];
        let centerY = dependencyValues.numericalCenter[1];
        return {
          setValue: {
            nearestPoint: function ({ variables, scales }) {
              let x1 = variables.x1?.evaluate_to_constant();
              let x2 = variables.x2?.evaluate_to_constant();

              if (!(Number.isFinite(x1) && Number.isFinite(x2))) {
                return {};
              }

              if (
                !(
                  Number.isFinite(centerX) &&
                  Number.isFinite(centerY) &&
                  Number.isFinite(radius)
                )
              ) {
                return {};
              }

              let theta = Math.atan2(x2 - centerY, x1 - centerX);

              let result = {
                x1: centerX + radius * Math.cos(theta),
                x2: centerY + radius * Math.sin(theta),
              };

              if (variables.x3 !== undefined) {
                result.x3 = 0;
              }

              return result;
            },
          },
        };
      },
    };

    return stateVariableDefinitions;
  }

  async moveCircle({
    center,
    radius,
    throughAngles,
    transient,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let instructions = [];

    let numThroughPoints = await this.stateValues.numThroughPoints;
    let numericalPrescribedCenter = await this.stateValues
      .numericalPrescribedCenter;

    if (numThroughPoints <= 1 || numericalPrescribedCenter.length > 0) {
      instructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "numericalCenter",
        value: center,
      });
    }

    let numericalThroughPoints = [];

    if (numThroughPoints >= 1) {
      // set numerical through points for two reasons
      // 1. if have circle prescribed by center and one point
      //    need to move the point to preserve the radius
      // 2. if have through points that are constrained/attracted
      //    to objects, set through points to attempt to keep their relative
      //    positions constant even as they get adjusted by the constraints

      if (throughAngles === undefined) {
        throughAngles = await this.stateValues.throughAngles;
      }
      if (radius === undefined) {
        radius = await this.stateValues.numericalRadius;
      }

      for (let i = 0; i < numThroughPoints; i++) {
        let theta = throughAngles[i];
        let pt = [
          center[0] + radius * Math.cos(theta),
          center[1] + radius * Math.sin(theta),
        ];
        numericalThroughPoints.push(pt);
      }

      instructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "numericalThroughPoints",
        value: numericalThroughPoints,
      });
    }

    // Note: we set skipRendererUpdate to true
    // so that we can make further adjustments before the renderers are updated
    if (transient) {
      await this.coreFunctions.performUpdate({
        updateInstructions: instructions,
        transient,
        actionId,
        sourceInformation,
        skipRendererUpdate: true,
      });
    } else {
      await this.coreFunctions.performUpdate({
        updateInstructions: instructions,
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
            center,
          },
        },
      });
    }

    // we attempt to keep the radius of the circle fixed
    // even if one of the points defining it is constrained

    // if circle is based on more than 1 point (center or throughpoints)
    // and a subset of those points appear to be constrained while preserving their relationship
    // then move the other points in attempt to preserve their relationship with the constrained points,
    // which will keep the radius of the circle fixed

    let resultingCenter = await this.stateValues.numericalCenter;
    let resultingNumericalThroughPoints = await this.stateValues
      .numericalThroughPoints;
    let tol = 1e-6;

    if (numericalPrescribedCenter.length > 0 && numThroughPoints === 1) {
      // center and one through point

      let throughPointUnchanged = numericalThroughPoints[0].every(
        (v, i) => v === resultingNumericalThroughPoints[0][i],
      );

      let centerUnchanged = center.every((v, i) => v === resultingCenter[i]);

      if (throughPointUnchanged && !centerUnchanged) {
        let theta = throughAngles[0];
        let newNumericalThroughPoints = [
          [
            resultingCenter[0] + radius * Math.cos(theta),
            resultingCenter[1] + radius * Math.sin(theta),
          ],
        ];

        let newInstructions = [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "numericalThroughPoints",
            value: newNumericalThroughPoints,
          },
        ];
        return await this.coreFunctions.performUpdate({
          updateInstructions: newInstructions,
          transient,
          actionId,
          sourceInformation,
          skipRendererUpdate,
        });
      } else if (centerUnchanged && !throughPointUnchanged) {
        let theta = throughAngles[0];
        let newCenter = [
          resultingNumericalThroughPoints[0][0] - radius * Math.cos(theta),
          resultingNumericalThroughPoints[0][1] - radius * Math.sin(theta),
        ];

        let newInstructions = [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "numericalCenter",
            value: newCenter,
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
    } else if (numThroughPoints >= 2) {
      let throughPointsChanged = [];
      let numThroughPointsChanged = 0;

      for (let [ind, pt] of numericalThroughPoints.entries()) {
        if (
          !pt.every(
            (v, i) =>
              Math.abs(v - resultingNumericalThroughPoints[ind][i]) < tol,
          )
        ) {
          throughPointsChanged.push(ind);
          numThroughPointsChanged++;
        }
      }

      if (
        numThroughPointsChanged > 0 &&
        numThroughPointsChanged < numThroughPoints
      ) {
        // A subset of points were altered from the requested location.
        // Check to see if the relationship among them is preserved

        let changedInd1 = throughPointsChanged[0];
        let relationshipPreserved = true;

        if (numThroughPointsChanged > 1) {
          let orig1 = numericalThroughPoints[changedInd1];
          let changed1 = resultingNumericalThroughPoints[changedInd1];

          let changevec1 = orig1.map((v, i) => v - changed1[i]);

          for (let ind of throughPointsChanged.slice(1)) {
            let orig2 = numericalThroughPoints[ind];
            let changed2 = resultingNumericalThroughPoints[ind];
            let changevec2 = orig2.map((v, i) => v - changed2[i]);

            if (
              !changevec1.every((v, i) => Math.abs(v - changevec2[i]) < tol)
            ) {
              relationshipPreserved = false;
              break;
            }
          }
        }

        if (relationshipPreserved) {
          let thetaOfChanged = throughAngles[changedInd1];

          let newCenter = [
            resultingNumericalThroughPoints[changedInd1][0] -
              radius * Math.cos(thetaOfChanged),
            resultingNumericalThroughPoints[changedInd1][1] -
              radius * Math.sin(thetaOfChanged),
          ];

          let newNumericalThroughPoints = [];

          for (let i = 0; i < numThroughPoints; i++) {
            if (throughPointsChanged.includes(i)) {
              newNumericalThroughPoints.push(
                resultingNumericalThroughPoints[i],
              );
            } else {
              let theta = throughAngles[i];
              let pt = [
                newCenter[0] + radius * Math.cos(theta),
                newCenter[1] + radius * Math.sin(theta),
              ];
              newNumericalThroughPoints.push(pt);
            }
          }

          let newInstructions = [
            {
              updateType: "updateValue",
              componentName: this.componentName,
              stateVariable: "numericalThroughPoints",
              value: newNumericalThroughPoints,
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
    }

    // if no modifications were made, still need to update renderers
    // as original update was performed with skipping renderer update
    return await this.coreFunctions.updateRenderers({
      actionId,
      sourceInformation,
      skipRendererUpdate,
    });
  }

  async circleClicked({
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

  async circleFocused({
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

function circleFromTwoNumericalPoints({ point1, point2 }) {
  console.log({ point1, point2 });
  let xcenter = (point1[0] + point2[0]) / 2;
  let ycenter = (point1[1] + point2[1]) / 2;
  let numericalCenter = [xcenter, ycenter];
  let numericalRadius = Math.sqrt(
    Math.pow(xcenter - point1[0], 2) + Math.pow(ycenter - point1[1], 2),
  );
  return { numericalCenter, numericalRadius };
}
