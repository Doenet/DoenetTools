import Input from './abstract/Input';
import { deepCompare } from '../utils/deepFunctions';
import { enumerateCombinations, enumeratePermutations } from '../utils/enumeration';
import { setUpVariantSeedAndRng } from '../utils/variants';

export default class Choiceinput extends Input {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      updateSelectedIndices: this.updateSelectedIndices.bind(this),
    });

    this.externalActions = {};

    //Complex because the stateValues isn't defined until later
    Object.defineProperty(this.externalActions, 'submitAnswer', {
      enumerable: true,
      get: async function () {
        let answerAncestor = await this.stateValues.answerAncestor;
        if (answerAncestor !== null) {
          return {
            componentName: answerAncestor.componentName,
            actionName: "submitAnswer"
          }
        } else {
          return;
        }
      }.bind(this)
    });

  }

  static componentType = "choiceInput";

  static renderChildren = true;

  static variableForPlainMacro = "values";
  static variableForPlainCopy = "values";

  static createsVariants = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.selectMultiple = {
      createComponentOfType: "boolean",
      createStateVariable: "selectMultiple",
      defaultValue: false,
      public: true,
      forRenderer: true,
      fallBackToParentStateVariable: "selectMultiple",
    };
    attributes.matchPartial = {
      createComponentOfType: "boolean",
      createStateVariable: "matchPartial",
      defaultValue: false,
      public: true,
      fallBackToParentStateVariable: "matchPartial",
    };
    attributes.inline = {
      createComponentOfType: "boolean",
    };
    attributes.shuffleOrder = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "shuffleOrder",
      defaultValue: false,
      public: true,
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

    attributes.submitLabel = {
      createComponentOfType: "text",
      createStateVariable: "submitLabel",
      defaultValue: "Check Work",
      public: true,
      forRenderer: true,
      fallBackToParentStateVariable: "submitLabel",
    }

    attributes.submitLabelNoCorrectness = {
      createComponentOfType: "text",
      createStateVariable: "submitLabelNoCorrectness",
      defaultValue: "Submit Response",
      public: true,
      forRenderer: true,
      fallBackToParentStateVariable: "submitLabelNoCorrectness",
    }

    return attributes;
  }


  static returnChildGroups() {

    return [{
      group: "choices",
      componentTypes: ["choice"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.inline = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      forRenderer: true,
      defaultValue: false,
      hasEssential: true,
      returnDependencies: () => ({
        inlineAttr: {
          dependencyType: "attributeComponent",
          attributeName: "inline",
          variableNames: ["value"]
        },
        parentInline: {
          dependencyType: "parentStateVariable",
          variableName: "inline"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.inlineAttr) {
          return { setValue: { inline: dependencyValues.inlineAttr.stateValues.value } }
        } else if (dependencyValues.parentInline !== null) {
          return { setValue: { inline: dependencyValues.parentInline } }
        } else {
          return { useEssentialOrDefaultValue: { inline: {} } }
        }
      }
    }

    stateVariableDefinitions.numberChoices = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        choiceChildren: {
          dependencyType: "child",
          childGroups: ["choices"],
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { numberChoices: dependencyValues.choiceChildren.length } }
      }
    }

    stateVariableDefinitions.choiceOrder = {
      forRenderer: true,
      shadowVariable: true,
      returnDependencies: ({ sharedParameters }) => ({
        choiceChildren: {
          dependencyType: "child",
          childGroups: ["choices"],
          variableNames: ["text"]
        },
        shuffleOrder: {
          dependencyType: "stateVariable",
          variableName: "shuffleOrder"
        },
        variantSeed: {
          dependencyType: "value",
          value: sharedParameters.variantSeed
        },
        rngClass: {
          dependencyType: "value",
          value: sharedParameters.rngClass,
          doNotProxy: true
        },
        variants: {
          dependencyType: "variants",
        },
      }),
      definition: function ({ dependencyValues }) {
        let numberChoices = dependencyValues.choiceChildren.length;
        let choiceOrder;
        if (!dependencyValues.shuffleOrder) {
          choiceOrder = [...Array(numberChoices).keys()].map(x => x + 1)
        } else {

          // if desiredIndices is specfied, use those
          let desiredChoiceOrder = dependencyValues.variants?.desiredVariant?.indices;
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
                  setValue: {
                    choiceOrder: desiredChoiceOrder,
                  },
                }
              }
            }
          }

          let variantRng = dependencyValues.rngClass(dependencyValues.variantSeed + "co");

          // shuffle order every time get new children
          // https://stackoverflow.com/a/12646864
          choiceOrder = [...Array(numberChoices).keys()].map(x => x + 1)
          for (let i = numberChoices - 1; i > 0; i--) {
            const rand = variantRng();
            const j = Math.floor(rand * (i + 1));
            [choiceOrder[i], choiceOrder[j]] = [choiceOrder[j], choiceOrder[i]];
          }
        }
        return { setValue: { choiceOrder } }
      }
    }


    stateVariableDefinitions.generatedVariantInfo = {
      additionalStateVariablesDefined: ["isVariantComponent"],
      returnDependencies: ({ componentInfoObjects, sharedParameters }) => ({
        variantSeed: {
          dependencyType: "value",
          value: sharedParameters.variantSeed,
        },
        choiceOrder: {
          dependencyType: "stateVariable",
          variableName: "choiceOrder"
        },
        shuffleOrder: {
          dependencyType: "stateVariable",
          variableName: "shuffleOrder"
        },
        variantDescendants: {
          dependencyType: "descendant",
          componentTypes: Object.keys(componentInfoObjects.componentTypesCreatingVariants),
          variableNames: [
            "isVariantComponent",
            "generatedVariantInfo",
          ],
          useReplacementsForComposites: true,
          recurseToMatchedChildren: false,
          variablesOptional: true,
          includeNonActiveChildren: true,
          ignoreReplacementsOfEncounteredComposites: true,
        }
      }),
      definition({ dependencyValues, componentName }) {

        let generatedVariantInfo = {
          seed: dependencyValues.variantSeed,
          meta: { createdBy: componentName }
        };

        if (dependencyValues.shuffleOrder) {
          generatedVariantInfo.indices = dependencyValues.choiceOrder;
        }

        let subvariants = generatedVariantInfo.subvariants = [];

        for (let descendant of dependencyValues.variantDescendants) {
          if (descendant.stateValues.isVariantComponent) {
            subvariants.push(descendant.stateValues.generatedVariantInfo)
          } else if (descendant.stateValues.generatedVariantInfo) {
            subvariants.push(...descendant.stateValues.generatedVariantInfo.subvariants)
          }

        }
        return { setValue: { generatedVariantInfo, isVariantComponent: true } }

      }
    }


    stateVariableDefinitions.choiceChildrenOrdered = {
      additionalStateVariablesDefined: [
        {
          variableName: "numberChoices",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "number"
          }
        },
      ],
      returnDependencies: () => ({
        choiceOrder: {
          dependencyType: "stateVariable",
          variableName: "choiceOrder"
        },
        choiceChildren: {
          dependencyType: "child",
          childGroups: ["choices"],
          // variableNames: ["text", "selected", "submitted", "credit"]
        },
      }),
      definition: function ({ dependencyValues }) {

        let numberChoices = dependencyValues.choiceChildren.length;
        let choiceChildrenOrdered = dependencyValues.choiceOrder.map(i => dependencyValues.choiceChildren[i - 1]);

        return {
          setValue: {
            choiceChildrenOrdered, numberChoices
          }
        }
      },
    }

    stateVariableDefinitions.choiceTexts = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
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
            childGroups: ["choices"],
            variableNames: ["text"]
          },
        };

        return { globalDependencies }
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        let choiceChildrenOrdered = globalDependencyValues.choiceOrder.map(
          i => globalDependencyValues.choiceChildren[i - 1]
        );

        return {
          setValue: {
            choiceTexts: choiceChildrenOrdered.map(x => x.stateValues.text),
          }
        }
      }

    }

    stateVariableDefinitions.choiceMaths = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
      },
      isArray: true,
      entryPrefixes: ["choiceMath"],
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
            childGroups: ["choices"],
            variableNames: ["math"]
          },
        };

        return { globalDependencies }
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        let choiceChildrenOrdered = globalDependencyValues.choiceOrder.map(
          i => globalDependencyValues.choiceChildren[i - 1]
        );

        return {
          setValue: {
            choiceMaths: choiceChildrenOrdered.map(x => x.stateValues.math),
          }
        }
      }

    }

    stateVariableDefinitions.choicePreselects = {
      isArray: true,
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
            childGroups: ["choices"],
            variableNames: ["preSelect"]
          },
        };

        return { globalDependencies }
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        let choiceChildrenOrdered = globalDependencyValues.choiceOrder.map(
          i => globalDependencyValues.choiceChildren[i - 1]
        );

        return {
          setValue: {
            choicePreselects: choiceChildrenOrdered.map(x => x.stateValues.preSelect),
          }
        }
      }

    }

    stateVariableDefinitions.choicesDisabled = {
      isArray: true,
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
            childGroups: ["choices"],
            variableNames: ["disabled"]
          },
        };

        return { globalDependencies }
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        let choiceChildrenOrdered = globalDependencyValues.choiceOrder.map(
          i => globalDependencyValues.choiceChildren[i - 1]
        );

        return {
          setValue: {
            choicesDisabled: choiceChildrenOrdered.map(x => x.stateValues.disabled),
          }
        }
      }

    }

    stateVariableDefinitions.choicesHidden = {
      isArray: true,
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
            childGroups: ["choices"],
            variableNames: ["hidden"]
          },
        };

        return { globalDependencies }
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        let choiceChildrenOrdered = globalDependencyValues.choiceOrder.map(
          i => globalDependencyValues.choiceChildren[i - 1]
        );

        return {
          setValue: {
            choicesHidden: choiceChildrenOrdered.map(x => x.stateValues.hidden),
          }
        }
      }

    }

    stateVariableDefinitions.componentType = {
      returnDependencies: () => ({
        choiceChildren: {
          dependencyType: "child",
          childGroups: ["choices"],
          variableNames: ["math"]
        },
      }),
      definition({ dependencyValues }) {
        let componentType = "text";
        if (dependencyValues.choiceChildren.length > 0 && dependencyValues.choiceChildren.every(x => x.stateValues.math)) {
          componentType = "math";
        }
        return { setValue: { componentType } };
      }
    }

    stateVariableDefinitions.indicesMatchedByBoundValue = {
      returnDependencies: () => ({
        choiceOrder: {
          dependencyType: "stateVariable",
          variableName: "choiceOrder"
        },
        choiceChildren: {
          dependencyType: "child",
          childGroups: ["choices"],
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
              return { setValue: { indicesMatchedByBoundValue } }
            } else {
              let ind = choiceTexts.indexOf(dependencyValues.bindValueTo.stateValues.value.toLowerCase().trim());
              if (ind !== -1) {
                return { setValue: { indicesMatchedByBoundValue: [ind + 1] } }
              }
            }

          }
        }

        return { setValue: { indicesMatchedByBoundValue: [] } }
      }
    }


    stateVariableDefinitions.allSelectedIndices = {
      hasEssential: true,
      returnDependencies() {
        return {
          choiceOrder: {
            dependencyType: "stateVariable",
            variableName: "choiceOrder"
          },
          choiceChildren: {
            dependencyType: "child",
            childGroups: ["choices"],
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
          return { setValue: { allSelectedIndices: dependencyValues.indicesMatchedByBoundValue } }
        } else {
          return {
            useEssentialOrDefaultValue: {
              allSelectedIndices: {
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
              setEssentialValue: "allSelectedIndices",
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
        return { setValue: { nSelectedIndices: dependencyValues.allSelectedIndices.length } }
      },
    }


    stateVariableDefinitions.selectedIndices = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      isArray: true,
      entryPrefixes: ["selectedIndex"],
      forRenderer: true,
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
        return { setValue: { selectedIndices } }

      },
    }



    stateVariableDefinitions.selectedIndex = {
      isAlias: true,
      targetVariableName: "selectedIndex1"
    };


    stateVariableDefinitions.selectedValues = {
      public: true,
      shadowingInstructions: {
        hasVariableComponentType: true,
      },
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
            },
            choiceMaths: {
              dependencyType: "stateVariable",
              variableName: "choiceMaths"
            },
            componentType: {
              dependencyType: "stateVariable",
              variableName: "componentType"
            },
          }
        };
      },
      arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
        let selectedValues = {};
        let componentType = globalDependencyValues.componentType;


        for (let arrayKey of arrayKeys) {
          if (componentType === "math") {
            selectedValues[arrayKey] = globalDependencyValues.choiceMaths[
              globalDependencyValues.selectedIndices[arrayKey] - 1
            ]
          } else {
            selectedValues[arrayKey] = globalDependencyValues.choiceTexts[
              globalDependencyValues.selectedIndices[arrayKey] - 1
            ]
          }
        }

        return {
          setValue: { selectedValues },
          setCreateComponentOfType: { selectedValues: componentType },
        }

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

        return { setValue: { childIndicesSelected } }
      }
    }

    stateVariableDefinitions.creditAchievedIfSubmit = {
      returnDependencies: () => ({
        choiceChildren: {
          dependencyType: "child",
          childGroups: ["choices"],
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

        return { setValue: { creditAchievedIfSubmit } }
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
          childGroups: ["choices"],
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

        return { setValue: { submittedIndices } }
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
          childGroups: ["choices"],
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
          setValue: {
            allFeedbacks: feedbacks
          }
        }
      }
    }

    stateVariableDefinitions.numberFeedbacks = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        allFeedbacks: {
          dependencyType: "stateVariable",
          variableName: "allFeedbacks"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { numberFeedbacks: dependencyValues.allFeedbacks.length },
          checkForActualChange: { numberFeedbacks: true }
        }
      }
    }

    stateVariableDefinitions.feedbacks = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "feedback",
      },
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

        return { setValue: { feedbacks } }
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
    //       return { setValue: { childrenToRender: [] } }
    //     } else {
    //       return {
    //         setValue: {
    //           childrenToRender: dependencyValues.choiceChildrenOrdered.map(x => x.componentName)
    //         }
    //       }
    //     }
    //   }
    // }


    return stateVariableDefinitions;

  }

  async updateSelectedIndices({ selectedIndices, actionId, sourceInformation = {}, skipRendererUpdate = false }) {
    if (!await this.stateValues.disabled) {
      let updateInstructions = [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "allSelectedIndices",
        value: selectedIndices,
      }];

      let choiceTexts = await this.stateValues.choiceTexts;
      let event = {
        verb: "selected",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: selectedIndices,
          responseText: selectedIndices
            .map(i => choiceTexts[i - 1])
        }
      }

      let answerAncestor = await this.stateValues.answerAncestor;
      if (answerAncestor) {
        event.context = {
          answerAncestor: answerAncestor.componentName
        }
      }


      await this.coreFunctions.performUpdate({
        updateInstructions,
        actionId,
        sourceInformation,
        skipRendererUpdate: true,
        event,
      });

      return await this.coreFunctions.triggerChainedActions({
        componentName: this.componentName,
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });

    } else {
      this.coreFunctions.resolveAction({ actionId });
    }
  }

  static setUpVariant({
    serializedComponent, sharedParameters,
    descendantVariantComponents,
  }) {

    setUpVariantSeedAndRng({
      serializedComponent, sharedParameters,
      descendantVariantComponents
    });

  }


  static determineNumberOfUniqueVariants({
    serializedComponent, componentInfoObjects
  }) {


    if (!serializedComponent.attributes?.shuffleOrder?.primitive) {
      return super.determineNumberOfUniqueVariants({
        serializedComponent, componentInfoObjects
      });
    }

    let numberOfChoices = 0;

    for (let child of serializedComponent.children) {
      if (child.componentType === "choice") {
        numberOfChoices++;
      } else {
        if (componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: child.componentType,
          baseComponentType: "_composite"
        })
          && child.attributes.createComponentOfType?.primitive === "choice"
        ) {
          if (child.attributes.nComponents?.primitive !== undefined) {
            let newChoices = Number(child.attributes.nComponents?.primitive);
            if (Number.isInteger(newChoices) && newChoices >= 0) {
              numberOfChoices += newChoices;
            } else {
              return { success: false }
            }
          } else {
            numberOfChoices++;
          }

        } else {
          return { success: false }
        }

      }
    }

    let numberOfPermutations = 1;
    for (let i = 2; i <= numberOfChoices; i++) {
      numberOfPermutations *= i;
    }

    let result = super.determineNumberOfUniqueVariants({
      serializedComponent, componentInfoObjects
    });

    if (!result.success) {
      return { success: false }
    }

    let numberOfVariants = result.numberOfVariants * numberOfPermutations;

    // adjust variants info added by call to super
    serializedComponent.variants.numberOfVariants = numberOfVariants;
    serializedComponent.variants.uniqueVariantData = {
      numberOfVariantsByDescendant: serializedComponent.variants.uniqueVariantData.numberOfVariantsByDescendant,
      numberOfPermutations,
      numberOfChoices
    };

    return { success: true, numberOfVariants }

  }


  static getUniqueVariant({ serializedComponent, variantIndex, componentInfoObjects }) {

    let numberOfVariants = serializedComponent.variants?.numberOfVariants;
    if (numberOfVariants === undefined) {
      return { success: false }
    }

    if (!Number.isInteger(variantIndex) || variantIndex < 1 || variantIndex > numberOfVariants) {
      return { success: false }
    }


    if (!serializedComponent.attributes.shuffleOrder?.primitive) {
      return super.getUniqueVariant({ serializedComponent, variantIndex, componentInfoObjects });
    }


    let numberOfVariantsByDescendant = serializedComponent.variants.uniqueVariantData.numberOfVariantsByDescendant;
    let descendantVariantComponents = serializedComponent.variants.descendantVariantComponents;
    let numberOfPermutations = serializedComponent.variants.uniqueVariantData.numberOfPermutations;
    let numberOfChoices = serializedComponent.variants.uniqueVariantData.numberOfChoices;

    // treat permutations as another descendant variant component
    let numbersOfOptions = [...numberOfVariantsByDescendant];
    numbersOfOptions.push(numberOfPermutations);

    let indicesForEachOption = enumerateCombinations({
      numberOfOptionsByIndex: numbersOfOptions,
      maxNumber: variantIndex,
    })[variantIndex - 1].map(x => x + 1);

    let permutationsIndex = indicesForEachOption.pop();

    let indicesForEachDescendant = indicesForEachOption;


    // choice a permutation based on permutations index
    let indicesToPermute = [...Array(numberOfChoices).keys()].map(x => x + 1);

    let permutedIndices = enumeratePermutations({
      values: indicesToPermute,
      maxNumber: permutationsIndex,
    })[permutationsIndex - 1]


    // for each descendant, get unique variant corresponding
    // to the selected variant number and include that as a subvariant

    let haveNontrivialSubvariants = false;
    let subvariants = [];


    for (let descendantNum = 0; descendantNum < numberOfVariantsByDescendant.length; descendantNum++) {
      if (numberOfVariantsByDescendant[descendantNum] > 1) {
        let descendant = descendantVariantComponents[descendantNum];
        let compClass = componentInfoObjects.allComponentClasses[descendant.componentType];
        let result = compClass.getUniqueVariant({
          serializedComponent: descendant,
          variantIndex: indicesForEachDescendant[descendantNum],
          componentInfoObjects,
        });
        if (!result.success) {
          return { success: false }
        }
        subvariants.push(result.desiredVariant);
        haveNontrivialSubvariants = true;
      } else {
        subvariants.push({});
      }
    }


    let desiredVariant = { indices: permutedIndices };
    if (haveNontrivialSubvariants) {
      desiredVariant.subvariants = subvariants;
    }

    return { success: true, desiredVariant }


  }


}

