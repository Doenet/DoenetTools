import { processAssignNames } from '../utils/serializedStateProcessing.js';
import BlockComponent from './abstract/BlockComponent.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { orderedPercentWidthMidpoints, orderedWidthMidpoints, widthsBySize, sizePossibilities } from '../utils/size.js';
export default class Graph extends BlockComponent {
  static componentType = "graph";
  static renderChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
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
    };
    attributes.size = {
      createComponentOfType: "text",
    }
    attributes.aspectRatio = {
      createComponentOfType: "number",
    };

    // Note: height attribute is deprecated and will be removed in the future
    attributes.height = {
      createComponentOfType: "_componentSize",
    };

    attributes.displayMode = {
      createComponentOfType: "text",
      createStateVariable: "displayMode",
      validValues: ["block", "inline"],
      defaultValue: "block",
      forRenderer: true,
      public: true,
    }

    attributes.horizontalAlign = {
      createComponentOfType: "text",
      createStateVariable: "horizontalAlign",
      validValues: ["center", "left", "right"],
      defaultValue: "center",
      forRenderer: true,
      public: true,
    }

    attributes.identicalAxisScales = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "identicalAxisScales",
      defaultValue: false,
      public: true,
    };
    attributes.displayXAxis = {
      createComponentOfType: "boolean",
      createStateVariable: "displayXAxis",
      defaultValue: true,
      public: true,
      forRenderer: true
    };
    attributes.displayYAxis = {
      createComponentOfType: "boolean",
      createStateVariable: "displayYAxis",
      defaultValue: true,
      public: true,
      forRenderer: true
    };
    attributes.displayXAxisTickLabels = {
      createComponentOfType: "boolean",
      createStateVariable: "displayXAxisTickLabels",
      defaultValue: true,
      public: true,
      forRenderer: true
    };
    attributes.displayYAxisTickLabels = {
      createComponentOfType: "boolean",
      createStateVariable: "displayYAxisTickLabels",
      defaultValue: true,
      public: true,
      forRenderer: true
    };
    attributes.xlabel = {
      createComponentOfType: "label",
    };
    attributes.xlabelPosition = {
      createComponentOfType: "text",
      createStateVariable: "xlabelPosition",
      defaultValue: "right",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["right", "left"]
    };
    attributes.xTickScaleFactor = {
      createComponentOfType: "math",
      createStateVariable: "xTickScaleFactor",
      defaultValue: null,
      public: true,
      forRenderer: true,
    }
    attributes.ylabel = {
      createComponentOfType: "label",
    };
    attributes.ylabelPosition = {
      createComponentOfType: "text",
      createStateVariable: "ylabelPosition",
      defaultValue: "top",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["top", "bottom"]
    };
    attributes.ylabelAlignment = {
      createComponentOfType: "text",
      createStateVariable: "ylabelAlignment",
      defaultValue: "left",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["left", "right"]
    };
    attributes.yTickScaleFactor = {
      createComponentOfType: "math",
      createStateVariable: "yTickScaleFactor",
      defaultValue: null,
      public: true,
      forRenderer: true,
    }
    attributes.showNavigation = {
      createComponentOfType: "boolean",
      createStateVariable: "showNavigation",
      defaultValue: true,
      public: true,
      forRenderer: true
    };
    attributes.fixAxes = {
      createComponentOfType: "boolean",
      createStateVariable: "fixAxes",
      defaultValue: false,
      public: true,
      forRenderer: true
    };
    attributes.grid = {
      createComponentOfType: "text",
    };
    attributes.displayDigits = {
      createComponentOfType: "integer",
    };

    attributes.displayDecimals = {
      createComponentOfType: "integer",
      createStateVariable: "displayDecimals",
      defaultValue: null,
      public: true,
    };

    attributes.displaySmallAsZero = {
      createComponentOfType: "number",
      createStateVariable: "displaySmallAsZero",
      valueForTrue: 1E-14,
      valueForFalse: 0,
      defaultValue: 0,
      public: true,
    };

    attributes.padZeros = {
      createComponentOfType: "boolean",
      createStateVariable: "padZeros",
      defaultValue: false,
      public: true,
    };
    return attributes;
  }


  static returnChildGroups() {

    return [{
      group: "xlabels",
      componentTypes: ["xlabel"]
    },
    {
      group: "ylabels",
      componentTypes: ["ylabel"]
    },
    {
      group: "graphical",
      componentTypes: ["_graphical", "text", "image", "math", "m", "md", "label"]
    },
    {
      group: "childrenThatShouldNotBeHere",
      componentTypes: ["_base"],
      matchAfterAdapters: true
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.displayDigits = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      hasEssential: true,
      defaultValue: 10,
      returnDependencies: () => ({
        displayDigitsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDigits",
          variableNames: ["value"]
        },
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        },
      }),
      definition({ dependencyValues, usedDefault }) {

        if (dependencyValues.displayDigitsAttr !== null) {

          let displayDigitsAttrUsedDefault = usedDefault.displayDigitsAttr;
          let displayDecimalsAttrUsedDefault = dependencyValues.displayDecimalsAttr === null || usedDefault.displayDecimalsAttr;

          if (!(displayDigitsAttrUsedDefault || displayDecimalsAttrUsedDefault)) {
            // if both display digits and display decimals did not use default
            // we'll regard display digits as using default if it comes from a deeper shadow
            let shadowDepthDisplayDigits = dependencyValues.displayDigitsAttr.shadowDepth;
            let shadowDepthDisplayDecimals = dependencyValues.displayDecimalsAttr.shadowDepth;

            if (shadowDepthDisplayDecimals < shadowDepthDisplayDigits) {
              displayDigitsAttrUsedDefault = true;
            }
          }

          if (displayDigitsAttrUsedDefault) {
            return {
              useEssentialOrDefaultValue: {
                displayDigits: {
                  defaultValue: dependencyValues.displayDigitsAttr.stateValues.value
                }
              }
            }
          } else {
            return {
              setValue: {
                displayDigits: dependencyValues.displayDigitsAttr.stateValues.value
              }
            }
          }
        }

        return { useEssentialOrDefaultValue: { displayDigits: true } }

      }
    }


    stateVariableDefinitions.xlabel = {
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "label",
        addStateVariablesShadowingStateVariables: {
          hasLatex: {
            stateVariableToShadow: "xlabelHasLatex",
          }
        },
      },
      hasEssential: true,
      defaultValue: "",
      additionalStateVariablesDefined: [{
        variableName: "xlabelHasLatex",
        forRenderer: true,
      }],
      returnDependencies: () => ({
        xlabelAttr: {
          dependencyType: "attributeComponent",
          attributeName: "xlabel",
          variableNames: ["value", "hasLatex"]
        },
        xlabelChild: {
          dependencyType: "child",
          childGroups: ["xlabels"],
          variableNames: ["value", "hasLatex"]
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.xlabelChild.length > 0) {
          let xlabelChild = dependencyValues.xlabelChild[dependencyValues.xlabelChild.length - 1]
          return {
            setValue: {
              xlabel: xlabelChild.stateValues.value,
              xlabelHasLatex: xlabelChild.stateValues.hasLatex
            }
          }
        } else if (dependencyValues.xlabelAttr) {
          return {
            setValue: {
              xlabel: dependencyValues.xlabelAttr.stateValues.value,
              xlabelHasLatex: dependencyValues.xlabelAttr.stateValues.hasLatex
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { xlabel: true },
            setValue: { xlabelHasLatex: false }
          }
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (typeof desiredStateVariableValues.xlabel !== "string") {
          return { success: false }
        }

        if (dependencyValues.xlabelChild.length > 0) {
          let lastLabelInd = dependencyValues.xlabelChild.length - 1;
          return {
            success: true,
            instructions: [{
              setDependency: "xlabelChild",
              desiredValue: desiredStateVariableValues.xlabel,
              childIndex: lastLabelInd,
              variableIndex: 0
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setEssentialValue: "xlabel",
              value: desiredStateVariableValues.xlabel
            }]
          }
        }
      }
    }

    stateVariableDefinitions.ylabel = {
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "label",
        addStateVariablesShadowingStateVariables: {
          hasLatex: {
            stateVariableToShadow: "ylabelHasLatex",
          }
        },
      },
      hasEssential: true,
      defaultValue: "",
      additionalStateVariablesDefined: [{
        variableName: "ylabelHasLatex",
        forRenderer: true,
      }],
      returnDependencies: () => ({
        ylabelAttr: {
          dependencyType: "attributeComponent",
          attributeName: "ylabel",
          variableNames: ["value", "hasLatex"]
        },
        ylabelChild: {
          dependencyType: "child",
          childGroups: ["ylabels"],
          variableNames: ["value", "hasLatex"]
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.ylabelChild.length > 0) {
          let ylabelChild = dependencyValues.ylabelChild[dependencyValues.ylabelChild.length - 1]
          return {
            setValue: {
              ylabel: ylabelChild.stateValues.value,
              ylabelHasLatex: ylabelChild.stateValues.hasLatex
            }
          }
        } else if (dependencyValues.ylabelAttr) {
          return {
            setValue: {
              ylabel: dependencyValues.ylabelAttr.stateValues.value,
              ylabelHasLatex: dependencyValues.ylabelAttr.stateValues.hasLatex
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { ylabel: true },
            setValue: { ylabelHasLatex: false }
          }
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (typeof desiredStateVariableValues.ylabel !== "string") {
          return { success: false }
        }

        if (dependencyValues.ylabelChild.length > 0) {
          let lastLabelInd = dependencyValues.ylabelChild.length - 1;
          return {
            success: true,
            instructions: [{
              setDependency: "ylabelChild",
              desiredValue: desiredStateVariableValues.ylabel,
              childIndex: lastLabelInd,
              variableIndex: 0
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setEssentialValue: "ylabel",
              value: desiredStateVariableValues.ylabel
            }]
          }
        }
      }
    }

    stateVariableDefinitions.graphicalDescendants = {
      forRenderer: true,
      returnDependencies: () => ({
        graphicalDescendants: {
          dependencyType: "descendant",
          componentTypes: ["_graphical"],
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            graphicalDescendants: dependencyValues.graphicalDescendants
          }
        }
      },
    };

    stateVariableDefinitions.childIndicesToRender = {
      returnDependencies: () => ({
        graphicalChildren: {
          dependencyType: "child",
          childGroups: ["graphical"],
        },
        allChildren: {
          dependencyType: "child",
          childGroups: ["graphical", "xlabels", "ylabels", "childrenThatShouldNotBeHere"],
        },
      }),
      definition({ dependencyValues }) {
        let childIndicesToRender = [];

        let graphicalChildNames = dependencyValues.graphicalChildren.map(x => x.componentName);

        for (let [ind, child] of dependencyValues.allChildren.entries()) {
          if (graphicalChildNames.includes(child.componentName)) {
            childIndicesToRender.push(ind)
          }
        }

        return { setValue: { childIndicesToRender } }

      }
    }

    stateVariableDefinitions.nChildrenAdded = {
      defaultValue: 0,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({ useEssentialOrDefaultValue: { nChildrenAdded: true } }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "nChildrenAdded",
            value: desiredStateVariableValues.nChildrenAdded
          }]
        }
      }
    }

    stateVariableDefinitions.size = {
      public: true,
      defaultValue: "medium",
      hasEssential: true,
      shadowingInstructions: {
        createComponentOfType: "text"
      },
      returnDependencies: () => ({
        sizeAttr: {
          dependencyType: "attributeComponent",
          attributeName: "size",
          variableNames: ["value"],
        },
        widthAttr: {
          dependencyType: "attributeComponent",
          attributeName: "width",
          variableNames: ["componentSize"],
        },
      }),
      definition({ dependencyValues }) {
        const defaultSize = 'medium';

        if (dependencyValues.sizeAttr) {
          let size = dependencyValues.sizeAttr.stateValues.value.toLowerCase();

          if (!sizePossibilities.includes(size)) {
            size = defaultSize;
          }
          return {
            setValue: { size }
          }
        } else if (dependencyValues.widthAttr) {
          let componentSize = dependencyValues.widthAttr.stateValues.componentSize;
          if (componentSize === null) {

            return {
              setValue: { size: defaultSize }
            }
          }
          let { isAbsolute, size: widthSize } = componentSize;
          let size;

          if (isAbsolute) {
            for (let [ind, pixels] of orderedWidthMidpoints.entries()) {
              if (widthSize <= pixels) {
                size = sizePossibilities[ind];
                break
              }
            }
            if (!size) {
              size = defaultSize
            }
          } else {
            for (let [ind, percent] of orderedPercentWidthMidpoints.entries()) {
              if (widthSize <= percent) {
                size = sizePossibilities[ind];
                break
              }
            }
            if (!size) {
              size = defaultSize
            }
          }
          return {
            setValue: { size }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { size: true }
          }
        }
      }

    }

    stateVariableDefinitions.width = {
      public: true,
      forRenderer: true,
      shadowingInstructions: {
        createComponentOfType: "_componentSize"
      },
      returnDependencies: () => ({
        size: {
          dependencyType: "stateVariable",
          variableName: "size",
        }
      }),
      definition({ dependencyValues }) {

        let width = { isAbsolute: true, size: widthsBySize[dependencyValues.size] }

        return {
          setValue: { width }
        }

      }

    }

    stateVariableDefinitions.aspectRatioFromAxisScales = {
      returnDependencies: () => ({
        aspectRatioAttr: {
          dependencyType: "attributeComponent",
          attributeName: "aspectRatio",
          variableNames: ["value"]
        },
        identicalAxisScales: {
          dependencyType: "stateVariable",
          variableName: "identicalAxisScales"
        },
        heightAttr: {
          dependencyType: "attributeComponent",
          attributeName: "height",
          variableNames: ["componentSize"]
        },

      }),
      definition({ dependencyValues }) {
        if (dependencyValues.heightAttr !== null) {
          console.warn("Height attribute of graph is deprecated and is being ignored.  Use aspectRatio attribute instead.")
        }

        let aspectRatioFromAxisScales = dependencyValues.identicalAxisScales
          && (dependencyValues.aspectRatioAttr === null
            // || !Number.isFinite(dependencyValues.aspectRatioAttr.stateValues.value)
          );

        return {
          setValue: { aspectRatioFromAxisScales },
          checkForActualChange: { aspectRatioFromAxisScales: true }
        }
      }
    }

    stateVariableDefinitions.aspectRatio = {
      public: true,
      forRenderer: true,
      defaultValue: 1,
      hasEssential: true,
      shadowingInstructions: {
        createComponentOfType: "number"
      },
      stateVariablesDeterminingDependencies: ["aspectRatioFromAxisScales"],
      returnDependencies({ stateValues }) {
        if (stateValues.aspectRatioFromAxisScales) {
          return {
            aspectRatioFromAxisScales: {
              dependencyType: "stateVariable",
              variableName: "aspectRatioFromAxisScales"
            },
            xscale: {
              dependencyType: "stateVariable",
              variableName: "xscale"
            },
            yscale: {
              dependencyType: "stateVariable",
              variableName: "yscale"
            }
          }
        } else {
          return {
            aspectRatioFromAxisScales: {
              dependencyType: "stateVariable",
              variableName: "aspectRatioFromAxisScales"
            },
            aspectRatioAttr: {
              dependencyType: "attributeComponent",
              attributeName: "aspectRatio",
              variableNames: ["value"]
            },
            width: {
              dependencyType: "stateVariable",
              variableName: "width"
            }
          }
        }
      },
      definition({ dependencyValues }) {
        if (dependencyValues.aspectRatioFromAxisScales) {
          let aspectRatio = dependencyValues.xscale / dependencyValues.yscale;
          return {
            setValue: { aspectRatio }
          }
        } else if (dependencyValues.aspectRatioAttr !== null) {
          let aspectRatio = dependencyValues.aspectRatioAttr.stateValues.value;
          if (!Number.isFinite(aspectRatio)) {
            aspectRatio = 1;
          }
          return {
            setValue: { aspectRatio }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { aspectRatio: true }
          }
        }
      }
    }

    stateVariableDefinitions.xmin = {
      stateVariablesDeterminingDependencies: ["identicalAxisScales", "aspectRatioFromAxisScales"],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
      },
      forRenderer: true,
      returnDependencies({ stateValues }) {
        let dependencies = {
          identicalAxisScales: {
            dependencyType: "stateVariable",
            variableName: "identicalAxisScales"
          },
          aspectRatioFromAxisScales: {
            dependencyType: "stateVariable",
            variableName: "aspectRatioFromAxisScales"
          },
          xminPrelim: {
            dependencyType: "stateVariable",
            variableName: "xminPrelim"
          }
        }

        if (stateValues.identicalAxisScales && !stateValues.aspectRatioFromAxisScales) {
          dependencies.xmaxPrelim = {
            dependencyType: "stateVariable",
            variableName: "xmaxPrelim"
          }
          dependencies.yminPrelim = {
            dependencyType: "stateVariable",
            variableName: "yminPrelim"
          }
          dependencies.ymaxPrelim = {
            dependencyType: "stateVariable",
            variableName: "ymaxPrelim"
          }
          dependencies.aspectRatio = {
            dependencyType: "stateVariable",
            variableName: "aspectRatio"
          }
        }
        return dependencies;
      },
      definition({ dependencyValues, usedDefault }) {
        if (!dependencyValues.identicalAxisScales || dependencyValues.aspectRatioFromAxisScales) {
          return { setValue: { xmin: dependencyValues.xminPrelim } }
        }

        let xminSpecified = !usedDefault.xminPrelim;

        // always use xmin if specified
        if (xminSpecified) {
          return { setValue: { xmin: dependencyValues.xminPrelim } }
        }

        let xmaxSpecified = !usedDefault.xmaxPrelim;
        let yminSpecified = !usedDefault.yminPrelim;
        let ymaxSpecified = !usedDefault.ymaxPrelim;

        let yscaleSpecified = yminSpecified && ymaxSpecified;

        if (yscaleSpecified) {
          let aspectRatio = dependencyValues.aspectRatio;
          let yscaleAdjusted = (dependencyValues.ymaxPrelim - dependencyValues.yminPrelim) * aspectRatio;
          if (xmaxSpecified) {
            return { setValue: { xmin: dependencyValues.xmaxPrelim - yscaleAdjusted } };
          } else {
            return { setValue: { xmin: -yscaleAdjusted / 2 } };
          }
        } else {
          if (xmaxSpecified) {
            // use the default xscale of 20
            return { setValue: { xmin: dependencyValues.xmaxPrelim - 20 } };
          } else {
            // use the default value of xmin
            return { setValue: { xmin: -10 } }
          }
        }

      },
      async inverseDefinition({ desiredStateVariableValues, stateValues }) {
        if (await stateValues.fixAxes) {
          return { success: false }
        }
        return {
          success: true,
          instructions: [{
            setDependency: "xminPrelim",
            desiredValue: desiredStateVariableValues.xmin
          }]
        }
      }
    }

    stateVariableDefinitions.xmax = {
      stateVariablesDeterminingDependencies: ["identicalAxisScales", "aspectRatioFromAxisScales"],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
      },
      forRenderer: true,
      returnDependencies({ stateValues }) {
        let dependencies = {
          identicalAxisScales: {
            dependencyType: "stateVariable",
            variableName: "identicalAxisScales"
          },
          aspectRatioFromAxisScales: {
            dependencyType: "stateVariable",
            variableName: "aspectRatioFromAxisScales"
          },
          xmaxPrelim: {
            dependencyType: "stateVariable",
            variableName: "xmaxPrelim"
          }
        }

        if (stateValues.identicalAxisScales && !stateValues.aspectRatioFromAxisScales) {
          dependencies.xminPrelim = {
            dependencyType: "stateVariable",
            variableName: "xminPrelim"
          }
          dependencies.yminPrelim = {
            dependencyType: "stateVariable",
            variableName: "yminPrelim"
          }
          dependencies.ymaxPrelim = {
            dependencyType: "stateVariable",
            variableName: "ymaxPrelim"
          }
          dependencies.aspectRatio = {
            dependencyType: "stateVariable",
            variableName: "aspectRatio"
          }
        }
        return dependencies;
      },
      definition({ dependencyValues, usedDefault }) {
        if (!dependencyValues.identicalAxisScales || dependencyValues.aspectRatioFromAxisScales) {
          return { setValue: { xmax: dependencyValues.xmaxPrelim } }
        }

        let xminSpecified = !usedDefault.xminPrelim;
        let xmaxSpecified = !usedDefault.xmaxPrelim;
        let yminSpecified = !usedDefault.yminPrelim;
        let ymaxSpecified = !usedDefault.ymaxPrelim;

        let yscaleSpecified = yminSpecified && ymaxSpecified;
        let xscaleSpecified = xminSpecified && xmaxSpecified;

        let xmin = dependencyValues.xminPrelim;

        if (yscaleSpecified) {
          let aspectRatio = dependencyValues.aspectRatio;
          let yscaleAdjusted = (dependencyValues.ymaxPrelim - dependencyValues.yminPrelim) * aspectRatio;

          if (xscaleSpecified) {
            let xscale = dependencyValues.xmaxPrelim - xmin;
            let maxScale = Math.max(xscale, yscaleAdjusted);

            return { setValue: { xmax: xmin + maxScale } };
          } else {
            if (xminSpecified) {
              return { setValue: { xmax: xmin + yscaleAdjusted } }
            } else if (xmaxSpecified) {
              return { setValue: { xmax: dependencyValues.xmaxPrelim } }
            } else {
              return { setValue: { xmax: yscaleAdjusted / 2 } };
            }

          }
        } else {
          // no yscale specified
          if (xmaxSpecified) {
            return { setValue: { xmax: dependencyValues.xmaxPrelim } }
          } else if (xminSpecified) {
            // use the default xscale of 20
            return { setValue: { xmax: xmin + 20 } }
          } else {
            // use the default xmax
            return { setValue: { xmax: 10 } }
          }
        }

      },
      async inverseDefinition({ desiredStateVariableValues, stateValues }) {
        if (await stateValues.fixAxes) {
          return { success: false }
        }
        return {
          success: true,
          instructions: [{
            setDependency: "xmaxPrelim",
            desiredValue: desiredStateVariableValues.xmax
          }]
        }
      }
    }


    stateVariableDefinitions.ymin = {
      stateVariablesDeterminingDependencies: ["identicalAxisScales", "aspectRatioFromAxisScales"],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
      },
      forRenderer: true,
      returnDependencies({ stateValues }) {
        let dependencies = {
          identicalAxisScales: {
            dependencyType: "stateVariable",
            variableName: "identicalAxisScales"
          },
          aspectRatioFromAxisScales: {
            dependencyType: "stateVariable",
            variableName: "aspectRatioFromAxisScales"
          },
          yminPrelim: {
            dependencyType: "stateVariable",
            variableName: "yminPrelim"
          }
        }

        if (stateValues.identicalAxisScales && !stateValues.aspectRatioFromAxisScales) {
          dependencies.xmaxPrelim = {
            dependencyType: "stateVariable",
            variableName: "xmaxPrelim"
          }
          dependencies.xminPrelim = {
            dependencyType: "stateVariable",
            variableName: "xminPrelim"
          }
          dependencies.ymaxPrelim = {
            dependencyType: "stateVariable",
            variableName: "ymaxPrelim"
          }
          dependencies.aspectRatio = {
            dependencyType: "stateVariable",
            variableName: "aspectRatio"
          }
        }
        return dependencies;
      },
      definition({ dependencyValues, usedDefault }) {
        if (!dependencyValues.identicalAxisScales || dependencyValues.aspectRatioFromAxisScales) {
          return { setValue: { ymin: dependencyValues.yminPrelim } }
        }

        let yminSpecified = !usedDefault.yminPrelim;

        // always use ymin if specified
        if (yminSpecified) {
          return { setValue: { ymin: dependencyValues.yminPrelim } }
        }

        let ymaxSpecified = !usedDefault.ymaxPrelim;
        let xminSpecified = !usedDefault.xminPrelim;
        let xmaxSpecified = !usedDefault.xmaxPrelim;

        let xscaleSpecified = xminSpecified && xmaxSpecified;
        let aspectRatio = dependencyValues.aspectRatio;

        if (xscaleSpecified) {
          let xscaleAdjusted = (dependencyValues.xmaxPrelim - dependencyValues.xminPrelim) / aspectRatio;
          if (ymaxSpecified) {
            return { setValue: { ymin: dependencyValues.ymaxPrelim - xscaleAdjusted } };
          } else {
            return { setValue: { ymin: -xscaleAdjusted / 2 } };
          }
        } else {
          if (ymaxSpecified) {
            // use the default xscale of 20, adjusted for aspect ratio
            return { setValue: { ymin: dependencyValues.ymaxPrelim - 20 / aspectRatio } };
          } else {
            // use the default value of ymin, adjusted for aspect ration
            return { setValue: { ymin: -10 / aspectRatio } }
          }
        }

      },
      async inverseDefinition({ desiredStateVariableValues, stateValues }) {
        if (await stateValues.fixAxes) {
          return { success: false }
        }
        return {
          success: true,
          instructions: [{
            setDependency: "yminPrelim",
            desiredValue: desiredStateVariableValues.ymin
          }]
        }
      }
    }

    stateVariableDefinitions.ymax = {
      stateVariablesDeterminingDependencies: ["identicalAxisScales", "aspectRatioFromAxisScales"],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
      },
      forRenderer: true,
      returnDependencies({ stateValues }) {
        let dependencies = {
          identicalAxisScales: {
            dependencyType: "stateVariable",
            variableName: "identicalAxisScales"
          },
          aspectRatioFromAxisScales: {
            dependencyType: "stateVariable",
            variableName: "aspectRatioFromAxisScales"
          },
          ymaxPrelim: {
            dependencyType: "stateVariable",
            variableName: "ymaxPrelim"
          }
        }

        if (stateValues.identicalAxisScales && !stateValues.aspectRatioFromAxisScales) {
          dependencies.xminPrelim = {
            dependencyType: "stateVariable",
            variableName: "xminPrelim"
          }
          dependencies.yminPrelim = {
            dependencyType: "stateVariable",
            variableName: "yminPrelim"
          }
          dependencies.xmaxPrelim = {
            dependencyType: "stateVariable",
            variableName: "xmaxPrelim"
          }
          dependencies.aspectRatio = {
            dependencyType: "stateVariable",
            variableName: "aspectRatio"
          }
        }
        return dependencies;
      },
      definition({ dependencyValues, usedDefault }) {
        if (!dependencyValues.identicalAxisScales || dependencyValues.aspectRatioFromAxisScales) {
          return { setValue: { ymax: dependencyValues.ymaxPrelim } }
        }

        let xminSpecified = !usedDefault.xminPrelim;
        let xmaxSpecified = !usedDefault.xmaxPrelim;
        let yminSpecified = !usedDefault.yminPrelim;
        let ymaxSpecified = !usedDefault.ymaxPrelim;

        let yscaleSpecified = yminSpecified && ymaxSpecified;
        let xscaleSpecified = xminSpecified && xmaxSpecified;

        let ymin = dependencyValues.yminPrelim;

        let aspectRatio = dependencyValues.aspectRatio;

        if (xscaleSpecified) {
          let xscaleAdjusted = (dependencyValues.xmaxPrelim - dependencyValues.xminPrelim) / aspectRatio;

          if (yscaleSpecified) {
            let yscale = dependencyValues.ymaxPrelim - ymin;
            let maxScale = Math.max(yscale, xscaleAdjusted);

            return { setValue: { ymax: ymin + maxScale } };
          } else {

            if (yminSpecified) {
              return { setValue: { ymax: ymin + xscaleAdjusted } }
            } else if (ymaxSpecified) {
              return { setValue: { ymax: dependencyValues.ymaxPrelim } }
            } else {
              return { setValue: { ymax: xscaleAdjusted / 2 } };
            }

          }
        } else {
          // no xscale specified
          if (ymaxSpecified) {
            return { setValue: { ymax: dependencyValues.ymaxPrelim } }
          } else if (yminSpecified) {
            // use the default yscale of 20, adjusted for aspect ratio
            return { setValue: { ymax: ymin + 20 / aspectRatio } }
          } else {
            // use the default ymax, adjusted for aspect ratio
            return { setValue: { ymax: 10 / aspectRatio } }
          }
        }


      },
      async inverseDefinition({ desiredStateVariableValues, stateValues }) {
        if (await stateValues.fixAxes) {
          return { success: false }
        }
        return {
          success: true,
          instructions: [{
            setDependency: "ymaxPrelim",
            desiredValue: desiredStateVariableValues.ymax
          }]
        }
      }
    }

    stateVariableDefinitions.xscale = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        xmin: {
          dependencyType: "stateVariable",
          variableName: "xmin"
        },
        xmax: {
          dependencyType: "stateVariable",
          variableName: "xmax"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            xscale: dependencyValues.xmax - dependencyValues.xmin
          }
        }
      }
    }

    stateVariableDefinitions.yscale = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        ymin: {
          dependencyType: "stateVariable",
          variableName: "ymin"
        },
        ymax: {
          dependencyType: "stateVariable",
          variableName: "ymax"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            yscale: dependencyValues.ymax - dependencyValues.ymin
          }
        }
      }
    }

    stateVariableDefinitions.gridAttrCompName = {
      returnDependencies: () => ({
        gridAttr: {
          dependencyType: "attributeComponent",
          attributeName: "grid",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.gridAttr) {
          return { setValue: { gridAttrCompName: dependencyValues.gridAttr.componentName } }
        } else {
          return { setValue: { gridAttrCompName: null } }
        }
      }
    }

    stateVariableDefinitions.gridAttrCompChildren = {
      stateVariablesDeterminingDependencies: ["gridAttrCompName"],
      returnDependencies: ({ stateValues }) => {
        if (stateValues.gridAttrCompName) {
          return {
            gridAttrCompChildren: {
              dependencyType: "child",
              parentName: stateValues.gridAttrCompName,
              childGroups: ["textLike"],
              variableNames: ["value"]
            }
          }
        } else {
          return {}
        }
      },
      definition({ dependencyValues }) {
        if (dependencyValues.gridAttrCompChildren) {
          return { setValue: { gridAttrCompChildren: dependencyValues.gridAttrCompChildren } }
        } else {
          return { setValue: { gridAttrCompChildren: null } }
        }
      }
    }

    stateVariableDefinitions.grid = {
      public: true,
      shadowingInstructions: {
        hasVariableComponentType: true,
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
      },
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["gridAttrCompChildren"],
      returnDependencies({ stateValues }) {
        if (stateValues.gridAttrCompChildren) {
          let dependencies = {
            gridAttrCompChildren: {
              dependencyType: "stateVariable",
              variableName: "gridAttrCompChildren"
            },
            gridAttr: {
              dependencyType: "attributeComponent",
              attributeName: "grid",
              variableNames: ["value"]
            },

          }

          for (let [ind, child] of stateValues.gridAttrCompChildren.entries()) {
            dependencies["childAdapter" + ind] = {
              dependencyType: "adapterSourceStateVariable",
              componentName: child.componentName,
              variableName: "value"
            }
          }

          return dependencies;
        } else {
          return {};
        }
      },
      definition({ dependencyValues }) {
        if (!dependencyValues.gridAttrCompChildren) {
          return {
            setValue: { grid: "none" },
            setCreateComponentOfType: { grid: "text" },
          }
        }

        let grid = dependencyValues.gridAttr.stateValues.value.toLowerCase().trim();
        if (grid === "true") {
          grid = "medium";
        } else if (grid === "false") {
          grid = "none"
        }
        if (["medium", "dense", "none"].includes(grid)) {
          return {
            setValue: { grid },
            setCreateComponentOfType: { grid: "text" },
          }
        }

        // group the children separated by spaces contained in string children

        let groupedChildren = [];
        let pieces = [];

        for (let child of dependencyValues.gridAttrCompChildren) {
          if (typeof child !== "string") {
            pieces.push(child);
          } else {

            let stringPieces = child.split(/\s+/);
            let s0 = stringPieces[0];

            if (s0 === '') {
              // started with a space
              if (pieces.length > 0) {
                groupedChildren.push(pieces);
                pieces = [];
              }
            } else {
              pieces.push(s0)
            }

            for (let s of stringPieces.slice(1)) {
              // if have more than one piece, must have had a space in between pieces
              if (pieces.length > 0) {
                groupedChildren.push(pieces);
                pieces = [];
              }
              if (s !== "") {
                pieces.push(s)
              }

            }

          }
        }

        if (pieces.length > 0) {
          groupedChildren.push(pieces);
        }

        if (groupedChildren.length < 2) {
          // if don't have at least two pieces separated by spaces, it isn't valid
          return {
            setValue: { grid: "none" },
            setCreateComponentOfType: { grid: "text" },
          }
        }


        grid = [];


        for (let group of groupedChildren) {
          // each of the two grouped children must represent a positive number
          if (group.length === 1) {
            let child = group[0];
            if (typeof child === "string") {
              let num = me.fromText(child).evaluate_to_constant();
              if (num > 0) {
                grid.push(num)
              } else {
                return {
                  setValue: { grid: "none" },
                  setCreateComponentOfType: { grid: "text" },
                }
              }
            } else {
              // have a single non-string child.  See if it was adapted from number/math
              let childInd = dependencyValues.gridAttrCompChildren.indexOf(child);

              let num = dependencyValues["childAdapter" + childInd];
              if (num instanceof me.class) {
                num = num.evaluate_to_constant();
              }

              if (num > 0) {
                grid.push(num)
              } else {
                return {
                  setValue: { grid: "none" },
                  setCreateComponentOfType: { grid: "text" },
                }
              }

            }

          } else {
            // have a group of multiple children
            // multiply them together
            let num = 1;
            for (let piece of group) {
              if (typeof piece === "string") {
                // Note: OK if null is converted to zero, as product will be rejected
                num *= me.fromText(piece).evaluate_to_constant();
              } else {
                let childInd = dependencyValues.gridAttrCompChildren.indexOf(piece);

                let factor = dependencyValues["childAdapter" + childInd];
                if (factor instanceof me.class) {
                  factor = factor.evaluate_to_constant();
                }
                // Note: OK if null is converted to zero, as product will be rejected
                num *= factor;
              }
            }

            if (num > 0) {
              grid.push(num)
            } else {
              return {
                setValue: { grid: "none" },
                setCreateComponentOfType: { grid: "text" },
              }
            }

          }
        }

        return {
          setValue: { grid },
          setCreateComponentOfType: { grid: "numberList" },
        }

      }
    }

    return stateVariableDefinitions;
  }

  async changeAxisLimits({ xmin, xmax, ymin, ymax, actionId }) {

    let updateInstructions = [];

    if (xmin !== undefined) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "xmin",
        value: xmin
      })
    }
    if (xmax !== undefined) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "xmax",
        value: xmax
      })
    }
    if (ymin !== undefined) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "ymin",
        value: ymin
      })
    }
    if (ymax !== undefined) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "ymax",
        value: ymax
      })
    }

    return await this.coreFunctions.performUpdate({
      updateInstructions,
      actionId,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          xmin, xmax, ymin, ymax
        }
      }
    });

  }

  async addChildren({ serializedComponents, actionId }) {

    if (serializedComponents && serializedComponents.length > 0) {

      let processResult = processAssignNames({
        serializedComponents,
        parentName: this.componentName,
        parentCreatesNewNamespace: this.attributes.newNamespace?.primitive,
        componentInfoObjects: this.componentInfoObjects,
        indOffset: await this.stateValues.nChildrenAdded
      });

      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "addComponents",
          serializedComponents: processResult.serializedComponents,
          parentName: this.componentName,
          assignNamesOffset: await this.stateValues.nChildrenAdded,
        }, {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "nChildrenAdded",
          value: await this.stateValues.nChildrenAdded + processResult.serializedComponents.length,
        }],
        actionId,
      });
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  async deleteChildren({ number, actionId }) {

    let numberToDelete = Math.min(number, await this.stateValues.nChildrenAdded);

    if (numberToDelete > 0) {
      let nChildren = this.definingChildren.length;
      let componentNamesToDelete = this.definingChildren
        .slice(nChildren - numberToDelete, nChildren)
        .map(x => x.componentName);

      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "deleteComponents",
          componentNames: componentNamesToDelete
        }, {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "nChildrenAdded",
          value: await this.stateValues.nChildrenAdded - numberToDelete,
        }],
        actionId
      });

    } else {
      this.coreFunctions.resolveAction({ actionId });
    }

  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible }
    })
    this.coreFunctions.resolveAction({ actionId });
  }

  actions = {
    changeAxisLimits: this.changeAxisLimits.bind(this),
    addChildren: this.addChildren.bind(this),
    deleteChildren: this.deleteChildren.bind(this),
    recordVisibilityChange: this.recordVisibilityChange.bind(this),
  };

}
