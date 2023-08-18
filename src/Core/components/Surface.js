import GraphicalComponent from "./abstract/GraphicalComponent";
import { returnBreakStringsSugarFunction } from "./commonsugar/breakstrings";

import me from "math-expressions";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
import { returnWrapNonLabelsSugarFunction } from "../utils/label";

export default class Surface extends GraphicalComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      switchSurface: this.switchSurface.bind(this),
      surfaceClicked: this.surfaceClicked.bind(this),
      surfaceFocused: this.surfaceFocused.bind(this),
    });
  }
  static componentType = "surface";
  static rendererType = "surface";

  static primaryStateVariableForDefinition = "fsShadow";

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

    attributes.numDiscretizationPoints = {
      createComponentOfType: "numberList",
      defaultValue: 1000,
    };

    attributes.periodic = {
      createComponentOfType: "boolean",
      createStateVariable: "periodic",
      defaultValue: false,
      public: true,
    };

    attributes.variables = {
      createComponentOfType: "_variableNameList",
      createStateVariable: "variablesForChild",
      defaultValue: [me.fromAst("x"), me.fromAst("y")],
    };

    attributes.par1Min = {
      createComponentOfType: "number",
    };
    attributes.par1Max = {
      createComponentOfType: "number",
    };

    attributes.par2Min = {
      createComponentOfType: "number",
    };
    attributes.par2Max = {
      createComponentOfType: "number",
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

    // fsShadow will be null unless surface was created via an adapter
    // In case of adapter,
    // given the primaryStateVariableForDefinition static variable,
    // the definition of fsShadow will be changed to be the value
    // that shadows the component adapted
    stateVariableDefinitions.fsShadow = {
      defaultValue: null,
      isLocation: true,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          fsShadow: true,
        },
      }),
    };

    stateVariableDefinitions.numDiscretizationPoints = {
      forRenderer: true,
      returnDependencies: () => ({
        numDiscretizationPointsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "numDiscretizationPoints",
          variableNames: ["numbers"],
        },
      }),
      definition({ dependencyValues }) {
        let numDiscretizationPoints = [];
        let warnings = [];

        if (!dependencyValues.numDiscretizationPointsAttr) {
          numDiscretizationPoints = [10, 10];
        } else {
          let numbers =
            dependencyValues.numDiscretizationPointsAttr.stateValues.numbers;

          let foundNonNumerical = false;

          for (let num of numbers) {
            let rnd = Math.round(num);
            if (!Number.isFinite(rnd)) {
              if (!foundNonNumerical) {
                warnings.push({
                  message: `Non-numerical value for numDiscrizationPoints, setting to 10.`,
                  level: 1,
                });
              }
              foundNonNumerical = true;
              rnd = 10;
            } else if (rnd < 2) {
              warnings.push({
                message: `Invalid value ${num} for numDiscrizationPoints; must be at least 2.`,
                level: 1,
              });
              rnd = 2;
            }

            numDiscretizationPoints.push(rnd);
          }

          if (numDiscretizationPoints.length > 2) {
            warnings.push({
              message: `numDiscrizationPoints can be up to 2 values; ignoring extra values.`,
              level: 1,
            });
            numDiscretizationPoints = numDiscretizationPoints.slice(0, 2);
          }
          if (numDiscretizationPoints.length === 1) {
            // if given one number, use it for both values
            numDiscretizationPoints.push(numDiscretizationPoints[0]);
          } else if (numDiscretizationPoints.length === 0) {
            numDiscretizationPoints = [10, 10];
          }
        }

        return {
          setValue: { numDiscretizationPoints },
          sendWarnings: warnings,
        };
      },
    };

    stateVariableDefinitions.fromVectorValuedFunctionOfDim = {
      returnDependencies: () => ({
        functionChildren: {
          dependencyType: "child",
          childGroups: ["functions"],
          variableNames: ["numOutputs"],
        },
        fsShadow: {
          dependencyType: "stateVariable",
          variableName: "fsShadow",
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
          dependencyValues.fsShadow?.length > 1
        ) {
          fromVectorValuedFunctionOfDim = dependencyValues.fsShadow.length;
        }

        return { setValue: { fromVectorValuedFunctionOfDim } };
      },
    };

    stateVariableDefinitions.surfaceType = {
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
      }),
      definition({ dependencyValues }) {
        let surfaceType = "function";
        if (
          dependencyValues.functionChildren.length > 1 ||
          dependencyValues.fromVectorValuedFunctionOfDim > 1
        ) {
          surfaceType = "parameterization";
        }

        return { setValue: { surfaceType } };
      },
    };

    stateVariableDefinitions.par1Max = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      forRenderer: true,
      returnDependencies: () => ({
        surfaceType: {
          dependencyType: "stateVariable",
          variableName: "surfaceType",
        },
        par1MaxAttr: {
          dependencyType: "attributeComponent",
          attributeName: "par1Max",
          variableNames: ["value"],
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
      }),
      definition: function ({ dependencyValues }) {
        let par1Max;
        if (dependencyValues.par1MaxAttr !== null) {
          par1Max = dependencyValues.par1MaxAttr.stateValues.value;
        } else if (dependencyValues.surfaceType === "function") {
          let domain = null;
          if (dependencyValues.functionChild.length === 1) {
            domain = dependencyValues.functionChild[0].stateValues.domain;
          } else {
            domain = dependencyValues.adapterSourceDomain;
          }
          if (domain !== null) {
            domain = domain[0];
            par1Max = me.fromAst(domain.tree[1][2]).evaluate_to_constant();
          }

          if (!Number.isFinite(par1Max)) {
            par1Max = 10;
          }
        } else {
          par1Max = 10;
        }

        return { setValue: { par1Max } };
      },
    };

    stateVariableDefinitions.par1Min = {
      forRenderer: true,
      isLocation: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        surfaceType: {
          dependencyType: "stateVariable",
          variableName: "surfaceType",
        },
        par1MinAttr: {
          dependencyType: "attributeComponent",
          attributeName: "par1Min",
          variableNames: ["value"],
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
      }),
      definition: function ({ dependencyValues }) {
        let par1Min;
        if (dependencyValues.par1MinAttr !== null) {
          par1Min = dependencyValues.par1MinAttr.stateValues.value;
        } else if (dependencyValues.surfaceType === "function") {
          let domain = null;
          if (dependencyValues.functionChild.length === 1) {
            domain = dependencyValues.functionChild[0].stateValues.domain;
          } else {
            domain = dependencyValues.adapterSourceDomain;
          }
          if (domain !== null) {
            domain = domain[0];
            par1Min = me.fromAst(domain.tree[1][1]);
          }
          if (!Number.isFinite(par1Min)) {
            par1Min = -10;
          }
        } else {
          par1Min = -10;
        }
        return { setValue: { par1Min } };
      },
    };

    stateVariableDefinitions.par2Max = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      forRenderer: true,
      returnDependencies: () => ({
        surfaceType: {
          dependencyType: "stateVariable",
          variableName: "surfaceType",
        },
        par2MaxAttr: {
          dependencyType: "attributeComponent",
          attributeName: "par2Max",
          variableNames: ["value"],
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
      }),
      definition: function ({ dependencyValues }) {
        let par2Max;
        if (dependencyValues.par2MaxAttr !== null) {
          par2Max = dependencyValues.par2MaxAttr.stateValues.value;
        } else if (dependencyValues.surfaceType === "function") {
          let domain = null;
          if (dependencyValues.functionChild.length === 1) {
            domain = dependencyValues.functionChild[0].stateValues.domain;
          } else {
            domain = dependencyValues.adapterSourceDomain;
          }
          if (domain !== null) {
            domain = domain[0];
            par2Max = me.fromAst(domain.tree[2][2]).evaluate_to_constant();
          }

          if (!Number.isFinite(par2Max)) {
            par2Max = 10;
          }
        } else {
          par2Max = 10;
        }

        return { setValue: { par2Max } };
      },
    };

    stateVariableDefinitions.par2Min = {
      forRenderer: true,
      isLocation: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        surfaceType: {
          dependencyType: "stateVariable",
          variableName: "surfaceType",
        },
        par2MinAttr: {
          dependencyType: "attributeComponent",
          attributeName: "par2Min",
          variableNames: ["value"],
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
      }),
      definition: function ({ dependencyValues }) {
        let par2Min;
        if (dependencyValues.par2MinAttr !== null) {
          par2Min = dependencyValues.par2MinAttr.stateValues.value;
        } else if (dependencyValues.surfaceType === "function") {
          let domain = null;
          if (dependencyValues.functionChild.length === 1) {
            domain = dependencyValues.functionChild[0].stateValues.domain;
          } else {
            domain = dependencyValues.adapterSourceDomain;
          }
          if (domain !== null) {
            domain = domain[0];
            par2Min = me.fromAst(domain.tree[2][1]);
          }
          if (!Number.isFinite(par2Min)) {
            par2Min = -10;
          }
        } else {
          par2Min = -10;
        }
        return { setValue: { par2Min } };
      },
    };

    stateVariableDefinitions.domainForFunctions = {
      returnDependencies: () => ({
        par1Min: {
          dependencyType: "stateVariable",
          variableName: "par1Min",
        },
        par1Max: {
          dependencyType: "stateVariable",
          variableName: "par1Max",
        },
        par2Min: {
          dependencyType: "stateVariable",
          variableName: "par2Min",
        },
        par2Max: {
          dependencyType: "stateVariable",
          variableName: "par2Max",
        },
      }),
      definition({ dependencyValues }) {
        // closed intervals [par1Min, par1Max] and [par2Min, par2Max]
        let interval1 = me.fromAst([
          "interval",
          ["tuple", dependencyValues.par1Min, dependencyValues.par1Max],
          ["tuple", true, true],
        ]);
        let interval2 = me.fromAst([
          "interval",
          ["tuple", dependencyValues.par2Min, dependencyValues.par2Max],
          ["tuple", true, true],
        ]);
        return {
          setValue: { domainForFunctions: [interval1, interval2] },
        };
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
      }),
      returnArraySize({ dependencyValues }) {
        return [
          Math.max(
            1,
            dependencyValues.functionChildren.length,
            dependencyValues.fromVectorValuedFunctionOfDim,
          ),
        ];
      },
      stateVariablesDeterminingDependencies: ["fromVectorValuedFunctionOfDim"],
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let globalDependencies = {
          surfaceType: {
            dependencyType: "stateVariable",
            variableName: "surfaceType",
          },
          fromVectorValuedFunctionOfDim: {
            dependencyType: "stateVariable",
            variableName: "fromVectorValuedFunctionOfDim",
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

            globalDependencies.fsShadow = {
              dependencyType: "stateVariable",
              variableName: "fsShadow",
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
              dependenciesByKey[arrayKey].fsShadow = {
                dependencyType: "stateVariable",
                variableName: "fsShadow",
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
              fs[arrayKey] = globalDependencyValues.fsShadow[arrayKey];
              fDefinitions[arrayKey] =
                globalDependencyValues.fDefinitionsAdapted[arrayKey];
            } else {
              if (
                Number(arrayKey) === 0 &&
                dependencyValuesByKey[arrayKey].fsShadow?.[0]
              ) {
                fs[arrayKey] = dependencyValuesByKey[arrayKey].fsShadow[0];
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

    return stateVariableDefinitions;
  }

  switchSurface() {}

  async surfaceClicked({
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

  async surfaceFocused({
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
