import BlockComponent from './abstract/BlockComponent';

export default class CodeViewer extends BlockComponent {
  static componentType = "codeViewer";
  static renderChildren = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.codeSource = {
      createPrimitiveOfType: "string",
      createStateVariable: "rawCodeSource",
      defaultValue: null,
    }

    attributes.width = {
      createComponentOfType: "_componentSize",
    };

    attributes.height = {
      createComponentOfType: "_componentSize",
    };

    attributes.hasCodeEditorParent = {
      createComponentOfType: "boolean",
    };

    attributes.renderedName = {
      createPrimitiveOfType: "string",
    }

    return attributes;
  }


  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let addRenderDoenetML = function ({ matchedChildren, componentAttributes }) {

      if (matchedChildren.length > 0) {
        return { success: false }
      }


      let renderDoenetML = {
        componentType: "renderDoenetML",
        attributes: {
          codeSource: {
            primitive: componentAttributes.codeSource
          }
        }
      };

      if (componentAttributes.renderedName) {
        renderDoenetML.props = { name: componentAttributes.renderedName }
      }

      return {
        success: true,
        newChildren: [renderDoenetML],
      }

    }
    sugarInstructions.push({
      replacementFunction: addRenderDoenetML
    })
    return sugarInstructions;
  }

  static returnChildGroups() {

    return [{
      group: "children",
      componentTypes: ["_base"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.hasCodeEditorParent = {
      public: true,
      componentType: "boolean",
      forRenderer: true,
      returnDependencies: () => ({
        codeEditorParent: {
          dependencyType: "parentIdentity",
          parentComponentType: "codeEditor"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.codeEditorParent) {
          return { setValue: { hasCodeEditorParent: true } };
        } else {
          //Default
          return { setValue: { hasCodeEditorParent: false } };
        }
      },

    }

    stateVariableDefinitions.width = {
      public: true,
      componentType: "_componentSize",
      hasEssential: true,
      forRenderer: true,
      defaultValue: { size: 600, isAbsolute: true },
      returnDependencies: () => ({
        widthAttr: {
          dependencyType: "attributeComponent",
          attributeName: "width",
          variableNames: ["componentSize"],
        },
        parentWidth: {
          dependencyType: "parentStateVariable",
          variableName: "width",
          parentComponentType: "codeEditor",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.widthAttr) {
          //Author specified width
          return { setValue: { width: dependencyValues.widthAttr.stateValues.componentSize } };
        } else if (dependencyValues.parentWidth) {
          //Parent component specified viewerWidth
          return { setValue: { width: dependencyValues.parentWidth } };
        } else {
          //Default
          return { useEssentialOrDefaultValue: { width: true } };
        }
      },
    }

    stateVariableDefinitions.height = {
      public: true,
      componentType: "_componentSize",
      hasEssential: true,
      forRenderer: true,
      defaultValue: { size: 400, isAbsolute: true },
      returnDependencies: () => ({
        heightAttr: {
          dependencyType: "attributeComponent",
          attributeName: "height",
          variableNames: ["componentSize"],
        },
        parentViewerHeight: {
          dependencyType: "parentStateVariable",
          variableName: "viewerHeight",
          parentComponentType: "codeEditor",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.heightAttr) {
          //Author specified height
          return { setValue: { height: dependencyValues.heightAttr.stateValues.componentSize } };
        } else if (dependencyValues.parentViewerHeight) {
          //Parent component specified viewerheight
          return { setValue: { height: dependencyValues.parentViewerHeight } };
        } else {
          //Default
          return { useEssentialOrDefaultValue: { height: true } };
        }
      },
    }

    stateVariableDefinitions.codeSourceComponentName = {
      stateVariablesDeterminingDependencies: ["rawCodeSource"],
      returnDependencies({ stateValues }) {
        if (stateValues.rawCodeSource) {
          return {
            codeSourceComponentName: {
              dependencyType: "expandTargetName",
              target: stateValues.rawCodeSource
            }
          }
        } else {
          return {}
        }
      },
      definition({ dependencyValues }) {
        return { setValue: { codeSourceComponentName: dependencyValues.codeSourceComponentName } }
      }
    }

    stateVariableDefinitions.codeSource = {
      returnDependencies: () => ({
        codeSourceComponentName: {
          dependencyType: "stateVariable",
          variableName: "codeSourceComponentName"
        },
        codeEditorParent: {
          dependencyType: "parentIdentity",
          parentComponentType: "codeEditor"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.codeSourceComponentName) {
          return { setValue: { codeSource: dependencyValues.codeSourceComponentName } };
        } else if (dependencyValues.codeEditorParent) {
          return { setValue: { codeSource: dependencyValues.codeEditorParent.componentName } };
        } else {
          return { setValue: { codeSource: null } };
        }

      },
    }

    return stateVariableDefinitions;

  }

  async updateComponents() {

    if (this.definingChildren.length === 1 &&
      this.definingChildren[0].componentType === 'renderDoenetML') {
      await this.coreFunctions.performAction({
        componentName: this.definingChildren[0].componentName,
        actionName: "updateComponents",
        // event: {
        //   verb: "selected",
        //   object: {
        //     componentName: this.componentName,
        //     componentType: this.componentType,
        //   },
        // },
      });
    }


  }

  actions = {
    updateComponents: this.updateComponents.bind(this),
  };

}
