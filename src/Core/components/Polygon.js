import Polyline from "./Polyline";

export default class Polygon extends Polyline {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      movePolygon: this.movePolygon.bind(this),
      polygonClicked: this.polygonClicked.bind(this),
      polygonFocused: this.polygonFocused.bind(this),
    });
  }
  static componentType = "polygon";
  static representsClosedPath = true;

  get movePolygon() {
    return this.movePolyline;
  }

  get polygonClicked() {
    return this.polylineClicked;
  }

  get polygonFocused() {
    return this.polylineFocused;
  }

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.filled = {
      createComponentOfType: "boolean",
      createStateVariable: "filled",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.styleDescription = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
        filled: {
          dependencyType: "stateVariable",
          variableName: "filled",
        },
        document: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: ["theme"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let lineColorWord;
        if (dependencyValues.document?.stateValues.theme === "dark") {
          lineColorWord = dependencyValues.selectedStyle.lineColorWordDarkMode;
        } else {
          lineColorWord = dependencyValues.selectedStyle.lineColorWord;
        }

        let borderDescription = dependencyValues.selectedStyle.lineWidthWord;
        if (dependencyValues.selectedStyle.lineStyleWord) {
          if (borderDescription) {
            borderDescription += " ";
          }
          borderDescription += dependencyValues.selectedStyle.lineStyleWord;
        }
        if (borderDescription) {
          borderDescription += " ";
        }

        let styleDescription;
        if (!dependencyValues.filled) {
          styleDescription = borderDescription + lineColorWord;
        } else {
          let fillColorWord;
          if (dependencyValues.document?.stateValues.theme === "dark") {
            fillColorWord =
              dependencyValues.selectedStyle.fillColorWordDarkMode;
          } else {
            fillColorWord = dependencyValues.selectedStyle.fillColorWord;
          }

          if (fillColorWord === lineColorWord) {
            styleDescription = "filled " + fillColorWord;
            if (borderDescription) {
              styleDescription += " with " + borderDescription + "border";
            }
          } else {
            styleDescription =
              "filled " +
              fillColorWord +
              " with " +
              borderDescription +
              lineColorWord +
              " border";
          }
        }

        return { setValue: { styleDescription } };
      },
    };

    stateVariableDefinitions.styleDescriptionWithNoun = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
        filled: {
          dependencyType: "stateVariable",
          variableName: "filled",
        },
        document: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: ["theme"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let lineColorWord;
        if (dependencyValues.document?.stateValues.theme === "dark") {
          lineColorWord = dependencyValues.selectedStyle.lineColorWordDarkMode;
        } else {
          lineColorWord = dependencyValues.selectedStyle.lineColorWord;
        }

        let borderDescription = dependencyValues.selectedStyle.lineWidthWord;
        if (dependencyValues.selectedStyle.lineStyleWord) {
          if (borderDescription) {
            borderDescription += " ";
          }
          borderDescription += dependencyValues.selectedStyle.lineStyleWord;
        }
        if (borderDescription) {
          borderDescription += " ";
        }

        let styleDescriptionWithNoun;
        if (!dependencyValues.filled) {
          styleDescriptionWithNoun =
            borderDescription + lineColorWord + " polygon";
        } else {
          let fillColorWord;
          if (dependencyValues.document?.stateValues.theme === "dark") {
            fillColorWord =
              dependencyValues.selectedStyle.fillColorWordDarkMode;
          } else {
            fillColorWord = dependencyValues.selectedStyle.fillColorWord;
          }

          if (fillColorWord === lineColorWord) {
            styleDescriptionWithNoun = "filled " + fillColorWord + " polygon";
            if (borderDescription) {
              styleDescriptionWithNoun +=
                " with a " + borderDescription + "border";
            }
          } else {
            styleDescriptionWithNoun =
              "filled " +
              fillColorWord +
              " polygon with a " +
              borderDescription +
              lineColorWord +
              " border";
          }
        }

        return { setValue: { styleDescriptionWithNoun } };
      },
    };

    stateVariableDefinitions.borderStyleDescription = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
        document: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: ["theme"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let lineColorWord;
        if (dependencyValues.document?.stateValues.theme === "dark") {
          lineColorWord = dependencyValues.selectedStyle.lineColorWordDarkMode;
        } else {
          lineColorWord = dependencyValues.selectedStyle.lineColorWord;
        }

        let borderStyleDescription =
          dependencyValues.selectedStyle.lineWidthWord;
        if (dependencyValues.selectedStyle.lineStyleWord) {
          if (borderStyleDescription) {
            borderStyleDescription += " ";
          }
          borderStyleDescription +=
            dependencyValues.selectedStyle.lineStyleWord;
        }

        if (borderStyleDescription) {
          borderStyleDescription += " ";
        }

        borderStyleDescription += lineColorWord;

        return { setValue: { borderStyleDescription } };
      },
    };

    stateVariableDefinitions.fillStyleDescription = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
        filled: {
          dependencyType: "stateVariable",
          variableName: "filled",
        },
        document: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: ["theme"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let fillColorWord;
        if (dependencyValues.document?.stateValues.theme === "dark") {
          fillColorWord = dependencyValues.selectedStyle.fillColorWordDarkMode;
        } else {
          fillColorWord = dependencyValues.selectedStyle.fillColorWord;
        }

        let fillStyleDescription;
        if (!dependencyValues.filled) {
          fillStyleDescription = "unfilled";
        } else {
          fillStyleDescription = fillColorWord;
        }

        return { setValue: { fillStyleDescription } };
      },
    };

    // overwrite nearestPoint so that it includes
    // segement between first and last vertex
    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
        numericalVertices: {
          dependencyType: "stateVariable",
          variableName: "numericalVertices",
        },
        numVertices: {
          dependencyType: "stateVariable",
          variableName: "numVertices",
        },
      }),
      definition({ dependencyValues }) {
        let nDimensions = dependencyValues.nDimensions;
        let numVertices = dependencyValues.numVertices;
        let numericalVertices = dependencyValues.numericalVertices;

        let vals = [];
        let prPtx, prPty;
        let nxPtx = numericalVertices[numVertices - 1]?.[0];
        let nxPty = numericalVertices[numVertices - 1]?.[1];

        for (let i = 0; i < numVertices; i++) {
          prPtx = nxPtx;
          prPty = nxPty;

          nxPtx = numericalVertices[i]?.[0];
          nxPty = numericalVertices[i]?.[1];

          // only implement for constants
          if (
            !(
              Number.isFinite(prPtx) &&
              Number.isFinite(prPty) &&
              Number.isFinite(nxPtx) &&
              Number.isFinite(nxPty)
            )
          ) {
            vals.push(null);
          } else {
            let BA1sub = nxPtx - prPtx;
            let BA2sub = nxPty - prPty;

            if (BA1sub === 0 && BA2sub === 0) {
              vals.push(null);
            } else {
              vals.push([BA1sub, BA2sub]);
            }
          }
        }

        return {
          setValue: {
            nearestPoint: function ({ variables, scales }) {
              let xscale = scales[0];
              let yscale = scales[1];

              // only implemented in 2D for now
              if (nDimensions !== 2 || numVertices === 0) {
                return {};
              }

              let closestDistance2 = Infinity;
              let closestResult = {};

              let x1 = variables.x1?.evaluate_to_constant();
              let x2 = variables.x2?.evaluate_to_constant();

              let prevPtx, prevPty;
              let nextPtx = numericalVertices[numVertices - 1][0];
              let nextPty = numericalVertices[numVertices - 1][1];

              for (let i = 0; i < numVertices; i++) {
                prevPtx = nextPtx;
                prevPty = nextPty;

                nextPtx = numericalVertices[i][0];
                nextPty = numericalVertices[i][1];

                let val = vals[i];
                if (val === null) {
                  continue;
                }

                let BA1 = val[0] / xscale;
                let BA2 = val[1] / yscale;
                let denom = BA1 * BA1 + BA2 * BA2;

                let t =
                  (((x1 - prevPtx) / xscale) * BA1 +
                    ((x2 - prevPty) / yscale) * BA2) /
                  denom;

                let result;

                if (t <= 0) {
                  result = { x1: prevPtx, x2: prevPty };
                } else if (t >= 1) {
                  result = { x1: nextPtx, x2: nextPty };
                } else {
                  result = {
                    x1: prevPtx + t * BA1 * xscale,
                    x2: prevPty + t * BA2 * yscale,
                  };
                }

                let distance2 =
                  Math.pow((x1 - result.x1) / xscale, 2) +
                  Math.pow((x2 - result.x2) / yscale, 2);

                if (distance2 < closestDistance2) {
                  closestDistance2 = distance2;
                  closestResult = result;
                }
              }

              if (
                variables.x3 !== undefined &&
                Object.keys(closestResult).length > 0
              ) {
                closestResult.x3 = 0;
              }

              return closestResult;
            },
          },
        };
      },
    };
    return stateVariableDefinitions;
  }
}
