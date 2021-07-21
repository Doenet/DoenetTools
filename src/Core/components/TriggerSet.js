import InlineComponent from './abstract/InlineComponent';

export default class triggerSet extends InlineComponent {
  static componentType = "triggerSet";

  static triggeringAction = "triggerActions"

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    // attributes.width = {default: 300};
    // attributes.height = {default: 50};
    attributes.label = {
      createComponentOfType: "text",
      createStateVariable: "label",
      defaultValue: "update value",
      public: true,
      forRenderer: true,
    };

    attributes.triggerWhen = {
      createComponentOfType: "boolean",
      createStateVariable: "triggerWhen",
      defaultValue: false,
      triggerActionOnChange: "triggerActionsIfTriggerNewlyTrue"
    }

    attributes.triggerWithTname = {
      createPrimitiveOfType: "string"
    }

    return attributes;
  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroUpdateValues = childLogic.newLeaf({
      name: "atLeastZeroUpdateValues",
      componentType: 'updateValue',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroCallActions = childLogic.newLeaf({
      name: "atLeastZeroCallActions",
      componentType: 'callAction',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "updateValuesAndCallActions",
      operator: "and",
      propositions: [atLeastZeroUpdateValues, atLeastZeroCallActions],
      setAsBase: true,
    })

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.updateValueAndActionsToTrigger = {
      returnDependencies: () => ({
        updateValueAndCallActionChildren: {
          dependencyType: "child",
          childLogicName: "updateValuesAndCallActions",
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            updateValueAndActionsToTrigger: dependencyValues.updateValueAndCallActionChildren
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
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.triggerWhen) {
          return { newValues: { triggerWithTname: null } }
        } else {
          return { newValues: { triggerWithTname: dependencyValues.triggerWithTname } }
        }
      }
    }

    stateVariableDefinitions.triggerWithFullTname = {
      chainActionOnActionOfStateVariableTarget: {
        triggeredAction: "triggerActions"
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
      },
        dependencies.triggerWithTname = {
          dependencyType: "stateVariable",
          variableName: "triggerWithTname"
        }
      return dependencies;
    }

    stateVariableDefinitions.hidden.definition = function (args) {
      if (args.dependencyValues.triggerWhen || args.dependencyValues.triggerWithTname) {
        return { newValues: { hidden: true } }
      } else {
        return originalHiddenDefinition(args);
      }
    }

    return stateVariableDefinitions;

  }


  triggerActions() {

    for (let child of this.stateValues.updateValueAndActionsToTrigger) {

      if (this.componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: child.componentType,
        baseComponentType: "updateValue"
      })) {
        this.coreFunctions.requestAction({
          componentName: child.componentName,
          actionName: "updateValue",
        })
      } else if (this.componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: child.componentType,
        baseComponentType: "callAction"
      })) {
        this.coreFunctions.requestAction({
          componentName: child.componentName,
          actionName: "callAction",
        })
      }
    }

    this.coreFunctions.triggerChainedActions({
      componentName: this.componentName,
    })

  }

  triggerActionsIfTriggerNewlyTrue({ stateValues, previousValues }) {
    // Note: explicitly test if previous value is false
    // so don't trigger on initialization when it is undefined
    if (stateValues.triggerWhen && previousValues.triggerWhen === false) {
      this.triggerActions();
    }
  }

  actions = {
    triggerActions: this.triggerActions.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
    triggerActionsIfTriggerNewlyTrue: this.triggerActionsIfTriggerNewlyTrue.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
  };
}