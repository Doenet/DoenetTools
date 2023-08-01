import CompositeComponent from "./abstract/CompositeComponent";
import { normalizeMathExpression } from "../utils/math";
import { processAssignNames } from "../utils/serializedStateProcessing";
import {
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";

export default class Substitute extends CompositeComponent {
  static componentType = "substitute";

  static allowInSchemaAsComponent = ["math", "text"];

  static assignNamesToReplacements = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number",
    };
    attributes.type = {
      createPrimitiveOfType: "string",
      createStateVariable: "type",
      defaultPrimitiveValue: "math",
      toLowerCase: true,
      validValues: ["math", "text"],
      public: true,
    };

    attributes.match = {
      createComponentOfType: "_componentWithSelectableType",
      createStateVariable: "match",
      defaultValue: null,
    };

    attributes.replacement = {
      createComponentOfType: "_componentWithSelectableType",
      createStateVariable: "replacement",
      defaultValue: null,
    };

    // attributes for math
    // let simplify="" or simplify="true" be full simplify
    attributes.simplify = {
      createComponentOfType: "text",
      createStateVariable: "simplify",
      defaultValue: "none",
      public: true,
      toLowerCase: true,
      valueTransformations: { "": "full", true: "full", false: "none" },
      validValues: ["none", "full", "numbers", "numberspreserveorder"],
    };

    Object.assign(attributes, returnRoundingAttributes());

    // attributes for text
    attributes.matchWholeWord = {
      createComponentOfType: "boolean",
      createStateVariable: "matchWholeWord",
      defaultValue: false,
      public: true,
    };

    attributes.matchCase = {
      createComponentOfType: "boolean",
      createStateVariable: "matchCase",
      defaultValue: false,
      public: true,
    };

    attributes.preserveCase = {
      createComponentOfType: "boolean",
      createStateVariable: "preserveCase",
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
        newChildren: [
          {
            componentType: type,
            children: matchedChildren,
          },
        ],
      };
    }

    sugarInstructions.push({
      replacementFunction: addType,
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "anything",
        componentTypes: ["_base"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let roundingDefinitions = returnRoundingStateVariableDefinitions({
      childsGroupIfSingleMatch: ["anything"],
    });
    Object.assign(stateVariableDefinitions, roundingDefinitions);

    stateVariableDefinitions.originalValue = {
      returnDependencies: () => ({
        child: {
          dependencyType: "child",
          childGroups: ["anything"],
          variableNames: ["value"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.child.length > 0) {
          return {
            setValue: {
              originalValue: dependencyValues.child[0].stateValues.value,
            },
          };
        } else {
          return { setValue: { originalValue: null } };
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.child.length > 0) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "child",
                desiredValue: desiredStateVariableValues.originalValue,
                childIndex: 0,
                variableIndex: 0,
              },
            ],
          };
        } else {
          return { success: false };
        }
      },
    };

    stateVariableDefinitions.value = {
      returnDependencies: () => ({
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        originalValue: {
          dependencyType: "stateVariable",
          variableName: "originalValue",
        },
        match: {
          dependencyType: "stateVariable",
          variableName: "match",
        },
        replacement: {
          dependencyType: "stateVariable",
          variableName: "replacement",
        },
        simplify: {
          dependencyType: "stateVariable",
          variableName: "simplify",
        },
        matchWholeWord: {
          dependencyType: "stateVariable",
          variableName: "matchWholeWord",
        },
        matchCase: {
          dependencyType: "stateVariable",
          variableName: "matchCase",
        },
        preserveCase: {
          dependencyType: "stateVariable",
          variableName: "preserveCase",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.originalValue === null) {
          return {
            setValue: { value: null },
          };
        }

        if (
          dependencyValues.match === null ||
          dependencyValues.replacement === null
        ) {
          return { setValue: { value: dependencyValues.originalValue } };
        }

        if (dependencyValues.type === "text") {
          // need to use regex form of string.replace to do a global search
          // use escapeRegExp to escape any regular expression characters
          // as don't want to interpret string as regular expression

          let value = dependencyValues.originalValue;
          let re;
          let flag = "g";
          if (!dependencyValues.matchCase) {
            flag = "gi";
          }
          if (dependencyValues.matchWholeWord) {
            // TODO: Using \b doesn't work for non-roman letters or with accents
            // Use more general unicode word boundary.  Maybe:
            // XRegExp('(?=^|$|[^\\p{L}])') suggested in https://stackoverflow.com/a/32554839
            re = new RegExp(
              "\\b" + escapeRegExp(dependencyValues.match) + "\\b",
              flag,
            );
          } else {
            re = new RegExp(escapeRegExp(dependencyValues.match), flag);
          }

          let replacement = dependencyValues.replacement;
          if (dependencyValues.preserveCase) {
            let preserveCaseReplacer = returnPreserveCaseReplacer(replacement);
            value = value.replace(re, preserveCaseReplacer);
          } else {
            value = value.replace(re, replacement);
          }
          return {
            setValue: { value },
          };
        } else {
          // math
          let value = dependencyValues.originalValue.subscripts_to_strings();
          value = value.substitute({
            [dependencyValues.match.subscripts_to_strings().tree]:
              dependencyValues.replacement.subscripts_to_strings(),
          });
          value = value.strings_to_subscripts();
          value = normalizeMathExpression({
            value: value,
            simplify: dependencyValues.simplify,
          });

          return {
            setValue: { value },
          };
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.type === "text") {
          let desiredValue = desiredStateVariableValues.value;
          let reForMatch, reForReplacement;
          let flag = "g";
          if (!dependencyValues.matchCase) {
            flag = "gi";
          }

          let match = dependencyValues.match;
          let replacement = dependencyValues.replacement;

          if (dependencyValues.matchWholeWord) {
            // TODO: Using \b doesn't work for non-roman letters or with accents
            // Use more general unicode word boundary.  Maybe:
            // XRegExp('(?=^|$|[^\\p{L}])') suggested in https://stackoverflow.com/a/32554839
            reForMatch = new RegExp("\\b" + escapeRegExp(match) + "\\b", flag);
            if (dependencyValues.matchCase && dependencyValues.preserveCase) {
              // if both match case and preserve case,
              // then will have used the preserveCase replacer on the exact string from match
              let preserveCaseReplacer =
                returnPreserveCaseReplacer(replacement);
              reForReplacement = new RegExp(
                "\\b" + escapeRegExp(preserveCaseReplacer(match)) + "\\b",
                flag,
              );
            } else {
              reForReplacement = new RegExp(
                "\\b" + escapeRegExp(replacement) + "\\b",
                flag,
              );
            }
          } else {
            reForMatch = new RegExp(escapeRegExp(match), flag);
            if (dependencyValues.matchCase && dependencyValues.preserveCase) {
              // if both match case and preserve case,
              // then will have used the preserveCase replacer on the exact string from match
              let preserveCaseReplacer =
                returnPreserveCaseReplacer(replacement);
              reForReplacement = new RegExp(
                escapeRegExp(preserveCaseReplacer(match)),
                flag,
              );
            } else {
              reForReplacement = new RegExp(escapeRegExp(replacement), flag);
            }
          }

          // don't allow the originalValue to contain the replacement
          // don't allow a desiredValue that includes the match,
          // as it would be impossible to still have match after substitution
          if (
            dependencyValues.originalValue.search(reForReplacement) !== -1 ||
            desiredValue.search(reForMatch) !== -1
          ) {
            return { success: false };
          }

          desiredValue = desiredValue.replace(reForReplacement, match);

          return {
            success: true,
            instructions: [
              {
                setDependency: "originalValue",
                desiredValue,
              },
            ],
          };
        } else {
          let desiredValue =
            desiredStateVariableValues.value.subscripts_to_strings();
          let match = dependencyValues.match.subscripts_to_strings();
          let replacement =
            dependencyValues.replacement.subscripts_to_strings();

          // allow only if match and replacement are single variables
          if (
            !(
              typeof match.tree === "string" &&
              typeof replacement.tree === "string"
            )
          ) {
            return { success: false };
          }

          // allow only if replacement is not in originalValue

          // Note argument true of variables includes variables with subscript
          // so has same effect as subscript_to_strings()
          let variablesOfOrig = dependencyValues.originalValue.variables(true);
          if (variablesOfOrig.includes(replacement.tree)) {
            return { success: false };
          }

          // don't allow a desiredValue that includes the match,
          // as it would be impossible to still have match after substitution
          let variablesInDesired = desiredValue.variables();
          if (variablesInDesired.includes(match.tree)) {
            return { success: false };
          }

          desiredValue = desiredValue.substitute({
            [replacement.tree]: match,
          });
          desiredValue = desiredValue.strings_to_subscripts();

          return {
            success: true,
            instructions: [
              {
                setDependency: "originalValue",
                desiredValue,
              },
            ],
          };
        }
      },
    };

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
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    componentInfoObjects,
    flags,
  }) {
    let errors = [];
    let warnings = [];

    let newNamespace = component.attributes.newNamespace?.primitive;

    let type = await component.stateValues.type;
    let serializedReplacement = {
      componentType: type,
      state: { value: await component.stateValues.value },
      downstreamDependencies: {
        [component.componentName]: [
          {
            dependencyType: "referenceShadow",
            compositeName: component.componentName,
            propVariable: "value",
          },
        ],
      },
    };

    // for math type, if specified attributes in the substitute tag
    // give those attributes to serialized replacement
    if (type === "math") {
      let attributes = {};

      let attributesComponentTypes = {};

      let roundingSVs = returnRoundingStateVariableDefinitions();
      for (let attrName in roundingSVs) {
        attributesComponentTypes[attrName] =
          roundingSVs[attrName].shadowingInstructions.createComponentOfType;
      }

      for (let attr in attributesComponentTypes) {
        let shadowComponent = {
          componentType: attributesComponentTypes[attr],
          downstreamDependencies: {
            [component.componentName]: [
              {
                compositeName: component.componentName,
                dependencyType: "referenceShadow",
                propVariable: attr,
              },
            ],
          },
        };

        attributes[attr] = {
          component: shadowComponent,
        };
      }

      serializedReplacement.attributes = attributes;
    }

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: [serializedReplacement],
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      componentInfoObjects,
    });
    errors.push(...processResult.errors);
    warnings.push(...processResult.warnings);

    return {
      replacements: processResult.serializedComponents,
      errors,
      warnings,
    };
  }
}

// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function returnPreserveCaseReplacer(replacement) {
  return function (match) {
    if (match.toUpperCase() === match) {
      return replacement.toUpperCase();
    } else if (match.toLowerCase() === match) {
      return replacement.toLowerCase();
    } else if (match[0].match(/[a-z]/)) {
      // change first character of replacement to lower case
      // and leave the remaining character untouched
      return replacement[0].toLowerCase() + replacement.substring(1);
    } else if (match[0].match(/[A-Z]/)) {
      // change first character of replacement to upper case
      // and leave the remaining character untouched
      return replacement[0].toUpperCase() + replacement.substring(1);
    } else {
      return replacement;
    }
  };
}
