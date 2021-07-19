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
          return () => this.coreFunctions.requestAction({
            componentName: this.stateValues.answerAncestor.componentName,
            actionName: "submitAnswer"
          })
        } else {
          return () => null
        }
      }.bind(this)
    });

  }

  static componentType = "choiceInput";

  static renderChildren = true;

  static variableForPlainMacro = "values";

  static createsVariants = true;

  // used when referencing this component without prop
  static get stateVariablesShadowedForReference() {
    return [
      "choiceOrder", "allSelectedIndices", "indicesMatchedByBoundValue"
    ]
  };

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.selectMultiple = {
      createComponentOfType: "boolean",
      createStateVariable: "selectMultiple",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };
    attributes.matchPartial = {
      createComponentOfType: "boolean",
      createStateVariable: "matchPartial",
      defaultValue: false,
      public: true,
    };
    attributes.inline = {
      createComponentOfType: "boolean",
      createStateVariable: "inline",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };
    attributes.randomizeOrder = {
      createComponentOfType: "boolean",
      createStateVariable: "randomizeOrder",
      defaultValue: false,
      public: true,
    };
    attributes.feedbackDefinitions = {
      createComponentOfType: "feedbackDefinitions",
      createStateVariable: "feedbackDefinitions",
      public: true,
      propagateToDescendants: true,
      mergeArrays: true
    };

    attributes.preselectChoice = {
      createComponentOfType: "number",
      createStateVariable: "preselectChoice",
      defaultValue: null,
    }

    attributes.bindValueTo = {
      createComponentOfType: "text"
    };

    attributes.placeHolder = {
      createComponentOfType: "text",
      createStateVariable: "placeHolder",
      defaultValue: "",
      forRenderer: true,
    }

    return attributes;
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
          dependencyType: "child",
          childLogicName: "atLeastZeroChoices",
        },
      }),
      definition({ dependencyValues }) {
        return { newValues: { numberChoices: dependencyValues.choiceChildren.length } }
      }
    }

    stateVariableDefinitions.choiceOrder = {
      forRenderer: true,
      returnDependencies: ({ sharedParameters }) => ({
        choiceChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroChoices",
          variableNames: ["text"]
        },
        randomizeOrder: {
          dependencyType: "stateVariable",
          variableName: "randomizeOrder"
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
        if (!dependencyValues.randomizeOrder) {
          choiceOrder = [...Array(numberChoices).keys()].map(x => x + 1)
        } else {

          // if desiredIndices is specfied, use those
          if (dependencyValues.variants && dependencyValues.variants.desiredVariant !== undefined) {
            let desiredChoiceOrder = dependencyValues.variants.desiredVariant.indices;
            if (desiredChoiceOrder !== undefined) {
              if (desiredChoiceOrder.length !== numberChoices) {
                console.warn("Ignoring indices specified for choiceInput as number of indices doesn't match number of choice children.")
              } else {
                desiredChoiceOrder = desiredChoiceOrder.map(Number);
                if (!desiredChoiceOrder.every(Number.isInteger)) {
                  throw Error("All indices specified for choiceInput must be integers");
                }
                if (!desiredChoiceOrder.every(x => x >= 1 && x <= numberChoices)) {
                  console.warn("Ignoring indices specified for choiceInput as some indices out of range.")
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
          choiceOrder = [...Array(numberChoices).keys()].map(x => x + 1)
          for (let i = numberChoices - 1; i > 0; i--) {
            const rand = dependencyValues.selectRng();
            const j = Math.floor(rand * (i + 1));
            [choiceOrder[i], choiceOrder[j]] = [choiceOrder[j], choiceOrder[i]];
          }
        }
        return { newValues: { choiceOrder } }
      }
    }


    stateVariableDefinitions.generatedVariantInfo = {
      additionalStateVariablesDefined: ["isVariantComponent"],
      returnDependencies: ({ componentInfoObjects }) => ({
        choiceOrder: {
          dependencyType: "stateVariable",
          variableName: "choiceOrder"
        },
        randomizeOrder: {
          dependencyType: "stateVariable",
          variableName: "randomizeOrder"
        },
        variantDescendants: {
          dependencyType: "descendant",
          componentTypes: Object.keys(componentInfoObjects.componentTypeWithPotentialVariants),
          variableNames: [
            "isVariantComponent",
            "generatedVariantInfo",
          ],
          useReplacementsForComposites: true,
          recurseToMatchedChildren: false,
          variablesOptional: true,
          includeNonActiveChildren: true,
          ignoreReplacementsOfMatchedComposites: true,
          definingChildrenFirst: true,
        }
      }),
      definition({ dependencyValues, componentName }) {

        if (!dependencyValues.randomizeOrder) {
          return {
            newValues: {
              isVariantComponent: false,
              generatedVariantInfo: null
            }
          }
        }

        let generatedVariantInfo = {
          indices: dependencyValues.choiceOrder,
          meta: { createdBy: componentName }
        };

        let subvariants = generatedVariantInfo.subvariants = [];

        for (let descendant of dependencyValues.variantDescendants) {
          if (descendant.stateValues.isVariantComponent) {
            subvariants.push(descendant.stateValues.generatedVariantInfo)
          } else if (descendant.stateValues.generatedVariantInfo) {
            subvariants.push(...descendant.stateValues.generatedVariantInfo.subvariants)
          }

        }
        return { newValues: { generatedVariantInfo, isVariantComponent: true } }

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
        let choiceChildrenOrdered = dependencyValues.choiceOrder.map(i => dependencyValues.choiceChildren[i - 1]);

        return {
          newValues: {
            choiceChildrenOrdered, numberChoices
          }
        }
      },
    }

    stateVariableDefinitions.choiceTexts = {
      additionalStateVariablesDefined: [{
        variableName: "choicePreselects",
        isArray: true,
      }, {
        variableName: "choicesDisabled",
        isArray: true,
        forRenderer: true,
      }, {
        variableName: "choicesHidden",
        isArray: true,
        forRenderer: true,
      }],
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
            variableNames: ["text", "preSelect", "disabled", "hidden"]
          },
        };

        return { globalDependencies }
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        let choiceChildrenOrdered = globalDependencyValues.choiceOrder.map(
          i => globalDependencyValues.choiceChildren[i - 1]
        );

        return {
          newValues: {
            choiceTexts: choiceChildrenOrdered.map(x => x.stateValues.text),
            choicePreselects: choiceChildrenOrdered.map(x => x.stateValues.preSelect),
            choicesDisabled: choiceChildrenOrdered.map(x => x.stateValues.disabled),
            choicesHidden: choiceChildrenOrdered.map(x => x.stateValues.hidden),
          }
        }
      }

    }

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { componentType: "text" } })
    }

    stateVariableDefinitions.indicesMatchedByBoundValue = {
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
        bindValueTo: {
          dependencyType: "attributeComponent",
          attributeName: "bindValueTo",
          variableNames: ["value"],
        },
        selectMultiple: {
          dependencyType: "stateVariable",
          variableName: "selectMultiple"
        },
      }),
      definition({ dependencyValues }) {
        let choiceChildrenOrdered = dependencyValues.choiceOrder.map(i => dependencyValues.choiceChildren[i - 1]);

        if (dependencyValues.bindValueTo !== null) {
          let choiceTexts = choiceChildrenOrdered.map(x => x.stateValues.text.toLowerCase().trim())
          if (dependencyValues.bindValueTo.stateValues.value) {
            if (dependencyValues.selectMultiple) {
              let valuesToBind = dependencyValues.bindValueTo.stateValues.value.toLowerCase()
                .split(",").map(x => x.trim());
              let indicesMatchedByBoundValue = [];
              for (let val of valuesToBind) {
                let ind = choiceTexts.indexOf(val);
                if (ind !== -1 && !indicesMatchedByBoundValue.includes(ind + 1)) {
                  indicesMatchedByBoundValue.push(ind + 1);
                }
              }
              indicesMatchedByBoundValue.sort((a, b) => a - b);
              return { newValues: { indicesMatchedByBoundValue } }
            } else {
              let ind = choiceTexts.indexOf(dependencyValues.bindValueTo.stateValues.value.toLowerCase().trim());
              if (ind !== -1) {
                return { newValues: { indicesMatchedByBoundValue: [ind + 1] } }
              }
            }

          }
        }

        return { newValues: { indicesMatchedByBoundValue: [] } }
      }
    }


    stateVariableDefinitions.allSelectedIndices = {
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
          indicesMatchedByBoundValue: {
            dependencyType: "stateVariable",
            variableName: "indicesMatchedByBoundValue"
          },
          preselectChoice: {
            dependencyType: "stateVariable",
            variableName: "preselectChoice"
          },
          choicePreselects: {
            dependencyType: "stateVariable",
            variableName: "choicePreselects"
          },
          bindValueTo: {
            dependencyType: "attributeComponent",
            attributeName: "bindValueTo",
            variableNames: ["value"],
          },

        };
      },
      definition({ dependencyValues }) {
        if (dependencyValues.bindValueTo !== null) {
          return { newValues: { allSelectedIndices: dependencyValues.indicesMatchedByBoundValue } }
        } else {
          return {
            useEssentialOrDefaultValue: {
              allSelectedIndices: {
                variablesToCheck: ["allSelectedIndices"],
                get defaultValue() {
                  let ind = dependencyValues.choicePreselects.indexOf(true);
                  if (ind !== -1) {
                    return [ind + 1];
                  } else if (dependencyValues.preselectChoice !== null) {
                    return [dependencyValues.preselectChoice];
                  } else {
                    return [];
                  }
                }
              }
            }
          }
        }


      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {

        if (dependencyValues.bindValueTo === null) {
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
            let choiceChildrenOrdered = dependencyValues.choiceOrder.map(i => dependencyValues.choiceChildren[i - 1]);
            let selectedTexts = [];
            for (let ind of desiredStateVariableValues.allSelectedIndices) {
              let selectedChild = choiceChildrenOrdered[ind - 1];
              if (selectedChild) {
                selectedTexts.push(selectedChild.stateValues.text)
              }
            }
            desiredText = selectedTexts.join(", ");
          }

          return {
            success: true,
            instructions: [{
              setDependency: "bindValueTo",
              desiredValue: desiredText,
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

        for (let arrayKey of arrayKeys) {
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
        matchPartial: {
          dependencyType: "stateVariable",
          variableName: "matchPartial"
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
          if (dependencyValues.matchPartial) {
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
        let choiceChildrenOrdered = dependencyValues.choiceOrder.map(i => dependencyValues.choiceChildren[i - 1]);

        for (let [ind, choiceChild] of choiceChildrenOrdered.entries()) {
          if (choiceChild.stateValues.submitted) {
            submittedIndices.push(ind + 1)
          }
        }

        return { newValues: { submittedIndices } }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {

        let instructions = [];

        for (let [ind, choiceInd] of dependencyValues.choiceOrder.entries()) {
          instructions.push({
            setDependency: "choiceChildren",
            desiredValue: desiredStateVariableValues.submittedIndices.includes(ind + 1),
            variableIndex: 0,
            childIndex: choiceInd - 1
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

    stateVariableDefinitions.allFeedbacks = {
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
      definition({ dependencyValues }) {

        let choiceChildrenOrdered = dependencyValues.choiceOrder.map(i => dependencyValues.choiceChildren[i - 1]);

        let feedbacks = [];

        for (let choiceChild of choiceChildrenOrdered) {
          feedbacks.push(...choiceChild.stateValues.feedbacks);
        }
        return {
          newValues: {
            allFeedbacks: feedbacks
          }
        }
      }
    }

    stateVariableDefinitions.numberFeedbacks = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        allFeedbacks: {
          dependencyType: "stateVariable",
          variableName: "allFeedbacks"
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: { numberFeedbacks: dependencyValues.allFeedbacks.length },
          checkForActualChange: { numberFeedbacks: true }
        }
      }
    }

    stateVariableDefinitions.feedbacks = {
      public: true,
      componentType: "feedback",
      isArray: true,
      entryPrefixes: ["feedback"],
      returnArraySizeDependencies: () => ({
        numberFeedbacks: {
          dependencyType: "stateVariable",
          variableName: "numberFeedbacks",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numberFeedbacks];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allFeedbacks: {
            dependencyType: "stateVariable",
            variableName: "allFeedbacks"
          }
        }

        return { globalDependencies }

      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function feedbacks`)
        // console.log(globalDependencyValues)

        let feedbacks = {};

        for (let arrayKey = 0; arrayKey < globalDependencyValues.__array_size; arrayKey++) {
          feedbacks[arrayKey] = globalDependencyValues.allFeedbacks[arrayKey];
        }

        return { newValues: { feedbacks } }
      }

    }


    // stateVariableDefinitions.childrenToRender = {
    //   returnDependencies: () => ({
    //     choiceChildrenOrdered: {
    //       dependencyType: "stateVariable",
    //       variableName: "choiceChildrenOrdered"
    //     },
    //     inline: {
    //       dependencyType: "stateVariable",
    //       variableName: "inline"
    //     }
    //   }),
    //   definition: function ({ dependencyValues }) {
    //     if (dependencyValues.inline) {
    //       return { newValues: { childrenToRender: [] } }
    //     } else {
    //       return {
    //         newValues: {
    //           childrenToRender: dependencyValues.choiceChildrenOrdered.map(x => x.componentName)
    //         }
    //       }
    //     }
    //   }
    // }


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
