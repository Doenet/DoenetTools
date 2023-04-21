import CompositeComponent from "./abstract/CompositeComponent";
import {
  enumerateSelectionCombinations,
  enumerateCombinations,
} from "../utils/enumeration";
import { deepClone } from "../utils/deepFunctions";
import {
  markToCreateAllUniqueNames,
  processAssignNames,
} from "../utils/serializedStateProcessing";
import { returnGroupIntoComponentTypeSeparatedBySpaces } from "./commonsugar/lists";
import { gatherVariantComponents } from "../utils/variants";

export default class Select extends CompositeComponent {
  static componentType = "select";

  // static assignNewNamespaceToAllChildrenExcept = Object.keys(this.createAttributesObject()).map(x => x.toLowerCase());
  static assignNamesToReplacements = true;

  static createsVariants = true;

  static includeBlankStringChildren = true;
  static removeBlankStringChildrenPostSugar = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number",
    };
    attributes.numberToSelect = {
      createComponentOfType: "integer",
      createStateVariable: "numberToSelect",
      defaultValue: 1,
      public: true,
    };
    attributes.withReplacement = {
      createComponentOfType: "boolean",
      createStateVariable: "withReplacement",
      defaultValue: false,
      public: true,
    };
    attributes.type = {
      createPrimitiveOfType: "string",
    };
    attributes.addLevelToAssignNames = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "addLevelToAssignNames",
      defaultValue: false,
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    function breakStringsMacrosIntoOptionsBySpaces({
      matchedChildren,
      componentAttributes,
      componentInfoObjects,
    }) {
      // only if all children are strings or options
      if (
        !matchedChildren.every(
          (child) =>
            typeof child === "string" ||
            (child.doenetAttributes && child.doenetAttributes.createdFromMacro),
        )
      ) {
        return { success: false };
      }

      let type;
      if (componentAttributes.type) {
        type = componentAttributes.type;
      } else {
        type = "math";
      }

      if (!["math", "text", "number", "boolean"].includes(type)) {
        console.warn(`Invalid type ${type}`);
        type = "math";
      }

      // break any string by white space and wrap pieces with option and type
      let groupIntoComponentTypesSeparatedBySpaces =
        returnGroupIntoComponentTypeSeparatedBySpaces({
          componentType: type,
          forceComponentType: true,
        });
      let result = groupIntoComponentTypesSeparatedBySpaces({
        matchedChildren,
        componentInfoObjects,
      });

      if (result.success) {
        let newChildren = result.newChildren.map((child) => ({
          componentType: "option",
          children: [child],
        }));

        let newAttributes = {
          addLevelToAssignNames: {
            primitive: true,
          },
        };

        return {
          success: true,
          newChildren,
          newAttributes,
        };
      } else {
        return { success: false };
      }
    }

    sugarInstructions.push({
      replacementFunction: breakStringsMacrosIntoOptionsBySpaces,
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "options",
        componentTypes: ["option"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.variants = {
      returnDependencies: () => ({
        variants: {
          dependencyType: "variants",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { variants: dependencyValues.variants } };
      },
    };

    stateVariableDefinitions.currentVariantName = {
      returnDependencies: ({ sharedParameters }) => ({
        variantName: {
          dependencyType: "value",
          value: sharedParameters.variantName,
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { currentVariantName: dependencyValues.variantName },
      }),
    };

    stateVariableDefinitions.allVariantNames = {
      returnDependencies: ({ sharedParameters }) => ({
        allVariantNames: {
          dependencyType: "value",
          value: sharedParameters.allVariantNames,
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { allVariantNames: dependencyValues.allVariantNames },
      }),
    };

    stateVariableDefinitions.nOptions = {
      additionalStateVariablesDefined: ["optionChildren"],
      returnDependencies: () => ({
        optionChildren: {
          dependencyType: "child",
          childGroups: ["options"],
          variableNames: ["selectForVariants", "selectWeight"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            optionChildren: dependencyValues.optionChildren,
            nOptions: dependencyValues.optionChildren.length,
          },
        };
      },
    };

    stateVariableDefinitions.availableVariants = {
      returnDependencies: () => ({
        optionChildren: {
          dependencyType: "stateVariable",
          variableName: "optionChildren",
        },
        numberToSelect: {
          dependencyType: "stateVariable",
          variableName: "numberToSelect",
        },
        allVariantNames: {
          dependencyType: "stateVariable",
          variableName: "allVariantNames",
        },
      }),
      definition: function ({ dependencyValues }) {
        let availableVariants = {};
        for (let [
          ind,
          optionChild,
        ] of dependencyValues.optionChildren.entries()) {
          for (let variantName of optionChild.stateValues.selectForVariants) {
            let variantLower = variantName.toLowerCase();
            if (availableVariants[variantLower] === undefined) {
              availableVariants[variantLower] = [];
            }
            availableVariants[variantLower].push(ind + 1);
          }
        }

        for (let variantName in availableVariants) {
          if (
            availableVariants[variantName].length !==
            dependencyValues.numberToSelect
          ) {
            throw Error(
              "Invalid variant name for select.  Variant name " +
                variantName +
                " appears in " +
                availableVariants[variantName].length +
                " options but number to select is " +
                numberToSelect,
            );
          }
        }

        if (Object.keys(availableVariants).length > 0) {
          // if have at least one variant specified,
          // then require that all possible variants have a variant specified
          for (let variantName of dependencyValues.allVariantNames) {
            if (!(variantName in availableVariants)) {
              throw Error(
                "Some variants are specified for select but no options are specified for possible variant name: " +
                  variantName,
              );
            }
          }
          for (let variantName in availableVariants) {
            if (!dependencyValues.allVariantNames.includes(variantName)) {
              throw Error(
                "Variant name " +
                  variantName +
                  " that is specified for select is not a possible variant name.",
              );
            }
          }
        }

        return {
          setValue: { availableVariants },
        };
      },
    };

    stateVariableDefinitions.selectedIndices = {
      immutable: true,
      hasEssential: true,
      shadowVariable: true,
      returnDependencies: ({ sharedParameters }) => ({
        numberToSelect: {
          dependencyType: "stateVariable",
          variableName: "numberToSelect",
        },
        withReplacement: {
          dependencyType: "stateVariable",
          variableName: "withReplacement",
        },
        optionChildren: {
          dependencyType: "stateVariable",
          variableName: "optionChildren",
        },
        nOptions: {
          dependencyType: "stateVariable",
          variableName: "nOptions",
        },
        currentVariantName: {
          dependencyType: "stateVariable",
          variableName: "currentVariantName",
        },
        variants: {
          dependencyType: "stateVariable",
          variableName: "variants",
        },
        availableVariants: {
          dependencyType: "stateVariable",
          variableName: "availableVariants",
        },
        variantRng: {
          dependencyType: "value",
          value: sharedParameters.variantRng,
          doNotProxy: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        // console.log(`definition of selected Indices`)
        // console.log(dependencyValues);

        if (
          !(dependencyValues.numberToSelect >= 1) ||
          dependencyValues.nOptions === 0
        ) {
          return {
            setEssentialValue: { selectedIndices: [] },
            setValue: { selectedIndices: [] },
          };
        }

        // if desiredIndices is specfied, use those
        if (
          dependencyValues.variants &&
          dependencyValues.variants.desiredVariant !== undefined
        ) {
          let desiredIndices = dependencyValues.variants.desiredVariant.indices;
          if (desiredIndices !== undefined) {
            if (desiredIndices.length !== dependencyValues.numberToSelect) {
              throw Error(
                "Number of indices specified for select must match number to select",
              );
            }
            desiredIndices = desiredIndices.map(Number);
            if (!desiredIndices.every(Number.isInteger)) {
              throw Error("All indices specified for select must be integers");
            }
            let n = dependencyValues.nOptions;
            desiredIndices = desiredIndices.map(
              (x) => ((((x - 1) % n) + n) % n) + 1,
            );

            return {
              setEssentialValue: { selectedIndices: desiredIndices },
              setValue: { selectedIndices: desiredIndices },
            };
          }
        }

        // first check if have a variant for which options are specified
        let variantOptions =
          dependencyValues.availableVariants[
            dependencyValues.currentVariantName
          ];

        if (variantOptions !== undefined) {
          if (dependencyValues.numberToSelect > 1) {
            // shallow copy to remove proxy so can shuffle
            variantOptions = [...variantOptions];

            // first shuffle the array of indices
            // https://stackoverflow.com/a/12646864
            for (let i = dependencyValues.numberToSelect - 1; i > 0; i--) {
              const rand = dependencyValues.variantRng();
              const j = Math.floor(rand * (i + 1));
              [variantOptions[i], variantOptions[j]] = [
                variantOptions[j],
                variantOptions[i],
              ];
            }
          }
          return {
            setEssentialValue: { selectedIndices: variantOptions },
            setValue: { selectedIndices: variantOptions },
          };
        }

        let selectedIndices = [];

        let numberUniqueRequired = 1;
        if (!dependencyValues.withReplacement) {
          numberUniqueRequired = dependencyValues.numberToSelect;
        }

        if (numberUniqueRequired > dependencyValues.nOptions) {
          throw Error(
            "Cannot select " +
              numberUniqueRequired +
              " components from only " +
              dependencyValues.nOptions,
          );
        }

        // normalize selectWeights to sum to 1
        let selectWeightByChild = dependencyValues.optionChildren.map(
          (x) => x.stateValues.selectWeight,
        );
        let totalWeight = selectWeightByChild.reduce((a, c) => a + c);
        selectWeightByChild = selectWeightByChild.map((x) => x / totalWeight);

        //https://stackoverflow.com/a/44081700
        let cumulativeWeights = selectWeightByChild.reduce(
          (a, x, i) => [...a, x + (a[i - 1] || 0)],
          [],
        );
        let indsRemaining = [...Array(cumulativeWeights.length).keys()].map(
          (x) => x + 1,
        );

        for (let ind = 0; ind < dependencyValues.numberToSelect; ind++) {
          // random number in [0, 1)
          let rand = dependencyValues.variantRng();

          // find largest index where cumulativeWeight is larger than rand
          // using binary search
          let start = -1,
            end = cumulativeWeights.length - 1;
          while (start < end - 1) {
            let mid = Math.floor((start + end) / 2); // mid point
            if (cumulativeWeights[mid] > rand) {
              end = mid;
            } else {
              start = mid;
            }
          }

          let selectedInd = indsRemaining[end];
          selectedIndices.push(selectedInd);

          if (
            !dependencyValues.withReplacement &&
            ind < dependencyValues.numberToSelect - 1
          ) {
            // remove selected index and renormalize weights
            selectWeightByChild.splice(end, 1);
            indsRemaining.splice(end, 1);
            totalWeight = selectWeightByChild.reduce((a, c) => a + c);
            selectWeightByChild = selectWeightByChild.map(
              (x) => x / totalWeight,
            );
            cumulativeWeights = selectWeightByChild.reduce(
              (a, x, i) => [...a, x + (a[i - 1] || 0)],
              [],
            );
          }
        }

        return {
          setEssentialValue: { selectedIndices },
          setValue: { selectedIndices },
        };
      },
    };

    stateVariableDefinitions.isVariantComponent = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { isVariantComponent: true } }),
    };

    stateVariableDefinitions.generatedVariantInfo = {
      providePreviousValuesInDefinition: true,
      returnDependencies: ({ componentInfoObjects }) => ({
        selectedIndices: {
          dependencyType: "stateVariable",
          variableName: "selectedIndices",
        },
        variantDescendants: {
          dependencyType: "descendant",
          componentTypes: Object.keys(
            componentInfoObjects.componentTypesCreatingVariants,
          ),
          variableNames: ["isVariantComponent", "generatedVariantInfo"],
          useReplacementsForComposites: true,
          recurseToMatchedChildren: false,
          variablesOptional: true,
          includeNonActiveChildren: true,
          ignoreReplacementsOfEncounteredComposites: true,
        },
      }),
      definition({ dependencyValues, componentName, previousValues }) {
        let generatedVariantInfo = {
          indices: dependencyValues.selectedIndices,
          meta: { createdBy: componentName },
        };

        let subvariants = (generatedVariantInfo.subvariants = []);

        for (let descendant of dependencyValues.variantDescendants) {
          if (descendant.stateValues.isVariantComponent) {
            subvariants.push(descendant.stateValues.generatedVariantInfo);
          } else if (descendant.stateValues.generatedVariantInfo) {
            subvariants.push(
              ...descendant.stateValues.generatedVariantInfo.subvariants,
            );
          }
        }

        for (let [ind, subvar] of subvariants.entries()) {
          if (!subvar.subvariants && previousValues.generatedVariantInfo) {
            // check if previously had subvariants
            let previousSubvariants =
              previousValues.generatedVariantInfo.subvariants;
            if (previousSubvariants[ind].subvariants) {
              subvariants[ind] = Object.assign({}, subvariants[ind]);
              subvariants[ind].subvariants =
                previousSubvariants[ind].subvariants;
            }
          }
        }

        return { setValue: { generatedVariantInfo } };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        selectedIndices: {
          dependencyType: "stateVariable",
          variableName: "selectedIndices",
        },
      }),
      definition() {
        return {
          setValue: { readyToExpandWhenResolved: true },
        };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    components,
    componentInfoObjects,
  }) {
    // console.log(`create serialized replacements for ${component.componentName}`);

    let replacements = [];

    let optionChildren = await component.stateValues.optionChildren;

    for (let selectedIndex of await component.stateValues.selectedIndices) {
      let selectedChildName = optionChildren[selectedIndex - 1].componentName;

      let selectedChild = components[selectedChildName];

      let serializedGrandchildren = deepClone(
        await selectedChild.stateValues.serializedChildren,
      );
      let serializedChild = {
        componentType: "option",
        state: { rendered: true },
        doenetAttributes: Object.assign({}, selectedChild.doenetAttributes),
        children: serializedGrandchildren,
        originalName: selectedChildName,
      };

      if (selectedChild.attributes.newNamespace) {
        serializedChild.attributes = { newNamespace: { primitive: true } };
      }

      replacements.push(serializedChild);
    }

    let descendantVariantComponents = gatherVariantComponents({
      serializedComponents: replacements,
      componentInfoObjects,
    });

    // if subvariants were specified, add those the corresponding descendants
    if (component.variants && component.variants.desiredVariant !== undefined) {
      let desiredVariant = component.variants.desiredVariant;
      if (
        desiredVariant !== undefined &&
        desiredVariant.subvariants !== undefined
      ) {
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

    let newNamespace = component.attributes.newNamespace?.primitive;

    let assignNames = component.doenetAttributes.assignNames;

    if (assignNames && (await component.stateValues.addLevelToAssignNames)) {
      assignNames = assignNames.map((x) => [x]);
    }

    for (let rep of replacements) {
      if (!rep.attributes?.newNamespace?.primitive && rep.children) {
        markToCreateAllUniqueNames(rep.children);
      }
    }

    let newReplacements = [];

    for (let [ind, rep] of replacements.entries()) {
      let processResult = processAssignNames({
        assignNames,
        serializedComponents: [rep],
        parentName: component.componentName,
        parentCreatesNewNamespace: newNamespace,
        componentInfoObjects,
        indOffset: ind,
      });

      newReplacements.push(processResult.serializedComponents[0]);
    }

    return { replacements: newReplacements };
  }

  static calculateReplacementChanges() {
    return [];
  }

  static determineNumberOfUniqueVariants({
    serializedComponent,
    componentInfoObjects,
  }) {
    let numberOfVariants = serializedComponent.variants?.numberOfVariants;

    if (numberOfVariants !== undefined) {
      return { success: true, numberOfVariants };
    }

    let numberToSelect = 1,
      withReplacement = false;

    let numberToSelectComponent =
      serializedComponent.attributes.numberToSelect?.component;
    if (numberToSelectComponent) {
      // only implemented if have an integer with a single string child
      if (
        numberToSelectComponent.componentType === "integer" &&
        numberToSelectComponent.children?.length === 1 &&
        typeof numberToSelectComponent.children[0] === "string"
      ) {
        numberToSelect = Number(numberToSelectComponent.children[0]);

        if (!(Number.isInteger(numberToSelect) && numberToSelect >= 0)) {
          console.log(
            `cannot determine unique variants of selectFromSequence as numberToSelect isn't a non-negative integer.`,
          );
          return { success: false };
        }
      } else {
        console.log(
          `cannot determine unique variants of selectFromSequence as numberToSelect isn't constant number.`,
        );
        return { success: false };
      }
    }

    let withReplacementComponent =
      serializedComponent.attributes.withReplacement?.component;
    if (withReplacementComponent) {
      // only implemented if have an boolean with a boolean value or a single string child
      if (withReplacementComponent.componentType === "boolean") {
        if (
          withReplacementComponent.children?.length === 1 &&
          typeof withReplacementComponent.children[0] === "string"
        ) {
          withReplacement =
            withReplacementComponent.children[0].toLowerCase() === "true";
        } else if (
          (withReplacementComponent.children === undefined ||
            withReplacementComponent.children.length === 0) &&
          typeof withReplacementComponent.state?.value === "boolean"
        ) {
          withReplacement = withReplacementComponent.state.value;
        } else {
          console.log(
            `cannot determine unique variants of selectFromSequence as withReplacement isn't constant boolean.`,
          );
          return { success: false };
        }
      } else {
        console.log(
          `cannot determine unique variants of selectFromSequence as withReplacement isn't constant boolean.`,
        );
        return { success: false };
      }
    }

    for (let child of serializedComponent.children) {
      if (
        child.attributes?.selectWeight ||
        child.attributes?.selectForVariants
      ) {
        // uniqueVariants disabled if have a child with selectWeight or selectForVariants specified
        console.log(
          `Unique variants for select disabled if have an option with selectWeight or selectForVariants specified`,
        );
        return { success: false };
      }
    }

    if (serializedComponent.variants === undefined) {
      serializedComponent.variants = {};
    }

    let descendantVariantComponents = gatherVariantComponents({
      serializedComponents: serializedComponent.children,
      componentInfoObjects,
    });

    serializedComponent.variants.descendantVariantComponents =
      descendantVariantComponents;

    let numberOfVariantsByChild = [];
    for (let descendant of descendantVariantComponents) {
      let descendantClass =
        componentInfoObjects.allComponentClasses[descendant.componentType];
      let result = descendantClass.determineNumberOfUniqueVariants({
        serializedComponent: descendant,
        componentInfoObjects,
      });
      if (!result.success) {
        return { success: false };
      }
      numberOfVariantsByChild.push(result.numberOfVariants);
    }

    let uniqueVariantData = {
      numberOfVariantsByChild,
      numberToSelect,
      withReplacement,
    };

    if (numberOfVariantsByChild.length === 0) {
      numberOfVariants = 1;
    } else if (withReplacement || numberToSelect === 1) {
      let numberOfOptionsPerSelection = numberOfVariantsByChild.reduce(
        (a, c) => a + c,
      );
      numberOfVariants = Math.pow(numberOfOptionsPerSelection, numberToSelect);
    } else {
      let numberOfChildren = numberOfVariantsByChild.length;

      if (numberToSelect > numberOfChildren) {
        return { success: false };
      }

      let firstNumber = numberOfVariantsByChild[0];
      let allSameNumber = numberOfVariantsByChild
        .slice(1)
        .every((x) => x === firstNumber);

      if (allSameNumber) {
        let numberOfPermutations = numberOfChildren;
        for (
          let n = numberOfChildren - 1;
          n > numberOfChildren - numberToSelect;
          n--
        ) {
          numberOfPermutations *= n;
        }
        numberOfVariants =
          numberOfPermutations * Math.pow(firstNumber, numberToSelect);
      } else {
        // have select without replacement where options have different numbers of variants
        numberOfVariants = countOptions(
          numberOfVariantsByChild,
          numberToSelect,
        );
      }
    }

    serializedComponent.variants.numberOfVariants = numberOfVariants;
    serializedComponent.variants.uniqueVariants = true;
    serializedComponent.variants.uniqueVariantData = uniqueVariantData;

    return {
      success: true,
      numberOfVariants,
    };
  }

  static getUniqueVariant({
    serializedComponent,
    variantIndex,
    componentInfoObjects,
  }) {
    let numberOfVariants = serializedComponent.variants?.numberOfVariants;
    if (numberOfVariants === undefined) {
      return { success: false };
    }

    if (
      !Number.isInteger(variantIndex) ||
      variantIndex < 1 ||
      variantIndex > numberOfVariants
    ) {
      return { success: false };
    }

    let uniqueVariantData = serializedComponent.variants.uniqueVariantData;
    let numberOfVariantsByChild = uniqueVariantData.numberOfVariantsByChild;
    let numberToSelect = uniqueVariantData.numberToSelect;
    let withReplacement = uniqueVariantData.withReplacement;
    let numberOfChildren = serializedComponent.children.length;
    let childrenToSelect = serializedComponent.children;

    if (numberOfVariantsByChild.length === 0) {
      return { success: true, desiredVariant: { indices: [] } };
    }

    let combinations;

    if (numberToSelect === 1) {
      combinations = [...Array(numberOfChildren).keys()].map((x) => [x]);
    } else {
      combinations = enumerateSelectionCombinations({
        numberOfIndices: numberToSelect,
        numberOfOptions: numberOfChildren,
        // maxNumber: variantIndex,
        withReplacement: withReplacement,
      });
    }

    // console.log(combinations);

    let numberOfCombinations = combinations.length;

    // for each combination, determine the number of possibilities
    let combinationsAvailable = combinations.map((x) => ({
      combination: x,
      numberOfPossibilities: x.reduce(
        (a, c) => a * numberOfVariantsByChild[c],
        1,
      ),
    }));

    // console.log(combinationsAvailable);
    // console.log(numberOfVariantsByChild);

    // The variants, in order, will
    // select the first possibility from each combination
    // followed by the second possibility, etc.
    // When the possibilities from the combination are exhausted
    // skip that combination

    let combinationsLeft = [...Array(numberOfCombinations).keys()];
    let possibilitiesUsed = 0;
    let nCombinationsLeft = combinationsLeft.length;
    let combinationIndexSelected, variantIndexOfSelected;

    let variantIndexLeft = variantIndex - 1;

    while (nCombinationsLeft > 0) {
      // find minimum number of possibilities in those that are left

      let minNumPos = combinationsLeft
        .map((ind) => combinationsAvailable[ind])
        .reduce((a, c) => Math.min(a, c.numberOfPossibilities), Infinity);

      let chunksize = minNumPos - possibilitiesUsed;

      if (variantIndexLeft < chunksize * nCombinationsLeft) {
        // won't exhaust the possibilities for any combination
        combinationIndexSelected =
          combinationsLeft[variantIndexLeft % nCombinationsLeft];
        variantIndexOfSelected =
          possibilitiesUsed +
          Math.floor(variantIndexLeft / nCombinationsLeft) +
          1;
        break;
      } else {
        possibilitiesUsed += chunksize;
        variantIndexLeft -= chunksize * nCombinationsLeft;
        combinationsLeft = combinationsLeft.filter(
          (ind) =>
            combinationsAvailable[ind].numberOfPossibilities >
            possibilitiesUsed,
        );
        nCombinationsLeft = combinationsLeft.length;
      }
    }

    // console.log("combinationIndexSelected: ", combinationIndexSelected)
    // console.log("variantIndexOfSelected: ", variantIndexOfSelected)

    let selectedCombination = combinations[combinationIndexSelected];
    // console.log("selectedCombination: ", selectedCombination)

    let indicesForEachChild = enumerateCombinations({
      numberOfOptionsByIndex: selectedCombination.map(
        (x) => numberOfVariantsByChild[x],
      ),
      maxNumber: variantIndexOfSelected,
    })[variantIndexOfSelected - 1].map((x) => x + 1);

    // console.log("indicesForEachChild: " + indicesForEachChild)

    // for each selected child, find the descendant variant components
    // and map the variant number (index) of that child
    // to the indices of those descendant variant components

    let subvariants = [];

    let haveNontrivialSubvariants = false;
    for (let [ind, childNum] of selectedCombination.entries()) {
      if (numberOfVariantsByChild[childNum] > 1) {
        let child = childrenToSelect[childNum];
        let compClass =
          componentInfoObjects.allComponentClasses[child.componentType];
        let result = compClass.getUniqueVariant({
          serializedComponent: child,
          variantIndex: indicesForEachChild[ind],
          componentInfoObjects,
        });
        if (!result.success) {
          return { success: false };
        }
        subvariants.push(result.desiredVariant);
        haveNontrivialSubvariants = true;
      } else {
        subvariants.push({});
      }
    }

    let desiredVariant = { indices: selectedCombination.map((x) => x + 1) };
    if (haveNontrivialSubvariants) {
      desiredVariant.subvariants = subvariants;
    }
    return { success: true, desiredVariant: desiredVariant };
  }
}

// counts the number of options (including permutations)
// where you can select numItems from numOptionsByItem (without replacement)
// and each select gets multiplied by the total number of options of that selection
let countOptions = function (numOptionsByItem, numItems) {
  if (numItems === 0) {
    return 0;
  }
  if (numItems === 1) {
    // if select just one item, simply add up all the different options
    return numOptionsByItem.reduce((a, c) => a + c);
  }
  let numOptions = 0;
  for (let ind in numOptionsByItem) {
    let num = numOptionsByItem[ind];
    let rest = [...numOptionsByItem];
    rest.splice(ind, 1); // remove selected item
    numOptions += num * countOptions(rest, numItems - 1);
  }
  return numOptions;
};
