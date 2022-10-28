
export let styleAttributes = {
  lineColor: { componentType: "text" },
  lineColorWord: { componentType: "text" },
  lineOpacity: { componentType: "number" },
  lineWidth: { componentType: "number" },
  lineWidthWord: { componentType: "text" },
  lineStyle: { componentType: "text" }, // solid, dashed, dotted
  lineStyleWord: { componentType: "text" },
  markerColor: { componentType: "text" },
  markerColorWord: { componentType: "text" },
  // marker styles: cross, circle, square, plus, diamond,
  // triangle (alias for triangleUp), triangleUp, triangleDown, triangleLeft, triangleRight
  markerStyle: { componentType: "text" },
  markerStyleWord: { componentType: "text" },
  markerSize: { componentType: "number" },
  fillColor: { componentType: "text" },
  fillColorWord: { componentType: "text" },
  fillOpacity: { componentType: "number" },
}

let defaultStyle = {
  lineColor: "#648FFF",
  lineColorWord: "blue",
  lineOpacity: 0.7,
  lineWidth: 4,
  lineWidthWord: "thick",
  lineStyle: "solid",
  lineStyleWord: "",
  markerColor: "#648FFF",
  markerColorWord: "blue",
  markerStyle: "circle",
  markerStyleWord: "point",
  markerSize: 4,
  fillColor: "none",
  fillColorWord: "none",
  fillOpacity: 0.3,
}


function returnDefaultStyleDefinitions() {

  return {
    1: {
      lineColor: "#648FFF",
      lineColorWord: "blue",
      lineOpacity: 0.7,
      lineWidth: 4,
      lineWidthWord: "thick",
      lineStyle: "solid",
      lineStyleWord: "",
      markerColor: "#648FFF",
      markerColorWord: "blue",
      markerStyle: "circle",
      markerStyleWord: "point",
      markerSize: 4,
      fillColor: "none",
      fillColorWord: "none",
      fillOpacity: 0.3,
    },
    2: {
      lineColor: "#D4042D",
      lineColorWord: "red",
      lineOpacity: 0.7,
      lineWidth: 2,
      lineWidthWord: "",
      lineStyle: "solid",
      lineStyleWord: "",
      markerColor: "#D4042D",
      markerColorWord: "red",
      markerStyle: "square",
      markerStyleWord: "square",
      markerSize: 4,
      fillColor: "none",
      fillColorWord: "none",
      fillOpacity: 0.3,
    },
    3: {
      lineColor: "#F19143",
      lineColorWord: "orange",
      lineOpacity: 0.7,
      lineWidth: 3,
      lineWidthWord: "",
      lineStyle: "solid",
      lineStyleWord: "",
      markerColor: "#F19143",
      markerColorWord: "orange",
      markerStyle: "triangle",
      markerStyleWord: "triangle",
      markerSize: 4,
      fillColor: "none",
      fillColorWord: "none",
      fillOpacity: 0.3,
    },
    4: {
      lineColor: "#644CD6",
      lineColorWord: "purple",
      lineOpacity: 0.7,
      lineWidth: 2,
      lineWidthWord: "",
      lineStyle: "solid",
      lineStyleWord: "",
      markerColor: "#644CD6",
      markerColorWord: "purple",
      markerStyle: "diamond",
      markerStyleWord: "diamond",
      markerSize: 4,
      fillColor: "none",
      fillColorWord: "none",
      fillOpacity: 0.3,
    },
    5: {
      lineColor: "black",
      lineColorWord: "black",
      lineOpacity: 0.7,
      lineWidth: 1,
      lineWidthWord: "thin",
      lineStyle: "solid",
      lineStyleWord: "",
      markerColor: "black",
      markerColorWord: "black",
      markerStyle: "circle",
      markerStyleWord: "point",
      markerSize: 4,
      fillColor: "none",
      fillColorWord: "none",
      fillOpacity: 0.3,
    },
    6: {
      lineColor: "gray",
      lineColorWord: "gray",
      lineOpacity: 0.7,
      lineWidth: 1,
      lineWidthWord: "thin",
      lineStyle: "dotted",
      lineStyleWord: "dotted",
      markerColor: "gray",
      markerColorWord: "gray",
      markerStyle: "circle",
      markerStyleWord: "point",
      markerSize: 4,
      fillColor: "none",
      fillColorWord: "none",
      fillOpacity: 0.3,
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

          let theNewDef = Object.assign({}, newStyleDefs[styleNumber]);
          if ("markerColor" in theNewDef && !("markerColorWord" in theNewDef)) {
            theNewDef.markerColorWord = theNewDef.markerColor;
          }
          if ("markerStyle" in theNewDef && !("markerStyleWord" in theNewDef)) {
            theNewDef.markerStyleWord = theNewDef.markerStyle;
            if (theNewDef.markerStyleWord === "circle") {
              theNewDef.markerStyleWord = "point";
            } else if (theNewDef.markerStyleWord.slice(0, 8) === "triangle") {
              theNewDef.markerStyleWord = "triangle";
            }
          }
          if ("lineColor" in theNewDef && !("lineColorWord" in theNewDef)) {
            theNewDef.lineColorWord = theNewDef.lineColor;
          }
          if ("fillColor" in theNewDef && !("fillColorWord" in theNewDef)) {
            theNewDef.fillColorWord = theNewDef.fillColor;
          }
          if ("lineWidth" in theNewDef && !("lineWidthWord" in theNewDef)) {
            if (theNewDef.lineWidth >= 4) {
              theNewDef.lineWidthWord = "thick";
            } else if (theNewDef.lineWidth <= 1) {
              theNewDef.lineWidthWord = "thin";
            } else {
              theNewDef.lineWidthWord = "";
            }
          }
          if ("lineStyle" in theNewDef && !("lineStyleWord" in theNewDef)) {
            if (theNewDef.lineStyle === "dashed") {
              theNewDef.lineStyleWord = "dashed";
            } else if (theNewDef.lineStyle === "dotted") {
              theNewDef.lineStyleWord = "dotted";
            } else {
              theNewDef.lineStyleWord = "";
            }
          }

          Object.assign(styleDef, theNewDef);


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