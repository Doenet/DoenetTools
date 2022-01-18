import BlockComponent from './abstract/BlockComponent.js';

export default class Figure extends BlockComponent {
  static componentType = "figure";
  static renderChildren = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.suppressFigureNameInCaption = {
      createComponentOfType: "boolean",
      createStateVariable: "suppressFigureNameInCaption",
      defaultValue: false,
      forRenderer: true,
    }
    attributes.number = {
      createComponentOfType: "boolean",
      createStateVariable: "number",
      defaultValue: true,
      forRenderer: true,
    }

    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "captions",
      componentTypes: ["caption"]
    }, {
      group: "inlinesBlocks",
      componentTypes: ["_inline", "_block"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.figureEnumeration = {
      public: true,
      componentType: "text",
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["number"],
      additionalStateVariablesDefined: [{
        variableName: "figureName",
        public: true,
        componentType: "text",
        forRenderer: true,
      }],
      returnDependencies({ stateValues }) {
        let dependencies = {};

        if (stateValues.number) {
          dependencies.figureCounter = {
            dependencyType: "counter",
            counterName: "figure"
          }
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        if (dependencyValues.figureCounter === undefined) {
          return { setValue: { figureEnumeration: null, figureName: "Figure" } };
        }
        let figureEnumeration = String(dependencyValues.figureCounter);
        let figureName = "Figure " + figureEnumeration;
        return {

          setValue: { figureEnumeration, figureName }
        }
      }
    }

    stateVariableDefinitions.captionChildName = {
      forRenderer: true,
      returnDependencies: () => ({
        captionChild: {
          dependencyType: "child",
          childGroups: ["captions"],
        },
      }),
      definition({ dependencyValues }) {
        let captionChildName = null;
        if (dependencyValues.captionChild.length > 0) {
          captionChildName = dependencyValues.captionChild[0].componentName
        }
        return {
          setValue: { captionChildName }
        }
      }
    }


    stateVariableDefinitions.caption = {
      public: true,
      componentType: "text",
      forRenderer: true,
      returnDependencies: () => ({
        captionChild: {
          dependencyType: "child",
          childGroups: ["captions"],
          variableNames: ["text"],
        },
      }),
      definition({ dependencyValues }) {

        let caption = null;

        if (dependencyValues.captionChild.length > 0) {
          caption = dependencyValues.captionChild[0].stateValues.text;
        }
        return { setValue: { caption } }
      }
    }


    return stateVariableDefinitions;
  }

}