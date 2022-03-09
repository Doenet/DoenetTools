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

  let { fullSerializedComponents } = await serializeFunctions.expandDoenetMLsToFullSerializedComponents({
    contentIds: [cid],
    doenetMLs: [doenetML],
    componentInfoObjects: createComponentInfoObjects(flags),
    flags,
  });

  let serializedComponents = fullSerializedComponents[0];

  serializeFunctions.addDocumentIfItsMissing(serializedComponents);

  let document = serializedComponents[0];

  let variantControlChild;

  // look for variantControl child document
  for (let [ind, child] of document.children.entries()) {
    if (child.componentType === "variantControl") {
      variantControlChild = child;
      break;
    }
  }


  let nVariants = 100;
  let allPossibleVariants;


  if (variantControlChild !== undefined) {

    // create variant names from variant control child

    if (variantControlChild.attributes && variantControlChild.attributes.nVariants) {
      nVariants = Math.round(Number(variantControlChild.attributes.nVariants.primitive));
    }

    let variantNames = [];
    if (variantControlChild.attributes && variantControlChild.attributes.variantNames) {
      let variantNamesComponent = variantControlChild.attributes.variantNames.component;

      variantNames = variantNamesComponent.children.map(x => x.toLowerCase().substring(0, 1000));
    }


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

