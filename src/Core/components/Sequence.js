import CompositeComponent from "./abstract/CompositeComponent";
import { processAssignNames } from "../utils/serializedStateProcessing";
import { convertAttributesForComponentType } from "../utils/copy";
import {
  returnSequenceValues,
  returnSequenceValueForIndex,
  returnStandardSequenceAttributes,
  returnStandardSequenceStateVariableDefinitions,
} from "../utils/sequence";
import { returnRoundingAttributes } from "../utils/rounding";

export default class Sequence extends CompositeComponent {
  static componentType = "sequence";

  static assignNamesToReplacements = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static allowInSchemaAsComponent = ["number", "math", "text"];

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.fixed = {
      leaveRaw: true,
    };

    for (let attrName in returnRoundingAttributes()) {
      attributes[attrName] = {
        leaveRaw: true,
      };
    }

    let sequenceAttributes = returnStandardSequenceAttributes();
    Object.assign(attributes, sequenceAttributes);

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let sequenceDefs = returnStandardSequenceStateVariableDefinitions();
    Object.assign(stateVariableDefinitions, sequenceDefs);

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
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    workspace,
    componentInfoObjects,
    flags,
  }) {
    // console.log(`create serialized replacements for ${component.componentName}`)

    let errors = [];
    let warnings = [];

    if (!(await component.stateValues.validSequence)) {
      workspace.lastReplacementParameters = {
        from: null,
        length: null,
        step: null,
        type: null,
        exclude: null,
      };
      return { replacements: [], errors, warnings };
    }

    let from = await component.stateValues.from;
    let length = await component.stateValues.length;
    let step = await component.stateValues.step;
    let type = await component.stateValues.type;
    let exclude = await component.stateValues.exclude;

    workspace.lastReplacementParameters = {
      from,
      length,
      step,
      type,
      exclude,
    };

    let newNamespace = component.attributes.newNamespace?.primitive;

    let sequenceValues = returnSequenceValues({
      from,
      step,
      length,
      exclude,
      type,
      lowercase: await component.stateValues.lowercase,
    });

    let componentType = type;
    if (type === "letters") {
      componentType = "text";
    }

    // if (type === "number" || type === "letters") {
    //   return { replacements: sequenceValues };
    // }

    let replacements = [];

    let attributesToConvert = {};
    for (let attr of ["fixed", ...Object.keys(returnRoundingAttributes())]) {
      if (attr in component.attributes) {
        attributesToConvert[attr] = component.attributes[attr];
      }
    }

    for (let componentValue of sequenceValues) {
      // allow one to override the fixed (default true) attribute
      // as well as rounding settings
      // by specifying it on the sequence
      let attributesFromComposite = {};

      if (Object.keys(attributesToConvert).length > 0) {
        attributesFromComposite = convertAttributesForComponentType({
          attributes: attributesToConvert,
          componentType,
          componentInfoObjects,
          compositeCreatesNewNamespace: newNamespace,
          flags,
        });
      }

      let serializedComponent = {
        componentType,
        attributes: attributesFromComposite,
        state: { value: componentValue, fixed: true },
      };
      replacements.push(serializedComponent);
    }

    // console.log(`replacements for ${component.componentName}`)
    // console.log(replacements)

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
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
    workspace,
    componentInfoObjects,
    flags,
  }) {
    // console.log(`calculate replacement changes for ${component.componentName}`);

    // TODO: don't yet have a way to return errors and warnings!
    let errors = [];
    let warnings = [];

    let lrp = workspace.lastReplacementParameters;

    let replacementChanges = [];

    // if invalid, withhold any previous replacementsreplacements
    if (!(await component.stateValues.validSequence)) {
      let currentReplacementsWithheld = component.replacementsToWithhold;
      if (!currentReplacementsWithheld) {
        currentReplacementsWithheld = 0;
      }

      if (component.replacements.length - currentReplacementsWithheld > 0) {
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

    let from = await component.stateValues.from;
    let length = await component.stateValues.length;
    let step = await component.stateValues.step;
    let type = await component.stateValues.type;
    let exclude = await component.stateValues.exclude;
    let lowercase = await component.stateValues.lowercase;

    // check if changed type
    // or have excluded elements
    // TODO: don't completely recreate if have excluded elements
    if (lrp.type !== type || lrp.exclude.length > 0 || exclude.length > 0) {
      // calculate new serialized replacements
      let replacementResults = await this.createSerializedReplacements({
        component,
        workspace,
        componentInfoObjects,
        flags,
      });

      let newSerializedReplacements = replacementResults.replacements;
      errors.push(...replacementResults.errors);
      warnings.push(...replacementResults.warnings);

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
      if (type === "math") {
        if (!(from.equals(lrp.from) && step.equals(lrp.step))) {
          modifyExistingValues = true;
        }
      } else {
        if (from !== lrp.from || step !== lrp.step) {
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
      if (length < prevlength) {
        newReplacementsToWithhold = component.replacements.length - length;

        let replacementInstruction = {
          changeType: "changeReplacementsToWithhold",
          replacementsToWithhold: newReplacementsToWithhold,
        };
        replacementChanges.push(replacementInstruction);
      } else if (length > prevlength) {
        numReplacementsToAdd = length - prevlength;

        if (component.replacementsToWithhold > 0) {
          if (component.replacementsToWithhold >= numReplacementsToAdd) {
            newReplacementsToWithhold =
              component.replacementsToWithhold - numReplacementsToAdd;
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

        for (
          let ind = firstToModify;
          ind < firstToModify + numToModify;
          ind++
        ) {
          let componentValue = returnSequenceValueForIndex({
            index: ind,
            from,
            step,
            exclude: [],
            type,
            lowercase,
          });

          let replacementInstruction = {
            changeType: "updateStateVariables",
            component: component.replacements[ind],
            stateChanges: { value: componentValue },
          };
          replacementChanges.push(replacementInstruction);
        }
      }

      if (numReplacementsToAdd > 0) {
        // Need to add more replacement components

        let newSerializedReplacements = [];
        let newNamespace = component.attributes.newNamespace?.primitive;

        let attributesToConvert = {};
        for (let attr of [
          "fixed",
          ...Object.keys(returnRoundingAttributes()),
        ]) {
          if (attr in component.attributes) {
            attributesToConvert[attr] = component.attributes[attr];
          }
        }

        for (
          let ind = prevlength;
          ind < (await component.stateValues.length);
          ind++
        ) {
          let componentValue = returnSequenceValueForIndex({
            index: ind,
            from,
            step,
            exclude: [],
            type,
            lowercase,
          });

          let componentType = await component.stateValues.type;
          if (componentType === "letters") {
            componentType = "text";
          }

          // allow one to override the fixed (default true) attribute
          // as well as rounding settings
          // by specifying it on the sequence
          let attributesFromComposite = {};

          if (Object.keys(attributesToConvert).length > 0) {
            attributesFromComposite = convertAttributesForComponentType({
              attributes: attributesToConvert,
              componentType,
              componentInfoObjects,
              compositeCreatesNewNamespace: newNamespace,
              flags,
            });
          }

          let serializedComponent = {
            componentType,
            attributes: attributesFromComposite,
            state: { value: componentValue, fixed: true },
          };

          newSerializedReplacements.push(serializedComponent);
        }

        let processResult = processAssignNames({
          assignNames: component.doenetAttributes.assignNames,
          serializedComponents: newSerializedReplacements,
          parentName: component.componentName,
          parentCreatesNewNamespace: newNamespace,
          componentInfoObjects,
          indOffset: prevlength,
        });
        errors.push(...processResult.errors);
        warnings.push(...processResult.warnings);

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: prevlength,
          serializedReplacements: processResult.serializedComponents,
          replacementsToWithhold: 0,
          assignNamesOffset: prevlength,
        };
        replacementChanges.push(replacementInstruction);
      }
    }

    lrp.type = type;
    lrp.from = from;
    lrp.length = length;
    lrp.step = step;
    lrp.exclude = exclude;

    return replacementChanges;
  }

  get allPotentialRendererTypes() {
    let allPotentialRendererTypes = super.allPotentialRendererTypes;

    let type = "number";
    if (this.attributes.type && this.attributes.type.primitive) {
      type = this.attributes.type.primitive.toLowerCase();
    }
    if (!["number", "math", "letters"].includes(type)) {
      type = "number";
    }

    let rendererType =
      this.componentInfoObjects.allComponentClasses[
        type === "letters" ? "text" : type
      ].rendererType;
    if (!allPotentialRendererTypes.includes(rendererType)) {
      allPotentialRendererTypes.push(rendererType);
    }

    return allPotentialRendererTypes;
  }
}
