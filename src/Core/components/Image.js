import BlockComponent from './abstract/BlockComponent';
import { orderedPercentWidthMidpoints, orderedWidthMidpoints, widthsBySize, sizePossibilities, widthFractions, percentWidthsBySize } from '../utils/size';
import me from 'math-expressions';
import { returnSelectedStyleStateVariableDefinition } from '../utils/style';

export default class Image extends BlockComponent {
  static componentType = "image";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.width = {
      createComponentOfType: "_componentSize",
      createStateVariable: "specifiedWidth",
      defaultValue: null,
    };
    attributes.size = {
      createComponentOfType: "text",
      createStateVariable: "specifiedSize",
      defaultValue: "medium",
      toLowerCase: true,
      validValues: sizePossibilities,
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
      toLowerCase: true,
      validValues: ["center", "left", "right"],
      defaultValue: "center",
      forRenderer: true,
      public: true,
    }
    attributes.description = {
      createComponentOfType: "text",
      createStateVariable: "description",
      defaultValue: "",
      public: true,
      forRenderer: true
    };
    attributes.source = {
      createComponentOfType: "text",
      createStateVariable: "source",
      defaultValue: "",
      public: true,
      forRenderer: true,
    };
    attributes.asFileName = {
      createComponentOfType: "text",
      createStateVariable: "asFileName",
      defaultValue: null,
      public: true,
      forRenderer: true,
    };
    attributes.mimeType = {
      createComponentOfType: "text",
      createStateVariable: "mimeType",
      defaultValue: null,
      public: true,
      forRenderer: true,
    };

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true
    };

    attributes.layer = {
      createComponentOfType: "number",
      createStateVariable: "layer",
      defaultValue: 0,
      public: true,
      forRenderer: true
    };

    attributes.anchor = {
      createComponentOfType: "point",
    }

    attributes.positionFromAnchor = {
      createComponentOfType: "text",
      createStateVariable: "positionFromAnchor",
      defaultValue: "center",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["upperright", "upperleft", "lowerright", "lowerleft", "top", "bottom", "left", "right", "center"]
    }

    attributes.rotate = {
      createComponentOfType: "number",
      createStateVariable: "rotate",
      defaultValue: 0,
      public: true,
      forRenderer: true,
    }

    attributes.styleNumber.defaultValue = 0;

    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let selectedStyleDefinition = returnSelectedStyleStateVariableDefinition();

    Object.assign(stateVariableDefinitions, selectedStyleDefinition);


    stateVariableDefinitions.size = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text"
      },
      returnDependencies: () => ({
        specifiedSize: {
          dependencyType: "stateVariable",
          variableName: "specifiedSize"
        },
        specifiedWidth: {
          dependencyType: "stateVariable",
          variableName: "specifiedWidth"
        },
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["xscale"]
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        const defaultSize = 'medium';

        if (!usedDefault.specifiedSize) {
          return {
            setValue: { size: dependencyValues.specifiedSize }
          }
        } else if (!usedDefault.specifiedWidth) {

          let componentSize = dependencyValues.specifiedWidth;
          if (componentSize === null) {
            return {
              setValue: { size: defaultSize }
            }
          }

          let { isAbsolute, size: widthSize } = componentSize;
          let size;

          if (isAbsolute) {
            let midpoints;

            if (dependencyValues.graphAncestor) {
              let xscale = dependencyValues.graphAncestor.stateValues.xscale;
              midpoints = orderedPercentWidthMidpoints.map(x => x / 100 * xscale)
            } else {
              midpoints = orderedWidthMidpoints
            }

            for (let [ind, pixels] of midpoints.entries()) {
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
            setValue: { size: defaultSize }
          }
        }
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setDependency: "specifiedSize",
            desiredValue: desiredStateVariableValues.size
          }]
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
        specifiedSize: {
          dependencyType: "stateVariable",
          variableName: "specifiedSize"
        },
        size: {
          dependencyType: "stateVariable",
          variableName: "size",
        },
        specifiedWidth: {
          dependencyType: "stateVariable",
          variableName: "specifiedWidth"
        },
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["xscale"]
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        const defaultSize = 'medium';

        if (dependencyValues.graphAncestor) {

          let xscale = dependencyValues.graphAncestor.stateValues.xscale;
          if (!usedDefault.specifiedSize) {
            return {
              setValue: {
                // width: { isAbsolute: true, size: percentWidthsBySize[dependencyValues.size] / 100 * xscale }
                width: { isAbsolute: false, size: percentWidthsBySize[dependencyValues.size] }
              }
            }
          } else if (!usedDefault.specifiedWidth) {

            let componentSize = dependencyValues.specifiedWidth;

            let width;
            if (componentSize) {
              // if (componentSize.isAbsolute) {
              width = componentSize;
              // } else {
              //   width = { isAbsolute: true, size: componentSize.size / 100 * xscale }
              // }
            } else {
              // width = { isAbsolute: true, size: percentWidthsBySize[defaultSize] / 100 * xscale };
              width = { isAbsolute: false, size: percentWidthsBySize[defaultSize] };
            }

            return {
              setValue: { width }
            }

          } else {
            return {
              setValue: {
                // width: { isAbsolute: true, size: percentWidthsBySize[defaultSize] / 100 * xscale }
                width: { isAbsolute: false, size: percentWidthsBySize[defaultSize] }
              }
            }
          }

        } else {
          // if don't have a graph ancestor
          // then width is determined just by the size

          let width = { isAbsolute: true, size: widthsBySize[dependencyValues.size] }

          return {
            setValue: { width }
          }
        }
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setDependency: "specifiedWidth",
            desiredValue: desiredStateVariableValues.width
          }]
        }
      }

    }

    stateVariableDefinitions.widthForGraph = {
      forRenderer: true,
      returnDependencies: () => ({
        width: {
          dependencyType: "stateVariable",
          variableName: "width"
        },
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["xscale"]
        },
      }),
      definition({ dependencyValues }) {
        let widthForGraph = dependencyValues.width;
        if (dependencyValues.graphAncestor && !widthForGraph.isAbsolute) {
          widthForGraph = { isAbsolute: true, size: widthForGraph.size / 100 * dependencyValues.graphAncestor.stateValues.xscale }
        }

        return { setValue: { widthForGraph } };
      }
    }

    stateVariableDefinitions.aspectRatio = {
      public: true,
      forRenderer: true,
      hasEssential: true,
      defaultValue: null,
      shadowingInstructions: {
        createComponentOfType: "number"
      },
      returnDependencies: () => ({
        aspectRatioAttr: {
          dependencyType: "attributeComponent",
          attributeName: "aspectRatio",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.aspectRatioAttr !== null) {
          let aspectRatio = dependencyValues.aspectRatioAttr.stateValues.value;
          if (!Number.isFinite(aspectRatio)) {
            aspectRatio = null;
          }
          return {
            setValue: { aspectRatio }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { aspectRatio: true }
          }
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.aspectRatioAttr !== null) {
          return {
            success: true,
            instructions: [{
              setDependency: "aspectRatioAttr",
              desiredValue: desiredStateVariableValues.aspectRatio,
              variableIndex: 0
            }]
          }
        } else {
          let aspectRatio = desiredStateVariableValues.aspectRatio;
          if (!(aspectRatio > 0)) {
            aspectRatio = null;
          }
          return {
            success: true,
            instructions: [{
              setEssentialValue: "aspectRatio",
              value: aspectRatio
            }]
          }
        }
      }
    }

    stateVariableDefinitions.cid = {
      forRenderer: true,

      returnDependencies: () => ({
        source: {
          dependencyType: "stateVariable",
          variableName: "source",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.source ||
          dependencyValues.source.substring(0, 7).toLowerCase() !== "doenet:"
        ) {
          return {
            setValue: { cid: null }
          }
        }

        let cid = null;

        let result = dependencyValues.source.match(/[:&]cid=([^&]+)/i);
        if (result) {
          cid = result[1];
        }

        return { setValue: { cid } };
      },
    };

    stateVariableDefinitions.anchor = {
      defaultValue: me.fromText("(0,0)"),
      public: true,
      forRenderer: true,
      hasEssential: true,
      shadowingInstructions: {
        createComponentOfType: "point"
      },
      returnDependencies: () => ({
        anchorAttr: {
          dependencyType: "attributeComponent",
          attributeName: "anchor",
          variableNames: ["coords"],
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.anchorAttr) {
          return { setValue: { anchor: dependencyValues.anchorAttr.stateValues.coords } }
        } else {
          return { useEssentialOrDefaultValue: { anchor: true } }
        }
      },
      async inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues, initialChange }) {

        // if not draggable, then disallow initial change 
        if (initialChange && !await stateValues.draggable) {
          return { success: false };
        }

        if (dependencyValues.anchorAttr) {
          return {
            success: true,
            instructions: [{
              setDependency: "anchorAttr",
              desiredValue: desiredStateVariableValues.anchor,
              variableIndex: 0,
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setEssentialValue: "anchor",
              value: desiredStateVariableValues.anchor
            }]
          }
        }

      }
    }

    return stateVariableDefinitions;

  }

  async moveImage({ x, y, z, transient, actionId }) {
    let components = ["vector"];
    if (x !== undefined) {
      components[1] = x;
    }
    if (y !== undefined) {
      components[2] = y;
    }
    if (z !== undefined) {
      components[3] = z;
    }
    if (transient) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "anchor",
          value: me.fromAst(components),
        }],
        transient,
        actionId,
      });
    } else {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "anchor",
          value: me.fromAst(components),
        }],
        actionId,
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            x, y, z
          }
        }
      });
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
    moveImage: this.moveImage.bind(this),
    recordVisibilityChange: this.recordVisibilityChange.bind(this),
  }

}
