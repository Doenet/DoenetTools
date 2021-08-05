import { processAssignNames } from '../utils/serializedStateProcessing';
import BlockComponent from './abstract/BlockComponent';

export default class Graph extends BlockComponent {
  static componentType = "graph";
  static renderChildren = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.xmin = {
      createComponentOfType: "number",
      createStateVariable: "xmin",
      defaultValue: -10,
      public: true,
      forRenderer: true
    };
    attributes.xmax = {
      createComponentOfType: "number",
      createStateVariable: "xmax",
      defaultValue: 10,
      public: true,
      forRenderer: true
    };
    attributes.ymin = {
      createComponentOfType: "number",
      createStateVariable: "ymin",
      defaultValue: -10,
      public: true,
      forRenderer: true
    };
    attributes.ymax = {
      createComponentOfType: "number",
      createStateVariable: "ymax",
      defaultValue: 10,
      public: true,
      forRenderer: true
    };
    attributes.width = {
      createComponentOfType: "_componentSize",
      createStateVariable: "width",
      defaultValue: { size: 300, isAbsolute: true },
      public: true,
      forRenderer: true,
    };
    attributes.height = {
      createComponentOfType: "_componentSize",
      createStateVariable: "height",
      defaultValue: { size: 300, isAbsolute: true },
      public: true,
      forRenderer: true,
    };
    attributes.identicalAxisScales = {
      createComponentOfType: "boolean",
      createStateVariable: "identicalAxisScales",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };
    attributes.displayXAxis = {
      createComponentOfType: "boolean",
      createStateVariable: "displayXAxis",
      defaultValue: true,
      public: true,
      forRenderer: true
    };
    attributes.displayYAxis = {
      createComponentOfType: "boolean",
      createStateVariable: "displayYAxis",
      defaultValue: true,
      public: true,
      forRenderer: true
    };
    attributes.xlabel = {
      createComponentOfType: "text",
      createStateVariable: "xlabel",
      defaultValue: "",
      public: true,
      forRenderer: true
    };
    attributes.xlabelPosition = {
      createComponentOfType: "text",
      createStateVariable: "xlabelPosition",
      defaultValue: "right",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["right", "left"]
    };
    attributes.ylabel = {
      createComponentOfType: "text",
      createStateVariable: "ylabel",
      defaultValue: "",
      public: true,
      forRenderer: true
    };
    attributes.ylabelPosition = {
      createComponentOfType: "text",
      createStateVariable: "ylabelPosition",
      defaultValue: "top",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["top", "bottom"]
    };
    attributes.ylabelAlignment = {
      createComponentOfType: "text",
      createStateVariable: "ylabelAlignment",
      defaultValue: "left",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["left", "right"]
    };
    attributes.showNavigation = {
      createComponentOfType: "boolean",
      createStateVariable: "showNavigation",
      defaultValue: true,
      public: true,
      forRenderer: true
    };
    return attributes;
  }


  // static returnSugarInstructions() {
  //   let sugarInstructions = super.returnSugarInstructions();

  //   let addCurve = function ({ matchedChildren }) {
  //     // add <curve> around strings and macros, 
  //     //as long as they don't have commas (for points)


  //     // only apply if all children are strings without commas or macros
  //     if (!matchedChildren.every(child =>
  //       child.componentType === "string" && !child.state.value.includes(",") ||
  //       child.doenetAttributes && child.doenetAttributes.createdFromMacro
  //     )) {
  //       return { success: false }
  //     }

  //     return {
  //       success: true,
  //       newChildren: [{ componentType: "curve", children: matchedChildren }],
  //     }
  //   }

  //   sugarInstructions.push({
  //     replacementFunction: addCurve
  //   });

  //   return sugarInstructions;

  // }


  static returnChildGroups() {

    return [{
      group: "graphical",
      componentTypes: ["_graphical"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.graphicalDescendants = {
      forRenderer: true,
      returnDependencies: () => ({
        graphicalDescendants: {
          dependencyType: "descendant",
          componentTypes: ["_graphical"]
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            graphicalDescendants: dependencyValues.graphicalDescendants
          }
        }
      },
    };

    stateVariableDefinitions.nChildrenAdded = {
      defaultValue: 0,
      returnDependencies: () => ({}),
      definition: () => ({ useEssentialOrDefaultValue: { nChildrenAdded: {} } }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "nChildrenAdded",
            value: desiredStateVariableValues.nChildrenAdded
          }]
        }
      }
    }

    stateVariableDefinitions.xscale = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        xmin: {
          dependencyType: "stateVariable",
          variableName: "xmin"
        },
        xmax: {
          dependencyType: "stateVariable",
          variableName: "xmax"
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            xscale: dependencyValues.xmax - dependencyValues.xmin
          }
        }
      }
    }

    stateVariableDefinitions.yscale = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        ymin: {
          dependencyType: "stateVariable",
          variableName: "ymin"
        },
        ymax: {
          dependencyType: "stateVariable",
          variableName: "ymax"
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            yscale: dependencyValues.ymax - dependencyValues.ymin
          }
        }
      }
    }

    return stateVariableDefinitions;
  }

  changeAxisLimits({ xmin, xmax, ymin, ymax }) {

    let updateInstructions = [];

    if (xmin !== undefined) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "xmin",
        value: xmin
      })
    }
    if (xmax !== undefined) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "xmax",
        value: xmax
      })
    }
    if (ymin !== undefined) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "ymin",
        value: ymin
      })
    }
    if (ymax !== undefined) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "ymax",
        value: ymax
      })
    }

    this.coreFunctions.requestUpdate({
      updateInstructions,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          xmin, xmax, ymin, ymax
        }
      }
    })

  }

  addChildren({ serializedComponents }) {

    if (serializedComponents && serializedComponents.length > 0) {

      let processResult = processAssignNames({
        serializedComponents,
        parentName: this.componentName,
        parentCreatesNewNamespace: this.attributes.newNamespace && this.attributes.newNamespace.primitive,
        componentInfoObjects: this.componentInfoObjects,
        indOffset: this.stateValues.nChildrenAdded
      });

      this.coreFunctions.requestUpdate({
        updateInstructions: [{
          updateType: "addComponents",
          serializedComponents: processResult.serializedComponents,
          parentName: this.componentName,
          assignNamesOffset: this.stateValues.nChildrenAdded,
        }, {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "nChildrenAdded",
          value: this.stateValues.nChildrenAdded + processResult.serializedComponents.length,
        }],
      })
    }
  }

  deleteChildren({ number }) {

    let numberToDelete = Math.min(number, this.stateValues.nChildrenAdded);

    if (numberToDelete > 0) {
      let nChildren = this.definingChildren.length;
      let componentNamesToDelete = this.definingChildren
        .slice(nChildren - numberToDelete, nChildren)
        .map(x => x.componentName);

      this.coreFunctions.requestUpdate({
        updateInstructions: [{
          updateType: "deleteComponents",
          componentNames: componentNamesToDelete
        }, {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "nChildrenAdded",
          value: this.stateValues.nChildrenAdded - numberToDelete,
        }],
      })

    }

  }

  actions = {
    changeAxisLimits: this.changeAxisLimits.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
    addChildren: this.addChildren.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
    deleteChildren: this.deleteChildren.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
  };

}
