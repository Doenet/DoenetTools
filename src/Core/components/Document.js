import BaseComponent from './abstract/BaseComponent';
import { getVariantsForDescendantsForUniqueVariants } from '../utils/variants';
import { returnStyleDefinitionStateVariables } from '../utils/style';
import { returnFeedbackDefinitionStateVariables } from '../utils/feedback';
import { numberToLetters } from '../utils/sequence';

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

  static async setUpVariant({ serializedComponent, sharedParameters, definingChildrenSoFar,
    descendantVariantComponents }) {

    // console.log("****Variant for document*****")

    let variantControlChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "variantControl") {
        variantControlChild = child;
        break;
      }
    }
    if (variantControlChild === undefined) {
      // no variant control child
      // so just use default of 100 variants
      // with variant names a, b, c, ...
      // and seeds 1,2,3,...

      let nVariants;
      let variantNames;

      if (serializedComponent.variants.variantsFromChild) {
        nVariants = serializedComponent.variants.numberOfVariantsPreIgnore;

        if (serializedComponent.variants.variantNames) {

          variantNames = [...serializedComponent.variants.variantNames];

          if (variantNames.length >= nVariants) {
            variantNames = variantNames.slice(0, nVariants);
          } else {
            let originalVariantNames = [...variantNames];
            let variantNumber = variantNames.length;
            let variantValue = variantNumber;
            let variantString;
            while (variantNumber < nVariants) {
              variantNumber++;
              variantValue++;
              variantString = indexToLowercaseLetters(variantValue);
              while (originalVariantNames.includes(variantString)) {
                variantValue++;
                variantString = indexToLowercaseLetters(variantValue);
              }
              variantNames.push(variantString);
            }

          }


          sharedParameters.allPossibleVariants = variantNames;

        } else {

          sharedParameters.allPossibleVariants = [...Array(nVariants).keys()].map(x => indexToLowercaseLetters(x + 1));

        }

        sharedParameters.variantIndicesToIgnore = serializedComponent.variants.indicesToIgnore;

      } else {

        nVariants = 100;
        if (serializedComponent.variants?.numberOfVariantsPreIgnore <= 100) {
          nVariants = serializedComponent.variants.numberOfVariantsPreIgnore;
        }

        sharedParameters.allPossibleVariants = [...Array(nVariants).keys()].map(x => indexToLowercaseLetters(x + 1));
        sharedParameters.variantIndicesToIgnore = [];

      }

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
        // if variant index wasn't specifed, use first variant
        variantIndex = 1;
      }

      sharedParameters.variantSeed = variantIndex.toString();
      sharedParameters.variantIndex = variantIndex;
      if (variantNames) {
        sharedParameters.variantName = variantNames[variantIndex - 1];
      } else {
        sharedParameters.variantName = indexToLowercaseLetters(variantIndex);
      }
      sharedParameters.variantRng = new sharedParameters.rngClass(sharedParameters.variantSeed);


    } else {
      // get parameters from variant control child
      sharedParameters.variantSeed = await variantControlChild.state.selectedSeed.value;
      sharedParameters.variantName = await variantControlChild.state.selectedVariantName.value;
      sharedParameters.variantIndex = await variantControlChild.state.selectedVariantIndex.value;
      sharedParameters.variantRng = await variantControlChild.state.variantRng.value;
      sharedParameters.allPossibleVariants = await variantControlChild.state.variantNames.value;
      sharedParameters.variantIndicesToIgnore = await variantControlChild.state.variantIndicesToIgnore.value;
    }

    // console.log("Document variant name: " + sharedParameters.variantName);

    // if subvariants were specified, add those to the corresponding descendants
    let desiredVariant = serializedComponent.variants.desiredVariant;
    if (desiredVariant === undefined) {
      desiredVariant = {};
    }


    if (desiredVariant.subvariants && descendantVariantComponents) {
      for (let ind in desiredVariant.subvariants) {
        let subvariant = desiredVariant.subvariants[ind];
        let variantComponent = descendantVariantComponents[ind];
        if (variantComponent === undefined) {
          break;
        }
        variantComponent.variants.desiredVariant = subvariant;
      }
    } else if (serializedComponent.variants.variantsFromChild && descendantVariantComponents?.length === 1) {
      // copy desired variant to child
      descendantVariantComponents[0].variants.desiredVariant = desiredVariant;
      descendantVariantComponents[0].variants.desiredVariantFromDocument = true;

    }

    // console.log("Desired variant for document");
    // console.log(desiredVariant);

  }

  static determineNumberOfUniqueVariants({ serializedComponent, componentInfoObjects }) {
    if (serializedComponent.children === undefined) {
      return { success: true, numberOfVariants: 1, numberOfVariantsPreIgnore: 1 };
    }

    let variantControlChild;
    for (let child of serializedComponent.children) {
      if (child.componentType === "variantControl") {
        variantControlChild = child;
        break;
      }
    }

    if (!variantControlChild) {

      // if don't have variant control, check to see if have 100 or fewer unique variants

      let result = super.determineNumberOfUniqueVariants({ serializedComponent, componentInfoObjects });

      if (result.success && result.numberOfVariants <= 100) {
        let numberOfVariants = result.numberOfVariants;
        let numberOfVariantsPreIgnore = result.numberOfVariants;
        return { success: true, numberOfVariants, numberOfVariantsPreIgnore }
      } else {
        return { success: false }
      }
    }

    let numberOfVariants = variantControlChild.attributes.nVariants?.primitive;

    if (numberOfVariants === undefined) {
      numberOfVariants = 100;
    }

    if (!variantControlChild.attributes.uniqueVariants?.primitive) {
      return { success: true, numberOfVariants, numberOfVariantsPreIgnore: numberOfVariants }
    }


    let result = super.determineNumberOfUniqueVariants({ serializedComponent, componentInfoObjects });

    if (!result.success) {
      return result;
    }

    numberOfVariants = Math.min(result.numberOfVariants, numberOfVariants);

    serializedComponent.variants.numberOfVariants = numberOfVariants;
    serializedComponent.variants.numberOfVariantsPreIgnore = numberOfVariants;

    // console.log("Actual number of variants for document is " + numberOfVariants)

    return {
      success: true,
      numberOfVariants,
      numberOfVariantsPreIgnore: numberOfVariants
    };


  }

  static getUniqueVariant({ serializedComponent, variantIndex, componentInfoObjects }) {

    let numberOfVariants = serializedComponent.variants?.numberOfVariants;
    if (numberOfVariants === undefined) {
      return { success: false }
    }

    if (!Number.isInteger(variantIndex) || variantIndex < 1 || variantIndex > numberOfVariants) {
      return { success: false }
    }

    let result = getVariantsForDescendantsForUniqueVariants({
      variantIndex,
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

function indexToLowercaseLetters(index) {
  return numberToLetters(index, true)
}



