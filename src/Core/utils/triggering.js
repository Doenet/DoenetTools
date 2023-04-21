export function returnStandardTriggeringAttributes(triggerActionOnChange) {

  return {
    triggerWhen: {
      createComponentOfType: "boolean",
      createStateVariable: "triggerWhen",
      defaultValue: false,
      triggerActionOnChange
    },
    triggerWith: {
      createTargetComponentNames: true,
    },
    triggerWhenObjectsClicked: {
      createTargetComponentNames: true,
    },
    triggerWhenObjectsFocused: {
      createTargetComponentNames: true
    }
  }

}



export function addStandardTriggeringStateVariableDefinitions(stateVariableDefinitions, triggeredAction) {


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
        setValue: {
          insideTriggerSet: dependencyValues.parentTriggerSet !== null
        }
      }
    }
  }

  stateVariableDefinitions.triggerWith = {
    returnDependencies: () => ({
      triggerWith: {
        dependencyType: "attributeTargetComponentNames",
        attributeName: "triggerWith"
      },
      triggerWhenObjectsClicked: {
        dependencyType: "attributeTargetComponentNames",
        attributeName: "triggerWhenObjectsClicked"
      },
      triggerWhenObjectsFocused: {
        dependencyType: "attributeTargetComponentNames",
        attributeName: "triggerWhenObjectsFocused"
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
        return { setValue: { triggerWith: null } }
      } else {

        let triggerWith = [];
        if (dependencyValues.triggerWith !== null) {
          for (let nameObj of dependencyValues.triggerWith) {
            triggerWith.push({ target: nameObj.absoluteName });
          }
        }
        if (dependencyValues.triggerWhenObjectsClicked !== null) {
          for (let nameObj of dependencyValues.triggerWhenObjectsClicked) {
            triggerWith.push({ target: nameObj.absoluteName, triggeringAction: "click" })
          }
        }
        if (dependencyValues.triggerWhenObjectsFocused !== null) {
          for (let nameObj of dependencyValues.triggerWhenObjectsFocused) {
            triggerWith.push({ target: nameObj.absoluteName, triggeringAction: "focus" })
          }
        }

        if (triggerWith.length === 0) {
          triggerWith = null;
        }

        return { setValue: { triggerWith } }
      }
    }
  }

  stateVariableDefinitions.triggerWithTargetIds = {
    chainActionOnActionOfStateVariableTargets: {
      triggeredAction
    },
    returnDependencies: () => ({
      triggerWith: {
        dependencyType: "stateVariable",
        variableName: "triggerWith"
      }
    }),
    definition({ dependencyValues }) {
      let triggerWithTargetIds = [];

      if (dependencyValues.triggerWith) {
        for (let targetObj of dependencyValues.triggerWith) {

          let id = targetObj.target;

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
    dependencies.triggerWith = {
      dependencyType: "stateVariable",
      variableName: "triggerWith"
    }
    dependencies.insideTriggerSet = {
      dependencyType: "stateVariable",
      variableName: "insideTriggerSet"
    }
    return dependencies;
  }

  stateVariableDefinitions.hidden.definition = function (args) {
    if (args.dependencyValues.triggerWhen ||
      args.dependencyValues.triggerWith ||
      args.dependencyValues.insideTriggerSet
    ) {
      return { setValue: { hidden: true } }
    } else {
      return originalHiddenDefinition(args);
    }
  }


}