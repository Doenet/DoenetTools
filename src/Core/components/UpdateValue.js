import { returnLabelStateVariableDefinitions } from '../utils/label';
import { normalizeMathExpression } from '../utils/math';
import InlineComponent from './abstract/InlineComponent';

export default class UpdateValue extends InlineComponent {
  static componentType = "updateValue";

  static acceptTarget = true;

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

    attributes.type = {
      createPrimitiveOfType: "string",
      createStateVariable: "type",
      defaultPrimitiveValue: "math",
      toLowerCase: true,
      validValues: ["math", "number", "boolean", "text"]
    }

    attributes.prop = {
      createPrimitiveOfType: "string",
    };

    attributes.newValue = {
      createComponentOfType: "_componentWithSelectableType",
    }

    attributes.componentIndex = {
      createComponentOfType: "integer",
      createStateVariable: "componentIndex",
      defaultValue: null,
      public: true,
    };

    attributes.propIndex = {
      createComponentOfType: "numberList",
      createStateVariable: "propIndex",
      defaultValue: null,
      public: true,
    };

    attributes.triggerWhen = {
      createComponentOfType: "boolean",
      createStateVariable: "triggerWhen",
      defaultValue: false,
      triggerActionOnChange: "updateValueIfTriggerNewlyTrue"
    }

    attributes.triggerWith = {
      createTargetComponentNames: "string"
    }

    attributes.triggerWhenObjectsClicked = {
      createTargetComponentNames: "string"
    }

    attributes.triggerWhenMouseDownOnObjects = {
      createTargetComponentNames: "string"
    }

    // for newValue with type==="math"
    // let simplify="" or simplify="true" be full simplify
    attributes.simplify = {
      createComponentOfType: "text",
      createStateVariable: "simplify",
      defaultValue: "none",
      public: true,
      toLowerCase: true,
      valueTransformations: { "true": "full" },
      validValues: ["none", "full", "numbers", "numberspreserveorder"]
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

    stateVariableDefinitions.propName = {
      returnDependencies: () => ({
        propName: {
          dependencyType: "attributePrimitive",
          attributeName: "prop"
        },
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { propName: dependencyValues.propName } }
      }
    }

    stateVariableDefinitions.targetIdentities = {
      stateVariablesDeterminingDependencies: [
        "targetComponent", "componentIndex",
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        let dependencies = {};

        if (stateValues.targetComponent !== null) {

          if (componentInfoObjects.isCompositeComponent({
            componentType: stateValues.targetComponent.componentType,
            includeNonStandard: false
          })) {
            dependencies.targets = {
              dependencyType: "replacement",
              compositeName: stateValues.targetComponent.componentName,
              recursive: true,
              componentIndex: stateValues.componentIndex,
            }
          } else if (stateValues.componentIndex === null || stateValues.componentIndex === 1) {
            // if we don't have a composite, componentIndex can only match if it is 1
            dependencies.targets = {
              dependencyType: "stateVariable",
              variableName: "targetComponent"
            }
          }


        }
        return dependencies;
      },
      definition({ dependencyValues }) {

        let targetIdentities = null;
        if (dependencyValues.targets) {
          targetIdentities = dependencyValues.targets;
          if (!Array.isArray(targetIdentities)) {
            targetIdentities = [targetIdentities];
          }
        }
        return { setValue: { targetIdentities } };
      },
    }

    stateVariableDefinitions.targets = {
      stateVariablesDeterminingDependencies: [
        "targetIdentities", "propName", "propIndex"
      ],
      returnDependencies: function ({ stateValues }) {

        let dependencies = {
          targetIdentities: {
            dependencyType: "stateVariable",
            variableName: "targetIdentities"
          },
        }

        if (stateValues.targetIdentities !== null) {

          for (let [ind, source] of stateValues.targetIdentities.entries()) {

            let thisTarget;

            if (stateValues.propName) {
              let propIndex = stateValues.propIndex;
              if (propIndex) {
                // make propIndex be a shallow copy
                // so that can detect if it changed
                // when update dependencies
                propIndex = [...propIndex]
              }
              thisTarget = {
                dependencyType: "stateVariable",
                componentName: source.componentName,
                variableName: stateValues.propName,
                returnAsComponentObject: true,
                variablesOptional: true,
                propIndex,
                caseInsensitiveVariableMatch: true,
                publicStateVariablesOnly: true,
                useMappedVariableNames: true,
              }

            } else {
              thisTarget = {
                dependencyType: "componentIdentity",
                componentName: source.componentName
              }
            }

            dependencies["target" + ind] = thisTarget;
          }

        }

        return dependencies;
      },
      definition({ dependencyValues }) {
        let targets = null;

        if (dependencyValues.targetIdentities !== null) {
          targets = [];

          for (let ind in dependencyValues.targetIdentities) {
            if (dependencyValues["target" + ind]) {
              targets.push(dependencyValues["target" + ind]);
            }
          }
        }

        return { setValue: { targets } };
      },
    }

    stateVariableDefinitions.newValue = {
      returnDependencies: () => ({
        newValueAttr: {
          dependencyType: "attributeComponent",
          attributeName: "newValue",
          variableNames: ["value"],
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        },
        simplify: {
          dependencyType: "stateVariable",
          variableName: "simplify"
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.newValueAttr === null) {
          return {
            setValue: {
              newValue: null,
            }
          }
        }

        let newValue = dependencyValues.newValueAttr.stateValues.value;

        if (dependencyValues.type === "math") {
          newValue = normalizeMathExpression({
            value: newValue,
            simplify: dependencyValues.simplify
          })
        }

        return {
          setValue: { newValue }
        }
      },
    };

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
        triggerWhenMouseDownOnObjects: {
          dependencyType: "attributeTargetComponentNames",
          attributeName: "triggerWhenMouseDownOnObjects"
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
        triggeredAction: "updateValue"
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


  async updateValue({ actionId }) {

    let targets = await this.stateValues.targets;
    let newValue = await this.stateValues.newValue;
    if (targets === null || newValue === null) {
      return;
    }

    let updateInstructions = [];

    for (let target of targets) {
      let stateVariable = "value";
      if (target.stateValues) {
        stateVariable = Object.keys(target.stateValues)[0];
        if (stateVariable === undefined) {
          console.warn(`Cannot update prop="${await this.stateValues.propName}" of ${await this.stateValues.target} as could not find prop ${await this.stateValues.propName} on a component of type ${target.componentType}`)
          continue;
        }
      }

      updateInstructions.push({
        updateType: "updateValue",
        componentName: target.componentName,
        stateVariable,
        value: newValue,
      })

    }


    await this.coreFunctions.performUpdate({
      updateInstructions,
      actionId,
      event: {
        verb: "selected",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: newValue,
          responseText: newValue.toString(),
        }
      },
    });

    return await this.coreFunctions.triggerChainedActions({
      componentName: this.componentName,
    });


  }

  async updateValueIfTriggerNewlyTrue({ stateValues, previousValues, actionId }) {
    // Note: explicitly test if previous value is false
    // so don't trigger on initialization when it is undefined
    if (await stateValues.triggerWhen && previousValues.triggerWhen === false &&
      !await this.stateValues.insideTriggerSet
    ) {
      return await this.updateValue({ actionId });
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  actions = {
    updateValue: this.updateValue.bind(this),
    updateValueIfTriggerNewlyTrue: this.updateValueIfTriggerNewlyTrue.bind(this)
  };
}

