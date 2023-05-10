import { enumerateCombinations } from "./enumeration";
import { numberToLetters } from "./sequence";

export function getVariantsForDescendantsForUniqueVariants({
  variantIndex,
  serializedComponent,
  componentInfoObjects,
}) {
  let descendantVariantComponents =
    serializedComponent.variants?.descendantVariantComponents;

  if (descendantVariantComponents === undefined) {
    return { success: false };
  }

  let numberOfVariantsByDescendant = descendantVariantComponents.map(
    (x) => x.variants.numberOfVariants,
  );

  let indices = enumerateCombinations({
    numberOfOptionsByIndex: numberOfVariantsByDescendant,
    maxNumber: variantIndex,
  })[variantIndex - 1];

  let desiredVariants = [];
  for (let [ind, comp] of descendantVariantComponents.entries()) {
    let compClass =
      componentInfoObjects.allComponentClasses[comp.componentType];
    let r = compClass.getUniqueVariant({
      serializedComponent: comp,
      variantIndex: indices[ind] + 1,
      componentInfoObjects,
    });
    if (r.success) {
      desiredVariants.push(r.desiredVariant);
    } else {
      return { succss: false };
    }
  }

  return {
    success: true,
    desiredVariants,
  };
}

export function setUpVariantSeedAndRng({
  serializedComponent,
  sharedParameters,
  descendantVariantComponents,
  useSubpartVariantRng = false,
}) {
  // Note: use subpartVariantRng for containers that don't actually select anything random.
  // That way, adding such a non-random component to the DoenetML
  // does not change the values selected by other components that use the regular variantRng.

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
    if (useSubpartVariantRng) {
      variantSeed = sharedParameters.subpartVariantRng().toString().slice(2);
    } else {
      variantSeed = sharedParameters.variantRng().toString().slice(2);
    }
  }

  sharedParameters.variantSeed = variantSeed;
  sharedParameters.variantRng = new sharedParameters.rngClass(
    sharedParameters.variantSeed,
  );
  sharedParameters.subpartVariantRng = new sharedParameters.rngClass(
    sharedParameters.variantSeed + "s",
  );

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

export function gatherVariantComponents({
  serializedComponents,
  componentInfoObjects,
}) {
  // returns a list of serialized components who are variant components,
  // where the components are selected from serializedComponents themselves,
  // or, if a particular component isn't a variant component,
  // then recurse to find descendant variant components

  // Also, as a side effect, mark each found variant component as a variant component
  // directly in the variants attribute of that component

  let variantComponents = [];

  for (let serializedComponent of serializedComponents) {
    if (typeof serializedComponent !== "object") {
      continue;
    }

    if (!serializedComponent.variants) {
      serializedComponent.variants = {};
    }

    if (serializedComponent.variants.isVariantComponent) {
      variantComponents.push(serializedComponent);
      continue;
    }

    let componentType = serializedComponent.componentType;

    if (componentType in componentInfoObjects.componentTypesCreatingVariants) {
      serializedComponent.variants.isVariantComponent = true;
      variantComponents.push(serializedComponent);
      continue;
    }

    if (!serializedComponent.children) {
      continue;
    }

    // check if have a variant control child, which means this component
    // is a variant component
    if (
      serializedComponent.children.some(
        (x) => x.componentType === "variantControl",
      )
    ) {
      serializedComponent.variants.isVariantComponent = true;
      variantComponents.push(serializedComponent);
      continue;
    }

    // if a component isn't a variant component, then recurse on children

    let descendantVariantComponents = gatherVariantComponents({
      serializedComponents: serializedComponent.children,
      componentInfoObjects,
    });

    if (descendantVariantComponents.length > 0) {
      serializedComponent.variants.descendantVariantComponents =
        descendantVariantComponents;
      variantComponents.push(...descendantVariantComponents);
    }
  }

  return variantComponents;
}

export function getNumberOfVariants({
  serializedComponent,
  componentInfoObjects,
}) {
  // get number of variants from document (or other sectioning component)

  if (!serializedComponent.variants) {
    serializedComponent.variants = {};
  }

  let variantControlChild;
  for (let child of serializedComponent.children) {
    if (child.componentType === "variantControl") {
      variantControlChild = child;
      break;
    }
  }

  let isDocument = serializedComponent.componentType === "document";

  if (!variantControlChild) {
    if (!isDocument) {
      // if are a section without a variant control, it doesn't determine variants
      return { success: false };
    }

    // if have a single child that is a section, use variants from that section

    let nonBlankChildren = serializedComponent.children.filter(
      (x) => x.componentType || x.trim() !== "",
    );

    if (
      nonBlankChildren.length === 1 &&
      componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: nonBlankChildren[0].componentType,
        baseComponentType: "_sectioningComponent",
      })
    ) {
      let sectionChild = nonBlankChildren[0];

      let results = getNumberOfVariants({
        serializedComponent: sectionChild,
        componentInfoObjects,
      });

      if (results.success) {
        serializedComponent.variants.descendantVariantComponents =
          gatherVariantComponents({
            serializedComponents: serializedComponent.children,
            componentInfoObjects,
          });

        serializedComponent.variants.uniqueVariants = true;
        serializedComponent.variants.numberOfVariants =
          sectionChild.variants.numberOfVariants;
        serializedComponent.variants.allPossibleVariants =
          sectionChild.variants.allPossibleVariants;
        serializedComponent.variants.allVariantNames =
          sectionChild.variants.allVariantNames;
        serializedComponent.variants.allPossibleVariantUniqueIndices = [
          ...sectionChild.variants.allPossibleVariants.keys(),
        ].map((x) => x + 1);
        serializedComponent.variants.allPossibleVariantSeeds = [
          ...sectionChild.variants.allPossibleVariants.keys(),
        ].map((x) => (x + 1).toString());

        return results;
      }
    }
  }

  return determineVariantsForSection({
    serializedComponent,
    componentInfoObjects,
    isDocument,
  });
}

export function determineVariantsForSection({
  serializedComponent,
  componentInfoObjects,
  isDocument = false,
}) {
  if (serializedComponent.variants === undefined) {
    serializedComponent.variants = {};
  }

  let variantControlChild;
  for (let child of serializedComponent.children) {
    if (child.componentType === "variantControl") {
      variantControlChild = child;
      break;
    }
  }

  if (!variantControlChild && !isDocument) {
    let BaseComponent = componentInfoObjects.allComponentClasses._base;
    return BaseComponent.determineNumberOfUniqueVariants({
      serializedComponent,
      componentInfoObjects,
    });
  }

  let specifiedVariantNames = [];
  if (variantControlChild?.attributes.variantNames) {
    specifiedVariantNames =
      variantControlChild.attributes.variantNames.component.children.map((x) =>
        x.toLowerCase(),
      );
  }

  if (
    specifiedVariantNames.length !== [...new Set(specifiedVariantNames)].length
  ) {
    throw Error("Duplicate variant names specified");
  }

  let nVariantsSpecified = variantControlChild?.attributes.nVariants?.primitive;
  if (!Number.isFinite(nVariantsSpecified)) {
    nVariantsSpecified = 100;
  }

  nVariantsSpecified = Math.min(Math.max(nVariantsSpecified, 1), 1000);

  let variantNames = [...specifiedVariantNames];

  if (variantNames.length < nVariantsSpecified) {
    // if fewer variantNames specified than nVariantsSpecified, find additional variantNames
    // try variantNames, n, n+1, ...., nVariantsSpecified, (converted to letters)
    // except skipping variantNames that are already in original variantNames
    let variantNumber = variantNames.length;
    let variantValue = variantNumber;
    let variantString;
    while (variantNumber < nVariantsSpecified) {
      variantNumber++;
      variantValue++;
      variantString = indexToLowercaseLetters(variantValue);
      while (specifiedVariantNames.includes(variantString)) {
        variantValue++;
        variantString = indexToLowercaseLetters(variantValue);
      }
      variantNames.push(variantString);
    }
  } else {
    variantNames = variantNames.slice(0, nVariantsSpecified);
  }

  let variantsToInclude =
    variantControlChild?.attributes.variantsToInclude?.component.children;
  if (variantsToInclude) {
    if (variantsToInclude.length === 0) {
      throw Error(
        "Cannot specify a blank variantsToInclude attribute of a variantControl",
      );
    }

    variantsToInclude = variantsToInclude.map((x) => x.toLowerCase());

    // deduplicate
    variantsToInclude = [...new Set(variantsToInclude)];

    for (let variant of variantsToInclude) {
      if (!variantNames.includes(variant)) {
        throw Error(
          `Cannot include variant ${variant} as ${variant} is a not variant name`,
        );
      }
    }
  }

  let variantsToExclude =
    variantControlChild?.attributes.variantsToExclude?.component.children;
  if (variantsToExclude) {
    variantsToExclude = variantsToExclude.map((x) => x.toLowerCase());

    for (let variant of variantsToExclude) {
      if (!variantNames.includes(variant)) {
        throw Error(
          `Cannot exclude variant ${variant} as ${variant} is not a variant name`,
        );
      }
    }
  } else {
    variantsToExclude = [];
  }

  if (variantsToInclude) {
    variantsToInclude = variantsToInclude.filter(
      (x) => !variantsToExclude.includes(x),
    );
  } else {
    variantsToInclude = [...variantNames].filter(
      (x) => !variantsToExclude.includes(x),
    );
  }

  let variantsToIncludeUniqueIndices = variantsToInclude.map(
    (variant) => variantNames.indexOf(variant) + 1,
  );

  // determine seeds
  let specifiedSeeds = [];
  if (variantControlChild?.attributes.seeds) {
    specifiedSeeds = variantControlChild.attributes.seeds.component.children;
  }

  let variantSeeds = [...specifiedSeeds];

  if (variantSeeds.length < nVariantsSpecified) {
    // if fewer variantSeeds specified than nVariantsSpecified, find additional seeds
    // try seeds, n, n+1, ...., nVariantsSpecified
    // except skipping seeds that are already in specifiedSeeds

    let seedNumber = variantSeeds.length;
    let seedValue = seedNumber;
    let seedString;
    while (seedNumber < nVariantsSpecified) {
      seedNumber++;
      seedValue++;
      seedString = seedValue.toString();
      while (specifiedSeeds.includes(seedString)) {
        seedValue++;
        seedString = seedValue.toString();
      }
      variantSeeds.push(seedString);
    }
  } else {
    variantSeeds = variantSeeds.slice(0, nVariantsSpecified);
  }

  let variantsToIncludeSeeds = variantsToIncludeUniqueIndices.map(
    (i) => variantSeeds[i - 1],
  );

  // determine if use unique variants
  // if unique variants attribute is specified as false or fail to determine number of unique variants
  // then do no use unique variants
  // else if
  // - unique variants attribute is specified as true or
  // - number of unique variants <= nVariantsSpecified
  // then use unique variants
  // else do not use unique variants

  let uniqueVariantsIsSpecified =
    variantControlChild?.attributes.uniqueVariants !== undefined;

  let uniqueVariants =
    variantControlChild?.attributes.uniqueVariants?.primitive;

  let uniqueResult;

  if (uniqueVariants || !uniqueVariantsIsSpecified) {
    let BaseComponent = componentInfoObjects.allComponentClasses._base;
    uniqueResult = BaseComponent.determineNumberOfUniqueVariants({
      serializedComponent,
      componentInfoObjects,
    });

    if (!uniqueResult.success) {
      uniqueVariants = false;
    } else {
      uniqueVariants =
        uniqueVariants || uniqueResult.numberOfVariants <= nVariantsSpecified;
    }
  }

  let allPossibleVariants = [];
  let allPossibleVariantUniqueIndices = [];
  let allPossibleVariantSeeds = [];

  if (uniqueVariants) {
    for (let [ind, num] of variantsToIncludeUniqueIndices.entries()) {
      if (num <= uniqueResult.numberOfVariants) {
        allPossibleVariantUniqueIndices.push(num);
        allPossibleVariants.push(variantsToInclude[ind]);
        allPossibleVariantSeeds.push(variantsToIncludeSeeds[ind]);
      }
    }
  } else {
    allPossibleVariants = variantsToInclude;
    allPossibleVariantUniqueIndices = variantsToIncludeUniqueIndices;
    allPossibleVariantSeeds = variantsToIncludeSeeds;
  }

  let numberOfVariants = allPossibleVariants.length;
  if (numberOfVariants === 0) {
    throw Error(
      "No variants selected based on variantsToInclude, variantsToExclude, and the number of variants available",
    );
  }

  serializedComponent.variants.uniqueVariants = uniqueVariants;
  serializedComponent.variants.numberOfVariants = numberOfVariants;
  serializedComponent.variants.allPossibleVariants = allPossibleVariants;
  serializedComponent.variants.allVariantNames = variantNames;
  serializedComponent.variants.allPossibleVariantUniqueIndices =
    allPossibleVariantUniqueIndices;
  serializedComponent.variants.allPossibleVariantSeeds =
    allPossibleVariantSeeds;

  return {
    success: true,
    numberOfVariants,
  };
}

function indexToLowercaseLetters(index) {
  return numberToLetters(index, true);
}
