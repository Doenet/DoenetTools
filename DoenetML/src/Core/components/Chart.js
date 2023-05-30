import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
import BlockComponent from "./abstract/BlockComponent";

export default class Chart extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      changeAxisLimits: this.changeAxisLimits.bind(this),
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "chart";

  static acceptTarget = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.type = {
      createComponentOfType: "text",
      createStateVariable: "type",
      defaultValue: "histogram",
      toLowerCase: true,
      validValues: ["histogram", "dotplot", "frequencytable", "box", "bar"],
      forRenderer: true,
    };

    attributes.column = {
      createComponentOfType: "text",
      createStateVariable: "desiredColumn",
      defaultValue: null,
    };

    attributes.xmin = {
      createComponentOfType: "number",
      createStateVariable: "xminPrelim",
      defaultValue: -10,
    };
    attributes.xmax = {
      createComponentOfType: "number",
      createStateVariable: "xmaxPrelim",
      defaultValue: 10,
    };
    attributes.ymin = {
      createComponentOfType: "number",
      createStateVariable: "yminPrelim",
      defaultValue: -10,
    };
    attributes.ymax = {
      createComponentOfType: "number",
      createStateVariable: "ymaxPrelim",
      defaultValue: 10,
    };
    attributes.width = {
      createComponentOfType: "_componentSize",
      createStateVariable: "width",
      defaultValue: { size: 300, isAbsolute: true },
      public: true,
      forRenderer: true,
    };
    attributes.height = {
      createComponentOfType: "_componentSize",
      createStateVariable: "height",
      defaultValue: { size: 300, isAbsolute: true },
      public: true,
      forRenderer: true,
    };
    attributes.identicalAxisScales = {
      createComponentOfType: "boolean",
      createStateVariable: "identicalAxisScales",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };
    attributes.displayXAxis = {
      createComponentOfType: "boolean",
      createStateVariable: "displayXAxis",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };
    attributes.displayYAxis = {
      createComponentOfType: "boolean",
      createStateVariable: "displayYAxis",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };
    attributes.displayXAxisTickLabels = {
      createComponentOfType: "boolean",
      createStateVariable: "displayXAxisTickLabels",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };
    attributes.displayYAxisTickLabels = {
      createComponentOfType: "boolean",
      createStateVariable: "displayYAxisTickLabels",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };
    attributes.xlabel = {
      createComponentOfType: "text",
      createStateVariable: "xlabel",
      defaultValue: "",
      public: true,
      forRenderer: true,
    };
    attributes.xlabelPosition = {
      createComponentOfType: "text",
      createStateVariable: "xlabelPosition",
      defaultValue: "right",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["right", "left"],
    };
    attributes.ylabel = {
      createComponentOfType: "text",
      createStateVariable: "ylabel",
      defaultValue: "",
      public: true,
      forRenderer: true,
    };
    attributes.ylabelPosition = {
      createComponentOfType: "text",
      createStateVariable: "ylabelPosition",
      defaultValue: "top",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["top", "bottom"],
    };
    attributes.ylabelAlignment = {
      createComponentOfType: "text",
      createStateVariable: "ylabelAlignment",
      defaultValue: "left",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["left", "right"],
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

    stateVariableDefinitions.dataFrame = {
      forRenderer: true,
      returnDependencies() {
        return {
          targetComponent: {
            dependencyType: "targetComponent",
            variableNames: ["dataFrame"],
            variablesOptional: true,
          },
        };
      },
      definition({ dependencyValues }) {
        console.log("definition of dataFrame", dependencyValues);

        let dataFrame = null;
        if (dependencyValues.targetComponent?.stateValues.dataFrame) {
          dataFrame = dependencyValues.targetComponent.stateValues.dataFrame;
        }

        return {
          setValue: { dataFrame },
        };
      },
    };

    stateVariableDefinitions.columnName = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      additionalStateVariablesDefined: [
        {
          variableName: "colInd",
          forRenderer: true,
        },
      ],
      returnDependencies() {
        return {
          desiredColumn: {
            dependencyType: "stateVariable",
            variableName: "desiredColumn",
          },
          dataFrame: {
            dependencyType: "stateVariable",
            variableName: "dataFrame",
          },
        };
      },
      definition({ dependencyValues }) {
        let columnName = null,
          colInd = null;
        if (dependencyValues.dataFrame) {
          colInd = dependencyValues.dataFrame.columnNames.indexOf(
            dependencyValues.desiredColumn,
          );
          if (colInd !== -1) {
            columnName = dependencyValues.desiredColumn;
          } else {
            colInd = null;
          }
        }

        return {
          setValue: { columnName, colInd },
        };
      },
    };

    stateVariableDefinitions.xmin = {
      stateVariablesDeterminingDependencies: ["identicalAxisScales"],
      defaultValue: -10,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      forRenderer: true,
      returnDependencies({ stateValues }) {
        let dependencies = {
          identicalAxisScales: {
            dependencyType: "stateVariable",
            variableName: "identicalAxisScales",
          },
          xminPrelim: {
            dependencyType: "stateVariable",
            variableName: "xminPrelim",
          },
        };

        if (stateValues.identicalAxisScales) {
          dependencies.xmaxPrelim = {
            dependencyType: "stateVariable",
            variableName: "xmaxPrelim",
          };
          dependencies.yminPrelim = {
            dependencyType: "stateVariable",
            variableName: "yminPrelim",
          };
          dependencies.ymaxPrelim = {
            dependencyType: "stateVariable",
            variableName: "ymaxPrelim",
          };
          dependencies.width = {
            dependencyType: "stateVariable",
            variableName: "width",
          };
          dependencies.height = {
            dependencyType: "stateVariable",
            variableName: "height",
          };
        }
        return dependencies;
      },
      definition({ dependencyValues, usedDefault }) {
        if (!dependencyValues.identicalAxisScales) {
          return { setValue: { xmin: dependencyValues.xminPrelim } };
        }

        let xminSpecified = !usedDefault.xminPrelim;

        // always use xmin if specified
        if (xminSpecified) {
          return { setValue: { xmin: dependencyValues.xminPrelim } };
        }

        let xmaxSpecified = !usedDefault.xmaxPrelim;
        let yminSpecified = !usedDefault.yminPrelim;
        let ymaxSpecified = !usedDefault.ymaxPrelim;

        let yscaleSpecified = yminSpecified && ymaxSpecified;

        if (yscaleSpecified) {
          let aspectRatio =
            dependencyValues.width.size / dependencyValues.height.size;
          let yscaleAdjusted =
            (dependencyValues.ymaxPrelim - dependencyValues.yminPrelim) *
            aspectRatio;
          if (xmaxSpecified) {
            return {
              setValue: { xmin: dependencyValues.xmaxPrelim - yscaleAdjusted },
            };
          } else {
            return { setValue: { xmin: -yscaleAdjusted / 2 } };
          }
        } else {
          if (xmaxSpecified) {
            // use the default xscale of 20
            return { setValue: { xmin: dependencyValues.xmaxPrelim - 20 } };
          } else {
            // use the default value of xmin
            return { setValue: { xmin: -10 } };
          }
        }
      },
      async inverseDefinition({ desiredStateVariableValues, stateValues }) {
        if (await stateValues.fixAxes) {
          return { success: false };
        }
        return {
          success: true,
          instructions: [
            {
              setDependency: "xminPrelim",
              desiredValue: desiredStateVariableValues.xmin,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.xmax = {
      stateVariablesDeterminingDependencies: ["identicalAxisScales"],
      defaultValue: -10,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      forRenderer: true,
      returnDependencies({ stateValues }) {
        let dependencies = {
          identicalAxisScales: {
            dependencyType: "stateVariable",
            variableName: "identicalAxisScales",
          },
          xmaxPrelim: {
            dependencyType: "stateVariable",
            variableName: "xmaxPrelim",
          },
        };

        if (stateValues.identicalAxisScales) {
          dependencies.xminPrelim = {
            dependencyType: "stateVariable",
            variableName: "xminPrelim",
          };
          dependencies.yminPrelim = {
            dependencyType: "stateVariable",
            variableName: "yminPrelim",
          };
          dependencies.ymaxPrelim = {
            dependencyType: "stateVariable",
            variableName: "ymaxPrelim",
          };
          dependencies.width = {
            dependencyType: "stateVariable",
            variableName: "width",
          };
          dependencies.height = {
            dependencyType: "stateVariable",
            variableName: "height",
          };
        }
        return dependencies;
      },
      definition({ dependencyValues, usedDefault }) {
        if (!dependencyValues.identicalAxisScales) {
          return { setValue: { xmax: dependencyValues.xmaxPrelim } };
        }

        let xminSpecified = !usedDefault.xminPrelim;
        let xmaxSpecified = !usedDefault.xmaxPrelim;
        let yminSpecified = !usedDefault.yminPrelim;
        let ymaxSpecified = !usedDefault.ymaxPrelim;

        let yscaleSpecified = yminSpecified && ymaxSpecified;
        let xscaleSpecified = xminSpecified && xmaxSpecified;

        let xmin = dependencyValues.xminPrelim;

        if (yscaleSpecified) {
          let aspectRatio =
            dependencyValues.width.size / dependencyValues.height.size;
          let yscaleAdjusted =
            (dependencyValues.ymaxPrelim - dependencyValues.yminPrelim) *
            aspectRatio;

          if (xscaleSpecified) {
            let xscale = dependencyValues.xmaxPrelim - xmin;
            let maxScale = Math.max(xscale, yscaleAdjusted);

            return { setValue: { xmax: xmin + maxScale } };
          } else {
            if (xminSpecified) {
              return { setValue: { xmax: xmin + yscaleAdjusted } };
            } else if (xmaxSpecified) {
              return { setValue: { xmax: dependencyValues.xmaxPrelim } };
            } else {
              return { setValue: { xmax: yscaleAdjusted / 2 } };
            }
          }
        } else {
          // no yscale specified
          if (xmaxSpecified) {
            return { setValue: { xmax: dependencyValues.xmaxPrelim } };
          } else if (xminSpecified) {
            // use the default xscale of 20
            return { setValue: { xmax: xmin + 20 } };
          } else {
            // use the default xmax
            return { setValue: { xmax: 10 } };
          }
        }
      },
      async inverseDefinition({ desiredStateVariableValues, stateValues }) {
        if (await stateValues.fixAxes) {
          return { success: false };
        }
        return {
          success: true,
          instructions: [
            {
              setDependency: "xmaxPrelim",
              desiredValue: desiredStateVariableValues.xmax,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.ymin = {
      stateVariablesDeterminingDependencies: ["identicalAxisScales"],
      defaultValue: -10,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      forRenderer: true,
      returnDependencies({ stateValues }) {
        let dependencies = {
          identicalAxisScales: {
            dependencyType: "stateVariable",
            variableName: "identicalAxisScales",
          },
          yminPrelim: {
            dependencyType: "stateVariable",
            variableName: "yminPrelim",
          },
        };

        if (stateValues.identicalAxisScales) {
          dependencies.xmaxPrelim = {
            dependencyType: "stateVariable",
            variableName: "xmaxPrelim",
          };
          dependencies.xminPrelim = {
            dependencyType: "stateVariable",
            variableName: "xminPrelim",
          };
          dependencies.ymaxPrelim = {
            dependencyType: "stateVariable",
            variableName: "ymaxPrelim",
          };
          dependencies.width = {
            dependencyType: "stateVariable",
            variableName: "width",
          };
          dependencies.height = {
            dependencyType: "stateVariable",
            variableName: "height",
          };
        }
        return dependencies;
      },
      definition({ dependencyValues, usedDefault }) {
        if (!dependencyValues.identicalAxisScales) {
          return { setValue: { ymin: dependencyValues.yminPrelim } };
        }

        let yminSpecified = !usedDefault.yminPrelim;

        // always use ymin if specified
        if (yminSpecified) {
          return { setValue: { ymin: dependencyValues.yminPrelim } };
        }

        let ymaxSpecified = !usedDefault.ymaxPrelim;
        let xminSpecified = !usedDefault.xminPrelim;
        let xmaxSpecified = !usedDefault.xmaxPrelim;

        let xscaleSpecified = xminSpecified && xmaxSpecified;
        let aspectRatio =
          dependencyValues.width.size / dependencyValues.height.size;

        if (xscaleSpecified) {
          let xscaleAdjusted =
            (dependencyValues.xmaxPrelim - dependencyValues.xminPrelim) /
            aspectRatio;
          if (ymaxSpecified) {
            return {
              setValue: { ymin: dependencyValues.ymaxPrelim - xscaleAdjusted },
            };
          } else {
            return { setValue: { ymin: -xscaleAdjusted / 2 } };
          }
        } else {
          if (ymaxSpecified) {
            // use the default xscale of 20, adjusted for aspect ratio
            return {
              setValue: {
                ymin: dependencyValues.ymaxPrelim - 20 / aspectRatio,
              },
            };
          } else {
            // use the default value of ymin, adjusted for aspect ration
            return { setValue: { ymin: -10 / aspectRatio } };
          }
        }
      },
      async inverseDefinition({ desiredStateVariableValues, stateValues }) {
        if (await stateValues.fixAxes) {
          return { success: false };
        }
        return {
          success: true,
          instructions: [
            {
              setDependency: "yminPrelim",
              desiredValue: desiredStateVariableValues.ymin,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.ymax = {
      stateVariablesDeterminingDependencies: ["identicalAxisScales"],
      defaultValue: -10,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      forRenderer: true,
      returnDependencies({ stateValues }) {
        let dependencies = {
          identicalAxisScales: {
            dependencyType: "stateVariable",
            variableName: "identicalAxisScales",
          },
          ymaxPrelim: {
            dependencyType: "stateVariable",
            variableName: "ymaxPrelim",
          },
        };

        if (stateValues.identicalAxisScales) {
          dependencies.xminPrelim = {
            dependencyType: "stateVariable",
            variableName: "xminPrelim",
          };
          dependencies.yminPrelim = {
            dependencyType: "stateVariable",
            variableName: "yminPrelim",
          };
          dependencies.xmaxPrelim = {
            dependencyType: "stateVariable",
            variableName: "xmaxPrelim",
          };
          dependencies.width = {
            dependencyType: "stateVariable",
            variableName: "width",
          };
          dependencies.height = {
            dependencyType: "stateVariable",
            variableName: "height",
          };
        }
        return dependencies;
      },
      definition({ dependencyValues, usedDefault }) {
        if (!dependencyValues.identicalAxisScales) {
          return { setValue: { ymax: dependencyValues.ymaxPrelim } };
        }

        let xminSpecified = !usedDefault.xminPrelim;
        let xmaxSpecified = !usedDefault.xmaxPrelim;
        let yminSpecified = !usedDefault.yminPrelim;
        let ymaxSpecified = !usedDefault.ymaxPrelim;

        let yscaleSpecified = yminSpecified && ymaxSpecified;
        let xscaleSpecified = xminSpecified && xmaxSpecified;

        let ymin = dependencyValues.yminPrelim;

        let aspectRatio =
          dependencyValues.width.size / dependencyValues.height.size;

        if (xscaleSpecified) {
          let xscaleAdjusted =
            (dependencyValues.xmaxPrelim - dependencyValues.xminPrelim) /
            aspectRatio;

          if (yscaleSpecified) {
            let yscale = dependencyValues.ymaxPrelim - ymin;
            let maxScale = Math.max(yscale, xscaleAdjusted);

            return { setValue: { ymax: ymin + maxScale } };
          } else {
            if (yminSpecified) {
              return { setValue: { ymax: ymin + xscaleAdjusted } };
            } else if (ymaxSpecified) {
              return { setValue: { ymax: dependencyValues.ymaxPrelim } };
            } else {
              return { setValue: { ymax: xscaleAdjusted / 2 } };
            }
          }
        } else {
          // no xscale specified
          if (ymaxSpecified) {
            return { setValue: { ymax: dependencyValues.ymaxPrelim } };
          } else if (yminSpecified) {
            // use the default yscale of 20, adjusted for aspect ratio
            return { setValue: { ymax: ymin + 20 / aspectRatio } };
          } else {
            // use the default ymax, adjusted for aspect ratio
            return { setValue: { ymax: 10 / aspectRatio } };
          }
        }
      },
      async inverseDefinition({ desiredStateVariableValues, stateValues }) {
        if (await stateValues.fixAxes) {
          return { success: false };
        }
        return {
          success: true,
          instructions: [
            {
              setDependency: "ymaxPrelim",
              desiredValue: desiredStateVariableValues.ymax,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.xscale = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        xmin: {
          dependencyType: "stateVariable",
          variableName: "xmin",
        },
        xmax: {
          dependencyType: "stateVariable",
          variableName: "xmax",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            xscale: dependencyValues.xmax - dependencyValues.xmin,
          },
        };
      },
    };

    stateVariableDefinitions.yscale = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        ymin: {
          dependencyType: "stateVariable",
          variableName: "ymin",
        },
        ymax: {
          dependencyType: "stateVariable",
          variableName: "ymax",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            yscale: dependencyValues.ymax - dependencyValues.ymin,
          },
        };
      },
    };

    return stateVariableDefinitions;
  }

  async changeAxisLimits({
    xmin,
    xmax,
    ymin,
    ymax,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let updateInstructions = [];

    if (xmin !== undefined) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "xmin",
        value: xmin,
      });
    }
    if (xmax !== undefined) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "xmax",
        value: xmax,
      });
    }
    if (ymin !== undefined) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "ymin",
        value: ymin,
      });
    }
    if (ymax !== undefined) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "ymax",
        value: ymax,
      });
    }

    return await this.coreFunctions.performUpdate({
      updateInstructions,
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
          xmin,
          xmax,
          ymin,
          ymax,
        },
      },
    });
  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible },
    });
    this.coreFunctions.resolveAction({ actionId });
  }
}
