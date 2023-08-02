import InlineComponent from "./abstract/InlineComponent";
import { deepCompare } from "../utils/deepFunctions";
import { renameStateVariable } from "../utils/stateVariables";
import {
  serializedComponentsReplacer,
  serializedComponentsReviver,
} from "../utils/serializedStateProcessing";
import sha1 from "crypto-js/sha1";
import Base64 from "crypto-js/enc-base64";
import stringify from "json-stringify-deterministic";
import me from "math-expressions";

export default class Answer extends InlineComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      submitAnswer: this.submitAnswer.bind(this),
    });
  }
  static componentType = "answer";

  // Include children that can be added due to sugar
  static additionalSchemaChildren = [
    "math",
    "mathList",
    "number",
    "numberList",
    "text",
    "textList",
    "boolean",
    "booleanList",
    "choice",
  ];

  static renderChildren = true;

  static variableForImplicitProp = "submittedResponses";

  static includeBlankStringChildren = true;
  static removeBlankStringChildrenPostSugar = true;

  static processWhenJustUpdatedForNewComponent = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.weight = {
      createComponentOfType: "number",
      createStateVariable: "weight",
      defaultValue: 1,
      public: true,
    };
    attributes.handGraded = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "handGraded",
      defaultValue: false,
      public: true,
    };
    attributes.inline = {
      createComponentOfType: "boolean",
      createStateVariable: "inline",
      defaultValue: false,
      public: true,
    };
    attributes.symbolicEquality = {
      createComponentOfType: "boolean",
      createStateVariable: "symbolicEquality",
      defaultValue: false,
      public: true,
    };
    attributes.matchPartial = {
      createComponentOfType: "boolean",
      createStateVariable: "matchPartial",
      defaultValue: false,
      public: true,
    };
    attributes.forceFullCheckworkButton = {
      createComponentOfType: "boolean",
      createStateVariable: "forceFullCheckworkButton",
      defaultValue: false,
      public: true,
    };
    attributes.simplifyOnCompare = {
      createComponentOfType: "text",
      createStateVariable: "simplifyOnCompare",
      defaultValue: "none",
      toLowerCase: true,
      valueTransformations: { "": "full", true: "full", false: "none" },
      validValues: ["none", "full", "numbers", "numberspreserveorder"],
      public: true,
    };
    attributes.expandOnCompare = {
      createComponentOfType: "boolean",
      createStateVariable: "expandOnCompare",
      defaultValue: false,
      public: true,
    };
    attributes.unorderedCompare = {
      createComponentOfType: "boolean",
      createStateVariable: "unorderedCompare",
      defaultValue: false,
      public: true,
    };
    attributes.matchByExactPositions = {
      createComponentOfType: "boolean",
      createStateVariable: "matchByExactPositions",
      defaultValue: false,
      public: true,
    };
    attributes.numAwardsCredited = {
      createComponentOfType: "integer",
      createStateVariable: "numAwardsCredited",
      defaultValue: 1,
      public: true,
    };
    attributes.maxNumAttempts = {
      createComponentOfType: "integer",
      createStateVariable: "maxNumAttempts",
      defaultValue: Infinity,
      public: true,
    };
    attributes.allowedErrorInNumbers = {
      createComponentOfType: "number",
      createStateVariable: "allowedErrorInNumbers",
      defaultValue: 0,
      public: true,
    };
    attributes.includeErrorInNumberExponents = {
      createComponentOfType: "boolean",
      createStateVariable: "includeErrorInNumberExponents",
      defaultValue: false,
      public: true,
    };
    attributes.allowedErrorIsAbsolute = {
      createComponentOfType: "boolean",
      createStateVariable: "allowedErrorIsAbsolute",
      defaultValue: false,
      public: true,
    };
    attributes.numSignErrorsMatched = {
      createComponentOfType: "number",
      createStateVariable: "numSignErrorsMatched",
      defaultValue: 0,
      public: true,
    };
    attributes.numPeriodicSetMatchesRequired = {
      createComponentOfType: "integer",
      createStateVariable: "numPeriodicSetMatchesRequired",
      defaultValue: 3,
      public: true,
    };
    attributes.caseInsensitiveMatch = {
      createComponentOfType: "boolean",
      createStateVariable: "caseInsensitiveMatch",
      defaultValue: false,
      public: true,
    };
    attributes.matchBlanks = {
      createComponentOfType: "boolean",
      createStateVariable: "matchBlanks",
      defaultValue: false,
      public: true,
    };
    attributes.showCorrectness = {
      createComponentOfType: "boolean",
      createStateVariable: "showCorrectnessPreliminary",
      defaultValue: null,
    };
    attributes.type = {
      createPrimitiveOfType: "string",
    };

    attributes.disableAfterCorrect = {
      createComponentOfType: "boolean",
      createStateVariable: "disableAfterCorrect",
      defaultValue: false,
      public: true,
    };

    attributes.submitLabel = {
      createComponentOfType: "text",
      createStateVariable: "submitLabel",
      defaultValue: "Check Work",
      public: true,
      forRenderer: true,
    };

    attributes.submitLabelNoCorrectness = {
      createComponentOfType: "text",
      createStateVariable: "submitLabelNoCorrectness",
      defaultValue: "Submit Response",
      public: true,
      forRenderer: true,
    };

    attributes.selectMultiple = {
      createComponentOfType: "boolean",
      createStateVariable: "selectMultiple",
      defaultValue: false,
      public: true,
    };
    attributes.shuffleOrder = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "shuffleOrder",
      defaultValue: false,
      public: true,
    };

    attributes.splitSymbols = {
      createComponentOfType: "boolean",
      createStateVariable: "splitSymbols",
      defaultValue: true,
      public: true,
    };

    attributes.parseScientificNotation = {
      createComponentOfType: "boolean",
      createStateVariable: "parseScientificNotation",
      defaultValue: false,
      public: true,
    };

    attributes.expanded = {
      createComponentOfType: "boolean",
      createStateVariable: "expanded",
      defaultValue: false,
      public: true,
    };

    attributes.displayDigitsForResponses = {
      createComponentOfType: "integer",
      createStateVariable: "displayDigitsForResponses",
      defaultValue: 10,
      public: true,
    };

    attributes.displayDigitsForCreditAchieved = {
      createComponentOfType: "integer",
      createStateVariable: "displayDigitsForCreditAchieved",
      defaultValue: 3,
      public: true,
    };

    // temporary attribute until fix toast
    attributes.suppressToast = {
      createComponentOfType: "boolean",
      createStateVariable: "suppressToast",
      defaultValue: false,
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let addAwardAndPossiblyInput = function ({
      matchedChildren,
      componentAttributes,
      componentInfoObjects,
    }) {
      // if chidren are strings and macros
      // wrap with award and type

      function checkForResponseDescendant(components) {
        for (let component of components) {
          if (
            component?.attributes?.isResponse &&
            component.attributes.isResponse.primitive !== false
          ) {
            // idea: catch either isResponse = true or isResponse.primitive=true
            return true;
          } else if (
            component.children &&
            checkForResponseDescendant(component.children)
          ) {
            return true;
          }
        }
        return false;
      }

      function addResponsesToCompositeDescendants(components) {
        for (let component of components) {
          if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: component.componentType,
              baseComponentType: "_composite",
            })
          ) {
            if (!component.attributes) {
              component.attributes = {};
            }
            // Note we don't add the attribute as {primitive: true}
            // because the composite don't have the attribute isResponse
            // but pass it on to their replacements
            component.attributes.isResponse = true;
          } else if (component.children) {
            addResponsesToCompositeDescendants(component.children);
          }
        }
      }

      let componentIsSpecifiedType =
        componentInfoObjects.componentIsSpecifiedType;

      let foundMath = false,
        foundText = false,
        foundBoolean = false;
      let nChoicesFound = 0;
      let definitelyDoNotAddInput = false,
        mayNeedInput = false;
      let foundResponse = false;
      let foundAward = false;

      let childIsWrappable = [];
      for (let child of matchedChildren) {
        if (typeof child !== "object") {
          childIsWrappable.push(true);
          if (child.trim()) {
            mayNeedInput = true;
          }
        } else if (
          componentIsSpecifiedType(child, "math") ||
          componentIsSpecifiedType(child, "number") ||
          componentIsSpecifiedType(child, "mathList") ||
          componentIsSpecifiedType(child, "numberList")
        ) {
          childIsWrappable.push(true);
          mayNeedInput = true;
          foundMath = true;
        } else if (
          componentIsSpecifiedType(child, "text") ||
          componentIsSpecifiedType(child, "textList")
        ) {
          childIsWrappable.push(true);
          foundText = true;
          mayNeedInput = true;
        } else if (componentIsSpecifiedType(child, "boolean")) {
          childIsWrappable.push(true);
          foundBoolean = true;
          mayNeedInput = true;
        } else if (componentIsSpecifiedType(child, "booleanList")) {
          // TODO: what should we do with a booleanList,
          // as don't have a booleanList input?
          childIsWrappable.push(true);
          foundBoolean = true;
        } else if (componentIsSpecifiedType(child, "choice")) {
          childIsWrappable.push(true);
          nChoicesFound++;
        } else if (componentIsSpecifiedType(child, "award")) {
          foundAward = true;
          childIsWrappable.push(false);
          if (child.attributes?.sourcesAreResponses) {
            foundResponse = true;
          }
          if (child.children?.length > 0) {
            for (let grandChild of child.children) {
              if (typeof grandChild !== "object") {
                if (grandChild.trim()) {
                  mayNeedInput = true;
                }
              } else if (componentIsSpecifiedType(grandChild, "when")) {
                // have to test for when before boolean, sincd when is derived from boolean!
              } else if (
                componentIsSpecifiedType(grandChild, "math") ||
                componentIsSpecifiedType(grandChild, "number") ||
                componentIsSpecifiedType(grandChild, "mathList") ||
                componentIsSpecifiedType(grandChild, "numberList")
              ) {
                foundMath = true;
                mayNeedInput = true;
              } else if (
                componentIsSpecifiedType(grandChild, "text") ||
                componentIsSpecifiedType(grandChild, "textList")
              ) {
                foundText = true;
                mayNeedInput = true;
              } else if (componentIsSpecifiedType(grandChild, "boolean")) {
                foundBoolean = true;
                mayNeedInput = true;
              } else if (componentIsSpecifiedType(grandChild, "booleanList")) {
                // TODO: what should we do with a booleanList,
                // as don't have a booleanList input?
                foundBoolean = true;
              } else if (
                componentInfoObjects.isInheritedComponentType({
                  inheritedComponentType: grandChild.componentType,
                  baseComponentType: "_composite",
                }) &&
                !grandChild.attributes?.createComponentOfType?.primitive
              ) {
                mayNeedInput = true;
              } else if (
                componentIsSpecifiedType(grandChild, "orbitalDiagram")
              ) {
                // Note: should add componentTypes as create more comparable types in award
              } else {
                // could be a component that could adapt into a math/text/boolean
                mayNeedInput = true;
              }
            }
          } else {
            // if copied in award, it won't have children
            mayNeedInput = true;
          }
        } else if (componentIsSpecifiedType(child, "mathInput")) {
          childIsWrappable.push(false);
          foundMath = true;
          definitelyDoNotAddInput = true;
        } else if (componentIsSpecifiedType(child, "textInput")) {
          childIsWrappable.push(false);
          foundText = true;
          definitelyDoNotAddInput = true;
        } else if (componentIsSpecifiedType(child, "_input")) {
          childIsWrappable.push(false);
          definitelyDoNotAddInput = true;
        } else if (componentIsSpecifiedType(child, "considerAsResponses")) {
          childIsWrappable.push(false);
          definitelyDoNotAddInput = true;
        } else if (
          componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "_composite",
          }) &&
          !child.attributes?.createComponentOfType?.primitive
        ) {
          // have a composite without specified componentType
          childIsWrappable.push(true);
          mayNeedInput = true;
        } else {
          // wrap anything else as it isn't matched by a child group?
          childIsWrappable.push(true);
          mayNeedInput = true;
        }
      }

      if (definitelyDoNotAddInput) {
        foundResponse = true;
      }

      if (nChoicesFound > 0) {
        // remove blank string children
        matchedChildren = matchedChildren.filter(
          (x) => typeof x !== "string" || x.trim() !== "",
        );
        if (matchedChildren.length !== nChoicesFound) {
          return { success: false };
        } else {
          // wrap all choices in a choiceinput
          let choiceinput = {
            componentType: "choiceInput",
            children: matchedChildren,
          };
          if (componentAttributes.shuffleOrder) {
            choiceinput.attributes = { shuffleOrder: { primitive: true } };
          }
          return {
            success: true,
            newChildren: [choiceinput],
          };
        }
      }

      if (componentAttributes.handGraded && !foundAward) {
        mayNeedInput = true;
      }

      if (!mayNeedInput && !foundResponse) {
        // recurse to all descendants of awards to see if have a response
        for (let child of matchedChildren) {
          if (componentIsSpecifiedType(child, "award")) {
            if (child.children?.length > 0) {
              if (checkForResponseDescendant(child.children)) {
                foundResponse = true;
                break;
              }
            }
          }
        }

        if (!foundResponse) {
          // definitely have a case where there is not a response
          // look inside each award and add isResponse to any composites
          for (let child of matchedChildren) {
            if (componentIsSpecifiedType(child, "award")) {
              if (child.children?.length > 0) {
                addResponsesToCompositeDescendants(child.children);
              }
            }
          }
        }
      }

      let childrenToWrap = [],
        childrenToNotWrapBegin = [],
        childrenToNotWrapEnd = [];

      if (childIsWrappable.filter((x) => !x).length === 0) {
        childrenToWrap = matchedChildren;
      } else {
        if (!childIsWrappable[0]) {
          // started with non-wrappable, find first wrappable child
          let firstNonLabelInd = childIsWrappable.indexOf(true);
          if (firstNonLabelInd !== -1) {
            childrenToNotWrapBegin = matchedChildren.slice(0, firstNonLabelInd);
            matchedChildren = matchedChildren.slice(firstNonLabelInd);
            childIsWrappable = childIsWrappable.slice(firstNonLabelInd);
          }
        }

        // now we don't have non-wrappable at the beginning
        // find first non-wrappable ind
        let firstLabelInd = childIsWrappable.indexOf(false);
        if (firstLabelInd === -1) {
          childrenToWrap = matchedChildren;
        } else {
          childrenToWrap = matchedChildren.slice(0, firstLabelInd);
          childrenToNotWrapEnd = matchedChildren.slice(firstLabelInd);
        }
      }

      // remove any blank string children from beginning or end of children to wrap
      while (
        typeof childrenToWrap[0] === "string" &&
        childrenToWrap[0].trim() === ""
      ) {
        childrenToWrap = childrenToWrap.slice(1);
      }
      let nWrap = childrenToWrap.length;
      while (
        typeof childrenToWrap[nWrap - 1] === "string" &&
        childrenToWrap[nWrap - 1].trim() === ""
      ) {
        childrenToWrap = childrenToWrap.slice(0, nWrap - 1);
        nWrap = childrenToWrap.length;
      }

      let newChildren;
      let type;
      let warnings = [];

      if (componentAttributes.type) {
        type = componentAttributes.type;
        if (!["math", "text", "boolean"].includes(type)) {
          warnings.push({
            message: `Invalid type for answer: ${type}`,
            level: 1,
          });
          type = "math";
        }
      } else {
        if (foundMath) {
          type = "math";
        } else if (foundText) {
          type = "text";
        } else if (foundBoolean) {
          // TODO: if have multiple booleans,
          // it doesn't make sense to wrap in one big boolean.
          // What is a better solution?
          type = "boolean";
        } else {
          type = "math";
        }
      }

      if (childrenToWrap.length === 0) {
        newChildren = [...childrenToNotWrapBegin, ...childrenToNotWrapEnd];
      } else {
        // if have one child and it has a specified componentType
        // then no need to wrap with componentType

        let needToWrapWithComponentType =
          childrenToWrap.length > 1 ||
          (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: childrenToWrap[0].componentType,
            baseComponentType: "_composite",
          }) &&
            !childrenToWrap[0].props?.componentType);

        let awardChildren;
        if (needToWrapWithComponentType) {
          awardChildren = [
            {
              componentType: type,
              children: childrenToWrap,
            },
          ];
        } else {
          awardChildren = childrenToWrap;
        }
        newChildren = [
          ...childrenToNotWrapBegin,
          {
            componentType: "award",
            children: awardChildren,
          },
          ...childrenToNotWrapEnd,
        ];
      }

      if (mayNeedInput && !definitelyDoNotAddInput) {
        let inputType = type + "Input";

        newChildren = [{ componentType: inputType }, ...newChildren];
      }

      return {
        success: true,
        newChildren: newChildren,
        warnings,
      };
    };

    sugarInstructions.push({
      replacementFunction: addAwardAndPossiblyInput,
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "awards",
        componentTypes: ["award"],
      },
      {
        group: "inputs",
        componentTypes: ["_input"],
      },
      {
        group: "responses",
        componentTypes: ["considerAsResponses"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // rename disabled to disabledOriginal
    renameStateVariable({
      stateVariableDefinitions,
      oldName: "disabled",
      newName: "disabledOriginal",
    });

    stateVariableDefinitions.showCorrectness = {
      forRenderer: true,
      returnDependencies: () => ({
        showCorrectnessPreliminary: {
          dependencyType: "stateVariable",
          variableName: "showCorrectnessPreliminary",
        },
        showCorrectnessFlag: {
          dependencyType: "flag",
          flagName: "showCorrectness",
        },
        handGraded: {
          dependencyType: "stateVariable",
          variableName: "handGraded",
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        let showCorrectness;
        if (!usedDefault.showCorrectnessPreliminary) {
          showCorrectness = dependencyValues.showCorrectnessPreliminary;
        } else {
          showCorrectness =
            dependencyValues.showCorrectnessFlag !== false &&
            !dependencyValues.handGraded;
        }
        return { setValue: { showCorrectness } };
      },
    };

    stateVariableDefinitions.haveAwardThatRequiresInput = {
      returnDependencies: () => ({
        awardChildren: {
          dependencyType: "child",
          childGroups: ["awards"],
          variableNames: ["requireInputInAnswer"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            haveAwardThatRequiresInput: dependencyValues.awardChildren.some(
              (x) => x.stateValues.requireInputInAnswer,
            ),
          },
        };
      },
    };

    stateVariableDefinitions.allInputChildrenIncludingSugared = {
      returnDependencies: () => ({
        allInputChildrenIncludingSugared: {
          dependencyType: "child",
          childGroups: ["inputs"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            allInputChildrenIncludingSugared:
              dependencyValues.allInputChildrenIncludingSugared,
          },
        };
      },
    };

    stateVariableDefinitions.inputChildren = {
      stateVariablesDeterminingDependencies: [
        "allInputChildrenIncludingSugared",
      ],
      additionalStateVariablesDefined: [
        "inputChildIndices",
        "skippedFirstInput",
      ],
      forRenderer: true,
      returnDependencies({ stateValues }) {
        let dependencies = {
          allInputChildrenIncludingSugared: {
            dependencyType: "stateVariable",
            variableName: "allInputChildrenIncludingSugared",
          },
          haveAwardThatRequiresInput: {
            dependencyType: "stateVariable",
            variableName: "haveAwardThatRequiresInput",
          },
          handGraded: {
            dependencyType: "stateVariable",
            variableName: "handGraded",
          },
        };

        if (stateValues.allInputChildrenIncludingSugared.length > 0) {
          dependencies.firstInputFromSugar = {
            dependencyType: "doenetAttribute",
            componentName:
              stateValues.allInputChildrenIncludingSugared[0].componentName,
            attributeName: "createdFromSugar",
          };
        }

        return dependencies;
      },
      definition({ dependencyValues }) {
        // if have award the requires input,
        // use the input child from sugar if none other exists
        // but if first input is choiceInput, use that anyway

        let inputChildren = [
          ...dependencyValues.allInputChildrenIncludingSugared,
        ];
        let inputChildIndices = [
          ...dependencyValues.allInputChildrenIncludingSugared.keys(),
        ];
        let skippedFirstInput = false;

        let skipFirstSugaredInput =
          inputChildren[0]?.componentType !== "choiceInput" &&
          (!(
            dependencyValues.haveAwardThatRequiresInput ||
            dependencyValues.handGraded
          ) ||
            dependencyValues.allInputChildrenIncludingSugared.length > 1);

        if (skipFirstSugaredInput && dependencyValues.firstInputFromSugar) {
          skippedFirstInput = true;
          inputChildren = inputChildren.slice(1);
          inputChildIndices = inputChildIndices.slice(1);
        }

        return {
          setValue: { inputChildren, inputChildIndices, skippedFirstInput },
        };
      },
    };

    stateVariableDefinitions.inputChildrenWithValues = {
      stateVariablesDeterminingDependencies: ["inputChildIndices"],
      forRenderer: true,
      returnDependencies: ({ stateValues }) => ({
        inputChildren: {
          dependencyType: "child",
          childGroups: ["inputs"],
          variableNames: [
            "valueToRecordOnSubmit",
            "valueRecordedAtSubmit",
            "value",
          ],
          childIndices: stateValues.inputChildIndices,
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: { inputChildrenWithValues: dependencyValues.inputChildren },
        };
      },
    };

    // for award children to find the one input child
    stateVariableDefinitions.inputChildWithValues = {
      returnDependencies: () => ({
        inputChildrenWithValues: {
          dependencyType: "stateVariable",
          variableName: "inputChildrenWithValues",
        },
      }),
      definition({ dependencyValues }) {
        let inputChildWithValues = null;
        if (dependencyValues.inputChildrenWithValues.length === 1) {
          inputChildWithValues = dependencyValues.inputChildrenWithValues[0];
        }
        return { setValue: { inputChildWithValues } };
      },
    };

    stateVariableDefinitions.awardInputResponseChildren = {
      returnDependencies: () => ({
        awardInputResponseChildren: {
          dependencyType: "child",
          childGroups: ["awards", "inputs", "responses"],
        },
        skippedFirstInput: {
          dependencyType: "stateVariable",
          variableName: "skippedFirstInput",
        },
      }),
      definition({ dependencyValues }) {
        let awardInputResponseChildren = [
          ...dependencyValues.awardInputResponseChildren,
        ];
        if (dependencyValues.skippedFirstInput) {
          awardInputResponseChildren = awardInputResponseChildren.slice(1);
        }
        return {
          setValue: { awardInputResponseChildren },
        };
      },
    };

    stateVariableDefinitions.numResponses = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      stateVariablesDeterminingDependencies: ["awardInputResponseChildren"],
      returnDependencies({ stateValues, componentInfoObjects }) {
        let dependencies = {
          childTypes: {
            dependencyType: "value",
            value: stateValues.awardInputResponseChildren.map(
              (x) => x.componentType,
            ),
          },
        };

        for (let [
          ind,
          child,
        ] of stateValues.awardInputResponseChildren.entries()) {
          if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "award",
            })
          ) {
            dependencies["child" + ind] = {
              dependencyType: "descendant",
              ancestorName: child.componentName,
              componentTypes: ["_base"],
              variableNames: ["isResponse", "numValues"],
              variablesOptional: true,
              recurseToMatchedChildren: true,
              includeNonActiveChildren: true,
              skipOverAdapters: true,
            };
          } else if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "_input",
            })
          ) {
            dependencies["childNValues" + ind] = {
              dependencyType: "stateVariable",
              componentName: child.componentName,
              variableName: "numValues",
              variablesOptional: true,
            };
          } else {
            // considerAsResponses
            dependencies["child" + ind] = {
              dependencyType: "stateVariable",
              componentName: child.componentName,
              variableName: "childrenWithNValues",
            };
          }
        }

        return dependencies;
      },
      definition({ dependencyValues, componentInfoObjects }) {
        let numResponses = 0;

        for (let [ind, childType] of dependencyValues.childTypes.entries()) {
          if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: childType,
              baseComponentType: "award",
            })
          ) {
            for (let descendant of dependencyValues["child" + ind]) {
              if (
                !descendant.stateValues.isResponse ||
                componentInfoObjects.isInheritedComponentType({
                  inheritedComponentType: descendant.componentType,
                  baseComponentType: "_composite",
                })
              ) {
                continue;
              }

              if (descendant.stateValues.numValues === undefined) {
                numResponses += 1;
              } else {
                numResponses += descendant.stateValues.numValues;
              }
            }
          } else if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: childType,
              baseComponentType: "_input",
            })
          ) {
            let numValues = dependencyValues["childNValues" + ind];
            if (numValues === undefined) {
              numResponses += 1;
            } else {
              numResponses += numValues;
            }
          } else {
            // considerAsResponses

            for (let child of dependencyValues["child" + ind]) {
              if (child.stateValues.numValues === undefined) {
                numResponses += 1;
              } else {
                numResponses += child.stateValues.numValues;
              }
            }
          }
        }

        return { setValue: { numResponses } };
      },
    };

    stateVariableDefinitions.currentResponses = {
      public: true,
      shadowingInstructions: {
        hasVariableComponentType: true,
        addAttributeComponentsShadowingStateVariables: {
          displayDigits: {
            stateVariableToShadow: "displayDigitsForResponses",
          },
        },
      },
      isArray: true,
      entryPrefixes: ["currentResponse"],
      stateVariablesDeterminingDependencies: ["awardInputResponseChildren"],
      returnArraySizeDependencies: () => ({
        numResponses: {
          dependencyType: "stateVariable",
          variableName: "numResponses",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numResponses];
      },
      returnArrayDependenciesByKey({ stateValues, componentInfoObjects }) {
        let globalDependencies = {
          childTypes: {
            dependencyType: "value",
            value: stateValues.awardInputResponseChildren.map(
              (x) => x.componentType,
            ),
          },
        };

        for (let [
          ind,
          child,
        ] of stateValues.awardInputResponseChildren.entries()) {
          if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "award",
            })
          ) {
            globalDependencies["child" + ind] = {
              dependencyType: "descendant",
              ancestorName: child.componentName,
              componentTypes: ["_base"],
              variableNames: [
                "isResponse",
                "value",
                "values",
                "formula",
                "componentType",
              ],
              variablesOptional: true,
              recurseToMatchedChildren: true,
              includeAttributeChildren: true,
              includeNonActiveChildren: true,
              skipOverAdapters: true,
            };
          } else if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "_input",
            })
          ) {
            globalDependencies["childValue" + ind] = {
              dependencyType: "stateVariable",
              componentName: child.componentName,
              variableName: "value",
              variablesOptional: true,
            };
            globalDependencies["childValues" + ind] = {
              dependencyType: "stateVariable",
              componentName: child.componentName,
              variableName: "values",
              variablesOptional: true,
            };
            globalDependencies["childComponentType" + ind] = {
              dependencyType: "stateVariable",
              componentName: child.componentName,
              variableName: "componentType",
              variablesOptional: true,
            };
          } else {
            // considerAsResponses
            globalDependencies["child" + ind] = {
              dependencyType: "stateVariable",
              componentName: child.componentName,
              variableName: "childrenAsResponses",
            };
          }
        }

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues, componentInfoObjects }) {
        let currentResponses = [];
        let componentType = [];

        let responseComponents = [];

        for (let [
          ind,
          childType,
        ] of globalDependencyValues.childTypes.entries()) {
          if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: childType,
              baseComponentType: "award",
            })
          ) {
            for (let descendant of globalDependencyValues["child" + ind]) {
              if (
                !descendant.stateValues.isResponse ||
                componentInfoObjects.isInheritedComponentType({
                  inheritedComponentType: descendant.componentType,
                  baseComponentType: "_composite",
                })
              ) {
                continue;
              }

              responseComponents.push(descendant);
            }
          } else if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: childType,
              baseComponentType: "_input",
            })
          ) {
            // reconstruct child in same way as for other components
            let child = {
              componentType: childType,
              stateValues: {
                value: globalDependencyValues["childValue" + ind],
                values: globalDependencyValues["childValues" + ind],
                componentType:
                  globalDependencyValues["childComponentType" + ind],
              },
            };

            responseComponents.push(child);
          } else {
            // considerAsResponses
            responseComponents.push(...globalDependencyValues["child" + ind]);
          }
        }

        for (let component of responseComponents) {
          let ct = component.stateValues.componentType;
          if (!ct) {
            ct = component.componentType;
          }

          if (ct === "mathList") {
            ct = "math";
          } else if (ct === "numberList") {
            ct = "number";
          } else if (ct === "textList") {
            ct = "text";
          } else if (ct === "booleanList") {
            ct = "boolean";
          }

          if (Array.isArray(component.stateValues.values)) {
            currentResponses.push(...component.stateValues.values);
            componentType.push(
              ...Array(component.stateValues.values.length).fill(ct),
            );
          } else if (component.stateValues.value !== undefined) {
            currentResponses.push(component.stateValues.value);
            componentType.push(ct);
          } else if (component.stateValues.formula instanceof me.class) {
            currentResponses.push(component.stateValues.formula);
            componentType.push("math");
          } else {
            currentResponses.push("");
            componentType.push("text");
          }
        }

        return {
          setValue: { currentResponses },
          setCreateComponentOfType: { currentResponses: componentType },
        };
      },
    };

    stateVariableDefinitions.currentResponse = {
      isAlias: true,
      targetVariableName: "currentResponse1",
    };

    stateVariableDefinitions.numSubmittedResponses = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      hasEssential: true,
      defaultValue: 0,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          numSubmittedResponses: true,
        },
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "numSubmittedResponses",
              value: desiredStateVariableValues.numSubmittedResponses,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.submittedResponsesComponentType = {
      hasEssential: true,
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          submittedResponsesComponentType: true,
        },
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        if (desiredStateVariableValues.submittedResponsesComponentType) {
          return {
            success: true,
            instructions: [
              {
                setEssentialValue: "submittedResponsesComponentType",
                value: [
                  ...desiredStateVariableValues.submittedResponsesComponentType,
                ],
              },
            ],
          };
        } else {
          return {
            success: true,
            instructions: [
              {
                setEssentialValue: "submittedResponsesComponentType",
                value: [],
              },
            ],
          };
        }
      },
    };

    stateVariableDefinitions.submittedResponses = {
      public: true,
      shadowingInstructions: {
        hasVariableComponentType: true,
        addAttributeComponentsShadowingStateVariables: {
          displayDigits: {
            stateVariableToShadow: "displayDigitsForResponses",
          },
        },
      },
      isArray: true,
      allowExtraArrayKeysInInverse: true,
      entryPrefixes: ["submittedResponse"],
      defaultValueByArrayKey: () => "\uFF3F",
      hasEssential: true,
      inverseShadowToSetEntireArray: true,
      doNotCombineInverseArrayInstructions: true,
      returnArraySizeDependencies: () => ({
        numSubmittedResponses: {
          dependencyType: "stateVariable",
          variableName: "numSubmittedResponses",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numSubmittedResponses];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          submittedResponsesComponentType: {
            dependencyType: "stateVariable",
            variableName: "submittedResponsesComponentType",
          },
          numSubmittedResponses: {
            dependencyType: "stateVariable",
            variableName: "numSubmittedResponses",
          },
        };
        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        let componentType = [];

        if (globalDependencyValues.submittedResponsesComponentType) {
          componentType.push(
            ...globalDependencyValues.submittedResponsesComponentType.slice(
              0,
              globalDependencyValues.numSubmittedResponses,
            ),
          );
        }

        let essentialSubmittedResponses = {};

        for (
          let ind = 0;
          ind < globalDependencyValues.numSubmittedResponses;
          ind++
        ) {
          // this function doesn't change the values once they set for the first time
          // (The values will just be changed using the inverse function)
          essentialSubmittedResponses[ind] = true;

          if (!componentType[ind]) {
            componentType[ind] = "math";
          }
        }

        return {
          useEssentialOrDefaultValue: {
            submittedResponses: essentialSubmittedResponses,
          },
          setCreateComponentOfType: { submittedResponses: componentType },
        };
      },
      inverseArrayDefinitionByKey: function ({
        desiredStateVariableValues,
        initialChange,
      }) {
        if (!initialChange) {
          return { success: false };
        }

        return {
          success: true,
          instructions: [
            {
              setDependency: "numSubmittedResponses",
              desiredValue:
                desiredStateVariableValues.submittedResponses.length,
            },
            {
              setEssentialValue: "submittedResponses",
              value: [...desiredStateVariableValues.submittedResponses],
            },
          ],
        };
      },
    };

    stateVariableDefinitions.submittedResponse = {
      isAlias: true,
      targetVariableName: "submittedResponse1",
    };

    stateVariableDefinitions.suppressCheckwork = {
      forRenderer: true,
      returnDependencies: () => ({
        autoSubmit: {
          dependencyType: "flag",
          flagName: "autoSubmit",
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { suppressCheckwork: dependencyValues.autoSubmit } };
      },
    };

    stateVariableDefinitions.delegateCheckWork = {
      additionalStateVariablesDefined: [
        "delegateCheckWorkToInput",
        "delegateCheckWorkToAncestor",
      ],
      forRenderer: true,
      returnDependencies: () => ({
        inputChildren: {
          dependencyType: "stateVariable",
          variableName: "inputChildren",
        },
        forceFullCheckworkButton: {
          dependencyType: "stateVariable",
          variableName: "forceFullCheckworkButton",
        },
        sectionAncestor: {
          dependencyType: "ancestor",
          componentType: "_sectioningComponent",
          variableNames: ["suppressAnswerSubmitButtons"],
        },
        documentAncestor: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: ["suppressAnswerSubmitButtons"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let delegateCheckWorkToAncestor = false;
        let delegateCheckWorkToInput = false;
        let delegateCheckWork = false;

        if (
          dependencyValues.documentAncestor.stateValues
            .suppressAnswerSubmitButtons
        ) {
          delegateCheckWorkToAncestor = delegateCheckWork = true;
        } else if (
          dependencyValues.sectionAncestor?.stateValues
            .suppressAnswerSubmitButtons
        ) {
          delegateCheckWorkToAncestor = delegateCheckWork = true;
        } else if (
          dependencyValues.inputChildren.length === 1 &&
          !dependencyValues.forceFullCheckworkButton
        ) {
          delegateCheckWorkToInput = delegateCheckWork = true;
        }
        return {
          setValue: {
            delegateCheckWork,
            delegateCheckWorkToAncestor,
            delegateCheckWorkToInput,
          },
        };
      },
    };

    stateVariableDefinitions.creditAchievedIfSubmit = {
      additionalStateVariablesDefined: [
        "awardsUsedIfSubmit",
        "awardChildren",
        "inputUsedIfSubmit",
      ],
      stateVariablesDeterminingDependencies: ["inputChildIndices"],
      returnDependencies: ({ stateValues }) => ({
        awardChildren: {
          dependencyType: "child",
          childGroups: ["awards"],
          variableNames: [
            "credit",
            "creditAchievedIfSubmit",
            "fractionSatisfiedIfSubmit",
          ],
        },
        inputChildren: {
          dependencyType: "child",
          childGroups: ["inputs"],
          variableNames: ["creditAchievedIfSubmit", "value"], // include value so inputs always make dependency values change
          childIndices: stateValues.inputChildIndices,
          variablesOptional: true,
        },
        numAwardsCredited: {
          dependencyType: "stateVariable",
          variableName: "numAwardsCredited",
        },
      }),
      definition: function ({ dependencyValues }) {
        let creditAchieved = 0;

        let n = dependencyValues.numAwardsCredited;
        let awardsUsed = Array(n).fill(null);
        let inputUsed = null;

        if (dependencyValues.awardChildren.length === 0) {
          if (dependencyValues.inputChildren.length === 1) {
            let inputCredit =
              dependencyValues.inputChildren[0].stateValues
                .creditAchievedIfSubmit;
            // if input has a state variable creditAchievedIfSubmit
            // that is a non-negative number, use that value
            if (inputCredit >= 0) {
              creditAchieved = inputCredit;
              inputUsed = dependencyValues.inputChildren[0].componentName;
            }
          }
        } else {
          // awardsUsed will be component names of first awards
          // (up to numAwardsCredited)
          // that give the maximum credit (which will be creditAchieved)
          // Always process awards if haven't matched an award in case want to
          // use an award with credit=0 to trigger feedback
          let awardCredits = Array(n).fill(null);
          let minimumFromAwardCredits = 0;
          for (let child of dependencyValues.awardChildren) {
            let creditFromChild = child.stateValues.creditAchievedIfSubmit;
            if (
              creditFromChild > minimumFromAwardCredits ||
              awardsUsed[n - 1] === null
            ) {
              if (child.stateValues.fractionSatisfiedIfSubmit > 0) {
                if (awardsUsed[0] === null) {
                  awardsUsed[0] = child.componentName;
                  awardCredits[0] = creditFromChild;
                  minimumFromAwardCredits = Math.min(...awardCredits);
                } else {
                  for (let [ind, credit] of awardCredits.entries()) {
                    if (creditFromChild > credit || credit === null) {
                      awardsUsed.splice(ind, 0, child.componentName);
                      awardsUsed = awardsUsed.slice(0, n);
                      awardCredits.splice(ind, 0, creditFromChild);
                      awardCredits = awardCredits.slice(0, n);
                      minimumFromAwardCredits = Math.min(...awardCredits);
                      break;
                    }
                  }
                }
              }
            }
          }

          creditAchieved = Math.min(
            1,
            awardCredits.reduce((a, c) => a + c, 0),
          );
        }
        return {
          setValue: {
            creditAchievedIfSubmit: creditAchieved,
            awardsUsedIfSubmit: awardsUsed,
            awardChildren: dependencyValues.awardChildren,
            inputUsedIfSubmit: inputUsed,
          },
        };
      },
    };

    stateVariableDefinitions.displayDecimalsForCreditAchieved = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: { displayDecimalsForCreditAchieved: -Infinity },
      }),
    };

    stateVariableDefinitions.creditAchieved = {
      defaultValue: 0,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables: {
          displayDigits: {
            stateVariableToShadow: "displayDigitsForCreditAchieved",
          },
          displayDecimals: {
            stateVariableToShadow: "displayDecimalsForCreditAchieved",
          },
        },
      },
      forRenderer: true,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          creditAchieved: true,
        },
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "creditAchieved",
              value: desiredStateVariableValues.creditAchieved,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.responseHasBeenSubmitted = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      defaultValue: false,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          responseHasBeenSubmitted: true,
        },
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "responseHasBeenSubmitted",
              value: desiredStateVariableValues.responseHasBeenSubmitted,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.autoSubmit = {
      returnDependencies: () => ({
        autoSubmit: {
          dependencyType: "flag",
          flagName: "autoSubmit",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { autoSubmit: Boolean(dependencyValues.autoSubmit) },
        };
      },
    };

    stateVariableDefinitions.creditAchievedDependencies = {
      shadowVariable: true,
      stateVariablesDeterminingDependencies: ["autoSubmit"],
      returnDependencies: ({ stateValues }) => ({
        currentCreditAchievedDependencies: {
          dependencyType: "recursiveDependencyValues",
          variableNames: ["creditAchievedIfSubmit"],
          includeImmediateValueWithValue: !stateValues.autoSubmit,
          includeRawValueWithImmediateValue: !stateValues.autoSubmit,
          includeOnlyEssentialValues: true,
        },
      }),
      definition({ dependencyValues }) {
        // Use stringify from json-stringify-deterministic
        // so that the string will be the same
        // even if the object was built in a different order
        // (as can happen when reloading from a database)

        let stringified = stringify(
          dependencyValues.currentCreditAchievedDependencies,
          { replacer: serializedComponentsReplacer },
        );
        return {
          setValue: {
            creditAchievedDependencies: Base64.stringify(sha1(stringified)),
          },
        };
      },
      markStale: () => ({ answerCreditPotentiallyChanged: true }),
    };

    stateVariableDefinitions.creditAchievedDependenciesAtSubmit = {
      defaultValue: null,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          creditAchievedDependenciesAtSubmit: true,
        },
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "creditAchievedDependenciesAtSubmit",
              value:
                desiredStateVariableValues.creditAchievedDependenciesAtSubmit,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.justSubmitted = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      forRenderer: true,
      defaultValue: false,
      hasEssential: true,
      shadowVariable: true,
      returnDependencies: () => ({
        currentCreditAchievedDependencies: {
          dependencyType: "stateVariable",
          variableName: "creditAchievedDependencies",
        },
        creditAchievedDependenciesAtSubmit: {
          dependencyType: "stateVariable",
          variableName: "creditAchievedDependenciesAtSubmit",
        },
        disableAfterCorrect: {
          dependencyType: "stateVariable",
          variableName: "disableAfterCorrect",
        },
        hasBeenCorrect: {
          dependencyType: "stateVariable",
          variableName: "hasBeenCorrect",
        },
      }),
      definition: function ({
        dependencyValues,
        justUpdatedForNewComponent,
        componentName,
      }) {
        if (
          dependencyValues.disableAfterCorrect &&
          dependencyValues.hasBeenCorrect
        ) {
          return {
            setValue: { justSubmitted: true },
          };
        }

        let foundChange =
          dependencyValues.creditAchievedDependenciesAtSubmit !==
          dependencyValues.currentCreditAchievedDependencies;

        if (foundChange && !justUpdatedForNewComponent) {
          return {
            setValue: { justSubmitted: false },
            setEssentialValue: { justSubmitted: false },
          };
        } else {
          return {
            useEssentialOrDefaultValue: { justSubmitted: true },
          };
        }
      },
      inverseDefinition({ desiredStateVariableValues, componentName }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "justSubmitted",
              value: desiredStateVariableValues.justSubmitted,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.allFeedbacks = {
      returnDependencies: () => ({
        awardChildren: {
          dependencyType: "child",
          childGroups: ["awards"],
          variableNames: ["feedbacks"],
        },
        feedbackComponents: {
          dependencyType: "descendant",
          componentTypes: ["_input"],
          variableNames: ["feedbacks"],
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        let feedbacks = [];

        for (let award of dependencyValues.awardChildren) {
          feedbacks.push(...award.stateValues.feedbacks);
        }
        for (let feedbackComponent of dependencyValues.feedbackComponents) {
          if (Array.isArray(feedbackComponent.stateValues.feedbacks)) {
            feedbacks.push(...feedbackComponent.stateValues.feedbacks);
          }
        }
        return {
          setValue: {
            allFeedbacks: feedbacks,
          },
        };
      },
    };

    stateVariableDefinitions.numFeedbacks = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        allFeedbacks: {
          dependencyType: "stateVariable",
          variableName: "allFeedbacks",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { numFeedbacks: dependencyValues.allFeedbacks.length },
          checkForActualChange: { numFeedbacks: true },
        };
      },
    };

    stateVariableDefinitions.feedbacks = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "feedback",
      },
      isArray: true,
      entryPrefixes: ["feedback"],
      returnArraySizeDependencies: () => ({
        numFeedbacks: {
          dependencyType: "stateVariable",
          variableName: "numFeedbacks",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numFeedbacks];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allFeedbacks: {
            dependencyType: "stateVariable",
            variableName: "allFeedbacks",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // console.log(`array definition by key of function feedbacks`)
        // console.log(globalDependencyValues)

        let feedbacks = {};

        for (
          let arrayKey = 0;
          arrayKey < globalDependencyValues.__array_size;
          arrayKey++
        ) {
          feedbacks[arrayKey] = globalDependencyValues.allFeedbacks[arrayKey];
        }

        return { setValue: { feedbacks } };
      },
    };

    stateVariableDefinitions.numSubmissions = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      defaultValue: 0,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          numSubmissions: true,
        },
      }),
      inverseDefinition: ({ desiredStateVariableValues }) => ({
        success: true,
        instructions: [
          {
            setEssentialValue: "numSubmissions",
            value: desiredStateVariableValues.numSubmissions,
          },
        ],
      }),
    };

    stateVariableDefinitions.numAttemptsLeft = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      forRenderer: true,
      returnDependencies: () => ({
        numSubmissions: {
          dependencyType: "stateVariable",
          variableName: "numSubmissions",
        },
        maxNumAttempts: {
          dependencyType: "stateVariable",
          variableName: "maxNumAttempts",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            numAttemptsLeft:
              dependencyValues.maxNumAttempts - dependencyValues.numSubmissions,
          },
        };
      },
    };

    stateVariableDefinitions.hasBeenCorrect = {
      defaultValue: false,
      hasEssential: true,
      shadowVariable: true,
      returnDependencies: () => ({
        creditAchieved: {
          dependencyType: "stateVariable",
          variableName: "creditAchieved",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.creditAchieved === 1) {
          return {
            setValue: { hasBeenCorrect: true },
            setEssentialValue: { hasBeenCorrect: true },
          };
        }

        return {
          useEssentialOrDefaultValue: {
            hasBeenCorrect: true,
          },
        };
      },
    };

    stateVariableDefinitions.disabled = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["disableAfterCorrect"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          disabledOriginal: {
            dependencyType: "stateVariable",
            variableName: "disabledOriginal",
          },
          numAttemptsLeft: {
            dependencyType: "stateVariable",
            variableName: "numAttemptsLeft",
          },
          disableAfterCorrect: {
            dependencyType: "stateVariable",
            variableName: "disableAfterCorrect",
          },
        };

        if (stateValues.disableAfterCorrect) {
          dependencies.hasBeenCorrect = {
            dependencyType: "stateVariable",
            variableName: "hasBeenCorrect",
          };
        }

        return dependencies;
      },
      definition({ dependencyValues }) {
        let disabled =
          dependencyValues.disabledOriginal ||
          dependencyValues.numAttemptsLeft < 1 ||
          (dependencyValues.disableAfterCorrect &&
            dependencyValues.hasBeenCorrect);

        return { setValue: { disabled } };
      },
    };

    stateVariableDefinitions.inItemNumber = {
      returnDependencies: () => ({
        documentAncestor: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: ["itemNumberByAnswerName"],
        },
      }),
      definition({ dependencyValues, componentName }) {
        return {
          setValue: {
            inItemNumber:
              dependencyValues.documentAncestor.stateValues
                .itemNumberByAnswerName[componentName],
          },
        };
      },
    };

    return stateVariableDefinitions;
  }

  async submitAnswer({
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let numAttemptsLeft = await this.stateValues.numAttemptsLeft;
    if (numAttemptsLeft < 1) {
      return;
    }

    let creditAchieved = await this.stateValues.creditAchievedIfSubmit;
    if (await this.stateValues.handGraded) {
      creditAchieved = 0;
    }
    let awardsUsed = await this.stateValues.awardsUsedIfSubmit;
    let inputUsed = await this.stateValues.inputUsedIfSubmit;

    // request to update credit
    let instructions = [
      {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "creditAchieved",
        value: creditAchieved,
      },
      {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "responseHasBeenSubmitted",
        value: true,
      },
    ];

    let inputChildrenWithValues = await this.stateValues
      .inputChildrenWithValues;

    if (inputChildrenWithValues.length === 1) {
      // if have a single input descendant,
      // then will record the current value

      let inputChild = inputChildrenWithValues[0];

      if (
        inputUsed === inputChild.componentName &&
        "valueToRecordOnSubmit" in inputChild.stateValues &&
        "valueRecordedAtSubmit" in inputChild.stateValues
      ) {
        instructions.push({
          updateType: "updateValue",
          componentName: inputChild.componentName,
          stateVariable: "valueRecordedAtSubmit",
          value: inputChild.stateValues.valueToRecordOnSubmit,
        });
      }
    }

    // add submitted responses to instruction for answer
    let currentResponses = await this.stateValues.currentResponses;
    // let currentResponses = await this.state.currentResponses.value;

    instructions.push({
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "submittedResponses",
      value: currentResponses,
    });

    instructions.push({
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "submittedResponsesComponentType",
      value:
        this.state.currentResponses.shadowingInstructions.createComponentOfType,
    });

    instructions.push({
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "justSubmitted",
      value: true,
    });

    instructions.push({
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "creditAchievedDependenciesAtSubmit",
      value: await this.stateValues.creditAchievedDependencies,
    });

    instructions.push({
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "numSubmissions",
      value: (await this.stateValues.numSubmissions) + 1,
    });

    for (let child of await this.stateValues.awardChildren) {
      let awarded = awardsUsed.includes(child.componentName);
      instructions.push({
        updateType: "updateValue",
        componentName: child.componentName,
        stateVariable: "awarded",
        value: awarded,
      });
      instructions.push({
        updateType: "updateValue",
        componentName: child.componentName,
        stateVariable: "creditAchieved",
        value: child.stateValues.creditAchievedIfSubmit,
      });
      instructions.push({
        updateType: "updateValue",
        componentName: child.componentName,
        stateVariable: "fractionSatisfied",
        value: child.stateValues.fractionSatisfiedIfSubmit,
      });
    }

    let responseText = [];
    for (let response of currentResponses) {
      if (response.toString) {
        try {
          responseText.push(response.toString());
        } catch (e) {
          responseText.push("\uff3f");
        }
      } else {
        responseText.push(response);
      }
    }

    instructions.push({
      updateType: "recordItemSubmission",
      itemNumber: await this.stateValues.inItemNumber,
      submittedComponent: this.componentName,
      response: currentResponses,
      responseText,
      creditAchieved,
    });

    // console.log(`submit instructions`)
    // console.log(instructions);

    await this.coreFunctions.performUpdate({
      updateInstructions: instructions,
      actionId,
      sourceInformation,
      skipRendererUpdate: true,
      event: {
        verb: "submitted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: currentResponses,
          responseText,
          creditAchieved,
        },
      },
      suppressToast: await this.stateValues.suppressToast, // temporary
    });

    return await this.coreFunctions.triggerChainedActions({
      componentName: this.componentName,
      actionId,
      sourceInformation,
      skipRendererUpdate,
    });
  }
}
