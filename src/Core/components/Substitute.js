import CompositeComponent from './abstract/CompositeComponent';
import { normalizeMathExpression } from '../utils/math';
import { processAssignNames } from '../utils/serializedStateProcessing';

export default class Substitute extends CompositeComponent {
  static componentType = 'substitute';

  static assignNamesToReplacements = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.type = {
      createPrimitiveOfType: "string",
      defaultValue: "math"
    }

    attributes.match = {
      createComponentOfType: "_componentWithSelectableType",
      createStateVariable: "match",
      defaultValue: null
    }

    attributes.replacement = {
      createComponentOfType: "_componentWithSelectableType",
      createStateVariable: "replacement",
      defaultValue: null
    }


    // attributes for math
    // let simplify="" or simplify="true" be full simplify
    attributes.simplify = {
      createComponentOfType: "text",
      createStateVariable: "simplify",
      defaultValue: "none",
      public: true,
      toLowerCase: true,
      valueTransformations: { "true": "full" },
      validValues: ["none", "full", "numbers", "numberspreserveorder"]
    };
    attributes.displayDigits = {
      leaveRaw: true
    }
    attributes.displayDecimals = {
      leaveRaw: true
    }
    attributes.displaySmallAsZero = {
      leaveRaw: true
    }

    // attributes for text
    attributes.matchWholeWord = {
      createComponentOfType: "boolean",
      createStateVariable: "matchWholeWord",
      defaultValue: false,
      public: true,
    };

    attributes.caseSensitive = {
      createComponentOfType: "boolean",
      createStateVariable: "caseSensitive",
      defaultValue: false,
      public: true,
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = [];

    function addType({ matchedChildren, componentAttributes }) {

      let type = componentAttributes.type;
      if (!["math", "text"].includes(type)) {
        type = "math";
      }

      return {
        success: true,
        newChildren: [{
          componentType: type,
          children: matchedChildren
        }]
      }
    }

    sugarInstructions.push({
      replacementFunction: addType
    });

    return sugarInstructions;

  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: 'atMostOneChild',
      componentType: "_base",
      comparison: 'atMost',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.type = {
      returnDependencies: () => ({
        type: {
          dependencyType: "attributePrimitive",
          attributeName: "type",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.type) {
          let type = dependencyValues.type.toLowerCase()
          if (["math", "text"].includes(type)) {
            return { newValues: { type } };
          } else {
            console.warn(`Invalid type ${dependencyValues.type} for a substitute.  Defaulting to math.`)
          }
        }
        return { newValues: { type: "math" } };
      }
    };


    stateVariableDefinitions.originalValue = {
      returnDependencies: () => ({
        child: {
          dependencyType: "child",
          childLogicName: "atMostOneChild",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.child.length === 1) {
          return { newValues: { originalValue: dependencyValues.child[0].stateValues.value } }
        } else {
          return { newValues: { originalValue: null } }
        }
      }

    }


    stateVariableDefinitions.value = {
      returnDependencies: () => ({
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        },
        originalValue: {
          dependencyType: "stateVariable",
          variableName: "originalValue"
        },
        match: {
          dependencyType: "stateVariable",
          variableName: "match"
        },
        replacement: {
          dependencyType: "stateVariable",
          variableName: "replacement"
        },
        simplify: {
          dependencyType: "stateVariable",
          variableName: "simplify"
        },
        matchWholeWord: {
          dependencyType: "stateVariable",
          variableName: "matchWholeWord"
        },
        caseSensitive: {
          dependencyType: "stateVariable",
          variableName: "caseSensitive"
        },
      }),
      definition({ dependencyValues }) {

        if (dependencyValues.originalValue === null) {
          return { newValues: { value: null } }
        }

        if (dependencyValues.type === "text") {

          // need to use regex form of string.replace to do a global search
          // but first need to escape any regular expression characters
          // as don't want to interpret string as regular expression

          // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
          function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
          }

          let value = dependencyValues.originalValue;
          let re;
          let flag = 'g';
          if (!dependencyValues.caseSensitive) {
            flag = 'gi';
          }
          if (dependencyValues.matchWholeWord) {
            // TODO: Using \b doesn't work for non-roman letters or with accents
            // Use more general unicode word boundary.  Maybe:
            // XRegExp('(?=^|$|[^\\p{L}])') suggested in https://stackoverflow.com/a/32554839
            re = new RegExp('\\b' + escapeRegExp(dependencyValues.match) + '\\b', flag);
          } else {
            re = new RegExp(escapeRegExp(dependencyValues.match), flag);
          }
          let replacement = dependencyValues.replacement;
          value = value.replace(re, replacement);

          return { newValues: { value } }
        } else {
          // math
          let value = dependencyValues.originalValue.subscripts_to_strings();
          value = value.substitute(
            {
              [dependencyValues.match.subscripts_to_strings().tree]:
                dependencyValues.replacement.subscripts_to_strings()
            })
          value = value.strings_to_subscripts();
          value = normalizeMathExpression({
            value: value,
            simplify: dependencyValues.simplify
          });

          return { newValues: { value } }

        }
      }
    }

    stateVariableDefinitions.readyToExpandWhenResolved = {

      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value",
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
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    };


    return stateVariableDefinitions;

  }



  static createSerializedReplacements({ component, componentInfoObjects }) {

    let newNamespace = component.attributes.newNamespace && component.attributes.newNamespace.primitive;

    let serializedReplacement = {
      componentType: component.stateValues.type,
      state: { value: component.stateValues.value }
    }

    // for math type, if specified attributes in the substitute tag
    // give those attributes to serialized replacement
    if (component.stateValues.type === "math") {

      let attributes = {};
      let foundAttribute = false;
      for (let attr of ["displayDigits", "displaySmallAsZero", "displayDecimals"]) {
        if (attr in component.attributes) {
          attributes[attr] = component.attributes[attr];
          foundAttribute = true;
        }
      }

      if (foundAttribute) {

        serializedReplacement.attributes = convertAttributesForComponentType({
          attributes,
          componentType: "math",
          componentInfoObjects,
          compositeCreatesNewNamespace: newNamespace
        })


      }
    }

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: [serializedReplacement],
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      componentInfoObjects,
    });

    return { replacements: processResult.serializedComponents };
  }


  static calculateReplacementChanges({ component }) {

    return [{
      changeType: "updateStateVariables",
      component: component.replacements[0],
      stateChanges: { value: component.stateValues.value }
    }];

  }
}