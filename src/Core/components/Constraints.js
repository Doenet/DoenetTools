import BaseComponent from './abstract/BaseComponent';
import { convertValueToMathExpression } from '../utils/math';
import { applyConstraintFromComponentConstraints } from '../utils/constraints';

export default class Constraints extends BaseComponent {
  static componentType = "constraints";
  static rendererType = undefined;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.baseOnGraph = {
      createPrimitiveOfType: "string",
      createStateVariable: "baseOnGraph",
      defaultValue: null,
    }

    return attributes
  }

  static returnChildGroups() {

    return [{
      group: "constraints",
      componentTypes: ["_constraint"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.independentComponentConstraints = {
      returnDependencies: () => ({
        constraintChildren: {
          dependencyType: "child",
          childGroups: ["constraints"],
          variableNames: ["independentComponentConstraints"]
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          independentComponentConstraints: dependencyValues.constraintChildren.every(
            x => x.stateValues.independentComponentConstraints
          )
        }
      })
    }

    stateVariableDefinitions.arrayEntryPrefixForConstraints = {
      returnDependencies: () => ({
        arrayEntryPrefixForConstraints: {
          dependencyType: "parentStateVariable",
          variableName: "arrayEntryPrefixForConstraints"
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          arrayEntryPrefixForConstraints:
            dependencyValues.arrayEntryPrefixForConstraints
        }
      })
    }

    stateVariableDefinitions.arrayVariableForConstraints = {
      returnDependencies: () => ({
        arrayVariableForConstraints: {
          dependencyType: "parentStateVariable",
          variableName: "arrayVariableForConstraints"
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          arrayVariableForConstraints:
            dependencyValues.arrayVariableForConstraints
        }
      })
    }

    stateVariableDefinitions.nDimensions = {
      returnDependencies: () => ({
        nDimensions: {
          dependencyType: "parentStateVariable",
          variableName: "nDimensionsForConstraints"
        }
      }),
      definition({ dependencyValues }) {
        return { setValue: { nDimensions: dependencyValues.nDimensions } }
      }
    }

    stateVariableDefinitions.graphComponentName = {
      stateVariablesDeterminingDependencies: ["baseOnGraph"],
      returnDependencies({ stateValues }) {
        if (stateValues.baseOnGraph) {
          return {
            graphComponentName: {
              dependencyType: "expandTargetName",
              target: stateValues.baseOnGraph
            }
          }
        } else {
          return {}
        }
      },
      definition({ dependencyValues }) {
        if (dependencyValues.graphComponentName) {
          return { setValue: { graphComponentName: dependencyValues.graphComponentName } }
        } else {
          return { setValue: { graphComponentName: null } }
        }
      }
    }

    stateVariableDefinitions.scales = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      stateVariablesDeterminingDependencies: ["graphComponentName"],
      returnDependencies({ stateValues }) {
        if (stateValues.graphComponentName) {
          return {
            graph: {
              dependencyType: "multipleStateVariables",
              componentName: stateValues.graphComponentName,
              variableNames: ["xscale", "yscale"],
              variablesOptional: true,
            }
          }
        } else {
          return {};
        }
      },
      definition({ dependencyValues }) {

        if (dependencyValues.graph) {
          let SVs = dependencyValues.graph.stateValues;
          let scales = [SVs.xscale, SVs.yscale, 1];

          if (scales.every(x => Number.isFinite(x) && x > 0)) {
            return { setValue: { scales } }
          }
        }

        return { setValue: { scales: [1, 1, 1] } }
      }
    }

    stateVariableDefinitions.graphXmin = {
      additionalStateVariablesDefined: ["graphXmax", "graphYmin", "graphYmax"],
      stateVariablesDeterminingDependencies: ["graphComponentName"],
      returnDependencies({ stateValues }) {
        if (stateValues.graphComponentName) {
          return {
            graph: {
              dependencyType: "multipleStateVariables",
              componentName: stateValues.graphComponentName,
              variableNames: ["xmin", "xmax", "ymin", "ymax"],
              variablesOptional: true,
            }
          }
        } else {
          return {};
        }
      },
      definition({ dependencyValues }) {
        if (!dependencyValues.graph) {
          return {
            setValue: {
              graphXmin: null, graphXmax: null, graphYmin: null, graphYmax: null
            }
          }
        }
        let graphXmin = dependencyValues.graph.stateValues.xmin;
        let graphXmax = dependencyValues.graph.stateValues.xmax;
        let graphYmin = dependencyValues.graph.stateValues.ymin;
        let graphYmax = dependencyValues.graph.stateValues.ymax;

        if ([graphXmin, graphXmax, graphYmin, graphYmax].every(Number.isFinite)) {
          return {
            setValue: {
              graphXmin, graphXmax, graphYmin, graphYmax
            }
          }
        } else {
          return {
            setValue: {
              graphXmin: null, graphXmax: null, graphYmin: null, graphYmax: null
            }
          }
        }
      }
    }


    stateVariableDefinitions.constraintResults = {
      additionalStateVariablesDefined: [{
        variableName: "constraintUsedByComponent",
        isArray: true,
        entryPrefixes: ["constraintUsedByComponent"]
      }],
      isArray: true,
      entryPrefixes: ["constraintResult"],
      stateVariablesDeterminingDependencies: [
        "independentComponentConstraints",
        "arrayEntryPrefixForConstraints",
        "arrayVariableForConstraints",
      ],
      returnArraySizeDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nDimensions];
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
            variableName: "independentComponentConstraints"
          },
          scales: {
            dependencyType: "stateVariable",
            variableName: "scales"
          },

        }

        let arrayEntryPrefix = stateValues.arrayEntryPrefixForConstraints;

        let dependenciesByKey = {};
        if (stateValues.independentComponentConstraints) {
          for (let arrayKey of arrayKeys) {
            dependenciesByKey[arrayKey] = {
              x: {
                dependencyType: "parentStateVariable",
                variableName: arrayEntryPrefix + (Number(arrayKey) + 1),
              }
            }
          }
        } else {
          // convert variableName to "__null" on null
          // as variableName must be defined
          // (an invalid variable name is OK)
          let variableName = stateValues.arrayVariableForConstraints ? stateValues.arrayVariableForConstraints : "__null";
          globalDependencies.xs = {
            dependencyType: "parentStateVariable",
            variableName
          }
        }

        return { globalDependencies, dependenciesByKey };

      },
      arrayDefinitionByKey({
        globalDependencyValues, dependencyValuesByKey, arrayKeys,
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
              ['x' + varEnding]: dependencyValuesByKey[arrayKey].x
            }
            let constraintUsed = false;

            for (let constraintChild of globalDependencyValues.constraintChildren) {
              let result = constraintChild.stateValues.applyComponentConstraint({
                variables,
                scales: globalDependencyValues.scales
              });

              if (result.constrained) {
                variables['x' + varEnding] = convertValueToMathExpression(result.variables['x' + varEnding]);
                constraintUsed = true;
              }

            }

            constraintResults[arrayKey] = variables['x' + varEnding]
            constraintUsedByComponent[arrayKey] = constraintUsed;

          }

          return {
            setValue: {
              constraintResults,
              constraintUsedByComponent
            }
          }

        } else {

          // apply constraint to whole array (even if just one array key requested)
          let variables = {};
          let constraintUsed = false;

          for (let arrayKey in globalDependencyValues.xs) {
            variables[`x${Number(arrayKey) + 1}`] = globalDependencyValues.xs[arrayKey];
          }

          for (let constraintChild of globalDependencyValues.constraintChildren) {
            let constraintResult;
            if (constraintChild.stateValues.applyConstraint) {
              constraintResult = constraintChild.stateValues.applyConstraint({
                variables,
                scales: globalDependencyValues.scales
              });
            } else {
              constraintResult = applyConstraintFromComponentConstraints({
                variables,
                applyComponentConstraint: constraintChild.stateValues.applyComponentConstraint,
                scales: globalDependencyValues.scales,
              })
            }

            if (constraintResult.constrained) {
              for (let varName in constraintResult.variables) {
                variables[varName] = convertValueToMathExpression(constraintResult.variables[varName]);
              }
              constraintUsed = true;
            }
          }

          let constraintResults = {};
          let constraintUsedByComponent = {};

          for (let arrayKey in globalDependencyValues.xs) {
            constraintResults[arrayKey] = variables[`x${Number(arrayKey) + 1}`]
            constraintUsedByComponent[arrayKey] = constraintUsed;
          }

          return { setValue: { constraintResults, constraintUsedByComponent } }


        }

      },

      inverseArrayDefinitionByKey: async function ({
        desiredStateVariableValues, globalDependencyValues,
        dependencyValuesByKey, dependencyNamesByKey, stateValues, workspace }) {

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
              ['x' + varEnding]: convertValueToMathExpression(desiredStateVariableValues.constraintResults[arrayKey])
            }


            for (let constraintChild of globalDependencyValues.constraintChildren) {
              let result = constraintChild.stateValues.applyComponentConstraint({
                variables,
                scales: globalDependencyValues.scales
              });

              if (result.constrained) {
                variables['x' + varEnding] = convertValueToMathExpression(result.variables['x' + varEnding]);
              }

            }

            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].x,
              desiredValue: variables['x' + varEnding],
            })
          }

          return {
            success: true,
            instructions
          }
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
          Object.assign(workspace.desiredConstraintResults, desiredStateVariableValues.constraintResults);

          let SVconstraintResults = await stateValues.constraintResults;
          for (let arrayKey in SVconstraintResults) {
            let varEnding = Number(arrayKey) + 1;
            if (arrayKey in workspace.desiredConstraintResults) {
              variables['x' + varEnding] = convertValueToMathExpression(workspace.desiredConstraintResults[arrayKey]);
            } else {
              variables['x' + varEnding] = convertValueToMathExpression(SVconstraintResults[arrayKey]);
            }
          }

          for (let constraintChild of globalDependencyValues.constraintChildren) {
            let constraintResult;
            if (constraintChild.stateValues.applyConstraint) {
              constraintResult = constraintChild.stateValues.applyConstraint({
                variables,
                scales: globalDependencyValues.scales
              });
            } else {
              constraintResult = applyConstraintFromComponentConstraints({
                variables,
                applyComponentConstraint: constraintChild.stateValues.applyComponentConstraint,
                scales: globalDependencyValues.scales
              })
            }

            if (constraintResult.constrained) {
              for (let varName in constraintResult.variables) {
                variables[varName] = convertValueToMathExpression(constraintResult.variables[varName]);
              }
            }
          }

          let constraintResults = {};
          for (let arrayKey in workspace.desiredConstraintResults) {
            constraintResults[arrayKey] = variables[`x${Number(arrayKey) + 1}`];
          }

          return {
            success: true,
            instructions: [{
              setDependency: "xs",
              desiredValue: constraintResults,
            }]
          }

        }
      }

    }

    stateVariableDefinitions.constraintUsed = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({
        constraintUsedByComponent: {
          dependencyType: "stateVariable",
          variableName: "constraintUsedByComponent"
        }
      }),
      definition: function ({ dependencyValues }) {
        let constraintUsed = Object.values(dependencyValues.constraintUsedByComponent)
          .some(x => x)

        return { setValue: { constraintUsed } }

      }
    }

    return stateVariableDefinitions;
  }


}
