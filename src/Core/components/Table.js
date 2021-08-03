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

  static returnChildGroups() {

    return [{
      group: "titles",
      componentTypes: ["title"]
    }, {
      group: "inlinesBlocks",
      componentTypes: ["_inline", "_block"]
    }]

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
          childGroups: ["titles"],
        },
      }),
      definition({ dependencyValues }) {
        let titleChildName = null;
        if (dependencyValues.titleChild.length > 0) {
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
          childGroups: ["titles"],
          variableNames: ["text"],
        },
      }),
      definition({ dependencyValues }) {

        let title = null;
        if (dependencyValues.titleChild.length > 0) {
          title = dependencyValues.titleChild[0].stateValues.text;
        }
        return { newValues: { title } }
      }
    }



    return stateVariableDefinitions;
  }

}