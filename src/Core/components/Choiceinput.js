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
          if (this.stateValues.answerAncestor.stateValues.submitAllAnswersAtAncestor !== null) {
            return () => this.coreFunctions.requestAction({
              componentName: this.stateValues.answerAncestor.stateValues.submitAllAnswersAtAncestor,
              actionName: "submitAllAnswers"
            })
          } else {
            return () => this.coreFunctions.requestAction({
              componentName: this.stateValues.answerAncestor.componentName,
              actionName: "submitAnswer"
            })
          }
        } else {
          return () => null
        }
      }.bind(this)
    });

  }

  static componentType = "choiceinput";

  static variableForPlainMacro = "values";

  static createsVariants = true;

  // used when referencing this component without prop
  static get stateVariablesShadowedForReference() {
    return [
      "choiceOrder", "allSelectedIndices", "indexMatchedByBoundValue"
    ]
  };

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

    let atLeastZeroChoices = childLogic.newLeaf({
      name: "atLeastZeroChoices",
      componentType: "choice",
      comparison: "atLeast",
      number: 0,
    })

    let atMostOneBindValueTo = childLogic.newLeaf({
      name: "atMostOneBindValueTo",
      componentType: "bindValueTo",
      comparison: "atMost",
      number: 1,
      takePropertyChildren: true,
    })

    childLogic.newOperator({
      name: "choicesAndBind",
      operator: "and",
      propositions: [atLeastZeroChoices, atMostOneBindValueTo],
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
          dependencyType: "child",
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
          dependencyType: "child",
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
        },
        variants: {
          dependencyType: "variants",
        },
      }),
      definition: function ({ dependencyValues }) {
        let numberChoices = dependencyValues.choiceChildren.length;
        let choiceOrder;
        if (dependencyValues.fixedOrder) {
          choiceOrder = [...Array(numberChoices).keys()]
        } else {

          // if desiredIndices is specfied, use those
          if (dependencyValues.variants && dependencyValues.variants.desiredVariant !== undefined) {
            let desiredChoiceOrder = dependencyValues.variants.desiredVariant.indices;
            if (desiredChoiceOrder !== undefined) {
              if (desiredChoiceOrder.length !== numberChoices) {
                console.warn("Ignoring indices specified for choiceinput as number of indices doesn't match number of choice children.")
              } else {
                desiredChoiceOrder = desiredChoiceOrder.map(Number);
                if (!desiredChoiceOrder.every(Number.isInteger)) {
                  throw Error("All indices specified for choiceinput must be integers");
                }
                if (!desiredChoiceOrder.every(x => x >= 0 && x < numberChoices)) {
                  console.warn("Ignoring indices specified for choiceinput as some indices out of range.")
                } else {

                  return {
                    // makeEssential: ["choiceOrder"],
                    newValues: {
                      choiceOrder: desiredChoiceOrder,
                    },
                  }
                }
              }
            }
          }


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


    stateVariableDefinitions.selectedVariantInfo = {
      additionalStateVariablesDefined: ["isVariantComponent"],
      returnDependencies: ({ componentInfoObjects }) => ({
        choiceOrder: {
          dependencyType: "stateVariable",
          variableName: "choiceOrder"
        },
        fixedOrder: {
          dependencyType: "stateVariable",
          variableName: "fixedOrder"
        },
        variantDescendants: {
          dependencyType: "descendant",
          componentTypes: Object.keys(componentInfoObjects.componentTypeWithPotentialVariants),
          variableNames: [
            "isVariantComponent",
            "selectedVariantInfo",
          ],
          useReplacementsForComposites: true,
          recurseToMatchedChildren: false,
          variablesOptional: true,
          includeNonActiveChildren: true,
          ignoreReplacementsOfMatchedComposites: true,
          definingChildrenFirst: true,
        }
      }),
      definition({ dependencyValues }) {

        if (dependencyValues.fixedOrder) {
          return {
            newValues: {
              isVariantComponent: false,
              selectedVariantInfo: null
            }
          }
        }

        let selectedVariantInfo = {
          indices: dependencyValues.choiceOrder
        };

        let subvariants = selectedVariantInfo.subvariants = [];

        for (let descendant of dependencyValues.variantDescendants) {
          if (descendant.stateValues.isVariantComponent) {
            subvariants.push(descendant.stateValues.selectedVariantInfo)
          } else if (descendant.stateValues.selectedVariantInfo) {
            subvariants.push(...descendant.stateValues.selectedVariantInfo.subvariants)
          }

        }
        return { newValues: { selectedVariantInfo, isVariantComponent: true } }

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
          dependencyType: "child",
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
            dependencyType: "child",
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

    stateVariableDefinitions.indexMatchedByBoundValue = {
      returnDependencies: () => ({
        choiceOrder: {
          dependencyType: "stateVariable",
          variableName: "choiceOrder"
        },
        choiceChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroChoices",
          variableNames: ["text"]
        },
        bindValueToChild: {
          dependencyType: "child",
          childLogicName: "atMostOneBindValueTo",
          variableNames: ["text"],
          requireChildLogicInitiallySatisfied: true,
        },
      }),
      definition({ dependencyValues }) {
        let choiceChildrenOrdered = dependencyValues.choiceOrder.map(i => dependencyValues.choiceChildren[i]);

        if (dependencyValues.bindValueToChild.length === 1) {
          let choiceTexts = choiceChildrenOrdered.map(x => x.stateValues.text.toLowerCase().trim())
          let bindValueToChild = dependencyValues.bindValueToChild[0];
          if (bindValueToChild.stateValues.text) {
            let ind = choiceTexts.indexOf(bindValueToChild.stateValues.text.toLowerCase().trim());
            if (ind !== -1) {
              return { newValues: { indexMatchedByBoundValue: ind + 1 } }
            }
          }
        }

        return { newValues: { indexMatchedByBoundValue: null } }
      }
    }


    // could just make selectedIndices and array with entireArrayAtOnce set
    // if get that working correctly with essential values
    stateVariableDefinitions.allSelectedIndices = {
      defaultValue: [],
      returnDependencies() {
        return {
          choiceOrder: {
            dependencyType: "stateVariable",
            variableName: "choiceOrder"
          },
          choiceChildren: {
            dependencyType: "child",
            childLogicName: "atLeastZeroChoices",
            variableNames: ["text"]
          },
          indexMatchedByBoundValue: {
            dependencyType: "stateVariable",
            variableName: "indexMatchedByBoundValue"
          },
          bindValueToChild: {
            dependencyType: "child",
            childLogicName: "atMostOneBindValueTo",
            variableNames: ["text"],
          },

        };
      },
      definition({ dependencyValues }) {
        if (dependencyValues.bindValueToChild.length === 1) {
          let allSelectedIndices;
          if (dependencyValues.indexMatchedByBoundValue !== null) {
            allSelectedIndices = [dependencyValues.indexMatchedByBoundValue];
          } else {
            allSelectedIndices = [];
          }
          return { newValues: { allSelectedIndices } }

        } else {
          return {
            useEssentialOrDefaultValue: {
              allSelectedIndices: { variablesToCheck: ["allSelectedIndices"] }
            }
          }
        }


      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {

        if (dependencyValues.bindValueToChild.length === 0) {
          return {
            success: true,
            instructions: [{
              setStateVariable: "allSelectedIndices",
              value: desiredStateVariableValues.allSelectedIndices
            }]
          }
        } else {
          let desiredText = "";
          if (desiredStateVariableValues.allSelectedIndices.length > 0) {
            let ind = desiredStateVariableValues.allSelectedIndices[0] - 1;
            let choiceChildrenOrdered = dependencyValues.choiceOrder.map(i => dependencyValues.choiceChildren[i]);
            let selectedChild = choiceChildrenOrdered[ind];
            if (selectedChild) {
              desiredText = selectedChild.stateValues.text;
            }
          }

          return {
            success: true,
            instructions: [{
              setDependency: "bindValueToChild",
              desiredValue: desiredText,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        }

      }
    }


    stateVariableDefinitions.nSelectedIndices = {
      returnDependencies: () => ({
        allSelectedIndices: {
          dependencyType: "stateVariable",
          variableName: "allSelectedIndices"
        },
      }),
      definition({ dependencyValues }) {
        return { newValues: { nSelectedIndices: dependencyValues.allSelectedIndices.length } }
      },
    }


    stateVariableDefinitions.selectedIndices = {
      public: true,
      componentType: "number",
      isArray: true,
      entryPrefixes: ["selectedIndex"],
      forRenderer: true,
      defaultEntryValue: 0,
      returnArraySizeDependencies: () => ({
        nSelectedIndices: {
          dependencyType: "stateVariable",
          variableName: "nSelectedIndices",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nSelectedIndices];
      },
      returnArrayDependenciesByKey() {
        return {
          globalDependencies: {
            allSelectedIndices: {
              dependencyType: "stateVariable",
              variableName: "allSelectedIndices"
            },
          }
        };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {

        let selectedIndices = {};
        for (let key in globalDependencyValues.allSelectedIndices) {
          selectedIndices[key] = globalDependencyValues.allSelectedIndices[key]
        }
        return { newValues: { selectedIndices } }

      },
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
      returnArraySizeDependencies: () => ({
        nSelectedIndices: {
          dependencyType: "stateVariable",
          variableName: "nSelectedIndices",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nSelectedIndices];
      },
      returnArrayDependenciesByKey() {
        return {
          globalDependencies: {
            selectedIndices: {
              dependencyType: "stateVariable",
              variableName: "selectedIndices"
            },
            choiceTexts: {
              dependencyType: "stateVariable",
              variableName: "choiceTexts"
            }
          }
        };
      },
      arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
        let selectedValues = {};

        for (let arrayKey in arrayKeys) {
          selectedValues[arrayKey] = globalDependencyValues.choiceTexts[
            globalDependencyValues.selectedIndices[arrayKey] - 1
          ]
        }

        return { newValues: { selectedValues } }

      },
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
      isAlias: true,
      targetVariableName: "nSelectedIndices"
    };

    stateVariableDefinitions.childIndicesSelected = {
      returnDependencies: () => ({
        selectedIndices: {
          dependencyType: "stateVariable",
          variableName: "selectedIndices"
        },
        choiceOrder: {
          dependencyType: "stateVariable",
          variableName: "choiceOrder"
        },
      }),
      definition({ dependencyValues }) {
        let childIndicesSelected = dependencyValues.selectedIndices.map(
          x => dependencyValues.choiceOrder[x - 1]
        )

        return { newValues: { childIndicesSelected } }
      }
    }

    stateVariableDefinitions.creditAchievedIfSubmit = {
      returnDependencies: () => ({
        choiceChildren: {
          dependencyType: "child",
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
          dependencyType: "child",
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
          dependencyType: "child",
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
      this.coreFunctions.requestUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "allSelectedIndices",
          value: selectedIndices
        }],
        event: {
          verb: "selected",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            response: selectedIndices,
            responseText: selectedIndices
              .map(i => this.stateValues.choiceTexts[i - 1])
          }
        }
      })
    }
  }

}
