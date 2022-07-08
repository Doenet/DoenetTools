import BlockComponent from './abstract/BlockComponent';

export default class Image extends BlockComponent {
  static componentType = "image";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.width = {
      createComponentOfType: "_componentSize",
      createStateVariable: "width",
      defaultValue: null,
      public: true,
      forRenderer: true
    };
    attributes.height = {
      createComponentOfType: "_componentSize",
      createStateVariable: "height",
      defaultValue: null,
      public: true,
      forRenderer: true
    };
    attributes.description = {
      createComponentOfType: "text",
      createStateVariable: "description",
      defaultValue: null,
      public: true,
      forRenderer: true
    };
    attributes.source = {
      createComponentOfType: "text",
      createStateVariable: "source",
      required: true,  // not implemented yet
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
              setValue: { cid: null}
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
