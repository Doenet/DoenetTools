import { deepClone } from '../utils/deepFunctions';
import InlineComponent from './abstract/InlineComponent';

export default class CallAction extends InlineComponent {
  static componentType = "callAction";

  static acceptTname = true;

  static keepChildrenSerialized({ serializedComponent }) {
    if (serializedComponent.children === undefined) {
      return [];
    } else {
      return Object.keys(serializedComponent.children)
    }
  }


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    // attributes.width = {default: 300};
    // attributes.height = {default: 50};
    attributes.label = {
      createComponentOfType: "text",
      createStateVariable: "label",
      defaultValue: "call action",
      public: true,
      forRenderer: true,
    };

    attributes.actionName = {
      createComponentOfType: "text",
      createStateVariable: "actionName",
      defaultValue: null,
      public: true,
    };

    attributes.triggerWhen = {
      createComponentOfType: "boolean",
      createStateVariable: "triggerWhen",
      defaultValue: false,
      triggerActionOnChange: "callActionIfTriggerNewlyTrue"
    }

    attributes.triggerWithTname = {
      createPrimitiveOfType: "string"
    }

    attributes.numbers = {
      createComponentOfType: "numberList",
    };

    attributes.number = {
      createComponentOfType: "number",
    };


    return attributes;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.tName = {
      returnDependencies: () => ({
        tName: {
          dependencyType: "doenetAttribute",
          attributeName: "tName"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { tName: dependencyValues.tName }
      })
    }

    stateVariableDefinitions.targetComponent = {
      returnDependencies() {
        return {
          targetComponent: {
            dependencyType: "targetComponent",
          }
        }
      },
      definition: function ({ dependencyValues }) {

        let targetComponent = null;
        if (dependencyValues.targetComponent) {
          targetComponent = dependencyValues.targetComponent
        }

        return {
          newValues: { targetComponent }
        }
      },
    };



    stateVariableDefinitions.targetName = {
      returnDependencies: () => ({
        targetComponent: {
          dependencyType: "stateVariable",
          variableName: "targetComponent"
        }
      }),
      definition({ dependencyValues }) {

        let targetName = null;
        if (dependencyValues.targetComponent) {
          targetName = dependencyValues.targetComponent.componentName
        }
        return { newValues: { targetName } };
      },
    }


    stateVariableDefinitions.insideTriggerSet = {
      returnDependencies: () => ({
        parentTriggerSet: {
          dependencyType: "parentStateVariable",
          parentComponentType: "triggerSet",
          variableName: "updateValueAndActionsToTrigger"
        },
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            insideTriggerSet: dependencyValues.parentTriggerSet !== null
          }
        }
      }
    }

    stateVariableDefinitions.triggerWithTname = {
      returnDependencies: () => ({
        triggerWithTname: {
          dependencyType: "attributePrimitive",
          attributeName: "triggerWithTname"
        },
        triggerWhen: {
          dependencyType: "attributeComponent",
          attributeName: "triggerWhen"
        },
        insideTriggerSet: {
          dependencyType: "stateVariable",
          variableName: "insideTriggerSet"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.triggerWhen || dependencyValues.insideTriggerSet) {
          return { newValues: { triggerWithTname: null } }
        } else {
          return { newValues: { triggerWithTname: dependencyValues.triggerWithTname } }
        }
      }
    }

    stateVariableDefinitions.triggerWithFullTname = {
      chainActionOnActionOfStateVariableTarget: {
        triggeredAction: "callAction"
      },
      stateVariablesDeterminingDependencies: ["triggerWithTname"],
      returnDependencies({ stateValues }) {
        if (stateValues.triggerWithTname) {
          return {
            triggerWithFullTname: {
              dependencyType: "expandTargetName",
              tName: stateValues.triggerWithTname
            }
          }
        } else {
          return {}
        }
      },
      definition({ dependencyValues }) {
        return { newValues: { triggerWithFullTname: dependencyValues.triggerWithFullTname } }
      }
    }


    let originalHiddenReturnDependencies = stateVariableDefinitions.hidden.returnDependencies;
    let originalHiddenDefinition = stateVariableDefinitions.hidden.definition;

    stateVariableDefinitions.hidden.returnDependencies = function (args) {
      let dependencies = originalHiddenReturnDependencies(args);
      dependencies.triggerWhen = {
        dependencyType: "attributeComponent",
        attributeName: "triggerWhen"
      };
      dependencies.triggerWithTname = {
        dependencyType: "stateVariable",
        variableName: "triggerWithTname"
      }
      dependencies.insideTriggerSet = {
        dependencyType: "stateVariable",
        variableName: "insideTriggerSet"
      }
      return dependencies;
    }

    stateVariableDefinitions.hidden.definition = function (args) {
      if (args.dependencyValues.triggerWhen ||
        args.dependencyValues.triggerWithTname ||
        args.dependencyValues.insideTriggerSet
      ) {
        return { newValues: { hidden: true } }
      } else {
        return originalHiddenDefinition(args);
      }
    }

    return stateVariableDefinitions;

  }


  callAction() {

    if (this.stateValues.targetName !== null && this.stateValues.actionName !== null) {

      let args = {};
      if (this.serializedChildren.length > 0) {
        args.serializedComponents = deepClone(this.serializedChildren);
      }
      if (this.attributes.number) {
        args.number = this.attributes.number.component.stateValues.value;
      }
      if (this.attributes.numbers) {
        args.numbers = this.attributes.numbers.component.stateValues.numbers;
      }

      this.coreFunctions.requestAction({
        componentName: this.stateValues.targetName,
        actionName: this.stateValues.actionName,
        args,
      })

      this.coreFunctions.triggerChainedActions({
        componentName: this.componentName,
      })

    }

  }

  callActionIfTriggerNewlyTrue({ stateValues, previousValues }) {
    // Note: explicitly test if previous value is false
    // so don't trigger on initialization when it is undefined
    if (stateValues.triggerWhen && previousValues.triggerWhen === false &&
      !this.stateValues.insideTriggerSet
    ) {
      this.callAction();
    }
  }

  actions = {
    callAction: this.callAction.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
    callActionIfTriggerNewlyTrue: this.callActionIfTriggerNewlyTrue.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
  };
}
