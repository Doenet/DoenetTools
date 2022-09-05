import BaseComponent from './abstract/BaseComponent';

import { styleAttributes } from '../utils/style';

export class StyleDefinition extends BaseComponent {
  static componentType = "styleDefinition";
  static rendererType = undefined;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.styleNumber = {
      createPrimitiveOfType: "number",
      createStateVariable: "styleNumber",
      defaultValue: 1,
    }

    for (let styleAttr in styleAttributes) {
      attributes[styleAttr] = {
        createComponentOfType: styleAttributes[styleAttr].componentType,
      }
    }

    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.styleDefinition = {
      returnDependencies: function () {

        let dependencies = {};

        for (let styleAttr in styleAttributes) {
          dependencies[styleAttr] = {
            dependencyType: "attributeComponent",
            attributeName: styleAttr,
            variableNames: ["value"]
          }
        }
        return dependencies;
      },
      definition: function ({ dependencyValues }) {

        let styleDefinition = {};

        for (let styleAttr in styleAttributes) {
          if (dependencyValues[styleAttr] !== null) {

            styleDefinition[styleAttr] =
              dependencyValues[styleAttr].stateValues.value;

            if(typeof styleDefinition[styleAttr] === "string") {
              styleDefinition[styleAttr] = styleDefinition[styleAttr].toLowerCase();
            }
          }
        }

        return { setValue: { styleDefinition } }
      }
    }

    return stateVariableDefinitions;

  }
}


export class StyleDefinitions extends BaseComponent {
  static componentType = "styleDefinitions";
  static rendererType = undefined;

  static returnChildGroups() {

    return [{
      group: "styleDefinition",
      componentTypes: ["styleDefinition"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.value = {
      returnDependencies: () => ({
        styleDefinitionChildren: {
          dependencyType: "child",
          childGroups: ["styleDefinition"],
          variableNames: ["styleNumber", "styleDefinition"],
        },
      }),
      definition({ dependencyValues }) {

        let value = {};

        for (let child of dependencyValues.styleDefinitionChildren) {
          let styleNumber = child.stateValues.styleNumber;

          let styleDef = value[styleNumber];
          if (!styleDef) {
            styleDef = value[styleNumber] = {};
          }

          Object.assign(styleDef, child.stateValues.styleDefinition)
        }

        return { setValue: { value } }
      }
    }

    return stateVariableDefinitions;

  }

}
