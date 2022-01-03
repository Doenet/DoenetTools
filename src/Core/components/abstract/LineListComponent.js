import BaseComponent from './BaseComponent';

export default class LineListComponent extends BaseComponent {
  static componentType = "_lineListComponent";
  static rendererType = "container";
  static renderChildren = true;


  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakStringsIntoLinesBySpaces = function ({ matchedChildren }) {

      // break any string by white space and wrap pieces with line

      let newChildren = matchedChildren.reduce(function (a, c) {
        if (typeof c === "string") {
          return [
            ...a,
            ...c.split(/\s+/)
              .filter(s => s)
              .map(s => ({
                componentType: "line",
                children: [s]
              }))
          ]
        } else {
          return [...a, c]
        }
      }, []);

      return {
        success: true,
        newChildren: newChildren,
      }
    }


    sugarInstructions.push({
      replacementFunction: breakStringsIntoLinesBySpaces
    });

    return sugarInstructions;

  }

  static returnChildGroups() {

    return [{
      group: "lines",
      componentTypes: ["line"]
    }]

  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nLines = {
      returnDependencies: () => ({
        lineChildren: {
          dependencyType: "child",
          childGroups: ["lines"],
          skipComponentNames: true,
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: { nLines: dependencyValues.lineChildren.length },
          checkForActualChange: { nLines: true }
        }
      }
    }


    stateVariableDefinitions.lineNames = {
      isArray: true,
      entryPrefixes: ["lineName"],
      returnArraySizeDependencies: () => ({
        nLines: {
          dependencyType: "stateVariable",
          variableName: "nLines",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nLines];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            lineChild: {
              dependencyType: "child",
              childGroups: ["lines"],
              childIndices: [arrayKey],
            }
          }
        }

        return { dependenciesByKey };

      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        let lineNames = {};

        for (let arrayKey of arrayKeys) {
          let lineChild = dependencyValuesByKey[arrayKey].lineChild[0];
          if (lineChild) {
            lineNames[arrayKey] = lineChild.componentName
          }
        }

        return { newValues: { lineNames } }

      }
    }

    return stateVariableDefinitions;

  }

}
