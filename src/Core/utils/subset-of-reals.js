/*
  Based on subsets-of-reals, version 0.0.1
  by Jim Fowler <fowler@math.osu.edu> (http://kisonecat.com/)
  github.com/kisonecat/subsets-of-reals

  Redistributed and modified under the terms of GPL-3.0

*/

import me from "math-expressions";
import { deepCompare } from "./deepFunctions";

/**
 * Exported module
 * @type {Boolean}
 */

/** **************************************************************/
class Subset {
  union(that) {
    return this.complement().intersect(that.complement()).complement();
  }

  intersectWithOpenInterval(that) {
    return this.intersect(that);
  }

  setMinus(that) {
    return this.intersect(that.complement());
  }

  symmetricDifference(that) {
    return this.setMinus(that).union(that.setMinus(this));
  }

  equals(that) {
    return this.symmetricDifference(that).isEmpty();
  }

  toJSON() {
    return {
      objectType: "subset",
      data: Object.assign({}, this),
      subsetType: this.constructor.subsetType,
    };
  }

  static reviver(key, value) {
    if (
      value &&
      value.objectType === "subset" &&
      value.subsetType !== undefined
    ) {
      if (value.subsetType === "emptySet") {
        return new EmptySet();
      } else if (value.subsetType === "realLine") {
        return new RealLine();
      } else if (value.subsetType === "singleton") {
        return new Singleton(value.data.element);
      } else if (value.subsetType === "union") {
        return new Union(value.data.subsets);
      } else if (value.subsetType === "openInterval") {
        return new OpenInterval(value.data.left, value.data.right);
      }
    }

    return value;
  }

  copy() {
    return this.constructor.reviver(null, this.toJSON());
  }
}

/** **************************************************************/
class EmptySet extends Subset {
  static subsetType = "emptySet";

  union(that) {
    return that;
  }

  intersect(/* subset */) {
    return new EmptySet();
  }

  contains(/* element */) {
    return false;
  }

  isEmpty() {
    return true;
  }

  complement() {
    return new RealLine();
  }

  toString() {
    return "∅";
  }

  toMathExpression() {
    return me.fromAst("∅");
  }
}

/** **************************************************************/
class RealLine extends Subset {
  static subsetType = "realLine";

  union(/* that */) {
    return new RealLine();
  }

  intersect(that) {
    return that;
  }

  contains(/* element */) {
    return true;
  }

  complement() {
    return new EmptySet();
  }

  isEmpty() {
    return false;
  }

  toString() {
    return "ℝ";
  }

  toMathExpression() {
    return me.fromAst("R");
  }
}

/** **************************************************************/
class Singleton extends Subset {
  static subsetType = "singleton";

  constructor(element) {
    super();

    if (!Number.isFinite(element)) {
      return new EmptySet();
    }

    this.element = element;
  }

  union(that) {
    if (that.contains(this.element)) {
      return that;
    } /* else */

    return new Union([that, this]);
  }

  intersect(subset) {
    if (subset.contains(this.element)) {
      return new Singleton(this.element);
    } /* else */

    return new EmptySet();
  }

  isEmpty() {
    return false;
  }

  contains(element) {
    return element === this.element;
  }

  complement() {
    return new Union([
      new OpenInterval(-Infinity, this.element),
      new OpenInterval(this.element, Infinity),
    ]);
  }

  toString() {
    return `{${this.element}}`;
  }

  toMathExpression() {
    return me.fromAst(["set", this.element]);
  }
}

/** **************************************************************/
class Union extends Subset {
  static subsetType = "union";

  intersect(subset) {
    return new Union(this.subsets.map((s) => subset.intersect(s)));
  }

  toString() {
    return this.subsets.map((s) => s.toString()).join(" U ");
  }

  toMathExpression() {
    return me.fromAst([
      "union",
      ...this.subsets.map((s) => s.toMathExpression().tree),
    ]);
  }

  constructor(subsets) {
    super();
    let prelimSubsets = subsets.filter((s) => !s.isEmpty());

    if (prelimSubsets.length === 0) {
      return new EmptySet();
    }

    // flatten
    prelimSubsets = prelimSubsets.reduce(
      (acc, val) =>
        val instanceof Union ? acc.concat(val.subsets) : acc.concat(val),
      [],
    );

    this.subsets = [];

    for (let ind1 = 0; ind1 < prelimSubsets.length; ind1++) {
      let sub1 = prelimSubsets[ind1];
      let addSub1 = true;

      if (sub1 instanceof RealLine) {
        return new RealLine();
      } else if (sub1 instanceof OpenInterval) {
        let left = sub1.left;
        let right = sub1.right;

        for (let ind2 = ind1 + 1; ind2 < prelimSubsets.length; ind2++) {
          let sub2 = prelimSubsets[ind2];
          if (sub2 instanceof OpenInterval) {
            // two open intervals
            if (left < sub2.right && sub2.left < right) {
              // intervals overlap
              left = Math.min(left, sub2.left);
              right = Math.max(right, sub2.right);
              prelimSubsets.splice(ind2, 1);
              ind2--;

              // stop processing sub2s and
              // keep sub1 in the queue to be processed
              // so that will catch passed singletons or intervals
              // that overlap with the extension of sub1
              addSub1 = false;
              ind1--;
              break;
            } else if (left === sub2.right || right === sub2.left) {
              // intervals just touch.  Check if there is a singleton
              // to fill in the gap

              let gap = left === sub2.right ? left : right;

              // first check if already passed a singleton that fits the gap
              let foundSingleton = false;
              for (let ind3 = 0; ind3 < this.subsets.length; ind3++) {
                let sub3 = this.subsets[ind3];
                if (sub3 instanceof Singleton && sub3.element === gap) {
                  this.subsets.splice(ind3, 1);
                  foundSingleton = true;
                  break;
                }
              }

              // then check if a future singleton fits the gap
              if (!foundSingleton) {
                for (let ind3 = ind1 + 1; ind3 < prelimSubsets.length; ind3++) {
                  let sub3 = prelimSubsets[ind3];
                  if (sub3 instanceof Singleton && sub3.element === gap) {
                    prelimSubsets.splice(ind3, 1);
                    foundSingleton = true;
                    if (ind3 < ind2) {
                      // have to shift ind2 as splice an entry in front of it
                      ind2--;
                    }
                    break;
                  }
                }
              }

              if (foundSingleton) {
                // merge intervals
                left = Math.min(left, sub2.left);
                right = Math.max(right, sub2.right);
                prelimSubsets.splice(ind2, 1);
                ind2--;

                // stop processing sub2s and
                // keep sub1 in the queue to be processed
                // so that will catch passed singletons or intervals
                // that overlap with the extension of sub1
                addSub1 = false;
                ind1--;
                break;
              }
            }
          } else {
            // open interval and singleton
            if (sub2.element > left && sub2.element < right) {
              // singleton is inside interval, delete it
              prelimSubsets.splice(ind2, 1);
              ind2--;
            }
          }
        }

        sub1.left = left;
        sub1.right = right;

        if (sub1.left === -Infinity && sub1.right === Infinity) {
          return new RealLine();
        }
      } else {
        // have singleton
        let val = sub1.element;

        for (let ind2 = ind1 + 1; ind2 < prelimSubsets.length; ind2++) {
          let sub2 = prelimSubsets[ind2];
          if (sub2 instanceof OpenInterval) {
            if (val > sub2.left && val < sub2.right) {
              // point is inside interval, delete point
              prelimSubsets.splice(ind1, 1);
              ind1--;
              addSub1 = false;
              break;
            }
          } else if (sub2.element === val) {
            // duplicate point, delete duplicate
            prelimSubsets.splice(ind2, 1);
            ind2--;
          }
        }
      }

      if (addSub1) {
        this.subsets.push(sub1);
      }
    }

    if (this.subsets.length === 1) {
      return this.subsets[0];
    }

    return this;
  }

  contains(element) {
    return this.subsets.some((s) => s.contains(element));
  }

  isEmpty() {
    return this.subsets.every((s) => s.isEmpty());
  }

  complement() {
    return this.subsets
      .map((s) => s.complement())
      .reduce((a, b) => a.intersect(b));
  }
}

/** **************************************************************/
class Interval extends Subset {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;

    if (!(this.left <= this.right)) {
      return new EmptySet();
    }

    if (this.left === -Infinity && this.right === Infinity) {
      return new RealLine();
    }

    return this;
  }
}

/** **************************************************************/
class OpenInterval extends Interval {
  static subsetType = "openInterval";

  constructor(left, right) {
    super(left, right);

    if (left === right) {
      return new EmptySet();
    }

    return this;
  }

  intersect(subset) {
    return subset.intersectWithOpenInterval(this);
  }

  intersectWithOpenInterval(that) {
    return new OpenInterval(
      Math.max(this.left, that.left),
      Math.min(this.right, that.right),
    );
  }

  complement() {
    return new Union([
      new OpenClosedInterval(-Infinity, this.left),
      new ClosedOpenInterval(this.right, Infinity),
    ]);
  }

  isEmpty() {
    return this.left >= this.right;
  }

  contains(element) {
    return element > this.left && element < this.right;
  }

  toString() {
    return `(${this.left.toString()},${this.right.toString()})`;
  }

  toMathExpression() {
    return me.fromAst([
      "interval",
      ["tuple", this.left, this.right],
      ["tuple", false, false],
    ]);
  }
}

/** **************************************************************/
class ClosedInterval extends Interval {
  constructor(left, right) {
    super(left, right);
    if (!(left <= right)) {
      return new EmptySet();
    }

    let pieces = [new OpenInterval(left, right)];

    if (Number.isFinite(left)) {
      pieces.push(new Singleton(left));
    }
    if (Number.isFinite(right)) {
      pieces.push(new Singleton(right));
    }

    return new Union(pieces);
  }
}

/** **************************************************************/
class OpenClosedInterval extends Interval {
  constructor(left, right) {
    super(left, right);

    if (!(left < right)) {
      return new EmptySet();
    }

    let pieces = [new OpenInterval(left, right)];

    if (Number.isFinite(right)) {
      pieces.push(new Singleton(right));
    }

    return new Union(pieces);
  }
}

/** **************************************************************/
class ClosedOpenInterval extends Interval {
  constructor(left, right) {
    super(left, right);

    if (!(left < right)) {
      return new EmptySet();
    }

    let pieces = [new OpenInterval(left, right)];

    if (Number.isFinite(left)) {
      pieces.push(new Singleton(left));
    }

    return new Union(pieces);
  }
}

/** **************************************************************/
const theModule = {
  Subset,
  EmptySet,
  RealLine,
  Singleton,
  Union,
  Interval,
  OpenInterval,
  ClosedInterval,
  OpenClosedInterval,
  ClosedOpenInterval,
};

/** **************************************************************/
export default theModule;

function buildSubsetFromIntervals(tree, variable) {
  if (!Array.isArray(tree)) {
    if (Number.isFinite(tree)) {
      return new Singleton(tree);
    } else if (tree === "R") {
      return new RealLine();
    } else if (
      tree === "varnothing" ||
      tree === "emptyset" ||
      tree === "\u2205"
    ) {
      // TODO: eliminate \u2205 once have varnothing integrated into latex parser
      return new EmptySet();
    } else {
      return new EmptySet();
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
        return new EmptySet();
      }
    }

    let right = endpoints[2];
    if (!Number.isFinite(right)) {
      right = me.fromAst(right).evaluate_to_constant();
      if (
        !(Number.isFinite(right) || right === Infinity || right === -Infinity)
      ) {
        return new EmptySet();
      }
    }

    if (closed[1]) {
      if (closed[2]) {
        return new ClosedInterval(left, right);
      } else {
        return new ClosedOpenInterval(left, right);
      }
    } else {
      if (closed[2]) {
        return new OpenClosedInterval(left, right);
      } else {
        return new OpenInterval(left, right);
      }
    }
  } else if (operator === "union" || operator === "or") {
    let pieces = tree
      .slice(1)
      .map((x) => buildSubsetFromIntervals(x, variable))
      .filter((x) => x);

    if (pieces.length === 0) {
      return new EmptySet();
    } else if (pieces.length === 1) {
      return pieces[0];
    } else {
      return new Union(pieces);
    }
  } else if (operator === "intersect" || operator === "and") {
    let pieces = tree
      .slice(1)
      .map((x) => buildSubsetFromIntervals(x, variable))
      .filter((x) => x);

    if (pieces.length === 0) {
      return new RealLine();
    } else {
      return pieces.reduce((a, c) => a.intersect(c));
    }
  } else if (operator === "set") {
    let pieces = tree
      .slice(1)
      .map((x) => buildSubsetFromIntervals(x, variable))
      .filter((x) => x);

    if (pieces.length === 0) {
      return new EmptySet();
    } else if (pieces.length === 1) {
      return pieces[0];
    } else {
      return new Union(pieces);
    }
  } else if (["<", "le", ">", "ge", "=", "ne"].includes(operator)) {
    let left = tree[1];
    let varAtLeft = false;
    if (!Number.isFinite(left)) {
      if (deepCompare(left, variable)) {
        varAtLeft = true;
      } else {
        left = me.fromAst(left).evaluate_to_constant();
        if (
          !(Number.isFinite(left) || left === Infinity || left === -Infinity)
        ) {
          return new EmptySet();
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
        if (
          !(Number.isFinite(right) || right === Infinity || right === -Infinity)
        ) {
          return new EmptySet();
        }
      }
    }

    if (varAtLeft) {
      if (varAtRight) {
        return new EmptySet();
      } else {
        if (operator === "<") {
          return new OpenInterval(-Infinity, right);
        } else if (operator === "le") {
          return new OpenClosedInterval(-Infinity, right);
        } else if (operator === ">") {
          return new OpenInterval(right, Infinity);
        } else if (operator === "ge") {
          return new ClosedOpenInterval(right, Infinity);
        } else if (operator === "=") {
          if (Number.isFinite(right)) {
            return new Singleton(right);
          } else {
            return new EmptySet();
          }
        } else {
          // operator === "ne"
          if (Number.isFinite(right)) {
            return new Union([
              new OpenInterval(-Infinity, right),
              new OpenInterval(right, Infinity),
            ]);
          } else {
            return new RealLine();
          }
        }
      }
    } else {
      if (varAtRight) {
        if (operator === "<") {
          return new OpenInterval(left, Infinity);
        } else if (operator === "le") {
          return new ClosedOpenInterval(left, Infinity);
        } else if (operator === ">") {
          return new OpenInterval(-Infinity, left);
        } else if (operator === "ge") {
          return new OpenClosedInterval(-Infinity, left);
        } else if (operator === "=") {
          if (Number.isFinite(left)) {
            return new Singleton(left);
          } else {
            return new EmptySet();
          }
        } else {
          // operator === "ne"
          if (Number.isFinite(left)) {
            return new Union([
              new OpenInterval(-Infinity, left),
              new OpenInterval(left, Infinity),
            ]);
          } else {
            return new RealLine();
          }
        }
      } else {
        return new EmptySet();
      }
    }
  } else if (["lts", "gts"].includes(operator)) {
    let vals = tree[1].slice(1);
    let strict = tree[2].slice(1);

    if (vals.length !== 3 || !deepCompare(vals[1], variable)) {
      return new EmptySet();
    }

    if (operator === "gts") {
      vals.reverse();
      strict.reverse();
    }

    let left = vals[0];
    if (!Number.isFinite(left)) {
      left = me.fromAst(left).evaluate_to_constant();
      if (!(Number.isFinite(left) || left === Infinity || left === -Infinity)) {
        return new EmptySet();
      }
    }

    let right = vals[2];
    if (!Number.isFinite(right)) {
      right = me.fromAst(right).evaluate_to_constant();
      if (
        !(Number.isFinite(right) || right === Infinity || right === -Infinity)
      ) {
        return new EmptySet();
      }
    }

    if (strict[0]) {
      if (strict[1]) {
        return new OpenInterval(left, right);
      } else {
        return new OpenClosedInterval(left, right);
      }
    } else {
      if (strict[1]) {
        return new ClosedOpenInterval(left, right);
      } else {
        return new ClosedInterval(left, right);
      }
    }
  } else if (operator === "|") {
    let variable = tree[1];
    return buildSubsetFromIntervals(tree[2], variable);
  } else if (operator === "^" && (tree[2] === "C" || tree[2] === "c")) {
    let orig = buildSubsetFromIntervals(tree[1], variable);
    if (orig) {
      return orig.complement();
    } else {
      return new EmptySet();
    }
  } else if (operator === "in") {
    if (deepCompare(tree[1], variable)) {
      return buildSubsetFromIntervals(tree[2], variable);
    } else {
      return new EmptySet();
    }
  } else if (operator === "ni") {
    if (deepCompare(tree[2], variable)) {
      return buildSubsetFromIntervals(tree[1], variable);
    } else {
      return new EmptySet();
    }
  } else if (operator === "notin") {
    if (deepCompare(tree[1], variable)) {
      let orig = buildSubsetFromIntervals(tree[2], variable);
      if (orig) {
        return orig.complement();
      }
    }
    return new EmptySet();
  } else if (operator === "notni") {
    if (deepCompare(tree[2], variable)) {
      let orig = buildSubsetFromIntervals(tree[1], variable);
      if (orig) {
        return orig.complement();
      }
    }
    return new EmptySet();
  } else {
    let num = me.fromAst(tree).evaluate_to_constant();

    if (Number.isFinite(num)) {
      return new Singleton(num);
    } else {
      return new EmptySet();
    }
  }
}

export function buildSubsetFromMathExpression(expr, variable) {
  return buildSubsetFromIntervals(expr.to_intervals().tree, variable?.tree);
}

export function mathExpressionFromSubsetValue({
  subsetValue,
  variable,
  displayMode = "intervals",
}) {
  // displayMode is either "intervals" or "inequalities"

  function subsetToMath(subset) {
    if (subset === null) {
      return "\uff3f";
    }

    if (displayMode === "intervals") {
      if (subset.closedInterval) {
        return [
          "interval",
          ["tuple", subset.left, subset.right],
          ["tuple", true, true],
        ];
      } else if (subset.openClosedInterval) {
        return [
          "interval",
          ["tuple", subset.left, subset.right],
          ["tuple", false, true],
        ];
      } else if (subset.closedOpenInterval) {
        return [
          "interval",
          ["tuple", subset.left, subset.right],
          ["tuple", true, false],
        ];
      } else {
        return subset.toMathExpression().tree;
      }
    } else {
      if (subset.closedInterval) {
        return [
          "lts",
          ["tuple", subset.left, variable, subset.right],
          ["tuple", false, false],
        ];
      } else if (subset.openClosedInterval) {
        if (subset.left === -Infinity) {
          return ["le", variable, subset.right];
        } else {
          return [
            "lts",
            ["tuple", subset.left, variable, subset.right],
            ["tuple", true, false],
          ];
        }
      } else if (subset.closedOpenInterval) {
        if (subset.right === Infinity) {
          return ["ge", variable, subset.left];
        } else {
          return [
            "lts",
            ["tuple", subset.left, variable, subset.right],
            ["tuple", false, true],
          ];
        }
      } else if (subset instanceof OpenInterval) {
        if (subset.left === -Infinity) {
          return ["<", variable, subset.right];
        } else if (subset.right === Infinity) {
          return [">", variable, subset.left];
        } else {
          return [
            "lts",
            ["tuple", subset.left, variable, subset.right],
            ["tuple", true, true],
          ];
        }
      } else if (subset instanceof Singleton) {
        return ["=", variable, subset.element];
      } else if (subset.isEmpty()) {
        return ["in", variable, "∅"];
      } else if (subset instanceof RealLine) {
        return ["in", variable, "R"];
      } else {
        return null;
      }
    }
  }

  let expression;

  // merge any singletons to create closed intervals
  if (subsetValue instanceof Union) {
    let singletons = subsetValue.subsets.filter((x) => x instanceof Singleton);

    let intervals = subsetValue.subsets.filter(
      (x) => x instanceof OpenInterval,
    );

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
              closedOpenInterval: true,
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
              openClosedInterval: true,
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
      .sort(
        (a, b) =>
          (a.left === undefined ? a.element : a.left) -
          (b.left === undefined ? b.element : b.left),
      )
      .map((x) => subsetToMath(x));

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
