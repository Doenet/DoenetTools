import ConstraintComponent from './abstract/ConstraintComponent';
import { findFiniteNumericalValue } from '../utils/math';

export default class ConstrainToGraph extends ConstraintComponent {
  static componentType = "constrainToGraph";


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.buffer = {
      createComponentOfType: "number",
      createStateVariable: "buffer",
      defaultValue: 0.01,
      public: true,
    };
    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.independentComponentConstraints = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { independentComponentConstraints: true } })
    }


    // Since state variable independentComponentConstraints is true,
    // expect function applyComponentConstraint to be called with 
    // a single component value as the object, for example,  {x1: 13}

    // use the convention of x1, x2, and x3 for variable names
    // so that components can call constraints generically for n-dimensions
    // use x,y,z for properties so that authors can use the more familar tag names

    stateVariableDefinitions.applyComponentConstraint = {
      returnDependencies: () => ({
        constraintAncestor: {
          dependencyType: "ancestor",
          componentType: "constraints",
          variableNames: ["graphXmin", "graphXmax", "graphYmin", "graphYmax"]
        },
        buffer: {
          dependencyType: "stateVariable",
          variableName: "buffer"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          applyComponentConstraint: function ({ variables, scales }) {

            if (dependencyValues.constraintAncestor === null ||
              dependencyValues.constraintAncestor.stateValues.graphXmin === null
            ) {
              return {};
            }

            // if given the value of x1, apply to constraint to x1
            // and ignore any other arguments (which shouldn't be given)
            if ("x1" in variables) {
              let x1 = findFiniteNumericalValue(variables.x1);

              // if found a non-numerical value, return no constraint
              if (!Number.isFinite(x1)) {
                return {};
              }

              let xmin = dependencyValues.constraintAncestor.stateValues.graphXmin;
              let xmax = dependencyValues.constraintAncestor.stateValues.graphXmax;

              if (!(Number.isFinite(xmin) && Number.isFinite(xmax))) {
                return {};
              }

              let lowerBound = xmin;
              let upperBound = xmax;
              let buffer = dependencyValues.buffer;
              if (buffer > 0) {
                let bufferAdjust = buffer * (xmax - xmin);
                lowerBound += bufferAdjust;
                upperBound -= bufferAdjust;
              }

              let x1constrained = Math.max(lowerBound, Math.min(upperBound, x1))
              return {
                constrained: true,
                variables: { x1: x1constrained }
              }
            }


            // if given the value of x2, apply to constraint to x2
            // and ignore any other arguments (which shouldn't be given)
            if ("x2" in variables) {
              let x2 = findFiniteNumericalValue(variables.x2);
              // if found a non-numerical value, return no constraint
              if (!Number.isFinite(x2)) {
                return {};
              }

              let ymin = dependencyValues.constraintAncestor.stateValues.graphYmin;
              let ymax = dependencyValues.constraintAncestor.stateValues.graphYmax;

              if (!(Number.isFinite(ymin) && Number.isFinite(ymax))) {
                return {};
              }

              let lowerBound = ymin;
              let upperBound = ymax;
              let buffer = dependencyValues.buffer;
              if (buffer > 0) {
                let bufferAdjust = buffer * (ymax - ymin);
                lowerBound += bufferAdjust;
                upperBound -= bufferAdjust;
              }

              let x2constrained = Math.max(lowerBound, Math.min(upperBound, x2))
              return {
                constrained: true,
                variables: { x2: x2constrained }
              }
            }

            // if didn't get x1, or x2 as argument, don't constrain anything
            return {};

          }
        }
      })
    }


    return stateVariableDefinitions;
  }


}
