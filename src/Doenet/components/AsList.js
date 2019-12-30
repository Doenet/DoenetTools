import InlineComponent from './abstract/InlineComponent';
import { textFromComponent } from '../utils/text';

export default class AsList extends InlineComponent {
  static componentType = "aslist";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atLeastZeroInline",
      componentType: '_inline',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.childrenWhoRender = {
      returnDependencies: () => ({
        activeChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroInline"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues:
            { childrenWhoRender: dependencyValues.activeChildren.map(x => x.componentName) }
        };
      }
    }

    return stateVariableDefinitions;
  }

  initializeRenderer(){
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.aslist({
        key: this.componentName,
      });
    }
  }

  toText() {

    let atLeastZeroInline = this.childLogic.returnMatches("atLeastZeroInline");
    if(atLeastZeroInline.length > 0) {
      let children = atLeastZeroInline.map(x => this.activeChildren[x]);
      let textpieces = [];
      for(let child of children) {
        let results = textFromComponent({component: child, textClass: this.allComponentClasses.text});
        if(results.success) {
          textpieces.push(results.textValue)
        }else {
          textpieces.push("")
        }
      }
      return textpieces.join(', ');
    }

    return "";
  }

}
