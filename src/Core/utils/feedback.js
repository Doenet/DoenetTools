

function returnDefaultFeedbackDefinitions() {

  return {
    numericalerror: `Credit reduced because numbers in your answer weren't quite right.  Did you round too much?`,
    goodjob: `Good job!`,
    onesignerror: `Credit reduced because it appears that you made a sign error.`,
    twosignerrors: `Credit reduced because it appears that you made two sign errors.`,
  }

}

export function returnFeedbackDefinitionStateVariables() {

  let stateVariableDefinitions = {};

  stateVariableDefinitions.setupChildren = {
    returnDependencies: () => ({
      setupChildren: {
        dependencyType: "child",
        childGroups: ["setups"]
      }
    }),
    definition({ dependencyValues }) {
      return { newValues: { setupChildren: dependencyValues.setupChildren } }
    }
  }

  stateVariableDefinitions.feedbackDefinitions = {
    stateVariablesDeterminingDependencies: ["setupChildren"],
    returnDependencies({ stateValues }) {
      let dependencies = {
        feedbackDefinitionsChildren: {
          dependencyType: "child",
          childGroups: ["feedbackDefinitions"],
          variableNames: ["value"]
        },
        ancestorWithFeedback: {
          dependencyType: "ancestor",
          variableNames: ["feedbackDefinitions"]
        },
        feedbackDefinitionsAndSetupChildren: {
          dependencyType: "child",
          childGroups: ["feedbackDefinitions", "setups"]
        }
      }

      for (let setupChild of stateValues.setupChildren) {
        dependencies[`feedbackDefinitionsOf${setupChild.componentName}`] = {
          dependencyType: "child",
          parentName: setupChild.componentName,
          childGroups: ["feedbackDefinitions"],
          variableNames: ["value"]
        }
      }

      return dependencies;

    },
    definition({ dependencyValues }) {

      let feedbackDefinitions = {};

      let startingFeedbackDefinitions;

      if (dependencyValues.ancestorWithFeedback) {
        startingFeedbackDefinitions = dependencyValues.ancestorWithFeedback.stateValues.feedbackDefinitions;
      }

      if (!startingFeedbackDefinitions) {
        startingFeedbackDefinitions = returnDefaultFeedbackDefinitions();
      }


      Object.assign(feedbackDefinitions, startingFeedbackDefinitions)

      let feedbackDefChildNum = 0;

      let feedbackDefinitionChildren = [];
      for (let child of dependencyValues.feedbackDefinitionsAndSetupChildren) {
        if (child.componentType === "setup") {
          feedbackDefinitionChildren.push(...dependencyValues[`feedbackDefinitionsOf${child.componentName}`]);
        } else {
          feedbackDefinitionChildren.push(dependencyValues.feedbackDefinitionsChildren[feedbackDefChildNum]);
          feedbackDefChildNum++;
        }
      }


      for (let child of feedbackDefinitionChildren) {
        Object.assign(feedbackDefinitions, child.stateValues.value)
      }

      return { newValues: { feedbackDefinitions } };

    }
  }

  return stateVariableDefinitions;

}

