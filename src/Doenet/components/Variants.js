import InlineComponent from './abstract/InlineComponent';

export default class Variants extends InlineComponent {
  static componentType = "variants";

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let atLeastZeroVariants = childLogic.newLeaf({
      name: "atLeastZeroVariants",
      componentType: 'variant',
      comparison: 'atLeast',
      number: 0
    });

    let breakStringIntoVariantsByCommas = function({activeChildrenMatched}) {
      let stringChild = activeChildrenMatched[0];
      let newChildren = stringChild.state.value.split(",").map(x=> ({
        componentType: "variant",
        state: {value: x.trim()}
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
      replacementFunction: breakStringIntoVariantsByCommas,
    });
    
    childLogic.newOperator({
      name: "VariantsXorSugar",
      operator: 'xor',
      propositions: [exactlyOneString,atLeastZeroVariants],
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args={}) {
    if(args.init === true) {
      this.makePublicStateVariableArray({
        variableName: "variants",
        componentType: "variant",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "variant",
        arrayVariableName: "variants",
      });
      this.makePublicStateVariable({
        variableName: "nvariants",
        componentType: "number",
      })
    }

    super.updateState(args);
    
    if(!this.childLogicSatisfied) {
      this.unresolvedState.variants = true;
      this.unresolvedState.nvariants = true;
      return;
    }

    delete this.unresolvedState.variants;
    delete this.unresolvedState.nvariants;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      let variantChildrenInds = this.childLogic.returnMatches("atLeastZeroVariants");
      if(variantChildrenInds.length > 0) {
        this.state.variantChildren = variantChildrenInds.map(x => this.activeChildren[x]);
        this.state.nvariants = this.state.variantChildren.length;
      }else {
        delete this.state.variantChildren;
        this.state.nvariants = 0;
      }
    }

    if(this.state.variantChildren) {
      if(childrenChanged || this.state.variantChildren.some(x=>trackChanges.getVariableChanges({
          component: x, variable: "value"}))) {
        this.state.variants = this.state.variantChildren.map(x => x.state.value);
      }
    }else {
      this.state.variants = [];
    }

  }
}