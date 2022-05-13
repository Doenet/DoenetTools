import InlineComponent from './abstract/InlineComponent.js';

export default class Ref extends InlineComponent {
  static componentType = "ref";
  static renderChildren = true;

  static acceptTarget = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.textType = {
      createComponentOfType: "text",
      createStateVariable: "textType",
      defaultValue: "type-global",
      public: true,
    };
    attributes.uri = {
      createPrimitiveOfType: "string",
      createStateVariable: "uri",
      defaultValue: null,
      public: true,
      forRenderer: true
    };
    attributes.createButton = {
      createComponentOfType: "boolean",
      createStateVariable: "createButton",
      defaultValue: false,
      forRenderer: true,
    };
    attributes.edit = {
      createComponentOfType: "boolean",
      createStateVariable: "edit",
      defaultValue: null,
      forRenderer: true,
    };
    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "anything",
      componentTypes: ["_base"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.targetComponent = {
      returnDependencies: () => ({
        targetComponent: {
          dependencyType: "targetComponent",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            targetComponent: dependencyValues.targetComponent
          }
        }
      },
    };


    stateVariableDefinitions.targetInactive = {
      stateVariablesDeterminingDependencies: ["targetComponent"],
      returnDependencies({ stateValues }) {
        if (stateValues.targetComponent) {
          return {
            targetIsInactiveCompositeReplacement: {
              dependencyType: "stateVariable",
              componentName: stateValues.targetComponent.componentName,
              variableName: "isInactiveCompositeReplacement"
            }
          }
        } else {
          return {}
        }
      },
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            targetInactive: Boolean(dependencyValues.targetIsInactiveCompositeReplacement)
          }
        }
      },
    };


    stateVariableDefinitions.targetName = {
      forRenderer: true,
      returnDependencies: () => ({
        targetComponent: {
          dependencyType: "stateVariable",
          variableName: "targetComponent",
        },
        uri: {
          dependencyType: "stateVariable",
          variableName: "uri"
        },
        targetInactive: {
          dependencyType: "stateVariable",
          variableName: "targetInactive"
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.targetComponent === null || dependencyValues.targetInactive) {
          return { setValue: { targetName: "" } }
        } else {
          if (dependencyValues.uri !== null) {
            console.warn("Haven't implemented ref with uri and target, ignoring target.");
            return { setValue: { targetName: "" } }
          }
          return { setValue: { targetName: dependencyValues.targetComponent.componentName } }
        }
      },
    };

    stateVariableDefinitions.cid = {
      forRenderer: true,
      additionalStateVariablesDefined: [{
        variableName: "doenetId",
        forRenderer: true,
      }, {
        variableName: "pageNumber",
        forRenderer: true,
      }, {
        variableName: "variantIndex",
        forRenderer: true,
      }, {
        variableName: "edit",
        forRenderer: true,
      }, {
        variableName: "draft",
        forRenderer: true,
      }],
      returnDependencies: () => ({
        uri: {
          dependencyType: "stateVariable",
          variableName: "uri",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.uri ||
          dependencyValues.uri.substring(0, 7).toLowerCase() !== "doenet:"
        ) {
          return {
            setValue: { cid: null, doenetId: null, pageNumber: null, variantIndex: null, edit: null, draft: null }
          }
        }

        let cid = null, doenetId = null, pageNumber = null, variantIndex = null;
        let draft = null, edit = null;

        let result = dependencyValues.uri.match(/[:&]cid=([^&]+)/i);
        if (result) {
          cid = result[1];
        }
        result = dependencyValues.uri.match(/[:&]doenetid=([^&]+)/i);
        if (result) {
          doenetId = result[1];
        }
        result = dependencyValues.uri.match(/[:&]page=([^&]+)/i);
        if (result) {
          pageNumber = Number(result[1]);
          if (!Number.isInteger(pageNumber) && pageNumber >= 1) {
            pageNumber = 1;
          }
        }
        result = dependencyValues.uri.match(/[:&]variant=([^&]+)/i);
        if (result) {
          variantIndex = Number(result[1]);
          if (!Number.isInteger(variantIndex) && variantIndex >= 1) {
            variantIndex = 1;
          }
        }
        result = dependencyValues.uri.match(/[:&]edit=([^&]+)/i);
        if (result) {
          if (result[1].toLowerCase() === "true") {
            edit = true;
          } else {
            edit = false;
          }
        }
        result = dependencyValues.uri.match(/[:&]draft=([^&]+)/i);
        if (result) {
          if (result[1].toLowerCase() === "true") {
            draft = true;
          } else {
            draft = false;
          }
        }

        // console.log('url parameter results', { cid, doenetId, pageNumber, variantIndex, edit, draft })

        return { setValue: { cid, doenetId, pageNumber, variantIndex, edit, draft } };
      },
    };

    stateVariableDefinitions.linkText = {
      public: true,
      componentType: "text",
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["targetName"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          allChildren: {
            dependencyType: "child",
            childGroups: ["anything"],
            variableNames: ["text"],
            variablesOptional: true
          },
          uri: {
            dependencyType: "stateVariable",
            variableName: "uri"
          },
          targetInactive: {
            dependencyType: "stateVariable",
            variableName: "targetInactive"
          }
        };

        if (stateValues.targetName) {
          dependencies.equationTag = {
            dependencyType: "stateVariable",
            componentName: stateValues.targetName,
            variableName: "equationTag",
            variablesOptional: true,
          }
          dependencies.title = {
            dependencyType: "stateVariable",
            componentName: stateValues.targetName,
            variableName: "title",
            variablesOptional: true,
          }
        }


        return dependencies;
      },
      definition: function ({ dependencyValues }) {
        let linkText = "";
        if (dependencyValues.allChildren.length === 0) {
          if (dependencyValues.uri !== null) {
            linkText = dependencyValues.uri;
          } else if (!dependencyValues.targetInactive) {
            if (dependencyValues.title !== null) {
              linkText = dependencyValues.title;
            } else if (dependencyValues.equationTag !== null) {
              linkText = '(' + dependencyValues.equationTag + ')';
            }
          }
        } else {
          for (let child of dependencyValues.allChildren) {
            if (typeof child !== "object") {
              linkText += child.toString();
            } else if (typeof child.stateValues.text === "string") {
              linkText += child.stateValues.text;
            }
          }
        }

        if (!linkText) {
          linkText = "???";
        }
        return { setValue: { linkText } }
      }
    }

    return stateVariableDefinitions;

  }

}