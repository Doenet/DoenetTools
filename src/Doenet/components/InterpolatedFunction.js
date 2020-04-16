import Function from './Function';
import me from 'math-expressions';

export default class InterpolatedFunction extends Function {
  static componentType = "interpolatedFunction";
  static rendererType = undefined;


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    let atLeastZeroMaxima = childLogic.newLeaf({
      name: "atLeastZeroMaxima",
      componentType: "maximum",
      comparison: 'atLeast',
      number: 0,
    })

    let atLeastZeroMinima = childLogic.newLeaf({
      name: "atLeastZeroMinima",
      componentType: "minimum",
      comparison: 'atLeast',
      number: 0,
    })

    let atLeastZeroExtrema = childLogic.newLeaf({
      name: "atLeastZeroExtrema",
      componentType: "extremum",
      comparison: 'atLeast',
      number: 0,
    })

    let atLeastZeroThroughs = childLogic.newLeaf({
      name: "atLeastZeroThroughs",
      componentType: "through",
      comparison: 'atLeast',
      number: 0,
    })

    childLogic.newOperator({
      name: "throughCriteria",
      operator: "or",
      propositions: [atLeastZeroMaxima, atLeastZeroMinima, atLeastZeroExtrema, atLeastZeroThroughs],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    delete stateVariableDefinitions.functionChild;

    stateVariableDefinitions.formula.returnDependencies = () => ({})
    stateVariableDefinitions.formula.definition = () => ({
      newValues: { formula: me.fromAst('\uff3f') }
    })

    stateVariableDefinitions.selectedStyle = {
      forRenderer: true,
      returnDependencies: () => ({
        styleNumber: {
          dependencyType: "stateVariable",
          variableName: "styleNumber",
        },
        ancestorWithStyle: {
          dependencyType: "ancestorStateVariables",
          variableNames: ["styleDefinitions"]
        }
      }),
      definition: function ({ dependencyValues }) {

        let selectedStyle;

        for (let styleDefinition of dependencyValues.ancestorWithStyle.stateValues.styleDefinitions) {
          if (dependencyValues.styleNumber === styleDefinition.styleNumber) {
            if (selectedStyle === undefined) {
              selectedStyle = styleDefinition;
            } else {
              // attributes from earlier matches take precedence
              selectedStyle = Object.assign(Object.assign({}, styleDefinition), selectedStyle)
            }
          }
        }

        if (selectedStyle === undefined) {
          selectedStyle = dependencyValues.ancestorWithStyle.stateValues.styleDefinitions[0];
        }
        return { newValues: { selectedStyle } };
      }
    }

    stateVariableDefinitions.styleDescription = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
      }),
      definition: function ({ dependencyValues }) {

        let curveDescription = "";
        if (dependencyValues.selectedStyle.lineWidth >= 4) {
          curveDescription += "thick ";
        } else if (dependencyValues.selectedStyle.lineWidth <= 1) {
          curveDescription += "thin ";
        }
        if (dependencyValues.selectedStyle.lineStyle === "dashed") {
          curveDescription += "dashed ";
        } else if (dependencyValues.selectedStyle.lineStyle === "dotted") {
          curveDescription += "dotted ";
        }

        curveDescription += `${dependencyValues.selectedStyle.lineColor} `;

        return { newValues: { styleDescription: curveDescription } };
      }
    }

    stateVariableDefinitions.prescribedPoints = {
      isArray: true,
      entryPrefixes: ["prescribedPoint"],
      returnDependencies: () => ({
        throughChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroThroughs",
          variableNames: ["points", "slope", "nPoints"]
        }
      }),
      markStale: function ({ freshnessInfo, changes, arrayKeys, previousValues }) {
        let freshByKey = freshnessInfo.freshByKey;

        // console.log('mark stale for prescribed points');
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(JSON.parse(JSON.stringify(changes)))
        // console.log(arrayKeys);
        // console.log(previousValues);

        if (changes.throughChildren) {
          if (changes.throughChildren.componentIdentitiesChanged) {

            // if any through children changed, everything is stale
            freshnessInfo.freshByKey = {};
            return { fresh: false }

          } else {
            let valuesChanged = changes.throughChildren.valuesChanged;

            if (valuesChanged.some(x => x.nPoints)) {
              // if number of points changed for any through points,
              // everything is stale
              freshnessInfo.freshByKey = {};
              return { fresh: false }
            }

            // through children didn't change
            // and the points for each through child didn't change

            // To determine which arrayKey each point corresponds to
            // need to know how many points for each through child
            // which we can determine from their previous value
            let numberKeysSoFar = 0;

            for (let [throughInd, throughChange] of valuesChanged.entries()) {

              let previousThrough = previousValues.throughChildren[throughInd];
              let nPointsInThrough = previousThrough.stateValues.points.length;

              if (throughChange) {

                let pointFreshByKey = throughChange.points.freshnessInfo.freshByKey;
                let slopeChanged = "slope" in throughChange;

                for (let throughArrayKey = 0; throughArrayKey < nPointsInThrough; throughArrayKey++) {
                  let thisArrayKey = numberKeysSoFar + throughArrayKey;
                  if (slopeChanged || !pointFreshByKey[throughArrayKey]) {
                    delete freshByKey[thisArrayKey];
                  }
                }
              }

              numberKeysSoFar += nPointsInThrough;

            }

          }
        }

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }


        if (arrayKey === undefined) {
          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: false }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: true }
          }
        } else {
          // asked for just one component
          return { fresh: freshByKey[arrayKey] === true }
        }


      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {
        let freshByKey = freshnessInfo.freshByKey;

        // console.log('definition of prescribed points')
        // console.log(dependencyValues);
        // console.log(arrayKeys)
        // console.log(freshByKey);
        // console.log(changes);

        let identitiesChanged = false;
        if (changes.throughChildren.componentIdentitiesChanged) {
          identitiesChanged = true;
        } else {
          for (let ind in changes.throughChildren.valuesChanged) {
            if (changes.throughChildren.valuesChanged[ind].nPoints) {
              identitiesChanged = true;
              break;
            }
          }
        }

        if (identitiesChanged) {

          // identities of points changed, so create prescribedPoints
          // make it be an array to indicate starting over

          let prescribedPoints = [];

          for (let throughChild of dependencyValues.throughChildren) {
            let slope = throughChild.stateValues.slope;
            for (let point of throughChild.stateValues.points) {
              freshByKey[prescribedPoints.length] = true;

              prescribedPoints.push({
                x: point.get_component(0),
                y: point.get_component(1),
                slope,
              })

            }
          }

          return { newValues: { prescribedPoints } }

        } else {

          // since identities of points didn't change
          // presribedPoints will be object just containing changed components
          let prescribedPoints = {};

          let numberKeysSoFar = 0;

          for (let throughChild of dependencyValues.throughChildren) {
            let slope = throughChild.stateValues.slope;
            for (let point of throughChild.stateValues.points) {
              if (!freshByKey[numberKeysSoFar]) {
                freshByKey[numberKeysSoFar] = true;
                prescribedPoints[numberKeysSoFar] = {
                  x: point.get_component(0),
                  y: point.get_component(1),
                  slope,
                }
              }
              numberKeysSoFar++;
            }
          }

          return { newValues: { prescribedPoints } }

        }

      }
    }

    stateVariableDefinitions.prescribedMinima = {
      returnDependencies: () => ({
        minimumChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroMinima",
          variableNames: ["location", "value"]
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          prescribedMinima: dependencyValues.minimumChildren.map(x => ({
            x: x.stateValues.location,
            y: x.stateValues.value,
          }))
        }
      })
    }


    stateVariableDefinitions.prescribedMaxima = {
      returnDependencies: () => ({
        maximumChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroMaxima",
          variableNames: ["location", "value"]
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          prescribedMaxima: dependencyValues.maximumChildren.map(x => ({
            x: x.stateValues.location,
            y: x.stateValues.value,
          }))
        }
      })
    }


    stateVariableDefinitions.prescribedExtrema = {
      returnDependencies: () => ({
        extremumChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroExtrema",
          variableNames: ["location", "value"]
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          prescribedExtrema: dependencyValues.extremumChildren.map(x => ({
            x: x.stateValues.location,
            y: x.stateValues.value,
          }))
        }
      })
    }


    stateVariableDefinitions.interpolationPoints = {
      returnDependencies: () => ({
        xscale: {
          dependencyType: "stateVariable",
          variableName: "xscale"
        },
        yscale: {
          dependencyType: "stateVariable",
          variableName: "yscale"
        },
        prescribedPoints: {
          dependencyType: "stateVariable",
          variableName: "prescribedPoints"
        },
        prescribedMinima: {
          dependencyType: "stateVariable",
          variableName: "prescribedMinima"
        },
        prescribedMaxima: {
          dependencyType: "stateVariable",
          variableName: "prescribedMaxima"
        },
        prescribedExtrema: {
          dependencyType: "stateVariable",
          variableName: "prescribedExtrema"
        },
      }),
      definition: ({ dependencyValues }) =>
        calculateInterpolationPoints({ dependencyValues, numerics })
    }

    stateVariableDefinitions.xs = {
      additionalStateVariablesDefined: ["coeffs"],
      returnDependencies: () => ({
        interpolationPoints: {
          dependencyType: "stateVariable",
          variableName: "interpolationPoints"
        }
      }),
      definition: computeSplineParamCoeffs
    }

    stateVariableDefinitions.numericalf = {
      returnDependencies: () => ({
        xs: {
          dependencyType: "stateVariable",
          variableName: "xs"
        },
        coeffs: {
          dependencyType: "stateVariable",
          variableName: "coeffs"
        },
        interpolationPoints: {
          dependencyType: "stateVariable",
          variableName: "interpolationPoints"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          numericalf: function (x) {

            if (isNaN(x)) {
              return NaN;
            }

            let xs = dependencyValues.xs;
            let coeffs = dependencyValues.coeffs;

            if (xs === null) {
              return NaN;
            }

            if (x < xs[0]) {
              // Extrapolate
              x -= xs[0];
              let c = coeffs[0];
              return (((c[3] * x + c[2]) * x + c[1]) * x + c[0]);
            }

            if (x > xs[xs.length - 1]) {
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
              else { return dependencyValues.interpolationPoints[mid].y; }
            }
            let i = Math.max(0, high);

            // Interpolate
            x -= xs[i];
            let c = coeffs[i];
            return (((c[3] * x + c[2]) * x + c[1]) * x + c[0]);

          }
        }
      })
    }


    stateVariableDefinitions.f = {
      returnDependencies: () => ({
        numericalf: {
          dependencyType: "stateVariable",
          variableName: "numericalf"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          f: x => me.fromAst(dependencyValues.numericalf(
            x.evaluate_to_constant()
          ))
        }
      })
    }

    stateVariableDefinitions.minima = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["minimum"],
      returnDependencies: () => ({
        xs: {
          dependencyType: "stateVariable",
          variableName: "xs",
        },
        coeffs: {
          dependencyType: "stateVariable",
          variableName: "coeffs"
        },
      }),
      markStale: function ({ freshnessInfo, arrayKeys, changes }) {

        // with any change, mark whole array as stale
        freshnessInfo.freshByKey = {}
        return { fresh: false }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys }) {

        let freshByKey = freshnessInfo.freshByKey;

        if (Object.keys(freshByKey).length > 0) {
          // if anything is fresh, it all is fresh
          return {};
        }

        let xs = dependencyValues.xs;
        let coeffs = dependencyValues.coeffs;
        let eps = numerics.eps;

        let minimaList = [];
        let minimumAtPreviousRight = false;

        // since extrapolate for x < xs[0], formula based on coeffs[0]
        // is valid for x < xs[1]
        let c = coeffs[0];
        let dx = xs[1] - xs[0];

        if (c[3] === 0) {
          // have quadratic.  Minimum only if c[2] > 0
          if (c[2] > 0) {
            let x = -c[1] / (2 * c[2]);
            if (x <= dx - eps) {
              minimaList.push(me.fromAst(["tuple", x + xs[0], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
            } else if (Math.abs(x - dx) < eps) {
              minimumAtPreviousRight = true;
            }
          }
        } else {
          // since c[3] != 0, have cubic

          let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
          if (discrim > 0) {
            let sqrtdiscrim = Math.sqrt(discrim);

            // critical point where choose +sqrtdiscrim is minimum
            let x = (-2 * c[2] + sqrtdiscrim) / (6 * c[3]);
            if (x <= dx - eps) {
              minimaList.push(me.fromAst(["tuple", x + xs[0], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
            } else if (Math.abs(x - dx) < eps) {
              minimumAtPreviousRight = true;
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
              if (Math.abs(x) < eps) {
                if (minimumAtPreviousRight) {
                  minimaList.push(me.fromAst(["tuple", x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
                }
              } else if (x >= eps && x <= dx - eps) {
                minimaList.push(me.fromAst(["tuple", x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
              }
              minimumAtPreviousRight = (Math.abs(x - dx) < eps);

            } else {
              minimumAtPreviousRight = false;
            }
          } else {
            // since c[3] != 0, have cubic

            let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
            if (discrim > 0) {
              let sqrtdiscrim = Math.sqrt(discrim);

              // critical point where choose +sqrtdiscrim is minimum
              let x = (-2 * c[2] + sqrtdiscrim) / (6 * c[3]);
              if (Math.abs(x) < eps) {
                if (minimumAtPreviousRight) {
                  minimaList.push(me.fromAst(["tuple", x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
                }
              } else if (x >= eps && x <= dx - eps) {
                minimaList.push(me.fromAst(["tuple", x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
              }
              minimumAtPreviousRight = (Math.abs(x - dx) < eps);

            } else {
              minimumAtPreviousRight = false;
            }
          }
        }

        // since extrapolate for x > xs[n-1], formula based on coeffs[n-2]
        // is valid for x > xs[n-2]
        c = coeffs[xs.length - 2]
        if (c[3] === 0) {
          // have quadratic.  Minimum only if c[2] > 0
          if (c[2] > 0) {
            let x = -c[1] / (2 * c[2]);
            if (Math.abs(x) < eps) {
              if (minimumAtPreviousRight) {
                minimaList.push(me.fromAst(["tuple", x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
              }
            } else if (x >= eps) {
              minimaList.push(me.fromAst(["tuple", x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
            }
          }
        } else {
          // since c[3] != 0, have cubic

          let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
          if (discrim > 0) {
            let sqrtdiscrim = Math.sqrt(discrim);

            // critical point where choose +sqrtdiscrim is minimum
            let x = (-2 * c[2] + sqrtdiscrim) / (6 * c[3]);
            if (x >= eps) {
              minimaList.push(me.fromAst(["tuple", x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
            } else if (Math.abs(x) < eps) {
              if (minimumAtPreviousRight) {
                minimaList.push(me.fromAst(["tuple", x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
              }
            }
          }
        }


        // mark everything fresh
        for (let key in minimaList) {
          freshByKey[key] = true;
        }

        return { newValues: { minima: minimaList } }

      }
    }

    stateVariableDefinitions.maxima = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["maximum"],
      returnDependencies: () => ({
        xs: {
          dependencyType: "stateVariable",
          variableName: "xs",
        },
        coeffs: {
          dependencyType: "stateVariable",
          variableName: "coeffs"
        },
      }),
      markStale: function ({ freshnessInfo, arrayKeys, changes }) {

        // with any change, mark whole array as stale
        freshnessInfo.freshByKey = {}
        return { fresh: false }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys }) {

        let freshByKey = freshnessInfo.freshByKey;

        if (Object.keys(freshByKey).length > 0) {
          // if anything is fresh, it all is fresh
          return {};
        }

        let xs = dependencyValues.xs;
        let coeffs = dependencyValues.coeffs;
        let eps = numerics.eps;

        let maximaList = [];
        let maximumAtPreviousRight = false;

        // since extrapolate for x < xs[0], formula based on coeffs[0]
        // is valid for x < xs[1]
        let c = coeffs[0];
        let dx = xs[1] - xs[0];

        if (c[3] === 0) {
          // have quadratic.  Maximum only if c[2] < 0
          if (c[2] < 0) {
            let x = -c[1] / (2 * c[2]);
            if (x <= dx - eps) {
              maximaList.push(me.fromAst(["tuple", x + xs[0], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
            } else if (Math.abs(x - dx) < eps) {
              maximumAtPreviousRight = true;
            }
          }
        } else {
          // since c[3] != 0, have cubic

          let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
          if (discrim > 0) {
            let sqrtdiscrim = Math.sqrt(discrim);

            // critical point where choose -sqrtdiscrim is maximum
            let x = (-2 * c[2] - sqrtdiscrim) / (6 * c[3]);
            if (x <= dx - eps) {
              maximaList.push(me.fromAst(["tuple", x + xs[0], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
            } else if (Math.abs(x - dx) < eps) {
              maximumAtPreviousRight = true;
            }
          }
        }

        for (let i = 1; i < xs.length - 2; i++) {
          c = coeffs[i];
          dx = xs[i + 1] - xs[i];

          if (c[3] === 0) {
            // have quadratic.  Maximum only if c[2] < 0
            if (c[2] < 0) {
              let x = -c[1] / (2 * c[2]);
              if (Math.abs(x) < eps) {
                if (maximumAtPreviousRight) {
                  maximaList.push(me.fromAst(["tuple", x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
                }
              } else if (x >= eps && x <= dx - eps) {
                maximaList.push(me.fromAst(["tuple", x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
              }
              maximumAtPreviousRight = (Math.abs(x - dx) < eps);

            } else {
              maximumAtPreviousRight = false;
            }
          } else {
            // since c[3] != 0, have cubic

            let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
            if (discrim > 0) {
              let sqrtdiscrim = Math.sqrt(discrim);

              // critical point where choose -sqrtdiscrim is maximum
              let x = (-2 * c[2] - sqrtdiscrim) / (6 * c[3]);
              if (Math.abs(x) < eps) {
                if (maximumAtPreviousRight) {
                  maximaList.push(me.fromAst(["tuple", x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
                }
              } else if (x >= eps && x <= dx - eps) {
                maximaList.push(me.fromAst(["tuple", x + xs[i], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
              }
              maximumAtPreviousRight = (Math.abs(x - dx) < eps);

            } else {
              maximumAtPreviousRight = false;
            }
          }
        }

        // since extrapolate for x > xs[n-1], formula based on coeffs[n-2]
        // is valid for x > xs[n-2]
        c = coeffs[xs.length - 2]
        if (c[3] === 0) {
          // have quadratic.  Maximum only if c[2] < 0
          if (c[2] < 0) {
            let x = -c[1] / (2 * c[2]);
            if (Math.abs(x) < eps) {
              if (maximumAtPreviousRight) {
                maximaList.push(me.fromAst(["tuple", x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
              }
            } else if (x >= eps) {
              maximaList.push(me.fromAst(["tuple", x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
            }
          }
        } else {
          // since c[3] != 0, have cubic

          let discrim = 4 * c[2] * c[2] - 12 * c[3] * c[1];
          if (discrim > 0) {
            let sqrtdiscrim = Math.sqrt(discrim);

            // critical point where choose -sqrtdiscrim is maximum
            let x = (-2 * c[2] - sqrtdiscrim) / (6 * c[3]);
            if (x >= eps) {
              maximaList.push(me.fromAst(["tuple", x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
            } else if (Math.abs(x) < eps) {
              if (maximumAtPreviousRight) {
                maximaList.push(me.fromAst(["tuple", x + xs[xs.length - 2], ((c[3] * x + c[2]) * x + c[1]) * x + c[0]]));
              }
            }
          }
        }


        // mark everything fresh
        for (let key in maximaList) {
          freshByKey[key] = true;
        }

        return { newValues: { maxima: maximaList } }

      }
    }

    stateVariableDefinitions.extrema = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["extremum"],
      returnDependencies: () => ({
        minima: {
          dependencyType: "stateVariable",
          variableName: "minima"
        },
        maxima: {
          dependencyType: "stateVariable",
          variableName: "maxima"
        }
      }),
      markStale: function ({ freshnessInfo }) {

        // with any change, mark whole array as stale
        freshnessInfo.freshByKey = {}
        return { fresh: false }

      },
      definition: function ({ dependencyValues, freshnessInfo }) {

        let freshByKey = freshnessInfo.freshByKey;

        // freshByKey is all or nothing
        // so if it contains anything, then everything is fresh
        if (Object.keys(freshByKey).length > 0) {
          // since is array, don't need to indicate noChanges
          return {}
        }

        let extrema = [...dependencyValues.minima, ...dependencyValues.maxima]
          .sort((a, b) => a.get_component(0) - b.get_component(0));

        // mark everything fresh
        for (let key in extrema) {
          freshByKey[key] = true;
        }

        return { newValues: { extrema } }

      }
    }


    return stateVariableDefinitions;

  }


}


function calculateInterpolationPoints({ dependencyValues, numerics }) {

  let pointsWithX = [];
  let pointsWithoutX = [];

  let allPoints = {
    maximum: dependencyValues.prescribedMaxima,
    minimum: dependencyValues.prescribedMinima,
    extremum: dependencyValues.prescribedExtrema,
    point: dependencyValues.prescribedPoints,
  }

  for (let type in allPoints) {
    for (let point of allPoints[type]) {
      let x = null, y = null, slope = null;
      if (point.x !== null) {
        x = point.x.evaluate_to_constant();
        if (!Number.isFinite(x)) {
          console.warn(`Ignoring non-numerical ${type}`);
          continue;
        }
      }
      if (point.y !== null) {
        y = point.y.evaluate_to_constant();
        if (!Number.isFinite(y)) {
          console.warn(`Ignoring non-numerical ${type}`);
          continue;
        }
      }
      if (point.slope !== null && point.slope !== undefined) {
        slope = point.slope.evaluate_to_constant();
        if (!Number.isFinite(slope)) {
          console.warn(`Ignoring non-numerical slope`);
          slope = null;
        }
      }
      if (x === null) {
        if (y === null) {
          console.warn(`Ignoring empty ${type}`);
          continue;
        }
        pointsWithoutX.push({
          type: type,
          y: y,
          slope: slope,
        });
      } else {
        pointsWithX.push({
          type: type,
          x: x,
          y: y,
          slope: slope,
        })
      }
    }
  }

  pointsWithX.sort((a, b) => a.x - b.x);
  pointsWithoutX.sort((a, b) => a.y - b.y);

  // don't allow multiple points with same x or very close x
  let xPrev = -Infinity;
  let eps = numerics.eps;
  for (let ind = 0; ind < pointsWithX.length; ind++) {
    let p = pointsWithX[ind];
    if (p.x <= xPrev + eps) {
      console.warn(`Two points with locations too close together.  Can't define function`);
      return { newValues: { interpolationPoints: null } }
    }
    xPrev = p.x;
  }

  let xscale = dependencyValues.xscale;
  let yscale = dependencyValues.yscale;

  xPrev = undefined;
  let yPrev, typePrev;
  let interpolationPoints = [];

  let pNext = pointsWithX[0]
  for (let ind = 0; ind < pointsWithX.length; ind++) {
    let p = pNext;
    pNext = pointsWithX[ind + 1];
    let newPoint = addPointWithX({
      p,
      pNext,
      typePrev,
      xPrev,
      yPrev
    });

    typePrev = newPoint.type;
    xPrev = newPoint.x;
    yPrev = newPoint.y;

  }

  // flag if next point will be first point added
  let firstPoint = false;
  if (pointsWithX.length === 0) {
    firstPoint = true;
  }

  // if points without X remain, keep adding with spacing of 2*xscale
  while (pointsWithoutX.length > 0) {
    // see if can find a point that can be added without any intermediates
    let findMatch;
    if (typePrev === undefined) {
      findMatch = getPointWithoutX({
        allowedTypes: ["maximum", "minimum", "extremum"],
        comparison: 'atLeast',
        value: -Infinity
      })
    } else if (typePrev === "maximum") {
      findMatch = getPointWithoutX({
        allowedTypes: ["minimum", "extremum"],
        comparison: 'atMost',
        value: yPrev - yscale
      })
    } else if (typePrev === "minimum") {
      findMatch = getPointWithoutX({
        allowedTypes: ["maximum", "extremum"],
        comparison: 'atLeast',
        value: yPrev + yscale
      })
    } else if (typePrev === "point") {
      findMatch = getPointWithoutX({
        allowedTypes: ["maximum", "extremum"],
        comparison: 'atLeast',
        value: yPrev + yscale
      });
      if (findMatch.success !== true) {
        findMatch = getPointWithoutX({
          allowedTypes: ["minimum", "extremum"],
          comparison: 'atMost',
          value: yPrev - yscale
        })
      }
    }

    let p;
    if (findMatch.success === true) {
      p = findMatch.point;
      pointsWithoutX.splice(findMatch.ind, 1)
      if (firstPoint) {
        p.x = 0;
        firstPoint = false;
      } else {
        p.x = xPrev + xscale;
      }

    } else {
      p = pointsWithoutX.pop();
      if (firstPoint) {
        p.x = 0;
        firstPoint = false;
      } else {
        // make scale larger, as know will need to add extra point
        p.x = xPrev + 2 * xscale;
      }
    }

    let newPoint = addPointWithX({
      p,
      typePrev,
      xPrev,
      yPrev
    });

    typePrev = newPoint.type;
    xPrev = newPoint.x;
    yPrev = newPoint.y;
  }

  // used all prescribed point
  // now, add points at beginning and end to extrapolate

  // if not points prescribed, create a point through origin
  // which will make f be the constant function 0
  if (interpolationPoints.length === 0) {
    interpolationPoints.push({
      type: "point",
      x: 0,
      y: 0,
      slope: 0,
    })
  }

  firstPoint = interpolationPoints[0];
  if (firstPoint.type === "maximum") {
    // add point before maximum, xscale to left and yscale below
    // and set slope so ends with parabola
    let newPoint = {
      type: "point",
      x: firstPoint.x - xscale,
      y: firstPoint.y - yscale,
      slope: 2 * yscale / xscale,
    };
    interpolationPoints.splice(0, 0, newPoint);

  } else if (firstPoint.type === "minimum") {
    // add point before minimum, xscale to left and yscale above
    // and set slope so ends with parabola
    let newPoint = {
      type: "point",
      x: firstPoint.x - xscale,
      y: firstPoint.y + yscale,
      slope: -2 * yscale / xscale,
    };
    interpolationPoints.splice(0, 0, newPoint);

  } else if (firstPoint.type === "point") {
    if (interpolationPoints.length === 1) {
      // if point is only point and slope isn't defined, set slope to zero
      if (firstPoint.slope === null) {
        firstPoint.slope = 0;
      }
    } else {
      let nextPoint = interpolationPoints[1];
      let secantslope = (nextPoint.y - firstPoint.y) / (nextPoint.x - firstPoint.x);
      if (nextPoint.type === "maximum" || nextPoint.type === "minimum") {
        if (firstPoint.slope === null) {
          // set slope so ends with parabola
          firstPoint.slope = 2 * secantslope;
        }
      } else {
        // two points in a row
        if (interpolationPoints.length === 2) {
          // only two points, make slope for a line if slope isn't determined
          if (firstPoint.slope === null) {
            firstPoint.slope = secantslope;
          }
        } else {
          // if slope of next point isn't defined
          // set next point slope according to monotonic formula
          if (nextPoint.slope === null) {
            nextPoint.slope = monotonicSlope({
              point: nextPoint,
              prevPoint: firstPoint,
              nextPoint: interpolationPoints[2]
            })
          }

          // if firstPoint slope is null
          // fit a quadratic from firstPoint to nextPoint
          // with slope matching that of nextPoint
          // Calculate resulting slope at firstPoint
          if (firstPoint.slope === null) {
            firstPoint.slope = 2 * (firstPoint.y - nextPoint.y) / (firstPoint.x - nextPoint.x)
              - nextPoint.slope
          }
        }

        // add another point in line with slope that extrapolates as a line
        let newPoint = {
          x: firstPoint.x - xscale,
          y: firstPoint.y - xscale * firstPoint.slope,
          slope: firstPoint.slope,
        }
        interpolationPoints.splice(0, 0, newPoint);
        // extapolateLinearBeginning = true;
      }
    }
  }

  let lastPoint = interpolationPoints[interpolationPoints.length - 1];
  if (lastPoint.type === "maximum") {
    // add point after maximum, xscale to right and yscale below
    // and set slope so ends with parabola
    let newPoint = {
      type: "point",
      x: lastPoint.x + xscale,
      y: lastPoint.y - yscale,
      slope: -2 * yscale / xscale,
    };
    interpolationPoints.push(newPoint);

  } else if (lastPoint.type === "minimum") {
    // add point after minimum, xscale to right and yscale above
    // and set slope so ends with parabola
    let newPoint = {
      type: "point",
      x: lastPoint.x + xscale,
      y: lastPoint.y + yscale,
      slope: 2 * yscale / xscale,
    };
    interpolationPoints.push(newPoint);

  } else if (lastPoint.type === "point") {
    if (interpolationPoints.length === 1) {
      // if point is only point
      // add a second point so that get a line
      let newPoint = {
        type: "point",
        x: lastPoint.x + xscale,
        y: lastPoint.y + firstPoint.slope * xscale,
        slope: firstPoint.slope,
      }
      interpolationPoints.push(newPoint);
    } else {
      let prevPoint = interpolationPoints[interpolationPoints.length - 2];
      let secantslope = (prevPoint.y - lastPoint.y) / (prevPoint.x - lastPoint.x);
      if (prevPoint.type === "maximum" || prevPoint.type === "minimum") {
        // if slope not defined
        // set slope so ends with parabola
        if (lastPoint.slope === null) {
          lastPoint.slope = 2 * secantslope;
        }
      } else {
        // two points in a row
        if (interpolationPoints.length === 2) {
          // only two points, make a line if slope not defined
          if (lastPoint.slope === null) {
            lastPoint.slope = secantslope;
          }
        } else {
          // if previous point slope is null
          // set previouse point slope according to monotonic formula
          if (prevPoint.slope === null) {
            prevPoint.slope = monotonicSlope({
              point: prevPoint,
              prevPoint: interpolationPoints[interpolationPoints.length - 3],
              nextPoint: lastPoint
            })
          }
          // if lastPoint slope is null
          // fit a quadratic from prevPoint to lastPoint
          // with slope matching that of prevPoint
          // Calculate resulting slope at lastPoint
          if (lastPoint.slope === null) {
            lastPoint.slope = 2 * (prevPoint.y - lastPoint.y) / (prevPoint.x - lastPoint.x)
              - prevPoint.slope;
          }
        }

        // add another point in line with slope that extrapolates as a line
        let newPoint = {
          x: lastPoint.x + xscale,
          y: lastPoint.y + xscale * lastPoint.slope,
          slope: lastPoint.slope,
        }
        interpolationPoints.push(newPoint);
      }
    }
  }

  // for any interpolation points whose slope are not given
  // use slope from monotonic cubic interpolation 
  for (let ind = 1; ind < interpolationPoints.length - 1; ind++) {
    let point = interpolationPoints[ind];
    if (point.slope === null) {
      point.slope = monotonicSlope({
        point: point,
        prevPoint: interpolationPoints[ind - 1],
        nextPoint: interpolationPoints[ind + 1]
      })
    }
  }

  return { newValues: { interpolationPoints } };

  function monotonicSlope({ point, prevPoint, nextPoint }) {
    // monotonic cubic interpolation formula from
    // Steffens, Astron. Astrophys. 239:443 (1990)

    let dx1 = point.x - prevPoint.x;
    let dx2 = nextPoint.x - point.x;
    let dy1 = point.y - prevPoint.y;
    let dy2 = nextPoint.y - point.y;
    let s1 = dy1 / dx1;
    let s2 = dy2 / dx2;
    let p1 = (s1 * dx2 + s2 * dx1) / (dx1 + dx2);

    let slope = (Math.sign(s1) + Math.sign(s2)) * Math.min(
      Math.abs(s1), Math.abs(s2), 0.5 * Math.abs(p1)
    );

    return slope;

  }

  function addPointWithX({ p, pNext, typePrev, xPrev, yPrev }) {

    let yNext;
    if (pNext !== undefined) {
      yNext = pNext.y;
    }
    if (p.type === "maximum") {
      return addMaximum({
        x: p.x,
        y: p.y,
        typePrev,
        xPrev,
        yPrev,
        yNext,
        pNext,
      });
    }
    else if (p.type === "minimum") {
      return addMinimum({
        x: p.x,
        y: p.y,
        typePrev,
        xPrev,
        yPrev,
        yNext,
        pNext,
      });
    }
    else if (p.type === "extremum") {
      let typeNext;  // used only if there isn't a point before

      if (typePrev === undefined) {
        // nothing followed by extremum
        if (pNext === undefined) {
          // if nothing on either side, treat as a maximum
          return addMaximum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        }
        // set typeNext so following logic can test if this is the first point
        typeNext = pNext.type;

      }

      if (typePrev === "maximum" || typeNext === "maximum") {
        // maximum followed by extremum (or preceeded by in case this is first point)
        if (p.y !== null && p.y > yPrev - yscale) {
          // treat extremum as maximum,
          // as would need two extra points if it were a minimum
          return addMaximum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        } else if (typeNext !== undefined && p.y !== null && p.y > pNext.y - yscale) {
          // case where this is first point
          // treat extremum as maximum,
          // as would need two extra points if it were a minimum
          return addMaximum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        } else {
          // treat extremum as a minimum
          return addMinimum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        }
      } else if (typePrev === "minimum" || typeNext === "minimum") {
        // minimum followed by extremum (or preceeded by in case this is first point)
        if (p.y !== null && p.y < yPrev + yscale) {
          // treat extremum as minimum,
          // as would need two extra points if it were a maximum
          return addMinimum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        } else if (typeNext !== undefined && p.y !== null && p.y > pNext.y + yscale) {
          // case where this is first point
          // treat extremum as minimum,
          // as would need two extra points if it were a maximum
          return addMinimum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        } else {
          return addMaximum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        }
      } else if (typePrev === "point" || typeNext === "point") {
        // point followed by extremum (or preceeded by in case this is first point)
        let treatAs = "maximum";
        if (p.y === null && pNext !== undefined && pNext.type === maximum) {
          treatAs = "minimum";
        }
        else if (p.y !== null && p.y <= yPrev - yscale) {
          treatAs = "minimum";
        } else if (typeNext !== undefined && p.y !== null && p.y >= pNext.y - yscale) {
          treatAs = "minimum";
        }
        if (treatAs === "minimum") {
          return addMinimum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        }
        else {
          return addMaximum({
            x: p.x,
            y: p.y,
            typePrev,
            xPrev,
            yPrev,
            yNext,
            pNext,
          });
        }
      }
    }
    else if (p.type === "point") {
      return addPoint({
        x: p.x,
        y: p.y,
        slope: p.slope,
        typePrev,
        xPrev,
        yPrev,
        yNext,
        pNext,
      });
    }
  }

  function addMaximum({ x, y, typePrev, xPrev, yPrev, yNext, pNext }) {

    if (typePrev === undefined) {
      // nothing followed by maximum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = 0;
        }
        else if (pNext.type === "maximum") {
          y = yNext;
        } else {
          y = yNext + yscale;
        }
      }

    } else if (typePrev === "maximum") {
      // maximum followed by maximum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = yPrev;
        } else if (pNext.type === "maximum") {
          y = Math.max(yPrev, yNext);
        } else {
          y = Math.max(yPrev, yNext + yscale);
        }
      }
      // need to put a minimum betwee'n the two max's
      // with y at least yscale below both
      let yMin = Math.min(yPrev, y) - yscale;
      let xNew = (x + xPrev) / 2;
      let yNew, typeNew, slopeNew;
      // see if can find a min or extremum that didn't have x specified
      let results = getPointWithoutX({
        allowedTypes: ["minimum", "extremum"],
        comparison: 'atMost',
        value: yMin
      });
      if (results.success === true) {
        typeNew = "minimum"; // treat as minimum even if was extremum
        yNew = results.point.y;
        pointsWithoutX.splice(results.ind, 1);
        slopeNew = 0;
      }
      else {
        typeNew = "point";
        yNew = yMin;
      }
      interpolationPoints.push({
        type: typeNew,
        x: xNew,
        y: yNew,
        slope: slopeNew,
      });
    } else if (typePrev === "minimum") {
      // minimum followed by maximum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = yPrev + yscale;
        } else if (pNext.type === "maximum") {
          y = Math.max(yPrev + yscale, yNext);
        } else {
          y = Math.max(yPrev, yNext) + yscale;
        }
      }
      else {
        // have maximum with y defined
        if (y < yPrev + yscale) {
          // minimum followed by a maximum that is lower
          // (or at least not much higher) than the minimum
          // to make both points have neighbors that are sufficiently different
          // add two points between them
          // - the first with height >= yPrev + yscale (to make the minimum obvious)
          // - the second with height <= y - yscale (to make the maximum obvious)
          let xs = [(2 * xPrev + x) / 3, (xPrev + 2 * x) / 3];
          let findValues = [yPrev + yscale, y - yscale];
          let findComparisons = ["atLeast", "atMost"];
          let findTypes = [["maximum", "extremum"], ["minimum", "extremum"]];
          for (let newPointNum = 0; newPointNum < 2; newPointNum++) {
            let xNew = xs[newPointNum];
            let yNew, typeNew, slopeNew;
            // attempt to find an unused point that meets criteria
            let results = getPointWithoutX({
              allowedTypes: findTypes[newPointNum],
              comparison: findComparisons[newPointNum],
              value: findValues[newPointNum],
            });
            if (results.success === true) {
              typeNew = findTypes[newPointNum][0]; // treat as min/max even if was extremum
              yNew = results.point.y;
              pointsWithoutX.splice(results.ind, 1);
              slopeNew = 0;
            }
            else {
              typeNew = "point";
              yNew = findValues[newPointNum];
              slopeNew = null;
            }
            interpolationPoints.push({
              type: typeNew,
              x: xNew,
              y: yNew,
              slope: slopeNew,
            });
          }
        }
      }
    } else if (typePrev === "point") {
      // point followed by maximum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = yPrev + yscale;
        } else if (pNext.type === "maximum") {
          y = Math.max(yPrev + yscale, yNext);
        } else {
          y = Math.max(yPrev, yNext) + yscale;
        }
      }
      else {
        // have maximum with y defined
        if (y < yPrev + yscale) {
          // need to add a point to the left at least as low as y-yscale
          let xNew = (x + xPrev) / 2;
          let yNew, typeNew, slopeNew;
          // see if can find a min or extremum that didn't have x specified
          let results = getPointWithoutX({
            allowedTypes: ["minimum", "extremum"],
            comparison: 'atMost',
            value: y - yscale
          });
          if (results.success === true) {
            typeNew = "minimum"; // treat as minimum even if was extremum
            yNew = results.point.y;
            pointsWithoutX.splice(results.ind, 1);
            slopeNew = 0;
          }
          else {
            typeNew = "point";
            yNew = y - yscale;
          }
          interpolationPoints.push({
            type: typeNew,
            x: xNew,
            y: yNew,
            slope: slopeNew,
          });
        }
      }
    }

    let newMaximum = {
      type: "maximum",
      x: x,
      y: y,
      slope: 0,
    };
    interpolationPoints.push(newMaximum);
    return newMaximum;
  }

  function addMinimum({ x, y, typePrev, xPrev, yPrev, yNext, pNext }) {

    if (typePrev === undefined) {
      // nothing followed by minimum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = 0;
        } else if (pNext.type === "minimum") {
          y = yNext;
        } else {
          y = yNext - yscale;
        }
      }

    } else if (typePrev === "maximum") {
      // maximum followed by minimum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = yPrev - yscale;
        } else if (pNext.type === "minimum") {
          y = Math.min(yPrev - yscale, yNext);
        } else {
          y = Math.min(yPrev, yNext) - yscale;
        }
      }
      else {
        // have minimum with y defined
        if (y > yPrev - yscale) {
          // maximum followed by a minimum that is higher
          // (or at least not much lower) than the maximum
          // to make both points have neighbors that are sufficiently different
          // add two points between them
          // - the first with height <= yPrev - yscale (to make the maximum obvious)
          // - the second with height >= y + yscale (to make the minimum obvious)
          let xs = [(2 * xPrev + x) / 3, (xPrev + 2 * x) / 3];
          let findValues = [yPrev - yscale, y + yscale];
          let findComparisons = ["atMost", "atLeast"];
          let findTypes = [["minimum", "extremum"], ["maximum", "extremum"]];
          for (let newPointNum = 0; newPointNum < 2; newPointNum++) {
            let xNew = xs[newPointNum];
            let yNew, typeNew, slopeNew;
            // attempt to find an unused point that meets criteria
            let results = getPointWithoutX({
              allowedTypes: findTypes[newPointNum],
              comparison: findComparisons[newPointNum],
              value: findValues[newPointNum],
            });
            if (results.success === true) {
              typeNew = findTypes[newPointNum][0]; // treat as min/max even if was extremum
              yNew = results.point.y;
              pointsWithoutX.splice(results.ind, 1);
              slopeNew = 0;
            }
            else {
              typeNew = "point";
              yNew = findValues[newPointNum];
              slopeNew = null;
            }
            interpolationPoints.push({
              type: typeNew,
              x: xNew,
              y: yNew,
              slope: slopeNew,
            });
          }
        }
      }
    } else if (typePrev === "minimum") {
      // minimum followed by minimum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = yPrev;
        } else if (pNext.type === "minimum") {
          y = Math.min(yPrev, yNext);
        } else {
          y = Math.min(yPrev, yNext - yscale);
        }
      }
      // need to put a maximum between the two min's
      // with y at least yscale above both
      let yMax = Math.max(yPrev, y) + yscale;
      let xNew = (x + xPrev) / 2;
      let yNew, typeNew, slopeNew;
      // see if can find a min or extremum that didn't have x specified
      let results = getPointWithoutX({
        allowedTypes: ["maximum", "extremum"],
        comparison: 'atLeast',
        value: yMax
      });
      if (results.success === true) {
        typeNew = "maximum"; // treat as maximum even if was extremum
        yNew = results.point.y;
        pointsWithoutX.splice(results.ind, 1);
        slopeNew = 0;
      }
      else {
        typeNew = "point";
        yNew = yMax;
      }
      interpolationPoints.push({
        type: typeNew,
        x: xNew,
        y: yNew,
        slope: slopeNew,
      });
    } else if (typePrev === "point") {
      // point followed by minimum
      if (y === null) {
        // check if there is a point to the right
        if (yNext === undefined) {
          y = yPrev - yscale;
        } else if (pNext.type === "minimum") {
          y = Math.min(yPrev - yscale, yNext);
        } else {
          y = Math.min(yPrev, yNext) - yscale;
        }
      }
      else {
        // have minimum with y defined
        if (y > yPrev - yscale) {
          // need to add a point to the left at least as high as y+yscale
          let xNew = (x + xPrev) / 2;
          let yNew, typeNew, slopeNew;
          // see if can find a max or extremum that didn't have x specified
          let results = getPointWithoutX({
            allowedTypes: ["maximum", "extremum"],
            comparison: 'atLeast',
            value: y + yscale
          });
          if (results.success === true) {
            typeNew = "maximum"; // treat as maximum even if was extremum
            yNew = results.point.y;
            pointsWithoutX.splice(results.ind, 1);
            slopeNew = 0;
          }
          else {
            typeNew = "point";
            yNew = y + yscale;
          }
          interpolationPoints.push({
            type: typeNew,
            x: xNew,
            y: yNew,
            slope: slopeNew,
          });
        }
      }
    }

    let newMinimum = {
      type: "minimum",
      x: x,
      y: y,
      slope: 0,
    };
    interpolationPoints.push(newMinimum);
    return newMinimum;
  }

  function addPoint({ x, y, slope, typePrev, xPrev, yPrev, yNext, pNext }) {

    if (typePrev === "maximum") {
      // maximum followed by point

      if (y > yPrev - yscale) {
        // point is too high to make previous maximum sufficiently different
        // Either
        // - find a minimum or extremum with height below min(y,yPrev)-yscale, or
        // - add a point with height yPrev-yscale

        let yMin = Math.min(yPrev, y) - yscale;
        let xNew = (x + xPrev) / 2;
        let yNew, typeNew, slopeNew;
        // see if can find a min or extremum that didn't have x specified
        let results = getPointWithoutX({
          allowedTypes: ["minimum", "extremum"],
          comparison: 'atMost',
          value: yMin
        });
        if (results.success === true) {
          typeNew = "minimum"; // treat as minimum even if was extremum
          yNew = results.point.y;
          pointsWithoutX.splice(results.ind, 1);
          slopeNew = 0;
        }
        else {
          typeNew = "point";
          yNew = yPrev - yscale;
        }
        interpolationPoints.push({
          type: typeNew,
          x: xNew,
          y: yNew,
          slope: slopeNew,
        });
      }
    } else if (typePrev === "minimum") {
      // minimum followed by point
      if (y < yPrev + yscale) {
        // point is too low to make previous minimum sufficiently different
        // Either
        // - find a maximum or extremum with height above min(y,yPrev)+yscale, or
        // - add a point with height yPrev+yscale

        let yMax = Math.max(yPrev, y) + yscale;
        let xNew = (x + xPrev) / 2;
        let yNew, typeNew, slopeNew;
        // see if can find a max or extremum that didn't have x specified
        let results = getPointWithoutX({
          allowedTypes: ["maximum", "extremum"],
          comparison: 'atLeast',
          value: yMax
        });
        if (results.success === true) {
          typeNew = "maximum"; // treat as maximum even if was extremum
          yNew = results.point.y;
          pointsWithoutX.splice(results.ind, 1);
          slopeNew = 0;
        }
        else {
          typeNew = "point";
          yNew = yPrev + yscale;
        }
        interpolationPoints.push({
          type: typeNew,
          x: xNew,
          y: yNew,
          slope: slopeNew,
        });
      }
    }

    let newPoint = {
      type: "point",
      x: x,
      y: y,
      slope: slope,
    };
    interpolationPoints.push(newPoint);
    return newPoint;
  }

  function getPointWithoutX({ allowedTypes, comparison, value }) {
    // try to find a function in pointsWithoutX of allowed type
    // whose y value fits the criterion specified by comparison and value
    // comparison must be either "atMost" or "atLeast"

    // since pointsWithoutMax are sort in increasing y value
    // search in reverse order if comparison is atMost
    // that way, find the point that is closest to the criterion
    let inds = [];
    if (comparison === "atMost") {
      inds = Object.keys(pointsWithoutX).reverse();
    } else if (comparison === "atLeast") {
      inds = Object.keys(pointsWithoutX);
    } else {
      return { success: false }
    }

    // prefer first allowed types, so search them in order
    for (let type of allowedTypes) {
      for (let ind of inds) {
        let p = pointsWithoutX[ind];

        if (p.type !== type) {
          continue;
        }

        if (comparison === "atMost") {
          if (p.y <= value) {
            return {
              success: true,
              ind: ind,
              point: p
            }
          }
        } else {
          if (p.y >= value) {
            return {
              success: true,
              ind: ind,
              point: p
            }
          }
        }
      }
    }
    return { success: false };
  }
}

function computeSplineParamCoeffs({ dependencyValues }) {

  // Compute coefficients for a cubic polynomial
  //   p(s) = c0 + c1*s + c2*s^2 + c3*s^3
  // such that
  //   p(0) = x1, p(s2) = x2
  // and
  //   p'(0) = t1, p'(s2) = t2
  let initCubicPoly = function (x1, x2, t1, t2, s2) {
    return [
      x1,
      t1,
      (-3 * x1 / s2 + 3 * x2 / s2 - 2 * t1 - t2) / s2,
      (2 * x1 / s2 - 2 * x2 / s2 + t1 + t2) / (s2 * s2)
    ];
  }

  let interpolationPoints = dependencyValues.interpolationPoints;


  let coeffs = [];
  let xs = [];

  let p0;
  let p1 = interpolationPoints[0];
  xs.push(p1.x);
  for (let ind = 1; ind < interpolationPoints.length; ind++) {
    p0 = p1;
    p1 = interpolationPoints[ind];
    let c = initCubicPoly(
      p0.y,
      p1.y,
      p0.slope,
      p1.slope,
      p1.x - p0.x
    );

    // if nearly have quadratic or linear, except for roundoff error,
    // make exactly quadratic or linear
    if (Math.abs(c[3]) < 1E-14 * Math.max(Math.abs(c[0]), Math.abs(c[1]), Math.abs(c[2]))) {
      c[3] = 0;
      if (Math.abs(c[2]) < 1E-14 * Math.max(Math.abs(c[0]), Math.abs(c[1]))) {
        c[2] = 0;
      }
    }
    coeffs.push(c);

    xs.push(p1.x);


  }

  return {
    newValues: {
      xs, coeffs
    }
  }

}
