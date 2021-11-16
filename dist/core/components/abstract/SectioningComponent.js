import BlockComponent from './BlockComponent.js';
import { getVariantsForDescendants } from '../../utils/variants.js';
import { numberToLetters } from '../../utils/sequence.js';
import { returnStyleDefinitionStateVariables } from '../../utils/style.js';

export default class SectioningComponent extends BlockComponent {
  static componentType = "_sectioningComponent";
  static renderChildren = true;

  static setUpVariantIfVariantControlChild = true;

  static get stateVariablesShadowedForReference() { return ["title"] };

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.aggregateScores = {
      createComponentOfType: "boolean",
      createStateVariable: "aggregateScores",
      defaultValue: false,
      public: true
    };
    attributes.weight = {
      createComponentOfType: "number",
      createStateVariable: "weight",
      defaultValue: 1,
      public: true,
    };
    attributes.sectionWideCheckWork = {
      createComponentOfType: "boolean",
      createStateVariable: "sectionWideCheckWork",
      defaultValue: false,
      public: true,
    };
    // attributes.possiblepoints = {default: undefined};
    // attributes.aggregatebypoints = {default: false};
    attributes.boxed = {
      createComponentOfType: "boolean",
      createStateVariable: "boxed",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };
    attributes.feedbackDefinitions = {
      createComponentOfType: "feedbackDefinitions",
      createStateVariable: "feedbackDefinitions",
      propagateToDescendants: true,
      mergeArrays: true,
      public: true,
    }
    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "variantControls",
      componentTypes: ["variantControl"]
    }, {
      group: "titles",
      componentTypes: ["title"]
    }, {
      group: "styleDefinitions",
      componentTypes: ["styleDefinitions"]
    }, {
      group: "setups",
      componentTypes: ["setup"]
    }, {
      group: "anything",
      componentTypes: ["_base"]
    }]

  }


  static returnStateVariableDefinitions() {

    let sectioningClass = this;

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let styleDefinitionStateVariables = returnStyleDefinitionStateVariables();

    Object.assign(stateVariableDefinitions, styleDefinitionStateVariables);

    stateVariableDefinitions.enumeration = {
      forRenderer: true,
      returnDependencies: () => ({
        countAmongSiblings: {
          dependencyType: "countAmongSiblingsOfSameType"
        },
        sectionAncestor: {
          dependencyType: "ancestor",
          componentType: "_sectioningComponent",
          variableNames: ["enumeration"]
        }
      }),
      definition({ dependencyValues }) {

        let enumeration = [];
        if (dependencyValues.sectionAncestor) {
          enumeration.push(...dependencyValues.sectionAncestor.stateValues.enumeration)
        }

        enumeration.push(dependencyValues.countAmongSiblings)
        return { newValues: { enumeration } }

      }
    }

    stateVariableDefinitions.sectionName = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { sectionName: "Section" } })
    }


    stateVariableDefinitions.titleChildName = {
      forRenderer: true,
      returnDependencies: () => ({
        titleChild: {
          dependencyType: "child",
          childGroups: ["titles"],
        },
      }),
      definition({ dependencyValues }) {
        let titleChildName = null;
        if (dependencyValues.titleChild.length > 0) {
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
          childGroups: ["titles"],
          variableNames: ["text"],
        },
        sectionName: {
          dependencyType: "stateVariable",
          variableName: "sectionName",
        },
        enumeration: {
          dependencyType: "stateVariable",
          variableName: "enumeration"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.titleChild.length === 0) {

          let title = sectioningClass.defaultTitle;

          if (!title) {
            title = dependencyValues.sectionName + " "
              + dependencyValues.enumeration.join(".")
          }

          return { newValues: { title } };
        } else {
          return { newValues: { title: dependencyValues.titleChild[0].stateValues.text } };
        }
      }
    }

    stateVariableDefinitions.containerTag = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { containerTag: "section" } })
    }

    stateVariableDefinitions.level = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { level: 1 } })
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

    stateVariableDefinitions.sectionPlaceholder = {
      defaultValue: false,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: { sectionPlaceholder: { variablesToCheck: ["sectionPlaceholder"] } }
      })
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
        defaultValue: 0,
        stateVariablesPrescribingAdditionalAttributes: {
          displayDigits: "displayDigitsForCreditAchieved",
        }
      }],
      stateVariablesDeterminingDependencies: ["aggregateScores", "scoredDescendants"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          aggregateScores: {
            dependencyType: "stateVariable",
            variableName: "aggregateScores"
          }
        }
        if (stateValues.aggregateScores) {
          dependencies.scoredDescendants = {
            dependencyType: "stateVariable",
            variableName: "scoredDescendants"
          }
          dependencies.sectionPlaceholder = {
            dependencyType: "stateVariable",
            variableName: "sectionPlaceholder"
          }
          for (let [ind, descendant] of stateValues.scoredDescendants.entries()) {
            dependencies["creditAchieved" + ind] = {
              dependencyType: "stateVariable",
              componentName: descendant.componentName,
              variableName: "creditAchieved"
            }
          }
        }

        return dependencies;
      },
      definition({ dependencyValues }) {

        if (!dependencyValues.aggregateScores) {
          return {
            newValues: {
              creditAchieved: 0,
              percentCreditAchieved: 0
            }
          }
        }

        if (dependencyValues.sectionPlaceholder) {
          return {
            useEssentialOrDefaultValue: {
              creditAchieved: { variablesToCheck: ["creditAchieved"] },
              percentCreditAchieved: { variablesToCheck: ["percentCreditAchieved"] },
            }
          }
        }

        let creditSum = 0;
        let totalWeight = 0;

        for (let [ind, component] of dependencyValues.scoredDescendants.entries()) {
          let weight = component.stateValues.weight;
          creditSum += dependencyValues["creditAchieved" + ind] * weight;
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

        return { newValues: { creditAchieved, percentCreditAchieved } }

      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (!dependencyValues.sectionPlaceholder) {
          return { success: false }
        }

        let instructions = [];

        for (let varName in desiredStateVariableValues) {
          if (!["creditAchieved", "percentCreditAchieved"].includes(varName)) {
            continue;
          }
          instructions.push({
            setStateVariable: varName,
            value: desiredStateVariableValues[varName]
          })
        }

        return {
          success: true,
          instructions
        }
      }
    }

    stateVariableDefinitions.creditAchievedIfSubmit = {
      defaultValue: 0,
      stateVariablesDeterminingDependencies: ["aggregateScores", "scoredDescendants"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          aggregateScores: {
            dependencyType: "stateVariable",
            variableName: "aggregateScores"
          }
        }
        if (stateValues.aggregateScores) {
          dependencies.scoredDescendants = {
            dependencyType: "stateVariable",
            variableName: "scoredDescendants"
          }
          for (let [ind, descendant] of stateValues.scoredDescendants.entries()) {
            dependencies["creditAchievedIfSubmit" + ind] = {
              dependencyType: "stateVariable",
              componentName: descendant.componentName,
              variableName: "creditAchievedIfSubmit"
            }
          }
        }

        return dependencies;
      },
      definition({ dependencyValues }) {

        if (!dependencyValues.aggregateScores) {
          return {
            newValues: {
              creditAchievedIfSubmit: 0,
            }
          }
        }

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

    stateVariableDefinitions.suppressAutomaticVariants = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { suppressAutomaticVariants: true } })
    }

    stateVariableDefinitions.generatedVariantInfo = {
      additionalStateVariablesDefined: ["isVariantComponent"],
      returnDependencies: ({ sharedParameters, componentInfoObjects }) => ({
        variantIndex: {
          dependencyType: "value",
          value: sharedParameters.variantIndex,
        },
        variantName: {
          dependencyType: "value",
          value: sharedParameters.variantName,
        },
        variantControlChild: {
          dependencyType: "child",
          childGroups: ["variantControls"],
          variableNames: ["selectedVariantIndex", "selectedVariantName"]
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
        },
        variants: {
          dependencyType: "variants",
        },
        suppressAutomaticVariants: {
          dependencyType: "stateVariable",
          variableName: "suppressAutomaticVariants"
        },
        sectionPlaceholder: {
          dependencyType: "stateVariable",
          variableName: "sectionPlaceholder"
        }

      }),
      definition({ dependencyValues, componentName }) {

        let generatedVariantInfo = {};

        if (dependencyValues.variantControlChild.length === 0) {
          if (dependencyValues.suppressAutomaticVariants) {
            return {
              newValues: {
                generatedVariantInfo: null,
                isVariantComponent: false
              }
            }
          } else {
            generatedVariantInfo.index = dependencyValues.variantIndex;
            generatedVariantInfo.name = dependencyValues.variantName;

          }
        } else {
          generatedVariantInfo.index = dependencyValues.variantControlChild[0].stateValues.selectedVariantIndex;
          generatedVariantInfo.name = dependencyValues.variantControlChild[0].stateValues.selectedVariantName;

        }


        let subvariantsSpecified = Boolean(
          dependencyValues.variants &&
          dependencyValues.variants.desiredVariant &&
          dependencyValues.variants.desiredVariant.subvariants
        );

        generatedVariantInfo.meta = {
          createdBy: componentName,
          subvariantsSpecified
        }


        if (dependencyValues.sectionPlaceholder) {
          // section placeholders don't have the descedants to determine
          // the variant info
          // so just give the subvariants specified
          if (subvariantsSpecified) {
            generatedVariantInfo.subvariants = dependencyValues.variants.desiredVariant.subvariants
          }
        } else {
          let subvariants = generatedVariantInfo.subvariants = [];
          for (let descendant of dependencyValues.variantDescendants) {
            if (descendant.stateValues.isVariantComponent) {
              subvariants.push(descendant.stateValues.generatedVariantInfo)
            } else if (descendant.stateValues.generatedVariantInfo) {
              subvariants.push(...descendant.stateValues.generatedVariantInfo.subvariants)
            }
          }
        }

        return {
          newValues: {
            generatedVariantInfo,
            isVariantComponent: true
          }
        }

      }
    }

    stateVariableDefinitions.collapsible = {
      componentType: "boolean",
      forRenderer: true,
      returnDependencies: () => ({}),
      definition() {
        return { newValues: { collapsible: false } }
      }
    }

    stateVariableDefinitions.open = {
      public: true,
      componentType: "boolean",
      forRenderer: true,
      defaultValue: true,
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

    stateVariableDefinitions.createSubmitAllButton = {
      forRenderer: true,
      additionalStateVariablesDefined: [{
        variableName: "suppressAnswerSubmitButtons",
        forRenderer: true,
      }],
      returnDependencies: () => ({
        sectionWideCheckWork: {
          dependencyType: "stateVariable",
          variableName: "sectionWideCheckWork"
        },
        aggregateScores: {
          dependencyType: "stateVariable",
          variableName: "aggregateScores"
        },
        sectionAncestor: {
          dependencyType: "ancestor",
          componentType: "_sectioningComponent",
          variableNames: [
            "suppressAnswerSubmitButtons",
          ]
        },
        documentAncestor: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: [
            "suppressAnswerSubmitButtons",
          ]
        }
      }),
      definition({ dependencyValues, componentName }) {

        let createSubmitAllButton = false;
        let suppressAnswerSubmitButtons = false;

        if (
          dependencyValues.documentAncestor.stateValues.suppressAnswerSubmitButtons ||
          dependencyValues.sectionAncestor &&
          dependencyValues.sectionAncestor.stateValues.suppressAnswerSubmitButtons
        ) {
          suppressAnswerSubmitButtons = true
        } else if (dependencyValues.sectionWideCheckWork) {
          if (dependencyValues.aggregateScores) {
            createSubmitAllButton = true;
            suppressAnswerSubmitButtons = true
          } else {
            console.warn(`Cannot create submit all button for ${componentName} because it doesn't aggegrate scores`);
          }
        }

        return { newValues: { createSubmitAllButton, suppressAnswerSubmitButtons } }
      }
    }

    return stateVariableDefinitions;
  }

  actions = {
    submitAllAnswers: this.submitAllAnswers.bind(this),
    revealSection: this.revealSection.bind(this),
    closeSection: this.closeSection.bind(this),
  }

  async submitAllAnswers() {

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
        await this.coreFunctions.performAction({
          componentName: answer.componentName,
          actionName: "submitAnswer"
        })
      }
    }
  }

  revealSection() {

    return this.coreFunctions.performUpdate({
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

  closeSection() {

    return this.coreFunctions.performUpdate({
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

  static setUpVariant({
    serializedComponent, sharedParameters, definingChildrenSoFar,
    descendantVariantComponents,
    allComponentClasses
  }) {
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

      sharedParameters.allPossibleVariants = [...Array(nVariants).keys()].map(x => indexToLowercaseLetters(x + 1));

      let variantIndex;
      // check if desiredVariant was specified
      let desiredVariant;
      if (serializedComponent.variants) {
        desiredVariant = serializedComponent.variants.desiredVariant;
      }
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
        } else if (desiredVariant.name !== undefined) {
          if (typeof desiredVariant.name === "string") {
            // want case insensitive test, so convert to lower case
            let desiredNumber = sharedParameters.allPossibleVariants.indexOf(desiredVariant.name.toLowerCase());
            if (desiredNumber !== -1) {
              variantIndex = desiredNumber + 1;
            }
          }
          if (variantIndex === undefined) {
            console.warn("Variant name " + desiredVariant.name + " is not valid");
            variantIndex = 1;
          }
        }
      }

      if (variantIndex === undefined) {
        // if variant index wasn't specifed

        // if selectRng exists
        // randomly pick variant index
        if (sharedParameters.selectRng) {
          // random number in [0, 1)
          let rand = sharedParameters.selectRng();
          // random integer from 1 to nVariants
          variantIndex = Math.floor(rand * nVariants) + 1;
        } else {
          // if selectRng does not exist, we are in document
          // Just choose the first variant
          variantIndex = 1;
        }
      }
      sharedParameters.variantSeed = variantIndex.toString();
      sharedParameters.variantIndex = variantIndex;
      sharedParameters.variantName = indexToLowercaseLetters(variantIndex);
      sharedParameters.selectRng = new sharedParameters.rngClass(sharedParameters.variantSeed);


    } else {
      sharedParameters.variantSeed = variantControlChild.state.selectedSeed.value;
      sharedParameters.variantName = variantControlChild.state.selectedVariantName.value;
      sharedParameters.variantIndex = variantControlChild.state.selectedVariantIndex.value;
      sharedParameters.selectRng = variantControlChild.state.selectRng.value;
      sharedParameters.allPossibleVariants = variantControlChild.state.variantNames.value;
    }

    // seed rng for random numbers predictably from variant using selectRng
    let seedForRandomNumbers = Math.floor(sharedParameters.selectRng() * 1000000).toString()
    sharedParameters.rng = new sharedParameters.rngClass(seedForRandomNumbers);

    // console.log("****Variant for sectioning component****")
    // console.log("Selected seed: " + variantControlChild.state.selectedSeed);
    // console.log("Variant name for " + this.componentType + ": " + sharedParameters.variantName);

    // if subvariants were specified, add those the corresponding descendants
    let desiredVariant;
    if (serializedComponent.variants) {
      desiredVariant = serializedComponent.variants.desiredVariant;
    }
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

  }

  static determineNumberOfUniqueVariants({ serializedComponent }) {
    if (serializedComponent.children === undefined) {
      return { success: true };
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

    if (variantControlInd === undefined) {
      return { success: true };
    }


    // Find number of variants from variantControl
    let numberOfVariants = 100;
    if (variantControlChild.attributes &&
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

    // check if uniqueVariants is already be defined in variants
    if (serializedComponent.variants === undefined) {
      serializedComponent.variants = {};
    }

    let uniqueVariantData;
    if (serializedComponent.variants.uniqueVariants) {
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
    }

    return {
      success: true,
      numberOfVariants: numberOfVariants,
      uniqueVariantData: uniqueVariantData
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

    let desiredVariant = {
      index: variantIndex,
    }

    if (serializedComponent.variants.uniqueVariants) {

      let result = getVariantsForDescendants({
        variantIndex: variantIndex,
        serializedComponent: serializedComponent,
        allComponentClasses: allComponentClasses
      })

      if (result.success) {
        desiredVariant.subvariants = result.desiredVariants
      } else {
        console.log("Failed to get unique variant for " + serializedComponent.componentType);
      }

    }

    return { success: true, desiredVariant: desiredVariant }
  }

  static includeBlankStringChildren = true;

}

function indexToLowercaseLetters(index) {
  return numberToLetters(index, true)
}
