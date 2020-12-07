import BaseComponent from './abstract/BaseComponent';
import { deepClone } from '../utils/deepFunctions';

export default class Case extends BaseComponent {
  static componentType = "case";
  static rendererType = undefined;

  static assignNamesToAllChildrenExcept = ["condition"];


  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["conditionSatisfied"] };

  static keepChildrenSerialized({ serializedComponent, componentInfoObjects }) {
    if (serializedComponent.children === undefined) {
      return [];
    }

    let nonConditionChildInds = [];

    // only condition children will be created
    // any other component will stay serialized
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (!componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: child.componentType,
        baseComponentType: "condition"
      })) {
        nonConditionChildInds.push(ind);
      }
    }

    return nonConditionChildInds;

  }

  static createPropertiesObject(args) {
    return {};
  }

  // only child logic is condition
  // as all other children will remain serialized

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atMostOneCondition",
      componentType: 'condition',
      comparison: 'atMost',
      number: 1,
      allowSpillover: false,
      setAsBase: true
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.childrenWhenSelected = {
      returnDependencies: () => ({
        serializedChildren: {
          dependencyType: "serializedChildren",
          doNotProxy: true
        },
      }),
      definition: function ({ dependencyValues }) {

        return {
          newValues: {
            childrenWhenSelected: deepClone(dependencyValues.serializedChildren),
          }
        }
      }
    }

    stateVariableDefinitions.conditionSatisfied = {
      returnDependencies: () => ({
        conditionChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneCondition",
          variableNames: ["conditionSatisfied"],
        },
      }),
      definition: function ({ dependencyValues }) {

        let conditionSatisfied;
        if (dependencyValues.conditionChild.length === 0) {
          conditionSatisfied = false;
        } else {
          conditionSatisfied = dependencyValues.conditionChild[0].stateValues.conditionSatisfied;
        }

        return { newValues: { conditionSatisfied } }
      }
    };

    return stateVariableDefinitions;
  }

}
