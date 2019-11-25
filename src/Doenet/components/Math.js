import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';


export default class MathComponent extends InlineComponent {
  static componentType = "math";


  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.format = {default: "text"};
    properties.simplify = {default: "none"};
    properties.expand = {default: false};
    properties.displaydigits = {default: 10};
    properties.displaysmallaszero = {default: false};
    properties.rendermode = {default: "inline"};
    properties.unordered = {default: false};
    properties.createvectors = {default: false};
    properties.createintervals = {default: false};
    return properties;
  }

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let atLeastZeroStrings = childLogic.newLeaf({
      name: "atLeastZeroStrings",
      componentType: 'string',
      comparison: 'atLeast',
      number: 0,
    });
    let atLeastZeroMaths = childLogic.newLeaf({
      name: "atLeastZeroMaths",
      componentType: 'math',
      comparison: 'atLeast',
      number: 0,
    });
    childLogic.newOperator({
      name: "stringsAndMaths",
      operator: 'and',
      propositions: [atLeastZeroStrings, atLeastZeroMaths],
      requireConsecutive: true,
      setAsBase: true,
    });
    return childLogic;
  }

  // // check if was passed in a number, string, or Array as essential value
  // convertNumberValueToMathExpression() {
  //   if (this._state.value.essential === true) {
  //     let value = this.state.value;
  //     if(value === undefined) {
  //       this.state.value = me.fromAst('\uFF3F');  // long underscore
  //     }else if (value.tree === undefined) {
  //       if (typeof value === "number" || (typeof value === "string")) {
  //         // let value be math-expression based on value
  //         this.state.value = me.fromAst(value);
  //       }
  //     }
  //   }
  // }

  updateState(args={}) {
    if(args.init) {

      // make default reference (with no prop) be value
      this.stateVariablesForReference = ["value"];
    
      this.makePublicStateVariable({
        variableName: "value",
        componentType: this.componentType
      });
      this.makePublicStateVariable({
        variableName: "latex",
        componentType: "text"
      });
      this.makePublicStateVariable({
        variableName: "text",
        componentType: "text"
      });

      // create a proxy on value state variable so that if set it to a 
      // number or string that isn't a math-expression
      // it will convert it to a math-expression
      // The proxy is particularly needed for number components
      // as value can get set to a number rather than a math-expression

      let convertValueToMathExpression = function (value) {
        if(value === undefined) {
          return me.fromAst('\uFF3F');  // long underscore
        }else if (value.tree === undefined && (typeof value === "number" || typeof value === "string")) {
          // let value be math-expression based on value
          return me.fromAst(value);
        }else {
          return value;
        }
      }

      // on initialization, in case passed in a number for essential state
      // convert to math-expression
      if(this._state.value.essential) {
        this.state.value = convertValueToMathExpression(this.state.value)
      }

      // after initial conversion, move value to _value
      // so that value can become a proxy for _value
      this._value = this._state.value;

      // any remaining changes to value will be converted to math-expressions
      // with this proxy
      this._state.value = new Proxy(this._value, {
        set: function(obj, prop, value) {
          if(prop === "value") {
            obj[prop] = convertValueToMathExpression(value);
          }else {
            obj[prop] = value;
          }
          return true;
        }
      });

      this.state.changedFromDownstreamUpdate = false;

    } // end of init

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.value = true;
      this.unresolvedState.latex = true;
      this.unresolvedState.text = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;

    // normalize form of simplify
    if(trackChanges.getVariableChanges({ component: this, variable: "simplify"})) {
      this.state.simplify = this.state.simplify.toLowerCase();
      if(this.state.simplify === "" || this.state.simplify === "true") {
        this.state.simplify = "full";
      }
    }

    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    let recalculateAllChildren = false;

    if(childrenChanged) {
      recalculateAllChildren = true;

      this.state.stringsAndMaths = this.childLogic.returnMatches("stringsAndMaths");

      // if stringsAndMaths is undefined, then a superclass
      // must have overwritten childLogic, so skip this processing
      if(this.state.stringsAndMaths === undefined) {
        this.state.mathChildLogicOverwritten = true;
        return;
      }

      if(this.state.stringsAndMaths.length > 0) {
        this.state.stringMathChildren = this.state.stringsAndMaths.map(x => this.activeChildren[x]);
      }else {
        delete this.state.stringMathChildren;
      }
    }

    if(this.state.mathChildLogicOverwritten) {
      return;
    }

    // if don't know the format, we can't proceed
    if(this.unresolvedState.format) {
      this.unresolvedState.value = true;
      this.unresolvedState.latex = true;
      this.unresolvedState.text = true;
      this.state.recalculateAllChildrenNextTime = true;
      return;
    }else if(!["text", "latex"].includes(this.state.format)) {
      // have invalid format
      if(this.state.unresolvedDependenceChain) {
        // we have some unresolved children, so don't fail yet
        this.unresolvedState.value = true;
        this.unresolvedState.latex = true;
        this.unresolvedState.text = true;
        this.unresolvedState.format = true;
        this.state.recalculateAllChildrenNextTime = true;
        return;
      }else {
        throw Error("Unrecognized format for math")
      }
    }else {
      // delete this.unresolvedState.format;
      // delete this.unresolvedState.value;
      // delete this.unresolvedState.latex;
      // delete this.unresolvedState.text;
    }

    // if format changed, have to recalculate
    if(trackChanges.getVariableChanges({ component: this, variable: "format"})) {
      recalculateAllChildren = true;
    }

    if(this.state.stringMathChildren !== undefined) {
    
      // can't proceed if some children have unresolved values
      if(this.state.stringMathChildren.some(x => x.unresolvedState.value)) {
        this.unresolvedState.value = true;
        this.unresolvedState.latex = true;
        this.unresolvedState.text = true;
        this.state.recalculateAllChildrenNextTime = true;
        return;
      }

      if(this.state.recalculateAllChildrenNextTime) {
        recalculateAllChildren = true;
        delete this.state.recalculateAllChildrenNextTime;
      }

      if(recalculateAllChildren === true) {
        delete this.unresolvedState.value;
        delete this.unresolvedState.latex;
        delete this.unresolvedState.text;

        this.buildMathFromChildren();
      }else{
        this.updateMathFromJustMathChildren();
      }
    } else {

      // if no string/math activeChildren and value was set directly,
      // check to see if shadowing another math and copy its value
      // if(this._state.value.essential === true) {
        
      //   this.convertNumberValueToMathExpression();

      // }

      // if no string/math activeChildren and value wasn't set from state directly,
      // make value be blank
      if(this._state.value.essential !== true || this.state.value===undefined) {
        this.state.value = me.fromAst('\uFF3F');  // long underscore
      } else {
        this.normalizeValue();
      }

      // it's possible could have been created with these unresolved
      // so must delete them
      delete this.unresolvedState.value;
      delete this.unresolvedState.latex;
    }
    
    let rounded = this.get_value_to_display();
    this.state.latex = rounded.toLatex();
    this.state.text = rounded.toString();

    this.state.modifiablefromabove = this.determineModifiableFromAbove();
  }

  get_value_to_display() {
    // for display via latex and text, round any decimal numbers to the significant digits
    // determined by displaydigits
    let rounded = this.state.value
      .round_numbers_to_precision(this.state.displaydigits);
    if(this.state.displaysmallaszero) {
      rounded = rounded.evaluate_numbers({skip_ordering: true, set_small_zero: true});
    }
    return this.normalizeValue(rounded);
  }

  buildMathFromChildren() {

    let inputString = "";
    let subsMapping = {};
    let subnum = 0;

    this.state.codePre = "math";

    // make sure that codePre is not in any string piece
    let foundInString = false;
    do {
      foundInString = false;

      for(let child of this.state.stringMathChildren) {
        if(child.componentType === "string" &&
          child.state.value.includes(this.state.codePre) === true) {
           // found codePre in a string, so extend codePre and try again
           foundInString = true;
           this.state.codePre += "m";
           break;
         }
      }
    } while(foundInString);

    // store object mapping component name to substitution
    this.state.mathChildren = {};

    for(let childNum of this.state.stringsAndMaths) {
      let child = this.activeChildren[childNum];
      if(child.componentType === "string") {
        inputString += " " + child.state.value + " ";
      }
      else { // a math
        let code = this.state.codePre + subnum;
        if(this.state.format === 'latex') {
          // for latex, must explicitly denote that code
          // is a multicharacter variable
          inputString += '\\var{' + code + '}';
        }
        else {
          // for text, just make sure code is surrounded by spaces
          // (the presence of numbers inside code will ensure that 
          // it is parsed as a multicharcter variable)
          inputString += " " + code + " ";
        }
        subsMapping[code] = child.state.value;
        subnum += 1;

        // record this component's substitution code and if it is modifiablefromabove
        this.state.mathChildren[childNum] = {
          substitutionCode: code,
          modifiablefromabove: child.state.modifiablefromabove,
        };

      }
    }

    // create stringChildren object that gives substitution codes 
    // that are just before and after each string child
    this.state.stringChildren = {};
    for(let ind =0; ind < this.state.stringsAndMaths.length; ind++) {
      let childNum = this.state.stringsAndMaths[ind];
      let child = this.activeChildren[childNum];
      if(child.componentType === "string") {
        let subCodes = [];
        if(ind === 0) {
          subCodes.push(undefined);
        }else {
          let prevChildNum = this.state.stringsAndMaths[ind-1];
          subCodes.push(this.state.mathChildren[prevChildNum].substitutionCode);
        }
        // skip any adjacent string children
        let nextMath;
        while(ind < this.state.stringsAndMaths.length-1) {
          let nextChildNum = this.state.stringsAndMaths[ind+1];
          nextMath = this.state.mathChildren[nextChildNum];
          if(nextMath !== undefined) {
            break;
          }
          // indicate string child is skipped
          this.state.stringChildren[nextChildNum]=[];

          ind++
        }
        if(nextMath === undefined) {
          subCodes.push(undefined);
        }else {
          subCodes.push(nextMath.substitutionCode);
        }

        this.state.stringChildren[childNum] = subCodes;
          
      }
    }

    this.state.substitutions = [];
    if(Object.keys(subsMapping).length > 0) {
      this.state.substitutions = [subsMapping];
    }
    this.buildExpression(inputString);

  }

  buildExpression(inputString){
    // Build expression from inputString and assign to this.state.value.
    // Use parser based on this.state.format.
    // Perform any substitutions from this.state.substitutions.

    this.state.value = undefined;

    if(inputString === "") {
      this.state.value = me.fromAst('\uFF3F'); // long underscore
    }else {
      if(this.state.format === "text"){
        try{
          this.state.value = me.fromText(inputString);
        }catch(e){
          this.state.value = me.fromAst('\uFF3F');  // long underscore
          console.log("Invalid value for a math of text format: " + inputString);
        }
      }
      else if(this.state.format === "latex"){
        try{
          this.state.value = me.fromLatex(inputString);
        }catch(e){
          this.state.value = me.fromAst('\uFF3F');  // long underscore
          console.log("Invalid value for a math of latex format: " + inputString);
        }
      }else {
        throw Error("Unrecognized math format");
      }
    }

    // save pre-substitution expression
    this.state.expressionWithCodes = this.state.value;

    if(this.state.substitutions !== undefined){
      try{
        for(let sub of this.state.substitutions){
          this.state.value = this.state.value.substitute(sub);
        }
        this.normalizeValue();
        
        // always simplify if changed from a downstream update
        if(this.state.changedFromDownstreamUpdate) {
          this.state.changedFromDownstreamUpdate = false;
          if(this.state.simplify !== "full") {
            this.state.value = this.state.value.simplify();
          }
        }
      }catch(e){}
    }
  }

  normalizeValue(value=undefined) {
    if(value === undefined) {
      this.state.value = this.constructor.normalize({
        value: this.state.value,
        simplify: this.state.simplify,
        expand: this.state.expand,
        createvectors: this.state.createvectors,
        createintervals: this.state.createintervals,
      });
      return this.state.value;
    } else {
      return this.constructor.normalize({
        value: value,
        simplify: this.state.simplify,
        expand: this.state.expand,
        createvectors: this.state.createvectors,
        createintervals: this.state.createintervals,
      });
    }
  }

  static normalize({value, simplify, expand=false,
    createvectors=false, createintervals=false
  }) {
    if(createvectors) {
      value = value.tuples_to_vectors();
    }
    if(createintervals) {
      value = value.to_intervals();
    }
    if(expand) {
      value = value.expand();
    }
    if (simplify === "full") {
      return value.simplify();
    }else if (simplify === "numbers") {
      return value.evaluate_numbers();
    }else if (simplify === "numberspreserveorder") {
      return value.evaluate_numbers({skip_ordering: true});
    }
    return value;
  }

  updateMathFromJustMathChildren() {

    if(this.state.expressionWithCodes === undefined) {
      this.state.value = me.fromAst('\uFF3F');  // long underscore
      return;
    }

    let subsMapping ={};
    let foundSubs = false;
    for(let mathChildID in this.state.mathChildren) {
      let mathChild = this.state.mathChildren[mathChildID];
      foundSubs = true;
      let subKey = mathChild.substitutionCode;
      let mathDep = this.activeChildren[mathChildID];
      subsMapping[subKey] = mathDep.state.value.copy();
    }
    this.state.value = this.state.expressionWithCodes;
    if(foundSubs === true) {
      this.state.value = this.state.value.substitute(subsMapping);
    }
    this.normalizeValue();
    
    // always simplify if changed from a downstream update
    if(this.state.changedFromDownstreamUpdate) {
      this.state.changedFromDownstreamUpdate = false;
      if(this.state.simplify !== "full") {
        this.state.value = this.state.value.simplify();
      }
    }

  }

  adapters = ["text"];

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

  determineModifiableFromAbove() {

    if(this.state.modifybyreference !== true) {
      return false;
    }

    // if value is essential or blank(?), then can directly set value 
    // to any specified expression
    if(this._state.value.essential === true || this.state.value.tree === '\uFF3F') {
      return true;
    }

    // determine if can calculate value of activeChildren from
    // any specified value of expression

    let mathChildIds = Object.keys(this.state.mathChildren);

    // categorize all math activeChildren as variables or constants
    let variableIds=[];
    let variables=[];
    let constantIds=[];
    let constants=[];
    this.state.constantChildIndices = {};

    for(let mathID of mathChildIds) {
      let mathChild = this.state.mathChildren[mathID];

      if(mathChild.modifiablefromabove === true) {
        variableIds.push(mathID);
        variables.push(mathChild.substitutionCode);
      }
      else {
        constantIds.push(mathID);
        constants.push(mathChild.substitutionCode);
        this.state.constantChildIndices[mathChild.substitutionCode] = mathID;
      }
    }

    // include codePre in code for whole expression, as we know codePre is not in math expression
    this.state.codeForExpression = this.state.codePre + "expr";
    let tree = me.utils.unflattenLeft(this.state.expressionWithCodes.tree);

    let result = MathComponent.checkForLinearExpression(tree, variables, this.state.codeForExpression, constants);

    if(result.foundLinear) {

      let inverseMaps = this.state.inverseMaps = {};
      this.state.template = result.template;
      let mathChildrenMapped = this.state.mathChildrenMapped = new Set();
      // this.state.modifiableStrings = result.modifiableStrings;

      for(let key in result.mappings) {

        inverseMaps[key] = result.mappings[key];

        // if component was due to a math child, add ID of the math child
        let mathChildSub = inverseMaps[key].mathChildSub;
        if(mathChildSub) {
          let mathChildID = variableIds[variables.indexOf(mathChildSub)]
          inverseMaps[key].mathChildID = mathChildID;
          mathChildrenMapped.add(Number(mathChildID));
        }
      }

      // found an inverse
      return true;
    }

    // if not linear, can't find an inverse
    return false;
  }

  static checkForLinearExpression(tree, variables, inverseTree, constants=[], components=[]) {
    // Check if tree is a linear expression in variables.
    // Each component of container must be a linear expression in just one variable.
    // Haven't implemented inversion of a multivariable linear map

    let tree_variables = me.variables(tree);
    if(tree_variables.every(v => !(variables.includes(v)))) {
      if(tree_variables.every(v => !(constants.includes(v))))  {
        // if there are no variable or constant math activeChildren, then consider it linear
        let mappings = {};
        let key = "x" + components.join('_');
        mappings[key] = {result: me.fromAst(inverseTree).simplify(), components: components};
        //let modifiableStrings = {[key]: components};
        return {foundLinear: true, mappings: mappings, template: key };
          //modifiableStrings: modifiableStrings };
      }
    }

    // if not an array, check if is a variable
    if(!Array.isArray(tree)) {
      return checkForScalarLinearExpression(tree, variables, inverseTree, components);
    }

    let operator = tree[0];
    let operands = tree.slice(1);

    // for container, check if at least one component is a linear expression
    if(operator === "tuple" || operator === "vector" || operator === "list") {

      let result = {mappings: {}, template: [operator]};//, modifiableStrings: {}};
      let numLinear = 0;
      for(let ind=0; ind <operands.length; ind++) {
        let new_components=[...components, ind];
        let res = MathComponent.checkForLinearExpression(operands[ind], variables, inverseTree, constants, new_components);
        if(res.foundLinear) {
          numLinear++;

          // append mappings found for the component
          result.mappings = Object.assign(result.mappings, res.mappings);

          // // append modifiableStrings found for the component
          // result.modifiableStrings = Object.assign(result.modifiableStrings, res.modifiableStrings);

          // append template
          result.template.push(res.template);
        } else{
          result.template.push("x" + new_components.join('_'));
        }
      }

      // if no components are linear, view whole container as nonlinear
      if(numLinear === 0) {
        return {foundLinear: false};
      }

      // if at least one componen is a linear functions, view as linear
      result.foundLinear = true;
      return result;
    }
    else {
      // if not a container, check if is a scalar linear function
      return checkForScalarLinearExpression(tree, variables, inverseTree, components);
    }


    // check if tree is a scalar linear function in one of the variables
    function checkForScalarLinearExpression(tree, variables, inverseTree, components=[]) {
      if((typeof tree === "string") && variables.includes(tree)) {
        let mappings = {};
        let template = "x" + components.join('_');
        mappings[template] = {result: me.fromAst(inverseTree).simplify(), components: components, mathChildSub: tree};
        return {foundLinear: true, mappings: mappings, template: template};
      }

      if(!Array.isArray(tree)) {
        return {foundLinear: false};
      }

      let operator = tree[0];
      let operands = tree.slice(1);

      if(operator === '-') {
        inverseTree = ['-', inverseTree];
        return checkForScalarLinearExpression(operands[0], variables, inverseTree, components);
      }
      if(operator === '+') {
        if(me.variables(operands[0]).every(v => !variables.includes(v))) {
          // if none of the variables appear in the first operand, subtract off operand from inverseTree
          inverseTree = ['+', inverseTree, ['-', operands[0]]];
          return checkForScalarLinearExpression(operands[1], variables, inverseTree, components);
        }
        else if(me.variables(operands[1]).every(v => !variables.includes(v))) {
          // if none of the variables appear in the second operand, subtract off operand from inverseTree
          inverseTree = ['+', inverseTree, ['-', operands[1]]];
          return checkForScalarLinearExpression(operands[0], variables, inverseTree, components);
        }
        else {
          // neither operand was a constant
          return {foundLinear: false};
        }
      }
      if(operator === '*') {
        if(me.variables(operands[0]).every(v => !variables.includes(v))) {
          // if none of the variables appear in the first operand, divide inverseTree by operand
          inverseTree = ['/', inverseTree, operands[0]];
          return checkForScalarLinearExpression(operands[1], variables, inverseTree, components);
        }
        else if(me.variables(operands[1]).every(v => !variables.includes(v))) {
          // if none of the variables appear in the second operand, divide inverseTree by operand
          inverseTree = ['/', inverseTree, operands[1]];
          return checkForScalarLinearExpression(operands[0], variables, inverseTree, components);
        }
        else {
          // neither operand was a constant
          return {foundLinear: false};
        }
      }
      if(operator === '/') {
        if(me.variables(operands[1]).every(v => !variables.includes(v))) {
          // if none of the variables appear in the second operand, multiply inverseTree by operand
          inverseTree = ['*', inverseTree, operands[1]];
          return checkForScalarLinearExpression(operands[0], variables, inverseTree, components);
        }
        else {
          // second operand was not a constant
          return {foundLinear: false};
        }
      }

      // any other operator means not linear
      return {foundLinear: false};

    }
  }

  getExpressionPieces(expression) {

    let matching = me.utils.match(expression.tree, this.state.template);
    if(!matching) {
      return false;
    }
    let pieces = {};
    for(let x in matching) {
      let subMap = {};
      subMap[this.state.codeForExpression] = matching[x];
      let inverseMap = this.state.inverseMaps[x];
      if(inverseMap !== undefined) {
        let id = x;
        if(inverseMap.mathChildID !== undefined) {
          id = inverseMap.mathChildID;
        }
        pieces[id] = inverseMap.result.substitute(subMap);

        pieces[id] = this.constructor.normalize({
          value: pieces[id],
          simplify: this.state.simplify,
          expand: this.state.expand,
          createvectors: this.state.createvectors,
          createintervals: this.state.createintervals,
        })
      }
    }
    return pieces;

  }

  allowDownstreamUpdates() {
    return this.state.modifiablefromabove;
  }

  get variablesUpdatableDownstream() {
    return ["value"];
  }

  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {

    let expressionPieces;
    let expression;
    let newStateVariables = {};

    if("value" in stateVariablesToUpdate) {
      if(stateVariablesToUpdate.value.changes.tree === undefined) {
        newStateVariables.value = {changes: me.fromAst(stateVariablesToUpdate.value.changes)};
      }else {
        newStateVariables.value = stateVariablesToUpdate.value;
      }
    }

    let shadowedResult = this.updateShadowSources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // set expression
    expression = newStateVariables.value.changes;

    if(expression && (expression.tree[0] === "tuple" || expression.tree[0] === "vector")) {
      if(this.state.value && this.state.value.tree[0] === expression.tree[0]) {
        // have vectors
        // merge expression into expression state variable
        let expressionAst = this.state.value.tree.slice(0);
        for(let [ind,value] of expression.tree.entries()) {
          if(value !== undefined) {
            expressionAst[ind] = value;
          }
        }
        expression = me.fromAst(expressionAst);
      }
    }

    // if not set from ast, first calculate expression pieces to make sure really can update
    if(this._state.value.essential !== true ) {
      expressionPieces = this.getExpressionPieces(expression);
      if(!expressionPieces) {
        return false;
      }
    }


    // update math children where have inversemap and modifiablefromabove is true
    let mathInds = this.childLogic.returnMatches("atLeastZeroMaths");
    for(let childInd of mathInds) {
      let mathChild = this.activeChildren[childInd];
      let mathChildName = mathChild.componentName;
      if(this.state.mathChildrenMapped.has(childInd) && mathChild.state.modifiablefromabove === true) {
        let childValue = expressionPieces[childInd];
        let subsMap = {};
        let foundConst=false;
        for(let code in this.state.constantChildIndices) {
          let constInd = this.state.constantChildIndices[code]
          subsMap[code] = this.activeChildren[constInd].state.value;
          foundConst = true;
        }
        if(foundConst) {
          // substitute values of any math children that are constant
          // (i.e., that are marked as not modifiable from above)
          childValue = childValue.substitute(subsMap).simplify();
        }
        dependenciesToUpdate[mathChildName] = {value: {changes: childValue}};
        delete expressionPieces[childInd];
      }
    }


    // if there are any string children,
    // need to update expressionWithCodes with new values
    // and then update the string children based on it
    if(this.state.stringChildren !== undefined && 
        Object.keys(this.state.stringChildren).length > 0){// &&
        // !isReplacement) {
      let newExpressionWithCodes = this.state.expressionWithCodes;

      for(let piece in expressionPieces) {
        let inverseMap = this.state.inverseMaps[piece];
        // skip math children
        if(inverseMap.mathChildID !== undefined) {
          continue;
        }
        let components = inverseMap.components;
        newExpressionWithCodes =
          newExpressionWithCodes.substitute_component(
            components, expressionPieces[piece]);
      }
      stateVariableChangesToSave.expressionWithCodes = {changes: newExpressionWithCodes};

      let stringExpr = newExpressionWithCodes.toString();

      for(let ind in this.state.stringChildren) {
        let thisString = stringExpr;
        let stringCodes = this.state.stringChildren[ind];
        if(stringCodes.length === 0) {
          // string was skipped, so set it to an empty string
          dependenciesToUpdate[this.activeChildren[ind].componentName] = {
            value: {changes: ""}
          }
        }else {
          if(stringCodes[0] !== undefined) {
            thisString = thisString.split(stringCodes[0])[1];
          }
          if(stringCodes[1] !== undefined) {
            thisString = thisString.split(stringCodes[1])[0];
          }
          dependenciesToUpdate[this.activeChildren[ind].componentName] = {
            value: {changes: thisString}
          }
        }
      }

    }

    // add value to stateVariableChangesToSave if value is essential
    // and no shadow sources were updated with value
    if(this._state.value.essential === true &&
        !(shadowedStateVariables.has("value"))){// && !isReplacement) {
      stateVariableChangesToSave.value = newStateVariables.value;
    }

    stateVariableChangesToSave.changedFromDownstreamUpdate = {changes: true};

    // console.log({
    //   componentName: this.componentName,
    //   dependenciesToUpdate: dependenciesToUpdate,
    //   stateVariableChangesToSave: stateVariableChangesToSave,
    // })

    return true;

  }

}