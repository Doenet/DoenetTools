import NumberComponent from '../Number';
import me from 'math-expressions';

export default class NumberBaseOperatorOrNumber extends NumberComponent {
  static componentType = "_numberbaseoperatorornumber";

  static previewSerializedComponent({sharedParameters, serializedComponent}) {

    // if serializedComponent has a defaultToPrescribedParameters
    // essential state variable set, it overrides the value from shared parameters

    if(serializedComponent.state !== undefined &&
        serializedComponent.state.defaultToPrescribedParameters !== undefined) {
      sharedParameters.defaultToPrescribedParameters =
        serializedComponent.state.defaultToPrescribedParameters;
    }
    
    return;
  }


  static returnChildLogic ({standardComponentTypes, allComponentClasses, components,
      sharedParameters }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    if(sharedParameters.defaultToPrescribedParameters) {
      // if prescribed parameter, behaves just as a number component
      return childLogic;

    }

    childLogic.deleteAllLogic();

    let breakStringIntoNumbersByCommas = function({activeChildrenMatched}) {
      let stringChild = activeChildrenMatched[0];
      let newChildren = stringChild.state.value.split(",").map(x=> ({
        componentType: "number",
        state: {value: Number(x)}
      }));
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
      replacementFunction: breakStringIntoNumbersByCommas,
    });

    let atLeastZeroMaths = childLogic.newLeaf({
      name: "atLeastZeroMaths",
      componentType: 'math',
      comparison: "atLeast",
      number: 0,
    });

    childLogic.newOperator({
      name: "SugarXorMaths",
      operator: "xor",
      propositions: [exactlyOneString, atLeastZeroMaths],
      setAsBase: true,
    })
    return childLogic;
  }

  updateState(args={}) {

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      return;
    }

    if(this.sharedParameters.defaultToPrescribedParameters) {
      // if prescribed parameter, behaves just as a number component
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      let mathInds = this.childLogic.returnMatches("atLeastZeroMaths");
      this.state.mathChildren = mathInds.map(x=>this.activeChildren[x]);
      this.state.nMaths = mathInds.length;
    }

    if(this.state.nMaths > 0) {
      if(this.state.mathChildren.some(x => x.unresolvedState.value)) {
        this.unresolvedState.value = true;
        this.unresolvedState.latex = true;
        return;
      } else if(childrenChanged || this.state.mathChildren.some(x =>
        trackChanges.getVariableChanges({
          component: x, variable: "value"})
      )) {
        // recalculate value
        this.state.number = this.applyNumberOperator();
        delete this.unresolvedState.number;
      }
    }else {
      delete this.unresolvedState.number;
      if(!this._state.number.essential) {
        if(this._state.value.essential) {
          this.state.number = this.state.value.evaluate_to_constant();
        }else {
          this.state.number = this.applyNumberOperator();
        }
      }
    }

    delete this.unresolvedState.value;
    if(Number.isFinite(this.state.number)) {
      this.state.value = me.fromAst(this.state.number);
    }else {
      this.state.value = me.fromAst('\uFF3F'); // long underscore
    }

    if(trackChanges.getVariableChanges({
      component: this, variable: "value"
    }) ||
    trackChanges.getVariableChanges({
      component: this, variable: "displaydigits"
    })) {
      let rounded = this.state.value
        .round_numbers_to_precision(this.state.displaydigits);
      this.state.latex = rounded.toLatex();
      this.state.text = rounded.toString();
      delete this.unresolvedState.latex;
      delete this.unresolvedState.text;
    }
  }
  
}
