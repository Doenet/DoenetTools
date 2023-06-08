import me from "math-expressions";
import { find_effective_domain } from "./domain";

export function find_local_global_minima({
  domain,
  xscale,
  isInterpolatedFunction,
  xs,
  coeffs,
  numericalf,
  formula,
  variables,
  functionChild,
  numInputs,
  numOutputs,
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
        globalMinimumCompactifyDomain: null,
      };
    }

    let globalMinimum = [-Infinity, Infinity];
    let globalMinimumCompactifyDomain = [-Infinity, Infinity];

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
            if (pt[1] < globalMinimumCompactifyDomain[1]) {
              globalMinimumCompactifyDomain = pt;
            }
          } else if (Math.abs(x - dx) < eps) {
            minimumAtPreviousRight = true;
          }
        }
      } else if (c[2] === 0 && c[1] === 0) {
        // constant segment
        let xPt = xs[1];
        if (xPt >= minx - buffer) {
          if (c[0] < globalMinimum[1]) {
            let atOpenBoundary = openMin && Math.abs(xPt - minx) < buffer;
            if (!atOpenBoundary) {
              globalMinimum = [xPt, c[0]];
            }
          }
          if (c[0] < globalMinimumCompactifyDomain[1]) {
            globalMinimumCompactifyDomain = [xPt, c[0]];
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
            if (pt[1] < globalMinimumCompactifyDomain[1]) {
              globalMinimumCompactifyDomain = pt;
            }
          } else if (Math.abs(x - dx) < eps) {
            minimumAtPreviousRight = true;
          }
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
                if (pt[1] < globalMinimumCompactifyDomain[1]) {
                  globalMinimumCompactifyDomain = pt;
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
                if (pt[1] < globalMinimumCompactifyDomain[1]) {
                  globalMinimumCompactifyDomain = pt;
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
              if (c[0] < globalMinimumCompactifyDomain[1]) {
                globalMinimumCompactifyDomain = [x1, c[0]];
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
                if (pt[1] < globalMinimumCompactifyDomain[1]) {
                  globalMinimumCompactifyDomain = pt;
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
                if (pt[1] < globalMinimumCompactifyDomain[1]) {
                  globalMinimumCompactifyDomain = pt;
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
            if (pt[1] < globalMinimumCompactifyDomain[1]) {
              globalMinimumCompactifyDomain = pt;
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
            if (pt[1] < globalMinimumCompactifyDomain[1]) {
              globalMinimumCompactifyDomain = pt;
            }
          }
        }
      } else if (c[2] === 0 && c[1] === 0) {
        // constant segment
        let xPt = xs[xs.length - 2];
        if (xPt <= maxx + buffer) {
          if (c[0] < globalMinimum[1]) {
            let atOpenBoundary = openMax && Math.abs(xPt - maxx) < buffer;
            if (!atOpenBoundary) {
              globalMinimum = [xPt, c[0]];
            }
          }
          if (c[0] < globalMinimumCompactifyDomain[1]) {
            globalMinimumCompactifyDomain = [xPt, c[0]];
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
            if (pt[1] < globalMinimumCompactifyDomain[1]) {
              globalMinimumCompactifyDomain = pt;
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
            if (pt[1] < globalMinimumCompactifyDomain[1]) {
              globalMinimumCompactifyDomain = pt;
            }
          }
        }
      }
    }

    // also check the endpoints
    ({ globalMinimum, globalMinimumCompactifyDomain } = finalizeGlobalMinimum({
      numericalf,
      minx,
      openMin,
      globalMinimum,
      globalMinimumCompactifyDomain,
      maxx,
      openMax,
    }));

    return {
      localMinima: minimaList,
      globalMinimum,
      globalMinimumCompactifyDomain,
    };
  } else if (functionChild?.length > 0) {
    return {
      localMinima: functionChild[0].stateValues.allMinima,
      globalMinimum: functionChild[0].stateValues.globalMinimumOption,
      globalMinimumCompactifyDomain:
        functionChild[0].stateValues.globalMinimumCompactifyDomainOption,
    };
  } else {
    // no function child

    // calculate only for functions from R -> R
    if (!(numInputs === 1 && numOutputs === 1)) {
      return {
        setValue: {
          localMinima: [],
          globalMinimum: null,
          globalMinimumCompactifyDomain: null,
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
        derivative_f = derivative_formula.subscripts_to_strings().f();
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
    let globalMinimumCompactifyDomain = [-Infinity, Infinity];
    let globalMinimumCompactifyDomainAtLocalMinimum = false;

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
            } else {
              addedAtPreviousRightViaDeriv = false;
            }
          }

          if (!atOpenBoundary && fx < globalMinimum[1]) {
            globalMinimum = [x, fx];
            globalMinimumAtLocalMinimum = false;
          }
          if (fx < globalMinimumCompactifyDomain[1]) {
            globalMinimumCompactifyDomain = [x, fx];
            globalMinimumCompactifyDomainAtLocalMinimum = false;
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

        if (
          (fx > fleft && x - xleft > 2 * result.tol) ||
          (fx > fright && xright - x > 2 * result.tol)
        ) {
          // the minimumization result was larger than one of the endpoints but not close to that endpoint,
          // indicating some structure in the interval that wasn't resolved

          if (numRecursions < 4) {
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
              functionChild,
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
            if (
              recursionResult.globalMinimumCompactifyDomain[1] <
              globalMinimumCompactifyDomain[1]
            ) {
              globalMinimumCompactifyDomain =
                recursionResult.globalMinimumCompactifyDomain;
            }
          }
        }

        if (x >= minx - buffer && x <= maxx + buffer) {
          let atOpenBoundary =
            (openMin && Math.abs(x - minx) < buffer) ||
            (openMax && Math.abs(x - maxx) < buffer);

          if (!atOpenBoundary) {
            let mindf =
              Math.max(Math.abs(fx), Math.abs(fleft), Math.abs(fright)) * 1e-12;

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
                    !globalMinimumCompactifyDomainAtLocalMinimum &&
                    fleft <= globalMinimumCompactifyDomain[1]
                  ) {
                    globalMinimumCompactifyDomain = [xleft, fleft];
                    globalMinimumCompactifyDomainAtLocalMinimum = true;
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
                if (
                  !globalMinimumCompactifyDomainAtLocalMinimum &&
                  fx <= globalMinimumCompactifyDomain[1]
                ) {
                  globalMinimumCompactifyDomain = [x, fx];
                  globalMinimumCompactifyDomainAtLocalMinimum = true;
                }
              }
            }
          }

          if (!atOpenBoundary && fx < globalMinimum[1]) {
            globalMinimum = [x, fx];
            globalMinimumAtLocalMinimum = false;
          }
          if (fx < globalMinimumCompactifyDomain[1]) {
            globalMinimumCompactifyDomain = [x, fx];
            globalMinimumCompactifyDomainAtLocalMinimum = false;
          }
        }
      }
    }

    // also check the endpoints
    ({ globalMinimum, globalMinimumCompactifyDomain } = finalizeGlobalMinimum({
      numericalf,
      minx,
      openMin,
      globalMinimum,
      globalMinimumCompactifyDomain,
      maxx,
      openMax,
    }));

    return {
      localMinima: minimaList,
      globalMinimum,
      globalMinimumCompactifyDomain,
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
  functionChild,
  numInputs,
  numOutputs,
  numerics,
}) {
  let numericalfFlip = (...args) => -1 * numericalf(...args);
  let coeffsFlip;
  let formulaFlip;

  if (isInterpolatedFunction) {
    coeffsFlip = coeffs.map((cs) => cs.map((v) => -v));
  } else if (functionChild?.length > 0) {
    return {
      localMaxima: functionChild[0].stateValues.allMaxima,
      globalMaximum: functionChild[0].stateValues.globalMaximumOption,
      globalMaximumCompactifyDomain:
        functionChild[0].stateValues.globalMaximumCompactifyDomainOption,
    };
  } else {
    formulaFlip = formula.context.fromAst(["-", formula.tree]);
  }

  let { localMinima, globalMinimum, globalMinimumCompactifyDomain } =
    find_local_global_minima({
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
    globalMaximumCompactifyDomain = null;

  if (globalMinimum) {
    globalMaximum = [globalMinimum[0], -1 * globalMinimum[1]];
  }
  if (globalMinimumCompactifyDomain) {
    globalMaximumCompactifyDomain = [
      globalMinimumCompactifyDomain[0],
      -1 * globalMinimumCompactifyDomain[1],
    ];
  }

  return { localMaxima, globalMaximum, globalMaximumCompactifyDomain };
}

function finalizeGlobalMinimum({
  numericalf,
  minx,
  openMin,
  globalMinimum,
  globalMinimumCompactifyDomain,
  maxx,
  openMax,
}) {
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
  if (fmin < globalMinimumCompactifyDomain[1]) {
    globalMinimumCompactifyDomain = [minx, fmin];
  }

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
  if (fmax < globalMinimumCompactifyDomain[1]) {
    globalMinimumCompactifyDomain = [maxx, fmax];
  }

  if (globalMinimum[0] === -Infinity) {
    // never found a global minimum
    globalMinimum = null;
  }
  if (globalMinimumCompactifyDomain[0] === -Infinity) {
    // never found a global minimum
    globalMinimumCompactifyDomain = null;
  }

  if (globalMinimumCompactifyDomain && globalMinimum) {
    if (globalMinimumCompactifyDomain[1] === -Infinity) {
      if (globalMinimum[1] > -Infinity) {
        globalMinimum = null;
      }
    } else {
      let buffer =
        Math.max(
          Math.abs(globalMinimumCompactifyDomain[1]),
          Math.abs(globalMinimum[1]),
        ) * 1e-12;
      if (globalMinimumCompactifyDomain[1] < globalMinimum[1] - buffer) {
        globalMinimum = null;
      }
    }
  }

  return { globalMinimum, globalMinimumCompactifyDomain };
}
