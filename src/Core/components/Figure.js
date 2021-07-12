import BlockComponent from './abstract/BlockComponent';

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

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneCaption = childLogic.newLeaf({
      name: "atMostOneCaption",
      componentType: "caption",
      comparison: "atMost",
      number: 1,
    })

    let atLeastZeroBlock = childLogic.newLeaf({
      name: "atLeastZeroBlock",
      componentType: "_block",
      comparison: "atLeast",
      number: 0,
    })

    let atLeastZeroInline = childLogic.newLeaf({
      name: "atLeastZeroInline",
      componentType: "_inline",
      comparison: "atLeast",
      number: 0,
    })

    childLogic.newOperator({
      name: "captionAndBlockInline",
      operator: "and",
      propositions: [atMostOneCaption, atLeastZeroBlock, atLeastZeroInline],
      setAsBase: true,
    })

    return childLogic;
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
          return { newValues: { figureEnumeration: null, figureName: "Figure" } };
        }
        let figureEnumeration = String(dependencyValues.figureCounter);
        let figureName = "Figure " + figureEnumeration;
        return {

          newValues: { figureEnumeration, figureName }
        }
      }
    }

    stateVariableDefinitions.captionChildName = {
      forRenderer: true,
      returnDependencies: () => ({
        captionChild: {
          dependencyType: "child",
          childLogicName: "atMostOneCaption",
        },
      }),
      definition({ dependencyValues }) {
        let captionChildName = null;
        if (dependencyValues.captionChild.length === 1) {
          captionChildName = dependencyValues.captionChild[0].componentName
        }
        return {
          newValues: { captionChildName }
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
          childLogicName: "atMostOneCaption",
          variableNames: ["text"],
        },
      }),
      definition({ dependencyValues }) {

        let caption = null;

        if (dependencyValues.captionChild.length === 1) {
          caption = dependencyValues.captionChild[0].stateValues.text;
        }
        return { newValues: { caption } }
      }
    }


    return stateVariableDefinitions;
  }

}