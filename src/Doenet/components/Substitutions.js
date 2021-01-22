import BaseComponent from './abstract/BaseComponent';

export default class Substitutions extends BaseComponent {
  static componentType = "substitutions";
  static rendererType = "container";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: 'atLeastZeroChildren',
      componentType: '_base',
      excludeComponentTypes: ['_composite'],
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numberOfChildren = {
      additionalStateVariablesDefined: ["childComponentNames", "childIdentities"],
      returnDependencies: () => ({
        children: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroChildren",
          requireChildLogicInitiallySatisfied: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        let numberOfChildren = dependencyValues.children.length;
        let childComponentNames = dependencyValues.children.map(x => x.componentName);
        return {
          newValues: {
            numberOfChildren,
            childComponentNames,
            childIdentities: dependencyValues.children,
          }
        };
      },
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        children: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroChildren"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues:
            { childrenToRender: dependencyValues.children.map(x => x.componentName) }
        };
      }
    }


    return stateVariableDefinitions;

  }

}
