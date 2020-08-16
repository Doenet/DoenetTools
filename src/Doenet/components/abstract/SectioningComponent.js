import BlockComponent from './BlockComponent';
import { getVariantsForDescendants } from '../../utils/variants';

export default class SectioningComponent extends BlockComponent {
  static componentType = "_sectioningcomponent";

  static setUpVariantIfVariantControlChild = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.aggregateScores = { default: false };
    properties.weight = { default: 1 };
    // properties.possiblepoints = {default: undefined};
    // properties.aggregatebypoints = {default: false};
    properties.feedbackDefinitions = { propagateToDescendants: true, mergeArrays: true }
    properties.styleDefinitions = { propagateToDescendants: true, mergeArrays: true }
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneVariantControl = childLogic.newLeaf({
      name: "atMostOneVariantControl",
      componentType: "variantcontrol",
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

    let anything = childLogic.newLeaf({
      name: 'anything',
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "variantTitleAndAnything",
      operator: "and",
      propositions: [atMostOneVariantControl, atMostOneTitle, anything],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.title = {
      public: true,
      componentType: "text",
      forRenderer: true,
      returnDependencies: () => ({
        titleChild: {
          dependencyType: "childStateVariables",
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
          dependencyType: "descendantStateVariables",
          componentTypes: ["_sectioningcomponent", "answer"],
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

    stateVariableDefinitions.displayDigitsForCreditAchieved = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { displayDigitsForCreditAchieved: 3 } })
    }

    stateVariableDefinitions.creditAchieved = {
      public: true,
      componentType: "number",
      defaultValue: 0,
      stateVariablesPrescribingAdditionalProperties: {
        displayDigits: "displayDigitsForCreditAchieved",
      },
      additionalStateVariablesDefined: [{
        variableName: "percentCreditAchieved",
        public: true,
        componentType: "number",
        stateVariablesPrescribingAdditionalProperties: {
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
          for (let [ind, descendant] of stateValues.scoredDescendants.entries()) {
            dependencies["creditAchieved" + ind] = {
              dependencyType: "componentStateVariable",
              componentIdentity: descendant,
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

        let creditSum = 0;
        let totalWeight = 0;

        for (let [ind, component] of dependencyValues.scoredDescendants.entries()) {
          let weight = component.stateValues.weight;
          creditSum += dependencyValues["creditAchieved" + ind] * weight;
          totalWeight += weight;
        }
        let creditAchieved = creditSum / totalWeight;
        let percentCreditAchieved = creditAchieved * 100;

        return { newValues: { creditAchieved, percentCreditAchieved } }

      }
    }

    stateVariableDefinitions.selectedVariantInfo = {
      additionalStateVariablesDefined: ["isVariantComponent"],
      returnDependencies: ({ componentInfoObjects }) => ({
        variantControlChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneVariantControl",
          variableNames: ["selectedVariantNumber"]
        },
        variantDescendants: {
          dependencyType: "descendantStateVariables",
          componentTypes: Object.keys(componentInfoObjects.componentTypeWithPotentialVariants),
          variableNames: [
            "isVariantComponent",
            "selectedVariantInfo",
          ],
          recurseToMatchedChildren: false,
          variablesOptional: true,
          includeNonActiveChildren: true,
          ignoreReplacementsOfMatchedComposites: true,
          definingChildrenFirst: true,
        }
      }),
      definition({ dependencyValues }) {

        let isVariantComponent;
        let selectedVariantInfo = {};
        if (dependencyValues.variantControlChild.length === 1) {
          isVariantComponent = true;
          selectedVariantInfo.index = dependencyValues.variantControlChild[0].stateValues.selectedVariantNumber;
        } else {
          isVariantComponent = false;
        }

        let subvariants = selectedVariantInfo.subvariants = [];

        for (let descendant of dependencyValues.variantDescendants) {
          if (descendant.stateValues.isVariantComponent) {
            subvariants.push(descendant.stateValues.selectedVariantInfo)
          } else if (descendant.stateValues.selectedVariantInfo) {
            subvariants.push(...descendant.stateValues.selectedVariantInfo.subvariants)
          }

        }
        return { newValues: { selectedVariantInfo, isVariantComponent } }

      }
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        titleChild: {
          dependencyType: "childIdentity",
          childLogicName: "atMostOneTitle"
        },
        activeChildren: {
          dependencyType: "childIdentity",
          childLogicName: "anything"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues:
          {
            childrenToRender:
              [...dependencyValues.titleChild, ...dependencyValues.activeChildren]
                .map(x => x.componentName)
          }
        };
      }
    }



    return stateVariableDefinitions;
  }

  static setUpVariant({ serializedComponent, sharedParameters, definingChildrenSoFar,
    allComponentClasses }) {
    let variantcontrolChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "variantcontrol") {
        variantcontrolChild = child;
        break;
      }
    }
    sharedParameters.variant = variantcontrolChild.state.selectedVariant.value;
    sharedParameters.variantNumber = variantcontrolChild.state.selectedVariantNumber.value;
    sharedParameters.selectRng = variantcontrolChild.state.selectRng.value;
    sharedParameters.allPossibleVariants = variantcontrolChild.state.variants.value;

    // console.log("****Variant for sectioning component****")
    // console.log("Selected seed: " + variantcontrolChild.state.selectedSeed);
    console.log("Variant for " + this.componentType + ": " + sharedParameters.variant);

    // if subvariants were specified, add those the corresponding descendants
    let desiredVariant = serializedComponent.variants.desiredVariant;

    if (desiredVariant === undefined) {
      desiredVariant = {};
    }

    // if subvariants aren't defined but we have uniquevariants specified
    // then calculate variant information for the descendant variant component
    if (desiredVariant.subvariants === undefined && serializedComponent.variants.uniquevariants) {
      let variantInfo = this.getUniqueVariant({
        serializedComponent: serializedComponent,
        variantNumber: sharedParameters.variantNumber,
        allComponentClasses: allComponentClasses,
      })
      if (variantInfo.success) {
        Object.assign(desiredVariant, variantInfo.desiredVariant);
      }
    }

    if (desiredVariant !== undefined && desiredVariant.subvariants !== undefined &&
      serializedComponent.variants.descendantVariantComponents !== undefined) {
      for (let ind in desiredVariant.subvariants) {
        let subvariant = desiredVariant.subvariants[ind];
        let variantComponent = serializedComponent.variants.descendantVariantComponents[ind];
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
      if (child.componentType === "variantcontrol" || (
        child.createdComponent && components[child.componentName].componentType === "variantcontrol"
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
    if (variantControlChild.children !== undefined) {
      for (let child of variantControlChild.children) {
        if (child.componentType === "nvariants") {
          // calculate nvariants only if has its value set directly 
          // or if has a single child that is a string
          let foundValid = false;
          if (child.state !== undefined && child.state.value !== undefined) {
            numberOfVariants = Math.round(Number(child.state.value));
            foundValid = true;
          }
          // children overwrite state
          if (child.children !== undefined && child.children.length === 1 &&
            child.children[0].componentType === "string") {
            numberOfVariants = Math.round(Number(child.children[0].state.value));
            foundValid = true;
          }
          if (!foundValid) {
            return { success: false }
          }
          break;
        }
      }
    }

    // check if uniquevariants is already be defined in variants
    if (serializedComponent.variants === undefined) {
      serializedComponent.variants = {};
    }

    let uniqueVariantData;
    if (serializedComponent.variants.uniquevariants) {
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

  static getUniqueVariant({ serializedComponent, variantNumber, allComponentClasses }) {
    if (serializedComponent.variants === undefined) {
      return { succes: false }
    }
    let numberOfVariants = serializedComponent.variants.numberOfVariants;
    if (numberOfVariants === undefined) {
      return { success: false }
    }

    if (!Number.isInteger(variantNumber) || variantNumber < 0 || variantNumber >= numberOfVariants) {
      return { success: false }
    }

    let desiredVariant = {
      index: variantNumber,
    }

    if (serializedComponent.variants.uniquevariants) {

      let result = getVariantsForDescendants({
        variantNumber: variantNumber,
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