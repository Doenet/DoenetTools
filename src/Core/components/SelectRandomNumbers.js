import { convertAttributesForComponentType } from "../utils/copy";
import { sampleFromRandomNumbers } from "../utils/randomNumbers";
import { returnRoundingAttributes } from "../utils/rounding";
import { processAssignNames } from "../utils/serializedStateProcessing";
import SampleRandomNumbers from "./SampleRandomNumbers";

export default class SelectRandomNumbers extends SampleRandomNumbers {
  static componentType = "selectRandomNumbers";

  static createsVariants = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    delete attributes.numSamples;

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number",
    };
    attributes.numToSelect = {
      createComponentOfType: "integer",
      createStateVariable: "numToSelect",
      defaultValue: 1,
      public: true,
    };

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
        return { setValue: { variants: dependencyValues.variants } };
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
      hasEssential: true,
      shadowVariable: true,
      returnDependencies: ({ sharedParameters }) => ({
        numSamples: {
          dependencyType: "stateVariable",
          variableName: "numToSelect",
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        from: {
          dependencyType: "stateVariable",
          variableName: "from",
        },
        to: {
          dependencyType: "stateVariable",
          variableName: "to",
        },
        step: {
          dependencyType: "stateVariable",
          variableName: "step",
        },
        nDiscreteValues: {
          dependencyType: "stateVariable",
          variableName: "nDiscreteValues",
        },
        mean: {
          dependencyType: "stateVariable",
          variableName: "mean",
        },
        standardDeviation: {
          dependencyType: "stateVariable",
          variableName: "standardDeviation",
        },
        variants: {
          dependencyType: "stateVariable",
          variableName: "variants",
        },
        rng: {
          dependencyType: "value",
          value: sharedParameters.variantRng,
          doNotProxy: true,
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.numSamples < 1) {
          return {
            setEssentialValue: { selectedValues: [] },
            setValue: { selectedValues: [] },
          };
        }

        if (
          dependencyValues.variants &&
          dependencyValues.variants.desiredVariant
        ) {
          let desiredValues = dependencyValues.variants.desiredVariant.values;
          if (desiredValues) {
            if (desiredValues.length !== dependencyValues.numSamples) {
              throw Error(
                "Number of values specified for selectRandomNumber must match number to select",
              );
            }

            // just give the desired values without any verification
            return {
              setEssentialValue: { selectedValues: desiredValues },
              setValue: { selectedValues: desiredValues },
            };
          }
        }

        let selectedValues = sampleFromRandomNumbers(dependencyValues);

        return {
          setEssentialValue: { selectedValues },
          setValue: { selectedValues },
        };
      },
    };

    stateVariableDefinitions.isVariantComponent = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { isVariantComponent: true } }),
    };

    stateVariableDefinitions.generatedVariantInfo = {
      returnDependencies: () => ({
        selectedValues: {
          dependencyType: "stateVariable",
          variableName: "selectedValues",
        },
      }),
      definition({ dependencyValues, componentName }) {
        let generatedVariantInfo = {
          values: dependencyValues.selectedValues,
          meta: { createdBy: componentName },
        };

        return { setValue: { generatedVariantInfo } };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        selectedValues: {
          dependencyType: "stateVariable",
          variableName: "selectedValues",
        },
      }),
      definition: function () {
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    componentInfoObjects,
    flags,
  }) {
    let newNamespace = component.attributes.newNamespace?.primitive;

    let attributesToConvert = {};
    for (let attr of Object.keys(returnRoundingAttributes())) {
      if (attr in component.attributes) {
        attributesToConvert[attr] = component.attributes[attr];
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
          flags,
        });
      }

      replacements.push({
        componentType: "number",
        attributes: attributesFromComposite,
        state: { value },
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
