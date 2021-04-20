import BaseComponent from './abstract/BaseComponent';
import me from 'math-expressions';
import { evaluateLogic } from '../utils/booleanLogic';

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
      propositions: [exactlyOneWhen, exactlyOneMath, exactlyOneText],
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.parsedExpression = {
      additionalStateVariablesDefined: ["requireInputInAnswer"],
      returnDependencies: () => ({
        mathChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneMath",
        },
        textChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneText",
        },
      }),
      definition: function ({ dependencyValues }) {

        let parsedExpression = null;
        let requireInputInAnswer = false;

        if (dependencyValues.mathChild.length === 1 ||
          dependencyValues.textChild.length === 1
        ) {

          requireInputInAnswer = true;

          parsedExpression = me.fromAst(["=", "comp1", "comp2"]);
        }

        return { newValues: { parsedExpression, requireInputInAnswer } };
      }
    };

    stateVariableDefinitions.creditAchieved = {
      additionalStateVariablesDefined: ["fractionSatisfied"],
      returnDependencies: () => ({
        credit: {
          dependencyType: "stateVariable",
          variableName: "credit"
        },
        whenChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneWhen",
          variableNames: ["fractionSatisfied"]
        },
        mathChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneMath",
          variableNames: ["value", "unordered", "expand", "simplify"]
        },
        textChild: {
          dependencyType: "child",
          childLogicName: "exactlyOneText",
          variableNames: ["value"]
        },
        answerInput: {
          dependencyType: "parentStateVariable",
          variableName: "inputChildWithValues"
        },
        parsedExpression: {
          dependencyType: "stateVariable",
          variableName: "parsedExpression"
        },
        matchPartial: {
          dependencyType: "stateVariable",
          variableName: "matchPartial",
        },
        symbolicEquality: {
          dependencyType: "stateVariable",
          variableName: "symbolicEquality",
        },
        expandOnCompare: {
          dependencyType: "stateVariable",
          variableName: "expandOnCompare",
        },
        simplifyOnCompare: {
          dependencyType: "stateVariable",
          variableName: "simplifyOnCompare",
        },
        unorderedCompare: {
          dependencyType: "stateVariable",
          variableName: "unorderedCompare",
        },
        allowedErrorInNumbers: {
          dependencyType: "stateVariable",
          variableName: "allowedErrorInNumbers",
        },
        includeErrorInNumberExponents: {
          dependencyType: "stateVariable",
          variableName: "includeErrorInNumberExponents",
        },
        allowedErrorIsAbsolute: {
          dependencyType: "stateVariable",
          variableName: "allowedErrorIsAbsolute",
        },
        nSignErrorsMatched: {
          dependencyType: "stateVariable",
          variableName: "nSignErrorsMatched",
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {

        let fractionSatisfied;

        if (dependencyValues.whenChild.length === 1) {
          fractionSatisfied = dependencyValues.whenChild[0].stateValues.fractionSatisfied;
        } else {
          if (!dependencyValues.answerInput || !dependencyValues.parsedExpression) {
            return {
              newValues: {
                creditAchieved: 0,
                fractionSatisfied: 0,
              }
            }
          }

          fractionSatisfied = evaluateLogicDirectlyFromChildren({
            dependencyValues, usedDefault
          });

        }

        let creditAchieved = 0;
        if (Number.isFinite(dependencyValues.credit)) {
          creditAchieved = Math.max(0, Math.min(1, dependencyValues.credit)) * Math.max(0, Math.min(1, fractionSatisfied));
        }
        return {
          newValues: {
            fractionSatisfied, creditAchieved,
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
      componentType: "feedback",
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


function evaluateLogicDirectlyFromChildren({ dependencyValues, usedDefault }) {

  let dependenciesForEvaluateLogic = {
    mathChildrenByCode: {},
    mathlistChildrenByCode: {},
    textChildrenByCode: {},
    textlistChildrenByCode: {},
    booleanChildrenByCode: {},
    booleanlistChildrenByCode: {},
  };

  Object.assign(dependenciesForEvaluateLogic, dependencyValues);

  let unorderedCompare = dependencyValues.unorderedCompare;
  let simplifyOnCompare = dependencyValues.simplifyOnCompare;
  let expandOnCompare = dependencyValues.expandOnCompare;

  let canOverrideUnorderedCompare = usedDefault.unorderedCompare;
  let canOverrideSimplifyOnCompare = usedDefault.simplifyOnCompare;
  let canOverrideExpandOnCompare = usedDefault.expandOnCompare;

  if (dependencyValues.textChild.length === 1) {
    dependenciesForEvaluateLogic.textChildrenByCode.comp2 = dependencyValues.textChild[0];
  } else if (dependencyValues.mathChild.length === 1) {
    let child = dependencyValues.mathChild[0];

    dependenciesForEvaluateLogic.mathChildrenByCode.comp2 = child;
    if (canOverrideUnorderedCompare && child.stateValues.unordered) {
      unorderedCompare = true;
    }

    if (canOverrideExpandOnCompare && child.stateValues.expand) {
      expandOnCompare = true;
    }

    if (canOverrideSimplifyOnCompare) {
      if (child.stateValues.simplify === "full") {
        simplifyOnCompare = "full";
      } else if (child.stateValues.simplify === "numbers") {
        if (simplifyOnCompare !== "full") {
          simplifyOnCompare = "numbers";
        }
      } else if (child.stateValues.simplify === "numberspreserveorder") {
        if (simplifyOnCompare !== "full" && simplifyOnCompare !== "numbers") {
          simplifyOnCompare = "numberspreserveorder";
        }
      }
    }

  }

  let answerValue = dependencyValues.answerInput.stateValues.immediateValue;
  if (answerValue === undefined) {
    answerValue = dependencyValues.answerInput.stateValues.value;
  }

  let answerChildForLogic = {
    stateValues: { value: answerValue }
  };

  if (dependencyValues.answerInput.componentType === "textinput") {
    dependenciesForEvaluateLogic.textChildrenByCode.comp1 = answerChildForLogic;
  } else {
    dependenciesForEvaluateLogic.mathChildrenByCode.comp1 = answerChildForLogic;
  }

  return evaluateLogic({
    logicTree: dependencyValues.parsedExpression.tree,
    unorderedCompare: unorderedCompare,
    simplifyOnCompare: simplifyOnCompare,
    expandOnCompare: expandOnCompare,
    dependencyValues: dependenciesForEvaluateLogic,
  });

}

