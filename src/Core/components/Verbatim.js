import {
  returnSelectedStyleStateVariableDefinition,
  returnTextStyleDescriptionDefinitions,
} from "../utils/style";
import BlockComponent from "./abstract/BlockComponent";
import InlineComponent from "./abstract/InlineComponent";

export class Pre extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "pre";
  static renderChildren = true;

  static includeBlankStringChildren = true;

  static returnChildGroups() {
    return [
      {
        group: "allChildren",
        componentTypes: ["_base"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.displayDoenetMLIndices = {
      forRenderer: true,
      returnDependencies: () => ({
        allChildren: {
          dependencyType: "child",
          childGroups: ["allChildren"],
        },
      }),
      definition({ dependencyValues }) {
        let displayDoenetMLIndices = [];
        for (let [ind, child] of dependencyValues.allChildren.entries()) {
          if (child.componentType === "displayDoenetML") {
            displayDoenetMLIndices.push(ind);
          }
        }

        return { setValue: { displayDoenetMLIndices } };
      },
    };

    return stateVariableDefinitions;
  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible },
    });
    this.coreFunctions.resolveAction({ actionId });
  }
}

export class DisplayDoenetML extends InlineComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "displayDoenetML";
  static rendererType = "text";

  static keepChildrenSerialized({ serializedComponent }) {
    if (serializedComponent.children === undefined) {
      return [];
    } else {
      return Object.keys(serializedComponent.children);
    }
  }

  static includeBlankStringChildren = true;

  static returnChildGroups() {
    return [
      {
        group: "allChildren",
        componentTypes: ["_base"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let selectedStyleDefinition = returnSelectedStyleStateVariableDefinition();
    Object.assign(stateVariableDefinitions, selectedStyleDefinition);

    let styleDescriptionDefinitions = returnTextStyleDescriptionDefinitions();
    Object.assign(stateVariableDefinitions, styleDescriptionDefinitions);

    stateVariableDefinitions.value = {
      returnDependencies: () => ({
        childrenDoenetML: {
          dependencyType: "doenetML",
          displayOnlyChildren: true,
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { value: dependencyValues.childrenDoenetML } };
      },
    };

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { text: dependencyValues.value },
      }),
    };

    return stateVariableDefinitions;
  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible },
    });
    this.coreFunctions.resolveAction({ actionId });
  }
}
