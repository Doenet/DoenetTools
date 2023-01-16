import BaseComponent from './abstract/BaseComponent';
import { determineVariantsForSection, getVariantsForDescendantsForUniqueVariants } from '../utils/variants';
import { returnStyleDefinitionStateVariables } from '../utils/style';
import { returnFeedbackDefinitionStateVariables } from '../utils/feedback';

export default class Document extends BaseComponent {
  static componentType = "document";
  static rendererType = "section";
  static renderChildren = true;

  static createsVariants = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    delete attributes.hide;
    delete attributes.disabled;
    delete attributes.modifyIndirectly;
    delete attributes.fixed;
    delete attributes.styleNumber;
    delete attributes.isResponse;

    attributes.documentWideCheckWork = {
      createComponentOfType: "boolean",
      createStateVariable: "documentWideCheckWork",
      defaultValue: false,
      public: true,
    };
    attributes.submitLabel = {
      createComponentOfType: "text",
      createStateVariable: "submitLabel",
      defaultValue: "Check Work",
      public: true,
      forRenderer: true,
    }
    attributes.submitLabelNoCorrectness = {
      createComponentOfType: "text",
      createStateVariable: "submitLabelNoCorrectness",
      defaultValue: "Submit Response",
      public: true,
      forRenderer: true,
    }

    attributes.displayDigitsForCreditAchieved = {
      createComponentOfType: "integer",
      createStateVariable: "displayDigitsForCreditAchieved",
      defaultValue: 3,
      public: true
    }

    // at this point, we are creating these attributes
    // so that having them in the doenetML is valid
    // Do we want to do something with these attributes?
    attributes.xmlns = {
      createPrimitiveOfType: "string"
    }
    attributes.type = {
      createPrimitiveOfType: "string"
    }

    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "variantControl",
      componentTypes: ["variantControl"]
    }, {
      group: "title",
      componentTypes: ["title"]
    }, {
      group: "description",
      componentTypes: ["description"]
    }, {
      group: "setups",
      componentTypes: ["setup"],
    }, {
      group: "anything",
      componentTypes: ["_base"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let styleDefinitionStateVariables = returnStyleDefinitionStateVariables();
    Object.assign(stateVariableDefinitions, styleDefinitionStateVariables);

    let feedbackDefinitionStateVariables = returnFeedbackDefinitionStateVariables();
    Object.assign(stateVariableDefinitions, feedbackDefinitionStateVariables);


    stateVariableDefinitions.titleChildName = {
      forRenderer: true,
      returnDependencies: () => ({
        titleChild: {
          dependencyType: "child",
          childGroups: ["title"],
        },
      }),
      definition({ dependencyValues }) {
        let titleChildName = null;
        if (dependencyValues.titleChild.length > 0) {
          titleChildName = dependencyValues.titleChild[0].componentName
        }
        return {
          setValue: { titleChildName }
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
          childGroups: ["title"],
          variableNames: ["text"],
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.titleChild.length === 0) {
          return { setValue: { title: "" } };
        } else {
          return { setValue: { title: dependencyValues.titleChild[0].stateValues.text } };
        }
      }
    }


    stateVariableDefinitions.description = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        descriptionChild: {
          dependencyType: "child",
          childGroups: ["description"],
          variableNames: ["text"],
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.descriptionChild.length === 0) {
          return { setValue: { description: "" } };
        } else {
          return { setValue: { description: dependencyValues.descriptionChild[0].stateValues.text } };
        }
      }
    }

    stateVariableDefinitions.level = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { level: 0 } })
    }

    stateVariableDefinitions.viewedSolution = {
      defaultValue: false,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          viewedSolution: true
        }
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "viewedSolution",
            value: desiredStateVariableValues.viewedSolution
          }]
        }
      }
    }

    stateVariableDefinitions.scoredDescendants = {
      returnDependencies: () => ({
        scoredDescendants: {
          dependencyType: "descendant",
          componentTypes: ["_sectioningComponent", "answer", "setup"],
          variableNames: [
            "scoredDescendants",
            "aggregateScores",
            "weight"
          ],
          recurseToMatchedChildren: false,
          variablesOptional: true
        }
      }),
      definition({ dependencyValues }) {
        let scoredDescendants = [];
        for (let descendant of dependencyValues.scoredDescendants) {
          // added setup just so that can skip them
          if (descendant.componentType === "setup") {
            continue;
          }
          if (descendant.stateValues.aggregateScores ||
            descendant.stateValues.scoredDescendants === undefined
          ) {
            scoredDescendants.push(descendant)
          } else {
            scoredDescendants.push(...descendant.stateValues.scoredDescendants)
          }
        }

        return { setValue: { scoredDescendants } }

      }

    }

    stateVariableDefinitions.nScoredDescendants = {
      returnDependencies: () => ({
        scoredDescendants: {
          dependencyType: "stateVariable",
          variableName: "scoredDescendants"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            nScoredDescendants: dependencyValues.scoredDescendants.length
          }
        }

      }

    }


    stateVariableDefinitions.itemCreditAchieved = {
      isArray: true,
      returnArraySizeDependencies: () => ({
        nScoredDescendants: {
          dependencyType: "stateVariable",
          variableName: "nScoredDescendants"
        }
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nScoredDescendants];
      },
      stateVariablesDeterminingDependencies: ["scoredDescendants"],
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let descendant = stateValues.scoredDescendants[arrayKey];
          if (descendant) {
            dependenciesByKey[arrayKey] = {
              creditAchieved: {
                dependencyType: "stateVariable",
                componentName: descendant.componentName,
                variableName: "creditAchieved"
              }
            }
          }
        }

        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let itemCreditAchieved = {};

        for (let arrayKey of arrayKeys) {
          itemCreditAchieved[arrayKey] = dependencyValuesByKey[arrayKey].creditAchieved;
        }

        return { setValue: { itemCreditAchieved } }

      }

    }

    stateVariableDefinitions.itemNumberByAnswerName = {
      stateVariablesDeterminingDependencies: ["scoredDescendants"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          scoredDescendants: {
            dependencyType: "stateVariable",
            variableName: "scoredDescendants"
          }
        };
        for (let ind in stateValues.scoredDescendants) {
          let descendant = stateValues.scoredDescendants[ind];
          dependencies[`descendantsOf${ind}`] = {
            dependencyType: "descendant",
            ancestorName: descendant.componentName,
            componentTypes: ["answer"],
            recurseToMatchedChildren: false,
          }
        }

        return dependencies;
      },
      definition({ dependencyValues, componentInfoObjects }) {
        let itemNumberByAnswerName = {};

        for (let [ind, component] of dependencyValues.scoredDescendants.entries()) {
          let itemNumber = ind + 1;
          for (let answerDescendant of dependencyValues[`descendantsOf${ind}`]) {
            itemNumberByAnswerName[answerDescendant.componentName] = itemNumber;
          }
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: component.componentType,
            baseComponentType: "answer"
          })) {
            itemNumberByAnswerName[component.componentName] = itemNumber;
          }
        }

        return { setValue: { itemNumberByAnswerName } }

      }

    }


    stateVariableDefinitions.itemVariantInfo = {
      isArray: true,
      returnArraySizeDependencies: () => ({
        nScoredDescendants: {
          dependencyType: "stateVariable",
          variableName: "nScoredDescendants"
        }
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nScoredDescendants];
      },
      stateVariablesDeterminingDependencies: ["scoredDescendants"],
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let descendant = stateValues.scoredDescendants[arrayKey];
          if (descendant) {
            dependenciesByKey[arrayKey] = {
              generatedVariantInfo: {
                dependencyType: "stateVariable",
                componentName: descendant.componentName,
                variableName: "generatedVariantInfo",
                variablesOptional: true,
              }
            }
          }
        }

        return { dependenciesByKey }
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let itemVariantInfo = {};

        for (let arrayKey of arrayKeys) {
          itemVariantInfo[arrayKey] = dependencyValuesByKey[arrayKey].generatedVariantInfo;
        }

        return { setValue: { itemVariantInfo } }

      }

    }

    stateVariableDefinitions.answerDescendants = {
      returnDependencies: () => ({
        answerDescendants: {
          dependencyType: "descendant",
          componentTypes: ["answer"],
          variableNames: ["justSubmitted"],
          recurseToMatchedChildren: false,
        }
      }),
      definition({ dependencyValues }) {
        return { setValue: { answerDescendants: dependencyValues.answerDescendants } }
      }
    }

    stateVariableDefinitions.justSubmitted = {
      forRenderer: true,
      returnDependencies: () => ({
        answerDescendants: {
          dependencyType: "stateVariable",
          variableName: "answerDescendants"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            justSubmitted:
              dependencyValues.answerDescendants.every(x => x.stateValues.justSubmitted)
          }
        }
      }
    }

    stateVariableDefinitions.showCorrectness = {
      forRenderer: true,
      returnDependencies: () => ({
        showCorrectnessFlag: {
          dependencyType: "flag",
          flagName: "showCorrectness"
        }
      }),
      definition({ dependencyValues }) {
        let showCorrectness = dependencyValues.showCorrectnessFlag !== false;
        return { setValue: { showCorrectness } }
      }
    }


    stateVariableDefinitions.creditAchieved = {
      public: true,
      forRenderer: true,
      defaultValue: 0,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables: {
          displayDigits: {
            stateVariableToShadow: "displayDigitsForCreditAchieved",
          }
        },
      },
      additionalStateVariablesDefined: [{
        variableName: "percentCreditAchieved",
        public: true,
        shadowingInstructions: {
          createComponentOfType: "number",
          addAttributeComponentsShadowingStateVariables: {
            displayDigits: {
              stateVariableToShadow: "displayDigitsForCreditAchieved",
            }
          }
        }
      }],
      returnDependencies: () => ({
        scoredDescendants: {
          dependencyType: "stateVariable",
          variableName: "scoredDescendants"
        },
        itemCreditAchieved: {
          dependencyType: "stateVariable",
          variableName: "itemCreditAchieved"
        }
      }),
      definition({ dependencyValues }) {

        let creditSum = 0;
        let totalWeight = 0;

        for (let [ind, component] of dependencyValues.scoredDescendants.entries()) {
          let weight = component.stateValues.weight;
          creditSum += dependencyValues.itemCreditAchieved[ind] * weight;
          totalWeight += weight;
        }
        let creditAchieved;

        if (totalWeight > 0) {
          creditAchieved = creditSum / totalWeight;
        } else {
          // give full credit if there are no scored items
          creditAchieved = 1;
        }

        let percentCreditAchieved = creditAchieved * 100;

        return { setValue: { creditAchieved, percentCreditAchieved } }

      }
    }

    stateVariableDefinitions.creditAchievedIfSubmit = {
      defaultValue: 0,
      stateVariablesDeterminingDependencies: ["scoredDescendants"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          scoredDescendants: {
            dependencyType: "stateVariable",
            variableName: "scoredDescendants"
          }
        }
        for (let [ind, descendant] of stateValues.scoredDescendants.entries()) {
          dependencies["creditAchievedIfSubmit" + ind] = {
            dependencyType: "stateVariable",
            componentName: descendant.componentName,
            variableName: "creditAchievedIfSubmit"
          }
        }

        return dependencies;
      },
      definition({ dependencyValues }) {


        let creditSum = 0;
        let totalWeight = 0;

        for (let [ind, component] of dependencyValues.scoredDescendants.entries()) {
          let weight = component.stateValues.weight;
          creditSum += dependencyValues["creditAchievedIfSubmit" + ind] * weight;
          totalWeight += weight;
        }
        let creditAchievedIfSubmit = creditSum / totalWeight;

        return { setValue: { creditAchievedIfSubmit } }

      }
    }


    stateVariableDefinitions.generatedVariantInfo = {
      providePreviousValuesInDefinition: true,
      returnDependencies: ({ sharedParameters, componentInfoObjects }) => ({
        variantIndex: {
          dependencyType: "value",
          value: sharedParameters.variantIndex,
        },
        variantName: {
          dependencyType: "value",
          value: sharedParameters.variantName,
        },
        variantDescendants: {
          dependencyType: "descendant",
          componentTypes: Object.keys(componentInfoObjects.componentTypesCreatingVariants),
          variableNames: [
            "isVariantComponent",
            "generatedVariantInfo",
          ],
          recurseToMatchedChildren: false,
          variablesOptional: true,
          includeNonActiveChildren: true,
          ignoreReplacementsOfEncounteredComposites: true,
        },
      }),
      definition({ dependencyValues, componentName, previousValues }) {

        let generatedVariantInfo = {
          index: dependencyValues.variantIndex,
          name: dependencyValues.variantName,
          meta: {
            createdBy: componentName,
          },
        }


        let subvariants = generatedVariantInfo.subvariants = [];

        for (let descendant of dependencyValues.variantDescendants) {
          if (descendant.stateValues.isVariantComponent) {
            subvariants.push(descendant.stateValues.generatedVariantInfo)
          } else if (descendant.stateValues.generatedVariantInfo) {
            subvariants.push(...descendant.stateValues.generatedVariantInfo.subvariants)
          }
        }

        for (let [ind, subvar] of subvariants.entries()) {
          if (!subvar.subvariants && previousValues.generatedVariantInfo) {
            // check if previously had subvariants
            let previousSubvariants = previousValues.generatedVariantInfo.subvariants;
            if (previousSubvariants[ind]?.subvariants) {
              subvariants[ind] = Object.assign({}, subvariants[ind]);
              subvariants[ind].subvariants = previousSubvariants[ind].subvariants;
            }
          }
        }

        return { setValue: { generatedVariantInfo } }

      }
    }

    stateVariableDefinitions.createSubmitAllButton = {
      forRenderer: true,
      additionalStateVariablesDefined: [{
        variableName: "suppressAnswerSubmitButtons",
        forRenderer: true,
      }],
      returnDependencies: () => ({
        documentWideCheckWork: {
          dependencyType: "stateVariable",
          variableName: "documentWideCheckWork"
        },
      }),
      definition({ dependencyValues, componentName }) {

        let createSubmitAllButton = false;
        let suppressAnswerSubmitButtons = false;

        if (dependencyValues.documentWideCheckWork) {
          createSubmitAllButton = true;
          suppressAnswerSubmitButtons = true
        }

        return { setValue: { createSubmitAllButton, suppressAnswerSubmitButtons } }
      }
    }

    stateVariableDefinitions.suppressCheckwork = {
      forRenderer: true,
      returnDependencies: () => ({
        autoSubmit: {
          dependencyType: "flag",
          flagName: "autoSubmit"
        }
      }),
      definition({ dependencyValues }) {
        return { setValue: { suppressCheckwork: dependencyValues.autoSubmit } }
      }
    }

    return stateVariableDefinitions;
  }

  actions = {
    submitAllAnswers: this.submitAllAnswers.bind(this),
    recordVisibilityChange: this.recordVisibilityChange.bind(this)
  }

  async submitAllAnswers({ actionId }) {

    this.coreFunctions.requestRecordEvent({
      verb: "submitted",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      }
    });


    for (let answer of await this.stateValues.answerDescendants) {
      if (!await answer.stateValues.justSubmitted) {
        await this.coreFunctions.performAction({
          componentName: answer.componentName,
          actionName: "submitAnswer"
        })
      }
    }

    this.coreFunctions.resolveAction({ actionId });

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

  static setUpVariant({ serializedComponent, sharedParameters,
    descendantVariantComponents }) {

    // console.log("****Variant for document*****")

    let nVariants = serializedComponent.variants.numberOfVariants;

    let variantIndex;
    // check if desiredVariant was specified
    let desiredVariant = serializedComponent.variants.desiredVariant;
    if (desiredVariant !== undefined) {
      if (desiredVariant.index !== undefined) {
        let desiredVariantIndex = Number(desiredVariant.index);
        if (!Number.isFinite(desiredVariantIndex)) {
          console.warn("Variant index " + desiredVariant.index + " must be a number");
          variantIndex = 1;
        } else {
          if (!Number.isInteger(desiredVariantIndex)) {
            console.warn("Variant index " + desiredVariant.index + " must be an integer");
            desiredVariantIndex = Math.round(desiredVariantIndex);
          }
          let indexFrom0 = (desiredVariantIndex - 1) % nVariants;
          if (indexFrom0 < 0) {
            indexFrom0 += nVariants;
          }
          variantIndex = indexFrom0 + 1;
        }
      }
    }

    if (variantIndex === undefined) {
      // if variant index wasn't specified, use first variant
      variantIndex = 1;
    }

    sharedParameters.allPossibleVariants = serializedComponent.variants.allPossibleVariants;
    sharedParameters.allVariantNames = serializedComponent.variants.allVariantNames;

    sharedParameters.variantSeed = serializedComponent.variants.allPossibleVariantSeeds[variantIndex - 1];
    sharedParameters.variantIndex = variantIndex;
    sharedParameters.variantName = serializedComponent.variants.allPossibleVariants[variantIndex - 1];
    sharedParameters.uniqueIndex = serializedComponent.variants.allPossibleVariantUniqueIndices[variantIndex - 1];

    sharedParameters.variantRng = new sharedParameters.rngClass(sharedParameters.variantSeed);
    sharedParameters.subpartVariantRng = new sharedParameters.rngClass(sharedParameters.variantSeed + 's');


    // console.log("Document variant name: " + sharedParameters.variantName);

    // if subvariants were specified, add those to the corresponding descendants
    if (desiredVariant?.subvariants && descendantVariantComponents) {
      for (let ind in desiredVariant.subvariants) {
        let subvariant = desiredVariant.subvariants[ind];
        let variantComponent = descendantVariantComponents[ind];
        if (variantComponent === undefined) {
          break;
        }
        variantComponent.variants.desiredVariant = subvariant;
      }
    }

    // console.log("Desired variant for document");
    // console.log(desiredVariant);

  }

  static determineNumberOfUniqueVariants({ serializedComponent, componentInfoObjects }) {

    return determineVariantsForSection({
      serializedComponent, componentInfoObjects, isDocument: true,
    })

  }

  static getUniqueVariant({ serializedComponent, variantIndex, componentInfoObjects }) {

    let originalVariantIndex = serializedComponent.variants.allPossibleVariantUniqueIndices[variantIndex - 1];

    if (originalVariantIndex === undefined) {
      return { success: false }
    }


    let result = getVariantsForDescendantsForUniqueVariants({
      variantIndex: originalVariantIndex,
      serializedComponent,
      componentInfoObjects
    })

    if (!result.success) {
      console.log("Failed to get unique variant for document.");

      return { success: false }
    }

    return {
      success: true,
      desiredVariant: {
        index: variantIndex,
        subvariants: result.desiredVariants
      }
    }
  }

  static includeBlankStringChildren = true;


}


