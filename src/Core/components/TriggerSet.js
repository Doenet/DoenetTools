import InlineComponent from './abstract/InlineComponent';

export default class triggerSet extends InlineComponent {
  static componentType = "triggerSet";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    // attributes.width = {default: 300};
    // attributes.height = {default: 50};
    attributes.label = {
      createComponentOfType: "label",
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

    attributes.triggerWhenTargetsClicked = {
      createPrimitiveOfType: "string"
    }

    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "updateValuesCallActions",
      componentTypes: ["updateValue", "callAction"]
    }, {
      group: "labels",
      componentTypes: ["label"]
    }]

  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.label = {
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "label",
      },
      hasEssential: true,
      defaultValue: "update value",
      additionalStateVariablesDefined: [{
        variableName: "labelHasLatex",
        forRenderer: true,
      }],
      returnDependencies: () => ({
        labelAttr: {
          dependencyType: "attributeComponent",
          attributeName: "label",
          variableNames: ["value", "hasLatex"]
        },
        labelChild: {
          dependencyType: "child",
          childGroups: ["labels"],
          variableNames: ["value", "hasLatex"]
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.labelChild.length > 0) {
          return {
            setValue: {
              label: dependencyValues.labelChild[0].stateValues.value,
              labelHasLatex: dependencyValues.labelChild[0].stateValues.hasLatex
            }
          }
        } else if (dependencyValues.labelAttr) {
          return {
            setValue: {
              label: dependencyValues.labelAttr.stateValues.value,
              labelHasLatex: dependencyValues.labelAttr.stateValues.hasLatex
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { label: true },
            setValue: { labelHasLatex: false }
          }
        }
      }
    }

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
        triggerWhenTargetsClicked: {
          dependencyType: "attributePrimitive",
          attributeName: "triggerWhenTargetsClicked"
        },
        triggerWhen: {
          dependencyType: "attributeComponent",
          attributeName: "triggerWhen"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.triggerWhen) {
          return { setValue: { triggerWithTargets: null } }
        } else {
          let triggerWithTargets = [];
          if (dependencyValues.triggerWithTargets !== null) {
            for (let target of dependencyValues.triggerWithTargets.split(/\s+/).filter(s => s)) {
              triggerWithTargets.push({ target })
            }
          }
          if (dependencyValues.triggerWhenTargetsClicked !== null) {
            for (let target of dependencyValues.triggerWhenTargetsClicked.split(/\s+/).filter(s => s)) {
              triggerWithTargets.push({ target, triggeringAction: "click" })
            }
          }

          if (triggerWithTargets.length === 0) {
            triggerWithTargets = null;
          }

          return { setValue: { triggerWithTargets } }
        }
      }
    }

    stateVariableDefinitions.triggerWithTargetIds = {
      chainActionOnActionOfStateVariableTargets: {
        triggeredAction: "triggerActions"
      },
      stateVariablesDeterminingDependencies: ["triggerWithTargets"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          triggerWithTargets: {
            dependencyType: "stateVariable",
            variableName: "triggerWithTargets"
          }
        };
        if (stateValues.triggerWithTargets) {
          for (let [ind, targetObj] of stateValues.triggerWithTargets.entries()) {

            dependencies[`triggerWithTargetComponentName${ind}`] = {
              dependencyType: "expandTargetName",
              target: targetObj.target
            }
          }
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        let triggerWithTargetIds = [];

        if (dependencyValues.triggerWithTargets) {
          for (let [ind, targetObj] of dependencyValues.triggerWithTargets.entries()) {

            let id = dependencyValues[`triggerWithTargetComponentName${ind}`];

            if (targetObj.triggeringAction) {
              id += "|" + targetObj.triggeringAction;
            };

            if (!triggerWithTargetIds.includes(id)) {
              triggerWithTargetIds.push(id);
            }

          }
        }

        return { setValue: { triggerWithTargetIds } }
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


  async triggerActions({ actionId }) {

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

    this.coreFunctions.resolveAction({ actionId });

    return await this.coreFunctions.triggerChainedActions({
      componentName: this.componentName,
    })

  }

  async triggerActionsIfTriggerNewlyTrue({ stateValues, previousValues, actionId }) {
    // Note: explicitly test if previous value is false
    // so don't trigger on initialization when it is undefined
    if (stateValues.triggerWhen && previousValues.triggerWhen === false) {
      return await this.triggerActions({ actionId });
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  actions = {
    triggerActions: this.triggerActions.bind(this),
    triggerActionsIfTriggerNewlyTrue: this.triggerActionsIfTriggerNewlyTrue.bind(this)
  };
}