import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export default class Function extends InlineComponent {
  static componentType = "function";
  static rendererType = "math";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.xscale = { default: 1, propagateToDescendants: true };
    properties.yscale = { default: 1, propagateToDescendants: true };
    // include properties of graphical components
    // for case when function is adapted into functionCurve
    properties.label = { default: "", forRenderer: true };
    properties.showLabel = { default: true, forRenderer: true };
    properties.layer = { default: 0, forRenderer: true };
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
      logicToWaitOnSugar: ["exactlyOneFormula"],
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
        newChildren: [{ componentType: "interpolatedfunction", children }],
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
      logicToWaitOnSugar: ["exactlyOneFunction"],
      replacementFunction: addInterpolatedFunction,
    })

    let exactlyOneFunction = childLogic.newLeaf({
      name: "exactlyOneFunction",
      componentType: "function",
      comparison: 'exactly',
      number: 1,
    })

    let noFunctions = childLogic.newLeaf({
      name: "noFunctions",
      componentType: "function",
      comparison: 'exactly',
      number: 0,
    })

    let functionFormulaXorSugar = childLogic.newOperator({
      name: "functionFormulaXorSugar",
      operator: 'xor',
      propositions: [exactlyOneFunction, exactlyOneFormula, throughCriteria, stringsAndMaths, noFunctions],
    })


    let atMostOneVariable = childLogic.newLeaf({
      name: "atMostOneVariable",
      componentType: "variable",
      comparison: "atMost",
      number: 1,
    })

    childLogic.newOperator({
      name: "formulaWithVariable",
      operator: "and",
      propositions: [atMostOneVariable, functionFormulaXorSugar],
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

    stateVariableDefinitions.variable = {
      public: true,
      componentType: "variable",
      defaultValue: me.fromAst("x"),
      returnDependencies: () => ({
        variableChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneVariable",
          variableNames: ["value"],
        },
        functionChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneFunction",
          variableNames: ["variable"],
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.functionChild.length === 1) {
          if (dependencyValues.variableChild.length === 1) {
            console.warn("Variable for function is ignored when it has a function child")
          }
          return { newValues: { variable: dependencyValues.functionChild[0].stateValues.variable } }
        } else if (dependencyValues.variableChild.length === 1) {
          return { newValues: { variable: dependencyValues.variableChild[0].stateValues.value } }
        } else {
          return {
            useEssentialOrDefaultValue: {
              variable: { variablesToCheck: ["variable"] }
            }
          }
        }
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
          childLogicName: "exactlyOneFunction",
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
          childLogicName: "exactlyOneFunction",
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
          childLogicName: "exactlyOneFunction",
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

    stateVariableDefinitions.latex = {
      public: true,
      componentType: "text",
      forRenderer: true,
      returnDependencies: () => ({
        formula: {
          dependencyType: "stateVariable",
          variableName: "formula"
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { latex: dependencyValues.formula.toLatex() } };
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
            childLogicName: "exactlyOneFunction",
            variableNames: ["minima"],
          }
        } else {
          dependencies.functionChild = {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneFunction",
            variableNames: ["minimum" + (arrayKey + 1)],
          }
        }

        return dependencies;

      },
      markStale: function ({ freshnessInfo, arrayKeys, changes }) {

        let freshByKey = freshnessInfo.minima.freshByKey
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

            return { fresh: { minima: false } }

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
          for (let key in freshByKey) {
            delete freshByKey[key];
          }
          return { fresh: { minima: false } }
        }


        if (arrayKey === undefined) {
          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: { minima: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { minima: true } }
          }
        } else {
          // asked for just one component, so will be interpreted
          // as giving freshness of just array entry
          return { fresh: { minima: freshByKey[arrayKey] === true } }
        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys }) {

        let freshByKey = freshnessInfo.minima.freshByKey;

        // check for presence of functionChild
        // as derived classes may have changed the dependencies
        // to eliminate functionChildDependency
        if (dependencyValues.functionChild && dependencyValues.functionChild.length === 1) {

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
                minimaList.push(me.fromAst(["vector", xleft, fleft]));
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
              minimaList.push(me.fromAst(["vector", x, fx]));
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
      componentType: "number",
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

        let freshByKey = freshnessInfo.minimaLocations.freshByKey;

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
            return { fresh: { minimaLocations: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { minimaLocations: true } }
          }

        } else {

          if (changes["minimum" + (arrayKey + 1)]) {

            let valuesChanged = changes["minimum" + (arrayKey + 1)].valuesChanged;

            if (valuesChanged["minimum" + (arrayKey + 1)]) {
              delete freshByKey[arrayKey];
            }
          }
          // will be interpreted as indicating freshness of array entry
          return { fresh: { minimaLocations: freshByKey[arrayKey] === true } }

        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.minimaLocations.freshByKey;


        if (arrayKey === undefined) {

          if (changes.minima && changes.minima.valuesChanged.minima.changed.changedEntireArray) {
            // if entire array is changed, then send in an array
            // to indicate have completely new values

            let minimaLocations = dependencyValues.minima.map(x => x.get_component(0).tree);

            // mark everything fresh, but start with new object
            // to make sure don't have extraneous keys
            freshByKey = {}
            for (let key in minimaLocations) {
              freshByKey[key] = true;
            }

            return { newValues: { minimaLocations } }

          } else if (Object.keys(freshByKey).length === 0) {

            let minimaLocations = dependencyValues.minima.map(x => x.get_component(0).tree);

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
                minimaLocations[key] = dependencyValues.minima[key].get_component(0).tree;
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

            let minimum = dependencyValues["minimum" + (arrayKey + 1)];
            let minimumLocation;
            if (minimum) {
              minimumLocation = minimum.get_component(0).tree;
            }
            return {
              newValues: {
                minimaLocations: {
                  [arrayKey]: minimumLocation
                }
              }
            }
          }


        }

      }
    }

    stateVariableDefinitions.minimaValues = {
      public: true,
      componentType: "number",
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

        let freshByKey = freshnessInfo.minimaValues.freshByKey;

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
            return { fresh: { minimaValues: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { minimaValues: true } }
          }

        } else {

          if (changes["minimum" + (arrayKey + 1)]) {

            let valuesChanged = changes["minimum" + (arrayKey + 1)].valuesChanged;

            if (valuesChanged["minimum" + (arrayKey + 1)]) {
              delete freshByKey[arrayKey];
            }
          }
          // will be interpreted as indicating freshness of array entry
          return { fresh: { minimaValues: freshByKey[arrayKey] === true } }

        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.minimaValues.freshByKey;


        if (arrayKey === undefined) {

          if (changes.minima && changes.minima.valuesChanged.minima.changed.changedEntireArray) {
            // if entire array is changed, then send in an array
            // to indicate have completely new values

            let minimaValues = dependencyValues.minima.map(x => x.get_component(1).tree);

            // mark everything fresh, but start with new object
            // to make sure don't have extraneous keys
            freshByKey = {}
            for (let key in minimaValues) {
              freshByKey[key] = true;
            }

            return { newValues: { minimaValues } }

          } else if (Object.keys(freshByKey).length === 0) {

            let minimaValues = dependencyValues.minima.map(x => x.get_component(1).tree);

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
                minimaValues[key] = dependencyValues.minima[key].get_component(1).tree;
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


            let minimum = dependencyValues["minimum" + (arrayKey + 1)];
            let minimumValue;
            if (minimum) {
              minimumValue = minimum.get_component(1).tree;
            }
            return {
              newValues: {
                minimaValues: {
                  [arrayKey]: minimumValue
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
            childLogicName: "exactlyOneFunction",
            variableNames: ["maxima"],
          }
        } else {
          dependencies.functionChild = {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneFunction",
            variableNames: ["maximum" + (arrayKey + 1)],
          }
        }

        return dependencies;

      },
      markStale: function ({ freshnessInfo, arrayKeys, changes }) {

        let freshByKey = freshnessInfo.maxima.freshByKey;

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

            return { fresh: { maxima: false } }

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
          for (let key in freshByKey) {
            delete freshByKey[key];
          }
          return { fresh: { maxima: false } }
        }


        if (arrayKey === undefined) {
          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: { maxima: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { maxima: true } }
          }
        } else {
          // asked for just one component
          // will be interpreted as indicating freshness of array entry
          return { fresh: { maxima: freshByKey[arrayKey] === true } }
        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys }) {
        let freshByKey = freshnessInfo.maxima.freshByKey;

        // check for presence of functionChild
        // as derived classes may have changed the dependencies
        // to eliminate functionChildDependency
        if (dependencyValues.functionChild && dependencyValues.functionChild.length === 1) {

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
                maximaList.push(me.fromAst(["vector", xleft, -fleft]));
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
              maximaList.push(me.fromAst(["vector", x, -fx]));
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
      componentType: "number",
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

        let freshByKey = freshnessInfo.maximaLocations.freshByKey;

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
            return { fresh: { maximaLocations: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { maximaLocations: true } }
          }

        } else {

          if (changes["maximum" + (arrayKey + 1)]) {

            let valuesChanged = changes["maximum" + (arrayKey + 1)].valuesChanged;

            if (valuesChanged["maximum" + (arrayKey + 1)]) {
              delete freshByKey[arrayKey];
            }
          }
          // will be interpreted as indicating freshness of array entry
          return { fresh: { maximaLocations: freshByKey[arrayKey] === true } }

        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.maximaLocations.freshByKey;

        if (arrayKey === undefined) {

          if (changes.maxima && changes.maxima.valuesChanged.maxima.changed.changedEntireArray) {
            // if entire array is changed, then send in an array
            // to indicate have completely new values

            let maximaLocations = dependencyValues.maxima.map(x => x.get_component(0).tree);

            // mark everything fresh, but start with new object
            // to make sure don't have extraneous keys
            freshByKey = {}
            for (let key in maximaLocations) {
              freshByKey[key] = true;
            }

            return { newValues: { maximaLocations } }

          } else if (Object.keys(freshByKey).length === 0) {

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
                maximaLocations[key] = dependencyValues.maxima[key].get_component(0).tree;
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
            let maximum = dependencyValues["maximum" + (arrayKey + 1)];
            let maximumLocation;
            if (maximum) {
              maximumLocation = maximum.get_component(0).tree;
            }
            return {
              newValues: {
                maximaLocations: {
                  [arrayKey]: maximumLocation
                }
              }
            }
          }


        }

      }
    }

    stateVariableDefinitions.maximaValues = {
      public: true,
      componentType: "number",
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

        let freshByKey = freshnessInfo.maximaValues.freshByKey;

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
            return { fresh: { maximaValues: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { maximaValues: true } }
          }

        } else {

          if (changes["maximum" + (arrayKey + 1)]) {

            let valuesChanged = changes["maximum" + (arrayKey + 1)].valuesChanged;

            if (valuesChanged["maximum" + (arrayKey + 1)]) {
              delete freshByKey[arrayKey];
            }
          }
          // will be interpreted as indicating freshness of array entry
          return { fresh: { maximaValues: freshByKey[arrayKey] === true } }

        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.maximaValues.freshByKey;


        if (arrayKey === undefined) {

          if (changes.maxima && changes.maxima.valuesChanged.maxima.changed.changedEntireArray) {
            // if entire array is changed, then send in an array
            // to indicate have completely new values

            let maximaValues = dependencyValues.maxima.map(x => x.get_component(1).tree);

            // mark everything fresh, but start with new object
            // to make sure don't have extraneous keys
            freshByKey = {}
            for (let key in maximaValues) {
              freshByKey[key] = true;
            }

            return { newValues: { maximaValues } }

          } else if (Object.keys(freshByKey).length === 0) {

            let maximaValues = dependencyValues.maxima.map(x => x.get_component(1).tree);

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
                maximaValues[key] = dependencyValues.maxima[key].get_component(1).tree;
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
            let maximum = dependencyValues["maximum" + (arrayKey + 1)];
            let maximumValue;
            if (maximum) {
              maximumValue = maximum.get_component(1).tree;
            }
            return {
              newValues: {
                maximaValues: {
                  [arrayKey]: maximumValue
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
          childLogicName: "exactlyOneFunction"
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
                childLogicName: "exactlyOneFunction",
                variableNames: ["extrema"],
              },
            }
          } else {
            return {
              functionChild: {
                dependencyType: "childStateVariables",
                childLogicName: "exactlyOneFunction",
                variableNames: ["extremum" + (arrayKey + 1)],
              },
            }
          }
        }

      },
      markStale: function ({ freshnessInfo, arrayKeys, changes }) {

        let freshByKey = freshnessInfo.extrema.freshByKey;

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

            return { fresh: { extrema: false } }

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
          for (let key in freshByKey) {
            delete freshByKey[key];
          }
          return { fresh: { extrema: false } }
        }


        if (arrayKey === undefined) {
          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: { extrema: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { extrema: true } }
          }
        } else {
          // asked for just one component
          // will be interpreted as indicating freshness of array entry
          return { fresh: { extrema: freshByKey[arrayKey] === true } }
        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys }) {

        let freshByKey = freshnessInfo.extrema.freshByKey;

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
          .sort((a, b) => a.get_component(0).tree - b.get_component(0).tree);

        // mark everything fresh
        for (let key in extrema) {
          freshByKey[key] = true;
        }

        return { newValues: { extrema } }

      }
    }

    stateVariableDefinitions.extremaLocations = {
      public: true,
      componentType: "number",
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

        let freshByKey = freshnessInfo.extremaLocations.freshByKey;

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
            return { fresh: { extremaLocations: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { extremaLocations: true } }
          }

        } else {

          if (changes["extremum" + (arrayKey + 1)]) {

            let valuesChanged = changes["extremum" + (arrayKey + 1)].valuesChanged;

            if (valuesChanged["extremum" + (arrayKey + 1)]) {
              delete freshByKey[arrayKey];
            }
          }
          // will be interpreted as indicating freshness of array entry
          return { fresh: { extremaLocations: freshByKey[arrayKey] === true } }

        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.extremaLocations.freshByKey;


        if (arrayKey === undefined) {

          if (changes.extrema && changes.extrema.valuesChanged.extrema.changed.changedEntireArray) {
            // if entire array is changed, then send in an array
            // to indicate have completely new values

            let extremaLocations = dependencyValues.extrema.map(x => x.get_component(0).tree);

            // mark everything fresh, but start with new object
            // to make sure don't have extraneous keys
            freshByKey = {}
            for (let key in extremaLocations) {
              freshByKey[key] = true;
            }

            return { newValues: { extremaLocations } }

          } else if (Object.keys(freshByKey).length === 0) {

            let extremaLocations = dependencyValues.extrema.map(x => x.get_component(0).tree);

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
                extremaLocations[key] = dependencyValues.extrema[key].get_component(0).tree;
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

            let extremum = dependencyValues["extremum" + (arrayKey + 1)];
            let extremumLocation;
            if (extremum) {
              extremumLocation = extremum.get_component(0).tree;
            }
            return {
              newValues: {
                extremaLocations: {
                  [arrayKey]: extremumLocation
                }
              }
            }
          }


        }

      }
    }

    stateVariableDefinitions.extremaValues = {
      public: true,
      componentType: "number",
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

        let freshByKey = freshnessInfo.extremaValues.freshByKey;

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
            return { fresh: { extremaValues: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { extremaValues: true } }
          }

        } else {
          if (changes.extrema) {
            // check if the extrema
            // are no longer fresh
            let newFreshByKey = changes.extrema.valuesChanged.extrema.freshnessInfo.freshByKey;
            for (let key in freshByKey) {
              if (!newFreshByKey[key]) {
                delete freshByKey[key];
              }
            }
          }
          if (changes["extremum" + (arrayKey + 1)]) {

            let valuesChanged = changes["extremum" + (arrayKey + 1)].valuesChanged;

            if (valuesChanged["extremum" + (arrayKey + 1)]) {
              delete freshByKey[arrayKey];
            }
          }
          // will be interpreted as indicating freshness of array entry
          return { fresh: { extremaValues: freshByKey[arrayKey] === true } }

        }

      },
      definition: function ({ dependencyValues, freshnessInfo, arrayKeys, changes }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let freshByKey = freshnessInfo.extremaValues.freshByKey;


        if (arrayKey === undefined) {

          if (changes.extrema && changes.extrema.valuesChanged.extrema.changed.changedEntireArray) {
            // if entire array is changed, then send in an array
            // to indicate have completely new values

            let extremaValues = dependencyValues.extrema.map(x => x.get_component(1).tree);

            // mark everything fresh, but start with new object
            // to make sure don't have extraneous keys
            freshByKey = {}
            for (let key in extremaValues) {
              freshByKey[key] = true;
            }

            return { newValues: { extremaValues } }

          } else if (Object.keys(freshByKey).length === 0) {

            let extremaValues = dependencyValues.extrema.map(x => x.get_component(1).tree);

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
                extremaValues[key] = dependencyValues.extrema[key].get_component(1).tree;
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

            let extremum = dependencyValues["extremum" + (arrayKey + 1)];
            let extremumValue;
            if (extremum) {
              extremumValue = extremum.get_component(1).tree;
            }
            return {
              newValues: {
                extremaValues: {
                  [arrayKey]: extremumValue
                }
              }
            }
          }


        }

      }
    }


    stateVariableDefinitions.numberMinima = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        minima: {
          dependencyType: "stateVariable",
          variableName: "minima"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            numberMinima: dependencyValues.minima.length,
          },
          checkForActualChange: { numberMinima: true }
        }
      }
    }


    stateVariableDefinitions.numberMaxima = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        maxima: {
          dependencyType: "stateVariable",
          variableName: "maxima"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            numberMaxima: dependencyValues.maxima.length,
          },
          checkForActualChange: { numberMaxima: true }
        }
      }
    }


    stateVariableDefinitions.numberExtrema = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        extrema: {
          dependencyType: "stateVariable",
          variableName: "extrema"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            numberExtrema: dependencyValues.extrema.length,
          },
          checkForActualChange: { numberExtrema: true }
        }
      }
    }

    stateVariableDefinitions.returnDerivativesOfNumericalf = {
      returnDependencies: () => ({
        functionChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneFunction",
          variableNames: ["returnDerivativesOfNumericalf"],
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.functionChild.length === 1 &&
          dependencyValues.functionChild[0].stateValues.returnDerivativesOfNumericalf
        ) {
          return {
            newValues: { returnDerivativesOfNumericalf: dependencyValues.functionChild[0].stateValues.returnDerivativesOfNumericalf }
          }
        } else {
          return { newValues: { returnDerivativesOfNumericalf: null } }
        }
      }

    }

    return stateVariableDefinitions;

  }

  adapters = [{
    stateVariable: "numericalf",
    componentType: "functioncurve"
  },
  {
    stateVariable: "formula",
    componentType: "math"
  }];

}