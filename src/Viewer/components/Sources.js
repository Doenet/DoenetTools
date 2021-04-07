import BaseComponent from './abstract/BaseComponent';

export default class Sources extends BaseComponent {
  static componentType = "sources";
  static rendererType = "container";

  static acceptAlias = true;
  static acceptIndexAlias = true;

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

    stateVariableDefinitions.alias = {
      returnDependencies: () => ({
        alias: {
          dependencyType: "doenetAttribute",
          attributeName: "alias"
        }
      }),
      definition({ dependencyValues }) {
        return { newValues: { alias: dependencyValues.alias } }
      }
    }

    stateVariableDefinitions.indexAlias = {
      returnDependencies: () => ({
        indexAlias: {
          dependencyType: "doenetAttribute",
          attributeName: "indexAlias"
        }
      }),
      definition({ dependencyValues }) {
        return { newValues: { indexAlias: dependencyValues.indexAlias } }
      }
    }


    stateVariableDefinitions.numberOfChildren = {
      additionalStateVariablesDefined: ["childComponentNames", "childIdentities"],
      returnDependencies: () => ({
        children: {
          dependencyType: "child",
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
          dependencyType: "child",
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
