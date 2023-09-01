import Sequence from './Sequence.js';
import { enumerateSelectionCombinations } from '../utils/enumeration.js';
import { processAssignNames } from '../utils/serializedStateProcessing.js';
import { getFromText } from '../utils/math.js';
import { calculateSequenceParameters, lettersToNumber, returnSequenceValueForIndex, returnSequenceValues } from '../utils/sequence.js';
import { convertAttributesForComponentType } from '../utils/copy.js';

export default class SelectFromSequence extends Sequence {
  static componentType = "selectFromSequence";

  static assignNamesToReplacements = true;

  static createsVariants = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number"
    }
    attributes.numberToSelect = {
      createComponentOfType: "integer",
      createStateVariable: "numberToSelect",
      defaultValue: 1,
      public: true,
    }
    attributes.withReplacement = {
      createComponentOfType: "boolean",
      createStateVariable: "withReplacement",
      defaultValue: false,
      public: true,
    }
    attributes.sortResults = {
      createComponentOfType: "boolean",
      createStateVariable: "sortResults",
      defaultValue: false,
      public: true,
    }
    attributes.excludeCombinations = {
      createComponentOfType: "_componentListOfListsWithSelectableType"
    }
    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.excludedCombinations = {
      returnDependencies: () => ({
        excludeCombinations: {
          dependencyType: "attributeComponent",
          attributeName: "excludeCombinations",
          variableNames: ["lists"]
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        },
        numberToSelect: {
          dependencyType: "stateVariable",
          variableName: "numberToSelect"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.excludeCombinations !== null) {
          let excludedCombinations = dependencyValues.excludeCombinations.stateValues.lists
            .map(x => x.slice(0, dependencyValues.numberToSelect))
            .filter(x => x.length === dependencyValues.numberToSelect);

          if (dependencyValues.type === "number") {
            while (true) {
              let result = mergeContainingCombinations(excludedCombinations);
              if (result.merged) {
                excludedCombinations = result.combinations;
              } else {
                break;
              }
            }
          }

          return {
            setValue: { excludedCombinations }
          }
        } else {
          return { setValue: { excludedCombinations: [] } }
        }

      }
    }

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
      additionalStateVariablesDefined: [{
        variableName: "selectedIndices",
        hasEssential: true,
        shadowVariable: true,
        immutable: true,
      }],
      returnDependencies: ({ sharedParameters }) => ({
        numberToSelect: {
          dependencyType: "stateVariable",
          variableName: "numberToSelect",
        },
        withReplacement: {
          dependencyType: "stateVariable",
          variableName: "withReplacement"
        },
        length: {
          dependencyType: "stateVariable",
          variableName: "length"
        },
        from: {
          dependencyType: "stateVariable",
          variableName: "from"
        },
        step: {
          dependencyType: "stateVariable",
          variableName: "step"
        },
        exclude: {
          dependencyType: "stateVariable",
          variableName: "exclude"
        },
        excludedCombinations: {
          dependencyType: "stateVariable",
          variableName: "excludedCombinations"
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        },
        lowercase: {
          dependencyType: "stateVariable",
          variableName: "lowercase"
        },
        sortResults: {
          dependencyType: "stateVariable",
          variableName: "sortResults"
        },
        variants: {
          dependencyType: "stateVariable",
          variableName: "variants"
        },
        variantRng: {
          dependencyType: "value",
          value: sharedParameters.variantRng,
          doNotProxy: true,
        },


      }),
      definition: makeSelection,
    }

    stateVariableDefinitions.isVariantComponent = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { isVariantComponent: true } })
    }

    stateVariableDefinitions.generatedVariantInfo = {
      returnDependencies: () => ({
        selectedIndices: {
          dependencyType: "stateVariable",
          variableName: "selectedIndices"
        },
      }),
      definition({ dependencyValues, componentName }) {

        let generatedVariantInfo = {
          indices: dependencyValues.selectedIndices,
          meta: { createdBy: componentName }
        };

        return { setValue: { generatedVariantInfo } }

      }
    }

    let originalReturnDependencies = stateVariableDefinitions.readyToExpandWhenResolved.returnDependencies;
    stateVariableDefinitions.readyToExpandWhenResolved.returnDependencies = function () {
      let deps = originalReturnDependencies();

      deps.selectedValues = {
        dependencyType: "stateVariable",
        variableName: "selectedValues"
      };

      return deps;

    }

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({ component, componentInfoObjects, flags }) {

    let componentType = await component.stateValues.type;
    if (componentType === "letters") {
      componentType = "text"
    }

    let newNamespace = component.attributes.newNamespace?.primitive;

    let attributesToConvert = {};
    for (let attr of ["fixed", "displayDigits", "displaySmallAsZero", "displayDecimals", "padZeros"]) {
      if (attr in component.attributes) {
        attributesToConvert[attr] = component.attributes[attr]
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
        flags
      })
    }

    let replacements = [];

    for (let value of await component.stateValues.selectedValues) {

      replacements.push({
        componentType,
        attributes: attributesFromComposite,
        state: { value, fixed: true }
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

    let numberToSelect = 1, withReplacement = false;

    let sequenceType = serializedComponent.attributes.type.primitive;

    let numberToSelectComponent = serializedComponent.attributes.numberToSelect?.component;
    if (numberToSelectComponent) {
      // only implemented if have an integer with a single string child
      if (numberToSelectComponent.componentType === "integer"
        && numberToSelectComponent.children?.length === 1
        && typeof numberToSelectComponent.children[0] === "string") {
        numberToSelect = Number(numberToSelectComponent.children[0]);

        if (!(Number.isInteger(numberToSelect) && numberToSelect >= 0)) {
          console.log(`cannot determine unique variants of selectFromSequence as numberToSelect isn't a non-negative integer.`)
          return { success: false };
        }

      } else {
        console.log(`cannot determine unique variants of selectFromSequence as numberToSelect isn't constant number.`)
        return { success: false };
      }
    }


    let withReplacementComponent = serializedComponent.attributes.withReplacement?.component;
    if (withReplacementComponent) {
      // only implemented if have an boolean with a boolean value or a single string child
      if (withReplacementComponent.componentType === "boolean") {
        if (withReplacementComponent.children?.length === 1
          && typeof withReplacementComponent.children[0] === "string") {
          withReplacement = withReplacementComponent.children[0].toLowerCase() === "true"
        } else if ((withReplacementComponent.children === undefined || withReplacementComponent.children.length === 0)
          && typeof withReplacementComponent.state?.value === "boolean"
        ) {
          withReplacement = withReplacementComponent.state.value;
        } else {
          console.log(`cannot determine unique variants of selectFromSequence as withReplacement isn't constant boolean.`)
          return { success: false };
        }
      } else {
        console.log(`cannot determine unique variants of selectFromSequence as withReplacement isn't constant boolean.`)
        return { success: false };
      }

    }

    let sequencePars = {
      from: null,
      to: null,
      step: null,
      length: null
    };

    let fromComponent = serializedComponent.attributes.from?.component;
    if (fromComponent) {
      // from itself is a component with selectable type
      let fromComponent2 = fromComponent.children[0];
      // only implemented if have a single string child
      if (fromComponent2.children?.length === 1
        && typeof fromComponent2.children[0] === "string"
      ) {

        let from;

        if (sequenceType === "number") {
          from = Number(fromComponent2.children[0]);
          if (!Number.isFinite(from)) {
            console.log(`cannot determine unique variants of selectFromSequence of number type as from isn't a number.`)
            return { success: false };
          }
        } else if (sequenceType === "letters") {
          from = lettersToNumber(fromComponent2.children[0]);
          if (!Number.isFinite(from)) {
            console.log(`cannot determine unique variants of selectFromSequence of letters type as from isn't a combination of letters.`)
            return { success: false };
          }
        } else {

          let fromText = getFromText({
            functionSymbols: ["f", "g"]
          });
          try {
            from = fromText(fromComponent2.children[0])
          } catch (e) {
            console.log(`cannot determine unique variants of selectFromSequence of math type as from isn't a valid math expression.`)
            return { success: false };
          }

        }
        sequencePars.from = from;

      } else {
        console.log(`cannot determine unique variants of selectFromSequence as from isn't a constant.`)
        return { success: false };
      }
    }

    let toComponent = serializedComponent.attributes.to?.component;
    if (toComponent) {
      // to itself is a component with selectable type
      let toComponent2 = toComponent.children[0];
      // only implemented if have a single string child
      if (toComponent2.children?.length === 1
        && typeof toComponent2.children[0] === "string"
      ) {

        let to;

        if (sequenceType === "number") {
          to = Number(toComponent2.children[0]);
          if (!Number.isFinite(to)) {
            console.log(`cannot determine unique variants of selectFromSequence of number type as to isn't a number.`)
            return { success: false };
          }
        } else if (sequenceType === "letters") {
          to = lettersToNumber(toComponent2.children[0]);
          if (!Number.isFinite(to)) {
            console.log(`cannot determine unique variants of selectFromSequence of letters type as to isn't a combination of letters.`)
            return { success: false };
          }
        } else {

          let fromText = getFromText({
            functionSymbols: ["f", "g"]
          });
          try {
            to = fromText(toComponent2.children[0])
          } catch (e) {
            console.log(`cannot determine unique variants of selectFromSequence of math type as to isn't a valid math expression.`)
            return { success: false };
          }

        }
        sequencePars.to = to;

      } else {
        console.log(`cannot determine unique variants of selectFromSequence as to isn't a constant.`)
        return { success: false };
      }
    }


    let stepComponent = serializedComponent.attributes.step?.component;
    if (stepComponent) {
      // only implemented if have a single string child
      if (stepComponent.children?.length === 1
        && typeof stepComponent.children[0] === "string"
      ) {

        let step;

        if (sequenceType === "number") {
          step = Number(stepComponent.children[0]);
          if (!Number.isFinite(step)) {
            console.log(`cannot determine unique variants of selectFromSequence of number type as step isn't a number.`)
            return { success: false };
          }
        } else if (sequenceType === "letters") {
          step = Number(stepComponent.children[0]);
          if (!Number.isInteger(step)) {
            console.log(`cannot determine unique variants of selectFromSequence of letters type as step isn't an integer.`)
            return { success: false };
          }
        } else {

          let fromText = getFromText({
            functionSymbols: ["f", "g"]
          });
          try {
            step = fromText(stepComponent.children[0])
          } catch (e) {
            console.log(`cannot determine unique variants of selectFromSequence of math type as step isn't a valid math expression.`)
            return { success: false };
          }

        }
        sequencePars.step = step;

      } else {
        console.log(`cannot determine unique variants of selectFromSequence as step isn't a constant.`)
        return { success: false };
      }
    }

    let lengthComponent = serializedComponent.attributes.length?.component;
    if (lengthComponent) {
      // only implemented if have a single string child
      if (lengthComponent.children?.length === 1
        && typeof lengthComponent.children[0] === "string"
      ) {

        let length = Number(lengthComponent.children[0]);
        if (!Number.isInteger(length)) {
          console.log(`cannot determine unique variants of selectFromSequence as length isn't an integer.`)
          return { success: false };
        }
        sequencePars.length = length;

      } else {
        console.log(`cannot determine unique variants of selectFromSequence as length isn't a constant.`)
        return { success: false };
      }
    }


    if (serializedComponent.attributes.excludeCombinations) {
      console.log('have not implemented unique variants of a selectFromSequence with excludeCombinations')
      return { success: false };
    }

    let excludes = [];

    let excludeComponent = serializedComponent.attributes.exclude?.component;
    if (excludeComponent) {
      if (sequenceType === "math") {
        console.log('have not implemented unique variants of a selectFromSequence of type math with exclude')
        return { success: false };
      }
      if (!excludeComponent.children.every(x => x.children?.length === 1 && typeof x.children[0] === "string")) {
        console.log('have not implemented unique variants of a selectFromSequence with non-constant exclude')
        return { success: false };
      }
      if (sequenceType === "letters") {
        excludes = excludeComponent.children.map(x => lettersToNumber(x.children[0]))
      } else {
        excludes = excludeComponent.children.map(x => Number(x.children[0]))
      }

      if (!excludes.every(Number.isFinite)) {
        console.log('have not implemented unique variants of a selectFromSequence with non-constant exclude')
        return { success: false };
      }

    }

    sequencePars = calculateSequenceParameters(sequencePars)


    let nOptions = sequencePars.length;
    let excludeIndices = [];
    if (excludes.length > 0) {
      if (sequenceType !== "math") {
        excludes.sort((a, b) => a - b);
        excludes = excludes.filter((x, ind, a) => x != a[ind - 1]);  // remove duplicates
        for (let item of excludes) {
          if (item < sequencePars.from) {
            continue;
          }
          let ind = (item - sequencePars.from) / sequencePars.step;
          if (ind > sequencePars.length - 1 + 1E-10) {
            break;
          }
          if (Math.abs(ind - Math.round(ind)) < 1E-10) {
            nOptions--;
            excludeIndices.push(ind);
          }
        }
      }
    }

    if (nOptions <= 0) {
      return { success: false }
    }

    let uniqueVariantData = {
      excludeIndices,
      nOptions,
      numberToSelect,
      withReplacement,
    }

    serializedComponent.variants.uniqueVariantData = uniqueVariantData;

    let numberOfVariants;

    if (withReplacement || numberToSelect === 1) {
      numberOfVariants = Math.pow(nOptions, numberToSelect);
    } else {
      numberOfVariants = nOptions;
      for (let n = nOptions - 1; n > nOptions - numberToSelect; n--) {
        numberOfVariants *= n;
      }
    }

    serializedComponent.variants.numberOfVariants = numberOfVariants;

    return {
      success: true,
      numberOfVariants: numberOfVariants,
    }

  }

  static getUniqueVariant({ serializedComponent, variantIndex }) {

    let numberOfVariants = serializedComponent.variants?.numberOfVariants;
    if (numberOfVariants === undefined) {
      return { success: false }
    }

    if (!Number.isInteger(variantIndex) || variantIndex < 1 || variantIndex > numberOfVariants) {
      return { success: false }
    }

    let uniqueVariantData = serializedComponent.variants.uniqueVariantData;
    let excludeIndices = uniqueVariantData.excludeIndices;
    let nOptions = uniqueVariantData.nOptions;
    let numberToSelect = uniqueVariantData.numberToSelect;
    let withReplacement = uniqueVariantData.withReplacement;

    let getSingleIndex = function (num) {
      let ind = num;
      for (let excludeInd of excludeIndices) {
        if (ind >= excludeInd) {
          ind++;
        }
      }

      return ind;
    }

    if (numberToSelect === 1) {
      return { success: true, desiredVariant: { indices: [getSingleIndex(variantIndex - 1) + 1] } }
    }

    let numbers = enumerateSelectionCombinations({
      numberOfIndices: numberToSelect,
      numberOfOptions: nOptions,
      maxNumber: variantIndex,
      withReplacement,
    })[variantIndex - 1];
    let indices = numbers.map(getSingleIndex).map(x => x + 1)
    return { success: true, desiredVariant: { indices: indices } }

  }


}


function makeSelection({ dependencyValues }) {
  // console.log(`make selection`)
  // console.log(dependencyValues)

  if (dependencyValues.numberToSelect < 1) {
    return {
      setEssentialValue: {
        selectedValues: [],
        selectedIndices: []
      },
      setValue: {
        selectedValues: [],
        selectedIndices: [],
      }
    }
  }

  let numberUniqueRequired = 1;
  if (!dependencyValues.withReplacement) {
    numberUniqueRequired = dependencyValues.numberToSelect;
  }

  if (numberUniqueRequired > dependencyValues.length) {
    throw Error("Cannot select " + numberUniqueRequired +
      " values from a sequence of length " + dependencyValues.length);
  }

  // if desiredIndices is specfied, use those
  if (dependencyValues.variants && dependencyValues.variants.desiredVariant !== undefined) {
    let desiredIndices = dependencyValues.variants.desiredVariant.indices;
    if (desiredIndices !== undefined) {
      if (desiredIndices.length !== dependencyValues.numberToSelect) {
        throw Error("Number of indices specified for select must match number to select");
      }
      desiredIndices = desiredIndices.map(Number);
      if (!desiredIndices.every(Number.isInteger)) {
        throw Error("All indices specified for select must be integers");
      }
      let n = dependencyValues.length;
      desiredIndices = desiredIndices.map(x => ((((x - 1) % n) + n) % n) + 1);

      let selectedValues = [];
      for (let indexFrom1 of desiredIndices) {

        let componentValue = returnSequenceValueForIndex({
          index: indexFrom1 - 1,
          from: dependencyValues.from,
          step: dependencyValues.step,
          length: dependencyValues.length,
          exclude: dependencyValues.exclude,
          type: dependencyValues.type,
          lowercase: dependencyValues.lowercase
        })

        if (componentValue === null) {
          throw Error("Specified index of selectfromsequence that was excluded")
        }

        selectedValues.push(componentValue);
      }

      if (checkForExcludedCombination({
        type: dependencyValues.type,
        excludedCombinations: dependencyValues.excludedCombinations,
        values: selectedValues
      })) {
        throw Error("Specified indices of selectfromsequence that was an excluded combination")
      }

      return {
        setEssentialValue: { selectedValues, selectedIndices: desiredIndices },
        setValue: { selectedValues, selectedIndices: desiredIndices }
      }
    }
  }

  let numberCombinationsExcluded = dependencyValues.excludedCombinations.length;

  if (dependencyValues.type === "number") {
    // account for fact that an excluded combination with a NaN is a wildcard
    // this could be an overestimate, as different combinations could match the same value
    numberCombinationsExcluded = 0;
    let nValues = dependencyValues.length - dependencyValues.exclude.length;
    for (let comb of dependencyValues.excludedCombinations) {
      let numNans = comb.reduce((a, c) => a + (Number.isNaN(c) ? 1 : 0), 0);

      if (numNans > 0) {
        if (dependencyValues.withReplacement) {
          numberCombinationsExcluded += Math.pow(nValues, numNans);
        } else {
          let n = nValues - dependencyValues.numberToSelect + numNans;
          let nExcl = n;
          for (let i = 1; i < numNans; i++) {
            nExcl *= n - i;
          }
          numberCombinationsExcluded += nExcl;
        }
      } else {
        numberCombinationsExcluded += 1;
      }
    }
  }

  let selectedValues, selectedIndices;

  if (numberCombinationsExcluded === 0) {
    let selectedObj = selectValuesAndIndices({
      stateValues: dependencyValues,
      numberUniqueRequired: numberUniqueRequired,
      numberToSelect: dependencyValues.numberToSelect,
      withReplacement: dependencyValues.withReplacement,
      rng: dependencyValues.variantRng,
    });

    selectedValues = selectedObj.selectedValues;
    selectedIndices = selectedObj.selectedIndices;

  } else {

    let numberPossibilitiesLowerBound = dependencyValues.length - dependencyValues.exclude.length;

    if (dependencyValues.withReplacement) {
      numberPossibilitiesLowerBound = Math.pow(numberPossibilitiesLowerBound, dependencyValues.numberToSelect);
    } else {
      let n = numberPossibilitiesLowerBound;
      for (let i = 1; i < dependencyValues.numberToSelect; i++) {
        numberPossibilitiesLowerBound *= n - i;
      }
    }

    if (numberCombinationsExcluded > 0.7 * numberPossibilitiesLowerBound) {
      // may have excluded over 70% of combinations
      // need to determine actual number of possibilities
      // to see if really have excluded that many combinations

      let numberPossibilities = 0;
      for (let index = 0; index < dependencyValues.length; index++) {
        if (returnSequenceValueForIndex({
          index,
          from: dependencyValues.from,
          step: dependencyValues.step,
          length: dependencyValues.length,
          exclude: dependencyValues.exclude,
          type: dependencyValues.type
        }) !== null) {

          numberPossibilities++;

        }
      }

      if (dependencyValues.withReplacement) {
        numberPossibilities = Math.pow(numberPossibilities, dependencyValues.numberToSelect);
      } else {
        let n = numberPossibilities;
        for (let i = 1; i < dependencyValues.numberToSelect; i++) {
          numberPossibilities *= n - i;
        }
      }

      if (numberCombinationsExcluded > 0.7 * numberPossibilities) {

        if (dependencyValues.type === "number" &&
          dependencyValues.excludedCombinations.some(x => x.some(Number.isNaN))
        ) {


          let numberDuplicated = estimateNumberOfDuplicateCombinations(
            dependencyValues.excludedCombinations,
            dependencyValues.length - dependencyValues.exclude.length,
            dependencyValues.withReplacement
          );

          numberCombinationsExcluded -= numberDuplicated;

          if (numberCombinationsExcluded > 0.7 * numberPossibilities) {
            throw Error("Excluded over 70% of combinations in selectFromSequence");
          }

        } else {
          throw Error("Excluded over 70% of combinations in selectFromSequence");
        }

      }

    }

    // with 200 chances with at least 70% success,
    // prob of failure less than 10^(-30)
    let foundValidCombination = false;
    for (let sampnum = 0; sampnum < 200; sampnum++) {

      let selectedObj = selectValuesAndIndices({
        stateValues: dependencyValues,
        numberUniqueRequired: numberUniqueRequired,
        numberToSelect: dependencyValues.numberToSelect,
        withReplacement: dependencyValues.withReplacement,
        rng: dependencyValues.variantRng,
      });

      selectedValues = selectedObj.selectedValues;
      selectedIndices = selectedObj.selectedIndices;


      // try again if hit excluded combination
      if (checkForExcludedCombination({
        type: dependencyValues.type,
        excludedCombinations: dependencyValues.excludedCombinations,
        values: selectedValues
      })) {
        continue;
      }

      foundValidCombination = true;
      break;

    }

    if (!foundValidCombination) {
      // this won't happen, as occurs with prob < 10^(-30)
      throw Error("By extremely unlikely fluke, couldn't select combination of random values");
    }

  }

  if (dependencyValues.sortResults) {

    // combine selectedIndices and selectedValues to sort together
    let combinedList = [];
    for (let [ind, val] of selectedValues.entries()) {
      combinedList.push({ value: val, index: selectedIndices[ind] })
    }

    if (dependencyValues.type === "number") {
      combinedList.sort((a, b) => a.value - b.value);
    } else if (dependencyValues.type === 'letters') {
      // sort according to their numerical value, not as words
      combinedList.sort((a, b) => lettersToNumber(a.value) - lettersToNumber(b.value));
    }

    selectedValues = combinedList.map(x => x.value);
    selectedIndices = combinedList.map(x => x.index);

    // don't sort type math
  }

  return {
    setEssentialValue: { selectedValues, selectedIndices },
    setValue: { selectedValues, selectedIndices }
  }

}


function selectValuesAndIndices({ stateValues, numberUniqueRequired = 1, numberToSelect = 1,
  withReplacement = false, rng }) {

  let selectedValues = [];
  let selectedIndices = [];

  if (stateValues.exclude.length + numberUniqueRequired < 0.5 * stateValues.length) {
    // the simplest case where the likelihood of getting excluded is less than 50%
    // just randomly select from all possibilities
    // and use rejection method to resample if an excluded is hit 
    // or repeat a value when withReplacement=false

    for (let ind = 0; ind < numberToSelect; ind++) {

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
          lowercase: stateValues.lowercase
        })

        // try again if hit excluded value
        if (componentValue === null) {
          continue;
        }

        foundValid = true;
        break;
      }

      if (!foundValid) {
        // this won't happen, as occurs with prob < 10^(-30)
        throw Error("By extremely unlikely fluke, couldn't select random value");
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

  if (numberUniqueRequired > numPossibleValues) {
    throw Error("Cannot select " + numberUniqueRequired +
      " unique values from sequence of length " + numPossibleValues);
  }

  if (numberUniqueRequired === 1) {

    for (let ind = 0; ind < numberToSelect; ind++) {

      // random number in [0, 1)
      let rand = rng();
      // random integer from 0 to numPossibleValues-1
      let ind = Math.floor(rand * numPossibleValues);

      selectedIndices.push(possibleValuesAndIndices[ind].originalIndex + 1)
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
    [possibleValuesAndIndices[i], possibleValuesAndIndices[j]] = [possibleValuesAndIndices[j], possibleValuesAndIndices[i]];
  }

  let selectedValuesAndIndices = possibleValuesAndIndices.slice(0, numberToSelect);
  selectedValues = selectedValuesAndIndices.map(x => x.value);
  selectedIndices = selectedValuesAndIndices.map(x => x.originalIndex + 1);

  return { selectedValues, selectedIndices };

}

function checkForExcludedCombination({ type, excludedCombinations, values }) {
  if (type === "math") {
    return excludedCombinations.some(x => x.every((v, i) => v.equals(values[i])));
  } else if (type === "number") {
    // if one entry of excluded combinations is NaN, then it is a wildcard
    // that will match any value
    return excludedCombinations.some(x => x.every((v, i) => Number.isNaN(v) || Math.abs(v - values[i]) <= 1E-14 * Math.max(Math.abs(v), Math.abs(values[i]))));
  } else {
    return excludedCombinations.some(x => x.every((v, i) => v === values[i]));
  }
}

function mergeContainingCombinations(combinations) {

  if (combinations.length === 0) {
    return { merged: false, combinations: [] }
  }

  let mergedCombinations = [combinations[0]];

  let mergedAtLeastOne = false;

  for (let comb of combinations.slice(1)) {

    let newCombinations = [];
    let merged = false;

    for (let oldComb of mergedCombinations) {
      if (merged) {
        newCombinations.push(oldComb);
        continue;
      }
      let newComb = [];
      merged = true;
      let mergingInto = null;
      for (let k = 0; k < comb.length; k++) {
        let v1 = comb[k], v2 = oldComb[k];
        if (Number.isNaN(v1)) {
          if (Number.isNaN(v2)) {
            newComb.push(NaN);
          } else {
            // want to merge into 1
            if (mergingInto === 2) {
              // already merging into 2, so cannot merge
              merged = false;
              break;
            } else {
              newComb.push(NaN);
              mergingInto = 1;
            }
          }
        } else if (Number.isNaN(v2)) {
          // want to merge into 2
          if (mergingInto === 1) {
            // already merging into 1, so cannot merge
            merged = false;
            break;
          } else {
            newComb.push(NaN);
            mergingInto = 2;
          }
        } else {
          if (v1 === v2) {
            newComb.push(v1);
          } else {
            merged = false;
            break;
          }
        }
      }

      if (merged) {
        newCombinations.push(newComb)
      } else {
        newCombinations.push(oldComb)
      }

    }

    if (merged) {
      mergedAtLeastOne = true;
    } else {
      newCombinations.push(comb);
    }

    mergedCombinations = newCombinations;
  }

  return {
    merged: mergedAtLeastOne,
    combinations: mergedCombinations
  }

}

function estimateNumberOfDuplicateCombinations(combinations, nValues, withReplacement) {
  // if have wildcards, get better estimate of number excluded 


  let nCombs = combinations.length;

  if (nCombs === 0) {
    return 0;
  }

  let duplicateCombinations = [];
  for (let i = 0; i < nCombs; i++) {
    let comb1 = combinations[i];
    for (let j = i + 1; j < nCombs; j++) {
      let comb2 = combinations[j];
      let foundDuplicate = true;
      let duplicate = [];
      for (let k = 0; k < comb1.length; k++) {
        let v1 = comb1[k], v2 = comb2[k];
        if (Number.isNaN(v1)) {
          if (Number.isNaN(v2)) {
            duplicate.push(NaN);
          } else {
            duplicate.push(v2)
          }
        } else if (Number.isNaN(v2)) {
          duplicate.push(v1);
        } else {
          if (v1 === v2) {
            duplicate.push(v1);
          } else {
            foundDuplicate = false;
            break;
          }
        }
      }

      if (foundDuplicate) {
        if (withReplacement) {
          duplicateCombinations.push(duplicate);
        } else {
          let nonNanEntries = duplicate.filter(x => !Number.isNaN(x))
          if ([...new Set(nonNanEntries)].length === nonNanEntries.length) {
            duplicateCombinations.push(duplicate);
          }
        }
      }
    }
  }

  // TODO: get a more accurate count of the number of excluded combinations.
  // This is just a heuristic to reduce the count
  while (true) {
    let result = mergeContainingCombinations(duplicateCombinations);

    if (result.merged) {
      duplicateCombinations = result.combinations;
    } else {
      break;
    }

  }

  let numberDuplicated = 0;

  if (duplicateCombinations.length > 0) {
    for (let comb of duplicateCombinations) {
      let numNans = comb.reduce((a, c) => a + (Number.isNaN(c) ? 1 : 0), 0);

      if (numNans > 0) {
        if (withReplacement) {
          numberDuplicated += Math.pow(nValues, numNans);
        } else {
          let n = nValues - comb.length + numNans;
          let nDup = n;
          for (let i = 1; i < numNans; i++) {
            nDup *= n - i;
          }
          numberDuplicated += nDup;
        }
      } else {
        numberDuplicated += 1;
      }
    }

  }

  numberDuplicated -= estimateNumberOfDuplicateCombinations(duplicateCombinations, nValues, withReplacement)

  return numberDuplicated;

}