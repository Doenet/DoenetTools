import BlockComponent from './abstract/BlockComponent.js';

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
      createStateVariable: "height",
      // defaultValue: { size: 120, isAbsolute: true },
      defaultValue: null,  //fall back to minheight and maxheight
      public: true,
    };
    attributes.minHeight = {
      createComponentOfType: "_componentSize",
    };
    attributes.maxHeight = {
      createComponentOfType: "_componentSize",
    };
    return attributes;
  }


  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let addRenderDoenetML = function ({ matchedChildren, componentAttributes }) {

      if (matchedChildren.length > 0){
        return {success: false}
      }

      let renderDoenetML = {
        componentType: "renderDoenetML",
        attributes: {
          codeSource: {
            primitive:componentAttributes.codeSource
          }
        }
      };

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

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.minHeight = {
      public: true,
      componentType: "_componentSize",
      hasEssential: true,
      forRenderer: true,
      defaultValue: { size: 26, isAbsolute: true },
      returnDependencies: () => ({
        minHeightAttr: {
          dependencyType: "attributeComponent",
          attributeName: "minHeight",
          variableNames: ["componentSize"],
        },
        height: {
          dependencyType: "stateVariable",
          variableName: "height"
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {
        if (!usedDefault.height){
          //Author specified height
          return { setValue: { minHeight: dependencyValues.height } };
        }else if (dependencyValues.minHeightAttr){
          //Author specified minHeight
          return { setValue: { minHeight: dependencyValues.minHeightAttr.stateValues.componentSize } };
        }else{
          //Default
          return { useEssentialOrDefaultValue: {minHeight: {}} };
        }
      },
    }

    stateVariableDefinitions.maxHeight = {
      public: true,
      componentType: "_componentSize",
      hasEssential: true,
      forRenderer: true,
      defaultValue: { size: 120, isAbsolute: true },
      returnDependencies: () => ({
        maxHeightAttr: {
          dependencyType: "attributeComponent",
          attributeName: "maxHeight",
          variableNames: ["componentSize"],
        },
        height: {
          dependencyType: "stateVariable",
          variableName: "height"
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {
        if (!usedDefault.height){
          //Author specified height
          return { setValue: { maxHeight: dependencyValues.height } };
        }else if (dependencyValues.maxHeightAttr){
          //Author specified maxHeight
          return { setValue: { maxHeight: dependencyValues.maxHeightAttr.stateValues.componentSize } };
        }else{
          //Default
          return { useEssentialOrDefaultValue: {maxHeight: {}} };
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
        parentViewerWidth: {
          dependencyType: "parentStateVariable",
          variableName: "viewerWidth"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.widthAttr){
          //Author specified width
          return { setValue: { width: dependencyValues.widthAttr.stateValues.componentSize } };
        }else if(dependencyValues.parentViewerWidth){
          //Parent component specified viewerWidth
          return { setValue: { width: dependencyValues.parentViewerWidth } };
        }else{
          //Default
          return { useEssentialOrDefaultValue: {width: true} };
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
        console.log("dependencyValues",dependencyValues)
        if (dependencyValues.codeSourceComponentName){
          return { setValue: { codeSource: dependencyValues.codeSourceComponentName } }; 
        }else if(dependencyValues.codeEditorParent){
          return { setValue: { codeSource: dependencyValues.codeEditorParent.componentName } }; 
        }else{
          return { setValue: { codeSource: null } }; 
        }
     
      },
    }

    return stateVariableDefinitions;

  }

  async updateComponents(){

    if (this.definingChildren.length === 1 &&
      this.definingChildren[0].componentType === 'renderDoenetML'){
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
    updateComponents: this.updateComponents.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
  };

}
