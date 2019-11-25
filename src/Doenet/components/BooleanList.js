import InlineComponent from './abstract/InlineComponent';

export default class BooleanList extends InlineComponent {
  static componentType = "booleanlist";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.unordered = {default: false};
    properties.maximumnumber = {default: undefined};
    return properties;
  }

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let atLeastZeroBooleans = childLogic.newLeaf({
      name: "atLeastZeroBooleans",
      componentType: 'boolean',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroBooleanlists = childLogic.newLeaf({
      name: "atLeastZeroBooleanlists",
      componentType: 'booleanlist',
      comparison: 'atLeast',
      number: 0
    });

    let breakStringIntoBooleansByCommas = function({activeChildrenMatched}) {
      let stringChild = activeChildrenMatched[0];
      let newChildren = stringChild.state.value.split(",").map(x=> ({
        componentType: "boolean",
        state: {value: ["true","t"].includes(x.trim().toLowerCase())}
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
      replacementFunction: breakStringIntoBooleansByCommas,
    });
    
    let booleanAndBooleanLists = childLogic.newOperator({
      name: "booleanAndBooleanLists",
      operator: "and",
      propositions: [atLeastZeroBooleans, atLeastZeroBooleanlists]
    })

    childLogic.newOperator({
      name: "BooleansXorSugar",
      operator: 'xor',
      propositions: [exactlyOneString, booleanAndBooleanLists],
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args={}) {
    if(args.init === true) {
      this.makePublicStateVariableArray({
        variableName: "booleans",
        componentType: "boolean",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "boolean",
        arrayVariableName: "booleans",
      });
      this.makePublicStateVariable({
        variableName: "ncomponents",
        componentType: "number",
      })
    }

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.booleans = true;
      this.unresolvedState.ncomponents = true;
      return;
    }

    delete this.unresolvedState.booleans;
    delete this.unresolvedState.ncomponents;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {
      let booleanAndBooleanlistChildrenInds = this.childLogic.returnMatches("booleanAndBooleanLists");
      this.state.booleanAndBooleanlistChildren = booleanAndBooleanlistChildrenInds.map(x => this.activeChildren[x]);
      let booleanChildrenInds = this.childLogic.returnMatches("atLeastZeroBooleans");
      this.state.booleanChildren = booleanChildrenInds.map(x => this.activeChildren[x]);
      let booleanlistChildrenInds = this.childLogic.returnMatches("atLeastZeroBooleanlists");
      this.state.booleanlistChildren = booleanlistChildrenInds.map(x => this.activeChildren[x]);

    }

    if (this.state.booleanChildren.some(x => x.unresolvedState.value) ||
      this.state.booleanlistChildren.some(x => x.unresolvedState.booleans)
    ) {
      this.unresolvedState.booleans = true;
      this.unresolvedState.ncomponents = true;
      return;
    }


    this.state.booleans = [];

    for(let child of this.state.booleanAndBooleanlistChildren) {
      if(child.componentType === "boolean") {
        this.state.booleans.push(child.state.value);
      } else{
        this.state.booleans.push(...child.state.booleans)
      }
    }

    if(this.state.maximumnumber !== undefined && this.state.booleans.length > this.state.maximumnumber) {
      let maxnum = Math.max(0,Math.floor(this.state.maximumnumber));
      this.state.booleans = this.state.booleans.slice(0,maxnum)
    }

    this.state.ncomponents = this.state.booleans.length;

  }


  initializeRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new this.availableRenderers.aslist({
        key: this.componentName,
      });
    }
  }

  updateChildrenWhoRender() {

    this.childrenWhoRender = [];
    for (let child of this.state.booleanAndBooleanlistChildren) {
      if (child.componentType === "boolean") {
        this.childrenWhoRender.push(child.componentName);
      } else {
        this.childrenWhoRender.push(...child.childrenWhoRender);
      }
    }
    if (this.childrenWhoRender.length > this.state.ncomponents) {
      this.childrenWhoRender.length = this.state.ncomponents;
    }

  }


}