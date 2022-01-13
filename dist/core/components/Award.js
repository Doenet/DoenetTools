import BaseComponent from './abstract/BaseComponent.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { evaluateLogic } from '../utils/booleanLogic.js';

export default class Award extends BaseComponent {
  static componentType = "award";
  static rendererType = undefined;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.credit = {
      createComponentOfType: "number",
      createStateVariable: "credit",
      defaultValue: 1,
      public: true,
      attributesForCreatedComponent: { convertBoolean: true }
    };
    attributes.matchPartial = {
      createComponentOfType: "boolean",
      createStateVariable: "matchPartial",
      defaultValue: false,
      public: true,
      fallBackToParentStateVariable: "matchPartial",
    };
    attributes.symbolicEquality = {
      createComponentOfType: "boolean",
      createStateVariable: "symbolicEquality",
      defaultValue: false,
      public: true,
      fallBackToParentStateVariable: "symbolicEquality",
    };
    attributes.expandOnCompare = {
      createComponentOfType: "boolean",
      createStateVariable: "expandOnCompare",
      defaultValue: false,
      public: true,
      fallBackToParentStateVariable: "expandOnCompare",
    };
    attributes.simplifyOnCompare = {
      createComponentOfType: "text",
      createStateVariable: "simplifyOnCompare",
      defaultValue: "none",
      toLowerCase: true,
      valueTransformations: { "": "full", "true": "full" },
      validValues: ["none", "full", "numbers", "numberspreserveorder"],
      public: true,
      fallBackToParentStateVariable: "simplifyOnCompare",
    };
    attributes.unorderedCompare = {
      createComponentOfType: "boolean",
      createStateVariable: "unorderedCompare",
      defaultValue: false,
      public: true,
      fallBackToParentStateVariable: "unorderedCompare",
    };
    attributes.matchByExactPositions = {
      createComponentOfType: "boolean",
      createStateVariable: "matchByExactPositions",
      defaultValue: false,
      public: true,
      fallBackToParentStateVariable: "matchByExactPositions",
    };
    attributes.allowedErrorInNumbers = {
      createComponentOfType: "number",
      createStateVariable: "allowedErrorInNumbers",
      defaultValue: 0,
      public: true,
      fallBackToParentStateVariable: "allowedErrorInNumbers",
    };
    attributes.includeErrorInNumberExponents = {
      createComponentOfType: "boolean",
      createStateVariable: "includeErrorInNumberExponents",
      defaultValue: false,
      public: true,
      fallBackToParentStateVariable: "includeErrorInNumberExponents",
    };
    attributes.allowedErrorIsAbsolute = {
      createComponentOfType: "boolean",
      createStateVariable: "allowedErrorIsAbsolute",
      defaultValue: false,
      public: true,
      fallBackToParentStateVariable: "allowedErrorIsAbsolute",
    };
    attributes.nSignErrorsMatched = {
      createComponentOfType: "number",
      createStateVariable: "nSignErrorsMatched",
      defaultValue: 0,
      public: true,
      fallBackToParentStateVariable: "nSignErrorsMatched",
    };
    attributes.nPeriodicSetMatchesRequired = {
      createComponentOfType: "integer",
      createStateVariable: "nPeriodicSetMatchesRequired",
      defaultValue: 3,
      public: true,
      fallBackToParentStateVariable: "nPeriodicSetMatchesRequired",
    };
    attributes.feedbackCodes = {
      createComponentOfType: "textList",
      createStateVariable: "feedbackCodes",
      defaultValue: [],
      public: true,
    };
    attributes.feedbackText = {
      createComponentOfType: "text",
      createStateVariable: "feedbackText",
      defaultValue: null,
      public: true,
    };
    attributes.targetsAreResponses = {
      createPrimitiveOfType: "string"
    }

    return attributes;

  }


  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let replaceStringsAndMacros = function ({ matchedChildren, parentAttributes }) {
      // if chidren are strings and macros
      // wrap with award and type

      if (!matchedChildren.every(child =>
        typeof child === "string" ||
        child.doenetAttributes && child.doenetAttributes.createdFromMacro
      )) {
        return { success: false }
      }

      let type;
      if (parentAttributes.type) {
        type = parentAttributes.type
      } else {
        type = "math";
      }

      if (!["math", "text", "boolean"].includes(type)) {
        console.warn(`Invalid type ${type}`);
        type = "math";
      }


      return {
        success: true,
        newChildren: [{
          componentType: type,
          children: matchedChildren
        }],
      }
    }

    sugarInstructions.push({
      replacementFunction: replaceStringsAndMacros
    })


    return sugarInstructions;

  }

  static returnChildGroups() {

    return [{
      group: "whens",
      componentTypes: ["when"]
    }, {
      group: "maths",
      componentTypes: ["math"]
    }, {
      group: "texts",
      componentTypes: ["text"]
    }, {
      group: "booleans",
      componentTypes: ["boolean"]
    }, {
      group: "mathLists",
      componentTypes: ["mathList"]
    }, {
      group: "textLists",
      componentTypes: ["textList"]
    }, {
      group: "booleanLists",
      componentTypes: ["booleanList"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.parsedExpression = {
      additionalStateVariablesDefined: ["requireInputInAnswer"],
      returnDependencies: () => ({
        whenChild: {
          dependencyType: "child",
          childGroups: ["whens"],
          variableNames: ["fractionSatisfied"]
        },
        typeChildren: {
          dependencyType: "child",
          childGroups: ["maths", "texts", "booleans", "mathLists", "textLists", "booleanLists"],
        },
      }),
      definition: function ({ dependencyValues }) {

        let parsedExpression = null;
        let requireInputInAnswer = false;

        if (
          dependencyValues.whenChild.length == 0 &&
          dependencyValues.typeChildren.length > 0) {

          requireInputInAnswer = true;

          parsedExpression = me.fromAst(["=", "comp1", "comp2"]);
        }

        return { setValue: { parsedExpression, requireInputInAnswer } };
      }
    };

    stateVariableDefinitions.creditAchieved = {
      public: true,
      componentType: "number",
      additionalStateVariablesDefined: [{
        variableName: "fractionSatisfied",
        public: true,
        componentType: "number"
      }],
      returnDependencies: () => ({
        credit: {
          dependencyType: "stateVariable",
          variableName: "credit"
        },
        whenChild: {
          dependencyType: "child",
          childGroups: ["whens"],
          variableNames: ["fractionSatisfied"]
        },
        mathChild: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["value", "unordered"]
        },
        textChild: {
          dependencyType: "child",
          childGroups: ["texts"],
          variableNames: ["value"]
        },
        booleanChild: {
          dependencyType: "child",
          childGroups: ["booleans"],
          variableNames: ["value"]
        },
        mathListChild: {
          dependencyType: "child",
          childGroups: ["mathLists"],
          variableNames: ["maths", "unordered"]
        },
        textListChild: {
          dependencyType: "child",
          childGroups: ["textLists"],
          variableNames: ["texts", "unordered"]
        },
        booleanListChild: {
          dependencyType: "child",
          childGroups: ["booleanLists"],
          variableNames: ["booleans", "unordered"]
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
        matchByExactPositions: {
          dependencyType: "stateVariable",
          variableName: "matchByExactPositions",
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
        nPeriodicSetMatchesRequired: {
          dependencyType: "stateVariable",
          variableName: "nPeriodicSetMatchesRequired",
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {

        let fractionSatisfied;

        if (dependencyValues.whenChild.length > 0) {
          fractionSatisfied = dependencyValues.whenChild[0].stateValues.fractionSatisfied;
        } else {
          if (!dependencyValues.answerInput || !dependencyValues.parsedExpression) {
            return {
              setValue: {
                creditAchieved: 0,
                fractionSatisfied: 0,
              }
            }
          }

          fractionSatisfied = evaluateLogicDirectlyFromChildren({
            dependencyValues, usedDefault
          });

        }

        fractionSatisfied = Math.max(0, Math.min(1, fractionSatisfied));

        let creditAchieved = 0;
        if (Number.isFinite(dependencyValues.credit)) {
          creditAchieved = Math.max(0, Math.min(1, dependencyValues.credit)) * fractionSatisfied;
        }
        return {
          setValue: {
            fractionSatisfied, creditAchieved,
          }
        }
      }

    }

    stateVariableDefinitions.awarded = {
      public: true,
      componentType: "boolean",
      defaultValue: false,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          awarded: true
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues, initialChange }) {
        if (!initialChange) {
          return { success: false }
        }

        return {
          success: true,
          instructions: [{
            setEssentialValue: "awarded",
            value: desiredStateVariableValues.awarded
          }]
        };
      }

    }


    stateVariableDefinitions.allFeedbacks = {
      returnDependencies: () => ({
        feedbackText: {
          dependencyType: "stateVariable",
          variableName: "feedbackText",
        },
        feedbackCodes: {
          dependencyType: "stateVariable",
          variableName: "feedbackCodes",
        },
        feedbackDefinitionAncestor: {
          dependencyType: "ancestor",
          variableNames: ["feedbackDefinitions"]
        },
        awarded: {
          dependencyType: "stateVariable",
          variableName: "awarded"
        }
      }),
      definition: function ({ dependencyValues }) {

        if (!dependencyValues.awarded) {
          return { setValue: { allFeedbacks: [] } }
        }

        let allFeedbacks = [];

        let feedbackDefinitions = dependencyValues.feedbackDefinitionAncestor.stateValues.feedbackDefinitions;

        for (let feedbackCode of dependencyValues.feedbackCodes) {
          let code = feedbackCode.toLowerCase();
          let feedbackText = feedbackDefinitions[code];
          if (feedbackText) {
            allFeedbacks.push(feedbackText);
          }
        }

        if (dependencyValues.feedbackText !== null) {
          allFeedbacks.push(dependencyValues.feedbackText);
        }

        return { setValue: { allFeedbacks } }

      }
    };

    stateVariableDefinitions.numberFeedbacks = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        allFeedbacks: {
          dependencyType: "stateVariable",
          variableName: "allFeedbacks"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { numberFeedbacks: dependencyValues.allFeedbacks.length },
          checkForActualChange: { numberFeedbacks: true }
        }
      }
    }

    stateVariableDefinitions.feedbacks = {
      public: true,
      componentType: "feedback",
      isArray: true,
      entryPrefixes: ["feedback"],
      returnArraySizeDependencies: () => ({
        numberFeedbacks: {
          dependencyType: "stateVariable",
          variableName: "numberFeedbacks",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numberFeedbacks];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allFeedbacks: {
            dependencyType: "stateVariable",
            variableName: "allFeedbacks"
          }
        }

        return { globalDependencies }

      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function feedbacks`)
        // console.log(globalDependencyValues)

        let feedbacks = {};

        for (let arrayKey = 0; arrayKey < globalDependencyValues.__array_size; arrayKey++) {
          feedbacks[arrayKey] = globalDependencyValues.allFeedbacks[arrayKey];
        }

        return { setValue: { feedbacks } }
      }

    }


    stateVariableDefinitions.feedback = {
      isAlias: true,
      targetVariableName: "feedback1"
    };

    return stateVariableDefinitions;
  }


  static adapters = ["awarded"];


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
    mathListChildrenByCode: {},
    numberChildrenByCode: {},
    numberListChildrenByCode: {},
    textChildrenByCode: {},
    textListChildrenByCode: {},
    booleanChildrenByCode: {},
    booleanListChildrenByCode: {},
  };

  Object.assign(dependenciesForEvaluateLogic, dependencyValues);

  let canOverrideUnorderedCompare = usedDefault.unorderedCompare;

  if (dependencyValues.textChild.length > 0) {
    dependenciesForEvaluateLogic.textChildrenByCode.comp2 = dependencyValues.textChild[0];
  } else if (dependencyValues.mathChild.length > 0) {
    dependenciesForEvaluateLogic.mathChildrenByCode.comp2 = dependencyValues.mathChild[0];
  } else if (dependencyValues.booleanChild.length > 0) {
    dependenciesForEvaluateLogic.booleanChildrenByCode.comp2 = dependencyValues.booleanChild[0];
  } else if (dependencyValues.textListChild.length > 0) {
    dependenciesForEvaluateLogic.textListChildrenByCode.comp2 = dependencyValues.textListChild[0];
  } else if (dependencyValues.mathListChild.length > 0) {
    dependenciesForEvaluateLogic.mathListChildrenByCode.comp2 = dependencyValues.mathListChild[0];
  } else if (dependencyValues.booleanListChild.length > 0) {
    dependenciesForEvaluateLogic.booleanListChildrenByCode.comp2 = dependencyValues.booleanListChild[0];
  }

  let answerValue = dependencyValues.answerInput.stateValues.immediateValue;
  if (answerValue === undefined) {
    answerValue = dependencyValues.answerInput.stateValues.value;
  }

  let answerChildForLogic = {
    stateValues: { value: answerValue }
  };

  if (dependencyValues.answerInput.componentType === "textInput") {
    dependenciesForEvaluateLogic.textChildrenByCode.comp1 = answerChildForLogic;
  } else if (dependencyValues.answerInput.componentType === "booleanInput") {
    dependenciesForEvaluateLogic.booleanChildrenByCode.comp1 = answerChildForLogic;
  } else {
    dependenciesForEvaluateLogic.mathChildrenByCode.comp1 = answerChildForLogic;
  }

  return evaluateLogic({
    logicTree: dependencyValues.parsedExpression.tree,
    canOverrideUnorderedCompare,
    dependencyValues: dependenciesForEvaluateLogic,
  });

}

