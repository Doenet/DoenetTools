import CompositeComponent from './abstract/CompositeComponent';
import RandomNumber from './RandomNumber';
import SelectFromSequence from './SelectFromSequence';

export default class GenerateRandomNumbers extends CompositeComponent {
  constructor(args){
    super(args);

    this.serializedReplacements = this.createSerializedReplacements();
  }
  static componentType = "generaterandomnumbers";

  static childrenToAssignNames = [];

  static previewSerializedComponent = RandomNumber.previewSerializedComponent;

  static createPropertiesObject({standardComponentTypes}) {
    let properties = RandomNumber.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });

    properties.numberOfSamples = {default: 1};
    properties.withreplacement = {default: false};  //used only for discrete

    return properties;
  }

  static returnChildLogic = RandomNumber.returnChildLogic;


  updateState(args={}) {
    if(args.init) {
      if(this.state.seed !== undefined) {
        this.state.rng = new this.sharedParameters.rngClass(this.state.seed);
      }else {
        this.state.rng = new this.sharedParameters.rngClass();
      }

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

    if(!this.childLogicSatisfied) {
      this.serializedReplacements = [];
      this.state.randomResults = [];
      return;
    }

    RandomNumber.getRandomNumberParametersFromChildren(this);

    if(Object.keys(this.unresolvedState).length > 0) {
      this.serializedReplacements = [];
      this.state.randomResults = [];
      return;
    }
    
    this.state.randomResults = [];

    if(this.state.type === "gaussian") {
      if(this.state.mean === null) {
        this.state.mean = 0;
      }
      if(this.state.variance === null) {
        if(this.state.standarddeviation === null) {
          this.state.standarddeviation = 1;
        }
        this.state.variance = this.state.standarddeviation**2;
      }else if(this.state.standarddeviation === null) {
        this.state.standarddeviation = Math.sqrt(this.state.variance);
      }

      if(!(this.state.standarddeviation > 0) || !Number.isFinite(this.state.mean)) {
        let message = "Invalid mean (" + this.state.mean
        + ") or standard deviation (" + this.state.standarddeviation
        + ") for a gaussian random variable.";
        console.warn(message);
      }else {

        for(let i=0; i< this.state.numberOfSamples; i++) {

          // Standard Normal variate using Box-Muller transform.
          let u = 0, v = 0;
          while(u===0) {
            u = this.state.rng.random();
          }
          while(v===0) {
            v = this.state.rng.random();
          }
          let standardNormal =  Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
          this.state.randomResults.push(this.state.mean + this.state.standarddeviation*standardNormal);
        }
      }   
    }else if(this.state.type === "uniform") {

      if(this.state.from === undefined) {
        this.state.from = 0;
      }
      if(this.state.to === undefined) {
        this.state.to = 1;
      }

      let interval = this.state.to - this.state.from;

      for(let i=0; i< this.state.numberOfSamples; i++) {
        this.state.randomResults.push(this.state.from+this.state.rng.random()*interval)
      }

    }else {
      // type === "discrete"


      if(this.state.validParameters) {

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
      
        SelectFromSequence.calculateSequenceParameters(this.state);

        let numberUniqueRequired = 1;
        if(!this.state.withreplacement) {
          numberUniqueRequired = this.state.numberOfSamples;
        }
    
        if(numberUniqueRequired > this.state.count) {
          console.warn("Cannot randomly sample " + numberUniqueRequired + 
          " values from a sequence of length " + this.state.count);
        }else {
          this.state.randomResults = SelectFromSequence.selectValues({
            stateObj: this.state,
            numberUniqueRequired: numberUniqueRequired,
            numberToSelect: this.state.numberOfSamples, 
            withReplacement: this.state.withreplacement,
            rng: this.state.rng
          }) 
        }
      }
    }

    //TODO: NAMESPACES SHOULD BE IN CORE 
    // determine the namespace of the randomNumber
    let randomNumberAlias = this.doenetAttributes.componentAlias;
    if(randomNumberAlias !== undefined) {
      if(this.doenetAttributes.newNamespace === true) {
        this.state.randomNumberNamespace = randomNumberAlias + "/";
      }else {
        //Grab everything from the begining up to and including the slash
        this.state.randomNumberNamespace = randomNumberAlias.substring(0, randomNumberAlias.lastIndexOf('/')+1);
      }
    }
    
  }


  createSerializedReplacements() {

    let serializedReplacements = [];

    this.replacementsToWithhold = 0;

    let assignNames = this.doenetAttributes.assignNames;

    for(let [ind, num] of this.state.randomResults.entries()) {

      let name;
      if(assignNames !== undefined && ind < assignNames.length) {
        name = assignNames[ind];
      }else {
        // if nothing specified, create an obscure name
        name = "_" + this.componentName + "_" + ind;
      }
      // prepend randomNumber's namespace
      if(this.state.randomNumberNamespace !== undefined) {
        name = this.state.randomNumberNamespace + name;
      }

      serializedReplacements.push({
        componentType: "number",
        doenetAttributes: {componentAlias: name},
        state: {value: num},
      })
    }

    return serializedReplacements;
  }



  calculateReplacementChanges(componentChanges) {

    let replacementChanges = [];

    let numAssignNames = 0;
    if(this.doenetAttributes.assignNames!== undefined) {
      numAssignNames = this.doenetAttributes.assignNames.length;
    };

    let effectiveNumberOfReplacements = this.replacements.length - this.replacementsToWithhold;

    if(effectiveNumberOfReplacements > this.state.randomResults.length) {
      // have fewer results now, so delete or withhold some replacements

      let numberToWithhold = this.replacementsToWithhold;

      // don't delete any unless aren't withhoold any
      if(this.replacementsToWithhold === 0) {

        // will only delete those without names assigned
        let firstIndToDelete = Math.max(this.state.randomResults.length, numAssignNames);
        let numberToDelete = Math.max(0, this.replacements.length - firstIndToDelete);
        numberToWithhold = Math.max(0, numAssignNames - this.state.randomResults.length);

        if(numberToDelete > 0) {
          let replacementInstruction = {
            changeType: "delete",
            changeTopLevelReplacements: true,
            firstReplacementInd: firstIndToDelete,
            numberReplacementsToDelete: numberToDelete,
          }
          replacementChanges.push(replacementInstruction);
        }
      }else {
        // already withholding replacements, so just withhold more
        numberToWithhold = this.replacements.length - this.state.randomResults.length;
      }

      if(numberToWithhold !== this.replacementsToWithhold)  {
        let replacementInstruction = {
          changeType: "changedReplacementsToWithhold",
          replacementsToWithhold: numberToWithhold,
        };
        replacementChanges.push(replacementInstruction);   
      }
      
    }else if(effectiveNumberOfReplacements < this.state.randomResults.length) {
      // have more results now, so add additional replacements
      // or stop withholding them
      let newReplacements = [];
      let assignNames = this.doenetAttributes.assignNames;


      let numberToWithhold = Math.max(0,this.replacements.length - this.state.randomResults.length);

      if(numberToWithhold !== this.replacementsToWithhold) {
        let replacementInstruction = {
          changeType: "changedReplacementsToWithhold",
          replacementsToWithhold: numberToWithhold,
        };
        replacementChanges.push(replacementInstruction);   

      }

      // add any extras, if needed
      for(let ind=this.replacements.length; ind < this.state.randomResults.length; ind++) {

        let name;
        if(assignNames !== undefined && ind < assignNames.length) {
          name = assignNames[ind];
        }else {
          // if nothing specified, create an obscure name
          name = "_" + this.componentName + "_" + ind;
        }
        // prepend randomNumber's namespace
        if(this.state.randomNumberNamespace !== undefined) {
          name = this.state.randomNumberNamespace + name;
        }

        newReplacements.push({
          componentType: "number",
          doenetAttributes: {componentAlias: name},
          state: {value: this.state.randomResults[ind]},
        })
      }

      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: this.replacements.length,
        numberReplacementsToReplace: 0,
        serializedReplacements: newReplacements,
      }
      replacementChanges.push(replacementInstruction);
    }
    
    // update values of the remainder of the replacements
    let numUpdate = Math.min(this.replacements.length, this.state.randomResults.length);

    for(let ind=0; ind<numUpdate; ind++) {
      let replacementInstruction = {
        changeType: "updateStateVariables",
        component: this.replacements[ind],
        stateChanges: {value: this.state.randomResults[ind]}
      }
      replacementChanges.push(replacementInstruction);
    }

    return replacementChanges;
  }
}
