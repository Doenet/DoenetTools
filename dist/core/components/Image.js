import BlockComponent from './abstract/BlockComponent.js';
import { orderedPercentWidthMidpoints, orderedWidthMidpoints, widthsBySize, sizePossibilities } from '../utils/size.js';

export default class Image extends BlockComponent {
  static componentType = "image";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

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

    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

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

    stateVariableDefinitions.aspectRatio = {
      public: true,
      forRenderer: true,
      defaultValue: null,
      hasEssential: true,
      shadowingInstructions: {
        createComponentOfType: "number"
      },
      returnDependencies: () => ({
        aspectRatioAttr: {
          dependencyType: "attributeComponent",
          attributeName: "aspectRatio",
          variableNames: ["value"]
        },
        width: {
          dependencyType: "stateVariable",
          variableName: "width"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.aspectRatioAttr !== null) {
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


    return stateVariableDefinitions;

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
    recordVisibilityChange: this.recordVisibilityChange.bind(this),
  }

}
