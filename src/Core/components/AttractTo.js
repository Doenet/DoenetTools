import { findFiniteNumericalValue } from '../utils/math';
import ConstraintComponent from './abstract/ConstraintComponent';

export default class AttractTo extends ConstraintComponent {
  static componentType = "attractTo";


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.threshold = {
      createComponentOfType: "number",
      createStateVariable: "threshold",
      defaultValue: 0.5,
      public: true,
    }
    attributes.thresholdRelativeToGraph = {
      createComponentOfType: "boolean",
      createStateVariable: "thresholdRelativeToGraph",
      defaultValue: false,
      public: true,
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

        return { newValues: { nearestPointFunctions } };

      }
    }

    stateVariableDefinitions.applyConstraint = {
      stateVariablesDeterminingDependencies: ["thresholdRelativeToGraph"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          nearestPointFunctions: {
            dependencyType: "stateVariable",
            variableName: "nearestPointFunctions"
          },
          threshold: {
            dependencyType: "stateVariable",
            variableName: "threshold"
          },
          thresholdRelativeToGraph: {
            dependencyType: "stateVariable",
            variableName: "thresholdRelativeToGraph"
          }
        }

        if (stateValues.thresholdRelativeToGraph) {
          dependencies.graphAncestor = {
            dependencyType: "ancestor",
            componentType: "graph",
            variableNames: ["xscale", "yscale"]
          }
        }

        return dependencies;

      },
      definition({ dependencyValues }) {

        let xscale = 1, yscale = 1;

        if (dependencyValues.thresholdRelativeToGraph) {
          if (dependencyValues.graphAncestor) {
            xscale = dependencyValues.graphAncestor.stateValues.xscale;
            yscale = dependencyValues.graphAncestor.stateValues.yscale;

          }
        }

        return {
          newValues: {
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
