import BlockComponent from './abstract/BlockComponent';

export default class Solution extends BlockComponent {
  constructor(args) {
    super(args);

    this.revealSolution = this.revealSolution.bind(this);
    this.finishRevealSolution = this.finishRevealSolution.bind(this);

  }
  static componentType = "solution";
  static renderChildren = true;


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.hide = {
      createComponentOfType: "boolean"
    }
    return attributes;
  }


  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let wrapWithContainer = function ({ matchedChildren }) {

      return {
        success: true,
        newChildren: [{
          componentType: "_solutionContainer",
          children: matchedChildren
        }],
      }

    }

    sugarInstructions.push({
      replacementFunction: wrapWithContainer
    });

    return sugarInstructions;

  }


  static returnChildGroups() {

    return [{
      group: "inlinesBlocks",
      componentTypes: ["_inline", "_block"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.hide = {
      public: true,
      componentType: "boolean",
      forRenderer: true,
      defaultValue: false,
      hasEssential: true,
      returnDependencies: () => ({
        hideAttr: {
          dependencyType: "attributeComponent",
          attributeName: "hide",
          variableNames: ["value"]
        },
        displayMode: {
          dependencyType: "flag",
          flagName: "solutionDisplayMode"
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.displayMode === "none") {
          return { setValue: { hide: true } }
        } else if (dependencyValues.hideAttr !== null) {
          return {
            setValue: {
              hide: dependencyValues.hideAttr.stateValues.value
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: {
              hide: true
            }
          }
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.displayMode === "none") {
          return { success: false }
        } else if (dependencyValues.hideAttr !== null) {
          return {
            success: true,
            instructions: [{
              setDependency: "hideAttr",
              desiredValue: desiredStateVariableValues.hide,
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
      hasEssential: true,
      returnDependencies: () => ({
        displayMode: {
          dependencyType: "flag",
          flagName: "solutionDisplayMode"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.displayMode === "displayed") {
          return { setValue: { open: true } }
        } else if (dependencyValues.displayMode === "none") {
          return { setValue: { open: false } }
        } else {
          return {
            useEssentialOrDefaultValue: {
              open: true
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
            setEssentialValue: "open",
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
          return { setValue: { canBeClosed: true } }
        } else {
          return { setValue: { canBeClosed: false } }
        }
      }
    }

    stateVariableDefinitions.message = {
      public: true,
      componentType: "text",
      forRenderer: true,
      defaultValue: "",
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          message: true
        }
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "message",
            value: desiredStateVariableValues.message
          }]
        }
      }
    }

    return stateVariableDefinitions;

  }


  async finishRevealSolution({ allowView, message, scoredComponent }) {

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

    let event;

    if (allowView) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: scoredComponent,
        stateVariable: "viewedSolution",
        value: true
      });

      event = {
        verb: "viewed",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
      }
    }

    return await this.coreFunctions.performUpdate({
      updateInstructions,
      event,
      overrideReadOnly: true,
    })

  }


  async revealSolution() {
    let { scoredItemNumber, scoredComponent } = await this.coreFunctions.calculateScoredItemNumberOfContainer(this.componentName);

    let result = await this.coreFunctions.recordSolutionView({
      itemNumber: scoredItemNumber,
      scoredComponent: scoredComponent,
    });

    return await this.finishRevealSolution(result)

  }

  async closeSolution() {

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
    })

  }


  actions = {
    revealSolution: this.revealSolution.bind(this),
    closeSolution: this.closeSolution.bind(this),
  }


  static includeBlankStringChildren = true;

}
