import me from "math-expressions";
import {
  find_effective_domain,
  find_effective_domains_piecewise_children,
} from "./domain";
import { mathExpressionFromSubsetValue } from "./subset-of-reals";

export function find_local_global_minima({
  domain,
  xscale,
  isInterpolatedFunction,
  xs,
  coeffs,
  numericalf,
  formula,
  variables,
  functionChildrenInfoToCalculateExtrema,
  numInputs,
  numOutputs,
  isPiecewiseFunction,
  numericalDomainsOfChildren,
  numIntervals = 1000,
  numRecursions = 0,
  numerics,
}) {
  if (isInterpolatedFunction) {
    let eps = numerics.eps;

    let minimaList = [];

    if (xs === null) {
      return {
        localMinima: minimaList,
        globalMinimum: null,
        globalInfimum: null,
      };
    }

    let globalMinimum = [-Infinity, Infinity];
    let globalInfimum = [-Infinity, Infinity];

    let minimumAtPreviousRight = false;

    let { minx, maxx, openMin, openMax } = find_effective_domain({
      domain: domain,
    });

    let buffer = 1e-14 * Math.max(Math.abs(minx), Math.abs(maxx));

    // since extrapolate for x < xs[0], formula based on coeffs[0]
    // is valid for x < xs[1]
    let c = coeffs[0];
    let dx = xs[1] - xs[0];

    if (c[3] === 0) {
      // have quadratic.  Minimum only if c[2] > 0
      if (c[2] > 0) {
        let x = -c[1] / (2 * c[2]);
        if (x + xs[0] >= minx - buffer && x + xs[0] <= maxx + buffer) {
          if (x <= dx - eps) {
            let pt = [x + xs[0], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]];
            let atOpenBoundary =
              (openMin && Math.abs(x + xs[0] - minx) < buffer) ||
              (openMax && Math.abs(x + xs[0] - maxx) < buffer);

            if (!atOpenBoundary) {
              minimaList.push(pt);
              if (pt[1] < globalMinimum[1]) {
                globalMinimum = pt;
              }
            }
            if (pt[1] < globalInfimum[1]) {
              globalInfimum = pt;
            }
          } else if (Math.abs(x - dx) < eps) {
            minimumAtPreviousRight = true;
          }
        }
      } else if (c[2] < 0) {
        if (minx === -Infinity) {
          // function extends to -infinity as a parabola opening downward
          globalInfimum = [-Infinity, -Infinity];
        }
      } else {
        // have linear
        if (c[1] === 0) {
          // constant segment
          let xPt = xs[1];
          if (xPt >= minx - buffer) {
            if (c[0] < globalMinimum[1]) {
              let atOpenBoundary = openMin && Math.abs(xPt - minx) < buffer;
              if (!atOpenBoundary) {
                globalMinimum = [xPt, c[0]];
              }
            }
            if (c[0] < globalInfimum[1]) {
              globalInfimum = [xPt, c[0]];
            }
          }
        } else if (c[1] > 0) {
          if (minx === -Infinity) {
            // function extends to -infinity as a line with positive slope
            globalInfimum = [-Infinity, -Infinity];
          }
        }
      }
    } else {
      // since c[3] != 0, have cubic

      let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
      if (discrim > 0) {
        let sqrtdiscrim = Math.sqrt(discrim);

        // critical point where choose +sqrtdiscrim is minimum
        let x = (-2 * c[2] + sqrtdiscrim) / (6 * c[3]);
        if (x + xs[0] >= minx - buffer && x + xs[0] <= maxx + buffer) {
          if (x <= dx - eps) {
            let pt = [x + xs[0], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]];
            let atOpenBoundary =
              (openMin && Math.abs(x + xs[0] - minx) < buffer) ||
              (openMax && Math.abs(x + xs[0] - maxx) < buffer);
            if (!atOpenBoundary) {
              minimaList.push(pt);
              if (!atOpenBoundary && pt[1] < globalMinimum[1]) {
                globalMinimum = pt;
              }
            }
            if (pt[1] < globalInfimum[1]) {
              globalInfimum = pt;
            }
          } else if (Math.abs(x - dx) < eps) {
            minimumAtPreviousRight = true;
          }
        }
      }

      if (c[3] > 0) {
        if (minx === -Infinity) {
          // function extends to -Infinity as a cubic with positive slope
          globalInfimum = [-Infinity, -Infinity];
        }
      }
    }

    for (let i = 1; i < xs.length - 2; i++) {
      c = coeffs[i];
      dx = xs[i + 1] - xs[i];

      if (c[3] === 0) {
        // have quadratic.  Minimum only if c[2] > 0
        if (c[2] > 0) {
          let x = -c[1] / (2 * c[2]);
          if (x + xs[i] >= minx - buffer) {
            if (x + xs[i] <= maxx + buffer) {
              if (Math.abs(x) < eps) {
                let pt = [x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]];
                let atOpenBoundary =
                  (openMin && Math.abs(x + xs[i] - minx) < buffer) ||
                  (openMax && Math.abs(x + xs[i] - maxx) < buffer);

                if (!atOpenBoundary) {
                  if (minimumAtPreviousRight) {
                    minimaList.push(pt);
                  }
                  if (pt[1] < globalMinimum[1]) {
                    globalMinimum = pt;
                  }
                }
                if (pt[1] < globalInfimum[1]) {
                  globalInfimum = pt;
                }
              } else if (x >= eps && x <= dx - eps) {
                let pt = [x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]];
                let atOpenBoundary =
                  (openMin && Math.abs(x + xs[i] - minx) < buffer) ||
                  (openMax && Math.abs(x + xs[i] - maxx) < buffer);

                if (!atOpenBoundary) {
                  minimaList.push(pt);
                  if (pt[1] < globalMinimum[1]) {
                    globalMinimum = pt;
                  }
                }
                if (pt[1] < globalInfimum[1]) {
                  globalInfimum = pt;
                }
              }
              minimumAtPreviousRight = Math.abs(x - dx) < eps;
            } else {
              minimumAtPreviousRight = false;
              continue;
            }
          }
        } else {
          if (c[2] === 0 && c[1] === 0) {
            // constant segment

            if (xs[i + 1] >= minx - buffer && xs[i] <= maxx + buffer) {
              let x1 = Math.max(xs[i], minx);
              if (c[0] < globalInfimum[1]) {
                globalInfimum = [x1, c[0]];
              }

              if (c[0] < globalMinimum[1]) {
                // we must look for a point in the interval
                // that is in the domain but not at an open endpoint
                let atOpenBoundary1 =
                  (openMin && Math.abs(x1 - minx) < buffer) ||
                  (openMax && Math.abs(x1 - maxx) < buffer);

                if (!atOpenBoundary1) {
                  globalMinimum = [x1, c[0]];
                } else {
                  let x2 = Math.min(xs[i + 1], maxx);
                  let atOpenBoundary2 =
                    (openMin && Math.abs(x2 - minx) < buffer) ||
                    (openMax && Math.abs(x2 - maxx) < buffer);
                  if (!atOpenBoundary2) {
                    globalMinimum = [x2, c[0]];
                  } else {
                    let x3 = (x1 + x2) / 2;
                    let atOpenBoundary3 =
                      (openMin && Math.abs(x3 - minx) < buffer) ||
                      (openMax && Math.abs(x3 - maxx) < buffer);
                    if (!atOpenBoundary3) {
                      globalMinimum = [x3, c[0]];
                    }
                  }
                }
              }
            }
          }
          minimumAtPreviousRight = false;
        }
      } else {
        // since c[3] != 0, have cubic

        let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
        if (discrim > 0) {
          let sqrtdiscrim = Math.sqrt(discrim);

          // critical point where choose +sqrtdiscrim is minimum
          let x = (-2 * c[2] + sqrtdiscrim) / (6 * c[3]);
          if (x + xs[i] >= minx - buffer) {
            if (x + xs[i] <= maxx + buffer) {
              if (Math.abs(x) < eps) {
                let pt = [x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]];
                let atOpenBoundary =
                  (openMin && Math.abs(x + xs[i] - minx) < buffer) ||
                  (openMax && Math.abs(x + xs[i] - maxx) < buffer);
                if (!atOpenBoundary) {
                  if (minimumAtPreviousRight) {
                    minimaList.push(pt);
                  }
                  if (pt[1] < globalMinimum[1]) {
                    globalMinimum = pt;
                  }
                }
                if (pt[1] < globalInfimum[1]) {
                  globalInfimum = pt;
                }
              } else if (x >= eps && x <= dx - eps) {
                let pt = [x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]];
                let atOpenBoundary =
                  (openMin && Math.abs(x + xs[i] - minx) < buffer) ||
                  (openMax && Math.abs(x + xs[i] - maxx) < buffer);
                if (!atOpenBoundary) {
                  minimaList.push(pt);
                  if (pt[1] < globalMinimum[1]) {
                    globalMinimum = pt;
                  }
                }
                if (pt[1] < globalInfimum[1]) {
                  globalInfimum = pt;
                }
              }
              minimumAtPreviousRight = Math.abs(x - dx) < eps;
            } else {
              minimumAtPreviousRight = false;
              continue;
            }
          }
        } else {
          minimumAtPreviousRight = false;
        }
      }
    }

    // since extrapolate for x > xs[n-1], formula based on coeffs[n-2]
    // is valid for x > xs[n-2]
    c = coeffs[xs.length - 2];
    if (c[3] === 0) {
      // have quadratic.  Minimum only if c[2] > 0
      if (c[2] > 0) {
        let x = -c[1] / (2 * c[2]);
        if (
          x + xs[xs.length - 2] >= minx - buffer &&
          x + xs[xs.length - 2] <= maxx + buffer
        ) {
          if (Math.abs(x) < eps) {
            let pt = [
              x + xs[xs.length - 2],
              ((c[3] * x + c[2]) * x + c[1]) * x + c[0],
            ];
            let atOpenBoundary =
              (openMin && Math.abs(x + xs[xs.length - 2] - minx) < buffer) ||
              (openMax && Math.abs(x + xs[xs.length - 2] - maxx) < buffer);
            if (!atOpenBoundary) {
              if (minimumAtPreviousRight) {
                minimaList.push(pt);
              }
              if (pt[1] < globalMinimum[1]) {
                globalMinimum = pt;
              }
            }
            if (pt[1] < globalInfimum[1]) {
              globalInfimum = pt;
            }
          } else if (x >= eps) {
            let pt = [
              x + xs[xs.length - 2],
              ((c[3] * x + c[2]) * x + c[1]) * x + c[0],
            ];
            let atOpenBoundary =
              (openMin && Math.abs(x + xs[xs.length - 2] - minx) < buffer) ||
              (openMax && Math.abs(x + xs[xs.length - 2] - maxx) < buffer);
            if (!atOpenBoundary) {
              minimaList.push(pt);
              if (pt[1] < globalMinimum[1]) {
                globalMinimum = pt;
              }
            }
            if (pt[1] < globalInfimum[1]) {
              globalInfimum = pt;
            }
          }
        }
      } else if (c[2] < 0) {
        if (maxx === Infinity) {
          // function extends to infinity as a parabola opening downward
          globalInfimum = [Infinity, -Infinity];
        }
      } else {
        // have linear
        if (c[1] === 0) {
          // constant segment
          let xPt = xs[xs.length - 2];
          if (xPt <= maxx + buffer) {
            if (c[0] < globalMinimum[1]) {
              let atOpenBoundary = openMax && Math.abs(xPt - maxx) < buffer;
              if (!atOpenBoundary) {
                globalMinimum = [xPt, c[0]];
              }
            }
            if (c[0] < globalInfimum[1]) {
              globalInfimum = [xPt, c[0]];
            }
          }
        } else if (c[1] < 0) {
          if (maxx === Infinity) {
            // function extends to infinity as a line with negative slope
            globalInfimum = [Infinity, -Infinity];
          }
        }
      }
    } else {
      // since c[3] != 0, have cubic

      let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
      if (discrim > 0) {
        let sqrtdiscrim = Math.sqrt(discrim);

        // critical point where choose +sqrtdiscrim is minimum
        let x = (-2 * c[2] + sqrtdiscrim) / (6 * c[3]);
        if (
          x + xs[xs.length - 2] >= minx - buffer &&
          x + xs[xs.length - 2] <= maxx + buffer
        ) {
          if (x >= eps) {
            let pt = [
              x + xs[xs.length - 2],
              ((c[3] * x + c[2]) * x + c[1]) * x + c[0],
            ];
            let atOpenBoundary =
              (openMin && Math.abs(x + xs[xs.length - 2] - minx) < buffer) ||
              (openMax && Math.abs(x + xs[xs.length - 2] - maxx) < buffer);
            if (!atOpenBoundary) {
              minimaList.push(pt);
              if (pt[1] < globalMinimum[1]) {
                globalMinimum = pt;
              }
            }
            if (pt[1] < globalInfimum[1]) {
              globalInfimum = pt;
            }
          } else if (Math.abs(x) < eps) {
            let pt = [
              x + xs[xs.length - 2],
              ((c[3] * x + c[2]) * x + c[1]) * x + c[0],
            ];
            let atOpenBoundary =
              (openMin && Math.abs(x + xs[xs.length - 2] - minx) < buffer) ||
              (openMax && Math.abs(x + xs[xs.length - 2] - maxx) < buffer);
            if (!atOpenBoundary) {
              if (minimumAtPreviousRight) {
                minimaList.push(pt);
              }
              if (pt[1] < globalMinimum[1]) {
                globalMinimum = pt;
              }
            }
            if (pt[1] < globalInfimum[1]) {
              globalInfimum = pt;
            }
          }
        }
      }

      if (c[3] < 0) {
        if (maxx === Infinity) {
          // function extends to Infinity as a cubic with negative slope
          globalInfimum = [Infinity, -Infinity];
        }
      }
    }

    // also check the endpoints
    ({ globalMinimum, globalInfimum } = finalizeGlobalMinimum({
      numericalf,
      minx,
      openMin,
      globalMinimum,
      globalInfimum,
      maxx,
      openMax,
    }));

    return {
      localMinima: minimaList,
      globalMinimum,
      globalInfimum,
    };
  } else if (isPiecewiseFunction) {
    return find_minima_of_piecewise({
      functionChildrenInfoToCalculateExtrema,
      domain,
      numericalDomainsOfChildren,
      numericalf,
      numerics,
    });
  } else if (functionChildrenInfoToCalculateExtrema?.length > 0) {
    let argsForRecursion = {
      ...functionChildrenInfoToCalculateExtrema[0].stateValues,
    };
    argsForRecursion.domain = domain;
    argsForRecursion.numerics = numerics;
    return find_local_global_minima(argsForRecursion);
  } else {
    // no function child

    // calculate only for functions from R -> R
    if (!(numInputs === 1 && numOutputs === 1)) {
      return {
        setValue: {
          localMinima: [],
          globalMinimum: null,
          globalInfimum: null,
        },
      };
    }

    let varString = variables[0].subscripts_to_strings().tree;

    let derivative_f;
    let haveDerivative = true;
    let derivative;

    if (formula.variables().includes("\uFF3F")) {
      haveDerivative = false;
      derivative = () => NaN;
    } else {
      let derivative_formula = formula
        .subscripts_to_strings()
        .derivative(varString);

      try {
        derivative_f = derivative_formula.f();
      } catch (e) {
        haveDerivative = false;
        derivative = () => NaN;
      }
    }

    if (haveDerivative) {
      derivative = function (x) {
        try {
          return derivative_f({ [varString]: x });
        } catch (e) {
          return NaN;
        }
      };
    }

    // second argument is true to ignore domain
    let f = (x) => numericalf(x, true);

    // if domain isn't specified or is infinite,
    // will truncate to an interval of length 200*xscale
    let { minx, maxx, openMin, openMax } = find_effective_domain({
      domain: domain,
      truncateToFiniteDomain: true,
      xscale: xscale,
    });

    let dx = (maxx - minx) / numIntervals;

    let globalMinimum = [-Infinity, Infinity];
    let globalMinimumAtLocalMinimum = false;
    let globalInfimum = [-Infinity, Infinity];
    let globalInfimumAtLocalMinimum = false;

    let buffer = 1e-10 * Math.max(Math.abs(minx), Math.abs(maxx));

    let minimaList = [];
    let minimumAtPreviousRight = false;
    let addedAtPreviousRightViaDeriv = false;
    let fright = f(minx - dx);
    let dright = derivative(minx - dx);
    for (let i = -1; i < numIntervals + 1; i++) {
      let xleft = minx + i * dx;
      let xright = minx + (i + 1) * dx;
      let fleft = fright;
      fright = f(xright);
      let dleft = dright;
      dright = derivative(xright);

      if (Number.isNaN(fleft) || Number.isNaN(fright)) {
        continue;
      }

      let foundFromDeriv = false;

      if (haveDerivative && dleft * dright <= 0) {
        let x;

        if (dleft === 0) {
          x = xleft;
        } else if (dright === 0) {
          x = xright;
        } else {
          x = numerics.fzero(derivative, [xleft, xright]);
        }

        if (x >= minx - buffer && x <= maxx + buffer) {
          let atOpenBoundary =
            (openMin && Math.abs(x - minx) < buffer) ||
            (openMax && Math.abs(x - maxx) < buffer);
          let fx = f(x);

          // calculate tolerance used in fzero:
          let eps = 1e-6;
          let tol_act = 0.5 * eps * (Math.abs(x) + 1);

          if (derivative(x - tol_act) < 0 && derivative(x + tol_act) > 0) {
            foundFromDeriv = true;
            minimumAtPreviousRight = false;
            if (
              !atOpenBoundary &&
              !(addedAtPreviousRightViaDeriv && Math.abs(x - xleft) < buffer)
            ) {
              minimaList.push([x, fx]);
              addedAtPreviousRightViaDeriv = Math.abs(x - xright) < buffer;

              if (!globalMinimumAtLocalMinimum && fx <= globalMinimum[1]) {
                globalMinimum = [x, fx];
                globalMinimumAtLocalMinimum = true;
              }
              if (!globalInfimumAtLocalMinimum && fx <= globalInfimum[1]) {
                globalInfimum = [x, fx];
                globalInfimumAtLocalMinimum = true;
              }
            } else {
              addedAtPreviousRightViaDeriv = false;
            }
          }

          if (!atOpenBoundary && fx < globalMinimum[1]) {
            globalMinimum = [x, fx];
            globalMinimumAtLocalMinimum = false;
          }
          if (fx < globalInfimum[1]) {
            globalInfimum = [x, fx];
            globalInfimumAtLocalMinimum = false;
          }
        }
      }

      if (!foundFromDeriv) {
        addedAtPreviousRightViaDeriv = false;

        let result = numerics.fminbr(f, [xleft, xright]);
        if (result.success !== true) {
          continue;
        }
        let x = result.x;
        let fx = result.fx;

        if (x >= minx - buffer && x <= maxx + buffer) {
          let mindf =
            Math.max(Math.abs(fx), Math.abs(fleft), Math.abs(fright)) * 1e-12;

          if (
            (fx > fleft + mindf && x - xleft > 2 * result.tol) ||
            (fx > fright + mindf && xright - x > 2 * result.tol)
          ) {
            // the minimumization result was larger than one of the endpoints but not close to that endpoint,
            // indicating some structure in the interval that wasn't resolved

            if (numRecursions < 100) {
              // recurse with the domain being the current interval intersected with the original domain
              let subDomainLeft = Math.max(xleft, minx);
              let subDomainRight = Math.min(xright, maxx);
              let subDomainLeftOpen = subDomainLeft === minx && openMin;
              let subDomainRightOpen = subDomainRight === maxx && openMax;
              let subDomain1 = me.fromAst([
                "interval",
                ["tuple", subDomainLeft, subDomainRight],
                ["tuple", !subDomainLeftOpen, !subDomainRightOpen],
              ]);

              let recursionResult = find_local_global_minima({
                domain: [subDomain1],
                xscale,
                isInterpolatedFunction,
                xs,
                coeffs,
                numericalf,
                formula,
                variables,
                functionChildrenInfoToCalculateExtrema,
                numInputs,
                numOutputs,
                numIntervals: 4,
                numRecursions: numRecursions + 1,
                numerics,
              });

              let newLocalMinima = recursionResult.localMinima;
              if (newLocalMinima[newLocalMinima.length - 1]?.[0] === xright) {
                newLocalMinima.pop();
                minimumAtPreviousRight = true;
              } else {
                minimumAtPreviousRight = false;
              }
              minimaList.push(...newLocalMinima);
              if (recursionResult.globalMinimum[1] < globalMinimum[1]) {
                globalMinimum = recursionResult.globalMinimum;
              }
              if (recursionResult.globalInfimum[1] < globalInfimum[1]) {
                globalInfimum = recursionResult.globalInfimum;
              }

              continue;
            }
          }

          let atOpenBoundary =
            (openMin && Math.abs(x - minx) < buffer) ||
            (openMax && Math.abs(x - maxx) < buffer);

          if (!atOpenBoundary) {
            if (fleft < fx - mindf) {
              if (minimumAtPreviousRight) {
                if (Number.isFinite(fleft)) {
                  minimaList.push([xleft, fleft]);
                  if (
                    !globalMinimumAtLocalMinimum &&
                    fleft <= globalMinimum[1]
                  ) {
                    globalMinimum = [xleft, fleft];
                    globalMinimumAtLocalMinimum = true;
                  }
                  if (
                    !globalInfimumAtLocalMinimum &&
                    fleft <= globalInfimum[1]
                  ) {
                    globalInfimum = [xleft, fleft];
                    globalInfimumAtLocalMinimum = true;
                  }
                }
              }
              minimumAtPreviousRight = false;
            } else if (fright < fx - mindf) {
              minimumAtPreviousRight = true;
            } else {
              minimumAtPreviousRight = false;

              // make sure it actually looks like a strict minimum of f(x)
              if (
                Number.isFinite(fx) &&
                fx < fright - mindf &&
                fx < fleft - mindf &&
                fx < f(x + result.tol) - mindf &&
                fx < f(x - result.tol) - mindf
              ) {
                minimaList.push([x, fx]);
                if (!globalMinimumAtLocalMinimum && fx <= globalMinimum[1]) {
                  globalMinimum = [x, fx];
                  globalMinimumAtLocalMinimum = true;
                }
                if (!globalInfimumAtLocalMinimum && fx <= globalInfimum[1]) {
                  globalInfimum = [x, fx];
                  globalInfimumAtLocalMinimum = true;
                }
              }
            }
          }

          if (!atOpenBoundary && fx < globalMinimum[1]) {
            globalMinimum = [x, fx];
            globalMinimumAtLocalMinimum = false;
          }
          if (fx < globalInfimum[1]) {
            globalInfimum = [x, fx];
            globalInfimumAtLocalMinimum = false;
          }
        }
      }
    }

    // also check the endpoints
    ({ globalMinimum, globalInfimum } = finalizeGlobalMinimum({
      numericalf,
      minx,
      openMin,
      globalMinimum,
      globalInfimum,
      maxx,
      openMax,
    }));

    return {
      localMinima: minimaList,
      globalMinimum,
      globalInfimum,
    };
  }
}

export function find_local_global_maxima({
  domain,
  xscale,
  isInterpolatedFunction,
  xs,
  coeffs,
  numericalf,
  formula,
  variables,
  functionChildrenInfoToCalculateExtrema,
  isPiecewiseFunction,
  numericalDomainsOfChildren,
  numInputs,
  numOutputs,
  numerics,
}) {
  let numericalfFlip = (...args) => -1 * numericalf(...args);
  let coeffsFlip;
  let formulaFlip;

  if (isInterpolatedFunction) {
    if (xs === null) {
      return {
        localMaxima: [],
        globalMaximum: null,
        globalInfimum: null,
      };
    }
    coeffsFlip = coeffs.map((cs) => cs.map((v) => -v));
  } else if (isPiecewiseFunction) {
    return find_maxima_of_piecewise({
      functionChildrenInfoToCalculateExtrema,
      domain,
      numericalDomainsOfChildren,
      numericalf,
      numerics,
    });
  } else if (functionChildrenInfoToCalculateExtrema?.length > 0) {
    let argsForRecursion = {
      ...functionChildrenInfoToCalculateExtrema[0].stateValues,
    };
    argsForRecursion.domain = domain;
    argsForRecursion.numerics = numerics;
    return find_local_global_maxima(argsForRecursion);
  } else {
    formulaFlip = formula.context.fromAst(["-", formula.tree]);
  }

  let { localMinima, globalMinimum, globalInfimum } = find_local_global_minima({
    domain,
    xscale,
    isInterpolatedFunction,
    xs,
    coeffs: coeffsFlip,
    numericalf: numericalfFlip,
    formula: formulaFlip,
    variables,
    numInputs,
    numOutputs,
    numerics,
  });

  let localMaxima = localMinima.map((pt) => [pt[0], -pt[1]]);
  let globalMaximum = null,
    globalSupremum = null;

  if (globalMinimum) {
    globalMaximum = [globalMinimum[0], -1 * globalMinimum[1]];
  }
  if (globalInfimum) {
    globalSupremum = [globalInfimum[0], -1 * globalInfimum[1]];
  }

  return { localMaxima, globalMaximum, globalSupremum };
}

export function finalizeGlobalMinimum({
  numericalf,
  minx,
  openMin,
  globalMinimum,
  globalInfimum,
  maxx,
  openMax,
}) {
  if (Number.isFinite(minx)) {
    let fmin = numericalf(minx, true);
    if (Math.abs(fmin) === Infinity) {
      // check if it should be plus or minus infinity
      let f_near_min = numericalf(minx + (maxx - minx) * 1e-12, true);
      if (f_near_min > 0) {
        fmin = Infinity;
      } else if (f_near_min < 0) {
        fmin = -Infinity;
      } else {
        fmin = NaN;
      }
    }

    if (!openMin && fmin < globalMinimum[1]) {
      globalMinimum = [minx, fmin];
    }
    if (fmin < globalInfimum[1]) {
      globalInfimum = [minx, fmin];
    }
  }

  if (Number.isFinite(maxx)) {
    let fmax = numericalf(maxx, true);
    if (Math.abs(fmax) === Infinity) {
      // check if it should be plus or minus infinity
      let f_near_max = numericalf(maxx - (maxx - minx) * 1e-12, true);
      if (f_near_max > 0) {
        fmax = Infinity;
      } else if (f_near_max < 0) {
        fmax = -Infinity;
      } else {
        fmax = NaN;
      }
    }
    if (!openMax && fmax < globalMinimum[1]) {
      globalMinimum = [maxx, fmax];
    }
    if (fmax < globalInfimum[1]) {
      globalInfimum = [maxx, fmax];
    }
  }

  if (globalMinimum[1] === Infinity) {
    // never found a global minimum
    globalMinimum = null;
  }
  if (globalInfimum[1] === Infinity) {
    // never found a global minimum
    globalInfimum = null;
  }

  if (globalInfimum && globalMinimum) {
    if (globalInfimum[1] === -Infinity) {
      if (globalMinimum[1] > -Infinity) {
        globalMinimum = null;
      }
    } else {
      let buffer =
        Math.max(Math.abs(globalInfimum[1]), Math.abs(globalMinimum[1])) *
        1e-12;
      if (globalInfimum[1] < globalMinimum[1] - buffer) {
        globalMinimum = null;
      }
    }
  }

  return { globalMinimum, globalInfimum };
}

export function find_minima_of_piecewise({
  functionChildrenInfoToCalculateExtrema,
  domain,
  numericalDomainsOfChildren,
  numericalf,
  numerics,
}) {
  let globalMinimum = [-Infinity, Infinity];
  let globalInfimum = [-Infinity, Infinity];

  let eps = numerics.eps;

  let minimaList = [];

  let f = numericalf;

  let endpointsToManuallyCheck = [];

  let effectiveDomainsOfChildren = find_effective_domains_piecewise_children({
    domain,
    numericalDomainsOfChildren,
  });

  for (let [ind, childDomain] of effectiveDomainsOfChildren.entries()) {
    // childDomain could be an empty set, real line, singleton set, interval,
    // or union of singleton sets and intervals
    let childDomainAsMath = mathExpressionFromSubsetValue({
      subsetValue: childDomain,
    });

    let childDomainPieces = [];
    if (childDomainAsMath.tree[0] === "union") {
      childDomainPieces = childDomainAsMath.tree.slice(1);
    } else {
      childDomainPieces = [childDomainAsMath.tree];
    }

    for (let domainPiece of childDomainPieces) {
      let thisDomain;
      if (domainPiece === "∅") {
        continue;
      } else if (domainPiece === "R") {
        thisDomain = null;
      } else if (domainPiece[0] === "set") {
        // have a singleton piece
        endpointsToManuallyCheck.push(domainPiece[1]);
        continue;
      } else {
        // have interval
        thisDomain = domainPiece;
      }

      let args = {
        ...functionChildrenInfoToCalculateExtrema[ind].stateValues,
      };
      if (thisDomain) {
        args.domain = [me.fromAst(thisDomain)];
      }
      args.numerics = numerics;

      let subResults = find_local_global_minima(args);

      let childMinima = subResults.localMinima;

      if (thisDomain) {
        // thisDomain is an interval
        // We will check endpoints of local minima manually
        // (as their nature depends on more than one piece).
        // Remove them from list of local minima and add to list to check.
        let minx = me.fromAst(thisDomain[1][1]).evaluate_to_constant();
        if (Number.isFinite(minx)) {
          endpointsToManuallyCheck.push(minx);
          childMinima = childMinima.filter(
            (minpair) => minpair[0] > minx + eps,
          );
        }

        let maxx = me.fromAst(thisDomain[1][2]).evaluate_to_constant();
        if (Number.isFinite(maxx)) {
          endpointsToManuallyCheck.push(maxx);
          childMinima = childMinima.filter(
            (minpair) => minpair[0] < maxx - eps,
          );
        }
      }

      minimaList.push(...childMinima);

      if (subResults.globalMinimum?.[1] < globalMinimum[1]) {
        globalMinimum = subResults.globalMinimum;
      }

      if (subResults.globalInfimum?.[1] < globalInfimum[1]) {
        globalInfimum = subResults.globalInfimum;
      }
    }
  }

  // check endpoints
  for (let ept of endpointsToManuallyCheck) {
    let x = me.fromAst(ept).evaluate_to_constant();

    if (Number.isFinite(x)) {
      let fx = f(x);
      // Note: add true to these evaluations of f to ignore domain
      // so that local minima at edge of closed domain are counted
      // (to be consistent with how these local minima are calculated for other functions)
      if (fx < f(x - eps, true) && fx < f(x + eps, true)) {
        if (
          minimaList.every(
            (minpair) => minpair[0] < x - eps || minpair[0] > x + eps,
          )
        ) {
          minimaList.push([x, fx]);
        }
      }

      if (fx < globalMinimum[1]) {
        globalMinimum = [x, fx];
      }
      if (fx < globalInfimum[1]) {
        globalInfimum = [x, fx];
      }
    }
  }

  minimaList = minimaList.sort((a, b) => a[0] - b[0]);

  ({ globalMinimum, globalInfimum } = finalizeGlobalMinimum({
    globalMinimum,
    globalInfimum,
  }));
  return { localMinima: minimaList, globalMinimum, globalInfimum };
}

export function find_maxima_of_piecewise({
  functionChildrenInfoToCalculateExtrema,
  domain,
  numericalDomainsOfChildren,
  numericalf,
  numerics,
}) {
  let flippedFunctionChildren = flip_function_children(
    functionChildrenInfoToCalculateExtrema,
  );

  let numericalfFlip = (...args) => -1 * numericalf(...args);

  let { localMinima, globalMinimum, globalInfimum } = find_minima_of_piecewise({
    functionChildrenInfoToCalculateExtrema: flippedFunctionChildren,
    domain: domain,
    numericalDomainsOfChildren: numericalDomainsOfChildren,
    numericalf: numericalfFlip,
    numerics,
  });

  let localMaxima = localMinima.map((pt) => [pt[0], -pt[1]]);

  let globalMaximum = null,
    globalSupremum = null;

  if (globalMinimum) {
    globalMaximum = [globalMinimum[0], -1 * globalMinimum[1]];
  }
  if (globalInfimum) {
    globalSupremum = [globalInfimum[0], -1 * globalInfimum[1]];
  }

  return { localMaxima, globalMaximum, globalSupremum };
}

function flip_function_children(functionChildren) {
  let flippedFunctionChildren = [];

  for (let functionChild of functionChildren) {
    let stateValues = functionChild.stateValues;
    let flippedStateValues = { ...stateValues };

    flippedStateValues.numericalf = (...args) =>
      -1 * stateValues.numericalf(...args);

    if (stateValues.isInterpolatedFunction) {
      flippedStateValues.coeffsFlip = stateValues.coeffs.map((cs) =>
        cs.map((v) => -v),
      );
    } else if (
      stateValues.isInterpolatedFunction ||
      stateValues.functionChildrenInfoToCalculateExtrema?.length > 0
    ) {
      flippedStateValues.functionChildrenInfoToCalculateExtrema =
        flip_function_children(
          stateValues.functionChildrenInfoToCalculateExtrema,
        );
    } else {
      flippedStateValues.formula = stateValues.formula.context.fromAst([
        "-",
        stateValues.formula.tree,
      ]);
    }

    flippedFunctionChildren.push({
      stateValues: flippedStateValues,
    });
  }

  return flippedFunctionChildren;
}
