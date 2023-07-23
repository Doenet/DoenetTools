import {
  moveGraphicalObjectWithAnchorAction,
  returnAnchorAttributes,
  returnAnchorStateVariableDefinition,
} from "../utils/graphical";
import { returnLabelStateVariableDefinitions } from "../utils/label";
import { normalizeMathExpression } from "../utils/math";
import {
  addStandardTriggeringStateVariableDefinitions,
  returnStandardTriggeringAttributes,
} from "../utils/triggering";
import InlineComponent from "./abstract/InlineComponent";

export default class UpdateValue extends InlineComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      updateValue: this.updateValue.bind(this),
      updateValueIfTriggerNewlyTrue:
        this.updateValueIfTriggerNewlyTrue.bind(this),
      moveButton: this.moveButton.bind(this),
    });
  }
  static componentType = "updateValue";
  static rendererType = "button";

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
      validValues: ["math", "number", "boolean", "text"],
    };

    attributes.prop = {
      createPrimitiveOfType: "string",
    };

    attributes.newValue = {
      createComponentOfType: "_componentWithSelectableType",
    };

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

    attributes.targetSubnames = {
      createPrimitiveOfType: "stringArray",
      createStateVariable: "targetSubnames",
      defaultValue: null,
      public: true,
    };
    attributes.targetSubnamesComponentIndex = {
      createComponentOfType: "numberList",
      createStateVariable: "targetSubnamesComponentIndex",
      defaultValue: null,
      public: true,
    };

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    Object.assign(attributes, returnAnchorAttributes());

    let triggerAttributes = returnStandardTriggeringAttributes(
      "updateValueIfTriggerNewlyTrue",
    );

    Object.assign(attributes, triggerAttributes);

    // for newValue with type==="math"
    // let simplify="" or simplify="true" be full simplify
    attributes.simplify = {
      createComponentOfType: "text",
      createStateVariable: "simplify",
      defaultValue: "none",
      public: true,
      toLowerCase: true,
      valueTransformations: { "": "full", true: "full", false: "none" },
      validValues: ["none", "full", "numbers", "numberspreserveorder"],
    };

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "labels",
        componentTypes: ["label"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    addStandardTriggeringStateVariableDefinitions(
      stateVariableDefinitions,
      "updateValue",
    );

    let labelDefinitions = returnLabelStateVariableDefinitions();
    Object.assign(stateVariableDefinitions, labelDefinitions);

    let anchorDefinition = returnAnchorStateVariableDefinition();
    Object.assign(stateVariableDefinitions, anchorDefinition);

    stateVariableDefinitions.clickAction = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { clickAction: "updateValue" } }),
    };

    stateVariableDefinitions.target = {
      returnDependencies: () => ({
        target: {
          dependencyType: "doenetAttribute",
          attributeName: "target",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { target: dependencyValues.target },
      }),
    };

    stateVariableDefinitions.targetComponent = {
      returnDependencies() {
        return {
          targetComponent: {
            dependencyType: "targetComponent",
          },
        };
      },
      definition: function ({ dependencyValues }) {
        let targetComponent = null;
        if (dependencyValues.targetComponent) {
          targetComponent = dependencyValues.targetComponent;
        }

        return {
          setValue: { targetComponent },
        };
      },
    };

    stateVariableDefinitions.propName = {
      returnDependencies: () => ({
        propName: {
          dependencyType: "attributePrimitive",
          attributeName: "prop",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { propName: dependencyValues.propName } };
      },
    };

    stateVariableDefinitions.targetIdentities = {
      stateVariablesDeterminingDependencies: [
        "targetComponent",
        "componentIndex",
        "targetSubnames",
        "targetSubnamesComponentIndex",
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {
        let dependencies = {};

        if (stateValues.targetComponent !== null) {
          if (
            componentInfoObjects.isCompositeComponent({
              componentType: stateValues.targetComponent.componentType,
              includeNonStandard: false,
            }) ||
            (componentInfoObjects.isCompositeComponent({
              componentType: stateValues.targetComponent.componentType,
              includeNonStandard: true,
            }) &&
              stateValues.componentIndex !== null)
          ) {
            let targetSubnamesComponentIndex =
              stateValues.targetSubnamesComponentIndex;
            if (targetSubnamesComponentIndex) {
              targetSubnamesComponentIndex = [...targetSubnamesComponentIndex];
            }

            dependencies.targets = {
              dependencyType: "replacement",
              compositeName: stateValues.targetComponent.componentName,
              recursive: true,
              componentIndex: stateValues.componentIndex,
              targetSubnames: stateValues.targetSubnames,
              targetSubnamesComponentIndex,
            };
          } else if (
            stateValues.componentIndex === null ||
            stateValues.componentIndex === 1
          ) {
            // if we don't have a composite, componentIndex can only match if it is 1
            dependencies.targets = {
              dependencyType: "stateVariable",
              variableName: "targetComponent",
            };
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
    };

    stateVariableDefinitions.targets = {
      stateVariablesDeterminingDependencies: [
        "targetIdentities",
        "propName",
        "propIndex",
      ],
      returnDependencies: function ({ stateValues }) {
        let dependencies = {
          targetIdentities: {
            dependencyType: "stateVariable",
            variableName: "targetIdentities",
          },
        };

        if (stateValues.targetIdentities !== null) {
          for (let [ind, source] of stateValues.targetIdentities.entries()) {
            let thisTarget;

            if (stateValues.propName) {
              let propIndex = stateValues.propIndex;
              if (propIndex) {
                // make propIndex be a shallow copy
                // so that can detect if it changed
                // when update dependencies
                propIndex = [...propIndex];
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
              };
            } else {
              thisTarget = {
                dependencyType: "componentIdentity",
                componentName: source.componentName,
              };
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
    };

    stateVariableDefinitions.newValue = {
      returnDependencies: () => ({
        newValueAttr: {
          dependencyType: "attributeComponent",
          attributeName: "newValue",
          variableNames: ["value"],
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        simplify: {
          dependencyType: "stateVariable",
          variableName: "simplify",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.newValueAttr === null) {
          return {
            setValue: {
              newValue: null,
            },
          };
        }

        let newValue = dependencyValues.newValueAttr.stateValues.value;

        if (dependencyValues.type === "math") {
          newValue = normalizeMathExpression({
            value: newValue,
            simplify: dependencyValues.simplify,
          });
        }

        return {
          setValue: { newValue },
        };
      },
    };

    return stateVariableDefinitions;
  }

  async updateValue({
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let targets = await this.stateValues.targets;
    let newValue = await this.stateValues.newValue;
    if (targets === null || newValue === null) {
      return;
    }

    let updateInstructions = [];
    let warnings = [];

    for (let target of targets) {
      let stateVariable = "value";
      if (target.stateValues) {
        stateVariable = Object.keys(target.stateValues)[0];
        if (stateVariable === undefined) {
          let compForRange = this;
          while (compForRange.replacementOf) {
            compForRange = compForRange.replacementOf;
          }
          warnings.push({
            message: `Cannot update prop="${await this.stateValues
              .propName}" of ${await this.stateValues
              .target} as could not find prop ${await this.stateValues
              .propName} on a component of type ${target.componentType}`,
            level: 1,
            doenetMLrange: compForRange.doenetMLrange,
          });
          continue;
        }
      }

      updateInstructions.push({
        updateType: "updateValue",
        componentName: target.componentName,
        stateVariable,
        value: newValue,
      });
    }

    await this.coreFunctions.performUpdate({
      updateInstructions,
      warnings,
      actionId,
      sourceInformation,
      skipRendererUpdate: true,
      event: {
        verb: "selected",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: newValue,
          responseText: newValue.toString(),
        },
      },
    });

    return await this.coreFunctions.triggerChainedActions({
      componentName: this.componentName,
      actionId,
      sourceInformation,
      skipRendererUpdate,
    });
  }

  async updateValueIfTriggerNewlyTrue({
    stateValues,
    previousValues,
    actionId,
  }) {
    // Note: explicitly test if previous value is false
    // so don't trigger on initialization when it is undefined
    if (
      (await stateValues.triggerWhen) &&
      previousValues.triggerWhen === false &&
      !(await this.stateValues.insideTriggerSet)
    ) {
      return await this.updateValue({ actionId, skipRendererUpdate: true });
    }
  }

  async moveButton({
    x,
    y,
    z,
    transient,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    return await moveGraphicalObjectWithAnchorAction({
      x,
      y,
      z,
      transient,
      actionId,
      sourceInformation,
      skipRendererUpdate,
      componentName: this.componentName,
      componentType: this.componentType,
      coreFunctions: this.coreFunctions,
    });
  }
}
