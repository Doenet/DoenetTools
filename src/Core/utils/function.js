import me from 'math-expressions';


export function createFunctionFromDefinition(fDefinition, component = 0) {

  if (fDefinition.functionType === "formula") {
    return returnNumericalFunctionFromFormula({
      formula: me.fromAst(fDefinition.formula),
      nInputs: fDefinition.nInputs,
      variables: fDefinition.variables.map(x => me.fromAst(x)),
      domain: fDefinition.domain,
      component
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
    })
  } else if (fDefinition.functionType === "interpolated") {
    return returnInterpolatedFunction({
      xs: fDefinition.xs,
      coeffs: fDefinition.coeffs,
      interpolationPoints: fDefinition.interpolationPoints,
      domain: fDefinition.domain
    });
  } else {
    // otherwise, return the zero function
    return () => 0;
  }
}

export function returnNumericalFunctionFromFormula({ formula, nInputs, variables, domain, component = 0 }) {

  component = Number(component);

  let formulaIsVectorValued = Array.isArray(formula.tree) &&
    ["tuple", "vector"].includes(formula.tree[0]);

  if (formulaIsVectorValued) {
    try {
      formula = formula.get_component(Number(component));
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
    if (domain !== null) {
      let domain0 = domain[0];

      if (domain0 !== undefined) {
        try {
          minx = domain0[0].evaluate_to_constant();
          if (!Number.isFinite(minx)) {
            minx = -Infinity;
          }
          maxx = domain0[1].evaluate_to_constant();
          if (!Number.isFinite(maxx)) {
            maxx = Infinity;
          }
        } catch (e) { }
      }
    }

    return function (x) {
      if (x < minx || x > maxx) {
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
  return function (...xs) {
    let fArgs = {}
    for (let i = 0; i < nInputs; i++) {
      fArgs[varStrings[i]] = xs[i];
    }
    try {
      return formula_f(fArgs);
    } catch (e) {
      return NaN;
    }
  }

}

export function returnBezierFunctions({ nThroughPoints, numericalThroughPoints,
  splineCoeffs,
  extrapolateForward, extrapolateForwardCoeffs,
  extrapolateBackward, extrapolateBackwardCoeffs,
}) {

  if (nThroughPoints < 1) {
    let fs = {};
    for (let dim = 0; dim < 2; dim++) {
      fs[dim] = () => NaN;
    }
    return fs;
  }


  let len = nThroughPoints - 1;

  let fs = {};


  for (let dim = 0; dim < 2; dim++) {
    let firstPointX = numericalThroughPoints[0][dim];
    let lastPointX = numericalThroughPoints[len][dim];

    let cs = splineCoeffs.map(x => x[dim])
    let cB;
    if (extrapolateBackward) {
      cB = extrapolateBackwardCoeffs[dim];
    }
    let cF;
    if (extrapolateForward) {
      cF = extrapolateForwardCoeffs[dim];
    }

    fs[dim] = function (t) {
      if (isNaN(t)) {
        return NaN;
      }

      if (t < 0) {
        if (extrapolateBackward) {
          return (cB[2] * t + cB[1]) * t + cB[0];
        } else {
          return firstPointX;
        }
      }

      if (t >= len) {
        if (extrapolateForward) {
          t -= len;
          return (cF[2] * t + cF[1]) * t + cF[0];
        } else {
          return lastPointX;
        }
      }

      let z = Math.floor(t);
      t -= z;
      let c = cs[z];
      return (((c[3] * t + c[2]) * t + c[1]) * t + c[0]);
    }

  }

  return fs;


}


export function returnInterpolatedFunction({ xs, coeffs, interpolationPoints, domain }) {

  let interpolationPointYs = [];
  if (interpolationPoints) {
    interpolationPointYs = interpolationPoints.map(x => x.y);
  }

  if (xs === null) {
    return x => NaN;
  }

  let minx = -Infinity, maxx = Infinity;
  if (domain !== null) {
    domain = domain[0];
    if (domain !== undefined) {
      try {
        minx = domain[0].evaluate_to_constant();
        if (!Number.isFinite(minx)) {
          minx = -Infinity;
        }
        maxx = domain[1].evaluate_to_constant();
        if (!Number.isFinite(maxx)) {
          maxx = Infinity;
        }
      } catch (e) { }
    }
  }

  let x0 = xs[0], xL = xs[xs.length - 1];

  return function (x) {

    if (isNaN(x) || x < minx || x > maxx) {
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
