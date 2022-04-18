import Template from './Template';

export default class Case extends Template {
  static componentType = "case";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.condition = {
      createComponentOfType: "boolean",
    };

    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.conditionSatisfied = {
      public: true,
      componentType: "boolean",
      returnDependencies: () => ({
        condition: {
          dependencyType: "attributeComponent",
          attributeName: "condition",
          variableNames: ["value"],
        },
      }),
      definition: function ({ dependencyValues }) {

        let conditionSatisfied;
        if (dependencyValues.condition === null) {
          conditionSatisfied = true;
        } else {
          conditionSatisfied = dependencyValues.condition.stateValues.value;
        }

        return { setValue: { conditionSatisfied } }
      }
    };

    return stateVariableDefinitions;
  }

  static createSerializedReplacements({ component, componentInfoObjects }) {

    if (!component.stateValues.conditionSatisfied) {
      return { replacements: [] }
    }

    return super.createSerializedReplacements({ component, componentInfoObjects });

  }

}
