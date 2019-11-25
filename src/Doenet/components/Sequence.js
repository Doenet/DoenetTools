import CompositeComponent from './abstract/CompositeComponent';
import me from 'math-expressions';
import { deepCompare } from '../utils/deepFunctions';

export default class Sequence extends CompositeComponent {
  constructor(args){
    super(args);

    if(Object.keys(this.unresolvedState).length > 0 || !this.state.validSequence) {
      this.state.lastReplacementParameters = {
        type: undefined,
        from: undefined,
        count: undefined,
        step: undefined,
        exclude: undefined,
      }
    }else {
      this.state.lastReplacementParameters = {
        type: this.state.type,
        from: this.state.from,
        count: this.state.count,
        step: this.state.step,
        exclude: this.state.exclude,
      }
    }
    this._state.lastReplacementParameters.essential = true;

    this.serializedReplacements = this.createSerializedReplacements();
  }
  static componentType = "sequence";

  static defaultType = "number";

  static previewSerializedComponent({serializedComponent, sharedParameters, components}) {
    if(serializedComponent.children === undefined) {
      return;
    }

    // so count acts as a number
    sharedParameters.defaultToPrescribedParameters = true;
    
    let typeInd;
    for(let [ind,child] of serializedComponent.children.entries()) {
      if(child.componentType === "type") {
        typeInd = ind;
        break;
      }
    }

    let creationInstructions = [];

    if(typeInd !== undefined) {
      creationInstructions.push({createChildren: [typeInd]});
    }

    creationInstructions.push({callMethod: "setUpType"})

    return creationInstructions;

  }

  static setUpType({sharedParameters, definingChildrenSoFar, serializedComponent}) {
    let typeChild;
    for(let child of definingChildrenSoFar) {
      if(child !== undefined && child.componentType === "type") {
        typeChild = child;
        break;
      }
    }

    if(typeChild !== undefined) {
      // have a type child, so will get type from that child
      // once it is resolved
      sharedParameters.typeChild = typeChild;
      if(!typeChild.unresolvedState.value) {
        sharedParameters.typeForSelectableType = typeChild.state.value;
      }
    }else if(serializedComponent.state !== undefined && "type" in serializedComponent.state) {
      // type was specified directly via essential state variable
      sharedParameters.typeForSelectableType = serializedComponent.state.type;
    }else {

      // type was not specified via children or essential state variable
      // if can infer a type based on children, use that type
      // else use default type
      
      let toFromAreLetters = {};

      for(let child of serializedComponent.children) {
        // if have a string child, set type based on string
        // set to letters if the string is all letter
        // else set to default Type
        if(child.componentType ==="string") {
          if(lettersOnlyInString(child.state.value)) {
            sharedParameters.typeForSelectableType = "letters";
          }else {
            sharedParameters.typeForSelectableType = this.defaultType;
          }
          break;
        }
        // if don't find a string child, could base on to/from children
        // will consider them all letters if have
        // - a value state variable, or
        // - a single string child
        // that is all letters
        if(["to", "from"].includes(child.componentType)) {
          if(child.state !== undefined && lettersOnlyInString(child.state.value)) {
            toFromAreLetters[child.componentType] = true;
            continue;
          }else if(child.children !== undefined && child.children.length===1) {
            let grandChild = child.children[0];
            if(grandChild.componentType === "string" && 
                lettersOnlyInString(grandChild.state.value)) {
              toFromAreLetters[child.componentType] = true;
              continue;
            }
          }
          toFromAreLetters[child.componentType] = false;
        }
      }

      // if type isn't set yet, means didn't find a string child
      // set to letters if have to or from child that is letters
      // without having a to or from child that was definitely not letters
      // otherwise, set to defaultType
      if(sharedParameters.typeForSelectableType === undefined) {
        if(toFromAreLetters.to === true && toFromAreLetters.from !== false) {
          sharedParameters.typeForSelectableType = "letters";
        }else if(toFromAreLetters.from === true && toFromAreLetters.to !== false) {
          sharedParameters.typeForSelectableType = "letters";
        }else {
          sharedParameters.typeForSelectableType = this.defaultType;
        }
      }
    }

  }

  
  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.type = {default: undefined};
    return properties;
  }

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    function fromToAsString({activeChildrenMatched, sharedParameters}) {
      let stringChild = activeChildrenMatched[0];
      let stringPieces = stringChild.state.value.split(",");

      let newTypeChild = sharedParameters.typeChild;
      let newType;
      if(newTypeChild !== undefined) {
        if(newTypeChild.unresolvedState.value) {
          return {success: false}
        }else {
          newType = newTypeChild.state.value;
        }
      }else {
        newType = sharedParameters.typeForSelectableType;
      }

      if(!(newType in standardComponentTypes)) {
        // if didn't get a valid type, sugar fails
        return {success: false}
      }

      // set type ot make sure below sugar matches the child logic of the to/from
      sharedParameters.typeForSelectableType = newType;

      if(stringPieces.length === 1) {
        let toComponent = {
          componentType: "to",
          children: [{
            componentType: newType,
            children: [{
              createdComponent: true,
              componentName: stringChild.componentName
            }]
          }]
        };
        return {
          success: true,
          newChildren: [toComponent],
        }
      }else if(stringPieces.length === 2) {
        let fromComponent = {
          componentType: "from",
          children: [{
            componentType: newType,
            children: [{
              componentType: "string",
              state: {value: stringPieces[0].trim()}
            }]
          }]
        };
        let toComponent = {
          componentType: "to",
          children: [{
            componentType: newType,
            children: [{
              componentType: "string",
              state: {value: stringPieces[1].trim()}
            }]
          }]
        };
        return {
          success: true,
          newChildren: [fromComponent, toComponent],
          toDelete: [stringChild.componentName],
        }
      }else {
        return {success: false}
      }
    }

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1,
      isSugar: true,
      replacementFunction: fromToAsString,
    });

    let atMostOneFrom = childLogic.newLeaf({
      name: "atMostOneFrom",
      componentType: 'from',
      comparison: "atMost",
      number: 1
    });

    let atMostOneTo = childLogic.newLeaf({
      name: "atMostOneTo",
      componentType: 'to',
      comparison: "atMost",
      number: 1
    });

    let toFrom = childLogic.newOperator({
      name: "toFrom",
      operator: "and",
      propositions: [atMostOneFrom, atMostOneTo]
    })

    let sugarXorToFrom = childLogic.newOperator({
      name: "sugarXorToFrom",
      operator: "xor",
      propositions: [exactlyOneString, toFrom]
    })

    let atMostOneStep = childLogic.newLeaf({
      name: "atMostOneStep",
      componentType: 'step',
      comparison: "atMost",
      number: 1
    });

    let atMostOneCount = childLogic.newLeaf({
      name: "atMostOneCount",
      componentType: 'count',
      comparison: "atMost",
      number: 1
    });

    let atLeastZeroExcludes = childLogic.newLeaf({
      name: "atLeastZeroExcludes",
      componentType: 'exclude',
      comparison: "atLeast",
      number: 0
    });

    childLogic.newOperator({
      name: "sequenceLogic",
      operator: 'and',
      propositions: [sugarXorToFrom, atMostOneStep, atMostOneCount,atLeastZeroExcludes],
      setAsBase: true,
    });

    return childLogic;
  }


  updateState(args={}) {
    if(args.init) {
      // set up state variable so don't have to check if defined later
      if(this._state.from === undefined) {
        this._state.from = {trackChanges: true};
      }
      if(this._state.to === undefined) {
        this._state.to = {trackChanges: true};
      }
      if(this._state.step === undefined) {
        this._state.step = {trackChanges: true};
      }
      if(this._state.count === undefined) {
        this._state.count = {trackChanges: true};
      }
      if(this._state.exclude === undefined) {
        this._state.exclude = {trackChanges: true, value: []};
      }
    }

    super.updateState(args);

    if(!this.childLogicSatisfied || this.unresolvedState.type) {
      this.unresolvedState.to = true;
      this.unresolvedState.from = true;
      this.unresolvedState.step = true;
      this.unresolvedState.count = true;
      this.unresolvedState.exclude = true;
      this.serializedReplacements = [];
      return;
    }

    delete this.unresolvedState.to;
    delete this.unresolvedState.from;
    delete this.unresolvedState.step;
    delete this.unresolvedState.count;
    delete this.unresolvedState.exclude;

    if(this.state.type === undefined) {
      this.state.type = this.sharedParameters.typeForSelectableType;
    }

    if(!["number", "math", "letters"].includes(this.state.type)) {
      throw Error("Invalid type of sequence: must be number, math or letters");
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {

      let fromInds = this.childLogic.returnMatches("atMostOneFrom");
      if(fromInds.length === 1) {
        this.state.fromChild = this.activeChildren[fromInds[0]];
        this.state.basedOnFrom = true;
      }else {
        delete this.state.fromChild;
        if(this._state.from.essential) {
          this.state.basedOnFrom = true;
        }
      }

      let toInds = this.childLogic.returnMatches("atMostOneTo");
      if(toInds.length === 1) {
        this.state.toChild = this.activeChildren[toInds[0]];
        this.state.basedOnTo = true;
      }else {
        delete this.state.toChild;
        if(this._state.to.essential) {
          this.state.basedOnTo = true;
        }
      }

      let stepInds = this.childLogic.returnMatches("atMostOneStep");
      if(stepInds.length === 1) {
        this.state.stepChild = this.activeChildren[stepInds[0]];
        this.state.basedOnStep = true;
      }else {
        delete this.state.stepChild;
        if(this._state.step.essential) {
          this.basedOnStep = true;
        }
      }

      let countInds = this.childLogic.returnMatches("atMostOneCount");
      if(countInds.length === 1) {
        this.state.countChild = this.activeChildren[countInds[0]];
        this.state.basedOnCount = true;
      }else {
        delete this.state.countChild;
        if(this._state.count.essential) {
          this.state.basedOnCount = true;
        }
      }

      let excludeInds = this.childLogic.returnMatches("atLeastZeroExcludes");
      if(excludeInds.length > 0) {
        this.state.excludeChildren = excludeInds.map(x => this.activeChildren[x]);
      }else {
        delete this.state.excludeChildren;
      }
    }

    this.state.parameterChanged = false;
    let parameterUnresolved = false;

    if(this.state.fromChild) {
      if(this.state.fromChild.unresolvedState.value) {
        this.unresolvedState.from = true;
        parameterUnresolved = true;
      }else if(childrenChanged || trackChanges.getVariableChanges({
          component: this.state.fromChild, variable: "value"})) {
        this.state.from = this.state.fromChild.state.value;
        this.state.parameterChanged = true;
      }
    }else if(this._state.from.essential && trackChanges.getVariableChanges({
        component: this, variable: "from"})) {
      this.state.parameterChanged = true;
    }

    if(this.state.toChild) {
      if(this.state.toChild.unresolvedState.value) {
        this.unresolvedState.to = true;
        parameterUnresolved = true;
      }else if(childrenChanged || trackChanges.getVariableChanges({
          component: this.state.toChild, variable: "value"})) {
        this.state.to = this.state.toChild.state.value;
        this.state.parameterChanged = true;
      }
    }else if(this._state.to.essential && trackChanges.getVariableChanges({
        component: this, variable: "to"})) {
      this.state.parameterChanged = true;
    }

    if(this.state.stepChild) {
      if(this.state.stepChild.unresolvedState.value) {
        this.unresolvedState.step = true;
        parameterUnresolved = true;
      }else if(childrenChanged || trackChanges.getVariableChanges({
          component: this.state.stepChild, variable: "value"})) {
        this.state.step = this.state.stepChild.state.value;
        this.state.parameterChanged = true;
      }
    }else if(this._state.step.essential && trackChanges.getVariableChanges({
        component: this, variable: "step"})) {
      this.state.parameterChanged = true;
    }

    if(this.state.countChild) {
      if(this.state.countChild.unresolvedState.value) {
        this.unresolvedState.count = true;
        parameterUnresolved = true;
      }else if(childrenChanged || trackChanges.getVariableChanges({
          component: this.state.countChild, variable: "number"})) {
        this.state.count = this.state.countChild.state.number;
        this.state.parameterChanged = true;
      }
    }else if(this._state.count.essential && trackChanges.getVariableChanges({
        component: this, variable: "count"})) {
      this.state.parameterChanged = true;
    }

    if(this.state.excludeChildren) {
      if(this.state.excludeChildren.some(x=>x.unresolvedState.value)) {
        this.unresolvedState.exclude = true;
        parameterUnresolved = true;
      }else if(childrenChanged || this.state.excludeChildren.some(
          x=> trackChanges.getVariableChanges({
          component: x, variable: "values"}))) {
        this.state.exclude = this.state.excludeChildren.reduce((a,c)=>[...a, ...c.state.values], []);
        this.state.parameterChanged = true;
      }
    }else if(this._state.exclude.essential && trackChanges.getVariableChanges({
        component: this, variable: "exclude"})) {
      this.state.parameterChanged = true;
    }

    if(parameterUnresolved) {
      this.serializedReplacements = [];
      return;
    }else if(!(childrenChanged || this.state.parameterChanged)) {
      return;
    }

    // a parameter has changed so recalculate all parameters

    // if have a parameter that wasn't from child or essential state variable
    // reset to undefined
    if(!this.state.basedOnFrom) {
      this.state.from=undefined;
    }
    if(!this.state.basedOnTo) {
      this.state.to=undefined;
    }
    if(!this.state.basedOnStep) {
      this.state.step=undefined;
    }
    if(!this.state.basedOnCount) {
      this.state.count=undefined;
    }
    if(!this.state.excludeChildren && !this._state.exclude.essential) {
      this.state.exclude=[];
    }
 
    // console.log(this.state.from);
    // console.log(this.state.to);
    // console.log(this.state.step);
    // console.log(this.state.count);

    this.state.validSequence = true;

    if(this.state.count !== undefined) {
      if(!Number.isInteger(this.state.count) || this.state.count < 0) {
        console.log("Invalid count of sequence.  Must be a non-negative integer.")
        this.state.validSequence = false;
      }
    }

    if(this.state.step !== undefined) {
      // convert step to number if not math
      if(this.state.type !== "math" && !Number.isFinite(this.state.step)) {
        if(this.state.step && this.state.step.evaluate_to_constant) {
          this.state.step = this.state.step.evaluate_to_constant();
        }
        if(!Number.isFinite(this.state.step)) {
          console.log("Invalid step of sequence.  Must be a number for sequence of type " + this.state.type + ".")
          this.state.validSequence = false;
        }
      }
    }

    if(this.state.type === "letters") {
      if(this.state.lowercase === undefined) {

        // base whether lowercase or upper case on from, if it exists, else to
        this.state.lowercase = true;
        if(this.state.from !== undefined) {
          if(capitalRegex.test(this.state.from)) {
            this.state.lowercase = false;
          }
        }else if(this.state.to !== undefined) {
          if(capitalRegex.test(this.state.to)) {
            this.state.lowercase = false;
          }
        }
      }

      // if from, to, and exclude haven't already been converted to numbers
      // then convert to numbers
      if(this.state.from !== undefined) {
        if(typeof this.state.from === "string") {
          this.state.from = this.constructor.lettersToNumber(this.state.from);
        }
      }
      if(this.state.to !== undefined) {
        if(typeof this.state.to === "string") {
          this.state.to = this.constructor.lettersToNumber(this.state.to);
        }
      }
      for(let [index,value] of this.state.exclude.entries()) {
        if(typeof value === "string") {
          this.state.exclude[index] = this.constructor.lettersToNumber(value)
        }
      }
    }

    if(this.state.validSequence) {
      this.constructor.calculateSequenceParameters(this.state);
    }


    // console.log("from: ");
    // console.log(this.state.from);
    // console.log("count: ");
    // console.log(this.state.count);
    // console.log("step: ");
    // console.log(this.state.step);
    // console.log("exclude: ");
    // console.log(this.state.exclude);

    // console.log("to: ");
    // console.log(this.state.to);

  }

  static calculateSequenceParameters(stateObj) {
    // calculate from, count and step from combinatons of from/to/count/step specified

    if(stateObj.from === undefined) {
      if(stateObj.to === undefined) {
        if(stateObj.type === "math") {
          stateObj.from = me.fromAst(1);
        }else {
          stateObj.from = 1;
        }
        if(stateObj.step === undefined) {
          // no from, to, or step
          if(stateObj.type === "math") {
            stateObj.step = me.fromAst(1);
          }else {
            stateObj.step = 1;
          }
          if(stateObj.count === undefined) {
            stateObj.count = 10;
          }
        } else {
          // no from or to, but step
          if(stateObj.count === undefined) {
            stateObj.count = 10;
          }
        }
      }else {
        // no from, but to
        if(stateObj.step === undefined) {
          if(stateObj.type === "math") {
            stateObj.step = me.fromAst(1);
          }else {
            stateObj.step = 1;
          }
        }
        if(stateObj.count === undefined) {
          if(stateObj.type === "math") {
            stateObj.count = Math.floor(stateObj.to.subtract(1).divide(stateObj.step).evaluate_to_constant() + 1);
          }else {
            stateObj.count = Math.floor((stateObj.to-1)/stateObj.step+1)
          }
        }

        // no from, but to
        // defined step and count even if none
        if(stateObj.type === "math") {
          stateObj.from = stateObj.to.subtract(stateObj.step.multipy(stateObj.count-1)).simplify();
        }else {
          stateObj.from = stateObj.to-stateObj.step*(stateObj.count-1);
          if(stateObj.type === "letters") {
            if(stateObj.from < 1) {
              // adjust count so that have valid letters
              stateObj.count = Math.floor((stateObj.to-1)/stateObj.step+1)
              stateObj.from = stateObj.to-stateObj.step*(stateObj.count-1);

            }
          }
        }
      }
    }else {
      // from defined
      if(stateObj.to === undefined) {
        // no to, but from
        if(stateObj.step === undefined) {
          if(stateObj.type === "math") {
            stateObj.step = me.fromAst(1);
          }else {
            stateObj.step = 1;
          }
        }
        if(stateObj.count === undefined) {
          stateObj.count = 10;
        }
      }else {
        // from and to defined
        if(stateObj.step === undefined) {
          if(stateObj.count === undefined) {
            if(stateObj.type === "math") {
              stateObj.step = me.fromAst(1);
              stateObj.count = stateObj.to.subtract(stateObj.from).add(1).evaluate_to_constant();
            }else {
              stateObj.step = 1;
              stateObj.count = (stateObj.to-stateObj.from+1);
            }
          }else {
            if(stateObj.type === "math") {
              stateObj.step = stateObj.to.subtract(stateObj.from).divide(stateObj.count-1);
            }else {
              stateObj.step = (stateObj.to-stateObj.from)/(stateObj.count-1);
              // for letters, step must be integer
              if(stateObj.type === "letters") {
                stateObj.step = Math.floor(stateObj.step);
              }
            }
          }
        }else {
          if(stateObj.count === undefined) {
            // from, to, and step, no count
            if(stateObj.type === "math") {
              stateObj.count = Math.floor(stateObj.to.subtract(stateObj.from).divide(stateObj.step).add(1).evaluate_to_constant());
            }else {
              stateObj.count = Math.floor((stateObj.to-stateObj.from)/stateObj.step+1);
            }
          }else {
            // from, to, step, and count defined
            throw Error("Can't define from, to, step, and count for sequence");
          }
        }
      }
    }

    if(!Number.isInteger(stateObj.count) || stateObj.count < 0) {
      console.log("Invalid count of sequence.  Must be a non-negative integer.")
      stateObj.count=0;
    }

  }

  createSerializedReplacements() {

    if(Object.keys(this.unresolvedState).length > 0 || !this.state.validSequence) {
      this.state.lastReplacementParameters = {
        type: undefined,
        from: undefined,
        count: undefined,
        step: undefined,
        exclude: undefined,
      }
      return [];
    }

    let replacements = [];

    this.replacementsToWithhold = 0;

    let nReplacementsToAttempt = this.state.count;

    for(let ind=0; ind < nReplacementsToAttempt; ind++) {
      let componentValue = this.state.from;
      if(ind > 0) {
        if(this.state.type === "math") {
          componentValue = componentValue.add(this.state.step.multiply(me.fromAst(ind))).expand().simplify();
        } else {
          componentValue += this.state.step*ind;
        }
      }

      if(this.state.type === "math") {
        if(this.state.exclude.some(x => x.equals(componentValue))) {
          continue;
        }
      }else {
        if(this.state.exclude.includes(componentValue)) {
          continue;
        }
      }

      if(this.state.type === "letters") {
        componentValue = this.constructor.numberToLetters(componentValue, this.state.lowercase);
      }

      let serializedComponent = {
        componentType: this.state.type,
        state: {value: componentValue}
      }
      replacements.push(serializedComponent);
    }

    return replacements;
  }

  calculateReplacementChanges(componentChanges) {

    let replacementChanges = [];

    // if unresolved or invalid, have no replacements
    if(Object.keys(this.unresolvedState).length > 0 || !this.state.validSequence) {
      if(this.replacements.length > 0) {
        let replacementInstruction = {
          changeType: "delete",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          numberReplacementsToDelete: this.replacements.length,
        }

        replacementChanges.push(replacementInstruction);
      }
      
      let lrp = this.state.lastReplacementParameters
      if(lrp.type || lrp.from || lrp.count || lrp.step || lrp.exclude) {
        let replacementInstruction = {
          changeType: "updateStateVariables",
          component: this,
          stateChanges: {
            lastReplacementParameters: {
              type: undefined,
              from: undefined,
              count: undefined,
              step: undefined,
              exclude: undefined,
            }
          }
        }
        replacementChanges.push(replacementInstruction);
      }
      return replacementChanges;
    }

    if(!this.state.parameterChanged) {
      return [];
    }

    // check if changed type
    // or have excluded elements
    // TODO: don't completely recreate if have excluded elements
    if(!this.state.lastReplacementParameters ||
      this.state.lastReplacementParameters.type !== this.state.type ||
      this.state.lastReplacementParameters.exclude.length > 0 ||
      this.state.exclude.length > 0
      ) {

      // calculate new serialized replacements
      // but don't allow replacements to withhold to change
      let previousReplacmentsToWithhold = this.replacementsToWithhold;
      let newSerializedReplacements = this.createSerializedReplacements();
      let newReplacementsToWithhold = this.replacementsToWithhold;
      this.replacementsToWithhold = previousReplacmentsToWithhold;

      if(newReplacementsToWithhold === undefined) {
        newReplacementsToWithhold = 0;
      }

      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToReplace: this.replacements.length,
        serializedReplacements: newSerializedReplacements,
        replacementsToWithhold: newReplacementsToWithhold,
      };

      replacementChanges.push(replacementInstruction);

    } else {

      let modifyExistingValues = false;
      if(this.state.type === "math") {
        if(!(this.state.from.equals(this.state.lastReplacementParameters.from) &&
          this.state.step.equals(this.state.lastReplacementParameters.step))) {
            modifyExistingValues = true;
        }

      } else {
        if(this.state.from !== this.state.lastReplacementParameters.from ||
          this.state.step !== this.state.lastReplacementParameters.step) {
            modifyExistingValues = true;
        }
      }

      let prevCount = this.state.lastReplacementParameters.count;
      let numReplacementsToAdd = 0;
      let numToModify = 0;
      let firstToModify = prevCount;
      let newReplacementsToWithhold;

      // if have fewer replacements than before
      // mark old replacements as hidden
      if(this.state.count < prevCount) {
        newReplacementsToWithhold = this.replacementsToWithhold + prevCount - this.state.count;

        let replacementInstruction = {
          changeType: "changedReplacementsToWithhold",
          replacementsToWithhold: newReplacementsToWithhold,
        };
        replacementChanges.push(replacementInstruction);   

      }else if(this.state.count > prevCount) {
        numReplacementsToAdd = this.state.count - prevCount;
        
        if(this.replacementsToWithhold > 0) {
          if(this.replacementsToWithhold >= numReplacementsToAdd) {
            newReplacementsToWithhold = this.replacementsToWithhold - numReplacementsToAdd;
            numToModify += numReplacementsToAdd;
            prevCount += numReplacementsToAdd;
            numReplacementsToAdd = 0;

            let replacementInstruction = {
              changeType: "changedReplacementsToWithhold",
              replacementsToWithhold: newReplacementsToWithhold,
            };
            replacementChanges.push(replacementInstruction);   
    
          } else {
            numReplacementsToAdd -= this.replacementsToWithhold;
            numToModify += this.replacementsToWithhold;
            prevCount += this.replacementsToWithhold;
            newReplacementsToWithhold = 0;
            // don't need to send changedReplacementsToWithold instructions
            // since will send add instructions,
            // which will also recalculate replacements in parent

          }
        }
      }

      if(modifyExistingValues === true) {
        numToModify = prevCount;
        firstToModify = 0;
      }

      if(numToModify > 0) {
        // need to modify values of the first prevCount components

        for(let ind=firstToModify; ind < firstToModify + numToModify; ind++) {
          let componentValue = this.state.from;
          if(ind > 0) {
            if(this.state.type === "math") {
              componentValue = componentValue.add(this.state.step.multiply(me.fromAst(ind))).expand().simplify();
            } else {
              componentValue += this.state.step*ind;
            }
          }
          if(this.state.type === "letters") {
            componentValue = this.constructor.numberToLetters(componentValue, this.state.lowercase);
          }
          let replacementInstruction = {
            changeType: "updateStateVariables",
            component: this.replacements[ind],
            stateChanges: {value: componentValue}
          }
          replacementChanges.push(replacementInstruction);
        }
      }

      if(numReplacementsToAdd > 0) {
        // Need to add more replacement components

        let newSerializedReplacements = [];

        for(let ind=prevCount; ind < this.state.count; ind++) {
          let componentValue = this.state.from;
          if(ind > 0) {
            if(this.state.type === "math") {
              componentValue = componentValue.add(this.state.step.multiply(me.fromAst(ind))).expand().simplify();
            } else {
              componentValue += this.state.step*ind;
            }
          }
          if(this.state.type === "letters") {
            componentValue = this.constructor.numberToLetters(componentValue, this.state.lowercase);
          }

          let serializedComponent = {
            componentType: this.state.type,
            state: {value: componentValue}
          }
          newSerializedReplacements.push(serializedComponent);
        }

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: prevCount,
          numberReplacementsToReplace: 0,
          serializedReplacements: newSerializedReplacements,
          replacementsToWithhold: newReplacementsToWithhold,
        }
        replacementChanges.push(replacementInstruction);
      }
    }

    let lrp = this.state.lastReplacementParameters;
    if(lrp.type !== this.state.type ||
      lrp.from !== this.state.from ||
      lrp.count !== this.state.count ||
      lrp.step !== this.state.step ||
      !deepCompare(lrp.exclude, this.state.exclude, this.allComponentClasses._base)
    ) {
      let replacementInstruction = {
        changeType: "updateStateVariables",
        component: this,
        stateChanges: {
          lastReplacementParameters: {
            type: this.state.type,
            from: this.state.from,
            count: this.state.count,
            step: this.state.step,
            exclude: this.state.exclude,
          }
        }
      }
      replacementChanges.push(replacementInstruction);
    }

    // console.log(replacementChanges);
    return replacementChanges;

  }

  static lettersToNumber(letters) {
    letters = letters.toUpperCase();
  
    let number = 0,
      len = letters.length,
      pos = len;
    while ((pos -= 1) > -1) {
      let numForLetter = letters.charCodeAt(pos) - 64;
      if(numForLetter < 1 || numForLetter > 26) {
        console.log("Cannot convert " + letters + " to a number");
        return undefined;
      }
      number += numForLetter * Math.pow(26, len - 1 - pos);
    }
    return number;
  }
  
  static numberToLetters(number, lowercase){
    number--;
    let offset = 65;
    if(lowercase) {
      offset = 97;
    }
    let letters = "";
    while(true) {  
      let nextNum = number % 26;
      letters = String.fromCharCode(offset + nextNum) + letters;
      if(number < 26) {
        break;
      }
      number = Math.floor(number/26)-1;
    }
    return letters;
  }
  
}

var capitalRegex = /^[A-Z]*$/;


function lettersOnlyInString(s) {
  if(typeof s !== "string") {
    return false;
  }

  let pieces = s.split(",").map(x => x.trim());

  return pieces.every(x=> /^[a-zA-Z]+$/.test(x));

}
