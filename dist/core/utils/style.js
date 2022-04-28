
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
  lineColor: "#648FFF",
  lineColorWord: "blue",
  lineWidth: 4,
  lineStyle: "solid",
  markerColor: "#648FFF",
  markerColorWord: "blue",
  markerStyle: "circle",
  markerSize: 3,
  fillColor: "none",
}


function returnDefaultStyleDefinitions() {

  return {
    1: {
      lineColor: "#648FFF",
      lineColorWord: "blue",
      lineWidth: 4,
      lineStyle: "solid",
      markerColor: "#648FFF",
      markerColorWord: "blue",
      markerStyle: "circle",
      markerSize: 3,
      fillColor: "none",
    },
    2: {
      lineColor: "#D4042D",
      lineColorWord: "red",
      lineWidth: 2,
      lineStyle: "solid",
      markerColor: "#D4042D",
      markerColorWord: "red",
      markerStyle: "square",
      markerSize: 4,
      fillColor: "none",
    },
    3: {
      lineColor: "#F19143",
      lineColorWord: "orange",
      lineWidth: 3,
      lineStyle: "solid",
      markerColor: "#F19143",
      markerColorWord: "orange",
      markerStyle: "triangle",
      markerSize: 5,
      fillColor: "none",
    },
    4: {
      lineColor: "#644CD6",
      lineColorWord: "purple",
      lineWidth: 2,
      lineStyle: "solid",
      markerColor: "#644CD6",
      markerColorWord: "purple",
      markerStyle: "diamond",
      markerSize: 4,
      fillColor: "none",
    },
    5: {
      lineColor: "black",
      lineColorWord: "black",
      lineWidth: 1,
      lineStyle: "solid",
      markerColor: "black",
      markerColorWord: "black",
      markerStyle: "circle",
      markerSize: 2,
      fillColor: "none",
    },
    6: {
      lineColor: "gray",
      lineColorWord: "gray",
      lineWidth: 1,
      lineStyle: "dotted",
      markerColor: "gray",
      markerColorWord: "gray",
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
        childGroups: ["setups"],
        proceedIfAllChildrenNotMatched: true,
      }
    }),
    definition({ dependencyValues }) {
      return { setValue: { setupChildren: dependencyValues.setupChildren } }
    }
  }

  stateVariableDefinitions.styleDefinitions = {
    stateVariablesDeterminingDependencies: ["setupChildren"],
    returnDependencies({ stateValues }) {
      let dependencies = {
        ancestorWithStyle: {
          dependencyType: "ancestor",
          variableNames: ["styleDefinitions"]
        },
        setupChildren: {
          dependencyType: "child",
          childGroups: ["setups"],
          proceedIfAllChildrenNotMatched: true,
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


      let styleDefinitionChildren = [];
      for (let child of dependencyValues.setupChildren) {
        styleDefinitionChildren.push(...dependencyValues[`styleDefinitionsOf${child.componentName}`]);
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

      return { setValue: { styleDefinitions } };

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
        return { setValue: { selectedStyle } };
      }
    }
  }

}