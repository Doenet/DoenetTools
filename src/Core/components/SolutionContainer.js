import Template from "./Template";

export default class SolutionContainer extends Template {
  static componentType = "_solutionContainer";

  static stateVariableToEvaluateAfterReplacements = "open";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    delete attributes.rendered;
    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.rendered = {
      returnDependencies: () => ({
        parentOpen: {
          dependencyType: "parentStateVariable",
          variableName: "open",
        },
      }),
      markStale: () => ({ updateReplacements: true }),
      definition({ dependencyValues }) {
        let rendered = Boolean(dependencyValues.parentOpen);
        return { setValue: { rendered } };
      },
    };

    return stateVariableDefinitions;
  }

  static async calculateReplacementChanges({
    component,
    componentInfoObjects,
  }) {
    // if this is the first time rendered, then create the replacements
    if (
      (await component.stateValues.rendered) &&
      component.replacements.length === 0
    ) {
      let replacements = (
        await this.createSerializedReplacements({
          component,
          componentInfoObjects,
        })
      ).replacements;

      if (replacements.length > 0) {
        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          numberReplacementsToReplace: 0,
          serializedReplacements: replacements,
        };

        return [replacementInstruction];
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
}
