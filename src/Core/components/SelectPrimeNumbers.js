import { enumerateSelectionCombinations } from "../utils/enumeration";
import {
  checkForExcludedCombination,
  estimateNumberOfDuplicateCombinations,
  estimateNumberOfNumberCombinationsExcluded,
  mergeContainingNumberCombinations,
} from "../utils/excludeCombinations";
import { createPrimesList } from "../utils/primeNumbers";
import { sampleFromNumberList } from "../utils/randomNumbers";
import { processAssignNames } from "../utils/serializedStateProcessing";
import CompositeComponent from "./abstract/CompositeComponent";

export default class SelectPrimeNumbers extends CompositeComponent {
  static componentType = "selectPrimeNumbers";

  static assignNamesToReplacements = true;

  static createsVariants = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.minValue = {
      createComponentOfType: "integer",
      createStateVariable: "minValue",
      defaultValue: 2,
      public: true,
    };
    attributes.maxValue = {
      createComponentOfType: "integer",
      createStateVariable: "maxValue",
      defaultValue: 100,
      public: true,
    };

    attributes.exclude = {
      createComponentOfType: "numberList",
      createStateVariable: "exclude",
      defaultValue: [],
      public: true,
    };

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number",
    };
    attributes.numToSelect = {
      createComponentOfType: "integer",
      createStateVariable: "numToSelect",
      defaultValue: 1,
      public: true,
    };
    attributes.withReplacement = {
      createComponentOfType: "boolean",
      createStateVariable: "withReplacement",
      defaultValue: false,
      public: true,
    };
    attributes.sortResults = {
      createComponentOfType: "boolean",
      createStateVariable: "sortResults",
      defaultValue: false,
      public: true,
    };
    attributes.excludeCombinations = {
      createComponentOfType: "_listOfNumberLists",
    };

    attributes.asList = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "asList",
      defaultValue: true,
    };

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.excludedCombinations = {
      returnDependencies: () => ({
        excludeCombinations: {
          dependencyType: "attributeComponent",
          attributeName: "excludeCombinations",
          variableNames: ["lists"],
        },
        numToSelect: {
          dependencyType: "stateVariable",
          variableName: "numToSelect",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.excludeCombinations !== null) {
          let excludedCombinations =
            dependencyValues.excludeCombinations.stateValues.lists
              .map((x) => x.slice(0, dependencyValues.numToSelect))
              .filter((x) => x.length === dependencyValues.numToSelect);

          while (true) {
            let result =
              mergeContainingNumberCombinations(excludedCombinations);
            if (result.merged) {
              excludedCombinations = result.combinations;
            } else {
              break;
            }
          }

          return {
            setValue: { excludedCombinations },
          };
        } else {
          return { setValue: { excludedCombinations: [] } };
        }
      },
    };

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

    stateVariableDefinitions.possibleValues = {
      returnDependencies: () => ({
        minValue: {
          dependencyType: "stateVariable",
          variableName: "minValue",
        },
        maxValue: {
          dependencyType: "stateVariable",
          variableName: "maxValue",
        },
        exclude: {
          dependencyType: "stateVariable",
          variableName: "exclude",
        },
      }),
      definition({ dependencyValues }) {
        let primes = createPrimesList({
          minValue: dependencyValues.minValue,
          maxValue: dependencyValues.maxValue,
          exclude: dependencyValues.exclude,
        });

        return { setValue: { possibleValues: primes } };
      },
    };

    stateVariableDefinitions.selectedValues = {
      immutable: true,
      hasEssential: true,
      shadowVariable: true,
      returnDependencies: ({ sharedParameters }) => ({
        numToSelect: {
          dependencyType: "stateVariable",
          variableName: "numToSelect",
        },
        withReplacement: {
          dependencyType: "stateVariable",
          variableName: "withReplacement",
        },
        possibleValues: {
          dependencyType: "stateVariable",
          variableName: "possibleValues",
        },
        excludedCombinations: {
          dependencyType: "stateVariable",
          variableName: "excludedCombinations",
        },
        sortResults: {
          dependencyType: "stateVariable",
          variableName: "sortResults",
        },
        variants: {
          dependencyType: "stateVariable",
          variableName: "variants",
        },
        variantRng: {
          dependencyType: "value",
          value: sharedParameters.variantRng,
          doNotProxy: true,
        },
      }),
      definition: makeSelection,
    };

    stateVariableDefinitions.isVariantComponent = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { isVariantComponent: true } }),
    };

    stateVariableDefinitions.generatedVariantInfo = {
      returnDependencies: () => ({
        selectedValues: {
          dependencyType: "stateVariable",
          variableName: "selectedValues",
        },
      }),
      definition({ dependencyValues, componentName }) {
        let generatedVariantInfo = {
          values: dependencyValues.selectedValues,
          meta: { createdBy: componentName },
        };

        return { setValue: { generatedVariantInfo } };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        selectedValues: {
          dependencyType: "stateVariable",
          variableName: "selectedValues",
        },
      }),
      definition: function () {
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    componentInfoObjects,
  }) {
    let newNamespace = component.attributes.newNamespace?.primitive;

    let replacements = [];

    for (let value of await component.stateValues.selectedValues) {
      replacements.push({
        componentType: "integer",
        state: { value, fixed: true },
      });
    }

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      componentInfoObjects,
    });

    return { replacements: processResult.serializedComponents };
  }

  static calculateReplacementChanges() {
    return [];
  }

  static determineNumberOfUniqueVariants({ serializedComponent }) {
    let numToSelect = 1,
      withReplacement = false;

    let numToSelectComponent =
      serializedComponent.attributes.numToSelect?.component;
    if (numToSelectComponent) {
      // only implemented if have an integer with a single string child
      if (
        numToSelectComponent.componentType === "integer" &&
        numToSelectComponent.children?.length === 1 &&
        typeof numToSelectComponent.children[0] === "string"
      ) {
        numToSelect = Number(numToSelectComponent.children[0]);

        if (!(Number.isInteger(numToSelect) && numToSelect >= 0)) {
          console.log(
            `cannot determine unique variants of selectPrimeNumbers as numToSelect isn't a non-negative integer.`,
          );
          return { success: false };
        }
      } else {
        console.log(
          `cannot determine unique variants of selectPrimeNumbers as numToSelect isn't constant number.`,
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
            `cannot determine unique variants of selectPrimeNumbers as withReplacement isn't constant boolean.`,
          );
          return { success: false };
        }
      } else {
        console.log(
          `cannot determine unique variants of selectPrimeNumbers as withReplacement isn't constant boolean.`,
        );
        return { success: false };
      }
    }

    let primePars = {};

    let minValueComponent = serializedComponent.attributes.minValue?.component;
    if (minValueComponent) {
      // only implemented if have a single string child
      if (
        minValueComponent.children?.length === 1 &&
        typeof minValueComponent.children[0] === "string"
      ) {
        let minValue = Number(minValueComponent.children[0]);
        if (!Number.isFinite(minValue)) {
          console.log(
            `cannot determine unique variants of selectPrimeNumbers as minValue isn't a number.`,
          );
          return { success: false };
        }
        primePars.minValue = minValue;
      } else {
        console.log(
          `cannot determine unique variants of selectPrimeNumbers as minValue isn't a constant.`,
        );
        return { success: false };
      }
    }

    let maxValueComponent = serializedComponent.attributes.maxValue?.component;
    if (maxValueComponent) {
      // only implemented if have a single string child
      if (
        maxValueComponent.children?.length === 1 &&
        typeof maxValueComponent.children[0] === "string"
      ) {
        let maxValue = Number(maxValueComponent.children[0]);
        if (!Number.isFinite(maxValue)) {
          console.log(
            `cannot determine unique variants of selectPrimeNumbers as maxValue isn't a number.`,
          );
          return { success: false };
        }
        primePars.maxValue = maxValue;
      } else {
        console.log(
          `cannot determine unique variants of selectPrimeNumbers as maxValue isn't a constant.`,
        );
        return { success: false };
      }
    }

    if (serializedComponent.attributes.excludeCombinations) {
      console.log(
        "have not implemented unique variants of a selectPrimeNumbers with excludeCombinations",
      );
      return { success: false };
    }

    let excludeComponent = serializedComponent.attributes.exclude?.component;
    if (excludeComponent) {
      if (
        !excludeComponent.children.every(
          (x) => x.children?.length === 1 && typeof x.children[0] === "string",
        )
      ) {
        console.log(
          "have not implemented unique variants of a selectPrimeNumbers with non-constant exclude",
        );
        return { success: false };
      }
      let exclude = excludeComponent.children.map((x) => Number(x.children[0]));

      if (!exclude.every(Number.isFinite)) {
        console.log(
          "have not implemented unique variants of a selectPrimeNumbers with non-constant exclude",
        );
        return { success: false };
      }
      primePars.exclude = exclude;
    }

    let sortResults;

    let sortResultsComponent =
      serializedComponent.attributes.sortResults?.component;
    if (sortResultsComponent) {
      // only implemented if have a single string child

      if (
        sortResultsComponent.children?.length === 1 &&
        typeof sortResultsComponent.children[0] === "string"
      ) {
        sortResults = sortResultsComponent.children[0].toLowerCase() === "true";
      } else if (
        (!sortResultsComponent.children ||
          sortResultsComponent.children?.length === 0) &&
        typeof sortResultsComponent.state?.value === "boolean"
      ) {
        sortResults = sortResultsComponent.state.value;
      } else {
        console.log(
          `cannot determine unique variants of selectPrimeNumbers as sortResults isn't a constant.`,
        );
        return { success: false };
      }
    }

    if (sortResults && numToSelect > 1) {
      console.log(
        "have not implemented unique variants of a selectPrimeNumbers with sortResults",
      );
      return { success: false };
    }

    let primes = createPrimesList(primePars);

    if (primes.length <= 0) {
      return { success: false };
    }

    let uniqueVariantData = {
      primes,
      numToSelect,
      withReplacement,
    };

    serializedComponent.variants.uniqueVariantData = uniqueVariantData;

    let numberOfVariants;

    if (withReplacement || numToSelect === 1) {
      numberOfVariants = Math.pow(primes.length, numToSelect);
    } else {
      numberOfVariants = primes.length;
      for (let n = primes.length - 1; n > primes.length - numToSelect; n--) {
        numberOfVariants *= n;
      }
    }

    if (!(numberOfVariants > 0)) {
      return { success: false };
    }

    serializedComponent.variants.numberOfVariants = numberOfVariants;

    return {
      success: true,
      numberOfVariants: numberOfVariants,
    };
  }

  static getUniqueVariant({ serializedComponent, variantIndex }) {
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
    let primes = uniqueVariantData.primes;
    let numToSelect = uniqueVariantData.numToSelect;
    let withReplacement = uniqueVariantData.withReplacement;

    if (numToSelect === 1) {
      return {
        success: true,
        desiredVariant: { values: [primes[variantIndex - 1]] },
      };
    }

    let numbers = enumerateSelectionCombinations({
      numberOfIndices: numToSelect,
      numberOfOptions: primes.length,
      maxNumber: variantIndex,
      withReplacement,
    })[variantIndex - 1];
    let values = numbers.map((x) => primes[x]);
    return { success: true, desiredVariant: { values } };
  }
}

function makeSelection({ dependencyValues }) {
  // console.log(`make selection`)
  // console.log(dependencyValues)

  if (dependencyValues.numToSelect < 1) {
    return {
      setEssentialValue: {
        selectedValues: [],
        selectedIndices: [],
      },
      setValue: {
        selectedValues: [],
        selectedIndices: [],
      },
    };
  }

  let numUniqueRequired = 1;
  if (!dependencyValues.withReplacement) {
    numUniqueRequired = dependencyValues.numToSelect;
  }

  let possibleValues = dependencyValues.possibleValues;
  let numValues = possibleValues.length;

  if (numUniqueRequired > numValues) {
    throw Error(
      "Cannot select " +
        numUniqueRequired +
        " values from a list of primes of length " +
        numValues,
    );
  }

  // if desiredIndices is specfied, use those
  if (
    dependencyValues.variants &&
    dependencyValues.variants.desiredVariant !== undefined
  ) {
    let desiredValues = dependencyValues.variants.desiredVariant.values;
    if (desiredValues !== undefined) {
      if (desiredValues.length !== dependencyValues.numToSelect) {
        throw Error(
          "Number of values specified for select must match number to select",
        );
      }

      desiredValues = desiredValues.map(Number);

      if (!desiredValues.every((x) => possibleValues.includes(x))) {
        throw Error(
          "All values specified for select prime number must be in the list of primes",
        );
      }

      if (
        checkForExcludedCombination({
          type: "number",
          excludedCombinations: dependencyValues.excludedCombinations,
          values: desiredValues,
        })
      ) {
        throw Error(
          "Specified values of selectPrimeNumbers was an excluded combination",
        );
      }

      return {
        setEssentialValue: { selectedValues: desiredValues },
        setValue: { selectedValues: desiredValues },
      };
    }
  }

  let numCombinationsExcluded = estimateNumberOfNumberCombinationsExcluded({
    excludedCombinations: dependencyValues.excludedCombinations,
    numValues,
    withReplacement: dependencyValues.withReplacement,
    numToSelect: dependencyValues.numToSelect,
  });

  let selectedValues;

  if (numCombinationsExcluded === 0) {
    selectedValues = sampleFromNumberList({
      possibleValues,
      numUniqueRequired,
      numSamples: dependencyValues.numToSelect,
      rng: dependencyValues.variantRng,
    });
  } else {
    let numPossibilities = numValues;

    if (dependencyValues.withReplacement) {
      numPossibilities = Math.pow(
        numPossibilities,
        dependencyValues.numToSelect,
      );
    } else {
      let n = numPossibilities;
      for (let i = 1; i < dependencyValues.numToSelect; i++) {
        numPossibilities *= n - i;
      }
    }

    if (numCombinationsExcluded > 0.7 * numPossibilities) {
      if (
        dependencyValues.excludedCombinations.some((x) => x.some(Number.isNaN))
      ) {
        let numberDuplicated = estimateNumberOfDuplicateCombinations(
          dependencyValues.excludedCombinations,
          numValues,
          dependencyValues.withReplacement,
        );

        numCombinationsExcluded -= numberDuplicated;

        if (numCombinationsExcluded > 0.7 * numPossibilities) {
          throw Error(
            "Excluded over 70% of combinations in selectPrimeNumbers",
          );
        }
      } else {
        throw Error("Excluded over 70% of combinations in selectPrimeNumbers");
      }
    }

    // with 200 chances with at least 70% success,
    // prob of failure less than 10^(-30)
    let foundValidCombination = false;
    for (let sampnum = 0; sampnum < 200; sampnum++) {
      selectedValues = sampleFromNumberList({
        possibleValues,
        numUniqueRequired,
        numSamples: dependencyValues.numToSelect,
        rng: dependencyValues.variantRng,
      });

      // try again if hit excluded combination
      if (
        checkForExcludedCombination({
          type: "number",
          excludedCombinations: dependencyValues.excludedCombinations,
          values: selectedValues,
        })
      ) {
        continue;
      }

      foundValidCombination = true;
      break;
    }

    if (!foundValidCombination) {
      // this won't happen, as occurs with prob < 10^(-30)
      throw Error(
        "By extremely unlikely fluke, couldn't select combination of random values",
      );
    }
  }

  if (dependencyValues.sortResults) {
    selectedValues.sort((a, b) => a - b);
  }

  return {
    setEssentialValue: { selectedValues },
    setValue: { selectedValues },
  };
}
