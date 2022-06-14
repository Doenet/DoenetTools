import InlineComponent from './abstract/InlineComponent.js';
import { deepCompare } from '../utils/deepFunctions.js';
import { renameStateVariable } from '../utils/stateVariables.js';
import { serializedComponentsReplacer, serializedComponentsReviver } from '../utils/serializedStateProcessing.js';
import sha1 from '../../_snowpack/pkg/crypto-js/sha1.js';
import Base64 from '../../_snowpack/pkg/crypto-js/enc-base64.js';
import stringify from '../../_snowpack/pkg/json-stringify-deterministic.js';

export default class Answer extends InlineComponent {
  static componentType = "answer";

  static renderChildren = true;

  static variableForPlainMacro = "submittedResponses";


  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.weight = {
      createComponentOfType: "number",
      createStateVariable: "weight",
      defaultValue: 1,
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
      valueTransformations: { "": "full", "true": "full" },
      validValues: ["none", "full", "numbers", "numbersepreserveorder"],
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
    attributes.nAwardsCredited = {
      createComponentOfType: "integer",
      createStateVariable: "nAwardsCredited",
      defaultValue: 1,
      public: true,
    }
    attributes.maximumNumberOfAttempts = {
      createComponentOfType: "integer",
      createStateVariable: "maximumNumberOfAttempts",
      defaultValue: Infinity,
      public: true,
    }
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
    attributes.nSignErrorsMatched = {
      createComponentOfType: "number",
      createStateVariable: "nSignErrorsMatched",
      defaultValue: 0,
      public: true,
    };
    attributes.nPeriodicSetMatchesRequired = {
      createComponentOfType: "integer",
      createStateVariable: "nPeriodicSetMatchesRequired",
      defaultValue: 3,
      public: true,
    };
    attributes.showCorrectness = {
      createComponentOfType: "boolean",
      createStateVariable: "showCorrectnessPreliminary",
      defaultValue: null,
    }
    attributes.type = {
      createPrimitiveOfType: "string"
    }

    attributes.disableAfterCorrect = {
      createComponentOfType: "boolean",
      createStateVariable: "disableAfterCorrect",
      defaultValue: false,
      public: true,
    }

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let replaceStringsAndMacros = function ({ matchedChildren, componentAttributes }) {
      // if chidren are strings and macros
      // wrap with award and type

      if (!matchedChildren.every(child =>
        typeof child === "string" ||
        child.doenetAttributes && child.doenetAttributes.createdFromMacro
      )) {
        return { success: false }
      }


      let type;
      if (componentAttributes.type) {
        type = componentAttributes.type
      } else {
        type = "math";
      }

      if (!["math", "text", "boolean"].includes(type)) {
        console.warn(`Invalid type ${type}`);
        type = "math";
      }

      let award = {
        componentType: "award",
        children: [{
          componentType: type,
          children: matchedChildren
        }]
      };

      return {
        success: true,
        newChildren: [award],
      }
    }

    sugarInstructions.push({
      replacementFunction: replaceStringsAndMacros
    })


    function addInputIfMightNeedIt({ matchedChildren, componentAttributes, componentInfoObjects }) {

      let mightNeedNewInput = false;

      for (let child of matchedChildren) {
        if (componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: child.componentType,
          baseComponentType: "_input"
        })) {
          return { success: false }
        }

        if (componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: child.componentType,
          baseComponentType: "considerAsResponses"
        })) {
          return { success: false }
        }

        if (componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: child.componentType,
          baseComponentType: "_composite"
        })) {
          mightNeedNewInput = true;
        } else if (componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: child.componentType,
          baseComponentType: "award"
        })) {
          // if have an award without a when child, might need an input
          if (child.children && !child.children.some(x =>
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: x.componentType,
              baseComponentType: "when"
            })
          )) {
            mightNeedNewInput = true;
          }
        }
      }

      if (!mightNeedNewInput) {
        return { success: false };
      }

      // if might need an input,
      // and haven't found an input or considerAsResponses child,
      // then add an input based on the type attribute

      let type;
      if (componentAttributes.type) {
        type = componentAttributes.type
      } else {
        type = "math";
      }

      if (!["math", "text", "boolean"].includes(type)) {
        console.warn(`Invalid type ${type}`);
        type = "math";
      }

      let inputType = type + "Input";

      let newChildren = [{ componentType: inputType }, ...matchedChildren];

      return {
        success: true,
        newChildren
      }
    }


    sugarInstructions.push({
      replacementFunction: addInputIfMightNeedIt
    })

    return sugarInstructions;

  }

  static returnChildGroups() {

    return [{
      group: "awards",
      componentTypes: ["award"]
    }, {
      group: "numbers",
      componentTypes: ["number"]
    }, {
      group: "inputs",
      componentTypes: ["_input"]
    }, {
      group: "responses",
      componentTypes: ["considerAsResponses"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // rename disabled to disabledOriginal
    renameStateVariable({
      stateVariableDefinitions,
      oldName: "disabled",
      newName: "disabledOriginal"
    });

    stateVariableDefinitions.showCorrectness = {
      forRenderer: true,
      returnDependencies: () => ({
        showCorrectnessPreliminary: {
          dependencyType: "stateVariable",
          variableName: "showCorrectnessPreliminary"
        },
        showCorrectnessFlag: {
          dependencyType: "flag",
          flagName: "showCorrectness"
        }
      }),
      definition({ dependencyValues, usedDefault }) {
        let showCorrectness;
        if (!usedDefault.showCorrectnessPreliminary) {
          showCorrectness = dependencyValues.showCorrectnessPreliminary
        } else {
          showCorrectness = dependencyValues.showCorrectnessFlag !== false;
        }
        return { setValue: { showCorrectness } }
      }
    }

    stateVariableDefinitions.haveAwardThatRequiresInput = {
      returnDependencies: () => ({
        awardChildren: {
          dependencyType: "child",
          childGroups: ["awards"],
          variableNames: ["requireInputInAnswer"]
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            haveAwardThatRequiresInput:
              dependencyValues.awardChildren.some(x => x.stateValues.requireInputInAnswer)
          }
        }
      }
    }

    stateVariableDefinitions.allInputChildrenIncludingSugared = {
      returnDependencies: () => ({
        allInputChildrenIncludingSugared: {
          dependencyType: "child",
          childGroups: ["inputs"],
        }
      }),
      definition({ dependencyValues }) {
        return { setValue: { allInputChildrenIncludingSugared: dependencyValues.allInputChildrenIncludingSugared } }
      }
    }


    stateVariableDefinitions.inputChildren = {
      stateVariablesDeterminingDependencies: ["allInputChildrenIncludingSugared"],
      additionalStateVariablesDefined: ["inputChildIndices", "skippedFirstInput"],
      forRenderer: true,
      returnDependencies({ stateValues }) {
        let dependencies = {
          allInputChildrenIncludingSugared: {
            dependencyType: "stateVariable",
            variableName: "allInputChildrenIncludingSugared"
          },
          haveAwardThatRequiresInput: {
            dependencyType: "stateVariable",
            variableName: "haveAwardThatRequiresInput"
          }
        };

        if (stateValues.allInputChildrenIncludingSugared.length > 0) {
          dependencies.firstInputFromSugar = {
            dependencyType: "doenetAttribute",
            componentName: stateValues.allInputChildrenIncludingSugared[0].componentName,
            attributeName: "createdFromSugar"
          }
        }

        return dependencies;

      },
      definition({ dependencyValues }) {

        // if have award the requires input,
        // use the input child from sugar if none other exists


        let inputChildren = [...dependencyValues.allInputChildrenIncludingSugared];
        let inputChildIndices = [...dependencyValues.allInputChildrenIncludingSugared.keys()];
        let skippedFirstInput = false;


        let skipFirstSugaredInput = !dependencyValues.haveAwardThatRequiresInput
          || dependencyValues.allInputChildrenIncludingSugared.length > 1;


        if (skipFirstSugaredInput && dependencyValues.firstInputFromSugar) {
          skippedFirstInput = true;
          inputChildren = inputChildren.slice(1);
          inputChildIndices = inputChildIndices.slice(1);
        }


        return { setValue: { inputChildren, inputChildIndices, skippedFirstInput } };
      }
    }

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
            "immediateValue"
          ],
          childIndices: stateValues.inputChildIndices,
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { inputChildrenWithValues: dependencyValues.inputChildren } }
      }
    }

    // for award children to find the one input child
    stateVariableDefinitions.inputChildWithValues = {
      returnDependencies: () => ({
        inputChildrenWithValues: {
          dependencyType: "stateVariable",
          variableName: "inputChildrenWithValues"
        }
      }),
      definition({ dependencyValues }) {
        let inputChildWithValues = null;
        if (dependencyValues.inputChildrenWithValues.length === 1) {
          inputChildWithValues = dependencyValues.inputChildrenWithValues[0];
        }
        return { setValue: { inputChildWithValues } };
      }
    }

    stateVariableDefinitions.awardInputResponseChildren = {
      returnDependencies: () => ({
        awardInputResponseChildren: {
          dependencyType: "child",
          childGroups: ["awards", "inputs", "responses"],
        },
        skippedFirstInput: {
          dependencyType: "stateVariable",
          variableName: "skippedFirstInput"
        }
      }),
      definition({ dependencyValues }) {
        let awardInputResponseChildren = [...dependencyValues.awardInputResponseChildren];
        if (dependencyValues.skippedFirstInput) {
          awardInputResponseChildren = awardInputResponseChildren.slice(1);
        }
        return {
          setValue: { awardInputResponseChildren }
        }
      }
    }

    stateVariableDefinitions.nResponses = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      stateVariablesDeterminingDependencies: ["awardInputResponseChildren"],
      returnDependencies({ stateValues, componentInfoObjects }) {
        let dependencies = {
          childTypes: {
            dependencyType: "value",
            value: stateValues.awardInputResponseChildren.map(x => x.componentType)
          }
        };

        for (let [ind, child] of stateValues.awardInputResponseChildren.entries()) {
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "award"
          })) {
            dependencies['child' + ind] = {
              dependencyType: "descendant",
              ancestorName: child.componentName,
              componentTypes: ["_base"],
              variableNames: ["isResponse", "nValues"],
              variablesOptional: true,
              recurseToMatchedChildren: true,
              includeNonActiveChildren: true,
              skipOverAdapters: true,
            }

          } else if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "_input"
          })) {
            dependencies['childNValues' + ind] = {
              dependencyType: "stateVariable",
              componentName: child.componentName,
              variableName: "nValues",
              variablesOptional: true,
            }
          } else {
            // considerAsResponses
            dependencies['child' + ind] = {
              dependencyType: "stateVariable",
              componentName: child.componentName,
              variableName: "childrenWithNValues"
            }
          }
        }

        return dependencies;
      },
      definition({ dependencyValues, componentInfoObjects }) {

        let nResponses = 0;

        for (let [ind, childType] of dependencyValues.childTypes.entries()) {
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: childType,
            baseComponentType: "award"
          })) {
            for (let descendant of dependencyValues["child" + ind]) {
              if (!descendant.stateValues.isResponse ||
                componentInfoObjects.isInheritedComponentType({
                  inheritedComponentType: descendant.componentType,
                  baseComponentType: "_composite"
                })
              ) {
                continue;
              }

              if (descendant.stateValues.nValues === undefined) {
                nResponses += 1;
              } else {
                nResponses += descendant.stateValues.nValues;
              }
            }

          } else if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: childType,
            baseComponentType: "_input"
          })) {
            let nValues = dependencyValues["childNValues" + ind];
            if (nValues === undefined) {
              nResponses += 1;
            } else {
              nResponses += nValues;
            }

          } else {
            // considerAsResponses

            for (let child of dependencyValues["child" + ind]) {
              if (child.stateValues.nValues === undefined) {
                nResponses += 1;
              } else {
                nResponses += child.stateValues.nValues;
              }
            }
          }
        }

        return { setValue: { nResponses } }

      }
    }

    stateVariableDefinitions.currentResponses = {
      public: true,
      shadowingInstructions: {
        hasVariableComponentType: true,
      },
      isArray: true,
      entryPrefixes: ["currentResponse"],
      stateVariablesDeterminingDependencies: ["awardInputResponseChildren"],
      returnArraySizeDependencies: () => ({
        nResponses: {
          dependencyType: "stateVariable",
          variableName: "nResponses",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nResponses];
      },
      returnArrayDependenciesByKey({ stateValues, componentInfoObjects }) {
        let globalDependencies = {
          childTypes: {
            dependencyType: "value",
            value: stateValues.awardInputResponseChildren.map(x => x.componentType)
          }
        };

        for (let [ind, child] of stateValues.awardInputResponseChildren.entries()) {
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "award"
          })) {
            globalDependencies['child' + ind] = {
              dependencyType: "descendant",
              ancestorName: child.componentName,
              componentTypes: ["_base"],
              variableNames: ["isResponse", "value", "values", "componentType"],
              variablesOptional: true,
              recurseToMatchedChildren: true,
              includeAttributeChildren: true,
              includeNonActiveChildren: true,
              skipOverAdapters: true,
            }

          } else if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "_input"
          })) {
            globalDependencies['childValue' + ind] = {
              dependencyType: "stateVariable",
              componentName: child.componentName,
              variableName: "value",
              variablesOptional: true,
            }
            globalDependencies['childValues' + ind] = {
              dependencyType: "stateVariable",
              componentName: child.componentName,
              variableName: "values",
              variablesOptional: true,
            }
            globalDependencies['childComponentType' + ind] = {
              dependencyType: "stateVariable",
              componentName: child.componentName,
              variableName: "componentType",
              variablesOptional: true,
            }
          } else {
            // considerAsResponses
            globalDependencies['child' + ind] = {
              dependencyType: "stateVariable",
              componentName: child.componentName,
              variableName: "childrenAsResponses"
            }
          }
        }

        return { globalDependencies };

      },
      arrayDefinitionByKey({ globalDependencyValues, componentInfoObjects }) {

        let currentResponses = [];
        let componentType = [];


        let responseComponents = [];

        for (let [ind, childType] of globalDependencyValues.childTypes.entries()) {
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: childType,
            baseComponentType: "award"
          })) {
            for (let descendant of globalDependencyValues["child" + ind]) {
              if (!descendant.stateValues.isResponse ||
                componentInfoObjects.isInheritedComponentType({
                  inheritedComponentType: descendant.componentType,
                  baseComponentType: "_composite"
                })
              ) {
                continue;
              }

              responseComponents.push(descendant);
            }

          } else if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: childType,
            baseComponentType: "_input"
          })) {

            // reconstruct child in same way as for other components
            let child = {
              componentType: childType,
              stateValues: {
                value: globalDependencyValues["childValue" + ind],
                values: globalDependencyValues["childValues" + ind],
                componentType: globalDependencyValues["childComponentType" + ind]
              }
            }

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
            ct = "booelan;"
          }

          if (Array.isArray(component.stateValues.values)) {
            currentResponses.push(...component.stateValues.values)
            componentType.push(...Array(component.stateValues.values.length)
              .fill(ct));
          } else {
            currentResponses.push(component.stateValues.value)
            componentType.push(ct)
          }
        }

        return {
          setValue: { currentResponses },
          setCreateComponentOfType: { currentResponses: componentType },
        }
      }
    }


    stateVariableDefinitions.currentResponse = {
      isAlias: true,
      targetVariableName: "currentResponse1"
    };


    stateVariableDefinitions.nSubmittedResponses = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      hasEssential: true,
      defaultValue: 0,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          nSubmittedResponses: true
        }
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "nSubmittedResponses",
            value: desiredStateVariableValues.nSubmittedResponses
          }]
        }
      }
    }

    stateVariableDefinitions.submittedResponsesComponentType = {
      hasEssential: true,
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          submittedResponsesComponentType: true
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        if (desiredStateVariableValues.submittedResponsesComponentType) {
          return {
            success: true,
            instructions: [{
              setEssentialValue: "submittedResponsesComponentType",
              value: [...desiredStateVariableValues.submittedResponsesComponentType]
            }]
          };
        } else {
          return {
            success: true,
            instructions: [{
              setEssentialValue: "submittedResponsesComponentType",
              value: []
            }]
          };
        }
      }
    }

    stateVariableDefinitions.submittedResponses = {
      public: true,
      shadowingInstructions: {
        hasVariableComponentType: true,
      },
      isArray: true,
      entryPrefixes: ["submittedResponse"],
      defaultValueByArrayKey: () => '\uFF3F',
      hasEssential: true,
      inverseShadowToSetEntireArray: true,
      doNotCombineInverseArrayInstructions: true,
      returnArraySizeDependencies: () => ({
        nSubmittedResponses: {
          dependencyType: "stateVariable",
          variableName: "nSubmittedResponses",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nSubmittedResponses];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          submittedResponsesComponentType: {
            dependencyType: "stateVariable",
            variableName: "submittedResponsesComponentType"
          },
          nSubmittedResponses: {
            dependencyType: "stateVariable",
            variableName: "nSubmittedResponses"
          },
        }
        return { globalDependencies }
      },
      arrayDefinitionByKey({ globalDependencyValues }) {

        let componentType = [];

        if (globalDependencyValues.submittedResponsesComponentType) {
          componentType.push(...globalDependencyValues.submittedResponsesComponentType.slice(0, globalDependencyValues.nSubmittedResponses))
        }

        let essentialSubmittedResponses = {};

        for (let ind = 0; ind < globalDependencyValues.nSubmittedResponses; ind++) {

          // this function doesn't change the values once they set for the first time
          // (The values will just be changed using the inverse function)
          essentialSubmittedResponses[ind] = true

          if (!componentType[ind]) {
            componentType[ind] = "math"
          }

        }


        return {
          useEssentialOrDefaultValue: {
            submittedResponses: essentialSubmittedResponses,
          },
          setCreateComponentOfType: { submittedResponses: componentType },
        }
      },
      inverseArrayDefinitionByKey: function ({ desiredStateVariableValues, initialChange }) {
        if (!initialChange) {
          return { success: false };
        }

        return {
          success: true,
          instructions: [{
            setDependency: "nSubmittedResponses",
            desiredValue: desiredStateVariableValues.submittedResponses.length
          },
          {
            setEssentialValue: "submittedResponses",
            value: [...desiredStateVariableValues.submittedResponses]
          }
          ]
        };
      }
    }

    stateVariableDefinitions.submittedResponse = {
      isAlias: true,
      targetVariableName: "submittedResponse1"
    };

    stateVariableDefinitions.delegateCheckWork = {
      additionalStateVariablesDefined:
        [
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
          variableName: "forceFullCheckworkButton"
        },
        sectionAncestor: {
          dependencyType: "ancestor",
          componentType: "_sectioningComponent",
          variableNames: [
            "suppressAnswerSubmitButtons",
          ]
        },
        documentAncestor: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: [
            "suppressAnswerSubmitButtons",
          ]
        }
      }),
      definition: function ({ dependencyValues, componentName }) {
        let delegateCheckWorkToAncestor = false;
        let delegateCheckWorkToInput = false;
        let delegateCheckWork = false;

        if (dependencyValues.documentAncestor.stateValues.suppressAnswerSubmitButtons) {
          delegateCheckWorkToAncestor = delegateCheckWork = true;
        } else if (dependencyValues.sectionAncestor) {
          let ancestorState = dependencyValues.sectionAncestor.stateValues;
          if (ancestorState.suppressAnswerSubmitButtons) {
            delegateCheckWorkToAncestor = delegateCheckWork = true;
          }
        }

        if (!delegateCheckWorkToAncestor && dependencyValues.inputChildren.length === 1 &&
          !dependencyValues.forceFullCheckworkButton
        ) {
          delegateCheckWorkToInput = delegateCheckWork = true;
        }
        return {
          setValue: {
            delegateCheckWork, delegateCheckWorkToAncestor,
            delegateCheckWorkToInput
          }
        };
      }
    }

    stateVariableDefinitions.creditAchievedIfSubmit = {
      additionalStateVariablesDefined: ["awardsUsedIfSubmit", "awardChildren",
        "inputUsedIfSubmit"],
      stateVariablesDeterminingDependencies: ["inputChildIndices"],
      returnDependencies: ({ stateValues }) => ({
        awardChildren: {
          dependencyType: "child",
          childGroups: ["awards"],
          variableNames: ["credit", "creditAchievedIfSubmit", "fractionSatisfiedIfSubmit"]
        },
        inputChildren: {
          dependencyType: "child",
          childGroups: ["inputs"],
          variableNames: ["creditAchievedIfSubmit"],
          childIndices: stateValues.inputChildIndices,
          variablesOptional: true,
        },
        nAwardsCredited: {
          dependencyType: "stateVariable",
          variableName: "nAwardsCredited",
        },
      }),
      definition: function ({ dependencyValues }) {

        let creditAchieved = 0;

        let n = dependencyValues.nAwardsCredited;
        let awardsUsed = Array(n).fill(null);
        let inputUsed = null;

        if (dependencyValues.awardChildren.length === 0) {
          if (dependencyValues.inputChildren.length === 1) {
            let inputCredit = dependencyValues.inputChildren[0].stateValues.creditAchievedIfSubmit;
            // if input has a state variable creditAchievedIfSubmit
            // that is a non-negative number, use that value
            if (inputCredit >= 0) {
              creditAchieved = inputCredit;
              inputUsed = dependencyValues.inputChildren[0].componentName;
            }
          }
        } else {
          // awardsUsed will be component names of first awards
          // (up to nAwardsCredited)
          // that give the maximum credit (which will be creditAchieved)
          // Always process awards if haven't matched an award in case want to
          // use an award with credit=0 to trigger feedback
          let awardCredits = Array(n).fill(null);
          let minimumFromAwardCredits = 0;
          for (let child of dependencyValues.awardChildren) {
            let creditFromChild = child.stateValues.creditAchievedIfSubmit;
            if (creditFromChild > minimumFromAwardCredits || awardsUsed[n - 1] === null) {
              if (child.stateValues.fractionSatisfiedIfSubmit > 0) {
                if (awardsUsed[0] === null) {
                  awardsUsed[0] = child.componentName;
                  awardCredits[0] = creditFromChild;
                  minimumFromAwardCredits = Math.min(...awardCredits);
                } else {
                  for (let [ind, credit] of awardCredits.entries()) {
                    if (creditFromChild > credit || credit === null) {
                      awardsUsed.splice(ind, 0, child.componentName);
                      awardsUsed = awardsUsed.slice(0, n)
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

          creditAchieved = Math.min(1, awardCredits.reduce((a, c) => a + c, 0));

        }
        return {
          setValue: {
            creditAchievedIfSubmit: creditAchieved,
            awardsUsedIfSubmit: awardsUsed,
            awardChildren: dependencyValues.awardChildren,
            inputUsedIfSubmit: inputUsed,
          }
        }
      }
    }

    stateVariableDefinitions.creditAchieved = {
      defaultValue: 0,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      forRenderer: true,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          creditAchieved: true
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "creditAchieved",
            value: desiredStateVariableValues.creditAchieved
          }]
        };
      }
    }

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
          responseHasBeenSubmitted: true
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "responseHasBeenSubmitted",
            value: desiredStateVariableValues.responseHasBeenSubmitted
          }]
        };
      }
    }


    stateVariableDefinitions.creditAchievedDependencies = {
      shadowVariable: true,
      returnDependencies: () => ({
        currentCreditAchievedDependencies: {
          dependencyType: "recursiveDependencyValues",
          variableNames: ["creditAchievedIfSubmit"],
          includeImmediateValueWithValue: true,
          includeRawValueWithImmediateValue: true,
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
          { replacer: serializedComponentsReplacer }
        );
        return {
          setValue: {
            creditAchievedDependencies: Base64.stringify(sha1(stringified))
          }
        }
      },
    }


    stateVariableDefinitions.creditAchievedDependenciesAtSubmit = {
      defaultValue: null,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          creditAchievedDependenciesAtSubmit: true
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "creditAchievedDependenciesAtSubmit",
            value: desiredStateVariableValues.creditAchievedDependenciesAtSubmit
          }]
        };
      }
    }


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
          variableName: "creditAchievedDependenciesAtSubmit"
        },
        disableAfterCorrect: {
          dependencyType: "stateVariable",
          variableName: "disableAfterCorrect"
        },
        hasBeenCorrect: {
          dependencyType: "stateVariable",
          variableName: "hasBeenCorrect"
        }

      }),
      definition: function ({ dependencyValues, justUpdatedForNewComponent, componentName }) {

        if (dependencyValues.disableAfterCorrect && dependencyValues.hasBeenCorrect) {
          return {
            setValue: { justSubmitted: true }
          }
        }

        let foundChange = dependencyValues.creditAchievedDependenciesAtSubmit
          !== dependencyValues.currentCreditAchievedDependencies;

        if (foundChange && !justUpdatedForNewComponent) {
          return {
            setValue: { justSubmitted: false },
            setEssentialValue: { justSubmitted: false },
          }
        } else {
          return {
            useEssentialOrDefaultValue: { justSubmitted: true }
          }
        }

      },
      inverseDefinition({ desiredStateVariableValues, componentName }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "justSubmitted",
            value: desiredStateVariableValues.justSubmitted
          }]
        }
      }
    }


    stateVariableDefinitions.allFeedbacks = {
      returnDependencies: () => ({
        awardChildren: {
          dependencyType: "child",
          childGroups: ["awards"],
          variableNames: ["feedbacks"]
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
            feedbacks.push(...feedbackComponent.stateValues.feedbacks)
          }
        }
        return {
          setValue: {
            allFeedbacks: feedbacks
          }
        }
      }
    }

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

    stateVariableDefinitions.nSubmissions = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      defaultValue: 0,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          nSubmissions: true
        }
      }),
      inverseDefinition: ({ desiredStateVariableValues }) => ({
        success: true,
        instructions: [{
          setEssentialValue: "nSubmissions",
          value: desiredStateVariableValues.nSubmissions
        }]
      })
    }

    stateVariableDefinitions.numberOfAttemptsLeft = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      forRenderer: true,
      returnDependencies: () => ({
        nSubmissions: {
          dependencyType: "stateVariable",
          variableName: "nSubmissions"
        },
        maximumNumberOfAttempts: {
          dependencyType: "stateVariable",
          variableName: "maximumNumberOfAttempts"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            numberOfAttemptsLeft: dependencyValues.maximumNumberOfAttempts
              - dependencyValues.nSubmissions
          }
        }
      }
    }

    stateVariableDefinitions.hasBeenCorrect = {
      defaultValue: false,
      hasEssential: true,
      shadowVariable: true,
      returnDependencies: () => ({
        creditAchieved: {
          dependencyType: "stateVariable",
          variableName: "creditAchieved"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.creditAchieved === 1) {
          return {
            setValue: { hasBeenCorrect: true },
            setEssentialValue: { hasBeenCorrect: true },
          }
        }

        return {
          useEssentialOrDefaultValue: {
            hasBeenCorrect: true
          }
        }
      }
    }

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
          numberOfAttemptsLeft: {
            dependencyType: "stateVariable",
            variableName: "numberOfAttemptsLeft",
          },
          disableAfterCorrect: {
            dependencyType: "stateVariable",
            variableName: "disableAfterCorrect",
          },
        }

        if (stateValues.disableAfterCorrect) {
          dependencies.hasBeenCorrect = {
            dependencyType: "stateVariable",
            variableName: "hasBeenCorrect",
          }
        }

        return dependencies;

      },
      definition({ dependencyValues }) {

        let disabled = dependencyValues.disabledOriginal
          || dependencyValues.numberOfAttemptsLeft < 1
          || (dependencyValues.disableAfterCorrect && dependencyValues.hasBeenCorrect);

        return { setValue: { disabled } }
      }
    }


    stateVariableDefinitions.inItemNumber = {
      returnDependencies: () => ({
        documentAncestor: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: ["itemNumberByAnswerName"]
        }
      }),
      definition({ dependencyValues, componentName }) {
        return {
          setValue: {
            inItemNumber:
              dependencyValues.documentAncestor.stateValues.itemNumberByAnswerName[componentName]
          }
        }

      }
    }

    return stateVariableDefinitions;
  }

  actions = {
    submitAnswer: this.submitAnswer.bind(this)
  };


  async submitAnswer({ actionId }) {

    let numberOfAttemptsLeft = await this.stateValues.numberOfAttemptsLeft;
    if (numberOfAttemptsLeft < 1) {
      console.warn(`Cannot submit answer for ${this.componentName} as number of attempts left is ${numberOfAttemptsLeft}`);
      return;
    }

    let creditAchieved = await this.stateValues.creditAchievedIfSubmit;
    let awardsUsed = await this.stateValues.awardsUsedIfSubmit;
    let inputUsed = await this.stateValues.inputUsedIfSubmit;

    // request to update credit
    let instructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "creditAchieved",
      value: creditAchieved,
    }, {
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "responseHasBeenSubmitted",
      value: true
    }];

    let inputChildrenWithValues = await this.stateValues.inputChildrenWithValues;

    if (inputChildrenWithValues.length === 1) {
      // if have a single input descendant,
      // then will record the current value

      let inputChild = inputChildrenWithValues[0];

      if (inputUsed === inputChild.componentName
        && "valueToRecordOnSubmit" in inputChild.stateValues
        && "valueRecordedAtSubmit" in inputChild.stateValues
      ) {
        instructions.push({
          updateType: "updateValue",
          componentName: inputChild.componentName,
          stateVariable: "valueRecordedAtSubmit",
          value: inputChild.stateValues.valueToRecordOnSubmit
        })
      }
    }

    // add submitted responses to instruction for answer
    let currentResponses = await this.stateValues.currentResponses;
    // let currentResponses = await this.state.currentResponses.value;

    instructions.push({
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "submittedResponses",
      value: currentResponses
    })

    instructions.push({
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "submittedResponsesComponentType",
      value: this.state.currentResponses.shadowingInstructions.createComponentOfType
    })

    instructions.push({
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "justSubmitted",
      value: true
    })

    instructions.push({
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "creditAchievedDependenciesAtSubmit",
      value: await this.stateValues.creditAchievedDependencies
    })

    instructions.push({
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "nSubmissions",
      value: await this.stateValues.nSubmissions + 1,
    })

    for (let child of await this.stateValues.awardChildren) {
      let awarded = awardsUsed.includes(child.componentName);
      instructions.push({
        updateType: "updateValue",
        componentName: child.componentName,
        stateVariable: "awarded",
        value: awarded
      });
      instructions.push({
        updateType: "updateValue",
        componentName: child.componentName,
        stateVariable: "creditAchieved",
        value: child.stateValues.creditAchievedIfSubmit
      });
      instructions.push({
        updateType: "updateValue",
        componentName: child.componentName,
        stateVariable: "fractionSatisfied",
        value: child.stateValues.fractionSatisfiedIfSubmit
      });
    }


    let responseText = [];
    for (let response of currentResponses) {
      if (response.toString) {
        responseText.push(response.toString())
      } else {
        responseText.push(response)
      }
    }

    instructions.push({
      updateType: "recordItemSubmission",
      itemNumber: await this.stateValues.inItemNumber,
      submittedComponent: this.componentName,
      response: currentResponses,
      responseText,
      creditAchieved,
    })

    // console.log(`submit instructions`)
    // console.log(instructions);

    await this.coreFunctions.performUpdate({
      updateInstructions: instructions,
      actionId,
      event: {
        verb: "submitted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: currentResponses,
          responseText,
          creditAchieved
        }

      },
    });

    return await this.coreFunctions.triggerChainedActions({
      componentName: this.componentName,
    });


  }

}
