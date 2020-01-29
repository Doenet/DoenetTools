import BaseComponent from './abstract/BaseComponent';

export default class Award extends BaseComponent {
  static componentType = "award";

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
      validValues: new Set(["full", "numbers", "numbersepreserveorder", "none"]),
      propagateToDescendants: true,
    };
    properties.unorderedCompare = { default: false, propagateToDescendants: true };
    properties.allowedErrorInNumbers = { default: 0, propagateToDescendants: true };
    properties.includeErrorInNumberExponents = { default: false, propagateToDescendants: true };
    properties.allowedErrorIsAbsolute = { default: false, propagateToDescendants: true };
    properties.splitIntoOptions = { default: false, propagateToDescendants: true };
    properties.nSignErrorsMatched = { default: 0, propagateToDescendants: true };
    properties.feedbackCode = { default: undefined };
    properties.feedbackText = { default: undefined };

    return properties;

  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneIf = childLogic.newLeaf({
      name: "exactlyOneIf",
      componentType: 'if',
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
      name: "ifXorStringXorMathXorText",
      operator: 'xor',
      propositions: [exactlyOneIf, exactlyOneString, exactlyOneMath, exactlyOneText],
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.incomplete = {
      additionalStateVariablesDefined: [
        "incompleteType", "childForIncomplete",
      ],
      returnDependencies: () => ({
        stringChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneString",
          variableNames: ["value"]
        },
        mathChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneMath",
        },
        textChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneText",
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
      additionalStateVariablesDefined: ["fractionSatisfied", "ifChild"],
      returnDependencies: () => ({
        credit: {
          dependencyType: "stateVariable",
          variableName: "credit"
        },
        ifChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneIf",
          variableNames: ["fractionSatisfied"]
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.ifChild.length === 0) {
          return {
            newValues: {
              creditAchieved: 0,
              fractionSatisfied: 0,
              ifChild: undefined,
            }
          }
        }
        let fractionSatisfied = dependencyValues.ifChild[0].stateValues.fractionSatisfied;
        let creditAchieved = 0;
        if (Number.isFinite(dependencyValues.credit)) {
          creditAchieved = Math.max(0, Math.min(1, dependencyValues.credit)) * Math.max(0, Math.min(1, fractionSatisfied));
        }
        return {
          newValues: {
            fractionSatisfied, creditAchieved,
            ifChild: dependencyValues.ifChild[0],
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


    stateVariableDefinitions.feedback = {
      public: true,
      componentType: "feedback",

      returnDependencies: () => ({
        feedbackText: {
          dependencyType: "stateVariable",
          variableName: "feedbackText",
        },
        feedbackCode: {
          dependencyType: "stateVariable",
          variableName: "feedbackCode",
        },
        awarded: {
          dependencyType: "stateVariable",
          variableName: "awarded"
        }
      }),
      definition: function ({ dependencyValues }) {

        if (!dependencyValues.awarded) {
          return { newValues: { feedback: "" } }
        }

        let feedback;

        if (dependencyValues.feedbackText === undefined) {

          // TODO: mechanism for specifying standardized feedback
          // and for authors to modify it
          let feedback = this.constructor.standardizedFeedback[dependencyValues.feedbackCode];
          if (feedback === undefined) {
            feedback = "";
          } else {
            feedback = feedback;
          }
        } else {
          feedback = dependencyValues.feedbackText;
        }

        return { newValues: feedback }

      }
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
