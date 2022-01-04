import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';
import { convertValueToMathExpression } from '../utils/math';

export default class Ray extends GraphicalComponent {
  static componentType = "ray";

  actions = {
    moveRay: this.moveRay.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
    finalizeRayPosition: this.finalizeRayPosition.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
  };

  // used when referencing this component without prop
  static get stateVariablesShadowedForReference() { return ["endpoint"] };

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true
    };

    attributes.endpoint = {
      createComponentOfType: "point"
    }
    attributes.through = {
      createComponentOfType: "point"
    }

    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.styleDescription = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
      }),
      definition: function ({ dependencyValues }) {

        let lineDescription = "";
        if (dependencyValues.selectedStyle.lineWidth >= 4) {
          lineDescription += "thick ";
        } else if (dependencyValues.selectedStyle.lineWidth <= 1) {
          lineDescription += "thin ";
        }
        if (dependencyValues.selectedStyle.lineStyle === "dashed") {
          lineDescription += "dashed ";
        } else if (dependencyValues.selectedStyle.lineStyle === "dotted") {
          lineDescription += "dotted ";
        }

        lineDescription += dependencyValues.selectedStyle.lineColor;

        return { newValues: { styleDescription: lineDescription } };
      }
    }


    stateVariableDefinitions.nDimensions = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        endpointAttr: {
          dependencyType: "attributeComponent",
          attributeName: "endpoint",
          variableNames: ["nDimensions"],
        },
        throughAttr: {
          dependencyType: "attributeComponent",
          attributeName: "through",
          variableNames: ["nDimensions"],
        }
      }),
      definition: function ({ dependencyValues }) {

        // console.log('definition of nDimensions')
        // console.log(dependencyValues)

        if (dependencyValues.endpointAttr !== null) {
          let nDimensions = dependencyValues.endpointAttr.stateValues.nDimensions;
          if (dependencyValues.throughAttr !== null && dependencyValues.throughAttr.stateValues.nDimensions !== nDimensions) {
            console.warn("Invalid ray: endpoint and through dimensions do not match");
            nDimensions = null;
          }

          return {
            newValues: { nDimensions },
            checkForActualChange: { nDimensions: true }
          }
        } else if (dependencyValues.throughAttr !== null) {
          let nDimensions = dependencyValues.throughAttr.stateValues.nDimensions;
          return {
            newValues: { nDimensions },
            checkForActualChange: { nDimensions: true }
          }

        } else {

          // line segment through zero points
          return { newValues: { nDimensions: 2 } }
        }

      }
    }

    stateVariableDefinitions.endpoint = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["endpointX"],
      defaultEntryValue: me.fromAst(0),
      returnWrappingComponents(prefix) {
        if (prefix === "endpointX") {
          return [];
        } else {
          // entire array
          // wrap by both <point> and <xs>
          return [["point", { componentType: "mathList", isAttribute: "xs" }]];
        }
      },
      returnArraySizeDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;

          dependenciesByKey[arrayKey] = {
            endpointAttr: {
              dependencyType: "attributeComponent",
              attributeName: "endpoint",
              variableNames: [`x${varEnding}`],
            }
          };
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        // console.log('array definition of xs')
        // console.log(deepClone(dependencyValuesByKey))
        // console.log(deepClone(arrayKeys));

        let endpoint = {};
        let essentialEndpoint = {};

        for (let arrayKey of arrayKeys) {

          if (dependencyValuesByKey[arrayKey].endpointAttr !== null) {
            let varEnding = Number(arrayKey) + 1;
            endpoint[arrayKey] = dependencyValuesByKey[arrayKey].endpointAttr.stateValues[`x${varEnding}`];
          } else {
            essentialEndpoint[arrayKey] = {
              variablesToCheck: [
                { variableName: "endpoint", arrayIndex: arrayKey },
              ]
            };
          }
        }

        let result = {};
        if (Object.keys(endpoint).length > 0) {
          result.newValues = { endpoint };
        }
        if (Object.keys(essentialEndpoint).length > 0) {
          result.useEssentialOrDefaultValue = { endpoint: essentialEndpoint };
        }
        return result;

      },
      async inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyValuesByKey, dependencyNamesByKey,
        initialChange, stateValues,
      }) {

        // console.log('invert endpoint')
        // console.log(desiredStateVariableValues);
        // console.log(dependencyValuesByKey);
        // console.log(dependencyNamesByKey);

        // if not draggable, then disallow initial change 
        if (initialChange && !await stateValues.draggable) {
          return { success: false };
        }


        let instructions = [];
        for (let arrayKey of Object.keys(desiredStateVariableValues.endpoint).reverse()) {

          if (dependencyValuesByKey[arrayKey].endpointAttr !== null) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].endpointAttr,
              desiredValue: desiredStateVariableValues.endpoint[arrayKey],
              variableIndex: 0,
            })

          } else {

            instructions.push({
              setStateVariable: "endpoint",
              value: { [arrayKey]: desiredStateVariableValues.endpoint[arrayKey] }
            });
          }
        }

        return {
          success: true,
          instructions
        }

      },
    }

    stateVariableDefinitions.throughpoint = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["throughpointX"],
      returnWrappingComponents(prefix) {
        if (prefix === "throughpointX") {
          return [];
        } else {
          // entire array
          // wrap by both <point> and <xs>
          return [["point", { componentType: "mathList", isAttribute: "xs" }]];
        }
      },
      returnArraySizeDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;

          dependenciesByKey[arrayKey] = {
            throughpointAttr: {
              dependencyType: "attributeComponent",
              attributeName: "through",
              variableNames: [`x${varEnding}`],
            }
          };
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        // console.log('array definition of xs')
        // console.log(deepClone(dependencyValuesByKey))
        // console.log(deepClone(arrayKeys));

        let throughpoint = {};
        let essentialThroughpoint = {};

        for (let arrayKey of arrayKeys) {

          if (dependencyValuesByKey[arrayKey].throughpointAttr !== null) {
            let varEnding = Number(arrayKey) + 1;
            throughpoint[arrayKey] = dependencyValuesByKey[arrayKey].throughpointAttr.stateValues[`x${varEnding}`];
          } else {
            let defaultValue;
            if (arrayKey === "0") {
              defaultValue = me.fromAst(1);
            } else {
              defaultValue = me.fromAst(0);
            }

            essentialThroughpoint[arrayKey] = {
              variablesToCheck: [
                { variableName: "throughpoint", arrayIndex: arrayKey },
              ],
              defaultValue
            };
          }
        }

        let result = {};
        if (Object.keys(throughpoint).length > 0) {
          result.newValues = { throughpoint };
        }
        if (Object.keys(essentialThroughpoint).length > 0) {
          result.useEssentialOrDefaultValue = { throughpoint: essentialThroughpoint };
        }
        return result;

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyValuesByKey, dependencyNamesByKey,
        initialChange, stateValues,
      }) {

        // console.log('invert xs')
        // console.log(desiredStateVariableValues);
        // console.log(dependencyValuesByKey);
        // console.log(dependencyNamesByKey);

        // if not draggable, then disallow initial change 
        if (initialChange && !stateValues.draggable) {
          return { success: false };
        }


        let instructions = [];
        for (let arrayKey of Object.keys(desiredStateVariableValues.throughpoint).reverse()) {

          if (dependencyValuesByKey[arrayKey].throughpointAttr !== null) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].throughpointAttr,
              desiredValue: desiredStateVariableValues.throughpoint[arrayKey],
              variableIndex: 0,
            })

          } else {

            instructions.push({
              setStateVariable: "throughpoint",
              value: { [arrayKey]: desiredStateVariableValues.throughpoint[arrayKey] }
            });
          }
        }

        return {
          success: true,
          instructions
        }

      },
    }


    stateVariableDefinitions.numericalEndpoint = {
      forRenderer: true,
      returnDependencies() {
        return {
          nDimensions: {
            dependencyType: "stateVariable",
            variableName: "nDimensions",
          },
          endpoint: {
            dependencyType: "stateVariable",
            variableName: "endpoint",
          },
        }

      },

      definition({ dependencyValues }) {
        if (Number.isNaN(dependencyValues.nDimensions)) {
          return null;
        }

        let endpoint = dependencyValues.endpoint;
        let numericalEndpoint = [];
        for (let ind = 0; ind < dependencyValues.nDimensions; ind++) {
          let val = endpoint[ind].evaluate_to_constant();
          if (!Number.isFinite(val)) {
            val = NaN;
          }
          numericalEndpoint.push(val);
        }


        return { newValues: { numericalEndpoint } }
      }
    }

    stateVariableDefinitions.numericalThroughpoint = {
      forRenderer: true,
      returnDependencies() {
        return {
          nDimensions: {
            dependencyType: "stateVariable",
            variableName: "nDimensions",
          },
          throughpoint: {
            dependencyType: "stateVariable",
            variableName: "throughpoint",
          },
        }

      },

      definition({ dependencyValues }) {
        if (Number.isNaN(dependencyValues.nDimensions)) {
          return null;
        }

        let throughpoint = dependencyValues.throughpoint;
        let numericalThroughpoint = [];
        for (let ind = 0; ind < dependencyValues.nDimensions; ind++) {
          let val = throughpoint[ind].evaluate_to_constant();
          if (!Number.isFinite(val)) {
            val = NaN;
          }
          numericalThroughpoint.push(val);
        }


        return { newValues: { numericalThroughpoint } }
      }
    }


    // stateVariableDefinitions.nearestPoint = {
    //   returnDependencies: () => ({
    //     nDimensions: {
    //       dependencyType: "stateVariable",
    //       variableName: "nDimensions"
    //     },
    //     endpoint: {
    //       dependencyType: "stateVariable",
    //       variableName: "endpoint"
    //     },
    //   }),
    //   definition: ({ dependencyValues }) => ({
    //     newValues: {
    //       nearestPoint: function (variables) {

    //         // only implemented in 2D for now
    //         if (dependencyValues.nDimensions !== 2) {
    //           return {};
    //         }

    //         let A1 = dependencyValues.endpoint[0][0].evaluate_to_constant();
    //         let A2 = dependencyValues.endpoint[0][1].evaluate_to_constant();
    //         let B1 = dependencyValues.endpoint[1][0].evaluate_to_constant();
    //         let B2 = dependencyValues.endpoint[1][1].evaluate_to_constant();

    //         // only implement for constants
    //         if (!(Number.isFinite(A1) && Number.isFinite(A2) &&
    //           Number.isFinite(B1) && Number.isFinite(B2))) {
    //           return {};
    //         }

    //         let BA1 = B1 - A1;
    //         let BA2 = B2 - A2;
    //         let denom = (BA1 * BA1 + BA2 * BA2);

    //         if (denom === 0) {
    //           return {};
    //         }

    //         let t = ((variables.x1 - A1) * BA1 + (variables.x2 - A2) * BA2) / denom;

    //         let result = {};

    //         if (t <= 0) {
    //           result = { x1: A1, x2: A2 };
    //         } else if (t >= 1) {
    //           result = { x1: B1, x2: B2 };
    //         } else {
    //           result = {
    //             x1: A1 + t * BA1,
    //             x2: A2 + t * BA2,
    //           };
    //         }

    //         if (variables.x3 !== undefined) {
    //           result.x3 = 0;
    //         }

    //         return result;

    //       }
    //     }
    //   })
    // }




    return stateVariableDefinitions;
  }


  async moveRay({ point1coords, point2coords, transient }) {

    let newEndpoint = {};
    let newThroughpoint = {};


    if (point1coords !== undefined) {
      newEndpoint[0] = me.fromAst(point1coords[0]);
      newEndpoint[1] = me.fromAst(point1coords[1]);
    }
    if (point2coords !== undefined) {
      newThroughpoint[0] = me.fromAst(point2coords[0]);
      newThroughpoint[1] = me.fromAst(point2coords[1]);
    }

    if (transient) {

      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          componentName: this.componentName,
          updateType: "updateValue",
          stateVariable: "endpoint",
          value: newEndpoint
        },
        {
          componentName: this.componentName,
          updateType: "updateValue",
          stateVariable: "throughpoint",
          value: newThroughpoint
        }],
        transient
      });
    } else {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          componentName: this.componentName,
          updateType: "updateValue",
          stateVariable: "endpoint",
          value: newEndpoint
        },
        {
          componentName: this.componentName,
          updateType: "updateValue",
          stateVariable: "throughpoint",
          value: newThroughpoint
        }],
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            endpoint: point1coords,
            throughpoint: point2coords,
          }
        }
      });
    }

  }

  async finalizeRayPosition() {
    // trigger a moveLine 
    // to send the final values with transient=false
    // so that the final position will be recorded

    return await this.actions.moveRay({
      point1coords: await this.stateValues.numericalEndpoint,
      point2coords: await this.stateValues.numericalThroughpoint,
      transient: false,
    });
  }

}