import Sequence from "./Sequence";
import { enumerateSelectionCombinations } from "../utils/enumeration";
import { processAssignNames } from "../utils/serializedStateProcessing";
import { getFromText } from "../utils/math";
import {
  calculateSequenceParameters,
  lettersToNumber,
  returnSequenceValueForIndex,
  returnSequenceValues,
} from "../utils/sequence";
import { convertAttributesForComponentType } from "../utils/copy";
import { returnRoundingAttributes } from "../utils/rounding";
import {
  checkForExcludedCombination,
  estimateNumberOfDuplicateCombinations,
  estimateNumberOfNumberCombinationsExcluded,
  mergeContainingNumberCombinations,
} from "../utils/excludeCombinations";

export default class SelectFromSequence extends Sequence {
  static componentType = "selectFromSequence";

  static assignNamesToReplacements = true;

  static createsVariants = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
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
      createComponentOfType: "_componentListOfListsWithSelectableType",
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
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
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

          if (dependencyValues.type === "number") {
            while (true) {
              let result =
                mergeContainingNumberCombinations(excludedCombinations);
              if (result.merged) {
                excludedCombinations = result.combinations;
              } else {
                break;
              }
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

    stateVariableDefinitions.selectedValues = {
      immutable: true,
      hasEssential: true,
      shadowVariable: true,
      additionalStateVariablesDefined: [
        {
          variableName: "selectedIndices",
          hasEssential: true,
          shadowVariable: true,
          immutable: true,
        },
      ],
      returnDependencies: ({ sharedParameters }) => ({
        numToSelect: {
          dependencyType: "stateVariable",
          variableName: "numToSelect",
        },
        withReplacement: {
          dependencyType: "stateVariable",
          variableName: "withReplacement",
        },
        length: {
          dependencyType: "stateVariable",
          variableName: "length",
        },
        from: {
          dependencyType: "stateVariable",
          variableName: "from",
        },
        step: {
          dependencyType: "stateVariable",
          variableName: "step",
        },
        exclude: {
          dependencyType: "stateVariable",
          variableName: "exclude",
        },
        excludedCombinations: {
          dependencyType: "stateVariable",
          variableName: "excludedCombinations",
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        lowercase: {
          dependencyType: "stateVariable",
          variableName: "lowercase",
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
        selectedIndices: {
          dependencyType: "stateVariable",
          variableName: "selectedIndices",
        },
      }),
      definition({ dependencyValues, componentName }) {
        let generatedVariantInfo = {
          indices: dependencyValues.selectedIndices,
          meta: { createdBy: componentName },
        };

        return { setValue: { generatedVariantInfo } };
      },
    };

    let originalReturnDependencies =
      stateVariableDefinitions.readyToExpandWhenResolved.returnDependencies;
    stateVariableDefinitions.readyToExpandWhenResolved.returnDependencies =
      function () {
        let deps = originalReturnDependencies();

        deps.selectedValues = {
          dependencyType: "stateVariable",
          variableName: "selectedValues",
        };

        return deps;
      };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    componentInfoObjects,
  }) {
    let componentType = await component.stateValues.type;
    if (componentType === "letters") {
      componentType = "text";
    }

    let newNamespace = component.attributes.newNamespace?.primitive;

    let attributesToConvert = {};
    for (let attr of ["fixed", ...Object.keys(returnRoundingAttributes())]) {
      if (attr in component.attributes) {
        attributesToConvert[attr] = component.attributes[attr];
      }
    }

    // allow one to override the fixed (default true) attribute
    // as well as rounding settings
    // by specifying it on the sequence
    let attributesFromComposite = {};

    if (Object.keys(attributesToConvert).length > 0) {
      attributesFromComposite = convertAttributesForComponentType({
        attributes: attributesToConvert,
        componentType,
        componentInfoObjects,
        compositeCreatesNewNamespace: newNamespace,
      });
    }

    let replacements = [];

    for (let value of await component.stateValues.selectedValues) {
      replacements.push({
        componentType,
        attributes: attributesFromComposite,
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

    let sequenceType = serializedComponent.attributes.type.primitive;

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
            `cannot determine unique variants of selectFromSequence as numToSelect isn't a non-negative integer.`,
          );
          return { success: false };
        }
      } else {
        console.log(
          `cannot determine unique variants of selectFromSequence as numToSelect isn't constant number.`,
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

    let sequencePars = {
      from: null,
      to: null,
      step: null,
      length: null,
    };

    let fromComponent = serializedComponent.attributes.from?.component;
    if (fromComponent) {
      // from itself is a component with selectable type
      let fromComponent2 = fromComponent.children[0];
      // only implemented if have a single string child
      if (
        fromComponent2.children?.length === 1 &&
        typeof fromComponent2.children[0] === "string"
      ) {
        let from;

        if (sequenceType === "number") {
          from = Number(fromComponent2.children[0]);
          if (!Number.isFinite(from)) {
            console.log(
              `cannot determine unique variants of selectFromSequence of number type as from isn't a number.`,
            );
            return { success: false };
          }
        } else if (sequenceType === "letters") {
          from = lettersToNumber(fromComponent2.children[0]);
          if (!Number.isFinite(from)) {
            console.log(
              `cannot determine unique variants of selectFromSequence of letters type as from isn't a combination of letters.`,
            );
            return { success: false };
          }
        } else {
          let fromText = getFromText({
            functionSymbols: ["f", "g"],
          });
          try {
            from = fromText(fromComponent2.children[0]);
          } catch (e) {
            console.log(
              `cannot determine unique variants of selectFromSequence of math type as from isn't a valid math expression.`,
            );
            return { success: false };
          }
        }
        sequencePars.from = from;
      } else {
        console.log(
          `cannot determine unique variants of selectFromSequence as from isn't a constant.`,
        );
        return { success: false };
      }
    }

    let toComponent = serializedComponent.attributes.to?.component;
    if (toComponent) {
      // to itself is a component with selectable type
      let toComponent2 = toComponent.children[0];
      // only implemented if have a single string child
      if (
        toComponent2.children?.length === 1 &&
        typeof toComponent2.children[0] === "string"
      ) {
        let to;

        if (sequenceType === "number") {
          to = Number(toComponent2.children[0]);
          if (!Number.isFinite(to)) {
            console.log(
              `cannot determine unique variants of selectFromSequence of number type as to isn't a number.`,
            );
            return { success: false };
          }
        } else if (sequenceType === "letters") {
          to = lettersToNumber(toComponent2.children[0]);
          if (!Number.isFinite(to)) {
            console.log(
              `cannot determine unique variants of selectFromSequence of letters type as to isn't a combination of letters.`,
            );
            return { success: false };
          }
        } else {
          let fromText = getFromText({
            functionSymbols: ["f", "g"],
          });
          try {
            to = fromText(toComponent2.children[0]);
          } catch (e) {
            console.log(
              `cannot determine unique variants of selectFromSequence of math type as to isn't a valid math expression.`,
            );
            return { success: false };
          }
        }
        sequencePars.to = to;
      } else {
        console.log(
          `cannot determine unique variants of selectFromSequence as to isn't a constant.`,
        );
        return { success: false };
      }
    }

    let stepComponent = serializedComponent.attributes.step?.component;
    if (stepComponent) {
      // only implemented if have a single string child
      if (
        stepComponent.children?.length === 1 &&
        typeof stepComponent.children[0] === "string"
      ) {
        let step;

        if (sequenceType === "number") {
          step = Number(stepComponent.children[0]);
          if (!Number.isFinite(step)) {
            console.log(
              `cannot determine unique variants of selectFromSequence of number type as step isn't a number.`,
            );
            return { success: false };
          }
        } else if (sequenceType === "letters") {
          step = Number(stepComponent.children[0]);
          if (!Number.isInteger(step)) {
            console.log(
              `cannot determine unique variants of selectFromSequence of letters type as step isn't an integer.`,
            );
            return { success: false };
          }
        } else {
          let fromText = getFromText({
            functionSymbols: ["f", "g"],
          });
          try {
            step = fromText(stepComponent.children[0]);
          } catch (e) {
            console.log(
              `cannot determine unique variants of selectFromSequence of math type as step isn't a valid math expression.`,
            );
            return { success: false };
          }
        }
        sequencePars.step = step;
      } else {
        console.log(
          `cannot determine unique variants of selectFromSequence as step isn't a constant.`,
        );
        return { success: false };
      }
    }

    let lengthComponent = serializedComponent.attributes.length?.component;
    if (lengthComponent) {
      // only implemented if have a single string child
      if (
        lengthComponent.children?.length === 1 &&
        typeof lengthComponent.children[0] === "string"
      ) {
        let length = Number(lengthComponent.children[0]);
        if (!Number.isInteger(length)) {
          console.log(
            `cannot determine unique variants of selectFromSequence as length isn't an integer.`,
          );
          return { success: false };
        }
        sequencePars.length = length;
      } else {
        console.log(
          `cannot determine unique variants of selectFromSequence as length isn't a constant.`,
        );
        return { success: false };
      }
    }

    if (serializedComponent.attributes.excludeCombinations) {
      console.log(
        "have not implemented unique variants of a selectFromSequence with excludeCombinations",
      );
      return { success: false };
    }

    let excludes = [];

    let excludeComponent = serializedComponent.attributes.exclude?.component;
    if (excludeComponent) {
      if (sequenceType === "math") {
        console.log(
          "have not implemented unique variants of a selectFromSequence of type math with exclude",
        );
        return { success: false };
      }
      if (
        !excludeComponent.children.every(
          (x) => x.children?.length === 1 && typeof x.children[0] === "string",
        )
      ) {
        console.log(
          "have not implemented unique variants of a selectFromSequence with non-constant exclude",
        );
        return { success: false };
      }
      if (sequenceType === "letters") {
        excludes = excludeComponent.children.map((x) =>
          lettersToNumber(x.children[0]),
        );
      } else {
        excludes = excludeComponent.children.map((x) => Number(x.children[0]));
      }

      if (!excludes.every(Number.isFinite)) {
        console.log(
          "have not implemented unique variants of a selectFromSequence with non-constant exclude",
        );
        return { success: false };
      }
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
          `cannot determine unique variants of selectFromSequence as sortResults isn't a constant.`,
        );
        return { success: false };
      }
    }

    if (sortResults && numToSelect > 1) {
      console.log(
        "have not implemented unique variants of a selectFromSequence with sortResults",
      );
      return { success: false };
    }

    sequencePars = calculateSequenceParameters(sequencePars);

    let nOptions = sequencePars.length;
    let excludeIndices = [];
    if (excludes.length > 0) {
      if (sequenceType !== "math") {
        excludes.sort((a, b) => a - b);
        excludes = excludes.filter((x, ind, a) => x != a[ind - 1]); // remove duplicates
        for (let item of excludes) {
          if (item < sequencePars.from) {
            continue;
          }
          let ind = (item - sequencePars.from) / sequencePars.step;
          if (ind > sequencePars.length - 1 + 1e-10) {
            break;
          }
          if (Math.abs(ind - Math.round(ind)) < 1e-10) {
            nOptions--;
            excludeIndices.push(ind);
          }
        }
      }
    }

    if (nOptions <= 0) {
      return { success: false };
    }

    let uniqueVariantData = {
      excludeIndices,
      nOptions,
      numToSelect,
      withReplacement,
    };

    serializedComponent.variants.uniqueVariantData = uniqueVariantData;

    let numberOfVariants;

    if (withReplacement || numToSelect === 1) {
      numberOfVariants = Math.pow(nOptions, numToSelect);
    } else {
      numberOfVariants = nOptions;
      for (let n = nOptions - 1; n > nOptions - numToSelect; n--) {
        numberOfVariants *= n;
      }
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
    let excludeIndices = uniqueVariantData.excludeIndices;
    let nOptions = uniqueVariantData.nOptions;
    let numToSelect = uniqueVariantData.numToSelect;
    let withReplacement = uniqueVariantData.withReplacement;

    let getSingleIndex = function (num) {
      let ind = num;
      for (let excludeInd of excludeIndices) {
        if (ind >= excludeInd) {
          ind++;
        }
      }

      return ind;
    };

    if (numToSelect === 1) {
      return {
        success: true,
        desiredVariant: { indices: [getSingleIndex(variantIndex - 1) + 1] },
      };
    }

    let numbers = enumerateSelectionCombinations({
      numberOfIndices: numToSelect,
      numberOfOptions: nOptions,
      maxNumber: variantIndex,
      withReplacement,
    })[variantIndex - 1];
    let indices = numbers.map(getSingleIndex).map((x) => x + 1);
    return { success: true, desiredVariant: { indices: indices } };
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

  if (numUniqueRequired > dependencyValues.length) {
    throw Error(
      "Cannot select " +
        numUniqueRequired +
        " values from a sequence of length " +
        dependencyValues.length,
    );
  }

  // if desiredIndices is specfied, use those
  if (
    dependencyValues.variants &&
    dependencyValues.variants.desiredVariant !== undefined
  ) {
    let desiredIndices = dependencyValues.variants.desiredVariant.indices;
    if (desiredIndices !== undefined) {
      if (desiredIndices.length !== dependencyValues.numToSelect) {
        throw Error(
          "Number of indices specified for select must match number to select",
        );
      }
      desiredIndices = desiredIndices.map(Number);
      if (!desiredIndices.every(Number.isInteger)) {
        throw Error("All indices specified for select must be integers");
      }
      let n = dependencyValues.length;
      desiredIndices = desiredIndices.map((x) => ((((x - 1) % n) + n) % n) + 1);

      let selectedValues = [];
      for (let indexFrom1 of desiredIndices) {
        let componentValue = returnSequenceValueForIndex({
          index: indexFrom1 - 1,
          from: dependencyValues.from,
          step: dependencyValues.step,
          length: dependencyValues.length,
          exclude: dependencyValues.exclude,
          type: dependencyValues.type,
          lowercase: dependencyValues.lowercase,
        });

        if (componentValue === null) {
          throw Error(
            "Specified index of selectfromsequence that was excluded",
          );
        }

        selectedValues.push(componentValue);
      }

      if (
        checkForExcludedCombination({
          type: dependencyValues.type,
          excludedCombinations: dependencyValues.excludedCombinations,
          values: selectedValues,
        })
      ) {
        throw Error(
          "Specified indices of selectfromsequence that was an excluded combination",
        );
      }

      return {
        setEssentialValue: { selectedValues, selectedIndices: desiredIndices },
        setValue: { selectedValues, selectedIndices: desiredIndices },
      };
    }
  }

  let numCombinationsExcluded = dependencyValues.excludedCombinations.length;

  if (dependencyValues.type === "number") {
    numCombinationsExcluded = estimateNumberOfNumberCombinationsExcluded({
      excludedCombinations: dependencyValues.excludedCombinations,
      numValues: dependencyValues.length - dependencyValues.exclude.length,
      withReplacement: dependencyValues.withReplacement,
      numToSelect: dependencyValues.numToSelect,
    });
  }

  let selectedValues, selectedIndices;

  if (numCombinationsExcluded === 0) {
    let selectedObj = selectValuesAndIndices({
      stateValues: dependencyValues,
      numUniqueRequired: numUniqueRequired,
      numToSelect: dependencyValues.numToSelect,
      withReplacement: dependencyValues.withReplacement,
      rng: dependencyValues.variantRng,
    });

    selectedValues = selectedObj.selectedValues;
    selectedIndices = selectedObj.selectedIndices;
  } else {
    let numPossibilitiesLowerBound =
      dependencyValues.length - dependencyValues.exclude.length;

    if (dependencyValues.withReplacement) {
      numPossibilitiesLowerBound = Math.pow(
        numPossibilitiesLowerBound,
        dependencyValues.numToSelect,
      );
    } else {
      let n = numPossibilitiesLowerBound;
      for (let i = 1; i < dependencyValues.numToSelect; i++) {
        numPossibilitiesLowerBound *= n - i;
      }
    }

    if (numCombinationsExcluded > 0.7 * numPossibilitiesLowerBound) {
      // may have excluded over 70% of combinations
      // need to determine actual number of possibilities
      // to see if really have excluded that many combinations

      let numPossibilities = 0;
      for (let index = 0; index < dependencyValues.length; index++) {
        if (
          returnSequenceValueForIndex({
            index,
            from: dependencyValues.from,
            step: dependencyValues.step,
            length: dependencyValues.length,
            exclude: dependencyValues.exclude,
            type: dependencyValues.type,
          }) !== null
        ) {
          numPossibilities++;
        }
      }

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
          dependencyValues.type === "number" &&
          dependencyValues.excludedCombinations.some((x) =>
            x.some(Number.isNaN),
          )
        ) {
          let numDuplicated = estimateNumberOfDuplicateCombinations(
            dependencyValues.excludedCombinations,
            dependencyValues.length - dependencyValues.exclude.length,
            dependencyValues.withReplacement,
          );

          numCombinationsExcluded -= numDuplicated;

          if (numCombinationsExcluded > 0.7 * numPossibilities) {
            throw Error(
              "Excluded over 70% of combinations in selectFromSequence",
            );
          }
        } else {
          throw Error(
            "Excluded over 70% of combinations in selectFromSequence",
          );
        }
      }
    }

    // with 200 chances with at least 70% success,
    // prob of failure less than 10^(-30)
    let foundValidCombination = false;
    for (let sampnum = 0; sampnum < 200; sampnum++) {
      let selectedObj = selectValuesAndIndices({
        stateValues: dependencyValues,
        numUniqueRequired: numUniqueRequired,
        numToSelect: dependencyValues.numToSelect,
        withReplacement: dependencyValues.withReplacement,
        rng: dependencyValues.variantRng,
      });

      selectedValues = selectedObj.selectedValues;
      selectedIndices = selectedObj.selectedIndices;

      // try again if hit excluded combination
      if (
        checkForExcludedCombination({
          type: dependencyValues.type,
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
    // combine selectedIndices and selectedValues to sort together
    let combinedList = [];
    for (let [ind, val] of selectedValues.entries()) {
      combinedList.push({ value: val, index: selectedIndices[ind] });
    }

    if (dependencyValues.type === "number") {
      combinedList.sort((a, b) => a.value - b.value);
    } else if (dependencyValues.type === "letters") {
      // sort according to their numerical value, not as words
      combinedList.sort(
        (a, b) => lettersToNumber(a.value) - lettersToNumber(b.value),
      );
    }

    selectedValues = combinedList.map((x) => x.value);
    selectedIndices = combinedList.map((x) => x.index);

    // don't sort type math
  }

  return {
    setEssentialValue: { selectedValues, selectedIndices },
    setValue: { selectedValues, selectedIndices },
  };
}

function selectValuesAndIndices({
  stateValues,
  numUniqueRequired = 1,
  numToSelect = 1,
  withReplacement = false,
  rng,
}) {
  let selectedValues = [];
  let selectedIndices = [];

  if (
    stateValues.exclude.length + numUniqueRequired <
    0.5 * stateValues.length
  ) {
    // the simplest case where the likelihood of getting excluded is less than 50%
    // just randomly select from all possibilities
    // and use rejection method to resample if an excluded is hit
    // or repeat a value when withReplacement=false

    for (let ind = 0; ind < numToSelect; ind++) {
      // with 100 chances with at least 50% success,
      // prob of failure less than 10^(-30)
      let foundValid = false;
      let componentValue;
      let selectedIndex;
      for (let sampnum = 0; sampnum < 100; sampnum++) {
        // random number in [0, 1)
        let rand = rng();
        // random integer from 1 to length
        selectedIndex = Math.floor(rand * stateValues.length) + 1;

        if (!withReplacement && selectedIndices.includes(selectedIndex)) {
          continue;
        }

        componentValue = returnSequenceValueForIndex({
          index: selectedIndex - 1,
          from: stateValues.from,
          step: stateValues.step,
          exclude: stateValues.exclude,
          type: stateValues.type,
          lowercase: stateValues.lowercase,
        });

        // try again if hit excluded value
        if (componentValue === null) {
          continue;
        }

        foundValid = true;
        break;
      }

      if (!foundValid) {
        // this won't happen, as occurs with prob < 10^(-30)
        throw Error(
          "By extremely unlikely fluke, couldn't select random value",
        );
      }

      selectedValues.push(componentValue);
      selectedIndices.push(selectedIndex);
    }

    return { selectedValues, selectedIndices };
  }

  // for cases when a large fraction might be excluded
  // we will generate the list of possible values and pick from those

  let possibleValuesAndIndices = returnSequenceValues(stateValues, true);

  let numPossibleValues = possibleValuesAndIndices.length;

  if (numUniqueRequired > numPossibleValues) {
    throw Error(
      "Cannot select " +
        numUniqueRequired +
        " unique values from sequence of length " +
        numPossibleValues,
    );
  }

  if (numUniqueRequired === 1) {
    for (let ind = 0; ind < numToSelect; ind++) {
      // random number in [0, 1)
      let rand = rng();
      // random integer from 0 to numPossibleValues-1
      let ind = Math.floor(rand * numPossibleValues);

      selectedIndices.push(possibleValuesAndIndices[ind].originalIndex + 1);
      selectedValues.push(possibleValuesAndIndices[ind].value);
    }

    return { selectedValues, selectedIndices };
  }

  // need to select more than one value without replacement
  // shuffle array and choose first elements
  // https://stackoverflow.com/a/12646864
  for (let i = possibleValuesAndIndices.length - 1; i > 0; i--) {
    const rand = rng();
    const j = Math.floor(rand * (i + 1));
    [possibleValuesAndIndices[i], possibleValuesAndIndices[j]] = [
      possibleValuesAndIndices[j],
      possibleValuesAndIndices[i],
    ];
  }

  let selectedValuesAndIndices = possibleValuesAndIndices.slice(0, numToSelect);
  selectedValues = selectedValuesAndIndices.map((x) => x.value);
  selectedIndices = selectedValuesAndIndices.map((x) => x.originalIndex + 1);

  return { selectedValues, selectedIndices };
}
