
export let styleAttributes = {
  lineColor: { componentType: "text" },
  lineColorWord: { componentType: "text" },
  lineColorDarkMode: { componentType: "text" },
  lineColorWordDarkMode: { componentType: "text" },
  lineOpacity: { componentType: "number" },
  lineWidth: { componentType: "number" },
  lineWidthWord: { componentType: "text" },
  lineStyle: { componentType: "text" }, // solid, dashed, dotted
  lineStyleWord: { componentType: "text" },
  markerColor: { componentType: "text" },
  markerColorWord: { componentType: "text" },
  markerColorDarkMode: { componentType: "text" },
  markerColorWordDarkMode: { componentType: "text" },
  // marker styles: cross, circle, square, plus, diamond,
  // triangle (alias for triangleUp), triangleUp, triangleDown, triangleLeft, triangleRight
  markerStyle: { componentType: "text" },
  markerStyleWord: { componentType: "text" },
  markerSize: { componentType: "number" },
  fillColor: { componentType: "text" },
  fillColorWord: { componentType: "text" },
  fillColorDarkMode: { componentType: "text" },
  fillColorWordDarkMode: { componentType: "text" },
  fillOpacity: { componentType: "number" },
}

let defaultStyle = {
  lineColor: "#648FFF",
  lineColorWord: "blue",
  lineColorDarkMode: "#648FFF",
  lineColorWordDarkMode: "blue",
  lineOpacity: 0.7,
  lineWidth: 4,
  lineWidthWord: "thick",
  lineStyle: "solid",
  lineStyleWord: "",
  markerColor: "#648FFF",
  markerColorWord: "blue",
  markerColorDarkMode: "#648FFF",
  markerColorWordDarkMode: "blue",
  markerStyle: "circle",
  markerStyleWord: "point",
  markerSize: 5,
  fillColor: "#648FFF",
  fillColorWord: "blue",
  fillColorDarkMode: "#648FFF",
  fillColorWordDarkMode: "blue",
  fillOpacity: 0.3,
}


function returnDefaultStyleDefinitions() {

  return {
    1: {
      lineColor: "#648FFF",
      lineColorWord: "blue",
      lineColorDarkMode: "#648FFF",
      lineColorWordDarkMode: "blue",
      lineOpacity: 0.7,
      lineWidth: 4,
      lineWidthWord: "thick",
      lineStyle: "solid",
      lineStyleWord: "",
      markerColor: "#648FFF",
      markerColorWord: "blue",
      markerColorDarkMode: "#648FFF",
      markerColorWordDarkMode: "blue",
      markerStyle: "circle",
      markerStyleWord: "point",
      markerSize: 5,
      fillColor: "#648FFF",
      fillColorWord: "blue",
      fillColorDarkMode: "#648FFF",
      fillColorWordDarkMode: "blue",
      fillOpacity: 0.3,
    },
    2: {
      lineColor: "#D4042D",
      lineColorWord: "red",
      lineColorDarkMode: "#D4042D",
      lineColorWordDarkMode: "red",
      lineOpacity: 0.7,
      lineWidth: 2,
      lineWidthWord: "",
      lineStyle: "solid",
      lineStyleWord: "",
      markerColor: "#D4042D",
      markerColorWord: "red",
      markerColorDarkMode: "#D4042D",
      markerColorWordDarkMode: "red",
      markerStyle: "square",
      markerStyleWord: "square",
      markerSize: 5,
      fillColor: "#D4042D",
      fillColorWord: "red",
      fillColorDarkMode: "#D4042D",
      fillColorWordDarkMode: "red",
      fillOpacity: 0.3,
    },
    3: {
      lineColor: "#F19143",
      lineColorWord: "orange",
      lineColorDarkMode: "#F19143",
      lineColorWordDarkMode: "orange",
      lineOpacity: 0.7,
      lineWidth: 3,
      lineWidthWord: "",
      lineStyle: "solid",
      lineStyleWord: "",
      markerColor: "#F19143",
      markerColorWord: "orange",
      markerColorDarkMode: "#F19143",
      markerColorWordDarkMode: "orange",
      markerStyle: "triangle",
      markerStyleWord: "triangle",
      markerSize: 5,
      fillColor: "#F19143",
      fillColorWord: "orange",
      fillColorDarkMode: "#F19143",
      fillColorWordDarkMode: "orange",
      fillOpacity: 0.3,
    },
    4: {
      lineColor: "#644CD6",
      lineColorWord: "purple",
      lineColorDarkMode: "#644CD6",
      lineColorWordDarkMode: "purple",
      lineOpacity: 0.7,
      lineWidth: 2,
      lineWidthWord: "",
      lineStyle: "solid",
      lineStyleWord: "",
      markerColor: "#644CD6",
      markerColorWord: "purple",
      markerColorDarkMode: "#644CD6",
      markerColorWordDarkMode: "purple",
      markerStyle: "diamond",
      markerStyleWord: "diamond",
      markerSize: 5,
      fillColor: "#644CD6",
      fillColorWord: "purple",
      fillColorDarkMode: "#644CD6",
      fillColorWordDarkMode: "purple",
      fillOpacity: 0.3,
    },
    5: {
      lineColor: "black",
      lineColorWord: "black",
      lineColorDarkMode: "white",
      lineColorWordDarkMode: "white",
      lineOpacity: 0.7,
      lineWidth: 1,
      lineWidthWord: "thin",
      lineStyle: "solid",
      lineStyleWord: "",
      markerColor: "black",
      markerColorWord: "black",
      markerColorDarkMode: "white",
      markerColorWordDarkMode: "white",
      markerStyle: "circle",
      markerStyleWord: "point",
      markerSize: 5,
      fillColor: "black",
      fillColorWord: "black",
      fillColorDarkMode: "white",
      fillColorWordDarkMode: "white",
      fillOpacity: 0.3,
    },
    6: {
      lineColor: "gray",
      lineColorWord: "gray",
      lineColorDarkMode: "gray",
      lineColorWordDarkMode: "gray",
      lineOpacity: 0.7,
      lineWidth: 1,
      lineWidthWord: "thin",
      lineStyle: "dotted",
      lineStyleWord: "dotted",
      markerColor: "gray",
      markerColorWord: "gray",
      markerColorDarkMode: "gray",
      markerColorWordDarkMode: "gray",
      markerStyle: "circle",
      markerStyleWord: "point",
      markerSize: 5,
      fillColor: "gray",
      fillColorWord: "gray",
      fillColorDarkMode: "gray",
      fillColorWordDarkMode: "gray",
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
          if ("markerColorDarkMode" in theNewDef && !("markerColorWordDarkMode" in theNewDef)) {
            theNewDef.markerColorWordDarkMode = theNewDef.markerColorDarkMode;
          }
          if ("markerColor" in theNewDef && !("markerColorDarkMode" in theNewDef)) {
            theNewDef.markerColorDarkMode = theNewDef.markerColor;
            theNewDef.markerColorWordDarkMode = theNewDef.markerWordColor;
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
          if ("lineColorDarkMode" in theNewDef && !("lineColorWordDarkMode" in theNewDef)) {
            theNewDef.lineColorWordDarkMode = theNewDef.lineColorDarkMode;
          }
          if ("lineColor" in theNewDef && !("lineColorDarkMode" in theNewDef)) {
            theNewDef.lineColorDarkMode = theNewDef.lineColor;
            theNewDef.lineColorWordDarkMode = theNewDef.lineWordColor;
          }
          if ("fillColor" in theNewDef && !("fillColorWord" in theNewDef)) {
            theNewDef.fillColorWord = theNewDef.fillColor;
          }
          if ("fillColorDarkMode" in theNewDef && !("fillColorWordDarkMode" in theNewDef)) {
            theNewDef.fillColorWordDarkMode = theNewDef.fillColorDarkMode;
          }
          if ("fillColor" in theNewDef && !("fillColorDarkMode" in theNewDef)) {
            theNewDef.fillColorDarkMode = theNewDef.fillColor;
            theNewDef.fillColorWordDarkMode = theNewDef.fillWordColor;
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