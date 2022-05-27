import BlockComponent from './abstract/BlockComponent';

export default class DataFrame extends BlockComponent {
  static componentType = "summaryStatistics";

  static acceptTarget = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.column = {
      createComponentOfType: "text",
      createStateVariable: "column",
      defaultValue: null,
      public: true
    }

    attributes.statistics = {
      createComponentOfType: "textList",
      createStateVariable: "statisticsPrelim",
      defaultValue: ["all"],
    }

    attributes.byCategoryColumn = {
      createComponentOfType: "text",
      createStateVariable: "byCategoryColumn",
      defaultValue: null,
      public: true
    }

    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.desiredStatistics = {
      public: true,
      componentType: "textList",
      returnDependencies: () => ({
        statisticsPrelim: {
          dependencyType: "stateVariable",
          variableName: "statisticsPrelim",
        },
      }),
      definition: function ({ dependencyValues }) {

        let options = ["mean", "stdev", "n", "minimum", "quartile1", "median", "quartile3", "maximum"];

        let desiredStatistics = [];

        let desiredStats = dependencyValues.statisticsPrelim.map(x => x.toLowerCase());

        if (desiredStats.includes("all")) {
          desiredStatistics = [...options];
        } else {
          for (let stat of options) {
            if (desiredStats.includes(stat)) {
              desiredStatistics.push(stat);
            }
          }
        }

        return { setValue: { desiredStatistics } };
      },
    };

    stateVariableDefinitions.dataFrame = {
      returnDependencies() {
        return {
          targetComponent: {
            dependencyType: "targetComponent",
            variableNames: ["dataFrame", ""]
          }
        }
      },
      definition: function ({ dependencyValues }) {

        let targetComponent = null;
        if (dependencyValues.targetComponent) {
          targetComponent = dependencyValues.targetComponent
        }

        return {
          setValue: { targetComponent }
        }
      },
    };

    stateVariableDefinitions.summaryStatistics = {
      forRenderer: true,
      returnDependencies: () => ({

      })
    }

    return stateVariableDefinitions;

  }


}