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

    let atMostOneBlock = childLogic.newLeaf({
      name: "atMostOneBlock",
      componentType: "_block",
      comparison: "atMost",
      number: 1,
    })

    childLogic.newOperator({
      name: "captionAndBlock",
      operator: "and",
      propositions: [atMostOneCaption, atMostOneBlock],
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
      returnDependencies: () => ({
        figureCounter: {
          dependencyType: "counter",
          counterName: "figure"
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: { figureEnumeration: String(dependencyValues.figureCounter) }
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

        let caption= null;

        if (dependencyValues.captionChild.length === 1) {
          caption = dependencyValues.captionChild[0].stateValues.text;
        }
        return { newValues: { caption } }
      }
    }



    return stateVariableDefinitions;
  }

}