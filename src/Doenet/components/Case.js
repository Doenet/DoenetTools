import BaseComponent from './abstract/BaseComponent';
import { deepClone } from '../utils/deepFunctions';

export default class Case extends BaseComponent {
  static componentType = "case";
  static rendererType = undefined;

  // static assignNewNamespaceToAllChildrenExcept = ["condition"];
  // static preserveOriginalNamesWhenAssignChildrenNewNamespace = true;

  // static passThroughParentArrayAssignNames = true;

  // // used when referencing this component without prop
  // static useChildrenForReference = false;
  // static get stateVariablesShadowedForReference() { return ["conditionSatisfied"] };


  static createPropertiesObject(args) {
    return {};
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneCondition = childLogic.newLeaf({
      name: "exactlyOneCondition",
      componentType: 'condition',
      number: 1,
    });

    let exactlyOneResult = childLogic.newLeaf({
      name: "exactlyOneResult",
      componentType: 'result',
      number: 1,
    });

    childLogic.newOperator({
      name: "conditionAndResult",
      operator: "and",
      propositions: [exactlyOneCondition, exactlyOneResult],
      setAsBase: true
    })

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.serializedChildren = {
      additionalStateVariablesDefined: ["resultChild"],
      returnDependencies: () => ({
        resultChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneResult",
          variableNames: ["serializedChildren"],
          doNotProxy: true
        },
      }),
      definition: function ({ dependencyValues }) {

        let serializedChildren, resultChild;
        if (dependencyValues.resultChild.length === 0) {
          serializedChildren = null;
          resultChild = null;
        } else {
          serializedChildren = dependencyValues.resultChild[0].stateValues.serializedChildren;
          resultChild = Object.assign({}, dependencyValues.resultChild[0]);
          delete resultChild.stateValues;
          
        }
        return { newValues: { serializedChildren, resultChild } }
      }
    }

    stateVariableDefinitions.conditionSatisfied = {
      public: true,
      componentType: "boolean",
      returnDependencies: () => ({
        conditionChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneCondition",
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
