import BaseComponent from "./abstract/BaseComponent";
import { convertValueToMathExpression } from "../utils/math";
import { applyConstraintFromComponentConstraints } from "../utils/constraints";

export default class Constraints extends BaseComponent {
  static componentType = "constraints";
  static rendererType = undefined;

  static returnChildGroups() {
    return [
      {
        group: "constraints",
        componentTypes: ["_constraint"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.independentComponentConstraints = {
      returnDependencies: () => ({
        constraintChildren: {
          dependencyType: "child",
          childGroups: ["constraints"],
          variableNames: ["independentComponentConstraints"],
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          independentComponentConstraints:
            dependencyValues.constraintChildren.every(
              (x) => x.stateValues.independentComponentConstraints,
            ),
        },
      }),
    };

    stateVariableDefinitions.arrayEntryPrefixForConstraints = {
      returnDependencies: () => ({
        arrayEntryPrefixForConstraints: {
          dependencyType: "parentStateVariable",
          variableName: "arrayEntryPrefixForConstraints",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          arrayEntryPrefixForConstraints:
            dependencyValues.arrayEntryPrefixForConstraints,
        },
      }),
    };

    stateVariableDefinitions.arrayVariableForConstraints = {
      returnDependencies: () => ({
        arrayVariableForConstraints: {
          dependencyType: "parentStateVariable",
          variableName: "arrayVariableForConstraints",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          arrayVariableForConstraints:
            dependencyValues.arrayVariableForConstraints,
        },
      }),
    };

    stateVariableDefinitions.numDimensions = {
      returnDependencies: () => ({
        numDimensions: {
          dependencyType: "parentStateVariable",
          variableName: "numDimensionsForConstraints",
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { numDimensions: dependencyValues.numDimensions } };
      },
    };

    stateVariableDefinitions.scales = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["xscale", "yscale"],
        },
        shadowedConstraints: {
          dependencyType: "shadowSource",
          variableNames: ["scales"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.graphAncestor) {
          let SVs = dependencyValues.graphAncestor.stateValues;
          let scales = [SVs.xscale, SVs.yscale, 1];

          if (scales.every((x) => Number.isFinite(x) && x > 0)) {
            return { setValue: { scales } };
          }
        } else if (dependencyValues.shadowedConstraints) {
          // if we are shadowing a constraints and not in a graph
          // use the scales from the shadow
          // Rationale: if we copy a component to a location outside a graph
          // (e.g. to display the coordinates of a point)
          // we don't intend to remove the constraints imposed by the graph.
          return {
            setValue: {
              scales: dependencyValues.shadowedConstraints.stateValues.scales,
            },
          };
        }

        return { setValue: { scales: [1, 1, 1] } };
      },
    };

    stateVariableDefinitions.graphXmin = {
      additionalStateVariablesDefined: ["graphXmax", "graphYmin", "graphYmax"],
      returnDependencies: () => ({
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["xmin", "xmax", "ymin", "ymax"],
        },
        shadowedConstraints: {
          dependencyType: "shadowSource",
          variableNames: ["graphXmin", "graphXmax", "graphYmin", "graphYmax"],
        },
      }),
      definition({ dependencyValues }) {
        if (!dependencyValues.graphAncestor) {
          if (dependencyValues.shadowedConstraints) {
            // if we are shadowing a constraints and not in a graph
            // use the limits from the shadow
            // Rationale: if we copy a component to a location outside a graph
            // (e.g. to display the coordinates of a point)
            // we don't intend to remove the constraints imposed by the graph.
            let { graphXmin, graphXmax, graphYmin, graphYmax } =
              dependencyValues.shadowedConstraints.stateValues;
            return {
              setValue: {
                graphXmin,
                graphXmax,
                graphYmin,
                graphYmax,
              },
            };
          } else {
            return {
              setValue: {
                graphXmin: null,
                graphXmax: null,
                graphYmin: null,
                graphYmax: null,
              },
            };
          }
        }

        let graphXmin = dependencyValues.graphAncestor.stateValues.xmin;
        let graphXmax = dependencyValues.graphAncestor.stateValues.xmax;
        let graphYmin = dependencyValues.graphAncestor.stateValues.ymin;
        let graphYmax = dependencyValues.graphAncestor.stateValues.ymax;

        if (
          [graphXmin, graphXmax, graphYmin, graphYmax].every(Number.isFinite)
        ) {
          return {
            setValue: {
              graphXmin,
              graphXmax,
              graphYmin,
              graphYmax,
            },
          };
        } else {
          return {
            setValue: {
              graphXmin: null,
              graphXmax: null,
              graphYmin: null,
              graphYmax: null,
            },
          };
        }
      },
    };

    stateVariableDefinitions.constraintResults = {
      additionalStateVariablesDefined: [
        {
          variableName: "constraintUsedByComponent",
          isArray: true,
          entryPrefixes: ["constraintUsedByComponent"],
        },
      ],
      isArray: true,
      entryPrefixes: ["constraintResult"],
      stateVariablesDeterminingDependencies: [
        "independentComponentConstraints",
        "arrayEntryPrefixForConstraints",
        "arrayVariableForConstraints",
      ],
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        // console.log(`return array dependencies of constraintResults`)
        // console.log(JSON.parse(JSON.stringify(arrayKeys)))
        // console.log(JSON.parse(JSON.stringify(stateValues)))

        let globalDependencies = {
          constraintChildren: {
            dependencyType: "child",
            childGroups: ["constraints"],
            variableNames: ["applyConstraint", "applyComponentConstraint"],
            variablesOptional: true,
          },
          independentComponentConstraints: {
            dependencyType: "stateVariable",
            variableName: "independentComponentConstraints",
          },
        };

        let arrayEntryPrefix = stateValues.arrayEntryPrefixForConstraints;

        let dependenciesByKey = {};
        if (stateValues.independentComponentConstraints) {
          for (let arrayKey of arrayKeys) {
            dependenciesByKey[arrayKey] = {
              x: {
                dependencyType: "parentStateVariable",
                variableName: arrayEntryPrefix + (Number(arrayKey) + 1),
              },
            };
          }
        } else {
          // convert variableName to "__null" on null
          // as variableName must be defined
          // (an invalid variable name is OK)
          let variableName = stateValues.arrayVariableForConstraints
            ? stateValues.arrayVariableForConstraints
            : "__null";
          globalDependencies.xs = {
            dependencyType: "parentStateVariable",
            variableName,
          };
        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        // console.log("array constraintResult definition")
        // console.log(globalDependencyValues);
        // console.log(dependencyValuesByKey);
        // console.log(arrayKeys)

        if (globalDependencyValues.independentComponentConstraints) {
          let constraintResults = {};
          let constraintUsedByComponent = {};
          for (let arrayKey of arrayKeys) {
            let varEnding = Number(arrayKey) + 1;
            let variables = {
              ["x" + varEnding]: dependencyValuesByKey[arrayKey].x,
            };
            let constraintUsed = false;

            for (let constraintChild of globalDependencyValues.constraintChildren) {
              let result =
                constraintChild.stateValues.applyComponentConstraint(variables);

              if (result.constrained) {
                variables["x" + varEnding] = convertValueToMathExpression(
                  result.variables["x" + varEnding],
                );
                constraintUsed = true;
              }
            }

            constraintResults[arrayKey] = variables["x" + varEnding];
            constraintUsedByComponent[arrayKey] = constraintUsed;
          }

          return {
            setValue: {
              constraintResults,
              constraintUsedByComponent,
            },
          };
        } else {
          // apply constraint to whole array (even if just one array key requested)
          let variables = {};
          let constraintUsed = false;

          for (let arrayKey in globalDependencyValues.xs) {
            variables[`x${Number(arrayKey) + 1}`] =
              globalDependencyValues.xs[arrayKey];
          }

          for (let constraintChild of globalDependencyValues.constraintChildren) {
            let constraintResult;
            if (constraintChild.stateValues.applyConstraint) {
              constraintResult =
                constraintChild.stateValues.applyConstraint(variables);
            } else {
              constraintResult = applyConstraintFromComponentConstraints(
                variables,
                constraintChild.stateValues.applyComponentConstraint,
              );
            }

            if (constraintResult.constrained) {
              for (let varName in constraintResult.variables) {
                variables[varName] = convertValueToMathExpression(
                  constraintResult.variables[varName],
                );
              }
              constraintUsed = true;
            }
          }

          let constraintResults = {};
          let constraintUsedByComponent = {};

          for (let arrayKey in globalDependencyValues.xs) {
            constraintResults[arrayKey] = variables[`x${Number(arrayKey) + 1}`];
            constraintUsedByComponent[arrayKey] = constraintUsed;
          }

          return { setValue: { constraintResults, constraintUsedByComponent } };
        }
      },

      inverseArrayDefinitionByKey: async function ({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        stateValues,
        workspace,
      }) {
        // console.log('inverse definition of constraints')
        // console.log(desiredStateVariableValues);
        // console.log(globalDependencyValues)
        // console.log(stateValues)

        // Note: the idea is that we want the constrain applied even in the reverse direction
        // so that downstream variables will see the effect of the constraint

        // To accomplish this, we send the unconstrained value in desiredStateVariableValues.constrainResult
        // and will send the constraint result to the xs (or xs arrayKey) dependency

        if (globalDependencyValues.independentComponentConstraints) {
          // we applied constraint to each component separately

          let instructions = [];

          for (let arrayKey in desiredStateVariableValues.constraintResults) {
            let varEnding = Number(arrayKey) + 1;

            let variables = {
              ["x" + varEnding]: convertValueToMathExpression(
                desiredStateVariableValues.constraintResults[arrayKey],
              ),
            };

            for (let constraintChild of globalDependencyValues.constraintChildren) {
              let result =
                constraintChild.stateValues.applyComponentConstraint(variables);

              if (result.constrained) {
                variables["x" + varEnding] = convertValueToMathExpression(
                  result.variables["x" + varEnding],
                );
              }
            }

            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].x,
              desiredValue: variables["x" + varEnding],
            });
          }

          return {
            success: true,
            instructions,
          };
        } else {
          // we applied constraint to whole array
          let variables = {};

          // desiredStateVariableValues.constraintResult could just a
          // subset of keys (if arrayKeys specified)
          // but we should apply constraint function to all values
          // We start with previous values of constraintResults
          // and then modify any that are in desiredStateVariableValues.constraintResults

          // accumulate different desired results from multiple passes
          if (!workspace.desiredConstraintResults) {
            workspace.desiredConstraintResults = {};
          }
          Object.assign(
            workspace.desiredConstraintResults,
            desiredStateVariableValues.constraintResults,
          );

          let SVconstraintResults = await stateValues.constraintResults;
          for (let arrayKey in SVconstraintResults) {
            let varEnding = Number(arrayKey) + 1;
            if (arrayKey in workspace.desiredConstraintResults) {
              variables["x" + varEnding] = convertValueToMathExpression(
                workspace.desiredConstraintResults[arrayKey],
              );
            } else {
              variables["x" + varEnding] = convertValueToMathExpression(
                SVconstraintResults[arrayKey],
              );
            }
          }

          for (let constraintChild of globalDependencyValues.constraintChildren) {
            let constraintResult;
            if (constraintChild.stateValues.applyConstraint) {
              constraintResult =
                constraintChild.stateValues.applyConstraint(variables);
            } else {
              constraintResult = applyConstraintFromComponentConstraints(
                variables,
                constraintChild.stateValues.applyComponentConstraint,
              );
            }

            if (constraintResult.constrained) {
              for (let varName in constraintResult.variables) {
                variables[varName] = convertValueToMathExpression(
                  constraintResult.variables[varName],
                );
              }
            }
          }

          let constraintResults = {};
          for (let arrayKey in workspace.desiredConstraintResults) {
            constraintResults[arrayKey] = variables[`x${Number(arrayKey) + 1}`];
          }

          return {
            success: true,
            instructions: [
              {
                setDependency: "xs",
                desiredValue: constraintResults,
              },
            ],
          };
        }
      },
    };

    stateVariableDefinitions.constraintUsed = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({
        constraintUsedByComponent: {
          dependencyType: "stateVariable",
          variableName: "constraintUsedByComponent",
        },
      }),
      definition: function ({ dependencyValues }) {
        let constraintUsed = Object.values(
          dependencyValues.constraintUsedByComponent,
        ).some((x) => x);

        return { setValue: { constraintUsed } };
      },
    };

    return stateVariableDefinitions;
  }
}
