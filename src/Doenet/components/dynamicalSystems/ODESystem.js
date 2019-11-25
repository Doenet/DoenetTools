import InlineComponent from '../abstract/InlineComponent';
import me from 'math-expressions';

export default class ODESystem extends InlineComponent {
  static componentType = "odesystem";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.independentvariable = {default: me.fromAst('t')};
    properties.initialindependentvariablevalue = {default: me.fromAst(0)};
    properties.displaydigits = {default: 14};
    properties.rendermode = {default: "align"};
    properties.chunksize = {default: 10};
    properties.tolerance = {default: 1e-6}
    properties.maxIterations = {default: 1000}
    properties.hideInitialCondition = {default: false};
    return properties;
  }

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.deleteAllLogic();

    let atMostOneVariables = childLogic.newLeaf({
      name: 'atMostOneVariables',
      componentType: 'variables',
      comparison: 'atMost',
      number: 1,
    });

    let atLeastZeroRHSs = childLogic.newLeaf({
      name: 'atLeastZeroRHSs',
      componentType: 'righthandside',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroInitialConditions = childLogic.newLeaf({
      name: 'atLeastZeroInitialConditions',
      componentType: 'initialcondition',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "ODEsystemLogic",
      operator: "and",
      propositions: [atMostOneVariables, atLeastZeroRHSs, atLeastZeroInitialConditions],
      setAsBase: true,
    })
    
    return childLogic;

  }


  updateState(args={}) {
    if(args.init === true) {
      this.makePublicStateVariableArray({
        variableName: "variables",
        componentType: "variable",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "var",
        arrayVariableName: "variables",
      });

      this.makePublicStateVariableArray({
        variableName: "rhss",
        componentType: "righthandside",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "rhs",
        arrayVariableName: "rhss",
      });
      this.makePublicStateVariableAlias({
        variableName: "rhs",
        targetName: "rhs",
        arrayIndex: '1',
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "righthandside",
        arrayVariableName: "rhss",
      });
      this.makePublicStateVariableAlias({
        variableName: "righthandside",
        targetName: "rhs",
        arrayIndex: '1',
      });
      this.makePublicStateVariableAlias({
        variableName: "righthandsides",
        targetName: "rhss",
      });

      this.makePublicStateVariableArray({
        variableName: "initialconditions",
        componentType: "initialcondition",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "initialcondition",
        arrayVariableName: "initialconditions",
      });
      this.makePublicStateVariableAlias({
        variableName: "initialcondition",
        targetName: "initialcondition",
        arrayIndex: '1',
      });

      
      this.makePublicStateVariableArray({
        variableName: "numericalsolutions",
        componentType: "function",
        stateVariableForRef: "numericF",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "numericalsolution",
        arrayVariableName: "numericalsolutions",
      });
      this.makePublicStateVariableAlias({
        variableName: "numericalsolution",
        targetName: "numericalsolution",
        arrayIndex: '1',
      });

    }
    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.variables = true;
      this.unresolvedState.rhss = true;
      this.unresolvedState.initialconditions = true;
      this.unresolvedState.numericalsolutions = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {

      let atMostOneVariables = this.childLogic.returnMatches("atMostOneVariables");
      if(atMostOneVariables.length === 1) {
        this.state.variablesChild = this.activeChildren[atMostOneVariables[0]];
      }else {
        delete this.state.variablesChild;

        this.state.validVariables = [];
        if(!this._state.variables.essential) {
          // variables not specified by children or essential state
          // initialize as empty
          // variable will be determined by RHSs, or defaults will be chosen
          this.state.variables = [];
        }
      }
  
      let atLeastZeroRHSs = this.childLogic.returnMatches("atLeastZeroRHSs");
      this.state.rhsChildren = atLeastZeroRHSs.map(x => this.activeChildren[x]);

      let atLeastZeroInitialConditions = this.childLogic.returnMatches("atLeastZeroInitialConditions");
      this.state.initialConditionChildren = atLeastZeroInitialConditions.map(x => this.activeChildren[x]);
  
    }

    let variablesChanged = 
      trackChanges.getVariableChanges({component: this, variable: "variables"}) ||
      trackChanges.getVariableChanges({component: this, variable: "independentvariable"}) ||
      this.state.rhsChildren.some(x => 
        trackChanges.getVariableChanges({component: x, variable: "variable"})
      ) || this.state.initialConditionChildren.some(x=>
        trackChanges.getVariableChanges({component: x, variable: "variable"})
      );


    if(this.state.variablesChild) {
      if(this.state.variablesChild.unresolvedState.variables) {
        this.unresolvedState.variables = true;
      }else if(childrenChanged || variablesChanged || trackChanges.getVariableChanges({
        component: this.state.variablesChild, variable: "variables"
      })) {

        variablesChanged = true;
        this.state.variables = [...this.state.variablesChild.state.variables];

        // check if variables are unique
        for(let ind1=0; ind1 < this.state.variables.length; ind1++) {
          let var1 = this.state.variables[ind1];
          if(this.state.independentvariable.equals(var1)) {
            let message = "Variables of odesystem must be different than independent variable.";
            console.warn(message);
          }
          for(let ind2=0; ind2<ind1; ind2++) {
            if(this.state.variables[ind2].equals(var1)) {
              let message = "Variables of odesystem must be unique."
              console.warn(message);
            }
          }
        }
      }

      if(this.state.variablesChild.unresolvedState.validVariables) {
        this.unresolvedState.validVariables = true;
      }else if(childrenChanged || variablesChanged || trackChanges.getVariableChanges({
        component: this.state.variablesChild, variable: "validVariables"
      })) {
        variablesChanged = true;
        this.state.validVariables = [...this.state.variablesChild.state.validVariables];
      }

    }else if(variablesChanged) {
      this.state.validVariables = [];
      if(!this._state.variables.essential) {
        // variables not specified by children or essential state
        // initialize as empty
        // variable will be determined by RHSs, or defaults will be chosen
        this.state.variables = [];
      }
    }


    if(this.state.rhsChildren.some(
        x => x.unresolvedState.variable || x.unresolvedState.value
      ) || this.state.initialConditionChildren.some(
        x => x.unresolvedState.variable || x.unresolvedState.value
      )
    ) {
      this.unresolvedState.variables = true;
      this.unresolvedState.rhss = true;
      this.unresolvedState.initialconditions = true;
      this.unresolvedState.numericalsolutions = true;
      return;
    }

    let recalculateSystem = childrenChanged || variablesChanged ||
      this.state.rhsChildren.some(x => 
        trackChanges.getVariableChanges({component: x, variable: "value"})
      ) || this.state.initialConditionChildren.some(x=>
        trackChanges.getVariableChanges({component: x, variable: "value"})
      );


    if(recalculateSystem) {

      this.state.rhss = [];
      let varsToDefine = new Set();
      let childrenAssigned = new Set();

      // in the first pass through rhsChild
      // assign only those who have a variable that matches one of the variables
      // that are determined already
      // Rationale: these rhsChild have no flexibility in their position
      // they must take the position of that variable
      for(let [childInd, rhsChild] of this.state.rhsChildren.entries()) {
        let variableForRHS = rhsChild.state.variable;
        let RHSind;
        if(variableForRHS !== undefined) {
          // variableForRHS was defined directly by rhsChild
          // find variable in variables
          RHSind = this.state.variables.findIndex(x => x && x.equals(variableForRHS));
          if(RHSind !== -1) {
            // found a matching variable so have determined the index
            if(this.state.rhss[RHSind] === undefined) {
              this.state.rhss[RHSind] = rhsChild.state.value;
              childrenAssigned.add(childInd);

            }else {
              let message = "Duplicate variable " + variableForRHS + " in rhs of odesystem.";
              console.warn(message);
            }
          }
        }
      }

      // second pass through rhsChildren
      // 1. If rhsChild doesn't define a variable
      //    assign to first open rhs index
      //    If, in addition, that variable slot is not defined
      //    mark that variable slot as needing to be defined
      // 2  If rhs does define a variable
      //    check to make sure variable isn't defined
      //    (since matches with original variables would have been caught in first pass,
      //    a match now indicates a duplicate variable)
      //    assign to first open variable slot
      for(let [childInd, rhsChild] of this.state.rhsChildren.entries()) {
        if(childrenAssigned.has(childInd)) {
          // skip children already assigned in first pass
          continue;
        }

        let variableForRHS = rhsChild.state.variable;
        let RHSind;
        if(variableForRHS === undefined) {
          // find first index of RHS that is undefined
          RHSind = this.state.rhss.findIndex(x=>!x);
          if(RHSind === -1) {
            // didn't find an empty index, so will append entry to RHS
            RHSind = this.state.rhss.length;
          }
          this.state.rhss[RHSind] = rhsChild.state.value;

          // find variable associated with this index
          variableForRHS = this.state.variables[RHSind];
          if(variableForRHS === undefined) {
            varsToDefine.add(RHSind);
            // put in a placeholder in this slot of variables
            // so that a later RHS with a defined variables
            // won't take it using the below algorithm
            this.state.variables[RHSind] = me.fromAst('\uFF3F\uFF3F');  // two long underscores
          }
        }else {
          // variableForRHS was defined directly by rhsChild
          
          // first make sure the variable isn't already defined
          RHSind = this.state.variables.findIndex(x => x && x.equals(variableForRHS));
          if(RHSind !== -1) {
            let message = "Duplicate variable " + variableForRHS + " in rhs of odesystem.";
            if(args.init) {
              throw Error(message);
            }else {
              message += " Repeated rhs with same variable are ignored";
              console.warn(message);
            }
          }else {
            // find first empty slot in variables
            RHSind = this.state.variables.findIndex(x => !x);
            if(RHSind===-1) {
              // no empty slots, so append to end
              RHSind = this.state.variables.length;
            }
            this.state.rhss[RHSind] = rhsChild.state.value;
            this.state.variables[RHSind] = variableForRHS;
            if(rhsChild._state.variable.additionalVars) {
              this.state.validVariables[RHSind] = rhsChild._state.variable.additionalVars.validVariable;
            }
          }
        }
      }

      // delete placeholders in variables so that
      // initial conditions could define the variable in those slots
      for(let ind of varsToDefine) {
        this.state.variables[ind] = undefined;
      } 

      // repeat essentially same algorithm for initial conditions
      childrenAssigned = new Set();

      this.state.initialconditions = [];

      // first pass through initialConditionChildren
      // (as described above for rhsChildren)

      // the only difference is that we will count
      // - the number of initial conditions without variables, and
      // - the number of initial conditions with a variable matched to an existing variable
      let numICsWithoutVariables=0;
      let numICsAssignedVariables = 0;

      for(let [childInd,initialChild] of this.state.initialConditionChildren.entries()) {
        let variableForIC = initialChild.state.variable;
        let ICind;
        if(variableForIC === undefined) {
          numICsWithoutVariables++;
        }else{
          // variableForIC was defined directly by initialChild
          // find variable in variables
          ICind = this.state.variables.findIndex(x => x && x.equals(variableForIC));
          if(ICind === -1) {
            // numICsWithUnassignedVariables++;
          }else {
            numICsAssignedVariables++;
            // found a matching variable so have determined the index
            if(this.state.initialconditions[ICind] === undefined) {
              this.state.initialconditions[ICind] = initialChild.state.value;
              childrenAssigned.add(childInd);
            }else {
              let message = "Duplicate variable " + variableForIC + " in initial condtion of odesystem.";
              if(args.init) {
                throw Error(message);
              }else {
                message += " Repeated initial conditions with same variable are ignored";
                console.warn(message);
              }
            }
          }
        }
      }


      // second pass through initialConditionChildren
      // Algorithm described above for rhsChildren, with following difference
      // that is caused by the fact that we now may have empty variable slots
      // (varsToDefine) in the middle of the variable array

      // We don't want to create extra variables unless required.
      // Hence, to the extent that is possible, we want to 
      //   - match initial conditions with unassigned variables
      //     with the empty variable slots (varsToDefine), and
      //   - match initial conditions without variables to the defined variables
      // If we have more initial condtions without variables than defined variables
      // then we will match some initial conditions without variables to empty slots
      // (i.e., leave them unassigned)

      let numDefinedVariablesLeft = this.state.variables.length 
        - varsToDefine.size - numICsAssignedVariables;
      let numToLeaveUnassigned = Math.max(0, numICsWithoutVariables - numDefinedVariablesLeft);

      for(let [childInd,initialChild] of this.state.initialConditionChildren.entries()) {
        if(childrenAssigned.has(childInd)) {
          // skip children already assigned in first pass
          continue;
        }

        let variableForIC = initialChild.state.variable;
        let ICind;
        if(variableForIC === undefined) {
          // find first index of initialConditions that is undefined
          ICind = this.state.initialconditions.findIndex(x=>!x);
          if(ICind === -1) {
            // didn't find an empty index, so will append entry to initialConditions
            ICind = this.state.initialconditions.length;
          }

          // find variable associated with this index
          variableForIC = this.state.variables[ICind];
          if(variableForIC === undefined) {
            // we found an empty variable slot that matched with an initial condition
            // that doesn't have a variable.
            // Check to see if we are allowed to leave IC unassigned
            if(numToLeaveUnassigned > 0) {
              // we are allowed to match this IC with an empty slot
              numToLeaveUnassigned--;

              // it is possible that we're not at an variable empty slot
              // but are past the end of the variables array
              // so add index to varsToDefine to be sure
              varsToDefine.add(ICind);

              // put in a placeholder in this slot of variables
              // so that a later initial condition with a defined variables
              // won't take it using the below algorithm
              this.state.variables[ICind] = me.fromAst('\uFF3F\uFF3F');  // two long underscores
            } else {
              // we can't assign this IC to an empty slot
              // so we look for the next variable that is defined
              while(ICind < this.state.variables.length-1) {
                ICind++;
                variableForIC = this.state.variables[ICind];
                if(variableForIC !== undefined) {
                  break;
                }
              }
            }
          }

          this.state.initialconditions[ICind] = initialChild.state.value;

        }else {
          // variableForIC was defined directly by initialChild

          // first make sure the variable isn't already defined
          ICind = this.state.variables.findIndex(x => x && x.equals(variableForIC));
          if(ICind !== -1) {
            let message = "Duplicate variable " + variableForIC + " in initial conditions of odesystem.";
            if(args.init) {
              throw Error(message);
            }else {
              message += " Repeated initial conditions with same variable are ignored";
              console.warn(message);
            }
          }else {
            // find first empty slot in variables
            ICind = this.state.variables.findIndex(x => !x);
            if(ICind===-1) {
              // no empty slots, so append to end
              ICind = this.state.variables.length;
            } else{
              // found an empty slot
              // this slot could have been marked in the RHS loop
              // so delete it from varsToDefine since it is now defined
              varsToDefine.delete(ICind)
            }
            this.state.initialconditions[ICind] = initialChild.state.value;
            this.state.variables[ICind] = variableForIC;
          }
        }
      }

      if(varsToDefine.size >0) {
        varsToDefine = [...varsToDefine].sort();
        // fill in any variable names that haven't been defined yet

        let defaultVars = [];
        for(let ind=0; ind<this.state.variables.length; ind++) {
          let defVar;
          if(ind < 3) {
            defVar = me.fromAst(["x","y","z"][ind]);
          } else {
            defVar = me.fromAst(['_', 'x', ind+1]);
          }
          // if isn't in variables already, add it to defaultVars
          if(this.state.variables.findIndex(x => x && x.equals(defVar))===-1) {
            defaultVars.push(defVar);
          }
        }

        defaultVars.reverse();

        for(let ind of varsToDefine) {
          // find first default var that hasn't been used yet
          this.state.variables[ind] = defaultVars.pop();
        }
      }

      this.state.nDimensions = this.state.variables.length;
        
      // fill in any missing rhs and initial conditions with 0
      for(let ind in this.state.variables) {
        if(!this.state.rhss[ind]) {
          this.state.rhss[ind] = me.fromAst(0);
        }
        if(!this.state.initialconditions[ind]) {
          this.state.initialconditions[ind] = me.fromAst(0);
        }
      }
    }

    if(recalculateSystem || trackChanges.getVariableChanges({
      component: this, variable: "hideInitialCondition"
    }) || trackChanges.getVariableChanges({
      component: this, variable: "displaydigits"
    }) || trackChanges.getVariableChanges({
      component: this, variable: "independentvariable"
    }) || trackChanges.getVariableChanges({
      component: this, variable: "initialindependentvariablevalue"
    }) || trackChanges.getVariableChanges({
      component: this, variable: "initialconditions"
    })) {
        
      let systemDisplay = [];
      for(let [varInd, rhs] of this.state.rhss.entries()) {
        let variable = this.state.variables[varInd];
        let latex = '\\frac{\\mathrm{d} ' + variable.toLatex() +
          ' }{ \\mathrm{d} ' + this.state.independentvariable .toLatex() + ' } &= ' +
          rhs.round_numbers_to_precision(this.state.displaydigits).toLatex();
        systemDisplay.push(latex);
      }

      if(!this.state.hideInitialCondition) {
        for(let [varInd, ic] of this.state.initialconditions.entries()) {
          let variable = this.state.variables[varInd];
          let latex = variable.toLatex() + ' ( ' +
            this.state.initialindependentvariablevalue + ' ) &= ' +
            ic.round_numbers_to_precision(this.state.displaydigits).toLatex();
          systemDisplay.push(latex);
        }
      }
    
      this.state.latex = systemDisplay.join('\\\\');
    }

    if(recalculateSystem || trackChanges.getVariableChanges({
      component: this, variable: "chunksize"
    }) || trackChanges.getVariableChanges({
      component: this, variable: "tolerance"
    }) || trackChanges.getVariableChanges({
      component: this, variable: "maxIterations"
    }) || trackChanges.getVariableChanges({
      component: this, variable: "independentvariable"
    }) || trackChanges.getVariableChanges({
      component: this, variable: "initialindependentvariablevalue"
    }) || trackChanges.getVariableChanges({
      component: this, variable: "initialconditions"
    })) {
  
      this.state.fnumericRHS = this.returnNumericRHSfunction();

      this.state.t0 = this.state.initialindependentvariablevalue.evaluate_to_constant();
      this.state.x0s = this.state.initialconditions.map(x => x.evaluate_to_constant());

      if(!Number.isFinite(this.state.t0) || !this.state.x0s.every(x=>Number.isFinite(x))) {
        this.state.nonNumericValues = true;
      }else {
        delete this.state.nonNumericValues;
      }

      this.state.calculatedNumericSolutions = [];
      this.state.endingNumericalValues = [];
      this.state.maxPossibleTime = undefined;

      this.state.numericalsolutions = this.state.variables.map((_,i) => this.returnNumericSolution(i))

      // explicitly add new value for numericalsolutions
      // so change is detected even if functions look the same
      trackChanges.addNewValue(this, "numericalsolutions");

    }
  }


  returnNumericRHSfunction(ind) {
    let rhss = this.state.rhss;
    if(ind !== undefined) {
      let rhs = rhss[ind];
      if(rhs === undefined) {
        return;
      }
      rhss = [rhs];
    }

    let fs;
    try {
      fs = rhss.map(x=>x.subscripts_to_strings().f());
    }catch(e) {
      console.warn("Cannot define ODE RHS function.  Error creating mathjs function");
      return _ => NaN;
    }

    if(this._state.independentvariable.additionalVars && 
        !this._state.independentvariable.additionalVars.validVariable) {
      console.warn("Can't define ODE RHS function with invalid independent variable.");
      return _ => NaN;
    }

    if(this.state.validVariables.some(x => x===false)) {
      console.warn("Can't define ODE RHS function with dependent variables.");
      return _ => NaN;
    }

    // independent variable first, followed by dependent variables
    let indVarName = this.state.independentvariable.subscripts_to_strings().tree;
    let varNames = this.state.variables.map(x=>x.subscripts_to_strings().tree);

    if(varNames.includes(indVarName)) {
      console.warn("Can't define ODE RHS function when independent variable is a dependent varaible");
      return _ => NaN;
    }
    if([...new Set(varNames)].length !== varNames.length) {
      console.warn("Can't define ODE RHS function with duplicate dependent varaible names");
      return _ => NaN;
    }

    return function(t, x) {
      let fargs = {[indVarName]: t};
      if(Array.isArray(x)) {
        x.forEach((v,i) => fargs[varNames[i]] = v);
      }else {
        fargs[varNames[0]]=x;
      }
      try {
        return fs.map(f =>f(fargs));
      }catch(e) {
        return NaN;
      }
    }
  }

  returnNumericSolution(ind) {
    return function f(t) {
      if(this.state.nonNumericValues) {
        return NaN;
      }
      if(!Number.isFinite(t)) {
        return NaN;
      }
      if(t === this.state.t0) {
        if(ind !== undefined) {
          return this.state.x0s[ind];
        }else {
          return this.state.x0s;
        }
      }
      let nChunksCalculated = this.state.calculatedNumericSolutions.length;
      let chunk = Math.ceil((t-this.state.t0)/this.state.chunksize)-1;
      if(chunk < 0) {
        // console.log("Haven't yet implemented integrating ODE backward")
        return NaN;
      }
      if(this.state.maxPossibleTime === undefined && chunk >= nChunksCalculated) {
        for(let tind = nChunksCalculated; tind <= chunk; tind++) {
          let x0 = this.state.endingNumericalValues[tind-1];
          if(x0 === undefined) {
            x0 = this.state.x0s;
          }
          let t0 = this.state.t0 + tind*this.state.chunksize;
          let result = me.math.dopri(
            t0,
            t0+this.state.chunksize,
            x0,
            this.state.fnumericRHS,
            this.state.tolerance,
            this.state.maxIterations,
          )
          this.state.endingNumericalValues.push(result.y[result.y.length-1]);
          this.state.calculatedNumericSolutions.push(result.at.bind(result));

          let endingTime = result.x[result.x.length-1];
          if(endingTime < (t0+this.state.chunksize)*(1-1e-6)) {
            this.state.maxPossibleTime = endingTime;
            let message = "For chunksize " + this.state.chunksize
              + " and tolerance " + this.state.tolerance
              + ", odesystem"
            if(this.doenetAttributes.componentName !== undefined) {
              message += " (" + this.doenetAttributes.componentName + ")"
            }
            message += " hit maxiterations (" + this.state.maxIterations
              + ") at t = " + this.state.maxPossibleTime
              + ". Will not calculate solution beyond that time."
              + " Decrease chunksize, increase maxiterations, or increase tolerance to calculate further.";
            console.warn(message);
            break;
          }
        }
      }

      if(t > this.state.maxPossibleTime) {
        return NaN;
      }
      let value = this.state.calculatedNumericSolutions[chunk](t);

      if(ind !== undefined) {
        value = value[ind]
      }
      return value;

    }.bind(this);
  }

  initializeRenderer({}){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    
    this.renderer = new this.availableRenderers.math({
      key: this.componentName,
      mathLatex: this.state.latex,
      renderMode: this.state.rendermode,
    });
  }

  updateRenderer() {
    this.renderer.updateMathLatex(this.state.latex);
  }

}