import BlockComponent from './BlockComponent';
import { getVariantsForDescendantsForUniqueVariants, setUpVariantSeedAndRng } from '../../utils/variants';
import { numberToLetters } from '../../utils/sequence';
import { returnStyleDefinitionStateVariables } from '../../utils/style';
import { returnFeedbackDefinitionStateVariables } from '../../utils/feedback';

export default class SectioningComponent extends BlockComponent {
  static componentType = "_sectioningComponent";
  static renderChildren = true;

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
        suppressAutoName: {
          dependencyType: "stateVariable",
          variableName: "suppressAutoName"
        },
        suppressAutoNumber: {
          dependencyType: "stateVariable",
          variableName: "suppressAutoNumber"
        },
        prerender: {
          dependencyType: "value",
          value: sharedParameters.prerender
        }
      }),
      definition({ dependencyValues }) {

        let titlePrefix = "";
        let title = "";
        if (dependencyValues.suppressAutoNumber || dependencyValues.prerender) {
          if (!dependencyValues.suppressAutoName) {
            titlePrefix = dependencyValues.sectionName;
          }
        } else {
          if (!dependencyValues.suppressAutoName) {
            titlePrefix = dependencyValues.sectionName + " ";
          }
          titlePrefix += dependencyValues.sectionNumber;
        }


        if (dependencyValues.titleChild.length === 0) {
          title = titlePrefix;
        } else {

          if (titlePrefix) {
            if (dependencyValues.suppressAutoName) {
              titlePrefix += ". "
            } else {
              titlePrefix += ": "
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
        variantControlChild: {
          dependencyType: "child",
          childGroups: ["variantControls"],
          variableNames: ["selectedVariantIndex", "selectedVariantName"]
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

        if (dependencyValues.variantControlChild.length === 0) {
          generatedVariantInfo.seed = dependencyValues.variantSeed;

        } else {
          generatedVariantInfo.index = dependencyValues.variantControlChild[0].stateValues.selectedVariantIndex;
          generatedVariantInfo.name = dependencyValues.variantControlChild[0].stateValues.selectedVariantName;

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

  static async setUpVariant({
    serializedComponent, sharedParameters, definingChildrenSoFar,
    descendantVariantComponents,
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
      // so don't actually control variants
      // just calculate a seed

      setUpVariantSeedAndRng({
        serializedComponent, sharedParameters,
        descendantVariantComponents
      });


    } else {
      sharedParameters.variantSeed = await variantControlChild.state.selectedSeed.value;
      sharedParameters.variantName = await variantControlChild.state.selectedVariantName.value;
      sharedParameters.variantIndex = await variantControlChild.state.selectedVariantIndex.value;
      sharedParameters.variantRng = await variantControlChild.state.variantRng.value;
      sharedParameters.allPossibleVariants = await variantControlChild.state.variantNames.value;
      sharedParameters.variantIndicesToIgnore = await variantControlChild.state.variantIndicesToIgnore.value;
    }

    // console.log("****Variant for sectioning component****")
    // console.log("Selected seed: " + variantControlChild.stateValues.selectedSeed);
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

  static determineNumberOfUniqueVariants({ serializedComponent, componentInfoObjects }) {

    if (serializedComponent.variants === undefined) {
      serializedComponent.variants = {};
    }

    let variantControlChild;
    for (let child of serializedComponent.children) {
      if (child.componentType === "variantControl") {
        variantControlChild = child;
        break;
      }
    }

    if (!variantControlChild) {
      return super.determineNumberOfUniqueVariants({ serializedComponent, componentInfoObjects });
    }

    let numberOfVariants = variantControlChild.attributes.nVariants?.primitive;

    if (numberOfVariants === undefined) {
      numberOfVariants = 100;
    }

    let numberOfVariantsPreIgnore = numberOfVariants;

    let indicesToIgnore = [];
    if (variantControlChild.attributes.variantIndicesToIgnore) {
      indicesToIgnore = variantControlChild.attributes.variantIndicesToIgnore.component
        .children.map(Number)
        .filter(x => Number.isInteger(x) && x >= 1 && x <= numberOfVariants)
        .sort((a, b) => a - b);
    }

    if (!variantControlChild.attributes.uniqueVariants?.primitive) {
      if (indicesToIgnore.length > 0) {
        serializedComponent.variants.indicesToIgnore = indicesToIgnore;
        numberOfVariants -= indicesToIgnore.length;
      }
      serializedComponent.variants.numberOfVariantsPreIgnore = numberOfVariantsPreIgnore;
      serializedComponent.variants.numberOfVariants = numberOfVariants;
      return { success: true, numberOfVariants, numberOfVariantsPreIgnore }
    }


    let result = super.determineNumberOfUniqueVariants({ serializedComponent, componentInfoObjects });

    if (!result.success) {
      // even if didn't successfully determine number of unique variants
      // still report it as a success, as will have exactly number of variants
      // given by the variant control
      if (indicesToIgnore.length > 0) {
        serializedComponent.variants.indicesToIgnore = indicesToIgnore;
        numberOfVariants -= indicesToIgnore.length;
      }
      serializedComponent.variants.numberOfVariantsPreIgnore = numberOfVariantsPreIgnore;
      serializedComponent.variants.numberOfVariants = numberOfVariants;
      return { success: true, numberOfVariants, numberOfVariantsPreIgnore }
    }

    numberOfVariants = Math.min(result.numberOfVariants, numberOfVariants);
    numberOfVariantsPreIgnore = numberOfVariants;

    if (indicesToIgnore.length > 0) {
      indicesToIgnore = indicesToIgnore.filter(x => x <= numberOfVariants);
      if (indicesToIgnore.length > 0) {
        serializedComponent.variants.indicesToIgnore = indicesToIgnore;
        numberOfVariants -= indicesToIgnore.length;
      }
    }

    serializedComponent.variants.numberOfVariantsPreIgnore = numberOfVariantsPreIgnore;
    serializedComponent.variants.numberOfVariants = numberOfVariants;
    serializedComponent.variants.uniqueVariants = true;

    // console.log("Actual number of variants for section is " + numberOfVariants)

    return {
      success: true,
      numberOfVariants,
      numberOfVariantsPreIgnore
    };


  }

  static getUniqueVariant({ serializedComponent, variantIndex, componentInfoObjects }) {

    let numberOfVariants = serializedComponent.variants?.numberOfVariants;
    if (numberOfVariants === undefined) {
      return { success: false }
    }

    if (serializedComponent.variants.desiredVariantFromDocument) {
      numberOfVariants = serializedComponent.variants.numberOfVariantsPreIgnore;
    }

    if (!Number.isInteger(variantIndex) || variantIndex < 1 || variantIndex > numberOfVariants) {
      return { success: false }
    }



    let variantControlChild;
    for (let child of serializedComponent.children) {
      if (child.componentType === "variantControl") {
        variantControlChild = child;
        break;
      }
    }

    if (!variantControlChild) {
      return super.getUniqueVariant({ serializedComponent, variantIndex, componentInfoObjects });
    }

    if (!serializedComponent.variants.desiredVariantFromDocument) {
      if (serializedComponent.variants.indicesToIgnore) {
        // adjust variantIndex so it counts only non-ignored indices
        for (let ind of serializedComponent.variants.indicesToIgnore) {
          if (variantIndex >= ind) {
            variantIndex++;
          } else {
            break;
          }
        }
      }
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
      variantIndex,
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

  static includeBlankStringChildren = true;

}
