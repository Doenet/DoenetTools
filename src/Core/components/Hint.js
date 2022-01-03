import BlockComponent from './abstract/BlockComponent';

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
          newValues: {
            showHints: dependencyValues.showHintsFlag && !dependencyValues.hide
          }
        }
      }
    }

    stateVariableDefinitions.open = {
      public: true,
      componentType: "boolean",
      forRenderer: true,
      defaultValue: false,
      returnDependencies: () => ({}),
      definition() {
        return {
          useEssentialOrDefaultValue: {
            open: {
              variablesToCheck: ["open"]
            }
          }
        }
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "open",
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
          newValues: {
            titleDefinedByChildren: dependencyValues.titleChild.length > 0
          }
        }
      }
    }

    stateVariableDefinitions.title = {
      public: true,
      componentType: "text",
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
          return { newValues: { title: "Hint" } };
        } else {
          return { newValues: { title: dependencyValues.titleChild[0].stateValues.text } };
        }
      }
    }

    return stateVariableDefinitions;

  }

  async revealHint() {

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "open",
        value: true
      }],
      event: {
        verb: "viewed",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
      }
    });
  }

  async closeHint() {

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "open",
        value: false
      }],
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
