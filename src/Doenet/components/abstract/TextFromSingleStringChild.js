import Text from '../Text';

export default class TextFromSingleStringChild extends Text {
  static componentType = "_textfromsinglestringchild";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: "stringsAndTexts",
      componentType: 'string',
      comparison: 'atMost',
      number: 1,
      excludeCompositeReplacements: true,
      setAsBase: true,
    });

    return childLogic;
  }

}