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
      group: "anything",
      componentTypes: ["_base"]
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
      doNotShadowEssential: true,
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


    stateVariableDefinitions.titleChildName = {
      forRenderer: true,
      returnDependencies: () => ({
        titleChild: {
          dependencyType: "child",
          childGroups: ["titles"],
        },
      }),
      definition({ dependencyValues }) {
        let titleChildName = null;
        if (dependencyValues.titleChild.length > 0) {
          titleChildName = dependencyValues.titleChild[dependencyValues.titleChild.length - 1].componentName
        }
        return {
          setValue: { titleChildName }
        }
      }
    }

    stateVariableDefinitions.childIndicesToRender = {
      returnDependencies: () => ({
        titleChildren: {
          dependencyType: "child",
          childGroups: ["titles"],
        },
        allChildren: {
          dependencyType: "child",
          childGroups: ["anything", "titles"],
        },
        titleChildName: {
          dependencyType: "stateVariable",
          variableName: "titleChildName"
        }
      }),
      definition({ dependencyValues }) {
        let childIndicesToRender = [];

        let allTitleChildNames = dependencyValues.titleChildren.map(x => x.componentName);

        for (let [ind, child] of dependencyValues.allChildren.entries()) {
          if (typeof child !== "object"
            || !allTitleChildNames.includes(child.componentName)
            || child.componentName === dependencyValues.titleChildName
          ) {
            childIndicesToRender.push(ind)
          }
        }

        return { setValue: { childIndicesToRender } }

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
          return { setValue: { title: dependencyValues.titleChild[dependencyValues.titleChild.length - 1].stateValues.text } };
        }
      }
    }

    return stateVariableDefinitions;

  }

  async revealHint({ actionId }) {

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "open",
        value: true
      }],
      overrideReadOnly: true,
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

  async closeHint({ actionId }) {

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "open",
        value: false
      }],
      overrideReadOnly: true,
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

  actions = {
    revealHint: this.revealHint.bind(this),
    closeHint: this.closeHint.bind(this),
    recordVisibilityChange: this.recordVisibilityChange.bind(this),
  }


}
