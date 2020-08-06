import Input from './abstract/Input';
import { deepCompare } from '../utils/deepFunctions';

export default class Choiceinput extends Input {
  constructor(args) {
    super(args);


    this.actions = {
      updateSelectedIndices: this.updateSelectedIndices.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      )
    }

    //Complex because the stateValues isn't defined until later
    Object.defineProperty(this.actions, 'submitAnswer', {
      get: function () {
        if (this.stateValues.answerAncestor !== null) {
          return () => this.requestAction({
            componentName: this.stateValues.answerAncestor.componentName,
            actionName: "submitAnswer"
          })
        } else {
          return () => null
        }
      }.bind(this)
    });

  }

  static componentType = "choiceinput";

  // used when referencing this component without prop
  static get stateVariablesShadowedForReference() { return ["choiceOrder"] };

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.selectMultiple = { default: false };
    properties.assignPartialCredit = { default: false };
    properties.inline = { default: false, forRenderer: true };
    properties.fixedOrder = { default: false };
    properties.feedbackDefinitions = { propagateToDescendants: true, mergeArrays: true }
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atLeastZeroChoices",
      componentType: "choice",
      comparison: "atLeast",
      number: 0,
      setAsBase: true,
    })

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.numberChoices = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        choiceChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroChoices",
        },
      }),
      definition({ dependencyValues }) {
        return { newValues: { numberChoices: dependencyValues.choiceChildren.length } }
      }
    }

    stateVariableDefinitions.choiceOrder = {
      returnDependencies: ({ sharedParameters }) => ({
        choiceChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroChoices",
          variableNames: ["text"]
        },
        fixedOrder: {
          dependencyType: "stateVariable",
          variableName: "fixedOrder"
        },
        selectRng: {
          dependencyType: "value",
          value: sharedParameters.selectRng,
          doNotProxy: true,
        }
      }),
      definition: function ({ dependencyValues }) {
        let numberChoices = dependencyValues.choiceChildren.length;
        let choiceOrder;
        if (dependencyValues.fixedOrder) {
          choiceOrder = [...Array(numberChoices).keys()]
        } else {
          // shuffle order every time get new children
          // https://stackoverflow.com/a/12646864
          choiceOrder = [...Array(numberChoices).keys()]
          for (let i = numberChoices - 1; i > 0; i--) {
            const rand = dependencyValues.selectRng.random();
            const j = Math.floor(rand * (i + 1));
            [choiceOrder[i], choiceOrder[j]] = [choiceOrder[j], choiceOrder[i]];
          }
        }
        return { newValues: { choiceOrder } }
      }
    }

    stateVariableDefinitions.choiceChildrenOrdered = {
      additionalStateVariablesDefined: [
        { variableName: "numberChoices", public: true, componentType: "number" },
      ],
      returnDependencies: () => ({
        choiceOrder: {
          dependencyType: "stateVariable",
          variableName: "choiceOrder"
        },
        choiceChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroChoices",
          // variableNames: ["text", "selected", "submitted", "credit"]
        },
      }),
      definition: function ({ dependencyValues }) {

        let numberChoices = dependencyValues.choiceChildren.length;
        let choiceChildrenOrdered = dependencyValues.choiceOrder.map(i => dependencyValues.choiceChildren[i]);

        return {
          newValues: {
            choiceChildrenOrdered, numberChoices
          }
        }
      },
    }

    stateVariableDefinitions.choiceTexts = {
      public: true,
      componentType: "text",
      isArray: true,
      entryPrefixes: ["choiceText"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        numberChoices: {
          dependencyType: "stateVariable",
          variableName: "numberChoices",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numberChoices];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          choiceOrder: {
            dependencyType: "stateVariable",
            variableName: "choiceOrder"
          },
          choiceChildren: {
            dependencyType: "childStateVariables",
            childLogicName: "atLeastZeroChoices",
            variableNames: ["text"]
          },
        };

        return { globalDependencies }
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        let choiceChildrenOrdered = globalDependencyValues.choiceOrder.map(
          i => globalDependencyValues.choiceChildren[i]
        );

        return {
          newValues: {
            choiceTexts: choiceChildrenOrdered.map(x => x.stateValues.text)
          }
        }
      }

    }

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { componentType: "text" } })
    }


    stateVariableDefinitions.selectedIndices = {
      public: true,
      componentType: "number",
      isArray: true,
      entryPrefixes: ["selectedIndex"],
      forRenderer: true,
      entireArrayAtOnce: true,
      returnDependencies() {
        return {
          choiceOrder: {
            dependencyType: "stateVariable",
            variableName: "choiceOrder"
          },
          choiceChildren: {
            dependencyType: "childStateVariables",
            childLogicName: "atLeastZeroChoices",
            variableNames: ["selected"]
          },
        };
      },
      entireArrayDefinition({ dependencyValues }) {

        let selectedIndices = [];
        let choiceChildrenOrdered = dependencyValues.choiceOrder.map(i => dependencyValues.choiceChildren[i]);

        for (let [ind, choiceChild] of choiceChildrenOrdered.entries()) {
          if (choiceChild.stateValues.selected) {
            selectedIndices.push(ind + 1)
          }
        }
        return { newValues: { selectedIndices } }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues,
      }) {
        let instructions = [];
        for (let [ind, choiceChild] of dependencyValues.choiceChildren.entries()) {

          let indexInOrder = dependencyValues.choiceOrder.indexOf(ind) + 1;
          let choiceSelected = desiredStateVariableValues.selectedIndices.includes(indexInOrder);
          if (choiceChild.stateValues.selected !== choiceSelected) {
            instructions.push({
              setDependency: "choiceChildren",
              desiredValue: choiceSelected,
              childIndex: ind,
              variableIndex: 0,
            });
          }
        }

        return {
          success: true,
          instructions,
        };

      }
    }

    stateVariableDefinitions.selectedIndex = {
      isAlias: true,
      targetVariableName: "selectedIndex1"
    };


    stateVariableDefinitions.selectedValues = {
      public: true,
      componentType: "text",
      isArray: true,
      entryPrefixes: ["selectedValue"],
      entireArrayAtOnce: true,
      returnDependencies() {
        return {
          selectedIndices: {
            dependencyType: "stateVariable",
            variableName: "selectedIndices"
          },
          choiceTexts: {
            dependencyType: "stateVariable",
            variableName: "choiceTexts"
          }
        };
      },
      entireArrayDefinition({ dependencyValues }) {
        console.log(`definition of selected values`)
        console.log(dependencyValues)
        console.log(dependencyValues.selectedIndices
          .map(i => dependencyValues.choiceTexts[i - 1])
        )
        return {
          newValues: {
            selectedValues: dependencyValues.selectedIndices
              .map(i => dependencyValues.choiceTexts[i - 1])
          }
        }
      }
    }

    stateVariableDefinitions.selectedValue = {
      isAlias: true,
      targetVariableName: "selectedValue1"
    };

    stateVariableDefinitions.values = {
      isAlias: true,
      targetVariableName: "selectedValues"
    };

    stateVariableDefinitions.nValues = {
      returnDependencies: () => ({
        values: {
          dependencyType: "stateVariable",
          variableName: "values"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { nValues: dependencyValues.values.length }
      })
    }

    stateVariableDefinitions.creditAchievedIfSubmit = {
      returnDependencies: () => ({
        choiceChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroChoices",
          variableNames: ["selected", "credit"]
        },
        selectMultiple: {
          dependencyType: "stateVariable",
          variableName: "selectMultiple"
        },
        assignPartialCredit: {
          dependencyType: "stateVariable",
          variableName: "assignPartialCredit"
        },
      }),
      definition: function ({ dependencyValues }) {
        let creditAchievedIfSubmit = 0;
        if (dependencyValues.selectMultiple) {
          let nCorrectlySelected = 0;
          let nIncorrectlySelected = 0;
          let nIncorrectlyUnselected = 0;
          for (let choiceChild of dependencyValues.choiceChildren) {
            if (choiceChild.stateValues.selected) {
              if (choiceChild.stateValues.credit === 1) {
                nCorrectlySelected++;
              } else {
                nIncorrectlySelected++;
              }
            } else {
              if (choiceChild.stateValues.credit === 1) {
                nIncorrectlyUnselected++;
              }
            }
          }
          if (dependencyValues.assignPartialCredit) {
            let denominator = nCorrectlySelected + nIncorrectlySelected + nIncorrectlyUnselected;
            if (denominator === 0) {
              creditAchievedIfSubmit = 1;
            } else {
              creditAchievedIfSubmit = nCorrectlySelected / denominator;
            }
          } else {
            if (nIncorrectlySelected + nIncorrectlyUnselected === 0) {
              creditAchievedIfSubmit = 1;
            }
          }
        } else {
          for (let choiceChild of dependencyValues.choiceChildren) {
            if (choiceChild.stateValues.selected) {
              creditAchievedIfSubmit = choiceChild.stateValues.credit;
              break;
            }
          }
        }

        return { newValues: { creditAchievedIfSubmit } }
      }
    }

    stateVariableDefinitions.valueToRecordOnSubmit = {
      isAlias: true,
      targetVariableName: "selectedIndices"
    }

    stateVariableDefinitions.submittedIndices = {
      returnDependencies: () => ({
        choiceOrder: {
          dependencyType: "stateVariable",
          variableName: "choiceOrder"
        },
        choiceChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroChoices",
          variableNames: ["submitted"]
        },
      }),
      definition({ dependencyValues }) {

        let submittedIndices = [];
        let choiceChildrenOrdered = dependencyValues.choiceOrder.map(i => dependencyValues.choiceChildren[i]);

        for (let [ind, choiceChild] of choiceChildrenOrdered.entries()) {
          if (choiceChild.stateValues.submitted) {
            submittedIndices.push(ind + 1)
          }
        }

        return { newValues: { submittedIndices } }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {

        let instructions = [];

        for (let [ind, childIndex] of dependencyValues.choiceOrder.entries()) {
          instructions.push({
            setDependency: "choiceChildren",
            desiredValue: desiredStateVariableValues.submittedIndices.includes(ind + 1),
            variableIndex: 0,
            childIndex
          })
        }

        return {
          success: true,
          instructions
        }

      }
    }

    stateVariableDefinitions.valueRecordedAtSubmit = {
      isAlias: true,
      targetVariableName: "submittedIndices"
    }

    stateVariableDefinitions.feedbacks = {
      public: true,
      componentType: "feedbacktext",
      isArray: true,
      entryPrefixes: ["feedback"],
      entireArrayAtOnce: true,
      returnDependencies: () => ({
        choiceOrder: {
          dependencyType: "stateVariable",
          variableName: "choiceOrder"
        },
        choiceChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroChoices",
          variableNames: ["feedbacks"]
        },
      }),
      entireArrayDefinition({ dependencyValues }) {

        let choiceChildrenOrdered = dependencyValues.choiceOrder.map(i => dependencyValues.choiceChildren[i]);

        let feedbacks = [];

        for (let choiceChild of choiceChildrenOrdered) {
          feedbacks.push(...choiceChild.stateValues.feedbacks);
        }
        return {
          newValues: {
            feedbacks
          }
        }
      }
    }


    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        choiceChildrenOrdered: {
          dependencyType: "stateVariable",
          variableName: "choiceChildrenOrdered"
        },
        inline: {
          dependencyType: "stateVariable",
          variableName: "inline"
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.inline) {
          return { newValues: { childrenToRender: [] } }
        } else {
          return {
            newValues: {
              childrenToRender: dependencyValues.choiceChildrenOrdered.map(x => x.componentName)
            }
          }
        }
      }
    }


    return stateVariableDefinitions;

  }

  updateSelectedIndices({ selectedIndices }) {
    if (!this.stateValues.disabled) {
      this.requestUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "selectedIndices",
          value: selectedIndices
        }]
      })
    }
  }

}
