import InlineComponent from './abstract/InlineComponent';

export default class TextList extends InlineComponent {
  static componentType = "textlist";

  static createPropertiesObject({ standardComponentTypes }) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.unordered = { default: false };
    properties.maximumnumber = {default: undefined};
    return properties;
  }

  static returnChildLogic({ standardComponentTypes, allComponentClasses, components }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let atLeastZeroTexts = childLogic.newLeaf({
      name: "atLeastZeroTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroTextlists = childLogic.newLeaf({
      name: "atLeastZeroTextlists",
      componentType: 'textlist',
      comparison: 'atLeast',
      number: 0
    });

    let breakStringIntoTextsByCommas = function ({ activeChildrenMatched }) {
      let stringChild = activeChildrenMatched[0];
      let newChildren = stringChild.state.value.split(",").map(x => ({
        componentType: "text",
        state: { value: x.trim() }
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
      replacementFunction: breakStringIntoTextsByCommas,
    });

    let textAndTextLists = childLogic.newOperator({
      name: "textAndTextLists",
      operator: "and",
      propositions: [atLeastZeroTexts, atLeastZeroTextlists]
    })

    childLogic.newOperator({
      name: "TextsXorSugar",
      operator: 'xor',
      propositions: [exactlyOneString, textAndTextLists],
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args = {}) {
    if (args.init === true) {
      this.makePublicStateVariableArray({
        variableName: "texts",
        componentType: "text",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "text",
        arrayVariableName: "texts",
      });
      this.makePublicStateVariable({
        variableName: "ncomponents",
        componentType: "number",
      })
    }

    super.updateState(args);

    if (!this.childLogicSatisfied) {
      this.unresolvedState.texts = true;
      this.unresolvedState.ncomponents = true;
      return;
    }

    delete this.unresolvedState.texts;
    delete this.unresolvedState.ncomponents;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {
      let textAndTextlistChildrenInds = this.childLogic.returnMatches("textAndTextLists");
      this.state.textAndTextlistChildren = textAndTextlistChildrenInds.map(x => this.activeChildren[x]);
      let textChildrenInds = this.childLogic.returnMatches("atLeastZeroTexts");
      this.state.textChildren = textChildrenInds.map(x => this.activeChildren[x]);
      let textlistChildrenInds = this.childLogic.returnMatches("atLeastZeroTextlists");
      this.state.textlistChildren = textlistChildrenInds.map(x => this.activeChildren[x]);

    }

    if (this.state.textChildren.some(x => x.unresolvedState.value) ||
      this.state.textlistChildren.some(x => x.unresolvedState.texts)
    ) {
      this.unresolvedState.texts = true;
      this.unresolvedState.ncomponents = true;
      return;
    }


    this.state.texts = [];

    for(let child of this.state.textAndTextlistChildren) {
      if(child.componentType === "text") {
        this.state.texts.push(child.state.value);
      } else{
        this.state.texts.push(...child.state.texts)
      }
    }

    if(this.state.maximumnumber !== undefined && this.state.texts.length > this.state.maximumnumber) {
      let maxnum = Math.max(0,Math.floor(this.state.maximumnumber));
      this.state.texts = this.state.texts.slice(0,maxnum)
    }

    this.state.ncomponents = this.state.texts.length;

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
    if(this.state.textAndTextlistChildren !== undefined) {
      for (let child of this.state.textAndTextlistChildren) {
        if (child.componentType === "text") {
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


}