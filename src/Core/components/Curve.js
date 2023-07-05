import GraphicalComponent from "./abstract/GraphicalComponent";
import { returnBreakStringsSugarFunction } from "./commonsugar/breakstrings";

import me from "math-expressions";
import { returnBezierFunctions } from "../utils/function";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
import { returnWrapNonLabelsSugarFunction } from "../utils/label";

export default class Curve extends GraphicalComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      moveControlVector: this.moveControlVector.bind(this),
      moveThroughPoint: this.moveThroughPoint.bind(this),
      changeVectorControlDirection:
        this.changeVectorControlDirection.bind(this),
      switchCurve: this.switchCurve.bind(this),
      curveClicked: this.curveClicked.bind(this),
      curveFocused: this.curveFocused.bind(this),
    });
  }
  static componentType = "curve";
  static rendererType = "curve";

  static primaryStateVariableForDefinition = "fShadow";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
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
      validValues: [
        "upperright",
        "upperleft",
        "lowerright",
        "lowerleft",
        "top",
        "bottom",
        "left",
        "right",
      ],
    };

    attributes.flipFunction = {
      createComponentOfType: "boolean",
      createStateVariable: "flipFunction",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };
    attributes.numDiscretizationPoints = {
      createComponentOfType: "number",
      createStateVariable: "numDiscretizationPoints",
      defaultValue: 1000,
      public: true,
    };
    attributes.periodic = {
      createComponentOfType: "boolean",
      createStateVariable: "periodic",
      defaultValue: false,
      public: true,
    };
    attributes.splineTension = {
      createComponentOfType: "number",
      createStateVariable: "splineTension",
      defaultValue: 0.8,
      clamp: [0, 1],
      public: true,
    };
    attributes.extrapolateBackward = {
      createComponentOfType: "boolean",
      createStateVariable: "extrapolateBackward",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };
    attributes.extrapolateForward = {
      createComponentOfType: "boolean",
      createStateVariable: "extrapolateForward",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };
    attributes.splineForm = {
      createComponentOfType: "text",
      createStateVariable: "splineForm",
      defaultValue: "centripetal",
      public: true,
      toLowerCase: true,
      validValues: ["centripetal", "uniform"],
    };
    attributes.variable = {
      createComponentOfType: "_variableName",
      createStateVariable: "variableForChild",
      defaultValue: me.fromAst("x"),
    };

    attributes.through = {
      createComponentOfType: "_pointListComponent",
    };
    attributes.parMin = {
      createComponentOfType: "math",
    };
    attributes.parMax = {
      createComponentOfType: "math",
    };

    attributes.showCoordsWhenDragging = {
      createComponentOfType: "boolean",
      createStateVariable: "showCoordsWhenDragging",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    attributes.nearestPointAsCurve = {
      createComponentOfType: "boolean",
      createStateVariable: "nearestPointAsCurvePrelim",
      defaultValue: false,
    };

    Object.assign(attributes, returnRoundingAttributes());

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakIntoFunctionsByCommas = function (childrenToBreak) {
      let childrenToComponentFunction = (x) => ({
        componentType: "function",
        children: x,
      });

      let breakFunction = returnBreakStringsSugarFunction({
        childrenToComponentFunction,
        mustStripOffOuterParentheses: true,
      });

      let result = breakFunction({ matchedChildren: childrenToBreak });

      let functionChildren = [];

      if (result.success) {
        functionChildren = result.newChildren;
      } else {
        // if didn't succeed,
        // then just wrap children with a function
        functionChildren = [
          {
            componentType: "function",
            children: childrenToBreak,
          },
        ];
      }
      return functionChildren;
    };

    sugarInstructions.push({
      replacementFunction: returnWrapNonLabelsSugarFunction({
        onlyStringOrMacros: true,
        customWrappingFunction: breakIntoFunctionsByCommas,
      }),
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    let childGroups = super.returnChildGroups();

    childGroups.push(
      ...[
        {
          group: "functions",
          componentTypes: ["function"],
        },
        {
          group: "bezierControls",
          componentTypes: ["bezierControls"],
        },
      ],
    );

    return childGroups;
  }

  static returnStateVariableDefinitions({ numerics }) {
    let stateVariableDefinitions = super.returnStateVariableDefinitions({
      numerics,
    });

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
          dependencyValues.styleDescription + " curve";

        return { setValue: { styleDescriptionWithNoun } };
      },
    };

    // fShadow will be null unless curve was created via an adapter
    // In case of adapter,
    // given the primaryStateVariableForDefinition static variable,
    // the definition of fShadow will be changed to be the value
    // that shadows the component adapted
    stateVariableDefinitions.fShadow = {
      defaultValue: null,
      isLocation: true,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          fShadow: true,
        },
      }),
    };

    stateVariableDefinitions.fromVectorValuedFunctionOfDim = {
      returnDependencies: () => ({
        functionChildren: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["numOutputs"],
        },
        fShadow: {
          dependencyType: "stateVariable",
          variableName: "fShadow",
        },
      }),
      definition({ dependencyValues }) {
        let fromVectorValuedFunctionOfDim = 0;

        if (
          dependencyValues.functionChildren.length === 1 &&
          dependencyValues.functionChildren[0].stateValues.numOutputs > 1
        ) {
          fromVectorValuedFunctionOfDim =
            dependencyValues.functionChildren[0].stateValues.numOutputs;
        } else if (
          dependencyValues.functionChildren.length === 0 &&
          dependencyValues.fShadow?.length > 1
        ) {
          fromVectorValuedFunctionOfDim = dependencyValues.fShadow.length;
        }

        return { setValue: { fromVectorValuedFunctionOfDim } };
      },
    };

    stateVariableDefinitions.curveType = {
      forRenderer: true,
      returnDependencies: () => ({
        functionChildren: {
          dependencyType: "child",
          childGroups: ["functions"],
        },
        fromVectorValuedFunctionOfDim: {
          dependencyType: "stateVariable",
          variableName: "fromVectorValuedFunctionOfDim",
        },
        through: {
          dependencyType: "attributeComponent",
          attributeName: "through",
        },
      }),
      definition({ dependencyValues }) {
        let curveType = "function";
        if (dependencyValues.through !== null) {
          curveType = "bezier";
        } else if (
          dependencyValues.functionChildren.length > 1 ||
          dependencyValues.fromVectorValuedFunctionOfDim > 1
        ) {
          curveType = "parameterization";
        }

        return { setValue: { curveType } };
      },
    };

    stateVariableDefinitions.graphXmin = {
      forRenderer: true,
      additionalStateVariablesDefined: [
        {
          variableName: "graphXmax",
          forRenderer: true,
        },
        {
          variableName: "graphYmin",
          forRenderer: true,
        },
        {
          variableName: "graphYmax",
          forRenderer: true,
        },
      ],
      returnDependencies: () => ({
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["xmin", "xmax", "ymin", "ymax"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.graphAncestor) {
          return {
            setValue: {
              graphXmin: dependencyValues.graphAncestor.stateValues.xmin,
              graphXmax: dependencyValues.graphAncestor.stateValues.xmax,
              graphYmin: dependencyValues.graphAncestor.stateValues.ymin,
              graphYmax: dependencyValues.graphAncestor.stateValues.ymax,
            },
          };
        } else {
          return {
            setValue: {
              graphXmin: null,
              graphXmax: null,
              graphYmin: null,
              graphYmax: null,
            },
          };
        }
      },
    };

    stateVariableDefinitions.parMax = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      forRenderer: true,
      returnDependencies: () => ({
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType",
        },
        parMaxAttr: {
          dependencyType: "attributeComponent",
          attributeName: "parMax",
          variableNames: ["value"],
        },
        numThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numThroughPoints",
        },
        extrapolateForward: {
          dependencyType: "stateVariable",
          variableName: "extrapolateForward",
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["domain"],
        },
        adapterSourceDomain: {
          dependencyType: "adapterSourceStateVariable",
          variableName: "domain",
        },
        graphXmin: {
          dependencyType: "stateVariable",
          variableName: "graphXmin",
        },
        graphXmax: {
          dependencyType: "stateVariable",
          variableName: "graphXmax",
        },
        graphYmin: {
          dependencyType: "stateVariable",
          variableName: "graphYmin",
        },
        graphYmax: {
          dependencyType: "stateVariable",
          variableName: "graphYmax",
        },
        flipFunction: {
          dependencyType: "stateVariable",
          variableName: "flipFunction",
        },
      }),
      definition: function ({ dependencyValues }) {
        let parMax;
        if (dependencyValues.curveType === "bezier") {
          parMax = dependencyValues.numThroughPoints - 1;
          if (dependencyValues.extrapolateForward) {
            parMax *= 2;
          }
        } else if (dependencyValues.parMaxAttr !== null) {
          parMax =
            dependencyValues.parMaxAttr.stateValues.value.evaluate_to_constant();
        } else if (dependencyValues.curveType === "function") {
          let domain = null;
          if (dependencyValues.functionChild.length === 1) {
            domain = dependencyValues.functionChild[0].stateValues.domain;
          } else {
            domain = dependencyValues.adapterSourceDomain;
          }
          if (domain !== null) {
            domain = domain[0];
            parMax = me.fromAst(domain.tree[1][2]).evaluate_to_constant();
          }
          let graphMin, graphMax;
          if (dependencyValues.flipFunction) {
            graphMax = dependencyValues.graphYmax;
            graphMin = dependencyValues.graphYmin;
          } else {
            graphMax = dependencyValues.graphXmax;
            graphMin = dependencyValues.graphXmin;
          }
          if (graphMax !== null && graphMin !== null) {
            if (parMax === undefined) {
              parMax = graphMax + 0.1 * (graphMax - graphMin);
            } else {
              parMax = Math.min(parMax, graphMax + 0.1 * (graphMax - graphMin));
            }
          }

          if (parMax === undefined) {
            parMax = Infinity;
          }
        } else {
          parMax = 10;
        }

        return { setValue: { parMax } };
      },
    };

    stateVariableDefinitions.parMin = {
      forRenderer: true,
      isLocation: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType",
        },
        parMinAttr: {
          dependencyType: "attributeComponent",
          attributeName: "parMin",
          variableNames: ["value"],
        },
        numThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numThroughPoints",
        },
        extrapolateBackward: {
          dependencyType: "stateVariable",
          variableName: "extrapolateBackward",
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["domain"],
        },
        adapterSourceDomain: {
          dependencyType: "adapterSourceStateVariable",
          variableName: "domain",
        },
        graphXmin: {
          dependencyType: "stateVariable",
          variableName: "graphXmin",
        },
        graphXmax: {
          dependencyType: "stateVariable",
          variableName: "graphXmax",
        },
        graphYmin: {
          dependencyType: "stateVariable",
          variableName: "graphYmin",
        },
        graphYmax: {
          dependencyType: "stateVariable",
          variableName: "graphYmax",
        },
        flipFunction: {
          dependencyType: "stateVariable",
          variableName: "flipFunction",
        },
      }),
      definition: function ({ dependencyValues }) {
        let parMin;
        if (dependencyValues.curveType === "bezier") {
          parMin = 0;
          if (dependencyValues.extrapolateBackward) {
            parMin = -(dependencyValues.numThroughPoints - 1);
          }
        } else if (dependencyValues.parMinAttr !== null) {
          parMin =
            dependencyValues.parMinAttr.stateValues.value.evaluate_to_constant();
        } else if (dependencyValues.curveType === "function") {
          let domain = null;
          if (dependencyValues.functionChild.length === 1) {
            domain = dependencyValues.functionChild[0].stateValues.domain;
          } else {
            domain = dependencyValues.adapterSourceDomain;
          }
          if (domain !== null) {
            domain = domain[0];
            parMin = me.fromAst(domain.tree[1][1]).evaluate_to_constant();
          }
          let graphMin, graphMax;
          if (dependencyValues.flipFunction) {
            graphMax = dependencyValues.graphYmax;
            graphMin = dependencyValues.graphYmin;
          } else {
            graphMax = dependencyValues.graphXmax;
            graphMin = dependencyValues.graphXmin;
          }
          if (graphMax !== null && graphMin !== null) {
            if (parMin === undefined) {
              parMin = graphMin + 0.1 * (graphMin - graphMax);
            } else {
              parMin = Math.max(parMin, graphMin + 0.1 * (graphMin - graphMax));
            }
          }
          if (parMin === undefined) {
            parMin = -Infinity;
          }
        } else {
          parMin = -10;
        }
        return { setValue: { parMin } };
      },
    };

    stateVariableDefinitions.domainForFunctions = {
      returnDependencies: () => ({
        parMin: {
          dependencyType: "stateVariable",
          variableName: "parMin",
        },
        parMax: {
          dependencyType: "stateVariable",
          variableName: "parMax",
        },
      }),
      definition({ dependencyValues }) {
        // closed interval [parMin, parMax]
        let interval = me.fromAst([
          "interval",
          ["tuple", dependencyValues.parMin, dependencyValues.parMax],
          ["tuple", true, true],
        ]);
        return {
          setValue: { domainForFunctions: [interval] },
        };
      },
    };

    stateVariableDefinitions.numThroughPoints = {
      returnDependencies: () => ({
        through: {
          dependencyType: "attributeComponent",
          attributeName: "through",
          variableNames: ["numPoints"],
        },
      }),
      definition({ dependencyValues }) {
        let numThroughPoints = 0;
        if (dependencyValues.through !== null) {
          numThroughPoints = dependencyValues.through.stateValues.numPoints;
        }
        return { setValue: { numThroughPoints } };
      },
    };

    stateVariableDefinitions.numDimensions = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies() {
        return {
          through: {
            dependencyType: "attributeComponent",
            attributeName: "through",
            variableNames: ["numDimensions"],
          },
        };
      },
      definition: function ({ dependencyValues }) {
        if (dependencyValues.through !== null) {
          let numDimensions =
            dependencyValues.through.stateValues.numDimensions;
          return {
            setValue: { numDimensions: Math.max(2, numDimensions) },
            checkForActualChange: { numDimensions: true },
          };
        } else {
          // curve through zero points
          return { setValue: { numDimensions: 2 } };
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
            // throughPoint or entire array
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
          // throughPointX1_2 is the 2nd component of the first throughPoint
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
          // throughPoint3 is all components of the third throughPoint

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
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [
          dependencyValues.numThroughPoints,
          dependencyValues.numDimensions,
        ];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

          dependenciesByKey[arrayKey] = {
            through: {
              dependencyType: "attributeComponent",
              attributeName: "through",
              variableNames: ["pointX" + varEnding],
            },
          };
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        // console.log('array definition of curve throughPoints');
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
        // console.log(arrayKeys);

        let throughPoints = {};

        for (let arrayKey of arrayKeys) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

          let through = dependencyValuesByKey[arrayKey].through;
          if (through !== null && through.stateValues["pointX" + varEnding]) {
            throughPoints[arrayKey] = through.stateValues["pointX" + varEnding];
          } else {
            throughPoints[arrayKey] = me.fromAst(0);
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
        // console.log(`inverseArrayDefinition of throughPoints of curve`);
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
            dependencyValuesByKey[arrayKey].through !== null &&
            dependencyValuesByKey[arrayKey].through.stateValues[
              "pointX" + varEnding
            ]
          ) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].through,
              desiredValue: desiredStateVariableValues.throughPoints[arrayKey],
              childIndex: 0,
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

    stateVariableDefinitions.numericalThroughPoints = {
      isArray: true,
      entryPrefixes: ["numericalThroughPoint"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        numThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numThroughPoints];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            throughPoint: {
              dependencyType: "stateVariable",
              variableName: "throughPoint" + (Number(arrayKey) + 1),
            },
          };
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let numericalThroughPoints = {};

        for (let arrayKey of arrayKeys) {
          let pt = dependencyValuesByKey[arrayKey].throughPoint.map((x) =>
            x.evaluate_to_constant(),
          );
          if (!pt.every((x) => Number.isFinite(x))) {
            pt = Array(pt.length).fill(NaN);
          }
          numericalThroughPoints[arrayKey] = pt;
        }

        return { setValue: { numericalThroughPoints } };
      },
    };

    stateVariableDefinitions.haveBezierControls = {
      forRenderer: true,
      returnDependencies: () => ({
        controlChild: {
          dependencyType: "child",
          childGroups: ["bezierControls"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            haveBezierControls: dependencyValues.controlChild.length > 0,
          },
        };
      },
    };

    stateVariableDefinitions.bezierControlsAlwaysVisible = {
      forRenderer: true,
      returnDependencies: () => ({
        controlChild: {
          dependencyType: "child",
          childGroups: ["bezierControls"],
          variableNames: ["alwaysVisible"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            bezierControlsAlwaysVisible:
              dependencyValues.controlChild.length > 0 &&
              dependencyValues.controlChild[0].stateValues.alwaysVisible,
          },
        };
      },
    };

    stateVariableDefinitions.vectorControlDirections = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      isArray: true,
      entryPrefixes: ["vectorControlDirection"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        numThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numThroughPoints];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            controlChild: {
              dependencyType: "child",
              childGroups: ["bezierControls"],
              variableNames: ["direction" + (Number(arrayKey) + 1)],
            },
          };
        }

        let globalDependencies = {
          haveBezierControls: {
            dependencyType: "stateVariable",
            variableName: "haveBezierControls",
          },
        };

        return { dependenciesByKey, globalDependencies };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let vectorControlDirections = {};

        for (let arrayKey of arrayKeys) {
          let controlChild = dependencyValuesByKey[arrayKey].controlChild;

          if (controlChild && controlChild.length > 0) {
            vectorControlDirections[arrayKey] =
              controlChild[0].stateValues["direction" + (Number(arrayKey) + 1)];
          } else {
            vectorControlDirections[arrayKey] = "none";
          }
        }

        return {
          setValue: { vectorControlDirections },
        };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
        dependencyValuesByKey,
        globalDependencyValues,
      }) {
        // if don't have bezier controls, cannot change directions,
        // they all stay at none so that have a spline
        if (!globalDependencyValues.haveBezierControls) {
          return { success: false };
        }

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.vectorControlDirections) {
          let controlChild = dependencyValuesByKey[arrayKey].controlChild;

          if (controlChild && controlChild.length > 0) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].controlChild,
              desiredValue:
                desiredStateVariableValues.vectorControlDirections[arrayKey],
              childIndex: 0,
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

    stateVariableDefinitions.hiddenControls = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      isArray: true,
      entryPrefixes: ["hiddenControl"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        numThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numThroughPoints];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            controlChild: {
              dependencyType: "child",
              childGroups: ["bezierControls"],
              variableNames: ["hiddenControl" + (Number(arrayKey) + 1)],
            },
          };
        }

        let globalDependencies = {
          haveBezierControls: {
            dependencyType: "stateVariable",
            variableName: "haveBezierControls",
          },
        };

        return { dependenciesByKey, globalDependencies };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let hiddenControls = {};

        for (let arrayKey of arrayKeys) {
          let controlChild = dependencyValuesByKey[arrayKey].controlChild;

          if (controlChild && controlChild.length > 0) {
            hiddenControls[arrayKey] =
              controlChild[0].stateValues[
                "hiddenControl" + (Number(arrayKey) + 1)
              ];
          } else {
            hiddenControls[arrayKey] = false;
          }
        }

        return {
          setValue: { hiddenControls },
        };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
        dependencyValuesByKey,
        globalDependencyValues,
      }) {
        if (!globalDependencyValues.haveBezierControls) {
          return { success: false };
        }

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.hiddenControls) {
          let controlChild = dependencyValuesByKey[arrayKey].controlChild;

          if (controlChild && controlChild.length > 0) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].controlChild,
              desiredValue: desiredStateVariableValues.hiddenControls[arrayKey],
              childIndex: 0,
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

    stateVariableDefinitions.controlVectors = {
      isArray: true,
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "controlVectorX") {
            return [];
          } else {
            // controlVector or entire array
            // wrap inner dimension by both <vector> and <xs>
            // don't wrap outer dimension (for entire array)
            return [
              ["vector", { componentType: "mathList", isAttribute: "xs" }],
            ];
          }
        },
      },
      entryPrefixes: ["controlVectorX", "controlVector", "controlVectors"],
      numDimensions: 3,
      stateVariablesDeterminingDependencies: [
        "vectorControlDirections",
        "numThroughPoints",
      ],
      returnEntryDimensions: (prefix) => (prefix === "controlVectors" ? 2 : 1),
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "controlVectorX") {
          // controlVectorX3_2_1 is the first component of the second control vector
          // controlling the third point
          let indices = varEnding.split("_").map((x) => Number(x) - 1);
          if (
            indices.length === 3 &&
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
        } else if (arrayEntryPrefix === "controlVectors") {
          // controlVectors2 is both vectors controlling the second point
          let index = Number(varEnding) - 1;
          if (Number.isInteger(index) && index >= 0) {
            if (!arraySize) {
              // if don't' have array size, just return first entry assuming large enough size
              return [String(index) + ",0,0"];
            }
            if (index < arraySize[0]) {
              let result = [];
              for (let i = 0; i < arraySize[1]; i++) {
                let row = [];
                for (let j = 0; j < arraySize[2]; j++) {
                  row.push(`${index},${i},${j}`);
                }
                result.push(row);
              }
              return result;
            } else {
              return [];
            }
          } else {
            return [];
          }
        } else {
          // controlVector3_2 is all components of the second control vector
          // controlling the third point

          let indices = varEnding.split("_").map((x) => Number(x) - 1);
          if (
            !(
              indices.length === 2 &&
              indices.every((x) => Number.isInteger(x) && x >= 0)
            )
          ) {
            return [];
          }

          if (!arraySize) {
            // if don't' have array size, just return first entry assuming large enough size
            return [String(indices) + ",0"];
          }
          if (indices.every((x, i) => x < arraySize[i])) {
            return Array.from(
              Array(arraySize[2]),
              (_, i) => String(indices) + "," + i,
            );
          } else {
            return [];
          }
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "controlVectors") {
          if (propIndex.length === 1) {
            // controlVectors[2] return both vectors controlling point 2
            return `controlVectors${propIndex[0]}`;
          }
          if (propIndex.length === 2) {
            // controlVectors[3][2] return the second vector controlling point 3
            return `controlVector${propIndex[0]}_${propIndex[1]}`;
          } else {
            // if propIndex has additional entries, ignore them
            return `controlVectorX${propIndex[0]}_${propIndex[1]}_${propIndex[2]}`;
          }
        }
        // TODO: do we want to handle a case like controlVector3_2[1]?
        return null;
      },
      returnArraySizeDependencies: () => ({
        numThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numThroughPoints",
        },
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [
          dependencyValues.numThroughPoints,
          2,
          dependencyValues.numDimensions,
        ];
      },
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let globalDependencies = {
          haveBezierControls: {
            dependencyType: "stateVariable",
            variableName: "haveBezierControls",
          },
          numThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "numThroughPoints",
          },
          numDimensions: {
            dependencyType: "stateVariable",
            variableName: "numDimensions",
          },
          splineTension: {
            dependencyType: "stateVariable",
            variableName: "splineTension",
          },
          splineForm: {
            dependencyType: "stateVariable",
            variableName: "splineForm",
          },
        };

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let arrayIndices = arrayKey.split(",").map((x) => Number(x));
          let varEndings = arrayIndices.map((x) => x + 1);
          let jointVarEnding = varEndings.join("_");

          dependenciesByKey[arrayKey] = {
            direction: {
              dependencyType: "stateVariable",
              variableName: "vectorControlDirection" + varEndings[0],
            },
            controlChild: {
              dependencyType: "child",
              childGroups: ["bezierControls"],
              variableNames: ["control" + jointVarEnding],
            },
          };

          let pointInd = arrayIndices[0];
          let direction = stateValues.vectorControlDirections[pointInd];
          let indsToCheck = [];
          if (direction === "none") {
            indsToCheck = [pointInd - 1, pointInd, pointInd + 1];
          } else if (direction === "previous") {
            indsToCheck = [pointInd, pointInd + 1];
          } else if (direction === "next") {
            indsToCheck = [pointInd - 1, pointInd];
          }

          for (let ind of indsToCheck) {
            if (ind >= 0 && ind < stateValues.numThroughPoints) {
              dependenciesByKey[arrayKey]["throughPoint" + (ind + 1)] = {
                dependencyType: "stateVariable",
                variableName: "throughPoint" + (ind + 1),
              };
            }
          }
        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        // console.log('definition of controlVectors for curve')
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));
        // console.log(JSON.parse(JSON.stringify(globalDependencyValues)));
        // console.log(JSON.parse(JSON.stringify(arrayKeys)))

        let newControlValues = {};

        for (let arrayKey of arrayKeys) {
          // we have calculated this only for 2D
          if (globalDependencyValues.numDimensions !== 2) {
            newControlValues[arrayKey] = me.fromAst(NaN);
            continue;
          }

          // since calculate two control vectors at once with symmetric
          // and both dimensions of each vector at once
          // it is possible that arrayKey was calculated earlier in the loop
          if (arrayKey in newControlValues) {
            continue;
          }

          let arrayIndices = arrayKey.split(",").map((x) => Number(x));
          let varEndings = arrayIndices.map((x) => x + 1);
          let jointVarEnding = varEndings.join("_");

          let pointInd = arrayIndices[0];
          let vectorInd = arrayIndices[1];

          let direction = dependencyValuesByKey[arrayKey].direction;
          // if (!direction) {
          //   direction = "none";
          // }

          if (direction === "none") {
            // if direction is none, then determine both first and second control vector
            // via spline (they will be symmetric)

            let point2 =
              dependencyValuesByKey[arrayKey]["throughPoint" + (pointInd + 1)];

            let point1, point3;
            if (pointInd > 0) {
              point1 =
                dependencyValuesByKey[arrayKey]["throughPoint" + pointInd];
            }
            if (pointInd < globalDependencyValues.numThroughPoints) {
              point3 =
                dependencyValuesByKey[arrayKey][
                  "throughPoint" + (pointInd + 2)
                ];
            }

            let { coordsNumeric, numericEntries } =
              calculateControlVectorFromSpline({
                tau: globalDependencyValues.splineTension,
                eps: numerics.eps,
                splineForm: globalDependencyValues.splineForm,
                point1,
                point2,
                point3,
              });

            for (let dim = 0; dim < 2; dim++) {
              let arrayKeyDim = pointInd + "," + vectorInd + "," + dim;
              let flippedArrayKeyDim =
                pointInd + "," + (1 - vectorInd) + "," + dim;

              if (vectorInd === 0) {
                // arrayKey corresponds to first vector
                newControlValues[arrayKeyDim] = coordsNumeric[dim];
                newControlValues[flippedArrayKeyDim] = me.fromAst(
                  -coordsNumeric[dim].tree,
                );
              } else {
                // arrayKey corresponds to second vector
                newControlValues[arrayKeyDim] = me.fromAst(
                  -coordsNumeric[dim].tree,
                );
                newControlValues[flippedArrayKeyDim] = coordsNumeric[dim];
              }
            }
          } else if (
            (arrayIndices[1] === 0 && direction === "next") ||
            (arrayIndices[1] === 1 && direction === "previous")
          ) {
            // calculate control vector from spline

            // only two of these three will be defined
            let point1 =
              dependencyValuesByKey[arrayKey]["throughPoint" + pointInd];
            let point2 =
              dependencyValuesByKey[arrayKey]["throughPoint" + (pointInd + 1)];
            let point3 =
              dependencyValuesByKey[arrayKey]["throughPoint" + (pointInd + 2)];

            let { coordsNumeric, numericEntries } =
              calculateControlVectorFromSpline({
                tau: globalDependencyValues.splineTension,
                eps: numerics.eps,
                splineForm: globalDependencyValues.splineForm,
                point1: point1 ? point1 : point3,
                point2,
                point3: undefined,
              });

            for (let dim = 0; dim < 2; dim++) {
              let arrayKeyDim = pointInd + "," + vectorInd + "," + dim;
              newControlValues[arrayKeyDim] = coordsNumeric[dim];
            }
          } else {
            // if have a vector from control child, use that
            newControlValues[arrayKey] =
              dependencyValuesByKey[arrayKey].controlChild[0].stateValues[
                "control" + jointVarEnding
              ];
          }
        }

        return {
          setValue: {
            controlVectors: newControlValues,
          },
        };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
        dependencyValuesByKey,
        globalDependencyValues,
      }) {
        // console.log('inverse definition of controlVectors for curve')
        // console.log(JSON.parse(JSON.stringify(desiredStateVariableValues)));
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));
        // console.log(JSON.parse(JSON.stringify(globalDependencyValues)));

        // if don't have bezier controls, cannot change control vectors,
        // they all stay at those calculated from spline
        // Also can't change if aren't in 2D
        if (
          !globalDependencyValues.haveBezierControls ||
          globalDependencyValues.numDimensions !== 2
        ) {
          return { success: false };
        }

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.controlVectors) {
          let arrayIndices = arrayKey.split(",").map((x) => Number(x));
          let varEndings = arrayIndices.map((x) => x + 1);
          let jointVarEnding = varEndings.join("_");

          // if find the control on the control child,
          // set its value to the desired value
          let controlChild = dependencyValuesByKey[arrayKey].controlChild;
          if (controlChild.length > 0) {
            let control =
              controlChild[0].stateValues["control" + jointVarEnding];
            if (control) {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].controlChild,
                desiredValue:
                  desiredStateVariableValues.controlVectors[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });
            }
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.numericalControlVectors = {
      isArray: true,
      entryPrefixes: ["numericalControlVector"],
      forRenderer: true,
      numDimensions: 2,
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
          let arrayIndices = arrayKey.split(",").map((x) => Number(x));
          let varEndings = arrayIndices.map((x) => x + 1);
          let jointVarEnding = varEndings.join("_");

          dependenciesByKey[arrayKey] = {
            controlVector: {
              dependencyType: "stateVariable",
              variableName: "controlVector" + jointVarEnding,
            },
          };
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        // control vectors already have numerical entries,
        // so just need to take tree from math expressions

        let numericalControlVectors = {};

        for (let arrayKey of arrayKeys) {
          let vect = dependencyValuesByKey[arrayKey].controlVector.map(
            (x) => x.tree,
          );
          numericalControlVectors[arrayKey] = vect;
        }

        return { setValue: { numericalControlVectors } };
      },
    };

    stateVariableDefinitions.controlPoints = {
      isArray: true,
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "controlPointX") {
            return [];
          } else {
            // controlPoint or entire array
            // wrap inner dimension by both <point> and <xs>
            // don't wrap outer dimension (for entire array)
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          }
        },
      },
      entryPrefixes: ["controlPointX", "controlPoint", "controlPoints"],
      numDimensions: 3,
      returnEntryDimensions: (prefix) => (prefix === "controlPoints" ? 2 : 1),
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "controlPointX") {
          // controlPointX3_2_1 is the first component of the second control point
          // controlling the third point
          let indices = varEnding.split("_").map((x) => Number(x) - 1);
          if (
            indices.length === 3 &&
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
        } else if (arrayEntryPrefix === "controlPoints") {
          // controlPoints2 is both points controlling the second point
          let index = Number(varEnding) - 1;
          if (Number.isInteger(index) && index >= 0) {
            if (!arraySize) {
              // if don't' have array size, just return first entry assuming large enough size
              return [String(index) + ",0,0"];
            }
            if (index < arraySize[0]) {
              let result = [];
              for (let i = 0; i < arraySize[1]; i++) {
                let row = [];
                for (let j = 0; j < arraySize[2]; j++) {
                  row.push(`${index},${i},${j}`);
                }
                result.push(row);
              }
              return result;
            } else {
              return [];
            }
          } else {
            return [];
          }
        } else {
          // controlPoint3_2 is all components of the second control point
          // controlling the third point

          let indices = varEnding.split("_").map((x) => Number(x) - 1);
          if (
            !(
              indices.length === 2 &&
              indices.every((x) => Number.isInteger(x) && x >= 0)
            )
          ) {
            return [];
          }

          if (!arraySize) {
            // if don't' have array size, just return first entry assuming large enough size
            return [String(indices) + ",0"];
          }
          if (indices.every((x, i) => x < arraySize[i])) {
            return Array.from(
              Array(arraySize[2]),
              (_, i) => String(indices) + "," + i,
            );
          } else {
            return [];
          }
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "controlPoints") {
          if (propIndex.length === 1) {
            // controlPoints[2] return both points controlling point 2
            return `controlPoints${propIndex[0]}`;
          }
          if (propIndex.length === 2) {
            // controlPoints[3][2] return the second point controlling point 3
            return `controlPoint${propIndex[0]}_${propIndex[1]}`;
          } else {
            // if propIndex has additional entries, ignore them
            return `controlPointX${propIndex[0]}_${propIndex[1]}_${propIndex[2]}`;
          }
        }
        // TODO: do we want to handle a case like controlPoint3_2[1]?
        return null;
      },
      returnArraySizeDependencies: () => ({
        numThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numThroughPoints",
        },
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [
          dependencyValues.numThroughPoints,
          2,
          dependencyValues.numDimensions,
        ];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          haveBezierControls: {
            dependencyType: "stateVariable",
            variableName: "haveBezierControls",
          },
          numDimensions: {
            dependencyType: "stateVariable",
            variableName: "numDimensions",
          },
        };

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let arrayIndices = arrayKey.split(",").map((x) => Number(x));
          let varEndings = arrayIndices.map((x) => x + 1);
          let jointVarEnding = varEndings.join("_");

          dependenciesByKey[arrayKey] = {
            throughPointX: {
              dependencyType: "stateVariable",
              variableName:
                "throughPointX" + varEndings[0] + "_" + varEndings[2],
            },
            controlVectorX: {
              dependencyType: "stateVariable",
              variableName: "controlVectorX" + jointVarEnding,
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
        // console.log('definition of controlPoints for curve')
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));
        // console.log(JSON.parse(JSON.stringify(globalDependencyValues)));
        // console.log(JSON.parse(JSON.stringify(arrayKeys)))

        let newControlValues = {};

        for (let arrayKey of arrayKeys) {
          // we have calculated this only for 2D
          if (globalDependencyValues.numDimensions !== 2) {
            newControlValues[arrayKey] = me.fromAst(NaN);
          } else {
            let vectorX = dependencyValuesByKey[arrayKey].controlVectorX;

            if (vectorX) {
              let pointX =
                dependencyValuesByKey[
                  arrayKey
                ].throughPointX.evaluate_to_constant();
              newControlValues[arrayKey] = me.fromAst(pointX + vectorX.tree);
            } else {
              newControlValues[arrayKey] = null;
            }
          }
        }
        return {
          setValue: {
            controlPoints: newControlValues,
          },
        };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
        dependencyValuesByKey,
        globalDependencyValues,
      }) {
        // if don't have bezier controls, cannot change control vectors,
        // they all stay at those calculated from spline
        // Also can't change if aren't in 2D
        if (
          !globalDependencyValues.haveBezierControls ||
          globalDependencyValues.numDimensions !== 2
        ) {
          return { success: false };
        }

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.controlPoints) {
          // if find the control on the control child,
          // set its value to the desired value
          let vectorX = dependencyValuesByKey[arrayKey].controlVectorX;
          if (vectorX) {
            let pointX = dependencyValuesByKey[arrayKey].throughPointX;

            let desiredPoint =
              desiredStateVariableValues.controlPoints[arrayKey];
            if (desiredPoint.tree) {
              desiredPoint = desiredPoint.tree;
            }
            let desiredValue = me.fromAst([
              "+",
              desiredPoint,
              ["-", pointX.tree],
            ]);

            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].controlVectorX,
              desiredValue,
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.numericalControlPoints = {
      isArray: true,
      entryPrefixes: ["numericalControlPoint"],
      forRenderer: true,
      numDimensions: 2,
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
          let arrayIndices = arrayKey.split(",").map((x) => Number(x));
          let varEndings = arrayIndices.map((x) => x + 1);
          let jointVarEnding = varEndings.join("_");

          dependenciesByKey[arrayKey] = {
            controlPoint: {
              dependencyType: "stateVariable",
              variableName: "controlPoint" + jointVarEnding,
            },
          };
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        // control points have numerical entries, to just take expression trees
        let numericalControlPoints = {};

        for (let arrayKey of arrayKeys) {
          let pt = dependencyValuesByKey[arrayKey].controlPoint.map(
            (x) => x.tree,
          );
          numericalControlPoints[arrayKey] = pt;
        }

        return { setValue: { numericalControlPoints } };
      },
    };

    stateVariableDefinitions.splineCoeffs = {
      isArray: true,
      returnArraySizeDependencies: () => ({
        numThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numThroughPoints - 1];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let ind1 = Number(arrayKey) + 1;
          let ind2 = ind1 + 1;

          dependenciesByKey[arrayKey] = {
            previousPoint: {
              dependencyType: "stateVariable",
              variableName: "numericalThroughPoint" + ind1,
            },
            nextPoint: {
              dependencyType: "stateVariable",
              variableName: "numericalThroughPoint" + ind2,
            },
            previousVector: {
              dependencyType: "stateVariable",
              variableName: "numericalControlVector" + ind1 + "_2",
            },
            nextVector: {
              dependencyType: "stateVariable",
              variableName: "numericalControlVector" + ind2 + "_1",
            },
          };
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let newSpineCoeffs = {};

        for (let arrayKey of arrayKeys) {
          let p1 = dependencyValuesByKey[arrayKey].previousPoint;
          let p2 = dependencyValuesByKey[arrayKey].nextPoint;
          let cv1 = dependencyValuesByKey[arrayKey].previousVector;
          let cv2 = dependencyValuesByKey[arrayKey].nextVector;

          let c = [];
          for (let dim = 0; dim < 2; dim++) {
            c.push(
              initCubicPoly(p1[dim], p2[dim], 3 * cv1[dim], -3 * cv2[dim]),
            );
          }

          newSpineCoeffs[arrayKey] = c;
        }

        return {
          setValue: {
            splineCoeffs: newSpineCoeffs,
          },
        };
      },
    };

    stateVariableDefinitions.extrapolateBackwardCoeffs = {
      stateVariablesDeterminingDependencies: ["extrapolateBackward"],
      additionalStateVariablesDefined: [
        {
          variableName: "extrapolateBackwardMode",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "text",
          },
        },
      ],
      returnDependencies({ stateValues }) {
        let dependencies = {
          extrapolateBackward: {
            dependencyType: "stateVariable",
            variableName: "extrapolateBackward",
          },
          numThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "numThroughPoints",
          },
        };

        if (stateValues.extrapolateBackward) {
          dependencies.firstSplineCoeffs = {
            dependencyType: "stateVariable",
            variableName: "splineCoeffs1",
          };
          dependencies.graphXmin = {
            dependencyType: "stateVariable",
            variableName: "graphXmin",
          };
          dependencies.graphXmax = {
            dependencyType: "stateVariable",
            variableName: "graphXmax",
          };
          dependencies.graphYmin = {
            dependencyType: "stateVariable",
            variableName: "graphYmin",
          };
          dependencies.graphYmax = {
            dependencyType: "stateVariable",
            variableName: "graphYmax",
          };
        }

        return dependencies;
      },
      definition({ dependencyValues }) {
        if (
          !dependencyValues.extrapolateBackward ||
          !dependencyValues.firstSplineCoeffs
        ) {
          return {
            setValue: {
              extrapolateBackwardCoeffs: null,
              extrapolateBackwardMode: "",
            },
          };
        }

        // extrapolate as a parabola oriented with the coordinate axes
        // that matches the curvature of the first spline segment

        let cx = dependencyValues.firstSplineCoeffs[0];
        let cy = dependencyValues.firstSplineCoeffs[1];

        let x0 = cx[0];
        let xp0 = cx[1];
        let xpp0 = 2 * cx[2];

        let y0 = cy[0];
        let yp0 = cy[1];
        let ypp0 = 2 * cy[2];

        let d = xp0 * xp0 + yp0 * yp0;

        let fac = (yp0 * xpp0 - xp0 * ypp0) / (d * d);

        if (
          Math.abs(fac) < 1e-12 ||
          Math.abs(xp0) < 1e-12 ||
          Math.abs(yp0) < 1e-12
        ) {
          // curvature is zero or pointed at right angle
          // extrapolate as straight line

          let xpEffective = xp0;
          let ypEffective = yp0;

          if (
            dependencyValues.graphXmin !== null &&
            dependencyValues.graphXmax !== null &&
            dependencyValues.graphYmin !== null &&
            dependencyValues.graphYmax !== null
          ) {
            // if in graph, scale speed if needed to make sure leave graph

            let xscale =
              dependencyValues.graphXmax - dependencyValues.graphXmin;
            let yscale =
              dependencyValues.graphYmax - dependencyValues.graphYmin;
            let tMax = dependencyValues.numThroughPoints - 1;

            let scaleSpeedToReachXEdge = xscale / tMax / Math.abs(xpEffective);
            let scaleSpeedToReachYEdge = yscale / tMax / Math.abs(ypEffective);

            let minScale = Math.min(
              scaleSpeedToReachXEdge,
              scaleSpeedToReachYEdge,
            );

            if (minScale > 1) {
              xpEffective *= minScale;
              ypEffective *= minScale;
            }
          }

          let c = [
            [x0, xpEffective, 0],
            [y0, ypEffective, 0],
          ];

          return {
            setValue: {
              extrapolateBackwardCoeffs: c,
              extrapolateBackwardMode: "line",
            },
          };
        }

        let dTx = yp0 * fac;
        let dTy = -xp0 * fac;

        if (dTx * xp0 > 0) {
          // if curving toward the vertical direction
          // orient the parabola vertically

          let r = dTx / dTy;
          let rFactor = (1 + r * r) ** 2;

          let xpEffective = xp0;

          if (
            dependencyValues.graphXmin !== null &&
            dependencyValues.graphXmax !== null &&
            dependencyValues.graphYmin !== null &&
            dependencyValues.graphYmax !== null
          ) {
            // if we are in graph, make sure that the speed of the parametrization
            // is fast enough for the curve to leave the graph while
            // the parameter increases by the amount numThroughPoints - 1

            let xscale =
              dependencyValues.graphXmax - dependencyValues.graphXmin;
            let yscale =
              dependencyValues.graphYmax - dependencyValues.graphYmin;

            let tMax = dependencyValues.numThroughPoints - 1;

            let minSpeedToReachXEdge = xscale / tMax;

            // y = a*v^2*t^2 + b*v*t
            // where a = dTy*rFactor/2 and b = -r.
            // Find minimum v where reach edge by tMax

            let minSpeedToReachYEdge = Infinity;

            if (dTy !== 0) {
              let alpha = ((dTy * rFactor) / 2) * tMax * tMax;
              let beta = -r * tMax;
              // y = alpha*v^2 + beta*v
              // if alpha > 0, solve for y = yscale
              // else if alpha < 0 solve for y = -yscale
              let sr = Math.sqrt(beta * beta + 4 * Math.abs(alpha) * yscale);
              minSpeedToReachYEdge =
                (Math.abs(beta) + sr) / (2 * Math.abs(alpha));
            }

            let minSpeed = Math.min(minSpeedToReachXEdge, minSpeedToReachYEdge);

            if (minSpeed > Math.abs(xpEffective)) {
              xpEffective *= minSpeed / Math.abs(xpEffective);
            }
          }

          let v = -xpEffective * r;
          let a = dTy * xpEffective * xpEffective * rFactor;

          let c = [
            [x0, xpEffective, 0],
            [y0, v, a / 2],
          ];

          return {
            setValue: {
              extrapolateBackwardCoeffs: c,
              extrapolateBackwardMode: "parabolaVertical",
            },
          };
        } else {
          // if curving toward the horizontal direction
          // orient the parabola horizontally

          let r = dTy / dTx;
          let rFactor = (1 + r * r) ** 2;

          let ypEffective = yp0;

          if (
            dependencyValues.graphXmin !== null &&
            dependencyValues.graphXmax !== null &&
            dependencyValues.graphYmin !== null &&
            dependencyValues.graphYmax !== null
          ) {
            // if we are in graph, make sure that the speed of the parametrization
            // is fast enough for the curve to leave the graph while
            // the parameter increases by the amount numThroughPoints - 1

            let xscale =
              dependencyValues.graphXmax - dependencyValues.graphXmin;
            let yscale =
              dependencyValues.graphYmax - dependencyValues.graphYmin;

            let tMax = dependencyValues.numThroughPoints - 1;

            let minSpeedToReachYEdge = yscale / tMax;

            // y = a*v^2*t^2 + b*v*t
            // where a = dTy*rFactor/2 and b = -r.
            // Find minimum v where reach edge by tMax

            let minSpeedToReachXEdge = Infinity;

            if (dTx !== 0) {
              let alpha = ((dTx * rFactor) / 2) * tMax * tMax;
              let beta = -r * tMax;
              // c = alpha*v^2 + beta*v
              // if alpha > 0, solve for x = xscale
              // else if alpha < 0 solve for x = -xscale
              let sr = Math.sqrt(beta * beta + 4 * Math.abs(alpha) * xscale);
              minSpeedToReachXEdge =
                (Math.abs(beta) + sr) / (2 * Math.abs(alpha));
            }

            let minSpeed = Math.min(minSpeedToReachXEdge, minSpeedToReachYEdge);

            if (minSpeed > Math.abs(ypEffective)) {
              ypEffective *= minSpeed / Math.abs(ypEffective);
            }
          }

          let v = -ypEffective * r;
          let a = dTx * ypEffective * ypEffective * rFactor;

          let c = [
            [x0, v, a / 2],
            [y0, ypEffective, 0],
          ];

          return {
            setValue: {
              extrapolateBackwardCoeffs: c,
              extrapolateBackwardMode: "parabolaHorizontal",
            },
          };
        }
      },
    };

    stateVariableDefinitions.extrapolateForwardCoeffs = {
      stateVariablesDeterminingDependencies: [
        "numThroughPoints",
        "extrapolateForward",
      ],
      additionalStateVariablesDefined: [
        {
          variableName: "extrapolateForwardMode",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "text",
          },
        },
      ],
      returnDependencies({ stateValues }) {
        let dependencies = {
          extrapolateForward: {
            dependencyType: "stateVariable",
            variableName: "extrapolateForward",
          },
          numThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "numThroughPoints",
          },
        };

        if (
          stateValues.extrapolateForward &&
          stateValues.numThroughPoints >= 2
        ) {
          dependencies.lastSplineCoeffs = {
            dependencyType: "stateVariable",
            variableName: "splineCoeffs" + (stateValues.numThroughPoints - 1),
          };
          dependencies.graphXmin = {
            dependencyType: "stateVariable",
            variableName: "graphXmin",
          };
          dependencies.graphXmax = {
            dependencyType: "stateVariable",
            variableName: "graphXmax",
          };
          dependencies.graphYmin = {
            dependencyType: "stateVariable",
            variableName: "graphYmin",
          };
          dependencies.graphYmax = {
            dependencyType: "stateVariable",
            variableName: "graphYmax",
          };
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        if (
          !dependencyValues.extrapolateForward ||
          !dependencyValues.lastSplineCoeffs
        ) {
          return {
            setValue: {
              extrapolateForwardCoeffs: null,
              extrapolateForwardMode: "",
            },
          };
        }

        // extrapolate as a parabola oriented with the coordinate axes
        // that matches the curvature of the first spline segment

        let cx = dependencyValues.lastSplineCoeffs[0];
        let cy = dependencyValues.lastSplineCoeffs[1];

        let x0 = cx[0] + cx[1] + cx[2] + cx[3];
        let xp0 = cx[1] + 2 * cx[2] + 3 * cx[3];
        let xpp0 = 2 * cx[2] + 6 * cx[3];

        let y0 = cy[0] + cy[1] + cy[2] + cy[3];
        let yp0 = cy[1] + 2 * cy[2] + 3 * cy[3];
        let ypp0 = 2 * cy[2] + 6 * cy[3];

        let d = xp0 * xp0 + yp0 * yp0;

        let fac = (yp0 * xpp0 - xp0 * ypp0) / (d * d);

        if (
          Math.abs(fac) < 1e-12 ||
          Math.abs(xp0) < 1e-12 ||
          Math.abs(yp0) < 1e-12
        ) {
          // curvature is zero or pointed at right angle
          // extrapolate as straight line

          let xpEffective = xp0;
          let ypEffective = yp0;

          if (
            dependencyValues.graphXmin !== null &&
            dependencyValues.graphXmax !== null &&
            dependencyValues.graphYmin !== null &&
            dependencyValues.graphYmax !== null
          ) {
            // if in graph, scale speed if needed to make sure leave graph

            let xscale =
              dependencyValues.graphXmax - dependencyValues.graphXmin;
            let yscale =
              dependencyValues.graphYmax - dependencyValues.graphYmin;
            let tMax = dependencyValues.numThroughPoints - 1;

            let scaleSpeedToReachXEdge = xscale / tMax / Math.abs(xpEffective);
            let scaleSpeedToReachYEdge = yscale / tMax / Math.abs(ypEffective);

            let minScale = Math.min(
              scaleSpeedToReachXEdge,
              scaleSpeedToReachYEdge,
            );

            if (minScale > 1) {
              xpEffective *= minScale;
              ypEffective *= minScale;
            }
          }

          let c = [
            [x0, xpEffective, 0],
            [y0, ypEffective, 0],
          ];

          return {
            setValue: {
              extrapolateForwardCoeffs: c,
              extrapolateForwardMode: "line",
            },
          };
        }

        let dTx = yp0 * fac;
        let dTy = -xp0 * fac;

        if (dTx * xp0 < 0) {
          // if curving toward the vertical direction
          // orient the parabola vertically

          let r = dTx / dTy;
          let rFactor = (1 + r * r) ** 2;

          let xpEffective = xp0;

          if (
            dependencyValues.graphXmin !== null &&
            dependencyValues.graphXmax !== null &&
            dependencyValues.graphYmin !== null &&
            dependencyValues.graphYmax !== null
          ) {
            // if we are in graph, make sure that the speed of the parametrization
            // is fast enough for the curve to leave the graph while
            // the parameter increases by the amount numThroughPoints - 1

            let xscale =
              dependencyValues.graphXmax - dependencyValues.graphXmin;
            let yscale =
              dependencyValues.graphYmax - dependencyValues.graphYmin;

            let tMax = dependencyValues.numThroughPoints - 1;

            let minSpeedToReachXEdge = xscale / tMax;

            // y = a*v^2*t^2 + b*v*t
            // where a = dTy*rFactor/2 and b = -r.
            // Find minimum v where reach edge by tMax

            let minSpeedToReachYEdge = Infinity;

            if (dTy !== 0) {
              let alpha = ((dTy * rFactor) / 2) * tMax * tMax;
              let beta = -r * tMax;
              // y = alpha*v^2 + beta*v
              // if alpha > 0, solve for y = yscale
              // else if alpha < 0 solve for y = -yscale
              let sr = Math.sqrt(beta * beta + 4 * Math.abs(alpha) * yscale);
              minSpeedToReachYEdge =
                (Math.abs(beta) + sr) / (2 * Math.abs(alpha));
            }

            let minSpeed = Math.min(minSpeedToReachXEdge, minSpeedToReachYEdge);

            if (minSpeed > Math.abs(xpEffective)) {
              xpEffective *= minSpeed / Math.abs(xpEffective);
            }
          }

          let v = -xpEffective * r;
          let a = dTy * xpEffective * xpEffective * rFactor;

          let c = [
            [x0, xpEffective, 0],
            [y0, v, a / 2],
          ];

          return {
            setValue: {
              extrapolateForwardCoeffs: c,
              extrapolateForwardMode: "parabolaVertical",
            },
          };
        } else {
          // if curving toward the horizontal direction
          // orient the parabola horizontally

          let r = dTy / dTx;
          let rFactor = (1 + r * r) ** 2;

          let ypEffective = yp0;

          if (
            dependencyValues.graphXmin !== null &&
            dependencyValues.graphXmax !== null &&
            dependencyValues.graphYmin !== null &&
            dependencyValues.graphYmax !== null
          ) {
            // if we are in graph, make sure that the speed of the parametrization
            // is fast enough for the curve to leave the graph while
            // the parameter increases by the amount numThroughPoints - 1

            let xscale =
              dependencyValues.graphXmax - dependencyValues.graphXmin;
            let yscale =
              dependencyValues.graphYmax - dependencyValues.graphYmin;

            let tMax = dependencyValues.numThroughPoints - 1;

            let minSpeedToReachYEdge = yscale / tMax;

            // y = a*v^2*t^2 + b*v*t
            // where a = dTy*rFactor/2 and b = -r.
            // Find minimum v where reach edge by tMax

            let minSpeedToReachXEdge = Infinity;

            if (dTx !== 0) {
              let alpha = ((dTx * rFactor) / 2) * tMax * tMax;
              let beta = -r * tMax;
              // c = alpha*v^2 + beta*v
              // if alpha > 0, solve for x = xscale
              // else if alpha < 0 solve for x = -xscale
              let sr = Math.sqrt(beta * beta + 4 * Math.abs(alpha) * xscale);
              minSpeedToReachXEdge =
                (Math.abs(beta) + sr) / (2 * Math.abs(alpha));
            }

            let minSpeed = Math.min(minSpeedToReachXEdge, minSpeedToReachYEdge);

            if (minSpeed > Math.abs(ypEffective)) {
              ypEffective *= minSpeed / Math.abs(ypEffective);
            }
          }

          let v = -ypEffective * r;
          let a = dTx * ypEffective * ypEffective * rFactor;

          let c = [
            [x0, v, a / 2],
            [y0, ypEffective, 0],
          ];

          return {
            setValue: {
              extrapolateForwardCoeffs: c,
              extrapolateForwardMode: "parabolaHorizontal",
            },
          };
        }
      },
    };

    stateVariableDefinitions.fs = {
      isArray: true,
      entryPrefixes: ["f"],
      additionalStateVariablesDefined: [
        {
          variableName: "fDefinitions",
          isArray: true,
          forRenderer: true,
          entryPrefixes: ["fDefinition"],
        },
      ],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "function",
        addStateVariablesShadowingStateVariables: {
          fDefinitions: {
            stateVariableToShadow: "fDefinitions",
          },
          domain: {
            stateVariableToShadow: "domainForFunctions",
          },
        },
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnArraySizeDependencies: () => ({
        functionChildren: {
          dependencyType: "child",
          childGroups: ["functions"],
        },
        fromVectorValuedFunctionOfDim: {
          dependencyType: "stateVariable",
          variableName: "fromVectorValuedFunctionOfDim",
        },
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType",
        },
      }),
      returnArraySize({ dependencyValues }) {
        if (dependencyValues.curveType === "bezier") {
          return [2];
        } else {
          return [
            Math.max(
              1,
              dependencyValues.functionChildren.length,
              dependencyValues.fromVectorValuedFunctionOfDim,
            ),
          ];
        }
      },
      stateVariablesDeterminingDependencies: ["fromVectorValuedFunctionOfDim"],
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let globalDependencies = {
          curveType: {
            dependencyType: "stateVariable",
            variableName: "curveType",
          },
          fromVectorValuedFunctionOfDim: {
            dependencyType: "stateVariable",
            variableName: "fromVectorValuedFunctionOfDim",
          },
          numericalThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "numericalThroughPoints",
          },
          splineCoeffs: {
            dependencyType: "stateVariable",
            variableName: "splineCoeffs",
          },
          numThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "numThroughPoints",
          },
          extrapolateBackward: {
            dependencyType: "stateVariable",
            variableName: "extrapolateBackward",
          },
          extrapolateBackwardCoeffs: {
            dependencyType: "stateVariable",
            variableName: "extrapolateBackwardCoeffs",
          },
          extrapolateForward: {
            dependencyType: "stateVariable",
            variableName: "extrapolateForward",
          },
          extrapolateForwardCoeffs: {
            dependencyType: "stateVariable",
            variableName: "extrapolateForwardCoeffs",
          },
        };

        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          if (stateValues.fromVectorValuedFunctionOfDim > 1) {
            let dim = Number(arrayKey) + 1;
            dependenciesByKey[arrayKey] = {
              functionChild: {
                dependencyType: "child",
                childGroups: ["functions"],
                variableNames: [`numericalf${dim}`, `fDefinition${dim}`],
                childIndices: [0],
              },
            };

            globalDependencies.fShadow = {
              dependencyType: "stateVariable",
              variableName: "fShadow",
            };
            globalDependencies.fDefinitionsAdapted = {
              dependencyType: "adapterSourceStateVariable",
              variableName: "fDefinitions",
            };
          } else {
            dependenciesByKey[arrayKey] = {
              functionChild: {
                dependencyType: "child",
                childGroups: ["functions"],
                variableNames: ["numericalf", "fDefinition"],
                childIndices: [arrayKey],
              },
            };

            if (Number(arrayKey) === 0) {
              dependenciesByKey[arrayKey].fShadow = {
                dependencyType: "stateVariable",
                variableName: "fShadow",
              };
              dependenciesByKey[arrayKey].fDefinitionAdapted = {
                dependencyType: "adapterSourceStateVariable",
                variableName: "fDefinition",
              };
            }
          }
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        if (globalDependencyValues.curveType === "bezier") {
          let bezierArguments = {
            functionType: "bezier",
            numThroughPoints: globalDependencyValues.numThroughPoints,
            numericalThroughPoints:
              globalDependencyValues.numericalThroughPoints,
            splineCoeffs: globalDependencyValues.splineCoeffs,
            extrapolateForward: globalDependencyValues.extrapolateForward,
            extrapolateForwardCoeffs:
              globalDependencyValues.extrapolateForwardCoeffs,
            extrapolateBackward: globalDependencyValues.extrapolateBackward,
            extrapolateBackwardCoeffs:
              globalDependencyValues.extrapolateBackwardCoeffs,
          };

          let fs = {};
          let fDefinitions = {};
          bezierArguments.component = 0;
          fs[0] = returnBezierFunctions(bezierArguments);
          fDefinitions[0] = bezierArguments;

          bezierArguments = { ...bezierArguments };
          bezierArguments.component = 1;
          fs[1] = returnBezierFunctions(bezierArguments);
          fDefinitions[1] = bezierArguments;

          return {
            setValue: {
              fs,
              fDefinitions,
            },
          };
        }

        let fs = {};
        let fDefinitions = {};
        for (let arrayKey of arrayKeys) {
          let functionChild = dependencyValuesByKey[arrayKey].functionChild;
          if (functionChild.length === 1) {
            if (globalDependencyValues.fromVectorValuedFunctionOfDim > 1) {
              let dim = Number(arrayKey) + 1;
              fs[arrayKey] = functionChild[0].stateValues[`numericalf${dim}`];
              fDefinitions[arrayKey] =
                functionChild[0].stateValues[`fDefinition${dim}`];
            } else {
              fs[arrayKey] = functionChild[0].stateValues.numericalf;
              fDefinitions[arrayKey] = functionChild[0].stateValues.fDefinition;
            }
          } else {
            if (globalDependencyValues.fromVectorValuedFunctionOfDim > 1) {
              fs[arrayKey] = globalDependencyValues.fShadow[arrayKey];
              fDefinitions[arrayKey] =
                globalDependencyValues.fDefinitionsAdapted[arrayKey];
            } else {
              if (
                Number(arrayKey) === 0 &&
                dependencyValuesByKey[arrayKey].fShadow?.[0]
              ) {
                fs[arrayKey] = dependencyValuesByKey[arrayKey].fShadow[0];
                fDefinitions[arrayKey] =
                  dependencyValuesByKey[arrayKey].fDefinitionAdapted;
              } else {
                fs[arrayKey] = () => 0;
                fDefinitions[arrayKey] = {
                  functionType: "zero",
                };
              }
            }
          }
        }
        return {
          setValue: { fs, fDefinitions },
        };
      },
    };

    stateVariableDefinitions.f = {
      isAlias: true,
      targetVariableName: "f1",
    };

    stateVariableDefinitions.allXCriticalPoints = {
      returnDependencies: () => ({
        splineCoeffs: {
          dependencyType: "stateVariable",
          variableName: "splineCoeffs",
        },
        fs: {
          dependencyType: "stateVariable",
          variableName: "fs",
        },
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType",
        },
      }),
      definition({ dependencyValues }) {
        let allXCriticalPoints = [];

        if (dependencyValues.curveType !== "bezier") {
          return { setValue: { allXCriticalPoints } };
        }

        let fx = dependencyValues.fs[0];
        let fy = dependencyValues.fs[1];

        let ts = [];

        let xCriticalPointAtPreviousRight = false;

        for (let [ind, cs] of dependencyValues.splineCoeffs.entries()) {
          let the_cs = cs[0];

          let A = 3 * the_cs[3];
          let B = 2 * the_cs[2];
          let C = the_cs[1];

          if (Math.abs(A) < 1e-14) {
            let t = -C / B;

            xCriticalPointAtPreviousRight = addTimePointBezier({
              t,
              ind,
              ts,
              ignoreLeft: xCriticalPointAtPreviousRight,
            });
          } else {
            let discrim = B * B - 4 * A * C;

            if (discrim == 0) {
              let t = -B / (2 * A);
              xCriticalPointAtPreviousRight = addTimePointBezier({
                t,
                ind,
                ts,
                ignoreLeft: xCriticalPointAtPreviousRight,
              });
            } else if (discrim > 0) {
              let sqd = Math.sqrt(discrim);
              let newTs = [(-B - sqd) / (2 * A), (-B + sqd) / (2 * A)];
              if (A < 0) {
                newTs = [newTs[1], newTs[0]];
              }
              let foundRight = false;
              for (let t of newTs) {
                let temp = addTimePointBezier({
                  t,
                  ind,
                  ts,
                  ignoreLeft: xCriticalPointAtPreviousRight,
                });
                if (temp) {
                  foundRight = true;
                }
              }
              xCriticalPointAtPreviousRight = foundRight;
            } else {
              xCriticalPointAtPreviousRight = false;
            }
          }
        }

        for (let t of ts) {
          allXCriticalPoints.push([fx(t), fy(t)]);
        }

        return { setValue: { allXCriticalPoints } };
      },
    };

    stateVariableDefinitions.numXCriticalPoints = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        allXCriticalPoints: {
          dependencyType: "stateVariable",
          variableName: "allXCriticalPoints",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            numXCriticalPoints: dependencyValues.allXCriticalPoints.length,
          },
        };
      },
    };

    stateVariableDefinitions.xCriticalPoints = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "xCriticalPointX") {
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
      entryPrefixes: ["xCriticalPointX", "xCriticalPoint"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "xCriticalPointX") {
          // xCriticalPointX1_2 is the 2nd component of the first point
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
          // xCriticalPoint3 is all components of the third xCriticalPoint

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
        if (varName === "xCriticalPoints") {
          if (propIndex.length === 1) {
            return "xCriticalPoint" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `xCriticalPointX${propIndex[0]}_${propIndex[1]}`;
          }
        }
        if (varName.slice(0, 14) === "xCriticalPoint") {
          // could be xCriticalPoint or xCriticalPointX
          let xCriticalPointNum = Number(varName.slice(14));
          if (Number.isInteger(xCriticalPointNum) && xCriticalPointNum > 0) {
            // if propIndex has additional entries, ignore them
            return `xCriticalPointX${xCriticalPointNum}_${propIndex[0]}`;
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        numXCriticalPoints: {
          dependencyType: "stateVariable",
          variableName: "numXCriticalPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numXCriticalPoints, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allXCriticalPoints: {
            dependencyType: "stateVariable",
            variableName: "allXCriticalPoints",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function xCriticalPoints`)
        // console.log(globalDependencyValues)

        let xCriticalPoints = {};

        for (
          let ptInd = 0;
          ptInd < globalDependencyValues.__array_size[0];
          ptInd++
        ) {
          for (let i = 0; i < 2; i++) {
            let arrayKey = `${ptInd},${i}`;

            xCriticalPoints[arrayKey] =
              globalDependencyValues.allXCriticalPoints[ptInd][i];
          }
        }

        return { setValue: { xCriticalPoints } };
      },
    };

    stateVariableDefinitions.allYCriticalPoints = {
      returnDependencies: () => ({
        splineCoeffs: {
          dependencyType: "stateVariable",
          variableName: "splineCoeffs",
        },
        fs: {
          dependencyType: "stateVariable",
          variableName: "fs",
        },
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType",
        },
      }),
      definition({ dependencyValues }) {
        let allYCriticalPoints = [];

        if (dependencyValues.curveType !== "bezier") {
          return { setValue: { allYCriticalPoints } };
        }

        let fx = dependencyValues.fs[0];
        let fy = dependencyValues.fs[1];

        let ts = [];

        let yCriticalPointAtPreviousRight = false;

        for (let [ind, cs] of dependencyValues.splineCoeffs.entries()) {
          let the_cs = cs[1];

          let A = 3 * the_cs[3];
          let B = 2 * the_cs[2];
          let C = the_cs[1];

          if (Math.abs(A) < 1e-14) {
            let t = -C / B;

            yCriticalPointAtPreviousRight = addTimePointBezier({
              t,
              ind,
              ts,
              ignoreLeft: yCriticalPointAtPreviousRight,
            });
          } else {
            let discrim = B * B - 4 * A * C;

            if (discrim == 0) {
              let t = -B / (2 * A);

              yCriticalPointAtPreviousRight = addTimePointBezier({
                t,
                ind,
                ts,
                ignoreLeft: yCriticalPointAtPreviousRight,
              });
            } else if (discrim > 0) {
              let sqd = Math.sqrt(discrim);
              let newTs = [(-B - sqd) / (2 * A), (-B + sqd) / (2 * A)];
              if (A < 0) {
                newTs = [newTs[1], newTs[0]];
              }
              let foundRight = false;
              for (let t of newTs) {
                let temp = addTimePointBezier({
                  t,
                  ind,
                  ts,
                  ignoreLeft: yCriticalPointAtPreviousRight,
                });
                if (temp) {
                  foundRight = true;
                }
              }
              yCriticalPointAtPreviousRight = foundRight;
            } else {
              yCriticalPointAtPreviousRight = false;
            }
          }
        }

        for (let t of ts) {
          allYCriticalPoints.push([fx(t), fy(t)]);
        }

        return { setValue: { allYCriticalPoints } };
      },
    };

    stateVariableDefinitions.numYCriticalPoints = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        allYCriticalPoints: {
          dependencyType: "stateVariable",
          variableName: "allYCriticalPoints",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            numYCriticalPoints: dependencyValues.allYCriticalPoints.length,
          },
        };
      },
    };

    stateVariableDefinitions.yCriticalPoints = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "yCriticalPointX") {
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
      entryPrefixes: ["yCriticalPointX", "yCriticalPoint"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "yCriticalPointX") {
          // yCriticalPointX1_2 is the 2nd component of the first point
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
          // yCriticalPoint3 is all components of the third yCriticalPoint

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
        if (varName === "yCriticalPoints") {
          if (propIndex.length === 1) {
            return "yCriticalPoint" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `yCriticalPointX${propIndex[0]}_${propIndex[1]}`;
          }
        }
        if (varName.slice(0, 14) === "yCriticalPoint") {
          // could be yCriticalPoint or yCriticalPointX
          let yCriticalPointNum = Number(varName.slice(14));
          if (Number.isInteger(yCriticalPointNum) && yCriticalPointNum > 0) {
            // if propIndex has additional entries, ignore them
            return `yCriticalPointX${yCriticalPointNum}_${propIndex[0]}`;
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        numYCriticalPoints: {
          dependencyType: "stateVariable",
          variableName: "numYCriticalPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numYCriticalPoints, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allYCriticalPoints: {
            dependencyType: "stateVariable",
            variableName: "allYCriticalPoints",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function yCriticalPoints`)
        // console.log(globalDependencyValues)

        let yCriticalPoints = {};

        for (
          let ptInd = 0;
          ptInd < globalDependencyValues.__array_size[0];
          ptInd++
        ) {
          for (let i = 0; i < 2; i++) {
            let arrayKey = `${ptInd},${i}`;

            yCriticalPoints[arrayKey] =
              globalDependencyValues.allYCriticalPoints[ptInd][i];
          }
        }

        return { setValue: { yCriticalPoints } };
      },
    };

    stateVariableDefinitions.allCurvatureChangePoints = {
      returnDependencies: () => ({
        splineCoeffs: {
          dependencyType: "stateVariable",
          variableName: "splineCoeffs",
        },
        fs: {
          dependencyType: "stateVariable",
          variableName: "fs",
        },
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType",
        },
      }),
      definition({ dependencyValues }) {
        let allCurvatureChangePoints = [];

        if (dependencyValues.curveType !== "bezier") {
          return { setValue: { allCurvatureChangePoints } };
        }

        let fx = dependencyValues.fs[0];
        let fy = dependencyValues.fs[1];

        let ts = [];

        let changePointAtPreviousRight = false;

        for (let [ind, cs] of dependencyValues.splineCoeffs.entries()) {
          let [dx, cx, bx, ax] = cs[0];
          let [dy, cy, by, ay] = cs[1];

          let A = 3 * (bx * ay - by * ax);
          let B = 3 * (cx * ay - cy * ax);
          let C = cx * by - cy * bx;

          if (Math.abs(A) < 1e-14) {
            let t = -C / B;

            changePointAtPreviousRight = addTimePointBezier({
              t,
              ind,
              ts,
              ignoreLeft: changePointAtPreviousRight,
            });
          } else {
            let discrim = B * B - 4 * A * C;

            if (discrim == 0) {
              let t = -B / (2 * A);

              changePointAtPreviousRight = addTimePointBezier({
                t,
                ind,
                ts,
                ignoreLeft: changePointAtPreviousRight,
              });
            } else if (discrim > 0) {
              let sqd = Math.sqrt(discrim);
              let newTs = [(-B - sqd) / (2 * A), (-B + sqd) / (2 * A)];
              if (A < 0) {
                newTs = [newTs[1], newTs[0]];
              }
              let foundRight = false;
              for (let t of newTs) {
                let temp = addTimePointBezier({
                  t,
                  ind,
                  ts,
                  ignoreLeft: changePointAtPreviousRight,
                });
                if (temp) {
                  foundRight = true;
                }
              }
              changePointAtPreviousRight = foundRight;
            } else {
              changePointAtPreviousRight = false;
            }
          }
        }

        for (let t of ts) {
          allCurvatureChangePoints.push([fx(t), fy(t)]);
        }

        return { setValue: { allCurvatureChangePoints } };
      },
    };

    stateVariableDefinitions.numCurvatureChangePoints = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        allCurvatureChangePoints: {
          dependencyType: "stateVariable",
          variableName: "allCurvatureChangePoints",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            numCurvatureChangePoints:
              dependencyValues.allCurvatureChangePoints.length,
          },
        };
      },
    };

    stateVariableDefinitions.curvatureChangePoints = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "curvatureChangePointX") {
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
      entryPrefixes: ["curvatureChangePointX", "curvatureChangePoint"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "curvatureChangePointX") {
          // curvatureChangePointX1_2 is the 2nd component of the first point
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
          // curvatureChangePoint3 is all components of the third curvatureChangePoint

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
        if (varName === "curvatureChangePoints") {
          if (propIndex.length === 1) {
            return "curvatureChangePoint" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `curvatureChangePointX${propIndex[0]}_${propIndex[1]}`;
          }
        }
        if (varName.slice(0, 20) === "curvatureChangePoint") {
          // could be curvatureChangePoint or curvatureChangePointX
          let curvatureChangePointNum = Number(varName.slice(20));
          if (
            Number.isInteger(curvatureChangePointNum) &&
            curvatureChangePointNum > 0
          ) {
            // if propIndex has additional entries, ignore them
            return `curvatureChangePointX${curvatureChangePointNum}_${propIndex[0]}`;
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        numCurvatureChangePoints: {
          dependencyType: "stateVariable",
          variableName: "numCurvatureChangePoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numCurvatureChangePoints, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allCurvatureChangePoints: {
            dependencyType: "stateVariable",
            variableName: "allCurvatureChangePoints",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function curvatureChangePoints`)
        // console.log(globalDependencyValues)

        let curvatureChangePoints = {};

        for (
          let ptInd = 0;
          ptInd < globalDependencyValues.__array_size[0];
          ptInd++
        ) {
          for (let i = 0; i < 2; i++) {
            let arrayKey = `${ptInd},${i}`;

            curvatureChangePoints[arrayKey] =
              globalDependencyValues.allCurvatureChangePoints[ptInd][i];
          }
        }

        return { setValue: { curvatureChangePoints } };
      },
    };

    stateVariableDefinitions.nearestPointAsCurve = {
      returnDependencies: () => ({
        nearestPointAsCurvePrelim: {
          dependencyType: "stateVariable",
          variableName: "nearestPointAsCurvePrelim",
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["nearestPointAsCurve"],
        },
        adapterSourceValue: {
          dependencyType: "adapterSourceStateVariable",
          variableName: "nearestPointAsCurve",
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        let nearestPointAsCurve = dependencyValues.nearestPointAsCurvePrelim;
        if (usedDefault.nearestPointAsCurvePrelim) {
          if (dependencyValues.functionChild.length > 0) {
            nearestPointAsCurve =
              dependencyValues.functionChild[0].stateValues.nearestPointAsCurve;
          } else if (dependencyValues.adapterSourceValue !== null) {
            nearestPointAsCurve = dependencyValues.adapterSourceValue;
          }
        }
        return { setValue: { nearestPointAsCurve } };
      },
    };

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType",
        },
        fs: {
          dependencyType: "stateVariable",
          variableName: "fs",
        },
        flipFunction: {
          dependencyType: "stateVariable",
          variableName: "flipFunction",
        },
        numDiscretizationPoints: {
          dependencyType: "stateVariable",
          variableName: "numDiscretizationPoints",
        },
        parMin: {
          dependencyType: "stateVariable",
          variableName: "parMin",
        },
        parMax: {
          dependencyType: "stateVariable",
          variableName: "parMax",
        },
        periodic: {
          dependencyType: "stateVariable",
          variableName: "periodic",
        },
        graphXmin: {
          dependencyType: "stateVariable",
          variableName: "graphXmin",
        },
        graphXmax: {
          dependencyType: "stateVariable",
          variableName: "graphXmax",
        },
        graphYmin: {
          dependencyType: "stateVariable",
          variableName: "graphYmin",
        },
        graphYmax: {
          dependencyType: "stateVariable",
          variableName: "graphYmax",
        },
        nearestPointAsCurve: {
          dependencyType: "stateVariable",
          variableName: "nearestPointAsCurve",
        },
      }),
      definition({ dependencyValues }) {
        let nearestPointFunction = null;

        if (dependencyValues.curveType === "function") {
          nearestPointFunction = getNearestPointFunctionCurve({
            dependencyValues,
            numerics,
          });
        } else if (
          ["parameterization", "bezier"].includes(dependencyValues.curveType)
        ) {
          nearestPointFunction = getNearestPointParametrizedCurve({
            dependencyValues,
            numerics,
          });
        }

        return {
          setValue: { nearestPoint: nearestPointFunction },
        };
      },
    };

    return stateVariableDefinitions;
  }

  async moveControlVector({
    controlVector,
    controlVectorInds,
    transient,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let desiredVector = {
      [controlVectorInds + ",0"]: me.fromAst(controlVector[0]),
      [controlVectorInds + ",1"]: me.fromAst(controlVector[1]),
    };

    if (transient) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "controlVectors",
            value: desiredVector,
            sourceDetails: { controlVectorMoved: controlVectorInds },
          },
        ],
        transient,
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    } else {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "controlVectors",
            value: desiredVector,
            sourceDetails: { controlVectorMoved: controlVectorInds },
          },
        ],
        actionId,
        sourceInformation,
        skipRendererUpdate,
        event: {
          verb: "interacted",
          object: {
            componentId: this.componentName,
          },
          result: {
            ["controlVector" + controlVectorInds.join("_")]: controlVector,
          },
        },
      });
    }
  }

  async moveThroughPoint({
    throughPoint,
    throughPointInd,
    transient,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let desiredPoint = {
      [throughPointInd + ",0"]: me.fromAst(throughPoint[0]),
      [throughPointInd + ",1"]: me.fromAst(throughPoint[1]),
    };

    if (transient) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "throughPoints",
            value: desiredPoint,
            sourceDetails: { throughPointMoved: throughPointInd },
          },
        ],
        transient,
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    } else {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "throughPoints",
            value: desiredPoint,
            sourceDetails: { throughPointMoved: throughPointInd },
          },
        ],
        actionId,
        sourceInformation,
        skipRendererUpdate,
        event: {
          verb: "interacted",
          object: {
            componentId: this.componentName,
          },
          result: {
            ["throughPoint" + throughPointInd]: throughPoint,
          },
        },
      });
    }
  }

  async changeVectorControlDirection({
    direction,
    throughPointInd,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    return await this.coreFunctions.performUpdate({
      updateInstructions: [
        {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "vectorControlDirection",
          value: { [throughPointInd]: direction },
        },
      ],
      actionId,
      sourceInformation,
      skipRendererUpdate,
    });
  }

  switchCurve() {}

  async curveClicked({
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

  async curveFocused({
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

function getNearestPointFunctionCurve({ dependencyValues, numerics }) {
  let flipFunction = dependencyValues.flipFunction;
  let f = dependencyValues.fs[0];
  let numDiscretizationPoints = dependencyValues.numDiscretizationPoints;
  let parMax = dependencyValues.parMax;
  let parMin = dependencyValues.parMin;

  return function ({ variables, scales }) {
    let x1 = variables.x1?.evaluate_to_constant();
    let x2 = variables.x2?.evaluate_to_constant();

    // Note: if x1 and and x2 are not numbers,
    // the below algorithm may yield values calculated at parMin or parMax

    let xscale = scales[0];
    let yscale = scales[1];

    // compute values at the actual endpoints, if they exist

    let x1AtLeftEndpoint, x2AtLeftEndpoint;
    if (parMin !== -Infinity) {
      x1AtLeftEndpoint = parMin;
      x2AtLeftEndpoint = f(parMin);

      if (!Number.isFinite(x2AtLeftEndpoint)) {
        // in case function was defined on an open interval
        // check a point just to the right
        let parMinAdjust = parMin * 0.99999 + parMax * 0.00001;
        let x2AtLeftEndpointAdjust = f(parMinAdjust);
        if (Number.isFinite(x2AtLeftEndpointAdjust)) {
          x1AtLeftEndpoint = parMinAdjust;
          x2AtLeftEndpoint = x2AtLeftEndpointAdjust;
        }
      }
      if (flipFunction) {
        let temp = x1AtLeftEndpoint;
        x1AtLeftEndpoint = x2AtLeftEndpoint;
        x2AtLeftEndpoint = temp;
      }
    }

    let x1AtRightEndpoint, x2AtRightEndpoint;
    if (parMax !== Infinity) {
      x1AtRightEndpoint = parMax;
      x2AtRightEndpoint = f(parMax);

      if (!Number.isFinite(x2AtRightEndpoint)) {
        // in case function was defined on an open interval
        // check a point just to the left
        let parMaxAdjust = parMin * 0.00001 + parMax * 0.99999;
        let x2AtRightEndpointAdjust = f(parMaxAdjust);
        if (Number.isFinite(x2AtRightEndpointAdjust)) {
          x1AtRightEndpoint = parMaxAdjust;
          x2AtRightEndpoint = x2AtRightEndpointAdjust;
        }
      }

      if (flipFunction) {
        let temp = x1AtRightEndpoint;
        x1AtRightEndpoint = x2AtRightEndpoint;
        x2AtRightEndpoint = temp;
      }
    }

    if (
      !dependencyValues.nearestPointAsCurve ||
      !(Number.isFinite(x1) && Number.isFinite(x2))
    ) {
      // first find nearest point when treating a function
      // (or an inverse function)
      // which finds a the nearest point vertically
      // (or horizontally)
      // assuming the function is defined at that point

      let x1AsFunction, x2AsFunction;
      if (flipFunction) {
        x2AsFunction = x2;
        x1AsFunction = f(x2AsFunction);
      } else {
        x1AsFunction = x1;
        x2AsFunction = f(x1AsFunction);
      }

      // if function isn't defined at current variable value, replace with
      // value at nearest endpoint

      if (!(Number.isFinite(x1AsFunction) && Number.isFinite(x2AsFunction))) {
        let distLeft, distRight;
        if (flipFunction) {
          distLeft = Math.abs(parMin - x2);
          distRight = Math.abs(parMax - x2);
        } else {
          distLeft = Math.abs(parMin - x1);
          distRight = Math.abs(parMax - x1);
        }

        if (distLeft < distRight || !Number.isFinite(distRight)) {
          x1AsFunction = x1AtLeftEndpoint;
          x2AsFunction = x2AtLeftEndpoint;
        } else {
          x1AsFunction = x1AtRightEndpoint;
          x2AsFunction = x2AtRightEndpoint;
        }
      }

      // assuming we found a finite point, we're done
      if (Number.isFinite(x1AsFunction) && Number.isFinite(x2AsFunction)) {
        let result = {
          x1: x1AsFunction,
          x2: x2AsFunction,
        };
        if (variables.x3 !== undefined) {
          result.x3 = 0;
        }
        return result;
      }

      // if we don't have finite values for both componentts
      // there's nothing more we can do
      if (!(Number.isFinite(x1) && Number.isFinite(x2))) {
        return {};
      }
    }

    // if we are finding nearest point as a curve,
    // or if finding nearest point as a function failed,
    // find the overall nearest point from the curve to (x1,x2)

    let minfunc = function (x) {
      let dx1 = x1;
      let dx2 = x2;

      if (flipFunction) {
        dx1 -= f(x);
        dx2 -= x;
      } else {
        dx1 -= x;
        dx2 -= f(x);
      }

      dx1 /= xscale;
      dx2 /= yscale;

      return dx1 * dx1 + dx2 * dx2;
    };

    let minT = 0;
    let maxT = 1;
    if (parMin !== -Infinity) {
      minT = parMin;
    }
    if (parMax !== -Infinity) {
      maxT = parMax;
    }

    let Nsteps = numDiscretizationPoints;
    let delta = (maxT - minT) / Nsteps;

    // sample Nsteps values of x between  [minT, maxT]
    // and find one where the value of minfunc is smallest
    // Will create an interval [tIntervalMin, tIntervalMax]
    // around that point (unless that point is minT or maxT)
    // to run numerical minimizer over that interval

    let tAtMin = minT;
    let fAtMin = minfunc(minT);
    let tIntervalMin = minT;
    let tIntervalMax = minT + delta;

    let fprev, tprev;

    for (let step = 1; step <= Nsteps; step++) {
      let tnew = minT + step * delta;
      let fnew = minfunc(tnew);
      if (
        Number.isFinite(fnew) &&
        Number.isFinite(fprev) &&
        (fnew < fAtMin || Number.isNaN(fAtMin))
      ) {
        tAtMin = tnew;
        fAtMin = fnew;
        tIntervalMin = tprev;
        if (step === Nsteps) {
          tIntervalMax = tnew;
        } else {
          tIntervalMax = tnew + delta;
        }
      }

      fprev = fnew;
      tprev = tnew;
    }

    // haven't necessarily checked f at tIntervalMax
    let fAtIntervalMax = minfunc(tIntervalMax);
    if (!Number.isFinite(fAtIntervalMax)) {
      tIntervalMax -= delta;
    }

    let result = numerics.fminbr(minfunc, [tIntervalMin, tIntervalMax]);
    tAtMin = result.x;

    let x1AtMin = tAtMin;
    let x2AtMin = f(x1AtMin);

    let currentD2;

    if (
      !(result.success && Number.isFinite(x1AtMin) && Number.isFinite(x2AtMin))
    ) {
      currentD2 = Infinity;
    } else {
      if (flipFunction) {
        [x1AtMin, x2AtMin] = [x2AtMin, x1AtMin];
      }

      currentD2 =
        Math.pow((x1AtMin - x1) / xscale, 2) +
        Math.pow((x2AtMin - x2) / yscale, 2);
    }

    // replace with endpoints if closer

    if (parMin !== -Infinity) {
      let leftEndpointD2 =
        Math.pow((x1AtLeftEndpoint - x1) / xscale, 2) +
        Math.pow((x2AtLeftEndpoint - x2) / yscale, 2);
      if (leftEndpointD2 < currentD2) {
        x1AtMin = x1AtLeftEndpoint;
        x2AtMin = x2AtLeftEndpoint;
        currentD2 = leftEndpointD2;
      }
    }

    if (parMax !== Infinity) {
      let rightEndpointD2 =
        Math.pow((x1AtRightEndpoint - x1) / xscale, 2) +
        Math.pow((x2AtRightEndpoint - x2) / yscale, 2);
      if (rightEndpointD2 < currentD2) {
        x1AtMin = x1AtRightEndpoint;
        x2AtMin = x2AtRightEndpoint;
        currentD2 = rightEndpointD2;
      }
    }

    result = {
      x1: x1AtMin,
      x2: x2AtMin,
    };

    if (variables.x3 !== undefined) {
      result.x3 = 0;
    }

    return result;
  };
}

function getNearestPointParametrizedCurve({ dependencyValues, numerics }) {
  let fs = dependencyValues.fs;
  let parMin = dependencyValues.parMin;
  let parMax = dependencyValues.parMax;
  let numDiscretizationPoints = dependencyValues.numDiscretizationPoints;
  let periodic = dependencyValues.periodic;

  return function ({ variables, scales }) {
    let xscale = scales[0];
    let yscale = scales[1];

    // TODO: extend to dimensions other than N=2

    if (dependencyValues.fs.length !== 2) {
      return {};
    }

    let x1 = variables.x1?.evaluate_to_constant();
    let x2 = variables.x2?.evaluate_to_constant();

    if (!(Number.isFinite(x1) && Number.isFinite(x2))) {
      return {};
    }

    let minfunc = function (t) {
      let dx1 = (x1 - fs[0](t)) / xscale;
      let dx2 = (x2 - fs[1](t)) / yscale;

      return dx1 * dx1 + dx2 * dx2;
    };

    let minT = parMin;
    let maxT = parMax;

    let Nsteps = numDiscretizationPoints;
    let delta = (maxT - minT) / Nsteps;

    // sample Nsteps values of x between  [minT, maxT]
    // and find one where the value of minfunc is smallest
    // Will create an interval [tIntervalMin, tIntervalMax]
    // around that point (unless that point is minT or maxT)
    // to run numerical minimizer over that interval

    let tAtMin = minT;
    let fAtMin = minfunc(minT);
    let tIntervalMin = minT;
    let tIntervalMax = minT + delta;

    let fprev, tprev;

    for (let step = 1; step <= Nsteps; step++) {
      let tnew = minT + step * delta;
      let fnew = minfunc(tnew);
      if (
        Number.isFinite(fnew) &&
        Number.isFinite(fprev) &&
        (fnew < fAtMin || Number.isNaN(fAtMin))
      ) {
        tAtMin = tnew;
        fAtMin = fnew;
        tIntervalMin = tprev;
        if (step === Nsteps) {
          tIntervalMax = tnew;
        } else {
          tIntervalMax = tnew + delta;
        }
      }

      fprev = fnew;
      tprev = tnew;
    }

    if (periodic) {
      // if have periodic
      // and tAtMin is at endpoint, make interval span past endpoint
      if (Math.abs(tAtMin - minT) < numerics.eps) {
        // append interval for delta for last interval before minT
        tIntervalMin = minT - delta;
      } else if (Math.abs(tAtMin - maxT) < numerics.eps) {
        // append interval for delta for first interval after minT
        tIntervalMax = maxT + delta;
      }
    }

    let result = numerics.fminbr(minfunc, [tIntervalMin, tIntervalMax]);
    tAtMin = result.x;

    let x1AtMin = fs[0](tAtMin);
    let x2AtMin = fs[1](tAtMin);

    // replace with endpoints if closer
    let fMin = minfunc(tAtMin);

    if (
      !result.success &&
      Number.isFinite(x1AtMin) &&
      Number.isFinite(x2AtMin)
    ) {
      fMin = Infinity;
    }

    if (Number.isFinite(parMin)) {
      let fParMin = minfunc(parMin);
      if (fParMin < fMin) {
        tAtMin = parMin;
        x1AtMin = fs[0](tAtMin);
        x2AtMin = fs[1](tAtMin);
        fMin = fParMin;
      }
    }

    if (Number.isFinite(parMax)) {
      let fParMax = minfunc(parMax);
      if (fParMax < fMin) {
        tAtMin = parMax;
        x1AtMin = fs[0](tAtMin);
        x2AtMin = fs[1](tAtMin);
        fMin = fParMax;
      }
    }

    result = {
      x1: x1AtMin,
      x2: x2AtMin,
    };

    if (variables.x3 !== undefined) {
      result.x3 = 0;
    }

    return result;
  };
}

function calculateControlVectorFromSpline({
  tau,
  eps,
  point1,
  point2,
  point3,
  splineForm,
}) {
  let dist = function (p1, p2) {
    let dx = p1[0] - p2[0];
    let dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
  };

  let p1, p2, p3;

  if (point2) {
    p2 = point2.map((x) => x.evaluate_to_constant());
  } else {
    return {
      coordsNumeric: [me.fromAst(NaN), me.fromAst(NaN)],
      numericEntries: false,
    };
  }

  if (point3) {
    p3 = point3.map((x) => x.evaluate_to_constant());

    if (point1) {
      p1 = point1.map((x) => x.evaluate_to_constant());
    } else {
      p1 = [2 * p2[0] - p3[0], 2 * p2[1] - p3[1]];
    }
  } else {
    if (point1) {
      p1 = point1.map((x) => x.evaluate_to_constant());
      p3 = [2 * p2[0] - p1[0], 2 * p2[1] - p1[1]];
    } else {
      return {
        coordsNumeric: [me.fromAst(NaN), me.fromAst(NaN)],
        numericEntries: false,
      };
    }
  }

  let cv = [];

  if (splineForm === "centripetal") {
    let dt0 = dist(p1, p2);
    let dt1 = dist(p2, p3);

    dt0 = Math.sqrt(dt0);
    dt1 = Math.sqrt(dt1);

    if (dt1 < eps) {
      dt1 = 1.0;
    }
    if (dt0 < eps) {
      dt0 = dt1;
    }

    for (let dim = 0; dim < 2; dim++) {
      let t1 =
        (p2[dim] - p1[dim]) / dt0 -
        (p3[dim] - p1[dim]) / (dt1 + dt0) +
        (p3[dim] - p2[dim]) / dt1;

      // original algorithm would multiply by different dt's on each side
      // of the point
      // Took geometric mean so that control vectors are symmetric
      t1 *= tau * Math.sqrt(dt0 * dt1);

      // Bezier control vector component lengths
      // are one third the respective derivative of the cubic
      // if (i === 0) {
      //   cv.push(t1 / 3);
      // } else {
      cv.push(-t1 / 3);
      // }
    }
  } else {
    // uniform spline case
    for (let dim = 0; dim < 2; dim++) {
      // Bezier control vector component lengths
      // are one third the respective derivative of the cubic
      // if (i === 0) {
      //   cv.push(tau * (p3[dim] - p1[dim]) / 3);
      // } else {
      cv.push((-tau * (p3[dim] - p1[dim])) / 3);
      // }
    }
  }
  let coordsNumeric = cv.map((x) => me.fromAst(x));
  let numericEntries = Number.isFinite(cv[0]) && Number.isFinite(cv[1]);

  return { coordsNumeric, numericEntries };
}

// Compute coefficients for a cubic polynomial
//   p(s) = c0 + c1*s + c2*s^2 + c3*s^3
// such that
//   p(0) = x1, p(1) = x2
// and
//   p'(0) = t1, p'(1) = t2
function initCubicPoly(x1, x2, t1, t2) {
  return [x1, t1, -3 * x1 + 3 * x2 - 2 * t1 - t2, 2 * x1 - 2 * x2 + t1 + t2];
}

function addTimePointBezier({ t, ind, ts, ignoreLeft = false }) {
  const eps = 1e-14;
  const one_plus_eps = 1 + eps;
  const one_minus_eps = 1 - eps;

  let foundRight = false;

  if (t >= eps) {
    if (t <= one_minus_eps) {
      ts.push(ind + t);
    } else if (t < one_plus_eps) {
      ts.push(ind + 1);
      foundRight = true;
    }
  } else if (t > -eps && !ignoreLeft) {
    ts.push(ind);
  }

  return foundRight;
}
