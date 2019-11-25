import BaseComponent from './abstract/BaseComponent';

export default class Substitutions extends BaseComponent {
  static componentType = "substitutions";

  static returnChildLogic({ standardComponentTypes, allComponentClasses, components }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.newLeaf({
      name: 'AtLeastZeroChildren',
      componentType: '_base',
      excludeComponentTypes: ['_composite'],
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.numberOfChildren = {
      additionalStateVariablesDefined: ["childComponentNames"],
      returnDependencies: () => ({
        children: {
          dependencyType: "childIdentity",
          childLogicName: "AtLeastZeroChildren",
        },
      }),
      definition: function ({ dependencyValues }) {
        let numberOfChildren = dependencyValues.children.length;
        let childComponentNames = dependencyValues.children.map(x => x.componentName);
        return { newValues: { numberOfChildren, childComponentNames } };
      },
    }

    return stateVariableDefinitions;

  }

  initializeRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new this.availableRenderers.container({ key: this.componentName });
    }
  }

  updateChildrenWhoRender() {
    let indices = this.childLogic.returnMatches("AtLeastZeroChildren");
    if (indices === undefined) {
      this.childrenWhoRender = [];
    } else {
      this.childrenWhoRender = indices.map(i => this.activeChildren[i].componentName);
    }
  }

}
