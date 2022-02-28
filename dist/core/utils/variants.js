import { enumerateCombinations } from './enumeration.js';


export function getVariantsForDescendants({
  variantIndex,
  serializedComponent,
  allComponentClasses
}) {

  if (serializedComponent.variants === undefined) {
    return { success: false };
  }
  let descendantVariantComponents = serializedComponent.variants.descendantVariantComponents;

  if (descendantVariantComponents === undefined) {
    return { success: false }
  }

  let numberOfVariantsByDescendant = descendantVariantComponents.map(
    x => x.variants.numberOfVariants
  );

  let indices = enumerateCombinations({
    numberOfOptionsByIndex: numberOfVariantsByDescendant,
    maxNumber: variantIndex + 1,
  })[variantIndex];

  let desiredVariants = [];
  for (let [ind, comp] of descendantVariantComponents.entries()) {
    let compClass = allComponentClasses[comp.componentType];
    let r = compClass.getUniqueVariant({
      serializedComponent: comp,
      variantIndex: indices[ind],
      allComponentClasses: allComponentClasses,
    });
    if (r.success) {
      desiredVariants.push(r.desiredVariant);
    } else {
      return { succss: false }
    }
  }

  // console.log("desiredVariants");
  // console.log(desiredVariants);
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
