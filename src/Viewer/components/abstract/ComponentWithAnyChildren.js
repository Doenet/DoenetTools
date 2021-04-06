import BaseComponent from './BaseComponent';

export default class ComponentWithAnyChildren extends BaseComponent {
  static componentType = "_componentwithanychildren";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: 'anything',
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }

}
