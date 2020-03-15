import BaseComponent from './abstract/BaseComponent';

export default class Constraints extends BaseComponent {
  static componentType = "constraints";
  static rendererType = undefined;

  // remove default properties from base component
  static createPropertiesObject() {
    return {};
  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atLeastZeroConstraints",
      componentType: '_constraint',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.independentComponentConstraints = {
      returnDependencies: () => ({
        constraintChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroConstraints",
          variableNames: ["independentComponentConstraints"]
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
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
        newValues: {
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
        newValues: {
          arrayVariableForConstraints:
            dependencyValues.arrayVariableForConstraints
        }
      })
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
      returnDependencies: function ({ stateValues, arrayKeys }) {

        let dependencies = {
          constraintChildren: {
            dependencyType: "childStateVariables",
            childLogicName: "atLeastZeroConstraints",
            variableNames: ["applyConstraint", "applyComponentConstraint"],
            variablesOptional: true,
          },
          independentComponentConstraints: {
            dependencyType: "stateVariable",
            variableName: "independentComponentConstraints"
          }
        }

        let arrayEntryPrefix = stateValues.arrayEntryPrefixForConstraints;

        if (stateValues.independentComponentConstraints && arrayKeys) {
          let arrayKey = Number(arrayKeys[0]);
          dependencies[`x${arrayKey + 1}`] = {
            dependencyType: "parentStateVariable",
            variableName: `${arrayEntryPrefix}${arrayKey + 1}`,
          };
        } else {
          dependencies.xs = {
            dependencyType: "parentStateVariable",
            variableName: stateValues.arrayVariableForConstraints,
          }
        }

        return dependencies;
      },
      definition: function ({ dependencyValues, arrayKeys }) {

        // console.log("constraintResult dependencies")
        // console.log(dependencyValues);
        // console.log(arrayKeys)

        if (dependencyValues.independentComponentConstraints && arrayKeys) {
          let arrayKey = Number(arrayKeys[0]);
          let variables = {
            [`x${arrayKey + 1}`]: dependencyValues[`x${arrayKey + 1}`]
          }
          let constraintUsed = false;

          for (let constraintChild of dependencyValues.constraintChildren) {
            let constraintResult = constraintChild.stateValues.applyComponentConstraint(variables);

            if (constraintResult.constrained) {
              variables[`x${arrayKey + 1}`] = constraintResult.variables[`x${arrayKey + 1}`]
              constraintUsed = true;
            }


          }

          return {
            newValues: {
              constraintResults: {
                [arrayKey]: variables[`x${arrayKey + 1}`]
              },
              constraintUsedByComponent: {
                [arrayKey]: constraintUsed
              }
            }
          }

        } else {

          // apply constraint to whole array (even if just one array key requested)
          let variables = {};
          let constraintUsed = false;

          for (let arrayKey in dependencyValues.xs) {
            variables[`x${Number(arrayKey) + 1}`] = dependencyValues.xs[arrayKey];
          }

          for (let constraintChild of dependencyValues.constraintChildren) {
            let constraintResult;
            if (constraintChild.stateValues.applyConstraint) {
              constraintResult = constraintChild.stateValues.applyConstraint(variables);
            } else {
              constraintResult = applyConstraintFromComponentConstraints({
                variables,
                applyComponentConstraint: constraintChild.stateValues.applyComponentConstraint
              })
            }

            if (constraintResult.constrained) {
              Object.assign(variables, constraintResult.variables);
              constraintUsed = true;
            }
          }

          let arrayKey;
          if (arrayKeys) {
            arrayKey = Number(arrayKeys[0]);
          }


          if (arrayKey === undefined) {
            // return result as an array to indicate we are returning entire array
            let constraintResults = [];
            let constraintUsedByComponent = [];
            for (let arrayKey in dependencyValues.xs) {
              constraintResults[arrayKey] = variables[`x${Number(arrayKey) + 1}`];
              constraintUsedByComponent[arrayKey] = constraintUsed;
            }
            return { newValues: { constraintResults, constraintUsedByComponent } }
          } else {
            let constraintResults = {
              [arrayKey]: variables[`x${Number(arrayKey) + 1}`]
            }
            let constraintUsedByComponent = {
              [arrayKey]: constraintUsed
            }
            return { newValues: { constraintResults, constraintUsedByComponent } }
          }


        }

      },

      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues,
        arrayKeys, stateValues, initialChange }) {

        // console.log('inverse definition of constraints')
        // console.log(desiredStateVariableValues);
        // console.log(dependencyValues)
        // console.log(stateValues)

        // Note: the idea is that we want the constrain applied even in the reverse direction
        // so that downstream variables will see the effect of the constraint

        // To accomplish this, we send the unconstrained value in desiredStateVariableValues.constrainResult
        // and will send the constraint result to the xs (or xs arrayKey) dependency

        if (dependencyValues.independentComponentConstraints && arrayKeys) {

          // we applied constraint to just one component

          let arrayKey = Number(arrayKeys[0]);

          // in this case, desiredStateVariableValues.constraintResult
          // should just contain the value for the one component
          let variables = {
            [`x${arrayKey + 1}`]: desiredStateVariableValues.constraintResults[arrayKey]
          }

          for (let constraintChild of dependencyValues.constraintChildren) {
            let constraintResult = constraintChild.stateValues.applyComponentConstraint(variables);

            if (constraintResult.constrained) {
              variables[`x${arrayKey + 1}`] = constraintResult.variables[`x${arrayKey + 1}`]
            }

          }

          return {
            success: true,
            instructions: [{
              setDependency: `x${arrayKey + 1}`,
              desiredValue: variables[`x${arrayKey + 1}`],
            }]
          }
        } else {

          // we applied constraint to whole array
          let variables = {};

          // desiredStateVariableValues.constraintResult could just a
          // subset of keys (if arrayKeys specified)
          // but we should apply constraint function to all values
          // We start with previous values of constraintResults
          // and then modify any that are in desiredStateVariableValues.constraintResults

          for (let arrayKey in stateValues.constraintResults) {
            if (arrayKey in desiredStateVariableValues.constraintResults) {
              variables[`x${Number(arrayKey) + 1}`] = desiredStateVariableValues.constraintResults[arrayKey];
            } else {
              variables[`x${Number(arrayKey) + 1}`] = stateValues.constraintResults[arrayKey];
            }
          }

          for (let constraintChild of dependencyValues.constraintChildren) {
            let constraintResult;
            if (constraintChild.stateValues.applyConstraint) {
              constraintResult = constraintChild.stateValues.applyConstraint(variables);
            } else {
              constraintResult = applyConstraintFromComponentConstraints({
                variables,
                applyComponentConstraint: constraintChild.stateValues.applyComponentConstraint
              })
            }

            if (constraintResult.constrained) {
              Object.assign(variables, constraintResult.variables);
            }
          }

          let constraintResults = [];
          for (let arrayKey in desiredStateVariableValues.constraintResults) {
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
      componentType: "boolean",
      returnDependencies: () => ({
        constraintUsedByComponent: {
          dependencyType: "stateVariable",
          variableName: "constraintUsedByComponent"
        }
      }),
      definition: function ({ dependencyValues }) {
        let constraintUsed = Object.values(dependencyValues.constraintUsedByComponent)
          .some(x => x)

        return { newValues: { constraintUsed } }

      }
    }

    return stateVariableDefinitions;
  }


}

function applyConstraintFromComponentConstraints({ variables, applyComponentConstraint }) {
  let newVariables = {};
  let constrained = false;

  for (let varName in variables) {
    let result = applyComponentConstraint({ [varName]: variables[varName] })
    if (result.constrained) {
      constrained = true;
      newVariables[varName] = result.variables[varName]
    }
  }
  if (constrained) {
    return {
      constrained,
      variables: newVariables
    }
  } else {
    return {};
  }

}