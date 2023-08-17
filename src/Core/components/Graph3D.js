import { processAssignNames } from "../utils/serializedStateProcessing";
import BlockComponent from "./abstract/BlockComponent";
import me from "math-expressions";
import { sizePossibilities } from "../utils/size";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
export default class Graph3D extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      changeAxisLimits: this.changeAxisLimits.bind(this),
      addChildren: this.addChildren.bind(this),
      deleteChildren: this.deleteChildren.bind(this),
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "graph3d";
  static renderChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.xmin = {
      createComponentOfType: "number",
      createStateVariable: "xmin",
      defaultValue: -10,
      forRenderer: true,
      public: true,
    };
    attributes.xmax = {
      createComponentOfType: "number",
      createStateVariable: "xmax",
      defaultValue: 10,
      forRenderer: true,
      public: true,
    };
    attributes.ymin = {
      createComponentOfType: "number",
      createStateVariable: "ymin",
      defaultValue: -10,
      forRenderer: true,
      public: true,
    };
    attributes.ymax = {
      createComponentOfType: "number",
      createStateVariable: "ymax",
      defaultValue: 10,
      forRenderer: true,
      public: true,
    };
    attributes.zmin = {
      createComponentOfType: "number",
      createStateVariable: "zmin",
      defaultValue: -10,
      forRenderer: true,
      public: true,
    };
    attributes.zmax = {
      createComponentOfType: "number",
      createStateVariable: "zmax",
      defaultValue: 10,
      forRenderer: true,
      public: true,
    };
    attributes.size = {
      createComponentOfType: "text",
      createStateVariable: "size",
      defaultValue: "medium",
      toLowerCase: true,
      validValues: sizePossibilities,
      forRenderer: true,
      public: true,
    };
    attributes.aspectRatio = {
      createComponentOfType: "number",
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
    attributes.displayZAxis = {
      createComponentOfType: "boolean",
      createStateVariable: "displayZAxis",
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
    attributes.displayZAxisTickLabels = {
      createComponentOfType: "boolean",
      createStateVariable: "displayZAxisTickLabels",
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
    attributes.zlabelAlignment = {
      createComponentOfType: "text",
      createStateVariable: "zlabelAlignment",
      defaultValue: "left",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["left", "right"],
    };
    attributes.zTickScaleFactor = {
      createComponentOfType: "math",
      createStateVariable: "zTickScaleFactor",
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

    Object.assign(attributes, returnRoundingAttributes());

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
        group: "zlabels",
        componentTypes: ["zlabel"],
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
        componentTypes: ["graph3d"],
      },
      {
        group: "childrenThatShouldNotBeHere",
        componentTypes: ["_base"],
        matchAfterAdapters: true,
        excludeFromSchema: true,
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

    stateVariableDefinitions.zlabel = {
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "label",
        addStateVariablesShadowingStateVariables: {
          hasLatex: {
            stateVariableToShadow: "zlabelHasLatex",
          },
        },
      },
      hasEssential: true,
      defaultValue: "",
      additionalStateVariablesDefined: [
        {
          variableName: "zlabelHasLatex",
          forRenderer: true,
        },
      ],
      returnDependencies: () => ({
        zlabelChild: {
          dependencyType: "child",
          childGroups: ["zlabels"],
          variableNames: ["value", "hasLatex"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.zlabelChild.length > 0) {
          let zlabelChild =
            dependencyValues.zlabelChild[
              dependencyValues.zlabelChild.length - 1
            ];
          return {
            setValue: {
              zlabel: zlabelChild.stateValues.value,
              zlabelHasLatex: zlabelChild.stateValues.hasLatex,
            },
          };
        } else {
          return {
            useEssentialOrDefaultValue: { zlabel: true },
            setValue: { zlabelHasLatex: false },
          };
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (typeof desiredStateVariableValues.zlabel !== "string") {
          return { success: false };
        }

        if (dependencyValues.zlabelChild.length > 0) {
          let lastLabelInd = dependencyValues.zlabelChild.length - 1;
          return {
            success: true,
            instructions: [
              {
                setDependency: "zlabelChild",
                desiredValue: desiredStateVariableValues.zlabel,
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
                setEssentialValue: "zlabel",
                value: desiredStateVariableValues.zlabel,
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
    zmin,
    zmax,
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
    if (zmin !== undefined) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "zmin",
        value: zmin,
      });
    }
    if (zmax !== undefined) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "zmax",
        value: zmax,
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
          zmin,
          zmax,
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
    }
  }

  recordVisibilityChange({ isVisible }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible },
    });
  }
}
