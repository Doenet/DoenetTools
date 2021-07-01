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

    let atMostOneTitle = childLogic.newLeaf({
      name: "atMostOneTitle",
      componentType: "title",
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
      name: "titleAndBlockInline",
      operator: "and",
      propositions: [atMostOneTitle, atLeastZeroBlock, atLeastZeroInline],
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
      stateVariablesDeterminingDependencies: ["number"],
      additionalStateVariablesDefined: [{
        variableName: "tableName",
        public: true,
        componentType: "text",
        forRenderer: true,
      }],
      returnDependencies({ stateValues }) {
        let dependencies = {};

        if (stateValues.number) {
          dependencies.tableCounter = {
            dependencyType: "counter",
            counterName: "table"
          }
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        if (dependencyValues.tableCounter === undefined) {
          return { newValues: { tableEnumeration: null, tableName: "Table" } };
        }
        let tableEnumeration = String(dependencyValues.tableCounter);
        let tableName = "Table " + tableEnumeration;
        return {

          newValues: { tableEnumeration, tableName }
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