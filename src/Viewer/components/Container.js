import BlockComponent from './abstract/BlockComponent';

export default class Container extends BlockComponent {
  static componentType = "container";

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



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        activeChildren: {
          dependencyType: "child",
          childLogicName: "anything"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues:
            { childrenToRender: dependencyValues.activeChildren.map(x => x.componentName) }
        };
      }
    }

    return stateVariableDefinitions;
  }

  initializeRenderer(){
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.container({
        key: this.componentName,
      });
    }
  }

}
