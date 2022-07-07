import BlockComponent from './abstract/BlockComponent';


export default class OrbitalDiagram extends BlockComponent {

  static componentType = "orbitalDiagram";

  static variableForPlainMacro = "value";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.labels = {
      createComponentOfType: "textList",
      createStateVariable: "labels",
      defaultValue: [],
    }
    return attributes;
  }


  static returnSugarInstructions() {
    let sugarInstructions = [{
      replacementFunction: function ({ matchedChildren }) {
        if (matchedChildren.length === 1 && typeof matchedChildren[0] !== "string") {
          return { success: false }
        }

        return {
          success: true,
          newChildren: [{
            componentType: "tupleList",
            children: matchedChildren
          }]
        }
      }
    }];

    return sugarInstructions;

  }

  static returnChildGroups() {

    return [{
      group: "tupleLists",
      componentTypes: ["tupleList"],
    },{
      group: "orbitalDiagrams",
      componentTypes: ["orbitalDiagram"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      defaultValue: [{ orbitalText: "", boxes: [] }],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "orbitalDiagram",
      },
      forRenderer: true,
      returnDependencies: () => ({
        orbitalDiagramChildren: {
          dependencyType: "child",
          childGroups: ["orbitalDiagrams"],
          variableNames: ["value"]
        },
        tupleListChildren: {
          dependencyType: "child",
          childGroups: ["tupleLists"],
          variableNames: ["maths"]
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

          if(dependencyValues.orbitalDiagramChildren.length === 1) {
            return dependencyValues.orbitalDiagramChildren[0].stateValues.value;
          }

          let rows = [];
          if (dependencyValues.tupleListChildren[0]?.stateValues.maths.length > 0) {
            let valuesList = dependencyValues.tupleListChildren[0].stateValues.maths;
            for (let [rowInd, row] of valuesList.entries()) {
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

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible }
    })
    this.coreFunctions.resolveAction({ actionId });
  }

  actions = {
    recordVisibilityChange: this.recordVisibilityChange.bind(this),
  }

}
