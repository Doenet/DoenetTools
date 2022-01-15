import BlockComponent from './abstract/BlockComponent';

export default class CodeEditor extends BlockComponent {
  static componentType = "codeEditor";

  static variableForPlainMacro = "value";

  static renderChildren = true;

  static get stateVariablesShadowedForReference() {
    return ["value"]
  };

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.prefill = {
      createComponentOfType: "text",
      createStateVariable: "prefill",
      defaultValue: "",
      public: true,
    };
    attributes.bindValueTo = {
      createComponentOfType: "text"
    };

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

    attributes.showResults = {
      createComponentOfType: "boolean",
      createStateVariable: "showResults",
      defaultValue: false,
      forRenderer: true,
      public: true,
    };

    attributes.viewerWidth = {
      createComponentOfType: "_componentSize",
      createStateVariable: "viewerWidth",
      defaultValue: { size: 300, isAbsolute: true },
      forRenderer: true,
      public: true,
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let addCodeViewer = function ({ matchedChildren, componentAttributes }) {

      if (matchedChildren.length > 0){
        return {success: false}
      }

      let codeViewer = {
        componentType: "codeViewer",
        children:[{componentType: "renderDoenetML"}]
      };

      return {
        success: true,
        newChildren: [codeViewer],
      }

    }
    sugarInstructions.push({
      replacementFunction: addCodeViewer
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

    stateVariableDefinitions.value = {
      public: true,
      componentType: "text",
      hasEssential: true,
      forRenderer: true,
      returnDependencies: () => ({
        bindValueTo: {
          dependencyType: "attributeComponent",
          attributeName: "bindValueTo",
          variableNames: ["value"],
        },
        prefill: {
          dependencyType: "stateVariable",
          variableName: "prefill"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.bindValueTo) {
          return {
            useEssentialOrDefaultValue: {
              value: {
                variablesToCheck: "value",
                defaultValue: dependencyValues.prefill
              }
            }
          }
        }
        return { setValue: { value: dependencyValues.bindValueTo.stateValues.value } };
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        if (dependencyValues.bindValueTo) {
          return {
            success: true,
            instructions: [{
              setDependency: "bindValueTo",
              desiredValue: desiredStateVariableValues.value,
              variableIndex: 0,
            }]
          };
        }

        // subsetValue is essential; give it the desired value
        return {
          success: true,
          instructions: [{
            setEssentialValue: "value",
            value: desiredStateVariableValues.value
          }]
        };
      }
    }

    stateVariableDefinitions.immediateValue = {
      public: true,
      componentType: "text",
      hasEssential: true,
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        }
      }),
      definition: function ({ dependencyValues, changes }) {
        // console.log(`definition of immediateValue`)
        // console.log(dependencyValues)
        // console.log(changes);

        if (changes.value) {
          // only update to value when it changes
          // (otherwise, let its essential value change)
          return {
            setValue: { immediateValue: dependencyValues.value },
            makeEssential: { immediateValue: true }
          };


        } else {
          return {
            useEssentialOrDefaultValue: {
              immediateValue: {
                variablesToCheck: "immediateValue",
                defaultValue: dependencyValues.value
              }
            }
          }
        }

      },
      inverseDefinition: function ({ desiredStateVariableValues, initialChange, shadowedVariable }) {

        // value is essential; give it the desired value
        let instructions = [{
          setEssentialValue: "immediateValue",
          value: desiredStateVariableValues.immediateValue
        }]


        // if from outside sources, also set value
        if (!(initialChange || shadowedVariable)) {
          instructions.push({
            setDependency: "value",
            desiredValue: desiredStateVariableValues.immediateValue
          })
        }

        return {
          success: true,
          instructions
        };
      }
    }

    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        }
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { text: dependencyValues.value } }
      }
    }

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { componentType: "text" } })
    }


    return stateVariableDefinitions;

  }


  updateImmediateValue({ text }) {
    if (!this.stateValues.disabled) {
      return this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "immediateValue",
          value: text,
        }]
      })
    }
  }

  updateValue() {
    //Only update when value is out of date
    if (!this.stateValues.disabled &&
      this.stateValues.immediateValue !== this.stateValues.value
      ) {
      let updateInstructions = [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "value",
        value: this.stateValues.immediateValue,
      },
      // in case value ended up being a different value than requested
      // we set immediate value to whatever was the result
      // (hence the need to execute update first)
      // Also, this makes sure immediateValue is saved to the database,
      // since in updateImmediateValue, immediateValue is note saved to database
      {
        updateType: "executeUpdate"
      },
      {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "immediateValue",
        valueOfStateVariable: "value",
      }];

      let event = {
        verb: "answered",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: this.stateValues.immediateValue,
          responseText: this.stateValues.immediateValue,
        }
      }

      if (this.stateValues.answerAncestor) {
        event.context = {
          answerAncestor: this.stateValues.answerAncestor.componentName
        }
      }

      return this.coreFunctions.performUpdate({
        updateInstructions,
        event
      }).then(() => this.coreFunctions.triggerChainedActions({
        componentName: this.componentName,
      }));

    }
  }

  async updateComponents(){

    if (this.definingChildren.length === 1 &&
      this.definingChildren[0].componentType === 'codeViewer'){
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
    updateImmediateValue: this.updateImmediateValue.bind(this),
    updateValue: this.updateValue.bind(this),
    updateComponents: this.updateComponents.bind(this),
  };

}
