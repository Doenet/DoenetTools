import { deepClone } from '../utils/deepFunctions';
import InlineComponent from './abstract/InlineComponent';

export default class CallAction extends InlineComponent {
  static componentType = "callAction";

  static acceptTarget = true;

  static keepChildrenSerialized({ serializedComponent, componentInfoObjects }) {
    if (serializedComponent.children === undefined) {
      return [];
    } else {

      let componentTypeIsSpecifiedType = (cType, specifiedCType) => componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: cType,
        baseComponentType: specifiedCType
      });

      let componentIsSpecifiedType = (comp, specifiedCType) =>
        componentTypeIsSpecifiedType(comp.componentType, specifiedCType)
        || componentTypeIsSpecifiedType(comp.props?.componentType, specifiedCType)

      let keepSerializedInds = [];
      for (let [ind, child] of serializedComponent.children.entries()) {
        if (!componentIsSpecifiedType(child, "label")) {
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
    attributes.label = {
      createComponentOfType: "label",
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

    attributes.triggerWithTargets = {
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


  static returnChildGroups() {

    return [{
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
      defaultValue: "call action",
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

    stateVariableDefinitions.triggerWithTargets = {
      returnDependencies: () => ({
        triggerWithTargets: {
          dependencyType: "attributePrimitive",
          attributeName: "triggerWithTargets"
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
        if (dependencyValues.triggerWhen || dependencyValues.insideTriggerSet
          || dependencyValues.triggerWithTargets === null
        ) {
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
        triggeredAction: "callAction"
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
      dependencies.triggerWithTargets = {
        dependencyType: "stateVariable",
        variableName: "triggerWithTargets"
      }
      dependencies.insideTriggerSet = {
        dependencyType: "stateVariable",
        variableName: "insideTriggerSet"
      }
      return dependencies;
    }

    stateVariableDefinitions.hidden.definition = function (args) {
      if (args.dependencyValues.triggerWhen ||
        args.dependencyValues.triggerWithTargets ||
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
