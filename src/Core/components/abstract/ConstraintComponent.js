import BaseComponent from './BaseComponent';

export default class ConstraintComponent extends BaseComponent {
  static componentType = "_constraint";
  static rendererType = undefined;

  // remove default properties from base component
  static createPropertiesObject() {
    return {};
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.independentComponentConstraints = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { independentComponentConstraints: false } })
    }

    return stateVariableDefinitions;
  }

}