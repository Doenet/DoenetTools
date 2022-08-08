import { convertAttributesForComponentType } from '../utils/copy.js';
import { sampleFromRandomNumbers } from '../utils/randomNumbers.js';
import { processAssignNames } from '../utils/serializedStateProcessing.js';
import { setUpVariantSeedAndRng } from '../utils/variants.js';
import CompositeComponent from './abstract/CompositeComponent.js';

export default class SampleRandomNumbers extends CompositeComponent {
  static componentType = "sampleRandomNumbers";

  static assignNamesToReplacements = true;

  static createsVariants = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number"
    }
    attributes.numberOfSamples = {
      createComponentOfType: "number",
      createStateVariable: "numberOfSamples",
      defaultValue: 1,
      public: true,
    }

    // possible types
    // discreteuniform: determined by from, to, and step
    // uniform: between from and to (step ignored)
    // gaussian: gaussian with prescribed mean and standard deviation

    attributes.type = {
      createComponentOfType: "text",
      createStateVariable: "type",
      defaultValue: "uniform",
      public: true,
      toLowerCase: true,
      validValues: ["uniform", "discreteuniform", "gaussian"]
    }

    attributes.mean = {
      createComponentOfType: "number",
      createStateVariable: "specifiedMean",
      defaultValue: 0,
    }

    attributes.standardDeviation = {
      createComponentOfType: "number",
      createStateVariable: "specifiedStandardDeviation",
      defaultValue: 1,
    }

    attributes.variance = {
      createComponentOfType: "number",
      createStateVariable: "specifiedVariance",
      defaultValue: 1,
    }

    attributes.from = {
      createComponentOfType: "number",
      createStateVariable: "specifiedFrom",
      defaultValue: null,
    }

    attributes.to = {
      createComponentOfType: "number",
      createStateVariable: "specifiedTo",
      defaultValue: null,
    }

    attributes.step = {
      createComponentOfType: "number",
      createStateVariable: "specifiedStep",
      defaultValue: 1,
    }

    attributes.displayDigits = {
      leaveRaw: true
    }
    attributes.displayDecimals = {
      leaveRaw: true
    }
    attributes.displaySmallAsZero = {
      leaveRaw: true
    }
    attributes.padZeros = {
      leaveRaw: true
    }

    attributes.variantDeterminesSeed = {
      createComponentOfType: "boolean",
      createStateVariable: "variantDeterminesSeed",
      defaultValue: false,
      public: true,
    }

    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.step = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        },
        specifiedStep: {
          dependencyType: "stateVariable",
          variableName: "specifiedStep"
        },
      }),
      definition({ dependencyValues }) {
        let step;
        if (dependencyValues.type === "discreteuniform") {
          step = dependencyValues.specifiedStep;
        } else {
          step = null;
        }
        return { setValue: { step } }
      }
    }

    stateVariableDefinitions.from = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      additionalStateVariablesDefined: [{
        variableName: "to",
        public: true,
        shadowingInstructions: {
          createComponentOfType: "number",
        },
      }, {
        variableName: "nDiscreteValues",
      }],
      returnDependencies: () => ({
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        },
        specifiedFrom: {
          dependencyType: "stateVariable",
          variableName: "specifiedFrom"
        },
        specifiedTo: {
          dependencyType: "stateVariable",
          variableName: "specifiedTo"
        },
        step: {
          dependencyType: "stateVariable",
          variableName: "step"
        },
      }),
      definition({ dependencyValues }) {
        if (!["discreteuniform", "uniform"].includes(dependencyValues.type)) {
          return { setValue: { from: null, to: null, nDiscreteValues: null } }
        }

        let step = dependencyValues.step;

        let from = dependencyValues.specifiedFrom;
        let to = dependencyValues.specifiedTo;
        let nDiscreteValues = null;
        if (to === null) {
          if (from === null) {
            from = 0;
          }
          if (dependencyValues.type === "uniform") {
            to = from + 1;
          } else {
            to = from + step;
            nDiscreteValues = 2;
          }
        } else {
          if (from === null) {
            if (dependencyValues.type === "uniform") {
              from = 0;
            } else {

              let targetFrom = 0;
              nDiscreteValues = Math.floor((to - targetFrom) / step + 1);
              if (nDiscreteValues < 1) {
                nDiscreteValues = 0;
                from = null;
              } else {
                from = to - (nDiscreteValues - 1) * step;
              }
            }
          } else {
            // to and from defined
            // if discrete uniform, adjust to make integer number of steps
            if (dependencyValues.type === "discreteuniform") {
              nDiscreteValues = Math.floor((to - from) / step + 1);
              if (nDiscreteValues < 1) {
                nDiscreteValues = 0;
              } else {
                to = from + (nDiscreteValues - 1) * step;
              }
            }
          }
        }

        return { setValue: { from, to, nDiscreteValues } }
      }
    }


    stateVariableDefinitions.mean = {
      stateVariablesDeterminingDependencies: ["type"],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies({ stateValues }) {
        let dependencies = {
          type: {
            dependencyType: "stateVariable",
            variableName: "type"
          },
        }
        if (stateValues.type === "gaussian") {
          dependencies.specifiedMean = {
            dependencyType: "stateVariable",
            variableName: "specifiedMean"
          };
        } else {
          dependencies.from = {
            dependencyType: "stateVariable",
            variableName: "from"
          };
          dependencies.to = {
            dependencyType: "stateVariable",
            variableName: "to"
          };
        }

        return dependencies;
      },
      definition({ dependencyValues }) {
        let mean;
        if (dependencyValues.type === "gaussian") {
          mean = dependencyValues.specifiedMean;
        } else {
          mean = (dependencyValues.from + dependencyValues.to) / 2;
        }
        return { setValue: { mean } }

      }
    }

    stateVariableDefinitions.variance = {
      stateVariablesDeterminingDependencies: ["type"],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies({ stateValues }) {
        let dependencies = {
          type: {
            dependencyType: "stateVariable",
            variableName: "type"
          },
        }
        if (stateValues.type === "gaussian") {
          dependencies.specifiedVariance = {
            dependencyType: "stateVariable",
            variableName: "specifiedVariance"
          };
          dependencies.specifiedStandardDeviation = {
            dependencyType: "stateVariable",
            variableName: "specifiedStandardDeviation"
          };
        } else {
          dependencies.from = {
            dependencyType: "stateVariable",
            variableName: "from"
          };
          dependencies.to = {
            dependencyType: "stateVariable",
            variableName: "to"
          };
          if (stateValues.type === "discreteuniform") {
            dependencies.step = {
              dependencyType: "stateVariable",
              variableName: "step"
            };
            dependencies.nDiscreteValues = {
              dependencyType: "stateVariable",
              variableName: "nDiscreteValues"
            };
          }
        }

        return dependencies;
      },
      definition({ dependencyValues, usedDefault }) {
        let variance;
        if (dependencyValues.type === "gaussian") {
          if (usedDefault.specifiedVariance && !usedDefault.specifiedStandardDeviation) {
            variance = dependencyValues.specifiedStandardDeviation ** 2;
          } else {
            variance = dependencyValues.specifiedVariance;
          }
        } else if (dependencyValues.type === "discreteuniform") {
          variance = (dependencyValues.nDiscreteValues ** 2 - 1)
            * dependencyValues.step ** 2 / 12;
        } else {
          // uniform
          variance = (dependencyValues.to - dependencyValues.from) ** 2 / 12;
        }
        return { setValue: { variance } }

      }
    }

    stateVariableDefinitions.standardDeviation = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        variance: {
          dependencyType: "stateVariable",
          variableName: "variance"
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { standardDeviation: Math.sqrt(dependencyValues.variance) }
      })
    }


    stateVariableDefinitions.sampledValues = {
      shadowVariable: true,
      hasEssential: true,
      stateVariablesDeterminingDependencies: ["variantDeterminesSeed"],
      returnDependencies({ stateValues, sharedParameters }) {
        let dependencies = {
          numberOfSamples: {
            dependencyType: "stateVariable",
            variableName: "numberOfSamples",
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
          }
        };
        if (stateValues.variantDeterminesSeed) {
          dependencies.rng = {
            dependencyType: "value",
            value: sharedParameters.variantRng,
            doNotProxy: true,
          }
        } else {
          dependencies.rng = {
            dependencyType: "value",
            value: sharedParameters.rngWithDateSeed,
            doNotProxy: true,
          }
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        if (dependencyValues.numberOfSamples < 1) {
          return {
            setEssentialValue: { sampledValues: [] },
            setValue: { sampledValues: [] }
          }
        }

        let sampledValues = sampleFromRandomNumbers(dependencyValues);

        return {
          setEssentialValue: { sampledValues },
          setValue: { sampledValues }
        }

      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "sampledValues",
            value: desiredStateVariableValues.sampledValues
          }]
        };
      }
    }


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
      definition: () => ({ setValue: { isVariantComponent: true } })
    }

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
          }
        };

        return {
          setValue: {
            generatedVariantInfo,
          }
        }

      }
    }

    return stateVariableDefinitions;

  }




  static async createSerializedReplacements({ component, componentInfoObjects, startNum = 0, flags }) {

    let newNamespace = component.attributes.newNamespace?.primitive;

    let attributesToConvert = {};
    for (let attr of ["displayDigits", "displaySmallAsZero", "displayDecimals", "padZeros"]) {
      if (attr in component.attributes) {
        attributesToConvert[attr] = component.attributes[attr]
      }
    }


    let replacements = [];

    for (let value of (await component.stateValues.sampledValues).slice(startNum)) {
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
      indOffset: startNum,
      componentInfoObjects,
    });

    return { replacements: processResult.serializedComponents };

  }

  static async calculateReplacementChanges({ component, componentInfoObjects, flags }) {

    let replacementChanges = [];

    let sampledValues = await component.stateValues.sampledValues;

    // if have fewer result than samples, adjust replacementsToWithhold
    if (sampledValues.length < component.replacements.length) {
      let numberToWithhold = component.replacements.length - sampledValues.length;

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
          component, componentInfoObjects,
          startNum: component.replacements.length,
          flags
        })

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: component.replacements.length,
          numberReplacementsToReplace: 0,
          serializedReplacements: result.replacements,
          assignNamesOffset: component.replacements.length
        }
        replacementChanges.push(replacementInstruction);
      }
    }


    // update values of the remainder of the replacements
    let numUpdate = Math.min(component.replacements.length, sampledValues.length);

    for (let ind = 0; ind < numUpdate; ind++) {
      let replacementInstruction = {
        changeType: "updateStateVariables",
        component: component.replacements[ind],
        stateChanges: { value: sampledValues[ind] }
      }
      replacementChanges.push(replacementInstruction);
    }

    return replacementChanges;
  }


  static async setUpVariant({
    serializedComponent, sharedParameters,
    descendantVariantComponents,
  }) {

    setUpVariantSeedAndRng({
      serializedComponent, sharedParameters,
      descendantVariantComponents
    });

    // seed from date plus a few digits from variant
    let seedForRandomNumbers = sharedParameters.variantRng().toString().slice(2, 8) + (+(new Date));
    sharedParameters.rngWithDateSeed = new sharedParameters.rngClass(seedForRandomNumbers);

  }

  static determineNumberOfUniqueVariants({ serializedComponent, componentInfoObjects }) {

    return { success: false };
  }

  async resample({ actionId }) {

    let sampledValues = sampleFromRandomNumbers({
      type: await this.stateValues.type,
      numberOfSamples: await this.stateValues.numberOfSamples,
      standardDeviation: await this.stateValues.standardDeviation,
      mean: await this.stateValues.mean,
      to: await this.stateValues.to,
      from: await this.stateValues.from,
      step: await this.stateValues.step,
      nDiscreteValues: await this.stateValues.nDiscreteValues,
      rng: (await this.stateValues.variantDeterminesSeed) ? this.sharedParameters.variantRng : this.sharedParameters.rngWithDateSeed
    });


    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "sampledValues",
        value: sampledValues,
      }],
      actionId
    });

  }


  actions = {
    resample: this.resample.bind(this),
  };

}
