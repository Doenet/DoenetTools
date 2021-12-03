
export let styleAttributes = {
  lineColor: { componentType: "text" },
  lineWidth: { componentType: "number" },
  lineStyle: { componentType: "text" },
  markerColor: { componentType: "text" },
  markerStyle: { componentType: "text" },
  markerSize: { componentType: "number" },
  fillColor: { componentType: "text" },
}

let defaultStyle = {
  lineColor: "blue",
  lineWidth: 4,
  lineStyle: "solid",
  markerColor: "blue",
  markerStyle: "circle",
  markerSize: 3,
  fillColor: "none",
}


function returnDefaultStyleDefinitions() {

  return {
    1: {
      lineColor: "blue",
      lineWidth: 4,
      lineStyle: "solid",
      markerColor: "blue",
      markerStyle: "circle",
      markerSize: 3,
      fillColor: "none",
    },
    2: {
      lineColor: "green",
      lineWidth: 2,
      lineStyle: "solid",
      markerColor: "green",
      markerStyle: "square",
      markerSize: 4,
      fillColor: "none",
    },
    3: {
      lineColor: "red",
      lineWidth: 3,
      lineStyle: "solid",
      markerColor: "red",
      markerStyle: "triangle",
      markerSize: 5,
      fillColor: "none",
    },
    4: {
      lineColor: "purple",
      lineWidth: 2,
      lineStyle: "solid",
      markerColor: "purple",
      markerStyle: "diamond",
      markerSize: 4,
      fillColor: "none",
    },
    5: {
      lineColor: "black",
      lineWidth: 1,
      lineStyle: "solid",
      markerColor: "black",
      markerStyle: "circle",
      markerSize: 2,
      fillColor: "none",
    },
    6: {
      lineColor: "lightgray",
      lineWidth: 1,
      lineStyle: "dotted",
      markerColor: "lightgray",
      markerStyle: "circle",
      markerSize: 2,
      fillColor: "none",
    }
  }
}

export function returnStyleDefinitionStateVariables() {

  let stateVariableDefinitions = {};

  stateVariableDefinitions.setupChildren = {
    returnDependencies: () => ({
      setupChildren: {
        dependencyType: "child",
        childGroups: ["setups"]
      }
    }),
    definition({ dependencyValues }) {
      return { newValues: { setupChildren: dependencyValues.setupChildren } }
    }
  }

  stateVariableDefinitions.styleDefinitions = {
    stateVariablesDeterminingDependencies: ["setupChildren"],
    returnDependencies({ stateValues }) {
      let dependencies = {
        styleDefinitionsChildren: {
          dependencyType: "child",
          childGroups: ["styleDefinitions"],
          variableNames: ["value"]
        },
        ancestorWithStyle: {
          dependencyType: "ancestor",
          variableNames: ["styleDefinitions"]
        },
        styleDefinitionsAndSetupChildren: {
          dependencyType: "child",
          childGroups: ["styleDefinitions", "setups"]
        }
      }

      for (let setupChild of stateValues.setupChildren) {
        dependencies[`styleDefinitionsOf${setupChild.componentName}`] = {
          dependencyType: "child",
          parentName: setupChild.componentName,
          childGroups: ["styleDefinitions"],
          variableNames: ["value"]
        }
      }

      return dependencies;

    },
    definition({ dependencyValues }) {

      let styleDefinitions = {};

      let startingStateVariableDefinitions;

      if (dependencyValues.ancestorWithStyle) {
        startingStateVariableDefinitions = dependencyValues.ancestorWithStyle.stateValues.styleDefinitions;
      }

      if (!startingStateVariableDefinitions) {
        startingStateVariableDefinitions = returnDefaultStyleDefinitions();
      }

      for (let styleNumber in startingStateVariableDefinitions) {
        styleDefinitions[styleNumber] = Object.assign({}, startingStateVariableDefinitions[styleNumber]);
      }


      let styleDefChildNum = 0;

      let styleDefinitionChildren = [];
      for (let child of dependencyValues.styleDefinitionsAndSetupChildren) {
        if (child.componentType === "setup") {
          styleDefinitionChildren.push(...dependencyValues[`styleDefinitionsOf${child.componentName}`]);
        } else {
          styleDefinitionChildren.push(dependencyValues.styleDefinitionsChildren[styleDefChildNum]);
          styleDefChildNum++;
        }
      }


      for (let child of styleDefinitionChildren) {
        let newStyleDefs = child.stateValues.value;

        for (let styleNumber in newStyleDefs) {
          let styleDef = styleDefinitions[styleNumber];
          if (!styleDef) {
            styleDef = styleDefinitions[styleNumber] = Object.assign({}, defaultStyle);
          }
          Object.assign(styleDef, newStyleDefs[styleNumber])
        }
      }

      return { newValues: { styleDefinitions } };

    }
  }

  return stateVariableDefinitions;

}

export function returnSelectedStyleStateVariableDefinition() {

  return {
    selectedStyle: {
      forRenderer: true,
      willNeverBeEssential: true,
      returnDependencies: () => ({
        styleNumber: {
          dependencyType: "stateVariable",
          variableName: "styleNumber",
        },
        ancestorWithStyle: {
          dependencyType: "ancestor",
          variableNames: ["styleDefinitions"]
        }
      }),
      definition: function ({ dependencyValues }) {

        let styleDefinitions = dependencyValues.ancestorWithStyle.stateValues.styleDefinitions;
        if (!styleDefinitions) {
          styleDefinitions = returnDefaultStyleDefinitions();
        }

        let selectedStyle = styleDefinitions[dependencyValues.styleNumber];

        if (selectedStyle === undefined) {
          selectedStyle = defaultStyle;
        }
        return { newValues: { selectedStyle } };
      }
    }
  }

}