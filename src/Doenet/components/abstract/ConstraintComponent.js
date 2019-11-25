import BaseComponent from './BaseComponent';

export default class ConstraintComponent extends BaseComponent {
  static componentType = "_constraint";

  // remove default properties from base component
  static createPropertiesObject() {
    return {};
  }

  applyTheConstraint() {
    return {};
  }

}