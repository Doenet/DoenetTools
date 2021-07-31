import InlineComponent from './abstract/InlineComponent';
import { deepCompare } from '../utils/deepFunctions';
// import sha1 from 'crypto-js/sha1';
// import Base64 from 'crypto-js/enc-base64';

export default class Answer extends InlineComponent {
  static componentType = "answer";

  static renderChildren = true;

  static variableForPlainMacro = "submittedResponses";


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
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
      propagateToDescendants: true
    };
    attributes.symbolicEquality = {
      createComponentOfType: "boolean",
      createStateVariable: "symbolicEquality",
      defaultValue: false,
      public: true,
      propagateToDescendants: true
    };
    attributes.size = {
      createComponentOfType: "number",
      createStateVariable: "size",
      defaultValue: 10,
      public: true,
      propagateToDescendants: true
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
      propagateToDescendants: true,
    };
    attributes.expandOnCompare = {
      createComponentOfType: "boolean",
      createStateVariable: "expandOnCompare",
      defaultValue: false,
      public: true,
      propagateToDescendants: true,
    };
    attributes.unorderedCompare = {
      createComponentOfType: "boolean",
      createStateVariable: "unorderedCompare",
      defaultValue: false,
      public: true,
      propagateToDescendants: true,
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
      propagateToDescendants: true,
    };
    attributes.includeErrorInNumberExponents = {
      createComponentOfType: "boolean",
      createStateVariable: "includeErrorInNumberExponents",
      defaultValue: false,
      public: true,
      propagateToDescendants: true,
    };
    attributes.allowedErrorIsAbsolute = {
      createComponentOfType: "boolean",
      createStateVariable: "allowedErrorIsAbsolute",
      defaultValue: false,
      public: true,
      propagateToDescendants: true,
    };
    attributes.nSignErrorsMatched = {
      createComponentOfType: "number",
      createStateVariable: "nSignErrorsMatched",
      defaultValue: 0,
      public: true,
      propagateToDescendants: true,
    };
    attributes.feedbackDefinitions = {
      createComponentOfType: "feedbackDefinitions",
      createStateVariable: "feedbackDefinitions",
      public: true,
      propagateToDescendants: true,
      mergeArrays: true
    };
    attributes.prefill = {
      createComponentOfType: "text",
      createStateVariable: "prefill",
      defaultValue: "",
      public: true,
      propagateToDescendants: true,
    };


    attributes.showCorrectness = {
      createComponentOfType: "boolean",
      createStateVariable: "showCorrectness",
      defaultValue: args.flags ? args.flags.showCorrectness !== false : true,
      forRenderer: true,
    }
    attributes.type = {
      createPrimitiveOfType: "string"
    }

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let replaceFromOneString = function ({ matchedChildren, componentAttributes }) {
      // answer where only child is a string (other than activeChildren from attributes)
      // wrap string with award and math/text


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

      let awards = [{
        componentType: "award",
        children: [{
          componentType: type,
          children: matchedChildren
        }]
      }];

      return {
        success: true,
        newChildren: awards,
      }
    }

    sugarInstructions.push({
      childrenRegex: "s",
      replacementFunction: replaceFromOneString
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


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroAwards = childLogic.newLeaf({
      name: "atLeastZeroAwards",
      componentType: 'award',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroInputs = childLogic.newLeaf({
      name: "atLeastZeroInputs",
      componentType: '_input',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroConsiderAsResponses = childLogic.newLeaf({
      name: "atLeastZeroConsiderAsResponses",
      componentType: "considerAsResponses",
      comparison: "atLeast",
      number: 0,
    })

    childLogic.newOperator({
      name: "awardsInputResponses",
      operator: 'and',
      propositions: [atLeastZeroAwards, atLeastZeroInputs, atLeastZeroConsiderAsResponses],
      setAsBase: true,
    });


    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.haveAwardThatRequiresInput = {
      returnDependencies: () => ({
        awardChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroAwards",
          variableNames: ["requireInputInAnswer"]
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
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
          childLogicName: "atLeastZeroInputs",
        }
      }),
      definition({ dependencyValues }) {
        return { newValues: { allInputChildrenIncludingSugared: dependencyValues.allInputChildrenIncludingSugared } }
      }
    }


    stateVariableDefinitions.inputChildren = {
      stateVariablesDeterminingDependencies: ["allInputChildrenIncludingSugared"],
      additionalStateVariablesDefined: ["inputChildIndices"],
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

        for (let [ind, child] of stateValues.allInputChildrenIncludingSugared.entries()) {
          dependencies[`child${ind}FromSugar`] = {
            dependencyType: "doenetAttribute",
            componentName: child.componentName,
            attributeName: "createdFromSugar"
          }
        }

        return dependencies;

      },
      definition({ dependencyValues }) {

        // if have award the requires input,
        // use the input child from sugar if none other exists

        let skipSugarChild = !dependencyValues.haveAwardThatRequiresInput
          || dependencyValues.allInputChildrenIncludingSugared.length > 1;

        let inputChildren = [];
        let inputChildIndices = []

        for (let [ind, child] of dependencyValues.allInputChildrenIncludingSugared.entries()) {
          if (!(skipSugarChild && dependencyValues[`child${ind}FromSugar`])) {
            inputChildren.push(child);
            inputChildIndices.push(ind);
          }
        }

        return { newValues: { inputChildren, inputChildIndices } };
      }
    }

    stateVariableDefinitions.inputChildrenWithValues = {
      stateVariablesDeterminingDependencies: ["inputChildIndices"],
      forRenderer: true,
      returnDependencies: ({ stateValues }) => ({
        inputChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroInputs",
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
        return { newValues: { inputChildrenWithValues: dependencyValues.inputChildren } }
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
        return { newValues: { inputChildWithValues } };
      }
    }

    stateVariableDefinitions.awardInputResponseChildren = {
      returnDependencies: () => ({
        awardInputResponseChildren: {
          dependencyType: "child",
          childLogicName: "awardsInputResponses",
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { awardInputResponseChildren: dependencyValues.awardInputResponseChildren }
      })
    }

    stateVariableDefinitions.nResponses = {
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

        return { newValues: { nResponses } }

      }
    }

    stateVariableDefinitions.currentResponses = {
      public: true,
      isArray: true,
      entryPrefixes: ["currentResponse"],
      hasVariableComponentType: true,
      defaultEntryValue: '\uFF3F',
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
          newValues: { currentResponses },
          setComponentType: { currentResponses: componentType },
        }
      }
    }


    stateVariableDefinitions.currentResponse = {
      isAlias: true,
      targetVariableName: "currentResponse1"
    };


    stateVariableDefinitions.nSubmittedResponses = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        nResponses: {
          dependencyType: "stateVariable",
          variableName: "nResponses"
        }
      }),
      definition: ({ dependencyValues }) => ({
        useEssentialOrDefaultValue: {
          nSubmittedResponses: {
            variablesToCheck: ["nSubmittedResponses"],
            // defaultValue: Math.max(1, dependencyValues.nResponses)
            defaultValue: 0//dependencyValues.nResponses
          }
        }
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "nSubmittedResponses",
            value: desiredStateVariableValues.nSubmittedResponses
          }]
        }
      }
    }

    stateVariableDefinitions.submittedResponsesComponentType = {
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          submittedResponsesComponentType: {
            variablesToCheck: ["submittedResponsesComponentType"]
          }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        if (desiredStateVariableValues.submittedResponsesComponentType) {
          return {
            success: true,
            instructions: [{
              setStateVariable: "submittedResponsesComponentType",
              value: [...desiredStateVariableValues.submittedResponsesComponentType]
            }]
          };
        } else {
          return {
            success: true,
            instructions: [{
              setStateVariable: "submittedResponsesComponentType",
              value: []
            }]
          };
        }
      }
    }

    stateVariableDefinitions.submittedResponses = {
      public: true,
      isArray: true,
      entryPrefixes: ["submittedResponse"],
      defaultEntryValue: '\uFF3F',
      essential: true,
      componentType: "math",
      hasVariableComponentType: true,
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
          essentialSubmittedResponses[ind] = {
            variablesToCheck: [
              { variableName: "submittedResponses", arrayIndex: ind }
            ],
          }

          if (!componentType[ind]) {
            componentType[ind] = "math"
          }

        }


        return {
          useEssentialOrDefaultValue: {
            submittedResponses: essentialSubmittedResponses,
          },
          setComponentType: { submittedResponses: componentType },
          // makeEssential: ["submittedResponses"]
        }
      },
      inverseArrayDefinitionByKey: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setDependency: "nSubmittedResponses",
            desiredValue: desiredStateVariableValues.submittedResponses.length
          },
          {
            setStateVariable: "submittedResponses",
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
          newValues: {
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
          childLogicName: "atLeastZeroAwards",
          variableNames: ["credit", "creditAchieved", "fractionSatisfied"]
        },
        inputChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroInputs",
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
          let awardCredits = Array(n).fill(0);
          let minimumFromAwardCredits = 0;
          for (let child of dependencyValues.awardChildren) {
            let creditFromChild = child.stateValues.creditAchieved;
            if (creditFromChild > minimumFromAwardCredits || awardsUsed[0] === null) {
              if (child.stateValues.fractionSatisfied > 0) {
                if (awardsUsed[0] === null) {
                  awardsUsed[0] = child.componentName;
                  awardCredits[0] = creditFromChild;
                  minimumFromAwardCredits = Math.min(...awardCredits);
                } else {
                  for (let [ind, credit] of awardCredits.entries()) {
                    if (creditFromChild > credit) {
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
          newValues: {
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
      componentType: "number",
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          creditAchieved: {
            variablesToCheck: ["creditAchieved"]
          }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "creditAchieved",
            value: desiredStateVariableValues.creditAchieved
          }]
        };
      }
    }

    stateVariableDefinitions.responseHasBeenSubmitted = {
      public: true,
      componentType: "boolean",
      defaultValue: false,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          responseHasBeenSubmitted: {
            variablesToCheck: ["responseHasBeenSubmitted"]
          }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "responseHasBeenSubmitted",
            value: desiredStateVariableValues.responseHasBeenSubmitted
          }]
        };
      }
    }


    stateVariableDefinitions.creditAchievedDependencies = {
      returnDependencies: () => ({
        currentCreditAchievedDependencies: {
          dependencyType: "recursiveDependencyValues",
          variableNames: ["creditAchievedIfSubmit"],
          includeImmediateValueWithValue: true,
          includeRawValueWithImmediateValue: true,
        },
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            creditAchievedDependencies: dependencyValues.currentCreditAchievedDependencies
            // creditAchievedDependencies: Base64.stringify(sha1(JSON.stringify(dependencyValues.currentCreditAchievedDependencies)))
          }
        }
      },
    }


    stateVariableDefinitions.creditAchievedDependenciesAtSubmit = {
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          creditAchievedDependenciesAtSubmit: {
            variablesToCheck: ["creditAchievedDependenciesAtSubmit"]
          }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "creditAchievedDependenciesAtSubmit",
            value: desiredStateVariableValues.creditAchievedDependenciesAtSubmit
          }]
        };
      }
    }


    stateVariableDefinitions.justSubmitted = {
      forRenderer: true,
      defaultValue: false,
      returnDependencies: () => ({
        currentCreditAchievedDependencies: {
          dependencyType: "stateVariable",
          variableName: "creditAchievedDependencies",
        },
        creditAchievedDependenciesAtSubmit: {
          dependencyType: "stateVariable",
          variableName: "creditAchievedDependenciesAtSubmit"
        },

      }),
      definition: function ({ dependencyValues }) {

        let foundChange = !deepCompare(
          dependencyValues.currentCreditAchievedDependencies,
          dependencyValues.creditAchievedDependenciesAtSubmit
        )

        if (foundChange) {
          return {
            newValues: { justSubmitted: false },
            makeEssential: { justSubmitted: true }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { justSubmitted: { variablesToCheck: ["justSubmitted"] } }
          }
        }

      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "justSubmitted",
            value: desiredStateVariableValues.justSubmitted
          }]
        }
      }
    }


    stateVariableDefinitions.allFeedbacks = {
      returnDependencies: () => ({
        awardChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroAwards",
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
          newValues: {
            allFeedbacks: feedbacks
          }
        }
      }
    }

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
          newValues: { numberFeedbacks: dependencyValues.allFeedbacks.length },
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

        return { newValues: { feedbacks } }
      }

    }

    stateVariableDefinitions.nSubmissions = {
      public: true,
      componentType: "integer",
      defaultValue: 0,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          nSubmissions: { variablesToCheck: ["nSubmissions"] }
        }
      }),
      inverseDefinition: ({ desiredStateVariableValues }) => ({
        success: true,
        instructions: [{
          setStateVariable: "nSubmissions",
          value: desiredStateVariableValues.nSubmissions
        }]
      })
    }

    stateVariableDefinitions.numberOfAttemptsLeft = {
      public: true,
      componentType: "integer",
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
          newValues: {
            numberOfAttemptsLeft: dependencyValues.maximumNumberOfAttempts
              - dependencyValues.nSubmissions
          }
        }
      }
    }

    return stateVariableDefinitions;
  }

  actions = {
    submitAnswer: this.submitAnswer.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
  };

  submitAnswer() {

    if (this.stateValues.numberOfAttemptsLeft < 1) {
      console.warn(`Cannot submit answer for ${this.componentName} as number of attempts left is ${this.stateValues.numberOfAttemptsLeft}`);
      return;
    }

    let creditAchieved = this.stateValues.creditAchievedIfSubmit;
    let awardsUsed = this.stateValues.awardsUsedIfSubmit;
    let inputUsed = this.stateValues.inputUsedIfSubmit;

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


    if (this.stateValues.inputChildrenWithValues.length === 1) {
      // if have a single input descendant,
      // then will record the current value

      let inputChild = this.stateValues.inputChildrenWithValues[0];

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
    instructions.push({
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "submittedResponses",
      value: this.stateValues.currentResponses
    })

    instructions.push({
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "submittedResponsesComponentType",
      value: this.state.currentResponses.componentType
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
      value: this.stateValues.creditAchievedDependencies
    })

    instructions.push({
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "nSubmissions",
      value: this.stateValues.nSubmissions + 1,
    })

    for (let child of this.stateValues.awardChildren) {
      let awarded = awardsUsed.includes(child.componentName);
      instructions.push({
        updateType: "updateValue",
        componentName: child.componentName,
        stateVariable: "awarded",
        value: awarded
      });
    }

    let responseText = [];
    for (let response of this.stateValues.currentResponses) {
      if (response.toString) {
        responseText.push(response.toString())
      } else {
        responseText.push(response)
      }
    }

    // console.log(`submit instructions`)
    // console.log(instructions);

    this.coreFunctions.requestUpdate({
      updateInstructions: instructions,
      event: {
        verb: "submitted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: this.stateValues.currentResponses,
          responseText,
          creditAchieved
        }

      },
      callBack: () => this.coreFunctions.triggerChainedActions({
        componentName: this.componentName,
      })
    })

    // let documentComponentName = this.ancestors[this.ancestors.length - 1].componentName;

    // // NOTE: if change this so don't have a request update with just document
    // // need to change code that triggers an immediate at the end of requestUpdate in core
    // this.coreFunctions.requestUpdate({
    //   updateType: "updateValue",
    //   updateInstructions: [{
    //     componentName: documentComponentName,
    //     variableUpdates: {
    //       submissionNumber: { changes: documentComponent.state.previousSubmissionNumber + 1 },
    //       submittedAnswerComponentName: { changes: this.componentName }
    //     }
    //   }]
    // })

  }

}
