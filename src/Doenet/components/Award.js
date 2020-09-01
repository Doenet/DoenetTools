import BaseComponent from './abstract/BaseComponent';

export default class Award extends BaseComponent {
  static componentType = "award";
  static rendererType = undefined;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);

    properties.credit = { default: 1 };
    properties.matchPartial = { default: false, propagateToDescendants: true };
    properties.symbolicEquality = { default: false, propagateToDescendants: true };
    properties.expandOnCompare = { default: false, propagateToDescendants: true };
    properties.simplifyOnCompare = {
      default: "none",
      toLowerCase: true,
      valueTransformations: { "": "full", "true": "full" },
      validValues: ["none", "full", "numbers", "numbersepreserveorder"],
      propagateToDescendants: true,
    };
    properties.unorderedCompare = { default: false, propagateToDescendants: true };
    properties.allowedErrorInNumbers = { default: 0, propagateToDescendants: true };
    properties.includeErrorInNumberExponents = { default: false, propagateToDescendants: true };
    properties.allowedErrorIsAbsolute = { default: false, propagateToDescendants: true };
    properties.splitIntoOptions = { default: false, propagateToDescendants: true };
    properties.nSignErrorsMatched = { default: 0, propagateToDescendants: true };
    properties.feedbackCodes = { default: [] };
    properties.feedbackText = { default: null };

    return properties;

  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneWhen = childLogic.newLeaf({
      name: "exactlyOneWhen",
      componentType: 'when',
      number: 1
    });

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1
    });

    let exactlyOneMath = childLogic.newLeaf({
      name: "exactlyOneMath",
      componentType: 'math',
      number: 1
    });

    let exactlyOneText = childLogic.newLeaf({
      name: "exactlyOneText",
      componentType: 'text',
      number: 1
    });

    childLogic.newOperator({
      name: "whenXorStringXorMathXorText",
      operator: 'xor',
      propositions: [exactlyOneWhen, exactlyOneString, exactlyOneMath, exactlyOneText],
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.incomplete = {
      additionalStateVariablesDefined: [
        "incompleteType", "childForIncomplete",
      ],
      triggerParentChildLogicWhenResolved: true,
      returnDependencies: () => ({
        stringChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneString",
          variableNames: ["value"],
          requireChildLogicInitiallySatisfied: true,
        },
        mathChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneMath",
          requireChildLogicInitiallySatisfied: true,
        },
        textChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneText",
          requireChildLogicInitiallySatisfied: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        let incomplete = false;
        let incompleteType, childForIncomplete;

        if (dependencyValues.stringChild.length === 1) {
          childForIncomplete = dependencyValues.stringChild[0];
          incomplete = true;
          incompleteType = "string";
        } else if (dependencyValues.mathChild.length === 1) {
          childForIncomplete = dependencyValues.mathChild[0];
          incomplete = true;
          incompleteType = "math";
        } else if (dependencyValues.textChild.length === 1) {
          childForIncomplete = dependencyValues.textChild[0];
          incomplete = true;
          incompleteType = "text";
        }

        return { newValues: { incomplete, incompleteType, childForIncomplete } }
      }
    };

    stateVariableDefinitions.creditAchieved = {
      additionalStateVariablesDefined: ["fractionSatisfied", "whenChild"],
      returnDependencies: () => ({
        credit: {
          dependencyType: "stateVariable",
          variableName: "credit"
        },
        whenChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneWhen",
          variableNames: ["fractionSatisfied"]
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.whenChild.length === 0) {
          return {
            newValues: {
              creditAchieved: 0,
              fractionSatisfied: 0,
              whenChild: undefined,
            }
          }
        }
        let fractionSatisfied = dependencyValues.whenChild[0].stateValues.fractionSatisfied;
        let creditAchieved = 0;
        if (Number.isFinite(dependencyValues.credit)) {
          creditAchieved = Math.max(0, Math.min(1, dependencyValues.credit)) * Math.max(0, Math.min(1, fractionSatisfied));
        }
        return {
          newValues: {
            fractionSatisfied, creditAchieved,
            whenChild: dependencyValues.whenChild[0],
          }
        }

      }
    }

    stateVariableDefinitions.awarded = {
      public: true,
      componentType: "boolean",
      defaultValue: false,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          awarded: {
            variablesToCheck: "awarded",
          }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues, initialChange }) {
        if (!initialChange) {
          return { success: false }
        }

        return {
          success: true,
          instructions: [{
            setStateVariable: "awarded",
            value: desiredStateVariableValues.awarded
          }]
        };
      }

    }


    stateVariableDefinitions.feedbacks = {
      public: true,
      componentType: "feedbacktext",
      isArray: true,
      entireArrayAtOnce: true,
      entryPrefixes: ['feedback'],
      returnDependencies: () => ({
        feedbackText: {
          dependencyType: "stateVariable",
          variableName: "feedbackText",
        },
        feedbackCodes: {
          dependencyType: "stateVariable",
          variableName: "feedbackCodes",
        },
        feedbackDefinitions: {
          dependencyType: "parentStateVariable",
          variableName: "feedbackDefinitions"
        },
        awarded: {
          dependencyType: "stateVariable",
          variableName: "awarded"
        }
      }),
      entireArrayDefinition: function ({ dependencyValues }) {

        if (!dependencyValues.awarded) {
          return { newValues: { feedbacks: [] } }
        }

        let feedbacks = [];

        for (let feedbackCode of dependencyValues.feedbackCodes) {
          let code = feedbackCode.toLowerCase();
          for (let feedbackDefinition of dependencyValues.feedbackDefinitions) {
            if (code === feedbackDefinition.feedbackCode) {
              feedbacks.push(feedbackDefinition.feedbackText);
              break;  // just take first match
            }
          }
        }

        if (dependencyValues.feedbackText !== null) {
          feedbacks.push(dependencyValues.feedbackText);
        }

        return { newValues: { feedbacks } }

      }
    };

    stateVariableDefinitions.feedback = {
      isAlias: true,
      targetVariableName: "feedback1"
    };

    return stateVariableDefinitions;
  }


  adapters = ["awarded"];


  static standardizedFeedback = {
    'numericalerror': `Credit reduced because numbers in your answer weren't quite right.  Did you round too much?`,
    'goodjob': `Good job!`,
    'onesignerror': `Credit reduced because it appears that you made a sign error.`,
    'twosignerrors': `Credit reduced because it appears that you made two sign errors.`,
  }

}
