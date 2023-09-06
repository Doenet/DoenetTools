import { numberToLetters } from "./sequence.js";
import * as serializeFunctions from "./serializedStateProcessing.js";
import createComponentInfoObjects from "./componentInfoObjects.js";
import { getNumVariants } from "./variants.js";

export async function returnAllPossibleVariants({
  doenetML,
  serializedComponents: preliminarySerializedComponents,
}) {
  let componentInfoObjects = createComponentInfoObjects();

  let { fullSerializedComponents } =
    await serializeFunctions.expandDoenetMLsToFullSerializedComponents({
      doenetMLs: [doenetML],
      preliminarySerializedComponents: [preliminarySerializedComponents],
      componentInfoObjects,
    });

  let serializedComponents = fullSerializedComponents[0];

  serializeFunctions.addDocumentIfItsMissing(serializedComponents);

  let document = serializedComponents[0];

  let results = getNumVariants({
    serializedComponent: document,
    componentInfoObjects,
  });

  let numVariants = results.numVariants;

  let allPossibleVariants;

  if (results.variantNames) {
    let variantNames = [...results.variantNames];

    if (variantNames.length >= numVariants) {
      variantNames = variantNames.slice(0, numVariants);
    } else {
      let originalVariantNames = [...variantNames];
      let variantNumber = variantNames.length;
      let variantValue = variantNumber;
      let variantString;
      while (variantNumber < numVariants) {
        variantNumber++;
        variantValue++;
        variantString = indexToLowercaseLetters(variantValue);
        while (originalVariantNames.includes(variantString)) {
          variantValue++;
          variantString = indexToLowercaseLetters(variantValue);
        }
        variantNames.push(variantString);
      }
    }

    allPossibleVariants = variantNames;
  } else {
    allPossibleVariants = [...Array(numVariants).keys()].map((x) =>
      indexToLowercaseLetters(x + 1),
    );
  }

  return allPossibleVariants;
}

function indexToLowercaseLetters(index) {
  return numberToLetters(index, true);
}
