import MathComponent from './Math.js';
import subsets, { buildSubsetFromMathExpression } from '../utils/subset-of-reals.js';
import { renameStateVariable } from '../utils/stateVariables.js';
import me from '../../_snowpack/pkg/math-expressions.js';
export default class SubsetOfReals extends MathComponent {

  static componentType = "subsetOfReals";
  static rendererType = "math";

  // used when creating new component via adapter or copy prop
  static primaryStateVariableForDefinition = "subsetValue";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.createIntervals.defaultValue = true;

    attributes.variable = {
      createComponentOfType: "variable",
      createStateVariable: "variable",
      defaultValue: me.fromAst("x"),
    }

    attributes.displayMode = {
      createComponentOfType: "text",
      createStateVariable: "displayMode",
      defaultValue: "intervals",
      public: true,
      toLowerCase: true,
      validValues: ["intervals", "inequalities"]
    };


    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    // rename unnormalizedValue to unnormalizedValuePreliminary
    renameStateVariable({
      stateVariableDefinitions,
      oldName: "unnormalizedValue",
      newName: "unnormalizedValuePreliminary"
    });

    stateVariableDefinitions.value.shadowingInstructions.createComponentOfType = "math";

    stateVariableDefinitions.haveSingleSubsetChild = {
      returnDependencies: () => ({
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"]
        }
      }),
      definition({ dependencyValues, componentInfoObjects }) {

        let haveSingleSubsetChild = 
        dependencyValues.mathChildren.length === 1 &&
        dependencyValues.mathChildren.filter(child =>
          componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "subsetOfReals"
          })
        ).length === 1;

        return { setValue: { haveSingleSubsetChild } }
      }
    }

    stateVariableDefinitions.subsetValue = {
      stateVariablesDeterminingDependencies: ["haveSingleSubsetChild"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          haveSingleSubsetChild: {
            dependencyType: "stateVariable",
            variableName: "haveSingleSubsetChild"
          },
        }

        if (stateValues.haveSingleSubsetChild) {
          dependencies.subsetChild = {
            dependencyType: "child",
            childGroups: ["maths"],
            variableNames: ["subsetValue"]
          }
        } else {
          dependencies.unnormalizedValuePreliminary = {
            dependencyType: "stateVariable",
            variableName: "unnormalizedValuePreliminary"
          };
          dependencies.variable = {
            dependencyType: "stateVariable",
            variableName: "variable"
          };
        }
        return dependencies;
      },
      definition({ dependencyValues }) {

        let subsetValue;

        if (dependencyValues.haveSingleSubsetChild) {
          subsetValue = dependencyValues.subsetChild[0].stateValues.subsetValue;
        } else {
          subsetValue = buildSubsetFromMathExpression(
            dependencyValues.unnormalizedValuePreliminary,
            dependencyValues.variable
          )
        }

        return { setValue: { subsetValue } }
      },
      async inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues }) {

        if (dependencyValues.haveSingleSubsetChild) {
          return {
            success: true,
            instructions: [{
              setDependency: "subsetChild",
              desiredValue: desiredStateVariableValues.subsetValue,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {

          let mathExpression = mathExpressionFromSubsetValue({
            subsetValue: desiredStateVariableValues.subsetValue,
            variable: dependencyValues.variable,
            displayMode: await stateValues.displayMode
          })

          return {
            success: true,
            instructions: [{
              setDependency: "unnormalizedValuePreliminary",
              desiredValue: mathExpression
            }]
          }
        }
      }
    }

    stateVariableDefinitions.unnormalizedValue = {
      returnDependencies: () => ({
        subsetValue: {
          dependencyType: "stateVariable",
          variableName: "subsetValue"
        },
        displayMode: {
          dependencyType: "stateVariable",
          variableName: "displayMode"
        },
        variable: {
          dependencyType: "stateVariable",
          variableName: "variable"
        },
      }),
      definition({ dependencyValues }) {

        let unnormalizedValue = mathExpressionFromSubsetValue(dependencyValues);

        return { setValue: { unnormalizedValue } }


      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let subsetValue = buildSubsetFromMathExpression(
          desiredStateVariableValues.unnormalizedValue,
          dependencyValues.variable
        )

        return {
          success: true,
          instructions: [{
            setDependency: "subsetValue",
            desiredValue: subsetValue
          }]
        }

      }
    }

    return stateVariableDefinitions;

  }

}

function mathExpressionFromSubsetValue({
  subsetValue, variable, displayMode = "intervals"
}) {

  function subsetToMath(subset) {

    if (subset === null) {
      return '\uff3f';
    }

    if (displayMode === "intervals") {
      if (subset.closedInterval) {
        return ["interval", ["tuple", subset.left, subset.right], ["tuple", true, true]];
      } else if (subset.openClosedInterval) {
        return ["interval", ["tuple", subset.left, subset.right], ["tuple", false, true]];
      } else if (subset.closedOpenInterval) {
        return ["interval", ["tuple", subset.left, subset.right], ["tuple", true, false]];
      } else {
        return subset.toMathExpression().tree;
      }
    } else {
      if (subset.closedInterval) {
        return ["lts", ["tuple", subset.left, variable, subset.right], ["tuple", false, false]];
      } else if (subset.openClosedInterval) {
        if (subset.left === -Infinity) {
          return ["le", variable, subset.right];
        } else {
          return ["lts", ["tuple", subset.left, variable, subset.right], ["tuple", true, false]];
        }
      } else if (subset.closedOpenInterval) {
        if (subset.right === Infinity) {
          return ["ge", variable, subset.left];
        } else {
          return ["lts", ["tuple", subset.left, variable, subset.right], ["tuple", false, true]];
        }
      } else if (subset instanceof subsets.OpenInterval) {
        if (subset.left === -Infinity) {
          return ["<", variable, subset.right];
        } else if (subset.right === Infinity) {
          return [">", variable, subset.left];
        } else {
          return ["lts", ["tuple", subset.left, variable, subset.right], ["tuple", true, true]];
        }
      } else if (subset instanceof subsets.Singleton) {
        return ['=', variable, subset.element];
      } else if (subset.isEmpty()) {
        return ['in', variable, '∅'];
      } else if (subset instanceof subsets.RealLine) {
        return ['in', variable, 'R'];
      } else {
        return null;
      }
    }
  }


  let expression;

  // merge any singletons to create closed intervals
  if (subsetValue instanceof subsets.Union) {
    let singletons = subsetValue.subsets
      .filter(x => x instanceof subsets.Singleton);

    let intervals = subsetValue.subsets
      .filter(x => x instanceof subsets.OpenInterval);

    for (let ind1 = 0; ind1 < singletons.length; ind1++) {

      let x = singletons[ind1].element;

      for (let ind2 = 0; ind2 < intervals.length; ind2++) {
        let interval = intervals[ind2];

        if (x === interval.left) {
          if (interval.openClosedInterval) {
            interval.closedInterval = true;
            delete interval.openClosedInterval;
          } else {
            interval = {
              left: interval.left,
              right: interval.right,
              closedOpenInterval: true
            };
            intervals.splice(ind2, 1, interval);
          }
          singletons.splice(ind1, 1);
          ind1--;
          // break;
        } else if (x === interval.right) {
          if (interval.closedOpenInterval) {
            interval.closedInterval = true;
            delete interval.closedOpenInterval;
          } else {
            interval = {
              left: interval.left,
              right: interval.right,
              openClosedInterval: true
            };
            intervals.splice(ind2, 1, interval);
          }
          singletons.splice(ind1, 1);
          ind1--;
          // break;
        }
      }

    }


    let mathSubsets = [...intervals, ...singletons]
      .sort((a, b) => (a.left === undefined ? a.element : a.left) - (b.left === undefined ? b.element : b.left))
      .map(x => subsetToMath(x));

    if (mathSubsets.length > 1) {
      if (displayMode === "intervals") {
        expression = me.fromAst(["union", ...mathSubsets]);
      } else {
        expression = me.fromAst(["or", ...mathSubsets]);
      }
    } else {
      expression = me.fromAst(mathSubsets[0]);
    }

  } else {
    expression = me.fromAst(subsetToMath(subsetValue));
  }

  return expression;
}
