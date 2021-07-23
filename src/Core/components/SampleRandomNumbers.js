import { convertAttributesForComponentType } from '../utils/copy';
import { sampleFromRandomNumbers } from '../utils/randomNumbers';
import { processAssignNames } from '../utils/serializedStateProcessing';
import CompositeComponent from './abstract/CompositeComponent';

export default class SampleRandomNumbers extends CompositeComponent {
  static componentType = "sampleRandomNumbers";

  static assignNamesToReplacements = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
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

    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.step = {
      public: true,
      componentType: "number",
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
        return { newValues: { step } }
      }
    }

    stateVariableDefinitions.from = {
      public: true,
      componentType: "number",
      additionalStateVariablesDefined: [{
        variableName: "to",
        public: true,
        componentType: "number"
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
          return { newValues: { from: null, to: null, nDiscreteValues: null } }
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

        return { newValues: { from, to, nDiscreteValues } }
      }
    }


    stateVariableDefinitions.mean = {
      stateVariablesDeterminingDependencies: ["type"],
      public: true,
      componentType: "number",
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
        return { newValues: { mean } }

      }
    }

    stateVariableDefinitions.variance = {
      stateVariablesDeterminingDependencies: ["type"],
      public: true,
      componentType: "number",
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
        return { newValues: { variance } }

      }
    }

    stateVariableDefinitions.standardDeviation = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        variance: {
          dependencyType: "stateVariable",
          variableName: "variance"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { standardDeviation: Math.sqrt(dependencyValues.variance) }
      })
    }


    stateVariableDefinitions.sampledValues = {
      returnDependencies: ({ sharedParameters }) => ({
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
        },
        rng: {
          dependencyType: "value",
          value: sharedParameters.rng,
          doNotProxy: true,
        },


      }),
      definition({ dependencyValues }) {
        if (dependencyValues.numberOfSamples < 1) {
          return {
            makeEssential: { sampledValues: true },
            newValues: {
              sampledValues: [],
            }
          }
        }

        let sampledValues = sampleFromRandomNumbers(dependencyValues);

        return {
          makeEssential: { sampledValues: true },
          newValues: { sampledValues }
        }

      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "sampledValues",
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
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;

  }




  static createSerializedReplacements({ component, componentInfoObjects, startNum = 0 }) {

    let newNamespace = component.attributes.newNamespace && component.attributes.newNamespace.primitive;

    let attributesToConvert = {};
    for (let attr of ["displayDigits", "displaySmallAsZero", "displayDecimals"]) {
      if (attr in component.attributes) {
        attributesToConvert[attr] = component.attributes[attr]
      }
    }


    let replacements = [];

    for (let value of component.stateValues.sampledValues.slice(startNum)) {
      let attributesFromComposite = {};

      if (Object.keys(attributesToConvert).length > 0) {
        attributesFromComposite = convertAttributesForComponentType({
          attributes: attributesToConvert,
          componentType: "number",
          componentInfoObjects,
          compositeCreatesNewNamespace: newNamespace
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

  static calculateReplacementChanges({ component, componentInfoObjects }) {

    let replacementChanges = [];


    // if have fewer result than samples, adjust replacementsToWithhold
    if (component.stateValues.sampledValues.length < component.replacements.length) {
      let numberToWithhold = component.replacements.length - component.stateValues.sampledValues.length;

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

      if (component.stateValues.sampledValues.length > component.replacements.length) {

        let result = this.createSerializedReplacements({
          component, componentInfoObjects,
          startNum: component.replacements.length
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
    let numUpdate = Math.min(component.replacements.length, component.stateValues.sampledValues.length);

    for (let ind = 0; ind < numUpdate; ind++) {
      let replacementInstruction = {
        changeType: "updateStateVariables",
        component: component.replacements[ind],
        stateChanges: { value: component.stateValues.sampledValues[ind] }
      }
      replacementChanges.push(replacementInstruction);
    }

    return replacementChanges;
  }


  resample() {

    let sampledValues = sampleFromRandomNumbers({
      type: this.stateValues.type,
      numberOfSamples: this.stateValues.numberOfSamples,
      standardDeviation: this.stateValues.standardDeviation,
      mean: this.stateValues.mean,
      to: this.stateValues.to,
      from: this.stateValues.from,
      step: this.stateValues.step,
      nDiscreteValues: this.stateValues.nDiscreteValues,
      rng: this.sharedParameters.rng
    });


    this.coreFunctions.requestUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "sampledValues",
        value: sampledValues,
      }]
    })

  }


  actions = {
    resample: this.resample.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
  };

}
