import CompositeComponent from './abstract/CompositeComponent';

export default class ModuleSetup extends CompositeComponent {
  static componentType = "moduleSetup";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "anyChildren",
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.componentNameForAttributes = {
      returnDependencies: () => ({
        sourceCompositeIdentity: {
          dependencyType: "sourceCompositeIdentity",
        }
      }),
      definition({ dependencyValues }) {
        let componentNameForAttributes = null;
        if(dependencyValues.sourceCompositeIdentity) {
          componentNameForAttributes = dependencyValues.sourceCompositeIdentity.componentName;
        }
        return { newValues: { componentNameForAttributes } }
      }
    }

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({}),
      definition() {
        return {
          newValues: { readyToExpandWhenResolved: true }
        }
      }
    }

    return stateVariableDefinitions;

  }

}
