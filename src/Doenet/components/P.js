import BlockComponent from './abstract/BlockComponent';

export default class P extends BlockComponent {
  static componentType = "p";

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

  initializeRenderer(){
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.p({
        key: this.componentName,
      });
    }
  }

  updateChildrenWhoRender(){
    this.childrenWhoRender = this.activeChildren.map(x => x.componentName);
  }

  static includeBlankStringChildren = true;

}
