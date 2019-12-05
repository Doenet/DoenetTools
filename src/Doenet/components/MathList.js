import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export default class MathList extends InlineComponent {
  static componentType = "mathlist";


  static previewSerializedComponent({serializedComponent, sharedParameters, components}) {
    if(serializedComponent.children === undefined) {
      return;
    }

    let simplifyInd;
    for(let [ind,child] of serializedComponent.children.entries()) {
      if(child.componentType === "simplify" || (
        child.createdComponent && components[child.componentName].componentType === "simplify"
      )) {
        simplifyInd = ind;
        break;
      }
    }

    let creationInstructions = [];
    if(simplifyInd !== undefined) {
      creationInstructions.push({createChildren: [simplifyInd]});
    }

    creationInstructions.push({callMethod: "setUpSimplify"})
    return creationInstructions;

  }

  static setUpSimplify({sharedParameters, definingChildrenSoFar, serializedComponent}) {

    // check for simplify child
    let simplifyChild;
    for(let child of definingChildrenSoFar) {
      if(child !== undefined && child.componentType === "simplify") {
        simplifyChild = child;
        break;
      }
    }

    if(simplifyChild !== undefined) {
      sharedParameters.simplifyChild = simplifyChild;
    }

  }
  
  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.simplify = {default: 'none'};
    properties.unordered = {default: false};
    properties.maximumnumber = {default: undefined};
    properties.mergemathlists = {default: false};
    return properties;
  }


  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroMaths = childLogic.newLeaf({
      name: "atLeastZeroMaths",
      componentType: 'math',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroMathlists = childLogic.newLeaf({
      name: "atLeastZeroMathlists",
      componentType: 'mathlist',
      comparison: 'atLeast',
      number: 0
    });

    let breakStringIntoMathsByCommas = function({activeChildrenMatched, sharedParameters}) {
      let stringChild = activeChildrenMatched[0];


      let childrenForMaths = [];
      if(sharedParameters.simplifyChild !== undefined) {
        childrenForMaths.push({
          componentType: "ref",
          children: [{
            componentType: "reftarget",
            state: { refTargetName: sharedParameters.simplifyChild.componentName }
          }]
        })
      }

      let stringPieces = stringChild.state.value.split(",").map(x=>x.trim()).filter(x=>x!="");
      let newChildren = [];

      for(let piece of stringPieces) {
        let mathExpr;
        try {
          mathExpr = me.fromText(piece);
        } catch (e) {
          console.warn(`Invalid string piece in mathlist: ${piece}`);
          mathExpr = me.fromAst('\uFF3F');
        }
        newChildren.push({
          componentType: "math",
          state: {value: mathExpr},
          children: [...childrenForMaths],
        });
      }

      return {
        success: true,
        newChildren: newChildren,
        toDelete: [stringChild.componentName],
      }
    }
    
    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1,
      isSugar: true,
      replacementFunction: breakStringIntoMathsByCommas,
    });
    
    let mathAndMathLists = childLogic.newOperator({
      name: "mathAndMathLists",
      operator: "and",
      propositions: [atLeastZeroMaths, atLeastZeroMathlists]
    })

    childLogic.newOperator({
      name: "MathsXorSugar",
      operator: 'xor',
      propositions: [exactlyOneString,mathAndMathLists],
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args={}) {
    if(args.init === true) {
      this.makePublicStateVariableArray({
        variableName: "maths",
        componentType: "math",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "math",
        arrayVariableName: "maths",
      });
      this.makePublicStateVariable({
        variableName: "ncomponents",
        componentType: "number",
      });
      this.makePublicStateVariable({
        variableName: "latex",
        componentType: "text",
      });

    }

    super.updateState(args);

    if (!this.childLogicSatisfied) {
      this.unresolvedState.maths = true;
      this.unresolvedState.ncomponents = true;
      return;
    }


    // override default simplify from shared parameters
    if(this._state.simplify.usedDefault) {
      let simplifyChild = this.sharedParameters.simplifyChild;
      if(simplifyChild) {
        if(simplifyChild.unresolvedState.value) {
          this.unresolvedState.simplify = true;
          return;
        }
        this.state.simplify = simplifyChild.state.value;
      }else if(this.sharedParameters.simplify) {
        this.state.simplify = this.sharedParameters.simplify;
      }

      delete this.unresolvedState.simplify;
      // delete usedDefault so logic isn't repeated
      delete this._state.simplify.usedDefault;
    }


    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    // normalize form of simplify
    if(trackChanges.getVariableChanges({ component: this, variable: "simplify"})) {
      this.state.simplify = this.state.simplify.toLowerCase();
      if(this.state.simplify === "" || this.state.simplify === "true") {
        this.state.simplify = "full";
      }
    }

    if (childrenChanged) {
      let mathAndMathlistChildrenInds = this.childLogic.returnMatches("mathAndMathLists");
      this.state.mathAndMathlistChildren = mathAndMathlistChildrenInds.map(x => this.activeChildren[x]);
      let mathChildrenInds = this.childLogic.returnMatches("atLeastZeroMaths");
      this.state.mathChildren = mathChildrenInds.map(x => this.activeChildren[x]);
      let mathlistChildrenInds = this.childLogic.returnMatches("atLeastZeroMathlists");
      this.state.mathlistChildren = mathlistChildrenInds.map(x => this.activeChildren[x]);
    }

    if(this.state.mathChildren.some(x => x.unresolvedState.value) ||
      this.state.mathlistChildren.some(x => x.unresolvedState.maths)
    ) {
      this.unresolvedState.maths = true;
      this.unresolvedState.ncomponents = true;
      return;
    }

    if(childrenChanged || this.state.mathChildren.some(x => trackChanges.getVariableChanges({
      component: x, variable: "value"
    })) || this.state.mathlistChildren.some(x => trackChanges.getVariableChanges({
      component: x, variable: "maths"
    })) || trackChanges.getVariableChanges({
      component: this, variable: "maximumnumber"
    })) {

      delete this.unresolvedState.maths;
      delete this.unresolvedState.ncomponents;

      this.state.maths = [];
      let latexs = [];

      for(let child of this.state.mathAndMathlistChildren) {
        if(child instanceof this.allComponentClasses.math) {
          let childValue = child.state.value;
          let childDisplayValue = child.get_value_to_display();
          if(this.state.mergemathlists && Array.isArray(childValue.tree) && childValue.tree[0] === "list") {
            for(let i=0; i < childValue.tree.length-1; i++) {
              this.state.maths.push(childValue.get_component(i));
              latexs.push(childDisplayValue.get_component(i));
            }
          } else {
            this.state.maths.push(child.state.value);
            latexs.push(child.state.latex)
          }
        } else{
          this.state.maths.push(...child.state.maths)
          latexs.push(...child.state.latexs)
        }
      }

      if(this.state.maximumnumber !== undefined && this.state.maths.length > this.state.maximumnumber) {
        let maxnum = Math.max(0,Math.floor(this.state.maximumnumber));
        this.state.maths = this.state.maths.slice(0,maxnum)
        latexs = latexs.slice(0,maxnum)
      }
      this.state.ncomponents = this.state.maths.length;
      this.state.latex = latexs.join(', ');
    }
    
  }

  initializeRenderer(){
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.aslist({
        key: this.componentName,
      });
    }
  }

  updateChildrenWhoRender(){
    this.childrenWhoRender = [];
    for(let child of this.state.mathAndMathlistChildren) {
      if(child instanceof this.allComponentClasses.math) {
        this.childrenWhoRender.push(child.componentName);
      } else {
        this.childrenWhoRender.push(...child.childrenWhoRender);
      }
    }
    if(this.childrenWhoRender.length > this.state.ncomponents) {
      this.childrenWhoRender.length = this.state.ncomponents;
    }

  }
  
}