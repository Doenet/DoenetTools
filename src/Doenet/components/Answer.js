import InlineComponent from './abstract/InlineComponent';
import { returnBreakStringsSugarFunction } from './commonsugar/breakstrings';
import { createUniqueName } from '../utils/naming';
import { deepCompare } from '../utils/deepFunctions';

export default class Answer extends InlineComponent {
  static componentType = "answer";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.weight = { default: 1 };
    properties.inline = { default: false, propagateToDescendants: true };
    properties.type = {
      default: "math",
      propagateToDescendants: true,
      toLowerCase: true,
      validValues: ["math", "text"]
    };
    properties.splitIntoOptions = { default: false, propagateToDescendants: true };
    properties.fixedOrder = { default: false, propagateToDescendants: true };
    properties.size = { default: 10, propagateToDescendants: true };
    properties.forceFullCheckworkButton = { default: false };
    properties.expandOnCompare = { default: false, propagateToDescendants: true };
    properties.simplifyOnCompare = {
      default: "none",
      toLowerCase: true,
      valueTransformations: { "": "full", "true": "full" },
      validValues: ["none", "full", "numbers", "numbersepreserveorder"],
      propagateToDescendants: true,
    };
    properties.unorderedCompare = { default: false, propagateToDescendants: true };
    properties.feedbackDefinitions = { propagateToDescendants: true, mergeArrays: true }

    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);


    let replaceFromOneString = function ({ activeChildrenMatched, dependencyValues, parentName, childLogicName }) {
      // answer where only child is a string (other than activeChildren from properties)
      // create two activeChildren for the answer:
      // <[defaultType]input/>
      // <award><when><copy prop="value" tname="[theinput]"/">=<[type]>[originalString]</[type]></when></award>

      let inputType, typeUsed;
      if (dependencyValues.type === "text") {
        inputType = "textinput";
        typeUsed = "text";
      } else {
        inputType = "mathinput";
        typeUsed = "math";
      }

      let toDelete = [];
      let childrenForEquals = [{
        componentType: typeUsed, children: [
          {
            createdComponent: true,
            componentName: activeChildrenMatched[0].componentName
          }
        ]
      }];

      if (dependencyValues.splitIntoOptions) {

        let childrenToComponentFunction = x => ({
          componentType: typeUsed,
          children: x
        });
        let breakFunction = returnBreakStringsSugarFunction({
          childrenToComponentFunction,
          dependencyNameWithChildren: "stringChildren"
        });

        let breakResults = breakFunction({ dependencyValues })

        if (breakResults.success) {
          childrenForEquals = breakResults.newChildren;
          toDelete = breakResults.toDelete;
        }
      }

      let longNameId = parentName + "|sugarReplacement|" + childLogicName;
      let componentName = createUniqueName(inputType, longNameId)

      let whenChildren = [
        {
          componentType: 'copy',
          children: [
            { componentType: 'tname', state: { targetName: componentName } },
            { componentType: 'prop', state: { variableName: "immediateValue" } }
          ],
        },
        { componentType: 'string', state: { value: '=' } },
        childrenForEquals[0]
      ];

      for (let child of childrenForEquals.slice(1)) {
        whenChildren.push(...[
          { componentType: 'string', state: { value: ' or ' } },
          {
            componentType: 'copy', children: [
              { componentType: 'tname', state: { targetName: componentName } },
              { componentType: 'prop', state: { variableName: "value" } }
            ]
          },
          { componentType: 'string', state: { value: '=' } },
          child
        ])
      }

      let inputChild = {
        componentType: inputType,
        doenetAttributes: { componentName: componentName },
        children: []
      };

      if (dependencyValues.size) {
        inputChild.state = { size: dependencyValues.size }
      }

      return {
        success: true,
        newChildren: [
          inputChild,
          {
            componentType: 'award',
            children: [
              { componentType: 'when', children: whenChildren }
            ]
          }
        ],
        toDelete: toDelete,
      };
    }

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1,
      isSugar: true,
      returnSugarDependencies: () => ({
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        splitIntoOptions: {
          dependencyType: "stateVariable",
          variableName: "splitIntoOptions"
        },
        size: {
          dependencyType: "stateVariable",
          variableName: "size"
        },
        stringChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneString",
          variableNames: ["value"]
        }
      }),
      logicToWaitOnSugar: ["atLeastZeroCompleteAwards", "anyInlineComponents"],
      replacementFunction: replaceFromOneString,
    });


    let replaceFromOneMath = function ({ activeChildrenMatched, dependencyValues, parentName, childLogicName }) {
      // answer where only child is a math (other than activeChildren from properties)
      // create two activeChildren for the answer:
      // <mathinput/>
      // <award><when><copy prop="value" tname="[themathinput]"/>=[originalMath]</when></award>

      let longNameId = parentName + "|sugarReplacement|" + childLogicName;
      let componentName = createUniqueName("mathinput", longNameId)

      let inputChild = {
        componentType: 'mathinput',
        doenetAttributes: { componentName: componentName },
        children: []
      };

      if (dependencyValues.size) {
        inputChild.state = { size: dependencyValues.size }
      }

      return {
        success: true,
        newChildren: [
          inputChild,
          {
            componentType: 'award',
            children: [
              {
                componentType: 'when', children: [
                  {
                    componentType: 'copy',
                    children: [
                      { componentType: 'tname', state: { targetName: componentName } },
                      { componentType: 'prop', state: { variableName: "immediateValue" } }
                    ],
                  },
                  { componentType: 'string', state: { value: '=' } },
                  {
                    createdComponent: true,
                    componentName: activeChildrenMatched[0].componentName
                  }
                ]
              }
            ]
          }
        ]
      };
    }

    let exactlyOneMath = childLogic.newLeaf({
      name: "exactlyOneMath",
      componentType: 'math',
      number: 1,
      isSugar: true,
      returnSugarDependencies: () => ({
        size: {
          dependencyType: "stateVariable",
          variableName: "size"
        }
      }),
      logicToWaitOnSugar: ["atLeastZeroCompleteAwards", "anyInlineComponents"],
      replacementFunction: replaceFromOneMath,
    });


    let replaceFromOneText = function ({ activeChildrenMatched, dependencyValues, parentName, childLogicName }) {
      // answer where only child is a text (other than activeChildren from properties)
      // create two activeChildren for the answer:
      // <textinput/>
      // <award><when><copy prop="value" tname="[thetextinput]"/>=[originaltext]</when></award>

      let longNameId = parentName + "|sugarReplacement|" + childLogicName;
      let componentName = createUniqueName("textinput", longNameId)

      let inputChild = {
        componentType: 'textinput',
        doenetAttributes: { componentName: componentName },
        children: []
      };

      if (dependencyValues.size) {
        inputChild.state = { size: dependencyValues.size }
      }

      return {
        success: true,
        newChildren: [
          inputChild,
          {
            componentType: 'award',
            children: [
              {
                componentType: 'when', children: [
                  {
                    componentType: 'copy',
                    children: [
                      { componentType: 'tname', state: { targetName: componentName } },
                      { componentType: 'prop', state: { variableName: "immediateValue" } }
                    ],
                  },
                  { componentType: 'string', state: { value: '=' } },
                  {
                    createdComponent: true,
                    componentName: activeChildrenMatched[0].componentName
                  }
                ]
              }
            ]
          }
        ]
      };
    }

    let exactlyOneText = childLogic.newLeaf({
      name: "exactlyOneText",
      componentType: 'text',
      number: 1,
      isSugar: true,
      returnSugarDependencies: () => ({
        size: {
          dependencyType: "stateVariable",
          variableName: "size"
        }
      }),
      logicToWaitOnSugar: ["atLeastZeroCompleteAwards", "anyInlineComponents"],

      replacementFunction: replaceFromOneText,
    });


    let replaceFromJustChoices = function ({ activeChildrenMatched, parentName, childLogicName }) {
      // answer where only children are choices (other than activeChildren from properties)
      // wrap choices in a choiceinput
      // and for each choice
      // create an award of the form
      // <award><credit>[creditfromchoice]</credit>
      //   <when><copy prop="selectedindex" tname="[thechoiceinput]"/>=[indexofchoice]</when>
      // </award>
      // also determine inline based on inline property of answer

      let choiceComponents = activeChildrenMatched.map(x => ({
        createdComponent: true,
        componentName: x.componentName
      }));

      let longNameId = parentName + "|sugarReplacement|" + childLogicName;
      let componentName = createUniqueName("choiceinput", longNameId)

      let choiceinputComponent = {
        componentType: "choiceinput",
        doenetAttributes: { componentName: componentName },
        children: choiceComponents,
      };

      return {
        success: true,
        newChildren: [
          choiceinputComponent,
        ]
      };

    }

    // TODO: removing this option for now,
    // as it lets sugar change the variant structure
    // Possible solutions: have variants determined
    // after components are constructed rather than with serialized state?

    // let atLeastOneChoice = childLogic.newLeaf({
    //   name: "atLeastOneChoice",
    //   componentType: 'choice',
    //   comparison: 'atLeast',
    //   number: 1,
    //   isSugar: true,
    //   logicToWaitOnSugar: ["anyInlineComponents"],
    //   replacementFunction: replaceFromJustChoices,
    // });


    let replaceFromIncompleteAwards = function ({ activeChildrenMatched, dependencyValues, parentName, childLogicName }) {
      // answer where only activeChildren (other than from properties) are incomplete awards
      // (meaning awards with a <string> child rather than an <when> child)
      // create an input and replace the <string> child of each award with
      // <when><copy prop="value" tname="[theinput]"/>=<defaultType>[originalString]</type></when>

      // if all award have that aren't strings have same incomplete type,
      // use that type

      let incompleteType;
      // note: use dependency value incomplete Awards
      // rather than activeChildrenMatch so have access to state variables
      for (let award of dependencyValues.incompleteAwards) {
        let newType = award.stateValues.incompleteType;
        if (newType !== "string") {
          if (incompleteType === undefined) {
            incompleteType = newType;
          } else if (incompleteType !== newType) {
            // award of different types, so don't use this to determine type
            incompleteType = undefined;
            break;
          }
        }
      }

      let inputType;
      let typeForStrings;

      if (incompleteType !== undefined) {
        typeForStrings = incompleteType;
        inputType = incompleteType + "input";
      } else {

        if (dependencyValues.type === "math") {
          inputType = "mathinput";
        } else if (dependencyValues.type === "text") {
          inputType = "textinput";
        } else {
          console.warn(`Invalid type ${dependencyValues.type} for answer, defaulting to math`);
          inputType = "mathinput";
          // return { success: false };
        }

        typeForStrings = dependencyValues.type;
      }

      let longNameId = parentName + "|sugarReplacement|" + childLogicName;
      let componentName = createUniqueName(inputType, longNameId)

      let inputChild = {
        componentType: inputType,
        doenetAttributes: { componentName: componentName },
        children: []
      };

      if (dependencyValues.size) {
        inputChild.state = { size: dependencyValues.size }
      }

      let newChildren = [inputChild];
      let childChanges = {};
      // note: use dependency value incomplete Awards
      // rather than activeChildrenMatch so have access to state variables
      for (let [ind, award] of dependencyValues.incompleteAwards.entries()) {
        newChildren.push({
          createdComponent: true,
          componentName: award.componentName
        })
        let newAwardChildren = [];

        let toDelete = [];
        let childrenForEquals = [{
          createdComponent: true,
          componentName: award.stateValues.childForIncomplete.componentName
        }];

        if (award.stateValues.incompleteType === 'string') {

          childrenForEquals = [{
            componentType: typeForStrings, children: childrenForEquals
          }];

          if (award.stateValues.splitIntoOptions) {
            let childrenToComponentFunction = x => ({
              componentType: typeForStrings,
              children: x
            });
            let breakFunction = returnBreakStringsSugarFunction({
              childrenToComponentFunction,
              dependencyNameWithChildren: "childForIncomplete"
            });


            // since break function is expecting a dependencyValue with childForIncomplete
            // we create a dependencyValues object with that structure
            let breakResults = breakFunction({
              dependencyValues: {
                childForIncomplete: [dependencyValues.incompleteAwards[0].stateValues.childForIncomplete]
              }
            })


            if (breakResults.success) {
              childrenForEquals = breakResults.newChildren;
              toDelete = breakResults.toDelete;
            }

          }
        }

        let whenChildren = [
          {
            componentType: 'copy',
            children: [
              { componentType: 'tname', state: { targetName: componentName } },
              { componentType: 'prop', state: { variableName: "immediateValue" } }
            ],
          },
          { componentType: 'string', state: { value: '=' } },
          childrenForEquals[0]
        ];

        for (let child of childrenForEquals.slice(1)) {
          whenChildren.push(...[
            { componentType: 'string', state: { value: ' or ' } },
            {
              componentType: 'copy', children: [
                { componentType: 'tname', state: { targetName: componentName } },
                { componentType: 'prop', state: { variableName: "value" } }
              ]
            },
            { componentType: 'string', state: { value: '=' } },
            child
          ])
        }

        let newWhen = { componentType: 'when', children: whenChildren };
        newAwardChildren.push(newWhen);

        childChanges[award.componentName] = {
          activeChildrenMatched: [award.stateValues.childForIncomplete],
          newChildren: newAwardChildren,
          toDelete: toDelete,
        }
      }

      return {
        success: true,
        newChildren: newChildren,
        childChanges: childChanges,
      }
    }

    let awardIsIncomplete = function (child) {
      // TODO: we don't know if stateVariable incomplete is resolved!
      // We need a way to defer until it is resolved....
      return (child.stateValues.incomplete === true);
    }

    let atLeastOneIncompleteAward = childLogic.newLeaf({
      name: "atLeastOneIncompleteAward",
      componentType: 'award',
      comparison: 'atLeast',
      number: 1,
      isSugar: true,
      returnSugarDependencies: () => ({
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        size: {
          dependencyType: "stateVariable",
          variableName: "size"
        },
        incompleteAwards: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastOneIncompleteAward",
          variableNames: ["incompleteType", "childForIncomplete", "splitIntoOptions"]
        }
      }),
      logicToWaitOnSugar: ["atLeastZeroCompleteAwards", "anyInlineComponents"],
      replacementFunction: replaceFromIncompleteAwards,
      condition: awardIsIncomplete,
    });


    let awardIsComplete = function (child) {
      // TODO: we don't know if stateVariable incomplete is resolved!
      // We need a way to defer until it is resolved....
      return (child.stateValues.incomplete !== true);
    }

    let atLeastZeroCompleteAwards = childLogic.newLeaf({
      name: "atLeastZeroCompleteAwards",
      componentType: 'award',
      comparison: 'atLeast',
      number: 0,
      condition: awardIsComplete,
    });

    let incompleteXorCompleteAwards = childLogic.newOperator({
      name: "incompleteXorCompleteAwards",
      operator: 'xor',
      propositions: [atLeastOneIncompleteAward, atLeastZeroCompleteAwards]
    });

    let atMostOneInput = childLogic.newLeaf({
      name: "atMostOneInput",
      componentType: '_input',
      comparison: 'atMost',
      number: 1,
    });

    let atLeastZeroConsiderAsResponses = childLogic.newLeaf({
      name: "atLeastZeroConsiderAsResponses",
      componentType: "considerAsResponses",
      comparison: "atLeast",
      number: 0,
    })

    let awardsInputResponses = childLogic.newOperator({
      name: "awardsInputResponses",
      operator: 'and',
      propositions: [incompleteXorCompleteAwards, atMostOneInput, atLeastZeroConsiderAsResponses]
    });

    childLogic.newOperator({
      name: "completeXorSugared",
      operator: 'xor',
      propositions: [
        awardsInputResponses,
        exactlyOneString,
        exactlyOneMath,
        exactlyOneText,
        // atLeastOneChoice,
      ],
      setAsBase: true,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.inputChild = {
      forRenderer: true,
      returnDependencies: () => ({
        inputChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneInput",
          variableNames: ["valueToRecordOnSubmit", "valueRecordedAtSubmit"],
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.inputChild.length === 1) {
          return { newValues: { inputChild: dependencyValues.inputChild[0] } }
        } else {
          return { newValues: { inputChild: null } }
        }
      }
    }

    stateVariableDefinitions.awardInputResponseChildren = {
      returnDependencies: () => ({
        awardInputResponseChildren: {
          dependencyType: "childIdentity",
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
              dependencyType: "componentDescendantStateVariables",
              ancestorName: child.componentName,
              componentTypes: ["_base"],
              variableNames: ["isResponse", "nValues"],
              variablesOptional: true,
              requireChildLogicInitiallySatisfied: true,
              recurseToMatchedChildren: true,
              includePropertyChildren: true,
              includeNonActiveChildren: true,
              skipOverAdapters: true,
            }

          } else if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "_input"
          })) {
            dependencies['childNValues' + ind] = {
              dependencyType: "componentStateVariable",
              componentIdentity: child,
              variableName: "nValues",
              variableOptional: true,
            }
          } else {
            // considerAsResponses
            dependencies['child' + ind] = {
              dependencyType: "componentStateVariable",
              componentIdentity: child,
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
              dependencyType: "componentDescendantStateVariables",
              ancestorName: child.componentName,
              componentTypes: ["_base"],
              variableNames: ["isResponse", "value", "values", "componentType"],
              variablesOptional: true,
              requireChildLogicInitiallySatisfied: true,
              recurseToMatchedChildren: true,
              includePropertyChildren: true,
              includeNonActiveChildren: true,
              skipOverAdapters: true,
            }

          } else if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "_input"
          })) {
            globalDependencies['childValue' + ind] = {
              dependencyType: "componentStateVariable",
              componentIdentity: child,
              variableName: "value",
              variableOptional: true,
            }
            globalDependencies['childValues' + ind] = {
              dependencyType: "componentStateVariable",
              componentIdentity: child,
              variableName: "values",
              variableOptional: true,
            }
            globalDependencies['childComponentType' + ind] = {
              dependencyType: "componentStateVariable",
              componentIdentity: child,
              variableName: "componentType",
              variableOptional: true,
            }
          } else {
            // considerAsResponses
            globalDependencies['child' + ind] = {
              dependencyType: "componentStateVariable",
              componentIdentity: child,
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

            // reconstruct child in same for as other components
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
        ["delegateCheckWorkToInput", "delegateCheckWorkToAncestor"],
      forRenderer: true,
      returnDependencies: () => ({
        inputChild: {
          dependencyType: "stateVariable",
          variableName: "inputChild"
        },
        forceFullCheckworkButton: {
          dependencyType: "stateVariable",
          variableName: "forceFullCheckworkButton"
        },
        sectionAncestor: {
          dependencyType: "ancestorStateVariables",
          componentType: "_sectioningcomponent",
          variableNames: ["sectionWideCheckWork"]
        }
      }),
      definition: function ({ dependencyValues }) {
        let delegateCheckWorkToAncestor = false;
        let delegateCheckWorkToInput = false;
        let delegateCheckWork = false;

        if (dependencyValues.sectionAncestor) {
          delegateCheckWorkToAncestor = delegateCheckWork = dependencyValues.sectionAncestor.stateValues.sectionWideCheckWork;
        }

        if (!delegateCheckWorkToAncestor && dependencyValues.inputChild &&
          !dependencyValues.forceFullCheckworkButton
        ) {
          delegateCheckWorkToInput = delegateCheckWork = true;
        }
        return {
          newValues: {
            delegateCheckWork, delegateCheckWorkToAncestor, delegateCheckWorkToInput
          }
        };
      }
    }

    stateVariableDefinitions.creditAchievedIfSubmit = {
      additionalStateVariablesDefined: ["awardUsedIfSubmit", "awardChildren",
        "inputUsedIfSubmit"],
      returnDependencies: () => ({
        awardChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroCompleteAwards",
          variableNames: ["credit", "creditAchieved", "fractionSatisfied"]
        },
        inputChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneInput",
          variableNames: ["creditAchievedIfSubmit"],
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {

        let creditAchieved = 0;
        let awardUsed = null;
        let inputUsed = null;

        if (dependencyValues.awardChildren.length === 0) {
          if (dependencyValues.inputChild.length === 1) {
            let inputCredit = dependencyValues.inputChild[0].stateValues.creditAchievedIfSubmit;
            // if input has a state variable creditAchievedIfSubmit
            // that is a non-negative number, use that value
            if (inputCredit >= 0) {
              creditAchieved = inputCredit;
              inputUsed = dependencyValues.inputChild[0].componentName;
            }
          }
        } else {
          // awardUsed with be component name of first award
          // that gives the maximum credit (which will be creditAchieved)
          // Always process awards if haven't matched an award in case want to
          // use an award with credit=0 to trigger feedback
          for (let child of dependencyValues.awardChildren) {
            let childMaxCredit = Math.max(0, Math.min(1, child.stateValues.credit))
            if (childMaxCredit > creditAchieved || awardUsed === null) {
              let creditFromChild = child.stateValues.creditAchieved;
              let fractionFromChild = child.stateValues.fractionSatisfied;
              if (fractionFromChild > 0 && (creditFromChild > creditAchieved || awardUsed === null)) {
                creditAchieved = creditFromChild;
                awardUsed = child.componentName;
              }
            }
          }
        }
        return {
          newValues: {
            creditAchievedIfSubmit: creditAchieved,
            awardUsedIfSubmit: awardUsed,
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
          variableName: "creditAchievedIfSubmit",
          changedValuesOnly: true,
        },
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            creditAchievedDependencies: dependencyValues.currentCreditAchievedDependencies
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
      returnDependencies: () => ({
        currentCreditAchievedDependencies: {
          dependencyType: "stateVariable",
          variableName: "creditAchievedDependencies",
        },
        creditAchievedDependenciesAtSubmit: {
          dependencyType: "stateVariable",
          variableName: "creditAchievedDependenciesAtSubmit"
        }

      }),
      definition: function ({ dependencyValues }) {

        let justSubmitted = deepCompare(
          dependencyValues.currentCreditAchievedDependencies,
          dependencyValues.creditAchievedDependenciesAtSubmit
        )

        return {
          newValues: { justSubmitted },
        }
      },
    }

    stateVariableDefinitions.feedbacks = {
      public: true,
      componentType: "feedbacktext",
      isArray: true,
      entireArrayAtOnce: true,
      entryPrefixes: ["feedback"],
      returnDependencies: () => ({
        awardChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroCompleteAwards",
          variableNames: ["feedbacks"]
        },
        feedbackComponents: {
          dependencyType: "descendantStateVariables",
          componentTypes: ["_input"],
          variableNames: ["feedbacks"],
          variablesOptional: true,
        },
      }),
      entireArrayDefinition: function ({ dependencyValues }) {
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
            feedbacks
          }
        }
      }
    }

    stateVariableDefinitions.showCorrectness = {
      forRenderer: true,
      returnDependencies: () => ({
        showCorrectnessFlag: {
          dependencyType: "flag",
          flagName: "showCorrectness"
        }
      }),
      definition({ dependencyValues }) {
        let showCorrectness = dependencyValues.showCorrectnessFlag !== false;
        return { newValues: { showCorrectness } }
      }
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        inputChild: {
          dependencyType: "childIdentity",
          childLogicName: "atMostOneInput"
        },
      }),
      definition: function ({ dependencyValues }) {
        let childrenToRender = dependencyValues.inputChild.map(x => x.componentName);
        return {
          newValues: { childrenToRender }
        }
      }
    }



    return stateVariableDefinitions;
  }

  actions = {
    submitAnswer: this.submitAnswer.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
  }

  submitAnswer() {

    let creditAchieved = this.stateValues.creditAchievedIfSubmit;
    let awardUsed = this.stateValues.awardUsedIfSubmit;
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

    // // request to update the submittedvalue of each input
    // // and also gather submitted value into own submittedResponses array
    // let submittedResponses = [];


    if (this.stateValues.inputChild) {
      // if have a single input descendant,
      // then will set its creditAchieved state variable

      instructions.push({
        updateType: "updateValue",
        componentName: this.stateValues.inputChild.componentName,
        stateVariable: "creditAchieved",
        value: creditAchieved,
      });

      if (inputUsed === this.stateValues.inputChild.componentName
        && "valueToRecordOnSubmit" in this.stateValues.inputChild.stateValues
        && "valueRecordedAtSubmit" in this.stateValues.inputChild.stateValues
      ) {
        instructions.push({
          updateType: "updateValue",
          componentName: this.stateValues.inputChild.componentName,
          stateVariable: "valueRecordedAtSubmit",
          value: this.stateValues.inputChild.stateValues.valueToRecordOnSubmit
        })
      }

      // if (this.stateValues.inputChild.componentType === "choiceinput") {
      //   instructions.push({
      //     updateType: "updateValue",
      //     componentName: this.stateValues.inputChild.componentName,
      //     stateVariable: "submittedIndices",
      //     value: this.stateValues.inputChild.stateValues.selectedIndices
      //   })
      // } else {
      //   instructions.push({
      //     updateType: "updateValue",
      //     componentName: this.stateValues.inputChild.componentName,
      //     stateVariable: "submittedValue",
      //     value: this.stateValues.inputChild.stateValues.value,
      //   });
      // }
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
      stateVariable: "creditAchievedDependenciesAtSubmit",
      value: this.stateValues.creditAchievedDependencies
    })

    for (let child of this.stateValues.awardChildren) {
      let awarded = child.componentName === awardUsed;
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

      }
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
