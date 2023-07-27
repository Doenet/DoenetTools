import { findFiniteNumericalValue } from "../utils/math";
import ConstraintComponent from "./abstract/ConstraintComponent";

export default class ConstrainTo extends ConstraintComponent {
  static componentType = "constrainTo";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.relativeToGraphScales = {
      createComponentOfType: "boolean",
      createStateVariable: "relativeToGraphScales",
      defaultValue: false,
      public: true,
    };

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "graphical",
        componentTypes: ["_graphical"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nearestPointFunctions = {
      returnDependencies: () => ({
        graphicalChildren: {
          dependencyType: "child",
          childGroups: ["graphical"],
          variableNames: ["nearestPoint"],
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        let nearestPointFunctions = [];
        let warnings = [];

        for (let child of dependencyValues.graphicalChildren) {
          if (!child.stateValues.nearestPoint) {
            warnings.push({
              message: `Cannot constrain to a <${child.componentType}> as it doesn't have a nearestPoint state variable.`,
              level: 1,
            });
            continue;
          }
          nearestPointFunctions.push(child.stateValues.nearestPoint);
        }

        return { setValue: { nearestPointFunctions }, sendWarnings: warnings };
      },
    };

    stateVariableDefinitions.applyConstraint = {
      returnDependencies: () => ({
        nearestPointFunctions: {
          dependencyType: "stateVariable",
          variableName: "nearestPointFunctions",
        },
        relativeToGraphScales: {
          dependencyType: "stateVariable",
          variableName: "relativeToGraphScales",
        },
        constraintsAncestor: {
          dependencyType: "ancestor",
          componentType: "constraints",
          variableNames: ["scales"],
        },
      }),
      definition({ dependencyValues, componentName }) {
        let scales;

        if (dependencyValues.relativeToGraphScales) {
          scales = dependencyValues.constraintsAncestor?.stateValues.scales || [
            1, 1, 1,
          ];
        } else {
          scales = [1, 1, 1];
        }

        return {
          setValue: {
            applyConstraint: function (variables) {
              let closestDistance2 = Infinity;
              let closestPoint = {};

              let constrained = false;

              let numericalVariables = {};
              for (let varName in variables) {
                numericalVariables[varName] = findFiniteNumericalValue(
                  variables[varName],
                );
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
                  distance2 += Math.pow(
                    numericalVariables.x1 - nearestPoint.x1,
                    2,
                  );
                }
                if (numericalVariables.x2 !== undefined) {
                  if (nearestPoint.x2 === undefined) {
                    continue;
                  }
                  constrainedVariables.x2 = nearestPoint.x2;
                  distance2 += Math.pow(
                    numericalVariables.x2 - nearestPoint.x2,
                    2,
                  );
                }
                if (numericalVariables.x3 !== undefined) {
                  if (nearestPoint.x3 === undefined) {
                    continue;
                  }
                  constrainedVariables.x3 = nearestPoint.x3;
                  distance2 += Math.pow(
                    numericalVariables.x3 - nearestPoint.x3,
                    2,
                  );
                }

                if (distance2 < closestDistance2) {
                  closestPoint = constrainedVariables;
                  closestDistance2 = distance2;
                  constrained = true;
                }
              }

              if (!constrained) {
                return {};
              }

              return { constrained, variables: closestPoint };
            },
          },
        };
      },
    };

    return stateVariableDefinitions;
  }
}
