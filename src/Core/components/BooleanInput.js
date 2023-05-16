import {
  moveGraphicalObjectWithAnchorAction,
  returnAnchorAttributes,
  returnAnchorStateVariableDefinition,
} from "../utils/graphical";
import {
  returnLabelStateVariableDefinitions,
  returnWrapNonLabelsSugarFunction,
} from "../utils/label";
import Input from "./abstract/Input";

export default class BooleanInput extends Input {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      updateBoolean: this.updateBoolean.bind(this),
      moveInput: this.moveInput.bind(this),
    });

    this.externalActions = {};

    //Complex because the stateValues isn't defined until later
    Object.defineProperty(this.externalActions, "submitAnswer", {
      enumerable: true,
      get: async function () {
        let answerAncestor = await this.stateValues.answerAncestor;
        if (answerAncestor !== null) {
          return {
            componentName: answerAncestor.componentName,
            actionName: "submitAnswer",
          };
        } else {
          return;
        }
      }.bind(this),
    });
  }
  static componentType = "booleanInput";

  static variableForPlainMacro = "value";
  static variableForPlainCopy = "value";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.prefill = {
      createComponentOfType: "boolean",
      createStateVariable: "prefill",
      defaultValue: false,
      public: true,
    };
    attributes.labelIsName = {
      createComponentOfType: "boolean",
      createStateVariable: "labelIsName",
      defaultValue: false,
      public: true,
    };
    attributes.asToggleButton = {
      createComponentOfType: "boolean",
      createStateVariable: "asToggleButton",
      defaultValue: false,
      forRenderer: true,
      public: true,
    };
    attributes.bindValueTo = {
      createComponentOfType: "boolean",
    };

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    Object.assign(attributes, returnAnchorAttributes());

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    sugarInstructions.push({
      replacementFunction: returnWrapNonLabelsSugarFunction({
        wrappingComponentType: "boolean",
      }),
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "labels",
        componentTypes: ["label"],
      },
      {
        group: "booleans",
        componentTypes: ["boolean"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let labelDefinitions = returnLabelStateVariableDefinitions();
    Object.assign(stateVariableDefinitions, labelDefinitions);

    let anchorDefinition = returnAnchorStateVariableDefinition();
    Object.assign(stateVariableDefinitions, anchorDefinition);

    stateVariableDefinitions.valueChanged = {
      public: true,
      hasEssential: true,
      defaultValue: false,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({}),
      definition() {
        return { useEssentialOrDefaultValue: { valueChanged: true } };
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "valueChanged",
              value: Boolean(desiredStateVariableValues.valueChanged),
            },
          ],
        };
      },
    };

    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      forRenderer: true,
      hasEssential: true,
      shadowVariable: true,
      returnDependencies: () => ({
        booleanChild: {
          dependencyType: "child",
          childGroups: ["booleans"],
          variableNames: ["value"],
        },
        bindValueTo: {
          dependencyType: "attributeComponent",
          attributeName: "bindValueTo",
          variableNames: ["value"],
        },
        prefill: {
          dependencyType: "stateVariable",
          variableName: "prefill",
        },
        // just for inverse definition
        valueChanged: {
          dependencyType: "stateVariable",
          variableName: "valueChanged",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.booleanChild.length > 0) {
          return {
            setValue: {
              value: dependencyValues.booleanChild[0].stateValues.value,
            },
          };
        } else if (dependencyValues.bindValueTo) {
          return {
            setValue: { value: dependencyValues.bindValueTo.stateValues.value },
          };
        } else {
          return {
            useEssentialOrDefaultValue: {
              value: {
                defaultValue: dependencyValues.prefill,
              },
            },
          };
        }
      },
      inverseDefinition: function ({
        desiredStateVariableValues,
        dependencyValues,
      }) {
        let instructions = [
          {
            setDependency: "valueChanged",
            desiredValue: true,
          },
        ];

        if (dependencyValues.booleanChild.length > 0) {
          instructions.push({
            setDependency: "booleanChild",
            desiredValue: desiredStateVariableValues.value,
            variableIndex: 0,
            childIndex: 0,
          });
        } else if (dependencyValues.bindValueTo) {
          instructions.push({
            setDependency: "bindValueTo",
            desiredValue: desiredStateVariableValues.value,
            variableIndex: 0,
          });
        } else {
          // no child or bindValueTo, so value is essential and give it the desired value
          instructions.push({
            setEssentialValue: "value",
            value: desiredStateVariableValues.value,
          });
        }

        return { success: true, instructions };
      },
    };

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: { text: dependencyValues.value ? "true" : "false" },
        };
      },
    };

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { componentType: "boolean" } }),
    };

    return stateVariableDefinitions;
  }

  static adapters = ["value"];

  async updateBoolean({
    boolean,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.disabled)) {
      let updateInstructions = [
        {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "value",
          value: boolean,
        },
      ];

      let event = {
        verb: "selected",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: boolean,
          responseText: boolean.toString(),
        },
      };

      let answerAncestor = await this.stateValues.answerAncestor;
      if (answerAncestor) {
        event.context = {
          answerAncestor: answerAncestor.componentName,
        };
      }

      await this.coreFunctions.performUpdate({
        updateInstructions,
        event,
        actionId,
        sourceInformation,
        skipRendererUpdate: true,
      });

      return await this.coreFunctions.triggerChainedActions({
        componentName: this.componentName,
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  async moveInput({
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
