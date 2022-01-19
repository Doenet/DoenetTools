import { numberToLetters } from './sequence.js';
import * as serializeFunctions from './serializedStateProcessing.js';
import * as ComponentTypes from '../ComponentTypes'
import Hex from 'crypto-js/enc-hex';
import sha256 from 'crypto-js/sha256';
import axios from 'axios';

export function returnAllPossibleVariants({
  doenetML, flags = {}
}) {


  let standardComponentClasses = ComponentTypes.standardComponentClasses();
  let allComponentClasses = ComponentTypes.allComponentClasses();
  let componentTypesCreatingVariants = ComponentTypes.componentTypesCreatingVariants();
  let componentTypeWithPotentialVariants = ComponentTypes.componentTypeWithPotentialVariants();

  let componentTypeLowerCaseMapping = {};
  for (let componentType in allComponentClasses) {
    componentTypeLowerCaseMapping[componentType.toLowerCase()] = componentType;
  }


  let stateVariableInfo = {};
  for (let componentType in allComponentClasses) {
    Object.defineProperty(stateVariableInfo, componentType, {
      get: function () {
        let info = allComponentClasses[componentType].returnStateVariableInfo({ flags: flags });
        delete stateVariableInfo[componentType];
        return stateVariableInfo[componentType] = info;
      },
      configurable: true
    })
  }



  let publicStateVariableInfo = {};
  for (let componentType in allComponentClasses) {
    Object.defineProperty(publicStateVariableInfo, componentType, {
      get: function () {
        let info = allComponentClasses[componentType].returnStateVariableInfo({
          onlyPublic: true, flags: flags
        });
        delete publicStateVariableInfo[componentType];
        return publicStateVariableInfo[componentType] = info;
      },
      configurable: true
    })
  }


  let isInheritedComponentType = function ({ inheritedComponentType, baseComponentType }) {
    if (inheritedComponentType === baseComponentType) {
      return true;
    }
    let baseClass = allComponentClasses[baseComponentType];
    if (!baseClass) {
      return false;
    }
    return baseClass.isPrototypeOf(
      allComponentClasses[inheritedComponentType]
    );
  }

  let isCompositeComponent = function ({ componentType, includeNonStandard = true }) {
    let componentClass = allComponentClasses[componentType];
    if (!componentClass) {
      return false;
    }

    let isComposite = isInheritedComponentType({
      inheritedComponentType: componentType,
      baseComponentType: "_composite"
    })

    return isComposite &&
      (includeNonStandard || !componentClass.treatAsComponentForRecursiveReplacements)
  }

  let componentInfoObjects = {
    standardComponentClasses, allComponentClasses,
    componentTypesCreatingVariants, componentTypeWithPotentialVariants,
    componentTypeLowerCaseMapping,
    isInheritedComponentType,
    isCompositeComponent,
    stateVariableInfo: stateVariableInfo,
    publicStateVariableInfo: publicStateVariableInfo,
  };
  let contentId = Hex.stringify(sha256(doenetML));

  return serializeFunctions.expandDoenetMLsToFullSerializedComponents({
    contentIds: [contentId],
    doenetMLs: [doenetML],
    componentInfoObjects,
    flags,
    contentIdsToDoenetMLs
}).then(finishReturnAllPossibleVariants)

}

function finishReturnAllPossibleVariants({
  fullSerializedComponents
}) {

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

 return Promise.resolve({allPossibleVariants});
}


function indexToLowercaseLetters(index) {
  return numberToLetters(index, true)
}



function contentIdsToDoenetMLs({ contentIds, callBack }) {
  let promises = [];
  let newDoenetMLs = {};
  let newContentIds = contentIds;

  for (let contentId of contentIds) {
    promises.push(axios.get(`/media/${contentId}.doenet`))

  }

  function ErrorFromWithinCallback(originalError) {
    this.name = 'ErrorFromWithinCallback';
    this.originalError = originalError;
  }

  Promise.all(promises).then((resps) => {
    // contentIds.forEach((x, i) => newDoenetMLs[x] = resps[i].data)
    newDoenetMLs = resps.map(x => x.data);

    try {
      callBack({
        newDoenetMLs,
        newContentIds,
        success: true
      })
    } catch (e) {
      throw new ErrorFromWithinCallback(e);
    }
  }).catch(err => {

    if (err.name === 'ErrorFromWithinCallback') {
      throw err.originalError;
    }

    let message;
    if (newContentIds.length === 1) {
      message = `Could not retrieve contentId ${newContentIds[0]}`
    } else {
      message = `Could not retrieve contentIds ${newContentIds.join(',')}`
    }

    message += ": " + err.message;

    callBack({
      success: false,
      message,
      newDoenetMLs: [],
      newContentIds: []
    })
  })

}
