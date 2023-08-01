import BaseComponent from "./BaseComponent";

export default class ConstraintComponent extends BaseComponent {
  static componentType = "_constraint";
  static rendererType = undefined;

  static inSchemaOnlyInheritAs = ["_constraint"];

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.independentComponentConstraints = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: { independentComponentConstraints: false },
      }),
    };

    return stateVariableDefinitions;
  }
}
