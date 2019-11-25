import InlineComponent from './abstract/InlineComponent';
import { breakStringsAndOthersIntoComponentsByStringCommas } from './commonsugar/breakstrings';

export default class Answer extends InlineComponent {
  static componentType = "answer";

  static previewSerializedComponent({ serializedComponent, sharedParameters, components }) {
    if (serializedComponent.children === undefined) {
      return;
    }

    let typeInd;
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "type" || (
        child.createdComponent && components[child.componentName].componentType === "type"
      )) {
        typeInd = ind;
        break;
      }
    }

    let inlineInd;
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "inline" || (
        child.createdComponent && components[child.componentName].componentType === "inline"
      )) {
        inlineInd = ind;
        break;
      }
    }

    let splitintooptionsInd;
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "splitintooptions" || (
        child.createdComponent && components[child.componentName].componentType === "splitintooptions"
      )) {
        splitintooptionsInd = ind;
        break;
      }
    }

    let fixedorderInd;
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "fixedorder" || (
        child.createdComponent && components[child.componentName].componentType === "fixedorder"
      )) {
        fixedorderInd = ind;
        break;
      }
    }

    let sizeInd;
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "size" || (
        child.createdComponent && components[child.componentName].componentType === "size"
      )) {
        sizeInd = ind;
        break;
      }
    }


    let creationInstructions = [];

    if (typeInd !== undefined) {
      creationInstructions.push({ createChildren: [typeInd] });
    }
    if (inlineInd !== undefined) {
      creationInstructions.push({ createChildren: [inlineInd] });
    }
    if (splitintooptionsInd !== undefined) {
      creationInstructions.push({ createChildren: [splitintooptionsInd] });
    }
    if (fixedorderInd !== undefined) {
      creationInstructions.push({ createChildren: [fixedorderInd] });
    }
    if (sizeInd !== undefined) {
      creationInstructions.push({ createChildren: [sizeInd] });
    }
    creationInstructions.push({ callMethod: "setUpTypeInlineSplitSize" })

    return creationInstructions;

  }

  static setUpTypeInlineSplitSize({ sharedParameters, definingChildrenSoFar, serializedComponent }) {
    let typeChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "type") {
        typeChild = child;
        break;
      }
    }

    if (typeChild !== undefined) {
      // have a type child, so will get type from that child
      // once it is resolved
      sharedParameters.typeChild = typeChild;
    } else if (serializedComponent.state !== undefined && "type" in serializedComponent.state) {
      // type was specified directly via essential state variable
      sharedParameters.type = serializedComponent.state.type;
    }

    let inlineChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "inline") {
        inlineChild = child;
        break;
      }
    }

    if (inlineChild !== undefined) {
      // have a inline child, so will get inline from that child
      // once it is resolved
      sharedParameters.inlineChild = inlineChild;
    } else if (serializedComponent.state !== undefined && "inline" in serializedComponent.state) {
      // inline was specified directly via essential state variable
      sharedParameters.inline = serializedComponent.state.inline;
    }

    let splitintooptionsChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "splitintooptions") {
        splitintooptionsChild = child;
        break;
      }
    }

    if (splitintooptionsChild !== undefined) {
      // have a splitintooptions child, so will get options from that child
      // once it is resolved
      sharedParameters.splitintooptionsChild = splitintooptionsChild;
    } else if (serializedComponent.state !== undefined && "splitintooptions" in serializedComponent.state) {
      // splitintooptions was specified directly via essential state variable
      sharedParameters.splitintooptions = serializedComponent.state.splitintooptions;
    }

    let fixedorderChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "fixedorder") {
        fixedorderChild = child;
        break;
      }
    }

    if (fixedorderChild !== undefined) {
      // have a fixedorder child, so will get options from that child
      // once it is resolved
      sharedParameters.fixedorderChild = fixedorderChild;
    } else if (serializedComponent.state !== undefined && "fixedorder" in serializedComponent.state) {
      // fixedorder was specified directly via essential state variable
      sharedParameters.fixedorder = serializedComponent.state.fixedorder;
    }

    let sizeChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "size") {
        sizeChild = child;
        break;
      }
    }

    if (sizeChild !== undefined) {
      // have a size child, so will get size from that child
      // once it is resolved
      sharedParameters.sizeChild = sizeChild;
    } else if (serializedComponent.state !== undefined && "size" in serializedComponent.state) {
      // size was specified directly via essential state variable
      sharedParameters.size = serializedComponent.state.size;
    }

  }

  static createPropertiesObject({ standardComponentTypes }) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.weight = { default: 1 };
    properties.inline = { default: false };
    properties.type = { default: "math" };
    properties.splitintooptions = { default: false };
    properties.fixedorder = { default: false };
    properties.size = { default: undefined };
    properties.forcefullcheckworkbutton = { default: false };
    return properties;
  }

  static returnChildLogic({ standardComponentTypes, allComponentClasses, components,
    sharedParameters }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    function determineType() {
      let typeChild = sharedParameters.typeChild;
      if (typeChild !== undefined) {
        if (typeChild.unresolvedState.value) {
          sharedParameters.type = undefined;
          return { success: false }
        } else {
          sharedParameters.type = typeChild.state.value;
          if (!sharedParameters.type) {
            return { success: false };
          }
        }
      } else if (!sharedParameters.type) {
        sharedParameters.type = "math";
      }
      return { success: true };
    }

    let replaceFromOneString = function ({ activeChildrenMatched, components }) {
      // answer where only child is a string (other than activeChildren from properties)
      // create two activeChildren for the answer:
      // <[defaultype]input/>
      // <award><if><ref prop="value">[theinput]</ref>=<[type]>[originalString]</[type]></if></award>

      let status = determineType();

      if (!status.success) {
        return status;
      }

      let inputType;
      if (sharedParameters.type === "math") {
        inputType = "mathinput";
      } else if (sharedParameters.type === "text") {
        inputType = "textinput";
      } else {
        console.warn(`Invalid type ${sharedParameters.type} for answer`);
        return { success: false };
      }

      let splitintooptionsChild = sharedParameters.splitintooptionsChild;
      if (splitintooptionsChild !== undefined) {
        if (splitintooptionsChild.unresolvedState.value) {
          sharedParameters.splitintooptions = undefined;
          return { success: false }
        } else {
          sharedParameters.splitintooptions = splitintooptionsChild.state.value;
          if (sharedParameters.splitintooptions === undefined) {
            return { success: false };
          }
        }
      } else if (sharedParameters.splitintooptions === undefined) {
        sharedParameters.splitintooptions = false;
      }

      let sizeChild = sharedParameters.sizeChild;
      if (sizeChild !== undefined) {
        if (sizeChild.unresolvedState.value) {
          sharedParameters.size = undefined;
          return { success: false }
        } else {
          sharedParameters.size = sizeChild.state.value;
          if (sharedParameters.size === undefined) {
            return { success: false };
          }
        }
      }

      let toDelete = [];
      let childrenForEquals = [{
        componentType: sharedParameters.type, children: [
          {
            createdComponent: true,
            componentName: activeChildrenMatched[0].componentName
          }
        ]
      }];

      if (sharedParameters.splitintooptions) {
        let breakFunction = breakStringsAndOthersIntoComponentsByStringCommas(x => ({
          componentType: sharedParameters.type,
          children: x
        }));
        let breakResults = breakFunction({ activeChildrenMatched: activeChildrenMatched })

        if (breakResults.success) {
          childrenForEquals = breakResults.newChildren;
          toDelete = breakResults.toDelete;
        }
      }

      let sugarInd = 1;
      let componentName = '_answer_' + inputType + sugarInd;

      while (componentName in components) {
        sugarInd++;
        componentName = '_answer_' + inputType + sugarInd;
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

      let inputChild = {
        componentType: inputType,
        doenetAttributes: { componentName: componentName },
        children: []
      };

      if (sharedParameters.size) {
        inputChild.state = { size: sharedParameters.size }
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
      replacementFunction: replaceFromOneString,
    });


    let replaceFromOneMath = function ({ activeChildrenMatched, components }) {
      // answer where only child is a math (other than activeChildren from properties)
      // create two activeChildren for the answer:
      // <mathinput/>
      // <award><if><ref prop="value">[themathinput]</ref>=[originalMath]</if></award>

      let sizeChild = sharedParameters.sizeChild;
      if (sizeChild !== undefined) {
        if (sizeChild.unresolvedState.value) {
          sharedParameters.size = undefined;
          return { success: false }
        } else {
          sharedParameters.size = sizeChild.state.value;
          if (sharedParameters.size === undefined) {
            return { success: false };
          }
        }
      }

      let sugarInd = 1;
      let componentName = '_answer_mathinput' + sugarInd;

      while (componentName in components) {
        sugarInd++;
        componentName = '_answer_mathinput' + sugarInd;
      }

      let inputChild = {
        componentType: 'mathinput',
        doenetAttributes: { componentName: componentName },
        children: []
      };

      if (sharedParameters.size) {
        inputChild.state = { size: sharedParameters.size }
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
      replacementFunction: replaceFromOneMath,
    });


    let replaceFromOneText = function ({ activeChildrenMatched, components }) {
      // answer where only child is a text (other than activeChildren from properties)
      // create two activeChildren for the answer:
      // <textinput/>
      // <award><if><ref prop="value">[thetextinput]</ref>=[originaltext]</if></award>

      let sizeChild = sharedParameters.sizeChild;
      if (sizeChild !== undefined) {
        if (sizeChild.unresolvedState.value) {
          sharedParameters.size = undefined;
          return { success: false }
        } else {
          sharedParameters.size = sizeChild.state.value;
          if (sharedParameters.size === undefined) {
            return { success: false };
          }
        }
      }

      let sugarInd = 1;
      let componentName = '_answer_textinput' + sugarInd;

      while (componentName in components) {
        sugarInd++;
        componentName = '_answer_textinput' + sugarInd;
      }


      let inputChild = {
        componentType: 'textinput',
        doenetAttributes: { componentName: componentName },
        children: []
      };

      if (sharedParameters.size) {
        inputChild.state = { size: sharedParameters.size }
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
      replacementFunction: replaceFromOneText,
    });


    let replaceFromOneChoiceinput = function ({ activeChildrenMatched, components }) {
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
            state: { useReplacementsWhenSerialize: true }
          }
        ]
      };

    }

    let exactlyOneChoiceinput = childLogic.newLeaf({
      name: "exactlyOneChoiceinput",
      componentType: 'choiceinput',
      number: 1,
      isSugar: true,
      replacementFunction: replaceFromOneChoiceinput,
    });

    let replaceFromJustChoices = function ({ activeChildrenMatched, components }) {
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

      let sugarInd = 1;
      let componentName = '_answer_choiceinput' + sugarInd;

      while (componentName in components) {
        sugarInd++;
        componentName = '_answer_choiceinput' + sugarInd;
      }

      let choiceinputComponent = {
        componentType: "choiceinput",
        doenetAttributes: { componentName: componentName },
        children: choiceComponents,
      };

      if (sharedParameters.inlineChild) {
        choiceinputComponent.children.push({
          componentType: "ref",
          children: [{
            componentType: "reftarget",
            state: { refTargetName: sharedParameters.inlineChild.componentName }
          }]
        })
      } else if (sharedParameters.inline !== undefined) {
        choiceComponents.state = { inline: sharedParameters.inline }
      }

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
            state: { useReplacementsWhenSerialize: true }
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
      replacementFunction: replaceFromJustChoices,
    });


    let replaceFromIncompleteAwards = function ({ activeChildrenMatched, components }) {
      // answer where only activeChildren (other than from properties) are incomplete awards
      // (meaning awards with a <string> child rather than an <if> child)
      // create an input and replace the <string> child of each award with
      // <if><ref prop="value">[theinput]</ref>=<defaultype>[originalString]</type></if>


      // if all award have that aren't string have same incomplete type,
      // use that type


      let incompleteType;
      for(let award of activeChildrenMatched) {
        let newType = award.state.incompleteType;
        if(newType !== "string") {
          if(incompleteType === undefined) {
            incompleteType = newType;
          } else if(incompleteType !== newType) {
            // award of different types, so don't use this to determine type
            incompleteType = undefined;
            break;
          }
        }
      }

      let inputType;
      let typeForStrings;

      if(incompleteType !== undefined) {
        typeForStrings = incompleteType;
        inputType = incompleteType + "input";
      } else {
        let status = determineType();

        if (!status.success) {
          return status;
        }

        if (sharedParameters.type === "math") {
          inputType = "mathinput";
        } else if (sharedParameters.type === "text") {
          inputType = "textinput";
        } else {
          console.warn(`Invalid type ${sharedParameters.type} for answer`);
          return { success: false };
        }

        typeForStrings = sharedParameters.type;
      }

      let sizeChild = sharedParameters.sizeChild;
      if (sizeChild !== undefined) {
        if (sizeChild.unresolvedState.value) {
          sharedParameters.size = undefined;
          return { success: false }
        } else {
          sharedParameters.size = sizeChild.state.value;
          if (sharedParameters.size === undefined) {
            return { success: false };
          }
        }
      }

      let sugarInd = 1;
      let componentName = '_answer_' + inputType + sugarInd;

      while (componentName in components) {
        sugarInd++;
        componentName = '_answer_' + inputType + sugarInd;
      }


      let inputChild = {
        componentType: inputType,
        doenetAttributes: { componentName: componentName },
        children: []
      };

      if (sharedParameters.size) {
        inputChild.state = { size: sharedParameters.size }
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
          componentName: award.state.childForIncomplete.componentName
        }];

        if (award.state.incompleteType === 'string') {

          childrenForEquals = [{
            componentType: typeForStrings, children: childrenForEquals
          }];

          if (award.state.splitintooptions) {
            let breakFunction = breakStringsAndOthersIntoComponentsByStringCommas(x => ({
              componentType: typeForStrings,
              children: x
            }));
            let breakResults = breakFunction({ activeChildrenMatched: [award.state.childForIncomplete] })

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
          activeChildrenMatched: [award.state.childForIncomplete],
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
      return (child.state.incomplete === true);
    }

    let atLeastOneIncompleteAward = childLogic.newLeaf({
      name: "atLeastOneIncompleteAward",
      componentType: 'award',
      comparison: 'atLeast',
      number: 1,
      isSugar: true,
      replacementFunction: replaceFromIncompleteAwards,
      condition: awardIsIncomplete,
    });


    let awardIsComplete = function (child) {
      return (child.state.incomplete !== true);
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

    let anyBlockOrInlinecomponents = childLogic.newOperator({
      name: "anyBlockOrInlinecomponents",
      operator: 'and',
      propositions: [anyBlockComponents, anyInlineComponents]
    });

    let awardsWithOptionalComponents = childLogic.newOperator({
      name: "awardsWithOptionalComponents",
      operator: 'and',
      propositions: [incompleteXorCompleteAwards, anyBlockOrInlinecomponents]
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

  updateState(args = {}) {
    if (args.init === true) {
      this.makePublicStateVariable({
        variableName: "creditachieved",
        componentType: "number"
      });

      this.makePublicStateVariableArray({
        variableName: "submittedresponses",
        componentType: [],
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "submittedresponse",
        arrayVariableName: "submittedresponses",
      })
      this.makePublicStateVariableAlias({
        variableName: "submittedresponse",
        targetName: "submittedresponse",
        arrayIndex: '1',
      });

      this.makePublicStateVariable({
        variableName: "responsehasbeensubmitted",
        componentType: "boolean",
      })

      this.makePublicStateVariableArray({
        variableName: "feedbacks",
        componentType: "feedback",
        returnSerializedComponents: returnSerializedComponentsFeedback,
        emptyForOutOfBounds: true,
      });

      if (this._state.creditachieved.essential !== true) {
        this.state.creditachieved = 0;
      }
      this._state.creditachieved.essential = true;

      if (this._state.responsehasbeensubmitted.essential !== true) {
        this.state.responsehasbeensubmitted = false;
      }
      this._state.responsehasbeensubmitted.essential = true;

      if(this.state.allAwardsJustSubmitted === undefined) {
        this._state.allAwardsJustSubmitted = { essential: true};
      }

      if(this.state.inputRendererValuesAsSubmitted === undefined) {
        this._state.inputRendererValuesAsSubmitted = { essential: true};
      }

      this.submitAnswer = this.submitAnswer.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      );
    }

    super.updateState(args);

    if (!this.childLogicSatisfied) {
      this.unresolvedState.creditachieved = true;
      this.unresolvedState.submittedresponses = true;
      return;
    }

    delete this.unresolvedState.creditachieved;
    delete this.unresolvedState.submittedresponses;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {
      let awardInds = this.childLogic.returnMatches("atLeastOneCompleteAward");
      this.state.awardChildren = awardInds.map(x => this.activeChildren[x]);
    }

    // determine component types of inputs for submittedresponses variable
    // simultaneously check if all input renderers have the same value
    // as was last submitted
    this._state.submittedresponses.componentType = [];
    this.state.inputRendererValuesAsSubmitted = true;
    for (let input of this.descendantsFound._input) {
      if (input.componentType === "choiceinput") {
        for (let value of input.state.selectedvalues) {
          this._state.submittedresponses.componentType.push(input._state.selectedvalues.componentType)
        }
      } else {
        this._state.submittedresponses.componentType.push(input._state.value.componentType);
      }
      if (!input.state.rendererValueAsSubmitted) {
        this.state.inputRendererValuesAsSubmitted = false;
      }
    }
    if (this.descendantsFound._input.length === 1 && !this.state.forcefullcheckworkbutton) {
      this.state.delegateCheckWork = true;
      this.state.singleInputDescendant = this.descendantsFound._input[0]
    } else {
      this.state.delegateCheckWork = false;
      delete this._state.singleInputDescendant;
    }
    if (this._state.submittedresponses.essential !== true) {
      // first time that get to here
      // (if didn't have submitted responses initially supplied via essential)
      // populate submittedresponses with array of blanks with size matching the number of inputs
      this.state.submittedresponses = Array(this.descendantsFound._input.length).fill('\uFF3F')
      this._state.submittedresponses.essential = true;
    }

    // determine if awards have ifs that have just been submitted
    this.state.allAwardsJustSubmitted = true;
    for (let award of this.state.awardChildren) {
      if (!award.state.justSubmitted) {
        this.state.allAwardsJustSubmitted = false;
      }
    }

    this.additionalComponentsToUpdate = [];
    for (let input of this.descendantsFound._input) {
      if (input.state.allAwardsJustSubmitted
        != this.state.allAwardsJustSubmitted) {
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

  get descendantSearchClasses() {
    return ["_input"];
  }

  calculatecreditachieved() {
    let creditachieved = 0;
    let awardUsed = "";

    // awardUsed with be component name of first award
    // that gives the maximum credit (which will be creditachieved)
    // Always process awards if creditachieved is still zero in case want to
    // use an award with credit=0 to trigger feedback
    for (let child of this.state.awardChildren) {
      let childMaxCredit = Math.max(0, Math.min(1, child.state.credit))
      if (childMaxCredit > creditachieved || creditachieved === 0) {
        let results = child.determineCredit();
        let creditFromChild = results.creditachieved;
        let fractionFromChild = results.fractionsatisfied;
        if (fractionFromChild > 0 && (creditFromChild > creditachieved || awardUsed === "")) {
          creditachieved = creditFromChild;
          awardUsed = child.componentName;
        }
      }
    }
    return {
      creditachieved: creditachieved,
      awardUsed: awardUsed,
    };
  }

  submitAnswer() {

    let { creditachieved, awardUsed } = this.calculatecreditachieved();

    // request to update credit
    let instructions = [{
      componentName: this.componentName,
      variableUpdates: {
        creditachieved: { changes: creditachieved },
        responsehasbeensubmitted: { changes: true },
      }
    }];

    // request to update the submittedvalue of each input
    // and also gather submitted value into own submittedresponses array
    let submittedresponses = [];

    // if have a single input descendant,
    // then will set its creditachieved state variable
    let creditAchievedForInput = creditachieved;
    if (this.state.singleInputDescendant === undefined) {
      creditAchievedForInput = 0;
    }

    for (let input of this.descendantsFound._input) {
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
            numbertimessubmitted: { changes: input.state.numbertimessubmitted + 1 },
            creditachieved: { changes: creditAchievedForInput },
            rendererValueAsSubmitted: { changes: true }
          }
        })
        for (let value of input.state.selectedvalues) {
          submittedresponses.push(value);
        }
      } else {
        instructions.push({
          componentName: input.componentName,
          variableUpdates: {
            submittedvalue: { changes: input.state.value },
            numbertimessubmitted: { changes: input.state.numbertimessubmitted + 1 },
            creditachieved: { changes: creditAchievedForInput },
            rendererValueAsSubmitted: { changes: true }
          }
        })
        submittedresponses.push(input.state.value);
      }
    }

    // add submitted responses to instruction for answer
    instructions[0].variableUpdates.submittedresponses = {
      isArray: true,
      changes: { arrayComponents: submittedresponses }
    };

    for (let child of this.state.awardChildren) {
      let awarded = child.componentName === awardUsed;
      instructions.push({
        componentName: child.componentName,
        variableUpdates: {
          awarded: { changes: awarded },
          justSubmitted: { changes: true },
        }
      });

      // also let each <if> of award know that they were just submitted
      let ifChildInd = child.childLogic.returnMatches("exactlyOneIf");
      if (ifChildInd.length === 1) {
        let ifChild = child.activeChildren[ifChildInd[0]];
        instructions.push({
          componentName: ifChild.componentName,
          variableUpdates: {
            justSubmitted: { changes: true },
          }
        });
      }
    }

    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: instructions
    })

    let documentComponentName = this.ancestors[this.ancestors.length - 1];

    // NOTE: if change this so don't have a request update with just document
    // need to change code that triggers an immediate at the end of requestUpdate in core
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: documentComponentName,
        variableUpdates: {
          submissionNumber: { changes: documentComponent.state.previousSubmissionNumber + 1 },
          submittedAnswerComponentName: { changes: this.componentName }
        }
      }]
    })

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
      includeCheckWork: !this.state.delegateCheckWork,
      creditachieved: this.state.creditachieved,
      valuesAsSubmitted: this.state.inputRendererValuesAsSubmitted && this.state.allAwardsJustSubmitted,
      showCorrectness: this.flags.showCorrectness,
    });
  }

  updateRenderer() {
    this.renderer.updateAnswerRenderer({
      creditachieved: this.state.creditachieved,
      valuesAsSubmitted: this.state.inputRendererValuesAsSubmitted && this.state.allAwardsJustSubmitted,
    });

  }

  updateChildrenWhoRender() {
    if (this.childLogicSatisfied) {
      let blockOrInlineInds = this.childLogic.returnMatches("anyBlockOrInlinecomponents");
      this.childrenWhoRender = blockOrInlineInds.map(x => this.activeChildren[x].componentName);
    }
  }

  allowDownstreamUpdates(status) {
    // don't allow non-initial changes
    // this means a reference to an answer won't work
    // TODO: what should happen if reference an answer (with no props)
    return (status.initialChange === true);
  }

  get variablesUpdatableDownstream() {
    // for now, only know how to change our own creditachieved and submittedresponses
    return ["creditachieved", "submittedresponses", "responsehasbeensubmitted"];
  }

  calculateDownstreamChanges({ stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate }) {

    // even though we haven't yet allowed references to change answer,
    // if this answer is a reference, we need to try to propagate change to source
    // so that the attempted change will fail
    // and hence disallow the change
    let newStateVariables = {};
    if ("creditachieved" in stateVariablesToUpdate) {
      newStateVariables.creditachieved = stateVariablesToUpdate.creditachieved;
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
        [componentName]: {
          dependencyType: "referenceShadow",
          prop: propName,
        }
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
