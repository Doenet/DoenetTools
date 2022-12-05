import ConstraintComponent from './abstract/ConstraintComponent';
import { findFiniteNumericalValue } from '../utils/math';

export default class AttractToGrid extends ConstraintComponent {
  static componentType = "attractToGrid";


  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.dx = {
      createComponentOfType: "number",
      createStateVariable: "dx",
      defaultValue: 1,
      public: true,
    };
    attributes.dy = {
      createComponentOfType: "number",
      createStateVariable: "dy",
      defaultValue: 1,
      public: true,
    };
    attributes.dz = {
      createComponentOfType: "number",
      createStateVariable: "dz",
      defaultValue: 1,
      public: true,
    };
    attributes.xoffset = {
      createComponentOfType: "number",
      createStateVariable: "xoffset",
      defaultValue: 0,
      public: true,
    };
    attributes.yoffset = {
      createComponentOfType: "number",
      createStateVariable: "yoffset",
      defaultValue: 0,
      public: true,
    };
    attributes.zoffset = {
      createComponentOfType: "number",
      createStateVariable: "zoffset",
      defaultValue: 0,
      public: true,
    };
    attributes.xthreshold = {
      createComponentOfType: "number",
      createStateVariable: "xthreshold",
      defaultValue: 0.2,
      public: true,
    };
    attributes.ythreshold = {
      createComponentOfType: "number",
      createStateVariable: "ythreshold",
      defaultValue: 0.2,
      public: true,
    };
    attributes.zthreshold = {
      createComponentOfType: "number",
      createStateVariable: "zthreshold",
      defaultValue: 0.2,
      public: true,
    };
    attributes.includeGridlines = {
      createComponentOfType: "boolean",
      createStateVariable: "includeGridlines",
      defaultValue: false,
      public: true,
    };
    attributes.ignoreGraphBounds = {
      createComponentOfType: "boolean",
      createStateVariable: "ignoreGraphBounds",
      defaultValue: false,
      public: true,
    };
    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.independentComponentConstraints = {
      returnDependencies: () => ({
        includeGridlines: {
          dependencyType: "stateVariable",
          variableName: "includeGridlines"
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          independentComponentConstraints: dependencyValues.includeGridlines
        }
      })
    }


    // Since state variable independentComponentConstraints may be true,
    // expect function applyComponentConstraint to be called with 
    // a single component value as the object, for example,  {x1: 13}

    // use the convention of x1, x2, and x3 for variable names
    // so that components can call constraints generically for n-dimensions
    // use x,y,z for properties so that authors can use the more familar tag names
    stateVariableDefinitions.applyComponentConstraint = {
      returnDependencies: () => ({
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
        xthreshold: {
          dependencyType: "stateVariable",
          variableName: "xthreshold"
        },
        ythreshold: {
          dependencyType: "stateVariable",
          variableName: "ythreshold"
        },
        zthreshold: {
          dependencyType: "stateVariable",
          variableName: "zthreshold"
        },
        constraintAncestor: {
          dependencyType: "ancestor",
          componentType: "constraints",
          variableNames: ["graphXmin", "graphXmax", "graphYmin", "graphYmax"]
        },
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["xmin", "xmax", "ymin", "ymax"]
        },
        ignoreGraphBounds: {
          dependencyType: "stateVariable",
          variableName: "ignoreGraphBounds"
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          applyComponentConstraint: function ({ variables, scales }) {


            let ancestor;
            if (dependencyValues.constraintAncestor !== null &&
              dependencyValues.constraintAncestor.stateValues.graphXmin !== null) {
              ancestor = "constraints";
            } else if (dependencyValues.graphAncestor !== null &&
              dependencyValues.graphAncestor.stateValues.xmin !== null) {
              ancestor = "graph";
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
              let x1grid = Math.round((x1 - xoffset) / dx) * dx + xoffset;

              if (!Number.isFinite(x1grid)) {
                return {};
              }

              if (!dependencyValues.ignoreGraphBounds) {
                // if in a graph, exclude grid points outside graph bounds
                let xmin, xmax;
                if (ancestor === "constraints") {
                  xmin = dependencyValues.constraintAncestor.stateValues.graphXmin;
                  xmax = dependencyValues.constraintAncestor.stateValues.graphXmax;
                } else if (ancestor === "graph") {
                  xmin = dependencyValues.graphAncestor.stateValues.xmin;
                  xmax = dependencyValues.graphAncestor.stateValues.xmax;
                }
                if (xmin !== undefined) {
                  if (x1grid < xmin) {
                    x1grid = Math.ceil((xmin - xoffset) / dx) * dx + xoffset;
                  } else if (x1grid > xmax) {
                    x1grid = Math.floor((xmax - xoffset) / dx) * dx + xoffset;
                  }
                }
              }

              if (Math.abs(x1 - x1grid) < dependencyValues.xthreshold) {
                return {
                  constrained: true,
                  variables: { x1: x1grid }
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
              let x2grid = Math.round((x2 - yoffset) / dy) * dy + yoffset;
              if (!Number.isFinite(x2grid)) {
                return {};
              }

              if (!dependencyValues.ignoreGraphBounds) {
                // if in a graph, exclude grid points outside graph bounds
                let ymin, ymax;
                if (ancestor === "constraints") {
                  ymin = dependencyValues.constraintAncestor.stateValues.graphYmin;
                  ymax = dependencyValues.constraintAncestor.stateValues.graphYmax;
                } else if (ancestor === "graph") {
                  ymin = dependencyValues.graphAncestor.stateValues.ymin;
                  ymax = dependencyValues.graphAncestor.stateValues.ymax;
                }
                if (ymin !== undefined) {
                  if (x2grid < ymin) {
                    x2grid = Math.ceil((ymin - yoffset) / dy) * dy + yoffset;
                  } else if (x2grid > ymax) {
                    x2grid = Math.floor((ymax - yoffset) / dy) * dy + yoffset;
                  }
                }
              }

              if (Math.abs(x2 - x2grid) < dependencyValues.ythreshold) {
                return {
                  constrained: true,
                  variables: { x2: x2grid }
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
              let x3grid = Math.round((x3 - zoffset) / dz) * dz + zoffset;
              if (Number.isFinite(x3grid) &&
                Math.abs(x3 - x3grid) < dependencyValues.zthreshold
              ) {
                return {
                  constrained: true,
                  variables: { x3: x3grid }
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


    stateVariableDefinitions.applyConstraint = {
      returnDependencies: () => ({
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
        xthreshold: {
          dependencyType: "stateVariable",
          variableName: "xthreshold"
        },
        ythreshold: {
          dependencyType: "stateVariable",
          variableName: "ythreshold"
        },
        zthreshold: {
          dependencyType: "stateVariable",
          variableName: "zthreshold"
        },
        includeGridlines: {
          dependencyType: "stateVariable",
          variableName: "includeGridlines"
        },
        applyComponentConstraint: {
          dependencyType: "stateVariable",
          variableName: "applyComponentConstraint"
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          applyConstraint: function ({ variables, scales }) {

            let newVariables = {};
            let constrained = false;

            for (let varName in variables) {
              let result = dependencyValues.applyComponentConstraint({
                variables: { [varName]: variables[varName] },
                scales
              })
              if (result.constrained) {
                constrained = true;
                newVariables[varName] = result.variables[varName]
              }
            }

            if (!constrained) {
              return {};
            }

            if (!dependencyValues.includeGridlines) {
              // if didn't specify to include gridlines
              // then don't constrain unless all variables were constrained
              if (variables.x1 !== undefined && newVariables.x1 === undefined) {
                return {};
              }
              if (variables.x2 !== undefined && newVariables.x2 === undefined) {
                return {};
              }
              if (variables.x3 !== undefined && newVariables.x3 === undefined) {
                return {};
              }
            }

            return {
              constrained,
              variables: newVariables
            }
          }
        }
      })
    }


    return stateVariableDefinitions;
  }

}
