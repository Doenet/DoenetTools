import { numberToLetters } from './sequence.js';
import * as serializeFunctions from './serializedStateProcessing.js';
import createComponentInfoObjects from './componentInfoObjects.js';
import { retrieveTextFileForCid } from './retrieveTextFile.js';
import { cidFromText } from './cid.js';

export async function returnAllPossibleVariants({
  cid, doenetML, flags = {}
}) {

  if (doenetML === undefined) {
    doenetML = await retrieveTextFileForCid(cid, "doenet");
  } else if (!cid) {
    cid = await cidFromText(doenetML);
  }

  let componentInfoObjects = createComponentInfoObjects(flags);

  let { fullSerializedComponents } = await serializeFunctions.expandDoenetMLsToFullSerializedComponents({
    contentIds: [cid],
    doenetMLs: [doenetML],
    componentInfoObjects,
    flags,
  });

  let serializedComponents = fullSerializedComponents[0];

  serializeFunctions.addDocumentIfItsMissing(serializedComponents);

  let document = serializedComponents[0];

  let results = serializeFunctions.getNumberOfVariants({
    serializedComponent: document,
    componentInfoObjects
  })

  let nVariants = results.numberOfVariants;

  let allPossibleVariants;

  if (results.variantNames) {

    let variantNames = [...results.variantNames];

    if (variantNames.length >= nVariants) {
      variantNames = variantNames.slice(0, nVariants);
    } else {
      let originalVariantNames = [...variantNames];
      let variantNumber = variantNames.length;
      let variantValue = variantNumber;
      let variantString;
      while (variantNumber < nVariants) {
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

    allPossibleVariants = [...Array(nVariants).keys()].map(x => indexToLowercaseLetters(x + 1));

  }

  return { allPossibleVariants, doenetML, cid };
}


function indexToLowercaseLetters(index) {
  return numberToLetters(index, true)
}

