import BaseComponent from './abstract/BaseComponent';

export default class VariantControl extends BaseComponent {
  static componentType = "variantcontrol";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.nvariants = {default: 100};
    properties.uniquevariants = {default: false};
    
    // base component has variants as a property
    // but want to treat variants separately here
    delete properties.variants;

    return properties;
  }

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let atMostOneSeeds = childLogic.newLeaf({
      name: 'atMostOneSeeds',
      componentType: 'seeds',
      comparison: 'atMost',
      number: 1,
    });

    let atMostOneVariants = childLogic.newLeaf({
      name: 'atMostOneVariants',
      componentType: 'variants',
      comparison: 'atMost',
      number: 1,
    });

    childLogic.newOperator({
      name: "seedsAndVariants",
      operator: "and",
      propositions: [atMostOneSeeds, atMostOneVariants],
      setAsBase: true,
    })

    return childLogic;
  }


  updateState(args={}) {
    if(args.init) {
      this.makePublicStateVariableArray({
        variableName: "seeds",
        componentType: "seed",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "seed",
        arrayVariableName: "seeds",
      });
      this.makePublicStateVariableArray({
        variableName: "variants",
        componentType: "variant",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "variant",
        arrayVariableName: "variants",
      });
      this.makePublicStateVariable({
        variableName: "selectedVariantNumber",
        componentType: "number",
      });
      this.makePublicStateVariable({
        variableName: "selectedVariant",
        componentType: "text",
      });

      // bind this to getRng so won't have read-only proxy
      this.getRng = this.getRng.bind(this);
    }


    // variantControl doesn't update,
    // so run update only until variant is selected
    if(this.state.variantSelected) {
      return;
    }

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.seeds = true;
      this.unresolvedState.variants = true;
      this.unresolvedState.selectedVariantNumber = true;
      this.unresolvedState.selectedVariant = true;
      return;
    }

    delete this.unresolvedState.seeds;
    delete this.unresolvedState.variants;
    delete this.unresolvedState.selectedVariantNumber;
    delete this.unresolvedState.selectedVariant;

    // if get this far, variant will be selected
    this.state.variantSelected = true;

    this.state.nvariants = Math.round(this.state.nvariants);
    if(this.state.nvariants < 1) {
      this.state.nvariants = 1;
    }

    // if have unique variants, then shared parameters
    // should may an override for the number of variants
    if(this.state.uniquevariants) {
      if(this.sharedParameters.numberOfVariants !== undefined) {
        this.state.nvariants = this.sharedParameters.numberOfVariants;
      }else {
        console.log("Restricting to unique variants was not successful")
      }
    }

    let variantsInd = this.childLogic.returnMatches("atMostOneVariants");
    if(variantsInd.length ===1) {
      this.state.variantsChild = this.activeChildren[variantsInd[0]];
      this.state.variants = this.state.variantsChild.state.variants.map(x => x.toLowerCase());
    }else {
      this.state.variants = [];
    }

    // if fewer variants specified that nvariants, find additional variants
    // try variants, n, n+1, ...., nvariants, (converted to letters)
    // except skipping variants that are already in original variants
    let variantNumber = this.state.variants.length;
    let variantValue = variantNumber-1;
    let variantString;
    let originalVariants = [...this.state.variants];
    while(variantNumber < this.state.nvariants) {
      variantNumber++;
      variantValue++;
      variantString = numberToLowercaseLetters(variantValue);
      while(originalVariants.includes(variantString)) {
        variantValue++;
        variantString = numberToLowercaseLetters(variantValue);
      }
      this.state.variants.push(variantString);
    }


    // determine how variant will be selected.
    // Use the first of these options that is available
    // 1. if selectedVariantNumber is an essential state variable
    //    then use that variantNumber
    // 2. if variants.desiredVariantNumber is defined and is a valid index,
    //    then use that for variantNumber
    // 3. if variants.desiredVariant is defined and is a valid variant
    //    then use the variantNumber corresponding to that value
    // 4. else, random generate variantNumber


    if(this._state.selectedVariantNumber.essential !== true) {
      let variantFound = false;
      // no essential state variable, so try to find desiredVariant
      if(this.variants !== undefined) {
        if(this.variants.desiredVariantNumber !== undefined) {
          let desiredVariantNumber = Number(this.variants.desiredVariantNumber);
          if(!Number.isInteger(desiredVariantNumber)) {
            throw Error("Variant number " + this.variants.desiredVariantNumber + " must be an integer");
          }else {
            this.state.selectedVariantNumber = desiredVariantNumber % this.state.nvariants;
            if(this.state.selectedVariantNumber < 0) {
              this.state.selectedVariantNumber += this.state.nvariants;
            }
            variantFound = true;
          }
        }
        if(!variantFound && this.variants.desiredVariant !== undefined) {
          if(typeof this.variants.desiredVariant === "string") {
            // want case insensitive test, so convert to lower case
            let originalLowerCaseVariants = originalVariants.map(x => x.toLowerCase());
            let lowerCaseVariants = [...originalLowerCaseVariants, ...this.state.variants.slice(originalLowerCaseVariants.length)];
            let desiredNumber = lowerCaseVariants.indexOf(this.variants.desiredVariant.toLowerCase());
            if(desiredNumber !== -1) {
              this.state.selectedVariantNumber = desiredNumber;
              variantFound = true;
            }
          }
          if(!variantFound) {
            console.log("Variant " + this.variants.desiredVariant + " is not valid, convert to variant index");
            this.state.selectedVariantNumber = Math.abs(
              this.sharedParameters.hashStringToInteger(
                JSON.stringify(this.variants.desiredVariant)
              )
              % this.state.nvariants
            );
            variantFound = true;
          }
        }
      }
      if(!variantFound) {
        // randomly pick variant number using random number generator
        // from shared parameters

        // random number in [0, 1)
        let rand = this.sharedParameters.selectRng.random();
        // random integer from 0 to nvariants-1
        this.state.selectedVariantNumber = Math.floor(rand*this.state.nvariants);
      }
    }

    // set information about selected variant as essential
    // so don't reselect if regenerate
    this._state.selectedVariantNumber.essential = true;

    this.state.selectedVariant = this.state.variants[this.state.selectedVariantNumber];

    let seedsInd = this.childLogic.returnMatches("atMostOneSeeds");
    if(seedsInd.length === 1) {
      this.state.seedsChild = this.activeChildren[seedsInd[0]];
      this.state.seeds = this.state.seedsChild.state.seeds;
    }

    if(this.state.selectedVariantNumber < this.state.seeds.length) {
      this.state.selectedSeed = this.state.seeds[this.state.selectedVariantNumber];
    }else {
      // if fewer seeds than selectedVariantNumber, find additional seeds
      // try seeds, n+1, n+2, ...., selectedVariantNumber
      // except skipping seeds that are already in original seeds
      let seedNumber = this.state.seeds.length-1;
      let seedValue = seedNumber+1;
      let seedString;
      while(seedNumber < this.state.selectedVariantNumber) {
        seedNumber++;
        seedValue++;
        seedString = seedValue.toString();
        while(this.state.seeds.includes(seedString)) {
          seedValue++;
          seedString = seedValue.toString();
        }
      }
      this.state.selectedSeed = seedString;
    }

    this.state.convertedSeed = this.sharedParameters.hashStringToInteger(
      this.state.selectedSeed
    );
    this.state.selectRng = new this.sharedParameters.rngClass(this.state.convertedSeed);

  }

  getRng() {
    return this.state.selectRng;
  }
}

function numberToLowercaseLetters(number){
  let letters = "";
  while(true) {  
    let nextNum = number % 26;
    letters = String.fromCharCode(97 + nextNum) + letters;
    if(number < 26) {
      break;
    }
    number = Math.floor(number/26)-1;
  }
  return letters;
}