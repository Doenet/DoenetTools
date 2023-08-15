import InlineComponent from "./abstract/InlineComponent";

export default class Ref extends InlineComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      navigateToTarget: this.navigateToTarget.bind(this),
    });
  }
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
      forRenderer: true,
    };
    attributes.page = {
      createPrimitiveOfType: "integer",
      createStateVariable: "page",
      defaultValue: null,
      public: true,
      forRenderer: true,
    };
    attributes.createButton = {
      createComponentOfType: "boolean",
      createStateVariable: "createButton",
      defaultValue: false,
      forRenderer: true,
    };
    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "anything",
        componentTypes: ["_base"],
      },
    ];
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
            targetComponent: dependencyValues.targetComponent,
          },
        };
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
              variableName: "isInactiveCompositeReplacement",
            },
          };
        } else {
          return {};
        }
      },
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            targetInactive: Boolean(
              dependencyValues.targetIsInactiveCompositeReplacement,
            ),
          },
        };
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
          variableName: "uri",
        },
        page: {
          dependencyType: "stateVariable",
          variableName: "page",
        },
        targetInactive: {
          dependencyType: "stateVariable",
          variableName: "targetInactive",
        },
        targetAttribute: {
          dependencyType: "doenetAttribute",
          attributeName: "target",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.uri || dependencyValues.page) {
          if (dependencyValues.targetAttribute) {
            let targetName = dependencyValues.targetAttribute;
            if (targetName[0] !== "/") {
              targetName = "/" + targetName;
            }
            return { setValue: { targetName } };
          } else {
            return { setValue: { targetName: "" } };
          }
        } else if (
          dependencyValues.targetComponent === null ||
          dependencyValues.targetInactive
        ) {
          return { setValue: { targetName: "" } };
        } else {
          return {
            setValue: {
              targetName: dependencyValues.targetComponent.componentName,
            },
          };
        }
      },
    };

    stateVariableDefinitions.cid = {
      forRenderer: true,
      additionalStateVariablesDefined: [
        {
          variableName: "activityId",
          forRenderer: true,
        },
        {
          variableName: "variantIndex",
          forRenderer: true,
        },
        {
          variableName: "edit",
          forRenderer: true,
        },
        {
          variableName: "draft",
          forRenderer: true,
        },
        {
          variableName: "hash",
          forRenderer: true,
        },
      ],
      returnDependencies: () => ({
        uri: {
          dependencyType: "stateVariable",
          variableName: "uri",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (
          !dependencyValues.uri ||
          dependencyValues.uri.substring(0, 7).toLowerCase() !== "doenet:"
        ) {
          return {
            setValue: {
              cid: null,
              activityId: null,
              variantIndex: null,
              edit: null,
              draft: null,
              hash: null,
            },
          };
        }

        let cid = null,
          activityId = null,
          variantIndex = null;
        let draft = null,
          edit = null,
          hash = null;

        let warnings = [];

        let result = dependencyValues.uri.match(/[:&]cid=([^&^#]+)/i);
        if (result) {
          cid = result[1];
        }
        result = dependencyValues.uri.match(/[:&]activityId=([^&^#]+)/i);
        if (result) {
          activityId = result[1];
        }
        result = dependencyValues.uri.match(/[:&]doenetId=([^&^#]+)/i);
        if (result) {
          if (activityId) {
            warnings.push({
              message:
                "The deprecated URI parameter doenetId is ignored as activityId is present.",
              level: 1,
            });
          } else {
            warnings.push({
              message:
                "The doenetId URI parameters is deprecated. Use activityId instead. Its will be ignored starting with the next major version (0.7). Version 0.6 will be phased out in summer 2024.",
              level: 1,
            });
            activityId = result[1];
          }
        }
        result = dependencyValues.uri.match(/[:&]variant=([^&^#]+)/i);
        if (result) {
          variantIndex = Number(result[1]);
          if (!Number.isInteger(variantIndex) && variantIndex >= 1) {
            variantIndex = 1;
          }
        }
        result = dependencyValues.uri.match(/[:&]edit=([^&^#]+)/i);
        if (result) {
          if (result[1].toLowerCase() === "true") {
            edit = true;
          } else {
            edit = false;
          }
        }
        result = dependencyValues.uri.match(/[:&]draft=([^&^#]+)/i);
        if (result) {
          if (result[1].toLowerCase() === "true") {
            draft = true;
          } else {
            draft = false;
          }
        }
        result = dependencyValues.uri.match(/(#.+)/i);
        if (result) {
          hash = result[1];
        }

        return {
          setValue: { cid, activityId, variantIndex, edit, draft, hash },
          sendWarnings: warnings,
        };
      },
    };

    stateVariableDefinitions.linkText = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["targetName"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          allChildren: {
            dependencyType: "child",
            childGroups: ["anything"],
            variableNames: ["text"],
            variablesOptional: true,
          },
          uri: {
            dependencyType: "stateVariable",
            variableName: "uri",
          },
          targetInactive: {
            dependencyType: "stateVariable",
            variableName: "targetInactive",
          },
        };

        if (stateValues.targetName) {
          dependencies.equationTag = {
            dependencyType: "stateVariable",
            componentName: stateValues.targetName,
            variableName: "equationTag",
            variablesOptional: true,
          };
          dependencies.title = {
            dependencyType: "stateVariable",
            componentName: stateValues.targetName,
            variableName: "title",
            variablesOptional: true,
          };
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
              linkText = "(" + dependencyValues.equationTag + ")";
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
        return { setValue: { linkText } };
      },
    };

    return stateVariableDefinitions;
  }

  async navigateToTarget({ actionId }) {
    if (await this.stateValues.disabled) {
      return;
    }

    let cid = await this.stateValues.cid;
    let activityId = await this.stateValues.activityId;
    let variantIndex = await this.stateValues.variantIndex;
    let edit = await this.stateValues.edit;
    let hash = await this.stateValues.hash;
    let page = await this.stateValues.page;
    let uri = await this.stateValues.uri;
    let targetName = await this.stateValues.targetName;

    let effectiveName = this.componentOrAdaptedName;

    this.coreFunctions.navigateToTarget({
      cid,
      activityId,
      variantIndex,
      edit,
      hash,
      page,
      uri,
      targetName,
      actionId,
      componentName: this.componentName,
      effectiveName,
    });
  }
}
