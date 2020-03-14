import CompositeComponent from './abstract/CompositeComponent';
import me from 'math-expressions';
import { findFiniteNumericalValue } from '../utils/math';

export default class Sequence extends CompositeComponent {
  static componentType = "sequence";

  static modifySharedParameters({ sharedParameters }) {
    sharedParameters.defaultToPrescribedParameters = true;
  }

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.type = { default: null, propagateToDescendants: true };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);
    let standardComponentClasses = args.standardComponentClasses;

    function fromToAsString({ dependencyValues }) {

      let stringChild = dependencyValues.stringChild[0];
      let stringPieces = stringChild.stateValues.value.split(",").map(x => x.trim());

      if (stringPieces.length > 2) {
        return { success: false };
      }

      let newType = dependencyValues.type;

      if (newType === null) {
        if (/^[a-zA-Z]+$/.test(stringPieces[0])) {
          newType = "letters";
        } else if (Number.isFinite(Number(stringPieces[0]))) {
          newType = "number";
        } else {
          newType = "text";
        }
      }

      if (!(newType in standardComponentClasses)) {
        // if didn't get a valid type, sugar fails
        return { success: false }
      }

      if (stringPieces.length === 1) {
        let toComponent = {
          componentType: "to",
          children: [{
            componentType: newType,
            children: [{
              createdComponent: true,
              componentName: stringChild.componentName
            }]
          }]
        };
        return {
          success: true,
          newChildren: [toComponent],
        }
      } else {
        let fromComponent = {
          componentType: "from",
          children: [{
            componentType: newType,
            children: [{
              componentType: "string",
              state: { value: stringPieces[0].trim() }
            }]
          }]
        };
        let toComponent = {
          componentType: "to",
          children: [{
            componentType: newType,
            children: [{
              componentType: "string",
              state: { value: stringPieces[1].trim() }
            }]
          }]
        };
        return {
          success: true,
          newChildren: [fromComponent, toComponent],
          toDelete: [stringChild.componentName],
        }
      }
    }

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1,
      isSugar: true,
      sugarDependencies: {
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        stringChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneString",
          variableNames: ["value"]
        }
      },
      affectedBySugar: ["atMostOneFrom", "atMostOneTo"],
      replacementFunction: fromToAsString,
    });

    let atMostOneFrom = childLogic.newLeaf({
      name: "atMostOneFrom",
      componentType: 'from',
      comparison: "atMost",
      number: 1
    });

    let atMostOneTo = childLogic.newLeaf({
      name: "atMostOneTo",
      componentType: 'to',
      comparison: "atMost",
      number: 1
    });

    let toFrom = childLogic.newOperator({
      name: "toFrom",
      operator: "and",
      propositions: [atMostOneFrom, atMostOneTo]
    })

    let sugarXorToFrom = childLogic.newOperator({
      name: "sugarXorToFrom",
      operator: "xor",
      propositions: [exactlyOneString, toFrom]
    })

    let atMostOneStep = childLogic.newLeaf({
      name: "atMostOneStep",
      componentType: 'step',
      comparison: "atMost",
      number: 1
    });

    let atMostOneCount = childLogic.newLeaf({
      name: "atMostOneCount",
      componentType: 'count',
      comparison: "atMost",
      number: 1
    });

    let atLeastZeroExcludes = childLogic.newLeaf({
      name: "atLeastZeroExcludes",
      componentType: 'exclude',
      comparison: "atLeast",
      number: 0
    });

    childLogic.newOperator({
      name: "sequenceLogic",
      operator: 'and',
      propositions: [sugarXorToFrom, atMostOneStep, atMostOneCount, atLeastZeroExcludes],
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
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneFrom",
          variableNames: ["value", "selectedType"],
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
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneTo",
          variableNames: ["value", "selectedType"],
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
          dependencyType: "stateVariable",
          variableName: "type",
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
        if (dependencyValues.type !== null) {
          return { newValues: { selectedType: dependencyValues.type } };
        }
        if (dependencyValues.typeOfFrom !== null) {
          return { newValues: { selectedType: dependencyValues.typeOfFrom } };
        }
        if (dependencyValues.typeOfTo !== null) {
          return { newValues: { selectedType: dependencyValues.typeOfTo } };
        }

        return { newValues: { selectedType: "number" } };

      },
    };

    stateVariableDefinitions.specifiedCount = {
      returnDependencies: () => ({
        countChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneCount",
          variableNames: ["value"],
        },
      }),
      defaultValue: null,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.countChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              specifiedCount: { variablesToCheck: ["count", "specifiedCount"] }
            }
          }
        }
        return { newValues: { specifiedCount: dependencyValues.countChild[0].stateValues.value } }
      },
    };


    stateVariableDefinitions.specifiedStep = {
      returnDependencies: () => ({
        stepChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneStep",
          variableNames: ["value"],
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

        return { newValues: { specifiedStep: step } };
      },
    };


    stateVariableDefinitions.specifiedExclude = {
      returnDependencies: () => ({
        excludeChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroExcludes",
          variableNames: ["values"],
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
              dependencyValues.excludeChildren.reduce((a, c) => [...a, ...c.stateValues.values], [])
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
        specifiedCount: {
          dependencyType: "stateVariable",
          variableName: "specifiedCount",
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

        if (dependencyValues.specifiedCount !== null) {
          if (!Number.isInteger(dependencyValues.specifiedCount) || dependencyValues.specifiedCount < 0) {
            console.log("Invalid count of sequence.  Must be a non-negative integer.")
            validSequence = false;
          }
        }

        if (dependencyValues.specifiedStep !== null) {
          // step must be number if not math
          if (dependencyValues.selectedType !== "math") {
            let numericalStep = findFiniteNumericalValue(dependencyValues.specifiedStep);
            if(!Number.isFinite(numericalStep)) {
              console.log("Invalid step of sequence.  Must be a number for sequence of type " + dependencyValues.selectedType + ".")
              validSequence = false;
            }
          }
        }

        if (dependencyValues.specifiedFrom !== null) {
          if (dependencyValues.selectedType === "number") {
            let numericalFrom = findFiniteNumericalValue(dependencyValues.specifiedFrom);
            if(!Number.isFinite(numericalFrom)) {
              console.log("Invalid from of number sequence.  Must be a number")
              validSequence = false;
            }
          }
        }

        if (dependencyValues.specifiedTo !== null) {
          if (dependencyValues.selectedType === "number") {
            let numericalTo = findFiniteNumericalValue(dependencyValues.specifiedTo);
            if(!Number.isFinite(numericalTo)) {
              console.log("Invalid from of number sequence.  Must be a number")
              validSequence = false;
            }
          }
        }

        return { newValues: { validSequence } };
      },
    };

    let componentConstructor = this;

    stateVariableDefinitions.from = {
      additionalStateVariablesDefined: ["step", "count", "exclude"],

      returnDependencies: () => ({
        specifiedFrom: {
          dependencyType: "stateVariable",
          variableName: "specifiedFrom",
        },
        specifiedTo: {
          dependencyType: "stateVariable",
          variableName: "specifiedTo",
        },
        specifiedCount: {
          dependencyType: "stateVariable",
          variableName: "specifiedCount",
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
        let count = dependencyValues.specifiedCount;
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
              }
            }
            if (from !== null) {
              if (from instanceof me.class) {
                from = from.evaluate_to_constant();
              }
            }
            for (let [index, value] of exclude.entries()) {
              if (value instanceof me.class) {
                exclude[index] = value.evaluate_to_constant();
              }
            }
          }
        }



        if (dependencyValues.validSequence) {
          let results = componentConstructor.calculateSequenceParameters({
            from, to, step, count, selectedType
          });
          results.exclude = exclude;

          return { newValues: results };

        }

        if (!Number.isInteger(count) || count < 0) {
          count = 0;
        }

        return { newValues: { from, step, count, exclude } };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {

      returnDependencies: () => ({
        from: {
          dependencyType: "stateVariable",
          variableName: "from",
        },
        count: {
          dependencyType: "stateVariable",
          variableName: "count",
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
      definition: function () {
        // even with invalid sequence, still ready to expand
        // (it will just expand with zero replacements)
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static calculateSequenceParameters({ from, to, step, count, selectedType }) {

    // calculate from, count and step from combinatons of from/to/count/step specified

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
          if (count === null) {
            count = 10;
          }
        } else {
          // no from or to, but step
          if (count === null) {
            count = 10;
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
        if (count === null) {
          if (selectedType === "math") {
            count = Math.floor(to.subtract(1).divide(step).evaluate_to_constant() + 1);
          } else {
            count = Math.floor((to - 1) / step + 1)
          }
        }

        // no from, but to
        // defined step and count even if none
        if (selectedType === "math") {
          from = to.subtract(step.multiply(count - 1)).simplify();
        } else {
          from = to - step * (count - 1);
          if (selectedType === "letters") {
            if (from < 1) {
              // adjust count so that have valid letters
              count = Math.floor((to - 1) / step + 1)
              from = to - step * (count - 1);

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
        if (count === null) {
          count = 10;
        }
      } else {
        // from and to defined
        if (step === null) {
          if (count === null) {
            if (selectedType === "math") {
              step = me.fromAst(1);
              count = to.subtract(from).add(1).evaluate_to_constant();
            } else {
              step = 1;
              count = (to - from + 1);
            }
          } else {
            if (selectedType === "math") {
              step = to.subtract(from).divide(count - 1);
            } else {
              step = (to - from) / (count - 1);
              // for letters, step must be integer
              if (selectedType === "letters") {
                step = Math.floor(step);
              }
            }
          }
        } else {
          if (count === null) {
            // from, to, and step, no count
            if (selectedType === "math") {
              count = Math.floor(to.subtract(from).divide(step).add(1).evaluate_to_constant());
            } else {
              count = Math.floor((to - from) / step + 1);
            }
          } else {
            // from, to, step, and count defined
            throw Error("Can't define from, to, step, and count for sequence");
          }
        }
      }
    }

    if (!Number.isInteger(count) || count < 0) {
      console.log("Invalid count of sequence.  Must be a non-negative integer.")
      count = 0;
    }

    return {
      from, step, count,
    }
  }

  static createSerializedReplacements({ component, workspace }) {

    if (!component.stateValues.validSequence) {
      workspace.lastReplacementParameters = {
        from: null,
        count: null,
        step: null,
        selectedType: null,
        exclude: null,
      }
      return { replacements: [] };
    }

    workspace.lastReplacementParameters = {
      from: component.stateValues.from,
      count: component.stateValues.count,
      step: component.stateValues.step,
      selectedType: component.stateValues.selectedType,
      exclude: component.stateValues.exclude,
    }

    let replacements = [];

    let nReplacementsToAttempt = component.stateValues.count;

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
        if (component.stateValues.exclude.some(x => x.equals(componentValue))) {
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
        state: { value: componentValue, fixed: true }
      }
      replacements.push(serializedComponent);
    }

    return { replacements };
  }

  static calculateReplacementChanges({ component, workspace }) {
    // console.log(`calculate replacement changes for ${component.componentName}`);

    let lrp = workspace.lastReplacementParameters;

    let replacementChanges = [];

    // if invalid, withhold any previous replacementsreplacements
    if (!component.stateValues.validSequence) {

      if (component.replacements.length > 0) {
        let replacementsToWithhold = component.replacements.length;
        let replacementInstruction = {
          changeType: "changedReplacementsToWithhold",
          replacementsToWithhold,
        };
        replacementChanges.push(replacementInstruction);
      }

      // leave all previous replacement parameters as they were before
      // except make count zero.
      // That way, if later restore to previous parameter set,
      // we can restore the old replacements
      lrp.count = 0;

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
      let newSerializedReplacements = this.createSerializedReplacements({ component, workspace }).replacements;

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

      let prevCount = lrp.count;
      let numReplacementsToAdd = 0;
      let numToModify = 0;
      let firstToModify = prevCount;
      let newReplacementsToWithhold;

      // if have fewer replacements than before
      // mark old replacements as hidden
      if (component.stateValues.count < prevCount) {
        let currentWithheld = component.replacementsToWithhold;
        if (currentWithheld === undefined) {
          currentWithheld = 0;
        }
        newReplacementsToWithhold = currentWithheld + prevCount - component.stateValues.count;

        let replacementInstruction = {
          changeType: "changedReplacementsToWithhold",
          replacementsToWithhold: newReplacementsToWithhold,
        };
        replacementChanges.push(replacementInstruction);

      } else if (component.stateValues.count > prevCount) {
        numReplacementsToAdd = component.stateValues.count - prevCount;

        if (component.replacementsToWithhold > 0) {
          if (component.replacementsToWithhold >= numReplacementsToAdd) {
            newReplacementsToWithhold = component.replacementsToWithhold - numReplacementsToAdd;
            numToModify += numReplacementsToAdd;
            prevCount += numReplacementsToAdd;
            numReplacementsToAdd = 0;

            let replacementInstruction = {
              changeType: "changedReplacementsToWithhold",
              replacementsToWithhold: newReplacementsToWithhold,
            };
            replacementChanges.push(replacementInstruction);

          } else {
            numReplacementsToAdd -= component.replacementsToWithhold;
            numToModify += component.replacementsToWithhold;
            prevCount += component.replacementsToWithhold;
            newReplacementsToWithhold = 0;
            // don't need to send changedReplacementsToWithold instructions
            // since will send add instructions,
            // which will also recalculate replacements in parent

          }
        }
      }

      if (modifyExistingValues === true) {
        numToModify = prevCount;
        firstToModify = 0;
      }

      if (numToModify > 0) {
        // need to modify values of the first prevCount components

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

        for (let ind = prevCount; ind < component.stateValues.count; ind++) {
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
            state: { value: componentValue, fixed: true }
          }
          newSerializedReplacements.push(serializedComponent);
        }

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: prevCount,
          numberReplacementsToReplace: 0,
          serializedReplacements: newSerializedReplacements,
          replacementsToWithhold: newReplacementsToWithhold,
        }
        replacementChanges.push(replacementInstruction);
      }
    }

    lrp.selectedType = component.stateValues.selectedType;
    lrp.from = component.stateValues.from;
    lrp.count = component.stateValues.count;
    lrp.step = component.stateValues.step;
    lrp.exclude = component.stateValues.exclude;

    // console.log(replacementChanges);
    return replacementChanges;

  }

  get allPotentialRendererTypes() {
    console.log(`get all potential renderer types for sequence ${this.componentName}`)
    let allPotentialRendererTypes = [this.stateValues.selectedType];
    console.log(allPotentialRendererTypes)
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
