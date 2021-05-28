import BaseComponent from './abstract/BaseComponent';
import TextComponent from './Text';

export class H extends TextComponent {
  static componentType = "h";
  static rendererType = "text";
}

export class Idx extends BaseComponent {
  static componentType = "idx";
  static rendererType = undefined;

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroHs = childLogic.newLeaf({
      name: "atLeastZeroHs",
      componentType: "h",
      comparison: 'atLeast',
      number: 0,
    })

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
    });

    childLogic.newOperator({
      name: "textXorHs",
      operator: 'xor',
      propositions: [atLeastZeroHs, stringsAndTexts],
      setAsBase: true
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.terms = {
      returnDependencies: () => ({
        stringTextChildren: {
          dependencyType: "child",
          childLogicName: "stringsAndTexts",
          variableNames: ["value"],
        },
        hChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroHs",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues }) {
        let terms;
        if (dependencyValues.hChildren.length > 0) {
          terms = dependencyValues.hChildren.map(x => x.stateValues.value)
        } else {
          let value = "";
          for (let comp of dependencyValues.stringTextChildren) {
            value += comp.stateValues.value;
          }
          terms = [value];
        }
        return { newValues: { terms } }
      }
    }

    return stateVariableDefinitions;

  }

}
