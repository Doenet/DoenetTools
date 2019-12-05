import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export class M extends InlineComponent {
  static componentType = "m";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroStrings = childLogic.newLeaf({
      name: "atLeastZeroStrings",
      componentType: 'string',
      comparison: 'atLeast',
      number: 0,
    });
    let atLeastZeroTexts = childLogic.newLeaf({
      name: "atLeastZeroTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 0,
    });
    let atLeastZeroMaths = childLogic.newLeaf({
      name: "atLeastZeroMaths",
      componentType: 'math',
      comparison: 'atLeast',
      number: 0,
    });
    let atLeastZeroMathlists = childLogic.newLeaf({
      name: "atLeastZeroMathlists",
      componentType: 'mathlist',
      comparison: 'atLeast',
      number: 0,
    });
    childLogic.newOperator({
      name: "stringsTextsAndMaths",
      operator: 'and',
      propositions: [atLeastZeroStrings, atLeastZeroTexts, atLeastZeroMaths, atLeastZeroMathlists],
      requireConsecutive: true,
      setAsBase: true,
    });
    return childLogic;
  }

  updateState(args={}) {

    super.updateState(args);

    if(args.init) {
      this.makePublicStateVariable({
        variableName: "value",
        componentType: this.componentType
      });
      
      // make default reference (with no prop) be value
      this.stateVariablesForReference = ["value"];

      this.state.renderMode = "inline";

    }

    if(!this.childLogicSatisfied) {
      this.unresolvedState.value = true;
      return;
    }


    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {

      let stringsTextsAndMaths = this.childLogic.returnMatches("stringsTextsAndMaths");

      if(stringsTextsAndMaths.length > 0) {
        this.state.stringTextAndMathChildren = stringsTextsAndMaths.map(x => this.activeChildren[x]);
      } else {
        delete this.state.stringTextAndMathChildren;
      }
    }

    if(this.state.stringTextAndMathChildren) {

      this.state.value = "";
      for(let child of this.state.stringTextAndMathChildren) {
        if(child.componentType === "string" || child instanceof this.allComponentClasses.text) {
          if(child.unresolvedState.value) {
            this.unresolvedState.value = true;
            return;
          }
          this.state.value += child.state.value;
        }
        else if(child instanceof this.allComponentClasses.mathlist) {
          if(child.unresolvedState.maths) {
            this.unresolvedState.value = true;
            return;
          }
          this.state.value += child.state.latex;
        } else {
          if(child.unresolvedState.latex) {
            this.unresolvedState.value = true;
            return;
          }
          this.state.value += child.state.latex;
        }
      }

    } else {

      // if no string/math activeChildren and value wasn't set from state directly,
      // make value be blank

      if(this._state.value.essential !== true || this.state.value===undefined) {
        this.state.value = "";
      }
    }

    delete this.unresolvedState.value;
  }
  

  toText() {
    let expression;
    if(!this.state.value) {
      return;
    }
    try {
      expression = me.fromLatex(this.state.value);
    }catch(e) {
      // just return latex if can't parse with math-expression
      return this.state.value;
    }
    return expression.toString();
  }

  initializeRenderer({}){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    
    this.renderer = new this.availableRenderers.math({
      key: this.componentName,
      mathLatex: this.state.value,
      renderMode: this.state.renderMode,
    });
  }

  updateRenderer() {
    this.renderer.updateMathLatex(this.state.value);
  }
  
}

export class Me extends M {
  static componentType = "me";

  updateState(args={}) {
    super.updateState(args);
    if(args.init) {
      this.state.renderMode = "display";
    }
  }
}  

export class Men extends M {
  static componentType = "men";
  
  updateState(args={}) {
    super.updateState(args);
    if(args.init) {
      this.state.renderMode = "numbered";
    }
  }
} 


