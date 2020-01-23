import InlineComponent from './InlineComponent';

export default class InlineRenderInlineChildren extends InlineComponent {
  static componentType = "_inlinerenderinlinechildren";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "AtLeastZeroInline",
      componentType: "_inline",
      comparison: "atLeast",
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }


  initializeRenderer(){
    if(this.renderer !== undefined) {
      return;
    }
    
    let rendererName = this.constructor.rendererName;
    if(rendererName === undefined) {
      rendererName = this.componentType;
    }
    this.renderer = new this.availableRenderers[rendererName]({
      key: this.componentName,
    });
  }

  updateChildrenWhoRender(){
    this.childrenWhoRender = this.activeChildren.map(x=>x.componentName);
  }

  static includeBlankStringChildren = true;


}