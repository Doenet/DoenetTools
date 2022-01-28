import BaseComponent from './BaseComponent.js';

export default class ConstraintComponent extends BaseComponent {
  static componentType = "_constraint";
  static rendererType = undefined;

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.independentComponentConstraints = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { independentComponentConstraints: false } })
    }

    return stateVariableDefinitions;
  }

}