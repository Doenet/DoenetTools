import BlockComponent from './abstract/BlockComponent';

export default class Table extends BlockComponent {
  static componentType = "table";
  static renderChildren = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.suppressTableNameInTitle = {
      createComponentOfType: "boolean",
      createStateVariable: "suppressTableNameInTitle",
      defaultValue: false,
      forRenderer: true,
    }

    return attributes;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneTitle = childLogic.newLeaf({
      name: "atMostOneTitle",
      componentType: "title",
      comparison: "atMost",
      number: 1,
    })

    let atMostOneTabular = childLogic.newLeaf({
      name: "atMostOneTabular",
      componentType: "tabular",
      comparison: "atMost",
      number: 1,
    })

    childLogic.newOperator({
      name: "titleAndTabular",
      operator: "and",
      propositions: [atMostOneTitle, atMostOneTabular],
      setAsBase: true,
    })

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.tableEnumeration = {
      public: true,
      componentType: "text",
      forRenderer: true,
      returnDependencies: () => ({
        tableCounter: {
          dependencyType: "counter",
          counterName: "table"
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: { tableEnumeration: String(dependencyValues.tableCounter) }
        }
      }
    }

    stateVariableDefinitions.titleChildName = {
      forRenderer: true,
      returnDependencies: () => ({
        titleChild: {
          dependencyType: "child",
          childLogicName: "atMostOneTitle",
        },
      }),
      definition({ dependencyValues }) {
        let titleChildName = null;
        if (dependencyValues.titleChild.length === 1) {
          titleChildName = dependencyValues.titleChild[0].componentName
        }
        return {
          newValues: { titleChildName }
        }
      }
    }


    stateVariableDefinitions.title = {
      public: true,
      componentType: "text",
      forRenderer: true,
      returnDependencies: () => ({
        titleChild: {
          dependencyType: "child",
          childLogicName: "atMostOneTitle",
          variableNames: ["text"],
        },
      }),
      definition({ dependencyValues }) {

        let title = null;
        if (dependencyValues.titleChild.length === 1) {
          title = dependencyValues.titleChild[0].stateValues.text;
        }
        return { newValues: { title } }
      }
    }



    return stateVariableDefinitions;
  }

}