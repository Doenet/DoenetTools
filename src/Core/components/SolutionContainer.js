import Template from './Template';

export default class SolutionContainer extends Template {
  static componentType = "_solutionContainer";

  static stateVariableToEvaluateAfterReplacements = "open";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    delete attributes.rendered;
    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.rendered = {
      returnDependencies: () => ({
        parentOpen: {
          dependencyType: "parentStateVariable",
          variableName: "open"
        }
      }),
      markStale: () => ({ updateReplacements: true }),
      definition({ dependencyValues }) {
        let rendered = Boolean(dependencyValues.parentOpen);
        return { newValues: { rendered } };
      }
    }

    return stateVariableDefinitions;

  }


  static calculateReplacementChanges({ component, componentInfoObjects }) {

    // if this is the first time rendered, then create the replacements
    if (component.stateValues.rendered && component.replacements.length === 0) {
      let replacements = this.createSerializedReplacements({
        component, componentInfoObjects
      }).replacements;

      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToReplace: 0,
        serializedReplacements: replacements,
      }

      return [replacementInstruction];

    } else {
      return [];
    }

  }
}
