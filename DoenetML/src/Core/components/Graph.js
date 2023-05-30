import { processAssignNames } from "../utils/serializedStateProcessing";
import BlockComponent from "./abstract/BlockComponent";
import me from "math-expressions";
import {
  orderedPercentWidthMidpoints,
  orderedWidthMidpoints,
  widthsBySize,
  sizePossibilities,
} from "../utils/size";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
export default class Graph extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      changeAxisLimits: this.changeAxisLimits.bind(this),
      addChildren: this.addChildren.bind(this),
      deleteChildren: this.deleteChildren.bind(this),
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
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
    };
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
    };

    attributes.horizontalAlign = {
      createComponentOfType: "text",
      createStateVariable: "horizontalAlign",
      validValues: ["center", "left", "right"],
      defaultValue: "center",
      forRenderer: true,
      public: true,
    };

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
    attributes.xlabelPosition = {
      createComponentOfType: "text",
      createStateVariable: "xlabelPosition",
      defaultValue: "right",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["right", "left"],
    };
    attributes.xTickScaleFactor = {
      createComponentOfType: "math",
      createStateVariable: "xTickScaleFactor",
      defaultValue: null,
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
    attributes.yTickScaleFactor = {
      createComponentOfType: "math",
      createStateVariable: "yTickScaleFactor",
      defaultValue: null,
      public: true,
      forRenderer: true,
    };
    attributes.showNavigation = {
      createComponentOfType: "boolean",
      createStateVariable: "showNavigation",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };
    attributes.fixAxes = {
      createComponentOfType: "boolean",
      createStateVariable: "fixAxes",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };
    attributes.grid = {
      createComponentOfType: "text",
    };

    Object.assign(attributes, returnRoundingAttributes());

    attributes.showBorder = {
      createComponentOfType: "boolean",
      createStateVariable: "showBorder",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    attributes.hideOffGraphIndicators = {
      createComponentOfType: "boolean",
      createStateVariable: "hideOffGraphIndicators",
      defaultValue: false,
      public: true,
    };

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "xlabels",
        componentTypes: ["xlabel"],
      },
      {
        group: "ylabels",
        componentTypes: ["ylabel"],
      },
      {
        group: "graphical",
        componentTypes: [
          "_graphical",
          "image",
          "text",
          "math",
          "m",
          "md",
          "label",
          "number",
          "updateValue",
          "callAction",
          "triggerSet",
          "booleanInput",
          "textInput",
        ],
      },
      {
        group: "graphs",
        componentTypes: ["graph"],
      },
      {
        group: "childrenThatShouldNotBeHere",
        componentTypes: ["_base"],
        matchAfterAdapters: true,
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    Object.assign(
      stateVariableDefinitions,
      returnRoundingStateVariableDefinitions(),
    );

    stateVariableDefinitions.xlabel = {
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "label",
        addStateVariablesShadowingStateVariables: {
          hasLatex: {
            stateVariableToShadow: "xlabelHasLatex",
          },
        },
      },
      hasEssential: true,
      defaultValue: "",
      additionalStateVariablesDefined: [
        {
          variableName: "xlabelHasLatex",
          forRenderer: true,
        },
      ],
      returnDependencies: () => ({
        xlabelChild: {
          dependencyType: "child",
          childGroups: ["xlabels"],
          variableNames: ["value", "hasLatex"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.xlabelChild.length > 0) {
          let xlabelChild =
            dependencyValues.xlabelChild[
              dependencyValues.xlabelChild.length - 1
            ];
          return {
            setValue: {
              xlabel: xlabelChild.stateValues.value,
              xlabelHasLatex: xlabelChild.stateValues.hasLatex,
            },
          };
        } else {
          return {
            useEssentialOrDefaultValue: { xlabel: true },
            setValue: { xlabelHasLatex: false },
          };
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (typeof desiredStateVariableValues.xlabel !== "string") {
          return { success: false };
        }

        if (dependencyValues.xlabelChild.length > 0) {
          let lastLabelInd = dependencyValues.xlabelChild.length - 1;
          return {
            success: true,
            instructions: [
              {
                setDependency: "xlabelChild",
                desiredValue: desiredStateVariableValues.xlabel,
                childIndex: lastLabelInd,
                variableIndex: 0,
              },
            ],
          };
        } else {
          return {
            success: true,
            instructions: [
              {
                setEssentialValue: "xlabel",
                value: desiredStateVariableValues.xlabel,
              },
            ],
          };
        }
      },
    };

    stateVariableDefinitions.ylabel = {
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "label",
        addStateVariablesShadowingStateVariables: {
          hasLatex: {
            stateVariableToShadow: "ylabelHasLatex",
          },
        },
      },
      hasEssential: true,
      defaultValue: "",
      additionalStateVariablesDefined: [
        {
          variableName: "ylabelHasLatex",
          forRenderer: true,
        },
      ],
      returnDependencies: () => ({
        ylabelChild: {
          dependencyType: "child",
          childGroups: ["ylabels"],
          variableNames: ["value", "hasLatex"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.ylabelChild.length > 0) {
          let ylabelChild =
            dependencyValues.ylabelChild[
              dependencyValues.ylabelChild.length - 1
            ];
          return {
            setValue: {
              ylabel: ylabelChild.stateValues.value,
              ylabelHasLatex: ylabelChild.stateValues.hasLatex,
            },
          };
        } else {
          return {
            useEssentialOrDefaultValue: { ylabel: true },
            setValue: { ylabelHasLatex: false },
          };
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (typeof desiredStateVariableValues.ylabel !== "string") {
          return { success: false };
        }

        if (dependencyValues.ylabelChild.length > 0) {
          let lastLabelInd = dependencyValues.ylabelChild.length - 1;
          return {
            success: true,
            instructions: [
              {
                setDependency: "ylabelChild",
                desiredValue: desiredStateVariableValues.ylabel,
                childIndex: lastLabelInd,
                variableIndex: 0,
              },
            ],
          };
        } else {
          return {
            success: true,
            instructions: [
              {
                setEssentialValue: "ylabel",
                value: desiredStateVariableValues.ylabel,
              },
            ],
          };
        }
      },
    };

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
            graphicalDescendants: dependencyValues.graphicalDescendants,
          },
        };
      },
    };

    stateVariableDefinitions.childIndicesToRender = {
      returnDependencies: () => ({
        graphicalOrGraphChildren: {
          dependencyType: "child",
          childGroups: ["graphical", "graphs"],
        },
        allChildren: {
          dependencyType: "child",
          childGroups: [
            "graphical",
            "xlabels",
            "ylabels",
            "graphs",
            "childrenThatShouldNotBeHere",
          ],
        },
      }),
      definition({ dependencyValues }) {
        let childIndicesToRender = [];

        let graphicalChildNames = dependencyValues.graphicalOrGraphChildren.map(
          (x) => x.componentName,
        );

        for (let [ind, child] of dependencyValues.allChildren.entries()) {
          if (graphicalChildNames.includes(child.componentName)) {
            childIndicesToRender.push(ind);
          }
        }

        return { setValue: { childIndicesToRender } };
      },
    };

    stateVariableDefinitions.numChildrenAdded = {
      defaultValue: 0,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: { numChildrenAdded: true },
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "numChildrenAdded",
              value: desiredStateVariableValues.numChildrenAdded,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.size = {
      public: true,
      defaultValue: "medium",
      hasEssential: true,
      shadowingInstructions: {
        createComponentOfType: "text",
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
        const defaultSize = "medium";

        if (dependencyValues.sizeAttr) {
          let size = dependencyValues.sizeAttr.stateValues.value.toLowerCase();

          if (!sizePossibilities.includes(size)) {
            size = defaultSize;
          }
          return {
            setValue: { size },
          };
        } else if (dependencyValues.widthAttr) {
          let componentSize =
            dependencyValues.widthAttr.stateValues.componentSize;
          if (componentSize === null) {
            return {
              setValue: { size: defaultSize },
            };
          }
          let { isAbsolute, size: widthSize } = componentSize;
          let size;

          if (isAbsolute) {
            for (let [ind, pixels] of orderedWidthMidpoints.entries()) {
              if (widthSize <= pixels) {
                size = sizePossibilities[ind];
                break;
              }
            }
            if (!size) {
              size = defaultSize;
            }
          } else {
            for (let [ind, percent] of orderedPercentWidthMidpoints.entries()) {
              if (widthSize <= percent) {
                size = sizePossibilities[ind];
                break;
              }
            }
            if (!size) {
              size = defaultSize;
            }
          }
          return {
            setValue: { size },
          };
        } else {
          return {
            useEssentialOrDefaultValue: { size: true },
          };
        }
      },
    };

    stateVariableDefinitions.width = {
      public: true,
      forRenderer: true,
      shadowingInstructions: {
        createComponentOfType: "_componentSize",
      },
      returnDependencies: () => ({
        size: {
          dependencyType: "stateVariable",
          variableName: "size",
        },
      }),
      definition({ dependencyValues }) {
        let width = {
          isAbsolute: true,
          size: widthsBySize[dependencyValues.size],
        };

        return {
          setValue: { width },
        };
      },
    };

    stateVariableDefinitions.aspectRatioFromAxisScales = {
      returnDependencies: () => ({
        aspectRatioAttr: {
          dependencyType: "attributeComponent",
          attributeName: "aspectRatio",
          variableNames: ["value"],
        },
        identicalAxisScales: {
          dependencyType: "stateVariable",
          variableName: "identicalAxisScales",
        },
        heightAttr: {
          dependencyType: "attributeComponent",
          attributeName: "height",
          variableNames: ["componentSize"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.heightAttr !== null) {
          console.warn(
            "Height attribute of graph is deprecated and is being ignored.  Use aspectRatio attribute instead.",
          );
        }

        let aspectRatioFromAxisScales =
          dependencyValues.identicalAxisScales &&
          dependencyValues.aspectRatioAttr === null;
        // || !Number.isFinite(dependencyValues.aspectRatioAttr.stateValues.value)

        return {
          setValue: { aspectRatioFromAxisScales },
          checkForActualChange: { aspectRatioFromAxisScales: true },
        };
      },
    };

    stateVariableDefinitions.aspectRatio = {
      public: true,
      forRenderer: true,
      defaultValue: 1,
      hasEssential: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      stateVariablesDeterminingDependencies: ["aspectRatioFromAxisScales"],
      returnDependencies({ stateValues }) {
        if (stateValues.aspectRatioFromAxisScales) {
          return {
            aspectRatioFromAxisScales: {
              dependencyType: "stateVariable",
              variableName: "aspectRatioFromAxisScales",
            },
            xscale: {
              dependencyType: "stateVariable",
              variableName: "xscale",
            },
            yscale: {
              dependencyType: "stateVariable",
              variableName: "yscale",
            },
          };
        } else {
          return {
            aspectRatioFromAxisScales: {
              dependencyType: "stateVariable",
              variableName: "aspectRatioFromAxisScales",
            },
            aspectRatioAttr: {
              dependencyType: "attributeComponent",
              attributeName: "aspectRatio",
              variableNames: ["value"],
            },
            width: {
              dependencyType: "stateVariable",
              variableName: "width",
            },
          };
        }
      },
      definition({ dependencyValues }) {
        if (dependencyValues.aspectRatioFromAxisScales) {
          let aspectRatio = dependencyValues.xscale / dependencyValues.yscale;
          return {
            setValue: { aspectRatio },
          };
        } else if (dependencyValues.aspectRatioAttr !== null) {
          let aspectRatio = dependencyValues.aspectRatioAttr.stateValues.value;
          if (!Number.isFinite(aspectRatio)) {
            aspectRatio = 1;
          }
          return {
            setValue: { aspectRatio },
          };
        } else {
          return {
            useEssentialOrDefaultValue: { aspectRatio: true },
          };
        }
      },
    };

    stateVariableDefinitions.haveGraphParent = {
      forRenderer: true,
      returnDependencies: () => ({
        graphParent: {
          dependencyType: "parentIdentity",
          parentComponentType: "graph",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { haveGraphParent: dependencyValues.graphParent !== null },
        };
      },
    };

    stateVariableDefinitions.xmin = {
      stateVariablesDeterminingDependencies: [
        "identicalAxisScales",
        "aspectRatioFromAxisScales",
      ],
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
          aspectRatioFromAxisScales: {
            dependencyType: "stateVariable",
            variableName: "aspectRatioFromAxisScales",
          },
          xminPrelim: {
            dependencyType: "stateVariable",
            variableName: "xminPrelim",
          },
          graphParentXmin: {
            dependencyType: "parentStateVariable",
            parentComponentType: "graph",
            variableName: "xmin",
          },
        };

        if (
          stateValues.identicalAxisScales &&
          !stateValues.aspectRatioFromAxisScales
        ) {
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
          dependencies.aspectRatio = {
            dependencyType: "stateVariable",
            variableName: "aspectRatio",
          };
        }
        return dependencies;
      },
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.graphParentXmin !== null) {
          return { setValue: { xmin: dependencyValues.graphParentXmin } };
        }
        if (
          !dependencyValues.identicalAxisScales ||
          dependencyValues.aspectRatioFromAxisScales
        ) {
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
          let aspectRatio = dependencyValues.aspectRatio;
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
      markStale: () => ({ updateDescendantRenderers: true }),
      async inverseDefinition({
        desiredStateVariableValues,
        dependencyValues,
        stateValues,
      }) {
        if (dependencyValues.graphParentXmin !== null) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "graphParentXmin",
                desiredValue: desiredStateVariableValues.xmin,
              },
            ],
          };
        }
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
      stateVariablesDeterminingDependencies: [
        "identicalAxisScales",
        "aspectRatioFromAxisScales",
      ],
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
          aspectRatioFromAxisScales: {
            dependencyType: "stateVariable",
            variableName: "aspectRatioFromAxisScales",
          },
          xmaxPrelim: {
            dependencyType: "stateVariable",
            variableName: "xmaxPrelim",
          },
          graphParentXmax: {
            dependencyType: "parentStateVariable",
            parentComponentType: "graph",
            variableName: "xmax",
          },
        };

        if (
          stateValues.identicalAxisScales &&
          !stateValues.aspectRatioFromAxisScales
        ) {
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
          dependencies.aspectRatio = {
            dependencyType: "stateVariable",
            variableName: "aspectRatio",
          };
        }
        return dependencies;
      },
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.graphParentXmax !== null) {
          return { setValue: { xmax: dependencyValues.graphParentXmax } };
        }
        if (
          !dependencyValues.identicalAxisScales ||
          dependencyValues.aspectRatioFromAxisScales
        ) {
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
          let aspectRatio = dependencyValues.aspectRatio;
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
      markStale: () => ({ updateDescendantRenderers: true }),
      async inverseDefinition({
        desiredStateVariableValues,
        dependencyValues,
        stateValues,
      }) {
        if (dependencyValues.graphParentXmax !== null) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "graphParentXmax",
                desiredValue: desiredStateVariableValues.xmax,
              },
            ],
          };
        }
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
      stateVariablesDeterminingDependencies: [
        "identicalAxisScales",
        "aspectRatioFromAxisScales",
      ],
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
          aspectRatioFromAxisScales: {
            dependencyType: "stateVariable",
            variableName: "aspectRatioFromAxisScales",
          },
          yminPrelim: {
            dependencyType: "stateVariable",
            variableName: "yminPrelim",
          },
          graphParentYmin: {
            dependencyType: "parentStateVariable",
            parentComponentType: "graph",
            variableName: "ymin",
          },
        };

        if (
          stateValues.identicalAxisScales &&
          !stateValues.aspectRatioFromAxisScales
        ) {
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
          dependencies.aspectRatio = {
            dependencyType: "stateVariable",
            variableName: "aspectRatio",
          };
        }
        return dependencies;
      },
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.graphParentYmin !== null) {
          return { setValue: { ymin: dependencyValues.graphParentYmin } };
        }
        if (
          !dependencyValues.identicalAxisScales ||
          dependencyValues.aspectRatioFromAxisScales
        ) {
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
        let aspectRatio = dependencyValues.aspectRatio;

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
      markStale: () => ({ updateDescendantRenderers: true }),
      async inverseDefinition({
        desiredStateVariableValues,
        dependencyValues,
        stateValues,
      }) {
        if (dependencyValues.graphParentYmin !== null) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "graphParentYmin",
                desiredValue: desiredStateVariableValues.ymin,
              },
            ],
          };
        }
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
      stateVariablesDeterminingDependencies: [
        "identicalAxisScales",
        "aspectRatioFromAxisScales",
      ],
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
          aspectRatioFromAxisScales: {
            dependencyType: "stateVariable",
            variableName: "aspectRatioFromAxisScales",
          },
          ymaxPrelim: {
            dependencyType: "stateVariable",
            variableName: "ymaxPrelim",
          },
          graphParentYmax: {
            dependencyType: "parentStateVariable",
            parentComponentType: "graph",
            variableName: "ymax",
          },
        };

        if (
          stateValues.identicalAxisScales &&
          !stateValues.aspectRatioFromAxisScales
        ) {
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
          dependencies.aspectRatio = {
            dependencyType: "stateVariable",
            variableName: "aspectRatio",
          };
        }
        return dependencies;
      },
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.graphParentYmax !== null) {
          return { setValue: { ymax: dependencyValues.graphParentYmax } };
        }
        if (
          !dependencyValues.identicalAxisScales ||
          dependencyValues.aspectRatioFromAxisScales
        ) {
          return { setValue: { ymax: dependencyValues.ymaxPrelim } };
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
      markStale: () => ({ updateDescendantRenderers: true }),
      async inverseDefinition({
        desiredStateVariableValues,
        dependencyValues,
        stateValues,
      }) {
        if (dependencyValues.graphParentYmax !== null) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "graphParentYmax",
                desiredValue: desiredStateVariableValues.ymax,
              },
            ],
          };
        }
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

    stateVariableDefinitions.gridAttrCompName = {
      returnDependencies: () => ({
        gridAttr: {
          dependencyType: "attributeComponent",
          attributeName: "grid",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.gridAttr) {
          return {
            setValue: {
              gridAttrCompName: dependencyValues.gridAttr.componentName,
            },
          };
        } else {
          return { setValue: { gridAttrCompName: null } };
        }
      },
    };

    stateVariableDefinitions.gridAttrCompChildren = {
      stateVariablesDeterminingDependencies: ["gridAttrCompName"],
      returnDependencies: ({ stateValues }) => {
        if (stateValues.gridAttrCompName) {
          return {
            gridAttrCompChildren: {
              dependencyType: "child",
              parentName: stateValues.gridAttrCompName,
              childGroups: ["textLike"],
              variableNames: ["value"],
            },
          };
        } else {
          return {};
        }
      },
      definition({ dependencyValues }) {
        if (dependencyValues.gridAttrCompChildren) {
          return {
            setValue: {
              gridAttrCompChildren: dependencyValues.gridAttrCompChildren,
            },
          };
        } else {
          return { setValue: { gridAttrCompChildren: null } };
        }
      },
    };

    stateVariableDefinitions.grid = {
      public: true,
      shadowingInstructions: {
        hasVariableComponentType: true,
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["gridAttrCompChildren"],
      returnDependencies({ stateValues }) {
        if (stateValues.gridAttrCompChildren) {
          let dependencies = {
            gridAttrCompChildren: {
              dependencyType: "stateVariable",
              variableName: "gridAttrCompChildren",
            },
            gridAttr: {
              dependencyType: "attributeComponent",
              attributeName: "grid",
              variableNames: ["value"],
            },
          };

          for (let [ind, child] of stateValues.gridAttrCompChildren.entries()) {
            dependencies["childAdapter" + ind] = {
              dependencyType: "adapterSourceStateVariable",
              componentName: child.componentName,
              variableName: "value",
            };
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
          };
        }

        let grid = dependencyValues.gridAttr.stateValues.value
          .toLowerCase()
          .trim();
        if (grid === "true") {
          grid = "medium";
        } else if (grid === "false") {
          grid = "none";
        }
        if (["medium", "dense", "none"].includes(grid)) {
          return {
            setValue: { grid },
            setCreateComponentOfType: { grid: "text" },
          };
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

            if (s0 === "") {
              // started with a space
              if (pieces.length > 0) {
                groupedChildren.push(pieces);
                pieces = [];
              }
            } else {
              pieces.push(s0);
            }

            for (let s of stringPieces.slice(1)) {
              // if have more than one piece, must have had a space in between pieces
              if (pieces.length > 0) {
                groupedChildren.push(pieces);
                pieces = [];
              }
              if (s !== "") {
                pieces.push(s);
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
          };
        }

        grid = [];

        for (let group of groupedChildren) {
          // each of the two grouped children must represent a positive number
          if (group.length === 1) {
            let child = group[0];
            if (typeof child === "string") {
              let num = me.fromText(child).evaluate_to_constant();
              if (num > 0) {
                grid.push(num);
              } else {
                return {
                  setValue: { grid: "none" },
                  setCreateComponentOfType: { grid: "text" },
                };
              }
            } else {
              // have a single non-string child.  See if it was adapted from number/math
              let childInd =
                dependencyValues.gridAttrCompChildren.indexOf(child);

              let num = dependencyValues["childAdapter" + childInd];
              if (num instanceof me.class) {
                num = num.evaluate_to_constant();
              }

              if (num > 0) {
                grid.push(num);
              } else {
                return {
                  setValue: { grid: "none" },
                  setCreateComponentOfType: { grid: "text" },
                };
              }
            }
          } else {
            // have a group of multiple children
            // multiply them together
            let num = 1;
            for (let piece of group) {
              if (typeof piece === "string") {
                num *= me.fromText(piece).evaluate_to_constant();
              } else {
                let childInd =
                  dependencyValues.gridAttrCompChildren.indexOf(piece);

                let factor = dependencyValues["childAdapter" + childInd];
                if (factor instanceof me.class) {
                  factor = factor.evaluate_to_constant();
                }
                num *= factor;
              }
            }

            if (num > 0) {
              grid.push(num);
            } else {
              return {
                setValue: { grid: "none" },
                setCreateComponentOfType: { grid: "text" },
              };
            }
          }
        }

        return {
          setValue: { grid },
          setCreateComponentOfType: { grid: "numberList" },
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

  async addChildren({
    serializedComponents,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (serializedComponents && serializedComponents.length > 0) {
      let processResult = processAssignNames({
        serializedComponents,
        parentName: this.componentName,
        parentCreatesNewNamespace: this.attributes.newNamespace?.primitive,
        componentInfoObjects: this.componentInfoObjects,
        indOffset: await this.stateValues.numChildrenAdded,
      });

      return await this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            updateType: "addComponents",
            serializedComponents: processResult.serializedComponents,
            parentName: this.componentName,
            assignNamesOffset: await this.stateValues.numChildrenAdded,
          },
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "numChildrenAdded",
            value:
              (await this.stateValues.numChildrenAdded) +
              processResult.serializedComponents.length,
          },
        ],
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  async deleteChildren({
    number,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let numberToDelete = Math.min(
      number,
      await this.stateValues.numChildrenAdded,
    );

    if (numberToDelete > 0) {
      let numChildren = this.definingChildren.length;
      let componentNamesToDelete = this.definingChildren
        .slice(numChildren - numberToDelete, numChildren)
        .map((x) => x.componentName);

      return await this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            updateType: "deleteComponents",
            componentNames: componentNamesToDelete,
          },
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "numChildrenAdded",
            value: (await this.stateValues.numChildrenAdded) - numberToDelete,
          },
        ],
        actionId,
        sourceInformation,
        skipRendererUpdate,
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
      result: { isVisible },
    });
    this.coreFunctions.resolveAction({ actionId });
  }
}
