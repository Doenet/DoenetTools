import { numberToLetters } from '../utils/sequence';
import BaseComponent from './abstract/BaseComponent';

export default class VariantControl extends BaseComponent {
  static componentType = "variantControl";
  static rendererType = undefined;

  // static createsVariants = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.nVariants = {
      createPrimitiveOfType: "integer",
      createStateVariable: "nVariants",
      defaultValue: 100,
      clamp: [1, 999],
      public: true,
    };
    attributes.uniqueVariants = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "uniqueVariants",
      defaultValue: false,
      public: true,
    };

    attributes.variantNames = {
      createComponentOfType: "variantNames"
    }

    attributes.seeds = {
      createComponentOfType: "seeds"
    }

    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nVariantsSpecified = {
      returnDependencies: ({ sharedParameters }) => ({
        uniqueVariants: {
          dependencyType: "stateVariable",
          variableName: "uniqueVariants"
        },
        numberOfVariantsFromSharedParameters: {
          dependencyType: "value",
          value: sharedParameters.numberOfVariants,
        },
        nVariants: {
          dependencyType: "stateVariable",
          variableName: "nVariants"
        }
      }),
      definition: function ({ dependencyValues }) {

        let nVariantsSpecified = dependencyValues.nVariants;

        if (nVariantsSpecified < 1) {
          nVariantsSpecified = 1;
        }

        // if have unique variants, then shared parameters
        // should be an override for the number of variants
        if (dependencyValues.uniqueVariants) {
          if (dependencyValues.numberOfVariantsFromSharedParameters !== undefined) {
            nVariantsSpecified = dependencyValues.numberOfVariantsFromSharedParameters;
          } else {
            console.log("Restricting to unique variants was not successful")
          }
        }

        return { setValue: { nVariantsSpecified } };
      }
    }

    stateVariableDefinitions.nSeeds = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        seedsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "seeds",
          variableNames: ["nSeeds"],
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.seedsAttr !== null) {
          return { setValue: { nSeeds: dependencyValues.seedsAttr.stateValues.nSeeds } }
        } else {
          return { setValue: { nSeeds: 0 } }
        }
      }
    }


    stateVariableDefinitions.seeds = {
      public: true,
      componentType: "seed",
      isArray: true,
      entryPrefixes: ["seed"],
      returnArraySizeDependencies: () => ({
        nSeeds: {
          dependencyType: "stateVariable",
          variableName: "nSeeds",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nSeeds];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            seedsAttr: {
              dependencyType: "attributeComponent",
              attributeName: "seeds",
              variableNames: ["seed" + (Number(arrayKey) + 1)],
            }
          }
        }
        return { dependenciesByKey }
      },
      arrayDefinitionByKey: function ({ dependencyValuesByKey, arrayKeys }) {
        let seeds = {};
        for (let arrayKey of arrayKeys) {
          if (dependencyValuesByKey[arrayKey].seedsAttr !== null) {
            seeds[arrayKey] = dependencyValuesByKey[arrayKey].seedsAttr
              .stateValues["seed" + (Number(arrayKey) + 1)]
          }
        }
        return { setValue: { seeds } }
      }
    }

    stateVariableDefinitions.originalVariantNames = {
      returnDependencies: () => ({
        variantNamesAttr: {
          dependencyType: "attributeComponent",
          attributeName: "variantNames",
          variableNames: ["variantNames"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let originalVariantNames = [];
        if (dependencyValues.variantNamesAttr !== null) {
          originalVariantNames = dependencyValues.variantNamesAttr.stateValues.variantNames;
        }
        return { setValue: { originalVariantNames } }
      }
    }

    stateVariableDefinitions.variantNames = {
      public: true,
      componentType: "variantName",
      isArray: true,
      entryPrefixes: ["variantName"],
      returnArraySizeDependencies: () => ({
        nVariantsSpecified: {
          dependencyType: "stateVariable",
          variableName: "nVariantsSpecified",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nVariantsSpecified];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          originalVariantNames: {
            dependencyType: "stateVariable",
            variableName: "originalVariantNames"
          },
          nVariantsSpecified: {
            dependencyType: "stateVariable",
            variableName: "nVariantsSpecified"
          }
        }
        return { globalDependencies };
      },
      arrayDefinitionByKey: function ({ globalDependencyValues, arrayKeys }) {

        // if fewer variantNames specified than nVariantsSpecified, find additional variantNames
        // try variantNames, n, n+1, ...., nVariantsSpecified, (converted to letters)
        // except skipping variantNames that are already in original variantNames
        let variantNames = [...globalDependencyValues.originalVariantNames];
        let variantNumber = variantNames.length;
        let variantValue = variantNumber;
        let variantString;
        while (variantNumber < globalDependencyValues.nVariantsSpecified) {
          variantNumber++;
          variantValue++;
          variantString = indexToLowercaseLetters(variantValue);
          while (globalDependencyValues.originalVariantNames.includes(variantString)) {
            variantValue++;
            variantString = indexToLowercaseLetters(variantValue);
          }
          variantNames.push(variantString);
        }

        return { setValue: { variantNames } }
      }
    }


    stateVariableDefinitions.selectedVariantIndex = {
      public: true,
      componentType: "number",
      immutable: true,
      hasEssential: true,
      shadowVariable: true,
      returnDependencies: ({ sharedParameters }) => ({
        variantsObject: {
          dependencyType: "variants",
        },
        originalVariantNames: {
          dependencyType: "stateVariable",
          variableName: "originalVariantNames"
        },
        variantNames: {
          dependencyType: "stateVariable",
          variableName: "variantNames"
        },
        nVariantsSpecified: {
          dependencyType: "stateVariable",
          variableName: "nVariantsSpecified"
        },
        variantRng: {
          dependencyType: "value",
          value: sharedParameters.variantRng,
          doNotProxy: true,
        }
      }),
      definition: function ({ dependencyValues }) {

        // determine how variant will be selected.
        // Use the first of these options that is available
        // 1. if variants.desiredVariantIndex is defined and is a valid index,
        //    then use that for variantIndex
        // 2. if variants.desiredVariantName is defined and is a valid variantName
        //    then use the variantIndex corresponding to that name
        // 3. else, randomly generate variantIndex (except use 1 for document)


        // no essential state variable, so try to find desiredVariant
        if (dependencyValues.variantsObject !== undefined) {
          if (dependencyValues.variantsObject.desiredVariantIndex !== undefined) {
            let desiredVariantIndex = Number(dependencyValues.variantsObject.desiredVariantIndex);
            if (!Number.isFinite(desiredVariantIndex)) {
              console.warn("Variant index " + dependencyValues.variantsObject.desiredVariantIndex + " must be a number");
              return {
                setEssentialValue: { selectedVariantIndex: true },
                setValue: { selectedVariantIndex: 1 }
              }
            } else {
              if (!Number.isInteger(desiredVariantIndex)) {
                console.warn("Variant index " + dependencyValues.variantsObject.desiredVariantIndex + " must be an integer");
                desiredVariantIndex = Math.round(desiredVariantIndex);
              }

              let indexFrom0 = (desiredVariantIndex - 1) % dependencyValues.nVariantsSpecified;
              if (indexFrom0 < 0) {
                indexFrom0 += dependencyValues.nVariantsSpecified;
              }
              let selectedVariantIndex = indexFrom0 + 1;
              return {
                setEssentialValue: { selectedVariantIndex },
                setValue: { selectedVariantIndex }
              }
            }
          }
          if (dependencyValues.variantsObject.desiredVariantName !== undefined) {
            if (typeof dependencyValues.variantsObject.desiredVariantName === "string") {
              // want case insensitive test, so convert to lower case
              // treat originalVariantNames separately so don't have to lower case
              // remaining variantNames, which are alread lowercase
              let originalLowerCaseVariantNames = dependencyValues.originalVariantNames.map(x => x.toLowerCase());
              let lowerCaseVariantNames = [...originalLowerCaseVariantNames, ...dependencyValues.variantNames.slice(originalLowerCaseVariantNames.length)];
              let desiredIndexFrom0 = lowerCaseVariantNames.indexOf(dependencyValues.variantsObject.desiredVariantName.toLowerCase());
              if (desiredIndexFrom0 !== -1) {
                return {
                  setEssentialValue: { selectedVariantIndex: desiredIndexFrom0 + 1 },
                  setValue: { selectedVariantIndex: desiredIndexFrom0 + 1 }
                }
              }
            }
            console.warn("Variant name " + dependencyValues.variantsObject.desiredVariantName + " is not valid");
            return {
              setEssentialValue: { selectedVariantIndex: 1 },
              setValue: { selectedVariantIndex: 1 }
            }
          }
        }

        // variant was not specified

        let selectedVariantIndex;

        // if variantRng exists
        // randomly pick variant index
        if (dependencyValues.variantRng) {
          // random number in [0, 1)
          let rand = dependencyValues.variantRng();
          // random integer from 1 to nVariants
          selectedVariantIndex = Math.floor(rand * dependencyValues.nVariantsSpecified) + 1;
        } else {
          // if variantRng does not exist, we are in document
          // Just choose the first variant
          selectedVariantIndex = 1;
        }

        return {
          setEssentialValue: { selectedVariantIndex },
          setValue: { selectedVariantIndex }
        }

      }
    }

    stateVariableDefinitions.selectedVariantName = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        variantNames: {
          dependencyType: "stateVariable",
          variableName: "variantNames"
        },
        selectedVariantIndex: {
          dependencyType: "stateVariable",
          variableName: "selectedVariantIndex",
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            selectedVariantName:
              dependencyValues.variantNames[dependencyValues.selectedVariantIndex - 1]
          }
        }
      }
    }

    stateVariableDefinitions.selectedSeed = {
      returnDependencies: () => ({
        selectedVariantIndex: {
          dependencyType: "stateVariable",
          variableName: "selectedVariantIndex",
        },
        seeds: {
          dependencyType: "stateVariable",
          variableName: "seeds"
        },

      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.selectedVariantIndex <= dependencyValues.seeds.length) {
          return { setValue: { selectedSeed: dependencyValues.seeds[dependencyValues.selectedVariantIndex - 1] } }
        }

        // if fewer seeds than selectedVariantIndex, find additional seeds
        // try seeds, n+1, n+2, ...., selectedVariantIndex
        // except skipping seeds that are already in original seeds
        let seedNumber = dependencyValues.seeds.length;
        let seedValue = seedNumber;
        let seedString;
        while (seedNumber < dependencyValues.selectedVariantIndex) {
          seedNumber++;
          seedValue++;
          seedString = seedValue.toString();
          while (dependencyValues.seeds.includes(seedString)) {
            seedValue++;
            seedString = seedValue.toString();
          }
        }
        return { setValue: { selectedSeed: seedString } }

      }
    }

    stateVariableDefinitions.variantRng = {
      returnDependencies: ({ sharedParameters }) => ({
        selectedSeed: {
          dependencyType: "stateVariable",
          variableName: "selectedSeed",
        },
        rngClass: {
          dependencyType: "value",
          value: sharedParameters.rngClass,
          doNotProxy: true,
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          variantRng: new dependencyValues.rngClass(dependencyValues.selectedSeed)
        }
      })
    }

    return stateVariableDefinitions;
  }

}

function indexToLowercaseLetters(index) {
  return numberToLetters(index, true)
}
