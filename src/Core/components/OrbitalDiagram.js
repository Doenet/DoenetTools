import BaseComponent from './abstract/BaseComponent';


export default class OrbitalDiagram extends BaseComponent {

  static componentType = "orbitalDiagram";
  static rendererType = null;

  static variableForPlainMacro = "value";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.values = {
      createComponentOfType: "tupleList",
      createStateVariable: "valuesList",
      defaultValue: [],
    }
    attributes.labels = {
      createComponentOfType: "textList",
      createStateVariable: "labels",
      defaultValue: [],
    }
    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      defaultValue: [{ orbitalText: "", boxes: [] }],
      public: true,
      componentType: "orbitalDiagram",
      returnDependencies: () => ({
        valuesList: {
          dependencyType: "stateVariable",
          variableName: "valuesList"
        },
        labels: {
          dependencyType: "stateVariable",
          variableName: "labels"
        }
      }),
      definition: function ({ dependencyValues }) {

        function processedValues() {

          function boxFromEntry(entry) {
            if (entry === "u" || entry === "U") {
              return "U";
            } else if (entry === "d" || entry === "D") {
              return "D";
            } else if (entry === "e" || entry === "E") {
              return "";
            } else if (Array.isArray(entry) && entry[0] === "*") {
              let str = "";
              for (let fac of entry.slice(1)) {
                if (fac === "u" || fac === "U") {
                  str += "U";
                } else if (fac === "d" || fac === "D") {
                  str += "D";
                } else {
                  // if any factor is not a u or d, create empty box
                  return "";
                }
              }
              return str;
            } else {
              // create empty box
              return "";
            }
          }

          let rows = [];
          if (dependencyValues.valuesList.length > 0) {
            for (let [rowInd, row] in dependencyValues.valuesList.entries()) {
              let orbitalText = "";
              if (dependencyValues.labels[rowInd]) {
                orbitalText = dependencyValues.labels[rowInd];
              }
              let boxes = [];
              if (Array.isArray(row.tree) && row.tree[0] === "tuple") {
                for (let entry of row.tree.slice(1)) {
                  boxes.push(boxFromEntry(entry));
                }
              } else {
                boxes.push(boxFromEntry(row.tree));
              }
              rows.push({ orbitalText, boxes });
            }

            return rows;

          } else {
            return [{ orbitalText: "", boxes: [] }];
          }
        }

        return {
          setValue: {
            value: processedValues()
          }
        };
      },
    }

    return stateVariableDefinitions;

  }

}
