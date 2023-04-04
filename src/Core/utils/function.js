import me from 'math-expressions';
import { convertValueToMathExpression, normalizeMathExpression, vectorOperators } from './math';


export function createFunctionFromDefinition(fDefinition) {

  if (fDefinition.functionType === "formula") {
    return returnNumericalFunctionFromFormula({
      formula: me.fromAst(fDefinition.formula),
      nInputs: fDefinition.nInputs,
      variables: fDefinition.variables.map(x => me.fromAst(x)),
      domain: fDefinition.domain ? fDefinition.domain.map(x => me.fromAst(x)) : null,
      component: fDefinition.component,
    })
  } else if (fDefinition.functionType === "reevaluatedFormula") {
    let evaluateChildrenToReevaluate = {};
    for (let code in fDefinition.evaluateChildrenToReevaluate) {
      evaluateChildrenToReevaluate[code] = {
        fReevaluate: createFunctionFromDefinition(fDefinition.evaluateChildrenToReevaluate[code].fReevaluateDefinition),
        inputMathFs: fDefinition.evaluateChildrenToReevaluate[code].inputMaths.map(x => me.fromAst(x).subscripts_to_strings().f())
      }
    }

    return returnNumericalFunctionFromReevaluatedFormula({
      formulaExpressionWithCodes: me.fromAst(fDefinition.formulaExpressionWithCodes),
      evaluateChildrenToReevaluate,
      nInputs: fDefinition.nInputs,
      variables: fDefinition.variables.map(x => me.fromAst(x)),
      domain: fDefinition.domain ? fDefinition.domain.map(x => me.fromAst(x)) : null,
      component: fDefinition.component,
    })
  } else if (fDefinition.functionType === "numericForEvaluate") {

    return returnNumericFunctionForEvaluate({
      nInputs: fDefinition.nInputs,
      numericalfs: fDefinition.fDefinitions.map(fdef => createFunctionFromDefinition(fdef))
    })
  } else if (fDefinition.functionType === "bezier") {
    return returnBezierFunctions({
      nThroughPoints: fDefinition.nThroughPoints,
      numericalThroughPoints: fDefinition.numericalThroughPoints,
      splineCoeffs: fDefinition.splineCoeffs,
      extrapolateForward: fDefinition.extrapolateForward,
      extrapolateForwardCoeffs: fDefinition.extrapolateForwardCoeffs,
      extrapolateBackward: fDefinition.extrapolateBackward,
      extrapolateBackwardCoeffs: fDefinition.extrapolateBackwardCoeffs,
      component: fDefinition.component,
    })
  } else if (fDefinition.functionType === "interpolated") {
    return returnInterpolatedFunction({
      xs: fDefinition.xs,
      coeffs: fDefinition.coeffs,
      interpolationPoints: fDefinition.interpolationPoints,
      domain: fDefinition.domain ? fDefinition.domain.map(x => me.fromAst(x)) : null,
    });
  } else if (fDefinition.functionType === "functionOperator") {
    return returnFunctionOperatorFunction({
      componentType: fDefinition.componentType,
      functionOperatorArguments: fDefinition.functionOperatorArguments,
      operatorComposesWithOriginal: fDefinition.operatorComposesWithOriginal,
      originalFDefinition: fDefinition.originalFDefinition,
      nOutputs: fDefinition.nOutputs,
      component: fDefinition.component,
    })
  } else if (fDefinition.functionType === "ODESolution") {
    return returnODESolutionFunction({
      nDimensions: fDefinition.nDimensions,
      t0: fDefinition.t0,
      x0s: fDefinition.x0s,
      chunkSize: fDefinition.chunkSize,
      tolerance: fDefinition.tolerance,
      numericalRHSfDefinitions: fDefinition.numericalRHSfDefinitions,
      maxIterations: fDefinition.maxIterations,
      component: fDefinition.component,
    })
  } else if (fDefinition.functionType === "piecewise") {
    return returnPiecewiseNumericalFunctionFromChildren({
      numericalFsOfChildren: fDefinition.fDefinitionsOfChildren.map(fDef => createFunctionFromDefinition(fDef)),
      numericalDomainsOfChildren: fDefinition.numericalDomainsOfChildren,
      domain: fDefinition.domain ? fDefinition.domain.map(x => me.fromAst(x)) : null,
      component: fDefinition.component
    })
  } else {
    // otherwise, return the NaN function
    return () => NaN;
  }
}

export function returnNumericalFunctionFromFormula({ formula, nInputs, variables, domain, component = 0 }) {

  component = Number(component);

  let formulaIsVectorValued = Array.isArray(formula.tree) &&
    vectorOperators.includes(formula.tree[0]);

  if (formulaIsVectorValued) {
    try {
      formula = formula.get_component(component);
    } catch (e) {
      return () => NaN;
    }
  } else if (component !== 0) {
    return () => NaN;
  }

  let formula_f;
  try {
    formula_f = formula.subscripts_to_strings().f();
  } catch (e) {
    return () => NaN;
  }

  if (nInputs === 1) {
    let varString = variables[0].subscripts_to_strings().tree;

    let minx = -Infinity, maxx = Infinity;
    let openMin = false, openMax = false;
    if (domain !== null) {
      let domain0 = domain[0];
      if (domain0 !== undefined) {
        minx = me.fromAst(domain0.tree[1][1]).evaluate_to_constant();
        if (typeof minx !== "number" || Number.isNaN(minx)) {
          minx = -Infinity;
        } else {
          openMin = !domain0.tree[2][1];
        }
        maxx = me.fromAst(domain0.tree[1][2]).evaluate_to_constant();
        if (typeof maxx !== "number" || Number.isNaN(maxx)) {
          maxx = Infinity;
        } else {
          openMax = !domain0.tree[2][2];
        }
      }
    }

    return function (x, overrideDomain = false) {
      if (overrideDomain) {
        if (isNaN(x)) {
          return NaN;
        }
      } else if (!(x >= minx) || !(x <= maxx) || (openMin && x === minx) || (openMax && x === maxx)) {
        return NaN;
      }
      try {
        return formula_f({ [varString]: x });
      } catch (e) {
        return NaN;
      }
    }

  }


  let varStrings = [];
  for (let i = 0; i < nInputs; i++) {
    varStrings.push(variables[i].subscripts_to_strings().tree)
  }

  let haveDomain = false;
  let domainIntervals = [];
  let domainOpens = [];


  if (domain !== null) {
    haveDomain = true;

    for (let i = 0; i < nInputs; i++) {

      let thisDomain = domain[i];
      if (!thisDomain) {
        haveDomain = false;
        break;
      }

      let minx = -Infinity, maxx = Infinity;
      let openMin = false, openMax = false;

      minx = me.fromAst(thisDomain.tree[1][1]).evaluate_to_constant();
      if (typeof minx !== "number" || Number.isNaN(minx)) {
        minx = -Infinity;
      } else {
        openMin = !thisDomain.tree[2][1];
      }
      maxx = me.fromAst(thisDomain.tree[1][2]).evaluate_to_constant();
      if (typeof maxx !== "number" || Number.isNaN(maxx)) {
        maxx = Infinity;
      } else {
        openMax = !thisDomain.tree[2][2];
      }

      domainIntervals.push([minx, maxx])
      domainOpens.push([openMin, openMax])

    }
  }


  return function (...xs) {
    let fArgs = {}
    for (let i = 0; i < nInputs; i++) {
      let x = xs[i];
      if (isNaN(x)) {
        return NaN;
      } else if (haveDomain) {
        let [minx, maxx] = domainIntervals[i];
        let [openMin, openMax] = domainOpens[i];
        if (!(x >= minx) || !(x <= maxx) || (openMin && x === minx) || (openMax && x === maxx)) {
          return NaN;
        }
      }
      fArgs[varStrings[i]] = x;
    }

    try {
      return formula_f(fArgs);
    } catch (e) {
      return NaN;
    }
  }

}


export function returnNumericalFunctionFromReevaluatedFormula({
  formulaExpressionWithCodes,
  evaluateChildrenToReevaluate,
  nInputs, variables, domain,
  component = 0,
}) {

  component = Number(component);

  let formulaIsVectorValued = Array.isArray(formulaExpressionWithCodes.tree) &&
    vectorOperators.includes(formulaExpressionWithCodes.tree[0]);

  if (formulaIsVectorValued) {
    try {
      formulaExpressionWithCodes = formulaExpressionWithCodes.get_component(Number(component));
    } catch (e) {
      return () => NaN;
    }
  } else if (component !== 0) {
    return () => NaN;
  }

  let formula_f;
  try {
    formula_f = formulaExpressionWithCodes.subscripts_to_strings().f();
  } catch (e) {
    return () => NaN;
  }

  if (nInputs === 1) {
    let varString = variables[0].subscripts_to_strings().tree;

    let minx = -Infinity, maxx = Infinity;
    let openMin = false, openMax = false;
    if (domain !== null) {
      let domain0 = domain[0];
      if (domain0 !== undefined) {
        minx = me.fromAst(domain0.tree[1][1]).evaluate_to_constant();
        if (typeof minx !== "number" || Number.isNaN(minx)) {
          minx = -Infinity;
        } else {
          openMin = !domain0.tree[2][1];
        }
        maxx = me.fromAst(domain0.tree[1][2]).evaluate_to_constant();
        if (typeof maxx !== "number" || Number.isNaN(maxx)) {
          maxx = Infinity;
        } else {
          openMax = !domain0.tree[2][2];
        }
      }
    }

    return function (x, overrideDomain = false) {
      if (overrideDomain) {
        if (isNaN(x)) {
          return NaN;
        }
      } else if (!(x >= minx) || !(x <= maxx) || (openMin && x === minx) || (openMax && x === maxx)) {
        return NaN;
      }

      let argsForInputs = { [varString]: x }
      let fArgs = { [varString]: x }

      for (let code in evaluateChildrenToReevaluate) {
        let childF = evaluateChildrenToReevaluate[code].fReevaluate;
        let inputFs = evaluateChildrenToReevaluate[code].inputMathFs;
        try {
          let input = inputFs.map(f => me.fromAst(f(argsForInputs)));
          fArgs[code] = childF(input).evaluate_to_constant();
        } catch (e) {
          return NaN;
        }
      }

      try {
        return formula_f(fArgs);
      } catch (e) {
        return NaN;
      }
    }

  }


  let varStrings = [];
  for (let i = 0; i < nInputs; i++) {
    varStrings.push(variables[i].subscripts_to_strings().tree)
  }

  let haveDomain = false;
  let domainIntervals = [];
  let domainOpens = [];


  if (domain !== null) {
    haveDomain = true;

    for (let i = 0; i < nInputs; i++) {

      let thisDomain = domain[i];
      if (!thisDomain) {
        haveDomain = false;
        break;
      }

      let minx = -Infinity, maxx = Infinity;
      let openMin = false, openMax = false;

      minx = me.fromAst(thisDomain.tree[1][1]).evaluate_to_constant();
      if (typeof minx !== "number" || Number.isNaN(minx)) {
        minx = -Infinity;
      } else {
        openMin = !thisDomain.tree[2][1];
      }
      maxx = me.fromAst(thisDomain.tree[1][2]).evaluate_to_constant();
      if (typeof maxx !== "number" || Number.isNaN(maxx)) {
        maxx = Infinity;
      } else {
        openMax = !thisDomain.tree[2][2];
      }

      domainIntervals.push([minx, maxx])
      domainOpens.push([openMin, openMax])

    }
  }


  return function (...xs) {
    let fArgs = {}
    for (let i = 0; i < nInputs; i++) {
      let x = xs[i];
      if (isNaN(x)) {
        return NaN;
      } else if (haveDomain) {
        let [minx, maxx] = domainIntervals[i];
        let [openMin, openMax] = domainOpens[i];
        if (!(x >= minx) || !(x <= maxx) || (openMin && x === minx) || (openMax && x === maxx)) {
          return NaN;
        }
      }
      fArgs[varStrings[i]] = x;
    }

    let argsForInputs = { ...fArgs };
    for (let code in evaluateChildrenToReevaluate) {
      let childF = evaluateChildrenToReevaluate[code].fReevaluate;
      let inputFs = evaluateChildrenToReevaluate[code].inputMathFs;
      try {
        let input = inputFs.map(f => me.fromAst(f(argsForInputs)));
        fArgs[code] = childF(input).evaluate_to_constant();
      } catch (e) {
        return NaN;
      }
    }

    try {
      return formula_f(fArgs);
    } catch (e) {
      return NaN;
    }
  }

}

export function returnPiecewiseNumericalFunctionFromChildren({
  numericalFsOfChildren, numericalDomainsOfChildren, domain, component = 0
}) {

  component = Number(component);

  if (component !== 0) {
    return () => NaN;
  }

  let minx = -Infinity, maxx = Infinity;
  let openMin = false, openMax = false;
  if (domain !== null) {
    let domain0 = domain[0];
    if (domain0 !== undefined) {
      minx = me.fromAst(domain0.tree[1][1]).evaluate_to_constant();
      if (typeof minx !== "number" || Number.isNaN(minx)) {
        minx = -Infinity;
      } else {
        openMin = !domain0.tree[2][1];
      }
      maxx = me.fromAst(domain0.tree[1][2]).evaluate_to_constant();
      if (typeof maxx !== "number" || Number.isNaN(maxx)) {
        maxx = Infinity;
      } else {
        openMax = !domain0.tree[2][2];
      }
    }
  }


  return function (x, overrideDomain = false) {

    if (overrideDomain) {
      if (isNaN(x)) {
        return NaN;
      }
    } else if (!(x >= minx) || !(x <= maxx) || (openMin && x === minx) || (openMax && x === maxx)) {
      return NaN;
    }

    for (let [ind, childDomain] of numericalDomainsOfChildren.entries()) {
      let childMinX = childDomain[0][0];
      let childMaxX = childDomain[0][1];
      let childMinXClosed = childDomain[1][0];
      let childMaxXClosed = childDomain[1][1];
      if ((x > childMinX || (childMinXClosed && x === childMinX))
        && (x < childMaxX || (childMaxXClosed && x === childMaxX))
      ) {
        return numericalFsOfChildren[ind](x);
      }
    }

    return NaN;

  }
}

export function returnSymbolicFunctionFromFormula({ formula, simplify, expand, domain,
  nInputs, variables, component = 0
}) {

  component = Number(component);

  let formulaIsVectorValued = Array.isArray(formula.tree) &&
    vectorOperators.includes(formula.tree[0]);

  if (formulaIsVectorValued) {
    try {
      formula = formula.get_component(component);
    } catch (e) {
      return () => me.fromAst('\uff3f')
    }
  } else if (component !== 0) {
    return () => me.fromAst('\uff3f')
  }

  let formula_transformed = formula.subscripts_to_strings();

  if (nInputs === 1) {
    let varString = variables[0].subscripts_to_strings().tree;

    let minx = -Infinity, maxx = Infinity;
    let openMin = false, openMax = false;
    if (domain !== null) {
      let domain0 = domain[0];
      if (domain0 !== undefined) {
        minx = me.fromAst(domain0.tree[1][1]).evaluate_to_constant();
        if (typeof minx !== "number" || Number.isNaN(minx)) {
          minx = -Infinity;
        } else {
          openMin = !domain0.tree[2][1];
        }
        maxx = me.fromAst(domain0.tree[1][2]).evaluate_to_constant();
        if (typeof maxx !== "number" || Number.isNaN(maxx)) {
          maxx = Infinity;
        } else {
          openMax = !domain0.tree[2][2];
        }
      }
    }

    return function (x, overrideDomain = false) {
      if (!overrideDomain) {
        let xNum = x.evaluate_to_constant();

        if (!Number.isNaN(xNum)
          && (!(xNum >= minx) || !(xNum <= maxx) || (openMin && xNum === minx) || (openMax && xNum === maxx))
        ) {
          return me.fromAst('\uff3f')
        }
      }

      return normalizeMathExpression({
        value: formula_transformed.substitute({ [varString]: x }).strings_to_subscripts(),
        simplify,
        expand
      })

    }
  }

  let varStrings = [];
  for (let i = 0; i < nInputs; i++) {
    varStrings.push(variables[i].subscripts_to_strings().tree)
  }


  let haveDomain = false;
  let domainIntervals = [];
  let domainOpens = [];


  if (domain !== null) {
    haveDomain = true;

    for (let i = 0; i < nInputs; i++) {

      let thisDomain = domain[i];
      if (!thisDomain) {
        haveDomain = false;
        break;
      }

      let minx = -Infinity, maxx = Infinity;
      let openMin = false, openMax = false;

      minx = me.fromAst(thisDomain.tree[1][1]).evaluate_to_constant();
      if (typeof minx !== "number" || Number.isNaN(minx)) {
        minx = -Infinity;
      } else {
        openMin = !thisDomain.tree[2][1];
      }
      maxx = me.fromAst(thisDomain.tree[1][2]).evaluate_to_constant();
      if (typeof maxx !== "number" || Number.isNaN(maxx)) {
        maxx = Infinity;
      } else {
        openMax = !thisDomain.tree[2][2];
      }

      domainIntervals.push([minx, maxx])
      domainOpens.push([openMin, openMax])

    }
  }


  return function (...xs) {
    let subArgs = {}
    let foundOutsideDomain = false;
    let allNumeric = true;

    for (let i = 0; i < nInputs; i++) {
      let x = xs[i];

      if (haveDomain && allNumeric) {
        let xNum = x.evaluate_to_constant();
        if (Number.isNaN(xNum)) {
          allNumeric = false;
        } else {

          let [minx, maxx] = domainIntervals[i];
          let [openMin, openMax] = domainOpens[i];

          if (!(xNum >= minx) || !(xNum <= maxx) || (openMin && xNum === minx) || (openMax && xNum === maxx)) {
            foundOutsideDomain = true;
          }

        }
      }
      subArgs[varStrings[i]] = x;
    }

    if (allNumeric && foundOutsideDomain) {
      return me.fromAst('\uff3f')
    }

    return normalizeMathExpression({
      value: formula_transformed.substitute(subArgs).strings_to_subscripts(),
      simplify,
      expand
    })
  }
}

export function returnSymbolicFunctionFromReevaluatedFormula({
  formulaExpressionWithCodes,
  evaluateChildrenToReevaluate,
  simplify, expand, nInputs, variables, domain,
  component = 0
}) {

  component = Number(component);

  let formulaIsVectorValued = Array.isArray(formulaExpressionWithCodes.tree) &&
    vectorOperators.includes(formulaExpressionWithCodes.tree[0]);

  if (formulaIsVectorValued) {
    try {
      formulaExpressionWithCodes = formulaExpressionWithCodes.get_component(component);
    } catch (e) {
      return () => me.fromAst('\uff3f')
    }
  } else if (component !== 0) {
    return () => me.fromAst('\uff3f')
  }

  let formula_transformed = formulaExpressionWithCodes.subscripts_to_strings();

  if (nInputs === 1) {
    let varString = variables[0].subscripts_to_strings().tree;

    let minx = -Infinity, maxx = Infinity;
    let openMin = false, openMax = false;
    if (domain !== null) {
      let domain0 = domain[0];
      if (domain0 !== undefined) {
        minx = me.fromAst(domain0.tree[1][1]).evaluate_to_constant();
        if (typeof minx !== "number" || Number.isNaN(minx)) {
          minx = -Infinity;
        } else {
          openMin = !domain0.tree[2][1];
        }
        maxx = me.fromAst(domain0.tree[1][2]).evaluate_to_constant();
        if (typeof maxx !== "number" || Number.isNaN(maxx)) {
          maxx = Infinity;
        } else {
          openMax = !domain0.tree[2][2];
        }
      }
    }

    return function (x, overrideDomain = false) {
      if (!overrideDomain) {
        let xNum = x.evaluate_to_constant();

        if (!Number.isNaN(xNum)
          && (!(xNum >= minx) || !(xNum <= maxx) || (openMin && xNum === minx) || (openMax && xNum === maxx))
        ) {
          return me.fromAst('\uff3f')
        }
      }

      let argsForInputs = { [varString]: x.tree }
      let fArgs = { [varString]: x }

      for (let code in evaluateChildrenToReevaluate) {
        let childF = evaluateChildrenToReevaluate[code].fReevaluate;
        let inputFs = evaluateChildrenToReevaluate[code].inputMathFs;
        try {
          let input = inputFs.map(f => me.fromAst(f(argsForInputs)));
          fArgs[code] = childF(input);
        } catch (e) {
          return NaN;
        }
      }

      return normalizeMathExpression({
        value: formula_transformed.substitute(fArgs).strings_to_subscripts(),
        simplify,
        expand
      })
    }
  }

  let varStrings = [];
  for (let i = 0; i < nInputs; i++) {
    varStrings.push(variables[i].subscripts_to_strings().tree)
  }


  let haveDomain = false;
  let domainIntervals = [];
  let domainOpens = [];


  if (domain !== null) {
    haveDomain = true;

    for (let i = 0; i < nInputs; i++) {

      let thisDomain = domain[i];
      if (!thisDomain) {
        haveDomain = false;
        break;
      }

      let minx = -Infinity, maxx = Infinity;
      let openMin = false, openMax = false;

      minx = me.fromAst(thisDomain.tree[1][1]).evaluate_to_constant();
      if (typeof minx !== "number" || Number.isNaN(minx)) {
        minx = -Infinity;
      } else {
        openMin = !thisDomain.tree[2][1];
      }
      maxx = me.fromAst(thisDomain.tree[1][2]).evaluate_to_constant();
      if (typeof maxx !== "number" || Number.isNaN(maxx)) {
        maxx = Infinity;
      } else {
        openMax = !thisDomain.tree[2][2];
      }

      domainIntervals.push([minx, maxx])
      domainOpens.push([openMin, openMax])

    }
  }


  return function (...xs) {
    let subArgs = {};
    let argsForInputs = {};
    let foundOutsideDomain = false;
    let allNumeric = true;

    for (let i = 0; i < nInputs; i++) {
      let x = xs[i];

      if (haveDomain && allNumeric) {
        let xNum = x.evaluate_to_constant();
        if (Number.isNaN(xNum)) {
          allNumeric = false;
        } else {

          let [minx, maxx] = domainIntervals[i];
          let [openMin, openMax] = domainOpens[i];

          if (!(xNum >= minx) || !(xNum <= maxx) || (openMin && xNum === minx) || (openMax && xNum === maxx)) {
            foundOutsideDomain = true;
          }

        }
      }
      subArgs[varStrings[i]] = x;
      argsForInputs[varStrings[i]] = x.tree;
    }

    if (allNumeric && foundOutsideDomain) {
      return me.fromAst('\uff3f')
    }


    for (let code in evaluateChildrenToReevaluate) {
      let childF = evaluateChildrenToReevaluate[code].fReevaluate;
      let inputFs = evaluateChildrenToReevaluate[code].inputMathFs;
      try {
        let input = inputFs.map(f => me.fromAst(f(argsForInputs)));
        subArgs[code] = childF(input);
      } catch (e) {
        return NaN;
      }
    }

    return normalizeMathExpression({
      value: formula_transformed.substitute(subArgs).strings_to_subscripts(),
      simplify,
      expand
    })
  }
}

export function returnSymbolicFunctionForEvaluate({
  symbolicfs, nInputs,
}) {


  return function (input) {

    // if have a single input, check if it is a vector
    if (input.length === 1) {
      let inputTree = input[0].tree;
      if (Array.isArray(inputTree) && vectorOperators.includes(inputTree[0])) {
        input = inputTree.slice(1).map(x => me.fromAst(x));
      }
    }


    if (input.length !== nInputs) {
      return me.fromAst('\uFF3F');
    }

    let components = symbolicfs.map(f => f(...input).tree);

    let value;
    if (components.length === 1) {
      value = me.fromAst(components[0])
    } else {
      value = me.fromAst(["vector", ...components])
    }

    return value;

  }
}

export function returnNumericFunctionForEvaluate({
  numericalfs, nInputs,
}) {


  return function (input) {

    // if have a single input, check if it is a vector
    if (input.length === 1) {
      let inputTree = input[0].tree;
      if (Array.isArray(inputTree) && vectorOperators.includes(inputTree[0])) {
        input = inputTree.slice(1).map(x => me.fromAst(x));
      }
    }

    if (input.length !== nInputs) {
      return me.fromAst('\uFF3F');
    }

    let numericInput = input.map(x => x.evaluate_to_constant());

    let components = numericalfs.map(f => f(...numericInput));

    let value;
    if (components.length === 1) {
      value = me.fromAst(components[0])
    } else {
      value = me.fromAst(["vector", ...components])
    }

    return value;

  }
}

export function returnBezierFunctions({ nThroughPoints, numericalThroughPoints,
  splineCoeffs,
  extrapolateForward, extrapolateForwardCoeffs,
  extrapolateBackward, extrapolateBackwardCoeffs,
  component,
}) {

  if (nThroughPoints < 1) {
    return () => NaN;
  }

  let len = nThroughPoints - 1;

  // let firstPointX = numericalThroughPoints[0][component];
  let lastPointX = numericalThroughPoints[len][component];

  let cs = splineCoeffs.map(x => x[component])
  let cB;
  if (extrapolateBackward) {
    cB = extrapolateBackwardCoeffs[component];
  }
  let cF;
  if (extrapolateForward) {
    cF = extrapolateForwardCoeffs[component];
  }

  return function (t) {
    if (isNaN(t)) {
      return NaN;
    }

    if (t < 0) {
      if (extrapolateBackward) {
        return (cB[2] * t + cB[1]) * t + cB[0];
      } else {
        return NaN;
      }
    }

    if (t >= len) {
      if (extrapolateForward) {
        t -= len;
        return (cF[2] * t + cF[1]) * t + cF[0];
      } else if (t === len) {
        return lastPointX;
      } else {
        return NaN;
      }
    }

    let z = Math.floor(t);
    t -= z;
    let c = cs[z];
    return (((c[3] * t + c[2]) * t + c[1]) * t + c[0]);
  }


}


export function returnInterpolatedFunction({ xs, coeffs, interpolationPoints, domain }) {

  let interpolationPointYs = [];
  if (interpolationPoints) {
    interpolationPointYs = interpolationPoints.map(x => x.y);
  }

  if (xs === null) {
    return () => NaN;
  }


  let minx = -Infinity, maxx = Infinity;
  let openMin = false, openMax = false;
  if (domain !== null) {
    let domain0 = domain[0];
    if (domain0 !== undefined) {
      minx = me.fromAst(domain0.tree[1][1]).evaluate_to_constant();
      if (typeof minx !== "number" || Number.isNaN(minx)) {
        minx = -Infinity;
      } else {
        openMin = !domain0.tree[2][1];
      }
      maxx = me.fromAst(domain0.tree[1][2]).evaluate_to_constant();
      if (typeof maxx !== "number" || Number.isNaN(maxx)) {
        maxx = Infinity;
      } else {
        openMax = !domain0.tree[2][2];
      }
    }
  }

  let x0 = xs[0], xL = xs[xs.length - 1];

  return function (x, overrideDomain = false) {

    if (overrideDomain) {
      if (isNaN(x)) {
        return NaN;
      }
    } else if (!(x >= minx) || !(x <= maxx) || (openMin && x === minx) || (openMax && x === maxx)) {
      return NaN;
    }

    if (x <= x0) {
      // Extrapolate
      x -= x0;
      let c = coeffs[0];
      return (((c[3] * x + c[2]) * x + c[1]) * x + c[0]);
    }

    if (x >= xL) {
      let i = xs.length - 2;
      // Extrapolate
      x -= xs[i];
      let c = coeffs[i];
      return (((c[3] * x + c[2]) * x + c[1]) * x + c[0]);
    }

    // Search for the interval x is in,
    // returning the corresponding y if x is one of the original xs
    var low = 0, mid, high = xs.length - 1;
    while (low <= high) {
      mid = Math.floor(0.5 * (low + high));
      let xHere = xs[mid];
      if (xHere < x) { low = mid + 1; }
      else if (xHere > x) { high = mid - 1; }
      else { return interpolationPointYs[mid]; }
    }
    let i = Math.max(0, high);

    // Interpolate
    x -= xs[i];
    let c = coeffs[i];
    return (((c[3] * x + c[2]) * x + c[1]) * x + c[0]);

  }

}

export function returnReturnDerivativesOfInterpolatedFunction({ xs, coeffs, variables }) {

  if (!xs) {
    return () => NaN
  }

  let variable1Trans = variables[0].subscripts_to_strings().tree;

  let x0 = xs[0], xL = xs[xs.length - 1];

  return function (derivVariables) {

    let derivVariablesTrans = derivVariables.map(x => x.subscripts_to_strings().tree);

    let order = derivVariablesTrans.length;

    if (order > 3 || !derivVariablesTrans.every(x => x === variable1Trans)
      || derivVariablesTrans.includes('\uff3f')
    ) {
      return () => 0
    }

    if (order === 0 || xs === null) {
      return () => NaN
    }

    return function (x) {

      if (isNaN(x)) {
        return NaN;
      }


      if (x <= x0) {
        // Extrapolate
        x -= x0;
        let c = coeffs[0];
        if (order === 1) {
          return (3 * c[3] * x + 2 * c[2]) * x + c[1];
        } else if (order === 2) {
          return 6 * c[3] * x + 2 * c[2];
        } else {
          return 6 * c[3]
        }
      }

      if (x >= xL) {
        let i = xs.length - 2;
        // Extrapolate
        x -= xs[i];
        let c = coeffs[i];
        if (order === 1) {
          return (3 * c[3] * x + 2 * c[2]) * x + c[1];
        } else if (order === 2) {
          return 6 * c[3] * x + 2 * c[2];
        } else {
          return 6 * c[3]
        }
      }

      // Search for the interval x is in,
      // returning the corresponding y if x is one of the original xs
      var low = 0, mid, high = xs.length - 1;
      while (low <= high) {
        mid = Math.floor(0.5 * (low + high));
        let xHere = xs[mid];
        if (xHere < x) { low = mid + 1; }
        else if (xHere > x) { high = mid - 1; }
        else {
          // at a grid point
          if (order === 1) {
            return coeffs[mid][1]
          } else if (order === 2) {
            return 2 * coeffs[mid][2];
          } else {
            return 6 * coeffs[mid][3];
          }
        }
      }
      let i = Math.max(0, high);

      // Interpolate
      x -= xs[i];
      let c = coeffs[i];
      if (order === 1) {
        return (3 * c[3] * x + 2 * c[2]) * x + c[1];
      } else if (order === 2) {
        return 6 * c[3] * x + 2 * c[2];
      } else {
        return 6 * c[3]
      }
    }
  }
}

function returnFunctionOperatorFunction({ componentType, functionOperatorArguments,
  operatorComposesWithOriginal,
  originalFDefinition, nOutputs, component
}) {

  // TODO: correctly handle nOutputs > 1

  if (operatorComposesWithOriginal) {

    let childFs = [];
    for (let ind = 0; ind < nOutputs; ind++) {
      childFs.push(createFunctionFromDefinition(originalFDefinition, ind));
    }

    let functionOperator = functionOperatorDefinitions[componentType](...functionOperatorArguments);

    return (...xs) => functionOperator(
      ...childFs.map(cf => cf(...xs))
    )

  } else {

    return functionOperatorDefinitions[componentType](...functionOperatorArguments);


  }
}

export var functionOperatorDefinitions = {
  clampFunction: function (lowerValue, upperValue) {
    return function (x) {
      // if don't have a number, return NaN
      if (!Number.isFinite(x)) {
        return NaN;
      }
      return Math.max(lowerValue,
        Math.min(upperValue, x)
      );
    }
  },

  wrapFunctionPeriodic: function (lowerValue, upperValue) {

    return function (x) {
      // if don't have a number, return NaN
      if (!Number.isFinite(x)) {
        return NaN;
      }

      let lower = lowerValue
      let upper = upperValue;

      // if bounds are the same, clamp to that value
      if (lower === upper) {
        return lower;
      }

      // just in case lower is larger than upper, swap values
      if (lower > upper) {
        [upper, lower] = [lower, upper];
      }

      return (lower + me.math.mod(
        x - lower,
        upper - lower
      )
      )
    }
  },

  derivative: function (derivDefinition, derivVariables) {

    if (derivDefinition.derivativeType === "interpolatedFunction") {
      let derivGenerator = returnReturnDerivativesOfInterpolatedFunction({
        xs: derivDefinition.xs,
        coeffs: derivDefinition.coeffs,
        variables: derivDefinition.variables.map(convertValueToMathExpression)
      });

      let vars = derivVariables.map(convertValueToMathExpression)
      if (derivDefinition.additionalDerivVariables) {
        let additionalVars = derivDefinition.additionalDerivVariables.map(convertValueToMathExpression);
        vars = [...additionalVars, ...vars];
      }
      if (derivDefinition.variableMappings) {

        for (let variableMapping of derivDefinition.variableMappings) {
          let mappedDerivVariables = [];

          for (let dVar of vars) {
            let mapped = variableMapping[dVar.subscripts_to_strings().tree];
            if (mapped) {
              mappedDerivVariables.push(convertValueToMathExpression(mapped))
            } else {
              // have a mapping, but 
              mappedDerivVariables.push(me.fromAst('\uff3f'))
            }
          }

          vars = mappedDerivVariables;

        }
      }
      let deriv = derivGenerator(vars);

      return deriv;

    } else {
      return () => NaN;
    }

  }

}

function returnODESolutionFunction({
  nDimensions, t0, x0s, chunkSize, tolerance,
  numericalRHSfDefinitions, maxIterations, component
}) {

  var workspace = {};

  workspace.calculatedNumericSolutions = [];
  workspace.endingNumericalValues = [];
  workspace.maxPossibleTime = undefined;


  let numericalRHSfcomponents = numericalRHSfDefinitions.map(x => createFunctionFromDefinition(x));

  let numericalRHSf = function (t, x) {
    let fargs = [t];
    if (Array.isArray(x)) {
      fargs.push(...x)
    } else {
      fargs.push(x)
    }
    try {
      return numericalRHSfcomponents.map(f => f(...fargs));
    } catch (e) {
      return NaN;
    }
  }

  return function f(t) {
    if (!Number.isFinite(t)) {
      return NaN;
    }
    if (t === t0) {
      return x0s[component];
    }

    let nChunksCalculated = workspace.calculatedNumericSolutions.length;
    let chunk = Math.ceil((t - t0) / chunkSize) - 1;
    if (chunk < 0) {
      // console.log("Haven't yet implemented integrating ODE backward")
      return NaN;
    }
    if (workspace.maxPossibleTime === undefined && chunk >= nChunksCalculated) {
      for (let tind = nChunksCalculated; tind <= chunk; tind++) {
        let x0 = workspace.endingNumericalValues[tind - 1];
        if (x0 === undefined) {
          x0 = x0s;
        }
        let t0shifted = t0 + tind * chunkSize;
        let result = me.math.dopri(
          t0shifted,
          t0shifted + chunkSize,
          x0,
          numericalRHSf,
          tolerance,
          maxIterations,
        )

        workspace.endingNumericalValues.push(result.y[result.y.length - 1]);
        workspace.calculatedNumericSolutions.push(result.at.bind(result));

        let endingTime = result.x[result.x.length - 1];
        if (endingTime < (t0shifted + chunkSize) * (1 - 1e-6)) {
          workspace.maxPossibleTime = endingTime;
          break;
        }
      }
    }

    if (t > workspace.maxPossibleTime) {
      return NaN;
    }

    let value = workspace.calculatedNumericSolutions[chunk](t)[component];

    return value;

  }



}