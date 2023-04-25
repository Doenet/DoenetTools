import { deepClone } from "../utils/deepFunctions";
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

export default class CallAction extends InlineComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      callAction: this.callAction.bind(this),
      callActionIfTriggerNewlyTrue:
        this.callActionIfTriggerNewlyTrue.bind(this),
      moveButton: this.moveButton.bind(this),
    });
  }
  static componentType = "callAction";
  static rendererType = "button";

  static acceptTarget = true;

  static keepChildrenSerialized({ serializedComponent, componentInfoObjects }) {
    if (serializedComponent.children === undefined) {
      return [];
    } else {
      let keepSerializedInds = [];
      for (let [ind, child] of serializedComponent.children.entries()) {
        if (!componentInfoObjects.componentIsSpecifiedType(child, "label")) {
          keepSerializedInds.push(ind);
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

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    Object.assign(attributes, returnAnchorAttributes());

    let triggerAttributes = returnStandardTriggeringAttributes(
      "callActionIfTriggerNewlyTrue",
    );

    Object.assign(attributes, triggerAttributes);

    attributes.numbers = {
      createComponentOfType: "numberList",
    };

    attributes.number = {
      createComponentOfType: "number",
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
      "callAction",
    );

    let labelDefinitions = returnLabelStateVariableDefinitions();
    Object.assign(stateVariableDefinitions, labelDefinitions);

    let anchorDefinition = returnAnchorStateVariableDefinition();
    Object.assign(stateVariableDefinitions, anchorDefinition);

    stateVariableDefinitions.clickAction = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { clickAction: "callAction" } }),
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

    stateVariableDefinitions.targetName = {
      returnDependencies: () => ({
        targetComponent: {
          dependencyType: "stateVariable",
          variableName: "targetComponent",
        },
      }),
      definition({ dependencyValues }) {
        let targetName = null;
        if (dependencyValues.targetComponent) {
          targetName = dependencyValues.targetComponent.componentName;
        }
        return { setValue: { targetName } };
      },
    };

    return stateVariableDefinitions;
  }

  async callAction({
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let targetName = await this.stateValues.targetName;
    let actionName = await this.stateValues.actionName;
    if (targetName !== null && actionName !== null) {
      let args = { sourceInformation, skipRendererUpdate: true };
      if (this.serializedChildren.length > 0) {
        args.serializedComponents = deepClone(this.serializedChildren);
      }
      if (this.attributes.number) {
        args.number = await this.attributes.number.component.stateValues.value;
      }
      if (this.attributes.numbers) {
        args.numbers = await this.attributes.numbers.component.stateValues
          .numbers;
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
      });

      await this.coreFunctions.triggerChainedActions({
        componentName: this.componentName,
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  async callActionIfTriggerNewlyTrue({
    stateValues,
    previousValues,
    actionId,
  }) {
    // Note: explicitly test if previous value is false
    // so don't trigger on initialization when it is undefined
    if (
      stateValues.triggerWhen &&
      previousValues.triggerWhen === false &&
      !(await this.stateValues.insideTriggerSet)
    ) {
      return await this.callAction({ actionId });
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
