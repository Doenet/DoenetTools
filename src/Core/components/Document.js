import BaseComponent from './abstract/BaseComponent';
import { getVariantsForDescendants } from '../utils/variants';
import { returnDefaultStyleDefinitions } from '../utils/style';
import { numberToLetters } from '../utils/sequence';

export default class Document extends BaseComponent {
  static componentType = "document";
  static rendererType = "section";
  static renderChildren = true;

  static createsVariants = true;

  static alwaysSetUpVariant = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

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
    attributes.feedbackDefinitions = {
      createComponentOfType: "feedbackDefinitions",
      createStateVariable: "feedbackDefinitions",
      get defaultValue() { return returnDefaultFeedbackDefinitions() },
      propagateToDescendants: true,
      mergeArrayWithDefault: true,
      public: true,
    };
    attributes.styleDefinitions = {
      createComponentOfType: "styleDefinitions",
      createStateVariable: "styleDefinitions",
      get defaultValue() { return returnDefaultStyleDefinitions() },
      propagateToDescendants: true,
      mergeArrayWithDefault: true,
      public: true,
    };
    return attributes;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneVariantControl = childLogic.newLeaf({
      name: "atMostOneVariantControl",
      componentType: "variantControl",
      comparison: "atMost",
      number: 1,
      allowSpillover: false,
    })

    let atMostOneTitle = childLogic.newLeaf({
      name: "atMostOneTitle",
      componentType: "title",
      comparison: "atMost",
      number: 1,
    })

    let atMostOneDescription = childLogic.newLeaf({
      name: "atMostOneDescription",
      componentType: "description",
      comparison: "atMost",
      number: 1,
    })

    let anything = childLogic.newLeaf({
      name: 'anything',
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "variantTitleDescriptionMetaAnything",
      operator: "and",
      propositions: [atMostOneVariantControl, atMostOneTitle, atMostOneDescription, anything],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.titleChildName = {
      forRenderer: true,
      returnDependencies: () => ({
        titleChild: {
          dependencyType: "child",
          childLogicName: "atMostOneTitle",
        },
      }),
      definition({ dependencyValues }) {
        let titleChildName = null;
        if (dependencyValues.titleChild.length === 1) {
          titleChildName = dependencyValues.titleChild[0].componentName
        }
        return {
          newValues: { titleChildName }
        }
      }
    }


    stateVariableDefinitions.title = {
      public: true,
      componentType: "text",
      forRenderer: true,
      returnDependencies: () => ({
        titleChild: {
          dependencyType: "child",
          childLogicName: "atMostOneTitle",
          variableNames: ["text"],
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.titleChild.length === 0) {
          return { newValues: { title: "" } };
        } else {
          return { newValues: { title: dependencyValues.titleChild[0].stateValues.text } };
        }
      }
    }


    stateVariableDefinitions.description = {
      public: true,
      componentType: "text",
      forRenderer: true,
      returnDependencies: () => ({
        descriptionChild: {
          dependencyType: "child",
          childLogicName: "atMostOneDescription",
          variableNames: ["text"],
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.descriptionChild.length === 0) {
          return { newValues: { description: "" } };
        } else {
          return { newValues: { description: dependencyValues.descriptionChild[0].stateValues.text } };
        }
      }
    }

    stateVariableDefinitions.level = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { level: 0 } })
    }

    stateVariableDefinitions.viewedSolution = {
      defaultValue: false,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          viewedSolution: { variablesToCheck: ["viewedSolution"] }
        }
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "viewedSolution",
            value: desiredStateVariableValues.viewedSolution
          }]
        }
      }
    }

    stateVariableDefinitions.scoredDescendants = {
      returnDependencies: () => ({
        scoredDescendants: {
          dependencyType: "descendant",
          componentTypes: ["_sectioningComponent", "answer"],
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
          if (descendant.stateValues.aggregateScores ||
            descendant.stateValues.scoredDescendants === undefined
          ) {
            scoredDescendants.push(descendant)
          } else {
            scoredDescendants.push(...descendant.stateValues.scoredDescendants)
          }
        }

        return { newValues: { scoredDescendants } }

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
          newValues: {
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

        return { newValues: { itemCreditAchieved } }

      },
      markStaleByKey({ arrayKeys, changes }) {

        if (changes.__array_size || changes.__array_keys) {
          return {
            itemScoreChanged: {
              itemNumbers: arrayKeys
            }
          }
        }

        let findArrayKeyRegex = /^__(\d+)_/;

        let itemNumbers = [];

        for (let changeName in changes) {
          let match = findArrayKeyRegex.exec(changeName);
          if (match) {
            itemNumbers.push(match[1])
          }
        }

        return {
          itemScoreChanged: { itemNumbers }
        }
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
        return { newValues: { answerDescendants: dependencyValues.answerDescendants } }
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
          newValues: {
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
        return { newValues: { showCorrectness } }
      }
    }


    stateVariableDefinitions.displayDigitsForCreditAchieved = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { displayDigitsForCreditAchieved: 3 } })
    }

    stateVariableDefinitions.creditAchieved = {
      public: true,
      componentType: "number",
      forRenderer: true,
      defaultValue: 0,
      stateVariablesPrescribingAdditionalAttributes: {
        displayDigits: "displayDigitsForCreditAchieved",
      },
      additionalStateVariablesDefined: [{
        variableName: "percentCreditAchieved",
        public: true,
        componentType: "number",
        stateVariablesPrescribingAdditionalAttributes: {
          displayDigits: "displayDigitsForCreditAchieved",
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
        let creditAchieved = creditSum / totalWeight;
        let percentCreditAchieved = creditAchieved * 100;

        return { newValues: { creditAchieved, percentCreditAchieved } }

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

        return { newValues: { creditAchievedIfSubmit } }

      }
    }


    stateVariableDefinitions.generatedVariantInfo = {
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
          componentTypes: Object.keys(componentInfoObjects.componentTypeWithPotentialVariants),
          variableNames: [
            "isVariantComponent",
            "generatedVariantInfo",
          ],
          recurseToMatchedChildren: false,
          variablesOptional: true,
          includeNonActiveChildren: true,
          ignoreReplacementsOfMatchedComposites: true,
          definingChildrenFirst: true,
        },
        variants: {
          dependencyType: "variants",
        },
      }),
      definition({ dependencyValues, componentName }) {

        let subvariantsSpecified = Boolean(
          dependencyValues.variants.desiredVariant &&
          dependencyValues.variants.desiredVariant.subvariants
        )

        let generatedVariantInfo = {
          index: dependencyValues.variantIndex,
          name: dependencyValues.variantName,
          meta: {
            createdBy: componentName,
            subvariantsSpecified
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
        return { newValues: { generatedVariantInfo } }

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

        return { newValues: { createSubmitAllButton, suppressAnswerSubmitButtons } }
      }
    }

    return stateVariableDefinitions;
  }

  actions = {
    submitAllAnswers: this.submitAllAnswers.bind(this),
  }

  submitAllAnswers() {

    this.coreFunctions.requestRecordEvent({
      verb: "submitted",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: {
        creditAchieved: this.stateValues.creditAchievedIfSubmit
      }

    })
    for (let answer of this.stateValues.answerDescendants) {
      if (!answer.stateValues.justSubmitted) {
        this.coreFunctions.requestAction({
          componentName: answer.componentName,
          actionName: "submitAnswer"
        })
      }
    }
  }

  static setUpVariant({ serializedComponent, sharedParameters, definingChildrenSoFar,
    descendantVariantComponents,
    allComponentClasses }) {

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

      let nVariants = 100;

      // if (serializedComponent.variants.uniqueVariants) {
      //   nVariants = serializedComponent.variants.numberOfVariants;
      // }

      sharedParameters.allPossibleVariants = [...Array(nVariants).keys()].map(indexToLowercaseLetters);

      let variantIndex;
      // check if desiredVariant was specified
      let desiredVariant = serializedComponent.variants.desiredVariant;
      if (desiredVariant !== undefined) {
        if (desiredVariant.index !== undefined) {
          let desiredVariantIndex = Number(desiredVariant.index);
          if (!Number.isInteger(desiredVariantIndex)) {
            throw Error("Variant index " + desiredVariant.index + " must be an integer");
          } else {
            variantIndex = desiredVariantIndex % nVariants;
            if (variantIndex < 0) {
              variantIndex += nVariants;
            }
          }
        } else if (desiredVariant.name !== undefined) {
          if (typeof desiredVariant.name === "string") {
            // want case insensitive test, so convert to lower case
            let desiredNumber = sharedParameters.allPossibleVariants.indexOf(desiredVariant.name.toLowerCase());
            if (desiredNumber !== -1) {
              variantIndex = desiredNumber;
            }
          }
          if (variantIndex === undefined) {
            throw Error("Variant name " + desiredVariant.name + " is not valid")
          }
        }
      }

      if (variantIndex === undefined) {
        // if variant inedex wasn't specifed, use first variant
        variantIndex = 0;
      }

      let seed = (variantIndex + 1).toString();

      sharedParameters.variantIndex = variantIndex;
      sharedParameters.variantName = indexToLowercaseLetters(variantIndex);
      sharedParameters.selectRng = new sharedParameters.rngClass(seed);


    } else {
      // get parameters from variant control child
      sharedParameters.variantName = variantControlChild.state.selectedVariantName.value;
      sharedParameters.variantIndex = variantControlChild.state.selectedVariantIndex.value;
      sharedParameters.selectRng = variantControlChild.state.selectRng.value;
      sharedParameters.allPossibleVariants = variantControlChild.state.variants.value;
      // console.log("Selected seed: " + variantControlChild.state.selectedSeed);
    }

    // seed rng for random numbers predictably from variant using selectRng
    let seedForRandomNumbers = Math.floor(sharedParameters.selectRng() * 1000000).toString()
    sharedParameters.rng = new sharedParameters.rngClass(seedForRandomNumbers);

    // console.log("Document variant name: " + sharedParameters.variantName);

    // if subvariants were specified, add those to the corresponding descendants
    let desiredVariant = serializedComponent.variants.desiredVariant;
    if (desiredVariant === undefined) {
      desiredVariant = {};
    }

    // // if subvariants aren't defined but we have uniqueVariants specified
    // // then calculate variant information for the descendant variant component
    // if (desiredVariant.subvariants === undefined && serializedComponent.variants.uniqueVariants) {
    //   let variantInfo = this.getUniqueVariant({
    //     serializedComponent: serializedComponent,
    //     variantIndex: sharedParameters.variantIndex,
    //     allComponentClasses: allComponentClasses,
    //   })
    //   if (variantInfo.success) {
    //     Object.assign(desiredVariant, variantInfo.desiredVariant);
    //   }
    // }

    if (desiredVariant.subvariants && descendantVariantComponents) {
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

  static determineNumberOfUniqueVariants({ serializedComponent }) {
    if (serializedComponent.children === undefined) {
      return { success: true, numberOfVariants: 1 };
    }

    let variantControlInd;
    let variantControlChild
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "variantControl" || (
        child.createdComponent && components[child.componentName].componentType === "variantControl"
      )) {
        variantControlInd = ind;
        variantControlChild = child;
        break;
      }
    }

    // Find number of variants from variantControl, if it exists
    let numberOfVariants = 100;
    if (variantControlInd !== undefined && variantControlChild.attributes &&
      variantControlChild.attributes.nVariants !== undefined
    ) {
      let nVariantsComp = variantControlChild.attributes.nVariants;
      // calculate nVariants only if has its value set directly 
      // or if has a single child that is a string
      let foundValid = false;
      if (nVariantsComp.state !== undefined && nVariantsComp.state.value !== undefined) {
        numberOfVariants = Math.round(Number(nVariantsComp.state.value));
        foundValid = true;
      }
      // children overwrite state
      if (nVariantsComp.children !== undefined && nVariantsComp.children.length === 1 &&
        nVariantsComp.children[0].componentType === "string") {
        numberOfVariants = Math.round(Number(nVariantsComp.children[0].state.value));
        foundValid = true;
      }
      if (!foundValid) {
        return { success: false }
      }
    }

    let uniqueVariantData;

    // max number of variants is the product of 
    // number of variants for each descendantVariantComponent
    let maxNumberOfVariants = 1;
    let numberOfVariantsByDescendant = []
    if (serializedComponent.variants.descendantVariantComponents !== undefined) {
      numberOfVariantsByDescendant = serializedComponent.variants.descendantVariantComponents
        .map(x => x.variants.numberOfVariants);
      maxNumberOfVariants = numberOfVariantsByDescendant.reduce((a, c) => a * c, 1);
      uniqueVariantData = {
        numberOfVariantsByDescendant: numberOfVariantsByDescendant,
      }
    }

    numberOfVariants = Math.min(maxNumberOfVariants, numberOfVariants)

    return {
      success: true,
      numberOfVariants: numberOfVariants,
      uniqueVariantData: uniqueVariantData,
    }

  }

  static getUniqueVariant({ serializedComponent, variantIndex, allComponentClasses }) {
    if (serializedComponent.variants === undefined) {
      return { succes: false }
    }
    let numberOfVariants = serializedComponent.variants.numberOfVariants;
    if (numberOfVariants === undefined) {
      return { success: false }
    }

    if (!Number.isInteger(variantIndex) || variantIndex < 0 || variantIndex >= numberOfVariants) {
      return { success: false }
    }

    let result = getVariantsForDescendants({
      variantIndex: variantIndex,
      serializedComponent: serializedComponent,
      allComponentClasses: allComponentClasses
    })

    if (!result.success) {
      console.log("Failed to get unique variant for document.");

      return { success: false }
    }

    return { success: true, desiredVariant: { subvariants: result.desiredVariants } }
  }

  static includeBlankStringChildren = true;


}

function indexToLowercaseLetters(index) {
  return numberToLetters(index + 1, true)
}


function returnDefaultFeedbackDefinitions() {
  return [
    {
      feedbackCode: 'numericalerror',
      feedbackText: `Credit reduced because numbers in your answer weren't quite right.  Did you round too much?`
    },
    {
      feedbackCode: 'goodjob',
      feedbackText: `Good job!`
    },
    {
      feedbackCode: 'onesignerror',
      feedbackText: `Credit reduced because it appears that you made a sign error.`
    },
    {
      feedbackCode: 'twosignerrors',
      feedbackText: `Credit reduced because it appears that you made two sign errors.`
    },
  ]
}

