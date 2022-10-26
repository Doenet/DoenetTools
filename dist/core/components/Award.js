import BaseComponent from './abstract/BaseComponent.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { evaluateLogic } from '../utils/booleanLogic.js';
import { getNamespaceFromName } from '../utils/naming.js';

export default class Award extends BaseComponent {
  static componentType = "award";
  static rendererType = undefined;

  static includeBlankStringChildren = true;
  static removeBlankStringChildrenPostSugar = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

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
    attributes.caseInsensitiveMatch = {
      createComponentOfType: "boolean",
      createStateVariable: "caseInsensitiveMatch",
      defaultValue: false,
      public: true,
      fallBackToParentStateVariable: "caseInsensitiveMatch",
    };
    attributes.matchBlanks = {
      createComponentOfType: "boolean",
      createStateVariable: "matchBlanks",
      defaultValue: false,
      public: true,
      fallBackToParentStateVariable: "matchBlanks",
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
    attributes.sourcesAreResponses = {
      createPrimitiveOfType: "string"
    }

    attributes.splitSymbols = {
      createComponentOfType: "boolean",
      createStateVariable: "splitSymbols",
      defaultValue: true,
      public: true,
      fallBackToParentStateVariable: "splitSymbols",
    }

    attributes.parseScientificNotation = {
      createComponentOfType: "boolean",
      createStateVariable: "parseScientificNotation",
      defaultValue: false,
      public: true,
      fallBackToParentStateVariable: "parseScientificNotation",
    }

    return attributes;

  }

  static preprocessSerializedChildren({ serializedChildren, attributes, componentName }) {
    if (attributes.sourcesAreResponses) {
      let targetNames = attributes.sourcesAreResponses.primitive.split(/\s+/).filter(s => s);
      let nameSpace;
      if (attributes.newNamespace?.primitive) {
        nameSpace = componentName + "/";
      } else {
        nameSpace = getNamespaceFromName(componentName);
      }
      for (let target of targetNames) {
        let absoluteTarget;
        if (target[0] === "/") {
          absoluteTarget = target;
        } else if (target.slice(0, 3) === "../") {
          let adjustedNameSpace = getNamespaceFromName(nameSpace.slice(0, nameSpace.length - 1))
          let adjustedTarget = target.slice(3);
          while (adjustedTarget.slice(0, 3) === "../") {
            if (adjustedNameSpace === "/") {
              absoluteTarget = null;
              break;
            }
            adjustedNameSpace = getNamespaceFromName(adjustedNameSpace.slice(0, adjustedNameSpace.length - 1))
            adjustedTarget = adjustedTarget.slice(3);
          }
          if (absoluteTarget !== null) {
            absoluteTarget = adjustedNameSpace + adjustedTarget;
          }
        } else {
          absoluteTarget = nameSpace + target;
        }
        addResponsesToDescendantsWithTarget(serializedChildren, target, absoluteTarget);
      }

    }
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let wrapWithComponentTypeIfNeeded = function ({ matchedChildren, parentAttributes, componentInfoObjects }) {

      // wrap with componentType if have more than one child or a single string

      // remove any blank string children from beginning or end of children
      while (typeof matchedChildren[0] === "string" && matchedChildren[0].trim() === "") {
        matchedChildren = matchedChildren.slice(1);
      }
      let nChildren = matchedChildren.length;
      while (typeof matchedChildren[nChildren - 1] === "string" && matchedChildren[nChildren - 1].trim() === "") {
        matchedChildren = matchedChildren.slice(0, nChildren - 1);
        nChildren = matchedChildren.length;
      }

      if (matchedChildren.length === 1 && typeof matchedChildren[0] === "object") {
        return { success: false }
      }

      let componentIsSpecifiedType = componentInfoObjects.componentIsSpecifiedType;

      let foundMath = false, foundText = false, foundBoolean = false;

      for (let child of matchedChildren) {
        if (typeof child !== "object") {
          continue;
        } else if (componentIsSpecifiedType(child, "math")
          || componentIsSpecifiedType(child, "number")
          || componentIsSpecifiedType(child, "mathList")
          || componentIsSpecifiedType(child, "numberList")
        ) {
          foundMath = true;
        } else if (componentIsSpecifiedType(child, "text")
          || componentIsSpecifiedType(child, "textList")
        ) {
          foundText = true;
        } else if (componentIsSpecifiedType(child, "boolean")
          || componentIsSpecifiedType(child, "booleanList")
        ) {
          foundBoolean = true;
        }
      }

      let type;
      if (parentAttributes.type) {
        type = parentAttributes.type
        if (!["math", "text", "boolean"].includes(type)) {
          console.warn(`Invalid type ${type}`);
          type = "math";
        }
      } else {
        if (foundMath) {
          type = "math"
        } else if (foundText) {
          type = "text"
        } else if (foundBoolean) {
          // TODO: if have multiple booleans,
          // it doesn't make sense to wrap in one big boolean.
          // What is a better solution?
          type = "boolean"
        } else {
          type = "math"
        }
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
      replacementFunction: wrapWithComponentTypeIfNeeded
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
      group: "numbers",
      componentTypes: ["number"]
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
      group: "numberLists",
      componentTypes: ["numberList"]
    }, {
      group: "textLists",
      componentTypes: ["textList"]
    }, {
      group: "booleanLists",
      componentTypes: ["booleanList"]
    }, {
      group: "otherComparableTypes",
      componentTypes: ["orbitalDiagram"]
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
        },
        typeChildren: {
          dependencyType: "child",
          childGroups: ["maths", "numbers", "texts", "booleans", "mathLists", "numberLists", "textLists", "booleanLists", "otherComparableTypes"],
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

    stateVariableDefinitions.creditAchievedIfSubmit = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      additionalStateVariablesDefined: [{
        variableName: "fractionSatisfiedIfSubmit",
        public: true,
        shadowingInstructions: {
          createComponentOfType: "number",
        },
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
        numberChild: {
          dependencyType: "child",
          childGroups: ["numbers"],
          variableNames: ["value"]
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
        numberListChild: {
          dependencyType: "child",
          childGroups: ["numberLists"],
          variableNames: ["numbers", "unordered"]
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
        otherComparableChild: {
          dependencyType: "child",
          childGroups: ["otherComparableTypes"],
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
        caseInsensitiveMatch: {
          dependencyType: "stateVariable",
          variableName: "caseInsensitiveMatch",
        },
        matchBlanks: {
          dependencyType: "stateVariable",
          variableName: "matchBlanks",
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {

        let fractionSatisfiedIfSubmit;

        if (dependencyValues.whenChild.length > 0) {
          fractionSatisfiedIfSubmit = dependencyValues.whenChild[0].stateValues.fractionSatisfied;
        } else {
          if (!dependencyValues.answerInput || !dependencyValues.parsedExpression) {
            return {
              setValue: {
                creditAchievedIfSubmit: 0,
                fractionSatisfiedIfSubmit: 0,
              }
            }
          }

          fractionSatisfiedIfSubmit = evaluateLogicDirectlyFromChildren({
            dependencyValues, usedDefault
          });

        }

        fractionSatisfiedIfSubmit = Math.max(0, Math.min(1, fractionSatisfiedIfSubmit));

        let creditAchievedIfSubmit = 0;
        if (Number.isFinite(dependencyValues.credit)) {
          creditAchievedIfSubmit = Math.max(0, Math.min(1, dependencyValues.credit)) * fractionSatisfiedIfSubmit;
        }
        return {
          setValue: {
            fractionSatisfiedIfSubmit, creditAchievedIfSubmit,
          }
        }
      }

    }


    stateVariableDefinitions.fractionSatisfied = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      defaultValue: 0,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          fractionSatisfied: true
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues, initialChange }) {
        if (!initialChange) {
          return { success: false }
        }

        return {
          success: true,
          instructions: [{
            setEssentialValue: "fractionSatisfied",
            value: desiredStateVariableValues.fractionSatisfied
          }]
        };
      }

    }

    stateVariableDefinitions.creditAchieved = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      defaultValue: 0,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          creditAchieved: true
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues, initialChange }) {
        if (!initialChange) {
          return { success: false }
        }

        return {
          success: true,
          instructions: [{
            setEssentialValue: "creditAchieved",
            value: desiredStateVariableValues.creditAchieved
          }]
        };
      }

    }

    stateVariableDefinitions.awarded = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
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
      shadowingInstructions: {
        createComponentOfType: "number",
      },
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
      shadowingInstructions: {
        createComponentOfType: "feedback",
      },
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
    otherChildrenByCode: {},
  };

  Object.assign(dependenciesForEvaluateLogic, dependencyValues);

  let canOverrideUnorderedCompare = usedDefault.unorderedCompare;

  if (dependencyValues.textChild.length > 0) {
    dependenciesForEvaluateLogic.textChildrenByCode.comp2 = dependencyValues.textChild[0];
  } else if (dependencyValues.mathChild.length > 0) {
    dependenciesForEvaluateLogic.mathChildrenByCode.comp2 = dependencyValues.mathChild[0];
  } else if (dependencyValues.numberChild.length > 0) {
    dependenciesForEvaluateLogic.numberChildrenByCode.comp2 = dependencyValues.numberChild[0];
  } else if (dependencyValues.booleanChild.length > 0) {
    dependenciesForEvaluateLogic.booleanChildrenByCode.comp2 = dependencyValues.booleanChild[0];
  } else if (dependencyValues.textListChild.length > 0) {
    dependenciesForEvaluateLogic.textListChildrenByCode.comp2 = dependencyValues.textListChild[0];
  } else if (dependencyValues.mathListChild.length > 0) {
    dependenciesForEvaluateLogic.mathListChildrenByCode.comp2 = dependencyValues.mathListChild[0];
  } else if (dependencyValues.numberListChild.length > 0) {
    dependenciesForEvaluateLogic.numberListChildrenByCode.comp2 = dependencyValues.numberListChild[0];
  } else if (dependencyValues.booleanListChild.length > 0) {
    dependenciesForEvaluateLogic.booleanListChildrenByCode.comp2 = dependencyValues.booleanListChild[0];
  } else if (dependencyValues.otherComparableChild.length > 0) {
    dependenciesForEvaluateLogic.otherChildrenByCode.comp2 = dependencyValues.otherComparableChild[0];
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

function addResponsesToDescendantsWithTarget(components, target, absoluteTarget) {
  
  for (let component of components) {
    let propsOrDAttrs = component.props;
    if (!propsOrDAttrs || Object.keys(propsOrDAttrs).length === 0) {
      propsOrDAttrs = component.doenetAttributes;
    }
    if (propsOrDAttrs) {
      for (let prop in propsOrDAttrs) {
        if (
          (prop.toLowerCase() === "target" && propsOrDAttrs[prop] === target)
          ||
          (prop.toLowerCase() === "targetcomponentname" && propsOrDAttrs[prop] === absoluteTarget)
        ) {
          if (!component.attributes) {
            component.attributes = {};
          }
          let foundIsResponse = Object.keys(component.attributes).map(x => x.toLowerCase()).includes("isresponse");
          if (!foundIsResponse) {
            // Note we don't add the attribute as {primitive: true}
            // because the composite don't have the attribute isResponse
            // but pass it on to their replacements
            component.attributes.isResponse = true;
          }
        }
      }

    }

    if (component.children) {
      addResponsesToDescendantsWithTarget(component.children, target, absoluteTarget)
    }
  }

}
