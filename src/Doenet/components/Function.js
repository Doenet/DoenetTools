import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export default class Function extends InlineComponent {
  static componentType = "function";
  static rendererType = undefined;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.variable = { default: me.fromAst("x"), propagateToDescendants: true };
    properties.xscale = { default: 1, propagateToDescendants: true };
    properties.yscale = { default: 1, propagateToDescendants: true };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let addFormula = function ({ activeChildrenMatched }) {
      // add <formula> around math
      let formulaChildren = [];
      for (let child of activeChildrenMatched) {
        formulaChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "formula", children: formulaChildren }],
      }
    }

    let atLeastOneStrings = childLogic.newLeaf({
      name: "atLeastOneStrings",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
    });
    let atLeastOneMaths = childLogic.newLeaf({
      name: "atLeastOneMaths",
      componentType: 'math',
      comparison: 'atLeast',
      number: 1,
    });
    let stringsAndMaths = childLogic.newOperator({
      name: "stringsAndMaths",
      operator: 'or',
      propositions: [atLeastOneStrings, atLeastOneMaths],
      requireConsecutive: true,
      isSugar: true,
      affectedBySugar: ["exactlyOneFormula"],
      replacementFunction: addFormula,
    });

    let exactlyOneFormula = childLogic.newLeaf({
      name: "exactlyOneFormula",
      componentType: "formula",
      number: 1,
    })



    let addInterpolatedFunction = function ({ activeChildrenMatched }) {
      // add <interpolatedfunction> around criteria
      let children = [];
      for (let child of activeChildrenMatched) {
        children.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "interpolatedfunction" }],
      }
    }

    let atLeastOneMaximum = childLogic.newLeaf({
      name: "atLeastOneMaximum",
      componentType: "maximum",
      comparison: 'atLeast',
      number: 1,
    })

    let atLeastOneMinimum = childLogic.newLeaf({
      name: "atLeastOneMinimum",
      componentType: "minimum",
      comparison: 'atLeast',
      number: 1,
    })

    let atLeastOneExtremum = childLogic.newLeaf({
      name: "atLeastOneExtremum",
      componentType: "extremum",
      comparison: 'atLeast',
      number: 1,
    })

    let atLeastOneThrough = childLogic.newLeaf({
      name: "atLeastOneThrough",
      componentType: "through",
      comparison: 'atLeast',
      number: 1,
    })

    let throughCriteria = childLogic.newOperator({
      name: "throughCriteria",
      operator: "or",
      propositions: [atLeastOneMaximum, atLeastOneMinimum, atLeastOneExtremum, atLeastOneThrough],
      isSugar: true,
      affectedBySugar: ["atMostOneFunction"],
      replacementFunction: addInterpolatedFunction,
    })

    let atMostOneFunction = childLogic.newLeaf({
      name: "atMostOneFunction",
      componentType: "function",
      comparison: 'atMost',
      number: 1,
    })

    childLogic.newOperator({
      name: "FormulaCriteriaXorSugar",
      operator: 'xor',
      propositions: [exactlyOneFormula, throughCriteria, stringsAndMaths, atMostOneFunction],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

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

    stateVariableDefinitions.formula = {
      public: true,
      componentType: "formula",
      defaultValue: me.fromAst(0),
      returnDependencies: () => ({
        formulaChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneFormula",
          variableNames: ["value"]
        },
        functionChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneFunction",
          variableNames: ["formula"],
        }
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.formulaChild.length === 1) {

          return {
            newValues: {
              formula: dependencyValues.formulaChild[0].stateValues.value
            }
          }
        } else if (dependencyValues.functionChild.length === 1) {

          return {
            newValues: {
              formula: dependencyValues.functionChild[0].stateValues.formula
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: {
              formula: { variablesToCheck: ["formula"] }
            }
          }
        }
      }

    }

    stateVariableDefinitions.f = {
      returnDependencies: () => ({
        formula: {
          dependencyType: "stateVariable",
          variableName: "formula",
        },
        variable: {
          dependencyType: "stateVariable",
          variableName: "variable"
        },
        functionChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneFunction",
          variableNames: ["f"],
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.functionChild.length === 1) {
          return {
            newValues: {
              f: dependencyValues.functionChild[0].stateValues.f
            }
          }
        } else {
          let formula = dependencyValues.formula;
          let varString = dependencyValues.variable.tree;
          return {
            newValues: {
              f: (x) => formula.substitute({ [varString]: x })
            }
          }

        }
      }
    }


    stateVariableDefinitions.numericalf = {
      returnDependencies: () => ({
        formula: {
          dependencyType: "stateVariable",
          variableName: "formula",
        },
        variable: {
          dependencyType: "stateVariable",
          variableName: "variable"
        },
        functionChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneFunction",
          variableNames: ["numericalf"],
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.functionChild.length === 1) {
          return {
            newValues: {
              numericalf: dependencyValues.functionChild[0].stateValues.numericalf
            }
          }
        } else {
          let formula_f = dependencyValues.formula.f();
          let varString = dependencyValues.variable.tree;
          return {
            newValues: {
              numericalf: function (x) {
                try {
                  return formula_f({ [varString]: x });
                } catch (e) {
                  return NaN;
                }
              }
            }
          }

        }
      }
    }

    stateVariableDefinitions.minima = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["minimum"],
      returnDependencies: function ({ arrayKeys }) {
        let dependencies = {
          numericalf: {
            dependencyType: "stateVariable",
            variableName: "numericalf",
          },
          xscale: {
            dependencyType: "stateVariable",
            variableName: "xscale"
          },
        }

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
          dependencies.functionChild = {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneFunction",
            variableNames: ["minima"],
          }
        } else {
          dependencies.functionChild = {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneFunction",
            variableNames: ["minimum" + (arrayKey + 1)],
          }
        }

        return dependencies;

      },
      markStale: function ({ freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (changes.functionChild) {

          if (changes.functionChild.componentIdentitiesChanged) {

            // if functionChild changed, everything is stale
            for (let key in freshByKey) {
              delete freshByKey[key];
            }

            return { fresh: false }

          } else {

            let valuesChanged = changes.functionChild.valuesChanged[0];

            if (arrayKey === undefined) {

              if (valuesChanged.minima) {
                // just check if any of the minima
                // are no longer fresh
                let newFreshByKey = valuesChanged.minima.freshnessInfo.freshByKey;
                for (let key in freshByKey) {
                  if (!newFreshByKey[key]) {
                    delete freshByKey[key];
                  }
                }
              }
            } else {
              if (valuesChanged["minimum" + (arrayKey + 1)]) {
                delete freshByKey[arrayKey];
              }
            }
          }
        }

        if (changes.numericalf || changes.xscale) {
          // everything is stale
          let freshByKey = freshnessInfo.freshByKey
          for (let key in freshByKey) {
            delete freshByKey[key];
          }
          return { fresh: false }
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
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys }) {

        let freshByKey = freshnessInfo.freshByKey;

        if (dependencyValues.functionChild.length === 1) {

          // need arrayKey only if have function child
          let arrayKey;
          if (arrayKeys) {
            arrayKey = Number(arrayKeys[0]);
          }

          if (arrayKey === undefined) {
            let functionChildMinima = dependencyValues.functionChild[0].stateValues.minima;

            if (Object.keys(freshByKey).length === 0) {
              for (let key in functionChildMinima) {
                freshByKey[key] = true;
              }
              return {
                newValues: {
                  minima: functionChildMinima
                }
              }
            } else {
              let minima = {};
              for (let key in functionChildMinima) {
                if (!freshByKey[key]) {
                  minima[key] = functionChildMinima[key];
                  freshByKey[key] = true;
                }
              }
              return { newValues: { minima } }
            }

          } else {

            // an arrayKey was specified

            if (freshByKey[arrayKey]) {
              // since is array, don't need to indicate noChanges
              return {};
            }

            freshByKey[arrayKey] = true;

            return {
              newValues: {
                minima: {
                  [arrayKey]: dependencyValues.functionChild[0].stateValues['minimum' + (arrayKey + 1)]
                }
              }
            }
          }
        }

        // no function child

        // freshByKey is all or nothing
        // so if it contains anything, then everything is fresh
        if (Object.keys(freshByKey).length > 0) {
          // since is array, don't need to indicate noChanges
          return {}
        }

        let f = dependencyValues.numericalf;

        // for now, look for minima in interval -100*xscale to 100*xscale
        // dividing interval into 1000 subintervals
        let minx = -100 * dependencyValues.xscale;
        let maxx = 100 * dependencyValues.xscale;
        let nIntervals = 1000;
        let dx = (maxx - minx) / nIntervals;

        let minimaList = [];
        let minimumAtPreviousRight = false;
        let fright = f(minx);
        for (let i = 0; i < nIntervals; i++) {
          let xleft = minx + i * dx;
          let xright = minx + (i + 1) * dx;
          let fleft = fright;
          fright = f(xright);

          if (Number.isNaN(fleft) || Number.isNaN(fright)) {
            continue;
          }

          let result = numerics.fminbr(f, [xleft, xright]);
          if (result.success !== true) {
            continue;
          }
          let x = result.x;
          let fx = result.fx;

          if (fleft < fx) {
            if (minimumAtPreviousRight) {
              if (Number.isFinite(fleft)) {
                minimaList.push(me.fromAst(["tuple", xleft, fleft]));
              }
            }
            minimumAtPreviousRight = false;
          } else if (fright < fx) {
            minimumAtPreviousRight = true;
          } else {
            minimumAtPreviousRight = false;

            // make sure it actually looks like a strict minimum of f(x)
            if (fx < fright && fx < fleft &&
              fx < f(x + result.tol) && fx < f(x - result.tol) &&
              Number.isFinite(fx)) {
              minimaList.push(me.fromAst(["tuple", x, fx]));
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

    stateVariableDefinitions.minimaLocations = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["minimumLocation"],
      returnDependencies: function ({ arrayKeys }) {
        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKeys === undefined) {
          return {
            minima: {
              dependencyType: "stateVariable",
              variableName: "minima",
            },
          }
        } else {
          return {
            ["minimum" + (arrayKey + 1)]: {
              dependencyType: "stateVariable",
              variableName: "minimum" + (arrayKey + 1),
            },
          }
        }

      },
      markStale: function ({ freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.freshByKey;

        if (arrayKey === undefined) {
          if (changes.minima) {
            // just check if any of the minima
            // are no longer fresh
            let newFreshByKey = changes.minima.valuesChanged.minima.freshnessInfo.freshByKey;
            for (let key in freshByKey) {
              if (!newFreshByKey[key]) {
                delete freshByKey[key];
              }
            }
          }

          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: false }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: true }
          }

        } else {
          if (valuesChanged["minimum" + (arrayKey + 1)]) {
            delete freshByKey[arrayKey];
          }
          return { fresh: freshByKey[arrayKey] === true }

        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.freshByKey;


        if (arrayKey === undefined) {

          if (Object.keys(freshByKey).length === 0) {

            let minimaLocations = dependencyValues.minima.map(x => x.get_component(0));

            // mark everything fresh
            for (let key in minimaLocations) {
              freshByKey[key] = true;
            }

            return { newValues: { minimaLocations } }

          } else {

            let minimaLocations = {}
            for (let key in dependencyValues.minima) {
              if (!freshByKey[key]) {
                freshByKey[key] = true;
                minimaLocations[key] = dependencyValues.minima[key].get_component(0);
              }
            }
            return { newValues: { minimaLocations } }

          }

        } else {
          // have specific arrayKey specified

          if (freshByKey[arrayKey]) {
            return {};
          } else {
            freshByKey[arrayKey] = true;
            return {
              newValues: {
                minimaLocations: {
                  [arrayKey]: dependencyValues["minimum" + (arrayKey + 1)].get_component(0)
                }
              }
            }
          }


        }

      }
    }

    stateVariableDefinitions.minimaValues = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["minimumValue"],
      returnDependencies: function ({ arrayKeys }) {
        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKeys === undefined) {
          return {
            minima: {
              dependencyType: "stateVariable",
              variableName: "minima",
            },
          }
        } else {
          return {
            ["minimum" + (arrayKey + 1)]: {
              dependencyType: "stateVariable",
              variableName: "minimum" + (arrayKey + 1),
            },
          }
        }
      },
      markStale: function ({ freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.freshByKey;

        if (arrayKey === undefined) {
          if (changes.minima) {
            // just check if any of the minima
            // are no longer fresh
            let newFreshByKey = changes.minima.valuesChanged.minima.freshnessInfo.freshByKey;
            for (let key in freshByKey) {
              if (!newFreshByKey[key]) {
                delete freshByKey[key];
              }
            }
          }

          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: false }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: true }
          }

        } else {
          if (valuesChanged["minimum" + (arrayKey + 1)]) {
            delete freshByKey[arrayKey];
          }
          return { fresh: freshByKey[arrayKey] === true }

        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.freshByKey;


        if (arrayKey === undefined) {

          if (Object.keys(freshByKey).length === 0) {

            let minimaValues = dependencyValues.minima.map(x => x.get_component(1));

            // mark everything fresh
            for (let key in minimaValues) {
              freshByKey[key] = true;
            }

            return { newValues: { minimaValues } }

          } else {

            let minimaValues = {}
            for (let key in dependencyValues.minima) {
              if (!freshByKey[key]) {
                freshByKey[key] = true;
                minimaValues[key] = dependencyValues.minima[key].get_component(1);
              }
            }
            return { newValues: { minimaValues } }

          }

        } else {
          // have specific arrayKey specified

          if (freshByKey[arrayKey]) {
            return {};
          } else {
            freshByKey[arrayKey] = true;
            return {
              newValues: {
                minimaValues: {
                  [arrayKey]: dependencyValues["minimum" + (arrayKey + 1)].get_component(1)
                }
              }
            }
          }


        }

      }
    }


    stateVariableDefinitions.maxima = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["maximum"],
      returnDependencies: function ({ arrayKeys }) {
        let dependencies = {
          numericalf: {
            dependencyType: "stateVariable",
            variableName: "numericalf",
          },
          xscale: {
            dependencyType: "stateVariable",
            variableName: "xscale"
          },
        }

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
          dependencies.functionChild = {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneFunction",
            variableNames: ["maxima"],
          }
        } else {
          dependencies.functionChild = {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneFunction",
            variableNames: ["maximum" + (arrayKey + 1)],
          }
        }

        return dependencies;

      },
      markStale: function ({ freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (changes.functionChild) {

          if (changes.functionChild.componentIdentitiesChanged) {

            // if functionChild changed, everything is stale
            for (let key in freshByKey) {
              delete freshByKey[key];
            }

            return { fresh: false }

          } else {

            let valuesChanged = changes.functionChild.valuesChanged[0];

            if (arrayKey === undefined) {

              if (valuesChanged.maxima) {
                // just check if any of the maxima
                // are no longer fresh
                let newFreshByKey = valuesChanged.maxima.freshnessInfo.freshByKey;
                for (let key in freshByKey) {
                  if (!newFreshByKey[key]) {
                    delete freshByKey[key];
                  }
                }
              }
            } else {
              if (valuesChanged["maximum" + (arrayKey + 1)]) {
                delete freshByKey[arrayKey];
              }
            }
          }
        }

        if (changes.numericalf || changes.xscale) {
          // everything is stale
          let freshByKey = freshnessInfo.freshByKey
          for (let key in freshByKey) {
            delete freshByKey[key];
          }
          return { fresh: false }
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
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys }) {

        let freshByKey = freshnessInfo.freshByKey;

        if (dependencyValues.functionChild.length === 1) {

          // need arrayKey only if have function child
          let arrayKey;
          if (arrayKeys) {
            arrayKey = Number(arrayKeys[0]);
          }

          if (arrayKey === undefined) {
            let functionChildMaxima = dependencyValues.functionChild[0].stateValues.maxima;

            if (Object.keys(freshByKey).length === 0) {
              for (let key in functionChildMaxima) {
                freshByKey[key] = true;
              }
              return {
                newValues: {
                  maxima: functionChildMaxima
                }
              }
            } else {
              let maxima = {};
              for (let key in functionChildMaxima) {
                if (!freshByKey[key]) {
                  maxima[key] = functionChildMaxima[key];
                  freshByKey[key] = true;
                }
              }
              return { newValues: { maxima } }
            }

          } else {

            // an arrayKey was specified

            if (freshByKey[arrayKey]) {
              // since is array, don't need to indicate noChanges
              return {};
            }

            freshByKey[arrayKey] = true;

            return {
              newValues: {
                maxima: {
                  [arrayKey]: dependencyValues.functionChild[0].stateValues['maximum' + (arrayKey + 1)]
                }
              }
            }
          }
        }

        // no function child

        // freshByKey is all or nothing
        // so if it contains anything, then everything is fresh
        if (Object.keys(freshByKey).length > 0) {
          // since is array, don't need to indicate noChanges
          return {}
        }

        let f = (x) => -dependencyValues.numericalf(x);

        // for now, look for maxima in interval -100*xscale to 100*xscale
        // dividing interval into 1000 subintervals
        let minx = -100 * dependencyValues.xscale;
        let maxx = 100 * dependencyValues.xscale;
        let nIntervals = 1000;
        let dx = (maxx - minx) / nIntervals;

        let maximaList = [];
        let maximumAtPreviousRight = false;
        let fright = f(minx);
        for (let i = 0; i < nIntervals; i++) {
          let xleft = minx + i * dx;
          let xright = minx + (i + 1) * dx;
          let fleft = fright;
          fright = f(xright);

          if (Number.isNaN(fleft) || Number.isNaN(fright)) {
            continue;
          }

          let result = numerics.fminbr(f, [xleft, xright]);
          if (result.success !== true) {
            continue;
          }
          let x = result.x;
          let fx = result.fx;

          if (fleft < fx) {
            if (maximumAtPreviousRight) {
              if (Number.isFinite(fleft)) {
                maximaList.push(me.fromAst(["tuple", xleft, fleft]));
              }
            }
            maximumAtPreviousRight = false;
          } else if (fright < fx) {
            maximumAtPreviousRight = true;
          } else {
            maximumAtPreviousRight = false;

            // make sure it actually looks like a strict maximum of f(x)
            if (fx < fright && fx < fleft &&
              fx < f(x + result.tol) && fx < f(x - result.tol) &&
              Number.isFinite(fx)) {
              maximaList.push(me.fromAst(["tuple", x, -fx]));
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

    stateVariableDefinitions.maximaLocations = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["maximumLocation"],
      returnDependencies: function ({ arrayKeys }) {
        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKeys === undefined) {
          return {
            maxima: {
              dependencyType: "stateVariable",
              variableName: "maxima",
            },
          }
        } else {
          return {
            ["maximum" + (arrayKey + 1)]: {
              dependencyType: "stateVariable",
              variableName: "maximum" + (arrayKey + 1),
            },
          }
        }

      },
      markStale: function ({ freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.freshByKey;

        if (arrayKey === undefined) {
          if (changes.maxima) {
            // just check if any of the maxima
            // are no longer fresh
            let newFreshByKey = changes.maxima.valuesChanged.maxima.freshnessInfo.freshByKey;
            for (let key in freshByKey) {
              if (!newFreshByKey[key]) {
                delete freshByKey[key];
              }
            }
          }

          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: false }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: true }
          }

        } else {
          if (valuesChanged["maximum" + (arrayKey + 1)]) {
            delete freshByKey[arrayKey];
          }
          return { fresh: freshByKey[arrayKey] === true }

        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.freshByKey;


        if (arrayKey === undefined) {

          if (Object.keys(freshByKey).length === 0) {

            let maximaLocations = dependencyValues.maxima.map(x => x.get_component(0));

            // mark everything fresh
            for (let key in maximaLocations) {
              freshByKey[key] = true;
            }

            return { newValues: { maximaLocations } }

          } else {

            let maximaLocations = {}
            for (let key in dependencyValues.maxima) {
              if (!freshByKey[key]) {
                freshByKey[key] = true;
                maximaLocations[key] = dependencyValues.maxima[key].get_component(0);
              }
            }
            return { newValues: { maximaLocations } }

          }

        } else {
          // have specific arrayKey specified

          if (freshByKey[arrayKey]) {
            return {};
          } else {
            freshByKey[arrayKey] = true;
            return {
              newValues: {
                maximaLocations: {
                  [arrayKey]: dependencyValues["maximum" + (arrayKey + 1)].get_component(0)
                }
              }
            }
          }


        }

      }
    }

    stateVariableDefinitions.maximaValues = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["maximumValue"],
      returnDependencies: function ({ arrayKeys }) {
        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKeys === undefined) {
          return {
            maxima: {
              dependencyType: "stateVariable",
              variableName: "maxima",
            },
          }
        } else {
          return {
            ["maximum" + (arrayKey + 1)]: {
              dependencyType: "stateVariable",
              variableName: "maximum" + (arrayKey + 1),
            },
          }
        }
      },
      markStale: function ({ freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.freshByKey;

        if (arrayKey === undefined) {
          if (changes.maxima) {
            // just check if any of the maxima
            // are no longer fresh
            let newFreshByKey = changes.maxima.valuesChanged.maxima.freshnessInfo.freshByKey;
            for (let key in freshByKey) {
              if (!newFreshByKey[key]) {
                delete freshByKey[key];
              }
            }
          }

          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: false }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: true }
          }

        } else {
          if (valuesChanged["maximum" + (arrayKey + 1)]) {
            delete freshByKey[arrayKey];
          }
          return { fresh: freshByKey[arrayKey] === true }

        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.freshByKey;


        if (arrayKey === undefined) {

          if (Object.keys(freshByKey).length === 0) {

            let maximaValues = dependencyValues.maxima.map(x => x.get_component(1));

            // mark everything fresh
            for (let key in maximaValues) {
              freshByKey[key] = true;
            }

            return { newValues: { maximaValues } }

          } else {

            let maximaValues = {}
            for (let key in dependencyValues.maxima) {
              if (!freshByKey[key]) {
                freshByKey[key] = true;
                maximaValues[key] = dependencyValues.maxima[key].get_component(1);
              }
            }
            return { newValues: { maximaValues } }

          }

        } else {
          // have specific arrayKey specified

          if (freshByKey[arrayKey]) {
            return {};
          } else {
            freshByKey[arrayKey] = true;
            return {
              newValues: {
                maximaValues: {
                  [arrayKey]: dependencyValues["maximum" + (arrayKey + 1)].get_component(1)
                }
              }
            }
          }


        }

      }
    }

    // we make function child be a state variable
    // as we need a state variable to determine other dependencies
    // using stateVariablesDeterminingDependencies
    stateVariableDefinitions.functionChild = {
      returnDependencies: () => ({
        functionChild: {
          dependencyType: "childIdentity",
          childLogicName: "atMostOneFunction"
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.functionChild.length === 1) {
          return { newValues: { functionChild: dependencyValues.functionChild[0] } }
        } else {
          return { newValues: { functionChild: null } }
        }
      }
    }



    stateVariableDefinitions.extrema = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["extremum"],
      stateVariablesDeterminingDependencies: ["functionChild"],
      returnDependencies: function ({ arrayKeys, stateValues }) {
        if (stateValues.functionChild === null) {
          // since algorithm for extrema in regular function class
          // requires all minima and maxima
          // ignore arrayKey if there is no function child overriding

          return {
            minima: {
              dependencyType: "stateVariable",
              variableName: "minima"
            },
            maxima: {
              dependencyType: "stateVariable",
              variableName: "maxima"
            }
          }
        } else {

          // if have function child, it's possible that function child
          // has more refined dependencies based on arrayKey
          // so we adjust based on arrayKey in this case
          let arrayKey;
          if (arrayKeys) {
            arrayKey = Number(arrayKeys[0]);
          }

          if (arrayKey === undefined) {
            return {
              functionChild: {
                dependencyType: "childStateVariables",
                childLogicName: "atMostOneFunction",
                variableNames: ["extrema"],
              },
            }
          } else {
            return {
              functionChild: {
                dependencyType: "childStateVariables",
                childLogicName: "atMostOneFunction",
                variableNames: ["extremum" + (arrayKey + 1)],
              },
            }
          }
        }

      },
      markStale: function ({ freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (changes.functionChild) {

          if (changes.functionChild.componentIdentitiesChanged) {

            // if functionChild changed, everything is stale
            for (let key in freshByKey) {
              delete freshByKey[key];
            }

            return { fresh: false }

          } else {

            let valuesChanged = changes.functionChild.valuesChanged[0];

            if (arrayKey === undefined) {

              if (valuesChanged.extrema) {
                // just check if any of the extrema
                // are no longer fresh
                let newFreshByKey = valuesChanged.extrema.freshnessInfo.freshByKey;
                for (let key in freshByKey) {
                  if (!newFreshByKey[key]) {
                    delete freshByKey[key];
                  }
                }
              }
            } else {
              if (valuesChanged["extremum" + (arrayKey + 1)]) {
                delete freshByKey[arrayKey];
              }
            }
          }
        }

        if (changes.minima || changes.maxima) {
          // everything is stale
          let freshByKey = freshnessInfo.freshByKey
          for (let key in freshByKey) {
            delete freshByKey[key];
          }
          return { fresh: false }
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
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys }) {

        let freshByKey = freshnessInfo.freshByKey;

        // for extream functionChild dependency only if it is length 1
        if (dependencyValues.functionChild) {

          // need arrayKey only if have function child
          let arrayKey;
          if (arrayKeys) {
            arrayKey = Number(arrayKeys[0]);
          }

          if (arrayKey === undefined) {
            let functionChildExtrema = dependencyValues.functionChild[0].stateValues.extrema;

            if (Object.keys(freshByKey).length === 0) {
              for (let key in functionChildExtrema) {
                freshByKey[key] = true;
              }
              return {
                newValues: {
                  extrema: functionChildExtrema
                }
              }
            } else {
              let extrema = {};
              for (let key in functionChildExtrema) {
                if (!freshByKey[key]) {
                  extrema[key] = functionChildExtrema[key];
                  freshByKey[key] = true;
                }
              }
              return { newValues: { extrema } }
            }

          } else {

            // an arrayKey was specified

            if (freshByKey[arrayKey]) {
              // since is array, don't need to indicate noChanges
              return {};
            }

            freshByKey[arrayKey] = true;

            return {
              newValues: {
                extrema: {
                  [arrayKey]: dependencyValues.functionChild[0].stateValues['extremum' + (arrayKey + 1)]
                }
              }
            }
          }
        }

        // no function child

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

    stateVariableDefinitions.extremaLocations = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["extremumLocation"],
      returnDependencies: function ({ arrayKeys }) {
        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKeys === undefined) {
          return {
            extrema: {
              dependencyType: "stateVariable",
              variableName: "extrema",
            },
          }
        } else {
          return {
            ["extremum" + (arrayKey + 1)]: {
              dependencyType: "stateVariable",
              variableName: "extremum" + (arrayKey + 1),
            },
          }
        }

      },
      markStale: function ({ freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.freshByKey;

        if (arrayKey === undefined) {
          if (changes.extrema) {
            // just check if any of the extrema
            // are no longer fresh
            let newFreshByKey = changes.extrema.valuesChanged.extrema.freshnessInfo.freshByKey;
            for (let key in freshByKey) {
              if (!newFreshByKey[key]) {
                delete freshByKey[key];
              }
            }
          }

          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: false }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: true }
          }

        } else {
          if (valuesChanged["extremum" + (arrayKey + 1)]) {
            delete freshByKey[arrayKey];
          }
          return { fresh: freshByKey[arrayKey] === true }

        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.freshByKey;


        if (arrayKey === undefined) {

          if (Object.keys(freshByKey).length === 0) {

            let extremaLocations = dependencyValues.extrema.map(x => x.get_component(0));

            // mark everything fresh
            for (let key in extremaLocations) {
              freshByKey[key] = true;
            }

            return { newValues: { extremaLocations } }

          } else {

            let extremaLocations = {}
            for (let key in dependencyValues.extrema) {
              if (!freshByKey[key]) {
                freshByKey[key] = true;
                extremaLocations[key] = dependencyValues.extrema[key].get_component(0);
              }
            }
            return { newValues: { extremaLocations } }

          }

        } else {
          // have specific arrayKey specified

          if (freshByKey[arrayKey]) {
            return {};
          } else {
            freshByKey[arrayKey] = true;
            return {
              newValues: {
                extremaLocations: {
                  [arrayKey]: dependencyValues["extremum" + (arrayKey + 1)].get_component(0)
                }
              }
            }
          }


        }

      }
    }

    stateVariableDefinitions.extremaValues = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["extremumValue"],
      returnDependencies: function ({ arrayKeys }) {
        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKeys === undefined) {
          return {
            extrema: {
              dependencyType: "stateVariable",
              variableName: "extrema",
            },
          }
        } else {
          return {
            ["extremum" + (arrayKey + 1)]: {
              dependencyType: "stateVariable",
              variableName: "extremum" + (arrayKey + 1),
            },
          }
        }
      },
      markStale: function ({ freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.freshByKey;

        if (arrayKey === undefined) {
          if (changes.extrema) {
            // just check if any of the extrema
            // are no longer fresh
            let newFreshByKey = changes.extrema.valuesChanged.extrema.freshnessInfo.freshByKey;
            for (let key in freshByKey) {
              if (!newFreshByKey[key]) {
                delete freshByKey[key];
              }
            }
          }

          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: false }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: true }
          }

        } else {
          if (valuesChanged["extremum" + (arrayKey + 1)]) {
            delete freshByKey[arrayKey];
          }
          return { fresh: freshByKey[arrayKey] === true }

        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.freshByKey;


        if (arrayKey === undefined) {

          if (Object.keys(freshByKey).length === 0) {

            let extremaValues = dependencyValues.extrema.map(x => x.get_component(1));

            // mark everything fresh
            for (let key in extremaValues) {
              freshByKey[key] = true;
            }

            return { newValues: { extremaValues } }

          } else {

            let extremaValues = {}
            for (let key in dependencyValues.extrema) {
              if (!freshByKey[key]) {
                freshByKey[key] = true;
                extremaValues[key] = dependencyValues.extrema[key].get_component(1);
              }
            }
            return { newValues: { extremaValues } }

          }

        } else {
          // have specific arrayKey specified

          if (freshByKey[arrayKey]) {
            return {};
          } else {
            freshByKey[arrayKey] = true;
            return {
              newValues: {
                extremaValues: {
                  [arrayKey]: dependencyValues["extremum" + (arrayKey + 1)].get_component(1)
                }
              }
            }
          }


        }

      }
    }

    return stateVariableDefinitions;

  }

  updateStateOld(args = {}) {
    if (args.init === true) {


      this.makePublicStateVariableArray({
        variableName: "minima",
        componentType: "point",
        stateVariableForRef: "coords",
        additionalProperties: { draggable: false },
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "minimum",
        arrayVariableName: "minima",
      });
      this.makePublicStateVariableArray({
        variableName: "minimalocations",
        componentType: "number",
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "minimumlocation",
        arrayVariableName: "minimalocations",
      });
      this.makePublicStateVariableArray({
        variableName: "minimavalues",
        componentType: "number",
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "minimumvalue",
        arrayVariableName: "minimavalues",
      });
      this.makePublicStateVariable({
        variableName: "numberminima",
        componentType: "number"
      });

      this.makePublicStateVariableArray({
        variableName: "maxima",
        componentType: "point",
        stateVariableForRef: "coords",
        additionalProperties: { draggable: false },
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "maximum",
        arrayVariableName: "maxima",
      });
      this.makePublicStateVariableArray({
        variableName: "maximalocations",
        componentType: "number",
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "maximumlocation",
        arrayVariableName: "maximalocations",
      });
      this.makePublicStateVariableArray({
        variableName: "maximavalues",
        componentType: "number",
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "maximumvalue",
        arrayVariableName: "maximavalues",
      });
      this.makePublicStateVariable({
        variableName: "numbermaxima",
        componentType: "number"
      });

      this.makePublicStateVariableArray({
        variableName: "extrema",
        componentType: "point",
        stateVariableForRef: "coords",
        additionalProperties: { draggable: false },
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "extremum",
        arrayVariableName: "extrema",
      });
      this.makePublicStateVariableArray({
        variableName: "extremalocations",
        componentType: "number",
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "extremumlocation",
        arrayVariableName: "extremalocations",
      });
      this.makePublicStateVariableArray({
        variableName: "extremavalues",
        componentType: "number",
        entryName: "extremumvalue",
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "extremumvalue",
        arrayVariableName: "extremavalues",
      });
      this.makePublicStateVariable({
        variableName: "numberextrema",
        componentType: "number"
      });
      this.makePublicStateVariable({
        variableName: "styledescription",
        componentType: "text",
      });

    }

  }

  // allow to adapt into curve
  get nAdapters() {
    return 1;
  }

  getAdapter(ind) {

    if (ind >= 1) {
      return;
    }

    let newState = {
      functionComponentName: this.componentName
    };


    let downstreamStateVariables = [];
    let upstreamStateVariables = [];

    // copy any properties that match the adapter
    // add them both to newState and to dependency state variables
    let adapterClass = this.allComponentClasses.curve;
    let availableClassProperties = adapterClass.createPropertiesObject({
      standardComponentClasses: this.standardComponentClasses
    });

    for (let item in availableClassProperties) {
      if (item in this._state) {
        newState[item] = this.state[item];
        downstreamStateVariables.push(item);
        upstreamStateVariables.push(item);
      }
    }

    let downDep = {
      dependencyType: "adapter",
      adapter: "curve",
      downstreamStateVariables: downstreamStateVariables,
      upstreamStateVariables: upstreamStateVariables,
      includeDownstreamComponent: true,
    }

    // TODO: if unresolved, should pass unresolvedState to curve

    return {
      componentType: "curve",
      downstreamDependencies: {
        [this.componentName]: [downDep]
      },
      state: newState,
    };

  }

}