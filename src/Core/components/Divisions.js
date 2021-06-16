import BlockComponent from './abstract/BlockComponent';
import InlineComponent from './abstract/InlineComponent';

export class Div extends BlockComponent {
  static componentType = "div";
  static rendererType = "container";
  static renderChildren = true;

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "anything",
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });
    
    return childLogic;
  }


}


export class Span extends InlineComponent {
  static componentType = "span";
  static rendererType = "container";
  static renderChildren = true;

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "anything",
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });
    
    return childLogic;
  }


}

