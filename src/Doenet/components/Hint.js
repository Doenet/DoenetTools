import BlockComponent from './abstract/BlockComponent';

export default class Hint extends BlockComponent {
  static componentType = "hint";

  static includeBlankStringChildren = true;

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroInline = childLogic.newLeaf({
      name: "atLeastZeroInline",
      componentType: '_inline',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroBlock = childLogic.newLeaf({
      name: "atLeastZeroBlock",
      componentType: '_block',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: 'inlineOrBlock',
      operator: "or",
      propositions: [atLeastZeroInline, atLeastZeroBlock],
      setAsBase: true,
    })

    return childLogic;
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

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        children: {
          dependencyType: "childIdentity",
          childLogicName: "inlineOrBlock"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            childrenToRender: dependencyValues.children.map(x => x.componentName)
          }
        }
      }
    }

    return stateVariableDefinitions;

  }

  revealHint() {

    this.coreFunctions.requestUpdate({
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
    })
  }

  closeHint() {

    this.coreFunctions.requestUpdate({
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
    })
  }

  actions = {
    revealHint: this.revealHint.bind(this),
    closeHint: this.closeHint.bind(this),
  }


}
