import Sequence from './Sequence';
import me from 'math-expressions';
import {enumerateSelectionCombinations} from '../utils/enumeration';

export default class SelectFromSequence extends Sequence {
  static componentType = "selectfromsequence";

  static childrenToAssignNames = [];

  // static selectedVariantVariable = "selectedValues";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.numbertoselect = {default: 1};
    properties.withreplacement = {default: false};
    properties.sortresults = {default: false};
    return properties;
  }

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let sequenceBase = childLogic.baseLogic;

    let atLeastZeroExcludeCombinations = childLogic.newLeaf({
      name: "atLeastZeroExcludeCombinations",
      componentType: 'excludecombination',
      comparison: "atLeast",
      number: 0
    });

    childLogic.newOperator({
      name: "selectFromSequenceLogic",
      operator: 'and',
      propositions: [sequenceBase,atLeastZeroExcludeCombinations],
      setAsBase: true,
    });

    return childLogic;

  }

  updateState(args={}) {

    if(args.init) {
      this.state.createdReplacements = false;
      if(this.state.excludedcombinations === undefined) {
        this.state.excludedcombinations = [];
      }
    }

    // component is not reselected
    // so run update only until selection is made
    if(this.state.madeSelection) {
      return;
    }

    super.updateState(args);

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      let excludeCombinationInds = this.childLogic.returnMatches("atLeastZeroExcludeCombinations");
      if(excludeCombinationInds.length > 0) {
        this.state.excludeCombinationChildren = excludeCombinationInds.map(x => this.activeChildren[x]);
      }else {
        delete this.state.excludeCombinationChildren;
      }
    }

    delete this.unresolvedState.excludedcombinations;

    if(this.state.excludeCombinationChildren) {
      if(this.state.excludeCombinationChildren.some(x=>x.unresolvedState.value)) {
        this.unresolvedState.excludedcombinations = true;
      }else if(childrenChanged || this.state.excludeCombinationChildren.some(
          x=> trackChanges.getVariableChanges({
          component: x, variable: "values"}))) {
        this.state.excludedcombinations = this.state.excludeCombinationChildren.map(x=>x.state.values);
      }
    }

    delete this.unresolvedState.selectedValues;

    if(!this.childLogicSatisfied || Object.keys(this.unresolvedState).length > 0 ||
        this.state.unresolvedDependenceChain !== undefined) {
      this.unresolvedState.selectedValues = true;
      this.state.previousNumbertoselect = this.state.numbertoselect;
      this.state.previousWithreplacement = this.state.withreplacement;
      this.unresolvedDependencies = {};
      this.unresolvedState.excludedcombinations = true;
      return
    }

    if(this.compositeDescendant && (
      this.state.previousNumbertoselect !== this.state.numbertoselect ||
      this.state.previousWithreplacement !== this.state.withreplacement ||
      !this.currentTracker.trackChanges.allowSelectExpands)
    ) {
      this.unresolvedState.selectedValues = true;
      this.state.previousNumbertoselect = this.state.numbertoselect;
      this.state.previousWithreplacement = this.state.withreplacement;
      this.unresolvedDependencies = {};
      return
    }

    delete this.unresolvedDependencies;

    // if make it this far, will make selection
    this.state.madeSelection = true;

    if(this.state.numbertoselect < 1) {
      this.state.selectedValues = [];
      return;
    }


    //TODO: NAMESPACES SHOULD BE IN CORE 
    // determine the namespace of the select
    let selectAlias = this.doenetAttributes.componentAlias;
    if(selectAlias !== undefined) {
      if(this.doenetAttributes.newNamespace === true) {
        this.state.selectNamespace = selectAlias + "/";
      }else {
        //Grab everything from the begining up to and including the slash
        this.state.selectNamespace = selectAlias.substring(0, selectAlias.lastIndexOf('/')+1);
      }
    }
    
    this.state.numbertoselect = Math.round(this.state.numbertoselect);

    if(this.state.selectedValues === undefined) {
      this.state.selectedValues = [];
    }

    // if already have selected values, then they must have been
    // passed in at the beginning.  Just use those values.
    if(this.state.selectedValues.length > 0) {
      return;
    }

    // make selected values essential so that they are saved
    this._state.selectedValues.essential = true;

    let numberUniqueRequired = 1;
    if(!this.state.withreplacement) {
      numberUniqueRequired = this.state.numbertoselect;
    }

    if(numberUniqueRequired > this.state.count) {
      throw Error("Cannot select " + numberUniqueRequired + 
      " values from a sequence of length " + this.state.count + ' (' + this.componentName +')');
    }

    // if desiredIndices is specfied, use those
    if(this.variants && this.variants.desiredVariant !== undefined) {
      let desiredIndices = this.variants.desiredVariant.indices;
      if(desiredIndices !== undefined) {
        if(desiredIndices.length !== this.state.numbertoselect) {
          throw Error("Number of indices specified for select must match number to select");
        }
        desiredIndices = desiredIndices.map(Number);
        if(!desiredIndices.every(Number.isInteger)) {
          throw Error("All indices specified for select must be integers");
        }
        let n = this.state.count;
        desiredIndices = desiredIndices.map(x => ((x % n) + n) % n);

        // assume excluded combination until show doesn't match
        let isExcludedCombination = true;

        for(let index of desiredIndices) {
          let componentValue = this.state.from;
          if(index > 0) {
            if(this.state.type === "math") {
              componentValue = componentValue.add(this.state.step.multiply(me.fromAst(index))).expand().simplify();
            } else {
              componentValue += this.state.step*index;
            }
          }

          if(this.state.type === "letters") {
            componentValue = this.constructor.numberToLetters(componentValue, this.state.lowercase);
          }

          // throw error if asked for an excluded value
          if(this.state.type === "math") {
            if(this.state.exclude.some(x => x.equals(componentValue))) {
              throw Error("Specified index of selectfromsequence that was excluded")
            }
          }else {
            if(this.state.exclude.includes(componentValue)) {
              throw Error("Specified index of selectfromsequence that was excluded")
            }
          }

          // check if matches the corresponding component of an excluded combination
          let matchedExcludedCombinationIndex = false
          if(this.state.type === "math") {
            if(this.state.excludedcombinations.some(x => [x,index].equals(componentValue))) {
              matchedExcludedCombinationIndex = true;
            }
          }else {
            if(this.state.excludedcombinations.some(x => x[index] === componentValue)) {
              matchedExcludedCombinationIndex = true;
            }
          }
          
          if(!matchedExcludedCombinationIndex) {
            isExcludedCombination = false;
          }

          this.state.selectedValues.push(componentValue);
        }

        if(isExcludedCombination) {
          throw Error("Specified indices of selectfromsequence that was an excluded combination")
        }

        return;
      }
    }

    let numberCombinationsExcluded =this.state.excludedcombinations.length;

    if(numberCombinationsExcluded === 0) {
      this.state.selectedValues = this.constructor.selectValues({
        stateObj: this.state,
        numberUniqueRequired: numberUniqueRequired,
        numberToSelect: this.state.numbertoselect,
        withReplacement: this.state.withreplacement,
        rng: this.sharedParameters.selectRng,
      });

    }else {

      let numberPossibilities = this.state.count-this.state.exclude.length;

      if(this.state.withreplacement) {
        numberPossibilities = Math.pow(numberPossibilities, this.state.numbertoselect);
      } else {
        let n = numberPossibilities;
        for(let i=1; i< this.state.numbertoselect; i++) {
          numberPossibilities *= n-i;
        }
      }
      
      // console.log(`numberPossibilities: ${numberPossibilities}`)

      if(numberCombinationsExcluded > 0.7*numberPossibilities) {
        throw Error("Excluded over 70% of combinations in selectFromSequence");
      }

      // with 200 chances with at least 70% success,
      // prob of failure less than 10^(-30)
      let foundValidCombination = false;
      for(let sampnum =0; sampnum < 200; sampnum++) {

        this.state.selectedValues = this.constructor.selectValues({
          stateObj: this.state,
          numberUniqueRequired: numberUniqueRequired,
          numberToSelect: this.state.numbertoselect,
          withReplacement: this.state.withreplacement,
          rng: this.sharedParameters.selectRng,
        });

        // try again if hit excluded combination
        if(this.state.type === "math") {
          if(this.state.excludedcombinations.some(x => x.every((v,i) => v.equals(this.state.selectedValues[i])))) {
            continue;
          }
        }else {
          if(this.state.excludedcombinations.some(x => x.every((v,i) => v === this.state.selectedValues[i]))) {
            continue;
          }
        }

        foundValidCombination = true;
        break;

      }

      if(!foundValidCombination) {
        // this won't happen, as occurs with prob < 10^(-30)
        throw Error("By extremely unlikely fluke, couldn't select combination of random values");
      }

    }

    if(this.state.sortresults) {
      if(this.state.type === "number") {
        this.state.selectedValues.sort((a,b) => a-b);
      } else if(this.state.type === 'letters') {
        // sort according to their numerical value, not as words
        let numericalValues = this.state.selectedValues.map(this.constructor.lettersToNumber);
        numericalValues.sort((a,b) => a-b);
        this.state.selectedValues = numericalValues.map(x => this.constructor.numberToLetters(x, this.state.lowercase))
      }

      // don't sort type math
    }

  }

  static selectValues({stateObj, numberUniqueRequired=1, numberToSelect=1, 
    withReplacement=false, rng}) {

    let selectedValues = [];

    if(stateObj.exclude.length  + numberUniqueRequired < 0.5*stateObj.count) {
      // the simplest case where the likelihood of getting excluded is less than 50%
      // just randomly select from all possibilities
      // and use rejection method to resample if an excluded is hit

      let selectedIndices = [];

      for(let ind =0; ind < numberToSelect; ind++) {

        // with 100 chances with at least 50% success,
        // prob of failure less than 10^(-30)
        let foundValid = false;
        let componentValue;
        let selectedIndex;
        for(let sampnum =0; sampnum < 100; sampnum++) {

          // random number in [0, 1)
          let rand = rng.random();
          // random integer from 0 to count-1
          selectedIndex = Math.floor(rand*stateObj.count);

          if(!withReplacement && 
            selectedIndices.includes(selectedIndex)) {
            continue;
          }

          componentValue = stateObj.from;
          if(selectedIndex > 0) {
            if(stateObj.type === "math") {
              componentValue = componentValue.add(stateObj.step.multiply(me.fromAst(selectedIndex))).expand().simplify();
            } else {
              componentValue += stateObj.step*selectedIndex;
            }
          }
    
          // try again if hit excluded value
          if(stateObj.type === "math") {
            if(stateObj.exclude.some(x => x.equals(componentValue))) {
              continue;
            }
          }else {
            if(stateObj.exclude.includes(componentValue)) {
              continue;
            }
          }

          foundValid = true;
          break;
        }
  
        if(!foundValid) {
          // this won't happen, as occurs with prob < 10^(-30)
          throw Error("By extremely unlikely fluke, couldn't select random value");
        }

        if(stateObj.type === "letters") {
          componentValue = this.numberToLetters(componentValue, stateObj.lowercase);
        }
        selectedValues.push(componentValue);
        selectedIndices.push(selectedIndex);
      }

      return selectedValues;

    }

    // for cases when a large fraction might be excluded
    // we will generate the list of possible values and pick from those

    let possibleValues = [];

    for(let ind=0; ind < stateObj.count; ind++) {
      let componentValue = stateObj.from;
      if(ind > 0) {
        if(stateObj.type === "math") {
          componentValue = componentValue.add(stateObj.step.multiply(me.fromAst(ind))).expand().simplify();
        } else {
          componentValue += stateObj.step*ind;
        }
      }

      if(stateObj.type === "math") {
        if(stateObj.exclude.some(x => x.equals(componentValue))) {
          continue;
        }
      }else {
        if(stateObj.exclude.includes(componentValue)) {
          continue;
        }
      }

      if(stateObj.type === "letters") {
        componentValue = this.numberToLetters(componentValue, stateObj.lowercase);
      }

      possibleValues.push(componentValue);

    }

    let numPossibleValues = possibleValues.length;

    if(numberUniqueRequired > numPossibleValues) {
      throw Error("Cannot select " + numberUniqueRequired + 
        " unique values from sequence of length " + numPossibleValues);
    }

    if(numberUniqueRequired === 1) {

      for(let ind =0; ind < numberToSelect; ind++) {

        // random number in [0, 1)
        let rand = rng.random();
        // random integer from 0 to numPossibleValues-1
        let selectedIndex = Math.floor(rand*numPossibleValues);

        selectedValues.push(possibleValues[selectedIndex]);
      }

      return selectedValues;

    }

    // need to select more than one value without replacement
    // shuffle array and choose first elements
    // https://stackoverflow.com/a/12646864
    for (let i = possibleValues.length - 1; i > 0; i--) {
      const rand = rng.random();
      const j = Math.floor(rand * (i + 1));
      [possibleValues[i], possibleValues[j]] = [possibleValues[j], possibleValues[i]];
    }

    selectedValues = possibleValues.slice(0, numberToSelect)
    return selectedValues;

  }

  createSerializedReplacements() {

    if(!this.state.madeSelection || Object.keys(this.unresolvedState).length > 0 ||
        this.state.unresolvedDependenceChain !== undefined) {
      return [];
    }else {
      this.state.createdReplacements = true;
    }

    let replacements = [];

    let assignNames = this.doenetAttributes.assignNames;

    for(let [ind, value] of this.state.selectedValues.entries()) {
      let name;

      if(assignNames !== undefined && ind < assignNames.length) {
        name = assignNames[ind];
      }else {
        // if nothing specified, create an obscure name
        name = "_" + this.componentName + "_" + ind;
      }
    
      // prepend select's namespace
      if(this.state.selectNamespace !== undefined) {
        name = this.state.selectNamespace + name;
      }

      // if selectfromsequence is specified to be hidden
      // then replacements should be hidden as well
      let state = {value: value};
      if(this.state.hide) {
        state.hide = true;
      }

      replacements.push({
        componentType: this.state.type,
        doenetAttributes: {componentAlias: name},
        state: state
      });
    }

    return replacements;
  }

  calculateReplacementChanges(componentChanges) {

    if(!this.state.madeSelection || Object.keys(this.unresolvedState).length > 0 ||
        this.state.unresolvedDependenceChain !== undefined || this.state.createdReplacements) {
      return [];
    }

    let replacementChanges = [];

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: 0,
      serializedReplacements: this.createSerializedReplacements(),
    };
    replacementChanges.push(replacementInstruction);

    return replacementChanges;

  }

  static determineNumberOfUniqueVariants({serializedComponent}) {
    let numbertoselect=1, withreplacement = false;
    if(serializedComponent.state !== undefined) {
      if(serializedComponent.state.numbertoselect !== undefined) {
        numbertoselect = serializedComponent.state.numbertoselect;
      }
      if(serializedComponent.state.withreplacement !== undefined) {
        withreplacement = serializedComponent.state.withreplacement;
      }
      if(serializedComponent.state.type !== undefined) {
        sequenceType = serializedComponent.state.type;
      }
    }
    if(serializedComponent.children === undefined) {
      return {succes: false}
    }
    
    let stringChild;
    let sequencePars = {};
    let excludes = [];
    for(let child of serializedComponent.children) {
      let componentType = child.componentType;
      if(componentType === "numbertoselect") {
        // calculate numbertoselect only if has its value set directly 
        // or if has a child that is a string
        let foundValid = false;
        if(child.state !== undefined && child.state.value !== undefined) {
          numbertoselect = Math.round(Number(child.state.value));
          foundValid = true;
        }
        // children overwrite state
        if(child.children !== undefined) {
          for(let grandchild of child.children) {
            if(grandchild.componentType === "string") {
              numbertoselect = Math.round(Number(grandchild.state.value));
              foundValid = true;
              break;
            }
          }
        }
        if(!foundValid) {
          return {success: false}
        }
      }else if(componentType === "withreplacement") {
        // calculate withreplacement only if has its implicitValue or value set directly 
        // or if has a child that is a string
        let foundValid = false;
        if(child.state !== undefined) {
          if(child.state.implicitValue !== undefined) {
            withreplacement = child.state.implicitValue;
            foundValid = true;
          }
          if(child.state.value !== undefined) {
            withreplacement = child.state.value;
            foundValid = true;
          }
        }
        // children overwrite state
        if(child.children !== undefined) {
          for(let grandchild of child.children) {
            if(grandchild.componentType === "string") {
              foundValid = true;
              if(["true","t"].includes(grandchild.state.value.trim().toLowerCase())) {
                withreplacement = true;
              }else {
                withreplacement = false;
              }
              break;
            }
          }
        }
        if(!foundValid) {
          return {success: false}
        }
      }else if(["type", "to", "from", "step", "count"].includes(componentType)) {
        // calculate sequencePars only if has its value set directly 
        // or if has a child that is a string
        let foundValid = false;
        if(child.state !== undefined && child.state.value !== undefined) {
          sequencePars[componentType] = child.state.value;
          foundValid = true;
        }
        // children overwrite state
        if(child.children !== undefined) {
          for(let grandchild of child.children) {
            if(grandchild.componentType === "string") {
              sequencePars[componentType] = grandchild.state.value;
              foundValid = true;
              break;
            }
          }
        }
        if(!foundValid) {
          return {success: false}
        }
      }else if(componentType === "exclude") {
        // calculate exclude if has a string child
        let foundValid = false;
        if(child.children !== undefined) {
          for(let grandchild of child.children) {
            if(grandchild.componentType === "string") {
              foundValid = true;
              let stringPieces = grandchild.state.value.split(",").map(x => x.trim());
              excludes.push(...stringPieces);
              break;
            }
          }
        }
        if(!foundValid) {
          return {success: false}
        }

      }else if(componentType === "string") {
        stringChild = child;
      }
    }

    if(stringChild !== undefined) {
      if(sequencePars.to !== undefined || sequencePars.from !== undefined) {
        return {success: false}
      }
      let stringPieces = stringChild.state.value.split(",");
      if(stringPieces.length === 1) {
        sequencePars.to = stringPieces[0].trim();
      }else if(stringPieces.length === 2) {
        sequencePars.from = stringPieces[0].trim();
        sequencePars.to = stringPieces[1].trim();
      }else {
        return {success: false}
      }
    }

    for(let par of ["to", "from", "step"]) {
      if(sequencePars[par] !== undefined) {
        if(sequencePars.type === "math") {
          if(typeof sequencePars[par] === "string") {
            sequencePars[par] = me.fromText(sequencePars[par]);
          }else if(sequencePars[par].tree === undefined) {
            return {success: false}
          }
        }else if(sequencePars.type === "letters" && par !== "step") {
          sequencePars[par] = this.lettersToNumber(sequencePars[par]);
          if(sequencePars[par] === undefined) {
            return {success: false}
          }
        }else {
          sequencePars[par] = Number(sequencePars[par]);
          if(!Number.isFinite(sequencePars[par])) {
            return {success: false}
          }
        }
      }
    }

    if(sequencePars.count !== undefined) {
      if(typeof sequencePars.count === "string") {
        sequencePars.count = Number(sequencePars.count);
      }
      if(!Number.isInteger(sequencePars.count) || sequencePars.count < 0) {
        return {success: false}
      }
    }

    for(let [ind, exc] of excludes.entries()) {
      if(sequencePars.type === "math") {
        if(typeof exc === "string") {
          exc = me.fromText(exc);
        }else if(exc.tree === undefined) {
          return {success: false}
        }
      }else if(sequencePars.type === "letters" && par !== "step") {
        exc = this.lettersToNumber(exc);
        if(exc === undefined) {
          return {success: false}
        }
      }else {
        exc = Number(exc);
        if(!Number.isFinite(exc)) {
          return {success: false}
        }
      }
      excludes[ind] = exc;
    }

    this.calculateSequenceParameters(sequencePars)

    let nOptions = sequencePars.count;
    let excludeIndices = [];
    if(excludes.length > 0) {
      if(sequencePars.type !== math) {
        excludes.sort();
        excludes = excludes.filter((x,ind,a) => x != a[ind-1]);
        for(let item of excludes) {
          if(item < sequencePars.from) {
            continue;
          }
          let ind = (item-sequencePars.from)/sequencePars.step;
          if(ind > sequencePars.count-1+1E-10) {
            break;
          }
          if(Math.abs(ind-Math.round(ind)) < 1E-10) {
            nOptions--;
            excludeIndices.push(ind);
          }
        }
      }
    }

    if(nOptions <=0) {
      return {success: false}
    }

    let uniqueVariantData = {
      excludeIndices: excludeIndices,
      nOptions: nOptions,
      numbertoselect: numbertoselect,
      withreplacement: withreplacement,
    }

    if(withreplacement || numbertoselect === 1) {
      let numberOfVariants = Math.pow(nOptions, numbertoselect);
      return {
        success: true,
        numberOfVariants: numberOfVariants,
        uniqueVariantData: uniqueVariantData
      }
    }

    let numberOfVariants = nOptions;
    for(let n=nOptions-1; n > nOptions-numbertoselect; n--) {
      numberOfVariants *=n;
    }
    return {
      success: true,
      numberOfVariants: numberOfVariants,
      uniqueVariantData: uniqueVariantData
    }
 
  }

  static getUniqueVariant({serializedComponent, variantNumber}) {

    if(serializedComponent.variants === undefined) {
      return {succes: false}
    }
    let numberOfVariants = serializedComponent.variants.numberOfVariants;
    if(numberOfVariants === undefined) {
      return {success: false}
    }

    if(!Number.isInteger(variantNumber) || variantNumber < 0 || variantNumber >= numberOfVariants) {
      return {success: false}
    }

    let uniqueVariantData = serializedComponent.variants.uniqueVariantData;
    let excludeIndices = uniqueVariantData.excludeIndices;
    let nOptions = uniqueVariantData.nOptions;
    let numbertoselect = uniqueVariantData.numbertoselect;
    let withreplacement = uniqueVariantData.withreplacement;

    let getSingleIndex = function(num) {
      let ind = num;
      for(let excludeInd of excludeIndices) {
        if(ind === excludeInd) {
          ind++;
        }
      }
      return ind;
    }

    if(numbertoselect === 1) {
      return {success: true, desiredVariant: {indices: [getSingleIndex(variantNumber)]}}
    }

    let numbers = enumerateSelectionCombinations({
      numberOfIndices: numbertoselect,
      numberOfOptions: nOptions,
      maxNumber: variantNumber+1,
      withReplacement: withreplacement,
    })[variantNumber];
    let indices = numbers.map(getSingleIndex)
    return {success: true, desiredVariant: {indices: indices}}

  }


}
