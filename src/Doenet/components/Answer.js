import InlineComponent from './abstract/InlineComponent';
import { breakStringsAndOthersIntoComponentsByStringCommas } from './commonsugar/breakstrings';
import { createUniqueName } from '../utils/naming';
import { deepCompare } from '../utils/deepFunctions';

export default class Answer extends InlineComponent {
  constructor(args) {
    super(args);
    this.submitAnswer = this.submitAnswer.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
  }
  static componentType = "answer";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.weight = { default: 1 };
    properties.inline = { default: false, propagateToDescendants: true };
    properties.type = { default: "math", propagateToDescendants: true };
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


    let replaceFromOneString = function ({ activeChildrenMatched, dependencyValues, idRng }) {
      // answer where only child is a string (other than activeChildren from properties)
      // create two activeChildren for the answer:
      // <[defaultType]input/>
      // <award><if><ref prop="value">[theinput]</ref>=<[type]>[originalString]</[type]></if></award>

      let inputType, typeUsed;
      if (dependencyValues.type === "math") {
        inputType = "mathinput";
        typeUsed = "math";
      } else if (dependencyValues.type === "text") {
        inputType = "textinput";
        typeUsed = "text";
      } else {
        console.warn(`Invalid type ${dependencyValues.type} for answer, defaulting to math`);
        inputType = "mathinput";
        typeUsed = "math";
        // return { success: false };
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
        let breakFunction = breakStringsAndOthersIntoComponentsByStringCommas(x => ({
          componentType: typeUsed,
          children: x
        }));
        let breakResults = breakFunction({ activeChildrenMatched: dependencyValues.stringChildren })

        if (breakResults.success) {
          childrenForEquals = breakResults.newChildren;
          toDelete = breakResults.toDelete;
        }
      }

      let componentName = createUniqueName(inputType, idRng)

      let ifChildren = [
        {
          componentType: 'ref', children: [
            { componentType: 'reftarget', state: { refTargetName: componentName } },
            { componentType: 'prop', state: { variableName: "value" } }
          ]
        },
        { componentType: 'string', state: { value: '=' } },
        childrenForEquals[0]
      ];

      for (let child of childrenForEquals.slice(1)) {
        ifChildren.push(...[
          { componentType: 'string', state: { value: ' or ' } },
          {
            componentType: 'ref', children: [
              { componentType: 'reftarget', state: { refTargetName: componentName } },
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
              { componentType: 'if', children: ifChildren }
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
      affectedBySugar: ["atLeastOneCompleteAward", "anyInlineComponents"],
      replacementFunction: replaceFromOneString,
    });


    let replaceFromOneMath = function ({ activeChildrenMatched, dependencyValues, idRng }) {
      // answer where only child is a math (other than activeChildren from properties)
      // create two activeChildren for the answer:
      // <mathinput/>
      // <award><if><ref prop="value">[themathinput]</ref>=[originalMath]</if></award>

      let componentName = createUniqueName("mathinput", idRng)

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
                componentType: 'if', children: [
                  {
                    componentType: 'ref', children: [
                      { componentType: 'reftarget', state: { refTargetName: componentName } },
                      { componentType: 'prop', state: { variableName: "value" } }
                    ]
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
      affectedBySugar: ["atLeastOneCompleteAward", "anyInlineComponents"],
      replacementFunction: replaceFromOneMath,
    });


    let replaceFromOneText = function ({ activeChildrenMatched, dependencyValues, idRng }) {
      // answer where only child is a text (other than activeChildren from properties)
      // create two activeChildren for the answer:
      // <textinput/>
      // <award><if><ref prop="value">[thetextinput]</ref>=[originaltext]</if></award>

      let componentName = createUniqueName("textinput", idRng)

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
                componentType: 'if', children: [
                  {
                    componentType: 'ref', children: [
                      { componentType: 'reftarget', state: { refTargetName: componentName } },
                      { componentType: 'prop', state: { variableName: "value" } }
                    ]
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
      affectedBySugar: ["atLeastOneCompleteAward", "anyInlineComponents"],

      replacementFunction: replaceFromOneText,
    });


    let replaceFromJustChoices = function ({ activeChildrenMatched, idRng }) {
      // answer where only children are choices (other than activeChildren from properties)
      // wrap choices in a choiceinput
      // and for each choice
      // create an award of the form
      // <award><credit>[creditfromchoice]</credit>
      //   <if><ref prop="selectedindex">[thechoiceinput]</ref>=[indexofchoice]</if>
      // </award>
      // also determine inline based on inline property of answer

      let choiceComponents = activeChildrenMatched.map(x => ({
        createdComponent: true,
        componentName: x.componentName
      }));

      let componentName = createUniqueName("choiceinput", idRng)

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

    let atLeastOneChoice = childLogic.newLeaf({
      name: "atLeastOneChoice",
      componentType: 'choice',
      comparison: 'atLeast',
      number: 1,
      isSugar: true,
      affectedBySugar: ["anyInlineComponents"],
      replacementFunction: replaceFromJustChoices,
    });


    let replaceFromIncompleteAwards = function ({ activeChildrenMatched, dependencyValues, idRng }) {
      // answer where only activeChildren (other than from properties) are incomplete awards
      // (meaning awards with a <string> child rather than an <if> child)
      // create an input and replace the <string> child of each award with
      // <if><ref prop="value">[theinput]</ref>=<defaultType>[originalString]</type></if>


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

      let componentName = createUniqueName(inputType, idRng)

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
      for (let award of dependencyValues.incompleteAwards) {
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
            let breakFunction = breakStringsAndOthersIntoComponentsByStringCommas(x => ({
              componentType: typeForStrings,
              children: x
            }));
            let breakResults = breakFunction({ activeChildrenMatched: [award.stateValues.childForIncomplete] })

            if (breakResults.success) {
              childrenForEquals = breakResults.newChildren;
              toDelete = breakResults.toDelete;
            }

          }
        }

        let ifChildren = [
          {
            componentType: 'ref', children: [
              { componentType: 'reftarget', state: { refTargetName: componentName } },
              { componentType: 'prop', state: { variableName: "value" } }
            ]
          },
          { componentType: 'string', state: { value: '=' } },
          childrenForEquals[0]
        ];

        for (let child of childrenForEquals.slice(1)) {
          ifChildren.push(...[
            { componentType: 'string', state: { value: ' or ' } },
            {
              componentType: 'ref', children: [
                { componentType: 'reftarget', state: { refTargetName: componentName } },
                { componentType: 'prop', state: { variableName: "value" } }
              ]
            },
            { componentType: 'string', state: { value: '=' } },
            child
          ])
        }

        let newIf = { componentType: 'if', children: ifChildren };
        newAwardChildren.push(newIf);

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
      affectedBySugar: ["atLeastOneCompleteAward", "anyInlineComponents"],
      replacementFunction: replaceFromIncompleteAwards,
      condition: awardIsIncomplete,
    });


    let awardIsComplete = function (child) {
      // TODO: we don't know if stateVariable incomplete is resolved!
      // We need a way to defer until it is resolved....
      return (child.stateValues.incomplete !== true);
    }

    let atLeastOneCompleteAward = childLogic.newLeaf({
      name: "atLeastOneCompleteAward",
      componentType: 'award',
      comparison: 'atLeast',
      number: 1,
      condition: awardIsComplete,
    });

    let incompleteXorCompleteAwards = childLogic.newOperator({
      name: "incompleteXorCompleteAwards",
      operator: 'xor',
      propositions: [atLeastOneIncompleteAward, atLeastOneCompleteAward]
    });

    let anyBlockComponents = childLogic.newLeaf({
      name: "anyBlockComponents",
      componentType: '_block',
      comparison: 'atLeast',
      number: 0,
    });

    let anyInlineComponents = childLogic.newLeaf({
      name: "anyInlineComponents",
      componentType: '_inline',
      comparison: 'atLeast',
      number: 0,
    });

    let anyBlockOrInlineComponents = childLogic.newOperator({
      name: "anyBlockOrInlineComponents",
      operator: 'and',
      propositions: [anyBlockComponents, anyInlineComponents]
    });

    let awardsWithOptionalComponents = childLogic.newOperator({
      name: "awardsWithOptionalComponents",
      operator: 'and',
      propositions: [incompleteXorCompleteAwards, anyBlockOrInlineComponents]
    });

    let anyBlockComponentsForNoAward = childLogic.newLeaf({
      name: "anyBlockComponentsForNoAward",
      componentType: '_block',
      comparison: 'atLeast',
      number: 0,
    });

    let anyInlineComponentsForNoAward = childLogic.newLeaf({
      name: "anyInlineComponentsForNoAward",
      componentType: '_inline',
      comparison: 'atLeast',
      number: 0,
    });

    let noAward = childLogic.newLeaf({
      name: "noAward",
      componentType: 'award',
      comparison: 'exactly',
      number: 0,
      allowSpillover: false,
    });

    let anyBlockOrInlineComponentsWithNoAward = childLogic.newOperator({
      name: "anyBlockOrInlineComponentsWithNoAward",
      operator: 'and',
      propositions: [noAward, anyBlockComponentsForNoAward, anyInlineComponentsForNoAward]
    });

    childLogic.newOperator({
      name: "completeXorSugared",
      operator: 'xor',
      propositions: [
        awardsWithOptionalComponents,
        exactlyOneString,
        exactlyOneMath,
        exactlyOneText,
        atLeastOneChoice,
        anyBlockOrInlineComponentsWithNoAward
      ],
      setAsBase: true,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.inputDescendants = {
      returnDependencies: () => ({
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        },
        inputDescendants: {
          dependencyType: "descendantStateVariables",
          componentTypes: ["_input"],
          variableNames: ["componentType", "value", "values",
            "selectedIndices", "creditAchievedIfSubmit"],
          variablesOptional: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: { inputDescendants: dependencyValues.inputDescendants }
        }
      }
    }

    stateVariableDefinitions.currentResponses = {
      public: true,
      isArray: true,
      entryPrefixes: ["currentResponse"],
      defaultEntryValue: '\uFF3F',
      returnDependencies: () => ({
        inputDescendants: {
          dependencyType: "stateVariable",
          variableName: "inputDescendants"
        },
      }),
      definition: function ({ dependencyValues, arrayKeys }) {

        let componentType = dependencyValues.inputDescendants.map(x => x.stateValues.componentType);

        let currentResponses = {};

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        let numberValuesSoFar = 0;
        let matchedArrayKey = false;

        for (let [inputNumber, inputDescendant] of dependencyValues.inputDescendants.entries()) {

          let values;
          // if have a values state variable that is an array
          // then each component is considered a response
          if (Array.isArray(inputDescendant.stateValues.values)) {
            values = inputDescendant.stateValues.values
          } else {
            values = [inputDescendant.stateValues.value];
          }

          for (let [ind, value] of values.entries()) {
            let valueKey = String(numberValuesSoFar + ind);
            if (arrayKey === valueKey || arrayKey === undefined) {
              currentResponses[valueKey] = value;
              if (arrayKey !== undefined) {
                componentType = componentType[inputNumber];
                matchedArrayKey = true;
              }
            }
          }

          numberValuesSoFar += values.length;

        }

        if (arrayKey !== undefined && !matchedArrayKey) {
          componentType = [];
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

    stateVariableDefinitions.submittedResponses = {
      public: true,
      isArray: true,
      entryPrefixes: ["submittedResponse"],
      defaultEntryValue: '\uFF3F',
      returnDependencies: () => ({
        inputDescendants: {
          dependencyType: "stateVariable",
          variableName: "inputDescendants"
        },
      }),
      definition: function ({ dependencyValues, arrayKeys, freshByKey }) {

        let componentType = dependencyValues.inputDescendants.map(x => x.stateValues.componentType);

        let essentialSubmittedResponses = {};

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        for (let ind in componentType) {
          // Note: ind is a string, starting with "0"

          // Note: since we never unset freshByKey (there is no markStale function)
          // this function doesn't return anything once the values are set for the first time
          // (The values will just be changed using the inverse function)
          if (!freshByKey[ind]) {
            if (arrayKey === ind || arrayKey === undefined) {
              essentialSubmittedResponses[ind] = {
                variablesToCheck: [
                  { variableName: "submittedResponses", arrayIndex: ind }
                ],
              }
            }
          }

        }

        // if this is second pass through (i.e., freshByKey was set)
        // then don't change anything
        // (For array state variables, don't need to return noChanges)
        if (Object.keys(essentialSubmittedResponses).length === 0) {
          return {}
        }

        if (arrayKey !== undefined) {
          if (arrayKey in componentType) {
            componentType = componentType[arrayKey];
          } else {
            componentType = [];
          }
        }

        return {
          useEssentialOrDefaultValue: {
            submittedResponses: essentialSubmittedResponses,
          },
          setComponentType: { submittedResponses: componentType },
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues }) {
        let instructions = [];

        for (let [ind, value] of desiredStateVariableValues.submittedResponses.entries()) {
          instructions.push({
            setStateVariable: "submittedResponses",
            arrayKey: ind,
            value
          })
        }
        return {
          success: true,
          instructions
        };
      }
    }

    stateVariableDefinitions.submittedResponse = {
      isAlias: true,
      targetVariableName: "submittedResponse1"
    };

    stateVariableDefinitions.delegateCheckWork = {
      forRenderer: true,
      returnDependencies: () => ({
        inputDescendants: {
          dependencyType: "stateVariable",
          variableName: "inputDescendants"
        },
        forceFullCheckworkButton: {
          dependencyType: "stateVariable",
          variableName: "forceFullCheckworkButton"
        }
      }),
      definition: function ({ dependencyValues }) {
        let delegateCheckWork = dependencyValues.inputDescendants.length === 1 &&
          !dependencyValues.forceFullCheckworkButton;
        return { newValues: { delegateCheckWork } };
      }
    }

    stateVariableDefinitions.creditAchievedIfSubmit = {
      additionalStateVariablesDefined: ["awardUsedIfSubmit", "awardChildren"],
      returnDependencies: () => ({
        awardChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastOneCompleteAward",
          variableNames: ["credit", "creditAchieved", "fractionSatisfied"]
        },
        inputDescendants: {
          dependencyType: "stateVariable",
          variableName: "inputDescendants"
        },
      }),
      definition: function ({ dependencyValues }) {

        let creditAchieved = 0;
        let awardUsed = "";

        if (dependencyValues.awardChildren.length === 0) {
          if (dependencyValues.inputDescendants.length === 1) {
            let inputDescendant = dependencyValues.inputDescendants[0];
            // if inputDescendant has a state variable creditAchievedIfSubmit
            // that is a positive number, use that value
            if (inputDescendant.stateValues.creditAchievedIfSubmit > 0) {
              creditAchieved = inputDescendant.stateValues.creditAchievedIfSubmit;
            }
          }
        } else {
          // awardUsed with be component name of first award
          // that gives the maximum credit (which will be creditAchieved)
          // Always process awards if creditAchieved is still zero in case want to
          // use an award with credit=0 to trigger feedback
          for (let child of dependencyValues.awardChildren) {
            let childMaxCredit = Math.max(0, Math.min(1, child.stateValues.credit))
            if (childMaxCredit > creditAchieved || creditAchieved === 0) {
              let creditFromChild = child.stateValues.creditAchieved;
              let fractionFromChild = child.stateValues.fractionSatisfied;
              if (fractionFromChild > 0 && (creditFromChild > creditAchieved || awardUsed === "")) {
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
            awardChildren: dependencyValues.awardChildren
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
      definition: ({ dependencyValues }) => ({
        newValues: {
          creditAchievedDependencies: dependencyValues.currentCreditAchievedDependencies
        }
      }),
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
      entryPrefixes: ["feedback"],
      returnDependencies: () => ({
        awardChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastOneCompleteAward",
          variableNames: ["feedbacks"]
        },
        inputDescendants: {
          dependencyType: "descendantStateVariables",
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
        for (let inputDescendant of dependencyValues.inputDescendants) {
          if (Array.isArray(inputDescendant.stateValues.feedbacks)) {
            feedbacks.push(...inputDescendant.stateValues.feedbacks)
          }
        }
        return {
          newValues: {
            feedbacks
          }
        }
      }
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        blockOrInlineChildren: {
          dependencyType: "childIdentity",
          childLogicName: "anyBlockOrInlineComponents"
        },
        anyBlockOrInlineComponentsWithNoAward: {
          dependencyType: "childIdentity",
          childLogicName: "anyBlockOrInlineComponentsWithNoAward"
        },
      }),
      definition: function ({ dependencyValues }) {
        let childrenToRender = [
          ...dependencyValues.blockOrInlineChildren.map(x => x.componentName),
          ...dependencyValues.anyBlockOrInlineComponentsWithNoAward.map(x => x.componentName)
        ]
        return {
          newValues: { childrenToRender }
        }
      }
    }



    return stateVariableDefinitions;
  }

  updateState(args = {}) {
    if (args.init === true) {

      this.makePublicStateVariableArray({
        variableName: "feedbacks",
        componentType: "feedback",
        returnSerializedComponents: returnSerializedComponentsFeedback,
        emptyForOutOfBounds: true,
      });

      if (this._state.creditAchieved.essential !== true) {
        this.state.creditAchieved = 0;
      }
      this._state.creditAchieved.essential = true;

    }


    if (childrenChanged) {
      let awardInds = this.childLogic.returnMatches("atLeastOneCompleteAward");
      this.state.awardChildren = awardInds.map(x => this.activeChildren[x]);
    }



    this.additionalComponentsToUpdate = [];
    for (let input of this.descendantsFound._input) {
      if (input.state.justSubmitted
        != this.state.justSubmitted) {
        this.additionalComponentsToUpdate.push(input.componentName);
      }
    }
    if (this.additionalComponentsToUpdate.length === 0) {
      delete this.additionalComponentsToUpdate;
    }


  }



  actions = {
    submitAnswer: this.submitAnswer.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
  }

  submitAnswer() {

    let creditAchieved = this.stateValues.creditAchievedIfSubmit;
    let awardUsed = this.stateValues.awardUsedIfSubmit;

    // request to update credit
    let instructions = [{
      componentName: this.componentName,
      stateVariable: "creditAchieved",
      value: creditAchieved,
    }, {
      componentName: this.componentName,
      stateVariable: "responseHasBeenSubmitted",
      value: true
    }];

    // request to update the submittedvalue of each input
    // and also gather submitted value into own submittedResponses array
    let submittedResponses = [];

    // if have a single input descendant,
    // then will set its creditAchieved state variable
    let creditAchievedForInput = 0;
    if (this.stateValues.inputDescendants.length === 1) {
      creditAchievedForInput = creditAchieved;
    }

    for (let input of this.stateValues.inputDescendants) {
      instructions.push({
        componentName: input.componentName,
        stateVariable: "creditAchieved",
        value: creditAchievedForInput,
      });

      if (input.componentType === "choiceinput") {
        instructions.push({
          componentName: input.componentName,
          stateVariable: "submittedIndices",
          value: input.stateValues.selectedIndices
        })
        submittedResponses.push(...input.stateValues.values);
      } else {
        instructions.push({
          componentName: input.componentName,
          stateVariable: "submittedValue",
          value: input.stateValues.value,
        });
        submittedResponses.push(input.stateValues.value);
      }
    }

    // add submitted responses to instruction for answer
    instructions.push({
      componentName: this.componentName,
      stateVariable: "submittedResponses",
      value: submittedResponses
    })

    instructions.push({
      componentName: this.componentName,
      stateVariable: "creditAchievedDependenciesAtSubmit",
      value: this.stateValues.creditAchievedDependencies
    })

    for (let child of this.stateValues.awardChildren) {
      let awarded = child.componentName === awardUsed;
      instructions.push({
        componentName: child.componentName,
        stateVariable: "awarded",
        value: awarded
      });
    }

    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: instructions
    })

    // let documentComponentName = this.ancestors[this.ancestors.length - 1].componentName;

    // // NOTE: if change this so don't have a request update with just document
    // // need to change code that triggers an immediate at the end of requestUpdate in core
    // this.requestUpdate({
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

  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    const actions = {
      submitAnswer: this.submitAnswer,
    }

    this.renderer = new this.availableRenderers.answer({
      actions: actions,
      key: this.componentName,
      includeCheckWork: !this.stateValues.delegateCheckWork,
      creditAchieved: this.stateValues.creditAchieved,
      valuesAsSubmitted: this.stateValues.justSubmitted,
      showCorrectness: this.flags.showCorrectness,
    });
  }

  updateRenderer() {
    this.renderer.updateAnswerRenderer({
      creditAchieved: this.stateValues.creditAchieved,
      valuesAsSubmitted: this.stateValues.justSubmitted,
    });

  }

}



// return the JSON representing the portion of array determined by the given propChildren
function returnSerializedComponentsFeedback({
  stateVariable, variableName,
  propChildren, propName,
  componentName,
}) {

  function returnSerializedFeedback(index) {
    return {
      componentType: "ref",
      children: [
        {
          componentType: "prop",
          state: { variableName: "feedback" }
        },
        {
          componentType: "reftarget",
          state: { refTargetName: stateVariable.value[index] }
        }
      ],
      downstreamDependencies: {
        [componentName]: [{
          dependencyType: "referenceShadow",
          prop: propName,
        }]
      },
    }
  }

  if (propChildren === undefined || propChildren.length === 0) {
    let numComponents = stateVariable.value.length;
    let newComponents = [];
    for (let index = 0; index < numComponents; index++) {
      newComponents.push(returnSerializedFeedback(index));
    }
    return newComponents;
  } else {
    let numComponents = stateVariable.value.length;
    let index = propChildren[0].state.number;

    // already know index is a non-negative integer
    // else would have failed validateParameters

    let outOfBounds = index >= numComponents;
    if (outOfBounds) {
      return [];
    }
    let newComponents = [returnSerializedFeedback(index)];

    return newComponents;

  }
}
