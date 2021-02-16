import ConstraintComponent from './abstract/ConstraintComponent';
import { findFiniteNumericalValue } from '../utils/math';

export default class ConstrainToGrid extends ConstraintComponent {
  static componentType = "constraintogrid";

  static createPropertiesObject() {
    return {
      dx: { default: 1 },
      dy: { default: 1 },
      dz: { default: 1 },
      xoffset: { default: 0 },
      yoffset: { default: 0 },
      zoffset: { default: 0 },
    };
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atMostOneString",
      componentType: 'string',
      comparison: 'atMost',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.independentComponentConstraints = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { independentComponentConstraints: true } })
    }

    // Note: constraintInactive allows one to treat constrainToGrid as a property
    // so that
    // <component constrainToGrid /> and <component constrainToGrid="true"/>
    // turn the constraint on (with default parameters), and
    // <component constrainToGrid="false"/>
    // leave the constraint off
    stateVariableDefinitions.constraintInactive = {
      returnDependencies: () => ({
        stringChild: {
          dependencyType: "child",
          childLogicName: "atMostOneString",
          variableNames: ["value"],
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.stringChild.length === 1) {
          let stringValue = dependencyValues.stringChild[0].stateValues.value;
          if (stringValue === false ||
            (typeof stringValue === "string" && ["false", "f"].includes(stringValue.trim().toLowerCase()))) {
            return { newValues: { constraintInactive: true } }
          }
        }

        return { newValues: { constraintInactive: false } }

      }


    }

    // Since state variable independentComponentConstraints is true,
    // expect function applyComponentConstraint to be called with 
    // a single component value as the object, for example,  {x1: 13}

    // use the convention of x1, x2, and x3 for variable names
    // so that components can call constraints generically for n-dimensions
    // use x,y,z for properties so that authors can use the more familar tag names

    stateVariableDefinitions.applyComponentConstraint = {
      returnDependencies: () => ({
        constraintInactive: {
          dependencyType: "stateVariable",
          variableName: "constraintInactive"
        },
        dx: {
          dependencyType: "stateVariable",
          variableName: "dx"
        },
        dy: {
          dependencyType: "stateVariable",
          variableName: "dy"
        },
        dz: {
          dependencyType: "stateVariable",
          variableName: "dz"
        },
        xoffset: {
          dependencyType: "stateVariable",
          variableName: "xoffset"
        },
        yoffset: {
          dependencyType: "stateVariable",
          variableName: "yoffset"
        },
        zoffset: {
          dependencyType: "stateVariable",
          variableName: "zoffset"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          applyComponentConstraint: function (variables) {
            
            if (dependencyValues.constraintInactive) {
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

              let dx = dependencyValues.dx;
              let xoffset = dependencyValues.xoffset;
              let x1constrained = Math.round((variables.x1 - xoffset) / dx) * dx + xoffset;
              if (Number.isFinite(x1constrained)) {
                return {
                  constrained: true,
                  variables: { x1: x1constrained }
                }
              } else {
                return {};
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

              let dy = dependencyValues.dy;
              let yoffset = dependencyValues.yoffset;
              let x2constrained = Math.round((variables.x2 - yoffset) / dy) * dy + yoffset;
              if (Number.isFinite(x2constrained)) {
                return {
                  constrained: true,
                  variables: { x2: x2constrained }
                }
              } else {
                return {};
              }
            }



            // if given the value of x3, apply to constraint to x3
            // and ignore any other arguments (which shouldn't be given)
            if ("x3" in variables) {
              let x3 = findFiniteNumericalValue(variables.x3);
              // if found a non-numerical value, return no constraint
              if (!Number.isFinite(x3)) {
                return {};
              }

              let dz = dependencyValues.dz;
              let zoffset = dependencyValues.zoffset;
              let x3constrained = Math.round((variables.x3 - zoffset) / dz) * dz + zoffset;
              if (Number.isFinite(x3constrained)) {
                return {
                  constrained: true,
                  variables: { x3: x3constrained }
                }
              } else {
                return {};
              }
            }

            // if didn't get x1, x2, or x3 as argument, don't constrain anything
            return {};

          }
        }
      })
    }


    return stateVariableDefinitions;
  }


}
