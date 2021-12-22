import InlineComponent from './abstract/InlineComponent';

export default class triggerSet extends InlineComponent {
  static componentType = "triggerSet";

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

    attributes.triggerWithTnames = {
      createPrimitiveOfType: "string"
    }

    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "updateValuesCallActions",
      componentTypes: ["updateValue", "callAction"]
    }]

  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.updateValueAndActionsToTrigger = {
      returnDependencies: () => ({
        updateValueAndCallActionChildren: {
          dependencyType: "child",
          childGroups: ["updateValuesCallActions"],
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

    stateVariableDefinitions.triggerWithTnames = {
      returnDependencies: () => ({
        triggerWithTnames: {
          dependencyType: "attributePrimitive",
          attributeName: "triggerWithTnames"
        },
        triggerWhen: {
          dependencyType: "attributeComponent",
          attributeName: "triggerWhen"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.triggerWhen || dependencyValues.triggerWithTnames === null) {
          return { newValues: { triggerWithTnames: null } }
        } else {
          return {
            newValues: {
              triggerWithTnames: dependencyValues.triggerWithTnames
                .split(/\s+/).filter(s => s)
            }
          }
        }
      }
    }

    stateVariableDefinitions.triggerWithFullTnames = {
      chainActionOnActionOfStateVariableTargets: {
        triggeredAction: "triggerActions"
      },
      stateVariablesDeterminingDependencies: ["triggerWithTnames"],
      returnDependencies({ stateValues }) {
        let dependencies = {};
        if (stateValues.triggerWithTnames) {
          for (let [ind, tName] of stateValues.triggerWithTnames.entries()) {

            dependencies[`triggerWithFullTname${ind}`] = {
              dependencyType: "expandTargetName",
              tName
            }
          }
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        let triggerWithFullTnames = [];
        let n = Object.keys(dependencyValues).length - 1;

        for (let i = 0; i < n; i++) {
          triggerWithFullTnames.push(dependencyValues[`triggerWithFullTname${i}`])
        }

        return { newValues: { triggerWithFullTnames } }
      },
      markStale() {
        return { updateActionChaining: true }
      },
    }


    let originalHiddenReturnDependencies = stateVariableDefinitions.hidden.returnDependencies;
    let originalHiddenDefinition = stateVariableDefinitions.hidden.definition;

    stateVariableDefinitions.hidden.returnDependencies = function (args) {
      let dependencies = originalHiddenReturnDependencies(args);
      dependencies.triggerWhen = {
        dependencyType: "attributeComponent",
        attributeName: "triggerWhen"
      },
        dependencies.triggerWithTnames = {
          dependencyType: "stateVariable",
          variableName: "triggerWithTnames"
        }
      return dependencies;
    }

    stateVariableDefinitions.hidden.definition = function (args) {
      if (args.dependencyValues.triggerWhen || args.dependencyValues.triggerWithTnames) {
        return { newValues: { hidden: true } }
      } else {
        return originalHiddenDefinition(args);
      }
    }

    return stateVariableDefinitions;

  }


  async triggerActions() {

    for (let child of await this.stateValues.updateValueAndActionsToTrigger) {

      if (this.componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: child.componentType,
        baseComponentType: "updateValue"
      })) {
        await this.coreFunctions.performAction({
          componentName: child.componentName,
          actionName: "updateValue",
        })
      } else if (this.componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: child.componentType,
        baseComponentType: "callAction"
      })) {
        await this.coreFunctions.performAction({
          componentName: child.componentName,
          actionName: "callAction",
        })
      }
    }

    return await this.coreFunctions.triggerChainedActions({
      componentName: this.componentName,
    })

  }

  async triggerActionsIfTriggerNewlyTrue({ stateValues, previousValues }) {
    // Note: explicitly test if previous value is false
    // so don't trigger on initialization when it is undefined
    if (stateValues.triggerWhen && previousValues.triggerWhen === false) {
      return await this.triggerActions();
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