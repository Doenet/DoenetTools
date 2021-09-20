import MathComponent from './Math';
import subsets from '../utils/subset-of-reals';
import { renameStateVariable } from '../utils/stateVariables';
import me from 'math-expressions';
import { deepCompare } from '../utils/deepFunctions';

export default class SubsetOfReals extends MathComponent {

  static componentType = "subsetOfReals";
  static rendererType = "math";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
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

    stateVariableDefinitions.subsetValue = {
      returnDependencies: () => ({
        unnormalizedValuePreliminary: {
          dependencyType: "stateVariable",
          variableName: "unnormalizedValuePreliminary"
        },
        variable: {
          dependencyType: "stateVariable",
          variableName: "variable"
        },
      }),
      definition({ dependencyValues }) {

        function buildSubsetFromIntervals(tree, variable) {

          if (!Array.isArray(tree)) {
            if (Number.isFinite(tree)) {
              return new subsets.Singleton(tree)
            } else if (tree === "R") {
              return new subsets.RealLine();
            } else {
              return null;
            }
          }

          let operator = tree[0];

          if (operator === "interval") {
            let endpoints = tree[1];
            let closed = tree[2];

            let left = endpoints[1];
            if (!Number.isFinite(left)) {
              left = me.fromAst(left).evaluate_to_constant();
              if (!(Number.isFinite(left) || left === Infinity || left === -Infinity)) {
                return null;
              }
            }

            let right = endpoints[2];
            if (!Number.isFinite(right)) {
              right = me.fromAst(right).evaluate_to_constant();
              if (!(Number.isFinite(right) || right === Infinity || right === -Infinity)) {
                return null;
              }
            }

            if (closed[1]) {
              if (closed[2]) {
                return new subsets.ClosedInterval(left, right)
              } else {
                return new subsets.ClosedOpenInterval(left, right)
              }
            } else {
              if (closed[2]) {
                return new subsets.OpenClosedInterval(left, right)
              } else {
                return new subsets.OpenInterval(left, right)
              }
            }

          } else if (operator === "union" || operator === "or") {
            let pieces = tree.slice(1).map(x => buildSubsetFromIntervals(x, variable)).filter(x => x);

            if (pieces.length === 0) {
              return null;
            } else if (pieces.length === 1) {
              return pieces[0];
            } else {
              return new subsets.Union(pieces);
            }

          } else if (operator === "intersect" || operator === "and") {
            let pieces = tree.slice(1).map(x => buildSubsetFromIntervals(x, variable)).filter(x => x);

            if (pieces.length === 0) {
              return null;
            } else {
              return pieces.reduce((a, c) => a.intersect(c))
            }

          } else if (operator === "set") {
            let pieces = tree.slice(1).map(x => buildSubsetFromIntervals(x, variable)).filter(x => x);

            if (pieces.length === 0) {
              return null;
            } else if (pieces.length === 1) {
              return pieces[0];
            } else {
              return new subsets.Union(pieces);
            }

          } else if (["<", "le", ">", "ge", "=", "ne"].includes(operator)) {
            let left = tree[1];
            let varAtLeft = false;
            if (!Number.isFinite(left)) {
              if (deepCompare(left, variable)) {
                varAtLeft = true;
              } else {
                left = me.fromAst(left).evaluate_to_constant();
                if (!(Number.isFinite(left) || left === Infinity || left === -Infinity)) {
                  return null;
                }
              }
            }

            let right = tree[2];
            let varAtRight = false;
            if (!Number.isFinite(right)) {
              if (deepCompare(right, variable)) {
                varAtRight = true;
              } else {
                right = me.fromAst(right).evaluate_to_constant();
                if (!(Number.isFinite(right) || right === Infinity || right === -Infinity)) {
                  return null;
                }
              }
            }

            if (varAtLeft) {
              if (varAtRight) {
                return null;
              } else {
                if (operator === "<") {
                  return new subsets.OpenInterval(-Infinity, right)
                } else if (operator === "le") {
                  return new subsets.OpenClosedInterval(-Infinity, right)
                } else if (operator === ">") {
                  return new subsets.OpenInterval(right, Infinity)
                } else if (operator === "ge") {
                  return new subsets.ClosedOpenInterval(right, Infinity)
                } else if(operator === "=") {
                  if(Number.isFinite(right)) {
                    return new subsets.Singleton(right)
                  } else {
                    return new subsets.EmptySet();
                  }
                } else {
                  // operator === "ne"
                  if(Number.isFinite(right)) {
                    return new subsets.Union([
                      new subsets.OpenInterval(-Infinity, right),
                      new subsets.OpenInterval(right, Infinity)
                    ])
                  } else {
                    return new subsets.RealLine();
                  }
                }
              }
            } else {
              if (varAtRight) {
                if (operator === "<") {
                  return new subsets.OpenInterval(left, Infinity)
                } else if (operator === "le") {
                  return new subsets.ClosedOpenInterval(left, Infinity)
                } else if (operator === ">") {
                  return new subsets.OpenInterval(-Infinity, left)
                } else if (operator === "ge") {
                  return new subsets.OpenClosedInterval(-Infinity, left)
                } else if(operator === "=") {
                  if(Number.isFinite(left)) {
                    return new subsets.Singleton(left)
                  } else {
                    return new subsets.EmptySet();
                  }
                } else {
                  // operator === "ne"
                  if(Number.isFinite(left)) {
                    return new subsets.Union([
                      new subsets.OpenInterval(-Infinity, left),
                      new subsets.OpenInterval(left, Infinity)
                    ])
                  } else {
                    return new subsets.RealLine();
                  }
                }
              } else {
                return null;
              }
            }

          } else if (["lts", "gts"].includes(operator)) {

            let vals = tree[1].slice(1);
            let strict = tree[2].slice(1);

            if (vals.length !== 3 || !deepCompare(vals[1], variable)) {
              return null;
            }

            if (operator === "gts") {
              vals.reverse();
              strict.reverse();
            }


            let left = vals[0];
            if (!Number.isFinite(left)) {
              left = me.fromAst(left).evaluate_to_constant();
              if (!(Number.isFinite(left) || left === Infinity || left === -Infinity)) {
                return null;
              }
            }

            let right = vals[2];
            if (!Number.isFinite(right)) {
              right = me.fromAst(right).evaluate_to_constant();
              if (!(Number.isFinite(right) || right === Infinity || right === -Infinity)) {
                return null;
              }
            }

            if (strict[0]) {
              if (strict[1]) {
                return new subsets.OpenInterval(left, right)
              } else {
                return new subsets.OpenClosedInterval(left, right)
              }
            } else {
              if (strict[1]) {
                return new subsets.ClosedOpenInterval(left, right)
              } else {
                return new subsets.ClosedInterval(left, right)
              }
            }

          } else if (operator === "|") {
            let variable = tree[1];
            return buildSubsetFromIntervals(tree[2], variable)

          } else if (operator === "^" && (tree[2] === "C" || tree[2] === "c")) {
            let orig = buildSubsetFromIntervals(tree[1], variable);
            if (orig) {
              return orig.complement();
            } else {
              return null;
            }

          } else {
            let num = me.fromAst(tree).evaluate_to_constant();

            if (Number.isFinite(num)) {
              return new subset.Singleton(num)
            } else {
              return null;
            }
          }

        }


        let subsetValue = buildSubsetFromIntervals(
          dependencyValues.unnormalizedValuePreliminary.to_intervals().tree,
          dependencyValues.variable.tree
        );


        return { newValues: { subsetValue } }
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

        let v = dependencyValues.variable;

        function subsetToMath(subset) {

          if (subset === null) {
            return '\uff3f'
          }

          if (dependencyValues.displayMode === "intervals") {
            if (subset.closedInterval) {
              return ["interval", ["tuple", subset.left, subset.right], ["tuple", true, true]]
            } else if (subset.openClosedInterval) {
              return ["interval", ["tuple", subset.left, subset.right], ["tuple", false, true]]
            } else if (subset.closedOpenInterval) {
              return ["interval", ["tuple", subset.left, subset.right], ["tuple", true, false]]
            } else {
              return subset.toMathExpression().tree;
            }
          } else {
            if (subset.closedInterval) {
              return ["lts", ["tuple", subset.left, v, subset.right], ["tuple", false, false]]
            } else if (subset.openClosedInterval) {
              if (subset.left === -Infinity) {
                return ["le", v, subset.right]
              } else {
                return ["lts", ["tuple", subset.left, v, subset.right], ["tuple", true, false]]
              }
            } else if (subset.closedOpenInterval) {
              if (subset.right === Infinity) {
                return ["ge", v, subset.left]
              } else {
                return ["lts", ["tuple", subset.left, v, subset.right], ["tuple", false, true]]
              }
            } else if (subset instanceof subsets.OpenInterval) {
              if (subset.left === -Infinity) {
                return ["<", v, subset.right]
              } else if (subset.right === Infinity) {
                return [">", v, subset.left]
              } else {
                return ["lts", ["tuple", subset.left, v, subset.right], ["tuple", true, true]]
              }
            } else if (subset instanceof subsets.Singleton) {
              return ['=', v, subset.element]
            } else if (subset.isEmpty()) {
              return ['in', v, '∅']
            } else if (subset instanceof subsets.RealLine) {
              return ['in', v, 'R']
            } else {
              return null;
            }
          }
        }


        let subsetValue = dependencyValues.subsetValue

        let unnormalizedValue;

        // merge any singletons to create closed intervals
        if (subsetValue instanceof subsets.Union) {
          let singletons = subsetValue.subsets
            .filter(x => x instanceof subsets.Singleton);

          let intervals = subsetValue.subsets
            .filter(x => x instanceof subsets.OpenInterval)

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
                  }
                  intervals.splice(ind2, 1, interval)
                }
                singletons.splice(ind1, 1);
                ind1--;
                break;
              } else if (x === interval.right) {
                if (interval.closedOpenInterval) {
                  interval.closedInterval = true;
                  delete interval.closedOpenInterval;
                } else {
                  interval = {
                    left: interval.left,
                    right: interval.right,
                    openClosedInterval: true
                  }
                  intervals.splice(ind2, 1, interval)
                }
                singletons.splice(ind1, 1);
                ind1--;
                break;
              }
            }

          }


          let mathSubsets = [...intervals, ...singletons]
            .sort((a, b) => (a.left === undefined ? a.element : a.left) - (b.left === undefined ? b.element : b.left))
            .map(x => subsetToMath(x))

          if (mathSubsets.length > 1) {
            if (dependencyValues.displayMode === "intervals") {
              unnormalizedValue = me.fromAst(["union", ...mathSubsets])
            } else {
              unnormalizedValue = me.fromAst(["or", ...mathSubsets])
            }
          } else {
            unnormalizedValue = me.fromAst(mathSubsets[0]);
          }

        } else {
          unnormalizedValue = me.fromAst(subsetToMath(subsetValue))
        }

        return { newValues: { unnormalizedValue } }


      }
    }

    return stateVariableDefinitions;

  }

}