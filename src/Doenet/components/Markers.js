import BaseComponent from './abstract/BaseComponent';

export default class Markers extends BaseComponent {
  static componentType = "markers";

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

    let NoTexts = childLogic.newLeaf({
      name: "NoTexts",
      componentType: 'text',
      comparison: 'exactly',
      number: 0,
      allowSpillover: false,
    });
    
    let NoNumbers = childLogic.newLeaf({
      name: "NoNumbers",
      componentType: 'number',
      comparison: 'exactly',
      number: 0,
      allowSpillover: false,
    });

    let NoTextAndNoNumbers = childLogic.newOperator({
      name: "NoTextAndNoNumbers",
      operator: 'and',
      propositions: [NoNumbers,NoTexts],
    });

    childLogic.newOperator({
      name: "MarkerLogic",
      operator: 'xor',
      propositions: [AtLeastOneNumbers, AtLeastOneTexts, NoTextAndNoNumbers],
      setAsBase: true,
    });


    return childLogic;
  }

  updateState(args={}) {
    if(args.init) {

      this.makePublicStateVariable({
        variableName: "markerType",
        componentType: "text"
      });
      this.makePublicStateVariableArray({
        variableName: "markers",
        componentType: "text", // placeholder until know marker type
      });

    }


    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.markers = true;
      this.unresolvedState.markerType = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      let numberChildIndices = this.childLogic.returnMatches('AtLeastOneNumbers')
      this.state.numberChildren = numberChildIndices.map(x => this.activeChildren[x]);

      let textChildIndices = this.childLogic.returnMatches('AtLeastOneTexts')
      this.state.textChildren = textChildIndices.map(x => this.activeChildren[x]);

      if (textChildIndices.length > 0){
        this.state.markerType = 'text';
        this._state.markers.componentType = this.state.markerType;
      }else if(numberChildIndices.length > 0) {
        this.state.markerType = 'number';
        this._state.markers.componentType = this.state.markerType;
      }else {
        this.state.markerType = 'empty';
      }

      delete this.unresolvedState.markerType;

    }


    if(this.state.markerType === 'text') {
      if(this.state.textChildren.some(x => x.unresolvedState.value)) {
        this.unresolvedState.markers = true;
        return;
      }
      if(childrenChanged || this.state.textChildren.some(x =>
        trackChanges.getVariableChanges({component: x, variable: "value"}))
      ) {

        delete this.unresolvedState.markers;
          
        this.state.markers = this.state.textChildren.map(x => x.state.value);
      }  

    }else if (this.state.markerType === "number") {
      if(this.state.numberChildren.some(x => x.unresolvedState.number)) {
        this.unresolvedState.markers = true;
        return;
      }

      if(childrenChanged || this.state.numberChildren.some(x =>
        trackChanges.getVariableChanges({component: x, variable: "number"}))
      ) {

        delete this.unresolvedState.markers;

        this.state.markers = this.state.numberChildren.map(x => x.state.number);

        //sort in number order
        this.state.markers.sort((a,b) => {return a-b;})

      }
    }

  }


}