import CompositeComponent from './abstract/CompositeComponent';
import { enumerateSelectionCombinations, enumerateCombinations } from '../utils/enumeration';
import { getVariantsForDescendants } from '../utils/variants';
import { deepClone } from '../utils/deepFunctions';

export default class Select extends CompositeComponent {
  static componentType = "select";

  static assignNamesToAllChildrenExcept = Object.keys(Select.createPropertiesObject({})).map(x => x.toLowerCase());

  static createsVariants = true;

  // static selectedVariantVariable = "selectedIndices";


  static keepChildrenSerialized({ serializedComponent, allComponentClasses }) {
    if (serializedComponent.children === undefined) {
      return [];
    }

    let propertyClasses = [];
    for (let componentType in this.createPropertiesObject({})) {
      let ct = componentType.toLowerCase();
      propertyClasses.push({
        componentType: ct,
        class: allComponentClasses[ct]
      });
    }

    let nonPropertyChildInds = [];

    // first occurence of a property component class
    // will be created
    // any other component will stay serialized
    for (let [ind, child] of serializedComponent.children.entries()) {
      let propFound = false;
      for (let propObj of propertyClasses) {
        if ((child.componentType === propObj.componentType ||
          propObj.class.isPrototypeOf(allComponentClasses[child.componentType])) &&
          !propObj.propFound) {
          propFound = propObj.propFound = true;
          break;
        }
      }
      if (!propFound) {
        nonPropertyChildInds.push(ind);
      }
    }

    return nonPropertyChildInds;

  }

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.numberToSelect = { default: 1 };
    properties.withReplacement = { default: false };
    return properties;
  }

  // don't need additional child logic
  // as all non-property children will remain serialized

  get stateVariablesForReference() {
    return ["selectedIndices"];
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.serializedChildren = {
      returnDependencies: () => ({
        serializedChildren: {
          dependencyType: "serializedChildren",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { serializedChildren: dependencyValues.serializedChildren } };
      },
    };

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

    stateVariableDefinitions.currentVariantName = {
      returnDependencies: ({ sharedParameters }) => ({
        variant: {
          dependencyType: "value",
          value: sharedParameters.variant,
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { currentVariantName: dependencyValues.variant }
      })
    }

    stateVariableDefinitions.allPossibleVariants = {
      returnDependencies: ({ sharedParameters }) => ({
        allPossibleVariants: {
          dependencyType: "value",
          value: sharedParameters.allPossibleVariants,
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { allPossibleVariants: dependencyValues.allPossibleVariants }
      })
    }

    stateVariableDefinitions.childrenToSelect = {
      additionalStateVariablesDefined: ["availableVariants", "selectWeightByChild"],
      returnDependencies: () => ({
        serializedChildren: {
          dependencyType: "stateVariable",
          variableName: "serializedChildren"
        },
        numberToSelect: {
          dependencyType: "stateVariable",
          variableName: "numberToSelect"
        },
        allPossibleVariants: {
          dependencyType: "stateVariable",
          variableName: "allPossibleVariants"
        }
      }),
      definition: function ({ dependencyValues }) {

        // deepClone remove readonly proxy
        let childrenToSelect = deepClone(dependencyValues.serializedChildren);

        // if have just one string, convert it to array of text or numbers
        // in the same fashion that sugar works for regular children
        if (childrenToSelect.length === 1 && childrenToSelect[0].componentType === "string") {
          childrenToSelect = numbersOrTextFromString(childrenToSelect[0].state.value)
        }

        let availableVariantsByChild = [];
        let selectWeightByChild = [];

        for (let child of childrenToSelect) {

          // make sure each serialized child has children and doenetAttributes
          if (child.children === undefined) {
            child.children = [];
          }
          if (child.doenetAttributes === undefined) {
            child.doenetAttributes = {};
          }

          availableVariantsByChild.push(extractVariants(child));
          selectWeightByChild.push(extractSelectWeight(child));
        }

        let availableVariants = {};
        for (let [ind, result] of availableVariantsByChild.entries()) {
          for (let variant of result) {
            let variantLower = variant.toLowerCase();
            if (availableVariants[variantLower] === undefined) {
              availableVariants[variantLower] = [];
            }
            availableVariants[variantLower].push(ind);
          }
        }

        for (let variant in availableVariants) {
          if (availableVariants[variant].length !== dependencyValues.numberToSelect) {
            throw Error("Invalid variant for select.  Variant " + variant + " appears in "
              + availableVariants[variant].length + " options but number to select is "
              + numberToSelect);
          }
        }

        if (Object.keys(availableVariants).length > 0) {
          // if have at least one variant specified,
          // then require that all possible variants have a variant specified
          for (let variant of dependencyValues.allPossibleVariants) {
            if (!(variant in availableVariants)) {
              throw Error("Some variants are specified for select but no options are specified for possible variant: " + variant)
            }
          }
          for (let variant in availableVariants) {
            if (!(dependencyValues.allPossibleVariants.includes(variant))) {
              throw Error("Variant " + variant + " that is specified for select is not a possible variant.");
            }
          }
        }

        return {
          newValues: {
            childrenToSelect,
            availableVariants,
            selectWeightByChild,
          }
        }
      }
    }

    stateVariableDefinitions.numberOfChildren = {
      returnDependencies: () => ({
        childrenToSelect: {
          dependencyType: "stateVariable",
          variableName: "childrenToSelect"
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { numberOfChildren: dependencyValues.childrenToSelect.length } };
      }
    }

    stateVariableDefinitions.selectedIndices = {
      immutable: true,
      returnDependencies: ({ sharedParameters }) => ({
        essentialSelectedIndices: {
          dependencyType: "potentialEssentialVariable",
          variableName: "selectedIndex",
        },
        numberToSelect: {
          dependencyType: "stateVariable",
          variableName: "numberToSelect",
        },
        withReplacement: {
          dependencyType: "stateVariable",
          variableName: "withReplacement"
        },
        selectWeightByChild: {
          dependencyType: "stateVariable",
          variableName: "selectWeightByChild",
        },
        numberOfChildren: {
          dependencyType: "stateVariable",
          variableName: "numberOfChildren"
        },
        currentVariantName: {
          dependencyType: "stateVariable",
          variableName: "currentVariantName"
        },
        variants: {
          dependencyType: "stateVariable",
          variableName: "variants",
        },
        availableVariants: {
          dependencyType: "stateVariable",
          variableName: "availableVariants",
        },
        selectRng: {
          dependencyType: "value",
          value: sharedParameters.selectRng,
          doNotProxy: true,
        }
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.essentialSelectedIndices !== undefined) {
          return {
            makeEssential: ["selectedIndices"],
            newValues: {
              selectedIndices: dependencyValues.essentialSelectedIndices
            }
          }
        }

        if (dependencyValues.numberToSelect < 1 || dependencyValues.numberOfChildren === 0) {
          return {
            makeEssential: ["selectedIndices"],
            newValues: {
              selectedIndices: [],
            }
          }
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
            let n = dependencyValues.numberOfChildren
            desiredIndices = desiredIndices.map(x => ((x % n) + n) % n);

            return {
              makeEssential: ["selectedIndices"],
              newValues: {
                selectedIndices: desiredIndices,
              }
            }
          }
        }


        // first check if have a variant for which options are specified
        let variantOptions = dependencyValues.availableVariants[dependencyValues.currentVariantName];

        if (variantOptions !== undefined) {

          if (dependencyValues.numberToSelect > 1) {
            // shallow copy to remove proxy so can shuffle
            variantOptions = [...variantOptions];

            // first shuffle the array of indices
            // https://stackoverflow.com/a/12646864
            for (let i = dependencyValues.numberToSelect - 1; i > 0; i--) {
              const rand = dependencyValues.selectRng.random();
              const j = Math.floor(rand * (i + 1));
              [variantOptions[i], variantOptions[j]] = [variantOptions[j], variantOptions[i]];
            }
          }
          return {
            makeEssential: ["selectedIndices"],
            newValues: {
              selectedIndices: variantOptions,
            }
          }

        }

        let selectedIndices = [];


        let numberUniqueRequired = 1;
        if (!dependencyValues.withReplacement) {
          numberUniqueRequired = dependencyValues.numberToSelect;
        }

        if (numberUniqueRequired > dependencyValues.numberOfChildren) {
          throw Error("Cannot select " + numberUniqueRequired +
            " components from only " + dependencyValues.numberOfChildren);
        }

        // normalize selectWeights to sum to 1
        let selectWeightByChild = [...dependencyValues.selectWeightByChild];
        let totalWeight = selectWeightByChild.reduce((a, c) => a + c);
        selectWeightByChild = selectWeightByChild.map(x => x / totalWeight);

        //https://stackoverflow.com/a/44081700
        let cumulativeWeights = selectWeightByChild.reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], []);
        let indsRemaining = [...Array(cumulativeWeights.length).keys()];

        for (let ind = 0; ind < dependencyValues.numberToSelect; ind++) {

          // random number in [0, 1)
          let rand = dependencyValues.selectRng.random();

          // find largest index where cumulativeWeight is larger than rand
          // using binary search
          let start = -1, end = cumulativeWeights.length - 1;
          while (start < end - 1) {
            let mid = Math.floor((start + end) / 2); // mid point
            if (cumulativeWeights[mid] > rand) {
              end = mid;
            } else {
              start = mid;
            }
          }

          let selectedInd = indsRemaining[end]
          selectedIndices.push(selectedInd);

          if (!dependencyValues.withReplacement && ind < dependencyValues.numberToSelect - 1) {
            // remove selected index and renormalize weights
            selectWeightByChild.splice(end, 1);
            indsRemaining.splice(end, 1);
            totalWeight = selectWeightByChild.reduce((a, c) => a + c);
            selectWeightByChild = selectWeightByChild.map(x => x / totalWeight);
            cumulativeWeights = selectWeightByChild.reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], []);

          }
        }


        return {
          makeEssential: ["selectedIndices"],
          newValues: {
            selectedIndices,
          }
        }
      }
    }

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        selectedIndices: {
          dependencyType: "stateVariable",
          variableName: "selectedIndices"
        }
      }),
      definition: () => ({
        newValues: { readyToExpandWhenResolved: true }
      })
    }

    return stateVariableDefinitions;
  }


  updateStateOld(args = {}) {

    // TODO: do we need to create a numGrandchildrenNamed state variable
    // and use it somewhere?

    // if assign names as a second dimension,
    // then grand children that could be assigned names must be of the same type
    let assignNames = this.doenetAttributes.assignNames;
    this.state.numGrandchildrenNamed = 0;
    if (assignNames !== undefined) {
      for (let item of assignNames) {
        if (Array.isArray(item)) {
          if (item.some(x => Array.isArray(x))) {
            throw Error("Invalid assign names.  Only two levels implemented");
          }
          this.state.numGrandchildrenNamed = Math.max(this.state.numGrandchildrenNamed, item.length)
        }
      }

    }


  }


  static createSerializedReplacements({ component }) {

    // console.log(`create serialized replacements for ${component.componentName}`);

    let replacementsWithInstructions = [];

    let assignNames = component.doenetAttributes.assignNames;

    for (let [replacementNumber, childIndex] of component.stateValues.selectedIndices.entries()) {

      let name;
      if (assignNames !== undefined) {
        name = assignNames[replacementNumber];
      }
      let instruction = {
        operation: "assignName",
        name
      }

      let serializedChild = component.stateValues.childrenToSelect[childIndex];

      if (component.stateValues.hide) {
        // if select is hidden, then make each of its replacements hidden

        // shallow copy of child and then its state so that can modify state
        serializedChild = Object.assign({}, serializedChild);
        if (serializedChild.state) {
          serializedChild.state = Object.assign({}, serializedChild.state);
        } else {
          serializedChild.state = {};
        }

        serializedChild.state.hide = true;

        // if assigning names to grandchild, then hide those as well
        // so that refs of those will be hidden, for consistency
        // Make shallow copies as necessary so that can modify
        if (Array.isArray(name)) {
          if (serializedChild.children) {
            serializedChild.children = [...serializedChild.children];
            for (let [ind, grandchild] of serializedChild.children.entries()) {
              grandchild = Object.assign({}, grandchild);
              if (grandchild.state) {
                grandchild.state = Object.assign({}, grandchild.state);
              } else {
                grandchild.state = {};
              }
              grandchild.state.hide = true;
              serializedChild.children[ind] = grandchild;
            }
          }
        }
      }

      replacementsWithInstructions.push({
        instructions: [instruction],
        replacements: [serializedChild]
      })
    }

    // console.log("replacementsWithInstructions")
    // console.log(replacementsWithInstructions)


    // if subvariants were specified, add those the corresponding descendants
    if (component.variants && component.variants.desiredVariant !== undefined) {

      let desiredVariant = component.variants.desiredVariant;
      if (desiredVariant !== undefined && desiredVariant.subvariants !== undefined &&
        component.variants.descendantVariantComponents !== undefined) {

        // collect descendantVariantComponents that would be in select
        // if it just had the selected indicies
        let descendantVariantComponents = [];
        for (let r_and_inst of replacementsWithInstructions) {
          let r = r_and_inst.replacements[0];
          if (r.variants !== undefined) {
            if (r.variants.isVariantComponent) {
              descendantVariantComponents.push(r)
            } else if (r.variants.descendantVariantComponents) {
              descendantVariantComponents.push(...r.variants.descendantVariantComponents);
            }
          }
        }
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

    return { replacementsWithInstructions };
  }

  static calculateReplacementChanges() {

    return [];

  }


  static determineNumberOfUniqueVariants({ serializedComponent }) {
    let numberToSelect = 1, withReplacement = false;
    let numberOfVariantsByChild = [];
    let childrenToSelect = [];
    if (serializedComponent.state !== undefined) {
      if (serializedComponent.state.numberToSelect !== undefined) {
        numberToSelect = serializedComponent.state.numberToSelect;
      }
      if (serializedComponent.state.withReplacement !== undefined) {
        withReplacement = serializedComponent.state.withReplacement;
      }
    }
    if (serializedComponent.children === undefined) {
      return { succes: false }
    }

    let stringChild;
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
        // calculate withReplacement only if has its implicitValue or value set directly
        // or if has a child that is a string
        let foundValid = false;
        if (child.state !== undefined) {
          if (child.state.implicitValue !== undefined) {
            withReplacement = child.state.implicitValue;
            foundValid = true;
          }
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
              if (["true", "t"].includes(grandchild.state.value.trim().toLowerCase())) {
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

      } else if (componentType === "selectWeight") {
        // uniquevariants disabled if have a child with selectWeight specified
        return { succes: false }
      } else if (componentType !== "hide" && componentType !== "modifyIndirectly") {
        if (componentType === "string") {
          stringChild = child;
        }
        let childvariants = 1;
        if (child.variants !== undefined && child.variants.numberOfVariants !== undefined) {
          childvariants = child.variants.numberOfVariants;
        }
        numberOfVariantsByChild.push(childvariants);
        childrenToSelect.push(child);
      }
    }
    // console.log("numberOfVariantsByChild")
    // console.log(numberOfVariantsByChild)
    if (numberOfVariantsByChild.length === 0) {
      return { success: false }
    }

    // if have one string child, it will be broken into children by commas
    // account for number of resulting children, each with one variant
    if (stringChild !== undefined && numberOfVariantsByChild.length === 1) {
      let numPieces = stringChild.state.value.split(",").length;
      numberOfVariantsByChild = Array(numPieces).fill(1);
    }

    let uniqueVariantData = {
      numberOfVariantsByChild: numberOfVariantsByChild,
      numberToSelect: numberToSelect,
      withReplacement: withReplacement,
      childrenToSelect: childrenToSelect,
    }

    if (withReplacement || numberToSelect === 1) {
      let numberOfOptionsPerSelection = numberOfVariantsByChild.reduce((a, c) => a + c);
      let numberOfVariants = Math.pow(numberOfOptionsPerSelection, numberToSelect);
      return {
        success: true,
        numberOfVariants: numberOfVariants,
        uniqueVariantData: uniqueVariantData,
      }
    }
    let numberOfChildren = numberOfVariantsByChild.length;

    if (numberToSelect > numberOfChildren) {
      return { success: false }
    }

    let firstNumber = numberOfVariantsByChild[0]
    let allSameNumber = numberOfVariantsByChild.slice(1).every(x => x === firstNumber);

    if (allSameNumber) {
      let numberOfPermutations = numberOfChildren;
      for (let n = numberOfChildren - 1; n > numberOfChildren - numberToSelect; n--) {
        numberOfPermutations *= n;
      }
      let numberOfVariants = numberOfPermutations * Math.pow(firstNumber, numberToSelect);
      return {
        success: true,
        numberOfVariants: numberOfVariants,
        uniqueVariantData: uniqueVariantData,
      }
    }

    // have select without replacement where options have different numbers of variants
    let numberOfVariants = countOptions(numberOfVariantsByChild, numberToSelect);
    return {
      success: true,
      numberOfVariants: numberOfVariants,
      uniqueVariantData: uniqueVariantData,
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

    let uniqueVariantData = serializedComponent.variants.uniqueVariantData;
    let numberOfVariantsByChild = uniqueVariantData.numberOfVariantsByChild;
    let numberToSelect = uniqueVariantData.numberToSelect;
    let withReplacement = uniqueVariantData.withReplacement;
    let numberOfChildren = numberOfVariantsByChild.length;
    let childrenToSelect = uniqueVariantData.childrenToSelect;

    let combinations = enumerateSelectionCombinations({
      numberOfIndices: numberToSelect,
      numberOfOptions: numberOfChildren,
      maxNumber: variantNumber + 1,
      withReplacement: withReplacement,
    })

    // console.log(combinations);

    let numberOfCombinations = combinations.length;
    // console.log("number of combinations: " + numberOfCombinations);

    // for each combination, determine the number of possibilities
    let combinationsAvailable = combinations.map(x => ({
      combination: x,
      numberOfPossibilities: x.reduce((a, c) => a * numberOfVariantsByChild[c], 1),
    }))

    // console.log(combinationsAvailable);
    // console.log(numberOfVariantsByChild);

    // The variants, in order, will
    // select the first possibility from each combination
    // followed by the second possibility, etc.
    // When the possibilities from the combination are exhaust
    // skip that combination

    let combinationsLeft = [...Array(numberOfCombinations).keys()];
    let possibilitiesUsed = 0;
    let nCombinationsLeft = combinationsLeft.length;
    let combinationIndexSelected, variantNumberOfSelected;

    let variantNumberLeft = variantNumber;

    while (nCombinationsLeft > 0) {

      // find minimum number of possibilities in those that are left

      let minNumPos = combinationsLeft.map(ind => combinationsAvailable[ind])
        .reduce((a, c) => Math.min(a, c.numberOfPossibilities), Infinity);

      let chunksize = minNumPos - possibilitiesUsed;

      if (variantNumberLeft < chunksize * nCombinationsLeft) {
        // won't exhaust the possibilities for any combination
        combinationIndexSelected = combinationsLeft[variantNumberLeft % nCombinationsLeft];
        variantNumberOfSelected = possibilitiesUsed + Math.floor(variantNumberLeft / nCombinationsLeft);
        break;
      } else {
        possibilitiesUsed += chunksize;
        variantNumberLeft -= chunksize * nCombinationsLeft;
        combinationsLeft = combinationsLeft.filter(
          ind => combinationsAvailable[ind].numberOfPossibilities > possibilitiesUsed
        );
        nCombinationsLeft = combinationsLeft.length;

      }

    }

    // console.log("combinationIndexSelected: " + combinationIndexSelected)
    // console.log("variantNumberOfSelected: " + variantNumberOfSelected)

    let selectedCombination = combinations[combinationIndexSelected];
    // console.log("selectedCombination: " + selectedCombination)

    let indicesForEachChild = enumerateCombinations({
      numberOfOptionsByIndex: selectedCombination.map(x => numberOfVariantsByChild[x]),
      maxNumber: variantNumberOfSelected + 1,
    })[variantNumberOfSelected];

    // console.log("indicesForEachChild: " + indicesForEachChild)

    // for each selected child, find the descendant variant components
    // and map the variant number (index) of that child
    // to the indices of those descendat variant components


    let subvariants = [];

    let haveNontrivialSubvariants = false;
    for (let [ind, childNum] of selectedCombination.entries()) {
      if (numberOfVariantsByChild[childNum] > 1) {
        let child = childrenToSelect[childNum];
        if (child.variants.isVariantComponent) {
          let compClass = allComponentClasses[child.componentType];
          let result = compClass.getUniqueVariant({
            serializedComponent: child,
            variantNumber: indicesForEachChild[ind],
            allComponentClasses: allComponentClasses,
          });
          if (!result.success) {
            return { success: false }
          }
          subvariants.push(result.desiredVariant);
        } else {
          let result = getVariantsForDescendants({
            variantNumber: indicesForEachChild[ind],
            serializedComponent: child,
            allComponentClasses: allComponentClasses
          })
          if (!result.success) {
            return { success: false }
          }
          subvariants.push(...result.desiredVariants);
        }
        haveNontrivialSubvariants = true;
      } else {
        subvariants.push({});
      }
    }

    let desiredVariant = { indices: selectedCombination };
    if (haveNontrivialSubvariants) {
      desiredVariant.subvariants = subvariants;
    }
    return { success: true, desiredVariant: desiredVariant }

  }

}


function numbersOrTextFromString(s) {
  let pieces = s.split(",").map(x => x.trim());

  let foundNumbers = pieces.every(x => Number.isFinite(Number(x)));
  if (foundNumbers) {
    pieces = pieces.map(Number)
  }

  let componentType = foundNumbers ? "number" : "text";

  return pieces.map(x => ({
    componentType: componentType,
    state: { value: x }
  }));

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
}


// from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
function flattenDeep(arr1) {
  return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}

function extractVariants(serializedComponent) {
  let variantsChild, variantsInd;
  for (let [ind, child] of serializedComponent.children.entries()) {
    if (child.componentType === "variants") {
      if (variantsChild !== undefined) {
        throw Error("A component can have only one variants child");
      }
      variantsChild = child;
      variantsInd = ind;
    }
  }
  if (variantsChild === undefined) {
    return [];
  }

  // remove variants child
  serializedComponent.children.splice(variantsInd, 1);

  let availableVariants = [];

  // extract variants from variantsInd
  // Two options:
  // - variants has single string child
  // - variants has variant children
  if (variantsChild.children.length === 1 && variantsChild.children[0].componentType === "string") {
    availableVariants = variantsChild.children[0].state.value.split(",").map(x => x.trim());
  } else {
    for (let grandchild of variantsChild.children) {
      if (grandchild.componentType !== "variant") {
        throw Error("Invalid variants tag.  It must have either a single string child or all variant children.");
      }
      if (grandchild.children === undefined || grandchild.children.length !== 1 ||
        grandchild.children[0].componentType !== "string") {
        throw Error("Invalid variant tag.  It must have a single string child.");
      }
      availableVariants.push(grandchild.children[0].state.value);
    }
  }

  return availableVariants;

}

function extractSelectWeight(serializedComponent) {
  let selectWeightChild, selectWeightInd;
  for (let [ind, child] of serializedComponent.children.entries()) {
    if (child.componentType === "selectweight") {
      if (selectWeightChild !== undefined) {
        throw Error("A component can have only one selectweight child");
      }
      selectWeightChild = child;
      selectWeightInd = ind;
    }
  }

  if (selectWeightChild === undefined) {
    return 1;
  }

  // remove selectWeight child
  serializedComponent.children.splice(selectWeightInd, 1);

  if (selectWeightChild.children.length === 1 && selectWeightChild.children[0].componentType === "string") {
    let selectWeight = Number(selectWeightChild.children[0].state.value.split(",").map(x => x.trim()));
    if (selectWeight >= 0) {
      return selectWeight;
    }
    throw Error("Invalid selectweight tag.  It must be a nonnegative number.")
  } else {
    throw Error("Invalid selectweight tag.  It must have a single string child.");
  }

}
