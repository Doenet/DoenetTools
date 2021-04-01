import Option from './Option';
import { deepClone } from '../utils/deepFunctions';

export default class Case extends Option {
  static componentType = "case";


  static keepChildrenSerialized({ serializedComponent, componentInfoObjects }) {
    if (serializedComponent.children === undefined) {
      return [];
    }

    let propertyClasses = [];
    for (let componentType of ["condition", ...Object.keys(this.createPropertiesObject({}))]) {
      let ct = componentType.toLowerCase();
      propertyClasses.push({
        componentType: ct,
        class: componentInfoObjects.allComponentClasses[ct]
      });
    }

    let nonPropertyChildInds = [];

    // first occurence of a property component class
    // will be created
    // any other component will stay serialized
    for (let [ind, child] of serializedComponent.children.entries()) {
      let propFound = false;
      for (let propObj of propertyClasses) {
        if (componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: child.componentType,
          baseComponentType: propObj.componentType
        }) && !propObj.propFound) {
          propFound = propObj.propFound = true;
          break;
        }
      }
      if (!propFound) {
        nonPropertyChildInds.push(ind);
      }
    }

    return nonPropertyChildInds;

  }

  static get stateVariablesShadowedForReference() {
    return ["conditionSatisfied"]
  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atMostOneCondition",
      componentType: 'condition',
      comparison: "atMost",
      number: 1,
      takePropertyChildren: true,
      setAsBase: true
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.conditionSatisfied = {
      public: true,
      componentType: "boolean",
      returnDependencies: () => ({
        conditionChild: {
          dependencyType: "child",
          childLogicName: "atMostOneCondition",
          variableNames: ["value"],
        },
      }),
      definition: function ({ dependencyValues }) {

        let conditionSatisfied;
        if (dependencyValues.conditionChild.length === 0) {
          conditionSatisfied = true;
        } else {
          conditionSatisfied = dependencyValues.conditionChild[0].stateValues.value;
        }

        return { newValues: { conditionSatisfied } }
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
