import { enumerateCombinations } from './enumeration';


export function getVariantsForDescendantsForUniqueVariants({
  variantIndex,
  serializedComponent,
  componentInfoObjects
}) {

  let descendantVariantComponents = serializedComponent.variants?.descendantVariantComponents;

  if (descendantVariantComponents === undefined) {
    return { success: false }
  }

  let numberOfVariantsByDescendant = descendantVariantComponents.map(
    x => x.variants.numberOfVariants
  );

  let indices = enumerateCombinations({
    numberOfOptionsByIndex: numberOfVariantsByDescendant,
    maxNumber: variantIndex,
  })[variantIndex - 1];

  let desiredVariants = [];
  for (let [ind, comp] of descendantVariantComponents.entries()) {
    let compClass = componentInfoObjects.allComponentClasses[comp.componentType];
    let r = compClass.getUniqueVariant({
      serializedComponent: comp,
      variantIndex: indices[ind] + 1,
      componentInfoObjects,
    });
    if (r.success) {
      desiredVariants.push(r.desiredVariant);
    } else {
      return { succss: false }
    }
  }

  return {
    success: true,
    desiredVariants
  }
}

export function setUpVariantSeedAndRng({
  serializedComponent, sharedParameters,
  descendantVariantComponents,
}) {

  let variantSeed;
  // check if desiredVariant was specified
  let desiredVariant;
  if (serializedComponent.variants) {
    desiredVariant = serializedComponent.variants.desiredVariant;
  }
  if (desiredVariant?.seed !== undefined) {
    variantSeed = desiredVariant.seed.toString();
  } else {

    // if variant seed wasn't specifed

    // randomly pick variant seed
    variantSeed = sharedParameters.variantRng().toString().slice(2);
  }

  sharedParameters.variantSeed = variantSeed;
  sharedParameters.variantRng = new sharedParameters.rngClass(sharedParameters.variantSeed);

  // if subvariants were specified, add those the corresponding descendants

  if (desiredVariant?.subvariants && descendantVariantComponents) {
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
