import CompositeComponent from './abstract/CompositeComponent';
import me from 'math-expressions';
import { findFiniteNumericalValue } from '../utils/math';
import { processAssignNames } from '../utils/serializedStateProcessing';

export default class Sequence extends CompositeComponent {
  static componentType = "sequence";

  static acceptType = true;

  static assignNamesToReplacements = true;

  // don't actually need to shadow these, as replacements for shadows
  // ignore state variables
  // but, shadow them so that state variables are consistent
  // since propertyChildren aren't copied
  static get stateVariablesShadowedForReference() {
    return [
      "specifiedFrom", "typeOfFrom",
      "specifiedTo", "typeOfTo",
      "specifiedlength", "specifiedStep", "specifiedExclude"
    ]
  };

 
  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneFrom = childLogic.newLeaf({
      name: "atMostOneFrom",
      componentType: 'from',
      comparison: "atMost",
      number: 1,
      takePropertyChildren: true,
    });

    let atMostOneTo = childLogic.newLeaf({
      name: "atMostOneTo",
      componentType: 'to',
      comparison: "atMost",
      number: 1,
      takePropertyChildren: true,
    });

    let atMostOneStep = childLogic.newLeaf({
      name: "atMostOneStep",
      componentType: 'step',
      comparison: "atMost",
      number: 1,
      takePropertyChildren: true,
    });

    let atMostOnelength = childLogic.newLeaf({
      name: "atMostOnelength",
      componentType: 'length',
      comparison: "atMost",
      number: 1,
      takePropertyChildren: true,
    });

    let atMostOneExclude = childLogic.newLeaf({
      name: "atMostOneExclude",
      componentType: 'exclude',
      comparison: "atMost",
      number: 1,
      takePropertyChildren: true,
    });

    childLogic.newOperator({
      name: "sequenceLogic",
      operator: 'and',
      propositions: [atMostOneFrom, atMostOneTo, atMostOneStep, atMostOnelength, atMostOneExclude],
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.specifiedFrom = {
      additionalStateVariablesDefined: ["typeOfFrom"],
      returnDependencies: () => ({
        fromChild: {
          dependencyType: "child",
          childLogicName: "atMostOneFrom",
          variableNames: ["value", "selectedType"],
          requireChildLogicInitiallySatisfied: true
        },
      }),
      defaultValue: null,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.fromChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              specifiedFrom: { variablesToCheck: ["from", "specifiedFrom"] },
            },
            newValues: { typeOfFrom: null }
          }
        }
        if (dependencyValues.fromChild[0].stateValues.value === null) {
          // if have a from child, but its value is null,
          // it means we have an invalid from
          // Can't return null, as that indicates value wasn't specified
          // so return NaN
          return {
            newValues: {
              specifiedFrom: NaN,
              typeOfFrom: null
            }
          }
        }
        return {
          newValues: {
            specifiedFrom: dependencyValues.fromChild[0].stateValues.value,
            typeOfFrom: dependencyValues.fromChild[0].stateValues.selectedType,
          }
        }
      },
    };

    stateVariableDefinitions.specifiedTo = {
      additionalStateVariablesDefined: ["typeOfTo"],

      returnDependencies: () => ({
        toChild: {
          dependencyType: "child",
          childLogicName: "atMostOneTo",
          variableNames: ["value", "selectedType"],
          requireChildLogicInitiallySatisfied: true
        },
      }),
      defaultValue: null,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.toChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              specifiedTo: { variablesToCheck: ["to", "specifiedTo"] },
            },
            newValues: { typeOfTo: null }
          }
        }
        if (dependencyValues.toChild[0].stateValues.value === null) {
          // if have a to child, but its value is null,
          // it means we have an invalid to
          // Can't return null, as that indicates value wasn't specified
          // so return NaN
          return {
            newValues: {
              specifiedTo: NaN,
              typeOfTo: null
            }
          }
        }
        return {
          newValues: {
            specifiedTo: dependencyValues.toChild[0].stateValues.value,
            typeOfTo: dependencyValues.toChild[0].stateValues.selectedType,
          }
        }
      },
    };

    stateVariableDefinitions.selectedType = {
      returnDependencies: () => ({
        type: {
          dependencyType: "doenetAttribute",
          attributeName: "type",
        },
        typeOfFrom: {
          dependencyType: "stateVariable",
          variableName: "typeOfFrom",
        },
        typeOfTo: {
          dependencyType: "stateVariable",
          variableName: "typeOfTo",
        },

      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.type) {
          return { newValues: { selectedType: dependencyValues.type } };
        }
        if (dependencyValues.typeOfFrom) {
          return { newValues: { selectedType: dependencyValues.typeOfFrom } };
        }
        if (dependencyValues.typeOfTo) {
          return { newValues: { selectedType: dependencyValues.typeOfTo } };
        }

        return { newValues: { selectedType: "number" } };

      },
    };

    stateVariableDefinitions.specifiedlength = {
      returnDependencies: () => ({
        lengthChild: {
          dependencyType: "child",
          childLogicName: "atMostOnelength",
          variableNames: ["value"],
          requireChildLogicInitiallySatisfied: true
        },
      }),
      defaultValue: null,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.lengthChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              specifiedlength: { variablesToCheck: ["length", "specifiedlength"] }
            }
          }
        }
        if (dependencyValues.lengthChild[0].stateValues.value === null) {
          // if have a length child, but its value is null,
          // it means we have an invalid length
          // Can't return null, as that indicates value wasn't specified
          // so return NaN
          return {
            newValues: {
              specifiedlength: NaN,
            }
          }
        }
        return { newValues: { specifiedlength: dependencyValues.lengthChild[0].stateValues.value } }
      },
    };


    stateVariableDefinitions.specifiedStep = {
      returnDependencies: () => ({
        stepChild: {
          dependencyType: "child",
          childLogicName: "atMostOneStep",
          variableNames: ["value"],
          requireChildLogicInitiallySatisfied: true
        },
        selectedType: {
          dependencyType: "stateVariable",
          variableName: "selectedType",
        },
      }),
      defaultValue: null,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.stepChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              specifiedStep: { variablesToCheck: ["step", "specifiedStep"] }
            }
          }
        }

        let step = dependencyValues.stepChild[0].stateValues.value;
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
        excludeChildren: {
          dependencyType: "child",
          childLogicName: "atMostOneExclude",
          variableNames: ["values"],
          requireChildLogicInitiallySatisfied: true
        },
      }),
      defaultValue: [],
      definition: function ({ dependencyValues }) {
        if (dependencyValues.excludeChildren.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              specifiedExclude: { variablesToCheck: ["exclude"] }
            }
          }
        }
        return {
          newValues: {
            specifiedExclude:
              dependencyValues.excludeChildren[0].stateValues.values
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
        specifiedlength: {
          dependencyType: "stateVariable",
          variableName: "specifiedlength",
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
        selectedType: {
          dependencyType: "stateVariable",
          variableName: "selectedType",
        },
        lowercase: {
          dependencyType: "stateVariable",
          variableName: "lowercase",
        },
      }),
      definition: function ({ dependencyValues }) {

        let validSequence = true;

        if (dependencyValues.specifiedlength !== null) {
          if (!Number.isInteger(dependencyValues.specifiedlength) || dependencyValues.specifiedlength < 0) {
            console.log("Invalid length of sequence.  Must be a non-negative integer.")
            validSequence = false;
          }
        }

        if (dependencyValues.specifiedStep !== null) {
          // step must be number if not math
          if (dependencyValues.selectedType !== "math") {
            let numericalStep = findFiniteNumericalValue(dependencyValues.specifiedStep);
            if (!Number.isFinite(numericalStep)) {
              console.log("Invalid step of sequence.  Must be a number for sequence of type " + dependencyValues.selectedType + ".")
              validSequence = false;
            }
          }
        }

        if (dependencyValues.specifiedFrom !== null) {
          if (dependencyValues.selectedType === "number") {
            let numericalFrom = findFiniteNumericalValue(dependencyValues.specifiedFrom);
            if (!Number.isFinite(numericalFrom)) {
              console.log("Invalid from of number sequence.  Must be a number")
              validSequence = false;
            }
          } else if (Number.isNaN(dependencyValues.specifiedFrom)) {
            console.log("Invalid from of sequence")
            validSequence = false;
          }

        }

        if (dependencyValues.specifiedTo !== null) {
          if (dependencyValues.selectedType === "number") {
            let numericalTo = findFiniteNumericalValue(dependencyValues.specifiedTo);
            if (!Number.isFinite(numericalTo)) {
              console.log("Invalid from of number sequence.  Must be a number")
              validSequence = false;
            }
          } else if (Number.isNaN(dependencyValues.specifiedTo)) {
            console.log("Invalid to of sequence")
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
        specifiedlength: {
          dependencyType: "stateVariable",
          variableName: "specifiedlength",
        },
        specifiedStep: {
          dependencyType: "stateVariable",
          variableName: "specifiedStep",
        },
        selectedType: {
          dependencyType: "stateVariable",
          variableName: "selectedType",
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
        let length = dependencyValues.specifiedlength;
        let exclude = [...dependencyValues.specifiedExclude];
        let selectedType = dependencyValues.selectedType;

        if (dependencyValues.selectedType === "math") {
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

          // if selectedType is not math, convert step to a number
          if (step !== null) {
            if (step instanceof me.class) {
              step = step.evaluate_to_constant();
            }
          }


          if (dependencyValues.selectedType === "letters") {

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
          } else if (dependencyValues.selectedType === "number") {
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
            from, to, step, length, selectedType
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

    stateVariableDefinitions.readyToExpand = {

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
        selectedType: {
          dependencyType: "stateVariable",
          variableName: "selectedType",
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
        return { newValues: { readyToExpand: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static calculateSequenceParameters({ from, to, step, length, selectedType }) {

    // calculate from, length and step from combinatons of from/to/length/step specified

    if (from === null) {
      if (to === null) {
        if (selectedType === "math") {
          from = me.fromAst(1);
        } else {
          from = 1;
        }
        if (step === null) {
          // no from, to, or step
          if (selectedType === "math") {
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
          if (selectedType === "math") {
            step = me.fromAst(1);
          } else {
            step = 1;
          }
        }
        if (length === null) {
          if (selectedType === "math") {
            length = Math.floor(to.subtract(1).divide(step).evaluate_to_constant() + 1);
          } else {
            length = Math.floor((to - 1) / step + 1)
          }
        }

        // no from, but to
        // defined step and length even if none
        if (selectedType === "math") {
          from = to.subtract(step.multiply(length - 1)).simplify();
        } else {
          from = to - step * (length - 1);
          if (selectedType === "letters") {
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
          if (selectedType === "math") {
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
            if (selectedType === "math") {
              step = me.fromAst(1);
              length = to.subtract(from).add(1).evaluate_to_constant();
            } else {
              step = 1;
              length = (to - from + 1);
            }
          } else {
            if (selectedType === "math") {
              step = to.subtract(from).divide(length - 1);
            } else {
              step = (to - from) / (length - 1);
              // for letters, step must be integer
              if (selectedType === "letters") {
                step = Math.floor(step);
              }
            }
          }
        } else {
          if (length === null) {
            // from, to, and step, no length
            if (selectedType === "math") {
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
      console.log("Invalid length of sequence.  Must be a non-negative integer.")
      length = 0;
    }

    return {
      from, step, length,
    }
  }

  static createSerializedReplacements({ component, workspace, componentInfoObjects }) {

    // console.log(`create serialized replacements for ${component.componentName}`)

    // evaluate readyToExpand so that it is marked fresh,
    // as it being marked stale triggers replacement update
    component.stateValues.readyToExpand;

    if (!component.stateValues.validSequence) {
      workspace.lastReplacementParameters = {
        from: null,
        length: null,
        step: null,
        selectedType: null,
        exclude: null,
      }
      workspace.nEmptiesAdded = 0;
      return { replacements: [] };
    }

    workspace.lastReplacementParameters = {
      from: component.stateValues.from,
      length: component.stateValues.length,
      step: component.stateValues.step,
      selectedType: component.stateValues.selectedType,
      exclude: component.stateValues.exclude,
    }

    let replacements = [];

    let nReplacementsToAttempt = component.stateValues.length;

    for (let ind = 0; ind < nReplacementsToAttempt; ind++) {
      let componentValue = component.stateValues.from;
      if (ind > 0) {
        if (component.stateValues.selectedType === "math") {
          componentValue = componentValue.add(component.stateValues.step.multiply(me.fromAst(ind))).expand().simplify();
        } else {
          componentValue += component.stateValues.step * ind;
        }
      }

      if (component.stateValues.selectedType === "math") {
        if (component.stateValues.exclude.some(x => x && x.equals(componentValue))) {
          continue;
        }
      } else {
        if (component.stateValues.exclude.includes(componentValue)) {
          continue;
        }
      }

      if (component.stateValues.selectedType === "letters") {
        componentValue = numberToLetters(componentValue, component.stateValues.lowercase);
      }

      let serializedComponent = {
        componentType: component.stateValues.selectedType,
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
      parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
      componentInfoObjects,
    });

    workspace.nEmptiesAdded = processResult.nEmptiesAdded;

    return { replacements: processResult.serializedComponents };
  }

  static calculateReplacementChanges({ component, workspace, componentInfoObjects }) {
    // console.log(`calculate replacement changes for ${component.componentName}`);


    // evaluate readyToExpand so that it is marked fresh,
    // as it being marked stale triggers replacement update
    component.stateValues.readyToExpand;

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

    // check if changed selectedType
    // or have excluded elements
    // TODO: don't completely recreate if have excluded elements
    if (lrp.selectedType !== component.stateValues.selectedType ||
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
      if (component.stateValues.selectedType === "math") {
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

        // since use number of replacements directly, it accounts for empties
        newReplacementsToWithhold = component.replacements.length - component.stateValues.length;

        let replacementInstruction = {
          changeType: "changeReplacementsToWithhold",
          replacementsToWithhold: newReplacementsToWithhold,
        };
        replacementChanges.push(replacementInstruction);

      } else if (component.stateValues.length > prevlength) {
        numReplacementsToAdd = component.stateValues.length - prevlength;

        if (component.replacementsToWithhold > 0) {
          let nonEmptiesWithheld = component.replacementsToWithhold;
          if (workspace.nEmptiesAdded) {
            nonEmptiesWithheld -= workspace.nEmptiesAdded;
          }

          if (nonEmptiesWithheld >= numReplacementsToAdd) {
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
            numReplacementsToAdd -= nonEmptiesWithheld;
            numToModify += nonEmptiesWithheld;
            prevlength += nonEmptiesWithheld;
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
            if (component.stateValues.selectedType === "math") {
              componentValue = componentValue.add(component.stateValues.step.multiply(me.fromAst(ind))).expand().simplify();
            } else {
              componentValue += component.stateValues.step * ind;
            }
          }
          if (component.stateValues.selectedType === "letters") {
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
            if (component.stateValues.selectedType === "math") {
              componentValue = componentValue.add(component.stateValues.step.multiply(me.fromAst(ind))).expand().simplify();
            } else {
              componentValue += component.stateValues.step * ind;
            }
          }
          if (component.stateValues.selectedType === "letters") {
            componentValue = numberToLetters(componentValue, component.stateValues.lowercase);
          }

          let serializedComponent = {
            componentType: component.stateValues.selectedType,
            state: { value: componentValue, fixed: true },
          }
          newSerializedReplacements.push(serializedComponent);
        }

        let processResult = processAssignNames({
          assignNames: component.doenetAttributes.assignNames,
          serializedComponents: newSerializedReplacements,
          parentName: component.componentName,
          parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
          componentInfoObjects,
          indOffset: prevlength,
        });


        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: prevlength,
          numberReplacementsToReplace: workspace.nEmptiesAdded,
          serializedReplacements: processResult.serializedComponents,
          replacementsToWithhold: 0,
          assignNamesOffset: prevlength
        }
        replacementChanges.push(replacementInstruction);
        workspace.nEmptiesAdded = processResult.nEmptiesAdded;
      }
    }

    lrp.selectedType = component.stateValues.selectedType;
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
        this.stateValues.selectedType
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
      console.log("Cannot convert " + letters + " to a number");
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


function lettersOnlyInString(s) {
  if (typeof s !== "string") {
    return false;
  }

  let pieces = s.split(",").map(x => x.trim());

  return pieces.every(x => /^[a-zA-Z]+$/.test(x));

}
