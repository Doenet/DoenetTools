import BlockComponent from './BlockComponent';
import { determineVariantsForSection, getVariantsForDescendantsForUniqueVariants, setUpVariantSeedAndRng } from '../../utils/variants';
import { returnStyleDefinitionStateVariables } from '../../utils/style';
import { returnFeedbackDefinitionStateVariables } from '../../utils/feedback';

export default class SectioningComponent extends BlockComponent {
  static componentType = "_sectioningComponent";
  static renderChildren = true;

  static includeBlankStringChildren = true;

  static createsVariants = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
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

    // attributes.possiblepoints = {default: undefined};
    // attributes.aggregatebypoints = {default: false};
    attributes.boxed = {
      createComponentOfType: "boolean",
      createStateVariable: "boxed",
      defaultValue: false,
      public: true,
      forRenderer: true,
    };

    attributes.suppressAutoName = {
      createComponentOfType: "boolean",
      createStateVariable: "suppressAutoName",
      defaultValue: false,
      public: true,
    }

    attributes.suppressAutoNumber = {
      createComponentOfType: "boolean",
      createStateVariable: "suppressAutoNumber",
      defaultValue: false,
      public: true,
    }

    attributes.includeAutoName = {
      createComponentOfType: "boolean",
      createStateVariable: "includeAutoName",
      defaultValue: false,
      public: true,
    }

    attributes.includeAutoNumber = {
      createComponentOfType: "boolean",
      createStateVariable: "includeAutoNumber",
      defaultValue: false,
      public: true,
    }

    attributes.includeParentNumber = {
      createComponentOfType: "boolean",
      createStateVariable: "includeParentNumber",
      defaultValue: false,
      public: true,
    }

    attributes.level = {
      createComponentOfType: "integer",
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

    stateVariableDefinitions.enumeration = {
      additionalStateVariablesDefined: [{
        variableName: "sectionNumber",
        public: true,
        shadowingInstructions: {
          createComponentOfType: "text",
        },
      }],
      returnDependencies: () => ({
        countAmongSiblings: {
          dependencyType: "countAmongSiblingsOfSameType"
        },
        sectionAncestor: {
          dependencyType: "ancestor",
          componentType: "_sectioningComponent",
          variableNames: ["enumeration"]
        },
        includeParentNumber: {
          dependencyType: "stateVariable",
          variableName: "includeParentNumber"
        }
      }),
      definition({ dependencyValues }) {

        let enumeration = [];
        if (dependencyValues.includeParentNumber && dependencyValues.sectionAncestor) {
          enumeration.push(...dependencyValues.sectionAncestor.stateValues.enumeration)
        }

        enumeration.push(dependencyValues.countAmongSiblings)


        return { setValue: { enumeration, sectionNumber: enumeration.join(".") } }

      }
    }

    stateVariableDefinitions.sectionName = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { sectionName: "Section" } })
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
          titleChildName = dependencyValues.titleChild[dependencyValues.titleChild.length - 1].componentName
        }
        return {
          setValue: { titleChildName }
        }
      }
    }

    stateVariableDefinitions.childIndicesToRender = {
      returnDependencies: () => ({
        titleChildren: {
          dependencyType: "child",
          childGroups: ["titles"],
        },
        allChildren: {
          dependencyType: "child",
          childGroups: ["anything", "variantControls", "titles", "setups"],
        },
        titleChildName: {
          dependencyType: "stateVariable",
          variableName: "titleChildName"
        }
      }),
      definition({ dependencyValues }) {
        let childIndicesToRender = [];

        let allTitleChildNames = dependencyValues.titleChildren.map(x => x.componentName);

        for (let [ind, child] of dependencyValues.allChildren.entries()) {
          if (typeof child !== "object"
            || !allTitleChildNames.includes(child.componentName)
            || child.componentName === dependencyValues.titleChildName
          ) {
            childIndicesToRender.push(ind)
          }
        }

        return { setValue: { childIndicesToRender } }

      }
    }

    stateVariableDefinitions.title = {
      additionalStateVariablesDefined: [{
        variableName: "titlePrefix",
        forRenderer: true,
        alwaysUpdateRenderer: true,
      }],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      forRenderer: true,
      alwaysUpdateRenderer: true,
      returnDependencies: ({ sharedParameters }) => ({
        titleChild: {
          dependencyType: "child",
          childGroups: ["titles"],
          variableNames: ["text"],
        },
        sectionName: {
          dependencyType: "stateVariable",
          variableName: "sectionName",
        },
        sectionNumber: {
          dependencyType: "stateVariable",
          variableName: "sectionNumber"
        },
        includeAutoName: {
          dependencyType: "stateVariable",
          variableName: "includeAutoName"
        },
        includeAutoNumber: {
          dependencyType: "stateVariable",
          variableName: "includeAutoNumber"
        },
        prerender: {
          dependencyType: "value",
          value: sharedParameters.prerender
        }
      }),
      definition({ dependencyValues }) {

        let titlePrefix = "";
        let title = "";

        const haveTitleChild = dependencyValues.titleChild.length > 0;

        let includeAutoNumber = (dependencyValues.includeAutoNumber || !haveTitleChild)
          && !dependencyValues.prerender;

        let includeAutoName = dependencyValues.includeAutoName || !haveTitleChild;

        if (includeAutoNumber) {
          if (includeAutoName) {
            titlePrefix = dependencyValues.sectionName + " ";
          }
          titlePrefix += dependencyValues.sectionNumber;
        } else {
          if (includeAutoName) {
            titlePrefix = dependencyValues.sectionName;
          }
        }

        if (!haveTitleChild) {
          title = titlePrefix;
        } else {

          if (titlePrefix) {
            if (dependencyValues.includeAutoName) {
              titlePrefix += ": "
            } else {
              titlePrefix += ". "
            }
          }

          title = dependencyValues.titleChild[dependencyValues.titleChild.length - 1].stateValues.text;

        }

        return { setValue: { title, titlePrefix } };
      }
    }

    stateVariableDefinitions.containerTag = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { containerTag: "section" } })
    }

    stateVariableDefinitions.level = {
      forRenderer: true,
      returnDependencies: () => ({
        ancestorLevel: {
          dependencyType: "ancestor",
          componentType: "_sectioningComponent",
          variableNames: ["level"]
        },
        levelAttr: {
          dependencyType: "attributeComponent",
          attributeName: "level",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues }) {
        let level = dependencyValues.levelAttr?.stateValues.value;

        if (!(level > 0)) {
          level = (dependencyValues.ancestorLevel?.stateValues.level || 0) + 1;
        }

        return { setValue: { level } }
      }
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

    stateVariableDefinitions.displayDigitsForCreditAchieved = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { displayDigitsForCreditAchieved: 3 } })
    }

    stateVariableDefinitions.creditAchieved = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables: {
          displayDigits: {
            stateVariableToShadow: "displayDigitsForCreditAchieved",
          }
        },
      },
      forRenderer: true,
      defaultValue: 0,
      hasEssential: true,
      additionalStateVariablesDefined: [{
        variableName: "percentCreditAchieved",
        public: true,
        shadowingInstructions: {
          createComponentOfType: "number",
          addAttributeComponentsShadowingStateVariables: {
            displayDigits: {
              stateVariableToShadow: "displayDigitsForCreditAchieved",
            }
          },
        },
        defaultValue: 0,
        hasEssential: true,
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
            setValue: {
              creditAchieved: 0,
              percentCreditAchieved: 0
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

        return { setValue: { creditAchieved, percentCreditAchieved } }

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
            setValue: {
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

        return { setValue: { creditAchievedIfSubmit } }

      }
    }


    stateVariableDefinitions.generatedVariantInfo = {
      additionalStateVariablesDefined: ["isVariantComponent"],
      returnDependencies: ({ sharedParameters, componentInfoObjects }) => ({
        variantSeed: {
          dependencyType: "value",
          value: sharedParameters.variantSeed,
        },
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
      definition({ dependencyValues, componentName }) {

        let generatedVariantInfo = {};

        if (dependencyValues.variantName) {
          generatedVariantInfo.index = dependencyValues.variantIndex;
          generatedVariantInfo.name = dependencyValues.variantName;

        } else {
          generatedVariantInfo.seed = dependencyValues.variantSeed;
        }


        generatedVariantInfo.meta = {
          createdBy: componentName,
        }


        let subvariants = generatedVariantInfo.subvariants = [];
        for (let descendant of dependencyValues.variantDescendants) {
          if (descendant.stateValues.isVariantComponent) {
            subvariants.push(descendant.stateValues.generatedVariantInfo)
          } else if (descendant.stateValues.generatedVariantInfo) {
            subvariants.push(...descendant.stateValues.generatedVariantInfo.subvariants)
          }
        }

        return {
          setValue: {
            generatedVariantInfo,
            isVariantComponent: true
          }
        }

      }
    }

    stateVariableDefinitions.collapsible = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition() {
        return { setValue: { collapsible: false } }
      }
    }

    stateVariableDefinitions.open = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      forRenderer: true,
      defaultValue: true,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition() {
        return {
          useEssentialOrDefaultValue: {
            open: true
          }
        }
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "open",
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
    revealSection: this.revealSection.bind(this),
    closeSection: this.closeSection.bind(this),
    recordVisibilityChange: this.recordVisibilityChange.bind(this)
  }

  async submitAllAnswers({ actionId }) {

    this.coreFunctions.requestRecordEvent({
      verb: "submitted",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: {
        creditAchieved: await this.stateValues.creditAchievedIfSubmit
      }

    })
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

  async revealSection({ actionId }) {

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "open",
        value: true
      }],
      overrideReadOnly: true,
      actionId,
      event: {
        verb: "viewed",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
      }
    })
  }

  async closeSection({ actionId }) {

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "open",
        value: false
      }],
      overrideReadOnly: true,
      actionId,
      event: {
        verb: "closed",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
      }
    })
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

  static setUpVariant({
    serializedComponent, sharedParameters,
    descendantVariantComponents,
  }) {


    if (!serializedComponent.variants?.allPossibleVariants) {

      // no variant control child
      // so don't actually control variants
      // just calculate a seed

      setUpVariantSeedAndRng({
        serializedComponent, sharedParameters,
        descendantVariantComponents,
        useSubpartVariantRng: true,
      });

      return;

    }


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
      // if variant index wasn't specified, randomly generate a variant index
      // random number in [0, 1)
      let rand = sharedParameters.variantRng();

      // random integer from 1 to nVariants
      variantIndex = Math.floor(rand * nVariants) + 1;

    }


    sharedParameters.allPossibleVariants = serializedComponent.variants.allPossibleVariants;
    sharedParameters.allVariantNames = serializedComponent.variants.allVariantNames;

    sharedParameters.variantSeed = serializedComponent.variants.allPossibleVariantSeeds[variantIndex - 1];
    sharedParameters.variantIndex = variantIndex;
    sharedParameters.variantName = serializedComponent.variants.allPossibleVariants[variantIndex - 1];
    sharedParameters.uniqueIndex = serializedComponent.variants.allPossibleVariantUniqueIndices[variantIndex - 1];

    sharedParameters.variantRng = new sharedParameters.rngClass(sharedParameters.variantSeed);
    sharedParameters.subpartVariantRng = new sharedParameters.rngClass(sharedParameters.variantSeed + 's');


    // console.log("****Variant for sectioning component****")
    // console.log("Selected seed: " + variantControlChild.stateValues.selectedSeed);
    // console.log("Variant name for " + this.componentType + ": " + sharedParameters.variantName);

    // if subvariants were specified, add those the corresponding descendants
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

  }

  static determineNumberOfUniqueVariants({ serializedComponent, componentInfoObjects }) {

    return determineVariantsForSection({
      serializedComponent, componentInfoObjects,
    })

  }

  static getUniqueVariant({ serializedComponent, variantIndex, componentInfoObjects }) {


    if (!serializedComponent.variants.allPossibleVariants) {
      return super.getUniqueVariant({ serializedComponent, variantIndex, componentInfoObjects });
    }


    let uniqueIndex = serializedComponent.variants.allPossibleVariantUniqueIndices[variantIndex - 1];

    if (uniqueIndex === undefined) {
      return { success: false }
    }

    if (!serializedComponent.variants.uniqueVariants) {
      // it don't have unique variants, then just return variantIndex
      return {
        success: true,
        desiredVariant: {
          index: variantIndex,
        }
      }
    }

    let result = getVariantsForDescendantsForUniqueVariants({
      variantIndex: uniqueIndex,
      serializedComponent,
      componentInfoObjects
    })

    if (!result.success) {
      console.log("Failed to get unique variant for section.");

      return { success: false }
    }

    serializedComponent.variants.selectedUniqueVariant = true;

    return {
      success: true,
      desiredVariant: {
        index: variantIndex,
        subvariants: result.desiredVariants
      }
    }

  }

}
