/*
  Based on subsets-of-reals, version 0.0.1
  by Jim Fowler <fowler@math.osu.edu> (http://kisonecat.com/)
  github.com/kisonecat/subsets-of-reals

  Redistributed and modified under the terms of GPL-3.0

*/

import me from '../../_snowpack/pkg/math-expressions.js';


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
    return (this.setMinus(that)).union(that.setMinus(this));
  }

  equals(that) {
    return this.symmetricDifference(that).isEmpty();
  }
}

/** **************************************************************/
class EmptySet extends Subset {
  union(that) {
    return that;
  }

  intersect( /* subset */) {
    return new EmptySet();
  }

  contains( /* element */) {
    return false;
  }

  isEmpty() {
    return true;
  }

  complement() {
    return new RealLine();
  }

  toString() {
    return '∅';
  }

  toMathExpression() {
    return me.fromAst('∅')
  }
}

/** **************************************************************/
class RealLine extends Subset {
  union( /* that */) {
    return new RealLine();
  }

  intersect(that) {
    return that;
  }

  contains( /* element */) {
    return true;
  }

  complement() {
    return new EmptySet();
  }

  isEmpty() {
    return false;
  }

  toString() {
    return 'ℝ';
  }

  toMathExpression() {
    return me.fromAst('R')
  }
}

/** **************************************************************/
class Singleton extends Subset {
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
    return (element === this.element);
  }

  complement() {
    return new Union([new OpenInterval(-Infinity, this.element),
    new OpenInterval(this.element, Infinity)]);
  }

  toString() {
    return `{${this.element}}`;
  }

  toMathExpression() {
    return me.fromAst(["set", this.element])
  }

}

/** **************************************************************/
class Union extends Subset {
  intersect(subset) {
    return new Union(this.subsets.map(s => subset.intersect(s)));
  }

  toString() {
    return this.subsets.map(s => s.toString()).join(' U ');
  }

  toMathExpression() {
    return me.fromAst(['union', ...this.subsets.map(s => s.toMathExpression().tree)])
  }

  constructor(subsets) {
    super();
    let prelimSubsets = subsets.filter(s => !s.isEmpty());

    if (prelimSubsets.length === 0) {
      return new EmptySet();
    }

    // flatten
    prelimSubsets = prelimSubsets.reduce((acc, val) => val instanceof Union ? acc.concat(val.subsets) : acc.concat(val), []);


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
    return this.subsets.some(s => s.contains(element));
  }

  isEmpty() {
    return this.subsets.every(s => s.isEmpty());
  }

  complement() {
    return this.subsets.
      map(s => s.complement()).
      reduce((a, b) => a.intersect(b));
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
    return new OpenInterval(Math.max(this.left, that.left), Math.min(this.right, that.right));
  }

  complement() {
    return new Union([new OpenClosedInterval(-Infinity, this.left),
    new ClosedOpenInterval(this.right, Infinity)]);
  }

  isEmpty() {
    return (this.left >= this.right);
  }

  contains(element) {
    return (element > this.left) && (element < this.right);
  }

  toString() {
    return `(${this.left.toString()},${this.right.toString()})`;
  }

  toMathExpression() {
    return me.fromAst(['interval', ['tuple', this.left, this.right], ['tuple', false, false]])
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
      pieces.push(new Singleton(left))
    }
    if (Number.isFinite(right)) {
      pieces.push(new Singleton(right))
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
      pieces.push(new Singleton(right))
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
      pieces.push(new Singleton(left))
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
