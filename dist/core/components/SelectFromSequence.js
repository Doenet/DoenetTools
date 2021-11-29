import Sequence from './Sequence.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { enumerateSelectionCombinations } from '../utils/enumeration.js';
import { processAssignNames } from '../utils/serializedStateProcessing.js';
import { textToAst } from '../utils/math.js';
import { calculateSequenceParameters, lettersToNumber, returnSequenceValueForIndex, returnSequenceValues } from '../utils/sequence.js';
import { convertAttributesForComponentType } from '../utils/copy.js';

export default class SelectFromSequence extends Sequence {
  static componentType = "selectFromSequence";

  static assignNamesToReplacements = true;

  static createsVariants = true;

  static get stateVariablesShadowedForReference() {
    return [...super.stateVariablesShadowedForReference, "excludedCombinations"]
  }

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
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
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.excludeCombinations !== null) {
          return {
            newValues:
            {
              excludedCombinations:
                dependencyValues.excludeCombinations.stateValues.lists
            }
          }
        } else {
          return { newValues: { excludedCombinations: [] } }
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
        return { newValues: { variants: dependencyValues.variants } };
      },
    };

    stateVariableDefinitions.selectedValues = {
      immutable: true,
      additionalStateVariablesDefined: ["selectedIndices"],
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
        selectRng: {
          dependencyType: "value",
          value: sharedParameters.selectRng,
          doNotProxy: true,
        },


      }),
      definition: makeSelection,
    }

    stateVariableDefinitions.isVariantComponent = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { isVariantComponent: true } })
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

        return { newValues: { generatedVariantInfo } }

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

  static createSerializedReplacements({ component, componentInfoObjects }) {

    let componentType = component.stateValues.type;
    if (component.stateValues.type === "letters") {
      componentType = "text"
    }

    let newNamespace = component.attributes.newNamespace && component.attributes.newNamespace.primitive;

    // allow one to override the fixed (default true) attribute
    // by specifying it on the sequence
    let attributesFromComposite = {};

    if ("fixed" in component.attributes) {
      attributesFromComposite = convertAttributesForComponentType({
        attributes: { fixed: component.attributes.fixed },
        componentType,
        componentInfoObjects,
        compositeCreatesNewNamespace: newNamespace
      })
    }

    let replacements = [];

    for (let value of component.stateValues.selectedValues) {

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
    if (serializedComponent.state !== undefined) {
      if (serializedComponent.state.numberToSelect !== undefined) {
        numberToSelect = serializedComponent.state.numberToSelect;
      }
      if (serializedComponent.state.withReplacement !== undefined) {
        withReplacement = serializedComponent.state.withReplacement;
      }
      if (serializedComponent.state.type !== undefined) {
        sequenceType = serializedComponent.state.type;
      }
    }
    if (serializedComponent.children === undefined) {
      return { succes: false }
    }

    let stringChild;
    let sequencePars = {};
    let excludes = [];
    for (let child of serializedComponent.children) {
      let componentType = child.componentType;
      if (componentType === "numberToSelect") {
        // calculate numberToSelect only if has its value set directly 
        // or if has a child that is a string
        let foundValid = false;
        if (child.state !== undefined && child.state.value !== undefined) {
          numberToSelect = Math.round(Number(child.state.value));
          foundValid = true;
        }
        // children overwrite state
        if (child.children !== undefined) {
          for (let grandchild of child.children) {
            if (grandchild.componentType === "string") {
              numberToSelect = Math.round(Number(grandchild.state.value));
              foundValid = true;
              break;
            }
          }
        }
        if (!foundValid) {
          return { success: false }
        }
      } else if (componentType === "withReplacement") {
        // calculate withReplacement only if has its value set directly 
        // or if has a child that is a string
        let foundValid = false;
        if (child.state !== undefined) {
          if (child.state.value !== undefined) {
            withReplacement = child.state.value;
            foundValid = true;
          }
        }
        // children overwrite state
        if (child.children !== undefined) {
          for (let grandchild of child.children) {
            if (grandchild.componentType === "string") {
              foundValid = true;
              if (grandchild.state.value.trim().toLowerCase() === "true") {
                withReplacement = true;
              } else {
                withReplacement = false;
              }
              break;
            }
          }
        }
        if (!foundValid) {
          return { success: false }
        }
      } else if (["type", "to", "from", "step", "length"].includes(componentType)) {
        // calculate sequencePars only if has its value set directly 
        // or if has a child that is a string
        let foundValid = false;
        if (child.state !== undefined && child.state.value !== undefined) {
          sequencePars[componentType] = child.state.value;
          foundValid = true;
        }
        // children overwrite state
        if (child.children !== undefined) {
          for (let grandchild of child.children) {
            if (grandchild.componentType === "string") {
              sequencePars[componentType] = grandchild.state.value;
              foundValid = true;
              break;
            }
          }
        }
        if (!foundValid) {
          return { success: false }
        }
      } else if (componentType === "exclude") {
        // calculate exclude if has a string child
        let foundValid = false;
        if (child.children !== undefined) {
          for (let grandchild of child.children) {
            if (grandchild.componentType === "string") {
              foundValid = true;
              let stringPieces = grandchild.state.value.split(",").map(x => x.trim());
              excludes.push(...stringPieces);
              break;
            }
          }
        }
        if (!foundValid) {
          return { success: false }
        }

      } else if (componentType === "string") {
        stringChild = child;
      }
    }

    if (stringChild !== undefined) {
      if (sequencePars.to !== undefined || sequencePars.from !== undefined) {
        return { success: false }
      }
      let stringPieces = stringChild.state.value.split(",");
      if (stringPieces.length === 1) {
        sequencePars.to = stringPieces[0].trim();
      } else if (stringPieces.length === 2) {
        sequencePars.from = stringPieces[0].trim();
        sequencePars.to = stringPieces[1].trim();
      } else {
        return { success: false }
      }
    }

    for (let par of ["to", "from", "step"]) {
      if (sequencePars[par] !== undefined) {
        if (sequencePars.type === "math") {
          if (typeof sequencePars[par] === "string") {
            sequencePars[par] = me.fromAst(textToAst.convert(sequencePars[par]));
          } else if (sequencePars[par].tree === undefined) {
            return { success: false }
          }
        } else if (sequencePars.type === "letters" && par !== "step") {
          sequencePars[par] = lettersToNumber(sequencePars[par]);
          if (sequencePars[par] === undefined) {
            return { success: false }
          }
        } else {
          sequencePars[par] = Number(sequencePars[par]);
          if (!Number.isFinite(sequencePars[par])) {
            return { success: false }
          }
        }
      }
    }

    if (sequencePars.length !== undefined) {
      if (typeof sequencePars.length === "string") {
        sequencePars.length = Number(sequencePars.length);
      }
      if (!Number.isInteger(sequencePars.length) || sequencePars.length < 0) {
        return { success: false }
      }
    }

    for (let [ind, exc] of excludes.entries()) {
      if (sequencePars.type === "math") {
        if (typeof exc === "string") {
          exc = me.fromAst(textToAst.convert(exc));
        } else if (exc.tree === undefined) {
          return { success: false }
        }
      } else if (sequencePars.type === "letters" && par !== "step") {
        exc = lettersToNumber(exc);
        if (exc === undefined) {
          return { success: false }
        }
      } else {
        exc = Number(exc);
        if (!Number.isFinite(exc)) {
          return { success: false }
        }
      }
      excludes[ind] = exc;
    }

    // TODO: this presumably does not work anymore since
    // calculateSequenceParameters returns results rather
    // than modifying input parameters
    calculateSequenceParameters(sequencePars)

    let nOptions = sequencePars.length;
    let excludeIndices = [];
    if (excludes.length > 0) {
      if (sequencePars.type !== math) {
        excludes.sort();
        excludes = excludes.filter((x, ind, a) => x != a[ind - 1]);
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
      excludeIndices: excludeIndices,
      nOptions: nOptions,
      numberToSelect: numberToSelect,
      withReplacement: withReplacement,
    }

    if (withReplacement || numberToSelect === 1) {
      let numberOfVariants = Math.pow(nOptions, numberToSelect);
      return {
        success: true,
        numberOfVariants: numberOfVariants,
        uniqueVariantData: uniqueVariantData
      }
    }

    let numberOfVariants = nOptions;
    for (let n = nOptions - 1; n > nOptions - numberToSelect; n--) {
      numberOfVariants *= n;
    }
    return {
      success: true,
      numberOfVariants: numberOfVariants,
      uniqueVariantData: uniqueVariantData
    }

  }

  static getUniqueVariant({ serializedComponent, variantIndex }) {

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

    let uniqueVariantData = serializedComponent.variants.uniqueVariantData;
    let excludeIndices = uniqueVariantData.excludeIndices;
    let nOptions = uniqueVariantData.nOptions;
    let numberToSelect = uniqueVariantData.numberToSelect;
    let withReplacement = uniqueVariantData.withReplacement;

    let getSingleIndex = function (num) {
      let ind = num;
      for (let excludeInd of excludeIndices) {
        if (ind === excludeInd) {
          ind++;
        }
      }
      return ind;
    }

    if (numberToSelect === 1) {
      return { success: true, desiredVariant: { indices: [getSingleIndex(variantIndex)] } }
    }

    let numbers = enumerateSelectionCombinations({
      numberOfIndices: numberToSelect,
      numberOfOptions: nOptions,
      maxNumber: variantIndex + 1,
      withReplacement: withReplacement,
    })[variantIndex];
    let indices = numbers.map(getSingleIndex)
    return { success: true, desiredVariant: { indices: indices } }

  }


}


function makeSelection({ dependencyValues }) {
  // console.log(`make selection`)
  // console.log(dependencyValues)

  if (dependencyValues.numberToSelect < 1) {
    return {
      makeEssential: { selectedValues: true, selectedIndices: true },
      newValues: {
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
        makeEssential: { selectedValues: true, selectedIndices: true },
        newValues: { selectedValues, selectedIndices: desiredIndices }
      }
    }
  }

  let numberCombinationsExcluded = dependencyValues.excludedCombinations.length;

  let selectedValues, selectedIndices;

  if (numberCombinationsExcluded === 0) {
    let selectedObj = selectValuesAndIndices({
      stateValues: dependencyValues,
      numberUniqueRequired: numberUniqueRequired,
      numberToSelect: dependencyValues.numberToSelect,
      withReplacement: dependencyValues.withReplacement,
      rng: dependencyValues.selectRng,
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
        throw Error("Excluded over 70% of combinations in selectFromSequence");
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
        rng: dependencyValues.selectRng,
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
    makeEssential: { selectedValues: true, selectedIndices: true },
    newValues: { selectedValues, selectedIndices }
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
    return excludedCombinations.some(x => x.every((v, i) => Math.abs(v - values[i]) <= 1E-14 * Math.max(Math.abs(v), Math.abs(values[i]))));
  } else {
    return excludedCombinations.some(x => x.every((v, i) => v === values[i]));
  }
}