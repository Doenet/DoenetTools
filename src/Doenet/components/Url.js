import InlineComponent from './abstract/InlineComponent';

export default class Url extends InlineComponent {
  static componentType = "url";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesForReference() { return ["linktext"] };

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.href = { required: true };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroStrings = childLogic.newLeaf({
      name: "atLeastZeroStrings",
      componentType: 'string',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroTexts = childLogic.newLeaf({
      name: "atLeastZeroTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "stringsAndTexts",
      operator: 'and',
      propositions: [atLeastZeroStrings, atLeastZeroTexts],
      requireConsecutive: true,
      setAsBase: true,
    });

    return childLogic;
  }


  updateState(args = {}) {

    if (args.init) {


      this.makePublicStateVariable({
        variableName: "linktext",
        componentType: "text",
      });

    }

    super.updateState(args);

    if (!this.childLogicSatisfied) {
      this.unresolvedState.linktext = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {

      let stringsAndTexts = this.childLogic.returnMatches("stringsAndTexts");
      if (stringsAndTexts.length > 0) {
        this.state.stringTextChildren = stringsAndTexts.map(x => this.activeChildren[x]);
      } else {
        delete this.state.stringTextChildren;
      }
    }


    if (this.state.stringTextChildren !== undefined) {
      this.state.linktext = "";
      delete this.unresolvedState.linktext;
      for (let child of this.state.stringTextChildren) {
        if (child.unresolvedState.value) {
          this.unresolvedState.linktext = true;
          break;
        }
        this.state.linktext += child.state.value;
      }
    } else {
      if (this._state.linktext.essential !== true) {
        // if no string/text activeChildren and linktext wasn't set from state directly,
        // make linktext be href
        if (this.unresolvedState.href) {
          this.unresolvedState.linktext = true;
        } else {
          this.state.linktext = this.state.href;
          delete this.unresolvedState.linktext;
        }
      }
    }

  }


  initializeRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new this.availableRenderers.url({
        key: this.componentName,
        href: this.state.href,
        linktext: this.state.linktext,
      });
    } else {
      this.updateRenderer();
    }
  }

  updateRenderer() {
    this.renderer.updateURL({
      href: this.state.href,
      linktext: this.state.linktext,
    });
  }

}
