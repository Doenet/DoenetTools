import InlineComponent from './abstract/InlineComponent.js';

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

    attributes.triggerWithTargets = {
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
          setValue: {
            updateValueAndActionsToTrigger: dependencyValues.updateValueAndCallActionChildren
          }
        }
      }
    }

    stateVariableDefinitions.triggerWithTargets = {
      returnDependencies: () => ({
        triggerWithTargets: {
          dependencyType: "attributePrimitive",
          attributeName: "triggerWithTargets"
        },
        triggerWhen: {
          dependencyType: "attributeComponent",
          attributeName: "triggerWhen"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.triggerWhen || dependencyValues.triggerWithTargets === null) {
          return { setValue: { triggerWithTargets: null } }
        } else {
          return {
            setValue: {
              triggerWithTargets: dependencyValues.triggerWithTargets
                .split(/\s+/).filter(s => s)
            }
          }
        }
      }
    }

    stateVariableDefinitions.triggerWithTargetComponentNames = {
      chainActionOnActionOfStateVariableTargets: {
        triggeredAction: "triggerActions"
      },
      stateVariablesDeterminingDependencies: ["triggerWithTargets"],
      returnDependencies({ stateValues }) {
        let dependencies = {};
        if (stateValues.triggerWithTargets) {
          for (let [ind, target] of stateValues.triggerWithTargets.entries()) {

            dependencies[`triggerWithTargetComponentName${ind}`] = {
              dependencyType: "expandTargetName",
              target
            }
          }
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        let triggerWithTargetComponentNames = [];
        let n = Object.keys(dependencyValues).length - 1;

        for (let i = 0; i < n; i++) {
          triggerWithTargetComponentNames.push(dependencyValues[`triggerWithTargetComponentName${i}`])
        }

        return { setValue: { triggerWithTargetComponentNames } }
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
        dependencies.triggerWithTargets = {
          dependencyType: "stateVariable",
          variableName: "triggerWithTargets"
        }
      return dependencies;
    }

    stateVariableDefinitions.hidden.definition = function (args) {
      if (args.dependencyValues.triggerWhen || args.dependencyValues.triggerWithTargets) {
        return { setValue: { hidden: true } }
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