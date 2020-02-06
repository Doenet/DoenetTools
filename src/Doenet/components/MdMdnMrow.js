import BlockComponent from './abstract/BlockComponent';
import { M } from './MMeMen';
import me from 'math-expressions';

export class Md extends BlockComponent {
  static componentType = "md";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static stateVariablesForReference = ["value"];

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atLeastZeroMrows",
      componentType: 'mrow',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args = {}) {

    super.updateState(args);

    if (args.init) {
      this.makePublicStateVariable({
        variableName: "value",
        componentType: this.componentType
      });

      this.state.renderMode = "align";

    }

    if (!this.childLogicSatisfied) {
      this.unresolvedState.value = true;
      return;
    }


    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {

      let atLeastZeroMrows = this.childLogic.returnMatches("atLeastZeroMrows");

      if (atLeastZeroMrows.length > 0) {
        this.state.mrowChildren = atLeastZeroMrows.map(x => this.activeChildren[x]);
      } else {
        delete this.state.mrowChildren;
      }
    }

    if (this.state.mrowChildren) {

      if (this.state.mrowChildren.some(x => x.unresolvedState.value)) {
        this.unresolvedState.value = true;
        return;
      }

      if (childrenChanged || this.state.mrowChildren.some(x => trackChanges.getVariableChanges({
        component: x, variable: "value"
      })) ||
        this.state.mrowChildren.some(x => trackChanges.getVariableChanges({
          component: x, variable: "hide"
        }))) {
        this.state.value = this.state.mrowChildren.filter(x => !x.state.hide).map(x => x.state.value).join('\\\\');
        delete this.unresolvedState.value
      }
    } else {

      // if no mrow activeChildren and value wasn't set from state directly,
      // make value be blank

      if (this._state.value.essential !== true || this.state.value === undefined) {
        this.state.value = "";
      }
      delete this.unresolvedState.value;
    }

  }


  toText() {
    let expressionText;
    if (!this.state.value) {
      return;
    }
    try {
      expressionText = this.state.value.split('\\\\').map(
        x => me.fromLatex(x).toString()
      ).join('\\\\');
    } catch (e) {
      // just return latex if can't parse with math-expression
      return this.state.value;
    }
    return expressionText.toString();
  }

  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    this.renderer = new this.availableRenderers.math({
      key: this.componentName,
      mathLatex: this.state.value,
      renderMode: this.state.renderMode,
    });
  }

  updateRenderer() {
    this.renderer.updateMathLatex(this.state.value);
  }

}

export class Mdn extends Md {
  static componentType = "mdn";

  updateState(args = {}) {
    super.updateState(args);
    if (args.init) {
      this.state.renderMode = "alignnumbered";
    }
  }
}


export class Mrow extends M {
  static componentType = "mrow";

  updateState(args = {}) {
    super.updateState(args);
    if (args.init) {
      this.state.renderMode = "display";
    }
  }
} 
