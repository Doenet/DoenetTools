import BlockComponent from "./abstract/BlockComponent";

export default class Table extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "table";
  static renderChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.suppressTableNameInTitle = {
      createComponentOfType: "boolean",
      createStateVariable: "suppressTableNameInTitle",
      defaultValue: false,
      forRenderer: true,
    };
    attributes.number = {
      createComponentOfType: "boolean",
      createStateVariable: "number",
      defaultValue: true,
      forRenderer: true,
    };

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "titles",
        componentTypes: ["title"],
      },
      {
        group: "inlinesBlocks",
        componentTypes: ["_inline", "_block"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.tableEnumeration = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["number"],
      additionalStateVariablesDefined: [
        {
          variableName: "tableName",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "text",
          },
          forRenderer: true,
        },
      ],
      mustEvaluate: true, // must evaluate to make sure all counters are accounted for
      returnDependencies({ stateValues }) {
        let dependencies = {};

        if (stateValues.number) {
          dependencies.tableCounter = {
            dependencyType: "counter",
            counterName: "sectioning",
          };
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        if (dependencyValues.tableCounter === undefined) {
          return { setValue: { tableEnumeration: null, tableName: "Table" } };
        }
        let tableEnumeration = String(dependencyValues.tableCounter);
        let tableName = "Table " + tableEnumeration;
        return {
          setValue: { tableEnumeration, tableName },
        };
      },
    };

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
          titleChildName = dependencyValues.titleChild[0].componentName;
        }
        return {
          setValue: { titleChildName },
        };
      },
    };

    stateVariableDefinitions.title = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
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
        return { setValue: { title } };
      },
    };

    return stateVariableDefinitions;
  }

  recordVisibilityChange({ isVisible }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible },
    });
  }
}
