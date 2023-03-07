import BlockComponent from './abstract/BlockComponent';

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

    return [{
      group: "allChildren",
      componentTypes: ["_base"]
    }]

  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible }
    })
    this.coreFunctions.resolveAction({ actionId });
  }

}



export class DisplayDoenetML extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });

  }
  static componentType = "displayDoenetML";
  static rendererType = "text";

  static includeBlankStringChildren = true;

  static returnChildGroups() {

    return [{
      group: "allChildren",
      componentTypes: ["_base"]
    }]
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      returnDependencies: () => ({
        childrenDoenetML: {
          dependencyType: "doenetML",
          displayOnlyChildren: true,
        }
      }),
      definition({ dependencyValues }) {
        return { setValue: { value: dependencyValues.childrenDoenetML } }
      }

    }


    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { text: dependencyValues.value }
      })
    }


    return stateVariableDefinitions;

  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible }
    })
    this.coreFunctions.resolveAction({ actionId });
  }

}
