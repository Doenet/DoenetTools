import CompositeComponent from './abstract/CompositeComponent';
import me from 'math-expressions';
import { findFiniteNumericalValue } from '../utils/math';
import { processAssignNames } from '../utils/serializedStateProcessing';
import { convertAttributesForComponentType } from '../utils/copy';

export default class Sequence extends CompositeComponent {
  static componentType = "sequence";

  static assignNamesToReplacements = true;

  // don't actually need to shadow these, as replacements for shadows
  // ignore state variables
  // but, shadow them so that state variables are consistent
  // since attributeComponents aren't copied
  static get stateVariablesShadowedForReference() {
    return [
      "specifiedFrom", "specifiedTo",
      "specifiedLength", "specifiedStep", "specifiedExclude"
    ]
  };

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.fixed = {
      leaveRaw: true
    }

    attributes.type = {
      createPrimitiveOfType: "text"
    }
    attributes.from = {
      createComponentOfType: "_componentWithSelectableType",
    };
    attributes.to = {
      createComponentOfType: "_componentWithSelectableType",
    };
    attributes.step = {
      createComponentOfType: "math",
    };
    attributes.length = {
      createComponentOfType: "number",
    };
    attributes.exclude = {
      createComponentOfType: "_componentListWithSelectableType",
    };

    return attributes;

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.type = {
      returnDependencies: () => ({
        type: {
          dependencyType: "attribute",
          attributeName: "type",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.type) {
          return { newValues: { type: dependencyValues.type } };
        } else {
          return { newValues: { type: "number" } };
        }
      },
    };

    stateVariableDefinitions.specifiedFrom = {
      returnDependencies: () => ({
        fromAttr: {
          dependencyType: "attributeComponent",
          attributeName: "from",
          variableNames: ["value"],
        },
      }),
      defaultValue: null,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.fromAttr === null) {
          return {
            useEssentialOrDefaultValue: {
              specifiedFrom: { variablesToCheck: ["from", "specifiedFrom"] },
            },
          }
        }
        if (dependencyValues.fromAttr.stateValues.value === null) {
          // if have a from child, but its value is null,
          // it means we have an invalid from
          // Can't return null, as that indicates value wasn't specified
          // so return NaN
          return {
            newValues: {
              specifiedFrom: NaN,
            }
          }
        }
        return {
          newValues: {
            specifiedFrom: dependencyValues.fromAttr.stateValues.value,
          }
        }
      },
    };

    stateVariableDefinitions.specifiedTo = {

      returnDependencies: () => ({
        toAttr: {
          dependencyType: "attributeComponent",
          attributeName: "to",
          variableNames: ["value"],
        },
      }),
      defaultValue: null,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.toAttr === null) {
          return {
            useEssentialOrDefaultValue: {
              specifiedTo: { variablesToCheck: ["to", "specifiedTo"] },
            },
          }
        }
        if (dependencyValues.toAttr.stateValues.value === null) {
          // if have a to child, but its value is null,
          // it means we have an invalid to
          // Can't return null, as that indicates value wasn't specified
          // so return NaN
          return {
            newValues: {
              specifiedTo: NaN,
            }
          }
        }
        return {
          newValues: {
            specifiedTo: dependencyValues.toAttr.stateValues.value,
          }
        }
      },
    };

    stateVariableDefinitions.specifiedLength = {
      returnDependencies: () => ({
        lengthAttr: {
          dependencyType: "attributeComponent",
          attributeName: "length",
          variableNames: ["value"],
        },
      }),
      defaultValue: null,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.lengthAttr === null) {
          return {
            useEssentialOrDefaultValue: {
              specifiedLength: { variablesToCheck: ["length", "specifiedLength"] }
            }
          }
        }
        if (dependencyValues.lengthAttr.stateValues.value === null) {
          // if have a length child, but its value is null,
          // it means we have an invalid length
          // Can't return null, as that indicates value wasn't specified
          // so return NaN
          return {
            newValues: {
              specifiedLength: NaN,
            }
          }
        }
        return { newValues: { specifiedLength: dependencyValues.lengthAttr.stateValues.value } }
      },
    };


    stateVariableDefinitions.specifiedStep = {
      returnDependencies: () => ({
        stepAttr: {
          dependencyType: "attributeComponent",
          attributeName: "step",
          variableNames: ["value"],
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
      }),
      defaultValue: null,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.stepAttr === null) {
          return {
            useEssentialOrDefaultValue: {
              specifiedStep: { variablesToCheck: ["step", "specifiedStep"] }
            }
          }
        }

        let step = dependencyValues.stepAttr.stateValues.value;
        if (step === null) {
          // if have a step child, but its value is null,
          // it means we have an invalid step
          // Can't return null, as that indicates value wasn't specified
          // so return NaN
          return {
            newValues: {
              specifiedStep: NaN,
            }
          }
        }
        return { newValues: { specifiedStep: step } };
      },
    };


    stateVariableDefinitions.specifiedExclude = {
      returnDependencies: () => ({
        excludeAttr: {
          dependencyType: "attributeComponent",
          attributeName: "exclude",
          variableNames: ["values"],
        },
      }),
      defaultValue: [],
      definition: function ({ dependencyValues }) {
        if (dependencyValues.excludeAttr === null) {
          return {
            useEssentialOrDefaultValue: {
              specifiedExclude: { variablesToCheck: ["exclude"] }
            }
          }
        }
        return {
          newValues: {
            specifiedExclude:
              dependencyValues.excludeAttr.stateValues.values
          }
        };
      },
    };

    stateVariableDefinitions.lowercase = {
      returnDependencies: () => ({
        specifiedTo: {
          dependencyType: "stateVariable",
          variableName: "specifiedTo",
        },
        specifiedFrom: {
          dependencyType: "stateVariable",
          variableName: "specifiedFrom",
        },
      }),
      definition: function ({ dependencyValues }) {

        let capitalRegex = /^[A-Z]*$/;

        // base whether lowercase or upper case on from, if it exists, else to
        let lowercase = true;
        if (dependencyValues.specifiedFrom !== null) {
          if (capitalRegex.test(dependencyValues.specifiedFrom)) {
            lowercase = false;
          }
        } else if (dependencyValues.specifiedTo !== null) {
          if (capitalRegex.test(dependencyValues.specifiedTo)) {
            lowercase = false;
          }
        }

        return { newValues: { lowercase } };
      },
    };


    stateVariableDefinitions.validSequence = {
      returnDependencies: () => ({
        specifiedLength: {
          dependencyType: "stateVariable",
          variableName: "specifiedLength",
        },
        specifiedStep: {
          dependencyType: "stateVariable",
          variableName: "specifiedStep",
        },
        specifiedFrom: {
          dependencyType: "stateVariable",
          variableName: "specifiedFrom",
        },
        specifiedTo: {
          dependencyType: "stateVariable",
          variableName: "specifiedTo",
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        lowercase: {
          dependencyType: "stateVariable",
          variableName: "lowercase",
        },
      }),
      definition: function ({ dependencyValues }) {

        let validSequence = true;

        if (dependencyValues.specifiedLength !== null) {
          if (!Number.isInteger(dependencyValues.specifiedLength) || dependencyValues.specifiedLength < 0) {
            console.warn("Invalid length of sequence.  Must be a non-negative integer.")
            validSequence = false;
          }
        }

        if (dependencyValues.specifiedStep !== null) {
          // step must be number if not math
          if (dependencyValues.type !== "math") {
            let numericalStep = findFiniteNumericalValue(dependencyValues.specifiedStep);
            if (!Number.isFinite(numericalStep)) {
              console.warn("Invalid step of sequence.  Must be a number for sequence of type " + dependencyValues.type + ".")
              validSequence = false;
            }
          }
        }

        if (dependencyValues.specifiedFrom !== null) {
          if (dependencyValues.type === "number") {
            let numericalFrom = findFiniteNumericalValue(dependencyValues.specifiedFrom);
            if (!Number.isFinite(numericalFrom)) {
              console.warn("Invalid from of number sequence.  Must be a number")
              validSequence = false;
            }
          } else if (Number.isNaN(dependencyValues.specifiedFrom)) {
            console.warn("Invalid from of sequence")
            validSequence = false;
          }

        }

        if (dependencyValues.specifiedTo !== null) {
          if (dependencyValues.type === "number") {
            let numericalTo = findFiniteNumericalValue(dependencyValues.specifiedTo);
            if (!Number.isFinite(numericalTo)) {
              console.warn("Invalid from of number sequence.  Must be a number")
              validSequence = false;
            }
          } else if (Number.isNaN(dependencyValues.specifiedTo)) {
            console.warn("Invalid to of sequence")
            validSequence = false;
          }
        }

        return { newValues: { validSequence } };
      },
    };

    let componentConstructor = this;

    stateVariableDefinitions.from = {
      additionalStateVariablesDefined: ["step", "length", "exclude"],

      returnDependencies: () => ({
        specifiedFrom: {
          dependencyType: "stateVariable",
          variableName: "specifiedFrom",
        },
        specifiedTo: {
          dependencyType: "stateVariable",
          variableName: "specifiedTo",
        },
        specifiedLength: {
          dependencyType: "stateVariable",
          variableName: "specifiedLength",
        },
        specifiedStep: {
          dependencyType: "stateVariable",
          variableName: "specifiedStep",
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        specifiedExclude: {
          dependencyType: "stateVariable",
          variableName: "specifiedExclude",
        },
        validSequence: {
          dependencyType: "stateVariable",
          variableName: "validSequence",
        },
      }),
      definition: function ({ dependencyValues }) {

        let from = dependencyValues.specifiedFrom;
        let to = dependencyValues.specifiedTo;
        let step = dependencyValues.specifiedStep;
        let length = dependencyValues.specifiedLength;
        let exclude = [...dependencyValues.specifiedExclude];
        let type = dependencyValues.type;

        if (dependencyValues.type === "math") {
          // make sure to and from are math expressions
          if (to !== null) {
            if (!(to instanceof me.class)) {
              to = me.fromAst(to);
            }
          }
          if (from !== null) {
            if (!(from instanceof me.class)) {
              from = me.fromAst(from);
            }
          }
          if (step !== null) {
            if (!(step instanceof me.class)) {
              step = me.fromAst(step);
            }
          }
        } else {

          // if type is not math, convert step to a number
          if (step !== null) {
            if (step instanceof me.class) {
              step = step.evaluate_to_constant();
            }
          }


          if (dependencyValues.type === "letters") {

            // if from, to, and exclude are strings
            // then convert to numbers
            if (from !== null) {
              if (typeof from === "string") {
                from = lettersToNumber(from);
              }
            }
            if (to !== null) {
              if (typeof to === "string") {
                to = lettersToNumber(to);
              }
            }
            for (let [index, value] of exclude.entries()) {
              if (typeof value === "string") {
                exclude[index] = lettersToNumber(value)
              }
            }
          } else if (dependencyValues.type === "number") {
            // make sure to, from, and exclude are numbers
            if (to !== null) {
              if (to instanceof me.class) {
                to = to.evaluate_to_constant();
              } else {
                to = Number(to);
              }
            }
            if (from !== null) {
              if (from instanceof me.class) {
                from = from.evaluate_to_constant();
              } else {
                from = Number(from)
              }
            }
            for (let [index, value] of exclude.entries()) {
              if (value instanceof me.class) {
                exclude[index] = value.evaluate_to_constant();
              } else {
                exclude[index] = Number(value);
              }
            }
          }
        }



        if (dependencyValues.validSequence) {
          let results = componentConstructor.calculateSequenceParameters({
            from, to, step, length, type
          });
          results.exclude = exclude;

          return { newValues: results };

        }

        if (!Number.isInteger(length) || length < 0) {
          length = 0;
        }

        return { newValues: { from, step, length, exclude } };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {

      returnDependencies: () => ({
        from: {
          dependencyType: "stateVariable",
          variableName: "from",
        },
        length: {
          dependencyType: "stateVariable",
          variableName: "length",
        },
        step: {
          dependencyType: "stateVariable",
          variableName: "step",
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        exclude: {
          dependencyType: "stateVariable",
          variableName: "exclude",
        },
      }),
      // when this state variable is marked stale
      // it indicates we should update replacement
      // For this to work, must get value in replacement functions
      // so that the variable is marked fresh
      markStale: () => ({ updateReplacements: true }),
      definition: function () {
        // even with invalid sequence, still ready to expand
        // (it will just expand with zero replacements)
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static calculateSequenceParameters({ from, to, step, length, type }) {

    // calculate from, length and step from combinatons of from/to/length/step specified

    if (from === null) {
      if (to === null) {
        if (type === "math") {
          from = me.fromAst(1);
        } else {
          from = 1;
        }
        if (step === null) {
          // no from, to, or step
          if (type === "math") {
            step = me.fromAst(1);
          } else {
            step = 1;
          }
          if (length === null) {
            length = 10;
          }
        } else {
          // no from or to, but step
          if (length === null) {
            length = 10;
          }
        }
      } else {
        // no from, but to
        if (step === null) {
          if (type === "math") {
            step = me.fromAst(1);
          } else {
            step = 1;
          }
        }
        if (length === null) {
          if (type === "math") {
            length = Math.floor(to.subtract(1).divide(step).evaluate_to_constant() + 1);
          } else {
            length = Math.floor((to - 1) / step + 1)
          }
        }

        // no from, but to
        // defined step and length even if none
        if (type === "math") {
          from = to.subtract(step.multiply(length - 1)).simplify();
        } else {
          from = to - step * (length - 1);
          if (type === "letters") {
            if (from < 1) {
              // adjust length so that have valid letters
              length = Math.floor((to - 1) / step + 1)
              from = to - step * (length - 1);

            }
          }
        }
      }
    } else {
      // from defined
      if (to === null) {
        // no to, but from
        if (step === null) {
          if (type === "math") {
            step = me.fromAst(1);
          } else {
            step = 1;
          }
        }
        if (length === null) {
          length = 10;
        }
      } else {
        // from and to defined
        if (step === null) {
          if (length === null) {
            if (type === "math") {
              step = me.fromAst(1);
              length = Math.floor(to.subtract(from).add(1).evaluate_to_constant());
            } else {
              step = 1;
              length = Math.floor(to - from + 1);
            }
          } else {
            if (type === "math") {
              step = to.subtract(from).divide(length - 1);
            } else {
              step = (to - from) / (length - 1);
              // for letters, step must be integer
              if (type === "letters") {
                step = Math.floor(step);
              }
            }
          }
        } else {
          if (length === null) {
            // from, to, and step, no length
            if (type === "math") {
              length = Math.floor(to.subtract(from).divide(step).add(1).evaluate_to_constant());
            } else {
              length = Math.floor((to - from) / step + 1);
            }
          } else {
            // from, to, step, and length defined
            throw Error("Can't define from, to, step, and length for sequence");
          }
        }
      }
    }

    if (!Number.isInteger(length) || length < 0) {
      console.warn("Invalid length of sequence.  Must be a non-negative integer.")
      length = 0;
    }

    return {
      from, step, length,
    }
  }

  static createSerializedReplacements({ component, workspace, componentInfoObjects }) {

    // console.log(`create serialized replacements for ${component.componentName}`)

    if (!component.stateValues.validSequence) {
      workspace.lastReplacementParameters = {
        from: null,
        length: null,
        step: null,
        type: null,
        exclude: null,
      }
      return { replacements: [] };
    }

    workspace.lastReplacementParameters = {
      from: component.stateValues.from,
      length: component.stateValues.length,
      step: component.stateValues.step,
      type: component.stateValues.type,
      exclude: component.stateValues.exclude,
    }

    let replacements = [];

    let nReplacementsToAttempt = component.stateValues.length;

    for (let ind = 0; ind < nReplacementsToAttempt; ind++) {
      let componentValue = component.stateValues.from;
      if (ind > 0) {
        if (component.stateValues.type === "math") {
          componentValue = componentValue.add(component.stateValues.step.multiply(me.fromAst(ind))).expand().simplify();
        } else {
          componentValue += component.stateValues.step * ind;
        }
      }

      if (component.stateValues.type === "math") {
        if (component.stateValues.exclude.some(x => x && x.equals(componentValue))) {
          continue;
        }
      } else {
        if (component.stateValues.exclude.includes(componentValue)) {
          continue;
        }
      }

      let componentType = component.stateValues.type;
      if (component.stateValues.type === "letters") {
        componentValue = numberToLetters(componentValue, component.stateValues.lowercase);
        componentType = "text"
      }


      // allow one to override the fixed (default true) attribute
      // by specifying it on the sequence
      let attributesFromComposite = {};

      if ("fixed" in component.attributes) {
        attributesFromComposite = convertAttributesForComponentType({
          attributes: { fixed: component.attributes.fixed },
          componentType,
          componentInfoObjects, compositeAttributesObj: {},
          compositeCreatesNewNamespace: component.attributes.newNamespace
        })
      }

      let serializedComponent = {
        componentType,
        attributes: attributesFromComposite,
        state: { value: componentValue, fixed: true },
      }
      replacements.push(serializedComponent);
    }

    // console.log(`replacements for ${component.componentName}`)
    // console.log(replacements)

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: component.attributes.newNamespace,
      componentInfoObjects,
    });

    return { replacements: processResult.serializedComponents };
  }

  static calculateReplacementChanges({ component, workspace, componentInfoObjects }) {
    // console.log(`calculate replacement changes for ${component.componentName}`);


    let lrp = workspace.lastReplacementParameters;

    let replacementChanges = [];

    // if invalid, withhold any previous replacementsreplacements
    if (!component.stateValues.validSequence) {

      if (component.replacements.length > 0) {
        let replacementsToWithhold = component.replacements.length;
        let replacementInstruction = {
          changeType: "changeReplacementsToWithhold",
          replacementsToWithhold,
        };
        replacementChanges.push(replacementInstruction);
      }

      // leave all previous replacement parameters as they were before
      // except make length zero.
      // That way, if later restore to previous parameter set,
      // we can restore the old replacements
      lrp.length = 0;

      return replacementChanges;
    }

    // check if changed type
    // or have excluded elements
    // TODO: don't completely recreate if have excluded elements
    if (lrp.type !== component.stateValues.type ||
      lrp.exclude.length > 0 ||
      component.stateValues.exclude.length > 0
    ) {

      // calculate new serialized replacements
      let newSerializedReplacements = this.createSerializedReplacements({
        component, workspace, componentInfoObjects
      }).replacements;

      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToReplace: component.replacements.length,
        serializedReplacements: newSerializedReplacements,
        replacementsToWithhold: 0,
      };

      replacementChanges.push(replacementInstruction);

    } else {

      let modifyExistingValues = false;
      if (component.stateValues.type === "math") {
        if (!(component.stateValues.from.equals(lrp.from) &&
          component.stateValues.step.equals(lrp.step))) {
          modifyExistingValues = true;
        }

      } else {
        if (component.stateValues.from !== lrp.from ||
          component.stateValues.step !== lrp.step) {
          modifyExistingValues = true;
        }
      }

      let prevlength = lrp.length;
      let numReplacementsToAdd = 0;
      let numToModify = 0;
      let firstToModify = prevlength;
      let newReplacementsToWithhold;

      // if have fewer replacements than before
      // mark old replacements as hidden
      if (component.stateValues.length < prevlength) {

        newReplacementsToWithhold = component.replacements.length - component.stateValues.length;

        let replacementInstruction = {
          changeType: "changeReplacementsToWithhold",
          replacementsToWithhold: newReplacementsToWithhold,
        };
        replacementChanges.push(replacementInstruction);

      } else if (component.stateValues.length > prevlength) {
        numReplacementsToAdd = component.stateValues.length - prevlength;

        if (component.replacementsToWithhold > 0) {

          if (component.replacementsToWithhold >= numReplacementsToAdd) {
            newReplacementsToWithhold = component.replacementsToWithhold - numReplacementsToAdd;
            numToModify += numReplacementsToAdd;
            prevlength += numReplacementsToAdd;
            numReplacementsToAdd = 0;

            let replacementInstruction = {
              changeType: "changeReplacementsToWithhold",
              replacementsToWithhold: newReplacementsToWithhold,
            };
            replacementChanges.push(replacementInstruction);

          } else {
            numReplacementsToAdd -= component.replacementsToWithhold;
            numToModify += component.replacementsToWithhold;
            prevlength += component.replacementsToWithhold;
            newReplacementsToWithhold = 0;
            // don't need to send changedReplacementsToWithold instructions
            // since will send add instructions,
            // which will also recalculate replacements in parent

          }
        }
      }

      if (modifyExistingValues === true) {
        numToModify = prevlength;
        firstToModify = 0;
      }

      if (numToModify > 0) {
        // need to modify values of the first prevlength components

        for (let ind = firstToModify; ind < firstToModify + numToModify; ind++) {
          let componentValue = component.stateValues.from;
          if (ind > 0) {
            if (component.stateValues.type === "math") {
              componentValue = componentValue.add(component.stateValues.step.multiply(me.fromAst(ind))).expand().simplify();
            } else {
              componentValue += component.stateValues.step * ind;
            }
          }
          if (component.stateValues.type === "letters") {
            componentValue = numberToLetters(componentValue, component.stateValues.lowercase);
          }
          let replacementInstruction = {
            changeType: "updateStateVariables",
            component: component.replacements[ind],
            stateChanges: { value: componentValue }
          }
          replacementChanges.push(replacementInstruction);
        }
      }

      if (numReplacementsToAdd > 0) {
        // Need to add more replacement components

        let newSerializedReplacements = [];

        for (let ind = prevlength; ind < component.stateValues.length; ind++) {
          let componentValue = component.stateValues.from;
          if (ind > 0) {
            if (component.stateValues.type === "math") {
              componentValue = componentValue.add(component.stateValues.step.multiply(me.fromAst(ind))).expand().simplify();
            } else {
              componentValue += component.stateValues.step * ind;
            }
          }

          let componentType = component.stateValues.type;
          if (component.stateValues.type === "letters") {
            componentValue = numberToLetters(componentValue, component.stateValues.lowercase);
            componentType = "text";
          }

          // allow one to override the fixed (default true) attribute
          // by specifying it on the sequence
          let attributesFromComposite = {};

          if ("fixed" in component.attributes) {
            attributesFromComposite = convertAttributesForComponentType({
              attributes: { fixed: component.attributes.fixed },
              componentType,
              componentInfoObjects, compositeAttributesObj: {},
              compositeCreatesNewNamespace: component.attributes.newNamespace
            })
          }

          let serializedComponent = {
            componentType,
            attributes: attributesFromComposite,
            state: { value: componentValue, fixed: true },
          }

          newSerializedReplacements.push(serializedComponent);
        }

        let processResult = processAssignNames({
          assignNames: component.doenetAttributes.assignNames,
          serializedComponents: newSerializedReplacements,
          parentName: component.componentName,
          parentCreatesNewNamespace: component.attributes.newNamespace,
          componentInfoObjects,
          indOffset: prevlength,
        });


        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: prevlength,
          serializedReplacements: processResult.serializedComponents,
          replacementsToWithhold: 0,
          assignNamesOffset: prevlength
        }
        replacementChanges.push(replacementInstruction);
      }
    }

    lrp.type = component.stateValues.type;
    lrp.from = component.stateValues.from;
    lrp.length = component.stateValues.length;
    lrp.step = component.stateValues.step;
    lrp.exclude = component.stateValues.exclude;

    // console.log(replacementChanges);
    return replacementChanges;

  }

  get allPotentialRendererTypes() {
    let allPotentialRendererTypes = [
      this.componentInfoObjects.allComponentClasses[
        this.stateValues.type === "letters" ? "text" : this.stateValues.type
      ].rendererType
    ];
    return allPotentialRendererTypes;
  }

}


export function lettersToNumber(letters) {
  letters = letters.toUpperCase();

  let number = 0,
    len = letters.length,
    pos = len;
  while ((pos -= 1) > -1) {
    let numForLetter = letters.charCodeAt(pos) - 64;
    if (numForLetter < 1 || numForLetter > 26) {
      console.warn("Cannot convert " + letters + " to a number");
      return undefined;
    }
    number += numForLetter * Math.pow(26, len - 1 - pos);
  }
  return number;
}

export function numberToLetters(number, lowercase) {
  number--;
  let offset = 65;
  if (lowercase) {
    offset = 97;
  }
  let letters = "";
  while (true) {
    let nextNum = number % 26;
    letters = String.fromCharCode(offset + nextNum) + letters;
    if (number < 26) {
      break;
    }
    number = Math.floor(number / 26) - 1;
  }
  return letters;
}
