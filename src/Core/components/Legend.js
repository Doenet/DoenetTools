import GraphicalComponent from "./abstract/GraphicalComponent";

export default class Legend extends GraphicalComponent {
  static componentType = "legend";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.position = {
      createComponentOfType: "text",
      createStateVariable: "position",
      defaultValue: "upperright",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["upperright", "upperleft", "lowerright", "lowerleft"],
    };

    attributes.displayClosedSwatches = {
      createComponentOfType: "boolean",
      createStateVariable: "displayClosedSwatches",
      defaultValue: false,
      public: true,
    };

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "labels",
        componentTypes: ["label"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.graphicalElementNames = {
      returnDependencies: () => ({
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["graphicalDescendants"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.graphAncestor) {
          return {
            setValue: {
              graphicalElementNames:
                dependencyValues.graphAncestor.stateValues.graphicalDescendants.map(
                  (x) => x.componentName,
                ),
            },
          };
        } else {
          return { setValue: { graphicalElementNames: null } };
        }
      },
    };

    stateVariableDefinitions.legendElements = {
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["graphicalElementNames"],
      returnDependencies: ({ stateValues }) => {
        let dependencies = {
          labelChildren: {
            dependencyType: "child",
            childGroups: ["labels"],
            variableNames: ["value", "hasLatex", "forObjectComponentName"],
          },
          displayClosedSwatches: {
            dependencyType: "stateVariable",
            variableName: "displayClosedSwatches",
          },
        };

        if (stateValues.graphicalElementNames) {
          dependencies.numGraphicalElements = {
            dependencyType: "value",
            value: stateValues.graphicalElementNames.length,
          };
          for (let [
            ind,
            cName,
          ] of stateValues.graphicalElementNames.entries()) {
            dependencies[`graphicalElement${ind}`] = {
              dependencyType: "multipleStateVariables",
              componentName: cName,
              variableNames: ["selectedStyle", "styleNumber", "filled"],
              variablesOptional: true,
            };
            dependencies[`graphicalElement${ind}AdapterSource`] = {
              dependencyType: "adapterSource",
              componentName: cName,
            };
            dependencies[`graphicalElement${ind}ShadowSource`] = {
              dependencyType: "shadowSource",
              componentName: cName,
            };
          }
        }

        return dependencies;
      },
      definition({ dependencyValues, componentInfoObjects }) {
        let legendElements = [];

        if (dependencyValues.numGraphicalElements > 0) {
          let pointStyleNumbersFound = [];
          let closedPathStyleNumbersFound = [];
          let otherStyleNumbersFound = [];

          let graphicalDescendantsLeft = [];
          for (
            let ind = 0;
            ind < dependencyValues.numGraphicalElements;
            ind++
          ) {
            let graphicalElement = dependencyValues[`graphicalElement${ind}`];
            let adapter =
              dependencyValues[`graphicalElement${ind}AdapterSource`];
            if (adapter) {
              // if have adapter, use that componentName instead,
              // since that would be the name used in forObjectComponentName
              graphicalElement = { ...graphicalElement };
              graphicalElement.componentName = adapter.componentName;
            }
            if (graphicalElement.componentName.slice(0, 3) === "/__") {
              let shadowSource =
                dependencyValues[`graphicalElement${ind}ShadowSource`];
              if (shadowSource) {
                // if have shadow source, use that componentName instead,
                graphicalElement = { ...graphicalElement };
                graphicalElement.componentName = shadowSource.componentName;
              }
            }
            graphicalDescendantsLeft.push(graphicalElement);
          }

          let graphicalDescendantComponentNamesLeft =
            graphicalDescendantsLeft.map((x) => x.componentName);

          let labelsInOrder = [];
          let labelsByComponentName = {};
          for (let labelChild of dependencyValues.labelChildren) {
            let labelInfo = {
              value: labelChild.stateValues.value,
              hasLatex: labelChild.stateValues.hasLatex,
            };
            if (labelChild.stateValues.forObjectComponentName) {
              labelsByComponentName[
                labelChild.stateValues.forObjectComponentName
              ] = labelInfo;

              // in this first pass, we only mark the styleNumber as being taken
              // so that in the second pass, undesignated labels skip this style number
              // even if they come before this label
              let ind = graphicalDescendantComponentNamesLeft.indexOf(
                labelChild.stateValues.forObjectComponentName,
              );
              if (ind !== -1) {
                let comp = graphicalDescendantsLeft[ind];
                if (
                  componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: comp.componentType,
                    baseComponentType: "point",
                  })
                ) {
                  pointStyleNumbersFound.push(comp.stateValues.styleNumber);
                } else if (
                  dependencyValues.displayClosedSwatches &&
                  componentInfoObjects.allComponentClasses[comp.componentType]
                    .representsClosedPath
                ) {
                  closedPathStyleNumbersFound.push(
                    comp.stateValues.styleNumber,
                  );
                } else if (comp.componentType !== "legend") {
                  otherStyleNumbersFound.push(comp.stateValues.styleNumber);
                }
              }
            }
            labelsInOrder.push({
              labelInfo,
              forObject: labelChild.stateValues.forObjectComponentName,
            });
          }

          // first find any style numbers found by labels with designated targets

          for (let label of labelsInOrder) {
            let componentForLabel;
            if (label.forObject) {
              let ind = graphicalDescendantComponentNamesLeft.indexOf(
                label.forObject,
              );
              if (ind !== -1) {
                componentForLabel = graphicalDescendantsLeft[ind];
                graphicalDescendantsLeft.splice(ind, 1);
                graphicalDescendantComponentNamesLeft.splice(ind, 1);
              }
            } else {
              for (let ind = 0; ind < graphicalDescendantsLeft.length; ind++) {
                let comp = graphicalDescendantsLeft[ind];
                if (!(comp.componentName in labelsByComponentName)) {
                  if (
                    componentInfoObjects.isInheritedComponentType({
                      inheritedComponentType: comp.componentType,
                      baseComponentType: "point",
                    })
                  ) {
                    if (
                      !pointStyleNumbersFound.includes(
                        comp.stateValues.styleNumber,
                      )
                    ) {
                      componentForLabel = comp;
                      break;
                    }
                  } else if (
                    dependencyValues.displayClosedSwatches &&
                    componentInfoObjects.allComponentClasses[comp.componentType]
                      .representsClosedPath
                  ) {
                    if (
                      !closedPathStyleNumbersFound.includes(
                        comp.stateValues.styleNumber,
                      )
                    ) {
                      componentForLabel = comp;
                      break;
                    }
                  } else if (comp.componentType !== "legend") {
                    if (
                      !otherStyleNumbersFound.includes(
                        comp.stateValues.styleNumber,
                      )
                    ) {
                      componentForLabel = comp;
                      break;
                    }
                  }
                }
              }
            }

            if (componentForLabel) {
              let selectedStyle = componentForLabel.stateValues.selectedStyle;
              let styleNumber = componentForLabel.stateValues.styleNumber;
              if (
                componentInfoObjects.isInheritedComponentType({
                  inheritedComponentType: componentForLabel.componentType,
                  baseComponentType: "point",
                })
              ) {
                pointStyleNumbersFound.push(styleNumber);
                legendElements.push({
                  swatchType: "marker",
                  markerStyle: selectedStyle.markerStyle,
                  markerColor: selectedStyle.markerColor,
                  markerSize: selectedStyle.markerSize,
                  lineOpacity: selectedStyle.lineOpacity,
                  label: label.labelInfo,
                });
              } else if (
                dependencyValues.displayClosedSwatches &&
                componentInfoObjects.allComponentClasses[
                  componentForLabel.componentType
                ].representsClosedPath
              ) {
                closedPathStyleNumbersFound.push(styleNumber);
                legendElements.push({
                  swatchType: "rectangle",
                  lineStyle: selectedStyle.lineStyle,
                  lineColor: selectedStyle.lineColor,
                  lineWidth: selectedStyle.lineWidth,
                  lineOpacity: selectedStyle.lineOpacity,
                  fillColor: selectedStyle.fillColor,
                  filled: componentForLabel.stateValues.filled,
                  fillOpacity: selectedStyle.fillOpacity,
                  label: label.labelInfo,
                });
              } else {
                otherStyleNumbersFound.push(styleNumber);
                legendElements.push({
                  swatchType: "line",
                  lineStyle: selectedStyle.lineStyle,
                  lineColor: selectedStyle.lineColor,
                  lineWidth: selectedStyle.lineWidth,
                  lineOpacity: selectedStyle.lineOpacity,
                  label: label.labelInfo,
                });
              }
            }
          }
        }
        return { setValue: { legendElements } };
      },
    };

    stateVariableDefinitions.graphLimits = {
      forRenderer: true,
      returnDependencies: () => ({
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["xmin", "xmax", "ymin", "ymax"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.graphAncestor) {
          return {
            setValue: {
              graphLimits: dependencyValues.graphAncestor.stateValues,
            },
          };
        } else {
          return { setValue: { graphLimits: null } };
        }
      },
    };

    return stateVariableDefinitions;
  }
}
