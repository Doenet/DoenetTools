import BlockComponent from './abstract/BlockComponent';

export default class Graph extends BlockComponent {
  static componentType = "graph";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.xmin = { default: -10, forRenderer: true };
    properties.xmax = { default: 10, forRenderer: true };
    properties.ymin = { default: -10, forRenderer: true };
    properties.ymax = { default: 10, forRenderer: true };
    properties.width = { default: 300 };
    properties.height = { default: 300 };
    properties.displayXAxis = { default: true, forRenderer: true };
    properties.displayYAxis = { default: true, forRenderer: true };
    properties.xlabel = { default: "", forRenderer: true };
    properties.ylabel = { default: "", forRenderer: true };
    properties.showNavigation = { default: true, forRenderer: true };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let addCurve = function ({ activeChildrenMatched, dependencyValues }) {
      // add <curve> around strings, as long as they don't have points
      let curveChildren = [];
      for (let child of dependencyValues.atLeastOneString) {
        if (child.stateValues.value.includes(",")) {
          return { success: false };
        }
        curveChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "curve", children: curveChildren }],
      }
    }

    let atLeastOneString = childLogic.newLeaf({
      name: "atLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
      requireConsecutive: true,
      isSugar: true,
      returnSugarDependencies: () => ({
        atLeastOneString: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastOneString",
          variableNames: ["value"]
        }
      }),
      logicToWaitOnSugar: ["atLeastZeroGraphical"],
      replacementFunction: addCurve,
    });

    let atLeastZeroGraphical = childLogic.newLeaf({
      name: "atLeastZeroGraphical",
      componentType: '_graphical',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "sugarXorGraph",
      operator: "xor",
      propositions: [atLeastOneString, atLeastZeroGraphical],
      setAsBase: true,
    })

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.graphicalDescendants = {
      forRenderer: true,
      returnDependencies: () => ({
        graphicalDescendants: {
          dependencyType: "descendantIdentity",
          componentTypes: ["_graphical"]
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            graphicalDescendants: dependencyValues.graphicalDescendants
          }
        }
      },
    };

    stateVariableDefinitions.numericalWidth = {
      forRenderer: true,
      returnDependencies: () => ({
        width: {
          dependencyType: "stateVariable",
          variableName: "width"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { numericalWidth: parseInt(dependencyValues.width) }
      })
    }

    stateVariableDefinitions.numericalHeight = {
      forRenderer: true,
      returnDependencies: () => ({
        height: {
          dependencyType: "stateVariable",
          variableName: "height"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { numericalHeight: parseInt(dependencyValues.height) }
      })
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        activeChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroGraphical"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues:
            { childrenToRender: dependencyValues.activeChildren.map(x => x.componentName) }
        };
      }
    }

    return stateVariableDefinitions;
  }


}
