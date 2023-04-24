import BaseComponent from "./abstract/BaseComponent";

export default class Sources extends BaseComponent {
  static componentType = "sources";
  static rendererType = "containerInline";
  static renderChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.alias = {
      createPrimitiveOfType: "string",
      validationFunction: function (value) {
        if (!/[a-zA-Z_]/.test(value.substring(0, 1))) {
          throw Error("All aliases must begin with a letter or an underscore");
        }
        if (!/^[a-zA-Z0-9_\-]+$/.test(value)) {
          throw Error(
            "Aliases can contain only letters, numbers, hyphens, and underscores",
          );
        }
        return value;
      },
    };

    attributes.indexAlias = {
      createPrimitiveOfType: "string",
      validationFunction: function (value) {
        if (!/[a-zA-Z_]/.test(value.substring(0, 1))) {
          throw Error(
            "All index aliases must begin with a letter or an underscore",
          );
        }
        if (!/^[a-zA-Z0-9_\-]+$/.test(value)) {
          throw Error(
            "Index aliases can contain only letters, numbers, hyphens, and underscores",
          );
        }
        return value;
      },
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

    stateVariableDefinitions.alias = {
      returnDependencies: () => ({
        alias: {
          dependencyType: "attributePrimitive",
          attributeName: "alias",
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { alias: dependencyValues.alias } };
      },
    };

    stateVariableDefinitions.indexAlias = {
      returnDependencies: () => ({
        indexAlias: {
          dependencyType: "attributePrimitive",
          attributeName: "indexAlias",
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { indexAlias: dependencyValues.indexAlias } };
      },
    };

    stateVariableDefinitions.numberOfChildren = {
      additionalStateVariablesDefined: [
        "childComponentNames",
        "childIdentities",
      ],
      returnDependencies: () => ({
        children: {
          dependencyType: "child",
          childGroups: ["anything"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let numberOfChildren = dependencyValues.children.length;
        let childComponentNames = dependencyValues.children.map(
          (x) => x.componentName,
        );
        return {
          setValue: {
            numberOfChildren,
            childComponentNames,
            childIdentities: dependencyValues.children,
          },
        };
      },
    };

    return stateVariableDefinitions;
  }
}
