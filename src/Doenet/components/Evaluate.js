import MathComponent from './Math';
import me from 'math-expressions';

export default class Evaluate extends MathComponent {
  static componentType = "evaluate";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.numeric = {default: true};
    return properties;
  }

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.deleteAllLogic();

    let atLeastZeroFunctions = childLogic.newLeaf({
      name: "atLeastZeroFunctions",
      componentType: 'function',
      comparison: 'atLeast',
      number: 0,
    });
    let atMostOneMath = childLogic.newLeaf({
      name: "atMostOneMath",
      componentType: 'math',
      comparison: 'atMost',
      number: 1,
    });
    childLogic.newOperator({
      name: "FunctionsAndMaths",
      operator: 'or',
      propositions: [atLeastZeroFunctions, atMostOneMath],
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args ={}) {
    super.updateState(args);

    if(args.init) {
      this.makePublicStateVariableArray({
        variableName: "evaluatedResults",
        componentType: this.state.numeric ? "number" : "math",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "evaluatedResult",
        arrayVariableName: "evaluatedResults",
      });
     
    }

    if(!this.childLogicSatisfied) {
      this.unresolvedState.evaluatedResults = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(trackChanges.getVariableChanges({
      component: this, variable: "numeric"
    })) {
      this._state.evaluatedResults.componentType =  this.state.numeric ? "number" : "math";
    }

    if(childrenChanged) {

      let atLeastZeroFunctions = this.childLogic.returnMatches("atLeastZeroFunctions");
      if(atLeastZeroFunctions.length > 0) {
        this.state.functionChildren = atLeastZeroFunctions.map(x => this.activeChildren[x]);
        this.state.numFunctions = atLeastZeroFunctions.length;
      }else {
        delete this.state.functionChildren;
        this.state.numFunctions = 0;
        this.state.evaluatedResults = [];
        if(!this._state.value.essential) {
          this.state.value = me.fromAst('\uFF3F');  // long underscore
        }
        let rounded = this.state.value
        .round_numbers_to_precision(this.state.displaydigits);
        this.state.latex = rounded.toLatex();
        this.state.text = rounded.toString();

        delete this.unresolvedState.value;
        delete this.unresolvedState.latex;
        delete this.unresolvedState.text;
        delete this.unresolvedState.evaluatedResults;
        return;
      }

      let atMostOneMath = this.childLogic.returnMatches("atMostOneMath");
      if(atMostOneMath.length == 1) {
        this.state.mathChild = this.activeChildren[atMostOneMath[0]];
      }else {
        delete this.state.mathChild;
        this.state.evaluatedResults = [];
        if(!this._state.value.essential) {
          this.state.value = me.fromAst('\uFF3F');  // long underscore
        }
        let rounded = this.state.value
        .round_numbers_to_precision(this.state.displaydigits);
        this.state.latex = rounded.toLatex();
        this.state.text = rounded.toString();

        delete this.unresolvedState.value;
        delete this.unresolvedState.latex;
        delete this.unresolvedState.text;
        delete this.unresolvedState.evaluatedResults;
        return;
      }
    }

    if(!this.state.functionChildren || !this.state.mathChild) {
      if(
        trackChanges.getVariableChanges({
          component: this, variable: "value"
        }) ||
        trackChanges.getVariableChanges({
          component: this, variable: "displaydigits"
        })
      ) {
        let rounded = this.state.value
        .round_numbers_to_precision(this.state.displaydigits);
        this.state.latex = rounded.toLatex();
        this.state.text = rounded.toString();
      }
      return;
    }

    if(this.state.mathChild.unresolvedState.value || 
        this.state.functionChildren.some(x => Object.keys(x.unresolvedState).length >0)) {
      this.unresolvedState.value = true;
      this.unresolvedState.latex = true;
      this.unresolvedState.text = true;
      this.unresolvedState.evaluatedResults = true;
      return;
    }

    if(trackChanges.getVariableChanges({component: this.state.mathChild, variable: "value"}) ||
      this.state.functionChildren.some(x => trackChanges.checkIfVariableChanged(x))
    ) {
      delete this.unresolvedState.value;
      delete this.unresolvedState.latex;
      delete this.unresolvedState.text;
      delete this.unresolvedState.evaluatedResults;

      this.state.evaluatedResults = [];

      if(this.state.numeric) {
        let numericInput = this.state.mathChild.state.value.evaluate_to_constant();
        for(let f of this.state.functionChildren) {
          this.state.evaluatedResults.push(
            me.fromAst(f.returnNumericF()(numericInput)))
        }
      }else {
        let input = this.state.mathChild.state.value;
        for(let f of this.state.functionChildren) {
          this.state.evaluatedResults.push(f.returnF()(input));
        }
      }

      if(this.state.numFunctions === 1) {
        this.state.value = this.state.evaluatedResults[0];
      }else {
        this.state.value = me.fromAst(["tuple", ...this.state.evaluatedResults.map(x=>x.tree)]);
      }


      let rounded = this.state.value
      .round_numbers_to_precision(this.state.displaydigits);
      this.state.latex = rounded.toLatex();
      this.state.text = rounded.toString();

    }else if(trackChanges.getVariableChanges({
      component: this, variable: "displaydigits"
    })){
      let rounded = this.state.value
      .round_numbers_to_precision(this.state.displaydigits);
      this.state.latex = rounded.toLatex();
      this.state.text = rounded.toString();
    }
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