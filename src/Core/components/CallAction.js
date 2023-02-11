import { deepClone } from '../utils/deepFunctions';
import { returnLabelStateVariableDefinitions } from '../utils/label';
import InlineComponent from './abstract/InlineComponent';

export default class CallAction extends InlineComponent {
  static componentType = "callAction";

  static acceptTarget = true;

  static keepChildrenSerialized({ serializedComponent, componentInfoObjects }) {
    if (serializedComponent.children === undefined) {
      return [];
    } else {

      let keepSerializedInds = [];
      for (let [ind, child] of serializedComponent.children.entries()) {
        if (!componentInfoObjects.componentIsSpecifiedType(child, "label")) {
          keepSerializedInds.push(ind)
        }
      }

      return keepSerializedInds;
    }
  }


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

    attributes.triggerWith = {
      createTargetComponentNames: true,
    }

    attributes.triggerWhenObjectsClicked = {
      createTargetComponentNames: true,
    }

    attributes.numbers = {
      createComponentOfType: "numberList",
    };

    attributes.number = {
      createComponentOfType: "number",
    };


    return attributes;
  }


  static returnChildGroups() {

    return [{
      group: "labels",
      componentTypes: ["label"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let labelDefinitions = returnLabelStateVariableDefinitions();

    Object.assign(stateVariableDefinitions, labelDefinitions);

    stateVariableDefinitions.target = {
      returnDependencies: () => ({
        target: {
          dependencyType: "doenetAttribute",
          attributeName: "target"
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { target: dependencyValues.target }
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
          setValue: { targetComponent }
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
        return { setValue: { targetName } };
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

          if (triggerWith.length === 0) {
            triggerWith = null;
          }

          return { setValue: { triggerWith } }
        }
      }
    }

    stateVariableDefinitions.triggerWithTargetIds = {
      chainActionOnActionOfStateVariableTargets: {
        triggeredAction: "callAction"
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

    return stateVariableDefinitions;

  }


  async callAction({ actionId }) {

    let targetName = await this.stateValues.targetName;
    let actionName = await this.stateValues.actionName;
    if (targetName !== null && actionName !== null) {

      let args = {};
      if (this.serializedChildren.length > 0) {
        args.serializedComponents = deepClone(this.serializedChildren);
      }
      if (this.attributes.number) {
        args.number = await this.attributes.number.component.stateValues.value;
      }
      if (this.attributes.numbers) {
        args.numbers = await this.attributes.numbers.component.stateValues.numbers;
      }

      if (actionId) {
        args.actionId = actionId;
      }

      await this.coreFunctions.performAction({
        componentName: targetName,
        actionName,
        args,
        event: {
          verb: "selected",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
        },
        caseInsensitiveMatch: true,
      })

      await this.coreFunctions.triggerChainedActions({
        componentName: this.componentName,
      });


    } else {
      this.coreFunctions.resolveAction({ actionId });
    }

  }

  async callActionIfTriggerNewlyTrue({ stateValues, previousValues, actionId }) {
    // Note: explicitly test if previous value is false
    // so don't trigger on initialization when it is undefined
    if (stateValues.triggerWhen && previousValues.triggerWhen === false &&
      !await this.stateValues.insideTriggerSet
    ) {
      return await this.callAction({ actionId });
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  actions = {
    callAction: this.callAction.bind(this),
    callActionIfTriggerNewlyTrue: this.callActionIfTriggerNewlyTrue.bind(this),
  };
}
