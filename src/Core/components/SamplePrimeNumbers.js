import { createPrimesList } from "../utils/primeNumbers";
import { sampleFromNumberList } from "../utils/randomNumbers";
import { processAssignNames } from "../utils/serializedStateProcessing";
import { setUpVariantSeedAndRng } from "../utils/variants";
import CompositeComponent from "./abstract/CompositeComponent";

export default class SamplePrimeNumbers extends CompositeComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      resample: this.resample.bind(this),
    });
  }
  static componentType = "samplePrimeNumbers";

  static allowInSchemaAsComponent = ["integer"];

  static assignNamesToReplacements = true;

  static createsVariants = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static processWhenJustUpdatedForNewComponent = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number",
    };
    attributes.numSamples = {
      createComponentOfType: "number",
      createStateVariable: "numSamples",
      defaultValue: 1,
      public: true,
    };

    attributes.minValue = {
      createComponentOfType: "integer",
      createStateVariable: "minValue",
      defaultValue: 2,
      public: true,
    };
    attributes.maxValue = {
      createComponentOfType: "integer",
      createStateVariable: "maxValue",
      defaultValue: 100,
      public: true,
    };

    attributes.exclude = {
      createComponentOfType: "numberList",
      createStateVariable: "exclude",
      defaultValue: [],
      public: true,
    };

    attributes.variantDeterminesSeed = {
      createComponentOfType: "boolean",
      createStateVariable: "variantDeterminesSeed",
      defaultValue: false,
      public: true,
    };

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.possibleValues = {
      returnDependencies: () => ({
        minValue: {
          dependencyType: "stateVariable",
          variableName: "minValue",
        },
        maxValue: {
          dependencyType: "stateVariable",
          variableName: "maxValue",
        },
        exclude: {
          dependencyType: "stateVariable",
          variableName: "exclude",
        },
      }),
      definition({ dependencyValues }) {
        let primes = createPrimesList({
          minValue: dependencyValues.minValue,
          maxValue: dependencyValues.maxValue,
          exclude: dependencyValues.exclude,
        });

        return { setValue: { possibleValues: primes } };
      },
    };

    stateVariableDefinitions.sampledValues = {
      shadowVariable: true,
      hasEssential: true,
      stateVariablesDeterminingDependencies: ["variantDeterminesSeed"],
      returnDependencies({ stateValues, sharedParameters }) {
        let dependencies = {
          numSamples: {
            dependencyType: "stateVariable",
            variableName: "numSamples",
          },
          possibleValues: {
            dependencyType: "stateVariable",
            variableName: "possibleValues",
          },
        };
        if (stateValues.variantDeterminesSeed) {
          dependencies.rng = {
            dependencyType: "value",
            value: sharedParameters.variantRng,
            doNotProxy: true,
          };
        } else {
          dependencies.rng = {
            dependencyType: "value",
            value: sharedParameters.rngWithDateSeed,
            doNotProxy: true,
          };
        }
        return dependencies;
      },
      definition({ dependencyValues, changes, justUpdatedForNewComponent }) {
        if (dependencyValues.numSamples < 1) {
          return {
            setEssentialValue: { sampledValues: [] },
            setValue: { sampledValues: [] },
          };
        }

        // if loaded in values from database (justUpdatedForNewComponent)
        // or just resampled values from action (in which case there will be no changes)
        // then don't resample the values but just use the current ones
        if (Object.keys(changes).length === 0 || justUpdatedForNewComponent) {
          return { useEssentialOrDefaultValue: { sampledValues: true } };
        }

        let sampledValues = sampleFromNumberList({
          possibleValues: dependencyValues.possibleValues,
          numSamples: dependencyValues.numSamples,
          rng: dependencyValues.rng,
        });

        return {
          setEssentialValue: { sampledValues },
          setValue: { sampledValues },
        };
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "sampledValues",
              value: desiredStateVariableValues.sampledValues,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        sampledValues: {
          dependencyType: "stateVariable",
          variableName: "sampledValues",
        },
      }),
      markStale: () => ({ updateReplacements: true }),
      definition: function () {
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };

    stateVariableDefinitions.isVariantComponent = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { isVariantComponent: true } }),
    };

    stateVariableDefinitions.generatedVariantInfo = {
      returnDependencies: ({ sharedParameters }) => ({
        variantSeed: {
          dependencyType: "value",
          value: sharedParameters.variantSeed,
        },
      }),
      definition({ dependencyValues, componentName }) {
        let generatedVariantInfo = {
          seed: dependencyValues.variantSeed,
          meta: {
            createdBy: componentName,
          },
        };

        return {
          setValue: {
            generatedVariantInfo,
          },
        };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    componentInfoObjects,
    startNum = 0,
  }) {
    let errors = [];
    let warnings = [];

    let newNamespace = component.attributes.newNamespace?.primitive;

    let replacements = [];

    for (let value of (await component.stateValues.sampledValues).slice(
      startNum,
    )) {
      replacements.push({
        componentType: "integer",
        state: { value },
      });
    }

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      indOffset: startNum,
      componentInfoObjects,
    });
    errors.push(...processResult.errors);
    warnings.push(...processResult.warnings);

    return {
      replacements: processResult.serializedComponents,
      errors,
      warnings,
    };
  }

  static async calculateReplacementChanges({
    component,
    componentInfoObjects,
    flags,
  }) {
    // TODO: don't yet have a way to return errors and warnings!
    let errors = [];
    let warnings = [];

    let replacementChanges = [];

    let sampledValues = await component.stateValues.sampledValues;

    // if have fewer result than samples, adjust replacementsToWithhold
    if (sampledValues.length < component.replacements.length) {
      let numberToWithhold =
        component.replacements.length - sampledValues.length;

      if (numberToWithhold !== component.replacementsToWithhold) {
        let replacementInstruction = {
          changeType: "changeReplacementsToWithhold",
          replacementsToWithhold: numberToWithhold,
        };
        replacementChanges.push(replacementInstruction);
      }
    } else {
      // need to reuse all previous samples, don't withhold any
      if (component.replacementsToWithhold > 0) {
        let replacementInstruction = {
          changeType: "changeReplacementsToWithhold",
          replacementsToWithhold: 0,
        };
        replacementChanges.push(replacementInstruction);
      }

      if (sampledValues.length > component.replacements.length) {
        let result = await this.createSerializedReplacements({
          component,
          componentInfoObjects,
          startNum: component.replacements.length,
          flags,
        });
        errors.push(...result.errors);
        warnings.push(...result.warnings);

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: component.replacements.length,
          numberReplacementsToReplace: 0,
          serializedReplacements: result.replacements,
          assignNamesOffset: component.replacements.length,
        };
        replacementChanges.push(replacementInstruction);
      }
    }

    // update values of the remainder of the replacements
    let numUpdate = Math.min(
      component.replacements.length,
      sampledValues.length,
    );

    for (let ind = 0; ind < numUpdate; ind++) {
      let replacementInstruction = {
        changeType: "updateStateVariables",
        component: component.replacements[ind],
        stateChanges: { value: sampledValues[ind] },
      };
      replacementChanges.push(replacementInstruction);
    }

    return replacementChanges;
  }

  static setUpVariant({
    serializedComponent,
    sharedParameters,
    descendantVariantComponents,
  }) {
    setUpVariantSeedAndRng({
      serializedComponent,
      sharedParameters,
      descendantVariantComponents,
    });

    // seed from date plus a few digits from variant
    let seedForRandomNumbers =
      sharedParameters.variantRng().toString().slice(2, 8) + +new Date();
    sharedParameters.rngWithDateSeed = new sharedParameters.rngClass(
      seedForRandomNumbers,
    );
  }

  static determineNumberOfUniqueVariants() {
    return { success: false };
  }

  async resample({
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let sampledValues = sampleFromNumberList({
      possibleValues: await this.stateValues.possibleValues,
      numSamples: await this.stateValues.numSamples,
      rng: (await this.stateValues.variantDeterminesSeed)
        ? this.sharedParameters.variantRng
        : this.sharedParameters.rngWithDateSeed,
    });

    return await this.coreFunctions.performUpdate({
      updateInstructions: [
        {
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "sampledValues",
          value: sampledValues,
        },
      ],
      actionId,
      sourceInformation,
      skipRendererUpdate,
    });
  }
}
