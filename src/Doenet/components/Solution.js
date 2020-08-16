import BlockComponent from './abstract/BlockComponent';

export default class Solution extends BlockComponent {
  constructor(args) {
    super(args);

    this.revealSolution = this.revealSolution.bind(this);
    this.revealSolutionCallBack = this.revealSolutionCallBack.bind(this);

  }
  static componentType = "solution";


  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    delete properties.hide;
    return properties;
  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneHide = childLogic.newLeaf({
      name: "atMostOneHide",
      componentType: "hide",
      comparison: "atMost",
      number: 1,
    })

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
      propositions: [atMostOneHide, atLeastZeroInline, atLeastZeroBlock],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.hide = {
      public: true,
      componentType: "boolean",
      forRenderer: true,
      defaultValue: false,
      returnDependencies: () => ({
        hideChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneHide",
          variableNames: ["value"]
        },
        displayMode: {
          dependencyType: "flag",
          flagName: "solutionDisplayMode"
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.displayMode === "none") {
          return { newValues: { hide: true } }
        } else if (dependencyValues.hideChild.length === 1) {
          return {
            newValues: {
              hide: dependencyValues.hideChild[0].stateValues.value
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: {
              hide: { variablesToCheck: ["hide"] }
            }
          }
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.displayMode === "none") {
          return { success: false }
        } else if (dependencyValues.hideChild.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "hideChild",
              desiredValue: desiredStateVariableValues.hide,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setSetVariable: "hide",
              value: desiredStateVariableValues.hide
            }]
          }
        }
      }
    }

    stateVariableDefinitions.open = {
      public: true,
      componentType: "boolean",
      forRenderer: true,
      defaultValue: false,
      returnDependencies: () => ({
        displayMode: {
          dependencyType: "flag",
          flagName: "solutionDisplayMode"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.displayMode === "displayed") {
          return { newValues: { open: true } }
        } else if (dependencyValues.displayMode === "none") {
          return { newValues: { open: false } }
        } else {
          return {
            useEssentialOrDefaultValue: {
              open: {
                variablesToCheck: ["open"]
              }
            }
          }
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.displayMode === "displayed" ||
          dependencyValues.displayMode === "none"
        ) {
          // will always be open if displaymode is displayed
          // or always closed if displaymode is none
          return { success: false }
        }

        return {
          success: true,
          instructions: [{
            setStateVariable: "open",
            value: desiredStateVariableValues.open
          }]
        }
      }
    }


    stateVariableDefinitions.canBeClosed = {
      forRenderer: true,
      returnDependencies: () => ({
        displayMode: {
          dependencyType: "flag",
          flagName: "solutionDisplayMode"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.displayMode === "button") {
          return { newValues: { canBeClosed: true } }
        } else {
          return { newValues: { canBeClosed: false } }
        }
      }
    }

    stateVariableDefinitions.message = {
      public: true,
      componentType: "text",
      forRenderer: true,
      defaultValue: "",
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          message: {
            variablesToCheck: ["message"]
          }
        }
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "message",
            value: desiredStateVariableValues.message
          }]
        }
      }
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        children: {
          dependencyType: "childIdentity",
          childLogicName: "inlineOrBlock"
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues:
            { childrenToRender: dependencyValues.children.map(x => x.componentName) }
        };
      }
    }

    return stateVariableDefinitions;

  }


  revealSolutionCallBack({ allowView, message, scoredComponent }) {

    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "open",
      value: allowView
    }, {
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "message",
      value: message
    }];

    if (allowView) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: scoredComponent,
        stateVariable: "viewedSolution",
        value: true
      })
    }

    this.coreFunctions.requestUpdate({
      updateInstructions: updateInstructions
    })

  }


  revealSolution() {
    let { scoredItemNumber, scoredComponent } = this.coreFunctions.calculateScoredItemNumberOfContainer(this.componentName);

    this.externalFunctions.recordSolutionView({
      itemNumber: scoredItemNumber,
      scoredComponent: scoredComponent,
      callBack: this.revealSolutionCallBack
    });

  }

  closeSolution() {

    this.coreFunctions.requestUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "open",
        value: false
      }]
    })

  }


  actions = {
    revealSolution: this.revealSolution.bind(this),
    closeSolution: this.closeSolution.bind(this),
  }


  static includeBlankStringChildren = true;

}
