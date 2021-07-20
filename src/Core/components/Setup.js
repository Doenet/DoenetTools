import CompositeComponent from './abstract/CompositeComponent';

export default class Setup extends CompositeComponent {
  static componentType = "setup";

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
