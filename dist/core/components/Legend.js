import GraphicalComponent from './abstract/GraphicalComponent.js';

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
      validValues: ["upperright", "upperleft", "lowerright", "lowerleft"]
    }

    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "labels",
      componentTypes: ["label"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.legendElements = {
      forRenderer: true,
      returnDependencies: () => ({
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["graphicalDescendants"]
        },
        labelChildren: {
          dependencyType: "child",
          childGroups: ["labels"],
          variableNames: ["value", "hasLatex"]
        }
      }),
      definition({ dependencyValues, componentInfoObjects }) {

        let legendElements = [];

        if (dependencyValues.graphAncestor) {

          let labels = [];
          for (let labelChild of dependencyValues.labelChildren) {
            labels.push(labelChild.stateValues)
          }

          let pointStyleNumbersFound = [];
          let otherStyleNumbersFound = [];

          for (let comp of dependencyValues.graphAncestor.stateValues.graphicalDescendants) {
            let selectedStyle = comp.stateValues.selectedStyle;
            let styleNumber = comp.stateValues.styleNumber;
            if (comp.componentType === "legend") {
              continue;
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: comp.componentType,
              baseComponentType: "point"
            })) {
              if (!pointStyleNumbersFound.includes(styleNumber)) {
                pointStyleNumbersFound.push(styleNumber);
                legendElements.push({
                  legendType: "marker",
                  markerStyle: selectedStyle.markerStyle,
                  markerColor: selectedStyle.markerColor,
                  markerSize: selectedStyle.markerSize,
                  label: labels[legendElements.length]
                })
              }
            } else {
              if (!otherStyleNumbersFound.includes(styleNumber)) {
                otherStyleNumbersFound.push(styleNumber);
                legendElements.push({
                  legendType: "line",
                  lineStyle: selectedStyle.lineStyle,
                  lineColor: selectedStyle.lineColor,
                  lineWidth: selectedStyle.lineWidth,
                  label: labels[legendElements.length]
                })
              }
            }
          }
        }
        return { setValue: { legendElements } }
      }

    }

    stateVariableDefinitions.graphLimits = {
      forRenderer: true,
      returnDependencies: () => ({
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["xmin", "xmax", "ymin", "ymax"]
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.graphAncestor) {
          return {
            setValue: { graphLimits: dependencyValues.graphAncestor.stateValues }
          }
        } else {
          return { setValue: { graphLimits: null } };
        }
      }
    }

    return stateVariableDefinitions;
  }



}