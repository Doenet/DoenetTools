import {
  moveGraphicalObjectWithAnchorAction,
  returnAnchorAttributes,
  returnAnchorStateVariableDefinition,
} from "../utils/graphical";
import { returnLabelStateVariableDefinitions } from "../utils/label";
import {
  addStandardTriggeringStateVariableDefinitions,
  returnStandardTriggeringAttributes,
} from "../utils/triggering";
import InlineComponent from "./abstract/InlineComponent";
import me from "math-expressions";

export default class triggerSet extends InlineComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      triggerActions: this.triggerActions.bind(this),
      triggerActionsIfTriggerNewlyTrue:
        this.triggerActionsIfTriggerNewlyTrue.bind(this),
      moveButton: this.moveButton.bind(this),
    });
  }
  static componentType = "triggerSet";
  static rendererType = "button";

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

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    Object.assign(attributes, returnAnchorAttributes());

    let triggerAttributes = returnStandardTriggeringAttributes(
      "triggerActionsIfTriggerNewlyTrue",
    );

    Object.assign(attributes, triggerAttributes);

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "updateValuesCallActions",
        componentTypes: ["updateValue", "callAction"],
      },
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
      "triggerActions",
    );

    let labelDefinitions = returnLabelStateVariableDefinitions();
    Object.assign(stateVariableDefinitions, labelDefinitions);

    let anchorDefinition = returnAnchorStateVariableDefinition();
    Object.assign(stateVariableDefinitions, anchorDefinition);

    stateVariableDefinitions.clickAction = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { clickAction: "triggerActions" } }),
    };

    stateVariableDefinitions.updateValueAndActionsToTrigger = {
      returnDependencies: () => ({
        updateValueAndCallActionChildren: {
          dependencyType: "child",
          childGroups: ["updateValuesCallActions"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            updateValueAndActionsToTrigger:
              dependencyValues.updateValueAndCallActionChildren,
          },
        };
      },
    };

    return stateVariableDefinitions;
  }

  async triggerActions({
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    for (let child of await this.stateValues.updateValueAndActionsToTrigger) {
      if (
        this.componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: child.componentType,
          baseComponentType: "updateValue",
        })
      ) {
        await this.coreFunctions.performAction({
          componentName: child.componentName,
          actionName: "updateValue",
          args: { actionId, sourceInformation, skipRendererUpdate: true },
        });
      } else if (
        this.componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: child.componentType,
          baseComponentType: "callAction",
        })
      ) {
        await this.coreFunctions.performAction({
          componentName: child.componentName,
          actionName: "callAction",
          args: { actionId, sourceInformation, skipRendererUpdate: true },
        });
      }
    }

    this.coreFunctions.resolveAction({ actionId });

    return await this.coreFunctions.triggerChainedActions({
      componentName: this.componentName,
      actionId,
      sourceInformation,
      skipRendererUpdate,
    });
  }

  async triggerActionsIfTriggerNewlyTrue({
    stateValues,
    previousValues,
    actionId,
  }) {
    // Note: explicitly test if previous value is false
    // so don't trigger on initialization when it is undefined
    if (stateValues.triggerWhen && previousValues.triggerWhen === false) {
      return await this.triggerActions({ actionId, skipRendererUpdate: true });
    } else {
      this.coreFunctions.resolveAction({ actionId });
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
