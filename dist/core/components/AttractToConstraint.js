import ConstraintComponent from './abstract/ConstraintComponent.js';
import { findFiniteNumericalValue } from '../utils/math.js';
import { applyConstraintFromComponentConstraints } from '../utils/constraints.js';

export default class AttractToConstraint extends ConstraintComponent {
  static componentType = "attractToConstraint";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.threshold = {
      createComponentOfType: "number",
      createStateVariable: "threshold",
      defaultValue: 0.5,
      public: true,
    };
    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "constraints",
      componentTypes: ["_constraint"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.applyConstraint = {
      returnDependencies: () => ({
        constraintChild: {
          dependencyType: "child",
          childGroups: ["constraints"],
          variableNames: ["applyConstraint", "applyComponentConstraint"],
          variablesOptional: true,
        },
        independentComponentConstraints: {
          dependencyType: "stateVariable",
          variableName: "independentComponentConstraints"
        },
        threshold: {
          dependencyType: "stateVariable",
          variableName: "threshold"
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          applyConstraint: function ({ variables, scales }) {

            let constraintResult;

            let constraintChild = dependencyValues.constraintChild[0];

            if (!constraintChild) {
              return {};
            }

            if (constraintChild.stateValues.applyConstraint) {
              constraintResult = constraintChild.stateValues.applyConstraint({ variables, scales });
            } else {
              constraintResult = applyConstraintFromComponentConstraints({
                variables,
                applyComponentConstraint: constraintChild.stateValues.applyComponentConstraint,
                scales
              })
            }

            let distance2 = 0;

            for (let varname in constraintResult.variables) {
              // since, for now, have a distance function only for numerical values,
              // skip if don't have numerical values
              let originalVar = findFiniteNumericalValue(variables[varname]);
              let constrainedVar = findFiniteNumericalValue(constraintResult.variables[varname]);

              if (!Number.isFinite(originalVar) || !Number.isFinite(constrainedVar)) {
                return {};
              }

              distance2 += Math.pow(originalVar - constrainedVar, 2);
            }

            if (distance2 > dependencyValues.threshold * dependencyValues.threshold) {
              return {};
            }

            return constraintResult;
          }
        }
      })
    }

    return stateVariableDefinitions;

  }

}