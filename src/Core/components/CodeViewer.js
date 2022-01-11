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
      createStateVariable: "width",
      defaultValue: { size: 600, isAbsolute: true },
      forRenderer: true,
      public: true,
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

      if (!componentAttributes.codeSource ||
        matchedChildren.length > 0){
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
          return { newValues: { minHeight: dependencyValues.height } };
        }else if (dependencyValues.minHeightAttr){
          //Author specified minHeight
          return { newValues: { minHeight: dependencyValues.minHeightAttr.stateValues.componentSize } };
        }else{
          //Default
          return { useEssentialOrDefaultValue: {minHeight: {}} };
        }
      },
    }

    stateVariableDefinitions.maxHeight = {
      public: true,
      componentType: "_componentSize",
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
          return { newValues: { maxHeight: dependencyValues.height } };
        }else if (dependencyValues.maxHeightAttr){
          //Author specified maxHeight
          return { newValues: { maxHeight: dependencyValues.maxHeightAttr.stateValues.componentSize } };
        }else{
          //Default
          return { useEssentialOrDefaultValue: {maxHeight: {}} };
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
        return { newValues: { codeSourceComponentName: dependencyValues.codeSourceComponentName } }
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
          return { newValues: { codeSource: dependencyValues.codeSourceComponentName } }; 
        }else if(dependencyValues.codeEditorParent){
          return { newValues: { codeSource: dependencyValues.codeEditorParent.componentName } }; 
        }else{
          return { newValues: { codeSource: null } }; 
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
