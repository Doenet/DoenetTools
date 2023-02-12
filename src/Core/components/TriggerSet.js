import { returnLabelStateVariableDefinitions } from '../utils/label';
import InlineComponent from './abstract/InlineComponent';

export default class triggerSet extends InlineComponent {
  static componentType = "triggerSet";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    // attributes.width = {default: 300};
    // attributes.height = {default: 50};

    attributes.labelIsName = {
      createComponentOfType: "boolean",
      createStateVariable: "labelIsName",
      defaultValue: false,
      public: true,
    };

    attributes.triggerWhen = {
      createComponentOfType: "boolean",
      createStateVariable: "triggerWhen",
      defaultValue: false,
      triggerActionOnChange: "triggerActionsIfTriggerNewlyTrue"
    }

    attributes.triggerWith = {
      createTargetComponentNames: true,
    }

    attributes.triggerWhenObjectsClicked = {
      createTargetComponentNames: true,
    }

    attributes.triggerWhenMouseDownOnObjects = {
      createTargetComponentNames: "string"
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

    let labelDefinitions = returnLabelStateVariableDefinitions();

    Object.assign(stateVariableDefinitions, labelDefinitions);

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
        triggerWhenMouseDownOnObjects: {
          dependencyType: "attributeTargetComponentNames",
          attributeName: "triggerWhenMouseDownOnObjects"
        },
        triggerWhen: {
          dependencyType: "attributeComponent",
          attributeName: "triggerWhen"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.triggerWhen) {
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
          if (dependencyValues.triggerWhenMouseDownOnObjects !== null) {
            for (let nameObj of dependencyValues.triggerWhenMouseDownOnObjects) {
              triggerWith.push({ target: nameObj.absoluteName, triggeringAction: "down" })
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
        triggeredAction: "triggerActions"
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
        dependencies.triggerWith = {
          dependencyType: "stateVariable",
          variableName: "triggerWith"
        }
      return dependencies;
    }

    stateVariableDefinitions.hidden.definition = function (args) {
      if (args.dependencyValues.triggerWhen || args.dependencyValues.triggerWith) {
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