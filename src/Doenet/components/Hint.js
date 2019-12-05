import BlockComponent from './abstract/BlockComponent';

export default class Hint extends BlockComponent {
  static componentType = "hint";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroInline = childLogic.newLeaf({
      name: "atLeastZeroInline",
      componentType: '_inline',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroBlock = childLogic.newLeaf({
      name: "atLeastZeroBlock",
      componentType: '_block',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: 'inlineOrBlock',
      operator: "or",
      propositions: [atLeastZeroInline, atLeastZeroBlock],
      setAsBase: true,
    })
    
    return childLogic;
  }

  initializeRenderer(){
    if(this.renderer === undefined) {
      if(this.flags.showHints) {
        this.renderer = new this.availableRenderers.hint({
          key: this.componentName,
        });
      }
    }
  }

  updateChildrenWhoRender(){
    this.childrenWhoRender = this.activeChildren.map(x => x.componentName);
  }
  
  static includeBlankStringChildren = true;

}
