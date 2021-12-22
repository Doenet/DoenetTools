import GraphicalComponent from './abstract/GraphicalComponent';
import {
  returnBreakStringsSugarFunction
} from './commonsugar/breakstrings';

import me from 'math-expressions';

export default class Curve extends GraphicalComponent {
  static componentType = "curve";
  static rendererType = "curve";


  actions = {
    moveControlVector: this.moveControlVector.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
    moveThroughPoint: this.moveThroughPoint.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
    changeVectorControlDirection: this.changeVectorControlDirection.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
    switchCurve: this.switchCurve.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
  };

  static primaryStateVariableForDefinition = "fShadow";
  static get stateVariablesShadowedForReference() {
    return [
      "variableForChild", "parMin", "parMax",
      "curveType", "nThroughPoints", "nDimensions", "throughPoints"
    ]
  };


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    attributes.label.propagateToDescendants = true;
    attributes.showLabel.propagateToDescendants = true;
    attributes.layer.propagateToDescendants = true;

    attributes.labelPosition = {
      createComponentOfType: "text",
      createStateVariable: "labelPosition",
      defaultValue: "upperright",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["upperright", "upperleft", "lowerright", "lowerleft", "top", "bottom", "left", "right"],
      propagateToDescendants: true,
    }

    attributes.flipFunction = {
      createComponentOfType: "boolean",
      createStateVariable: "flipFunction",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };
    attributes.nDiscretizationPoints = {
      createComponentOfType: "number",
      createStateVariable: "nDiscretizationPoints",
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
      validValues: ["centripetal", "uniform"]
    };
    attributes.variable = {
      createComponentOfType: "variable",
      createStateVariable: "variableForChild",
      defaultValue: me.fromAst("x"),
    }

    attributes.through = {
      createComponentOfType: "_pointListComponent"
    }
    attributes.parMin = {
      createComponentOfType: "math"
    }
    attributes.parMax = {
      createComponentOfType: "math"
    }

    attributes.nearestPointAsCurve = {
      createComponentOfType: "boolean",
      createStateVariable: "nearestPointAsCurve",
      defaultValue: false,
    }

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakIntoFunctionsByCommas = function ({ matchedChildren }) {

      // only apply if all children are strings or macros
      if (!matchedChildren.every(child =>
        typeof child === "string" ||
        child.doenetAttributes && child.doenetAttributes.createdFromMacro
      )) {
        return { success: false }
      }

      let childrenToComponentFunction = x => ({
        componentType: "function", children: x
      });

      let breakFunction = returnBreakStringsSugarFunction({
        childrenToComponentFunction,
        mustStripOffOuterParentheses: true
      })

      let result = breakFunction({ matchedChildren });

      if (!result.success) {
        // if didn't succeed,
        // then just wrap children with a function
        return {
          success: true,
          newChildren: [{
            componentType: "function",
            children: matchedChildren
          }]
        }

      }

      return result;

    };

    sugarInstructions.push({
      replacementFunction: breakIntoFunctionsByCommas
    })

    return sugarInstructions;

  }

  static returnChildGroups() {

    return [{
      group: "functions",
      componentTypes: ["function"]
    }, {
      group: "bezierControls",
      componentTypes: ["bezierControls"]
    }]

  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

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


        let curveDescription = "";
        if (dependencyValues.selectedStyle.lineWidth >= 4) {
          curveDescription += "thick ";
        } else if (dependencyValues.selectedStyle.lineWidth <= 1) {
          curveDescription += "thin ";
        }
        if (dependencyValues.selectedStyle.lineStyle === "dashed") {
          curveDescription += "dashed ";
        } else if (dependencyValues.selectedStyle.lineStyle === "dotted") {
          curveDescription += "dotted ";
        }

        curveDescription += dependencyValues.selectedStyle.lineColor;

        return { newValues: { styleDescription: curveDescription } };
      }
    }

    stateVariableDefinitions.curveType = {
      forRenderer: true,
      returnDependencies: () => ({
        functionChildren: {
          dependencyType: "child",
          childGroups: ["functions"],
        },
        through: {
          dependencyType: "attributeComponent",
          attributeName: "through"
        }
      }),
      definition({ dependencyValues }) {
        let curveType = "function"
        if (dependencyValues.through !== null) {
          curveType = "bezier"
        } else if (dependencyValues.functionChildren.length > 1) {
          curveType = "parameterization"
        }

        return { newValues: { curveType } }
      }
    }

    // fShadow will be null unless curve was created via an adapter
    // In case of adapter,
    // given the primaryStateVariableForDefinition static variable,
    // the definition of fShadow will be changed to be the value
    // that shadows the component adapted
    stateVariableDefinitions.fShadow = {
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          fShadow: { variablesToCheck: ["fShadow"] }
        }
      }),
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


    stateVariableDefinitions.parMax = {
      public: true,
      componentType: "number",
      forRenderer: true,
      defaultValue: 10,
      returnDependencies: () => ({
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType",
        },
        parMaxAttr: {
          dependencyType: "attributeComponent",
          attributeName: "parMax",
          variableNames: ["value"]
        },
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
        extrapolateForward: {
          dependencyType: "stateVariable",
          variableName: "extrapolateForward"
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["domain"]
        },
        adapterSourceDomain: {
          dependencyType: "adapterSourceStateVariable",
          variableName: "domain"
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
        flipFunction: {
          dependencyType: "stateVariable",
          variableName: "flipFunction"
        },
      }),
      definition: function ({ dependencyValues }) {
        let parMax;
        if (dependencyValues.curveType === "bezier") {
          parMax = dependencyValues.nThroughPoints - 1;
          if (dependencyValues.extrapolateForward) {
            parMax *= 2;
          }
        } else if (dependencyValues.parMaxAttr !== null) {
          parMax = dependencyValues.parMaxAttr.stateValues.value.evaluate_to_constant();
          if (!Number.isFinite(parMax)) {
            parMax = NaN;
          }
        } else if (dependencyValues.curveType === "function") {
          let domain = null;
          if (dependencyValues.functionChild.length === 1) {
            domain = dependencyValues.functionChild[0].stateValues.domain;
          } else {
            domain = dependencyValues.adapterSourceDomain;
          }
          if (domain !== null) {
            domain = domain[0];
            try {
              parMax = domain[1].evaluate_to_constant();
              if (!Number.isFinite(parMax)) {
                parMax = NaN;
              }
            } catch (e) { }
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
              parMax = Math.min(parMax, graphMax + 0.1 * (graphMax - graphMin))
            }
          }

          if (parMax === undefined) {
            return {
              useEssentialOrDefaultValue: {
                parMax: { variablesToCheck: ["parMax"], defaultValue: Infinity }
              }
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: {
              parMax: { variablesToCheck: ["parMax"] }
            }
          }
        }

        return { newValues: { parMax } }
      }
    }

    stateVariableDefinitions.parMin = {
      forRenderer: true,
      public: true,
      componentType: "number",
      defaultValue: -10,
      returnDependencies: () => ({
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType",
        },
        parMinAttr: {
          dependencyType: "attributeComponent",
          attributeName: "parMin",
          variableNames: ["value"]
        },
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
        extrapolateBackward: {
          dependencyType: "stateVariable",
          variableName: "extrapolateBackward"
        },
        functionChild: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["domain"]
        },
        adapterSourceDomain: {
          dependencyType: "adapterSourceStateVariable",
          variableName: "domain"
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
        flipFunction: {
          dependencyType: "stateVariable",
          variableName: "flipFunction"
        },
      }),
      definition: function ({ dependencyValues }) {
        let parMin;
        if (dependencyValues.curveType === "bezier") {
          parMin = 0;
          if (dependencyValues.extrapolateBackward) {
            parMin = -(dependencyValues.nThroughPoints - 1);
          }
        } else if (dependencyValues.parMinAttr !== null) {
          parMin = dependencyValues.parMinAttr.stateValues.value.evaluate_to_constant();
          if (!Number.isFinite(parMin)) {
            parMin = NaN;
          }
        } else if (dependencyValues.curveType === "function") {
          let domain = null;
          if (dependencyValues.functionChild.length === 1) {
            domain = dependencyValues.functionChild[0].stateValues.domain;
          } else {
            domain = dependencyValues.adapterSourceDomain;
          }
          if (domain !== null) {
            domain = domain[0];
            try {
              parMin = domain[0].evaluate_to_constant();
              if (!Number.isFinite(parMin)) {
                parMin = NaN;
              }
            } catch (e) { }
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
              parMin = Math.max(parMin, graphMin + 0.1 * (graphMin - graphMax))
            }
          }
          if (parMin === undefined) {
            return {
              useEssentialOrDefaultValue: {
                parMin: { variablesToCheck: ["parMin"], defaultValue: -Infinity }
              }
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: {
              parMin: { variablesToCheck: ["parMin"] }
            }
          }
        }
        return { newValues: { parMin } }
      }
    }

    stateVariableDefinitions.nThroughPoints = {
      returnDependencies: () => ({
        through: {
          dependencyType: "attributeComponent",
          attributeName: "through",
          variableNames: ["nPoints"]
        }
      }),
      definition({ dependencyValues }) {
        let nThroughPoints = 0;
        if (dependencyValues.through !== null) {
          nThroughPoints = dependencyValues.through.stateValues.nPoints
        }
        return { newValues: { nThroughPoints } }
      }
    }

    stateVariableDefinitions.nDimensions = {
      public: true,
      componentType: "number",
      returnDependencies() {
        return {
          through: {
            dependencyType: "attributeComponent",
            attributeName: "through",
            variableNames: ["nDimensions"]
          }
        }
      },
      definition: function ({ dependencyValues }) {

        if (dependencyValues.through !== null) {
          let nDimensions = dependencyValues.through.stateValues.nDimensions;
          return {
            newValues: { nDimensions },
            checkForActualChange: { nDimensions: true }
          }
        } else {
          // curve through zero points
          return { newValues: { nDimensions: 2 } }
        }

      }
    }


    stateVariableDefinitions.throughPoints = {
      public: true,
      componentType: "math",
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["throughPointX", "throughPoint"],
      returnWrappingComponents(prefix) {
        if (prefix === "throughPointX") {
          return [];
        } else {
          // throughPoint or entire array
          // wrap inner dimension by both <point> and <xs>
          // don't wrap outer dimension (for entire array)
          return [["point", { componentType: "mathList", isAttribute: "xs" }]];
        }
      },
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "throughPointX") {
          // throughPointX1_2 is the 2nd component of the first throughPoint
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
          // throughPoint3 is all components of the third throughPoint
          if (!arraySize) {
            return [];
          }
          let throughPointInd = Number(varEnding) - 1;
          if (Number.isInteger(throughPointInd) && throughPointInd >= 0 && throughPointInd < arraySize[0]) {
            // array of "throughPointInd,i", where i=0, ..., arraySize[1]-1
            return Array.from(Array(arraySize[1]), (_, i) => throughPointInd + "," + i)
          } else {
            return [];
          }
        }

      },
      returnArraySizeDependencies: () => ({
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nThroughPoints, dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = (Number(pointInd) + 1) + "_" + (Number(dim) + 1)

          dependenciesByKey[arrayKey] = {
            through: {
              dependencyType: "attributeComponent",
              attributeName: "through",
              variableNames: ["pointX" + varEnding]
            }
          }
        }
        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        // console.log('array definition of curve throughPoints');
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
        // console.log(arrayKeys);

        let throughPoints = {};

        for (let arrayKey of arrayKeys) {

          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = (Number(pointInd) + 1) + "_" + (Number(dim) + 1)

          let through = dependencyValuesByKey[arrayKey].through;
          if (through !== null
            && through.stateValues["pointX" + varEnding]
          ) {
            throughPoints[arrayKey] = through.stateValues["pointX" + varEnding];
          } else {
            throughPoints[arrayKey] = me.fromAst(0);
          }
        }

        return { newValues: { throughPoints } }
      },
      async inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyValuesByKey, dependencyNamesByKey,
        initialChange, stateValues,
      }) {

        // console.log(`inverseArrayDefinition of throughPoints of curve`);
        // console.log(desiredStateVariableValues)
        // console.log(JSON.parse(JSON.stringify(stateValues)))
        // console.log(dependencyValuesByKey);


        // if not draggable, then disallow initial change 
        if (initialChange && !await stateValues.draggable) {
          return { success: false };
        }

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.throughPoints) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = (Number(pointInd) + 1) + "_" + (Number(dim) + 1)

          if (dependencyValuesByKey[arrayKey].through !== null
            && dependencyValuesByKey[arrayKey].through.stateValues["pointX" + varEnding]
          ) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].through,
              desiredValue: desiredStateVariableValues.throughPoints[arrayKey],
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


    stateVariableDefinitions.numericalThroughPoints = {
      isArray: true,
      entryPrefixes: ["numericalThroughPoint"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nThroughPoints];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            throughPoint: {
              dependencyType: "stateVariable",
              variableName: "throughPoint" + (Number(arrayKey) + 1)
            }
          }
        }

        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        let numericalThroughPoints = {};

        for (let arrayKey of arrayKeys) {
          let pt = dependencyValuesByKey[arrayKey].throughPoint.map(x => x.evaluate_to_constant())
          if (!pt.every(x => Number.isFinite(x))) {
            pt = Array(pt.length).fill(NaN)
          }
          numericalThroughPoints[arrayKey] = pt;
        }

        return { newValues: { numericalThroughPoints } }
      }
    }

    stateVariableDefinitions.haveBezierControls = {
      forRenderer: true,
      returnDependencies: () => ({
        controlChild: {
          dependencyType: "child",
          childGroups: ["bezierControls"],
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            haveBezierControls: dependencyValues.controlChild.length > 0
          }
        }
      }

    }

    stateVariableDefinitions.bezierControlsAlwaysVisible = {
      forRenderer: true,
      returnDependencies: () => ({
        controlChild: {
          dependencyType: "child",
          childGroups: ["bezierControls"],
          variableNames: ["alwaysVisible"]
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            bezierControlsAlwaysVisible: dependencyValues.controlChild.length > 0
              && dependencyValues.controlChild[0].stateValues.alwaysVisible
          }
        }
      }

    }


    stateVariableDefinitions.vectorControlDirections = {
      public: true,
      componentType: "text",
      isArray: true,
      entryPrefixes: ["vectorControlDirection"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nThroughPoints];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            controlChild: {
              dependencyType: "child",
              childGroups: ["bezierControls"],
              variableNames: ["direction" + (Number(arrayKey) + 1)],
            }
          }
        }

        let globalDependencies = {
          haveBezierControls: {
            dependencyType: "stateVariable",
            variableName: "haveBezierControls"
          }
        }

        return { dependenciesByKey, globalDependencies }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        let vectorControlDirections = {};

        for (let arrayKey of arrayKeys) {

          let controlChild = dependencyValuesByKey[arrayKey].controlChild;

          if (controlChild && controlChild.length > 0) {
            vectorControlDirections[arrayKey] = controlChild[0].stateValues["direction" + (Number(arrayKey) + 1)];
          } else {
            vectorControlDirections[arrayKey] = "none";
          }
        }

        return {
          newValues: { vectorControlDirections },
        }
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyNamesByKey, dependencyValuesByKey, globalDependencyValues
      }) {

        // if don't have bezier controls, cannot change directions,
        // they all stay at none so that have a spline
        if (!globalDependencyValues.haveBezierControls) {
          return { success: false }
        }

        let instructions = [];
        let newDirectionValues = {};
        for (let arrayKey in desiredStateVariableValues.vectorControlDirections) {
          let controlChild = dependencyValuesByKey[arrayKey].controlChild;

          if (controlChild && controlChild.length > 0) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].controlChild,
              desiredValue: desiredStateVariableValues.vectorControlDirections[arrayKey],
              childIndex: 0,
              variableIndex: 0
            })

          } else {
            newDirectionValues[arrayKey] = desiredStateVariableValues.vectorControlDirections[arrayKey]
          }

        }

        if (Object.keys(newDirectionValues).length > 0) {
          instructions.push({
            setStateVariable: "vectorControlDirections",
            value: newDirectionValues
          })
        }

        return {
          success: true,
          instructions
        }

      }
    }

    stateVariableDefinitions.hiddenControls = {
      public: true,
      componentType: "boolean",
      isArray: true,
      entryPrefixes: ["hiddenControl"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nThroughPoints];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            controlChild: {
              dependencyType: "child",
              childGroups: ["bezierControls"],
              variableNames: ["hiddenControl" + (Number(arrayKey) + 1)],
            }
          }
        }

        let globalDependencies = {
          haveBezierControls: {
            dependencyType: "stateVariable",
            variableName: "haveBezierControls"
          }
        }

        return { dependenciesByKey, globalDependencies }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        let hiddenControls = {};

        for (let arrayKey of arrayKeys) {

          let controlChild = dependencyValuesByKey[arrayKey].controlChild;

          if (controlChild && controlChild.length > 0) {
            hiddenControls[arrayKey] = controlChild[0].stateValues["hiddenControl" + (Number(arrayKey) + 1)];
          } else {
            hiddenControls[arrayKey] = false;
          }
        }

        return {
          newValues: { hiddenControls },
        }
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyNamesByKey, dependencyValuesByKey, globalDependencyValues
      }) {

        if (!globalDependencyValues.haveBezierControls) {
          return { success: false }
        }

        let instructions = [];
        let newHiddenControls = {};
        for (let arrayKey in desiredStateVariableValues.hiddenControls) {
          let controlChild = dependencyValuesByKey[arrayKey].controlChild;

          if (controlChild && controlChild.length > 0) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].controlChild,
              desiredValue: desiredStateVariableValues.hiddenControls[arrayKey],
              childIndex: 0,
              variableIndex: 0
            })

          } else {
            newHiddenControls[arrayKey] = desiredStateVariableValues.hiddenControls[arrayKey]
          }

        }

        if (Object.keys(newHiddenControls).length > 0) {
          instructions.push({
            setStateVariable: "hiddenControls",
            value: newHiddenControls
          })
        }

        return {
          success: true,
          instructions
        }

      }
    }

    stateVariableDefinitions.controlVectors = {
      isArray: true,
      public: true,
      componentType: "math",
      entryPrefixes: ["controlVectorX", "controlVector"],
      nDimensions: 3,
      stateVariablesDeterminingDependencies: ["vectorControlDirections", "nThroughPoints"],
      returnWrappingComponents(prefix) {
        if (prefix === "controlVectorX") {
          return [];
        } else {
          // controlVector or entire array
          // wrap inner dimension by both <vector> and <xs>
          // don't wrap outer dimension (for entire array)
          return [["vector", { componentType: "mathList", isAttribute: "xs" }]];
        }
      },
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "controlVectorX") {
          // controlVectorX3_2_1 is the first component of the second control vector
          // controlling the third point
          let indices = varEnding.split('_').map(x => Number(x) - 1)
          if (indices.length === 3 && indices.every(
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
          // controlVector3_2 is all components of the second control vector
          // controling the third point
          if (!arraySize) {
            return [];
          }
          let indices = varEnding.split('_').map(x => Number(x) - 1)
          if (indices.length === 2 && indices.every(
            (x, i) => Number.isInteger(x) && x >= 0 && x < arraySize[i]
          )) {
            return Array.from(Array(arraySize[2]), (_, i) => String(indices) + "," + i)
          } else {
            return [];
          }
        }

      },
      returnArraySizeDependencies: () => ({
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nThroughPoints, 2, dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {

        let globalDependencies = {
          haveBezierControls: {
            dependencyType: "stateVariable",
            variableName: "haveBezierControls"
          },
          nThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "nThroughPoints"
          },
          nDimensions: {
            dependencyType: "stateVariable",
            variableName: "nDimensions"
          },
          splineTension: {
            dependencyType: "stateVariable",
            variableName: "splineTension"
          },
          splineForm: {
            dependencyType: "stateVariable",
            variableName: "splineForm"
          },
        }

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let arrayIndices = arrayKey.split(",").map(x => Number(x));
          let varEndings = arrayIndices.map(x => x + 1);
          let jointVarEnding = varEndings.join('_');

          dependenciesByKey[arrayKey] = {
            direction: {
              dependencyType: "stateVariable",
              variableName: "vectorControlDirection" + varEndings[0]
            },
            controlChild: {
              dependencyType: "child",
              childGroups: ["bezierControls"],
              variableNames: ["control" + jointVarEnding]
            }
          }

          let pointInd = arrayIndices[0];
          let direction = stateValues.vectorControlDirections[pointInd];
          let indsToCheck = []
          if (direction === "none") {
            indsToCheck = [pointInd - 1, pointInd, pointInd + 1];
          } else if (direction === "previous") {
            indsToCheck = [pointInd, pointInd + 1];
          } else if (direction === "next") {
            indsToCheck = [pointInd - 1, pointInd];
          }

          for (let ind of indsToCheck) {
            if (ind >= 0 && ind < stateValues.nThroughPoints) {
              dependenciesByKey[arrayKey]["throughPoint" + (ind + 1)] = {
                dependencyType: "stateVariable",
                variableName: "throughPoint" + (ind + 1)
              }
            }
          }

        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {

        // console.log('definition of controlVectors for curve')
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));
        // console.log(JSON.parse(JSON.stringify(globalDependencyValues)));
        // console.log(JSON.parse(JSON.stringify(arrayKeys)))

        let newControlValues = {};

        for (let arrayKey of arrayKeys) {

          // we have calculated this only for 2D
          if (globalDependencyValues.nDimensions !== 2) {
            newControlValues[arrayKey] = me.fromAst(NaN);
            continue;
          }

          // since calculate two control vectors at once with symmetric
          // and both dimensions of each vector at once
          // it is possible that arrayKey was calculated earlier in the loop
          if (arrayKey in newControlValues) {
            continue;
          }

          let arrayIndices = arrayKey.split(",").map(x => Number(x));
          let varEndings = arrayIndices.map(x => x + 1);
          let jointVarEnding = varEndings.join('_');

          let pointInd = arrayIndices[0];
          let vectorInd = arrayIndices[1];

          let direction = dependencyValuesByKey[arrayKey].direction;
          // if (!direction) {
          //   direction = "none";
          // }


          if (direction === "none") {
            // if direction is none, then determine both first and second control vector
            // via spline (they will be symmetric)


            let point2 = dependencyValuesByKey[arrayKey]["throughPoint" + (pointInd + 1)]

            let point1, point3;
            if (pointInd > 0) {
              point1 = dependencyValuesByKey[arrayKey]["throughPoint" + pointInd]
            }
            if (pointInd < globalDependencyValues.nThroughPoints) {
              point3 = dependencyValuesByKey[arrayKey]["throughPoint" + (pointInd + 2)]
            }


            let { coordsNumeric, numericEntries } = calculateControlVectorFromSpline({
              tau: globalDependencyValues.splineTension,
              eps: numerics.eps,
              splineForm: globalDependencyValues.splineForm,
              point1,
              point2,
              point3,
            });

            for (let dim = 0; dim < 2; dim++) {
              let arrayKeyDim = pointInd + "," + vectorInd + "," + dim;
              let flippedArrayKeyDim = pointInd + "," + (1 - vectorInd) + "," + dim;

              if (vectorInd === 0) {
                // arrayKey corresponds to first vector
                newControlValues[arrayKeyDim] = coordsNumeric[dim];
                newControlValues[flippedArrayKeyDim] = me.fromAst(-coordsNumeric[dim].tree);
              } else {
                // arrayKey corresponds to second vector
                newControlValues[arrayKeyDim] = me.fromAst(-coordsNumeric[dim].tree);
                newControlValues[flippedArrayKeyDim] = coordsNumeric[dim];
              }
            }


          } else if ((arrayIndices[1] === 0 && direction === "next") ||
            (arrayIndices[1] === 0 && direction === "next")
          ) {
            // calculate control vector from spline

            // only two of these three will be defined
            let point1 = dependencyValuesByKey[arrayKey]["throughPoint" + pointInd]
            let point2 = dependencyValuesByKey[arrayKey]["throughPoint" + (pointInd + 1)]
            let point3 = dependencyValuesByKey[arrayKey]["throughPoint" + (pointInd + 2)]


            let { coordsNumeric, numericEntries } = calculateControlVectorFromSpline({
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
            newControlValues[arrayKey] = dependencyValuesByKey[arrayKey].controlChild[0]
              .stateValues["control" + jointVarEnding];
          }

        }

        return {
          newValues: {
            controlVectors: newControlValues
          },
          // useEssentialOrDefaultValue: {
          //   controlVectors: essentialControls,
          // },
          // makeEssential: ["controlVectors"],
        }
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyNamesByKey, dependencyValuesByKey, globalDependencyValues
      }) {

        // console.log('inverse definition of controlVectors for curve')
        // console.log(JSON.parse(JSON.stringify(desiredStateVariableValues)));
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));
        // console.log(JSON.parse(JSON.stringify(globalDependencyValues)));


        // if don't have bezier controls, cannot change control vectors,
        // they all stay at those calculated from spline
        // Also can't change if aren't in 2D
        if (!globalDependencyValues.haveBezierControls || globalDependencyValues.nDimensions !== 2) {
          return { success: false }
        }

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.controlVectors) {
          let arrayIndices = arrayKey.split(",").map(x => Number(x));
          let varEndings = arrayIndices.map(x => x + 1);
          let jointVarEnding = varEndings.join('_');

          // if find the control on the control child,
          // set its value to the desired value
          let controlChild = dependencyValuesByKey[arrayKey].controlChild;
          if (controlChild.length > 0) {
            let control = controlChild[0].stateValues["control" + jointVarEnding];
            if (control) {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].controlChild,
                desiredValue: desiredStateVariableValues.controlVectors[arrayKey],
                childIndex: 0,
                variableIndex: 0
              })
            }
          }
        }

        return {
          success: true,
          instructions
        }
      }

    }

    stateVariableDefinitions.numericalControlVectors = {
      isArray: true,
      entryPrefixes: ["numericalControlVector"],
      forRenderer: true,
      nDimensions: 2,
      returnArraySizeDependencies: () => ({
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nThroughPoints, 2];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let arrayIndices = arrayKey.split(",").map(x => Number(x));
          let varEndings = arrayIndices.map(x => x + 1);
          let jointVarEnding = varEndings.join('_');

          dependenciesByKey[arrayKey] = {
            controlVector: {
              dependencyType: "stateVariable",
              variableName: "controlVector" + jointVarEnding
            },
          }
        }

        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        // control vectors already have numerical entries,
        // so just need to take tree from math expressions

        let numericalControlVectors = {};

        for (let arrayKey of arrayKeys) {
          let vect = dependencyValuesByKey[arrayKey].controlVector.map(x => x.tree)
          numericalControlVectors[arrayKey] = vect;
        }

        return { newValues: { numericalControlVectors } }
      }
    }

    stateVariableDefinitions.controlPoints = {
      isArray: true,
      public: true,
      componentType: "math",
      entryPrefixes: ["controlPointX", "controlPoint"],
      nDimensions: 3,
      returnWrappingComponents(prefix) {
        if (prefix === "controlPointX") {
          return [];
        } else {
          // controlPoint or entire array
          // wrap inner dimension by both <point> and <xs>
          // don't wrap outer dimension (for entire array)
          return [["point", { componentType: "mathList", isAttribute: "xs" }]];
        }
      },
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "controlPointX") {
          // controlPointX3_2_1 is the first component of the second control point
          // controlling the third point
          let indices = varEnding.split('_').map(x => Number(x) - 1)
          if (indices.length === 3 && indices.every(
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
          // controlPoint3_2 is all components of the second control point
          // controling the third point
          if (!arraySize) {
            return [];
          }
          let indices = varEnding.split('_').map(x => Number(x) - 1)
          if (indices.length === 2 && indices.every(
            (x, i) => Number.isInteger(x) && x >= 0 && x < arraySize[i]
          )) {
            return Array.from(Array(arraySize[2]), (_, i) => String(indices) + "," + i)
          } else {
            return [];
          }
        }

      },
      returnArraySizeDependencies: () => ({
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nThroughPoints, 2, dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {

        let globalDependencies = {
          haveBezierControls: {
            dependencyType: "stateVariable",
            variableName: "haveBezierControls"
          },
          nDimensions: {
            dependencyType: "stateVariable",
            variableName: "nDimensions",
          },
        }

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let arrayIndices = arrayKey.split(",").map(x => Number(x));
          let varEndings = arrayIndices.map(x => x + 1);
          let jointVarEnding = varEndings.join('_');

          dependenciesByKey[arrayKey] = {
            throughPointX: {
              dependencyType: "stateVariable",
              variableName: "throughPointX" + varEndings[0] + "_" + varEndings[2]
            },
            controlVectorX: {
              dependencyType: "stateVariable",
              variableName: "controlVectorX" + jointVarEnding
            }
          }

        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {

        // console.log('definition of controlPoints for curve')
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));
        // console.log(JSON.parse(JSON.stringify(globalDependencyValues)));
        // console.log(JSON.parse(JSON.stringify(arrayKeys)))

        let newControlValues = {};

        for (let arrayKey of arrayKeys) {

          // we have calculated this only for 2D
          if (globalDependencyValues.nDimensions !== 2) {
            newControlValues[arrayKey] = me.fromAst(NaN);
          } else {
            let vectorX = dependencyValuesByKey[arrayKey].controlVectorX;

            if (vectorX) {
              let pointX = dependencyValuesByKey[arrayKey].throughPointX.evaluate_to_constant();
              if (!Number.isFinite(pointX)) {
                pointX = NaN
              }
              newControlValues[arrayKey] = me.fromAst(pointX + vectorX.tree)
            } else {
              newControlValues[arrayKey] = null;
            }

          }


        }
        return {
          newValues: {
            controlPoints: newControlValues
          },
        }
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyNamesByKey, dependencyValuesByKey, globalDependencyValues
      }) {


        // if don't have bezier controls, cannot change control vectors,
        // they all stay at those calculated from spline
        // Also can't change if aren't in 2D
        if (!globalDependencyValues.haveBezierControls || globalDependencyValues.nDimensions !== 2) {
          return { success: false }
        }

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.controlPoints) {

          // if find the control on the control child,
          // set its value to the desired value
          let vectorX = dependencyValuesByKey[arrayKey].controlVectorX;
          if (vectorX) {
            let pointX = dependencyValuesByKey[arrayKey].throughPointX;

            let desiredPoint = desiredStateVariableValues.controlPoints[arrayKey];
            if (desiredPoint.tree) {
              desiredPoint = desiredPoint.tree;
            }
            let desiredValue = me.fromAst(['+', desiredPoint, ['-', pointX.tree]]);

            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].controlVectorX,
              desiredValue,
            })
          }
        }

        return {
          success: true,
          instructions
        }
      }

    }

    stateVariableDefinitions.numericalControlPoints = {
      isArray: true,
      entryPrefixes: ["numericalControlPoint"],
      forRenderer: true,
      nDimensions: 2,
      returnArraySizeDependencies: () => ({
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nThroughPoints, 2];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let arrayIndices = arrayKey.split(",").map(x => Number(x));
          let varEndings = arrayIndices.map(x => x + 1);
          let jointVarEnding = varEndings.join('_');

          dependenciesByKey[arrayKey] = {
            controlPoint: {
              dependencyType: "stateVariable",
              variableName: "controlPoint" + jointVarEnding
            },
          }
        }

        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        // control points have numerical entries, to just take expression trees
        let numericalControlPoints = {};

        for (let arrayKey of arrayKeys) {
          let pt = dependencyValuesByKey[arrayKey].controlPoint.map(x => x.tree)
          numericalControlPoints[arrayKey] = pt;
        }

        return { newValues: { numericalControlPoints } }
      }
    }

    stateVariableDefinitions.splineCoeffs = {
      isArray: true,
      returnArraySizeDependencies: () => ({
        nThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "nThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nThroughPoints - 1];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let ind1 = Number(arrayKey) + 1;
          let ind2 = ind1 + 1;

          dependenciesByKey[arrayKey] = {
            previousPoint: {
              dependencyType: "stateVariable",
              variableName: "numericalThroughPoint" + ind1
            },
            nextPoint: {
              dependencyType: "stateVariable",
              variableName: "numericalThroughPoint" + ind2
            },
            previousVector: {
              dependencyType: "stateVariable",
              variableName: "numericalControlVector" + ind1 + "_2"
            },
            nextVector: {
              dependencyType: "stateVariable",
              variableName: "numericalControlVector" + ind2 + "_1"
            },
          }
        }

        return { dependenciesByKey }
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
            c.push(initCubicPoly(
              p1[dim],
              p2[dim],
              3 * cv1[dim],
              -3 * cv2[dim]
            ));
          }

          newSpineCoeffs[arrayKey] = c;

        }

        return {
          newValues: {
            splineCoeffs: newSpineCoeffs,
          }
        }

      },
    }

    stateVariableDefinitions.extrapolateBackwardCoeffs = {
      stateVariablesDeterminingDependencies: ["extrapolateBackward"],
      additionalStateVariablesDefined: [{
        variableName: "extrapolateBackwardMode",
        public: true,
        componentType: "text"
      }],
      returnDependencies({ stateValues }) {

        let dependencies = {
          extrapolateBackward: {
            dependencyType: "stateVariable",
            variableName: "extrapolateBackward"
          },
          nThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "nThroughPoints"
          }
        };

        if (stateValues.extrapolateBackward) {
          dependencies.firstSplineCoeffs = {
            dependencyType: "stateVariable",
            variableName: "splineCoeffs1"
          };
          dependencies.graphXmin = {
            dependencyType: "stateVariable",
            variableName: "graphXmin"
          };
          dependencies.graphXmax = {
            dependencyType: "stateVariable",
            variableName: "graphXmax"
          };
          dependencies.graphYmin = {
            dependencyType: "stateVariable",
            variableName: "graphYmin"
          };
          dependencies.graphYmax = {
            dependencyType: "stateVariable",
            variableName: "graphYmax"
          };
        }

        return dependencies;
      },
      definition({ dependencyValues }) {
        if (!dependencyValues.extrapolateBackward || !dependencyValues.firstSplineCoeffs) {
          return {
            newValues: {
              extrapolateBackwardCoeffs: null,
              extrapolateBackwardMode: ""
            }
          }
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

        if (Math.abs(fac) < 1E-12 || Math.abs(xp0) < 1E-12 || Math.abs(yp0) < 1E-12) {
          // curvature is zero or pointed at right angle
          // extrapolate as straight line

          let xpEffective = xp0;
          let ypEffective = yp0;

          if (dependencyValues.graphXmin !== null
            && dependencyValues.graphXmax !== null
            && dependencyValues.graphYmin !== null
            && dependencyValues.graphYmax !== null
          ) {

            // if in graph, scale speed if needed to make sure leave graph

            let xscale = dependencyValues.graphXmax - dependencyValues.graphXmin;
            let yscale = dependencyValues.graphYmax - dependencyValues.graphYmin;
            let tMax = dependencyValues.nThroughPoints - 1;

            let scaleSpeedToReachXEdge = xscale / tMax / Math.abs(xpEffective);
            let scaleSpeedToReachYEdge = yscale / tMax / Math.abs(ypEffective);

            let minScale = Math.min(scaleSpeedToReachXEdge, scaleSpeedToReachYEdge);

            if (minScale > 1) {
              xpEffective *= minScale;
              ypEffective *= minScale
            }

          }

          let c = [
            [x0, xpEffective, 0],
            [y0, ypEffective, 0]
          ];

          return {
            newValues: {
              extrapolateBackwardCoeffs: c,
              extrapolateBackwardMode: "line"
            }
          }

        }

        let dTx = yp0 * fac;
        let dTy = -xp0 * fac;

        if (dTx * xp0 > 0) {
          // if curving toward the vertical direction
          // orient the parabola vertically

          let r = dTx / dTy;
          let rFactor = (1 + r * r) ** 2;

          let xpEffective = xp0;

          if (dependencyValues.graphXmin !== null
            && dependencyValues.graphXmax !== null
            && dependencyValues.graphYmin !== null
            && dependencyValues.graphYmax !== null
          ) {
            // if we are in graph, make sure that the speed of the parametrization
            // is fast enough for the curve to leave the graph while
            // the parameter increases by the amount nThroughPoints - 1

            let xscale = dependencyValues.graphXmax - dependencyValues.graphXmin;
            let yscale = dependencyValues.graphYmax - dependencyValues.graphYmin;

            let tMax = dependencyValues.nThroughPoints - 1;

            let minSpeedToReachXEdge = xscale / tMax;


            // y = a*v^2*t^2 + b*v*t
            // where a = dTy*rFactor/2 and b = -r.
            // Find minimum v where reach edge by tMax

            let minSpeedToReachYEdge = Infinity;

            if (dTy !== 0) {
              let alpha = dTy * rFactor / 2 * tMax * tMax;
              let beta = -r * tMax;
              // y = alpha*v^2 + beta*v
              // if alpha > 0, solve for y = yscale
              // else if alpha < 0 solve for y = -yscale
              let sr = Math.sqrt(beta * beta + 4 * Math.abs(alpha) * yscale);
              minSpeedToReachYEdge = (Math.abs(beta) + sr) / (2 * Math.abs(alpha));
            }

            let minSpeed = Math.min(minSpeedToReachXEdge, minSpeedToReachYEdge);

            if (minSpeed > Math.abs(xpEffective)) {
              xpEffective *= minSpeed / Math.abs(xpEffective)
            }

          }

          let v = -xpEffective * r;
          let a = dTy * xpEffective * xpEffective * rFactor;

          let c = [
            [x0, xpEffective, 0],
            [y0, v, a / 2]
          ];

          return {
            newValues: {
              extrapolateBackwardCoeffs: c,
              extrapolateBackwardMode: "parabolaVertical"
            }
          }
        } else {
          // if curving toward the horizontal direction
          // orient the parabola horizontally

          let r = dTy / dTx;
          let rFactor = (1 + r * r) ** 2;


          let ypEffective = yp0;

          if (dependencyValues.graphXmin !== null
            && dependencyValues.graphXmax !== null
            && dependencyValues.graphYmin !== null
            && dependencyValues.graphYmax !== null
          ) {
            // if we are in graph, make sure that the speed of the parametrization
            // is fast enough for the curve to leave the graph while
            // the parameter increases by the amount nThroughPoints - 1

            let xscale = dependencyValues.graphXmax - dependencyValues.graphXmin;
            let yscale = dependencyValues.graphYmax - dependencyValues.graphYmin;

            let tMax = dependencyValues.nThroughPoints - 1;

            let minSpeedToReachYEdge = yscale / tMax;


            // y = a*v^2*t^2 + b*v*t
            // where a = dTy*rFactor/2 and b = -r.
            // Find minimum v where reach edge by tMax

            let minSpeedToReachXEdge = Infinity;

            if (dTx !== 0) {
              let alpha = dTx * rFactor / 2 * tMax * tMax;
              let beta = -r * tMax;
              // c = alpha*v^2 + beta*v
              // if alpha > 0, solve for x = xscale
              // else if alpha < 0 solve for x = -xscale
              let sr = Math.sqrt(beta * beta + 4 * Math.abs(alpha) * xscale);
              minSpeedToReachXEdge = (Math.abs(beta) + sr) / (2 * Math.abs(alpha));
            }

            let minSpeed = Math.min(minSpeedToReachXEdge, minSpeedToReachYEdge);

            if (minSpeed > Math.abs(ypEffective)) {
              ypEffective *= minSpeed / Math.abs(ypEffective)
            }

          }

          let v = -ypEffective * r;
          let a = dTx * ypEffective * ypEffective * rFactor;

          let c = [
            [x0, v, a / 2],
            [y0, ypEffective, 0]
          ];

          return {
            newValues: {
              extrapolateBackwardCoeffs: c,
              extrapolateBackwardMode: "parabolaHorizontal"
            }
          }
        }

      }
    }


    stateVariableDefinitions.extrapolateForwardCoeffs = {
      stateVariablesDeterminingDependencies: ["nThroughPoints", "extrapolateForward"],
      additionalStateVariablesDefined: [{
        variableName: "extrapolateForwardMode",
        public: true,
        componentType: "text"
      }],
      returnDependencies({ stateValues }) {

        let dependencies = {
          extrapolateForward: {
            dependencyType: "stateVariable",
            variableName: "extrapolateForward"
          },
          nThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "nThroughPoints"
          }
        }

        if (stateValues.extrapolateForward && stateValues.nThroughPoints >= 2) {
          dependencies.lastSplineCoeffs = {
            dependencyType: "stateVariable",
            variableName: "splineCoeffs" + (stateValues.nThroughPoints - 1)
          };
          dependencies.graphXmin = {
            dependencyType: "stateVariable",
            variableName: "graphXmin"
          };
          dependencies.graphXmax = {
            dependencyType: "stateVariable",
            variableName: "graphXmax"
          };
          dependencies.graphYmin = {
            dependencyType: "stateVariable",
            variableName: "graphYmin"
          };
          dependencies.graphYmax = {
            dependencyType: "stateVariable",
            variableName: "graphYmax"
          };
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        if (!dependencyValues.extrapolateForward || !dependencyValues.lastSplineCoeffs) {
          return {
            newValues: {
              extrapolateForwardCoeffs: null,
              extrapolateForwardMode: ""
            }
          }
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

        if (Math.abs(fac) < 1E-12 || Math.abs(xp0) < 1E-12 || Math.abs(yp0) < 1E-12) {
          // curvature is zero or pointed at right angle
          // extrapolate as straight line

          let xpEffective = xp0;
          let ypEffective = yp0;

          if (dependencyValues.graphXmin !== null
            && dependencyValues.graphXmax !== null
            && dependencyValues.graphYmin !== null
            && dependencyValues.graphYmax !== null
          ) {

            // if in graph, scale speed if needed to make sure leave graph

            let xscale = dependencyValues.graphXmax - dependencyValues.graphXmin;
            let yscale = dependencyValues.graphYmax - dependencyValues.graphYmin;
            let tMax = dependencyValues.nThroughPoints - 1;

            let scaleSpeedToReachXEdge = xscale / tMax / Math.abs(xpEffective);
            let scaleSpeedToReachYEdge = yscale / tMax / Math.abs(ypEffective);

            let minScale = Math.min(scaleSpeedToReachXEdge, scaleSpeedToReachYEdge);

            if (minScale > 1) {
              xpEffective *= minScale;
              ypEffective *= minScale
            }

          }

          let c = [
            [x0, xpEffective, 0],
            [y0, ypEffective, 0]
          ];

          return {
            newValues: {
              extrapolateForwardCoeffs: c,
              extrapolateForwardMode: "line"
            }
          }

        }

        let dTx = yp0 * fac;
        let dTy = -xp0 * fac;

        if (dTx * xp0 < 0) {
          // if curving toward the vertical direction
          // orient the parabola vertically

          let r = dTx / dTy;
          let rFactor = (1 + r * r) ** 2;

          let xpEffective = xp0;

          if (dependencyValues.graphXmin !== null
            && dependencyValues.graphXmax !== null
            && dependencyValues.graphYmin !== null
            && dependencyValues.graphYmax !== null
          ) {
            // if we are in graph, make sure that the speed of the parametrization
            // is fast enough for the curve to leave the graph while
            // the parameter increases by the amount nThroughPoints - 1

            let xscale = dependencyValues.graphXmax - dependencyValues.graphXmin;
            let yscale = dependencyValues.graphYmax - dependencyValues.graphYmin;

            let tMax = dependencyValues.nThroughPoints - 1;

            let minSpeedToReachXEdge = xscale / tMax;


            // y = a*v^2*t^2 + b*v*t
            // where a = dTy*rFactor/2 and b = -r.
            // Find minimum v where reach edge by tMax

            let minSpeedToReachYEdge = Infinity;

            if (dTy !== 0) {
              let alpha = dTy * rFactor / 2 * tMax * tMax;
              let beta = -r * tMax;
              // y = alpha*v^2 + beta*v
              // if alpha > 0, solve for y = yscale
              // else if alpha < 0 solve for y = -yscale
              let sr = Math.sqrt(beta * beta + 4 * Math.abs(alpha) * yscale);
              minSpeedToReachYEdge = (Math.abs(beta) + sr) / (2 * Math.abs(alpha));
            }

            let minSpeed = Math.min(minSpeedToReachXEdge, minSpeedToReachYEdge);

            if (minSpeed > Math.abs(xpEffective)) {
              xpEffective *= minSpeed / Math.abs(xpEffective)
            }

          }

          let v = -xpEffective * r;
          let a = dTy * xpEffective * xpEffective * rFactor;

          let c = [
            [x0, xpEffective, 0],
            [y0, v, a / 2]
          ];

          return {
            newValues: {
              extrapolateForwardCoeffs: c,
              extrapolateForwardMode: "parabolaVertical"
            }
          }
        } else {
          // if curving toward the horizontal direction
          // orient the parabola horizontally

          let r = dTy / dTx;
          let rFactor = (1 + r * r) ** 2;

          let ypEffective = yp0;

          if (dependencyValues.graphXmin !== null
            && dependencyValues.graphXmax !== null
            && dependencyValues.graphYmin !== null
            && dependencyValues.graphYmax !== null
          ) {
            // if we are in graph, make sure that the speed of the parametrization
            // is fast enough for the curve to leave the graph while
            // the parameter increases by the amount nThroughPoints - 1

            let xscale = dependencyValues.graphXmax - dependencyValues.graphXmin;
            let yscale = dependencyValues.graphYmax - dependencyValues.graphYmin;

            let tMax = dependencyValues.nThroughPoints - 1;

            let minSpeedToReachYEdge = yscale / tMax;


            // y = a*v^2*t^2 + b*v*t
            // where a = dTy*rFactor/2 and b = -r.
            // Find minimum v where reach edge by tMax

            let minSpeedToReachXEdge = Infinity;

            if (dTx !== 0) {
              let alpha = dTx * rFactor / 2 * tMax * tMax;
              let beta = -r * tMax;
              // c = alpha*v^2 + beta*v
              // if alpha > 0, solve for x = xscale
              // else if alpha < 0 solve for x = -xscale
              let sr = Math.sqrt(beta * beta + 4 * Math.abs(alpha) * xscale);
              minSpeedToReachXEdge = (Math.abs(beta) + sr) / (2 * Math.abs(alpha));
            }

            let minSpeed = Math.min(minSpeedToReachXEdge, minSpeedToReachYEdge);

            if (minSpeed > Math.abs(ypEffective)) {
              ypEffective *= minSpeed / Math.abs(ypEffective)
            }

          }

          let v = -ypEffective * r;
          let a = dTx * ypEffective * ypEffective * rFactor;

          let c = [
            [x0, v, a / 2],
            [y0, ypEffective, 0]
          ];

          return {
            newValues: {
              extrapolateForwardCoeffs: c,
              extrapolateForwardMode: "parabolaHorizontal"
            }
          }
        }
      }
    }

    stateVariableDefinitions.fs = {
      forRenderer: true,
      isArray: true,
      entryPrefixes: ["f"],
      defaultEntryValue: () => 0,
      returnArraySizeDependencies: () => ({
        functionChildren: {
          dependencyType: "child",
          childGroups: ["functions"],
        },
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType"
        },
      }),
      returnArraySize({ dependencyValues }) {
        if (dependencyValues.curveType === "bezier") {
          return [2]
        } else {
          return [Math.max(1, dependencyValues.functionChildren.length)];
        }
      },
      returnArrayDependenciesByKey({ arrayKeys }) {

        let globalDependencies = {
          curveType: {
            dependencyType: "stateVariable",
            variableName: "curveType"
          },
          numericalThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "numericalThroughPoints"
          },
          splineCoeffs: {
            dependencyType: "stateVariable",
            variableName: "splineCoeffs"
          },
          nThroughPoints: {
            dependencyType: "stateVariable",
            variableName: "nThroughPoints"
          },
          extrapolateBackward: {
            dependencyType: "stateVariable",
            variableName: "extrapolateBackward"
          },
          extrapolateBackwardCoeffs: {
            dependencyType: "stateVariable",
            variableName: "extrapolateBackwardCoeffs"
          },
          extrapolateForward: {
            dependencyType: "stateVariable",
            variableName: "extrapolateForward"
          },
          extrapolateForwardCoeffs: {
            dependencyType: "stateVariable",
            variableName: "extrapolateForwardCoeffs"
          },
        }

        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            functionChild: {
              dependencyType: "child",
              childGroups: ["functions"],
              variableNames: ["numericalf"],
              childIndices: [arrayKey]
            }
          };
          if (Number(arrayKey) === 0) {
            dependenciesByKey[arrayKey].fShadow = {
              dependencyType: "stateVariable",
              variableName: "fShadow"
            }
          }
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {

        if (globalDependencyValues.curveType === "bezier") {
          return {
            newValues: { fs: returnBezierFunctions({ globalDependencyValues, arrayKeys }) }
          }
        }

        let fs = {};
        let essentialFs = {};
        for (let arrayKey of arrayKeys) {
          let functionChild = dependencyValuesByKey[arrayKey].functionChild;
          if (functionChild.length === 1) {
            fs[arrayKey] = functionChild[0].stateValues.numericalf;
          } else {
            if (Number(arrayKey) === 0 && dependencyValuesByKey[arrayKey].fShadow) {
              fs[arrayKey] = dependencyValuesByKey[arrayKey].fShadow;
            } else {
              essentialFs[arrayKey] = {
                variablesToCheck: [
                  { variableName: "fs", arrayIndex: arrayKey }
                ],
              }
            }
          }
        }
        return {
          newValues: { fs },
          useEssentialOrDefaultValue: {
            fs: essentialFs,
          },
        }

      }
    }

    stateVariableDefinitions.f = {
      isAlias: true,
      targetVariableName: "f1"
    };



    stateVariableDefinitions.allXCriticalPoints = {
      returnDependencies: () => ({
        splineCoeffs: {
          dependencyType: "stateVariable",
          variableName: "splineCoeffs"
        },
        fs: {
          dependencyType: "stateVariable",
          variableName: "fs"
        },
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType"
        }
      }),
      definition({ dependencyValues }) {
        let allXCriticalPoints = [];

        if (dependencyValues.curveType !== "bezier") {
          return { newValues: { allXCriticalPoints } }
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

          if (Math.abs(A) < 1E-14) {
            let t = -C / B;

            xCriticalPointAtPreviousRight = addTimePointBezier({
              t, ind, ts, ignoreLeft: xCriticalPointAtPreviousRight
            });

          } else {

            let discrim = B * B - 4 * A * C;

            if (discrim == 0) {
              let t = -B / (2 * A);
              xCriticalPointAtPreviousRight = addTimePointBezier({
                t, ind, ts, ignoreLeft: xCriticalPointAtPreviousRight
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
                  t, ind, ts, ignoreLeft: xCriticalPointAtPreviousRight
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
          allXCriticalPoints.push([fx(t), fy(t)])
        }

        return { newValues: { allXCriticalPoints } }
      }
    }

    stateVariableDefinitions.nXCriticalPoints = {
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        allXCriticalPoints: {
          dependencyType: "stateVariable",
          variableName: "allXCriticalPoints"
        },
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            nXCriticalPoints: dependencyValues.allXCriticalPoints.length
          }
        }
      }
    }

    stateVariableDefinitions.xCriticalPoints = {
      public: true,
      componentType: "number",
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["xCriticalPointX", "xCriticalPoint"],
      returnWrappingComponents(prefix) {
        if (prefix === "xCriticalPointX") {
          return [];
        } else {
          // point or entire array
          // wrap inner dimension by both <point> and <xs>
          // don't wrap outer dimension (for entire array)
          return [["point", { componentType: "mathList", isAttribute: "xs" }]];
        }
      },
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "xCriticalPointX") {
          // xCriticalPointX1_2 is the 2nd component of the first point
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
          // xCriticalPoint3 is all components of the third xCriticalPoint
          if (!arraySize) {
            return [];
          }
          let pointInd = Number(varEnding) - 1;
          if (Number.isInteger(pointInd) && pointInd >= 0 && pointInd < arraySize[0]) {
            // array of "pointInd,i", where i=0, ..., arraySize[1]-1
            return Array.from(Array(arraySize[1]), (_, i) => pointInd + "," + i)
          } else {
            return [];
          }
        }

      },
      returnArraySizeDependencies: () => ({
        nXCriticalPoints: {
          dependencyType: "stateVariable",
          variableName: "nXCriticalPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nXCriticalPoints, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allXCriticalPoints: {
            dependencyType: "stateVariable",
            variableName: "allXCriticalPoints"
          }
        }

        return { globalDependencies }

      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function xCriticalPoints`)
        // console.log(globalDependencyValues)

        let xCriticalPoints = {};

        for (let ptInd = 0; ptInd < globalDependencyValues.__array_size[0]; ptInd++) {
          for (let i = 0; i < 2; i++) {
            let arrayKey = `${ptInd},${i}`;

            xCriticalPoints[arrayKey] = globalDependencyValues.allXCriticalPoints[ptInd][i];
          }
        }

        return { newValues: { xCriticalPoints } }
      }
    }

    stateVariableDefinitions.allYCriticalPoints = {
      returnDependencies: () => ({
        splineCoeffs: {
          dependencyType: "stateVariable",
          variableName: "splineCoeffs"
        },
        fs: {
          dependencyType: "stateVariable",
          variableName: "fs"
        },
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType"
        }
      }),
      definition({ dependencyValues }) {
        let allYCriticalPoints = [];

        if (dependencyValues.curveType !== "bezier") {
          return { newValues: { allYCriticalPoints } }
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

          if (Math.abs(A) < 1E-14) {
            let t = -C / B;

            yCriticalPointAtPreviousRight = addTimePointBezier({
              t, ind, ts, ignoreLeft: yCriticalPointAtPreviousRight
            });

          } else {

            let discrim = B * B - 4 * A * C;

            if (discrim == 0) {
              let t = -B / (2 * A);

              yCriticalPointAtPreviousRight = addTimePointBezier({
                t, ind, ts, ignoreLeft: yCriticalPointAtPreviousRight
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
                  t, ind, ts, ignoreLeft: yCriticalPointAtPreviousRight
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
          allYCriticalPoints.push([fx(t), fy(t)])
        }

        return { newValues: { allYCriticalPoints } }
      }
    }

    stateVariableDefinitions.nYCriticalPoints = {
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        allYCriticalPoints: {
          dependencyType: "stateVariable",
          variableName: "allYCriticalPoints"
        },
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            nYCriticalPoints: dependencyValues.allYCriticalPoints.length
          }
        }
      }
    }

    stateVariableDefinitions.yCriticalPoints = {
      public: true,
      componentType: "number",
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["yCriticalPointX", "yCriticalPoint"],
      returnWrappingComponents(prefix) {
        if (prefix === "yCriticalPointX") {
          return [];
        } else {
          // point or entire array
          // wrap inner dimension by both <point> and <xs>
          // don't wrap outer dimension (for entire array)
          return [["point", { componentType: "mathList", isAttribute: "xs" }]];
        }
      },
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "yCriticalPointX") {
          // yCriticalPointX1_2 is the 2nd component of the first point
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
          // yCriticalPoint3 is all components of the third yCriticalPoint
          if (!arraySize) {
            return [];
          }
          let pointInd = Number(varEnding) - 1;
          if (Number.isInteger(pointInd) && pointInd >= 0 && pointInd < arraySize[0]) {
            // array of "pointInd,i", where i=0, ..., arraySize[1]-1
            return Array.from(Array(arraySize[1]), (_, i) => pointInd + "," + i)
          } else {
            return [];
          }
        }

      },
      returnArraySizeDependencies: () => ({
        nYCriticalPoints: {
          dependencyType: "stateVariable",
          variableName: "nYCriticalPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nYCriticalPoints, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allYCriticalPoints: {
            dependencyType: "stateVariable",
            variableName: "allYCriticalPoints"
          }
        }

        return { globalDependencies }

      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function yCriticalPoints`)
        // console.log(globalDependencyValues)

        let yCriticalPoints = {};

        for (let ptInd = 0; ptInd < globalDependencyValues.__array_size[0]; ptInd++) {
          for (let i = 0; i < 2; i++) {
            let arrayKey = `${ptInd},${i}`;

            yCriticalPoints[arrayKey] = globalDependencyValues.allYCriticalPoints[ptInd][i];
          }
        }

        return { newValues: { yCriticalPoints } }
      }
    }



    stateVariableDefinitions.allCurvatureChangePoints = {
      returnDependencies: () => ({
        splineCoeffs: {
          dependencyType: "stateVariable",
          variableName: "splineCoeffs"
        },
        fs: {
          dependencyType: "stateVariable",
          variableName: "fs"
        },
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType"
        }
      }),
      definition({ dependencyValues }) {
        let allCurvatureChangePoints = [];

        if (dependencyValues.curveType !== "bezier") {
          return { newValues: { allCurvatureChangePoints } }
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

          if (Math.abs(A) < 1E-14) {
            let t = -C / B;

            changePointAtPreviousRight = addTimePointBezier({
              t, ind, ts, ignoreLeft: changePointAtPreviousRight
            });

          } else {

            let discrim = B * B - 4 * A * C;

            if (discrim == 0) {
              let t = -B / (2 * A);

              changePointAtPreviousRight = addTimePointBezier({
                t, ind, ts, ignoreLeft: changePointAtPreviousRight
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
                  t, ind, ts, ignoreLeft: changePointAtPreviousRight
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
          allCurvatureChangePoints.push([fx(t), fy(t)])
        }

        return { newValues: { allCurvatureChangePoints } }
      }
    }

    stateVariableDefinitions.nCurvatureChangePoints = {
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        allCurvatureChangePoints: {
          dependencyType: "stateVariable",
          variableName: "allCurvatureChangePoints"
        },
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            nCurvatureChangePoints: dependencyValues.allCurvatureChangePoints.length
          }
        }
      }
    }

    stateVariableDefinitions.curvatureChangePoints = {
      public: true,
      componentType: "number",
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["curvatureChangePointX", "curvatureChangePoint"],
      returnWrappingComponents(prefix) {
        if (prefix === "curvatureChangePointX") {
          return [];
        } else {
          // point or entire array
          // wrap inner dimension by both <point> and <xs>
          // don't wrap outer dimension (for entire array)
          return [["point", { componentType: "mathList", isAttribute: "xs" }]];
        }
      },
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "curvatureChangePointX") {
          // curvatureChangePointX1_2 is the 2nd component of the first point
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
          // curvatureChangePoint3 is all components of the third curvatureChangePoint
          if (!arraySize) {
            return [];
          }
          let pointInd = Number(varEnding) - 1;
          if (Number.isInteger(pointInd) && pointInd >= 0 && pointInd < arraySize[0]) {
            // array of "pointInd,i", where i=0, ..., arraySize[1]-1
            return Array.from(Array(arraySize[1]), (_, i) => pointInd + "," + i)
          } else {
            return [];
          }
        }

      },
      returnArraySizeDependencies: () => ({
        nCurvatureChangePoints: {
          dependencyType: "stateVariable",
          variableName: "nCurvatureChangePoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nCurvatureChangePoints, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allCurvatureChangePoints: {
            dependencyType: "stateVariable",
            variableName: "allCurvatureChangePoints"
          }
        }

        return { globalDependencies }

      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function curvatureChangePoints`)
        // console.log(globalDependencyValues)

        let curvatureChangePoints = {};

        for (let ptInd = 0; ptInd < globalDependencyValues.__array_size[0]; ptInd++) {
          for (let i = 0; i < 2; i++) {
            let arrayKey = `${ptInd},${i}`;

            curvatureChangePoints[arrayKey] = globalDependencyValues.allCurvatureChangePoints[ptInd][i];
          }
        }

        return { newValues: { curvatureChangePoints } }
      }
    }


    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        curveType: {
          dependencyType: "stateVariable",
          variableName: "curveType"
        },
        fs: {
          dependencyType: "stateVariable",
          variableName: "fs"
        },
        flipFunction: {
          dependencyType: "stateVariable",
          variableName: "flipFunction"
        },
        nDiscretizationPoints: {
          dependencyType: "stateVariable",
          variableName: "nDiscretizationPoints"
        },
        parMin: {
          dependencyType: "stateVariable",
          variableName: "parMin"
        },
        parMax: {
          dependencyType: "stateVariable",
          variableName: "parMax"
        },
        periodic: {
          dependencyType: "stateVariable",
          variableName: "periodic"
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
        nearestPointAsCurve: {
          dependencyType: "stateVariable",
          variableName: "nearestPointAsCurve"
        },
      }),
      definition({ dependencyValues }) {
        let nearestPointFunction = null;

        if (dependencyValues.curveType === "function") {
          nearestPointFunction = getNearestPointFunctionCurve({ dependencyValues, numerics });
        } else if (["parameterization", "bezier"].includes(dependencyValues.curveType)) {
          nearestPointFunction = getNearestPointParametrizedCurve({ dependencyValues, numerics });
        }

        return {
          newValues: { nearestPoint: nearestPointFunction }
        }

      }
    }


    return stateVariableDefinitions;
  }



  async moveControlVector({ controlVector, controlVectorInds, transient }) {

    let desiredVector = {
      [controlVectorInds + ",0"]: me.fromAst(controlVector[0]),
      [controlVectorInds + ",1"]: me.fromAst(controlVector[1]),
    }

    if (transient) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "controlVectors",
          value: desiredVector,
          sourceInformation: { controlVectorMoved: controlVectorInds }
        }],
        transient
      });
    } else {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "controlVectors",
          value: desiredVector,
          sourceInformation: { controlVectorMoved: controlVectorInds }
        }],
        event: {
          verb: "interacted",
          object: {
            componentId: this.componentName,
          },
          result: {
            ["controlVector" + controlVectorInds.join('_')]: controlVector,
          }
        }
      });
    }

  }

  async moveThroughPoint({ throughPoint, throughPointInd, transient }) {

    let desiredPoint = {
      [throughPointInd + ",0"]: me.fromAst(throughPoint[0]),
      [throughPointInd + ",1"]: me.fromAst(throughPoint[1]),
    }

    if (transient) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "throughPoints",
          value: desiredPoint,
          sourceInformation: { throughPointMoved: throughPointInd }
        }],
        transient
      });
    } else {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "throughPoints",
          value: desiredPoint,
          sourceInformation: { throughPointMoved: throughPointInd }
        }],
        event: {
          verb: "interacted",
          object: {
            componentId: this.componentName,
          },
          result: {
            ["throughPoint" + throughPointInd]: throughPoint,
          }
        }
      });
    }

  }

  async changeVectorControlDirection({ direction, throughPointInd }) {
    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "vectorControlDirection",
        value: { [throughPointInd]: direction },
      }]
    });
  }

  switchCurve() {

  }


}

function getNearestPointFunctionCurve({ dependencyValues, numerics }) {
  let flipFunction = dependencyValues.flipFunction;
  let f = dependencyValues.fs[0];
  let nDiscretizationPoints = dependencyValues.nDiscretizationPoints;
  let parMax = dependencyValues.parMax;
  let parMin = dependencyValues.parMin;
  let xscale = 1, yscale = 1;
  if (dependencyValues.graphXmin !== null &&
    dependencyValues.graphXmax !== null &&
    dependencyValues.graphYmin !== null &&
    dependencyValues.graphYmax !== null
  ) {
    xscale = dependencyValues.graphXmax - dependencyValues.graphXmin;
    yscale = dependencyValues.graphYmax - dependencyValues.graphYmin;
  }


  return function (variables) {

    let x1 = variables.x1.evaluate_to_constant();
    let x2 = variables.x2.evaluate_to_constant();

    // compute values at the actual endpoints, if they exist

    let x1AtLeftEndpoint, x2AtLeftEndpoint;
    if (parMin !== -Infinity) {

      if (flipFunction) {
        x1AtLeftEndpoint = f(parMin);
        x2AtLeftEndpoint = parMin;
      } else {
        x1AtLeftEndpoint = parMin;
        x2AtLeftEndpoint = f(parMin);
      }

    }

    let x1AtRightEndpoint, x2AtRightEndpoint;
    if (parMax !== Infinity) {

      if (flipFunction) {
        x1AtRightEndpoint = f(parMax);
        x2AtRightEndpoint = parMax;
      } else {
        x1AtRightEndpoint = parMax;
        x2AtRightEndpoint = f(parMax);
      }
    }

    if (!dependencyValues.nearestPointAsCurve || !(Number.isFinite(x1) && Number.isFinite(x2))) {

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
          x2: x2AsFunction
        }
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

    let minfunc = function (t) {
      let x = -10 * Math.log(1 / t - 1);

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
    }

    let minT = 0;
    let maxT = 1;
    if (parMin !== -Infinity) {
      minT = 1 / (Math.exp(-parMin / 10) + 1);
    }
    if (parMax !== -Infinity) {
      maxT = 1 / (Math.exp(-parMax / 10) + 1);
    }

    let Nsteps = nDiscretizationPoints;
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

    let fprev;

    for (let step = 1; step <= Nsteps; step++) {
      let tnew = minT + step * delta;
      let fnew = minfunc(tnew);
      if (Number.isFinite(fnew) && Number.isFinite(fprev) &&
        (fnew < fAtMin || Number.isNaN(fAtMin))
      ) {
        tAtMin = tnew;
        fAtMin = fnew;
        tIntervalMin = tnew - delta;
        if (step === Nsteps) {
          tIntervalMax = tnew;
        } else {
          tIntervalMax = tnew + delta;
        }
      }

      fprev = fnew;

    }

    // haven't necessarily checked f at tIntervalMax
    let fAtIntervalMax = minfunc(tIntervalMax);
    if (!Number.isFinite(fAtIntervalMax)) {
      tIntervalMax -= delta;
    }


    let result = numerics.fminbr(minfunc, [tIntervalMin, tIntervalMax]);
    tAtMin = result.x;

    let x1AtMin = -10 * Math.log(1 / tAtMin - 1);
    let x2AtMin = f(x1AtMin)

    let currentD2;

    if (!(result.success && Number.isFinite(x1AtMin) && Number.isFinite(x2AtMin))) {
      currentD2 = Infinity
    } else {

      if (flipFunction) {
        [x1AtMin, x2AtMin] = [x2AtMin, x1AtMin]
      }

      currentD2 = Math.pow((x1AtMin - x1) / xscale, 2)
        + Math.pow((x2AtMin - x2) / yscale, 2);
    }

    // replace with endpoints if closer

    if (parMin !== -Infinity) {
      let leftEndpointD2 = Math.pow((x1AtLeftEndpoint - x1) / xscale, 2)
        + Math.pow((x2AtLeftEndpoint - x2) / yscale, 2);
      if (leftEndpointD2 < currentD2) {
        x1AtMin = x1AtLeftEndpoint;
        x2AtMin = x2AtLeftEndpoint;
        currentD2 = leftEndpointD2;
      }
    }

    if (parMax !== Infinity) {

      let rightEndpointD2 = Math.pow((x1AtRightEndpoint - x1) / xscale, 2)
        + Math.pow((x2AtRightEndpoint - x2) / yscale, 2);
      if (rightEndpointD2 < currentD2) {
        x1AtMin = x1AtRightEndpoint;
        x2AtMin = x2AtRightEndpoint;
        currentD2 = rightEndpointD2;
      }

    }


    result = {
      x1: x1AtMin,
      x2: x2AtMin
    }

    if (variables.x3 !== undefined) {
      result.x3 = 0;
    }

    return result;

  }
}

function getNearestPointParametrizedCurve({ dependencyValues, numerics }) {
  let fs = dependencyValues.fs;
  let parMin = dependencyValues.parMin;
  let parMax = dependencyValues.parMax;
  let nDiscretizationPoints = dependencyValues.nDiscretizationPoints;
  let periodic = dependencyValues.periodic;
  let xscale = 1, yscale = 1;
  if (dependencyValues.graphXmin !== null &&
    dependencyValues.graphXmax !== null &&
    dependencyValues.graphYmin !== null &&
    dependencyValues.graphYmax !== null
  ) {
    xscale = dependencyValues.graphXmax - dependencyValues.graphXmin;
    yscale = dependencyValues.graphYmax - dependencyValues.graphYmin;
  }

  return function (variables) {

    // TODO: extend to dimensions other than N=2

    if (dependencyValues.fs.length !== 2) {
      return {};
    }

    let x1 = variables.x1.evaluate_to_constant();
    let x2 = variables.x2.evaluate_to_constant();

    if (!(Number.isFinite(x1) && Number.isFinite(x2))) {
      return {};
    }

    let minfunc = function (t) {

      let dx1 = (x1 - fs[0](t)) / xscale;
      let dx2 = (x2 - fs[1](t)) / yscale;

      return dx1 * dx1 + dx2 * dx2;
    }

    let minT = parMin;
    let maxT = parMax;

    let Nsteps = nDiscretizationPoints;
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

    for (let step = 1; step <= Nsteps; step++) {
      let tnew = minT + step * delta;
      let fnew = minfunc(tnew);
      if (fnew < fAtMin || Number.isNaN(fAtMin)) {
        tAtMin = tnew;
        fAtMin = fnew;
        tIntervalMin = tnew - delta;
        if (step === Nsteps) {
          tIntervalMax = tnew;
        } else {
          tIntervalMax = tnew + delta;
        }
      }

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

    result = {
      x1: x1AtMin,
      x2: x2AtMin
    }

    if (variables.x3 !== undefined) {
      result.x3 = 0;
    }

    return result;

  }
}

function calculateControlVectorFromSpline({ tau, eps, point1, point2, point3, splineForm }) {

  let dist = function (p1, p2) {
    let dx = p1[0] - p2[0];
    let dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  let p1, p2, p3;

  if (point2) {
    p2 = point2.map(x => x.evaluate_to_constant());
  } else {
    return {
      coordsNumeric: [me.fromAst(NaN), me.fromAst(NaN)],
      numericEntries: false
    }
  }

  if (point3) {
    p3 = point3.map(x => x.evaluate_to_constant());

    if (point1) {
      p1 = point1.map(x => x.evaluate_to_constant());
    } else {
      p1 = [
        2 * p2[0] - p3[0],
        2 * p2[1] - p3[1]
      ];
    }
  } else {
    if (point1) {
      p1 = point1.map(x => x.evaluate_to_constant());
      p3 = [
        2 * p2[0] - p1[0],
        2 * p2[1] - p1[1]
      ];
    } else {
      return {
        coordsNumeric: [me.fromAst(NaN), me.fromAst(NaN)],
        numericEntries: false
      }
    }
  }

  let cv = [];

  if (splineForm === 'centripetal') {
    let dt0 = dist(p1, p2);
    let dt1 = dist(p2, p3);

    dt0 = Math.sqrt(dt0);
    dt1 = Math.sqrt(dt1);

    if (dt1 < eps) { dt1 = 1.0; }
    if (dt0 < eps) { dt0 = dt1; }

    for (let dim = 0; dim < 2; dim++) {

      let t1 = (p2[dim] - p1[dim]) / dt0 -
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
      cv.push(-tau * (p3[dim] - p1[dim]) / 3);
      // }
    }
  }
  let coordsNumeric = cv.map(x => me.fromAst(x));
  let numericEntries = Number.isFinite(cv[0]) && Number.isFinite(cv[1])

  return { coordsNumeric, numericEntries };

}


// Compute coefficients for a cubic polynomial
//   p(s) = c0 + c1*s + c2*s^2 + c3*s^3
// such that
//   p(0) = x1, p(1) = x2
// and
//   p'(0) = t1, p'(1) = t2
function initCubicPoly(x1, x2, t1, t2) {
  return [
    x1,
    t1,
    -3 * x1 + 3 * x2 - 2 * t1 - t2,
    2 * x1 - 2 * x2 + t1 + t2
  ];
}

function returnBezierFunctions({ globalDependencyValues, arrayKeys }) {

  if (globalDependencyValues.nThroughPoints < 1) {
    let fs = {};
    for (let arrayKey of arrayKeys) {
      fs[arrayKey] = () => NaN;
    }
    return fs;
  }


  let len = globalDependencyValues.nThroughPoints - 1;

  let fs = {};

  let extrapolateBackward = globalDependencyValues.extrapolateBackward;
  let extrapolateForward = globalDependencyValues.extrapolateForward;

  for (let arrayKey of arrayKeys) {
    let firstPointX = globalDependencyValues.numericalThroughPoints[0][arrayKey];
    let lastPointX = globalDependencyValues.numericalThroughPoints[len][arrayKey];

    let cs = globalDependencyValues.splineCoeffs.map(x => x[arrayKey])
    let cB;
    if (extrapolateBackward) {
      cB = globalDependencyValues.extrapolateBackwardCoeffs[arrayKey];
    }
    let cF;
    if (extrapolateForward) {
      cF = globalDependencyValues.extrapolateForwardCoeffs[arrayKey];
    }

    fs[arrayKey] = function (t) {
      if (isNaN(t)) {
        return NaN;
      }

      if (t < 0) {
        if (extrapolateBackward) {
          return (cB[2] * t + cB[1]) * t + cB[0];
        } else {
          return firstPointX;
        }
      }

      if (t >= len) {
        if (extrapolateForward) {
          t -= len;
          return (cF[2] * t + cF[1]) * t + cF[0];
        } else {
          return lastPointX;
        }
      }

      let z = Math.floor(t);
      t -= z;
      let c = cs[z];
      return (((c[3] * t + c[2]) * t + c[1]) * t + c[0]);
    }

  }

  return fs;


}

function addTimePointBezier({ t, ind, ts, ignoreLeft = false }) {
  const eps = 1E-14;
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