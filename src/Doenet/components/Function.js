import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export default class Function extends InlineComponent {
  static componentType = "function";

  static createPropertiesObject({ standardComponentTypes }) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.variable = { default: me.fromAst("x") };
    properties.xscale = { default: 1 };
    properties.yscale = { default: 1 };
    return properties;
  }

  static returnChildLogic({ standardComponentTypes, allComponentClasses, components }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

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
      replacementFunction: addFormula,
    });

    let exactlyOneFormula = childLogic.newLeaf({
      name: "exactlyOneFormula",
      componentType: "formula",
      number: 1,
    })

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
      propositions: [atLeastOneMaximum, atLeastOneMinimum, atLeastOneExtremum, atLeastOneThrough]
    })

    let nothing = childLogic.newLeaf({
      name: "nothing",
      componentType: "through",
      number: 0,
    })

    childLogic.newOperator({
      name: "FormulaCriteriaXorSugar",
      operator: 'xor',
      propositions: [exactlyOneFormula, throughCriteria, stringsAndMaths, nothing],
      setAsBase: true,
    })

    return childLogic;
  }

  updateState(args = {}) {
    if (args.init === true) {

      this.getMinima = this.getMinima.bind(this);
      this.getMaxima = this.getMaxima.bind(this);
      this.getExtrema = this.getExtrema.bind(this);
      this.getMinimaLocations = this.getMinimaLocations.bind(this);
      this.getMaximaLocations = this.getMaximaLocations.bind(this);
      this.getExtremaLocations = this.getExtremaLocations.bind(this);
      this.getMinimaValues = this.getMinimaValues.bind(this);
      this.getMaximaValues = this.getMaximaValues.bind(this);
      this.getExtremaValues = this.getExtremaValues.bind(this);

      this._state.computedMaxima = {}
      this._state.computedMaxima.trackChanges = true;
      this._state.computedMinima = {}
      this._state.computedMinima.trackChanges = true;
      this._state.computedExtrema = {}
      this._state.computedExtrema.trackChanges = true;

      // using proxy rather than defineProperty for arrays
      // as this is used as a target of another proxy (for arrayComponents)
      // and defineProperty as a proxy target doesn't seem to update
      // TODO: is this the right way to accomplish this?
      this._state.minima = {};
      this._state.minimavalues = {};
      this._state.minimalocations = {};
      this._state.maxima = {};
      this._state.maximavalues = {};
      this._state.maximalocations = {};
      this._state.extrema = {};
      this._state.extremavalues = {};
      this._state.extremalocations = {};
      this._state.minima.value = new Proxy({},
        { get: (obj, ind) => this.getMinima()[ind], set: _ => false });
      this._state.minima.rawValue = new Proxy({},
        { get: (obj, ind) => this.state.computedMinima ? this.getMinima()[ind] : undefined, set: _ => false });
      this._state.maxima.value = new Proxy({},
        { get: (obj, ind) => this.getMaxima()[ind], set: _ => false });
      this._state.maxima.rawValue = new Proxy({},
        { get: (obj, ind) => this.state.computedMaxima ? this.getMaxima()[ind] : undefined, set: _ => false });
      this._state.extrema.value = new Proxy({},
        { get: (obj, ind) => this.getExtrema()[ind], set: _ => false });
      this._state.extrema.rawValue = new Proxy({},
        { get: (obj, ind) => this.state.computedExtrema ? this.getExtrema()[ind] : undefined, set: _ => false });
      this._state.minimavalues.value = new Proxy({},
        { get: (obj, ind) => this.getMinimaValues()[ind], set: _ => false });
      this._state.minimavalues.rawValue = new Proxy({},
        { get: (obj, ind) => this.state.computedMinima ? this.getMinimaValues()[ind] : undefined, set: _ => false });
      this._state.maximavalues.value = new Proxy({},
        { get: (obj, ind) => this.getMaximaValues()[ind], set: _ => false });
      this._state.maximavalues.rawValue = new Proxy({},
        { get: (obj, ind) => this.state.computedMaxima ? this.getMaximaValues()[ind] : undefined, set: _ => false });
      this._state.extremavalues.value = new Proxy({},
        { get: (obj, ind) => this.getExtremaValues()[ind], set: _ => false });
      this._state.extremavalues.rawValue = new Proxy({},
        { get: (obj, ind) => this.state.computedExtrema ? this.getExtremaValues()[ind] : undefined, set: _ => false });
      this._state.minimalocations.value = new Proxy({},
        { get: (obj, ind) => this.getMinimaLocations()[ind], set: _ => false });
      this._state.minimalocations.rawValue = new Proxy({},
        { get: (obj, ind) => this.state.computedMinima ? this.getMinimaLocations()[ind] : undefined, set: _ => false });
      this._state.maximalocations.value = new Proxy({},
        { get: (obj, ind) => this.getMaximaLocations()[ind], set: _ => false });
      this._state.maximalocations.rawValue = new Proxy({},
        { get: (obj, ind) => this.state.computedMaxima ? this.getMaximaLocations()[ind] : undefined, set: _ => false });
      this._state.extremalocations.value = new Proxy({},
        { get: (obj, ind) => this.getExtremaLocations()[ind], set: _ => false });
      this._state.extremalocations.rawValue = new Proxy({},
        { get: (obj, ind) => this.state.computedExtrema ? this.getExtremaLocations()[ind] : undefined, set: _ => false });

      // Object.defineProperty(this._state.minima, 'value', { get: this.getMinima });
      // Object.defineProperty(this._state.maxima, 'value', { get: this.getMaxima });
      // Object.defineProperty(this._state.extrema, 'value', { get: this.getExtrema });


      this.interpolatedF = this.interpolatedF.bind(this);
      this.returnF = this.returnF.bind(this);
      this.returnNumericF = this.returnNumericF.bind(this);

      this.makePublicStateVariable({
        variableName: "formula",
        componentType: "formula"
      });

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

      // extra variable ensure detect changes
      this._state.versionNumber = {
        trackChanges: true,
        value: 0,
      }

      // Object.defineProperty(this._state.minima, 'value', { get: this.getMinima});
      // Object.defineProperty(this._state.minimalocations, 'value', { get: () => this.getMinima().map(x => x.tree[1])});
      // Object.defineProperty(this._state.minimavalues, 'value', { get: () => this.getMinima().map(x => x.tree[2])});
      Object.defineProperty(this._state.numberminima, 'value', { get: () => this.getMinima().length })
      Object.defineProperty(this._state.numberminima, 'rawValue', { get: () => this.state.computedMinima ? this.state.computedMinima.length : undefined });
      // Object.defineProperty(this._state.maxima, 'value', { get: this.getMaxima});
      // Object.defineProperty(this._state.maximalocations, 'value', { get: () => this.getMaxima().map(x => x.tree[1])});
      // Object.defineProperty(this._state.maximavalues, 'value', { get: () => this.getMaxima().map(x => x.tree[2])});
      Object.defineProperty(this._state.numbermaxima, 'value', { get: () => this.getMaxima().length })
      Object.defineProperty(this._state.numbermaxima, 'rawValue', { get: () => this.state.computedMaxima ? this.state.computedMaxima.length : undefined });
      // Object.defineProperty(this._state.extrema, 'value', { get: this.getExtrema});
      // Object.defineProperty(this._state.extremalocations, 'value', { get: () => this.getExtrema().map(x => x.tree[1])});
      // Object.defineProperty(this._state.extremavalues, 'value', { get: () => this.getExtrema().map(x => x.tree[2])});
      Object.defineProperty(this._state.numberextrema, 'value', { get: () => this.getExtrema().length })
      Object.defineProperty(this._state.numberextrema, 'rawValue', { get: () => this.state.computedExtrema ? this.state.computedExtrema.length : undefined });

    }

    super.updateState(args);

    if (!this.childLogicSatisfied) {
      this.markAllUnresolved();
      return;
    }

    this.markAllResolved();

    this.state.selectedStyle = this.styleDefinitions[this.state.stylenumber];
    if(this.state.selectedStyle === undefined) {
      this.state.selectedStyle = this.styleDefinitions[1];
    }

    let curveDescription = "";
    if(this.state.selectedStyle.lineWidth >= 4) {
      curveDescription += "thick ";
    }else if(this.state.selectedStyle.lineWidth <= 1) {
      curveDescription += "thin ";
    }
    if(this.state.selectedStyle.lineStyle === "dashed") {
      curveDescription += "dashed ";
    } else if(this.state.selectedStyle.lineStyle === "dotted") {
      curveDescription += "dotted ";
    }

    curveDescription += `${this.state.selectedStyle.lineColor} `;

    this.state.styledescription = curveDescription;

    // this.state.computedMaxima = undefined;
    // this.state.computedMinima = undefined;
    // this.state.computedExtrema = undefined;

    let recomputeExtrema = false;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {
      recomputeExtrema = true;

      let exactlyOneFormulaInds = this.childLogic.returnMatches("exactlyOneFormula");

      // if child logic overwritten by superclass, don't continue
      if (exactlyOneFormulaInds === undefined) {
        this.state.functionChildLogicOverwritten = true;

        this.state.computedMaxima = undefined;
        this.state.computedMinima = undefined;
        this.state.computedExtrema = undefined;

        return;
      }

      if (exactlyOneFormulaInds.length > 0) {
        this.state.formulaChild = this.activeChildren[exactlyOneFormulaInds[0]];
      } else {
        delete this.state.formulaChild;
        this.state.formula = undefined;
        this.state.f = undefined;

        let maximumInds = this.childLogic.returnMatches("atLeastOneMaximum");
        this.state.maximumChildren = maximumInds.map(x => this.activeChildren[x]);

        let minimumInds = this.childLogic.returnMatches("atLeastOneMinimum");
        this.state.minimumChildren = minimumInds.map(x => this.activeChildren[x]);

        let extremumInds = this.childLogic.returnMatches("atLeastOneExtremum");
        this.state.extremumChildren = extremumInds.map(x => this.activeChildren[x]);

        let throughInds = this.childLogic.returnMatches("atLeastOneThrough");
        this.state.throughChildren = throughInds.map(x => this.activeChildren[x]);

      }
    }

    if (this.state.functionChildLogicOverwritten) {
      this.state.computedMaxima = undefined;
      this.state.computedMinima = undefined;
      this.state.computedExtrema = undefined;
      return;
    }

    let recomputeAll = childrenChanged;
    if (this.state.recomputeAllNextTime) {
      recomputeAll = true;
      delete this.state.recomputeAllNextTime;
    }

    if (this.state.formulaChild) {
      if (this.state.formulaChild.unresolvedState.value) {
        this.markAllUnresolved();
        return;
      } else if (recomputeAll || trackChanges.getVariableChanges({
        component: this.state.formulaChild, variable: "value"
      })) {
        recomputeExtrema = true;
        this.state.formula = this.state.formulaChild.state.value;

        let f = this.state.formula.f();
        let varString = this.state.variable.tree;
        this.state.f = function (x) {
          try {
            return f({ [varString]: x });
          } catch (e) {
            return NaN;
          }
        }
      }
    } else {

      if ([
        ...this.state.maximumChildren,
        ...this.state.minimumChildren,
        ...this.state.extremumChildren
      ].some(
        x => x.unresolvedState.location || x.unresolvedState.value
      )) {
        if (recomputeAll) {
          this.state.recomputeAllNextTime = true;
        }
        this.markAllUnresolved();
        return;
      }

      if (this.state.throughChildren.some(
        x => x.unresolvedState.points || x.state.points.some(y => y.unresolvedState.coords)
      )) {
        if (recomputeAll) {
          this.state.recomputeAllNextTime = true;
        }
        this.markAllUnresolved();
        return;
      }

      if (this.state.throughChildren.some(x => trackChanges.getVariableChanges({
        component: x, variable: "points"
      }) || trackChanges.getVariableChanges({
        component: x, variable: "slope"
      }))) {
        // if a point of a through child changed,
        // treat it as a child of function changing
        recomputeAll = true;
      }


      if (recomputeAll) {

        recomputeExtrema = true;

        this.state.prescribedMaxima = this.state.maximumChildren.map(x => (
          {
            x: x.state.location,
            y: x.state.value
          }
        ));

        this.state.prescribedMinima = this.state.minimumChildren.map(x => (
          {
            x: x.state.location,
            y: x.state.value
          }
        ));

        this.state.prescribedExtrema = this.state.extremumChildren.map(x => (
          {
            x: x.state.location,
            y: x.state.value
          }
        ));

        this.state.prescribedPoints = [];
        for (let child of this.state.throughChildren) {
          let slope = child.state.slope;
          for (let i = 0; i < child.state.nPoints; i++) {
            let point = child.state.points[i];
            if (point.state.ndimensions === 2) {
              this.state.prescribedPoints.push({
                x: point.state.xs[0],
                y: point.state.xs[1],
                slope: slope,
              })
            } else {
              console.warn("Ignoring point that isn't 2D")

            }
          }
        }

      } else {
        // children didn't change

        for (let [ind, child] of this.state.maximumChildren.entries()) {
          if (trackChanges.getVariableChanges({
            component: child, variable: "location"
          }) || trackChanges.getVariableChanges({
            component: child, variable: "value"
          })) {
            this.state.prescribedMaxima[ind] = {
              x: child.state.location,
              y: child.state.value
            };
            recomputeExtrema = true;
          }
        }

        for (let [ind, child] of this.state.minimumChildren.entries()) {
          if (trackChanges.getVariableChanges({
            component: child, variable: "location"
          }) || trackChanges.getVariableChanges({
            component: child, variable: "value"
          })) {
            this.state.prescribedMinima[ind] = {
              x: child.state.location,
              y: child.state.value
            };
            recomputeExtrema = true;
          }
        }

        for (let [ind, child] of this.state.extremumChildren.entries()) {
          if (trackChanges.getVariableChanges({
            component: child, variable: "location"
          }) || trackChanges.getVariableChanges({
            component: child, variable: "value"
          })) {
            this.state.prescribedExtrema[ind] = {
              x: child.state.location,
              y: child.state.value
            };
            recomputeExtrema = true;
          }
        }

        let ind = 0;
        let foundDimensionChange = false;
        for (let child of this.state.throughChildren) {
          let slope = child.state.slope;
          for (let i = 0; i < child.state.nPoints; i++) {
            let point = child.state.points[i];

            if (trackChanges.getVariableChanges({
              component: point, variable: "coords"
            })) {
              recomputeExtrema = true;

              if (trackChanges.getVariableChanges({
                component: child, variable: "dimension"
              })) {
                foundDimensionChange = true;
                break;
              };

              if (point.state.ndimensions === 2) {
                this.state.prescribedPoints[ind] = {
                  x: point.state.xs[0],
                  y: point.state.xs[1],
                  slope: slope,
                };
                ind++;
              } else {
                console.warn("Ignoring point that isn't 2D")
              }
            } else {
              if (point.state.ndimensions === 2) {
                ind++
              }
            }
          }
          if (foundDimensionChange) {
            break;
          }
        }


        if (foundDimensionChange) {
          // recalculate all if found a point that changed dimension
          this.state.prescribedPoints = [];
          for (let child of this.state.throughChildren) {
            let slope = child.state.slope;
            for (let i = 0; i < child.state.nPoints; i++) {
              let point = child.state.points[i];
              if (point.state.ndimensions === 2) {
                this.state.prescribedPoints.push({
                  x: point.state.xs[0],
                  y: point.state.xs[1],
                  slope: slope,
                })
              } else {
                console.warn("Ignoring point that isn't 2D")
              }
            }
          }
        }
      }

      if (recomputeExtrema) {

        if (this.state.prescribedMaxima.length > 0 ||
          this.state.prescribedMinima.length > 0 ||
          this.state.prescribedExtrema.length > 0 ||
          this.state.prescribedPoints.length > 0) {

          this.calculateInterpolationPoints();

          this.computeSplineParamCoeffs();

        } else {

          // if it wasn't directly passed a function, make it zero
          if (this.state.numericF === undefined) {
            this.state.formula = me.fromAst(0);
            this.state.f = x => 0;
          }
        }
      }

    }

    if (recomputeAll || recomputeExtrema) {

      this.state.versionNumber++;
      
      this.currentTracker.trackChanges.logPotentialChange({
        component: this,
        variable: "maxima",
        oldValue: this.state.computedMaxima,
      });

      if (this.state.computedMaxima) {
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "maximalocations",
          oldValue: this.state.computedMaxima.map(x => x.tree[1]),
        });
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "maximavalues",
          oldValue: this.state.computedMaxima.map(x => x.tree[2]),
        });
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "numbermaxima",
          oldValue: this.state.computedMaxima.length,
        });
      } else {
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "maximalocations",
          oldValue: undefined,
        });
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "maximavalues",
          oldValue: undefined,
        });
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "numbermaxima",
          oldValue: undefined,
        });
      }

      this.currentTracker.trackChanges.logPotentialChange({
        component: this,
        variable: "minima",
        oldValue: this.state.computedMinima,
      });
      if (this.state.computedMinima) {
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "minimalocations",
          oldValue: this.state.computedMinima.map(x => x.tree[1]),
        });
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "minimavalues",
          oldValue: this.state.computedMinima.map(x => x.tree[2]),
        });
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "numberminima",
          oldValue: this.state.computedMinima.length,
        });
      } else {
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "minimalocations",
          oldValue: undefined,
        });
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "minimavalues",
          oldValue: undefined,
        });
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "numberminima",
          oldValue: undefined,
        });
      }

      this.currentTracker.trackChanges.logPotentialChange({
        component: this,
        variable: "extrema",
        oldValue: this.state.computedExtrema,
      });
      if (this.state.computedExtrema) {
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "extremalocations",
          oldValue: this.state.computedExtrema.map(x => x.tree[1]),
        });
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "extremavalues",
          oldValue: this.state.computedExtrema.map(x => x.tree[2]),
        });
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "numberextrema",
          oldValue: this.state.computedExtrema.length,
        });
      } else {
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "extremalocations",
          oldValue: undefined,
        });
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "extremavalues",
          oldValue: undefined,
        });
        this.currentTracker.trackChanges.logPotentialChange({
          component: this,
          variable: "numberextrema",
          oldValue: undefined,
        });
      }

      this.state.computedMaxima = undefined;
      this.state.computedMinima = undefined;
      this.state.computedExtrema = undefined;
    }

  }

  markAllUnresolved() {
    this.unresolvedState.formula = true;
    this.unresolvedState.minima = true;
    this.unresolvedState.minimalocations = true;
    this.unresolvedState.minimavalues = true;
    this.unresolvedState.numberminima = true;
    this.unresolvedState.maxima = true;
    this.unresolvedState.maximalocations = true;
    this.unresolvedState.maximavalues = true;
    this.unresolvedState.numbermaxima = true;
    this.unresolvedState.extrema = true;
    this.unresolvedState.extremalocations = true;
    this.unresolvedState.extremavalues = true;
    this.unresolvedState.numberextrema = true;
  }

  markAllResolved() {
    delete this.unresolvedState.formula;
    delete this.unresolvedState.minima;
    delete this.unresolvedState.minimalocations;
    delete this.unresolvedState.minimavalues;
    delete this.unresolvedState.numberminima;
    delete this.unresolvedState.maxima;
    delete this.unresolvedState.maximalocations;
    delete this.unresolvedState.maximavalues;
    delete this.unresolvedState.numbermaxima;
    delete this.unresolvedState.extrema;
    delete this.unresolvedState.extremalocations;
    delete this.unresolvedState.extremavalues;
    delete this.unresolvedState.numberextrema;
  }

  calculateInterpolationPoints() {

    this.pointsWithX = [];
    this.pointsWithoutX = [];

    let allPoints = {
      maximum: this.state.prescribedMaxima,
      minimum: this.state.prescribedMinima,
      extremum: this.state.prescribedExtrema,
      point: this.state.prescribedPoints,
    }

    for (let type in allPoints) {
      for (let point of allPoints[type]) {
        let x, y, slope;
        if (point.x !== undefined) {
          x = point.x.evaluate_to_constant();
          if (!Number.isFinite(x)) {
            console.warn(`Ignoring non-numerical ${type}`);
            continue;
          }
        }
        if (point.y !== undefined) {
          y = point.y.evaluate_to_constant();
          if (!Number.isFinite(y)) {
            console.warn(`Ignoring non-numerical ${type}`);
            continue;
          }
        }
        if (point.slope !== undefined) {
          slope = point.slope.evaluate_to_constant();
          if (!Number.isFinite(slope)) {
            console.warn(`Ignoring non-numerical slope`);
            slope = undefined;
          }
        }
        if (x === undefined) {
          if (y === undefined) {
            console.warn(`Ignoring empty ${type}`);
            continue;
          }
          this.pointsWithoutX.push({
            type: type,
            y: y,
            slope: slope,
          });
        } else {
          this.pointsWithX.push({
            type: type,
            x: x,
            y: y,
            slope: slope,
          })
        }
      }
    }

    this.pointsWithX.sort((a, b) => a.x - b.x);
    this.pointsWithoutX.sort((a, b) => a.y - b.y);

    // don't allow multiple points with same x or very close x
    let xPrev = -Infinity;
    let eps = this.numerics.eps;
    for (let ind = 0; ind < this.pointsWithX.length; ind++) {
      let p = this.pointsWithX[ind];
      if (p.x <= xPrev + eps) {
        console.warn(`Two points with locations too close together.  Can't define function`);
        this.state.interpolationPoints = undefined;
        return;
      }
      xPrev = p.x;
    }

    let xscale = this.state.xscale;
    let yscale = this.state.yscale;

    xPrev = undefined;
    let yPrev, typePrev;
    this.state.interpolationPoints = [];

    let pNext = this.pointsWithX[0]
    for (let ind = 0; ind < this.pointsWithX.length; ind++) {
      let p = pNext;
      pNext = this.pointsWithX[ind + 1];
      let newPoint = this.addPointWithX({
        p: p,
        pNext: pNext,
        typePrev: typePrev,
        xPrev: xPrev,
        yPrev: yPrev
      });

      typePrev = newPoint.type;
      xPrev = newPoint.x;
      yPrev = newPoint.y;

    }

    // flag if next point will be first point added
    let firstPoint = false;
    if (this.pointsWithX.length === 0) {
      firstPoint = true;
    }

    // if points without X remain, keep adding with spacing of 2*xscale
    while (this.pointsWithoutX.length > 0) {
      // see if can find a point that can be added without any intermediates
      let findMatch;
      if (typePrev === undefined) {
        findMatch = this.getPointWithoutX({
          allowedTypes: ["maximum", "minimum", "extremum"],
          comparison: 'atLeast',
          value: -Infinity
        })
      } else if (typePrev === "maximum") {
        findMatch = this.getPointWithoutX({
          allowedTypes: ["minimum", "extremum"],
          comparison: 'atMost',
          value: yPrev - yscale
        })
      } else if (typePrev === "minimum") {
        findMatch = this.getPointWithoutX({
          allowedTypes: ["maximum", "extremum"],
          comparison: 'atLeast',
          value: yPrev + yscale
        })
      } else if (typePrev === "point") {
        findMatch = this.getPointWithoutX({
          allowedTypes: ["maximum", "extremum"],
          comparison: 'atLeast',
          value: yPrev + yscale
        });
        if (findMatch.success !== true) {
          findMatch = this.getPointWithoutX({
            allowedTypes: ["minimum", "extremum"],
            comparison: 'atMost',
            value: yPrev - yscale
          })
        }
      }

      let p;
      if (findMatch.success === true) {
        p = findMatch.point;
        this.pointsWithoutX.splice(findMatch.ind, 1)
        if (firstPoint) {
          p.x = 0;
          firstPoint = false;
        } else {
          p.x = xPrev + xscale;
        }

      } else {
        p = this.pointsWithoutX.pop();
        if (firstPoint) {
          p.x = 0;
          firstPoint = false;
        } else {
          // make scale larger, as know will need to add extra point
          p.x = xPrev + 2 * xscale;
        }
      }

      let newPoint = this.addPointWithX({
        p: p,
        typePrev: typePrev,
        xPrev: xPrev,
        yPrev: yPrev
      });

      typePrev = newPoint.type;
      xPrev = newPoint.x;
      yPrev = newPoint.y;
    }

    // used all prescribed point
    // now, add points at beginning and end to extrapolate

    // this.state.extapolateLinearBeginning = false;
    firstPoint = this.state.interpolationPoints[0];
    if (firstPoint.type === "maximum") {
      // add point before maximum, xscale to left and yscale below
      // and set slope so ends with parabola
      let newPoint = {
        type: "point",
        x: firstPoint.x - xscale,
        y: firstPoint.y - yscale,
        slope: 2 * yscale / xscale,
      };
      this.state.interpolationPoints.splice(0, 0, newPoint);

    } else if (firstPoint.type === "minimum") {
      // add point before minimum, xscale to left and yscale above
      // and set slope so ends with parabola
      let newPoint = {
        type: "point",
        x: firstPoint.x - xscale,
        y: firstPoint.y + yscale,
        slope: -2 * yscale / xscale,
      };
      this.state.interpolationPoints.splice(0, 0, newPoint);

    } else if (firstPoint.type === "point") {
      if (this.state.interpolationPoints.length === 1) {
        // if point is only point and slope isn't defined, set slope to zero
        if(firstPoint.slope === undefined) {
          firstPoint.slope = 0;
        }
      } else {
        let nextPoint = this.state.interpolationPoints[1];
        let secantslope = (nextPoint.y - firstPoint.y) / (nextPoint.x - firstPoint.x);
        if (nextPoint.type === "maximum" || nextPoint.type === "minimum") {
          if(firstPoint.slope === undefined) {
            // set slope so ends with parabola
            firstPoint.slope = 2 * secantslope;
          }
        } else {
          // two points in a row
          if (this.state.interpolationPoints.length === 2) {
            // only two points, make slope for a line if slope isn't determined
            if(firstPoint.slope === undefined) {
              firstPoint.slope = secantslope;
            }
          } else {
            // if slope of next point isn't defined
            // set next point slope according to monotonic formula
            if(nextPoint.slope === undefined) {
              nextPoint.slope = this.monotonicSlope({
                point: nextPoint,
                prevPoint: firstPoint,
                nextPoint: this.state.interpolationPoints[2]
              })
            }

            // if firstPoint slope is undefined
            // fit a quadratic from firstPoint to nextPoint
            // with slope matching that of nextPoint
            // Calculate resulting slope at firstPoint
            if(firstPoint.slope === undefined) {
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
          this.state.interpolationPoints.splice(0, 0, newPoint);
          // this.state.extapolateLinearBeginning = true;
        }
      }
    }

    // this.state.extapolateLinearEnding = false;

    let lastPoint = this.state.interpolationPoints[this.state.interpolationPoints.length - 1];
    if (lastPoint.type === "maximum") {
      // add point after maximum, xscale to right and yscale below
      // and set slope so ends with parabola
      let newPoint = {
        type: "point",
        x: lastPoint.x + xscale,
        y: lastPoint.y - yscale,
        slope: -2 * yscale / xscale,
      };
      this.state.interpolationPoints.push(newPoint);

    } else if (lastPoint.type === "minimum") {
      // add point after minimum, xscale to right and yscale above
      // and set slope so ends with parabola
      let newPoint = {
        type: "point",
        x: lastPoint.x + xscale,
        y: lastPoint.y + yscale,
        slope: 2 * yscale / xscale,
      };
      this.state.interpolationPoints.push(newPoint);

    } else if (lastPoint.type === "point") {
      if (this.state.interpolationPoints.length === 1) {
        // if point is only point
        // add a second point so that get a line
        let newPoint = {
          type: "point",
          x: lastPoint.x + xscale,
          y: lastPoint.y + firstPoint.slope*xscale,
          slope: firstPoint.slope,
        }
        this.state.interpolationPoints.push(newPoint);
      } else {
        let prevPoint = this.state.interpolationPoints[this.state.interpolationPoints.length - 2];
        let secantslope = (prevPoint.y - lastPoint.y) / (prevPoint.x - lastPoint.x);
        if (prevPoint.type === "maximum" || prevPoint.type === "minimum") {
          // if slope not defined
          // set slope so ends with parabola
          if(lastPoint.slope === undefined) {
            lastPoint.slope = 2 * secantslope;
          }
        } else {
          // two points in a row
          if (this.state.interpolationPoints.length === 2) {
            // only two points, make a line if slope not defined
            if(lastPoint.slope === undefined) {
              lastPoint.slope = secantslope;
            }
          } else {
            // if previous point slope is undefined
            // set previouse point slope according to monotonic formula
            if(prevPoint.slope === undefined) {
              prevPoint.slope = this.monotonicSlope({
                point: prevPoint,
                prevPoint: this.state.interpolationPoints[this.state.interpolationPoints.length - 3],
                nextPoint: lastPoint
              })
            }
            // if lastPoint slope is undefined
            // fit a quadratic from prevPoint to lastPoint
            // with slope matching that of prevPoint
            // Calculate resulting slope at lastPoint
            if(lastPoint.slope === undefined) {
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
          this.state.interpolationPoints.push(newPoint);
          // this.state.extapolateLinearEnding = true;
        }
      }
    }

    // for any interpolation points whose slope are not given
    // use slope from monotonic cubic interpolation 
    for (let ind = 1; ind < this.state.interpolationPoints.length - 1; ind++) {
      let point = this.state.interpolationPoints[ind];
      if (point.slope === undefined) {
        point.slope = this.monotonicSlope({
          point: point,
          prevPoint: this.state.interpolationPoints[ind - 1],
          nextPoint: this.state.interpolationPoints[ind + 1]
        })
      }
    }
  }

  monotonicSlope({ point, prevPoint, nextPoint }) {
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

  addPointWithX({ p, pNext, typePrev, xPrev, yPrev }) {
    let yscale = this.state.yscale;

    let yNext;
    if (pNext !== undefined) {
      yNext = pNext.y;
    }
    if (p.type === "maximum") {
      return this.addMaximum({
        x: p.x,
        y: p.y,
        typePrev: typePrev,
        xPrev: xPrev,
        yPrev: yPrev,
        yNext: yNext,
        pNext: pNext,
      });
    }
    else if (p.type === "minimum") {
      return this.addMinimum({
        x: p.x,
        y: p.y,
        typePrev: typePrev,
        xPrev: xPrev,
        yPrev: yPrev,
        yNext: yNext,
        pNext: pNext,
      });
    }
    else if (p.type === "extremum") {
      let typeNext;  // used only if there isn't a point before

      if (typePrev === undefined) {
        // nothing followed by extremum
        if (pNext === undefined) {
          // if nothing on either side, treat as a maximum
          return this.addMaximum({
            x: p.x,
            y: p.y,
            typePrev: typePrev,
            xPrev: xPrev,
            yPrev: yPrev,
            yNext: yNext,
            pNext: pNext,
          });
        }
        // set typeNext so following logic can test if this is the first point
        typeNext = pNext.type;

      }

      if (typePrev === "maximum" || typeNext === "maximum") {
        // maximum followed by extremum (or preceeded by in case this is first point)
        if (p.y !== undefined && p.y > yPrev - yscale) {
          // treat extremum as maximum,
          // as would need two extra points if it were a minimum
          return this.addMaximum({
            x: p.x,
            y: p.y,
            typePrev: typePrev,
            xPrev: xPrev,
            yPrev: yPrev,
            yNext: yNext,
            pNext: pNext,
          });
        } else if (typeNext !== undefined && p.y !== undefined && p.y > pNext.y - yscale) {
          // case where this is first point
          // treat extremum as maximum,
          // as would need two extra points if it were a minimum
          return this.addMaximum({
            x: p.x,
            y: p.y,
            typePrev: typePrev,
            xPrev: xPrev,
            yPrev: yPrev,
            yNext: yNext,
            pNext: pNext,
          });
        } else {
          // treat extremum as a minimum
          return this.addMinimum({
            x: p.x,
            y: p.y,
            typePrev: typePrev,
            xPrev: xPrev,
            yPrev: yPrev,
            yNext: yNext,
            pNext: pNext,
          });
        }
      } else if (typePrev === "minimum" || typeNext === "minimum") {
        // minimum followed by extremum (or preceeded by in case this is first point)
        if (p.y !== undefined && p.y < yPrev + yscale) {
          // treat extremum as minimum,
          // as would need two extra points if it were a maximum
          return this.addMinimum({
            x: p.x,
            y: p.y,
            typePrev: typePrev,
            xPrev: xPrev,
            yPrev: yPrev,
            yNext: yNext,
            pNext: pNext,
          });
        } else if (typeNext !== undefined && p.y !== undefined && p.y > pNext.y + yscale) {
          // case where this is first point
          // treat extremum as minimum,
          // as would need two extra points if it were a maximum
          return this.addMinimum({
            x: p.x,
            y: p.y,
            typePrev: typePrev,
            xPrev: xPrev,
            yPrev: yPrev,
            yNext: yNext,
            pNext: pNext,
          });
        } else {
          return this.addMaximum({
            x: p.x,
            y: p.y,
            typePrev: typePrev,
            xPrev: xPrev,
            yPrev: yPrev,
            yNext: yNext,
            pNext: pNext,
          });
        }
      } else if (typePrev === "point" || typeNext === "point") {
        // point followed by extremum (or preceeded by in case this is first point)
        let treatAs = "maximum";
        if (p.y === undefined && pNext !== undefined && pNext.type === maximum) {
          treatAs = "minimum";
        }
        else if (p.y !== undefined && p.y <= yPrev - yscale) {
          treatAs = "minimum";
        } else if (typeNext !== undefined && p.y !== undefined && p.y >= pNext.y - yscale) {
          treatAs = "minimum";
        }
        if (treatAs === "minimum") {
          return this.addMinimum({
            x: p.x,
            y: p.y,
            typePrev: typePrev,
            xPrev: xPrev,
            yPrev: yPrev,
            yNext: yNext,
            pNext: pNext,
          });
        }
        else {
          return this.addMaximum({
            x: p.x,
            y: p.y,
            typePrev: typePrev,
            xPrev: xPrev,
            yPrev: yPrev,
            yNext: yNext,
            pNext: pNext,
          });
        }
      }
    }
    else if (p.type === "point") {
      return this.addPoint({
        x: p.x,
        y: p.y,
        slope: p.slope,
        typePrev: typePrev,
        xPrev: xPrev,
        yPrev: yPrev,
        yNext: yNext,
        pNext: pNext,
      });
    }
  }

  addMaximum({ x, y, typePrev, xPrev, yPrev, yNext, pNext }) {
    let yscale = this.state.yscale;

    if (typePrev === undefined) {
      // nothing followed by maximum
      if (y === undefined) {
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
      if (y === undefined) {
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
      let results = this.getPointWithoutX({
        allowedTypes: ["minimum", "extremum"],
        comparison: 'atMost',
        value: yMin
      });
      if (results.success === true) {
        typeNew = "minimum"; // treat as minimum even if was extremum
        yNew = results.point.y;
        this.pointsWithoutX.splice(results.ind, 1);
        slopeNew = 0;
      }
      else {
        typeNew = "point";
        yNew = yMin;
      }
      this.state.interpolationPoints.push({
        type: typeNew,
        x: xNew,
        y: yNew,
        slope: slopeNew,
      });
    } else if (typePrev === "minimum") {
      // minimum followed by maximum
      if (y === undefined) {
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
            let results = this.getPointWithoutX({
              allowedTypes: findTypes[newPointNum],
              comparison: findComparisons[newPointNum],
              value: findValues[newPointNum],
            });
            if (results.success === true) {
              typeNew = findTypes[newPointNum][0]; // treat as min/max even if was extremum
              yNew = results.point.y;
              this.pointsWithoutX.splice(results.ind, 1);
              slopeNew = 0;
            }
            else {
              typeNew = "point";
              yNew = findValues[newPointNum];
              slopeNew = undefined;
            }
            this.state.interpolationPoints.push({
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
      if (y === undefined) {
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
          let results = this.getPointWithoutX({
            allowedTypes: ["minimum", "extremum"],
            comparison: 'atMost',
            value: y - yscale
          });
          if (results.success === true) {
            typeNew = "minimum"; // treat as minimum even if was extremum
            yNew = results.point.y;
            this.pointsWithoutX.splice(results.ind, 1);
            slopeNew = 0;
          }
          else {
            typeNew = "point";
            yNew = y - yscale;
          }
          this.state.interpolationPoints.push({
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
    this.state.interpolationPoints.push(newMaximum);
    return newMaximum;
  }

  addMinimum({ x, y, typePrev, xPrev, yPrev, yNext, pNext }) {
    let yscale = this.state.yscale;

    if (typePrev === undefined) {
      // nothing followed by minimum
      if (y === undefined) {
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
      if (y === undefined) {
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
            let results = this.getPointWithoutX({
              allowedTypes: findTypes[newPointNum],
              comparison: findComparisons[newPointNum],
              value: findValues[newPointNum],
            });
            if (results.success === true) {
              typeNew = findTypes[newPointNum][0]; // treat as min/max even if was extremum
              yNew = results.point.y;
              this.pointsWithoutX.splice(results.ind, 1);
              slopeNew = 0;
            }
            else {
              typeNew = "point";
              yNew = findValues[newPointNum];
              slopeNew = undefined;
            }
            this.state.interpolationPoints.push({
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
      if (y === undefined) {
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
      let results = this.getPointWithoutX({
        allowedTypes: ["maximum", "extremum"],
        comparison: 'atLeast',
        value: yMax
      });
      if (results.success === true) {
        typeNew = "maximum"; // treat as maximum even if was extremum
        yNew = results.point.y;
        this.pointsWithoutX.splice(results.ind, 1);
        slopeNew = 0;
      }
      else {
        typeNew = "point";
        yNew = yMax;
      }
      this.state.interpolationPoints.push({
        type: typeNew,
        x: xNew,
        y: yNew,
        slope: slopeNew,
      });
    } else if (typePrev === "point") {
      // point followed by minimum
      if (y === undefined) {
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
          let results = this.getPointWithoutX({
            allowedTypes: ["maximum", "extremum"],
            comparison: 'atLeast',
            value: y + yscale
          });
          if (results.success === true) {
            typeNew = "maximum"; // treat as maximum even if was extremum
            yNew = results.point.y;
            this.pointsWithoutX.splice(results.ind, 1);
            slopeNew = 0;
          }
          else {
            typeNew = "point";
            yNew = y + yscale;
          }
          this.state.interpolationPoints.push({
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
    this.state.interpolationPoints.push(newMinimum);
    return newMinimum;
  }

  addPoint({ x, y, slope, typePrev, xPrev, yPrev, yNext, pNext }) {
    let yscale = this.state.yscale;

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
        let results = this.getPointWithoutX({
          allowedTypes: ["minimum", "extremum"],
          comparison: 'atMost',
          value: yMin
        });
        if (results.success === true) {
          typeNew = "minimum"; // treat as minimum even if was extremum
          yNew = results.point.y;
          this.pointsWithoutX.splice(results.ind, 1);
          slopeNew = 0;
        }
        else {
          typeNew = "point";
          yNew = yPrev - yscale;
        }
        this.state.interpolationPoints.push({
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
        let results = this.getPointWithoutX({
          allowedTypes: ["maximum", "extremum"],
          comparison: 'atLeast',
          value: yMax
        });
        if (results.success === true) {
          typeNew = "maximum"; // treat as maximum even if was extremum
          yNew = results.point.y;
          this.pointsWithoutX.splice(results.ind, 1);
          slopeNew = 0;
        }
        else {
          typeNew = "point";
          yNew = yPrev + yscale;
        }
        this.state.interpolationPoints.push({
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
    this.state.interpolationPoints.push(newPoint);
    return newPoint;
  }

  getPointWithoutX({ allowedTypes, comparison, value }) {
    // try to find a function in pointsWithoutX of allowed type
    // whose y value fits the criterion specified by comparison and value
    // comparison must be either "atMost" or "atLeast"

    // since pointsWithoutMax are sort in increasing y value
    // search in reverse order if comparison is atMost
    // that way, find the point that is closest to the criterion
    let inds = [];
    if (comparison === "atMost") {
      inds = Object.keys(this.pointsWithoutX).reverse();
    } else if (comparison === "atLeast") {
      inds = Object.keys(this.pointsWithoutX);
    } else {
      return { success: false }
    }

    // prefer first allowed types, so search them in order
    for (let type of allowedTypes) {
      for (let ind of inds) {
        let p = this.pointsWithoutX[ind];

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

  computeSplineParamCoeffs() {

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

    if (this.state.interpolationPoints === undefined) {
      this.state.xs = undefined;
      return;
    }

    this.state.coeffs = [];
    this.state.xs = [];

    let p0;
    let p1 = this.state.interpolationPoints[0];
    this.state.xs.push(p1.x);
    for (let ind = 1; ind < this.state.interpolationPoints.length; ind++) {
      p0 = p1;
      p1 = this.state.interpolationPoints[ind];
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
      this.state.coeffs.push(c);

      this.state.xs.push(p1.x);
    }

    // // make sure get linear even in presence of round-off error
    // if(this.state.extapolateLinearBeginning) {
    //   this.state.coeffs[0][2] = 0;
    //   this.state.coeffs[0][3] = 0;
    // }
    // // make sure get linear even in presence of round-off error
    // if(this.state.extapolateLinearEnding) {
    //   let n = this.state.coeffs.length;
    //   this.state.coeffs[n-1][2] = 0;
    //   this.state.coeffs[n-1][3] = 0;
    // }

  }

  interpolatedF(x) {

    if (isNaN(x)) {
      return NaN;
    }

    if (this.state.xs === undefined) {
      return NaN;
    }

    if (x < this.state.xs[0]) {
      // Extrapolate
      x -= this.state.xs[0];
      let c = this.state.coeffs[0];
      return (((c[3] * x + c[2]) * x + c[1]) * x + c[0]);
    }

    if (x > this.state.xs[this.state.xs.length - 1]) {
      let i = this.state.xs.length - 2;
      // Extrapolate
      x -= this.state.xs[i];
      let c = this.state.coeffs[i];
      return (((c[3] * x + c[2]) * x + c[1]) * x + c[0]);
    }

    // Search for the interval x is in,
    // returning the corresponding y if x is one of the original xs
    var low = 0, mid, high = this.state.xs.length - 1;
    while (low <= high) {
      mid = Math.floor(0.5 * (low + high));
      let xHere = this.state.xs[mid];
      if (xHere < x) { low = mid + 1; }
      else if (xHere > x) { high = mid - 1; }
      else { return this.state.interpolationPoints[mid].y; }
    }
    let i = Math.max(0, high);

    // Interpolate
    x -= this.state.xs[i];
    let c = this.state.coeffs[i];
    return (((c[3] * x + c[2]) * x + c[1]) * x + c[0]);

  }

  returnNumericF() {
    if (this.state.f !== undefined) {
      return this.state.f;
    } else if (this.state.numericF !== undefined) {
      return this.state.numericF;
    } else {
      return this.interpolatedF;
    }
  }

  returnF() {
    let formula = this.state.formula;
    if (formula !== undefined) {
      let varString = this.state.variable.tree;
      return function (x) {
        return formula.substitute({ [varString]: x })
      }
    }
    return x => me.fromAst(this.returnNumericF()(x.evaluate_to_constant()))

  }

  // allow to adapt into curve
  get nAdapters() {
    return 1;
  }

  getAdapter(ind) {

    if (ind >= 1) {
      return;
    }

    let downDep = {
      dependencyType: "adapter",
      adapter: "curve",
    }

    // TODO: if unresolved, should pass unresolvedState to curve

    return {
      componentType: "curve",
      downstreamDependencies: {
        [this.componentName]: downDep
      },
      state: { functionComponentName: this.componentName }
    };

  }

  getMinimaLocations() {
    return this.getMinima().map(x => x.tree[1]);
  }

  getMinimaValues() {
    return this.getMinima().map(x => x.tree[2]);
  }

  getMinima() {

    if (Object.keys(this.unresolvedState).length > 0) {
      return [];
    }

    if (this.state.computedMinima !== undefined) {
      return this.state.computedMinima;
    }

    this.currentTracker.trackChanges.logPotentialChange({
      component: this,
      variable: "minima",
      oldValue: undefined,
    })
    this.currentTracker.trackChanges.logPotentialChange({
      component: this,
      variable: "minimalocations",
      oldValue: undefined,
    });
    this.currentTracker.trackChanges.logPotentialChange({
      component: this,
      variable: "minimavalues",
      oldValue: undefined,
    });
    this.currentTracker.trackChanges.logPotentialChange({
      component: this,
      variable: "numberminima",
      oldValue: undefined,
    });

    if (this.state.formula !== undefined || this.state.numericF !== undefined) {

      let f = this.returnNumericF();

      // for now, look for minima in interval -100*xscale to 100*xscale
      // dividing interval into 1000 subintervals
      let minx = -100 * this.state.xscale;
      let maxx = 100 * this.state.xscale;
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

        let result = this.numerics.fminbr(f, [xleft, xright]);
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

      this.state.computedMinima = minimaList;
      return minimaList;

    }

    // no formula, so based on spline

    let xs = this.state.xs;
    let coeffs = this.state.coeffs;
    let eps = this.numerics.eps;

    if (xs === undefined) {
      return this.state.computedMinima = [];
    }

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

    this.state.computedMinima = minimaList;
    return minimaList;

  }

  getMaximaLocations() {
    return this.getMaxima().map(x => x.tree[1]);
  }

  getMaximaValues() {
    return this.getMaxima().map(x => x.tree[2]);
  }

  getMaxima() {

    if (Object.keys(this.unresolvedState).length > 0) {
      return [];
    }

    if (this.state.computedMaxima !== undefined) {
      return this.state.computedMaxima;
    }

    this.currentTracker.trackChanges.logPotentialChange({
      component: this,
      variable: "maxima",
      oldValue: undefined,
    });
    this.currentTracker.trackChanges.logPotentialChange({
      component: this,
      variable: "maximalocations",
      oldValue: undefined,
    });
    this.currentTracker.trackChanges.logPotentialChange({
      component: this,
      variable: "maximavalues",
      oldValue: undefined,
    });
    this.currentTracker.trackChanges.logPotentialChange({
      component: this,
      variable: "numbermaxima",
      oldValue: undefined,
    });

    if (this.state.formula !== undefined || this.state.numericF !== undefined) {

      let originalF = this.returnNumericF();

      let f = x => -originalF(x);

      // for now, look for maxima in interval -100*xscale to 100*xscale
      // dividing interval into 1000 subintervals
      let minx = -100 * this.state.xscale;
      let maxx = 100 * this.state.xscale;
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

        let result = this.numerics.fminbr(f, [xleft, xright]);
        if (result.success !== true) {
          continue;
        }
        let x = result.x;
        let fx = result.fx;

        if (fleft < fx) {
          if (maximumAtPreviousRight) {
            if (Number.isFinite(fleft)) {
              maximaList.push(me.fromAst(["tuple", xleft, -fleft]));
            }
          }
          maximumAtPreviousRight = false;
        } else if (fright < fx) {
          maximumAtPreviousRight = true;
        } else {
          maximumAtPreviousRight = false;

          // make sure it actually looks like a strict maximum of -f(x)
          if (fx < fright && fx < fleft &&
            fx < f(x + result.tol) && fx < f(x - result.tol) &&
            Number.isFinite(fx)) {
            maximaList.push(me.fromAst(["tuple", x, -fx]));
          }
        }

      }

      this.state.computedMaxima = maximaList;
      return maximaList;

    }


    // no formula, so based on spline

    let xs = this.state.xs;
    let coeffs = this.state.coeffs;
    let eps = this.numerics.eps;

    if (xs === undefined) {
      return this.state.computedMaxima = [];
    }

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

    this.state.computedMaxima = maximaList;
    return maximaList;

  }

  getExtremaLocations() {
    return this.getExtrema().map(x => x.tree[1]);
  }

  getExtremaValues() {
    return this.getExtrema().map(x => x.tree[2]);
  }

  getExtrema() {

    if (Object.keys(this.unresolvedState).length > 0) {
      return [];
    }

    if (this.state.computedExtrema !== undefined) {
      return this.state.computedExtrema;
    }

    this.currentTracker.trackChanges.logPotentialChange({
      component: this,
      variable: "extrema",
      oldValue: undefined,
    });
    this.currentTracker.trackChanges.logPotentialChange({
      component: this,
      variable: "extremalocations",
      oldValue: undefined,
    });
    this.currentTracker.trackChanges.logPotentialChange({
      component: this,
      variable: "extremavalues",
      oldValue: undefined,
    });
    this.currentTracker.trackChanges.logPotentialChange({
      component: this,
      variable: "numberextrema",
      oldValue: undefined,
    });


    let minima = this.getMinima();
    let maxima = this.getMaxima();
    let extrema = [...minima, ...maxima].sort((a, b) => a.tree[1] - b.tree[1]);
    this.state.computedExtrema = extrema;

    return extrema;

  }

}