import BaseComponent from './abstract/BaseComponent';

export default class Slider extends BaseComponent {
  static componentType = "slider";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.width = {default: 300};
    properties.height = {default: 50};
    properties.initialnumber = {default: undefined};
    properties.initialtext = {default: undefined};
    properties.label = {default: undefined};
    properties.showcontrols = {default: false};
    properties.showticks = {default: true};
    
    return properties;
  }

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let AtLeastOneNumbers = childLogic.newLeaf({
      name: "AtLeastOneNumbers",
      componentType: 'number',
      comparison: 'atLeast',
      number: 1,
    });
    let AtLeastOneTexts = childLogic.newLeaf({
      name: "AtLeastOneTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 1,
    });

    let AtMostOneMarkers = childLogic.newLeaf({
      name: "AtMostOneMarkers",
      componentType: 'markers',
      comparison: 'atMost',
      number: 1,
    });
    
    let NumbersXorTexts = childLogic.newOperator({
      name: "NumbersXorTexts",
      operator: 'xor',
      propositions: [AtLeastOneNumbers, AtLeastOneTexts],
    });

    childLogic.newOperator({
      name: "SliderLogic",
      operator: 'and',
      propositions: [NumbersXorTexts, AtMostOneMarkers],
      setAsBase: true,
    });


    return childLogic;
  }

  updateState(args={}) {
    if(args.init) {

      this.makePublicStateVariable({
        variableName: "value",
        componentType: "text"  // placeholder until know slider type
      });
      this.makePublicStateVariableArray({
        variableName: "items",
        componentType: "text", // placeholder until know slider type
      });

      this.changeValue = this.changeValue.bind(this);
    }

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.sliderType = true;
      this.unresolvedState.value = true;
      this.unresolvedState.index = true;
      this.unresolvedState.markers = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      const textItemsIndices = this.childLogic.returnMatches('AtLeastOneTexts');
      this.state.textChildren = textItemsIndices.map(x=>this.activeChildren[x]);
      const numberItemsIndices = this.childLogic.returnMatches('AtLeastOneNumbers');
      this.state.numberChildren = numberItemsIndices.map(x=>this.activeChildren[x]);

      const markersIndices = this.childLogic.returnMatches('AtMostOneMarkers');
      if(markersIndices.length === 1) {
        this.state.markersChild = this.activeChildren[markersIndices[0]];
      }else {
        delete this.state.markersChild;
        this.state.markers = [];
      }
      
      if (textItemsIndices.length > 0){
        this.state.sliderType = 'text';
      }else if(numberItemsIndices.length > 0) {
        this.state.sliderType = 'number';
      }else {
        // unneeded due to child logic....
        throw Error('Slider can only handle number or text');
      }

      delete this.unresolvedState.sliderType;

      this._state.value.componentType = this.state.sliderType;
      this._state.items.componentType = this.state.sliderType;

    }

    if(this.state.sliderType === "text") {
      if(this.state.textChildren.some(x => x.unresolvedState.value)) {
        this.unresolvedState.value = true;
        this.unresolvedState.index = true;
        this.unresolvedState.markers = true;
        return;
      }

      if(childrenChanged || this.state.textChildren.some(x => trackChanges.getVariableChanges({
        component: x, variable: "value"
      }))) {

        this.state.items = this.textChildren.map(x=>x.state.value);

        delete this.unresolvedState.items;

      }
    }else if(this.state.sliderType === "number") {

      if(this.state.numberChildren.some(x => x.unresolvedState.number)) {
        this.unresolvedState.value = true;
        this.unresolvedState.index = true;
        this.unresolvedState.markers = true;
        return;
      }

      if(childrenChanged || this.state.numberChildren.some(x => trackChanges.getVariableChanges({
        component: x, variable: "number"
      }))) {

        this.state.items = this.state.numberChildren.map(x => x.state.number);

        //sort in number order
        this.state.items.sort((a,b) => {return a-b;})

        delete this.unresolvedState.items;

      }
    }

    if(childrenChanged || trackChanges.getVariableChanges({component: this, variable: "items"})) {
      this.state.valueToIndex = {};
      for (let ind in this.state.items){
        let item = this.state.items[ind];
        this.state.valueToIndex[item] = ind;
      }
    }

    // if this is first time through, set initial value
    if(this.state.initialvalue === undefined) {
      
      if (this._state.value.essential === true){
        this.state.initialvalue = this.state.value;
      }
      this._state.value.essential = true;

      // override initial value from essential state if have children
      if(this.state.sliderType === "number") {
        if(this.state.initialnumber !== undefined) {
          this.state.initialvalue = this.state.initialnumber;
        }
      } else if(this.state.sliderType === "text") {
        if(this.state.initialtext !== undefined) {
          this.state.initialvalue = this.state.initialtext;
        }
      }
    
      this.state.index = 0; //default to 0
      if (this.state.valueToIndex[this.state.initialvalue] !== undefined){
        this.state.index = this.state.valueToIndex[this.state.initialvalue];
      }

      this.state.value = this.state.items[this.state.index];

    }else{

      // since initialvalue was set already
      // must not be first time through

      this.state.value = this.findClosestValidValue(this.state.value);
      //The text value might not match so choose the first item
      if (this.state.value === undefined){
        this.state.index = 0;
        this.state.value = this.state.items[this.state.index];

      } else {
        this.state.index = this.state.valueToIndex[this.state.value];
      }

    }

    delete this.unresolvedState.value;
    delete this.unresolvedState.index;

    if(this.state.markersChild) {
      if(childrenChanged ||
        trackChanges.getVariableChanges({
          component: this.state.markersChild, variable: "markerType"}) ||
        trackChanges.getVariableChanges({
          component: this.state.markersChild, variable: "markers"})
      ) {

        let markerType = markersChild.state.markerType;
      
        if (markerType === 'empty'){
          //All Ticks become markers
          this.state.markers = [...this.state.items];
        }else if(markerType !== this.state.sliderType) {
          //Note: no markers when they don't match and not init
          console.warn("Markers type doesn't match slider type.");
          this.state.markers = [];
        }else{
          this.state.markers = this.state.markersChild.state.markers;
        }

        delete this.unresolvedState.markers;
      }
    }
  }

  changeValue({value}) {
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: {
          value: {changes: value}
        }
      }]
    });

  }

  initializeRenderer({}){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    
    const actions = {
      changeValue: this.changeValue,
    }
    
    this.renderer = new this.availableRenderers.slider({
      actions: actions,
      key: this.componentName,
      index: this.state.index,
      items: this.state.items,
      sliderType: this.state.sliderType,
      width: this.state.width,
      height: this.state.height,
      valueToIndex: this.state.valueToIndex,
      markers: this.state.markers,
      label: this.state.label,
      showcontrols: this.state.showcontrols,
      showticks: this.state.showticks,
    });
  }

  updateRenderer(){
    this.renderer.updateSlider({
      index: this.state.index,
      items: this.state.items,
      sliderType: this.state.sliderType,
      width: this.state.width,
      height: this.state.height,
      valueToIndex: this.state.valueToIndex,
      markers: this.state.markers,
      label: this.state.label,
      showcontrols: this.state.showcontrols,
      showticks: this.state.showticks,
    })
    
  }

  allowDownstreamUpdates(status) {
    // since can't change via parents, 
    // only non-initial change can be due to reference
    return(status.initialChange === true || this.state.modifybyreference === true);
  }

  get variablesUpdatableDownstream() {
    // for now, only know how to change value
    return ["value"];
  }

  
  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {

    let newValue = this.findClosestValidValue(stateVariablesToUpdate.value.changes);

    //Text value given by another component didn't match so can't update
    if (newValue === undefined){
      return false;
    }

    let newStateVariables = {value: {changes: newValue}};

    let shadowedResult = this.updateShadowSources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // if didn't update a downstream referenceShadow
    // then this slider is at the bottom
    // and we need to give core instructions to update its value explicitly
    // if the the update is successful
    if(!shadowedStateVariables.has("value") && !isReplacement) {
      stateVariableChangesToSave.value = newStateVariables.value;
    }

    return true;

  }



  findClosestValidValue(newValue) {

    // first check if newValue is actually a known value
    let matchedIndex = this.state.valueToIndex[newValue];
    if(matchedIndex !== undefined) {
      return newValue;
    }

    // for text, we don't have a way to find the closest value
    if(this.state.sliderType === "text") {
      return undefined;
    }

    let items = this.state.items;
    let findNextLargerIndex = function (minIndex = 0, maxIndex = items.length - 1) {
      if (maxIndex <= minIndex + 1) {
        if (newValue > items[minIndex]) {
          return maxIndex;
        }
        else {
          return minIndex;
        }
      }
      let midIndex = Math.round((maxIndex + minIndex) / 2);
      if (newValue > items[midIndex]) {
        return findNextLargerIndex(midIndex, maxIndex);
      }
      else {
        return findNextLargerIndex(minIndex, midIndex);
      }
    };
    let closeIndex = findNextLargerIndex();
    if (closeIndex === 0) {
      newValue = items[0];
    }
    else {
      let leftValue = items[closeIndex - 1];
      let rightValue = items[closeIndex];
      let leftDist = Math.abs(newValue - leftValue);
      let rightDist = Math.abs(newValue - rightValue);
      if (leftDist < rightDist) {
        newValue = leftValue;
      }
      else {
        newValue = rightValue;
      }
    }
    return newValue;
  }
}