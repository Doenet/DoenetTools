function returnDefaultFeedbackDefinitions() {
  return {
    numericalerror: `Credit reduced because numbers in your answer weren't quite right.  Did you round too much?`,
    goodjob: `Good job!`,
    onesignerror: `Credit reduced because it appears that you made a sign error.`,
    twosignerrors: `Credit reduced because it appears that you made two sign errors.`,
  };
}

export function returnFeedbackDefinitionStateVariables() {
  let stateVariableDefinitions = {};

  stateVariableDefinitions.setupChildren = {
    returnDependencies: () => ({
      setupChildren: {
        dependencyType: "child",
        childGroups: ["setups"],
        proceedIfAllChildrenNotMatched: true,
      },
    }),
    definition({ dependencyValues }) {
      return { setValue: { setupChildren: dependencyValues.setupChildren } };
    },
  };

  stateVariableDefinitions.feedbackDefinitions = {
    stateVariablesDeterminingDependencies: ["setupChildren"],
    returnDependencies({ stateValues }) {
      let dependencies = {
        ancestorWithFeedback: {
          dependencyType: "ancestor",
          variableNames: ["feedbackDefinitions"],
        },
        setupChildren: {
          dependencyType: "child",
          childGroups: ["setups"],
          proceedIfAllChildrenNotMatched: true,
        },
      };

      for (let setupChild of stateValues.setupChildren) {
        dependencies[`feedbackDefinitionsOf${setupChild.componentName}`] = {
          dependencyType: "child",
          parentName: setupChild.componentName,
          childGroups: ["feedbackDefinitions"],
          variableNames: ["value"],
        };
      }

      return dependencies;
    },
    definition({ dependencyValues }) {
      let feedbackDefinitions = {};

      let startingFeedbackDefinitions;

      if (dependencyValues.ancestorWithFeedback) {
        startingFeedbackDefinitions =
          dependencyValues.ancestorWithFeedback.stateValues.feedbackDefinitions;
      }

      if (!startingFeedbackDefinitions) {
        startingFeedbackDefinitions = returnDefaultFeedbackDefinitions();
      }

      Object.assign(feedbackDefinitions, startingFeedbackDefinitions);

      let feedbackDefinitionChildren = [];
      for (let child of dependencyValues.setupChildren) {
        feedbackDefinitionChildren.push(
          ...dependencyValues[`feedbackDefinitionsOf${child.componentName}`],
        );
      }

      for (let child of feedbackDefinitionChildren) {
        Object.assign(feedbackDefinitions, child.stateValues.value);
      }

      return { setValue: { feedbackDefinitions } };
    },
  };

  return stateVariableDefinitions;
}
