import { findFiniteNumericalValue } from '../utils/math.js';
import ConstraintComponent from './abstract/ConstraintComponent.js';

export default class AttractTo extends ConstraintComponent {
  static componentType = "attractTo";


  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.threshold = {
      createComponentOfType: "number",

    }
    return attributes;
  }


  static returnChildGroups() {

    return [{
      group: "graphical",
      componentTypes: ["_graphical"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.threshold = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      hasEssential: true,
      returnDependencies: () => ({
        thresholdAttr: {
          dependencyType: "attributeComponent",
          attributeName: "threshold",
          variableNames: ["value"]
        },
        constraintsAncestor: {
          dependencyType: "ancestor",
          componentType: "constraints",
          variableNames: ["graphXmin"]
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.thresholdAttr) {
          return {
            setValue: { threshold: dependencyValues.thresholdAttr.stateValues.value }
          }
        } else {

          let defaultValue = 0.02;
          if (dependencyValues.constraintsAncestor === null ||
            dependencyValues.constraintsAncestor.stateValues.graphXmin === null
          ) {
            defaultValue = 0.5;
          }

          return { useEssentialOrDefaultValue: { threshold: { defaultValue } } }

        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.thresholdAttr) {
          return {
            success: true,
            instructions: [{
              setDependency: "thresholdAttr",
              desiredValue: desiredStateVariableValues.threshold
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setEssentialValue: "threshold",
              value: desiredStateVariableValues.threshold
            }]
          }
        }
      },
    }

    stateVariableDefinitions.nearestPointFunctions = {
      returnDependencies: () => ({
        graphicalChildren: {
          dependencyType: "child",
          childGroups: ["graphical"],
          variableNames: ["nearestPoint"],
          variablesOptional: true
        }
      }),
      definition: function ({ dependencyValues }) {
        let nearestPointFunctions = [];

        for (let child of dependencyValues.graphicalChildren) {
          if (!child.stateValues.nearestPoint) {
            console.warn(`cannot attract to ${child.componentName} as it doesn't have a nearestPoint state variable`);
            continue;
          }
          nearestPointFunctions.push(child.stateValues.nearestPoint);
        }

        return { setValue: { nearestPointFunctions } };

      }
    }

    stateVariableDefinitions.graphXscale = {
      additionalStateVariablesDefined: ["graphYscale"],
      returnDependencies: () => ({
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "constraints",
          variableNames: ["scales"]
        },
      }),
      definition({ dependencyValues }) {
        if (!dependencyValues.graphAncestor) {
          return {
            setValue: {
              graphXscale: null, graphYscale: null
            }
          }
        }
        let graphXscale = dependencyValues.graphAncestor.stateValues.xscale;
        let graphYscale = dependencyValues.graphAncestor.stateValues.yscale;

        return {
          setValue: {
            graphXscale, graphYscale
          }
        }
      }
    }


    stateVariableDefinitions.applyConstraint = {
      returnDependencies() {
        let dependencies = {
          nearestPointFunctions: {
            dependencyType: "stateVariable",
            variableName: "nearestPointFunctions"
          },
          threshold: {
            dependencyType: "stateVariable",
            variableName: "threshold"
          },
          constraintsAncestor: {
            dependencyType: "ancestor",
            componentType: "constraints",
            variableNames: ["scales"]
          },
        }

        return dependencies;

      },
      definition({ dependencyValues }) {

        let xscale = 1, yscale = 1;

        if (dependencyValues.constraintsAncestor) {
          [xscale, yscale] = dependencyValues.constraintsAncestor.stateValues.scales;
        }

        return {
          setValue: {
            applyConstraint: function ({ variables, scales }) {


              let closestDistance2 = Infinity;
              let closestPoint = {}

              let numericalVariables = {};
              for (let varName in variables) {
                numericalVariables[varName] = findFiniteNumericalValue(variables[varName]);
              }

              for (let nearestPointFunction of dependencyValues.nearestPointFunctions) {

                let nearestPoint = nearestPointFunction({ variables, scales });

                if (nearestPoint === undefined) {
                  continue;
                }

                let constrainedVariables = {};
                let distance2 = 0;

                if (numericalVariables.x1 !== undefined) {
                  if (nearestPoint.x1 === undefined) {
                    continue;
                  }
                  constrainedVariables.x1 = nearestPoint.x1;
                  distance2 += Math.pow((numericalVariables.x1 - nearestPoint.x1) / xscale, 2);
                }
                if (numericalVariables.x2 !== undefined) {
                  if (nearestPoint.x2 === undefined) {
                    continue;
                  }
                  constrainedVariables.x2 = nearestPoint.x2;
                  distance2 += Math.pow((numericalVariables.x2 - nearestPoint.x2) / yscale, 2);
                }
                if (numericalVariables.x3 !== undefined) {
                  if (nearestPoint.x3 === undefined) {
                    continue;
                  }
                  constrainedVariables.x3 = nearestPoint.x3;
                  distance2 += Math.pow(numericalVariables.x3 - nearestPoint.x3, 2);
                }

                if (distance2 < closestDistance2) {
                  closestPoint = constrainedVariables;
                  closestDistance2 = distance2;
                }

              }

              if (closestDistance2 > dependencyValues.threshold * dependencyValues.threshold) {
                return {};
              }

              return { constrained: true, variables: closestPoint };

            }
          }
        }
      }
    }

    return stateVariableDefinitions;
  }

}
