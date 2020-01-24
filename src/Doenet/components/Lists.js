import BlockComponent from './abstract/BlockComponent';
import BaseComponent from './abstract/BaseComponent';

export class Ol extends BlockComponent {
  static componentType = "ol";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.label = { default: undefined };
    return properties;
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atLeastZeroLis",
      componentType: 'li',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true
    });

    return childLogic;
  }

  initializeRenderer(){
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.list({
        key: this.componentName,
        numbered: true,
        label: this.state.label,
      });
    }
  }

  updateChildrenWhoRender(){
    this.childrenWhoRender = this.activeChildren.map(x => x.componentName);
  }
  
}


export class Ul extends Ol {
  static componentType = "ul";

  initializeRenderer(){
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.list({
        key: this.componentName,
        numbered: false,
        label: this.state.label,
      });
    }
  }
}


export class Li extends BaseComponent {
  static componentType = "li";

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
      this.renderer = new this.availableRenderers.list({
        key: this.componentName,
        item: true,
      });
    }
  }

  updateChildrenWhoRender(){
    this.childrenWhoRender = this.activeChildren.map(x => x.componentName);
  }
  
  static includeBlankStringChildren = true;

}