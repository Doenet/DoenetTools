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
    properties.fixedOrder = { default: false };
    properties.size = { default: null, propagateToDescendants: true };
    properties.forceFullCheckworkButton = { default: false };
    properties.expandOnCompare = { default: false, propagateToDescendants: true };
    properties.simplifyOnCompare = {
      default: "none",
      toLowerCase: true,
      valueTransformations: { "": "full", "true": "full" },
      validValues: new Set(["full", "numbers", "numbersepreserveorder", "none"]),
      propagateToDescendants: true,
    };
    properties.unorderedCompare = { default: false, propagateToDescendants: true };

    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);


    let replaceFromOneString = function ({ activeChildrenMatched, dependencyValues, idRng }) {
      // answer where only child is a string (other than activeChildren from properties)
      // create two activeChildren for the answer:
      // <[defaultType]input/>
      // <award><if><ref prop="value">[theinput]</ref>=<[type]>[originalString]</[type]></if></award>

      let inputType;
      if (dependencyValues.type === "math") {
        inputType = "mathinput";
      } else if (dependencyValues.type === "text") {
        inputType = "textinput";
      } else {
        console.warn(`Invalid type ${dependencyValues.type} for answer`);
        return { success: false };
      }

      let toDelete = [];
      let childrenForEquals = [{
        componentType: dependencyValues.type, children: [
          {
            createdComponent: true,
            componentName: activeChildrenMatched[0].componentName
          }
        ]
      }];

      if (dependencyValues.splitIntoOptions) {
        let breakFunction = breakStringsAndOthersIntoComponentsByStringCommas(x => ({
          componentType: dependencyValues.type,
          children: x
        }));
        let breakResults = breakFunction({ activeChildrenMatched: activeChildrenMatched })

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
            { componentType: 'prop', children: [{ componentType: "string", state: { value: "value" } }] }
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
              { componentType: 'prop', children: [{ componentType: "string", state: { value: "value" } }] }
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
      sugarDependencies: {
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
        }
      },
      affectedBySugar: ["atLeastOneCompleteAward", "anyInlineComponents"],
      replacementFunction: replaceFromOneString,
    });


    let replaceFromOneMath = function ({ activeChildrenMatched, dependencyValues, idRng }) {
      // answer where only child is a math (other than activeChildren from properties)
      // create two activeChildren for the answer:
      // <mathinput/>
      // <award><if><ref prop="value">[themathinput]</ref>=[originalMath]</if></award>

      let componentName = createUniqueName(inputType, idRng)

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
      sugarDependencies: {
        size: {
          dependencyType: "stateVariable",
          variableName: "size"
        }
      },
      affectedBySugar: ["atLeastOneCompleteAward", "anyInlineComponents"],
      replacementFunction: replaceFromOneMath,
    });


    let replaceFromOneText = function ({ activeChildrenMatched, dependencyValues, idRng }) {
      // answer where only child is a text (other than activeChildren from properties)
      // create two activeChildren for the answer:
      // <textinput/>
      // <award><if><ref prop="value">[thetextinput]</ref>=[originaltext]</if></award>

      let componentName = createUniqueName(inputType, idRng)

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
      sugarDependencies: {
        size: {
          dependencyType: "stateVariable",
          variableName: "size"
        }
      },
      affectedBySugar: ["atLeastOneCompleteAward", "anyInlineComponents"],

      replacementFunction: replaceFromOneText,
    });


    let replaceFromOneChoiceinput = function ({ activeChildrenMatched }) {
      // answer where only child is a choiceinput (other than activeChildren from properties)
      // for each choice of choiceinput
      // create an award of the form
      // <award><credit>[creditfromchoice]</credit>
      //   <if><ref prop="selectedindex">[thechoiceinput]</ref>=[indexofchoice]</if>
      // </award>

      let choiceinput = activeChildrenMatched[0];

      return {
        success: true,
        newChildren: [
          {
            createdComponent: true,
            componentName: choiceinput.componentName
          },
          {
            componentType: "ref",
            children: [
              {
                componentType: "reftarget",
                state: { refTargetName: choiceinput.componentName }
              },
              {
                componentType: "prop",
                state: { variableName: "awards" }
              }
            ],
            // state: { useReplacementsWhenSerialize: true }
          }
        ]
      };

    }

    let exactlyOneChoiceinput = childLogic.newLeaf({
      name: "exactlyOneChoiceinput",
      componentType: 'choiceinput',
      number: 1,
      isSugar: true,
      affectedBySugar: ["atLeastOneCompleteAward", "anyInlineComponents"],
      replacementFunction: replaceFromOneChoiceinput,
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
          {
            componentType: "ref",
            children: [
              {
                componentType: "reftarget",
                state: { refTargetName: componentName }
              },
              {
                componentType: "prop",
                state: { variableName: "awards" }
              }
            ],
            // state: { useReplacementsWhenSerialize: true }
          }
        ]
      };

    }

    let atLeastOneChoice = childLogic.newLeaf({
      name: "atLeastOneChoice",
      componentType: 'choice',
      comparison: 'atLeast',
      number: 1,
      isSugar: true,
      affectedBySugar: ["atLeastOneCompleteAward", "anyInlineComponents"],
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
      for (let award of activeChildrenMatched) {
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
          console.warn(`Invalid type ${dependencyValues.type} for answer`);
          return { success: false };
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
      for (let award of activeChildrenMatched) {
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
      return (child.stateValues.incomplete === true);
    }

    let atLeastOneIncompleteAward = childLogic.newLeaf({
      name: "atLeastOneIncompleteAward",
      componentType: 'award',
      comparison: 'atLeast',
      number: 1,
      isSugar: true,
      sugarDependencies: {
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        size: {
          dependencyType: "stateVariable",
          variableName: "size"
        }
      },
      affectedBySugar: ["atLeastOneCompleteAward", "anyInlineComponents"],
      replacementFunction: replaceFromIncompleteAwards,
      condition: awardIsIncomplete,
    });


    let awardIsComplete = function (child) {
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

    childLogic.newOperator({
      name: "completeXorSugared",
      operator: 'xor',
      propositions: [
        awardsWithOptionalComponents,
        exactlyOneString,
        exactlyOneMath,
        exactlyOneText,
        exactlyOneChoiceinput,
        atLeastOneChoice,
      ],
      setAsBase: true,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.inputDescendants = {
      returnDependencies: () => ({
        inputDescendants: {
          dependencyType: "descendantStateVariables",
          componentTypes: ["_input"],
          variableNames: ["componentTypes", "value",
            "numberTimesSubmitted"]
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: { inputDescendants: dependencyValues.inputDescendants }
        }
      }
    }

    stateVariableDefinitions.submittedResponses = {
      public: true,
      isArray: true,
      entryPrefixes: ["submittedResponse"],
      returnDependencies: () => ({
        inputDescendants: {
          dependencyType: "stateVariable",
          variableName: "inputDescendants"
        },
      }),
      definition: function ({ dependencyValues }) {
        let componentType = [];

        for (let input of dependencyValues.inputDescendants) {
          componentType.push(...input.stateValues.componentTypes)
        }
        return {
          useEssentialOrDefaultValue: {
            submittedResponses: {
              variablesToCheck: "submittedResponses",
              get defaultValue() {
                return Array(dependencyValues.inputDescendants.length).fill('\uFF3F')
              }
            },
          },
          setComponentType: componentType,
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "submittedResponses",
            value: desiredStateVariableValues.submittedResponses
          }]
        };
      }
    }

    stateVariableDefinitions.submittedResponse = {
      isAlias: true,
      targetVariableName: "submittedResponse1"
    };

    stateVariableDefinitions.delegateCheckWork = {
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
        }
      }),
      definition: function ({ dependencyValues }) {

        let creditAchieved = 0;
        let awardUsed = "";

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
          variableName: "creditAchievedIfSubmit"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          creditAchievedDependencies: dependencyValues.currentCreditAchievedDependencies
        }
      }),
    }


    stateVariableDefinitions.creditAchievedDependenciesAtSubmit = {
      defaultValue: {},
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

    stateVariableDefinitions.inputRendererValuesAsSubmitted = {
      returnDependencies: () => ({
        inputDescendants: {
          dependencyType: "descendantStateVariables",
          componentTypes: ["_input"],
          variableNames: ["rendererValueAsSubmitted"]
        },
      }),
      definition: function ({ dependencyValues }) {
        let inputRendererValuesAsSubmitted = dependencyValues.inputDescendants.every(
          x => x.stateValues.rendererValueAsSubmitted
        )

        return { newValues: { inputRendererValuesAsSubmitted } }
      }
    }

    stateVariableDefinitions.justSubmitted = {
      returnDependencies: () => ({
        currentCreditAchievedDependencies: {
          dependencyType: "recursiveDependencyValues",
          variableName: "creditAchievedIfSubmit"
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

    stateVariableDefinitions.childrenWhoRender = {
      returnDependencies: () => ({
        blockOrInlineChildren: {
          dependencyType: "childIdentity",
          childLogicName: "anyBlockOrInlineComponents"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            childrenWhoRender: dependencyValues.blockOrInlineChildren.map(x => x.componentName)
          }
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

      if (this._state.responsehasbeensubmitted.essential !== true) {
        this.state.responsehasbeensubmitted = false;
      }
      this._state.responsehasbeensubmitted.essential = true;


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

    this.state.feedbacks = this.state.awardChildren
      .filter(x => x.state.feedback.length === 1)
      .map(x => x.componentName);

  }


  calculatecreditachieved() {

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
      if (input.componentType === "choiceinput") {
        let submittedIndicesArrayComponents = {};
        let submittedOriginalIndicesArrayComponents = {};
        let submittedValuesArrayComponents = {};
        for (let i in input.state.selectedindices) {
          submittedIndicesArrayComponents[i] = input.state.selectedindices[i];
          submittedOriginalIndicesArrayComponents[i] = input.state.choiceOrder[input.state.selectedindices[i] - 1] + 1;
          submittedValuesArrayComponents[i] = input.state.choicetexts[input.state.selectedindices[i] - 1];
        }
        submittedIndicesArrayComponents.length = input.state.selectedindices.length;
        submittedOriginalIndicesArrayComponents.length = input.state.selectedindices.length;
        submittedValuesArrayComponents.length = input.state.selectedindices.length;
        instructions.push({
          componentName: input.componentName,
          variableUpdates: {
            submittedindices: { changes: { arrayComponents: submittedIndicesArrayComponents } },
            submittedoriginalindices: { changes: { arrayComponents: submittedOriginalIndicesArrayComponents } },
            submittedvalues: { changes: { arrayComponents: submittedValuesArrayComponents } },
            numberTimesSubmitted: { changes: input.state.numberTimesSubmitted + 1 },
            creditAchieved: { changes: creditAchievedForInput },
            rendererValueAsSubmitted: { changes: true }
          }
        })
        for (let value of input.state.selectedvalues) {
          submittedResponses.push(value);
        }
      } else {
        instructions.push({
          componentName: input.componentName,
          stateVariable: "submittedValue",
          value: input.stateValues.value,
        });
        instructions.push({
          componentName: input.componentName,
          stateVariable: "numberTimesSubmitted",
          value: input.stateValues.numberTimesSubmitted + 1,
        });
        instructions.push({
          componentName: input.componentName,
          stateVariable: "creditAchieved",
          value: creditAchievedForInput,
        });

        instructions.push({
          componentName: input.componentName,
          stateVariable: "rendererValueAsSubmitted",
          value: true,
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
      // instructions.push({
      //   componentName: child.componentName,
      //   stateVariable: "justSubmitted",
      //   value: true
      // });

      // also let each <if> of award know that they were just submitted
      // if (child.stateValues.ifChild !== undefined) {
      //   instructions.push({
      //     componentName: child.stateValues.ifChild.componentName,
      //     stateVariable: "justSubmitted",
      //     value: true,
      //   });
      // }
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
      valuesAsSubmitted: this.stateValues.inputRendererValuesAsSubmitted && this.stateValues.justSubmitted,
      showCorrectness: this.flags.showCorrectness,
    });
  }

  updateRenderer() {
    this.renderer.updateAnswerRenderer({
      creditAchieved: this.stateValues.creditAchieved,
      valuesAsSubmitted: this.stateValues.inputRendererValuesAsSubmitted && this.stateValues.justSubmitted,
    });

  }



  allowDownstreamUpdates(status) {
    // don't allow non-initial changes
    // this means a reference to an answer won't work
    // TODO: what should happen if reference an answer (with no props)
    return (status.initialChange === true);
  }

  get variablesUpdatableDownstream() {
    // for now, only know how to change our own creditAchieved and submittedresponses
    return ["creditAchieved", "submittedresponses", "responsehasbeensubmitted"];
  }

  calculateDownstreamChanges({ stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate }) {

    // even though we haven't yet allowed references to change answer,
    // if this answer is a reference, we need to try to propagate change to source
    // so that the attempted change will fail
    // and hence disallow the change
    let newStateVariables = {};
    if ("creditAchieved" in stateVariablesToUpdate) {
      newStateVariables.creditAchieved = stateVariablesToUpdate.creditAchieved;
    }
    if ("submittedresponses" in stateVariablesToUpdate) {
      newStateVariables.submittedresponses = stateVariablesToUpdate.submittedresponses;
    }
    if ("responsehasbeensubmitted" in stateVariablesToUpdate) {
      newStateVariables.responsehasbeensubmitted = stateVariablesToUpdate.responsehasbeensubmitted;
    }
    let shadowedResult = this.updateShadowSources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // even though haven't yet allowed references to trigger updates
    // include logic to be consistent and in case we change it later
    for (let varname in newStateVariables) {
      if (this._state[varname].essential === true &&
        !shadowedStateVariables.has(varname)// && !isReplacement
      ) {
        stateVariableChangesToSave[varname] = newStateVariables[varname];
      }
    }

    return true;

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
