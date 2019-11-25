import InlineComponent from './abstract/InlineComponent';

export default class Xref extends InlineComponent {
  static componentType = "xref";

  static previewSerializedComponent({ serializedComponent, sharedParameters, components }) {
    if (serializedComponent.children === undefined) {
      return;
    }

    for (let child of serializedComponent.children) {
      if (child.componentType === "ref") {
        if (child.doenetAttributes !== undefined && child.doenetAttributes.createdFromProperty) {
          // found a ref that was given as a property
          // change it to a reftarget
          child.componentType = "reftarget";
        }
        break;
      }
    }

    for (let child of serializedComponent.children) {
      if (child.componentType === "text") {
        if (child.doenetAttributes !== undefined && child.doenetAttributes.createdFromProperty) {
          // found a text that was given as a property
          // change it to a texttype
          child.componentType = "texttype";
        }
        break;
      }
    }
  }

  static createPropertiesObject({ standardComponentTypes }) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.texttype = { default: "type-global" };

    return properties;
  }


  static returnChildLogic({ standardComponentTypes, allComponentClasses, components }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let exactlyOneRefTarget = childLogic.newLeaf({
      name: 'exactlyOneRefTarget',
      componentType: 'reftarget',
      number: 1,
    });

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

    let stringsAndTexts = childLogic.newOperator({
      name: "stringsAndTexts",
      operator: 'and',
      propositions: [atLeastZeroStrings, atLeastZeroTexts],
      requireConsecutive: true,
    });

    let exactlyOneBranchId = childLogic.newLeaf({
      name: "exactlyOneBranchId",
      componentType: "branchid",
      number: 1,
    });

    let atMostOneTarget = childLogic.newLeaf({
      name: "atMostOneTarget",
      componentType: "target",
      comparison: "atMost",
      number: 1,
    })

    let branchIdAndOptionalTarget = childLogic.newOperator({
      name: "branchIdAndOptionalTarget",
      operator: "and",
      propositions: [exactlyOneBranchId, atMostOneTarget],
    })

    let refTargetXorBranchId = childLogic.newOperator({
      name: "refTargetXorBranchId",
      operator: "xor",
      propositions: [exactlyOneRefTarget, branchIdAndOptionalTarget],
    })

    childLogic.newOperator({
      name: "targetAndText",
      operator: "and",
      propositions: [refTargetXorBranchId, stringsAndTexts],
      setAsBase: true
    });


    return childLogic;
  }



  updateState(args = {}) {

    if (args.init) {
      this._state.refTarget = { trackChanges: true };
    }

    super.updateState(args);

    if (!this.childLogicSatisfied) {
      this.unresolvedState.refTarget = true;
      this.unresolvedDependencies = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {
      let exactlyOneRefTarget = this.childLogic.returnMatches("exactlyOneRefTarget");
      if (exactlyOneRefTarget.length === 1) {
        this.state.refTargetChild = this.activeChildren[exactlyOneRefTarget[0]];
        delete this.state.branchIdChild;

      } else {
        delete this.state.refTargetChild;

        let exactlyOneBranchId = this.childLogic.returnMatches("exactlyOneBranchId");
        this.state.branchIdChild = this.activeChildren[exactlyOneBranchId[0]];

        let atMostOneTarget = this.childLogic.returnMatches("atMostOneTarget");
        if (atMostOneTarget.length === 1) {
          this.state.targetChild = this.activeChildren[atMostOneTarget[0]];
        } else {
          delete this.state.targetChild;
        }

      }

      let stringsAndTexts = this.childLogic.returnMatches("stringsAndTexts");

      if (stringsAndTexts.length > 0) {
        this.state.stringTextChildren = stringsAndTexts.map(x => this.activeChildren[x]);
      } else {
        delete this.state.stringTextChildren;
      }

    }

    if (this.state.refTargetChild !== undefined && this.state.refTargetChild.unresolvedState.refTarget) {
      this.unresolvedState.refTarget = true;
      this.unresolvedDependencies = { [this.state.refTargetChild.componentName]: true };
      this.state.refTargetName = this.state.refTargetChild.state.refTargetName;
      return;
    }


    this.state.linktext = "automatic text (not implemented)"
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
    }

    if (this.state.refTargetChild !== undefined) {
      if (childrenChanged || trackChanges.getVariableChanges({
        component: this.state.refTargetChild, variable: "refTarget"
      })) {
        this.state.refTarget = this.state.refTargetChild.state.refTarget;
        this.state.refTargetName = this.state.refTargetChild.state.refTargetName;
        delete this.unresolvedState.refTarget;
        delete this.unresolvedDependencies;

        // add original reference dependencies
        this.addReferenceDependencies({ target: this.state.refTarget });

      }

      if (this.state.refTarget === undefined) {
        return;
      }

      if (this.state.refTarget.componentName === this.componentName) {
        let message = "Circular reference from " + this.componentName + " to itself."
        throw Error(message);
      }
    } else {
      // don't have refTargetChild, so must have branchIdChild

      if (this.state.branchIdChild.unresolvedState.value) {
        this.unresolvedState.branchId = true;
        return;
      }

      if (childrenChanged || trackChanges.getVariableChanges({
        component: this.state.branchIdChild, variable: "value"
      })) {
        this.state.branchId = this.state.branchIdChild.state.value;
        delete this.unresolvedState.branchId;
      }

      if (this.state.targetChild) {
        if (this.state.targetChild.unresolvedState.value) {
          this.unresolvedState.target = true;
        }


        if (childrenChanged || trackChanges.getVariableChanges({
          component: this.state.targetChild, variable: "value"
        })) {
          this.state.target = this.state.targetChild.state.value;
          delete this.unresolvedState.target;

          if (this.state.target[0] !== '/') {
            this.state.target = '/' + this.state.target;
          }
        }
      }

    }

  }


  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    if (this.state.refTargetName) {
      this.renderer = new this.availableRenderers.link({
        key: this.componentName,
        anchor: this.state.refTargetName,
        linktext: this.state.linktext,
      });
    } else {
      this.renderer = new this.availableRenderers.link({
        key: this.componentName,
        branchId: this.state.branchId,
        anchor: this.state.target,
        linktext: this.state.linktext,
      });

    }
  }

  updateRenderer() {
    if (this.state.refTargetName) {
      this.renderer.updateLink({
        anchor: this.state.refTargetName,
        linktext: this.state.linktext,
      });
    } else {
      this.renderer.updateLink({
        branchId: this.state.branchId,
        anchor: this.state.target,
        linktext: this.state.linktext,
      });

    }
  }

}