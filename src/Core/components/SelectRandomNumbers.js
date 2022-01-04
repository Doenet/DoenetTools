import { convertAttributesForComponentType } from '../utils/copy';
import { sampleFromRandomNumbers } from '../utils/randomNumbers';
import { processAssignNames } from '../utils/serializedStateProcessing';
import SampleRandomNumbers from './SampleRandomNumbers';

export default class SelectRandomNumbers extends SampleRandomNumbers {
  static componentType = "selectRandomNumbers";

  static createsVariants = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    delete attributes.numberOfSamples;
    
    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number"
    }
    attributes.numberToSelect = {
      createComponentOfType: "integer",
      createStateVariable: "numberToSelect",
      defaultValue: 1,
      public: true,
    }

    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

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


    stateVariableDefinitions.step.immutable = true;
    stateVariableDefinitions.from.immutable = true;
    stateVariableDefinitions.from.additionalStateVariablesDefined[0].immutable = true;
    stateVariableDefinitions.from.additionalStateVariablesDefined[1].immutable = true;

    stateVariableDefinitions.mean.immutable = true;
    stateVariableDefinitions.variance.immutable = true;
    stateVariableDefinitions.standardDeviation.immutable = true;


    delete stateVariableDefinitions.sampledValues;

    stateVariableDefinitions.selectedValues = {
      immutable: true,
      returnDependencies: ({ sharedParameters }) => ({
        numberOfSamples: {
          dependencyType: "stateVariable",
          variableName: "numberToSelect",
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        },
        from: {
          dependencyType: "stateVariable",
          variableName: "from"
        },
        to: {
          dependencyType: "stateVariable",
          variableName: "to"
        },
        step: {
          dependencyType: "stateVariable",
          variableName: "step"
        },
        nDiscreteValues: {
          dependencyType: "stateVariable",
          variableName: "nDiscreteValues"
        },
        mean: {
          dependencyType: "stateVariable",
          variableName: "mean"
        },
        standardDeviation: {
          dependencyType: "stateVariable",
          variableName: "standardDeviation"
        },
        variants: {
          dependencyType: "stateVariable",
          variableName: "variants"
        },
        rng: {
          dependencyType: "value",
          value: sharedParameters.selectRng,
          doNotProxy: true,
        },


      }),
      definition({ dependencyValues }) {
        if (dependencyValues.numberOfSamples < 1) {
          return {
            makeEssential: { selectedValues: true },
            newValues: {
              selectedValues: [],
            }
          }
        }

        if (dependencyValues.variants && dependencyValues.variants.desiredVariant) {
          let desiredValues = dependencyValues.variants.desiredVariant.values;
          if (desiredValues) {
            if (desiredValues.length !== dependencyValues.numberOfSamples) {
              throw Error("Number of values specified for selectRandomNumber must match number to select");
            }

            // just give the desired values without any verification
            return {
              makeEssential: { selectedValues: true },
              newValues: {
                selectedValues: desiredValues,
              }
            }

          }
        }

        let selectedValues = sampleFromRandomNumbers(dependencyValues);

        return {
          makeEssential: { selectedValues: true },
          newValues: { selectedValues }
        }

      }
    }

    stateVariableDefinitions.isVariantComponent = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { isVariantComponent: true } })
    }

    stateVariableDefinitions.generatedVariantInfo = {
      returnDependencies: () => ({
        selectedValues: {
          dependencyType: "stateVariable",
          variableName: "selectedValues"
        },
      }),
      definition({ dependencyValues, componentName }) {

        let generatedVariantInfo = {
          values: dependencyValues.selectedValues,
          meta: { createdBy: componentName }
        };

        return { newValues: { generatedVariantInfo } }

      }
    }

    stateVariableDefinitions.readyToExpandWhenResolved = {

      returnDependencies: () => ({
        selectedValues: {
          dependencyType: "stateVariable",
          variableName: "selectedValues",
        },
      }),
      definition: function () {
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;

  }


  static async createSerializedReplacements({ component, componentInfoObjects, flags }) {

    let newNamespace = component.attributes.newNamespace && component.attributes.newNamespace.primitive;

    let attributesToConvert = {};
    for (let attr of ["displayDigits", "displaySmallAsZero", "displayDecimals"]) {
      if (attr in component.attributes) {
        attributesToConvert[attr] = component.attributes[attr]
      }
    }


    let replacements = [];

    for (let value of await component.stateValues.selectedValues) {
      let attributesFromComposite = {};

      if (Object.keys(attributesToConvert).length > 0) {
        attributesFromComposite = convertAttributesForComponentType({
          attributes: attributesToConvert,
          componentType: "number",
          componentInfoObjects,
          compositeCreatesNewNamespace: newNamespace,
          flags
        })
      }

      replacements.push({
        componentType: "number",
        attributes: attributesFromComposite,
        state: { value }
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


}

delete SelectRandomNumbers.stateVariableToEvaluateAfterReplacements;
delete SelectRandomNumbers.calculateReplacementChanges;