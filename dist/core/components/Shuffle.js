import CompositeComponent from './abstract/CompositeComponent.js';
import { postProcessCopy } from '../utils/copy.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { processAssignNames } from '../utils/serializedStateProcessing.js';
import { enumerateCombinations, enumeratePermutations } from '../utils/enumeration.js';
import { setUpVariantSeedAndRng } from '../utils/variants.js';

export default class Shuffle extends CompositeComponent {
  static componentType = "shuffle";

  static createsVariants = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";
  static assignNamesToReplacements = true;

  
  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number"
    }

    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "anything",
      componentTypes: ["_base"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.originalComponentNames = {
      additionalStateVariablesDefined: ["nComponents"],
      returnDependencies: () => ({
        children: {
          dependencyType: "child",
          childGroups: ["anything"],
          variableNames: ["componentNamesInList"],
          variablesOptional: true
        }
      }),
      definition({ dependencyValues }) {
        let originalComponentNames = [];
        for (let child of dependencyValues.children) {
          if (child.stateValues.componentNamesInList) {
            originalComponentNames.push(...child.stateValues.componentNamesInList)
          } else {
            originalComponentNames.push(child.componentName);
          }
        }

        return { setValue: { originalComponentNames, nComponents: originalComponentNames.length } }
      }
    }


    stateVariableDefinitions.componentOrder = {
      returnDependencies({ sharedParameters }) {
        let dependencies = {
          variantSeed: {
            dependencyType: "value",
            value: sharedParameters.variantSeed
          },
          rngClass: {
            dependencyType: "value",
            value: sharedParameters.rngClass,
            doNotProxy: true
          },
          nComponents: {
            dependencyType: "stateVariable",
            variableName: "nComponents"
          },
          variants: {
            dependencyType: "variants",
          },

        };
        return dependencies;
      },
      definition({ dependencyValues }) {
        let nComponents = dependencyValues.nComponents;

        // if desiredIndices is specfied, use those
        let desiredComponentOrder = dependencyValues.variants?.desiredVariant?.indices;
        if (desiredComponentOrder !== undefined) {
          if (desiredComponentOrder.length !== nComponents) {
            console.warn("Ignoring indices specified for shuffle as number of indices doesn't match number of components.")
          } else {
            desiredComponentOrder = desiredComponentOrder.map(Number);
            if (!desiredComponentOrder.every(Number.isInteger)) {
              throw Error("All indices specified for shuffle must be integers");
            }
            if (!desiredComponentOrder.every(x => x >= 1 && x <= nComponents)) {
              console.warn("Ignoring indices specified for shuffle as some indices out of range.")
            } else {

              return {
                setValue: {
                  componentOrder: desiredComponentOrder,
                },
              }
            }
          }
        }

        let variantRng = dependencyValues.rngClass(dependencyValues.variantSeed + "co");

        // https://stackoverflow.com/a/12646864
        let componentOrder = [...Array(nComponents).keys()].map(x => x + 1)
        for (let i = nComponents - 1; i > 0; i--) {
          const rand = variantRng();
          const j = Math.floor(rand * (i + 1));
          [componentOrder[i], componentOrder[j]] = [componentOrder[j], componentOrder[i]];
        }


        return {
          setValue: {
            componentOrder
          }
        }
      }
    }

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        sortedValues: {
          dependencyType: "stateVariable",
          variableName: "componentOrder"
        }
      }),
      markStale: () => ({ updateReplacements: true }),
      definition: function () {
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    }


    stateVariableDefinitions.generatedVariantInfo = {
      additionalStateVariablesDefined: ["isVariantComponent"],
      returnDependencies: ({ componentInfoObjects, sharedParameters }) => ({
        variantSeed: {
          dependencyType: "value",
          value: sharedParameters.variantSeed,
        },
        componentOrder: {
          dependencyType: "stateVariable",
          variableName: "componentOrder"
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
          meta: { createdBy: componentName },
          indices: dependencyValues.componentOrder,
        };

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


    return stateVariableDefinitions;
  }


  static async setUpVariant({
    serializedComponent, sharedParameters,
    descendantVariantComponents,
  }) {

    setUpVariantSeedAndRng({
      serializedComponent, sharedParameters,
      descendantVariantComponents
    });

  }



  static async createSerializedReplacements({ component, components,
    componentInfoObjects, workspace
  }) {

    let replacements = [];

    let componentsCopied = [];

    let originalComponentNames = await component.stateValues.originalComponentNames;

    for (let ind of await component.stateValues.componentOrder) {
      let replacementSource = components[originalComponentNames[ind - 1]];

      if (replacementSource) {

        componentsCopied.push(replacementSource.componentName);

        replacements.push(await replacementSource.serialize({
          sourceAttributesToIgnoreRecursively: ["isResponse"]
        }))
      }
    }

    workspace.uniqueIdentifiersUsed = [];
    replacements = postProcessCopy({
      serializedComponents: replacements,
      componentName: component.componentName,
      uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed,
      addShadowDependencies: true,
      markAsPrimaryShadow: true,
    })



    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: await component.stateValues.newNamespace,
      componentInfoObjects,
    });

    workspace.componentsCopied = componentsCopied;

    return { replacements: processResult.serializedComponents };


  }

  static async calculateReplacementChanges({ component, components,
    componentInfoObjects, workspace
  }) {

    let componentsToCopy = [];

    let originalComponentNames = await component.stateValues.originalComponentNames;

    for (let ind of await component.stateValues.componentOrder) {
      let replacementSource = components[originalComponentNames[ind - 1]];

      if (replacementSource) {

        componentsToCopy.push(replacementSource.componentName);

      }
    }



    if (componentsToCopy.length == workspace.componentsCopied.length &&
      workspace.componentsCopied.every((x, i) => x === componentsToCopy[i])
    ) {
      return [];
    }

    // for now, just recreate
    let replacements = (await this.createSerializedReplacements({
      component, components,
      componentInfoObjects, workspace
    })).replacements;

    let replacementChanges = [{
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: component.replacements.length,
      serializedReplacements: replacements,
    }];

    return replacementChanges;

  }


  static determineNumberOfUniqueVariants({
    serializedComponent, componentInfoObjects
  }) {


    let nComponents = 0;

    for (let child of serializedComponent.children) {

      if (componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: child.componentType,
        baseComponentType: "_composite"
      })) {

        if (child.attributes.createComponentOfType?.primitive) {
          if (child.attributes.nComponents?.primitive !== undefined) {
            let newComponents = Number(child.attributes.nComponents?.primitive);
            if (Number.isInteger(newComponents) && newComponents >= 0) {
              nComponents += newComponents;
            } else {
              return { success: false }
            }
          } else {
            nComponents++;
          }
        } else {
          return { success: false }
        }

      } else {
        nComponents++;
      }

    }

    let numberOfPermutations = 1;
    for (let i = 2; i <= nComponents; i++) {
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
      nComponents
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


    let numberOfVariantsByDescendant = serializedComponent.variants.uniqueVariantData.numberOfVariantsByDescendant;
    let descendantVariantComponents = serializedComponent.variants.descendantVariantComponents;
    let numberOfPermutations = serializedComponent.variants.uniqueVariantData.numberOfPermutations;
    let nComponents = serializedComponent.variants.uniqueVariantData.nComponents;

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
    let indicesToPermute = [...Array(nComponents).keys()].map(x => x + 1);

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