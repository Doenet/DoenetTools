import BlockComponent from './abstract/BlockComponent';

export default class Div extends BlockComponent {
  static componentType = "div";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.width = { default: 300 };
    return properties;
  }

  static returnChildLogic(args) {
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



  initializeRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new this.availableRenderers.div({
        key: this.componentName,
        width: this.stateValues.width,
      });
    } else {
      this.updateRenderer();
    }
  }

  updateRenderer() {

    this.renderer.updateDiv({
      width: this.stateValues.width,
    });
  }


}