import BlockComponent from './abstract/BlockComponent.js';

export default class Hint extends BlockComponent {
  static componentType = "hint";
  static renderChildren = true;

  static includeBlankStringChildren = true;

  static returnChildGroups() {

    return [{
      group: "titles",
      componentTypes: ["title"]
    }, {
      group: "inlinesBlocks",
      componentTypes: ["_inline", "_block"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.showHints = {
      forRenderer: true,
      returnDependencies: () => ({
        hide: {
          dependencyType: "stateVariable",
          variableName: "hide"
        },
        showHintsFlag: {
          dependencyType: "flag",
          flagName: "showHints"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            showHints: dependencyValues.showHintsFlag && !dependencyValues.hide
          }
        }
      }
    }

    stateVariableDefinitions.open = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      forRenderer: true,
      defaultValue: false,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition() {
        return {
          useEssentialOrDefaultValue: {
            open: true
          }
        }
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "open",
            value: desiredStateVariableValues.open
          }]
        }
      }
    }


    stateVariableDefinitions.titleDefinedByChildren = {
      forRenderer: true,
      returnDependencies: () => ({
        titleChild: {
          dependencyType: "child",
          childGroups: ["titles"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            titleDefinedByChildren: dependencyValues.titleChild.length > 0
          }
        }
      }
    }

    stateVariableDefinitions.title = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      returnDependencies: () => ({
        titleChild: {
          dependencyType: "child",
          childGroups: ["titles"],
          variableNames: ["text"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.titleChild.length === 0) {
          return { setValue: { title: "Hint" } };
        } else {
          return { setValue: { title: dependencyValues.titleChild[0].stateValues.text } };
        }
      }
    }

    return stateVariableDefinitions;

  }

  async revealHint({actionId}) {

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "open",
        value: true
      }],
      actionId,
      event: {
        verb: "viewed",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
      }
    });
  }

  async closeHint({actionId}) {

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "open",
        value: false
      }],
      actionId,
      event: {
        verb: "closed",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
      }
    });
  }

  actions = {
    revealHint: this.revealHint.bind(this),
    closeHint: this.closeHint.bind(this),
  }


}
