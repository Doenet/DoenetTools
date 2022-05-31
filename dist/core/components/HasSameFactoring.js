import checkEquality from '../utils/checkEquality.js';
import BooleanComponent from './Boolean.js';
import me from '../../_snowpack/pkg/math-expressions.js';

export default class HasSameFactoring extends BooleanComponent {
  static componentType = "hasSameFactoring";
  static rendererType = "boolean";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.variable = {
      createComponentOfType: "variable",
      createStateVariable: "variable",
      defaultValue: me.fromAst("x")
    }

    attributes.restrictDivision = {
      createComponentOfType: "boolean",
      createStateVariable: "restrictDivision",
      defaultValue: false
    }

    // Note: monomialFactorMustMatch implies restrictDivision
    attributes.monomialFactorMustMatch = {
      createComponentOfType: "boolean",
      createStateVariable: "monomialFactorMustMatch",
      defaultValue: false
    }



    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "maths",
      componentTypes: ["math"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.parsedExpression;
    delete stateVariableDefinitions.mathChildrenByCode;


    stateVariableDefinitions.value = {
      public: true,
      componentType: "boolean",
      forRenderer: true,
      returnDependencies: () => ({
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value"]
        },
        allowedErrorInNumbers: {
          dependencyType: "stateVariable",
          variableName: "allowedErrorInNumbers"
        },
        includeErrorInNumberExponents: {
          dependencyType: "stateVariable",
          variableName: "includeErrorInNumberExponents"
        },
        allowedErrorIsAbsolute: {
          dependencyType: "stateVariable",
          variableName: "allowedErrorIsAbsolute"
        },
        nSignErrorsMatched: {
          dependencyType: "stateVariable",
          variableName: "nSignErrorsMatched"
        },
        variable: {
          dependencyType: "stateVariable",
          variableName: "variable"
        },
        restrictDivision: {
          dependencyType: "stateVariable",
          variableName: "restrictDivision"
        },
        monomialFactorMustMatch: {
          dependencyType: "stateVariable",
          variableName: "monomialFactorMustMatch"
        }
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.mathChildren.length !== 2) {
          return { setValue: { value: false } }
        }

        let expr1 = dependencyValues.mathChildren[0].stateValues.value;
        let expr2 = dependencyValues.mathChildren[1].stateValues.value;

        let result = checkEquality({
          object1: expr1, object2: expr2,
          isUnordered: false, partialMatches: false,
          symbolicEquality: false,
          allowedErrorInNumbers: dependencyValues.allowedErrorInNumbers,
          includeErrorInNumberExponents: dependencyValues.includeErrorInNumberExponents,
          allowedErrorIsAbsolute: dependencyValues.allowedErrorIsAbsolute,
          nSignErrorsMatched: dependencyValues.nSignErrorsMatched,
        });

        if (result.fraction_equal !== 1) {
          return { setValue: { value: false } }
        }

        if (Array.isArray(expr1.tree) && expr1.tree[0] === "-") {
          expr1 = me.fromAst(expr1.tree[1]);
        }
        if (Array.isArray(expr2.tree) && expr2.tree[0] === "-") {
          expr2 = me.fromAst(expr2.tree[1]);
        }

        if (!dependencyValues.restrictDivision && !dependencyValues.monomialFactorMustMatch) {
          // if have a ratio where denominator is a constant
          // ignore denominator
          if (Array.isArray(expr1.tree) && expr1.tree[0] === "/"
            && me.fromAst(expr1.tree[2]).variables().length === 0
          ) {
            expr1 = me.fromAst(expr1.tree[1]);
            if (Array.isArray(expr1.tree) && expr1.tree[0] === "-") {
              expr1 = me.fromAst(expr1.tree[1]);
            }
          }
          if (Array.isArray(expr2.tree) && expr2.tree[0] === "/"
            && me.fromAst(expr2.tree[2]).variables().length === 0
          ) {
            expr2 = me.fromAst(expr2.tree[1]);
            if (Array.isArray(expr2.tree) && expr2.tree[0] === "-") {
              expr2 = me.fromAst(expr2.tree[1]);
            }
          }
        }

        expr1 = me.fromAst(expandPositiveIntegerPowers(expr1.tree));
        expr2 = me.fromAst(expandPositiveIntegerPowers(expr2.tree));

        if (!(Array.isArray(expr1.tree) && expr1.tree[0] === "*")) {
          if (!(Array.isArray(expr2.tree) && expr2.tree[0] === "*")) {
            // neither expression is a product, so they have the same factoring
            return { setValue: { value: true } }
          } else {
            return { setValue: { value: false } }
          }
        } else if (!(Array.isArray(expr2.tree) && expr2.tree[0] === "*")) {
          return { setValue: { value: false } }
        };

        // both expressions are products and are mathematically equivalent

        if (dependencyValues.monomialFactorMustMatch) {
          let monomial1 = findMonomialFromFactors(expr1.tree.slice(1));
          let monomial2 = findMonomialFromFactors(expr2.tree.slice(1));
          if (!monomial1.equals(monomial2)) {
            // also OK if monomials are opposites
            let monomial2Opposite = me.fromAst(['-', monomial2.tree]);
            if (!monomial1.equals(monomial2Opposite)) {
              return { setValue: { value: false } }
            }
          }
        }

        let nonConstantFactors1 = expr1.tree.slice(1).filter(x => me.fromAst(x).variables().length > 0);
        let nonConstantFactors2 = expr2.tree.slice(1).filter(x => me.fromAst(x).variables().length > 0);


        if (nonConstantFactors1.length !== nonConstantFactors2.length) {
          return { setValue: { value: false } }
        }

        let numQuadraticFactors1 = 0, numLinearFactors1 = 0;
        let numQuadraticFactors2 = 0, numLinearFactors2 = 0;

        let v = dependencyValues.variable.subscripts_to_strings().tree;


        for (let factor of nonConstantFactors1) {
          let deriv2 = me.fromAst(factor).subscripts_to_strings().derivative(v).derivative(v).simplify();
          if (deriv2.tree === 0) {
            numLinearFactors1++;
          } else if (deriv2.variables().length === 0) {
            numQuadraticFactors1++;
          } else {
            return { setValue: { value: false } }
          }
        }

        for (let factor of nonConstantFactors2) {
          let deriv2 = me.fromAst(factor).subscripts_to_strings().derivative(v).derivative(v).simplify();
          if (deriv2.tree === 0) {
            numLinearFactors2++;
          } else if (deriv2.variables().length === 0) {
            numQuadraticFactors2++;
          } else {
            return { setValue: { value: false } }
          }
        }

        let value = numLinearFactors1 === numLinearFactors2 && numQuadraticFactors1 === numQuadraticFactors2;

        return {
          setValue: {
            value
          }
        }
      }
    }

    return stateVariableDefinitions;

  }


}


function expandPositiveIntegerPowers(tree) {
  if (!Array.isArray(tree)) {
    return tree;
  }

  if (tree[0] === "^") {
    let base = tree[1];
    let exponent = tree[2];
    if (Number.isInteger(exponent) && exponent > 0) {
      tree = ["*", ...Array(exponent).fill(base)]
    }
  }

  if (tree[0] === "*") {
    let oldTree = tree;
    tree = ["*"];
    for (let factor of oldTree.slice(1)) {
      if (Array.isArray(factor) && factor[0] === "^") {
        let base = factor[1];
        let exponent = factor[2];
        if (Number.isInteger(exponent) && exponent > 0) {
          tree.push(...Array(exponent).fill(base))
        } else {
          tree.push(factor);
        }
      } else {
        tree.push(factor);
      }
    }

  }

  return tree;

}

function findMonomialFromFactors(factors) {

  let monomialFactors = [];

  let inMonomial = false;

  for (let factor of factors) {
    if (typeof factor === "string" || me.fromAst(factor).variables().length === 0) {
      if(!inMonomial) {
        if(monomialFactors.length > 0) {
          // found a second monomial
          return me.fromAst('\uff3f')
        } else {
          inMonomial = true;
        }
      }
      monomialFactors.push(factor);
    } else {
      inMonomial = false;
    }
  }

  let monomialTree;

  if (monomialFactors.length === 0) {
    monomialTree = 1;
  } else if (monomialFactors.length === 1) {
    monomialTree = monomialFactors[0];
  } else {
    monomialTree = ['*', ...monomialFactors];
  }

  return me.fromAst(monomialTree);

}