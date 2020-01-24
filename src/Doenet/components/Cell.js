import BaseComponent from './abstract/BaseComponent';
import me from 'math-expressions';

export default class Cell extends BaseComponent {
  static componentType = "cell";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);

    properties.rownum = {default: undefined};
    properties.colnum = {default: undefined};
    
    return properties;
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: 'anything',
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });
    
    return childLogic;
  }

  updateState(args={}) {
    if(args.init === true) {
      this.makePublicStateVariable({
        variableName:'number',
        componentType: 'number'
      });
  
      this.makePublicStateVariable({
        variableName:'math',
        componentType: 'math'
      });
  
      this.makePublicStateVariable({
        variableName:'text',
        componentType: 'text'
      });

      // this.makePublicStateVariable({
      //   variableName:'date',
      //   componentType: 'date'
      // });


    }

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.number = true;
      this.unresolvedState.math = true;
      this.unresolvedState.text = true;
      return;
    }


    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);


    if(childrenChanged) {
      delete this.unresolvedState.number;
      delete this.unresolvedState.math;
      delete this.unresolvedState.text;

      let anything = this.childLogic.returnMatches("anything");
      this.state.anyChildren = anything.map(x => this.activeChildren[x]);

      this.state.firstChildType = undefined;

      if(anything.length > 0) {
        this.state.firstChild = this.state.anyChildren[0];
        if(this.state.firstChild instanceof this.allComponentClasses.string ||
          this.state.firstChild instanceof this.allComponentClasses.text) {
          this.state.firstChildType = "text";
        }else if(this.state.firstChild instanceof this.allComponentClasses.math) {
          this.state.firstChildType = "math";
        }
        this._state.text.essential = false;
        this._state.number.essential = false;
        this._state.math.essential = false;
      }else {
        delete this.state.firstChild;
      }
    }


    if(childrenChanged || 
      (this.state.firstChild && trackChanges.getVariableChanges({
        component: this.state.firstChild, variable: "value"
      }))) {

      if(!this.state.firstChild) {
        if(this._state.number.essential) {
          this.calculateVariablesFromNumber();
        }else if(this._state.math.essential) {
          this.calculateVariablesFromMath();
        }else if(this._state.text.essential) {
          this.calculateVariablesFromText();
        }else {
          this.state.text = "";
          this.state.number = NaN; 
          this.state.math = me.fromAst('\uFF3F');  // long underscore 
          this._state.text.essential = true;
        }
      }else if(this.state.firstChildType === "text") {
        if(this.state.firstChild.unresolvedState.value) {
          this.unresolvedState.number = true;
          this.unresolvedState.math = true;
          this.unresolvedState.text = true;
          return;
        }else {
          this.state.text = this.state.firstChild.state.value.trim();
          this.calculateVariablesFromText();
        }
      }else if(this.state.firstChildType === "math") {
        if(this.state.firstChild.unresolvedState.value) {
          this.unresolvedState.number = true;
          this.unresolvedState.math = true;
          this.unresolvedState.text = true;
          return;
        }else {
          this.state.math = this.state.firstChild.state.value;
          this.calculateVariablesFromMath();
        }
      }else {
        this.state.text = "";
        this.state.number = NaN;
        this.state.math = me.fromAst('\uFF3F');  // long underscore 
      }

    }else if(!this.state.firstChild) {
      // no changes to children but don't have children
      // check if essential state variable changed
      // so that can compute dependent variables
      if(this._state.number.essential) {
        if(trackChanges.getVariableChanges({component: this, variable: "number"})) {
          this.calculateVariablesFromNumber();
        }
      }else if(this._state.math.essential) {
        if(trackChanges.getVariableChanges({component: this, variable: "math"})) {
        this.calculateVariablesFromMath();
        }
      }else if(this._state.text.essential) {
        if(trackChanges.getVariableChanges({component: this, variable: "text"})) {
          this.calculateVariablesFromText();
        }
      }
    }
  }


  calculateVariablesFromText() {
    try {
      this.state.math = me.fromText(this.state.text);
    } catch (e) {
      this.state.math = me.fromAst('\uFF3F'); // long underscore 
    }
    this.state.number = this.state.math.evaluate_to_constant();

    delete this.unresolvedState.number;
    delete this.unresolvedState.math;
    delete this.unresolvedState.text;

  }

  calculateVariablesFromMath() {
    this.state.text = this.state.firstChild.state.value.toString();
    this.state.number = this.state.firstChild.state.value.evaluate_to_constant();

    delete this.unresolvedState.number;
    delete this.unresolvedState.math;
    delete this.unresolvedState.text;

  }

  calculateVariablesFromNumber() {
    if(Number.isFinite(this.state.number)) {
      this.state.math = me.fromAst(this.state.number);
      this.state.text = this.state.number.toString();
    }else {
      this.state.math = me.fromAst('\uFF3F');  // long underscore 
      this.state.text = "";
    }

    delete this.unresolvedState.number;
    delete this.unresolvedState.math;
    delete this.unresolvedState.text;

  }

  initializeRenderer(){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    
    // if have children, then render the children
    // otherwise, render the text
    if(this.state.firstChild) {
      this.renderer = new this.availableRenderers.container({ key: this.componentName });
    }else {
      this.renderer = new this.availableRenderers.text({
        key: this.componentName,
        text: this.state.text,
      });
    }
  }

  updateRenderer(){
    if(!this.state.firstChild) {
      this.renderer.updateText(this.state.text);
    }
  }

  updateChildrenWhoRender(){
    this.childrenWhoRender = this.activeChildren.map(x => x.componentName);
  }

  adapters = ["text", "math", "number"];

  allowDownstreamUpdates(status) {
    return(status.initialChange === true || this.state.modifyIndirectly === true);
  }

  get variablesUpdatableDownstream() {
    return ["text", "math", "number"];
  }

  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {

    let newStateVariables = {};
    let newText, newMath, newNumber;
    let mathError = false;

    if("number" in stateVariablesToUpdate) {
      newNumber = stateVariablesToUpdate.number.changes;
      newMath = me.fromAst(newNumber);
      newText = newNumber.toString();
      newStateVariables
    }else if("math" in stateVariablesToUpdate) {
      newMath = stateVariablesToUpdate.math.changes;
      newNumber = newMath.evaluate_to_constant();
      newText = newMath.toString();
    }else if("text" in stateVariablesToUpdate) {
      newText = stateVariablesToUpdate.text.changes;
      try {
        newMath = me.fromText(newText);
        newNumber = newMath.evaluate_to_constant();
      }catch(e) {
        console.warn("Could not parse math: " + newText);
        mathError = true;
      }
    }

    if(!mathError) {
      newStateVariables.math = {changes: newMath};
      newStateVariables.number = {changes: newNumber};
    }
    newStateVariables.text = {changes: newText};

    if (this.state.firstChild !== undefined){
      let childName = this.state.firstChild.componentName;

      if(this.state.firstChild instanceof this.allComponentClasses.math) {
        if(!mathError) {
          dependenciesToUpdate[childName] = {value: newStateVariables.math};
        }
      }else {
        dependenciesToUpdate[childName] = {value: newStateVariables.text};
      }
    }

    let shadowedResult = this.updateShadowSources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // add stateVariable to stateVariableChangesToSave if is essential
    // and no shadow sources were updated
    for(let varname in newStateVariables) {
      if(this._state[varname].essential === true &&
          !shadowedStateVariables.has(varname) && !isReplacement) {
        stateVariableChangesToSave[varname] = newStateVariables[varname];
      }
    }

    // console.log({
    //   componentName: this.componentName,
    //   dependenciesToUpdate: dependenciesToUpdate,
    //   stateVariableChangesToSave: stateVariableChangesToSave,
    // })
    
    return true;

  }

}