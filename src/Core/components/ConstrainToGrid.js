import ConstraintComponent from "./abstract/ConstraintComponent";
import { findFiniteNumericalValue } from "../utils/math";

export default class ConstrainToGrid extends ConstraintComponent {
  static componentType = "constrainToGrid";

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
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: { independentComponentConstraints: true },
      }),
    };

    // Since state variable independentComponentConstraints is true,
    // expect function applyComponentConstraint to be called with
    // a single component value as the object, for example,  {x1: 13}

    // use the convention of x1, x2, and x3 for variable names
    // so that components can call constraints generically for n-dimensions
    // use x,y,z for properties so that authors can use the more familar tag names

    stateVariableDefinitions.applyComponentConstraint = {
      returnDependencies: () => ({
        dx: {
          dependencyType: "stateVariable",
          variableName: "dx",
        },
        dy: {
          dependencyType: "stateVariable",
          variableName: "dy",
        },
        dz: {
          dependencyType: "stateVariable",
          variableName: "dz",
        },
        xoffset: {
          dependencyType: "stateVariable",
          variableName: "xoffset",
        },
        yoffset: {
          dependencyType: "stateVariable",
          variableName: "yoffset",
        },
        zoffset: {
          dependencyType: "stateVariable",
          variableName: "zoffset",
        },
        constraintAncestor: {
          dependencyType: "ancestor",
          componentType: "constraints",
          variableNames: ["graphXmin", "graphXmax", "graphYmin", "graphYmax"],
        },
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["xmin", "xmax", "ymin", "ymax"],
        },
        ignoreGraphBounds: {
          dependencyType: "stateVariable",
          variableName: "ignoreGraphBounds",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          applyComponentConstraint: function ({ variables, scales }) {
            let ancestor;
            if (
              dependencyValues.constraintAncestor !== null &&
              dependencyValues.constraintAncestor.stateValues.graphXmin !== null
            ) {
              ancestor = "constraints";
            } else if (
              dependencyValues.graphAncestor !== null &&
              dependencyValues.graphAncestor.stateValues.xmin !== null
            ) {
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
              let x1constrained =
                Math.round((x1 - xoffset) / dx) * dx + xoffset;
              if (Number.isFinite(x1constrained)) {
                if (!dependencyValues.ignoreGraphBounds) {
                  // if in a graph, exclude grid points outside graph bounds
                  let xmin, xmax;
                  if (ancestor === "constraints") {
                    xmin =
                      dependencyValues.constraintAncestor.stateValues.graphXmin;
                    xmax =
                      dependencyValues.constraintAncestor.stateValues.graphXmax;
                  } else if (ancestor === "graph") {
                    xmin = dependencyValues.graphAncestor.stateValues.xmin;
                    xmax = dependencyValues.graphAncestor.stateValues.xmax;
                  }
                  if (xmin !== undefined) {
                    if (x1constrained < xmin) {
                      x1constrained =
                        Math.ceil((xmin - xoffset) / dx) * dx + xoffset;
                    } else if (x1constrained > xmax) {
                      x1constrained =
                        Math.floor((xmax - xoffset) / dx) * dx + xoffset;
                    }
                  }
                }

                return {
                  constrained: true,
                  variables: { x1: x1constrained },
                };
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
              let x2constrained =
                Math.round((x2 - yoffset) / dy) * dy + yoffset;
              if (Number.isFinite(x2constrained)) {
                if (!dependencyValues.ignoreGraphBounds) {
                  // if in a graph, exclude grid points outside graph bounds
                  let ymin, ymax;
                  if (ancestor === "constraints") {
                    ymin =
                      dependencyValues.constraintAncestor.stateValues.graphYmin;
                    ymax =
                      dependencyValues.constraintAncestor.stateValues.graphYmax;
                  } else if (ancestor === "graph") {
                    ymin = dependencyValues.graphAncestor.stateValues.ymin;
                    ymax = dependencyValues.graphAncestor.stateValues.ymax;
                  }
                  if (ymin !== undefined) {
                    if (x2constrained < ymin) {
                      x2constrained =
                        Math.ceil((ymin - yoffset) / dy) * dy + yoffset;
                    } else if (x2constrained > ymax) {
                      x2constrained =
                        Math.floor((ymax - yoffset) / dy) * dy + yoffset;
                    }
                  }
                }

                return {
                  constrained: true,
                  variables: { x2: x2constrained },
                };
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
              let x3constrained =
                Math.round((x3 - zoffset) / dz) * dz + zoffset;
              if (Number.isFinite(x3constrained)) {
                return {
                  constrained: true,
                  variables: { x3: x3constrained },
                };
              } else {
                return {};
              }
            }

            // if didn't get x1, x2, or x3 as argument, don't constrain anything
            return {};
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }
}
